---
title: "AI Infra 进阶：如何让大模型输出确定的结果"
date: "2026-08-05"
source: "腾讯程序员（binnnliu）"
url: "https://mp.weixin.qq.com/s/YRwGxVsO93M0-2bupN-bqQ"
---

# AI Infra 进阶：如何让大模型输出确定的结果

> 同样的硬件、同样的提示词，为什么大模型每次输出不一样？根因不在于信息干扰，而在于推理引擎底层的动态组批与算子调度策略引发了浮点加法的顺序变化，而浮点加法不满足结合律。

![封面](images/llm-batch-invariance/001.gif.png)

作者：binnnliu（腾讯程序员）

## 背景

跟大模型对话，同样的提示词每次结果都不一样——这符合「大模型的本质就是个猜词器」的一贯认知。

然而，**可重复性是科学进步的基石**。让大模型输出完全确定的结果是一个非常值得研究的问题，特别是强化学习需要确定性的 Rollout，来保证实验的可复现性和训练过程的稳定性。

> Reproducibility is a bedrock of scientific progress.

直觉上，把 Temperature 设为 0、锁死随机数种子（Seed），是不是就能保证每次输出一样？答案是：**是也不是。**

- **是（Run-to-run 确定性）**：同一时间，没有其他请求时，多次同样的提示词请求，回答是一样的
- **不是（Batch Invariance / 批次不变性）**：同一时间，有其他请求时，多次同样的提示词请求，回答是不一样的

不同的请求间会相互影响？不可能——不同请求间的注意力机制是严格物理隔离的，不存在上下文污染。

**根源是：推理引擎底层的动态组批与算子调度策略引发了浮点加法的顺序变化，而浮点加法不满足结合律：`(a + b) + c ≠ a + (b + c)`。**

从系统设计的角度来看，导致结果波动的根本原因，不在于信息干扰，而在于系统为了掩盖访存延迟，在底层触发了**非确定性的硬件级并行优化（Non-deterministic Hardware-level Parallel Optimizations）**。

![浮点加法不满足结合律](images/llm-batch-invariance/002.png)

### 浮点数的本质

相对于定点数，浮点数的本质是科学计数法，主要是为了在有限的位数内（如仅仅 16 bit 或 32 bit），实现动态的数值范围与绝对精度间的 trade-off。绝对精度（即步长）的计算公式为：`ULP(x) = 2^(E-M)`，其中 E 是该浮点数的真实指数，M 是尾数位数。

根据 IEEE 754 标准，FP16 包含 1bit 符号位、5bit 指数位和 10bit 尾数位。当数值为 2048（即 2^11）时，相邻可表示数之间的步长（ULP）增至 2，这意味着 FP16 的下一个可表示数为 2050，无法精确表示 2049。当底层硬件执行 `2048 + 1` 时，运算器内部会借助更宽的 GRS 扩展位得出精确结果 2049。但当结果需要写回 10 位尾数时，由于 2049 恰好位于 2048 与 2050 的正中间，系统触发了向偶数舍入（Round to Nearest, ties to Even）的规则，最终结果被强行舍入回 2048。

![FP16 精度示意](images/llm-batch-invariance/003.png)

![FP16 二进制表示](images/llm-batch-invariance/004.png)

![ULP 示意](images/llm-batch-invariance/005.png)

## GEMM 的 Batch Invariance

### GEMM 的优化策略

要理解这个问题，必须要先理解内存墙下 GPU GEMM 算子的演进路线。核心原因在于：现代 GPU 的计算单元（Tensor Core）算力增长太猛，远远甩开了显存带宽的增速。GPU 大部分时间都在等数据搬运，这就是所谓的**内存墙（Memory Wall）**。

![GPU 算力 vs 带宽](images/llm-batch-invariance/006.png)

### Tiling — 分块矩阵乘法

单纯按公式逐个元素计算，每次乘加运算都需要从极其缓慢的全局显存（HBM）中读取数据，完全没有利用到片上高速缓存（SRAM/共享内存）和寄存器。

![逐元素计算的低效](images/llm-batch-invariance/007.png)

业界演化出了 **IO-Aware（I/O 感知）的分块算法**：化整为零，将大矩阵切分成适合放入缓存的小块。调度时，将每个 CTA（Cooperative Thread Array）与结果矩阵 C 的一个特定小块 Cij 绑定，让该 CTA 全权负责这个小块的计算。

![Tiling 分块策略](images/llm-batch-invariance/008.png)

一个 CTA 负责计算 Cij 的完整数据流转逻辑：

1. **初始化累加器**：分配寄存器，专门用于存放目标分块 Cij 的中间累加结果
2. **沿 K 维度规约**：在每一个步长（Step）内执行以下流水线：
   - **Load（HBM → SRAM）**：将子块 Aip 和 Bpj 从全局显存批量搬运到共享内存
   - **MMA（Tensor Core 计算）**：各 Warp 从 SRAM 提取数据至寄存器，执行矩阵乘法
   - **Accumulate**：将本轮结果就地与寄存器中的累加器相加，不写回显存
3. **收尾与写回（Epilogue）**：K 维度循环跑完后，将最终结果写回全局显存

![CTA 数据流转](images/llm-batch-invariance/009.png)
![流水线执行](images/llm-batch-invariance/010.png)

### Split-K

当 K 维度极其庞大、输出矩阵 C（M 和 N 维度）非常小时，GPU 硬件调度器只会拉起少数 CTA。一块 NVIDIA H100 拥有 132 个 SM，大量 SM 空闲等待。

**Split-K** 的核心思想：打破单个 CTA 独自计算整个 K 维度的逻辑，把 K 维度切分成多段，让多个不同的 CTA 同时处理同一个 Cij 块在不同 K 片段上的局部乘积累加。

![Split-K 策略](images/llm-batch-invariance/011.png)

- **BLOCK_K** 是时间上的串行，同一个 CTA 每次从全局显存搬运 BLOCK_K 大小的数据
- **SPLIT_K** 是空间上的并行，强行把任务分发给物理上独立的多个 CTA 同时计算

两种实现方式：
1. **Atomic Add**：直接将结果原子加到目标位置（竞争激烈，SPLIT_K 太大收益递减）
2. **Workspace Reduction**：先在 HBM 中分配 `[split_k, M, N]` 临时缓冲区，主 Kernel 执行完毕后，再启动独立的轻量级规约 Kernel 沿 split_k 维度相加

### GROUP_M — Swizzle L2 Cache

通过约束 CTA 在矩阵 C 中的调度顺序，避免跨度过大的离散内存访问导致的 L2 Cache 抖动。它将多个独立的 CTA 重新组合成 `GROUP_SIZE_M × N` 的宏观调度矩阵，让被调度的 CTA 集中处理空间上相邻的输出块，共享已加载至 L2 Cache 中的矩阵 A 和 B 的数据，最大化 L2 Cache 的复用率。

![Swizzle L2 Cache](images/llm-batch-invariance/012.png)

### 算子调优：CUDA vs Triton

| | CUDA | Triton |
|---|---|---|
| 编程范式 | 以线程为中心（显式定义 `<<<grid, block>>>`） | 以 Tiling/Block 为中心，通过 `@triton.autotune` 自动调优 |
| 抽象层次 | 开发者需要手动实现各种底层优化 | 接近 Python 的生产力，接近 CUDA C++ 专家级性能 |
| 自动调优 | 无 | 运行时自动基准测试，智能选出最优参数组合 |

![CUDA vs Triton](images/llm-batch-invariance/013.png)
![PyTorch Inductor + Triton 流程](images/llm-batch-invariance/014.png)

### 调优 Trade-Off

以 Llama-3-8B Fused QKV 为例（hidden_size=4096，qkv_proj_size=6144，M=num_sched_tokens, N=6144, K=4096）：

| 参数 | 优化的硬件目标 | Trade-Off |
|------|--------------|-----------|
| BLOCK_M / BLOCK_N | 共享内存 (SMEM) | 太大→Register Spilling，性能雪崩 |
| BLOCK_K | 共享内存 (SMEM) | 影响累加树拓扑 |
| num_warps | 寄存器 + 并发度 | 太小→Register Spilling；太大→Occupancy 暴跌 |
| num_stages | 全局显存 (HBM) 延迟掩盖 | 太大会导致 SMEM 溢出 |
| GROUP_M (Swizzle) | 二级缓存 (L2 Cache) | 提高 L2 复用率 |
| SPLIT_K | 流多处理器 (SM) 算力利用率 | 仅在 M/N 极小、K 极大时开启 |

### Batch Invariance 的来源

| 参数 | 对 Batch Invariance 的影响 |
|------|--------------------------|
| BLOCK_M / BLOCK_N | **无影响**（仅空间维度任务映射） |
| GROUP_M / Swizzle | **无影响**（改变 CTA 调度顺序，不干涉分块内部累加） |
| BLOCK_K | **引入确定性误差**（改变累加树拓扑，但同一 BLOCK_K 结果恒定） |
| **SPLIT_K** | **引入非确定性误差**（GPU 硬件调度线程块顺序完全随机） |
| num_stages / num_warps | **无影响**（硬件资源分配与流水线调度，不改变点积逻辑） |

**结论：为了追求极致的访存复用（动态调整 BLOCK_K）与提升 SM 并发利用率（动态开启 SPLIT_K），底层的启发式调度策略不可避免地改变了浮点运算的 Reduction Tree 拓扑。**

### vLLM 中 GEMM 的 Batch Invariance 支持

GEMM 执行路径取决于三个维度的组合：
1. **硬件架构**：SM80（Ampere）与 SM90/SM100（Hopper/Blackwell）的 GEMM 执行范式截然不同
2. **数据精度**：bf16/fp16 由 cuBLASLt 承接；fp8/fp4 转向 CUTLASS/DeepGEMM
3. **算子入口**：nn.Linear 走 vLLM dispatch；裸 torch.mm/bmm 走 PyTorch dispatcher → cuBLAS/cuBLASLt

![GEMM 执行路径](images/llm-batch-invariance/015.jpeg)

#### SM80 与 SM90/SM100 的范式差异

| | SM80 (Ampere) | SM90/SM100 (Hopper/Blackwell) |
|---|---|---|
| 计算范式 | Warp 级 Tensor Core（mma.sync） | TMA 硬件单元 + WGMMA 指令（128 线程 Warp Group） |
| 延迟掩盖 | 提高占用率，warp 同时负责搬运和计算 | Asynchronous Pipelining（异步流水线） |

![SM80 vs SM90/100](images/llm-batch-invariance/016.png)
![TMA + WGMMA](images/llm-batch-invariance/017.png)

**SM80**：需要同时锁定 **BLOCK_K 和 SPLIT_K**。cuBLASLt 上不支持禁用 BLOCK_K，只能更换 Triton 实现（matmul_persistent），这是一个 fixed config 的 persistent kernel，彻底关掉 autotune。

**SM90/SM100**：代码注释明确说 *"the only source of batch variance is split-k"*。只需禁止 Split-K，通过 cuBLASLt 的 reduction mask 确保 `CUBLASLT_MATMUL_PREF_REDUCTION_SCHEME_MASK = CUBLASLT_REDUCTION_SCHEME_NONE`。

![SM90/100 路径](images/llm-batch-invariance/018.png)

![matmul_persistent](images/llm-batch-invariance/019.png)

![Split-K=1 配置](images/llm-batch-invariance/020.png)

> 关键澄清：`matmul_persistent` 没有实现 split-k，所以既不受 autotune 影响，也天然不存在 Split-K 乱序——真正被写死的只有 `BLOCK_K` 这一个变量。函数名里的 persistent 跟 batch invariance 无关，是说 grid 只开 min(NUM_SMS, tile 数)、每个 program 常驻 SM 循环吃多个 tile，是为了避免频繁 launch 开销。

## RMSNorm 的 Batch Invariance

### RMSNorm 均方根归一化

```
y = x / RMS(x) ⊙ γ
RMS(x) = √( (1/d) Σ xi² + ε )
```

输入 `[num_tokens, hidden_size]`，需要对于每个 token 的 hidden 做均方根归一化。要确保每个 token 的 hidden 分配到一个 thread block，避免跨 thread block 的同步。

![RMSNorm 公式](images/llm-batch-invariance/021.png)
![blockDim 分配](images/llm-batch-invariance/022.png)

**block_size 影响**：
1. 每个线程本地累加的元素分组
2. BlockReduce 树形归约的形状（层数、warp 分组）

→ 从而导致浮点数加法顺序发生变化。

![vLLM RMSNorm dispatch 表](images/llm-batch-invariance/023.png)

### vLLM 中 RMSNorm 的 Batch Invariance 支持

eager mode 下开启 Batch Invariance 时：
- 有 residual 的 CUDA `fused_add_rms_norm`：`blockDim = min(hidden, 1024)`，锁住 max_block_size 上限为 1024
- 无 residual 的 Triton `_rms_norm_kernel`：`BLOCK_SIZE = 1024`，不用 `@triton.autotune`

![eager mode 实现](images/llm-batch-invariance/024.png)

**编译场景下**：最反直觉的地方——默认逻辑还是走了 torch.compile 自动生成的 Triton kernel。

> "When PyTorch Inductor is used, 'none' is the default; otherwise 'all'."

在 TorchInductor 编译模式下，vLLM 的 CustomOp 默认禁用，RMSNorm 不走自定义 CUDA/Triton 实现，而是由 Inductor 对类型转换、平方、按最后一维求均值与权重乘法执行算子融合，生成单个 Triton 归约 kernel。

**关键机制**：
- 输入形状 `[num_tokens, hidden_size]`，归约沿最后一维（hidden_size，编译期静态常量）进行
- num_tokens 是并行维，各行相互独立、不参与彼此的归约
- 编译器可能触发 Split-Reduction 优化（类似 GEMM 的 Split-K），但 vLLM 默认 `hidden_size ≤ 8192`，`reduction_split_factor` 对该条件恒返回 1，归约保持单程（single-pass）

> ⚠️ 当 `hidden_size > 8192` 时，显式配置 `compile_ranges=[512]` 或 `compile_sizes=[N]` 会导致 Inductor Split-Reduction 发生变化，破坏算子级别的数值一致性。

### TorchCompileWithNoGuardsWrapper

从 JIT 到 AOT：在 PyTorch 2.11 的 JIT 机制下，计算图的运行强依赖 Shape Guard 进行合法性检查。但 LLM 推理场景中 Batch Size 频繁波动，易触碰边界条件触发在线重编译。

vLLM 引入 `TorchCompileWithNoGuardsWrapper` 结合 Piecewise Backend，实现纯 AOT（提前编译）派发：

- 预热阶段针对不同的张量形状区间提前生成多张预编译图
- 运行时主动拦截并丢弃底层所有的 Dynamo Guard 验证
- 由 vLLM 框架层根据输入形状，以纯静态的方式直接路由到对应的预编译图上

## Attention 的 Batch Invariance

### FlashAttention

![Attention 计算流程](images/llm-batch-invariance/025.png)
![FlashAttention 分块](images/llm-batch-invariance/026.png)
![FlashAttention Tiling](images/llm-batch-invariance/027.png)

FlashAttention 中，BLOCK_M 与 BLOCK_N 都是编译期常量，它们的取值只由 `(head_dim, causal/local, dtype, arch)` 决定，与 batch 和 seqlen 无关。

- **BLOCK_M** 影响多少个 Q 维度的 token 并发（query_len 维度），不应影响浮点加法顺序
- **BLOCK_N** 是 KV 维度的规约轴，会影响浮点加法顺序（本质上是 O=P×V 中的 BLOCK_K）
- 真正改变浮点加法顺序的是 **SplitKV / num_splits**：把 KV 规约轴切给多个 CTA 再由 combine 合并，规约树结构改变

### Chunked Prefill

FlashAttention 计算时，BLOCK_M 是对于 query_len 微观层面的切分；chunked prefill 则是对 query_len 宏观层面的切分。两者本质相同——**都沿 query 轴（M 轴）切、块间互不归约，所以都天然 batch-invariant-safe**。

![Chunked Prefill](images/llm-batch-invariance/028.png)

chunked prefill 的输出其实就是 FA kernel 的输入——chunk 大小即 kernel 拿到的 query_len。这个输入不仅影响几个 Q tile，还经 `num_m_blocks = ⌈query_len/64⌉` 影响 kernel 要不要 split-KV：
- chunk 大 → query_len 大 → 判「填满 SM」→ 不切 KV（prefill 常态，BI 友好）
- chunk 退化到 decode 的 1 → 可能触发 split-KV

### FlashDecoding — Split-KV

到了 decode 阶段，每步 query_len 退化为 1（M=1），而 seq_len (KV) 却可能极长。如果让一个 Q tile 独占一个 CTA、沿 KV 串行计算，batch 很小时只能拉起几个 CTA，绝大多数 SM 空转。

**FlashDecoding 的做法就是 Split-KV**：根据 `(batch, heads, seq_kv, num_sms)` 动态决定 num_splits，把一个 query 的 KV 区间切成 num_splits 段，交给多个 CTA 并行。

> num_splits 一变，LSE 合并时的规约拓扑就变，浮点加法顺序随之改变——于是又丢了 batch invariance。

### vLLM 中 Attention 的 Batch Invariance 支持

强制不拆 KV，即 `num_splits = 1`。vLLM 在 FlashAttention 后端里，只要开了 `VLLM_BATCH_INVARIANT` 就把 split 写死为 1。MLA 的 prefill/decode 路径同理。

![FlashDecoding Split-KV](images/llm-batch-invariance/029.png)

代价是 decode 小 batch 下 SM 利用率会下降——**「确定性 ↔ 吞吐」间的 trade-off 在 Attention 侧的又一次体现**。

## NCCL 的 Batch Invariance

随着模型参数量爆炸，单卡显存无法容纳时，系统需要引入模型并行。Tensor Parallelism (TP) 将单个矩阵乘法沿特定维度切分到多张 GPU 上——可以被视为一种跨设备的高维 Tiling。

![NCCL All-Reduce](images/llm-batch-invariance/030.png)
![TP Column/Row Parallelism](images/llm-batch-invariance/031.png)

一个 Transformer Block 通常包含两次同步：Attention 的 O_Proj 之后一次，MLP 的 Down_Proj 之后一次。每个 Row-Parallel Linear 本身只需要一次 All-Reduce。

**NCCL 并不保证跨不同 Batch Size 采用相同的规约算法**，因此规约顺序不一定保持不变。

### Ring vs Tree

| 算法 | 优势 | 劣势 |
|------|------|------|
| Ring All-Reduce（Reduce-Scatter + All-Gather） | 高吞吐 | 延迟随节点数线性增长 |
| Tree / Double Binary Tree | 低延迟 | 带宽利用率低 |

![Ring All-Reduce](images/llm-batch-invariance/032.png)
![Tree All-Reduce](images/llm-batch-invariance/033.png)

NCCL 在 communicator 初始化阶段根据硬件拓扑构造多种候选通信图，并在每次 collective 入队时，根据消息大小、rank 数、节点数选择预计代价最低的算法。

**LLM 推理动态组批中**，All-Reduce 的 Message Size 按 `[num_tokens, hidden_size]` 计算。Batch Size 的波动导致通信载荷跨越阈值时，NCCL 在底层切换规约拓扑：

- **Ring**：加法顺序线性（GPU0 → GPU1 → GPU2 → GPU3）
- **Tree**：加法顺序分治（(GPU0+GPU1) + (GPU2+GPU3)）

### Multi-Channel 切分

现代 GPU 节点内有多条物理互联链路（如多条 NVLink）。NCCL 为不同 Channel 分配结构或方向完全不同的规约拓扑：
- Channel 0 执行正向 Ring：`((GPU0+GPU1) + GPU2) + GPU3`
- Channel 1 执行逆向 Ring：`((GPU0+GPU3) + GPU2) + GPU1`

Batch Size 波动 → 总 Message Size 变化 → 数据切分边界动态滑动 → 同一数据被分配到不同 Channel 负责规约 → **Batch Variance**。

### vLLM 的 NCCL Batch Invariance 方案

开启 `VLLM_BATCH_INVARIANT=1` 后：

1. 禁用 Custom All-Reduce 和 symmetric-memory 路径
2. 将 NCCL All-Reduce 固定到 **Tree + Simple**
3. 将 Channel 数锁定为 **1**
4. 关闭 NVLS、CollNet 等可能引入其他规约拓扑的通信路径

> `NCCL_COLLNET_ENABLE=0` 禁止 CollNetDirect/CollNetChain；`NCCL_NVLS_ENABLE=0` 禁止 NVLink SHARP multicast/reduction

## 总结

大模型在推理过程中导致 **Batch Variance** 的根本原因，在于底层算子为最大化硬件资源利用率，动态调整了规约轴（如 GEMM 中的 Split-K、Attention 中的 KV 轴）的切分策略，进而改变了浮点数累加树的拓扑结构。若要实 Batch Invariance，就必须在算子调度层面约束此类动态切分行为。

| 算子 | 导致 Batch Variance 的参数 | vLLM 解决方案 |
|------|--------------------------|--------------|
| GEMM (SM80) | BLOCK_K + SPLIT_K | matmul_persistent（固定 BLOCK_K，禁用 autotune） |
| GEMM (SM90/100) | SPLIT_K | cuBLASLt reduction mask = NONE |
| RMSNorm | block_size 动态变化 | 锁定 block_size = 1024 |
| FlashAttention | Split-KV (num_splits) | 强制 num_splits = 1 |
| NCCL All-Reduce | 算法切换 + Multi-Channel 切分 | 固定 Tree+Simple，Channel=1，禁用 Custom AR/CollNet/NVLS |

![总结](images/llm-batch-invariance/034.png)

**核心矛盾**：所谓的 AI Infra，本质上是在多层技术抽象中，寻求系统性能与数学等价性之间的最优 Trade-off。工程实现远比直觉复杂——想要做到知其所以然，需要向下深入 GPU 物理微架构与算子执行范式（Triton/CUDA），向上解析框架层的计算图编译逻辑（Inductor/IR）。

![结语](images/llm-batch-invariance/035.gif)
![结语](images/llm-batch-invariance/036.png)

---

**References**

- [Defeating Nondeterminism in LLM Inference](https://www.thinkingmachines.ai/blog/defeating-nondeterminism)（Thinking Machines）
- [RFC vLLM IR: Batch Invariance Dispatching in vLLM IR](https://github.com/vllm-project/vllm/issues/40628)
- vLLM v0.25.1 Batch Invariance 实现
- [Fix batch invariance in RMSNorm kernels by pinning block size](https://github.com/vllm-project/vllm/pull/27931)
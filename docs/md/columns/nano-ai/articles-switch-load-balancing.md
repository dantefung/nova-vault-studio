---

title: "专家容量与负载均衡"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/switch-load-balancing/"

description: "大模型论文学习笔记。Switch Transformer 三篇解读：MoE 与单专家路由、专家容量与负载均衡，以及训练稳定性、实验结论与局限。"

---



# 专家容量与负载均衡




[Switch Transformer 论文研读 · EP02](/papers/#switch-transformer)




Expert Capacity & Load Balancing



> 上一期我们把 Transformer Block 里的 FFN 拆成了 N 个"专家"，再加一个 router，让每个 token 只选 1 个专家（Switch Transformer 的 top-1 routing）。参数量可以做得很大，但每个 token 的计算量几乎不变。

>

> 这一期要回答一个上期留下的问题：**router 自己决定把 token 发给谁，万一它总是发给同一个专家，怎么办？**



* * *



## 01先回顾：我们现在站在哪



EP1 的结构可以压缩成一行：





    x (T, d_model) → router → 每个 token 选 1 个专家 → 专家 FFN → 乘以 gate 值 → 输出 (T, d_model)





本期沿用"猫吃鱼"，并固定一组设定，方便手算：



项目 | 取值

---|---

序列 | 猫、吃、鱼（T = 3）

d_model | 4

专家数 N | 3（记作 E0、E1、E2）

路由方式 | top-1



Router 本质上就是一个线性层加 softmax，形状变化如下：





    x:        (3, 4)

    W_r:      (4, 3)

    logits:   (3, 3)    # 每个 token 对每个专家的打分

    probs:    (3, 3)    # softmax 之后，每行和为 1

    gate:     (3,)      # 每个 token 选中专家的概率（取行最大值）

    expert:   (3,)      # 每个 token 选中的专家编号（取行 argmax）





* * *



## 02问题：router 会"偏心"



### 2.1 一个正反馈循环



Router 是和专家一起训练的，没有人告诉它"该把哪类 token 发给谁"。于是会出现这样的循环：



  1. 训练初期，E0 碰巧多收到几个 token

  2. 收到的 token 多，E0 得到的梯度更新就多，学得更快，输出质量更好

  3. 输出质量好，主任务的 loss 降得更多，router 学到"选 E0 更划算"

  4. 下一轮 E0 收到更多 token……



最终结果是：少数几个专家承担了几乎所有流量，其余专家几乎得不到训练。你花了 N 倍的参数，实际只用了其中一小部分。



### 2.2 一个工程问题：硬件不接受"不均匀"



即使不考虑模型质量，不均匀本身在工程上也是问题。大规模训练时，不同专家放在不同的加速器上并行计算：



  * 一层的耗时由**最忙的那个专家** 决定，其余设备在空等

  * 加速器（比如 TPU）要求张量形状是静态的，每个专家要处理多少个 token，必须在编译时就确定



这两个问题，Switch Transformer 分别用两个机制来解决：



问题 | 机制 | 性质

---|---|---

硬件要求每个专家的处理量有上限 | Expert Capacity（专家容量） | 硬约束，兜底

模型训练出的路由本身不均匀 | Load Balancing Loss（负载均衡损失） | 软约束，治本



> **用后端的视角类比一下** ：router 是负载均衡器，专家是后端实例。Expert Capacity 相当于每个实例的并发上限，超了就限流；Load Balancing Loss 相当于让调度策略自己学会"别把请求都打到同一台机器"。只有限流没有均衡，会大量丢请求；只有均衡没有限流，一次突发流量就能压垮单个实例。两者是配合关系。



下面先讲兜底机制，再讲治本机制。



* * *



## 03Expert Capacity：每个专家最多接多少 token



### 3.1 公式



capacity=⌈TN×capacity_factor⌉ \text{capacity} = \left\lceil \frac{T}{N} \times \text{capacity\\_factor} \right\rceil



  * 
`T / N`
：如果所有 token 被**完美均分** ，每个专家应得的 token 数

  * 
`capacity_factor`
：容量因子，给"不完美"留出的缓冲。1.0 表示不留余量，1.25 表示多留 25%



> 注：论文没有细说小数怎么取整，本文代码统一向上取整。另外真实训练中，T 是**每个设备上一组 token 的数量** ，不是整个全局 batch。



### 3.2 猫吃鱼手算



设 capacity_factor = 1.0，则 capacity = ⌈3 / 3 × 1.0⌉ = **1** ，每个专家最多接 1 个 token。



假设 router 经过 softmax 之后给出下面的概率（为了手算方便，直接给出 softmax 之后的结果）：



token | E0 | E1 | E2 | 选中（argmax） | gate 值

---|---|---|---|---|---

猫 | **0.60** | 0.30 | 0.10 | E0 | 0.60

吃 | **0.50** | 0.30 | 0.20 | E0 | 0.50

鱼 | 0.20 | **0.55** | 0.25 | E1 | 0.55



注意：猫和吃都选了 E0，但 E0 容量只有 1。



### 3.3 溢出的 token 怎么办：Token Dropping



按 token 在序列中的位置先到先得：



  * 猫：排第 1，E0 接收

  * 吃：E0 已满，**被丢弃（dropped）**

  * 鱼：E1 空闲，接收



这里的"丢弃"不是把 token 删掉，而是**这个 token 在这一层不经过任何专家** ，直接走残差连接传到下一层。



回忆 EP6 的残差结构（本系列使用 Pre-LN）：





    x_out = x + MoE(LayerNorm(x))





被丢弃的 token，MoE 分支的输出相当于 0，所以：





    x_out = x + 0 = x





这就是残差连接在这里的另一个价值：**它给被丢弃的 token 留了一条退路** 。信息没有丢，只是这一层没得到专家的加工。



### 3.4 capacity_factor 的取舍



如果把 capacity_factor 调到 1.25，capacity = ⌈3 / 3 × 1.25⌉ = ⌈1.25⌉ = 2，E0 可以同时接收猫和吃，没有 token 被丢弃。



（这个例子因为 T 太小，向上取整放大了效果。真实场景下 T 很大，1.25 就是实打实的多出 25% 缓冲。）



capacity_factor | 优点 | 代价

---|---|---

小（接近 1.0） | 计算和显存开销小，通信量小 | 路由不均时丢 token 多

大（比如 2.0） | 丢 token 少 | 专家的张量按最大容量预留，大量位置是空的（padding），算力和通信被浪费



论文对不同容量因子做过对比，大致趋势是：容量因子越大，丢 token 越少，效果越好，但每步的计算和通信成本也越高，需要在速度和质量之间找平衡。



**所以光靠加大容量因子不是好办法。** 想让丢 token 的比例低，同时容量因子又不用太大，就要让路由本身尽量均匀。这就是下一节的内容。



* * *



## 04Load Balancing Loss：让 router 学会"均匀分发"



### 4.1 想要什么



我们希望加一个额外的损失项，当路由不均匀时它变大，均匀时它变小，让梯度下降顺手把 router 往均匀的方向推。



Switch Transformer 的做法是，对每个 Switch 层，统计两个量：



  * **f_i** ：实际被分配到专家 i 的 token 比例（用 argmax 的结果统计）

  * **P_i** ：router 分配给专家 i 的平均概率（对所有 token 的 softmax 概率取平均）



然后把它们相乘再求和：



Laux=α⋅N⋅∑i=1Nfi⋅Pi \mathcal{L}_{aux} = \alpha \cdot N \cdot \sum_{i=1}^{N} f_i \cdot P_i



其中 α 是系数，论文中取 0.01。



### 4.2 为什么要 f 和 P 两个量



这是整个设计里最巧妙的地方，值得多说两句。



  * **f_i 来自 argmax** ，是离散操作，**不可导** 。梯度传不过去

  * **P_i 来自 softmax 概率** ，是连续的，**可导**



只用 f，没有梯度，router 学不到东西。只用 P，则无法反映"实际分配"：可能每个专家的平均概率都是 1/3，但实际上 argmax 全都落在同一个专家上。



两者相乘后：



  * **f_i 充当权重** ：告诉优化器"专家 i 现在实际负载有多高"

  * **P_i 充当可导的抓手** ：梯度通过它回传给 router



直观理解：**谁的实际负载越高，谁的概率 P_i 受到的下压力就越大。**



### 4.3 最小值是多少



当路由完全均匀时，f_i = P_i = 1/N：



N⋅∑i=1N1N⋅1N=N⋅N⋅1N2=1 N \cdot \sum_{i=1}^{N} \frac{1}{N} \cdot \frac{1}{N} = N \cdot N \cdot \frac{1}{N^2} = 1



也就是说，乘上系数前，辅助损失的**最小值就是 1** （对应均匀分配）。路由越偏，这个值越大。乘上 α 之后，最小值是 α。



### 4.4 猫吃鱼手算



沿用 3.2 节的概率表。



**第一步：算 f** （实际分配比例）。猫、吃 → E0，鱼 → E1，E2 没有 token：





    f = [2/3, 1/3, 0] = [0.6667, 0.3333, 0.0000]





**第二步：算 P** （每个专家的平均概率，对每一列取平均）：





    P_0 = (0.60 + 0.50 + 0.20) / 3 = 0.4333

    P_1 = (0.30 + 0.30 + 0.55) / 3 = 0.3833

    P_2 = (0.10 + 0.20 + 0.25) / 3 = 0.1833





检查：0.4333 + 0.3833 + 0.1833 = 1.0 ✓



**第三步：算加权和**





    Σ f_i · P_i = 0.6667 × 0.4333 + 0.3333 × 0.3833 + 0 × 0.1833

                = 0.2889 + 0.1278 + 0

                = 0.4167





**第四步：乘 N 和 α**





    N · Σ f_i · P_i = 3 × 0.4167 = 1.25

    L_aux = 0.01 × 1.25 = 0.0125





对比完全均匀时的 1.0（乘 α 后是 0.01），1.25 说明当前路由偏了。



### 4.5 梯度往哪个方向推



对 P_i 求偏导，因为 L = α · N · Σ f_i · P_i，所以：



∂Laux∂Pi=α⋅N⋅fi \frac{\partial \mathcal{L}_{aux}}{\partial P_i} = \alpha \cdot N \cdot f_i



代入数值（α = 0.01，N = 3）：



专家 | f_i | ∂L/∂P_i

---|---|---

E0 | 0.6667 | 0.02

E1 | 0.3333 | 0.01

E2 | 0.0000 | 0



梯度下降是往梯度的反方向走（回忆训练篇 EP1、EP3）：



  * E0 的梯度最大 → P_0 被压得最狠

  * E1 的梯度次之 → P_1 被压一点

  * E2 的梯度为 0 → 辅助损失不直接去压它



这里有一个容易想错的点：**E2 的概率不是被辅助损失直接"推高"的** 。它之所以会上升，是因为 softmax 的概率和为 1，P_0 和 P_1 被压下去之后，多出来的概率质量自然流向了其他专家，其中就包括 E2。



### 4.6 α 为什么是 0.01



α 是两个目标之间的平衡：



  * 太小：均衡约束太弱，路由还是会偏

  * 太大：辅助损失压过主任务（语言建模的交叉熵），为了"均匀"而牺牲了"选对专家"



论文中的说法是，0.01 既足够大，能保证负载均衡，又足够小，不会压过主任务的交叉熵。



最终训练的总损失是：





    total_loss = ce_loss + Σ(每个 Switch 层的 aux_loss)





* * *



## 05PyTorch 实现



先写一个专家，结构和我们 EP8 的 FFN 完全一致（Linear → GELU → Linear）：





    import math

    import torch

    import torch.nn as nn

    import torch.nn.functional as F





    class Expert(nn.Module):

        def __init__(self, d_model: int, d_ff: int):

            super().__init__()

            self.fc1 = nn.Linear(d_model, d_ff)

            self.fc2 = nn.Linear(d_ff, d_model)



        def forward(self, x):

            return self.fc2(F.gelu(self.fc1(x)))





然后是完整的 Switch 层，包含 router、capacity、token dropping 和辅助损失：





    class SwitchFFN(nn.Module):

        def __init__(self, d_model, d_ff, num_experts,

                     capacity_factor=1.25, aux_alpha=0.01):

            super().__init__()

            self.num_experts = num_experts

            self.capacity_factor = capacity_factor

            self.aux_alpha = aux_alpha



            self.router = nn.Linear(d_model, num_experts, bias=False)

            self.experts = nn.ModuleList(

                [Expert(d_model, d_ff) for _ in range(num_experts)]

            )



        def forward(self, x):

            B, T, D = x.shape

            x_flat = x.reshape(-1, D)                    # (B*T, D)

            n_tokens = x_flat.size(0)



            # ---------- 1. 路由 ----------

            logits = self.router(x_flat)                 # (n_tokens, N)

            probs = F.softmax(logits, dim=-1)            # (n_tokens, N)

            gate, expert_idx = probs.max(dim=-1)         # 都是 (n_tokens,)



            # ---------- 2. 容量 ----------

            capacity = math.ceil(n_tokens / self.num_experts * self.capacity_factor)



            # ---------- 3. 分发给专家，超出容量的 token 被丢弃 ----------

            out = torch.zeros_like(x_flat)               # 丢弃的 token 输出保持 0

            for e, expert in enumerate(self.experts):

                token_ids = (expert_idx == e).nonzero(as_tuple=True)[0]

                token_ids = token_ids[:capacity]         # 位置靠前的优先，多余的丢弃

                if token_ids.numel() == 0:

                    continue

                expert_out = expert(x_flat[token_ids])   # (k, D)

                out[token_ids] = gate[token_ids].unsqueeze(-1) * expert_out



            # ---------- 4. 负载均衡损失 ----------

            one_hot = F.one_hot(expert_idx, self.num_experts).float()

            f = one_hot.mean(dim=0)                      # (N,) 实际分配比例，不可导

            P = probs.mean(dim=0)                        # (N,) 平均概率，可导

            aux_loss = self.aux_alpha * self.num_experts * torch.sum(f * P)



            return out.reshape(B, T, D), aux_loss





几个值得注意的细节：



  * **
`out`
 初始化为全 0**：被丢弃的 token 输出就是 0，配合外层的残差连接 
`x + MoE(...)`
，刚好实现了"丢弃的 token 原样通过"

  * **
`out[token_ids] = gate * expert_out`
** ：输出要乘以 gate 值。这一步很关键，它让 router 的概率直接参与到输出里，主任务的梯度才能传回 router

  * **统计 f 用的是丢弃之前的分配结果** ：辅助损失关心的是 router"想"怎么分，而不是容量限制之后"实际"怎么分



放进 Transformer Block 时，辅助损失需要一路往上传：





    class SwitchBlock(nn.Module):

        def __init__(self, d_model, n_heads, d_ff, num_experts):

            super().__init__()

            self.ln1 = nn.LayerNorm(d_model)

            self.attn = MultiHeadAttention(d_model, n_heads)   # 沿用 EP5

            self.ln2 = nn.LayerNorm(d_model)

            self.moe = SwitchFFN(d_model, d_ff, num_experts)



        def forward(self, x):

            x = x + self.attn(self.ln1(x))

            moe_out, aux_loss = self.moe(self.ln2(x))

            x = x + moe_out                                    # 残差：被丢弃的 token 原样通过

            return x, aux_loss





* * *



## 06用猫吃鱼验证手算结果



不依赖随机初始化，直接把 3.2 节的概率表填进去，核对第四节的数字：





    probs = torch.tensor([

        [0.60, 0.30, 0.10],   # 猫

        [0.50, 0.30, 0.20],   # 吃

        [0.20, 0.55, 0.25],   # 鱼

    ])

    N = 3

    expert_idx = probs.argmax(dim=-1)

    print(expert_idx)                          # tensor([0, 0, 1])



    f = F.one_hot(expert_idx, N).float().mean(dim=0)

    P = probs.mean(dim=0)

    print(f)                                   # tensor([0.6667, 0.3333, 0.0000])

    print(P)                                   # tensor([0.4333, 0.3833, 0.1833])



    aux = 0.01 * N * torch.sum(f * P)

    print(aux)                                 # tensor(0.0125)



    # 容量与丢弃

    capacity = math.ceil(3 / N * 1.0)          # capacity_factor = 1.0

    print(capacity)                            # 1

    e0_tokens = (expert_idx == 0).nonzero(as_tuple=True)[0]

    print(e0_tokens, "->", e0_tokens[:capacity])   # tensor([0, 1]) -> tensor([0])，"吃"被丢弃





和手算完全一致：f、P、0.0125，以及"吃"在容量为 1 时被丢弃。



> **诚实声明** ：和前面所有集数一样，随机初始化的专家和 router 没有任何语义。如果你直接用 
`SwitchFFN`
 跑一段真实文本，router 选谁、谁被丢弃都是随机的，没有"猫"一定去 E0 这种规律。本期验证的是**机制** ，不是效果。



* * *



## 07几点需要说清楚的边界



**1\. 本期代码是为了讲清楚机制，不是高效实现。** 我们用 
`for`
 循环逐个专家处理，单卡上能跑，但真实的大规模训练里，专家分布在不同设备上，token 需要通过 all-to-all 通信发送到对应设备。这部分属于专家并行，放到下一期。



**2\. Switch Transformer 基于 T5，是 encoder-decoder 结构。** 我们系列实现的是 decoder-only 的 GPT。MoE 层替换的是 Block 里的 FFN，这一点在两种结构里是通用的，所以本期的代码可以直接搬进我们的 GPT。但论文里的具体实验数字，不能直接等同于 decoder-only 模型。



**3\. 辅助损失只是"鼓励"均衡，不保证均衡。** 它是一个软约束，路由依然可能在局部偏斜，所以才需要前面 Expert Capacity 这个硬约束兜底。



**4\. 均衡本身是一把双刃剑。** 强行要求每个专家分到的 token 一样多，和"让专家各自专精于不同类型的 token"之间存在天然张力。α 取多大，本质是在这个张力里找平衡。后来的 MoE 工作（比如 DeepSeek 系列）在负载均衡的处理上又做了新的探索，等我们讲到那里再对比。



* * *



## 08小结



这一期的主线是一个问题和两个机制：



| 内容

---|---

问题 | router 会形成正反馈，让少数专家承担大部分 token；同时硬件要求每个专家的处理量有上限

机制一（兜底） | Expert Capacity：
`capacity = ⌈T/N × capacity_factor⌉`
，超出的 token 被丢弃，靠残差连接原样通过

机制二（治本） | Load Balancing Loss：
`α · N · Σ f_i · P_i`
，f 反映实际分配（不可导），P 提供梯度（可导），均匀时取最小值

关键数字 | 猫吃鱼：辅助损失 = 1.25（乘 α 后 0.0125），均匀时为 1.0



一句话总结：**Capacity 保证"最坏情况下系统不崩"，Load Balancing Loss 保证"平常情况下大家都在干活"。**



* * *



## 下一期预告



MoE 的训练不只是"加一个辅助损失"这么简单。参数量大、路由是离散操作，这类模型比普通 Transformer 更容易训练不稳定。下一期我们来看 Switch Transformer 论文里为稳定训练做的几个设计：



  * Router 为什么要用 float32 计算（selective precision）

  * 为什么初始化要比常规更小

  * 专家层的 dropout 为什么要单独调高

  * 以及专家并行里 all-to-all 通信是怎么回事



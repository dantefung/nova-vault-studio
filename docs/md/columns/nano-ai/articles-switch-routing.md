---

title: "MoE 与单专家路由"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/switch-routing/"

description: "大模型论文学习笔记。Switch Transformer 三篇解读：MoE 与单专家路由、专家容量与负载均衡，以及训练稳定性、实验结论与局限。"

---



# MoE 与单专家路由




[Switch Transformer 论文研读 · EP01](/papers/#switch-transformer)




Mixture of Experts & Top-1 Routing



> 上一阶段我们把 GPT 的完整前向传播手写了出来：Embedding → N 个 Transformer Block → LayerNorm → 输出头。这一篇开始，我们动这个结构里"最肥"的一块：FFN。



* * *



## 01先看一个被忽略的事实：FFN 才是参数大户



回忆 推理篇 EP09，一个 Transformer Block 里有两大块：Attention 和 FFN。



拿 GPT-2 small 来算（
`d_model=768`
，
`d_ff=3072`
）：



  * 一层 FFN 的权重：
`2 × 768 × 3072 ≈ 4.72M`


  * 12 层 FFN 加起来：约 
`56.6M`


  * 整个模型：约 
`124M`




也就是说，**接近一半的参数都在 FFN 里** 。



那么问题来了：如果我想让模型"知道更多东西"，通常的办法是把模型做大，也就是把 
`d_ff`
 加宽、把层数加深。但这样做有个代价：



**参数翻倍，每个 token 的计算量也跟着翻倍。**



参数量和计算量是绑死的。有没有办法把它们解开：参数堆得很多，但每个 token 实际算的量不变？



这就是 **MoE（Mixture of Experts，混合专家）** 要做的事，也是 Google 2021 年 Switch Transformer 这篇论文的出发点。



* * *



## 02核心想法：一个 FFN 拆成 N 个，每个 token 只走其中一个



Switch Transformer 的改动小到可以用一句话概括：



> 把 Block 里那个 FFN，换成 N 个结构相同、参数独立的 FFN（称为"专家"），再加一个"路由器"，决定每个 token 去哪个专家。**每个 token 只去 1 个。**



所以结构变成：





    原来：   x ──► FFN ──► y

    现在：   x ──► Router ──► 选出 1 个专家 E_i ──► y





注意两点：



  1. **总参数量变成了原来的 N 倍** （N 个专家，各自一套权重）

  2. **每个 token 的计算量几乎不变** （只经过 1 个专家，计算量和原来的一个 FFN 一样）



参数和计算量，就这样被解耦了。



> 说明：Switch Transformer 论文是基于 T5（encoder-decoder）做的，论文实验里常见的做法是隔层替换 FFN。我们这个系列是 GPT 风格的 decoder-only，这里把同样的思想移植过来，只关注"FFN 变成 MoE"这一件事。



### 一个后端同学熟悉的类比



这很像**分库分表** 或者**网关路由** ：



  * 请求（token）进来，由网关（Router）根据请求内容决定转发给哪个后端实例（Expert）

  * 系统总容量随实例数增长，但每个请求只会打到一个实例上，单次请求的开销不变



但类比到这里要停一下，有一个关键区别：



**网关的路由规则是人写死的；Router 的"规则"是训练出来的，而且并不保证专家会按"人类可理解的领域"分工。** 不要望文生义地以为"专家 0 懂语法、专家 1 懂科学"，这只是名字，不是事实保证。



* * *



## 03路由器到底是什么：一个线性层 + softmax



Router 简单到出乎意料，就是一个线性层加 softmax：





    logits = x · W_r          # (d_model) → (N)

    p      = softmax(logits)  # N 个专家各自的"被选概率"

    i      = argmax(p)        # 选概率最大的那一个（top-1）





其中 
`W_r`
 的形状是 
`(d_model, N)`
。



最后的输出是：





    y = p_i × E_i(x)





即**选中专家的输出，乘上它对应的概率
`p_i`
**。



先记住这个公式，下面用"猫吃鱼"一步步算。



* * *



## 04手算一遍：猫吃鱼



沿用我们的老例子：3 个 token，
`d_model=4`
。这一篇设 **N=3 个专家** 。



> 说明：这里的 
`x`
 指的是进入 MoE 层的输入（Pre-LN 结构下，就是 LayerNorm 之后的值，原来喂给 FFN 的那个）。数值是为了方便手算而设定的，不是真实训练出来的。



### Step 1：输入 
`x`
，形状 
`(3, 4)`




token | x

---|---

猫 | [ 1.0, 0.5, -0.5, 0.0 ]

吃 | [ 0.5, 1.0, 0.5, -0.5 ]

鱼 | [ -1.0, 0.0, 0.5, 1.0 ]



### Step 2：路由器权重 
`W_r`
，形状 
`(4, 3)`






    W_r = [[ 1.0,  0.0, -1.0],

           [ 0.5,  0.5,  0.0],

           [ 0.0,  0.5,  1.0],

           [-0.5,  0.0,  1.0]]





每一列对应一个专家：第 0 列是"专家 0 喜欢什么样的输入"，以此类推。



### Step 3：算 logits = 
`x · W_r`
，形状 
`(3, 3)`




以"猫"为例，逐列算：



  * 专家 0：
`1.0×1.0 + 0.5×0.5 + (-0.5)×0.0 + 0.0×(-0.5) = 1.25`


  * 专家 1：
`1.0×0.0 + 0.5×0.5 + (-0.5)×0.5 + 0.0×0.0 = 0.00`


  * 专家 2：
`1.0×(-1.0) + 0.5×0.0 + (-0.5)×1.0 + 0.0×1.0 = -1.50`




三个 token 的完整结果：



token | 专家 0 | 专家 1 | 专家 2

---|---|---|---

猫 | 1.25 | 0.00 | -1.50

吃 | 1.25 | 0.75 | -0.50

鱼 | -1.50 | 0.25 | 2.50



### Step 4：softmax，得到概率 
`p`
，形状 
`(3, 3)`




以"猫"为例：



  * 
`e^1.25 = 3.4903`
，
`e^0 = 1.0000`
，
`e^-1.5 = 0.2231`


  * 三者之和 = 
`4.7135`


  * 所以 
`p = [0.7405, 0.2122, 0.0473]`




完整结果：



token | p(专家 0) | p(专家 1) | p(专家 2)

---|---|---|---

猫 | **0.7405** | 0.2122 | 0.0473

吃 | **0.5617** | 0.3407 | 0.0976

鱼 | 0.0163 | 0.0938 | **0.8899**



### Step 5：top-1，每个 token 只选概率最大的那个专家



  * 猫 → 专家 0，权重 
`0.7405`


  * 吃 → 专家 0，权重 
`0.5617`


  * 鱼 → 专家 2，权重 
`0.8899`




**注意看这个结果：**



  * 专家 0 被选了 **2 次**

  * 专家 1 **一次都没被选中**

  * 专家 2 被选了 1 次



先把这个现象记下来，它是下一篇的主角。



### Step 6：被选中的专家各自算一遍



每个专家的内部，就是 推理篇 EP09 的 FFN：
`Linear → GELU → Linear`
，输入 
`(d_model)`
 输出 
`(d_model)`
。



为了聚焦路由本身，这里**直接假设** 三个专家的输出如下（真实数值取决于专家权重，这里手算意义不大）：



token | 被选专家 | E(x)

---|---|---

猫 | 专家 0 | [ 0.8, -0.2, 0.4, 0.6 ]

吃 | 专家 0 | [ 0.5, 0.3, -0.4, 0.2 ]

鱼 | 专家 2 | [ -0.6, 0.7, 0.1, 0.9 ]



### Step 7：乘上路由概率，得到 MoE 层输出 
`y`
，形状 
`(3, 4)`





`y = p_i × E_i(x)`
：



token | 计算 | y

---|---|---

猫 | 0.7405 × [0.8, -0.2, 0.4, 0.6] | [ 0.5924, -0.1481, 0.2962, 0.4443 ]

吃 | 0.5617 × [0.5, 0.3, -0.4, 0.2] | [ 0.2809, 0.1685, -0.2247, 0.1123 ]

鱼 | 0.8899 × [-0.6, 0.7, 0.1, 0.9] | [ -0.5339, 0.6229, 0.0890, 0.8009 ]



输入 
`(3, 4)`
，输出 
`(3, 4)`
，**形状没变** 。



这意味着：MoE 层可以直接替换原来的 FFN，Block 外面的残差连接、LayerNorm、堆叠方式**一行都不用改** 。这正是 推理篇 EP12 讲过的"形状不变所以能堆叠"的价值，这里是同一个道理：形状不变，所以能替换。



别忘了 推理篇 EP07 强调过的坑：残差加的是**原始的
`x`
**，不是 LayerNorm 之后的 
`x_norm`
。MoE 只替换了 FFN 这一块，这条规则不变。



* * *



## 05一个容易被问到的问题：为什么要乘上 
`p_i`
？



直接输出 
`E_i(x)`
 不行吗？为什么还要多乘一个概率？



**因为 argmax 是不可导的。**



选哪个专家，是一个"离散的选择"，反向传播的时候梯度穿不过去。如果输出里不含 
`p_i`
，那 Router 的参数 
`W_r`
 就**永远收不到梯度** ，Router 就永远学不会怎么选。



乘上 
`p_i`
 之后，输出就成了 
`W_r`
 的函数（
`p_i`
 由 
`W_r`
 算出来）。梯度可以通过 
`p_i`
 流回 Router。



用人话说：Router 虽然只"选"了一个专家，但它得到的反馈是"你选这个专家、给了这么大的权重，最后效果好不好"。



这里还有一个细节：Switch 用的是**原始的 softmax 概率** ，没有在选中的专家上重新归一化。如果只选 1 个再归一化，
`p_i`
 恒等于 1，梯度就又断了。



* * *



## 06为什么是 top-1？



在 Switch Transformer 之前，MoE 的主流做法（比如 Shazeer 等人 2017 年的 Sparsely-Gated MoE）是每个 token 选 **top-2 或更多** 个专家，当时的看法是：至少要比较两个专家，Router 才学得到有意义的信号。



Switch Transformer 的主张是：**top-1 就够了，而且更简单。** 论文给出的理由主要是几点：



  * 路由计算更少

  * 每个专家处理的 token 批量更小，计算与通信开销更低

  * 实现更简单



这是一种典型的"简化"思路，也是这篇论文名字里 **Simple** 的由来。



* * *



## 07PyTorch 实现



把上面的流程写成代码：





    import torch

    import torch.nn as nn

    import torch.nn.functional as F





    class Expert(nn.Module):

        """一个专家 = 一个普通的 FFN（和 推理篇 EP09 完全一样）"""

        def __init__(self, d_model, d_ff):

            super().__init__()

            self.fc1 = nn.Linear(d_model, d_ff)

            self.fc2 = nn.Linear(d_ff, d_model)



        def forward(self, x):

            return self.fc2(F.gelu(self.fc1(x)))





    class SwitchFFN(nn.Module):

        """Switch 路由的 MoE 层：用来替换 Block 里的 FFN"""

        def __init__(self, d_model, d_ff, num_experts):

            super().__init__()

            self.router = nn.Linear(d_model, num_experts, bias=False)

            self.experts = nn.ModuleList(

                [Expert(d_model, d_ff) for _ in range(num_experts)]

            )



        def forward(self, x):

            B, T, D = x.shape

            x_flat = x.reshape(-1, D)                        # (B*T, D)



            probs = F.softmax(self.router(x_flat), dim=-1)   # (B*T, N)

            gate, idx = probs.max(dim=-1)                    # 各 (B*T,)



            y = torch.zeros_like(x_flat)                     # (B*T, D)

            for i, expert in enumerate(self.experts):

                mask = (idx == i)                            # 选了专家 i 的 token

                if mask.any():

                    y[mask] = gate[mask].unsqueeze(-1) * expert(x_flat[mask])



            return (

                y.reshape(B, T, D),

                idx.reshape(B, T),

                probs.reshape(B, T, -1),

            )





几点说明：



  * **
`probs.max(dim=-1)`
** 一次性返回最大值（就是 
`p_i`
）和位置（就是专家编号），对应 Step 5

  * **
`mask`
** 把"选了专家 i 的所有 token"挑出来，批量送进这个专家，算完再放回原位

  * **返回了
`idx`
 和 
`probs`
**：这一篇用不到，但下一篇的负载均衡损失需要它们，这里先留好

  * 这里用 for 循环逐个专家处理，是为了**讲清楚逻辑** 。真实的大规模实现要把 token 按专家分桶、再并行处理，那是工程问题，我们先不碰



### 用"猫吃鱼"验证



把上面手算的 
`W_r`
 填进去，看路由结果是否一致：





    W = torch.tensor([[ 1.0, 0.0, -1.0],

                      [ 0.5, 0.5,  0.0],

                      [ 0.0, 0.5,  1.0],

                      [-0.5, 0.0,  1.0]])



    x = torch.tensor([[[ 1.0, 0.5, -0.5,  0.0],

                       [ 0.5, 1.0,  0.5, -0.5],

                       [-1.0, 0.0,  0.5,  1.0]]])      # (1, 3, 4)



    layer = SwitchFFN(d_model=4, d_ff=8, num_experts=3)

    with torch.no_grad():

        layer.router.weight.copy_(W.T)   # nn.Linear 存的是转置，形状 (N, D)



    y, idx, probs = layer(x)

    print(idx)       # tensor([[0, 0, 2]])

    print(probs[0])  # 约 [[0.7405, 0.2122, 0.0473],

                     #     [0.5617, 0.3407, 0.0976],

                     #     [0.0163, 0.0938, 0.8899]]

    print(y.shape)   # torch.Size([1, 3, 4])





这里有个熟悉的坑：
`nn.Linear(d_model, N)`
 内部权重的形状是 
`(N, d_model)`
，是我们手算时 
`W_r`
 的**转置** ，所以要 
`copy_(W.T)`
。和加载 GPT-2 权重时遇到的 Conv1D / Linear 转置问题，是同一个套路。



和之前一样，必须说明：**专家的权重是随机初始化的，所以
`y`
 的具体数值没有任何意义**，只有 
`idx`
 和 
`probs`
（由我们手动设定的 
`W_r`
 决定）可以和手算结果对上。



### 接入 Block



在 推理篇 EP11 的 Transformer Block 里，把 
`self.ffn = FFN(...)`
 换成 
`self.ffn = SwitchFFN(...)`
 即可，只需要注意：



  * 它现在返回三个值，Block 里取第一个当 FFN 输出，其余留给后面的损失函数用

  * 残差连接、LayerNorm 的写法都不用动



* * *



## 08小结



这一篇做了一件事：把 FFN 变成 MoE。



  * **动机** ：参数量和计算量原本绑死，MoE 把它们解耦：参数 ×N，每个 token 的计算量不变

  * **结构** ：N 个独立的 FFN（专家）+ 一个线性层加 softmax 的路由器

  * **Switch 路由** ：每个 token 只选概率最大的 **1 个** 专家，输出为 
`p_i × E_i(x)`


  * **乘
`p_i`
 的原因**：argmax 不可导，必须让输出带上 
`p_i`
，Router 才能收到梯度

  * **形状不变** ：输入输出都是 
`(B, T, d_model)`
，所以能直接替换 FFN



* * *



## 09留给下一篇的问题



回头看 Step 5 的结果：



  * 专家 0 被选了 2 次

  * 专家 1 一次都没被选中



这不是巧合，而是 MoE 训练里最典型的问题。Router 是自己学的，一旦某个专家早期表现稍好，就会被选得更多、训练得更多、表现更好、被选得更多……**强者恒强** ，最后可能只有少数几个专家在干活，其余的"专家"白占了参数。



另外还有一个更实际的约束：实际训练中，每个专家一次能处理的 token 数是有上限的。如果某个专家被分到的 token 太多会怎样？



下一篇我们解决这两件事：



  * **负载均衡损失** ：怎么用一个额外的 loss 逼 Router 把 token 分得均匀

  * **专家容量（Capacity Factor）** ：专家"装不下"时，多出来的 token 怎么处理



仍然用猫吃鱼手算。



* * *



## 参考



  * Fedus, Zoph, Shazeer. _Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity_ , 2021

  * Shazeer et al. _Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer_ , 2017



> 本文数值为教学演示而设定，路由器与专家权重均非训练所得，输出不代表真实模型行为。



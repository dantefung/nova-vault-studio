---

title: "升级前馈网络"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/swiglu/"

description: "从 GPT-2 到 LLaMA 第 02 篇：SwiGLU，升级前馈网络。结合手算示例与 PyTorch 实现，理解模型组件的变化。"

---



# 升级前馈网络




[从 GPT-2 到 LLaMA · EP02](/series/gpt2-to-llama/)




SwiGLU



> 上一期我们把 LayerNorm 换成了 RMSNorm。这一期换 Block 里的另一个大件：FFN。



## 先回顾一下



上一期的 RMSNorm，改的是 Block 里的**归一化** 。



但打开一个现代开源模型（LLaMA、Mistral、Qwen 一类）的 Block，你会发现 FFN 也不是 GPT-2 那个样子了：



  * GPT-2 的 FFN：两个矩阵，中间夹一个 GELU

  * 现代模型的 FFN：**三个矩阵** ，中间是一个"门控"结构



这个结构就叫 **SwiGLU** 。



这一期我们做三件事：



  1. 搞清楚 SwiGLU 到底多了什么

  2. 用"猫吃鱼"把它手算一遍，每一步标 shape

  3. 写成 PyTorch，并且用手算结果验证



* * *



## 01GPT-2 的 FFN，还有什么可以改？



先把 推理篇 EP09 FFN 里的公式再写一遍：





    FFN(x) = GELU(x · W1 + b1) · W2 + b2





shape 是 
`(d) → (4d) → (d)`
：先升到 4 倍宽，过一个 GELU，再降回来。



注意这里的一个结构特点：



**隐藏层的每个通道，取值只由"一个线性投影 + 一个激活函数"决定。**



通道 
`i`
 的值就是 
`GELU((x·W1)_i)`
。它既要决定"这个特征有没有出现"，又要决定"出现多强"，一个数扛两件事。



SwiGLU 的思路是把这两件事拆开：**一路负责内容，一路负责放行多少** 。



* * *



## 02先认识两个零件：SiLU 和 GLU



### SiLU（也叫 Swish）





    SiLU(z) = z · sigmoid(z)





和推理篇 EP10 里讲的 GELU 长得很像：平滑，没有 ReLU 那种硬拐点，负半轴不是直接归零，而是有一个很小的负值凹陷。



SiLU 的最小值大约是 **-0.2785** ，出现在 
`z ≈ -1.28`
 附近。



### GLU（Gated Linear Unit）



GLU 的想法是：对同一个输入 
`x`
，做**两次** 线性投影，其中一路过激活后，去**逐元素乘** 另一路：





    GLU(x) = (x · W) ⊙ sigmoid(x · V)






`⊙`
 是逐元素相乘。



### SwiGLU = 把 GLU 里的 sigmoid 换成 SiLU



Shazeer 在 2020 年的论文《GLU Variants Improve Transformer》里，把这个思路放进了 Transformer 的 FFN，并比较了一批变体。其中把门里的激活换成 Swish（SiLU）的那个，就是 SwiGLU：





    FFN_SwiGLU(x) = ( SiLU(x · W_gate) ⊙ (x · W_up) ) · W_down





三个矩阵的分工：



矩阵 | shape | 作用

---|---|---


`W_gate`
 | 
`(d, h)`
 | 门控路：过 SiLU 后作为"放行系数"


`W_up`
 | 
`(d, h)`
 | 内容路：不过激活，直接作为被控制的内容


`W_down`
 | 
`(h, d)`
 | 把结果降回 
`d`
 维



这里的 
`h`
 是隐藏层宽度。它不再是 
`4d`
，后面会解释为什么。



* * *



## 03猫吃鱼手算



沿用我们的设定：3 个 token「猫 吃 鱼」，
`d_model = 4`
。



**一个重要性质：FFN 是逐 token 独立作用的** ，token 之间互不影响（token 之间的信息交换是注意力的活）。所以手算只需要算一个 token，另外两个完全同理。



我们拿「吃」来算。



> 说明：为了让手算干净，下面的 
`x`
 和所有权重都是我**直接给定的小数** ，不是训练出来的，输出也没有语义。另外隐藏宽度取 
`h = 3`
，只是为了好算，并不满足后面要讲的参数量对齐。



### 输入





    x = [1, 0, -1, 2]        shape: (1, 4)





### 三个权重矩阵





    W_gate  shape (4, 3)          W_up  shape (4, 3)

    [ 1    0    0.5  ]            [ 1     0.5   0     ]

    [ 0.5  1    0    ]            [ 0     1     0.5   ]

    [ 0    1   -0.5  ]            [-0.5   0    -0.25  ]

    [ 0    0    0.5  ]            [ 0.25  0.25  0.125 ]



    W_down  shape (3, 4)

    [ 1    0    0.5   0   ]

    [ 0    1    0    -0.5 ]

    [ 0.5  0    1     1   ]





### Step 1：门控路的线性投影





    gate_pre = x · W_gate        (1,4) @ (4,3) → (1,3)





逐列算：





    第1列：1×1   + 0×0.5 + (-1)×0    + 2×0   = 1

    第2列：1×0   + 0×1   + (-1)×1    + 2×0   = -1

    第3列：1×0.5 + 0×0   + (-1)×(-0.5) + 2×0.5 = 2







    gate_pre = [1, -1, 2]





### Step 2：门控路过 SiLU




`SiLU(z) = z · sigmoid(z)`






    sigmoid(1)  = 0.7311  →  SiLU(1)  = 1  × 0.7311 =  0.7311

    sigmoid(-1) = 0.2689  →  SiLU(-1) = -1 × 0.2689 = -0.2689

    sigmoid(2)  = 0.8808  →  SiLU(2)  = 2  × 0.8808 =  1.7616







    gate = [0.7311, -0.2689, 1.7616]        shape: (1, 3)





### Step 3：内容路的线性投影（不过激活）





    up = x · W_up                (1,4) @ (4,3) → (1,3)







    第1列：1×1    + 0×0    + (-1)×(-0.5)  + 2×0.25  = 2

    第2列：1×0.5  + 0×1    + (-1)×0       + 2×0.25  = 1

    第3列：1×0    + 0×0.5  + (-1)×(-0.25) + 2×0.125 = 0.5







    up = [2, 1, 0.5]





### Step 4：两路逐元素相乘（门控的核心一步）





    h = gate ⊙ up

      = [0.7311×2,  -0.2689×1,  1.7616×0.5]

      = [1.4621,    -0.2689,    0.8808]        shape: (1, 3)





把三个通道摆在一起看：



通道 | gate_pre | SiLU(gate_pre) | up | h = gate × up

---|---|---|---|---

1 | 1.0 | 0.7311 | 2.0 | 1.4621

2 | -1.0 | -0.2689 | 1.0 | -0.2689

3 | 2.0 | 1.7616 | 0.5 | 0.8808



这张表里有三个值得看的现象：



  * **通道 1** ：内容路给了 2.0，但门只有 0.73，最后被压到 1.46

  * **通道 3** ：内容路只有 0.5，但门有 1.76，最后被放大到 0.88

  * **通道 2** ：门控值是小的负数 -0.2689，内容 1.0 被压成一个很小的**负值** ，并没有被硬切成 0



注意：
`SiLU(gate_pre)`
 并不是一个限制在 0 到 1 之间的开关，它可以大于 1（通道 3），也可以略小于 0（通道 2）。更准确的说法是**一个由输入决定的、逐通道的软缩放系数** 。



而且这个缩放系数是随 
`x`
 变化的：同样的 
`W_up`
，换一个 token 进来，门的数值就不一样，放行的量也跟着变。



### Step 5：降维





    out = h · W_down             (1,3) @ (3,4) → (1,4)







    第1列：1.4621×1   + (-0.2689)×0 + 0.8808×0.5 = 1.9025

    第2列：1.4621×0   + (-0.2689)×1 + 0.8808×0   = -0.2689

    第3列：1.4621×0.5 + (-0.2689)×0 + 0.8808×1   = 1.6119

    第4列：1.4621×0   + (-0.2689)×(-0.5) + 0.8808×1 = 1.0153







    out = [1.9025, -0.2689, 1.6119, 1.0153]        shape: (1, 4)





输入 
`(1,4)`
，输出 
`(1,4)`
，shape 不变，可以直接接回残差连接。



### 放回完整序列



三个 token 一起算时，只是把第一维从 1 变成 3：





    x          (3, 4)

    gate_pre   (3, 4) @ (4, h) → (3, h)

    up         (3, 4) @ (4, h) → (3, h)

    h          (3, h) ⊙ (3, h) → (3, h)

    out        (3, h) @ (h, 4) → (3, 4)





* * *



## 04为什么隐藏宽度是 8/3 d，而不是 4d



GPT-2 的 FFN 有两个矩阵，宽度是 
`4d`
（忽略偏置）：





    参数量 = d × 4d + 4d × d = 8d²





SwiGLU 有三个矩阵，设宽度为 
`h`
：





    参数量 = d × h × 3 = 3dh





想让两者参数量一样，令 
`3dh = 8d²`
，解得：





    h = 8d / 3 ≈ 2.67d





这就是"隐藏宽度从 4d 改成约 8/3 d"的原因：**多了一个矩阵，就把每个矩阵变窄一点，总参数量保持不变** ，这样才能和原来的 FFN 公平比较。



拿 LLaMA-7B 举例：





    d = 4096

    8d/3 = 10922.67 → 向上取整到 256 的倍数 → 11008





实际参数量对比：





    SwiGLU：3 × 4096 × 11008 = 135,266,304

    GPT-2 式：8 × 4096²      = 134,217,728





差距大约 0.8%，可以认为是对齐的。



* * *



## 05它为什么有效？先说清楚哪些能说，哪些不能说



这一节我想严格一点，因为网上有很多"门控让模型学会选择性记忆"之类的说法，听起来很顺，但并没有被证明。



**能说的（有机制，也有数据支撑）：**



  1. **机制上** ：传统 FFN 的每个隐藏通道只由一个线性投影决定；SwiGLU 让**两个不同的线性投影相乘** ，一路决定"放行多少"，一路决定"放行什么"，引入了输入相关的逐通道缩放。

  2. **实验上** ：Shazeer 的论文在相同参数量、相同算力的设置下，对比了多种 FFN 变体，GLU 家族（包括 SwiGLU）的效果好于 ReLU、GELU 的基线。

  3. **工业上** ：后来 PaLM 把它用到大模型上，LLaMA 采用之后，它成了开源模型的默认选择。



**不能说的：**



  * 论文本身**没有给出理论解释** 。Shazeer 在文末很坦率，说他们无法解释这些结构为什么有效，只能把成功归功于"divine benevolence"（天意）。

  * "门控学到了选择知识"这类说法，目前只是直觉，不是结论。



另外澄清一个常见误解：**SwiGLU 不是 LLaMA 发明的** 。它来自 Shazeer 2020，PaLM 先在大模型上用了，LLaMA 是采用并推广的一方。



* * *



## 06PyTorch 实现





    import torch

    import torch.nn as nn

    import torch.nn.functional as F





    class SwiGLUFFN(nn.Module):

        def __init__(self, d_model: int, hidden_dim: int):

            super().__init__()

            self.w_gate = nn.Linear(d_model, hidden_dim, bias=False)

            self.w_up   = nn.Linear(d_model, hidden_dim, bias=False)

            self.w_down = nn.Linear(hidden_dim, d_model, bias=False)



        def forward(self, x):

            # x: (batch, seq, d_model)

            gate = F.silu(self.w_gate(x))   # (batch, seq, hidden_dim)

            up   = self.w_up(x)             # (batch, seq, hidden_dim)

            return self.w_down(gate * up)   # (batch, seq, d_model)





### 用手算结果验证




`nn.Linear`
 的权重 shape 是 
`(out, in)`
，和我们手算时写的 
`(in, out)`
 是转置关系，所以赋值时要 
`.T`
：





    x = torch.tensor([[1., 0., -1., 2.]])



    W_gate = torch.tensor([[1, 0, 0.5], [0.5, 1, 0], [0, 1, -0.5], [0, 0, 0.5]])

    W_up   = torch.tensor([[1, 0.5, 0], [0, 1, 0.5], [-0.5, 0, -0.25], [0.25, 0.25, 0.125]])

    W_down = torch.tensor([[1, 0, 0.5, 0], [0, 1, 0, -0.5], [0.5, 0, 1, 1.]])



    ffn = SwiGLUFFN(d_model=4, hidden_dim=3)

    with torch.no_grad():

        ffn.w_gate.weight.copy_(W_gate.T)

        ffn.w_up.weight.copy_(W_up.T)

        ffn.w_down.weight.copy_(W_down.T)



    print(ffn(x))

    # 应该得到 tensor([[ 1.9025, -0.2689,  1.6119,  1.0153]])





### 计算隐藏宽度





    def swiglu_hidden_dim(d_model: int, multiple_of: int = 256) -> int:

        h = int(8 * d_model / 3)

        return multiple_of * ((h + multiple_of - 1) // multiple_of)



    print(swiglu_hidden_dim(4096))   # 11008





### 接回 Block



把 Block 里的 FFN 换掉，其余结构不变：





    # Block.forward 的核心两行（Pre-Norm 结构）

    x = x + self.attn(self.norm1(x))

    x = x + self.ffn(self.norm2(x))     # self.ffn = SwiGLUFFN(d_model, hidden_dim)





这里的 
`norm1`
、
`norm2`
 就是上一期的 RMSNorm。残差加的仍然是**未归一化的原始
`x`
**，这一点和之前的 Pre-LN 一致。



* * *



## 07三个容易踩的坑



**坑 1：SiLU 只套在 gate 这一路。** 
`up`
 那一路不过任何激活，直接和门相乘。写成两路都过 SiLU，就不是 SwiGLU 了。



**坑 2：隐藏宽度不是 4d。** 直接沿用 GPT-2 的 
`4 * d_model`
 会让参数量多出约一半。



**坑 3：加载权重时，命名对不上。** 同一个结构在不同代码库里名字不同：



本文 | HuggingFace LLaMA | Meta 原版 LLaMA

---|---|---


`w_gate`
 | 
`gate_proj`
 | 
`w1`



`w_up`
 | 
`up_proj`
 | 
`w3`



`w_down`
 | 
`down_proj`
 | 
`w2`




特别注意 Meta 原版里 
`w2`
 是**降维** 矩阵，
`w3`
 才是内容路的升维矩阵，不要按 GPT-2 里 "第一个升维、第二个降维" 的顺序去直觉对应。



* * *



## 08小结



| GPT-2 的 FFN | SwiGLU 的 FFN

---|---|---

矩阵数 | 2 | 3

隐藏宽度 | 4d | 约 8d/3

激活 | GELU，单路 | SiLU(gate) ⊙ up，两路相乘

偏置 | 有 | LLaMA 系通常没有

参数量 | 约 8d² | 约 8d²（对齐）

输入输出 shape | 
`(d) → (d)`
 | 
`(d) → (d)`




一句话：**SwiGLU 没有增加参数量，只是把"一路激活"换成了"一路控制、一路内容"的两路相乘。**



* * *



## 下一期预告



FFN 换完了，Block 里还剩一个最大的改动：**位置编码** 。



GPT-2 是把位置信息直接加在输入 embedding 上。现代模型换成了 **RoPE** ：不再往输入里加东西，而是在注意力内部，**旋转** Q 和 K。



下一期，我们用猫吃鱼的 
`d_model = 4`
（刚好拆成两组二维平面）手算一遍旋转，看看"相对位置"是怎么自然地出现在点积里的。



* * *



_参考：_



  * _Shazeer, "GLU Variants Improve Transformer", 2020_

  * _Dauphin et al., "Language Modeling with Gated Convolutional Networks", 2016_

  * _Touvron et al., "LLaMA: Open and Efficient Foundation Language Models", 2023_



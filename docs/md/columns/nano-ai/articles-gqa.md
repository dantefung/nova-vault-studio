---

title: "分组查询注意力"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/gqa/"

description: "从 GPT-2 到 LLaMA 第 04 篇：GQA，分组查询注意力。结合手算示例与 PyTorch 实现，理解模型组件的变化。"

---



# 分组查询注意力




[从 GPT-2 到 LLaMA · EP04](/series/gpt2-to-llama/)




GQA



> 上一期我们把位置编码换成了 RoPE。这一期换的零件在注意力内部：**多头注意力里 K 和 V 的头数** 。

>

> GPT-2 用的是标准多头注意力（MHA）：有几个 Query 头，就有几个 Key 头、几个 Value 头。LLaMA-2 70B、LLaMA-3、Mistral、Qwen2 这些模型，换成了 GQA（Grouped-Query Attention，分组查询注意力）：Query 头数不变，K 和 V 的头数砍到几分之一，几个 Query 头共用一组 K、V。

>

> 这一期只回答三个问题：为什么要砍 K、V 的头？砍了以后注意力还怎么算？代码里改哪几行？



* * *



## 01问题从哪来：推理时最贵的不是算，是搬



推理优化篇的 KV Cache 上下两期讲过：生成第 t 个 token 时，前面所有 token 的 K 和 V 不用重算，直接从缓存里读。



这解决了"重复计算"，但留下一个新问题：**缓存本身很大，而且每生成一个 token 都要把它完整读一遍。**



先算一下 KV Cache 有多大。每个 token、每一层，要存 K 和 V 两份，每份是 
`头数 × head_dim`
 个数：





    每个 token 的 KV Cache = 2 × 层数 × KV头数 × head_dim × 每个数的字节数





拿一个 LLaMA-2 70B 规模的模型代入（80 层，64 个头，head_dim=128，fp16 每个数 2 字节）：





    2 × 80 × 64 × 128 × 2 字节 = 2,621,440 字节 ≈ 2.5 MB / token





一条 4096 token 的对话，光 KV Cache 就是 **10 GB** 。并发 8 个请求，80 GB，一张 A100 80G 直接装满，模型权重都没地方放。



更要命的是速度。解码阶段每一步只算一个 token，计算量很小，但要把这 10 GB 从显存读进计算单元。这时候 GPU 不是在等算，是在等搬数据。**瓶颈是显存带宽，不是算力。**



所以问题变成：能不能让 KV Cache 变小？



公式里能动的几项：层数和 head_dim 动了会伤模型容量；字节数可以靠量化压；剩下的就是 **KV 头数** 。GQA 动的就是这一项。



* * *



## 02先回顾：MHA 里每个头都有自己的 K、V



原系列多头注意力那一期讲过，MHA 是这样分工的：





    Q = X @ W_q    → 切成 n_heads 份

    K = X @ W_k    → 切成 n_heads 份

    V = X @ W_v    → 切成 n_heads 份



    第 i 个头：softmax(Q_i @ K_iᵀ / √head_dim) @ V_i





每个头有自己的 Q、K、V，三者头数相同，一一对应。



这里要分清 Q 和 K、V 的角色：



  * **Q 是"我想找什么"** ，代表当前 token 提问的角度。

  * **K、V 是"可供查找的内容"** ，K 用来被匹配，V 是匹配上之后取走的东西。



多个头的意义，是让模型**从不同角度提问** ：一个头关注语法关系，一个头关注指代，一个头关注相邻词。



那么问题来了：提问角度需要很多个，但**被查的内容** 真的也需要每个头一份吗？



* * *



## 03从 MHA 到 MQA，再到 GQA



### MQA：所有头共用一份 K、V



2019 年 Noam Shazeer（Transformer 原论文作者之一）在论文 _Fast Transformer Decoding: One Write-Head is All You Need_ 里提出了最激进的做法：**Multi-Query Attention（MQA）** 。



Q 照样有 n_heads 个头，但 K 和 V 只保留 **1 个头** ，所有 Query 头都拿这一份去做注意力。



KV Cache 直接缩到原来的 1/n_heads。上面那个 70B 规模的例子，64 个头变 1 个头，10 GB 变 160 MB。



代价是：所有头被迫在同一份"内容"里查找，表达能力下降。实际训练中，MQA 模型质量会有可见的损失，训练也更容易不稳定。



### GQA：折中，分组共用



2023 年 Google 的 Joshua Ainslie 等人在论文 _GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints_ 里提出了折中方案：



**把 Query 头分成 G 组，每组共用一份 K、V。**





    MHA：  Q 头 8 个，KV 头 8 个   每个 Q 头独占一份 KV

    GQA：  Q 头 8 个，KV 头 2 个   每 4 个 Q 头共用一份 KV

    MQA：  Q 头 8 个，KV 头 1 个   所有 Q 头共用一份 KV





用一张图看分组关系：





    MHA   Q0 Q1 Q2 Q3 Q4 Q5 Q6 Q7

          |  |  |  |  |  |  |  |

          K0 K1 K2 K3 K4 K5 K6 K7



    GQA   Q0 Q1 Q2 Q3   Q4 Q5 Q6 Q7

           \  |  |  /     \  |  |  /

              K0             K1



    MQA   Q0 Q1 Q2 Q3 Q4 Q5 Q6 Q7

            \  \  \  |  |  /  /  /

                     K0





（图里只画了 K，V 的分组方式完全一样。）



这里有个很漂亮的统一视角：**MHA 和 MQA 都是 GQA 的特例。**



  * KV 头数 = Q 头数，就是 MHA

  * KV 头数 = 1，就是 MQA

  * 介于两者之间，就是 GQA



所以 GQA 不是一个全新的结构，而是给"KV 头数"这个旋钮开放了中间档位。



* * *



## 04手算：猫吃鱼上的 GQA



还是熟悉的"猫吃鱼"，
`d_model=4`
。



为了能在纸上算，这一期取 **4 个 Query 头、2 个 KV 头** ，每组 2 个 Query 头共用一份 KV。这样 
`head_dim = 4 / 4 = 1`
，每个头的 q、k、v 都只是一个数。



> head_dim=1 只是为了手算方便，真实模型的 head_dim 一般是 64 或 128。计算逻辑完全一样，只是标量乘法变成向量点积。



### 第 1 步：输入





    X: [3, 4]



    猫  [1, 0, 1, 0]

    吃  [0, 1, 0, 1]

    鱼  [1, 1, 0, 0]





### 第 2 步：投影矩阵的形状变了



这是 GQA 和 MHA 在结构上唯一的区别：





                  MHA        GQA

    W_q 形状     [4, 4]     [4, 4]     ← 4 个 Q 头 × head_dim 1，不变

    W_k 形状     [4, 4]     [4, 2]     ← 只有 2 个 KV 头

    W_v 形状     [4, 4]     [4, 2]     ← 只有 2 个 KV 头





W_q 的列数是 
`n_heads × head_dim = 4`
，W_k、W_v 的列数是 
`n_kv_heads × head_dim = 2`
。



本例取的权重：





    W_q: [4, 4]                W_k: [4, 2]       W_v: [4, 2]

    [ 1,  0,  0,   1]          [1, 0]            [1, 0]

    [ 0, -1,  0.5, 0]          [0, 1]            [0, 0]

    [ 0,  0,  1,   0]          [1, 0]            [0, 1]

    [ 1,  0,  0,   0]          [0, 0]            [0, 1]





### 第 3 步：算 Q、K、V





    Q = X @ W_q: [3, 4]               4 列 = 4 个 Q 头

             头0   头1   头2   头3

    猫     [ 1,    0,    1,    1  ]

    吃     [ 1,   -1,    0.5,  0  ]

    鱼     [ 1,   -1,    0.5,  1  ]



    K = X @ W_k: [3, 2]               2 列 = 2 个 KV 头

            组0  组1

    猫     [ 2,   0 ]

    吃     [ 0,   1 ]

    鱼     [ 1,   1 ]



    V = X @ W_v: [3, 2]

            组0  组1

    猫     [ 1,   1 ]

    吃     [ 0,   1 ]

    鱼     [ 1,   0 ]





注意 K、V 只有 2 列。**KV Cache 存的就是这两张表** ，MHA 下它们会是 4 列。



### 第 4 步：分组对应关系





    Q 头 0、1  →  用 KV 组 0

    Q 头 2、3  →  用 KV 组 1





规则是 
`kv_组号 = q_头号 // (n_heads / n_kv_heads)`
，本例 
`n_heads / n_kv_heads = 2`
。



### 第 5 步：算「鱼」的注意力



「鱼」是最后一个 token，因果掩码下可以看到猫、吃、鱼三个位置。它的 q 是 
`[1, -1, 0.5, 1]`
，四个头各取一个数。



head_dim=1，缩放因子 √1 = 1，下面省略。



**头 0** （q = 1，用组 0：k = [2, 0, 1]，v = [1, 0, 1]）





    分数    = 1 × [2, 0, 1]      = [2, 0, 1]

    exp     = [7.389, 1, 2.718]   和 = 11.107

    权重    = [0.665, 0.090, 0.245]

    输出    = 0.665×1 + 0.090×0 + 0.245×1 = 0.910





**头 1** （q = -1，同样用组 0：k = [2, 0, 1]，v = [1, 0, 1]）





    分数    = -1 × [2, 0, 1]     = [-2, 0, -1]

    exp     = [0.135, 1, 0.368]   和 = 1.503

    权重    = [0.090, 0.665, 0.245]

    输出    = 0.090×1 + 0.665×0 + 0.245×1 = 0.335





**头 2** （q = 0.5，用组 1：k = [0, 1, 1]，v = [1, 1, 0]）





    分数    = 0.5 × [0, 1, 1]    = [0, 0.5, 0.5]

    exp     = [1, 1.649, 1.649]   和 = 4.297

    权重    = [0.233, 0.384, 0.384]

    输出    = 0.233×1 + 0.384×1 + 0.384×0 = 0.616





**头 3** （q = 1，同样用组 1：k = [0, 1, 1]，v = [1, 1, 0]）





    分数    = 1 × [0, 1, 1]      = [0, 1, 1]

    exp     = [1, 2.718, 2.718]   和 = 6.437

    权重    = [0.155, 0.422, 0.422]

    输出    = 0.155×1 + 0.422×1 + 0.422×0 = 0.578





### 第 6 步：拼接





    「鱼」的多头输出: [0.910, 0.335, 0.616, 0.578]   形状 [4]





之后乘 W_o（形状 [4, 4]），和 MHA 完全一样，这里不再展开。



### 看懂这组数字



把头 0 和头 1 放在一起看：





             用的 K          用的 V        注意力权重（猫, 吃, 鱼）

    头 0     [2, 0, 1]      [1, 0, 1]     [0.665, 0.090, 0.245]   → 主要看「猫」

    头 1     [2, 0, 1]      [1, 0, 1]     [0.090, 0.665, 0.245]   → 主要看「吃」





**K、V 完全相同，但注意力分布完全不同。** 头 0 主要看「猫」，头 1 主要看「吃」，原因只有一个：它们的 q 不同。



这就是 GQA 能成立的关键：



  * **共享的是"被查的内容"** （K、V）

  * **不共享的是"提问的角度"** （Q）



同组的头查的是同一份资料，但各自问自己的问题，得到的答案就不一样。多头"从不同角度看"的能力保住了大部分，损失的只是"每个头还能有一份专属资料"的那部分自由度。



> 本例的权重是故意挑的，让头 0 和头 1 的 q 正好一正一负，对比才这么鲜明。真实模型里同组的头不一定差这么多，但原理一样：q 不同，注意力分布就不同。



### 第 7 步：缓存省了多少



本例 3 个 token，每层要缓存的数字个数：





    MHA：  K 3×4 + V 3×4 = 24 个数

    GQA：  K 3×2 + V 3×2 = 12 个数     → 1/2

    MQA：  K 3×1 + V 3×1 =  6 个数     → 1/4





换回 70B 规模的例子：64 个 Q 头，GQA 取 8 个 KV 头，每组 8 个 Q 头共用，KV Cache 缩到 1/8：





    MHA：  每 token 2.5 MB，4096 token 共 10 GB

    GQA：  每 token 320 KB，4096 token 共 1.25 GB





这就是 LLaMA-2 70B 的实际配置：64 个 Q 头，8 个 KV 头。



* * *



## 05一个类比：资料室和调查员



把注意力想成一个调查小组：



  * **Q 头** 是调查员，每人带着自己的问题。

  * **K、V** 是资料室，K 是目录，V 是档案本身。



**MHA** ：每个调查员配一间专属资料室。最灵活，但资料室数量 = 调查员数量，每次开工所有资料室都要开门搬档案。



**MQA** ：所有调查员挤一间资料室。省地方，但资料室只能按一种方式整理，有些调查员的问题就是查不顺手。



**GQA** ：调查员分成几组，每组一间资料室。同组的人问题各不相同，但共用一份按组整理的档案。资料室少了很多，每组的档案又还能有自己的侧重。



推理时真正的成本是"每生成一个 token 都要把所有资料室的档案搬一遍"。资料室越少，搬得越快。



* * *



## 06训练好的 MHA 模型能直接改成 GQA 吗？



GQA 论文的标题后半句是 _from Multi-Head Checkpoints_ ，它的另一个贡献是：**不用从头训练，可以把已有的 MHA 模型"改造"成 GQA。**



做法分两步：



**1\. 合并 KV 头：组内取平均。** 比如 8 个 KV 头要合成 2 个，就把第 0~~3 个头的 W_k 投影取平均，作为新的第 0 个 KV 头；第 4~~ 7 个头取平均，作为新的第 1 个。W_v 同理。W_q 和 W_o 不动。



**2\. 继续训练一小段（论文叫 uptraining）。** 合并之后模型会有点"懵"，再用原预训练计算量的约 5% 继续训练，让它适应新结构。



论文对比过几种合并方式：组内取平均、只保留每组第一个头、随机初始化。取平均效果最好，直觉上也合理，平均保留了组内所有头的信息。



论文在 T5 上的实验结论：8 个 KV 头的 GQA，质量接近原始 MHA，推理速度接近 MQA。这正是它想要的"两头都占一点"。



不过要说清楚：现在主流的大模型（LLaMA-3、Qwen2 等）基本是**一开始就按 GQA 结构训练** 的，uptraining 主要是论文提出时用来证明可行性、以及低成本改造已有模型的手段。



* * *



## 07为什么不直接用 MQA，省得更多？



既然 MQA 能省到 1/n_heads，为什么主流模型大多停在 8 个 KV 头左右？



**1\. 质量。** 上面说过，MQA 质量损失更明显。GQA 的 KV 头从 1 加到几个，质量回升很快，而缓存只是线性增加。实践中 8 个左右是常见的平衡点。



**2\. 多卡切分。** 大模型推理常用张量并行，把注意力头切到多张卡上。8 个 KV 头配 8 卡并行，每张卡正好分到 1 个 KV 头，干净利落。MQA 只有 1 个 KV 头，没法切，只能每张卡复制一份，省下的缓存在多卡场景下又被吃回去一部分。



**3\. 模型越大，MQA 砍得越狠。** 64 个头的模型用 MQA 是砍到 1/64，信息瓶颈比 12 个头的小模型严重得多。GQA 可以按模型规模选 KV 头数，伸缩更灵活。



* * *



## 08代码：改哪几行



和原系列的多头注意力相比，改动集中在三处：W_k / W_v 的输出维度、K/V 的 reshape、以及计算前把 K/V "复制"到和 Q 一样多的头。





    import torch

    import torch.nn as nn

    import torch.nn.functional as F





    def repeat_kv(x, n_rep):

        """

        把 KV 头扩展到和 Q 头一样多。

        x: [B, n_kv_heads, T, head_dim]

        返回: [B, n_kv_heads * n_rep, T, head_dim]

        排列方式: kv0, kv0, kv1, kv1, ...（同一个 KV 头连续重复）

        """

        if n_rep == 1:

            return x

        B, H_kv, T, D = x.shape

        x = x[:, :, None, :, :].expand(B, H_kv, n_rep, T, D)  # [B, H_kv, n_rep, T, D]

        return x.reshape(B, H_kv * n_rep, T, D)





    class GroupedQueryAttention(nn.Module):

        def __init__(self, d_model, n_heads, n_kv_heads):

            super().__init__()

            assert d_model % n_heads == 0

            assert n_heads % n_kv_heads == 0, "Q 头数必须是 KV 头数的整数倍"



            self.n_heads = n_heads

            self.n_kv_heads = n_kv_heads

            self.head_dim = d_model // n_heads

            self.n_rep = n_heads // n_kv_heads          # 每个 KV 头被几个 Q 头共用



            self.W_q = nn.Linear(d_model, n_heads * self.head_dim, bias=False)

            self.W_k = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)  # 变小了

            self.W_v = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)  # 变小了

            self.W_o = nn.Linear(n_heads * self.head_dim, d_model, bias=False)



        def forward(self, x):

            B, T, _ = x.shape



            q = self.W_q(x).view(B, T, self.n_heads, self.head_dim).transpose(1, 2)

            k = self.W_k(x).view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)

            v = self.W_v(x).view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)

            # q: [B, n_heads,    T, head_dim]

            # k: [B, n_kv_heads, T, head_dim]

            # v: [B, n_kv_heads, T, head_dim]



            # 如果用 RoPE（上一期），在这里对 q、k 做旋转

            # 如果用 KV Cache，在这里缓存 k、v —— 注意缓存的是 n_kv_heads 个头，省显存就省在这



            k = repeat_kv(k, self.n_rep)   # [B, n_heads, T, head_dim]

            v = repeat_kv(v, self.n_rep)   # [B, n_heads, T, head_dim]



            scores = q @ k.transpose(-2, -1) / (self.head_dim ** 0.5)   # [B, n_heads, T, T]

            mask = torch.triu(torch.ones(T, T, dtype=torch.bool, device=x.device), diagonal=1)

            scores = scores.masked_fill(mask, float("-inf"))

            weights = F.softmax(scores, dim=-1)



            out = weights @ v                                            # [B, n_heads, T, head_dim]

            out = out.transpose(1, 2).contiguous().view(B, T, -1)        # [B, T, d_model]

            return self.W_o(out)





两个要点：



**1\. 缓存发生在 repeat_kv 之前。** KV Cache 存的是原始的 
`n_kv_heads`
 个头，复制只在计算时临时做。如果先复制再缓存，GQA 就白做了。



**2\. repeat_kv 这种写法会真的复制出一份大张量** ，教学版为了清晰这么写。生产环境里的注意力内核（比如后面要讲的 FlashAttention）会直接按分组去读 KV，不需要把它展开。



### 用手算的数字验证



把上面手算用的权重塞进去，看「鱼」的四个头输出是不是 
`[0.910, 0.335, 0.616, 0.578]`
：





    torch.manual_seed(0)

    attn = GroupedQueryAttention(d_model=4, n_heads=4, n_kv_heads=2)



    X = torch.tensor([[[1., 0, 1, 0],

                       [0., 1, 0, 1],

                       [1., 1, 0, 0]]])            # [1, 3, 4]



    W_q = torch.tensor([[1., 0, 0, 1],

                        [0., -1, 0.5, 0],

                        [0., 0, 1, 0],

                        [1., 0, 0, 0]])

    W_k = torch.tensor([[1., 0], [0., 1], [1., 0], [0., 0]])

    W_v = torch.tensor([[1., 0], [0., 0], [0., 1], [0., 1]])



    # nn.Linear 存的是 [out, in]，手算写的是 [in, out]，要转置

    with torch.no_grad():

        attn.W_q.weight.copy_(W_q.T)

        attn.W_k.weight.copy_(W_k.T)

        attn.W_v.weight.copy_(W_v.T)

        attn.W_o.weight.copy_(torch.eye(4))       # W_o 设为单位矩阵，直接看拼接结果



    out = attn(X)

    print(out[0, 2])   # 「鱼」的输出

    # tensor([0.9100, 0.3351, 0.6157, 0.5779], ...)





W_o 设成单位矩阵，输出就等于四个头的拼接结果，可以直接和手算对照。



### 一个加载权重的坑：repeat 和 repeat_interleave



复制 KV 头时，顺序必须是：





    正确：kv0, kv0, kv1, kv1      → Q 头 0、1 用 kv0，Q 头 2、3 用 kv1

    错误：kv0, kv1, kv0, kv1      → Q 头 0、2 用 kv0，Q 头 1、3 用 kv1






`repeat_kv`
 里的 expand 写法、或者 
`torch.repeat_interleave(k, n_rep, dim=1)`
，得到的是正确的顺序。而 
`k.repeat(1, n_rep, 1, 1)`
 得到的是错误的顺序。



用错了代码不会报错，形状完全一样，但加载 LLaMA 预训练权重后，每个 Q 头都对上了别人的 KV，输出就是一堆乱码。这和原系列里 Conv1D 转置、上一期 RoPE 相邻配对 vs 前后半配对是同一类坑：**形状对了不代表语义对了。**



> 和之前每一期一样要说明：随机初始化的权重没有任何语义，上面的模块在加载预训练权重之前，输出的数字都没有意义。



* * *



## 09这一期的要点



  1. **GQA 解决的是推理问题。** 解码阶段的瓶颈是读 KV Cache 的显存带宽，KV 头数直接决定缓存大小。

  2. **只减 K、V 的头，不减 Q 的头。** 提问角度保持多样，被查的内容分组共享。同组的头 K、V 相同，但因为 q 不同，注意力分布照样不同。

  3. **MHA 和 MQA 是 GQA 的两个端点。** KV 头数 = Q 头数是 MHA，= 1 是 MQA，中间档位就是 GQA。

  4. **代码改动很小。** W_k、W_v 输出维度变小，计算前用 repeat_kv 扩展；缓存要在扩展之前做；扩展顺序必须是连续重复。



* * *



## 下期预告



进阶篇「从 GPT-2 到 LLaMA」到这里，四个核心零件都换完了：





    GPT-2                  →   现代 LLM

    LayerNorm              →   RMSNorm      （EP1）

    GELU FFN               →   SwiGLU       （EP2）

    可学习绝对位置向量      →   RoPE         （EP3）

    MHA                    →   GQA          （EP4）





下一期把它们装回一起，做一次 **LLaMA 总览** ：一个 LLaMA Block 和 GPT-2 Block 逐行对比，看这四个零件分别装在哪个位置，再看 LLaMA 的配置文件里每个参数对应前面哪一期。



* * *



_参考论文_



  * Shazeer, N. (2019). _Fast Transformer Decoding: One Write-Head is All You Need._

  * Ainslie, J., et al. (2023). _GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints._ EMNLP 2023.



---

title: "多头潜在注意力（上）"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/mla/"

description: "从 LLaMA 到 DeepSeek 第 01 篇：MLA 多头潜在注意力。用「猫吃鱼」手算 KV 压缩与矩阵吸收，附 PyTorch 实现。"

---



# 多头潜在注意力（上）




[从 LLaMA 到 DeepSeek · EP01](/series/llama-to-deepseek/)




MLA · Part 1



> 新系列开篇。上一个系列「从GPT-2到LLaMA」里，我们把 GPT-2 的零件一个个换成了 LLaMA 的。这个系列继续往前走：在 LLaMA 的骨架上，DeepSeek 又换掉了哪些零件，为什么要换。

>

> 第一个零件，是 DeepSeek 最有代表性的设计：**MLA（Multi-head Latent Attention，多头潜在注意力）** 。



* * *



## 01先回到老问题：KV Cache 太大了



推理优化篇里我们讲过 KV Cache：生成第 t 个 token 时，前面所有 token 的 K 和 V 不用重算，直接从缓存里取。



代价是显存。每个 token、每一层，要存的数字个数是：





    KV Cache（每 token 每层）= 2 × n_heads × head_dim

                               ↑ K 和 V 各一份





拿一个 DeepSeek 规模的配置算一下：128 个头，head_dim = 128。





    2 × 128 × 128 = 32768 个数 / token / 层





更关键的是，decode 阶段每生成一个 token，都要把整个 KV Cache 从显存里读一遍。算力往往不是瓶颈，**搬数据才是** 。所以 KV Cache 越小，能塞的上下文越长、能同时服务的请求越多、生成越快。



## 02上一季的解法：GQA，让头共享 K/V



「从GPT-2到LLaMA」EP4 讲过 GQA 的思路：既然每个头都存一份 K/V 太贵，那就让几个 Query 头共用一组 K/V。





    MHA：8 个 Q 头，8 组 K/V

    GQA：8 个 Q 头，2 组 K/V（每 4 个头共用一组）

    MQA：8 个 Q 头，1 组 K/V（所有头共用）





缓存确实小了，但有一个代价：**共用同一组的头，看到的 K 一模一样** 。头与头之间的差异，只能靠各自的 Q 来体现。共享得越狠，表达能力损失越多。



那有没有办法，缓存像 MQA 一样小，但每个头又能拿到属于自己的 K？



## 03MLA 的思路：不共享成品，共享原料



先用一个工厂的比喻（接着原系列「装配车间」「流水线」的说法）。



GQA 的做法是：几个工位共用同一批**成品零件** 。省了仓库，但工位之间拿到的零件完全一样。



MLA 的做法是：仓库里不存成品，只存一份很小的**毛坯件** 。每个工位按自己的图纸，把毛坯加工成自己需要的零件。



  * 仓库只存毛坯 → 缓存很小

  * 每个工位图纸不同 → 每个头的 K 依然不同



翻译成矩阵语言：



  1. 先把每个 token 的隐藏向量 h，**压缩** 成一个很短的潜在向量 c（latent）。这一步叫下投影（down-projection）。

  2. **KV Cache 只存 c** 。

  3. 用的时候，每个头用自己的矩阵把 c **还原** 成自己的 K 和 V。这一步叫上投影（up-projection）。



这就是名字里 Latent 的含义：缓存里存的不是 K/V 本身，而是生成 K/V 的潜在表示。



## 04公式 + 猫吃鱼手算



沿用老例子：「猫吃鱼」3 个 token，d_model = 4。设定：





    n_heads = 2，head_dim = 2（2 × 2 = 4 = d_model）

    d_c = 2（潜在向量 c 的维度）





> 为了专注 MLA 本身，这一期**先假装没有 RoPE** 。RoPE 和 MLA 之间有一个很微妙的冲突，留给下一期专门讲。



### 4.1 三个公式





    c_s     = W_DKV · h_s        下投影：(d_c × d_model)，4 维 → 2 维

    k_{s,i} = W_UK_i · c_s       头 i 的 K 上投影：(head_dim × d_c)

    v_{s,i} = W_UV_i · c_s       头 i 的 V 上投影：(head_dim × d_c)





Q 照常计算：
`q_{t,i} = W_Q_i · h_t`
。



> 旁注：DeepSeek 实际上对 Q 也做了类似的低秩压缩。但 Q 不进缓存，压缩 Q 主要是为了省训练时的激活显存，和 KV Cache 无关，这里先略过。



### 4.2 第一步：下投影，得到要缓存的 c



假设经过 RMSNorm 后，三个 token 的隐藏向量是：





    h_猫 = [1, 0, 1, 0]

    h_吃 = [0, 1, 0, 1]

    h_鱼 = [1, 1, 0, 0]





下投影矩阵（2 × 4）：





    W_DKV = [[0.5, 0,   0.5, 0  ],

             [0,   0.5, 0,   0.5]]





逐个算：





    c_猫 = W_DKV · h_猫 = [0.5×1 + 0.5×1,  0]        = [1,   0  ]

    c_吃 = W_DKV · h_吃 = [0,  0.5×1 + 0.5×1]        = [0,   1  ]

    c_鱼 = W_DKV · h_鱼 = [0.5×1,  0.5×1]            = [0.5, 0.5]





shape：
`(4,) → (2,)`
。**缓存里存的就是这三个 2 维向量** ，总共 6 个数。



### 4.3 第二步：上投影，每个头还原出自己的 K



两个头用不同的上投影矩阵：





    W_UK_1 = [[1, 0],      头 1：原样输出

              [0, 1]]



    W_UK_2 = [[0, 1],      头 2：交换两个分量

              [1, 0]]





还原出来的 K：



token | c | 头 1 的 K | 头 2 的 K

---|---|---|---

猫 | [1, 0] | [1, 0] | [0, 1]

吃 | [0, 1] | [0, 1] | [1, 0]

鱼 | [0.5, 0.5] | [0.5, 0.5] | [0.5, 0.5]



**关键就在这张表** ：缓存里每个 token 只有一份 c，但两个头还原出来的 K 是不同的。这是 MLA 和 GQA 的本质区别：GQA 共享的是 K 本身，MLA 共享的是生成 K 的原料。



### 4.4 第三步：照常算注意力



看最后一个 token「鱼」（位置 2，因果掩码下能看到猫、吃、鱼）。假设它在两个头上的 Query 都是：





    q_鱼,1 = [1, 0]

    q_鱼,2 = [1, 0]





注意力分数 = q · k（为了手算方便，先不除 √head_dim，不影响后面的对比）：





    头 1：q · [k_猫, k_吃, k_鱼] = [1, 0, 0.5]   → 最关注「猫」

    头 2：q · [k_猫, k_吃, k_鱼] = [0, 1, 0.5]   → 最关注「吃」





两个头的 Query 完全一样，却因为各自的 W_UK 不同，关注了不同的 token。如果换成 MQA，两个头看到的是同一组 K，分数也会完全一样。



## 05到底省了多少



先看玩具例子，每个 token 每层要缓存的数字个数：





    MHA：K 4 个 + V 4 个 = 8

    MQA：K 2 个 + V 2 个 = 4

    MLA：c 2 个           = 2   ← K 和 V 共用同一个 c





注意最后一行：**K 和 V 是从同一个 c 还原出来的** ，所以只需要缓存一份。



再看真实配置。DeepSeek-V2/V3 的 MLA 参数是：128 个头，head_dim = 128，d_c = 512，另外还有一个 64 维的 RoPE 分量（下期讲）。





    MHA：2 × 128 × 128 = 32768 个数 / token / 层

    MLA：512 + 64      =   576 个数 / token / 层





压缩了约 57 倍。DeepSeek-V2 论文给了一个直观的换算：MLA 的缓存量，大约相当于只有 **2.25 组** 的 GQA。



放到 DeepSeek-V3 的 61 层、BF16、128K 上下文下粗算：





    MHA：约 500 GB

    MLA：约 9 GB





前者一张卡都放不下，后者轻轻松松。



## 06问题来了：每次都要还原 K，不就白省了？



看到这里，很自然会有一个疑问：



> 缓存里只存 c，可每次算注意力都得用 W_UK 把所有历史 token 的 c 还原成 K。上下文 10 万个 token，每一步都还原 10 万次，这不是把省下的显存换成了更多计算吗？



这就是 MLA 最巧妙的地方：**矩阵吸收（absorb）** 。



### 6.1 把 W_UK 吸收进 Query



展开一个头的注意力分数：





    score = q_t · k_s

          = q_t^T · (W_UK · c_s)

          = (W_UK^T · q_t)^T · c_s





只是换了一下括号的位置。但意义完全不同：



  * 原来：先把每个历史 token 的 c 还原成 k，再和 q 点积 → **还原 T 次**

  * 现在：先把当前的 q 变换成 
`q̃ = W_UK^T · q`
，直接和 c 点积 → **变换 1 次**



更进一步，
`q̃ = W_UK^T · W_Q · h_t`
，而 
`W_UK^T · W_Q`
 是两个固定的权重矩阵，推理前就可以**离线乘好合并成一个** 。这样推理时，K 从头到尾都不会被真正算出来。



### 6.2 手算验证



拿头 2 验证，
`q_鱼,2 = [1, 0]`
：





    q̃ = W_UK_2^T · q = [[0,1],[1,0]] · [1, 0] = [0, 1]





直接和缓存里的 c 点积：





    q̃ · c_猫 = [0,1] · [1,   0  ] = 0

    q̃ · c_吃 = [0,1] · [0,   1  ] = 1

    q̃ · c_鱼 = [0,1] · [0.5, 0.5] = 0.5





结果 
`[0, 1, 0.5]`
，和 4.4 节先还原 K 再点积的结果完全一致。



也可以验证离线合并这条路。假设头 2 的 Query 矩阵是：





    W_Q_2 = [[1, 0, 0, 0],

             [0, 0, 1, 0]]        （h_鱼 = [1,1,0,0] 算出来正是 [1, 0]）





离线合并：





    W_UK_2^T · W_Q_2 = [[0, 0, 1, 0],

                        [1, 0, 0, 0]]





直接作用在 h_鱼 上：
`[0, 1]`
，就是上面的 q̃。一个矩阵，一步到位。



### 6.3 V 这边同理：把 W_UV 吸收进输出矩阵



注意力的输出是对 V 的加权求和：





    o = Σ_s a_s · v_s = Σ_s a_s · (W_UV · c_s) = W_UV · (Σ_s a_s · c_s)





先在潜在空间里对 c 加权求和，最后只乘一次 W_UV。而 W_UV 后面紧跟着输出投影 W_O，两者同样可以离线合并成一个矩阵。



手算头 2。分数 
`[0, 1, 0.5]`
 过 softmax：





    e^0 = 1，e^1 ≈ 2.718，e^0.5 ≈ 1.649，总和 ≈ 5.367

    a ≈ [0.186, 0.507, 0.307]





设 
`W_UV_2 = [[1, 1], [0, 1]]`
。



**原路线** （先还原 V 再加权）：





    v_猫 = [1, 0]，v_吃 = [1, 1]，v_鱼 = [1, 0.5]

    o = 0.186×[1,0] + 0.507×[1,1] + 0.307×[1,0.5] ≈ [1.000, 0.661]





**吸收路线** （先对 c 加权，最后乘一次 W_UV）：





    Σ a·c = 0.186×[1,0] + 0.507×[0,1] + 0.307×[0.5,0.5] ≈ [0.340, 0.661]

    o = W_UV_2 · [0.340, 0.661] = [0.340 + 0.661, 0.661] ≈ [1.000, 0.661]





结果一致。



## 07吸收不是免费的：用计算换显存



矩阵吸收也有代价，需要说清楚。



吸收之后，q̃ 的维度从 head_dim 变成了 d_c。在 DeepSeek 的配置里，是从 128 维变成 512 维，**每个注意力分数的点积计算量变成了 4 倍** 。



之所以划算，是因为 decode 阶段的瓶颈在显存带宽而不在算力：多算一点无所谓，少读几十倍的数据才是关键。



反过来，在训练和 prefill 阶段，一次要处理大量 token，瓶颈变成了算力。这时实际实现通常不做吸收，而是直接把 K、V 还原出来，按普通的多头注意力算。**同一套权重，两种算法，看阶段选择。**



## 08压缩了，模型能力会不会变差？



这是最常见的担心。有两点值得澄清。



第一，MLA 不是把训练好的模型拿来事后压缩。它是**从训练一开始就带着这个结构** 。模型从一开始就只能通过 2 维（真实配置是 512 维）的 c 来传递 K/V 的信息，它会在这个约束下学会如何利用这些维度。



第二，和 GQA 比，MLA 保留了每个头 K/V 的差异性。DeepSeek-V2 论文的消融实验报告，MLA 的效果不输甚至略好于标准 MHA，而缓存只有它的零头。当然，这是论文在其实验设置下的结论，不同规模、不同数据下是否都成立，还有待更多验证。



## 09PyTorch 实现



下面写一个不含 RoPE 的 MLA，同时实现两条路线：
`forward_naive`
 先还原 K/V，
`forward_absorbed`
 用矩阵吸收、全程不生成 K/V，最后验证两者结果一致。





    import torch

    import torch.nn as nn

    import torch.nn.functional as F





    class MLA(nn.Module):

        """Multi-head Latent Attention（暂不含 RoPE，下期补上）"""



        def __init__(self, d_model, n_heads, d_c):

            super().__init__()

            self.n_heads = n_heads

            self.d_h = d_model // n_heads

            self.d_c = d_c



            self.W_Q   = nn.Linear(d_model, n_heads * self.d_h, bias=False)

            self.W_DKV = nn.Linear(d_model, d_c, bias=False)              # 下投影

            self.W_UK  = nn.Linear(d_c, n_heads * self.d_h, bias=False)   # K 上投影

            self.W_UV  = nn.Linear(d_c, n_heads * self.d_h, bias=False)   # V 上投影

            self.W_O   = nn.Linear(n_heads * self.d_h, d_model, bias=False)



        def forward_naive(self, h):

            """路线一：先把 c 还原成 K、V，再走标准多头注意力"""

            B, T, _ = h.shape

            c = self.W_DKV(h)                                    # (B, T, d_c)  ← 只缓存它



            q = self.W_Q(h).view(B, T, self.n_heads, self.d_h).transpose(1, 2)

            k = self.W_UK(c).view(B, T, self.n_heads, self.d_h).transpose(1, 2)

            v = self.W_UV(c).view(B, T, self.n_heads, self.d_h).transpose(1, 2)

            # q, k, v: (B, H, T, d_h)



            out = F.scaled_dot_product_attention(q, k, v, is_causal=True)

            out = out.transpose(1, 2).reshape(B, T, -1)          # (B, T, H*d_h)

            return self.W_O(out)



        def forward_absorbed(self, h):

            """路线二：矩阵吸收，全程不生成 K、V"""

            B, T, _ = h.shape

            c = self.W_DKV(h)                                    # (B, T, d_c)

            q = self.W_Q(h).view(B, T, self.n_heads, self.d_h)   # (B, T, H, d_h)



            # nn.Linear 的 weight 形状是 (out, in)，拆成每个头一块

            W_UK = self.W_UK.weight.view(self.n_heads, self.d_h, self.d_c)  # (H, d_h, d_c)

            W_UV = self.W_UV.weight.view(self.n_heads, self.d_h, self.d_c)  # (H, d_h, d_c)



            # 吸收 W_UK：q̃ = W_UK^T · q

            q_tilde = torch.einsum('bthd,hdc->bhtc', q, W_UK)    # (B, H, T, d_c)



            # q̃ 直接和缓存里的 c 点积

            scores = torch.einsum('bhtc,bsc->bhts', q_tilde, c) / self.d_h ** 0.5

            mask = torch.triu(torch.ones(T, T, dtype=torch.bool, device=h.device), 1)

            scores = scores.masked_fill(mask, float('-inf'))

            attn = scores.softmax(dim=-1)                        # (B, H, T, T)



            # 先在潜在空间加权求和，再乘一次 W_UV

            ctx = torch.einsum('bhts,bsc->bhtc', attn, c)        # (B, H, T, d_c)

            out = torch.einsum('bhtc,hdc->bthd', ctx, W_UV)      # (B, T, H, d_h)

            return self.W_O(out.reshape(B, T, -1))





    torch.manual_seed(0)

    mla = MLA(d_model=4, n_heads=2, d_c=2)

    h = torch.randn(1, 3, 4)                                     # 猫 吃 鱼



    out1 = mla.forward_naive(h)

    out2 = mla.forward_absorbed(h)

    print("两条路线结果一致：", torch.allclose(out1, out2, atol=1e-6))



    # 每 token 每层的缓存量对比

    n_heads, d_h, d_c = 2, 2, 2

    print("MHA 缓存:", 2 * n_heads * d_h)   # 8

    print("MQA 缓存:", 2 * d_h)             # 4

    print("MLA 缓存:", d_c)                 # 2





输出：





    两条路线结果一致： True

    MHA 缓存: 8

    MQA 缓存: 4

    MLA 缓存: 2





几点说明：



  * 为了对照，这里的吸收版本是在运行时做的 
`W_UK^T · q`
。真实部署中，会把 
`W_UK^T · W_Q`
 和 
`W_O · W_UV`
 离线合并成两个新矩阵，推理时一步到位。

  * 真正的 decode 循环里，每生成一个新 token，只需要把它的 c 追加进缓存，和推理优化篇的 KV Cache 写法一样，只是存的东西从 (K, V) 换成了 c。

  * 权重是随机初始化的，输出数值本身没有任何语义，这里只验证两条路线在数学上等价。



## 10小结



| MHA | GQA / MQA | MLA

---|---|---|---

缓存什么 | 每个头的 K、V | 每组共享的 K、V | 一个潜在向量 c

每个头的 K 是否不同 | 是 | 组内相同 | 是

缓存大小 | 大 | 中 / 小 | 很小

推理时额外开销 | 无 | 无 | 点积维度变大（用计算换显存）



一句话总结：**MLA 共享的不是成品，而是原料；再通过矩阵吸收，让推理时根本不需要把成品造出来。**



前置阅读：



  * 推理优化篇 EP1、EP2：KV Cache 上下

  * 
[从GPT-2到LLaMA EP4：GQA](/articles/gqa/)


  * 
[从GPT-2到LLaMA EP3：RoPE](/articles/rope/)
（下期要用）



## 下期预告：RoPE 卡住了矩阵吸收



这一期我们刻意跳过了 RoPE。把它加回来，会发生什么？



RoPE 要按位置旋转 q 和 k。加上 RoPE 后，注意力分数变成：





    score = (R_t · W_Q · h_t)^T · (R_s · W_UK · c_s)

          = h_t^T · W_Q^T · R_t^T · R_s · W_UK · c_s





注意中间那个 
`R_t^T · R_s`
，它取决于两个 token 的相对位置，每一对 token 都不一样。它卡在 W_Q 和 W_UK 之间，导致这两个矩阵**再也无法离线合并** ，这一期最巧妙的矩阵吸收直接失效。



DeepSeek 的解法叫 **decoupled RoPE** ：把位置信息单独拆成一路很小的向量，不参与压缩，也不参与吸收。上面缓存计算里那个多出来的 64 维，就是它。



下期见。



* * *



_配套互动_ ：
[在矩阵里一格一格看 MLA 和解耦 RoPE →](/matrix/deepseek/)




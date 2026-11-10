---

title: "解耦 RoPE（MLA 下）"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/mla-decoupled-rope/"

description: "从 LLaMA 到 DeepSeek 第 02 篇：解耦 RoPE。为什么 RoPE 会卡住矩阵吸收，DeepSeek 缓存里的 576 维从哪来，附 PyTorch 实现。"

---



# 解耦 RoPE（MLA 下）




[从 LLaMA 到 DeepSeek · EP02](/series/llama-to-deepseek/)




Decoupled RoPE · MLA Part 2



上一期，我们用「猫吃鱼」把 MLA 从头手算了一遍：缓存里不存 K 和 V，只存一个很短的潜在向量 c；推理时再用矩阵吸收，让 K 从头到尾都不用被算出来。



但上一期刻意跳过了一个零件：**RoPE** 。



在「从GPT-2到LLaMA」里，RoPE 已经取代了 GPT-2 的绝对位置编码，DeepSeek 当然也要用它。可一旦把 RoPE 加回 MLA，上一期最巧妙的矩阵吸收会直接失效。



上一期结尾留了一个问题：DeepSeek 每个词每层缓存 576 个数，其中 512 是 c，**多出来的 64 维是什么** ？



这一期就回答它。



* * *



## 01先回顾两件事



### 1.1 RoPE：位置是"转"进去的



RoPE 不把位置加到向量上，而是按位置去**旋转** q 和 k。位置为 t 的词，转 t·θ 的角度。



它最关键的性质，在「从GPT-2到LLaMA」RoPE 那期推过：





    (R_t · q)ᵀ · (R_s · k) = qᵀ · R_(s−t) · k





两边各转各的，点积之后，只剩下两者的**相对距离 s − t** 。这就是 RoPE 能表达相对位置的原因。



这里要记住一个前提：**旋转必须直接作用在参与点积的那两个向量上** ，也就是 q 和 k 本身。



### 1.2 矩阵吸收：换个括号，K 就不用算了



上一期的核心技巧。不加 RoPE 时，头 i 的注意力分数是：





    score = q_tᵀ · k_s

          = (W_Q · h_t)ᵀ · (W_UK · c_s)

          = h_tᵀ · (W_Qᵀ · W_UK) · c_s





中间的 
`W_Qᵀ · W_UK`
 是两个固定的权重矩阵，推理前就能离线乘好、合并成一个。于是推理时，当前词的 q 先变换成 q̃，直接和缓存里的 c 做点积，K 根本不用还原出来。



这一步能成立，靠的是一个条件：**W_Q 和 W_UK 中间什么都没有** ，两个矩阵挨在一起，才能合并。



* * *



## 02把 RoPE 加回来，会发生什么



按 RoPE 的规矩，q 要转 R_t，k 要转 R_s：





    score = (R_t · W_Q · h_t)ᵀ · (R_s · W_UK · c_s)

          = h_tᵀ · W_Qᵀ · R_tᵀ · R_s · W_UK · c_s

          = h_tᵀ · W_Qᵀ · R_(s−t) · W_UK · c_s





问题一眼就能看出来：**R_(s−t) 卡在了 W_Q 和 W_UK 中间** 。



如果 R_(s−t) 是固定的，那也没关系，三个矩阵一起合并就行。可它取决于两个词的相对距离，每一对词都不一样。



拿「鱼」（位置 2）来说，它看三个词时，中间夹的分别是：





    鱼 → 猫：R(−2)

    鱼 → 吃：R(−1)

    鱼 → 鱼：R(0)





光一个词就要三个不同的矩阵。上下文 128K 时，距离有十几万种，不可能每种距离都提前合并一份。



**矩阵吸收失效了。**



### 2.1 那退回去行不行？



失效之后，有两条退路，但都不划算。



**退路一：推理时把 K 还原出来，再旋转。** 数学上没问题，但这就回到了吸收之前的做法：每生成一个新词，都要把历史上所有词的 c 重新乘一遍 W_UK，128 个头各算一遍。上一期说过，这正是吸收想省掉的那部分开销。



**退路二：把旋转后的 K 直接存进缓存。** 也能算对，但缓存里存的又是每个头完整的 K 了。MLA 压缩缓存的意义，就全没了。



两条路，一条丢速度，一条丢显存。DeepSeek 需要第三条路。



* * *



## 03DeepSeek 的解法：把位置拆出来，单独走一路



### 3.1 直觉：包裹和面单



延续上一期的工厂比方。



上一期说，MLA 的仓库里不存成品，只存毛坯件 c，每个工位按自己的图纸加工。现在的问题是，每件货还得带上"它是第几号"的位置信息，而这个信息必须在**加工完之后** 才能打上去（旋转必须作用在最终的 q、k 上），这就和"不加工、直接用毛坯"冲突了。



DeepSeek 的办法很朴素：**货物和面单分开放** 。



  * 货物（内容信息）照旧压成毛坯 c，照旧走矩阵吸收，**完全不碰 RoPE** 。

  * 位置信息单独写在一张小面单上，这张面单**正常做 RoPE** ，也不参与压缩和吸收。

  * 最后，一个词对另一个词的关注程度 = 看货物的分数 + 看面单的分数。



这就是 **decoupled RoPE（解耦 RoPE）** ：把"内容"和"位置"解开，各走各的路。



### 3.2 翻译成公式



头 i 的 query 和 key，都由两段拼起来：





    q_t,i = [ q_t,iᶜ ; q_t,iᴿ ]      内容段 + 位置段

    k_s,i = [ k_s,iᶜ ; k_sᴿ   ]      内容段 + 位置段





  * **内容段** ：和上一期一模一样。q 从 h 来，k 从 c 来，不旋转，可以吸收。

  * **位置段** ：q 的位置段从 h 单独算出，然后做 RoPE；k 的位置段也从 h 单独算出，然后做 RoPE。



拼接后的向量做点积，等于两段分别点积再相加：





    score = q_t,iᶜ · k_s,iᶜ  +  q_t,iᴿ · k_sᴿ

             └─ 内容分数 ─┘     └─ 位置分数 ─┘





内容分数里没有 R，吸收照样成立；位置分数里有 R，但它本来就不需要吸收。问题解决。



### 3.3 一个细节：k 的位置段，所有头共用一份



注意上面的写法：q 的位置段 
`q_t,iᴿ`
 带下标 i，每个头各有一份；k 的位置段 
`k_sᴿ`
 **没有下标 i，所有头共用同一份** 。



原因还是缓存。k 的位置段做了 RoPE，没法吸收，只能老老实实存进缓存。如果每个头各存一份 64 维，128 个头就是 8192 个数，比 c 本身还大得多，压缩就白做了。



所以 DeepSeek 在位置这一路上，用的其实是 **MQA 的思路** ：所有头共用一个 key。



这样会不会损失表达能力？位置段本来就只负责"距离"这一件事，信息量远小于内容。而且每个头的 q 位置段依然是自己的，同一个共享 key，不同的头可以用不同的方式去"读"它。真正需要每个头各不相同的内容部分，仍然由 MLA 保证。



### 3.4 另一个细节：k 的位置段，旋转后直接存



RoPE 里，一个 key 转多少度，只取决于它**自己的位置** s。一个词一旦进了缓存，它的位置就再也不会变。



所以 k 的位置段可以在第一次算出来时就转好，**直接把旋转后的结果存进缓存** ，以后每一步拿来就用。这和推理优化篇里普通 KV Cache 的做法一样。



* * *



## 04手算：「猫吃鱼」加上位置



沿用上一期的设定：3 个词，d_model = 4，2 个头，潜在维度 d_c = 2。这一期新增一个**位置段维度 d_R = 2** ，正好是一对，转一个角度。



为了手算方便，频率取 θ = 1（弧度）。位置为 t 的词，就转 t 弧度。会用到的三角函数值：





    cos 0 = 1        sin 0 = 0

    cos 1 ≈ 0.540    sin 1 ≈ 0.841

    cos 2 ≈ −0.416   sin 2 ≈ 0.909





二维旋转的规则：向量 [x₀, x₁] 转 α 角，得到





    [ x₀·cos α − x₁·sin α ,  x₀·sin α + x₁·cos α ]





矩阵摆法和上一期一致：每个词占一行，行 = 词，列 = 特征。



### 4.1 内容分数：直接沿用上一期



内容段和上一期完全一样，不旋转、可以吸收。上一期算出「鱼」这一行的分数：





    头 1 内容分数：鱼→猫 = 1，  鱼→吃 = 0，  鱼→鱼 = 0.5

    头 2 内容分数：鱼→猫 = 0，  鱼→吃 = 1，  鱼→鱼 = 0.5





这一期不用重算，下面只需要算位置分数，再加上去。



### 4.2 k 的位置段：从 h 算，不从 c 算



先强调一下来源：k 的位置段是从 **h** 直接算的，用一个新矩阵 W_KR，**不经过 c** 。因为 c 那一路要留给吸收，不能被旋转污染。



三个词的 h（上一期用过的）：





    H = [[1, 0, 1, 0],    猫

         [0, 1, 0, 1],    吃

         [1, 1, 0, 0]]    鱼





W_KR 存的形状是 2×4（输出 × 输入），计算时转置：





    W_KR = [[0.5,  0.5,  0.5, 0.5],

            [0.5, −0.5, −0.5, 0.5]]





旋转前的位置 key = H × W_KRᵀ，(3×4) × (4×2) = (3×2)：





    猫：[1,0,1,0] · [0.5, 0.5, 0.5,0.5] = 1      [1,0,1,0] · [0.5,−0.5,−0.5,0.5] = 0

    吃：[0,1,0,1] · [0.5, 0.5, 0.5,0.5] = 1      [0,1,0,1] · [0.5,−0.5,−0.5,0.5] = 0

    鱼：[1,1,0,0] · [0.5, 0.5, 0.5,0.5] = 1      [1,1,0,0] · [0.5,−0.5,−0.5,0.5] = 0





三个词旋转前都是 [1, 0]。这是故意挑的数，和 RoPE 那期一样：让三个词的 key 内容相同，算出来的差别就**只来自位置** 。真实训练出的权重，算出来各不相同。



### 4.3 旋转，然后存进缓存



每个词按自己的位置旋转。[1, 0] 转 α 角，结果正好是 [cos α, sin α]：





    猫（位置 0）：[1, 0]       转 0  →  [1,      0    ]

    吃（位置 1）：[1, 0]       转 1  →  [0.540,  0.841]

    鱼（位置 2）：[1, 0]       转 2  →  [−0.416, 0.909]





这三行，就是缓存里位置段的全部内容。两个头共用这一份。



### 4.4 q 的位置段：每个头各有一份



当前要算的是「鱼」（位置 2）去看前面所有词。假设它的位置 query 旋转前：





    头 1：[1, 0]

    头 2：[0, 1]





两个头故意取得不一样，用来演示：同一份共享的 key，不同的头能读出不同的东西。



按位置 2 旋转：





    头 1：[1, 0] 转 2  →  [1×(−0.416) − 0×0.909,  1×0.909 + 0×(−0.416)] = [−0.416,  0.909]

    头 2：[0, 1] 转 2  →  [0×(−0.416) − 1×0.909,  0×0.909 + 1×(−0.416)] = [−0.909, −0.416]





### 4.5 位置分数



每个头的 q 位置段，和缓存里三个 key 分别点积。



**头 1** ，q = [−0.416, 0.909]：





    鱼→猫：[−0.416, 0.909] · [1,      0    ] = −0.416

    鱼→吃：[−0.416, 0.909] · [0.540,  0.841] = −0.225 + 0.765 = 0.540

    鱼→鱼：[−0.416, 0.909] · [−0.416, 0.909] =  0.173 + 0.826 = 1





**头 2** ，q = [−0.909, −0.416]：





    鱼→猫：[−0.909, −0.416] · [1,      0    ] = −0.909

    鱼→吃：[−0.909, −0.416] · [0.540,  0.841] = −0.491 − 0.350 = −0.841

    鱼→鱼：[−0.909, −0.416] · [−0.416, 0.909] =  0.378 − 0.378 = 0





对照一下 RoPE 的性质：头 1 的三个结果正好是 cos 2、cos 1、cos 0，头 2 正好是 sin(−2)、sin(−1)、sin 0。**分数只取决于距离 s − t** ，和两个词的绝对位置无关。



可以验证：如果整句话往后挪 5 个位置（猫吃鱼在 5、6、7），重新旋转再点积，位置分数还是这三个数。



### 4.6 加起来：最终分数





                  鱼→猫     鱼→吃     鱼→鱼

    头 1 内容      1         0         0.5

    头 1 位置     −0.416     0.540     1

    头 1 总分      0.584     0.540     1.5



    头 2 内容      0         1         0.5

    头 2 位置     −0.909    −0.841     0

    头 2 总分     −0.909     0.159     0.5





可以用拼接的方式核对一格。头 1 鱼→猫：





    q = [内容 1, 0 ; 位置 −0.416, 0.909]

    k = [内容 1, 0 ; 位置 1,      0    ]

    q · k = 1 + 0 + (−0.416) + 0 = 0.584





和"分开算再相加"完全一致。拼接点积，就等于两段分别点积之和。



**要说明的是** ，这里每个具体数值都是为了手算挑的，"位置分数把头 2 的关注从「吃」拉向了「鱼」"这类现象，不代表真实模型的行为。这一节要看的只有结构：**最终分数 = 不含旋转、可吸收的内容分数 + 含旋转、不吸收的位置分数** 。



（和上一期一样，这里省略了缩放。真实计算中，分数要除以 √(d_h + d_R)，因为拼接后每个头的 q、k 维度变成了两段之和。）



### 4.7 V 呢？



V 没有位置段。RoPE 只用来决定"看谁"，也就是分数；V 是"看到之后拿走什么"，和位置无关。所以 V 和上一期完全一样，只从 c 还原，吸收进输出矩阵的做法也照旧。



* * *



## 05推理时的完整流程



把两期合起来，推理时生成一个新词（位置 t）的步骤：





    1. h_t 进来

    2. 算 c_t = W_DKV · h_t                     → 追加进缓存

    3. 算 k_tᴿ = RoPE_t(W_KR · h_t)              → 追加进缓存

    4. 每个头：

         q̃ = (W_UKᵀ · W_Q) · h_t                 内容 query，已吸收

         qᴿ = RoPE_t(W_QR · h_t)                 位置 query

         score_s = q̃ · c_s + qᴿ · k_sᴿ           对缓存里每个 s

    5. softmax，对 c 加权求和，再乘一次 (W_O · W_UV)，已吸收





缓存里只有两样东西：每个词的 c，和每个词旋转好的 kᴿ。K 和 V 依然从来没被完整算出来过。



训练和 prefill 阶段，和上一期说的一样，通常不做吸收：直接还原出每个头的内容 K，和共享的位置 K 拼起来，按普通多头注意力算。两种算法数学上等价，下面的代码会验证。



* * *



## 06576 是怎么来的



现在可以完整回答上一期的问题了。DeepSeek-V2 / V3 的配置：





    注意力头数 n_h = 128

    每头内容维度 d_h = 128

    潜在维度 d_c = 512

    位置段维度 d_R = 64（= d_h 的一半）





每个词、每一层的缓存：





    标准多头注意力（MHA）：K、V 各 128 × 128    = 32768 个数

    MLA + 解耦 RoPE：      c 512 + kᴿ 64         = 576 个数





**512 是内容，64 是位置。** 约为 MHA 的 1/57。



DeepSeek-V2 论文给了另一个直观的换算：576 个数，相当于每个词只缓存了 **2.25 组** GQA 的 K、V（2.25 × 2 × 128 = 576）。缓存和极少组数的 GQA 差不多大，而每个头的内容 K 依然各不相同。



放回手算例子里：每个词缓存 c 的 2 个数 + kᴿ 的 2 个数，共 4 个。



顺带一提，DeepSeek 对 Q 也做了低秩压缩（V3 中压到 1536 维），q 的位置段实际是从压缩后的 Q 潜在向量算出来的。这主要是为了省训练时的激活显存，Q 不进缓存，和这一期的主线无关，代码里做了简化。



* * *



## 07PyTorch 实现



在上一期代码的基础上，加上解耦 RoPE。同样实现两条路线：
`forward_naive`
 先还原 K、V 再拼接，
`forward_absorbed`
 全程只用缓存里的 c 和 kᴿ，最后验证结果一致。



为了让形状更清楚，这里省略了 batch 维度，输入 h 的形状是 (T, d_model)。





    import math

    import torch

    import torch.nn as nn

    import torch.nn.functional as F





    def rope(x, pos, base=10000.0):

        """对最后一维做 RoPE，相邻两维一组：(0,1), (2,3), ...

        x:   (..., T, d)，d 为偶数

        pos: (T,) 每个词的位置

        """

        d = x.shape[-1]

        i = torch.arange(0, d, 2, dtype=x.dtype)

        theta = base ** (-i / d)                              # (d/2,)

        ang = pos[:, None].to(x.dtype) * theta[None, :]       # (T, d/2)

        cos, sin = ang.cos(), ang.sin()

        x0, x1 = x[..., 0::2], x[..., 1::2]

        out = torch.empty_like(x)

        out[..., 0::2] = x0 * cos - x1 * sin

        out[..., 1::2] = x0 * sin + x1 * cos

        return out





    class MLA(nn.Module):

        """Multi-head Latent Attention + 解耦 RoPE（省略 Q 压缩和 batch 维）"""



        def __init__(self, d_model, n_heads, d_c, d_rope):

            super().__init__()

            self.n_heads = n_heads

            self.d_h = d_model // n_heads

            self.d_c = d_c

            self.d_rope = d_rope



            # 内容这一路：和上一期相同

            self.W_Q   = nn.Linear(d_model, n_heads * self.d_h, bias=False)

            self.W_DKV = nn.Linear(d_model, d_c, bias=False)

            self.W_UK  = nn.Linear(d_c, n_heads * self.d_h, bias=False)

            self.W_UV  = nn.Linear(d_c, n_heads * self.d_h, bias=False)

            # 位置这一路：本期新增

            self.W_QR  = nn.Linear(d_model, n_heads * d_rope, bias=False)  # 每个头一份

            self.W_KR  = nn.Linear(d_model, d_rope, bias=False)            # 所有头共用一份



            self.W_O   = nn.Linear(n_heads * self.d_h, d_model, bias=False)

            self.scale = 1.0 / math.sqrt(self.d_h + d_rope)



        def cache(self, h, pos):

            """缓存里只有这两样"""

            c = self.W_DKV(h)                       # (T, d_c)

            k_R = rope(self.W_KR(h), pos)           # (T, d_rope)，旋转后直接存

            return c, k_R



        def queries(self, h, pos):

            T = h.shape[0]

            q_C = self.W_Q(h).view(T, self.n_heads, self.d_h).transpose(0, 1)       # (n_h, T, d_h)

            q_R = self.W_QR(h).view(T, self.n_heads, self.d_rope).transpose(0, 1)   # (n_h, T, d_rope)

            q_R = rope(q_R, pos)

            return q_C, q_R



        def _softmax(self, scores, T):

            scores = scores * self.scale

            mask = torch.triu(torch.ones(T, T, dtype=torch.bool), diagonal=1)

            scores = scores.masked_fill(mask, float("-inf"))   # 因果掩码，每一层都要

            return F.softmax(scores, dim=-1)



        def forward_naive(self, h):

            """训练 / prefill 的写法：还原 K、V，内容段和位置段拼接"""

            T = h.shape[0]

            pos = torch.arange(T)

            c, k_R = self.cache(h, pos)

            q_C, q_R = self.queries(h, pos)



            k_C = self.W_UK(c).view(T, self.n_heads, self.d_h).transpose(0, 1)   # (n_h, T, d_h)

            v   = self.W_UV(c).view(T, self.n_heads, self.d_h).transpose(0, 1)   # (n_h, T, d_h)



            q = torch.cat([q_C, q_R], dim=-1)                                     # (n_h, T, d_h + d_rope)

            k = torch.cat([k_C, k_R.expand(self.n_heads, T, self.d_rope)], dim=-1)  # 位置段复制给每个头



            attn = self._softmax(q @ k.transpose(-2, -1), T)                      # (n_h, T, T)

            out = (attn @ v).transpose(0, 1).reshape(T, -1)

            return self.W_O(out)



        def forward_absorbed(self, h):

            """推理 decode 的写法：只用缓存里的 c 和 k_R，K、V 从不还原"""

            T = h.shape[0]

            pos = torch.arange(T)

            c, k_R = self.cache(h, pos)

            q_C, q_R = self.queries(h, pos)



            W_UK = self.W_UK.weight.view(self.n_heads, self.d_h, self.d_c)   # (n_h, d_h, d_c)

            W_UV = self.W_UV.weight.view(self.n_heads, self.d_h, self.d_c)



            q_tilde = q_C @ W_UK                    # (n_h, T, d_c)  内容 query 吸收 W_UK

            score_C = q_tilde @ c.T                 # (n_h, T, T)    内容分数

            score_R = q_R @ k_R.T                   # (n_h, T, T)    位置分数，k_R 所有头共用

            attn = self._softmax(score_C + score_R, T)



            latent = attn @ c                       # (n_h, T, d_c)  先在潜在空间加权求和

            out = latent @ W_UV.transpose(-2, -1)   # (n_h, T, d_h)  最后才乘一次 W_UV

            out = out.transpose(0, 1).reshape(T, -1)

            return self.W_O(out)





    torch.manual_seed(0)

    mla = MLA(d_model=64, n_heads=4, d_c=8, d_rope=4)

    h = torch.randn(10, 64)



    out_naive = mla.forward_naive(h)

    out_absorbed = mla.forward_absorbed(h)

    print(out_naive.shape)                                        # torch.Size([10, 64])

    print(torch.allclose(out_naive, out_absorbed, atol=1e-5))     # True





几点说明：



  * 两条路线唯一的区别，在于内容分数是"先还原 K 再点积"还是"先变换 q 再和 c 点积"。位置分数在两条路线里算法完全相同，因为它本来就没有吸收。

  * 
`k_R.expand(...)`
 只是把共享的位置 key 复制给每个头参与拼接，缓存里始终只存一份。

  * 代码里每次都把整段序列重新算一遍，只为验证等价。真实的 decode 循环里，每生成一个词，只需要把它的 c 和 kᴿ 追加进缓存，写法和推理优化篇的 KV Cache 一样，存的东西从 (K, V) 换成了 (c, kᴿ)。

  * 权重是随机初始化的，输出没有任何语义，这里只验证两条路线在数学上等价。



* * *



## 08小结



| 内容这一路 | 位置这一路

---|---|---

来源 | q 从 h，k 从 c | q、k 都从 h 单独算

是否做 RoPE | 否 | 是

是否压缩 | 是（k 来自 c） | 否

是否矩阵吸收 | 是 | 否

k 是否每头不同 | 是（MLA 思路） | 否，所有头共用（MQA 思路）

缓存（每词每层） | c，512 | 旋转好的 kᴿ，64



一句话总结：**RoPE 和矩阵吸收不能共存在同一路上，那就分成两路：内容走压缩和吸收，位置走 RoPE，最后把两个分数加起来。**



回头看，MLA 的两期其实是同一个思路用了两次：上一期，K 和 V 太大，就只存生成它们的原料；这一期，位置信息和吸收冲突，就把它拆出来，用最小的代价单独存。DeepSeek 的设计里，每一处取舍都在回答同一个问题：**缓存里，到底什么是非存不可的。**



前置阅读：



  * 
[从LLaMA到DeepSeek EP1：MLA（上）](/articles/mla/)


  * 
[从GPT-2到LLaMA EP3：RoPE](/articles/rope/)


  * 
[从GPT-2到LLaMA EP4：GQA](/articles/gqa/)
（MQA 是它的极端情况）

  * 推理优化篇 EP1、EP2：KV Cache 上下



* * *



## 下期预告：DeepSeekMoE



MLA 两期讲完，注意力这一块的零件就换完了。下一个零件，在 FFN。



「Switch Transformer 论文精读」里讲过 MoE：把一个大 FFN 拆成很多个专家，每个词只路由给其中一个。DeepSeek 在这个基础上又改了两刀：



一是**把专家切得更细** 。专家数量更多、每个更小，每个词同时激活多个。 二是**留几个共享专家** 。不管什么词，都必定经过它们，专门存放通用知识。



为什么要这么切？切细了，路由不会更难吗？共享专家和 Switch 里那套负载均衡又是什么关系？



下期还是用「猫吃鱼」，手算一遍。



* * *



_配套互动_ ：
[在矩阵里一格一格看 MLA 和解耦 RoPE →](/matrix/deepseek/)




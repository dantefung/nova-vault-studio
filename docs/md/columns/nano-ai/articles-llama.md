---

title: "组装完整模型"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/llama/"

description: "从 GPT-2 到 LLaMA 第 05 篇：LLaMA，组装完整模型。结合手算示例与 PyTorch 实现，理解模型组件的变化。"

---



# 组装完整模型




[从 GPT-2 到 LLaMA · EP05](/series/gpt2-to-llama/)




LLaMA



> 前四期，我们把 GPT-2 里的四个零件一个个拆下来、换成新的：

>

>

>     GPT-2                    →   现代 LLM

>     LayerNorm                →   RMSNorm      （EP1）

>     GELU FFN                 →   SwiGLU       （EP2）

>     可学习绝对位置向量        →   RoPE         （EP3）

>     MHA                      →   GQA          （EP4）

>

>

> 这一期不讲新零件，只做一件事：**把它们装回去，看看装好的东西是不是就是 LLaMA。**

>

> 三个问题：LLaMA Block 和 GPT-2 Block 到底差在哪几行？四个零件分别装在哪个位置？LLaMA 的配置文件里每个参数，对应前面哪一期？



* * *



## 01先说结论：骨架没动，零件全换



先把推理篇 EP11 写过的 GPT-2 Block 拿出来，和 LLaMA Block 并排放：





    # GPT-2 Block（推理篇 EP11）

    x = x + attn(ln_1(x))      # LayerNorm → MHA（位置信息在进 Block 之前就加好了）

    x = x + mlp(ln_2(x))       # LayerNorm → GELU FFN



    # LLaMA Block

    x = x + attn(norm_1(x))    # RMSNorm → GQA（RoPE 在 attn 内部，对 q、k 旋转）

    x = x + mlp(norm_2(x))     # RMSNorm → SwiGLU





两行代码的形状一模一样：



  * 都是 **Pre-LN** ：先归一化，再进子层。

  * 都是 **残差连接** ：加回去的是原始的 
`x`
，不是归一化之后的 
`x`
（原系列反复强调过的那个坑，LLaMA 里照样成立）。

  * 都是 **两个子层** ：先注意力，后前馈。



所以 LLaMA 并不是一个"全新架构"。**Transformer 的骨架一行没改，改的是骨架上挂的四个零件。** 这也是整个进阶篇「从 GPT-2 到 LLaMA」能成立的前提：GPT-2 吃透了，LLaMA 就只是一份"换件清单"。



* * *



## 02逐个位置对照：零件装在哪



把一次完整的前向过程按顺序摊开，左边 GPT-2，右边 LLaMA：





             GPT-2                              LLaMA

             ─────                              ─────

    token →  wte 查表                           embed_tokens 查表

             + wpe 位置向量  ←────── 删掉 ────→  （没有这一步）



    ┌ Block × N ──────────────────┐   ┌ Block × N ──────────────────┐

    │ ln_1        LayerNorm       │   │ input_layernorm   RMSNorm    │ ← EP1

    │ attn        MHA             │   │ self_attn         GQA        │ ← EP4

    │                             │   │   └ q、k 上做 RoPE           │ ← EP3

    │ + 残差                      │   │ + 残差                       │

    │ ln_2        LayerNorm       │   │ post_attention_layernorm     │ ← EP1

    │ mlp         GELU FFN        │   │ mlp               SwiGLU     │ ← EP2

    │ + 残差                      │   │ + 残差                       │

    └─────────────────────────────┘   └──────────────────────────────┘



             ln_f       LayerNorm               norm      RMSNorm       ← EP1

             lm_head    （和 wte 共享权重）      lm_head   （独立权重）





（右边用的是 HuggingFace LLaMA 实现里的模块名，后面加载权重时会直接用到。）



有一处值得多看一眼：**位置信息的注入点变了。**



  * GPT-2 在最开头加一次位置向量，之后每一层靠残差把它"带下去"。

  * LLaMA 开头什么都不加，而是在**每一层** 的注意力里，对 q、k 做一次旋转。



这正是 EP3 说的：RoPE 只作用在 q·k 的点积上，让注意力分数只依赖相对距离。它不碰 v，也不碰残差流。



* * *



## 03四个大零件之外，还有三处小改动



逐行对比时，还会发现三处不在"四大零件"里的差别。它们不值得单独开一期，但加载权重时都会碰到。



### 1\. 所有 Linear 层去掉了 bias



GPT-2 的注意力投影、FFN、LayerNorm 都带 bias。LLaMA 全部去掉：q/k/v/o 投影、gate/up/down 投影都是 
`bias=False`
，RMSNorm 本身也只有缩放参数、没有偏移参数（EP1 讲过）。



对效果影响不大，好处是参数和代码都更干净。



### 2\. 位置向量表没了



GPT-2 有一张 
`wpe`
，形状 
`[1024, 768]`
，是要训练的参数。1024 这个数直接写死了模型能处理的最大长度。



LLaMA 的 RoPE 是用公式算出来的 cos/sin，**没有任何可学习参数** 。配置文件里的 
`max_position_embeddings`
 只是"训练时用过的长度"，不是一张权重表的行数。



### 3\. 输入 embedding 和输出层不再共享权重



GPT-2 的 
`lm_head`
 直接复用 
`wte`
 的权重（weight tying），省了一份 
`[50257, 768]`
 的矩阵。



LLaMA-1/2/3 的主力尺寸都不共享，
`embed_tokens`
 和 
`lm_head`
 各有一份。词表一大，这两份就很可观：LLaMA-3 8B 的词表是 128256，每份是 
`128256 × 4096 ≈ 5.25 亿`
 个参数，两份加起来占了总参数的 13% 左右。



> 共不共享是个权衡，不是谁对谁错。Meta 后来的小尺寸模型（比如 Llama 3.2 1B）又重新共享了，因为模型越小，词表矩阵占的比例越大。



* * *



## 04猫吃鱼：把一个"迷你 LLaMA"从头走到尾



这一期不手算具体数值（每个零件的数值前四期都算过了），只把**形状** 一路标出来，确认零件装上去之后能严丝合缝地接上。



还是"猫吃鱼"，
`d_model=4`
。迷你配置取：





    vocab_size   = 3      词表只有 猫、吃、鱼

    d_model      = 4

    n_layers     = 2

    n_heads      = 2      → head_dim = 4 / 2 = 2

    n_kv_heads   = 1      → 2 个 Q 头共用 1 份 KV

    ffn_hidden   = 3      沿用 SwiGLU 那期手算用的 h=3





> 为什么不沿用 GQA 那期的 4 个 Q 头？因为那样 head_dim=1，而 RoPE 是**两两配对旋转** 的，head_dim 必须是偶数。2 个头、head_dim=2 正好是"一对"，能转起来。这只是为了凑出能手算的最小配置。



### 输入





    token id: [0, 1, 2]                        猫、吃、鱼

    embed_tokens 查表:   [3] → [3, 4]

    （GPT-2 这里还要 + wpe，LLaMA 没有）





### 第 1 个 Block · 注意力子层





    input_layernorm (RMSNorm):   [3, 4] → [3, 4]                     EP1



    q_proj:  [3, 4] → [3, 4] → 拆头 → [2, 3, 2]    2 个 Q 头

    k_proj:  [3, 4] → [3, 2] → 拆头 → [1, 3, 2]    1 个 KV 头          EP4

    v_proj:  [3, 4] → [3, 2] → 拆头 → [1, 3, 2]



    RoPE 旋转 q、k:  形状不变                                          EP3

      head_dim=2 只有一对维度，频率 θ^0 = 1

      猫 转 0 弧度，吃 转 1 弧度，鱼 转 2 弧度



    （KV Cache 存在这里：[1, 3, 2]，只有 1 个头）



    repeat_kv:  k、v  [1, 3, 2] → [2, 3, 2]                           EP4

    scores = q @ kᵀ / √2:   [2, 3, 3]，加因果掩码，softmax

    weights @ v:            [2, 3, 2]

    拼接 2 个头:             [3, 4]

    o_proj:                 [3, 4] → [3, 4]



    残差:  h = x + 上面的结果                 [3, 4]





### 第 1 个 Block · 前馈子层





    post_attention_layernorm (RMSNorm):   [3, 4] → [3, 4]             EP1



    gate_proj:  [3, 4] → [3, 3]                                        EP2

    up_proj:    [3, 4] → [3, 3]

    SiLU(gate) * up:      [3, 3]

    down_proj:  [3, 3] → [3, 4]



    残差:  out = h + 上面的结果               [3, 4]





### 第 2 个 Block





    [3, 4] → 和第 1 个 Block 完全一样的流程 → [3, 4]





### 输出





    norm (RMSNorm):  [3, 4] → [3, 4]

    lm_head:         [3, 4] → [3, 3]          每个位置对 3 个词的 logits





把这条链看完，有一个和推理篇 EP12 一模一样的结论：**每个 Block 进去是
`[3, 4]`
，出来还是 
`[3, 4]`
。** 形状不变，才能一层层堆下去。四个零件换完之后，这个性质一点没受影响：



  * RMSNorm 和 LayerNorm 一样不改形状；

  * GQA 虽然 K、V 变窄了，但 repeat_kv 之后又对齐回去，拼接输出仍是 
`d_model`
；

  * RoPE 只是旋转，不改形状；

  * SwiGLU 中间维度变了，但 down_proj 又投回 
`d_model`
。



* * *



## 05参数都去哪了



形状对上了，再看参数量。为了公平，拿同样 
`d_model = 4096`
 的两种 Block 比：



  * **GPT-2 式 Block** ：MHA（32 个头）+ 4 倍宽 GELU FFN，带 bias，LayerNorm

  * **LLaMA-3 8B 的 Block** ：GQA（32 个 Q 头、8 个 KV 头）+ SwiGLU（中间维度 14336），无 bias，RMSNorm







                        GPT-2 式 Block        LLaMA-3 8B Block

    注意力              约 6713 万            约 4194 万     ↓ 37.5%

      q / k / v / o     4096×4096 各一份      k、v 只有 4096×1024

    前馈                约 1.34 亿            约 1.76 亿     ↑ 31%

      结构              2 个矩阵，4d 宽       3 个矩阵，3.5d 宽

    归一化              1.6 万                0.8 万

    ─────────────────────────────────────────────────────

    合计                约 2.01 亿            约 2.18 亿





两个观察：



**1\. GQA 把注意力的参数砍掉了三分之一多。** EP4 讲的是它省 KV Cache，顺带也省了 W_k、W_v 的参数：从 
`4096×4096`
 变成 
`4096×1024`
。



**2\. 参数在往 FFN 那边挪。** SwiGLU 有三个矩阵，按 EP2 的说法，为了让参数量和原来的 FFN 持平，中间维度应该取 
`2/3 × 4d`
。LLaMA-1/2 的 7B 就是这么做的：
`2/3 × 4 × 4096 ≈ 10923`
，再向上取到 256 的倍数，得到 **11008** 。LLaMA-3 8B 则直接给到了 **14336** （3.5 倍），比"持平"还多了一截。



> 这里只是陈述两个版本的配置差异。LLaMA-3 为什么把 FFN 加宽，Meta 没有单独解释过，不要脑补成"GQA 省下来的参数挪给了 FFN"这种因果关系。



整体规模再对一下数：32 个这样的 Block 是 69.8 亿，加上两份 5.25 亿的词表矩阵，总数 **约 80.3 亿** ，这就是"8B"的来历。作为对照，GPT-2 small 是 1.24 亿。



* * *



## 06读懂 LLaMA 的配置文件



这一期最实用的部分。下面是 HuggingFace 上 LLaMA-3 8B 的 
`config.json`
 里和结构相关的字段，逐个对到前面的内容：





    "vocab_size":              128256    词表大小          推理篇 EP02 Tokenizer（GPT-2 是 50257）

    "hidden_size":             4096      d_model           原系列 Embedding

    "num_hidden_layers":       32        Block 堆几层      推理篇 EP12 堆叠

    "num_attention_heads":     32        Q 头数            原系列 多头注意力

    "num_key_value_heads":     8         KV 头数           进阶篇「从 GPT-2 到 LLaMA」 EP4 GQA

    "intermediate_size":       14336     SwiGLU 中间维度   进阶篇「从 GPT-2 到 LLaMA」 EP2

    "hidden_act":              "silu"    SwiGLU 的门       进阶篇「从 GPT-2 到 LLaMA」 EP2

    "rms_norm_eps":            1e-05     RMSNorm 的 ε      进阶篇「从 GPT-2 到 LLaMA」 EP1

    "rope_theta":              500000.0  RoPE 的底数       进阶篇「从 GPT-2 到 LLaMA」 EP3

    "max_position_embeddings": 8192      训练用过的长度    （不是权重表）

    "attention_bias":          false     注意力无 bias     本期第三节

    "tie_word_embeddings":     false     不共享词表矩阵    本期第三节






`head_dim`
 没有直接写，是算出来的：
`4096 / 32 = 128`
。



有两个字段值得多说一句：



**
`num_key_value_heads`
。** 如果它等于 
`num_attention_heads`
，就是普通 MHA。比如 LLaMA-2 7B 这一项是 32，和 Q 头数相同，说明它**没用 GQA** ；LLaMA-2 里只有 70B 这类大尺寸用了。到 LLaMA-3，8B 也换上了 GQA。所以"LLaMA 用 GQA"这句话要说清楚是哪一代、哪个尺寸。



**
`rope_theta`
。** EP3 里的频率是 
`θ_i = base^(-2i/d)`
，这个 base 默认是 10000，LLaMA-2 就是 10000。LLaMA-3 调到了 500000，底数越大，低频那几对维度转得越慢，"钟表的时针"走一圈要更久，能区分的距离就更远。这和长上下文直接相关，EP3 结尾预告过，这里先不展开。



这张表的意义在于：**以后拿到任何一个 LLaMA 系的模型（包括 Qwen、Mistral 等很多结构相近的模型），打开 config.json，你都能说出每一行对应 Transformer 里的哪个零件。**



* * *



## 07一个类比：流水线没改，工位上的设备换了



推理篇 EP12 把堆叠的 Block 比作一条装配流水线：每个工位（Block）接过半成品，加工一下，原样尺寸传给下一个工位。



LLaMA 的升级，相当于**流水线的布局一点没动，只是把每个工位上的设备换成了新型号** ：



  * **质检台** （归一化）：从"既校准中心又校准幅度"的老设备，换成"只校准幅度"的轻量设备。（RMSNorm）

  * **主加工机** （FFN）：加了一个阀门，先判断这批料该放多少过去，再加工。（SwiGLU）

  * **定位系统** （位置编码）：以前是进厂时贴一张绝对编号的标签；现在是每个工位上，按两件货之间的距离现场校准。（RoPE）

  * **资料室** （注意力的 K、V）：以前每个调查员一间，现在几个人共用一间。（GQA，EP4 的类比）



流水线没改，所以原系列学到的东西全部还有效；设备换了，所以同样的厂房能做出更好、更快的产品。



* * *



## 08完整代码：一个能跑的迷你 LLaMA



把前四期的零件拼成一个完整模型。为了让这一期自成一体，下面每个零件都重新写了一遍，函数签名可能和你前几期的版本略有出入，**如果你已有自己的实现，直接替换对应模块即可** 。



RoPE 这里采用 HuggingFace 的**前后半配对** 写法（
`rotate_half`
），因为下一步要加载的就是 HuggingFace 格式的权重，EP3 讲过这两种配对方式的区别。





    import torch

    import torch.nn as nn

    import torch.nn.functional as F

    from dataclasses import dataclass





    @dataclass

    class LlamaConfig:

        vocab_size: int = 3

        d_model: int = 4

        n_layers: int = 2

        n_heads: int = 2

        n_kv_heads: int = 1

        ffn_hidden: int = 3

        max_len: int = 16

        rope_theta: float = 10000.0

        eps: float = 1e-5





    # ---------- EP1: RMSNorm ----------

    class RMSNorm(nn.Module):

        def __init__(self, d, eps=1e-5):

            super().__init__()

            self.eps = eps

            self.weight = nn.Parameter(torch.ones(d))          # 只有缩放，没有偏移



        def forward(self, x):

            rms = torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)

            return x * rms * self.weight





    # ---------- EP2: SwiGLU ----------

    class SwiGLU(nn.Module):

        def __init__(self, d, hidden):

            super().__init__()

            self.gate_proj = nn.Linear(d, hidden, bias=False)

            self.up_proj = nn.Linear(d, hidden, bias=False)

            self.down_proj = nn.Linear(hidden, d, bias=False)



        def forward(self, x):

            return self.down_proj(F.silu(self.gate_proj(x)) * self.up_proj(x))





    # ---------- EP3: RoPE（前后半配对，HF 风格） ----------

    def precompute_rope(head_dim, max_len, theta=10000.0):

        inv_freq = 1.0 / (theta ** (torch.arange(0, head_dim, 2).float() / head_dim))  # [head_dim/2]

        pos = torch.arange(max_len).float()

        freqs = torch.outer(pos, inv_freq)                     # [max_len, head_dim/2]

        emb = torch.cat([freqs, freqs], dim=-1)                # [max_len, head_dim]

        return emb.cos(), emb.sin()





    def rotate_half(x):

        half = x.shape[-1] // 2

        x1, x2 = x[..., :half], x[..., half:]

        return torch.cat([-x2, x1], dim=-1)





    def apply_rope(x, cos, sin):

        # x: [B, H, T, head_dim]

        T = x.shape[-2]

        return x * cos[:T] + rotate_half(x) * sin[:T]





    # ---------- EP4: GQA ----------

    def repeat_kv(x, n_rep):

        if n_rep == 1:

            return x

        B, H_kv, T, D = x.shape

        x = x[:, :, None, :, :].expand(B, H_kv, n_rep, T, D)

        return x.reshape(B, H_kv * n_rep, T, D)





    class Attention(nn.Module):

        def __init__(self, cfg):

            super().__init__()

            self.n_heads = cfg.n_heads

            self.n_kv_heads = cfg.n_kv_heads

            self.head_dim = cfg.d_model // cfg.n_heads

            self.n_rep = cfg.n_heads // cfg.n_kv_heads

            self.q_proj = nn.Linear(cfg.d_model, cfg.n_heads * self.head_dim, bias=False)

            self.k_proj = nn.Linear(cfg.d_model, cfg.n_kv_heads * self.head_dim, bias=False)

            self.v_proj = nn.Linear(cfg.d_model, cfg.n_kv_heads * self.head_dim, bias=False)

            self.o_proj = nn.Linear(cfg.n_heads * self.head_dim, cfg.d_model, bias=False)



        def forward(self, x, cos, sin):

            B, T, _ = x.shape

            q = self.q_proj(x).view(B, T, self.n_heads, self.head_dim).transpose(1, 2)

            k = self.k_proj(x).view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)

            v = self.v_proj(x).view(B, T, self.n_kv_heads, self.head_dim).transpose(1, 2)



            q = apply_rope(q, cos, sin)        # EP3：只转 q、k

            k = apply_rope(k, cos, sin)        # v 不转

            # KV Cache 应该存在这里：旋转之后、repeat 之前



            k = repeat_kv(k, self.n_rep)       # EP4

            v = repeat_kv(v, self.n_rep)



            scores = q @ k.transpose(-2, -1) / (self.head_dim ** 0.5)

            mask = torch.triu(torch.ones(T, T, dtype=torch.bool, device=x.device), diagonal=1)

            scores = scores.masked_fill(mask, float("-inf"))

            out = F.softmax(scores, dim=-1) @ v                   # [B, n_heads, T, head_dim]

            out = out.transpose(1, 2).contiguous().view(B, T, -1)  # [B, T, d_model]

            return self.o_proj(out)





    # ---------- 装配：LLaMA Block ----------

    class LlamaBlock(nn.Module):

        def __init__(self, cfg):

            super().__init__()

            self.input_layernorm = RMSNorm(cfg.d_model, cfg.eps)

            self.self_attn = Attention(cfg)

            self.post_attention_layernorm = RMSNorm(cfg.d_model, cfg.eps)

            self.mlp = SwiGLU(cfg.d_model, cfg.ffn_hidden)



        def forward(self, x, cos, sin):

            x = x + self.self_attn(self.input_layernorm(x), cos, sin)   # 和 GPT-2 同一个骨架

            x = x + self.mlp(self.post_attention_layernorm(x))

            return x





    # ---------- 装配：完整模型 ----------

    class Llama(nn.Module):

        def __init__(self, cfg):

            super().__init__()

            self.embed_tokens = nn.Embedding(cfg.vocab_size, cfg.d_model)

            # 注意：没有位置向量表

            self.layers = nn.ModuleList([LlamaBlock(cfg) for _ in range(cfg.n_layers)])

            self.norm = RMSNorm(cfg.d_model, cfg.eps)

            self.lm_head = nn.Linear(cfg.d_model, cfg.vocab_size, bias=False)  # 不和 embed 共享



            cos, sin = precompute_rope(cfg.d_model // cfg.n_heads, cfg.max_len, cfg.rope_theta)

            self.register_buffer("cos", cos, persistent=False)   # buffer：跟着 .to(device) 走，但不算参数

            self.register_buffer("sin", sin, persistent=False)



        def forward(self, idx):

            x = self.embed_tokens(idx)                  # [B, T, d_model]

            for layer in self.layers:

                x = layer(x, self.cos, self.sin)        # 形状不变

            x = self.norm(x)

            return self.lm_head(x)                      # [B, T, vocab_size]





和推理篇 EP12 的 
`GPT`
 类对比，
`Llama`
 类只有三处不同：少了位置向量表、多了 cos/sin 两个 buffer、
`lm_head`
 不和 embedding 共享。其余的变化全部藏在 Block 内部的零件里。



### 验证：形状和参数量





    torch.manual_seed(0)

    cfg = LlamaConfig()

    model = Llama(cfg)



    idx = torch.tensor([[0, 1, 2]])          # 猫 吃 鱼

    logits = model(idx)

    print(logits.shape)                      # torch.Size([1, 3, 3])



    print(sum(p.numel() for p in model.parameters()))   # 212





212 这个数可以手算核对：





    每个 Block：

      q_proj 4×4=16，k_proj 4×2=8，v_proj 4×2=8，o_proj 4×4=16      → 48

      gate/up/down 各 4×3=12                                           → 36

      两个 RMSNorm 各 4                                                → 8

      合计 92，两层 184



    embed_tokens 3×4=12，lm_head 4×3=12，最后的 norm 4                → 28



    总计 184 + 28 = 212





cos/sin 是用 
`register_buffer`
 注册的，不计入参数，这也从代码层面印证了"RoPE 没有可学习参数"。



> 和之前每一期一样：这是随机初始化的模型，输出的 logits 没有任何语义。要让它真的说出话来，得加载预训练权重。



* * *



## 09加载真实权重前，先把坑列出来



拿这份代码去加载 HuggingFace 上的 LLaMA 权重，会踩的坑前面几期其实都埋过伏笔，汇总一下：



**1\. 模块名要对上。** 上面的代码已经刻意用了 HF 的命名（
`self_attn.q_proj`
、
`mlp.gate_proj`
、
`input_layernorm`
 等），外面还要包一层 
`model.`
，比如 
`model.layers.0.self_attn.q_proj.weight`
。



**2\. 不用转置了。** 原系列加载 GPT-2 时，HF 的 GPT-2 用的是 Conv1D，权重形状是 
`[in, out]`
，要转置才能塞进 
`nn.Linear`
。HF 的 LLaMA 用的就是 
`nn.Linear`
，形状直接对得上。这个坑这次反而没有了。



**3\. RoPE 配对方式要一致（EP3 的坑）。** Meta 原始权重按相邻配对训练，HF 在转换格式时对 q_proj、k_proj 的权重做过一次重排，所以 HF 权重要配 
`rotate_half`
 写法。混用的话不报错，输出全乱。



**4\. repeat_kv 的顺序（EP4 的坑）。** 必须是 
`kv0, kv0, kv1, kv1`
，不能是 
`kv0, kv1, kv0, kv1`
。



**5\. 不要共享 lm_head。** 习惯性地照搬 GPT-2 的 weight tying，会把 
`lm_head.weight`
 覆盖掉。



这五个坑有一个共同点，原系列已经总结过：**形状对了，不代表语义对了。**



* * *



## 10这一期的要点



  1. **LLaMA 的骨架和 GPT-2 相同** ：Pre-LN、残差、注意力 + 前馈两个子层、多层堆叠。变的是骨架上的零件。

  2. **四个零件各就各位** ：两处归一化换成 RMSNorm，注意力换成 GQA，位置编码从"开头加一次"变成"每层对 q、k 旋转"的 RoPE，FFN 换成 SwiGLU。

  3. **还有三处小改动** ：去掉 bias、去掉位置向量表、embedding 和 lm_head 不共享。

  4. **每个 Block 进出形状不变** ，所以零件全换之后，仍然能像原系列一样一层层堆起来。

  5. **config.json 的每一行都能对应到具体零件** 。看懂这张表，就看懂了一大类开源模型的结构。



* * *



## 系列收尾与后续方向



到这里，进阶篇「从 GPT-2 到 LLaMA」的主线完成了：从 GPT-2 出发，换完四个零件，组装出一个结构上和 LLaMA 一致的模型。



不过 EP4 里留了一句话：教学版的 
`repeat_kv`
 会真的把 K、V 复制一份，生产环境的注意力内核不这么干。不止如此，我们一直在用的那段注意力代码，
`scores`
 是一个 
`[T, T]`
 的完整矩阵，序列一长，光存它就是灾难。



后续可以继续学习 **FlashAttention** ：注意力的数学公式一个字都不改，只改计算顺序，为什么就能又快又省显存？



* * *



_参考论文_



  * Touvron, H., et al. (2023). _LLaMA: Open and Efficient Foundation Language Models._

  * Touvron, H., et al. (2023). _Llama 2: Open Foundation and Fine-Tuned Chat Models._

  * Grattafiori, A., et al. (2024). _The Llama 3 Herd of Models._

  * Zhang, B., & Sennrich, R. (2019). _Root Mean Square Layer Normalization._

  * Shazeer, N. (2020). _GLU Variants Improve Transformer._

  * Su, J., et al. (2021). _RoFormer: Enhanced Transformer with Rotary Position Embedding._

  * Ainslie, J., et al. (2023). _GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints._



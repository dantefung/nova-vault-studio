---

title: "一张图看懂 Transformer"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/papers/attention-is-all-you-need/"

description: "把 Transformer 论文的 Figure 1 重画成可交互的动态图：一步一步看数据从输入走到输出，每一步对照论文原文。"

---



# 一张图看懂 Transformer




[大模型论文研读 · Transformer](/papers/)




Attention Is All You Need（Vaswani et al., 2017）· Figure 1 动态版



这是论文里最有名的那张架构图。原图把所有模块一次画完，看不出先后顺序。下面按数据流动的顺序，一步一步走一遍：每一步高亮正在工作的模块，配上论文原文和白话解释。点图里任意一个模块，可以直接跳到对应那一步。



InputEmbeddingMulti-HeadAttentionAdd & NormFeedForwardAdd & NormOutputEmbeddingMaskedMulti-HeadAttentionAdd & NormMulti-HeadAttentionAdd & NormFeedForwardAdd & NormLinearSoftmaxInputsOutputs(shifted right)OutputProbabilitiesPositionalEncodingPositionalEncodingN×N×VKQVKQVKQ原图未画出编码器最终输出（K、V） 根据原论文 Figure 1 重绘 · Vaswani et al., 2017



总览



## 总览：左边读，右边写



> “The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves of Figure 1, respectively.”

>

> — 原文 §3



这篇论文做的是机器翻译（英译德）。整张图分左右两半：



**左边 Encoder（编码器）** ：把整句英文读进来，理解成一组向量。

**右边 Decoder（解码器）** ：一边看编码器的理解，一边一个词一个词地写出德文。



整张图里没有 RNN，也没有卷积，只有注意力和全连接层，这就是标题 _Attention Is All You Need_ 的意思。



---



## 论文逐章导读



### 第 0 步



总览 总览：左边读，右边写 “The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder, shown in the left and right halves of Figure 1, respectively.” — 原文 §3 这篇论文做的是机器翻译（英译德）。整张图分左右两半： 左边 Encoder（编码器） ：把整句英文读进来，理解成一组向量。 右边 Decoder（解码器） ：一边看编码器的理解，一边一个词一个词地写出德文。 整张图里没有 RNN，也没有卷积，只有注意力和全连接层，这就是标题 Attention Is All You Need 的意思。 ← 上一步 开始 → 也可以用键盘 ← →



### 第 1 步



第 1 / 12 步 输入：把词变成向量 “Similarly to other sequence transduction models, we use learned embeddings to convert the input tokens and output tokens to vectors of dimension d_model.” — 原文 §3.4 模型不认识文字，只认识数字。每个词先查一张「嵌入表」，换成一个长度为 d model = 512 的向量。 一句话有 n 个词，进来之后就是一个 n × 512 的矩阵，后面所有模块处理的都是它。 去 大模型是怎么推理的 · 词嵌入 ，看这一步的矩阵具体怎么算 → ← 上一步 下一步 → 也可以用键盘 ← →



### 第 2 步



第 2 / 12 步 位置编码：告诉模型词的顺序 “Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence.” — 原文 §3.5 注意力本身不区分顺序：把「猫吃鱼」打乱成「鱼吃猫」，每个词算出来的结果一模一样。 所以要在词向量上 直接加 （图里的 ⊕）一个代表位置的向量。论文用的是不同频率的正弦和余弦函数，不需要训练。 维度0 维度2 维度4 维度6 位置 0 → 示意：低维度波动快、高维度波动慢。每个位置在所有维度上取值的组合都不一样，像一个独特的「位置指纹」。 去 大模型是怎么推理的 · 位置编码 ，看这一步的矩阵具体怎么算 → ← 上一步 下一步 → 也可以用键盘 ← →



### 第 3 步



第 3 / 12 步 自注意力：每个词看全句 “In a self-attention layer all of the keys, values and queries come from the same place, in this case, the output of the previous layer in the encoder.” — 原文 §3.2.3 注意图上进入 Multi-Head Attention 的 三根箭头 ：同一份输入，复制三份，分别变成 Q（查询）、K（键）、V（值）。 每个词用自己的 Q 去和所有词的 K 比相似度，再按相似度把所有词的 V 加权混合。这样每个词一步就能拿到全句的信息，不用像 RNN 那样一个词一个词地传。 「Multi-Head」是指这件事并行做 8 次 （8 个头），每个头可以关注不同的关系。 去 大模型是怎么推理的 · Q、K、V ，看这一步的矩阵具体怎么算 → ← 上一步 下一步 → 也可以用键盘 ← →



### 第 4 步



第 4 / 12 步 Add & Norm：残差 + 归一化 “That is, the output of each sub-layer is LayerNorm(x + Sublayer(x)), where Sublayer(x) is the function implemented by the sub-layer itself.” — 原文 §3.1 看图上 绕过模块的那根箭头 ：子层的输入 x 不经过处理，直接跳过去和子层的输出相加（Add），再做 LayerNorm（Norm）。 这条「捷径」让梯度能直接往回传，模型叠很多层也训得动。 后来的大模型（GPT-2 之后）大多把 Norm 挪到了子层前面（Pre-LN），训练更稳。 去 大模型是怎么推理的 · 残差 + LayerNorm ，看这一步的矩阵具体怎么算 → ← 上一步 下一步 → 也可以用键盘 ← →



### 第 5 步



第 5 / 12 步 前馈网络：每个词单独加工 “…a fully connected feed-forward network, which is applied to each position separately and identically. This consists of two linear transformations with a ReLU activation in between.” — 原文 §3.3 注意力负责词与词之间 交换信息 ；前馈网络负责每个词 自己消化 。 它对每个词单独做：512 维 → 升到 2048 维 → ReLU → 降回 512 维。所有词用同一组参数。 去 大模型是怎么推理的 · 前馈网络 FFN ，看这一步的矩阵具体怎么算 → ← 上一步 下一步 → 也可以用键盘 ← →



### 第 6 步



第 6 / 12 步 N×：同样的层叠 6 次 “The encoder is composed of a stack of N = 6 identical layers.” — 原文 §3.1 图上灰色大框旁边的「N×」很容易被忽略。它的意思是：框里这一整层（注意力 + 前馈）， 原样叠 6 层 ，每层有自己的参数。 第 1 层的输出是第 2 层的输入，一直到第 6 层。越往上，每个词的向量里包含的上下文信息越多。 ← 上一步 下一步 → 也可以用键盘 ← →



### 第 7 步



第 7 / 12 步 解码器输入：右移一位 “This masking, combined with fact that the output embeddings are offset by one position, ensures that the predictions for position i can depend only on the known outputs at positions less than i.” — 原文 §3.1 右边的解码器负责「写」。它的输入是 已经写出来的德文 ，同样经过嵌入和位置编码。 「shifted right」是说：训练时把目标句子整体往右挪一格，开头补一个起始符 `<s>`。这样在第 i 个位置，模型看到的是前 i−1 个词，要预测的是第 i 个词。 ← 上一步 下一步 → 也可以用键盘 ← →



### 第 8 步



第 8 / 12 步 Masked 注意力：不许偷看后面 “We need to prevent leftward information flow in the decoder to preserve the auto-regressive property. We implement this inside of scaled dot-product attention by masking out (setting to −∞) all values in the input of the softmax which correspond to illegal connections.” — 原文 §3.2.3 训练时，整句德文答案是一次性输入的。如果不加限制，模型预测第 3 个词时可以直接看到第 3、4 个词，相当于抄答案。 所以解码器的第一个注意力加了 遮罩（Mask） ： `<s>` Ich liebe dich `<s>` ✓ −∞ −∞ −∞ Ich ✓ ✓ −∞ −∞ liebe ✓ ✓ ✓ −∞ dich ✓ ✓ ✓ ✓ 每一行是一个词在「看」谁：右上角被遮住（设为 −∞，softmax 后权重为 0），每个词只能看到自己和前面的词。 去 大模型是怎么推理的 · 因果遮罩 + Softmax ，看这一步的矩阵具体怎么算 → ← 上一步 下一步 → 也可以用键盘 ← →



### 第 9 步



第 9 / 12 步 交叉注意力：边写边看原文 “In "encoder-decoder attention" layers, the queries come from the previous decoder layer, and the memory keys and values come from the output of the encoder.” — 原文 §3.2.3 这是整张图最关键、也最不起眼的一根线： 从编码器顶部伸到解码器中间 的那根箭头。 解码器中间这个注意力，三根输入不是同一个来源： Q 来自解码器自己 （「我现在要写什么」）， K 和 V 来自编码器 （「原文说了什么」）。 翻译时，每写一个德文词，都通过它回头去英文原句里找最相关的部分。 ← 上一步 下一步 → 也可以用键盘 ← →



### 第 10 步



第 10 / 12 步 解码器也叠 6 层 “The decoder is also composed of a stack of N = 6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack.” — 原文 §3.1 解码器每层有 三个 子层：Masked 自注意力 → 交叉注意力 → 前馈网络，每个后面都跟一个 Add & Norm。同样叠 6 层。 容易误解的一点：6 层解码器用的都是 编码器第 6 层的最终输出 ，不是一一对应地接编码器的第 1～6 层。 ← 上一步 下一步 → 也可以用键盘 ← →



### 第 11 步



第 11 / 12 步 输出：变成下一个词的概率 “We also use the usual learned linear transformation and softmax function to convert the decoder output to predicted next-token probabilities.” — 原文 §3.4 解码器顶部输出的向量，经过 Linear 投影到 整个词表 那么长（每个词一个分数），再用 Softmax 变成概率。 一个细节：这个 Linear 和两个嵌入层 共用同一个权重矩阵 ，省参数，也让「输入时的词」和「输出时的词」处在同一个空间里。 dich 0.82 Sie 0.07 euch 0.04 es 0.02 … 0.05 示意数值：已生成「`<s>` Ich liebe」，下一个词在整个词表上的概率分布。 去 大模型是怎么推理的 · 输出：预测下一个词 ，看这一步的矩阵具体怎么算 → ← 上一步 下一步 → 也可以用键盘 ← →



### 第 12 步



第 12 / 12 步 自回归：写一个，喂回去，再写下一个 “At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.” — 原文 §3.1 原图没有画这根回环线，但推理时它一直在发生：选出概率最高的词（比如 dich）， 接到解码器输入的末尾 ，再跑一遍解码器，预测下一个词，直到输出结束符。 编码器只需要跑一次；解码器每生成一个词都要跑一次。今天 GPT 这类大模型只保留了右半边（Decoder-only），生成方式完全一样。 ← 上一步 下一步 → 也可以用键盘 ← →





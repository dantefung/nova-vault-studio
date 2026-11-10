---

title: "纳米AI 专栏"

date: "2026-11-09"

source: "https://nano-ai.tech/"

url: "https://nano-ai.tech/"

---



# 纳米AI 专栏



> **「把大模型拆开，一格一格算清楚。」**

>

> 纳米AI（
[nano-ai.tech](https://nano-ai.tech/)
，正式域名 
[namiai.tech](https://namiai.tech/)
）是一套面向中文开发者的**大模型 / Agent 拆解式教程站**：把大模型的学习路线图、图解、从零手写大模型、从零手写 Agent、大模型论文研读全部做成了可交互的教程。

>

> 本专栏为该站点的**完整离线归档**，共 **65 个页面**，保留原文全部正文、公式、代码块与配图，并把站内交互式图解（学习路线图 / 推理矩阵 / 训练模拟器 / 论文导读器）的隐藏数据完整转写为文字版。



---



## 一、总览



| 板块 | 页面数 | 说明 |

|:---|:---:|:---|

| 
[大模型学习路线图](#一学习路线图)
 | 1 | 8 阶段 51 知识点 + 21 站推荐学习顺序（本站最核心的结构化内容） |

| 
[大模型图解](#二大模型图解-30-篇)
 | 30 | 从零手写大模型：推理篇 15 篇 + 训练篇 5 篇 + LLaMA/DeepSeek 组件 + Switch Transformer 三篇 |

| 
[Agent 图解](#三agent-图解-19-篇)
 | 19 | 从 100 行最小循环到 Claude Code / Codex / DeepSeek Harness / Grok Bot / OpenClaw 拆解 |

| 
[交互图解](#四交互图解-5-篇)
 | 5 | 大模型怎么推理 / 怎么训练 / Agent 怎么工作 / LLaMA / DeepSeek MLA（含全部章节文字版） |

| 
[论文研读](#五论文研读-2-篇)
 | 2 | Transformer 原论文 Figure 1 动态架构图 + 13 步逐章导读 |

| 
[拆机 DeepSeek Harness](#六拆机-deepseek-harness-3-篇)
 | 3 | 百万行代码的 Agent 整机图 / Cordis 主板深拆 |

| 
[系列](#七系列-4-篇)
 | 4 | 推理篇 / 训练篇 / 从 GPT-2 到 LLaMA / 从 LLaMA 到 DeepSeek |

| 
[专栏索引与关于](#八专栏索引与关于)
 | 2 | 全站索引与关于页 |



---



## 一、学习路线图



- 
[**大模型学习路线图**](./map.md)
 — 从 2017 年的 Transformer 到今天的主流模型，按学习顺序分 **8 个阶段、51 个知识点**，每个知识点写清楚「是什么 / 为什么重要 / 要学会什么 / 先学哪几个」，并给出 **21 站推荐学习顺序**。7 条线路：模型主线、注意力与位置编码、规模与训练、混合专家 MoE、对齐与推理模型、推理部署、Agent。



---



## 二、大模型图解（30 篇）



### 从零手写大模型 · 推理篇



| 序号 | 文章 | 内容 |

|:---:|:---|:---|

| 01 | 
[LLM From Scratch（从零手写大模型）](./articles-llm-from-scratch.md)
 | 项目总览：Tokenizer、Transformer、推理引擎、FastAPI 后端四大模块与学习进度 |

| 02 | 
[Tokenizer（分词器）](./articles-tokenizer.md)
 | 把输入文字切成 Token 并转成数字 ID |

| 03 | 
[Embedding（嵌入层）](./articles-embedding.md)
 | token → 向量的查表过程 |

| 04 | 
[Positional Encoding（位置编码）](./articles-positional-encoding.md)
 | 可学习的绝对位置向量 |

| 05 | 
[Self-Attention（自注意力机制）](./articles-self-attention.md)
 | 缩放点积注意力 |

| 06 | 
[Multi-Head Attention（多头注意力机制）](./articles-multi-head-attention.md)
 | 多头并行的注意力 |

| 07 | 
[Residual Connection（残差连接）](./articles-residual-connection.md)
 | 残差与梯度通路 |

| 08 | 
[LayerNorm（层归一化）](./articles-layer-norm.md)
 | Pre-LN 的层归一化 |

| 09 | 
[FFN（前馈神经网络）](./articles-ffn.md)
 | 前馈网络与 GELU |

| 10 | 
[Activation Function（激活函数）](./articles-activation-function.md)
 | 激活函数演进 |

| 11 | 
[Transformer Block（Transformer 模块）](./articles-transformer-block.md)
 | 单个 Block 的组装 |

| 12 | 
[Transformer Stack（Transformer 堆叠）](./articles-stack.md)
 | N 层堆叠与深度 |

| 13 | 
[Loading Pretrained Weights（加载预训练权重）](./articles-loading-pretrained-weights.md)
 | 加载 GPT-2 权重做推理 |

| 14 | 
[Text Generation（文本生成）](./articles-text-generation.md)
 | 采样：temperature、top-k、top-p |

| 15 | 
[Interpretability（可解释性 · 完结篇）](./articles-interpretability.md)
 | 完结篇 |



### 从零手写大模型 · 训练篇



| 序号 | 文章 | 内容 |

|:---:|:---|:---|

| 01 | 
[Loss Function（损失函数）](./articles-training-loss-function.md)
 | 交叉熵与困惑度 |

| 02 | 
[Backpropagation（反向传播）](./articles-training-backpropagation.md)
 | 链式法则把梯度算回每个参数 |

| 03 | 
[Gradient Descent（梯度下降）](./articles-training-gradient-descent.md)
 | 梯度下降与参数更新 |

| 04 | 
[Adam Optimizer（Adam 优化器）](./articles-training-adam-optimizer.md)
 | 自适应步长 |

| 05 | 
[Learning Rate Scheduling（学习率调度）](./articles-training-learning-rate-scheduling.md)
 | warmup 与衰减 |



### 组件拆解：从 GPT-2 到 LLaMA，再到 DeepSeek



| 文章 | 内容 |

|:---|:---|

| 
[RMSNorm（简化归一化）](./articles-rmsnorm.md)
 | 用 RMSNorm 替代 LayerNorm |

| 
[SwiGLU（升级前馈网络）](./articles-swiglu.md)
 | 用 SwiGLU 替代 GELU |

| 
[RoPE（旋转位置编码）](./articles-rope.md)
 | 旋转位置编码的推导与实现 |

| 
[GQA（分组查询注意力）](./articles-gqa.md)
 | 分组查询注意力 |

| 
[LLaMA（组装完整模型）](./articles-llama.md)
 | 组装完整模型 |

| 
[MLA（多头潜在注意力（上））](./articles-mla.md)
 | DeepSeek MLA |

| 
[解耦 RoPE（MLA 下）](./articles-mla-decoupled-rope.md)
 | MLA 的解耦 RoPE |



### Switch Transformer 三篇



| 文章 | 内容 |

|:---|:---|

| 
[MoE 与单专家路由](./articles-switch-routing.md)
 | Mixture of Experts & Top-1 Routing |

| 
[专家容量与负载均衡](./articles-switch-load-balancing.md)
 | Expert Capacity & Load Balancing |

| 
[训练稳定性、实验结论与局限](./articles-switch-results.md)
 | Training Stability, Results & Limitations |



---



## 三、Agent 图解（19 篇）



| 文章 | 内容 |

|:---|:---|

| 
[100 行代码，写出第一个 Agent](./articles-agent-minimal-loop.md)
 | 最小 Agent 循环 |

| 
[工具系统：加工具不再改主循环](./articles-agent-tools.md)
 | 工具注册与调用 |

| 
[上下文管理：别让 Agent 被自己的历史撑爆](./articles-agent-context.md)
 | 上下文窗口管理 |

| 
[记忆：跨会话记住该记的](./articles-agent-memory.md)
 | 记忆分层 |

| 
[计划：先说要做什么，再动手](./articles-agent-planning.md)
 | 计划与执行分离 |

| 
[子 Agent 与多 Agent：把活分出去](./articles-agent-subagents.md)
 | 子 Agent 编排 |

| 
[Skills：让 Agent 按需加载能力](./articles-agent-skills.md)
 | Skills 机制 |

| 
[MCP：接上别人写好的工具](./articles-agent-mcp.md)
 | MCP 协议 |

| 
[权限：给 Agent 装上刹车](./articles-agent-permissions.md)
 | 权限与沙箱 |

| 
[定时任务与心跳：让 Agent 主动找你](./articles-agent-scheduler.md)
 | 调度与主动触发 |

| 
[接入聊天软件：让 Agent 走出终端](./articles-agent-channels.md)
 | 接入 IM 渠道 |

| 
[拆解 Claude Code：把每个零件都做成可配置的](./articles-agent-claude-code.md)
 | Claude Code 架构 |

| 
[拆解 Codex：开源，并把边界交给操作系统](./articles-agent-codex.md)
 | Codex 架构 |

| 
[拆解 DeepSeek Harness：一切皆插件](./articles-agent-deepseek-harness.md)
 | DSH 插件架构 |

| 
[拆解 Grok Bot：给 Agent 一台自己的电脑](./articles-agent-grok.md)
 | Grok Bot 架构 |

| 
[拆解 OpenClaw 与 Hermes：个人助手这条线](./articles-agent-openclaw-hermes.md)
 | OpenClaw / Hermes 对比 |

| 
[拆解 Pi：故意做小的 Agent](./articles-agent-pi.md)
 | Pi 的极简设计 |

| 
[总对照表：共识、分歧与全系列回顾](./articles-agent-comparison.md)
 | 全系列横向对照 |



---



## 四、交互图解（5 篇）



这几篇在原站是**可点击交互**的模拟器，本归档已把隐藏的章节数据完整转写为文字版（含公式、矩阵形状与逐段讲解）。



| 文章 | 内容 |

|:---|:---|

| 
[大模型是怎么推理的](./matrix.md)
 | 词嵌入 → 注意力 → FFN → 输出，矩阵形态逐步展开 |

| 
[大模型是怎么训练的](./training.md)
 | 前向传播 → 交叉熵 → 反向传播 → 梯度下降的完整链路 |

| 
[Agent 是怎么工作的](./matrix-agent.md)
 | 一次 LLM 调用 → 工具调用 → 上下文累积 |

| 
[LLaMA 交互图解](./matrix-llama.md)
 | LLaMA 各组件的矩阵运算 |

| 
[DeepSeek MLA 交互图解](./matrix-deepseek.md)
 | MLA 的隐空间与上投影 |



---



## 五、论文研读（2 篇）



| 文章 | 内容 |

|:---|:---|

| 
[一张图看懂 Transformer](./papers-attention-is-all-you-need.md)
 | Figure 1 动态架构图 + **13 步逐章导读**（原文引用 + 中文拆解） |

| 
[大模型论文研读（专栏索引）](./papers.md)
 | 论文研读系列总览 |



---



## 六、拆机 DeepSeek Harness（3 篇）



| 文章 | 内容 |

|:---|:---|

| 
[整机图：百万行代码的 Agent，长什么样](./teardown-deepseek-harness-overview.md)
 | 一句话在机器里走一圈的整机架构图 |

| 
[主板 Cordis：为什么连 Agent 循环都能换](./teardown-deepseek-harness-cordis.md)
 | Cordis 插件框架深度拆解 |

| 
[拆机 DeepSeek Harness（入口）](./teardown-deepseek-harness.md)
 | 拆机系列索引 |



---



## 七、系列（4 篇）



| 文章 | 内容 |

|:---|:---|

| 
[从零手写大模型 · 推理篇](./series-inference.md)
 | 推理篇 15 篇目录 |

| 
[从零手写大模型 · 训练篇](./series-training.md)
 | 训练篇 5 篇目录 |

| 
[从 GPT-2 到 LLaMA](./series-gpt2-to-llama.md)
 | 5 篇组件替换路线 |

| 
[从 LLaMA 到 DeepSeek](./series-llama-to-deepseek.md)
 | DeepSeek 路线目录 |



---



## 八、专栏索引与关于



- 
[从零手写大模型（专栏索引）](./articles.md)
 — 大模型图解总目录

- 
[纳米AI（关于）](./about.md)
 — 站点介绍与联系方式



---



## 归档说明



- **来源**：<https://nano-ai.tech/>（正式域名 <https://namiai.tech/>），2026-11-09 抓取

- **抓取方式**：Playwright 渲染真实 DOM 后抽取正文；对学习路线图、交互模拟器、论文导读器额外提取页面内嵌的 JS 结构化数据并转写为文字

- **图片**：全部本地化至 
`images/<页面 slug>/`
，GIF 已转为静态 PNG 首帧

- **原文版权归原作者所有**，本专栏仅作学习与检索用途，源站地址已保留在每篇 frontmatter 的 
`url`
 字段



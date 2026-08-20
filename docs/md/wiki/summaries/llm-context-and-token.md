---
title: "LLM 上下文窗口与 Token 原理：128k 公摊、BPE 子词切分与 Prompt 工程"
date: "2026-08-20"
source: "微信公众号：小牛呼噜噜"
url: "https://mp.weixin.qq.com/s/uX5NWZBWo_BDSX88jwGOPQ"
---

# LLM 上下文窗口与 Token 原理：128k 公摊、BPE 子词切分与 Prompt 工程

## 核心结论

大模型的本质并不复杂：根据已有上下文预测下一个 Token（自回归生成），不断循环直到结束。理解 LLM 不需要理解它的内部神经网络，只要理解三个底层工程机制：Token 怎么切分（字符级太碎、词级词表爆炸、子词 BPE/BBPE 是当前主流）、上下文窗口怎么用（128k 不全是你的正文业务数据，里面有大量"公摊"）、Prompt 怎么写（角色 + 背景 + 任务 + 要求四要素）。

## 关键洞察

1. **Token 是大模型的"基本阅读和书写单位"**：人类看到汉字或英文，模型看到的是一串 Token ID。Token 是 AI 时代的"计量单位"——可计量、可定价、可交易，一次 API 调用花多少钱完全由 Token 数决定。
2. **三种切分方案此消彼长**：
   - **字符级**：每个汉字/字母一个 Token——简单但语义丢失（如 Apple 拆成 A-p-p-l-e），且句子变长让注意力算力"平方级增长"。
   - **词级**：每个词一个 Token——语义完整但词表爆炸，且无法处理 OOV（Out-of-Vocabulary）新词；英文还要给 run/running/ran/runs 各占坑。
   - **子词级 BPE**：高频词整体保留（dog、我们、中国），低频复杂词拆成通用小零件（unbelievable → un + believ + able）——既不撑爆词表，又能拼出新词。
3. **BBPE 字节级分词是当前大模型主流**：GPT、Claude、DeepSeek 等都用 BBPE（Byte-level BPE），从 256 个基础字节开始合并。理论上世界上任何文本（任何语言、符号、Emoji）都有兜底表示，永远不会出现"词表里完全没法表示"的情况。
4. **128k 上下文有大量"公摊"**：模型厂商宣传的"128k"是单次请求所有内容的绝对上限，不是全给你放正文业务数据。实际可用空间被系统设定、历史记录、外挂知识库 RAG、工具与插件定义、模型输出预算等"公摊"占用——这和买房的"公摊面积"是一回事。
5. **盲目增大上下文窗口有副作用**：
   - **成本浪费**：历史 token 重复读取，缓存命中率下降
   - **首字延迟**：塞给模型的信息越多，吐出第一个字前需要处理的计算量越大
   - **注意力分散**：长文本里塞的内容越多越杂，模型越容易抓不住重点，甚至忽略核心指令
6. **Prompt 工程 = 清晰沟通**：高质量 Prompt 四要素——设定角色（"你现在是资深 HR"）+ 说明背景（"我做了 3 年前端"）+ 明确任务（"写告别邮件"）+ 补充要求或给例子（"语气真诚不煽情，200 字"）。本质是把和 AI 的沟通当作和同事的沟通来要求。
7. **Prompt 的另一面：Token 经济学**：Prompt 写得长，输入成本上升；但写得简略，模型发挥不稳。这是一个 Trade-off——不是越长越好，也不是越短越好，而是"刚好让模型理解 + 关键约束都给到"的最优点。

## 值得保留的判断

- **"LLM = Next Token Predictor" 是入门锚点**：任何对 LLM 的工程优化，最终都回到这个简单事实——Token 是钱、Token 是延迟、Token 是上下文边界。
- **128k 不是"够用"而是"起步"**：当用户开始把整个项目代码库塞进上下文，公摊问题就开始恶化；这时需要 RAG、压缩、子代理分流，而不是无脑等更大的窗口。
- **子词分词解释了为什么 AI "懂"新词**：即使训练时没见过 Citywalk，BBPE 也能拆成 City + walk 来推断含义。这是 AI 比传统 NLP 工具泛化能力强很多的关键。

## 疑点与边界

- **不同模型的公摊比例不同**：DeepSeek、Claude、GPT 在系统设定、RAG、工具定义上的开销不一样；具体数字需要查阅各模型官方文档。
- **"4 个 128k" vs "1 个 512k"**：单次请求的窗口大小 vs 多次请求的累计信息——前者决定单轮容量，后者决定长任务的信息密度，需区别对待。
- **Prompt 最佳实践有流派差异**：本文的"角色 + 背景 + 任务 + 要求"是基础模板；高级用法（如 ReAct、Chain-of-Thought、Few-Shot）需要专门设计。

## Related Pages

- [[concepts/agent-token-architecture]]
- [[concepts/prompt-as-code]]
- [[concepts/claude-role-prompts]]
- [[concepts/llm-cache-mechanism]]
- [[concepts/llm-batch-invariance]]
- [[concepts/llm-chat-completion-api]]
- [[concepts/function-calling-mechanism]]
- [[concepts/rag]]
- [[concepts/cf-worker-cpu-limit]]

## Sources

- [[sources/llm-context-and-token]]
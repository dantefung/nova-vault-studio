---
title: "Agent 记忆的四层存储模型：从 20 条滑窗到长期可演进记忆"
date: "2026-07-14"
source: "微信公众号：老梁agent"
---

# Agent 记忆的四层存储模型：从 20 条滑窗到长期可演进记忆

> 生产实战笔记系列第 07 篇。滑动窗口的三宗罪（遗忘关键信息、成本膨胀、进程挂全丢）——四层记忆模型分层存储、分层读写。

---

## MVP 记忆：一行代码的三宗罪

1. **会遗忘关键信息**：第 1 轮自我介绍，聊到第 25 轮被挤出窗口
2. **成本线性膨胀**：20 条全量原文每轮都塞进 Prompt，token 越烧越多
3. **进程一挂全丢**：记忆在 JVM 堆内存里，重启即清零

## 四层记忆模型

| 层级 | 名称 | 存储 | 生命周期 | 写入路径 | 类比 |
|------|------|------|---------|---------|------|
| L1 | **Working Memory** | Redis (String) | TTL 10 分钟 | 同步 | 草稿纸 |
| L2 | **Conversation Memory** | Redis Stream | 有上限 | 同步 | 短期记忆 |
| L3 | **Summary Memory** | MySQL | 长期 | 异步（小模型摘要） | 经验总结 |
| L4 | **Profile Memory** | MySQL | 永久 | 带置信度门槛 | 身份认知 |

## MemoryManager

读时合并（四层按需取用），写时分离（按重要性写入对应层），主链路零阻塞。

> 📎 完整原文见知识库：[wiki/sources/agent-memory-four-tier.md](../../../wiki/sources/agent-memory-four-tier.md)

---

[← 上一篇：调试追踪](./06-agent-debug-trace.md) | [下一篇：Prompt 编译引擎 →](./08-prompt-six-layer-compiler.md)
---
title: "AgentScope Java 2.0 结构化输出实战：让 Agent 直接返回 Java 对象，告别字符串解析"
date: "2026-07-29"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/92WrOmKjypAi4upDcTXy3g"
---

# AgentScope 结构化输出：让 Agent 返回 Java 对象

> AgentScope 迁移系列第 15 篇。AgentScope 支持直接返回 Java POJO，无需手动解析 JSON 字符串——类型安全、编译期校验。

---

## 核心优势

传统方式：LLM 输出 JSON 字符串 → 手动 `ObjectMapper.readValue()` → 错误时 parse 失败。

AgentScope 方式：指定返回类型为 Java 类，AgentScope 自动将 LLM 输出绑定为对象。

## 三种输出模式

| 模式 | 返回类型 | 适用场景 |
|------|---------|---------|
| 自由文本 | `String` | 自然语言对话 |
| JSON 对象 | Java POJO | 结构化数据返回 |
| 枚举/列表 | `Enum` / `List<T>` | 分类、排序、选择 |

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-structured-output.md](../../../wiki/sources/agentscope-2.0-structured-output.md)

---

[← 上一
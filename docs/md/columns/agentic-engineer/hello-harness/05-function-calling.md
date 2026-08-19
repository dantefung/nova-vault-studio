---
title: "Hello Harness 05 · Function Calling：让模型第一次产生结构化动作 ToolCall"
date: "2026-08-19"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/M84tlj61pVW9tam_1XsY-w"
---

# Function Calling：让模型第一次产生结构化动作

> Hello Harness 专栏第 05 篇。按下第一个「动作」开关——让模型的输出不再是文本，而是结构化的动作指令。

---

## 核心问题

Stage 0 结束，模型会「说」会「写」会「流式输出」，但本质上还是加强版翻译器。它的输出通道只有一条：文本。它想做任何事，都只能「建议你去做」，然后干瞪眼。

## 解决三件事

1. **输出从文本扩展为动作**：输出结构化 ToolCall
2. **tools 参数声明能力**：告诉模型「你有什么能力、每个能力长什么样」
3. **线格式翻译为结构化数据**：ToolCall / ToolDefinition 类型

## 核心抽象

| 类型 | 作用 | 关键字段 |
|------|------|---------|
| **ToolCall** | 模型的一句话「我要动手了」 | id / name / arguments |
| **ToolDefinition** | 给模型看的「能力说明书」 | name / description / parameters |

## 核心收获

- **输出通道从一条变两条**：文本（说话）+ 动作（动手）
- **动作是结构化的**：name + arguments，代码可可靠解析
- **能力可声明**：tools 是模型的「能力清单」，模型按需自选
- **执行权留在应用层**：模型只能「提议」，安全边界从第一天立住

## 安全基石

> **模型只会「提议」，不会「执行」。** 模型的 `tool_calls` 只是「请求许可」，不是「已经执行」。执行与否、权限够不够——决定权永远在应用层。

## 遗留问题

- 想调用 ≠ 调用成功：只有提议，没人执行
- 参数可能不合法：结构正确 ≠ 语义正确
- 说明书与实现分居两地：应该长在一起
- 流式下的 tool_call 还没处理
- 安全隐患浮现：权限与控制成为主线

> 📎 完整原文见知识库：[wiki/sources/hello-harness-05-function-calling.md](../../../wiki/sources/hello-harness-05-function-calling.md)

---

[← 专栏首页](./index.md)
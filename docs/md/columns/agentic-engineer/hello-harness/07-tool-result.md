---
title: "Hello Harness 07 · Tool Result：把工具结果喂回模型，形成完整循环"
date: "2026-08-21"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/PLzE1ckW0PjRdzA1Vdmffw"
---

# Tool Result：把工具结果喂回模型

> Hello Harness 专栏第 07 篇。建立完整循环：User → LLM → Tool Call → Tool → Tool Result → LLM → Answer。

---

## 核心问题

06 章的 `--tools` 中 calculator 算出了 646，但结果只落在「我们的眼睛」里，模型没看见。它此刻的内心戏：

> 我提议调用 calculator 了……然后呢？没人告诉我算出来多少。我该说什么？

> 上一版的工具像个把消息带回来却对着墙汇报的信使。情报已经到手，但听汇报的人是聋子。

## 完整循环

```
User → LLM → Tool Call → Tool → Tool Result → LLM → Answer
```

核心动作只有两个：

1. 把工具结果写成 `tool` 消息，push 回 messages 历史
2. 再让模型看一眼更新后的历史，让它基于真实结果给出最终回答

## 四种消息类型

| Role | 新增时间 | 关键字段 | 说明 |
|------|---------|---------|------|
| `system` | 第 0 章 | — | 系统指令 |
| `user` | 第 0 章 | — | 用户输入 |
| `assistant` | 第 02 章 | `content` + `toolCalls?` | 带动作的助手消息 |
| `tool` | **第 07 章** | `toolCallId` + `content` | 工具执行结果 |

## 核心收获

| 收获 | 内容 |
|------|------|
| **模型第一次「看见」结果** | 执行完工具后模型基于真实数据作答，幻觉关键来源被掐掉 |
| **工作记忆建立** | messages 成为任务上下文，多步推理有了土壤 |
| **循环闭环成形** | 提议 → 执行 → 回写 → 再问，Agent 最基本节律诞生 |
| **消息类型自洽** | 四种消息 + 按角色翻译，Model 接口零改动 |

## 遗留问题

- 只走一遍就停：`if (response.toolCalls.length > 0)` 只处理一轮，连环计算走不完
- 没有停止条件：什么时候算「完成」？现在靠直觉
- 结果措辞是裸 JSON：`{"value":646}` 模型读得懂，人可读不懂
- 没有异常处理：工具抛异常时，历史里只有空结果
- 上下文会膨胀：结果越长，messages 越肥，迟早撞上上下文窗口上限

> 📎 完整原文见知识库：[wiki/sources/hello-harness-07-tool-result.md](./sources/hello-harness-07-tool-result.md)

---


[← 上一篇：05、Function Calling](./05-function-calling.md) | [→ 专栏首页](./index.md)

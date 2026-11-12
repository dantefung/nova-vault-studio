---
title: "同样是调大模型，ReActAgent 能自己决定「缺什么查什么」，你的 LLM 还在背答案"
date: "2026-07-24"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/3SkybaLc47yu-EWOkd9G-w"
---

# ReActAgent 能自己决定「缺什么查什么」

> AgentScope 迁移系列第 12 篇。同样是调大模型，ReActAgent 能自己判断缺失信息并主动查询，而普通 LLM 只能被动回答已知内容。

---

## 核心观点

普通 LLM 遇到知识盲区只能「背答案」——它不知道自己的知识边界在哪里。ReActAgent 的不同之处在于：它在推理循环中能主动识别「我缺什么信息」，然后决定调用哪个工具来补齐。

这种「感知缺口 → 主动查询 → 整合推理」的闭环，是 Agent 和普通 LLM 最本质的区别。

## 与简单 LLM 调用的对比

| 维度 | 普通 LLM | ReActAgent |
|------|---------|------------|
| 知识边界 | 不知道自己的盲区 | 主动识别信息缺口 |
| 工具使用 | 无 | 推理循环中自动调用 |
| 答案质量 | 依赖预训练知识 | 实时查询 + 推理 |
| 适用场景 | 常识问答 | 需要查实时数据 |

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-reactagent-comparison.md](../../../wiki/sources/agentscope-2.0-reactagent-comparison.md)

---

[← 上一
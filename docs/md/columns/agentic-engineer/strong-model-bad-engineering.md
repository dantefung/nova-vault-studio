---
title: "强模型，救不了烂工程"
date: "2026-05-28"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/zUyyqYvOa7HZPCPgaOa3rg"
author: "编程一生"
abstract: "一条理论链串完 LLM→Agent OS：Prompt/RAG/微调 → 可信（Grounding/Eval/Guardrails） → Agent Loop → Memory/Skill → Harness（接现实世界） → Agent OS（天天跑）。踩坑实录：双层 Agent Loop 净删 2 万+ 行，教训是「协调应该是 Agent 的行为，不是架构里多一层 Python」。"
---

> 来源：[强模型，救不了烂工程](https://mp.weixin.qq.com/s/zUyyqYvOa7HZPCPgaOa3rg)，作者 编程一生

---

## 一句总公式

> 模型想 → 范式说准 → 可信敢上线 → Agent 能动手
> → Harness 做得稳 → Agent OS 跑得久 → 业务才有真价值

分工记两句：

- **LLM owns reasoning.**（模型负责想）
- **Harness owns reality.**（工程负责接现实世界）

---

## ① LLM：地基

大模型是概率推理引擎——给上下文，猜下一个最合理的词。

擅长：理解、改写、推理、模仿格式。天生短板：幻觉、知识过期、窗口有限、默认不能动手——这些不是「再调调 Prompt」能根治的。

**LLM 是大脑，不是产品。**

---

## ② 三种用法：Prompt · RAG · 微调

| 路子里 | 人话 | 适合 |
|--------|------|------|
| Prompt | 不改模型，改输入 | 快试、规则常变 |
| RAG | 先检索再回答 | 要有依据、知识常更新 |
| 微调 | 用领域数据继续训 | 话术格式要极稳 |

三者解决「怎么说」，还没解决「怎么做」。

---

## ③ 可信：敢不敢上线

Demo 能吹，生产栽在这：**Grounding**（有据）、**Eval**（别只测聊天）、**Guardrails**（硬拦权限）、**Trace**（能翻日志）。

> 安全别写进 Prompt「请遵守」——得代码 enforce。

---

## ④ Agent：从「会说」到「会做」

Agent = LLM + 循环 + 工具 + 上下文。

主流单层 Loop：`想 → 调工具 → 看结果 → 再想 → 交卷`。

Workflow 像地铁时刻表，Agent 像会改路线的司机——步骤死、要强合规用 Workflow；探索、多工具再上 Agent。

---

## ⑤ 上下文 · Memory · Skill

弹药不止 Prompt：历史、检索、工具结果、组织规矩都算。Memory 分 Session / User / Organization，别搅成一锅摘要。Skill 是「说明书」，按需加载，别灌满窗口——上下文也是钱。

---

## ⑥ Harness：接现实世界

模型碰不到租户、凭证、审计。Harness 管：**Contract**、**沙箱**、**策略**、**结构化报错回灌**、**trace**、**续跑**。

> 少写替模型拍板的 if-else，多写保护世界的硬边界。

---

## ⑦ Agent OS：能天天跑

不是 API 网关套壳，而是任务生命周期、统一工具面、多 Agent、SaaS 审批与受控执行面分离。企业里常串：数据平台讲清数 → 知识中台讲清规矩 → Agent OS 在规矩里干活。

---

## 踩坑实录：拆了「双层 Loop」

早期搞过 Coordinator + Worker 双层 Agent：上层「协调」拆任务，下层「干活」执行——听起来很架构、很企业级。

跑了一阵，结论很干脆：**效果差，还僵。**

- 上层 Python 在替模型做「该不该下一步」——抢模型的活，还抢不好
- 两层之间协议越来越厚，改需求要动两处
- 调试像查连环套：到底是协调层错了，还是干活层错了？

2026 年 4 月，净删 **20,390 行**，主链收敛成**单层 Agent Loop**——参考 Codex CLI、Claude Code：`messages → LLM → tool → result → 循环`。

协调以后用**多 Agent + 协调者 + 消息总线**，不在 runtime 里再套一层 Worker Loop。

> **教训**：协调应该是 Agent 的行为，不是架构里多一层 Python。

---

## 一张总图 + 选型口诀

```
业务 → Agent OS → Harness → Agent Loop
     → Context/RAG/Skill → Prompt·RAG·微调 → LLM
```

| 需求 | 先看 |
|------|------|
| 要有依据 | RAG |
| 要改系统 | Agent + Tool |
| 步骤死 | Workflow |
| 老碰权限 | Harness |
| 多租户审计 | Agent OS |

**三不**：不大模型替代 RAG；不 Agent 替代 Workflow；不 Prompt 替代 Harness。

---

## 结语

地板看模型，天花板看工程。模型负责想明白，Harness 负责做得稳，Agent OS 负责跑得久。
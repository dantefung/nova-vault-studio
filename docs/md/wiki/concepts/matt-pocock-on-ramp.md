---
title: "on-ramp：AI Agent 输入分类器"
date: "2026-07-31"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/Obn3th61vpLSsi7eZs-DKg"
---

# on-ramp：AI Agent 输入分类器

Matt Pocock 在 `skills/engineering/ask-matt/SKILL.md` 中定义的三层输入分类机制，在汇入主链路之前先做分流。

---

## 三类 on-ramp

| 入口 | 接收输入 | 形态 | 判断依据 |
|------|---------|------|---------|
| `/triage` | 别人提的 bug report、feature request、堆积的 issue | raw、未分类 | 起点不是我，大量并行互相独立 |
| `/diagnosing-bugs` | 突然变红的回归 test、间歇性 flake | 真实症状，定位未知 | 突然变红，不一定单点深挖 |
| `/wayfinder` | 全新模块、巨型特性、超出单会话的想法 | 模糊，目的地未确定 | 不是串行，每会话一票 |

**核心原则**：on-ramp 按输入**来源和形态**分类，不是按优先级或紧迫度。

---

## 关键洞察

### triage 只处理别人创建的 issue

> "Triage is only for issues you didn't create — bug reports, incoming feature requests, anything that arrives raw. Tickets that /to-tickets produced are already agent-ready, so don't triage them."

`/tickets` 产出的工单已经是 agent-ready 的，不需要再走 triage。

### 判断依据不是工作量

三类 on-ramp 的差异不在于工作量大小，而在于：
- **来源**：谁发起的
- **形态**：已分类 vs raw vs 模糊
- **节奏**：并行 vs 单点深挖 vs 串行

### 按错顺序的后果

把三类输入一股脑丢给同一个 Agent 会话：
- 最吵的 issue 先做（通知最多）
- 回归 bug 被推到明天
- 新模块做到一半 context 跑满

---

## 交叉引用

- [[matt-pocock-wayfinder-handoff]] — wayfinder（第三类 on-ramp）详解
- [[agentic-engineer]] — Matt Pocock Skills 生态

> 来源：运维有术（术哥无界），微信公众号，2026-07-31

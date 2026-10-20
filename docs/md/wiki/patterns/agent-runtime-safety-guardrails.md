---
title: "Agent 运行时安全护栏模式"
date: "2026-10-20"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/5zhFeM48-ipqDyIAPvRj9A"
---

# Agent 运行时安全护栏模式

> 将 Agent 安全从自然语言提醒外置为确定性控制：默认拒绝、最小权限、执行前授权、运行时限额、人工分级、客观门禁、可回滚状态与脱敏审计。

## Control Flow

```text
不可信输入
  -> 归一化与来源隔离
  -> 最小上下文与程序化脱敏
  -> 声明式工具授权
  -> pre-dispatch 风险裁决
  -> 沙箱内执行
  -> 成本包络 / 哨兵 / 熔断
  -> 硬门禁 + 独立软审查
  -> 脱敏审计
  -> 评测驱动护栏升级
```

## Five Enforcement Layers

| 层级 | 主要控制 | 强制点 |
|------|----------|--------|
| 信息边界 | 归一化、可信/不可信分槽、I/O 脱敏、最小知识 | 上下文入口与输出出口 |
| 工具系统 | 默认拒绝、白名单、细粒度权限、版本与 Schema 锁定 | 工具注册与授权层 |
| 执行编排 | pre-dispatch、成本包络、HITL、Trip Wire、熔断 | 工具调用前与运行循环 |
| 系统隔离 | OS 沙箱、受控网络、短时凭证 | 宿主机与网络边界 |
| 门禁审计 | CI、安全扫描、Rubric、状态快照、审计与回滚 | 合入、发布和持久化前 |

## Non-negotiable Rules

1. 高危能力不应常驻可用，必须按任务授权并及时回收。
2. 工具执行前必须存在模型无法绕过的决策点。
3. 外部数据只能作为证据，不能自动升级为指令。
4. 语义明确且有副作用的参数必须由代码验证，缺失即拒绝。
5. 循环必须有预算、次数或时间上限。
6. 实现者不能作为唯一评审者。
7. 审计链必须脱敏，并支持定位来源与时间。
8. 门禁本身需要测试；上线前用 Dry Run 验证 Harness。

## HITL Policy

- **红卡**：生产发布、删库、强推、资金或权限变更等不可逆动作。
- **黄卡**：循环触顶、风险累积、评审分歧和自动降级。
- **绿卡**：可恢复、低破坏、证据完整的常规步骤。

HITL 的目标不是让人确认一切，而是让人的注意力集中在高破坏和高不确定决策上。

## Failure Routing

每个失败信号都应映射到最近的责任阶段：

- 需求不清晰 -> 澄清。
- 方案审查失败 -> 设计。
- 编译、代码质量或 CR 失败 -> 实现。
- 零测试、断言缺失 -> 测试。
- 权限、密钥或供应链异常 -> 安全与工具治理。

精确回退比从头重跑更省上下文，也能防止已确认结论被重复推翻。

## Related Pages

- [[sources/ai-engineering-safety-guardrails]]
- [[concepts/harness-engineering]]
- [[sources/harness-engineering-practice]]
- [[sources/harness-legacy-refactor]]
- [[concepts/agentscope-governance]]
- [[concepts/codex-security]]

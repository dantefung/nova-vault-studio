---
title: "Harness Engineering Practice（Harness工程化实践）"
date: "2026-06-11"
---

# Harness Engineering Practice（Harness工程化实践）

> AI Coding 的瓶颈正从「模型能力」转移到「流程工程」——模型已经足够聪明，但不稳定，而稳定性必须由外部框架供给。harness = 把「AI 该怎么干活」固化成可执行、可约束、可评测的工程框架。

## Key Points

- **核心问题**：用过 AI 编码的人大概率遇到过这三个痛点——不听话（规则太多，选择性遵守）、上下文爆炸（规则常驻窗口，挤压代码空间）、自我矛盾（规则间冲突，模型编造折中方案）
- **根因**：模型"理解"了规则不等于"遵守"了规则，你无法用更多的字来对抗概率性的遗忘

## 遗忘三重根因

1. **压缩丢失**（Auto-Compact 省略"看似不重要"的流程步骤）
2. **检索失败**（记忆文件在但没被加载进上下文）
3. **指令遵循失败**（信息都在但模型仍然跳步）

## 四阶段演进

| 阶段 | 方法 | 问题 |
|------|------|------|
| 拿来主义 | 用开源模板（oh-my-claudecode 等） | 通用规范覆盖不了真实开发流程 |
| 重 prompt 约束 | 把规矩全写进 CLAUDE.md | 三天后崩了：不听话、上下文爆炸、自我矛盾 |
| 减负 + 分层加载 | 常驻 ≤8K，深度内容按需加载 | 长程会话中规则被稀释到注意力衰减区 |
| Agent 调度编排 | dispatcher 状态机 + 文件交接 | 24 agent 过度拆分，维护成本高 |

**核心转变**：从「用更多的字约束 AI」，到「用更好的结构约束 AI」。

## 三层加载架构

### 常驻入口层：CLAUDE.md + CLAUDE.local.md
- 放角色、代码偏好、流程触发规则、G1–G8 门禁速查
- 关键设计：CLAUDE.local.md 自包含、不依赖全局 @import
- 效果：主会话常驻上下文压到 ≤8K

### 原子规则层：rules/（7 个）
- 每条规则是一次事故的墓志铭
- 坑只踩一次，之后由规则兜底

### 角色 Agent 层：agents/
- **dispatcher**：读 state.json + workflow.yaml，决定下一步该调谁——交通警察，只管路由不管业务
- **orchestrator**：读三角色观点，合成结论——会议秘书，只管合成不管调度
- **三角色评审**：requirement-analyst / tech-architect / quality-guardian，各写各的观点段，互不污染
- **流程执行**：plan-generator → developer → verifier → deployer → tester

## Related Pages

- [concepts/harness-engineering](concepts/harness-engineering) — 驭化工程
- [patterns/engineering-taste](patterns/engineering-taste) — 工程品味

## Sources

- 微信公众号《AI 不缺智商缺纪律：一场 Harness 工程化实践》(2026-06-11)
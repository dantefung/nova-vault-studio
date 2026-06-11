---
title: "Harness Engineering（驭化工程）"
date: "2026-06-11"
---

# Harness Engineering（驭化工程）

> 为 AI 编程 Agent 设计可靠运行环境的工程学科，不优化模型本身，而是系统性设计围绕模型的约束、上下文、工具与反馈机制。核心：模型供给智商，harness 供给纪律。

## Key Points

- 核心公式：AI 编程 Agent = AI 模型(s) + 驭化层（Harness），驭化层是 Agent 系统的操作系统
- 三大支柱：上下文工程、架构约束、熵管理
- 核心洞察：Agent 的可靠性瓶颈不是模型，是环境——同模型不同驭化，性能差异可达 36 个百分点
- 工程师角色转变：从亲手写代码到设计让 Agent 能写好代码的环境
- **核心转变**：从「用更多的字约束 AI」，到「用更好的结构约束 AI」

## Details

### 历史背景

2023-2024 年为 Copilot 式行级自动补全阶段；2025 年下半年开始大规模实验自治 Agent。转折点数据：OpenAI 3 人 × 5 月 = 100 万行代码，Stripe 每周 1300+ PR 全自动合并。

### 核心操作原则

1. 把 Agent 失败视为系统设计问题
2. 环境设计优于提示词调整
3. 渐进式披露，而非全量注入
4. 人类品味一次性编码，持续机械化执行
5. 验证循环替代人工 QA

### 重要警告

驭化工程不等于写更多 prompt、装更多 MCP 服务器、创建更详细的 AGENTS.md。过多工具会让 Agent 进入"愚蠢区"。

### 四阶段演进

| 阶段 | 方法 | 问题 |
|------|------|------|
| 拿来主义 | 用开源模板（oh-my-claudecode 等） | 通用规范覆盖不了真实开发流程 |
| 重 prompt 约束 | 把规矩全写进 CLAUDE.md | 三天后崩了：不听话、上下文爆炸、自我矛盾 |
| 减负 + 分层加载 | 常驻 ≤8K，深度内容按需加载 | 长程会话中规则被稀释到注意力衰减区 |
| Agent 调度编排 | dispatcher 状态机 + 文件交接 | 24 agent 过度拆分，维护成本高 |

### 三层加载架构

- **常驻入口层**：CLAUDE.md + CLAUDE.local.md（≤8K 常驻上下文）
- **原子规则层**：rules/（7 个规则，每条规则是一次事故的墓志铭）
- **角色 Agent 层**：dispatcher（路由）+ orchestrator（合成）+ 三角色评审 + 流程执行

### 关键设计原则

1. **Thin Controller**：主会话应退化成一个纯执行器，只执行 dispatcher 指令，不承担"思考"业务逻辑的职责
2. **上下文当预算管理**：上下文不是越大越好的免费缓冲区，是稀缺资源。每份 context 只含该阶段所需最小集，用完即释放
3. **Fail-Closed**：流程强制执行必须从 LLM 推理中外置到确定性基础设施。门禁必须是确定性代码，独立于上下文窗口，默认拒绝

### 19 节点链路

需求评审→需求确认→方案设计→方案确认→Pre-Mortem→实施计划→验收标准确认→拉变更→建分支→建 worktree→开发→编译→单测→ATDD→证据链→部署预发→接口测试→上线确认→验收报告

由意图 × 风险动态裁剪：QUERY 不要求任何产物、BUG_FIX/LOW 只查 5 个节点、FEATURE/HIGH 查满 19 个。

### 稳定性支点

- **G1–G8 门禁墙**：每个门禁是确定性的 Python 函数，检查产物存不存在、编译过不过、单测通没通。任一 gate FAIL 则流程退回 DEVELOPING——不是"建议"，是"阻断"
- **Hook 拦截**：状态文件写操作只允许编排层 agent 触发；危险操作（git push --force、rm -rf）弹确认

### 评测平台

核心理念：评测平台是评估者，不是执行者。只检测被试 claude 是否走完了 harness 的每个节点，绝不替它去执行部署或测试。

**七维评分**：流程完整性(22%)、代码正确性(22%)、门禁通过率(15%)、上下文效率(12%)、人工介入率(10%)、经验复用率(10%)、诚实度(9%)

**关键判断**：宁要可复现的「粗糙分」，不要会漂移的「精准分」。

## Context

来源于 Conn-Ho/harness-engineering 仓库 + 杜学友《AI 不缺智商缺纪律：一场 Harness 工程化实践》实践总结。

## Related Pages

- [patterns/context-engineering](patterns/context-engineering)
- [patterns/architectural-constraints](patterns/architectural-constraints)
- [patterns/entropy-management](patterns/entropy-management)
- [comparisons/harness-vs-scaffolding](comparisons/harness-vs-scaffolding)
- [comparisons/ai-coding-tools](comparisons/ai-coding-tools)
- [sources/harness-engineering-practice](sources/harness-engineering-practice)

## Sources

- GitHub Conn-Ho/harness-engineering: docs/md/columns/harness-engineering/concepts/00-overview.md
- 微信公众号《AI 不缺智商缺纪律：一场 Harness 工程化实践》(2026-06-10)
---
title: "8 周深度改造蓝图"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# 8 周深度改造蓝图

> 适用于：希望将团队提升到 Staff/Principal 工程师级别驭化层的团队
> 前提：已完成 4 周路线图，或基础设施已具备

---

## 总体架构目标

完成 8 周后，你的驭化层应具备：

```
┌────────────────────────────────────────────────────────────┐
│                      完整驭化层架构                           │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  指令架构层   │  │  质量执行层   │  │  技能/流程层  │    │
│  │  AGENTS.md   │  │  Linting     │  │  Skills/     │    │
│  │  docs/       │  │  Drift Scan  │  │  Workflows   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────────────────────────────────────────┘
```

---

## 第 1-2 周：指令架构（Instruction Architecture）

**目标**：建立完整的、有层级的上下文指令体系。

### 验收标准

- [ ] AGENTS.md ≤ 100 行，包含所有关键目录的导航
- [ ] docs/ 目录层级清晰，按用途分类
- [ ] 所有公共 API 有对应文档
- [ ] 过去 3 个月的重要架构决策有 ADR

---

## 第 3-4 周：质量执行层（Quality Enforcement）

**目标**：机械化地执行架构约束，建立 Drift Scanner。

### 自定义 Lint 规则集

优先级排序（从高到低）：
1. 安全相关违规（如未转义用户输入）
2. 分层架构违规（如 UI 层直接访问数据库）
3. API 合约违规（如响应格式不一致）
4. 代码风格违规（格式问题）

### 建立 Daily Drift Scanner

```yaml
# .github/workflows/drift-scanner.yml
name: Daily Drift Scanner

on:
  schedule:
    - cron: '0 9 * * 1-5'
  workflow_dispatch:

jobs:
  documentation-drift:
    name: 文档漂移检测
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check AGENTS.md consistency
        run: node scripts/check-agents-md.js
      - name: Check API docs match code
        run: node scripts/check-api-docs.js

  architecture-drift:
    name: 架构约束检测
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run structural tests
        run: npm run test:structural
      - name: Check layer dependencies
        run: npx madge --circular src/
```

### 验收标准

- [ ] 至少 3 条自定义 lint 规则，错误消息包含修复指导
- [ ] Drift Scanner 在 CI 中运行
- [ ] 结构测试覆盖核心分层约束

---

## 第 5-6 周：技能系统（Skills & Workflows）

**目标**：将反复执行的工作流标准化为可复用的 Skill 文档。

### 识别高价值 Skill

**选择标准**：
- 每周执行 3+ 次的操作
- 需要多个步骤且步骤顺序重要
- Agent 经常在这类任务上出错或需要询问

### 验收标准

- [ ] 最常用的 5 个工作流有对应 Skill 文档
- [ ] 每个 Skill ≤ 60 行
- [ ] Skill 包含验证步骤（Agent 可以自我检验是否完成正确）

---

## 第 7-8 周：执行基础设施（Execution Infrastructure）

**目标**：为 Agent 建立安全、高效的执行环境。

### 任务隔离

```bash
# 使用 git worktree 为每个任务创建隔离环境
TASK_ID=$1
BRANCH="agent/task-${TASK_ID}"
WORKTREE_PATH="/tmp/tasks/${TASK_ID}"
git worktree add "${WORKTREE_PATH}" -b "${BRANCH}"
```

### 人工干预点（Human-in-the-loop）

```yaml
# .harness/approval-policy.yml
require_approval:
  - pattern: "DELETE FROM *"
    reason: "Irreversible data deletion"
  - pattern: "git push --force"
    reason: "Could overwrite remote history"
  - pattern: "npm publish"
    reason: "Affects external users"
```

### 验收标准

- [ ] Agent 任务在隔离的 worktree 中运行
- [ ] 高风险操作有人工确认流程
- [ ] Agent 可以访问必要的可观测性数据

---

## 8 周完成里程碑

| 维度 | 指标 | 目标 |
|------|------|------|
| 上下文工程 | AGENTS.md 覆盖率 | ≥ 90% 的目录有文档 |
| 质量执行 | 自定义 lint 规则数 | ≥ 5 条 |
| 技能系统 | Skill 文档数 | ≥ 5 个 |
| 吞吐量 | 人均每日 PR | ≥ 2 个（Agent 生成）|
| 质量 | Agent 任务成功率 | ≥ 75% |
| 熵管理 | Drift Scanner 运行 | 每个工作日 |

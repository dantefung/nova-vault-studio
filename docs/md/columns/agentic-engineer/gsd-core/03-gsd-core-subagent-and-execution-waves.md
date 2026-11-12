---
title: "03. GSD Core 独立子代理与波次并发调度：权限隔离与 Worktree 机制"
date: "2026-09-16"
source: "open-gsd/gsd-core"
url: "https://github.com/open-gsd/gsd-core"
---

# 03. GSD Core 独立子代理与波次并发调度：权限隔离与 Worktree 机制

> 「安全不是一个功能，它是一个架构设计。如果你把所有权限都扔给一个超级进程，你得到的不是生产力，而是一个随时准备把你磁盘格式化的定时炸弹。」在 Multi-Agent 系统中，**角色隔离与权限最小化（Least Privilege）**是系统的第一安全底线。

<!-- more -->

## 为什么「万能智能体」是灾难？

很多玩具级的 Agent 框架喜欢让一个模型同时拥有所有工具：既能读写所有文件，又能上网乱查，还能在本地执行任何 Bash 命令，最后还负责给自己的产出写单元测试。

在真实的生产工程中，这种设计注定翻车：
1. **裁判既是运动员**：负责写代码的 Agent，如果同时拥有修改测试和验证的权限，它在遇到测试失败时，最喜欢干的事情就是**把测试断言改弱甚至删掉**，制造虚假的成功绿灯。
2. **外部注入风险**：一个负责查外网资料的 Agent 如果拥有磁盘写权限，恶意网页中的 Prompt Injection 指令可能会诱导它修改本地的核心配置文件。
3. **状态脏读与文件冲突**：多个并发任务如果同时操作同一个工作目录，不仅 Git 索引会损坏，模型还会互相覆盖对方刚刚写好的代码。

---

## 权限最小化（Principle of Least Privilege）矩阵

GSD Core（v1.7.0）设计了 **34 个专门的 Agent 角色**（22 个核心主战 Agent + 12 个高级专项 Agent），并且严格根据职责划分只读与写入边界：

| 角色分类 | 代表 Agent | Read | Write/Edit | Bash | WebFetch | 权限设计目的与护栏 |
|---------|-----------|------|------------|------|----------|-------------------|
| **调研型 (Researchers)** | `gsd-project-researcher`<br>`gsd-phase-researcher` | ✓ | 仅 Write 调研报告 | ✓ (有限) | ✓ | 负责检索最新生态技术；**禁止修改项目源代码**，产出仅限于 `RESEARCH.md` |
| **规划型 (Planners)** | `gsd-planner`<br>`gsd-roadmapper` | ✓ | 仅 Write 计划文件 | ✓ | 仅 WebFetch | 负责结构拆解与波次划分；**绝不直接动业务源码** |
| **审核型 (Checkers)** | `gsd-plan-checker`<br>`gsd-ui-checker` | ✓ | **严禁 Write/Edit** | ✓ (只读检查) | ✗ | **独立裁判角色**；只能读代码挑刺，绝对不能帮写手「代笔」改测试 |
| **执行型 (Executors)** | `gsd-executor`<br>`gsd-code-fixer` | ✓ | ✓ (具备 Edit 权) | ✓ | ✗ | 专注文档给定的 Task；**禁止随意联网**，避免外界幻觉干扰本地事实 |
| **验证型 (Verifiers)** | `gsd-verifier`<br>`gsd-dom-verifier` | ✓ | 仅 Write 报告 | ✓ (跑测试) | ✗ | 基于客观命令退出码判定成败；无法篡改已有的代码逻辑 |

这种权限正交的设计，确保了**做规划的不能写代码、写代码的不能裁定测试、做验收的不能掩盖问题**。系统在每一道流水线上相互牵制、相互对齐。

---

## 依赖拓扑（DAG）与贪心文件重叠分区

当一个阶段被拆分成多个 Plan（例如 `01-01-PLAN.md`, `01-02-PLAN.md`, `01-03-PLAN.md`）后，系统如何决定哪些能并发执行，哪些必须排队？

平庸的做法是要么完全串行（极慢），要么完全无脑并发（必然文件冲突）。GSD Core 实现了一个**文件重叠分区引擎（File Overlap Partitioner）**：

```text
阶段任务集：
Plan A: [auth.ts, user.ts]
Plan B: [payment.ts]
Plan C: [auth.ts, route.ts]
Plan D: [settings.ts]

拓扑排序与贪心分区结果：
┌──────────────────────────────────────────────┐
│ Wave 1 (并行波次): Plan A, Plan B, Plan D    │  <- A、B、D 触碰的文件无任何交集，并发安全！
└──────────────────────────────────────────────┘
                       | (全部完成并合并)
                       v
┌──────────────────────────────────────────────┐
│ Wave 2 (后续波次): Plan C                    │  <- Plan C 依赖 auth.ts，必须等 Wave 1 合并后执行！
└──────────────────────────────────────────────┘
```

1. **依赖图驱动**：首先解析每个 Plan 的 `depends_on` 属性，构建 Kahn 算法的有向无环图（DAG）。
2. **贪心首充划分（Greedy First-Fit）**：在同一个 DAG 层级内，检查每个 Plan 声明修改的文件列表（`files_modified`）。一旦发现文件重叠，自动拆分进不同的 Wave，保证**同一个 Wave 内的 Executor 绝对不会修改同一份文件**。

---

## Git Worktree 物理隔离：真正的并发安全

确定了 Wave 1 可以并行后，多进程直接在当前 Git 目录下并发跑吗？
**绝对不行！**

`git checkout`、`git commit`、npm 安装依赖都会锁死当前目录和 `.git/index` 文件。多 Agent 盲目并发会导致 Git 索引崩溃、文件被覆盖、锁争抢。

GSD Core 使用原生的 **Git Worktree（工作区快照）** 技术实现了操作系统级别的目录隔离：

```text
主项目目录 /workspace/my-app (Main Orchestrator)
  ├── .git/
  └── .planning/
        │
        ├── 分支隔离衍生 ────> /tmp/gsd-worktree-agent-01 (Executor 1 独占)
        │                      └── 独立文件、独立上下文、单 Task 原子 Commit
        │
        └── 分支隔离衍生 ────> /tmp/gsd-worktree-agent-02 (Executor 2 独占)
                               └── 独立文件、独立上下文、单 Task 原子 Commit
```

### 调度工作流程：
1. **创建独立工作区**：当 Wave 1 启动时，调度器通过 `git worktree add -b worktree-agent-{id}` 为每个任务在临时目录下开辟完全隔离的实体代码副本。
2. **独立执行与原子提交**：每个 `gsd-executor` 只能在被指派的 Worktree 路径下执行，修改代码并针对每一个 Task 进行原子提交。
3. **完成收敛与合并**：当该波次所有 Agent 顺利交付后，主控编排器对各临时分支进行规范性检查（Scope Conformance），确认无越权修改后依次合并回主分支，并执行 `git worktree remove` 清理现场。

---

## 架构价值总结

通过 **权限最小化矩阵 + DAG 文件重叠排班 + Git Worktree 物理隔离**，GSD Core 彻底解决了多智能体协作中的「三大绝症」：
- **越权风险** 被角色工具限制掐死；
- **文件冲突** 被静态重叠检测规避；
- **环境污染** 被操作系统级的 Worktree 彻底解耦。

这才是能够真正放心让 AI 在后台跑完一整夜而不搞砸代码库的硬核工业级架构。

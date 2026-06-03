---
title: "GSD 快速开始：从单次任务到完整项目管理"
date: "2026-05-14"
source: "原创"
url: ""
---

# GSD 快速开始：从单次任务到完整项目管理

对于刚开始使用 `get-shit-done` (GSD) 的用户，建议遵循从**单次任务**到**完整项目管理**的路径。GSD 是一个为 Claude Code 等 AI 助手设计的元提示（Meta-prompting）系统，旨在解决长会话中的上下文衰减（Context Decay）问题——即当 Claude 填充上下文窗口时发生的质量退化。

---

## 快速开始路径

### 1. 简单场景：单次任务 (Quick Fix)

如果你只想快速修复一个 Bug 或添加一个小功能，不需要复杂的规划。

- **命令**：`/gsd-quick`
- **特点**：跳过研究和验证步骤，直接生成计划并执行，适合不影响大局的小改动。
- **核心保障**：保留原子提交和状态跟踪，路径更短但不降质量。数据存放在 `.planning/quick/`，不和 phase 混在一起。

### 2. 中等场景：已有代码库的维护

如果你在一个已经有代码的项目中使用 GSD，需要先让它"认识"你的项目。

- **步骤**：
  1. 运行 `/gsd-map-codebase`：分析现有技术栈、架构和约定。它会并行拉起多个代理分析你的技术栈、架构、约定和风险点。
  2. 运行 `/gsd-new-project`：基于现有分析初始化 GSD 结构，此时 AI 的提问会更聚焦于你打算新增的内容，规划时也会自动加载你的现有模式。

### 3. 复杂场景：从零构建新项目 (Full Workflow)

这是 GSD 的核心流程，通过多个专用代理（Agents）协作完成。

- **标准工作流**：
  1. **初始化**：`/gsd-new-project`。AI 会通过提问理清目标，提取 v1/v2 需求范围，并生成 `ROADMAP.md`。
  2. **讨论**：`/gsd-discuss-phase 1`。针对第一个阶段深入讨论，识别灰区（视觉功能、API/CLI、内容系统、组织型任务），AI 会持续追问直到你满意，最终生成 `CONTEXT.md`。
  3. **规划**：`/gsd-plan-phase 1`。AI 结合 `CONTEXT.md` 进行研究并制定 2-3 份原子化任务计划，使用 XML 结构定义每个任务，并对照需求验证。
  4. **执行**：`/gsd-execute-phase 1`。AI 按 wave 并行执行任务，每个计划使用新上下文（20 万 token 纯用于实现），每个任务单独原子化 Git 提交，并对照目标验证。
  5. **验收**：`/gsd-verify-work`。对照目标检查代码库是否完整交付。

---

## XML 任务计划示例

GSD 通过将任务拆分为小的、带验证步骤的 XML 结构来保证输出质量：

```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken - CommonJS issues).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

---

## 核心提示

- **权限设置**：建议使用 `claude --dangerously-skip-permissions` 运行，以避免频繁的手动确认干扰自动化流程。
- **状态查看**：随时可以使用 `/gsd-progress` 查看当前项目进度和后续步骤。
- **项目重置**：所有规划文件都存储在 `.planning/` 目录下，删除该目录即可重置项目状态。如果 `/gsd-new-project` 检测到已有 `.planning/PROJECT.md`，会进行安全检查，需先删除再重新初始化。

---

## 相关阅读

- [GSD 架构设计](./gsd-architecture.md) — Goals/Skills/Docs 三层架构详解

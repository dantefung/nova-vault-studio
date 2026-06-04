---
title: "Get Shit Done 技能专栏"
date: "2026-06-04"
source: "gsd-build/get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# Get Shit Done (GSD) 技能专栏

> Get Shit Done (gsd) 是 Claude Code 的 spec-driven 开发方法论——通过严格的 phase/workflow/agent 编排，把模糊需求推进到生产就绪的代码。

<!-- more -->

## 简介

gsd 包含 **91 个 workflow**（如 add-phase、execute-phase、plan-phase）+ **30 个 agent**（如 gsd-executor、gsd-planner、gsd-debugger）。每个 workflow 是一个 `/gsd-*` 命令，agent 是 sub-agent 角色。

本专栏按"项目生命周期"组织 workflow，按"专业角色"组织 agent。

## 核心方法

- **Phase-Roadmap-Driven**：每个项目拆成 milestone → phase → plan → task 四层
- **Spec-First**：所有决策先写 spec，再写代码
- **Agent 角色化**：每个 agent 有专属职责（researcher/planner/executor/verifier）
- **Conversation 上下文持久化**：每个 phase 生成 context 文件，下次可续接

## Workflow 速览（按项目生命周期）

### 🆕 启动

- [new-project](./new-project) — 初始化新项目
- [new-milestone](./new-milestone) — 启动新 milestone
- [map-codebase](./map-codebase) — 映射代码库

### 📝 规划

- [plan-phase](./plan-phase) — 计划 phase
- [discuss-phase](./discuss-phase) — 讨论 phase 假设
- [add-phase](./add-phase) — 新增 phase
- [list-phase-assumptions](./list-phase-assumptions) — 列出 phase 假设
- [insert-phase](./insert-phase) / [remove-phase](./remove-phase) / [edit-phase](./edit-phase) — phase CRUD
- [add-todo](./add-todo) / [add-backlog](./add-backlog) — 添加待办
- [add-tests](./add-tests) — 追加 UAT 测试
- [milestone-summary](./milestone-summary) — milestone 总结
- [plan-milestone-gaps](./plan-milestone-gaps) — 补 milestone 缺口

### 🔍 研究与发现

- [explore](./explore) — 探索
- [discover-phase](./discover-phase) — 发现 phase
- [scan](./scan) — 扫描
- [ingest-docs](./ingest-docs) — 摄入文档
- [import](./import) — 导入计划
- [debug](./debug) — 调试

### 🤖 执行

- [execute-phase](./execute-phase) — 执行 phase
- [execute-plan](./execute-plan) — 执行 plan
- [do](./do) — 执行
- [quick](./quick) — 快速执行
- [fast](./fast) — 快速模式
- [autonomous](./autonomous) — 自主模式
- [spike](./spike) / [spike-wrap-up](./spike-wrap-up) — 快速实验

### ✅ 验证

- [verify-work](./verify-work) — UAT 验证
- [verify-phase](./verify-phase) — 验证 phase
- [audit-fix](./audit-fix) — 审计-修复流水线
- [audit-uat](./audit-uat) — 审计 UAT
- [audit-milestone](./audit-milestone) — 审计 milestone
- [validate-phase](./validate-phase) — 校验 phase
- [secure-phase](./secure-phase) — 安全审查
- [eval-review](./eval-review) — 评估审查

### 📤 发布

- [ship](./ship) — 发版
- [pr-branch](./pr-branch) — 创建 PR
- [graduation](./graduation) — 收尾
- [complete-milestone](./complete-milestone) — 完结 milestone
- [ui-review](./ui-review) — UI 审查
- [ui-phase](./ui-phase) — UI phase

### 🔧 维护

- [update](./update) — 升级
- [cleanup](./cleanup) — 清理
- [undo](./undo) — 回滚
- [session-report](./session-report) — 会话报告
- [sync-skills](./sync-skills) — 同步 skills
- [manager](./manager) — 交互式 phase 管理

### 🧰 工具

- [help](./help) — 帮助
- [next](./next) — 下一步
- [note](./note) — 笔记
- [progress](./progress) — 进度
- [stats](./stats) — 统计
- [settings](./settings) / [settings-advanced](./settings-advanced) / [settings-integrations](./settings-integrations) — 配置
- [check-todos](./check-todos) — 检查 todo
- [list-workspaces](./list-workspaces) / [new-workspace](./new-workspace) / [remove-workspace](./remove-workspace) — workspace 管理
- [transition](./transition) — 状态转换
- [node-repair](./node-repair) — 节点修复
- [reapply-patches](./reapply-patches) — 重应用补丁
- [sketch](./sketch) / [sketch-wrap-up](./sketch-wrap-up) — UI 草图
- [forensics](./forensics) — 事后调查
- [extract-learnings](./extract-learnings) — 提取学习
- [inbox](./inbox) — 收件箱
- [capture](./capture) — 捕获想法
- [health](./health) — 健康度
- [docs-update](./docs-update) — 文档更新
- [milestone-summary](./milestone-summary) — milestone 总结
- [analyze-dependencies](./analyze-dependencies) — 依赖分析
- [code-review](./code-review) / [code-review-fix](./code-review-fix) — 代码审查
- [diagnose-issues](./diagnose-issues) — 诊断问题
- [mvp-phase](./mvp-phase) — MVP phase
- [plan-review-convergence](./plan-review-convergence) — 跨 AI 计划收敛
- [discuss-phase-power](./discuss-phase-power) — 强模式讨论
- [discuss-phase-assumptions](./discuss-phase-assumptions) — phase 假设讨论
- [ultraplan-phase](./ultraplan-phase) — 云端超规划
- [ai-integration-phase](./ai-integration-phase) — AI 集成 phase
- [spec-phase](./spec-phase) — phase 规范
- [thread](./thread) — 线程管理
- [pause-work](./pause-work) — 暂停工作
- [resume-project](./resume-project) — 续接项目
- [profile-user](./profile-user) — 用户画像
- [docs-update](./docs-update) — 文档更新
- [code-review-fix](./code-review-fix) — 代码审查修复
- [discuss-phase](./discuss-phase) / [discuss-phase-power](./discuss-phase-power) / [discuss-phase-assumptions](./discuss-phase-assumptions) — phase 讨论三模式

## Agent 速览（按角色）

### 🔬 研究员

- [gsd-advisor-researcher](./gsd-advisor-researcher) — 顾问研究员
- [gsd-ai-researcher](./gsd-ai-researcher) — AI 研究员
- [gsd-domain-researcher](./gsd-domain-researcher) — 领域研究员
- [gsd-phase-researcher](./gsd-phase-researcher) — phase 研究员
- [gsd-project-researcher](./gsd-project-researcher) — 项目研究员
- [gsd-research-synthesizer](./gsd-research-synthesizer) — 研究综合
- [gsd-ui-researcher](./gsd-ui-researcher) — UI 研究员

### 📋 规划师

- [gsd-planner](./gsd-planner) — 主规划师
- [gsd-roadmapper](./gsd-roadmapper) — 路线图
- [gsd-framework-selector](./gsd-framework-selector) — 框架选择
- [gsd-pattern-mapper](./gsd-pattern-mapper) — 模式映射
- [gsd-plan-checker](./gsd-plan-checker) — 计划检查
- [gsd-phase-planner](./gsd-phase-planner) — phase 规划

### 🤖 执行员

- [gsd-executor](./gsd-executor) — 主执行员
- [gsd-codebase-mapper](./gsd-codebase-mapper) — 代码库映射
- [gsd-code-fixer](./gsd-code-fixer) — 代码修复
- [gsd-doc-writer](./gsd-doc-writer) — 文档写作
- [gsd-doc-synthesizer](./gsd-doc-synthesizer) — 文档综合
- [gsd-doc-classifier](./gsd-doc-classifier) — 文档分类

### 🐛 调试与诊断

- [gsd-debugger](./gsd-debugger) — 调试
- [gsd-debug-session-manager](./gsd-debug-session-manager) — 调试会话管理
- [gsd-eval-auditor](./gsd-eval-auditor) — 评估审计
- [gsd-eval-planner](./gsd-eval-planner) — 评估规划
- [gsd-nyquist-auditor](./gsd-nyquist-auditor) — Nyquist 验证
- [gsd-integration-checker](./gsd-integration-checker) — 集成检查

### 🔍 审查

- [gsd-assumptions-analyzer](./gsd-assumptions-analyzer) — 假设分析
- [gsd-doc-verifier](./gsd-doc-verifier) — 文档验证
- [gsd-code-reviewer](./gsd-code-reviewer) — 代码审查
- [gsd-security-auditor](./gsd-security-auditor) — 安全审计
- [gsd-ui-auditor](./gsd-ui-auditor) — UI 审计
- [gsd-ui-checker](./gsd-ui-checker) — UI 检查
- [gsd-verifier](./gsd-verifier) — 验证

### 👤 用户分析

- [gsd-user-profiler](./gsd-user-profiler) — 用户画像
- [gsd-intel-updater](./gsd-intel-updater) — 情报更新

## 适用场景

- 多 phase 长周期项目
- 需要 spec-first / 严格 phase 边界的工程团队
- 多个 sub-agent 协作的复杂任务
- 想要"AI 自动推进项目 + 人类 UAT"的开发模式

## 关联专栏

- [agentic-engineer](../agentic-engineer/) — Agent 工程架构
- [harness-engineering](../harness-engineering/) — Harness 工程
- [mattpocock-skills](../mattpocock-skills/) — Matt Pocock skills
- [superpowers-skills](../superpowers-skills/) — obra/superpowers
- [gstack-skills](../gstack-skills/) — Garry Tan gstack

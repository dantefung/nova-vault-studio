---
title: "Matt Pocock Skills 安装与使用指南"
date: "2026-05-28"
source: "公众号"
url: "https://mp.weixin.qq.com/s/xxxxxxxxxxxx"
---

# Matt Pocock Skills 安装与使用指南

Matt Pocock 的技能包是 GitHub 上最火的 Claude Code / Codex 技能集合之一，75K star。与大多数 Agent 技能不同，这套技能不追求"酷炫"，而是把经典的工程原则（调试、TDD、PRD、代码审查）拆解成 AI 可执行的精确指令。

本文记录完整的安装过程、所有技能分类与用法，以及下一步配置建议。

<!-- more -->

## 安装

```bash
npx skills@latest add mattpocock/skills
```

运行后进入交互式菜单，可选择安装哪些技能。全部安装后，29 个技能被写入 `.agents/skills/` 目录，并自动 symlink 到 Claude Code 的技能目录。

## 技能分类

### 🔧 工程类（日常开发）

| 技能 | 用途 | 核心命令 |
|------|------|----------|
| `diagnose` | 系统化调试：复现→最小化→假设→插桩→修复→回归 | `/diagnose` |
| `tdd` | 测试驱动开发：红-绿-重构循环 | `/tdd` |
| `grill-with-docs` | 访谈式对齐术语，更新 CONTEXT.md 和 ADR | `/grill-with-docs` |
| `to-issues` | 把计划/PRD 拆成可独立领取的 GitHub issues | `/to-issues` |
| `to-prd` | 把对话上下文合成为 PRD | `/to-prd` |
| `improve-codebase-architecture` | 识别架构改进机会 | `/improve-codebase-architecture` |
| `triage` | issue 分流状态机 | `/triage` |
| `zoom-out` | 给不熟悉的代码提供更高层视角 | `/zoom-out` |
| `prototype` | 构建一次性原型探索设计 | `/prototype` |

### ⚡ 生产力类

| 技能 | 用途 | 核心命令 |
|------|------|----------|
| `caveman` | 超压缩沟通模式，省 ~75% token | `/caveman` |
| `grill-me` | 追问式访谈直到每个决策分支都明确 | `/grill-me` |
| `handoff` | 压缩当前对话为文档，方便交接给另一个 agent | `/handoff` |
| `write-a-skill` | 创建新技能 | `/write-a-skill` |

### 📝 通用类

| 技能 | 用途 | 核心命令 |
|------|------|----------|
| `review` | 代码审查 | `/review` |
| `qa` | QA 测试 | `/qa` |
| `design-an-interface` | 接口设计 | `/design-an-interface` |
| `teach` | 教学 | `/teach` |
| `writing-beats/fragments/shape` | 写作辅助 | `/writing-beats` |
| `git-guardrails-claude-code` | git 危险命令拦截 | `/git-guardrails-claude-code` |
| `setup-pre-commit` | 配置 Husky pre-commit hooks | `/setup-pre-commit` |
| `ubiquitous-language` | 统一术语 | `/ubiquitous-language` |
| `request-refactor-plan` | 重构计划 | `/request-refactor-plan` |
| `edit-article` | 文章编辑 | `/edit-article` |
| `obsidian-vault` | Obsidian 笔记集成 | `/obsidian-vault` |

## 核心技能详解

### diagnose — 系统化调试

```
/diagnose
```

四阶段调试流程：

1. **复现** — 获得精确的复现步骤
2. **最小化** — 剥离到最小可复现场景
3. **假设** — 列出所有可能原因，按概率排序
4. **插桩** — 用最小改动验证假设
5. **修复** — 实施修复
6. **回归** — 确认修复不引入新问题

### tdd — 测试驱动开发

```
/tdd
```

红-绿-重构循环：

- **红**：写一个失败测试，定义期望行为
- **绿**：写最少量代码让测试通过
- **重构**：在测试保护下优化代码

### caveman — 超压缩沟通

```
/caveman
```

将对话压缩到最小 token 表达，适用于高速迭代场景。省 ~75% token，同时保持关键信息完整。

### handoff — 交接文档

```
/handoff
```

将当前对话压缩为结构化文档，便于交接给另一个 agent 或 human review。包含：上下文、决策、待办、风险。

### to-issues — 计划拆解

```
/to-issues
```

把 PRD 或计划文档拆成多个独立可领取的 GitHub issues，每个 issue 有清晰的验收标准和上下文依赖。

### to-prd — PRD 合成

```
/to-prd
```

把当前对话上下文合成为结构化 PRD，包含：背景、用户故事、功能列表、非功能需求、验收标准。

## 下一步：配置 Issue 跟踪

安装完成后可运行：

```bash
/setup-matt-pocock-skills
```

配置项：

- **Issue 跟踪方式**：GitHub / Linear / 本地文件
- **文档路径**：PRD 和 ADR 的存放位置

## 参考

- [mattpocock/skills GitHub](https://github.com/mattpocock/skills)
- [Matt Pocock Twitter](https://twitter.com/mattpocock)
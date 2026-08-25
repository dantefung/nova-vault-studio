---
name: vast-age-harness-init
description: 为项目初始化 Attractor-Guided Engineering (AGE) harness 系统。搭建 docs/ 目录结构、写入 AGENTS.md、安装 mattpocock/skills、重组现有文档。触发词：init AGE、setup AGE harness、apply AGE template、initialize project with AGE、set up docs system、add AGE to project、init harness、初始化 harness、建立文档体系、给项目加 harness
allowed-tools: Read, Bash, Glob, Grep, Write
---

# Vast AGE Harness Init

用 AGE（Attractor-Guided Engineering）体系把一个项目从零搭建到 AI Agent 可用状态。

## 核心目标

让项目拥有一套**跨会话持久化**的 AI 协作基础设施：
- `docs/context/` — AI 必须读的先读文件，保证每次会话上下文一致
- `AGENTS.md` — 项目级的 Agent 行为宪法
- `.agents/skills/` + `docs/skills/` — 可复用的技能库

> **铁律**：一次初始化，永久受益。不要在已有 harness 的项目上重复运行。

---

## 前置检查 ⚠️ REQUIRED

在动手之前，先确认当前状态：

```bash
# 检查是否已有 AGENTS.md
ls AGENTS.md

# 检查是否已有 docs/
ls docs/ 2>/dev/null

# 检查是否已有 .agents/
ls .agents/ 2>/dev/null
```

如果 `AGENTS.md` 已存在且 `docs/context/` 下有 6 个文件，说明项目已初始化过，跳过整个流程并告知用户。

---

## Phase 1: 收集项目上下文

静默执行，不输出，只读信息：

| 文件 | 读取目的 |
|------|---------|
| `README.md` | 项目名、定位、技术栈 |
| `package.json` / `pyproject.toml` / `Cargo.toml` / `Gemfile` | 语言、依赖、构建命令 |
| `.git/config` + `git remote -v` | 仓库远程地址 |
| 关键源码目录 | 入口文件、模块结构 |

用 `Grep` 快速扫一遍：项目有没有测试框架？有没有 CI？有没有已有的文档？

---

## Phase 2: 创建 docs/ 目录结构

```bash
mkdir -p docs/{analysis,archive,articles,audits,backlog,bugs,context,design,discussions,examples,input,lessons,logs,plans,process,references,requirements,retrospectives,skills,testing}
```

创建完成后，每个目录写一个 `README.md`，说明该目录的用途（一行即可）。

---

## Phase 3: 写入 docs/context/ 六个核心文件

### 3.1 `docs/context/README.md`

列出本目录下所有文件，并说明读取顺序：

```markdown
# Context 文件索引

按顺序阅读：
1. `project-context.md` — 先读这个，了解项目
2. `ai-autonomy-policy.md` — AI 能做什么、不能做什么
3. `codebase-map.md` — 代码结构地图
4. `source-of-truth-and-precedence.md` — 冲突解决规则
5. `conventions.md` — 约定和规则
```

### 3.2 `docs/context/project-context.md`

基于 Phase 1 收集的信息填写：

```markdown
# Project Context

## 项目身份
- 名称：{从 README 提取}
- 一句话描述：{一句话}
- 技术栈：{语言 + 关键依赖}

## 验证命令
| 操作 | 命令 |
|------|------|
| 运行测试 | `{test cmd}` |
| 构建项目 | `{build cmd}` |
| 启动开发服务 | `{dev cmd}` |

## AI 禁止操作（Protected Areas）
- {列出不能动的文件/目录，如数据库迁移脚本、生产配置等}
```

### 3.3 `docs/context/ai-autonomy-policy.md`

定义 AI 的自主级别：

```markdown
# AI Autonomy Policy

## 自主级别

| 级别 | 含义 | 示例场景 |
|------|------|---------|
| Implement | 直接执行，无需确认 | 修复已知 bug、格式化代码 |
| Plan-First | 先出计划，确认后执行 | 新增功能、重构模块 |
| Ask-First | 必须先问用户 | 改架构、换技术栈、删文件 |
| Research-Only | 只收集信息，不做决定 | 调研依赖、分析现状 |
| Blocked | 完全禁止 | {Protected Areas} |

## 决策规则
- 改动 < 3 个文件 → Implement
- 改动涉及公共 API → Plan-First
- 涉及数据库 schema / 生产配置 → Ask-First
- 涉及安全 / 密钥 / 凭证 → Research-Only
```

### 3.4 `docs/context/codebase-map.md`

从 Phase 1 扫描结果填写：

```markdown
# Codebase Map

## 入口点
- {entry point 1}: {what it does}
- {entry point 2}: {what it does}

## 高频改动路径
- {模块A} → {模块B}: {什么情况下会同时改}

## 脆弱文件（改了容易出 bug）
- {文件路径}: {为什么脆弱}

## 搜索提示
- 找路由：grep -r "router" src/
- 找状态管理：grep -r "useState\|store" src/
```

### 3.5 `docs/context/source-of-truth-and-precedence.md`

```markdown
# Source of Truth & Precedence

当不同文档发生冲突时，优先级如下：

1. `AGENTS.md`（项目宪法）
2. `docs/context/` 下的文件（运行时约束）
3. `docs/design/`（功能设计）
4. `docs/requirements/`（需求规格）
5. `docs/analysis/`（分析结论）
6. 其他文档

冲突解决原则：后写的覆盖先写的，但必须在对应文档中记录修改原因。
```

### 3.6 `docs/context/conventions.md`

```markdown
# Conventions

## 文件命名
- 源码：kebab-case（`user-service.ts`）
- 测试：`*.test.ts` / `*.spec.ts`
- 文档：kebab-case，按功能分组

## 注释策略
- 为什么这样写（WHY），不写这是什么（WHAT）
- 没有 WHY 的注释=垃圾注释，删掉

## 验证规则
- 每次改动后必须能跑通测试
- PR 必须有 Review Checklist 更新

## 项目特定约定
- {根据 Phase 1 扫描结果填写}
```

---

## Phase 4: 写入 docs/index.md

```markdown
---
title: "Docs Index"
---

# {项目名} Docs

## 目的
这套文档是项目的 AI 协作文档中枢。AI Agent 读它，比读代码更快理解项目。

## 必读顺序
1. `AGENTS.md`（根目录）— 先看 Agent 该干什么
2. `docs/context/project-context.md` — 了解项目身份
3. `docs/context/ai-autonomy-policy.md` — 知道 AI 边界

## 目录速查

| 需求 | 去哪找 |
|------|--------|
| 这个项目是干什么的 | `docs/context/project-context.md` |
| AI 能做什么不能做什么 | `docs/context/ai-autonomy-policy.md` |
| 代码结构 | `docs/context/codebase-map.md` |
| 怎么写新功能 | `docs/process/application-development-workflow.md` |
| 技能列表 | `docs/skills/README.md` |

## 核心原则
- Context 优先于代码：AI 读 docs/context/ 再读源码
- 文档过时比没有文档更糟：改了代码就更新文档
```

---

## Phase 5: 写入 AGENTS.md

在项目根目录创建 `AGENTS.md`，包含以下章节：

```markdown
# {项目名} — AGENTS.md

## Project Intent
{一句话：这个项目是什么，为什么存在}

## Core Philosophy
{项目的核心工程哲学，来自 README 和代码风格}

## Task Routing
| 任务类型 | 处理方式 |
|---------|---------|
| Bug 修复 | 直接实施，更新 docs/bugs/ |
| 新功能 | Plan-First，写 design/ |
| 重构 | Ask-First，先读 codebase-map.md |
| 文档 | 直接实施，更新对应 docs/ 子目录 |

## Operating Rules
- 读 context/ 六文件再动手
- 不改 Protected Areas
- 测试必须通过才能提交

## Read This First
1. `docs/context/project-context.md`
2. `docs/context/ai-autonomy-policy.md`
3. `docs/context/codebase-map.md`

## Documentation Ownership
- AGENTS.md 维护者：{项目维护者}
- context/ 文件与代码同步变更
- 每周 review 一次 docs/

## Default Workflow
Init → Plan → Execute → Verify → Document

## Skill Usage Rule
- 先查 docs/skills/README.md 看有没有合适的技能
- 没有技能时直接做，不要编造
```

---

## Phase 6: 写入配套文档

### `docs/process/application-development-workflow.md`

```markdown
# Application Development Workflow

## 流程概览
```
需求 → 设计 → 实现 → 验证 → 文档
  ↓       ↓       ↓       ↓       ↓
requirements/ design/  src/    testing/ docs/
```

## 各阶段产出

| 阶段 | 产出 | 位置 |
|------|------|------|
| 需求 | 需求规格 | `docs/requirements/` |
| 设计 | 设计方案 + Review Checklist | `docs/design/` |
| 实现 | 代码 + 测试 | `src/` |
| 验证 | 测试结果 | `docs/testing/` |
| 文档 | 更新对应 docs/ 子目录 | 各处 |

## 何时触发
- 新功能 → 完整走一遍
- Bug 修复 → 验证 + 更新 docs/bugs/
- 重构 → 设计 + 验证
```

### `docs/skills/README.md`

列出可用技能路由表（来自 mattpocock/skills）。

---

## Phase 7: 安装 mattpocock/skills

```bash
git clone https://github.com/mattpocock/skills.git /tmp/mattpocock-skills
mkdir -p .agents/skills docs/skills
for dir in engineering productivity misc personal in-progress deprecated; do
  cp -r /tmp/mattpocock-skills/skills/$dir .agents/skills/ 2>/dev/null
  cp -r /tmp/mattpocock-skills/skills/$dir docs/skills/ 2>/dev/null
done
rm -rf /tmp/mattpocock-skills
```

写入 `.agents/skills/README.md`：

```markdown
# Skills 目录

## 分类

| 分类 | 用途 |
|------|------|
| engineering | 工程类技能（测试、重构、调试等） |
| productivity | 效率类技能（笔记、写作、规划等） |
| misc | 杂项技能 |
| personal | 个人提升技能 |
| in-progress | 开发中的技能 |
| deprecated | 已弃用，暂不推荐 |

## 使用方式
通过 `/skill-name` 或直接描述需求触发。
详见 `docs/skills/README.md` 的路由表。
```

---

## Phase 8: 重组现有文档

扫描项目中的现有文档，按以下规则归位：

| 现有位置/类型 | 目标目录 |
|-------------|---------|
| `ARCHITECTURE.md` / 架构图相关 | `docs/architecture/` |
| Bug 记录、事故复盘 | `docs/bugs/` |
| 技术方案分析、选型对比 | `docs/analysis/` |
| 迁移计划、重构方案 | `docs/archive/` |
| 用户指南、参考文档 | `docs/references/` |
| 开发日志 | `docs/logs/` |
| 媒体/视频/课程文件 | `docs/archive/media/` |
| 探索性研究笔记 | `docs/archive/explore/` |
| 工程经验教训 | `docs/lessons/` |
| Changelog | `docs/archive/` |

执行前**列出待移动文件清单**，让用户确认再动。

---

## Phase 9: 验证

逐项检查，全部通过才算完成：

```
□ docs/index.md 是 docs/ 下唯一的根级文件
□ 所有 20 个子目录已创建
□ docs/context/ 下有 6 个文件（README.md + 5 个 context 文件）
□ 根目录有 AGENTS.md
□ .agents/skills/ 和 docs/skills/ 下有 43+ 个 SKILL.md
□ 现有文档已归位（如有）
```

输出验收报告：

```
✅ AGE Harness 初始化完成

已创建：
- docs/ 目录结构（20 个子目录）
- docs/context/（6 个核心文件）
- docs/index.md
- AGENTS.md
- .agents/skills/（mattpocock/skills）
- docs/skills/（mattpocock/skills 副本）

已重组：
- {列出移动的文件，如无则写"无"}

下一步：
1. 阅读 docs/context/project-context.md 补充项目细节
2. 阅读 docs/context/ai-autonomy-policy.md 确认 AI 权限边界
3. 开始用 /kickoff 或 /brainstorming 进入开发流程
```

---

## 反模式

❌ 不要在没有 README 的空项目上运行 —— 先写 README，再跑 init
❌ 不要在已有成熟 harness 的项目上重复运行 —— 增量更新即可
❌ 不要跳过 Phase 1 —— 不了解项目就瞎写文档是浪费时间
❌ 不要手动编辑 mattpocock/skills 下的文件 —— 它们是只读参考

---

## 参考

- AGE 模板：https://github.com/entropy-cloud/attractor-guided-engineering-template
- mattpocock/skills：https://github.com/mattpocock/skills

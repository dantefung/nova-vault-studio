---
title: "Pensieve #4：工具链与 Pipeline"
description: "双层架构、系统代码与项目数据物理隔离、manifest 锚点机制"
series: "pensieve"
part: 4
created: 2026-06-03
---

# Pensieve #4：工具链与 Pipeline

> 📖 [完整可视化版本](/pensieve-deep-dive.html#tools) | [系列索引](./index.md)

## 七大工具

Pensieve 提供七个职责分明的工具，每个工具有明确的边界——"负责什么"和"不负责什么"。

### init — 初始化

**职责**：初始化项目 `.pensieve/` 目录，播种种子文件，执行基线探索和代码审查

**触发场景**：
- 首次集成 Pensieve 到项目
- 重装后需要默认结构

**关键约束**：幂等；不覆盖已有用户数据

**执行**：
```bash
bash "${PENSIEVE_SKILL_ROOT:-$HOME/.claude/skills/pensieve}/.src/scripts/init-project-data.sh"
```

init 完成后会：
1. 读取 `pipelines/run-when-reviewing-code.md`
2. 基于最近 commit 和热点文件探索
3. 产出"待持久化候选"列表，但不自动写入
4. 提醒用户运行 doctor 验证

### upgrade — 刷新源码

**职责**：在全局 git clone 中刷新 Pensieve 技能源码

**执行**：
```bash
cd ~/.claude/skills/pensieve
git pull --ff-only || { git fetch origin && git reset --hard "origin/$(git rev-parse --abbrev-ref HEAD)"; }
```

**关键约束**：不迁移结构，不发 PASS/FAIL。一次更新对所有项目生效。

### migrate — 迁移遗留

**职责**：迁移遗留数据，对齐目录结构和关键文件

**触发场景**：旧路径清理、关键文件漂移、遗留图谱残留

**关键约束**：不更新版本，不发 PASS/FAIL

### doctor — 健康扫描

**职责**：只读扫描 `.pensieve/` 用户数据目录，输出固定格式报告

**检查项**：
- frontmatter 格式
- `[[...]]` 链接有效性
- 目录结构完整性
- 关键种子文件是否漂移
- auto memory 引导行
- CLAUDE.md / AGENTS.md 短路由对齐

**关键约束**：不修改业务代码。只维护 `state.md` 和运行时图谱。

### self-improve — 经验捕获

**职责**：从会话上下文 + diff 中提取可复用结论，写入用户数据

**写入规则**：
- **新文件** → 默认写 `short-term/{type}/`
- **已有文件** → 原地编辑
- **用户明确要求** → 可跳过 short-term 直接写长期目录

**分类标准**：
- `maxim` → 跨项目硬规则
- `decision` → 架构选择
- `knowledge` → 可验证事实
- `pipeline` → 可复用工作流（需满足三条件）

**信号判断**（任何匹配即触发捕获）：
- 发现了 bug 根因
- 做出了架构/设计决策
- 发现了新模式或反模式
- 探索产出了"症状 → 根因 → 定位"映射
- 澄清了边界、归属或约束
- 发现了系统中不存在/已废弃的能力

**关键约束**：不替代 init/migrate/doctor

### refine — 知识精炼

**职责**：通过五问审查和压缩来精炼知识库

**两个子任务**：

#### Subtask 1: Triage — 五问决策审查

| # | 问题 | 否 → | 是 → |
|---|------|------|------|
| Q1 | 删除后，未来是否会重复犯错或重复探索？ | **DELETE** | Q2 |
| Q2 | 有证据支撑吗（代码、文档、实验结果）？ | **DELETE** | Q3 |
| Q3 | 是否已被现有条目覆盖？ | Q4 | **DELETE**（合并后删除） |
| Q4 | 写作时的上下文现在还成立吗？ | **DELETE** | Q5 |
| Q5 | 是否符合目标层的内容规范？ | 补齐或 **DELETE** | **KEEP/PROMOTE** |

#### Subtask 2: Compress — 三种压缩技术

- **向上抽象**：多个条目 → 一个更高层条目
- **提取共享**：重复内容 → 独立条目 + `[[...]]` 引用
- **消除特殊情况**：表面规则 → 深层原则

### sync-instructions — 同步路由

**职责**：将 pipeline 短路由写入 `CLAUDE.md` / `AGENTS.md`

**关键约束**：不生成项目摘要，不内联完整 pipeline，不替代 `.pensieve/`

## Pipeline 工作流引擎

Pipeline 是 `HOW` 层的具体实现。不是简单的任务列表，而是**带有信号判断、验证循环和失败兜底的可执行工作流**。

### 三个创建条件（必须同时满足）

1. 同类型任务已复现 3 次以上
2. 步骤顺序不可互换
3. 每个步骤有可验证的完成标准

### Pipeline 骨架

```markdown
---
id: run-when-xxx
type: pipeline
title: Pipeline Name
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [pensieve, pipeline]
description: [触发场景, 跳过代价, 触发关键词]
---

## Signal Rules
- 只保留可复现、可定位、有证据支撑的结果

## Task Blueprint

### Task 1: [目标]
- **Goal**: 明确目标
- **Input**: 文件/路径
- **Steps**: 编号、具体、可执行
- **Completion criteria**: 可验证

### Task 2: ...

## Failure Fallback
1. 输入缺失时停止
2. 证据不足时过滤
3. 无高信号结果时明确声明
```

### 关键约束

- 文件名必须是 `run-when-*.md`
- Pipeline 正文只包含任务编排、验证循环和失败兜底
- 长篇背景/理由/约束应拆分到 knowledge/decision/maxim 并 `[[...]]` 链接回来
- 每个 pipeline 至少一个 `[[...]]` 上下文链接

## 三大内置 Pipeline

### run-when-committing

**触发词**：commit, git commit

**三步流程**：

1. **Task 1: 信号判断** — 检查 `git diff --cached`，判断是否有值得捕获的 insight。纯机械变更（格式化、重命名、依赖升级）跳过
2. **Task 2: 自动捕获** — 读 `self-improve.md`，从会话 + diff 提取 insight，按语义层分类，写入 short-term
3. **Task 3: 原子提交** — 按变更原因聚类，每个独立变更组一个 commit

**失败兜底**：`git diff --cached` 为空则跳过 Task 2/3；捕获失败则记录原因继续提交

### run-when-refactoring

**触发词**：refactor, large refactor, split code

**核心原则**：
- 先确认真实问题
- 先修上游数据权威性
- 分 2-3 步用户可见的步骤交付
- 新路径工作后删除旧路径
- 避免兼容/回退分支

### run-when-reviewing-code

**触发词**：review, code review, inspect code

**核心原则**：
- 从 git 历史和热点文件出发
- 验证候选问题
- 只报告高信号发现（附证据和文件位置）

## 工具路由表

SKILL.md 作为路由入口，根据关键词将请求分发到正确工具：

| 用户请求 | 正确工具 |
|---------|---------|
| "怎么安装/重装 Pensieve？" | 读 `skill-lifecycle.md` → `init` |
| "升级 Pensieve" | `upgrade` |
| "怎么更新？" | 读 `skill-lifecycle.md` → `upgrade` |
| "迁移到 v2 / 清理旧路径" | `migrate` |
| "检查数据有没有问题" | `doctor` |
| "捕获这个经验" | `self-improve` |
| "整理/去重/压缩知识" | `refine` |
| "把 pipeline 写入 CLAUDE.md" | `sync-instructions` |

## 下一步

→ [知识图谱与生命周期](./05-graph-and-lifecycle.md)：`[[...]]` 链接系统和状态机管理

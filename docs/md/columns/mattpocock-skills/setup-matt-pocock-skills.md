---
title: "setup-matt-pocock-skills 技能：仓库脚手架配置"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# setup-matt-pocock-skills 技能：仓库脚手架配置

## 定位

setup-matt-pocock-skills 为其他工程技能搭建**每个仓库的配置**。它是使用其他技能的前置条件，只需要在每个仓库运行一次。

## 配置内容

```
issue tracker  ← GitHub Issues 配置
triage label vocabulary  ← 标签体系
domain doc layout  ← 领域文档布局（CONTEXT.md + docs/adr/）
```

## 三项配置详解

### 1. Issue Tracker 配置

确定 Issue 的模板结构，包含必填字段：
- **复现步骤**（诊断类 Issue）
- **影响描述**（体验类 Issue）
- **Proposal**（方案类 Issue）

### 2. Triage Label 词汇

建立统一的标签体系，例如：
```
priority: P0 / P1 / P2 / P3
type: bug / feature / refactor / docs
status: needs-triage / has-repro / has-fix
area: frontend / backend / infra
```

### 3. Domain Doc 布局

- `CONTEXT.md` — 领域语言，定义通用术语和概念
- `docs/adr/` — 架构决策记录，每个 ADR 记录一个决策的背景、选项和结论

## 与其他技能的关系

setup-matt-pocock-skills 是**基础设施**，其他技能依赖它提供的配置：

| 技能 | 依赖配置 |
|------|----------|
| diagnose | Triage Label |
| improve-codebase-architecture | CONTEXT.md + ADR |
| to-issues | Issue Template |
| to-prd | Issue Template |

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[triage](./triage.md)、[to-issues](./to-issues.md)
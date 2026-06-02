---
title: "to-prd 技能：对话转 PRD 并提交 GitHub Issue"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# to-prd 技能：对话转 PRD 并提交 GitHub Issue

## 定位

将当前对话上下文**直接合成 PRD**（Product Requirement Document），并作为 GitHub Issue 提交。

## 与 to-issues 的关系

- **to-prd** — 从对话到 PRD（综合，不需要采访）
- **to-issues** — 从 PRD 到 Issue（分解，需要分析）

## PRD 核心要素

to-prd 产出的 PRD 包含：

```
# WHAT — 要解决什么问题
# WHO — 谁会遇到这个问题
# HOW — 可能的实现路径（不锁定方案）
# ACCEPTANCE CRITERIA — 交付标准（可测试）
# OUT OF SCOPE — 明确不做什么
# DEPENDENCIES — 依赖方
```

## 关键原则

- **不采访** — to-prd 直接综合用户已表达的内容
- **不锁定方案** — WHAT/WHO/HOW 分离，HOW 由 to-issues 进一步细化
- **可测试的验收标准** — 每条标准必须能通过自动化测试验证

## 使用场景

- 需求讨论结束时，直接生成 Issue
- 会议纪要转 PRD
- 用户描述模糊时，填充结构化 PRD 框架

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[to-issues](./to-issues.md)、[grill-with-docs](./grill-with-docs.md)
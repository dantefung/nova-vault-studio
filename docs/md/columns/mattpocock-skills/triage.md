---
title: "triage 技能：问题分类状态机"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# triage 技能：问题分类状态机

## 定位

triage 通过**分类角色状态机**对问题进行分类。每个 Issue 进入系统后，按状态机流转直到最终处理。

## 状态机设计

典型 triage 流程：

```
New → Triage Needed → Has Reproduction → Has Fix → Shipped
                 ↘ Priority High
                 ↘ Priority Low
                 ↘ Won't Fix
```

每个状态节点对应明确的**职责转移条件**：

- **New** — Issue 创建，等待初步分类
- **Triage Needed** — 需要补充信息（复现步骤、环境）
- **Has Reproduction** — 有可稳定复现的步骤
- **Has Fix** — 有提议的修复方案
- **Priority High/Low** — 按影响面分级
- **Won't Fix** — 明确不处理，附理由
- **Shipped** — 已发布

## 关键原则

- **每个状态转移必须有明确依据**，不允许模糊流转
- **角色驱动** — 不同角色（PM、Eng、QA）负责不同状态转移
- **信息守门** — 下一状态需要的信息必须在当前状态完成

## 与 improve-codebase-architecture 的关系

triage 解决的问题**入口**（Issue 从哪来），improve-codebase-architecture 处理**出口**（Issue 如何被消化）

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[diagnose](./diagnose.md)、[setup-matt-pocock-skills](./setup-matt-pocock-skills.md)
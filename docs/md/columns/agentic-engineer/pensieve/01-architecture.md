---
title: "Pensieve #1：架构与设计哲学"
description: 双层架构、系统代码与项目数据物理隔离、manifest 锚点机制
series: pensieve
part: 1
created: 2026-06-03
---

# Pensieve #1：架构与设计哲学

> 📖 [完整可视化版本](/pensieve-deep-dive.html#architecture) | [系列索引](./index.md)

## 核心命题

AI Agent 在编码场景中面临一个根本性矛盾：**模型有卓越的推理能力，但没有持久记忆**。每次新会话开始，Agent 对项目的认知归零。

Pensieve 的回答是：**经验不是参数，是结构。**

Fine-tuning 改变模型参数，但无法精确传递"这个项目的 API 必须幂等"这类具体知识。Pensieve 选择**符号化、可编辑、可版本控制**的 Markdown 文件作为记忆载体，而不是向量数据库中的浮点数。

## 三个设计问题

在 Pensieve 之前，项目知识管理面临三个反复出现的问题：

1. **重复探索** — 每次都要重新 grep 代码、重新理解模块边界
2. **决策遗忘** — "上次为什么这样设计来着？" 架构决策的上下文丢失
3. **行为不一致** — commit 时该检查什么、refactor 时该遵循什么，每次临场发挥

## 双层架构：系统代码 vs 项目数据

Pensieve 采用**两级锚点**设计，将"引擎"和"数据"物理隔离。

### 系统级（User-Level, Global）

```
~/.claude/skills/pensieve/          ← 全局 git clone，只读引擎
├── SKILL.md                        ← 静态路由声明
├── .src/                           ← 核心引擎
│   ├── core/                       ← Python 核心 (schema, 分类)
│   ├── scripts/                    ← Shell 脚本 (hooks, 维护)
│   ├── templates/                  ← 种子模板
│   ├── references/                 ← 规范文档
│   └── tools/                      ← 七工具规范
└── agents/                         ← Agent 元数据
```

- 一次安装，所有项目共享
- `SKILL.md` 是静态、受版本控制的文件——技能接口声明
- `.src/` 包含所有脚本、模板、规范

### 项目级（Project-Level, Per-Project）

```
<project>/.pensieve/                ← 每个项目独立的知识库
├── maxims/                         ← 工程铁律 (MUST)
├── decisions/                      ← 架构决策 (WANT)
├── knowledge/                      ← 探索缓存 (IS)
├── pipelines/                      ← 可复用工作流 (HOW)
├── short-term/                     ← 短期缓冲区 (STAGING)
├── state.md                        ← 动态生命周期状态
└── .state/                         ← 运行时产物 (gitignored)
    └── pensieve-user-data-graph.md ← 知识图谱 (Mermaid)
```

- 每个项目独立，可提交到 git
- `state.md` 是动态生成的，由维护脚本刷新
- `.state/` 存储运行时产物，被 gitignore

### 关键设计决策

**`SKILL.md` 是静态、受版本控制的文件**——脚本不生成它。这是技能的接口声明。

**`state.md` 是动态、生成的文件**——由 `maintain-project-state.sh` 在每次生命周期事件后刷新。

**`.src/manifest.json` 是定位技能根目录的锚点**。任何包含此文件的目录就是系统技能根。脚本通过它自举，不依赖硬编码路径。

```json
{
  "name": "pensieve",
  "version": "1.3.0",
  "distribution": "shared-skill"
}
```

## 四个设计哲学

### 1. 经验不是参数，是结构

Fine-tuning 改变模型参数，但无法精确传递"这个项目的 API 必须幂等"这类具体知识。Pensieve 选择符号化、可编辑、可版本控制的 Markdown 文件。

### 2. 分层治理，而非一锅煮

不是所有知识都同等重要。一个跨越项目的工程原则和一个特定文件的调用链路，需要不同的管理策略。→ 详见 [四层语义模型](./02-semantic-layers.md)。

### 3. 短期缓冲，长期沉淀

新结论不直接写入长期目录——先进入 `short-term/` 缓冲区，7 天后审查。避免噪声积累。

### 4. 系统代码与用户数据物理隔离

`git pull` 更新引擎永远不会触碰你的项目数据。

## 下一步

→ [四层语义模型](./02-semantic-layers.md)：理解知识如何按"硬度"分类

---
title: "improve-codebase-architecture 技能详解"
date: "2026-05-28"
source: "原创"
url: ""
---

# improve-codebase-architecture 技能详解

`/improve-codebase-architecture` 是一个用于发现和改进代码库架构的技能，主要用于将浅层模块转换为深层模块，以提高代码的可测试性和 AI 可导航性。

---

## 主要用途

### 核心功能

- **发现架构问题**：识别代码库中的架构摩擦点，找出需要重构的机会
- **深化模块**：将浅层模块（接口几乎与实现一样复杂）转换为深层模块（通过简单接口提供大量行为）
- **提高可测试性**：通过创建更好的接口和接缝（seam），使代码更容易测试
- **增强 AI 导航**：使代码库对 AI 代理更友好，更容易理解和导航

### 解决的问题

AI 代理加速编码时也会加速软件熵，导致代码库变得复杂且难以更改。这个技能帮助拯救已经变成"泥球"（ball of mud）的代码库。

---

## 工作流程

### 1. 探索阶段

首先阅读项目的领域词汇表和 ADR（架构决策记录），然后使用 Explore 子代理遍历代码库，寻找摩擦点：

- 理解一个概念需要在多个小模块之间跳转的地方
- 模块浅层化的地方
- 纯函数为了可测试性被提取但真正错误隐藏在调用方式中的地方
- 紧密耦合的模块在其接缝处泄漏的地方

应用"删除测试"：想象删除模块，如果复杂性重新出现在 N 个调用者中，则该模块在发挥作用。

### 2. 生成 HTML 报告

将候选方案作为自包含的 HTML 文件写入操作系统临时目录，每个候选方案包含：

- 涉及的文件/模块
- 问题说明
- 解决方案描述
- 收益（用局部性和杠杆术语解释）
- 前/后可视化图表
- 推荐强度（Strong、Worth exploring、Speculative）

使用 CONTEXT.md 词汇表示领域，使用 LANGUAGE.md 词汇表示架构。

### 3. 质询循环

用户选择候选方案后，进入质询对话。决策 crystallize 时的副作用：

- 如果深化模块的命名不在 CONTEXT.md 中，则添加到 CONTEXT.md
- 如果对话中模糊术语被 sharpening，则更新 CONTEXT.md
- 如果用户因重要原因拒绝候选方案，则提供 ADR

---

## 核心概念

该技能使用一套精确的架构术语：

| 术语 | 定义 |
|------|------|
| **Module（模块）** | 具有接口和实现的任何东西（函数、类、包、切片） |
| **Interface（接口）** | 调用者使用模块必须知道的一切：类型、不变量、错误模式、顺序、配置 |
| **Implementation（实现）** | 模块内部的代码 |
| **Depth（深度）** | 接口处的杠杆作用：小接口背后的大量行为。深层 = 高杠杆 |
| **Shallow（浅层）** | 反模式：模块的接口几乎与实现一样复杂 |
| **Seam（接缝）** | 接口所在的地方；可以在不就地编辑的情况下改变行为的地方 |
| **Adapter（适配器）** | 在接缝处满足接口的具体事物 |
| **Leverage（杠杆）** | 调用者从深度获得的东西 |
| **Locality（局部性）** | 维护者从深度获得的东西：更改、错误和知识集中在一个地方 |

---

## 使用建议

- 建议每隔几天在代码库上运行一次
- 这是一个软依赖技能，即使没有运行 `/setup-matt-pocock-skills` 也能工作，但输出会不够精确
- 在调试技能发现架构问题（没有好的测试接缝、调用者纠缠、隐藏耦合）时，会移交给此技能

---

## Notes

该技能是 mattpocock/skills 仓库中工程技能的一部分，在 `.claude-plugin/plugin.json` 中注册为活跃技能。它依赖于项目特定的领域模型（CONTEXT.md）和架构决策（docs/adr/）来提供上下文感知的建议。

Wiki pages you might want to explore：

- [Overview (mattpocock/skills)](/wiki/mattpocock/skills)
- [Glossary (mattpocock/skills)](/wiki/mattpocock/skills)

---

## 原始 SKILL.md 核心摘录

**文件：** `skills/engineering/improve-codebase-architecture/SKILL.md`

```markdown
---
name: improve-codebase-architecture
description: Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled modules, or make a codebase more testable and AI-navigable.
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.
```

### 核心架构术语

```markdown
- **Module** — anything with an interface and an implementation (function, class, package, slice).
- **Interface** — everything a caller must know to use the module: types, invariants, error modes, ordering, config. Not just the type signature.
- **Implementation** — the code inside.
- **Depth** — leverage at the interface: a lot of behaviour behind a small interface. **Deep** = high leverage. **Shallow** = interface nearly as complex as the implementation.
- **Seam** — where an interface lives; a place behaviour can be altered without editing in place. (Use this, not "boundary.")
- **Adapter** — a concrete thing satisfying an interface at a seam.
- **Leverage** — what callers get from depth.
- **Locality** — what maintainers get from depth: change, bugs, knowledge concentrated in one place.
```

### 删除测试

```markdown
- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
```

### 探索阶段检查点

```markdown
- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?
```

### HTML 报告输出

```markdown
Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it for the user — `xdg-open <path>` on Linux, `open <path>` on macOS, `start <path>` on Windows — and tell them the absolute path.
```

### 报告内容模板

```markdown
- **Files** — which files/modules are involved
- **Problem** — why the current architecture is causing friction
- **Solution** — plain English description of what would change
- **Benefits** — explained in terms of locality and leverage, and how tests would improve
- **Before / After diagram** — side-by-side, custom-drawn, illustrating the shallowness and the deepening
- **Recommendation strength** — one of `Strong`, `Worth exploring`, `Speculative`, rendered as a badge
```

### 质询循环副作用

```markdown
Side effects happen inline as decisions crystallize:

- **Naming a deepened module after a concept not in `CONTEXT.md`?** Add the term to `CONTEXT.md` — same discipline as `/grill-with-docs` (see [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md)). Create the file lazily if it doesn't exist.
- **Sharpening a fuzzy term during the conversation?** Update `CONTEXT.md` right there.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones. See [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md).
```

---

## 相关链接

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- [Matt Pocock Skills 安装与使用指南](./12-mattpocock-skills-install-guide.md)
- [75K Star 的 Skills 仓库到底凭什么](./mattpocock-skills-analysis.md)

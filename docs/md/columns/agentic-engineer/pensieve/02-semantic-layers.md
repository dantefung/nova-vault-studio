---
title: "Pensieve #2：四层语义模型"
description: "双层架构、系统代码与项目数据物理隔离、manifest 锚点机制"
series: "pensieve"
part: 2
created: 2026-06-03
---

# Pensieve #2：四层语义模型

> 📖 [完整可视化版本](/pensieve-deep-dive.html#semantic-layers) | [系列索引](./index.md)

## 为什么需要分层

如果所有知识都扔进一个目录，Agent 无法区分"这是必须遵守的铁律"和"这是上次探索的缓存"。四层模型让 Agent 在读取知识时天然获得**优先级信号**。

## 四层定义

| 层 | 语义 | 目录 | 准入标准 | 例子 |
|---|---|---|---|---|
| **MUST** | Maxim（铁律） | `maxims/` | 跨项目、跨语言仍成立；违反则回归风险剧增；可一句话说完 | "消除特殊情况优于增加条件判断" |
| **WANT** | Decision（决策） | `decisions/` | 去掉后未来更易犯错；三个月后能帮后人少走弯路 | "选择浮窗工作台而非内联 tab" |
| **IS** | Knowledge（事实） | `knowledge/` | 可验证、可追溯；不写会反复拖慢执行 | "diagnosis provider 的 CLI 边界" |
| **HOW** | Pipeline（工作流） | `pipelines/` | 同类型任务已复现 3 次以上；步骤不可互换；每步可验证 | "run-when-committing.md" |

## 各层详解

### MUST — Maxim（铁律）

跨项目、跨语言、长期有效的硬规则。

**准入条件（必须全部满足）**：
1. 切换项目后仍然成立
2. 切换语言后仍然成立
3. 违反它会显著增加回归风险
4. 可以一句话说完

**格式**：
```markdown
# {一行结论}

## One-line Conclusion
> {一句可执行的规则}

## Guidance
- 规则 1
- 规则 2

## Boundaries
- 不适用的情况
```

**关键约束**：maxim 应该保持稀缺——不要把一次性偏好塞进来。如果只在当前项目有效，它不是 maxim，是 decision。

### WANT — Decision（架构决策）

项目中主动做出的选择，以及为什么做出这些选择。

**写入时机**：
1. 去掉它会让未来更容易犯错
2. 三个月后读到它能避免很多弯路
3. 它澄清了模块边界、职责或权衡

**必须包含**：
- `Context` 和 `Alternatives Considered`
- "下次少问什么 / 少查什么 / 失效条件"（探索减少三件套）

**格式**：
```markdown
# {决策标题}

## One-line Conclusion
> {最终选择}

## Context
## Problem
## Alternatives Considered
- 方案 A：为什么不用
- 方案 B：为什么不用

## Decision
## Consequence
## Exploration Reduction
- 下次少问什么：
- 下次少查什么：
- 失效条件：
```

### IS — Knowledge（事实缓存）

系统事实、外部引用、可验证行为。纯粹的"是什么"，不包含观点。

**写入时机**（如果不写会反复拖慢执行）：
- 每次都要重新搜文档
- 每次都要从代码猜边界
- 模型训练数据已过时
- 流程依赖分散的外部标准

**探索型知识建议包含**：
- 状态转换
- 症状 → 根因 → 定位
- 边界和归属
- 反模式
- 验证信号

**关键约束**：不要把 knowledge 变成观点集合。它必须可验证或可追溯。如果是"我们决定怎么做"，写 decisions/。

### HOW — Pipeline（可复用工作流）

一个 pipeline 只负责一件事：清晰定义任务序列、验证循环和失败兜底。

**三个创建条件（必须同时满足）**：
1. 同类型任务已复现 3 次以上
2. 步骤顺序不可互换
3. 每个步骤有可验证的完成标准

如果问题主要是"知识分散"或"边界不清"，先写 knowledge/decision——不要过度创建 pipeline。

→ 详见 [工具链与 Pipeline](./04-tools-and-pipelines.md)。

## short-term/ — 短期缓冲机制

新结论不直接写入长期目录。先进入 `short-term/`，结构与长期目录镜像：

```
<project>/.pensieve/short-term/
├── maxims/
├── decisions/
├── knowledge/
└── pipelines/
```

### 生命周期

1. **self-improve 捕获** — Agent 从会话 + diff 中提取 insight，写入 `short-term/{type}/`
2. **7 天 TTL 计时** — 基于 `created` 日期 + 7 天（schema.json `short_term.default_ttl_days`）
3. **过期提醒** — 通过 session hook / doctor / commit pipeline 触发
4. **refine 审查** — 五问决策法决定：提升、合并、或删除
5. **提升或删除** — `mv short-term/{type}/file.md {type}/file.md`

### 链接零成本提升

`[[...]]` 链接**不含 `short-term/` 前缀**：

```markdown
- Based on: [[decisions/2026-03-16-foo]]     ✅
- Based on: [[short-term/decisions/2026-03-16-foo]]  ❌
```

图谱解析器在处理 short-term 文件时自动剥离前缀，与长期文件共享节点 ID。`mv` 提升时所有引用**零更新**。

### TTL 规则

- 基于 `created` 日期 + 7 天
- 仅用于提醒，文件永远不会被自动移动或删除
- frontmatter tags 包含 `seed` 的文件跳过 TTL 检查

## 什么时候跳过 short-term

- 修改已存在于长期目录的文件：原地编辑
- 用户明确要求直接写入长期目录

## 层间关系

```
MUST (maxim)
  ↑ 基于
WANT (decision) ←→ IS (knowledge)
  ↓ 导向
HOW (pipeline)
```

- `Based on` 只能指向 `knowledge/decision`
- `Leads to` 只能指向 `pipeline/decision`
- `Related` 适合指向并行的 `maxim` 条目

## 下一步

→ [双系统检索与 pensieve-wand](./03-dual-system.md)：Agent 如何高效检索这些分层知识

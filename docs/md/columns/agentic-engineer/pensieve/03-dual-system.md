---
title: "Pensieve #3：双系统检索与 pensieve-wand"
description: 快思考/慢思考双系统决策、认知预算约束、知识升级路径
series: pensieve
part: 3
created: 2026-06-03
---

# Pensieve #3：双系统检索与 pensieve-wand

> 📖 [完整可视化版本](/pensieve-deep-dive.html#dual-system) | [系列索引](./index.md)

## 核心思想

Pensieve 的知识检索 Agent（`pensieve-wand`）受 Daniel Kahneman《思考，快与慢》启发，实现**双系统决策**：

- **System 1（快思考）**：零成本直觉匹配，从 MEMORY.md 路由表直接命中
- **System 2（慢思考）**：有预算约束的深度探索，遍历知识图谱

**快速的 80% 回答优于缓慢的 100% 回答。** 大多数高频问题应该在 System 1 就解决。

## System 1：直觉匹配（零工具调用）

MEMORY.md 在每次会话启动时自动加载到上下文中。它包含关键词索引和内联路由。

**触发条件**：查询关键词命中 MEMORY.md 中的路由条目

**执行方式**：直接从 MEMORY.md 信息输出简报，不调用任何工具。需要额外细节时，最多读 1 个 pensieve 文件。

**MEMORY.md 内联格式**：
```markdown
| 关键词 | 条目 | 一句话 |
|--------|------|--------|
| cursor | `knowledge/cursor-management` | brush 模块管理 |
```

**写入条件**：
- pensieve 命中率高
- 答案确定且稳定
- 类似问题会反复出现

这是默认路径。大多数高频问题应该在这里解决。

## System 2：预算探索（有约束的深度搜索）

**触发条件**：System 1 未命中，或条目标记为 `[slow]`

### 认知预算

| 资源 | 预算 | 超出时 |
|------|------|--------|
| 图节点读取 | ≤ 5 个条目文件 | 停止展开，用已有信息输出 |
| Grep 回退搜索 | ≤ 2 次 | 报告"知识缺口"，不再继续 |
| 总工具调用 | ≤ 10 次 | 强制输出，标注未覆盖区域 |

### 探索终止条件（满足任一即停）

- 问题有确定答案
- 预算耗尽
- 连续 2 次搜索无新信息（收益递减）

### 图谱导航流程

1. 读 `.pensieve/.state/pensieve-user-data-graph.md`，匹配节点标签中的关键词
2. 找到目标节点后，收集所有入边和出边，定位关联条目
3. 读取匹配条目的实际文件内容
4. 图谱未命中时，回退到 `.pensieve/` 目录的 Grep 搜索

## 知识升级路径

每次调查结束后，评估查询是否值得写入记忆。这不是可选的——是工作流的一部分。

```
新查询
  │
  ├─→ MEMORY.md 关键词命中 ─→ System 1：零工具调用直接回答
  │     └─ 需要细节？最多读 1 个路由文件或 pensieve 条目
  │
  ├─→ MEMORY.md [slow] 命中 ─→ System 2：从已知线索出发，预算约束
  │
  └─→ 全 miss ─→ System 2：完整图谱探索，预算约束
       │
  调查结束
  ├─→ 答案确定 ─→ 写入 MEMORY.md 内联条目（升级为 System 1）
  ├─→ 线索不完整 ─→ 写 slow_{topic}.md + 标记 [slow]
  └─→ 一次性查询 ─→ 不写入
```

### 慢思考路由文件

标记为 `[slow]` 的条目。当匹配时，从已知线索出发，在预算约束下启动图谱探索。

```markdown
---
name: slow_{topic}
description: {当前知识状态的一句话}
type: slow
---

**已知线索**: [信息片段和来源路径]
**知识缺口**: [明确缺失的内容]
**探索方向**: [从哪里开始]
**升级条件**: [什么时候可以升级为快思考内联条目]
```

## 什么不应该保存

- pensieve 条目的完整内容副本（记忆是索引，不是副本）
- 临时任务细节、当前会话上下文
- CLAUDE.md 或 git history 中已有的信息

## pensieve-wand Agent 配置

```yaml
---
name: pensieve-wand
model: sonnet
color: cyan
memory: project
---
```

- 使用 Sonnet 模型（速度与质量平衡）
- `memory: project` 启用项目级持久记忆
- 作为 Claude Code 的自定义 Agent 注册

### 输出格式

**Known Information** — 相关的缓存知识、文件路径、模块边界
**Known Pitfalls** — 过去的错误、边界情况、失败模式
**Recommended Path** — 基于积累经验的最优路径
**To Explore** — 缓存中需要代码探索填补的缺口

## 与 Claude Code auto-memory 的协作

Pensieve 的 MEMORY.md 写入与 Claude Code 的 auto-memory 系统集成：

- `maintain-auto-memory.sh` 在生命周期事件后同步
- MEMORY.md 中的 Pensieve 路由条目自动包含引导行：
  ```
  - Guidance: When a request involves knowledge retention, structural checks,
    version migration, or complex task decomposition, prefer invoking the `pensieve` skill.
  ```

## 下一步

→ [工具链与 Pipeline](./04-tools-and-pipelines.md)：七大工具的职责边界和 Pipeline 工作流引擎

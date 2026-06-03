---
title: "Pensieve #5：知识图谱与生命周期"
description: "双层架构、系统代码与项目数据物理隔离、manifest 锚点机制"
series: "pensieve"
part: 5
created: 2026-06-03
---

# Pensieve #5：知识图谱与生命周期

> 📖 [完整可视化版本](/pensieve-deep-dive.html#knowledge-graph) | [系列索引](./index.md)

## 知识图谱

Pensieve 的知识不是孤立的文件——它们通过 `[[...]]` 链接形成**有向图**。

### 链接规则

| 链接类型 | 指向 | 例子 |
|---------|------|------|
| `Based on:` | 前置知识或决策 | `[[knowledge/auth-flow/content]]` |
| `Leads to:` | 后续流程或决策 | `[[decisions/2026-03-16-api-design]]` |
| `Related:` | 并行主题 | `[[maxims/reduce-complexity]]` |

### 链接约束

- 每个 `decision/pipeline` 必须至少一个 `[[...]]` 链接
- `[[...]]` 链接**不含 `short-term/` 前缀**——始终使用目标层路径
- `Based on` 只能指向 `knowledge/decision`
- `Leads to` 只能指向 `pipeline/decision`
- `Related` 适合指向并行的 `maxim` 条目

### 图谱生成

`generate-user-data-graph.sh` 扫描所有 `[[...]]` 链接，生成 **Mermaid 格式**的知识图谱：

- 输出到 `.pensieve/.state/pensieve-user-data-graph.md`
- 按目录分组（subgraph）
- 每个节点 ID（如 `n80`）对应一个条目
- 边（如 `n80 --> n82`）表示关联关系

### short-term 链接的巧妙设计

图谱解析器在处理 short-term 文件时自动剥离前缀，与长期文件共享节点 ID。这意味着 `mv` 提升条目时，所有引用它的链接**零更新**。

```
short-term/decisions/2026-03-16-foo.md
  中的链接: [[decisions/2026-03-15-bar]]
  ↓ mv 提升后
decisions/2026-03-16-foo.md
  链接不变: [[decisions/2026-03-15-bar]]  ← 零更新
```

## 生命周期状态机

Pensieve 用一个明确的四状态机管理项目数据的生命周期：

```
  ┌──────────┐     init      ┌──────────┐    doctor PASS    ┌──────────┐
  │  EMPTY   │ ──────────→   │  SEEDED  │ ──────────────→   │ ALIGNED  │
  │          │               │          │                   │          │
  │ 缺根目录 │               │ 缺关键文件│                   │ 健康状态  │
  └──────────┘               └──────────┘                   └────┬─────┘
                                                                 │
                                                          doctor FAIL
                                                                 │
                                                            ┌────▼─────┐
                                                            │ DRIFTED  │
                                                            │          │
                                                            │ 结构漂移  │
                                                            └──────────┘
                                                                 │
                                                              migrate
                                                                 │
                                                            ┌────▼─────┐
                                                            │ ALIGNED  │
                                                            └──────────┘
```

### 状态判定逻辑

`pensieve_core.py` 的 `classify_state()` 函数：

```python
def classify_state(*, has_missing_root, has_missing_directories,
                   has_missing_critical_files, must_fix_count):
    if has_missing_root or has_missing_directories:
        return "EMPTY"       # 缺根目录或子目录
    if has_missing_critical_files:
        return "SEEDED"      # 目录在但缺关键文件
    if must_fix_count == 0:
        return "ALIGNED"     # 健康状态
    return "DRIFTED"         # 有结构漂移
```

| 状态 | 含义 | 触发条件 | 修复方式 |
|------|------|---------|---------|
| **EMPTY** | 空项目 | 缺根目录或子目录 | `init` |
| **SEEDED** | 已播种 | 目录在但缺关键文件 | `init` 补全 |
| **ALIGNED** | 健康 | doctor PASS | 无需操作 |
| **DRIFTED** | 漂移 | 有 MUST_FIX 项 | `migrate` |

### state.md — 动态状态文件

`state.md` 由 `maintain-project-state.sh` 在每次生命周期事件后刷新。包含：

- **Lifecycle State** — 最后事件、最后备注
- **Project Paths** — 项目根、用户数据、运行时状态路径
- **Short-Term** — 总数、待 refine 数量
- **Graph** — 指向运行时图谱的引用

### schema.json — 结构定义

```json
{
  "schema_version": 2,
  "required_dirs": ["maxims", "decisions", "knowledge", "pipelines"],
  "optional_dirs": ["short-term"],
  "short_term": { "default_ttl_days": 7 },
  "critical_files": [
    { "target": "pipelines/run-when-reviewing-code.md", "compare_mode": "pipeline_context_links_ignored" },
    { "target": "pipelines/run-when-committing.md", "compare_mode": "pipeline_context_links_ignored" },
    { "target": "pipelines/run-when-refactoring.md", "compare_mode": "pipeline_context_links_ignored" },
    { "target": "knowledge/taste-review/content.md", "compare_mode": "exact" }
  ]
}
```

关键设计：pipeline 文件的比较模式是 `pipeline_context_links_ignored`——上下文链接值的差异不触发漂移检测。

## Hook 机制

Pensieve 通过 Claude Code 的 Hook 系统注入自动化行为：

| Hook 时机 | 脚本 | 作用 |
|-----------|------|------|
| `SessionStart` | `pensieve-session-marker.sh` | 会话启动时标记，检查 short-term 过期提醒 |
| `PreToolUse` (Explore/Plan) | `explore-prehook.sh` | 探索前注入 SKILL.md + state.md 提示 |
| `PostToolUse` (Write/Edit) | `sync-project-skill-graph.sh` | 文件修改后自动同步知识图谱 |

Hook 配置写入 `~/.claude/settings.json`，全局生效。没有 `.pensieve/` 的项目静默退出。

## 项目数据的版本控制

| 层 | 提交到 git？ | 说明 |
|---|---|---|
| `maxims/` | ✅ | 工程原则，团队共享 |
| `decisions/` | ✅ | 架构决策记录 |
| `knowledge/` | ✅ | 探索结果缓存 |
| `pipelines/` | ✅ | 可复用工作流 |
| `state.md` | ✅ | 生命周期状态 |
| `.state/` | ❌ | 运行时缓存，gitignore |

## 下一步

→ [实践指南与对比](./06-practice.md)：安装配置、日常使用、与 RAG/Vector DB 的对比

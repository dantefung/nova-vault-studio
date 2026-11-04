---
title: "渐进式披露（Progressive Disclosure）"
date: "2026-05-09"
---

# 渐进式披露（Progressive Disclosure）

> 上下文工程的核心架构模式，从外到内逐渐细化的信息层级结构。

## Key Points

- AGENTS.md 是地图，不是百科全书
- 按需加载，非全量注入
- 上下文窗口是 RAM，不是硬盘
- 层级结构：索引 → 详细文档 → 参考资料
- **Agent Skills 把它落地为可执行的三级加载机制**（前言 → 全文 → 引用）

## Details

### 层级结构

```
AGENTS.md（≤100 行，目录索引）
├── docs/architecture/      ← 架构决策与系统设计
├── docs/api/               ← API 合约与接口规范
├── docs/decisions/         ← 架构决策记录（ADR）
├── docs/patterns/          ← 代码模式与最佳实践
└── docs/glossary.md        ← 项目专用术语表
```

### 设计原则

- 每一层只包含当前层级需要的信息
- 通过链接指向更详细的文档
- 避免信息过载，保持高信噪比

### 在 Agent Skills 中的三级加载实现

「从零构建 Agent」系列第 6 篇给出了一个可直接落地的形态：把渐进式披露拆成**前言（Frontmatter）→ 全文（Body）→ 引用（Reference）**三级，由 Agent 在运行时按需推进。

| 级别 | 加载内容 | 触发时机 | 量级 |
|---|---|---|---|
| **一级 · 发现** | 所有 Skill 的 `name` + `description` | 会话启动时 | 几十到几百 Token |
| **二级 · 理解** | 某个 Skill 的完整 `skill.md` | 模型判断需要该技能时 | 可能几千 Token |
| **三级 · 资源** | `scripts/`、`references/`、`assets/` 下的具体文件 | 执行过程中按需 | 视资源而定 |

一级产出的目录被放进 Responses API 的 `instructions` 字段作为全局指令，模型因此具备「技能意识」——知道有哪些能力可用，但不知道具体怎么做。二级由 `load_skill` 工具按需触发。三级由 `skill.md` 中的相对路径引用驱动。

关键收益量化：**10 个技能的目录约 200 Token，而 10 个技能的完整指令可达 10000 Token**——两级分离就是把这 9800 Token 的差额从常驻上下文里省掉。

规范要求的目录结构：

```text
my-skill/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, resources
└── ...               # Any additional files or directories
```

Skill 的加载优先级由**加载顺序**决定（后加载的优先级更高）：全局目录 → 项目目录。

## Related Pages

- [[patterns/context-engineering]] — 上下文工程的完整方法论
- [[concepts/harness-engineering]] — 渐进式披露在 Harness 工程中的定位
- [[concepts/responses-api-agent-loop]] — Agent Skills 依赖的模型交互接口标准
- [[sources/zeroagent-06-skills]] — 本文三级加载实现的原始归档

## Sources

- docs/md/columns/harness-engineering/concepts/01-context-engineering.md
- 《从零构建 Agent（六）：Skills 与渐进式披露》，公众号「从码农到工匠」，2026-10-15：3.3 节渐进式披露三级加载机制与目录结构规范

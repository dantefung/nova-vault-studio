---
title: "agent-router-table"
date: "2026-10-14"
source: "wiki-ingest"
---

# 路由表模式（Agent Router Table）

> 不写规则，只告诉 agent 干什么活之前翻哪份文档——通过路由表让 agent 自行查表获取上下文，而非把所有规则硬编码进 CLAUDE.md。

## 核心思想

magpie 的 CLAUDE.md 只引用了两个文件：AGENTS.md（路由表）和 LESSONS.md（错题本）。AGENTS.md 不写具体规则，只告诉 agent 不同任务该查哪份文档：

- 改子系统 → 先看 `docs/subsystems/`
- 写代码、审代码 → 照 `docs/code-standards.md`
- 审社区 PR → 看 `docs/contributors.md`

## 优势

1. **CLAUDE.md 保持精简**：只放路由，不放规则本身，降低上下文占用
2. **规则可独立演进**：code-standards.md 可以独立更新，不需要改 CLAUDE.md
3. **agent 自主性**：agent 自己决定查哪份文档，而不是被一堆硬编码规则限制

## 与 LESSONS.md 的配合

路由表告诉 agent "去哪找答案"，错题本告诉 agent "别犯同样的错"。两者结合形成完整的 agent 行为引导体系。

## Related Pages

- [[patterns/error-notebook-pattern]]
- [[concepts/agent-loop]]

## Sources

- WquGuru《magpie项目全AI自动化构建深度分析》：x.com/wquguru/status/2109650264601117141

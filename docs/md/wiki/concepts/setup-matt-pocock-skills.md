---
title: "setup-matt-pocock-skills"
date: "2026-08-06"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/Xyf370f3UX2AOaZkogYMSA"
---

# setup-matt-pocock-skills

> Matt Pocock Skills 体系中的前置配置 skill，通过 prompt-driven 对话将「工单在哪、标签叫什么、文档放哪」三个配置决策一次性落地，是其他所有 engineering skill 的 precondition。

## Key Points

- 不是脚手架（确定性模板），而是 prompt-driven 对话——先 explore 仓库状态再逐个确认
- 三个配置 section：Issue Tracker（四选一）、Triage Labels（仅 triage 已装时运行）、Domain Docs（默认 single-context）
- 产物三件套：`docs/agents/issue-tracker.md`、`docs/agents/domain.md`、可选 `docs/agents/triage-labels.md`
- 配置索引写入 `CLAUDE.md`（优先）或 `AGENTS.md` 的 `## Agent skills` 块
- 每个仓库只需跑一次，重跑仅在换 issue tracker 或配置混乱时

## Details

### 执行流程

1. **Explore 阶段**：探测 `git remote`、`AGENTS.md`/`CLAUDE.md` 是否存在、`.scratch/` 目录、monorepo 信号等
2. **Section A — Issue Tracker**：默认 GitHub（gh CLI），分支 GitLab（glab）/ 本地 markdown / 其它（Jira、Linear 等）
3. **Section B — Triage Labels**：仅 triage skill 已装时运行，默认 5 标签（needs-triage → needs-info → ready-for-agent → ready-for-human → wontfix）
4. **Section C — Domain Docs**：默认 single-context（`CONTEXT.md` + `docs/adr/`），仅 monorepo 信号时 offer multi-context
5. **写入 Agent Skills 块**：在 `CLAUDE.md` 或 `AGENTS.md` 追加索引

### 验收清单

- 三件 docs 都在：`docs/agents/issue-tracker.md`、`docs/agents/domain.md` 存在
- Agent skills 块指向上述文件
- 标签语义一致（如有）
- 域文档布局确定

### 常见反例

- 不 explore 直接套模板 → 配置与仓库事实脱节
- triage 没装硬写 labels 配置 → 没人读，将来还打架
- 单仓库硬上 multi-context → 维护成本翻倍
- 两个文件并存（`CLAUDE.md` + `AGENTS.md`）→ 约定分裂

## Context

来源于「setup-matt-pocock-skills 不是脚本，是一次对话」（运维有术，2026-08-06），Matt Pocock Skills 系列解析。

## Related Pages

- [[matt-pocock-wayfinder-handoff]]
- [[matt-pocock-on-ramp]]
- [[claude-skills]]
- [[agent-configuration]]

## Sources

- setup-matt-pocock-skills 不是脚本，是一次对话 — 运维有术，微信公众号，2026-08-06
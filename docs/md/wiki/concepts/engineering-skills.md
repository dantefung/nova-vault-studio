---
title: "Engineering Skills 体系"
date: "2026-08-06"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/Xyf370f3UX2AOaZkogYMSA"
---

# Engineering Skills 体系

> Matt Pocock 设计的工程化 AI 编程 skill 体系，包含 setup、triage、to-tickets、grill-with-docs、domain-modeling 等 skill，通过「读配置执行」而非「自带配置」的方式，实现可复用的工程流程。

## Key Points

- 所有 skill 都是「读配置执行」的，依赖 `docs/agents/*.md` 中的配置约定
- `setup-matt-pocock-skills` 是所有 engineering flow 的 precondition
- 设计哲学：user-invoked 而非 model-invoked，skill 存在本身几乎不占上下文
- 核心配置三件套：issue tracker 位置、triage 标签语义、domain docs 布局

## Details

### Skill 体系关系

| Skill | 职责 | 依赖 |
|-------|------|------|
| setup-matt-pocock-skills | 前置配置，一次落地 | 无 |
| triage | Issue 分类和路由 | triage-labels.md |
| to-tickets | 将计划拆为可追踪的 issue | issue-tracker.md |
| grill-with-docs | 通过对话明确术语和决策 | domain.md |
| domain-modeling | 维护领域模型和术语表 | domain.md |
| ask-matt | 路由到合适的 skill 或流程 | 无 |

### 配置路径

所有配置集中存放在 `docs/agents/` 目录下，通过 `CLAUDE.md` 或 `AGENTS.md` 的 `## Agent skills` 块索引。这样 agent 第一次进仓库就知道去哪找答案。

### 多仓库场景

社区批评：没有全局继承机制，多仓库场景下重复劳动。每个仓库都要重新跑一遍 setup 确认同一个事实（如所有仓库都用 GitHub Issues）。

## Context

来源于「setup-matt-pocock-skills 不是脚本，是一次对话」（运维有术，2026-08-06），以及 Matt Pocock Skills 源码。

## Related Pages

- [[setup-matt-pocock-skills]]
- [[matt-pocock-wayfinder-handoff]]
- [[matt-pocock-on-ramp]]
- [[agent-configuration]]

## Sources

- setup-matt-pocock-skills 不是脚本，是一次对话 — 运维有术，微信公众号，2026-08-06
- Matt Pocock Skills 源码 (github.com/mattpocock/skills)
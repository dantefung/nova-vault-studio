---
title: "settings-integrations"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# settings-integrations

> Interactive configuration of third-party integrations for GSD — search API keys
(Brave / Firecrawl / Exa), code-review CLI routing (`review.models.<cli>`), and
agent-skill injection (`agent_skills.<ag

<!-- more -->

## 定位

Interactive configuration of third-party integrations for GSD — search API keys
(Brave / Firecrawl / Exa), code-review CLI routing (`review.models.<cli>`), and
agent-skill injection (`agent_skills.<agent-type>`). Writes to
`.planning/config.json` via `gsd-sdk`/`gsd-tools` so unrelated keys are
preserved, never clobbered.

This command is deliberately separate from `/gsd:settings` (workflow toggles)
and any `/gsd-settings-advanced` tuning surface. It exists because API keys and
cross-tool routing are *connectivity* concerns, not workflow or tuning knobs.

## 核心流程/章节

- ensure_and_load_config
- read_current
- section_1_search_integrations
- section_2_review_models
- section_3_agent_skills
- confirm

## 原文要点

Ensure config exists and resolve the active config path (flat vs workstream, #2282): ```bash gsd-sdk query config-ensure-section if [[ -z "${GSD_CONFIG_PATH:-}" ]]; then if [[ -f .planning/active-workstream ]]; then WS=$(tr -d '\n\r' Read the current config and compute a masked view for display. For each integration field, compute one of: - `(unset)` — field is null / missing - `****` — secret fie

## 适用场景

- 基于 description 推断：Interactive configuration of third-party integrations for GSD — search API keys
(Brave / Firecrawl / Exa), code-review CLI routing (`review.models.<cl

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)

---
title: 可用 Skills 索引（304 个）
date: 2026-08-02
source: 内部维护
url: ""
---

# 可用 Skills 索引（304 个）

> 扫描路径：`~/.claude/skills`
> 生成时间：2026-08-02
> 说明：每条 skill 列出 **name** + 简要 description。无法可靠识别具体作者（SKILL.md frontmatter 无 author 字段），按 **vendor / 系列** 归类。

## 分类概览

| Vendor / 系列 | 数量 |
|---|---:|
| 其他 | 98 |
| gstack GSD | 66 |
| vast 系列 | 51 |
| 宝玉 (baoyu) | 21 |
| gstack 基础 | 8 |
| huashu-design / 设计类 | 6 |
| gstack 计划类 | 5 |
| Claude Code | 5 |
| 调试/调查 | 4 |
| 上下文/文档 | 4 |
| 内容编辑 | 3 |
| Auto review | 3 |
| Claude 工具 | 3 |
| Review 类 | 3 |
| gstack 流程 | 3 |
| 学习/规范 | 2 |
| Codex CLI | 2 |
| 健康检查 | 2 |
| huashu (花书) | 2 |
| QA | 2 |
| Agnes AI | 1 |
| Matt 路由器 | 1 |
| 仓颉 (cangjie) | 1 |
| cangjie/canary | 1 |
| frontend-design 内置 | 1 |
| guizang (桂藏) | 1 |
| office-hours | 1 |
| 回顾/办公 | 1 |
| Skill 工具 | 1 |
| Spec / 计划 | 1 |
| 配置/同步 | 1 |

## 完整列表（按 skill 名称排序）

| Skill | Vendor / 系列 | Description |
|---|---|---|
| `_gstack-command` | 其他 | Router for the gstack skill suite. (gstack) |
| `agent-reach` | 其他 | > |
| `agnes-image-gen` | Agnes AI | "Agnes AI 图像生成。基于 agnes-image-2.1-flash 模型，支持文生图、图生图、多图合成。当用户想生成图片、画图、做图、AI 绘图、文生图、图生图、风格转换、图片编辑、生成海报/封面/配图/插画/产品图/壁纸/头像 |
| `article-batch-illustration` | 内容编辑 | 分析文章结构并批量生成AI配图，调用Gemini API为每个段落创建专业逻辑图/概念图。当用户说"批量配图"、"给文章配图"、"生成文章插图"、"为这篇文章配图"时触发。支持两种风格：简约手绘风和建筑蓝图编辑风。自动保存到Obsidian |
| `article-review` | 内容编辑 | 根据原文内容撰写深度文章评价/解读。当用户提供一篇文章、博客、公众号文章或任何长文内容，并要求生成评价、解读、读后感或二次创作内容时使用此技能。适用于：(1) 对技术文章、行业分析、年终总结等进行深度解读，(2) 提炼文章核心观点并用通俗语 |
| `ask-matt` | Matt 路由器 | Ask which skill or flow fits your situation. A router over the skills in this repo. |
| `autoplan` | Auto review | Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with a |
| `baoyu-article-illustrator` | 宝玉 (baoyu) | Analyzes article structure, identifies positions requiring visual aids, generates illustrations with Type × Style × Pale |
| `baoyu-comic` | 宝玉 (baoyu) | Knowledge comic creator supporting multiple art styles and tones. Creates original educational comics with detailed pane |
| `baoyu-compress-image` | 宝玉 (baoyu) | Compresses images to WebP (default) or PNG with automatic tool selection. Use when user asks to "compress image", "optim |
| `baoyu-cover-image` | 宝玉 (baoyu) | Generates article cover images with 5 dimensions (type, palette, rendering, text, mood) combining 11 color palettes and  |
| `baoyu-danger-gemini-web` | 宝玉 (baoyu) | Generates images and text via reverse-engineered Gemini Web API. Supports text generation, image generation from prompts |
| `baoyu-danger-x-to-markdown` | 宝玉 (baoyu) | Converts X (Twitter) tweets and articles to markdown with YAML front matter. Uses reverse-engineered API requiring user  |
| `baoyu-format-markdown` | 宝玉 (baoyu) | Formats plain text or markdown files with frontmatter, titles, summaries, headings, bold, lists, and code blocks. Use wh |
| `baoyu-image-cards` | 宝玉 (baoyu) | Generates infographic image card series with 12 visual styles, 8 layouts, and 3 color palettes. Breaks content into 1-10 |
| `baoyu-image-gen` | 宝玉 (baoyu) | AI image generation with OpenAI, Azure OpenAI, Google, OpenRouter, DashScope, MiniMax, Jimeng, Seedream and Replicate AP |
| `baoyu-imagine` | 宝玉 (baoyu) | AI image generation with OpenAI, Azure OpenAI, Google, OpenRouter, DashScope, MiniMax, Jimeng, Seedream and Replicate AP |
| `baoyu-infographic` | 宝玉 (baoyu) | Generates professional infographics with 21 layout types and 21 visual styles. Analyzes content, recommends layout×style |
| `baoyu-markdown-to-html` | 宝玉 (baoyu) | Converts Markdown to styled HTML with WeChat-compatible themes. Supports code highlighting, math, PlantUML, footnotes, a |
| `baoyu-post-to-wechat` | 宝玉 (baoyu) | Posts content to WeChat Official Account (微信公众号) via API or Chrome CDP. Supports article posting (文章) with HTML, markdow |
| `baoyu-post-to-weibo` | 宝玉 (baoyu) | Posts content to Weibo (微博). Supports regular posts with text, images, and videos, and headline articles (头条文章) with Mar |
| `baoyu-post-to-x` | 宝玉 (baoyu) | Posts content and articles to X (Twitter). Supports regular posts with images/videos and X Articles (long-form Markdown) |
| `baoyu-slide-deck` | 宝玉 (baoyu) | Generates professional slide deck images from content. Creates outlines with style instructions, then generates individu |
| `baoyu-translate` | 宝玉 (baoyu) | Translates articles and documents between languages with three modes - quick (direct), normal (analyze then translate),  |
| `baoyu-url-to-markdown` | 宝玉 (baoyu) | Fetch any URL and convert to markdown using baoyu-fetch CLI (Chrome CDP with site-specific adapters). Built-in adapters  |
| `baoyu-xhs-images` | 宝玉 (baoyu) | "DEPRECATED: Migrated to baoyu-image-cards. Generates Xiaohongshu (Little Red Book) infographic series with 11 visual st |
| `baoyu-youtube-transcript` | 宝玉 (baoyu) | Downloads YouTube video transcripts/subtitles and cover images by URL or video ID. Supports multiple languages, translat |
| `batch-grill-me` | Auto review | A relentless interview that asks every frontier question at once, round by round. |
| `benchmark` | gstack 基础 | Performance regression detection using the browse daemon. (gstack) |
| `benchmark-models` | gstack 基础 | Cross-model benchmark for gstack skills. (gstack) |
| `browse` | gstack 基础 | Fast headless browser for QA testing and site dogfooding. (gstack) |
| `canary` | gstack 基础 | Post-deploy canary monitoring. (gstack) |
| `cangjie-skill` | 仓颉 (cangjie) | Distill a book into a coherent set of executable skills. Use when the user asks to "拆书" / "蒸馏一本书" / "把 XX 书做成 skill" / " |
| `careful` | 调试/调查 | Safety guardrails for destructive commands. (gstack) |
| `caveman` | 其他 | > |
| `chinese-copywriting-guidelines` | 学习/规范 | "中文文案排版规范检查与修复。统一中文、英文、数字、标点符号的排版用法,降低沟通成本。Actions: 检查、修复、审查、校对、格式化中文排版、文案排版、排版规范、排版问题。当用户说'检查排版'、'修复排版'、'中文排版'、'文案排版'、' |
| `claude-handoff` | Claude 工具 | Hand the current conversation off to a fresh background agent that picks up the work immediately. |
| `claude-to-im` | Claude 工具 | \| |
| `code-review` | Review 类 | Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes — Standards (does the code fo |
| `codebase-design` | 其他 | Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find de |
| `codex` | Codex CLI | OpenAI Codex CLI wrapper — three modes. (gstack) |
| `codex-image` | Codex CLI | "AI image generation via Codex CLI (ChatGPT Plus). Requires Codex.app (or codex.exe) installed and logged into a ChatGPT |
| `connect-chrome` | Claude 工具 | Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in. |
| `context-restore` | 上下文/文档 | Restore working context saved earlier by /context-save. (gstack) |
| `context-save` | 上下文/文档 | Save working context. (gstack) |
| `cso` | cangjie/canary | Chief Security Officer mode. (gstack) |
| `design-an-interface` | huashu-design / 设计类 | Generate multiple radically different interface designs for a module using parallel sub-agents. Use when user wants to d |
| `design-consultation` | huashu-design / 设计类 | "Design consultation: understands your product, researches the landscape, proposes a complete design system (aesthetic,  |
| `design-html` | huashu-design / 设计类 | "Design finalization: generates production-quality Pretext-native HTML/CSS. (gstack)" |
| `design-review` | huashu-design / 设计类 | "Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interacti |
| `design-shotgun` | huashu-design / 设计类 | "Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate |
| `devex-review` | Review 类 | Live developer experience audit. (gstack) |
| `diagnose` | 调试/调查 | Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument →  |
| `diagnosing-bugs` | 调试/调查 | Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports som |
| `diagram` | 其他 | "Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you ca |
| `doc-coauthoring` | 上下文/文档 | Guide users through a structured workflow for co-authoring documentation, articles, or long-form content. Use when user  |
| `docs-pipeline` | 上下文/文档 | \| |
| `document-generate` | 其他 | Generate missing documentation from scratch for a feature, module, or entire project. (gstack) |
| `document-release` | 其他 | Post-ship documentation update. (gstack) |
| `domain-modeling` | 其他 | Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous langu |
| `edit-article` | 内容编辑 | Edit and improve articles by restructuring sections, improving clarity, and tightening prose. Use when user wants to edi |
| `find-skills` | 其他 | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is th |
| `freeze` | 其他 | Restrict file edits to a specific directory for the session. (gstack) |
| `frontend-design` | frontend-design 内置 | Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to  |
| `gemini-image` | 其他 | 当用户想要生成图片、画图、绘画、创建图像、AI作画时使用此 Skill。支持文生图和图生图。 |
| `gemini-manager` | 其他 | This skill should be used when the user wants Claude Code to act purely as a manager/architect while Gemini CLI does all |
| `gemini-web-image` | 宝玉 (baoyu) | 使用 Gemini Web 生图的包装 skill。面向 vibe-writer 的配图流程，内部依赖全局 skill `baoyu-danger-gemini-web`，适用于 Gemini Web 登录态可用、希望直接用 Gemini  |
| `git-guardrails-claude-code` | 其他 | Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execut |
| `grill-me` | 其他 | A relentless interview to sharpen a plan or design. |
| `grill-with-docs` | 其他 | A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go. |
| `grilling` | 其他 | Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or u |
| `gsd-add-tests` | gstack GSD | "Generate tests for a completed phase based on UAT criteria and implementation" |
| `gsd-ai-integration-phase` | gstack GSD | "Generate an AI-SPEC.md design contract for phases that involve building AI systems." |
| `gsd-audit-fix` | gstack GSD | "Autonomous audit-to-fix pipeline — find issues, classify, fix, test, commit" |
| `gsd-audit-milestone` | gstack GSD | "Audit milestone completion against original intent before archiving" |
| `gsd-audit-uat` | gstack GSD | "Cross-phase audit of all outstanding UAT and verification items" |
| `gsd-autonomous` | gstack GSD | "Run all remaining phases autonomously — discuss→plan→execute per phase" |
| `gsd-capture` | gstack GSD | "Capture ideas, tasks, notes, and seeds to their destination" |
| `gsd-cleanup` | gstack GSD | "Archive accumulated phase directories from completed milestones" |
| `gsd-code-review` | gstack GSD | "Review source files changed during a phase for bugs, security issues, and code quality problems" |
| `gsd-complete-milestone` | gstack GSD | "Archive completed milestone and prepare for next version" |
| `gsd-config` | gstack GSD | "Configure GSD settings — workflow toggles, advanced knobs, integrations, and model profile" |
| `gsd-debug` | gstack GSD | "Systematic debugging with persistent state across context resets" |
| `gsd-discuss-phase` | gstack GSD | "Gather phase context through adaptive questioning before planning." |
| `gsd-docs-update` | gstack GSD | "Generate or update project documentation verified against the codebase" |
| `gsd-eval-review` | gstack GSD | "Audit an executed AI phase's evaluation coverage and produce an EVAL-REVIEW.md remediation plan." |
| `gsd-execute-phase` | gstack GSD | "Execute all plans in a phase with wave-based parallelization" |
| `gsd-explore` | gstack GSD | "Socratic ideation and idea routing — think through ideas before committing to plans" |
| `gsd-extract-learnings` | gstack GSD | "Extract decisions, lessons, patterns, and surprises from completed phase artifacts" |
| `gsd-fast` | gstack GSD | "Execute a trivial task inline — no subagents, no planning overhead" |
| `gsd-forensics` | gstack GSD | "Post-mortem investigation for failed GSD workflows — diagnoses what went wrong." |
| `gsd-graphify` | gstack GSD | "Build, query, and inspect the project knowledge graph in .planning/graphs/" |
| `gsd-health` | gstack GSD | "Diagnose planning directory health and optionally repair issues" |
| `gsd-help` | gstack GSD | "Show available GSD commands and usage guide" |
| `gsd-import` | gstack GSD | "Ingest external plans with conflict detection against project decisions before writing anything." |
| `gsd-inbox` | gstack GSD | "Triage and review open GitHub issues and PRs against project templates and contribution guidelines." |
| `gsd-ingest-docs` | gstack GSD | "Bootstrap or merge a .planning/ setup from existing ADRs, PRDs, SPECs, and docs in a repo." |
| `gsd-manager` | gstack GSD | "Interactive command center for managing multiple phases from one terminal" |
| `gsd-map-codebase` | gstack GSD | "Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents" |
| `gsd-milestone-summary` | gstack GSD | "Generate a comprehensive project summary from milestone artifacts for team onboarding and review" |
| `gsd-mvp-phase` | gstack GSD | "Plan a phase as a vertical MVP slice — user story, SPIDR splitting, then plan-phase" |
| `gsd-new-milestone` | gstack GSD | "Start a new milestone cycle — update PROJECT.md and route to requirements" |
| `gsd-new-project` | gstack GSD | "Initialize a new project with deep context gathering and PROJECT.md" |
| `gsd-ns-context` | gstack GSD | "codebase intelligence \| map graphify docs learnings" |
| `gsd-ns-ideate` | gstack GSD | "exploration capture \| explore sketch spike spec capture" |
| `gsd-ns-manage` | gstack GSD | "config workspace \| workstreams thread update ship inbox" |
| `gsd-ns-project` | gstack GSD | "project lifecycle \| milestones audits summary" |
| `gsd-ns-review` | gstack GSD | "quality gates \| code review debug audit security eval ui" |
| `gsd-ns-workflow` | gstack GSD | "workflow \| discuss plan execute verify phase progress" |
| `gsd-pause-work` | gstack GSD | "Create context handoff when pausing work mid-phase" |
| `gsd-phase` | gstack GSD | "CRUD for phases in ROADMAP.md — add, insert, remove, or edit phases" |
| `gsd-plan-phase` | gstack GSD | "Create detailed phase plan (PLAN.md) with verification loop" |
| `gsd-plan-review-convergence` | gstack GSD | "Cross-AI plan convergence loop — replan with review feedback until no HIGH concerns remain." |
| `gsd-pr-branch` | gstack GSD | "Create a clean PR branch by filtering out .planning/ commits — ready for code review" |
| `gsd-profile-user` | gstack GSD | "Generate developer behavioral profile and create Claude-discoverable artifacts" |
| `gsd-progress` | gstack GSD | "Check progress, advance workflow, or dispatch freeform intent — the unified GSD situational command" |
| `gsd-quick` | gstack GSD | "Execute a quick task with GSD guarantees (atomic commits, state tracking) but skip optional agents" |
| `gsd-resume-work` | gstack GSD | "Resume work from previous session with full context restoration" |
| `gsd-review` | gstack GSD | "Request cross-AI peer review of phase plans from external AI CLIs" |
| `gsd-review-backlog` | gstack GSD | "Review and promote backlog items to active milestone" |
| `gsd-secure-phase` | gstack GSD | "Retroactively verify threat mitigations for a completed phase" |
| `gsd-settings` | gstack GSD | "Configure GSD workflow toggles and model profile" |
| `gsd-ship` | gstack GSD | "Create PR, run review, and prepare for merge after verification passes" |
| `gsd-sketch` | gstack GSD | "Sketch UI/design ideas with throwaway HTML mockups, or propose what to sketch next (frontier mode)" |
| `gsd-spec-phase` | gstack GSD | "Clarify WHAT a phase delivers with ambiguity scoring; produces a SPEC.md before discuss-phase." |
| `gsd-spike` | gstack GSD | "Spike an idea through experiential exploration, or propose what to spike next (frontier mode)" |
| `gsd-stats` | gstack GSD | "Display project statistics — phases, plans, requirements, git metrics, and timeline" |
| `gsd-thread` | gstack GSD | "Manage persistent context threads for cross-session work" |
| `gsd-ui-phase` | gstack GSD | "Generate UI design contract (UI-SPEC.md) for frontend phases" |
| `gsd-ui-review` | gstack GSD | "Retroactive 6-pillar visual audit of implemented frontend code" |
| `gsd-ultraplan-phase` | gstack GSD | "[BETA] Offload plan phase to Claude Code's ultraplan cloud; review in browser and import back." |
| `gsd-undo` | gstack GSD | "Safe git revert. Roll back phase or plan commits using the phase manifest with dependency checks." |
| `gsd-update` | gstack GSD | "Update GSD to latest version with changelog display" |
| `gsd-validate-phase` | gstack GSD | "Retroactively audit and fill Nyquist validation gaps for a completed phase" |
| `gsd-verify-work` | gstack GSD | "Validate built features through conversational UAT" |
| `gsd-workspace` | gstack GSD | "Manage GSD workspaces — create, list, or remove isolated workspace environments" |
| `gsd-workstreams` | gstack GSD | "Manage parallel workstreams — list, create, switch, status, progress, complete, and resume" |
| `gstack` | gstack 基础 | Router for the gstack skill suite. (gstack) |
| `gstack-upgrade` | gstack 基础 | Upgrade gstack to the latest version. |
| `guard` | 其他 | "Full safety mode: destructive command warnings + directory-scoped edits. (gstack)" |
| `guizang-ppt-skill` | guizang (桂藏) | 生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板。提供两种风格：① "电子杂志 × 电子墨水"（衬线 + 流体背景 + 暖色） ② "瑞士国际主义"（无衬线 + 网格点阵 + IKB |
| `handoff` | 其他 | Compact the current conversation into a handoff document for another agent to pick up. |
| `health` | 健康检查 | Code quality dashboard. (gstack) |
| `health-podcast-rewriter` | 健康检查 |  |
| `help-center-doc-writer` | 其他 | "Feature documentation writer for HR/business SaaS products. Researches features by reading backend code, frontend code, |
| `huashu-bookwriter` | huashu (花书) | \| |
| `huashu-design` | huashu-design / 设计类 | 花叔Design（Huashu-Design）——用HTML做高保真原型、交互Demo、幻灯片、动画、设计变体探索+设计方向顾问+专家评审的一体化设计能力。HTML是工具不是媒介，根据任务embody不同专家（UX设计师/动画师/幻灯片设计 |
| `huashu-nuwa` | huashu (花书) | \| |
| `implement` | 其他 | "Implement a piece of work based on a spec or set of tickets." |
| `improve-codebase-architecture` | 其他 | Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you  |
| `investigate` | 调试/调查 | Systematic debugging with root cause investigation. (gstack) |
| `ios-clean` | 其他 | "Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. (gstack)" |
| `ios-design-review` | 其他 | Visual design audit for iOS apps on real hardware. (gstack) |
| `ios-fix` | 其他 | Autonomous iOS bug fixer. (gstack) |
| `ios-qa` | 其他 | Live-device iOS QA for SwiftUI apps. (gstack) |
| `ios-sync` | 其他 | Regenerate the iOS debug bridge against the latest upstream gstack templates. (gstack) |
| `knowledge-site-creator` | 其他 | 一句话生成任何领域的知识学习网站。AI自动理解主题、创作内容、生成页面、部署上线。适用于任何需要系统学习的知识领域：进化心理学、大模型术语、化学元素、历史事件等。 |
| `land-and-deploy` | gstack 流程 | Land and deploy workflow. (gstack) |
| `landing-report` | gstack 流程 | Read-only queue dashboard for workspace-aware ship. (gstack) |
| `learn` | 学习/规范 | Manage project learnings. |
| `ljg-card` | 其他 | "Content caster (铸). Transforms content into PNG visuals. Six molds: -l (default) long reading card, -i infograph, -m mu |
| `ljg-invest` | 其他 | 投资分析, 生成一份深度投资分析报告。不做传统投资分析——核心判断是项目是否是一台「秩序创造机器」。Use when user says '投资报告', '投资分析', '分析这个项目', '写投资报告', 'investment repo |
| `ljg-learn` | 其他 | Deep concept anatomist that deconstructs any concept through 8 exploration dimensions (history, dialectics, phenomenolog |
| `ljg-paper` | 其他 |  |
| `ljg-paper-flow` | 其他 | "Paper workflow: read papers + cast cards in one go. Takes one or more arxiv links, paper URLs, PDFs, or paper names. Fo |
| `ljg-paper-river` | 其他 | "论文倒读法：给一篇论文，递归找出它批判和改进的前序论文（最多5层），再找它之后的最新进展，从源头正向讲述问题演化史。以问题为轴，费曼式讲解每篇论文看到的问题和解法创新。Use when user shares a paper and wa |
| `ljg-plain` | 其他 |  |
| `ljg-rank` | 其他 | 给一个领域，找出背后真正撑着它的几根独立的力。十几个现象砍到不可再少的生成器——砍完能把现象一个个生回来，才算数。Use when user says '降秩', '找秩', '秩是什么', '这个领域靠什么撑着', '背后是什么', or |
| `ljg-relationship` | 其他 | >- |
| `ljg-roundtable` | 其他 |  |
| `ljg-skill-map` | 其他 |  |
| `ljg-think` | 其他 | 追本之箭——纵向深钻思维工具。给一个观点、现象或问题，像箭一样一路向下钻到不可再分的本质。Use when user says '想透', '追本', '本质是什么', '为什么会这样', '深挖', '钻到底', 'think deep' |
| `ljg-travel` | 其他 | "Deep travel research workflow for museums and ancient architecture. Input a city name, auto-generates structured knowle |
| `ljg-word` | 其他 |  |
| `ljg-word-flow` | 其他 | "Word flow: deep-dive word analysis + infograph card in one go. Takes one or more English words, runs ljg-word (generate |
| `ljg-writes` | 其他 | "写作引擎。带着一个观点出发，在写的过程中把它想透。" |
| `loop-me` | 其他 | Grill me about specs for the workflows I want to build, within this workspace. |
| `make-pdf` | 其他 | Turn any markdown file into a publication-quality PDF. (gstack) |
| `migrate-to-shoehorn` | 其他 | Migrate test files from `as` type assertions to @total-typescript/shoehorn. Use when user mentions shoehorn, wants to re |
| `minimax-cli-image` | 其他 | 使用本地 mmx CLI 生成图片。适用于本机已安装并认证 mmx，且需要用 prompt 文本、prompt 文件或 batch.json 批量生成配图的场景。 |
| `notebooklm` | 其他 | Use this skill to query your Google NotebookLM notebooks directly from Claude Code for source-grounded, citation-backed  |
| `obsidian-vault` | 其他 | Search, create, and manage notes in the Obsidian vault with wikilinks and index notes. Use when user wants to find, crea |
| `office-hours` | office-hours | YC Office Hours — two modes. (gstack) |
| `open-gstack-browser` | gstack 基础 | Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in. |
| `pair-agent` | 其他 | Pair a remote AI agent with your browser. (gstack) |
| `pensieve` | 其他 | >- |
| `plan-ceo-review` | gstack 计划类 | CEO/founder-mode plan review. (gstack) |
| `plan-design-review` | gstack 计划类 | Designer's eye plan review — interactive, like CEO and Eng review. (gstack) |
| `plan-devex-review` | gstack 计划类 | Interactive developer experience plan review. (gstack) |
| `plan-eng-review` | gstack 计划类 | Eng manager-mode plan review. (gstack) |
| `plan-tune` | gstack 计划类 | "Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). (gstack)" |
| `ppt-master` | 其他 | > |
| `prompt-optimizer` | 其他 | Prompt 优化助手。适用于用户想优化提示词、改进 AI 指令、为特定任务设计更好的 prompt，或需要选择合适提示框架时使用。会根据任务场景匹配合适框架，必要时先追问关键信息，再输出更清晰、更可执行的提示词版本。 |
| `prototype` | 其他 | Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model o |
| `qa` | QA | Interactive QA session where user reports bugs or issues conversationally, and the agent files GitHub issues. Explores t |
| `qa-only` | QA | Report-only QA testing. (gstack) |
| `release-skills` | 其他 | Universal release workflow. Auto-detects version files and changelogs. Supports Node.js, Python, Rust, Claude Plugin, an |
| `request-refactor-plan` | 其他 | Create a detailed refactor plan with tiny commits via user interview, then file it as a GitHub issue. Use when user want |
| `research` | 其他 | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use w |
| `resolving-merge-conflicts` | 其他 | "Use when you need to resolve an in-progress git merge/rebase conflict." |
| `retro` | 回顾/办公 | Weekly engineering retrospective. (gstack) |
| `retrospective-codify` | Auto review | 'Pair "what failed first" with "what finally worked" and codify the should-have-known-it insight as an ast-grep rule, a  |
| `review` | Review 类 | Pre-landing PR review. (gstack) |
| `role-prd-design-expert` | 其他 | 'Creates product requirement specification documents from user stories. Use when writing PRDs, defining product features |
| `scaffold-exercises` | 其他 | Create exercise directory structures with sections, problems, solutions, and explainers that pass linting. Use when user |
| `scrape` | 其他 | Pull data from a web page. (gstack) |
| `sensenova-image-gen` | 其他 | Use when users ask to generate or create images with SenseNova, SenseNova U1 Fast, or 商汤. Triggers include 生成图片, 画图, 做图, |
| `setup-browser-cookies` | gstack 基础 | Import cookies from your real Chromium browser into the headless browse session. (gstack) |
| `setup-deploy` | Claude Code | Configure deployment settings for /land-and-deploy. |
| `setup-gbrain` | Claude Code | "Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, captur |
| `setup-matt-pocock-skills` | Claude Code | Configure this repo for the engineering skills — set up its issue tracker, triage label vocabulary, and domain doc layou |
| `setup-pre-commit` | Claude Code | Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user w |
| `setup-ts-deep-modules` | Claude Code | Wire dependency-cruiser into a TypeScript repo so each package is a deep module — implementation hidden in subfolders, r |
| `ship` | gstack 流程 | "Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create |
| `sigma` | 其他 | "Personalized 1-on-1 AI tutor using Bloom's 2-Sigma mastery learning. Guides users through any topic with Socratic quest |
| `siyuan-send` | 其他 | 发送笔记到思源笔记服务器，支持本地文件、网址和对话内容三种输入方式 |
| `skill-manage` | Skill 工具 | 管理 skill 的全生命周期。当用户说"整理 skill"、"分类 skill"、"同步 skill"、"推送 skill"、"扫描 skill"、"列出 skill"时触发。支持扫描、分类、同步到 GitHub、跨设备备份等操作。 |
| `skillify` | 其他 | Codify the most recent successful /scrape flow into a permanent browser-skill on disk. (gstack) |
| `spec` | Spec / 计划 | Turn vague intent into a precise, executable spec in five phases. (gstack) |
| `sync-gbrain` | 配置/同步 | Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. Wraps the gstack-gbrain-sync o |
| `tdd` | 其他 | Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor" |
| `teach` | 其他 | Teach the user a new skill or concept, within this workspace. |
| `to-issues` | 其他 | Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical |
| `to-prd` | 其他 | Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to cre |
| `to-questionnaire` | 其他 | Turn a decision you can't fully answer into a questionnaire for someone else to fill in. |
| `to-spec` | 其他 | Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of  |
| `to-tickets` | 其他 | Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges,  |
| `topic-collector` | 其他 | AI热点采集工具。从Twitter/X、Product Hunt、Reddit、Hacker News、博客等采集AI相关热点内容。当用户说"开始今日选题"、"采集热点"、"看看今天有什么新闻"、"今日AI热点"时触发。聚焦领域：Vibe  |
| `topic-generator` | 其他 | AI选题生成工具。从采集的热点中筛选TOP10，生成完整选题方案。当用户说"生成选题"、"筛选热点"、"哪些值得写"时触发。输出包含：事件描述、核心角度、标题、写作方式。 |
| `topic-reviewer` | 其他 | 选题审核工具。检查选题是否符合发布标准，给出通过/不通过判断及修改建议。当用户说"审核选题"、"这个选题行不行"、"帮我看看这个能不能写"时触发。 |
| `triage` | 其他 | Move issues and external PRs through a state machine of triage roles — categorise, verify, grill if needed, and write ag |
| `typst-author-chinese` | 其他 | 生成符合中文排版习惯的 Typst（.typ）代码，编辑、调试 Typst 文档与项目，回答 Typst 语法与参考问题。当用户处理 .typ 文件、涉及 Typst 文档创建/编辑/调试/编译/格式化/模板/包的使用，或者涉及中文排版、中 |
| `ubiquitous-language` | 其他 | Extract a DDD-style ubiquitous language glossary from the current conversation, flagging ambiguities and proposing canon |
| `unfreeze` | 其他 | Clear the freeze boundary set by /freeze, allowing edits to all directories again. (gstack) |
| `vast-agent-skill-reviewer` | vast 系列 | 根据最佳实践审查代理技能（Agent Skill）目录和 SKILL.md 文件。当用户想要审查、验证或检查代理技能实现时使用此技能。 |
| `vast-c4-architecture` | vast 系列 | Generate architecture documentation using C4 model Mermaid diagrams. Use when asked to create architecture diagrams, doc |
| `vast-claude-config-advisor` | vast 系列 | 审查或设计 Claude Code 项目配置。用于用户提到 `.claude`、`CLAUDE.md`、Claude 配置文件、项目级 Claude 自定义配置、配置结构是否合理、该创建哪些配置文件，或希望从零规划 Claude 配置时使用 |
| `vast-code-review-expert` | vast 系列 | "以高级工程师的视角对当前的 git 变更进行专家级代码审查。检测 SOLID 原则违反、安全风险，并提出可行的改进建议。" |
| `vast-codex-cli` | vast 系列 | 编排 OpenAI Codex CLI 以进行并行任务执行。作为编排者，分析任务、注入上下文、管理会话并协调并行实例。当将编码任务委托给 Codex 或运行多代理工作流时使用。(user) |
| `vast-dev-arch-top` | vast 系列 | 提供具有五层结构（策略、功能、交互、数据模型、视觉）的项目开发宪法。在启动软件项目、定义架构或建立开发约束时使用。触发词：“项目开发”、“核心宪法”、“技术铁律”、“五层结构” |
| `vast-dev-brainstorming` | vast 系列 | "在任何创意工作（创建功能、构建组件、添加功能或修改行为）之前必须使用此技能。在实施前探索用户意图、需求和设计。" |
| `vast-dev-challenge` | vast 系列 | "跨模型对抗性验证。使用第二个 AI 模型来挑战你的分析、验证主张或审查代码。模式：挑战（寻找缺陷）、验证（事实核查）、审查（同行评审）。" |
| `vast-dev-code-reader` | vast 系列 | 当您想要深度理解一个陌生的代码库并从中生成可重用的认知技能时使用，通过提供本地路径或 GitHub URL。 |
| `vast-dev-commit-as-prompt` | vast 系列 | 将 Git 提交转化为结构化 Prompt 上下文，帮助 AI 在代码审查、技术债评估或文档编写时快速理解变更的目标/动机/手段 |
| `vast-dev-cross-verify` | vast 系列 | 7阶段高风险功能开发工作流，包含4轮独立交叉验证，在投入生产前捕获并发、幂等性和跨服务 bug。用于金融交易、订单/库存状态机、分布式锁、跨服务接口变更、在线 schema 迁移等高风险场景。触发词：'cross-verified'、'交叉 |
| `vast-dev-dir-organizer` | vast 系列 | "整理和优化项目目录结构。当用户请求整理目录、分类文件、清理无用文件或重构文件夹结构时调用此技能。" |
| `vast-dev-kickoff` | vast 系列 | > |
| `vast-dev-kickoff-pua` | vast 系列 | "高代理开发循环引擎。强制执行完整的开发周期：规划 → 执行 → 代码审查 → 安全检查 → 验证 → Git 提交。内置 P0 护栏、失败压力升级机制以及用于自主执行的循环模式。" |
| `vast-dev-office-hours` | vast 系列 | \| |
| `vast-dev-project-analyzer` | vast 系列 | 基于深度代码库分析生成全面的项目文档（白皮书），涵盖架构、模块、测试和部署。 |
| `vast-dev-taste-checker` | vast 系列 | 使用 Linus Torvalds 的 “good taste” 哲学审查代码。消除防御性代码、特殊情况和深度嵌套。在审查代码质量、重构或检查代码异味时使用。 |
| `vast-dev-workflow-auto` | vast 系列 | 自动化工作流编排，支持 CI/CD 配置、脚本生成、定时任务和 Git Hooks 设置。 |
| `vast-draw-io` | vast 系列 | Use when the user requests diagrams, flowcharts, architecture diagrams, ER diagrams, UML / sequence / class diagrams, ne |
| `vast-draw-mermaid` | vast 系列 | Mermaid 图绘制助手。适用于用户明确要求绘制 Mermaid 图，或提到流程图、架构图、时序图、状态图、甘特图、ER 图、用户旅程图、类图，并希望直接输出 Mermaid 代码块时使用。会先判断最合适的图类型，再生成可渲染、结构清晰的 |
| `vast-draw-tech-graph` | vast 系列 | >- |
| `vast-draw-thinking-logic` | vast 系列 | 将复杂信息转换为清晰的视觉思维模型。在理解复杂概念、可视化逻辑或创建结构化解释时使用。触发词：“思维导航”、“逻辑可视化”、“思维模型”、“概念图” |
| `vast-draw-visual-card-designer` | vast 系列 | 将长内容转换为逻辑模型或极简图形风格的竖屏卡片。在创建视觉摘要、社交媒体卡片或基于图表的内容时使用。触发词：“视觉卡片”、“逻辑模型”、“竖屏卡片”、“图解” |
| `vast-excalidraw` | vast 系列 | "Use when working with *.excalidraw or *.excalidraw.json files, user mentions diagrams/flowcharts, or requests architect |
| `vast-gemini-cli` | vast 系列 | 当用户希望 Claude Code 纯粹担任经理/架构师角色，而由 Gemini CLI 完成所有编码工作时，应使用此技能。Claude Code 像对待实习生一样驱动 Gemini —— 发布任务、审查输出、要求修复 —— 但从不亲自编写 |
| `vast-karpathy-guidelines` | vast 系列 | 减少常见 LLM 编码错误的行为准则。用于编写、审查或重构代码时，避免过度复杂化、执行精准修改、暴露假设前提，以及定义可验证的成功标准。 |
| `vast-khazix-hv-analysis` | vast 系列 | \| |
| `vast-khazix-neat-freak` | vast 系列 | > |
| `vast-learning-builder` | vast 系列 | Create personalized learning tutorials from a learner profile and authority-first research. Use when the user wants a gu |
| `vast-markdown-proxy` | vast 系列 | \| |
| `vast-marp-slide` | vast 系列 | Create professional Marp presentation slides with 7 beautiful themes (default, minimal, colorful, dark, gradient, tech,  |
| `vast-md-summarizer` | vast 系列 | "分析和总结指定的本地 Markdown 文件，并输出结构化的中文总结。当用户请求总结、分析或提取本地 Markdown 文档信息时调用此技能。" |
| `vast-md-translator` | vast 系列 | "将指定的本地 Markdown 文件翻译成指定语言（默认中文），并在文件名中添加语言标识后缀。当用户请求翻译本地 Markdown 文档时调用此技能。" |
| `vast-mentor` | vast 系列 | "渐进式学习导师。帮助用户逐步学习书籍章节内容，像私人家庭教师一样通过自然对话推进教学。触发场景：'学习第三章'、'帮我消化这部分'、'讲讲这个概念'、'我不太懂这里'、'这个知识点什么意思'、'教我学这门课'、'带我读一下这本书'、'逐步 |
| `vast-pm-prd-design-expert` | vast 系列 | '根据用户故事创建产品需求规格文档。在编写 PRD、定义产品功能或将用户故事转换为规格说明时使用。触发词：“产品需求”、“PRD”、“需求规格说明书”、“用户故事”' |
| `vast-pm-prd-writer` | vast 系列 | \| |
| `vast-pm-product-describer` | vast 系列 | \| |
| `vast-pm-roadmap-planner` | vast 系列 | \| |
| `vast-pragmatic-clean-code-reviewer` | vast 系列 | > |
| `vast-prompt-compiler` | vast 系列 | "Prompt 设计编译器 - 将用户原始需求编译为可指导 Prompt 写作的设计方案。通过 10 步流程识别问题原型、路由学科领域、诊断能力缺口、召回并验证高信息密度知识对象，最终输出轻量 Prompt 骨架。使用场景：写 Prompt |
| `vast-skill-forge` | vast 系列 | "Create high-quality, production-grade skills for Claude Code. Expert guidance on skill architecture, workflow design, p |
| `vast-skill-optimizer` | vast 系列 | 优化和重构现有 skill。用于检查目标 skill 的触发描述、SKILL.md 工作流、确认门槛、渐进式披露，以及 references/scripts/assets 的组织方式。当用户提到”优化 skill””检查 skill 质量” |
| `vast-skill-recommend-add` | vast 系列 | 向 vast-skill-recommender 的内置推荐列表添加新技能，并同步安装到全局 skills 目录。触发词：登记推荐技能、添加内置推荐、推荐新技能。 |
| `vast-skill-recommender` | vast 系列 | '维护技能推荐列表。支持添加、删除、更新、查看技能推荐，类似 sanyuan-skills 的技能展示。触发词: /skill-recommend、"技能推荐"、"添加技能"、"删除技能"、"更新技能"' |
| `vast-skill-review` | vast 系列 | "Quality review and audit for Claude Code skills. Analyzes skill structure, description quality, workflow design, token  |
| `vast-social-xhs-card` | vast 系列 | 将长内容转换为小红书/Instagram 风格的视觉卡片。在创建社交媒体卡片系列、知识卡片或小红书视觉内容时使用。触发词：“小红书卡片”、“系列卡片”、“视觉卡片”、“4:5画布” |
| `vast-social-xhs-content-script` | vast 系列 | 通过多轮对话生成小红书爆款文案和 2 分钟口播脚本。在创建小红书内容、分析爆款元素或撰写高参与度帖子时使用。触发词：“小红书爆款”、“爆款文案”、“口播脚本”、“小红书流量” |
| `vast-trading-cognitive-guardrails` | vast 系列 | 防止 AI 只挑你爱听的说。当你询问投资相关问题（买入/卖出/持有/分析）时自动激活。触发于股票代码、投资组合持仓或目标价，以确保客观、方向中立的财务分析。 |
| `vast-universal-system-prompt` | vast 系列 | 为高级 AI 助手提供量子织锦认知引擎框架。当用户需要深度多维思考、跨概念模式识别或想要激活全面的认知协议时使用。触发词：“量子织锦”、“认知引擎”、“深度思考”、“系统初始化” |
| `vast-work-daily-reviewer` | vast 系列 | 每日工作回顾与洞察分析，对用户前一天的对话历史和使用数据进行总结与建议 |
| `vast-work-deep-reviewer` | vast 系列 | 深度工作分析与项目洞察，从更长时间维度分析工作模式、项目进展和技术方向 |
| `vercel-composition-patterns` | 其他 | React composition patterns that scale. Use when refactoring components with |
| `vercel-react-best-practices` | 其他 | React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, r |
| `vercel-react-native-skills` | 其他 | React Native and Expo best practices for building performant mobile apps. Use |
| `vibe-illustrator` | 其他 | 文章配图调度中心。根据文章类型和用户需求，智能调度最合适的配图方案。当用户说"配图"、"生成图片"、"为文章配图"时触发。 |
| `vibe-publisher` | 其他 | 发布调度中心。根据内容类型和目标平台，智能调度最合适的发布方案。当用户说"发布"、"群发"、"发布到"时触发。 |
| `vibe-writer` | 其他 | 写作工作流总调度Skill。协调9个子Skill完成完整写作流程：热点采集→选题生成→选题审核→共同创作→深度审稿→配图调度→配图生成→发布调度→发布。当用户说"开始写作"、"帮我写文章"、"写一篇"时触发。 |
| `vibe-writer-auto` | 其他 | 全自动写作流程Skill。自动完成热点采集→选题生成→选题审核→文章创作→配图→发布的完整流程，无需用户介入。当用户说"自动写作"、"全自动写文章"、"帮我自动写一篇"时触发。 |
| `wayfinder` | 其他 | Plan a huge chunk of work — more than one agent session can hold — as a shared map of decision tickets on your issue tra |
| `web-design-guidelines` | 其他 | Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit  |
| `wechat-article-formatter` | 其他 | 将Markdown文章转换为美化的HTML格式，适配微信公众号发布。应用专业CSS样式、代码高亮、优化排版。当用户说"美化这篇文章"、"转换为HTML"、"优化公众号格式"、"生成公众号HTML"时使用。 |
| `wechat-draft-publisher` | 其他 | 自动将 HTML 文章发布到微信公众号草稿箱，支持封面图上传、标题、作者和元数据管理。当用户说"推送到微信"、"发布到公众号草稿"、"上传到草稿箱"或提到微信文章发布时使用。 |
| `wiki-ingest` | 其他 | "Compile articles, documents, or notes into a structured wiki knowledge base. Use when user says 'ingest to wiki', 'comp |
| `wizard` | 其他 | Generate an interactive bash wizard that walks a human through a manual procedure — third-party setup, a one-off migrati |
| `write-a-skill` | 其他 | Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to cre |
| `writing-beats` | 其他 | Writing, exploit — assemble raw material into a journey of beats, grounding each term before a beat leans on it. |
| `writing-fragments` | 其他 | Writing, explore — mine raw fragments, no structure yet. |
| `writing-great-skills` | 其他 | Reference for writing and editing skills well — the vocabulary and principles that make a skill predictable. |
| `writing-shape` | 其他 | Writing, exploit — shape raw material into an article, paragraph by paragraph. |
| `zoom-out` | 其他 | Tell the agent to zoom out and give broader context or a higher-level perspective. Use when you're unfamiliar with a sec |

## 详细分类


### 其他 (98 个)

- **`_gstack-command`** — Router for the gstack skill suite. (gstack)
- **`agent-reach`** — >
- **`caveman`** — >
- **`codebase-design`** — Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find de
- **`diagram`** — "Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you ca
- **`document-generate`** — Generate missing documentation from scratch for a feature, module, or entire project. (gstack)
- **`document-release`** — Post-ship documentation update. (gstack)
- **`domain-modeling`** — Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous langu
- **`find-skills`** — Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is th
- **`freeze`** — Restrict file edits to a specific directory for the session. (gstack)
- **`gemini-image`** — 当用户想要生成图片、画图、绘画、创建图像、AI作画时使用此 Skill。支持文生图和图生图。
- **`gemini-manager`** — This skill should be used when the user wants Claude Code to act purely as a manager/architect while Gemini CLI does all
- **`git-guardrails-claude-code`** — Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execut
- **`grill-me`** — A relentless interview to sharpen a plan or design.
- **`grill-with-docs`** — A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
- **`grilling`** — Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or u
- **`guard`** — "Full safety mode: destructive command warnings + directory-scoped edits. (gstack)"
- **`handoff`** — Compact the current conversation into a handoff document for another agent to pick up.
- **`help-center-doc-writer`** — "Feature documentation writer for HR/business SaaS products. Researches features by reading backend code, frontend code,
- **`implement`** — "Implement a piece of work based on a spec or set of tickets."
- **`improve-codebase-architecture`** — Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you 
- **`ios-clean`** — "Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. (gstack)"
- **`ios-design-review`** — Visual design audit for iOS apps on real hardware. (gstack)
- **`ios-fix`** — Autonomous iOS bug fixer. (gstack)
- **`ios-qa`** — Live-device iOS QA for SwiftUI apps. (gstack)
- **`ios-sync`** — Regenerate the iOS debug bridge against the latest upstream gstack templates. (gstack)
- **`knowledge-site-creator`** — 一句话生成任何领域的知识学习网站。AI自动理解主题、创作内容、生成页面、部署上线。适用于任何需要系统学习的知识领域：进化心理学、大模型术语、化学元素、历史事件等。
- **`ljg-card`** — "Content caster (铸). Transforms content into PNG visuals. Six molds: -l (default) long reading card, -i infograph, -m mu
- **`ljg-invest`** — 投资分析, 生成一份深度投资分析报告。不做传统投资分析——核心判断是项目是否是一台「秩序创造机器」。Use when user says '投资报告', '投资分析', '分析这个项目', '写投资报告', 'investment repo
- **`ljg-learn`** — Deep concept anatomist that deconstructs any concept through 8 exploration dimensions (history, dialectics, phenomenolog
- **`ljg-paper`** — 
- **`ljg-paper-flow`** — "Paper workflow: read papers + cast cards in one go. Takes one or more arxiv links, paper URLs, PDFs, or paper names. Fo
- **`ljg-paper-river`** — "论文倒读法：给一篇论文，递归找出它批判和改进的前序论文（最多5层），再找它之后的最新进展，从源头正向讲述问题演化史。以问题为轴，费曼式讲解每篇论文看到的问题和解法创新。Use when user shares a paper and wa
- **`ljg-plain`** — 
- **`ljg-rank`** — 给一个领域，找出背后真正撑着它的几根独立的力。十几个现象砍到不可再少的生成器——砍完能把现象一个个生回来，才算数。Use when user says '降秩', '找秩', '秩是什么', '这个领域靠什么撑着', '背后是什么', or
- **`ljg-relationship`** — >-
- **`ljg-roundtable`** — 
- **`ljg-skill-map`** — 
- **`ljg-think`** — 追本之箭——纵向深钻思维工具。给一个观点、现象或问题，像箭一样一路向下钻到不可再分的本质。Use when user says '想透', '追本', '本质是什么', '为什么会这样', '深挖', '钻到底', 'think deep'
- **`ljg-travel`** — "Deep travel research workflow for museums and ancient architecture. Input a city name, auto-generates structured knowle
- **`ljg-word`** — 
- **`ljg-word-flow`** — "Word flow: deep-dive word analysis + infograph card in one go. Takes one or more English words, runs ljg-word (generate
- **`ljg-writes`** — "写作引擎。带着一个观点出发，在写的过程中把它想透。"
- **`loop-me`** — Grill me about specs for the workflows I want to build, within this workspace.
- **`make-pdf`** — Turn any markdown file into a publication-quality PDF. (gstack)
- **`migrate-to-shoehorn`** — Migrate test files from `as` type assertions to @total-typescript/shoehorn. Use when user mentions shoehorn, wants to re
- **`minimax-cli-image`** — 使用本地 mmx CLI 生成图片。适用于本机已安装并认证 mmx，且需要用 prompt 文本、prompt 文件或 batch.json 批量生成配图的场景。
- **`notebooklm`** — Use this skill to query your Google NotebookLM notebooks directly from Claude Code for source-grounded, citation-backed 
- **`obsidian-vault`** — Search, create, and manage notes in the Obsidian vault with wikilinks and index notes. Use when user wants to find, crea
- **`pair-agent`** — Pair a remote AI agent with your browser. (gstack)
- **`pensieve`** — >-
- **`ppt-master`** — >
- **`prompt-optimizer`** — Prompt 优化助手。适用于用户想优化提示词、改进 AI 指令、为特定任务设计更好的 prompt，或需要选择合适提示框架时使用。会根据任务场景匹配合适框架，必要时先追问关键信息，再输出更清晰、更可执行的提示词版本。
- **`prototype`** — Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model o
- **`release-skills`** — Universal release workflow. Auto-detects version files and changelogs. Supports Node.js, Python, Rust, Claude Plugin, an
- **`request-refactor-plan`** — Create a detailed refactor plan with tiny commits via user interview, then file it as a GitHub issue. Use when user want
- **`research`** — Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use w
- **`resolving-merge-conflicts`** — "Use when you need to resolve an in-progress git merge/rebase conflict."
- **`role-prd-design-expert`** — 'Creates product requirement specification documents from user stories. Use when writing PRDs, defining product features
- **`scaffold-exercises`** — Create exercise directory structures with sections, problems, solutions, and explainers that pass linting. Use when user
- **`scrape`** — Pull data from a web page. (gstack)
- **`sensenova-image-gen`** — Use when users ask to generate or create images with SenseNova, SenseNova U1 Fast, or 商汤. Triggers include 生成图片, 画图, 做图,
- **`sigma`** — "Personalized 1-on-1 AI tutor using Bloom's 2-Sigma mastery learning. Guides users through any topic with Socratic quest
- **`siyuan-send`** — 发送笔记到思源笔记服务器，支持本地文件、网址和对话内容三种输入方式
- **`skillify`** — Codify the most recent successful /scrape flow into a permanent browser-skill on disk. (gstack)
- **`tdd`** — Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor"
- **`teach`** — Teach the user a new skill or concept, within this workspace.
- **`to-issues`** — Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical
- **`to-prd`** — Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to cre
- **`to-questionnaire`** — Turn a decision you can't fully answer into a questionnaire for someone else to fill in.
- **`to-spec`** — Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of 
- **`to-tickets`** — Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, 
- **`topic-collector`** — AI热点采集工具。从Twitter/X、Product Hunt、Reddit、Hacker News、博客等采集AI相关热点内容。当用户说"开始今日选题"、"采集热点"、"看看今天有什么新闻"、"今日AI热点"时触发。聚焦领域：Vibe 
- **`topic-generator`** — AI选题生成工具。从采集的热点中筛选TOP10，生成完整选题方案。当用户说"生成选题"、"筛选热点"、"哪些值得写"时触发。输出包含：事件描述、核心角度、标题、写作方式。
- **`topic-reviewer`** — 选题审核工具。检查选题是否符合发布标准，给出通过/不通过判断及修改建议。当用户说"审核选题"、"这个选题行不行"、"帮我看看这个能不能写"时触发。
- **`triage`** — Move issues and external PRs through a state machine of triage roles — categorise, verify, grill if needed, and write ag
- **`typst-author-chinese`** — 生成符合中文排版习惯的 Typst（.typ）代码，编辑、调试 Typst 文档与项目，回答 Typst 语法与参考问题。当用户处理 .typ 文件、涉及 Typst 文档创建/编辑/调试/编译/格式化/模板/包的使用，或者涉及中文排版、中
- **`ubiquitous-language`** — Extract a DDD-style ubiquitous language glossary from the current conversation, flagging ambiguities and proposing canon
- **`unfreeze`** — Clear the freeze boundary set by /freeze, allowing edits to all directories again. (gstack)
- **`vercel-composition-patterns`** — React composition patterns that scale. Use when refactoring components with
- **`vercel-react-best-practices`** — React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, r
- **`vercel-react-native-skills`** — React Native and Expo best practices for building performant mobile apps. Use
- **`vibe-illustrator`** — 文章配图调度中心。根据文章类型和用户需求，智能调度最合适的配图方案。当用户说"配图"、"生成图片"、"为文章配图"时触发。
- **`vibe-publisher`** — 发布调度中心。根据内容类型和目标平台，智能调度最合适的发布方案。当用户说"发布"、"群发"、"发布到"时触发。
- **`vibe-writer`** — 写作工作流总调度Skill。协调9个子Skill完成完整写作流程：热点采集→选题生成→选题审核→共同创作→深度审稿→配图调度→配图生成→发布调度→发布。当用户说"开始写作"、"帮我写文章"、"写一篇"时触发。
- **`vibe-writer-auto`** — 全自动写作流程Skill。自动完成热点采集→选题生成→选题审核→文章创作→配图→发布的完整流程，无需用户介入。当用户说"自动写作"、"全自动写文章"、"帮我自动写一篇"时触发。
- **`wayfinder`** — Plan a huge chunk of work — more than one agent session can hold — as a shared map of decision tickets on your issue tra
- **`web-design-guidelines`** — Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit 
- **`wechat-article-formatter`** — 将Markdown文章转换为美化的HTML格式，适配微信公众号发布。应用专业CSS样式、代码高亮、优化排版。当用户说"美化这篇文章"、"转换为HTML"、"优化公众号格式"、"生成公众号HTML"时使用。
- **`wechat-draft-publisher`** — 自动将 HTML 文章发布到微信公众号草稿箱，支持封面图上传、标题、作者和元数据管理。当用户说"推送到微信"、"发布到公众号草稿"、"上传到草稿箱"或提到微信文章发布时使用。
- **`wiki-ingest`** — "Compile articles, documents, or notes into a structured wiki knowledge base. Use when user says 'ingest to wiki', 'comp
- **`wizard`** — Generate an interactive bash wizard that walks a human through a manual procedure — third-party setup, a one-off migrati
- **`write-a-skill`** — Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to cre
- **`writing-beats`** — Writing, exploit — assemble raw material into a journey of beats, grounding each term before a beat leans on it.
- **`writing-fragments`** — Writing, explore — mine raw fragments, no structure yet.
- **`writing-great-skills`** — Reference for writing and editing skills well — the vocabulary and principles that make a skill predictable.
- **`writing-shape`** — Writing, exploit — shape raw material into an article, paragraph by paragraph.
- **`zoom-out`** — Tell the agent to zoom out and give broader context or a higher-level perspective. Use when you're unfamiliar with a sec

### gstack GSD (66 个)

- **`gsd-add-tests`** — "Generate tests for a completed phase based on UAT criteria and implementation"
- **`gsd-ai-integration-phase`** — "Generate an AI-SPEC.md design contract for phases that involve building AI systems."
- **`gsd-audit-fix`** — "Autonomous audit-to-fix pipeline — find issues, classify, fix, test, commit"
- **`gsd-audit-milestone`** — "Audit milestone completion against original intent before archiving"
- **`gsd-audit-uat`** — "Cross-phase audit of all outstanding UAT and verification items"
- **`gsd-autonomous`** — "Run all remaining phases autonomously — discuss→plan→execute per phase"
- **`gsd-capture`** — "Capture ideas, tasks, notes, and seeds to their destination"
- **`gsd-cleanup`** — "Archive accumulated phase directories from completed milestones"
- **`gsd-code-review`** — "Review source files changed during a phase for bugs, security issues, and code quality problems"
- **`gsd-complete-milestone`** — "Archive completed milestone and prepare for next version"
- **`gsd-config`** — "Configure GSD settings — workflow toggles, advanced knobs, integrations, and model profile"
- **`gsd-debug`** — "Systematic debugging with persistent state across context resets"
- **`gsd-discuss-phase`** — "Gather phase context through adaptive questioning before planning."
- **`gsd-docs-update`** — "Generate or update project documentation verified against the codebase"
- **`gsd-eval-review`** — "Audit an executed AI phase's evaluation coverage and produce an EVAL-REVIEW.md remediation plan."
- **`gsd-execute-phase`** — "Execute all plans in a phase with wave-based parallelization"
- **`gsd-explore`** — "Socratic ideation and idea routing — think through ideas before committing to plans"
- **`gsd-extract-learnings`** — "Extract decisions, lessons, patterns, and surprises from completed phase artifacts"
- **`gsd-fast`** — "Execute a trivial task inline — no subagents, no planning overhead"
- **`gsd-forensics`** — "Post-mortem investigation for failed GSD workflows — diagnoses what went wrong."
- **`gsd-graphify`** — "Build, query, and inspect the project knowledge graph in .planning/graphs/"
- **`gsd-health`** — "Diagnose planning directory health and optionally repair issues"
- **`gsd-help`** — "Show available GSD commands and usage guide"
- **`gsd-import`** — "Ingest external plans with conflict detection against project decisions before writing anything."
- **`gsd-inbox`** — "Triage and review open GitHub issues and PRs against project templates and contribution guidelines."
- **`gsd-ingest-docs`** — "Bootstrap or merge a .planning/ setup from existing ADRs, PRDs, SPECs, and docs in a repo."
- **`gsd-manager`** — "Interactive command center for managing multiple phases from one terminal"
- **`gsd-map-codebase`** — "Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents"
- **`gsd-milestone-summary`** — "Generate a comprehensive project summary from milestone artifacts for team onboarding and review"
- **`gsd-mvp-phase`** — "Plan a phase as a vertical MVP slice — user story, SPIDR splitting, then plan-phase"
- **`gsd-new-milestone`** — "Start a new milestone cycle — update PROJECT.md and route to requirements"
- **`gsd-new-project`** — "Initialize a new project with deep context gathering and PROJECT.md"
- **`gsd-ns-context`** — "codebase intelligence | map graphify docs learnings"
- **`gsd-ns-ideate`** — "exploration capture | explore sketch spike spec capture"
- **`gsd-ns-manage`** — "config workspace | workstreams thread update ship inbox"
- **`gsd-ns-project`** — "project lifecycle | milestones audits summary"
- **`gsd-ns-review`** — "quality gates | code review debug audit security eval ui"
- **`gsd-ns-workflow`** — "workflow | discuss plan execute verify phase progress"
- **`gsd-pause-work`** — "Create context handoff when pausing work mid-phase"
- **`gsd-phase`** — "CRUD for phases in ROADMAP.md — add, insert, remove, or edit phases"
- **`gsd-plan-phase`** — "Create detailed phase plan (PLAN.md) with verification loop"
- **`gsd-plan-review-convergence`** — "Cross-AI plan convergence loop — replan with review feedback until no HIGH concerns remain."
- **`gsd-pr-branch`** — "Create a clean PR branch by filtering out .planning/ commits — ready for code review"
- **`gsd-profile-user`** — "Generate developer behavioral profile and create Claude-discoverable artifacts"
- **`gsd-progress`** — "Check progress, advance workflow, or dispatch freeform intent — the unified GSD situational command"
- **`gsd-quick`** — "Execute a quick task with GSD guarantees (atomic commits, state tracking) but skip optional agents"
- **`gsd-resume-work`** — "Resume work from previous session with full context restoration"
- **`gsd-review`** — "Request cross-AI peer review of phase plans from external AI CLIs"
- **`gsd-review-backlog`** — "Review and promote backlog items to active milestone"
- **`gsd-secure-phase`** — "Retroactively verify threat mitigations for a completed phase"
- **`gsd-settings`** — "Configure GSD workflow toggles and model profile"
- **`gsd-ship`** — "Create PR, run review, and prepare for merge after verification passes"
- **`gsd-sketch`** — "Sketch UI/design ideas with throwaway HTML mockups, or propose what to sketch next (frontier mode)"
- **`gsd-spec-phase`** — "Clarify WHAT a phase delivers with ambiguity scoring; produces a SPEC.md before discuss-phase."
- **`gsd-spike`** — "Spike an idea through experiential exploration, or propose what to spike next (frontier mode)"
- **`gsd-stats`** — "Display project statistics — phases, plans, requirements, git metrics, and timeline"
- **`gsd-thread`** — "Manage persistent context threads for cross-session work"
- **`gsd-ui-phase`** — "Generate UI design contract (UI-SPEC.md) for frontend phases"
- **`gsd-ui-review`** — "Retroactive 6-pillar visual audit of implemented frontend code"
- **`gsd-ultraplan-phase`** — "[BETA] Offload plan phase to Claude Code's ultraplan cloud; review in browser and import back."
- **`gsd-undo`** — "Safe git revert. Roll back phase or plan commits using the phase manifest with dependency checks."
- **`gsd-update`** — "Update GSD to latest version with changelog display"
- **`gsd-validate-phase`** — "Retroactively audit and fill Nyquist validation gaps for a completed phase"
- **`gsd-verify-work`** — "Validate built features through conversational UAT"
- **`gsd-workspace`** — "Manage GSD workspaces — create, list, or remove isolated workspace environments"
- **`gsd-workstreams`** — "Manage parallel workstreams — list, create, switch, status, progress, complete, and resume"

### vast 系列 (51 个)

- **`vast-agent-skill-reviewer`** — 根据最佳实践审查代理技能（Agent Skill）目录和 SKILL.md 文件。当用户想要审查、验证或检查代理技能实现时使用此技能。
- **`vast-c4-architecture`** — Generate architecture documentation using C4 model Mermaid diagrams. Use when asked to create architecture diagrams, doc
- **`vast-claude-config-advisor`** — 审查或设计 Claude Code 项目配置。用于用户提到 `.claude`、`CLAUDE.md`、Claude 配置文件、项目级 Claude 自定义配置、配置结构是否合理、该创建哪些配置文件，或希望从零规划 Claude 配置时使用
- **`vast-code-review-expert`** — "以高级工程师的视角对当前的 git 变更进行专家级代码审查。检测 SOLID 原则违反、安全风险，并提出可行的改进建议。"
- **`vast-codex-cli`** — 编排 OpenAI Codex CLI 以进行并行任务执行。作为编排者，分析任务、注入上下文、管理会话并协调并行实例。当将编码任务委托给 Codex 或运行多代理工作流时使用。(user)
- **`vast-dev-arch-top`** — 提供具有五层结构（策略、功能、交互、数据模型、视觉）的项目开发宪法。在启动软件项目、定义架构或建立开发约束时使用。触发词：“项目开发”、“核心宪法”、“技术铁律”、“五层结构”
- **`vast-dev-brainstorming`** — "在任何创意工作（创建功能、构建组件、添加功能或修改行为）之前必须使用此技能。在实施前探索用户意图、需求和设计。"
- **`vast-dev-challenge`** — "跨模型对抗性验证。使用第二个 AI 模型来挑战你的分析、验证主张或审查代码。模式：挑战（寻找缺陷）、验证（事实核查）、审查（同行评审）。"
- **`vast-dev-code-reader`** — 当您想要深度理解一个陌生的代码库并从中生成可重用的认知技能时使用，通过提供本地路径或 GitHub URL。
- **`vast-dev-commit-as-prompt`** — 将 Git 提交转化为结构化 Prompt 上下文，帮助 AI 在代码审查、技术债评估或文档编写时快速理解变更的目标/动机/手段
- **`vast-dev-cross-verify`** — 7阶段高风险功能开发工作流，包含4轮独立交叉验证，在投入生产前捕获并发、幂等性和跨服务 bug。用于金融交易、订单/库存状态机、分布式锁、跨服务接口变更、在线 schema 迁移等高风险场景。触发词：'cross-verified'、'交叉
- **`vast-dev-dir-organizer`** — "整理和优化项目目录结构。当用户请求整理目录、分类文件、清理无用文件或重构文件夹结构时调用此技能。"
- **`vast-dev-kickoff`** — >
- **`vast-dev-kickoff-pua`** — "高代理开发循环引擎。强制执行完整的开发周期：规划 → 执行 → 代码审查 → 安全检查 → 验证 → Git 提交。内置 P0 护栏、失败压力升级机制以及用于自主执行的循环模式。"
- **`vast-dev-office-hours`** — |
- **`vast-dev-project-analyzer`** — 基于深度代码库分析生成全面的项目文档（白皮书），涵盖架构、模块、测试和部署。
- **`vast-dev-taste-checker`** — 使用 Linus Torvalds 的 “good taste” 哲学审查代码。消除防御性代码、特殊情况和深度嵌套。在审查代码质量、重构或检查代码异味时使用。
- **`vast-dev-workflow-auto`** — 自动化工作流编排，支持 CI/CD 配置、脚本生成、定时任务和 Git Hooks 设置。
- **`vast-draw-io`** — Use when the user requests diagrams, flowcharts, architecture diagrams, ER diagrams, UML / sequence / class diagrams, ne
- **`vast-draw-mermaid`** — Mermaid 图绘制助手。适用于用户明确要求绘制 Mermaid 图，或提到流程图、架构图、时序图、状态图、甘特图、ER 图、用户旅程图、类图，并希望直接输出 Mermaid 代码块时使用。会先判断最合适的图类型，再生成可渲染、结构清晰的
- **`vast-draw-tech-graph`** — >-
- **`vast-draw-thinking-logic`** — 将复杂信息转换为清晰的视觉思维模型。在理解复杂概念、可视化逻辑或创建结构化解释时使用。触发词：“思维导航”、“逻辑可视化”、“思维模型”、“概念图”
- **`vast-draw-visual-card-designer`** — 将长内容转换为逻辑模型或极简图形风格的竖屏卡片。在创建视觉摘要、社交媒体卡片或基于图表的内容时使用。触发词：“视觉卡片”、“逻辑模型”、“竖屏卡片”、“图解”
- **`vast-excalidraw`** — "Use when working with *.excalidraw or *.excalidraw.json files, user mentions diagrams/flowcharts, or requests architect
- **`vast-gemini-cli`** — 当用户希望 Claude Code 纯粹担任经理/架构师角色，而由 Gemini CLI 完成所有编码工作时，应使用此技能。Claude Code 像对待实习生一样驱动 Gemini —— 发布任务、审查输出、要求修复 —— 但从不亲自编写
- **`vast-karpathy-guidelines`** — 减少常见 LLM 编码错误的行为准则。用于编写、审查或重构代码时，避免过度复杂化、执行精准修改、暴露假设前提，以及定义可验证的成功标准。
- **`vast-khazix-hv-analysis`** — |
- **`vast-khazix-neat-freak`** — >
- **`vast-learning-builder`** — Create personalized learning tutorials from a learner profile and authority-first research. Use when the user wants a gu
- **`vast-markdown-proxy`** — |
- **`vast-marp-slide`** — Create professional Marp presentation slides with 7 beautiful themes (default, minimal, colorful, dark, gradient, tech, 
- **`vast-md-summarizer`** — "分析和总结指定的本地 Markdown 文件，并输出结构化的中文总结。当用户请求总结、分析或提取本地 Markdown 文档信息时调用此技能。"
- **`vast-md-translator`** — "将指定的本地 Markdown 文件翻译成指定语言（默认中文），并在文件名中添加语言标识后缀。当用户请求翻译本地 Markdown 文档时调用此技能。"
- **`vast-mentor`** — "渐进式学习导师。帮助用户逐步学习书籍章节内容，像私人家庭教师一样通过自然对话推进教学。触发场景：'学习第三章'、'帮我消化这部分'、'讲讲这个概念'、'我不太懂这里'、'这个知识点什么意思'、'教我学这门课'、'带我读一下这本书'、'逐步
- **`vast-pm-prd-design-expert`** — '根据用户故事创建产品需求规格文档。在编写 PRD、定义产品功能或将用户故事转换为规格说明时使用。触发词：“产品需求”、“PRD”、“需求规格说明书”、“用户故事”'
- **`vast-pm-prd-writer`** — |
- **`vast-pm-product-describer`** — |
- **`vast-pm-roadmap-planner`** — |
- **`vast-pragmatic-clean-code-reviewer`** — >
- **`vast-prompt-compiler`** — "Prompt 设计编译器 - 将用户原始需求编译为可指导 Prompt 写作的设计方案。通过 10 步流程识别问题原型、路由学科领域、诊断能力缺口、召回并验证高信息密度知识对象，最终输出轻量 Prompt 骨架。使用场景：写 Prompt
- **`vast-skill-forge`** — "Create high-quality, production-grade skills for Claude Code. Expert guidance on skill architecture, workflow design, p
- **`vast-skill-optimizer`** — 优化和重构现有 skill。用于检查目标 skill 的触发描述、SKILL.md 工作流、确认门槛、渐进式披露，以及 references/scripts/assets 的组织方式。当用户提到”优化 skill””检查 skill 质量”
- **`vast-skill-recommend-add`** — 向 vast-skill-recommender 的内置推荐列表添加新技能，并同步安装到全局 skills 目录。触发词：登记推荐技能、添加内置推荐、推荐新技能。
- **`vast-skill-recommender`** — '维护技能推荐列表。支持添加、删除、更新、查看技能推荐，类似 sanyuan-skills 的技能展示。触发词: /skill-recommend、"技能推荐"、"添加技能"、"删除技能"、"更新技能"'
- **`vast-skill-review`** — "Quality review and audit for Claude Code skills. Analyzes skill structure, description quality, workflow design, token 
- **`vast-social-xhs-card`** — 将长内容转换为小红书/Instagram 风格的视觉卡片。在创建社交媒体卡片系列、知识卡片或小红书视觉内容时使用。触发词：“小红书卡片”、“系列卡片”、“视觉卡片”、“4:5画布”
- **`vast-social-xhs-content-script`** — 通过多轮对话生成小红书爆款文案和 2 分钟口播脚本。在创建小红书内容、分析爆款元素或撰写高参与度帖子时使用。触发词：“小红书爆款”、“爆款文案”、“口播脚本”、“小红书流量”
- **`vast-trading-cognitive-guardrails`** — 防止 AI 只挑你爱听的说。当你询问投资相关问题（买入/卖出/持有/分析）时自动激活。触发于股票代码、投资组合持仓或目标价，以确保客观、方向中立的财务分析。
- **`vast-universal-system-prompt`** — 为高级 AI 助手提供量子织锦认知引擎框架。当用户需要深度多维思考、跨概念模式识别或想要激活全面的认知协议时使用。触发词：“量子织锦”、“认知引擎”、“深度思考”、“系统初始化”
- **`vast-work-daily-reviewer`** — 每日工作回顾与洞察分析，对用户前一天的对话历史和使用数据进行总结与建议
- **`vast-work-deep-reviewer`** — 深度工作分析与项目洞察，从更长时间维度分析工作模式、项目进展和技术方向

### 宝玉 (baoyu) (21 个)

- **`baoyu-article-illustrator`** — Analyzes article structure, identifies positions requiring visual aids, generates illustrations with Type × Style × Pale
- **`baoyu-comic`** — Knowledge comic creator supporting multiple art styles and tones. Creates original educational comics with detailed pane
- **`baoyu-compress-image`** — Compresses images to WebP (default) or PNG with automatic tool selection. Use when user asks to "compress image", "optim
- **`baoyu-cover-image`** — Generates article cover images with 5 dimensions (type, palette, rendering, text, mood) combining 11 color palettes and 
- **`baoyu-danger-gemini-web`** — Generates images and text via reverse-engineered Gemini Web API. Supports text generation, image generation from prompts
- **`baoyu-danger-x-to-markdown`** — Converts X (Twitter) tweets and articles to markdown with YAML front matter. Uses reverse-engineered API requiring user 
- **`baoyu-format-markdown`** — Formats plain text or markdown files with frontmatter, titles, summaries, headings, bold, lists, and code blocks. Use wh
- **`baoyu-image-cards`** — Generates infographic image card series with 12 visual styles, 8 layouts, and 3 color palettes. Breaks content into 1-10
- **`baoyu-image-gen`** — AI image generation with OpenAI, Azure OpenAI, Google, OpenRouter, DashScope, MiniMax, Jimeng, Seedream and Replicate AP
- **`baoyu-imagine`** — AI image generation with OpenAI, Azure OpenAI, Google, OpenRouter, DashScope, MiniMax, Jimeng, Seedream and Replicate AP
- **`baoyu-infographic`** — Generates professional infographics with 21 layout types and 21 visual styles. Analyzes content, recommends layout×style
- **`baoyu-markdown-to-html`** — Converts Markdown to styled HTML with WeChat-compatible themes. Supports code highlighting, math, PlantUML, footnotes, a
- **`baoyu-post-to-wechat`** — Posts content to WeChat Official Account (微信公众号) via API or Chrome CDP. Supports article posting (文章) with HTML, markdow
- **`baoyu-post-to-weibo`** — Posts content to Weibo (微博). Supports regular posts with text, images, and videos, and headline articles (头条文章) with Mar
- **`baoyu-post-to-x`** — Posts content and articles to X (Twitter). Supports regular posts with images/videos and X Articles (long-form Markdown)
- **`baoyu-slide-deck`** — Generates professional slide deck images from content. Creates outlines with style instructions, then generates individu
- **`baoyu-translate`** — Translates articles and documents between languages with three modes - quick (direct), normal (analyze then translate), 
- **`baoyu-url-to-markdown`** — Fetch any URL and convert to markdown using baoyu-fetch CLI (Chrome CDP with site-specific adapters). Built-in adapters 
- **`baoyu-xhs-images`** — "DEPRECATED: Migrated to baoyu-image-cards. Generates Xiaohongshu (Little Red Book) infographic series with 11 visual st
- **`baoyu-youtube-transcript`** — Downloads YouTube video transcripts/subtitles and cover images by URL or video ID. Supports multiple languages, translat
- **`gemini-web-image`** — 使用 Gemini Web 生图的包装 skill。面向 vibe-writer 的配图流程，内部依赖全局 skill `baoyu-danger-gemini-web`，适用于 Gemini Web 登录态可用、希望直接用 Gemini 

### gstack 基础 (8 个)

- **`benchmark`** — Performance regression detection using the browse daemon. (gstack)
- **`benchmark-models`** — Cross-model benchmark for gstack skills. (gstack)
- **`browse`** — Fast headless browser for QA testing and site dogfooding. (gstack)
- **`canary`** — Post-deploy canary monitoring. (gstack)
- **`gstack`** — Router for the gstack skill suite. (gstack)
- **`gstack-upgrade`** — Upgrade gstack to the latest version.
- **`open-gstack-browser`** — Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in.
- **`setup-browser-cookies`** — Import cookies from your real Chromium browser into the headless browse session. (gstack)

### huashu-design / 设计类 (6 个)

- **`design-an-interface`** — Generate multiple radically different interface designs for a module using parallel sub-agents. Use when user wants to d
- **`design-consultation`** — "Design consultation: understands your product, researches the landscape, proposes a complete design system (aesthetic, 
- **`design-html`** — "Design finalization: generates production-quality Pretext-native HTML/CSS. (gstack)"
- **`design-review`** — "Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interacti
- **`design-shotgun`** — "Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate
- **`huashu-design`** — 花叔Design（Huashu-Design）——用HTML做高保真原型、交互Demo、幻灯片、动画、设计变体探索+设计方向顾问+专家评审的一体化设计能力。HTML是工具不是媒介，根据任务embody不同专家（UX设计师/动画师/幻灯片设计

### gstack 计划类 (5 个)

- **`plan-ceo-review`** — CEO/founder-mode plan review. (gstack)
- **`plan-design-review`** — Designer's eye plan review — interactive, like CEO and Eng review. (gstack)
- **`plan-devex-review`** — Interactive developer experience plan review. (gstack)
- **`plan-eng-review`** — Eng manager-mode plan review. (gstack)
- **`plan-tune`** — "Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). (gstack)"

### Claude Code (5 个)

- **`setup-deploy`** — Configure deployment settings for /land-and-deploy.
- **`setup-gbrain`** — "Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, captur
- **`setup-matt-pocock-skills`** — Configure this repo for the engineering skills — set up its issue tracker, triage label vocabulary, and domain doc layou
- **`setup-pre-commit`** — Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user w
- **`setup-ts-deep-modules`** — Wire dependency-cruiser into a TypeScript repo so each package is a deep module — implementation hidden in subfolders, r

### 调试/调查 (4 个)

- **`careful`** — Safety guardrails for destructive commands. (gstack)
- **`diagnose`** — Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument → 
- **`diagnosing-bugs`** — Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports som
- **`investigate`** — Systematic debugging with root cause investigation. (gstack)

### 上下文/文档 (4 个)

- **`context-restore`** — Restore working context saved earlier by /context-save. (gstack)
- **`context-save`** — Save working context. (gstack)
- **`doc-coauthoring`** — Guide users through a structured workflow for co-authoring documentation, articles, or long-form content. Use when user 
- **`docs-pipeline`** — |

### 内容编辑 (3 个)

- **`article-batch-illustration`** — 分析文章结构并批量生成AI配图，调用Gemini API为每个段落创建专业逻辑图/概念图。当用户说"批量配图"、"给文章配图"、"生成文章插图"、"为这篇文章配图"时触发。支持两种风格：简约手绘风和建筑蓝图编辑风。自动保存到Obsidian
- **`article-review`** — 根据原文内容撰写深度文章评价/解读。当用户提供一篇文章、博客、公众号文章或任何长文内容，并要求生成评价、解读、读后感或二次创作内容时使用此技能。适用于：(1) 对技术文章、行业分析、年终总结等进行深度解读，(2) 提炼文章核心观点并用通俗语
- **`edit-article`** — Edit and improve articles by restructuring sections, improving clarity, and tightening prose. Use when user wants to edi

### Auto review (3 个)

- **`autoplan`** — Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with a
- **`batch-grill-me`** — A relentless interview that asks every frontier question at once, round by round.
- **`retrospective-codify`** — 'Pair "what failed first" with "what finally worked" and codify the should-have-known-it insight as an ast-grep rule, a 

### Claude 工具 (3 个)

- **`claude-handoff`** — Hand the current conversation off to a fresh background agent that picks up the work immediately.
- **`claude-to-im`** — |
- **`connect-chrome`** — Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in.

### Review 类 (3 个)

- **`code-review`** — Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes — Standards (does the code fo
- **`devex-review`** — Live developer experience audit. (gstack)
- **`review`** — Pre-landing PR review. (gstack)

### gstack 流程 (3 个)

- **`land-and-deploy`** — Land and deploy workflow. (gstack)
- **`landing-report`** — Read-only queue dashboard for workspace-aware ship. (gstack)
- **`ship`** — "Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create

### 学习/规范 (2 个)

- **`chinese-copywriting-guidelines`** — "中文文案排版规范检查与修复。统一中文、英文、数字、标点符号的排版用法,降低沟通成本。Actions: 检查、修复、审查、校对、格式化中文排版、文案排版、排版规范、排版问题。当用户说'检查排版'、'修复排版'、'中文排版'、'文案排版'、'
- **`learn`** — Manage project learnings.

### Codex CLI (2 个)

- **`codex`** — OpenAI Codex CLI wrapper — three modes. (gstack)
- **`codex-image`** — "AI image generation via Codex CLI (ChatGPT Plus). Requires Codex.app (or codex.exe) installed and logged into a ChatGPT

### 健康检查 (2 个)

- **`health`** — Code quality dashboard. (gstack)
- **`health-podcast-rewriter`** — 

### huashu (花书) (2 个)

- **`huashu-bookwriter`** — |
- **`huashu-nuwa`** — |

### QA (2 个)

- **`qa`** — Interactive QA session where user reports bugs or issues conversationally, and the agent files GitHub issues. Explores t
- **`qa-only`** — Report-only QA testing. (gstack)

### Agnes AI (1 个)

- **`agnes-image-gen`** — "Agnes AI 图像生成。基于 agnes-image-2.1-flash 模型，支持文生图、图生图、多图合成。当用户想生成图片、画图、做图、AI 绘图、文生图、图生图、风格转换、图片编辑、生成海报/封面/配图/插画/产品图/壁纸/头像

### Matt 路由器 (1 个)

- **`ask-matt`** — Ask which skill or flow fits your situation. A router over the skills in this repo.

### 仓颉 (cangjie) (1 个)

- **`cangjie-skill`** — Distill a book into a coherent set of executable skills. Use when the user asks to "拆书" / "蒸馏一本书" / "把 XX 书做成 skill" / "

### cangjie/canary (1 个)

- **`cso`** — Chief Security Officer mode. (gstack)

### frontend-design 内置 (1 个)

- **`frontend-design`** — Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to 

### guizang (桂藏) (1 个)

- **`guizang-ppt-skill`** — 生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板。提供两种风格：① "电子杂志 × 电子墨水"（衬线 + 流体背景 + 暖色） ② "瑞士国际主义"（无衬线 + 网格点阵 + IKB

### office-hours (1 个)

- **`office-hours`** — YC Office Hours — two modes. (gstack)

### 回顾/办公 (1 个)

- **`retro`** — Weekly engineering retrospective. (gstack)

### Skill 工具 (1 个)

- **`skill-manage`** — 管理 skill 的全生命周期。当用户说"整理 skill"、"分类 skill"、"同步 skill"、"推送 skill"、"扫描 skill"、"列出 skill"时触发。支持扫描、分类、同步到 GitHub、跨设备备份等操作。

### Spec / 计划 (1 个)

- **`spec`** — Turn vague intent into a precise, executable spec in five phases. (gstack)

### 配置/同步 (1 个)

- **`sync-gbrain`** — Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. Wraps the gstack-gbrain-sync o

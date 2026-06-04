---
title: "Wiki Log"
date: "2026-05-29"
source: "llm-wiki"
---

# Wiki Log — 只追加的时间记录

> 所有 ingest、query、lint 操作记录在此。
> 格式：`## [YYYY-MM-DD] 操作类型: 简要描述`

---

## [2026-05-29] init: 初始化 wiki 结构

- 创建 `docs/md/wiki/` 目录结构（concepts/、products/、patterns/、comparisons/、entities/、summaries/、synthesis/、sources/）
- 创建 `docs/md/wiki/index.md`（分类索引 + 当前知识体系概览）
- 创建 `docs/md/wiki/log.md`（本文件）
- 注入 schema 约定到本项目 AGENTS.md
- 首期收录：llm-wiki 模式本身 + 3 个核心插件 + 2 个专栏入口
- 后续来源：公众号抓取、skill 蒸馏、HV 分析报告

## [2026-06-03] ingest: Pensieve 知识库归档

- 创建 `columns/agentic-engineer/pensieve/` 目录（含 index.md 入口）
- 将 `columns/agentic-engineer/11-pensieve-architecture.md` 移入 `columns/agentic-engineer/pensieve/pensieve-architecture.md`（Pensieve 架构深度分析）
- Pensieve 四层架构：sources/（原始原文）、summaries/（精读摘要）、concepts/（知识页）、artifacts/（产出物）
- 更新 wiki/index.md 分类索引

## [2026-06-01] ingest: 让AI站在我全部数据上

- 归档《让AI站在我全部数据上》公众号长文至 sources/ai-local-brain.md（原始原文）
- 精读摘要写入 summaries/ai-local-brain.md
- 知识提炼写入 concepts/ai-local-brain.md（Wiki概念页）
- 下载 6 张配图至 images/ai-local-brain/
- 内容摘要：Obsidian本地知识库 + 常驻Mac + 微信/Codex Mobile/Obsidian Sync三入口 + Skill系统，四层架构实现AI持续帮我
- 注：sources/ = 原始原文（不可变），summaries/ = 精读摘要（LLM重写），concepts/ = 提炼知识页

## [2026-06-04] ingest: Auto-PPT Harness 分析

- 归档 GitHub Auto-PPT 仓库至 sources/auto-ppt-harness.md
- 内容摘要：React 代码写 PPT 的 Harness，一仓库多套 PPT，Annotated 三字段，固定 1920×1080 画布，双反馈循环（Content loop + Layout loop），28 Stars
- 分类：products/

## [2026-06-04] ingest: Claude Cookbooks 官方菜谱集

- 归档 GitHub claude-cookbooks 至 sources/claude-cookbooks.md
- 内容摘要：Anthropic 官方 Claude 使用菜谱，Jupyter Notebook 示例，44.9k Stars，涵盖 Tool Use、RAG、Multi-modal、Prompt Caching 等
- 分类：resources/

## [2026-06-04] ingest: AI 研发自动化 Wiki+Skill 包

- 归档公众号《AI研发自动化：Wiki知识库+技能包》至 sources/ai-rd-automation-wiki-skill.md
- 32 张配图本地化至 images/ai-rd-automation-wiki-skill/（3MB）
- 精读摘要写入 summaries/ai-rd-automation-wiki-skill.md
- 知识提炼写入 concepts/ai-rd-automation-wiki-skill.md（与 [[llm-wiki]]/[[harness-engineering]]/[[ai-local-brain]] 关联）
- 内容摘要：阿里哥伦实战——LLM-Wiki + 6 大领域 Skill（写方案/写代码/评审/测试/答疑/排障）+ Harness 规则体系（门禁/编排/护栏/回滚），目标"用户给 PRD，剩下全交给 agent"
- AGENTS.md 同步新增"稍后读"流程规范（触发词/文件/格式/反例）

## [2026-06-04] ingest: 40 种顶级思维模型

- 归档掘金《40种顶级思维模型》至 sources/40-thinking-models.md
- 41 张配图本地化至 images/40-thinking-models/（1MB）
- 内容摘要：40 个模型分 8 大能力模块（学习力 6/思考力 4/创造力 5/设计力 5/共情力 5/故事力 5/领导力 5/整合力 5），每个给"一句话应用"
- 分类：思维模型/

## [2026-06-04] fix: sidebar.js extractTitle 读取 frontmatter title

- P0 修复：`docs/.vitepress/sidebar.js` 的 `extractTitle()` 改为优先读 frontmatter title，其次 H1，最后 fallback 文件名
- 影响：22/47 个无 H1 文件的侧边栏标题立刻显示 frontmatter 工整标题（如 `(第二章 抽象）.md` → `(第二章 抽象）`）
- 待办：P1 清理 4 组同名重复文件 + P2 命名规范化

## [2026-06-04] ingest: MyCC AI 研究机器（四层架构）

- 归档 X 推文「MyCC」至 sources/mycc-notebooklm-obsidian.md
- 内容摘要：Claude Code + NotebookLM + Obsidian 四层研究流水线，执行层/定制层/分析层/记忆层，30 分钟搭建，越用越懂你
- 分类：patterns/

## [2026-06-04] ingest: COSS UI + HeroUI 组件库对比

- 归档 X 推文「两个比 shadcn/UI 更漂亮的组件库」至 sources/coss-heroui.md
- 内容摘要：COSS UI（Base UI，简洁考究，484 Particles）+ HeroUI（React Aria，色彩鲜艳，theme 丰富，MCP + Agent Skills）
- 分类：products/

## [2026-06-04] ingest: LLM Wiki 产品深入分析

- 归档 X 推文「登记资源：LLM Wiki」至 sources/llm-wiki-product.md
- 下载 3 张配图至 images/llm-wiki/（logo.jpg、overview.jpg、llm_wiki_arch.jpg）
- 内容摘要：Karpathy 方法论工程化实现，跨平台桌面应用，两步 Chain-of-Thought 入库，4 信号知识图谱 + Louvain 社区发现，Deep Research + Chrome 剪藏，本地 HTTP API + Agent Skill，Obsidian 零迁移
- 10.3k Stars，1.3k Forks，v0.4.19

## [2026-06-04] ingest: GenericAgent 自我进化 Agent 框架

- 归档 GitHub GenericAgent 至 sources/genericagent.md
- 内容摘要：3K 行种子代码，9 原子工具，~100 行 Agent Loop，5 层记忆系统，自主固化为 Skill，6x Token 节省，12.5k Stars
- 分类：concepts/

## [2026-06-04] ingest: DDD Harness Microservices 样板

- 归档 GitHub ddd-harness-microservices 至 sources/ddd-harness-microservices.md
- 内容摘要：Java 11 / Spring Boot + Vite / Vue 3 全栈，DDD 四层架构（adapter/application/domain/infrastructure），service-bff + service-base + service-domain-demo
- 分类：patterns/
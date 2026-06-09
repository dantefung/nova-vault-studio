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

## [2026-06-04] ingest: Yao Open Skills 公开 Skill 合集

- 归档 GitHub yao-open-skills 至 sources/yao-open-skills.md
- 内容摘要：OpenYao Skill 合集，1.1k Stars，yao-expert-skill（行业学习）、yao-crux-skill（主次矛盾）、yao-bayesian-skill（贝叶斯决策）等
- 分类：patterns/

## [2026-06-04] ingest: ky-design-to-html 视觉还原 Skill

- 归档 GitHub ky-design-to-html-skill 至 sources/ky-design-to-html-skill.md
- 内容摘要：UI 截图转 HTML/CSS，拆解→资产分离→画布适配→截图验证→误差修正，57 Stars
- 分类：patterns/

## [2026-06-04] ingest: weread-exporter 微信读书全本导出

- 归档 GitHub weread-exporter 至 sources/weread-exporter.md
- 内容摘要：Playwright + Canvas fillText Hook 提取微信读书全本正文（含付费书），输出 Markdown，47 Stars
- 分类：products/

## [2026-06-04] ingest: 5 个 AI UI 设计 Skill

- 归档 GitHub 5 个项目至 sources/
  - taste-skill.md：AI 前端防丑 Skill 合集，34.1k Stars，三档旋钮（VARIANCE/MOTION/DENSITY）
  - web-designer-plugin.md：48 个 Award 级设计模式，参考 38 个优秀网站，43 Stars
  - emil-kowalski-skill.md：UI 细节打磨，交互/动效/组件状态精致化，2.1k Stars
  - magic-slide.md：HTML 演示稿生成，Magic Move 平滑转场，PipeLLM 图生，147 Stars
  - awesome-design-md.md：72+ 品牌 DESIGN.md 集合，AI 按风格生成界面，87.8k Stars
- 分类：patterns/

## [2026-06-04] ingest: guizang-social-card-skill 小红书图文/公众号封面对

- 归档 GitHub guizang-social-card-skill 至 sources/guizang-social-card-skill.md
- 内容摘要：Claude Code / Codex 小红书图文 + 公众号封面对生成，Editorial × Swiss 双视觉系统，28 版式骨架，10 主题预设，3k Stars
- 分类：patterns/

## [2026-06-04] ingest: skillshare 跨平台 Skills 同步管理

- 归档 GitHub skillshare 至 sources/skillshare.md
- 内容摘要：一个命令同步 Skills 到 60+ AI CLI 平台（Claude Code/Codex/OpenClaw/OpenCode 等），内置安全审计，2.1k Stars
- 分类：patterns/

## [2026-06-04] ingest: ai-website-cloner-template AI 网站克隆模板

- 归档 GitHub ai-website-cloner-template 至 sources/ai-website-cloner-template.md
- 内容摘要：输入 URL 用 AI 克隆网站为 Next.js 代码，/clone-website 单命令，Reconnaissance→Component Specs→Parallel Build→QA，16.4k Stars
- 分类：patterns/

## [2026-06-04] ingest: go-stock AI 赋能股票分析工具

- 归档 GitHub go-stock 至 sources/go-stock.md
- 内容摘要：AI 赋能股票分析，市场/个股情绪分析，AI 热点资讯分析，K线技术指标，支持 A股/港股/美股，6.1k Stars
- 分类：products/

## [2026-06-04] ingest: AiToEarn AI 全自动自媒体内容变现平台

- 归档 GitHub AiToEarn 至 sources/aitoearn.md
- 内容摘要：AI 内容生产 + 全平台分发（抖音/小红书/B站/TikTok 等）+ 自动互动运营 + CPS/CPM 变现，Monetize/Publish/Engage/Create 四大 Agent，18.2k Stars
- 分类：products/

## [2026-06-04] ingest: geju（格局）Skill，专治 Codex 过度谨慎

- 归档 hai-stack/geju Skill 至 sources/geju-skill.md
- 内容摘要：专治 Codex "苟帝"综合征，8 种打开格局打法（从终局倒推/零历史包袱/杀错误概念/十倍问题/反向约束等），触发词「格局打开」，48 Stars（hai-stack）
- 分类：patterns/

## [2026-06-04] ingest: flipbook-app，点击探索 AI 生成知识树

- 归档 GitHub flipbook-app 至 sources/flipbook-app.md
- 内容摘要：长按图片任意位置，系统联网搜索相关内容，生成带标注的子图，层层递进，无限探索；支持 OpenAI/Nano Banana/Seedream 多图生引擎，语音叙事，静态网站导出，142 Stars
- 分类：products/

## [2026-06-06] ingest: Serenity 白发女股神 Skill 合集（7 个仓库）

- 归档 7 个 Serenity 相关 GitHub 仓库至 sources/
  - stock-skill：三人美股框架合议（Serenity 卡脖子 × TraderS 宏观 × 恨铁技术执行），16 Stars
  - serenity-aleabitoreddit：完整推文档案（5813 条推文 + 4 篇 X 长文）+ 供应链卡点 Skill，112 Stars
  - serenity-skill-0xagata：粉丝站，4740 条推文，Claude Project + ChatGPT 双入口，14 Stars
  - serenity-aleabitoreddit-skill：卡点投资分析技能，多 Agent 多市场适用，23 Stars
  - serenity-skill-zad：供应链卡点逆向投资方法论，Claude Code 专用，2071 条推文提炼，15 Stars
  - serenity-skills-xvhaoran：跨市场版（A股/美股/港股/台股/日股/欧洲），贝叶斯更新框架，7 Stars
  - serenity-stock-choke：A 股适配版，六步推理链路，12 Stars
- 内容摘要：Serenity（@aleabitoreddit，白发女股神）供应链卡脖子投资框架，45 倍 YTD 自述，从 Reddit WSB 散户到 50 万粉丝，AI 半导体/光通信/CPO 供应链逆向分析
- 分类：patterns/

## [2026-06-06] ingest: muxuuu/serenity-skill，第 8 个 Serenity Skill，356 Stars（Stars 最多版）

- 归档 GitHub muxuuu/serenity-skill 至 sources/serenity-skill-muxuuu.md
- 内容摘要：Serenity 式供应链卡点股票研究 Agent Skill，中文优先，356 Stars，支持 Codex/Claude Code/Hermes/OpenClaw 等，从热点拆解产业链到优先研究清单，完整研究流水线
- 分类：patterns/

## [2026-06-06] ingest: ComposioHQ/awesome-codex-skills，Codex Skills 精选列表，13k Stars

- 归档 GitHub ComposioHQ/awesome-codex-skills 至 sources/awesome-codex-skills.md
- 内容摘要：Codex Skills 精选列表，40+ Skills 覆盖开发/协作/写作/数据分析，13k Stars，1.3k Forks，Composio 出品，每个 Skill 独立安装
- 分类：patterns/

## [2026-06-06] ingest: cclank/cell-architecture-studio，3D 细胞结构交互画廊

- 归档 GitHub cclank/cell-architecture-studio 至 sources/cell-architecture-studio.md
- 内容摘要：React + Three.js 3D 细胞结构画廊，7 种细胞类型，高保真 GLB 模型，AI Tutor 面板，对比模式，1k Stars，224 Forks
- 分类：products/

## [2026-06-07] ingest: 广州工业品店群实战文章

- 归档公众号文章《搞副业最猛的城市：广州》至 sources/guangzhou-industrial-ecommerce.md
- 内容摘要：广州工业品店群实战，采集+代发+工厂场景，从"出租屋一周没咨询"到"一个人管20个店"，番禺农机/花都工程材料/白云小型机械供应链路由
- 分类：patterns/

## [2026-06-07] report: 一件代发（Dropshipping）商业模式横纵分析报告

- 输出位置：business/business-models/dropshipping.md（从 wiki/商业分析/案例专栏/ 迁移）
- 内容摘要：全球 dropshipping 从邮购时代到店群时代的完整纵向（1990s-2026），三段模式横向对比（全球版 vs 无货源店群 vs 广州工业品），横纵交汇产出三个未来剧本（红海持续/降维打击/品牌化出路）
- 关联：guangzhou-industrial-ecommerce.md（广州案例为一件代发的中国进化版）
- 分类：商业分析/

## [2026-06-08] ingest: jackwener/wx-cli，微信本地数据 CLI

- 归档 GitHub jackwener/wx-cli 至 sources/wx-cli.md
- 内容摘要：微信本地数据 CLI 工具，Rust 实现，内存扫描提取 SQLCipher 4 密钥解密，支持会话/聊天记录/搜索/联系人/群成员/朋友圈/公众号文章/收藏/统计/导出，零依赖跨平台，3.3k Stars，AI Agent Skill 支持
- 分类：products/

## [2026-06-08] ingest: bingshuoguo/linus-torvalds-skills，Linus 式工程品味 Skill

- 归档 GitHub bingshuoguo/linus-torvalds-skills 至 sources/linus-torvalds-skills.md
- 内容摘要：Linus Torvalds 工程品味 AI Skill，四大原则（好品味/永不破坏用户空间/实用主义/极度求简），Claude Code/Cursor/Codex 通用，5 Stars
- 分类：patterns/

## [2026-06-08] ingest: inhai-wiki/video-highlight-skill，AI 视频高光剪辑 Skill

- 归档 GitHub inhai-wiki/video-highlight-skill 至 sources/video-highlight-skill.md
- 内容摘要：AI 视频高光 Skill，FFmpeg 剪辑 + SRT 字幕 + YouTube 风格回顾页，支持会议/课程/直播/短视频，7 Stars
- 分类：products/

## [2026-06-08] wiki-ingest: claude-skills

- 从 sources/top-claude-skills-ui-ux-engineers.md 提炼概念页 concepts/claude-skills.md
- 核心概念：Claude Skills 生态扩展机制，渐进式加载、可执行代码、跨平台移植
- 更新 index.md 新增 claude-skills 条目

## [2026-06-08] ingest: Code X LOF 基金套利实战

- 归档《被裁了，用Code X做了个赚钱工具》微信公众号至 sources/code-x-lof-arbitrage.md
- 内容摘要：被裁程序员用 AI 工具（Code X）9 分钟完成全栈 LOF 基金溢价率监控工具，揭示 AI 对初级开发者的替代威胁，提出 AI 失业基金会等社会解决方案
- 分类：vibe-coding/

## [2026-06-08] wiki-ingest: ai-finance-tool-dev

- 从 sources/code-x-lof-arbitrage.md 提炼模式页 patterns/ai-finance-tool-dev.md
- 核心模式：AI 辅助金融量化工具开发，知识导入→自动抓取→实时计算→语音迭代
- 更新 index.md 新增 ai-finance-tool-dev 条目

## [2026-06-08] ingest: 企业级知识库检索优化

- 归档《知识库检索不准？看我们是如何做的》微信公众号至 guide/ai/intelligent-customer-service/19-rag-knowledge-base-optimization.md
- 内容摘要：企业非结构化数据检索痛点，从传统 RAG 到 Graph RAG 的演进方案，含数据清洗、索引构建、查询精排全流程
- 分类：intelligent-customer-service/

## [2026-06-08] ingest: 用 Claude Code 建站

- 归档《不写代码，嘴喷AI6小时后，我也能建站了？！》微信公众号至 sources/claude-code-build-site.md
- 内容摘要：非程序员用 Claude Code 6 小时完成 SEO 建站全流程：需求挖掘→产品文档→设计优化→SEO 布局→部署上线
- 分类：vibe-coding/

## [2026-06-08] wiki-ingest: claude-code-build-site

- 从 sources/claude-code-build-site.md 提炼概念页 concepts/claude-code-build-site.md
- 核心概念：用 Claude Code 建站，非程序员 6 小时完成 SEO 建站全流程
- 更新 index.md 新增 claude-code-build-site 条目

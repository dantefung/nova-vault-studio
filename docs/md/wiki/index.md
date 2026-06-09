---
title: "LLM Wiki 索引"
date: "2026-05-29"
source: "llm-wiki"
---

# LLM Wiki — Nova Vault Studio 知识库

> 持久化、复利的知识库，由 LLM 维护——每次查询不是重新推导，而是从已有知识中合成。

---

## 关于本 wiki

本文档站（nova-vault-studio）是 AI 编程、Agent 工程、Vibe Writing 等领域的内容集散地。
`llm-wiki` 模式将这些内容从"一次性消费"变为"可持续复利的知识资产"。

---

## 目录结构

```
wiki/
├── index.md              # 内容目录（链接 + 一句话摘要）
├── log.md               # 只追加的时间记录
├── sources/             # 原始文档（不可变）
└── pages/               # LLM 生成的知识页面
    ├── entities/       # 命名实体（人、公司、产品）
    ├── concepts/        # 抽象概念、理论、框架
    ├── summaries/        # 每篇来源的摘要页
    └── synthesis/       # 跨来源综合、论点、对比
```

---

## 分类索引

### 核心框架 (Core Frameworks)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [llm-wiki](/wiki/pages/concepts/llm-wiki) | 持久化、复利的知识库模式 | skill |
| [prompt-context-harness](/wiki/pages/concepts/prompt-context-harness) | Prompt→Context→Harness 工程进化论 | 文章 |
| [agentic-engineer](/wiki/pages/concepts/agentic-engineer) | Agent 工程架构全链路 | 专栏 |

### 工具与技能 (Tools & Skills)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [claude-skills](/wiki/concepts/claude-skills) | Claude 生态扩展机制，渐进式加载、可执行代码、跨平台移植 | 文章 |
| [claude-code-setup](/wiki/pages/concepts/claude-code-setup) | 官方插件，扫描代码库推荐自动化配置 | 插件 |
| [opencode-cc-adapter](/wiki/pages/concepts/opencode-cc-adapter) | 桥接 Claude Code 生态到 OpenCode | 插件 |
| [oh-my-claudecode](/wiki/pages/concepts/oh-my-claudecode) | Claude Code 超集工作流框架 | skill |
| [pensieve](/columns/agentic-engineer/pensieve) | 自增长的 AI Agent 项目知识库，四层结构化记忆 | 项目 |
| [llm-wiki-product](/wiki/sources/llm-wiki-product) | Karpathy 方法论工程化实现，10.3k Stars 跨平台知识库 | X |
| [auto-ppt-harness](/wiki/sources/auto-ppt-harness) | React 代码写 PPT 的 Harness，双反馈循环驱动 | GitHub |
| [claude-cookbooks](/wiki/sources/claude-cookbooks) | Anthropic 官方 44.9k Stars 菜谱集，Jupyter Notebook 示例 | GitHub |
| [mycc-notebooklm-obsidian](/wiki/sources/mycc-notebooklm-obsidian) | Claude Code + NotebookLM + Obsidian 四层研究流水线 | X |
| [coss-heroui](/wiki/sources/coss-heroui) | 比 shadcn/UI 更漂亮的两款 React 组件库 | X |
| [genericagent](/wiki/sources/genericagent) | 3K 行代码自我进化 Agent，6x Token 节省，12.5k Stars | GitHub |
| [ddd-harness-microservices](/wiki/sources/ddd-harness-microservices) | Java/Spring Boot DDD 四层架构微服务样板 | GitHub |
| [yao-open-skills](/wiki/sources/yao-open-skills) | OpenYao Skill 合集：yao-expert/贝叶斯/博弈论等，1.1k Stars | GitHub |
| [ky-design-to-html](/wiki/sources/ky-design-to-html-skill) | UI 截图转 HTML/CSS 视觉还原，截图验证修正，57 Stars | GitHub |
| [weread-exporter](/wiki/sources/weread-exporter) | 微信读书全本导出，付费书可用，Playwright + Canvas Hook，47 Stars | GitHub |
| [taste-skill](/wiki/sources/taste-skill) | AI 前端防丑 Skill 合集，三档设计旋钮，34.1k Stars | GitHub |
| [web-designer-plugin](/wiki/sources/web-designer-plugin) | 48 个 Award 级设计模式，决策框架，43 Stars | GitHub |
| [emil-kowalski-skill](/wiki/sources/emil-kowalski-skill) | UI 细节打磨，交互/动效/组件状态精致化，2.1k Stars | GitHub |
| [magic-slide](/wiki/sources/magic-slide) | HTML 演示稿生成，Magic Move 转场，PipeLLM 图生，147 Stars | GitHub |
| [awesome-design-md](/wiki/sources/awesome-design-md) | 72+ 品牌 DESIGN.md，AI 按风格生成界面，87.8k Stars | GitHub |
| [guizang-social-card-skill](/wiki/sources/guizang-social-card-skill) | 小红书图文/公众号封面对，Editorial × Swiss 双视觉系统，28 版式，3k Stars | GitHub |
| [skillshare](/wiki/sources/skillshare) | 一个命令同步 Skills 到 60+ AI CLI 平台，内置安全审计，2.1k Stars | GitHub |
| [linus-torvalds-skills](/wiki/sources/linus-torvalds-skills) | Linus 式工程品味 Skill：好品味/不破坏用户/实用主义/极度求简，5 Stars | GitHub |
| [video-highlight-skill](/wiki/sources/video-highlight-skill) | AI 视频高光剪辑 Skill，FFmpeg 剪辑 + SRT 字幕 + YouTube 风格回顾页，7 Stars | GitHub |
| [linus-torvalds-skills](/wiki/sources/linus-torvalds-skills) | Linus 式工程品味 Skill：好品味/不破坏用户/实用主义/极度求简，5 Stars | GitHub |
| [awesome-codex-skills](/wiki/sources/awesome-codex-skills) | Codex Skills 精选列表，40+ Skills 覆盖开发/协作/写作/分析，13k Stars | GitHub |
| [ai-website-cloner-template](/wiki/sources/ai-website-cloner-template) | 输入 URL 用 AI 克隆网站为 Next.js，/clone-website 单命令，16.4k Stars | GitHub |
| [go-stock](/wiki/sources/go-stock) | AI 赋能股票分析，市场/个股情绪分析，K线技术指标，6.1k Stars | GitHub |
| [cell-architecture-studio](/wiki/sources/cell-architecture-studio) | 3D 细胞结构交互画廊，7 种细胞类型，高保真 GLB 模型，1k Stars | GitHub |
| [商业分析 · 案例专栏](/wiki/商业分析/案例专栏) | 横纵分析法深度研究报告系列 | 专栏 |
| [AiToEarn](/wiki/sources/aitoearn) | AI 全自动自媒体内容生产与多平台分发变现，18.2k Stars | GitHub |
| [guangzhou-industrial-ecommerce](/wiki/sources/guangzhou-industrial-ecommerce) | 广州工业品店群实战：采集+代发+工厂场景，20 个店一人管 | 公众号 |
| [wx-cli](/wiki/sources/wx-cli) | 微信本地数据 CLI，内存扫描解密，零依赖跨平台，3.3k Stars | GitHub |
| [geju-skill](/wiki/sources/geju-skill) | 专治 Codex 过度谨慎，格局打开暴论输出机，8 种打法 | GitHub |
| [flipbook-app](/wiki/sources/flipbook-app) | 点击探索 AI 生成知识树，无限子节点层层递进，142 Stars | GitHub |
| [stock-skill](/wiki/sources/stock-skill) | 三人美股框架合议：Serenity 卡脖子 × TraderS 宏观 × 恨铁技术执行，16 Stars | GitHub |
| [serenity-aleabitoreddit](/wiki/sources/serenity-aleabitoreddit) | Serenity 5813 条推文完整档案 + 供应链卡点 Skill，112 Stars | GitHub |
| [serenity-skill-muxuuu](/wiki/sources/serenity-skill-muxuuu) | Serenity 式供应链卡点股票研究，中文优先，356 Stars，Stars 最多版 | GitHub |
| [serenity-aleabitoreddit-skill](/wiki/sources/serenity-aleabitoreddit-skill) | Serenity 卡点投资分析技能，多 Agent 多市场适用，23 Stars | GitHub |
| [serenity-stock-choke](/wiki/sources/serenity-stock-choke) | A 股卡脖子选股框架，六步推理链路，12 Stars | GitHub |

### 学习路径 (Learning Paths)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [vibe-coding](/wiki/pages/concepts/vibe-coding) | 自然语言编程入门到实战 | 专栏 |
| [agentic-engineer](/wiki/pages/concepts/agentic-engineer) | Agent 工程完整知识体系 | 专栏 |
| [ai-finance-tool-dev](/wiki/patterns/ai-finance-tool-dev) | AI 辅助金融量化工具开发模式 | 公众号 |
| [claude-code-build-site](/wiki/concepts/claude-code-build-site) | 用 Claude Code 建站：非程序员 6 小时完成 SEO 建站全流程 | 公众号 |

---

## 最新收录

> 见 [log.md](./log.md)
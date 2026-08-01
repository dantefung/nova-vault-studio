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
| [llm-wiki](/md/wiki/concepts/llm-wiki) | 持久化、复利的知识库模式 | skill |
| [harness-engineering-practice](/md/wiki/sources/harness-engineering-practice) | AI不缺智商缺纪律：harness工程化实践，四阶段演进、19节点链路、7维评测 | 公众号 |
| [prompt-context-harness](/md/columns/agentic-engineer/other-tools/prompt-context-harness-evolution) | Prompt→Context→Harness 工程进化论 | 文章 |
| [loop-engineering](/md/wiki/concepts/loop-engineering) | Loop Engineering 溯源与批判：定时任务 → KOL炒作 → 五组件框架，看清词源回归本质 | 公众号 |
| [agentic-engineer](/md/columns/agentic-engineer/) | Agent 工程架构全链路 | 专栏 |

### 工具与技能 (Tools & Skills)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [prompt-as-code](/md/wiki/concepts/prompt-as-code) | 将提示词从自然语言转变为结构化 JSON/YAML 组件，让 Agent 确定性产出提示词，零幻觉批量生图 | X |
| [codex](/md/wiki/concepts/codex) | OpenAI 官方 AI 编程客户端，桌面/VS Code/终端三种形态，内置 GPT-Image-2 + Computer Use | X Article |
| [codex-app](/md/wiki/concepts/codex-app) | OpenAI 桌面端 AI 工作台，左中右三栏工作现场，Plugin/Connector/Skill/MCP 四扩展 + Computer Use | X Article |
| [ai-content-pipeline](/md/wiki/concepts/ai-content-pipeline) | AI 内容工厂流水线——用 Agent 串工具把人负责挑选微调，AI 跑完全流程 | X Article |
| [claude-role-prompts](/md/wiki/concepts/claude-role-prompts) | 4 个改变提问方式的角色框架——CBT 咨询师/严厉导师/魔鬼代言人/私人教练 | X Article |
| [selfmedia-compound-model](/md/wiki/concepts/selfmedia-compound-model) | 自媒体复利模型——流量起点→真需求产品→收入闭环，4 层变现漏斗 | X Article |
| [ai-oneperson-company](/md/wiki/concepts/ai-oneperson-company) | AI 一人公司方法论——PMF→RPA→SOP→无限复制，跟在大模型屁股后面吃红利 | 公众号 |
| [ai-lay-flat-income](/md/wiki/concepts/ai-lay-flat-income) | AI 躺赚多语种站——6 AI 打工人分工 + 全球被动收入 + 定时任务调度 | 公众号 |
| [agent-autonomous-pipeline](/md/wiki/concepts/agent-autonomous-pipeline) | Agent 自主调度 + 三阶段流水线——商机→产品→开发，手机远程触发 7×24 干活 | 公众号 |
| [ai-mini-app-template](/md/wiki/concepts/ai-mini-app-template) | AI 小应用模板化创建——[input1][input2] 占位符 + 后台批量上线 + 自媒体爆款逻辑复用 | 公众号 |
| [ai-free-quota-rotation](/md/wiki/concepts/ai-free-quota-rotation) | AI 工具免费额度轮换——信息差 + 多供应商永久免费循环 + 工具目录变现 | 公众号 |
| [codex-claude-shortcuts](https://shangtianqiang.github.io/codex-claude-shortcuts/) | Codex/Claude 67 条快捷指令速查表，Win/Mac 双平台，搜索过滤 | 网站 |
| [claude-skills](/md/wiki/concepts/claude-skills) | Claude 生态扩展机制，渐进式加载、可执行代码、跨平台移植 | 文章 |
| [claude-code-setup](/md/columns/vibe-coding/14-claude-code-setup-plugin) | 官方插件，扫描代码库推荐自动化配置 | 插件 |
| [opencode-cc-adapter](https://github.com/VastFuture/opencode-cc-adapter) | 桥接 Claude Code 生态到 OpenCode | 插件 |
| [opencodex](/md/wiki/concepts/opencodex) | Codex 本地模型路由层，统一管理多 provider 切换，session 不丢失 | 公众号 |
| [oh-my-claudecode](/md/columns/agentic-engineer/oh-my-claudecode) | Claude Code 超集工作流框架 | skill |
| [pensieve](/md/columns/agentic-engineer/pensieve) | 自增长的 AI Agent 项目知识库，四层结构化记忆 | 项目 |
| [llm-wiki-product](/md/wiki/sources/llm-wiki-product) | Karpathy 方法论工程化实现，10.3k Stars 跨平台知识库 | X |
| [auto-ppt-harness](/md/wiki/sources/auto-ppt-harness) | React 代码写 PPT 的 Harness，双反馈循环驱动 | GitHub |
| [claude-cookbooks](/md/wiki/sources/claude-cookbooks) | Anthropic 官方 44.9k Stars 菜谱集，Jupyter Notebook 示例 | GitHub |
| [mycc-notebooklm-obsidian](/md/wiki/sources/mycc-notebooklm-obsidian) | Claude Code + NotebookLM + Obsidian 四层研究流水线 | X |
| [coss-heroui](/md/wiki/sources/coss-heroui) | 比 shadcn/UI 更漂亮的两款 React 组件库 | X |
| [genericagent](/md/wiki/sources/genericagent) | 3K 行代码自我进化 Agent，6x Token 节省，12.5k Stars | GitHub |
| [ddd-harness-microservices](/md/wiki/sources/ddd-harness-microservices) | Java/Spring Boot DDD 四层架构微服务样板 | GitHub |
| [yao-open-skills](/md/wiki/sources/yao-open-skills) | OpenYao Skill 合集：yao-expert/贝叶斯/博弈论等，1.1k Stars | GitHub |
| [ky-design-to-html](/md/wiki/sources/ky-design-to-html-skill) | UI 截图转 HTML/CSS 视觉还原，截图验证修正，57 Stars | GitHub |
| [weread-exporter](/md/wiki/sources/weread-exporter) | 微信读书全本导出，付费书可用，Playwright + Canvas Hook，47 Stars | GitHub |
| [taste-skill](/md/wiki/sources/taste-skill) | AI 前端防丑 Skill 合集，三档设计旋钮，34.1k Stars | GitHub |
| [web-designer-plugin](/md/wiki/sources/web-designer-plugin) | 48 个 Award 级设计模式，决策框架，43 Stars | GitHub |
| [emil-kowalski-skill](/md/wiki/sources/emil-kowalski-skill) | UI 细节打磨，交互/动效/组件状态精致化，2.1k Stars | GitHub |
| [magic-slide](/md/wiki/sources/magic-slide) | HTML 演示稿生成，Magic Move 转场，PipeLLM 图生，147 Stars | GitHub |
| [linux-drawio-desktop-cli](/md/wiki/sources/linux-drawio-desktop-cli) | Draw.io Desktop 在 Linux 上的 5 种安装方式及 CLI 导出命令，含 Docker 无头模式 | 用户整理 |
| [awesome-design-md](/md/wiki/sources/awesome-design-md) | 72+ 品牌 DESIGN.md，AI 按风格生成界面，87.8k Stars | GitHub |
| [guizang-social-card-skill](/md/wiki/sources/guizang-social-card-skill) | 小红书图文/公众号封面对，Editorial × Swiss 双视觉系统，28 版式，3k Stars | GitHub |
| [skillshare](/md/wiki/sources/skillshare) | 一个命令同步 Skills 到 60+ AI CLI 平台，内置安全审计，2.1k Stars | GitHub |
| [linus-torvalds-skills](/md/wiki/sources/linus-torvalds-skills) | Linus 式工程品味 Skill：好品味/不破坏用户/实用主义/极度求简，5 Stars | GitHub |
| [video-highlight-skill](/md/wiki/sources/video-highlight-skill) | AI 视频高光剪辑 Skill，FFmpeg 剪辑 + SRT 字幕 + YouTube 风格回顾页，7 Stars | GitHub |
| [linus-torvalds-skills](/md/wiki/sources/linus-torvalds-skills) | Linus 式工程品味 Skill：好品味/不破坏用户/实用主义/极度求简，5 Stars | GitHub |
| [matt-pocock-wayfinder-handoff](/md/wiki/concepts/matt-pocock-wayfinder-handoff) | wayfinder（多会话地图）+ handoff（会话边界交接）接力协议，smart zone vs dumb zone ~120K tokens 阈值 | 公众号 |
| [matt-pocock-on-ramp](/md/wiki/concepts/matt-pocock-on-ramp) | 三类输入分类器：/triage（issue）/diagnosing-bugs（回归bug）/wayfinder（新模块），按来源和形态分流 | 公众号 |
| [mcp-protocol-rpc](/md/wiki/concepts/mcp-protocol-rpc) | MCP 选 JSON-RPC 而非 gRPC 的四个理由：stdio 优先、瓶颈在推理而非序列化、门槛低生态广、JSON 是 AI 母语 | 公众号 |
| [mcp-2026-07-28-stateless](/md/wiki/concepts/mcp-2026-07-28-stateless) | MCP 2026-07-28 最大更新：无状态+短连接、MRTR 多轮往返、缓存TTL、按需订阅、Tasks 正式扩展 | 公众号 |
| [awesome-codex-skills](/md/wiki/sources/awesome-codex-skills) | Codex Skills 精选列表，40+ Skills 覆盖开发/协作/写作/分析，13k Stars | GitHub |
| [ai-website-cloner-template](/md/wiki/sources/ai-website-cloner-template) | 输入 URL 用 AI 克隆网站为 Next.js，/clone-website 单命令，16.4k Stars | GitHub |
| [go-stock](/md/wiki/sources/go-stock) | AI 赋能股票分析，市场/个股情绪分析，K线技术指标，6.1k Stars | GitHub |
| [cell-architecture-studio](/md/wiki/sources/cell-architecture-studio) | 3D 细胞结构交互画廊，7 种细胞类型，高保真 GLB 模型，1k Stars | GitHub |
| [商业分析 · 案例专栏](/md/business/) | 横纵分析法深度研究报告系列 | 专栏 |
| [AiToEarn](/md/wiki/sources/aitoearn) | AI 全自动自媒体内容生产与多平台分发变现，18.2k Stars | GitHub |
| [guangzhou-industrial-ecommerce](/md/wiki/sources/guangzhou-industrial-ecommerce) | 广州工业品店群实战：采集+代发+工厂场景，20 个店一人管 | 公众号 |
| [wx-cli](/md/wiki/sources/wx-cli) | 微信本地数据 CLI，内存扫描解密，零依赖跨平台，3.3k Stars | GitHub |
| [cloudflare-zero-trust-access](/md/wiki/concepts/cloudflare-zero-trust-access) | 零信任访问控制——"永不信任，始终验证"，Cloudflare Access 免费 50 用户方案 | 公众号 |
| [geju-skill](/md/wiki/sources/geju-skill) | 专治 Codex 过度谨慎，格局打开暴论输出机，8 种打法 | GitHub |
| [flipbook-app](/md/wiki/sources/flipbook-app) | 点击探索 AI 生成知识树，无限子节点层层递进，142 Stars | GitHub |
| [stock-skill](/md/wiki/sources/stock-skill) | 三人美股框架合议：Serenity 卡脖子 × TraderS 宏观 × 恨铁技术执行，16 Stars | GitHub |
| [serenity-aleabitoreddit](/md/wiki/sources/serenity-aleabitoreddit) | Serenity 5813 条推文完整档案 + 供应链卡点 Skill，112 Stars | GitHub |
| [serenity-skill-muxuuu](/md/wiki/sources/serenity-skill-muxuuu) | Serenity 式供应链卡点股票研究，中文优先，356 Stars，Stars 最多版 | GitHub |
| [serenity-aleabitoreddit-skill](/md/wiki/sources/serenity-aleabitoreddit-skill) | Serenity 卡点投资分析技能，多 Agent 多市场适用，23 Stars | GitHub |
| [serenity-stock-choke](/md/wiki/sources/serenity-stock-choke) | A 股卡脖子选股框架，六步推理链路，12 Stars | GitHub |

### 学习路径 (Learning Paths)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [vibe-coding](/md/wiki/concepts/vibe-coding) | 自然语言编程入门到实战 | 专栏 |
| [agentic-engineer](/md/columns/agentic-engineer/) | Agent 工程完整知识体系 | 专栏 |
| [ai-finance-tool-dev](/md/wiki/patterns/ai-finance-tool-dev) | AI 辅助金融量化工具开发模式 | 公众号 |
| [claude-code-build-site](/md/wiki/concepts/claude-code-build-site) | 用 Claude Code 建站：非程序员 6 小时完成 SEO 建站全流程 | 公众号 |
| [linux-context-switch](/md/wiki/concepts/linux-context-switch) | Linux 内核进程上下文切换全解：switch_to 汇编、CFS→EEVDF、进程/线程/中断三类切换、线上排查工具链 | 公众号 |

### 出海建站 (Overseas Website Building)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [meigen-ai-tech-breakdown](/md/wiki/sources/meigen-ai-tech-breakdown) | 月访500万AI生图站：SSR + 积分制 + 程序化 SEO，T3国家市场策略 | 公众号 |
| [ai-api-platforms-overseas](/md/wiki/sources/ai-api-platforms-overseas) | 9个常用API平台：语言/图片/视频/地图，API组合是出海产品加速器 | 公众号 |
| [xiaohu-seo-1m-uv](/md/wiki/read-later/index) | 练手小游戏30天100万UV：野生小虎首次出海SEO实战复盘，纯自然流量 | X |
| [hezhiyan7-outsea-oneyear-10000usd](/md/wiki/sources/hezhiyan7-outsea-oneyear-10000usd) | 出海一周年稳定万刀：12 模块 200+ 篇实战文章方法论地图 | X |
| [indie-site-builder-skill-stack](/md/wiki/concepts/indie-site-builder-skill-stack) | 独立网站出海创业 12 大能力栈：需求/SEO/支付/流量 等实战密度地图 | 概念 |
| [aichuhai-dev](/md/wiki/products/aichuhai-dev) | droidHZ 的 AI 出海导航站：12 模块分类 + 话题驱动 + 用户参与 | 产品 |
| [moore-wechat-article-downloader](/md/wiki/products/moore-wechat-article-downloader) | 公众号内容情报库 Skill：4 大场景 + SQLite 状态 + 评论互动 | 产品 |
| [first-time-dollar-oneyear](/md/wiki/sources/first-time-dollar-oneyear) | 第一次赚美元：新手到 5 站 + 1 千元/月，复盘 28 节付费课程 | 公众号 |
| [ai-traffic-geo](/md/wiki/sources/ai-traffic-geo) | 如何查看 AI 流量做好 GEO：3 来源 / 4 方法 / 5 类适配 | 公众号 |
| [sell-air-mvp](/md/wiki/sources/sell-air-mvp) | 卖空气验证需求：Pieter Levels 预售 + 4 步 SOP | 公众号 |
| [nextjs-vuln-bill](/md/wiki/sources/nextjs-vuln-bill) | Next.js Image 漏洞账单爆炸：真实事件 + 4 套解决方案 | 公众号 |
| [template-sop](/md/wiki/sources/template-sop) | 基于模板的上站 SOP：3 大类模板 + AI 编程适配 | 公众号 |
| [recruit-workbuddy](/md/wiki/sources/recruit-workbuddy) | WorkBuddy AI 招聘流水线：简历处理从 8 小时压到 0 分钟 | 公众号 |
| [hr-resume-skill](/md/wiki/concepts/hr-resume-skill) | 自定义 Skill + 连接器 + 自动化 三层架构 | 概念 |
| [recruitment-workbuddy](/md/wiki/concepts/recruitment-workbuddy) | WorkBuddy 在企业 HR 招聘场景的落地方案 | 概念 |
| [agent-launch-personal-site](/md/wiki/sources/agent-launch-personal-site) | Agent 口喷上线个人网站：6 步极简部署 + kongge.space 实战 | 公众号 |
| [adsense-us-tax-form](/md/wiki/sources/adsense-us-tax-form) | AdSense 美国税务信息（W-8BEN 表 + 中美税收条约）10 分钟填表 | 公众号 |
| [baokuan-title-generator-skill](/md/wiki/sources/baokuan-title-generator-skill) | 公众号爆款标题 Skill：16 种模板 + 双模型协同（fable5 + GPT-5.6） | 公众号 |
| [baokuan-title-generator-skill](/md/wiki/products/baokuan-title-generator-skill) | 公众号爆款标题 Skill 产品页 | 产品 |

### Agent 工程 (Agent Engineering)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [ai-agent-team-9-stages](/md/wiki/sources/ai-agent-team-9-stages) | Anthropic 9阶段搭建Agent团队：从单个Agent到生产级协作，三层架构 | 公众号 |
| [harness-engineering-practice](/md/wiki/sources/harness-engineering-practice) | AI不缺智商缺纪律：harness工程化实践，四阶段演进、19节点链路、7维评测 | 公众号 |
| [mission-driver](/md/wiki/concepts/mission-driver) | Mission Driver 声明式任务驱动引擎，Loop Engineering 参考实现，多层嵌套局部容错 | 公众号 |

### 商业模式 (Business Models)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [ai-era-wealth-creation](/md/wiki/sources/ai-era-wealth-creation) | AI时代造富公式：现金流/股权/流动性三路径，四大赛道分析 | 公众号 |
| [digital-products-side-income](/md/wiki/concepts/digital-products-side-income) | 数字产品副业：国内卖19.9国外卖9美元，Gumroad/Payhip/Sellfy 平台对比 | 公众号 |


### 内容工作流 (Content Workflows)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [hermes-obsidian-knowledge-base](/md/wiki/sources/hermes-obsidian-knowledge-base) | Obsidian + Hermes Agent：Source→Topic→Draft→Published 四步流转，内容库变生产线 | 公众号 |
| [claude-prompt-strategies](/md/wiki/sources/claude-prompt-strategies) | 100个提示策略：结构化提示、推理框架、内容量产，思维框架比模型版本更重要 | 公众号 |

---

### 精选专栏 (Indie Hub)

> 微信公众号精选文章归档，来源：韩数同学/若飞/dontbesilent/刘小排/成峰/运维有术 等

| 文章 | 一句话 | 来源 |
|------|--------|------|
| [长程Agent训练九实践](/md/wiki/sources/indie-hub-agentic-rl) | 执行/学习/治理三循环，九项实践，Horizon渐进，Template Collapse监控 | 若飞 |
| [dontbesilent四层Codex体系](/md/wiki/sources/indie-hub-dontbesilent) | 任务/工作流/方法/系统四层，短Prompt+厚环境，SOURCE_OF_TRUTH.md，递归改进 | dontbesilent |
| [Git Worktree管多AI程序员](/md/wiki/sources/indie-hub-git-worktree) | 分支管路线Worktree管现场，五种情况，独立开发者三条建议 | 刘小排 |
| [Codex吞掉浏览器](/md/wiki/sources/indie-hub-codex-eat-pc) | Atlas死了但Agent能力活在Codex里，AgentOS雏形：Agent+工具+Skills+上下文 | 成峰 |
| [grill-with-docs术语对齐](/md/wiki/sources/indie-hub-grill-with-docs) | Matt Pocock：grilling+domain-modeling双原语，CONTEXT.md/ADR三分法，四反模式 | 运维有术 |
| [外汇交易基础](/md/wiki/sources/indie-hub-forex-basics) | 货币对/点差/汇率/直盘交叉盘/保证金/Margin Call/滑点 | 光速白眉 |
| [D2画图神器24k Stars](/md/wiki/sources/indie-hub-d2) | 程序员声明式图表工具，用代码画流程图/时序图/ER图，19种主题 | 韩数同学 |
| [计算机数据表示与存储](/md/wiki/sources/indie-hub-computer-data) | 二进制/补码/IEEE 754/ASCII/Unicode/大小端/存储层次 | Debug 蟹老板 |
| [哥飞SEO找关键词方法论](/md/wiki/sources/indie-hub-gefei-keyword) | 9渠道穷尽+7步筛选+跨平台对齐+AI辅助网站规划 | 哥飞社群 |

[更多 →](./sources/index.md)

---

## 最新收录

> 见 [log.md](./log.md)
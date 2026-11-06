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
| [ontology-platform-architecture](/md/wiki/concepts/ontology-platform-architecture) | 本体平台总体架构：四层三纵 + 十大引擎 + 三大运行模式，统一企业业务语义中枢 | 公众号：人月聊IT |
| [llm-wiki](/md/wiki/concepts/llm-wiki) | 持久化、复利的知识库模式：三层架构 + Ingest/Query/Lint + 哈希/阈值/冲突治理 | Skill / Hermes Agent |
| [hermes-llm-wiki-skill](/md/wiki/summaries/hermes-llm-wiki-skill) | Hermes v2.1.0 将 Karpathy LLM Wiki 落实为可执行的建设、查询和 13 步 Lint 治理流程 | Hermes Agent 文档 |
| [llm-cache-mechanism](/md/wiki/concepts/llm-cache-mechanism) | LLM 缓存三层机制：KV Cache → 显存优化 → 前缀缓存，以及 Claude Code/Codex 工程实践 | 公众号 |
| [harness-engineering-practice](/md/wiki/sources/harness-engineering-practice) | AI不缺智商缺纪律：harness工程化实践，四阶段演进、19节点链路、7维评测 | 公众号 |
| [harness-legacy-refactor](/md/wiki/summaries/harness-legacy-refactor) | 90万行遗留系统重构实践：质量左移、多Agent独立审查、变异测试、防篡改状态机与上下文分层 | 公众号 |
| [agent-runtime-safety-guardrails](/md/wiki/patterns/agent-runtime-safety-guardrails) | Agent 运行时纵深防御：默认拒绝、最小权限、执行前授权、成本包络、门禁、回滚与脱敏审计 | 公众号 |
| [ai-coding-delivery](/md/wiki/concepts/ai-coding-delivery) | 复杂业务团队 AI 研发交付：分层知识库 + 文件化 RD 流程 + 前置质量门禁 | 公众号 |
| [prompt-context-harness](/md/columns/agentic-engineer/other-tools/prompt-context-harness-evolution) | Prompt→Context→Harness 工程进化论 | 文章 |
| [loop-engineering](/md/wiki/concepts/loop-engineering) | Loop Engineering 溯源与批判：定时任务 → KOL炒作 → 五组件框架，看清词源回归本质 | 公众号 |
| [loop-engineering-thoughts](/md/wiki/concepts/loop-engineering-thoughts) | Loop Engineering 深度思考：控制论四大公理映射、五代工程演进、吴恩达三个环、TDD 作为反馈信号、模型成本与预算思维 | 公众号 |
| [ralph-loop](/md/wiki/concepts/ralph-loop) | Ralph Loop：Stop Hook 拦截 + 明确完成条件，强制 AI Agent 持续迭代直到真正完成任务，而非 LLM 自我评估退出 | 博客 |
| [ai-self-refine-prompt](/md/wiki/patterns/ai-self-refine-prompt) | AI 主动进步提示词：先定质量标准→自检→针对最差处重写，迭代至无明显改进空间 | X/Twitter |
| [book-notes-content-factory](/md/wiki/concepts/book-notes-content-factory) | 内容平台卖读书笔记：AI 批量产出初稿→人工精修→打包付费，知识内容 SOP 化量产 | X/Twitter |
| [agentic-engineer](/md/columns/agentic-engineer/) | Agent 工程架构全链路 | 专栏 |

### 工具与技能 (Tools & Skills)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [prompt-as-code](/md/wiki/concepts/prompt-as-code) | 将提示词从自然语言转变为结构化 JSON/YAML 组件，让 Agent 确定性产出提示词，零幻觉批量生图 | X |
| [codex](/md/wiki/concepts/codex) | OpenAI 官方 AI 编程客户端，桌面/VS Code/终端三种形态，内置 GPT-Image-2 + Computer Use | X Article |
| [codex-app](/md/wiki/concepts/codex-app) | OpenAI 桌面端 AI 工作台，左中右三栏工作现场，Plugin/Connector/Skill/MCP 四扩展 + Computer Use | X Article |
| [binghe-codex-ai-canvas-plugin](/md/wiki/sources/binghe-codex-ai-canvas-plugin) | 冰河：Codex 插件 AI-Canvas 全能无限画布终极版发布——选区局部重绘与图层编排 | X/Twitter |
| [ai-content-pipeline](/md/wiki/concepts/ai-content-pipeline) | AI 内容工厂流水线——用 Agent 串工具把人负责挑选微调，AI 跑完全流程 | X Article |
| [story-studio-video-pipeline](/md/wiki/patterns/story-studio-video-pipeline) | Audio-First 短视频流水线：先出声音再切分镜，Reference Images 防画风漂移，剪映草稿自动生成 | X/Twitter |
| [wechat-historical-story-track](/md/wiki/concepts/wechat-historical-story-track) | 视频号历史人物故事赛道：平台×人群×题材×品类四层适配 + 变现阶梯 + 可复用判断清单 | X/Twitter 综合 |
| [story-studio-video-account-pipeline](/md/wiki/summaries/story-studio-video-account-pipeline) | 《Story Studio》精读：带数据的视频号历史故事赛道样本，含 7 条洞察与 6 项边界 | X/Twitter |
| [wechat-video-silver-economy-monetization](/md/wiki/patterns/wechat-video-silver-economy-monetization) | 银发向内容的三条变现路径：图书带货（78%）、滋补品、创作者分成与私域导流 | X/Twitter |
| [pre-publish-compliance-check](/md/wiki/patterns/pre-publish-compliance-check) | 发布前合规预检：把平台审核规则变成带来源与核实日期的检查表，用 case 回流对抗规则变化 | X/Twitter |
| [xaiwind-jianying-skill-guide](/md/wiki/sources/xaiwind-jianying-skill-guide) | 想风：剪映上手 + jianying-editor-skill 全指南，附能力边界表与六个常见坑 | X/Twitter |
| [hailey-hand-drawn-storybook-animation](/md/wiki/sources/hailey-hand-drawn-storybook-animation) | Hailey：Opus 5.5 + 豆包配音做 7 分钟手绘水彩动画绘本，GPT 三轮打磨剧本 | X/Twitter |
| [huangbai-guoshen-review-skill](/md/wiki/sources/huangbai-guoshen-review-skill) | 黄白：「过审」Skill——发布前检查小红书/抖音/B 站/视频号的审核风险 | X/Twitter |
| [jedeeai-ai-video-top10-bookmarks](/md/wiki/sources/jedeeai-ai-video-top10-bookmarks) | 琳小航：过去 30 天 X 收藏量 Top 10 的 AI 视频实操神贴，含三条技术路线梳理 | X/Twitter |
| [story-studio-video-account-pipeline](/md/wiki/sources/story-studio-video-account-pipeline) | 夏木 GROW：Story Studio 开源 Skill 全流程拆解，附 20 张截图 | X/Twitter |
| [leaf-sanren-seecut-video-pipeline](/md/wiki/sources/leaf-sanren-seecut-video-pipeline) | Leaf Yeah!：SeeCut 开源管线——AI 自动网感精剪（数字人+看片挑刺+剪映草稿） | X/Twitter |
| [aaronyi-image-story-video-wizard](/md/wiki/sources/aaronyi-image-story-video-wizard) | 大雷：图文播客视频自动化流水线——image-story-video-wizard Skill 全流程 | X/Twitter |
| [aaronyi-wedding-video-custom-wizard](/md/wiki/sources/aaronyi-wedding-video-custom-wizard) | 大雷：AI 婚礼视频定制教程——引导式 Skill 14 步跑通全流程 | X/Twitter |
| [lieflat3-writing-distillation-skill](/md/wiki/sources/lieflat3-writing-distillation-skill) | 躺在废墟里 Lieflat：写作蒸馏器 Skill——量化文本层次与风格复刻工作流 | X/Twitter |
| [aaronyi-open-topic-radar](/md/wiki/sources/aaronyi-open-topic-radar) | 大雷：开源自媒体选题雷达——先人一步获取最新资讯与信息差 | X/Twitter |
| [aaronyi-internal-world-productivity](/md/wiki/sources/aaronyi-internal-world-productivity) | 大雷：AI 时代，内在世界就是生产力——反向通感与审美门槛的分水岭 | X/Twitter |
| [code-video-rendering-method-matrix](/md/wiki/patterns/code-video-rendering-method-matrix) | 代码视频渲染方法矩阵：按网页、React、手绘、插画、水彩、数学、地图和 3D 语义选择确定性渲染引擎 | 公众号 |
| [hypit-agent-video-workflow](/md/wiki/summaries/hypit-agent-video-workflow) | Codex + Hypit 把视频复刻沉淀为可局部修改、批量变体的叙事组件工作流 | X/Twitter |
| [video-prompt-reverse-engineering](/md/wiki/patterns/video-prompt-reverse-engineering) | 多模态模型把参考视频拆成五层视觉规格，再编译为目标模型 Prompt 并通过生成差异迭代 | 知乎专栏 |
| [video-prompt-reverse-engineering-professional-template](/md/wiki/sources/video-prompt-reverse-engineering-professional-template) | 视频反推提示词专业模板：快速七要素、逐镜头十八维、负面约束、类型补充与固定输出格式 | 用户提供 |
| [agent-slash-command-registry](/md/wiki/patterns/agent-slash-command-registry) | Agent 斜杠命令系统：Markdown Prompt 模板、参数展开、全局/项目两级加载、覆盖优先级与热重载 | 公众号 |
| [stripe-x-account-setup](/md/wiki/summaries/stripe-x-account-setup) | Stripe 香港个人账户注册： Individual + 港卡 + 护照 KYC，美元结算账户降低汇损 | X/Twitter |
| [x-creator-monetization-2026](/md/wiki/summaries/x-creator-monetization-2026) | X 创作者收益完整流程：资格门槛 → 环境伪装 → 身份验证 → Wise/港卡 → W-8BEN | X/Twitter |
| [canghe-x-stripe-tutorial](/md/wiki/summaries/canghe-x-stripe-tutorial) | X 认证 + Stripe 绑定四步闭环：港卡 → Stripe → X 认证 → 创作者工作室连接 | X/Twitter |
| [google-seo-ranking-factors-2026](/md/wiki/summaries/google-seo-ranking-factors-2026) | Zyppy 131 位 SEO 专家调研精读：13,665 数据点，相关性/外链/内容质量仍前三，用户信号大幅跃升 | 公众号 |
| [stripe-noahduck283-guide](/md/wiki/summaries/stripe-noahduck283-guide) | Stripe 全链路指南：Payment Links→Checkout→Billing→Tax/MoR→Connect 分层升级路径与上线 checklist | X/Twitter |
| [stripe-sitinme-guide](/md/wiki/summaries/stripe-sitinme-guide) | Stripe 网站接入实战：Checkout Session→Webhook→Stripe CLI 本地测试→生产受限密钥 | X/Twitter |
| [liujiayi1111-sms-code-forward](/md/wiki/summaries/liujiayi1111-sms-code-forward) | iPhone 快捷指令把短信验证码自动转发邮箱：被动转发/主动查询两案，附「内容」变量坑点 | X/Twitter |
| [ai-xiaomu-jev-decision-model-primer](/md/wiki/summaries/ai-xiaomu-jev-decision-model-primer) | Jev决策模型入门：把问答变填表，答案格式数学上锁死；confidence分级兜底让AI真正可自动化；快200倍便宜400倍 | X/Twitter |
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
| [ffmpeg-9-lei](/md/wiki/concepts/ffmpeg-9-lei) | FFmpeg 9.0 代号「Lei」纪念雷霄骅，新增 ONNX Runtime DNN 后端，AI 时代多媒体基础设施 | 公众号 |
| [adsense-site-auditor](/md/wiki/patterns/adsense-site-auditor) | AdSense 审计 Skill：用 Codex/Claude 反复审核通过 Google AdSense 申请，五种审计场景 Prompt | web.cafe |
| [edu-skills-catalog](/md/wiki/sources/edu-skills-catalog) | 教育场景 100 个 AI Skills、11 大功能分类：课设、课件、批改、教研，含 Course-designer + Teachany 实战 | 公众号 |
| [claude-teacher-skill](/md/wiki/sources/claude-teacher-skill) | Claude 官方 K-12 教师 Skill（k12-lesson-planning + k12-lesson-differentiation）实战，七份关联教学文件，三个教学判断 | 公众号 |
| [matt-pocock-skills-use](/md/wiki/sources/matt-pocock-skills-use) | Matt Pocock Skills 全流程使用指南：setup/ask/grill/to-prd/to-issues/implement/handoff 八 Skill 演示 | 公众号 |
| [design-skills-programmer](/md/wiki/sources/design-skills-programmer) | 程序员必备 Design Skills：四类能力（生成/规范/还原/系统化），五种角色组合建议，含 Taste Skill/UI UX Pro Max/UI Design Brain/Impeccable 等 | 公众号 |
| [design-skills-eight](/md/wiki/sources/design-skills-eight) | 8 个优质 Design Skills（创意方向/设计智能/质量合规/工程模式四类），含 Anthropic Frontend Design/Impeccable/Taste Skill/UI UX Pro Max 等 | 公众号 |
| [baoyu-design-skill](/md/wiki/sources/baoyu-design-skill) | baoyu-design 技能包：Design Skill 导出 MP4 动画视频（逐帧拍照+ffmpeg），一句话生成技术解释视频，支持 Cursor/Claude Code/Codex | 公众号 |
| [huashu-design-deep-dive](/md/wiki/sources/huashu-design-deep-dive) | huashu-design 逆向深度解析：品牌资产协议（5步硬流程）+ 20种设计哲学库 + Stage+Sprite 动画引擎 + render-video.js 视频管线 + 16条动画踩坑实录 | 公众号 |
| [huashu-design-workflow](/md/wiki/sources/huashu-design-workflow) | huashu-design 交付型设计 skill 分析：HTML 作为中间层，解决格式/上下文/方向/责任 4 个结构性断裂 | 公众号 |
| [seo-audit-tool](/md/wiki/sources/seo-audit-tool) | On Page SEO 体检工具 seo.web.cafe/audit/：上线前自检 Title/Description/H1/关键词覆盖，支持 pSEO 批量抽查 | 公众号 |
| [ego-lite-browser](/md/wiki/sources/ego-lite-browser) | Ego Lite 免费 Agent 浏览器：导入 Chrome 登录态/Cookie，Space 多任务隔离，Semantic Snapshot 压缩 Token，benchmark 比 Agent Browser 快 3.5 倍 | 公众号 |
| [cloudflare-email-routing](/md/wiki/sources/cloudflare-email-routing) | Cloudflare Email Routing 免费域名邮箱转发：support@/legal@ 等别名转发到 Gmail，Workers Free 计划免费，限制 200 rules/200 destinations/25MiB | 公众号 |
| [mkdollar-backlinks](/md/wiki/sources/mkdollar-backlinks) | MkDollar（mkdollar.com）外链提交管理工具：按 DR/Traffic/Pricing/Dofollow/Account/Category 筛选，支持产品外链提交进度跟踪 | 公众号 |
| [ai-image-prompt-libraries](/md/wiki/sources/ai-image-prompt-libraries) | 带 Prompt 的 AI 图库（mkimage.ai/meigen.ai/gpt-image2.canghe.ai）：Prompt 可复制/翻译中文/标注 License/出处追踪，三步法找创意+微调+生成 | 公众号 |
| [multica-agent-project-manager](/md/wiki/summaries/multica-agent-project-manager) | 从 Multics 到 Multica：AI 编码 Agent 的控制面与项目经理，解决团队协同失速 | 知乎专栏 |
| [multica-managed-agents-practice](/md/wiki/summaries/multica-managed-agents-practice) | Managed Agents 原理与 Multica 实践：解耦大脑（决策）、双手（沙箱）与记忆（状态） | CSDN |
| [multica-self-hosted-deployment](/md/wiki/summaries/multica-self-hosted-deployment) | Multica 私有化自托管部署指南：Docker Compose 与源码构建实战 | 君哥的学习笔记 |
| [multica-usage-guide](/md/wiki/summaries/multica-usage-guide) | Multica 实战手册：Workspace / Issue / Squad 突击小队产研协同闭环 | 君哥的学习笔记 |
| [network-piercing-frp-guide](/md/wiki/summaries/network-piercing-frp-guide) | 内网穿透主流工具对比与企业级 frp 私有化自建全攻略 | 君哥的学习笔记 |
| [enterprise-knowledge-base-selection](/md/wiki/summaries/enterprise-knowledge-base-selection) | 企业级知识库架构选型：LLM Wiki（提前提炼复利）vs RAG（查询时拼装）深度对比 | 君哥的学习笔记 |
| [shao-meng-inference-engineering-prefill-decode-cuda](/md/wiki/summaries/shao-meng-inference-engineering-prefill-decode-cuda) | Baseten「Inference Engineering」精读：Prefill 算力受限 vs Decode 带宽受限铁律 + vLLM/SGLang/TensorRT-LLM 选型 + 五大加速组合评估 + 故障是常态 | X/Twitter |
| [agents-md-visual-hierarchy-directive](/md/wiki/patterns/agents-md-visual-hierarchy-directive) | AGENTS.md 视觉指令：让版式自己解释——一句删除型约束化解 AI 生成的副标题堆叠 | 用户整理 |
| [alice-personal-agent-game-ui](/md/wiki/sources/alice-personal-agent-game-ui) | 把 Personal Agent 做成养成系游戏：白艾莉（Alice）的上手体验、多 Agent 化身与「AI 活人感」关系诉求 | X/Twitter |
| [obsidian-beginner-starter-checklist](/md/wiki/sources/obsidian-beginner-starter-checklist) | Obsidian 新手抄作业指南：All-in-One 个人工作台、插件清单与多端同步方案 | X/Twitter |
| [magpie-kiro-claude-code-subscription](/md/wiki/sources/magpie-kiro-claude-code-subscription) | magpie + Kiro 订阅接入 Claude Code：技术原理、配置四步与四类风险（含账号封禁与密钥） | X/Twitter |
| [agent-relay-multi-agent-hands-on](/md/wiki/sources/agent-relay-multi-agent-hands-on) | Agent Relay 实测：Claude Code 与 Codex 直接互发消息，60 分钟临时房间与 8 人上限 | X/Twitter |
| [github-life-lifecycle-guide](/md/wiki/sources/github-life-lifecycle-guide) | GitHub 人生指南：学习、升学、人际、求职、职场、独居与副业七个阶段的 30+ 项目索引 | X/Twitter |
| [kieran-indie-dev-weekly-03](/md/wiki/sources/kieran-indie-dev-weekly-03) | Kieran 周报 #3：多 Agent 编排工作流实现 10x 产出（1100 contributions / 303 PRs）| 博客 |
| [llm-learning-subway-map](/md/wiki/sources/llm-learning-subway-map) | 大模型学习地铁图：主干线 0-7 站 + 五条支线（推理/训练/对齐/架构/应用），GPT-2 手写是锚点 | X/Twitter |
| [how-i-work-with-agents](/md/wiki/sources/how-i-work-with-agents) | Thorsten Ball：我如何与 Agent 协作（October 2026），十条实践原则，TTFT/异步/证明文化 | X/Twitter |
| [transformer-training-seven-formulas](/md/wiki/sources/transformer-training-seven-formulas) | Transformer 训练的七个关键公式：初始化/Adam/偏差修正/Weight Decay/Warmup/余弦衰减/梯度裁剪 | X/Twitter |
| [addy-osmani-claude-code-code-review](/md/wiki/sources/addy-osmani-claude-code-code-review) | Addy Osmani（Google）：Claude Code 团队如何做代码审查——六层自动化防线 + 风险分级审批，PR 量翻倍同时回退率降 40% | X/Twitter |
| [y2a-auto-youtube-bilibili-pipeline](/md/wiki/sources/y2a-auto-youtube-bilibili-pipeline) | Y2A-Auto 自动搬运流水线：技术能力核验与版权、平台规则边界 | X/Twitter |
| [xianyu-3-open-source-tools-automation](/md/wiki/sources/xianyu-3-open-source-tools-automation) | 闲鱼副业月入 5 万的 3 个开源工具：盯盘捡漏 → 自动议价 → 多账号自动发货的完整流水线 | X/Twitter |
| [xianyu-auto-agent](/md/wiki/entities/xianyu-auto-agent) | shaxiu/XianyuAutoAgent：闲鱼 7×24 智能值守，上下文感知对话 + 阶梯降价议价 + 多专家路由 | GitHub |
| [ai-goofish-monitor](/md/wiki/entities/ai-goofish-monitor) | Usagi-org/ai-goofish-monitor：Playwright + AI 闲鱼多任务监控，按价格/区域/AI 标准捡漏秒拍 | GitHub |
| [xianyu-auto-reply-fix](/md/wiki/entities/xianyu-auto-reply-fix) | GuDong2003/xianyu-auto-reply-fix：闲鱼多账号管理、AI 自动回复与自动发货确认 | GitHub |

### 学习路径 (Learning Paths)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [vibe-coding](/md/wiki/concepts/vibe-coding) | 自然语言编程入门到实战 | 专栏 |
| [ai-coding-methodology](/md/wiki/concepts/ai-coding-methodology) | AI Coding 六步方法论：从自然语言编程到代码搬运工 | 公众号 |
| [agentic-engineer](/md/columns/agentic-engineer/) | Agent 工程完整知识体系 | 专栏 |
| [ai-finance-tool-dev](/md/wiki/patterns/ai-finance-tool-dev) | AI 辅助金融量化工具开发模式 | 公众号 |
| [claude-code-build-site](/md/wiki/concepts/claude-code-build-site) | 用 Claude Code 建站：非程序员 6 小时完成 SEO 建站全流程 | 公众号 |
| [linux-context-switch](/md/wiki/concepts/linux-context-switch) | Linux 内核进程上下文切换全解：switch_to 汇编、CFS→EEVDF、进程/线程/中断三类切换、线上排查工具链 | 公众号 |
| [mutex-evolution](/md/wiki/concepts/mutex-evolution) | 互斥锁演化史：关中断→Peterson算法→原子指令→自旋锁→互斥锁→读写锁，含死锁四条件 | 公众号 |
| [sdio-bus](/md/wiki/concepts/sdio-bus) | SDIO 总线硬件原理：SD 家族区分、引脚定义、1-bit/4-bit 模式、命令帧格式、初始化时序、硬件设计踩坑 | 公众号 |
| [virtual-memory-invention](/md/wiki/concepts/virtual-memory-invention) | 虚拟内存发明历程：物理寻址→重定位→覆盖→分页→MMU→缺页中断→TLB，三大核心价值 | 公众号 |
| [tcp-listen-semantics](/md/wiki/concepts/tcp-listen-semantics) | TCP 套接字状态机：listen 的三件事、内核 SYN 查找逻辑与三种建连场景，判断「谁是发起方」 | 公众号 |
| [tcp-listen-connection-setup](/md/wiki/sources/tcp-listen-connection-setup) | 没有 listen 能否建立 TCP 连接原始归档：listen 三件事、bind 不 listen 实测与同时打开路径 | 公众号 |
| [homework-tutoring-cognitive-first-principles](/md/wiki/sources/homework-tutoring-cognitive-first-principles) | 辅导孩子做作业的第一性原理原始归档：大脑能耗基线、多巴胺奖赏与三环钉子/喜马拉雅茶道同构实验 | X/Twitter |
| [app-idea-validation](/md/wiki/concepts/app-idea-validation) | 月入 10 万美元 App 点子验证法：Google Trends→Rising Queries→ASO→Sensor Tower→竞品分析→七天冲刺 | X/Twitter |
| [fcitx-rime-snow-lmdg](/md/wiki/concepts/fcitx-rime-snow-lmdg) | Fcitx + RIME + 雾凇 + LMDG 开源 AI 输入法组合，全本地运行，互联网从业者专属 | 社群 |
| [international-software-arsenal](/md/wiki/concepts/international-software-arsenal) | 境外势力软件盘点：网络工具/AI/内容/社交/效率/自律，17 个常用国际服务清单 | 社群 |
| [cf-worker-cpu-limit](/md/wiki/concepts/cf-worker-cpu-limit) | Cloudflare Workers CPU Time 限制导致 AI 流式输出中断：Chunk 累积 CPU、浏览器直连、合并 Chunk 解决 | 公众号 |
| [b2c-conversion](/md/wiki/concepts/b2c-conversion) | B2C 独立站转化率优化七法：标题卖情绪→卖点写用户所得→为什么选你→语气舒服→制造紧迫感→尺寸指南→信任证据 | 公众号 |
| [codex-security](/md/wiki/concepts/codex-security) | Codex Security 开源 AI 安全研究员：自动读代码/扫漏洞/验证/补丁，三种接入方案，交叉扫描建议 | 公众号 |
| [gefei-seo-keywords](/md/wiki/concepts/gefei-seo-keywords) | 哥飞 SEO 教程：关键词优先网站结构规划，八步流程（收词→补量→意图分组→URL 清单），4 个常见坑 | 公众号 |
| [kgr-keyword-golden-ratio](/md/wiki/concepts/kgr-keyword-golden-ratio) | KGR 关键词黄金比例与新站 SEO 阶段演进：intitle 与月搜量比值筛选长尾词，避开优待期幻觉，按 GSC 信号分四阶段推进 | X / 独立站实战 |
| [programmer-math-cultivation](/md/wiki/concepts/programmer-math-cultivation) | 程序员的数学修养：逻辑思维、抽象建模与量化分析，离散数学/线性代数/概率统计/微积分四大分支支撑，三层进阶 | 原创/概念整理 |
| [austrian-economics](/md/wiki/concepts/austrian-economics) | 奥地利经济学派：方法论个人主义、人的行动学、主观价值论、商业周期理论，反对政府干预与数学模型预测 | 原创/概念整理 |
| [economic-machine-debt-cycle](/md/wiki/concepts/economic-machine-debt-cycle) | Ray Dalio 经济机器模型：交易与信贷构成支出，生产率增长叠加长短债务周期，去杠杆化由四类政策工具共同处理 | Medium / 官方视频 |
| [cognitive-load-three-element-model](/md/wiki/concepts/cognitive-load-three-element-model) | 认知负荷三要素：环境 / 工作记忆 / 长期记忆，把「想不明白」拆成三处可检查的物理断点 | X/Twitter |

### 出海建站 (Overseas Website Building)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [meigen-ai-tech-breakdown](/md/wiki/sources/meigen-ai-tech-breakdown) | 月访500万AI生图站：SSR + 积分制 + 程序化 SEO，T3国家市场策略 | 公众号 |
| [ai-api-platforms-overseas](/md/wiki/sources/ai-api-platforms-overseas) | 9个常用API平台：语言/图片/视频/地图，API组合是出海产品加速器 | 公众号 |
| [indie-development-weekly-161](/md/wiki/sources/indie-development-weekly-161) | 独立开发变现周刊第161期：10个案例提炼真实付费、渠道资产化、窄定位和基础设施抽象 | 公众号 |
| [xiaohu-seo-1m-uv](/md/wiki/read-later/index) | 练手小游戏30天100万UV：野生小虎首次出海SEO实战复盘，纯自然流量 | X |
| [hezhiyan7-outsea-oneyear-10000usd](/md/wiki/sources/hezhiyan7-outsea-oneyear-10000usd) | 出海一周年稳定万刀：12 模块 200+ 篇实战文章方法论地图 | X |
| [indie-site-builder-skill-stack](/md/wiki/concepts/indie-site-builder-skill-stack) | 独立网站出海创业 12 大能力栈：需求/SEO/支付/流量 等实战密度地图 | 概念 |
| [half-hour-game-site](/md/wiki/sources/half-hour-game-site) | 半小时上线小游戏站：域名注册→Cloudflare DNS→GitHub→Claude 生成代码→Vercel 部署→自定义域名+SSL，1 小时含写文章 | 公众号 |
| [bolt-new-5min-site](/md/wiki/sources/bolt-new-5min-site) | 刘小排：5 分钟做个网站：Bolt.new + Claude 一键生成运势网站，HTML+Tailwind 单文件，推荐付费测试产品方向 | 公众号 |
| [day-90-checklist](/md/wiki/sources/day-90-checklist) | 袁锐钦 90 天 89 篇出海工具站收官：六阶段全路径清单（启动→流量→变现→规模化→进阶→搜索型出海）+ 三条教训（标题/新词/止损） | 公众号 |
| [kristoff-new-term-site-1100usd](/md/wiki/sources/kristoff-new-term-site-1100usd) | 新词破千刀复盘：抢新词→域名→1 小时搭站→模型踩坑→先上线拿排名，10 月 8 日上站到 20 日复盘破 1100 美元 | X/Twitter |
| [kristoff-new-term-site-followup](/md/wiki/sources/kristoff-new-term-site-followup) | 新词站复盘补充：新词别迷信 Google 趋势、新站也要发外链、博客页承接 GEO 长尾、付费墙要少一次跳转 | X/Twitter |
| [small-site-password-login](/md/wiki/patterns/small-site-password-login) | 小站免 Google 账号登录：注册门槛本身就是付费漏斗上的漏点，以及何时可放宽验证强度 | X/Twitter |
| [cancan-new-term-radar-practice](/md/wiki/sources/cancan-new-term-radar-practice) | 新词雷达实操笔记：zhuyansen/new-term-radar 首跑只记基线不出词，补的是 Trends 之前那一截 | X/Twitter |
| [cloudhu-ai-overseas-website-tutorial](/md/wiki/sources/cloudhu-ai-overseas-website-tutorial) | CloudHu：面向小白的 AI 出海建站教程——找需求关键词→AI 做站→Vercel 部署→可选买域名全流程 | X/Twitter |
| [fxiaoyuan-site-seo](/md/wiki/sources/fxiaoyuan-site-seo) | SEO 小平：外贸独立站避开内卷，纯血小语种策略（本土域名+本地服务器+真实搜索量关键词+AI 原生创作），投产比远超英语市场 | 公众号 |
| [aichuhai-dev](/md/wiki/products/aichuhai-dev) | droidHZ 的 AI 出海导航站：12 模块分类 + 话题驱动 + 用户参与 | 产品 |
| [moore-wechat-article-downloader](/md/wiki/products/moore-wechat-article-downloader) | 公众号内容情报库 Skill：4 大场景 + SQLite 状态 + 评论互动 | 产品 |
| [first-time-dollar-oneyear](/md/wiki/sources/first-time-dollar-oneyear) | 第一次赚美元：新手到 5 站 + 1 千元/月，复盘 28 节付费课程 | 公众号 |
| [ai-traffic-geo](/md/wiki/sources/ai-traffic-geo) | 如何查看 AI 流量做好 GEO：3 来源 / 4 方法 / 5 类适配 | 公众号 |
| [sell-air-mvp](/md/wiki/sources/sell-air-mvp) | 卖空气验证需求：Pieter Levels 预售 + 4 步 SOP | 公众号 |
| [nextjs-vuln-bill](/md/wiki/sources/nextjs-vuln-bill) | Next.js Image 漏洞账单爆炸：真实事件 + 4 套解决方案 | 公众号 |
| [template-sop](/md/wiki/sources/template-sop) | 基于模板的上站 SOP：3 大类模板 + AI 编程适配 | 公众号 |
| [overseas-website-conversion-loop](/md/wiki/patterns/overseas-website-conversion-loop) | 出海网站的流量-信任-支付闭环：调研定位→设计搭建→文案转化→上线变现，用跳出、CTA 点击和完成率驱动迭代 | 公众号 |
| [recruit-workbuddy](/md/wiki/sources/recruit-workbuddy) | WorkBuddy AI 招聘流水线：简历处理从 8 小时压到 0 分钟 | 公众号 |
| [hr-resume-skill](/md/wiki/concepts/hr-resume-skill) | 自定义 Skill + 连接器 + 自动化 三层架构 | 概念 |
| [recruitment-workbuddy](/md/wiki/concepts/recruitment-workbuddy) | WorkBuddy 在企业 HR 招聘场景的落地方案 | 概念 |
| [agent-launch-personal-site](/md/wiki/sources/agent-launch-personal-site) | Agent 口喷上线个人网站：6 步极简部署 + kongge.space 实战 | 公众号 |
| [seo-basics](/md/wiki/concepts/seo-basics) | SEO 基础四件套：HTTP 协议/互联网/爬虫/外链，为什么各平台外链数据不一致，AI 搜索为何不自建爬虫 | 公众号 |
| [adsense-us-tax-form](/md/wiki/sources/adsense-us-tax-form) | AdSense 美国税务信息（W-8BEN 表 + 中美税收条约）10 分钟填表 | 公众号 |
| [maynorai-cc-domain-trap-review](/md/wiki/sources/maynorai-cc-domain-trap-review) | MomoAI：视频模板站批量上站复盘，.cc 等便宜垃圾后缀致 GSC Sitemap/抓取卡死与选型建议 | X/Twitter |
| [qianshuixia-seo-foundation-guide](/md/wiki/sources/qianshuixia-seo-foundation-guide) | 浅水虾：SEO 地基怎么打？五大能力拼图、三级阶梯练手站与先收词再建站铁律 | X/Twitter |
| [jiang-yunhe-first-100-usd-new-word-playbook](/md/wiki/sources/jiang-yunhe-first-100-usd-new-word-playbook) | 蒋云何：副业出海小白首日破百刀，5 天破千刀的新词经验分享 | X/Twitter |
| [echo-ai-site-5-days-1500-usd](/md/wiki/sources/echo-ai-site-5-days-1500-usd) | 弗里：AI 网站出海 5 天 1500 刀复盘，付费墙阶梯设计与专属新词雷达 | X/Twitter |
| [yaohongan-keyword-radar-workflow](/md/wiki/sources/yaohongan-keyword-radar-workflow) | 虹安：找词雷达工作流，2 天从买域名到出单的完整流程 | X/Twitter |
| [wavborn-keyword-screening-playbook](/md/wiki/sources/wavborn-keyword-screening-playbook) | wavborn：选词三板斧——Trends 比值法、前十占位检查与 72 组词验证率 | X/Twitter |
| [gefei-game-site-vs-tool-site-roi](/md/wiki/sources/gefei-game-site-vs-tool-site-roi) | 哥飞：游戏站 vs 工具站的 ROI 对比，为什么新人还在做游戏站 | X/Twitter |
| [vinsin-hu-four-sites-four-roles](/md/wiki/sources/vinsin-hu-four-sites-four-roles) | 子正：4 个站不是 4 份工作，是 4 种角色 | X/Twitter |
| [buildwithzhu-unit-converters-case](/md/wiki/sources/buildwithzhu-unit-converters-case) | Jiang Zhu：UnitConverters 无聊工具站靠 AdSense 年入 25 万美元 | X/Twitter |
| [bozhou-overseas-path-warning](/md/wiki/sources/bozhou-overseas-path-warning) | 泊舟：出海路径警示公告——Web 建站 / X / YouTube 的变现门槛 | X/Twitter |
| [bainian-seo-daily-002-higgsfield-teardown](/md/wiki/sources/bainian-seo-daily-002-higgsfield-teardown) | 百年 AI×出海：SEO 日课 002 拆 Higgsfield——4000 万月访问到 8800 个投稿页 | X/Twitter |
| [ai-robert-cpc-keyword-valuation](/md/wiki/sources/ai-robert-cpc-keyword-valuation) | AI Robert：用 CPC 判断一个词值不值钱——同月搜量 1.8 万，单价差 3 倍 | X/Twitter |
| [gefei-friends-20-advice-for-indie-devs](/md/wiki/sources/gefei-friends-20-advice-for-indie-devs) | 哥飞的朋友们：给独立开发者的 20 条建议（2023 年社群百人里程碑） | 付费社群 |
| [yaohongan-geo-five-actions-guide](/md/wiki/sources/yaohongan-geo-five-actions-guide) | 虹安：GEO 五个动作——让 AI 在回答里提到你，含 12 个案例与 10 项自查清单 | X/Twitter |
| [sitin-overseas-toolchain](/md/wiki/sources/sitin-overseas-toolchain) | sitin：一个人独立跑完出海项目的完整工具链 | X/Twitter |
| [yikun-seven-hot-word-site-types](/md/wiki/sources/yikun-seven-hot-word-site-types) | yikun：出海做热词站的 7 种形态（按上手难度排序） | X/Twitter |
| [jinjingx3-new-word-speed-war](/md/wiki/sources/jinjingx3-new-word-speed-war) | JK3：抢新词拼的不是工具而是谁更早动手 | X/Twitter |
| [chirs-pro-new-word-definition](/md/wiki/sources/chirs-pro-new-word-definition) | 野径：新词定义与从新词到出单的完整链路 | X/Twitter |
| [harries-steele-efficiency-vs-profit](/md/wiki/sources/harries-steele-efficiency-vs-profit) | Harries：一天上线一个网站，真的值得骄傲吗 | X/Twitter |
| [benben-musk-hustle-vs-own-product](/md/wiki/sources/benben-musk-hustle-vs-own-product) | 月川：别当马斯克的人肉电池，做自己的网站和程序 | X/Twitter |
| [huangyun-overseas-money-mindmap](/md/wiki/sources/huangyun-overseas-money-mindmap) | 黄赟：《出海赚钱》实战思维导图——产品构思/流量获取/技术栈 | X/Twitter |
| [sagasu-2026-seo-backlink-strategy](/md/wiki/sources/sagasu-2026-seo-backlink-strategy) | SagaSu：2026 SEO 新手必看——外链大变局、Google 新规与 90 天执行路径 | X/Twitter |
| [charlie-niche-seo-site-50k-case](/md/wiki/sources/charlie-niche-seo-site-50k-case) | Charlie0：沈一独立开发实战——英文细分站从 0 到 5 万美金案例复盘 | X/Twitter |
| [bainian-seo-daily-001-downloader-to-checker](/md/wiki/sources/bainian-seo-daily-001-downloader-to-checker) | 百年 AI×出海：SEO 日课 001｜从 Downloader 到 Checker 找词推演 | X/Twitter |
| [seo-hosting-selection](/md/wiki/sources/seo-hosting-selection) | AI Robert：出海建站服务器选型（Vercel / Cloudflare / Railway）与免费起步建议 | X/Twitter |
| [seo-stripe-reverse-product-discovery](/md/wiki/sources/seo-stripe-reverse-product-discovery) | AI Robert：从 Stripe 收银台倒着找出海产品与高意向付费词 | X/Twitter |
| [seo-zero-cost-trend-watch](/md/wiki/sources/seo-zero-cost-trend-watch) | AI Robert：出海找词零成本技巧——盯 X 上 AI 新发布自动挑词 | X/Twitter |
| [baokuan-title-generator-skill](/md/wiki/sources/baokuan-title-generator-skill) | 公众号爆款标题 Skill：16 种模板 + 双模型协同（fable5 + GPT-5.6） | 公众号 |
| [baokuan-title-generator-skill](/md/wiki/products/baokuan-title-generator-skill) | 公众号爆款标题 Skill 产品页 | 产品 |

### Agent 工程 (Agent Engineering)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [ai-agent-team-9-stages](/md/wiki/sources/ai-agent-team-9-stages) | Anthropic 9阶段搭建Agent团队：从单个Agent到生产级协作，三层架构 | 公众号 |
| [zeroagent-01-tech-stack](/md/wiki/sources/zeroagent-01-tech-stack) | 从码农到工匠：从零构建 Agent（一）——技术选型，Go/Python 两次弯路后全栈 TypeScript 的必选项结论 | 微信公众号 |
| [zeroagent-02-llm-interaction](/md/wiki/sources/zeroagent-02-llm-interaction) | 从码农到工匠：从零构建 Agent（二）——大模型交互，Responses API 请求/响应结构与六种用法 | 微信公众号 |
| [zeroagent-03-agent-loop](/md/wiki/sources/zeroagent-03-agent-loop) | 从码农到工匠：从零构建 Agent（三）——Agent Loop 与 ReAct，四阶段闭环、SSE 事件映射与三种终止条件 | 微信公众号 |
| [zeroagent-04-function-calling](/md/wiki/sources/zeroagent-04-function-calling) | 从码农到工匠：从零构建 Agent（四）——Function Calling，5 个本地工具与 Strict Mode 取舍、并发执行与顺序回填 | 微信公众号 |
| [zeroagent-05-mcp](/md/wiki/sources/zeroagent-05-mcp) | 从码农到工匠：从零构建 Agent（五）——MCP 工具协议，命名空间隔离与 In-Memory 测试策略 | 微信公众号 |
| [zeroagent-06-skills](/md/wiki/sources/zeroagent-06-skills) | 从码农到工匠：从零构建 Agent（六）——Skills 与渐进式披露，前言/全文/引用三级加载机制 | 微信公众号 |
| [zeroagent-07-session-management](/md/wiki/sources/zeroagent-07-session-management) | 从码农到工匠：从零构建 Agent（七）——Session 管理，SQLite 零依赖持久化与上下文注入回写 | 微信公众号 |
| [zeroagent-slash-commands](/md/wiki/sources/zeroagent-slash-commands) | 从码农到工匠：从零构建 Agent（八）——可复用的 Slash Commands，把高频 Prompt 固化为可复用模板 | 微信公众号 |
| [zeroagent-09-subagent](/md/wiki/sources/zeroagent-09-subagent) | 从码农到工匠：从零构建 Agent（九）——SubAgent，任务委派、上下文隔离与工具白名单收敛 | 微信公众号 |
| [zeroagent-10-model-management](/md/wiki/sources/zeroagent-10-model-management) | 从码农到工匠：从零构建 Agent（十）——Model 管理，Provider 配置、模型注册与运行时切换 | 微信公众号 |
| [zeroagent-11-extension](/md/wiki/sources/zeroagent-11-extension) | 从码农到工匠：从零构建 Agent（十一）——Extension 扩展，模型解耦与三级事件分层 | 微信公众号 |
| [agent-tech-stack-selection](/md/wiki/concepts/agent-tech-stack-selection) | Agent 技术选型：交互层 TypeScript 是必选项，可测试性与可观测性必须第一天就埋进去 | 公众号提炼 |
| [responses-api-agent-loop](/md/wiki/concepts/responses-api-agent-loop) | Responses API：把 Agentic Loop 打包进协议层的事实标准接口，及其能力边界与实测差异 | 公众号提炼 |
| [dewu-multi-agent-three-reversals](/md/wiki/sources/dewu-multi-agent-three-reversals) | 得物技术（微辣帝）：多 Agent 架构的三次反转——控制权从中心节点经共享状态下沉到执行者，中间件巡检落地案例 | 微信公众号 |
| [multi-agent-control-rights](/md/wiki/concepts/multi-agent-control-rights) | 多 Agent 控制权归属三次反转：Master Agent / 任务看板 / Advisor 三种协作方式的选择轴与两个边界前提 | 公众号提炼 |
| [harness-engineering-practice](/md/wiki/sources/harness-engineering-practice) | AI不缺智商缺纪律：harness工程化实践，四阶段演进、19节点链路、7维评测 | 公众号 |
| [deepseek-harness](/md/wiki/products/deepseek-harness) | DeepSeek 开源的可组装 Agent 底盘：模型、工具、Skill、沙箱、控制流与 UI 一切皆插件 | 用户原创 |
| [deepseek-harness-summary](/md/wiki/summaries/deepseek-harness-plugin-first-agent-runtime) | DeepSeek Harness 原创材料精读：五个关键洞察、长期资产判断及插件系统待验证边界 | Wiki 摘要 |
| [plugin-first-agent-runtime](/md/wiki/patterns/plugin-first-agent-runtime) | 插件优先 Agent Runtime：极简稳定内核 + 标准化可替换组件，像 Agent 世界的 foobar2000 | 用户原创 |
| [mission-driver](/md/wiki/concepts/mission-driver) | Mission Driver 声明式任务驱动引擎，Loop Engineering 参考实现，多层嵌套局部容错 | 公众号 |
| [dao-fa-shu-qi](/md/wiki/concepts/dao-fa-shu-qi) | 道法术器：中国传统文化中解决问题的四层框架（思路→流程→执行→工具） | 原创/概念整理 |
| [ai-asset-map](/md/wiki/concepts/ai-asset-map) | AI 资产地图：从 Agent 花名册走向可管理的数字资产关系图，治理 100+ Agent 的五类盲区 | 公众号 |
| [setup-matt-pocock-skills](/md/wiki/concepts/setup-matt-pocock-skills) | Matt Pocock 前置配置 skill：prompt-driven 对话，把「工单在哪、标签叫什么、文档放哪」一次落地 | 公众号 |
| [engineering-skills](/md/wiki/concepts/engineering-skills) | Matt Pocock 工程化 AI 编程 skill 体系，读配置执行，setup 是所有 flow 的 precondition | 公众号 |
| [agentscope-enterprise-platform](/md/wiki/concepts/agentscope-enterprise-platform) | 企业级 Agent 平台工程外壳：workspace 文件化角色/记忆/技能、沙箱 SPI + 状态持久化、skill 自学习闭环，含 AgentScope 坑点 | 公众号 |
| [durable-agent-agentcore](/md/wiki/sources/durable-agent-agentcore) | 刘军：Durable Agent 详解——五封邮件的崩溃恢复示例，AgentScope 持久执行内核 + AgentCore Brain-Hands 分离 | 公众号 |
| [agentteams-dashboard](/md/wiki/products/agentteams-dashboard) | 多 Agent 团队控制面：组织权限、项目任务、Skill/MCP/模型资产、运行时与编码 CLI 执行审计 | 产品 |
| [agentscope-layering](/md/wiki/concepts/agentscope-layering) | AgentScope 分层架构：无状态 ReAct 内核 + 组合式外壳 + 18 类扩展，洋葱 4 点+管道 1 点中间件，112 处 @Deprecated 双轨债 | 公众号 |
| [agentscope-governance](/md/wiki/concepts/agentscope-governance) | Agent 平台治理三大支柱：权限六步管线（独立引擎+HITL）、优雅停机三原则（先存后断+阶段边界+按requestId）、统一事件流（31种event+CustomEvent逃生舱） | 公众号 |
| [agent-token-architecture](/md/wiki/concepts/agent-token-architecture) | Agent 的本质：用 Token 换架构，控制流从开发期迁移到运行时，三年技术脉络 ReAct→FC→MCP→Skills | 公众号 |
| [llm-context-and-token](/md/wiki/sources/llm-context-and-token) | LLM 上下文窗口与 Token 原理：128k 公摊、BPE 子词切分、Prompt 工程四要素 | 公众号 |
| [llm-context-and-token-summary](/md/wiki/summaries/llm-context-and-token) | LLM 上下文与 Token 原理精读：自回归生成 + 子词分词 + 128k 公摊 + Prompt 四要素 | Wiki 摘要 |
| [context-window-public-area](/md/wiki/concepts/context-window-public-area) | 上下文窗口的公摊面积：五大公摊来源 + 实际可用空间估算 + 长上下文三大副作用 | Wiki 推导 |
| [agentscope-multi-agent](/md/wiki/concepts/agentscope-multi-agent) | 多 Agent 编排三件套：spawn/send 原语、超时收编后台任务不丢弃、子事件并入父流、跨副本三段式路由 | 公众号 |
| [multi-agent-design](/md/wiki/sources/multi-agent-design) | 多 Agent 系统设计哲学：六层架构、四天花板、五角色、三协作模式、四通信方式、七生产难点、五实践五反模式 | 公众号 |
| [agent-sandbox-k8s](/md/wiki/sources/agent-sandbox-k8s) | Agent Sandbox：K8s SIG 项目（kubernetes-sigs/agent-sandbox），声明式 CRD 编排隔离有状态单例沙箱，WarmPool 预热池 + RuntimeClass 接 gVisor/Kata，Agent 执行层基础设施 | 公众号 |
| [agent-sandbox-three-layer-model](/md/wiki/concepts/agent-sandbox-three-layer-model) | Agent 沙箱三层模型：隔离边界（OpenSandbox）/ 能力控制（nono）/ 策略治理（护栏），正交对照与五场景选型 | 原创综合 |
| [agent-sandbox-survey](/md/wiki/sources/agent-sandbox-survey) | Agent Sandbox 调研与选型：L0–L4 五层分层 + 九大主流方案选型矩阵（AX / Substrate / DSec / OpenSandbox / CubeSandbox / E2B 等） | 公众号 |
| [deepseek-dsec-sandbox-infrastructure](/md/wiki/sources/deepseek-dsec-sandbox-infrastructure) | DeepSeek DSec 论文解读：一天 300 万沙盒，四级异构后端（FnCall/Container/MicroVM/FullVM）+ 训练与沙箱生命周期解耦 | 公众号 |
| [hitw93-claude-code-architecture-and-governance](/md/wiki/sources/hitw93-claude-code-architecture-and-governance) | Tw93：你不知道的 Claude Code——架构、治理与工程实践半年全景 | X/Twitter |
| [lxfater-hermes-agent-newsletter-second-brain](/md/wiki/sources/lxfater-hermes-agent-newsletter-second-brain) | 铁锤人：Hermes Agent 工作流——用顶级 AI Newsletter 构建第二大脑 | X/Twitter |
| [addyosmani-the-orchestration-tax](/md/wiki/sources/addyosmani-the-orchestration-tax) | Addy Osmani：编排税（The Orchestration Tax）——启动更多 Agent 不等于更多产出，人是唯一的串行瓶颈 | X/Twitter |
| [khazix-agent-automation-system](/md/wiki/sources/khazix-agent-automation-system) | 数字生命卡兹克：折腾了一年，毫无保留地分享我的 Agent 自动化系统（中台+本地+CI） | X/Twitter |
| [sujingshen-deepseek-harness-super-agent-reading](/md/wiki/sources/sujingshen-deepseek-harness-super-agent-reading) | SagaSu：细读 DeepSeek Harness Super-agent 设计——不是更聪明，是不用你盯着 | X/Twitter |
| [zen-with-ai-deepseek-super-agent-architecture](/md/wiki/sources/zen-with-ai-deepseek-super-agent-architecture) | 山景城小路：细读 DeepSeek Super-agent 架构长文——把计算机经典机制搬进 Agent 系统 | X/Twitter |
| [dannykkg-ai-sandbox-primer](/md/wiki/summaries/dannykkg-ai-sandbox-primer) | Sandbox入门：≠Docker≠VM；六类受限资源（文件/进程/网络/凭据/算力/生命周期）；预分配+拦截双层防御；三道防线+7问自检 | X/Twitter |
| [agent-flow-vs-general](/md/wiki/sources/agent-flow-vs-general) | 从 Agent Flow 到 AI Native：通用 Agent 是「饮鸩止渴」；最小任务单元、Hardcode 是美丽的、AI Native 本质是解决用户问题、基建要 LLM-friendly、组织链路要足够短 | 公众号 |
| [linux-interrupt-overview](/md/wiki/sources/linux-interrupt-overview) | Linux 中断管理概述：顶半部/底半部分层架构，三大底半部机制（Softirq/Tasklet/Workqueue）特点与适用场景 | 公众号 |
| [microsoft-autogen-multagent](/md/wiki/sources/microsoft-autogen-multagent) | 微软开源 AutoGen：多智能体框架，ConversableAgent 万物皆可对话，GroupChat 团队协作，v0.4 async-first 分布式架构，vs LangGraph/CrewAI 对比 | 公众号 |
| [langgraph-agent-framework](/md/wiki/sources/langgraph-agent-framework) | LangGraph：LangChain 官方低阶 Agent 编排框架（33,900+ Stars），用「图」重新定义 Agent 编排，StateGraph + Checkpointer + HITL + 子图，vs AutoGen/CrewAI 对比 | 公众号 |
| [function-calling-mechanism](/md/wiki/sources/function-calling-mechanism) | 工具机制与 Function Calling：三步流程（判断/执行/回传），工具 Schema 定义（name/description/parameters），finish_reason 详解，多工具编排与多轮循环 | 公众号 |
| [llm-chat-completion-api](/md/wiki/sources/llm-chat-completion-api) | LLM 与 Chat Completion API：LLM 生成文本本质（预测下一个 token），messages 角色体系（system/user/assistant/tool），Token 与上下文窗口，temperature/max_tokens 参数 | 公众号 |
| [deepseek-api-call-multiturn](/md/wiki/sources/deepseek-api-call-multiturn) | 大模型 API 调用和多轮对话：环境准备、DeepSeek API 调用（兼容 OpenAI）、对话循环实现，最基础的「记忆」——把历史对话塞进每次请求 | 公众号 |
| [llm-batch-invariance](/md/wiki/sources/llm-batch-invariance) | AI Infra 进阶：如何让大模型输出确定的结果；GEMM/RMSNorm/Attention/NCCL 的 Batch Invariance 实现 | 公众号 |
| [packet-network-flow](/md/wiki/sources/packet-network-flow) | 跟着一个数据包，看懂整个网络传输过程：分包、封装（Encapsulation）、TCP/IP 四层数据流、各层头部结构 | 公众号 |
| [linux-task-struct-process](/md/wiki/sources/linux-task-struct-process) | 不懂 task_struct，别说你懂 Linux 进程管理：进程标识/状态/调度/内存/文件/亲缘关系六类字段，fork 创建与僵尸进程，CFS 调度器核心 | 公众号 |
| [seo-index-gate-strategy](/md/wiki/sources/seo-index-gate-strategy) | AI 说「新词全铺完」，我把建议砍成索引闸门：AI 扩候选 + 人工四问闸门，五格判断表 | 公众号 |
| [cognitive-intent-debt](/md/wiki/sources/cognitive-intent-debt) | AI 编程时代的认知债与意图债：三元债模型（技术债/认知债/意图债），理解的本质是为了参与，Vibe Coding 的自我修正，Agentic Engineering | 公众号 |
| [teach-skill](/md/wiki/sources/teach-skill) | Matt Pocock teach skill：将 AI 从应答器转化为有状态的学习教练，持久化教学空间（MISSION/RESOURCES/learning-records），动机澄清前置，递进式课时 | 公众号 |
| [agentscope-finale](/md/wiki/concepts/agentscope-finale) | Agent 平台上生产决策地图：扩展生态 SPI 收口、5 处双轨债 3.0 清理方案、P0-P3 可勾选 checklist | 公众号 |
| [agentscope-skills](/md/wiki/concepts/agentscope-skills) | AgentScope Skills 技能系统：Agent 世界的动态链接器，四步加载（符号表→重定位→加载→卸载），SkillRepository 对标 LD_LIBRARY_PATH，确定性协处理器 | 公众号 |
| [agentscope-managed-agents](/md/wiki/concepts/agentscope-managed-agents) | AgentScope 2.0 Managed Agents 运行时底座：Brain/Hands 分离、三种 Worker 模式（Local/Cloud Sandbox/Self-hosted）、控制面/数据面/Worker 三层职责 | 公众号 |
| [agentscope-harnessagent-declarative](/md/wiki/concepts/agentscope-harnessagent-declarative) | AgentScope HarnessAgent 声明式策略：统一管理 Skill/MCP/@Tool/SubAgent 四种资源，声明式注册+中间件治理，MCP 六步权限评估，静态 vs 动态分层 | 公众号 |
| [durable-execution](/md/wiki/concepts/durable-execution) | Durable 持久可恢复执行：会话恢复≠任务恢复，六类状态对象+原子提交+Task 状态机+call/execute 两阶段+Brain-Hands 分离 | 公众号 |
| [tencentdb-agent-memory](/md/wiki/concepts/tencentdb-agent-memory) | 团队级 Agent 记忆中枢：四类资产（Chat Memory/Skill/Wiki/CodeGraph）+ Memory Hub 治理，L0-L3 分层记忆 | 公众号 |
| [agelloop-skill](/md/wiki/concepts/agelloop-skill) | AgentLoop Skill 评估优化六步闭环：可观测→离线评估→Bad Case 优化→迭代验证，Skill+Harness 双线策略 | 公众号 |
| [deepseek-v4-omp-pi](/md/wiki/concepts/deepseek-v4-omp-pi) | DeepSeek V4 Flash + OMP/Pi 配置指南：四项 Agent 基准超 V4 Pro，原生 Responses API + 内置联网搜索，OMP/Pi 内置 provider 即配即用 | 公众号 |
| [ai-friendly-backend](/md/wiki/concepts/ai-friendly-backend) | 后端架构 AI Friendly 标准与路径：六类事实层、四大产物、Harness 七层、三阶段演进（Copilot→Coworker→Operator 黑灯工厂）、11 步 Roadmap | 公众号 |
| [opencode-ralph-loop](/md/wiki/sources/opencode-ralph-loop) | 自指完成循环工程实现：Agent 承担完成判断，`<promise>` 信号规约，检测信号/注入延续/管理状态三职责，零依赖 400 行单文件 | GitHub |
| [deepseek-harness-agent-formula](/md/wiki/concepts/deepseek-harness-agent-formula) | DeepSeek 开源 Harness（dsh）：Agent = Model + Harness 公式，一切皆插件、极简模式、可追溯会话 | 公众号 |
| [flow-friction](/md/wiki/concepts/flow-friction) | 流动摩擦：AI 让开发变成最快环节后，需求/设计/Review/测试之间的节奏不匹配才是真正的瓶颈 | 公众号 |
| [age-mission-driver](/md/wiki/concepts/age-mission-driver) | AGE 吸引子引导工程：从 Loop Engineering 到方向外化的期望吸引子，Mission Driver 全文件化编排 Plan 生命周期 | 公众号 |
| [harness-multiplier-effect](/md/wiki/concepts/harness-multiplier-effect) | Harness 乘数效应：Composio 测试同一模型 8 种 Harness，Pi Agent 66.7% 成功率 $0.028/任务，缓存命中率 99.93% | 公众号 |
| [cordis-dsh-vs-pi](/md/wiki/sources/cordis-dsh-vs-pi) | Cordis 解决什么：DSH 用 Cordis 管理跨插件关系（Loader/Fiber/effect/Service/Context），Pi 把清理交给扩展作者。两条 Provider 变化路径 + 所有权规则 + 半途失败回收 | 公众号 |
| [frontend-skill-team-coding](/md/wiki/sources/frontend-skill-team-coding) | 阿里云团队前端 Skill 驱动的团队 AI Coding 实践：五维结构（When/What/Don't-Why/How/Map）、四个落地案例（Status看板/CFD升级/AIOps设计直码/国际化流水线）、R2C 需求转代码 | 公众号 |
| [langchain-agent-wechat](/md/wiki/sources/langchain-agent-wechat) | Node + LangChain.js v1 搭公众号 Agent 流水线：七步落地 ReAct/Harness/MCP/SubAgent/Skill，DeepSeek V4 双模型分工，8 个避坑 | 公众号 |
| [sba-agentscope-announcement](/md/wiki/sources/saa-agentscope) | Spring AI Alibaba 与 AgentScope 定位区别：Graph 工作流 vs Agentic 最大化模型，Java 智能体两条路线融合趋势 | java2ai.com |
| [sba-agentscope-summary](/md/wiki/summaries/saa-agentscope) | Spring AI Alibaba vs AgentScope-Java 定位精读：四条路线差异 + 生态融合 + 路线图 v1.0 | Wiki 摘要 |
| [graph-vs-agentic-java-frameworks](/md/wiki/patterns/graph-vs-agentic-java-frameworks) | Graph vs Agentic：Java 智能体框架两条设计路线的选型决策框架 | Wiki 推导 |
| [why-people-use-pi](/md/wiki/sources/why-people-use-pi) | 为什么越来越多人用 Pi：200 Token prompt + 4 原语工具，缓存命中率 99.93%，$0.028/任务 | 公众号 |
| [why-people-use-pi-summary](/md/wiki/summaries/why-people-use-pi) | Pi 极简哲学精读：原语优先 vs 脚手架完整，与 DSH 加法路线的对照 | Wiki 摘要 |
| [primitives-vs-scaffolding](/md/wiki/patterns/primitives-vs-scaffolding) | 原语优先 vs 脚手架完整：Agent 工具设计的两种极端范式对比 | Wiki 推导 |
| [dsh-tech-hype-or-not](/md/wiki/sources/dsh-tech-hype-or-not) | DeepSeek Harness 是技术人自嗨？反驳批评，从四种工作模式与 Cordis 插件架构看 DSH 真正的差异化 | 公众号 |
| [dsh-tech-hype-or-not-summary](/md/wiki/summaries/dsh-tech-hype-or-not) | DSH 四模式与 Cordis 插件架构精读：Harness 是工程系统而非产品功能，四模式 = 四份插件清单 | Wiki 摘要 |
| [dsh-four-modes](/md/wiki/patterns/dsh-four-modes) | DSH 四种工作模式：插件清单驱动的 Agent 能力切换，preset 抽象让「切换模式」=「换职业」 | Wiki 推导 |
| [dsh-vs-continuum-acp](/md/wiki/sources/dsh-vs-continuum-acp) | DSH 临时 Plugin 挂载不是自我进化：从 Runtime 实验走向工程闭环，四类基础设施缺一不可 | X |
| [dsh-vs-continuum-acp-summary](/md/wiki/summaries/dsh-vs-continuum-acp) | DSH 工程比较与自修改治理精读：Cordis 边界 + Self-Harness/DGM + 组件组合非线性 + 四类工程闭环 | Wiki 摘要 |
| [agent-self-modification-closure](/md/wiki/concepts/agent-self-modification-closure) | Agent 自修改的工程闭环：临时插件挂载只是 candidate，评测/隔离/发布/责任归属缺一不可 | Wiki 推导 |
| [dsh-complete-guide](/md/wiki/sources/dsh-complete-guide) | DSH 完全指南：浏览器优先 + 133 插件 + config 关闭任意插件 + trajectory 视图 + headless/CI/MCP | X |
| [dsh-complete-guide-summary](/md/wiki/summaries/dsh-complete-guide) | DSH 完全指南精读：浏览器应用、MCP 配置、Trajectory 暴露、profile 抽象 vs 闭源 CLI 的工程差异 | Wiki 摘要 |
| [dsh-browser-first-configurable-harness](/md/wiki/concepts/dsh-browser-first-configurable-harness) | 浏览器优先的完全可配置 Harness：DSH 与 Claude Code/Codex 的四项核心工程差异 | Wiki 推导 |
| [dsh-superagent-active-agent-architecture](/md/wiki/concepts/dsh-superagent-active-agent-architecture) | 主动型 Coding Agent 架构设计：DSH Super-agent 五大工程常识与后厨美学模型 | 公众号 |
| [fanbing-dsh-superagent-engineering-common-sense](/md/wiki/summaries/fanbing-dsh-superagent-engineering-common-sense) | 增长黑客范冰：解读 dsh-superagent 精读摘要——主动型 Agent 五大工程常识与后厨美学 | 公众号 |
| [shao-meng-google-5day-ai-agents-course](/md/wiki/sources/shao-meng-google-5day-ai-agents-course) | Google 官方「5天 AI Agents 课程」深度解读：从 Vibe Coding 到生产级 Agent 范式 | X/Twitter |
| [yihui-loop-engineering-explained](/md/wiki/sources/yihui-loop-engineering-explained) | yihui：Loop Engineering 到底是什么？从人肉循环到自主工程闭环 | X/Twitter |
| [katelyn-lesse-new-problems-for-engineers](/md/wiki/sources/katelyn-lesse-new-problems-for-engineers) | Anthropic 平台工程负责人 Lesse：上千个 AI 智能体一起干活，还缺程序员解决四个难题 | 个人博客 |
| [leo-xiaolei-369-video-agent-tools](/md/wiki/sources/leo-xiaolei-369-video-agent-tools) | 刘老板：369 个开源仓库——AI Agent 视频生成、自动化剪辑与代码动效渲染 | X/Twitter |
| [langchain-five-components-company-harness](/md/wiki/sources/langchain-five-components-company-harness) | LangChain：构建「公司级 Harness」的五个组件——身份/记忆/沙箱/调度/住在 Slack | LangChain Blog |
| [xudong-langchain-company-harness-insight](/md/wiki/sources/xudong-langchain-company-harness-insight) | Xudong Han：LangChain 公司级 Harness 中文解读——Agent 以谁的身份干活 | X/Twitter |
| [loop-engineering-guide](/md/wiki/sources/loop-engineering-guide) | Loop Engineering 完整指南：五个部件 + 状态层六件套、三道筛子与六种实战场景 | X/Twitter |

### 商业模式 (Business Models)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [yc-s26-agent-infrastructure](/md/wiki/summaries/yc-s26-agent-infrastructure) | YC S26 趋势观察：Agent 基础设施、AI 原生服务公司与机器人/工业硬件升温 | 公众号 |
| [ai-era-wealth-creation](/md/wiki/sources/ai-era-wealth-creation) | AI时代造富公式：现金流/股权/流动性三路径，四大赛道分析 | 公众号 |
| [digital-products-side-income](/md/wiki/concepts/digital-products-side-income) | 数字产品副业：国内卖19.9国外卖9美元，Gumroad/Payhip/Sellfy 平台对比 | 公众号 |
| [indie-product](/md/wiki/concepts/indie-product) | 独立开发者三维度找需求：用户群体×产品形态×收费模式，「官方不管、用户很痒、有人愿意付钱」 | 公众号 |
| [boss-business-model](/md/wiki/concepts/boss-business-model) | 招聘信息分析：用 BOSS 直聘做商业模式研究，岗位类型暴露获客/销售/交付模式，横向对比拼出行业地图 | 公众号 |
| [dongqingai-xianyu-virtual-product-automation](/md/wiki/summaries/dongqingai-xianyu-virtual-product-automation) | 闲鱼虚拟资料自动化：AI+MCP把选品/制作/上架/发货变流水线，人只做定方向+质量检查+异常处理 | X/Twitter |
| [dongqing-cashback-bot-project](/md/wiki/sources/dongqing-cashback-bot-project) | 冬青：返利机器人项目——老项目很稳，月入 3K-5k 滚雪球，种子人群+自发裂变增长策略 | X/Twitter |
| [dongqing-5-ai-money-making-projects](/md/wiki/sources/dongqing-5-ai-money-making-projects) | 冬青：普通人利用 AI 赚钱的五个项目（小红书虚拟资料/公众号+小程序/定制网站软件/内容创作/CPS 返利机器人）| X/Twitter |
| [affnom-y-traffic-arbitrage-3min-primer](/md/wiki/summaries/affnom-y-traffic-arbitrage-3min-primer) | 3分钟讲清楚流量套利：搜索套利/产品变现/网站广告三出口100美元账本示例，普通人先跑通一笔完整账再扩量 | X/Twitter |
| [ai-business-seven-layers](/md/wiki/patterns/ai-business-seven-layers) | AI 商业七层金字塔：从卖时间、内容和结果，到卖产品、系统、底层能力与资本，换层的关键是改变交付标的 | 公众号 |
| [ai-escape-speed](/md/wiki/concepts/ai-escape-speed) | AI 创业的逃逸速度：套壳为什么有价值——在下一代模型前做更多次有效迭代，含能力公式与方向/迭代两类判断 | 公众号 |
| [agent-iteration-environment](/md/wiki/patterns/agent-iteration-environment) | Agent 迭代环境闭环：Dogfood 环境自建 → 区分产品问题与基建问题 → 清障降本 → 口喷式无限迭代 | 公众号 |
| [judgment-environment-infinite-iteration](/md/wiki/sources/judgment-environment-infinite-iteration) | 《判断，环境，与无限迭代》原始归档：逃逸速度、两类判断、环境自建与无限迭代 | 公众号 |
| [dontbesilent-business-thoughts-100-part-1](/md/wiki/sources/dontbesilent-business-thoughts-100-part-1) | dontbesilent 商业思考 100 条（第一期）：商业认知、定价、对标模仿与执行力的 100 条判断 | X/Twitter |
| [dontbesilent-business-thoughts-100-part-2](/md/wiki/sources/dontbesilent-business-thoughts-100-part-2) | dontbesilent 商业思考 100 条（第二期）：卖点、毛利重定义、见路不走与快速失败的方法论 | X/Twitter |
| [mengke-160-product-sales-judgments](/md/wiki/sources/mengke-160-product-sales-judgments) | Mengke Wang：把产品卖出去最贵的 160 条判断——Apple×浙大孵化营学员手册知识点公开 | X/Twitter |
| [solo-cream-1m-ai-site-case](/md/wiki/sources/solo-cream-1m-ai-site-case) | 一个人靠 AI 做到百万美元营收：大市场切小块、营收与利润的口径差异、获客不止 SEO | 用户整理 |
| [fangxin-geo-monetization-guide](/md/wiki/sources/fangxin-geo-monetization-guide) | 方鑫：GEO 到底怎么赚钱？六类生意形态、收费、交付与验收全解析 | X/Twitter |
| [koda-ordinary-person-million-guide](/md/wiki/sources/koda-ordinary-person-million-guide) | Koda：2026 年普通人如何一年赚 100 万——破除思维遮蔽与商业闭环实操 | X/Twitter |
| [weiyux-xianyu-6-years-experience](/md/wiki/sources/weiyux-xianyu-6-years-experience) | 动物园园长：36岁做了6年闲鱼，劝大家不要想太多！避坑与实战经验 | X/Twitter |
| [yihui-skillry-first-10k-mrr-order](/md/wiki/sources/yihui-skillry-first-10k-mrr-order) | Yihui：Skillry 一月破万刀复盘，写代码前先想明白商业模式与营销打法 | X/Twitter |
| [teamai-individual-team-golden-trio](/md/wiki/sources/teamai-individual-team-golden-trio) | 沈淦：一个人+AI 就是一个团队——上下文工程五环节、TeamAI 黄金三件套与半自动化三段流水线 | 公众号 |
| [context-engineering-five-links](/md/wiki/patterns/context-engineering-five-links) | 上下文工程五环节：知识库、工具调用、对话历史、项目记忆、现场清理，附上下文用量 45%~55% 硬上限 | 公众号 |
| [teamai-golden-trio](/md/wiki/patterns/teamai-golden-trio) | TeamAI 黄金三件套：Spec / Skill / Test Asset，含 Skill 开发五原则、G1-G6 门禁与「两头有人中间没人」流水线 | 公众号 |
| [ai-xiaomu-50k-followers-monetization](/md/wiki/sources/ai-xiaomu-50k-followers-monetization) | 黄小木：半年 5 万粉变现 6 位数全复盘——起号四阶段与七种变现模型 | X/Twitter |
| [jasoncharlie-selfmedia-lead-generation](/md/wiki/sources/jasoncharlie-selfmedia-lead-generation) | 大熊 Jason：普通人自媒体获客方法论——线索型内容五步模板与单号闭环 | X/Twitter |
| [todaykan-xhs-personal-selling-guide](/md/wiki/sources/todaykan-xhs-personal-selling-guide) | TodayKan：小红书个人售卖从 0 到第一单保姆级教程——无需运营与开店门槛 | X/Twitter |
| [sylvieailab-12068-overseas-products-analysis](/md/wiki/sources/sylvieailab-12068-overseas-products-analysis) | 希希 AI 实验室：拆解 12,068 个 TrustMRR 出海项目真实大盘与反直觉规律 | X/Twitter |

### 内容工作流 (Content Workflows)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [hermes-obsidian-knowledge-base](/md/wiki/sources/hermes-obsidian-knowledge-base) | Obsidian + Hermes Agent：Source→Topic→Draft→Published 四步流转，内容库变生产线 | 公众号 |
| [canghe-codex-obsidian-wechat-workflow](/md/wiki/sources/canghe-codex-obsidian-wechat-workflow) | 苍何：Codex + Obsidian 公众号创作工作流开源沉淀——标题、排版与数据驱动 | X/Twitter |
| [binghe-wechat-formatting-skill-v2](/md/wiki/sources/binghe-wechat-formatting-skill-v2) | 冰河：公众号排版工具 Skill V2.0——从写完到发布双 Skill 联动 | X/Twitter |
| [ai-chuhai-x-viral-writing-engine](/md/wiki/sources/ai-chuhai-x-viral-writing-engine) | 爱出海：X 爆款写作引擎——没有自己的数据，就用同赛道的爆款 | X/Twitter |
| [claude-prompt-strategies](/md/wiki/sources/claude-prompt-strategies) | 100个提示策略：结构化提示、推理框架、内容量产，思维框架比模型版本更重要 | 公众号 |
| [crazykaomei-aigc-hook-pipeline](/md/wiki/summaries/crazykaomei-aigc-hook-pipeline) | 单人操盘590位博主/26亿播放：前3秒钩子决定生死，13万条买家评价喂AI+5步流水线+3个Prompt | X/Twitter |
| [andyl5cc-xiaohongshu-codex-workflow](/md/wiki/summaries/andyl5cc-xiaohongshu-codex-workflow) | 用Codex做小红书2天涨1000粉：发现→拆解→模仿→迭代，AI真正降的是从看到机会到做出来的时间 | X/Twitter |
| [mixailab-workbuddy-html-pipeline](/md/wiki/summaries/mixailab-workbuddy-html-pipeline) | WorkBuddy+SRT做HTML视频：SRT当画面排期表，HTML模板可复用，后续只换mp3+srt同款视觉持续出片 | X/Twitter |
| [zhouluobo-workbuddy-feishu-content-flywheel](/md/wiki/summaries/zhouluobo-workbuddy-feishu-content-flywheel) | WorkBuddy+飞书三环飞轮：多维表格选题库→状态改「选中」触发写稿→排版 skill + 公众号 API 推草稿箱 | X/Twitter |
| [zhouluobo-workbuddy-skill-wechat-article-pipeline](/md/wiki/summaries/zhouluobo-workbuddy-skill-wechat-article-pipeline) | WorkBuddy 加两个自建 skill 实现公众号自由：排版+视觉+自动推送草稿箱，自动发布绝对不碰 | X/Twitter |
| [x-hot-topic-source-layering](/md/wiki/patterns/x-hot-topic-source-layering) | 追热点的信息源分层：源头（英文首发）/ 翻译（中文社区）/ 垂直（单领域）三层分工与速查表 | 用户整理 |
| [xiaohongshu-ecommerce-product-selection](/md/wiki/sources/xiaohongshu-ecommerce-product-selection) | 小红书电商选品全流程：选品逻辑、拼多多/抖店/巨量百应找爆品、灰豚对标、1688 供应链 | X/Twitter |
| [ai-virtual-character-tiktok-subscription](/md/wiki/sources/ai-virtual-character-tiktok-subscription) | AI 虚拟角色 TikTok 订阅变现：7 段提示词从人设到订阅费，含 Fanvue 分成与三条合规红线 | X/Twitter |
| [ai-virtual-model-account-case-study](/md/wiki/sources/ai-virtual-model-account-case-study) | AI 美女账号 9.4 万粉月入 2.8 万：Ina 案例拆解，明牌筛选与三层漏斗，赚钱核心是角色付费系统 | X/Twitter |
| [seo-keyword-root-first-tutorial](/md/wiki/sources/seo-keyword-root-first-tutorial) | 出海 SEO 找词保姆级教程：Semrush 关键词魔术工具 → Google 看对手 → Trends 对比找上升词 | X/Twitter |
| [x-tracking-forum-list](/md/wiki/sources/x-tracking-forum-list) | 做 X 必须关注的 10 个热门论坛原始归档：V2EX / 美卡论坛 / NodeSeek / 一亩三分地 / HostLoc / LinuxDo / 恩山 / LowEndTalk / r/churning / HN | 用户整理 |
| [kling-4-ai-short-drama-workflow](/md/wiki/sources/kling-4-ai-short-drama-workflow) | 可灵 4.0 AI 短剧全流程：与 Seedance 2.5 的五组实测对比、成本口径与资产图方法 | X/Twitter |

### 公众号贴图起号 (WeChat Image-Post Accounts)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [wechat-image-post-account](/md/wiki/concepts/wechat-image-post-account) | 公众号贴图形态模型：最多 9 图 + 标题 + 1000 字描述，与长文/视频号的三类流量分工、五条变现路径、2026 算法权重与平台规则边界 | X/Twitter 综合 + 2026-10 校准 |
| [wechat-image-post-account-sop](/md/wiki/patterns/wechat-image-post-account-sop) | 贴图起号五步法：需求卡 → 四页结构 → 清单式做图 → 10 个标题候选 → 单变量迭代，附银发赛道选题工程与 2026 平台约束 | X/Twitter 综合 + 2026-10 校准 |
| [wechat-tietu-cold-start-sop](/md/wiki/sources/wechat-tietu-cold-start-sop) | 贴图起号 5 步 SOP 原始归档：需求卡、标题三句筛选、三遍检查法与四个避坑点 | X/Twitter |
| [wechat-tietu-money-playbook](/md/wiki/sources/wechat-tietu-money-playbook) | 贴图变现地图原始归档：低粉爆款筛选、封面五要点、标题八方向与全链路变现矩阵 | X/Twitter |
| [wechat-tietu-beginner-guide](/md/wiki/sources/wechat-tietu-beginner-guide) | 贴图变现五类路径原始归档：流量主、带货、私域、知识付费与本地商家引流 | X/Twitter |
| [wechat-tietu-project-breakdown](/md/wiki/sources/wechat-tietu-project-breakdown) | 贴图号项目拆解原始归档：对标筛选三标准、发布量随流量阈值变化与常见问答 | X/Twitter |
| [wechat-tietu-fast-launch](/md/wiki/sources/wechat-tietu-fast-launch) | 贴图快速起号原始归档：低成本高频更新的冷启动思路与发图方向 | X/Twitter |
| [wechat-account-traffic-monetization](/md/wiki/sources/wechat-account-traffic-monetization) | 文章/贴图/视频号三入口联动原始归档：粉丝归属、收益门槛与验证提示排查 | X/Twitter |
| [wechat-silver-economy-niche](/md/wiki/sources/wechat-silver-economy-niche) | 银发蓝海赛道原始归档：评论多=要答案、转发多=要分享，钱与健康类必须先核验 | X/Twitter |

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

### AdSense 变现 (AdSense Monetization)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [英文站 AdSense 赚钱入门](/md/wiki/concepts/adsense-english-site-guide) | 流量思维+单域名单词策略+站内 SEO 细节+工具站/内容站选择 | 公众号 |
| [SEO+AdSense 从 800 到 2000 美元/月](/md/wiki/concepts/adsense-seo-800-to-2000) | 技术重写+站内 SEO+3 广告位优化，三管齐下收入翻倍 | 公众号 |
| [AdSense 账号注册与审核](/md/wiki/concepts/adsense-account-registration) | 养号、双验证、流量优先审核、Pin 码变现链路 | 公众号 |
| [AdSense 网站提交审核细节](/md/wiki/concepts/adsense-site-application-details) | 先验证 ads.txt 再验证代码段，顺序决定审核成败 | 公众号 |
| [AdSense Pin 码与实名认证](/md/wiki/concepts/adsense-pin-verification) | Pin 码平信丢失处理，人工审核上身份证+地标照 | 公众号 |
| [ancle-z-site-ads-reality](/md/wiki/sources/ancle-z-site-ads-reality) | Ancle_Z：给网站接广告，比我想的简单，比我想的不赚钱——Adsterra 接坑复盘 | X/Twitter |

---

### 数据库 (Databases)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [milvus-3.0](/md/wiki/concepts/milvus-3.0) | Milvus 3.0 GA 深度解读：lake-native 架构、Storage V3 / Loon、4 个改变工作流的能力、3 个落地门槛 | 公众号 |
| [lake-native-architecture](/md/wiki/concepts/lake-native-architecture) | 湖原生架构：将数据库存储底座直接构建在数据湖之上，manifest 列存格式按需精准取列 | 公众号 |
| [medical-kg-qa](/md/wiki/concepts/medical-kg-qa) | 基于 Neo4j 的医疗知识图谱问答系统，4.4 万实体、30 万关系、18 类问答意图 | GitHub |
| [data-governance-five-concepts](/md/wiki/concepts/data-governance-five-concepts) | 数据治理五大概念辨析：元数据、数据元、元模型、数据字典、数据模型的定义与联动 | 公众号 |

---

## 最新收录

> 见 [log.md](./log.md)

---

### 数据分析 (Analytics)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [ga4-exploration-reports](/md/wiki/concepts/ga4-exploration-reports) | GA4 探索报告 7 种核心分析方法：自由形式、漏斗、路径、细分重叠、用户分层、同类群组、用户生命周期 | 公众号 |
| [ga4-segment-vs-comparison](/md/wiki/concepts/ga4-segment-vs-comparison) | 细分、对比项、筛选条件三者辨析：作用范围与可复用性的关键区别 | 公众号 |
| [ga4-metrics-concepts](/md/wiki/concepts/ga4-metrics-concepts) | GA4 指标体系：事件级/用户级/会话级三类指标及转化率、AOV、LTV、留存率 | 公众号 |

### Agent 工程模式 (Agent Engineering Patterns)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [error-notebook-pattern](/md/wiki/patterns/error-notebook-pattern) | 错题本模式：agent 每晚复盘 commit，同一条教训出现3天即升格为硬规则，magpie 发版频率因此从168→15个/天 | X |
| [agent-router-table](/md/wiki/patterns/agent-router-table) | 路由表模式：CLAUDE.md 只放路由不放规则，agent 自行查表获取上下文，规则可独立演进 | X |
| [viral-content-monitoring](/md/wiki/patterns/viral-content-monitoring) | 爆款监控工作流：定时扫描对标账号 + 阈值判断 + 自动推送，对接免费模型实现 token 零消耗 | X |
| [agent-team-handoff-model](/md/wiki/patterns/agent-team-handoff-model) | Agent 团队交接模型：从单 Bot 到会交接的小团队——信任六原则 + 八步落地路径 + 交接契约 | X/Twitter |
| [zero-code-vibe-coding-game-workflow](/md/wiki/patterns/zero-code-vibe-coding-game-workflow) | 0 代码 Vibe Coding 游戏工作流：AI 干 90% 执行，一句话出包上传，剩下 10% 判断归人 | X/Twitter |
| [skill-over-tool](/md/wiki/patterns/skill-over-tool) | Skill 优于工具：工具是流水线的一个工位，Skill 是整条流水线的 AI 助手 | X/Twitter |
| [ub-mode-engineering-rules](/md/wiki/patterns/ub-mode-engineering-rules) | ub-mode 工程纪律：《代码整洁之道》翻译成 Agent 可校验规则 + CRAP/重复度/变异测试三道量化门禁 | X/Twitter |
| [adsense-publisher-id-site-cluster-discovery](/md/wiki/patterns/adsense-publisher-id-site-cluster-discovery) | 发布商 ID 反查站群：用 ads.txt 摸清一个站背后还有哪些站，四步 OSINT | X/Twitter |
| [context-ownership-server-vs-client](/md/wiki/patterns/context-ownership-server-vs-client) | 上下文所有权：服务端 Store 与客户端历史的取舍——所有权归属决定裁剪、隐私与迁移成本 | 公众号提炼 |
| [agent-event-decoupling](/md/wiki/patterns/agent-event-decoupling) | 模型事件与 Agent 事件解耦：SSE 加工成语义事件流，让 Loop 自身事件并入同一通道 | 公众号提炼 |
| [mcp-tool-namespace-isolation](/md/wiki/patterns/mcp-tool-namespace-isolation) | MCP 工具命名空间隔离：serverName__toolName 前缀 + 反向索引路由，多 Server 共存的基础设施 | 公众号提炼 |
| [progressive-disclosure](/md/wiki/patterns/progressive-disclosure) | 渐进式披露：上下文工程核心模式，并在 Agent Skills 中落地为前言/全文/引用三级加载 | 公众号提炼 |

### AI 产品与订阅 (AI Products & Subscriptions)

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [shared-weekly-pool](/md/wiki/concepts/shared-weekly-pool) | SpaceXSI 共用周池：Grok 与 Cursor 共享每周刷新的 AI 用量池，打破单产品独立计量 | X |
| [bot-vs-codex-context](/md/wiki/concepts/bot-vs-codex-context) | Bot vs Codex 上下文机制：Bots 类 Agent 跨会话留存 vs 会话型 Agent 每次独立上下文 | X |
| [grok-bot-app-research](/md/wiki/sources/grok-bot-app-research) | Grok Bot + 云手机四件套实操：多 Agent 竞品调研工作流，定赛道→拉商店数据→扫社媒→交叉验证 | 公众号 |
| [yaohongan-grokbot-48-use-cases](/md/wiki/sources/yaohongan-grokbot-48-use-cases) | 虹安：Grok Bot 48 个真实玩法按场景整理，含授权风险与翻车预警 | X/Twitter |
| [lzj-grok-bot-beginner-guide](/md/wiki/sources/lzj-grok-bot-beginner-guide) | 小爷：Grok Bot 保姆级新手指南——安装、充值（四合一订阅）到云电脑三坑 | X/Twitter |
| [lzj-grok-bot-xiaohongshu-ban-warning](/md/wiki/sources/lzj-grok-bot-xiaohongshu-ban-warning) | 小爷：紧急通知，Grok Bot 接管小红书已出现大批量封号 | X/Twitter |
| [azhen-grokbot-two-month-division-of-labor](/md/wiki/sources/azhen-grokbot-two-month-division-of-labor) | 阿真：使用 GrokBot 两个月后分工全公开——总控主管+六大分组+重活归 CLI 轻活归 Bot | 公众号 |
| [xhs-product-selection](/md/wiki/concepts/xhs-product-selection) | 小红书选品七看方法论：爆品值+商品价值双指标 + 监控软件开源实现 | X |
| [dongqing-xhs-product-selection](/md/wiki/sources/dongqing-xhs-product-selection) | 冬青：小红书选品方法论与监控软件开发指南原始归档，附 8 张选品表与监控界面截图 | X/Twitter |
| [distributional-convergence](/md/wiki/concepts/distributional-convergence) | 分布收敛：AI 无具体约束时趋向训练数据最常见方案，解释 AI 味和蓝紫色前端现象 | X |
| [0xjoooe-grokbot-handbook-team-collaboration](/md/wiki/sources/0xjoooe-grokbot-handbook-team-collaboration) | Joooe：Grok Bot 手把手——从 1 个 bot 到会交接的小团队，附八步可复制范本 | X/Twitter |
| [rongzhenghe-grokbot-multi-assistant-life-system](/md/wiki/sources/rongzhenghe-grokbot-multi-assistant-life-system) | Horizon：把生活和工作拆成一堆 bots——完全自动化，我只过目 | X/Twitter |

### 出海工具与方法（Global Expansion & Overseas Tools）

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [overseas-tool-stack](/md/wiki/concepts/overseas-tool-stack) | 出海工具栈全景：56个实战工具按7大方向分类（调研/SEO/设计/建站/支付/增长/分析） | X |
| [payment-platform-selection](/md/wiki/patterns/payment-platform-selection) | 支付三档选择：Lemon Squeezy（最快验证）vs Paddle（税务托管）vs Stripe（完整控制） | X |
| [competitor-research-four-step](/md/wiki/patterns/competitor-research-four-step) | 竞品调研四步法：AITDK初筛 → SiteData体检 → Similarweb拆流量 → Wayback Machine追历史 | X |
| [analytics-four-piece-set](/md/wiki/patterns/analytics-four-piece-set) | 数据分析四件套：GSC（搜索词）+ GA4（来源）+ PostHog（漏斗）+ Clarity（体验录屏） | X |
| [open-source-seo-tooling](/md/wiki/concepts/open-source-seo-tooling) | 开源 SEO 工具的自建边界：工具逻辑可开源替代，数据资产不行；6 个工具的能力映射与选型决策 | X |
| [open-source-seo-tooling-list](/md/wiki/sources/open-source-seo-tooling-list) | 6 个开源免费 SEO 工具原始归档：SEOnaut / SoPilot / SerpBear / OpenSEO / SEOMachine / Awesome Open Source SEO | X |
| [chuhaiqu-social-distribution-playbook](/md/wiki/sources/chuhaiqu-social-distribution-playbook) | 出海去孵化器：做产品容易，怎么通过推特、油管、短视频把产品卖出去？ | X/Twitter |
| [ai-jasonyu-x-creator-revenue-complete-guide](/md/wiki/sources/ai-jasonyu-x-creator-revenue-complete-guide) | 鱼总聊AI：2026 年 X 创作者收益完全指南——从零到收款实操与避坑 | X/Twitter |
| [wadezone-x-creator-14-days-blue-v-strategy](/md/wiki/sources/wadezone-x-creator-14-days-blue-v-strategy) | Koda：我前 3 天一个字没发，然后 14 天开通了 X 创作者收益 | X/Twitter |
| [aronhouyu-tiktok-operations-with-codex](/md/wiki/sources/aronhouyu-tiktok-operations-with-codex) | Aron厚玉：我把 TikTok 运营塞进了 Codex——选品、拆账号、找达人全流程自动化 | X/Twitter |
| [ai-automated-internal-link-seo](/md/wiki/patterns/ai-automated-internal-link-seo) | AI 自动内链 SEO：拿竞品前三当对照样本，阈值自算、归因只认证据、先清单后自动 | X/Twitter |
| [ai-chuhai-46-small-sites-real-revenue](/md/wiki/sources/ai-chuhai-46-small-sites-real-revenue) | 爱出海：46 个闷声发财的小站——翻完 1.5 万个收银台和 1161 份真实收入 | X/Twitter |
| [taowithsaas-ezmaker-traffic-analysis](/md/wiki/sources/taowithsaas-ezmaker-traffic-analysis) | taoWithSaaS：一个新站首月访问量破 10w+ 原来是这么做到的（强站带小站外链揭秘） | 公众号 |
| [coderjefflee-saas-seo-infrastructure](/md/wiki/sources/coderjefflee-saas-seo-infrastructure) | 子木：《SaaS SEO Playbook》第三部分——站内基建，让 Google 能看见、看懂、收录 | X/Twitter |
| [aichuhai-ai-automated-internal-links-seo](/md/wiki/sources/aichuhai-ai-automated-internal-links-seo) | 爱出海：AI 自动加内链做 SEO 原帖归档，附 Claude 自动内链英文工程书 | X/Twitter |

### AI 变现与套利（AI Monetization & Arbitrage）

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [gpt-proxy-arbitrage](/md/wiki/concepts/gpt-proxy-arbitrage) | ChatGPT代充原理：利用不同国家/地区价格差异（菲区/智利区）进行区域定价套利 | X |
| [session-token-acquisition](/md/wiki/concepts/session-token-acquisition) | Session Token 获取技术：通过特定路径提取 ChatGPT 登录态凭据用于支付协议充值 | X |
| [gray-market-customer-acquisition](/md/wiki/patterns/gray-market-customer-acquisition) | 灰产获客平台策略：抖音直播、B站软广、咸鱼黑暗森林及各平台封禁博弈 | X |
| [ai-robert-reddit-idea-validation](/md/wiki/sources/ai-robert-reddit-idea-validation) | AI Robert：出海野路子——Reddit 搜「I would pay for」+ Semrush 验证需求，30 分钟一轮高信号验证法 | X/Twitter |
| [david-ai-game-publishing-platforms](/md/wiki/sources/david-ai-game-publishing-platforms) | 大卫：4 款 AI 小游戏收入 10 万！国内外 7 个小游戏发行入口、7 步开发路径与 4 大变现避坑 | X/Twitter |
| [weiyux2021-claude-xianyu-ecommerce-workflow](/md/wiki/sources/weiyux2021-claude-xianyu-ecommerce-workflow) | 动物园园长：用 Claude 跑通闲鱼电商全流程——选品、文案、话术与运营 | X/Twitter |
| [wadezone-2026-ordinary-person-1m-guide](/md/wiki/sources/wadezone-2026-ordinary-person-1m-guide) | Koda：2026 年普通人如何一年赚 100 万——破除心理封印，直接收陌生人的钱 | X/Twitter |
| [jamesai-zero-cost-b2b-leads-in-24h](/md/wiki/sources/jamesai-zero-cost-b2b-leads-in-24h) | 在悉尼和稀泥：普通人如何在 24 小时内 0 成本拿到 B 端客资——焦虑需求与轻咨询样品 | X/Twitter |
| [btcdayu-sunyuchen-4h-dialogue-summary](/md/wiki/sources/btcdayu-sunyuchen-4h-dialogue-summary) | 大宇：4 小时对话孙宇晨精排全文——年轻人怎么抓时代机会与杠杆 | X/Twitter |
| [kyrie-codex-xianyu-customer-service-automation](/md/wiki/sources/kyrie-codex-xianyu-customer-service-automation) | Kyrie：7 分钟搭好闲鱼自动化客服——让付费的 Codex 自己赚回来 | X/Twitter |
| [zhuoyihang-wechat-shop-ecommerce-guide](/md/wiki/sources/zhuoyihang-wechat-shop-ecommerce-guide) | 在下卓一航：微信小店搞钱保姆级教程——从准备到开店全流程与熟人生态 | X/Twitter |
| [dongqing-rebate-cps-bot-passive-income](/md/wiki/sources/dongqing-rebate-cps-bot-passive-income) | 冬青：返利 CPS 机器人——月入 3-5K 长期稳定被动收入小项目 | X/Twitter |
| [renagonzaga-wechat-public-account-0-to-1](/md/wiki/sources/renagonzaga-wechat-public-account-0-to-1) | 生于Ai：公众号保姆级 0-1 起号全流程（选赛道/垂直养号/AB 转类型/AI 辅助写作/流量主变现），单账号累计 24 万+实操经验 | X/Twitter |
| [cross-platform-information-arbitrage](/md/wiki/patterns/cross-platform-information-arbitrage) | 跨平台信息差中介：不搬本体，只卖信息与配置——五个可复制样本与共性公式 | X/Twitter |
| [hyhongyu-inside-outside-information-arbitrage-09](/md/wiki/sources/hyhongyu-inside-outside-information-arbitrage-09) | 红鱼：墙内外的赚钱信息差（第九期）——插件教程、Notion 模板、Newsletter 摘要等五个样本 | X/Twitter |

### AI 工程化（AI Engineering）

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [input-attribution](/md/wiki/concepts/input-attribution) | Pi 与 DSH 输入归属：三条按循环位置互斥的裁决规则，规则是骨架，参数是插口 | 公众号 |
| [skeleton-and-port](/md/wiki/concepts/skeleton-and-port) | 骨架与插口哲学：跨集成方重复逻辑收进框架，产品差异留在调用方回调 | 公众号 |
| [vibe-coding-to-engineering](/md/wiki/sources/vibe-coding-to-engineering-ai-coding.md) | 从 Vibe Coding 到工程化 AI Coding：Spec 五要素、Context 管理、Quality Gate、Workflow State | 公众号 |
| [anthropic-unix-agent](/md/wiki/sources/anthropic-unix-agent-collaboration.md) | Anthropic 多 Agent 架构演进：Unix 管道哲学、Micro-Agent、确定性流水线解耦 | 公众号 |
| [ai-coding-three-pillar-system](/md/wiki/patterns/ai-coding-three-pillar-system) | AI 编码三支柱：流程让 AI 可控、知识库让 AI 能积累、工具让 AI 接触真实环境；注意力预算是稀缺资源 | 公众号 |
| [x-flow-ai-coding-engineering](/md/wiki/sources/x-flow-ai-coding-engineering) | x-flow 实践原始归档：17 阶段流水线、三道闸防漂移、三层知识晋升淘汰与通用工具+手册 | 公众号 |

### 内容与工具工作流（Content & Tooling Workflows）

| 页面 | 一句话 | 来源 |
|------|--------|------|
| [kkkeric-grok-bot-growth-22-bots](/md/wiki/sources/kkkeric-grok-bot-growth-22-bots) | KKKK：Grok Bot 出海增长实战——一人 + 22 个 Bot 跑通 20+ 社媒渠道、SEO/AEO 巡检与监控 | X/Twitter |
| [victor-chen-ai-workbench-six-figure-profit](/md/wiki/sources/victor-chen-ai-workbench-six-figure-profit) | victor chen：AI 工作台单月利润六位数——手把手做出第一份服务样品与报价单 | X/Twitter |
| [lufzzliz-infinite-digital-human-koubo](/md/wiki/sources/lufzzliz-infinite-digital-human-koubo) | 岚叔：保姆级无限流数字人口播教程及项目正式开源（底片动作库复用） | X/Twitter |
| [94vanai-mj-reference-image-library](/md/wiki/sources/94vanai-mj-reference-image-library) | 94 Playforge：1499 张 MJ 脸模 + 1439 张多视角姿势 + 1407 套服装参考图库 | X/Twitter |
| [nenly-zero-code-100k-indie-game-vibe-coding](/md/wiki/sources/nenly-zero-code-100k-indie-game-vibe-coding) | Nenly：万字复盘——0 代码基础如何用 AI 做出 10 万人玩过的独立游戏（4/4 篇） | X/Twitter |
| [haosen-5-video-subtitle-tools](/md/wiki/sources/haosen-5-video-subtitle-tools) | Haosen：视频字幕不想手敲？这 5 个工具按用途选——转写/提取/去硬字幕/翻译/批量 | X/Twitter |
| [gkxspace-impeccable-3d-game-playable-ads](/md/wiki/sources/gkxspace-impeccable-3d-game-playable-ads) | 余温：四个 AI 神器合集——Impeccable 去 AI 味、Hi3D 出 3D、Higgsfield 试玩广告、Sunra 掀中间商 | X/Twitter |
| [awe0-video-talkcraft-ai-promo-pipeline](/md/wiki/sources/awe0-video-talkcraft-ai-promo-pipeline) | awe0：video-talkcraft 与 video-shotcraft 组合出自动生成产品宣传片的 AI 视频 Agent | X/Twitter |
| [anhao-1439-ai-beauty-poses-database](/md/wiki/sources/anhao-1439-ai-beauty-poses-database) | 安好：1439 个 AI 美女姿势参考图库开源——中文版、可商用、可二次编辑 | X/Twitter |
| [songguoxiansen-24000-prompts-migration-guide](/md/wiki/sources/songguoxiansen-24000-prompts-migration-guide) | 松果先森：24000+ 免费提示词迁移教程——批量导出到本地，跨工具通用 | X/Twitter |
| [bubblu-ordinary-youth-10-core-competencies](/md/wiki/sources/bubblu-ordinary-youth-10-core-competencies) | Bubblu：普通年轻人破局的 10 个核心维度——从 AI 生产力到按月复盘闭环 | X/Twitter |
| [xiaohuihui-deepseek-dafeiyu-deployment-monetization](/md/wiki/sources/xiaohuihui-deepseek-dafeiyu-deployment-monetization) | 龙克星：DeepSeek「大肥鱼」人性化部署——Windows 本地装 DSH 并接入 QQ/微信/B 站 | X/Twitter |
| [lucaspei-ai-xhs-notes-skill-pipeline](/md/wiki/sources/lucaspei-ai-xhs-notes-skill-pipeline) | 裴同学：AI 全自动生产小红书笔记 2 小时 30 篇——自研工具被 1 天搭的 Skill 换掉 | X/Twitter |
| [qichen-xiaohongshu-operation-skills](/md/wiki/sources/qichen-xiaohongshu-operation-skills) | 柒晨：小红书全套运营 Skill 清单——12 款工具串起调研、写作、做图与分发全链路 | X/Twitter |
| [todaykan-xiaohongshu-complete-operations-guide](/md/wiki/sources/todaykan-xiaohongshu-complete-operations-guide) | Today🦘：小红书运营完全指南——起号养号到日常运营保姆教程 | X/Twitter |
| [geekcatx-douyin-image-text-monetization-case](/md/wiki/sources/geekcatx-douyin-image-text-monetization-case) | 知识猫：抖音图文账号变现实战拆解——陈皮拿铁 9 万粉起号与素材复刻 | X/Twitter |
| [geekcatx-xiaohongshu-healing-comic-case](/md/wiki/sources/geekcatx-xiaohongshu-healing-comic-case) | 知识猫：小红书治愈系漫画图文拆解——小僧不内耗 5.7 万粉变现路径 | X/Twitter |
| [zerber-daily-4-figure-video-clip-workflow](/md/wiki/sources/zerber-daily-4-figure-video-clip-workflow) | Zerber：开源日赚 4 位数剪辑工作流——零基础 1 小时搓出科普视频 | X/Twitter |
| [longhai-uncle-bob-ub-mode-skill-review](/md/wiki/sources/longhai-uncle-bob-ub-mode-skill-review) | 龙海：实测 Uncle Bob 的 ub-mode——152 行 SKILL.md + 三个量化门禁工具的完整拆解 | X/Twitter |
| [victor-adsense-publisher-id-site-cluster-discovery](/md/wiki/sources/victor-adsense-publisher-id-site-cluster-discovery) | Victor 在西雅图：用 AdSense 发布商 ID 反查站群——四步摸清站长手里还有哪些站 | X/Twitter |
| [jasonzeyuan818-gomotion-youtube-documentary-mrr](/md/wiki/sources/jasonzeyuan818-gomotion-youtube-documentary-mrr) | Jason泽源：GoMotion 上线不到 3 个月 MRR 6.4 万美元——贴脚本自动出 15 分钟纪录片 | X/Twitter |
| [pluvio9yte-talking-head-digital-human-action-spec](/md/wiki/sources/pluvio9yte-talking-head-digital-human-action-spec) | 雪踏乌云：不露脸做口播数字人——先让 Agent 拉片写出可量化的「动作说明书」 | X/Twitter |
| [xitang-ai-workbuddy-libtv-ancient-rap-mv](/md/wiki/sources/xitang-ai-workbuddy-libtv-ancient-rap-mv) | 西堂AI：WorkBuddy + LibTV 让三位古人同台说唱——文、资、视、剪四步与完整歌词/Suno 输入 | X/Twitter |
| [bainianai-seo-daily-003-webaloha-font-checker-page](/md/wiki/sources/bainianai-seo-daily-003-webaloha-font-checker-page) | 百年AI：SEO 日课 003——一页吃下全站 78% 流量，Web Aloha Font Checker 三次改版还原 | X/Twitter |
| [hezhiyan7-new-word-site-recap-roundup](/md/wiki/sources/hezhiyan7-new-word-site-recap-roundup) | droidHZ（@hezhiyan7）：梳理最近新词出单的几个复盘——找词、上线、ChatGPT 推荐、优化与出单 | X/Twitter |
| [hezhiyan7-mrr-3000usd-content-index](/md/wiki/sources/hezhiyan7-mrr-3000usd-content-index) | droidHZ（@hezhiyan7）：月入 3 千刀达成——网站出海每日分享的十类内容索引 | X/Twitter |
| [xuxuanzhou-72h-5480usd-new-word-site](/md/wiki/sources/xuxuanzhou-72h-5480usd-new-word-site) | 绪轩（@xuxuanzhou）：没投流、没买外链，一个新词站 72 小时 $5,480——从买域名到出单的完整复盘 | X/Twitter |
| [web30708-30-overseas-income-recaps](/md/wiki/sources/web30708-30-overseas-income-recaps) | HP（@web30708）：从 0 到月入万刀——30 篇出海收入复盘长文合集索引 | X/Twitter |
| [qianshuixia-14yr-game-dev-overseas-annual-recap](/md/wiki/sources/qianshuixia-14yr-game-dev-overseas-annual-recap) | 浅水虾（@qianshuixia2026）：从大龄失业 8 个月到出海破局——一个 14 年游戏老兵的年度全景复盘 | X/Twitter |
| [qianshuixia-daily-keyword-review-core-edge](/md/wiki/sources/qianshuixia-daily-keyword-review-core-edge) | 浅水虾（@qianshuixia2026）：虾友连续出单了——被当成精神导师后，聊聊出海的核心竞争力 | X/Twitter |
| [gefei55-buyi-tool-site-3000usd-pitfalls](/md/wiki/sources/gefei55-buyi-tool-site-3000usd-pitfalls) | 哥飞（@gefei55）：布衣的工具站出海月入 3000 刀——这一年踩过的那些坑（7500 字） | X/Twitter |
| [tracejie-20-failed-sites-columbus-product-picker](/md/wiki/sources/tracejie-20-failed-sites-columbus-product-picker) | Traceward（@TraceJie）：连扑 20 个 AI 出海站靠自用「选品外挂」翻身——7 天砸出日入千刀 | X/Twitter |
| [bytec99-saas-overseas-3-week-recap](/md/wiki/sources/bytec99-saas-overseas-3-week-recap) | 阿策（@Bytec99）：大厂后端出海建站 3 周复盘——踩过的 3 个坑与 4 条认知 | X/Twitter |
| [bytec99-content-plus-overseas-flywheel](/md/wiki/sources/bytec99-content-plus-overseas-flywheel) | 阿策（@Bytec99）：这个月我只赚了 1 刀——副业要把内容、出海和自动化拧成一个系统 | X/Twitter |
| [miles-mazy-zero-to-one-overseas-guide](/md/wiki/sources/miles-mazy-zero-to-one-overseas-guide) | Miles Ma（@miles_mazy）：出海系列｜从 0 到 1 出海赚美金指南——四条路、建站、收款与利润 | X/Twitter |
| [bizinfogap-usd-earnings-four-traps](/md/wiki/sources/bizinfogap-usd-earnings-four-traps) | 陈默Jason（@BizInfoGap）：国人赚美金的套路和真实逻辑——四种套路与获客、合规、资金闭环三问 | X/Twitter |
| [aprilbaby153-ai-short-drama-overseas-60-eps](/md/wiki/sources/aprilbaby153-ai-short-drama-overseas-60-eps) | April（@Aprilbaby153）：一天 60 集？！起底「AI 短剧」出海的捞金秘籍——100 块广告换 200 块充值 | X/Twitter |
| [loverboyy0321-threads-3000-new-users](/md/wiki/sources/loverboyy0321-threads-3000-new-users) | joy（@loverboyy0321）：靠一篇 threads 爆帖给产品引流近 3000 名新用户——生活 70% 加推广 30% | X/Twitter |
| [jarvis11x-10usd-ai-video-saas-11-steps](/md/wiki/sources/jarvis11x-10usd-ai-video-saas-11-steps) | Jarvis（@jarvis11x）：AI 编程实战教程（3）——10 美金搭建海外 AI 视频 SaaS 的 11 个步骤 | X/Twitter |
| [buildingwaves-10k-mrr-skill-not-luck](/md/wiki/sources/buildingwaves-10k-mrr-skill-not-luck) | Kourosh Ghaffari（@BuildingWaves）：$10k MRR 零运气、纯技能——可复制的想法→产品→营销→hustle 四步公式 | X/Twitter |
| [danielsmidstrup-x-200-days-12-9k-followers-climbx](/md/wiki/sources/danielsmidstrup-x-200-days-12-9k-followers-climbx) | Daniel Smidstrup（@DanielSmidstrup）：200 天从 0 涨到 12.9k 粉丝——$1k MRR 的 ClimbX、$7,001.91 单月收入与靠回复长大 | X/Twitter |
| [janibangiev-picmim-7-months-1k-mrr](/md/wiki/sources/janibangiev-picmim-7-months-1k-mrr) | Term（@JaniBangiev）：我们花 7 个月才做到 €1,000 MRR——AI 社媒工具 Picmim 的真实过程与 €3,000 只买来 1 个客户 | X/Twitter |
| [khanhnqc-10-products-first-1k](/md/wiki/sources/khanhnqc-10-products-first-1k) | Khanh Nguyen（@khanhnqc）：10 个真实产品从 $0 到第一个 $1K——只收录叫得出产品名的案例 | X/Twitter |
| [bibhash-plausible-64-to-1m-arr-no-ads](/md/wiki/sources/bibhash-plausible-64-to-1m-arr-no-ads) | Bibhash Roy（@bibhashroykol）：Plausible 从每月 $64 到每年 $1M，零广告、零联盟分成——五个免费动作与执行顺序 | X/Twitter |
| [bibhash-zigpoll-stay-or-switch-test](/md/wiki/sources/bibhash-zigpoll-stay-or-switch-test) | Bibhash Roy（@bibhashroykol）：两年 $0，然后每月 $125K——附三步 Stay-or-Switch 书面测试 | X/Twitter |
| [ernestosoftware-ugc-content-machine-6000-videos](/md/wiki/sources/ernestosoftware-ugc-content-machine-6000-videos) | Ernesto Lopez（@ErnestoSOFTWARE）：发布 6,000 条视频、App 做到 $150k/mo 的内容系统——UGC 内容机器加内容放大器 | X/Twitter |
| [ghosstty-ai-ugc-creator-dwarf-77645-sales](/md/wiki/sources/ghosstty-ai-ugc-creator-dwarf-77645-sales) | GHOST（@ghosstty_）：我造了一个 AI UGC Creator，做出 $77,645 销售额——爱尔兰中年矮人皮具匠全流水线 | X/Twitter |
| [onlytapa-ai-grandmother-page-affiliate-7020](/md/wiki/sources/onlytapa-ai-grandmother-page-affiliate-7020) | Tapa（@onlytapa）：这个 AI 非洲奶奶账号每月赚 $7,020——OpenArt 造角色加补剂联盟加 ManyChat 自动私信全拆解 | X/Twitter |
| [maxaioutreach-4-digital-products-1k-mrr-lessons](/md/wiki/sources/maxaioutreach-4-digital-products-1k-mrr-lessons) | Maxime（@MaxAIoutreach）：我把 4 个数字产品做到 $1K MRR 以上——真正管用的 9 条经验 | X/Twitter |
| [byysid-tech-ugc-creator-playbook-100k-mrr](/md/wiki/sources/byysid-tech-ugc-creator-playbook-100k-mrr) | Sidney Brant（@Byysid）：Tech UGC 从 1 位创作者到 $100K MRR——按阶段把选择题做对顺序的完整 playbook | X/Twitter |
| [s-chiriac-ai-directories-42k-in-36-hours](/md/wiki/sources/s-chiriac-ai-directories-42k-in-36-hours) | Sergiu（@s_chiriac）：「Directories Are Dead」？36 小时 $42K 不同意——三个自建目录案例 | X/Twitter |
| [zonperez1-10-grok-bots-shopify-first-sale](/md/wiki/sources/zonperez1-10-grok-bots-shopify-first-sale) | Zon（@zonperez1）：我搭了一支 10 个 Grok Bots 的团队——广告上线 24 小时就拿到 Shopify 首单 | X/Twitter |
| [arpitatscale-cold-dms-to-3k-month-inbounds-10-fixes](/md/wiki/sources/arpitatscale-cold-dms-to-3k-month-inbounds-10-fixes) | Arpit（@arpitatscale）：从群发冷 DM 到每月 $3k 自然询盘——我改掉的 10 件事 | X/Twitter |
| [wickedguro-postiz-2m-arr-saas-not-dead-playbook](/md/wiki/sources/wickedguro-postiz-2m-arr-saas-not-dead-playbook) | Nevo David（@wickedguro）：Postiz 突破 $2M ARR，而所有人都在说 SaaS 已死——从卖软件转向卖结果 | X/Twitter |
| [canghe-wesight-obsidian-multiplatform-upgrade](/md/wiki/sources/canghe-wesight-obsidian-multiplatform-upgrade) | 苍何（@canghe）：Codex + Obsidian 多平台同步与一键分发（WeSight 升级实录） | X/Twitter |
| [xoyif-muse-xiaohongshu-autopilot](/md/wiki/sources/xoyif-muse-xiaohongshu-autopilot) | 北衡（@xoyif63862452）：让 Muse 全权运营一个小红书账号的实操记录 | X/Twitter |
| [aronhouyu-ai-rising-keyword-topic-pipeline](/md/wiki/sources/aronhouyu-ai-rising-keyword-topic-pipeline) | Aron 厚玉（@aronhouyu）：用 AI 搭建流量上升词自动发现与批量选题流水线 | X/Twitter |
| [wangchen-super-agent-deepseek-harness](/md/wiki/sources/wangchen-super-agent-deepseek-harness) | 望宸：从长程 Agent 到 Super-agent，解锁更多场景（DeepSeek dsh-superagent-prototype 工程拆解） | 微信公众号 |
| [xiaofeiyang-new-site-google-traffic-simulator](/md/wiki/sources/xiaofeiyang-new-site-google-traffic-simulator) | 小肥羊（@xiaofeiyangfe）：新站上线 Google 为什么不给流量？用模拟器看懂的 6 件事 | X/Twitter |
| [criscxuan-deepseek-super-agent-architecture-teardown](/md/wiki/sources/criscxuan-deepseek-super-agent-architecture-teardown) | cxuan（@criscxuan）：通了个宵，终于把 Super-Agent 架构玩明白了（DeepSeek Harness 深度拆解） | X/Twitter |
| [victor-uwer-tool-site-vertical-niche-for-profession-strategy](/md/wiki/sources/victor-uwer-tool-site-vertical-niche-for-profession-strategy) | Victor 在西雅图（@victor_UWer）：出海工具站换个切法——大词后挂职业做垂直人群长尾页 | X/Twitter |
| [missle8z-information-arbitrage-8-business-models](/md/wiki/sources/missle8z-information-arbitrage-8-business-models) | 壹新（@Missle8z）：普通人赚钱最快的方法是当二道贩子——跨平台信息差与套利的 8 种实操形态 | X/Twitter |
| [hytidel-shanghai-smk-secret-exam-guide](/md/wiki/sources/hytidel-shanghai-smk-secret-exam-guide) | Hytidel（@HytidelLegend）：2027 上海小升初「神秘考 SMK」全攻略——梯队代码、时间线、证书门槛与黑话 | X/Twitter |
| [heyrico-design-system-and-skills-for-agents](/md/wiki/sources/heyrico-design-system-and-skills-for-agents) | rico（@_heyrico）：构建 AI Agent 能严格遵守的设计系统与 Skills 体系 | X/Twitter |
| [liangzhu-marketingskills-agent-skills-system](/md/wiki/sources/liangzhu-marketingskills-agent-skills-system) | 良竹（@liangzhu_AI）：会写代码不会卖？基于 Agent Skills 的独立开发者营销转化体系 | X/Twitter |
| [ganfanren-taishang-laojun-douyin-content-skill](/md/wiki/sources/ganfanren-taishang-laojun-douyin-content-skill) | 饭饭猛猛炫（@ganfanren_ai）：太上老君·AI炼丹炉——去 AI 味、改爆款口播的自媒体内容 Skill | X/Twitter |
| [manorgw-inkos-ai-creative-workspace](/md/wiki/sources/manorgw-inkos-ai-creative-workspace) | Man ting（@Manorgw）：InkOS——面向长篇小说、剧本与互动影游的开源 AI 创作工作台 | X/Twitter |
| [fantuantalk-5-tools-finding-real-needs](/md/wiki/sources/fantuantalk-5-tools-finding-real-needs) | 饭团（@fantuantalk）：找真实需求的 5 个出海利器——Google Trends/AnswerThePublic/Reddit/PH/SparkToro | X/Twitter |
| [kkkeric-seo-new-site-gsc-and-300-backlinks](/md/wiki/sources/kkkeric-seo-new-site-gsc-and-300-backlinks) | KKKK（@kkkeric_ai）：SEO 新站起步心法——看淡 DR、死磕 GSC 与 300 条外链分界线 | X/Twitter |
| [zone-ai-ref-library-and-char-db-cn](/md/wiki/sources/zone-ai-ref-library-and-char-db-cn) | SleepyZone（@zone__online）：开源 AI 作图参考库与二次元角色换装数据库的中文检索站设计 | X/Twitter |
| [luffy-20-animation-studio-skills-stack](/md/wiki/sources/luffy-20-animation-studio-skills-stack) | 路飞（@0xluffy_eth）：20 个 Skill 搭一整套动效工作室——动画、模拟、3D、音频与导出全流程 | X/Twitter |
| [xiaohu-deepseek-super-agent-experiments-and-security-cost](/md/wiki/sources/xiaohu-deepseek-super-agent-experiments-and-security-cost) | 小互（@xiaohu）：同时开 5 个 Agent 人就盯不过来了——DeepSeek Super-agent 架构实验数据与安全代价 | X/Twitter |
| [ssslumdunk-10m-cash-financial-freedom-confession](/md/wiki/sources/ssslumdunk-10m-cash-financial-freedom-confession) | 龙心盐（@ssslumdunk）：有现金一千万可以躺平了吗？一位大厂搜广推工程师的十年真实账本与认知 | X/Twitter |
| [victor-uwer-competitor-ad-library-arbitrage](/md/wiki/sources/victor-uwer-competitor-ad-library-arbitrage) | Victor 在西雅图（@victor_UWer）：出海投放最贼的路子——直接抄竞品长青广告素材作业 | X/Twitter |
| [yaohongan-three-playbooks-overseas-sites](/md/wiki/sources/yaohongan-three-playbooks-overseas-sites) | 虹安（@yaohongan2025）：做出海站的三种打法——做新词、做需求词、做真需求 | X/Twitter |
| [liangzhu-google-ads-transparency-center-spy](/md/wiki/sources/liangzhu-google-ads-transparency-center-spy) | 良竹（@liangzhu_AI）：竞品投放透明化——用谷歌官方工具排查对手广告素材与投放地区 | X/Twitter |
| [heizolshao-reddit-traffic-intercept-100m-site](/md/wiki/sources/heizolshao-reddit-traffic-intercept-100m-site) | 左海（@heizolshao）：月访 1.05 亿老牌站还在 Reddit 导流——垂直社区截流真实痛点实操 | X/Twitter |
| [gefei-products-remade-for-ai-via-mcp](/md/wiki/sources/gefei-products-remade-for-ai-via-mcp) | 哥飞（@gefei55）：很多产品都可以重做一遍——不是给人用，而是提供 MCP 给 AI 调用的自闭环 | X/Twitter |
| [antivo-deepseek-super-agent-distributed-master-worker](/md/wiki/sources/antivo-deepseek-super-agent-distributed-master-worker) | 纳米AI（@antiAIvo）：DeepSeek Super-agent 的本质——经典分布式 Master-Worker 架构在 Agent 的回归 | X/Twitter |
| [wquguru-us-llc-registration-and-maintenance-for-indie-devs](/md/wiki/sources/wquguru-us-llc-registration-and-maintenance-for-indie-devs) | WquGuru（@wquguru）：独立开发者出海注册与维护美国公司指南（成本/避坑/报税/苹果开发者） | X/Twitter |
| [yhslgg-ai-beauty-photo-monetization-sop](/md/wiki/sources/yhslgg-ai-beauty-photo-monetization-sop) | 老杨（@yhslgg）：AI 美女写真短视频全流程变现 SOP——养号、作图、剪辑模板、私域承接与二转交付 | X/Twitter |
| [coderleft-deepseek-super-agent-architecture-deep-dive](/md/wiki/sources/coderleft-deepseek-super-agent-architecture-deep-dive) | 程序员Left（@coder_left）：解读 DeepSeek Super Agent——打破传统人机交互范式，从消灭会话到工程底座全景拆解 | X/Twitter |
| [ichardrv-information-fasting-and-calorie-model](/md/wiki/sources/ichardrv-information-fasting-and-calorie-model) | 飞鱼Fly（@ichardrv）：你和高手的最大差距是信息戒断能力——纳瓦尔注意力卡路里模型与不值得清单 | X/Twitter |
| [kkkeric-grok-bot-22-agents-growth-fleet](/md/wiki/sources/kkkeric-grok-bot-22-agents-growth-fleet) | KKKK（@kkkeric_ai）：Grok Bot 出海增长实战——一个人 + 22 个 Bot 跑通 20+ 社媒渠道、SEO/AEO、外链与竞品全流程 | X/Twitter |
| [anti-aivo-agent-engineering-70-backend-30-uncertainty](/md/wiki/sources/anti-aivo-agent-engineering-70-backend-30-uncertainty) | 纳米AI（@antiAIvo）：Agent 工程心法——七成在传统后端，三成在处理模型不确定性 | X/Twitter |
| [aichuhai-residential-isp-proxy-claude-chatgpt](/md/wiki/sources/aichuhai-residential-isp-proxy-claude-chatgpt) | 爱出海（@ai_chuhai）：想用 Claude / ChatGPT？静态住宅 ISP 代理选购、配置与排错全攻略 | X/Twitter |
| [ohayou-claude-artifacts-ui-design-system-leak](/md/wiki/sources/ohayou-claude-artifacts-ui-design-system-leak) | Unicorn（@ohayou792）：Claude 内部组件设计系统提示词与完整 UI 规范解析 | X/Twitter |
| [wquguru-shisei-cc0-ancient-costume-library](/md/wiki/sources/wquguru-shisei-cc0-ancient-costume-library) | WquGuru（@wquguru）：Shisei 开源中国历代四视角服装库——从商朝到民国 227 张 CC0 资产 | X/Twitter |
| [hytidel-xiaohongshu-ecommerce-operations-and-10x-scaling](/md/wiki/sources/hytidel-xiaohongshu-ecommerce-operations-and-10x-scaling) | Hytidel（@HytidelLegend）：小红书电商保姆级教程（6）——运营进阶、提效工具与利润十倍放大 | X/Twitter |
| [konghayao-deepseek-super-agent-architecture-reflections](/md/wiki/sources/konghayao-deepseek-super-agent-architecture-reflections) | 江夏尧（@konghayao）：关于 DeepSeek SuperAgent 架构设计的深度反思与开源工程映射 | X/Twitter |
| [myleafy-phongent-local-device-cluster-control](/md/wiki/sources/myleafy-phongent-local-device-cluster-control) | myleaf（@myleafy1）：开源 phongent——基于 Mika 的安卓局域网多设备群控与 AI 任务调度系统 | X/Twitter |
| [morry-course2md-video-to-markdown-notes](/md/wiki/sources/morry-course2md-video-to-markdown-notes) | Morry.AI（@Morry4AI）：course2md 学习神器——把 YouTube/B站/本地视频一键转为带截图的 Markdown 笔记 | X/Twitter |
| [aixiaomu-mika-phone-agent-accessibility-risk-control](/md/wiki/sources/aixiaomu-mika-phone-agent-accessibility-risk-control) | 黄小木（@ai_xiaomu）：王赞开源 Mika 手机端常驻 Agent 评测与风控防封提醒 | X/Twitter |
| [willhu-wigent-ai-growth-system-and-agent-pilot](/md/wiki/sources/willhu-wigent-ai-growth-system-and-agent-pilot) | 胡二虎 Will Hu（@willlhhh）：在 Manus 负责增长的实战思考——从制造 Agent 到驾驶 Agent 的能力模型演进 | X/Twitter |
| [wigent-ai-personal-knowledge-agent](/md/wiki/sources/wigent-ai-personal-knowledge-agent) | 胡二虎（Will Hu）：Wigent by Will Hu｜胡二虎的个人知识分身（wigent.ai 离线镜像） | 网站归档 |
| [feng-yq-laper-ai-scriptwriting-revenue-case](/md/wiki/sources/feng-yq-laper-ai-scriptwriting-revenue-case) | Max Feng（@Feng_YQ）：闷声发大财网站解析——月入 4.6 万美元的 AI 编剧工具 laperAi 流量模型拆解 | X/Twitter |
| [realchendahuang-knowledge-management-stack-github-zed-hermes](/md/wiki/sources/realchendahuang-knowledge-management-stack-github-zed-hermes) | 陈大黄（@realchendahuang）：折腾完主流笔记工具后的终极版本答案——GitHub + Zed + Hermes + Telegram | X/Twitter |
| [aliez-ren-claude-code-fable-opus-coding-playbook](/md/wiki/sources/aliez-ren-claude-code-fable-opus-coding-playbook) | Aliez Ren（@aliez_ren）：几个月高强度 AI 编程真实心法——Claude Code + Herdr + Fable 架构实践 | X/Twitter |
| [govin-taste-skill-frontend-design-for-ai](/md/wiki/sources/govin-taste-skill-frontend-design-for-ai) | govin（@goan999999）：Taste-Skill——让 Claude Code 与 Codex 告别模板化廉价感的前端审美升级 Skill | X/Twitter |
| [leo-xiaolei-lauren-poteto-grok-bot-team-guide](/md/wiki/sources/leo-xiaolei-lauren-poteto-grok-bot-team-guide) | 刘老板（@leo_xiaolei）：深度拆解 xAI 负责人 Lauren 的 Grok Bot 团队打造指南与评论区交锋 | X/Twitter |
| [antivo-deepseek-super-agent-architecture-gif-summary](/md/wiki/sources/antivo-deepseek-super-agent-architecture-gif-summary) | 纳米AI（@antiAIvo）：一图看懂 DeepSeek Super-agent 三层架构——事件双筛、Router 调度与 Worker 并发 | X/Twitter |
| [leaf-sanren-douyin-offline-commercial-orders-playbook](/md/wiki/sources/leaf-sanren-douyin-offline-commercial-orders-playbook) | Leaf Yeah!（@leaf_sanren）：抖音水下商单 0→1 实操手册——从首单接单、谈单报价、过审防限流到报喜回款 | X/Twitter |
| [victor-uwer-utm-stripe-metadata-true-cac](/md/wiki/sources/victor-uwer-utm-stripe-metadata-true-cac) | Victor 在西雅图（@victor_UWer）：出海获客成本别只看总数——用 UTM + Stripe Metadata 拆解单渠道真实 CAC | X/Twitter |
| [kkkeric-free-tool-seo-fast-traffic-low-conversion](/md/wiki/sources/kkkeric-free-tool-seo-fast-traffic-low-conversion) | KKKK（@kkkeric_ai）：Free Tool 是 SEO 起量最快策略——大流量、长停留与低转化的冷启动权衡 | X/Twitter |
| [awe0-frontend-layout-standard-terminology-for-ai](/md/wiki/sources/awe0-frontend-layout-standard-terminology-for-ai) | awe0（@awe0_io）：跟 AI 别说「布局好看点」——6 种标准前端布局术语让 AI 一秒对齐意图 | X/Twitter |
| [govin-codex-12-productivity-workflows-and-ecosystem](/md/wiki/sources/govin-codex-12-productivity-workflows-and-ecosystem) | govin（@goan999999）：Codex 12 个高阶提效玩法——从原生机制到周边生态神器全景速查 | X/Twitter |
| [ruofei-dsh-superagent-issue-to-pr](/md/wiki/sources/ruofei-dsh-superagent-issue-to-pr) | 若飞（架构师 JiaGouX）：DeepSeek Super-agent 上手——从 GitHub Issue 到 PR | 微信公众号 |
| [fanbing-dsh-superagent-engineering-common-sense](/md/wiki/sources/fanbing-dsh-superagent-engineering-common-sense) | 增长黑客范冰：解读 dsh-superagent——一个主动型 Coding Agent 的工程常识与后厨美学 | 微信公众号 |
| [heizolshao-reddit-high-search-low-competition-demand-mining](/md/wiki/sources/heizolshao-reddit-high-search-low-competition-demand-mining) | 左海（@heizolshao）：Reddit 挖掘需求实操案例——如何找到低竞争、高搜索量的蓝海需求？ | X/Twitter |
| [khazix-miniature-agent-automation-pipeline](/md/wiki/sources/khazix-miniature-agent-automation-pipeline) | 数字生命卡兹克（@Khazix0918）：5 天打造微缩景观 Agent 自动化流水线——戴森球计划灵感与多模型工程协同 | X/Twitter |
| [hongye-open-pose-costume-5800-library](/md/wiki/sources/hongye-open-pose-costume-5800-library) | Kevin Tech Labs（@HongyeMain）：Open Pose & Costume 开源姿势与服饰库大更新——5855 张多视角参考图与一键生图 | X/Twitter |
| [chencheng-code-mode-evolution-and-durable-execution](/md/wiki/sources/chencheng-code-mode-evolution-and-durable-execution) | 陈成（@chenchengpro）：从 Tool Call 到 Code Mode 的演进脉络——工具爆炸、沙箱串联与确定性重放 | X/Twitter |
| [philschmid-why-agents-will-only-have-one-tool](/md/wiki/sources/philschmid-why-agents-will-only-have-one-tool) | Philipp Schmid：为什么未来的智能体很快将只剩下一个工具（Code Mode 深度解析） | 博客/技术长文 |
| [sopilot-400-directories-submission-platform](/md/wiki/sources/sopilot-400-directories-submission-platform) | SoPilot：400+ 海外目录导航站自动化提交与外链建设平台 | 网站归档/工具资源 |
| [aichuhai-mika-phone-agent-cross-border-station](/md/wiki/sources/aichuhai-mika-phone-agent-cross-border-station) | 爱出海（@ai_chuhai）：把旧安卓手机改造成出海赚美元工作站——开源 Mika 与智能体自动化配置 SOP | X/Twitter |
| [bainian-grey-niche-sites-traffic-teardown](/md/wiki/sources/bainian-grey-niche-sites-traffic-teardown) | 百年 AI×出海（@bainianAI）：灰色站的百万流量是怎么拉起来的？收购老域名 301 迁移与 Google 趋势刷词套利拆解 | X/Twitter |
| [qianshuixia-gefei-seo-agent-claude-code-energy-trap](/md/wiki/sources/qianshuixia-gefei-seo-agent-claude-code-energy-trap) | 浅水虾（@qianshuixia2026）：把哥飞 SEO 接进 Claude Code——警惕 AI 时代的精力陷阱与两条腿走路 | X/Twitter |
| [nini-global-freelancer-skills-stack](/md/wiki/sources/nini-global-freelancer-skills-stack) | nini（@nini_incrypto_）：学什么技能能在全球当自由职业者？可远程交付技能清单与商业能力公式 | X/Twitter |
| [leo-xiaolei-10-chrome-extensions-for-x-twitter](/md/wiki/sources/leo-xiaolei-10-chrome-extensions-for-x-twitter) | 刘老板（@leo_xiaolei）：运营 X（Twitter）看这篇就够了——10 款高口碑免费 Chrome 扩展实测盘点 | X/Twitter |
| [svwang-wealthy-entrepreneurs-path-dependency-and-waiting](/md/wiki/sources/svwang-wealthy-entrepreneurs-path-dependency-and-waiting) | 硅谷王川（@Svwang1）：富商发家史随想——路径依赖、缺乏抽象思考与「什么都不做耐心等待」的缺失 | X/Twitter |
| [lingxiang-stageshow-realistic-product-mockup-skill](/md/wiki/sources/lingxiang-stageshow-realistic-product-mockup-skill) | 0xiang（@LingxiangAI）：Stageshow——教 Claude Code 与 Codex 制作真实产品示意配图的开源 Skill | X/Twitter |
| [yuntianming-md2draft-markdown-to-x-draft-extension](/md/wiki/sources/yuntianming-md2draft-markdown-to-x-draft-extension) | 云天明AI（@yuntianming10）：Markdown 一键直达 X 草稿——MD2DRAFT 解决 Thread 串推分段与 Article 长文排版痛点 | X/Twitter |
| [lin-crypto-15-human-nature-monetization-models](/md/wiki/sources/lin-crypto-15-human-nature-monetization-models) | Lin数字资产（@Crypto_146827）：做产品的底层逻辑——基于人性的 15 种商业变现与需求切入形态 | X/Twitter |
| [0xgky-learn-from-materials-agent-skill](/md/wiki/sources/0xgky-learn-from-materials-agent-skill) | Gk（@0xGky）：learn-from-materials——把几百页 PDF/EPUB 资料整成带精确页码出处交互式学习网站的 Agent Skill | X/Twitter |
| [missle8z-ai-life-advice-image-card-monetization](/md/wiki/sources/missle8z-ai-life-advice-image-card-monetization) | 壹新（@Missle8z）：发 4 篇笔记爆了 2 万赞——AI 走心人生建议图文全平台分发与变现 | X/Twitter |
| [luffy-19yo-ai-tiktok-dance-girl-7-prompts](/md/wiki/sources/luffy-19yo-ai-tiktok-dance-girl-7-prompts) | 路飞（@0xluffy_eth）：19 岁男生用 AI 做美女号 2 周赚 3.6W——可灵动作控制与 Fanvue 订阅变现 7 段提示词 | X/Twitter |
| [ryan-muse-wechat-longform-and-tietu-automation-review](/md/wiki/sources/ryan-muse-wechat-longform-and-tietu-automation-review) | Ryan（@7998l201）：让 Muse 全权运营公众号与贴图号一周复盘——踩坑记录与 systemd 常驻代理自愈解法 | X/Twitter |
| [kyrie-codex-information-gathering-pipeline](/md/wiki/sources/kyrie-codex-information-gathering-pipeline) | Kyrie（@KyrieCheungYep）：每天省下 3 小时——用 Codex 搭建客户背调、政策追踪与美学盯盘自动化信息流水线 | X/Twitter |
| [xilo-codex-knowledge-video-editing-ab-roll-method](/md/wiki/sources/xilo-codex-knowledge-video-editing-ab-roll-method) | xilo（@xilo2991）：Codex 自动化剪辑第三弹——2 条视频接下四位数商单的知识类视频 A/B-roll 方法论 | X/Twitter |
| [stanley-wechat-tietu-6000-words-monetization-playbook](/md/wiki/sources/stanley-wechat-tietu-6000-words-monetization-playbook) | Stanley（@Stanleysobest）：2026 公众号贴图完整变现地图——6200 字拆解底层逻辑、操作路径与搞钱闭环 | X/Twitter |
| [kongge-creator-buddy-10-wechat-skills](/md/wiki/sources/kongge-creator-buddy-10-wechat-skills) | 空格（@kongge_space）：开源 creator-buddy 微信公众号 10 大全套 Agent Skills（写作、排版、爆款分析与封面） | X/Twitter |
| [copperforge-orca-multi-agent-orchestration-guide](/md/wiki/sources/copperforge-orca-multi-agent-orchestration-guide) | 铜匠（@CopperForgeAI）：Orca 从入门到精通——一个人同时指挥一群 AI Agent 的多智能体开发环境（ADE）全攻略 | X/Twitter |
| [wadezone-hollywood-three-act-storytelling-copywriting](/md/wiki/sources/wadezone-hollywood-three-act-storytelling-copywriting) | Koda（@wadezone）：干货没人看？用好莱坞三幕式讲故事——拉人上船、撞冰山绝路到递出木板 | X/Twitter |
| [jessicao-xiaohongshu-0-to-1-operations-guide](/md/wiki/sources/jessicao-xiaohongshu-0-to-1-operations-guide) | Jessi Cao（@JessiCao_JC）：万字教程｜小红书从 0 到 1 入门运营详细指南——业务定位、对标拆解与变现闭环 | X/Twitter |
| [ryan-muse-wechat-tietu-step-by-step-guide](/md/wiki/sources/ryan-muse-wechat-tietu-step-by-step-guide) | Ryan（@7998l201）：让 Muse 全权自动运营微信贴图号——零基础手把手实操教程与自动化节奏表 | X/Twitter |
| [lucaspei-xiaohongshu-virtual-ai-ppt-playbook](/md/wiki/sources/lucaspei-xiaohongshu-virtual-ai-ppt-playbook) | 裴同学（@LucasPei181034）：从封店月损 8 万到单店月入 5 万——小红书虚拟资产全面转向 AI 原创 PPT 破局实录 | X/Twitter |
| [mindfulreturn-wechatlongpic-skill](/md/wiki/sources/mindfulreturn-wechatlongpic-skill) | MindfulReturn（@MindfulReturn）：把公众号做成长图——开源 wechatlongpic 解决长文卡死与排版难题（12 套精美主题） | X/Twitter |
| [stanley-soda-music-monetization-reality-check](/md/wiki/sources/stanley-soda-music-monetization-reality-check) | Stanley（@Stanleysobest）：2026 最全搞钱项目测评——汽水音乐到底值不值得做？（四种变现路径深度拆解） | X/Twitter |
| [placela-claude-code-team-code-review-practices](/md/wiki/sources/placela-claude-code-team-code-review-practices) | placela（@Nokia0421）：Claude Code 团队是怎样做 Code Review 的？——90% 代码由 AI 编写下的六层防线与 Revert 护栏 | X/Twitter |
| [carsonyang-fastgpt-wechat-group-auto-management](/md/wiki/sources/carsonyang-fastgpt-wechat-group-auto-management) | 米开朗基杨（@CarsonYangk8s）：违背祖宗的决定——手把手教你用 FastGPT 搭建微信/飞书社群 15 节点全自动客服流 | X/Twitter |
| [ryan-muse-auto-sync-x-posts-to-wechat-guide](/md/wiki/sources/ryan-muse-auto-sync-x-posts-to-wechat-guide) | Ryan（@7998l201）：让 Muse 全权自动把 X 长文同步到微信公众号——手把手实操教程与零行丢失硬核验收 | X/Twitter |
| [qianshuixia-daily-review-finding-demands-core-competency](/md/wiki/sources/qianshuixia-daily-review-finding-demands-core-competency) | 浅水虾（@qianshuixia2026）：虾友连续出单了——聊聊独立出海做站的核心竞争力：每天复盘找词与需求挖掘 | X/Twitter |
| [qingyue-wechat-zhangxiaolong-story-and-independent-spirit](/md/wiki/sources/qingyue-wechat-zhangxiaolong-story-and-independent-spirit) | 清月（@qingyue820）：复杂的纯粹与热情的孤独——蓝色星球下张小龙与微信的产品故事 | X/Twitter |
| [stanley-ai-graduation-code-explainer-handbook-monetization](/md/wiki/sources/stanley-ai-graduation-code-explainer-handbook-monetization) | Stanley（@Stanleysobest）：月薪 8000 的程序员下班用 AI 每天多赚 800——毕业季代码答辩手稿拆解与咸鱼变现实操 | X/Twitter |
| [chencheng-mayoi-fast-gpu-editor-for-agentic-era](/md/wiki/sources/chencheng-mayoi-fast-gpu-editor-for-agentic-era) | 陈成（@chenchengpro）：我写了个极速代码编辑器 Mayoi——专为 Agent 编程时代打造（Go + MyGo GPU 原生渲染） | X/Twitter |
| [ryan-muse-ai-image-post-daily-15-skills-rotation](/md/wiki/sources/ryan-muse-ai-image-post-daily-15-skills-rotation) | Ryan（@7998l201）：让 Muse 每天自动更新 15 条热门贴图——8 大开源生图与艺术风格 Skill 轮换实测盘点 | X/Twitter |
| [xionghuanwei-wechat-official-account-traffic-monetization-rules](/md/wiki/sources/xionghuanwei-wechat-official-account-traffic-monetization-rules) | 熊叔的茅草屋（@xionghuanwei）：一天 265 收益 9 万曝光——公众号爆款赛道选择与避开真人验证 6 大硬规则 | X/Twitter |
| [aiwarts-doubao-work-record-and-replay-computer-automation](/md/wiki/sources/aiwarts-doubao-work-record-and-replay-computer-automation) | 卡尔的AI沃茨（@aiwarts）：豆包工作录制回放全攻略——不写代码也能爽玩电脑自动化（30 分钟边讲边录、多平台巡检与风控规避） | X/Twitter |
| [kyrie-ai-short-drama-monetization-6-business-models](/md/wiki/sources/kyrie-ai-short-drama-monetization-6-business-models) | Kyrie（@KyrieCheungYep）：百万播放只能赚 500 块？AI 短剧真正赚钱的 6 条路与成本账本 | X/Twitter |
| [xaiwind-telegram-from-beginner-to-master-developer-guide](/md/wiki/sources/xaiwind-telegram-from-beginner-to-master-developer-guide) | 想风（@xaiwind）：超简单 Telegram 从入门到精通——客户端装配、Bot 机器人开发、MTProto 接口与广告投放指南 | X/Twitter |
| [lele-wechat-21-days-monetization-nanny-guide](/md/wiki/sources/lele-wechat-21-days-monetization-nanny-guide) | 乐博士在路上（@lele898898898）：21 天手把手做一个能赚到钱的公众号——赛道选择、对标拆解与冷启动保姆级教程 | X/Twitter |
| [ryan-muse-x-account-dedicated-proxy-ip-guide](/md/wiki/sources/ryan-muse-x-account-dedicated-proxy-ip-guide) | Ryan（@7998l201）：让 Muse 全权运营 X 账号——固定代理 IP、Cookie-Editor 会话导出与 Playwright 防封教程 | X/Twitter |
| [ryan-muse-channels-wechat-reading-video-automation](/md/wiki/sources/ryan-muse-channels-wechat-reading-video-automation) | Ryan（@7998l201）：Muse 接管微信视频号——接入微信读书 API 每日自动选书、写文案与做短视频 | X/Twitter |
| [lxfater-wechat-cover-prompt-formula-235-ratio](/md/wiki/sources/lxfater-wechat-cover-prompt-formula-235-ratio) | 铁锤人（@lxfater）：公众号 2.35:1 高点击率首图封面提示词模板（真人摄影质感 + UI贴纸排版） | X/Twitter |
| [shanyanggm-digital-nomad-freelancer-monetization-tracks-manifesto](/md/wiki/sources/shanyanggm-digital-nomad-freelancer-monetization-tracks-manifesto) | 山羊赚钱笔记（@shanyanggm）：你难道就没幻想过？数百个自媒体与数字游民变现赛道全景清单 | X/Twitter |
| [taowithsaas-bing-webmaster-free-competitor-backlinks-export](/md/wiki/sources/taowithsaas-bing-webmaster-free-competitor-backlinks-export) | taoWithSaaS：免费导出竞品所有外链的一种方法——利用 Bing 站长工具 Backlinks 功能 | 微信公众号 |
| [zeroagent-12-longterm-memory-management](/md/wiki/sources/zeroagent-12-longterm-memory-management) | 从码农到工匠：从零构建 Agent（十二）——长期 Memory 管理与 Hindsight 跨 Session 认知实践 | 微信公众号 |
| [pengpai-wanghou-psychological-accounts-to-b-monetization](/md/wiki/sources/pengpai-wanghou-psychological-accounts-to-b-monetization) | 澎湃王侯：赚钱不难——给人换个理由花钱（心理账户迁移与普通人做 ToB 生意的 8 种路径） | 微信公众号 |
| [fanshifu-grok-bot-800-new-sites-monitoring-workflow](/md/wiki/sources/fanshifu-grok-bot-800-new-sites-monitoring-workflow) | 范师傅（@FanShifu）：Grok Bot 搭建出海新站监控——每天扒 800+ 新站吃透同行玩法（附 130 个开源信源渠道） | X/Twitter |
| [geektao-geo-google-and-chatgpt-traffic-step-by-step-guide](/md/wiki/sources/geektao-geo-google-and-chatgpt-traffic-step-by-step-guide) | Geektao（@geektao0319）：照着哥飞的方法做 GEO——让网站同时拿到谷歌和 ChatGPT 流量（谷歌吃教程，ChatGPT 吃工具） | X/Twitter |
| [ruofei-agent-self-write-and-self-inspect-ci-doctor](/md/wiki/sources/ruofei-agent-self-write-and-self-inspect-ci-doctor) | 若飞：自产自销——如何让 Agent 自己写自己查？（CI Doctor 闭环与自主修复） | 微信公众号 |
| [gefei-seo-directory-inner-pages-wikipedia-structure](/md/wiki/sources/gefei-seo-directory-inner-pages-wikipedia-structure) | 哥飞：导航站内页拿不到排名？学维基百科做词条页和分类页 | 微信公众号 |
| [khazix-agent-autoloop-open-source-architecture](/md/wiki/sources/khazix-agent-autoloop-open-source-architecture) | 数字生命卡兹克：开源我这折腾了 1 年的「Agent 自动化系统」Agent-Autoloop（附极简内核与插件架构） | 微信公众号 |
| [khazix-one-year-agent-automation-system](/md/wiki/sources/khazix-one-year-agent-automation-system) | 数字生命卡兹克：折腾了整整 1 年，毫无保留地分享一下我这套 Agent 自动化系统（架构、调度与 CI 中台） | 微信公众号 |
| [payment-channel-management-system](/md/wiki/sources/payment-channel-management-system) | 陈天宇宙：详解「支付通道」管理系统——基础概念、全生命周期与产品原型设计 | 微信公众号 |
| [dma-engine-from-descriptor-to-completion](/md/wiki/sources/dma-engine-from-descriptor-to-completion) | GrissomFI：DMA engine——从描述符到完成，一次数据搬运发生了什么 | 微信公众号 |
| [gudunaonao-lifeos-personal-agent-architecture](/md/wiki/sources/gudunaonao-lifeos-personal-agent-architecture) | 孤独大脑：个人 LifeOS 智能体底座搭建法——4 个文件夹与 3 张控制卡 | 孤独大脑 |
| [java-agent-instrumentation-guide](/md/wiki/sources/java-agent-instrumentation-guide) | 终码一生：手把手教你实现一个 Java Agent——从 Instrumentation、Attach 到 Arthas Trace 底层原理 | 微信公众号 |
| [yaohongan-18-days-10-sites-meme-traffic-playbook](/md/wiki/sources/yaohongan-18-days-10-sites-meme-traffic-playbook) | 虹安（@yaohongan2025）：18 天做了 10 个出海站——认真做的没人买，随手糊的出了 91% 的单（新词抢跑与热梗建站实操） | X/Twitter |
| [clanhj-channels-elderly-blessing-ai-video-pitfalls](/md/wiki/sources/clanhj-channels-elderly-blessing-ai-video-pitfalls) | clanhj（@clanhj611）：微信视频号中老年 AI 赛道踩坑复盘——祝福短视频流水线与防真人验证技巧 | X/Twitter |
| [arvin-lobehub-superagent-product-and-engineering-practices](/md/wiki/sources/arvin-lobehub-superagent-product-and-engineering-practices) | 空谷 Arvin Xu（@arvin17x）：LobeHub 中 SuperAgent 的产品技术实践——以工单串联会话、策略化主动唤醒与沉默是金 | X/Twitter |
| [daqi-worst-6-onboarding-antipatterns](/md/wiki/sources/daqi-worst-6-onboarding-antipatterns) | Mengqi Pei（@daqi029）：我见过最糟糕的 Onboarding 新手引导 6 种反模式——用户还没尝到甜头，你先让他干活 | X/Twitter |
| [gkevin-adversarial-subagent-code-review-pitfalls-and-formal-verification](/md/wiki/sources/gkevin-adversarial-subagent-code-review-pitfalls-and-formal-verification) | gKev1n（@GKev1n）：别再沉迷让 Sub-agent 互相 Review 代码了——对抗式审查的三大死穴与实测形式化验证转向 | X/Twitter |
| [peter-yang-affiliate-marketing-overseas-usd-playbook](/md/wiki/sources/peter-yang-affiliate-marketing-overseas-usd-playbook) | Peter Yang（@affnom_y）：什么是联盟营销？——一文带你走进海外美金世界 | X/Twitter |
| [aiwarts-awesome-seedance-463-ai-video-skills](/md/wiki/sources/aiwarts-awesome-seedance-463-ai-video-skills) | 卡尔的AI沃茨（@aiwarts）：我把 463 个 AI 视频做成了 Skill 和提示语模板——全都开源！ | X/Twitter |
| [wangdachui-codex-content-production-solo-primer](/md/wiki/sources/wangdachui-codex-content-production-solo-primer) | 王大锤（@boniusex）：超级个体必备——用 Codex 重构内容生产的全套实操教程 | X/Twitter |
| [weiyux-x-account-zero-to-one-guide](/md/wiki/sources/weiyux-x-account-zero-to-one-guide) | 动物园园长（@weiyux2021）：X（推特）账号运营从 0 到 1——万字实操指南 | X/Twitter |
| [xiaowan-x-account-startup-strategy-3000-followers](/md/wiki/sources/xiaowan-x-account-startup-strategy-3000-followers) | 小晚不在（@bbkirstry）：看完一堆起号攻略＋涨粉 3000 后，我终于悟到了「推特起号焚诀」 | X/Twitter |
| [leo-xiaolei-ai-character-consistency-skill](/md/wiki/sources/leo-xiaolei-ai-character-consistency-skill) | 刘老板（@leo_xiaolei）：必备技能｜伸手即用——AI 人物一致性控制与角色卡制作 Skill | X/Twitter |
| [xiaohui-ai-game-published-20-days-earned-23000](/md/wiki/sources/xiaohui-ai-game-published-20-days-earned-23000) | 程序员小灰（@XiaohuiAI666）：AI 游戏发布 20 天，我赚了 23000 多元 | X/Twitter |
| [stephan-pi-matt-implement-flow-open-source](/md/wiki/sources/stephan-pi-matt-implement-flow-open-source) | Stephan（@Stephan_Talk）：一条命令落地 Matt 工作流——开源 pi-matt-implement-flow 多 Ticket 工程化方案 | X/Twitter |
| [kaitox-markdown-to-x-article](/md/wiki/sources/kaitox-markdown-to-x-article) | kaitox：本地 Markdown 转 X 长文——我开源了目前最顺手的方案（Kaitox 工具链） | 微信公众号 |
| [libtv-agent-100-skills-article-to-video](/md/wiki/sources/libtv-agent-100-skills-article-to-video) | 空格丶：做了个 Skill，把任何文章都变成视频版 PPT（LibTV Agent 100+ Skill 实测） | 微信公众号 |
| [khazix-6-prompt-mindset-techniques](/md/wiki/sources/khazix-6-prompt-mindset-techniques) | 数字生命卡兹克：分享 6 个平时我最常用的 Prompt 心法 | 微信公众号 |
| [aphil-fde-role-real-ai-implementation-guide](/md/wiki/sources/aphil-fde-role-real-ai-implementation-guide) | 阿哲Phil（@Formulasearch）：FDE 是临时外包 or 真 AI 落地？——附小白快速入门与辨别方式 | X/Twitter |
| [jason-zhu-chiang-mai-university-language-program-guide](/md/wiki/sources/jason-zhu-chiang-mai-university-language-program-guide) | Jason Zhu（@GoSailGlobal）：手把手教你申请清迈大学语言班——42000 泰铢，半年泡在清迈学英语 | X/Twitter |
| [adrian-punk-gpt-live-free-speaking-tutor-guide](/md/wiki/sources/adrian-punk-gpt-live-free-speaking-tutor-guide) | Adrian Punk（@AdrianPunk115）：一年省下 2 万块口语课｜GPT Live 实测——英语外教可以下岗了 | X/Twitter |
| [tw93-leading-vs-being-pushed-forward](/md/wiki/sources/tw93-leading-vs-being-pushed-forward) | Tw93（@HiTw93）：走在前面，还是被推着走 | X/Twitter |
| [jacky-infinite-growth-grok-bot-social-media-workflow](/md/wiki/sources/jacky-infinite-growth-grok-bot-social-media-workflow) | Jacky无限生长（@Jackywxsz）：全流程｜如何用 Grok Bot 做自媒体？ | X/Twitter |
| [jason-young-claude-code-project-level-memory](/md/wiki/sources/jason-young-claude-code-project-level-memory) | Jason Young（@Jason_Young1231）：Claude 是如何记住你的项目的？——浅析 Claude Code 项目级记忆功能 | X/Twitter |
| [kongge-space-resume-as-personal-website-skill](/md/wiki/sources/kongge-space-resume-as-personal-website-skill) | 空格.space（@kongge_space）：这个 Skill 把你的简历部署成个人网站 | X/Twitter |
| [leoshen-ai-agent-quickstart-rethinking](/md/wiki/sources/leoshen-ai-agent-quickstart-rethinking) | 川处安（@leoshen0）：一篇速通入门——重新理解 AI Agent 的一切 | X/Twitter |
| [su-vibe-marketing-translation](/md/wiki/sources/su-vibe-marketing-translation) | Su（@Sukiea1008）：【全文中译】Vibe Marketing 如何成为营销工程师 | X/Twitter |
| [thomas-zhou-flow-is-dead](/md/wiki/sources/thomas-zhou-flow-is-dead) | Thomas Zhou（@thomaszhou_）：心流已死 | X/Twitter |
| [xiaoer-global-payout-without-hk-company](/md/wiki/sources/xiaoer-global-payout-without-hk-company) | 小耳👂Jane｜Xiaoer（@xiaoerzhan）：如何不出境、不开香港公司，给自己的产品接上全球收款 | X/Twitter |
| [laoyang-5-free-osint-tools-for-people-and-companies](/md/wiki/sources/laoyang-5-free-osint-tools-for-people-and-companies) | 老杨啊｜AI产品商业化（@yhslgg）：网警同款开盒思路——查人查公司查设备，五个免费开源工具 | X/Twitter |
| [xiaoniaoziming-lie-down-income-system-20-to-now](/md/wiki/sources/xiaoniaoziming-lie-down-income-system-20-to-now) | 周小鸟开窍（@xiaoniaoziming）：如何躺着赚钱——从 20 岁到现在的躺赚体系 | X/Twitter |
| [aikangarooking-open-source-ai-course-selling-website](/md/wiki/sources/aikangarooking-open-source-ai-course-selling-website) | 袋鼠帝（@aikangarooking）：爆肝 30 天！我们开源了一个让 AI 课程卖家集体失业的网站 | X/Twitter |
| [riverai-pi-session-control-cross-agent-messaging](/md/wiki/sources/riverai-pi-session-control-cross-agent-messaging) | RiverAi7z（@RiverAi7z）：Pi 的 Session Control——让不同终端里的 Coding Agent 直接互相发消息 | X/Twitter |
| [adrian-mckinsey-style-consulting-visual-prompts](/md/wiki/sources/adrian-mckinsey-style-consulting-visual-prompts) | Adrian Punk（@AdrianPunk115）：想做高级咨询风视觉？这套麦肯锡风格提示词可以直接复制 | X/Twitter |
| [ai-ads-apps-find-app-idea-people-already-waiting-to-pay](/md/wiki/sources/ai-ads-apps-find-app-idea-people-already-waiting-to-pay) | AI, Ads & Apps（@AIAdsApps）：如何找到已经有人等着付钱的 App 点子（含 10 万美元/月案例） | X/Twitter |
| [fred-new-github-information-arbitrage-8-methods](/md/wiki/sources/fred-new-github-information-arbitrage-8-methods) | Fred-New（@Fred834567）：GitHub 信息差套利 8 法——remote-job / ai-money-maker / TelegramGroup 等仓库速览 | X/Twitter |
| [zhangzijun-12-iphone-8-growth-server-monetization](/md/wiki/sources/zhangzijun-12-iphone-8-growth-server-monetization) | 张子俊（@wuxindehuaft）：把 12 台 iPhone 8 变成增长机房——X 博主如何把内部实验做成公开作品集再变现 | X/Twitter |
| [yangjin-ip-system-underlying-architecture](/md/wiki/sources/yangjin-ip-system-underlying-architecture) | 杨进（@shaozhu93314）：构建 IP 系统的底层架构（全文手打、放心食用） | X/Twitter |
| [crazykaomei-guofeng-wuxia-english-drama-evergreen-playbook](/md/wiki/sources/crazykaomei-guofeng-wuxia-english-drama-evergreen-playbook) | 疯狂的烤妹儿（@CrazyKaomei）：爆款复刻｜月涨粉 5w 还能出海赚美金——拆透「古风武侠英语剧」的长青打法 | X/Twitter |
| [simon-ai-hot-topic-long-video-1-08m-views](/md/wiki/sources/simon-ai-hot-topic-long-video-1-08m-views) | Simon聊AI（@HanZhang415188）：用 AI 做热点长视频——单条 108 万播放，3 天涨粉近万的实操复盘 | X/Twitter |
| [liangzhu-product-selection-before-building](/md/wiki/sources/liangzhu-product-selection-before-building) | 良竹（@liangzhu_AI）：产品出海第一步——选择比努力重要 100 倍，快速完成比完美重要 1000 倍 | X/Twitter |
| [miles-ma-ai-beginner-guide-no-courses](/md/wiki/sources/miles-ma-ai-beginner-guide-no-courses) | Miles Ma（@miles_mazy）：零基础入门 AI，看完这篇就够了（避免花钱买课被割韭菜版） | X/Twitter |
| [kk-ai-notes-opc-wanlihui-overseas-address-proof](/md/wiki/sources/kk-ai-notes-opc-wanlihui-overseas-address-proof) | KK的AI笔记（@ainotes_KK）：OPC 出海必备工具｜万里汇获取海外地址证明完整教程 | X/Twitter |
| [adrian-workbuddy-boss-friendly-ppt](/md/wiki/sources/adrian-workbuddy-boss-friendly-ppt) | Adrian Punk（@AdrianPunk115）：用 WorkBuddy 做老板爱看的 PPT | X/Twitter |
| [heizolshao-air-fryer-site-reddit-and-ai-search-growth](/md/wiki/sources/heizolshao-air-fryer-site-reddit-and-ai-search-growth) | 左海（@heizolshao）：一个空气炸锅独立站，怎么靠 Reddit 和 AI 搜索把日单从 30 做上 210 | X/Twitter |
| [jolestar-what-is-holon-and-why-build-it](/md/wiki/sources/jolestar-what-is-holon-and-why-build-it) | jolestar（@jolestar）：Holon 是什么，以及我为什么要做 Holon | X/Twitter |
| [dotey-ai-native-thinking-train-yourself-like-an-llm](/md/wiki/sources/dotey-ai-native-thinking-train-yourself-like-an-llm) | 宝玉（@dotey）：腾讯学堂｜AI 原生思维——像训练大模型一样训练自己 | X/Twitter |
| [xaiwind-github-complete-beginner-to-master-guide](/md/wiki/sources/xaiwind-github-complete-beginner-to-master-guide) | 想风（@xaiwind）：万字长文｜超详细的 GitHub 教程，从入门到精通 | X/Twitter |
| [longhai-parenting-first-principles-comprehensive-guide](/md/wiki/sources/longhai-parenting-first-principles-comprehensive-guide) | 龙海（@longhaiqwe123）：万字长文（含配图），讲清楚育儿的第一性原理 | X/Twitter |
| [noahduck-stripe-complete-guide-from-beginner-to-advanced](/md/wiki/sources/noahduck-stripe-complete-guide-from-beginner-to-advanced) | 诺鸭船长3（@noahduck283）：Stripe 全网最全使用指南——从入门到榨干 | X/Twitter |
| [hezhiyan-outsea-3000usd-monthly-content-digest](/md/wiki/sources/hezhiyan-outsea-3000usd-monthly-content-digest) | droidHZ（@hezhiyan7）：月入 3 千刀达成，网站出海内容整理 | X/Twitter |
| [gosailglobal-ai-tools-seo-checklist-15-pitfalls](/md/wiki/sources/gosailglobal-ai-tools-seo-checklist-15-pitfalls) | Jason Zhu（@GoSailGlobal）：做 AI 工具站要装哪些 SEO 工具？我们踩了 15 个坑后的完整清单 | X/Twitter |
| [hezhiyan-finding-demands-from-promotion-channels](/md/wiki/sources/hezhiyan-finding-demands-from-promotion-channels) | droidHZ（@hezhiyan7）：从推广渠道找需求——反向推导爆款独立站选题 | X/Twitter |
| [xingjia-young-adults-net-worth-under-1m-survival-checklist](/md/wiki/sources/xingjia-young-adults-net-worth-under-1m-survival-checklist) | 在香港的宁夏三娃老父亲星佳（@xingjia520）：存款不到 100 万的年轻人，请直接照做这张生存清单 | X/Twitter |
| [weichen-why-creators-should-register-sole-proprietorship](/md/wiki/sources/weichen-why-creators-should-register-sole-proprietorship) | 微尘印记（@weichen_ink）：为什么我建议自媒体和独立开发者，都去办个个体工商户？ | X/Twitter |
| [wquguru-claude-subscription-complete-guide-from-scratch](/md/wiki/sources/wquguru-claude-subscription-complete-guide-from-scratch) | WquGuru（@wquguru）：普通人的 Claude 订阅方案（从 0 到 1 完整版，含支付和身份认证） | X/Twitter |
| [alswl-ai-native-workstyle-from-info-to-delivery](/md/wiki/sources/alswl-ai-native-workstyle-from-info-to-delivery) | Jingchao（@alswl）：AI Native 时代的工作方式——从信息到交付 | X/Twitter |
| [elliothux-open-source-cloudflare-workers-architecture](/md/wiki/sources/elliothux-open-source-cloudflare-workers-architecture) | Elliot（@elliothux）：我把 Cloudflare 开源了——边缘计算架构与极简自建方案 | X/Twitter |
| [jinchenma-ai-tools-landscape-and-selection-guide](/md/wiki/sources/jinchenma-ai-tools-landscape-and-selection-guide) | 金尘马（@jinchenma_ai）：AI 工具太多了不知道怎么选？一文讲清楚常用 AI 工具与选择逻辑（2026 年 10 月版） | X/Twitter |
| [kingao-grok-bot-wechat-integration-guide](/md/wiki/sources/kingao-grok-bot-wechat-integration-guide) | Kin（@KinGao476942）：如何把 Grok Bot 接入你的微信？保姆级新手指南来了（附详细提示词） | X/Twitter |
| [lxfater-gpt-image-2-automation-arbitrage-cases](/md/wiki/sources/lxfater-gpt-image-2-automation-arbitrage-cases) | 铁锤人（@lxfater）：GPT Image 2 爆火，如何跑通自动化生图套利？（附 6 个真实需求案例） | X/Twitter |
| [minaoneday-stockings-texture-prompt-engineering-skill](/md/wiki/sources/minaoneday-stockings-texture-prompt-engineering-skill) | Mina（@minaoneday）：我做了一个丝袜材质提示词 Skill——输入厚度和颜色，输出直用材质提示词 | X/Twitter |
| [xaiwind-codex-20-social-media-skills-one-man-team](/md/wiki/sources/xaiwind-codex-20-social-media-skills-one-man-team) | 想风（@xaiwind）：Codex 自媒体运营 Skill 大全｜20 个装完，一个人顶一个团队 | X/Twitter |
| [yangzai-wechat-tietu-1-1m-reads-1500-daily-income](/md/wiki/sources/yangzai-wechat-tietu-1-1m-reads-1500-daily-income) | 牙仔（@yang02010）：公众号贴图这么猛？新人第 8 天 110 万阅读，单日变现 1500+ | X/Twitter |
| [yanliudreamer-10k-usd-us-stocks-investment-blueprint](/md/wiki/sources/yanliudreamer-10k-usd-us-stocks-investment-blueprint) | Dreameryanyan（@yanliudreamer）：如果只有 1 万美元，我会怎么开始投资美股？ | X/Twitter |
| [yaojingang-17-knowledge-monetization-prompt-templates](/md/wiki/sources/yaojingang-17-knowledge-monetization-prompt-templates) | 姚金刚（@yaojingang）：开源 17 套知识付费提示词——课程定位、设计、售卖与运营全流程 | X/Twitter |
| [yhslgg-jianying-baidunetdisk-svip-short-video-and-live-ecommerce-sop](/md/wiki/sources/yhslgg-jianying-baidunetdisk-svip-short-video-and-live-ecommerce-sop) | 老杨啊（@yhslgg）：剪映/百度网盘 SVIP 年卡会员短视频&直播带货 0~1 保姆级教程 | X/Twitter |
| [yooee-xiaohongshu-zero-followers-monetization-blueprint](/md/wiki/sources/yooee-xiaohongshu-zero-followers-monetization-blueprint) | Yooee（@Yooeec3）：妈妈教程｜像亲妈一样手把手教你 0 粉新号在小红书完成「流量→收钱」闭环 | X/Twitter |
| [aronhouyu-ai-trending-keywords-discovery-and-topic-pipeline](/md/wiki/sources/aronhouyu-ai-trending-keywords-discovery-and-topic-pipeline) | Aron厚玉（@aronhouyu）：用 AI 搭建流量上升词自动发现与批量选题流水线 | X/Twitter |
| [chainepic-self-hosted-search-console-dashboard-opensource](/md/wiki/sources/chainepic-self-hosted-search-console-dashboard-opensource) | Roland（@ChainEpic）：开源多搜索引擎控制台仪表盘——Google、Bing 与 Yandex 数据聚合 | X/Twitter |
| [eian-chatgpt-intelligent-ui-10-cases-and-prompts](/md/wiki/sources/eian-chatgpt-intelligent-ui-10-cases-and-prompts) | Eian（@EianLu）：ChatGPT 这个更新被严重低估了——10 个最具代表性的 Intelligent UI 玩法（附提示词） | X/Twitter |
| [hiwise-qwen-image-2-1-turbo-uncensored-comfyui-deploy](/md/wiki/sources/hiwise-qwen-image-2-1-turbo-uncensored-comfyui-deploy) | 启明破晓（@hiwise_aigc）：8G 显存也能跑——Qwen-Image-2.1-Turbo 本地部署 8 步出图（附 ComfyUI 工作流） | X/Twitter |
| [fox-how-ai-helps-us-understand-ai-output](/md/wiki/sources/fox-how-ai-helps-us-understand-ai-output) | Fox（@indie_maker_fox）：如何让 AI 帮助我们理解 AI 的输出 | X/Twitter |
| [kimberly-ai-one-click-content-generator-for-xhs-and-wechat](/md/wiki/sources/kimberly-ai-one-click-content-generator-for-xhs-and-wechat) | Kimberly（@king1818888）：有嘴就行！小白零门槛，AI 一键生成小红书和公众号内容 | X/Twitter |
| [kongge-space-10-skills-daily-explosive-wechat-article-system](/md/wiki/sources/kongge-space-10-skills-daily-explosive-wechat-article-system) | 空格.space（@kongge_space）：10 个 Skill 搭建日更爆文的公众号写作系统 | X/Twitter |
| [tiancai-us-credit-card-forwarding-anytime-mailbox-pirateship](/md/wiki/sources/tiancai-us-credit-card-forwarding-anytime-mailbox-pirateship) | 李天才（@Lniosytest）：美卡转运回国教程——Anytime Mailbox 虚拟美国地址 + PirateShip 海盗船打单，C1 信用卡 UPS 7 天到国内 | X/Twitter |
| [miles-mazy-outsea-usd-seo-comprehensive-tutorial](/md/wiki/sources/miles-mazy-outsea-usd-seo-comprehensive-tutorial) | Miles Ma（@miles_mazy）：出海赚美金系列｜SEO 保姆级教程 | X/Twitter |
| [pinminlw-malaysia-personal-tax-number-tin-online-guide](/md/wiki/sources/pinminlw-malaysia-personal-tax-number-tin-online-guide) | pinminlw（@pinminlw）：🇲🇾 马来西亚个人税号（TIN）免费申请攻略——手把手教你线上办理 | X/Twitter |
| [pluviobyte-cloudflare-domain-email-5usd-monthly-guide](/md/wiki/sources/pluviobyte-cloudflare-domain-email-5usd-monthly-guide) | 雪踏乌云（@Pluvio9yte）：Cloudflare 域名邮箱，每月只需 5 美金——保姆级配置教程 | X/Twitter |
| [wlzh-us-cloud-resident-ssn-ein-address-phone-guide](/md/wiki/sources/wlzh-us-cloud-resident-ssn-ein-address-phone-guide) | M.（@wlzh）：人在国内，却有美国税号、美国地址和美国手机号——美国云居民扫盲 | X/Twitter |
| [tomcc-claude-opus-5-5-account-growth-playbook](/md/wiki/sources/tomcc-claude-opus-5-5-account-growth-playbook) | Tom CC（@Tom_CC_9986）：用 Opus 5.5 起号真的太爽了——高质量内容生产与自媒体冷启动 | X/Twitter |
| [andyl-ai-automated-revenue-generating-website-guide](/md/wiki/sources/andyl-ai-automated-revenue-generating-website-guide) | Andy L（@AndyL5cc）：我用 AI 做了一个自动赚钱的网站——客户自己下单，我睡觉也能收钱 | X/Twitter |
| [wangzai-personal-ip-three-word-mantra-copy-surpass-monetize](/md/wiki/sources/wangzai-personal-ip-three-word-mantra-copy-surpass-monetize) | 汪仔（@wangzaimedia）：个人 IP 的三字真经——抄、超、钞 | X/Twitter |
| [zhongjian-10-curated-seo-backlinks-trading-platforms](/md/wiki/sources/zhongjian-10-curated-seo-backlinks-trading-platforms) | Zhong Jian（@houzhongji89090）：10 个值得收藏的 SEO 外链交易平台，做独立站和海外 SEO 的建议收藏 | X/Twitter |
| [heizolshao-reddit-tiered-community-operations-playbook](/md/wiki/sources/heizolshao-reddit-tiered-community-operations-playbook) | 左海（@heizolshao）：Reddit 社区分层精细化运营实战指南 | X/Twitter |
| [aichuhai-my-perspective-on-shengcaiyoushu](/md/wiki/sources/aichuhai-my-perspective-on-shengcaiyoushu) | 爱出海（@ai_chuhai）：说下我眼里的生财有术，可能很多你都不知道 | X/Twitter |
| [lee-independent-developer-workflow-and-practices](/md/wiki/sources/lee-independent-developer-workflow-and-practices) | 木子不是木子狸（@lee04052822）：好久没写东西了——分享下如何做开发的 | X/Twitter |
| [maiyang-non-cs-lauren-tan-delegating-to-agents](/md/wiki/sources/maiyang-non-cs-lauren-tan-delegating-to-agents) | Mai Yang（@MaiYangAI）：非 CS 出身的 Lauren Tan，是怎么一步步放手给 Agent 的 | X/Twitter |
| [siaxiom-grok-bot-x-operations-10-steps-prompt-playbook](/md/wiki/sources/siaxiom-grok-bot-x-operations-10-steps-prompt-playbook) | SI Axiom（@SIAxiom）：别再盲目发推了！用 Grok Bot 搭建一套 X 运营流程，10 步实操，附完整指令 | X/Twitter |
| [adrian-ai-video-fundamentals-framing-camera-and-continuity](/md/wiki/sources/adrian-ai-video-fundamentals-framing-camera-and-continuity) | Adrian Punk（@AdrianPunk115）：AI 视频基础（中册）——景别、机位、运镜与画面连续性 | X/Twitter |
| [heizolshao-why-reddit-commenting-is-more-important-than-posting](/md/wiki/sources/heizolshao-why-reddit-commenting-is-more-important-than-posting) | 左海（@heizolshao）：为什么在 Reddit 上“评论”远比“发帖”更重要？深度解析与实操指南 | X/Twitter |
| [pamela-build-personal-website-from-scratch-60-ui-checklist](/md/wiki/sources/pamela-build-personal-website-from-scratch-60-ui-checklist) | PamelaAI·H（@pamelaaaaa1218）：从 0 搭建个人网站——8 大类 60+ UI 设计必备清单 | X/Twitter |
| [situking-entrepreneurship-100-qa-for-creators-and-solopreneurs](/md/wiki/sources/situking-entrepreneurship-100-qa-for-creators-and-solopreneurs) | 司徒K（@situking）：创业百问百答——写给自媒体人和个人创业者（2.3 万字长文实战心法） | X/Twitter |
| [dankoe-human-3-0-map-to-reach-the-top-one-percent](/md/wiki/sources/dankoe-human-3-0-map-to-reach-the-top-one-percent) | Dan Koe（@thedankoe）：Human 3.0 – A Map To Reach The Top 1%（登顶前 1% 的认知进化地图） | X/Twitter |
| [wangzai-x-twitter-zero-to-one-beginner-operations-guide](/md/wiki/sources/wangzai-x-twitter-zero-to-one-beginner-operations-guide) | 汪仔（@wangzaimedia）：从 0 到 1 的 X 入门运营指南 | X/Twitter |
| [longhai-oh-my-x-browser-extension-24-pain-points](/md/wiki/sources/longhai-oh-my-x-browser-extension-24-pain-points) | 龙海（@longhaiqwe123）：玩 X 瑞士军刀——开源浏览器插件 Oh My X，解决 24 个网页端操作痛点（附代码） | X/Twitter |
| [govin-github-6-insane-open-source-projects-monetization](/md/wiki/sources/govin-github-6-insane-open-source-projects-monetization) | G哥（@goan999999）：GitHub 已经彻底疯了！这 6 个免费开源项目，搞钱、提效真的太猛了 | X/Twitter |
| [jaden-paul-graham-how-time-and-money-are-lost](/md/wiki/sources/jaden-paul-graham-how-time-and-money-are-lost) | Jaden 抽象日志（@Jaden_riku）：Paul Graham——时间和金钱，是怎样失去的 | X/Twitter |
| [xoyif-red-crow-ai-batch-xhs-image-text-replication-skill](/md/wiki/sources/xoyif-red-crow-ai-batch-xhs-image-text-replication-skill) | 北衡（@xoyif63862452）：红鸦 AI——一人公司怎么批量做小红书图文，靠的是这个复刻 Skill | X/Twitter |
| [alswl-ai-native-practices-continuation-towards-stage-8](/md/wiki/sources/alswl-ai-native-practices-continuation-towards-stage-8) | Jingchao（@alswl）：AI Native 实践续篇——迈向 Stage 8（全自动软件交付与认知升级） | X/Twitter |
| [sagasu-grok-bot-automated-backlink-submission-4000-sites](/md/wiki/sources/sagasu-grok-bot-automated-backlink-submission-4000-sites) | SagaSu（@sujingshen）：用 Grok Bot 自动化提交外链——一天跑完 4000 多个站的完整流程 | X/Twitter |
| [qianshuixia-wise-hk-card-stripe-and-outsea-express-solution](/md/wiki/sources/qianshuixia-wise-hk-card-stripe-and-outsea-express-solution) | 浅水虾（@qianshuixia2026）：Wise 港卡搞定 Stripe！避开号码泄露，送大家出海“三通一达” | X/Twitter |
| [liangzhu-fde-in-action-01-automated-local-content-delivery-sop](/md/wiki/sources/liangzhu-fde-in-action-01-automated-local-content-delivery-sop) | 良竹（@liangzhu_AI）：掌控 AI·FDE 实战 01｜万字实操 SOP——搭建本地自动内容交付流水线 | X/Twitter |
| [threeai-10-ways-to-monetize-ai-beauty-content-china-cases](/md/wiki/sources/threeai-10-ways-to-monetize-ai-beauty-content-china-cases) | 三个三（@3three_AI）：从国内真实案例看，把 AI 美女变成钱的 10 种方法 | X/Twitter |
| [qingjiang-make-ai-talk-like-human-formula-guide](/md/wiki/sources/qingjiang-make-ai-talk-like-human-formula-guide) | 情酱（@qingj1314）：怎么让你的 AI 说人话？我整理了一套公式化方案 | X/Twitter |
| [ale-3-days-120-orders-one-person-twitter-launch-manual](/md/wiki/sources/ale-3-days-120-orders-one-person-twitter-launch-manual) | aix阿乐（@Leepriest1990）：3 天 120 单、变现 1 万——一人推特发售的完整手册（附 4 步法） | X/Twitter |
| [yangjin-operator-underlying-logic-and-business-closed-loop](/md/wiki/sources/yangjin-operator-underlying-logic-and-business-closed-loop) | 杨进（@shaozhu93314）：构建操盘手的底层逻辑「全文手打、放心食用」 | X/Twitter |
| [heizolshao-reddit-comments-conversion-and-seed-users-playbook](/md/wiki/sources/heizolshao-reddit-comments-conversion-and-seed-users-playbook) | 左海（@heizolshao）：Reddit 评论区转化实操笔记——从安全留链到沉淀种子用户 | X/Twitter |
| [hytidel-career-choice-dont-choose-jobs-you-cannot-match](/md/wiki/sources/hytidel-career-choice-dont-choose-jobs-you-cannot-match) | Hytidel 聊商业（@HytidelLegend）：找工作不要选你配不上的工作 | X/Twitter |
| [zhouluobo-design-personal-agent-learns-visual-style](/md/wiki/sources/zhouluobo-design-personal-agent-learns-visual-style) | zhouluobo（@zhouluobo）：设计界的 Personal Agent 也来了——偷学我的作图风格，现在比我还熟 | X/Twitter |
| [crazykaomei-youtube-minimal-matchstick-man-cashflow-pipeline](/md/wiki/sources/crazykaomei-youtube-minimal-matchstick-man-cashflow-pipeline) | 疯狂的烤妹儿（@CrazyKaomei）：爆款复刻｜YouTube 极简火柴人搞钱流水线，优质内容心法 + 全套工作流开源 | X/Twitter |
| [wangzai-why-publishing-so-much-content-yields-no-clients](/md/wiki/sources/wangzai-why-publishing-so-much-content-yields-no-clients) | 汪仔（@wangzaimedia）：为什么你发了那么多内容，还是没有客户？ | X/Twitter |
| [chrisslacker-wechat-image-text-post-three-days-monetization-sop](/md/wiki/sources/chrisslacker-wechat-image-text-post-three-days-monetization-sop) | 科技混子Chris（@ChrisSlacker）：公众号贴图，3 天收入破百，1 篇收入破千——附 5 步实操 SOP | X/Twitter |
| [nopinduoduo-ai-comic-drama-production-10000-credits-tutorial](/md/wiki/sources/nopinduoduo-ai-comic-drama-production-10000-credits-tutorial) | 我真的没有拼多多（@nopinduoduo）：不会分镜和运镜？普通人到底能不能上手做 AI 漫剧？花 1 万积分的实测教程 | X/Twitter |
| [phil-design-personal-ip-and-codex-desktop-pet-tutorial](/md/wiki/sources/phil-design-personal-ip-and-codex-desktop-pet-tutorial) | 阿哲Phil（@Formulasearch）：快速上手设计一款个人 IP，并做成 Codex 宠物（附提示词和链接） | X/Twitter |
| [niko-controlling-codex-dialogue-rhythm-interrupt-queue-branch](/md/wiki/sources/niko-controlling-codex-dialogue-rhythm-interrupt-queue-branch) | Niko爱学习（@ai_super_niko）：掌控 Codex 对话节奏——打断、排队、引导和分叉 | X/Twitter |
| [heminglu-from-ontology-to-ontology-modeling-business-semantics](/md/wiki/sources/heminglu-from-ontology-to-ontology-modeling-business-semantics) | 何明璐（人月聊IT）：从本体论到本体建模——如何构建可生成可推理的业务语义规范 | 微信公众号 |
| [xiaozhang-jetbrains-thinkrail-ai-ide](/md/wiki/sources/xiaozhang-jetbrains-thinkrail-ai-ide) | 小张：JetBrains 终于出手了！开源 AI IDE ThinkRail——以后写代码，可能真不需要人盯着了 | 微信公众号 |
| [0xding-ankole-agent-os-for-teams](/md/wiki/sources/0xding-ankole-agent-os-for-teams) | Li (Boris) Ding（@0xDing）：为团队构建真正的 Agent OS——来自 Ankole 的工程实践 | X/Twitter |
| [intentplex-grok-bot-directory-backlink-automation](/md/wiki/sources/intentplex-grok-bot-directory-backlink-automation) | Wyong（@intentplex）：用 Grok Bot 自动化提交免费目录站外链——可落地的批量做法 | X/Twitter |
| [tangcheng-voice-pipeline-asr-tts-300ms-response](/md/wiki/sources/tangcheng-voice-pipeline-asr-tts-300ms-response) | 唐成：评论区说「ASR+TTS 接入 300ms 不可能」——实测与源码回应 | 微信公众号 |
| [yihuihui-unified-export-download-center](/md/wiki/sources/yihuihui-unified-export-download-center) | 一灰灰blog：导出功能还要每个系统写一遍吗？统一下载中心的收口思路 | 微信公众号 |
| [maynorai-gpt-images-26-15-monetization-plays](/md/wiki/sources/maynorai-gpt-images-26-15-monetization-plays) | MomoAI（@MaynorAI1）：GPT Images 2.6 这波更新能赚什么、能上什么站——15 个玩法 + 7 个开源 Cloudflare 演示站 | X/Twitter |
| [maynorai-gpt-images-26-14-hottest-plays](/md/wiki/sources/maynorai-gpt-images-26-14-hottest-plays) | MomoAI（@MaynorAI1）：GPT Images 2.6 目前最火的 14 种玩法（按热度排序）——每项保留原帖与可复现路径 | X/Twitter |
| [barret-super-agent-prompt-proactive-perception-inbox-outbox-l5](/md/wiki/sources/barret-super-agent-prompt-proactive-perception-inbox-outbox-l5) | Barret李靖（@Barret_China）：把 Pi、DSH、Super-Agent 组装成主动服务的超级智能——一段提示词里的自主分级、Inbox/Outbox 与 HITL 机制 | X/Twitter |
| [leo-3-days-launch-overseas-saas-server-domain-payment-seo](/md/wiki/sources/leo-3-days-launch-overseas-saas-server-domain-payment-seo) | 刘老板（@leo_xiaolei）：3 天上线一个出海 SaaS——服务器、域名、收款与 SEO 全记录 | X/Twitter |
| [lucaspei-xiaohongshu-agent-automated-product-selection](/md/wiki/sources/lucaspei-xiaohongshu-agent-automated-product-selection) | 裴同学（@LucasPei181034）：小红书 × Agent × 自动化选品，真的爽翻了！ | X/Twitter |
| [ashfold-dim-event-timeline-agent-harness-release](/md/wiki/sources/ashfold-dim-event-timeline-agent-harness-release) | Han Cheng e/acc（@ashfold）：发布 dim——为 Agent 构造新的容器与躯体 | X/Twitter |
| [chainepic-tool-site-competitor-keyword-seo-formula](/md/wiki/sources/chainepic-tool-site-competitor-keyword-seo-formula) | Roland（@ChainEpic）：工具站最易出单的五步 SEO 焚诀——竞品词劫持、首屏参数表、客观捧杀与实测截图 | X/Twitter |
| [jessicao-x-article-skill-corpus-illustration-cover-open-source](/md/wiki/sources/jessicao-x-article-skill-corpus-illustration-cover-open-source) | Jessi Cao（@JessiCao_JC）：我把写 X 长文的流程做成了 Skill——语料、配图、封面，整套开源 | X/Twitter |
| [binghe-grok-bot-14day-topics-and-hot-comments-demand-mining](/md/wiki/sources/binghe-grok-bot-14day-topics-and-hot-comments-demand-mining) | 冰河（@binghe）：我教你怎么用 AI 马上赚到钱——用 Grok Bot 扒大博主近 14 天选题，再从评论区挖真实付费需求 | X/Twitter |
| [wuc-three-line-workflow-keyword-code-backlink-pipeline](/md/wiki/sources/wuc-three-line-workflow-keyword-code-backlink-pipeline) | Wu（@Wuc436）：重构后的工作流——找词线、代码线、外链线三条并行流水线的极简分工 | X/Twitter |
| [antiaivo-handwrite-mini-cordis-before-learning-dsh](/md/wiki/sources/antiaivo-handwrite-mini-cordis-before-learning-dsh) | 纳米AI（@antiAIvo）：学 DeepSeek Harness 之前，我先手写了一个迷你版 Cordis | X/Twitter |
| [eian-claude-code-codex-seedance-ai-video-full-workflow](/md/wiki/sources/eian-claude-code-codex-seedance-ai-video-full-workflow) | Eian（@EianLu）：Claude Code/Codex + Seedance AI 视频——从一个想法到成片的全流程 | X/Twitter |
| [ipp-pod-side-project-logic-overview](/md/wiki/sources/ipp-pod-side-project-logic-overview) | 澎湃王侯：【TK-POD】副业项目逻辑概述——信息差 × POD 按需生产 × 跨境的三层组合 | 微信公众号 |
| [joker-seo-data-metrics-confusion](/md/wiki/sources/joker-seo-data-metrics-confusion) | Joker（SEOActionBlog 演讲嘉宾）：SEOer 容易陷入的「数据指标」困惑——DR/DA/AS、外链数量、字数与跳出率的真相 | 微信公众号 / X/Twitter |

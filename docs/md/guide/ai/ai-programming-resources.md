---
title: "AI 编程资源导航"
date: "2026-05-05"
---

# AI 编程资源导航

> 收录 AI 编程相关的工具、平台、视频等内容。

---

## 视频课程

- [如何使用 Smart Domain 实现 DDD？](https://www.bilibili.com/video/BV1QT411J7jh/) — B站视频
- [Harness for AI coding 团队级 AI 编程驾驭工程](https://b23.tv/aRXiG9J) — 2026-04-25
- [AI 编程中的测试和 Loop](https://www.bilibili.com/video/BV1atjU6KEJF/) — 2026-06-20

---

## 协作平台

- [Multica](https://github.com/multica-ai/multica) — 专为 AI-native 团队设计的 Agent + 人的协作平台，AI agent 是一等公民的任务管理工具，官网 [multica.ai](https://multica.ai)
- [VibeKanban](https://vibekanban.com/) — AI 研发工程从本地化到在线化/共享化
- [OpenAI Symphony](https://github.com/openai/symphony) — 将项目工作转化为隔离的自主执行运行，团队管理工作而非监督 AI coding agent。监控 Linear 工单板，自动派发任务给 Codex Agent，Agent 完成后提供 CI 状态、PR 审查反馈、复杂度分析等证明，23.5k stars
  - [官方博客：Symphony 开源规范发布](https://openai.com/index/open-source-codex-orchestration-symphony/) — 2026-04-27，OpenAI 工程师博文，内部部分团队 3 周内 PR 数量提升 500%
  - [InfoWorld 报道](https://www.infoworld.com/article/4164173/openais-symphony-spec-pushes-coding-agents-from-prompts-to-orchestration.html) — 分析 Symphony 将 AI 从个人编程助手向团队共享工程基础设施的转型，Forrester 分析师指出 Agent 控制平面和自适应流程编排的价值
  - [Help Net Security 报道](https://www.helpnetsecurity.com/2026/04/28/openai-symphony-codex-orchestration-linear/) — 详细介绍"人类注意力瓶颈"（每人只能监督 3-5 个 Codex 会话），以及团队 PM/Designer 从 Linear 手机 App 提交工单的实践

---

## 内容运营技能

- [内容运营人必装的4个skill（上）](https://mp.weixin.qq.com/s/kqcpZKJLJMh2EyJF3wJTbw) — Agent Reach（AI上网能力）、Marketing Skills（营销方法论提示词）、RedBox（小红书创作工具）、Scrapling（高级网页爬虫）、Maccy（剪贴板管理器）

---

## Claude Skills 精选（2026年）

> 来源：[@sylvainxai](https://x.com/i/status/2037772956483678532) 整理

### 发现与元技能

- [find-skills](https://github.com/find-skills) — 在 GitHub 上搜索和查找合适的 Skills，按类别、星级和更新时间筛选
- [skill-creator](https://github.com/skill-creator) — 自动生成标准化的 SKILL.md 文件和目录结构，将团队 SOP 转化为可安装的技能包
- [superpowers](https://github.com/superhuman/superpowers) — 将 AI 从"执行者"转变为"项目经理"，通过持续跟进协助头脑风暴和需求文档生成
- [mattpocock/skills](https://github.com/mattpocock/skills) — TypeScript 大神 Matt Pocock（前 Vercel 工程师）的 AI 编程工作流技能库，82.5k stars，18 个技能
  - 安装：`npx skills@latest add mattpocock/skills`
  - 痛点拆解：沟通不对齐、术语不统一、缺反馈循环、代码熵增
  - 核心技能：`/grill-me`（深度需求拷问）、`/tdd`（红绿重构）、`/caveman`（精简 token 75%）、`/improve-codebase-architecture`（代码库定期保养）
  - 背景：《The Pragmatic Programmer》+ DDD + XP 工程经验提炼

### 工程与设计标准

- [vercel-react-best-practices](https://github.com/vercel/react-best-practices) — 巩固团队开发标准，涵盖可读性、性能和边缘案例处理
- [vue-best-practices](https://github.com/vuejs/core) — 标准化组件边界、状态管理和复用策略
- [frontend-design](https://github.com/anthropic/frontend-design) — 使用 Tailwind/shadcn/ui 生成高质量 HTML/CSS/React 代码，聚焦间距和对齐避免"AI风味"
- [ui-ux-pro-max-skill](https://github.com/ui-ux-pro-max/ui-ux-pro-max-skill) — 跨平台设计（Web、iOS、Android）、响应式布局和设计系统管理
- [web-design-guidelines](https://github.com/web-design-guidelines) — 将网页设计规则系统化：层次结构、排版、无障碍
- [building-native-ui](https://github.com/building-native-ui) — React Native/Expo 原生 UI 步骤，避免平台差异和手势错误
- [remotion-best-practices](https://github.com/remotion-dev/remotion-best-practices) — 可编程视频项目标准，聚焦项目结构和渲染性能

### 生产力与知识管理

- [planning-with-files](https://github.com/planning-with-files) — 自动维护 todo.md 和 plan.md 跟踪任务状态，防止无限循环
- [ralph-wiggum](https://github.com/ralph-wiggum) — planning-with-files 的执行伙伴，负责执行具体计划任务
- [document-skills](https://github.com/anthropic/document-skills) — 官方"四大技能"：Docx、Xlsx、Pptx 和 PDF 完整套件
- [obsidian-skills](https://github.com/obsidianmd/obsidian-skills) — 自动化知识库管理、双向链接优化和 Canvas 功能
- [Markitdown](https://github.com/dstearle/markitdown) — 将 PDF、PPT、图片、音频和 ZIP 转换为 Markdown
- [notebooklm-skill](https://github.com/notebooklm/skill) — 将视频字幕和 PDF 集成到云知识库
- [moore-wechat-article-downloader](https://github.com/Moore-developers/moore-wechat-article-downloader) — 本地优先的公众号 Skill：同步/研究/收藏/归档 4 大场景，SQLite 状态管理，评论互动数据写回 Markdown

### 自动化、营销与研究

- [agent-browser](https://github.com/agent-browser/agent-browser) — 自动化浏览、提取信息和生成表格，构建重复性研究任务结构
- [X-article-publisher-skill](https://github.com/x-article-publisher/x-article-publisher-skill) — 使 AI 能像人类一样操作网页（登录、填表、上传），将网站变成私人工具
- [seo-audit](https://github.com/seo-audit/seo-audit) — 提供标题、元标签和页面速度检查清单，可直接转化为任务清单
- [copywriting](https://github.com/copywriting-skill/copywriting) — 定义受众和卖点以避免通用 AI 文案并提高转化率
- [claude-scientific-skills](https://github.com/claude-scientific/claude-scientific-skills) — 学术场景：论文写作、数据可视化和 LaTeX 公式处理
- [Awesome-claude-skills](https://github.com/anthropic/awesome-claude-skills) — 26,000+ stars 中心仓库，收集 10+ 类别精选技能

### Claude Code 官方 Skills 插件

- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — Claude Code Plugin Marketplace 官方插件
  - 安装：`/plugin marketplace add addyosmani/agent-skills`
  - 使用：`/plugin install agent-skills@addy-agent-skills`
  - 功能：安装后即可使用 7 个斜杠命令，Skill 根据上下文自动激活

### 核心洞察

> 该生态系统代表了从"一次性输出"到"可复用工作流"的转变。通过"安装"专家的专业知识，用户降低了入门门槛，超越了复杂的提示工程。AI 不再只是你指挥的工具——它是一个能计划和执行的协作伙伴。

---

## 设计工具 Skills

- [Taste Skill](https://github.com/Leonxlnx/taste-skill) — 22.7K Stars，给 AI 编程好品味的技能包，专门解决 AI 生成 UI 的"塑料味"问题，让 AI 输出更像"人写的"。单句≤25字、禁用词表、TDD 式质量铁律，22,704 stars
- [Vercel 设计规范 Review](https://vercel.com/design) — 用 Claude 读取 Vercel 设计规范文档，对比你的产品设计挑毛病。Prompt 模板：「请访问 vercel.com/design.md 和 vercel.com/design.dark.md，读取 Vercel 的设计规范。然后看看我的产品，对比这套规范，告诉我我现在设计上最明显的问题是什么，以及怎么改。」
- [bggg-skills](https://github.com/bggg-ai/bggg-skills) — 饼干（@bggg_ai）的 Codex Skills 仓库
  - [bggg-creator-image2psd](https://github.com/bggg-ai/bggg-skills/tree/main/bggg-creator-image2psd) — 设计精修 Skill，将图片转换为 PSD 格式搞定设计师
  - [bggg-creator-image2ppt](https://github.com/bggg-ai/bggg-skills/tree/main/bggg-creator-image2ppt) — 演示落地 Skill，将图片转换为 PPT 搞定做分享的人
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — superpowers 中文增强版（116k+⭐上游），17 款工具 + 20 skills + 6 个中国原创 skill，npm 一键安装，2.7k stars

---

## 开源工具

- [k12-teacher-skills](https://github.com/anthropics/k12-teacher-skills) — Anthropic 开源的教师备课神器，把教育研究验证过的最佳实践封装成 AI 可执行的「技能脚本」。三大功能：教案生成（自动识别科目加载教学法框架，对标州课程标准编号，一次产出教师计划/学生材料/观察模板三份 Word）、教案分层改编（低于/达标/高于年级水平三层，用于大班差异化教学）、开源质量评分标准（evals/ 四维度 CSV 评分表，支持 LLM-as-Judge）
- [Glarity](https://chromewebstore.google.com/detail/cmnlolelipjlhfkhpohphpedmkfbobjc) — Chrome 扩展，AI 助手，支持自定义 OpenAI API Key，免费使用全部功能
- [Easy Scraper](https://chromewebstore.google.com/detail/cljbfnedccphacfneigoegkiieckjndh) — Chrome 扩展，网页数据采集工具，无需编码，支持智能选择/批量采集/CSV或Excel导出/自动翻页
- [SiteSucker](https://ricks-apps.com/osx/sitesucker/) — Mac 网站下载工具，完整下载 HTML/图片/视频/音频等所有资源，保持目录结构，支持断点续传/离线浏览
- [小飞兔](https://www.xiaofeitu.com/) — 批量整站下载工具，收费订阅支持批量扒站，免费版可用但代码识别需手工修正
- [Lighthouse](https://chromewebstore.google.com/detail/blipmdconlkpinefehnmjammfjpmpbjk) — Google 开发的网站性能检测工具，分析性能/可访问性/最佳实践/SEO/PWA，提供详细优化建议
- [Agent-Reach](https://github.com/Panniantong/Agent-Reach) — Agent 触达能力扩展
- [技能商店 Skill Store](https://github.com/anbeime/skill) — AI 技能的 App Store，每 24 小时自动同步 awesome-agent-skills，收录最全更新最快的 AI Agent 技能库
- [AgentKey](https://agentkey.app/@cirila) — 一句话命令安装到 Codex/龙虾/Claude Code，自动化采集小红书、抖音、快手、B站、微博、知乎、Youtube 等平台公开内容、评论、点赞、转发，降低调研搬运门槛
- [jianying-editor-skill](https://github.com/luoluoluo22/jianying-editor-skill) — 剪映/Capcut/即梦 AI 内容创作相关 Skill
- [AI-Coding-Guide-Zh](https://github.com/KimYx0207/AI-Coding-Guide-Zh) — 中文 AI Coding 指南
- [xiaohu-ip-studio](https://github.com/xiaohailabs/xiaohu-ip-studio) — IP Studio
- [claude-gh-skills](https://github.com/wscffaa/claude-gh-skills) — Claude GitHub Skills
- [ponytail](https://github.com/DietrichGebert/ponytail) — **60k+ Stars**，让 AI 学会极致偷懒的规则集，代码量平均减少54%，Token成本降20%，安全零妥协
- [gaokaomath](https://github.com/deekur/gaokaomath) — 高考数学相关资源
- [gaokaophysics](https://github.com/deekur/gaokaophysics) — 高考物理相关资源
- [open-source-cs](https://github.com/ForrestKnight/open-source-cs) — 开源计算机科学学习资源
- [codex-whiteboard-video-skill](https://github.com/gnipbao/codex-whiteboard-video-skill) — 白板视频 Skill
- [whiteboard-video-engine](https://github.com/gnipbao/whiteboard-video-engine) — 白板视频引擎
- [CoreCoder](https://github.com/he-yufeng/CoreCoder) — 核心编码器
- [ChatGPT Image Studio](https://github.com/peiyizhi0724/ChatGpt-Image-Studio) — GPT Image 2 批量出图工具，账号池 + 工作流模板 + 批量队列，Go 后端 + Vite/React
- [SearchSharp](https://search-sharp.com/) — 搜全它的所有叫法
- [X Interaction Toolkit](https://github.com/b8l8u8e8/x-interaction-toolkit) — X 账号互动分析工具，输入 @username 自动抓取评论/点赞/转发/引用者并排名，Userscript 版本，直接用 X 登录态
- [huasheng13-skill](https://github.com/WangJunqing-coder/huasheng13-skill) — 公考花生十三 Skill，覆盖行测六大模块二十余题型上百条速算公式，配真题示例
- [journal-partner](https://github.com/zhaohongxuan/journal-partner) — Obsidian 日记插件，语音实时转写 + 日记搜索 + 随机回顾 + URL Scheme 一键录音，支持 SiliconFlow/Groq/OpenAI/阿里百炼
- [TREK](https://github.com/mauriceboe/TREK) — 旅行规划工具，NestJS + React + WebSocket 实时协作 + Leaflet/Mapbox 互动地图 + 行程拖拽 + 费用分摊 + 打包清单 + PDF 导出
- [ebook-treasure-chest](https://github.com/jbiaojerry/ebook-treasure-chest) — 电子书下载宝库，聚合帆书/微信读书/京东读书/喜马拉雅等平台，支持 epub/mobi/azw3，13.9k stars
- [GordenPPTSkill](https://github.com/GordenSun/GordenPPTSkill) — PPT 生成 Skill
- [frontend-slides](https://github.com/zarazhangrui/frontend-slides) — 前端幻灯片
- [beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates) — 精美 HTML 模板
- [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) — 网页 PPT 生成 Skill
- [html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) — HTML PPT Skill
- [ppt-master](https://github.com/hugohe3/ppt-master) — PPT 大师
- [baoyu-design](https://github.com/JimLiu/baoyu-design) — 设计相关 Skill
- [gmail-account-creator](https://github.com/ShadowHackrs/gmail-account-creator) — Gmail 账号批量创建自动化
- [小耳私人工具库](https://xiaoer-tools-wall.vercel.app/) — 审美、AI艺术、网页相关的酷炫工具合集，不是爬虫采集而是作者手动一个一个拷贝记录在 Notion 中的个人累积
- [follow-builders](https://github.com/zarazhangrui/follow-builders) — AI 驱动的信息聚合工具，追踪 AI 领域顶尖建造者（研究员、创始人、产品经理、工程师）的最新动态，每日/每周推送到 Telegram、Discord、邮件等，支持 Claude Code 和 OpenClaw
- [vibe-to-ui](https://github.com/MonkeyUI-dev/vibe-to-ui) — Agent Skills 将截图、图片、音乐转化为设计系统、动效语言和 UI 布局，支持 Claude Code、Cursor、Github Copilot
- [browser-harness](https://github.com/browser-use/browser-harness) — 浏览器自动化工具，适合 Hermes / OpenClaw 等 Agent 操纵浏览器执行复杂任务，相比 CDP/MCP 方案更轻量易用
- [Lightpanda](https://github.com/lightpanda-io/browser) — Zig 从零写的无头浏览器，100 页面内存 123MB，内置 MCP Server，支持 Puppeteer/Playwright
- [Midscene.js](https://github.com/web-infra-dev/midscene) — 视觉智能体 SDK，让 AI 看懂屏幕像人类一样操作，跨平台（Web/PC/Android/iOS/鸿蒙），模型无关，13k+ stars
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — **5.4万+ Stars**，把 Stripe/Linear/Figma/Vercel 等顶级品牌的设计系统整理成 DESIGN.md 文件，AI 编程工具可直接读取，包含配色/字体/组件/布局/响应式规则/设计语气，覆盖 AI 工具、开发工具、设计工具、金融/Crypto、消费品牌。把设计系统变成 AI 可直接读取的工程文件。
- [Paperclip](https://github.com/paperclipai/paperclip) — 协调多种 Agent（OpenClaw、Codex、Claude、Cursor）共同完成目标
- [Open CoDesign](https://github.com/OpenCoworkAI/open-codesign) — 开源 Claude Design 替代品，5.8k stars，支持 Claude/GPT/Gemini/Ollama 等多模型，一键导入 Claude Code / Codex 配置，本地优先，MIT 协议
- [OpenCodex](https://github.com/bitkyc08/opencodex) — Codex 本地代理层，统一管理多模型切换（ChatGPT Plus / GPT 中转站 / MiniMax / DeepSeek），Codex 无需重启、session 不丢失，npm 全局安装即可
- [better-harness](https://github.com/QoderAI/better-harness) — QoderAI 开源的 Harness 工程工具
- [CloudCLI](https://github.com/siteboon/claudecodeui) — 为 Claude Code CLI 打造图形界面，支持手机远程查看进度、操作交互
- [bozhou-skills](https://github.com/bozhouDev/bozhou-skills) — AI 工具集，包含图像生成、播客转文章、PPT 生成、微信发布、社交封面图等 11 个子项目，主要使用 TypeScript
- [Better-Fullstack](https://github.com/Marve10s/Better-Fullstack) — 项目生成器，270+ 技术栈组合（TS/Rust/Python/Go），前端/后端/数据库/Auth/支付/AI/DevOps 一键配置，开箱即用
- [obsidian-wechat-converter](https://github.com/DavidLam-oss/obsidian-wechat-converter) — 将 Obsidian 笔记转换为微信公众号格式，支持标题、图片、代码块等格式转换
- [AIHOT 选题工具](https://aihot.virxact.com) — 卡兹克开源的 AI 热点选题工具，帮助快速发现和筛选内容选题方向
- [云图 (Cloudimgs)](https://github.com/qazzxxx/cloudimgs) — NAS 自建图床解决方案，支持 Docker 部署
- [GEOFlow](https://github.com/yaojingang/GEOFlow) — 生成式引擎优化智能内容工程系统 2.0，多站点分发、知识库 RAG、审核发布工作流，1.6k+ stars
- [llm-wiki-starter](https://github.com/eleven-net-cn/llm-wiki-starter) — 一键创建 LLM Wiki 知识库，基于 Andrej Karpathy 的 LLM Wiki 模式
- [ElysiaJS](https://elysiajs.com) — Bun 生态最快的 TypeScript 后端框架，基于 OpenAPI 3.x 规范，类型安全、极速性能，支持 Swagger 文档自动生成
- [edgetunnel](https://github.com/cmliu/edgetunnel) — **41.1k Stars**，基于 Cloudflare Workers/Pages 的 VLESS/Trojan/SS 多功能面板，支持订阅系统和多平台客户端适配
- [OpenWorker](https://github.com/andrewyng/openworker) — 吴恩达开源的桌面 AI 助手，自动处理文档/日程/邮件等杂事，支持 25+ 工具（GitHub/Slack/Jira/Notion/Gmail/Google日历），模型灵活（OpenAI/Claude/Gemini/DeepSeek/Ollama），隐私本地存储
- [ego-lite](https://github.com/citrolabs/ego-lite) — 为"人 + Agent 同屏协作"设计的浏览器，前台工作+后台 Agent 任务互不干扰，一键迁移 Chrome 数据，每个 Agent 独立 Space，多任务并行不串号，兼容 Claude Code/Codex/Cursor，复杂任务最高提速 2.5 倍
- [video-shotcraft](https://vincentwei1021.github.io/video-shotcraft/) — **106 个镜头配方、162 种风格、161 个动态预览**，分镜/运镜/节奏/音效/Remotion 实现整理成 Agent Skill，视频创作技能库
- [hyperframes-motion-director](https://github.com/geekjourneyx/hyperframes-motion-director) — 宣传片 Agent Skill，视频创作工作流
- [Y2A-Auto](https://github.com/fqscfqj/Y2A-Auto) — YouTube视频搬运流水线，自动监控更新/下载/字幕生成/翻译/质检/AI改标题，双平台上传（B站+AcFun），支持企业微信推送
- [Bento](https://github.com/nyblnet/bento) — 开源HTML PPT工具，单HTML文件实现编辑+全屏播放+多人协作，JSON明文格式适合AI修改迭代，动效炫酷
- [UP](https://github.com/byoungd/up) — 英语学习全面指南，56W star，涵盖认知/单词/听力/阅读/口语/写作六大板块，含AI辅助学英语（GPT语音模型听说读写训练）
- [nop-app-erp](https://github.com/entropy-cloud/nop-app-erp) — AI全自主开发中型ERP产品（吸引子引导工程实践），GLM coding plan 7*24小时运行1个月，可看AI演化全过程及人工介入时机
- [attractor-guided-engineering-template](https://github.com/entropy-cloud/attractor-guided-engineering-template) — Mission Driver Loop Engineering参考实现，AI全自主执行，释放AI生产力

---

## Prompt Gallery

- [Awesome Prompt Gallery](https://opennana.com/awesome-prompt-gallery) — 开源 Prompt 画廊，收录各类优质 AI 提示词示例
- [WaytoAGI Prompts](https://www.waytoagi.com/zh/prompts?tag=2) — WaytoAGI Prompt 精选集合
- [X/Twitter 爆款文章追踪](https://youmind.com/zh-CN/landing/x-viral-articles) — YouMind 爆款榜单，AI 拆解 + 封面设计分析，每日更新

---

## AI Agent 入门

- [hello-generic-agent](https://github.com/datawhalechina/hello-generic-agent) — Datawhale 出品的 Generic Agent 教程，18 章，覆盖安装/浏览器能力/四层记忆/自我进化/案例，404 stars
- [ai-agent-book](https://github.com/bojieli/ai-agent-book) — AI Agent 实战教程，[在线阅读](https://bojieli.github.io/ai-agent-book/)，覆盖 Agent 核心概念、工具调用、工作流编排、部署运维
- [hello-agents](https://github.com/datawhalechina/hello-agents) — Datawhale 出品的零基础 Agent 入门教程
  - [在线阅读](https://hello-agents.datawhale.cc/#/) — Web 版本
- [build-coding-agent-context-engineering](https://github.com/phodal/build-coding-agent-context-engineering) — 从 Prompt 到上下文工程构建 AI Agent，零基础指南
- [Deep Research with LangGraph](https://academy.langchain.com/courses/deep-research-with-langgraph) — LangChain Academy 免费课程，循序渐进从单 Agent 到多 Agent 系统，外部依赖极少
- [agents.md](https://agents.md/) — AI Agent 知识导航
- [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners)
- [Microsoft MCP for Beginners](https://github.com/microsoft/mcp-for-beginners)
- [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [Zero to Claude Code](https://zero2claude.dev) — Wix VP 出品的免费课程，14 级 · 147 课 · 10 种交互形态，从零基础到生产环境发布软件，含 Skills/MCP/Subagents/Hooks 全套
- [AI Engineering Hub](https://github.com/patchy631/ai-engineering-hub)
- [Senior Developer Roadmap — AI Edition](https://github.com/glennsantos/senior-developer-roadmap)
- [ai-dev-tasks](https://github.com/snarktank/ai-dev-tasks) — AI 开发任务实战集
- [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) — 435 lessons, 20 phases, ~320 hours，Python/TypeScript/Rust/Julia 四语言，从数学基础到 Agent 自主系统，每课产出可复用 artifact
- [Skill-Factory](https://github.com/FeiCoder/Skill-Factory) — Book2Skills：把人类专业书籍自动转化为 LLM Agent 可执行的标准化 Skill 包，基于 Mini-Agent 开发
- [gnhf](https://github.com/kunchenguid/gnhf) — "Good Night, Have Fun"，让 AI 替你熬夜改代码，全自动循环 + Git 提交 + 回滚重试 + Worktree 多实例

---

## Vibe Coding 工作流

- [vibe-coding-cn](https://github.com/2025Emma/vibe-coding-cn) — **21.7k Stars**，Vibe Coding 指南：通过与 AI 结对编程，将想法变为现实的终极工作站。核心理念：规划驱动 + 上下文固定 + AI 结对执行
  - **元方法论**：α-提示词（生成器）+ Ω-提示词（优化器）的递归自优化系统
  - **道法术器**：目的主导、上下文第一性、先结构后代码、奥卡姆剃刀、帕累托法则
  - **编码模型分级**：第一梯队（codex-5.1-max-xhigh、claude-opus-4.5-xhigh、gpt-5.2-xhigh）
  - **资源库**：提示词大全（在线表格）、Skills 技能大全、系统提示词仓库、通用项目架构模板
  - **工具推荐**：VSCode、Cursor、Warp、Neovim、Claude Opus 4.5、GPT-5.1 Codex、Gemini CLI 等
  - 安装：克隆仓库即可使用，内含 Makefile 自动化脚本
  - **Zread 深度解读**：[zread.ai/tukuaiai/vibe-coding-cn](https://zread.ai/tukuaiai/vibe-coding-cn/1-overview) — AI 驱动的 GitHub 仓库阅读工具，提供完整知识图谱和概念索引

---

## 设计模式与架构

- [All Agentic Architectures](https://github.com/FareedKhan-dev/all-agentic-architectures) — 主流 Agent 架构体系全景图，涵盖 ReAct、Plan-and-Execute、LLM Supervisor、Hierarchy 等多种范式，配有图解
- [Agentic Design Patterns 中文版](https://adp.xindoo.xyz) — 谷歌资深工程主管分享的 AI Agent 系统性设计原则与最佳实践，含提示链/路由/并行化(基础)、反思/工具使用/规划(进阶)、多智能体协作/记忆管理(高级)、安全防护/评估监控(实践) |
  - [在线阅读](https://forceinjection.github.io/08_agentic_system/agent_design/all-agentic-architectures-deep-dive.html)
  - [中文翻译版](https://github.com/ForceInjection/all-agentic-architectures)
- [Agentic Design Patterns 中文版](https://github.com/ginobefun/agentic-design-patterns-cn) — 谷歌资深工程主管分享的 AI Agent 系统性设计原则与最佳实践
- [Agentic Design Patterns 中文版（另一译本）](https://github.com/fzy2012/rhzl-Agentic-Design-Patterns-cn)
- [上下文工程：AI Agent 有效上下文设计](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic 官方工程博客
  - [为 Agent 编写工具](https://www.anthropic.com/engineering/writing-tools-for-agents) — Anthropic 官方工程博客
  - [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) — 官方风格 Harness Engineering 教程，12 lectures + 6 projects + 多语言翻译，4.1k stars
  - [OpenHarness](https://github.com/HKUDS/OpenHarness) — Python Harness 实现 + ohmo 个人 Agent，内置 43 tools、MCP、权限系统，12.4k stars
- [12-factor-agents](https://github.com/humanlayer/12-factor-agents) — **23.8k Stars**，HumanLayer 出品的「**生产级 LLM Agent 12 原则**」，致敬 12 Factor Apps。核心理念——**好的 Agent 大部分时间就是普通软件，LLM 只在最关键节点做决策**，不是「prompt + 工具袋 + 循环跑」那么简单。12 因素：①自然语言→工具调用 ②自己管 prompt ③自己管 context window ④工具=结构化输出 ⑤统一执行态和业务态 ⑥启停/恢复用简单 API ⑦用工具调用联系人类 ⑧自己管控制流 ⑨错误压回 context ⑩小而聚焦的 Agent ⑪任意地方触发 ⑫Agent=无状态 reducer。配套 `npx create-12-factor-agent` 脚手架

## 架构实战案例

- [ai-architecture](https://github.com/myinvestpilot/ai-architecture) — 业余时间用 AI vibe coding 数年，28 个仓库、53.8 万行代码、3000+ 用户。系列文章：AI 原生系统设计（DSL）、多 Agent 架构、Agent 驱动开发流程、一人公司云原生架构。适合想了解真实规模 Vibe Coding 实践的开发者
- [TradingAgents](https://github.com/TauricResearch/TradingAgents) — Multi-Agents LLM 金融交易框架，78.6k stars，分析师/研究员/交易员/风控多 Agent 协作（仅供研究，不构成投资建议）
- [Anthropic Skilljar 课程](https://anthropic.skilljar.com/) — Anthropic 官方学习平台

---

## Cursor 教程

- [Cursor 官方教程](https://cursor.com/learn) — 视频讲解者 Lee Robinson（Cursor，前 Vercel/Next.js 布道师），覆盖 AI 模型、Token、Context、Tool calling、MCP、Agent 等内容

---

## 姚金刚系列（飞书）

- [姚金刚认知随笔](https://jiahejiaoyu.feishu.cn/docx/YHOHd1TLyom6KDxQY8Ac8m4hngf) — 42.5 万字，每周更新
- [GEO 白皮书](https://yaojingang.feishu.cn/docx/Jv85dXAeZoKJ7exJi4Yc4Edrnhf) — AI 搜索营销科普文档，不定时更新
- [姚金刚提示词合集](https://yaojingang.feishu.cn/docx/ER4rdSlvcofCtQxttSac2Xc4nGd) — 不定时更新
- [GEO 提示词合集](https://yaojingang.feishu.cn/wiki/YbMLwkChmiktbskRoHZcFixBnxb) — 与向阳合著 GEO 书籍配套提示词

---

## 白皮书与飞书文档

- [Google Agents Companion 白皮书](https://drive.google.com/file/d/1GVPdwEh48bErTNdhxD0vqxPAifSx1I6Y/view) — Google 官方出品
- [结构化提示词知识库（飞书）](https://langgptai.feishu.cn/wiki/RXdbwRyASiShtDky381ciwFEnpe) — Feishu LLMGPT 整理
- [LangGraph 课程大纲（飞书）](https://docs.google.com/document/u/0/d/1rsaK53T3Lg5KoGwvf8ukOUvbELRtH-V0LnOIFDxBryE/mobilebasic)
- [AI Agent 入门（飞书）](https://kq4b3vgg5b.feishu.cn/wiki/GyXZwF4sbiSbQfkvdFHc5cP9nCh)
- [AI 相关常见名词解释（飞书）](https://my.feishu.cn/wiki/OSHAwzyw9iHS3rkZ1JZcJwnCnjh) — P0 必会 / P1 应知 / P2 进阶三级分类，收录 AI/LLM/NLP/Prompt/Token 等核心概念

---

## lovstudio 技能集

> 安装命令：`npx skills add lovstudio/skills`，22 个技能，涵盖图片生成、PPT/PDF 生成、防微信 AI 检测、内容运营等。仓库：[github.com/lovstudio/skills](https://github.com/lovstudio/skills)，欢迎 star。

### Office Automation（办公自动化）

| 技能 | 说明 |
|------|------|
| [any2pdf](https://github.com/lovstudio/skills/tree/main/any2pdf) | Markdown 转专业排版 PDF，支持 CJK/LaTeX/水印/多主题 |
| [any2docx](https://github.com/lovstudio/skills/tree/main/any2docx) | Markdown 转 Word（.docx），支持代码块/表格/封面 |
| [any2deck](https://github.com/lovstudio/skills/tree/main/any2deck) | 内容转幻灯片，支持 16 种视觉风格 |
| [pdf2png](https://github.com/lovstudio/skills/tree/main/pdf2png) | PDF 转单张拼接长图（macOS/CoreGraphics） |
| [png2svg](https://github.com/lovstudio/skills/tree/main/png2svg) | PNG 矢量化，支持白底去除/svgo 压缩 |
| [fill-form](https://github.com/lovstudio/skills/tree/main/fill-form) | Word 表单模板自动填写 |
| [fill-web-form](https://github.com/lovstudio/skills/tree/main/fill-web-form) | 网页表单自动填写（从本地知识库匹配） |

### Content Creation（内容创作）

| 技能 | 说明 |
|------|------|
| [image-creator](https://github.com/lovstudio/skills/tree/main/image-creator) | AI 图片生成（Gemini/ZenMux/代码渲染三模式） |
| [wxmp-cracker](https://github.com/lovstudio/skills/tree/main/wxmp-cracker) | 微信公众号文章抓取与导出，自动处理登录态 |
| [anti-wechat-ai-check](https://github.com/lovstudio/skills/tree/main/anti-wechat-ai-check) | 微信 AI 检测规避与人性化润色 |
| [document-illustrator](https://github.com/lovstudio/skills/tree/main/document-illustrator) | 为文档自动插入 AI 配图/插图 |
| [style-clone](https://github.com/lovstudio/skills/tree/main/style-clone) | 文风克隆，分析样本文章后按相同风格改写 |
| [write-professional-book](https://github.com/lovstudio/skills/tree/main/write-professional-book) | 多章节书籍写作，支持大纲/逐章/最终构建 |

### Business（商务）

| 技能 | 说明 |
|------|------|
| [proposal](https://github.com/lovstudio/skills/tree/main/proposal) | 商务方案生成，从需求文档输出完整报价方案 |
| [expense-report](https://github.com/lovstudio/skills/tree/main/expense-report) | 发票图片提取 + 报销 Excel 生成 |
| [contract-review-pro](https://github.com/lovstudio/skills/tree/main/contract-review-pro) | 合同四层评审，输出结构化意见 + 风险图 |
| [event-curator](https://github.com/lovstudio/skills/tree/main/event-curator) | 嘉宾活动策划，从嘉宾背景生成完整策划案 |

### Design（设计）

| 技能 | 说明 |
|------|------|
| [event-poster](https://github.com/lovstudio/skills/tree/main/event-poster) | 活动海报生成，输出印刷级 PNG |
| [find-logo](https://github.com/lovstudio/skills/tree/main/find-logo) | 品牌 Logo 发现与抓取，支持 Clearbit/og:image |
| [maintain-partners](https://github.com/lovstudio/skills/tree/main/maintain-partners) | 合作伙伴 Logo 标准化与维护（高度对齐/颜色统一） |

### Academic（学术）

| 技能 | 说明 |
|------|------|
| [thesis-polish](https://github.com/lovstudio/skills/tree/main/thesis-polish) | MBA/学位论文润色至全国优秀论文水平 |
| [translation-review](https://github.com/lovstudio/skills/tree/main/translation-review) | 中译英翻译审校，输出结构化评审报告 |

> ⚠️ Security Note：`event-poster`/`event-curator`/`wxmp-cracker` 标记为 High Risk（内容生成类），`proposal`/`contract-review-pro` 标记为 Med Risk。使用前建议 review 代码。

---

## 其他

- [Involution Hell](https://involutionhell.vercel.app/) — AI 学习资源导航

---

## 个人 AI 工作流参考

- [我的常用 AI 工具](https://mp.weixin.qq.com/s/BBUc4NVORsCTF8c3dIX3HQ) — Felix（AI观察志）：本地助理 Hermes+Mac mini / 飞书+lark-cli / Codex+Claude+GLM / Obsidian+Claudian / PPT工具链，完整个人 AI 工作流

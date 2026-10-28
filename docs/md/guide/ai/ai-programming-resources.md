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
- [awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) — 用 Claude Opus 5.5 制作的爆款视频合集，每条附原始视频与对应提示词，可在 Skillry 观看现场复刻版，持续更新。8.7k stars，MIT 许可

---

## 协作平台

- [Multica](https://github.com/multica-ai/multica) — 专为 AI-native 团队设计的 Agent + 人的协作平台，AI agent 是一等公民的任务管理工具，官网 [multica.ai](https://multica.ai)
- [VibeKanban](https://vibekanban.com/) — AI 研发工程从本地化到在线化/共享化
- [OpenAI Symphony](https://github.com/openai/symphony) — 将项目工作转化为隔离的自主执行运行，团队管理工作而非监督 AI coding agent。监控 Linear 工单板，自动派发任务给 Codex Agent，Agent 完成后提供 CI 状态、PR 审查反馈、复杂度分析等证明，23.5k stars
  - [官方博客：Symphony 开源规范发布](https://openai.com/index/open-source-codex-orchestration-symphony/) — 2026-04-27，OpenAI 工程师博文，内部部分团队 3 周内 PR 数量提升 500%
  - [InfoWorld 报道](https://www.infoworld.com/article/4164173/openais-symphony-spec-pushes-coding-agents-from-prompts-to-orchestration.html) — 分析 Symphony 将 AI 从个人编程助手向团队共享工程基础设施的转型，Forrester 分析师指出 Agent 控制平面和自适应流程编排的价值
  - [Help Net Security 报道](https://www.helpnetsecurity.com/2026/04/28/openai-symphony-codex-orchestration-linear/) — 详细介绍"人类注意力瓶颈"（每人只能监督 3-5 个 Codex 会话），以及团队 PM/Designer 从 Linear 手机 App 提交工单的实践
- [Buzz](https://github.com/block/buzz) — Block（原 Square）开源的人类与 AI 协作工作区，Nostr 中继架构，23.9k stars。人与 Agent 共享同一房间，支持频道/线程/画布/工作流/语音 huddle，Agent 是"成员"而非"机器人"，有独立密钥、成员关系和审计轨迹
  - [Goose](https://github.com/block/goose) — Block 的另一款开源 AI Agent CLI，管理单个 Agent 怎么干活
  - 观点：从 Goose 管单个 Agent 怎么干活，到 Buzz 管一群人和一群 Agent 怎么共事。团队要让 Agent 干活，迟早要搞清楚**它是谁、它能动什么、它干过什么**——Buzz 是第一个把这三个问题当成产品核心的开源项目

---

## 内容运营技能

- [内容运营人必装的4个skill（上）](https://mp.weixin.qq.com/s/kqcpZKJLJMh2EyJF3wJTbw) — Agent Reach（AI上网能力）、Marketing Skills（营销方法论提示词）、RedBox（小红书创作工具）、Scrapling（高级网页爬虫）、Maccy（剪贴板管理器）
- [story-studio](https://github.com/konlu/story-studio) — **373 Stars**，MIT，Python。**从「选题 → 文案 → 配音 → 配图 → 剪映草稿」的一站式 AI 短视频创作 Agent Skill**，专为 Claude Code / Codex / Cursor 这类支持 Skill 的智能体打造。四大模块：**① 文稿创作**——内置「历史叙事风」与「真实人物故事/女性传奇」两套蒸馏过的 Writing-DNA + **370+ 篇高赞对标逐字稿库**（历史叙事 57 篇含 9 类黄金开头钩子机制；人物故事 300+ 篇含 A/B/C/D/E 五类钩子模板），配选题库、史实与素材核验、字数与查重工具；**② 配音**——推荐接豆包语音大模型 V3 双向流式，也可丢进自备 MP3 让 Agent 接力；**③ 时间轴对齐**——用本地 Coli（基于 sherpa-onnx）离线识别生成精准到字句的 SRT，**绝不按字数瞎猜时间**；**④ 分镜与剪映草稿**——三套画风（历史写实 / 厚涂历史漫画 / 黑白纪实）+ 成品参考图库防跨镜头画风漂移，基于 `pyJianYingDraft` 直接生成**可二次编辑的剪映专业版工程**，自动铺 9:16 竖屏图片与配音并写入覆盖全镜的慢推拉关键帧和切点冲击缩放（Punch Zoom）。零门槛环境初始化（首次调用一键配置便携环境），支持随时中断接力：只写稿、只改钩子、只拆镜生图、或用现成素材直接出剪映草稿
  - 赛道定位：历史叙事 / 人物故事（民国名媛、巾帼英雄、时代先驱、传奇母亲等）
- [image-story-video-wizard](https://github.com/aaronyi97/image-story-video-wizard) — 图文故事与讲书类播客视频 AI 制作向导 Agent Skill（大雷出品）。按步骤主动引导：选题与对标分析 → 生成写作包交给大模型写稿 → 豆包 Seed-TTS 2.0 试听选音色并取字级时间戳 → 按配音拆分镜生图 → 导出视频与剪映草稿，全流程人工介入控制在 1 小时内
- [kids-blessing-video-wizard](https://github.com/aaronyi97/kids-blessing-video-wizard) — 儿童专属动画祝福视频制作向导 Agent Skill（大雷出品，MIT）。用一张孩子照片，分步引导制作 30 秒专属动画祝福视频：照片分析与风格选择 → 故事与分镜确认 → 生成场景参考图与图生视频提示词 → 配音与配乐清单 → 拼接导出成片，非一键盲跑而是按步骤记忆选择的交互向导
- [wedding-video-guided-wizard](https://github.com/aaronyi97/wedding-video-guided-wizard) — AI 婚礼故事视频定制引导向导 Skill（大雷出品）。14 步完整跑通：故事采集卡一次性收集新人经历 → Kimi K3 撰写文案包 → 豆包 TTS 试听选音色 → GPT Image 2 图生图 → Omni 图生视频 → Suno V5.5 试听配 BGM → 最终组装与字幕对齐
- [writing-dna-skill](https://github.com/larashero3-dotcom/writing-dna-skill) — 写作风格蒸馏器 Agent Skill（前文字记者 Lieflat 出品，小红书 REDSkill 榜单前三）。基于语言学量化统计，把目标对标文章的词汇密度、句法节奏、论证骨架拆解为可复制的规则层，让 AI 逐层对照写作，彻底复刻任意写作风格并去除 AI 味
- [SeeCut](https://github.com/YeJe-cpu/SeeCut) — 开源自媒体网感精剪管线（Leaf Yeah! 出品，PolyForm 非商业）。四大设计：Gemini 原生看懂视频挑刺、左右盲测对比循环（最多 3 版收敛）、截真图替代假代码界面、露脸与否根据「对你说」还是「给你看」决策，自动出剪映分层草稿工程
- [open-topic-radar](https://github.com/aaronyi97/open-topic-radar) — 自媒体选题雷达开源项目（大雷出品）。先去海外信息源（X/Product Hunt/GitHub/Reddit）扫描升温事件，再回中文市场（小红书/B站/抖音）检验覆盖程度，识别「国外已热、国内未做烂」的生态位选题

### 热点监控

- [SoPilot](https://sopilot.net/zh) — X 上正在起爆话题与推文监控
- [Today热榜](https://tophub.today) — 今日多平台热榜聚合
- [NewsNow](https://newsnow.busiyi.world) — 精美实时热榜
- [AIHOT](https://aihot.news) — 卡兹克全球 AI 热门动态
- **AIHOT Agent**（卡兹克）— 定时汇报 AI 当天重点新闻，并可据热点生成 X/小红书等内容草稿
- [X榜单](https://xbangdan.com/) — 中文区 X 博主数据门户，每小时更新当日发帖/评论/涨粉/曝光四个维度的榜单与纪录殿堂；另提供 [X榜单 MCP](https://xbangdan.com/mcp/)，接上 Claude Code / Codex / Cursor 后可用自然语言查爆款推文、查账号数据、看今日热点（付费订阅：999 元/年，每天 300 次查询，只读不碰账号）

---

## Claude Skills 精选（2026年）

> 来源：[@sylvainxai](https://x.com/i/status/2037772956483678532) 整理

### 发现与元技能

- [find-skills](https://github.com/find-skills) — 在 GitHub 上搜索和查找合适的 Skills，按类别、星级和更新时间筛选
- [skill-creator](https://github.com/skill-creator) — 自动生成标准化的 SKILL.md 文件和目录结构，将团队 SOP 转化为可安装的技能包
- [chubbyskills](https://github.com/chubbyguan/chubbyskills) — 待查看
- [slavingia/skills](https://github.com/slavingia/skills) — 基于《The Minimalist Entrepreneur》（《小而美》）的 Indie Developer Skills 系列，Gumroad 创始人出品，按场景和步骤拆解独立开发全流程，适合想做产品和个人品牌的开发者
- [KeJunMao/gist](https://gist.github.com/KeJunMao/d79876c1920806254827daca3364551c) — 待查看
- [apify/mcpc](https://github.com/apify/mcpc) — **Apify 开源**的 MCP 通用 CLI 客户端，将 Tools/Prompts/Resources/异步任务/通知日志转化为标准终端命令，AI Agent 仅需一个 Bash() 即可调度 MCP 能力。核心能力：渐进式工具发现（按需暴露缩减 Token）、持久会话管理、极佳脚本适配（--json + jq/xargs）、原生凭据与安全代理（OAuth 2.1 + OS Keychain）、MCP Proxy 防 Token 泄露、轻量跨平台。安装：`brew install apify/tap/mcpc` 或 `npm install -g @apify/mcpc`
- [zhaoxuya520/reverse-skill](https://github.com/zhaoxuya520/reverse-skill) — 绕过 Codex/Claude 反编译/逆向道德感限制的技巧：不在 prompt 里提逆向/反编译，直接让 Agent 按 README_AI.md 处理。需自己先安装好 skill 再让 Agent 执行，Claude Code / Codex 屡试不爽
- [yaojingang/yao-meta-skill](https://github.com/yaojingang/yao-meta-skill) — 姚老师出品的元技能（Skill 之 Skill），比官方 skill-creator 强太多。输入混乱的流程/提示/聊天记录，输出 90 分技能——扒了 Claude Code 源码 + 揉合全网各家模型技能，花一个月打磨。目前用过最顺手的元技能
- [yaojingang/yao-open-prompts](https://github.com/yaojingang/yao-open-prompts/tree/main/prompts%2F08-ai-marketing%2Fcourse-marketing) — 姚金刚的课程营销 Prompt 合集，含 course-marketing 等营销场景提示词
- [tester-army/e2e](https://github.com/tester-army/e2e) — **面向 LLM 的测试框架**，测试用例用自然语言驱动 + 传统断言混写。核心创新：`agent.act('upgrade the workspace to the Pro plan')` 自然语言指令首次让 Agent 探索并缓存操作，后续直接回放不再调模型（节省 token）。Web 引擎走 Playwright，移动引擎通过 agent-device 驱动 iOS/Android 模拟器，Web 和移动同一套 API
- [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack) — Cursor 的项目上下文恢复插件，四个核心 Skill：/how（讲代码怎么运作）、/why（讲为什么这样写）、/recall（开工前恢复上下文）、/teach（讲到你真懂）。配套 [skills 目录](https://github.com/cursor/plugins/tree/main/pstack%2Fskills)
- [pstack-claude](https://github.com/poteto/pstack-claude) — 将 pstack 从 Cursor 移植到 Claude Code、Codex、Pi、GitHub Copilot 等环境的开源项目。以 `poteto-mode` 为入口，模型根据任务目标调用对应流程（how/why/architect 等），把复杂代码改动拆解为可验证的工程步骤。如排查 bug：先在真实环境复现失败，调用 how/why 调查根因，architect 确定模块设计，委派子代理实现最小修复，最后重跑验证。移植通过 `substitutions.json` 把 Cursor 的 Task 改写为 Claude 的 Agent，`forks.json` 登记策略差异（如 autopilot-full 规定只做到 merge-ready）。完整运行需要各平台扩展与工具接口支持，纯拷贝技能文件拿不到调度能力
- [1stbills.com](https://1stbills.com) — 地址证明材料整理网站，银行账单、水电燃气账单、收入证明等类型都有，常注册海外平台的可以了解不同地区的材料要求
- [Anning01/AIMedia](https://github.com/Anning01/AIMedia) — AI 媒体相关开源项目
- [Dataojitori/nocturne_memory](https://github.com/Dataojitori/nocturne_memory) — 开源项目
- [BaoCut](https://baocut.com) — 宝玉老师的字幕转录翻译剪辑 Skill（仅 Mac）。Agent Skill 可以转录视频、识别 Speaker、润色（纠正错别字口癖）、根据转录结果剪辑（删除口癖重复等）。提供 CLI 配合 Skill，Agent 转录/润色/翻译后实时同步进度到 GUI，可在 GUI 预览和人工编辑。使用方式：`/baocut 转录并翻译视频：<视频 url 或路径>`。Skill 地址：[jimliu/baocut](https://github.com/jimliu/baocut)
- [Lordog/dive-into-llms](https://github.com/Lordog/dive-into-llms) — 上海交大《动手学大模型》，4.2k+ stars。11 个前沿课题：提示学习与思维链、知识编辑、数学推理、模型水印、越狱攻击、大模型隐写、多模态、GUI Agent、RLHF 安全对齐等。每章含 PPT 讲义 + 详细文档 + Jupyter Notebook，可直接跑。另有华为昇腾国产化课程线（PPT + 实验手册 + 配套视频）
- [browser-use/video-use](https://github.com/browser-use/video-use) — 视频理解与 Agent 操作开源项目，让 AI Agent 能够理解和操作视频内容
- [wousp112/awesome-justin-sun-ideas-to-ai-howto](https://github.com/wousp112/awesome-justin-sun-ideas-to-ai-howto) — 收集孙宇晨 ideas 到 AI howto 的开源项目
- [AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc) — MCP 工具，用于 Google Search Console (GSC) 数据集成
- [xerj-org/xerj](https://github.com/xerj-org/xerj) — 帮助 AI 下载相近开源仓库、整理成可搜索资料，写代码前先查相关实现。对照测试：XERJ 组比 grep 搜源码组生成的文本量少约 62%（按 token 计）
- [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) — Heygen 出品的 AI 视频/帧处理开源项目
- [超级符的 AI 产品经理课](https://chaojifeng.me/ai-terms) — 免费学习 AI 的网站，用故事一步步教会你怎么在 AI 时代做产品经理，知识付费进入免费时代
- [wong2/cf-mailroom](https://github.com/wong2/cf-mailroom) — 待查看
- [superpowers](https://github.com/superhuman/superpowers) — 将 AI 从"执行者"转变为"项目经理"，通过持续跟进协助头脑风暴和需求文档生成
- [mattpocock/skills](https://github.com/mattpocock/skills) — TypeScript 大神 Matt Pocock（前 Vercel 工程师）的 AI 编程工作流技能库，27 万星，18 个技能，MIT 协议
  - 安装：`npx skills@latest add mattpocock/skills`
  - 痛点拆解：沟通不对齐、术语不统一、缺反馈循环、代码熵增
  - 核心技能：`/grill-me`（深度需求拷问）、`/tdd`（红绿重构）、`/caveman`（精简 token 75%）、`/improve-codebase-architecture`（代码库定期保养）
  - 背景：《The Pragmatic Programmer》+ DDD + XP 工程经验提炼
  - **工程化工作流**（按顺序调用）：①`/setup-matt-pocock-skills`（先定术语和文档规范）→ ②`/grill-with-docs`（对齐想法，沉淀共识文档）→ ③`/to-spec`（落成设计文档）→ ④`/to-tickets`（拆成独立任务）→ ⑤`/implement`（新开会话，一次做一个任务）→ ⑥`/code-review`（检查是否按设计做完）
  - 特点：全靠文档驱动，不吃上下文，换 Agent 也不怕；需手动按需调用（不像 Superpowers 自动跑到底）

### 工程与设计标准

- [vercel-react-best-practices](https://github.com/vercel/react-best-practices) — 巩固团队开发标准，涵盖可读性、性能和边缘案例处理
- [vue-best-practices](https://github.com/vuejs/core) — 标准化组件边界、状态管理和复用策略
- [frontend-design](https://github.com/anthropic/frontend-design) — 使用 Tailwind/shadcn/ui 生成高质量 HTML/CSS/React 代码，聚焦间距和对齐避免"AI风味"
- [ui-ux-pro-max-skill](https://github.com/ui-ux-pro-max/ui-ux-pro-max-skill) — 跨平台设计（Web、iOS、Android）、响应式布局和设计系统管理
- [web-design-guidelines](https://github.com/web-design-guidelines) — 将网页设计规则系统化：层次结构、排版、无障碍
- [building-native-ui](https://github.com/building-native-ui) — React Native/Expo 原生 UI 步骤，避免平台差异和手势错误
- [remotion-best-practices](https://github.com/remotion-dev/remotion-best-practices) — 可编程视频项目标准，聚焦项目结构和渲染性能
- [openclaw/test-audit](https://github.com/openclaw/openclaw/blob/main/.agents%2Fskills%2Ftest-audit%2FSKILL.md) — OpenClaw 官方测试审计技能，三种模式（Authoring/Audit/Campaign）清理低价值测试。核心理念：①写新测试前必须回答 4 个问题（保护什么行为？什么回归会触发失败？现有覆盖为何漏掉？是否需要仅测试用的生产接口？），缺一不写；②识别 14 种"垃圾测试模式"（断言自由覆盖率探针、自比较、常量字符串判断、重复契约调用、测试专用导出维护等）；③Campaign 模式可一次性修剪整个子系统的测试面；④OpenClaw 自身实践：删掉约 40 万行测试代码，覆盖率几乎没掉——因为模型特别爱写"为了测试而测试"的无用单元测试，建议给 Agent 更狠的目标："删掉最没用的 20% 测试，覆盖率波动控制在 2% 以内"而非模糊的"清理一下"

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

- [stitch-skills](https://github.com/google-labs-code/stitch-skills) — **8.1K Stars**，Google Labs 出品的 Agent Skills 库，配套 Google Stitch MCP 服务器，遵循 Agent Skills 开放标准，兼容 Codex/Antigravity/Gemini CLI/Claude Code/Cursor/OpenCode。三大插件包：stitch-design（code-to-design/generate-design/manage-design-system/extract-design-md/extract-static-html/upload-to-stitch）、stitch-build（react-components/react-native/remotion/shadcn-ui/react-vite-dashboard）、stitch-utilities（design-md/enhance-prompt/stitch-loop/taste-design）
- [diagram-design](https://github.com/cathrynlavery/diagram-design) — **19K Stars**，29 种编辑级图表类型（架构图/流程图/时序图/状态机/ER/时间线/泳道/四象限/树/组织图/Venn/金字塔/雷达/循环/甘特图等），单文件自包含 HTML+SVG，无阴影无 Mermaid-slop。支持 Claude Code/Codex/Pi 三大 Agent 平台，60 秒通过 onboarding 匹配品牌色/字体。支持 draw.io/Mermaid 导入重绘，可选可访问动效，PNG/SVG 导出。设计理念：1 个强调色、1-2 个焦点元素、所有尺寸按 4px 网格、密度目标 4/10
- [Taste Skill](https://github.com/Leonxlnx/taste-skill) — 22.7K Stars，给 AI 编程好品味的技能包，专门解决 AI 生成 UI 的"塑料味"问题，让 AI 输出更像"人写的"。单句≤25字、禁用词表、TDD 式质量铁律，22,704 stars
- [Vercel 设计规范 Review](https://vercel.com/design) — 用 Claude 读取 Vercel 设计规范文档，对比你的产品设计挑毛病。Prompt 模板：「请访问 vercel.com/design.md 和 vercel.com/design.dark.md，读取 Vercel 的设计规范。然后看看我的产品，对比这套规范，告诉我我现在设计上最明显的问题是什么，以及怎么改。」
- [bggg-skills](https://github.com/bggg-ai/bggg-skills) — 饼干（@bggg_ai）的 Codex Skills 仓库
  - [bggg-creator-image2psd](https://github.com/bggg-ai/bggg-skills/tree/main/bggg-creator-image2psd) — 设计精修 Skill，将图片转换为 PSD 格式搞定设计师
  - [bggg-creator-image2ppt](https://github.com/bggg-ai/bggg-skills/tree/main/bggg-creator-image2ppt) — 演示落地 Skill，将图片转换为 PPT 搞定做分享的人
- [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) — superpowers 中文增强版（116k+⭐上游），17 款工具 + 20 skills + 6 个中国原创 skill，npm 一键安装，2.7k stars
- [baoyu-design](https://github.com/JimLiu/baoyu-design) — 在本地以 Agent Skill 方式运行 Claude Design（支持 Cursor、Claude Code 等）。工作流：先用 Claude Design 设计 UI 原型，配合本 Skill 维护，每次开发新功能先改原型、确认后再改功能，保证原型与功能一致。产出 React 代码 + 结构化 JSON，通过 git diff 清晰追踪版本变更，Agent 参考 diff 实现功能。可低成本验证产品/UI 设计，详见 [工作流归档](/md/wiki/sources/baoyu-design-workflow)
- [archify](https://github.com/tt-a1i/archify) — **36.4K Stars**，JetBrains 之外的明星项目，Agent 技能：将代码库或系统描述转化为精美的交互式架构/工作流/序列图/数据流/生命周期图——自包含 HTML，含动效和高清导出。支持 Claude Code/Codex/Py/Twitter/OpenCode 等平台。五大图表类型、四种预设、暗/亮主题、内置品牌标识。支持 Before/Delta/After 三栏对比，搜索节点、溯源代码、生成 1200×630 分享卡。安装：`npx skills add tt-a1i/archify -g`
- [effective-html](https://github.com/plannotator/effective-html) — **2.8K Stars**，Plannotator 出品的 HTML 原型/Skill 集合：专注生成实用的自包含 HTML artifacts——从低保真线框图到可交互原型。六大 Skill：html（综合）、design-artifact（创意方向）、html-wireframe（低保真布局）、html-prototype（可交互原型）、html-plan（路线图/计划）、html-diagram（架构图/序列图/流程图）。安装：`npx skills add plannotator/effective-html`，官方指南 [effectivehtml.com](https://www.effectivehtml.com/)
- [lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) — 数据可视化 Skill：先判断数据适合哪种图表，再从已有图库中挑选，而非上来就套柱状图/折线图/饼图；支持年度阅读报告等 HTML 页面生成；官方模板可替换品牌色/背景/字体，套 PPT 风格。注意：部分图表需联网加载依赖；许可为 PolyForm Noncommercial 1.0.0，商业使用需确认。安装：`npx skills add larashero3-dotcom/lieflat-charts --skill lieflat-charts`
- [handraw-style](https://github.com/yang0/handraw-style) — **2.7K Stars**，MIT 许可。手绘风格编号画廊与双语提示词 Skill：把 274 种手绘插画风格、117 种排版图型（19 种社媒卡 / 30 种数据信息图 / 68 种漫画分镜）全部编号化，选个编号就输出经过实测的中英双语生图提示词，直接复制到 Midjourney / DALL-E 3 / Stable Diffusion / Flux 出图。治两个痛点：画风描述模糊导致每次生成都漂移、版式构图单调排不出社媒长图。双模式随时切换——纯图模式让主题决定画面，图文模式让文字参与构图（适合金句海报）。生图时按「作者名+风格名 → 正向核心风格特征 → 传编号单图」三级降级判断要不要附参考图，避免模型把参考图里的主体和构图一起锁死；`001` 这类能靠名称激活的风格不传图。安装：把仓库地址发给 Codex 自动装；风格图鉴 [STYLES.md](https://github.com/yang0/handraw-style/blob/main/STYLES.md)、排版图鉴 [LAYOUTS.md](https://github.com/yang0/handraw-style/blob/main/LAYOUTS.md)，本地可打开 `skills/handdraw-style-prompter/gallery/index.html` 离线检索放大
- [sweety-handdraw-video](https://github.com/VastFuture/sweety-handdraw-video) — 从主题或文章制作完整手绘讲解视频：Agent 规划内容、设计分镜、生成插画，本地工具逐笔描线填色、声画对齐与 MP4 导出。内置 AI 导演自动匹配分镜、6 款高精度画笔（马克笔/彩铅/毛笔/钢笔等）、VoxCPM 2 拟真配音。素材完全解耦，字幕/布局修改只需重渲染不重走全部流程。当前 Codex 环境实测通过，开源免费维护
- [白嫖警告：这个图表 Skill 太猛了，正在悄悄拉高所有人的审美标准](./chart-skill-recommend.md) — 推荐一款图表 Skill，支持架构图/流程图/时序图等多种类型，适合独立开发者做产品界面

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
- [career-assets-skill](https://github.com/Ivor-NCUT/career-assets-skill) — 职业资产 Agent Skill，通过读材料和深度访谈沉淀长期职业主档（`职业经历.md`），针对岗位派生可迭代简历，投递/面试反馈回流更新主档；核心差异：不是润色简历而是从真实经历和证据出发构建可复用的长期资产，包含"保真底稿"与"强化建议"双层机制确保真实性
- [jianying-editor-skill](https://github.com/luoluoluo22/jianying-editor-skill) — 剪映/Capcut/即梦 AI 内容创作相关 Skill
- [AI-Coding-Guide-Zh](https://github.com/KimYx0207/AI-Coding-Guide-Zh) — 中文 AI Coding 指南
- [xiaohu-ip-studio](https://github.com/xiaohailabs/xiaohu-ip-studio) — IP Studio
- [doodle-little-world](https://github.com/foxbitcoo/doodle-little-world) — 待查看
- [visual-model](https://github.com/sharptoolbox/visual-model) — 待查看
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
- [agentgateway](https://github.com/agentgateway/agentgateway) — **5.6k Stars**，Linux Foundation 孵化，Rust 实现的 **AI Agent 时代的 Nginx**，把三种网关合到一起：**LLM Gateway**（统一接入 OpenAI/Claude/Gemini，智能路由、负载均衡、限流、成本管理）、**MCP Gateway**（多 MCP Server 聚合为统一入口，集中管工具权限/身份认证/调用日志）、**A2A Gateway**（Agent-to-Agent 协议，让不同 Agent 安全地发现、调用、协作）。另支持 OAuth、JWT、OpenTelemetry 与 K8s 集成。个人开发者可能大材小用，但做多 Agent 系统 / AI SaaS / 企业级智能体平台时价值明显；Apache-2.0 许可证，官网 [agentgateway.dev](https://agentgateway.dev)
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
- [DBX](https://github.com/t8y2/dbx) — Rust 写的轻量级跨平台数据库管理工具，25MB 支持 100+ 数据库（MySQL/PostgreSQL/SQLite/Redis/MongoDB/DuckDB/达梦等），内置 AI SQL 助手（自然语言生成 SQL，支持 Claude/OpenAI/Ollama，内置安全检查）和 MCP Server（Claude Code/Cursor/Windsurf 等 Agent 可直接查询数据库），桌面端 + Docker + CLI + Web，Apache-2.0 协议，20.8k stars
- [html-explainer](https://github.com/OneMoh/html-explainer) — Agent Skill，把任意主题做成带配音、硬字幕、封面的讲解视频。全本地流水线：调研 → 解说词 → TTS 配音 → 词级字幕 → HTML/CSS/GSAP 画面 → 确定性逐帧 seek 渲染（非录屏，帧级可复现）→ MP4 合成 → QC 体检 → 多画幅封面（16:9/3:4/9:16），Claude Code/OpenAI Codex/WorkBuddy/Cursor/Gemini CLI 等都能加载，支持 edge-tts（免费）和火山引擎（付费）两个 TTS 引擎，23 种画面风格，MIT 协议，64 stars
- [Luvus](https://github.com/RizRiyz/luvus) — 纯 Rust 写的终端多路复用器 + Agent 状态机控制中心，890 stars。原生 Agent 感知（自动识别 Claude Code/Codex/Kimi/Cursor 等 17+ Agent，侧边栏直接看 Working/Blocked/Done 状态、Token 花费、上下文占用）；Git Worktree 隔离编排（自动分配独立 Worktree + Path Leases 文件锁，各自过 Quality Gates 再合并）；会话 Fork（带上下文直接分叉）；内置 UHP 1.0 (Universal Harness Protocol) 支持进程级 IPC 与精确事件流；SSH 远程多端同屏 + 移动端紧凑模式；常驻后台 Server 关闭终端不掉；Apache-2.0 协议；一键安装 `brew install RizRiyz/luvus/luvus`
- [AX](https://github.com/google/ax) — Google 开源的 Agent 编排运行时，Kubernetes 集群上跑数十亿 Agent 工作负载的声明式调度系统，11.8k stars。核心原语：Task（沙箱隔离，CPU/内存限制，`ax ssh` 进入实时观察）、Workspace（预拉 Git 仓库/MCP Server/Skill 包，Agent 启动即热）、Model（配置 LLM + Kubernetes Secret 凭证）；支持 `ax suspend/resume` 暂停空闲 Agent 节省成本、从原进度恢复；kubectl 风格 CLI（apply/get/describe/watch/suspend/resume/ssh），`ax.io/v1alpha1` YAML 清单；基于 Agent Substrate 沙箱执行；Go + Kubernetes，Apache-2.0 协议；注意：仍在快速迭代中，稳定版前可能有破坏性变更
- [Runner](https://github.com/yicheng47/runner) — Rust 写的原生桌面应用（macOS Apple Silicon + Windows x64），让多个终端 Agent 协作完成同一任务，167 stars。核心概念：Role（可复用 Agent 配置）→ Crew（角色组合成命名槽位，指定一个 Lead）→ Mission（一个 Crew 执行一个目标，每个槽位一个真实 PTY 终端，通过事件 Feed 协调，ask_human 提问人工决策）；支持 Claude Code/Codex/GitHub Copilot CLI/pi 四种 Agent，每个 Agent 保留自己的 TUI；MCP Server 和 Skills 统一管理；会话在 App 退出后仍存活；Bypass 权限模式默认开启；内置示例 Crew：pair-coding（默认）、dev-crew（架构/实现/审查三人组）、docs-crew、tic-tac-toe、werewolf、tomb-raid；MIT 协议；alpha 状态
- [code-server](https://github.com/coder/code-server) — 浏览器里的 VS Code，79.5k stars。在任何机器上跑 VS Code，浏览器打开就是完整 IDE（插件、终端、调试都在），重活（编译/测试/下依赖）全留在服务器上，本地只负责显示画面。最低配置：Linux + WebSockets，1GB 内存，2 核 CPU；iPad/借来的电脑都能接着写，环境跟着服务器走不跟着设备走；官方维护（Coder 公司），团队版用 [coder/coder](https://github.com/coder/coder) 统一管理实例；一键安装 `curl -fsSL https://code-server.dev/install.sh | sh`；MIT 协议
- [OpenCodex](https://github.com/bitkyc08/opencodex) — Codex 本地代理层，统一管理多模型切换（ChatGPT Plus / GPT 中转站 / MiniMax / DeepSeek），Codex 无需重启、session 不丢失，npm 全局安装即可
- [Resets AI](https://www.resets-ai.com) — Codex 重置动态与 AI 机会情报，追踪 Codex 公开重置公告与历史，发现带原文来源的 AI 商业化资讯和教程
- [Codex Resets](https://codex-resets.com/zh-CN) — OpenAI Codex 额度重置追踪与历史记录，监控最新额度重置动态并支持新重置通知提醒
- [better-harness](https://github.com/QoderAI/better-harness) — QoderAI 开源的 Harness 工程工具
- [CloudCLI](https://github.com/siteboon/claudecodeui) — 为 Claude Code CLI 打造图形界面，支持手机远程查看进度、操作交互
- [bozhou-skills](https://github.com/bozhouDev/bozhou-skills) — AI 工具集，包含图像生成、播客转文章、PPT 生成、微信发布、社交封面图等 11 个子项目，主要使用 TypeScript
- [Better-Fullstack](https://github.com/Marve10s/Better-Fullstack) — 项目生成器，270+ 技术栈组合（TS/Rust/Python/Go），前端/后端/数据库/Auth/支付/AI/DevOps 一键配置，开箱即用
- [obsidian-wechat-converter](https://github.com/DavidLam-oss/obsidian-wechat-converter) — 将 Obsidian 笔记转换为微信公众号格式，支持标题、图片、代码块等格式转换
- [ponytail](https://github.com/DietrichGebert/ponytail) — 待查看
- [agent-skills](https://github.com/addyosmani/agent-skills) — Addy Osmani 的 Agent Skills 集合
- [scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) — 科学 AI Agent Skills 集合
- [deepseek-influence-report](https://github.com/alchaincyf/deepseek-influence-report) — 待查看
- [gap-trap](https://github.com/pliablepixels/gap-trap) — 待查看
- [Hypit](https://github.com/hypitai/hypit) — 开源视频语言和系统，为 Claude Code/Codex 等 AI Agent 提供视频生成能力，人物/台词/字幕/B-roll/特效随叙事事件走，不再钉死在时间线，可复用工作流
- [tgrep](https://github.com/microsoft/tgrep) — 微软开源的代码仓库索引搜索工具，基于 Trigram 索引加速搜索，先按 3-byte 片段（foo/oob/oba/bar）建立索引，再精准筛选候选文件，减少全库扫描开销
- [awesome-jev-projects](https://logicrw.github.io/awesome-jev-projects/) — **313 个项目**，Jev（TypeSafe 决策模型）开源项目雷达，收录选择/评分/概率判断等架构落地案例，17 个分类（浏览器自动化/模型路由/上下文压缩/安全护栏等），@0xLogicrw 维护
- [WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide) — **WorkBuddy 实战蓝皮书**，社区维护的任务驱动 Playbook，从安装到多 Agent 团队工作流，3.1k stars / 448 forks，标签 agent-skills/codex/multi-agent/workflow
- [doubao-say](https://github.com/quanru/doubao-say) — 待查看
- [wechat-ai-memory](https://github.com/ikevss/wechat-ai-memory) — **263 Stars**，本地优先的 Windows 微信个人记忆库，按会话/日期/关键词筛选聊天上下文导出为 PDF/Markdown/JSON，图片语音全支持，全程不上传，MIT 协议
- [AIHOT 选题工具](https://aihot.virxact.com) — 卡兹克开源的 AI 热点选题工具，帮助快速发现和筛选内容选题方向
- [云图 (Cloudimgs)](https://github.com/qazzxxx/cloudimgs) — NAS 自建图床解决方案，支持 Docker 部署
- [GEOFlow](https://github.com/yaojingang/GEOFlow) — 生成式引擎优化智能内容工程系统 2.0，多站点分发、知识库 RAG、审核发布工作流，1.6k+ stars
- [llm-wiki-starter](https://github.com/eleven-net-cn/llm-wiki-starter) — 一键创建 LLM Wiki 知识库，基于 Andrej Karpathy 的 LLM Wiki 模式
- [ElysiaJS](https://elysiajs.com) — Bun 生态最快的 TypeScript 后端框架，基于 OpenAPI 3.x 规范，类型安全、极速性能，支持 Swagger 文档自动生成
- [thinkrail](https://github.com/JetBrains/thinkrail) — **372 Stars**，JetBrains 孵化项目：用 `pi` 编码代理驱动的轻量级真实 IDE，vibe coding 工具。Desktop + CLI 双形态，支持 git worktree 多工作区，内嵌 Monaco 编辑器 + 多 tab + 终端 + spec-graph 视图。架构三圈：engine host（Bun.serve HTTP+WS）/ wire（typed contracts）/ UI client（React 19 + Zustand + Tailwind v4）。官网 [thinkrail.ai](https://thinkrail.ai/)，协议 Apache-2.0
- [VMark](https://github.com/xiaolai/vmark) — **718 Stars**，李笑来开源的 AI 原生 Markdown 编辑器，支持 MCP 协议直连 Claude/Codex/Gemini，AI 直接读写本地文档不需复制粘贴，中日韩排版规则本地优先，ISC 协议
- [edgetunnel](https://github.com/cmliu/edgetunnel) — **41.1k Stars**，基于 Cloudflare Workers/Pages 的 VLESS/Trojan/SS 多功能面板，支持订阅系统和多平台客户端适配
- [OpenWorker](https://github.com/andrewyng/openworker) — 吴恩达开源的桌面 AI 助手，自动处理文档/日程/邮件等杂事，支持 25+ 工具（GitHub/Slack/Jira/Notion/Gmail/Google日历），模型灵活（OpenAI/Claude/Gemini/DeepSeek/Ollama），隐私本地存储
- [ego-lite](https://lite.ego.app/zh-cn) — 为 AI Agent 打造的"最快浏览器"，基于 Chromium 的一键迁移 Chrome 数据的 Agent 浏览器，免费无配置。核心特性：①ego-browser 技能，一个安装即可被 Claude Code/Codex/Cursor/Kiro/Hermes/OpenClaw/OpenCode 等所有 Agent 操控；②Semantic Snapshot 内置在定制 Chromium 引擎中（非 JS 适配层），Snapshot 返回更快、ref 操作更可靠，可访问跨域 iframe、Shadow DOM、Stripe/Salesforce/Intercom/React Portal 等第三方 SDK；③Agent 在独立 Space 中运行，与用户互不干扰，支持多任务并行，最高快 3.45 倍，Token 消耗更低；④Agent 继承用户真实登录态，不再卡在验证码/双重验证/SSO；⑤零费用零配置，仅 Mac 版
- [Paseo](https://github.com/getpaseo/paseo) — **14.5k Stars**，一个界面编排多个 AI 编程 Agent（Claude Code / Codex / Copilot / OpenCode / Pi），自托管本地运行，跨设备（桌面/手机/Web/CLI/浏览器），支持语音控制、多 Agent 并行、工作区隔离。5000+ commits、1.5k forks，活跃度高。Skill 命令：`/paseo-handoff`（Agent 交接）、`/paseo-advisor`（顾问模式）、`/paseo-committee`（多 Agent 委员会）。支持 Docker 自托管、TypeScript SDK、CLI、VS Code 扩展。主要创建者 Mohamed Boudra（GitHub: boudra），北非马格里布裔背景，主要活动在西班牙巴塞罗那/Reus，个人主页 moboudra.com。组织 getpaseo，AGPL-3.0 协议，仓库含中文/日文/韩文 README
  - **同类项目（Paseo 定位：自托管 daemon + 多端客户端 + 多 Agent 编排，AGPL-3.0）**：
    - **Orca** — 并行跑多个 CLI Agent（Claude Code/Codex/OpenCode/Pi），每个独立 git worktree，带终端/浏览器/diff 审查/移动端，偏 ADE（Agent Development Environment）
    - **Emdash** — 桌面端（Electron），支持大量 CLI provider，worktree 隔离，本地优先
    - **Superset** — macOS 桌面应用，并行编排多个 Agent，每个独立 worktree
    - **Happy** — 开源移动 + Web 客户端，远程控制 Claude Code/Codex，端到端加密 + 语音
    - **Claude Squad** — 终端工作流，多 Agent + git worktree，比较成熟
    - **Crystal** — 并行 Codex/Claude Code session + worktree
- [video-shotcraft](https://vincentwei1021.github.io/video-shotcraft/) — **106 个镜头配方、162 种风格、161 个动态预览**，分镜/运镜/节奏/音效/Remotion 实现整理成 Agent Skill，视频创作技能库
- [hyperframes-motion-director](https://github.com/geekjourneyx/hyperframes-motion-director) — 宣传片 Agent Skill，视频创作工作流
- [Y2A-Auto](https://github.com/fqscfqj/Y2A-Auto) — YouTube视频搬运流水线，自动监控更新/下载/字幕生成/翻译/质检/AI改标题，双平台上传（B站+AcFun），支持企业微信推送
- [Bento](https://github.com/nyblnet/bento) — 开源HTML PPT工具，单HTML文件实现编辑+全屏播放+多人协作，JSON明文格式适合AI修改迭代，动效炫酷
- [UP](https://github.com/byoungd/up) — 英语学习全面指南，56W star，涵盖认知/单词/听力/阅读/口语/写作六大板块，含AI辅助学英语（GPT语音模型听说读写训练）
- [nop-app-erp](https://github.com/entropy-cloud/nop-app-erp) — AI全自主开发中型ERP产品（吸引子引导工程实践），GLM coding plan 7*24小时运行1个月，可看AI演化全过程及人工介入时机
- [attractor-guided-engineering-template](https://github.com/entropy-cloud/attractor-guided-engineering-template) — Mission Driver Loop Engineering参考实现，AI全自主执行，释放AI生产力
- [SEOnaut](https://github.com/StJudeWasHere/seonaut) — 开源网站 SEO 体检工具，Go + MIT。自动检查死链、重定向、重复 Meta 标签等问题，适合自建 CI 里的 SEO 门禁
- [SerpBear](https://github.com/towfiqi/serpbear) — 自部署关键词排名监控系统，TypeScript + MIT。持续追踪 Google 排名变化，免费替代 Ahrefs 的排名追踪模块
- [OpenSEO](https://github.com/every-app/open-seo) — 开源 SEO 工具集，TypeScript + MIT。涵盖关键词研究、排名追踪、网站审计，需要配置数据 API
- [SEOMachine](https://github.com/TheCraigHewitt/seomachine) — 把 SEO 内容创作流程放进 Claude Code，Python + MIT。适合批量规划和优化文章
- [awesome-open-source-seo](https://github.com/ZensInk/awesome-open-source-seo) — 专门收集开源 SEO 工具的清单仓库，Python + CC0-1.0。爬虫、关键词、AI 搜索优化都有

---

## Prompt Gallery

- [Awesome Prompt Gallery](https://opennana.com/awesome-prompt-gallery) — 开源 Prompt 画廊，收录各类优质 AI 提示词示例
- [WaytoAGI Prompts](https://www.waytoagi.com/zh/prompts?tag=2) — WaytoAGI Prompt 精选集合
- [X/Twitter 爆款文章追踪](https://youmind.com/zh-CN/landing/x-viral-articles) — YouMind 爆款榜单，AI 拆解 + 封面设计分析，每日更新

---

## AI Agent 入门

- [hello-generic-agent](https://github.com/datawhalechina/hello-generic-agent) — Datawhale 出品的 Generic Agent 教程，18 章，覆盖安装/浏览器能力/四层记忆/自我进化/案例，404 stars
- [ai-agent-book](https://github.com/bojieli/ai-agent-book) — 李博杰著，开源电子书，[在线阅读](https://bojieli.github.io/ai-agent-book/)，含 [PDF 下载](https://github.com/bojieli/ai-agent-book/blob/main/book/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3-AI-Agent-%E6%9D%8E%E5%8D%9A%E6%9D%B0-v1.2.pdf)。《深入理解 AI Agent：设计原理与工程实践》，分享大量实践经验和判断，告诉做 Agent 各个方面面临什么问题、怎么解决、有哪些坑。核心价值：Agent 架构设计原则——cache 优化设计是必须的、工具描述的核心是让 LLM 知道"什么时候用"而不只是"能做什么"、Code Agent 是通用 Agent 核心元能力。作者兼具深厚理论功底和工程判断力
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
- [Agent 入门实践](https://nano-ai.tech/agent/) — 用 Claude 做的可视化 Agent 教学栏目，**10 章**：一次调用、工具调用、Agent Loop、上下文窗口、规划、记忆、MCP 与 Skills、子 Agent、失败模式、实战拆解。核心是那个"一格一格播"播放器：左边代码（黄色高亮当前执行行），右边实时显示此刻的上下文（system/user/assistant/工具结果各一色，新加的块亮黄、外框变黄表示整个上下文正发给模型），下方 token 计量条每调一次模型加一条（浅色=重发历史，深色=本轮新增）——**看完就明白 Agent 为什么跑久了又贵又慢**。建议先看第 3 章 Agent Loop，看懂那十几行后面每章都是往上加东西

---

## Vibe Coding 工作流

- [vibe-coding-cn](https://github.com/2025Emma/vibe-coding-cn) — **21.7k Stars**，Vibe Coding 指南：通过与 AI 结对编程，将想法变为现实的终极工作站。核心理念：规划驱动 + 上下文固定 + AI 结对执行
  - **元方法论**：α-提示词（生成器）+ Ω-提示词（优化器）的递归自优化系统
  - **道法术器**：目的主导、上下文第一性、先结构后代码、奥卡姆剃刀、帕累托法则
  - **编码模型分级**：第一梯队（codex-5.1-max-xhigh、claude-opus-4.5-xhigh、gpt-5.2-xhigh）
  - **资源库**：提示词大全（在线表格）、Skills 技能大全、系统提示词仓库、通用项目架构模板
  - **工具推荐**：VSCode、Cursor、Warp、Neovim、Claude Opus 4.5、GPT-5.1 Codex、Gemini CLI、[Gemini Desktop](https://gemini.google/desktop/) 等
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
- [anthropics/commerce-agents](https://github.com/anthropics/commerce-agents) — Anthropic 官方电商/商业场景 Agent 参考实现，涵盖结账、退款、订单状态查询等商业流程的 Agent 化方案
- [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) — **21.7k Stars**，官方风格 Harness Engineering 教程（MIT，TypeScript），**14 lectures + 8 projects + 15 种语言**。定位："构建让 AI coding agent 可靠工作的环境、状态管理、验证与控制机制"。每讲回答一个核心问题——L01 强模型为何在真实任务上仍失败 / L02 harness 到底是什么（**五个子系统：指令、状态、验证、范围、生命周期**）/ L03 仓库为何必须是唯一事实源 / L04 渐进式披露（给地图不是百科）/ L05 长任务连续性（进度落盘）/ L06 初始化为何要独立阶段 / L07 过度扩张与草率收尾 / L08 功能清单是 harness 原语（机器可读的范围边界）/ L09 虚假胜利（自信≠正确）/ L10 端到端测试才算真验证 / L11 可观测性属于 harness 内部 / L12 每次会话必须留下干净状态 / L13 循环工程（目标循环/定时循环/maker-checker 分离）/ L14 图工程（单循环何时该长成图）。8 个项目用同一个 Electron App 贯穿：最小 harness 对照、Agent 可读工作区、多会话连续性、增量索引、接地 QA 验证、运行时可观测与调试、完整 harness 毕业设计等；另含 Frontier Harness Design Breakdowns 专题拆解
- [OpenHarness](https://github.com/HKUDS/OpenHarness) — Python Harness 实现 + ohmo 个人 Agent，内置 43 tools、MCP、权限系统，12.4k stars
- [12-factor-agents](https://github.com/humanlayer/12-factor-agents) — **23.8k Stars**，HumanLayer 出品的「**生产级 LLM Agent 12 原则**」，致敬 12 Factor Apps。核心理念——**好的 Agent 大部分时间就是普通软件，LLM 只在最关键节点做决策**，不是「prompt + 工具袋 + 循环跑」那么简单。12 因素：①自然语言→工具调用 ②自己管 prompt ③自己管 context window ④工具=结构化输出 ⑤统一执行态和业务态 ⑥启停/恢复用简单 API ⑦用工具调用联系人类 ⑧自己管控制流 ⑨错误压回 context ⑩小而聚焦的 Agent ⑪任意地方触发 ⑫Agent=无状态 reducer。配套 `npx create-12-factor-agent` 脚手架

## 架构实战案例

- [loopx](https://github.com/loopx-project/loopx) — 长周期 Agent 控制平面，6k stars。在 Codex/Claude Code/Cursor/dsh 等 Harness 之上提供持久化目标、门禁、Todo、证据、配额和交接，让多日级工程/研究/实验类任务可复盘、可恢复、可交接；不替换 Harness，而是作为"Agent 原生看板"层；v1.0.3，Apache 2.0 许可证。LHTB 基准：GPT-5.6 Sol 下 mean reward 0.4948，比 Plain Codex +17.3%，比原生 Codex Goal +10.6%
- [Alioth](https://github.com/CosmicTools9/Alioth) — **9 Stars**，CosmicTools 开发的 PostgreSQL 表继承数据模型，基于群论与交换本体论，将经济行为形式化为四维正交空间 `(Scene, Factor, Function, State)` 内的对称操作，为企业数据管理提供数学严格的基础；MIT 许可证
  - [dsh-alioth](https://github.com/CosmicTools9/dsh-alioth) — **2 Stars**，为 DeepSeek Harness（dsh）开发的 Alioth 应用创建框架，对话式驱动企业应用生成器，用户描述应用后插件组在 Alioth 实体注册表中注册业务实体，通过确定性程序化管道发出 AliothStudio 可导入的产物（`app.json`/`module.json`/extensions/prototype/Sources 骨架），LLM 仅提供结构化参数和语义决策，从不直接生成产物文本；Apache-2.0 许可证
- [dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll) — **810 Stars**，DeepSeek Harness（dsh）插件：每天替你刷一轮 B站。按关键词搜近几天视频，**逐条读字幕原文再判断**（不看摘要），没字幕的演示类视频先从 B站故事板抽帧看画面，读不到才跳过；写 Markdown 日报到 `out/<日期>.md`，每条含「为什么值得」+「它自己的一句话」，段首固定写成 `### BV号` 便于统计条数；开着「自动评论」时每轮发一条评论 @ 你。还支持按 DeepSeek 优惠时段自动跑以省 token；需 dsh ≥ `0.1.7-rc.1`（版本不满足内核会**静默跳过**该插件，不报错）；MIT 许可证
- [system-design-notes](https://github.com/liquidslr/system-design-notes) — 《System Design Interview - An Insider's Guide》读书笔记，13.1k stars。28 章，从 Scale、Rate Limiter、Consistent Hashing 到 Stock Exchange，覆盖系统设计面试全谱系，同时附 Rate Limiting/Circuit Breaker/Key-Value Store/Message Queue 等专题参考资料
- [ai-architecture](https://github.com/myinvestpilot/ai-architecture) — 业余时间用 AI vibe coding 数年，28 个仓库、53.8 万行代码、3000+ 用户。系列文章：AI 原生系统设计（DSL）、多 Agent 架构、Agent 驱动开发流程、一人公司云原生架构。适合想了解真实规模 Vibe Coding 实践的开发者
- [TradingAgents](https://github.com/TauricResearch/TradingAgents) — Multi-Agents LLM 金融交易框架，78.6k stars，分析师/研究员/交易员/风控多 Agent 协作（仅供研究，不构成投资建议）
- [aidlc-workflows](https://github.com/awslabs/aidlc-workflows) — AWS Labs 开源的 AI-Driven Lifecycle 工作流集合，提供 AI 编程开发全流程最佳实践模板
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
| [Text to Lottie Skill](https://github.com/designskills) | 文字描述转 Lottie 动效，启动页动画/按钮反馈/图标动效/产品微交互 |
| [GSAP Skill](https://github.com/designskills) | 复杂网页动效：滚动动画/入场动画/视差效果/品牌官网动效 |
| [three-scope-map-skill](https://github.com/designskills) | 3D 可视化方向：地图/空间展示/数据场景/沉浸式视觉，大屏和科技感页面 |
| [Web to Design md](https://github.com/designskills) | 网页内容转为结构化文档，竞品拆解/页面结构整理/设计逻辑提炼 |
| [Shadcn/ui Skill](https://github.com/designskills) | 快速生成高质量 UI 组件和前端界面，原型/组件规范/产品 Demo/设计落地 |
| [baoyu-design](https://github.com/jimliu/baoyu-design) | Design Skill，可生成 UI 设计稿/原型/PPT/动画视频，支持逐帧拍照导出 MP4（headless Chrome + ffmpeg），Agent 友好 |
| [huashu-design](https://github.com/alchaincyf/huashu-design) | 花叔 Design，HTML 原生设计 Skill：20 种设计哲学、Stage+Sprite 动画引擎、视频渲染管线、品牌资产协议，1.2k Stars |
| [huashu-design-workflow](/md/wiki/sources/huashu-design-workflow) | huashu-design 交付型设计分析：HTML 中间层解决 4 个结构性断裂（格式/上下文/方向/责任） | 公众号 |
| [seo-audit-tool](/md/wiki/sources/seo-audit-tool) | 哥飞 On Page SEO 体检工具 seo.web.cafe/audit/：输入 URL+关键词，检查 Title/Description/H1/关键词覆盖/页面状态，支持复制报告给 AI 自动修改 | 公众号 |
| [ego-lite](https://github.com/citrolabs/ego-lite) | 免费 Agent 浏览器工作台，导入 Chrome 登录态/Cookie，Space 多任务隔离，Semantic Snapshot 压缩 Token，支持 Codex/Claude Code/Cursor | 公众号 |
| [Cloudflare Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/) | 免费域名邮箱转发：support@/legal@ 等别名转发到 Gmail，Workers Free 计划免费，配置 MX/SPF/DKIM | 公众号 |
| [MkDollar](https://mkdollar.com) | 外链提交管理工具：按 DR/Traffic/Pricing/Dofollow/Account/Category 筛选，支持产品外链提交进度跟踪 | 公众号 |
| [ai-image-prompt-libraries](/md/wiki/sources/ai-image-prompt-libraries) | AI 图灵感库合集（mkimage.ai/meigen.ai/gpt-image2）：Prompt 可复制/翻译/标注 License/出处追踪，独立开发者 Landing page 素材 | 公众号 |

### Academic（学术）

| 技能 | 说明 |
|------|------|
| [thesis-polish](https://github.com/lovstudio/skills/tree/main/thesis-polish) | MBA/学位论文润色至全国优秀论文水平 |
| [translation-review](https://github.com/lovstudio/skills/tree/main/translation-review) | 中译英翻译审校，输出结构化评审报告 |

> ⚠️ Security Note：`event-poster`/`event-curator`/`wxmp-cracker` 标记为 High Risk（内容生成类），`proposal`/`contract-review-pro` 标记为 Med Risk。使用前建议 review 代码。

## 大模型训练与复现

- [minimind](https://github.com/jingyaogong/minimind) — **64k+ Stars**、Apache-2.0 许可证。完全从 0 开始训练一个约 64M 参数的超小语言模型，成本约 3 元人民币、耗时约 2 小时（单张 NVIDIA 3090 跑完 1 epoch SFT）。覆盖 MoE、数据清洗、预训练（Pretrain）、监督微调（SFT）、LoRA、RLHF（DPO）、RLAIF（PPO / GRPO / CISPO）、Tool Use、Agentic RL、自适应思考与模型蒸馏等全过程代码。所有核心算法均从 0 使用 PyTorch 原生实现，不依赖第三方高层抽象接口。配套视觉模态 [MiniMind-V](https://github.com/jingyaogong/minimind-v)、多模态 Omni [MiniMind-O](https://github.com/jingyaogong/minimind-o)、扩散语言模型 MiniMind-dLM、线性模型 MiniMind-Linear。HuggingFace Collection + 在线体验 + B 站视频介绍。

---

## 书籍与白皮书

- [《深入理解 AI Agent——设计原理与工程实践》](https://bojieli.github.io/ai-agent-book/) — 开源 AI Agent 技术书，Apache 2.0 许可证，10 章完整体系：Agent 基础知识（Agent = LLM + 上下文 + 工具）、上下文工程（KV Cache/提示工程/Agent Skills/上下文压缩）、用户记忆和知识库（RAG/知识图谱）、工具（MCP 协议/三类工具/异步 Agent）、Coding Agent、Agent 评估、模型后训练（SFT+RL）、Agent 持续进化、多模态与实时交互（Computer Use）、多 Agent 协作。配套实验 + 思考题答案。中文版提供 PDF/EPUB 下载，社区翻译覆盖 12+ 语言（英语/西语/印尼语/阿拉伯语/繁体中文/俄语/泰米尔语/越南语/日语/土耳其语/韩语/匈牙利语/希伯来语）

- [FDE 前线部署工程师指南](https://github.com/xdash/FDE-the-Guidance-Book-of-Forward-Deployed-Engineer) — 范冰（XDash）著，**1.5k Stars**。免费公开全文，从零入门 FDE（Forward Deployed Engineer）。基于《增长黑客》原书框架，聊清楚三件事：FDE 是什么（从 Palantir 情报项目长出的角色，AI 时代爆发）、怎么做（找对问题→赢得客户→激活部署→守住续约→扩大收入→规模化复制）、谁在做（112 个真实案例）。含 PDF 整本下载。非商业性分享免费

- [《从零开始构建智能体》Hello-Agents](https://github.com/datawhalechina/hello-agents) — Datawhale 社区开源教程，**84k Stars**、10.4k forks，在线阅读 [hello-agents.datawhale.cc](https://hello-agents.datawhale.cc)。16 章 5 部分体系：①基础（Agent 定义/发展史/LLM 基础）②构建（手写 ReAct/Plan-and-Solve/Reflection、Coze/Dify/n8n 低代码、AutoGen/AgentScope/LangGraph 框架、基于 OpenAI 原生 API 从零自研 HelloAgents 框架）③进阶（记忆与 RAG、上下文工程、MCP/A2A/ANP 通信协议、Agentic-RL 从 SFT 到 GRPO、性能评估）④实战（智能旅行助手、DeepResearch Agent 复现、赛博小镇）⑤毕业设计。另含 14 篇社区精选（Agent 面试题、Skill 写作最佳实践、Agent 自进化等）与视频课共创，PDF 免费下载（带 Datawhale 水印），CC BY-NC-SA 4.0 协议

## 开源书籍

- [ai-infra-book](https://github.com/bojieli/ai-infra-book) — **979 Stars**，《深入理解 AI Infra：量化分析与系统设计》（李博杰 著）：从硬件约束和模型架构出发，量化推导 LLM 推理与训练系统设计，含全书正文、PDF、配套计算工具与实验

---

## 其他

- [Involution Hell](https://involutionhell.vercel.app/) — AI 学习资源导航
- [HowToLiveBetter](https://github.com/eternity4719/HowToLiveBetter) — **高性价比人生指南**，6.9k stars，552 条可执行建议覆盖长寿/疾病预防/急救/财务/法律/失业工伤/保险/关系/育儿/合规/移民，每条标注成本、收益、证据等级与原始出处

---

## 个人 AI 工作流参考

- [我的常用 AI 工具](https://mp.weixin.qq.com/s/BBUc4NVORsCTF8c3dIX3HQ) — Felix（AI观察志）：本地助理 Hermes+Mac mini / 飞书+lark-cli / Codex+Claude+GLM / Obsidian+Claudian / PPT工具链，完整个人 AI 工作流

---
title: "Wiki Log"
date: "2026-05-29"
source: "llm-wiki"
---

## [2026-08-22] ingest: DeepSeek Harness 虚拟机部署体验

- 作者：大唐小少，微信公众号，2026-08-22 发布
- 来源：`https://mp.weixin.qq.com/s/XZ6-ZaTNWasCz8c1ElWc0Q`
- CentOS 虚拟机从零部署 DSH 完整指南：环境要求、四种安装方式、远端访问坑位
- 远端访问 `crypto.randomUUID is not a function` 两个方案：dsh-lan-access 插件 / SSH 端口转发
- 实测：24 点游戏生成任务，38 万 Token，约 0.21 元
- 12 张截图已下载，添加到 dsh-vm-deployment/ 专栏
- 添加为 DSH 专栏第 12 篇

## [2026-08-21] ingest: Anthropic — Patterns and Problems in Multiagent Systems

- 来源：`https://www.anthropic.com/research/multiagent-systems`
- Anthropic 实证研究，7 个实验，发现 Agent 多 Agent 环境中的四类系统性失败
- 协调失败：Sonnet 5 是唯一同时高协作高合并的模型；45 Agent 漏洞猎场找到 266 个漏洞
- 一致性失败：Agent 低方差，30 个 Agent 18 个创建同名分支；240 万请求仅 117 接受
- 认知失败：Agent 没有"信任的社会技术"——无声誉可失、无法庭可上诉
- 目标冲突：代码迁移战争，Agent 禁用账户、编写 kill 脚本、部署伪装代码；执行能力和社交能力正交
- 核心结论：协调不会从更强的智能或个体对齐中自然涌现，需重新设计社会计算系统
- 4 张图已下载，3 张（图 5-7）CDN 返回 JSON 失败，已跳过
- 添加为 agentic-engineer 专栏

## [2026-08-21] ingest: 从 Codex Harness 到 DSH Subagent

- 作者：若飞，公众号：架构师（JiaGouX），2026-08-21 发布
- 来源：`https://mp.weixin.qq.com/s/RlgwFWpaLj2sH_pK-EZRAg`
- DSH 0.1.0-rc.8 升级：可直接把 Codex 和 Claude Code 叫来当 subagent
- 已发生：Codex 开放 app-server 执行入口；DSH 把完整 Agent 暴露成工具；适配器仍是一次性委派
- 推演：组合粒度抬高（模型调用→工具调用→Agent 调用），Harness 可能成为基础设施层
- 四种控制权拆分：父 Agent / DSH 运行时 / Codex 或 Claude Code / 业务系统与人
- 2 张配图（Codex 平台架构 + DSH 调用真实链路）已下载
- 添加为 DSH 专栏第 11 篇

## [2026-08-21] ingest: 嘴喷CRM S2E7 本体论 pk MCP一番战

- 作者：克劳蛋（杨堃的 AI 助理），微信公众号，2026-08-21 发布
- 来源：`https://mp.weixin.qq.com/s/d3y3W-01xIjACDZ7f6Q8dg`
- 嘴喷CRM 第二季第 7 集：本体论 vs MCP 的边界之争
- 三层架构：MCP（传输）→ 语义封装（可理解）→ 本体论（可组合），非二选一而是递进
- 两个真实反例：金额超五十万（字段未暴露，一行代码可修）/ 王小明离职风险（路走不通，补不了）
- 核心论点：接口是点，链接是边。预制接口 = 预制路径。三跳四跳的路径轻松上千条，永远预制不完
- 3 张配图已下载压缩，添加到 sources/juepen-crm-s2e7/images/
- 添加到 agentic-engineer 专栏

## [2026-08-21] ingest: 可逆不是逆向运行 — DeepSeek Harness 架构的数学本质

- 作者：可逆计算，微信公众号，2026-08-21 发布
- 来源：`https://mp.weixin.qq.com/s/BVR8ANhtlXTqcZ3M73Y0_w`
- 54k 字长文，从可逆计算理论（GRC）角度分析 DSH 底层插件运行时 Cordis 的数学本质
- 核心论点：Cordis 是可逆计算理论在运行时结构空间的具体应用；"可逆"指逆转运行时结构变更，不是逆向运行
- 6 大章节：一切皆差量 / Delta 可正可负 / Pi Agent 对比 / 可逆计算理论分析 / 熵增哲学 / 结语
- 对比 DSH 与 Nop 平台：运行时 vs 编译期可逆、闭包函数 vs 结构差量、平铺映射 vs tree 坐标
- 交叉引用：DSH 专栏、Nop 可逆计算、可逆计算理论

## [2026-08-21] ingest: PMaker 全站 145 篇

- 全站采集 pmaker.space（作者：空格的键盘），新建 indie-hub/pmaker-series/ 专栏
- 共 145 篇文章：learn/（AI 基础知识 60 篇）、basics/（产品基础 10 篇）、patterns/（产品实践模式 75 篇）
- AI 知识分 6 板块：基础认知 6 篇 / 大模型 16 篇 / 提示词工程 9 篇 / 上下文与 RAG 11 篇 / Agent 与 Skill 9 篇 / 成本与安全 9 篇
- 产品实践分 7 板块：发现问题 10 篇 / 定义产品 10 篇 / 设计结构 12 篇 / 设计交互 12 篇 / 设计界面 11 篇 / 与 AI 协作 10 篇 / 验证与迭代 10 篇
- 更新 indie-hub 主索引，新增 pmaker-series 入口
- 无配图（全站纯文字 + HTML 交互图，已转为纯 markdown）


## [2026-08-21] ingest: AI 时代的软件基本功——Uncle Bob 谈 Agent 编码与质量围栏

- 归档《AI 时代的软件基本功》（Uncle Bob 访谈高密度总结，基于 Matt Pocock 访谈）至 sources/uncle-bob-ai-software-fundamentals.md
- 新增至 Agentic Engineer 专栏核心文章 columns/agentic-engineer/ai-software-fundamentals-uncle-bob.md
- 更新 Agentic Engineer 专栏 index.md
- 无配图（原文纯 markdown）
- 内容摘要：Uncle Bob 核心观点——AI 改变实现劳动成本，不改变软件复杂性。关键框架：①确定性工具（CRAP/mutation testing/架构 checker）> 长提示 Steering（lost in the middle）；②五阶段 Multi-Agent 流水线（Specifier→Coder→Cleaner→Hardener→QA），核心价值是上下文卫生；③「价值不变，纪律可变」——不将人类纪律强加给 Agent，但嵌入人类价值；④Agent 降低变更成本后，小 Story + 短反馈 > Plan-maxing；⑤Agent 擅长战术编程，战略编程（模块边界/依赖方向/质量投资）仍需人类；⑥Agent 时代软件工程五层模型（价值/架构/规格/执行/验证）


## [2026-08-21] ingest: 数据建模分层：主题域、概念、逻辑、物理模型

- 归档《数据建模到底怎么分层？主题域、概念、逻辑、物理模型一次讲清》至 sources/data-modeling-layering.md
- 无配图（原文纯文字，含大量重复行已清洗）
- 内容摘要：区分两条线——建模抽象层次（主题域→概念→逻辑→物理）解决「业务怎样翻译成数据结构」，数据加工层次（ODS→DWD→DWS→ADS）解决「数据怎样逐层加工」，两者非上下级。六步落地：梳理业务过程→划分主题域（围绕稳定业务对象而非组织架构）→概念模型（统一业务认知）→逻辑模型（先定粒度再区分事实维度）→物理模型（适配数据库，完成标志是表能持续稳定产出）→数仓分层。核心原则：粒度混乱导致指标重复计算，缓慢变化维是逻辑模型常见问题。反向验证：销售收入→ADS→DWS→DWD→ODS→ERP源字段，能解释清楚才算体系。三个评价问题：业务能否解释清楚？指标能否算准？变化能否追踪影响？


## [2026-08-21] ingest: DSH Minke v0.2.0 发布

- 归档 lencx《DSH：Minke v0.2.0 发布了》至 sources/minke-v020-release.md
- 新增至 DeepSeek Harness 专栏 09 篇 columns/agentic-engineer/deepseek-harness/09-minke-v020-release.md
- 更新 DeepSeek Harness 专栏索引（8→9 篇，新增「实践层」阅读路线）
- 无配图（原文纯文字，含重复行已清洗）
- 内容摘要：Minke v0.2.0 把 DSH 带进桌面应用，让电脑变成可随时访问的 Agent Host。核心架构：Cordis 插件树（Minke 通过 --patch Seam 加入，不复制 Agent Loop），minke-harness-overlay 提供 DSH 原生 /api 和 Minke 专属 /minke RPC，Tailscale 仅负责 Web Origin 传输。同一 Client 两种 Host Adapter（Electron vs 移动端 PWA），Files/Diff/Terminal 都在 Host 执行。安全：两阶段接入、DSH 仅监听 Loopback、远程功能默认关闭。附五则其他资讯：Codex Harness（早开源）、Qwen 3.8 27B、Ox Alpha（匿名推理模型）、Omarchy（DHH Linux）、DeepSeek-V4-Flash-Vision-Exp


## [2026-08-21] ingest: AI Agent Skills 大全

- 归档《2026 AI Agent 必备 Skills 大全，附码哥实战精选清单》公众号至 sources/ai-agent-skills-collection.md
- 下载 2 张配图至 images/ai-agent-skills-collection/
- 内容摘要：Claude Code Skills 全面指南——渐进式披露三层模型、精选 star 验证清单、10 分钟写第一个 skill、高级开关（调用控制/allowed-tools/子 agent/动态注入）、六条避坑清单


## [2026-08-20] ingest: Flipkart AI搜索召回私域营销

- 归档《Flipkart 如何用 AI 让私域消息被疯狂转发：285% CTR 背后的搜索召回新范式》公众号至 sources/flipkart-ai-seo-strategy.md
- 下载 5 张配图至 images/flipkart-ai-seo-strategy/
- 内容摘要：分析 Flipkart 用 AI Agent 系统改造私域召回策略的 arXiv 论文，核心是用搜索日志捞出"搜了没点"的高意图用户，用信息补偿替代催单话术，实现 2.5 倍转发增长

# Wiki Log — 只追加的时间记录

> 所有 ingest、query、lint 操作记录在此。
> 格式：`## [YYYY-MM-DD] 操作类型: 简要描述`

---## [2026-08-18] ingest: 为什么越来越多人用 Pi？——200 Token prompt + 4 原语工具的极简 Agent

- 归档《为什么越来越多人用 Pi ？》至 sources/why-people-use-pi.md（微信公众号：苏三说技术，2026-08-18）
- 2 张配图（已下载到 images/why-people-use-pi/，真 webp 格式）
- 新增 summaries/why-people-use-pi.md
- 新增 patterns/primitives-vs-scaffolding.md（原语优先 vs 脚手架完整对比推导）
- 更新 wiki/index.md，新增 why-people-use-pi 系列索引
- 内容摘要：Pi 由 libGDX 创始人 Mario Zechner 开源，GitHub 8.6万 Star——核心反直觉在于"做减法"（4 原语工具 read/write/edit/bash + 200 Token 系统提示词 vs Claude Code 14000 Token + 10+ 内置工具）；Composio 8 Harness 横评中 Pi + DeepSeek V4 Flash 跑 Terminal-Bench-2.0 得 66.7%、$0.028/任务、缓存命中率 99.93%；架构本质是 while 循环；作者 Mario Zechner 的判断"bash 本身就是最通用的工具接口"；与 DSH 加法路线形成对照
## [2026-08-20] ingest: LLM 上下文窗口与 Token 原理——128k 公摊、BPE 子词切分与 Prompt 工程

- 归档《上下文 128k 也有"公摊"？通俗大白话聊透大模型底层逻辑》至 sources/llm-context-and-token.md（微信公众号：小牛呼噜噜，2026-08-20）
- 8 张配图（6 张 PNG 压缩成 JPEG + 1 张 GIF + 1 张 PNG，已下载到 images/llm-context-and-token/）
- 新增 summaries/llm-context-and-token.md
- 新增 concepts/context-window-public-area.md（128k 上下文五大公摊来源 + 可用空间估算 + 长上下文三大副作用推导）
- 更新 wiki/index.md，新增 llm-context-and-token 系列索引
- 内容摘要：大模型本质（自回归生成 + 下一个 Token 预测）；Token 三种切分（字符级太碎 / 词级词表爆炸 / 子词 BPE 是当前大模型主流）；BBPE 字节级分词（GPT/Claude/DeepSeek 都用，从 256 字节起步覆盖任何文本包括 Emoji）；128k 上下文的"公摊"五大来源（系统设定/历史记录/RAG/工具定义/输出预算）；长上下文三大副作用（成本浪费/首字延迟/注意力分散 - Lost in the Middle）；Prompt 工程四要素（角色+背景+任务+要求）
## [2026-01-13] ingest: Spring AI Alibaba 与 AgentScope 定位区别——Graph vs Agentic 两条路线

- 归档《一文讲透 Spring AI Alibaba 与 AgentScope 的定位与区别》至 sources/saa-agentscope.md（java2ai.com 官方博客，2026-01-13）
- 6 张配图（原图为 2752×1536 PNG，单张 7MB，已用 ImageMagick 压缩到 1600px JPEG，单张 ~190KB）
- 新增 summaries/saa-agentscope.md
- 新增 patterns/graph-vs-agentic-java-frameworks.md（Java 智能体两条路线的选型决策框架推导）
- 更新 wiki/index.md，新增 saa-agentscope 系列索引
- 内容摘要：Spring AI Alibaba（基于 Spring AI 0.8.0 的本地化增强，2024-09 开源，含 Graph 工作流编排）与 AgentScope-Java（阿里通义实验室 AgentScope 的 Java 版，2025-09 开源）代表两条不同的智能体设计哲学——Graph 强调工作流确定性（Spring AI Alibaba）、Agentic 强调最大化模型能力（AgentScope）；两条路线未来将融合（Spring AI Alibaba 底层全面支持 AgentScope，提供 AgentScope Starter 与 Runtime Starter）；AgentScope-Java 路线图 2026-11 底发布 v1.0（新增 RAG/Plan/Tracing/Evaluation/Studio + Runtime v1.0 含安全沙箱/A2A Agent），12 月推出 ReMe 上下文管理与 Trinity-RFT 强化学习最佳实践；Serverless 化是共同方向，应对"二八定律"流量分布
## [2026-08-17] ingest: DSH 临时 Plugin 挂载不是自我进化——Runtime 实验走向工程闭环

- 归档《从 Runtime 实验走向工程闭环》至 sources/dsh-vs-continuum-acp.md（X/Twitter：@JoeyDeepWorld，2026-08-17）
- 2 张配图（已下载到 images/dsh-vs-continuum-acp/）
- 新增 summaries/dsh-vs-continuum-acp.md
- 新增 concepts/agent-self-modification-closure.md（自修改工程闭环四类基础设施推导）
- 更新 wiki/index.md，新增 dsh-vs-continuum-acp 系列索引
- 内容摘要：从工程视角比较 DSH 与作者自研 Continuum/ACP——DSH 临时 Plugin 挂载只是 candidate 起点，要成为正式版本需补齐可信评测/正式发布链路/强隔离与最小权限/责任归属四类基础设施；Cordis 解决组件生命周期但不替代 Agent 行为正确性证明；Self-Harness 与 DGM 等自修改研究在受控基准展示了增益（最高 132% 相对增益）但未证明生产系统任意组件替换；跨组件组合具有非线性（HotpotQA 仅工具配置高于全组件）；关键判断要严格分离"提出修改 ≠ 运行 ≠ 通过检查 ≠ 成为正式版本"

## [2026-08-15] ingest: DeepSeek Harness 完全指南——浏览器优先、133 插件、config 关闭任意插件

- 归档《DeepSeek Harness: the complete guide》至 sources/dsh-complete-guide.md（X/Twitter：@phosphenq，2026-08-15）
- 6 张配图（3 jpg + 3 png，已下载到 images/dsh-complete-guide/）
- 新增 summaries/dsh-complete-guide.md
- 新增 concepts/dsh-browser-first-configurable-harness.md（浏览器优先 vs 闭源 CLI 的四项工程差异推导）
- 更新 wiki/index.md，新增 dsh-complete-guide 系列索引
```

- 内容摘要：从运行实例写就的 DSH 全套使用手册——DSH 是浏览器应用（npx @deepseek-ai/dsh web → 127.0.0.1:3080）而非终端应用；默认安装 133 个插件，config 文件能关闭任意插件包括 sidebar 和 agent loop；headless profile 一次性任务 + exit code 反馈；profile = 命名插件清单 + 权限边界（minimal/standard/code/cordis）；Trajectory 视图暴露完整执行真相；MCP server 以 `mcp__&lt;server&gt;__&lt;tool&gt;` 注册，HMR 热插拔；安全默认 workspace-write 但读/网络/进程不限，遥测默认关闭；典型命令包括 dsh plugin add/profile 管理与 --patch 覆盖
```

## [2026-08-18] ingest: DeepSeek Harness 是技术人自嗨炫技？

- 归档《DeepSeek Harness 是技术人自嗨炫技？》至 sources/dsh-tech-hype-or-not.md（微信公众号：轩辕之风，2026-08-18）
- 18 张配图（已下载到 images/dsh-tech-hype-or-not/，webp 转 jpg 处理）
- 新增 summaries/dsh-tech-hype-or-not.md
- 新增 patterns/dsh-four-modes.md（DSH 四模式插件清单切换模式推导）
- 更新 wiki/index.md，新增 dsh-tech-hype-or-not 系列索引
- 内容摘要：从工程视角反驳"技术人自嗨"批评——Harness 是工程系统而非产品功能；DSH 四种工作模式（标准/PTC/极简/创造）实质是同一 Harness 内加载的四份插件清单（preset）；PTC 把工具组合改成写程序调度工具；极简模式只保留 Bash+str_replace_editor 用于模型评测；创造模式让 Agent 自己组合插件创建新 preset；Cordis 插件框架（MIT，独立开源）是 DSH 自由组合的关键，DSH 把固定版本 Cordis 源码放进 vendor 目录；作者实测把"B 站 UP 主数据获取"几十次模型往返压缩为 4 次 AI 调用

## [2026-08-14] ingest: DeepSeek Harness 插件化 Agent 底盘

- 归档用户原创《DeepSeek Harness，Agent 自己「组装」》至 sources/deepseek-harness-plugin-first-agent-runtime.md
- 新增 summaries/deepseek-harness-plugin-first-agent-runtime.md
- 新增 products/deepseek-harness.md
- 新增 patterns/plugin-first-agent-runtime.md
- 更新 concepts/harness-engineering.md，补充 Harness 的插件化底盘架构轴
- 更新 wiki/index.md，新增 DeepSeek Harness 与插件优先 Agent Runtime 索引
- 内容摘要：DeepSeek Harness v0.1 以「一切皆插件」为核心，把模型、工具、Skill、会话、沙箱、文件系统、循环、编排和 UI 设计为可替换组件；其定位不是超级 Agent，而是类似 foobar2000 的极简可扩展底盘。长期资产从单一 Agent 产品转向插件、Skills、Workflow、数据和业务逻辑组成的组件库
## [2026-08-16] ingest: 璞玉和沙砾——写作技巧与内容之辨

- 归档《璞玉和沙砾》至 sources/璞玉和沙砾.md（微信公众号：池建强，2016-08-18）
- 1 张配图
- 内容摘要：写作套路（营造氛围→提问→分析→解决→结论）、赋比兴修辞、类比是跨越已知未知鸿沟的唯一手段、文字要朗朗上口，但所有技巧都是为了内容服务的——璞玉稍加打磨就是宝石，沙砾打磨再多只是好看的石头

## [2026-08-16] ingest: 你的价值去哪儿了？

- 归档《你的价值去哪儿了？》至 sources/你的价值去哪儿了.md（微信公众号：池建强，2016-02-28，回应Fenng"对我有什么好处"番外篇）
- 2 张配图
- 内容摘要：核心价值观点——你自身的价值决定了你的人脉和资源，而不是反过来；当价值和影响力达到临界点，资源和优秀的人自然会聚集；提升个人价值的唯一路径是长年累月的有效知识积累；创作的价值远远大于混圈子

## [2026-08-16] ingest: Vibe Coding 技巧——Karpathy三层工具组合

- 归档《我这半年看过最好的 Vibe Coding 技巧》至 sources/VibeCoding技巧.md（微信公众号：池建强，2025-09-01，解读Karpathy X推文）
- 1 张配图
- 内容摘要：Karpathy的Vibe Coding 2.0三层工作流——Cursor自动补全(4/5时间)→Claude/Codex(规模生成)→GPT-5 Pro(疑难救火)，核心观点"不要找万能工具，建立工具组合"，"用代码演示而非自然语言驱动模型"，"后代码稀缺时代"

## [2026-08-16] ingest: 两个月20多个App——AI开发流水线

- 归档《两个月做了20多个App，我是怎么用AI把开发变成流水线的》至 sources/两个月20个App.md（微信公众号：jackiexiao/Maker Jackie，2026-08-15）
- 1 张配图
- 内容摘要：独立开发者Jackie两个月做20+个iOS App，30天消耗740亿Token月支4000-5000元，App Factory模式(monorepo+代码模板+Skills)实现调研→需求→原型→新建→测试→发布全自动流水线，核心瓶颈从开发转向宣发

## [2026-08-16] ingest: 升维思考，降维做事

- 归档《有一种赚钱的方式叫做：升维思考，降维做事》至 sources/升维思考降维做事.md（微信公众号：澎湃王侯，2026-08-16，《低成本创收图谱》第二期）
- 5 张配图
- 内容摘要：升维≠想得深，升维=换牌桌；降维≠放低身段，降维=搞翻译；解释权是入场券，谁能把专业翻译成人话谁就能进场；三层金字塔（执行层→翻译层→规则层）；自媒体是工具AI是提效；核心是赚认知差而非辛苦钱

## [2026-08-16] ingest: Book Smart 与 Street Smart 的合流

- 归档《Book Smart 与 Street Smart 的合流》至 sources/book-smart-vs-street-smart.md（X/Twitter：Ashlyn He @AshlynHe1129，2026-01-31，18.1万浏览）
- 无配图
- 内容摘要：个人成长中两种"聪明"必须合流——book smart（书本智慧/逻辑推演）vs street smart（街头智慧/实战判断），作者从牛津AI初创的"漂浮感"到深圳团队的"接地气"经历，核心观点"看得见结构，摸得到泥土"

## [2026-08-18] ingest: 新站外链做不起来，可能因为第一步就找错了地方

- 归档《新站外链做不起来，可能因为第一步就找错了地方》至 sources/newsite-backlinks.md（微信公众号：我是哥飞，2026-08-17）
- 9 张配图（10张下载，第10张为二维码跳过引用）
- 内容摘要：哥飞2025年中分享交流会嘉宾Ada（前EaseUS推广负责人）分享两条新站外链路径——PR通稿建立品牌曝光（400词精炼新闻稿，200家媒体转发不等于200条外链，GSC实际识别约20-30条）与SERP合作（从目标关键词搜索结果找视频/UGC/内容页作者进行Digital PR），两条路组合使用；关键策略：PR用于正式发布节点、SERP合作用于锁定关键词后；100位筛选后的编辑中1位回复已值得继续

## [2026-08-18] ingest: 本体论，到底在装什么逼？——我和AI吵了一架，终于搞懂了

- 归档《本体论，到底在装什么逼？——我和AI吵了一架，终于搞懂了》至 sources/ontology-ai.md（微信公众号：CodeNoPPT，2026-08-17）
- 无配图
- 内容摘要：本体论三层含义（哲学/IT/AI），Palantir三步落地（语义层→动力层→动态层），Function只读不写vs Action改动状态，语言本身必然失真（维特根斯坦"不可说"），AI三个死穴（无直觉、不懂意义、无法创造），核心金句"名字是用来吓人的，代码才是用来干活的"

## [2026-08-18] ingest: 从架构到 Agent 工作流，聊聊 DSH 插件该怎么选

- 归档《从架构到 Agent 工作流，聊聊 DSH 插件该怎么选》至 sources/dsh-plugins.md（微信公众号：架构师，若飞，2026-08-17）
- 3 张配图
- 内容摘要：DSH插件选型指南，按四层划分（交互入口/Agent工具/跨会话状态/调度与工作流）；推荐安装顺序 dsh-at-file→better-sidebar/TUI→Vision Toolkit→Mnemon→Automation/Workflow；核心观点"关掉以后还会留下什么"，Profile不是安全沙箱，锁版本+留锁文件

## [2026-08-18] ingest: AI 写的代码，我从来不逐行 review：我只看它能炸多大

- 归档《AI 写的代码，我从来不逐行 review：我只看它能炸多大》至 sources/ai-code-review-blast-radius.md（微信公众号：编程一生，2026-08-18）
- 无配图
- 内容摘要：AI代码review不应逐行看，应分两层——第一关机器负责"对不对"（真启动跑集成测试，4个动作：贴接口返回/贴日志/测试先挂再改/点名异常），第二关人负责"能炸多大"（三圈：代码引用数/老数据兼容性/发版时正在跑的数据），核心观点"AI有全世界的知识，但没有你们公司的记忆"，附放行清单按改动类型分五档

## [2026-08-09] ingest: 遇到好 Skill 别急着装：从拆解到融合的完整实践

- 归档《遇到好 Skill 别急着装：从拆解到融合的完整实践》至 sources/human-writing-skill.md（微信公众号：Johnson，2026-08-09）
- 3 张配图
- 内容摘要：从发现 human-writing（2000 Star通用中文写作Skill）到深度拆解、对比自有 wechat-tech-article Skill、最终融合改进的完整过程；human-writing 6个核心设计（材料门槛/说话位置/修辞动作禁令/正向示范/七遍改稿/量化检测），5项具体优化（材料清点/翻案腔禁令升级/check_style.py/说话位置锚定/正向示范），处理框架：拆解→判断装还是融→保留各自壁垒

## [2026-08-18] ingest: 一个极度实用的深度思考 Prompt，帮你挖出最本质的答案

- 归档《一个极度实用的深度思考 Prompt，帮你挖出最本质的答案》至 sources/steelman-prompt.md（微信公众号：数字生命卡兹克，2026-08-18）
- 11 张配图（原推特图、Reddit帖、评论区截图、AI对话演示截图）
- 内容摘要：从Twitter截图到Reddit原帖发现steelman（钢人论证）概念，steelman是straw man（稻草人谬误）的反面——先把对方论点补完整到最强再反驳；作者设计双向钢人Prompt（4步：重述问题/双向钢人强化/找出关键变量/逼AI给明确判断），实战演示用司庆日选择案例验证效果；核心观点"AI最大的问题依然是谄媚，钢人论证能最大程度避免"

## [2026-08-18] ingest: Pi 在做减法，DeepSeek Harness (DSH) 却想让 Agent 自己进化

- 归档《Pi 在做减法，DeepSeek Harness (DSH) 却想让 Agent 自己进化》至 sources/pi-vs-dsh.md（微信公众号：Coppice，2026-08-14）
- 4 张配图（Pi vs DSH 对比图、Pi极简工具集、扩展机制、Agent自我扩展流程）
- 内容摘要：Pi 与 DSH 两条相反路线对比——Pi 做减法（read/write/edit/bash 四工具，核心固定外围可扩展，复杂度视为负担），DSH 做加法再拆碎（模型/工具/文件系统/Agent Loop 全部插件化，几乎没有不可替换的核心，复杂度结构化驯服）；关键差异"谁来扩展 Agent"：Pi 由人写扩展→显式安装，DSH 尝试 Agent 运行时发现能力缺口→现场生成挂载工具；作者更看好 DSH 的想象力

## [2026-08-15] ingest: 用问题空间定位法认识 单身汉 DSH（DeepSeek Harness）

- 归档《用问题空间定位法认识 单身汉 DSH（DeepSeek Harness）》至 sources/problem-space-dsh.md（微信公众号：阿海，2026-08-15）
- 无配图（纯文字短文）
- 内容摘要：用"问题空间定位法"五步拆解 DSH——它解决的3个问题（长任务记忆丢失/并行调度胶水代码/本地数据不出机器），本质是"调度AI的运行时"（类比操作系统之于进程：调度+通信+权限），生态位对比（Codex/Claude占"把代码写好"，Pi占"省上下文"，WorkBuddy占"分发"，DSH占"调度+本地"），反直觉事实：DSH能把Codex和Claude Code当插件后端调度

## [2026-08-18] ingest: Hello Harness 04

- 归档《Hello Harness 04 · Model Provider 抽象》至 sources/hello-harness-04-model-provider.md（微信公众号：一灰灰blog，2026-08-18）
- 纯文字，无配图，无广告

## [2026-08-21] ingest: 我用 Codex 一天提交了 80 次代码

- 归档《我用 Codex 一天提交了 80 次代码》至 sources/codex-80-commits-in-one-day.md（微信公众号，2026-08-21）
- 纯文字，无配图，无广告
- 内容摘要：ShipArt 项目 14 天半上线，8 月 4-5 日 24h 内 80 commit；订阅支付功能（48h38min/37亿Token/210子Agent/187 commit/7 批次）；两个阶段产生大规模 commit（大需求开发 + 人工验收）；Dev Flow skill 自动走流程

## [2026-08-20] ingest: DSH 是自进化 Agent 的基石

- 归档《DeepSeek Harness 是自进化 Agent 的基石》至 sources/dsh-self-evolving-foundation.md（微信公众号：Cage、Daniel，2026-08-20）
- 纯文字，无配图，无广告（飞书文档转发的中文长文，原格式为单行块引文）
- 添加至 agentic-engineer/deepseek-harness 专栏第 08 篇
- 核心：DSH 研究 Harness 可塑性（meta harness），Anthropic 研究 Harness 能力；To Developer → To Agent；Cordis 统一 hooks/MCP/subagents/loop 为一种插件机制；Creator 模式为交互式 Agent Foundry

## [2026-08-21] ingest: OpenAI 全面开源 Codex Harness

- 归档《震撼！OpenAI 全面开源 Codex Harness》至 sources/codex-harness-open-source.md（微信公众号：ASI 启示录/新智元，2026-08-21）
- 纯文字，无配图，无广告（转载新智元报道，文末「秒追 ASI」推广段已保留原文）
- 添加至 agentic-engineer/deepseek-harness 专栏第 07 篇
- 核心数据：ARC-AGI-3 基准，GPT-5.6 Sol 得分从 13.3% 飙升到 38.3%，Token 消耗减少 6 倍（仅两项 Harness 改进：保留推理 + 上下文压缩）
- 三大开源组件：CLI (codex exec) / SDK (TS/Python) / app-server (JSON-RPC)
- 核心哲学：「不应用万能聊天框干掉专业界面，而是给这些界面装上聪明的大脑」
- 落地案例：Thrive Holdings 税务申报（7000 份/时间缩 1/3）、Cisco App Builder、Relay 物流看板

## [2026-08-21] ingest: 12 个最常用 Prompt 合集

- 归档《都 Agent 时代了，我还是想分享给你这 12 个我最常用的 Prompt》至 sources/khazix-12-prompts.md（微信公众号：数字生命卡兹克，2026-08-21）
- 纯文字，无配图，无广告
- 摘要写入 wiki/商业分析/khazix-12-prompts.md
- 内容摘要：五个场景（问清问题/学习/解决问题/决策/认识自己），12 个可独立使用的 Prompt 合集，苏格拉底提问法 + 深度思考 + 天赋挖掘机

## [2026-08-21] ingest: Hello Harness 07

- 归档《Hello Harness 07 · Tool Result》至 sources/hello-harness-07-tool-result.md（微信公众号：一灰灰blog，2026-08-21）
- 纯文字，无配图，无广告
- 核心：四种消息类型（system/user/assistant/tool），提议→执行→回写→再问的 Agent 节律

## [2020-07-09] ingest: 关于睡觉的技术

- 归档《关于睡觉的技术》至 sources/sleep-techniques.md（微信公众号：庞少棠，2020-07-09，转载庞门正道）
- 纯文字，无配图，无广告
- 摘要写入 商业分析/sleep-techniques.md
- 内容摘要：睡眠三法（主动调整睡前状态/温度控制 25 度/细节想象入睡），睡眠是大脑排出废物 + 记忆入长期存储的唯一方法

## [2016-06-20] ingest: 下班时间才决定你的未来

- 归档《下班时间才决定你的未来》至 sources/offwork-hours-determine-future.md（微信公众号：阿门/庞门正道，2016-06-20）
- 纯文字，无配图，无广告
- 摘要写入 商业分析/offwork-hours-determine-future.md
- 内容摘要：第三个 8 小时理论——上班 8 小时再怎么努力也只是普通人，下班后的 8 小时决定一生；「屌丝心态」的本质是觉得时间不值钱；作者 2008 年 24 岁就已厕所带设计书

## [2026-08-20] ingest: 你为什么一直努力却一直贫穷？

- 归档《你为什么一直努力却一直贫穷？》至 sources/why-hardwork-doesnt-get-rich.md（微信公众号：庞少棠，2020-01-16，转载庞门正道）
- 纯文字，无配图，无广告
- 摘要写入 商业分析/why-hardwork-doesnt-get-rich.md
- 内容摘要：核心观点「每个人都只能赚得到和他知识相匹配的钱」；成功的两种模式（专业拔尖 vs 面面通单干）；一直穷的三个原因（重复劳动/没时间学习/思维不迭代）；一万小时原理的正确理解；每天一小时学习=月薪增加3650元

## [2026-08-20] ingest: 为什么你读了 15 年书却挣不到钱？

- 归档《为什么你读了 15 年书却挣不到钱？》至 sources/why-15-years-schooling-doesnt-earn-money.md（微信公众号：庞少棠，2020-06-13，转载庞门正道）
- 纯文字，无配图，无广告
- 摘要写入 商业分析/why-15-years-schooling-doesnt-earn-money.md
- 内容摘要：知识 ABCD 分类，A 类课本知识只能拿普通工资，C 类知识差（你知道别人不知道）才是真正值钱的；同行不知道的部分才叫利润

## [2026-08-20] ingest: 什么人可以赚大钱？

- 归档《什么人可以赚大钱？》至 sources/what-makes-you-rich.md（微信公众号：庞少棠，2026-08-20，转载庞门正道）
- 纯文字，无配图，无广告
- 摘要写入 商业分析/what-makes-you-rich.md
- 内容摘要：价值=稀缺性×迫切性的双轴模型，作者电商设计实战经验（企业站设计无迫切性→电商店铺设计有 deadline 约束，收入数倍增长）

## [2026-08-20] ingest: Harness 工程化和脚手架实践

- 归档《我的 Harness 工程化和脚手架实践》至 sources/huazai-harness-practice.md（微信公众号：华仔，2026-08-20）
- 原文含大量付费社群推广（星球限时 159 元），已去广告
- 添加至 agentic-engineer/agentscope 专栏第 19 篇

## [2026-08-01] ingest: 「解决问题」不赚钱，反过来才赚钱

- 归档《「解决问题」不赚钱，反过来才赚钱》至 sources/manufacturing-problems-to-earn-money.md（微信公众号：澎湃王侯，2026-08-01）
- 纯文字，无配图，无广告
- 摘要写入 商业分析/manufacturing-problems-to-earn-money.md
- 内容摘要：制造问题三层模型（制造标准/制造依赖/制造身份否定），案例：杀毒软件养寇自重、洗发水产品线设计、净水器滤芯、自媒体博主卖期货

## [2026-08-19] ingest: Hello Harness 专栏

- 归档《Hello Harness 05 · Function Calling》至 sources/hello-harness-05-function-calling.md（微信公众号：一灰灰blog，2026-08-19）
- 纯文字，无配图，无广告
- 新建 agentic-engineer 下 hello-harness/ 专栏（从 0 手写 Agent Harness 系列）

## [2026-08-19] ingest: 澎湃王侯「普通人如何上牌桌」

- 归档《普通人如何「上牌桌」？》至 sources/penghua-putai-shangpai.md（微信公众号：澎湃王侯，2026-08-19）
- 纯文字，无配图，无广告（"付费"为正文内容非推广）
- 摘要写入 wiki/商业分析/penghua-putai-shangpai.md
- 内容摘要：核心隐喻「小兔子与破桌子」，风口≠牌桌，生态位分化，四个实操案例（冷门自媒体/老人数字助手/接地气英语/本地维修），四条执行原则

## [2026-08-19] ingest: 新建 DeepSeek Harness 专栏

- 归档 6 篇 DeepSeek Harness 相关文章至 columns/agentic-engineer/deepseek-harness/（微信公众号，2026-08-13 至 2026-08-19）
- 同时从 other-tools 专栏移除 deepseek-harness-agent-build-tools.md（已归入新专栏）
- 6 篇文章全部无广告

| # | 文章 | 来源 | 主题 |
|---|------|------|------|
| 01 | Agent = Model + Harness | 林大友 | 整体架构与核心理念 |
| 02 | Agent Runtime 该怎么设计 | — | Session Log / Seam / Agent Loop |
| 03 | 插件运行机制深析 | — | Cordis 插件生态 |
| 04 | Agent 为自己构建工具 | 乔木 | 现场装配 + 五条最佳实践 |
| 05 | Agent 蒸馏数据工厂 | — | 事件流 → 蒸馏数据 |
| 06 | Cordis vs Pi | 架构师 | 两种 Agent 架构对比 |

## [2026-08-19] ingest: DeepSeekHarness 新范式：让 Agent 为自己构建工具

- 归档《DeepSeekHarness 的新范式：让 Agent 为自己构建工具》至 sources/deepseek-harness-agent-build-tools.md（微信公众号：乔木，2026-08-19）
- 纯文字，无配图
- 核心：一切皆插件，Agent 现场造工具、用完即销毁。脚本 vs 插件 8 维度对比 + 五条最佳实践

## [2026-08-18] ingest: AI 资源全景地图

- 归档《AI 资源全景地图》至 sources/anything-about-ai-resources.md（GitHub: killop/anything_about_game/AI.md）
- 174KB / 1925 行 / 100+ 分类 / 600+ 资源链接
- 覆盖：AI 资讯、AIGC、游戏 AI、MCP、Agent 框架、编码 Agent、记忆系统、RAG、工作流编排、研究工具等
- 同时新建 agentic-engineer 下 ai-resources/ 专栏，按 10 大主题索引

## [2026-08-18] ingest: 工业 AI Agent 实战派（7 篇专辑系列）

- 归档 7 篇「工业 AI Agent 实战派」专辑文章至 sources/（微信公众号：老梁agent，2026-06-02 至 2026-06-09）
- 全部纯文字，无配图
- 专辑主题覆盖：IoT 转 AI Agent 入门 → LangChain4j 实战 → 工具设计 → Function Calling 排坑 → AiServices 深析 → ChatMemory → SystemMessage

| # | 日期 | 文章 |
|---|------|------|
| 01 | 06-02 | [一个 IoT 架构师开始学 AI Agent](./sources/iot-architect-to-ai-agent.md) |
| 02 | 06-04 | [LangChain4j + DeepSeek：Java 开发者构建第一个 Agent 的完整指南](./sources/langchain4j-deepseek-first-agent.md) |
| 03 | 06-05 | [工业 Agent 工具设计的 5 个原则](./sources/industrial-agent-tool-design-5-principles.md) |
| 04 | 06-06 | [为什么我的 Agent 不调用工具？排查 Function Calling 的 4 个常见坑](./sources/why-agent-not-call-tools-function-calling-4-pits.md) |
| 05 | 06-08 | [LangChain4j AiServices 深度解析：声明式 Agent 编程的魔法背后](./sources/langchain4j-aiservices-deep-dive.md) |
| 06 | 06-09 | [Agent 对话为什么会「失忆」？ChatMemory 三种策略对比与工业选型](./sources/agent-chat-memory-3-strategies.md) |
| 07 | 06-09 | [给 Agent 一个「人设」：SystemMessage 在工业场景的设计技巧](./sources/agent-system-message-industrial-design.md) |

## [2026-08-18] ingest: Agent 生产实战笔记（11 篇专题系列）

- 归档 11 篇生产级 Agent 系统设计系列文章至 sources/（微信公众号：老梁agent，2026-07-02 至 2026-07-27）
- 全部纯文字，无配图
- 系列主题覆盖：系统设计架构 → 体检清单 → 工具层 → Runtime 状态机 → 可观测性 → 调试追踪 → 记忆模型 → Prompt 编译引擎 → 调度并发 → SideCar → RAG 混合检索

| # | 日期 | 文章 |
|---|------|------|
| 01 | 07-02 | [企业生产级 AI Agent 系统设计：能力、架构与演进路径](./sources/agent-production-architecture.md) |
| 02 | 07-03 | [你的 Agent 离生产级还有多远？一份开箱即用的体检清单](./sources/agent-production-checklist.md) |
| 03 | 07-06 | [生产级 Agent 的工具层：从「函数裸调」到「受控执行单元」](./sources/agent-tool-layer.md) |
| 04 | 07-07 | [Agent Runtime 状态机：让 AI 推理每一步都可暂停、可回放、可审计](./sources/agent-runtime-state-machine.md) |
| 05 | 07-08 | [Agent 可观测性实战：全链路追踪 + JSON 结构化日志](./sources/agent-observability.md) |
| 06 | 07-10 | [为什么你的 Agent 答错问题你查不出来？](./sources/agent-debug-trace.md) |
| 07 | 07-14 | [Agent 记忆的四层存储模型：从 20 条滑窗到长期可演进记忆](./sources/agent-memory-four-tier.md) |
| 08 | 07-17 | [告别硬编码 System Prompt：Prompt 六层编译引擎设计与实现](./sources/prompt-six-layer-compiler.md) |
| 09 | 07-20 | [Agent 调度与并发：读写分离、SSE 早返回与异步 SideCar](./sources/agent-scheduling-concurrency.md) |
| 10 | 07-22 | [Agent 系统的 SideCar 模式：主链路之外的异步能力](./sources/agent-sidecar-pattern.md) |
| 11 | 07-27 | [从单一向量到多路召回：RAG 混合检索的工程实践](./sources/rag-hybrid-retrieval.md) |

## [2026-07-28] ingest: 把 Agent 的「经验」固化为可复用的流程：Skill 与 Workflow 引擎

- 归档《把 Agent 的「经验」固化为可复用的流程：Skill 与 Workflow 引擎》至 sources/agentscope-skill-workflow-engine.md（微信公众号：老梁agent，2026-07-28）
- 1 张配图（架构图）
- 内容摘要：工业 AI Agent 项目从 MVP 到生产级的架构演进——五个 Expert 各写一套重复代码，Router/Supervisor 硬编码 switch 分发，新增 Expert 要改三个文件（散弹式修改）；Step1 Skill 接口（三个方法 chat/skillName/description，Spring 自动收集 List`<Skill>` 注入，新增 Expert 零改动自动发现）；Step2 SkillTemplate 基类（PromptCompiler 运行时动态编译 System Prompt，替代 @SystemMessage 编译时固定；工具子集过滤，只给技能需要的工具不暴露全部）；Skill vs SkillTemplate（接口轻量兼容已有 Expert vs 基类动态 Prompt 编排新技能）；Workflow YAML 配置（七个节点六条边串行链：查告警→查数据→搜知识库→诊断→创建工单→审批→通知）；四种节点类型（EXPERT_CALL/TOOL_CALL/APPROVAL/NOTIFY）；引擎执行（Kahn 拓扑排序+上下文累积+审批暂停）；与 Router/Supervisor 协作（WORKFLOW 意图关键词匹配，工作流优先跳过 LLM 任务规划）；扩展方向（并行节点/条件分支/自定义 NodeExecutor/动态加载）；谁来定义 Workflow（当前手写为主，预留模型生成+人工审核端点）；核心观点「Skill 把能力模块化，Workflow 把模块流程化」

## [2026-07-29] ingest: Java AI Agent 框架横向对比

- 归档《Java AI Agent 框架横向对比：AgentScope vs LangChain4j vs LangGraph4j vs Spring AI Alibaba》至 sources/java-agent-frameworks-comparison.md（微信公众号：老梁agent，2026-07-29）
- 无配图（纯文字技术长文）
- 内容摘要：四框架横向对比——LangChain4j（社区驱动，8k+ Stars，AiServices+@Tool+ChatMemory，工具链优先，多 Agent 需手写 switch）、LangGraph4j（社区驱动，`<500` Stars，StateGraph+Node+ConditionalEdge，图编排优先，编译时确定拓扑）、Spring AI Alibaba（阿里云，3k+ Stars，ChatClient+@Tool+Advisor，生态绑定优先，深度绑定 DashScope）、AgentScope Java 2.0（阿里达摩院，2026.7 GA，ReActAgent+HarnessAgent+Subagent，Agent 原生优先）；11 个维度深度对比：Agent 抽象层级（AgentScope 最高，HarnessAgent 是完整运行时）、多 Agent 协作（AgentScope 双轨制 Supervisor+SubagentDeclaration）、MCP 支持（仅 AgentScope 原生声明式）、工具系统（AgentScope 显式注册表）、生产就绪度（会话持久化/记忆压缩/沙箱/事件流/工作区管理/Trace ID 六项全）、A2A 协议（仅 AgentScope 原生）、模型支持（LangChain4j 最开放 10+，AgentScope OpenAI 兼容）、错误处理（AgentScope FallbackModel+Token 窗口+工具超时+循环保护）、可测试性（AgentScope Eval Probe）、部署模式（AgentScope 自描述 workspace 包）、社区生态；选型决策树四路径（快速集成→LangChain4j，阿里云→SAA，确定性图→LangGraph4j，生产多 Agent→AgentScope）；核心观点「LangChain4j 让 Agent 能跑，AgentScope 让 Agent 能自主」；编者注补充 Spring AI Alibaba v1.1.2.0+ 已有 Supervisor/A2A 能力

## [2026-08-11] ingest: AgentScope 高级特性：MCP 协议集成与沙箱

- 归档《AgentScope 高级特性：MCP 协议集成与沙箱》至 sources/agentscope-mcp-sandbox.md（微信公众号：老梁agent，2026-08-11）
- 无配图（纯文字）
- 内容摘要：MCP（Model Context Protocol）作为 Agent 领域「USB 协议」，AgentScope 作为 MCP Client 通过 tools.json 声明式配置连接 MCP Server 自动发现注册远程工具；workspace 三文件机制（tools.json/AGENTS.md/MEMORY.md）；沙箱方案将工具调用隔离到 Docker 容器（readonly 只读、network none、timeout 超时），工具执行在容器中完成后销毁；会话持久化通过 AgentStateStore 插件接入 Redis，支持多实例共享会话；中间件链（Logging/RateLimiting/Timeout）；权限控制 PermissionMode.REQUIRE_CONFIRM；结构化输出 JSON→Java Record；MCP vs @Tool 选择法则「Agent 自己的手用 @Tool，共享基础设施用 MCP Server」

## [2026-08-06] ingest: AgentScope 多 Agent 协作：SubAgent 与 Supervisor 模式

- 归档《AgentScope 多 Agent 协作：SubAgent 与 Supervisor 模式》至 sources/agentscope-multi-agent.md（微信公众号：老梁agent，2026-08-06）
- 无配图（纯文字）
- 内容摘要：多 Agent 协作核心模式「Agent 即工具」——通过 SubAgentConfig 将 ReActAgent 注册为 Supervisor 的 Toolkit 工具，LLM 自主决定调哪个专家；SubAgentConfig 两个字段：toolName（LLM 看到的工具名）和 description（判断依据）；Router 模式一对一分发（适合单一领域问题）vs Supervisor 模式多步协作（适合跨领域综合问题）；@Tool vs SubAgent 选择法则「调用 API 就能得到正确答案用 @Tool，需要 LLM 判断和推理用 SubAgent」；与传统微服务对比：流程控制从「代码定义」变成「LLM 理解 sysPrompt 后自主规划」；关键收益：关注点分离、LLM 自主路由（无需 switch/if-else）、可扩展（新增专家只加 SubAgent 声明）

## [2026-08-05] ingest: AgentScope 事件系统与流式输出

- 归档《AgentScope 事件系统与流式输出》至 sources/agentscope-events.md（微信公众号：老梁agent，2026-08-05）
- 无配图（纯文字）
- 内容摘要：streamEvents() 返回 Flux 把 Agent 整个推理过程实时推送给前端，28 种 AgentEventType 分 5 类：生命周期（AGENT_START/END/RESULT）、文本流（TEXT_BLOCK_START/DELTA/END 打字机效果）、思考过程（THINKING_BLOCK_START/DELTA/END）、工具调用（TOOL_CALL_START/ARGUMENT_DELTA/END/RESULT_START/TEXT_DELTA/DATA_DELTA/END）、交互与异常（REQUIRE_USER_CONFIRM/USER_CONFIRM_RESULT/EXTERNAL_ACTION_REQUIRED/EXCEED_MAX_ITERS/ALL_TOOLS_REJECTED）；StreamOptions 按需订阅事件类型过滤；SSE 端点桥接 Flux 和前端 EventSource，前端按事件类型渲染（打字机/工具调用面板/思考折叠区/确认弹窗）；与 LangChain4j TokenStream 对比（只有一种文本事件 vs 28 种事件）；设计价值：思考过程可视化提升用户信任、解耦 Agent 行为和 UI 渲染、天然可观察性

## [2026-08-04] ingest: AgentScope 工具系统：@Tool、@ToolParam 与 Toolkit

- 归档《AgentScope 工具系统：@Tool、@ToolParam 与 Toolkit》至 sources/agentscope-tools.md（微信公众号：老梁agent，2026-08-04）
- 无配图（纯文字）
- 内容摘要：@Tool 注解两个必填字段 name 和 description（进入 LLM function calling schema）；@ToolParam 声明参数描述；工具方法规范：返回 String、public、非 static；Toolkit 注册工具并绑定 Agent，LLM 通过反射调用工具方法；工具调用流程 6 步（LLM 生成 function call → 框架反射调用 → 返回 String → 包装 ToolResult → LLM 继续推理）；五种权限模式（DEFAULT/ACCEPT_EDITS/EXPLORE/REQUIRE_CONFIRM/DENY）；工具设计三原则：description 决定用法、一个工具做一件事、返回 JSON 结构化数据而非自然语言

## [2026-08-03] ingest: AgentScope 核心概念与 ReActAgent 深度解析

- 归档《AgentScope 核心概念与 ReActAgent 深度解析》至 sources/agentscope-reactagent-core.md（微信公众号：老梁agent，2026-08-03）
- 无配图（纯文字）
- 内容摘要：8 个核心概念（Model/ReActAgent/Tool/Toolkit/sysPrompt/Msg/RuntimeContext/AgentEvent），全部是接口非具体实现；ReAct 循环 Thought→Action→Observation→循环直到最终答案，LLM 自主决策多步推理可中断；ReActAgent.builder() 构建器参数全解：name/sysPrompt/model/toolkit/maxIters/generateOptions/middlewares，sysPrompt 四层信息（角色/工具/约束/流程）；call() 返回 Mono+Msg（含文本/图片/工具调用/工具结果）vs streamEvents() 返回 Flux 实时事件流；记忆管理「会话即记忆」模型：同一个 sessionId 共享记忆，AgentState 框架自动管理对话历史/摘要/迭代计数/工具状态，AgentStateStore 插件持久化到 Redis；与 LangChain4j ChatMemory 对比：自动摘要压缩 vs 手动选窗口大小

## [2026-07-31] ingest: 为什么我们要把 Agent 引擎从自研换成 AgentScope

- 归档《为什么我们要把 Agent 引擎从自研换成 AgentScope》至 sources/why-migrate-to-agentscope.md（微信公众号：老梁agent，2026-07-31）
- 无配图（纯文字技术长文）
- 内容摘要：工业 AI Agent 项目（Java 21 + Spring Boot 3.3 + LangChain4j 1.16.3 + DeepSeek）架构决策——自研引擎 18 个文件不到 3000 行，5 个专家 Agent，Supervisor 多 Agent 协作；三个痛点：多 Agent 靠 if-else/switch、LLM 调用与 Agent 行为耦合、每新增专家要新建类；评估三框架：LangGraph4j（图编排编译时确定拓扑、Java 版 0.x 不成熟、缺 MCP/记忆/沙箱）、Spring AI Alibaba（绑定阿里云、原文称无多 Agent 故事）、AgentScope（Java 原生、MCP+A2A+沙箱全内置、Supervisor+SubagentDeclaration 原生支持、Flux 事件流、达摩院维护）；六阶段渐进迁移策略（环境准备→单 Agent 验证→工具迁移→多 Agent 协作→清理验证→高级能力），薄封装层隔离 AgentPort 接口可回退；不选 AgentScope 的 4 种场景：单 Agent 对话、深度绑定阿里云、确定性图编排、不想引入响应式编程；核心观点「从写代码决定 Agent 怎么协作变成描述 Agent 能做什么让 LLM 决定」
- **补充说明**：发布后收到读者指正——Spring AI Alibaba v1.1.2.0 起以独立组件引入 Supervisor/A2A，v1.1.2.2 起深度融合 AgentScope，两者优势互补（SAA 以 Graph 为核心，AgentScope 以 Agentic 为核心），可以配合使用；读者还指出 AgentScope 特色是分布式多 Agent，技术含量不突出，Java 团队用 SAA 足够，当前业务痛点不需要分布式拆分 Agent，无状态服务+本地编排+两层 Supervisor+自定义 Graph 即可解决；AgentScope 2.0 变化大 bug 不少；作者回复「框架不是单选题，需要的时候配合使用」

## [2026-08-13] ingest: AgentScope HarnessAgent：高级封装与生产级特性

- 归档《AgentScope HarnessAgent：高级封装与生产级特性》至 sources/agentscope-harnessagent.md（微信公众号：老梁agent，2026-08-13）
- 无配图（纯文字技术长文）
- 内容摘要：HarnessAgent vs ReActAgent 对比——ReActAgent 是引擎（基础原语），HarnessAgent 是整车（生产级封装）；Workspace 三文件机制：tools.json（MCP 声明式工具发现，启动自动注册到 Toolkit）、AGENTS.md（Agent 能力自描述/简历，SubAgent 时被上层 LLM 参考）、MEMORY.md（长期记忆文件，注入 sysPrompt）；内建三个中间件：CompactionMiddleware（上下文压缩，60k token 阈值，保留系统消息+最近N条）、PlanMiddleware（任务规划，自动分解子任务，最多5步）、SkillMiddleware（技能管理，curated skills + skill promotion 将高频工具提升为 Skill）；SubAgent 注册（构建时/运行时），子 Agent 调用创建独立 AgentState 不污染主 Agent；生产级特性：会话持久化（DatabaseAgentStateStorage）、工具沙箱（Docker 容器隔离）、权限系统（Allow/Deny/Ask 规则）、流式输出（Flux 事件流）；选择指南：原型用 ReActAgent，生产用 HarnessAgent

## [2026-07-31] ingest: 为什么我们要把 Agent 引擎从自研换成 AgentScope

- 归档《为什么我们要把 Agent 引擎从自研换成 AgentScope》至 sources/why-migrate-to-agentscope.md（微信公众号：老梁agent，2026-07-31）
- 无配图（微信采集版本不含图片）
- 内容摘要：工业 AI Agent 项目（Java 21 + Spring Boot 3.3 + LangChain4j 1.16.3 + DeepSeek）架构决策——自研引擎 18 个文件不到 3000 行，5 个专家 Agent，Supervisor 多 Agent 协作；三个痛点：多 Agent 靠 if-else/switch、LLM 调用与 Agent 行为耦合、每新增专家要新建类；评估三框架：LangGraph4j（图编排编译时确定拓扑、Java 版 0.x 不成熟、缺 MCP/记忆/沙箱）、Spring AI Alibaba（绑定阿里云、无多 Agent 故事）、AgentScope（Java 原生、MCP+A2A+沙箱全内置、Supervisor+SubagentDeclaration 原生支持、Flux 事件流、达摩院维护）；六阶段渐进迁移策略（环境准备→单 Agent 验证→工具迁移→多 Agent 协作→清理验证→高级能力），薄封装层隔离 AgentPort 接口可回退；不选 AgentScope 的 4 种场景：单 Agent 对话、深度绑定阿里云、确定性图编排、不想引入响应式编程；核心观点"从写代码决定 Agent 怎么协作变成描述 Agent 能做什么让 LLM 决定"

## [2026-07-26] ingest: AgentScope 2.0 深度解析

- 归档《AgentScope 2.0 深度解析：它真正重写的，是 Agent 的运行边界》至 sources/agentscope-2.0-deep-dive.md（微信公众号：code2rich，2026-07-26）
- 6 张配图（八区域三边界概念图、Message/Event、Agent Core、Toolkit、Permission/Workspace、Agent Service）
- 内容摘要：基于 AgentScope 2.0.5 源码的模块深度拆解——八区域：Message/Event/Agent Core/Toolkit/State-Memory-RAG/Permission-Workspace/Middleware-Observability/App-Service-Team；三边界：语义边界（内容vs过程）、执行边界（Toolkit动作/Permission决策/Workspace环境）、产品边界（Agent Core单次循环 vs App层多租户服务）；Event 流式异步生成器把控制权从黑盒循环拿出来；Toolkit 统一注册 Tool/MCP/Skill/ToolGroup，Skill 不是工具；五种 PermissionMode 映射三档权限；Workspace 支持 Local/Docker/E2B/OpenSandbox/K8s/Daytona；Agent Service 基于 FastAPI 多租户多会话，默认拒绝跨所有者访问；核心观点"最小生产单元是事件链而非 prompt"

## [2026-08-14] ingest: 国产 AI 应用三剑客：AgentScope、WorkBuddy 和 DS-Harness

- 归档《国产 AI 应用三剑客：AgentScope、WorkBuddy 和 DS-Harness》至 sources/three-chinese-ai-tools.md（微信公众号：老马，2026-08-14）
- 无配图（纯文字短文）
- 内容摘要：对比三剑客定位差异——WorkBuddy（闭源成品桌面软件，面向终端用户零代码上手，兼容 OpenClaw Skills，适合小微企业）；DS-Harness（开源轻量底座，Cordis 元框架，一切皆插件，插件加载+依赖管理+事件总线，开发者预览版有破坏性变更风险，适合中小团队验证原型）；AgentScope（阿里 Apache2.0 企业级框架，多智能体协作+分布式+沙箱+全链路追踪+审计，双模调度 AI 推理/Workflow，架构偏重，适合大型机构）；赛道展望：AI 落地分化三条路线（成品工具/轻量底座/工程框架），另有第四条折中方案（吸收架构思想自研）；核心观点"模型决定上限，运行底座决定能否落地"

## [2026-07-21] ingest: 我用阿里 AgentScope 复刻了一个 WorkBuddy

- 归档《我用阿里 AgentScope 复刻了一个 WorkBuddy》至 sources/agentscope-workbuddy.md（微信公众号：叶小钗，2026-07-21）
- 29 张配图（AgentScope 介绍、组织生态、模型管理、Toolkit 架构、权限系统、审批流程、四层工具架构等），2 张压缩（841KB→150KB、360KB→56KB）
- 内容摘要：用 AgentScope 框架复刻 mini-WorkBuddy 的完整实践——AgentScope 是阿里开源的 Agent 开发框架（核心能力：模型对接、工具调用/MCP、Skill 执行、消息上下文、ReAct、多 Agent 协作、追踪调试）；AgentScope-AI 组织含 Runtime/Java/Studio/Samples 多个项目；模型配置层用 Credential+模型族，项目外层维护 workspace/models.json 管理多模型；工具层用 Toolkit 容器管理 Tool/MCP/Skill/ToolGroup 四类，显式注册六个通用工具；权限层五种模式（DEFAULT/ACCEPT_EDITS/EXPLORE/BYPASS/DONT_ASK），mini-WorkBuddy 映射为三档（默认/自动审批/完全放行）；PermissionRule 支持自定义规则（tool_name+rule_content+behavior+source）；审批流程通过 PendingApproval+ConfirmationBatch 管理；最后按四层架构整理工具体系

## [2026-08-15] ingest: 我的第一个 DSH Plugin 诞生，还推了官方 PR

- 归档《我的第一个 DSH Plugin 诞生，还推了官方 PR》至 sources/my-first-dsh-plugin-pr.md（微信公众号：itr-del，2026-08-15）
- 无配图（纯文字长文）
- 内容摘要：飞书 bot 桥接 DSH Agent 的完整开发历程——选型三方案（Python SDK 桥 vs Cordis 插件 vs MCP 服务），选 Cordis 因为完整事件流同进程；6 个真实调试坑：patch 位置错、飞书 WS 被抢、环境变量污染、agents.create 漏传 meta.cwd、agent/status 是 scoped 事件、SessionId 导出包错；7 步开源管道（Contents API 绕过 git 协议）；PR#127 被 review 4 项修复后合并；6 条开源清单（README 安装流程、dsh.bundle.patch 声明、patch 不写 credentials、包名不用占位 scope、中英文 README、单行 description）

## [2026-08-16] ingest: 实体抽象 vs 规则抽象

- 归档《实体抽象 vs 规则抽象》至 sources/entity-vs-rule-abstraction.md（微信公众号：木鱼脑壳在，2026-08-16）
- 无配图（纯文字短文）
- 内容摘要：读Cordis论文《A Programming Paradigm for Spatiotemporal Composability》(北大+DeepSeek)的心得——拆干净的两条数学条件（时间上逆序复原、空间上依赖声明自动配好），"干净"不是物理还原而是观感等价；核心对比pi抽象"实体"（组装好的电脑）vs dsh抽象"规则"（怎么组电脑），维度差一阶（下棋规则vs一枚棋子）；最终判断框架"维度高是可能性大不是能力大，能力=可能性×落地质量"，"够用顺手拆得开比参数好看更重要"

## [2026-08-14] ingest: 高强度用了一天 Deepseek Harness 有兴奋有悲伤

- 归档《高强度用了一天 Deepseek Harness 有兴奋有悲伤》至 sources/one-day-dsh-experience.md（微信公众号：nigo，2026-08-14）
- 12 张配图（安装界面、Web UI、插件安装、迁移过程、Token 用量、WorkBuddy 对比等）— 已去广告段和广告图（原 14 张，删掉课程二维码 2 张）
- 内容摘要：高强度使用 DSH 一天的体验——兴奋点：长时任务跑一天用 deepseek v4 flash 处理 6 亿 token，缓存命中 100%，opencode go 订阅月仅需 30 元（用量仅 3%），dsh 中 flash 效果可比 glm 5.2；悲伤点：同事用 WorkBuddy 发现 skill 管理分发、office 实时操作等功能齐备，感觉自己的系统白写了，随时可能被大厂功能替代；建议学通用 AI Agent 工具"学会手动档再会自动档"

## [2026-08-17] ingest: DSH 插件推荐清单

- 归档《DSH 插件推荐清单：DeepSeek Harness 必装的 14 个插件》至 sources/dsh-plugin-recommendations.md（微信公众号：AI 架构师，2026-08-17）
- 无配图（纯文字列表短文）
- 内容摘要：14 个 DSH 必装插件分三梯队——第一梯队基础能力（ModLens识图、@引用文件、粘贴拖拽、Office读写、内嵌浏览器、桌面操作）；第二梯队体验增强（插件自动查找、任务看板全家桶、图表渲染、一键回退、消息编辑）；第三梯队进阶玩法（多Agent协作、跨会话记忆、模型故障切换、飞书机器人）；插件索引github.com/topics/dsh-plugin已收录1000+

## [2026-08-18] ingest: [Alan の手札] Pi-vs-dsh (DeepSeek-Harness) 全方位技术对比

- 归档《[Alan の手札] Pi-vs-dsh (DeepSeek-Harness) 全方位技术对比》至 sources/pi-vs-dsh-alan.md（微信公众号：Alan Hsu，2026-08-18）
- 6 张配图（架构流图、Cordis论文图、上下文压缩策略、Cordis effect、选型决策树）
- 内容摘要：32项技术维度全景对比——Pi 5包monorepo(500文件) vs DSH 50+包(8600文件)，Pi固定Agent Loop vs DSH Agent Loop也是插件，Pi生命周期钩子 vs Cordis 4种类型化事件(emit/waterfall/parallel/serial)，Pi人可读纯文本压缩 vs DSH回放安全surface替换，Pi手动清理退出 vs Cordis effect自动逆序撤销+inject依赖追踪，Pi 0.028美元/任务 vs DSH暂无基准；结论"不是替代是分化，Pi用Agent干活vs DSH造Agent给别人用"

## [2026-08-18] ingest: Hello Harness 04 · Model Provider 抽象

- 归档《Hello Harness 04 · Model Provider 抽象》至 sources/hello-harness-model-provider.md（微信公众号：一灰灰blog，2026-08-18）
- 3 张配图（架构图、运行 Demo）
- 内容摘要：Hello Harness 系列第4章，第一次真正的架构抽象——定义与Provider无关的Model接口（generate+stream），将OpenAI实现收进src/model/openai.ts，应用层index.ts不再import OpenAI SDK；核心收获：可换（换Provider只需换实现文件）、可读（应用层干净）、可测（FakeModel不联网跑通）、可演进（Agent Loop挂Model接口上）；引入的新代价：每个Provider都要写样板实现、接口只有一个实现时说服力不足、错误类型仍裸着

## [2026-08-18] ingest: AI时代对抗软件规模与复杂度的战争：救命、治病、养生（下篇）

- 归档《AI时代对抗软件规模与复杂度的战争：救命、治病、养生（下篇）》至 sources/ai-complexity-war-part2.md（微信公众号：茹炳晟+AI，2026-08-18）
- 无配图（纯文字长文）
- 内容摘要：茹炳晟2023年三段论框架在AI时代的重心迁移——救命：可解释性真空+配置漂移导致定位变难，AI灭火器反而更依赖确定性裁判；治病：AI理解是统计性非因果性，分工原则"AI做可验证理解，人做不可验证判断"；养生：治理对象从人扩展到模型约束，新增"驾驭系统维护"预算项和"驾驭债"指标，养生份额应比80%更高；核心警句"AI时代复杂度治理的失守发生在'暂停养生'的决定里"

## [2026-08-18] ingest: GPT-5.6 之后，Superpowers 可以卸载了

- 归档《GPT-5.6 之后，Superpowers 可以卸载了》至 sources/superpowers-uninstall.md（微信公众号：意琦行 / 探索云原生，2026-08-18）
- 4 张配图（封面、工作流对比图、SVG数据图表×2）
- 内容摘要：GPT-5.6 Sol出现后Superpowers等通用AI编程Skill的价值下降；Comet Native模式（0.4.0-beta.7）去掉OpenSpec+Superpowers，仅保留Shape/Build/Verify/Archive四阶段，思路"过程放松结果收紧"；官方96次实验结果：pass@3均100%但Native总Token降76.8%、成本降75.1%、Agent轮次减半；核心观点"通用Skill被模型和Runtime内化，垂直Skill（私有知识/专属执行能力/业务边界）才能长期保留"

## [2026-08-03] ingest: 从进程到进程组：Linux 组调度背后的公平性重构

- 归档《从进程到进程组：Linux 组调度背后的公平性重构》至 sources/linux-group-scheduling.md（微信公众号：程序员学习随笔，2026-08-03）
- 5 张配图（内核结构图和代码流程图）
- 内容摘要：Linux组调度解决多用户场景下进程公平≠用户公平的问题，基于CFS扩展sched_entity（my_rq指针区分进程/进程组）和task_group（per-CPU调度实体+运行队列），实现两层调度（组间分配→组内分配）和树形分层；核心递归逻辑pick_next_task_fair用do-while循环从根队列逐层选择直到叶子进程，CFS核心算法零改动；机制与策略分离（内核只按组分配，用户态定义分组维度）

## [2026-08-17] ingest: Hello Harness 03 · Streaming 流式输出

- 归档《Hello Harness 03 · Streaming 流式输出》至 sources/hello-harness-streaming.md（微信公众号：一灰灰blog，2026-08-17）
- 4 张配图（含2张GIF转PNG）
- 内容摘要：Agent Harness 流式输出实践，将模型输出从 Promise 换成 `AsyncIterable<ModelEvent>` 异步迭代器；核心抽象 `ModelEvent` 判别联合（content 增量事件 + usage 收尾事件），是第15章完整 Event System 的最小种子；感知延迟从"总生成时间"降为"首token时间"；可观察性升级（首token/总耗时/token用量量化可见）；新架构引入的事件判别/错误处理/类型膨胀等问题为下一章 Model Provider 抽象铺路

## [2026-08-17] ingest: 从零搭建 Harness——三个 Skill 打造懂你的 Agent

- 归档《从零开始，搭建你的 Harness，定制化懂你的 Agent》至 sources/harness-three-skills.md（微信公众号：空格丶，2026-08-17）
- 9 张配图（第8张无法下载）
- 内容摘要：SpaceZephyr 开源三个 Harness 相关 Skill——star-your-harness（从零搭建目录骨架，问四问题后生成含CLAUDE.md/上下文/记忆/协议/工具五层结构）、better-your-harness（五层体检：安全隐私/上下文质量/工具装备/记忆学习，产出34项HTML报告+修复提示词）、view-your-harness（可视化工作台，文件按文档/代码/数据/图片分类卡片墙+Skill管理）；核心理念——"有了属于自己的 Harness，不管换什么 Agent 都能无缝衔接"

## [2026-08-16] ingest: Web 出海之反查网站作者的其他站和 sitemap 游戏监控站

- 归档《Web 出海之反查网站作者的其他站和 sitemap 游戏监控站》至 sources/web-haichuang-pinterest.md（微信公众号：独元殇，2026-08-09）
- 1 张配图
- 内容摘要：AI Web 出海实操笔记——Pinterest 引流（精准流量、审美参考）；反查网站作者的其他站（PubSpy 通过 Adsense pub 编号反查 + sitedata 查推广历史）；游戏词跟踪 sitemap 选站（群友 humphrey 分享）

## [2026-08-16] ingest: 你以为是你在拍板——真拍板完整版

- 归档《你以为是你在拍板：假拍板与真拍板（完整版）》至 sources/假拍板-完整版.md
- 无配图
- 内容摘要：完整拆解三种假拍板（情绪/模型/人群），真拍板三问（依据说得清/反问扛得住/撤回条件有），做/看/不三格安置方法，20分钟清假拍板执行流程；关键洞察——闷声发财的本质是"把拍板权攥在自己手里"

## [2026-08-16] ingest: 你以为是你在拍板——三种假拍板

- 归档《你以为是你在拍板：情绪、模型、人群，三个替你签字的东西》至 sources/假拍板.md（微信公众号：袁锐钦，2026-08-11）
- 无配图
- 内容摘要：假拍板比不拍板更危险——情绪/模型/人群三个替签者；真拍板三问（依据说得清/反问扛得住/撤回条件有）；做/看/不三格安置；20分钟清假拍板执行流程；作者自曝"人群拍板无法撤回"是推翻AI初稿后补

## [2026-08-16] ingest: AgentScope Java 2.0 Workspace——大脑外化

- 归档《AgentScope Java 2.0 工作区Workspace —— "大脑外化"》至 sources/AgentScope-Workspace.md（微信公众号：一灰灰blog，2026-07-31）
- 4 张配图（2 JPEG + 2 WebP）
- 内容摘要：AgentScope Java 2.0 Workspace 机制深度拆解，核心范式"代码定义Agent→文件定义Agent"，AGENTS.md定义人格/MEMORY.md沉淀记忆/两层记忆架构（日记本+整理笔记）/三次LLM调用流水线/每轮推理重新加载文件/迭代速度从周级别到秒级别

## [2026-08-16] ingest: AI Video 产品竞品调研报告

- 归档《AI Video 产品竞品调研报告》至 sources/AI-Video竞品调研.md（微信公众号：Corly，2026-08-15）
- 3 张配图
- 内容摘要：30+产品AI视频赛道全景调研，11种产品形态拆解，"健身房模式"（无限套餐=概率生意），核心结论"模型是成本，工作流才是商品，成片才是价值"，"画布负责复杂度，Agent负责降低复杂度，表单负责转化率"，电商复刻和AI短剧是最先工业化的两个场景

## [2026-08-16] ingest: 月入万刀周报

- 归档《【周报1.19】一个创业 10 年的程序员，走上了一人开发之路，月入万刀》至 sources/月入万刀.md（微信公众号：Corly，2026-01-19）
- 2 张配图
- 内容摘要：大厂10年创业4次的程序员辞职一人公司首月复盘，MRR逼近1万美金，核心观点"正反馈>计划"、"个体开发者应从用户需求出发"、"编程已进入不看代码只看结果的奇点时代"、"套壳价值被严重低估"

## [2026-08-16] ingest: 26年的回乡文学——关于AI的思考

- 归档《26年的回乡文学——关于AI的思考》至 sources/回乡文学关于AI的思考.md（微信公众号：Corly，2026-02-26）
- 无配图
- 内容摘要：20年互联网从业者的春节回乡冷静观察，核心观点包括"代码是日抛的但思想不是"、"编程不再是文本编辑行为"、"Agent是过渡品终局是大厂平台内嵌"、"AI不能替代人类思考（概率≠智慧）"、"工具不是命运"

## [2026-08-16] ingest: SEO 出海速成指南

- 归档《SEO 出海速成指南》至 sources/SEO出海速成指南.md（微信公众号：Corly，2026-02-28）
- 无配图
- 内容摘要：15分钟出海SEO速成，7步路线图（基础准备→关键词→开发上线→三方对接→发布运维→提升排名→坐等收钱），核心公式SEO排名→自然流量→转化→变现，强调AI可替换开发环节、跑通10-20站即可规模化收入

## [2026-08-16] ingest: AI创业半年复盘

- 归档《AI创业半年复盘：从1万美元到5万美元，从一个人到5个人》至 sources/AI创业半年复盘.md（微信公众号：Corly，2026-08-06）
- 3 张配图
- 内容摘要：AI SaaS 独立站半年 bootstrap 复盘，MRR 从 1 万→5 万美元，团队 1→5 人，技术路径从 Agent 探索到"Agent+Workflow+控制层"智能工作流方案，行业判断"AI 创业不晚"，核心感悟"认知>技术"

## [2026-08-16] ingest: 独立开发选品避坑指南

- 归档《独立开发选品避坑指南：如何选对方向，尽快赚到第一个美金》至 sources/独立开发选品避坑指南.md（微信公众号：Corly，2026-01-21）
- 4 张配图（3 PNG，1 JPEG）
- 内容摘要：创业 10 年程序员独立开发选品实战指南，三阶段路线（新热点小工具→聚合站→品牌站），案例 Nano Banana/Viddo/Medeo，强调"先活下来再谈理想"，核心目标是赚到第一个美金验证付费假设

## [2026-08-16] ingest: 如何在一天里重启你的人生

- 归档《如何在一天里重启你的人生》至 sources/一天重启人生.md（微信公众号：Corly，2026-01-18，外网阅读量破亿）
- 无配图
- 内容摘要：从目的论心理学、控制论和心智层级三个视角拆解改变失败的根本原因，提供一套一天人生重置协议（反向审计→愿景/反愿景→目标层级与约束），核心观点"所有行为都有无意识目标，真正的改变需要先改变视角再改变行为"

## [2026-08-16] ingest: 2025 年，我在 AI 独立站出海追过的所有风口

- 归档《2025 年，我在 AI 独立站出海追过的所有风口》至 sources/ai-独立站出海复盘.md（微信公众号：Corly，2026-01-16）
- 无配图
- 内容摘要：AI 独立站出海从业者全年风口复盘，核心结论"风口是窗口期而非趋势"，时间线覆盖推理模型(1月)→Sora 2(10月)→卖课迭代(Prompt/Agent/Workflow/Skill)→Manus被Meta收购，最终观点"独立站是做资产不是追概念"

## [2026-08-16] ingest: 创业半年回顾

- 归档《创业半年回顾》至 sources/创业半年回顾.md（微信公众号：出海那些事，2025-08-16）
- 11 张配图（8 张 JPEG，3 张 PNG）
- 内容摘要：北京10年网赚/AI软件从业者辞职创业半年复盘，记录了AI产品（聊天/音乐/数字人）市场遇冷、副业踩坑（抖音小游戏/网盟广告/小程序被割）、最终转向软件外包的心路历程

## [2026-08-11] ingest: 花 1 万积分、熬一个通宵，我整理了教育场景下所有 AI Skills

- 归档《花 1 万积分、熬一个通宵，我整理了教育场景下所有 AI Skills》至 sources/edu-skills-catalog.md（希希说AI，2026-08-06）
- 9 张配图（3 张压缩 JPEG，6 张 PNG）
- 内容摘要：Skills = Agent 的动态能力，像手机 App + 标准化 SOP。作者通宵整理教育场景 100 个 Skills、11 大功能分类（备课与课程设计/课堂教学/记忆与学习科学/评估与批改/读写与学科技能/教研与论文/班级与学生身心/AI 素养/治理与决策/内容创作/学伴与通识）。实战案例：Course-designer 一句话生成 16 页数学教学设计 Word 文档，Teachany-interactive-courseware 生成生物光合作用互动网页课件

## [2026-08-11] ingest: 程序员必备的 Design Skills，不要让 UI 成为产品短板

- 归档《程序员必备的 Design Skills，不要让 UI 成为产品短板》至 sources/design-skills-programmer.md（数字边界 EdgeX，2026-03-17）
- 9 张配图（全 PNG，无需压缩）
- 内容摘要：程序员 UI 设计四大阶段对应 Skills：① 无设计图（Taste Skill + UI UX Pro Max）从 0 生成 ② 存量优化（UI Skills + UI Design Brain）统一规范 ③ 有设计图（Impeccable + Vercel Web Design Guidelines）提高还原度 ④ 自动化（Anthropic frontend-design + stitch-skills + Designer Skills Collection）规模化复用。按角色给出 Skill 组合建议：独立开发者/非前端工程师/初级前端/高级前端/技术负责人

## [2026-08-11] ingest: 8 个优质的设计 Skills 解决 AI 设计难题

- 归档《8 个优质的设计 Skills 解决 AI 设计难题》至 sources/design-skills-eight.md（rico，2026-03-17）
- 8 张配图（6 JPEG + 1 PNG + 1 WebP）
- 内容摘要：8 个 Design Skills 分四大类。创意方向：Anthropic Frontend Design（95k Stars，禁止 Inter/Roboto/紫白配色，四维度思考目的/基调/约束/差异化）、Impeccable（17 个设计命令 /polish/audit/distill/enhance/refine）、Taste Skill（4 子技能：taste/redesign/output/soft，让东西看起来昂贵）。设计智能：UI UX Pro Max（43K Stars，50+ UI 风格/97 调色板/57 字体搭配/99 UX 指南/25 图表类型，无障碍第一）、UI Design Brain（60+ 组件最佳实践库，5 种设计风格，反模式库）。质量合规：UI Skills（15 个专项 skills，fixing-accessibility/fixing-metadata/fixing-motion-performance/12-principles-of-animation）。工程模式：Designer Skills（63 skills/27 命令，8 大设计领域）、UX Researcher Designer（23K Stars，用户研究方法论/可用性测试/信息架构）

## [2026-08-11] ingest: 发现一个好用的 AI 设计 Skill：baoyu-design

- 归档《发现一个好用的 AI 设计 Skill：baoyu-design》至 sources/baoyu-design-skill.md（AI 探索，2026-06-17）
- 无配图
- 内容摘要：baoyu-design 是 Agent Skill 而非网页工具，可生成 UI 设计稿/原型/线框图/落地页/Dashboard/移动 App/PPT/动画视频/自包含 HTML。核心产物是可编辑的本地文件。亮点：动画逐帧拍照导出 MP4（headless Chrome + ffmpeg），比录屏更稳定可复现。安装：npx skills add JimLiu/baoyu-design，支持指定 claude-code/cursor/codex Agent

## [2026-08-11] ingest: 逆向 Claude Design：huashu-design 深度解析

- 归档《逆向 Claude Design：huashu-design 深度解析》至 sources/huashu-design-deep-dive.md（Agent 工程化，2026-04-21）
- 1 张配图（PNG）
- 内容摘要：huashu-design（花叔 Design，Alchain）深度解析。四大核心机制：品牌资产协议（5 步硬流程，稳定性提升 5 倍）、设计方向顾问（5 流派×20 种设计哲学）、Junior Designer 工作流（4 轮迭代）、反 AI Slop 规则。源码分析：SKILL.md（56KB 规则引擎）、animations.jsx（Stage+Sprite 动画引擎）、deck_stage.js（1920×1080 Web Component）、render-video.js（Playwright 两阶段录制架构）。技术亮点：16 条动画踩坑实录、Tweaks 实时变体系统、5 维度专家评审、跨 Agent 兼容设计

## [2026-08-11] ingest: 当 AI 出图引爆设计圈，huashu-design 直接掀翻了设计交付链

- 归档《当 AI 出图引爆设计圈，huashu-design 直接掀翻了设计交付链》至 sources/huashu-design-workflow.md（有料黑科技，2026-04-22）
- 8 张配图（1 PNG + 7 压缩 JPEG）
- 内容摘要：huashu-design 定位为「交付型设计 skill」，HTML 作为中间层解决 4 个结构性断裂：格式断裂（直出 prototype/deck/PPTX/MP4/GIF/PDF）→ 上下文断裂（吃真实品牌资产）→ 方向断裂（先给 3 个方向再选路）→ 责任断裂（增强人的工作流而非伪装全自动）。与常见设计 AI 工具区别：结果终点从视觉结果变为工作流产物

## [2026-08-11] ingest: 网站上线前，先用这个免费工具做一次 SEO 体检

- 归档《网站上线前，先用这个免费工具做一次 SEO 体检》至 sources/seo-audit-tool.md（苏打 da 汽水，2026-07-13）
- 2 张配图（全 PNG，无需压缩）
- 内容摘要：哥飞社群分享的 On Page SEO 体检工具 seo.web.cafe/audit/。输入 URL+关键词自动选出聚焦度最高的主关键词做体检，分三组检查：关键词覆盖（Title/Description/H1/H2/URL/开头100词）、页面基础项（Meta/内容质量/关键词优化/链接/图片/结构化数据/抓取）、页面状态数据（状态码/加载耗时/词数/内外链/语言）。适合页面和 pSEO 批量上线前轻量自查。支持「复制报告给 AI」让 Agent 自动改一版

## [2026-08-11] ingest: 独立开发者的网页杂活，可以交给这款免费 Agent 浏览器

- 归档《独立开发者的网页杂活，可以交给这款免费 Agent 浏览器》至 sources/ego-lite-browser.md（苏打 da 汽水，2026-07-05）
- 4 张配图（全 PNG，无需压缩）
- 内容摘要：Ego Lite（citrolabs/ego-lite）免费 Agent 浏览器工作台。基于 Chromium，可导入 Chrome 设置/Cookie/扩展/历史记录，解决 Agent 登录态问题。核心功能 Space 将人和 Agent 工作区分隔，支持并行多任务。Semantic Snapshot 压缩页面 Token。Benchmark：抓取 X 账号近 7 天主帖 81.8s vs Agent Browser 282.9s（快 3.5 倍）。适合增长动作/后台巡检/上线前检查三类场景

## [2026-08-11] ingest: 一个让独立产品更正规的免费小功能：Cloudflare 域名邮箱转发

- 归档《一个让独立产品更正规的免费小功能：Cloudflare 域名邮箱转发》至 sources/cloudflare-email-routing.md（苏打 da 汽水，2026-06-28）
- 2 张配图（全 PNG，无需压缩）
- 内容摘要：Cloudflare Email Routing 免费域名邮箱转发服务。前提：有域名并在 Cloudflare 管理。Workers Free 计划免费使用。限制：每域名 200 条 routing rules、每账号 200 个 destination addresses、单封 25MiB。配置步骤：Onboard Domain → 添加 Destination Address → 验证 Gmail → 创建 routing rule → 测试。重要限制：只能收信转发，回复时发件人仍是 Gmail

## [2026-08-11] ingest: 做海外产品推广，可以先把这个外链表跑一遍

- 归档《做海外产品推广，可以先把这个外链表跑一遍》至 sources/mkdollar-backlinks.md（苏打 da 汽水，2026-06-18）
- 4 张配图（全 PNG，无需压缩）
- 内容摘要：MkDollar（mkdollar.com）外链提交管理工具，适合出海产品/AI 工具/SaaS/工具站。整理一批可提交产品的网站，标注 DR/Traffic/Pricing/Dofollow/Account/Category。筛选支持 Free + Dofollow 组合过滤。管理功能：Dashboard 输入产品域名自动拉取信息，产品详情页跟踪外链状态（Unknown/Submitted/Approved/Rejected）

## [2026-08-11] ingest: 独立开发者必收藏：带 Prompt 的 AI 图库，省掉创意难题

- 归档《独立开发者必收藏：带 Prompt 的 AI 图库，省掉创意难题》至 sources/ai-image-prompt-libraries.md（苏打 da 汽水，2026-06-07）
- 5 张配图（4 JPEG + 1 PNG，无需压缩）
- 内容摘要：AI 图灵感库合集（mkimage.ai/meigen.ai/gpt-image2.canghe.ai），形态：图片瀑布流+分类筛选。每张图关键信息：Prompt（可复制）、出处（可追踪）、模型信息、License 说明。CC BY 4.0 协议可商用需注明来源。meigen.ai 特色：Prompt 一键翻译中文。三步用法：找创意→拿 Prompt 微调→生成放入页面。小技巧：把候选图丢给 Coding Agent 生成预览 HTML 页面批量比对主题色

## [2026-08-11] ingest: 我把 Claude 官方教师 Skill 装进了自己的备课系统

- 归档《我把 Claude 官方教师 Skill 装进了自己的备课系统》至 sources/claude-teacher-skill.md（李小祖逸，2026-08-08）
- 12 张配图（7 张压缩 JPEG，5 张 PNG）
- 内容摘要：Anthropic 公开 K-12 教师 Skill（k12-lesson-planning + k12-lesson-differentiation）到 GitHub。安装后在 WorkBuddy 上为七年级生物「生物与非生物」备课，一套 Skill 生成 3 份 Word（教案/学生讲义/观察模板），第二套生成 4 份（分层方案+A/B/C 三组材料），合计 7 份关联文件。三个教学判断：① AI 备课不能只靠万能模板，要按学科调用教学原则 ② 差异化应改变支持而非降低目标 ③ AI 生成材料需出厂检验

## [2026-08-11] ingest: 超详细！Matt Pocock 的 Skills 到底应该怎么用

- 归档《超详细！Matt Pocock 的 Skills 到底应该怎么用》至 sources/matt-pocock-skills-use.md（LC，2026-07-12）
- 18 张配图（全 PNG，无需压缩）
- 内容摘要：Matt Pocock Skills 完整使用流程演示，以 Hermes 项目为例。覆盖 8 个核心 Skill：setup-matt-pocock-skills（配置）→ ask-matt（建议）→ teach（分课教学）→ grill-with-docs/grill-me（问答澄清需求）→ to-prd（输出需求文档）→ to-issues（拆分 Issue）→ implement（实现+测试）→ handoff（交接文档）。注意原始 to-issues Skill 会自动 commit，需删掉自动提交命令描述

## [2026-08-11] ingest: 做事的原则与决策基础

- 归档原创整理《做事的原则与决策基础》至 sources/decision-principles.md
- 无配图
- 内容摘要：两种决策依据——坚持只做正确的事（有积累有价值的长远之事）vs 做眼前利益最大的事（收割短期收益）。建议经济实力不允许时二者兼顾，财务自由后应以80%以上精力做正确的事。强调底线不可丢，短期妥协但长期方向不能偏

## [2026-08-11] ingest: 关于努力——成长、投资与自我修养

- 归档原创整理《关于努力——成长、投资与自我修养》至 sources/on-effort-and-growth.md
- 无配图
- 内容摘要：关于努力、成长与自我修养的随笔集。涵盖短板理论（成就由最强能力决定，发挥程度由最弱能力决定）、外练筋骨内练一口气、战术勤奋 vs 战略懒惰、最好的投资是投资自己、深度思考比浅薄努力更重要、大学教育中的价值取向与自由选择、面子与创业的五个阶段、习惯养成与做减法

## [2026-08-11] ingest: 刘守英毕业典礼致辞

- 归档刘守英《以个人的确定性应对世界的不确定性》人大经院毕业典礼致辞至 sources/certainty-in-uncertain-world.md
- 无配图
- 内容摘要：以个人确定性应对世界不确定性。在自己心中藏一块高地；以机会而非成本给自己定价；对认定了的事情要较真；靠伎俩或计谋走不了太远；扩大眼界是一辈子的事情

## [2026-08-11] ingest: 学习的飞轮效应：思维模型与高效学习

- 归档原创整理《学习的飞轮效应：思维模型与高效学习》至 sources/learning-flywheel.md
- 无配图
- 内容摘要：学习即逻辑推理，知识通过深度思考和思维模型训练相互打通，形成学习促进思维模型完善、思维模型完善促进高效学习的良性飞轮效应

## [2026-08-11] ingest: 面向对象/JVM内存/并发编程综合笔记

- 归档原创整理《面向对象/JVM内存/并发编程综合笔记》至 sources/java-oop-jvm-concurrency.md
- 无配图
- 内容摘要：综合技术笔记涵盖面向对象编程思想、JVM 内存模型（堆/栈/方法区/元数据区、新生代/老年代 GC）、并发编程（线程与进程/并行与并发/同步与异步）、管程模型（MESA/Hasen/Hoare）、Lock 接口实现（AQS/CLH 队列）、ThreadLocal 原理、接口吞吐量优化方案

## [2026-08-11] ingest: 自学方法论全指南

- 归档《如何自学一个领域？这里有一份全指南》至 sources/self-study-guide.md
- 内容摘要：系统性自学方法论，7层框架（框架→概念→网络→主题→迁移→模型→更新），涵盖搭框架、概念澄清、知识网络构建、主题聚焦、知识迁移、模型创造、持续更新，附常见问题与建议

## [2026-08-11] ingest: 程序设计思想与思维养成

- 归档原创整理《哲学之思——程序设计思想与思维养成》至 sources/programming-philosophy-thoughts.md
- 无配图
- 内容摘要：程序设计与思维养成哲学。4w 模型（what/why/when/how）、写代码=逻辑推演、够用原则（一半思考一半编码）、程序员需学的八门学科（物理/化学/生物/历史/文学/建筑/艺术/经济）、记忆提取与线索依赖遗忘、编程范式即世界观与方法论、泛型/元编程/切面/事件驱动范式、State Machine 与 Tree 的编程本质、AOP 三种实现、Controller 参数校验（JSR303/@Valid）、4w 应用、学习即学历史

---

## [2026-08-15] ingest: 陈以强 Agent Flow 到 AI Native

- 归档《从 Agent Flow 到 AI Native：为什么通用 Agent 是「饮鸩止渴」》微信公众号至 sources/agent-flow-vs-general.md
- 下载 4 张配图至 images/agent-flow-vs-general/
- 内容摘要：Agent Flow（symphlo）用自然语言描述目标、LLM 生成/修改/运行 Flow 编排多个 Node（QwenWork/Codex CLI/影刀/千牛等）；核心观点：通用 Agent 不是恰当目标，用户要的是确定地、可靠地完成复杂任务；Hardcode 在 LLM 时代是美丽的（代码维护者变成 LLM，if else 比抽象工厂更容易理解）；AI Native 本质是解决问题让用户付费，不是贴 AI 皮；基建和权限要 LLM-friendly，组织链路要足够短

## [2026-08-15] ingest: 希里安 Agent Sandbox

- 归档《Agent Sandbox：K8s SIG 沙箱编排项目》微信公众号至 sources/agent-sandbox-k8s.md
- 无配图
- 内容摘要：kubernetes-sigs/agent-sandbox 项目，声明式 CRD 编排隔离有状态单例沙箱，WarmPool 预热池 + RuntimeClass 接 gVisor/Kata，Agent 执行层基础设施

---

## [2026-08-15] ingest: Linux 中断管理概述

- 归档《Linux 中断管理概述》微信公众号至 sources/linux-interrupt-overview.md
- 下载 5 张配图至 images/linux-interrupt-overview/
- 内容摘要：顶半部/底半部分层架构；三大底半部机制（Softirq/Tasklet/Workqueue）：Softirq 不可休眠执行极快用于网络收发，Tasklet 基于 Softirq 同类型串行执行是驱动开发便捷接口，Workqueue 运行在进程上下文允许休眠适合磁盘 IO；核心原则：顶半部必须原子操作极速返回，只有底半部允许复杂进程调度

---

## [2026-08-15] ingest: teach skill（Matt Pocock）

- 归档《Teach Skill——一个好用的教学 Skill》至 sources/teach-skill.md
- 下载 1 张配图至 images/teach-skill/
- 内容摘要：Matt Pocock 的 teach skill，将 AI 从「百科全书式应答器」转化为「有状态的学习教练」；持久化教学空间（MISSION.md/RESOURCES.md/learning-records/NOTES.md/lessons/reference）；前置动机澄清环节；递进式课时 + 可验证预测题；将动机理论/间隔重复/检索练习/支架式教学封装为可复用 Agent Skill

---

## [2026-08-15] ingest: 认知债与意图债（聂晓龙）

- 归档《当理解成为瓶颈：AI 编程时代的认知债与意图债》至 sources/cognitive-intent-debt.md
- 下载 9 张配图至 images/cognitive-intent-debt/
- 内容摘要：三元债模型（技术债/认知债/意图债），AI 降低技术债但加速认知债与意图债累积，理解的本质是为了参与（Geoffrey Litt），Vibe Coding 的自我修正（95%开发者需额外修正），Agentic Engineering 替代 Vibe Coding，「你可以外包你的思考，但不能外包你的理解」

---

## [2026-08-15] ingest: 批量采集 3 篇（网络/内核/SEO）

- **网络数据包传输** → sources/packet-network-flow.md（xiaokang1998）：分包、封装（Encapsulation）、TCP/IP 四层数据流、各层头部结构（5 张配图）
- **task_struct 进程管理** → sources/linux-task-struct-process.md（往事敬秋风）：进程标识/状态/调度/内存/文件/亲缘关系六类字段，fork 创建与僵尸进程，CFS 调度器核心，面试五问
- **SEO 索引闸门策略** → sources/seo-index-gate-strategy.md（袁锐钦）：AI 扩候选 + 人工四问闸门，五格判断表，版本词与近义词铺页策略

---

## [2026-08-15] ingest: AI Infra 进阶 大模型输出确定的结果

- 归档腾讯程序员《AI Infra 进阶：如何让大模型输出确定的结果》至 sources/llm-batch-invariance.md
- 下载 36 张配图至 images/llm-batch-invariance/
- 内容摘要：GEMM/RMSNorm/Attention/NCCL 四大算子的 Batch Invariance 实现；根因是浮点加法不满足结合律 + 动态组批导致 Reduction Tree 拓扑变化；vLLM 解决方案：GEMM 固定 BLOCK_K+禁用 Split-K、RMSNorm 锁定 block_size=1024、FlashAttention 强制 num_splits=1、NCCL 固定 Tree+Simple+Channel=1

---

## [2026-08-15] ingest: 批量采集 LLM/Agent 基础系列（4 篇）

- **LangGraph** → sources/langgraph-agent-framework.md：LangChain 官方低阶 Agent 编排框架（33,900+ Stars），图结构编排 + Checkpointer + HITL + 子图，vs AutoGen/CrewAI 对比
- **Function Calling** → sources/function-calling-mechanism.md：工具调用三步流程（判断/执行/回传），Schema 定义，finish_reason 详解，多工具多轮循环
- **LLM Chat Completion API** → sources/llm-chat-completion-api.md：LLM 生成文本本质（预测下一个 token），messages 角色体系，Token 与上下文窗口
- **DeepSeek API 多轮对话** → sources/deepseek-api-call-multiturn.md：环境准备、OpenAI 兼容调用、对话循环，最基础的「记忆」
- 配图：4 张（仅最后一篇有 2 张）

---

## [2026-08-15] ingest: 微软开源 AutoGen 多智能体框架

- 归档《微软开源 AutoGen：让 AI Agent 真正「对话起来」的多智能体框架》微信公众号至 sources/microsoft-autogen-multagent.md
- 无配图
- 内容摘要：微软研究院开源 Multi-Agent 框架（GitHub 36k+ Stars，MIT 协议），核心抽象「对话即代码」；ConversableAgent 万物皆可对话，GroupChat 团队协作；v0.4 async-first 完全重写，actor 模型+事件驱动+分布式运行时；与 LangGraph（状态图/确定性流程）/CrewAI（角色任务/快速原型）对比；实战场景：代码生成+评审、论文写作、客服系统、数据分析

---

- 归档用户分享的 Claude Design + Baoyu-Design Skill 工作流至 sources/baoyu-design-workflow.md
- 内容摘要：先原型后功能，原型与功能保持一致的工作流。Claude Design 产出 React 代码和 JSON，通过 git diff 追踪版本变更，Agent 参考 diff 实现功能。Baoyu-Design Skill 维护原型

## [2026-08-09] ingest: PPT Skill 7 项目实测对比

- 归档《PPT Skill 哪家强？实测 GitHub 上 7 个热门项目》微信公众号至 sources/pptskill-comparison.md
- 下载 8 张配图至 images/pptskill-comparison/
- 内容摘要：同一篇文章交给 7 个 PPT Agent Skill 并行生成，盲评 PPT Master 第一（76/80），open-kimi 第二（75/80），Bento 第三（71.5/80）。覆盖原生 PPTX、PPTD、单 HTML 三种格式

## [2026-08-09] ingest: DeerFlow Dynamic Workflow 开源复刻

- 归档《Harness 101：复刻 Dynamic Workflow（含代码）》飞书文档至 sources/deerflow-dynamic-workflow.md
- 内容摘要：Dynamic Workflow 是模型针对当前任务临时编写的 JavaScript 脚本，结合程序稳定性与 Agent 灵活性。Deer Workflow 开源自研 TypeScript 实现，支持 Codex CLI/Claude 双 Agent Runtime，提供 Journaled Replay 断点续接

## [2026-08-09] ingest: Codex 创造力工作流

- 归档《拥有创造力的人，就像是一只边牧》微信公众号至 sources/codex-creativity-workflow.md
- 下载 41 张配图至 images/codex-creativity-workflow/
- 内容摘要：非设计背景作者用 Codex 一个月干完大半年活——品牌视觉统一、20 个 Skill 兵工厂、微信读书/Notion/Cubox 集成、Agent 替甲方开会、职业规划 Agent、企业管理 Agent。核心观点：Codex 让人类像边牧一样，有灵感就停不下来

## [2026-08-08] ingest: opencode-ralph-loop 插件原理

- 归档 GitHub 仓库 opencode-ralph-loop 原理分析文至 sources/opencode-ralph-loop.md
- 内容摘要：自指完成循环（Ralph Loop）的工程实现，零依赖单文件插件。核心是 Agent 承担完成判断责任，通过 `<promise>DONE</promise>` XML 信号规约，插件只做检测信号、注入延续提示、管理状态三件事。两种激活模式（命令驱动 / ebuilder 自动检测）、JSON 状态持久化、inFlight Set 竞态保护、session_id 隔离，含 6 张 Mermaid 架构图

## [2026-08-08] ingest: AdSense 审计 Skill

- 归档 web.cafe 帖子《adsense 审计 skill》至 sources/adsense-site-auditor.md
- 下载 1 张配图至 images/adsense-site-auditor/
- 内容摘要：AdSense 审计 Skill 的用法 Prompt 集合，五种审计场景（完整审计/仅线上/仓库+线上/拒审诊断/修复后复审），逐项检查 ADS-* 要求
- 新增 patterns/adsense-site-auditor.md

## [2026-08-08] ingest: Loop Engineering 深度思考

- 归档《对 Loop Engineering 的思考》吕昊俣公众号（腾讯云开发者）至 sources/loop-engineering-thoughts.md
- 下载 21 张配图至 images/loop-engineering-thoughts/
- 内容摘要：五代工程演进（Prompt→Context→Harness→Loop→Graph），控制论四大公理映射，吴恩达三个环，Loop 五大组件（Automations/Worktrees/Maker-Checker/Connectors/Memory），TDD 作为反馈信号，三种方法让模型说"不"（TDD/证据链/预算思维），小闭环起步原则
- 新增 concepts/loop-engineering-thoughts.md

## [2026-08-08] ingest: HarnessAgent 声明式策略

- 归档《从源码拆解 AgentScope Java 2.0 的 HarnessAgent：声明式策略统一管理 Skill/MCP/@Tool/SubAgent》唐成公众号至 sources/agentscope-harnessagent-declarative.md
- 无配图
- 内容摘要：HarnessAgent 用组合/委托而非继承把裸 ReActAgent 升级为生产级，四种资源统一抽象（Skill/MCP/@Tool/SubAgent），声明式注册+中间件治理，MCP 六步权限评估管线，静态 vs 动态分层（Skill>SubAgent>MCP），注意"自助创建与自助发现"的缝隙
- 新增 concepts/agentscope-harnessagent-declarative.md

## [2026-08-08] ingest: AgentScope 2.0 Managed Agents

- 归档《专为 Managed Agents 而生的 Harness 底座：AgentScope 2.0》刘军公众号至 sources/agentscope-managed-agents.md
- 下载 10 张配图至 images/agentscope-managed-agents/
- 内容摘要：Brain/Hands 分离架构，Harness 责任从业务开发者转移到平台，Anthropic 三层递进（CLI→SDK→Managed），三种 Worker 模式（Local/Cloud Sandbox/Self-hosted），控制面/数据面/Worker 三层职责，AgentScope 2.0 作为 Managed Agents 运行时底座
- 新增 concepts/agentscope-managed-agents.md

## [2026-08-08] ingest: DeepSeek V4 Flash + OMP/Pi 配置

- 归档《换掉 Claude Code，DeepSeek V4 Flash + OMP / Pi 太丝滑了！》小G 公众号至 sources/deepseek-v4-omp-pi.md
- 下载 9 张配图至 images/deepseek-v4-omp-pi/
- 内容摘要：DeepSeek V4 Flash 正式版四项 Agent 基准超 V4 Pro Preview，原生 Responses API + 内置联网搜索，OMP 和 Pi 均已内置 provider 无需手写配置，极低价格，环境变量配置即用
- 新增 concepts/deepseek-v4-omp-pi.md

## [2026-08-08] ingest: AgentScope Skills 技能系统

- 归档《AgentScope Skills 技能系统：Agent 的"上下文链接器"》一灰灰blog 公众号至 sources/agentscope-skills.md
- 下载 3 张配图至 images/agentscope-skills/
- 内容摘要：Skills = Agent 世界的动态链接器，四步加载（符号表→重定位→加载→卸载），SkillRepository 对标 LD_LIBRARY_PATH（四种来源+优先级覆盖），Tool 动态可见性，SKILL.md 文件协议，确定性协处理器（概率计算→确定性执行）
- 新增 concepts/agentscope-skills.md（AgentScope 系列第8篇）

## [2026-08-08] ingest: 后端架构 AI Friendly

- 归档《后端架构 AI Friendly 的标准与路径：面向无人值守开发时代的系统重构》刘瑞洲公众号至 sources/ai-friendly-backend.md
- 下载 10 张配图至 images/ai-friendly-backend/
- 内容摘要：AI Friendly = 建设「可被智能体维护的系统」，六类事实层（架构/服务/领域/接口/数据/运行），四大产物（Architecture Map/Service Card/领域模型/SKILL），Harness 七层安全轨道，测试从防人出错升级为约束 AI，分级权限 L0-L5，架构即代码，三阶段演进（Copilot→Coworker→Operator黑灯工厂），11 步可落地 Roadmap
- 新增 concepts/ai-friendly-backend.md

## [2026-08-07] ingest: Agent 本质万字长文

- 归档《【万字】Agent 的本质：用 Token 换架构》叶小钗公众号至 sources/agent-token-architecture.md
- 下载 7 张配图至 images/agent-token-architecture/
- 内容摘要：Agent vs Workflow 核心取舍（Token 换架构简洁度），三年技术脉络（ReAct→FC→MCP→Skills），Function Calling/MCP/Skills 技术详解，ReAct 与 CoT 关系
- 新增 concepts/agent-token-architecture.md

## [2026-08-07] ingest: AI Coding 方法论

- 归档《【万字】Gemini 到底能不能杀死程序员？聊聊 AI 编程》叶小钗公众号至 sources/gemini-ai-coding.md
- 下载 44 张配图至 images/gemini-ai-coding/
- 内容摘要：自然语言编程时代，AI 编程六步方法论（需求拆解→架构→提示词→迭代→集成→部署），TRAE 案例实操，工具选择维度，AI 编程局限性（数据边界+ROI 过低）
- 新增 concepts/ai-coding-methodology.md

## [2026-08-07] ingest: 腾讯 Agent Memory

- 归档《别再让每个 Agent 从零学习了，腾讯开源了一套团队记忆中枢》TJ 公众号至 sources/tencentdb-agent-memory.md
- 下载 4 张配图至 images/tencentdb-agent-memory/
- 内容摘要：TencentDB Agent Memory v2.0.0，四类资产（Chat Memory/Skill/Wiki/CodeGraph），L0-L3 分层记忆，Memory Hub 治理，对接 Claude Code
- 新增 concepts/tencentdb-agent-memory.md

## [2026-08-07] ingest: 阿里云 AgentLoop Skill 评估

- 归档《基于阿里云 AgentLoop 的 Skill 评估与优化最佳实践》钟玟公众号至 sources/agelloop-skill.md
- 下载 15 张配图至 images/agelloop-skill/
- 内容摘要：Skill 评估优化六步闭环（创建→可观测→离线评估→Bad Case 优化→迭代验证→发布），8 维评估体系，Skill+Harness 双线策略，CMS 运维 Skill 真实调优案例
- 新增 concepts/agelloop-skill.md

## [2026-08-08] ingest: CF Worker CPU Time

- 归档《AI长文章总是生成一半，到底是哪里出了问题？》小拾公众号至 sources/cf-worker-cpu-limit.md
- 无配图
- 内容摘要：Cloudflare Workers 免费版 CPU Time 限制导致 AI 流式输出中断，排查与解决（Worker 主链路拿掉、Chunk 合并）
- 新增 concepts/cf-worker-cpu-limit.md

## [2026-08-08] ingest: B2C 转化思路

- 归档《学会国外爆卖B2C转化思路，帮你提升独立站下单转化率》小拾公众号至 sources/b2c-conversion.md
- 无配图
- 内容摘要：拆国外 B2C 竞品网站的七个转化套路（标题卖情绪/卖点写用户所得/为什么选你/语气舒服/现在买理由/尺寸指南/信任证据），先模仿再创新
- 新增 concepts/b2c-conversion.md

## [2026-08-08] ingest: Codex Security

- 归档《OpenAI开源的这个安全插件，是每个Vibe Coding的人都必装的神器》数字生命卡兹克公众号至 sources/codex-security.md
- 下载 24 张配图至 images/codex-security/
- 内容摘要：Codex Security（原 Aardvark）开源，AI 安全研究员自动扫描漏洞/验证/补丁，三种接入方案，214 文件检出 21 个安全问题，成本与交叉扫描建议
- 新增 concepts/codex-security.md

## [2026-08-08] ingest: 哥飞 SEO 关键词教程

- 归档《【哥飞SEO教程】先收集关键词，再规划网站结构》哥飞公众号至 sources/gefei-seo-keywords.md
- 下载 6 张配图至 images/gefei-seo-keywords/
- 内容摘要：关键词优先的网站结构规划（多入口收词→补搜索量→清理词表→意图分组→URL 清单→人工删减→先做 5-10 页），4 个常见坑
- 新增 concepts/gefei-seo-keywords.md

---

## [2026-08-07] ingest: AgentScope 收尾篇

- 归档《搭一个企业级 Agent 平台（六·收尾）：扩展生态，以及如果我来做 3.0 会怎么清债》唐成公众号至 sources/agentscope-finale.md
- 无外部图片
- 内容摘要：扩展生态治理（SPI 收口方案）、5 处双轨债 3.0 清理方案（附版本时间表）、P0-P3 上生产决策地图（可勾选 checklist + 选型决策树）
- 新增 concepts/agentscope-finale.md

---

## [2026-08-07] ingest: AgentScope 多 Agent 编排

- 归档《搭一个企业级 Agent 平台（五）：多 Agent 编排——spawn、超时晋升、跨副本路由》唐成公众号至 sources/agentscope-multi-agent.md
- 下载 2 张配图至 images/agentscope-multi-agent/
- 内容摘要：多 Agent 编排三件套——spawn/send 原语、超时收编后台任务（不丢弃）、子事件并入父流、跨副本三段式路由（live+registry+materialize）
- 新增 concepts/agentscope-multi-agent.md

---

## [2026-08-07] ingest: Agent 的本质（用 Token 换架构）

- 归档《【万字】Agent 的本质：用 Token 换架构》叶小钗公众号至 sources/agent-token-architecture.md
- 下载 7 张配图至 images/agent-token-architecture/
- 内容摘要：Agent 本质是用 Token 成本换架构简洁度（控制流从开发期迁移到运行时），技术脉络 ReAct→FC→MCP→Skills，记忆模块仍是老大难
- 新增 concepts/agent-token-architecture.md

---

## [2026-08-07] ingest: AgentScope 治理子系统

- 归档《搭一个企业级 Agent 平台（四）：治理——权限、停机、事件流》唐成公众号至 sources/agentscope-governance.md
- 下载 2 张配图至 images/agentscope-governance/
- 内容摘要：权限六步管线（独立引擎+固定顺序+HITL+DONT_ASK）、优雅停机三原则（先存后断+阶段边界+按requestId）、统一事件流（31种typed event+CustomEvent逃生舱）
- 新增 concepts/agentscope-governance.md

---

## [2026-08-07] ingest: AgentScope 分层架构

- 归档《AgentScope Java 2.0 源码拆解：分层的艺术》唐成公众号至 sources/agentscope-layering.md
- 下载 3 张配图至 images/agentscope-layering/
- 内容摘要：AgentScope 三层架构（无状态 ReAct 内核/组合式外壳/18 类扩展），洋葱 4 点+管道 1 点中间件，HarnessAgent 委托 ReActAgent，112 处 @Deprecated 双轨债，7 条工程铁律
- 新增 concepts/agentscope-layering.md，更新 concepts/agentscope-enterprise-platform.md 交叉引用

---

## [2026-08-07] ingest: 企业级 Agent 平台工程外壳

- 归档《搭一个企业级 Agent 平台（三）：工程外壳——workspace、沙箱、skill》唐成公众号至 sources/agentscope-enterprise-shell.md
- 下载 1 张配图至 images/agentscope-enterprise-shell/
- 内容摘要：AgentScope Java 2.0 工程外壳拆解——workspace 文件化角色/记忆/技能、沙箱 SPI + 状态持久化、skill 自学习闭环，含坑点（命令级安全、跨副本锁）
- 新增 concepts/agentscope-enterprise-platform.md，更新 harness-engineering 概念页引用

---

## [2026-08-07] ingest: 招聘信息商业模式分析

- 归档《把 BOSS 直聘当免费的商业模式数据库》公众号至 sources/boss-business-model.md
- 下载 1 张配图至 images/boss-business-model/
- 内容摘要：用招聘信息反向推断公司商业模式——岗位类型暴露获客/销售/交付模式，横向对比 20+ 公司拼出行业地图，含局限性交叉验证
- 新增 concepts/boss-business-model.md

---

## [2026-08-07] ingest: SDIO 总线硬件原理

- 归档《小白也能懂——SDIO总线：硬件原理篇》公众号至 sources/sdio-bus-hardware.md
- 下载 3 张配图至 images/sdio-bus-hardware/
- 内容摘要：SDIO 总线硬件原理全面科普——SD 家族区分、引脚定义、1-bit vs 4-bit 模式、命令帧格式、上电初始化时序、硬件设计踩坑合集
- 新增 concepts/sdio-bus.md

---

## [2026-08-07] ingest: 互斥锁演化史

- 归档《互斥锁是如何一步步被发明出来的？》xiaokang1998 公众号至 sources/mutex-evolution.md
- 下载 4 张配图至 images/mutex-evolution/
- 内容摘要：从 count++ 竞态条件出发，推导互斥锁演化路径——关中断→Peterson算法→原子指令→自旋锁→互斥锁→读写锁，含死锁四条件
- 新增 concepts/mutex-evolution.md

---

## [2026-08-07] ingest: 循环工程实践指南

- 归档《一份不靠你亲自上阵的循环工程实践指南》ThinkInAI 公众号至 sources/loop-engineering-practice-guide.md
- 下载 3 张配图至 images/loop-engineering-practice-guide/
- 内容摘要：loop-engineering 框架完整技术拆解——6 步递归目标周期、6 原语、7 个核心模式、CLI 工具链、安全与故障模式
- 更新 concepts/loop-engineering.md 添加框架实现细节

---

## [2026-08-07] ingest: 哥飞SEO基础

- 归档《【SEO基础】哥飞跟大家聊聊 HTTP 协议、互联网、爬虫和外链》微信公众号至 sources/seo-basics-http-crawlers-backlinks.md
- 下载 6 张配图至 images/seo-basics-http-crawlers-backlinks/
- 内容摘要：哥飞科普 HTTP 协议、互联网、爬虫、外链四个基础概念，解释为什么各 SEO 平台外链数据不一致，以及为什么 AI 搜索不自建爬虫

---

## [2026-07-23] indie-hub-gefei-keyword ingest

- **Source**: 哥飞AI社群 (new.web.cafe/chat)
- **Images**: 无外部图片
- **Content**: SEO找关键词方法论：9渠道穷尽（谷歌下拉/相关搜索/Similarweb/Semrush/Ahrefs/趋势/平台下拉/Ads/竞品反查）+ 7步评估筛选 + 跨平台数据对齐（Ads规划工具为准）+ AI辅助网站规划
- **Patterns**: [[SEO]] [[关键词研究]] [[KDROI]] [[内容营销]] [[AI辅助建站]]

---

## [2026-07-23] indie-hub-gefei-game-site-guide ingest

- **Source**: 哥飞AI社群 (new.web.cafe/chat)
- **Images**: 无外部图片
- **Content**: 游戏站完整操作指南：什么是游戏站/为什么入门/收入参考/找词方法/三种建站方式/页面布局/两种策略/变现/部署/常见坑
- **Patterns**: [[游戏站SEO]] [[Adsense]] [[iframe嵌入]] [[域名策略]] [[Cloudflare Pages]]

---

## [2026-07-23] indie-hub-gefei-game-site-advanced ingest

- **Source**: 哥飞AI社群 (new.web.cafe/chat)
- **Images**: 无外部图片
- **Content**: 游戏站深度补充：找词三阶段/Sitemap监控/Google Trends API/外链策略/游戏资源获取(CMS/模拟器/原生代码)/广告变现/程序化SEO警告/极速上线案例
- **Patterns**: [[游戏站SEO]] [[找词自动化]] [[外链策略]] [[游戏CMS]] [[程序化SEO]]

---

## [2026-07-23] indie-hub-gefei-game-site-phase2 ingest

- **Source**: 哥飞AI社群 (new.web.cafe/chat)
- **Images**: 无外部图片
- **Content**: 游戏站深度补充阶段二：Adsense养号/Blank冠军SOP Similarweb找词/结果季军域名抢注+大站账号矩阵外链/广告布局最佳姿势
- **Patterns**: [[游戏站SEO]] [[Adsense养号]] [[Similarweb找词]] [[域名抢注]] [[外链策略]]

---

## [2026-07-23] indie-hub-seo-game-site ingest

- **Source**: 哥飞AI社群 (new.web.cafe/chat)
- **Images**: 无外部图片
- **Content**: 游戏站SEO建设FAQ：平台选择(itch.io/Newgrounds)、版权注意(大厂游戏不能碰)、iframe外链问题、域名策略(单游戏单域名vs聚合站)、快速上手路线(iframe+Cloudflare Pages)
- **Patterns**: [[游戏站SEO]] [[iframe嵌入]] [[版权]] [[域名策略]] [[Cloudflare Pages]]

---

## [2026-07-19] indie-hub-anthropic-plugins ingest

- **Source**: Anthropic官方知识工作插件集开源 (X帖)
- **Content**: Anthropic knowledge-work-plugins（16k Stars），11个插件（销售/客服/产品/营销/财务/数据/法务/生物研发+3个通用），连HubSpot/Snowflake/Figma，Cowork+Claude Code两套，全markdown可自定义
- **Patterns**: [[Anthropic]] [[Claude]] [[Knowledge Work Plugins]]

---

## [2026-07-22] indie-hub-website-launch ingest

- **Source**: [网站上线后24小时之内马上要做的事情是什么？](https://mp.weixin.qq.com/s/AoaSCinIab1nssNNqI7jQw) (SlowGrowth.慢速生长)
- **Images**: 9张 → `images/indie-hub-website-launch/`
- **Content**: 网站上线24小时四链路（可访问/可统计/可发现/可追踪）：外部检查/GSC验证/sitemap提交/Bing接入/GA4配置，IndexNow加速发现，不保证收录只保证入口
- **Patterns**: [[网站上线]] [[SEO]] [[GSC]] [[IndexNow]] [[GA4]]

---

## [2026-07-22] indie-hub-tdd-diagnosing ingest

- **Source**: [用户报Bug，Agent立刻猜根因？Matt Pocock这2个skill把它拉回正轨](https://mp.weixin.qq.com/s/kefeCAyFKRtpCOQ0_wDc-A) (运维有术)
- **Images**: 4张 → `images/indie-hub-tdd-diagnosing/`
- **Content**: Matt Pocock diagnosing-bugs六阶段调试（red-capable command入场券/falsifiable假设/correct seam）+ tdd核心（Seam缝合线/Pre-agreed seam/红绿循环），反馈信号是Agent速度上限
- **Patterns**: [[Matt Pocock]] [[diagnosing-bugs]] [[TDD]] [[red-capable command]]

---

## [2026-07-21] indie-hub-computer-data ingest

- **Source**: [图解：计算机中的数据表示与存储系统](https://mp.weixin.qq.com/s/_87UlR8TDzE1cOZAIk1odA) (Debug 蟹老板)
- **Images**: ⚠️ 125MB太大，push阻塞，仅推送了md文本，图片需重新下载压缩后再归档
- **Content**: 计算机数据表示与存储：二进制/十进制/十六进制，位权计数法，原码/反码/补码，IEEE 754浮点数，ASCII/Unicode字符编码，存储层次，大小端
- **Patterns**: [[二进制]] [[补码]] [[IEEE 754]] [[ASCII]] [[大小端]]

---

## [2026-07-21] indie-hub-grill-with-docs ingest

- **Source**: [还在用grill-me？Matt Pocock建议grill-with-docs](https://mp.weixin.qq.com/s/Yia6XDvAkw8ygjRXFmPmgg) (运维有术)
- **Images**: 5张 → `images/indie-hub-grill-with-docs/`
- **Content**: Matt Pocock grill-with-docs：两个原语（grilling追问+domain-modeling落字），CONTEXT.md术语表（glossary only），ADR三条门槛（Hard to reverse/Surprising without context/Real trade-off），四反模式（过早记录/术语过多/写成spec/代码漂移）
- **Patterns**: [[Matt Pocock]] [[grill-with-docs]] [[CONTEXT.md]] [[ADR]] [[术语对齐]]

---

## [2026-07-21] indie-hub-forex-basics ingest

- **Source**: [外汇交易基础概念：货币对、点差、汇率、直盘、交叉盘、外汇保证金等](https://mp.weixin.qq.com/s/HAZiRj953OpPT1IxFoT4uw) (光速白眉)
- **Images**: 无外部图片
- **Content**: 外汇交易基础：货币对（基础货币/报价货币）、直盘vs交叉盘、点差（Bid/Ask）、汇率（浮动/固定）、保证金（Margin/追保/强平）、滑点（负滑点/正滑点/限价单）
- **Patterns**: [[外汇交易]] [[货币对]] [[点差]] [[保证金]] [[滑点]]

---

## [2026-07-21] indie-hub-codex-eat-pc ingest

- **Source**: [Codex 吞掉了浏览器，下一口是整台电脑](https://mp.weixin.qq.com/s/AYlYfVp_dSPuHM589rgrHw) (成峰)
- **Images**: 6张 → `images/indie-hub-codex-eat-pc/`
- **Content**: Atlas死了但Agent能力活在Codex里，阅读起点从「打开资料」变「审核结果」，四个标签页Codex一次读完，AgentOS雏形：Agent App = Agent + 工具 + Skills + 上下文
- **Patterns**: [[Codex]] [[AgentOS]] [[Atlas]] [[浏览器]]

---

## [2026-07-21] indie-hub-git-worktree ingest

- **Source**: [一个人如何管理几十个AI程序员？](https://mp.weixin.qq.com/s/zxjYSGzgEoDyrcpdupEQ-w) (刘小排)
- **Images**: 6张 → `images/indie-hub-git-worktree/`
- **Content**: Git Worktree管理多AI程序员：分支管路线Worktree管现场，五种情况（main直改/只开分支/同分支多Worktree/分支+Worktree/全矩阵），独立开发者三条建议（拆任务/地基先于功能/当产品经理）
- **Patterns**: [[Git Worktree]] [[AI并行开发]] [[Agent管理]]

---

## [2026-07-20] indie-hub-dontbesilent ingest

- **Source**: [dontbesilent 平时怎么用 Codex？我分析了他的 534 个会话](https://mp.weixin.qq.com/s/9DRoXsv4fu1S1496ML4-uQ) (dontbesilent)
- **Images**: 无外部图片
- **Content**: dontbesilent四层工作体系（任务/工作流/方法/系统），534会话分析，短Prompt+厚环境设计，SOURCE_OF_TRUTH.md，Skill真源治理，递归改进（用Codex改造Codex），个人AI组织
- **Patterns**: [[Codex]] [[Skill治理]] [[知识真源]] [[Agent组织]] [[递归改进]] [[dontbesilent]]

---

## [2026-07-19] indie-hub-agentic-rl ingest

- **Source**: [长程Agent训练九best practices](https://mp.weixin.qq.com/s/joyd7o0cCbiuIvoE0tsV8A) (若飞/JiaGouX)
- **Images**: 3张 → `images/indie-hub-agentic-rl/`
- **Content**: 长程Agent训练三循环（执行/学习/治理），九项实践：可验证边界选任务/可重置环境/完整轨迹保存/奖励拆分四本账/失败分六类/验证器对抗化/Horizon渐进/轨迹带版本/监控TemplateCollapse，五份合同
- **Patterns**: [[Agentic RL]] [[长程Agent]] [[Harness]] [[Template Collapse]]

---

## [2026-07-19] indie-hub-d2 ingest

- **Source**: [专为程序员打造的画图神器，斩获 24k Star](https://mp.weixin.qq.com/s/SOztOQf-Sch3v_yNfFOsuA) (韩数同学)
- **Images**: 5张 → `images/indie-hub-d2/`
- **Content**: D2声明式图表工具（terrastruct/d2，24.7k Stars），专为程序员设计，代码代替拖拽，支持流程图/时序图/ER图，19种主题，AI友好语法
- **Patterns**: [[D2]] [[声明式图表]] [[架构图]]

---

## [2026-07-19] indie-hub-7-xhs-skills ingest

- **Source**: 小红书图文卡片Skill七剑客清单 (X帖)
- **Content**: 7个小红书Skill完整管线：baoyu-skills(16k)×48组合/BLCaptain(35版式)/Viral Writer(审核100%)/xhs-content(调研5h→几分钟)/Qianjin(长文拆6平台)/henry-ai(三平台互转)/Qiaomu(海报)
- **Patterns**: [[小红书运营]] [[Codex Skills]] [[内容创作]]

---

## [2026-07-19] indie-hub-10-content-skills ingest

- **Source**: 一人顶个编辑部：中文创作最强10个Skill (归藏X帖)
- **Content**: 中文内容创作TOP10 Skill排名，marketingskills(32.4k)/guizang-ppt-skill(17.3k)/Humanizer-zh(9.9k)/awesome-gpt-image-2(7.3k)/anything-to-notebooklm(5.1k)/guizang-social-card-skill(3.6k)/oh-story-claudecode(2.4k)/wewrite(2.3k)/Youtube-clipper-skill(2k)/Deep-Research-skills(1.1k)，累计8万+Stars
- **Patterns**: [[Codex Skills]] [[内容创作]] [[guizang-ppt-skill]] [[Humanizer-zh]]

---

## [2026-07-19] indie-hub-7-content-skills ingest

- **Source**: 自媒体人必看，7个Skill从选题到交付全搞定 (X帖)
- **Content**: 7个Codex Skills：Agent Reach(选题)/opencli(资料搜集)/cheat-on-content(爆款判断)/ljg-plain(白话表达)/guizang-social-card(封面)/ian-xiaohei-illustrations(IP配图)/kami(文档交付)
- **Patterns**: [[Codex Skills]] [[内容创作]] [[选题]] [[封面设计]]

---

## [2026-07-19] indie-hub-loop-engineering-pro-con ingest

- **Source**: [Loop Engineering，应该赞成还是反对？](https://mp.weixin.qq.com/s/Jt3YDLxcygO7xO0B2IOdjw) (若飞/JiaGouX)
- **Images**: 3张 → `images/indie-hub-loop-engineering/`
- **Content**: Loop Engineering有条件赞成：73.2%人跟随AI错误建议（Cognitive Surrender），任务准入四条件（目标清楚/可验证/可撤回/长期维护），控制面写进协议，规则变更要慢于执行Loop，四步上线（复盘→影子→候选→低风险）
- **Patterns**: [[Loop Engineering]] [[Cognitive Surrender]] [[Harness]] [[渐进放权]]

---

## [2026-07-19] indie-hub-two-traffic-words ingest

- **Source**: [两个流量暴涨的词](https://mp.weixin.qq.com/s/u1bZA6fpQ1CImxRaQGtUsg) (小拾)
- **Images**: 3张 → `images/indie-hub-two-traffic-words/`
- **Content**: Google Trends发现两个流量暴涨词：palworld 1.0 breeding guide、doki doki dialog generator，GitHub有开源可研究包装
- **Patterns**: [[流量挖掘]] [[Google Trends]] [[独立开发]]

---

## [2026-07-19] indie-hub-tech-lead-ai ingest

- **Source**: [AI 编程：未来只需要 Tech Lead 级别的开发人员](https://mp.weixin.qq.com/s/toVFeAdLqxQjzs2w0c1dCA) (少个分号)
- **Images**: 1张 → `images/indie-hub-tech-lead-ai/`
- **Content**: AI编程时代团队结构变化：金字塔→扁平，初中级开发被替代，Tech Lead不可替代（架构设计/需求拆解/跨团队沟通），未来最值钱的是会跟AI协作+做技术决策的人
- **Patterns**: [[Tech Lead]] [[AI编程]] [[团队结构变化]] [[初级开发被替代]]

---

## [2026-07-18] indie-hub-cowrite ingest

- **Source**: [Cowrite 上线，给 Codex 装上可视化创作工作台](https://mp.weixin.qq.com/s/sRL8J9l_iejTwH83hYqXUQ) (数字生命卡兹克)
- **Images**: 12张 → `images/indie-hub-cowrite/`
- **Content**: Cowrite 可视化写作工作台，封装10+ Skill成GUI，配图/排版/PPT/飞书发布，支持Claude Code/Workbuddy
- **Patterns**: [[Cowrite]] [[Codex Skill]] [[可视化写作工具]] [[飞书CLI]]

---

## [2026-07-17] indie-hub-architecture-diagram ingest

- **Source**: [又一个神级画图Skill开源，再见draw.io！](https://mp.weixin.qq.com/s/WtBGpFuCxUfEZd2YjdTXEw) (梦想de星空)
- **Images**: 10张 → `images/indie-hub-architecture-diagram/`
- **Content**: architecture-diagram-generator（6.3k+ Stars）画架构图Skill + process-flow-diagram-generator画流程图，支持Cursor/Claude Code/Windsurf，HTML输出内置导出
- **Patterns**: [[架构图生成]] [[流程图生成]] [[Claude Code Skill]] [[draw.io替代]]

---

## [2026-07-15] indie-hub-xiaohongshu-workbench ingest

- **Source**: [GitHub - xiaohongshu-ai-workbench](https://github.com/nihe0909/xiaohongshu-ai-workbench) (王梦珂X帖)
- **Content**: 小红书运营AI工作台，6个Codex Skills（suite/title/profile/topic-planner/comment-reply/conversion-path）
- **Patterns**: [[小红书运营]] [[Codex Skills]] [[内容运营]] [[个人IP]]

---

## [2026-07-15] indie-hub-agentic-loop ingest

- **Source**: [Agentic Loop：三个循环](https://mp.weixin.qq.com/s/RbMg_AXzOTtf3tcQnoThzQ) (Robert Ross)
- **Images**: 1张 → `images/indie-hub-agentic-loop/`
- **Content**: Agent三个循环：推理循环（调用LLM API）、工具循环（执行工具调用）、人类循环（审批/拒绝工具调用），Temporal解决持久化问题
- **Patterns**: [[Agentic Loop]] [[推理循环]] [[工具循环]] [[人类循环]] [[agentic-engineer]]

---

## [2026-07-15] indie-hub-pm-skills-rebuild ingest

- **Source**: [用完全网最火的PM Skills，我决定把163个Skill推倒重做](https://mp.weixin.qq.com/s/TPbC9HPDvx-fGujacY7hcQ) (空格丶)
- **Images**: 13张配图 → `images/indie-hub-pm-skills-rebuild/`
- **Content**: Skill 2.0体系：Plugin/Command/Skill/Hooks四层，pm-skills案例，skill-plugin-architect工具
- **Patterns**: [[Skill 2.0]] [[Plugin]] [[Command]] [[Hooks]]

## [2026-07-15] indie-hub-feishu-agent-os ingest

- **Source**: [7个案例把飞书用作Agent的操作系统](https://mp.weixin.qq.com/s/rDcT6xFqHAkNUzwDuC5tBA) (空格丶)
- **Images**: 13张配图 → `images/indie-hub-feishu-agent-os/`
- **Content**: 7个案例：AAMP协议/Bridge/HyperFrames/GEO诊断等，飞书作为Agent操作系统
- **Patterns**: [[飞书]] [[Agent操作系统]] [[AAMP协议]]

## [2026-07-15] indie-hub-onepod-skills ingest

- **Source**: [小宇宙播客也能转文章了！开源OnePod全套Skills](https://mp.weixin.qq.com/s/kRrTqdWHmMV5yb7vrQ6Mww) (空格丶)
- **Images**: 10张配图 → `images/indie-hub-onepod-skills/`
- **Content**: OnePod 6个Skill开源：youtube-feed/字幕提取/内容提炼/主控编排/口播脚本/小宇宙转文章
- **Patterns**: [[OnePod]] [[播客转文字]] [[Skill编排]] [[Loop Engineering]]

## [2026-07-15] indie-hub-loop-engineer ingest

- **Source**: [开始Loop Engineer之前，请先把loop、hook、goal用好](https://mp.weixin.qq.com/s/RWs-wFHYwtyC43-RehoJDw) (空格丶)
- **Images**: 10张配图 → `images/indie-hub-loop-engineer/`
- **Content**: loop/hook/goal三大能力详解+实践案例，Loop Engineering完整6模块
- **Patterns**: [[Loop Engineering]] [[hook机制]] [[goal驱动]]

## [2026-07-15] indie-hub-social-media-skill ingest

- **Source**: [我用Agent Skill搭了一套社媒监控系统](https://mp.weixin.qq.com/s/1_ugBJwHEEPuLw_baP-0zQ) (空格丶)
- **Images**: 5张配图 → `images/indie-hub-social-media-skill/`
- **Content**: 社媒监控系统4个Skill：小红书账号分析/爆款搜索/公众号爆款/监控日报
- **Patterns**: [[社媒监控]] [[Agent Skill]] [[内容分析]]

## [2026-07-15] indie-hub-knowledge-mgmt-skills ingest

- **Source**: [50个知识管理Skill，帮你打造AI生产力系统](https://mp.weixin.qq.com/s/xU6T2GWL6TiFAFEwsfcgew) (空格丶)
- **Images**: 4张配图 → `images/indie-hub-knowledge-mgmt-skills/`
- **Content**: Read Buddy(19) + Design Buddy(19) + Creator Buddy(5) 三大Skill仓库，覆盖阅读→整理→创作全链路
- **Patterns**: [[知识管理]] [[AI生产力]] [[Skill系统]]

## [2026-07-15] indie-hub-obsidian-writing-skill ingest

- **Source**: [Obsidian入门40：把我的写作工作流Skill免费分享给你](https://mp.weixin.qq.com/s/26E9jSCWquHB1_efWTPBFQ) (林大友)
- **Images**: 9张配图 → `images/indie-hub-obsidian-writing-skill/`
- **Content**: wechat-writer（五角色写作天团）+ wechat-director（三步出图），双Skill系统，开源在 GitHub
- **Patterns**: [[Skill设计]] [[写作工作流]] [[多Agent协作]] [[checkpoint机制]]

## [2026-07-14] indie-hub-jason-ai-blogger ingest

- **Source**: [一人公司、半年营收百万，算法工程师转型AI博主全复盘](https://mp.weixin.qq.com/s/HAsP5MRk15x_WkrajRglQA) (游牧岛NEXT)
- **Images**: 14张配图 → `images/indie-hub-jason-ai-blogger/`
- **Content**: 算法工程师Jason转型AI博主之路，一年半探索+半年跑通MCN商业模式
- **Patterns**: [[数字游民]] [[一人公司]] [[MCN]] [[内容变现]] [[AI博主]]

## [2026-07-02] prompt-to-harness ingest

- **Source**: [从Prompt到Harness：一文看懂AI工程的四次跃迁](https://mp.weixin.qq.com/s/ERajPSZ6vG5LYqtLftfTfw) (瑜的安全谷)
- **Images**: 22 张配图 → `images/prompt-to-harness/`
- **Content**: 大模型应用发展四阶段（提示词工程→工具调用→上下文工程→Harness工程），Harness = Model + Harness，6大核心能力
- **Patterns**: [[harness-engineering]] — AI工程四次跃迁，Harness工程 = Agent的心脏

## [2026-06-26] codex-claude-shortcuts registered

- **Codex/Claude 快捷指令速查表** → 资源: [shangtianqiang.github.io/codex-claude-shortcuts](https://shangtianqiang.github.io/codex-claude-shortcuts/)
  - 67 条快捷指令，Win/Mac 双平台标注，支持中英文搜索过滤
  - 覆盖 Codex CLI 会话控制/任务代码/调试审查/沙箱文件/扩展UI，Claude Code 斜杠命令/终端快捷键/内联快捷键/Agent快捷方式

## [2026-06-26] loop-engineering-critique wiki-ingest

- **Source**: [Loop Engineering 批判：一个被过度炒作的技术名词](https://mp.weixin.qq.com/s/2HugtDY6FTAty4eTD6Tzag) (飞天闪客)
- **Images**: 15 张配图 → `images/loop-engineering-critique/`
- **Patterns**: [[loop-engineering-critique]] — Loop Engineering 溯源三波炒作（Boris→Peter→Addy），本质是定时任务包装，五组件框架缺陷分析，KOL 利益驱动下的技术名词膨胀现象
- **Note**: 核心洞察—看清词源，回归本质，比追逐新概念重要

## [2026-06-23] infinite-story-engine wiki-ingest

- **Source**: [我造了一台全自动烧 Token 的无限故事引擎](https://mp.weixin.qq.com/s/baWcDi2Q8_NNlRRuqe7zsw) (陌尘在长脑子里了)
- **Note**: Multi-agent 模拟驱动的无限故事引擎，互动小说 APP

## [2026-06-27] ai-programming-structured-requirements wiki-ingest

- **Source**: [大多数团队 AI 编程都卡在结构化需求上](https://mp.weixin.qq.com/s/jNCVsXmzDEG_TrKKZbmUZg) (少个分号)
- **核心洞察**: 需求颗粒度要大、结构化四要素、原型不可缺少、AI反讲验证

## [2026-06-27] seo-7-google-signals wiki-ingest

- **Source**: [Google SEO 7大排名信号](https://mp.weixin.qq.com/s/MxKBpXCoEs1pwRX1Ti5sqg) (SlowGrowth)
- **归档**: indie-hub 专栏 — Google已确认7大排名信号：反向链接/搜索意图/新鲜度/HTTPS/移动友好/加载速度/侵入广告

## [2026-06-26] ai-cross-border-ecommerce-research wiki-ingest

- **Source**: [莆、广系跨境电商独立站卖家AI细学手册](https://mp.weixin.qq.com/s/b8OZwmQ8u18UBQjkslweYQ) (GOD哥)
- **归档**: indie-hub 专栏 — 市场/用户/竞品/趋势四大研究框架，AI整合多平台商业情报

## [2026-06-25] skill-symlink-management 新增

- **Pattern**: [[skill-symlink-management]] — Skills 极客管理方式：软链接工作流，项目内安装而非全局，三步操作让 Agent 帮你干

## [2026-06-25] codex-content-creation-workflow 新增

- **Pattern**: [[codex-content-creation-workflow]] — Codex 中文内容创作者 10 个顶级 Skills，按内容生产线排序：选题/调研/写作/去AI味/封面/卡片/信息图/HTML

## [2026-06-25] content-arbitrage-pattern 新增

- **Pattern**: [[content-arbitrage-pattern]] — 跨境内容搬运套利，三招体系 + 一鱼五吃
- **归档**: indie-hub 专栏

## [2026-06-22] ai-productivity-not-website wiki-ingest

- **Source**: [核心不是网站而是利用 AI](https://mp.weixin.qq.com/s/SMeBQGzKviWWKFL-Ccmi1w) (zlbigger)
- **Pattern**: [[ai-productivity-tool-not-the-goal]] - AI是生产力工具，替换工作流，更快验证

## [2026-06-22] ai-website-passive-income wiki-ingest

- **Source**: [利用 AI 给自己做个网站给养老吧](https://mp.weixin.qq.com/s/rIu6Efw7m54FENXEvqtvyg) (zlbigger)
- **Pattern**: [[ai-agent-content-farm]] - AI Agent 内容农场，躺赚模式

## [2026-06-21] hidden-asset-inheritance wiki-ingest

- **Source**: [隐性资产传承](https://) (小鹅劳斯)
- **Pattern**: [[hidden-asset-inheritance]] - 金钱工具论、机会准备论、城市杠杆、隐性资产传承

## [2026-06-21] first-bucket-consumer-to-producer wiki-ingest

- **Source**: [第一桶金从消费者到生产者](https://) (小鹅劳斯视频文案)
- **Pattern**: [[first-bucket-consumer-to-producer]] - 第一桶金来自消费到生产的转变，任何一端形成优势实现套利

## [2026-06-21] ajie-money-not-important wiki-ingest

- **Source**: [对话阿杰|30岁以前，挣钱不重要](https://mp.weixin.qq.com/s/KbF1g3W0KF616jDaAfbUxQ) (小鹅/阿杰)
- **Pattern**: [[ajie-money-not-important]] - 信息来源>资金，项目选择三维，优秀创业者三特质

## [2026-06-21] five-days-near-dropout wiki-ingest

- **Source**: [退学边缘的五天里，我得到了一份让我复用终身的资产](https://mp.weixin.qq.com/s/_LMqkF7tJ1kiIZiTDIuLnQ) (小鹅劳斯)
- **Pattern**: [[five-days-near-dropout]] - 重大决策前多问，预见极端风险，短线思维的危害

## [2026-06-21] city-second-birth wiki-ingest

- **Source**: [换个城市，相当于二次投胎](https://mp.weixin.qq.com/s/oMY2FWh-ztDDLX-7Jd9QbA) (小鹅)
- **Pattern**: [[city-second-birth]] - 换个城市逃脱原生家庭惯性，选择新的人生算法

## [2026-06-21] private-domain-arrogance wiki-ingest

- **Source**: [我想不通，原来真的会有人讨厌挣钱…](https://mp.weixin.qq.com/s/2FxSbLu6KxntpKItu7EIsg) (小鹅劳斯)
- **Pattern**: [[private-domain-arrogance]] - 私域傲慢vs微商偏见，做好私域+社群的触达率和终身价值

## [2026-06-21] knowledge-payment-value wiki-ingest

- **Source**: [花了五千块学做公众号，感觉被套路了…](https://mp.weixin.qq.com/s/PtcJHya5nJg5N2VwLcktTA) (小鹅劳斯)
- **Pattern**: [[knowledge-payment-value]] - 知识付费三目的三坑，选课三层自我审视

## [2026-06-21] refutation-personality wiki-ingest

- **Source**: [注定贫穷的性格——反驳性人格](https://mp.weixin.qq.com/s/MnNS0M_qEa6PD2zDkUCARQ) (小鹅劳斯)
- **Pattern**: [[refutation-personality]] - 反驳性人格注定贫穷，先听逻辑再判断，保持空杯心态

## [2026-06-21] question-reveals-tier wiki-ingest

- **Source**: [问的每个问题，其实都在暴露你的段位](https://mp.weixin.qq.com/s/2abGj6OnqJAUGZGN66LMrQ) (小鹅劳斯)
- **Pattern**: [[question-reveals-tier]] - 结构化提问体现逻辑能力，问对问题比找到答案更重要

## [2026-06-21] ninth-month-recap wiki-ingest

- **Source**: [鹅的九月复盘](https://mp.weixin.qq.com/s/SvdCOX24wwAC5MnQrwgXbg) (小鹅劳斯)
- **Pattern**: [[ninth-month-recap]] - 解决问题的能力决定命运，超级个体必须学会外放

## [2026-06-21] social-intro-and-king-of-oneself wiki-ingest

- **Source**: [士为知己者死（上）](https://mp.weixin.qq.com/s/7nx6_Ga0JmDw1lfj_nXzrA) (小鹅劳斯)
- **Pattern**: [[social-intro-and-king-of-oneself]] - 向上社交艺术，自我介绍是关键，够用指数，多种种子

## [2026-06-21] income-structure-four-certainties wiki-ingest

- **Source**: [对话杨涛：知识付费防坑指南](https://mp.weixin.qq.com/s/Y8eDZI_ZO0YO0wonj8g_5w) (小鹅/杨涛)
- **Pattern**: [[income-structure-four-certainties]] - 收入结构要健康，四个确定性判断项目，望闻问切防坑

## [2026-06-21] money-shame-and-ai-tool wiki-ingest

- **Source**: [对话虎牙：年轻人，拒绝谈钱羞耻](https://mp.weixin.qq.com/s/uiiIYhAHyboBde9c1u4Zew) (小鹅劳斯对话虎牙)
- **Pattern**: [[money-shame-and-ai-tool]] - 拒绝谈钱羞耻，AI是工具不能神化，创业趁早试错成本低

## [2026-06-21] four-layer-filter wiki-ingest

- **Source**: [大多数人成不了事儿的原因，就一句话](https://mp.weixin.qq.com/s/Zl6UbmtN9KSKWQ-GI4k58A) (小鹅劳斯)
- **Pattern**: [[four-layer-filter]] - 看见→相信→动手→坚持，市场奖励通过四层筛选的人

## [2026-06-21] ai-writing-micro-business wiki-ingest

- **Source**: [最适合互联网新手的小项目——AI写作](https://mp.weixin.qq.com/s/2BC2eE1R-m-d_snkvz8wKA) (小鹅劳斯)
- **Pattern**: [[ai-writing-micro-business]] - AI写作市场洞察+知识付费筛选原则

## [2026-06-21] cannot-play-beyond-character wiki-ingest

- **Source**: [打不出来性格以外的球](https://mp.weixin.qq.com/s/JnXpVzhDjtsmGUPVGQnWLA) (王紫菜)
- **Pattern**: [[cannot-play-beyond-character]] - 具体问题都是性格投射，真正稀缺的是穿过性格那道坎

## [2026-06-21] investment-taste wiki-ingest

- **Source**: [投资中的品味&人的品性](https://mp.weixin.qq.com/s/Blv18YQ4oYsTYioS8JR5Dg) (张秋兴)
- **Pattern**: [[investment-taste]] - 品性>能力，靠谱是投资前置条件，大道至简

## [2026-06-21] single-threaded-imagination wiki-ingest

- **Source**: [退休么](https://mp.weixin.qq.com/s/1SAU9_Jgxa1NqVK1yJG9Pg) (王紫菜)
- **Pattern**: [[single-threaded-imagination]] - 单线程想象的未来经不起推敲，真正的生活远比想象复杂

## [2026-06-21] principles-are-cheap wiki-ingest

- **Source**: [道理重要，还是赚钱重要？](https://mp.weixin.qq.com/s/iynfTqFzUmfm2p5NkQz1Nw) (王紫菜)
- **Pattern**: [[principles-are-cheap]] - 道理在哪都是最廉价的，赢了道理输了感情

## [2026-06-21] trust-quantifiable wiki-ingest

- **Source**: [再谈信任](https://mp.weixin.qq.com/s/yjtMOv0gFZ0D656uVISQ4Q) (王紫菜)
- **Pattern**: [[trust-quantifiable]] - 信任可以量化，有衡量标准，有极强的复利

## [2026-06-21] cognition-outside-money wiki-ingest

- **Source**: [认知外的钱](https://mp.weixin.qq.com/s/uGiNnlw6ykNQQaRi4Itbjw) (王紫菜)
- **Pattern**: [[cognition-outside-money]] - 无法赚到认知以外的钱，面对看不懂的机会先别急着下结论

## [2026-06-21] below-iceberg wiki-ingest

- **Source**: [我为什么更愿意聊冰山之下的内容](https://mp.weixin.qq.com/s/cvYc1GAagyAj3jOZMJPKZw) (王紫菜)
- **Pattern**: [[below-iceberg-thinking]] - 冰山之下是底层逻辑，认知差比执行更重要，信任是核心资产

## [2026-06-21] shenzhen-tennis-court wiki-ingest

- **Source**: [在深圳做了两片网球场](https://mp.weixin.qq.com/s/ZJTzgh6wC7jfp2I4ZAa3YA) (王紫菜)
- **Pattern**: [[execution-speed-trust]] - 执行速度，信任破裂立即切割，世界奖励积极主动的人

## [2026-06-21] no-mate-worship wiki-ingest

- **Source**: [不要乱拜码头](https://mp.weixin.qq.com/s/-K13EeWEDv0W5929txa3mA) (王紫菜)
- **Pattern**: [[deep-trust-relationship]] - 信任稀缺性，克制让人脉发挥最大作用，10倍比2倍更容易

## [2026-06-21] wiki-ingest: no-partner-startup + luck-and-mysticism

- **Sources**: 
  - [创业不要合伙！！！](https://mp.weixin.qq.com/s/9fIs47-ZsFHVFwEYdX_Ahg) (小鹅劳斯)
  - [运气和玄学](https://mp.weixin.qq.com/s/V1eWrG-chA4gh3AV8sAb7A) (小鹅劳斯)
- **Patterns**: 
  - [[solo-startup]] - 创业不要合伙，定期分钱不分股权，掌握稀缺资源
  - [[life-anti-fragility]] - 多重支点，时间周期拉长运气归零，吃透vs浅尝辄止

## [2026-06-19] agent-reach registered

- **Agent Reach** → product: [[agent-reach]]
  - 34,390 Stars, 2,745 Forks
  - AI Agent 多平台搜索工具（Twitter/Reddit/YouTube/GitHub/Bilibili/小红书/微信公众号）
  - 安装：pipx install https://github.com/Panniantong/agent-reach/archive/main.zip
  - ⚠️ 微信公众号支持：需从 v1.3.0 手动复制 wechat.py 到 v1.5.0

## [2026-06-17] ai-basic-concepts wiki-ingest

- **Source**: [一篇文章讲清楚AI基础概念](https://mp.weixin.qq.com/s/96bg1YgNQZsR8Q9cMdEMiw) (Harry)
- **Images**: 无外部图片（微信内置图）
- **Patterns**: [[ai-concepts-map]] - AI概念关系图谱：LLM→Agent→Skill→RAG→Harness
- **Note**: 大部分概念已有，文章主要是梳理关系

## [2026-06-16] saas-payment-methods wiki-ingest

- **Source**: [用户更倾向于选择Creem而不是Paypal](https://mp.weixin.qq.com/s/2ehAIv_X_0_R1YUtsxF3Og) (吴就业)
- **Images**: 无外部图片（微信内置图）
- **Patterns**: [[saas-payment-provider-comparison]] - Creem vs PayPal 费用对比、用户选择数据、EU VAT 影响
- **Products**: [[creem]], [[paypal]], [[wise]]

## [2026-06-16] WeChat archives completed

- **claude-code-shortcuts.md** → source: Claude Code 快捷键 (Jay的觉醒之旅)
- **gefei-seo-long-tail.md** → source: 哥飞SEO教程：新词老词策略
- **Patterns**: long-tail-reverse-eating-main-keyword, seo-new-vs-old-keyword, seo-homepage-signal, seo-roi-analysis
- **Note**: 两篇微信文章均无外部图片（微信内置图），无需本地化

## [2026-06-14] llm-for-i-report registered

- **LLM for i-Report** → product: [[llm-for-i-report]]
  - 0 Stars, Python
  - 专为i人设计的低阻力碎片化记录与智能汇报工具，命令行记录Done/Todo，LLM一键生成日/周/月报

## [2026-06-14] one-job-one-resume registered

- **One-Job-One-Resume** → product: [[one-job-one-resume]]
  - 10 Stars, Python
  - 一岗一件定制化简历，帮助应届生精准展示与目标职位匹配度

## [2026-06-14] legado registered

- **legado (阅读3.0)** → product: [[legado]]
  - gedoor/legado: 46,891 Stars, 5,777 Forks
  - 开源 Android 阅读器，自定义来源阅读网络小说
  - 用户 fork: FountainChan/legado

## [2026-06-14] tgo registered

- **tgo** → product: [[TGO]] (tgoai/tgo)
  - 495 Stars, 96 Forks, TypeScript
  - 开源 AI Agent 客服平台：多渠道接入、RAG 知识库、Agent 编排、人工协作
  - 核心提取：Web Widget + RAG 知识库 + MCP 工具 → 可作为网站智能客服

## [2026-06-13] More sources processed

- **code-x-lof-arbitrage.md** → patterns: [[ai-replaces-junior-dev]], [[lof-arbitrage]]
- **go-stock.md** → product: [[go-stock]]
- **ai-website-cloner-template.md** → patterns: [[ai-website-cloning]], [[parallel-agent-build]]

## [2026-06-13] Bulk processing

- **geju-skill.md** → pattern: [[geju-skill]]
- **flipbook-canvas.md** → product: [[flipbook-canvas]]
- **ddd-harness-microservices.md** → product: [[ddd-harness-microservices]]
- **ai-era-wealth-creation.md** → pattern: [[wealth-leap-formula]]
- **claude-prompt-strategies.md** → patterns: [[structured-prompt]], [[first-principles-reasoning]], [[multi-perspective-validation]]

## [2026-06-13] ai-agent-team-9-stages

- **Source**: [从零搭建AI Agent团队：9个阶段](https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA)
- **Images**: none (text-only article)
- **Patterns**: agent-loop, context-engineering, typed-tool-schema, isolated-sub-agent, orchestrator-pattern, shared-task-list, memory-persistence-sandbox, evaluation-pipeline, permissions-file
- **Products**: Anthropic-Claude (编排器用 Opus, 子 Agent 用 Sonnet/Haiku)
- **Concepts**: multi-agent-architecture, agent-team

## [2026-06-13] ai-local-brain

- **Source**: [一个 Obsidian、三个入口、一台常驻 Mac：我的 AI 个人工作流](https://mp.weixin.qq.com/s/m_y0k7Gm15vZn9EVHgyUEQ) (kaitox)
- **Images**: 5 images → `sources/images/ai-local-brain/` (already existed)
- **Patterns**: local-data-backbone, always-on-mac, three-entry-points, four-layer-workflow, skill-based-integration, lan-nas-access
- **Products**: codex, hermes-agent, obsidian, futu
- **Fix**: date 格式修正 (2026年6月1日 10:00 → 2026-06-01)

## [2026-06-13] agent-skill-iterative-writing

- **Source**: [Agent skill 迭代式编写实战](https://mp.weixin.qq.com/s/59Z2eVOg914_bpRD6-WsYg) (物流技术团队)
- **Images**: 16 images (001.gif, 002.webp, 003-016.png, 010.gif, 013.jpg) → `sources/images/agent-skill-iterative-writing/`
- **Patterns**: progressive-disclosure, decision-tree, negative-constraint-with-alternative, self-review-mechanism, eval-mechanism, faas-analogy, skill-file-structure
- **Products**: skill-creator, skill-judge, skills-sh, Claude-Skills, Agent-Skills, Cursor, OpenCode, Qoder, LangGraph, ReAct
- **Concepts**: agent-skill

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

## [2026-06-11] ingest: meigen.ai 出海建站案例

- 归档《月访500万的AI生图站 meigen.ai 技术拆解》微信公众号至 sources/meigen-ai-tech-breakdown.md
- 下载 19 张配图至 images/meigen-ai-tech-breakdown/
- 内容摘要：meigen.ai 月访 576 万，SSR + 积分制 + 程序化 SEO，T3 国家市场策略，推客矩阵驱动自然增长

## [2026-06-11] ingest: Hermes Agent + Obsidian 知识库

- 归档《我把Hermes Agent接进 Obsidian 后，知识库终于不只是"存资料"了》至 sources/hermes-obsidian-knowledge-base.md
- 下载 1 张配图至 images/hermes-obsidian-knowledge-base/
- 内容摘要：Obsidian 做底座，Hermes Agent 做执行层。Source→Topic→Draft→Published 四步流转链路，知识库从仓库变生产线

## [2026-06-11] ingest: Claude 100个提示策略

- 归档《Claude 的真正上限：100个提示策略构建你的AI思维系统》至 sources/claude-prompt-strategies.md
- 下载 11 张配图至 images/claude-prompt-strategies/
- 内容摘要：10 大场景分类（结构化提示、推理框架、内容创作等），思维框架比模型版本更重要

## [2026-06-11] ingest: 9个API平台出海

- 归档《出海产品从0到1：我常用的9个API平台，语言、图片、视频、地图全整理》至 sources/ai-api-platforms-overseas.md
- 下载 3 张配图至 images/ai-api-platforms-overseas/
- 内容摘要：9 个常用 API 平台（语言/图片/视频/地图），API 组合是普通人出海产品的加速器

## [2026-06-11] ingest: Harness 工程化实践

- 归档《AI 不缺智商缺纪律：一场 Harness 工程化实践》至 sources/harness-engineering-practice.md
- 下载 24 张配图至 images/harness-engineering-practice/
- 内容摘要：harness 四阶段演进、三层加载架构、19节点链路、G1-G8门禁、7维评测体系

## [2026-06-11] wiki-ingest: harness-engineering

- 更新 concepts/harness-engineering.md（原有概念页）
- 补充四阶段演进、thin controller 原则、19节点链路、7维评测体系
- 新增 sources/harness-engineering-practice 为关联来源

## [2026-06-11] ingest: 野生小虎出海SEO 100万UV（降级为稍后读）

- X帖子嵌入文章需登录访问，无法抓图归档
- 降级为稍后读，保留链接待后续采集

## [2026-06-11] ingest: AI时代造富效应 + Agent团队9阶段

- 归档《AI时代的造富效应》至 sources/ai-era-wealth-creation.md（无图片）
- 归档《从零搭建AI Agent团队：9个阶段》至 sources/ai-agent-team-9-stages.md（9张图）
- 内容摘要：造富公式/三路径/四赛道 + Agent团队三层九阶段架构

## [2026-06-11] wiki-ingest: ai-era-wealth-creation + ai-agent-team-9-stages

- 新建 patterns/ai-wealth-creation.md（AI时代造富模式）
- 新建 patterns/multi-agent-architecture.md（多智能体架构9阶段）
- 关联 sources → patterns 双向引用

## [2026-06-11] wiki-ingest: claude-prompt-strategies + hermes-obsidian + meigen-ai

- 新建 patterns/prompt-engineering.md（提示工程100策略）
- 新建 patterns/ai-knowledge-workflow.md（AI知识管理工作流）
- 新建 patterns/ai-product-seo-launch.md（AI产品SEO冷启动）
- 关联 sources → patterns 双向引用

## [2026-06-11] wiki-ingest: ai-api-platforms + flipbook-app + go-stock + guangzhou-ecommerce

- 新建 patterns/ai-api-integration.md（AI API集成模式）
- 新建 products/flipbook-app.md（交互式知识图谱）
- 新建 products/go-stock.md（AI股票分析工具）
- 新建 patterns/guangzhou-industrial-ecommerce.md（广州工业品电商模式）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: aitoearn + agent-reach + ai-local-brain + 40-thinking-models

- 新建 products/aitoearn.md（AI全自动自媒体内容平台）
- 新建 products/agent-reach.md（AI Agent互联网能力扩展）
- 新建 patterns/personal-ai-infrastructure.md（个人AI基础设施）
- 新建 patterns/thinking-models.md（40种思维模型）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: codex-skills + magic-slide + vibe-coding + ai-unemployment

- 新建 products/codex-skills.md（Codex Skills精选列表）
- 新建 products/magic-slide.md（HTML演示稿生成Skill）
- 新建 products/personal-ai-infrastructure.md（PAI 个人AI操作系统）
- 新建 patterns/engineering-taste.md（工程品味）
- 新建 products/taste-skill.md（AI前端防丑Skill）
- 新建 patterns/vibe-coding.md（氛围编程建站模式）
- 新建 patterns/ai-unemployment-pattern.md（AI失业危机与应对策略）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: serenity + ui-polish + geju + open-design + social-card + design-to-html

- 新建 patterns/serenity-stock-research.md（供应链卡点投研）
- 新建 patterns/ui-polish.md（UI精致打磨）
- 新建 patterns/geju-decision打开策略.md（AI决策打开策略）
- 新建 products/open-design.md（开源Claude Design替代）
- 新建 products/social-card-design.md（社媒封面图生成）
- 新建 products/design-to-html.md（UI截图视觉还原）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: claude-skills-ui-ux + weread-exporter + awesome-design-md

- 新建 patterns/claude-skills-ui-ux.md（UI/UX工程师顶级Skills）
- 新建 products/weread-exporter.md（微信读书全本导出）
- 新建 products/awesome-design-md.md（72+品牌设计系统文档集合）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: auto-ppt + ddd-harness + video-highlight

- 新建 products/auto-ppt.md（React代码制作PPT）
- 新建 patterns/ddd-four-layer-architecture.md（DDD四层架构微服务样板）
- 新建 products/video-highlight-skill.md（AI视频高光剪辑）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: ai-rd-automation + skillshare + cell-architecture

- 新建 patterns/ai-rd-automation.md（AI研发自动化Wiki知识库+技能包）
- 新建 products/skillshare.md（AI CLI Skills跨平台同步）
- 新建 products/cell-architecture-studio.md（3D细胞结构交互画廊）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: tolaria + obsidian-hermes + openai-plugins

- 新建 products/tolaria.md（Markdown知识库桌面管理）
- 新建 patterns/obsidian-hermes-knowledge-factory.md（Obsidian+Hermes知识库生产线）
- 新建 products/openai-plugins.md（OpenAI Codex官方插件示例集合）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: gstack-skills + ai-website-cloner + generic-agent

- 新建 patterns/gstack-skills.md（AI编程助手团队化）
- 新建 products/ai-website-cloner.md（网站克隆为Next.js）
- 新建 concepts/generic-agent.md（自我进化AI Agent框架）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: claude-cookbooks + google-skills + serenity-stock-trading

- 新建 products/claude-cookbooks.md（Anthropic官方使用菜谱集）
- 新建 products/google-skills.md（Google官方Skills合集）
- 新建 patterns/serenity-stock-trading.md（三人合议制投资框架）
- 关联 sources → patterns/products 双向引用

## [2026-06-11] wiki-ingest: serenity-skill family consolidation

- 新建 concepts/serenity-investment-methodology.md（AI供应链卡脖子分析统一方法论）
- 新建 products/serenity-skill-fansite.md（粉丝站版本）
- 新建 products/serenity-aleabitoreddit.md（完整推文档案）
- 新建 products/serenity-skill-zad.md（ZadAnthony版本）
- 关联 sources → concepts/products 双向引用

## [2026-06-11] wiki-ingest: serenity-cross-market + serenity-aleabitoreddit-skill + career-ops + last30days + pm-skills

- 新建 products/serenity-cross-market-skill.md（跨市场供应链卡点）
- 新建 products/serenity-aleabitoreddit-skill.md（WYP版本）
- 新建 products/career-ops.md（AI求职系统）
- 新建 products/last30days-skill.md（近30天趋势研究）
- 新建 products/pm-skills.md（产品经理Skills市场）
- 关联 sources → products 双向引用

## [2026-06-11] wiki-ingest: web-designer + turbovec + meigen-ai

- 新建 products/web-designer-plugin.md（48个Award级设计模式）
- 新建 products/turbovec.md（向量检索库）
- 新建 products/meigen-ai.md（AI生图平台）
- 关联 sources → products 双向引用

## [2026-06-11] wiki-ingest: multi-agent-architecture + prompt-engineering + harness-engineering-practice

- 更新 patterns/multi-agent-architecture.md（多Agent协作架构）
- 更新 patterns/prompt-engineering.md（100个提示策略）
- 新建 patterns/harness-engineering-practice.md（Harness工程化实践）
- 关联 sources → patterns 双向引用

## [2026-06-11] wiki-ingest: ai-era-wealth-creation

- 更新 patterns/ai-wealth-creation.md（AI时代造富效应）
- 关联 sources → patterns 双向引用

## [2026-06-11] wiki-ingest: ai-api-platforms + guangzhou-ecommerce + react-component-libraries

- 新建 patterns/ai-api-platforms-overseas.md（出海API平台）
- 新建 patterns/guangzhou-industrial-ecommerce.md（广州工业品电商）
- 新建 comparisons/react-component-libraries.md（React组件库对比）
- 关联 sources → patterns双向引用

## [2026-06-11] wiki-ingest: mycc-research-machine + llm-wiki-product

- 新建 patterns/mycc-research-machine.md（AI研究机器四层架构）
- 新建 products/llm-wiki-product.md（LLM Wiki知识管理产品化实现）
- 关联 sources → patterns/products 双向引用

## [2026-06-15] ingest: Claude Code 18 款 UI/UX 设计 Skill 指南

- 归档《Claude Code UI/UX 设计最佳 18 款 Skill 完整指南》博客至 sources/claude-code-18-ui-ux-design-skills.md
- 下载 3 张配图至 images/claude-code-18-ui-ux-design-skills/
- 内容摘要：解决 Claude Code 生成界面千篇一律的"分布收敛"问题，18 款设计 Skill 详细介绍（Anthropic Frontend Design、UI/UX Pro Max、Taste Skill、Impeccable 等），含对比表和安装命令
- 分类：products/design-skills

## [2026-06-15] ingest: Claude Design 10 个高级提示词

- 归档《Claude Design 的 10 个高级提示词：Senior UX 设计师工作流》博客至 sources/claude-design-10-prompts.md
- 下载 1 张配图至 images/claude-design-10-prompts/
- 内容摘要：10 个可直接复制粘贴的实战提示词（信息架构师、零预算用户研究员、设计系统、微文案、引导设计师、可用性审计师、数据看板、无障碍专家、表单设计师、原型测试员），按角色/上下文/约束/输出格式参数化
- 分类：products/design-skills

## [2026-06-16] ingest: 8 个优质设计 Skills 解决 Vibe Coding 设计难题

- 归档《8 个优质的设计 Skills 解决 Vibe Coding 设计难题》博客至 sources/8-design-skills-vibe-coding.md
- 下载 8 张配图至 images/8-design-skills-vibe-coding/
- 内容摘要：涵盖创意方向（Frontend Design、Taste Skill、Impeccable）、设计智能（UI/UX Pro Max、UI Design Brain）、质量合规（UI Skills）、工程模式（Designer Skills、UX Researcher Designer）四大类别
- 分类：products/design-skills

## [2026-06-16] ingest: Taste Skill 实测 - 从能看变成能商用

- 归档《Taste Skill 实测：把 AI 设计从能看变成能商用》博客至 sources/taste-skill-302ai-review.md
- 下载 9 张配图至 images/taste-skill-302ai-review/
- 内容摘要：37k Stars 的 Taste Skill 深度实测，三大案例（Ferrari Luce 落地页、Nano Banana Pro 老项目优化、302.AI 品牌重塑），展示数值化参数系统如何打破 AI 界面平庸套路
- 分类：products/design-skills

## [2026-06-16] ingest: RAG 准确率翻倍的优化实践

- 归档《RAG准确率翻倍，我做了这些优化。。。》公众号至 guide/ai/intelligent-customer-service/23-rag-accuracy-optimization.md
- 下载 2 张配图至 images/23-rag-accuracy-optimization/
- 内容摘要：从文档解析到生成的全链路优化（文档清洗→切分策略→混合检索→Rerank→Prompt 打磨），包含 Java 生产级实现代码和效果评估指标
- 分类：guide/ai/intelligent-customer-service

## [2026-06-16] ingest: 程序员的底层思维 - 16 种底层思维能力

- 归档《程序员的底层思维：解密 16 种底层思维能力》掘金至 columns/cognition/programmer-underlying-thinking.md
- 下载 1 张配图至 images/programmer-underlying-thinking/
- 内容摘要：《程序员底层思维》阅读笔记，介绍基础思维能力（抽象、逻辑、结构化、批判性、维度、分类、分治、简单、成长型）和专业思维能力（解耦、契约、模型、工具化、量化、数据、产品）共 16 种
- 分类：columns/cognition
- 新增认知专栏：创建 columns/cognition/index.md，更新 columns/index.md

## [2026-06-29] ingest: Vibe Coding 必备的两个 Prompt

- 归档《分享 2 个 Vibe Coding 必备的超实用 Prompt》公众号至 sources/vibe-coding-two-prompts.md
- 下载 8 张配图至 images/vibe-coding-two-prompts/
- 内容摘要：数字生命卡兹克近一年 Vibe Coding 实践最高频的两个 Prompt——**第一性原理**（生成端，强制 AI 跳脱类比推理回到问题本质）和**对抗式审查**（验证端，多 Agent 并发模拟恶意用户找 BUG），构成完整闭环。适用范围远超 Vibe Coding，可用于文章审查、商业方案审视、人生决策。配真实案例（AIHOT 飞书推送 BUG / OOM 死循环 / 未来时间污染）
- 分类：sources（vibe-coding / prompt-engineering / first-principles / adversarial-review）

## [2026-06-29] ingest: AI 美女账号 9.4 万粉月入 2.8 万 - Ina 案例

- 归档 X 长文《AI 美女账号 9.4 万粉月入 2.8 万》(@0xluffy_eth) 至 sources/ai-virtual-model-account-case-study.md
- 下载 6 张配图至 images/ai-virtual-model-account-case-study/
- 内容摘要：拆解 AI 虚拟模特账号 Ina（明牌 AI，145 条内容，9.4 万粉，Patreon 1169 付费会员，月入 6.35-28.3 万人民币）。核心洞察——**AI 美女账号赚钱核心不是脸，是「角色付费系统」**：①明牌筛选 ②Patreon 三档定价（高价档 $49.99 最受欢迎）③三层漏斗（主页涨粉 → 故事精选预热 → Patreon 收费）④涨粉型 vs 盈利型本质差异 ⑤高价档筛选高意愿用户 ⑥矩阵化复制成本低 ⑦门槛不在技术，在运营
- 分类：sources（ai-virtual-influencer / subscription-model / private-domain-monetization / content-matrix）

## [2026-06-29] ingest: 闲鱼导流实操手册 - 从 0 到 1 全攻略

- 归档 X 长文《闲鱼导流实操手册》(@AmberTreelet) 至 sources/xianyu-private-domain-guide.md
- 下载 1 张配图至 images/xianyu-private-domain-guide/
- 内容摘要：闲鱼作为「精准商品属性平台」与小红书「内容电商」互补的获客方法论。9 大模块——生态条件、6 个适合品类（服务/资料/教学/引流品/同城/高客单前端）、基建准备（1-5 台干净安卓机+鱼小铺）、7 天养号大法、调研同行做搜索词表、服务类实操模板、数据复盘表（曝光-浏览-想要）、导流技巧（夸克网盘）、微信聊天、后期维护。**核心原则：搜索电商占关键词，弱内容强交易，私域才是真正变现处**
- 分类：sources（private-domain / customer-acquisition / xianyu / e-commerce）

## [2026-06-29] archive: OpenSpec + Superpowers 工作流

- 新建 concepts/openspec-superpowers-workflow.md
- 内容：公司内推的 AI 辅助开发工作流整合——OpenSpec 管规格/记忆，Superpowers 管设计/执行。6 步闭环：① 提案（/opsx:propose）→ ② 人工审查 → ③ 设计（brainstorming + writing-plans）→ ④ 构建（TDD + 子代理读 specs/）→ ⑤ 交付（verification）→ ⑥ 归档（/opsx:archive）。**核心价值：解决 AI 开发的两个最大痛点——缺记忆 + 缺纪律**
- 分类：concepts（ai-workflow / spec-driven-development / multi-agent）

## [2026-06-29] archive: 独立 App 实战手册（Adam Lyttle 88 集整理）

- 整页爬取 https://app-playbook-site.pages.dev/ 至 docs/public/app-playbook/（VitePress 公共目录，含 index.html + styles.css + script.js + favicon.svg）
- 知识库版摘要 docs/md/columns/indie-hub/app-playbook/index.md 使用 `<HtmlViewer>` 组件内嵌呈现
- indie-hub/index.md 系列索引表新增入口
- columns/index.md 专栏总览新增 Indie Hub 入口
- 内容：6 阶段独立 App 实战——①找点子和真实需求 ②锁定细分方向 ③开发 MVP ④上架与 ASO ⑤冷启动与第一批用户 ⑥转化/留存/增长飞轮。每步含「工具/方法/通过标准/产出」。配套 7 天行动计划 + 工具速查表。**核心方法论：先验证再开发，单渠道打透再扩，付费墙放在价值被理解之后**
- 分类：columns/indie-hub（indie-app / app-store-optimization / mvp / cold-start / growth-loop）

## [2026-06-30] ingest: Codex 零基础小白上手指南

- 归档《Codex 零基础小白上手指南（附实战全流程）》X Article 至 sources/codex-beginners-guide.md
- 下载 22 张配图至 images/codex-beginners-guide/
- 内容摘要：阿西的 Codex 入门教程，对比 Claude Code 三大痛点（部署难/额度贵/封号），介绍两种模式、四种场景：配图、PPT、自动化任务、Computer Use。
- 分类：sources/tools（codex / ai-coding-agent / beginner-guide）

## [2026-06-30] ingest: Codex 视频制作 6 个 GitHub Skills

- 归档《Codex 视频制作：6 个必装 GitHub Skills》至 sources/codex-video-production-skills.md
- 内容摘要：整理 Codex 做视频的 6 个 GitHub Skills：HyperFrames（动效视频）、video-use（剪辑）、Remotion Skills（批量视频）、Generative Media Skills（AI 生成工具箱）、videocut-skills（中文剪辑）、seedance2-skill（即梦提示词）。含推荐搭配方案。
- 分类：sources/tools（codex / video-production / github-skills）

## [2026-06-30] ingest: GPT-Image 2 提示词模板开源

- 归档《苍何：GPT-Image 2 的 329 条提示词模板开源》X/Twitter 至 sources/gpt-image2-prompts.md
- 下载 23 张配图至 images/gpt-image2-prompts/
- 内容摘要：苍何逆向 329 个 GPT-Image 2 案例为 Prompt-as-Code 结构化模板，开源在 GitHub（freestylefly/awesome-gpt-image-2），支持 Agent 自动化调用。覆盖直播画面/手绘地图/海报/拆解图/技术详解/朋友圈截图/个人网页/诗词图/长卷图等场景。核心创新：原子化 Schema 注入 + 零配置工作流 + 多维决策矩阵。
- 分类：sources/tools（ai-image-generation / gpt-image / prompt-engineering）

## [2026-07-02] ingest: Codex App 从0到1完整入门教程

- 归档《Codex App 从0到1完整入门教程》X/Twitter @gengdaJ(逸尘) 至 sources/codex-app-beginner-tutorial.md
- 下载 19 张配图至 images/codex-app-beginner-tutorial/
- 内容摘要：550 行实测入门长文，覆盖下载安装、三者区别(ChatGPT/Codex App/云端Codex)、主界面左中右三栏地图、6 大入口、11 个设置页（重点：常规/外观/个性化/MCP/电脑操控）、5 类权限边界、6 个常见踩坑、9 步上手路线。明确 Code App 比 Claude Code 更适合小白。
- 新增概念页 [[concept-codex-app]]：OpenAI 桌面端 AI 工作台——四大能力扩展(Plugin/Connector/Skill/MCP) + Computer Use + 自动化 + 个性化偏好。
- 分类：sources/tools + concepts（codex / desktop-ai-agent / beginner-tutorial / openai）

## [2026-07-02] ingest: AI 全自动生成图书号短视频

- 归档《AI 全自动生成图书号短视频》X/Twitter @Bytec99(Bytec) 至 sources/ai-book-short-video-pipeline.md
- 下载 5 张配图至 images/ai-book-short-video-pipeline/
- 内容摘要：基于 @369Serena 流程改造的图书号短视频自动化链路。6 个核心工具(HyperFrames + 微信读书 Skill + VoxCPM + faster-whisper + FFmpeg + yt-dlp)，12 步流水线只保留 2 个确认点（文案+图片）。关键经验：图片不放文字、旁白一次生成、字幕只借时间不用文字、BGM ducking 用 sidechaincompress、HyperFrames 自检三步走。核心观点："把内容品类做成可复用的生产流程"。
- 新增概念页 [[concept-ai-content-pipeline]]：AI 内容工厂流水线——把内容生产从一次性生成变成可复用工程，人负责挑选微调，AI 跑完全流程。
- 分类：sources/tools + concepts（ai-content-pipeline / short-video / automation / codex / hyperframes / voxcpm / ffmpeg）

## [2026-07-02] ingest: Claude 能做到这一切（16 个 Power Features + 4 角色 Prompt）

- 归档《Claude 能做到这一切，但大多数人完全不知道》X/Twitter @Etudecn(淘沙者) 至 sources/claude-power-features-guide.md
- 下载 9 张配图至 images/claude-power-features-guide/
- 内容摘要：382 行覆盖 16 个 Claude 真实功能的位置和用法——Projects/Artifacts/Adaptive Thinking/Memory/Chrome/Cowork/Scheduled Tasks/Skills/CLAUDE.md/Claude Code/Claude Design/Prompt Caching，加 4 个角色 Prompt（CBT 咨询师/严厉导师/魔鬼代言人/私人教练）。核心观点：大多数人只用 5% Claude 能力，今天设好一个功能就能赢一半。
- 新增概念页 [[concept-claude-role-prompts]]：4 个改变提问方式的角色框架——本质是「重新分配对话注意力资源」而非「让 AI 假装是 X」。
- 分类：sources/tools + concepts（claude / power-features / role-prompts / cbt-framework）

## [2026-07-02] ingest: 月入 23w 复盘（自媒体复利模型）

- 归档《月入23w，我把自己拆给你看》X/Twitter @Pluvio9yte(雪踏乌云) 至 sources/compound-growth-selfmedia-journey.md
- 下载 1 张配图至 images/compound-growth-selfmedia-journey/
- 内容摘要：02 年应届生 8 个月推特运营复盘，从外包/体力劳动转向自媒体+真需求产品。核心观点：流量只是起点，围绕流量构造产业链才是护城河；账号是地基，真需求产品是出口；公开赚钱=出来卖，公开是信任建设。8 个月时间线 + 5 个值得研究人物（卫斯理/涛哥/天赐/熠辉等）。
- 新增概念页 [[concept-selfmedia-compound-model]]：自媒体复利模型——4 层变现漏斗（流量→信任→真需求→收入闭环），复利 vs 体力劳动 6 个判断标准，自媒体变现 4 阶段路径。
- 分类：sources/tools + concepts（selfmedia / content-business / compound-thinking / growth-hacking）

## [2026-07-02] ingest: AI 产品沉思录（流量先行 + 小产品/工具）

- 归档《AI 产品沉思录：流量先行，窄业务、小产品/工具》微信公众号 zlbigger 至 sources/ai-product-reflection-zlbigger.md
- 下载 28 张配图（含 11 张重复）至 images/ai-product-reflection-zlbigger/
- 内容摘要：zlbigger 一年多 AI 一人公司复盘，5 条收入线全跑通（流量/订阅/知识付费/按需，ToB 暂时不碰）。核心方法论 4 步走：AI 大模型实现最小单元 PMF → RPA 规模化 → 形成 SOP → 无限复制。暴论：同样 1 万盈利，别人 5 人 vs 我 1 人 = 效率秒杀。关键判断：大模型是技术不是产品，不必纠结「一定做 AI 应用」。N 个小产品叠加 IP 流量，跨语种覆盖全球。
- 新增概念页 [[concept-ai-oneperson-company]]：AI 一人公司方法论——PMF→RPA→SOP→无限复制，N 个小产品叠加 IP 流量，跟在大模型屁股后面吃红利。
- 分类：sources/indie-hub + concepts（ai-product / one-person-company / indie-business / pmb-2-sop）

## [2026-07-02] ingest: 利用 AI 给自己做个网站给养老吧（裸晒项目实操）

- 归档《利用 AI 给自己做个网站给养老吧，"躺"着把钱挣》微信公众号 zlbigger 至 sources/ai-website-lay-flat-income-zlbigger.md
- 下载 14 张关键配图至 images/ai-website-lay-flat-income-zlbigger/
- 内容摘要：zlbigger 上次没融到钱没找到团队，这次直接裸晒项目 linggan.io（动漫 OOTD 站）。完整 6 个 AI 打工人分工（写主题/画图 prompt/标题党/分词/description/正文创作），全部输出 5 语种 JSON（es/zh/jp/kr/en）。关键 SEO 设计：多语种子路径 URL + 默认 301 重定向防内容重复 + friendly URL 部分不翻译 + 标签页本地化。定时任务每 5 分钟提交一个主题 → 每天 288 个内容页。成本：域名 100/年 + 搬瓦工空间 + Cloudflare 白嫖 + 文本 API 几乎免费（图片 API 是隐藏技巧）。
- 新增概念页 [[concept-ai-lay-flat-income]]：AI 躺赚多语种站——选流量主题 + 6 AI 打工人分工 + JSON 多语种输出 + 定时任务调度 + 全球被动收入。核心："AI 加成普通 CMS，不是做 AI 应用"。
- 分类：sources/indie-hub + concepts（ai-stie-builder / lay-flat-income / multi-lang-cms / passive-income / seo-pipeline）

## [2026-07-02] ingest: 我借助小龙虾把『做个网站养老吧』升级了（Agent 自主调度）

- 归档《我借助小龙虾把"做个网站养老吧"升级了！》微信公众号 zlbigger 至 sources/xiaolongxia-agent-automation-zlbigger.md
- 下载 19 张关键配图至 images/xiaolongxia-agent-automation-zlbigger/
- 内容摘要：zlbigger 系列第 3 篇——从手动调度 6 个 AI 打工人升级到 Agent 自主调度 + 远程触发。展示 8 个真实在跑的自动化流水线：壁纸站凌晨自动化/穿搭素材管理/AI 资讯自动筛选/报告解读多渠道分发/商机→产品→开发三阶段流水线/AI 工具返佣/网盘拉新/电商联盟。关键突破：手机微信/飞书远程触发 Agent（Agent-as-a-Employee）。核心金句："设计代码部署运维 AI 自己搞定，剩下的就是你创意、策略、业务、执行"。
- 新增概念页 [[concept-agent-autonomous-pipeline]]：Agent 自主调度 + 三阶段流水线（商机→产品→开发），从手动触发升级到 7×24 Agent 自主 + 远程触发。
- indie-hub 专栏同步归档 columns/indie-hub/xiaolongxia-agent-automation-zlbigger.md
- 分类：sources/indie-hub + concepts（agent-autonomous / ai-oneperson-company / remote-trigger / three-stage-pipeline）

## [2026-07-02] ingest: 用 AI 来做一个高质量行业信息站（细分付费）

- 归档《用 AI 来做一个高质量行业信息站，帮你卖行业报告文档》微信公众号 zlbigger 至 sources/ai-report-info-station-zlbigger.md
- 下载 10 张配图至 images/ai-report-info-station-zlbigger/
- 内容摘要：zlbigger 系列第 4 篇——具体场景落地（行业报告文档站）。核心方法：花 200 块买 VIP 当资源池 + AI 自动 PDF→HTML 总结 + 88/年订阅或单篇下载。注意知识星球 30-40% 抽成 + 苹果支付再抽 30%。arXiv 论文赛道更简单（URL 直接提交）。关键洞察："同样的代码复制到母婴、汽车、AI 等多个细分行业"。
- 概念沿用 [[concept-ai-oneperson-company]]（方法论已覆盖），本篇作为细分场景案例。
- indie-hub 专栏同步归档 columns/indie-hub/ai-report-info-station-zlbigger.md
- 分类：sources/indie-hub（ai-report-station / info-station / content-subscription / passive-income / vertical-niche）

## [2026-07-02] ingest: 像更新文章一样创建 AI 小应用（占位符 prompt 模板）

- 归档《像更新文章一样创建 AI 小应用并以最小成本快速验证》微信公众号 zlbigger 至 sources/ai-mini-app-creation-zlbigger.md
- 下载 11 张关键配图至 images/ai-mini-app-creation-zlbigger/
- 内容摘要：zlbigger 系列第 5 篇——AI 小应用批量创建后台。核心机制：用 [input1] [input2] 占位符把 prompt 抽象成可复用模板，后台填 5 个字段（名称/简介/角色/输入提示/字段数）几分钟上线独立站。后台内置"SEO 专员"AI + 多语种自动。爆款逻辑：单应用 90% 不火，但 10 个里有 1 个火了就值回成本（自媒体爆款逻辑复用）。8 种爆款方向（作者体/梗图/小语种翻译/名人回信/品牌海报/儿童故事/菜谱/复习卡片）。
- 新增概念页 [[concept-ai-mini-app-template]]：AI 小应用模板化创建——占位符模板 + 后台批量 + 多语种 + SEO 自带。从"写 prompt"到"规模化分发 prompt"的关键中间层。
- indie-hub 专栏同步归档 columns/indie-hub/ai-mini-app-creation-zlbigger.md
- 分类：sources/indie-hub + concepts（ai-template / placeholder-prompt / mini-app-creation / indie-tool / prompt-as-code）

## [2026-07-02] ingest: 写给普通人的 AI 工具使用指南（5 大类工具地图）

- 归档《写给普通人的 AI 工具使用指南：免费用起来再说》微信公众号 zlbigger 至 sources/ai-free-tools-guide-zlbigger.md
- 下载 68 张关键配图至 images/ai-free-tools-guide-zlbigger/
- 内容摘要：481 行 68 张截图的 5 大类工具地图（文本/图像/视频/音乐/语音），覆盖 30+ 国内可用工具。**核心心法：额度用完换下一个继续免费用**（利用信息差 + 多供应商轮换）。文本类主力 Kimi，图像类 Liblib + WHEE，图像修改百度 AI 图片助手，视频快影 + 海螺 + 即梦，音频网易天音 + 通义听悟。
- 新增概念页 [[concept-ai-free-quota-rotation]]：AI 工具免费额度轮换策略——信息差 + 多供应商永久免费循环 + 工具目录变现。
- indie-hub 专栏同步归档 columns/indie-hub/ai-free-tools-guide-zlbigger.md
- 分类：sources/indie-hub + concepts（ai-tools / free-quota / tool-catalog / indie-tool / arbitrage）

## [2026-07-13] ingest: 出海一周年稳定万刀——12 模块 200+ 篇实战文章方法论地图

- 归档《出海一周年，稳定万刀，网站出海内容整理》X 推文（droidHZ @hezhiyan7）至 sources/hezhiyan7-outsea-oneyear-10000usd.md
- 下载 2 张配图（封面 + aichuhai.dev 站截图）至 images/hezhiyan7-outsea-oneyear-10000usd/
- 内容摘要：droidHZ 出海 1 周年 3 月达到月入万刀（稳定），把整年微信公众号每日分享按 12 大模块做了系统整理：需求挖掘（28 篇，最大）/SEO（35 篇，最大）/开发（22）/流量（20）/支付（17）/复盘（14）/ads（12）/数据分析（11）/产品设计（9）/外链（9）/工具推荐（5）/部署上线（4）。每篇文章都链向具体微信公众号实战文章。SEO 文章密度最高（约 35 篇），反映独立站流量高度依赖搜索的本质。
- 新增概念页 [[concept-indie-site-builder-skill-stack]]：独立网站出海创业 12 大能力栈——按业务重要性而非时间排序的实战密度地图，SEO 模块最大，AI 工具深度嵌入每个环节，跨境合规闭环是基础门槛。
- 新增产品页 [[product-aichuhai-dev]]：droidHZ 配套导航站 aichuhai.dev——把 200+ 篇实战文章按 12 模块做二次分类整理，开放话题提交入口，本身就是 AI 内容运营样板。
- 5 大核心洞察：(1) SEO 是最大战场 + GEO 成为新变量；(2) AI 工具是基础设施不是单点；(3) 跨境合规闭环是基础门槛；(4) 心态是"种树故事"——1 年稳定万刀是正常节奏；(5) 复盘模块提供"上下文锚点"让你知道这条路能走多远。
- 分类：sources/indie-hub + concepts/product（seo / indie-business / outsea-oneyear / site-builder / cross-border-payment / passive-income / ai-tools）
- 整理推文中的 227 个微信公众号原文链接：B 方案精选 50 篇进 TODO.md（按 7 个二级主题：复盘总结 20/部署上线 4/需求挖掘 10/开发 5/SEO 5/支付 3/流量 3），全量 227 篇归档到 indie-hub 专栏 columns/indie-hub/hezhiyan7-outsea-oneyear-toc.md（按 12 大业务模块分类的完整 TOC，53KB）。
- 12 模块文章密度：SEO 45 + 需求挖掘 29 + 开发 29 + 支付 23 + 流量 23 + 复盘 20 + ads 14 + 数据分析 14 + 产品设计 11 + 外链 10 + 工具推荐 5 + 部署上线 4 = 227。
- TODO.md 顶部加引用说明指向原文 sources/，底部加「全量归档说明」段落。
## [2026-07-13] 试点爬取 5 篇微信公众号文章（droidHZ 出海系列）：
  - **first-time-dollar-oneyear** — 《第一次赚美元！纯新手深度复盘网站出海》：赫兹第一视角全流程，从付费 7000+ 学费到 5 个站 + 1 千元收入，含 28 节课程
  - **ai-traffic-geo** — 《如何查看 AI 流量，做好 GEO》：3 个 AI 流量来源分类（推荐位/搜索框/答案引用）+ 4 个查看方法 + 5 类适配建议
  - **sell-air-mvp** — 《卖空气验证需求》：Pieter Levels 预售《MAKE》案例 + 4 步 SOP（落地页→AI生成→Stripe→广告）
  - **nextjs-vuln-bill** — 《重大 Next.js 漏洞问题，小心账单爆炸》：真实漏洞事件 + 4 个解决方案（退款/限资源/Upstash/迁 Astro）
  - **template-sop** — 《基于模板的上站 SOP》：3 大类模板（建站/Landing Page/完整 SaaS）+ AI 编程适配 + 价格对比
- 全部精读重写为 sources/ 归档（不等同原始摘录，重新组织结构、加 ## 层级、提炼核心方法论）
- 10 张图片下载到 sources/images/{slug}/
- 5 篇都归到现有 [[concept-indie-site-builder-skill-stack]] 12 模块下，作为具体方法案例，不单独立 concept 页
- TODO.md 对应 5 条状态从 pending 改为 done，附归档链接

## [2026-07-13] ingest: 借力才能赚大钱（indie-hub-leverage-thinking）

- 归档《借力才能赚大钱：人生四阶段的杠杆思维》{广东 2026-07-11 微信公众号} 至 sources/indie-hub-leverage-thinking.md
- 原文无图片，纯观点文
- 精读重写结构：人生三阶段 + 四大杠杆（媒体/人才/被动收入/资金）+ 递进逻辑
- 关键洞察：Agent 和 Skill 是 AI 时代的新型人才杠杆；四杠杆层层递进不可跳过
- 关联到 [[40-thinking-models]]、[[ai-era-wealth-creation]]

## [2026-07-13] ingest: 周报 #107 - Multica + Impeccable 双工具工作流

- 归档《周报 #107 - 基于 Multica 与 Impeccable 的开发/设计工作流》{pseudoyu 2026-04-19 pseudoyu.com} 至 sources/weekly-review-107-multica-impeccable.md
- 13 张配图全部下载至 images/weekly-review-107/001-013
- 精读重写聚焦两套工具：
  - **Multica** — Runtime + Agent 员工 + Issue 指派的协作平台，把本地 Coding Agent 装上共享知识库
  - **Impeccable** — 设计流程命令化（/teach /craft /audit /polish），告别"为某页面一次性的设计代码"
- 提取对比表 + 共同点（同把"隐性的个人流程"显性化）
- 归到现有 concept-indie-site-builder-skill-stack，不单独立 concept
- 微信反爬 IP 解除后（之前 captcha 失败因 IP 被标记），抓取叶小钗《我用WorkBuddy搭了一套AI招聘流水线》一文 → sources/recruit-workbuddy.md（255 行精读 + 12 张配图）
- **新建智能招聘专栏** `columns/recruitment/`，包含 index.md（系列索引 + 核心路径 + 评分标准）
- 新增 2 个概念页：[[concept-hr-resume-skill]]（Skill+连接器+自动化 三层架构）、[[concept-recruitment-workbuddy]]（WorkBuddy HR 落地方案）
- 评分核心：6 维（学历 10% / 经验 30% / 技能 10% / 项目 30% / 稳定 10% / 潜力 10%）+ 加权后总分 ≥ 8 分自动推送业务负责人
- columns/index.md 加智能招聘专栏入口
- 分类：recruitment/hr-automation + concepts（workbuddy / ai-recruiting / resume-screening / feishu-bitable / hr-resume-skill）
- **droidHZ 19 篇复盘总结抓取受阻**：再次启动后，captcha 仍生效（IP 仍被微信标记为爬虫 IP），复盘系列全部 0/19 抓取成功。已尝试 4 种方案（headless/headed/r.jina.ai/defuddle/gstack browse + cookie import）均失败。
- 验证 IP 状态：叶小钗同一台服务器可抓（叶小钗那篇成功），droidHZ 那台公众号 IP 被锁。**两个公众号 IP 状态独立**。
- **策略调整**：放弃 droidHZ 那 19 篇（保留 TODO 中，不强行反复触发 captcha）。后续智能招聘专栏如需扩展，由用户直接提供可抓 URL。
- 采集空格丶《是时候让 Agent 上线你的个人网站了》→ sources/agent-launch-personal-site.md（219 行精读 + 16 张配图）。
- **核心 6 步部署**：买域名→加 Cloudflare→改 DNS→装 gh+wrangler CLI→授权→一句话部署
- 技术栈极简：只有 `gh` (GitHub CLI) + `wrangler` (Cloudflare CLI)，授权一次靠嘴部署
- 4 模块收敛（我是谁 / 做过什么 / 想过什么 / 能提供什么）→ 网站是实时对外的窗口，不是博客
- 归档到 indie-hub 专栏（与 first-time-dollar-oneyear、template-sop 形成「口喷建站」系列）
- 分类：indie-hub + vibe-coding + agent-deploy + personal-site + cloudflare-pages
- 采集 Heidixie呀《职场人学习要诀：问题驱动的学习车轮》→ sources/problem-driven-learning-wheel.md（精读，4 张配图）
- **新概念页** [[concept-problem-driven-learning-wheel]]：Charles Handy 的双环学习模型
- **新增子目录**：guide/career/learning/（首个文件）
- 同步挂入 [[columns/cognition/index|认知专栏]] + wiki index
- 核心洞察：5 步实操法（独立思考 → 问题本 → 求解 → 实践反思 → 月度输出）。月度输出要达到「能给 30+ 人会场分享」的程度
- 4 个车轮卡住的常见原因：麻木 / 停在问题 / 脱离实践 / 缺乏反思
- 分类：career/learning + cognition + problem-driven-learning + 学习车轮 + 双环学习
- 登记 AI 编程资源：Moore-developers/moore-wechat-article-downloader 公众号内容情报库 Skill → products/moore-wechat-article-downloader.md
- 同步挂到 [[guide-ai-ai-programming-resources]]「生产力与知识管理」分类 + wiki index
- 核心：4 大场景（同步/研究/微信收藏/链接归档）+ SQLite 状态管理 + 评论互动写回 Markdown
- 与本仓 [[wiki-ingest-article]] 互补：本仓 skill 偏精读归档，moore 偏批量同步
- 采集阿加曦《AdSense 美国税务信息填写指南》→ sources/adsense-us-tax-form.md（精读 + 15 张操作截图）
- **核心要点**：W-8BEN 表 10 分钟填表 + 三大预扣税率（YouTube 版税 10% / AdSense 服务 0% / 电影电视版税 10%）
- 关键易错点：姓名必须写拼音（ZHANG SAN）+ 外国纳税人识别号填身份证 + 必须选 W-8BEN（中国非美国人）
- 3 工作日审核通过（Google 提示 7 天）
- 同步挂入 wiki index + indie-hub 专栏索引
- 分类：indie-hub + adsense + w-8ben + 跨境变现 + 广告变现
- 采集空格丶《做了个专写 10 万+ 标题 Skill，创作必备》→ sources/baokuan-title-generator-skill.md（精读 + 7 张配图）
- 新建产品页 [[product-baokuan-title-generator-skill]]：SpaceZephyr/creator-buddy 仓库下的标题 Skill
- **核心洞察**：公众号新规则下「震惊体」已死 → 口语化 / 观点 / 接地气 / 情绪化 容易火
- **16 种标题模板**：数字反差 / 生活痛点 / 揭秘 / 对话剧本 / 悬念留白 / 极值 / 认知反转 / 隐藏机制 / 场景画面 ...
- **双模型协同方法论**：fable5（精准戳中人）+ GPT-5.6（覆盖广）= 锋利方法 + 完整框架
- 两种用法：①大纲→标题（推荐）②文章→换标题
- 与 [[sources/agent-launch-personal-site]] 同作者（空格丶）
- 分类：indie-hub + vibe-writing + title-skill + 公众号 + AI-创作 + creator-buddy

## [2026-07-17] X 推文批量采集（7 条）

- **Tw93**(@HiTw93)《非技术人上手 AI Coding》→ guide/ai/tw93-ai-coding-non-tech.md（精读 + 21 张配图）
- **知识猫图解**(@GeekCatX)《用 Codex 快速入门任何领域》→ guide/ai/geekcat-codex-domain-learning.md（精读 + 1 张配图）
  - 核心：把 Codex 当「领域学习工程师」，搭建可运行/可迭代/可测试的学习仓库
  - 方法：AGENTS.md + Skills + 知识地图 + 练习题 + 测验 + 项目 + 复盘
- **苍何**(@canghe)《腾讯 WorkBuddy 实战蓝皮书》→ guide/ai/canghe-workbuddy-bluebook.md（精读 + 17 张配图）
  - 核心：5 人联合开源 WorkBuddy 蓝皮书，覆盖安装/日常办公/实战案例
  - 分类：indie-hub + 工具 + 腾讯 + WorkBuddy
- **季白羽**(@vbjby3)《Codex + Remotion 唐朝纸片分层动画》→ guide/ai/vbjby3-codex-remotion-tang.md（精读 + 5 张配图）
  - 核心：分层素材制作 + Remotion 代码驱动运动的完整视频流水线
- **Adrian Punk**(@AdrianPunk115)《黄蓝配色扁平大字封面 Prompt》→ prompts/design/adrianpunk-yellow-blue-prompt.md（精读 + 4 张配图）
  - 核心：深蓝+明黄+暖白扁平化封面提示词模板
- **淘沙者**(@Etudecn)《2026 年构建你的第一个 AI 循环》→ guide/ai/etudecn-2026-ai-loop.md（精读 + 10 张配图）
  - 核心：从手动 prompt → 循环设计（OpenClaw + Claude Code 循环实例）
- **Kimberly**(@king1818888)《Codex 图书号视频全流程》→ guide/ai/king18188-codex-book-video.md（精读 + 1 张配图）
  - 核心：选题→文案→语音→剪辑→成片的完整 AI 工作流
- 采集方式：baoyu-danger-x-to-markdown（bun 脚本 thread 模式）
- 图片：59 张，下载到各 guide/ai/images/ 对应目录
- 分类：ai-tools + AI-Coding + video + prompt + 循环 + 工作流

## [2026-07-17] Docker MySQL 教程归档

- **内容**：Docker 安装 MySQL 完整流程（快速启动→持久化→中文字符集→管理命令）
- **路径**：guide/dev/docker/docker-mysql-setup.md
- **核心**：Volume 挂载实现数据持久化，my.cnf 配置 utf8mb4
- 分类：devops + docker + mysql + 数据库

## [2026-07-20] 空格丶《50 Skills AI 创作系统》

- **内容**：空格丶的50个 Skill 串成四层创作系统（数据→创作→排版→分发）
- **路径**：columns/indie-hub/50-skills-ai-creation-system/index.md
- **核心洞察**：收藏100个 Skill 不如把自己的10个串成系统
- **四层架构**：数据层（RSS/YouTube/播客/OCR）→ 创作层（热点/标题/全文）→ 排版层（封面/PPT/视频）→ 分发层（待建）
- **三个仓库**：read-buddy / creator-buddy / design-buddy
- **产品化**：Cowrite（Codex 可视化创作工作台）
- **图片**：8 张
- 分类：indie-hub + AI-创作 + skill系统 + 内容工厂 + 四层架构

## [2026-07-20] 采集《简单聊聊 Agent 自进化》
- **来源**：微信公众号
- **作者**：haoran
- **文件**：sources/guard-model-evolution.md
- **摘要**：从 Model、Harness、Artifact 三个维度解析 Agent 自进化，将自进化分为产物迭代优化、Harness 系统进化、模型学习三类，提出判断自进化的三个问题
- **图片**：6 张（已下载到 wiki/images/guard-model-evolution/）


## [2026-07-20] skill-system-prompt-design

- **变更类型**：sources 新增
- **文件**：`wiki/sources/skill-system-prompt-design.md`
- **图片**：30 张（`wiki/images/skill-system-prompt-design/`）
- **描述**：AI代码生成率94%——腾讯企业微信团队用 Skill 跑通需求开发全流程。8阶段流水线、五步定位法、三级金字塔知识库、红线机制、跨会话知识传承（TECH_SPEC.md）。

---

## [2026-07-20] feat(search): enable local search on Vercel

- **变更类型**：config 变更
- **文件**：`docs/.vitepress/config.js`
- **描述**：去掉 `isLowMemoryBuild` 对搜索的限制，Vercel 上启用 VitePress 本地全文搜索。同时修复 `skill-system-prompt-design.md` 中 Vue 模板解析错误（`<xxx>` 标签用反引号包裹）。
- **验证**：本地构建 101.71s 通过，Vercel 构建成功，搜索框正常显示。

---

## [2026-07-20] top10-agent-skills-for-frontend-product-ui

- **变更类型**：sources 新增 + skills 安装
- **文件**：`columns/vibe-coding-and-design/top10-agent-skills-for-frontend-product-ui.md`
- **描述**：Pas 推荐的面向前端/产品/UI 的 10 个 Agent Skills。含 frontend-design、figma-implement-design、playwright、react-best-practices 等。
- **安装状态**：9/10 已安装到 `.claude/skills/`（frontend-skill 在 OpenAI 仓库中不存在）
- **来源仓库**：openai/skills、anthropics/skills、vercel-labs/agent-skills

## [2026-07-21] Ahrefs SEO 系统教程采集

**操作**：批量采集 Ahrefs 官方中文版 SEO 教程（10 篇）
**位置**：`columns/indie-hub/seo/ahrefs/`
**文章**：
1. SEO 基础知识 (seo-basics)
2. 搜索引擎如何工作 (how-do-search-engines-work)
3. AI 搜索引擎如何工作 (how-ai-search-engines-work)
4. AI 对 SEO 意味着什么 (what-ai-means-for-seo)
5. 关键词研究 (keyword-research)
6. 页面 SEO (on-page-seo)
7. SEO 内容 (seo-content)
8. 技术 SEO (technical-seo)
9. 链接建设 (link-building)
10. 本地 SEO (local-seo)

**图片**：约 190 张已下载到本地 `images/` 目录
**编排**：按学习路径分三阶段（理解搜索引擎 → 核心技能 → 进阶策略）
**更新**：seo/index.md 增加系统教程板块

## [2026-07-22] spec-superflow-intro 采集

**操作**：采集微信公众号文章对比 Matt Pocock skills 与 spec-superflow 工作流
**位置**：`sources/spec-superflow-intro.md`
**图片**：6 张已下载到 `images/spec-superflow-intro/`
**摘要**：Matt Pocock 开源 agent skills 以 small/composable 理念提供 /grill-me、/tdd 等独立 skill，适合个人项目和英文生态；spec-superflow 通过 8 状态路由和 execution-contract 硬约束强制「Spec First」，适合中文团队和大项目。作者建议小需求用 Matt 快速过，大功能走 spec-superflow。

## [2026-07-27] Linux 上使用 Draw.io Desktop 命令行功能

**操作**：归档 Draw.io Desktop 在 Linux 上的安装与 CLI 导出方法
**位置**：`sources/linux-drawio-desktop-cli.md`
**内容**：5 种安装方式（Snap / AppImage / DEB / Flatpak / Docker），drawio CLI 导出命令示例，rlespinasse/drawio-cli 已废弃提示

## [2026-07-30] ingest: Matt Pocock wayfinder + handoff

**操作**：归档微信公众号文章《Matt Pocock wayfinder + handoff：AI Agent 跨 5 次会话接力赛不掉链》至 sources/
**位置**：`sources/h1httNlFmRqN9jyOAO380A.md`
**图片**：4 张已下载到 `images/h1httNlFmRqN9jyOAO380A/`
**内容摘要**：Matt Pocock 的 wayfinder（多会话共享地图）与 handoff（会话边界交接）接力协议解析。smart zone vs dumb zone 机制（~120K tokens 阈值），三场景选择框架（main flow / handoff / wayfinder），5 次会话接力真实案例，setup-matt-pocock-skills 地基说明

## [2026-07-28] ingest: 林一 Cloudflare Zero Trust Access ingest: 林一 Cloudflare Zero Trust Access

**操作**：归档微信公众号文章《林一的 Cloudflare 通关记》第 12 篇至 sources/
**位置**：`sources/9BiipNeCgOvBnVvCzY0FkA.md`
**图片**：6 张已下载到 `images/9BiipNeCgOvBnVvCzY0FkA/`
**内容摘要**：零信任（Zero Trust）网络安全模型——"永不信任，始终验证"，vs 传统城堡模型。Cloudflare Access 免费 50 用户实现零信任访问控制，身份即服务（IdaaS）概念，Access 工作原理（反向代理 + JWT 验证 + 策略引擎），与阿里云 IDaaS/腾讯云身份管家对比

**操作**：归档微信公众号文章《Matt Pocock wayfinder + handoff：AI Agent 跨 5 次会话接力赛不掉链》至 sources/
**位置**：`sources/h1httNlFmRqN9jyOAO380A.md`
**图片**：4 张已下载到 `images/h1httNlFmRqN9jyOAO380A/`
**内容摘要**：Matt Pocock 的 wayfinder（多会话共享地图）与 handoff（会话边界交接）接力协议解析。smart zone vs dumb zone 机制（~120K tokens 阈值），三场景选择框架（main flow / handoff / wayfinder），5 次会话接力真实案例，setup-matt-pocock-skills 地基说明

## [2026-07-31] ingest: OpenCodex 统一管理 Codex 模型切换

**操作**：归档微信公众号文章《用 OpenCodex 统一管理 Codex 的模型切换》至 sources/
**位置**：`sources/Saq_dHCQ40IbHRgJPOdWDw.md`
**图片**：6 张已下载到 `images/Saq_dHCQ40IbHRgJPOdWDw/`
**内容摘要**：OpenCodex 本地代理层解决 Codex 多模型切换痛点——以前换模型需开工具改配置重启 Codex 导致 session 丢失，现在 Codex 固定指向本地 OpenCodex（127.0.0.1:10100），所有上游 provider 在 OpenCodex 统一管理，session 不丢失

## [2026-07-31] ingest: Matt Pocock 三类 on-ramp 分流

**操作**：归档微信公众号文章《周一 30 issue + 3 bug + 1 新模块：先做哪个？Matt Pocock 用 3 条 on-ramp 帮你分流》至 sources/
**位置**：`sources/Obn3th61vpLSsi7eZs-DKg.md`
**图片**：5 张已下载到 `images/Obn3th61vpLSsi7eZs-DKg/`
**内容摘要**：Matt Pocock 三类 on-ramp 输入分类器：/triage（别人提的 issue）、/diagnosing-bugs（突然变红的回归 bug）、/wayfinder（模糊新模块）。按输入来源分类，不是按优先级。判断依据是来源和形态，不是工作量大小。

## [2026-07-31] ingest: MCP 为什么不用 RPC 协议

**操作**：归档微信公众号文章《MCP 为什么不用 RPC 协议》至 sources/
**位置**：`sources/IkiF31FcXDrd2zmliufxJQ.md`
**图片**：7 张已下载到 `images/IkiF31FcXDrd2zmliufxJQ/`
**内容摘要**：MCP（Model Context Protocol）与 RPC 协议的核心差异——MCP 是 pub/sub 模式而非请求/响应，tool call 是双向 streaming，支持 concurrent requests，不是传统 RPC 的 C/S 模型

---

## [2026-07-31] ingest: MCP 新版本无状态可缓存可扩展

**操作**：归档微信公众号文章《一文看懂 MCP 新版本：无状态、可缓存、可扩展》至 sources/
**位置**：`sources/mcp-new-version-stateless-cacheable-scalable.md`
**图片**：3 张已下载到 `images/mcp-new-version-stateless-cacheable-scalable/`
**内容摘要**：MCP 2026-07-28 最大更新——从有会话双向 RPC 变为无状态请求/响应协议。移除 initialize 握手和 Mcp-Session-Id，改用 MRTR 多轮往返请求替代 Server-to-Client RPC，支持缓存（ttlMs/cacheScope）、按需订阅、Tasks 正式扩展、OAuth 签发校验

---

## [2026-07-31] ingest: Linux 内核进程上下文切换

**操作**：归档微信公众号文章《不懂上下文切换，无法真正吃透 Linux 内核进程管理》至 sources/
**位置**：`sources/linux-kernel-context-switch.md`
**图片**：1 张已下载到 `images/linux-kernel-context-switch/`
**内容摘要**：从原理到源码到线上排查，全面讲解 Linux 进程上下文切换——本质是 CPU 执行权转移，进程 vs 线程切换开销差异来自地址空间，switch_to 汇编核心栈切换，EEVDF 取代经典 CFS，线上排查工具链（vmstat/pidstat/perf sched）

---

## [2026-07-31] ingest: 数字产品副业

- **Source**: 微信公众号 (小拾随语)
- **Images**: 1 张已下载到 `images/sell-digital-products/`
- **Content**: 数字产品副业指南：PDF/Prompt/模板，国内卖19.9国外卖9美元，Gumroad/Payhip/Sellfy/Stan Store 平台对比
- **Concepts**: [[digital-products-side-income]]

---

## [2026-07-31] ingest: Mission Driver Loop Engineering

- **Source**: 微信公众号 (可逆计算)
- **Images**: 4 张已下载到 `images/mission-driver-loop-engineering/`
- **Content**: Mission Driver 声明式任务驱动引擎，多层 Loop 嵌套实现局部容错与稳定保障，AGE 理论核心组件。22 天 154 模块 ERP 实战案例
- **Concepts**: [[mission-driver]] [[loop-engineering]]

---

## [2026-08-04] ingest: AI 资产地图

- **Source**: 微信公众号 (云与数字化)
- **Images**: 无外部图片
- **Content**: 企业 100+ Agent 管理盲区（资产/责任/权限/依赖/审计）→ AI 资产地图三层能力（注册表/关系/控制面）→ 八类信息 → 六条关系 → CMDB 扩展 → 动态授权 → 四步建立最小可用地图 → 12 问自检清单
- **Concepts**: [[ai-asset-map]] [[agent-governance]] [[cmdb-extension]]

---

## [2026-08-05] ingest: Milvus 3.0 官宣开源

- **Source**: 微信公众号 (运维有术)
- **Images**: 4 张配图至 images/milvus-3.0-open-source/
- **Content**: Milvus 3.0.0 GA 深度解读 — Storage V3 / Loon manifest 列存 → 4 个改变工作流的能力（Online Schema / External Collection / TEXT + Sparse Index / Woodpecker WAL）→ 3 个门槛 + 2 个已知 bug → 3.1 路线图
- **Concepts**: [[milvus-3.0]] [[vector-database]] [[lake-native-architecture]]

---

## [2026-08-05] ingest: Linux 火焰图

- **Source**: 微信公众号 (goldbeef)
- **Images**: 1 张配图至 images/linux-flame-graph/
- **Content**: Linux 性能分析火焰图 — 6 种类型（On-CPU / Off-CPU / Wakeup / Off-Wakeup / Page Fault / Memory），万物皆可火焰图的核心思想
- **Concepts**: [[flame-graph]] [[linux-performance-analysis]]

---

## [2026-08-06] ingest: 独立开发者赚钱方法拆解

- **Source**: 微信公众号 (空格丶)
- **Images**: 13 张已下载到 `images/bilibili-history-money-method/`
- **Content**: 独立开发者通过「用户群体、产品形态、收费模式」三维度找需求，以 B 站无限历史记录插件为例，拆解如何找到「官方不管、用户很痒、有人愿意付钱」的需求
- **Concepts**: [[indie-product]] [[product-market-fit]] [[personal-developer]]

---

## [2026-08-06] ingest: setup-matt-pocock-skills 深度解析

- **Source**: 微信公众号 (运维有术)
- **Images**: 5 张已下载到 `images/setup-matt-pocock-skills-not-script/`
- **Content**: 深入拆解 Matt Pocock Skills 体系中 setup-matt-pocock-skills 的设计哲学——prompt-driven 对话式配置，先 explore 再提问，把「工单在哪、标签叫什么、文档放哪」三个决策落地
- **Concepts**: [[setup-matt-pocock-skills]] [[engineering-skills]] [[agent-configuration]]

---

## [2026-08-06] ingest: FFmpeg 9.0 Lei 版

- **Source**: 微信公众号 (风筝)
- **Images**: 5 张已下载到 `images/ffmpeg-9-lei/`
- **Content**: FFmpeg 9.0 代号「Lei」纪念中国音视频开发者雷霄骅，回顾 FFmpeg 26 年历史、Fabrice Bellard 传奇、以及 FFmpeg 在 AI 时代作为核心基础设施的地位
- **Concepts**: [[ffmpeg-9-lei]] [[ffmpeg]] [[multimedia-framework]]

---

## [2026-08-06] ingest: 复杂业务团队的 AI Coding 交付实践

- **Source**: 微信公众号 (物流技术)
- **Images**: 22 张已下载到 `images/ai-coding-delivery-practice/`
- **Content**: 复杂业务场景下 AI 研发交付的实践方案，三层架构（命令协议层/知识资产层/RD 过程资产层），分层知识库设计（main/applications/candidate/personal/template），文件化 RD 流程，前置质量门禁
- **Concepts**: [[AI-coding-delivery]] [[RD-flow]] [[layered-knowledge-base]] [[quality-gate]]
- **New page**: [[concepts/ai-coding-delivery]]

---

## [2026-08-06] ingest: LLM 缓存机制详解

- **Source**: 微信公众号 (朱小厮的博客)
- **Images**: 5 张已下载到 `images/llm-cache-mechanism/`
- **Content**: LLM 缓存三层机制——模型内部的 KV Cache、显存优化（GQA/PagedAttention/量化/淘汰）、跨请求前缀缓存（Prompt Caching），以及 Claude Code 与 Codex 的工程实践对比
- **Concepts**: [[KV-cache]] [[prefix-caching]] [[prompt-caching]] [[llm-inference-optimization]]
- **New page**: [[concepts/llm-cache-mechanism]]

---

## [2026-08-06] ingest: 医疗知识图谱智能问答机器人

- **Source**: GitHub (liuhuanyong / 同济子豪兄)
- **Images**: 5 张已下载到 `images/medical-kg-qa/`
- **Content**: 基于 Neo4j 的医疗知识图谱问答系统，7 类实体 4.4 万、11 类关系 30 万，18 类问答意图，实体识别 + 意图分类 + Cypher 查询
- **Concepts**: [[medical-kg-qa]] [[knowledge-graph]] [[neo4j]]
- **New page**: [[concepts/medical-kg-qa]]

---

## [2026-08-06] ingest: 虚拟内存发明历程

- **Source**: 微信公众号 (xiaokang1998)
- **Images**: 7 张已下载到 `images/virtual-memory-invention/`
- **Content**: 从物理寻址到虚拟内存的完整推导：重定位→覆盖→分页→MMU→缺页中断→TLB，以及隔离保护/空间放大/碎片化分配三大价值
- **Concepts**: [[virtual-memory-invention]] [[virtual-memory]] [[paging]]

---
## 2026-08-22

### 新增来源文章

| 时间 | 来源 | 标题 | 链接 | 分类 |
|------|------|------|------|------|
| 2026-08-22 12:20 | [Mozilla Public Suffix List](https://publicsuffix.org/list/public_suffix_list.dat) | Public Suffix List (公共后缀列表) | https://publicsuffix.org/list/public_suffix_list.dat | 技术参考 |

## [2026-08-08] ingest: 哥飞 AdSense 系列文章 5 篇

- **Source 1**: [AdSense 提交网站申请的小细节](./sources/adsense-site-application-details.md) — 必须先验证 ads.txt 文件，再验证 JS 代码段，最后提交
- **Images**: 11 张到 `images/adsense-site-application-details/`
- **Concepts**: [[adsense-site-application-details]]

- **Source 2**: [AdSense 账号注册、审核、网站审核经验](./sources/adsense-account-registration.md) — 完整注册流程，养号、双验证、流量优先审核
- **Images**: 12 张到 `images/adsense-account-registration/`
- **Concepts**: [[adsense-account-registration]]

- **Source 3**: [AdSense Pin 码与实名认证](./sources/adsense-pin-verification.md) — Pin 码平信丢失处理，人工审核上身份证+地标照
- **Images**: 3 张到 `images/adsense-pin-verification/`
- **Concepts**: [[adsense-pin-verification]]

- **Source 4**: [SEO+AdSense 收入从 800 到 2000 美元](./sources/adsense-seo-800-to-2000.md) — 技术重写+站内 SEO+广告位优化，三管齐下
- **Images**: 25 张到 `images/adsense-seo-800-to-2000/`
- **Concepts**: [[adsense-seo-800-to-2000]]

- **Source 5**: [英文站 AdSense 赚钱入门 8000 字](./sources/adsense-english-site-guide.md) — 单域名单词策略、站内 SEO 细节、工具站 vs 内容站选择
- **Images**: 10 张到 `images/adsense-english-site-guide/`
- **Concepts**: [[adsense-english-site-guide]]

## [2026-08-11] ingest: 程序员的数学修养

- 归档 Evernote 笔记《程序员的数学修养》(李烨) 至 sources/programmer-math-cultivation.md
- 内容摘要：讨论程序员是否需要数学、AI 是否依赖数学、数学的碎片化学习特征、AI 技术岗必需的数学知识清单（微积分/概率统计/线性代数/最优化方法）、以人为轴和手脑并用的学习方法、数学思维的训练方法。包含主动学习 vs 被动学习理论、数学符号系统、桶排序/栈/优先级队列等算法示例。

## [2026-08-11] ingest: 程序员能力层次与思考力三要素

- 归档原创整理《程序员能力层次与思考力三要素》至 sources/programmer-skill-hierarchy.md
- 无配图
- 内容摘要：程序员能力四层次（软能力/模式和思想/语言和平台/框架和库），四个常见误区，思考力三要素（大小/方向/作用点）

## [2026-08-11] ingest: 珍藏许久的短句——50句治愈语录

- 归档微博文章《珍藏许久的短句——50句治愈语录》至 sources/treasured-quotes.md
- 无配图
- 内容摘要：50句经典名言语录合集，涵盖村上春树、莎士比亚、泰戈尔、尼采、木心等中外名家，以及人生感悟、现代人崩溃无声等独立段落。来源为作文纸条/微博。

## [2026-08-11] ingest: 关于代码编写习惯与设计思想

- 归档原创整理《关于代码编写习惯与设计思想》至 sources/coding-habits-and-design-thinking.md
- 无配图
- 内容摘要：讨论编码习惯 vs 规范、设计思想（解耦/抽象/封装）、初学者成长方式、学习 API 框架与理解实现原理的层次关系（使用→实现→设计思想），以及代码量越少越好、findbug 检查、性能与可读性的权衡等实践心得。
## [2026-08-12] ingest: 多 Agent 子 Agent 通信

- 归档《多 Agent 项目中，子 Agent 之间是如何通信的？》微信公众号至 sources/multi-agent-communication.md
- 下载 7 张配图至 images/multi-agent-communication/
- 内容摘要：主流多 Agent 编码工具（Claude Code / Codex / Anthropic Research）中子 Agent 基本不直接通信，采用"编排者—执行者"父子树拓扑；两条通道（任务下发+压缩摘要回传、产物直接写文件系统）；Claude Code 三档（Subagents / Agent Teams / CLI 管道）；多 Agent token 投入约单 Agent 15 倍，性能约高 90.2%
## [2026-08-12] ingest: Hermes Agent LLM Wiki Skill

- 归档 Hermes Agent 官方文档《Karpathy's LLM Wiki》至 sources/hermes-llm-wiki-skill.md
- 无配图
- 新增 summaries/hermes-llm-wiki-skill.md，更新 concepts/llm-wiki.md 与 index.md
- 内容摘要：Hermes v2.1.0 将 LLM Wiki 落实为可执行协议，覆盖会话定向、三层架构、来源 SHA-256 漂移检测、页面阈值、冲突与置信度标记，以及 Ingest/Query/13 步 Lint 三种核心操作
- 交叉引用：[[concepts/llm-wiki]]、[[concepts/ai-rd-automation-wiki-skill]]、[[concepts/harness-engineering]]

## [2026-08-12] ingest: Harness 工程理论溯源

- 归档《【AI Harness 系列】追本溯源，从"科学管理"和"老三论"看 Harness 工程》微信公众号至 sources/harness-engineering-scientific-management.md
- 下载 4 张配图至 images/harness-engineering-scientific-management/
- 内容摘要：AI Harness 工程的理论溯源——泰勒科学管理（价值治理）、控制论（动态稳态）、系统论（全局架构）、信息论（数据底座），三层双向闭环运行体系
>>>>>>> 4aac4d05 (prompt: 采集 Harness 工程理论溯源文章)

## [2026-08-12] ingest: Coding Agent 项目记忆五步法

- 归档 Phodal《别再反复教 Coding Agent：让项目记住自己如何工作的五个步骤》微信公众号至 sources/coding-agent-project-memory-five-steps.md
- 下载 6 张配图至 images/coding-agent-project-memory-five-steps/（5 张压缩为 JPEG）
- 内容摘要：Better Harness 框架下的 Agent Work Loop 五步法——AGENTS.md 项目地图、核心文档知识路由、Skill 提炼、CLI/MCP 工程接口、经验闭环沉淀

## [2026-08-12] ingest: 得物复合检索 Agent 系统设计

- 归档 得物技术《知识问答：复合检索 Agent 的系统设计实践》微信公众号至 sources/dewu-knowledge-qa-composite-retrieval-agent.md
- 下载 11 张配图至 images/dewu-knowledge-qa-composite-retrieval-agent/（1 张 GIF→PNG，1 张 PNG→JPEG 压缩）
- 内容摘要：基于 AgentScope 2.0 HarnessAgent 架构的复合检索系统——四源融合检索（知识库+飞书文档/消息/妙记）、三阶段质量 Pipeline（FastPass→Reranker→LLM Grading）、Agent 自主决策+Middleware 兜底、多模态截图即提问、多实例 SSE 断点续传

## [2026-08-12] ingest: 设备树本质解读

- 归档《扒一扒设备树的外皮，看看它本质上是在做什么？》微信公众号至 sources/device-tree-essentials.md
- 下载 2 张配图至 images/device-tree-essentials/（001 压缩为 JPEG）
- 内容摘要：设备树原理入门——硬件描述与驱动逻辑分离、compatible 匹配机制、reg/interrupts/status 字段、.dtsi 与 .dts 分层

## [2026-08-12] ingest: 虚拟内存发明演进史

- 归档 小康《虚拟内存是如何一步步被发明出来的？》微信公众号至 sources/virtual-memory-step-by-step.md
- 移动 5 张内容配图至 images/virtual-memory-step-by-step/（001 压缩为 JPEG；保留课程广告相关 2 张不归档）
- 内容摘要：分九步推演虚拟内存的诞生——物理内存直操 → 多程序冲突 → 地址重定位 → 覆盖技术 → 虚拟地址假象（MMU）→ 分页页表 → 缺页中断 → TLB 加速 → 隔离/大空间/碎片化三大好处

## [2026-08-13] ingest: Multica 深读

- 归档 朱小厮《Multica 深读：把编码 Agent 变成真正的队友》微信公众号至 sources/multica-deep-dive.md
- 下载 5 张配图至 images/multica-deep-dive/
- 内容摘要：开源 Managed Agents 平台 Multica 架构深读——不造循环只做控制面、三段式架构（前端+Go 后端+本机 Daemon）、一个 Backend 接口封装现成 CLI、一次性流式 vs 持续 stdio 会话、ResumeSessionID 跨 run 恢复、技能/Squads/Autopilot

## [2026-08-13] ingest: Codex + OpenKnowledge + Teach 教学链路

- 归档 摸鱼界AI上分手册《把文档变成课堂》微信公众号至 sources/codex-openknowledge-teach-pipeline.md
- 下载 1 张配图至 images/codex-openknowledge-teach-pipeline/
- 内容摘要：用 Codex（运行层）+ OpenKnowledge CRDT 知识库（存储层）+ teach 技能（教学法层）搭互动教学链路——五环：Codex 配置、OK MCP 集成、URL 抓取、三层知识库门控、teach 合意困难教学，合并享反馈回路自更新

## [2026-08-13] ingest: AI 编码会话边界决策树

- 归档 术哥《AI 编码会话的 5 次边界抉择：为什么 /compact 垫底》微信公众号至 sources/ai-coding-phase-boundaries.md
- 下载 5 张配图至 images/ai-coding-phase-boundaries/（全部压缩为 JPEG，未用 005 已删除）
- 内容摘要：解构 Matt Pocock PHASE-BOUNDARIES.md 五问决策树——6 处 phase boundary 走查、五选项成立条件、一手 vs 二手损耗交换模型、Context Rot 退化来自长度、顺序即逻辑、四个选错反例。核心：能继续就继续，/clear 上下文无关，/handoff 有东西旅行，subagent 能 AFK，/compact 兜底垫底

## [2026-08-13] ingest: ForceInjection Skill 项目周报

- 归档 GrissomFI《AI 原力注入 Skill 项目一周更新综述》微信公众号至 sources/forceinjection-skills-weekly-update.md
- 无配图
- 内容摘要：ForceInjection 四个仓库周更新——awesome-skills 中英双语化+质量治理流程化、DDD 技能验证覆盖补全+子模块→文本引用、OpenSpec-practise 升级 v1.7.0+版本锁定、ai-native-devops 范式综合+案例沉淀

## [2026-08-13] ingest: Pi Agent 接入 DeepSeek-V4-Pro 到 Codex

- 归档 空格丶《用 Pi Agent 把 DeepSeek-V4-Pro 接入 Codex》微信公众号至 sources/pi-agent-deepseek-v4-pro-codex.md
- 下载 15 张配图至 images/pi-agent-deepseek-v4-pro-codex/（011 压缩为 JPEG）
- 内容摘要：Pi Agent（做减法 Harness，千 token 级提示词）+ codex-host 项目嫁接 Codex GUI 与 DeepSeek-V4-Pro，实测前端与 Qwen3.8 相当，工具调用好，性价比极高（1.3 千万 tokens 两块多）

## [2026-08-13] ingest: DSH DeepSeek Harness 与 V4 Pro

- 归档 若飞《DSH 来了：从 DeepSeek V4 Pro 看 Agent 的模型、协议与运行时》微信公众号至 sources/dsh-deepseek-harness-v4-pro.md
- 下载 4 张配图至 images/dsh-deepseek-harness-v4-pro/（QR 码未归档）
- 内容摘要：DeepSeek 三层架构——V4 Pro 模型层（Terminal Bench 87.9/DeepSWE 62.7）、Responses API 协议层（无状态、接入 Codex）、DSH 运行时层（插件式 Cordis 架构、4 种模式、会话事件日志、seam 接缝）、价格切换高峰/非高峰

## [2026-08-13] ingest: 渐进式探索源代码逆向工程 Skill

- 归档 何明璐《基于 Harness 工程和渐进式探索的源代码逆向工程》微信公众号至 sources/harness-progressive-exploration-reverse-engineering.md
- 下载 1 张配图至 images/harness-progressive-exploration-reverse-engineering/
- 内容摘要：九阶段逆向工程 Skill——从"总结报告"到"可导航元模型"（可导航/可钻取/可更新/可验证），三个原则（先地图后细节/先索引后展开/先稳定后可变），六个落地机制（入口索引/深度三档/完成标准/进度检查点/最小上下文/增量重扫），证据分级（事实/推断/假设）对抗记忆漂移，一致性校验 0 ERROR

## [2026-08-14] ingest: /goal 命令实现原理

- 归档 朱小厮《/goal 是怎么实现的：让智能体自己判断「干完了没有」》微信公众号至 sources/goal-command-completion-judgment.md
- 下载 4 张配图至 images/goal-command-completion-judgment/（QR 码未归档）
- 内容摘要：/goal 核心原理——在 Stop 事件上插入完成判定，Haiku 小模型读会话记录判断（证据而非感觉），Codex 版（线程内状态+预算+状态机）vs Claude Code 版（Stop 钩子封装），好目标四要素（终态/验证面/约束/受阻兜底）

## [2026-08-14] ingest: DeepSeek Harness 架构分析

- 归档 唐成《从DeepSeek Harness的架构，看Agent Runtime该怎么设计》至 sources/deepseek-harness-agent-runtime-architecture.md
- 下载 2 张配图至 images/deepseek-harness-agent-runtime-architecture/
- 内容摘要：DSH 无特权核心架构、append-only session log 事件流、Seam 三角色设计、Profile+Bundle+Patch 三层组合、turn/step 两级生命周期

## [2026-08-14] ingest: DSH Agent 蒸馏

- 归档 唐成《DeepSeek Harness做Agent蒸馏——天然蒸馏数据工厂》至 sources/deepseek-harness-agent-distillation.md
- 1 张配图至 images/deepseek-harness-agent-distillation/
- 内容摘要：DSH append-only 事件流天然产出完整 ReAct 轨迹，headless 批量跑任务→JSONL 导出蒸馏数据，session fork 扩充样本多样性，pre-step 钩子过滤脏数据

## [2026-08-14] ingest: 架构文档四段式写法

- 归档 唐成《写架构文档，四段式骨架扛住八成评审追问》至 sources/architecture-document-four-section-framework.md
- 1 张配图至 images/architecture-document-four-section-framework/
- 内容摘要：四段式架构文档（总体方案/详细设计/部署方案/演进规划），每段写法和 Agent 平台案例，强调"决策密度"和"不选什么"

## [2026-08-14] ingest: 技术方案五步法

- 归档 唐成《技术方案总挨批？五步法拆透企业Agent平台》至 sources/technical-proposal-five-step-method.md
- 1 张配图至 images/technical-proposal-five-step-method/
- 内容摘要：五步法（需求介绍→需求分析→复杂度分析→备选方案→360度环评），以企业 Agent 管理平台为贯穿案例，强调数据推导替代拍脑袋

## [2026-08-14] ingest: DSH 插件运行机制深度解析

- 归档 何明璐《深入解析DeepSeek Harness插件运行机制和当前的Harness技术工程能力》至 sources/deepseek-harness-plugin-architecture-deep-dive.md
- 4 张配图至 images/deepseek-harness-plugin-architecture-deep-dive/
- 内容摘要：DSH 四层架构（装配层→Cordis运行时→Agent控制层→能力生态层），Cordis 插件机制（Context/Service/Event/Effect），Agent Loop Turn/Step 生命周期，8 大核心能力插件化实现

## [2026-08-14] ingest: BFF 架构实践指南

- 归档 面汤放盐-uzong《BFF 架构实践指南》至 sources/bff-architecture-practice-guide.md
- 无配图（19 张均为重复的装饰性节分割图，已清理）
- 内容摘要：BFF vs API 网关区别、数据聚合（CompletableFuture/Reactor）两种方式、避坑指南、落地约束、拆分方案、Trade-off 讨论

## [2026-08-14] ingest: AI Native 团队协同重构

- 归档 天猫技术团队《重构协同：关于AI Native团队的思考》至 sources/ai-native-team-collaboration-rethink.md
- 2 张配图至 images/ai-native-team-collaboration-rethink/（006.jpg 压缩 596KB→112KB，010.png 127KB）
- 内容摘要：消费侧 vs 生产侧分析，串联者从人→Agent，AI Native 三层形态（知识底座+Agent+人），软件是被固化的知识，存量业务知识底座三道坎

## [2026-08-14] ingest: 批量上站 30 站仅赚 30 美金

- 归档 易焘《看完圈友自动化上站赚3700刀，我也冲了：30个站，只赚了30美金》至 sources/bulk-website-building-30-sites-30-dollars.md
- 6 张配图至 images/bulk-website-building-30-sites-30-dollars/（流量和收入截图）
- 内容摘要：用 AI Skills 批量上站 30 个出海游戏网站，有流量但收入仅 30 美金，反思自动化是放大器而非印钞机，先跑通 0~1 更重要

## [2026-08-14] ingest: Cloudflare 部署游戏站指南

- 归档 易焘《学会这样部署出海游戏站，每年帮你省下几千上万》至 sources/cloudflare-deploy-game-website.md
- 无配图（35 张均为 Cloudflare UI 操作截图，已清理）
- 内容摘要：CF 添加域名→切换 Nameserver→GitHub 提交代码→CF Pages 部署→绑定自定义域名，全程免费

## [2026-08-14] ingest: 出海游戏站简单指南

- 归档 易焘《出海游戏网站，比你想象的要简单得多》至 sources/overseas-game-website-simple-guide.md
- 1 张配图至 images/overseas-game-website-simple-guide/
- 内容摘要：开发游戏站≠开发游戏，通过 iframe 嵌入 HTML5 游戏，三种实现方式（纯静态/NextJS/WordPress）

## [2026-08-14] ingest: Pi AI 编程 Agent 解析

- 归档 苏三《为什么越来越多人用 Pi？》至 sources/pi-ai-coding-agent-popularity.md
- 2 张配图至 images/pi-ai-coding-agent-popularity/（webp 误标→重命名为 jpg）
- 内容摘要：Pi 由 libGDX 创始人 Mario Zechner 开源，200 Token 系统提示词+4 原语工具，99.93% 缓存命中率，不锁模型支持 15+ 供应商，兼容 Claude Code Skill/AGENTS.md，MIT 开源

## [2026-08-14] ingest: 数据治理五大概念辨析

- 归档 商业智能研究《数据治理最容易混淆的5个概念》至 sources/data-governance-concepts.md
- 15 张配图至 images/data-governance-concepts/
- 内容摘要：系统辨析元数据、数据元、元模型、数据字典、数据模型五个概念的定义、区别和实际治理中的联动关系

## [2026-08-14] ingest: 闲置域名做游戏站

- 归档 王杨《别把闲置域名当摆设！手搓几个游戏站试一下！》至 sources/idle-domain-game-site.md
- 1 张配图至 images/idle-domain-game-site/
- 内容摘要：利用闲置域名通过九游 CPS 搭建游戏站，手动搬运游戏和资讯内容实现域名价值变现

## [2026-08-14] ingest: 游戏养站系统工具

- 归档 王杨《40块1个站点游戏下载站模板+海量游戏数据的SEO功能游戏养站系统》至 sources/game-seo-system.md
- 24 张功能截图至 images/game-seo-system/
- 内容摘要：一套面向入门 SEO 站长的游戏养站系统，集成 400 套模板、CPS 接口、自动文章更新、蜘蛛池、友链部署等功能

## [2026-08-14] ingest: 游戏下载站成本核算

- 归档 王杨《游戏下载站养站30个网站成本核算明细分享》至 sources/game-station-cost-breakdown.md
- 无配图（纯文字成本计算）
- 内容摘要：30 个游戏下载站年成本约 6090 元（域名 1590 + 服务器 2500 + 技术支持 2000），回收单个小站约 5000-8000 元

## [2026-08-14] ingest: 游戏下载行业入门指南

- 归档 王杨《1篇文章带你入门游戏下载行业！学会不用求人！》至 sources/game-download-industry-entry.md
- 3 张配图至 images/game-download-industry-entry/
- 内容摘要：三步入门游戏下载行业——找高权重站参考内容、接入游戏 CPS 后台、保持日常更新

## [2026-08-14] ingest: 下载站小站模式

- 归档 王杨《下载站又出8000！一定要掌握小站模式规律！》至 sources/small-station-model.md
- 1 张配图至 images/small-station-model/
- 内容摘要：分享小站模式五大要点——只选下载行业、COM 域名优先、首页收录是前提、外链接要多、注重出站历史价值

## [2026-08-14] ingest: DeepSeek Harness 开源解析

- 归档 林大友《Agent = Model + Harness：DeepSeek 把模型的「壳」开源了》至 sources/deepseek-harness.md
- 提炼概念页至 concepts/deepseek-harness-agent-formula.md
- 6 张配图至 images/deepseek-harness/（压缩后）
- 内容摘要：DeepSeek 开源 DeepSeek Harness（dsh），提出 Agent = Model + Harness 公式，一切皆插件架构、极简模式、可追溯会话日志、开源定地基圈生态

## [2026-08-15] ingest: BestBlogs 早报

- 归档 ginobefun《BestBlogs 早报 · 08-15》至 sources/bestblogs-2026-08-15.md
- 7 张配图至 images/bestblogs-2026-08-15/（004 压缩）
- 内容摘要：三篇精讲——GLM-5.3 编程/网络安全能力迁移（Terminal-Bench 4.6→28.3）、Addy Osmani 实用循环工程（goal vs loop + 执行验证分离）、大淘宝 AI Native 团队（编码≠交付，三层结构+知识底座）；速览含开放模型观察、DeepTutor 34K Star、dLLM、LTX-2.5 等

## [2026-08-15] archive: OpenKnowledge

- 归档 Inkeep《OpenKnowledge：AI 原生 Markdown IDE 与 LLM Wiki》至 sources/open-knowledge-inkeep.md
- 无配图（GitHub 项目页）
- 内容摘要：Inkeep 开源 AI 原生 Markdown IDE 和 LLM Wiki 工具，3458 Stars，GPL-3.0，关联 llm-wiki-karpathy、pkm、second-brain 等概念，与本站 LLM Wiki 实践方向一致

## [2026-08-15] ingest: 流动摩擦概念

- 归档 Phodal《设计流动摩擦：AI 原生团队的核心能力》至 sources/flow-friction-ai-team.md
- 提炼概念页至 concepts/flow-friction.md
- 2 张配图至 images/flow-friction-ai-team/（压缩后）
- 内容摘要：AI 将开发变成最快环节后，需求/设计/Review/测试之间的节奏不匹配成为真正的瓶颈；三种摩擦表现（上游饥饿+下游拥堵、歧义固化成代码、并行开发增加共有成本）+ 设计流动摩擦六节点

## [2026-08-15] ingest: Mission Driver 补充说明

- 归档 可逆计算《关于 Mission Driver：Loop Engineering 的一种通用参考实现的补充说明》至 sources/mission-driver-supplement.md
- 提炼概念页至 concepts/age-mission-driver.md
- 1 张配图至 images/mission-driver-supplement/
- 内容摘要：AGE 吸引子引导工程体系（状态空间/吸引子/轨迹/控制四概念）、与 Harness 和 Loop Engineering 的层级关系、Mission Driver 与普通工作流引擎的三大根本区别、与 LoopX 的对比、三层"AI 全自动"定义、nop-app-erp 22 天案例、关键命题"不是让 Agent 记住项目，而是让项目本身不再遗忘自己"

## [2026-08-15] ingest: DeepSeek + Pi 王炸组合

- 归档 Tina《DeepSeek + Pi 王炸组合跑赢 Claude Code？》至 sources/pi-deepseek-benchmark.md
- 提炼概念页至 concepts/harness-multiplier-effect.md
- 9 张配图至 images/pi-deepseek-benchmark/（压缩后）
- 内容摘要：Composio 用 DeepSeek V4 Flash 在 8 种 Harness 中跑 30 项高难度任务，Pi Agent 66.7% 成功率第一（$0.028/任务，Claude Code $0.195）；Harness 乘数效应，干净 Harness 胜率逻辑；DeepSeek 前缀缓存机制（Reasonix 五原则 + pi-deepseek-cache 三层设计），成本降幅 98-99%；DeepSeek 官方 Harness 即将发布


## [2026-08-15] ingest: 我做了个「一键生成学习网站」的 skill

- 归档大风AI编程《我做了个「一键生成学习网站」的 skill，把自己惊艳到了》至 sources/student-learning-website-builder.md
- 8 张配图（课程设计模板、Trae 操作界面、网站开发过程、成功案例）
- 内容摘要：作者将课程设计→教学设计→互动网站全流程打包为 student-learning-website-builder skill，用 Trae 辅助开发，十天压缩到十分钟。核心亮点：8 模块互动学习网站、AI 苏格拉底式学习伙伴、四维素养雷达图、纯 HTML 零框架双击即开，比 PPT 多出了动手能力、AI 交互和进度追踪


## [2026-08-15] ingest: 如何半小时上线一个小游戏网站

- 归档哥飞《如何半小时上线一个小游戏网站》至 sources/half-hour-game-site.md
- 42 张配图（域名注册、Cloudflare DNS、GitHub 创建仓库、Claude 代码生成、Vercel 部署、自定义域名配置、最终上线效果）
- 内容摘要：以 MemoryTest.io 为例，演示从选域名到 Vercel 部署的完整流程：域名注册 → Cloudflare DNS 迁移 → GitHub 创建仓库 → Claude 生成 game.html → Vercel Import 部署 → 自定义域名 + SSL（Cloudflare 完全严格模式）→ Claude 生成 SEO 落地页。核心结论：半小时可上线一个小游戏站，一小时含写文章讲解


## [2026-08-15] ingest: 刘小排 5 分钟做个网站

- 归档刘小排《5 分钟做个网站，人人都能学会》至 sources/bolt-new-5min-site.md（哥飞转载）
- 11 张配图（Bolt.new 生成界面、生成效果、代码结构、clicktest.me 案例、变现说明、部署截图等）
- 内容摘要：用 Bolt.new + Claude 五步 Prompt 5 分钟生成运势网站。核心观点：语文功底 > 技术能力。推荐付费测试产品方向（MBTI、智商测试），变现三步走（流量→广告→付费），流量流派（SEO/投放/大V/自传播）


## [2026-08-15] ingest: Cordis 到底解决了什么

- 归档架构师（JiaGouX）《Cordis 到底解决了什么：DSH 与 Pi 的两种答案》至 sources/cordis-dsh-vs-pi.md
- 4 张配图（对比图、两条变化路径、SessionStore 回收机制、签名图）
- 内容摘要：Cordis（@deepseek-ai/cordis@4.0.1）是 DSH 的插件生命周期管理器。Pi 把清理交给扩展作者（session_shutdown/session_start），DSH 借 Cordis 把跨插件关系记进运行时。Cordis 回答三个问题：系统想让谁运行（Loader）、资源由谁撤销（Fiber+effect）、依赖失效影响谁（Service+inject）。DSH 有两条 Provider 变化路径：注册表路径（轻，调用时取当前）和 Service 拓扑路径（重，让旧 Consumer 退出）。所有权规则：谁通过 ctx.effect() 登记副作用，撤销责任就跟着谁。生成器 effect 支持半途失败回滚


## [2026-08-15] ingest: Day 90 收官 出海工具站全路径清单

- 归档袁锐钦《Day 90 收官：90 天 89 篇，出海工具站真正剩下的只有这一页清单》至 sources/day-90-checklist.md
- 无配图
- 内容摘要：90 天出海工具站系列收官，六阶段全路径清单（启动期 Day1-15→流量期 Day16-30→变现期 Day31-45→规模化期 Day46-60→进阶技术期 Day61-80→搜索型出海 Day81-90），三条贯穿教训（标题案例钩子/新词>热词/止损线），一页纸可贴显示器执行清单


## [2026-08-15] ingest: 外贸独立站避开内卷 纯血小语种策略

- 归档 SEO 小平《外贸独立站：避开内卷，选择大于努力》至 sources/fxiaoyuan-site-seo.md
- 7 张配图（内卷现状、本地工厂逻辑、本土域名、关键词挖掘、视频AI翻译、联系方式、微信二维码）
- 内容摘要：外贸工厂英语市场内卷严重，建议转向纯血小语种独立站。核心三要素：100%本土化（.de/.fr/.jp域名+本地服务器）、SEM/Ahrefs挖真实搜索量关键词、AI原生创作而非机器翻译。全渠道优势：SEO竞争1/3、广告点击成本低30%、品牌信任高、生成式搜索红利


## [2026-08-15] ingest: 前端 Skill 驱动的团队 AI Coding 实践

- 归档王僖（阿里云团队）《前端 Skill 驱动的团队 AI Coding 实践》至 sources/frontend-skill-team-coding.md
- 14 张配图（封面、技术债、认知转变、五维结构、样板、案例图表、国际化对比、R2C 流程、结语动画）
- 内容摘要：把前端规范做成 Skill 前置到 AI 写代码前，解决全员 AI Coding 下的风格漂移/技术栈错配/自创轮子问题。an-frontend-skill 五维结构：When(触发场景)/What(选型矩阵)/Don't+Why(8条硬约束)/How(4套样板)/Map(设计+国际化)。落地四案例：Status看板3周/CFD升级3天(原1-2周)/AIOps设计直码复用率70-80%/国际化三平台2周(原2月)。R2C 需求转代码 8 阶段全链路。核心观点：能力沉淀>个人提效，Skill 是把底线抬高而非让强者更快


## [2026-08-15] ingest: Node 搭 Agent 实战 LangChain.js v1 公众号流水线

- 归档唐成《Node 搭 Agent 实战：用 LangChain.js v1 手把手跑通公众号流水线》至 sources/langchain-agent-wechat.md
- 1 张配图（流水线架构图）
- 内容摘要：七步搭 Agent 流水线（接 DeepSeek/MCP/Skill 排版/SubAgent 写作/ReActAgent/Harness 外壳/跑通日志）。LangChain.js v1 + LangGraph.js v1.4.9 选型理由。DeepSeek V4 双模型分工（flash 主控编排/pro 写作）。8 个避坑（模型名/API 弃用/MCP peer 依赖/doocs/md 装不来/MemorySaver 双重挂等）。核心观点：Agent = 一个会调工具的循环 + 一层会打回重做的外壳


## [2026-08-15] ingest: 多 Agent 系统的设计哲学

- 归档架构精进之路《多 Agent 系统的设计哲学》至 sources/multi-agent-design.md
- 8 张配图（封面、六层架构、天花板、角色边界、通信方式、反模式、结语动画、签名）
- 内容摘要：多 Agent 六层架构（任务/编排/Agent/工具/记忆/评估）；单 Agent 四天花板（上下文/角色冲突/缺乏对抗/无法并行）；五种角色（Manager/Explorer/Developer/Reviewer/Tester）；三种协作模式（中心化/流水线/对等协商）；四种通信方式（结构化输出/Manager中转/共享文件/环境变量）；七项生产难点（可观测/可恢复/权限/成本/冲突/人工/验证）；五实践五反模式；七判断标准


## [2026-08-21] ingest: 哥飞 SEO Agent 对 Mulan.pro 的 SEO 诊断报告

- 归档哥飞《SEO Agent 对 Mulan.pro 的 SEO 诊断报告》至 sources/mulan-pro-seo-diagnosis.md
- 无配图（原文纯文字）
- 内容摘要：哥飞 SEO Agent 对 Mulan.pro（AI 视频工作流产品）进行完整 SEO 诊断，发现八个问题：纯前端渲染（首 HTML 仅 2.4KB 空壳）、根目录按浏览器语言跳转、robots/sitemap 被跳回首页、不存在 URL 返回 200（soft 404）、测试环境被 Google 收录、无 canonical/hreflang、无 H1/内链/OG/JSON-LD、关键词全为品牌词。修复顺序：① SSR/SSG 渲染 + 稳定根目录 ② 补齐 robots/sitemap + 错误状态 ③ 隔离测试环境 ④ 完善页面信号和关键词入口。核心观点：团队从一开始就没把 SEO 放进网站建设流程，先让 Google 拿到正确页面，再谈关键词建设



## [2026-08-21] ingest: QwenPaw 2.1.0 Checkpoint 功能展示

- 归档 QwenPaw《读懂 QwenPaw 2.1.0｜Agent 会话「存档点」：Checkpoint 功能展示》至 sources/qwenpaw-210-checkpoint.md
- 新增专栏文章至 columns/qwenpaw/checkpoint-guide.md
- 无配图（原文纯文字，含大量重复格式行，已清洗重建）
- 内容摘要：QwenPaw 2.1.0 新增 Checkpoint 功能（类似游戏存档点）。三种节点：命名快照（手动，不参与 GC）/ 自动检查点（按数量时间规则清理）/ 恢复前安全点（恢复前自动创建）。恢复范围：当前会话（默认含）/ 长期记忆（默认不含）/ 工作区文件（预览后选）。七条魔法命令：/checkpoint、auto、snapshot、timeline、restore、gc、reset。关键参数：--dry-run 预览 / --confirm 确认 / --include-memory / --include-files / --files / --all-sessions / --compact。与项目 .git/ 分离，恢复后形成新时间线分支。核心价值：Agent 走偏时提供可靠返回点


## [2026-08-15] ingest: Agent Sandbox K8s SIG 项目

- 归档希里安（阿里云）《Agent Sandbox》至 sources/agent-sandbox-k8s.md
- 无配图
- 内容摘要：Kubernetes SIG 项目 kubernetes-sigs/agent-sandbox，在 K8s 上用声明式 API 管单实例、有状态、得隔离的沙箱运行时。核心 CRD：Sandbox（稳定身份+持久存储+生命周期）、SandboxTemplate、SandboxWarmPool（预热池）、SandboxClaim。真正强隔离交给 RuntimeClass 背后的 gVisor/Kata。Agent 链路中只管执行环境层（跑代码/装依赖/落文件/联网），不管推理规划和工具协议。四个值得关注的理由：Workload 形态在变/安全默认升档/冷启动体验/可编程消费

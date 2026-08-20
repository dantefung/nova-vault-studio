---
title: "我的Harness 工程化和脚手架实践"
author: "王江华"
date: "2026年8月20日 08:08"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/zOgLaXwMjgarsXJ7E0vXmA"
---

# 我的Harness 工程化和脚手架实践

阅读本文大约需要 10 分钟。大家好，我是 华仔。
，倒计时8天，正在观望的粉丝朋友们还有要加入的吗？星球月底要涨价了，请抓紧时间，小红书自主旅游规划项目已完结，如下图所示，截至目前星球总共更新完成6个实战项目，其中4个AI项目，尤其是这个 agentscope2.0 + harness 实战，企业级刚需实战项目，星球交付方式：0-1文档教程+代码+群答疑。另外这个 Harness 跨语言脚手架项目代码基本开发完成，已开放给球友们使用，正在热更教程中（这是从小红书自主规划旅游项目提炼出来的想法并最终落地实战项目，非常实用，价值很大）：简单测试效果：使用 /harness-me 进行需求打磨：使用/harnessing 进行规格构建：新项目大纲清单：已更新8篇：正在增加前端PRD前置转换功能，还在优化完善中，目标打通从产品到研发的全链路：星球限时福利 159，28号要涨价了，还在观望的粉丝们请抓紧时间如果需要请仔细看完，非常超值，不需要的请划走。
，数量有限，先到先得，
来自球友的评价：众所周知，AI Agent 的岗位需求量越来越大。头部的互联网大厂，比如说阿里、字节、腾讯等等都在大量招 Agent 工程师。根据球友们的反馈，不管是大厂还是小厂的面试官，都越来越喜欢考察 Agent 的底层原理和实现细节。于是我做了一个大胆的决定。自己用 Claude Code 构建《AgentScope 小红书旅游规划项目》，是一个基于多 Agent + SDD + Harness Engineering + CC VibeCoding + Skills + AgentScope 构建自主决策 Agent，大纲如下：项目已完结，现在加入正合适，需要的抓紧来哦：普通调度模式完整调度日志：Plan Mode 是一种两阶段执行模型，将一次旅游规划任务拆分为起草阶段和执行阶段，中间插入人工确认环节，这种模式适用于需要人类审核方案关键决策的场景。用户输入 → 起草阶段（Plan Mode ON）  → LLM 仅可调用 plan_write，将初步方案写入 PLAN.md  → 暂停，等待人工确认（CONFIRM / REJECT）  → 执行阶段（Plan Mode OFF）  → LLM 恢复全部 Toolkit，执行完整规划  → 输出 TripPlanResultPlan计划调度模式（详细调度流程请加入星球查看，有录制视频）：全链路数据持久化覆盖从用户请求提交到最终方案落库的完整生命周期，涉及Redis（短期缓存 + 状态）、ReMe（长期记忆）、MySQL（审计 + 业务持久化）三层存储。一次完整的行程规划流程（完整调度请加入星球查看）：SupervisorAgent 是唯一一个「同时维护两条完整可用编排路径」的 Agent。前四个子 Agent 的「AI Native 原生路」vs 「确定性直路」区别只在于「要不要接入 LLM」，而 Supervisor 的两条路径分别对应两种完全不同的委派机制：关于 agent_spawn 一次委派的完整生命周期：Skills 技能目录结构：MCP 响应解析 &amp; 容错设计：项目中用到的 AgentScope 2.0 新特性：AgentScope 2.0 工具系统三层架构：AgentScope 2.0 提供两层 Agent 实现：前端效果如下，增加了桌面端效果：下面展示前三篇的部分内容，每篇1万+字内容，基本上把整个项目工程的架构设计、harness 构建思路、模块划、系统工程化分都写清楚了，加入星球即可查看：
，数量有限，先到先得，
01 自主旅游规划1.1 前言2026 年，AI Agent 真正进入落地爆发期。会使用大模型，调 API 的工程师很多，但真正能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」和「可交付代码」结合起来的人并不多。谁能把这几件事打通，谁就不再只是「只会接模型的人」，而是在向「Agent 架构师」进行升级。下面我就结合正在落地的一套 Java AgentScope 小红书旅游规划项目，手把手拆开讲清楚：一套能自主规划旅游行程的多 Agent 系统，到底应该怎么从 0 到 1 设计、分模块研发、逐步交付。项目的核心定位是：这是一款 Java AgentScope 小红书旅游规划 AI Agent 项目，多 Agent + SDD 思想 + Harness Engineering 规范 + CC VibeCoding + Skills 构建自主决策 Agent。下面我会从整体上带你看清这套 Agent 项目的总架构、方法论、工程约束和流水线。1.2 为什么用旅游规划旅游规划是一个非常典型的 Agent 场景。因为它天然不是一个单点问答问题，而是一条完整的任务链：用户先提出模糊意图，比如我想去云南玩 5 天，预算 8000，喜欢美食和小众路线。系统要先理解需求，再去找参考内容。找到内容之后，还要「景点推荐」、「路线规划」、「行程编排」、「成本预算」。最后还要判断方案「是否合理」、「是否超预算」、「是否需要人工确认」。这类问题最适合用多 Agent 来做，而不是一个超级大 Prompt 一把梭，原因很简单：一个大模型擅长综合生成，但不擅长长期稳定地「分工」、「追踪」、「校验」。真正复杂的业务，必须把「理解」、「分析」、「规划」、「验证」、「交付」拆成多个角色和多个阶段。一旦拆分后，再配上工程规范和 Skills，系统才会从「会回答」变成「会交付」。所以，旅游规划不是噱头，而是一个刚好能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」等全部串起来的最佳方案。02 项目架构2.1 多 Agent 自主协同系统这套系统的目标不是「生成一份旅游建议」，而是产出一份「完整」、「合理」、「可确认」、「可落地」的 TripPlan。核心角色有 5 个：SupervisorAgent：总控负责理解用户意图、拆解任务、汇总结果。XHSAnalysisAgent：负责分析小红书笔记，挖掘热门玩法、景点和内容偏好。RouteAgent：负责路线规划，调用地图能力做交通与距离计算。ItineraryAgent：负责把景点、餐饮、时间槽编排成每日行程。BudgetAgent：负责费用拆分、预算校验、超支预警。它们之间不是乱调接口，而是通过 A2A 协议协作，Supervisor 统一调度，形成一个完整的规划闭环。整体架构图如下：这个架构规划很重要，因为很多人做 Agent 项目时，一开始就掉进「工具堆砌」的坑里。但真正靠谱的做法，永远是先定义「角色」，再定义「通信」，再定义「边界」，最后才是「实现功能」。2.2 SDD &amp; Harness思想很多人提 SDD 只停留在「先写 Spec」、「再写代码」，但如果没有强约束，它最后还是会变成一堆没人维护的文档。这套项目的做法更实用：用 change.md 承接需求卡、验收标准、边界条件、影响面。用 Owner Agent 负责理解需求和调度技能。用六阶段开发 Skills 来代替松散的人工流程。用编译、测试、架构约束、评审、部署验证来当门禁。这就把「规范驱动开发」从理念变成了工程实践，简单说：SDD 解决「先想清楚再写」。Harness Engineering 解决「想清楚之后，怎么稳定的推荐并被验证可用」。两者不是冲突关系，而是上下层关系。
，数量有限，先到先得，
2.2.1 CLUADE.md整个项目全程是通过 CC Opus 4.8 来完成的，我就是 review 和确定了下相关版本。太长了，具体看项目代码：https://gitcode.com/huazaiteam/huazai-trip-plan/blob/agent-chapter-1(加入星球开通后即可查看)2.2.2 harness 工程规范约束.harness/rules/ 三规范：工程结构 / 编码规范 / 开发流程规范.harness/skills/ 六技能：①~⑥ 流水线步骤定义（含 frontmatter + status 流转）.harness/wiki/ 四文档：业务模型 / 接口协议 / 数据模型 / 架构决策（领域真相来源）.harness/changes/ + _TEMPLATE/：变更追踪约定 + 三件套模板（change/review/verify）+ 状态机.harness/agents/owner.md：Owner Agent 的定义（流水线总编排者）CLAUDE.md 作为 AI 协作入口（地图模式，按需加载 .harness/ 各组件）上下文分层模型：Layer0 系统级 / Layer1 项目级(CLAUDE.md + owner.md) / Layer2 约束级(rules) / Layer3 领域级(wiki) / Layer4 运行时(ReMe).claude/settings.json 权限策略与 Hooks（Allow Maven/Docker/Git/Java、Deny 危险操作、PostToolUse Hook）2.2.3 总结Harness 工程规范约束 = SDD + 六阶段开发流水线 + 多 Agent + Skills + 变更可追踪 + 知识库沉淀 + 工程规则。目标：把 AgentScope 从能回答问题升级为可研发、可协作、可交付的企业级系统。2.3 真正让项目跑稳的是六阶段自动化开发流水线这套项目最重要的，不是某个 Agent 写得多炫，而是整个研发过程严格走这 6 步：request-analysiscoding-skillunit-test-writeexpert-reviewerunit-test-cideploy-verify对应含义分别是：需求分析：把一句模糊需求变成结构化 change 卡。编码实现：在明确约束下落代码。单测编写：覆盖核心逻辑，确保关键路径能回归。专家评审：从设计、规范、边界、风险等多维度审视实现。CI 门禁：用 Checkstyle、PMD、ArchUnit、测试等机械化拦截问题。部署验证：做冒烟、健康检查、回滚预案。这一套流程的价值在于，它把「AI 写代码」变成了「AI 按约束规范写代码」。这次的核心不是「把 5 个 Agent 写出来」，而是「把 5 个 Agent 写对」，那么就要盯住下面这 4 件事。2.4.1 多 Agent 协同必须通过 A2A 真正跑起来不是5 个 Agent 目录代码创建了就算完成，必须真的实现：2.4.2 开发 change 清单为了项目能顺利推进，按当前模式，后续会按照下面这批 change 执行：C-001 project-bootstrappingC-002 quality-gatesC-003 infra-bootstrapC-004 common-modelsC-005 a2a-foundationC-006 xhs-agentC-007 route-agentC-008 itinerary-agentC-009 budget-agentC-010 supervisor-agentC-011 server-apiC-012 e2e-main-flowC-013 frontend-main-flowC-014-pdf-exportC-015-reme-memory-ragC-016-observability-reliability所有的 Change 都会严格按照 SDD + TDD + Harness 规范执行并正确落地。2.5 Owner Agent 很多同学理解多 Agent 时，容易只盯着业务 Agent。但在工程实践里，真正最关键的往往是「总编排者」。在项目里，Owner Agent 并不是业务里的 Supervisor，而是开发过程中的总控角色。它的职责不是生成旅游方案，而是负责：理解需求调用合适的开发 Skill对照 rules 守住边界控制上下文加载跟踪 changes 状态发现风险时停下来请求人工决策换句话说，Owner Agent 是「研发流程层的总控 Agent」，必须关心：当前处在哪个阶段该读哪些上下文哪些决策可以自动做哪些决策必须人工确认改动是否可追溯是否能断点续传这就是 Owner Agent 存在的意义。下图定义了 Owner Agent 如何编排 .harness/skills/ 下 6 个开发技能，把产品轴上的每个 feature 生产出来。2.6 两类 Skills，不要搞混了这是我在项目里特别强调的一件事，这里的 Skills 分两类：第一类是开发 Skills，在 .harness/skills/ 下。第二类是业务 Skills，在 huazai-trip-skills/ 模块里。2.6.1 开发 Skills开发 Skills 服务的是怎么造项目，比如：需求分析编码实现写单测评审CI 校验部署验证2.6.2 业务 Skills业务 Skills 服务的是Agent 运行时能做什么，比如：路线规划费用计算行程拼装内容分析导出能力很多人第一次做 Agent 系统时，会把 Skills 当成纯 Tool，其实不够。在一个成熟项目里，Skills 至少有两层含义：对开发期来说，Skill 是生产流程的标准动作。对运行期来说，Skill 是 Agent 可复用的业务能力单元。一旦把这两层分开，整个项目的组织会清晰很多。
，数量有限，先到先得，
02 其他项目 &amp; 专栏



阅读本文大约需要 10 分钟。



阅读本文大约需要 10 分钟。



大家好，我是 华仔。
，倒计时8天，正在观望的粉丝朋友们还有要加入的吗？星球月底要涨价了，请抓紧时间，小红书自主旅游规划项目已完结，如下图所示，截至目前星球总共更新完成6个实战项目，其中4个AI项目，尤其是这个 agentscope2.0 + harness 实战，企业级刚需实战项目，星球交付方式：0-1文档教程+代码+群答疑。



另外这个 Harness 跨语言脚手架项目代码基本开发完成，已开放给球友们使用，正在热更教程中（这是从小红书自主规划旅游项目提炼出来的想法并最终落地实战项目，非常实用，价值很大）：



简单测试效果：使用 /harness-me 进行需求打磨：使用/harnessing 进行规格构建：新项目大纲清单：



简单测试效果：



使用 /harness-me 进行需求打磨：使用/harnessing 进行规格构建：新项目大纲清单：



使用 /harness-me 进行需求打磨：



使用/harnessing 进行规格构建：



新项目大纲清单：



已更新8篇：



正在增加前端PRD前置转换功能，还在优化完善中，目标打通从产品到研发的全链路：



星球限时福利 159，28号要涨价了，还在观望的粉丝们请抓紧时间



如果需要请仔细看完，非常超值，不需要的请划走。
，数量有限，先到先得，
来自球友的评价：众所周知，AI Agent 的岗位需求量越来越大。头部的互联网大厂，比如说阿里、字节、腾讯等等都在大量招 Agent 工程师。根据球友们的反馈，不管是大厂还是小厂的面试官，都越来越喜欢考察 Agent 的底层原理和实现细节。于是我做了一个大胆的决定。自己用 Claude Code 构建《AgentScope 小红书旅游规划项目》，是一个基于多 Agent + SDD + Harness Engineering + CC VibeCoding + Skills + AgentScope 构建自主决策 Agent，大纲如下：项目已完结，现在加入正合适，需要的抓紧来哦：普通调度模式完整调度日志：Plan Mode 是一种两阶段执行模型，将一次旅游规划任务拆分为起草阶段和执行阶段，中间插入人工确认环节，这种模式适用于需要人类审核方案关键决策的场景。用户输入 → 起草阶段（Plan Mode ON）  → LLM 仅可调用 plan_write，将初步方案写入 PLAN.md  → 暂停，等待人工确认（CONFIRM / REJECT）  → 执行阶段（Plan Mode OFF）  → LLM 恢复全部 Toolkit，执行完整规划  → 输出 TripPlanResultPlan计划调度模式（详细调度流程请加入星球查看，有录制视频）：全链路数据持久化覆盖从用户请求提交到最终方案落库的完整生命周期，涉及Redis（短期缓存 + 状态）、ReMe（长期记忆）、MySQL（审计 + 业务持久化）三层存储。一次完整的行程规划流程（完整调度请加入星球查看）：SupervisorAgent 是唯一一个「同时维护两条完整可用编排路径」的 Agent。前四个子 Agent 的「AI Native 原生路」vs 「确定性直路」区别只在于「要不要接入 LLM」，而 Supervisor 的两条路径分别对应两种完全不同的委派机制：关于 agent_spawn 一次委派的完整生命周期：Skills 技能目录结构：MCP 响应解析 &amp; 容错设计：项目中用到的 AgentScope 2.0 新特性：AgentScope 2.0 工具系统三层架构：AgentScope 2.0 提供两层 Agent 实现：前端效果如下，增加了桌面端效果：下面展示前三篇的部分内容，每篇1万+字内容，基本上把整个项目工程的架构设计、harness 构建思路、模块划、系统工程化分都写清楚了，加入星球即可查看：
，数量有限，先到先得，
01 自主旅游规划1.1 前言2026 年，AI Agent 真正进入落地爆发期。会使用大模型，调 API 的工程师很多，但真正能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」和「可交付代码」结合起来的人并不多。谁能把这几件事打通，谁就不再只是「只会接模型的人」，而是在向「Agent 架构师」进行升级。下面我就结合正在落地的一套 Java AgentScope 小红书旅游规划项目，手把手拆开讲清楚：一套能自主规划旅游行程的多 Agent 系统，到底应该怎么从 0 到 1 设计、分模块研发、逐步交付。项目的核心定位是：这是一款 Java AgentScope 小红书旅游规划 AI Agent 项目，多 Agent + SDD 思想 + Harness Engineering 规范 + CC VibeCoding + Skills 构建自主决策 Agent。下面我会从整体上带你看清这套 Agent 项目的总架构、方法论、工程约束和流水线。1.2 为什么用旅游规划旅游规划是一个非常典型的 Agent 场景。因为它天然不是一个单点问答问题，而是一条完整的任务链：用户先提出模糊意图，比如我想去云南玩 5 天，预算 8000，喜欢美食和小众路线。系统要先理解需求，再去找参考内容。找到内容之后，还要「景点推荐」、「路线规划」、「行程编排」、「成本预算」。最后还要判断方案「是否合理」、「是否超预算」、「是否需要人工确认」。这类问题最适合用多 Agent 来做，而不是一个超级大 Prompt 一把梭，原因很简单：一个大模型擅长综合生成，但不擅长长期稳定地「分工」、「追踪」、「校验」。真正复杂的业务，必须把「理解」、「分析」、「规划」、「验证」、「交付」拆成多个角色和多个阶段。一旦拆分后，再配上工程规范和 Skills，系统才会从「会回答」变成「会交付」。所以，旅游规划不是噱头，而是一个刚好能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」等全部串起来的最佳方案。02 项目架构2.1 多 Agent 自主协同系统这套系统的目标不是「生成一份旅游建议」，而是产出一份「完整」、「合理」、「可确认」、「可落地」的 TripPlan。核心角色有 5 个：SupervisorAgent：总控负责理解用户意图、拆解任务、汇总结果。XHSAnalysisAgent：负责分析小红书笔记，挖掘热门玩法、景点和内容偏好。RouteAgent：负责路线规划，调用地图能力做交通与距离计算。ItineraryAgent：负责把景点、餐饮、时间槽编排成每日行程。BudgetAgent：负责费用拆分、预算校验、超支预警。它们之间不是乱调接口，而是通过 A2A 协议协作，Supervisor 统一调度，形成一个完整的规划闭环。整体架构图如下：这个架构规划很重要，因为很多人做 Agent 项目时，一开始就掉进「工具堆砌」的坑里。但真正靠谱的做法，永远是先定义「角色」，再定义「通信」，再定义「边界」，最后才是「实现功能」。2.2 SDD &amp; Harness思想很多人提 SDD 只停留在「先写 Spec」、「再写代码」，但如果没有强约束，它最后还是会变成一堆没人维护的文档。这套项目的做法更实用：用 change.md 承接需求卡、验收标准、边界条件、影响面。用 Owner Agent 负责理解需求和调度技能。用六阶段开发 Skills 来代替松散的人工流程。用编译、测试、架构约束、评审、部署验证来当门禁。这就把「规范驱动开发」从理念变成了工程实践，简单说：SDD 解决「先想清楚再写」。Harness Engineering 解决「想清楚之后，怎么稳定的推荐并被验证可用」。两者不是冲突关系，而是上下层关系。
，数量有限，先到先得，
2.2.1 CLUADE.md整个项目全程是通过 CC Opus 4.8 来完成的，我就是 review 和确定了下相关版本。太长了，具体看项目代码：https://gitcode.com/huazaiteam/huazai-trip-plan/blob/agent-chapter-1(加入星球开通后即可查看)2.2.2 harness 工程规范约束.harness/rules/ 三规范：工程结构 / 编码规范 / 开发流程规范.harness/skills/ 六技能：①~⑥ 流水线步骤定义（含 frontmatter + status 流转）.harness/wiki/ 四文档：业务模型 / 接口协议 / 数据模型 / 架构决策（领域真相来源）.harness/changes/ + _TEMPLATE/：变更追踪约定 + 三件套模板（change/review/verify）+ 状态机.harness/agents/owner.md：Owner Agent 的定义（流水线总编排者）CLAUDE.md 作为 AI 协作入口（地图模式，按需加载 .harness/ 各组件）上下文分层模型：Layer0 系统级 / Layer1 项目级(CLAUDE.md + owner.md) / Layer2 约束级(rules) / Layer3 领域级(wiki) / Layer4 运行时(ReMe).claude/settings.json 权限策略与 Hooks（Allow Maven/Docker/Git/Java、Deny 危险操作、PostToolUse Hook）2.2.3 总结Harness 工程规范约束 = SDD + 六阶段开发流水线 + 多 Agent + Skills + 变更可追踪 + 知识库沉淀 + 工程规则。目标：把 AgentScope 从能回答问题升级为可研发、可协作、可交付的企业级系统。2.3 真正让项目跑稳的是六阶段自动化开发流水线这套项目最重要的，不是某个 Agent 写得多炫，而是整个研发过程严格走这 6 步：request-analysiscoding-skillunit-test-writeexpert-reviewerunit-test-cideploy-verify对应含义分别是：需求分析：把一句模糊需求变成结构化 change 卡。编码实现：在明确约束下落代码。单测编写：覆盖核心逻辑，确保关键路径能回归。专家评审：从设计、规范、边界、风险等多维度审视实现。CI 门禁：用 Checkstyle、PMD、ArchUnit、测试等机械化拦截问题。部署验证：做冒烟、健康检查、回滚预案。这一套流程的价值在于，它把「AI 写代码」变成了「AI 按约束规范写代码」。这次的核心不是「把 5 个 Agent 写出来」，而是「把 5 个 Agent 写对」，那么就要盯住下面这 4 件事。2.4.1 多 Agent 协同必须通过 A2A 真正跑起来不是5 个 Agent 目录代码创建了就算完成，必须真的实现：2.4.2 开发 change 清单为了项目能顺利推进，按当前模式，后续会按照下面这批 change 执行：C-001 project-bootstrappingC-002 quality-gatesC-003 infra-bootstrapC-004 common-modelsC-005 a2a-foundationC-006 xhs-agentC-007 route-agentC-008 itinerary-agentC-009 budget-agentC-010 supervisor-agentC-011 server-apiC-012 e2e-main-flowC-013 frontend-main-flowC-014-pdf-exportC-015-reme-memory-ragC-016-observability-reliability所有的 Change 都会严格按照 SDD + TDD + Harness 规范执行并正确落地。2.5 Owner Agent 很多同学理解多 Agent 时，容易只盯着业务 Agent。但在工程实践里，真正最关键的往往是「总编排者」。在项目里，Owner Agent 并不是业务里的 Supervisor，而是开发过程中的总控角色。它的职责不是生成旅游方案，而是负责：理解需求调用合适的开发 Skill对照 rules 守住边界控制上下文加载跟踪 changes 状态发现风险时停下来请求人工决策换句话说，Owner Agent 是「研发流程层的总控 Agent」，必须关心：当前处在哪个阶段该读哪些上下文哪些决策可以自动做哪些决策必须人工确认改动是否可追溯是否能断点续传这就是 Owner Agent 存在的意义。下图定义了 Owner Agent 如何编排 .harness/skills/ 下 6 个开发技能，把产品轴上的每个 feature 生产出来。2.6 两类 Skills，不要搞混了这是我在项目里特别强调的一件事，这里的 Skills 分两类：第一类是开发 Skills，在 .harness/skills/ 下。第二类是业务 Skills，在 huazai-trip-skills/ 模块里。2.6.1 开发 Skills开发 Skills 服务的是怎么造项目，比如：需求分析编码实现写单测评审CI 校验部署验证2.6.2 业务 Skills业务 Skills 服务的是Agent 运行时能做什么，比如：路线规划费用计算行程拼装内容分析导出能力很多人第一次做 Agent 系统时，会把 Skills 当成纯 Tool，其实不够。在一个成熟项目里，Skills 至少有两层含义：对开发期来说，Skill 是生产流程的标准动作。对运行期来说，Skill 是 Agent 可复用的业务能力单元。一旦把这两层分开，整个项目的组织会清晰很多。
，数量有限，先到先得，
来自球友的评价：
，数量有限，先到先得，
来自球友的评价：
，数量有限，先到先得，
来自球友的评价：
，数量有限，先到先得，
来自球友的评价：
，数量有限，先到先得，
来自球友的评价：
，数量有限，先到先得，
来自球友的评价：



众所周知，AI Agent 的岗位需求量越来越大。头部的互联网大厂，比如说阿里、字节、腾讯等等都在大量招 Agent 工程师。



众所周知，AI Agent 的岗位需求量越来越大。



头部的互联网大厂，比如说阿里、字节、腾讯等等都在大量招 Agent 工程师。



根据球友们的反馈，不管是大厂还是小厂的面试官，都越来越喜欢考察 Agent 的底层原理和实现细节。



于是我做了一个大胆的决定。



自己用 Claude Code 构建《AgentScope 小红书旅游规划项目》，是一个基于多 Agent + SDD + Harness Engineering + CC VibeCoding + Skills + AgentScope 构建自主决策 Agent，大纲如下：



项目已完结，现在加入正合适，需要的抓紧来哦：



普通调度模式完整调度日志：



普通调度模式完整调度日志：



普通调度模式完整调度日志：



普通调度模式完整调度日志：



普通调度模式完整调度日志：



普通调度模式完整调度日志：



普通调度模式完整调度日志：



Plan Mode 是一种两阶段执行模型，将一次旅游规划任务拆分为起草阶段和执行阶段，中间插入人工确认环节，这种模式适用于需要人类审核方案关键决策的场景。用户输入 → 起草阶段（Plan Mode ON）  → LLM 仅可调用 plan_write，将初步方案写入 PLAN.md  → 暂停，等待人工确认（CONFIRM / REJECT）  → 执行阶段（Plan Mode OFF）  → LLM 恢复全部 Toolkit，执行完整规划  → 输出 TripPlanResultPlan计划调度模式（详细调度流程请加入星球查看，有录制视频）：全链路数据持久化覆盖从用户请求提交到最终方案落库的完整生命周期，涉及Redis（短期缓存 + 状态）、ReMe（长期记忆）、MySQL（审计 + 业务持久化）三层存储。一次完整的行程规划流程（完整调度请加入星球查看）：SupervisorAgent 是唯一一个「同时维护两条完整可用编排路径」的 Agent。前四个子 Agent 的「AI Native 原生路」vs 「确定性直路」区别只在于「要不要接入 LLM」，而 Supervisor 的两条路径分别对应两种完全不同的委派机制：关于 agent_spawn 一次委派的完整生命周期：Skills 技能目录结构：MCP 响应解析 &amp; 容错设计：项目中用到的 AgentScope 2.0 新特性：AgentScope 2.0 工具系统三层架构：AgentScope 2.0 提供两层 Agent 实现：前端效果如下，增加了桌面端效果：



Plan Mode 是一种两阶段执行模型，将一次旅游规划任务拆分为起草阶段和执行阶段，中间插入人工确认环节，这种模式适用于需要人类审核方案关键决策的场景。



用户输入 → 起草阶段（Plan Mode ON）



→ LLM 仅可调用 plan_write，将初步方案写入 PLAN.md



→ 暂停，等待人工确认（CONFIRM / REJECT）



→ 执行阶段（Plan Mode OFF）



→ LLM 恢复全部 Toolkit，执行完整规划



→ 输出 TripPlanResult



Plan计划调度模式（详细调度流程请加入星球查看，有录制视频）：



全链路数据持久化覆盖从用户请求提交到最终方案落库的完整生命周期，涉及Redis（短期缓存 + 状态）、ReMe（长期记忆）、MySQL（审计 + 业务持久化）三层存储。一次完整的行程规划流程（完整调度请加入星球查看）：



全链路数据持久化覆盖从用户请求提交到最终方案落库的完整生命周期，涉及Redis（短期缓存 + 状态）、ReMe（长期记忆）、MySQL（审计 + 业务持久化）三层存储。一次完整的行程规划流程（完整调度请加入星球查看）：



全链路数据持久化覆盖从用户请求提交到最终方案落库的完整生命周期，涉及Redis（短期缓存 + 状态）、ReMe（长期记忆）、MySQL（审计 + 业务持久化）三层存储。



一次完整的行程规划流程（完整调度请加入星球查看）：



SupervisorAgent 是唯一一个「同时维护两条完整可用编排路径」的 Agent。前四个子 Agent 的「AI Native 原生路」vs 「确定性直路」区别只在于「要不要接入 LLM」，而 Supervisor 的两条路径分别对应两种完全不同的委派机制：



关于 agent_spawn 一次委派的完整生命周期：



Skills 技能目录结构：



MCP 响应解析 &amp; 容错设计：



项目中用到的 AgentScope 2.0 新特性：



AgentScope 2.0 工具系统三层架构：



AgentScope 2.0 提供两层 Agent 实现：



前端效果如下，增加了桌面端效果：



下面展示前三篇的部分内容，每篇1万+字内容，基本上把整个项目工程的架构设计、harness 构建思路、模块划、系统工程化分都写清楚了，加入星球即可查看：
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
01 自主旅游规划1.1 前言2026 年，AI Agent 真正进入落地爆发期。会使用大模型，调 API 的工程师很多，但真正能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」和「可交付代码」结合起来的人并不多。谁能把这几件事打通，谁就不再只是「只会接模型的人」，而是在向「Agent 架构师」进行升级。下面我就结合正在落地的一套 Java AgentScope 小红书旅游规划项目，手把手拆开讲清楚：一套能自主规划旅游行程的多 Agent 系统，到底应该怎么从 0 到 1 设计、分模块研发、逐步交付。项目的核心定位是：这是一款 Java AgentScope 小红书旅游规划 AI Agent 项目，多 Agent + SDD 思想 + Harness Engineering 规范 + CC VibeCoding + Skills 构建自主决策 Agent。下面我会从整体上带你看清这套 Agent 项目的总架构、方法论、工程约束和流水线。1.2 为什么用旅游规划旅游规划是一个非常典型的 Agent 场景。因为它天然不是一个单点问答问题，而是一条完整的任务链：用户先提出模糊意图，比如我想去云南玩 5 天，预算 8000，喜欢美食和小众路线。系统要先理解需求，再去找参考内容。找到内容之后，还要「景点推荐」、「路线规划」、「行程编排」、「成本预算」。最后还要判断方案「是否合理」、「是否超预算」、「是否需要人工确认」。这类问题最适合用多 Agent 来做，而不是一个超级大 Prompt 一把梭，原因很简单：一个大模型擅长综合生成，但不擅长长期稳定地「分工」、「追踪」、「校验」。真正复杂的业务，必须把「理解」、「分析」、「规划」、「验证」、「交付」拆成多个角色和多个阶段。一旦拆分后，再配上工程规范和 Skills，系统才会从「会回答」变成「会交付」。所以，旅游规划不是噱头，而是一个刚好能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」等全部串起来的最佳方案。02 项目架构2.1 多 Agent 自主协同系统这套系统的目标不是「生成一份旅游建议」，而是产出一份「完整」、「合理」、「可确认」、「可落地」的 TripPlan。核心角色有 5 个：SupervisorAgent：总控负责理解用户意图、拆解任务、汇总结果。XHSAnalysisAgent：负责分析小红书笔记，挖掘热门玩法、景点和内容偏好。RouteAgent：负责路线规划，调用地图能力做交通与距离计算。ItineraryAgent：负责把景点、餐饮、时间槽编排成每日行程。BudgetAgent：负责费用拆分、预算校验、超支预警。它们之间不是乱调接口，而是通过 A2A 协议协作，Supervisor 统一调度，形成一个完整的规划闭环。整体架构图如下：这个架构规划很重要，因为很多人做 Agent 项目时，一开始就掉进「工具堆砌」的坑里。但真正靠谱的做法，永远是先定义「角色」，再定义「通信」，再定义「边界」，最后才是「实现功能」。2.2 SDD &amp; Harness思想很多人提 SDD 只停留在「先写 Spec」、「再写代码」，但如果没有强约束，它最后还是会变成一堆没人维护的文档。这套项目的做法更实用：用 change.md 承接需求卡、验收标准、边界条件、影响面。用 Owner Agent 负责理解需求和调度技能。用六阶段开发 Skills 来代替松散的人工流程。用编译、测试、架构约束、评审、部署验证来当门禁。这就把「规范驱动开发」从理念变成了工程实践，简单说：SDD 解决「先想清楚再写」。Harness Engineering 解决「想清楚之后，怎么稳定的推荐并被验证可用」。两者不是冲突关系，而是上下层关系。
，数量有限，先到先得，
2.2.1 CLUADE.md整个项目全程是通过 CC Opus 4.8 来完成的，我就是 review 和确定了下相关版本。太长了，具体看项目代码：https://gitcode.com/huazaiteam/huazai-trip-plan/blob/agent-chapter-1(加入星球开通后即可查看)2.2.2 harness 工程规范约束.harness/rules/ 三规范：工程结构 / 编码规范 / 开发流程规范.harness/skills/ 六技能：①~⑥ 流水线步骤定义（含 frontmatter + status 流转）.harness/wiki/ 四文档：业务模型 / 接口协议 / 数据模型 / 架构决策（领域真相来源）.harness/changes/ + _TEMPLATE/：变更追踪约定 + 三件套模板（change/review/verify）+ 状态机.harness/agents/owner.md：Owner Agent 的定义（流水线总编排者）CLAUDE.md 作为 AI 协作入口（地图模式，按需加载 .harness/ 各组件）上下文分层模型：Layer0 系统级 / Layer1 项目级(CLAUDE.md + owner.md) / Layer2 约束级(rules) / Layer3 领域级(wiki) / Layer4 运行时(ReMe).claude/settings.json 权限策略与 Hooks（Allow Maven/Docker/Git/Java、Deny 危险操作、PostToolUse Hook）2.2.3 总结Harness 工程规范约束 = SDD + 六阶段开发流水线 + 多 Agent + Skills + 变更可追踪 + 知识库沉淀 + 工程规则。目标：把 AgentScope 从能回答问题升级为可研发、可协作、可交付的企业级系统。2.3 真正让项目跑稳的是六阶段自动化开发流水线这套项目最重要的，不是某个 Agent 写得多炫，而是整个研发过程严格走这 6 步：request-analysiscoding-skillunit-test-writeexpert-reviewerunit-test-cideploy-verify对应含义分别是：需求分析：把一句模糊需求变成结构化 change 卡。编码实现：在明确约束下落代码。单测编写：覆盖核心逻辑，确保关键路径能回归。专家评审：从设计、规范、边界、风险等多维度审视实现。CI 门禁：用 Checkstyle、PMD、ArchUnit、测试等机械化拦截问题。部署验证：做冒烟、健康检查、回滚预案。这一套流程的价值在于，它把「AI 写代码」变成了「AI 按约束规范写代码」。这次的核心不是「把 5 个 Agent 写出来」，而是「把 5 个 Agent 写对」，那么就要盯住下面这 4 件事。2.4.1 多 Agent 协同必须通过 A2A 真正跑起来不是5 个 Agent 目录代码创建了就算完成，必须真的实现：2.4.2 开发 change 清单为了项目能顺利推进，按当前模式，后续会按照下面这批 change 执行：C-001 project-bootstrappingC-002 quality-gatesC-003 infra-bootstrapC-004 common-modelsC-005 a2a-foundationC-006 xhs-agentC-007 route-agentC-008 itinerary-agentC-009 budget-agentC-010 supervisor-agentC-011 server-apiC-012 e2e-main-flowC-013 frontend-main-flowC-014-pdf-exportC-015-reme-memory-ragC-016-observability-reliability所有的 Change 都会严格按照 SDD + TDD + Harness 规范执行并正确落地。2.5 Owner Agent 很多同学理解多 Agent 时，容易只盯着业务 Agent。但在工程实践里，真正最关键的往往是「总编排者」。在项目里，Owner Agent 并不是业务里的 Supervisor，而是开发过程中的总控角色。它的职责不是生成旅游方案，而是负责：理解需求调用合适的开发 Skill对照 rules 守住边界控制上下文加载跟踪 changes 状态发现风险时停下来请求人工决策换句话说，Owner Agent 是「研发流程层的总控 Agent」，必须关心：当前处在哪个阶段该读哪些上下文哪些决策可以自动做哪些决策必须人工确认改动是否可追溯是否能断点续传这就是 Owner Agent 存在的意义。下图定义了 Owner Agent 如何编排 .harness/skills/ 下 6 个开发技能，把产品轴上的每个 feature 生产出来。2.6 两类 Skills，不要搞混了这是我在项目里特别强调的一件事，这里的 Skills 分两类：第一类是开发 Skills，在 .harness/skills/ 下。第二类是业务 Skills，在 huazai-trip-skills/ 模块里。2.6.1 开发 Skills开发 Skills 服务的是怎么造项目，比如：需求分析编码实现写单测评审CI 校验部署验证2.6.2 业务 Skills业务 Skills 服务的是Agent 运行时能做什么，比如：路线规划费用计算行程拼装内容分析导出能力很多人第一次做 Agent 系统时，会把 Skills 当成纯 Tool，其实不够。在一个成熟项目里，Skills 至少有两层含义：对开发期来说，Skill 是生产流程的标准动作。对运行期来说，Skill 是 Agent 可复用的业务能力单元。一旦把这两层分开，整个项目的组织会清晰很多。
，数量有限，先到先得，
01 自主旅游规划1.1 前言2026 年，AI Agent 真正进入落地爆发期。会使用大模型，调 API 的工程师很多，但真正能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」和「可交付代码」结合起来的人并不多。谁能把这几件事打通，谁就不再只是「只会接模型的人」，而是在向「Agent 架构师」进行升级。下面我就结合正在落地的一套 Java AgentScope 小红书旅游规划项目，手把手拆开讲清楚：一套能自主规划旅游行程的多 Agent 系统，到底应该怎么从 0 到 1 设计、分模块研发、逐步交付。项目的核心定位是：这是一款 Java AgentScope 小红书旅游规划 AI Agent 项目，多 Agent + SDD 思想 + Harness Engineering 规范 + CC VibeCoding + Skills 构建自主决策 Agent。下面我会从整体上带你看清这套 Agent 项目的总架构、方法论、工程约束和流水线。1.2 为什么用旅游规划旅游规划是一个非常典型的 Agent 场景。因为它天然不是一个单点问答问题，而是一条完整的任务链：用户先提出模糊意图，比如我想去云南玩 5 天，预算 8000，喜欢美食和小众路线。系统要先理解需求，再去找参考内容。找到内容之后，还要「景点推荐」、「路线规划」、「行程编排」、「成本预算」。最后还要判断方案「是否合理」、「是否超预算」、「是否需要人工确认」。这类问题最适合用多 Agent 来做，而不是一个超级大 Prompt 一把梭，原因很简单：一个大模型擅长综合生成，但不擅长长期稳定地「分工」、「追踪」、「校验」。真正复杂的业务，必须把「理解」、「分析」、「规划」、「验证」、「交付」拆成多个角色和多个阶段。一旦拆分后，再配上工程规范和 Skills，系统才会从「会回答」变成「会交付」。所以，旅游规划不是噱头，而是一个刚好能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」等全部串起来的最佳方案。02 项目架构2.1 多 Agent 自主协同系统这套系统的目标不是「生成一份旅游建议」，而是产出一份「完整」、「合理」、「可确认」、「可落地」的 TripPlan。核心角色有 5 个：SupervisorAgent：总控负责理解用户意图、拆解任务、汇总结果。XHSAnalysisAgent：负责分析小红书笔记，挖掘热门玩法、景点和内容偏好。RouteAgent：负责路线规划，调用地图能力做交通与距离计算。ItineraryAgent：负责把景点、餐饮、时间槽编排成每日行程。BudgetAgent：负责费用拆分、预算校验、超支预警。它们之间不是乱调接口，而是通过 A2A 协议协作，Supervisor 统一调度，形成一个完整的规划闭环。整体架构图如下：这个架构规划很重要，因为很多人做 Agent 项目时，一开始就掉进「工具堆砌」的坑里。但真正靠谱的做法，永远是先定义「角色」，再定义「通信」，再定义「边界」，最后才是「实现功能」。2.2 SDD &amp; Harness思想很多人提 SDD 只停留在「先写 Spec」、「再写代码」，但如果没有强约束，它最后还是会变成一堆没人维护的文档。这套项目的做法更实用：用 change.md 承接需求卡、验收标准、边界条件、影响面。用 Owner Agent 负责理解需求和调度技能。用六阶段开发 Skills 来代替松散的人工流程。用编译、测试、架构约束、评审、部署验证来当门禁。这就把「规范驱动开发」从理念变成了工程实践，简单说：SDD 解决「先想清楚再写」。Harness Engineering 解决「想清楚之后，怎么稳定的推荐并被验证可用」。两者不是冲突关系，而是上下层关系。
，数量有限，先到先得，
2.2.1 CLUADE.md整个项目全程是通过 CC Opus 4.8 来完成的，我就是 review 和确定了下相关版本。太长了，具体看项目代码：https://gitcode.com/huazaiteam/huazai-trip-plan/blob/agent-chapter-1(加入星球开通后即可查看)2.2.2 harness 工程规范约束.harness/rules/ 三规范：工程结构 / 编码规范 / 开发流程规范.harness/skills/ 六技能：①~⑥ 流水线步骤定义（含 frontmatter + status 流转）.harness/wiki/ 四文档：业务模型 / 接口协议 / 数据模型 / 架构决策（领域真相来源）.harness/changes/ + _TEMPLATE/：变更追踪约定 + 三件套模板（change/review/verify）+ 状态机.harness/agents/owner.md：Owner Agent 的定义（流水线总编排者）CLAUDE.md 作为 AI 协作入口（地图模式，按需加载 .harness/ 各组件）上下文分层模型：Layer0 系统级 / Layer1 项目级(CLAUDE.md + owner.md) / Layer2 约束级(rules) / Layer3 领域级(wiki) / Layer4 运行时(ReMe).claude/settings.json 权限策略与 Hooks（Allow Maven/Docker/Git/Java、Deny 危险操作、PostToolUse Hook）2.2.3 总结Harness 工程规范约束 = SDD + 六阶段开发流水线 + 多 Agent + Skills + 变更可追踪 + 知识库沉淀 + 工程规则。目标：把 AgentScope 从能回答问题升级为可研发、可协作、可交付的企业级系统。2.3 真正让项目跑稳的是六阶段自动化开发流水线这套项目最重要的，不是某个 Agent 写得多炫，而是整个研发过程严格走这 6 步：request-analysiscoding-skillunit-test-writeexpert-reviewerunit-test-cideploy-verify对应含义分别是：需求分析：把一句模糊需求变成结构化 change 卡。编码实现：在明确约束下落代码。单测编写：覆盖核心逻辑，确保关键路径能回归。专家评审：从设计、规范、边界、风险等多维度审视实现。CI 门禁：用 Checkstyle、PMD、ArchUnit、测试等机械化拦截问题。部署验证：做冒烟、健康检查、回滚预案。这一套流程的价值在于，它把「AI 写代码」变成了「AI 按约束规范写代码」。这次的核心不是「把 5 个 Agent 写出来」，而是「把 5 个 Agent 写对」，那么就要盯住下面这 4 件事。2.4.1 多 Agent 协同必须通过 A2A 真正跑起来不是5 个 Agent 目录代码创建了就算完成，必须真的实现：2.4.2 开发 change 清单为了项目能顺利推进，按当前模式，后续会按照下面这批 change 执行：C-001 project-bootstrappingC-002 quality-gatesC-003 infra-bootstrapC-004 common-modelsC-005 a2a-foundationC-006 xhs-agentC-007 route-agentC-008 itinerary-agentC-009 budget-agentC-010 supervisor-agentC-011 server-apiC-012 e2e-main-flowC-013 frontend-main-flowC-014-pdf-exportC-015-reme-memory-ragC-016-observability-reliability所有的 Change 都会严格按照 SDD + TDD + Harness 规范执行并正确落地。2.5 Owner Agent 很多同学理解多 Agent 时，容易只盯着业务 Agent。但在工程实践里，真正最关键的往往是「总编排者」。在项目里，Owner Agent 并不是业务里的 Supervisor，而是开发过程中的总控角色。它的职责不是生成旅游方案，而是负责：理解需求调用合适的开发 Skill对照 rules 守住边界控制上下文加载跟踪 changes 状态发现风险时停下来请求人工决策换句话说，Owner Agent 是「研发流程层的总控 Agent」，必须关心：当前处在哪个阶段该读哪些上下文哪些决策可以自动做哪些决策必须人工确认改动是否可追溯是否能断点续传这就是 Owner Agent 存在的意义。下图定义了 Owner Agent 如何编排 .harness/skills/ 下 6 个开发技能，把产品轴上的每个 feature 生产出来。2.6 两类 Skills，不要搞混了这是我在项目里特别强调的一件事，这里的 Skills 分两类：第一类是开发 Skills，在 .harness/skills/ 下。第二类是业务 Skills，在 huazai-trip-skills/ 模块里。2.6.1 开发 Skills开发 Skills 服务的是怎么造项目，比如：需求分析编码实现写单测评审CI 校验部署验证2.6.2 业务 Skills业务 Skills 服务的是Agent 运行时能做什么，比如：路线规划费用计算行程拼装内容分析导出能力很多人第一次做 Agent 系统时，会把 Skills 当成纯 Tool，其实不够。在一个成熟项目里，Skills 至少有两层含义：对开发期来说，Skill 是生产流程的标准动作。对运行期来说，Skill 是 Agent 可复用的业务能力单元。一旦把这两层分开，整个项目的组织会清晰很多。
，数量有限，先到先得，
01 自主旅游规划1.1 前言2026 年，AI Agent 真正进入落地爆发期。会使用大模型，调 API 的工程师很多，但真正能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」和「可交付代码」结合起来的人并不多。谁能把这几件事打通，谁就不再只是「只会接模型的人」，而是在向「Agent 架构师」进行升级。下面我就结合正在落地的一套 Java AgentScope 小红书旅游规划项目，手把手拆开讲清楚：一套能自主规划旅游行程的多 Agent 系统，到底应该怎么从 0 到 1 设计、分模块研发、逐步交付。项目的核心定位是：这是一款 Java AgentScope 小红书旅游规划 AI Agent 项目，多 Agent + SDD 思想 + Harness Engineering 规范 + CC VibeCoding + Skills 构建自主决策 Agent。下面我会从整体上带你看清这套 Agent 项目的总架构、方法论、工程约束和流水线。1.2 为什么用旅游规划旅游规划是一个非常典型的 Agent 场景。因为它天然不是一个单点问答问题，而是一条完整的任务链：用户先提出模糊意图，比如我想去云南玩 5 天，预算 8000，喜欢美食和小众路线。系统要先理解需求，再去找参考内容。找到内容之后，还要「景点推荐」、「路线规划」、「行程编排」、「成本预算」。最后还要判断方案「是否合理」、「是否超预算」、「是否需要人工确认」。这类问题最适合用多 Agent 来做，而不是一个超级大 Prompt 一把梭，原因很简单：一个大模型擅长综合生成，但不擅长长期稳定地「分工」、「追踪」、「校验」。真正复杂的业务，必须把「理解」、「分析」、「规划」、「验证」、「交付」拆成多个角色和多个阶段。一旦拆分后，再配上工程规范和 Skills，系统才会从「会回答」变成「会交付」。所以，旅游规划不是噱头，而是一个刚好能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」等全部串起来的最佳方案。02 项目架构2.1 多 Agent 自主协同系统



01 自主旅游规划



## 01 自主旅游规划



1.1 前言



## 1.1 前言



2026 年，AI Agent 真正进入落地爆发期。



会使用大模型，调 API 的工程师很多，但真正能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」和「可交付代码」结合起来的人并不多。谁能把这几件事打通，谁就不再只是「只会接模型的人」，而是在向「Agent 架构师」进行升级。



下面我就结合正在落地的一套 Java AgentScope 小红书旅游规划项目，手把手拆开讲清楚：一套能自主规划旅游行程的多 Agent 系统，到底应该怎么从 0 到 1 设计、分模块研发、逐步交付。



项目的核心定位是：



> 这是一款 Java AgentScope 小红书旅游规划 AI Agent 项目，多 Agent + SDD 思想 + Harness Engineering 规范 + CC VibeCoding + Skills 构建自主决策 Agent。



下面我会从整体上带你看清这套 Agent 项目的总架构、方法论、工程约束和流水线。



1.2 为什么用旅游规划



## 1.2 为什么用旅游规划



旅游规划是一个非常典型的 Agent 场景。



因为它天然不是一个单点问答问题，而是一条完整的任务链：



这类问题最适合用多 Agent 来做，而不是一个超级大 Prompt 一把梭，原因很简单：



所以，旅游规划不是噱头，而是一个刚好能把「多 Agent 协同」、「自主决策」、「Skills 技能封装」、「工程化约束」等全部串起来的最佳方案。



02 项目架构



## 02 项目架构



## 2.1 多 Agent 自主协同系统



这套系统的目标不是「生成一份旅游建议」，而是产出一份「完整」、「合理」、「可确认」、「可落地」的 TripPlan。核心角色有 5 个：SupervisorAgent：总控负责理解用户意图、拆解任务、汇总结果。XHSAnalysisAgent：负责分析小红书笔记，挖掘热门玩法、景点和内容偏好。RouteAgent：负责路线规划，调用地图能力做交通与距离计算。ItineraryAgent：负责把景点、餐饮、时间槽编排成每日行程。BudgetAgent：负责费用拆分、预算校验、超支预警。它们之间不是乱调接口，而是通过 A2A 协议协作，Supervisor 统一调度，形成一个完整的规划闭环。整体架构图如下：这个架构规划很重要，因为很多人做 Agent 项目时，一开始就掉进「工具堆砌」的坑里。但真正靠谱的做法，永远是先定义「角色」，再定义「通信」，再定义「边界」，最后才是「实现功能」。



这套系统的目标不是「生成一份旅游建议」，而是产出一份「完整」、「合理」、「可确认」、「可落地」的 TripPlan。



核心角色有 5 个：



它们之间不是乱调接口，而是通过 A2A 协议协作，Supervisor 统一调度，形成一个完整的规划闭环。



整体架构图如下：



这个架构规划很重要，因为很多人做 Agent 项目时，一开始就掉进「工具堆砌」的坑里。但真正靠谱的做法，永远是先定义「角色」，再定义「通信」，再定义「边界」，最后才是「实现功能」。



2.2 SDD &amp; Harness思想



## 2.2 SDD &amp; Harness思想



很多人提 SDD 只停留在「先写 Spec」、「再写代码」，但如果没有强约束，它最后还是会变成一堆没人维护的文档。这套项目的做法更实用：用 change.md 承接需求卡、验收标准、边界条件、影响面。用 Owner Agent 负责理解需求和调度技能。用六阶段开发 Skills 来代替松散的人工流程。用编译、测试、架构约束、评审、部署验证来当门禁。这就把「规范驱动开发」从理念变成了工程实践，简单说：SDD 解决「先想清楚再写」。Harness Engineering 解决「想清楚之后，怎么稳定的推荐并被验证可用」。两者不是冲突关系，而是上下层关系。
，数量有限，先到先得，
很多人提 SDD 只停留在「先写 Spec」、「再写代码」，但如果没有强约束，它最后还是会变成一堆没人维护的文档。



这套项目的做法更实用：



这就把「规范驱动开发」从理念变成了工程实践，简单说：



两者不是冲突关系，而是上下层关系。
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
2.2.1 CLUADE.md整个项目全程是通过 CC Opus 4.8 来完成的，我就是 review 和确定了下相关版本。太长了，具体看项目代码：https://gitcode.com/huazaiteam/huazai-trip-plan/blob/agent-chapter-1(加入星球开通后即可查看)



### 2.2.1 CLUADE.md



整个项目全程是通过 CC Opus 4.8 来完成的，我就是 review 和确定了下相关版本。



太长了，具体看项目代码：https://gitcode.com/huazaiteam/huazai-trip-plan/blob/agent-chapter-1(加入星球开通后即可查看)



2.2.2 harness 工程规范约束



### 2.2.2 harness 工程规范约束



.harness/rules/ 三规范：工程结构 / 编码规范 / 开发流程规范.harness/skills/ 六技能：①~⑥ 流水线步骤定义（含 frontmatter + status 流转）.harness/wiki/ 四文档：业务模型 / 接口协议 / 数据模型 / 架构决策（领域真相来源）.harness/changes/ + _TEMPLATE/：变更追踪约定 + 三件套模板（change/review/verify）+ 状态机.harness/agents/owner.md：Owner Agent 的定义（流水线总编排者）CLAUDE.md 作为 AI 协作入口（地图模式，按需加载 .harness/ 各组件）上下文分层模型：Layer0 系统级 / Layer1 项目级(CLAUDE.md + owner.md) / Layer2 约束级(rules) / Layer3 领域级(wiki) / Layer4 运行时(ReMe).claude/settings.json 权限策略与 Hooks（Allow Maven/Docker/Git/Java、Deny 危险操作、PostToolUse Hook）



.harness/rules/ 三规范：工程结构 / 编码规范 / 开发流程规范



.claude/settings.json 权限策略与 Hooks（Allow Maven/Docker/Git/Java、Deny 危险操作、PostToolUse Hook）



2.2.3 总结Harness 工程规范约束 = SDD + 六阶段开发流水线 + 多 Agent + Skills + 变更可追踪 + 知识库沉淀 + 工程规则。目标：把 AgentScope 从能回答问题升级为可研发、可协作、可交付的企业级系统。



### 2.2.3 总结



Harness 工程规范约束 = SDD + 六阶段开发流水线 + 多 Agent + Skills + 变更可追踪 + 知识库沉淀 + 工程规则。



目标：把 AgentScope 从能回答问题升级为可研发、可协作、可交付的企业级系统。



2.3 真正让项目跑稳的是六阶段自动化开发流水线这套项目最重要的，不是某个 Agent 写得多炫，而是整个研发过程严格走这 6 步：request-analysiscoding-skillunit-test-writeexpert-reviewerunit-test-cideploy-verify对应含义分别是：需求分析：把一句模糊需求变成结构化 change 卡。编码实现：在明确约束下落代码。单测编写：覆盖核心逻辑，确保关键路径能回归。专家评审：从设计、规范、边界、风险等多维度审视实现。CI 门禁：用 Checkstyle、PMD、ArchUnit、测试等机械化拦截问题。部署验证：做冒烟、健康检查、回滚预案。这一套流程的价值在于，它把「AI 写代码」变成了「AI 按约束规范写代码」。这次的核心不是「把 5 个 Agent 写出来」，而是「把 5 个 Agent 写对」，那么就要盯住下面这 4 件事。2.4.1 多 Agent 协同必须通过 A2A 真正跑起来



## 2.3 真正让项目跑稳的是六阶段自动化开发流水线



这套项目最重要的，不是某个 Agent 写得多炫，而是整个研发过程严格走这 6 步：



对应含义分别是：



这一套流程的价值在于，它把「AI 写代码」变成了「AI 按约束规范写代码」。



这次的核心不是「把 5 个 Agent 写出来」，而是「把 5 个 Agent 写对」，那么就要盯住下面这 4 件事。



### 2.4.1 多 Agent 协同必须通过 A2A 真正跑起来



不是5 个 Agent 目录代码创建了就算完成，必须真的实现：



不是5 个 Agent 目录代码创建了就算完成，必须真的实现：



2.4.2 开发 change 清单



### 2.4.2 开发 change 清单



为了项目能顺利推进，按当前模式，后续会按照下面这批 change 执行：C-001 project-bootstrappingC-002 quality-gatesC-003 infra-bootstrapC-004 common-modelsC-005 a2a-foundationC-006 xhs-agentC-007 route-agentC-008 itinerary-agentC-009 budget-agentC-010 supervisor-agentC-011 server-apiC-012 e2e-main-flowC-013 frontend-main-flowC-014-pdf-exportC-015-reme-memory-ragC-016-observability-reliability所有的 Change 都会严格按照 SDD + TDD + Harness 规范执行并正确落地。2.5 Owner Agent



为了项目能顺利推进，按当前模式，后续会按照下面这批 change 执行：



所有的 Change 都会严格按照 SDD + TDD + Harness 规范执行并正确落地。



## 2.5 Owner Agent



很多同学理解多 Agent 时，容易只盯着业务 Agent。但在工程实践里，真正最关键的往往是「总编排者」。在项目里，Owner Agent 并不是业务里的 Supervisor，而是开发过程中的总控角色。它的职责不是生成旅游方案，而是负责：理解需求调用合适的开发 Skill对照 rules 守住边界控制上下文加载跟踪 changes 状态发现风险时停下来请求人工决策换句话说，Owner Agent 是「研发流程层的总控 Agent」，必须关心：当前处在哪个阶段该读哪些上下文哪些决策可以自动做哪些决策必须人工确认改动是否可追溯是否能断点续传这就是 Owner Agent 存在的意义。下图定义了 Owner Agent 如何编排 .harness/skills/ 下 6 个开发技能，把产品轴上的每个 feature 生产出来。



很多同学理解多 Agent 时，容易只盯着业务 Agent。但在工程实践里，真正最关键的往往是「总编排者」。



在项目里，Owner Agent 并不是业务里的 Supervisor，而是开发过程中的总控角色。



它的职责不是生成旅游方案，而是负责：



换句话说，Owner Agent 是「研发流程层的总控 Agent」，必须关心：



这就是 Owner Agent 存在的意义。



下图定义了 Owner Agent 如何编排 .harness/skills/ 下 6 个开发技能，把产品轴上的每个 feature 生产出来。



2.6 两类 Skills，不要搞混了



## 2.6 两类 Skills，不要搞混了



这是我在项目里特别强调的一件事，这里的 Skills 分两类：第一类是开发 Skills，在 .harness/skills/ 下。第二类是业务 Skills，在 huazai-trip-skills/ 模块里。



这是我在项目里特别强调的一件事，这里的 Skills 分两类：



2.6.1 开发 Skills



### 2.6.1 开发 Skills



开发 Skills 服务的是怎么造项目，比如：需求分析编码实现写单测评审CI 校验部署验证



开发 Skills 服务的是怎么造项目，比如：



2.6.2 业务 Skills业务 Skills 服务的是Agent 运行时能做什么，比如：路线规划费用计算行程拼装内容分析导出能力很多人第一次做 Agent 系统时，会把 Skills 当成纯 Tool，其实不够。在一个成熟项目里，Skills 至少有两层含义：对开发期来说，Skill 是生产流程的标准动作。对运行期来说，Skill 是 Agent 可复用的业务能力单元。一旦把这两层分开，整个项目的组织会清晰很多。
，数量有限，先到先得，
### 2.6.2 业务 Skills



业务 Skills 服务的是Agent 运行时能做什么，比如：



很多人第一次做 Agent 系统时，会把 Skills 当成纯 Tool，其实不够。



在一个成熟项目里，Skills 至少有两层含义：



一旦把这两层分开，整个项目的组织会清晰很多。
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
## 02 其他项目 &amp; 专栏



02 其他项目 &amp; 专栏



## 02 其他项目 &amp; 专栏



请查看：推荐7个牛逼的高并发 &amp; AI Agent 项目



03 星球介绍 &amp; 评价当然星球不止AI项目，分布式、微服务、高并发、海量数据、硬核面试题、性能优化等什么都有，总有几个是适合你的。加入星球的一定要查看星球专栏入口：https://wx.zsxq.com/columns/51122554151214网页版入口：手机版入口：星球已更专栏：其实星球中不止7个项目，加入之后，会发现真是一个宝藏星球，里面什么都有，很多小伙伴反馈说：干货太多了，太详细了。有不少小伙伴，通过小红书+AI实战项目，拿到了非常不错的 Offer，薪资也涨了不少。你还在等啥？不少小伙伴经过星球硬核技术和项目的历练，早已成功跳槽加薪，实现薪资翻倍，而你，还在原地踏步，抱怨大环境不好。抛弃焦虑和抱怨，我们一起塌下心来沉淀硬核技术和项目，让自己的薪资更上一层楼。最近喜报不断，涨幅 50%，嘎嘎强：在去年12月份成功帮助一位来自国外的球友实现了百万年薪，入职了当地最大的互联网公司。这位球友平时就经常问我问题，我们也经常探讨一些关于系统架构方面的设计，面试前也帮他做了大量指导，最终拿下了这家公司。除了这位球友，还有更多球友的评价：                 还有很多，就不一一列举，尤其是上面这位大三同学，很努力。另外还有 CTO、架构师过来交流、学习，一起成长。
，数量有限，先到先得，
加完星球记得加我好友备注：星球。最新的星球内部沟通群，还有大量位置，人数多了非常活跃，并且技术氛围浓厚，还有最新面试题分享。



## 03 星球介绍 &amp; 评价



当然星球不止AI项目，分布式、微服务、高并发、海量数据、硬核面试题、性能优化等什么都有，总有几个是适合你的。



加入星球的一定要查看星球专栏入口：https://wx.zsxq.com/columns/51122554151214



加入星球的一定要查看星球专栏入口：https://wx.zsxq.com/columns/51122554151214



加入星球的一定要查看星球专栏入口：https://wx.zsxq.com/columns/51122554151214



网页版入口：



手机版入口：



手机版入口：



星球已更专栏：



星球已更专栏：



其实星球中不止7个项目，加入之后，会发现真是一个宝藏星球，里面什么都有，很多小伙伴反馈说：干货太多了，太详细了。



有不少小伙伴，通过小红书+AI实战项目，拿到了非常不错的 Offer，薪资也涨了不少。



你还在等啥？不少小伙伴经过星球硬核技术和项目的历练，早已成功跳槽加薪，实现薪资翻倍，而你，还在原地踏步，抱怨大环境不好。抛弃焦虑和抱怨，我们一起塌下心来沉淀硬核技术和项目，让自己的薪资更上一层楼。



你还在等啥？不少小伙伴经过星球硬核技术和项目的历练，早已成功跳槽加薪，实现薪资翻倍，而你，还在原地踏步，抱怨大环境不好。抛弃焦虑和抱怨，我们一起塌下心来沉淀硬核技术和项目，让自己的薪资更上一层楼。



最近喜报不断，涨幅 50%，嘎嘎强：



在去年12月份成功帮助一位来自国外的球友实现了百万年薪，入职了当地最大的互联网公司。这位球友平时就经常问我问题，我们也经常探讨一些关于系统架构方面的设计，面试前也帮他做了大量指导，最终拿下了这家公司。



除了这位球友，还有更多球友的评价：



还有很多，就不一一列举，尤其是上面这位大三同学，很努力。另外还有 CTO、架构师过来交流、学习，一起成长。
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，
，数量有限，先到先得，

---
title: "从LLM到Agent OS：AI智能体的完整进化线复盘（需求驱动视角）"
date: "2026-04-15"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/mdAWJePxUpsBeqEVMk63Yg"
---

# 从 LLM 到 Agent OS：AI 智能体的完整进化线复盘（需求驱动视角）

> 为什么 AI 从“只会聊天”进化到“能自主干活”？这不是技术的偶然突破，而是真实需求倒逼的必然结果。

本文以“实际需求驱动”为主线，走完这 3 年半的技术进化之路：**LLM Chat → Reasoning → Function Call → MCP → Skills → Agent → MAS → Agent OS**。

<!-- more -->

## 引言：从聊天到智能体，为什么必须进化？

2022 年底 ChatGPT 横空出世。但现实很快给了三记耳光：

1. **企业场景第一个问题：信息时效性**——模型基于 2021 年数据训练，无法回答实时问题
2. **企业场景第二个问题：私有数据无法访问**——无法访问公司私有数据
3. **企业场景第三个问题：无法真正“干活”**——只能告诉你怎么订票，无法真正订票

于是，进化开始了。

## 第一阶段：LLM Chat 时代（2022-2023）

**需求驱动**：让 AI 能聊起来。

2022 年 11 月 ChatGPT 发布，不只是“补全文本”，而是能理解上下文、扮演角色、遵循指令、执行推理。

**技术突破：RLHF（人类反馈强化学习）**——三步走：
1. 在人工标注的高质量对话数据上微调（SFT）
2. 用人类偏好数据训练打分模型（Reward Model）
3. 用 PPO 算法以奖励模型分数为目标继续优化

**局限**：知识截止、幻觉（一本正经地胡说八道）、无法访问外部世界、无法真正“干活”。

## 第二阶段：推理能力突破（2022-2023）：从 CoT 到 ToT

**需求驱动**：让 AI 能“想清楚”。模型在数学计算、逻辑推理上表现不稳定。

**技术突破 1：CoT（思维链）**——2022 年 Google 提出，在 Prompt 中要求模型一步步思考并展示推导过程，大幅提升推理准确率。

**技术突破 2：ToT（思维树）**——2023 年提出，生成多条推理路径，通过评估、剪枝、投票、反思筛选最优路径。

**Prompt Engineering 兴起**：随着 CoT/ToT 普及，Prompt 质量直接决定模型效果。

**局限**：推理能力依赖模型基座本身、上下文长度限制、仍然无法访问外部世界。

## 第三阶段：工具调用（2023）：Function Calling

**需求驱动**：让 AI 能“干活”。

**技术突破**：2023 年 6 月 OpenAI 正式推出 Function Calling。核心流程：
1. 定义工具（tools 数组，含 name/description/parameters）
2. 模型判断是否需要调用函数、调用哪个、传什么参数
3. 应用程序执行函数
4. 模型整合工具结果成最终回答

**本质**：模型不是直接远程调用函数，而是以结构化 JSON 告诉应用程序“调哪个、参数是什么”，由应用程序实际调用。

**突破**：模型能真正“干活”、知识边界被打破、Agent 雏形出现。

**局限**：工具爆炸、模型选错工具、跨模型兼容性差、工具描述依赖 description 质量。

## 第四阶段：连接器标准化（2024-2025）：MCP

**需求驱动**：解决工具爆炸。10 个 Agent×20 个工具=200 个集成点，API 变更需要更新所有集成点。

**技术突破：MCP（Model Context Protocol）**——引入“客户端-服务器”架构标准化，集成点从 N×M 降到 N+M。

**MCP 的本质：USB-C 接口**——以前每个设备有自己的接口，现在统一用 USB-C，一次适配到处使用。

**MCP 与 FC 的关系**：互补而非替代。FC 解决“单个模型如何按 JSON 协议调自己的 API"，MCP 解决”如何标准化接口让多个 Agent 共享多个工具“。

**局限**：模型仍然会选错工具、工具描述仍手工编写、工具组合逻辑仍需显式编码。

## 第五阶段：能力封装（2025-2026）：Skills

**需求驱动**：让模型会用对工具。MCP 解决“能不能连”，但模型不知道“什么时候该用什么工具”、“怎么用工具”、“如何组合工具”。

**技术突破：Skills** = 封装好的 Prompt + 工具调用序列 + 任务流程 + 质量与容错规则。

**MCP vs Skills**：MCP = USB-C 接口（标准化连接器，解决“能不能连”），Skills = 专业手册（经验包，解决“会不会用”）。

**Skills 三层次**：
- Level 1：单工具 Skill（如天气查询）
- Level 2：工具组合 Skill（如旅行策划）
- Level 3：领域专家 Skill（如销售助手）

**Context Engineering 兴起**：从 Prompt Engineering（设计 System Prompt/CoT）演进到 Context Engineering（设计 Skill 的描述/步骤/质量规则/降级规则）。

**局限**：Skills 仍需人工编写、质量参差不齐、跨平台不兼容、仍未解决“自主规划”。

## 第六阶段：智能体（2023-2025）：ReAct, Workflow, AutoAgent

**需求驱动**：让 AI 能“自主规划”。Function Calling+MCP+Skills 让模型能用对工具，但不知道“先做什么、后做什么”。

**技术突破 1：ReAct（推理+行动）**——2022 年 Google 提出，模型“思考→行动→观察→再思考”循环，自主决定下一步做什么。

**技术突破 2：Workflow（工作流）**——开发者显式定义流程，模型执行每个步骤。ReAct 灵活但不可控，Workflow 可控但不灵活。

**技术突破 3：AutoAgent（自动智能体）**——ReAct 和 Workflow 的结合体，用 Workflow 定义“框架”，用 ReAct 填充“细节”。

**Harness Engineering 兴起**：从 Prompt → Context → Harness Engineering（设计 Agent 的框架/技能/工具/记忆/监控）。

**Agent 四层次**：单工具 Agent → 多工具 Agent → 自主规划 Agent → 多 Agent 协作 Agent。

**局限**：ReAct 不稳定、Workflow 不灵活、Agent 无长期记忆、Agent 协作问题未成熟。

## 第七阶段：多智能体协作（2024-2025）：MAS, Agent Memory

**需求驱动**：让多个 Agent 协同工作。单个 Agent 能力有限，复杂任务需分工。

**技术突破 1：MAS（多智能体协作）**——四种协作模式：主从模式、协作模式（平等）、竞争模式、层级模式。

**技术突破 2：Agent Memory（Agent 记忆）**——五种记忆层次：短期、长期（向量数据库）、向量、程序化（Skills/Workflows）、事实记忆。

**局限**：MAS 协作效率低（通信成本高）、Agent 记忆管理复杂、Agent“自我意识”问题无答案。

## 第八阶段：智能体运行时（2024-2025）：Agent Runtime

**需求驱动**：需要完整 Agent 平台。开发一个 Agent 要定义工具、配 MCP、写 Skills、设计 Workflows、管 Memory、实现 A2A——每个 Agent 重复劳动。

**技术突破：Agent Runtime（智能体运行时）**——支撑 Agent 开发、运行、管理的统一平台，相当于“基础操作系统”。核心功能：模型管理、工具管理、Skills 管理、Workflow 管理、Memory 管理、A2A 协作、监控告警、部署运维。

**代表产品**：OpenClaw（5700+ Skills）、Hermes（强大 Workflow 引擎和 A2A 协作）。

**局限**：Runtime 之间不兼容、学习成本高、高并发性能瓶颈。

## 第九阶段：智能体操作系统（2025-2026）：LLMOps+Agent Builder（现状）与 Agent OS（未来趋势）

**需求驱动**：Agent 生态碎片化——不同 Runtime 平台不兼容，跨平台协同、资源无法共享，形成“信息孤岛”。

**现状：LLMOps + Agent Builder 平台**——Coze（Agent 开发与分发平台）、Dify（LLMOps+Agent 开发平台）。核心功能：低代码构建、大模型适配管理、全链路运维监控、资源共享分发、多场景适配。

**未来趋势：Agent OS（尚未落地）**——核心特征：统一生态入口、智能全局调度、自主进化能力、跨平台生态兼容、轻量化接入。

**Agent OS vs Agent Runtime**：
- Runtime：聚焦“单个/多个 Agent 的运行管理”，是“基础运行工具”，解决“能跑起来”
- Agent OS：聚焦“整个 Agent 生态的管理与协同”，是“核心操作系统”，解决“能规模化、生态化发展”

## 总结：进化的本质和未来趋势

**进化的本质 = 需求倒逼技术突破**：
- 让 AI 聊起来 → RLHF
- 让 AI 想清楚 → CoT/ToT
- 让 AI 干活 → Function Calling
- 解决工具爆炸 → MCP
- 让 AI 会用对工具 → Skills
- 让 AI 自主规划 → ReAct/Workflow
- 多 Agent 协同+记忆 → MAS/Agent Memory
- 完整平台 → Agent Runtime
- Agent 的“操作系统” → Agent OS

**六大未来趋势**：更智能（自动选模型/工具/Skill）、更开放（跨平台标准）、更易用（自然语言配置/低代码）、更个性化（记住偏好）、更社交化（Agent 间社交）、更专业化（医疗/法律/教育/金融 Agent）。

> 未来，每个企业都会有自己的 Agent 团队；每个人都会有一个或多个“个人 Agent"；Agent 会成为”数字员工“的标配。
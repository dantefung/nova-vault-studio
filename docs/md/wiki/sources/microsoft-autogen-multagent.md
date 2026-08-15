---
title: "微软开源 AutoGen：让 AI Agent 真正「对话起来」的多智能体框架"
date: "2026-07-08"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/AGbRes6i8EUYsXDPJ8C7uA"
---

# 微软开源 AutoGen：让 AI Agent 真正「对话起来」的多智能体框架

> 当单兵作战的 LLM 越来越力不从心，多 Agent 协作正在成为 AI 应用的下一个范式。微软开源的 AutoGen 是全球最热门的多智能体框架之一（GitHub 3.6 万+ Stars）。

## 一、项目简介

AutoGen 是微软研究院（Microsoft Research）开源的下一代多智能体（Multi-Agent）开发框架，源码托管于 github.com/microsoft/autogen。

> 它让你可以把多个 LLM Agent、人类、工具，组合成一个「会聊天的团队」。

| 数据 | 值 |
|------|------|
| GitHub Star | 36k+（截至 2024 年底） |
| 首次发布 | 2023 年 10 月 |
| 最新版本 | v0.4（彻底重写） |
| 开源协议 | MIT（可商用） |

## 二、它解决了什么问题？

单个 Agent 做 RAG 问答还行，但只要任务复杂一点——比如「写一段代码，再让另一个 Agent 来 Review」——就要手写一堆 prompt 串联、消息路由、状态管理代码。

**多 Agent 协作的常见痛点：**

1. Agent 之间怎么对话？谁先说、谁后说？
2. 一个 Agent 调用工具的中间结果，怎么传给另一个 Agent？
3. 怎么让人类随时介入对话？
4. 怎么扩展到几十个 Agent、跑在分布式环境下？

AutoGen 把这些都封装成了一层「对话即代码」的抽象：**你只需要定义 Agent 是谁，对话怎么流转由框架负责。**

## 三、核心特性（v0.4+ 新架构）

### 1. ConversableAgent：万物皆可对话

每个 Agent 都可以：

- 拥有自己的 system prompt、LLM 配置、工具集
- 发送和接收消息
- 选择是否需要人类确认（human_input_mode）

最常用的两个内置 Agent：

- **AssistantAgent**：纯 LLM 思考者
- **UserProxyAgent**：人类代理，可执行代码、调用工具

### 2. GroupChat：团队式协作

当任务需要多个角色（产品经理 + 程序员 + 测试），GroupChat 让多个 Agent 在一个聊天室里轮转发言：

```python
from autogen import GroupChat, GroupChatManager

group_chat = GroupChat(
    agents=[pm, coder, tester],
    messages=[],
    max_round=10,
)
manager = GroupChatManager(groupchat=group_chat)
```

发言顺序可以按轮询（round-robin）、按 LLM 自动选人（auto），也支持自定义路由。

### 3. 异步 + 可扩展架构（v0.4 亮点）

v0.4 是一次完全重写，最大的亮点：

- **async-first**：基于 actor 模型与事件驱动，原生支持异步消息传递
- **分层设计**：底层 autogen-core（消息总线、运行时）+ 上层 autogen-agentchat（高级 Agent 抽象）
- **跨语言**：Python 之外，开始支持 .NET
- **分布式运行时**：Agent 可部署到不同进程甚至不同机器

这意味着 AutoGen 不再只是「研究玩具」，而是可以撑起企业级、可水平扩展的多 Agent 系统。

## 四、快速上手：两个 Agent 的最小对话

安装：

```bash
pip install "autogen-agentchat" "autogen-ext[openai]"
```

一个「程序员」和一个「用户代理」合作完成一段 Python 脚本：

```python
import os
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import MaxMessageTermination
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(
    model="gpt-4o-mini",
    api_key=os.environ["OPENAI_API_KEY"],
)

coder = AssistantAgent("coder", model_client=model_client)
reviewer = AssistantAgent("reviewer", model_client=model_client)
team = RoundRobinGroupChat([coder, reviewer], termination_condition=MaxMessageTermination(max_messages=6))
```

跑起来之后，你会看到 coder 先给出代码，reviewer 提出意见，coder 再修订——一个自动化的代码评审小团队就成型了。

## 五、实战案例：自动代码生成 + 评审

| Agent | 角色 | 工具 |
|-------|------|------|
| coder | 撰写函数实现 | 可加 Python 代码执行工具 |
| reviewer | 静态检查 + 安全审查 | 可挂 ESLint / Bandit |
| user_proxy | 人类确认 | 执行代码、回传结果 |

通过 RoundRobinGroupChat 或更灵活的 SelectorGroupChat（让 LLM 自动决定下一个发言者），能快速搭建出「代码生成 → 评审 → 修改 → 通过」的闭环。

类似思路也能迁移到：

- **论文写作**：提纲 Agent + 撰写 Agent + 校对 Agent
- **客服系统**：分类 Agent + 知识库 Agent + 升级人工
- **数据分析**：提问 Agent + SQL Agent + 可视化 Agent

## 六、和 LangGraph / CrewAI 的差异

| 维度 | AutoGen | LangGraph | CrewAI |
|------|---------|-----------|--------|
| 核心抽象 | 对话 | 状态图（DAG） | 角色 + 任务 |
| 思路 | Agent 之间自由交流 | 节点 + 边的显式流程 | 像「剧组」一样分工 |
| 适合场景 | 研究、代码生成、自由协商 | 生产级可控工作流 | 快速原型、团队任务 |
| 上手难度 | 中 | 较高（控制力强） | 最低 |
| 背后力量 | 微软研究院 | LangChain 团队 | CrewAI Inc. |

> 一句话总结：**想要对话感选 AutoGen，想要确定性流程选 LangGraph，想最快搭出团队选 CrewAI。**

## 七、优点与不足

### 优点

- 微软背书 + 社区活跃，迭代快、生态广
- 对话范式直观，对「AI 协作」的建模贴近真实团队
- v0.4 异步架构可扩展到分布式场景
- 工具集成丰富：OpenAI、Azure、Anthropic、Ollama、本地模型都支持

### 不足

- 学习曲线偏陡：v0.2 / v0.4 API 差异大，老教程大量失效
- 官方文档仍在追赶，部分高级特性靠社区博客补充
- AutoGen Studio（可视化工具）好用但偶有 Bug
- v0.4 之后社区有「维护节奏放缓」的声音，需要持续关注仓库动态

## 八、适合谁用？

- 想研究多 Agent 协作机制、做学术或原型验证的开发者
- 需要把「代码生成 + 自动评审 + 人工确认」工程化的团队
- 对 LLM 应用进阶玩法感兴趣、不满足于单 Agent 的同学

**不适合**：只想做一个简单 RAG 问答、或追求最小依赖的项目（这种场景用 LangChain 或直接调 API 更轻）。

## 九、总结

AutoGen 的价值在于它把「多个 AI 一起干活」这件事做到了一个相对成熟的抽象层——你不需要再手撸消息路由和状态机，只需要告诉框架「我有哪些 Agent、它们怎么聊天」。

> 如果你想真正理解「多智能体」是怎么一回事，AutoGen 是绕不开的一站。

- 项目地址：github.com/microsoft/autogen
- 官方文档：microsoft.github.io/autogen
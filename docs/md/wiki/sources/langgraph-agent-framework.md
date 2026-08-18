---
title: "LangGraph：构建生产级 AI 智能体的「图」思维"
date: "2026-07-07"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/eFrj7AkLYoUhfXXtDzfLmA"
---

# LangGraph：构建生产级 AI 智能体的「图」思维

> LangChain 解决「能不能拼起来」，LangGraph 解决「能不能稳定跑下去」。33,900+ Stars，是目前最像基础设施的 Agent 框架。

## 项目简介

LangGraph 是 LangChain 官方出品的低阶智能体编排框架，把工作流建模为可持久化、可中断、可循环的状态机/有向图。

- GitHub：langchain-ai/langgraph
- Star：33,900+（且仍在快速增长）
- 定位：不是 LangChain 的替代品，而是它的「生产骨架」
- 语言：Python / JS 双端，深度集成 LangSmith 可观测体系

## 为什么需要 LangGraph

经典 LangChain 是链式（Chain）思维：Prompt → LLM → OutputParser，线性执行，跑完即止。可真实的 Agent 远不是直线：

- 用户问「帮我订张机票」，Agent 要查日历、比价、问预算、等确认——有循环、有分支、有等待
- 一个会话跨多次请求，状态必须能存
- 涉及退款、转账这类敏感操作，必须人工确认后才能继续
- 服务重启后，对话要能续上

链式模型天然撑不住这些需求。于是大家用各种 hack 凑：手动塞 Redis、自己写状态机、time.sleep 等用户输入……代码很快变成意大利面。

LangGraph 把这些都内化成了一等公民：图、状态、断点、检查点、子图，开箱即用。

## 核心特性

- **图结构编排**：节点（Node）= 函数/Agent；边（Edge）= 控制流，支持条件分支、循环、并行
- **共享状态（State）**：用类型化字典（TypedDict）定义，节点读写同一份状态，告别参数传来传去
- **Checkpointer 持久化**：每个节点执行后自动快照，支持内存 / SQLite / Postgres / Redis 等后端
- **人在回路（HITL）**：interrupt 在任意节点暂停，等人类审核后 resume
- **时间旅行**：可回退到任意历史 checkpoint，对比不同分支的执行结果
- **流式输出**：节点级别的 token 流，前端体验丝滑
- **子图与多 Agent**：把复杂 Agent 拆成子图，独立调试、组合复用
- **LangSmith 集成**：每一步的输入输出、token 消耗、延迟全可观测

## 快速上手

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str

def greet(state: State) -> dict:
    return {"messages": [("ai", f"你好，用户{state['user_id']}")]}

def ask_need(state: State) -> dict:
    return {"messages": [("ai", "请问需要我帮你做什么？")]}

graph = StateGraph(State)
graph.add_node("greet", greet)
graph.add_node("ask_need", ask_need)
graph.add_edge(START, "greet")
graph.add_edge("greet", "ask_need")
graph.add_edge("ask_need", END)

app = graph.compile()
```

## 实战案例

### 案例 1：电商客服 Agent

品牌 Minimal 用 LangGraph + LangSmith 搭了一套多 Agent 客服系统，自动处理退换货、物流、订单查询。结果：**90% 工单自动闭环，满意度 80%+**。

关键设计：
- 一个 Supervisor 节点做意图分流
- 退款/改地址等敏感动作前用 interrupt 暂停，等用户确认
- Checkpointer 落到 Postgres，用户隔天回来也能续上
- 每条工单全程 LangSmith 可追溯

### 案例 2：深度研究助手

多 Agent 研究管线：规划 → 检索 → 写作 → 审校，每一步都是一个子图。

- 规划节点根据问题拆子问题
- 检索节点并行调用搜索引擎 + 向量库
- 写作节点汇总
- 审校节点如果不满意，条件边把它打回规划节点——**这就是循环的力量**

## 优缺点分析

| 维度 | 内容 |
|------|------|
| 优点 | 可控性强、生产就绪、与 LangChain 生态无缝、官方维护 |
| 缺点 | 学习曲线陡（State/Reducer/Channel/Pregel 概念多）、样板代码多、过度灵活、强绑定 LangChain 抽象 |

## 和 AutoGen / CrewAI 怎么选

| 维度 | LangGraph | CrewAI | AutoGen |
|------|-----------|--------|---------|
| 核心范式 | 状态图/显式控制流 | 角色分工/任务委派 | 对话式多 Agent |
| 控制粒度 | 最高 | 中 | 较低 |
| 上手成本 | 高 | 低 | 中 |
| 生产可靠性 | 强 | 中 | 一般 |
| 适合场景 | 复杂可控、生产级 Agent | 快速原型、协作模拟 | 多 Agent 对话、代码生成 |

> 简单决策：要上生产、要稳定可控、要可观测 → LangGraph；要快速验证想法 → CrewAI；要做研究型多 Agent 对话 → AutoGen。

## 总结

LangGraph 的本质，是把 Agent 开发从「提示词工程」推进到「与非确定性系统做软件工程」。它把状态、循环、中断、检查点这些分布式系统的成熟思路，落到了 LLM 编排上。

> 曲线陡是真的，但上生产后省下的运维成本，绝对值回票价。
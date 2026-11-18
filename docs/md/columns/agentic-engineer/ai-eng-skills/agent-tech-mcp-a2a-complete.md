---
title: "Agent 技术拆解：Function Call / MCP / Skill / A2A / Multi‑Agent，完整交互流程详解"
author: "温桂阳"
date: "2026-09-04 23:51"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/e6sZHRaIdUE7fPbW1xtxqQ"
---

# Agent 技术拆解：Function Call / MCP / Skill / A2A / Multi‑Agent，完整交互流程详解

本文把 Function Call、MCP、Skill、A2A、Multi‑Agent 这五套组件每一个的交互细节讲清楚，看懂就知道 Agent 内部到底发生了什么。

## 1、Function Call（工具调用）：最基础的外部能力交互

定位：Agent 最原始的能力出口，LLM 输出结构化 JSON，Agent 框架解析并执行函数。

### 交互时序

用户输入问题，Agent 把用户 query + 工具函数描述列表（函数名、入参、用途），一起组装成 prompt 送入 LLM。

LLM 经过推理，判断需要调用外部工具，不输出自然语言答案，输出结构化 Function Call JSON：工具名称、入参参数。关键点：LLM 只是输出一段文本格式的 JSON，它本身不会发起网络请求，不会执行函数。

Agent 框架收到 LLM 返回内容，做 Parser 解析，识别出这是工具调用指令，而不是最终回答。

Agent 框架本地执行对应的函数：调用 API、查询数据库、执行脚本。

拿到工具返回结果（原始文本/JSON），Agent 把工具执行结果包装成一条新消息，追加到对话上下文。

将更新后的完整上下文再次喂回 LLM：LLM 结合工具返回的真实数据，继续推理，输出最终答案 / 发起下一次工具调用。

用户 Query→Agent 组装上下文(带工具 schema) →LLM↓LLM 输出 FunctionCallJSON（仅文本）↓Agent 框架解析、执行真实工具↓工具结果封装为消息，放回上下文↓再次送入 LLM→ 输出最终回答 / 继续调用工具

### 局限

每个工具需要手写 Schema 描述；每个不同服务要单独对接适配；工具协议不统一，换一套工具就要重新写对接代码。

## 2、MCP Model Context Protocol 模型上下文协议

定位：标准化的工具通信协议，解决 Function Call 工具碎片化问题。Function Call 是“模型输出格式”，MCP 是“Agent 与外部服务之间通信标准”。

> Function Call 定义 LLM 该输出什么格式；MCP 定义 Agent 怎么和远端工具服务通信。

Function Call 定义 LLM 该输出什么格式；MCP 定义 Agent 怎么和远端工具服务通信。

### 交互时序

Agent 启动阶段：Agent 作为 MCP 客户端，连接一个或多个 MCP 服务端。MCP Server 主动把自身所有可用工具列表、schema、描述，标准化推送给 Agent。> 不再需要人工手写大量工具描述，服务端自动上报能力。

用户提问，Agent 把 MCP 上报来的标准化工具 schema，组装进上下文送入 LLM。

LLM 输出 Function Call 格式 JSON（这里依然沿用 Function Call 输出格式）。

Agent 框架识别调用指令，不本地执行函数，而是按照 MCP 协议，把调用请求序列化，通过 Stdio/HTTP 发送给远端 MCP Server。

MCP 服务端收到协议报文，在服务端本地执行工具（读文件、访问数据库、调用第三方接口）。

MCP Server 把执行结果按照 MCP 协议封装，返回给 Agent 客户端。

Agent 将返回结果封装成消息，追加对话上下文，回传给 LLM 继续推理。

MCP 服务端 ←[MCP 协议]→Agent(客户端) → 组装工具 schema →LLM↓LLM 输出 FunctionCallJSON↓Agent 包装 MCP 请求发给远端 Server↓Server 执行工具，MCP 协议返回结果↓Agent 封装结果，送入 LLM 生成回答

### 和 Function Call 关系

Function Call：LLM ↔ Agent 之间的输出约定；

MCP：Agent ↔ 外部工具服务之间的传输协议。MCP 底层依然依赖 Function Call，解决批量工具接入标准化。

> MCP 底层依然依赖 Function Call，解决批量工具接入标准化。

MCP 底层依然依赖 Function Call，解决批量工具接入标准化。

## 3、Skill（技能）：能力的封装单元，可以是提示词、函数、子工作流、子 Agent

Function Call、MCP 大多对应单一原子工具；Skill 是把一组逻辑打包成能力单元。Skill 不一定是简单函数，可以是：一段提示词、多步工具调用工作流、甚至是一个子 Agent。

### 交互时序

Agent 加载 Skill 仓库，每个 Skill 包含：能力描述、触发条件、内部逻辑（可以是 prompt、多个 FunctionCall 组合、子流程）。

用户输入，Agent 把所有 Skill 的能力描述送入 LLM。LLM 判断当前任务需要启用哪一个 Skill。

两种分支：

分支 A：简单 Skill，本质就是封装好的 Function/MCP 调用。LLM 输出调用指令，Agent 执行内部封装的工具链。

分支 B：复杂 Skill，内部是一套多步工作流。Agent 接管执行，不再每一步都询问 LLM，自动顺序执行 Skill 内部定义的多次工具调用。

Skill 执行完毕，把完整聚合后的结果，作为一条消息返回主 LLM。

LLM 基于 Skill 输出结果，生成最终回复。

> 重点区分：Function Call：LLM 决定每一步调用；复杂 Skill：Agent 按照预定义流程自动跑多步，减少 LLM 决策轮次。

重点区分：Function Call：LLM 决定每一步调用；复杂 Skill：Agent 按照预定义流程自动跑多步，减少 LLM 决策轮次。

用户 Query→Agent 将 Skill 列表喂给 LLM↓LLM 判定需要调用某一个 Skill↓Agent 触发 Skill 执行├─简单 Skill：底层调用 Function/MCP└─复杂 Skill：Agent 自动执行多步子流程↓Skill 聚合输出结果，回写到上下文↓LLM 结合结果输出答案

举例：「文档解析 Skill」内部自动完成：读取文件→文本分片→RAG 检索→结果整理，中间多轮工具不需要大模型逐轮决策。

# Skill Runtime 实现机制解析

## 定位

Skill Runtime 是 Agent Harness 内部专用执行引擎，负责 Skill 的加载、校验与执行。

> 职责边界：Skill 路由选择由主 LLM 完成；Runtime 接收调用指令后执行 Skill，不承担上层任务规划，不调用主 Agent‑LLM。支持两类 Skill：简单 Skill（原子 Function/MCP 封装）、复杂 Skill（预定义 workflow 工作流）。

职责边界：Skill 路由选择由主 LLM 完成；Runtime 接收调用指令后执行 Skill，不承担上层任务规划，不调用主 Agent‑LLM。支持两类 Skill：简单 Skill（原子 Function/MCP 封装）、复杂 Skill（预定义 workflow 工作流）。

## 核心能力

Skill 仓库管理加载 Skill 元数据（ID、描述、入参出参 Schema、工作流定义、权限、错误策略）；支持版本管理、热加载；维护工具白名单，做权限隔离，区分简单 / 复杂 Skill 类型。

调用入口与实例初始化接收 LLM 下发的 Skill 调用指令；按 Schema 完成入参校验、会话鉴权；创建 Skill 独立实例与私有上下文$local，隔离内部数据，不污染主 Agent 会话上下文。

工作流执行内核

简单 Skill：直接转发调用底层 Function/MCP 获取结果。

复杂 Skill：解析执行 workflow_definition，支持顺序步骤、条件分支、循环、子 Skill 嵌套；调度 MCP/Function；支持内置转换节点、Skill 内部私有 LLM 调用节点。

数据绑定流转引擎提供变量表达式能力，实现步骤间数据传递；支持字段提取、模板渲染、过滤、缺省兜底；中间数据保存在私有上下文，不送入主 LLM；执行结束按 output_mapping 组装对外输出结构。

容错、观测与生命周期管理执行单步重试、跳过、终止、降级等错误策略；管控单步与整体超时；输出埋点事件用于观测排障；执行结束 / 异常时销毁私有上下文；将最终聚合结果回写主 Agent 上下文，交还执行权给主 LLM。

## 执行流程

主 LLM 下发 Skill 调用指令 → 查找 Skill 定义、入参校验、鉴权 → 创建 Skill 实例与私有上下文 → 执行 Skill（简单 Skill 直接调用工具 / 复杂 Skill 解析运行工作流）→ 错误策略处理 → 组装输出结果 → 销毁局部上下文 → 结果回写主会话，交还控制权。

## 核心价值

将确定性业务流程脱离主 LLM 调度，减少 LLM 调用轮次、Token 开销与时延；

通过私有上下文隔离中间数据，避免主上下文窗口膨胀；

Skill 能力可复用、可版本化、可独立测试；

收敛工具鉴权、超时、重试、降级等通用逻辑。

## 非职责范围

不做 Skill 路由选择、上层任务规划；

不执行主 Agent LLM 推理；

不负责主会话持久化、主上下文压缩裁剪。

## 4、A2A Agent‑to‑Agent：Agent 与 Agent 之间消息通信协议

> Function Call/MCP 是 Agent 调用外部工具服务；A2A 是 Agent 调用另一个 Agent。A2A 定义一套 Agent 之间消息投递、寻址、状态传递的通信规范。一个 Agent 把任务消息发给另一个 Agent，接收对方返回的执行结果。

Function Call/MCP 是 Agent 调用外部工具服务；A2A 是 Agent 调用另一个 Agent。A2A 定义一套 Agent 之间消息投递、寻址、状态传递的通信规范。一个 Agent 把任务消息发给另一个 Agent，接收对方返回的执行结果。

### 交互时序

主 Agent 收到用户任务，LLM 推理判断：该任务自己不适合做，需要委派给其他 Agent。

LLM 输出 A2A 调用指令：目标 AgentID、要传递的任务参数、上下文摘要。

Agent 框架解析指令，通过 A2A 消息总线，把任务消息发送给目标子 Agent。注意：不是直接调用 LLM，是把完整任务交给另一个独立 Agent 实例。

被调用的接收 Agent，拿到任务消息，启动自己完整的 Agent 循环：自己的 LLM、自己的记忆、自己的 Skill/MCP 工具，独立完成任务。

子 Agent 完成任务，把最终结果通过 A2A 协议回传给主 Agent。

主 Agent 把子 Agent 返回结果追加到自己的对话上下文，交给主 LLM 做汇总、整理、输出最终结果给用户。

用户 → 主 Agent → LLM 判断需要委派任务↓主 Agent 按 A2A 协议发送任务消息↓子 Agent 接收消息，运行自身完整 Agent Loop↓子 Agent 完成，A2A 回传处理结果↓主 Agent 接收结果，送入主 LLM 汇总输出

> A2A 只是通信层，只解决消息怎么传给另一个 Agent，不规定分工逻辑；分工逻辑由 Multi‑Agent 架构来定义。

A2A 只是通信层，只解决消息怎么传给另一个 Agent，不规定分工逻辑；分工逻辑由 Multi‑Agent 架构来定义。

## 5、Multi‑Agent 多智能体系统：多 Agent 角色分工协作架构

A2A 是通信手段；Multi‑Agent 是架构模式：定义多个 Agent 角色、职责、流转规则（规划者、执行者、评审者、检索 Agent、编码 Agent）。

### 典型交互流程（Planner‑Executor 模式）

用户输入复杂任务，交给 Planner 规划 Agent。

Planner 内部 LLM 对任务拆解，拆成多个子任务，分配给不同职责的 Executor 执行 Agent。

Planner 通过 A2A 消息总线，把子任务分发给各个 Executor Agent。

每个 Executor 是独立 Agent：拥有自己的 LLM、Skill、MCP 工具，独立执行分配给自己的子任务。

Executor 执行完毕，通过 A2A 把子任务结果返回 Planner。

Planner 收集全部子任务结果，交给自己的 LLM 做结果校验、冲突检查、汇总整合。

如果发现子任务结果不达标，Planner 可以再次下发重试任务。

全部任务完成，输出整合后的完整结果给到用户。

用户 Query↓Planner 规划 Agent（LLM 做任务拆解）↓（A2A 消息分发）├─Executor‑AAgent 独立执行子任务└─Executor‑BAgent 独立执行子任务↓（A2A 结果回传）Planner 收集全部结果，LLM 校验合并↓输出最终答案

### 关键区分，很多人混淆

Function Call：Agent 调用普通工具（接口、函数）

MCP：Agent 标准化调用远端工具服务

Skill：把多步能力封装，减少 LLM 轮次

A2A：Agent ↔ Agent 之间消息通信的通道

Multi‑Agent：一套角色分工架构，底层依赖 A2A 完成 Agent 之间消息传递。

> 简单类比：Function Call/MCP = 员工调用外部系统 API；Skill = 封装好的标准化工作手册；A2A = 企业内部员工之间发消息的 IM 系统；Multi‑Agent = 完整团队组织架构，有主管、执行、评审岗位，靠 IM(A2A)互相沟通协作。

简单类比：Function Call/MCP = 员工调用外部系统 API；Skill = 封装好的标准化工作手册；A2A = 企业内部员工之间发消息的 IM 系统；Multi‑Agent = 完整团队组织架构，有主管、执行、评审岗位，靠 IM(A2A)互相沟通协作。

# 一张图看懂完整层级关系

用户输入↓【LLM 大脑】负责思考、决策、输出结构化指令↓输出不同类型指令├─FunctionCall 指令 → Agent 执行原子工具├─ MCP 调用指令 → Agent 调用远端标准化工具服务├─ Skill 调用指令 → Agent 执行封装好的能力单元└─ A2A 委派指令 → Agent 发送消息给另一个 Agent↓Multi‑Agent 多角色架构（基于 A2A）↓各个子 Agent 内部又会使用 FunctionCall/MCP/Skill↓执行结果逐层回传给 LLM，循环直到输出最终答案

## 注意点：

LLM 只输出指令文本，不会真正执行任何外部逻辑；所有调用、网络请求、Agent 之间消息转发，全部由 Agent 框架完成。

MCP 不替代 Function Call：MCP 是通信层，模型输出依旧是 Function Call 格式。

Skill 不等于函数：Skill 可以是 prompt、工作流、子 Agent，部分 Skill 会跳过 LLM 逐轮决策。

A2A≠Multi‑Agent：A2A 只是消息通道；没有角色分工，只有 A2A 也不是多智能体。

Multi‑Agent 每个子 Agent 拥有独立上下文、独立记忆、独立工具集，不是简单函数。

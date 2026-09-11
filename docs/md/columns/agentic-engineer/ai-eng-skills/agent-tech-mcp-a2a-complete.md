---
title: "Agent 技术拆解：Function Call / MCP / Skill / A2A / Multi‑Agent，完整交互流程详解"
author: "温桂阳"
date: "2026年9月4日 23:51"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/e6sZHRaIdUE7fPbW1xtxqQ"
---

# Agent 技术拆解：Function Call / MCP / Skill / A2A / Multi‑Agent，完整交互流程详解

本文把Function Call、MCP、Skill、A2A、Multi‑Agent 这五套组件每一个的交互细节讲清楚，看懂就知道Agent内部到底发生了什么。

## 1、Function Call（工具调用）：最基础的外部能力交互

定位：Agent最原始的能力出口，LLM输出结构化JSON，Agent框架解析并执行函数。

### 交互时序

用户输入问题，Agent把用户query + 工具函数描述列表（函数名、入参、用途），一起组装成prompt送入LLM。

LLM经过推理，判断需要调用外部工具，不输出自然语言答案，输出结构化Function Call JSON：工具名称、入参参数。关键点：LLM只是输出一段文本格式的JSON，它本身不会发起网络请求，不会执行函数。

Agent框架收到LLM返回内容，做Parser解析，识别出这是工具调用指令，而不是最终回答。

Agent框架本地执行对应的函数：调用API、查询数据库、执行脚本。

拿到工具返回结果（原始文本/JSON），Agent把工具执行结果包装成一条新消息，追加到对话上下文。

将更新后的完整上下文再次喂回LLM：LLM结合工具返回的真实数据，继续推理，输出最终答案 / 发起下一次工具调用。

用户Query→Agent组装上下文(带工具schema) →LLM↓LLM输出FunctionCallJSON（仅文本）↓Agent框架解析、执行真实工具↓工具结果封装为消息，放回上下文↓再次送入LLM→ 输出最终回答 / 继续调用工具

### 局限

每个工具需要手写Schema描述；每个不同服务要单独对接适配；工具协议不统一，换一套工具就要重新写对接代码。

## 2、MCP Model Context Protocol 模型上下文协议

定位：标准化的工具通信协议，解决 Function Call 工具碎片化问题。Function Call是“模型输出格式”，MCP是“Agent与外部服务之间通信标准”。

> Function Call定义LLM该输出什么格式；MCP定义Agent怎么和远端工具服务通信。

Function Call定义LLM该输出什么格式；MCP定义Agent怎么和远端工具服务通信。

### 交互时序

Agent启动阶段：Agent作为MCP客户端，连接一个或多个MCP服务端。MCP Server主动把自身所有可用工具列表、schema、描述，标准化推送给Agent。> 不再需要人工手写大量工具描述，服务端自动上报能力。

用户提问，Agent把MCP上报来的标准化工具schema，组装进上下文送入LLM。

LLM输出Function Call格式JSON（这里依然沿用Function Call输出格式）。

Agent框架识别调用指令，不本地执行函数，而是按照MCP协议，把调用请求序列化，通过Stdio/HTTP发送给远端MCP Server。

MCP服务端收到协议报文，在服务端本地执行工具（读文件、访问数据库、调用第三方接口）。

MCP Server把执行结果按照MCP协议封装，返回给Agent客户端。

Agent将返回结果封装成消息，追加对话上下文，回传给LLM继续推理。

MCP服务端 ←[MCP协议]→Agent(客户端) → 组装工具schema →LLM↓LLM输出FunctionCallJSON↓Agent包装MCP请求发给远端Server↓Server执行工具，MCP协议返回结果↓Agent封装结果，送入LLM生成回答

### 和Function Call关系

Function Call：LLM ↔ Agent之间的输出约定；

MCP：Agent ↔ 外部工具服务之间的传输协议。MCP底层依然依赖Function Call，解决批量工具接入标准化。

> MCP底层依然依赖Function Call，解决批量工具接入标准化。

MCP底层依然依赖Function Call，解决批量工具接入标准化。

## 3、Skill（技能）：能力的封装单元，可以是提示词、函数、子工作流、子Agent

Function Call、MCP大多对应单一原子工具；Skill是把一组逻辑打包成能力单元。Skill不一定是简单函数，可以是：一段提示词、多步工具调用工作流、甚至是一个子Agent。

### 交互时序

Agent加载Skill仓库，每个Skill包含：能力描述、触发条件、内部逻辑（可以是prompt、多个FunctionCall组合、子流程）。

用户输入，Agent把所有Skill的能力描述送入LLM。LLM判断当前任务需要启用哪一个Skill。

两种分支：

分支A：简单Skill，本质就是封装好的Function/MCP调用。LLM输出调用指令，Agent执行内部封装的工具链。

分支B：复杂Skill，内部是一套多步工作流。Agent接管执行，不再每一步都询问LLM，自动顺序执行Skill内部定义的多次工具调用。

Skill执行完毕，把完整聚合后的结果，作为一条消息返回主LLM。

LLM基于Skill输出结果，生成最终回复。

> 重点区分：Function Call：LLM决定每一步调用；复杂Skill：Agent按照预定义流程自动跑多步，减少LLM决策轮次。

重点区分：Function Call：LLM决定每一步调用；复杂Skill：Agent按照预定义流程自动跑多步，减少LLM决策轮次。

用户Query→Agent将Skill列表喂给LLM↓LLM判定需要调用某一个Skill↓Agent触发Skill执行├─简单Skill：底层调用Function/MCP└─复杂Skill：Agent自动执行多步子流程↓Skill聚合输出结果，回写到上下文↓LLM结合结果输出答案

举例：「文档解析Skill」内部自动完成：读取文件→文本分片→RAG检索→结果整理，中间多轮工具不需要大模型逐轮决策。

# Skill Runtime实现机制解析

## 定位

Skill Runtime 是 Agent Harness 内部专用执行引擎，负责 Skill 的加载、校验与执行。

> 职责边界：Skill 路由选择由主 LLM 完成；Runtime 接收调用指令后执行 Skill，不承担上层任务规划，不调用主 Agent‑LLM。支持两类 Skill：简单 Skill（原子 Function/MCP 封装）、复杂 Skill（预定义 workflow 工作流）。

职责边界：Skill 路由选择由主 LLM 完成；Runtime 接收调用指令后执行 Skill，不承担上层任务规划，不调用主 Agent‑LLM。支持两类 Skill：简单 Skill（原子 Function/MCP 封装）、复杂 Skill（预定义 workflow 工作流）。

## 核心能力

Skill 仓库管理加载 Skill 元数据（ID、描述、入参出参 Schema、工作流定义、权限、错误策略）；支持版本管理、热加载；维护工具白名单，做权限隔离，区分简单 / 复杂 Skill 类型。

调用入口与实例初始化接收 LLM 下发的 Skill 调用指令；按 Schema 完成入参校验、会话鉴权；创建 Skill 独立实例与私有上下文$local，隔离内部数据，不污染主 Agent 会话上下文。

工作流执行内核

简单 Skill：直接转发调用底层 Function/MCP 获取结果。

复杂 Skill：解析执行workflow_definition，支持顺序步骤、条件分支、循环、子 Skill 嵌套；调度 MCP/Function；支持内置转换节点、Skill 内部私有 LLM 调用节点。

数据绑定流转引擎提供变量表达式能力，实现步骤间数据传递；支持字段提取、模板渲染、过滤、缺省兜底；中间数据保存在私有上下文，不送入主 LLM；执行结束按output_mapping组装对外输出结构。

容错、观测与生命周期管理执行单步重试、跳过、终止、降级等错误策略；管控单步与整体超时；输出埋点事件用于观测排障；执行结束 / 异常时销毁私有上下文；将最终聚合结果回写主 Agent 上下文，交还执行权给主 LLM。

## 执行流程

主LLM下发Skill调用指令 → 查找 Skill 定义、入参校验、鉴权 → 创建 Skill 实例与私有上下文 → 执行 Skill（简单 Skill 直接调用工具 / 复杂 Skill 解析运行工作流）→ 错误策略处理 → 组装输出结果 → 销毁局部上下文 → 结果回写主会话，交还控制权。

## 核心价值

将确定性业务流程脱离主 LLM 调度，减少 LLM 调用轮次、Token 开销与时延；

通过私有上下文隔离中间数据，避免主上下文窗口膨胀；

Skill 能力可复用、可版本化、可独立测试；

收敛工具鉴权、超时、重试、降级等通用逻辑。

## 非职责范围

不做 Skill 路由选择、上层任务规划；

不执行主 Agent LLM 推理；

不负责主会话持久化、主上下文压缩裁剪。

## 4、A2A Agent‑to‑Agent：Agent与Agent之间消息通信协议

> Function Call/MCP是Agent调用外部工具服务；A2A是Agent调用另一个Agent。A2A定义一套Agent之间消息投递、寻址、状态传递的通信规范。一个Agent把任务消息发给另一个Agent，接收对方返回的执行结果。

Function Call/MCP是Agent调用外部工具服务；A2A是Agent调用另一个Agent。A2A定义一套Agent之间消息投递、寻址、状态传递的通信规范。一个Agent把任务消息发给另一个Agent，接收对方返回的执行结果。

### 交互时序

主Agent收到用户任务，LLM推理判断：该任务自己不适合做，需要委派给其他Agent。

LLM输出A2A调用指令：目标AgentID、要传递的任务参数、上下文摘要。

Agent框架解析指令，通过A2A消息总线，把任务消息发送给目标子Agent。注意：不是直接调用LLM，是把完整任务交给另一个独立Agent实例。

被调用的接收Agent，拿到任务消息，启动自己完整的Agent循环：自己的LLM、自己的记忆、自己的Skill/MCP工具，独立完成任务。

子Agent完成任务，把最终结果通过A2A协议回传给主Agent。

主Agent把子Agent返回结果追加到自己的对话上下文，交给主LLM做汇总、整理、输出最终结果给用户。

用户 → 主Agent → LLM判断需要委派任务↓主Agent按A2A协议发送任务消息↓子Agent接收消息，运行自身完整Agent Loop↓子Agent完成，A2A回传处理结果↓主Agent接收结果，送入主LLM汇总输出

> A2A只是通信层，只解决消息怎么传给另一个Agent，不规定分工逻辑；分工逻辑由Multi‑Agent架构来定义。

A2A只是通信层，只解决消息怎么传给另一个Agent，不规定分工逻辑；分工逻辑由Multi‑Agent架构来定义。

## 5、Multi‑Agent 多智能体系统：多Agent角色分工协作架构

A2A是通信手段；Multi‑Agent是架构模式：定义多个Agent角色、职责、流转规则（规划者、执行者、评审者、检索Agent、编码Agent）。

### 典型交互流程（Planner‑Executor模式）

用户输入复杂任务，交给Planner规划Agent。

Planner内部LLM对任务拆解，拆成多个子任务，分配给不同职责的Executor执行Agent。

Planner通过A2A消息总线，把子任务分发给各个Executor Agent。

每个Executor是独立Agent：拥有自己的LLM、Skill、MCP工具，独立执行分配给自己的子任务。

Executor执行完毕，通过A2A把子任务结果返回Planner。

Planner收集全部子任务结果，交给自己的LLM做结果校验、冲突检查、汇总整合。

如果发现子任务结果不达标，Planner可以再次下发重试任务。

全部任务完成，输出整合后的完整结果给到用户。

用户Query↓Planner规划Agent（LLM做任务拆解）↓（A2A消息分发）├─Executor‑AAgent 独立执行子任务└─Executor‑BAgent 独立执行子任务↓（A2A结果回传）Planner收集全部结果，LLM校验合并↓输出最终答案

### 关键区分，很多人混淆

Function Call：Agent调用普通工具（接口、函数）

MCP：Agent标准化调用远端工具服务

Skill：把多步能力封装，减少LLM轮次

A2A：Agent ↔ Agent之间消息通信的通道

Multi‑Agent：一套角色分工架构，底层依赖A2A完成Agent之间消息传递。

> 简单类比：Function Call/MCP = 员工调用外部系统API；Skill = 封装好的标准化工作手册；A2A = 企业内部员工之间发消息的IM系统；Multi‑Agent = 完整团队组织架构，有主管、执行、评审岗位，靠IM(A2A)互相沟通协作。

简单类比：Function Call/MCP = 员工调用外部系统API；Skill = 封装好的标准化工作手册；A2A = 企业内部员工之间发消息的IM系统；Multi‑Agent = 完整团队组织架构，有主管、执行、评审岗位，靠IM(A2A)互相沟通协作。

# 一张图看懂完整层级关系

用户输入↓【LLM大脑】负责思考、决策、输出结构化指令↓输出不同类型指令├─FunctionCall指令 → Agent执行原子工具├─ MCP调用指令 → Agent调用远端标准化工具服务├─ Skill调用指令 → Agent执行封装好的能力单元└─ A2A委派指令 → Agent发送消息给另一个Agent↓Multi‑Agent多角色架构（基于A2A）↓各个子Agent内部又会使用 FunctionCall/MCP/Skill↓执行结果逐层回传给LLM，循环直到输出最终答案

## 注意点：

LLM只输出指令文本，不会真正执行任何外部逻辑；所有调用、网络请求、Agent之间消息转发，全部由Agent框架完成。

MCP不替代Function Call：MCP是通信层，模型输出依旧是Function Call格式。

Skill不等于函数：Skill可以是prompt、工作流、子Agent，部分Skill会跳过LLM逐轮决策。

A2A≠Multi‑Agent：A2A只是消息通道；没有角色分工，只有A2A也不是多智能体。

Multi‑Agent每个子Agent拥有独立上下文、独立记忆、独立工具集，不是简单函数。

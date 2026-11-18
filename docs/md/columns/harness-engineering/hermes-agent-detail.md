---
title: "Harness开源框架Hermes‑Agent详解"
author: "温桂阳"
date: "2026-09-08 00:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/a6ATJQSYHI_0Tv-G-LtYKg"
---

# Harness 开源框架 Hermes‑Agent 详解

# Hermes‑Agent：面向企业私有化部署的 Agent 运行框架，核心定位是把大模型、Skill 工具集、Loop 执行引擎、Harness 编排底座、本体知识能力组装成可生产可用的智能 Agent，不是大模型本身，是 Agent 运行时与工程框架；对标 OpenClaw、OpenCode Agent Runtime，侧重金融/行业私有化场景，深度适配昇腾国产化栈。

## 一、当前核心能力

### 1. Loop 循环引擎（最核心）

Loop = Agent 思考‑行动‑观察‑再思考的主执行闭环，就是 ReAct 范式的工程化实现。1）执行流程

用户 Query → 意图解析 → 进入 Loop 循环 1.LLM 思考：判断是否需要调用工具/Skill、规划步骤 2.Action 派发：调用 Skill/工具、外部 API、知识库查询 3.Observation：拿到工具返回结果（观察）4.将(思考+Action+Observation)追加到上下文 5.终止判断：满足结束条件则输出最终答案；否则回到思考继续迭代

2）Hermes‑Loop 内置能力

可配置最大 loop 轮次，防止死循环；

支持 Loop 完成判定策略：LLM 自主判断结束 / 关键词匹配结束 / 输出格式校验结束 / 外部回调强制终止；

支持 Loop 断点：可以保存每一步 thought‑action‑observation，支持恢复执行；

支持子 Loop：Skill 内部可以嵌套子 Loop，实现任务拆解；

支持超时控制、单步重试、异常捕获，工具报错不会直接崩掉整个 Agent，会把错误信息喂给 LLM 重新规划。

> 区分：Loop 是执行循环引擎，负责跑 ReAct 闭环；Harness 是 Skill/工具的编排与注册集市，给 Loop 提供可调用的能力集。

区分：Loop 是执行循环引擎，负责跑 ReAct 闭环；Harness 是 Skill/工具的编排与注册集市，给 Loop 提供可调用的能力集。

### 2. Harness 工具编排底座

Harness 是 Hermes‑Agent 的工具集市+调度层+契约层。

1）Skill 注册管理：统一注册各类 Skill，分为原生 Skill、自定义 Skill、外部 http Skill；强制 Skill 输入输出 schema 契约。

2）能力域划分：Skill 按域分组（查询类、计算类、知识库、知识图谱、文件操作、业务接口），支持父‑子 Skill 分层；推荐命名规范 Loop‑Skill‑xxx。

3）Skill 生命周期：初始化、入参校验、前置钩子、执行、后置钩子、结果格式化、异常处理。

4）权限沙箱：私有化场景可用 Harness 做 Skill 权限管控，哪些 Agent 实例可以调用哪些 Skill。

5）给 Loop 提供调用入口：Loop 不会直接调用工具，全部走 Harness 做路由与参数校验。

> 简单记忆：Loop 负责“怎么想怎么循环跑任务”；Harness 负责“有哪些工具可以用、怎么安全调用这些工具”。

简单记忆：Loop 负责“怎么想怎么循环跑任务”；Harness 负责“有哪些工具可以用、怎么安全调用这些工具”。

### 3. Skill 能力体系

Skill 是最小可调用单元，Hermes 支持三类 Skill：

内置原生 Skill：文件读写、http 调用、向量库检索、知识图谱 SPARQL/nGQL 查询、时间计算等；

自定义代码 Skill：Python 函数封装，注册到 Harness；

远程 HTTP Skill：把外部业务服务包装成 Skill，只需要提供 OpenAPI Schema 即可接入。

Skill 强制 Schema 约束：入参 JSON Schema、出参 JSON Schema，Harness 做参数校验，防止 LLM 输出非法参数直接打坏下游服务。

### 4. Memory 记忆子系统

Hermes‑Agent 记忆分层：

短期记忆：Loop 上下文窗口，保存在内存，单轮会话生命周期；thought‑action‑observation 全部存放于此。

会话记忆：会话级持久化，会话 ID 隔离，落库，支持会话回溯。

长期记忆：向量库 Milvus 存储用户事实、历史结论；支持记忆检索注入 prompt；支持记忆的写入、更新、遗忘。注意：Hermes 记忆不默认做自动记忆压缩，长会话需要上层接入摘要 Skill 做窗口裁剪。

> 注意：Hermes 记忆不默认做自动记忆压缩，长会话需要上层接入摘要 Skill 做窗口裁剪。

注意：Hermes 记忆不默认做自动记忆压缩，长会话需要上层接入摘要 Skill 做窗口裁剪。

### 5. 本体&知识图谱集成能力

Hermes‑Agent 上层可以对接本体 OWL+知识图谱（Neo4j/Nebula/Stardog）：

Harness 提供内置 Skill 执行 SPARQL/nGQL 查询；

支持 NL2Query：自然语言转图谱查询语句；

本体用于约束 Agent 的意图、实体、关系，减少 LLM 幻觉，让 Agent 推理符合业务本体定义；

GraphRAG 链路：自然语言→本体校验→生成图谱查询→返回观测结果送入 Loop。

### 6. 反思（Reflection）模块

Hermes 内置反思能力，两种模式：

单步反思：每一次工具调用结束后，LLM 对本次 action 结果做校验，判断结果是否可信、是否需要重试/换工具；

任务结束后全局反思：整个 Loop 完成后，复盘整个任务链路，输出复盘日志，用于调优 prompt、Skill、本体。

反思不是必开，可以配置开关，开启会增加 token 消耗。

### 7. 模型层适配能力

Hermes‑Agent 本身不绑定具体大模型，抽象模型接口层：

兼容 OpenAI 协议接口；

支持私有化 vLLM‑Ascend、ModelArts、内部模型服务；

支持 greedy/采样参数透传，可配置让模型输出严格结构化 JSON（强制 tool‑call 格式）；

支持多模型路由：推理模型做思考，小模型做反思、意图解析。

### 8. 可观测

全链路日志：每一条 Thought、Action、Observation、Skill 入参出参完整埋点；

Prometheus 指标：Loop 轮次统计、Skill 调用成功率、token 消耗、失败类型；

Trace 链路 ID 贯穿用户请求、Loop 步骤、Skill 调用、模型调用。

## 二、整体实现架构

分层自上而下：

┌─────────────────────────────────────────────┐│接入层：API 服务/SDK/业务应用│└───────────────┬─────────────────────────────┘│┌───────────────▼─────────────────────────────┐│AgentCore 核心层││├─SessionManager 会话&记忆管理││├─LoopEngine 循环执行引擎（ReAct 主循环）││├─Reflection 反思子模块││└─PromptManager（模板、fewshot、约束）│└───────────────┬─────────────────────────────┘│┌───────────────▼─────────────────────────────┐│Harness 编排底座││├─SkillRegistrySkill 注册中心││├─SkillRouter 调用路由││├─Schema 校验/钩子/权限沙箱││└─Skill 实例池（原生 Skill/自定义/HTTP）│└───────────────┬─────────────────────────────┘│┌───────────────▼─────────────────────────────┐│外部资源层││├─LLM 推理服务(vLLM/私有化大模型)││├─Memory 存储：DB 会话库、Milvus 长期记忆││├─知识图谱：Neo4j/Nebula/Stardog││└─外部业务 API、文件系统│└─────────────────────────────────────────────┘

数据流简要

> 用户输入 → Session 载入历史记忆 → Loop 引擎启动 → LLM 生成 Thought+Action → Harness 校验 Action Schema、路由到对应 Skill 执行 → Observation 回传给 Loop → 判断是否结束 → 循环；结束输出结果，写入会话/长期记忆。

用户输入 → Session 载入历史记忆 → Loop 引擎启动 → LLM 生成 Thought+Action → Harness 校验 Action Schema、路由到对应 Skill 执行 → Observation 回传给 Loop → 判断是否结束 → 循环；结束输出结果，写入会话/长期记忆。

## 三、关键技术原理

### 1. Loop（ReAct）实现原理

ReAct 核心思想就是大模型思考(Thought) → 执行动作(Action) → 观察结果(Observation)，循环往复直到任务完成。普通 Demo 版 ReAct 只是简单 while 循环；而 Hermes‑Agent 的 Loop 是面向企业私有化生产环境做了完整工程加固，不是单纯的代码循环，是一套带校验、容错、终止策略、断点、子循环的任务执行引擎。

## Hermes‑Agent Loop 完整执行链路

用户 Query + 载入会话记忆↓【Loop 引擎启动】每一轮循环内部：1.组装本轮 Prompt= 用户原始问题+ 历史全量 Thought‑Action‑Observation 序列+ 全部可用 Skill 的 Schema 工具描述+ 约束提示词（强制输出 JSON 格式 Action）↓2.LLM 生成 Thought + Action 结构化 JSON 输出> 两种模型兼容路径：- 原生支持 tool‑call 的模型：直接输出 tool_call 结构体- 无 tool‑call 国产化开源模型：Prompt 强制约束 +正则/JSON 解析提取 Action> 解析失败：解析异常直接封装成 Observation 丢回上下文，交给 LLM 重新思考重试，不直接崩溃↓3. Action 交给 Harness 编排底座处理（关键生产防护点）① 校验 Skill 名称是否存在②**强 Schema 入参校验**：对照 Skill 定义的 input_schema 校验所有入参✅ 参数合法：路由分发到对应 Skill 实例执行❌ 参数非法：不调用下游业务服务，直接构造错误 Observation 返回 Loop↓4.Skill 执行，得到执行结果/异常报错，统一封装成 Observation> Skill 抛出异常、网络超时、业务报错，不会直接终止 Agent，错误信息全部包装进 Observation↓5.将【Thought + Action + Observation】完整追加进上下文记忆↓6.执行**终止判定逻辑**✔ 满足终止条件：退出 Loop，输出最终回答，写入会话/长期记忆❌ 不满足终止条件：回到步骤 1，开启下一轮 Loop 迭代

## Loop 的多套终止判定策略（可配置，可组合）

Hermes 不只有“大模型自己说结束”这一种方式，支持多策略，任意条件命中即可退出循环：

LLM 自主判断结束：模型输出 finish 标记字段，代表任务已经完成，不需要再调用工具。

最大 Loop 轮次截断：硬阈值，防止大模型陷入无限循环死循环，企业私有化必配；每一轮都会计数，到达阈值强制退出。

关键词匹配结束：输出内容命中配置的结束关键词，直接终止。

输出格式校验结束：返回内容符合指定输出 JSON/文本格式，判定任务完成。

超时控制：整个 Loop 总执行超时，强制终止。

外部回调信号终止：上层业务调用方下发终止指令，中断正在跑的 Loop。

### 2. Harness+Skill 原理

Skill 全部遵循统一接口契约：

classBaseSkill:name:strdescription:strinput_schema:dictoutput_schema:dictdefpre_hook(ctx): ...defexecute(ctx, params): ...defpost_hook(ctx, result): ...

Harness 维护注册表，Loop 只通过工具名调用，不需要关心 Skill 是本地代码还是远程 HTTP。前置钩子可以做鉴权、参数改写；后置钩子做结果清洗脱敏。

### 3. Tool‑Call 适配原理

Hermes 做了一层抽象，兼容两类模式：

原生 OpenAI tool‑call；

无原生 tool‑call 能力的开源模型：通过 prompt 约束+正则/json 解析，从文本里提取 Action。> 国产化开源模型大多走第二种，更容易出现解析失败，Hermes 内置解析失败降级策略：把解析异常作为 Observation 喂回 LLM 重新生成。

### 4. 记忆机制原理

短期记忆：内存 List 保存[Thought, Action, Observation]；

会话记忆：数据库持久化完整会话序列；

长期记忆：当配置记忆写入 Skill 时，把重要事实向量化存入 Milvus；新请求时检索 Top‑N 记忆拼入 prompt。Hermes 本身不会自动识别哪些信息要存长期记忆，该判断逻辑交给 LLM 通过 Skill 调用完成。

> Hermes 本身不会自动识别哪些信息要存长期记忆，该判断逻辑交给 LLM 通过 Skill 调用完成。

Hermes 本身不会自动识别哪些信息要存长期记忆，该判断逻辑交给 LLM 通过 Skill 调用完成。

### 5. 本体与 Agent 协同原理

本体（OWL）本身不在 Hermes 内核；本体能力体现为：

Prompt 注入本体约束（实体、关系、业务规则）减少幻觉；

通过 Skill 执行图谱查询，本体用于校验 NL2Query 生成的语句是否符合业务模型，过滤非法查询；

本体推理机（HermiT/Jena Reasoner）推理结果作为 Observation 送入 Loop。

## 四、扩展能力（开发者扩展点）

### 1. 扩展 Skill（最常用）

1）自定义 Python Skill：继承 BaseSkill，实现 execute，注册到 Harness；2）接入第三方 HTTP 服务：填写 OpenAPI Schema 生成远程 Skill；3）Skill 支持前置、后置钩子，可以做日志、鉴权、脱敏。

### 2. 扩展 Loop 行为

自定义终止判断器：替换默认 Loop 结束逻辑；

增加自定义中间步骤：每一轮 Loop 前后插入自定义回调；

支持子 Loop 开发，实现任务分解。

### 3. 扩展 Memory 存储

默认支持 SQL 会话库+Milvus 长期记忆；可实现 Memory 抽象接口替换为其他向量库、数据库。

### 4. 扩展模型后端

实现抽象 ModelClient 接口，可以对接任意私有化推理服务（昇腾 vLLM、ModelArts 等）。

### 5. 扩展反思模块

替换内置反思 Prompt 与逻辑，实现业务专属校验规则（金融场景结果合规校验等）。

### 6. 扩展本体/图谱能力

新增自定义 NL2Query Skill，适配自己的图谱引擎；扩展本体校验钩子。

### 7. API/SDK 扩展

Hermes 提供服务 API 与 SDK，可以嵌入业务系统；支持自定义请求中间件。

## 五、当前框架局限（开发者需要注意）

Hermes‑Agent 是运行时框架，不提供开箱即用高质量 Prompt；业务效果高度依赖 Prompt 工程、Skill 质量、本体建模；

没有内置自动的上下文窗口管理，超长会话需要自行开发摘要 Skill；

本体、知识图谱属于上层 Skill 能力，不是内核内置，需要开发者完成本体设计、图谱数据构建；

Loop 循环轮次越多 token 开销越大；生产环境需要做好最大轮次限制；

对弱 tool‑call 能力开源模型，JSON 解析失败率上升，需要配套降级策略；

原生不支持分布式 Agent（多 Agent 协作），多 Agent 需要上层业务基于 Hermes 实例组装。

## 六、开发者典型二次开发工作流

梳理业务任务，拆解需要哪些 Skill；

开发/注册 Skill 到 Harness，完善 Schema；

编写 Agent Prompt 模板，配置 Loop 最大轮次、反思开关；

如果需要知识图谱：完成本体建模，开发图谱查询 Skill；

接入私有化大模型后端；

测试单步 Skill、测试 Loop 闭环；调优解析失败、参数错误、幻觉场景；

接入可观测指标，上线。

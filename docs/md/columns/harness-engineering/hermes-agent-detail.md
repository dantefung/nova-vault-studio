---
title: "Harness开源框架Hermes‑Agent详解"
author: "温桂阳"
date: "2026年9月8日 00:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/a6ATJQSYHI_0Tv-G-LtYKg"
---

# Harness开源框架Hermes‑Agent详解

# Hermes‑Agent：面向企业私有化部署的Agent运行框架，核心定位是把大模型、Skill工具集、Loop执行引擎、Harness编排底座、本体知识能力组装成可生产可用的智能Agent，不是大模型本身，是Agent运行时与工程框架；对标 OpenClaw、OpenCode Agent Runtime，侧重金融/行业私有化场景，深度适配昇腾国产化栈。

## 一、当前核心能力

### 1. Loop 循环引擎（最核心）

Loop = Agent思考‑行动‑观察‑再思考的主执行闭环，就是ReAct范式的工程化实现。1）执行流程

用户Query → 意图解析 → 进入Loop循环1.LLM思考：判断是否需要调用工具/Skill、规划步骤2.Action派发：调用Skill/工具、外部API、知识库查询3.Observation：拿到工具返回结果（观察）4.将(思考+Action+Observation)追加到上下文5.终止判断：满足结束条件则输出最终答案；否则回到思考继续迭代

2）Hermes‑Loop 内置能力

可配置最大loop轮次，防止死循环；

支持Loop完成判定策略：LLM自主判断结束 / 关键词匹配结束 / 输出格式校验结束 / 外部回调强制终止；

支持Loop断点：可以保存每一步thought‑action‑observation，支持恢复执行；

支持子Loop：Skill内部可以嵌套子Loop，实现任务拆解；

支持超时控制、单步重试、异常捕获，工具报错不会直接崩掉整个Agent，会把错误信息喂给LLM重新规划。

> 区分：Loop是执行循环引擎，负责跑ReAct闭环；Harness是Skill/工具的编排与注册集市，给Loop提供可调用的能力集。

区分：Loop是执行循环引擎，负责跑ReAct闭环；Harness是Skill/工具的编排与注册集市，给Loop提供可调用的能力集。

### 2. Harness 工具编排底座

Harness是Hermes‑Agent的工具集市+调度层+契约层。

1）Skill注册管理：统一注册各类Skill，分为原生Skill、自定义Skill、外部http Skill；强制Skill输入输出schema契约。

2）能力域划分：Skill按域分组（查询类、计算类、知识库、知识图谱、文件操作、业务接口），支持父‑子Skill分层；推荐命名规范 Loop‑Skill‑xxx。

3）Skill生命周期：初始化、入参校验、前置钩子、执行、后置钩子、结果格式化、异常处理。

4）权限沙箱：私有化场景可用Harness做Skill权限管控，哪些Agent实例可以调用哪些Skill。

5）给Loop提供调用入口：Loop不会直接调用工具，全部走Harness做路由与参数校验。

> 简单记忆：Loop负责“怎么想怎么循环跑任务”；Harness负责“有哪些工具可以用、怎么安全调用这些工具”。

简单记忆：Loop负责“怎么想怎么循环跑任务”；Harness负责“有哪些工具可以用、怎么安全调用这些工具”。

### 3. Skill 能力体系

Skill是最小可调用单元，Hermes支持三类Skill：

内置原生Skill：文件读写、http调用、向量库检索、知识图谱SPARQL/nGQL查询、时间计算等；

自定义代码Skill：Python函数封装，注册到Harness；

远程HTTP Skill：把外部业务服务包装成Skill，只需要提供OpenAPI Schema即可接入。

Skill强制Schema约束：入参JSON Schema、出参JSON Schema，Harness做参数校验，防止LLM输出非法参数直接打坏下游服务。

### 4. Memory 记忆子系统

Hermes‑Agent记忆分层：

短期记忆：Loop上下文窗口，保存在内存，单轮会话生命周期；thought‑action‑observation全部存放于此。

会话记忆：会话级持久化，会话ID隔离，落库，支持会话回溯。

长期记忆：向量库Milvus存储用户事实、历史结论；支持记忆检索注入prompt；支持记忆的写入、更新、遗忘。注意：Hermes记忆不默认做自动记忆压缩，长会话需要上层接入摘要Skill做窗口裁剪。

> 注意：Hermes记忆不默认做自动记忆压缩，长会话需要上层接入摘要Skill做窗口裁剪。

注意：Hermes记忆不默认做自动记忆压缩，长会话需要上层接入摘要Skill做窗口裁剪。

### 5. 本体&知识图谱集成能力

Hermes‑Agent上层可以对接本体OWL+知识图谱（Neo4j/Nebula/Stardog）：

Harness提供内置Skill执行SPARQL/nGQL查询；

支持NL2Query：自然语言转图谱查询语句；

本体用于约束Agent的意图、实体、关系，减少LLM幻觉，让Agent推理符合业务本体定义；

GraphRAG链路：自然语言→本体校验→生成图谱查询→返回观测结果送入Loop。

### 6. 反思（Reflection）模块

Hermes内置反思能力，两种模式：

单步反思：每一次工具调用结束后，LLM对本次action结果做校验，判断结果是否可信、是否需要重试/换工具；

任务结束后全局反思：整个Loop完成后，复盘整个任务链路，输出复盘日志，用于调优prompt、Skill、本体。

反思不是必开，可以配置开关，开启会增加token消耗。

### 7. 模型层适配能力

Hermes‑Agent本身不绑定具体大模型，抽象模型接口层：

兼容OpenAI协议接口；

支持私有化vLLM‑Ascend、ModelArts、内部模型服务；

支持greedy/采样参数透传，可配置让模型输出严格结构化JSON（强制tool‑call格式）；

支持多模型路由：推理模型做思考，小模型做反思、意图解析。

### 8. 可观测

全链路日志：每一条Thought、Action、Observation、Skill入参出参完整埋点；

Prometheus指标：Loop轮次统计、Skill调用成功率、token消耗、失败类型；

Trace链路ID贯穿用户请求、Loop步骤、Skill调用、模型调用。

## 二、整体实现架构

分层自上而下：

┌─────────────────────────────────────────────┐│接入层：API服务/SDK/业务应用│└───────────────┬─────────────────────────────┘│┌───────────────▼─────────────────────────────┐│AgentCore核心层││├─SessionManager会话&记忆管理││├─LoopEngine循环执行引擎（ReAct主循环）││├─Reflection反思子模块││└─PromptManager（模板、fewshot、约束）│└───────────────┬─────────────────────────────┘│┌───────────────▼─────────────────────────────┐│Harness编排底座││├─SkillRegistrySkill注册中心││├─SkillRouter调用路由││├─Schema校验/钩子/权限沙箱││└─Skill实例池（原生Skill/自定义/HTTP）│└───────────────┬─────────────────────────────┘│┌───────────────▼─────────────────────────────┐│外部资源层││├─LLM推理服务(vLLM/私有化大模型)││├─Memory存储：DB会话库、Milvus长期记忆││├─知识图谱：Neo4j/Nebula/Stardog││└─外部业务API、文件系统│└─────────────────────────────────────────────┘

数据流简要

> 用户输入 → Session载入历史记忆 → Loop引擎启动 → LLM生成Thought+Action → Harness校验Action Schema、路由到对应Skill执行 → Observation回传给Loop → 判断是否结束 → 循环；结束输出结果，写入会话/长期记忆。

用户输入 → Session载入历史记忆 → Loop引擎启动 → LLM生成Thought+Action → Harness校验Action Schema、路由到对应Skill执行 → Observation回传给Loop → 判断是否结束 → 循环；结束输出结果，写入会话/长期记忆。

## 三、关键技术原理

### 1. Loop（ReAct）实现原理

ReAct 核心思想就是大模型思考(Thought) → 执行动作(Action) → 观察结果(Observation)，循环往复直到任务完成。普通Demo版ReAct只是简单while循环；而Hermes‑Agent的Loop是面向企业私有化生产环境做了完整工程加固，不是单纯的代码循环，是一套带校验、容错、终止策略、断点、子循环的任务执行引擎。

## Hermes‑Agent Loop完整执行链路

用户Query + 载入会话记忆↓【Loop引擎启动】每一轮循环内部：1.组装本轮Prompt= 用户原始问题+ 历史全量 Thought‑Action‑Observation 序列+ 全部可用Skill的Schema工具描述+ 约束提示词（强制输出JSON格式Action）↓2.LLM生成Thought + Action结构化JSON输出> 两种模型兼容路径：- 原生支持tool‑call的模型：直接输出tool_call结构体- 无tool‑call国产化开源模型：Prompt强制约束 +正则/JSON解析提取Action> 解析失败：解析异常直接封装成Observation丢回上下文，交给LLM重新思考重试，不直接崩溃↓3. Action交给Harness编排底座处理（关键生产防护点）① 校验Skill名称是否存在②**强Schema入参校验**：对照Skill定义的input_schema校验所有入参✅ 参数合法：路由分发到对应Skill实例执行❌ 参数非法：不调用下游业务服务，直接构造错误Observation返回Loop↓4.Skill执行，得到执行结果/异常报错，统一封装成Observation> Skill抛出异常、网络超时、业务报错，不会直接终止Agent，错误信息全部包装进Observation↓5.将【Thought + Action + Observation】完整追加进上下文记忆↓6.执行**终止判定逻辑**✔ 满足终止条件：退出Loop，输出最终回答，写入会话/长期记忆❌ 不满足终止条件：回到步骤1，开启下一轮Loop迭代

## Loop的多套终止判定策略（可配置，可组合）

Hermes不只有“大模型自己说结束”这一种方式，支持多策略，任意条件命中即可退出循环：

LLM自主判断结束：模型输出finish标记字段，代表任务已经完成，不需要再调用工具。

最大Loop轮次截断：硬阈值，防止大模型陷入无限循环死循环，企业私有化必配；每一轮都会计数，到达阈值强制退出。

关键词匹配结束：输出内容命中配置的结束关键词，直接终止。

输出格式校验结束：返回内容符合指定输出JSON/文本格式，判定任务完成。

超时控制：整个Loop总执行超时，强制终止。

外部回调信号终止：上层业务调用方下发终止指令，中断正在跑的Loop。

### 2. Harness+Skill原理

Skill全部遵循统一接口契约：

classBaseSkill:name:strdescription:strinput_schema:dictoutput_schema:dictdefpre_hook(ctx): ...defexecute(ctx, params): ...defpost_hook(ctx, result): ...

Harness维护注册表，Loop只通过工具名调用，不需要关心Skill是本地代码还是远程HTTP。前置钩子可以做鉴权、参数改写；后置钩子做结果清洗脱敏。

### 3. Tool‑Call适配原理

Hermes做了一层抽象，兼容两类模式：

原生OpenAI tool‑call；

无原生tool‑call能力的开源模型：通过prompt约束+正则/json解析，从文本里提取Action。> 国产化开源模型大多走第二种，更容易出现解析失败，Hermes内置解析失败降级策略：把解析异常作为Observation喂回LLM重新生成。

### 4. 记忆机制原理

短期记忆：内存List保存[Thought, Action, Observation]；

会话记忆：数据库持久化完整会话序列；

长期记忆：当配置记忆写入Skill时，把重要事实向量化存入Milvus；新请求时检索Top‑N记忆拼入prompt。Hermes本身不会自动识别哪些信息要存长期记忆，该判断逻辑交给LLM通过Skill调用完成。

> Hermes本身不会自动识别哪些信息要存长期记忆，该判断逻辑交给LLM通过Skill调用完成。

Hermes本身不会自动识别哪些信息要存长期记忆，该判断逻辑交给LLM通过Skill调用完成。

### 5. 本体与Agent协同原理

本体（OWL）本身不在Hermes内核；本体能力体现为：

Prompt注入本体约束（实体、关系、业务规则）减少幻觉；

通过Skill执行图谱查询，本体用于校验NL2Query生成的语句是否符合业务模型，过滤非法查询；

本体推理机（HermiT/Jena Reasoner）推理结果作为Observation送入Loop。

## 四、扩展能力（开发者扩展点）

### 1. 扩展Skill（最常用）

1）自定义Python Skill：继承BaseSkill，实现execute，注册到Harness；2）接入第三方HTTP服务：填写OpenAPI Schema生成远程Skill；3）Skill支持前置、后置钩子，可以做日志、鉴权、脱敏。

### 2. 扩展Loop行为

自定义终止判断器：替换默认Loop结束逻辑；

增加自定义中间步骤：每一轮Loop前后插入自定义回调；

支持子Loop开发，实现任务分解。

### 3. 扩展Memory存储

默认支持SQL会话库+Milvus长期记忆；可实现Memory抽象接口替换为其他向量库、数据库。

### 4. 扩展模型后端

实现抽象ModelClient接口，可以对接任意私有化推理服务（昇腾vLLM、ModelArts等）。

### 5. 扩展反思模块

替换内置反思Prompt与逻辑，实现业务专属校验规则（金融场景结果合规校验等）。

### 6. 扩展本体/图谱能力

新增自定义NL2Query Skill，适配自己的图谱引擎；扩展本体校验钩子。

### 7. API/SDK扩展

Hermes提供服务API与SDK，可以嵌入业务系统；支持自定义请求中间件。

## 五、当前框架局限（开发者需要注意）

Hermes‑Agent是运行时框架，不提供开箱即用高质量Prompt；业务效果高度依赖Prompt工程、Skill质量、本体建模；

没有内置自动的上下文窗口管理，超长会话需要自行开发摘要Skill；

本体、知识图谱属于上层Skill能力，不是内核内置，需要开发者完成本体设计、图谱数据构建；

Loop循环轮次越多token开销越大；生产环境需要做好最大轮次限制；

对弱tool‑call能力开源模型，JSON解析失败率上升，需要配套降级策略；

原生不支持分布式Agent（多Agent协作），多Agent需要上层业务基于Hermes实例组装。

## 六、开发者典型二次开发工作流

梳理业务任务，拆解需要哪些Skill；

开发/注册Skill到Harness，完善Schema；

编写Agent Prompt模板，配置Loop最大轮次、反思开关；

如果需要知识图谱：完成本体建模，开发图谱查询Skill；

接入私有化大模型后端；

测试单步Skill、测试Loop闭环；调优解析失败、参数错误、幻觉场景；

接入可观测指标，上线。

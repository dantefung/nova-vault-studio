---
title: "企业级 MultiAgent 落地：Plan 模式与主子 Agent 协作｜得物技术"
date: "2026-09-09"
source: "微信公众号·得物技术"
url: "https://mp.weixin.qq.com/s/gyEEugg2z7zQxFpa_Eonmw"
author: "光度"
---

# 企业级 MultiAgent 落地：Plan 模式与主子 Agent 协作

> 基于 AgentScope Java 的企业级 MultiAgent 平台介绍 Plan 全生命周期、主/子 Agent 协作、A2A 跨服务协议及企业级能力保障。

## 一、项目背景

建设基于 **AgentScope Java** 的企业级 MultiAgent 平台，为研发、数据分析和知识问答等场景提供统一的模型调用、工具接入、任务编排、流式输出与运行追踪能力。本文聚焦复杂任务如何规划、如何拆给专业 Agent，以及不同服务之间如何协作。

## 二、为什么需要 Plan

"分析一组数据、检索资料、生成报告并给出建议"包含多个相互依赖的步骤。只使用 ReAct 循环（推理、调用工具、继续推理）会遇到：

- 后面才发现前置步骤不完整
- 过程隐藏在 Prompt 中，执行前无法审计
- Token 消耗难以预估
- 工具失败后缺少稳定的恢复路径

**Plan-and-Execute** 把"要做什么"和"怎么做"拆开：先生成结构化计划，再逐项执行。计划不再是备注，而是一个有状态、可持久化、能被前端观察的运行对象。

## 三、Plan 的全生命周期

### 1. 创建计划

将计划操作注册成工具，由模型根据任务动态创建和调整。最小工具集：

```
create_plan(name, description, subtasks)
activate_subtask(index)
finish_subtask(index, outcome)
finish_plan(summary)
```

### 2. Hint 注入

模型可能"忘记"自己正在执行计划，每轮推理前根据状态注入短提示：
- 没有计划时建议创建
- 计划已创建时提醒激活下一项
- 存在进行中任务时提示可执行、完成或放弃
- 全部完成时提醒结束计划

Hint 是软约束，不替模型决策。框架负责硬约束（同一时刻只允许一个任务进行中，不能跳过未完成的前置任务）。

### 3. 持久化与断点恢复

长任务可能因刷新页面、网络断开或服务重启而中断。计划状态应独立保存，每次变化立即序列化；重连后读取最后有效版本继续执行。恢复要幂等。

### 4. SSE 过程可见

通过 SSE 推送结构化事件：
- `CHAT` — 回复增量文本
- `PROCESSING` — 计划、工具或子 Agent 的状态
- `ERROR` — 异常

前端可展示"正在检索资料""第 2/5 项已完成"等状态卡片。

## 四、主 Agent 与子 Agent 协作

单个 Agent 同时承担规划、查询、分析和写作时，工具集会变大，上下文会变杂，权限边界也会模糊。主/子 Agent 模式把职责拆开：主 Agent 负责理解目标、分解任务和汇总结果；子 Agent 负责某一类专业工作。

### 1. 声明式配置与调用

```yaml
name: data_analyst
description: 负责数据查询与统计分析
tools: [query_data, calculate_metric]
```

平台启动时创建独立实例，再包装成主 Agent 可调用的工具。子 Agent 拥有独立记忆、工具集和系统提示，只接收当前任务输入。

### 2. 可观测与中断传播

- 主、子 Agent 的工具事件汇聚到同一条追踪链路
- 取消必须贯穿层级：父会话设置中断标志，子 Agent 在执行周期检查并协作式退出
- 流式连接关闭，后台任务进入可回收状态

## 五、A2A：跨服务的 Agent Teams

同进程内的子 Agent 适合快速编排，但不同团队往往独立维护 Agent 服务。A2A（Agent-to-Agent）提供标准协议，让服务发现彼此、提交任务、接收流式结果并管理会话。

一次 A2A 调用拆成三层：

1. **发现**：服务发布 Agent Card，声明能力、技能和通信方式
2. **调用**：JSON-RPC over HTTP/SSE，支持同步、流式、查询和取消
3. **执行适配**：被调用服务把协议消息转换为统一会话入口

典型时序：发现层拿到对方 Agent Card → 发送首条消息创建会话返回 `contextId` → 后续请求携带该标识延续上下文 → 长任务通过流式接口逐步回传 → 随时可查询状态或取消。

**关键安全规则**：`contextId` 必须与发起方身份绑定；异步恢复时租户条件要重新注入数据访问层。

## 六、企业级能力保障

### 1. 多租户全链路隔离

ORM 层强制注入租户条件，所有 SQL 执行前自动拼接租户标识。Agent 配置、对话记录、Plan 数据、向量索引均在租户维度严格隔离。Plan 数据以会话为目录物理隔离。

### 2. 双模式认证与 API Key 开放接入

- JWT 本地认证（平台 Web 端）
- 企业 SSO 单点登录
- API Key 拦截器（服务间调用、系统集成）

### 3. 全链路追踪：多层调用树

```
Trace: conversationId=xxx, agentId=yyy
├─ Span: 主 Agent 推理（第1轮）
│   └─ Tool Call: query_database [input/output/latency/tokens]
├─ Span: 子 Agent data_analyst 执行
│   ├─ Span: 子 Agent 推理
│   └─ Tool Call: execute_sql [input/output/latency/tokens]
└─ Span: 主 Agent 推理（第2轮）
    └─ Tool Call: task_output [返回子 Agent 结果]
```

### 4. SSE 分层消息协议

所有 Agent 响应通过 SSE 实时推流，执行监听器将过程中每个事件转换为结构化消息。前端可精确渲染每一步行动。

### 5. 异常保护的四道防线

| 防线 | 机制 |
|------|------|
| 工具级超时与重试 | 每个工具调用独立超时和退避重试 |
| ReAct 循环迭代上限 | 防止 LLM 陷入无效工具调用循环 |
| Plan 状态合法性约束 | 切换子任务为进行中前校验前序任务 |
| 子 Agent 协作式中断 | 用户取消时父 Agent 检查中断标志 |

### 6. 向量、全文检索双引擎

- 向量数据库：语义检索，适合开放式问答
- 全文检索引擎：精确匹配，适合文档查找

原生支持 MCP（Model Context Protocol），任意 MCP 服务可动态挂载为 Agent 工具。

## 七、典型应用场景

**场景一：复杂研究报告生成**
Plan 自动创建子任务列表，用户在等待过程中看到进度实时更新。

**场景二：多系统数据聚合**
主 Agent 同时向三个专属子 Agent 提交任务（CRM、ERP、BI），各子 Agent 并行执行，主 Agent 聚合结果后生成周报。

**场景三：跨部门 Agent 协作（A2A）**
运营 Agent 生成报告后自动调用法务 Agent 进行合规扫描，两个服务独立维护，通过标准协议互操作。

## 八、总结

Plan 让复杂任务可拆解、可恢复；主/子 Agent 让专业能力可组合、可隔离；A2A 让不同团队的 Agent 通过标准协议协作。系统能否进入生产，取决于计划是否持久化、状态是否可见、取消是否能传递、权限是否能跨服务保持，以及失败时是否有清晰边界。

## 参考资料

- Anthropic：《Building Effective Agents》
- Lilian Weng：《LLM Powered Autonomous Agents》
- ReAct 论文：《Synergizing Reasoning and Acting in Language Models》
- Google A2A Protocol Specification
- AgentScope Java 多 Agent 文档

## 往期回顾

1. 得物小摊 AI Native 演进实录：用 Harness 构建可控 AI 交付
2. 企业级 MultiAgent 的记忆系统：短期上下文与四层记忆架构实现
3. EP-Harness：从个人 AI Coding 到团队级 Agent 工作流
4. 得物知识问答：复合检索 Agent 的系统设计实践
5. 实战从零开始构建一个Coding Agent：Violin

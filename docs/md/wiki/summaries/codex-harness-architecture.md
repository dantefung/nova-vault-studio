---
title: "Codex Harness 架构解析与应用 — 精读摘要"
date: "2026-08-22"
source: "架构师 JiaGouX"
url: "https://mp.weixin.qq.com/s/TDnw2sKTJwHGF7kwbj_1_g"
---

# Codex Harness 架构解析与应用 — 精读摘要

> 作者：若飞（公众号：架构师 JiaGouX）| 2026-08-22

## 核心结论

Codex Harness 不是一组 Prompt 或简单的 Agent Loop，而是一套有状态的 Agent 运行时：向下管模型采样、工具执行和沙箱隔离，向上通过 App Server 暴露给多种产品。OpenAI 正把 Codex 的执行部分从单一产品里拆出来，供 CLI、IDE、桌面应用和第三方产品共用。

**关键数据**：同一个 GPT-5.6 Sol 模型，在 `ARC-AGI-3` 基准上，默认配置 13.3%，开启 retained reasoning + context compaction 后跳到 38.3%（输出 token 减少 6 倍）。执行层对任务表现的影响已与模型本身同一量级。

## 四层架构

Codex 可拆为四层：产品应用层 → App Server（协议边界）→ Core Session（运行容器）→ Agent Loop + 模型采样。App Server 没有另起一套 Loop，而是把外部请求送进 Core，再把内部事件整理成客户端可以长期依赖的协议。

## Thread / Turn / Item 三对象

| 对象 | 含义 | 操作 |
|------|------|------|
| Thread | 可持久化、可恢复的 Agent 会话 | 创建、恢复、分叉、归档、订阅 |
| Turn | 一次用户输入触发的 Agent 工作 | 启动、Steer、中断、等待完成 |
| Item | Turn 内的原子输入或输出 | 展示消息、推理、命令、文件修改、工具与审批 |

协议双向：客户端发 `turn/start`、`turn/steer`（需带 `expectedTurnId`）、`turn/interrupt`（提交 `Op::Interrupt` 而非直接改状态）；服务端发审批请求。

## App Server 关键代码

1. **`handle_client_request`**：先处理 `initialize` 握手，握手未完成返回 `Not initialized`。按 `serialization_scope()` 做资源级串行队列，`turn/*` 以 Thread ID 为串行范围。背压策略：有界队列，入口饱和返回 `JSON-RPC-32001`，客户端指数退避。
2. **`thread/start`**：`thread_start_inner` 校验 → `thread_start_task` 加载配置/计算 Trust/检查工具 → `ThreadManager::start_thread` 创建 Core Thread → 挂 Listener → 返回 `ThreadStartResponse` + `thread/started` 通知。
3. **Listener**：监听 Core Thread，`ThreadState` 更新内部状态，转换事件为类型明确的通知发客户端。Thread 停止且无订阅者 30 分钟后卸载回收。

## 三层 Agent Loop

1. **`RegularTask::run`**：发出 `TurnStarted` 后循环调用 `run_turn`；返回后检查 `InputQueue` 是否还有待处理输入，有则继续消费。
2. **`run_turn`**：采样前处理异步 Hook 结果、判断预压缩、解析 MCP Server；采样后检查 Follow-up/新输入/Token 限制/Stop Hook；触发 Auto Compaction（非聊天摘要，是循环控制路径上的上下文压缩）。
3. **`try_run_sampling_request`**：消费模型流，跟踪 Active Item 和 Token 用量，工具 Future 放入 `FuturesOrdered`，监听取消信号。

**核心工程价值**：把模型流、工具执行、用户输入、上下文和取消信号收进同一条可持续的状态机。

## 审批 vs 业务授权

| 控制 | 回答的问题 | 应由谁负责 |
|------|-----------|-----------|
| Harness 执行许可 | 能否运行命令、改文件、访问网络 | Codex 权限、沙箱与客户端审批 |
| 业务动作授权 | 能否退款、改签、发布、关闭告警 | 业务身份、权限、流程与审计系统 |

> 业务系统拥有事实和权力，Harness 拥有思考与执行过程。

## 三种接法

| 方式 | 适用场景 | 特点 |
|------|---------|------|
| `codex exec` | CI、批处理、一次性任务 | 进程级，无持久 Thread |
| Codex SDK | 服务端工具、编排流程 | 代码控制 Thread，免维护协议绑定 |
| App Server | 持久会话、中途补充、审批、自定义界面 | JSON-RPC + stdio/SSE，全生命周期 |

## 三个工作现场

| 现场 | Harness 留住什么 | 谁确认完成 |
|------|-----------------|-----------|
| CI 修复 | 执行过程、命令、文件修改 | 测试、CI 状态、Diff 与代码评审 |
| 线上告警 | 排障上下文、工具轨迹、人工介入 | 指标、健康检查、告警和变更系统 |
| 工单 / 物流 | 查询过程、候选方案、待批准动作 | 订单、运单、支付或工单系统 |

## 三条结构性线

1. **单一执行内核，多种产品入口**：CLI/IDE/第三方不各造一套 Loop，差异留在界面层
2. **协议承接完整生命周期**：Thread/Turn/Item/Steer/Interrupt/Approval 都有正式语义
3. **执行过程与业务事实分开**：App Server 维护 Agent 状态，业务系统拥有事实与权力

**作者判断**：Codex Harness 应称为 Agent Runtime 而非 Agent OS——它实现了同一内核驱动多个产品，但没有替代业务后端，也没有定义跨 Runtime 的应用打包方式。

## 关键词

`App Server`, `Core Session`, `Thread/Turn/Item`, `JSON-RPC`, `stdio`, `Auto Compaction`, `retained reasoning`, `Approval`, `Harness 执行许可 vs 业务授权`, `codex exec / SDK / App Server`

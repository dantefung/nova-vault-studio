---
title: "从 Codex Harness 到 DSH Subagent：Agent 正在进入软件架构的新一层 — 精读摘要"
date: "2026-08-21"
source: "微信公众号：架构师"
url: "https://mp.weixin.qq.com/s/RlgwFWpaLj2sH_pK-EZRAg"
---

# 从 Codex Harness 到 DSH Subagent：Agent 正在进入软件架构的新一层 — 精读摘要

## 核心结论

**Agent 正在从一个需要人直接使用的产品，变成其他软件也能调用的执行单元。** 组合粒度从"模型调用 → 工具调用"抬升为"模型调用 → 工具调用 → Agent 调用"。Harness 有可能成为 Agent 时代新的基础设施层。

## 已经发生的事实

1. **Codex 把执行入口开放给外部宿主**：app-server 作为控制接口和事件转换层，支持创建 thread、启动 turn、接收事件、中断任务和回应审批。DSH 选择 app-server 而非 CLI/SDK，因为需要亲自创建 thread、启动 turn、等待完成并处理中断。

2. **DSH 把完整 Agent 暴露成父 Agent 可以调用的工具**：`subagent_codex` 调用会启动 Codex 自己的 app-server、thread、turn 和 Agent Loop。父 Agent 只是委派任务，Codex 继续管自己的 Loop、工具、沙箱和审批。

3. **Codex 和 Claude Code 适配器仍停留在一次性委派**：每次新开进程、临时 thread、独立 query。不继承父对话、角色设定、工具筛选。子 Agent 中间过程不会复制到父会话。

4. **固定版本，不查系统 PATH**：Codex 适配器固定 `@openai/codex@0.147.0`；Claude Code 由固定版本 SDK 选择兼容 CLI。

## 推演

### Harness 成为基础设施层

模型提供推理能力，Harness 管状态、Loop、工具、沙箱、审批和事件，宿主把它接进具体产品。

ARC-AGI-3 实验：保留推理状态 + 上下文压缩后，GPT-5.6 Sol 得分从 13.3% 提升到 38.3%，Token 降到六分之一。

### Agent 编排：四种控制权不能混在一起

| 参与者 | 责任 |
|--------|------|
| 父 Agent | 判断是否委派、选择子代理、组织任务 |
| DSH 运行时 | 暴露工具，启动适配器，管理进程、Job、取消和结果 |
| Codex / Claude Code | 维护上下文、运行 Loop、调用工具、执行沙箱和权限 |
| 业务系统与人 | 提供权威事实，决定业务动作能否发生，用真实结果验收 |

三件事不能混：选中子代理 ≠ 拿到全部权限；子代理说"完成" ≠ 业务验收通过；取消 Job ≠ 副作用已回滚。

### 未来需要补齐的标准

任务合同、资源计量、超时、隔离、可观测、权限联动、副作用处理。

### 四个架构问题

1. 谁调度 Agent？
2. 谁维护执行过程？
3. 谁批准动作？
4. 最后由谁给结果认账？
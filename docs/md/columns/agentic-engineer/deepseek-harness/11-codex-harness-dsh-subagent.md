---
title: "从 Codex Harness 到 DSH Subagent：Agent 正在进入软件架构的新一层"
date: "2026-08-21"
source: "微信公众号：架构师"
url: "https://mp.weixin.qq.com/s/RlgwFWpaLj2sH_pK-EZRAg"
---

# 从 Codex Harness 到 DSH Subagent：Agent 正在进入软件架构的新一层

> 作者：若飞 | 公众号：架构师（JiaGouX）
> 关键词：Codex Harness、DSH Subagent、Agent Runtime、Harness 基础设施

---

## 核心结论

**Agent 正在从一个需要人直接使用的产品，变成其他软件也能调用的执行单元。** 组合粒度从"模型调用 → 工具调用"抬升为"模型调用 → 工具调用 → Agent 调用"。Harness 有可能成为 Agent 时代新的基础设施层。

---

## 已经发生的事实

### 1. Codex 把执行入口开放给外部宿主

Codex app-server 是控制接口和事件转换层。外部宿主 → app-server → thread/start → turn/start → run_turn → 模型采样与工具执行。DSH 选择 app-server（而非 CLI/SDK），因为需要亲自创建 thread、启动 turn、等待完成并处理中断。

### 2. DSH 把完整 Agent 暴露成工具

`subagent_codex` 链路：父 Agent 调用 → DSH 启动 Codex app-server → 创建临时 thread → 启动 turn → 等待 `turn/completed` → 交回最终回答。Codex 继续管自己的 Loop、工具、沙箱和审批。

Codex 和 Claude Code 是两个按需安装的 Profile Bundle，安装后需在 Agent 预设中显式打开工具。模型看到的是 `subagent_codex`、`subagent_claude_code` 这类稳定具名工具。

**DSH 没有重做 Codex，也没有把它们拆成 Function 再重写。**

### 3. 适配器仍是一次性委派

- 每次新开进程、临时 thread、独立 query
- 不继承父对话、角色设定、工具筛选
- 子 Agent 中间过程不会复制到父会话
- 固定版本（Codex: `@openai/codex@0.147.0`），不查系统 PATH
- 没有统一的超时验收和副作用回滚

## 推演：Harness 成为基础设施层

Harness 管状态、Loop、工具、沙箱、审批和事件；宿主把它接进具体产品。模型没换，执行状态和上下文整理方式不同，结果也会差很多（ARC-AGI-3: 13.3% → 38.3%，Token 降六分之一）。

## 四种控制权不能混在一起

| 参与者 | 责任 |
|--------|------|
| 父 Agent | 判断是否委派、选择子代理、组织任务 |
| DSH 运行时 | 暴露工具，启动适配器，管理进程、Job、取消和结果 |
| Codex / Claude Code | 维护上下文、运行 Loop、调用工具、执行沙箱和权限 |
| 业务系统与人 | 提供权威事实，决定业务动作，用真实结果验收 |

三件事不能混：选中子代理 ≠ 拿到全部权限；子代理说"完成" ≠ 业务验收通过；取消 Job ≠ 副作用已回滚。

## 四个架构问题

以后做系统架构，多问：谁调度 Agent？谁维护执行过程？谁批准动作？最后由谁给结果认账？

---

[← 上一](./10-reversible-architecture.md) | [← 回到 DeepSeek Harness 专栏](./index.md)
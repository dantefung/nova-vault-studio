---
title: "cc-connect `/model` 命令 — 客户端切换模型"
date: "2026-07-30"
source: "GitHub chenhg5/cc-connect"
url: "https://github.com/chenhg5/cc-connect/blob/main/docs/usage.md"
---

# cc-connect `/model` 命令：客户端切换模型

> 聊天客户端通过斜杠命令 `/model` 切换当前 agent 使用的模型，无需重启会话。

---

## 命令格式

| 命令 | 说明 |
|------|------|
| `/model` | 列出可用模型（格式：`alias - model`） |
| `/model switch <alias>` | 按别名切换 |
| `/model switch <name>` | 按完整模型名切换 |
| `/model <alias>` | 兼容旧写法 |

## 模型列表来源

若在 `[[projects.agent.providers.models]]` 中预配置了模型别名列表，`/model` 直接展示该列表而不发起 API 请求；未配置时调用 provider API 或使用内置备选列表。

## 会话保留

模型切换会保留当前会话——agent 继续在新模型下对话，不额外消耗 token。但模型切换作用于共享的 agent 实例，多个平台共用同一个 project 时，切换会影响所有平台。

## 后端处理

命令由 `core.Engine` 的 `cmdModel` 方法处理，解析 `switch <alias>`，通过 `ModelSwitcher` 接口调用 agent 的 `SetModel`。

具体 agent 实现（如 Cursor Agent）的 `SetModel`/`GetModel`/`AvailableModels` 负责实际的模型状态维护和可用模型列表拉取。

## 管理 REST API

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/projects/{name}/models` | 列出模型 |
| `POST` | `/projects/{name}/model` | 切换模型（调用 `e.switchModel(body.Model)`） |

## Bridge 协议交互卡片

对于支持交互式卡片的平台（飞书、Bridge 协议适配器），可以用带按钮或下拉选择器的卡片，用户点击后实际发送 `cmd:/model switch <名称>`，最终走向同一条 `/model` 处理路径。

## i18n 反馈

| 消息键 | 内容 |
|--------|------|
| `MsgModelChanged` | "模型已切换为 `%s`" |
| `MsgModelChangeFailed` | 切换失败提示 |
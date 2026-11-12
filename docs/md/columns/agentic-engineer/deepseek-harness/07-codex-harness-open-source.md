---
title: "OpenAI 全面开源 Codex Harness——「把 AI 装进专业界面，不是让用户适应聊天框」"
date: "2026-08-21"
source: "微信公众号：ASI 启示录（新智元报道）"
url: "https://mp.weixin.qq.com/s/fbKi7IrAvmv49IfJbI9w7Q"
---

# OpenAI 全面开源 Codex Harness

> OpenAI 正式将 Codex 底层核心框架（Harness）作为平台全面开源。Apache-2.0 许可证，仓库 github.com/openai/codex。

---

## 核心数据

| 基准 | 模型 | Harness 改进前 | Harness 改进后 | Token 变化 |
|------|------|---------------|---------------|-----------|
| **ARC-AGI-3** | GPT-5.6 Sol | 13.3% | **38.3%** | **减少 6 倍** |

> 仅仅对 Harness 进行了两项关键调整——**保留推理**与**上下文压缩**，模型得分飙升近 3 倍，同时 Token 消耗降为原来的 1/6。

## 三大开源组件

| 组件 | 适用场景 | 核心能力 |
|------|---------|---------|
| **CLI** (`codex exec`) | 自动化流水线 / CI / 一次性后台任务 | 有边界的 Agent 工作流，返回结构化输出 |
| **SDK** (TS / Python) | 在应用程序中编程式控制 Codex 任务 | 精准控制线程与任务生命周期 |
| **app-server** | 嵌入产品，最佳选择 | JSON-RPC 协议，持久对话状态、流式事件、中断 AI、暴露自有工具、Human-in-the-loop |

## 核心理念

> 与其要求每一个团队都把他们原本熟悉的工作流程，强行搬到一个通用的代码助手中去，不如把 Agent 直接带入那些围绕实际工作设计的软件里。

**三个维度的控制权**：

1. **界面控制权**——用户继续使用熟悉的仪表盘、编辑器、地图，AI 是隐形帮手而非霸占屏幕的主角
2. **上下文与工具控制权**——通过 MCP 将公司核心系统、机密文档、内部 API 直接开放给 Agent
3. **运营边界与安全控制权**——宿主应用决定 Agent 运行位置、可访问文件；危险操作必须经过 Human-in-the-loop

## 落地案例

| 案例 | 场景 | 结果 |
|------|------|------|
| **Thrive Holdings + Crete** | 税务申报 | 处理 **7,000 份** 申报表，税务准备时间缩短约 **1/3** |
| **Cisco App Builder** | 云控制平台 | 客户用自然语言创建自定义应用 |
| **Relay（官方 Demo）** | 物流运营看板 | 选中延误货单→自动获取上下文→MCP 工具查询→弹出审批→执行后看板刷新 |

## 产品哲学

> 我们要做的，绝不是用一个万能的聊天框去干掉所有专业界面；而是给这些界面装上一个聪明的大脑。

> 当通用聊天框消失，原生 AI 应用将蓬勃发展。

> 📎 完整原文见知识库：[wiki/sources/codex-harness-open-source.md](../../../wiki/sources/codex-harness-open-source.md)

---


[← 上一篇：06、Cordis与Pi两种答案](./06-cordis-dsh-vs-pi.md) | [→ 专栏首页](./index.md)

---
title: "用 magpie + Kiro 订阅，在 Claude Code 中稳定使用 Claude Opus 5.5"
date: "2026-10-20"
source: "X/Twitter"
author: "Vince 聊开发 (@vincemask)"
url: "https://x.com/vincemask/status/2112506002193141950"
---

# 用 magpie + Kiro 订阅，在 Claude Code 中稳定使用 Claude Opus 5.5

> 把 Kiro 订阅里的 Claude Opus 接入 Claude Code，不用单独购买 Anthropic API 额度，也不用另搭 Kiro Gateway——但这是第三方接入方案，Kiro 官方目前不允许通过此类外部 Agent 框架使用订阅，账号有被限制的风险。

<!-- more -->

## 方案概述

magpie + Kiro 订阅的组合，可以把 Kiro 订阅中的 Claude Opus 接入 Claude Code，也能接入 Claude Desktop 的 Code 和 Cowork。目前这套方案可以正常调用模型，不用单独购买 Anthropic API 额度，也不用再搭一套 Kiro Gateway。

先说明一点：这是第三方接入方案。Kiro 官方目前不允许通过这类外部 Agent 框架使用订阅，账号有被限制的风险。下面主要讲技术原理和配置方法。

## 一、为什么选择 magpie？

以前想把 Kiro 模型接到 Claude Code，常见做法是用 Kiro Gateway，再配合 CC Switch 管理 API 地址和模型。现在用 magpie 可以简化这套流程。

magpie 是一个开源的 AI Agent 模型管理工具，支持 macOS、Windows 和 Linux。它的核心能力包括：

- **统一模型管理**：Claude Code、Claude Desktop、Codex、OpenCode 等工具共用一套模型配置。
- **订阅接入**：通过插件接入 Kiro 等第三方订阅。
- **协议转换**：在 OpenAI、Anthropic、Gemini API 协议之间转换请求。
- **可视化配置**：在 GUI 里选模型，不用反复改配置文件。
- **请求监控**：查看实际使用的模型、路由、Token 消耗和错误信息。

同时使用多个 Coding Agent 的话，magpie 能省掉不少配置工作。

## 二、技术原理

整个请求链路如下：

magpie 对外提供 Anthropic 兼容接口，Kiro 插件负责身份认证和请求格式转换。网关端口以 magpie「网关」页显示为准，原文作者本机是 3444。

有两个关键点：

1. Claude Code 保留原有的命令行、工具调用和 Agent 工作流。
2. 模型请求由 Kiro 订阅提供，额度也算在 Kiro 账上，不走 Anthropic API。

所以使用体验与直接用 Anthropic 模型比较接近，但网关兼容性和服务端能力仍可能带来差异。

## 三、安装和配置四步

### 1. 准备环境

需要安装：

- Kiro：登录自己的 Kiro 账号，并确认订阅有效。
- magpie：从官网下载安装。
- Claude Code：终端里的 Coding Agent。
- Claude Desktop：桌面端的 Code 和 Cowork。

注意：Opus 模型需要对应的 Kiro 付费计划、地区和模型权限。

### 2. 在 magpie 中添加 Kiro

打开 magpie，进入 Plugins（插件）页面，找到 Kiro 插件（opencode-kiro-auth）并安装。也可以用命令行安装并登录。

插件支持走 Kiro 自身的登录流程授权，也支持复用本机 Kiro CLI / IDE 已有的认证状态。认证成功后，magpie 会把 Kiro 作为模型供应商。

### 3. 给 Claude Code 指定 Opus

进入 magpie 的 Agents 页面：

1. 找到 Claude Code。
2. 点击模型选择器。
3. 选择 Kiro 供应商。
4. 在可用模型中选择 Claude Opus。
5. 保存配置，重新启动 Claude Code 会话。

选好后 Claude Code 一行会显示 claude-opus-5.5，并提示可以在 `/model` 里切换 opus、sonnet、haiku 档位。

截至 2026 年 10 月，Kiro 官方已推出 Claude Opus 5.5，最高支持 1M 上下文窗口，Credit 消耗倍率为 2x，符合条件的付费账号可用。实际能选到哪个 Opus 版本，以 Kiro 返回的模型列表和插件支持情况为准。

magpie 会自动修改 `~/.claude/settings.json`，把请求路由到本地网关。之后照常运行：

就能继续使用 Claude Code 原有的开发工作流。

### 4. 配置 Claude Desktop

magpie 已支持 Claude Desktop 的第三方推理网关模式（3P），通过配置文件把 Desktop 的模型请求切到本地网关。

操作方式：

1. 在 magpie 的 Agents 页面找到 Claude Desktop。
2. 选择通过 magpie 网关使用模型。
3. 选择 Kiro 提供的 Opus。
4. 完全退出并重新启动 Claude Desktop。

按 magpie 的实现文档，这种方式主要支持 Desktop 中的 Code 和 Cowork，不能理解为 Claude Desktop 的所有在线功能都改由 Kiro 提供。它也不需要修改 Claude Desktop 的程序文件。

## 四、Kiro 付费档位

Kiro 目前有四档付费计划：

| 档位 | 月价 | Credits |
|------|------|---------|
| Pro | $20/月 | 1000 |
| Pro+ | $40/月 | 2000 |
| Pro Max | $100/月 | 5000 |
| Power | $200/月 | 10000 |

所有付费计划都可开启超额用量。

## 五、怎么确认用的确实是 Kiro Opus？

不要只看 Claude Code 里 `/model` 显示的模型名，也不要只问模型"你是谁"。模型名可以通过网关映射，单凭它不能证明实际调用的是哪个模型。建议检查三个地方：

1. **magpie 的 Routing / Usage 记录**：确认请求的 Provider 是 kiro，并查看实际上游的 Model ID、请求结果和 Token 统计。
2. **Kiro 订阅用量**：发起一次测试请求，看 Kiro 的 Credit 消耗有没有相应变化。
3. **工具调用**：在真实代码仓库里，让 Agent 搜索代码、修改多个文件、运行测试，并持续多轮对话。

这些都正常，基本可以确认链路和工具调用可用。但这仍不能证明模型权重版本、推理能力与 Anthropic 官方直连完全一致，模型的真实性要结合可信的上游记录和服务商信息来判断。

另外，Kiro 插件在 2026 年 10 月 14 日发布的 0.1.10 版本中修复了 Prompt Cache 标记转换问题。建议使用最新版本（原文作者是 v0.1.12），并检查缓存命中数据。

## 六、几个需要注意的问题

**账号安全**：这种接入方式有明确的服务政策风险。Kiro 官方 FAQ 规定，订阅只能用于 Kiro 原生产品和 ACP 兼容 IDE 等指定方式，不允许第三方自动化框架绕过其原生接口做路由。现在能用，不代表以后不会被限制，更不能保证不封号。

**额度**：Kiro 的订阅额度不是无限的。Opus 通常比 Auto 等模式消耗更多 Credit，高强度的 Agent 工作流尤其要留意用量。magpie 也会给出节省 Token 的建议，比如把 Claude Code 自动压缩阈值从 1M 调到 240K，按 388 次调用估算可少用约 5% Token（这只是 Token 估算，没有衡量压缩后 Agent 的任务表现）。

**数据安全**：通过这条链路发送的代码和提示词，仍由 Kiro 上游服务处理，magpie 插件本身也能看到请求内容。涉及公司私有仓库、密钥和敏感数据时，应先确认数据处理政策和企业授权。

**兼容性**：本地网关解决了主要的 API 协议差异，但 Claude Code 和 Claude Desktop 中依赖 Anthropic 官方服务的部分功能，未必能通过第三方网关完整工作。

## 七、总结

magpie 最吸引的地方，是把原本分散在多个 Agent 里的模型配置集中到一处。一份订阅就能在不同开发工具之间快速切换模型，省去重复配置。

如果你已经在用 Kiro，又更习惯 Claude Code 或 Claude Desktop 的工作流，这个方案值得从技术实现和兼容性角度研究。但如果打算长期使用，尤其是用在生产项目上，建议优先选 Kiro 官方支持的 IDE、CLI 或 ACP 接入方式。

## 八、相关项目与资料

- **magpie**：[github.com/yetone/magpie](https://github.com/yetone/magpie)（MIT 许可，约 21.7k stars）
- **Kiro 插件**：[magpie-community/plugins](https://github.com/magpie-community/plugins)
- **magpie 中文文档**：[usemagpie.ai/docs/zh/start](https://usemagpie.ai/docs/zh/start)
- **Kiro Opus 5.5**：Kiro 官方公告
- **Kiro 订阅使用政策**：官方 FAQ

> 原文为 X Article 纯文本，抓取接口未返回配图，本次不涉及图片本地化。

归档已删除多余的自我介绍和平台导流话术，技术方案、风险说明与引用资料完整保留。

## 相关页面

- [[concepts/harness-engineering]]
- [[concepts/agent-token-architecture]]
- [[patterns/agent-skill-design-patterns]]
- [[sources/agent-reach]]

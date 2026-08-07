---
title: "别再让每个 Agent 从零学习了，腾讯开源了一套团队记忆中枢"
date: "2026-08-07"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/4qhafDFTzuPgXTIMHTUKRA"
---

# 别再让每个 Agent 从零学习了，腾讯开源了一套团队记忆中枢

> Agent 用得越多，重复工作越明显。腾讯 TencentDB Agent Memory v2.0.0 把 Agent 工作中产生的内容整理成四类可复用资产——Chat Memory、Skill、Wiki、CodeGraph——再用 Memory Hub 管理谁拥有、谁可见、谁可用。

<!-- more -->

## 核心问题

换一个 Session，要重新解释项目背景；换一个 Agent，要再讲一遍团队约定；排障流程跑通一次，下次遇到相似问题，Agent 还是从零试错。**上一位 Agent 付过的学习成本，怎样留给下一位？**

腾讯 TencentDB Agent Memory v2.0.0（MIT License，GitHub 1.6 万+ Star）的答案：**把 Agent Memory 从个人聊天记录，推向团队可以治理、共享和装配的经验资产。**

![四类资产概览](images/tencentdb-agent-memory/001.png)

## 不是聊天记录仓库

很多 Agent Memory 项目只解决"跨会话记住用户"（技术栈偏好、项目约束、上次进度），对长期工作的 Agent 团队来说不够。

真正能减少返工的内容有四种：

| 资产 | 保存什么 | 下次怎样复用 |
|------|---------|-------------|
| **Chat Memory** | 对话、事实、偏好、决策 | 让 Agent 快速恢复人与项目的背景 |
| **Skill** | 跑通的方法、步骤、资源和验证规则 | 让相似任务不再从头摸索 |
| **Wiki** | 产品文档、设计方案、运维手册 | 按结构搜索与沿链接下钻 |
| **CodeGraph** | 文件、符号、调用关系、影响路径 | 改代码前先做影响分析 |

这四类资产对应四种经常被浪费的成本：**解释过的背景、跑通过的经验、读过的文档、理解过的代码**。

## Chat Memory：四层生长

记忆分层 L0-L3，解决了两种极端——把全部历史塞回上下文（Token 和噪音膨胀），或只保留一份不可追溯的总结（细节压没）：

| 层级 | 内容 | 用途 |
|------|------|------|
| **L0 Conversation** | 原始对话与完整上下文 | 回查原话、时间与来源 |
| **L1 Atom** | 事实、偏好、约束、事件 | 精确召回可直接执行的信息 |
| **L2 Scenario** | 围绕项目或场景组织的知识块 | 快速恢复一个工作场景 |
| **L3 Core / Persona** | 长期画像、稳定模式与高层认知 | 进入用户与团队的长期语境 |

平时优先用 L2/L3 恢复语境，需要核对事实时通过 BM25、向量检索和 RRF 回到 L1/L0。召回受条数、字符预算和超时限制，避免"记忆"占满上下文。

![L0-L3 四层记忆架构](images/tencentdb-agent-memory/002.png)

## Skill：团队经验开始复利的地方

Chat Memory 解决"记住发生过什么"，**Skill 解决"下次应该怎么做"**。项目里的 Skill 不只是一段 Prompt，包括版本、资源文件、触发边界、执行步骤和验证规则。

场景示例：
- 线上故障排查 → 沉淀为「服务异常诊断 Skill」
- 发布流程 → 沉淀为「上线前检查 Skill」
- 代码审查 → 沉淀为「安全 Review Skill」
- 内容生产 → 沉淀为「公众号发布 Skill」

个人 Skill 默认私有，审核后可分享给团队、绑定给特定 Agent。v2.0.0 新增 **Skill 强制归档**，关键经验不会因会话结束而漏掉。

![Skill 装配与复用](images/tencentdb-agent-memory/003.png)

## Wiki 和 CodeGraph：文档与代码也成为记忆

普通 RAG 把文件切成片段做相似度检索；该项目更进一步——**Wiki 整理成结构化页面和链接图谱，CodeGraph 索引文件、符号、调用关系和影响路径**。

Agent 不需要每次重读整份文档或整个仓库，先发现可用工具，再按需搜索页面、读取源码、查 callers/callees，或在改代码前做 impact analysis。

> 对于 Coding Agent，这个思路比"给它更长的上下文窗口"更实际。

## Memory Hub：解决"谁能用"

团队场景中，记忆最难的问题不是"能不能搜到"，而是：

- 这条记忆属于谁？
- 哪个版本有效？
- 给整个团队还是只能给某个 Agent？
- 隐私会不会被其他成员看见？
- 过时的 Skill 能不能被收回？

| 可见性 | 含义 |
|--------|------|
| **private** | 只有 Owner 可读取 |
| **team** | 团队成员可读取 |
| **restricted** | 按 User、Role 或 Agent ACL 授权 |
| **agent** | 定向装配给同团队里的 Agent |

通过 **Agent Loadout**，让 Scout、Builder、Reviewer 等不同角色只带走与任务相关的资产。

## 对接 Claude Code

v2.0.0 提供三个组件：

- **Memory Core**：记忆读写、鉴权、Skill/RAG 数据面
- **Memory Hub**：团队资产管理面板 + Knowledge Service
- **Memory Proxy**：接收 Anthropic/OpenAI 协议，注入记忆/Skill/Wiki/CodeGraph 信息，转发给上游模型

Claude Code 接到 Proxy 后，第一次会话选择 Team、Agent 与 Task，后续请求根据身份获得对应资产。官方推荐 Docker 一键拉起。

![架构示意](images/tencentdb-agent-memory/004.png)

## 部署注意事项

安装前至少准备**两组模型参数**：一组给 Memory/Knowledge 做提取、总结与 Wiki 构建，另一组给 Proxy 转发 Agent 请求。

**安全关键**：`MEMORY_CORE_GATEWAY_API_KEY` 默认留空（本地体验），暴露到公网需自行配置：

- 限制 8420/8125/8424/8096 等端口网络访问
- 妥善保管自动生成的 `.admin-key`
- 普通业务用 `normal` 用户，不长期使用 admin key
- 反向代理层补充 TLS、认证、访问控制和日志审计

## 谁适合用

**适合**：长期使用 Claude Code/CodeBuddy/OpenClaw/Hermes 等 Agent；同一项目多 Agent 或多成员协作；经常重复解释背景和流程；有大量文档/代码/历史会话愿意复用；愿意自部署 Docker。

**不适合**：偶尔开聊天窗口；想要零配置插件；不愿把内部代码交给 LLM 处理；无维护能力；需要成熟企业级方案。

## 小结

最有价值的地方不是又增加一种向量检索方案，而是提出了一个更完整的 Agent 团队问题：

> 经验从哪里产生，怎样变成资产，谁可以使用，又怎样装配给下一位 Agent？

Chat Memory 保留人与事，Skill 沉淀跑通的方法，Wiki 组织文档，CodeGraph 理解代码；Memory Hub 补齐 Owner、版本、状态和权限——**从"让 AI 记性更好"到"给 Agent 团队建立组织记忆"**。

建议：先在一个非敏感项目部署，验证三件事——记忆提取是否准确、Skill 是否减少返工、权限与删除机制是否可控。

## 项目地址

- GitHub: https://github.com/TencentCloud/TencentDB-Agent-Memory
- v2.0.0: https://github.com/TencentCloud/TencentDB-Agent-Memory/releases/tag/v2.0.0
- 安装文档: https://github.com/TencentCloud/TencentDB-Agent-Memory/blob/v2.0.0/INSTALL_CN.md
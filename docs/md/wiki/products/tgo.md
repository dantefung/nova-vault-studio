---
title: "TGO (tgoai)"
date: "2026-06-14"
source: "GitHub"
url: "https://github.com/tgoai/tgo"
---

# TGO (tgoai)

开源 AI Agent 客服平台，帮助企业"Build AI Agent Teams for Customer Service"。

495 Stars，96 Forks，TypeScript 主语言。

## 核心定位

集成多渠道接入、Agent 编排、知识库管理（RAG）、人工协作的 AI 客服平台。

## 核心功能

### AI Agent 编排
- **Multi-Agent 支持** — 配置多个 AI Agent 处理不同业务场景
- **多模型集成** — 支持 OpenAI、Anthropic 等各种 LLM
- **流式响应** — 通过 SSE 实现实时 AI 响应
- **上下文记忆** — 维护对话历史保持连贯

### 知识库 (RAG)
- **文档知识库** — 上传文档增强 AI 回答准确性
- **问答知识库** — 创建问答对快速扩展知识
- **网站知识库** — 抓取网站内容保持信息最新
- **智能检索** — 基于向量的语义搜索精准回答

### MCP Tools 集成
- **工具商店** — 丰富的 MCP 工具库，按需启用
- **自定义工具** — 项目级工具配置和管理
- **OpenAPI Schema** — 自动解析 schema 生成交互表单

### 多渠道接入
- **Web Widget** — 可嵌入网站的聊天组件
- **微信接入** — 公众号和小程序支持
- **统一管理** — 从单一仪表板管理所有渠道

### 人工 + AI 协作
- **智能转接** — 无缝转接到人工客服
- **访客管理** — 收集访客信息、分配会话、跟踪历史
- **客服工作台** — 人工客服的统一界面

## 技术架构

| 仓库 | 描述 | 技术栈 |
|:---|:---|:---|
| tgo-ai | AI/ML 服务，管理 Agent、工具绑定、知识库 | Python / FastAPI |
| tgo-api | 核心业务服务，用户管理、访客跟踪、分配 | Python / FastAPI |
| tgo-cli | CLI 工具 & MCP Server，40+ 内置工具 | TypeScript / Node.js |
| tgo-rag | RAG 服务，文档处理、混合搜索 | Python / FastAPI |
| tgo-web | 管理前端，实时聊天、AI Agent 管理 | TypeScript / React 19 |
| tgo-workflow | Agent 工作流执行引擎，支持 DAG | Python / FastAPI |

## Widget SDKs

| 仓库 | 描述 |
|:---|:---|
| tgo-widget-js | 可嵌入网站的客服聊天组件（Intercom 风格） |
| tgo-widget-ios | iOS 原生客服聊天 SDK |
| tgo-widget-flutter | 跨平台 iOS/Android 客服聊天组件 |

## 系统要求

- **CPU**: >= 4 Core
- **RAM**: >= 8 GiB
- **OS**: macOS / Linux / WSL2

## 快速部署

```bash
REF=latest curl -fsSL https://raw.githubusercontent.com/tgoai/tgo/main/bootstrap.sh | bash
```

## 相关

- [[rag-knowledge-base]] — RAG 知识库
- [[multi-agent-orchestration]] — 多 Agent 编排
- [[mcp-tools]] — MCP 工具集成

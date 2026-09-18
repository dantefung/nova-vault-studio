---
title: "Multica 私有化自托管部署指南精读摘要"
date: "2026-09-16"
source: "君哥的学习笔记"
url: "https://www.it235.com/ai/multiagent/mutlica.html"
---

# Multica 私有化自托管部署指南精读摘要

## 核心结论

Multica 提供了基于 Docker 与 Docker Compose 的完整私有化部署方案，支持基于源码构建与官方镜像一键编排。系统依赖 PostgreSQL（带 pgvector 插件）与 Redis 两个基础存储中间件，前端采用 Next.js 构建，后端为 Go 服务，并配合宿主机常驻的 Agent Daemon 实现任务拉起。

## 部署核心架构与组件

| 组件 | 技术栈 | 职责 | 端口/网络 |
|------|--------|------|----------|
| **Multica Web** | Next.js / React | 前端管理后台与看板 | 默认宿主机 3000 |
| **Multica Server** | Go (Chi / WS) | 中心调度控制面、API 与 WebSocket 服务 | 默认宿主机 8080 |
| **PostgreSQL** | PostgreSQL + pgvector | 存储全部用户、任务、会话与向量数据 | 5432 |
| **Redis** | Redis 7+ | 缓存与高频消息暂存 | 6379 |
| **Agent Daemon** | Go 单二进制文件 | 宿主机本地代理，负责执行 `exec.Command` | 与 Server 保持 WS 连接 |

## 实操关键避坑点

1. **环境依赖前置**：宿主机必须预装好 `docker`、`docker compose` 以及 `git`。
2. **源码镜像构建顺序**：先构建基础 Go 后端二进制与 Docker 镜像，再构建前端 Next.js 静态/SSR 镜像，避免跨层依赖导致构建失败。
3. **数据库初始化**：首次启动需挂载初始化 SQL 脚本，自动建立表结构及所需向量扩展。
4. **Daemon 通信配置**：本机或各开发机运行的 Daemon 必须通过环境变量精确配置指向 Multica Server 的公网/内网 WebSocket 握手地址与 Token 鉴权凭据。

## Related Pages

- [[sources/multica-self-hosted-deployment]]
- [[sources/multica-usage-guide]]
- [[sources/multica-agent-project-manager]]

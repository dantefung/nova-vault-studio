---
title: "ddd-harness-microservices"
date: "2026-06-13"
source: "ddd-harness-microservices — DDD 四层架构微服务样板"
url: "https://github.com/domain-driven-design/ddd-harness-microservices"
---

# ddd-harness-microservices

DDD 四层架构微服务样板。

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Java 11 / Spring Boot 2.2.x |
| 前端 | Vite + Vue 3 + TypeScript |
| 网关 | Spring Cloud Gateway + OpenFeign |

## 四层架构

```
adapter → application → domain ← infrastructure
```

## 项目结构

- `frontend/` — Vite + Vue 3 + TypeScript
- `backends/service-bff/` — API Gateway（鉴权/路由）
- `backends/service-base/` — 基础域服务（用户/网点/日志/定时）
- `backends/service-domain-demo/` — 示例域服务 + 团队规范样板
- `backends/package-common/` — 通用 SDK

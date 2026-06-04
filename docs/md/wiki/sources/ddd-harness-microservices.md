---
title: "ddd-harness-microservices — DDD 四层架构微服务样板"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/domain-driven-design/ddd-harness-microservices"
---

# ddd-harness-microservices — DDD 四层架构微服务样板

> 全栈工程：Java 11 / Spring Boot 后端 + Vite + Vue 3 前端，DDD 四层架构（adapter → application → domain ← infrastructure）

<!-- more -->

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Java 11 / Spring Boot 2.2.x |
| 前端 | Vite + Vue 3 + TypeScript |
| 网关 | Spring Cloud Gateway + OpenFeign |

## 项目结构

```
/
├── frontend/                      # Vite + Vue 3 + TypeScript
├── backends/
│   ├── service-bff/              # API Gateway（鉴权/路由）
│   ├── service-base/             # 基础域服务（用户/网点/日志/定时）
│   ├── service-domain-demo/      # 示例域服务 + 团队规范样板
│   └── package-common/           # 通用 SDK
└── docs/
    ├── designs/                  # 系统设计现状
    ├── features/                 # 需求原始规格
    ├── plans/                   # 执行方案
    └── standards/               # 开发规范
```

## 四层架构规范

| 层级 | 职责 |
|------|------|
| **adapter** | 对外适配层（Controller/MQ listener），协议转换 + 参数校验 |
| **application** | 用例编排层（AppService），组合 domain 行为、管理事务边界 |
| **domain** | 领域模型层，承载业务不变量与状态机 |
| **infrastructure** | 基础设施层（DB/外部API/缓存/锁） |

依赖方向：`adapter → application → domain ← infrastructure`

## 运行时形态

```
Client → frontend → service-bff（鉴权/路由）→ service-base / service-domain-demo
```

## 模块说明

| 模块 | 路径 | 职责 |
|------|------|------|
| service-bff | `backends/service-bff` | API 网关，JWT 鉴权，路由转发 |
| service-base | `backends/service-base` | 基础域服务（用户、网点、操作日志、定时任务） |
| service-domain-demo | `backends/service-domain-demo` | 示例域服务，CQRUD 测试，DB reset 样板 |
| package-common | `backends/package-common` | 可复用 SDK，非独立部署 |

## 特点

- 0 Stars（新生项目），DDD 团队规范实践样板
- `docs/` 目录含 designs/features/plans/standards，可作为团队协作参考
- 根 POM 聚合 backends 下所有模块
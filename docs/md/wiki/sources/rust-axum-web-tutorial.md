---
title: "为什么高性能 Web 开发，越来越多人开始选择 Rust？— Axum 入门教程"
date: "2026-08-24"
author: "小牛呼噜噜"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/w8qDIDxTix7AtTFAPINU0A"
---

# Rust + Axum Web 开发教程 — 精读摘要

作者：小牛呼噜噜，公众号，2026-08-24 发布

## 背景

Java + SpringBoot 在小服务器上内存消耗过大（1 核 1G 跑不了几个 demo），转向 Rust + Axum。

## 核心框架

**Axum**：基于 hyper + Tokio 的 Rust Web 框架，专注于性能和人体工程学。
- 无宏 API 路由
- 声明式提取器（path/query/body/header）
- 简单可预测的错误处理（`Infallible` 类型保证）
- Tower 中间件集成（无成本获得超时/跟踪/压缩/授权）
- Tokio runtime 异步并发

## 覆盖内容

| 章节 | 要点 |
|------|------|
| Hello World | `Router::new().route("/")` + `TcpListener` + `axum::serve` |
| 路由与处理器 | `get`/`post`/`put`/`delete` 绑定，类似 Spring Controller |
| 提取器 | path/query（GET 参数）、body JSON/form（POST 参数）、header |
| 响应处理 | 实现 `IntoResponse` trait 即可 |
| 错误处理 | `Infallible` 保证错误都有响应，中间错误类型 + `?` 运算符 |
| 中间件 | Tower 集成，`tower::Service` 生态复用 |
| Tracing 日志 | 5 级（TRACE/DEBUG/INFO/WARN/ERROR），Spans + Events，结构化日志 |
| 配置读取 | `config` 库：YAML/JSON/TOML/INi，`LazyLock` 全局静态配置，dotenv 读 `.env` |

## 关键设计

- 错误不能让 HTTP 连接中断，而是保证响应正常返回携带错误信息
- 配置文件不打包进可执行文件，需独立部署到生产环境
- `LazyLock` 懒加载 + 线程安全的全局配置

---
title: "Cloudflare Workers CPU Time 限制与 AI 流式输出"
date: "2026-08-08"
source: "公众号"
---

# Cloudflare Workers CPU Time 限制与 AI 流式输出

> Cloudflare Workers 免费版限制的是 CPU 执行时间而非请求持续时间——AI 流式输出时，每个 Chunk 触发一次 Worker 执行，长文章累计 CPU 时间超限导致生成中断。

## 核心定义

**CPU Time** 是 Cloudflare Workers 免费版对 Worker 执行时间的限制，与请求持续时间（Duration）不同。AI 流式输出场景下，Worker 每收到一个数据块（Chunk）就执行一次代码并转发，文章越长、Chunk 越多，累计 CPU 时间越高，超限即被终止。

## 关键洞察

1. **免费版限制的是 CPU 时间，不是请求时长** — 长文章流式输出时，Worker 的重复执行累积 CPU 时间，最终触发 `Exceeded CPU Limit`，导致浏览器收到不完整内容。

2. **Chunk 数量是核心变量** — 文章越长 → Chunk 越多 → Worker 执行次数越多 → CPU 时间越高。短内容正常是因为 Chunk 少、没触限。

3. **架构优化比代码优化更重要** — 把 Worker 从主链路拿掉（浏览器直连 AI 服务商），仅在不直连时转发，从根上消除累计 CPU 时间的瓶颈。

## 排查与解决

**排查**：项目部署在 Cloudflare Workers 免费版且用流式输出时，先看 Worker 日志是否有 `Exceeded CPU Limit`。

**解决**：
- 浏览器直连 AI 服务商，Worker 仅作兜底转发；
- Worker 内不转发 reasoning；
- 合并多个小 Chunk 后再发送，减少执行次数。

## 相关概念

- [[AI Coding 方法论：从自然语言编程到代码搬运工]] — AI 应用开发
- Cloudflare Workers — 边缘计算平台
---
title: "AI 长文章总是生成一半，问题是 Cloudflare Workers CPU Time 限制"
date: "2026-08-08"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/6p8lCl_ugb5L06NsIUuj2g"
---

# AI 长文章总是生成一半，问题是 Cloudflare Workers CPU Time 限制

> 短内容正常，长文章生成到一半浏览器就断了——不是代码写错了，是 Cloudflare Workers 免费版的 CPU Time 限制。

## 现象

短内容一直正常，只要开始生成长文章，浏览器收到的内容就不完整。检查前端流式输出和 Worker 转发逻辑都没发现问题，最后看 Worker 日志发现一直在报：

```
Exceeded CPU Limit
```

## 根因

Cloudflare Workers **免费版限制的是 CPU 执行时间，不是请求持续时间**。

AI 流式输出时，不是一次返回整篇文章，而是不断返回很多很小的数据块（Chunk）。请求链路：

```
AI 服务 → Worker（转发）→ 浏览器
```

Worker 每收到一个 Chunk，都要执行一次自己的代码，然后再转发给浏览器。**文章越长 → Chunk 越多 → 累计 CPU 时间越高**。超过限制后 Worker 被终止，后面的内容不再转发，浏览器收到的文章不完整。

短内容正常，是因为 Chunk 数量少，没碰到 CPU Time 限制。

## 解决方案

1. **把 Worker 从主链路拿掉**：正常情况下让浏览器直接和 AI 服务商建立流式连接；浏览器不能直连时再通过 Worker 转发。
2. **优化 Worker 内部逻辑**：不转发 reasoning 内容；把多个小 Chunk 合并后再发送，减少 Worker 执行次数。

## 排查建议

如果项目部署在 Cloudflare Workers 免费版且用了流式输出，先看 Worker 日志里是否有 `Exceeded CPU Limit`，从这开始查。
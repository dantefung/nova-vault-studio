---
title: "Lightpanda"
date: "2026-05-23"
---

# Lightpanda

> 用 Zig 从零写的全新无头浏览器，100 个页面内存仅 123MB（Chrome 需 2GB），执行时间 5 秒（Chrome 需 46 秒）。

## Core Capabilities

- **轻量快速**：100 页面内存 123MB vs Chrome 2GB，执行时间 5 秒 vs Chrome 46 秒
- **CDP 协议兼容**：兼容 Puppeteer/Playwright 等主流自动化工具
- **MCP Server 内置**：可直接连接 Claude Desktop 等 AI 工具
- **功能完整**：fetch、dump html/markdown、表单操作、Cookie、网络拦截

## Performance Comparison

| 指标 | Lightpanda | Chrome |
|------|-----------|--------|
| 100 页面内存 | 123MB | 2GB |
| 执行时间 | 5 秒 | 46 秒 |

## Installation

- Docker 镜像
- Homebrew
- 预编译包

## Use Cases

- 大规模爬取
- 浏览器 Agent 自动化
- 自动化测试
- 降低爬取成本

## License

AGPL-3.0

## Sources

- https://github.com/lightpanda-io/browser
- https://lightpanda.io
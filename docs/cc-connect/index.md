---
title: "cc-connect 运维文档"
date: "2026-08-03"
source: "内部运维实践"
---

# cc-connect

本目录包含 cc-connect 接入相关的经验和文档。

## 文档列表

- [微信个人号接入指南](./weixin-setup.md) — 如何绑定微信、配置项目、常见问题

## 快速命令

```bash
# 扫码绑定微信
cc-connect weixin new --project 项目名

# 重启 cc-connect
pkill -f cc-connect && sleep 2 && PATH=$PATH:/root/.opencode/bin cc-connect start
```

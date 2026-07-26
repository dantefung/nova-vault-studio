---
title: "Cloudflare Tunnel 完全指南"
date: "2026-07-26"
source: "Web Archive"
url: ""
---

# Cloudflare Tunnel 完全指南

## 什么是 Cloudflare Tunnel？

Cloudflare Tunnel 可以把本地服务暴露到公网，无需端口转发、无需公网 IP。原理是本地跑一个轻量客户端 `cloudflared`，它主动建立出站连接到 Cloudflare 全球边缘节点。

## Cloudflare 侧需要做什么？

只需要两个前提条件：

1. 注册 Cloudflare 免费账号：https://dash.cloudflare.com
2. 把域名 DNS 托管到 Cloudflare（添加域名后按提示修改 NS）

之后在 **Zero Trust** 面板创建 Tunnel，会生成一个连接令牌（token）。

> 不需要买任何付费计划，免费套餐完全够用。

## 本地需要安装什么？

只需安装 `cloudflared` 客户端：

```bash
# Ubuntu/Debian
sudo apt install cloudflared

# macOS (Homebrew)
brew install cloudflared

# Fedora/CentOS
sudo dnf install cloudflared
```

## 临时测试（一行命令，无需登录）

```bash
cloudflared tunnel --url http://localhost:8088
```

生成一个 `*.trycloudflare.com` 临时公网链接，关掉终端就没了。

## 正式使用（绑定自己域名，永久可用）

```bash
# 1. 登录 CF 账号
cloudflared tunnel login

# 2. 创建隧道（生成 JSON 凭证文件）
cloudflared tunnel create my-tunnel

# 3. 配置 DNS 路由
cloudflared tunnel route dns my-tunnel app.example.com

# 4. 启动隧道
cloudflared tunnel run my-tunnel
```

## 整体架构

```
[你的机器] ──cloudflared──→ [Cloudflare 全球边缘节点] ──→ 公网用户访问 app.example.com
   8088                      免费 DNS + TLS 自动 HTTPS
```

所有出站连接都是 `cloudflared` 主动连出去，所以**不需要路由器端口转发**，也不需要在 CF 上开服务器。

## 关键优势

| 特性 | 说明 |
|------|------|
| 免费 | 无时长/连接数限制 |
| 自动 HTTPS | 通过 CF 证书体系自动管理 |
| 无公网 IP | 纯出站连接，穿透 NAT |
| 无需端口转发 | 适合内网/家庭宽带 |

## 参考

- 官方文档：https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup
- 客户端源码：https://github.com/cloudflare/cloudflared (Apache 2.0)

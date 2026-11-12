---
title: "在 Debian 上安装 Tailscale"
date: "2026-09-14"
source: "Tailscale"
url: "https://tailscale.com/download"
---

# 在 Debian 上安装 Tailscale

## 简介

[Tailscale](https://tailscale.com) 是一个零配置 VPN 解决方案，通过 [WireGuard](https://wireguard.com) 协议实现安全的 P2P 网络，并自带 NAT 穿透。
仓库地址：[github.com/tailscale/tailscale](https://github.com/tailscale/tailscale)

## 一键安装

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

安装完成后，服务会自动启动并启用开机自启。

## 登录与连接

```bash
sudo tailscale up
```

执行后会输出一个登录链接，用浏览器打开并完成 OAuth 认证（Google / GitHub / Microsoft 等），设备即可加入你的 Tailscale 网络。

## 查看状态

```bash
tailscale status
tailscale ip -4   # 查看本机 Tailscale IP
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `tailscale up` | 登录并连接 |
| `tailscale down` | 断开连接 |
| `tailscale status` | 查看设备状态 |
| `tailscale ip -4` | 查看本机 Tailscale IP |
| `tailscale ping <IP>` | Ping 同网络内设备 |
| `sudo systemctl restart tailscaled` | 重启服务 |

## 卸载

```bash
curl -fsSL https://tailscale.com/install.sh | sh remove
```

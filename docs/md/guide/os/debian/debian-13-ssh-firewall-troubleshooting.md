---
title: "Debian 13 (Trixie) SSH 防火墙配置与排错"
date: "2026-07-29"
source: "原创"
---

# Debian 13 (Trixie) SSH 防火墙配置与排错

## 问题分析

1. **`ufw` 找不到** → 系统默认未安装 ufw。
2. **`nft add rule inet filter input` 报错** → nftables 默认没有规则集，需先创建表。

## 解决方案（三选一）

### 方案 A：安装 ufw（最简单）

```bash
sudo apt update
sudo apt install ufw -y
sudo ufw allow 22/tcp
sudo ufw enable
sudo ufw status
```

### 方案 B：使用 nftables（原生方式）

```bash
# 查看当前规则
sudo nft list ruleset

# 创建表与链
sudo nft add table inet filter
sudo nft add chain inet filter input { type filter hook input priority 0\; policy accept\; }
sudo nft add rule inet filter input tcp dport 22 accept

# 保存规则
sudo nft list ruleset | sudo tee /etc/nftables.conf
sudo systemctl enable nftables
```

### 方案 C：不启用防火墙（内网或云安全组已控制）

如果云服务商已有安全组策略，可跳过系统防火墙。

## 验证 SSH 服务

```bash
sudo systemctl status ssh
sudo ss -tlnp | grep :22
```

看到 `LISTEN` 即服务就绪。

## 测试远程登录

```bash
ssh 用户名@服务器IP
```

## 安全提醒

- 开启防火墙前务必先放行 SSH 端口，否则会被踢出
- 建议使用 SSH 密钥登录，关闭密码登录
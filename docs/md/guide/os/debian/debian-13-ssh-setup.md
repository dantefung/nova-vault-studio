---
title: "Debian 13 (Trixie) SSH 服务配置与远程登录"
date: "2026-07-29"
source: "原创"
---

# Debian 13 (Trixie) SSH 服务配置与远程登录

## 准备工作：更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

## 1. 安装 OpenSSH 服务器

```bash
sudo apt install openssh-server -y
```

## 2. 启动并设置开机自启

```bash
sudo systemctl enable --now ssh
```

## 3. 检查服务状态

```bash
sudo systemctl status ssh
```

应能看到 `active (running)`。

## 4. 配置 SSH 服务（sshd_config）

主配置文件 `/etc/ssh/sshd_config`，也可在 `/etc/ssh/sshd_config.d/` 下创建独立 `.conf` 文件。

**允许密码认证**：

```
PasswordAuthentication yes
```

**允许 Root 登录**：

- `yes`：允许（安全性低）
- `prohibit-password`：只允许密钥（推荐）
- `no`：禁止（最安全）

```
PermitRootLogin prohibit-password
```

**修改默认端口（可选）**：

```
Port 9527
```

修改后重启服务：

```bash
sudo systemctl restart ssh
```

## 5. 配置防火墙

**nftables**：

```bash
sudo nft add rule inet filter input tcp dport 22 accept
```

**ufw**：

```bash
sudo ufw allow 22/tcp
```

## 6. 测试远程登录

```bash
ssh 用户名@服务器IP地址 -p 22
```

## 7. 查看当前用户并开启 SSH 权限

**查看当前用户**：

```bash
whoami
```

**设置密码**：

```bash
sudo passwd $(whoami)
```

**检查 AllowUsers/DenyUsers 限制**：

```bash
sudo grep -E "^(AllowUsers|DenyUsers)" /etc/ssh/sshd_config /etc/ssh/sshd_config.d/*.conf 2>/dev/null
```

如果 `AllowUsers` 不包含你的用户名，编辑 `/etc/ssh/sshd_config.d/allow.conf`：

```
AllowUsers yourusername
```

## 重要提示

Debian 13 中 SSH 服务名是 **`ssh.service`**，不是 `sshd.service`。

## 安全建议

1. 使用 SSH 密钥登录，禁用密码登录（`PasswordAuthentication no`）
2. 保持 `PermitRootLogin prohibit-password` 或 `no`
3. 安装 Fail2ban 防止暴力破解

## 常见问题

- **无法连接**：检查服务运行状态、防火墙放行、云服务商安全组
- **连接被拒绝**：检查 SSH 服务是否运行，端口是否一致
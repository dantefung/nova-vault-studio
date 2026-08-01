---
title: "Cloudflared 服务管理"
date: "2026-07-31"
source: "内部运维实践"
url: ""
---

# Cloudflared 服务管理

## Systemd 服务管理

```bash
# 启动
sudo systemctl start cloudflared

# 停止
sudo systemctl stop cloudflared

# 重启
sudo systemctl restart cloudflared

# 查看状态
sudo systemctl status cloudflared

# 开机自启
sudo systemctl enable cloudflared

# 取消开机自启
sudo systemctl disable cloudflared
```

## 手动运行（不用 systemd）

```bash
# 启动
cloudflared service install <token>
cloudflared tunnel run <tunnel-name>

# 停止
pkill cloudflared
```
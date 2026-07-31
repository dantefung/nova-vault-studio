---
title: "Clash 安装与使用指南（Debian）"
date: "2026-07-31"
source: "内部运维实践"
url: ""
---

# Clash 安装与使用指南（Debian）

> 本文记录在 Debian 服务器上手动安装 Clash、配置代理订阅源、日常管理操作的全流程。

---

## 安装方式

Clash 采用**手动安装**，非包管理器（dpkg/apt）：

- **二进制文件**：`/usr/local/bin/clash`（静态编译 ELF x86-64，约 35MB）
- **配置文件目录**：`/etc/clash/`
- **运行方式**：systemd 服务

### 安装步骤

```bash
# 1. 下载 Clash 二进制（以 amd64 为例）
wget -O /usr/local/bin/clash "https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-amd64-v1.18.0.gz"
gunzip /usr/local/bin/clash
chmod +x /usr/local/bin/clash

# 2. 创建配置目录
mkdir -p /etc/clash/providers

# 3. 创建配置文件 /etc/clash/config.yaml（见下方配置模板）

# 4. 创建 systemd 服务
```

---

## 配置文件结构

```
/etc/clash/
├── config.yaml          ← 主配置文件
├── providers/           ← 代理源（订阅拉取后存放）
│   └── my-provider.yaml
├── cache.db             ← 缓存文件
└── geoip.metadb         ← GeoIP 数据库
```

### 主配置模板

```yaml
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
external-controller: 127.0.0.1:9090

proxy-providers:
  my-provider:
    type: http
    url: "<SUBSCRIBE_URL>"
    interval: 3600
    path: ./providers/my-provider.yaml
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 300

proxy-groups:
  - name: "Proxy"
    type: select
    use:
      - my-provider

rules:
  - GEOIP,CN,DIRECT
  - MATCH,Proxy
```

> **说明**：`<SUBSCRIBE_URL>` 替换为你的订阅链接。`type: select` 为手动选择节点，可改为 `url-test` 实现自动切换。

---

## Systemd 服务

```ini
[Unit]
Description=Clash Proxy Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/clash -d /etc/clash
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# 启动服务
systemctl enable --now clash

# 查看状态
systemctl status clash

# 查看日志
journalctl -u clash -f
```

---

## 日常管理

### 查看当前选中节点

```bash
curl -s --noproxy '*' http://127.0.0.1:9090/proxies/Proxy | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('当前节点:', d.get('now'))
print('类型:', d.get('type'))
"
```

### 切换节点

```bash
curl -X PUT --noproxy '*' \
  http://127.0.0.1:9090/proxies/Proxy \
  -H 'Content-Type: application/json' \
  -d '{"name":"HK-1"}'
```

### 查看所有可用节点

```bash
curl -s --noproxy '*' http://127.0.0.1:9090/proxies/Proxy | python3 -c "
import sys, json
d = json.load(sys.stdin)
for i, node in enumerate(d.get('all', [])):
    print(f'{i+1}. {node}')
"
```

---

## 环境变量配置

设置系统代理，编辑 `/etc/environment` 或 `~/.bashrc`：

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

---

## 端口说明

| 端口 | 用途 |
|------|------|
| 7890 | HTTP/SOCKS5 混合代理端口 |
| 9090 | RESTful API 控制端口（仅本地） |

---

## 自动切换配置

如需 Clash 自动选择最优节点，将 `proxy-groups` 的 `type` 改为 `url-test`：

```yaml
proxy-groups:
  - name: "Proxy"
    type: url-test
    use:
      - my-provider
    url: https://www.gstatic.com/generate_204
    interval: 300
```
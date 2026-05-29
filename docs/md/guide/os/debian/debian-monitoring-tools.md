---
title: "Debian 系统监控工具速查"
date: "2026-05-28"
source: "原创整理"
abstract: "Debian 系统常用监控工具速查：glances（全能仪表盘）、htop（进程监控）、atop（历史回溯）、iotop/iostat（磁盘 I/O）、nethogs/iftop/nload/bmon（网络监控），附安装命令和典型使用示例。"
---

> 来源：社区整理

---

## 速查表

| 类别 | 工具 | 一句话亮点 | 安装与基础命令 |
|------|------|-----------|---------------|
| 👑 **全能冠军** | **glances** | 终端里的仪表盘，一个界面看尽所有核心指标 | `sudo apt install glances` · `glances` |
| 📈 **进程监控** | **htop** | `top` 的完美替代者，色彩丰富，支持鼠标和进程树 | `sudo apt install htop` · `htop` |
| | **atop** | 不仅能看实时，还能记录历史数据，方便事后回溯异常 | `sudo apt install atop` · `atop` |
| 💾 **磁盘 I/O** | **iotop** | 类似 `top`，但专看磁盘读写，一眼揪出"I/O杀手" | `sudo apt install iotop` · `sudo iotop` |
| | **iostat** | 专业磁盘性能分析，吞吐量、利用率、队列长度等关键指标 | `sudo apt install sysstat` · `iostat -xz 1` |
| 🌐 **网络监控** | **nethogs** | 按进程显示实时网络带宽占用，揪出偷偷上传下载的程序 | `sudo apt install nethogs` · `sudo nethogs eth0` |
| | **iftop** | 按连接（IP/端口）显示实时带宽，方便定位异常流量来源 | `sudo apt install iftop` · `sudo iftop -i eth0` |
| | **nload** | 极简 ASCII 图表展示进出流量趋势 | `sudo apt install nload` · `nload eth0` |
| | **bmon** | 功能强大的网络监控，支持图表和多种策略配置 | `sudo apt install bmon` · `bmon -p eth0 -o curses` |

---

## 如何选择

| 场景 | 推荐工具 |
|------|----------|
| 日常快速"体检"，一个界面看尽 CPU/内存/磁盘/网络/进程 | **glances** |
| 专查"磁盘卡顿"，怀疑硬盘读写瓶颈 | **iotop** 或 **iostat** |
| 专查"网络占用"，找出哪个应用在用网 | **nethogs** |
| 事后"故障复盘"，分析历史性能趋势 | 开启 **atop** 后台记录功能 |

---

## 典型使用示例

### 1. glances — 仪表盘模式

```bash
glances
```

- 按 `h` 显示帮助；`m` 按内存排序；`q` 退出
- 远程/Web 模式：`glances -w`，浏览器访问 `http://服务器IP:61208`

### 2. htop — 更友好的进程管理

```bash
htop
```

- 鼠标或方向键选择进程；`F9` 杀进程；`F2` 个性化配置

### 3. iotop — 找到"磁盘杀手"

```bash
sudo iotop
```

- 加 `-o` 参数只显示有实际磁盘读写的进程，信息更清晰

### 4. nethogs — 揪出"网络流量大户"

```bash
sudo nethogs eth0
```

- 界面清晰列出每个进程的 **SENT**（发送）和 **RECEIVED**（接收）实时速率

---

## 总结与选择建议

- **日常或新手首选 `glances` 或 `htop`**，最直观
- **专查磁盘或网络瓶颈**，`iotop`、`nethogs` 等专用工具更高效
- **专业性能分析与历史回溯**，`atop`、`sysstat` 全家桶（`iostat`、`sar` 等）以及 `perf`
---
title: "Linux 工具与配置合集"
date: "2026-07-29"
source: "原创"
---

# Linux 工具与配置合集

## 机器人 Webhook

- 飞书个人机器人：`https://open.feishu.cn/open-apis/bot/v2/hook/a99ab03d-c559-4e26-b979-6d9d3311368b`
- 企微个人机器人：`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4b2fb04c-603d-48ca-87c6-ee0a1bf96baf`

## mpv 视频播放器

- [革命性命令行视频播放器 mpv：极客必备的媒体播放终极解决方案](https://blog.csdn.net/gitblog_00244/article/details/151107328)

## Debian 通用快捷键

- [解锁 Linux 生产力：必备快捷键与命令全攻略！](https://forum.huawei.com/enterprise/cn/zh/thread/blog/48ac0465-6eae-45bc-9ae4-26b48bc9276b)

## 一键换源

```bash
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
apt update
apt upgrade -y
```

- apt/apt-cache/apt-file/apt-get：https://chatgpt.com/share/69d8f3cc-3354-832c-b176-2b7ab8bb3234
- https://chatgpt.com/share/69d8f409-07e4-832d-affb-b226bd6b2177

## Headless 模式和图形桌面模式切换

```bash
# 无桌面（headless）启动
sudo systemctl set-default multi-user.target && reboot
# 图形界面启动
sudo systemctl set-default graphical.target && reboot
```

## 升级

- [从 Debian 11（bullseye）升级](https://www.debian.org/releases/bookworm/armel/release-notes/ch-upgrading.zh-cn.html)
- [Debian GNU/Linux 常见问题（FAQ）](https://www.debian.org/doc/manuals/debian-faq/index.zh-cn.html)

## 卸载

- [debian 安装软件及卸载软件的三种方法](https://www.cnblogs.com/fuyouhao/p/17253372.html)
- [Debian 彻底卸载软件包（apt-get）](https://www.cnblogs.com/ahlxjg/p/15816606.html)
- 粗略找出非系统预装软件：https://chatgpt.com/share/69dde078-4c90-83ea-9695-380d88e3c903
- `apt-mark showmanual`：`apt` 会标记安装的软件库（缺点：不一定准确，但能过滤很多软件了）
  - 手动安装：通过 `apt install` 安装的都会标记为 `manual`
  - 依赖安装：标记为 `auto`，系统预装的软件大多数标记为 `auto`
- 查看安装历史：`sudo grep " install" /var/log/apt/history.log*`

## 多版本管理

- [如何在 Debian 中使用 update-alternatives 切换软件版本](https://www.koogua.com/article/423)
- [使用 update-alternatives 命令进行版本的切换](https://www.cnblogs.com/zcj-0928/articles/16261631.html)
- [update-alternatives 的使用方法](https://tkunlin.medium.com/update-alternatives-%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95-9f17706a8620)

## Podman

- 安装：`sudo apt-get -y install podman`
- [Podman Installation](https://podman.io/docs/installation#installing-on-linux)
- [Podman Desktop](https://desktop.podman.org.cn/docs/intro)

## KVM

- [Debian 12 / 13 安装 KVM 并部署 Windows 10 完整实战指南](https://vault.moneylab.work/md/guide/vm/Debian_KVM_Win10_Guide_v2)

## Linux 下运行 WinApps - WinBoat

- [如何查看 linux 是否打开虚拟化](https://www.cnblogs.com/liufarui/p/12133083.html)
- [WinBoat - Run Windows Apps on Linux](https://winboat.app/)
- https://chatgpt.com/share/69d471ee-9d7c-832a-a199-3cd716efa59d
- [WinBoat Guest Server 离线](https://rentry.org/winboat_guest_server_borked)

## Starship

- 安装：`curl -sS https://starship.rs/install.sh | sh`
- [Starship](https://starship.rs/zh-CN/)

## WiFi 频段查看

```bash
# 物理网卡支持 5G 频段
sudo iw list | grep -Ei "Brand|MHz"
# Band 1 = 2.4 GHz, Band 2 = 5 GHz
# 能看到 5000MHz 以上频率列表表示支持 5G

# 查看网卡名称
sudo iwconfig
# 查看网卡支持频段
sudo iwlist wlan0 channel
```

> iw\* 命令在 /usr/sbin 下，只有 root 可执行。

### WIFI 连接

```bash
# 查看网络管理服务状态
systemctl status NetworkManager
# 查看网络服务系统日志
journalctl -u NetworkManager -e
# 确认网卡信息
nmcli device status
# 连接选择更换 WiFi
sudo nmtui
# 查看 WiFi 连接信息
nmcli connection show
# 检查具体连接信息
nmcli connection show "你的WiFi名称" | grep -E 'autoconnect|permissions|timestamp'
# 修改 wifi 连接信息
nmcli connection modify "你的WiFi名称" connection.permissions ''
nmcli connection modify "你的WiFi名称" connection.autoconnect yes
# 重新连接 WiFi
nmcli connection up "你的WiFi名称"
# 确保 WiFi 硬件没被 rfkill 禁用
sudo rfkill list
sudo rfkill unblock wifi
```

## Tailscale

- [Install Tailscale on Windows](https://tailscale.com/docs/install/windows)

## 进程占用

```bash
# 查看端口占用
ss -tlnp | grep <port>
sudo ss -tlnp | grep <port>
# 进程查杀
sudo kill -9 <pid>
```

### fuser 命令

`fuser` 在 `psmisc` 包中，用于识别使用文件/端口/挂载点的进程。

```bash
# 查看占用端口的进程
fuser -v 80/tcp
# 查看访问文件的进程
fuser -v /path/to/file
# 查看挂载点占用
fuser -m /mnt/usb
# 杀掉占用进程
fuser -k 80/tcp
# 交互式杀进程
fuser -ki 80/tcp
```

输出标志：`c` 当前目录，`e` 可执行程序，`r` 根目录，`m` 内存映射文件。

常用选项：`-v` 详细信息，`-k` 杀进程，`-i` 确认，`-n` 指定命名空间，`-m` 显示挂载点进程。

## Cloudflare 隧道

```bash
# 添加 GPG key
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null

# 添加 apt 源
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# 安装
sudo apt-get update && sudo apt-get install cloudflared

# 安装为服务
sudo cloudflared service install <TOKEN>

# 隧道配置示例
cat /etc/systemd/system/cloudflared.service
```

```
[Unit]
Description=cloudflared
After=network-online.target
Wants=network-online.target

[Service]
TimeoutStartSec=15
Type=notify
ExecStart=/usr/bin/cloudflared --no-autoupdate tunnel --protocol http2 --edge-ip-version auto run --token <TOKEN>
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

```bash
# 重载配置并重启
sudo systemctl daemon-reload
sudo systemctl restart cloudflared
# 查看日志
sudo journalctl -u cloudflared -f
# 卸载服务
sudo cloudflared service uninstall
```

- [Cloudflare Tunnel 使用指南](https://gist.github.com/xiaozhouzhoua/0fe661ac5ea5d8a7c30a487a8e040f00)
- [Cloudflared 介紹使用](https://medium.com/@sam33339999/cloudflared-%E4%BB%8B%E7%B4%B9%E4%BD%BF%E7%94%A8-b76fa4dcd875)
- [2026 年用 Cloudflare Tunnel](https://recca0120.github.io/2026/04/14/cloudflare-tunnel-2026/)
- [零基础 Cloudflare 优选教程](https://linux.do/t/topic/1062697)
- [手把手教你用 Cloudflare Tunnel 穿透 HTTP / SSH / TCP](https://linux.do/t/topic/1091998)
- [Cloudflare 优选加速保姆级图文教程](https://linux.do/t/topic/2669011)
- [强制 Cloudflared tunnel 使用 http2](https://justin.education/cloudflare-tunnel-http2/)
- [为 Cloudflared Tunnel 开启 HTTP2 和 IPv6 支持](https://blog.wjqserver.com/post/cloudflared-tunnel-http2-ipv6/)
- https://mp.weixin.qq.com/s/iw76BraM_yB-czuZeFeKPA
- https://mp.weixin.qq.com/s/oRNCun1noA459SG1oWVuww
- https://linux.do/t/topic/1073310

## 进程守护

- [PM2 监控](https://pm2.node.org.cn/docs/usage/monitoring/)
- [PM2 常用命令与监控](https://xiaoxiami.gitbook.io/nodejs/pm2-chang-yong-ming-ling)
- [pm2 supervisor 进程监控优劣](https://www.v2ex.com/t/582787)
- [pm2 代替 Supervisor 管理进程](https://www.cnblogs.com/sweetsunnyflower/p/11466349.html)
- [PM2，比 Supervisor 更强大易用的进程管理工具](https://www.bookstack.cn/read/recommend/0004-pm2.md)
  - supervisor 是开发环境用
  - forever 管理多个站点，每个站访问量不大
  - pm2 网站访问量大，需要完整监控界面

## Tmux 和 nvim

- [archibate/tmux-conf](https://github.com/archibate/tmux-conf)
- [archibate/vimrc - 小彭老师自用 NeoVim 整合包](https://github.com/archibate/vimrc)

## LazyGit

- [LazyGit 中文键绑定](https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_zh-CN.md)
- [kdheepak/lazygit.nvim](https://github.com/kdheepak/lazygit.nvim)

## Claude Code & OpenCode

- [Claude Code 安装教程](https://v2ex.com/t/1202951)
- [OpenCode + oh-my-opencode 踩坑实录](https://linux.do/t/topic/1945501/15)
- [OpenCode 踩坑配置过程](https://linux.do/t/topic/1773497)

## MyCli

- https://www.mycli.net/config

## NodeJS 安装

- [NVM vs FNM vs N vs Volta](https://www.nvmnode.com/zh-hk/guide/nvm-vs.html)
- [Node.js 版本管理工具对比总结](https://www.cnblogs.com/guojikun/p/18418032)

## Python 安装

```bash
sudo apt install python3 python3-pip -y
```

国内镜像源：

```bash
mkdir -p ~/.pip
```

`~/.pip/pip.conf`：

```
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
trusted-host = mirrors.aliyun.com
```

修改全局包安装目录（`/etc/pip.conf`）：

```
[install]
target = /usr/local/lib/python3.x/site-packages
```

虚拟环境：

```bash
pip3 install virtualenv
python3 -m venv /root/gpt_env
virtualenv -p python3 /root/gpt_env
```

- https://chatgpt.com/share/69dcec34-9588-8328-a11c-fa87fee36d78
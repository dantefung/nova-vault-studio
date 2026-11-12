---
title: "WezTerm 终端配置指南（Windows）"
date: "2026-08-31"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s?__biz=MzI0NjYxNTM3NQ==&mid=2247488307&idx=1&sn=c36cebb17c7176b72c4fedc10893f829&chksm=e819d0101e6c384a22b3aa8f2b81d5a3969403aa84b0c545740d3743f4760d015d9c05933972#rd"
---

# WezTerm 终端配置指南（Windows）

> 一套颜值高、速度快、功能强的终端黄金组合，帮你一站式升级命令行使用体验。

这套方案由三款开源工具组成：

- **WezTerm** — GPU 加速的跨平台终端模拟器
- **Nushell** — 结构化、现代化的跨平台 Shell
- **Starship** — 轻量极速、可高度定制的命令行提示符

下面的内容手把手带你完成全套配置，小白也能直接抄作业。

---

## 一、安装 3 个工具

### 1. WezTerm

- 官方地址：<https://wezterm.org/install/windows.html>
- Windows 推荐下载 `setup.exe`（会自动集成在鼠标右键上下文菜单中）
- 建议安装到默认位置

### 2. Nushell

- GitHub Releases：<https://github.com/nushell/nushell/releases>
- 下载 `nu-0.109.1-x86_64-pc-windows-msvc.msi`

### 3. Starship

- GitHub Releases：<https://github.com/starship/starship/releases/tag/v1.24.2>
- 下载 `starship-x86_64-pc-windows-msvc.msi`

**附：winget 一键安装命令**

```bash
winget install wez.wezterm
winget install Nushell.Nushell
winget install Starship.Starship
```

---

## 二、核心配置

### 1. WezTerm 配置：默认启动 Nushell

新建配置文件：`C:\Users\你的用户名\.wezterm.lua`

> ⚠️ 需要安装 `CaskaydiaCove Nerd Font` 字体才能正常显示图标。

**自定义快捷键**

| 快捷键 | 功能 |
| --- | --- |
| `Ctrl + Shift + V` | 粘贴 |
| `Ctrl + T` | 新建标签 |
| `Ctrl + 数字` | 切换标签 |
| `Alt + Shift + →` | 左右分屏 |
| `Alt + Shift + ↓` | 上下分屏 |
| `Ctrl + 方向键` | 在分屏之间切换 |
| `Ctrl + W` | 关闭当前分屏 |
| `Alt + W` | 关闭整个标签 |

### 2. Nushell 配置：自动加载 Starship

配置文件路径：

```
C:\Users\Administrator\AppData\Roaming\nushell\config.nu
```

### 3. Starship 配置（可选美化）

使用 `Pastel Powerline Preset` 主题，一键创建配置文件：

```bash
starship preset pastel-powerline -o ~/.config/starship.toml
```

配置文件路径：`C:\Users\Administrator\.config\starship.toml`

---

## 三、最终效果

![WezTerm 终端效果展示](https://mmbiz.qpic.cn/sz_mmbiz_jpg/XFZAicRbZnpGDwU2c4Kb5oyeKkd571AXfuc8jqziarwQwVCo6TC1QUDNAyfzBAfIPhcpSQKdrBibksomQT17ha2LnIvqJgXks4CpSf6CP9OLdo/640?wx_fmt=other&from=appmsg)

---

## 四、常见问题

### ❓ WezTerm 里 codex、gemini 正常启动，Claude Code 启动没有响应

打开 `wezterm.lua`，找到这一行：

```lua
config.default_prog = { 'nu' }
```

直接替换为：

```lua
config.default_prog = { 'powershell.exe', '-NoLogo' }
```

> 以上，配置文件会持续更新。

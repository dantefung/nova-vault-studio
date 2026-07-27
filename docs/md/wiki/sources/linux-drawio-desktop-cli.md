---
title: "Linux 上使用 Draw.io Desktop 命令行功能"
date: "2026-07-27"
source: "用户整理"
author: ""
url: "https://github.com/jgraph/drawio-desktop/releases"
---

# Linux 上使用 Draw.io Desktop 命令行功能

在 Linux 上使用 Draw.io 的命令行功能，本质上是安装 **Draw.io Desktop 桌面应用**，它本身就集成了命令行（CLI）导出功能。

> ⚠️ 注意：`rlespinasse/drawio-cli` 这个独立的 CLI 项目已**废弃**，请勿使用。

---

## 方法一：Snap 安装（最推荐）

这是 Ubuntu 及许多现代 Linux 发行版上最简单、最通用的方法。

1. 确保你的系统已启用 Snap 支持。
2. 执行安装命令：

```bash
sudo snap install drawio
```

3. 验证：安装后在终端输入 `drawio --help` 即可查看所有可用的命令行参数。

---

## 方法二：AppImage（通用性强）

AppImage 是一种无需安装、下载即可运行的格式，几乎适用于所有 Linux 发行版。

1. 从官方 GitHub Releases 页面下载最新版的 `draw.io-x86_64-*.AppImage` 文件。
2. 赋予执行权限：

```bash
chmod a+x draw.io-x86_64-*.AppImage
```

3. 可以直接运行此文件，或将其移动到 `/usr/local/bin` 以便全局调用。

---

## 方法三：DEB 包（适用于 Debian/Ubuntu）

1. 从 Releases 页面下载 `draw.io-amd64-*.deb` 包。
2. 安装：

```bash
sudo dpkg -i draw.io-amd64-*.deb
```

---

## 方法四：Flatpak（通用性强）

1. 确保系统已安装并配置好 Flatpak。
2. 安装命令：

```bash
flatpak install flathub com.jgraph.drawio.desktop
```

---

## 方法五：Docker（适合无界面/CI/CD 环境）

如果你需要在服务器或无图形界面的持续集成环境中使用，Docker 是绝佳选择。

```bash
docker run -it -w /data -v $(pwd):/data rlespinasse/drawio-desktop-headless \
  -x -f png my-diagram.drawio
```

此方式通过虚拟 X 服务器实现无头模式（headless mode）运行。

---

## 其他方式

- **Arch Linux 用户**：可通过 AUR 安装。
- **Homebrew**：如果在 Linux 上使用 Homebrew，执行 `brew install --cask drawio`。

---

## 命令行导出示例

安装后，使用如下命令将 `.drawio` 文件导出为 PNG 图片：

```bash
drawio -x -f png my-diagram.drawio
```

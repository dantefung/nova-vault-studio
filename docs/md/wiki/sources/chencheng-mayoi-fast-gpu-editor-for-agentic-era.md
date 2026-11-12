---
title: "陈成（@chenchengpro）：我写了个极速代码编辑器 Mayoi——专为 Agent 编程时代打造（Go + MyGo GPU 原生渲染）"
date: "2026-11-03"
source: "X/Twitter"
author: "陈成 (@chenchengpro)"
url: "https://x.com/chenchengpro/status/2110699165051453771"
---

# 陈成（@chenchengpro）：我写了个极速代码编辑器 Mayoi——专为 Agent 编程时代打造（Go + MyGo GPU 原生渲染）

> 前阿里前端资深专家、Umi.js 作者云谦（陈成）开源为 AI 编程新范式定制的极速代码编辑器 Mayoi（迷い）：分析当代开发者已极少手写文件，日常核心需求是看 Diff、Review Agent、开终端与跨仓库管理；基于 Go + MyGo 在 GPU 上直接绘制原生 UI（无 Electron、无 webview），打包仅 18MB，毫秒级打开 10 万行大文件，集成 Ghostty 内核终端、Vim 模式与 Matrix 代码雨主题。

<!-- more -->

我写了个代码编辑器，叫 Mayoi。

现在大家的工作方式变了，已经很少手动改文件。

所以，每天大部分需要用到 editor 的场景是：

1. 看 diff
2. review agent 写的代码
3. 打开几个文件确认一下
3. 开个终端，起下一个 agent

VS Code 和 Cursor 是为以前那种写法造的。Cursor 装完快 1 GB，一大堆功能我从来不用。

所以我给现在的写法做了一个。

- 所有改动在一个 diff 里看，行内或左右对照，在行号旁直接 stage 或 revert
- 终端用的是 Ghostty 的内核，放底部面板或单开一个 tab 都行，⌘V 能把截图直接贴给 Claude Code
- 所有仓库开在一个窗口里，后台项目的 agent 一响铃，它的 tab 就会亮
- 快速打开、全局搜索、Markdown 预览、Vim 模式、Remote SSH

内置 Qoder、Claude 和 Matrix 等主题。Matrix 那款有代码雨。

够小：

- 应用 24 MB，Cursor 970 MB
- 内存约 180 MB，Cursor 约 1.3 GB，都是此刻我电脑上开着的数字
- 10 万行的文件，打开约 20 ms

Go 写的，基于 MyGo，GPU 直接画原生 UI，没有 Electron，没有 webview。

MIT 开源，试试 👇

[video](https://video.twimg.com/amplify_video/2110698817758875648/vid/avc1/1920x1080/mBrE6cc2DAH55E3i.mp4?tag=29)

https://github.com/sorrycc/Mayoi

---

## 附录：Mayoi（迷い）开源项目深度技术规格与安装指南

### 核心设计哲学

Mayoi（迷い）是一个小巧、极速、用 Go 编写的跨平台代码编辑器。它通过 MyGo 直接在 GPU 上绘制原生图形界面，**完全没有 Electron，也没有 Webview**，打包体积仅约 18–24 MB。

在 Agentic AI 编程时代，开发者从「逐行编写业务代码」转变为「规划、审查 Diff 与驱动多个 Agent 并行执行」。Mayoi 专门为这一新工作流量身打造：

### 核心功能一览

- **极速编辑器**：Tabs、Chroma 语法高亮、缩进指引、Sticky Scroll、面包屑与自动换行；10 万行大文件 20ms 内极速打开。
- **智能编辑**：自动缩进、括号与引号自动闭合、行级快捷命令、Tab 独立撤销树。
- **全功能 Vim 模式**：内置 Normal、Insert、Visual 模式，支持 Motions、Operators、Text Objects、Count、`.` 重复、Registers、Macros、Marks、正则搜索以及 `:s`、`:g`、`:normal` 等命令行指令。
- **列级分屏（Columns）**：支持横向分屏与 Tab 在不同列之间自由拖拽。
- **实时文件树（Explorer）**：磁盘变动即时响应，自动置灰 `.gitignore` 忽略的文件。
- **极速检索（Quick Open）**：模糊文件名匹配、行号直达（`:42`）、符号跳转（`@`）以及命令面板（`>` / `⇧⌘P`）。
- **全局查找与替换**：多线程后台搜索超大文件，支持大小写、全词与正则表达式，提供替换前后即时预览。
- **深度 Git 工作流**：
  - 类似 GitLens 的行号侧边栏标记（Gutter Marks），一键暂存（Stage）或撤回（Revert）；
  - 全工程改动集中在一个单页 Diff 内展示，支持行内（Inline）与左右（Side-by-side）分屏对照，改动词汇高亮着色；
  - 交互式提交图谱（Commit Graph），分支、Tag 与合并脉络一目了然。
- **Ghostty 终端集成**：直接内嵌 [Ghostty](https://ghostty.org/) 的极速终端仿真器内核（`libghostty-vt`），可置于底部面板、侧边栏或独立 Tab，支持 `⌘V` 一键把剪贴板图片粘贴给 Agent。
- **免安装 Remote SSH**：通过系统原生 `ssh` 直连远端主机，远端不需要安装任何服务端 Daemon，文件树、Git、终端在远端运行，端口自动转发。
- **实时预览**：代码与 Markdown、SVG、Mermaid 图表并排实时联动预览（`⇧⌘V`），支持 LaTeX 数学公式。
- **多项目管理（Project Tabs）**：所有项目仓库收拢在一个窗口左侧导航栏，后台 Agent 任务完成响铃时，对应项目 Tab 会自动点亮提示。
- **特色主题**：内置 Light / Dark、The Matrix（含全窗口代码雨与白兔动画）、Purple Gold、万圣节主题，以及 Claude、Qoder、Grok Bot 与 Cursor 专属风格主题。

### 安装与运行方式

#### macOS（Apple Silicon / Intel，macOS 13+）

通过 Homebrew 安装：

```bash
brew tap --custom-remote sorrycc/mayoi https://github.com/sorrycc/Mayoi.git
brew trust sorrycc/mayoi
brew install --cask mayoi
```

或直接在 GitHub Releases 下载签名公证后的 DMG 文件，拖入 Applications。安装后可通过 `mayoi .` 或 `mayoi <file>` 打开目录与文件。

#### Linux（Ubuntu 22.04+，GTK 3）

```bash
curl -fsSL https://github.com/sorrycc/Mayoi/releases/latest/download/install.sh | sh
```

#### Windows

前往 GitHub Releases 下载对应架构的安装包。

#### 源码构建（需要 Go 1.27+）

```bash
go run ./cmd/mayoi ~/your/project
go tool mygo build
```

---

## 相关页面

- [[sources/chencheng-code-mode-evolution-and-durable-execution]]
- [[sources/philschmid-why-agents-will-only-have-one-tool]]
- [[concepts/agentic-architectures]]
- [[concepts/agent-autonomous-pipeline]]

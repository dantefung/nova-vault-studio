---
title: Rapid Agent Team Configurator 图形化配置工具
date: "2026-09-14"
source: "VastNext"
url: "https://github.com/VastNext/rapid-agent-team-config"
---

# Rapid Agent Team Configurator 图形化配置工具

> 跨平台、轻量级、无 Node.js 依赖的 Rapid Agent Team 桌面图形化配置与安装向导。

**项目来源：** [https://github.com/VastNext/rapid-agent-team-config](https://github.com/VastNext/rapid-agent-team-config)  
**关联项目：** [opencode-rapid-agent-team](https://github.com/VastNext/opencode-rapid-agent-team)  
**当前版本：** v0.1.14
**技术栈：** Rust + wry/tao + 原生前端  

---

## 1. 它是什么？

`VastNext/rapid-agent-team-config` 是配合 [opencode-rapid-agent-team](https://github.com/VastNext/opencode-rapid-agent-team) 使用的一个**桌面 GUI 工具**。

它解决了一个问题：Rapid Agent Team 有 9 个 Agent，每个都需要配置对应的模型（如 `zhipu/glm-4`、`openai/gpt-4o`）。手动在 `opencode.json` 里逐个改字段很繁琐，也容易出错。这个工具用图形界面把这件事变得直观。

**核心特点：**
- 跨平台（Windows / Linux / macOS）
- 零 Node.js 运行时依赖（纯 Rust 编译）
- **零凭据访问**——绝不读取 API Key

---

## 2. 核心功能

### 2.1 自动探测环境

启动后自动扫描以下路径中的 OpenCode 配置：

```
~/.config/opencode/opencode.json        # 全局配置
~/.config/opencode/opencode.jsonc       # 带注释版本
~/.opencode/opencode.json               # 项目级配置
```

兼容 `opencode.json` 与 `opencode.jsonc`（支持尾随逗号、注释）。

### 2.2 9 成员全景状态面板

一次性展示所有 Agent 的当前状态：

| Agent | 角色 |
|---|---|
| `rapid-dev-team` | 队长/调度 |
| `rapid-scout` | 侦察兵 |
| `rapid-builder-glm-zhipu` | 智谱构建者 |
| `rapid-builder-glm-go` | GLM Coding 构建者 |
| `rapid-builder-deepseek-go` | DeepSeek 构建者 |
| `rapid-builder-deepseek-sensenova` | 商汤构建者 |
| `rapid-ui` | 前端主力 |
| `rapid-reviewer` | 质量评审员 |
| `rapid-architect` | 方案架构师 |

每个成员显示：**文件路径 / 来源 / 当前模型 / 角色模式**（primary 或 subagent）。

### 2.3 可视化模型搜索与分配

- 多 Provider 分组折叠，实时搜索过滤
- 一键「智能预设匹配」根据角色专长自动推荐最适模型

### 2.4 事务化安全写入

每次修改前都会：
1. 生成字段级 Diff 预览
2. 自动备份到 `.backups/rapid-team-<timestamp>/`
3. 检查 mtime 冲突防护并发写入
4. 原子写入（临时文件 + 重命名），异常立即回滚
5. 仅修改 `model:` 字段，正文/注释/换行符保持字节不变

### 2.5 缺失成员安装向导

若某个 Agent 未安装，可在工具内直接完成安装：
- 从本地 ZIP 解压（含 Zip Slip 目录穿越防护）
- 从本地源码文件夹一键同步
- 在线查询 GitHub Releases，支持代理配置与直链解析

---

## 3. 最新安装方式

### 3.1 Debian / Ubuntu（推荐）

下载并安装 `v0.1.14`：

```bash
wget https://github.com/VastNext/rapid-agent-team-config/releases/download/v0.1.14/rapid-agent-team-config_0.1.14-1_amd64.deb
sudo apt install ./rapid-agent-team-config_0.1.14-1_amd64.deb
```

如果已经安装过旧版本，直接执行同一条 `apt install` 命令即可覆盖升级，**不需要先卸载**。升级不会删除已有的 OpenCode 配置。

安装完成后检查版本：

```bash
dpkg -s rapid-agent-team-config | grep Version
```

预期输出：

```text
Version: 0.1.14-1
```

然后从应用菜单启动 **Rapid Agent Team Configurator**，或在终端运行：

```bash
RapidAgentTeamConfig
```

### 3.2 Windows

从 [`v0.1.14` Release](https://github.com/VastNext/rapid-agent-team-config/releases/tag/v0.1.14) 下载：

```text
RapidAgentTeamConfig-windows-x64.exe
```

下载后直接双击运行，无需安装 Node.js 或 Rust。

> **Windows 注意：** 当前版本未配置 Authenticode 签名证书，首次运行可能出现 SmartScreen「未知发布者」提示。请下载同目录下的 `.sha256` 文件核对校验值。

### 3.3 macOS

根据 Mac 的处理器下载对应文件：

| Mac 类型 | 下载文件 |
|---|---|
| Apple Silicon（M1/M2/M3/M4） | `RapidAgentTeamConfig-macos-arm64` |
| Intel Mac | `RapidAgentTeamConfig-macos-x64` |

首次运行前赋予执行权限：

```bash
chmod +x RapidAgentTeamConfig-macos-arm64
./RapidAgentTeamConfig-macos-arm64
```

Intel Mac 请将命令中的文件名替换为 `RapidAgentTeamConfig-macos-x64`。

### 3.4 Linux 通用二进制

不使用 Debian 包时，可以下载：

```text
RapidAgentTeamConfig-linux-x64
```

然后运行：

```bash
chmod +x RapidAgentTeamConfig-linux-x64
./RapidAgentTeamConfig-linux-x64
```

系统仍需提供 GTK 3 和 WebKitGTK 4.1 运行库。Debian/Ubuntu 用户优先使用 `.deb`，由包管理器自动处理依赖。

### 3.5 校验下载文件

`v0.1.14` Debian 包的 SHA-256：

```text
cdd69f6ba3203585b40542983dfb6aa9762f1be3c784b84a98f5de164a2813f2
```

校验命令：

```bash
sha256sum rapid-agent-team-config_0.1.14-1_amd64.deb
```

输出的哈希值必须与上面完全一致。其他平台的校验文件可从 [`v0.1.14` Release](https://github.com/VastNext/rapid-agent-team-config/releases/tag/v0.1.14) 一并下载。

### 3.6 从源码编译

**环境要求：** Rust 1.75+、`libwayland-dev`、`libxkbcommon-dev`、`libglib2.0-dev`、`libcairo2-dev`、`libgtk-3-dev`、`libwebkit2gtk-4.1-dev`

```bash
git clone --depth 1 --branch v0.1.14 \
  https://github.com/VastNext/rapid-agent-team-config.git
cd rapid-agent-team-config
cargo build --release
# 产物：target/release/RapidAgentTeamConfig
```

**常用构建命令：**

```bash
cargo fmt -- --check    # 格式化检查
cargo check             # 代码检查
cargo test              # 测试
cargo run               # 本地调试运行
cargo build --release   # 发布单文件可执行程序
```

### 3.7 从 v0.1.13 升级

Debian/Ubuntu 用户如果遇到界面长期停留在“正在扫描 OpenCode 配置环境...”，说明很可能仍在使用 `v0.1.13`。该版本在 Linux WebKitGTK 中使用了不可靠的 IPC 调用方式，请直接覆盖安装 `v0.1.14`。

`v0.1.14` 已改用 Wry 原生 IPC，并在扫描失败时显示明确错误，不再一直停留在扫描占位界面。

## 4. 安全设计（Zero Credential Guarantee）

| 项目 | 说明 |
|---|---|
| 外网请求 | 仅响应用户显式触发的 GitHub 版本查询 |
| API Key 访问 | **绝不读取**任何 `apiKey`/`token`/`secret`/`password` |
| 代理设置 | 仅作用于内部下载器，不修改系统环境变量 |
| ZIP 解压 | 每个条目做路径规范化防穿越检测 |

---

## 5. 性能基准

- 模型候选共享面板，单次渲染上限 100 条
- 连续搜索按动画帧合并
- IPC 后台任务并发上限为 4
- 合成 10,000 个模型的搜索基线约 **40–65 ms**（单机测试）

---

## 6. 与 opencode-rapid-agent-team 的关系

| 工具 | 职责 |
|---|---|
| [opencode-rapid-agent-team](https://github.com/VastNext/opencode-rapid-agent-team) | Agent 定义、调度协议、安装脚本（**核心团队**） |
| [rapid-agent-team-config](https://github.com/VastNext/rapid-agent-team-config) | 图形化配置与模型分配（**辅助工具**） |

建议先通过 `opencode-rapid-agent-team` 安装完整团队，再用本工具进行可视化模型管理。

---

## 7. 开源许可

MIT License (c) 2026 VastNext

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
**当前版本：** v0.1.12  
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

## 3. 安装方式

### 方式一：下载预编译二进制（推荐）

前往 [Releases 页面](https://github.com/VastNext/rapid-agent-team-config/releases) 下载对应平台文件。

> **Windows 注意：** 当前版本未配置 Authenticode 签名证书，首次运行可能出现 SmartScreen「未知发布者」提示。请下载同目录下的 `.sha256` 文件核对校验值。

### 方式二：从源码编译

**环境要求：** Rust 1.75+、`libwayland-dev`、`libxkbcommon-dev`、`libglib2.0-dev`、`libcairo2-dev`、`libgtk-3-dev`、`libwebkit2gtk-4.1-dev`

```bash
git clone --depth 1 https://github.com/VastNext/rapid-agent-team-config.git \
  /home/fenghaolin/workspace/prj/opensource/rapid-agent-team-config
cd /home/fenghaolin/workspace/prj/opensource/rapid-agent-team-config
cargo build --release
# 产物：target/release/RapidAgentTeamConfig（约 7.4 MB）
# 已复制到 bin/RapidAgentTeamConfig
```

**常用构建命令：**

```bash
cargo fmt -- --check    # 格式化检查
cargo check             # 代码检查
cargo test              # 测试
cargo run               # 本地调试运行
cargo build --release   # 发布单文件可执行程序
```

### 已编译二进制位置

帅哥的编译产物已保存在：

```
/home/fenghaolin/workspace/prj/opensource/rapid-agent-team-config/bin/RapidAgentTeamConfig
```

直接运行即可启动 GUI：

```bash
/home/fenghaolin/workspace/prj/opensource/rapid-agent-team-config/bin/RapidAgentTeamConfig
```

---

## 4. 运行方式

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

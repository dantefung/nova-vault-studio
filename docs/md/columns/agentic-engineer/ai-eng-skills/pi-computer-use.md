---
title: "Pi 的 Computer Use 方案"
date: "2026-09-14"
---

# Pi 的 Computer Use 方案

> Pi 也可以和 Codex 一样操作电脑了。Pi 的 Computer Use 分两条路线：自己手搓开源实现，或者直接借鉴 Codex。

## 三个方案

### 1. injaneity/pi-computer-use ⭐推荐

跨设备 macOS/Windows/Linux，优先读 Accessibility 再操作 UI，更像 Pi 原生版 Computer Use。跨平台、Pi 原生，且不依赖 Codex。

### 2. pi-codex-computer-use

直接把 Codex Computer Use 接进 Pi，Pi 负责思考，Codex 负责真正点击、输入和滚动。

### 3. codex-computer-use-mcp

把 Codex Computer Use 暴露成 MCP Tool，一次调用还能连续执行多个桌面操作。

## 路线对比

| 方案 | 跨平台 | 依赖 Codex | 推荐度 |
|------|--------|-------------|--------|
| injaneity/pi-computer-use | macOS/Windows/Linux | 否 | ⭐⭐⭐ |
| pi-codex-computer-use | — | 是 | ⭐⭐ |
| codex-computer-use-mcp | — | 是 | ⭐ |

## 核心结论

如果只推荐一个 → **[injaneity/pi-computer-use](https://github.com/injaneity/pi-computer-use)**：跨平台、Pi 原生、不依赖 Codex

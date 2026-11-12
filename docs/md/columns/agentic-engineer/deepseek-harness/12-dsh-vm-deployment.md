---
title: "DeepSeek Harness 虚拟机部署体验"
date: "2026-08-22"
source: "微信公众号：大唐小少"
url: "https://mp.weixin.qq.com/s/XZ6-ZaTNWasCz8c1ElWc0Q"
---

# DeepSeek Harness 虚拟机部署体验

> 作者：大唐小少 | CentOS 虚拟机从零部署 DSH 完整体验

---

## 部署体验要点

### 环境要求

CentOS 8 Stream / CentOS 9，Node.js ≥ 22.19.0，2C4G 以上内存，需 DeepSeek API Key。

### 四种安装方式

1. `npx @deepseek-ai/dsh web` — 最快体验
2. `npm install -g @deepseek-ai/dsh` — 推荐长期使用
3. 源码安装（pnpm） — 插件开发/二次开发
4. Python SDK — Python ≥ 3.10

### 远端访问的坑

直接访问远端 Web UI 会报 `crypto.randomUUID is not a function`，两个方案：

- **dsh-lan-access 插件**：`dsh plugin --profile web add dsh-lan-access`
- **SSH 端口转发**：`ssh -L 3080:127.0.0.1:3080 root@xx.xx.xx.xx`

### 四种预设模式

| 模式 | 说明 | 场景 |
|------|------|------|
| 标准 | 全量工具集，逐轮调用 | 通用开发 |
| PTC | TS 代码批量编排 | 低延迟省 Token |
| 极简 | 仅 Bash + 文件编辑 | 基准测试 |
| 创造 | 热加载插件 | 插件开发 |

### 实际运行

生成 24 点游戏 HTML 页面，38 万 Token，约 0.21 元。模型可切换，默认 DeepSeek 模型。

---

[← 上一](./11-codex-harness-dsh-subagent.md) | [← 回到 DeepSeek Harness 专栏](./index.md)
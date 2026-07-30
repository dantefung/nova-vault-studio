---
title: "Happy Coder：用手机远程操控 Claude Code"
date: "2026-07-29"
source: "知乎"
url: "https://zhuanlan.zhihu.com/p/2039007418152134049"
---

# Happy Coder：用手机远程操控 Claude Code

Happy Coder 是开源（MIT）的远程 AI 编程工具，支持端到端加密，让你用手机 App 随时控制电脑上的 Claude Code 或 Codex。

## 安装配置

### 前置条件

- Node.js 20+
- 已安装 Claude Code：`npm install -g @anthropic-ai/claude-code`

### 安装步骤

**电脑端安装 CLI**：

```bash
npm install -g happy-coder
```

**手机端安装 App**：App Store / Google Play 搜索 "Happy Coder"，或使用网页版 `https://app.happy.engineering/`

**环境检查**：

```bash
happy doctor
```

**第一次配对**：

```bash
happy auth login
```

终端显示二维码，手机 App 扫码绑定。配对后建议保存备份码：

```bash
happy auth show-backup
```

### 日常使用

```bash
# 启动会话（手机 App 同步出现）
happy

# 指定模型
happy -m opus

# 权限模式
happy -p plan

# 远程新建会话（需守护进程）
happy daemon start
happy daemon status
happy daemon list
happy daemon stop

# 运行 Codex 而非 Claude
happy codex

# 手机推送通知
happy notify -p "测试通过" -t "构建完成"
```

### 卸载

```bash
happy daemon stop
happy auth logout
happy doctor clean
npm uninstall -g happy-coder
rm -rf ~/.happy
```

## 客户端使用

### App 连接

手机 App 扫码完成配对后，在要操作的目录执行 `happy` 启动会话，手机端即可看到会话列表并开始对话。支持在 App 中直接新建会话（需指定目录）。

### 浏览器端

打开 `https://app.happy.engineering/` → 用手机 App 扫码（设置 → Account）→ 进入操作页面。

## 同类产品对比

| 维度 | Happy Coder | SSH+tmux | VS Code Tunnel | 云端 Agent |
|------|-------------|----------|----------------|-----------|
| 跑在本地 | 是 | 是 | 是 | 否 |
| 原生手机 App | 是 | 第三方 | 浏览器 | 是 |
| 端到端加密 | NaCl E2E | SSH | TLS | TLS |
| 不靠第三方中继 | 否 | 是 | 微软 | 各家 |
| 手机冷启动会话 | 是（需 daemon） | 需先开 tmux | 不行 | 是 |
| 工具调用弹窗 | 顺手 | 不顺手 | 一般 | 不适用 |
| 免费/开源 | 是 | 是 | 是 | 付费 |
| 真本地环境 | 是 | 是 | 是 | 否 |

## 原理：三层架构

1. **配对层**：NaCl 密钥对 + ECDH 密钥交换，端到端加密，云端只转发密文
2. **会话通道**：每个 Claude 会话对应独立 `ApiSessionClient`，通过 socket.io 连接中继服务器
3. **机器通道**：守护进程保持长连接，实现 `spawn-happy-session` / `stop-session` / `stop-daemon` 三个 RPC 接口

敲 `happy` 本质上是**用带网络同步和手机控制功能的壳子，包裹了原生 Claude Code 进程**。

## 注意事项

- 默认走第三方中继 `api.cluster-fluster.com`，重要业务建议自托管
- Windows 守护进程不自启，需手动或写计划任务
- 手机端不是 IDE，复杂 review 需回电脑
- `happy connect` 不安全（上传 API key 非 E2E 加密）
- 项目团队规模小，建议关注替代方案
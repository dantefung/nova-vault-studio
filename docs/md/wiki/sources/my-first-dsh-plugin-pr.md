---
title: "我的第一个 DSH Plugin 诞生，还推了官方 PR"
date: "2026-08-15"
source: "微信公众号：itr-del"
url: "https://mp.weixin.qq.com/s/iFZqdlPJsN_trzVTG1Qtpg"
---

# 我的第一个 DSH Plugin 诞生，还推了官方 PR

> 做 dsh 插件不难，难的是走完从本地跑通到公开仓库的全过程。—— itr-del

做 dsh 插件不难，难的是走完从本地跑通到公开仓库的全过程。

DSH（DeepSeek Harness）是 DeepSeek 推出的官方 Agent Harness，目前处于 v0.1 开发者预览版。它的架构口号是「一切皆插件」（Everything is a Plugin）——模型、工具、技能、会话、沙箱、存储、循环、UI 等所有 Agent 能力都由插件组合而成，可以按部署或会话自由替换和重组。

跟 Pi（Agent 内环）、OpenClaw / Hermes（产品宿主）、Codex（多端客户端协议）这些 Harness 不同，DSH 的组织中心是 Cordis 运行时插件图 + Session 追加式事件流——能力拓扑、作用域、生命周期全部成为可配置的运行时对象。

从此，Agent 不再只是 CLI 或网页端或桌面端……，DSH 开启了自主插拔 Plugin、开发 Agent、适配不同场景不同环境的新范式。任何宿主——飞书、Slack、VSCode、命令行——只要写一个 plugin 就能挂上去。

飞书一样也是一个可以自由定制的插件。于是我从桥接飞书的需求入手，开启了第一个 DSH Plugin 的创建。

这篇文章就是这个 plugin 的完整过程：**6 个调试坑 + 7 步开源到 awesome-dsh-plugin 列表**。读完你就能照着做出自己的第一个 DSH plugin。

## 一、背景与选型

目标很朴素：**让飞书用户 DM 一个 bot，就能跟本地 dsh agent 对话。** 但实现路径有三条，权衡之后选了方案 B。

| 方案 | 路径 | 评价 |
|------|------|------|
| A · Python SDK 桥 | 简单、跨进程 | 事件流不全，观测点在进程外，只能拿到最外层结果 |
| **B · Cordis 插件**（已选 ✓） | **完整事件流、同进程** | **要扒源码，但能直接订阅 dsh 的全部内部事件** |
| C · MCP 服务 | 标准协议 | 飞书 SDK 太重，作为 IM 桥过重 |

选 B 的核心动机：dsh 的所有能力（agent loop、scoped 事件、session 持久化）都暴露在 Cordis 框架里。走 SDK 桥意味着你只能在进程外观测，丢掉一半的事件流。

> 做 dsh 插件，本质上是写一个 Cordis plugin。了解 Cordis 是入门的第一道坎，但一旦上手，就能直接订阅 dsh 的全部内部事件。

## 二、6 个真坑

这部分是文章最干的肉。按调试时间顺序，每个坑都走同一套流程：**现象 → 最小复现 → 抓日志 / 扒源码 → 缩小假设 → 单变量验证 → 修 → 重启 → 再测**。

### 调试武器清单

| 命令 | 用途 |
|------|------|
| `tail -f /tmp/dsh-feishu.log` | 看 dsh 实时输出 |
| `ss -tlnp \| grep :PORT` | 看谁在监听端口 |
| `cat /proc/<pid>/environ \| tr '\0' '\n'` | 看进程真实环境 |
| `grep -rn "EVENT_NAME" /path/to/dsh/src/` | 扒源码验证 API 签名 |

### Pit 01：patch 写错位置，dsh 一直用错的 appId

以为 `cordis.patch.yml` 跟 plugin 在一个目录就行，其实 dsh 只读 `~/.dsh/profiles/<profile>/cordis.patch.yml`。结果 dsh 日志显示的是 PilotDeck 的 appId，完全不是我 patch 写的值。

**修复**：把 `cordis.patch.yml` 移到 `~/.dsh/profiles/web/` 目录下，重启 dsh 立刻拿到正确 appId。

### Pit 02：另一个进程抢同一个飞书 WS

Patch 写对了还是收不到消息。扒了一下发现：`lark-channel-bridge --profile claude` 也在用同一个 appId。飞书 WebSocket 一个 appId 只允许一个长连接，事件只推给先连上的进程。

**真正的战场**：光是 stop 不够，systemd 会立刻拉起新实例。必须 stop + disable 双杀。

### Pit 03：环境变量污染，dsh 进程没有真的 API key

Plugin 加载成功、消息收到、agent 创建、消息排队——但 agent 一跑就报 Authentication Fails。原因：daemon 启动时 `DEEPSEEK_API_KEY` 是占位值，我 shell 改了不生效，dsh 进程没继承到。

**解法**：写一个 `~/.dsh-feishu/env.sh`（记得 `chmod 600`），启动 dsh 之前 source 一下。

### Pit 04：agents.create() 漏传 meta.cwd，创建失败但错误被吞

Plugin 收到消息、开始创建 agent，但永远不进入 running 状态，日志干净得吓人。扒 dsh 源码 `dsh-headless/lib/index.js:70`，发现官方调用是这样的：

```javascript
const { agent } = await agents.create({
  sessionId: SessionId(`session-${uuid}`),
  meta: { cwd: process.cwd() },     // ← 必传
  agentOptions: { provider, model },
  setup: (agentCtx) => {...}        // ← 也建议传
})
```

我之前只传了 `sessionId` 和 `agentOptions`，漏了 `meta` 和 `setup`，session 创建失败被 agent-loop 内部的 try/catch 吞掉。

**教训**：不要从 API 名字猜签名——必须扒官方 headless 或 web 命令的真实调用代码。DSH 的内部 API 文档几乎为零。

### Pit 05：agent/status 是 scoped 事件，全局 ctx.on 收不到

补完 setup 之后 agent 真的跑了 3.5 秒出结果，但 web profile 里 `agent/status` 事件永远收不到。扒源码 `dsh-tool-cordis/lib/index.js:3484` 才发现它的签名是 agent-scoped：

```
'agent/status'(this: Scoped<Agent>, payload: { agent: Agent; status: AgentStatus }): void
```

必须用 `agent.ctx.on(...)` 在 agent 自己的 scope 内注册监听，全局 `ctx.on` 根本接不到。DSH 内部源码（`dsh-schedule/lib/index.js:1363`）佐证：

```javascript
const stopStatus = agent.ctx.on("agent/status", ({ status }) => {...});
```

### Pit 06：SessionId 导出不来自 dsh-llm

Plugin 加载直接报错：`@deepseek-ai/dsh-llm does not provide an export named SessionId`。一看官方 import：

```javascript
import { SessionId } from "@deepseek-ai/dsh-session";  // ← 来自 dsh-session
```

改个 import 路径，问题消失。

> 6 个坑过后，飞书 ↔ DSH Agent 终于在生产环境跑通。

## 三、跑到之后怎么办

本地跑通只是第一步。下一步是把代码和配置公开出去，让中文用户也能 `dsh plugin add` 一行安装。

### 仓库选址

| 候选 | 说明 |
|------|------|
| deepseek-ai/deepseek-harness | 内部 mono-repo，不接受外部 PR |
| **awesome-dsh-plugin**（599⭐） | **官方 README 点名收录，主推** |
| dsh-handbook（133⭐） | 走 Discussions，次推 |

最终选建个人仓库 + PR awesome-dsh-plugin 一条，避免多 PR 维护负担。

### 中国境内服务器怎么办：git push 超时 → Contents API

第一个翻车：`git push origin master` 直连 GitHub 超时。中国境内服务器，22 / 443 / 9418 都过墙。

**Fallback**：GitHub Contents API（走 `api.github.com` HTTPS 443，至少能连）。逐文件 PUT，绕过 git 协议。

### 7 步管道

① `POST /user/repos` 建仓 → ② `PUT /contents/{file}` × 7 上传文件 → ③ `PUT /topics` 加 topic → ④ fork awesome 仓 → ⑤ 修改 awesome README 加一行 → ⑥ `POST /pulls` 开 PR → ⑦（可选）`POST /issues/.../comments` 互动

**核心技巧**：修改已有文件必须传 `sha`（否则 409 冲突），从 GitHub response 里读 `commit.sha` 和 `content.sha`。

### PR #127 收到 4 项 review，全部按反馈修了

维护者说 LLM adapter 不该插件管、credentials 不该 patch 管。所以 `cordis.patch.yml` 从 v1（30+ 行）瘦到 v2（4 行）：

| # | 反馈 | 修复 |
|---|------|------|
| ① | patch 写了 credentials 和 setup | 缩到 4 行 |
| ② | 缺 dsh.bundle 声明 | package.json 加 manifest |
| ③ | `@local/dsh-feishu` 是占位 | 改名为 `dsh-feishu` |
| ④ | 缺 README.zh.md、英文描述太长 | 补中文版 + 描述从 332 → 199 字符 |

## 四、给后来者：6 条开源清单

如果你也想把 DSH 插件开源到 awesome 列表，按这 6 条来基本一遍过：

1. README 必须有 `dsh plugin add <name>` 一行安装流程
2. `package.json` 必须声明 `dsh.bundle.patch`
3. `cordis.patch.yml` 只能写 bundle patch 结构，不写 credentials
4. 包名不能含 `@local` / `@example` 占位 scope
5. 同时维护 `README.md` + `README.zh.md`
6. 单行 description（参考 awesome 现有条目平均长度，别写一大段）

## 五、写在最后

回头看，DSH 的插件生态刚刚起步，所有问题（patch 位置、scoped 事件、API 真实签名）都需要扒源码才能确定。这意味着：**第一波踩坑的人要写好调试手记，第二波人才能照着抄。**

这次开源的仓库地址：github.com/itr-del/dsh-feishu，欢迎 star / fork / 提 issue。完整 340 行调试手记在 `docs/debug-journey.md`。

下篇打算写「用 DSH 写一个本地 MCP gateway，把 Claude Code + Cursor + Trae 三个客户端的事件统一起来」——还是 Cordis 那一套，但场景换到多 Agent 协作。

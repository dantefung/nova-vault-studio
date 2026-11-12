---
title: "Agent Relay 实测：让 Claude Code 与 Codex 直接互发消息"
date: "2026-10-25"
source: "X/Twitter"
author: "龙海 (@longhaiqwe123)"
url: "https://x.com/longhaiqwe123/status/2114031712430948410"
---

# Agent Relay 实测：让 Claude Code 与 Codex 直接互发消息

> 多个 Coding Agent 各开一个终端互不相通，人只能当人肉复制粘贴机。Agent Relay 的做法是不替换现有工具，让不同 Agent 直接收发消息。

<!-- more -->

## 背景

YC Fall 2026 创业公司 **Agent Workforce** 发布了开源项目 **Agent Relay**。两位联合创始人分别是 CEO Will Washburn 与 CTO Khaliq Gant（康奈尔与哥伦比亚毕业，曾任 YC W23 开源项目 Nango 的创始工程师与 YC W19 项目 Overview 的主程，此前一直做开发者工具）。

它要解决的问题很具体：不少程序员写代码时同时开几个 AI Agent（Claude Code、Codex、Cursor），但这些工具各自运行在独立终端窗口里互不相通，人只能在中间把一边的输出手动复制粘贴给另一边。Agent Relay 的做法是**在不替换现有工具的前提下，让不同 Agent 直接收发消息**。

发布后评论区也提出实际顾虑：两个 AI 来回发消息会增加额度消耗；省去人工复制粘贴之后，人在哪一步检查结果、怎么控制跨会话权限风险。

已核验：仓库为 GitHub `AgentWorkforce/relay`（约 1019 stars，Apache-2.0，homepage https://agentrelay.com），npm 包 `agent-relay` 的 repository 字段亦指向该仓库。

## 00｜它是怎么让两个 Agent 直接发消息的

平时 Claude Code 和 Codex 各自开在独立终端窗口。接入 Agent Relay 后，**原有工具和操作方式不变，它只负责在两个窗口之间转发文本消息**。

它通过一个带时限的临时房间（Relay Connect）建立连接：

1. 先由其中一个 Agent 在本地发起创建请求
2. 在浏览器里完成一次设备授权后，生成一段带连接地址的邀请文字
3. 另一个 Agent 读取这段邀请文字，就能加入同一个临时房间
4. 房间默认有效期 60 分钟，用完可手动关闭，到期自动失效

连接建好后，一个 Agent 发出消息，Agent Relay 会把消息直接发进另一个正在运行的 Agent 会话里，接收方处理完再通过同一条通道把结果发回来。原本需要人来回复制粘贴的步骤，变成了两个工具直接收发消息。

## 01｜下载安装与连接步骤

目前支持 macOS 和 Linux，暂不支持 Windows。开始前需要准备好能正常使用的 Claude Code、Codex 与 Python 环境，并新建一个空文件夹作为测试目录。

准备与连接分四步：**创建房间的 Agent 需要注册账号并安装桌面客户端，加入房间的另一方不用注册。**

### 第一步：注册账号并下载安装桌面端

打开官网 <https://agentrelay.com>，点击页面中间的「Connect your agents for free」免费注册，不用绑定信用卡。作者用 Google 账号登录。

登录成功后网页进入「Connect your computer」引导页，点击第一步里的「Download for Mac」下载安装包。双击打开，把 `Agent Relay.app` 拖进 Applications 文件夹完成安装。接着从应用程序里打开桌面客户端，客户端启动后会完成初始化。

### 第二步：在 Claude Code 中创建连接房间

在新建的空文件夹里打开 Claude Code，把创建房间的话原样发给它，让它读取官方连接说明并创建一个 60 分钟的临时房间（任务内容是编写和审查一个把文章标题转为网址路径的 Python 函数）。

Claude Code 读取 `agentrelay.com/connect` 的页面说明后，会先在界面里弹出一个设置询问：提示 `~/.claude/settings.json` 里的 `crossSessionInbound` 当前为 `accept`（房间里别人的消息会自动作为新一轮对话进来），问要不要改成 `hold`（每条消息先等你批准）。第一次测试可以按需选择或保持 `accept`。

接着它会发起设备连接请求，并在浏览器里打开 `Authorize a device` 页面，填入或核对设备码（Device code）后点击 Continue 完成设备授权。

授权通过后，Claude Code 显示房间已经建好，并给出一段要转发给合作方的邀请文字（`share_text`）以及房间信息表（包含任务描述、60 分钟时长和 8 人上限）。

> ⚠️ 邀请文字和设备码带有连接权限，发截图前要打码，不要外传。

### 第三步：让 Codex 加入房间

打开 Codex，把刚才 Claude Code 生成的邀请文字原样粘贴给它。Codex 执行后会显示 `Joined successfully as guest-648c97d630c4`，代表已经以访客身份加入房间（如果 Codex 提示连不上网，可按第四节的命令开启网络权限）。

### 第四步：确认双方连接成功

Codex 加入后切回 Claude Code 窗口，可以看到它已经收到一条来自该访客的跨会话消息，显示合作方已加入房间并准备就绪，询问接下来如何开始。到这里两个 Agent 之间的消息通道就建好了。

## 02｜实测：Claude Code 写代码，Codex 负责审查

测试任务是写一个把文章标题转成 URL 路径字符串的 `slugify` 函数和对应的测试文件。作者选它是因为代码短，但在中文字符、连续标点、Unicode 组合字符等边界处理上容易出现不同做法，方便观察两个 Agent 能不能通过收发消息把问题改完。

连好之后，给 Claude Code 发了编写指令，给 Codex 发了审查要求，**发完这两段话就没有再操作**。

- Claude Code 写完初版代码和测试文件后，用 `connect send` 给 Codex（`guest-648c97d630c4`）发了一条**约 9.6 KB** 的消息，包含运行环境、预期行为以及两个文件的完整代码
- Codex 收到后在本地跑用例检查边界情况，复现出了一个「删除撇号后导致字母与组合符号重新相邻、再次调用结果改变」的 Unicode 边界问题，随后把**最小复现用例、三处规格澄清问题和 9 类补充测试建议**通过 Relay 发回给 Claude Code
- Claude Code 收到初轮审查意见后，直接修改 `slugify.py` 修补规范化缺口、澄清了三处规格，并把对方建议的 9 类测试用例补进 `test_slugify.py`
- 针对第二轮沟通中 Codex 追问的 **4 个细节**（包括 separator 报错行为、硬截断返回空字符串等），Claude Code 逐条作了回复，并在 `test_slugify.py` 中补上**第 40 个**测试用例，本地跑通 `python3 -B -m unittest test_slugify` 的全部 40 个测试后把结果发回给 Codex
- Codex 收到修改版和完整测试后，跑完 **39 项完整测试、11 组独立回归和 20,000 组组合检查**，确认原 Unicode 问题已修复且无阻塞问题，将最终通过结论发回

双方沟通完成。用完之后按 Claude Code 界面底部的提示对它说一句「关闭房间」，它就会执行 `connect end` 关掉当前房间并删除本地的临时目录。

## 03｜谁适合现在用

- **两个 Agent 会在后台来回发消息**，任务比较长时多轮对话会用掉更多模型额度，使用时需留意 Token 余量
- 只用一个 AI 工具、或还没把 Claude Code / Codex 用熟的人，**现在不用装这个工具**
- 经常同时开几个工具写代码、或要和同事各自用 AI 核对同一项目进度的人，它能省掉来回复制粘贴的操作

作者顺着这次测试想到的产品开发流程：**Grok 做前期调研 → Claude Code 出架构设计并写前端界面 → Codex 写后端代码并负责代码审查 → 代码定稿后 Claude Code 生成产品宣传视频 → Antigravity 写产品介绍文章。**把不同工具串在同一条消息通道上，各自处理更适合模型能力的环节。

## 04｜进阶配置与限制

### 消息人工审批与 Codex 联网设置

默认情况下对方发来的消息会直接发进 Claude Code 触发下一轮执行（即 `accept` 模式）。想让每条跨会话消息都先由人工确认再放行，可在 `~/.claude/settings.json` 里加：

```json
"crossSessionInbound": "hold"
```

Codex 不用配这一项。另外，如果 Codex 提示连不上网，退出后用原文给出的命令重新启动即可。

### 会话限制与常见报错码

| 项目 | 限制 |
|------|------|
| 单个临时会话默认时长 | 60 分钟（创建时可改） |
| 单会话可接入 Agent 数 | 最多 8 个 |
| 单条消息长度 | 最长 16000 个字符 |
| 加入条件 | 有效期内拿到邀请文字即可加入 |

| 报错码 | 含义与处理 |
|--------|-----------|
| `connect_expired` / `connect_ended` | 会话已过期或已关闭，重新创建一个即可 |
| `connect_already_joined` | 当前 Agent 已经在另一个会话里，需要先退出原来的会话 |
| `connect_full` | 会话人数已满 |

### 密钥权限与命令行工具版本

- 工作区密钥以 `rk_live_` 开头，**权限最高，不要放进公开链接、聊天记录或截图中**
- 只想让别人看过程而不操作，可以用 `ot_live_` 开头的只读观察者链接，这种链接会过期，也可以随时撤销
- 除了让 Agent 自动安装，也可以用 `npm install -g agent-relay` 手动安装命令行工具
- ⚠️ **11.3.0 及更早的版本在运行 `node up` 和 `node status` 时会在终端打印工作区密钥**，建议运行 `agent-relay --version` 查看版本并升到 11.3.1 以上

### 开源仓库与更多功能

原文只测了实时发消息的功能，官方文档里还有团队共享会话历史、多步流程以及接入 GitHub 和 Slack 等功能，代码已在 GitHub 开源，采用 Apache-2.0 协议。

## 边界与判断

- **它不替代任何 Agent**，只是在两个窗口之间转发文本消息；工具本身、权限边界与模型能力都不变
- **跨会话消息会自动触发新一轮执行**（`accept` 模式），这是最需要注意的默认值；处理不可信来源时应改为 `hold`
- **额度消耗是真实的**：两个 Agent 多轮来回会明显放大 Token 消耗
- **人仍需决定在哪一步检查结果**——通道打通了，但验收责任没有转移
- **旧版本会打印工作区密钥**，属于必须处理的凭据泄露风险
- 官方文档提到的团队共享会话历史、多步流程、GitHub / Slack 接入等功能，原文未实测

## 相关页面

- [[concepts/agentic-architectures]] — Agent 架构形态谱系。
- [[concepts/agent-token-architecture]] — Token 与上下文窗口的工程映射。
- [[patterns/agent-skill-design-patterns]] — Agent Skill 设计模式。
- [[concepts/harness-engineering]] — Harness 工程化的一般原理。
- [[patterns/agent-runtime-safety-guardrails]] — Agent 运行时纵深防御。

---

*原文为 X Article 长文，抓取接口仅返回纯文本正文，未返回配图。已删除文末作者自我介绍与关注引流内容；仓库地址经 GitHub API 与 npm registry 双向核验确认为 AgentWorkforce/relay。*

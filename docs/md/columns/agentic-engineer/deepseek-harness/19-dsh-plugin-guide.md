---
title: "DeepSeek Harness 插件实战指南：3 万插件生态的选型地图"
date: "2026-11-11"
source: "GitHub Awesome-DSH-Plugin + 站内审计"
url: "https://github.com/awesome-dsh-plugin/awesome-dsh-plugin"
description: "基于 GitHub `dsh-plugin` topic 实测 30,015 个仓库与 awesome-dsh-plugin 官方精选清单（23 大类），给出一份可直接照做的 DSH 插件选型地图：必装三件套、九大场景推荐清单、按品类完整索引、避坑红线与三步验证法。"
related:
  - ./03-plugin-architecture.md
  - ./15-dsh-plugin-ecosystem-10k.md
  - ./17-deepseek-harness-claude-code-ecology.md
---

# DeepSeek Harness 插件实战指南：3 万插件生态的选型地图

> **一句话**：DSH 本体只是个内核，真正的战斗力全在插件里。3 万个插件里，**装错的比没装更贵**——这篇给你一张能照做的选型地图。

<!-- more -->

---

## 〇、先看生态规模（2026-11-11 实测）

| 指标 | 2026-08-22（站内审计） | 2026-11-11（实测） | 变化 |
| :--- | :--- | :--- | :--- |
| GitHub `dsh-plugin` topic 仓库数 | 10,529 | **30,015** | **×2.85** |
| 官方精选清单条目 | — | **10,568** 条 / 23 大类 | — |
| 官方仓库 star | — | 278k | — |

**三个月，仓库数翻了近三倍。** 这既是好消息（生态在爆发）也是坏消息（选型成本在暴涨）。李国宝 8 月的审计结论依然成立：**48.3% 的仓库只在创建当天 push 过一次，86% 不足 5★**。

所以本文的定位不是「罗列插件」，而是**给你一个决策框架**：先确定品类 → 再看三个硬指标 → 最后才看 star。

---

## 一、必装三件套（先装这三个，防翻车）

DSH 开箱功能极少，连传文件、识图这种基础能力都要装插件。以下三个是所有推荐清单的公约数：

### 1. `dsh-context` — 把上下文从黑箱变成玻璃箱

```
仓库：https://github.com/bowenliang123/dsh-context
```

Context dashboard + `/context` 命令 + Context 浏览器，一站式上下文生命周期管理：**分类构成、内容详情、演化趋势、压缩/注入事件、统计**。

> **为什么必装**：DSH 主模型是纯文本的，上下文塞满了会静默截断。你不知道塞了什么，就无法判断它为什么答错。官方也点名推荐过。
>
> 同类可替换：`Zhenyu98/dsh-context-doctor`（上下文注入审计：指令链 / skill 目录 / 工具 schema 各自的 token 成本、重复与冲突检测）

### 2. `modlens` — 给纯文本模型装眼睛

```
仓库：https://github.com/liustack/modlens
```

Vision bridge for text-only models：粘贴图片 → 得到结构化 JSON 证据（OCR、布局、语义）。

> **为什么必装**：DSH 主力模型看不见图。查 UI 错位、读截图里的报错、看设计稿，全靠它。
>
> 同类可替换：`ysr666/dsh-vision-router`（免费视觉链 + pixel 工具：Q&A、grounding、crop、像素 diff、OCR、SVG 描摹、抠图、截屏）、`Anionex/dsh-vision-toolkit`（默认免 API Key，作者托管服务每机每天 100 张）、`drscrewdriver/dsh-media-lens`（modlens 的全媒体兄弟：视频/音频/图片统一转结构化证据）

### 3. `dsh-cost-meter` — 知道钱花在哪

```
仓库：https://github.com/Han-1413141/dsh-cost-meter
```

每会话 / 每日花费、用量百分比预算、官方余额、历史看板、一键同步官方价格（**含峰谷计价**）。

> **为什么必装**：DeepSeek 官方 API 分时计价，不着急的活放闲时跑能省一半。这个插件会提醒你现在是不是闲时。
>
> 同类可替换：`zh667/TokenLedger`（按中转站归因 token）、`439436269-ctrl/dsh-peak-runner`（价格感知的任务调度器，闲时直发、峰期排队到下一个闲时窗口）、`121212165/dsh-plugin-quota`（把用量仪表盘注入 system prompt，让模型自己知道还剩多少预算）

---

## 二、九大场景推荐清单

### 场景 A · 找插件 / 装插件 / 装桌面端

| 插件 | 说明 |
| :--- | :--- |
| **dsh-market** ([dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)) | 插件市场。分类筛选、一键更新、启用/禁用、主题切换、配置备份。装法：`dsh plugin --profile web add dshmarket` |
| **dsh-find-plugin** ([awesome-dsh-plugin/dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin)) | 不离开 Agent 找插件：按关键词/品类搜官方精选注册表，直接给出可复制的安装命令 |
| **awesome-dsh-plugin** ([awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)) | 官方策展精选（24.2k★）。**收录标准**：能 `dsh plugin add` 装上、描述与实际行为一致、分类正确、有人维护 |
| **dsh-preview-market** ([439436269-ctrl/dsh-preview-market](https://github.com/439436269-ctrl/dsh-preview-market)) | 预览版插件市场：发现 → 检视已装清单 → 装/启停/配置 |

**索引源加装（dsh 0.2.1+）**：打开 `Plugins → Discover → Index sources`，加入
```
https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json
```
这就是官方精选清单的机器可读版，**Discover 标签页和 `plugin_market` agent 工具会搜同一批条目**。

> **客户端选择**：dsh-desktop、deepseek-harness-desktop（anywhere-labs / hairyf）都已内置 dsh-market，清单里的插件都是一键可达。

---

### 场景 B · 界面 / 工作台 / 侧边栏

| 插件 | 说明 |
| :--- | :--- |
| **DSH-better-sidebar** ([omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)) | 官方侧栏底座。文件渲染与编辑、终端、Git、子 Agent 状态全在右边，**第三方插件可注册新标签页** |
| **dsh-web** ([zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)) | Web 插件合集。重点：**会话归档**（按关键词/日期/项目搜旧对话）+ **任务看板**（拖卡片式管理 + 定时执行） |
| **dsh-TUI** ([ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)) | Claude Code 风格全屏终端 UI：像素鲸鱼头、实时状态栏、流式思考展开 |
| **dsh-message-edit** ([xt765/dsh-message-edit](https://github.com/xt765/dsh-message-edit)) | 用户消息行内编辑器：铅笔按钮 → 气泡原地变成编辑卡 → 走 session branch fork 或会话内追问重发 |
| **dsh-session-diff** ([2002XiaoYu/dsh-session-diff](https://github.com/2002XiaoYu/dsh-session-diff)) | 会话级 diff 视图：打开本轮改过的文件就地渲染 git 风格增删行背景、+/- 装订线标记、新旧双行号 |
| **dph-taskboard** ([1070296335-create/dph-taskboard](https://github.com/1070296335-create/dph-taskboard)) | 侧边栏任务看板：把会话拖进 todo/doing/review/done 列 |

---

### 场景 C · 记忆与跨会话

| 插件 | 说明 |
| :--- | :--- |
| **dsh-mnemon** ([omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon)) | 跨 Agent、local-first 持久记忆。运行时记忆 + 可搜项目文档 + 语义召回 + 知识图谱 + 侧栏 UI |
| **dsh-memory-evolve** ([csyangwen/dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve)) | 纯插件实现的「跨会话长期记忆 + 后台自进化」：五轨记忆、git 分支感知、轮内自审、Skill 自演化与管理器、四轨 Todo、COI 调度、会话广播、提示词管理器。**零核心改动、零运行时依赖** |
| **dsh-noema** ([ZSeven-W/dsh-noema](https://github.com/ZSeven-W/dsh-noema)) | 持久、可检视的记忆：召回、搜索、浏览、知识图谱工具，支持从 10 款其他 AI 编程工具导入 |
| **dsh-engram** ([kenz1117/dsh-engram](https://github.com/kenz1117/dsh-engram)) | 本地 SQLite 跨会话长期记忆：双作用域（用户 + 按 git origin 的项目）、FTS5 + 本地向量混合检索用 RRF 融合、**证据门**强制显式充分性判断、溯源审计链、SM-2 间隔重复、整合蒸馏与衰减遗忘、Memory Palace 九视图侧栏 |
| **dsh-dream** ([STARDUSTLC666/dsh-dream](https://github.com/STARDUSTLC666/dsh-dream)) | 经验记忆与反思：任务后自动抽取候选教训，后续相关任务召回用户审过的教训。支持来源溯源、项目作用域检索、冲突处理、使用反馈与过期复查 |

---

### 场景 D · 能力补齐（文件 / 浏览器 / 桌面 / 办公）

| 插件 | 说明 |
| :--- | :--- |
| **dsh-at-file** ([FSMargoo/dsh-at-file](https://github.com/FSMargoo/dsh-at-file)) | Codex 风格 `@file` 提及：输入框搜工作区文件并把内容附到提示词 |
| **dsh-office** ([Fayelin12/dsh-office](https://github.com/Fayelin12/dsh-office)) | Office 工作区与会话看板：浮动 6 列精灵面板，可视化工作区/会话/token 用量/子 Agent，另有 Agent Mail 与 office 日志 |
| **dsh-computer-use** ([988hj7tczd-oss/dsh-computer-use](https://github.com/988hj7tczd-oss/dsh-computer-use)) | 跨平台 Computer Use：虚拟鼠标拟人操作（screen_observe / computer_click / type / key / scroll / drag 共 11 个工具）、AX-tree 零视觉成本模式 + 免费 GLM-4V-Flash 兜底、快照 TTL / 应用白名单 / 危险动作审批 / 密码框保护 |
| **BrowserSkill** ([Tencent/BrowserSkill](https://github.com/Tencent/BrowserSkill)) | 腾讯官方浏览器桥：控制可见的 Chrome / Edge Agent 窗口，原生浏览器工具、无障碍与 VOM 观察、截图、多会话可控、Web UI 浮层 |
| **dsh-free-search-lite** ([ayakadaisuki/dsh-free-search-lite](https://github.com/ayakadaisuki/dsh-free-search-lite)) | 免 key 中英搜索（360 / Bing RSS / DuckDuckGo）+ 静态网页正文提取，**不需要浏览器、Python 或 MCP 子进程** |
| **modsearch** ([liustack/modsearch](https://github.com/liustack/modsearch)) | 给纯文本 Agent 的 Web 搜索桥：问 Web 或 X，得到结构化 JSON 证据（search / fetch / citations） |
| **dsh-image-gen** ([GooDAnDReaDY/dsh-image-gen](https://github.com/GooDAnDReaDY/dsh-image-gen)) | generate_image 工具：FAL 队列 / 任意 OpenAI 兼容图像 API / ChatGPT·Grok 订阅，结果内联到对话 |

---

### 场景 E · 多 Agent 编排与任务协作

| 插件 | 说明 |
| :--- | :--- |
| **dsh-agent-teams** ([NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)) | AgentTeams 多 Agent 团队（ captain + members，任务带依赖、消息互通，全部由自然语言驱动，Web GUI 有树形监控） |
| **dsh-team-conductor** ([LittleAlety/dsh-team-conductor](https://github.com/LittleAlety/dsh-team-conductor)) | Agent Teams 控制面：成员是走同一套 GUI 通道创建的独立会话（各有模型），侧栏 roster + 任务看板协同；任务项带「完成定义」，成员提交后由 Lead 审 |
| **dsh-my-go** ([Tisitan/dsh-my-go](https://github.com/Tisitan/dsh-my-go)) | 多 Agent 编排预设：lead 从内置角色表分派子 Agent，读写分泳道 + 每角色绑定模型，子 Agent 报告汇到共享板 |
| **dsh-outsourcing-expert** ([Funny1Potato/dsh-outsourcing-expert](https://github.com/Funny1Potato/dsh-outsourcing-expert)) | leader 自己不干活的预设：任何非管理类工具调用都在 harness 边界被拒，任务只能派给子 Agent |
| **dsh-ai-team** ([suifei/dsh-ai-team](https://github.com/suifei/dsh-ai-team)) | 文渊阁：AI Team 工作台，拥有任务、独立验收、append-only 账本、并发项目。**注意**：装进独立 profile，它的 patch 会把该 profile 的沙箱设为 danger-full-access 且 approvals=never |
| **dsh-as-mcp-server** ([qian-dsh/dsh-as-mcp-server](https://github.com/qian-dsh/dsh-as-mcp-server)) | 把 DSH 暴露成 MCP server，让别的 Agent 实时旁观它的思考、工具调用与文件写入，还能拿「地板锁」禁止 DSH 的写/编辑/git 工具 |

---

### 场景 F · 安全、权限与回退

| 插件 | 说明 |
| :--- | :--- |
| **dsh-permission-rules** ([PerryLink/dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)) | Claude Code 风格声明式权限规则：有序 allow/deny/ask 的 YAML，按工具名、参数、工作区路径、Agent 身份匹配，挂在 `tools/pre-execute` 级联上，全程会话日志审计 + dry-run + 热重载 |
| **dsh-defend** ([PerryLink/dsh-defend](https://github.com/PerryLink/dsh-defend)) | 在 `agent/pre-step`、`tools/pre-execute`、`tools/post-execute` 三道 seam 上检测提示注入、越狱与密钥泄露，分 allow/ask/block 三档，外加破坏性删除命令守卫 |
| **dsh-auto-review** ([PerryLink/dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)) | 第二模型自动审查审批：只读 reviewer 子 Agent 返回结构化 allow/deny 裁决与理由，**默认 fail-closed** |
| **dsh-checkpoint-rewind** ([PerryLink/dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)) | Claude Code `/rewind` for DSH：每次变更型工具执行前 git 优先快照工作区、轮边界会话 fork，一条命令同时还原文件与回退会话 |
| **dsh-rewind** ([SiriLee/dsh-rewind](https://github.com/SiriLee/dsh-rewind)) | 同窗口会话回退：一键回到任意早前用户消息，不新建分支不留副本，目标消息回填到输入框，可选还原工作区文件 |
| **dsh-undo-savepoint** ([lire1131/dsh-undo-savepoint](https://github.com/lire1131/dsh-undo-savepoint)) | 每次配置改动自动快照，可 undo/redo/恢复到任意版本，**DSH 起不来时离线 CLI 也能用** |
| **dsh-security-audit** ([omdsh-dev/dsh-security-audit](https://github.com/omdsh-dev/dsh-security-audit)) | 本地安全审计：配置、插件来源、会话、网络暴露，输出只读脱敏风险报告 |
| **dshscan** ([shaoshi20/dshscan](https://github.com/shaoshi20/dshscan)) | 插件安全扫描器：静态 + 语义双通道、DSH 专用攻击面规则、npm audit、批量扫描、HTML 报告含每条发现的严重级与证据 |
| **dsh-plugin-gate** ([863683348/dsh-plugin-gate](https://github.com/863683348/dsh-plugin-gate)) | 安装安全闸：像杀软一样扫描安装脚本、权限、密钥、网络回调，在 `dsh plugin add` 前给 BLOCK/WARN/PASS 裁决 |

---

### 场景 G · 远程与移动

| 插件 | 说明 |
| :--- | :--- |
| **dsh-pocket** ([shaobeichen/dsh-pocket](https://github.com/shaobeichen/dsh-pocket)) | 手机远程访问 Web UI：扫码即可，局域网或公网（cloudflared 隧道）都行，实时同步 + 移动端适配布局 |
| **dsh-remote-control** ([mazov2love/dsh-remote-control](https://github.com/mazov2love/dsh-remote-control)) | 让 Agent 直接控制其他独立本地 DSH 实例，**目标端零插件零组件**；隔离环境适合自主配置与测试，不同模型与人格的 Agent 可互相对话、角色扮演、形成嵌套控制链 |
| **dsh-Remote** ([Blank-not-black/dsh-Remote](https://github.com/Blank-not-black/dsh-Remote)) | 移动端远程套件：原生侧栏入口 + 管理抽屉、LAN/Tailscale 自愈 bearer-token 网关、Android App（会话/审批/提问/目标）、`/fs/*` 文件传输（Range 续传，2GB 上传）、基于延迟的多服务器自动切换 |

---

### 场景 H · IM 接入与通知

| 插件 | 说明 |
| :--- | :--- |
| **dsh-im** ([xmanrui/dsh-im](https://github.com/xmanrui/dsh-im)) | 扫码或凭据接入 IM 机器人，**9 个渠道**：飞书、微信、钉钉、企业微信、QQ、Slack、Telegram、Discord、WhatsApp |
| **dsh-im-qq** ([988hj7tczd-oss/dsh-im-qq](https://github.com/988hj7tczd-oss/dsh-im-qq)) | QQ 官方机器人（q.qq.com）集成：私聊/群/频道全功能对话、WS 长连接（心跳/重连/RESUME）、按会话隔离、审批内联按钮 + `/revoke`、斜杠命令、白名单 fail-closed |
| **chicheng-push** ([534119219/chicheng-push](https://github.com/534119219/chicheng-push)) | 多渠道推送：Server酱、PushPlus、Bark、钉钉、企业微信、Telegram、飞书、ntfy、自定义 webhook 等，设置面板配置，**其他插件可通过 pushNotifier 服务调用** |

---

### 场景 I · 中文内容创作与设计

| 插件 | 说明 |
| :--- | :--- |
| **dsh-guizang-design** ([op7418/dsh-guizang-design](https://github.com/op7418/dsh-guizang-design)) | 打包 5 个 Skill：网页 PPT、社交卡片图、排版网页、中文去 AI 味（humanizer-zh）、写作语气档案。前三个共享一套设计系统（杂志风 + 瑞士风主题、对比度校验过的品牌色），侧栏页面按缩略图列出作品，可复用某作品的主题与布局开新会话 |
| **dsh-prompt-enhancer** ([cosmoliu2002/dsh-prompt-enhancer](https://github.com/cosmoliu2002/dsh-prompt-enhancer)) | 输入框旁一个 ✨ 按钮 + `/enhance` 命令：把草稿重写成结构化提示词，标出开放问题，跟随当前会话模型，提供撤销 |
| **dsh-prompt-polish** ([1321928757/dsh-prompt-polish](https://github.com/1321928757/dsh-prompt-polish)) | 输入栏提示词优化器：6 种策略 × 3 种语言 + 自定义指令，可选目标/todo/压缩摘要/工具结果/对话上下文，带确认弹窗与最近 5 条历史 |
| **dsh-bili-scroll** ([c1overzz/dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll)) | 让 Agent 自己刷 B 站：读字幕、写日报、@你。需要 dsh ≥ `0.1.7-rc.1`（版本不满足内核会**静默跳过**该插件，不报错） |
| **dsh-progress-nudge** ([buaaflyaway/dsh-progress-nudge](https://github.com/buaaflyaway/dsh-progress-nudge)) | 统计「只调工具不跟用户说话」的轮数，在下一个模型请求边界插入一条可见的用户消息提醒——长静默工具循环会先汇报干了什么再继续 |
| **dsh-second-angle** ([rootsbymenda/dsh-second-angle](https://github.com/rootsbymenda/dsh-second-angle)) | 拿本轮工具输出核对最终答案里的每条声明：能在输出中找到引文的矛盾**在同一轮内**触发一次纠正，无输出支撑的声明标记到会话日志与 stderr |

---

## 三、按品类的完整索引（23 大类）

| 品类 | 精选条目数 | 代表插件 |
| :--- | :--- | :--- |
| **Tools & Capabilities** | 1,423 | dsh-at-file、dsh-office、dsh-computer-use |
| **UI Enhancements** | 2,057 | DSH-better-sidebar、dsh-session-tabs、dsh-workspace-menu |
| **Workflow & Automation** | 620 | dsh-cron-panel、dsh-mailbox、dsh-agent-teams |
| **Sessions & Messages** | 785 | dsh-message-edit、dsh-session-rewind、dsh-chat-import |
| **Models & Providers** | 533 | dsh-subscriptions、dsh-model-pool、dsh-our-free-model |
| **Usage & Billing** | 551 | dsh-cost-meter、TokenLedger、dsh-peak-runner、dsh-heatmap |
| **Development & Runtime** | 594 | dsh-context-doctor、dsh-sandbox-tune |
| **Skills** | 372 | dsh-superpowers、dsh-skill-7d-code-reviewer、dsh-skill-manager-tags |
| **Memory** | 445 | dsh-mnemon、dsh-memory-evolve、dsh-engram、dsh-dream |
| **Notifications & Integrations** | 351 | dsh-im、dsh-im-qq、chicheng-push |
| **Remote & Mobile** | 302 | dsh-pocket、dsh-remote-control、dsh-Remote |
| **Security & Permissions** | 270 | dsh-permission-rules、dsh-defend、dshscan |
| **Themes & Appearance** | 381 | dsh-pet、dsh-status-rotator |
| **Browser & Web** | 216 | BrowserSkill、modsearch、dsh-free-search-lite |
| **Vision & Multimodal** | 192 | modlens、dsh-vision-router、dsh-media-lens |
| **Docs & Rendering** | 195 | dsh-genui、dsh-markdown-render |
| **Git & Code Review** | 185 | dsh-git-commit-panel、dsh-diff-approval、dsh-gitflow |
| **WSL & Windows Interop** | 87 | dsh-wsl-browser、dsh-sandbox-tune |
| **Plugin Markets & Managers** | 140 | dsh-market、dsh-find-plugin、dsh-preview-market |
| **Voice & Audio** | 136 | dsh-voice-input、dsh-tts |
| **Identity & Communication** | 129 | dsh-persona、dsh-assistant |
| **AGI Architecture Exploration** | 71 | dsh-preset-deep、dsh-soul、dsh-outer-brain |
| **Just for Fun** | 343 | dsh-pet、dsh-story、dsh-simulated-life |

> 完整清单：<https://github.com/awesome-dsh-plugin/awesome-dsh-plugin>

---

## 四、安装方式（三种）

```bash
# 1. 插件页：左侧「插件」→「添加插件」，粘包名 / GitHub 地址 / 本地路径

# 2. 让它自己装：新建对话，/plan 后面贴插件链接，再说一句
#    「先读说明、检查和当前版本兼不兼容，再告诉我它的作用和用法」
#    ——它会先交一份安装计划，你看过再放行

# 3. 插件市场：先装 dsh-market，设置最下面进市场，搜索、一键安装
dsh plugin --profile web add dshmarket
```

**官方自带插件分两组**：
- **内置**：子智能体、网页搜索、Agent 循环、终端
- **实验性**（需手动打开）：智能体团队、语音输入、自定义插件索引、自动授权审查、变更请求与工作树

> ⚠️ **dsh-desktop 用户注意**：命令行装进的是 `profiles/web` 而非桌面端所用 profile，需走桌面端「设置 → 插件」。

---

## 五、避坑红线（血泪版）

### 🔴 安全红线

1. **装插件 = 在你的机器上跑第三方代码**，它能读你的文件、用你的凭据、访问网络。**工具审批不沙箱插件代码**。被列入精选清单**不等于安全审查通过**。
2. **先在不含密钥的地方试**不熟悉的插件。
3. **dsh-desktop 局域网访问默认无鉴权**——同网段任何人可直接打开并操作你的电脑。只在完全可信的网络开启。
4. **`dsh-ai-team` 会把该 profile 的沙箱设为 danger-full-access 且 approvals=never**，务必装进独立 profile。
5. **不要装 npm 上的裸名 `dsh-our-free-model`**——那是第三方仿冒包（`index.js`/`client.js` 被改，还多出没有的 `src/channel-visibility.js`）。正确路径是官方 scoped 包 `@ebony-vinyl/dsh-our-free-model`。

### 🟡 兼容红线

6. **同名插件互斥**：多数 fork 会注册相同的 profile row id，两个一起装会报 `duplicate loader entry id` 或功能互相覆盖。官方清单里明确标了「do not install both」的条目，安装前留意。
7. **DSH 会按破坏性变更升级**。8 月的 rc.1 之后，100★+ 头部也只有 59.4% 跟进了；插件市场 8700 多个里 1000 多个已不适配。
8. **版本不满足时内核会静默跳过插件**，不报错——功能"凭空消失"时先查版本要求。

### 🟠 官方免责声明

> 官方安全说明原话：**「尚未接受安全审计，不得视为安全或可用于生产环境的软件。」**
> 开发者预览版，官方写明**「未来将出现破坏兼容性的变更」**。

---

## 六、选型三步法

### 第 1 步：先定品类，再看插件

按需求反查品类（见第三节索引），不要从 star 榜倒推需求。

### 第 2 步：装前必看三个硬指标

| 指标 | 怎么看 |
| :--- | :--- |
| **适配最新 rc** | README 里写的最低 DSH 版本 vs 你当前版本 |
| **持续 push** | 仓库最后提交时间；官方清单会移除停维护的条目 |
| **被实测型目录收录** | `AdamPlatin123/awesome-dsh-plugins` 是唯一做容器实测的目录，选型可信度最高 |

### 第 3 步：装完立刻验证

```bash
# 看这台机器实际启动的插件树
dsh --profile web --dump-default-config

# 关掉某个插件：编辑 ~/.dsh/profiles/web/cordis.patch.yml
# - id: ui-sidebar
#   disabled: true
```

**默认 web profile 有 133 个插件**（107 启用 / 26 禁用），禁用项几乎全是 `tool-*` 包——它们由 preset 按会话激活，而非开机加载。

---

## 七、一条龙推荐配置

| 阶段 | 装什么 | 解决什么 |
| :--- | :--- | :--- |
| **起步（必装）** | dsh-context + modlens + dsh-cost-meter | 看得见上下文、看得懂图片、花得明白钱 |
| **补基础** | dsh-at-file + dsh-paste-input + dsh-office + dsh-browser-panel + dsh-computer-use | 文件 / 粘贴 / 办公 / 浏览器 / 桌面操作 |
| **上强度** | dsh-memory-evolve 或 dsh-mnemon + dsh-agent-teams + dsh-checkpoint-rewind | 跨会话记忆、多 Agent 协作、出错能回退 |
| **上生产** | dsh-permission-rules + dsh-defend + dsh-security-audit + dshscan | 权限可控、注入可挡、配置可审、插件可扫 |
| **做内容** | dsh-guizang-design + dsh-prompt-enhancer + dsh-image-gen | 中文排版去 AI 味、提示词优化、图生图 |

---

## 八、生态判断

DSH 插件生态现在很像一座**刚刚拔地而起的集市**。摊位很多，招牌也很大，真正沿着仓库、时间戳和 README 走一遍，会发现它的内核才刚刚形成。

但有三个信号值得记：

1. **原生插件的 rc 跟进率（44%）明显高于全量（20.6%）**——真正为 DSH 而生的项目，反而维护得更好。
2. **官方 `omdsh-dev` 有 30+ 个活跃仓库，全部适配 rc.1**——官方维护纪律明显好于社区平均。
3. **PerryLink 一个人 24 个仓库全部适配 rc.1**（auto-review / permission-rules / checkpoint-rewind / mcp-panel / defend）——大概就是一个人的 JetBrains。

接下来决定生态能不能留下来的，不是下一轮又多出几千个仓库，而是**下一次破坏性变更之后，还有多少作者会回来**。

---

## 相关阅读

| 文章 | 看什么 |
| :--- | :--- |
| [深入解析 DeepSeek Harness 插件运行机制](./03-plugin-architecture.md) | Cordis 插件引擎、Loader/Fiber/Service/Context、Agent Loop 如何驱动插件 |
| [我扒了 1W 个仓库，重新看了一遍 DSH 插件生态](./15-dsh-plugin-ecosystem-10k.md) | 9,393 仓库全量枚举、rc.1 试金石、27 品类数据分布 |
| [兼容不是复制：DSH 如何把 Claude Code 生态接进自己的 seam](./17-deepseek-harness-claude-code-ecology.md) | Claude Code 生态兼容策略 |
| [增长黑客范冰：dsh-superagent 的工程常识与后厨美学](./18-dsh-superagent-engineering-common-sense.md) | 主动型 Agent 的五大工程设计 |
| [深入解析 DSH 插件架构深拆](./14-xuanyuan-dsh-architecture-deep-dive.md) | Profile/Bundle/Patch 三层组装、四种 Preset |

**站内补充**：
- [Wiki：森叔《大肥鱼 DSH 必装的 11 个插件》](/md/wiki/sources/harrisonitsme-dsh-11-essential-plugins)
- [Wiki：Leaf Yeah!《DSH 从入门到精通——4 模式 / 8 指令 / 15 插件》](/md/wiki/sources/leaf-sanren-deepseek-harness-4-modes-8-commands-15-plugins)
- [Wiki：《DSH 插件推荐清单：必装的 14 个插件》](/md/wiki/sources/dsh-plugin-recommendations)

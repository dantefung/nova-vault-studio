---
title: "我在 iPhone 上装了 DeepSeek Harness，还让它自己审讯了自己"
date: "2026-08-24"
author: "康叔AI"
source: "飞书文档"
url: "https://my.feishu.cn/docx/KDRndy4iIoLTQVxQ6XyckDuenAh"
---

# 我在 iPhone 上装了 DeepSeek Harness，还让它自己审讯了自己

一部 iPhone + 一个 iSH 终端 + DeepSeek 刚开源的 Agent 框架，折腾三天的完整记录：它是什么、怎么装、能玩什么、坑在哪。文末有可以直接抄的作业。

## 一、DeepSeek Harness 是什么：我的理解

DeepSeek 在 2026 年 8 月 13 日开源了 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)（简称 dsh），发布一天 35k+ Star。

大多数人第一反应是"DeepSeek 版 Claude Code"。**我装完玩了三天之后，觉得这个理解偏了。**

它不是一个 coding agent 产品，而是一套 **Agent 运行时底座**。核心理念只有一句话：

**Everything is a Plugin，一切皆插件。**

彻底到什么程度？不只是工具可以插拔——**模型适配器、系统提示词、上下文压缩策略、会话检查点策略、沙箱策略、子代理后端，全部是插件**。整个 Agent 用一个 YAML 数组描述，每一行就是一个插件。想换模型？改一行。想关掉遥测？改一行。想把本地沙箱换成 E2B 云沙箱？改一行。

我的判断是：

- 它对标的不是 Claude Code / Codex CLI 这类**应用层产品**
- 而是 LangGraph / AutoGen 这类**编排框架层**
- 更通俗的类比：Claude Code / Codex 是 iOS——订阅绑定、能力封闭、自定义空间极小；Harness 是安卓——给你一个大框架，你想怎么定制化就怎么调，插件生态完全开放
- 它的独特身位是：**"模型亲自下场做框架"**+ 发布即带 Python SDK 单文件运行时（55MB，目标机器连 Node.js 都不用装）
- 现在是 0.1.0-rc 开发者预览版，API 随时会破坏兼容——适合玩、适合学架构，暂时别上生产，玩的开心就行了

## 二、为什么装在 iPhone 上

一半是较真，一半是好玩：如果一个框架真的"一切皆插件"，那它应该能被削减到极端环境里还保持核心功能。iPhone 上的 iSH（App Store 可下载的 Linux 模拟器）就是这个极端环境——内存受限、无法编译原生模块、网络栈残缺。

结论先说：**装上了，而且是完整 coding agent**——能推理、能执行命令、能读写文件、还能开子代理搞多智能体协作。"一切皆插件"不是口号，是我们能装上的根本原因：装不动的重型插件全部禁用，核心链路照样跑。

## 三、它在我的 iPhone 上能做什么

配合 Minis（一个能在 iOS 上直接调 Linux shell + 编排多模型的 AI Agent App），现在这台 iPhone 可以：

**1. 单任务推理**：直接跟模型对话。

**2. 完整 coding agent**：让它自己写文件、跑命令、验证结果。

**3. 多智能体审讯流水线**（最好玩的）：输入一个 GitHub 仓库名，Agent 自己 curl GitHub API 取数写案卷，然后主 Agent 召唤三个子代理（架构师/红队/机会猎人）分头分析，最后汇总终审。

实测两个有戏剧性的结果：

子代理是真委派：每个子代理独立会话、独立上下文，观点会真实分歧，主 Agent 需要真的裁决。

### 4. 模型对照评测：Flash vs Pro 竞技场

五件套之外后来又加了第六个命令 `arena`：同一个问题，同时发给 V4 Flash 和 V4 Pro（thinking 开启），再请一个**场外模型（Kimi K3）做盲评裁判**——裁判只看到"答卷甲/乙"，不知道作者是谁，顺序还会随机打乱防位置偏差。

实测题目："分析插件化架构和单体架构的本质区别"，结果：

**Pro 36/40 vs Flash 24/40，Pro 完胜。**耗时几乎相同（40s vs 35s），Pro 仅多花 372 个思考 tokens，质量差出 50%。

Pro 的胜负手是把整个问题压缩成一条可操作判据："能不能不改宿主、不重新编译宿主，就为系统增加一个新能力？"还附赠了微服务≠插件化的辨析。Flash 的失分点则是开头的过程自白、结尾的幻觉词、赘字——盲评裁判毫不留情全抓了出来。

两条结论：① thinking 在概念分析类任务上的收益极其划算；② 流水线分工坐实——Flash 当执行者（取数、跑腿），Pro 当思考者（终审、深度分析）。

用法：`arena "你的问题"`，一条命令跑完双答卷 + 盲评 + 报告。

## 四、怎么装的：五道关卡

正常环境（Mac/Linux）一行命令就完事：`npx @deepseek-ai/dsh web`。iPhone 上是硬仗，五道关卡：

**关卡 1：依赖树太大，进程被静默杀**
dsh 有 200+ npm 依赖，iSH 的内存管理会在 npm/yarn 解析大依赖树时直接杀进程，连报错都没有。
→ 解法：把 61 个直接依赖**拆成单包逐个装**，每次只让 yarn 解析一小棵子树，跑六轮装完。

**关卡 2：node-pty 没有 Linux ARM64 预编译件**
iSH 里 g++ 编译大 C++ 文件必被信号打断，编不出来。
→ 解法：写一个 JS stub 假模块放进 `prebuilds/linux-arm64/`，headless 模式根本不需要真 PTY。

**关卡 3：最隐蔽的 bug——fetch 拿不到流式响应**
HTTP 200 正常，但 `response.body === null`。dsh 靠 SSE 流式读模型输出，直接全挂。这是 iSH 网络栈与 Node undici 的兼容问题。
→ 解法：用 Node 原生 `https` 模块重写一个 fetch polyfill，注入到 DeepSeek 适配器源码第一行。

**关卡 4：内存不够跑完整配置**
→ 解法：写一份 patch 禁用 18 个重型插件（Web UI、遥测、图像处理、workflow 等）。插件化架构在这里发光：禁用是声明式的，一行 `disabled: true`。

**关卡 5：bash 工具被沙箱策略拒绝**
dsh 默认要求 bubblewrap/Landlock 做执行隔离，iSH 没有，它宁可拒绝执行也不裸跑（好设计）。
→ 解法：`DSH_PERMISSION_MODE=danger-full-access`。iSH 本身就是 iOS 沙箱里的容器，可接受。

## 五、踩坑与规避（重要）

给想折腾的朋友划重点，五道关卡的对应规避策略已在上一节逐一说明。

## 六、抄作业：最简安装路径

前提：iPhone 装好 iSH（App Store），或任何 Alpine Linux aarch64 环境（比如 Minis app）；有 DeepSeek API Key。

**最省事的办法**：把安装要点直接复制给你自己的 AI Agent（Minis、Claude Code、Codex 等任何能执行 shell 的 Agent），让它替你装完。

要点：

1. 拆包安装：把 61 个直接依赖拆成单包逐个 `yarn add`，分六轮装完
2. pty stub：写 JS 假模块放入 `prebuilds/linux-arm64/`，headless 模式不需要真 PTY
3. fetch polyfill：用 `node:https` 重写 fetch，注入 DeepSeek 适配器源码第一行，解决 `response.body === null`
4. 精简 patch：对以下插件写 `disabled: true`——`session-telemetry-otel / session-query-sqlite / attachment-local / llm-pi-ai / web / web-search-deepseek / tool-web / skill / skill-filesystem / pwsh-sandbox / tool-pwsh / workflow-worker-thread / tool-workflow / code-runtime / tool-skill / tool-ralph / hmr`，另对 `llm-deepseek` 覆盖 `thinking: disabled`
5. 沙箱绕过：`DSH_PERMISSION_MODE=danger-full-access`

## 七、最后的判断

三天折腾下来，对 deepseek-harness 的评价浓缩成三句：

**定位**：很好玩的"乐高"，可以激发创造力和想象力，甚至是 Agent 普及的教学工具。但不适合用在生产，稳定性还是不行，七七八八的小毛病不少——真要干活，不如用 Codex 和 Claude Code。

**玩法**：除了 iPhone 部署，还用它的「创造模式」自建了官方没有的新模式。DIY 空间是它最大的乐趣所在。

**成本**：现在还是 v0.1，消耗数据不重要、我没关注。但以后一定是端到端的高缓存率——大家如果用的都是同样几个 Cordis 内核插件，dsh 就很好优化 agent 执行效能（我自己的实测截图里缓存命中已经到 93%）。

而对我来说最大的收获是：**一台 iPhone 现在就是一个完整的多智能体工作站**。地铁上掏出手机，让审讯团去解剖一个开源项目，八分钟后看报告——这种未来感，是任何云端 ChatBot 给不了的。

---

*环境：iPhone + iSH (Alpine Linux aarch64) + Node.js v22 | deepseek-harness 0.1.0-rc.6 | DeepSeek V4 Flash/Pro*

---

[← 上一：DeepSeek Harness 虚拟机部署体验](./12-dsh-vm-deployment.md) | [← 回到 DSH 专栏](./index.md)

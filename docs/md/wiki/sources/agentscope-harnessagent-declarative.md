---
title: "从源码拆解 AgentScope Java 2.0 的 HarnessAgent：声明式策略统一管理 Skill/MCP/@Tool/SubAgent"
author: "唐成"
date: "2026-08-07"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/QKERN479fbHHQ7f6lwV3Ww"
---

# 从源码拆解 AgentScope Java 2.0 的 HarnessAgent：声明式策略统一管理 Skill/MCP/@Tool/SubAgent

我们在公众号后台发一篇排版稿，通常要走过这条流水线：取素材 → 委派写作 Agent → 估算阅读时长 → 用 doocs/md 排版 → 校验并交付草稿箱。这 5 步背后，到底是谁在管理"每一步要用到的资源"？技能从哪加载、工具谁给注册、子 agent 谁去 spawn、权限谁去拦？答案，都在 HarnessAgent 里。

一言以蔽之：从"裸的大脑"到"生产级的大脑"。

AgentScope Java 2.0 的架构，是一个干净的三段式：

1. 无状态的 ReAct 推理内核，只负责"想"。
2. 组合式的工程组装层，负责"干"。
3. 按需插拔的能力包，负责"配"。

奥妙在于，HarnessAgent 用组合/委托、而不是继承，把裸的 ReActAgent 升级成生产级——核心推理逻辑一行不改，外面套上中间件、工具、权限和技能即可。这跟"面向对象里多用组合少用继承"是同一套哲学，但用在 Agent 工程上，就成了稳定的内核 + 灵活的外壳。

而这一切统一装配的入口，就在 `HarnessAgent.Builder.build()`。Skill、SubAgent、MCP 的加载，全在这里自动完成。至于模型 provider，则需按需加 extension artifact——比如 DeepSeek 没有独立 provider，靠 `OpenAIChatModel` 注册一层防腐层 SPI 到 `ModelRegistry`。声明的归声明，装配的归装配，是这个 Builder 的第一原则。

## 拆解之一：Skill —— 目录优先、内容后取

公众号 pipeline 的第一件事，是加载 `wechat-format` 这个技能。这个动作背后是 `HarnessSkillMiddleware` 在起作用。它渲染一个 `available_skills` 块，每轮只注入"路径 + 摘要"，而不是把技能全文塞给你。当 LLM 判断需要时，再通过 `load_skill_through_path` 拉取全文：

```
每轮 system prompt 里：wechat-format (@ path: skills/wechat-format, 摘要：公众号排版规则)
需要时再调：load_skill_through_path(SKILL.md) → 拿到完整渲染规则
```

这就是"目录优先、内容后取"的上下文控制策略——在幻觉泛化的时代，把无关字节挡在 prompt 之外，是控制上下文长度的关键手段。

## 拆解之二：Workspace —— 所有"文件化"的资源都在这里

技能、记忆、角色，全都不是魔法，而是目录里的文件。`WorkspaceManager` 管着一套目录：

- 角色 = `AGENTS.md`
- 记忆 = `MEMORY.md`
- 技能 = 技能目录

由 `WorkspaceContextMiddleware` 在每轮推理前，把这些内容拼进 system prompt。于是"你是谁、你记得什么、你会什么"就变成了一套可以被 Git 管理、可以被热更新的文件系统。

## 拆解之三：MCP —— 声明式自动注册

MCP 在 HarnessAgent 里的接入是声明式的：

- 经 `tools.json` + allow/deny 白名单注册
- 能力覆盖 Tools / Resources / Prompts 三类，传输走 stdio 或 HTTP
- 权限走一套六步评估管线：deny → ask → 工具自检 → allow → BYPASS → 默认
- 其中 `PermissionMode` 有 `BYPASS` 与 `DONT_ASK` 两条快车道，给"信任的工具"放行

一个外部 MCP 工具要进来，不是一句"我信任它"就完事，而是要过那条六步评估管线。**自动注册 != 自动放行**，这句被很多 Agent 框架忽略的话，恰恰是生产级的关键。

## 拆解之四：@Tool —— 反射把方法变成工具

你本地写一个 Java 方法，想让它变成 LLM 可调用的工具，只需要：

```java
@Tool
public String renderMarkdown(String markdown) { ... }
```

`@Tool` 注解 + 反射把方法转成工具，schema 转成 JSON 注入 LLM；LLM 返回结构化的 `tool_calls`，执行端按名字分发（走字典/反射）。这跟 LangChain/LangGraph 里的 ToolNode 字典分发几乎一模一样——底层共识早已收敛：注解声明、反射注册、JSON schema、名字分发。理解这一条，你就理解了所有工具抽象的本质。

## 拆解之五：SubAgent —— 声明之后自动 spawn

本质是 `AgentSpawnTool` 提供的 `agent_spawn`/`agent_send`，由 `DynamicSubagentsMiddleware` 编排。有意思的三点：

1. 防止子 agent 无限套娃。
2. LLM 读描述判断"这个活该委派给谁"。
3. spawn 超时不丢弃，而是收编为后台任务。这是工程兜底，不是演示玩具。

## 贯穿主线：所有资源都收敛成"统一资源"

把上面四种拆开看各有各的语法，但抽象到一层，你会发现一条超级主线：**声明式注册 + 统一工具抽象 + 权限/上下文中间件治理**——这就是企业级 Agent 与裸 ReAct 的分水岭。

| 资源 | 声明方式 | 注册方式 | 运行时 |
|------|---------|---------|--------|
| Skill | 目录文件 | `HarnessAgent.Builder.build()` 自动装配 | `HarnessSkillMiddleware` 按需注入 |
| MCP | `tools.json` + 白名单 | 自动注册 | 权限六步评估管线 |
| @Tool | 注解 + 反射 | 反射注册 | LLM `tool_calls` 分发调用 |
| SubAgent | 程序化 frontmatter | `AgentSpawnTool` spawn | `DynamicSubagentsMiddleware` 编排 |

背后的生命周期，由 Middleware 撑起：Filter 式设计，4 个环绕（洋葱）钩子 + 1 个管道钩子，类似 Spring 的 `@Around`；call/stream 合一，用 accumulator 避免二次拼接。规则统一、可组合、可中断。

### 源码入口

想看实现，顺着这几个文件往下扒：

- `HarnessAgent.Builder`——统一装配入口
- `HarnessSkillMiddleware`——技能按需加载
- `WorkspaceContextMiddleware`——workspace 文件化
- `DynamicSubagentsMiddleware`——子 agent 编排
- 统一 Tool 抽象——Skill / MCP / @Tool 的收敛载体

## 进阶：静态声明 vs 动态下发，AgentScope 的两层资源管理

前面讲的 Skill / MCP / @Tool / SubAgent 都是"静态声明"——builder 或 workspace 配好，`build()` 一次性装配。但生产环境常需要"运行时动态下发"，AgentScope 2.0 对此分层支持：

**Skill：动态最完整（agent 自助 + 治理）**。开 `enableSkillManageTool()` 后，agent 获得 `skill_manage` 工具，6 个 action（create/edit/patch/write_file/remove_file/delete）——运行时自助 CRUD skill 及其文件，落到可写的 `WorkspaceSkillRepository`。叠 `enableSkillCurator()` 再加治理：新建 skill 先过 `SkillSecurityScanner` 安全扫描 + `SkillAuditLog` 审计 + 晋升门，防提示注入借 skill 投毒。来源也能动态：marketplace、git 仓、`RuntimeContext` 级仓库。

实测：开 `enableSkillManageTool(true)` 后，agent 在流水线第 ③.5 步自己调 `skill_manage(action=create)` 生成了 `wechat-cta` skill，落盘 `skills/wechat-cta/SKILL.md`（带 frontmatter + 公众号结尾 CTA 写作要领），全程无人干预。

一个真实边界：`load_skill_through_path` 只认 `build()` 时预注册的 skill-id 枚举，同会话内新建的 skill 加载不到——agent 自己发现这点后，改用 `read_file` 直接读 SKILL.md 来应用。动态创建即持久化 ✓，但同会话的"目录发现"仍是静态的，新建的 skill 要下一次 build 重扫才进 catalog。这是"自助创建"和"自助发现"之间一个值得注意的缝隙。

**SubAgent：动态，默认开**。`DynamicSubagentsMiddleware`（`disableDynamicSubagents` 默认 false）让 agent 运行时派生静态声明之外的动态子 agent。

**MCP：半支持（编程式可加，无 agent 自助工具）**。`Toolkit.registerMcpClient()` 运行时编程式注册 MCP 服务可以，但没有默认的 agent 自助"加 MCP"工具（无 `McpManageTool`）。这是有意的边界：MCP 服务端常带凭证/网络访问，让 agent 随意自助加风险高，留给宿主代码控制。

### 小结：动态能力分层

| 资源 | 动态程度 | 说明 |
|------|---------|------|
| Skill | 最彻底 | 自助 + 治理 + 多来源（marketplace/git/RuntimeContext） |
| SubAgent | 默认动态 | `disableDynamicSubagents` 可关闭 |
| MCP | 最保守 | 编程式注册，无 agent 自助工具 |

这个分层本身就是一个生产级 agent 框架该有的权衡——越危险的能力，越不轻易交给模型自助。

## 一句话总结

AgentScope Java 用一套"声明式策略 + 中间件治理"把四种异构资源驯服成一种。看懂 HarnessAgent，你就看懂了企业级 Agent 的骨架——而公众号那 5 步流水线，只是这套骨架最日常的一次下班跑班而已。
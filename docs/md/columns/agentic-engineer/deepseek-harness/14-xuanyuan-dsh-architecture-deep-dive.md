---
title: "10 张图详细拆解 DeepSeek Harness 设计架构"
date: "2026-08-25"
source: "微信公众号（轩辕之风O）"
url: "https://mp.weixin.qq.com/s/bwMs2BeCo_xkD0iVCoul_w"
---

# 10 张图详细拆解 DeepSeek Harness 设计架构

> 作者：轩辕之风O。文章用 10 个核心环节拆解 DSH「一切皆插件」背后的整套运行时逻辑：从 Profile/Bundle/Patch 的三层配置组装，到 Cordis 插件框架的 provide/inject/event/effect 四能力，再到 Preset 装配出具体 Agent、Agent Loop 以 Turn/Step 模型运转、SessionEvent 持久化全程——读完能对 DSH 架构有系统级认识。

<!-- more -->

## 1. 总览

DeepSeek Harness 运行时，大体经历三段过程。

**第一阶段：程序启动时，先装配公共的 Harness Host。** 这是整个 Harness 的基础架构。模型接入、Session、工具注册中心、Agent Loop 和 Web 服务，都在这里准备。

**第二阶段：用户创建会话后，系统根据用户选择的工作模式（Preset），为这个 Session 装配一个具体 Agent。**

**第三阶段：任务进来以后，Agent Loop 才开始调用模型、执行工具，完成用户的任务。**

所以它有两次装配：一次装公共宿主 Host，一次装具体 Agent。这个区别非常关键。

## 2. 一条启动命令，怎样变成公共 Host

我们来看第一阶段，Harness 的基座——公共 Host 的启动过程。

根据 DeepSeek 官方文档，我们拉取源码后，可以通过 `pnpm dsh web` 启动服务，从而打开 WebUI 使用产品。这条命令其实省略了一个参数，完整写法是：

```bash
pnpm dsh --profile web
```

这里明确指出，`web` 实际上是一个 **Profile** 的名字。Profile 是 DSH 中一个非常关键的概念，可以理解成一套有名字的运行方案。当前版本官方内置的 Profile 模板有两个：

- **web**：启动 Web Server、API 和浏览器界面
- **headless**：不启动 WebUI，只接收一次任务，在终端输出结果后退出

不过要注意，Profile 并不是只能取这两个值。官方只是预装了这两套模板，我们依然可以创建自己的 Profile，例如增加一个 CLI 版本的启动方案。

确定使用 web Profile 后，启动器会先读取它的配置文件。配置中的 `dsh.profile.bundles` 列表明确写着本次要按顺序加载哪些 Bundle。在当前内置的 web Profile 配置中，这个列表包含两套 Bundle：

- **dsh-base**：提供 Session、模型注册、工具系统、Agent Loop、持久化等公共底座
- **dsh-web-app**：在底座上增加 API、Web Server、UI 和 Preset 管理

Bundle 的价值在于：如果每个 Profile 都自己写一遍完整插件清单，Web 和 Headless 中那些相同的 Session、模型、工具配置就要到处复制。Bundle 就是把经常一起出现的插件和默认配置打包成一套可复用组合。在 Bundle 提供的默认配置上，用户还可以叠加 **Patch** 来修改默认配置，比如修改端口、Provider、工具开关或者自己新增的插件。

最终的关系就是：

```
Profile → Bundle → Patch
（选择启动形态）（加载哪些插件组）（覆盖/补充配置）
```

到这一步，系统只是得到了一棵插件配置树。接下来才是最关键的问题：这些彼此独立的插件，怎样真正连接起来？

## 3. 一堆独立插件，怎样攒成完整系统

答案就在 **Cordis** 里面。

DeepSeek Harness 底层使用的是 Cordis 插件框架。Cordis 会把最终配置树里的插件依次挂载起来，并提供一个大家都能访问的公共运行环境，也就是 **Cordis Context**。

插件启动以后，可以通过 `provide` 把自己的服务登记到 Context。比如 Session 插件提供 `ctx.sessions`，LLM 注册插件提供 `ctx.llm`，Tools 插件提供 `ctx.tools`。

而需要使用这些服务的插件，则通过 `inject` 声明依赖。比如 AgentLoop 声明了需要 `agents`、`sessions`、`llm`、`tools` 和 `systemPrompt` 五项服务。如果其中任何一项还没有出现，AgentLoop 就不会抢跑。等这些依赖全部满足以后，它才会被正式激活。

所以 DSH 并没有一张写死的"插件槽位清单"。它判断系统能否启动，依靠的是**服务依赖图**：当前加载的插件，需要的服务是不是都有人提供。这和 Java Spring 中的依赖注入有点像。

使用方只认稳定的服务职责，不关心具体实现来自哪个包。以后替换模型 Provider，Agent Loop 依然通过同一个 `ctx.llm` 调用模型。这就是 DSH 能自由替换插件，却又不会变成一堆散装零件的原因。

## 4. 插件不只提供服务，还能从侧面参与流程

如果插件之间只有服务调用，这套架构还不够灵活。Cordis 还提供了**事件机制**。

服务解决的是"我可以调用谁"，事件解决的是"流程走到这里，谁想参与一下"。比如一个工具准备执行时，审批插件可以弹出确认，权限插件可以检查路径，遥测插件可以记录耗时。这些插件不用修改 Agent Loop，也不需要彼此引用。它们只要监听合适的事件，就能从侧面加入流程。

Cordis 还会管理插件生命周期。插件卸载以后，它注册的服务、工具和事件监听会一起被清理。

现在再回头看，「一切皆插件」背后其实有三层保障：

1. **Profile、Bundle 和 Patch** 决定这次加载哪些插件
2. **provide 和 inject** 把插件连成完整依赖图
3. **event 和 effect** 让插件安全参与流程，并在卸载时自动清理

## 5. Agent Loop 核心服务

公共 Host 启动完成以后，里面会出现一组稳定的服务。

图里最中间的是 Agent Loop，但它并不是一个包办一切的超级模块。它更像总调度员，真正的能力分散在周围几个服务里：

| 服务 | 职责 |
|------|------|
| `ctx.agents` | 管理当前活跃的 Agent，接收 UI 和 API 投递的任务 |
| `ctx.sessions` | 管理 Session 与 SessionEvent |
| `ctx.llm` | 注册模型 Provider，并把请求发给具体模型 |
| `ctx.tools` | 汇总工具，处理校验、审批、执行和结果 |
| `ctx.systemPrompt` | 组装系统提示词、工具说明和运行时信息 |
| `ctx.agentLoop` | 提供默认循环，把前面五项服务串起来 |

这里还要区分两种"一个服务后面挂多个插件"：

- **`ctx.llm`** 后面可以注册 DeepSeek、GPT 等多个候选 Provider，具体 Agent 再选择使用哪一个（**多个候选实现，运行时选一个**）
- **`ctx.tools`** 后面则会同时注册文件、终端、网页、LSP 等多个工具，它们共同组成 Agent 的工具列表（**多个能力贡献，可以同时生效**）

## 6. Preset 决定 Agent 使用哪种工作模式

到这里，公共 Host 已经可以运行了。但某个 Agent 应该用哪些工具、提示词和 Skills，还没有确定。这就是 **Preset** 要解决的问题。

Preset 的字面意思就是"预设"。在 DSH 里，它表示一种预先组装好的 Agent 工作模式。当前系统内置了四种 Preset：

| 模式 | 能力说明 |
|------|----------|
| **标准模式** | 提供完整的文件、Shell、搜索、Skills、计划、目标、子 Agent 和工作流 |
| **PTC 模式** | 拥有标准模式的能力，并让模型通过 TypeScript 程序组合多步工具操作 |
| **极简模式** | 只保留持久 Bash 和文件编辑器 |
| **创造模式** | 在标准能力上增加运行时检查、插件实验和 Preset 创作指导 |

界面里显示的名称和说明，来自各个 Preset 目录下的 `preset.yml`。而决定要加载哪些工具、提示词和 Skills 的，则记录在 `agent.cordis.yml` 文件中。一个负责展示，一个负责真正装配。

## 7. Preset 怎样装配出具体 Agent

当用户新建 Session，并在界面选择标准模式以后，DSH 会进入第二次装配。系统先确定这个 Session 使用哪个 Preset，再读取这个模式对应的 `agent.cordis.yml` 文件。

Preset 中的 Persona、Tools、Skills、Plan 等插件，会被挂载到这个 Agent 可以访问的作用域中。

因此，同一套 Web Host 里可以同时运行多个不同类型的 Agent。一个代码 Agent 可以看到文件、终端和 LSP；一个内容创作 Agent 可以看到网页搜索、图片生成和文章检查。它们共用 Host 中的 Session、模型注册和 Agent Loop，又拥有完全不同的工具与提示词组合。

这也解释了 Profile 与 Preset 的区别：

> **Profile** 决定整套 Harness 以什么形态启动。
> **Preset** 决定某一类 Agent 具有什么能力。

换 Preset 通常不需要重启 Host。

## 8. Agent 如何运转

Host 准备好了，Agent 也到位了。现在用户从 WebUI 提交一个任务，会发生什么？

UI、CLI 和 API 都只负责接收任务与展示结果。它们不会绕过 Agent Loop，直接去调用模型。否则工具执行、SessionEvent、权限检查和恢复流程都会被绕开。

任务会先交给 `ctx.agents`，找到对应的活跃 Agent，再进入 Agent Loop。

Agent Loop 读取会话，组装提示词和工具说明，然后通过 `ctx.llm` 调用模型。

- 如果模型返回普通文字，结果会被记录并展示给用户
- 如果模型发出 Tool Call，Agent Loop 就把请求交给 `ctx.tools`。工具完成以后，结果先写进 SessionEvent，再进入下一轮模型请求

所以 UI、模型和工具之间并不是互相乱连。所有路径最终都会回到 Agent Loop 和 SessionEvent 这条主线上。

## 9. Agent Loop 怎样持续完成任务

新消息会开启一个 **Turn**，也就是一轮完整任务。

一个 Turn 内部可以包含多个 **Step**。每个 Step 对应一次模型判断，以及这次判断触发的工具操作。

- 模型如果第一次就能直接回答，这个 Turn 只有一个 Step
- 模型如果发出 Tool Call，工具系统就执行操作，把结果记录下来，然后进入下一个 Step

例如"运行测试并修复问题"这个任务，可能需要运行测试、读取报错文件、修改代码、重新测试，最后才返回结果。

Agent 能持续工作的关键就在于此：模型每次只决定当前这一步，Agent Loop 负责把一连串 Step 组织成完整 Turn。

当收件箱没有新任务，工具也不要求继续调用模型时，Turn 就会结束，Agent 重新回到空闲状态。**Agent Loop 并不是无限循环，它有明确的开始、继续和停止条件。**

## 10. SessionEvent 记录 Agent 经历的一切

Agent 运行起来以后，还剩下最后一个问题：运行过程中的数据怎样被保存下来？

普通聊天应用可能只保存用户问题和最终回答，但 Agent 显然不够。它还要知道模型调用了什么工具，参数是什么，执行成功还是失败，结果参与了哪一次模型请求。

DSH 会把这些事实写成一条持续追加的 SessionEvent 日志。常见事件包括：

- `turn/start`
- `step/start`
- `user/message`
- `assistant/message`
- `tool/call`
- `tool/result`

同一条日志，可以给多个使用方：

- 模型可以从中重建下一次请求的上下文
- WebUI 可以从中恢复聊天和工具卡片
- 持久化插件把它写入文件或数据库

这样一来，模型看到的历史、用户看到的界面和磁盘里保存的记录，都来自同一份事实。页面刷新或者进程重启以后，系统才能准确恢复之前发生的事情。

## 如何定制自己的 Agent

到这里，DeepSeek Harness 的整套架构就串起来了。如果我们想做一个自己的业务 Agent，大部分情况下不需要修改 Agent Loop，也不需要重新开发整套 Host。

比如想做一个自媒体创作 Agent：

1. 把选题搜索、资料读取、图片生成和文章检查做成**专属工具**
2. 把写作 Persona、内容规范和安全规则拆成**系统提示词**
3. 把完整创作流程放进 **Skill**
4. 最后创建一个新的 **Preset**，把这些工具、提示词和 Skills 组合起来

用户新建 Session 并选择这个 Preset，一个自媒体创作 Agent 就装配出来了。

这就是 DSH 插件化架构真正好用的地方——不需要复制框架，只需要判断一项能力应该放在哪一层，再把对应插件接进去。

## 写在最后

很多人喷 DeepSeek Harness 是过度设计、技术人自嗨。确实，如果站在用户的角度，这套设计确实过于复杂。完全可以换成一套更简洁的设计。

但如果换个角度，这套架构会有一个巨大的好处：**Agent 可以在运行时动态修改自己**。这有点像动态编程语言中的反射机制。

普通的开发模式是：人来开发 Agent，修改完代码，需要重新打包发布。而当前这套架构，Agent 则可以根据需要，动态编写代码，然后增加、减少、替换其中的组件，从而实现 Agent 的自进化能力。

多层灵活组装，特别优雅。得益于这套结构，DSH 才能提供创造模式这样基于自然语言就能创造新 Agent 的能力。

---

## 架构层级速查

| 层级 | 概念 | 作用 |
|------|------|------|
| 启动形态 | Profile | 决定 Harness 以什么形态启动（web / headless / 自定义） |
| 插件组合 | Bundle | 打包经常一起出现的插件和默认配置 |
| 配置覆盖 | Patch | 在 Bundle 基础上修改或补充配置 |
| 插件连接 | provide / inject | 服务注册与依赖声明，构建完整依赖图 |
| 流程参与 | event / effect | 让插件从侧面参与流程，卸载时自动清理 |
| 工作模式 | Preset | 决定某一类 Agent 具有什么能力（工具+提示词+Skills） |
| 任务单元 | Turn / Step | 一轮完整任务及其内部的多次模型判断+工具操作 |
| 持久化 | SessionEvent | 追加式日志，记录全部事件供多方消费 |
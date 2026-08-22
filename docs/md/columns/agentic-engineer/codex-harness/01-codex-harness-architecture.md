---
title: "Codex Harness 架构解析与应用"
date: "2026-08-22"
source: "架构师"
url: "https://mp.weixin.qq.com/s/TDnw2sKTJwHGF7kwbj_1_g"
---

# Codex Harness 架构解析与应用

这几天谈 Codex Harness，最常见的两个说法是"OpenAI 全面开源 Codex"和"Agent OS"。可把 App Server、Core Session 和 Agent Loop 串起来看，源码里更值得注意的是另一件事：OpenAI 正在把 Codex 的执行部分从单一产品里拆出来，交给 CLI、IDE、桌面应用和第三方产品共用。

这次我对照了 OpenAI 的平台文章、App Server 工程文章和当前文档，也按固定提交读了一遍本地 Codex 仓库。源码基线是 `ff0e95007c`，提交日期为 2026 年 8 月 21 日。

Codex Harness 不是一组 Prompt，也不只是反复调用模型和工具的 Loop。它是一套有状态的 Agent 运行时，往下管模型采样、工具执行和沙箱隔离，往上通过 App Server 暴露给不同产品。

写一个 while 循环不难。难的是让任务跑上几个小时以后，仍能看见进度、补充输入、暂停审批、断开重连，最后还能说清是谁确认了结果。

## 一、先看全貌：远不止一个模型调用器

大多数 Agent 的第一版都差不多：用户输入发给模型，模型要调用工具就执行，结果送回去。

```
User ↓
  Model → Tool Call → Tool Result ↑
                │
                └─────────────────────┘
```

这就是最小 Agent Loop。跑个 Demo 足够了。

一旦进入产品，问题开始密集出现：任务跑到一半用户补了一句要求，输入该插到哪里？命令正在执行，怎样取消？上下文快满了，是直接失败还是压缩后继续？应用断开又连回来，怎样恢复同一条任务时间线？Shell、文件、网络和 MCP 工具，各自该受什么权限约束？

这些问题都发生在模型外面，却直接决定 Agent 能不能把事情做完。OpenAI 对 Harness 的官方说明也围绕这些展开：维护对话状态，组织模型与工具的循环，执行沙箱和审批策略，持续输出进度，并让工作跨 Turn 延续。

OpenAI 公布的一组数据很直观：在 `ARC-AGI-3` 基准上，同一个 GPT-5.6 Sol 模型，默认配置得分 13.3%；只是开启 retained reasoning 和 context compaction，分数跳到 38.3%，输出 token 还减少了 6 倍。模型没变，Harness 配置变了，结果差三倍。执行层对任务表现的影响，已经和模型本身同一量级。

把这些职责放回仓库，Codex 大致可以拆成四层：[^img1]

这张图里最容易误解的是 App Server。它没有在 Codex Core 外面另起一套 Loop，而是把外部请求送进 Core，再把内部事件整理成客户端可以长期依赖的协议。真正执行任务的，仍是 Codex Core 里的 Session 和 Agent Loop。

一项任务从产品界面走到模型采样，中间会依次经过 Thread、Turn、Item，App Server 和 Core Session。顺着这条路径看，比单独数模块更容易看懂 Codex。

## 二、一项 Agent 任务，先拆成 Thread、Turn、Item

Agent 很难塞进普通 REST 的"一次请求、一次响应"。用户说一句"修好测试"，后面可能跟着几十次模型输出、命令、文件修改、Diff、审批和错误恢复。

Codex App Server 用三个对象来组织这段过程：

| 对象 | 在 Codex 中表示什么 | 产品可以做什么 |
|------|---------------------|----------------|
| Thread | 一段可持久化、可恢复的 Agent 会话 | 创建、恢复、分叉、归档、订阅 |
| Turn | 一次用户输入触发的 Agent 工作 | 启动、Steer、中断、等待完成 |
| Item | Turn 内的原子输入或输出 | 展示消息、推理、命令、文件修改、工具与审批 |

Item 有自己的 started、增量事件和 completed。客户端不必从一串文本里猜 Agent 是在解释，还是正在运行命令。

这套协议是双向的。客户端可以发起 `turn/start`、`turn/steer` 和 `turn/interrupt`；服务端遇到需要确认的命令、文件修改或工具调用，也可以主动发出审批请求。

`turn/steer` 要带上 `expectedTurnId`，防止迟到的输入落进错误的活动 Turn。`turn/interrupt` 也不是在协议层把状态直接改成"已取消"，而是向 Core Session 提交 `Op::Interrupt`，等运行时真正停下来。

这几个对象不只是给界面展示用的名词。开始、补充、审和中断，最后都要回到同一个 Thread 的运行状态。[^img2]

## 三、一条外部请求进来以后，App Server 做了什么

App Server 不是一开始就有的。Codex 最初只有 TUI，在同一个进程里直接访问 Core 的 Rust 类型，迭代很快，但也因此成了特殊入口。后来做 VS Code 扩展时，OpenAI 先尝试过把 Codex 暴露成 MCP Server，但维护 MCP 语义和 IDE 交互的映射很快变得困难。最终他们换成了一套 `JSON-RPC` 协议，镜像 TUI 的循环逻辑。这就是 App Server 的雏形。

JetBrains、Xcode、桌面应用和合作伙伴先后接入后，这套协议逐渐从"内部临时方案"走向"外部产品可以安全依赖的平台边界"。当前 VS Code 扩展和 Desktop App 都是打包一个平台相关的 Codex 二进制，启动为子进程，通过 `stdio` 做双向 `JSON-RPC`。部分合作方（如 Xcode）还会把 client 和 server 的发布周期解耦：客户端稳定，server 侧可以独立升级。

顺着一条外部请求往下看，有三处代码很能说明它做了什么。

### handle_client_request：握手在前，请求在后

`message_processor.rs` 里的 `handle_client_request` 收到请求后不会立刻交给 Core 执行。

它先单独处理 `initialize`。连接没有完成握手，其他请求会返回 `Not initialized`；实验 API 也要求客户端显式声明能力。

初始化完成后，每类请求按 `serialization_scope()` 声明的范围进入资源级队列。`turn/start`、`turn/steer` 和 `turn/interrupt` 都以 Thread ID 作为串行范围；没有声明串行范围的请求则可并发处理。这不是一把大锁，而是按请求类型和资源粒度的并发控制。

App Server README 还写了背压策略：传输入口、请求处理和出站写入之间使用有界队列；入口饱和时返回 `JSON-RPC-32001 "Server overloaded; retry later"`，客户端要带抖动地指数退避。

初始化、顺序和背压看起来没有 Agent Loop 那么抢眼，但少了它们，系统一忙起来状态就先乱了。

### thread/start：创建的是一处运行现场

外部调用 `thread/start` 后，`thread_start_inner` 会校验历史模式、工作目录、沙箱与权限组合，通过校验后把装配工作交给后台任务。

`thread_start_task` 还要加载有效配置，计算项目 Trust，检查动态工具，准备扩展和执行环境，最后通过 `ThreadManager::start_thread` 创建 Core Thread。

Core Thread 建好以后，App Server 会挂上 Listener，生成 Thread 快照，返回 `ThreadStartResponse`，并发送 `thread/started` 通知。

到这里，Thread 已经不是数据库里的一行 Conversation，而是一处可恢复的 Agent 运行现场：模型、工具、权限、工作目录和持久化策略全部就位。

### Listener：把 Core 事件整理成客户端时间线

`thread_lifecycle.rs` 里的 Listener 一边监听 Core Thread，一边处理连接订阅、取消和卸载计时。

收到事件后，`ThreadState` 更新当前 Turn 和终态等内部状态，事件随后被转换成类型明确的通知，发给订阅这个 Thread 的客户端。没有开启 Raw Event 的连接不会收到底层原始响应。

当 Thread 停止运行且长期没有订阅者时，Listener 触发卸载回收内存。工程文章提到默认是最后一个订阅者退订后 30 分钟。

App Server 不只是做事件转发。它整理事件、维护客户端看到的状态投影、管理订阅生命周期，并在合适的时候卸载 Thread。

把三段链路放在一起，一条外部请求大致这样走：[^img3]

路径走到 Core Session，就进入了任务的执行现场。

## 四、Session：一次 Agent 运行的真正容器

`codex-rs/core/src/session/session.rs` 里，`Session` 的注释很克制：一个已经初始化的模型 Agent，同时最多运行一个 Task，也可以被用户输入中断。

但它持有的东西远不止一段聊天记录：

- `thread_id`、事件发送器和 Agent 状态；
- 当前 `active_turn` 与待处理输入队列；
- 对话历史、持久化服务和运行时服务；
- MCP 刷新、Hook 结果和 Guardian Review；
- 权限、沙箱、模型 Provider、工作目录和客户端来源。

`SessionConfiguration` 把这些约束具体化：模型提供方、推理配置、开发者指令、审批策略、权限 Profile、Shell 环境、`cwd`、`codex_home`、历史模式、父子 Thread 关系等。

在 Codex 的世界里，模型只是 Harness 的一个依赖。

模型负责给出下一步动作。Session 负责回答另一批问题：动作在哪个目录发生，能用哪些工具，需不需要审批，状态记到哪里，取消信号送给谁，执行结果怎样进入下一次采样。

把 Harness 只理解成 Prompt 模板或 Tool Router，会漏掉这一层。它恰恰是工程量最大、最难复制的部分。

## 五、Agent Loop 源码里至少有三层循环

OpenAI 工程文章里给过一个很清楚的最小 Loop：模型返回工具调用就执行工具并送回下一次采样；模型只返回 Assistant Message，Turn 结束。源码没有推翻这个模型，但把实际运行所需的层次补全了。[^img4]

### 第一层：RegularTask::run，一次任务怎样接着跑

`RegularTask::run` 发出 `TurnStarted` 后进入循环，反复调用 `run_turn`。

一次 `run_turn` 返回后，它不会马上认定任务结束，而是检查 `InputQueue`：用户在执行期间又送来了输入？内部还有待处理消息？有就继续消费。

实际效果：用户不必等 Agent 完全停下来才能补充要求。外部一次操作，也不能简单等价为内部一次模型请求。

### 第二层：run_turn，上下文与执行连续性

`run_turn` 最接近通常所说的 Agent Loop，但它做的事比"调用模型、执行工具"多一截。

进入采样前，它会处理上一轮异步 Hook 的结果，判断是否需要预压缩上下文，解析当前输入依赖的 MCP Server，再捕获这一步的上下文与工作区状态。

一次采样完成后，它会同时看几个条件：

- 模型是否还需要 Follow-up；
- 用户或系统是否送来了新输入；
- 当前上下文是否触及 Token 限制；
- Stop Hook 是否允许当前 Turn 收尾。

如果还要继续，但上下文已经接近边界，代码会执行 Auto Compaction，再回到同一个 Turn。若 Stop Hook 要求补充工作，新的 Continuation 也会重新进入输入队列。

Compaction 在这里不是"聊天记录摘要"。它发生在循环的控制路径上，决定长任务能否跨过上下文窗口继续运行。前面提到的 `ARC-AGI-3` 三倍提分，核心机制之一就是这个 Auto Compaction：模型在 retained reasoning 下持续工作，上下文满了就压缩，而不是失败退出。

### 第三层：try_run_sampling_request，模型流与工具并发

再往里走，`try_run_sampling_request` 消费模型返回的流。

它跟踪 Active Item、参数增量、Token 用量和最后一条 Agent Message，把执行中的工具 Future 放进 `FuturesOrdered`，同时监听取消信号和异常。

模型流里可能连续出现 Reasoning、Message 和 Tool Call，工具也未必同时完成。源码一边按流事件维护 Active Item，一边把工具 Future 按加入顺序取回；取消信号则会打断采样和后续处理。这几处配合起来，才没有让模型流、工具结果和客户端事件变成三套各走各的状态。

几十行伪代码可以说明 Loop 的逻辑，却装不下这些与时间、并发、失败和恢复有关的细节。

Codex Harness 最有工程价值的地方，是把模型流、工具执行、用户输入、上下文和取消信号收进同一条可持续的状态机。

## 六、审批已经进入协议，但业务授权仍在应用手里

App Server 把审批做成 Server Request，这一步的意义在于让审批有了协议语义。

Agent 想运行命令或修改文件时，服务端可以暂停 Turn，等客户端返回允许、拒绝或取消。审批不再只是某个 UI 临时弹出的对话框，而是执行生命周期的一部分。

但这只解决了 Harness 内部的执行许可。

在企业系统里，还要分清另一道门：业务动作授权。

| 控制 | 回答的问题 | 应由谁负责 |
|------|-----------|-----------|
| Harness 执行许可 | 能否运行命令、改文件、访问网络、调用工具 | Codex 权限、沙箱与客户端审批 |
| 业务动作授权 | 能否退款、改签、发布、关闭告警、修改权威记录 | 业务身份、权限、流程与审计系统 |

用户允许 Agent 调用一项工具，不代表他天然拥有工具背后的业务权限。Agent 返回"已经完成"，也不代表订单、工单或发布记录已经成功提交。

更稳妥的做法是，最终的权限校验和幂等控制仍留在业务系统。Harness 负责提出动作、暂停等待并记录执行过程；业务后端负责决定动作能否发生，以及发生后的状态是否有效。两边的分工其实很直接：

> 业务系统拥有事实和权力，Harness 拥有思考与执行过程。

它不是一句架构口号，而是避免 Agent 越权、重复执行和"自报完成"的实际分工。

## 七、三种接法，先看任务要活多久

Codex 当前有三种主要接法：`codex exec`、SDK 和 App Server。选哪一种，先问一个问题就够了：这项任务跑完就散，还是要在产品里活上几天，等人继续追问、补材料和审批？[^img5]

### codex exec：一次性任务和流水线

`codex exec` 适合 CI、批处理和边界清楚的一次性任务。宿主启动一个进程，给出任务，读取结构化事件或最终结果，再根据退出状态收口。

例如：分析一次构建失败、检查一个 Pull Request、在隔离工作区修复一类格式问题。

这类任务不需要产品长期持有 Thread，也不用自己实现 JSON-RPC 客户端。进程结束，资源随之释放，失败也容易回到原来的流水线处理。

### Codex SDK：在代码里控制 Thread

SDK 适合服务端工具、内部自动化和编排流程。应用可以启动、继续或恢复 Thread，流式接收事件，又不用自己维护底层协议绑定。

如果 Codex 只是工作流中的一个执行节点，SDK 通常已经够用。Cisco Cloud Control 的 App Builder，就是官方文章提到的公开案例。

### App Server：让 Agent 留在产品里继续工作

如果一项任务需要持久会话、细粒度进度、中途补充输入、审批和自定义界面，App Server 才开始显出价值。

宿主可以保留自己的工单列表、代码编辑器、告警台或运营看板，只把 Agent 的执行现场通过 Thread、Turn、Item 接进来。

OpenAI 的 Relay 示例就是这种模式。[^img6]

Relay 物流运营示例：用户先选中一票异常运单，应用把当前记录交给 Codex。Agent 通过应用拥有的 MCP 工具读取最新数据，比较恢复方案；真要重订时，再进入人工审批。动作完成后，页面重新读取业务系统里的权威记录。

这里没有万能聊天框，也没有让 Harness 接管物流后端。Agent 嵌在原有工作界面里，业务数据和控制权仍在应用手中。

OpenAI 还列了几类公开应用：GitHub 和 JetBrains 把 Codex 带进 IDE 工作流；Cisco 在 Cloud Control 的 App Builder 里使用 SDK；Thrive Holdings 与 Crete 的税务试点处理了 7000 份申报，准备时间缩短约三分之一。

这些案例至少说明，Harness 不只服务于 Coding Demo，也可以进入 IDE、云控制台和专业工作流。不过，试点里的业务数字仍然属于特定任务和流程，不能换算成一张通用的"Agent 提效表"。

## 八、换成三个熟悉的工作现场，边界就清楚了

源码讲的是机制，架构最终要回到工作现场。把前面的边界放进 CI、线上告警和客服工单，会更容易看出它们各自该放在哪里。以下是根据 Codex 协议和运行方式做的架构推演，不是 OpenAI 公布的客户案例。

### 场景一：CI 构建失败，一次性执行往往够用

假设主分支的一次构建失败了，我们想让 Agent 分析日志、定位代码，并在隔离工作区给出修复。

这个任务有明确起点，也有现成的验收者：提交 SHA、失败用例和相关日志组成输入；Agent 在一次 `codex exec` 里查代码、改文件、跑测试；最终产物是 Diff 和测试结果。CI 重新变绿，才算修复通过。

这里通常没必要先建一套持久 Thread 服务。我会先把执行关在临时工作区里，限定可读的仓库范围，屏蔽生产凭证，再给任务设置超时。Agent 最后一条 Message 可以解释它改了什么，却不能代替测试报告和代码评审。

若团队随后想让开发者在 IDE 里追问"为什么要改这一层"，任务才从一次性执行变成持续交互。此时再用 SDK 或 App Server 保留 Thread，比一开始就搭完整服务更稳妥。

### 场景二：线上告警，需要的是可接手的运行现场

线上告警恰好相反。一次排障可能跨过值班交接，期间不断出现新日志、新指标和人工判断，简单的一进一出很快就不够用了。

可以让一条 Incident 对应一个 Codex Thread。第一轮只交给 Agent 告警摘要、服务名、部署版本和时间窗口；日志、指标、Trace、变更记录则通过只读工具按需查询。新证据出现时，用新的 Turn 继续；值班同学补充判断时，用 Steer 放进当前执行过程。

查询调用链和执行重启，风险不在一个等级。前者可以在最小只读权限下自动运行；重启、扩容、切流、回滚仍要经过原有的身份校验、变更审批和审计。Harness 的 Approval 能暂停 Agent，但不该绕过生产系统自己的操作门槛。

Turn 结束也不等于告警解除。服务健康检查、错误率和告警平台里的 Incident 状态，才是这项工作的权威结果。Thread 留下的是排障现场：Agent 看过什么、尝试过什么、人在哪一步接手，而不是生产状态本身。

### 场景三：工单和物流，把查询与动作拆开

把 Relay 的物流界面换成我们熟悉的客服工单，道理也一样。一张工单可以对应一个 Thread。工程上，我不会把整套客户库和知识库一次性塞进 Prompt，而是先给当前工单、客户诉求和必要约束，其他信息再让 Agent 按需读取。这样暴露的数据更少，工具访问也更容易审计。

查订单、算方案、改地址、退款，可以拆成不同风险等级的工具。读操作用受限身份；写操作校验业务权限和参数；退款、改签这类动作带上工单号或操作号作为幂等键，再走业务审批。

动作返回成功后，页面最好重新读取订单或运单系统，而不是直接相信 Agent 的文字回答。网络超时很常见：工具可能已经成功写入，只是结果没来得及返回。没有幂等和回读，Agent 一重试就可能重复退款、重复下单。

三个场景看起来不同，背后的架构分工却很一致：

| 现场 | Harness 留住什么 | 谁来确认完成 |
|------|-----------------|-------------|
| CI 修复 | 执行过程、命令、文件修改与结果说明 | 测试、CI 状态、Diff 与代码评审 |
| 线上告警 | 排障上下文、工具轨迹、人工介入与审批 | 指标、健康检查、告警和变更系统 |
| 工单 / 物流 | 查询过程、候选方案、待批准动作 | 订单、运单、支付或工单系统 |

还有一个容易被忽略的部署细节。App Server 最适合靠近执行环境：本地 IDE 可以把它作为子进程启动，通过默认的 `stdio` 做双向 `JSON-RPC`，代码、Shell 和沙箱都留在工作区附近。Codex Web 则是另一种模式：worker 启动一个容器，里面放检出的工作区和 App Server 二进制，浏览器通过 HTTP + SSE 与后端通信，后端再和容器内的 App Server 走 `stdio`。状态和进度留在服务端，标签页关掉工作也不丢。

当前 README 仍把 `WebSocket` 标为 experimental / unsupported；自行跨主机部署不能只换一个传输地址，认证、TLS、连接恢复和网络隔离都要由部署方补上。

Thread ID 若只放在浏览器内存里，客户端一重连、服务一重启、值班一交接，原来的执行现场就找不回来了。代码任务、Incident 或工单 ID 与 Thread 之间，需要有一层可追踪的映射。

## 九、比模块数更稳定的三条线

分析 Codex 时，很容易数它有多少 crate，把每个新模块解释成一种平台能力。模块数量变得太快，三条结构性的线反而更值得关注。

单一执行内核，多种产品入口，这条线贯穿整个仓库。CLI、IDE 和第三方应用没有各造一套 Agent Loop，差异主要留在界面和宿主能力里。产品可以变，执行语义不必跟着重写。

协议承接整个生命周期，而不只返回最终结果。Thread、Turn、Item、Steer、Interrupt 和 Approval 都有正式语义，客户端不用解析日志来猜状态。外部走 `JSON-RPC`，进程内走类型化通道，请求最终仍落到同一个 Handler。

还有执行过程与业务事实分开。App Server 维护 Agent 状态，业务系统继续拥有订单、工单、发布与审计记录；输入上限、取消、上下文压缩、背压和无订阅卸载，则留在 Runtime 内处理。两边各守一段边界，比把所有职责都塞进 Harness 更容易演进。

这也是我更愿意把 Codex Harness 叫作 Agent Runtime 而不是 Agent OS 的原因。有人已经在这么叫了，但 OS 意味着统一的资源模型、调度抽象和可移植标准。Codex 目前做到了"同一个内核驱动多个产品"，工程完整度很高，但它没有替代业务后端，也没有定义跨 Runtime 的应用打包和迁移方式。叫它 Runtime 更准确，也给后续演进留了空间。

开源范围同样要说准确。OpenAI 当前公开了 Codex CLI、SDK、App Server、Skills 和 Plugins 等组件；IDE Extension 与 Codex Cloud 没有开源，模型访问和托管服务仍然分开。

代码开放、协议可接和生产可托付，也不是同一件事。

## 写在最后

读完这轮源码，有个判断更确定了：Agent 进入产品后，大量工程难题都发生在两次模型调用之间。

任务怎样保存，工具怎样并发，用户怎样插话，审批怎样暂停，取消怎样传递，上下文怎样越过窗口，客户端怎样重连，最后由谁确认事情真的做完。这些加在一起，就是 Harness。

App Server 做的事，是把这套内部运行过程整理成外部产品可以依赖的边界。OpenAI 甚至计划让最早直接访问 Core 的 TUI 也改走 App Server：拉起子进程，通过同一套 `JSON-RPC` 接收事件和处理审批。

如果这项改造完成，连离内核最近的入口也会退到协议外面。Codex 也就从"几个产品共用一批代码"，进一步走向"多个产品围绕同一个运行时构建"。

真要把这套 Harness 接进自己的产品，我不会先复制 Codex 的所有组件，而会先确认几条责任线：谁拥有业务事实，谁维护执行状态，谁批准动作，谁处理失败，最后由谁验收。

边界清楚以后，Harness 才不会变成另一个越来越厚的业务后端，Agent 也更有机会在真实工作流里安稳地干活。

## 参考资料

- OpenAI，Codex as a platform: build on the open agent harness（2026-08-19）：https://developers.openai.com/blog/codex-as-a-platform
- OpenAI Engineering，Unlocking the Codex harness: how we built the App Server：https://openai.com/index/unlocking-the-codex-harness/
- OpenAI Engineering，Unrolling the Codex agent loop：https://openai.com/index/unrolling-the-codex-agent-loop/
- OpenAI，Codex App Server：https://learn.chatgpt.com/docs/app-server
- OpenAI，Open-source components of Codex and where to collaborate：https://learn.chatgpt.com/docs/open-source
- OpenAI，Codex SDK：https://learn.chatgpt.com/docs/codex-sdk
- OpenAI Codex 源码，本地分析基线：`ff0e95007cca1edfc0877bbbbfaeb9eb77ed92b3`

[^img1]: 图1：Codex Harness 与产品应用的分层
[^img2]: 图2：Thread、Turn、Item 对象关系
[^img3]: 图3：外部请求到 Core Session 的路径
[^img4]: 图4：Agent Loop 三层循环结构
[^img5]: 图5：三种接法对比
[^img6]: 图6：Relay 物流运营示例

---

[← 回到 Codex Harness 专栏](./index.md)

---
title: "Pi 1.0：为何接纳 MCP，又推出 Pi Durable？"
author: "lencx"
date: "2026年10月2日 14:45"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/-XP2CdEb68IEO15Sg36fkg"
---

# Pi 1.0：为何接纳 MCP，又推出 Pi Durable？

之前写过第一个 Agent 从 Pi 开始，没想到续篇来得这么快。Pi 1.0 带来了一系列新特性，从工具编排到扩展机制，都为 Agent 开发提供了值得借鉴的思路，也值得再写一篇深入聊聊。



# Pi 1.0 发布



从拒绝 MCP 到内置支持，Pi 重新思考了模型与工具的分工。本文结合源码、代码示例与完整演示，解析 Codemode 如何编排工具、减少上下文开销，以及 Pi Durable 如何保存状态、恢复中断任务，串起智能体从工具调用到长期运行的技术路径，并厘清重试与外部副作用的边界。



从拒绝 MCP 到内置支持，Pi 重新思考了模型与工具的分工。本文结合源码、代码示例与完整演示，解析 Codemode 如何编排工具、减少上下文开销，以及 Pi Durable 如何保存状态、恢复中断任务，串起智能体从工具调用到长期运行的技术路径，并厘清重试与外部副作用的边界。



2026 年 9 月 29 日，Earendil 在 You Said No MCP![1] 中解释了团队为何重新接纳 MCP。两天后，Pi 1.0[2] 宣布稳定版发布，Pi Durable[3] 介绍同时推出的实验性持久化框架。这三篇文章串起了两个相互关联的问题：模型怎样有效地使用越来越多的工具，以及由这些工具组成的工作怎样在中断后继续推进。Codemode 主要处理前一个问题，Pi Durable 则把会话、任务和应用状态纳入持久化执行体系。



这里的 harness，是围绕模型运行的宿主程序：它组织对话、提供工具、执行调用，并管理状态。Pi 的终端编程智能体已经有这样的运行机制；Pi Durable 将长期运行、共享状态和多入口交互所需的机制整理成独立框架。二者共享部分代码和设计原则，但有各自的使用边界。理解这种分工，才能判断 MCP 的引入改变了什么，以及“持久化”究竟保证了什么。



先看工具使用。Pi 曾在官网明确宣传不支持 MCP，Mario Zechner 也公开批评过常见的 MCP 接入方式。这种批评集中在两个问题上：大量工具定义提前占用上下文，工具结果又不容易继续交给程序组合处理。Mario 的早期文章同时承认，设计得当的 Bash 工具和 MCP 都可以高效。这些讨论把焦点指向工具能力、上下文成本和组合方式之间的取舍。早期讨论[4]



上下文开销有一个具体的历史例子。Mario 在 2025 年 11 月 2 日记录，当时 Playwright MCP 的 21 个工具定义约占 13.7k tokens，Chrome DevTools MCP 的 26 个工具约占 18.0k tokens。在同样计量条件下，二者同时预载的合计估算约为 31.7k tokens。这组历史数据说明了工具定义可能占用的上下文量级，适用范围限于当时的版本与配置；当前成本、具体延迟和调用准确率仍需分别测量。原始测量记录[5]



另一个成本来自调度。如果一个客户端每执行一次查询，都把结果交给模型，再由模型决定发起下一次查询，那么读取 50 个工单的评论就可能产生大量模型往返。查询次数与模型往返次数之间没有固定的一一对应关系：客户端采用批量接口、同一轮中的并行工具调用或程序化编排，都能改变这个过程。Pi 选择的是让模型先写出一段处理流程，再由程序执行其中已经明确的控制逻辑。



这一选择逐步进入了发布版本。2026 年 9 月 29 日的 0.99.0 内置了 Codemode、工具搜索和 MCP 扩展；9 月 30 日的 0.99.2 进一步调整默认 MCP 暴露方式，使这些工具不再逐个出现在 Codemode 描述中，改由服务器摘要和按需发现机制引导使用。没有直接暴露工具的服务器也不再阻塞首条提示，而是在使用或搜索时按需等待连接。10 月 1 日的 1.0 又精简了提示内容：变更记录中的一个默认工具加 Codemode 的 GPT-5.6 请求，从约 5,300 tokens 降到约 3,300 tokens。这个数字描述的是该配置的提示开销，实际任务收益仍取决于工具集合与调用方式。版本变更记录[6]



团队给出的理由还包括通用性：为了支持 Codemode，需要一个受控解释器，以及能够区分直接暴露、延迟加载和脚本调用的工具元数据。这些机制也能支持分类模型等其他能力。因此，更有依据的理解是，Pi 接纳了 MCP 的标准化连接能力，同时把工具发现、调用编排和结果筛选放到宿主与 Codemode 中实现。



这个分工首先体现在默认配置中。Pi 的默认基础工具集合是 read、bash、edit、write，扩展和配置可以在此基础上增加能力。对 MCP 服务器，未指定的 exposure 默认取 codemode；注册工具时，这个值再映射为内部的 deferred。下面两段摘自实际实现，类型分别来自所在模块。默认基础工具[7]、MCP 默认值[8]、暴露方式映射[9]



默认 MCP 工具因此既不作为直接工具声明发送给模型，也不列入 Codemode 的内联工具声明。系统提示保留服务器摘要，脚本按需检索工具。这个机制减少了预载成本；Codemode 自身的说明、服务器摘要和随后输出的工具声明仍然占用上下文。需要直接调用时，配置可以改为 direct，也可以通过 deferred 配合 tool_search 在后续模型请求中加载工具。模型由此能够按任务需要获得调用信息，而无需在开始时接收所有定义。工具暴露文档[10]



发现工具的过程也能够在代码中核对。searchTools() 使用 BM25，依据工具名、描述、参数说明及命名空间信息排序，并返回候选工具的名称和声明描述；describeTool() 可按名称单独查询声明，describeNamespace() 可读取服务器说明和工具名。BM25 排序在宿主侧实现，通过桥接供脚本调用。下面的脚本将最多三个匹配项交给模型，供它选择后续调用。发现接口实现[11]



确定接口以后，模型可以把多次调用组织为 JavaScript。Pi 的 Codemode 为一次脚本执行创建 worker，并在其中建立 QuickJS WebAssembly 实例。脚本可使用循环、分支、并发等待和数组操作，本身不提供 Node API、文件系统、直接网络访问或定时器。外部能力通过 tools 和受控的 models 接口访问；嵌套工具调用仍进入 ctx.executeTool()，沿用宿主的参数校验、扩展钩子和既有执行规则。这个沙箱约束的是编排脚本的访问方式，实际工具能做什么仍由宿主提供的能力决定。运行时实现[12]、工具调用路径[13]



为了具体观察数据流，可以使用 Pi 已有的 bash 结构化返回接口。下面的 Codemode 脚本在当前 Git 仓库中并行读取近七天提交和工作区状态，检查命令失败及输出截断，再生成统计和节选。提交列表和状态原文留在脚本中，模型只收到最终返回的结果。它展示的是确定性的筛选与统计，提交的语义解释仍由模型完成。Codemode 的输入和返回约定[14]



相同的编排方式也适用于 MCP，但返回值要按实际接口读取。在核对的版本中，MCP 工具交给脚本的是去掉 _meta 的 CallToolResult，其中保留 content、structuredContent 和 isError。脚本需要检查错误，再按具体服务器声明的数据结构读取业务内容。工具结果在这个封装环节不做截断，模型收到的脚本输出则有独立预算。因此，大量中间数据可以在脚本中先筛选再返回；若主动打印原始数据，相应的上下文成本仍然存在。MCP 结果转换[15]、输出预算与错误处理[16]



这里节省的是不必要的模型调度和中间数据传递。并发可以重叠相互独立的等待，但网络请求、服务端计算、限流和模型分类调用仍有各自的耗时与费用。脚本失败时，已经完成的外部调用不会自动撤销；尚未完成的调用会被取消，但外部服务可能已经产生效果。由此可以得到一个清晰的职责划分：模型负责组织意图和判断结果，脚本负责确定性的控制流，MCP 负责标准化能力接入。



这种编排还可以接入 Jev 一类分类模型。Pi 的 models.classify() 接收结构化状态和分类问题，返回标签、概率等结果，适合放在程序中批量处理；其用量仍计入会话成本。聊天模型的路由则由另一条扩展路径处理：虚拟模型可以把多个聊天模型组合为一个可选择的模型入口。Codemode 的 models 接口在这个版本中可执行分类和图像模型，不能直接运行目录中的聊天模型。Pi 1.0 的演示将这些能力组合到了同一个工作流程中。脚本模型接口[17]、虚拟模型文档[18]



下面的完整演示先用 Codemode 汇总一周提交，再由 Pi 编写虚拟模型扩展，让 Claude Opus 规划、GPT 实现、Jev 判断切换时机，最后查看各模型成本和缓存使用情况。它展示了工具编排与模型扩展如何共同组成一个可调整的工作流程。



已关注                   关注     重播    分享     赞                                随便看看              -->           关闭观看更多更多退出全屏切换到竖屏全屏退出全屏浮之静已关注分享视频，时长02:190/000:00/02:19 切换到横屏模式 继续播放进度条，百分之0播放00:00/02:1902:19倍速全屏 倍速播放中  0.5倍  0.75倍  1.0倍  1.5倍  2.0倍  超清  流畅  您的浏览器不支持 video 标签 继续观看 Pi 1.0：为何接纳 MCP，又推出 Pi Durable？ 观看更多转载,Pi 1.0：为何接纳 MCP，又推出 Pi Durable？浮之静已关注分享点赞在看已同步到看一看写下你的评论               视频详情



0/0



继续观看



Pi 1.0：为何接纳 MCP，又推出 Pi Durable？



到这里，工具如何组合已经有了答案。接下来需要考虑的是：如果这个流程持续运行，进程在中间退出，恢复依据是什么？Codemode 脚本成功结束后，store() 的写入可以作为会话条目保存，后续脚本从当前分支读取这些小型 JSON 值。这种保存不包括 JavaScript 调用栈或未完成的 Promise。Pi Durable 面向的正是更完整的任务生命周期，让执行进度成为明确保存、能够恢复的状态。从工具编排进一步考察任务生命周期，有助于理解两层设计的联系；具体实现仍需分别处理脚本状态和 Durable 检查点。Codemode 状态保存[19]



Durable 的基础单位可以归为会话、任务和文档。会话记录交互历史，并通过内置状态保存模型和工具选择；任务是带检查点的状态机，模型请求、工具执行和自定义工作都可由它表示；文档保存待办列表等应用数据。Harness 把这些对象与存储和调度器连接起来，所有变化通过原子提交进入记录。恢复时，程序从已提交的检查点继续，检查点之间的工作可能重新执行。核心概念[20]



以下以一个调查工单和失败测试的应用贯穿这些机制。示例按 1.0.0 SDK 的接口编写，各段是接口讲解片段：查询工单、关闭工单和渲染界面的函数属于应用适配器，需要接入自己的服务。Node 版本要求至少为 22.19.0；为了与本文核对的接口保持一致，安装命令固定包版本。Pi Durable 即使包版本为 1.0.0，官方仍将其 API 标为实验性。包版本与运行环境[21]



应用先注册模型提供方和基础工具，再用 SQLite 打开 Harness。CodingTools 提供 read、write、edit、bash，NodeExecutionEnv 提供它们访问的本地工作目录。下面把初始化封装为 openAgent()，后面的重启代码会再次调用它；root() 在首次使用时创建根会话，重新打开同一份存储时返回已有根会话。初始化与恢复接口[22]



选择 SQLite，意味着已提交记录可以跨越进程生命周期保存。这里仍有明确边界：官方 Node 适配器使用 WAL 与 synchronous = NORMAL，能保留进程崩溃前已经提交的事务，但断电或操作系统故障仍可能丢失最近的提交。内存存储不会跨进程保留数据，JSONL 的落盘策略也取决于配置。另外，Durable 要求一份存储同时由一个进程持有，并未实现跨进程所有权锁；多个界面应连接同一个宿主，而不是各自直接打开同一份会话存储。存储保证与限制[23]



有了持久化存储，客户端重试首先需要解决重复提交问题。对同一次业务请求使用稳定的 requestId，Durable 就能在同一会话中找到原提交。它标识的是“调查这次登录测试失败”这个请求。请求内容改变时应使用新标识，复用旧标识会返回原提交。



如果进程在等待期间中断，新进程安装相同的模型和扩展定义，打开同一数据库，并重新使用这个请求标识。resume() 启动调度器；提交或等待任务也会触发调度。以下代码属于新进程，执行前旧进程已经退出或关闭存储。提交去重实现[24]



提交去重只解决请求是否被重复受理。真正执行时，模型请求若被中断，可以重新发送，已保存的部分回答会保留并标记中断；工具调用则需要单独判断能否重跑。Durable 在调用工具前保存调用意图和重放策略，恢复到执行阶段时，只有记录中的策略与当前工具定义都为 safe，才重新执行。框架并不自动证明一个工具具有幂等性。工具恢复判定[25]



在工单应用中，查询通常允许重新执行，而关闭工单会改变外部状态，应按服务的幂等约定设计。下面将两者注册在同一扩展中，只有查询声明 replay: "safe"。未声明安全重放的调用如果中断，框架会把中断结果与已保存的输出交给模型；模型之后仍可能发起新的调用，因此外部副作用的幂等还需在业务层实现。



扩展同时也是附加执行规则的位置。比如，关闭工单前需要获得人的确认，可以用 beforeTool 钩子拦截，并将决定保存在当前工具任务的 memo 中。这个例子中的 askForApproval 是应用接口；相同任务若恢复到审批步骤，会读取已经提交的决定，新工具调用则有自己的任务和 memo。钩子与 memo 接口[26]



memo 保存的是已经提交的决定。若崩溃发生在审批通知发出之后、决定写入之前，通知仍可能重复，应用应使用稳定标识处理通知去重。调用意图已落盘并进入执行阶段后，恢复也不会重新走最初的 beforeTool 路径。类似地，外部服务操作成功与本地检查点提交之间存在间隙，仍需借助幂等键、状态查询或补偿处理。这些边界说明，持久化状态机与外部系统的一致性需要共同设计。



除了单次工具调用，开发者还可以为多阶段工作定义任务。下面的工单报告任务有两个阶段：先查询并保存报告文本，再发布到应用的报告服务。查询结果经过转换后进入检查点，恢复到发布阶段时便无需再次查询；发布使用当前存储内稳定的任务 ID 作为键，reportStore 按存储实例配置独立命名空间，并保证同一键的重复写入具有约定的幂等效果。这里的两个服务仍由应用实现。自定义任务接口与示例[27]



一个更大的任务可以在原子提交中创建多个子任务，并保存 waiting 状态以及下一阶段的检查点。allSettled 等待全部结束；failFast 在子任务失败时取消其他尚未完成的子任务，然后由父任务读取结果。取消沿所有权关系自下而上推进，为各层的清理逻辑留下位置。已经完成的外部操作不会因另一个子任务失败自动撤销，跨服务事务仍需要业务代码处理。子任务和取消语义[28]



任务检查点解决执行进度，用户界面里的调查计划则属于另一类状态。Durable 的 Document 用带类型的 JSON 保存这些应用数据，并允许它与会话历史在同一次提交中更新。下面添加一条调查待办，同时写入对应事件：两项变化一起提交，避免界面显示已经添加，而历史里没有相应记录。文档与原子提交[29]



history: "rewindable" 保留按历史位置读取旧值的能力，fork: "asOf" 规定分支从分叉位置当时的值开始。这里的分支继承是初始化语义，选择 current 也只是以创建分支时的当前值初始化，不意味着两个会话随后共享同一个可变列表。这个区别在并行调查中很实际：两条调查路径既可以继承共同背景，也能各自维护后续计划。文档分支策略[30]



会话本身也可以在指定历史条目处分支。比如，主会话给出初步判断后，开一个分支检查令牌刷新逻辑，主会话继续整理其他证据。分支沿用分叉位置的历史和 agent 配置，然后独立推进。下面将分支的工具明确限制为查询工具，使它能够继续调查工单；根会话保留原配置。会话分支[31]



ownerless 表明这个分支没有任务所有者，适合独立延续的讨论。如果一项工作只是某次工具调用的组成部分，则需要把生命周期关联起来。子智能体可以这样构造：工具创建一个由自己拥有的子会话，为它选择模型和工具，提交输入，然后等待回答。Durable 提供的是组合这些对象的接口，子智能体的产品行为由应用定义。会话所有权与子智能体[32]



下面的分类工具使用较小的聊天模型，把工单归为 bug、feature 或 question，子会话不提供工具。它通过 ownerTaskId 查找已有子会话，再用稳定 requestId 查找已有输入；工具重跑时因此能重新接上原来的工作。提示词中的输出要求还需在调用边界校验，因此示例在返回前检查标签。前台子智能体示例[33]



这种前台子会话属于父工具任务，取消父调用会向下传播，父任务也要等待自己拥有的工作结束才能完成。后台工作则在所有权树上形成另一种边界：被标记为 background 的任务及其子树不计入普通忙碌等待，普通取消不会越过这条边界。后台任务仍有所有者，并非必须直接归会话所有。下面在工具回调中把前面定义的报告任务作为会话拥有的后台工作启动。



调用方可以保存任务 ID，稍后查询或等待结果，也可以在取消会话时显式包含后台任务。这个创建片段展示生命周期配置；若把它放进允许重跑的工具，还需像前面的子智能体一样查找并复用已有任务，防止每次重试都创建一份新报告。普通 Promise 的并行等待只安排当前进程中的执行，任务所有权和检查点才负责长期工作的关联与恢复。



当主会话和后台工作可以并行推进，界面也必须能够随时重新接入。viewState() 提供当前活动视图，包括当前上下文中的历史条目、运行中的模型输出和工具状态、排队输入等；订阅随后接收已提交的变化。晚加入的客户端从当前视图开始，无需模拟用户此前在界面上的操作。较早历史按需另行查询，活动视图因此可以保持有限大小。观察会话[34]



这里的 whenBusy: "steer" 会把新输入接到当前工具轮之后；普通后续输入则排队等待当前工作给出答案。它允许用户在任务推进时调整方向，但不承诺立即打断已经发往外部系统的动作。watch() 还可以传送提交产生的状态变化，供应用连接网页或其他客户端。流式回答和工具输出会分批提交，客户端看到的是已提交内容，进程退出时尚未提交的片段可能丢失。共享这些状态是多人协作的基础，具体网络服务、身份与访问控制仍由应用实现。



长时间运行还会遇到上下文窗口限制。Durable 把压缩也建模为任务，在后台总结较早的消息，空闲时立即放入摘要，忙碌时在轮次边界放入。在模型窗口大小已知、且历史中存在可压缩切分点时，自动压缩使用两个阈值：估算上下文超过 contextWindow - reserveTokens - backgroundTokens 时，可以提前启动后台压缩；超过 contextWindow - reserveTokens 时，下一次请求要先等待压缩。等待阈值为后续生成预留余量，后台阈值则让摘要有机会提前完成。阈值判断实现[35]



下面的 compactionSettings 应作为 Harness.open() 选项中的 settings 传入。reserveTokens 为后续生成预留空间，backgroundTokens 决定比等待阈值提前多少 tokens 开始后台压缩，keepRecentTokens 指定大致保留多少近期原文。代码随后演示手动压缩、等待摘要生成以及等待摘要提交被处理；这两个等待阶段对应不同的完成条件。压缩接口[36]



如果模型提供方仍拒绝过长请求，框架会尝试压缩并重试一次。摘要可能在提交时已经过时，因此等待完成也应检查结果状态。原始历史继续存储，模型每次看到的仍是有限上下文；“长对话”来自历史存储与当前工作上下文的分工。需要主动开始新上下文时，reset() 可以附带交接说明，旧记录继续保留。



状态能够跨重启保存以后，应用代码还需要能在运行中演进。Durable 将工具、提示片段、钩子和任务组织在命名扩展中，会话通过保存的名称解析它们。系统提示在每次请求准备时重新生成，变化位置记入历史；支持相应能力的模型提供方可以接收对话中途的提示和工具变更，帮助保留可复用的缓存前缀。下面为调查应用增加工作目录和项目规则。提示片段与配置[37]



注册表安装同名扩展时，会替换后续工作所用的定义。已经开始的工具调用继续使用取得的实现，每个任务阶段也使用阶段开始时解析出的定义；下一阶段、下一请求或下一调用再读取新的注册表。loadExtension 是应用自己的加载函数，下面只是更新入口。运行中替换示例[38]



重新安装代码只解决名称如何绑定到实现，已有检查点与文档是否兼容新版本仍需维护。对长期运行的应用来说，可修改配置、可更换实现和可恢复状态必须同时成立，更新才不会让尚未完成的工作失去解释方式。这个要求也说明，框架的持久化能力需要应用遵守相应的状态与版本约定。



在这些机制的基础上，再看 Pi Durable 的旅行规划演示就容易理解了。主会话保持可交互，子智能体并行查询天气、博物馆和列车；进程退出时，前两项已经完成，重启后仅重跑允许安全重放且尚未完成的列车查询。用户随后切换会话、补充方向并压缩上下文，最后收到报告。



已关注                   关注     重播    分享     赞                                随便看看              -->           关闭观看更多更多退出全屏切换到竖屏全屏退出全屏浮之静已关注分享视频，时长01:490/000:00/01:49 切换到横屏模式 继续播放进度条，百分之0播放00:00/01:4901:49倍速全屏 倍速播放中  0.5倍  0.75倍  1.0倍  1.5倍  2.0倍  超清  流畅  您的浏览器不支持 video 标签 继续观看 Pi 1.0：为何接纳 MCP，又推出 Pi Durable？ 观看更多转载,Pi 1.0：为何接纳 MCP，又推出 Pi Durable？浮之静已关注分享点赞在看已同步到看一看写下你的评论               视频详情



0/0



继续观看



Pi 1.0：为何接纳 MCP，又推出 Pi Durable？



把模型比作“编译器”，可以帮助理解从任务意图到可执行脚本的过程。落实到应用时，模型还需要分析结果和修正计划，程序负责明确的控制流，持久化任务保存跨中断的进度。各层的接口和失败边界决定了这些能力能否可靠组合：一次调用返回什么、重试会产生什么效果、取消传播到哪里，都需要成为可核对的执行约定。



Pi 1.0 已作为稳定版终端智能体发布，Pi Durable 仍允许实验性 API 在版本间变化。采用 Durable 时，固定依赖版本、维护持久化状态兼容性，并验证业务所需的恢复与取消语义，才有办法把框架提供的机制转化为应用自身的可靠性。Durable 官方说明[39]、可执行示例目录[40]



# Claude Code Mods



Claude Code Mods[41] 让开发者通过 JavaScript 或 TypeScript 模块定制 Claude Code 的工作过程。插件可以在提示提交、工具调用和界面绘制等节点运行代码，把输入调整、结果记录和交互反馈接入宿主。Claude Code 的核心实现闭源，Mods 通过官方公开的接口提供这些扩展能力。



这套机制以事件处理链为核心。钩子接收宿主 API $、事件数据 e 和后续处理函数 next。调用 next(e)，事件会传给后续插件或宿主；等待它返回，可以读取和加工处理结果；传入修改后的事件副本，可以调整后续输入；直接返回符合事件约定的结果，则可以接管当前处理。开发者由此能够把规则放在操作发生的位置，在调用前检查输入，在调用后整理结果，并为用户提供相应反馈。事件机制[42]



界面也是这条事件链的一部分。工具事件产生的数据可以保存在插件状态中，再由 ui.render 生成文字、按钮或面板。下面的钩子模块将工具调用与界面连接起来：记录所观察到的 Edit、Write 成功调用，在输入框上方显示计数，并允许用户重置。



工具调用返回后，插件更新计数并请求重绘；宿主随后触发 ui.render，根据最新状态生成界面；用户点击重置，又会引发一次状态更新和重绘。执行结果、插件状态与用户操作由此形成闭环。由于计数保存在普通模块变量中，更新后需要显式调用 $.ui.invalidate()；整个计数与交互过程不需要额外调用模型。界面机制[43]



Pi 的扩展机制也支持这样的组织方式：通过 pi.on() 参与工具调用等事件，通过 ctx.ui 添加状态显示和交互组件。两者在扩展层的共同点，是把工作流程中的规则与反馈交给程序处理。开发者可以围绕实际任务安排检查、记录和交互，让 Agent 的行为适应具体工作环境。Pi 扩展文档[44]



插件还可以进一步把一组操作封装成模型能够调用的业务能力。Mods 提供 $.mcp.call 调用已连接的 MCP 工具，并允许通过 $.tool.register 注册自定义工具。例如，一个“工单汇总”工具可以接收查询条件，在内部读取工单、筛选未解决项、合并统计，再返回整理后的结果。模型负责选择这项能力并提供参数，具体的循环、判断和数据处理则由插件代码执行。这类封装也对应 Pi 扩展通过 pi.registerTool() 添加专用工具的方式。Mods API[45]



当工具的组合方式需要随任务变化时，Pi Codemode 提供了另一种执行入口：模型可以直接提交本次任务的执行脚本。脚本在 QuickJS 中运行，通过 tools.* 调用已有工具，用循环、并发和条件判断组织操作，并在输出前完成数据筛选与汇总。工具的中间结果可以留在执行环境中处理，再由脚本决定向模型输出哪些内容。



这使执行流程可以在不同层面被定义。专用工具把流程封装在插件内部，向模型提供明确的业务参数；Codemode 把脚本执行接口交给模型，让它在任务运行时组织步骤。对于 Agent 工作流的设计，反复使用的规则可以沉淀为插件或专用工具，临时变化的组合操作则可以通过脚本表达。两种方式各有侧重，也可以配合使用：插件提供稳定的业务能力与交互反馈，Codemode 在这些能力之上完成面向当前任务的编排。



### References



[1]You Said No MCP!:https://earendil.com/posts/you-said-no-mcp[2]Pi 1.0:https://earendil.com/posts/pi-1-0[3]Pi Durable:https://earendil.com/posts/pi-durable[4]早期讨论:https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp[5]原始测量记录:https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/#problems-with-common-browser-devtools-for-your-agent[6]版本变更记录:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/CHANGELOG.md[7]默认基础工具:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/core/settings-manager.ts#L214-L215[8]MCP 默认值:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/mcp/index.ts#L128-L130[9]暴露方式映射:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/mcp/tools.ts#L35-L41[10]工具暴露文档:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/mcp.md#control-tool-exposure[11]发现接口实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/codemode/execute.ts#L447-L510[12]运行时实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/codemode/src/runtime/worker.ts#L1-L16[13]工具调用路径:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/codemode/execute.ts#L339-L386[14]Codemode 的输入和返回约定:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#call-tools[15]MCP 结果转换:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/mcp/tools.ts#L1-L10[16]输出预算与错误处理:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#scripts[17]脚本模型接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#models[18]虚拟模型文档:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/virtual-models.md[19]Codemode 状态保存:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#store-values[20]核心概念:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#concepts[21]包版本与运行环境:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/package.json[22]初始化与恢复接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#persist-and-resume[23]存储保证与限制:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#storage[24]提交去重实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/submissions.ts#L150-L166[25]工具恢复判定:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/tool.ts#L31-L113[26]钩子与 memo 接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/types.ts#L582-L587[27]自定义任务接口与示例:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/24-child-tasks.ts[28]子任务和取消语义:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#child-tasks[29]文档与原子提交:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/01-documents.ts[30]文档分支策略:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/types.ts#L564-L582[31]会话分支:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#more-conversations-and-forks[32]会话所有权与子智能体:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#abort-and-subagents[33]前台子智能体示例:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/22-subagent-foreground.ts[34]观察会话:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#watching-a-conversation[35]阈值判断实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/generation.ts#L302-L322[36]压缩接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#compaction[37]提示片段与配置:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#system-prompt[38]运行中替换示例:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/31-reload-and-restart.ts[39]Durable 官方说明:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md[40]可执行示例目录:https://github.com/earendil-works/pi/tree/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples[41]Claude Code Mods:https://code.claude.com/docs/en/plugins/mods/overview[42]事件机制:https://code.claude.com/docs/en/plugins/mods/events[43]界面机制:https://code.claude.com/docs/en/plugins/mods/interface[44]Pi 扩展文档:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/extensions.md[45]Mods API:https://code.claude.com/docs/en/plugins/mods/api



You Said No MCP!:https://earendil.com/posts/you-said-no-mcp



Pi 1.0:https://earendil.com/posts/pi-1-0



Pi Durable:https://earendil.com/posts/pi-durable



早期讨论:https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp



原始测量记录:https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/#problems-with-common-browser-devtools-for-your-agent



版本变更记录:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/CHANGELOG.md



默认基础工具:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/core/settings-manager.ts#L214-L215



MCP 默认值:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/mcp/index.ts#L128-L130



暴露方式映射:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/mcp/tools.ts#L35-L41



工具暴露文档:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/mcp.md#control-tool-exposure



发现接口实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/codemode/execute.ts#L447-L510



运行时实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/codemode/src/runtime/worker.ts#L1-L16



工具调用路径:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/codemode/execute.ts#L339-L386



Codemode 的输入和返回约定:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#call-tools



MCP 结果转换:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/src/extensions/mcp/tools.ts#L1-L10



输出预算与错误处理:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#scripts



脚本模型接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#models



虚拟模型文档:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/virtual-models.md



Codemode 状态保存:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/codemode.md#store-values



核心概念:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#concepts



包版本与运行环境:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/package.json



初始化与恢复接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#persist-and-resume



存储保证与限制:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#storage



提交去重实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/submissions.ts#L150-L166



工具恢复判定:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/tool.ts#L31-L113



钩子与 memo 接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/types.ts#L582-L587



自定义任务接口与示例:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/24-child-tasks.ts



子任务和取消语义:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#child-tasks



文档与原子提交:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/01-documents.ts



文档分支策略:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/types.ts#L564-L582



会话分支:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#more-conversations-and-forks



会话所有权与子智能体:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#abort-and-subagents



前台子智能体示例:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/22-subagent-foreground.ts



观察会话:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#watching-a-conversation



阈值判断实现:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/src/harness/generation.ts#L302-L322



压缩接口:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#compaction



提示片段与配置:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md#system-prompt



运行中替换示例:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples/31-reload-and-restart.ts



Durable 官方说明:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/README.md



可执行示例目录:https://github.com/earendil-works/pi/tree/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/durable/test/examples



Claude Code Mods:https://code.claude.com/docs/en/plugins/mods/overview



事件机制:https://code.claude.com/docs/en/plugins/mods/events



界面机制:https://code.claude.com/docs/en/plugins/mods/interface



Pi 扩展文档:https://github.com/earendil-works/pi/blob/7fbbd5f4a1d982bb02d63472dde0774fa639f99b/packages/coding-agent/docs/extensions.md



Mods API:https://code.claude.com/docs/en/plugins/mods/api

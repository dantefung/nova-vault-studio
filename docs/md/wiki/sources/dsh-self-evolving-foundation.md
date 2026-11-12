---
title: "DeepSeek Harness 是自进化 Agent 的基石"
author: "Cage、Daniel"
date: "2026年8月20日 18:00"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/g6wTg7SVXbHrjdX4aEJQxg"
---

# DeepSeek Harness 是自进化 Agent 的基石

作者：Cage、Daniel⁠/⁠01.Key Takeaways　⁠1.DeepSeek Harness（DSH）发布的是一套可以热重载的 harness ，并且设计成适合 coding agent 自己去修改、进化的形态。这个发布思路很有野心，没有在白领工作/coding agent 这些方向去和 Claude Code/Codex/Workbuddy 竞争产品，而是延续了他们一以贯之的思路：开源、infra 化。　⁠•开源是把 harness 每一层都拆开开放出来，允许社区开发者一起接受优化　⁠•Infra 化的发布形式提高了使用门槛，避免出现像 Openclaw 那种项目复杂度膨胀太快，最终无法维护的情况。　⁠2.我们可以从三个层面理解 DSH 这次发布：　⁠•第一层是可直接使用的 coding agent，以本地 Web UI 为主要快速入口。这个交互形态的选择能看出开发者 preview 的目的，没有去做完整的桌面端/ TUI。使用起来和 ds 模型适配度很高，能感觉到同一个任务 ds 模型在 dsh 中和比直接用裸模型/其他 harness 更强。　⁠•第二层是 everything-is-a-plugin 的 harness 构造框架。这里面的核心能力都可以自定义，包括其他 agent 中最核心的 agent loop。　⁠•第三层是 Cordis 是一套底层的 meta-framework，能够让插件真正做到热重载、自由组合，以及彻底的遗忘和删除。　⁠3.DSH 的 Cordis plugin 不好直接去类比 MCP/Skills。它更像是 Claude Code 的 hooks、MCP、subagents 和内部核心 loop 全部统一了成一种插件机制。Cordis 解决的是动态组合问题，让组件能在依赖出现/消失时重组，并在卸载时撤回由 context 管理的副作用。注重可组合性和生态扩展性，这让 DSH 有点像早期的 Unix，拥有了类似 OS 的高潜力上限。　⁠4.这次发布的 coding agent 有四个模式，其中 Creator 模式值得关注。它的形式比较像一个交互式 Agent Foundry：允许开发者指导 agent 检查当前 runtime 试验插件，并创作新的 Agent preset 形式。虽然还不是自进化系统，但可以收集 agent 用来学习自进化的数据。 官方同时明确鼓励社区创建与分发第三方插件，因此 Creator mode 也可能成为其插件生态的创作入口。　⁠5.DSH 更长期的目标用户，很可能会为 To Developer 走向 To Agent。它把 harness 做成了对 agent 可以修改、热重载的对象，并不是为了服务现在的 coding agent 需求，而是服务未来下一代的自进化和持续学习框架。有了 DSH 之后，我们愈发能想象下一代 agent 会在 long horizon task 中，一边执行任务，一边更换支撑自身运行的部件，就像一艘持续航行的忒修斯之船。　⁠6.Anthropic Claude Code 与 Deepseek DSH 代表了两种不同的 Harness 研究重点：　⁠•Anthropic 是为了在当前范式下做出一个最好的 agent 产品，目标是最有效、简单，同时最大化模型能力边界的 harness。Deepseek 是在押注下一个范式，因此直接把替换、组合和撤销 harness component 作为首要的假设来进行设计。　⁠•Claude Code 希望做成做端到端的垂直整合产品，来给自己 API 依赖的商业模式增加用户粘性；而 DSH 则是目标完全开放给开发者的。　⁠•因此可以认为 Anthropic/OpenAI 和 deepseek 在研究两个不同的问题：　⁠1）A/O 研究的是 Harness 本身的能力：已有 SOTA 模型应该如何设计 harness 架构，比如 agent loop、subagent 架构来让 harness 表现得最好？　⁠2）Deepseek 在研究的是 Harness 的可塑性：harness 是流动的，一直会被模型内化和重写，那么最重要的就是如何最有效的修改、替换、撤销 harness 中的组件变化？这个问题更接近于 meta harness。　⁠7.DSH 已经提供了 agent runtime self-modification 的底座，但距离真正的 self-evolve 缺少一个完整的学习闭环，需要 有 Learning Loop 来学习并提出修改、Eval 评估修改的有效性。因此当前其实是 Harness-level RSI 的第一步，自身拆成可定位、可替换的组件。　⁠　⁠02.DSH 这次发布了什么？　⁠从产品表面看，DeepSeek Harness（DSH）是一个带本地 Web UI 的 Coding Agent。　⁠官方设置了四个模式，也允许开发者去贡献配置更多模式：　⁠　⁠•80% 的任务用标准模式：能力完整、行为可预测，也最容易排错。　⁠•PTC / Code 模式适合工具调用密集的任务：模型不再逐个调用工具，而是先生成一段 TypeScript，再通过run_code调用多个工具。批量分析、跨文件检索、重复操作时收益最大；任务简单时反而可能增加调试成本。　⁠•极简模式是实验室环境：它只保留 Bash 和编辑器，许多便利能力都没有。它的价值在于控制变量：帮助研究者区分能力来自模型本身，还是来自 Harness 的帮助。　⁠•创造模式的核心用途是“造 Agent”：这个模式值得关注，它保留了标准模式的能力，同时允许 Agent 检查 Cordis Runtime、实验新的 Plugin，并编写新的 Preset。创造模式具有更高权限，更适合 Harness 开发和隔离实验。　⁠我们可以把这次发布分为三层去拆解：　⁠1.Coding agent　⁠DSH 没有把 Terminal-first TUI 或桌面端作为主要产品形态，而是选择了更像开发者 Demo 的本地 Web UI。标准模式已经包含真实编程工作需要的主要能力，包括执行命令、修改和搜索文件、调用 Skills、维护计划与目标、启动子代理，以及运行工作流。系统还提供 Context Compaction、会话持久化、Sandbox 和权限审批。　⁠2.Harness construction framework　⁠DSH 不只允许开发者“增加一个 Tool”。Model Adapter、Tool Registry、Sandbox Policy、Subagent Backend，甚至默认 Agent Loop，都可以由 Cordis Plugin 提供。这些组件通过 ctx.llm、ctx.tools、ctx.sandbox、ctx.agentLoop 等稳定的 Service Key 协作，而不是直接 Import 某个具体实现。开发者因此可以替换一个能力的 Provider，同时尽量保持其他组件不变。　⁠3.Cordis meta-framework　⁠Cordis 进一步解决的是：这些组件怎样加入、删除和重新组合，能够不把正在运行的系统破坏掉。　⁠多数 Agent 插件系统主要关心怎样增加功能：安装更多 Tool、Skill 和 MCP。但组件不断增加后，系统也会积累更多 Tool Schema 和依赖关系。模型需要在更多能力之间进行选择，很多人在 Claude Code 中遇到过 Skills 过多后反而效果变差的情况。　⁠这里可以把这种现象理解为一种工程上的“熵增”：系统不断增加能力，却缺少对应的删除和重组机制。这个问题与 Continual Learning 中“记忆与遗忘”的关系有一定相似性。这也是 Cordis 论文 A Programming Paradigm for Spatiotemporal Composability 讨论的核心问题。论文把插件的动态组合拆成两个相互独立的维度来解决。　⁠•时间可组合性 Temporal Composability，是解决处理组件的退出。　⁠一个 Plugin 加载时，可能注册 Tool、Prompt Section、Event Listener、Timer 和 Service。如果只删除插件代码，这些已经进入 Runtime 的状态可能继续存在，形成无法正常清理的“幽灵组件”。Cordis 要求组件在注册 Effect 时，同时提供对应的撤销方式。注册 Tool 时记录怎样注销 Tool，增加 Prompt 时记录怎样移除 Prompt，启动 Timer 时记录怎样停止 Timer。组件卸载后，Runtime 会撤销它在 Context 中留下的 Effect。　⁠•空间可组合性 Spatial Composability 处理组件之间的依赖。　⁠组件不直接绑定某个实现，而是声明自己需要什么 Service。当依赖尚未出现时，组件保持 Waiting；依赖满足后，组件进入 Active；正在使用的 Service 消失或被替换后，组件先撤销自己的 Effect，再根据新的依赖关系重新激活。　⁠因此从产品气质看，当前的 DSH 更接近早期 Unix：默认体验比较粗糙，但底层结构更开放，也允许开发者深入修改。Claude Code 和 Codex 就更像整合度很高的 Windows。　⁠当然这种开放也需要有更长期主义的耐心。“一切可替换”只有在存在足够多、足够稳定的替代组件时才有价值。DSH 当前的 Plugin 生态和状态管理仍处于早期阶段，理解和修改整个项目的门槛也很高，短期内很难直接和 Claude Code、Codex 产生替代关系。　⁠　⁠03.DSH 与 Anthropic harness 是两种不同的 Harness 哲学　⁠如果我们用一个简单的框架理解 Agent：　⁠•Agent = Model + Harness　⁠•Harness = orchestration + context/memory/state + permissions + tools/sandbox/recovery　⁠我们可以发现，Anthropic 与 DeepSeek 的差异并不只是组件设计不同，而是二者在优化不同的目标：　⁠　⁠Anthropic Claude Code： 不断试验，优化 Agent 行为　⁠我们阅读 Anthropic 关于 Agent Harness 的技术文章，会发现他们的 Long-horizon Agent 研究通常从 SOTA 模型的能力边界和失败模式出发，再去设计和验证相应的 Harness 机制。例如：　⁠•通过 initializer agent、coding agent 和跨 Session 的 Artifact Handoff，解决长任务中的状态丢失；　⁠•通过 planner、generator 和 evaluator 分工，解决任务规划不足和模型自我评价偏高的问题；　⁠•通过 Context Reset 与 Compaction，缓解 Context 污染和长任务中的连贯性下降；　⁠•通过任务分解、测试反馈和 Scalable Evaluator，控制执行范围，并让每一步都可以被自动验收；　⁠•随着模型能力提升，通过 Ablation 删除不再必要的 Scaffolding。　⁠Boris Cherny 的 YC 访谈中提到，Opus 5 发布后，Claude Code 删除了超过 80% 的 System Prompt。每当新模型发布，团队都会以清空 System Prompt 的 Ablation 作为实验基线，重新运行真实任务；只有当模型反复出现同一种失败时，才逐行加回必要指令。他们也会持续调整 Tool Set，并删除不再提供能力增益的 Harness Code。　⁠Anthropic 的方法很像实证科学。团队先观察当前模型在真实任务中的能力边界，再针对反复出现的失败设计 Harness。每个 Harness Component 都对应一个关于“模型当前无法独立完成什么”的假设；模型进步后，这些假设可能过期，因此需要通过 Eval 和 Ablation 重新验证优化。　⁠DSH：从可变性出发，打造万物可插拔的 Harness　⁠对比以上 Anthropic 的实证研究思路，DSH更像从理论研究的视角想去第一性的解决一个目标问题，也就是Harness 能否被低成本地修改的问题，最终是在设计一个能够持续修改迭代 Harness 的Meta Harness，应该：　⁠•替换一个 harness component　⁠•撤销旧 component 的副作用　⁠•出现修改时重新解析依赖　⁠•让不同 session 使用不同 composition　⁠•让 agent 检查和编写新的 preset/plugin　⁠因此 Anthropic 优化的是当下时间点的最佳结果，DSH 优化的是未来持续探索不同结果的能力。这让我们觉得 Deepseek 更像是想制造一套 Harness Evolution 的操作系统，而不是直接给出一套固定的最佳 Harness。　⁠　⁠04.DSH 的短期用户是开发者，长期用户是 Agent 自己　⁠DSH 当前的产品形态更像开发者预览版，而不是面向普通用户的成熟 Coding Agent。它没有优先打磨 Terminal UI、桌面端和开箱即用的工作流，而是把主要精力放在一个可以被深度修改的 Runtime 上。　⁠对普通用户来说，产品体验是比较粗糙的，不如 Claude Code 或 Codex 好用；但对 Agent Developer 来说，这意味着系统的大部分结构都可以重新组合。开发者可以在 DSH 上替换 Memory、Tool、Sandbox、权限策略和 UI，甚至更换 Agent Loop。最终做出来的产品可能完全看不出原始 DSH 的形态。因此，DSH 短期内更像一个 Agent 开发底座：它不直接交付唯一的最佳产品，而是让开发者基于同一个内核创造不同的 Agent。　⁠它更长期的想象空间，是让 Agent 逐渐成为 Harness 的使用者和修改者。Agent 要改进自己的 Harness，首先必须看懂自己运行在什么系统里。把 Harness 拆成命名清晰、依赖明确的 Component，相当于为 Agent 提供了一张系统地图：它可以定位问题，找到相关组件，再提出局部修改。　⁠这也是插件化的真正意义。它不仅方便开发者扩展功能，也把原本开放式的软件修改，变成了一组边界更明确的操作。Agent 不需要重写整个系统，而是可以尝试替换任何一个组件。如果实验失败，系统还可以卸载插件并恢复原来的组合。自我修改因此从一次高风险的整体重写，变成一系列可以测试和回滚的局部实验。　⁠其中的 Creator Mode 像是连接开发者与 Agent 的过渡形态。今天是开发者指导 Agent 创建新的 Plugin；这些过程未来可能变成训练数据，让模型学习如何设计和改进自己的 Harness。让 Agent 真正成为 Harness 的用户：它不仅调用 Harness 提供的工具，也开始操作 Harness 本身。　⁠未来，人类与 Agent 的分工可能发生变化。开发者不再直接决定每个 Session 使用哪些 Tool，而是负责定义允许修改的范围、可靠的 Eval，以及安全边界。Agent 则在这些边界内不断尝试更适合当前任务的 Harness。　⁠　⁠05.插件机制，DSH 的核心　⁠在 DSH 中，插件是一个可以独立安装、替换和撤销的 Harness 组件。它可以小到一个主题或工具，也可以深入到 Memory、Model Adapter、Sandbox，甚至 Agent Loop。只要遵循 DSH 的统一接口，一个 Harness 组件就可以被封装成插件。　⁠MCP、Skills、Hooks 和 Subagent 定义了某些具体能力或使用方式，DSH 插件则定义了这些能力如何接入整个 Harness。一个插件既可以封装 MCP 或 Skill，也可以包含一套完整的软件模块，改变 Agent 的运行方式。　⁠DSH 通过完全开源的方式拥抱社区。DSH 内核负责维持接口、依赖关系和插件生命周期，社区则在外围快速创新。这样既能避免大量 Pull Request 直接进入核心仓库，也能降低维护不同社区方案的成本。　⁠这种架构很快带来了生态增长。截至 8 月 19 日，GitHub 的 dsh-plugin Topic 聚合了约 7,700 个仓库。经过社区筛选的 awesome-dsh-plugin 已经收录约 1,500 个可通过 dsh plugin add 安装的插件，并获得约 9,200 Stars、1,350 Forks，仓库累计超过 1,800 次提交。　⁠　⁠从分类看，目前最集中的方向主要有两类。一类是在补充产品体验，例如 Web UI、桌面端、状态监控和交互组件；另一类是在接入外部 Agent 能力，例如长期记忆、Browser、Vision、Sandbox 和 Workflow。这意味着 DSH 正在成为外部 Agent Infra 接入用户 Runtime 的适配层。对于 Agent Infra 创业者，短期可以借助 DSH 获得分发和用户反馈；长期则要面对接口变化、平台依赖，以及同类插件快速竞争的风险。　⁠围绕插件的分发基础设施也开始形成，比如 dsh-market 提供插件搜索、安装和升级，dsh-find-plugin 则允许 Agent 在对话中主动寻找插件。社区不只在开发插件，也开始建设插件发现、安装和管理的完整链路。　⁠从这个角度看，DSH 的插件生态不只是一个应用商店，而是一个开放的 Harness 搜索空间。不同开发者可以并行尝试不同的 Memory、Tool、Workflow 和 Agent Loop。更长期的目标，则是让 Agent 自己读取、编写、测试和选择插件，通过改变 Harness 来改善自身行为。　⁠　⁠06.离真正的 self-evolve harness 还有多远　⁠难点 1: 保持系统自身的稳定性　⁠在 Agent 修改自身配置时，一个经典的痛点是如何保持自身稳定，避免 Agent 在修改配置、工具或核心代码时破坏自己的运行环境。这类风险已经出现在 Hermes、OpenClaw 等允许 Agent 修改自身配置的系统中。　⁠更复杂的 Self-Evolution 不能依赖“修改完成后重启”。它需要支持系统一边运行，一边替换支撑自身运行的组件。这就是Cordis 想核心实现的热重载：不关闭整个进程，也不重启完整的 Agent，而是在 Runtime 中卸载旧组件、清理它留下的状态，再加载新的实现。　⁠DSH 这套插件机制的价值，不只是“方便替换组件”，而是把一次危险的全局修改缩小成有边界的 Component Mutation。Agent 可以复制当前状态，在隔离的 Context 或 Sandbox 中修改一个 Plugin，通过热重载加载候选版本，再决定采用还是撤销。　⁠Cordis 将不同的 Harness 能力组织成具有统一生命周期的 Plugin。每个 Plugin 注册的 Service、Tool 和 Event Listener，都会被记录为该 Plugin 拥有的 Effect。当 Plugin 被卸载时，这些受 Cordis 管理的 Effect 会随之撤销。它还会持续跟踪组件之间的依赖关系。如果一个 Service 被卸载，依赖它的 Plugin 会暂时退出运行，避免继续使用失效的引用。新的 Service 加载完成后，这些依赖组件再基于新实现重新启动。　⁠这可以被理解为类比为数据库中的 Transactional Harness Mutation。一次 Harness 修改像数据库事务，更好的状态管理，使 Agent 能够在不摧毁自身的情况下进行更多 Harness-level RSI 实验。目前 Cordis 距离稳定的自我修改系统，还需要一套更完整的状态管理。　⁠难点 2: 持续可靠的 eval　⁠Harness 能生成修改不等于自我改进。只有系统能够判断哪些修改真的更好，并把它们保留下来，Self-Mutation 才会变成 Self-Improvement。　⁠从工程实现上来说，如果一个问题能够被低成本、稳定地评价，解决问题就可以被转化为搜索和优化。系统不断生成候选方案，运行 Eval，保留更好的版本，再进入下一轮迭代。测试充分的代码任务、Kernel 优化和棋类游戏之所以容易形成自动改进闭环，就是因为结果相对容易验证。　⁠DSH 的 Creator Mode 可能是一个重要的数据入口。Create Agent 可以检查当前 Runtime，复制已有 Preset，修改 Cordis Composition，并生成一个可以被其他 Session 加载的新 Agent。这个过程可以产生 Harness Patch、修改理由和人工反馈，为未来构建 Eval Suite 提供原始材料。　⁠但创作轨迹本身还不是可靠的 Eval。开发者接受一个 Preset，不代表它在其他任务上也更好。系统还需要记录新旧版本的对照结果，并通过 Held-out Tasks、Regression Test 和 Canary Deployment 检查改进能否迁移、是否带来能力退化。Create Mode 解决了一部分候选生成和数据积累问题，但距离持续可靠的 Eval System 仍然很远。　⁠真正的 Self-Evolving Harness 需要一套完整的 Learning Loop　⁠　⁠目前 Cordis 解决的主要仍是 “Harness 能否被更可控地调整”。它不知道为什么应该替换 Agent Loop，也不能判断新 Loop 是否真正提高了整体能力。它提供了运行和管理候选方案的底座，却没有完成问题诊断和效果的自动化评估。　⁠但这是一个很好的开始。Cordis 先解决了“系统能不能在不破坏自身的情况下修改 Harness”，让更多 Harness-level RSI 实验成为可能。下一步，才是让系统从这些实验中持续学习，并把有效的修改保留下来。　⁠　⁠07.从 DSH 展望未来的 RSI　⁠RSI 是AI 能否越来越擅长改进自己。核心是递归反馈：上一轮改进不仅提高了任务表现，也提高了系统下一轮发现问题、设计实验和产生改进的能力。其中又可以定义为两类：　⁠•一类是模型开发过程中的迭代 Model-level RSI。随着 Compute 和模型能力提高，交付下一单位智能所需要的 Researcher 数量是否持续下降。　⁠•另一类是 Agent 在工作中是否能够持续变好 Harness-level RSI。随着一个 long horizon task 任务执行深度增加，是否能够更好地改进自身来完成任务。DSH 在解决的就是这类问题。　⁠可以作为一个现实的观察指标。今天的 Coding Agent 已经能够承担代码实现、实验执行和结果分析等工作，Researcher 则逐渐转向选择方向、定义 Objective 和判断结果。我们正在看到 Research Automation 向初级 RSI 过渡：模型开始进入生产下一代模型和系统的流程，但整个改进方向仍然主要由人决定。　⁠RSI 也不一定从模型直接修改自己的 Weights 开始。Lilian Weng 认为，一条更现实的近期路径，是先把模型外部的 Harness 变成优化对象。优化范围会从 Prompt 和 Structured Context，逐渐扩展到 Workflow、Harness Code，最终可能进入负责优化 Harness 的 Optimizer Code。此时，系统改进的不再只是一次任务的答案，而是“如何获得更好答案的方法”。　⁠放到 Harness 层面，RSI 也不只是让 Agent 为自己写一个新 Tool。它需要形成一个完整过程：Agent 从任务轨迹中发现稳定的失败模式，判断问题来自 Memory、Tool、Context Management 还是 Agent Loop，提出新的 Harness 方案，再通过独立 Eval 判断新方案是否真的更好。验证有效的方案被保留，并成为下一轮任务和改进实验的起点。　⁠这有点像一艘持续航行的忒修斯之船。Agent 一边执行任务，一边更换支撑自身运行的部件。但真正重要的是每次更换之后，它是否能航行更快，也更好判断下一次应该更换什么。　⁠这里首先需要解决的是 Harness 的可理解性。Harness 的组件彼此依赖，修改一个部分会牵一发动全身。Agent 如果不知道系统由哪些部分组成，也不知道一次失败对应哪个组件，就很难安全地改进自己。Harness 内部还存在复杂依赖，一次 Agent Loop 的变化可能同时影响 Tool、Prompt 和 Context State。　⁠DSH 解决这个问题的方式是插件化和热重载。它通过 Cordis 把 Harness 组织成边界相对明确的 Component，使 Agent 能够查看系统结构，定位相关能力，并尝试调整 Memory、Tool、Workflow 或 Agent Loop。Plugin 不只是扩展功能的接口，也让原本隐藏在 Runtime 内部的 Harness 变成一个显式的优化空间。　⁠如果未来 Agent 能继续优化这套选择机制，让 Agent 修改进一步提高了 Agent 诊断失败、提出方案和设计 Eval 的能力，使后一轮改进比前一轮更有效，就能走向真正的Harness-level RSI。关于更广范围的 RSI 与持续学习，我们后续还会发布研究，继续分享对新范式的理解。　⁠⁠⁠⁠⁠⁠⁠延伸阅读⁠Claude Tag 可能是一个 10x Claude Code 级别的产品›⁠无法蒸馏的美国市场，谁在分食 Frontier Labs 百亿美金数据预算？›⁠Agent Infra 赛道更新，一年后为 Agent 设计的基建发展如何？›⁠当 Agent 成为 coworker：如何为新物种设计身份系统？›⁠真实工作流，正在成为下一代训练数据›



作者：Cage、Daniel⁠/⁠01.Key Takeaways　⁠1.DeepSeek Harness（DSH）发布的是一套可以热重载的 harness ，并且设计成适合 coding agent 自己去修改、进化的形态。这个发布思路很有野心，没有在白领工作/coding agent 这些方向去和 Claude Code/Codex/Workbuddy 竞争产品，而是延续了他们一以贯之的思路：开源、infra 化。　⁠•开源是把 harness 每一层都拆开开放出来，允许社区开发者一起接受优化　⁠•Infra 化的发布形式提高了使用门槛，避免出现像 Openclaw 那种项目复杂度膨胀太快，最终无法维护的情况。　⁠2.我们可以从三个层面理解 DSH 这次发布：　⁠•第一层是可直接使用的 coding agent，以本地 Web UI 为主要快速入口。这个交互形态的选择能看出开发者 preview 的目的，没有去做完整的桌面端/ TUI。使用起来和 ds 模型适配度很高，能感觉到同一个任务 ds 模型在 dsh 中和比直接用裸模型/其他 harness 更强。　⁠•第二层是 everything-is-a-plugin 的 harness 构造框架。这里面的核心能力都可以自定义，包括其他 agent 中最核心的 agent loop。　⁠•第三层是 Cordis 是一套底层的 meta-framework，能够让插件真正做到热重载、自由组合，以及彻底的遗忘和删除。　⁠3.DSH 的 Cordis plugin 不好直接去类比 MCP/Skills。它更像是 Claude Code 的 hooks、MCP、subagents 和内部核心 loop 全部统一了成一种插件机制。Cordis 解决的是动态组合问题，让组件能在依赖出现/消失时重组，并在卸载时撤回由 context 管理的副作用。注重可组合性和生态扩展性，这让 DSH 有点像早期的 Unix，拥有了类似 OS 的高潜力上限。　⁠4.这次发布的 coding agent 有四个模式，其中 Creator 模式值得关注。它的形式比较像一个交互式 Agent Foundry：允许开发者指导 agent 检查当前 runtime 试验插件，并创作新的 Agent preset 形式。虽然还不是自进化系统，但可以收集 agent 用来学习自进化的数据。 官方同时明确鼓励社区创建与分发第三方插件，因此 Creator mode 也可能成为其插件生态的创作入口。　⁠5.DSH 更长期的目标用户，很可能会为 To Developer 走向 To Agent。它把 harness 做成了对 agent 可以修改、热重载的对象，并不是为了服务现在的 coding agent 需求，而是服务未来下一代的自进化和持续学习框架。有了 DSH 之后，我们愈发能想象下一代 agent 会在 long horizon task 中，一边执行任务，一边更换支撑自身运行的部件，就像一艘持续航行的忒修斯之船。　⁠6.Anthropic Claude Code 与 Deepseek DSH 代表了两种不同的 Harness 研究重点：　⁠•Anthropic 是为了在当前范式下做出一个最好的 agent 产品，目标是最有效、简单，同时最大化模型能力边界的 harness。Deepseek 是在押注下一个范式，因此直接把替换、组合和撤销 harness component 作为首要的假设来进行设计。　⁠•Claude Code 希望做成做端到端的垂直整合产品，来给自己 API 依赖的商业模式增加用户粘性；而 DSH 则是目标完全开放给开发者的。　⁠•因此可以认为 Anthropic/OpenAI 和 deepseek 在研究两个不同的问题：　⁠1）A/O 研究的是 Harness 本身的能力：已有 SOTA 模型应该如何设计 harness 架构，比如 agent loop、subagent 架构来让 harness 表现得最好？　⁠2）Deepseek 在研究的是 Harness 的可塑性：harness 是流动的，一直会被模型内化和重写，那么最重要的就是如何最有效的修改、替换、撤销 harness 中的组件变化？这个问题更接近于 meta harness。　⁠7.DSH 已经提供了 agent runtime self-modification 的底座，但距离真正的 self-evolve 缺少一个完整的学习闭环，需要 有 Learning Loop 来学习并提出修改、Eval 评估修改的有效性。因此当前其实是 Harness-level RSI 的第一步，自身拆成可定位、可替换的组件。　⁠　⁠02.DSH 这次发布了什么？　⁠从产品表面看，DeepSeek Harness（DSH）是一个带本地 Web UI 的 Coding Agent。　⁠官方设置了四个模式，也允许开发者去贡献配置更多模式：　⁠　⁠•80% 的任务用标准模式：能力完整、行为可预测，也最容易排错。　⁠•PTC / Code 模式适合工具调用密集的任务：模型不再逐个调用工具，而是先生成一段 TypeScript，再通过run_code调用多个工具。批量分析、跨文件检索、重复操作时收益最大；任务简单时反而可能增加调试成本。　⁠•极简模式是实验室环境：它只保留 Bash 和编辑器，许多便利能力都没有。它的价值在于控制变量：帮助研究者区分能力来自模型本身，还是来自 Harness 的帮助。　⁠•创造模式的核心用途是“造 Agent”：这个模式值得关注，它保留了标准模式的能力，同时允许 Agent 检查 Cordis Runtime、实验新的 Plugin，并编写新的 Preset。创造模式具有更高权限，更适合 Harness 开发和隔离实验。　⁠我们可以把这次发布分为三层去拆解：　⁠1.Coding agent　⁠DSH 没有把 Terminal-first TUI 或桌面端作为主要产品形态，而是选择了更像开发者 Demo 的本地 Web UI。标准模式已经包含真实编程工作需要的主要能力，包括执行命令、修改和搜索文件、调用 Skills、维护计划与目标、启动子代理，以及运行工作流。系统还提供 Context Compaction、会话持久化、Sandbox 和权限审批。　⁠2.Harness construction framework　⁠DSH 不只允许开发者“增加一个 Tool”。Model Adapter、Tool Registry、Sandbox Policy、Subagent Backend，甚至默认 Agent Loop，都可以由 Cordis Plugin 提供。这些组件通过 ctx.llm、ctx.tools、ctx.sandbox、ctx.agentLoop 等稳定的 Service Key 协作，而不是直接 Import 某个具体实现。开发者因此可以替换一个能力的 Provider，同时尽量保持其他组件不变。　⁠3.Cordis meta-framework　⁠Cordis 进一步解决的是：这些组件怎样加入、删除和重新组合，能够不把正在运行的系统破坏掉。　⁠多数 Agent 插件系统主要关心怎样增加功能：安装更多 Tool、Skill 和 MCP。但组件不断增加后，系统也会积累更多 Tool Schema 和依赖关系。模型需要在更多能力之间进行选择，很多人在 Claude Code 中遇到过 Skills 过多后反而效果变差的情况。　⁠这里可以把这种现象理解为一种工程上的“熵增”：系统不断增加能力，却缺少对应的删除和重组机制。这个问题与 Continual Learning 中“记忆与遗忘”的关系有一定相似性。这也是 Cordis 论文 A Programming Paradigm for Spatiotemporal Composability 讨论的核心问题。论文把插件的动态组合拆成两个相互独立的维度来解决。　⁠•时间可组合性 Temporal Composability，是解决处理组件的退出。　⁠一个 Plugin 加载时，可能注册 Tool、Prompt Section、Event Listener、Timer 和 Service。如果只删除插件代码，这些已经进入 Runtime 的状态可能继续存在，形成无法正常清理的“幽灵组件”。Cordis 要求组件在注册 Effect 时，同时提供对应的撤销方式。注册 Tool 时记录怎样注销 Tool，增加 Prompt 时记录怎样移除 Prompt，启动 Timer 时记录怎样停止 Timer。组件卸载后，Runtime 会撤销它在 Context 中留下的 Effect。　⁠•空间可组合性 Spatial Composability 处理组件之间的依赖。　⁠组件不直接绑定某个实现，而是声明自己需要什么 Service。当依赖尚未出现时，组件保持 Waiting；依赖满足后，组件进入 Active；正在使用的 Service 消失或被替换后，组件先撤销自己的 Effect，再根据新的依赖关系重新激活。　⁠因此从产品气质看，当前的 DSH 更接近早期 Unix：默认体验比较粗糙，但底层结构更开放，也允许开发者深入修改。Claude Code 和 Codex 就更像整合度很高的 Windows。　⁠当然这种开放也需要有更长期主义的耐心。“一切可替换”只有在存在足够多、足够稳定的替代组件时才有价值。DSH 当前的 Plugin 生态和状态管理仍处于早期阶段，理解和修改整个项目的门槛也很高，短期内很难直接和 Claude Code、Codex 产生替代关系。　⁠　⁠03.DSH 与 Anthropic harness 是两种不同的 Harness 哲学　⁠如果我们用一个简单的框架理解 Agent：　⁠•Agent = Model + Harness　⁠•Harness = orchestration + context/memory/state + permissions + tools/sandbox/recovery　⁠我们可以发现，Anthropic 与 DeepSeek 的差异并不只是组件设计不同，而是二者在优化不同的目标：　⁠　⁠Anthropic Claude Code： 不断试验，优化 Agent 行为　⁠我们阅读 Anthropic 关于 Agent Harness 的技术文章，会发现他们的 Long-horizon Agent 研究通常从 SOTA 模型的能力边界和失败模式出发，再去设计和验证相应的 Harness 机制。例如：　⁠•通过 initializer agent、coding agent 和跨 Session 的 Artifact Handoff，解决长任务中的状态丢失；　⁠•通过 planner、generator 和 evaluator 分工，解决任务规划不足和模型自我评价偏高的问题；　⁠•通过 Context Reset 与 Compaction，缓解 Context 污染和长任务中的连贯性下降；　⁠•通过任务分解、测试反馈和 Scalable Evaluator，控制执行范围，并让每一步都可以被自动验收；　⁠•随着模型能力提升，通过 Ablation 删除不再必要的 Scaffolding。　⁠Boris Cherny 的 YC 访谈中提到，Opus 5 发布后，Claude Code 删除了超过 80% 的 System Prompt。每当新模型发布，团队都会以清空 System Prompt 的 Ablation 作为实验基线，重新运行真实任务；只有当模型反复出现同一种失败时，才逐行加回必要指令。他们也会持续调整 Tool Set，并删除不再提供能力增益的 Harness Code。　⁠Anthropic 的方法很像实证科学。团队先观察当前模型在真实任务中的能力边界，再针对反复出现的失败设计 Harness。每个 Harness Component 都对应一个关于“模型当前无法独立完成什么”的假设；模型进步后，这些假设可能过期，因此需要通过 Eval 和 Ablation 重新验证优化。　⁠DSH：从可变性出发，打造万物可插拔的 Harness　⁠对比以上 Anthropic 的实证研究思路，DSH更像从理论研究的视角想去第一性的解决一个目标问题，也就是Harness 能否被低成本地修改的问题，最终是在设计一个能够持续修改迭代 Harness 的Meta Harness，应该：　⁠•替换一个 harness component　⁠•撤销旧 component 的副作用　⁠•出现修改时重新解析依赖　⁠•让不同 session 使用不同 composition　⁠•让 agent 检查和编写新的 preset/plugin　⁠因此 Anthropic 优化的是当下时间点的最佳结果，DSH 优化的是未来持续探索不同结果的能力。这让我们觉得 Deepseek 更像是想制造一套 Harness Evolution 的操作系统，而不是直接给出一套固定的最佳 Harness。　⁠　⁠04.DSH 的短期用户是开发者，长期用户是 Agent 自己　⁠DSH 当前的产品形态更像开发者预览版，而不是面向普通用户的成熟 Coding Agent。它没有优先打磨 Terminal UI、桌面端和开箱即用的工作流，而是把主要精力放在一个可以被深度修改的 Runtime 上。　⁠对普通用户来说，产品体验是比较粗糙的，不如 Claude Code 或 Codex 好用；但对 Agent Developer 来说，这意味着系统的大部分结构都可以重新组合。开发者可以在 DSH 上替换 Memory、Tool、Sandbox、权限策略和 UI，甚至更换 Agent Loop。最终做出来的产品可能完全看不出原始 DSH 的形态。因此，DSH 短期内更像一个 Agent 开发底座：它不直接交付唯一的最佳产品，而是让开发者基于同一个内核创造不同的 Agent。　⁠它更长期的想象空间，是让 Agent 逐渐成为 Harness 的使用者和修改者。Agent 要改进自己的 Harness，首先必须看懂自己运行在什么系统里。把 Harness 拆成命名清晰、依赖明确的 Component，相当于为 Agent 提供了一张系统地图：它可以定位问题，找到相关组件，再提出局部修改。　⁠这也是插件化的真正意义。它不仅方便开发者扩展功能，也把原本开放式的软件修改，变成了一组边界更明确的操作。Agent 不需要重写整个系统，而是可以尝试替换任何一个组件。如果实验失败，系统还可以卸载插件并恢复原来的组合。自我修改因此从一次高风险的整体重写，变成一系列可以测试和回滚的局部实验。　⁠其中的 Creator Mode 像是连接开发者与 Agent 的过渡形态。今天是开发者指导 Agent 创建新的 Plugin；这些过程未来可能变成训练数据，让模型学习如何设计和改进自己的 Harness。让 Agent 真正成为 Harness 的用户：它不仅调用 Harness 提供的工具，也开始操作 Harness 本身。　⁠未来，人类与 Agent 的分工可能发生变化。开发者不再直接决定每个 Session 使用哪些 Tool，而是负责定义允许修改的范围、可靠的 Eval，以及安全边界。Agent 则在这些边界内不断尝试更适合当前任务的 Harness。　⁠　⁠05.插件机制，DSH 的核心　⁠在 DSH 中，插件是一个可以独立安装、替换和撤销的 Harness 组件。它可以小到一个主题或工具，也可以深入到 Memory、Model Adapter、Sandbox，甚至 Agent Loop。只要遵循 DSH 的统一接口，一个 Harness 组件就可以被封装成插件。　⁠MCP、Skills、Hooks 和 Subagent 定义了某些具体能力或使用方式，DSH 插件则定义了这些能力如何接入整个 Harness。一个插件既可以封装 MCP 或 Skill，也可以包含一套完整的软件模块，改变 Agent 的运行方式。　⁠DSH 通过完全开源的方式拥抱社区。DSH 内核负责维持接口、依赖关系和插件生命周期，社区则在外围快速创新。这样既能避免大量 Pull Request 直接进入核心仓库，也能降低维护不同社区方案的成本。　⁠这种架构很快带来了生态增长。截至 8 月 19 日，GitHub 的 dsh-plugin Topic 聚合了约 7,700 个仓库。经过社区筛选的 awesome-dsh-plugin 已经收录约 1,500 个可通过 dsh plugin add 安装的插件，并获得约 9,200 Stars、1,350 Forks，仓库累计超过 1,800 次提交。　⁠　⁠从分类看，目前最集中的方向主要有两类。一类是在补充产品体验，例如 Web UI、桌面端、状态监控和交互组件；另一类是在接入外部 Agent 能力，例如长期记忆、Browser、Vision、Sandbox 和 Workflow。这意味着 DSH 正在成为外部 Agent Infra 接入用户 Runtime 的适配层。对于 Agent Infra 创业者，短期可以借助 DSH 获得分发和用户反馈；长期则要面对接口变化、平台依赖，以及同类插件快速竞争的风险。　⁠围绕插件的分发基础设施也开始形成，比如 dsh-market 提供插件搜索、安装和升级，dsh-find-plugin 则允许 Agent 在对话中主动寻找插件。社区不只在开发插件，也开始建设插件发现、安装和管理的完整链路。　⁠从这个角度看，DSH 的插件生态不只是一个应用商店，而是一个开放的 Harness 搜索空间。不同开发者可以并行尝试不同的 Memory、Tool、Workflow 和 Agent Loop。更长期的目标，则是让 Agent 自己读取、编写、测试和选择插件，通过改变 Harness 来改善自身行为。　⁠　⁠06.离真正的 self-evolve harness 还有多远　⁠难点 1: 保持系统自身的稳定性　⁠在 Agent 修改自身配置时，一个经典的痛点是如何保持自身稳定，避免 Agent 在修改配置、工具或核心代码时破坏自己的运行环境。这类风险已经出现在 Hermes、OpenClaw 等允许 Agent 修改自身配置的系统中。　⁠更复杂的 Self-Evolution 不能依赖“修改完成后重启”。它需要支持系统一边运行，一边替换支撑自身运行的组件。这就是Cordis 想核心实现的热重载：不关闭整个进程，也不重启完整的 Agent，而是在 Runtime 中卸载旧组件、清理它留下的状态，再加载新的实现。　⁠DSH 这套插件机制的价值，不只是“方便替换组件”，而是把一次危险的全局修改缩小成有边界的 Component Mutation。Agent 可以复制当前状态，在隔离的 Context 或 Sandbox 中修改一个 Plugin，通过热重载加载候选版本，再决定采用还是撤销。　⁠Cordis 将不同的 Harness 能力组织成具有统一生命周期的 Plugin。每个 Plugin 注册的 Service、Tool 和 Event Listener，都会被记录为该 Plugin 拥有的 Effect。当 Plugin 被卸载时，这些受 Cordis 管理的 Effect 会随之撤销。它还会持续跟踪组件之间的依赖关系。如果一个 Service 被卸载，依赖它的 Plugin 会暂时退出运行，避免继续使用失效的引用。新的 Service 加载完成后，这些依赖组件再基于新实现重新启动。　⁠这可以被理解为类比为数据库中的 Transactional Harness Mutation。一次 Harness 修改像数据库事务，更好的状态管理，使 Agent 能够在不摧毁自身的情况下进行更多 Harness-level RSI 实验。目前 Cordis 距离稳定的自我修改系统，还需要一套更完整的状态管理。　⁠难点 2: 持续可靠的 eval　⁠Harness 能生成修改不等于自我改进。只有系统能够判断哪些修改真的更好，并把它们保留下来，Self-Mutation 才会变成 Self-Improvement。　⁠从工程实现上来说，如果一个问题能够被低成本、稳定地评价，解决问题就可以被转化为搜索和优化。系统不断生成候选方案，运行 Eval，保留更好的版本，再进入下一轮迭代。测试充分的代码任务、Kernel 优化和棋类游戏之所以容易形成自动改进闭环，就是因为结果相对容易验证。　⁠DSH 的 Creator Mode 可能是一个重要的数据入口。Create Agent 可以检查当前 Runtime，复制已有 Preset，修改 Cordis Composition，并生成一个可以被其他 Session 加载的新 Agent。这个过程可以产生 Harness Patch、修改理由和人工反馈，为未来构建 Eval Suite 提供原始材料。　⁠但创作轨迹本身还不是可靠的 Eval。开发者接受一个 Preset，不代表它在其他任务上也更好。系统还需要记录新旧版本的对照结果，并通过 Held-out Tasks、Regression Test 和 Canary Deployment 检查改进能否迁移、是否带来能力退化。Create Mode 解决了一部分候选生成和数据积累问题，但距离持续可靠的 Eval System 仍然很远。　⁠真正的 Self-Evolving Harness 需要一套完整的 Learning Loop　⁠　⁠目前 Cordis 解决的主要仍是 “Harness 能否被更可控地调整”。它不知道为什么应该替换 Agent Loop，也不能判断新 Loop 是否真正提高了整体能力。它提供了运行和管理候选方案的底座，却没有完成问题诊断和效果的自动化评估。　⁠但这是一个很好的开始。Cordis 先解决了“系统能不能在不破坏自身的情况下修改 Harness”，让更多 Harness-level RSI 实验成为可能。下一步，才是让系统从这些实验中持续学习，并把有效的修改保留下来。　⁠　⁠07.从 DSH 展望未来的 RSI　⁠RSI 是AI 能否越来越擅长改进自己。核心是递归反馈：上一轮改进不仅提高了任务表现，也提高了系统下一轮发现问题、设计实验和产生改进的能力。其中又可以定义为两类：　⁠•一类是模型开发过程中的迭代 Model-level RSI。随着 Compute 和模型能力提高，交付下一单位智能所需要的 Researcher 数量是否持续下降。　⁠•另一类是 Agent 在工作中是否能够持续变好 Harness-level RSI。随着一个 long horizon task 任务执行深度增加，是否能够更好地改进自身来完成任务。DSH 在解决的就是这类问题。　⁠可以作为一个现实的观察指标。今天的 Coding Agent 已经能够承担代码实现、实验执行和结果分析等工作，Researcher 则逐渐转向选择方向、定义 Objective 和判断结果。我们正在看到 Research Automation 向初级 RSI 过渡：模型开始进入生产下一代模型和系统的流程，但整个改进方向仍然主要由人决定。　⁠RSI 也不一定从模型直接修改自己的 Weights 开始。Lilian Weng 认为，一条更现实的近期路径，是先把模型外部的 Harness 变成优化对象。优化范围会从 Prompt 和 Structured Context，逐渐扩展到 Workflow、Harness Code，最终可能进入负责优化 Harness 的 Optimizer Code。此时，系统改进的不再只是一次任务的答案，而是“如何获得更好答案的方法”。　⁠放到 Harness 层面，RSI 也不只是让 Agent 为自己写一个新 Tool。它需要形成一个完整过程：Agent 从任务轨迹中发现稳定的失败模式，判断问题来自 Memory、Tool、Context Management 还是 Agent Loop，提出新的 Harness 方案，再通过独立 Eval 判断新方案是否真的更好。验证有效的方案被保留，并成为下一轮任务和改进实验的起点。　⁠这有点像一艘持续航行的忒修斯之船。Agent 一边执行任务，一边更换支撑自身运行的部件。但真正重要的是每次更换之后，它是否能航行更快，也更好判断下一次应该更换什么。　⁠这里首先需要解决的是 Harness 的可理解性。Harness 的组件彼此依赖，修改一个部分会牵一发动全身。Agent 如果不知道系统由哪些部分组成，也不知道一次失败对应哪个组件，就很难安全地改进自己。Harness 内部还存在复杂依赖，一次 Agent Loop 的变化可能同时影响 Tool、Prompt 和 Context State。　⁠DSH 解决这个问题的方式是插件化和热重载。它通过 Cordis 把 Harness 组织成边界相对明确的 Component，使 Agent 能够查看系统结构，定位相关能力，并尝试调整 Memory、Tool、Workflow 或 Agent Loop。Plugin 不只是扩展功能的接口，也让原本隐藏在 Runtime 内部的 Harness 变成一个显式的优化空间。　⁠如果未来 Agent 能继续优化这套选择机制，让 Agent 修改进一步提高了 Agent 诊断失败、提出方案和设计 Eval 的能力，使后一轮改进比前一轮更有效，就能走向真正的Harness-level RSI。关于更广范围的 RSI 与持续学习，我们后续还会发布研究，继续分享对新范式的理解。　⁠



作者：Cage、Daniel



作者：Cage、Daniel



⁠/⁠



01.Key Takeaways



01.



## Key Takeaways



⁠



1.DeepSeek Harness（DSH）发布的是一套可以热重载的 harness ，并且设计成适合 coding agent 自己去修改、进化的形态。这个发布思路很有野心，没有在白领工作/coding agent 这些方向去和 Claude Code/Codex/Workbuddy 竞争产品，而是延续了他们一以贯之的思路：开源、infra 化。



⁠



•开源是把 harness 每一层都拆开开放出来，允许社区开发者一起接受优化



⁠



•Infra 化的发布形式提高了使用门槛，避免出现像 Openclaw 那种项目复杂度膨胀太快，最终无法维护的情况。



⁠



2.我们可以从三个层面理解 DSH 这次发布：



⁠



•第一层是可直接使用的 coding agent，以本地 Web UI 为主要快速入口。这个交互形态的选择能看出开发者 preview 的目的，没有去做完整的桌面端/ TUI。使用起来和 ds 模型适配度很高，能感觉到同一个任务 ds 模型在 dsh 中和比直接用裸模型/其他 harness 更强。



⁠



•第二层是 everything-is-a-plugin 的 harness 构造框架。这里面的核心能力都可以自定义，包括其他 agent 中最核心的 agent loop。



⁠



•第三层是 Cordis 是一套底层的 meta-framework，能够让插件真正做到热重载、自由组合，以及彻底的遗忘和删除。



⁠



3.DSH 的 Cordis plugin 不好直接去类比 MCP/Skills。它更像是 Claude Code 的 hooks、MCP、subagents 和内部核心 loop 全部统一了成一种插件机制。Cordis 解决的是动态组合问题，让组件能在依赖出现/消失时重组，并在卸载时撤回由 context 管理的副作用。注重可组合性和生态扩展性，这让 DSH 有点像早期的 Unix，拥有了类似 OS 的高潜力上限。



⁠



4.这次发布的 coding agent 有四个模式，其中 Creator 模式值得关注。它的形式比较像一个交互式 Agent Foundry：允许开发者指导 agent 检查当前 runtime 试验插件，并创作新的 Agent preset 形式。虽然还不是自进化系统，但可以收集 agent 用来学习自进化的数据。 官方同时明确鼓励社区创建与分发第三方插件，因此 Creator mode 也可能成为其插件生态的创作入口。



⁠



5.DSH 更长期的目标用户，很可能会为 To Developer 走向 To Agent。它把 harness 做成了对 agent 可以修改、热重载的对象，并不是为了服务现在的 coding agent 需求，而是服务未来下一代的自进化和持续学习框架。有了 DSH 之后，我们愈发能想象下一代 agent 会在 long horizon task 中，一边执行任务，一边更换支撑自身运行的部件，就像一艘持续航行的忒修斯之船。



⁠



6.Anthropic Claude Code 与 Deepseek DSH 代表了两种不同的 Harness 研究重点：



⁠



•Anthropic 是为了在当前范式下做出一个最好的 agent 产品，目标是最有效、简单，同时最大化模型能力边界的 harness。Deepseek 是在押注下一个范式，因此直接把替换、组合和撤销 harness component 作为首要的假设来进行设计。



⁠



•Claude Code 希望做成做端到端的垂直整合产品，来给自己 API 依赖的商业模式增加用户粘性；而 DSH 则是目标完全开放给开发者的。



⁠



•因此可以认为 Anthropic/OpenAI 和 deepseek 在研究两个不同的问题：



⁠



1）A/O 研究的是 Harness 本身的能力：已有 SOTA 模型应该如何设计 harness 架构，比如 agent loop、subagent 架构来让 harness 表现得最好？



⁠



2）Deepseek 在研究的是 Harness 的可塑性：harness 是流动的，一直会被模型内化和重写，那么最重要的就是如何最有效的修改、替换、撤销 harness 中的组件变化？这个问题更接近于 meta harness。



⁠



7.DSH 已经提供了 agent runtime self-modification 的底座，但距离真正的 self-evolve 缺少一个完整的学习闭环，需要 有 Learning Loop 来学习并提出修改、Eval 评估修改的有效性。因此当前其实是 Harness-level RSI 的第一步，自身拆成可定位、可替换的组件。



⁠



⁠



02.DSH 这次发布了什么？



02.



## DSH 这次发布了什么？



⁠



从产品表面看，DeepSeek Harness（DSH）是一个带本地 Web UI 的 Coding Agent。



⁠



官方设置了四个模式，也允许开发者去贡献配置更多模式：



⁠



⁠



•80% 的任务用标准模式：能力完整、行为可预测，也最容易排错。



⁠



•PTC / Code 模式适合工具调用密集的任务：模型不再逐个调用工具，而是先生成一段 TypeScript，再通过run_code调用多个工具。批量分析、跨文件检索、重复操作时收益最大；任务简单时反而可能增加调试成本。



⁠



•极简模式是实验室环境：它只保留 Bash 和编辑器，许多便利能力都没有。它的价值在于控制变量：帮助研究者区分能力来自模型本身，还是来自 Harness 的帮助。



⁠



•创造模式的核心用途是“造 Agent”：这个模式值得关注，它保留了标准模式的能力，同时允许 Agent 检查 Cordis Runtime、实验新的 Plugin，并编写新的 Preset。创造模式具有更高权限，更适合 Harness 开发和隔离实验。



⁠



我们可以把这次发布分为三层去拆解：



⁠



1.Coding agent



⁠



DSH 没有把 Terminal-first TUI 或桌面端作为主要产品形态，而是选择了更像开发者 Demo 的本地 Web UI。标准模式已经包含真实编程工作需要的主要能力，包括执行命令、修改和搜索文件、调用 Skills、维护计划与目标、启动子代理，以及运行工作流。系统还提供 Context Compaction、会话持久化、Sandbox 和权限审批。



⁠



2.Harness construction framework



⁠



DSH 不只允许开发者“增加一个 Tool”。Model Adapter、Tool Registry、Sandbox Policy、Subagent Backend，甚至默认 Agent Loop，都可以由 Cordis Plugin 提供。这些组件通过 ctx.llm、ctx.tools、ctx.sandbox、ctx.agentLoop 等稳定的 Service Key 协作，而不是直接 Import 某个具体实现。开发者因此可以替换一个能力的 Provider，同时尽量保持其他组件不变。



⁠



3.Cordis meta-framework



⁠



Cordis 进一步解决的是：这些组件怎样加入、删除和重新组合，能够不把正在运行的系统破坏掉。



⁠



多数 Agent 插件系统主要关心怎样增加功能：安装更多 Tool、Skill 和 MCP。但组件不断增加后，系统也会积累更多 Tool Schema 和依赖关系。模型需要在更多能力之间进行选择，很多人在 Claude Code 中遇到过 Skills 过多后反而效果变差的情况。



⁠



这里可以把这种现象理解为一种工程上的“熵增”：系统不断增加能力，却缺少对应的删除和重组机制。这个问题与 Continual Learning 中“记忆与遗忘”的关系有一定相似性。这也是 Cordis 论文 A Programming Paradigm for Spatiotemporal Composability 讨论的核心问题。论文把插件的动态组合拆成两个相互独立的维度来解决。



⁠



•时间可组合性 Temporal Composability，是解决处理组件的退出。　⁠一个 Plugin 加载时，可能注册 Tool、Prompt Section、Event Listener、Timer 和 Service。如果只删除插件代码，这些已经进入 Runtime 的状态可能继续存在，形成无法正常清理的“幽灵组件”。Cordis 要求组件在注册 Effect 时，同时提供对应的撤销方式。注册 Tool 时记录怎样注销 Tool，增加 Prompt 时记录怎样移除 Prompt，启动 Timer 时记录怎样停止 Timer。组件卸载后，Runtime 会撤销它在 Context 中留下的 Effect。　⁠•空间可组合性 Spatial Composability 处理组件之间的依赖。　⁠组件不直接绑定某个实现，而是声明自己需要什么 Service。当依赖尚未出现时，组件保持 Waiting；依赖满足后，组件进入 Active；正在使用的 Service 消失或被替换后，组件先撤销自己的 Effect，再根据新的依赖关系重新激活。



•时间可组合性 Temporal Composability，是解决处理组件的退出。



⁠



一个 Plugin 加载时，可能注册 Tool、Prompt Section、Event Listener、Timer 和 Service。如果只删除插件代码，这些已经进入 Runtime 的状态可能继续存在，形成无法正常清理的“幽灵组件”。Cordis 要求组件在注册 Effect 时，同时提供对应的撤销方式。注册 Tool 时记录怎样注销 Tool，增加 Prompt 时记录怎样移除 Prompt，启动 Timer 时记录怎样停止 Timer。组件卸载后，Runtime 会撤销它在 Context 中留下的 Effect。



⁠



•空间可组合性 Spatial Composability 处理组件之间的依赖。



⁠



组件不直接绑定某个实现，而是声明自己需要什么 Service。当依赖尚未出现时，组件保持 Waiting；依赖满足后，组件进入 Active；正在使用的 Service 消失或被替换后，组件先撤销自己的 Effect，再根据新的依赖关系重新激活。



⁠



因此从产品气质看，当前的 DSH 更接近早期 Unix：默认体验比较粗糙，但底层结构更开放，也允许开发者深入修改。Claude Code 和 Codex 就更像整合度很高的 Windows。



⁠



当然这种开放也需要有更长期主义的耐心。“一切可替换”只有在存在足够多、足够稳定的替代组件时才有价值。DSH 当前的 Plugin 生态和状态管理仍处于早期阶段，理解和修改整个项目的门槛也很高，短期内很难直接和 Claude Code、Codex 产生替代关系。



⁠



⁠



03.DSH 与 Anthropic harness 是两种不同的 Harness 哲学



03.



## DSH 与 Anthropic harness 是两种不同的 Harness 哲学



⁠



如果我们用一个简单的框架理解 Agent：



⁠



•Agent = Model + Harness



⁠



•Harness = orchestration + context/memory/state + permissions + tools/sandbox/recovery



⁠



我们可以发现，Anthropic 与 DeepSeek 的差异并不只是组件设计不同，而是二者在优化不同的目标：



⁠



⁠



## Anthropic Claude Code： 不断试验，优化 Agent 行为



⁠



我们阅读 Anthropic 关于 Agent Harness 的技术文章，会发现他们的 Long-horizon Agent 研究通常从 SOTA 模型的能力边界和失败模式出发，再去设计和验证相应的 Harness 机制。例如：



⁠



•通过 initializer agent、coding agent 和跨 Session 的 Artifact Handoff，解决长任务中的状态丢失；



⁠



•通过 planner、generator 和 evaluator 分工，解决任务规划不足和模型自我评价偏高的问题；



⁠



•通过 Context Reset 与 Compaction，缓解 Context 污染和长任务中的连贯性下降；



⁠



•通过任务分解、测试反馈和 Scalable Evaluator，控制执行范围，并让每一步都可以被自动验收；



⁠



•随着模型能力提升，通过 Ablation 删除不再必要的 Scaffolding。



⁠



Boris Cherny 的 YC 访谈中提到，Opus 5 发布后，Claude Code 删除了超过 80% 的 System Prompt。每当新模型发布，团队都会以清空 System Prompt 的 Ablation 作为实验基线，重新运行真实任务；只有当模型反复出现同一种失败时，才逐行加回必要指令。他们也会持续调整 Tool Set，并删除不再提供能力增益的 Harness Code。



⁠



Anthropic 的方法很像实证科学。团队先观察当前模型在真实任务中的能力边界，再针对反复出现的失败设计 Harness。每个 Harness Component 都对应一个关于“模型当前无法独立完成什么”的假设；模型进步后，这些假设可能过期，因此需要通过 Eval 和 Ablation 重新验证优化。



⁠



## DSH：从可变性出发，打造万物可插拔的 Harness



⁠



对比以上 Anthropic 的实证研究思路，DSH更像从理论研究的视角想去第一性的解决一个目标问题，也就是Harness 能否被低成本地修改的问题，最终是在设计一个能够持续修改迭代 Harness 的Meta Harness，应该：



⁠



•替换一个 harness component



⁠



•撤销旧 component 的副作用



⁠



•出现修改时重新解析依赖



⁠



•让不同 session 使用不同 composition



⁠



•让 agent 检查和编写新的 preset/plugin



⁠



因此 Anthropic 优化的是当下时间点的最佳结果，DSH 优化的是未来持续探索不同结果的能力。这让我们觉得 Deepseek 更像是想制造一套 Harness Evolution 的操作系统，而不是直接给出一套固定的最佳 Harness。



⁠



⁠



04.DSH 的短期用户是开发者，长期用户是 Agent 自己



04.



## DSH 的短期用户是开发者，长期用户是 Agent 自己



⁠



DSH 当前的产品形态更像开发者预览版，而不是面向普通用户的成熟 Coding Agent。它没有优先打磨 Terminal UI、桌面端和开箱即用的工作流，而是把主要精力放在一个可以被深度修改的 Runtime 上。



⁠



对普通用户来说，产品体验是比较粗糙的，不如 Claude Code 或 Codex 好用；但对 Agent Developer 来说，这意味着系统的大部分结构都可以重新组合。开发者可以在 DSH 上替换 Memory、Tool、Sandbox、权限策略和 UI，甚至更换 Agent Loop。最终做出来的产品可能完全看不出原始 DSH 的形态。因此，DSH 短期内更像一个 Agent 开发底座：它不直接交付唯一的最佳产品，而是让开发者基于同一个内核创造不同的 Agent。



⁠



它更长期的想象空间，是让 Agent 逐渐成为 Harness 的使用者和修改者。Agent 要改进自己的 Harness，首先必须看懂自己运行在什么系统里。把 Harness 拆成命名清晰、依赖明确的 Component，相当于为 Agent 提供了一张系统地图：它可以定位问题，找到相关组件，再提出局部修改。



⁠



这也是插件化的真正意义。它不仅方便开发者扩展功能，也把原本开放式的软件修改，变成了一组边界更明确的操作。Agent 不需要重写整个系统，而是可以尝试替换任何一个组件。如果实验失败，系统还可以卸载插件并恢复原来的组合。自我修改因此从一次高风险的整体重写，变成一系列可以测试和回滚的局部实验。



⁠



其中的 Creator Mode 像是连接开发者与 Agent 的过渡形态。今天是开发者指导 Agent 创建新的 Plugin；这些过程未来可能变成训练数据，让模型学习如何设计和改进自己的 Harness。让 Agent 真正成为 Harness 的用户：它不仅调用 Harness 提供的工具，也开始操作 Harness 本身。



⁠



未来，人类与 Agent 的分工可能发生变化。开发者不再直接决定每个 Session 使用哪些 Tool，而是负责定义允许修改的范围、可靠的 Eval，以及安全边界。Agent 则在这些边界内不断尝试更适合当前任务的 Harness。



⁠



⁠



05.插件机制，DSH 的核心



05.



## 插件机制，DSH 的核心



⁠



在 DSH 中，插件是一个可以独立安装、替换和撤销的 Harness 组件。它可以小到一个主题或工具，也可以深入到 Memory、Model Adapter、Sandbox，甚至 Agent Loop。只要遵循 DSH 的统一接口，一个 Harness 组件就可以被封装成插件。



⁠



MCP、Skills、Hooks 和 Subagent 定义了某些具体能力或使用方式，DSH 插件则定义了这些能力如何接入整个 Harness。一个插件既可以封装 MCP 或 Skill，也可以包含一套完整的软件模块，改变 Agent 的运行方式。



⁠



DSH 通过完全开源的方式拥抱社区。DSH 内核负责维持接口、依赖关系和插件生命周期，社区则在外围快速创新。这样既能避免大量 Pull Request 直接进入核心仓库，也能降低维护不同社区方案的成本。



⁠



这种架构很快带来了生态增长。截至 8 月 19 日，GitHub 的 dsh-plugin Topic 聚合了约 7,700 个仓库。经过社区筛选的 awesome-dsh-plugin 已经收录约 1,500 个可通过 dsh plugin add 安装的插件，并获得约 9,200 Stars、1,350 Forks，仓库累计超过 1,800 次提交。



⁠



⁠



从分类看，目前最集中的方向主要有两类。一类是在补充产品体验，例如 Web UI、桌面端、状态监控和交互组件；另一类是在接入外部 Agent 能力，例如长期记忆、Browser、Vision、Sandbox 和 Workflow。这意味着 DSH 正在成为外部 Agent Infra 接入用户 Runtime 的适配层。对于 Agent Infra 创业者，短期可以借助 DSH 获得分发和用户反馈；长期则要面对接口变化、平台依赖，以及同类插件快速竞争的风险。



⁠



围绕插件的分发基础设施也开始形成，比如 dsh-market 提供插件搜索、安装和升级，dsh-find-plugin 则允许 Agent 在对话中主动寻找插件。社区不只在开发插件，也开始建设插件发现、安装和管理的完整链路。



⁠



从这个角度看，DSH 的插件生态不只是一个应用商店，而是一个开放的 Harness 搜索空间。不同开发者可以并行尝试不同的 Memory、Tool、Workflow 和 Agent Loop。更长期的目标，则是让 Agent 自己读取、编写、测试和选择插件，通过改变 Harness 来改善自身行为。



⁠



⁠



06.离真正的 self-evolve harness 还有多远



06.



## 离真正的 self-evolve harness 还有多远



⁠



## 难点 1: 保持系统自身的稳定性



⁠



在 Agent 修改自身配置时，一个经典的痛点是如何保持自身稳定，避免 Agent 在修改配置、工具或核心代码时破坏自己的运行环境。这类风险已经出现在 Hermes、OpenClaw 等允许 Agent 修改自身配置的系统中。



⁠



更复杂的 Self-Evolution 不能依赖“修改完成后重启”。它需要支持系统一边运行，一边替换支撑自身运行的组件。这就是Cordis 想核心实现的热重载：不关闭整个进程，也不重启完整的 Agent，而是在 Runtime 中卸载旧组件、清理它留下的状态，再加载新的实现。



⁠



DSH 这套插件机制的价值，不只是“方便替换组件”，而是把一次危险的全局修改缩小成有边界的 Component Mutation。Agent 可以复制当前状态，在隔离的 Context 或 Sandbox 中修改一个 Plugin，通过热重载加载候选版本，再决定采用还是撤销。



⁠



Cordis 将不同的 Harness 能力组织成具有统一生命周期的 Plugin。每个 Plugin 注册的 Service、Tool 和 Event Listener，都会被记录为该 Plugin 拥有的 Effect。当 Plugin 被卸载时，这些受 Cordis 管理的 Effect 会随之撤销。它还会持续跟踪组件之间的依赖关系。如果一个 Service 被卸载，依赖它的 Plugin 会暂时退出运行，避免继续使用失效的引用。新的 Service 加载完成后，这些依赖组件再基于新实现重新启动。



⁠



这可以被理解为类比为数据库中的 Transactional Harness Mutation。一次 Harness 修改像数据库事务，更好的状态管理，使 Agent 能够在不摧毁自身的情况下进行更多 Harness-level RSI 实验。目前 Cordis 距离稳定的自我修改系统，还需要一套更完整的状态管理。



⁠



## 难点 2: 持续可靠的 eval



⁠



Harness 能生成修改不等于自我改进。只有系统能够判断哪些修改真的更好，并把它们保留下来，Self-Mutation 才会变成 Self-Improvement。



⁠



从工程实现上来说，如果一个问题能够被低成本、稳定地评价，解决问题就可以被转化为搜索和优化。系统不断生成候选方案，运行 Eval，保留更好的版本，再进入下一轮迭代。测试充分的代码任务、Kernel 优化和棋类游戏之所以容易形成自动改进闭环，就是因为结果相对容易验证。



⁠



DSH 的 Creator Mode 可能是一个重要的数据入口。Create Agent 可以检查当前 Runtime，复制已有 Preset，修改 Cordis Composition，并生成一个可以被其他 Session 加载的新 Agent。这个过程可以产生 Harness Patch、修改理由和人工反馈，为未来构建 Eval Suite 提供原始材料。



⁠



但创作轨迹本身还不是可靠的 Eval。开发者接受一个 Preset，不代表它在其他任务上也更好。系统还需要记录新旧版本的对照结果，并通过 Held-out Tasks、Regression Test 和 Canary Deployment 检查改进能否迁移、是否带来能力退化。Create Mode 解决了一部分候选生成和数据积累问题，但距离持续可靠的 Eval System 仍然很远。



⁠



## 真正的 Self-Evolving Harness 需要一套完整的 Learning Loop



⁠



⁠



目前 Cordis 解决的主要仍是 “Harness 能否被更可控地调整”。它不知道为什么应该替换 Agent Loop，也不能判断新 Loop 是否真正提高了整体能力。它提供了运行和管理候选方案的底座，却没有完成问题诊断和效果的自动化评估。



⁠



但这是一个很好的开始。Cordis 先解决了“系统能不能在不破坏自身的情况下修改 Harness”，让更多 Harness-level RSI 实验成为可能。下一步，才是让系统从这些实验中持续学习，并把有效的修改保留下来。



⁠



⁠



07.从 DSH 展望未来的 RSI



07.



## 从 DSH 展望未来的 RSI



⁠



RSI 是AI 能否越来越擅长改进自己。核心是递归反馈：上一轮改进不仅提高了任务表现，也提高了系统下一轮发现问题、设计实验和产生改进的能力。其中又可以定义为两类：



⁠



•一类是模型开发过程中的迭代 Model-level RSI。随着 Compute 和模型能力提高，交付下一单位智能所需要的 Researcher 数量是否持续下降。



⁠



•另一类是 Agent 在工作中是否能够持续变好 Harness-level RSI。随着一个 long horizon task 任务执行深度增加，是否能够更好地改进自身来完成任务。DSH 在解决的就是这类问题。



⁠



可以作为一个现实的观察指标。今天的 Coding Agent 已经能够承担代码实现、实验执行和结果分析等工作，Researcher 则逐渐转向选择方向、定义 Objective 和判断结果。我们正在看到 Research Automation 向初级 RSI 过渡：模型开始进入生产下一代模型和系统的流程，但整个改进方向仍然主要由人决定。



⁠



RSI 也不一定从模型直接修改自己的 Weights 开始。Lilian Weng 认为，一条更现实的近期路径，是先把模型外部的 Harness 变成优化对象。优化范围会从 Prompt 和 Structured Context，逐渐扩展到 Workflow、Harness Code，最终可能进入负责优化 Harness 的 Optimizer Code。此时，系统改进的不再只是一次任务的答案，而是“如何获得更好答案的方法”。



⁠



放到 Harness 层面，RSI 也不只是让 Agent 为自己写一个新 Tool。它需要形成一个完整过程：Agent 从任务轨迹中发现稳定的失败模式，判断问题来自 Memory、Tool、Context Management 还是 Agent Loop，提出新的 Harness 方案，再通过独立 Eval 判断新方案是否真的更好。验证有效的方案被保留，并成为下一轮任务和改进实验的起点。



⁠



这有点像一艘持续航行的忒修斯之船。Agent 一边执行任务，一边更换支撑自身运行的部件。但真正重要的是每次更换之后，它是否能航行更快，也更好判断下一次应该更换什么。



⁠



这里首先需要解决的是 Harness 的可理解性。Harness 的组件彼此依赖，修改一个部分会牵一发动全身。Agent 如果不知道系统由哪些部分组成，也不知道一次失败对应哪个组件，就很难安全地改进自己。Harness 内部还存在复杂依赖，一次 Agent Loop 的变化可能同时影响 Tool、Prompt 和 Context State。



⁠



DSH 解决这个问题的方式是插件化和热重载。它通过 Cordis 把 Harness 组织成边界相对明确的 Component，使 Agent 能够查看系统结构，定位相关能力，并尝试调整 Memory、Tool、Workflow 或 Agent Loop。Plugin 不只是扩展功能的接口，也让原本隐藏在 Runtime 内部的 Harness 变成一个显式的优化空间。



⁠



如果未来 Agent 能继续优化这套选择机制，让 Agent 修改进一步提高了 Agent 诊断失败、提出方案和设计 Eval 的能力，使后一轮改进比前一轮更有效，就能走向真正的Harness-level RSI。关于更广范围的 RSI 与持续学习，我们后续还会发布研究，继续分享对新范式的理解。



⁠



⁠⁠⁠



⁠⁠⁠延伸阅读⁠Claude Tag 可能是一个 10x Claude Code 级别的产品›⁠无法蒸馏的美国市场，谁在分食 Frontier Labs 百亿美金数据预算？›⁠Agent Infra 赛道更新，一年后为 Agent 设计的基建发展如何？›⁠当 Agent 成为 coworker：如何为新物种设计身份系统？›⁠真实工作流，正在成为下一代训练数据›



⁠⁠⁠



延伸阅读



⁠Claude Tag 可能是一个 10x Claude Code 级别的产品›



Claude Tag 可能是一个 10x Claude Code 级别的产品



›



⁠无法蒸馏的美国市场，谁在分食 Frontier Labs 百亿美金数据预算？›



无法蒸馏的美国市场，谁在分食 Frontier Labs 百亿美金数据预算？



›



⁠Agent Infra 赛道更新，一年后为 Agent 设计的基建发展如何？›



Agent Infra 赛道更新，一年后为 Agent 设计的基建发展如何？



›



⁠当 Agent 成为 coworker：如何为新物种设计身份系统？›



当 Agent 成为 coworker：如何为新物种设计身份系统？



›



⁠真实工作流，正在成为下一代训练数据›



真实工作流，正在成为下一代训练数据



›

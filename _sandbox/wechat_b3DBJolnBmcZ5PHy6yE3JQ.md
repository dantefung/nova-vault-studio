---
title: "Coding Agent Goal 机制详解"
author: "haoran"
date: "2026年9月15日 15:25"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/b3DBJolnBmcZ5PHy6yE3JQ"
---

# Coding Agent Goal 机制详解

Coding Agent Goal 机制详解前两篇整理了 Claude Code 与 Codex 的 Memory 和上下文压缩Claude Code 与 Codex Memory 机制详解Claude Code 与 Codex 压缩机制详解这次接着聊 Goal我对比了 Kimi Code、Codex、DeepSeek Harness 和 Claude Code 的实现与文档。它们都在解决一个问题：如何让 Agent 持续地执行任务，直到目标完成？关于 Goal 我们要看三件事：• 目标如何保存• 如何判断目标达成或者应该终止• 下一轮如何自动启动Kimi Code、Codex、DeepSeek Harness 和 Claude Code 关于 Goal 机制的实现实在是大同小异，我把他们的流程串成主线，会在必要处提及他们的异同点。大家学习个思路即可。Goal 的整体流程先说一下 turn - 可以把它理解为 Agent 围绕一次输入持续工作的回合，其中可能调用多次模型和工具：用户输入  → 模型决定调用工具  → 程序执行工具，返回结果  → 模型继续思考和调用工具  → 模型输出最终回复，本轮结束比如让 Agent 完成一次数据库迁移。它改完数据访问层，跑了一部分测试，最后回复：“已经完成基础改造，接下来还需要适配接口层。”这时，一轮对话结束了，整个任务却还没完成。Goal 在外面增加了一层控制：设置并保存目标  → Agent 执行一轮  → 检查目标状态、完成情况和执行限制      ├─ 可以继续 → 提交后续输入，继续当前会话      └─ 应当停止 → 完成、暂停或记录阻塞上述 4 种 Coding Agent 都可以沿着这条主线理解。差异主要在于：状态怎么存、下一轮从哪里触发、任务完成由谁判断。Kimi Code、Codex 和 dsh 都提供了模型可以调用的 Goal 工具。Claude Code 则把完成检查交给额外的评估模型，后面单独展开。目标如何创建和保存#目标 Goal 状态用户看到的命令，与模型调用的工具，可以是两个入口。以 Kimi Code 为例，执行 /goal 完成数据库迁移 后，CLI 会调用 session.createGoal() 保存目标，再把目标文本作为输入交给 Agent。这个入口不需要先让模型调用一次 CreateGoal。模型侧仍有对应工具，其他入口或执行过程可以使用：项目模型侧的 Goal 工具值得注意的区别Kimi CodeCreateGoal、GetGoal、SetGoalBudget、UpdateGoal预算有独立设置工具Codexcreate_goal、get_goal、update_goal创建时可传 token 预算；模型更新只允许 complete 或 blockeddshcreate_goal、get_goal、update_goal创建时可传自动续轮上限；更新要带目标 ID 与 revision这些工具操作的都是程序中的状态。为了方便理解，可以简单概括成下面这样：目标：完成数据库迁移状态：active限制：允许消耗多少 tokens、执行多少轮或运行多久消耗：目前已经用了多少其中“任务完成了多少”与“资源消耗了多少”也要分开。完成进度通常需要模型判断，消耗则由程序计量。dsh 的 revision 是一个比较实用的细节。模型先读取 Goal，再带着版本号更新；如果目标在此期间被修改，旧版本的更新就不能直接覆盖新状态。#状态放在哪里上述提到的状态追踪了当前目标的进度以及消耗，它是需要放在内存中，以及持久化的，这样可以从一个旧 session 中进行恢复。Kimi Code 把 Goal 变化写进主 Agent 的持久化事件日志。主要是三个事件：goal.create：创建目标goal.update：更新状态、预算或累计消耗goal.clear：清除目标这些事件进入该 Session 下主 Agent 的 wire.jsonl。goal.update 可以只携带部分字段。例如一次更新 tokensUsed，另一次更新 status。恢复时需要按顺序应用事件，不能只拿最后一条 update 当成完整 Goal。dsh 也采用 Session 事件，但事件的组织不同。goal/change 保存目标的生命周期状态；自动续轮消息正式进入 Session 后，对应的 user/message 还会推进轮数。如果 Coding Agent 中途退出，是可以通过 session 文件中的这些事件推导出 goal 的真实状态。Codex 直接把当前 Goal 保存在 SQLite。Codex 是最与众不同的。它把 Goal 的各种状态追踪存储到了本地 Sqlite 中。数据库名是 goals_1.sqlite，thread_goals 表通过 thread_id 关联会话，保存目标、状态、token 预算与累计消耗等字段。读取时查询当前记录，不依赖重放聊天里的工具调用。Claude Code 的 Goal 存储字段与写入路径，我没有对应的新源码，暂不推断。Agent 停下来后，如何继续假设数据库迁移已经完成第一部分，Agent 正常结束了这一轮 turn， 但是 Goal 仍旧未完成。#轮次结束与空闲回调Kimi Code 的调用链比较直接，当前 turn 结束后：handleTurnEnded()  → 检查结束原因、当前目标与预算  → launchContinuationTurn()  → IAgentLoopService.submit({ message })提交的消息可以简化为：{  role: 'user',  content: [{ type: 'text', text: '继续推进当前目标……' }],  origin: { kind: 'system_trigger', name: 'goal_continuation' }}消息使用 user 角色，但来源明确标记为程序触发。就是以 user 的口吻，自动发一条消息给 Agent - 当前任务进度 xxx，请继续Codex 把续轮放在线程空闲阶段：on_turn_stop：结算本轮消耗  → on_thread_idle  → continue_if_idle()  → start_turn_if_idle(...)它从数据库读取 active Goal，检查是否允许自动继续，再把 Goal 提示词包装成内部上下文输入，启动下一轮。触发来源标记为 goal。dsh 则由独立的 goal-round-driver 插件负责：agent/status 变为 idle  → requestDrive()  → drive()  → agent.followup(message)它要求目标 active、自动执行已激活、没有竞争的待处理输入，并且尚未达到轮数上限。续轮消息的 source 中还带着 goalId、revision 和 round。这些检查有实际意义：自动续轮排队之后，用户可能已经修改目标或发送了新问题。dsh 会在消息进入执行前再次核对，避免旧的续轮请求继续生效。#Claude Code 的 Stop hookClaude Code 官方把 /goal 描述为 Session 级的 prompt-based Stop hook：在模型准备结束时进行评估，决定是否允许停止。通用 Stop hook 可以返回阻止停止的理由，再由程序反馈给模型继续执行。泄露的源码中能看到这项基础机制：stopHooks.ts 把阻塞理由包装成消息；query.ts 在允许继续的情况下，将它追加到上下文，再 continue 查询循环。下一轮模型会看到什么程序把 Goal 存下来，并不会让模型自动知道目标状态。每次调用模型，仍要把需要的信息放进请求。#目标与预算重新进入上下文Kimi 的续轮消息负责推动执行内容可以概括为下面这样，属于中文简化示意：当前有一个 active Goal。目标：完成数据库迁移。已经执行多少轮、消耗多少 tokens、经过多久。预算与剩余额度：……本轮完成一部分有用的工作。仍有工作就保持 active，正常结束，让程序继续下一轮。全部要求完成并验证后，再调用 UpdateGoal。它还要求模型检查用户是否明确提出预算。如果用户说了“最多 10 轮”，而状态里还没有记录，就先调用 SetGoalBudget。这一步值得注意：用户在自然语言里提出预算限制，会通过工具调用真正写入到系统内存/session 中。Codex 会直接在续轮提示词里放入 objective、tokens_used、token_budget 和 remaining_tokens。dsh 的 renderGoalRoundPrompt() 则把目标和 Round: 当前轮数/上限 一起写进续轮消息。Claude Code 的反馈还包含评估器给出的未完成理由，成为后续工作的指引。#继续工作，也要防止目标缩水Kimi Code 和 Codex 的提示词都反复强调：不能因为预算快用完，或已经做完一个小阶段，就把整个目标标成 complete。Codex 还要求区分实际进展、经过验证的等待和没有进展。比如等待后台任务，需要确认任务仍在运行；不能只根据前面的聊天记录，反复声称“还在等待”。dsh 的提示词短一些，同样要求根据当前工作区、工具结果和持久化状态判断，完成前读取当前 Goal。我觉得这些 Prompt 比一句“继续”更有价值。持续执行容易出现另一种问题：模型为了结束当前工作，把“完成全部迁移”悄悄缩小成“完成基础改造”。Goal 的原始目标与完成要求需要不断保持在上下文里。谁来判断目标完成了#执行模型通过工具声明完成Kimi Code、Codex 和 dsh 路径里，主 Agent 模型会根据自己的执行结果调用 Goal 更新工具。以 Codex 为例：{  "status": "complete"}程序可以验证参数、当前状态和预算，保存变更。这部分主要靠提示词要求模型自查：原始目标有哪些条件，哪些已经验证，还缺哪些证据。Kimi 和 Codex 都明确要求不能把计划、总结或部分结果当成完成。#Claude Code 额外评估一次Claude Code 使用独立的小模型评估目标，返回未满足、已满足或不可能满足的判断；后两种结果会清除目标并记录结果。评估器只能看对话证据，不会自己读文件、运行测试。这个设计把执行与判断拆开了，初见 multi-agent 的影子。这倒挺像 Claude Code 的各种博客里宣传的那样，executor 与 evaluator 分离。预算上述已经完成了整个 Goal 的执行流程，在这里我们再额外提及一个 Goal 执行过程中的约束，也就是预算。一个 Goal 总不能无休止的执行下去，需要人为的设定 token，轮次，甚至是时间上的预算。不同 Coding Agent 可以设置的预算如下：项目本文检查到的 Goal 限制Kimi Codetokens、turns、运行时间Codextoken 预算，另有耗时统计dsh自动 Goal 续轮次数，默认上限 256同样叫 token 预算，Kimi 与 Codex 的计算也不同。Kimi 的 Goal usage 处理读取主 Agent 的输出 token 数。Codex 的公式则是：Goal token 消耗 = 输入 tokens − 缓存输入 tokens + 输出 tokensCodex 还会把相关 sub-Agent 的 usage 计入 Agent 的计账状态。不同 Agent 的计算口径并不相同。Claude Code 文档建议将时间或轮数要求写进完成条件，由评估器判断。写在最后Goal 是一次 Coding Agent 向长程的试探，但是我自己在开发过程中几乎没有使用过 /goal，个人更喜欢时不时的检查一下中间过程，然后自己在输入框里敲下 “继续” 二字...看完这四套机制，我感觉 Goal 的核心已经比较清晰：保存目标，在合适的节点检查状态，再把后续输入自动交给 Agent，直到完成。这肯定是比“继续”二字更加的清晰且目标一致。Goal 的实现大同小异，真正影响使用效果的，是这层控制里的细节。预算怎样计量，用户插话后旧请求是否还会执行，恢复会话会不会自动开跑，以及模型拿什么证据声明完成。



# Coding Agent Goal 机制详解



前两篇整理了 Claude Code 与 Codex 的 Memory 和上下文压缩



Claude Code 与 Codex Memory 机制详解



Claude Code 与 Codex 压缩机制详解



这次接着聊 Goal



我对比了 Kimi Code、Codex、DeepSeek Harness 和 Claude Code 的实现与文档。它们都在解决一个问题：如何让 Agent 持续地执行任务，直到目标完成？



关于 Goal 我们要看三件事：



• 目标如何保存



• 如何判断目标达成或者应该终止



• 下一轮如何自动启动



Kimi Code、Codex、DeepSeek Harness 和 Claude Code 关于 Goal 机制的实现实在是大同小异，我把他们的流程串成主线，会在必要处提及他们的异同点。大家学习个思路即可。



## Goal 的整体流程



先说一下 turn - 可以把它理解为 Agent 围绕一次输入持续工作的回合，其中可能调用多次模型和工具：



比如让 Agent 完成一次数据库迁移。它改完数据访问层，跑了一部分测试，最后回复：“已经完成基础改造，接下来还需要适配接口层。”



这时，一轮对话结束了，整个任务却还没完成。



Goal 在外面增加了一层控制：



上述 4 种 Coding Agent 都可以沿着这条主线理解。差异主要在于：状态怎么存、下一轮从哪里触发、任务完成由谁判断。



Kimi Code、Codex 和 dsh 都提供了模型可以调用的 Goal 工具。Claude Code 则把完成检查交给额外的评估模型，后面单独展开。



## 目标如何创建和保存



### #目标 Goal 状态



用户看到的命令，与模型调用的工具，可以是两个入口。



以 Kimi Code 为例，执行 /goal 完成数据库迁移 后，CLI 会调用 session.createGoal() 保存目标，再把目标文本作为输入交给 Agent。这个入口不需要先让模型调用一次 CreateGoal。



模型侧仍有对应工具，其他入口或执行过程可以使用：



这些工具操作的都是程序中的状态。为了方便理解，可以简单概括成下面这样：



其中“任务完成了多少”与“资源消耗了多少”也要分开。完成进度通常需要模型判断，消耗则由程序计量。



dsh 的 revision 是一个比较实用的细节。模型先读取 Goal，再带着版本号更新；如果目标在此期间被修改，旧版本的更新就不能直接覆盖新状态。



### #状态放在哪里



上述提到的状态追踪了当前目标的进度以及消耗，它是需要放在内存中，以及持久化的，这样可以从一个旧 session 中进行恢复。



Kimi Code 把 Goal 变化写进主 Agent 的持久化事件日志。



主要是三个事件：



这些事件进入该 Session 下主 Agent 的 wire.jsonl。



goal.update 可以只携带部分字段。例如一次更新 tokensUsed，另一次更新 status。恢复时需要按顺序应用事件，不能只拿最后一条 update 当成完整 Goal。



dsh 也采用 Session 事件，但事件的组织不同。



goal/change 保存目标的生命周期状态；自动续轮消息正式进入 Session 后，对应的 user/message 还会推进轮数。



如果 Coding Agent 中途退出，是可以通过 session 文件中的这些事件推导出 goal 的真实状态。



Codex 直接把当前 Goal 保存在 SQLite。



Codex 是最与众不同的。它把 Goal 的各种状态追踪存储到了本地 Sqlite 中。数据库名是 goals_1.sqlite，thread_goals 表通过 thread_id 关联会话，保存目标、状态、token 预算与累计消耗等字段。读取时查询当前记录，不依赖重放聊天里的工具调用。



Claude Code 的 Goal 存储字段与写入路径，我没有对应的新源码，暂不推断。



## Agent 停下来后，如何继续



假设数据库迁移已经完成第一部分，Agent 正常结束了这一轮 turn， 但是 Goal 仍旧未完成。



### #轮次结束与空闲回调



Kimi Code 的调用链比较直接，当前 turn 结束后：



提交的消息可以简化为：



消息使用 user 角色，但来源明确标记为程序触发。就是以 user 的口吻，自动发一条消息给 Agent - 当前任务进度 xxx，请继续



Codex 把续轮放在线程空闲阶段：



它从数据库读取 active Goal，检查是否允许自动继续，再把 Goal 提示词包装成内部上下文输入，启动下一轮。触发来源标记为 goal。



dsh 则由独立的 goal-round-driver 插件负责：



它要求目标 active、自动执行已激活、没有竞争的待处理输入，并且尚未达到轮数上限。续轮消息的 source 中还带着 goalId、revision 和 round。



这些检查有实际意义：自动续轮排队之后，用户可能已经修改目标或发送了新问题。dsh 会在消息进入执行前再次核对，避免旧的续轮请求继续生效。



### #Claude Code 的 Stop hook



Claude Code 官方把 /goal 描述为 Session 级的 prompt-based Stop hook：在模型准备结束时进行评估，决定是否允许停止。



通用 Stop hook 可以返回阻止停止的理由，再由程序反馈给模型继续执行。



泄露的源码中能看到这项基础机制：stopHooks.ts 把阻塞理由包装成消息；query.ts 在允许继续的情况下，将它追加到上下文，再 continue 查询循环。



## 下一轮模型会看到什么



程序把 Goal 存下来，并不会让模型自动知道目标状态。每次调用模型，仍要把需要的信息放进请求。



### #目标与预算重新进入上下文



Kimi 的续轮消息负责推动执行



内容可以概括为下面这样，属于中文简化示意：



它还要求模型检查用户是否明确提出预算。如果用户说了“最多 10 轮”，而状态里还没有记录，就先调用 SetGoalBudget。



这一步值得注意：用户在自然语言里提出预算限制，会通过工具调用真正写入到系统内存/session 中。



Codex 会直接在续轮提示词里放入 objective、tokens_used、token_budget 和 remaining_tokens。dsh 的 renderGoalRoundPrompt() 则把目标和 Round: 当前轮数/上限 一起写进续轮消息。



Claude Code 的反馈还包含评估器给出的未完成理由，成为后续工作的指引。



### #继续工作，也要防止目标缩水



Kimi Code 和 Codex 的提示词都反复强调：不能因为预算快用完，或已经做完一个小阶段，就把整个目标标成 complete。



Codex 还要求区分实际进展、经过验证的等待和没有进展。比如等待后台任务，需要确认任务仍在运行；不能只根据前面的聊天记录，反复声称“还在等待”。



dsh 的提示词短一些，同样要求根据当前工作区、工具结果和持久化状态判断，完成前读取当前 Goal。



我觉得这些 Prompt 比一句“继续”更有价值。持续执行容易出现另一种问题：模型为了结束当前工作，把“完成全部迁移”悄悄缩小成“完成基础改造”。



Goal 的原始目标与完成要求需要不断保持在上下文里。



## 谁来判断目标完成了



### #执行模型通过工具声明完成



Kimi Code、Codex 和 dsh 路径里，主 Agent 模型会根据自己的执行结果调用 Goal 更新工具。



以 Codex 为例：



程序可以验证参数、当前状态和预算，保存变更。



这部分主要靠提示词要求模型自查：原始目标有哪些条件，哪些已经验证，还缺哪些证据。Kimi 和 Codex 都明确要求不能把计划、总结或部分结果当成完成。



### #Claude Code 额外评估一次



Claude Code 使用独立的小模型评估目标，返回未满足、已满足或不可能满足的判断；后两种结果会清除目标并记录结果。评估器只能看对话证据，不会自己读文件、运行测试。



这个设计把执行与判断拆开了，初见 multi-agent 的影子。



这倒挺像 Claude Code 的各种博客里宣传的那样，executor 与 evaluator 分离。



## 预算



上述已经完成了整个 Goal 的执行流程，在这里我们再额外提及一个 Goal 执行过程中的约束，也就是预算。一个 Goal 总不能无休止的执行下去，需要人为的设定 token，轮次，甚至是时间上的预算。不同 Coding Agent 可以设置的预算如下：



同样叫 token 预算，Kimi 与 Codex 的计算也不同。



Kimi 的 Goal usage 处理读取主 Agent 的输出 token 数。Codex 的公式则是：



Codex 还会把相关 sub-Agent 的 usage 计入 Agent 的计账状态。不同 Agent 的计算口径并不相同。



Claude Code 文档建议将时间或轮数要求写进完成条件，由评估器判断。



## 写在最后



Goal 是一次 Coding Agent 向长程的试探，但是我自己在开发过程中几乎没有使用过 /goal，个人更喜欢时不时的检查一下中间过程，然后自己在输入框里敲下 “继续” 二字...



看完这四套机制，我感觉 Goal 的核心已经比较清晰：保存目标，在合适的节点检查状态，再把后续输入自动交给 Agent，直到完成。这肯定是比“继续”二字更加的清晰且目标一致。



Goal 的实现大同小异，真正影响使用效果的，是这层控制里的细节。预算怎样计量，用户插话后旧请求是否还会执行，恢复会话会不会自动开跑，以及模型拿什么证据声明完成。

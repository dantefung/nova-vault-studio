---
title: "Stephan（@Stephan_Talk）：一条命令落地 Matt 工作流——开源 pi-matt-implement-flow 多 Ticket 工程化方案"
date: "2026-11-04"
source: "X/Twitter"
author: "Stephan (@Stephan_Talk)"
url: "https://x.com/Stephan_Talk/status/2102201335437562012"
coverImage: "../images/stephan-pi-matt-implement-flow-open-source/001.jpg"
---

# Stephan（@Stephan_Talk）：一条命令落地 Matt 工作流——开源 pi-matt-implement-flow 多 Ticket 工程化方案

> 针对 Matt Pocock 经典三段式 Agent 工作流（/grill-with-docs → /to-spec → /to-tickets）最后一步 /implement 的工程化困境开源 pi 扩展包：直击三大痛点——8~10 个 ticket 串行单会话导致的上下文爆炸与幻觉遗忘、依赖与并行关系需人工开会话切分支测一遍的盯盘心累、以及写码与自审同体的裁判运动员合一问题，实现 ticket 级并行、依赖编排与独立审查分离。

<!-- more -->

## 我开源了 pi-matt-implement-flow

如果你也在用 Matt Pocock 经典的三段式 Agent 工作流（/grill-with-docs → /to-spec → /to-tickets），你一定遇到过最后一步 /implement 的尴尬：

1. 上下文爆炸：一张 spec 拆解出 8~10 个 tickets，如果全塞进同一个会话串行写，越到后面模型越晕，幻觉与遗忘不可避免；
2. 人肉盯盘极其心累：哪些 ticket 互相依赖？哪些能并行？每跑完一个 ticket，人工就要手动开新会话、切分支、测一遍；
3. 裁判与运动员合体：写代码的是它，自己 review 自己的也是它，代码质量全凭模型自觉。

为了解决多 ticket 场景下的工程化落地问题，我开源了这个 pi 扩展包：pi-matt-implement-flow。

它的定位非常纯粹：完全保留上游的 /to-spec 和 /to-tickets 不动，只接管并重度增强 /implement —— 读取 ticket 依赖图，一条命令自动完成并行实现、双轴审查、冲突合并与集成测试。

🛠 安装方式（基于[ p](https://github.com/earendil-works/pi)i 环境）：

pi install npm:pi-matt-implement-flow

🚀 使用极简：

在 /to-tickets 产出依赖图后，开一个干净会话，直接输入：

/pi-matt-implement-flow [并发数 N]

（如果不填 N 则默认按并发度 3 运行，自动读取项目 tickets 拓扑并开跑）。

## 它是如何保障效率与质量的？

⚡️ 1. 真·依赖拓扑并行，完全隔离上下文

- 每个 ticket 独立 worktree：互不抢上下文，互不冲突；无依赖关系的 ticket 并行推进，有依赖的前置搞定后自动解锁触发；
- 编排器不写代码：主会话 Agent 严格作为“调度器”，只负责算依赖前沿（Frontier）、派活、合并与集成测试，彻底杜绝上下文污染。

🛡 2. 双轴逐 ticket Review + 闭环修复

- 严格双轴审查：Coder 提交后，独立的 Reviewer 会从「代码规范」与「Spec 依从性」双轴审查，发现漏洞直接打回给原 coder 修复；
- 支持异构模型：Coder、Reviewer、Final-Reviewer 均可独立配置不同的模型与 Thinking 档位（支持通过 /matt-flow-config 交互式配置）。比如用 DeepSeek/Claude 编码，用另一款模型审查，防止同模型盲区。

🧪 3. 合并即测试，当场暴露集成缺陷

- 每个 ticket 被 coder 交付并审过之后，合入 feature 分支会立刻执行项目全量集成测试。集成问题当场暴露、当场修，绝不把雷留到最后。多 ticket 合入遇到冲突也会自动解决。

🔍 4. 整分支终审（Final Review）

- 所有 tickets 全部合入后，触发整分支终审：专门排查单 ticket 视角看不见的跨文件漂移、组件语义冲突、以及 Spec 有要求但没有 ticket 承接的隐蔽漏项。没过会自动打回修复，直到通过终审。

💾 5. 本地事件流落盘，真正的“中断可续跑”

- 运行状态实时沉淀为本地结构化事件流（events.jsonl）与账本（ledger.md）。无论会话挂掉、手动中断，还是遇到 Agent 的上下文压缩（Compaction），重新运行命令即可瞬间对账恢复，绝不凭模型虚无的记忆重启。

💸 成本可控：

觉得逐 ticket review 耗费 Token？在 /matt-flow-config 中可随时一键关闭逐 ticket review（仅保留全量集成测试），但整分支终审依然为你兜底。

这不是商业项目，纯粹是自己在日常工程实践中把 Agent 推向复杂长任务时的开源沉淀，希望能帮到同样在探索 Agent 软件工程落地的小伙伴。

欢迎 Star、试用并提 Issue，一起交流共建！

🔗 GitHub:[ https://github.com/toomanyopenfiles/pi-matt-implement-flo](https://github.com/toomanyopenfiles/pi-matt-implement-flow/)w

📦 pi.dev 扩展包[: https://pi.dev/packages/pi-matt-implement-fl](https://pi.dev/packages/pi-matt-implement-flow)ow

## 相关页面

- [[sources/setup-matt-pocock-skills-not-script]]
- [[sources/copperforge-orca-multi-agent-orchestration-guide]]
- [[concepts/multi-agent]]
- [[concepts/agent-autonomous-pipeline]]

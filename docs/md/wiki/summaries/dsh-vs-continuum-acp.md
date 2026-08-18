---
title: "从 Runtime 实验走向工程闭环：DSH 的工程比较与自修改治理"
date: "2026-08-17"
source: "X (Twitter)：@JoeyDeepWorld"
url: "https://x.com/JoeyDeepWorld/status/2089182089283571957"
---

# 从 Runtime 实验走向工程闭环：DSH 的工程比较与自修改治理

## 核心结论

DeepSeek Harness 提供的「临时 Plugin 挂载」只是 Agent 自我改造的起点，并不是「自我进化」的实现。从一次内存中的 mount 走到生产系统可依赖的版本演进，中间必须补齐四类基础设施：可信评测、正式发布链路、强隔离与最小权限、责任归属。Cordis 论文解决了组件生命周期的形式化，但无法替代 Agent 行为的正确性证明；Self-Harness、DGM 等研究在受控基准里展示了增益，但都还没证明生产系统可以安全替换任意组件。

## 关键洞察

1. **DSH 真正可替代的不是「增加工具」**：是把工具、模型适配器、Session、Sandbox、Agent Loop、UI 放进同一套 Plugin system，并强制记录模型实际看到的 context 和执行轨迹——细粒度可替换 + 可重建执行历史，是它给 Agent 工程的两个工程回答。
2. **Cordis 解决的是组件生命周期，不是 Agent 行为正确性**：Cordis 论文证明的定理有明确前提（变换及逆操作成对独立、可交换等），它证明了「在当前进程内能装能卸」，但没有证明「Agent 会做出更好的决策」；数据一旦越过进程边界，Cordis 也无法倒带。
3. **临时 Plugin ≠ 正式版本**：Agent 在 Session Event Log 中挂载过一段代码并展示出效果，最多只说明「这次调用在当前会话里发生过」；代码能否在重启后被保留、是否进入发布流程，是另一回事。DSH 官方实现说明明确列出 6 条限制（仅进程内存、不自动保存、信任等级等同于 Bash、node:vm 不构成 security boundary 等）。
4. **生成修改只是开始，真正昂贵的是选择压力**：Self-Harness（2026-08 v2）在 Terminal-Bench-2.0/SWE-bench/AppWorld 三个基准上展示最大相对增益 132%，DGM 把 SWE-bench 从 20.0% 推到 50.0%；两者的共同点不是「让 Agent 修改自己」，而是把候选放进「评测→拒绝/保留」的选择过程。
5. **组件组合 ≠ 能力叠加**：Liu Ming 的「More Is Not Always Better」对 Planning/Tools/Memory/Self-Reflection/Retrieval 做全组合实验，发现 HotpotQA 上仅工具配置高于全组件，GSM8K 上某个三组件组合也优于全组件——组件通过 context window、prompt、状态传递和 feedback loop 相互影响，整体表现具有明显的非线性、耦合与上下文依赖。
6. **从临时 mount 到工程闭环需要四类基础设施**：可信评测（覆盖成本/延迟/安全/长任务稳定性/低频高损失场景）+ 正式发布链路（versioned artifact + provenance + policy gate + rollback）+ 强隔离与最小权限（独立进程/虚拟化容器 + 风险级别审批 + 审计记录）+ 责任归属（candidate 不能离开其 failure trace/评测记录/批准责任）。
7. **关键判断要严格分离**：Agent 提出了修改 ≠ 修改在候选环境中运行 ≠ 修改通过检查 ≠ 修改成为正式可依赖的系统状态。这四件事必须用 candidate、Result、verification evidence、MissingEvidence、CounterEvidence、GateResult 等显式数据形态记录，而非靠 benchmark 分数或单次漂亮轨迹决定。
8. **自主性可以交给 Agent，责任链不能消失**：Continuum + ACP 是Continuum 内部专门治理变更的子系统（Agent Control Plane），它把 MAL/DIMC 留下的连续性与证据能力用在「系统如何改变自己」上，记录 provenance/version/作用域/风险/预期影响，把 candidate 放进隔离评测，最终只有 Promotion 过的版本才能成为正式状态。

## 值得保留的判断

- **DSH 现阶段是 runtime architecture，不是 self-improving system**：用「一次临时 Plugin 挂载」推断「DSH 已实现自我进化」是过度外推，受控基准的版本选择不能直接替代生产准入判断。
- **自修改研究的关键信号而非终态**：Self-Harness 与 DGM 在基准上的成绩是积极信号，但企业权限、真实外部副作用、长期在线漂移的安全结论尚未建立。
- **跨组件干扰的工程含义**：单组件各自的增益不能外推到组合后的整体；自修改系统需要严格的回归测试，因为一次修改可能改善局部指标，同时改变工具描述、上下文长度、注意力分配和后续轨迹。

## 疑点与边界

- **Cordis vendor 分叉债**：DSH 把固定版本 Cordis 源码放进 vendor 而非跟随上游，未来 Cordis 演进可能产生分叉维护成本。
- **基准显著性与样本规模**：「More Is Not Always Better」只有一个主要设置用 10 个随机种子，70B 结果未达统计显著，结论需谨慎推广。
- **trust 边界实践**：DSH 临时插件 ctx.shell/ctx.fs/ctx.web 信任等级等同于 Bash，但 node:vm 不构成 security boundary——生产场景需要独立进程或虚拟化容器补齐隔离。

## Related Pages

- [[products/deepseek-harness]]
- [[summaries/dsh-tech-hype-or-not]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[patterns/plugin-first-agent-runtime]]
- [[patterns/dsh-four-modes]]
- [[concepts/harness-engineering]]
- [[concepts/deepseek-harness-agent-formula]]
- [[concepts/harness-multiplier-effect]]

## Sources

- [[sources/dsh-vs-continuum-acp]]
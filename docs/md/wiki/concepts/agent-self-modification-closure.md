---
title: "Agent 自修改的工程闭环：从临时插件挂载到可治理版本演进"
date: "2026-08-17"
source: "基于 X (Twitter)：@JoeyDeepWorld 的 Wiki 推导"
url: ""
---

# Agent 自修改的工程闭环：从临时插件挂载到可治理版本演进

> 让 Agent 修改自己 ≠ 自修改成熟；临时 Plugin 挂载只是 candidate，要成为正式版本必须经过评测、隔离、发布与责任归属四类基础设施的闭环。

## Problem Context

DeepSeek Harness 已经在当前进程里实现"Agent 检查运行时、动态挂载临时 Plugin、卸载"的能力。但很多讨论从"Agent 可以改变 runtime"迅速跳到"Agent 已经能够自我进化"，忽略了从"一次内存中的 mount"到"可验证、可恢复、可治理的工程系统"之间还隔着一条完整的工程链路。

Cordis 论文虽然给出组件装卸的形式化模型，但它的证明前提（变换及逆操作成对独立、可交换）只对进程内可独占修改的位置成立；数据越过边界（发邮件、转账、调外部 API）后框架无法"倒带"。Self-Harness（2026-08 v2）与 Darwin Gödel Machine（DGM，ICLR 2026）等自修改研究在受控基准上展示了增益，但都还没证明生产系统可以安全替换任意组件。

## Solution：四类基础设施的 change lifecycle

以下从原文「四类基础设施」主张中推导出的工程闭环设计：

1. **可信评测**：必须区分真实泛化与对评测集的适配，覆盖成本、延迟、安全、长任务稳定性、低频高损失场景；评测前写明目标、比较基线和通过阈值；候选在未参与调优的任务上稳定改善结果，且不让其他任务退化、不新增不可接受的权限风险。
2. **正式发布链路**：临时 Plugin 必须先转化为可审查的 versioned artifact，携带 provenance、verification evidence、兼容范围和版本标识；再经过 policy gate、发布、持续观察、rollback 和废止流程。进程内的 unmount 只能撤销一次临时挂载，不等于生产环境中的版本治理。
3. **强隔离与最小权限**：模型生成的代码不会因为被包装成 Plugin 就天然可信；它能访问哪些文件、网络、凭据和跨会话状态，必须由宿主进程之外的独立权限边界限制（独立进程/虚拟化容器）；高风险操作按风险级别要求明确审批并留下完整审计记录。
4. **责任归属**：候选变化不能离开其 failure trace、评测记录和批准责任；团队要能查它为什么被提出、基于哪个版本、谁在什么权限下批准、发布后影响了哪些状态和用户；出问题时要能回到哪个版本、哪些后续变化一并失效。

这四项不是四个松散的外围设施，而是一条 change lifecycle：评测判断候选变化是否有效；隔离限制其风险边界；发布链路决定它能否进入正式状态；责任链保存每次决定的依据、权限与后果。任何一环缺失，系统都只能不断制造新版本，无法形成可依赖的工程演进。

## 必须严格分开的四件事

原文给出的关键判断框架：

```
Agent 提出了修改 ≠ 修改在候选环境中运行
                ≠ 修改通过了某项检查
                ≠ 修改成为正式可依赖的系统状态
```

这四件事必须用 candidate、Result、verification evidence、MissingEvidence、CounterEvidence、GateResult 等显式数据形态记录，而非靠 benchmark 分数或单次漂亮轨迹决定。

## 与"Agent 元搜索/自演化研究"的关系

| 研究/项目 | 主要证据 | 适用范围 | 边界 |
|----------|----------|----------|------|
| **Self-Harness (2026-08 v2)** | Terminal-Bench-2.0/SWE-bench/AppWorld 三基准最大相对增益 132%，MiniMax M2.5 在 Terminal-Bench-2.0 上 held-out 通过率从 40.5% 升至 61.9% | 受控基准下的版本化优化 | 未证生产系统的任意组件替换 |
| **Darwin Gödel Machine (ICLR 2026)** | SWE-bench 20.0%→50.0%、Polyglot 14.2%→30.7% | 沙箱 + 人工监督下的开放式探索 | 元层搜索过程本身仍固定 |
| **More Is Not Always Better** | 五组件全开并不总是最优；HotpotQA 上仅工具配置高于全组件，GSM8K 上某个三组件组合也优于全组件 | Planning/Tools/Memory/Self-Reflection/Retrieval 组合 | 单一设置 10 个随机种子，70B 未达统计显著 |
| **DSH 临时 Plugin 挂载** | 当前 session 内 mount/unmount 临时 cordis 服务 | 实验原语 | 进程重启即消失，无晋升路径 |
| **Continuum + ACP（作者体系）** | candidate → 评测 → Promotion → 发布后 Observation → rollback / supersession / invalidation | 全链路 change governance | 非开源，依赖 Continuum 记忆底座 |

## Trade-offs

- **基准显著 vs 真实收益**：基准上的版本选择不能直接替代生产环境中的准入判断，后者还要处理权限、作用域、外部副作用、发布责任和故障后的追溯。
- **隔离强度 vs 可用性**：越强的隔离（独立进程/虚拟化容器）越限制 Agent 调试时的快速迭代，需在迭代速度与安全边界间平衡。
- **证据完整度 vs 评审成本**：evidence/MissingEvidence/CounterEvidence 都收集会带来存储与评审负担，但事故复盘时这些数据是定位与回滚的唯一依据。
- **自治性 vs 责任链**：自主性可以交给 Agent，责任链不能消失；系统越能改变自己，越不能把责任交给"演化过程"这个抽象概念。

## Related Pages

- [[summaries/dsh-vs-continuum-acp]]
- [[summaries/dsh-tech-hype-or-not]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[patterns/plugin-first-agent-runtime]]
- [[patterns/dsh-four-modes]]
- [[products/deepseek-harness]]
- [[concepts/harness-engineering]]
- [[concepts/deepseek-harness-agent-formula]]

## Sources

- [[sources/dsh-vs-continuum-acp]]：从 Runtime 实验走向工程闭环的原始推导
---
title: "Anthropic 平台工程负责人 Katelyn Lesse：上千个 AI 智能体一起干活，还缺程序员解决四个难题"
date: "2026-10-25"
source: "Katelyn Lesse 个人博客 / X"
author: "Katelyn Lesse（Anthropic 平台工程负责人）"
url: "https://katelynlesse.com/blog/new-problems-for-engineers-to-solve"
---

# 上千个 AI 智能体一起干活，还缺程序员解决四个难题

> AI 越来越会写代码，很多程序员开始怀疑自己的手艺还值不值钱。Anthropic 平台工程负责人 Katelyn Lesse 的观察正相反：接下来一两年，AI 想做成大事，**得先靠程序员解决一批新问题**。多智能体系统已经暴露出四类全新的软件工程难题——基础设施、身份与访问、安全与隔离、监控与叫停。

<!-- more -->

> 原文为英文（`katelynlesse.com`），以下为中文精读，关键论断附原文引用。背景信息（团队规模、履历、X 阅读量）来自转载版本，未经原始信源核实。

---

## 〇、开篇：工程师的身份危机

> 「A lot of software engineers are going through what can only be described as an **identity crisis**. The job has changed a lot. Some are depressed, others are having the time of their lives.」

Lesse 观察到的那件让她兴奋的事：

> 「**AI just isn't going to be able to create the incredible outcomes it's capable of creating unless software engineers solve problems to make it possible.** This is existential, which is honestly a lot of fun, so it's a pretty incredible time to be a software engineer.」

**她的判断**：多智能体系统未来一两年会变得极其强大，但**前提是工程师先把这四类问题解决掉**——否则世界无法信任它去创造「治愈疾病」这类好结果，而不是坏结果。

---

## 一、这些问题从哪来

### 智能体的演进路径

```text
人在环里的聊天框（human in the loop chats）
  → 模型能独立跑更久、跑更难的问题
    → 智能体系统迁到云端
      → 模型开始学会协作
        → 基础多智能体系统
             · orchestrator（总管）拆分任务派给一批 subagents
             · 给 agent 不只是「执行」的角色：grading（打分）、advising（建议）、dreaming（构想）
```

> 「Now, some folks are starting to build truly amazing multiagent systems to tackle the world's hardest and most important problems, like serious research, discovery, and hardware design. **Picture thousands of agents, persistently working towards these outcomes.**」

**规模一上来，就冒出了四类新问题。**

---

## 二、难题一：基础设施必须进化

### 智能体与 Kubernetes 的根本错配

> 「The software industry has been building on Kubernetes, which was designed for **stateless, replicated apps or stable numbered sets of stateful pods**. Agents are totally different. **They're essentially isolated, stateful, single-instance workloads.**」

| 维度 | Kubernetes 的设计前提 | 智能体的实际形态 |
|---|---|---|
| 状态 | 无状态，或编号稳定的有状态 Pod 集合 | **隔离的、有状态的、单实例**工作负载 |
| 生命周期 | 长期稳定运行 | **可以在任意长时间内空闲** |
| 等待行为 | 不适用 | 大量时间在等工具、等模型推理、等其他智能体、等人类输入 |
| 启动 | 常规 | 部分需要**极快启动**（几秒内） |
| 成本 | 常规 | 部分需要**避免浪费算力**（闲时休眠） |
| 规模 | 常规 | 部分需要**疯狂扩展** |

### 已经在推进的工程力量

> 「Amazing engineers are pushing hard on this problem space — like AI infra companies building new filesystems and sandboxing offerings, and the Google team building **Agent Substrate** as a new runtime. **There's a ton left to figure out.**」

> **对应资料**：[[sources/agent-sandbox-survey]] 详细拆解了 Google Agent Substrate 的六层架构模型、10 倍部署密度、`<500ms` 唤醒时延等指标；[[sources/agent-sandbox-k8s]] 覆盖 Kubernetes SIG 下的 Agent Sandbox 项目。

---

## 三、难题二：身份与访问

### 认证：可以借用微服务世界的现成积木

> 「This area has the **benefit of the building blocks that have been built and hardened from the microservices world**, like **workload identity with short-lived certs rather than static keys**, and folks are beginning to apply these concepts to agents.」

**已有解法**：用**短期有效的证书代替长期静态密钥**的工作负载身份（workload identity）。

### 授权：仍然基本空白

> 「Agent authorization as a problem space is **much more wide open** — what do you allow an agent to do?」

三层递进的难题：

**① 区分「谁做的」**

很多智能体**代表人类行事（on-behalf-of, OBO）**，用那个人的身份和凭证访问系统、采取行动。问题在于：系统得分清**这个操作是人做的，还是 AI 替人做的**。

**② 同意（consent）——多智能体场景下最被低估的难题**

> 「If multiagent systems are working for **weeks**, how does the human **meaningfully approve** what their agent can do?」

> 「Agentic platform features like auto approval for tool calls helps, but there's **deeper permissioning** needed to get this right at high scale.」

**③ 智能体用自己的身份 —— 更没解决**

> 「And then we have agents working with their own identity, which is **even less solved**, and how we apply that to agents working together — **how does an agent trust another agent that asked it for something?**」

> 这与 [[sources/yaohongan-geo-five-actions-guide]] 中「禁用长期密钥、用快速过期的临时凭证」的思路同源，但 Lesse 指出的是**更难的一层**：凭证只是开始，OBO 同意与智能体间的信任机制都还是空白。

---

## 四、难题三：一个被骗，全队遭殃

### 漏洞窗口正在被智能体放大

> 「Over the past few months and especially in the past couple weeks, we've seen **vulnerabilities surfacing faster than the industry can patch them**, much of it in critical core software that many systems rely on.」

> 「Now think about **thousands of persistent agents running on top of that core software, writing untrusted code and reading untrusted content**. Those unpatched vulns get a lot more dangerous in that world.」

### 智能体软件工程最重要的任务之一

> 「One of the most important things for software engineers to do is **get creative about how to harden that software** — **kernels, browsers, runtimes, and common libraries**.」

### 多智能体特有的新风险：注入指令的传染

> 「A compromised agent could **pass injected instructions to other agents** it's working with, and those instructions could end up in **memory for future agents to accidentally trust**.」

> 「**Blast radius gets real** — how much of the multiagent system is at risk when that first agent got compromised?」

### 解法：强隔离沙箱

> 「Isolation becomes important in that world — agents should use **strongly isolated sandboxed execution environments** to take actions.」

> 形象比喻（转载版）：好比实验室把每份样本放进独立的密封箱，一个出事不会传染整屋。

> **对应资料**：[[summaries/dannykkg-ai-sandbox-primer]] 拆解了 Sandbox ≠ Docker ≠ VM、六类受限资源与三道防线；[[patterns/agent-runtime-safety-guardrails]] 给出默认拒绝、最小权限、执行前授权、成本包络、门禁、回滚与脱敏审计的纵深防御模型。

---

## 五、难题四：跑偏了要能叫停

### 三个必须有的机制

| 机制 | 要求 | 原文 |
|---|---|---|
| **分布式追踪** | 需要跨智能体的 OTel tracing，且**保证任何智能体都无法修改自己或他人的 trace** | 「We need OTel tracing across agents, and to ensure that **an agent can never modify its own trace or another agent's trace**.」 |
| **总闸** | 监控可触发的 kill switch，**真正一次性停掉整个系统并收回所有凭证** | 「We need kill switches that monitoring can trigger, that **truly stop the whole system at once and cut off its creds**.」 |
| **跑偏判定** | 这是最难的部分 | 「Really the hard part is **how to know when the system is going in the wrong direction**.」 |

### 最难的一问：怎么区分「执拗」和「恶意」

> 「**Well-intentioned persistence to solve a problem can look a lot like maliciousness** — repeated attempts to reach a domain that isn't on its allowlist, for example.」

> 这正是「让智能体反复尝试访问不在白名单里的网站」这个信号的真正难点：**它可能是搞破坏，也可能只是太想把任务做完。** 误判的代价是双向的——误杀一个好智能体，或放过一个被劫持的智能体。

---

## 六、结论：工程师应该兴奋起来

> 「This is for the engineers feeling an identity crisis because they think their knowledge and skills won't be important — **you and your skills can be the difference in whether or not these problems get tackled** and multiagent systems can solve the world's hardest problems.」

> 「You can and should **go deep in these domains, learn new things, and form opinions**. So much of this problem space is **wide open for new solutions**. It's an incredibly exciting time to put your skills to work.」

---

## 七、四个难题速查表

| # | 难题 | 现有解法 | 空白 |
|---|---|---|---|
| ① | **基础设施** | Google Agent Substrate（新 runtime）、AI infra 公司的文件系统与沙箱产品 | 「There's a ton left to figure out」 |
| ② | **身份与访问** | 认证可用微服务世界的**短期证书 / workload identity** | 授权「much more wide open」：OBO 同意、智能体自有身份、智能体间信任 |
| ③ | **安全与隔离** | 强隔离沙箱执行环境 | 注入指令的**跨智能体传染**与共享记忆污染；核心软件的加固（kernel / browser / runtime / 库） |
| ④ | **监控与叫停** | 跨智能体 OTel tracing、kill switch | **最难**：区分「执拗」与「恶意」；trace 防篡改；一次性停机与凭证回收 |

---

## 相关页面

- [[sources/agent-sandbox-survey]] — Agent Sandbox 综述：Google AX / Agent Substrate / DeepSeek DSec 与六层架构模型
- [[sources/agent-sandbox-k8s]] — Agent Sandbox：K8s SIG 项目与沙箱隔离实践
- [[summaries/dannykkg-ai-sandbox-primer]] — Sandbox 入门：≠Docker≠VM、六类受限资源与三道防线
- [[patterns/agent-runtime-safety-guardrails]] — Agent 运行时纵深防御：默认拒绝、最小权限、执行前授权、回滚与脱敏审计
- [[concepts/agent-token-architecture]] — Agent 的本质：用 Token 换架构
- [[concepts/harness-engineering]] — Harness 工程：为 Agent 打造安全与自适应工作台
- [[sources/how-i-work-with-agents]] — Thorsten Ball：我如何与 Agent 协作
- [[patterns/agent-iteration-environment]] — Agent 迭代环境闭环模式

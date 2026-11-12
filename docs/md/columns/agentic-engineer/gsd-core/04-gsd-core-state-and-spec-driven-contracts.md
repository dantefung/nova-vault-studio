---
title: "04. GSD Core 规范驱动与验证门禁：机器可执行契约与反向目标验收"
date: "2026-09-16"
source: "open-gsd/gsd-core"
url: "https://github.com/open-gsd/gsd-core"
---

# 04. GSD Core 规范驱动与验证门禁：机器可执行契约与反向目标验收

> 「好代码没有特殊情况。只要你把数据结构定义得严丝合缝，复杂的分支判断就会自动消失。」在 AI 编程中，如果你只用模糊的自然语言去跟模型许愿，你注定只能得到一堆概率拼凑出来的玩具代码。GSD Core 采用的是彻底的**规范驱动（Spec-Driven）与硬核机器门禁**。

<!-- more -->

## 为什么纯「Vibe Coding」无法交付生产级系统？

「Vibe Coding（氛围编程）」在做 Demo 时让人兴奋不已，但它有两个致命的缺陷：
1. **记忆蒸发**：模型上周答应你「这个接口必须返回 401 状态码」，由于没有书面契约，下周写新功能时它随手就改成返回 200 和一段 JSON 报错。
2. **任务完成（Task Finished）≠ 目标达成（Goal Achieved）**：AI 可以一丝不苟地把每一个待办事项勾选完毕（它忠实地执行了每一个步骤），但拼装在一起后，核心的用户业务目标根本没有实现。

GSD Core 的核心突破在于：**所有的规约与契约必须是机器可执行的（Machine-Executable Contracts），所有的验证必须是目标反向推导（Goal-Backward Verification）。**

---

## 契约设计：让 Markdown 变成结构化数据库

在 GSD Core 中，Markdown 不再是写给人类看的散文，而是经过特殊约束的**结构化状态机与数据源**。

### 1. 强类型的 STATE.md
`STATE.md` 记载着当前项目的精准运行状态。它的头部是严格受检的 YAML Frontmatter：

```yaml
---
status: "Executing Phase 03"
current_phase: "03"
current_plan: "03-02"
progress:
  total_phases: 8
  completed_phases: 2
  percent: 25
last_updated: "2026-09-16T14:30:00.000Z"
state_head: "a1b2c3d4e5f6..."
---
```

- **机器单向原子更新**：底层由专用的 CJS 模块驱动，严禁任何 Agent 随意手动破坏其格式。
- **Commit 锚定机制（Commit Provenance）**：`state_head` 会忠实记录当前状态是基于哪一个 Git Commit SHA 写入的。一旦代码库在未经协调的情况下被篡改，系统会立即触发状态过期（Stale）告警。

### 2. 决策闭环的 CONTEXT.md
在 Discuss 阶段生成的 `CONTEXT.md` 拒绝废话套话，它采用由决策谓词构成的结构：

```markdown
## Decisions Locked

- **Authentication Strategy**: JWT in HTTP-only cookies; reject localStorage to eliminate XSS surface.
  - **Reversibility**: Costly
  - **Rationale**: Security baseline established for multi-tenant deployment.
- **ORM Choice**: Prisma ORM with strict SQLite local migrations.
  - **Reversibility**: One-way
```

- 每个决策都必须标定**可逆性评级（Reversibility Rating）**：
  - `reversible`：便宜且局部，随时可重构。
  - `costly`：波及范围大，需要谨慎。
  - `one-way`：单向门决策（如底层存储、公开 API 规范），后续规划必须插入确认检查点（`checkpoint:decision`），强制人类审批。

---

## 目标反向推导验证（Goal-Backward Verification）

大多数平庸框架在测试阶段只做一件事：运行测试脚本，只要没有报错就报告 Success。

GSD Core 的 `gsd-verifier` 执行的是冷酷的**反向目标审校**：

```text
               传统前向测试模式 (Forward Testing)
[ 需求 ] ───> [ 编写任务 ] ───> [ 执行完成 ] ───> 跑一下现有测试 ───> [宣布成功] (极易漏掉真实目标)

               GSD 目标反向推导 (Goal-Backward Verification)
[ 阶段终极目标 ] (Phase Goal & REQ-IDs)
       │
       ├──> 1. 需求溯源：每一个 REQ-ID 是否都有对应的实现代码？
       ├──> 2. 决策履约：CONTEXT.md 锁定的规范是否被阳奉阴违地违背？
       ├──> 3. 证据链条：每个断言是否都有确定性的命令退出码证明？
       └──> 4. 盲区探测：是否存在未被测试覆盖的状态转换边界？
```

### 1. 绝不相信模型的「自我表扬」
`gsd-verifier` 拥有独立的只读视野，它对被测代码保持着极强的攻击性（Adversarial Stance）。如果一个功能缺少针对性的测试覆盖，即使代码看起来再漂亮，也会被无情标记为 `⚠️ PRESENT_BEHAVIOR_UNVERIFIED`，直接阻止阶段闭环。

### 2. 失败预设（Failing-Direction Probe）
在 GSD Core 的计划文件里，每一个自动化测试命令必须携带预期的失败方向：

```xml
<task>
  <name>Implement Token Revocation Endpoint</name>
  <verify>
    <automated>npm run test:auth -- --grep "rejects revoked token"</automated>
    <fails_when>Exit code is 0 when token exists in revocation list</fails_when>
  </verify>
</task>
```

如果一个测试命令**没有明确定义「在什么情况下它应该失败」**，那么这个测试在 GSD Core 的哲学里就是无效的。因为无法证明它不是一个永远返回 0 的虚假测试。

### 3. 奈奎斯特采样（Nyquist Validation）
借鉴信号处理中的奈奎斯特采样定理：**验证的采样频率必须至少是变化频率的 2 倍**。
- 不仅测主路径（Happy Path），还必须由 `gsd-nyquist-auditor` 自动生成针对边缘边界、空状态、超时与网络故障的对抗性测试。
- 在提交代码前，必须先观察到测试确实能够 Red（红灯报错），再看到修复后进入 Green（绿灯通过），证明测试具备真实的防卫能力。

---

## 门禁分级：软警告与硬阻断（Advisory vs Blocker）

在交付链路上，GSD Core 明确区分了反馈的严肃程度：

- **硬阻断（Blocker）**：
  - 核心需求 REQ-ID 未满足。
  - 存在编译错误或单测未通过。
  - 发现了未解决的代码注入或目录逃逸风险。
  - 此时状态机严格锁死，禁止执行 `/gsd-ship`。
- **软建议（Advisory）**：
  - 模块复杂度微弱上升（由 Complexity Trigger 捕捉）。
  - 文档细节更新延迟。
  - 记录在案但已由人类明确豁免的技术债。

这种分层设计确保了团队既不会因为微不足道的琐碎格式问题瘫痪开发节奏，又绝不会把真正致命的架构隐患放行到生产环境中。

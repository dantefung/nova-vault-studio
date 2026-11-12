---
title: "ub-mode 工程纪律：把《代码整洁之道》翻译成 Agent 可校验的规则"
date: "2026-10-29"
source: "X：龙海《实测 Uncle Bob 的 ub-mode》"
url: "https://x.com/longhaiqwe123/status/2115286893663498696"
---

# ub-mode 工程纪律

> 大语言模型降低了**生成代码**的边际成本，但没有降低**维护系统**的复杂度。uB-mode 的价值在于：把「先让功能可用，再把代码写好」翻译成 Agent 能执行、**能用数字判定对错**的约束规则。

## 它是什么

| 项 | 内容 |
|---|---|
| 作者 | Robert C. Martin（Uncle Bob），2001 年《敏捷宣言》发起人之一，2008 年《代码整洁之道》作者 |
| 项目 | [unclebob/ub-mode](https://github.com/unclebob/ub-mode)，2026-10-26 公开发布，两天内 1200+ Star |
| 规模 | 整个仓库两个文件，核心是 **152 行的 SKILL.md** |
| 用法 | 放进 Claude Code / Codex / Grok 的技能目录，用 `/ub-mode` 调用 |
| 参考 | 精简自 [@poteto](https://github.com/poteto) 的 poteto-mode / pstack |
| 配套工具 | [crapper](https://github.com/unclebob/crapper)、[dryer](https://github.com/unclebob/dryer)、[mutator](https://github.com/unclebob/mutator)、[uml-viewer](https://github.com/unclebob/uml-viewer) |
| 语言支持 | 跨 6 种：Clojure、Java、Go、TypeScript / JS、Rust、Python |

## 三阶段治理结构

```text
第一阶段：先让功能可用（First Make it Work）
  → 数据模型 + 类型纪律 + TDD，建立前置防御
第二阶段：再把代码写好（Then Make it Right）
  → 三条审查规则 + 三个量化门禁工具
第三阶段：工程实践（Follow Practice）
  → 工作区里的四条 Agent 操作纪律
```

## 第一阶段：先让功能可用

要解决的问题很具体：**任务初期生成速度很快，但需求叠加后，模型不断在已有条件分支上追加判断，导致状态管理混乱，修复一个缺陷往往引发更多未知错误。**

### 最小改动与防冗余（Laziness Protocol）

| 规则 | 含义 |
|---|---|
| **One decision lives in one place** | 每一个业务判断在代码库中只能存在于单一位置，其他调用方统一复用 |
| **Ship the smallest edit that solves the problem** | 始终提交能解决当前问题的最小改动，防止产生非必要的额外修改 |

### 前置设计原则（Foundational Thinking）

- 在编写任何流程控制与分支逻辑之前，**先定义正确的数据结构（Data Shape）**
- 优先完成能简化后续开发的基础设施与底层设计
- 存在并发写入的场景，**禁止在不同组件间共享可变状态**

### 领域建模与类型纪律

| 规则 | 原文要点 |
|---|---|
| 领域结构阻断非法状态 | Put the domain in a structure that makes the illegal states impossible，并维护统一的领域术语表；现有代码已清晰且局部化就不要随意改 |
| 类型层面杜绝非法值 | Make the illegal value impossible to write |
| 边界解析一次 | Parse outside data once, where it comes in |
| 不屏蔽编译器 | Do not silence the compiler |

**类型纪律的判别联合示例**（反面 → 正面）：

```typescript
// 反面：isPaid 为 true 但缺 transactionId 的组合能通过类型检查
interface Order {
  id: string;
  isPaid: boolean;
  paidAt?: Date;
  transactionId?: string;
}
```

```typescript
// 正面：判别联合让非法组合在编译期被拒
type OrderState =
  | { status: "pending" }
  | { status: "paid"; paidAt: Date; transactionId: string };
```

注意边界：**类型断言与 `any` 会绕过检查**，外部输入在边界仍要做运行时校验——这正是「入口解析一次」与「不屏蔽编译器警告」两条规则存在的原因。

### 边界、幂等与状态隔离

| 规则 | 要点 |
|---|---|
| **Boundary Discipline** | 只在外部数据进入边界时完整校验，进入内部领域即信任；核心业务逻辑全部由纯函数实现 |
| **Make Operations Idempotent** | 同一操作重复执行或中断后重跑，最终状态必须一致 |
| **Separate Before Serializing Shared State** | 多个调用方无需修改同一对象时各自持有独立副本；必须共享可变状态时强制单一写入者（One Writer） |

### TDD 执行循环

1. 修改业务逻辑前，**必须先写一个执行失败的测试**
2. 确认该测试确实因预期的逻辑缺失而失败
3. 编写**仅能让该测试通过**的最小代码量
4. 若某场景确实无法写出有效测试，**禁止写无效测试充数**（If an honest test is impractical, do not write a bad one）

### 工程杠杆准则

| 准则 | 含义 |
|---|---|
| **Redesign From First Principles** | 不要在陈旧架构上直接堆新逻辑（Do not bolt a new requirement onto the old design）；先推演「若该需求从项目初就存在」的设计，再拆成小单元交付 |
| **Subtract Before You Add** | 引入新抽象或依赖前，先清理原有冗余 |
| **Outcome-Oriented Execution** | 始终以最终可自动检验的系统状态为目标；方案明确且可回滚时，允许重构过程中的临时中间状态 |
| **Attack the Premise** | 同一假设前提下连续两个修复方案失败时，先用一句话提炼底层假设、排查并解除不合理的模块职责，完成前禁止盲试第三次 |
| **Build the Lever** | 任务缺乏直观规范时，先手工完整实现一个标准单元，再写脚本或工具自动执行后续同类工作 |

## 第二阶段：再把代码写好

三条审查规则：

| 规则 | 要点 |
|---|---|
| **Fix Root Causes** | 先稳定复现再定位根因；「仅用来遮掩程序崩溃的防御性条件判断并不是真正的修复」 |
| **Sequence work into verifiable units** | 拆成粒度极小、可单独跑自动化测试的单元，逐个验证通过再推进 |
| **Test Behavior, Not Implementation** | 测试模拟外部调用者视角并断言其可观察结果；**若函数体清空不返回任何数据测试依然能通过，该用例无效，直接删除** |

### 三个量化门禁工具

三者构成**由浅入深的防御链条**，让「不依赖人工逐行审查」成为可能。

```text
dryer（源码层结构重复）
   ↓
crapper（函数级复杂度 × 覆盖率）
   ↓
mutator（测试用例本身的有效性）
```

#### 检查一：Crapper —— CRAP < 10

跨 6 种语言的**复杂度与覆盖率联合**计算工具，用软件度量学的 CRAP 公式给每个函数打分：

```text
CRAP = CC² × (1 − coverage)³ + CC
```

- **CC** = 圈复杂度，统计函数内分支决策点：if / for / while / switch-match / catch-except / 三元表达式 / `&&` / `||`，TypeScript 还含 `??` 与 `?.`
- **coverage** = 该函数测试覆盖率（0–1）

风险分档：1–5 低风险，5–30 值得注意，30+ 复杂且缺测试。ub-mode 要求 **每个函数 CRAP < 10**。

**阈值推论（重要）**：若函数 CC = 10，即使覆盖率 100%（此时 `(1−coverage)³ = 0`），CRAP 仍恰好等于 10，**依然不满足 < 10**。也就是说——**CC 达到 10 的函数只补测试无法达标，必须拆分**。反过来，圈复杂度只数分支，长的顺序执行代码分数仍可能较低。

实测调用参数：**crapper 默认阈值 30，要严守 < 10 必须传 `--threshold 9.99`**。

#### 检查二：Dryer —— 结构相似度 < 0.8

大模型生成代码时最容易**直接复用已有逻辑并只替换局部变量名**。dryer 检测的就是这类结构性重复。

- 只在**同一种语言内部**对比代码块
- 默认跳过少于 4 行、或归一化语法节点少于 20 个的短函数
- 归一化保留：调用的函数名、方法名、运算符、语法树嵌套形状
- 归一化剥离：局部变量名、字段名、字面量、Clojure 的 `:kind` 这类 keyword 数据
- 相似度 = 两个代码块**共有结构指纹数 ÷ 结构指纹并集数**（Jaccard）

```text
DUPLICATE score=0.89
  src/billing/invoice.clj:3-13
  src/billing/receipt.clj:3-14
```

ub-mode 要求**消除所有相似度 ≥ 0.8 的结构性重复**。实测调用参数：**dryer 默认阈值 0.95，需指定 `--threshold 0.8`**。

#### 检查三：Mutator —— 存活变异体全部 Killed

即使代码覆盖率 100%，也不能证明测试真的校验了业务逻辑。mutator 做**变异测试**：自动替换源码中选定的运算符或常量生成「变异体」，再跑一遍单元测试。

支持的替换：`+`→`-`、`>`→`>=`、`==`→`!=`、`&&`→`||`、`true`→`false`，TypeScript 里去掉可选链（`a?.()`→`a()`）。

| 变异体结果 | 判定 | 含义 |
|---|---|---|
| 单元测试失败 / 超时 | **Killed** | 测试成功阻断 |
| 单元测试仍全通过 | **Survived** | 测试覆盖存在盲区 |

**机制细节**：`target/mutation-workers` 下按 CPU 核心数创建并行工作目录（被修改文件及其相对导入复制一份，其余用软链接）；支持增量运行，后续只重跑上次存活的变异体与发生过改动的函数。**检测到存活变异体时进程返回退出码 3**。

**必补边界用例的经典例子**：规则是「满 100 元免运费」，代码写 `amount >= 100`，测试只覆盖 50 与 150。mutator 把 `>=` 换成 `>` 后测试依然通过 → 变异体存活 → 测试套件**遗漏了「金额恰好 100 元」这个临界点**。补上该断言后，变异体即被 Killed。

**两个必须知道的工程边界**：

1. **变异注入后导致编译报错，同样被计入 Killed** —— 所以「变异体被消除」不完全等同于「由业务断言发现了错误」。
2. **存活变异体通常意味着测试缺失，但也存在等价变异**（算子被替换但对外行为未变）—— 属于假阳性。

mutator 的三条处理要求：**Cover the uncovered**（补未覆盖代码的测试）、**Kill the survivors**（补边界断言阻断存活变异体）、**Delete dead code**（清理未被调用的无用代码）。

### 配套可视化：UML-Viewer

[uml-viewer](https://github.com/unclebob/uml-viewer) 只在 README 推荐、SKILL.md 未提：

- 把源码扫描与架构配置生成的结构图，与 `.metrics/` 下 **crapper 与 mutator** 的指标叠加显示（**不读 dryer 结果**）
- 每个包 / 类卡片的填充色由该模块的 **CRAP 评分（均值 + 标准差 μ + σ）** 与**变异测试消除率**共同决定，两者各换算成 1–10 级（10 最好）后取平均；缺数据按 1 级显示为红色
- 配置里写了 `:levels` 划分架构层级时，**从内层指向外层的反向依赖箭头画成红色**；不配置则不自动标红
- 点击类卡片上的方法名可直接打开源码定位定义

## 第三阶段：工程实践

四条 Agent 在工作区里的操作纪律：

| 规则 | 要点 |
|---|---|
| **Keep a Log** | 详细记录实施的每一个具体操作及其原因，任务结束时向用户汇报日志摘要 |
| **Guard the Context Window** | 保持主对话线程精简，把大体积日志或中间输出分流到外部文件或子任务，避免终端输出过快耗尽上下文配额 |
| **Worktree Cleanup** | 识别可安全清理的临时目录 / Git Worktree，确认无后台任务依赖后及时回收；**对尚未提交的本地修改必须暂停并交人工确认，禁止擅自覆写或清理** |
| **Commit and Push** | 小粒度有序提交，每个 Commit 须说明 **Why**（修改背景）、**What changed**（具体变更）、**How you proved it**（验证证据）。原文要求流程结束时推送主干，但团队协作应结合分支保护与 PR 流程 |

## 落地闭环：四步治理

| 场景 | 做法 |
|---|---|
| **全新项目** | 把 SKILL.md 作为**前置编码守则**注入 Agent——从第一天起就受防御性纪律约束，并在每次特性提交前配置 crapper / dryer / mutator 进自动化流程 |
| **存量项目** | 脱离开发流手敲命令不现实，要**通过与 Agent 对话**驱动「安装规则 → 部署门禁 → 全盘体检 → 量化重构」闭环 |

### 存量项目四步实录

```text
① 安装 Skill
   > https://github.com/unclebob/ub-mode 请安装这个 skill

② 部署量化门禁
   > 帮我安装好需要的工具
   → Agent 在项目根创建 tools/，把 dryer / crapper / mutator / uml-viewer 克隆到相邻目录

③ 全盘体检
   > 接下来我要怎么在项目中应用这个 skill 来优化项目代码？
   → Agent 给出优化路线，依次调用工具链扫描核心代码

④ 带约束的重构
   > 按照 skill 的规则，接下来要做什么
```

**关键调用参数**（默认值不满足规则线，必须显式覆盖）：

| 工具 | 默认阈值 | 规则要求 | 实测传参 |
|---|---|---|---|
| crapper | 30 | < 10 | `--threshold 9.99` |
| dryer | 0.95 | < 0.8 | `--threshold 0.8` |
| mutator | 全量扫描 | 绑定项目单测命令 | `--test-command`（如 Vitest） |

### 实测收敛结果

在真实开源项目 **oh-my-x**（TypeScript + WXT 的浏览器插件）上跑完后：

1. 先针对 mutator 扫出的**存活变异体**（集中在 `>=` 与 `>` 这类边界判断、空值处理）在单测套件中补齐临界数值断言；
2. 再针对 crapper 报告的高圈复杂度单体函数**拆分**，把杂糅的条件分支抽成独立纯函数；
3. 复检：函数评分全部降到 **CRAP 10 以下**，存活变异体**全部被精准阻断**，mutator 返回**正常零退出码**；
4. 全程**外部行为保持一致**——即重构前先固化现有行为，重构后验证未发生非预期改变。

## 与既有模式的关系

- [[patterns/ai-coding-three-pillar-system]] 给出「流程让 AI 可控 / 知识库让 AI 能积累 / 工具让 AI 接触真实环境」三支柱；ub-mode 是**支柱一（流程）的一个完整现成实现**，且第一次把「工具」换成了**可量化的门禁工具**。
- [[patterns/eval-mechanism]] 是 Agent 评测的通用方法；ub-mode 的 mutator 是**代码级评测**的工业级实现，且给出了明确的假阳性边界。
- [[patterns/agent-team-handoff-model]] 的「规则要分软硬」在此得到实证：SKILL.md 是软规则，crapper/dryer/mutator 是**动作发生前的硬挡**。

## 边界与风险

| 风险 | 说明 | 对策 |
|---|---|---|
| **变异测试成本高** | mutator 要为每个变异体跑一遍单测 | 支持增量运行；先用 `--test-command` 绑好测试命令，避免盲目全量扫描 |
| **编译错误被误判为阻断** | 变异注入导致编译报错也算 Killed | 复检时结合覆盖率与人工抽查，不把「全绿」当作「断言有效」 |
| **等价变异假阳性** | 算子替换但对外行为未变 | 存活变异体需人工判断是否等价等价后再补测试 |
| **默认阈值不满足规则线** | crapper 默认 30、dryer 默认 0.95 | 显式传 `--threshold 9.99` / `--threshold 0.8` |
| **只看指标会退化** | 拆函数能降 CRAP，但可能拆出无意义碎片 | 规则同时要求「Subtract Before You Add」与「外部行为不变」 |
| **Skill 越长越难执行** | 152 行 SKILL.md 已属长规则集 | ub-mode 的做法是**规则进 SKILL.md、判定进外部工具**，而不是把判定逻辑也写成自然语言 |

## 相关页面

- [[sources/longhai-uncle-bob-ub-mode-skill-review]] — 本文原始归档
- [[patterns/ai-coding-three-pillar-system]] — AI 编码三支柱
- [[patterns/eval-mechanism]] — 评测机制
- [[patterns/agent-team-handoff-model]] — 规则要分软硬
- [[patterns/vibe-coding]] — Vibe Coding 建站工作流（对照：功能跑通 vs 代码可维护）

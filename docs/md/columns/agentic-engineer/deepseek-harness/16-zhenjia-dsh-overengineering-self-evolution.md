---
title: "The deepseek of DeepSeek Harness：过度工程，还是为自进化而建？"
date: "2026-08-20"
source: "个人博客（zhenjia.dev / 郑嘉）"
url: "https://zhenjia.dev/posts/the-deepseek-of-deepseek-harness"
---

# The deepseek of DeepSeek Harness：过度工程，还是为自进化而建？

> 作者：郑嘉。基于 DSH 0.1.0 版本的深度拆解——从 Agent 基本组成到三种开发流派，从 DSH「一切皆插件」的架构设计到时空可组合性论文，再到 Agent Self-Evolution 的五级改进框架与 DSH 过度工程的本质判断。

<!-- more -->

2026 年 8 月，DeepSeek 发布了自己的 DeepSeek Harness（下面简称 DSH）。相比于我们常见的其他现成 harness（例如 Claude Code、Codex、OpenCode、Pi），它的发布还顺带了一篇看起来玄之又玄的论文和库——《A Programming Paradigm for Spatiotemporal Composability》（时空可组合性的编程范式），以及基于该论文的 Cordis 插件框架——并且它的设计看起来具有严重的过度工程。

本文写于 2026 年 8 月中，基于 0.1.0 版本的 DSH。

## 一、Agent 的基本组成

在开始之前先说清楚：一个 agent 到底由什么组成。

2026 年大家对 agent 的定义基本统一为 `Agent = Model + Harness`。更进一步，对于 harness 来讲，大家一般认为它至少包括以下两个部分：

- **上下文管理**：决定每次发给模型的请求里有什么、按什么顺序。例如系统提示词（claude.md/agent.md）、工具的定义、RAG/memory、skill，以及当前的系统状态（例如当前时间、运行系统等等）
- **工具接口**：模型能调用什么。例如文件操作（Read/Write/Edit）、命令执行（Bash）、网络请求（WebFetch/WebSearch）、数据库查询、MCP（Model Context Protocol）协议工具等

在生产环境中，一般还会有以下三个部分：

- **约束**：限定 agent 能做什么、不能做什么。例如工具权限控制（Claude Code 的低/中/高风险评级）、需要人工批准的操作（发通知、删除数据、git push）、沙箱隔离、资源限制（超时、内存、并发数）、故障安全默认值等等
- **验证**：检查 agent 做得对不对。因为现有的 transformer 结构导致 LLM 一定存在幻觉，所以不能通过 llm 的输出来判断它是否真的完成了某件事情，而是要通过检查它执行的结果。例如当 agent 说"退款成功"时，要去查数据库订单状态，发现状态确实是"已退款"才通过
- **纠正**：做错了怎么补救。因为生产环境中失败是常态（网络抖动、API 限流、文件占用等），agent 需要能够优雅地处理故障。核心原则是在确认无法恢复之前不暴露中间态

在有了模型、工具、上下文之后，不管是哪个 harness，实际上最核心的部分都是一段 **ReAct**（Reasoning and Acting，推理与行动）循环，也叫 agent loop：

```javascript
while (true) {
  // 1. 准备上下文：历史消息 + 可用工具 + 上一轮的工具调用结果
  const messages = buildContext(history, tools);

  // 2. 调用模型
  const response = await model.generate(messages);

  // 3. 检查是否结束
  if (response.stopReason === 'end_turn') {
    break; // 模型判断任务完成
  }

  // 4. 执行工具调用
  if (response.toolCalls) {
    for (const call of response.toolCalls) {
      const result = await executeTool(call);
      history.push({ role: 'tool', content: result });
    }
  }

  // 5. 记录模型响应
  history.push(response);
}
```

这个循环最关键的地方有两个。一个是模型输出了工具调用请求，这时 harness 会去调用工具并把结果放到上下文再发给模型。工具怎么调、参数长什么样，都写在发给模型的 schema 里，所以工具调用能力就是指令遵从：模型能不能根据 schema 选对工具、把参数拼对。另一个是模型自己输出了任务已经结束的判断，此时才会真正结束这个循环——这就是所谓的长时间任务能力。

> 注：此处的 agent loop 与 loop engineering 并不相通。agent loop 由模型自己判断循环是否结束；loop engineering 是用外部条件停循环，比如测试是不是全部通过。

## 二、Agent 开发的三种流派

现在 agent 开发基本可以分为下面三种流派：

1. **库**（Pydantic AI）：一切都需要自己从零手搓
2. **成品**（Claude Agent SDK）：agent 已经造好了，你的开发从第一行起就是在它预留的扩展点上放东西
3. **平台**（Eve）：把开发简化到了极致，你写的不是程序，是几个声明文件

以开发一个具有退款权限的客服 agent 为例。

### 2.1 库：Pydantic AI

```python
from pydantic_ai import Agent

agent = Agent(
    'deepseek:deepseek-v4',
    instructions='你是电商客服，处理订单查询和退款。',
)

@agent.tool_plain
def query_order(order_id: str) -> dict:
    """查询订单的状态和金额。"""
    return db.get_order(order_id)

@agent.tool_plain
def refund(order_id: str, amount: float) -> str:
    """给订单退款。"""
    order = db.get_order(order_id)
    if amount > order.paid:
        raise ValueError('退款金额非法')
    result = payment.refund(order_id, amount)
    assert db.get_order(order_id).status == 'refunded'  # 检测任务真的已经完成
    return result

result = agent.run_sync('订单 A1024 用户投诉重复扣款，核实后处理')
print(result.output)
```

金额检查和退完去查库确认都写在 `refund` 里，没有单独的 hook。循环和请求拼装在 `run_sync()` 里面。

### 2.2 成品：Claude Agent SDK

```typescript
const server = createSdkMcpServer({
  name: "support",
  version: "1.0.0",
  tools: [queryOrder, refund],
});

const checkRefund = async (input) => {
  const order = await db.getOrder(input.tool_input.order_id);
  if (input.tool_input.amount > order.paid) {
    return { permissionDecision: "deny", reason: "退款金额非法" };
  }
  return {};
};

for await (const msg of query({
  prompt: "订单 A1024 用户投诉重复扣款，核实后处理",
  options: {
    systemPrompt: {
      preset: "claude_code",
      append: "你是电商客服，处理订单查询和退款。"
    },
    mcpServers: { support: server },
    allowedTools: ["mcp__support__query_order", "mcp__support__refund"],
    hooks: {
      PreToolUse: [{ matcher: "mcp__support__refund", hooks: [checkRefund] }],
      PostToolUse: [{ matcher: "mcp__support__refund", hooks: [verifyRefundHook] }],
    },
  }
})) { /* ... */ }
```

`query()` 是产品入口，循环和权限系统都在里面。

### 2.3 平台：Eve

```
agent/
├── instructions.md          ← 系统提示词
├── tools/
│   ├── query-order.ts
│   └── refund.ts
└── hooks/
    └── audit-refund.ts      ← 订阅运行时事件（只读）
```

```typescript
// agent/tools/refund.ts
export default defineTool({
  description: "Refund a charge.",
  inputSchema: z.object({
    orderId: z.string(),
    amount: z.number().positive(),
  }),
  async execute(input) {
    const order = await db.getOrder(input.orderId);
    if (input.amount > order.paid) throw new Error("退款超过实付金额");
    return payment.refund(input);
  },
});

// agent/hooks/audit-refund.ts
export default defineHook({
  events: {
    async "action.result"(event) {
      const r = toolResultFrom(event.data.result, refund);
      if (r) auditLog.write(r);
      // 官方文档原话 "Handlers are observe-only. They cannot inject model context"
      // 查出退款有问题只能对外告警，反馈不回模型
    },
  },
});
```

写完这些文件，剩下的都不归你管：没有 main 函数，没有发消息的调用。部署上去之后，运行、存储、恢复、对话入口全是平台的。

### 2.4 三派核心边界

三种方案差别在核心的边界画在哪里：

| 流派 | 核心边界 |
|------|----------|
| Pydantic AI | 核心只有 `run_sync()` 里那一圈循环和请求拼装，其余全都交给你来改 |
| Claude Agent SDK | 核心是整个产品，循环、内置工具、权限系统、上下文管理都在里面，你的插件放在它预留的清单位置上 |
| Eve | 核心连运行环境都包括，循环、持久化、恢复、对话入口全在平台侧，你交出去的只有 agent 的内容物文件 |

开发者要关注的东西越来越少。但是与此同时，当你采用这些现成的东西、又不去修改它们的源代码的时候，你能改动的范围是受限的——受限于它开放出来的扩展点。

比如如果你想在消息拼装完成之后、发给 provider 之前用固定规则或者本地小模型对消息进行压缩和安全审核，三家的做法完全不同：

- **Pydantic AI** 有正式的位置，两个函数的事：`ProcessHistory(compress)` + `ProcessHistory(security_review)`
- **Claude Agent SDK** 没有这个位置：三十多个 hook 事件没有一个站在"请求已拼装、未发出"这里，唯一的路是把流量指到你自建的代理上，工程从两个函数变成维护一个中间层服务
- **Eve** 更加偏向声明式，可以通过 Vercel AI SDK 的 middleware 来解决：`wrapLanguageModel({ middleware: { transformParams: ... } })`

所以实际上，**这三种开发的流派的区别都只在于可自定义的插件的丰富程度。所谓的 Agent 开发实际上大多数是在各家框架或者 SDK 保留的核心之外进行插件的开发。**

插件的开发可以分为两部分：**插件本身的形态**（命令式代码 vs 声明式数据）和**组装的方式**（命令式注册 vs 声明式描述）：

| 流派 | 插件形态 | 组装方式 |
|------|----------|----------|
| Pydantic AI（库） | 命令式：带类型标注的函数 | 命令式：main 是你的，装饰器挂上去 |
| Claude Agent SDK（成品） | 声明式为主：文件、配置、MCP 服务 | 声明式：CLAUDE.md/skill/hooks 配置文件 |
| Eve（平台） | 命令式：defineTool/defineHook 的代码 | 声明式：文件树约定，放进哪个目录就挂到哪里 |

## 三、DSH：Everything is Plugin

DSH 与 Eve 相似，也是命令式的插件 + 声明式的组装，但是与 Eve 不同的是它极为开放，声称"一切皆插件"，整个 DeepSeek Harness 没有任何一个地方是核心，所有的地方都是插件。

还是以一个具有退款权限的电商客服 agent 为例，完整的项目是一个 npm 包：

```
agent/
├── shop-support.cordis.yml  ← 完整组合清单
├── AGENTS.md                ← 客服工作指令
├── package.json             ← 依赖：官方包 + @shop/dsh-tool-support
└── service.ts               ← TS SDK 驱动
```

yml 文件里的每一部分都是一个插件：

```yaml
# 对外 JSON-RPC 服务
- id: sdk-jsonrpc-server
  name: '@deepseek-ai/dsh-sdk-jsonrpc-server'

# 模型接入
- id: llm-deepseek
  name: '@deepseek-ai/dsh-llm-deepseek'
  config:
    thinking: enabled
    reasoningEffort: max

# 官方聚合包：一行装进 agent loop、会话日志、提示词组装、工具执行管线
- id: agent-spine
  name: '@deepseek-ai/dsh-agent-spine-demo'

# 自定义工具
- id: tools-support
  name: '@shop/dsh-tool-support'

# 会话持久化
- id: sessions
  name: '@deepseek-ai/dsh-session-persistence-jsonl'
  config:
    root: ./sessions

# 文件系统
- id: fs-local
  name: '@deepseek-ai/dsh-fs-local'
```

`tools-support` 那行指向的插件包要自己写——一个普通的 npm 包，入口是 Cordis 插件的 `apply(ctx)` 函数，有一点像 React 的写法：

```typescript
// @shop/dsh-tool-support 包的入口文件
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'query_order',
    description: '查询订单的状态和金额。',
    parameters: { order_id: { type: 'string', required: true } },
    async execute(args) { return db.getOrder(args.order_id) },
  }))

  ctx.tools.register(defineTool({
    name: 'refund',
    description: '给订单退款。',
    parameters: {
      order_id: { type: 'string', required: true },
      amount: { type: 'number', required: true },
    },
    async execute(args) { return payment.refund(args.order_id, args.amount) },
  }))

  // 执行前的金额检查
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (exec.name !== 'refund') return next()
    const order = await db.getOrder(exec.arguments.order_id)
    if (exec.arguments.amount > order.paid) {
      return { kind: 'deny', reason: '退款金额非法' }
    }
    return next()
  })

  // 执行后，检测任务真的已经完成
  ctx.on('tools/post-execute', async (exec, result, next) => {
    if (exec.name !== 'refund' || result.isError) return next()
    const order = await db.getOrder(exec.arguments.order_id)
    if (order.status !== 'refunded') {
      return { kind: 'block', feedback: [{ type: 'text', text: '退款接口返回成功但订单状态未变更，请核实' }] }
    }
    return next()
  })
}
```

验证那里的 `block` 会把这次调用的结果直接变成带纠正反馈的失败——和 Eve 那个只能对外告警的 hook 不同，**模型自己会看到失败原因**。

对外跑起来通过官方 TypeScript SDK 驱动这份组合：

```typescript
// service.ts
import { DeepSeekHarness } from '@deepseek-ai/dsh-sdk-client'

const harness = new DeepSeekHarness({
  launch: {
    command: 'dsh-jsonrpc-agent',
    args: ['shop-support.cordis.yml'],
    cwd: process.cwd(),
  },
  cwd: process.cwd(),
  provider: 'deepseek-official',
  model: 'deepseek-v4-pro',
})

export async function handleMessage(customerId: string, text: string) {
  const result = await harness.run(text, { sessionId: customerId })
  return result.finalResponse
}
```

上文那种压缩需求，在 DSH 里可以这样写：

```typescript
// @shop/dsh-compressor
export function apply(ctx: Context) {
  ctx.on('agent/pre-step', async (_payload, next) => {
    const decision = await next()
    if (decision.kind !== 'enter') return decision
    return { kind: 'enter', messages: await redactAndCompress(decision.messages) }
  })
}
```

挂在插件的地方叫 `agent/pre-step`，在这里你可以对这一轮即将要发出去的消息进行修改。装进清单同样是一行：

```yaml
- id: compressor
  name: '@shop/dsh-compressor'
```

甚至于连最核心的 agent loop 也是一个单独的 npm 包：

```yaml
- id: agent-loop
  name: '@deepseek-ai/dsh-agent-loop'
  config:
    agents: []
```

如果你想更改的话，把 `name` 换成自己写的 agent loop 包就可以了。

### 3.1 时空可组合性：一切皆插件的底层动机

DSH 和 Eve 的差别不在结构，在声明能覆盖到哪一层：Eve 的文件树里能声明的只有 agent 的内容物——工具、指令、审批，循环、持久化、压缩是平台的，声明不到；**DSH 的清单里这些全是插件**。

DSH 是 Eve 的形态，库的开放度。

而他最明显的过度工程也来自于此。为什么要把所有组件都做成插件？就拿 agent loop 来说，到 2026 年为止，大家的 Agent Loop 基本都是 ReAct。那它为什么还要构建一套如此开放的插件形态？谜底就在谜面上，随着 DSH 一起发布的时空可组合性论文，以及它的实现 Cordis，自己给了答案：**为了时空可组合性。**

- **时间可组合性**：软件还在跑、请求还在进的时候，能把里面某个组件换掉——对应到上面的清单，就是进程不重启，把 `agent-loop` 那一行换掉
- **空间可组合性**：当软件中的某一部分在运行时被换掉，软件本身需要知道新的这一部分是什么以及在哪里。整份 yml 是一个随时更新的花名册，写的是这个软件此刻需要哪些能力、各自由哪个包负责；换 `name` 之后，依赖这条能力的插件按登记卸掉再重新安装

> **Spatiotemporal composability: id is the interface, name is the implementation.**

综上所述，DSH 这明显的过度工程都是为了 Agent 在运行时能够最大限度的修改自身的代码，而这指向了 2026 年下半年开始最火的一个词：**Agent Self-Evolution**（自进化；也称 Recursive Self-Improving / RSI Agents）。

## 四、Agent Self-Evolution（自进化）

到目前为止把这件事阐释得最清楚的是 Lilian Weng 2026 年 7 月发表的《Harness Engineering for Self-Improvement》。

### 4.1 为什么自我改进发生在 Harness 层而非 Model 层

虽然从 2022 年至今，新模型的发布速度越来越快（2023 年平均每月发布 0.5 个新模型，2024 年约 0.9 个，2025 年约 2.2 个，到 2026 年 1 至 8 月已经升到平均每月约 2.5 个），但是让模型自行修改自身的权重、并且让这个修改在几十分钟内完成生效，到现在依然是不太可能的：

- 训练的稳定性问题（例如 DeepSeek V4 Pro 0813 半夜上线效果很差、被紧急下线）
- 评测的片面性（例如 Opus 5 跑分能赢 Fable 5，但实际使用体感却远远不如）

而修改 Harness 大多只是改几个 md 文件的事，连几十 B 参数的小模型都可以很快完成。

### 4.2 自我改进的五级

按改的东西分五级：

| 级别 | 改进对象 | 示例 |
|------|----------|------|
| 1 | 改提示词 | CLAUDE.md / rule.md / MEMORY.md |
| 2 | 改上下文结构 | Skill（有结构的上下文） |
| 3 | 改工作流 | Sub Agent 与 Dynamic Workflow |
| 4 | 改 Harness 代码 | Claude Code 的 `.claude/settings.json` hook |
| 5 | 改优化器自己的代码 | 让优化器自身考虑该把提示词改到哪里（md vs skill） |

DSH 选择如此过度工程地把所有的包都做到插件形态的答案便呼之欲出：**为了能够让 Agent 在运行时最大程度的去修改自身的 Harness 代码，并让这个改动实时生效。**

## 五、DSH 过度工程了吗

其实在运行时修改自身的代码或者配置并不是在 Agent 出现后才有的需求。在搜索、广告、推荐（搜广推）相关的业务里，早就出现了类似的需求，叫做离线学习（offline learning）和在线学习（online learning）：

| 学习方式 | 更新方式 | 更新周期 | 特点 |
|----------|----------|----------|------|
| **离线学习** | 攒日志→训练新模型→评测→发布 | 几小时到几天 | 训练过程易复现、评测和回滚 |
| **在线学习** | 服务运行期间持续增量更新 | 实时 | 数据和更新链路在线发生 |
| **近线学习** | 每隔几分钟或几小时批量更新 | 几分钟到几小时 | 介于离线和在线之间 |

那么至今为止，agent 已经有实时在线学习和进化的需求了吗？这个问题不能简单回答"有"或"没有"，要看"进化"改到了哪一层。

如果说的是运行中吸收任务反馈、更新记忆、用户状态或下一步的工作策略，这类需求已经存在；如果说的是 agent 在运行中自主修改 harness 的深层组件，甚至修改执行内核并立即替换生效，那么这目前仍主要是研究性需求和少数特定场景的需求，还没有成为通用 agent 产品的刚需。

从现成 harness 的实现来看，大多数产品目前只做到自主更新提示词或记忆这一层。至于 Harness 本身，虽然现在已经有 Capability Creation、better-harness 这样的工具，但它们还只停留在进化出对应的能力之后，由人工评测并且部署的阶段。

以 **Prime Agent** 为例（构建于 Pi 之上——一个和 DSH 相比，开放程度只差是否开放 Agent Loop 的 agent），它把"修改 Harness"放进了一条带评测和记录的 refinement 管线：agent 先提出改动，再运行任务或评测，只有被判定为有效的改动才会被保留，而不是放任 Agent 自己改完之后直接上线。

### 5.1 为什么自进化难

这也是在现在这个阶段 Agent 自进化很难像搜广推的在线学习那样做成在线自进化的原因：

| 对比维度 | 搜广推在线学习 | Agent 自进化 |
|----------|---------------|-------------|
| 反馈信号 | 客观（是否点击） | 主观（任务有没有做得更好） |
| 成本 | 便宜（单张显卡） | 昂贵（耗费 token） |
| 频率 | 高频（对内容的点击） | 低频（对 agent 产物评价） |
| 评测覆盖 | 直接可量化 | 评测集不能完全反映改动效果 |

**所以处在当下这个角度，对现在正在设计和开发 Agent 的团队而言，DSH 带有明显的过度工程。它的过度工程是为了运行时进化 Harness、并且立刻生效这件事预留的——这件事现在还不是刚需。**

---

## 文章速查

| 项目 | 内容 |
|------|------|
| **作者** | 郑嘉（zhenjia.dev） |
| **定位** | DSH 架构深度剖析 + Agent 自进化判断 |
| **三派对比** | 库（Pydantic AI）/ 成品（Claude Agent SDK）/ 平台（Eve），边界画在哪里 |
| **DSH 核心** | 一切皆插件 + Cordis 框架 + 时空可组合性（id = interface, name = implementation） |
| **自进化五级** | 改提示词 → 改上下文结构 → 改工作流 → 改 Harness 代码 → 改优化器代码 |
| **核心判断** | DSH 过度工程是为了运行时自进化预留的——现在还不是刚需 |
| **关键引用** | Lilian Weng《Harness Engineering for Self-Improvement》(2026-07-04) |

## 参考资料

- [Cordis 论文：A Programming Paradigm for Spatiotemporal Composability](https://github.com/cordiverse/paper)
- [Cordis 插件框架](https://github.com/cordiverse/cordis)
- [Lilian Weng: Harness Engineering for Self-Improvement](https://lilianweng.github.io/posts/2026-07-04-harness/)
- [AI Agent in Depth（李博杰）](https://bojieli.github.io/ai-agent-book/)
- [Prime Agent](https://github.com/PrimeIntellect-ai/prime-agent)

---

[← 回到 DSH 专栏](./index.md)
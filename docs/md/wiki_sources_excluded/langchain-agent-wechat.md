---
title: "Node 搭 Agent 实战：用 LangChain.js v1 手把手跑通公众号流水线"
date: "2026-08-05"
source: "唐成"
url: "https://mp.weixin.qq.com/s/yGL-i1N1DvrM8DNdFN4blw"
---

# Node 搭 Agent 实战：用 LangChain.js v1 手把手跑通公众号流水线

> 想上手 Agent 的人多半卡在同一处：ReAct、Harness、MCP、SubAgent、Skill 概念听了一堆，真动手却不知道这五块在一个真实项目里各自落在哪行代码、怎么拼。

这篇用 Node 生态最新的 LangChain.js v1，手把手搭一条真能跑的流水线——给个选题，Agent 自己查资料、写正文、排成公众号能直接粘贴的版式，产出一份带样式的 HTML。七步搭完，每步的坑都踩过、标了 file:line。

## 我们要搭什么

一个被「工程外壳」包着的 ReAct Agent，挂三件工具，跑完一条公众号生产链。

![流水线架构图](images/langchain-agent-wechat/001.png)

**五块零件的代码位置：**

| 概念 | 代码位置 |
|------|----------|
| ReAct Agent | `reactAgent.ts` |
| Harness Agent | `harness/{state,nodes,graph}.ts` |
| DeepSeek | `llm.ts` |
| 排版 Skill | `formatSkill.ts` |
| MCP | `mcp.ts` |
| 写作 SubAgent | `writerAgent.ts` |

## 选型：为什么是 LangChain.js + LangGraph.js

Node 能搭 Agent 的框架不少，Mastra、Vercel AI SDK 都行。但这个 demo 要同时演示 ReAct 循环和 Harness 外壳，LangGraph 的图模型几乎就是为 Harness 生的——节点是防护栏/验证器，边是回退循环，checkpointer 是上下文管理，一一对应。

加上 @langchain/mcp-adapters 是官方 MCP 适配器，SubAgent 用子图天然支持。

版本：langchain 1.5.4 / @langchain/langgraph 1.4.9 / @langchain/openai 1.5.5

---

## Step 1　接 DeepSeek：一行 baseURL

DeepSeek 走 OpenAI 兼容协议，用 `ChatOpenAI` 指过去就行（`llm.ts:12`）：

```typescript
new ChatOpenAI({
  model: tier === "pro" ? "deepseek-v4-pro" : "deepseek-v4-flash",
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
  temperature,
})
```

**坑①** 模型名别照抄旧资料。旧教程还写 `deepseek-chat`(V3)、`deepseek-reasoner`(R1)，现在已是 V4 时代，线上实测只剩 `deepseek-v4-flash` 和 `deepseek-v4-pro`，旧名字直接 404。

**坑②** 别用 `withStructuredOutput`，DeepSeek 在结构化输出模式下不稳，校验走确定性规则。

**分工**：flash 快、function calling 稳，给主控编排；pro 质量高，给写作 SubAgent。一份 demo 把两个模型都用上。

---

## Step 2　挂 MCP：工具是「动态发现」的

优雅的做法不是声明工具列表，而是让 Agent 自己发现远端有什么（`mcp.ts:7`）：

```typescript
const client = new MultiServerMCPClient({
  exomind: { transport: "stdio", command: "exomind", args: ["mcp"] },
});
const tools = await client.getTools();  // 动态发现，一个名字都不硬编码
```

`getTools()` 返回标准 LangChain 工具，直接进 Agent 工具集。本 demo 接的 exomind 一启动吐出 6 个工具（search/query/entity/relations/ingest/stats），Agent 根据描述自己决定调哪个。

**坑③** `@modelcontextprotocol/sdk` 是 peer 依赖，必须自己装，否则运行时 spawn 就炸。

**坑④** stdio 子进程会泄漏，退出前必须 `await client.close()`。

---

## Step 3　排版 Skill：为什么不能直接 npm 装 doocs/md

公众号排版 star 过千的头号项目是 doocs/md，但它装不来：

- 核心引擎 @md/core 是 private 且直接导出 .ts（没编译发布）
- @doocs/md-cli 是起 Express 服务的本地编辑器，不是一次性转换工具

但它的排版思路能抄：markdown 渲染 → 给元素挂 class → 把 CSS 内联进 `style=""`。最后这步内联，是因为微信会剥掉所有外部样式表，只有写在 style 属性里的样式才活下来。doocs 自己也 patch 了 juice 来做内联。照着自建（`formatSkill.ts:14`）：

```typescript
const md = new MarkdownIt({ linkify: true });
export function renderMarkdownToWeChatHtml(markdown: string) {
  const inner = md.render(markdown);
  const wrapped = `<div>${inner}</div>`;
  return juice.inlineContent(wrapped, THEME_CSS);
}
```

主题 CSS 借 doocs 默认主题，把它的 CSS 变量解析成具体值：`var(--md-primary-color)` → `#1e80ff`（经典蓝）。跑出来 100+ 处内联样式，粘进公众号就是成品。

**坑⑤** juice 11 没发 .d.ts，写个 ambient `declare module "juice"` 即可。

最后用 langchain 的 `tool()` 把它包成 `format_wechat` 工具——这就是本 demo 的「Skill」。

---

## Step 4　写作 SubAgent：把一个 agent 包成一个工具

SubAgent 的本质是「有独立上下文的子 agent」。写作是长任务、占 token，混在主控里会挤掉别的工具的推理空间，隔离出去后主控只看到「丢大纲进去，吐文章出来」。实现两步（`writerAgent.ts:14` 和 `:36`）：`createAgent` 造子 agent，再 `tool()` 包成 `delegate_to_writer`：

```typescript
const writer = createAgent({
  model: buildLlm("pro", 0.85),
  tools: [],
  systemPrompt: WRITER_PROMPT,
});

export const delegateToWriter = tool(async ({ brief, notes }) => ({
  article: (await writer.invoke({ ... })).messages.at(-1).content
}), {
  name: "delegate_to_writer",
  schema: z.object({ brief: z.string(), notes: z.string() }),
});
```

主控调它，实际跑了整个独立 ReAct 循环；对主控而言和 search、format_wechat 没本质区别——都是调工具拿结果。

**为什么不用 Command handoff**：handoff 适合 supervisor 转交给子图节点；本 demo 主控本身就是工具循环，delegation 单位就是工具调用，`tool()` 更自然。

---

## Step 5　组 ReActAgent：最容易踩的 API 坑

三件工具收齐，组主控（`reactAgent.ts:31`）：

```typescript
const react = createAgent({
  model: buildLlm("flash", 0.4),
  tools: [...mcpTools, delegateToWriter, formatWeChatTool],
  systemPrompt: REACT_PROMPT,
});
```

**坑⑥（最大的一个）** `createReactAgent` 在 LangGraph v1 已弃用。大多数博客还写着 `import { createReactAgent } from "@langchain/langgraph/prebuilt"`。v1 把它 deprecated，改用 langchain 包的 `createAgent`。两者都是 ReAct，但入参变了：

- 导入从 `@langchain/langgraph/prebuilt` 改到 `langchain`
- 模型字段 `llm` → `model`
- 系统提示词没有 `prompt`/`messageModifier` 字段了，叫 `systemPrompt`

**坑⑦** MemorySaver 只挂外层图，内层 `createAgent` 别再挂，双重 checkpointer 会让状态混乱。

---

## Step 6　套 HarnessAgent：防护栏 + 验证循环 + 上下文管理

最有生产味的一步。HarnessAgent 不是新框架，是用 StateGraph 把 ReActAgent 包一层，加三样东西——正好对应「Agent Harness」的定义。防护栏是两个节点（入口查选题、出口查产出非空）。

验证循环是一条条件回退边（`graph.ts:25`）：

```typescript
new StateGraph(HarnessState)
  .addNode("react", reactNode)
  .addNode("validator", validator)
  .addEdge("react", "validator")
  .addConditionalEdges(
    "validator",
    routeAfterValidator,
    ["react", "output_guardrail"]
  )
  .compile({ checkpointer: new MemorySaver() });
```

validator 检查「正文 ≥600 字 且 含 ## 小结」，不过就带反馈回退到 react 重写（`nodes.ts:52`）。反馈怎么传回 ReAct？包成 HumanMessage 塞进 messages——主控每次重跑都吃当前全部 messages，validator 加的那条 user 消息它才看得到，才知道「要补小结重写」。上下文管理就是外层这份 MemorySaver。

---

## Step 7　跑通，看日志

入口用 stream 拿每步更新，按消息类型打成 ReAct 三段式（`index.ts:60`）：

- AIMessage 有 tool_calls → 打 ACTION
- 纯文本 → 打 THOUGHT
- ToolMessage → 打 OBSERVE

**坑⑧** stream 跨重试会重复打，因为 react 节点每次返回整段 messages 历史，用 `Set<message.id>` 去重。

实跑「用 ReAct 模式构建一个能自我纠错的 Agent」，节选日志：

```
▶ ACTION   search({"keyword":"ReAct"})
◀ OBSERVE  search: {results:[...ReAct模式, Reflection模式...]}
▶ ACTION   delegate_to_writer({"brief":"..."})
◀ OBSERVE  delegate_to_writer: {"article":"## LLM 的'一本正经犯错'..."}
▶ ACTION   format_wechat({"markdown":"..."})
✉ FEEDBACK 首轮强制精修:补「## 小结」、≥600 字
▶ ACTION   delegate_to_writer(...)        # 带反馈重写
[validator] 校验通过(正文 6623 字)
[output] output/2026-08-04T13-24-07-593Z.html
```

中间那条 FEEDBACK 就是验证循环真的触发了：第一稿没达结构要求，validator 打回，主控带反馈重新委托写作、重新排版，第二轮放行。产出 6623 字正文 + 16KB 内联样式 HTML，浏览器打开是 doocs 经典主题成品，整段粘进公众号即可。

---

## 避坑清单

| # | 坑 | 解法 |
|---|-----|------|
| 1 | DeepSeek 模型名照抄旧资料（V3/R1） | 用 v4-flash/-pro，先 curl /v1/models |
| 2 | withStructuredOutput 不稳 | 校验走确定性规则 |
| 3 | mcp sdk 是 peer 依赖 | 自己装 |
| 4 | MCP stdio 子进程泄漏 | 退出前 client.close() |
| 5 | doocs/md 不能直接 npm 装 | 自建 markdown-it + juice，借主题 |
| 6 | createReactAgent 弃用、字段叫 systemPrompt | 用 langchain 的 createAgent |
| 7 | MemorySaver 双重挂状态乱 | 只挂外层图 |
| 8 | stream 跨重试重复打日志 | Set 去重 |

---

## 你能拿走什么

**一个能跑的 repo**：`node src/index.ts "选题"` 一条命令出 `output/*.md` + `*.html`，七步每个文件都在，typecheck 全过。

**一套 Node Agent 套路**：

- ReAct 用 `createAgent`
- SubAgent 用 `tool()` 包子 agent
- Harness 用 `StateGraph` + 条件回退边 + 外层 `MemorySaver`
- MCP 用 `MultiServerMCPClient` 动态发现
- Skill 用 `tool()` 包任何能力

换掉工具和 prompt 就能套到客服、数据分析、文档生成。

> Agent 不是玄学，它就是「一个会调工具的循环 + 一层会打回重做的外壳」。把这两件事在代码里落清楚，五块零件自然各就各位。
---
title: "从零构建Agent(四)：Function Calling"
date: "2026-10-12"
source: "微信公众号 / 从码农到工匠"
url: "https://mp.weixin.qq.com/s/mYuzKR48DsMKJapJ2MMyTg"
---

# 从零构建Agent(四)：Function Calling

> 作者在上一篇构建了基于 ReAct 的 Agent Loop 骨架，本文扩展出一组真正可用的 Function Calling 工具（read_file / write_file / edit_file / run_terminal_command / file_search），并讨论 Strict Mode 取舍、客户端校验、并发执行等关键工程细节。
> Demo 源码：[github.com/significantfrank/ZeroAgent](https://github.com/significantfrank/ZeroAgent)

上一篇我们构建了 Agent Loop 的核心骨架——一个基于 ReAct 的 while 循环，能够消费 SSE 事件流、识别工具调用，并将结果回填到对话上下文中。但其能力十分有限。

Agent 的能力边界，取决于它能调用什么工具。Claude Code 能读写文件、执行命令；Cursor 能搜索代码库、修改文件；Hermes 能管理定时任务、发送消息。这些 Agent 的"聪明"来自模型，但"能干"来自工具。

注意，Function Calling 有时候也叫 Tool Calling，业界会混用这两个词，表达的是一个意思。本文我们在上一篇的基础上，扩展出一组真正有用的 Function Calling 工具。

> 打个预告，作者会在 2026.10.23 的上海 QCon 现场签名售书《Harness 工程实战》。

## 1. 什么是 Function Calling

模型是"大脑"，但它没有手脚。它不能：

- 读取你磁盘上的文件
- 执行一条 shell 命令
- 搜索代码库中的某个函数

模型的输出只有文本。Function Calling 是一座桥梁：模型按照预定义的 JSON Schema 输出工具调用意图，Agent 在本地执行真正的操作，再把结果作为"观察"喂回模型。

为了在 Agent 中实现 Function Calling 能力，我们需要经历以下阶段：

**关键点**：模型不执行工具，它只产生调用意图。执行权永远在 Agent 侧。这意味着 Agent 可以做权限控制、参数校验、超时取消——这些都是模型无法自己管理的。

## 2. 工具定义

计算机世界实际上是最讲究契约精神的地方，各种协议，各种标准，本质都是在制定契约，从而让彼此可以通信，可以互联，可以交互。同样 Agent 和模型之间要实现 Function Calling，也需要有标准。

我们先看一下 Response API 制定的标准，这是我们和模型打交道的入口。

### 2.1 Responses API 的定义

查看 Responses API 的 Function Calling 文档，我们可以看到其对于 Function Calling 的 schema 定义：

| 字段 | 描述 |
|------|------|
| `type` | 必须是 `function` |
| `name` | function 名称（比如 `get_weather`） |
| `description` | function 描述，参数何时使用 |
| `parameters` | JSON 格式的函数入参 |
| `strict` | 严格模式，`true` 表示入参必须严格匹配，不能多也不能少 |

这个定义很清晰，不知道还有没有人记得 web1.0 时代的 WSDL 协议，其内核也是在定义 RPC 形式的 Function Calling，只不过采用的是 XML 格式。

### 2.2 FunctionTool 类型

上述是模型侧的 API，在 Agent 中，我们需要按照其 schema，定义 Agent 自己的类型 `FunctionTool`，其定义在 `src/types.ts` 中：

```typescript
export type FunctionTool = {
  type: 'function';
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  strict: boolean;
};
```

- `name`：工具的唯一标识，模型通过它来选择调用哪个工具。
- `description`：告诉模型这个工具做什么、什么时候该用它。描述的质量直接决定模型选对工具的准确率。
- `parameters`：JSON Schema，定义工具接受的参数。模型会按此 schema 生成 `arguments`。
- `strict`：是否开启 Strict Mode（严格模式）。开启后模型必须严格遵循 schema，不能添加额外属性。

### 2.3 5 个工具

本文我们新增了 5 个 Agent 实用工具，覆盖文件操作、命令执行和搜索：

| 工具名 | 功能 | 必需参数 | 可选参数 | strict |
|--------|------|----------|----------|--------|
| `read_file` | 读取本地文件 | `path` | `offset`, `limit` | false |
| `write_file` | 写入文件 | `path`, `content` | — | true |
| `edit_file` | 精确替换文件内容 | `path`, `old_text`, `new_text` | — | true |
| `run_terminal_command` | 执行 shell 命令 | `command` | — | true |
| `file_search` | grep 递归搜索 | `pattern` | `path` | false |

以 `read_file` 为例，其工具定义如下：

```typescript
export const readFileTool: FunctionTool = {
  type: 'function',
  name: 'read_file',
  description: 'Read the contents of a local file. Returns the text content of the file.',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Absolute or relative path to the file to read.' },
      offset: { type: 'number', description: 'Line number to start reading from (1-indexed). Defaults to 1.' },
      limit: { type: 'number', description: 'Maximum number of lines to read. Defaults to reading all lines.' },
    },
    required: ['path'],
    additionalProperties: false,
  },
  strict: false,
};
```

### 2.4 Strict Mode 的取舍

注意 `read_file` 和 `file_search` 的 `strict` 为 `false`，其余为 `true`。这不是随意的选择。

Strict Mode 开启时，模型必须输出且仅输出 schema 中声明的属性。但 Responses API 的 strict 模式要求所有属性都必须在 `required` 中——不能有可选属性。这意味着如果 `read_file` 开启 strict，`offset` 和 `limit` 就必须变成必需参数，模型每次调用都必须传值，哪怕用户只想读整个文件。

所以当工具需要可选参数时，只能关闭 strict，靠 Agent 侧的参数校验来兜底。这是当前 Responses API 的一个限制。

所有工具通过 `allTools` 数组注册到 Agent：

```typescript
export const allTools: readonly FunctionTool[] = [
  weatherTool,
  readFileTool,
  writeFileTool,
  editFileTool,
  runTerminalCommandTool,
  fileSearchTool,
];
```

Agent Loop 在每次请求时将完整的工具列表发送给模型：

```typescript
const request = {
  model: options.model ?? this.#model,
  input: conversation,
  tools: allTools,
  parallel_tool_calls: true,
  // ...
};
```

`parallel_tool_calls: true` 允许模型在一轮中并行请求多个工具调用，Agent 会并发执行它们。

## 3. 工具实现

### 3.1 文件操作三件套

#### read_file

读取文件内容，支持 `offset`（起始行）和 `limit`（行数）实现分页读取：

```typescript
async function handleReadFile(args: {
  path: string;
  offset?: number;
  limit?: number;
}): Promise<string> {
  const content = await fsReadFile(args.path, 'utf-8');
  const lines = content.split('\n');
  if (lines.length > 0 && lines.at(-1) === '') lines.pop();
  const offset = args.offset ?? 1;
  const start = Math.max(0, offset - 1);
  const end = args.limit !== undefined ? start + args.limit : lines.length;
  const selected = lines.slice(start, Math.min(end, lines.length));
  return selected.map((line, i) => `${start + i + 1}|${line}`).join('\n');
}
```

输出带行号前缀（`1|hello`），方便模型在后续推理中精确引用行号。

> 这里有一个容易被忽略的细节：文件末尾的换行符会在 `split('\n')` 后产生一个空字符串元素，需要手动 `pop` 掉，否则模型会看到一个不存在的"空行"。

#### write_file

写入文件，不存在则创建，存在则覆盖：

```typescript
async function handleWriteFile(args: { path: string; content: string }): Promise<string> {
  await fsWriteFile(args.path, args.content, 'utf-8');
  return JSON.stringify({
    path: args.path,
    bytes_written: Buffer.byteLength(args.content, 'utf-8'),
  });
}
```

返回 `bytes_written` 而非文件内容——模型不需要看到它刚写入的东西，只需要确认写入成功及写入量。

#### edit_file

精确替换文件中的文本片段。这不是全量重写，而是定位修改：

```typescript
async function handleEditFile(args: {
  path: string;
  old_text: string;
  new_text: string;
}): Promise<string> {
  const content = await fsReadFile(args.path, 'utf-8');
  const occurrences = content.split(args.old_text).length - 1;
  if (occurrences === 0) {
    throw new Error(`old_text not found in ${args.path}`);
  }
  // ... 替换并写回
}
```

### 3.2 命令执行（run_terminal_command）

执行 shell 命令，使用 `grep` 做递归搜索：

```typescript
async function handleFileSearch(args: {
  pattern: string;
  path?: string;
}): Promise<string> {
  try {
    const result = await exec(
      `grep -rn ${JSON.stringify(args.pattern)} ${JSON.stringify(args.searchPath)}`,
      { maxBuffer: 1024 * 1024, timeout: 30_000 },
    );
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error) {
    const execError = error as { code?: number; stdout?: string; stderr?: string };
    if (execError.code === 1) {
      stdout = execError.stdout ?? '';
      stderr = execError.stderr ?? '';
    } else {
      throw error;
    }
  }
  return JSON.stringify({ matches: stdout, stderr });
}
```

> 这里有一个经典的 grep 陷阱：grep 在没有匹配到任何内容时以退出码 1 退出，而 Node.js 的 `exec` 会将非零退出码视为错误并抛出异常。如果我们不处理这个情况，"没搜到东西"就会变成一个工具错误，模型可能会误以为出了问题。
>
> 正确做法是捕获退出码 1，将空结果正常返回给模型。只有退出码 2（真正的错误，如目录不存在、正则非法）才向上抛出。

### 3.3 Agent Loop 中的工具集成

在上一篇 Agent Loop 中，工具执行部分只有简单几行。本章的循环逻辑不变，但工具列表从单个 `weatherTool` 变成了 `allTools`，执行路径更加完整。以下是 Agent Loop 中工具执行的关键片段：

```typescript
// 模型返回了 function_call，收集到 calls Map 中
const callList = [...calls.values()];

// 并发启动所有工具调用
const pendingResults = callList.map((call) => ({
  call,
  result: executeTool(call),  // 立即返回 Promise，不 await
}));

// 将 function_call 追加到 conversation
for (const call of callList) {
  conversation.push(call);
}

// 逐个 await 结果并回填
for (const { call, result: pendingResult } of pendingResults) {
  yield { type: AgentEventType.ToolCall, step, call };
  const result = await pendingResult;
  conversation.push({
    type: 'function_call_output',
    call_id: result.callId,
    output: result.output,
  });
  yield { type: AgentEventType.ToolResult, step, ...result };
}
```

注意 `pendingResults` 的构造方式：`executeTool(call)` 返回 Promise，但不立即 await——所有工具的 Promise 被同时创建，实现并发执行。然后在第二个循环中逐个 await，按调用顺序产出 `ToolCall` 和 `ToolResult` 事件。

回填到 conversation 的内容有两项：`function_call`（模型产生的调用意图）和 `function_call_output`（Agent 执行的结果）。下一轮请求时，模型能看到自己调了什么、得到了什么，据此决定继续调用工具还是给出最终答案。

## 4. 工具使用

我们的 Agent 虽然还是很简陋，但因为有文件读写、执行命令工具的加持，也能像 Claude Code 一样写代码了。

启动我们的 Agent，进入 Console 界面，输入下面的提示词：

> 在 tmp 文件夹下, 写一个简单的 HTML 贪吃蛇游戏

可以看到，模型会先调用 terminal 命令创建 tmp 目录，模型返回给 Agent 进行 Function Calling 的内容如下：

```json
{
  "type": "function_call",
  "call_id": "call_ebbe0b1fe4ca4599acf6f648",
  "name": "run_terminal_command",
  "arguments": "{\"command\":\"mkdir -p tmp && ls\"}"
}
```

Agent 执行完命令之后，会把下面的信息加入到 conversation 上下文中：

```json
{
  "type": "function_call",
  "call_id": "call_ebbe0b1fe4ca4599acf6f648",
  "name": "run_terminal_command",
  "arguments": "{\"command\":\"mkdir -p tmp && ls\"}"
},
{
  "type": "function_call_output",
  "call_id": "call_ebbe0b1fe4ca4599acf6f648",
  "output": "{\"stdout\":\"README.md\\ndist\\ntmp\",\"stderr\":\"\"}"
}
```

可以看到通过 `call_id` 进行关联，模型知道 function_call 的结果是在 `function_call_output` 中，其结果显示是成功的，可以进行 HTML 游戏编写了。

模型写好代码之后，会用类似的方式，通过 `write_file` 工具将结果保存到 tmp 目录下，一个简易的贪吃蛇游戏就已经做好了。

## 5. 总结

本文从上一篇 Agent Loop 出发，构建了一组真正可用的 Function Calling 工具集。核心要点：

- **工具定义决定能力边界**：`description` 影响模型选对工具的准确率，`parameters` schema 约束模型的输出格式，`strict` 模式在可选参数场景下需要取舍。
- **错误是模型的信号**：工具执行失败不应 crash Agent，而应将清晰的错误信息回传给模型，让它自我修正。
- **客户端校验不可省**：关闭 strict mode 后，Agent 必须自己做运行时参数校验。
- **系统工具的行为差异**：如 `grep` 退出码 1 是"无匹配"而非错误，这类差异需要显式处理。
- **并发执行 + 顺序回填**：工具 Promise 并发创建，结果按调用顺序产出，兼顾性能和可预测性。

这些工具让 Agent 从"只会聊天"变成了"能读写文件、执行命令、搜索代码"的实干家。但在真实场景中，Agent 还需要更强的能力——比如动态注册工具、工具执行超时、结构化输出等。这些内容会在后续文章展开。

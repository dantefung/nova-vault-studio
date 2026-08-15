---
title: "LLM 与 Chat Completion API"
date: "2026-06-14"
source: "沈盟"
url: "https://mp.weixin.qq.com/s/VLSS5UxZlotzBDqZKmghxA"
---

# LLM 与 Chat Completion API

> LLM 生成文本的本质：根据前面的文字，猜下一个最可能出现的词。一个字一个字地往外蹦，直到生成结束标记。

## 1、LLM 生成文本的本质

你输入「今天天气真」，它算出下一个最可能的词是「好」，于是输出「好」。然后把「今天天气真好」作为新的输入，继续猜下一个词。一个字一个字地往外蹦，直到生成结束标记。

## 2、Chat Completion API 的核心结构

```python
response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=messages,
    temperature=0.7,
)
```

其中 `messages` 是最重要的参数——它决定了 LLM 看到什么信息，也就决定了 LLM 会生成什么回应。

## 3、消息与角色

`messages` 是一个列表，每条消息有两个字段：`role`（角色）和 `content`（内容）。

| 角色 | 说明 |
|------|------|
| `system` | 系统指令，定义 AI 的行为规则 |
| `user` | 用户的输入 |
| `assistant` | 大模型的回复 |
| `tool` | 工具执行结果 |

System Prompt 是 Agent 行为的控制器，改一行 system prompt，AI 的回答风格就可能完全不同。

## 4、Token 与上下文窗口

### 4.1 Token

Token 是 LLM 处理文本的最小单位。一个 Token 不等于一个字符，也不等于一个单词。

- 常见英文单词 ≈ 1 个 Token（如 "hello" = 1 token）
- 常见中文词 ≈ 1-2 个 Token（如「你好」≈ 1 token）
- 生僻词、专业术语会被拆成多个 Token

可用 `tiktoken` 库来近似计数（DeepSeek 等非 OpenAI 模型用 `cl100k_base` 做近似）：

```python
import tiktoken

encoding = tiktoken.get_encoding("cl100k_base")
text = "你好，我是一个 AI 助手"
tokens = encoding.encode(text)
print(f"Token 数: {len(tokens)}")
```

### 4.2 上下文窗口

每个模型有一个上下文窗口（Context Window），单次请求中所有 messages 的 Token 总数不能超过这个窗口大小。

| 模型 | 上下文窗口 | 大约能装多少字 |
|------|-----------|---------------|
| GPT-5.5 | 1M | 约 75 万字中文 |
| Claude Opus 4.7 | 200K | 约 15 万字中文 |
| DeepSeek-V4 | 1M | 约 75 万字中文 |
| GLM-5.2 | 1M | 约 75 万字中文 |

### 4.3 Token 费用

API 调用按 Token 计费，输入（messages）和输出（response）分别计价，所以对话内容越多，消耗的 Token 也越多，成本也就会更高。

## 5、生成参数

| 参数 | 说明 |
|------|------|
| `temperature` | 控制 LLM 输出的随机性，越接近 0 输出越确定，越接近 1 输出越随机 |
| `max_tokens` | 控制生成的最大长度，限制的是输出的 Token 数，不影响输入 |

注意：`max_tokens` 如果设得太小，LLM 的回答会被截断。

## 6、完善 Agent 的对话循环

完整的对话循环需要处理：保留上下文（把 assistant 回复也追加进 messages）、控制上下文长度（超出窗口时裁剪或压缩）、处理流式输出、设置合理超时、错误重试等。
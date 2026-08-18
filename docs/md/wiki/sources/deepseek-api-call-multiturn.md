---
title: "大模型 API 调用和多轮对话"
date: "2026-06-13"
source: "沈盟"
url: "https://mp.weixin.qq.com/s/0Hpvw5SRdZSD5_y4-unmmA"
---

# 大模型 API 调用和多轮对话

> DeepSeek API 兼容 OpenAI，所以可以使用 OpenAI 的方式来调用 DeepSeek。大部分模型的 API 都兼容了 OpenAI，改一下 `base_url`、指定 `model` 和 `api_key` 就可以了。

## 1、准备环境

```bash
mkdir code && cd code
pip install openai
```

Python 版本 3.11.5

## 2、调用 DeepSeek 模型

```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://api.deepseek.com",
    api_key=os.environ["DEEPSEEK_API_KEY"],
)

messages = [{"role": "user", "content": "你好，介绍下你自己"}]
resp = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=messages,
)
print(resp.choices[0].message.content)
```

![调用示例](images/deepseek-api-call/001.png)

## 3、加上对话循环

单个问答没什么用，加上循环让对话能持续进行：

```python
messages = []
while True:
    user_input = input("你: ")
    if user_input.lower() in ("exit", "quit"):
        break
    messages.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
    )
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})
    print(f"AI: {assistant_message}\n")
```

![多轮对话示例](images/deepseek-api-call/002.jpeg)

> 注意第二问「附近有什么好吃的」——模型理解了「附近」指的是北京，因为 messages 列表里保留了之前的对话。这就是最基础的「记忆」——**把历史对话塞进每次请求里，模型就能理解上下文**。

但这个实现非常粗糙：messages 列表会越来越长，最终超出模型的上下文窗口；对话存在内存里，程序关了就没了；模型只能生成文本，调用不了任何工具——这些问题后面逐个解决。

## 4、完整代码

```python
# 运行方式：pip install openai
# 将 your-api-key 替换为你的 DeepSeek API Key，保存为 agent.py 后运行：python agent.py

from openai import OpenAI

client = OpenAI(
    base_url="https://api.deepseek.com",
    api_key="your-api-key",
)

messages = []
print("=== AI Agent 对话程序 ===")
print("输入消息开始对话，输入 exit 或 quit 退出")

while True:
    user_input = input("\n你: ")
    if user_input.lower() in ("exit", "quit"):
        break
    messages.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
    )
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})
    print(f"AI: {assistant_message}")
```
---
title: "工具机制与 Function Calling"
date: "2026-06-22"
source: "沈盟"
url: "https://mp.weixin.qq.com/s/9lPoiUbS6s1OlwI2R_KYRA"
---

# 工具机制与 Function Calling

> Agent 需要工具，LLM 的知识是训练时「背」进去的——它不知道今天天气如何，不能发邮件，也不能操作数据库。Function Calling 让 LLM 在需要时主动发起工具调用。

## 一、Agent 为什么需要工具

LLM 有一个关键能力：它理解自然语言，能判断该调用什么工具、传什么参数。你只需要告诉它「你有哪些工具可以用」，它就能在需要时主动发起工具调用。

## 二、Function Calling 的三步流程

1. **判断**：把用户消息和工具定义一起发给 LLM，LLM 判断需不需要调工具。如果需要，返回的是结构化的工具调用请求（告诉你要调哪个函数、传什么参数）
2. **执行**：你根据 LLM 的请求，调用对应的函数，拿到结果
3. **回传**：把函数结果作为一条 `tool` 角色的消息追加到 messages 里，再发给 LLM，LLM 基于结果生成最终回复

> 注意：LLM 自己不会执行任何工具，它只是告诉你「应该调什么函数、传什么参数」，真正执行工具的是你的代码。**Function Calling 不是 LLM 在帮你跑代码，而是 LLM 在告诉你该跑什么代码。**

## 三、定义一个工具

用天气查询为例，定义工具的 Schema：

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "查询指定城市的天气信息",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {"type": "string", "description": "城市名称，如 '北京'、'上海'"}
      },
      "required": ["city"]
    }
  }
}
```

| 字段 | 作用 | 注意事项 |
|------|------|----------|
| `name` | 函数名，LLM 用它来指定要调哪个工具 | 要能看懂意思，如 `get_weather` |
| `description` | 描述这个工具做什么 | **决定了 LLM 能不能正确判断什么时候该用** |
| `parameters` | 参数定义，JSON Schema 格式 | — |
| `required` | 标记必填参数 | — |

> `description` 是最容易被忽视但又最重要的字段。如果描述不清楚，LLM 会在该调用的时候不调用，或者在不该调用的时候乱调用。

## 四、完整的工具调用流程

```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://api.deepseek.com",
    api_key=os.environ["DEEPSEEK_API_KEY"],
)

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "查询指定城市的天气信息",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "城市名称"}
            },
            "required": ["city"]
        }
    }
}]

def get_weather(city: str) -> str:
    weather_data = {
        "北京": "晴，气温 18-28°C，空气质量良好",
        "上海": "多云，气温 22-30°C，有轻微雾霾",
        "深圳": "阵雨，气温 25-32°C，注意带伞",
    }
    return weather_data.get(city, f"未找到{city}的天气数据")

tool_map = {"get_weather": get_weather}

messages = [{"role": "system", "content": "你是一个智能助手，可以查询天气。"}]

while True:
    user_input = input("你: ").strip()
    if not user_input or user_input.lower() in ("exit", "quit"):
        break
    messages.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
        tools=tools,
    )
    choice = response.choices[0]
```

## 五、finish_reason 详解

`finish_reason` 是判断 LLM 行为的关键字段：

| 值 | 含义 | 处理方式 |
|----|------|----------|
| `stop` | 正常结束，生成了文本回复 | 直接展示给用户 |
| `tool_calls` | LLM 请求调用工具 | 执行工具，把结果回传 |

## 六、多工具编排

实际 Agent 不会只有一个工具。当有多个工具时，LLM 根据上下文判断调用哪个（或同时调用多个）。

## 七、执行循环：可能多轮

一个任务可能需要多次工具调用。比如用户说「帮我查北京天气，如果下雨就查上海的」：

1. LLM 返回 tool_calls → 执行 `get_weather("北京")`
2. 把结果回传 → LLM 判断北京下雨了
3. LLM 再次返回 tool_calls → 执行 `get_weather("上海")`
4. 把结果回传 → LLM 生成最终回复

这就是 Function Calling 循环，一个任务可能触发多轮「调用-回传」。

## 八、完整代码

将天气查询和时间查询两个工具整合成一份可以直接运行的完整代码，完成多轮工具调用的闭环。
---
title: "Hello Harness 04 · Model Provider 抽象：Agent 不应该知道 OpenAI / Anthropic / Gemini 的区别"
date: "2026-08-18"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/CXTkX2V90hSif05HrK3VRQ"
---

# Model Provider 抽象：Agent 不应该知道模型服务商

> Hello Harness 专栏第 04 篇。整个项目第一次真正的架构抽象——定义与 Provider 无关的 Model 接口，让应用层不再 import OpenAI SDK。

---

## 核心问题

前三章一直在「调 API」。模型名是环境变量，端点是环境变量，Key 是环境变量，连调用姿势都是 OpenAI 的形状。模型在代码里没有姓名——只是散落在 main 函数里的三四个环境变量。

| 问题 | 具体表现 |
|------|---------|
| 调用散落 | getApiKey()、client、streamChat() 全是 index.ts 自由代码 |
| 换商服 = 改代码 | 每一处 `chat.completions` 都要改，重新学 SDK |
| 模型无姓名 | 没有类型、没有接口，只是两个散装环境变量 |

## 解决三件事

1. 定义与 Provider 无关的 **Model 接口**，讲清楚「模型能干什么」
2. 把 OpenAI 实现收进 `src/model/openai.ts`，应用层不再 import SDK
3. 换服务商从「改代码」降级为「换一个实现文件」

## 核心收获

- **换 Provider 塌成一个文件**：切到 Gemini 只动 `openai.ts`，应用层纹丝不动
- **应用层变干净**：`index.ts` 里再也搜不到 `OpenAI`
- **可测试性解锁**：写一个 `FakeModel` 就能不连网络跑通应用层
- **给 Stage 1 铺底座**：Agent Loop、Function Calling 全挂在 Model 接口上

## 遗留问题

- 工厂（Factory）如何选型——按环境变量选？还是注入？
- Provider 特有的能力（如 Tool、Vision）如何在统一接口下表达
- 多 Provider 并存（比如同时用 DeepSeek 和 Gemini 做路由）怎么处理

> 📎 完整原文见知识库：[wiki/sources/hello-harness-04-model-provider.md](../../../wiki/sources/hello-harness-04-model-provider.md)

---

[← 专栏首页](./index.md)
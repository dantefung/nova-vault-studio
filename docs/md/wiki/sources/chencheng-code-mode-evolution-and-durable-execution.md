---
title: "陈成（@chenchengpro）：从 Tool Call 到 Code Mode 的演进脉络——工具爆炸、沙箱串联与确定性重放"
date: "2026-11-03"
source: "X/Twitter"
author: "陈成 (@chenchengpro)"
url: "https://x.com/chenchengpro/status/2117452147822673956"
---

# 陈成（@chenchengpro）：从 Tool Call 到 Code Mode 的演进脉络——工具爆炸、沙箱串联与确定性重放

> 深入剖析智能体工具调用范式演进：从早期少工具到多工具/MCP 导致的上下文膨胀与渐进披露，再到单轮只能做一件事引发的往返开销；Code Mode 将全部工具收归单一 exec(code) 沙箱由模型写 TS/Python 串联执行。针对 Code Mode 缺乏失败恢复机制的短板，指出 Pi Durable 的确定性重放（Deterministic Replay）是解决断点续跑的关键路径。

<!-- more -->

recommended reading.

不错的 code mode 科普文，就是「只剩一个 Tool」有点标题党了。

tool call 的演进过程是这样的。早期只给几个工具，因为模型在大目录里选不准；后来几十个工具加一堆 MCP server，上下文撑不住，于是有了 tool search 和渐进披露。剩下的问题是一轮基本只能做一件事（最多一批互不依赖的调用），每个结果都要回到 history 里，模型再想一次才能走下一步。Code Mode 把所有工具收成一个  exec(code) ，模型写一段 TS 或 Python，在沙箱里把调用串起来跑。

不过文章没有讲失败恢复，评论区聊的比较多的也是这个。感觉 Pi Durable 的确定性重放可能是其中一个解。

https://www.philschmid.de/code-mode

## 相关页面

- [[sources/philschmid-why-agents-will-only-have-one-tool]]
- [[sources/fanbing-dsh-superagent-engineering-common-sense]]
- [[concepts/durable-execution]]
- [[concepts/agent-token-architecture]]

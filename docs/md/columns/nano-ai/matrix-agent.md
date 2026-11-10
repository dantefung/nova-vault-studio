---

title: "Agent 是怎么工作的"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/matrix/agent/"

description: "一步一步看 Agent 跑起来：每转一圈循环，上下文就长一截。从一次调用、工具调用、Agent Loop，到上下文管理、规划、记忆、MCP、子 Agent 和一个完整的 coding agent。"

---



# Agent 是怎么工作的



第 1 章 / 共 10 章



## 一次 LLM 调用：模型没有记忆



模型本身不记得任何事。你每次都要把整段对话重新发过去。



Agent 的最小单元，就是一次普通的模型调用：你发一个 
`messages`
 数组过去，模型回一段话。简单，但有一个性质决定了后面所有章节：**模型是无状态的** 。两次调用之间，服务器不会替你记住任何东西。



下面是一段两轮对话。先告诉模型“我叫小王”，再问“我叫什么”。最后做个对照：只发第二句话，会怎样。



### 逐格播放左边是代码跑到哪一行，右边是此刻的上下文



system + toolsuserassistant



**chat.py** 9 行





    messages = [{"role": "user", "content": "我叫小王。"}]



    resp = client.messages.create(system=SYSTEM, messages=messages)



    messages.append({"role": "assistant", "content": resp.content})



    messages.append({"role": "user", "content": "我叫什么？"})



    resp = client.messages.create(system=SYSTEM, messages=messages)



    # 对照：换一个新的 messages，只放第二句



    resp = client.messages.create(system=SYSTEM,



        messages=[{"role": "user", "content": "我叫什么？"}])



**上下文 / messages**



system≈20 tok



你是一个友好的助手。



user≈8 tok



我叫小王。



2 块≈ 28 tokens



1 / 8



初始化messages 里只有一条用户消息。system 是单独的参数，但模型同样会读到它。



### 每次调用发出去多少 token浅色 = 上一次已经发过的，深色 = 这一次新增的



第 1 次调用



—



第 2 次调用



—



对照



—



还没调用模型。



### 这一章要记住的



  1. **messages 就是全部记忆** 。聊天产品能“记住”上文，是因为客户端每次都把历史一起发了。

  2. **输入和输出分开计费** 。输出单价通常是输入的 4 到 5 倍，但输入会随轮数累积，长任务里输入往往才是大头。

  3. **消息在 user 和 assistant 之间交替** 。system 是单独的参数。后面会看到，工具结果也是以 user 的身份放进去的。



### 常见误区



  * “模型在服务器上记住了我的对话。” 在 API 层面没有。一些产品提供了服务端会话或记忆功能，但底层做的仍然是把内容放回上下文。



---



## 全部章节（交互式图解的完整文字版）



#### 一次 LLM 调用：模型没有记忆



模型本身不记得任何事。你每次都要把整段对话重新发过去。



#### 工具调用：模型只负责“说”



模型不会执行任何工具。它只是吐出一段结构化的 JSON，告诉你它想调什么、参数是什么。



#### Agent Loop：十几行代码的 while 循环



只要模型还想调工具，就执行、回填、再调一次；它不想调了，循环就结束。



#### 上下文窗口：越跑越长



每转一圈，历史都要重发一遍。上下文会撞上窗口上限，成本也跟着涨。



#### 规划：先列计划，再动手



规划不是什么新机制。它就是模型写进上下文的一段文字，或者一个专门的工具。



#### 记忆：上下文之外



短期记忆就是上下文，会话结束就没了。要跨会话记住，只能写进文件或数据库，下次再读回来。



#### MCP 与 Skills：工具怎么接，说明书怎么装



MCP 让工具可以即插即用，但工具定义每次都占上下文，接得越多越贵。Skills 的思路是只放目录，用到时再读全文。



#### 子 Agent：把脏活隔离出去



子 Agent 就是在一个工具里再跑一个 Agent Loop。它看过的大量中间内容留在自己的上下文里，只把结论交回来。



#### 失败模式：问题都在上下文里



死循环、编造工具、被外部内容带偏，把上下文从头读一遍，基本都能找到原因。



#### 实战：拆解一个 coding agent



把前面九章拼起来：从“这个测试挂了”到修好，完整看一遍上下文。





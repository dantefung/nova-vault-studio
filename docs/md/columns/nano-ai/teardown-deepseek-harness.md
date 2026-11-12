---

title: "拆机 DeepSeek Harness"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/teardown/deepseek-harness/"

description: "把 DeepSeek 开源的 Agent 框架一个部件一个部件拆开：先手写能跑的迷你版，再对照真实源码看差异。"

---



# 拆机 DeepSeek Harness




[从零手写 Agent](/agent/)
 · 第四部分



把 DeepSeek 开源的 Agent 框架一个部件一个部件拆开：先手写能跑的迷你版，再对照真实源码看差异。



基于 DSH 仓库 2026 年 10 月 30 日的提交（
`ce7073d`
）。项目还在开发者预览阶段，后续版本可能和文中不同。想先看一课讲完的简版，见
[拆解 DeepSeek Harness：一切皆插件](/articles/agent-deepseek-harness/)
；想先用一张图看懂整个插件架构，见
[一张图看懂 DeepSeek Harness](/dsh/)
。



  1. 
[01**整机图：百万行代码的 Agent，长什么样** 一句话在 DSH 里走一圈；整机五层；一切皆插件；一百多万行代码里，骨架只有几千行。](/teardown/deepseek-harness/overview/)


  2. 
[02**主板 Cordis：为什么连 Agent 循环都能换** 手写一块 150 行的迷你主板，故意找出三个 bug，再拿真实的 Cordis 跑同样的实验，看工业级框架怎么填坑。](/teardown/deepseek-harness/cordis/)


  3. 03**Agent 循环：一句话的完整旅程** 更新中

  4. 04**会话日志：为什么每一步都要记下来** 更新中

  5. 05**工具与沙箱：模型怎么安全地动手** 更新中

  6. 06**上下文管理：对话太长了怎么办** 更新中

  7. 07**子 Agent：一个 Agent 怎么指挥一群 Agent** 更新中

  8. 08**装机清单：同一个内核，怎么变成不同产品** 更新中

  9. 09**横向对比：DSH 和 Claude Code 等主流 Agent** 更新中



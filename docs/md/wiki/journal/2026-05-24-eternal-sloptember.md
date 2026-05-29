---
title: "geohot: AI Agents 是历史性错误"
date: "2026-05-24"
source: "geohot blog"
url: "https://geohot.github.io/blog/jekyll/update/2026/05/24/the-eternal-sloptember.html"
---

# The Eternal Sloptember | 永恒的 Sloptember

> 原文：[geohot](https://geohot.github.io/blog/jekyll/update/2026/05/24/the-eternal-sloptember.html)

---

## English Version

I'm calling it now: the adoption of AI agents into software development will be one of the most costly mistakes in the field's history. Agents cannot program, and it's taking longer and longer to realize that they can't. They are a highly sophisticated statistical model designed to mimic the distribution of programming. The output is broken, but in a way that's getting harder and harder to detect. Which is exactly what you'd expect from an increasingly accurate statistical model.

At first, I rejected this. I bought into the Twitter explanation of status anxiety. I define some of my self worth by my programming abilities, so wouldn't it make sense to get defensive around that loss? Deny the models can code for as long as I could to preserve my ego?

I mean, it's very clear they can solve math problems I couldn't hope to solve if I devoted my life to it. So why can't they program? Maybe I'm just not good enough of a programmer to recognize their genius.

I really tried for the last 6 months. I wrote some parts of tinygrad with agents. I reversed a USB ↔ PCIe chip with agents. But each time I suspected I could have done it better and faster manually. The agent frontloads all the progress, then gives you a slot machine lever to pull to hope it gets the polish done. It never quite gets there.

And in before, "you are using it wrong." I have tried all the different models, different harnesses, different prompts. It's not this. The people who say this would probably say the same thing about slot machines, you see, you have to bet 5 lines after you get a cherry no wonder you aren't winning!

I'm not saying that AI isn't useful, it clearly is. It's definitely a better Google for most searches. And whenever you need a quick prototype and don't care about polish, it is absurdly fast. But is it a software engineer? Not close to the bar at any company I have worked at. The key aspect is knowing when to use it and when not to.

I thought more about the self worth preservation thing. AFL found more bugs than LLMs and nobody felt that way about it. Chess and Go are more popular than ever. I cannot fucking wait until I have armies of robot associates I can trust to clean up my code! I don't fear loss of status, I almost think this is some kind of psyop to sell agents. Fear of loss is one of the only ways to make big companies move. Though I think in that fear they are making a big mistake.

Agents will end up hurting large organizations more than high performing individuals or small orgs. I've watched how my friends and coworkers have adopted these tools over the last 6 months. A trait you find in all high performing people is the ability to error correct, and they have mostly been good at seeing when slop is slop. It takes a bit to explore/exploit and tune the outer loops around when to use them, when to trust them, how to use them, etc... but I haven't seen anyone of them move to a model where they don't carefully read and understand each line, except in some confined domains.

Contrast this with a large organization. Much slower feedback loops, much less alignment. The bottom performers won't have that self check. They are the ones producing 10x output with the agents. What do you think is happening to the average output of that organization? What is happening to the average output of the world?

Agents will end up producing more code, more apps, and more features than ever before. It is a golden era for buckets and buckets of slop, and a dark age for gems of quality.

I hear that Apple is pushing AI on all their engineers. When people think in the abstract, they think AI will do all this stuff, but let's focus on a concrete example. Do you think macOS will get better or worse in the next 2 years?

When people see an artifact, they make assumptions about the process that was used to create it. Without even thinking about it, they assume the creator had a basically human state of mind. This assumption is no longer true. Things can be broken in ways that weren't previously possible, and old proxies of underlying quality like syntax and grammar are useless. AI produced artifacts are not produced by the same process as human ones, and this difference, while extremely subtle in statistics, makes itself obvious when you try to interact with and build on the artifact in human ways.

Without fully endorsing all their ideas, I'm now in the LeCun/Marcus camp on LLMs. I don't think models like this will ever be able to program, I think the process matters. I think that deep learning is still the solution, but real programming agents will need world models, not some RLVR shit that comments out the failing test and tells you all the tests are now passing.

The real story of this era will be who manages to avoid harming themselves in their AI psychosis.

---

## 中文版本

我现在就断言：AI Agent 在软件开发中的采用将成为该领域历史上最代价高昂的错误之一。Agent 不会编程，而人们越来越久才意识到这一点。它们只是一个设计用来模仿编程分布的高级统计模型。输出是坏的，但以一种越来越难检测的方式坏掉。这恰恰正是你对一个越来越精确的统计模型所期望的。

一开始，我拒绝这个观点。我信了 Twitter 上关于"地位焦虑"的解释。我把自己的某些自我价值定义为编程能力，那么在这个损失面前变得防御难道不是合理的吗？尽可能否认模型能写代码，来保护我的自尊？

我的意思是，它们能解决我倾尽一生都无法解决的数学问题，这是非常清楚的。那为什么它们不能编程呢？也许我只是不够优秀的程序员来认识它们的厉害。

在过去的六个月里我真的尝试了。我用 Agent 写了 tinygrad 的某些部分。我用 Agent 逆向了一个 USB ↔ PCIe 芯片。但每次我都怀疑，如果我手动来做，会做得更好更快。Agent 把所有进展都前置了，然后给你一个老虎机拉杆，希望它能完成打磨工作。它从未真正做到过。

"你用错了"——我就知道会有人这么说。我尝试了所有不同的模型、不同的 harness、不同的 prompt。不是这个问题。这么说的人大概也会对老虎机说同样的话，你看，你得到樱桃后必须押 5 条线，怪不得你赢不了！

我不是说 AI 没有用，它显然有用。它绝对是大多数搜索的更好的 Google。而且每当你需要一个快速原型又不关心打磨时，它快得离谱。但它是一个软件工程师吗？在我工作过的任何公司里，连门槛都够不上。关键在于知道什么时候用它、什么时候不用它。

我更多地思考了关于自我价值保护的事情。AFL 比 LLM 发现了更多 bug，但没有人对它有那种感觉。国际象棋和围棋比以往任何时候都更受欢迎。我等不及要拥有一支我可以信任的机器人同事大军来清理我的代码了！我不惧怕地位丧失，我几乎认为这是某种向代理商兜售的心理战。失去的恐惧是让大公司行动的唯一方式之一。不过我认为，在这种恐惧中，它们正在犯一个大错误。

Agent 最终对大型组织的伤害会超过对高效个人或小组织的伤害。在过去的六个月里，我观察了朋友和同事采用这些工具的方式。我在所有高效人士身上发现的一个特点是纠错能力，而他们大多善于识别什么时候是 slop（糊弄活儿）。需要一些时间来探索/利用和调整何时使用、什么时候信任、如何使用等外层循环...但我还没有看到他们中的任何人转变成不仔细阅读理解每一行代码的模式，除了在某些受限领域。

与此形成对比的是大型组织。反馈循环慢得多，alignment 也差得多。表现最差的人不会有那种自我检查。它们是用 Agent 产生 10x 输出的人。你认为那个组织的平均输出正在发生什么？世界的平均产出正在发生什么？

Agent 最终会产出比以往更多的代码、更多的应用、更多的功能。这是桶和桶的 slop 的黄金时代，也是质量宝石的黑暗时代。

我听说苹果正在向所有工程师推广 AI。当人们抽象地思考时，他们认为 AI 会做所有这些事情，但让我们聚焦在一个具体的例子上。你认为 macOS 在未来 2 年会变得更好还是更差？

当人们看到一件作品时，他们会对其创作过程做出假设。甚至不假思索，他们假设创作者具有基本的人类心态。这个假设不再成立。东西可以以一种以前不可能的方式坏掉，而像语法和语法这样的旧质量代理已经没用了。AI 产生的作品不是通过与人类相同的过程产生的，这种差异虽然在统计上极其微妙，但当你试图以人类的方式与该作品交互和构建时，差异就变得明显了。

在不完全认同他们所有想法的情况下，我现在站在 LeCun/Marcus 对 LLM 的立场上。我不认为这样的模型将永远能够编程，我认为过程很重要。我认为深度学习仍然是解决方案，但真正的编程 Agent 需要世界模型，而不是一些 RLVR 式的玩意儿——把失败的测试注释掉然后告诉你所有测试都通过了。

这个时代真正的故事是：谁能设法在自己的 AI 精神病中避免伤害自己。

---

## 核心观点 | Key Points

| 观点 Point | 说明 |
|-----------|------|
| **Agent 不会编程** | Agents cannot program — 只是模仿编程分布的高级统计模型 |
| **输出越来越难检测** | The output is broken in increasingly harder-to-detect ways |
| **6个月尝试失败** | 用 Agent 写 tinygrad、逆向芯片，都比手动慢 |
| **不是"你用错了"** | 试过所有模型/harness/prompt，不是这个问题 |
| **大组织受害更深** | Bottom performers 没有自我检查，产生 10x slop |
| **macOS 会更差** | Apple 推 AI 到所有工程师的具象例子 |
| **LeCun/Marcus 阵营** | 需要世界模型，RLVR 式"注释掉失败测试"不是解决方案 |

## 相关阅读 | Related Reading

- [geohot blog](https://geohot.github.io/blog/)
- [tinygrad](https://github.com/tinygrad/tinygrad)
- [AFL (American Fuzzy Lop)](https://github.com/google/afl)
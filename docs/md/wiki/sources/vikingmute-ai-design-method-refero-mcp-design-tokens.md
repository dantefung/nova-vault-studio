---
title: "Viking（@vikingmute）：AI 做设计的方法论——用 Refero 找真实案例，把 design token 落成 DESIGN.md"
date: "2026-11-10"
source: "X/Twitter"
author: "Viking (@vikingmute)"
url: "https://x.com/vikingmute/status/2119780656834367805"
---

# Viking（@vikingmute）：AI 做设计的方法论——用 Refero 找真实案例，把 design token 落成 DESIGN.md

> 设计仍是应用最大的护城河，微调设计比写代码难得多——即便 Opus 5.5 很强，没有强约束时写出来的页面仍字多、配色杂、一眼 AI 味。三步法：① 用 Refero 按需求搜集真实设计（MCP 接入友好，Styles 模块可搜视觉方向并拉完整 style 取设计 token、排版、间距、组件，落成 DESIGN.md；Screens 模块看真实产品如何排版分层、拿大图或顺藤摸瓜找相似页）；② 把截图、PRD、DESIGN.md 一起交给强模型直接生成几种风格再挑——「Don’t iterate with the agent. Let it build tools to iterate」；③ 加小范围精致动画（GSAP / Motion），可参考 emil-design-eng 与动效案例，最后自己多次审视找细微的 aha moment。结论仍是那句：模型替不了发现美的眼睛。

<!-- more -->

给大家分享一下我现在用 AI 做设计的一点小方法论。

最近我要给简单简历做 Chrome 插件落地页，又一次验证了：设计还是应用最大的护城河，微调设计比写代码难多了

即使现在 Opus 5.5 已经很强，但没有强约束时，随便写出来的页面还是字多、配色杂、一眼 AI 味，远谈不上能直接上线。所以我做大设计时，还是要发现美的眼睛这件事，模型替不了。

这次大致是这样走的：

1 用 Refero https://t.co/LbWXCURkfM 按需求看和搜集真实设计。程序员就不要碰瓷专业设计了，可以参考优秀真实的案例，站在巨人的肩膀上。

Refero 是我现在非常喜欢的工具，尤其是 MCP 接入很方便，大致有两块：Styles：搜视觉方向，可以是颜色、字体、风格；再拉完整 style，拿设计 token、排版、间距、组件，用来生成 design token，落成 DESIGN.md

Screens：看真实产品怎么排——同类落地页结构、信息怎么分层；也能拿大图，或顺着一张好图找更多相似页

比如这里你可以去直接找 Chrome extensions，再加上你想要的视觉方向和颜色

它帮我从一堆真实案例里快速扫到想参考的结构与细节，再据此让 AI 生成 design token，落成 DESIGN.md，并保留截图当参考。

2 把截图、产品 PRD、DESIGN.md 一起交给强模型，让它直接生成几种风格的页面再挑。这里有个理论：Don’t iterate with the agent. Let it build tools to iterate. 出来后再按细微处微调。多数情况我现在会跳过单独出图；视觉特别重、或有静态素材要抠时，再用 ChatGPT Images 2.6。

3 交互和动画：我觉得很重要。我会加一些小范围、精致的动画（GSAP / Motion），让页面出彩；也可以问 AI 怎么加，用 emil 的 emil-design-eng https://t.co/BcZ4cF6jlo当指导思想，再参考 https://t.co/iepVQRVn0k 补更微妙的动效。最后整体自己再多次审视，找细微的一些 aha moment。

最后还是发现美的眼睛：多看、多搜集、多观察——这更像一种天赋，没事就可以去刷一下 Refero 上的设计网站。最后视频最后是我做好的落地页，我觉得比原来清爽非常多，上线以后也可以分享给大家看看。

[video](https://video.twimg.com/amplify_video/2119780065747865601/vid/avc1/1280x720/HmgAwXxyDh4FPYTo.mp4?tag=29)

## 相关页面

- [[sources/justin3go-8-niche-ui-component-libraries-for-vibecoding]]
- [[sources/heyrico-design-system-and-skills-for-agents]]
- [[concepts/indie-site-builder-skill-stack]]
- [[concepts/agent-skill]]

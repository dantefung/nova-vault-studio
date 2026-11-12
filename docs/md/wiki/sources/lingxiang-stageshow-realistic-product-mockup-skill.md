---
title: "0xiang（@LingxiangAI）：Stageshow——教 Claude Code 与 Codex 制作真实产品示意配图的开源 Skill"
date: "2026-11-03"
source: "X/Twitter"
author: "0xiang (@LingxiangAI)"
url: "https://x.com/LingxiangAI/status/2117108221173477709"
---

# 0xiang（@LingxiangAI）：Stageshow——教 Claude Code 与 Codex 制作真实产品示意配图的开源 Skill

> Benji Taylor 开源的 Stageshow Skill（2.1 万收藏）深度解析：专门解决 AI 生成产品界面又挤又假的痛点。总结 5 种典型翻车排查（太满、线框感、装盒子、太平、太淡），给出「安静灰色底色 + 仅重点区域使用真实文字 + 裁切聚焦重点」的优雅解法，支持通过 React 生成高品质功能卡片与带光标的演示动效。

<!-- more -->

让 Claude Code、Codex 做产品配图，出来的界面总是又挤又假？Benji Taylor 开源的 Stageshow 这两天在英文圈刷屏，原帖 2.1 万收藏。

它是什么：一个 Skill，专门教 Agent 做「看起来像真产品」的示意界面：静态图、功能卡片、带光标的演示动画、bento 拼图，用 React 写。

仓库：https://github.com/benjitaylor/skills

原理说明：https://benji.org/stageshow

怎么装：

npx skills add benjitaylor/skills --skill stageshow

里面有什么：构图和动效规则、一套可以照抄的 kit、示例，还有把成品录下来让 Agent 自己检查的工具。

它的 SKILL.md 列了 5 种翻车，直接拿来当检查表：

1. 太满：每行都塞真文字、到处是数字，越细越像 AI 拼的
2. 线框感：两块灰色加一个按钮，认不出是什么产品
3. 装盒子：整个窗口缩进卡片、四边一样宽，像贴了张截图
4. 太平：所有元素一样重，眼睛没地方落
5. 太淡：不管要什么风格，都是灰窗口加一个光标

它给的解法：界面要完整，用安静的灰色；只有要讲的那一块用真文字，其余用占位线；裁切把视线放到重点上。

装完先做这一步：挑你产品的一个功能，让 Agent「用 stageshow 做一张功能卡片配图」，再对着上面 5 条挑毛病。

## 相关页面

- [[sources/heyrico-design-system-and-skills-for-agents]]
- [[sources/ohayou-claude-artifacts-ui-design-system-leak]]
- [[sources/govin-taste-skill-frontend-design-for-ai]]
- [[concepts/vibe-coding]]

---
title: "WorkBuddy 加两个自建 skill，我实现了公众号自由"
date: "2026-09-21"
source: "X/Twitter"
author: "zhouluobo (@zhouluobo)"
url: "https://x.com/zhouluobo/status/2101819585301254163"
---

# WorkBuddy 加两个自建 skill，我实现了公众号自由

## 核心结论

**「公众号自由」的真意不是甩手，是把排版、配图、传草稿这些体力活全外包给 Agent。** 萝卜哥续篇：在 WorkBuddy + 飞书飞轮基础上，自己做了两个 skill（**文章排版** + **文章视觉**）上架开放平台，专攻「写完到进草稿箱」这一段。一篇文章从飞书文档丢给 WorkBuddy，几分钟后排版 + 封面 + 配图 + 进草稿箱全部完成。公众号侧只需要：① 拿 AppID + AppSecret + 设 IP 白名单 ② 让 WorkBuddy 把流程固化为 skill（下次免输入密钥）③ 最后人工点发送。**自动发布绝对不碰——AI 把稿子送进草稿箱就行，之后从头看一遍再点发送，封号风险没必要冒。**

## 关键洞察

1. **公众号开发信息是平台官方能力，绝对安全**：登录微信开发者平台 →「我的业务」→ 公众号 → 看到 AppID + AppSecret + 设 API IP 白名单（百度查本机 IP 填进去）。整套 5 分钟搞定，不存在违规。
2. **整条流水线一句话串起来**：手工/自动写稿 → WorkBuddy skill 配图+封面 → skill 排版 → WorkBuddy 调接口创建草稿 → 人工后台过一遍 → 人工点发布。
3. **两个自建 skill 的核心定位**：「文章排版」把整套排版样式（参考摸鱼小李设计）打包；「文章视觉」生成比 WorkBuddy 默认更精美的封面。两者都已上架 WorkBuddy 开放平台——把个人工具变成公共资产，让别人也能用上你的工作流。
4. **把 skill 做成「流程固化器」**：跑通一次 WorkBuddy 帮你推草稿的流程后，让 WorkBuddy 把这个过程做成 skill，下次就不需要每次手工提供 AppID 和 AppSecret。**这是「一次性操作 → 可复用资产」的关键一步。**
5. **教程类内容 AI 自动写不了**：教程需要个人感受 + 大量真实截图，纯 AI 写出来的教程没人看。**偏理论、情感、时事**类可以让 AI 打底，但最能打动读者的还是个人特色。
6. **「去 AI 味」是隐藏关键**：配图+排版+推送之前先过一道「去 AI 味 skill」（某大佬开源，基于 283 万字语料训练），效果显著优于一般工具。一句 prompt 调起即可。
7. **一句话扩能力边界**：AI 只生成了文章→想要配图和草稿推送？继续对 WorkBuddy 说「为上面的文章配图并生成封面，并发布到草稿箱」即可。**对话式扩展**是 Agent 时代的标志性交互。
8. **公众号自由 ≠ 从写到发全甩手**：萝卜哥的明确边界——排版、配图、传草稿这些体力活交给 AI；写什么、截哪张图、踩过哪些坑、最后那一眼人工审——**AI 替代不了**。

## 完整流程拆解

| 步骤 | 触发 | AI 干的事 | 人工做的事 |
|------|------|----------|------------|
| 准备工作 | — | — | 扫码登录微信开发者平台 → 拿 AppID + AppSecret → 设 IP 白名单 |
| 配 AppID/推送 | 一句 prompt | WorkBuddy 跑流程验证 API + 创建草稿 | 验证通过后让 WorkBuddy 把流程做成 skill |
| 排版+视觉 | 一句 prompt | 文章排版 skill + 文章视觉 skill | — |
| 一键产物 | 一句 prompt | 排好版的 HTML 页面 + 封面图 + 内文配图 + 草稿箱 | — |
| 自动写稿 | 一句 prompt + 风格参考 | 读历史文风 + 写文章 | 改开头/截图/重写观点 |
| 去 AI 味 | 一句 prompt | 283 万字语料训练的 skill 处理 | — |
| 配图+推送 | 一句 prompt | 配图 + 封面 + 推草稿箱 | — |
| 最终发布 | — | — | 打开后台从头看一遍 + 点发送 |

## 复用清单（公众号开放能力）

- **AppID + AppSecret**：登录微信公众平台 →「我的业务」→ 公众号 → 看一眼就有
- **API IP 白名单**：百度查本机 IP，填进去（同一出口 IP 的网络下 WorkBuddy 才能调通）
- **WorkBuddy skill 化**：跑通一次后让 WorkBuddy 打包成 skill，下次直接用
- **WorkBuddy 技能商店**：搜「文章排版」「文章视觉」（萝卜哥上架版）

## Related Pages

- [[summaries/zhouluobo-workbuddy-feishu-content-flywheel]] — 前篇：飞书多维表格 + WorkBuddy + 飞书文档历史文风，构建完整三环飞轮（选题 → 写稿 → 排版推送）；本文是其「第三环排版推送」的深度展开
- [[concepts/agent-autonomous-pipeline]] — Agent 自主调度三阶段流水线，本文的「公众号 skill 化」是该流水线「把重复操作打包成可复用资产」的具体落地

## Sources

- [[sources/zhouluobo-workbuddy-skill-wechat-article-pipeline]]
- [原文推文](https://x.com/zhouluobo/status/2101819585301254163)

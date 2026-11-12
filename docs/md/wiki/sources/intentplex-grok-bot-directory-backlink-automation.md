---
title: "Wyong（@intentplex）：用 Grok Bot 自动化提交免费目录站外链——可落地的批量做法"
date: "2026-11-05"
source: "X/Twitter"
author: "Wyong (@intentplex)"
url: "https://x.com/intentplex/status/2118018778973790538"
---

# Wyong（@intentplex）：用 Grok Bot 自动化提交免费目录站外链——可落地的批量做法

> 综合 sitin / SagaSu / 爱出海等高赞实践：素材包 + 禁写清单 + 跟踪表，让 Grok Bot 用云电脑/原生邮箱/Routine 每天自动提交免费目录外链，人只定规则和批例外。

<!-- more -->

重磅干货来了。这是 X 上的独立开发/出海圈子（2026 年 10 月前后）最热门、可落地的批量提交外链做法：用 Grok Bot 自动化提交免费目录站/导航站外链。

核心优势是 Grok Bot 自带云电脑+浏览器、原生邮箱（xxx@mail.grokbot.com）、Routine 定时任务、Workspace 和 Vault，能自己开网页填表、收验证邮件、记表格、发日报，人只负责定规则和批例外。

有效系统方法（综合 sitin、SagaSu、爱出海、饭团等高赞实践）

1. 准备阶段（人做一次）

候选清单来源（优先用这些）：

- https://everybacklink.com：专为 bot 设计，有分类、免费筛选、提交步骤、/llms.txt、/api/sites.json。把链接丢给 bot 让它自己读。
- GitHub flaqai/backlink_skills 里的 Free-backlink-list.md（约 743 个渠道）。
- 其他：各种 GitHub awesome submit 列表、SaaS/AI 工具目录汇总。

准备「提交素材包」（放 workspace，bot 直接取用，禁止现场编造）：

- 产品名称
- 标语：40 字 + 60 字版本
- 描述：100 / 160 / 250 字 + 长版
- 分类、标签
- Logo + 产品截图
- 官网 URL（必须带 UTM：?utm_source=站名&utm_medium=directory&utm_campaign=backlinks）
- 联系邮箱（优先 bot 邮箱）
- 「禁写清单」（不要编数据、不要填个人 X 账号等）

跟踪表：飞书多维表格 / Google Sheet / CSV。字段包括：站点、URL、状态（待提交/已提交/待审/已上线/跳过）、证据（截图或链接）、DR、提交日期、备注（只追加不覆盖）。

邮箱：领 Grok Bot 邮箱。如需域名邮箱，用 Cloudflare Email Routing + Worker 同时转发给人和 bot。

2. 给 Bot 下指令（关键）

创建一个「外链助手」Bot，把下面规则写清楚（或直接复制爱出海的完整工程书 prompt）：

你是我的外链助手。只提交真正免费或免费排队的目录站/产品发布站。

严格跳过：付费、付费才发布、互链交换、强制徽章、要手机号/实名/LinkedIn 员工数、只支持 Google 登录、写文章投稿、应用市场。

先查重（站内搜索或 site:），已收录就跳过。

用我给的素材包填表，不编造任何数据。

每个站必须留证据（截图或成功页），更新表格。

工作日每天最多 5 个，宁缺毋滥。

绝不花钱、绝不自己决定付费。

遇到 2FA、Passkey、付款、复杂验证直接交还给我。

跑完发日报。

爱出海的版本更严格：先探活、过 7 项质量门槛（相关性、真实用户、编辑审核、不卖链接、站群、自动化条款、强制互链），每批最多 10 个，提交前给你勾选清单，结果不明绝不重复点提交。

3. 日常自动化流程

1. Bot 加载清单 → 去重（对比已有表格）→ 只留免费+推荐+相关 → 按 DR/推荐等级排队。
2. 设置 Routine（工作日下午或早上）：从队列取下一批 5 个。
3. 对每个站：
   - 浏览器打开提交页，判断是否可免费提交。
   - 用素材包填表、上传 Logo。
   - 提交。
   - 验证邮件用 bot 邮箱自己收码/点链接（Routine 盯着收件箱）。
   - 留证据，回写表格。
4. 结束推送日报卡片：今日提交数、免费数、上线/待审列表、花费 $0、需要人工处理的事项。

实际效果参考（公开数据）：

- sitin：3 天 $0 提交 21 个站（含 alternative.me、G2、StartupBlink 等）。
- SagaSu：一天从 4000+候选筛出 282 个免费可交，当天确认上线 9 个 + 大量待审 + 22 个 GitHub awesome PR。
- 有人新站每天 5 条，一周多到 DR10。

4. 进阶旋钮（想要更多时拧）

SagaSu 总结了 6 个旋钮：付费插队、接受互链、挂徽章、扩大搜索、点赞评论解锁、做个人简介+URL。保守只做免费目录就行；想冲量再逐步放开。同时可让 bot 往相关 GitHub awesome 列表开 PR（质量更高）。

重要注意事项

- 质量 > 数量：优先高 DR、有真实用户、有编辑审核的垂直目录/launch 平台。纯垃圾目录价值低。
- 节奏：新站建议每天 5 个左右，避免被当成刷量。
- Google 政策：自动化创建链接 + 低质量目录链接被列为 spam 示例。这套方法更多是基础权重积累 + 发现流量，不是奇迹排名工具。
- 成功标准：页面能看到或显示审核中才算成功，必须留证据。
- 人工保留：钱、手机号、身份信息、复杂验证永远自己处理。

这是目前出海圈最系统、可直接复制的做法。准备好素材包和清单，把规则丢给 Bot，设好 Routine，基本就能每天自动跑。

## 相关页面

- [[sources/sagasu-grok-bot-automated-backlink-submission-4000-sites]]
- [[sources/sopilot-400-directories-submission-platform]]
- [[sources/lzj-grok-bot-beginner-guide]]

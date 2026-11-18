---
title: "AI 定时盯 SERP：双频次监控 + AI Overview 引用格局"
date: "2026-11-17"
source: "微信公众号"
author: "droidHZ（赫兹）"
url: "https://mp.weixin.qq.com/s/45hzfj2-mIcOSwa9JJeB6A"
---

# AI 定时盯 SERP：双频次监控 + AI Overview 引用格局

> 把「谁冒出来了」这件事交给 AI 定时任务：自己的词每天跑、大词每周跑，两次查询必须有可比基线。成本 $0.002/词、每月约 $0.09。

<!-- more -->

## 核心结论

**SERP 监控的价值不在自己的排名，而在“谁冒出来了”。** 自己的排名掉了还能靠别的渠道感知，但“某个新站正在爬上来”这种早期信号，人工抽查几乎不可能及时发现——作者原话是「常常过了很久才突然发现，自己做的词有个新站已经做上去了」。

**双频次是这套方法的核心设计**：自己的词是**告警**（每天看，当天反应），大词是**趋势**（每周看，攒够样本才看得出风向）。把两者混成同一个频率，要么自己的词发现太晚，要么大词查得太多太贵。

**两次查询必须有可比基线**——日对比昨天、周对比上周，所以冷启动时得用历史 SERP 快照兜底，否则第一次运行产不出“变化”。

## 方法论拆解

### 一、盯什么：两类词两种读法

| 类型 | 频率 | 读法 | 典型产出 |
|------|------|------|----------|
| 自己网站在做的词 | **每天** | 告警：有没有新站冒上来、自己掉了、AI Overview 换了引用 | 日报 + 对比昨天的变化 |
| 大词（暂时排不上） | **每周** | 趋势：Google 往哪个方向走、AI Overview 偏好引用什么样的页面 | 周报 + 对比上周的变化 |

### 二、怎么看：SERP 模块不能只看排名

提示词里必须显式点名要看的模块：**AI Overview、视频、Reddit**。只说“查排名”会丢掉 AI Overview——而 AI Overview 的引用名单恰恰是整份报告里信息密度最高的部分。

### 三、跑起来：AI 兼任四个角色

Claude Code 在这套流程里同时承担：

1. **取数**——调第三方 SERP API 拿 Google 搜索结果
2. **判断**——对比基线，识别“新进前 10"”掉出前 10"
3. **生成**——输出带来源链接的结构化日报/周报
4. **调度**——自己按 cron 周期触发

不需要额外的监控看板，也不需要人来按“开始”。

## 可直接复用的两条提示词

### 每日（盯自己的词）

```
每天 9 点，查【你在做的词，用顿号隔开】。列出我的排名、SERP 模块（AI Overview、视频、Reddit）、
AI Overview 引用了哪些网站、有没有引用我，以及和昨天相比新进前 10 的网站，每行附来源链接，出一份日报。
```

### 每周（盯大词看风向）

```
每周一 9 点，查这 5 个大词在 Google 美国站的前 10：ai video generator、image to video、
text to video、ai photo editor、ai headshot generator。列出 SERP 模块、AI Overview 引用了哪些网站，
以及和上周相比新进和掉出前 10 的网站，每行附来源链接，出一份周报。
```

## 实测证据：AI Overview 引用格局

作者跑的 5 个 AI 视频/图片大词（Google 美国站），AI Overview 引用名单：

| 大词 | 引用了谁 |
|------|----------|
| ai video generator | invideo、OpenArt、VEED、Runway、Canva、Kling、Higgsfield、Picsart、The Manila Times、YouTube |
| image to video | Magic Hour、Viggle、HeyGen、Canva、Adobe、YouTube |
| text to video | HeyGen、VEED、Renderforest、Google Gemini、Magic Hour、YouTube |
| ai photo editor | Adobe、Canva、Picsart、Pixlr、DeepAI、PicEditor AI |
| ai headshot generator | Canva、Higgsfield、HeadshotPro、Adobe、Aragon、NoteGPT、Reddit |

**被引用最多的网站**：Canva 4 个词 / Adobe 3 个词 / YouTube 视频 3 个；HeyGen、Magic Hour、Higgsfield、VEED、Picsart 各 2 个；Reddit 1 个。

这组数字本身就是情报：**Canva + Adobe + YouTube 几乎出现在每个词的 AI Overview 里**，它们是这个赛道的通用底座。想知道“AI Overview 偏好什么样的页面”，比看排名第几更结构化的答案就是这张引用表——它直接告诉你需要成为什么样的页面类型。

## 成本

| 项目 | 数字 |
|------|------|
| 单价 | $0.002 / 词 |
| 周报（5 个大词） | 最多约 $0.02 |
| 一个月 | 约 $0.09 |

按次付费、无月费。相较 Ahrefs $129/月、Semrush $139/月的订阅价，这个量级的监控成本几乎不构成决策因素——**这也是为什么这套方法值得自动化，而不是人工抽查**。

## 适用边界

- **大词风向短期看不出**：作者自己承认「现在风向标暂时还看不太出来，变化不大，需要接下来持续观察」。这个方法的价值需要**几个月**的样本积累才显现。
- **依赖付费数据源**：SERP 数据是典型的“数据资产层”，开源工具替代不了（见 [[concepts/open-source-seo-tooling]]），省不掉订阅费的替代方案是按次付费的聚合 API。
- **冷启动需要历史快照**：没有基线的第一次运行只能报“当前状态”，报不出“变化”。

## Related Pages

- [[sources/hezhiyan7-serp-monitor-ai-cron]] — 原始归档
- [[sources/joker-seo-data-metrics-confusion]] — 本文灵感来源：Joker 讲 SERP 监控与 SEOer 的数据指标困惑
- [[patterns/viral-content-monitoring]] — 同构模式：定时扫描 → 阈值判断 → 推送 → 复盘，SERP 监控是它在 SEO 侧的对应物
- [[concepts/open-source-seo-tooling]] — 为什么 SERP 数据必须付费、监控逻辑却能自建
- [[sources/ai-traffic-geo]] — 同作者的 GEO 归档：查看 AI 流量与被推荐关键词
- [[sources/guishou-google-ads-api-keyword-volume]] — 同类选型：DataForSEO 换掉 Google Ads API 的绕路做法

## Sources

- [[sources/hezhiyan7-serp-monitor-ai-cron]]

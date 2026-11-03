---
title: "Victor 在西雅图（@victor_UWer）：出海获客成本别只看总数——用 UTM + Stripe Metadata 拆解单渠道真实 CAC"
date: "2026-11-03"
source: "X/Twitter"
author: "Victor在西雅图 (@victor_UWer)"
url: "https://x.com/victor_UWer/status/2117195632783855942"
---

# Victor 在西雅图（@victor_UWer）：出海获客成本别只看总数——用 UTM + Stripe Metadata 拆解单渠道真实 CAC

> 出海产品真实获客成本计算指南：所有外链打上 UTM 参数，用户注册与创建 Stripe Customer 时写入 metadata；月末按渠道支出除以各渠道实际付费用户数，准确拆出各渠道真实 CAC 并对比 LTV 做出理性投放决策，告别拍脑袋粗放投放。

<!-- more -->

很多人算获客成本只看一个总数，这个数基本没法指导决策。

我现在是按渠道拆开算，月底花 10 分钟就够：

1. 所有对外的链接都带 UTM，比如 utm_source=reddit、utm_source=newsletter

2. 用户注册时把 UTM 存下来，创建 Stripe Customer 的时候写进 metadata

3. 月底在 Stripe 里按 metadata 筛，数出每个渠道来了几个付费用户

4. 每个渠道花的钱，除以它自己的付费用户数

举个例子：

Reddit 广告花了 $240，来了 8 个付费，单个 $30。

Newsletter 赞助花了 $150，只来 2 个，单个 $75。

这时候别只盯着 CAC 高低，要和一个用户能给你赚多少钱放一起看。月订阅 $9.9 的产品，$75 一个用户，大概率是亏的。

不记来源，这些账都只能拍脑袋。

## 相关页面

- [[sources/victor-uwer-competitor-ad-library-arbitrage]]
- [[sources/victor-uwer-tool-site-vertical-niche-for-profession-strategy]]
- [[concepts/b2c-conversion]]

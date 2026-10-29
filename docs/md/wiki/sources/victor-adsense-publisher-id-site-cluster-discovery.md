---
title: "Victor 在西雅图：用 AdSense 发布商 ID 反查站群——四步摸清站长手里还有哪些站"
date: "2026-10-29"
source: "X/Twitter"
author: "Victor 在西雅图 (@victor_UWer)"
url: "https://x.com/victor_UWer/status/2115383285446832431"
---

# Victor 在西雅图：用 AdSense 发布商 ID 反查站群——四步摸清站长手里还有哪些站

> 一条四步 OSINT 技巧：从任意目标域名加 /ads.txt 打开，读出其中 google.com 那行的 pub- 后 16 位发布商 ID，用 PublicWWW 反查源码里带同一 ID 的全部网站，再丢进 Similarweb 比流量，判断站长真正吃的是哪个方向。作者提醒：有人一个账号挂了十几个站，你盯着的那个可能只是最不起眼的一个；而 ID 相同只说明同一收款账号，也可能是代运营，不能直接当成同一个人。

<!-- more -->

卧槽，看到一个做得不错的站，其实能顺藤摸出站长手里还有哪些站。

靠的是 AdSense 的发布商 ID，贼简单：

1. 在目标域名后面直接加 /ads.txt，打开

2. 找 https://www.google.com/ 开头那一行，pub- 后面那串 16 位数字，就是他的发布商 ID

3. 拿这串 ID 去 PublicWWW 搜，源码里带这个 ID 的网站会全列出来

4. 把列出来的站丢进 Similarweb，看哪个流量最高，就知道他真正吃的是哪个方向

有人一个账号挂了十几个站，你盯着的那个可能只是最不起眼的一个。

ID 相同只能说明是同一个收款账号，也可能是代运营，别直接当成同一个人。

## 相关页面

- [[patterns/adsense-publisher-id-site-cluster-discovery]]
- [[patterns/competitor-research-four-step]]
- [[patterns/ai-automated-internal-link-seo]]
- [[sources/kristoff-new-term-site-1100usd]]

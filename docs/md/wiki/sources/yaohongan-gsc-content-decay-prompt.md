---
title: "虹安：流量一掉就写新文章是错的——内容衰减诊断 Prompt"
date: "2026-10-29"
source: "X/Twitter"
author: "虹安 (@yaohongan2025)"
url: "https://x.com/yaohongan2025/status/2120041514965565896"
---

# 虹安：流量一掉就写新文章是错的——内容衰减诊断 Prompt

> 先查旧页面而不是写新文章：把 12 个月 GSC 数据丢给 ChatGPT，让它找出掉量页面、诊断原因（需求变小/被竞对超/关键词自相残杀等）并排出 Top 10 优先修复清单，关键纪律：不许编数据，缺什么直说。

<!-- more -->

做出海网站最容易犯的错：流量一掉，就去写新文章。

这个提示词反过来，先查旧页面。把 Search Console 一整年的数据丢给 ChatGPT，让它找出哪些页在掉、为什么掉、先修哪 10 个。

最有用的是诊断那一步。流量掉不一定是内容旧了，也可能是需求变小、被竞对超了，或者你自己两个页面在抢同一个词。

还有一句我很喜欢：不许编数据，缺什么就直说。

Use this prompt to find content decay on your website and turn it around

Prompt below

👇

“Act as a senior technical SEO and content recovery strategist.

I’m going to upload 12 months of Google Search Console data, including page-level and query-level performance.

Your job is to identify pages that have lost organic traffic and create a prioritized recovery plan.

Step 1: Find the Declines

Identify pages with the largest click losses.

Compare the most recent 3 months against the previous 3 months and the same period last year.

Separate declining pages from those experiencing normal seasonal fluctuations.

Flag pages with high impressions but falling CTR.

Step 2: Diagnose the Problem

For every declining page, investigate whether the likely cause is:

Lost keyword rankings

Declining search demand

Competitors overtaking the content

Outdated or incomplete information

Search intent changes

Keyword cannibalization

SERP feature changes

Internal linking weaknesses

Distinguish confirmed findings from hypotheses. Don’t assume every traffic decline is caused by outdated content.

Step 3: Build the Rescue Plan

For each page, recommend:

What specifically needs to change

Which keywords to prioritize

Sections to add, rewrite, or remove

Internal links to improve

Title and meta description improvements

Whether to refresh, consolidate, redirect, or leave the page alone

Step 4: Prioritize by Opportunity

Create a table showing:

URL | Clicks Lost | Likely Cause | Recommended Fix | Recovery Potential | Effort | Priority

Rank opportunities by estimated recoverable traffic, business value, confidence, and implementation effort.

Step 5: Give Me a 30-Day Recovery Plan

Identify the 10 pages I should fix first.

For each, give me exact implementation instructions rather than generic SEO recommendations.

Don’t invent ranking data, competitor findings, or recovery estimates. Tell me when additional data is required.

My goal is to recover as much organic traffic as possible without publishing new articles.”

How to use it:

Export your Google Search Console performance data with pages, queries, clicks, impressions, CTR, and average position. Include monthly data where possible.

Upload it to ChatGPT and paste the prompt.

Sometimes the fastest way to grow your SEO traffic isn’t publishing more content. It’s fixing what used to work.

## 相关页面

- [[sources/growaiskills-gsc-old-page-refresh]]

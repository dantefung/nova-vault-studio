---
title: "AI少年：Grok Bot自动监控爆款并推送工作流（开源）"
date: "2026-10-13"
source: "X/Twitter"
url: "https://x.com/aehyok/status/2109817788198158347"
---

# AI少年：Grok Bot自动监控爆款并推送工作流（开源）

> 国庆后流量暴跌，不知道怎么发内容。于是连夜跟AI促膝长谈，搭了一个爆款监控自动化流程。

## 开源仓库

[https://github.com/aehyok/x-viral-monitor](https://github.com/aehyok/x-viral-monitor)

## 流程逻辑

1. 找对标账号
2. 让Grok Bot安装本文开源的skill
3. 把对标账号丢给Grok Bot
4. 设置定时任务（每小时扫描最近24小时帖子）
5. 爆款判断：曝光数据每小时超过5000即触发
6. Grok Bot自动推送符合条件的帖子
7. 人工筛选后发帖，等待数据反馈复盘

## 亮点：token零消耗推送

为了把获取的数据推送到GitHub，原本会白白浪费Grok Bot的token。作者对接了蚂蚁的Ling-3.1-flash模型（OpenRouter上可用）来实现自动化推送，实现token零消耗。

> Ling-3.1-flash：约560B总参数，每个Token只激活约25B，上下文上限1M（免费期256K），主打长流程任务和写代码。

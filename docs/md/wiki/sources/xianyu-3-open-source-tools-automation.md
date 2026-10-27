---
title: "闲鱼副业月入 5 万：3 个开源工具把重复劳动交给代码"
date: "2026-10-27"
source: "X/Twitter"
author: "X 推文（用户提供原文摘录）"
url: ""
---

# 闲鱼副业月入 5 万：3 个开源工具把重复劳动交给代码

> 闲鱼副业月入 5 万，靠的是 3 个开源工具。原理很简单：把重复劳动交给代码。新手先装监控那个，能看懂行情再谈出单。

<!-- more -->

## 原始推文

```text
闲鱼副业月入5万，靠的是3个开源工具。

原理很简单：把重复劳动交给代码。

XianyuAutoAgent，7×24自动回消息、自动议价出单。

ai-goofish-monitor，盯着低价商品，捡漏秒拍。

xianyu-auto-reply-fix，多账号管理，自动发货。

新手先装监控那个，能看懂行情再谈出单。

GitHub 上直接搜项目名。
```

---

## 三件套分工拆解

| 工具 | 解决的重复劳动 | 核心能力 |
|---|---|---|
| **XianyuAutoAgent** | 客服值守 | 7×24 自动回消息、上下文感知对话、阶梯降价智能议价、多专家（意图分类/价格/技术）协同路由 |
| **ai-goofish-monitor** | 盯盘选品 | Playwright 实时/定时多任务监控，按关键词+价格+区域+AI 多模态标准筛选，捡漏秒拍，多渠道即时通知 |
| **xianyu-auto-reply-fix** | 账号与履约 | 多账号独立运行与定时擦亮、AI 自动回复、自动发货确认、Web 管理后台 |

**三者的关系是一条完整的闲鱼经营流水线**：

```text
ai-goofish-monitor（盯盘找货 / 理解行情）
        ↓  锁定目标商品与价格区间
XianyuAutoAgent（客服值守 / 议价出单）
        ↓  成交后触发履约
xianyu-auto-reply-fix（多账号 / 自动发货）
```

---

## 新手上手顺序

原文给出的建议是**先装监控那个**：

1. **先装 `ai-goofish-monitor`**——用它的 Web 后台观察真实成交价、发帖节奏与热门品类，先「看懂行情」；
2. **行情判断力建立后再上 `XianyuAutoAgent`**——自动议价策略需要基于对价格分布的理解，否则阶梯降价会直接亏钱；
3. **最后用 `xianyu-auto-reply-fix` 扩账号**——多账号并发与自动发货是把单账号跑通的流程复制到规模化阶段。

GitHub 上直接搜项目名即可获取，三个项目均为公开仓库。

---

## 实操注意

- 三个项目都需要闲鱼网页端登录态 Cookie（通过 F12 抓取），凭据存在泄露风险；
- 闲鱼平台对自动化操作有风控与规则约束，账号封禁风险自担；
- 三个项目协议各不相同：XianyuAutoAgent 为 GPL-3.0，ai-goofish-monitor 为 MIT，xianyu-auto-reply-fix 为 AGPL-3.0，商用需注意传染性条款。

---

## 相关页面

- [[entities/xianyu-auto-agent]] — shaxiu/XianyuAutoAgent：7×24 智能值守与阶梯议价
- [[entities/ai-goofish-monitor]] — Usagi-org/ai-goofish-monitor：Playwright + AI 闲鱼监控
- [[entities/xianyu-auto-reply-fix]] — GuDong2003/xianyu-auto-reply-fix：多账号管理与自动发货
- [[sources/dongqingai-xianyu-virtual-product-automation]] — 闲鱼虚拟资料自动化流水线
- [[sources/weiyux-xianyu-6-years-experience]] — 6 年闲鱼实战：选品发散与场景锁定
- [[sources/xianyu-private-domain-guide]] — 闲鱼引流与私域成交闭环

---
title: "LOF Arbitrage Pattern"
date: "2026-06-13"
source: "被裁了，用Code X做了个赚钱工具"
url: "https://mp.weixin.qq.com/s/KMlUUy_reUz83GTIJ1V_8w"
---

# LOF Arbitrage Pattern

LOF 基金套利需要实时监控溢价率，但传统数据源存在以下问题：
- 爬虫抓取容易被封
- 数据滞后（T-2 估值）
- 手动计算容易出错

## 最优溢价计算公式

- 剔除 QDII 净值滞后
- 考虑 T+2 到账成本

## AI 自动化优势

- 实时监控
- 自动登录数据源
- 自动计算和排序

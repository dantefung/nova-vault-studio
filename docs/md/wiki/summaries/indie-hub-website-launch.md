---
title: "网站上线后24小时之内马上要做的事情是什么？"
date: "2026-07-22"
source: "SlowGrowth.慢速生长"
url: "https://mp.weixin.qq.com/s/AoaSCinIab1nssNNqI7jQw"
---

## 核心框架

上线后24小时接四条链路：**可访问、可统计、可发现、可追踪**。

## 五步走

1. **外部完整性检查**：curl检查200/重定向/canonical/robots.txt/sitemap.xml，手机端无滚动遮挡
2. **GSC域名验证**：新站建立网域资源，验证后提交sitemap
3. **提交sitemap**：只放规范URL200，Google明确说请求索引不保证收录
4. **接入Bing Webmaster**：支持从GSC导入，IndexNow主动提交URL加速发现
5. **重建GA4数据流**：三次验证（Tag Assistant/Network collect/Realtime）

## 关键概念

- **IndexNow**：主动发送URL变化，不保证收录，只加速发现
- **网域资源 vs 网址前缀资源**：新站选网域资源，覆盖更全
- **Canonical**：页面源码唯一，避免重复内容
- **Consent Mode**：广告拦截/Cookie同意工具可能让GA4失效

## 核心观点

第一个24小时目标不是流量，是四个可控结果：稳定访问/统计启动/搜索引擎入口/故障可定位。

## 关联概念

[[网站上线]] [[SEO]] [[GSC]] [[Bing Webmaster]] [[IndexNow]] [[GA4]] [[Cloudflare优化]] [[sitemap]]

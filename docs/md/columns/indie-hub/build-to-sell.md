---
title: "Build-to-Sell：AI Agent 内容农场"
date: "2026-06-22"
source: "利用 AI 给自己做个网站给养老吧"
url: "https://mp.weixin.qq.com/s/rIu6Efw7m54FENXEvqtvyg"
---

# Build-to-Sell：AI Agent 内容农场

用 AI 驱动 CMS 系统，实现全自动内容生产 + 多语言 SEO + 广告变现。

> 参考：zlbigger《利用 AI 给自己做个网站给养老吧，"躺"着把钱挣》

## 核心架构

### AI Agent 流水线

每个环节是一个 AI 打工人，输出 JSON 格式便于程序处理：

| 环节 | AI 角色 | 输出 |
|------|---------|------|
| 1 | 写主题 | 角色 + 穿搭描述 |
| 2 | 出图 Prompt | 英文 prompt → 画图 API |
| 3 | 多语言标题 | es/zh/jp/kr/en 五种语言 |
| 4 | 分词/标签 | 多语言 keywords |
| 5 | SEO description | 多语言 meta description |
| 6 | 正文扩写 | 杂志风格，500 字内 |

### CMS 结构

```
/en, /jp, /kr, /zh, /es  → 首页（301 到主语言版）
/en/page/{slug}          → 内容页
/en/tag/{tag}            → 标签聚合页
/?search={keyword}        → 搜索结果页
```

**SEO 要点**：默认首页 301 重定向避免重复内容；内容 slug 保持英语节省翻译成本。

## 变现路径

**Google AdSense** — 最原始的广告模式

> 前提：跑通自动化后真的"躺赚"，但需要前期框架搭建。

## 成本清单

| 项目 | 成本 |
|------|------|
| 域名 | ~100 元/年 |
| 空间 | 搬瓦工等白菜价 |
| CDN | Cloudflare 白嫖 |
| 文本 API | 低级模型近乎不要钱 |
| 图片生成 | 较高，需找聪明办法 |

## 扩展思路

1. **多语言切入**：让全世界各种语言的用户都能进入你的站
2. **有流量的话题**：结合 AI 让内容带上任何热门元素
3. **内容聚合**：标签页 + 搜索结果页 = 长尾流量

## 关键洞察

> 核心在于 AI 能帮你干很多事情。AI 能帮你突破语言障碍，获取全球流量。

> 选择有"流量"的主题，AI 让你做任何你想做的内容。

## 相关

- [[first-bucket-consumer-to-producer]] — 从消费到生产的转变
- [[four-layer-filter]] — 看见机会 → 自动化执行
- [[ai-agent-content-farm]] — AI Agent 内容农场 Pattern

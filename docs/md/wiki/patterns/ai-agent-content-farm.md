---
title: "AI Agent Content Farm"
date: "2026-06-22"
source: "利用 AI 给自己做个网站给养老吧，躺 着把钱挣"
url: "https://mp.weixin.qq.com/s/rIu6Efw7m54FENXEvqtvyg"
---

# AI Agent Content Farm

用 AI 给自己做个网站，躺着把钱挣。

## 核心框架

用 AI 驱动一个普通 CMS 系统，实现全自动内容生产 + 多语言 SEO + 广告变现。

## 自动化流水线

每个"AI 打工人"负责一个环节：

1. **写主题** → 定时任务提交主题（角色扮演：知名动漫女性角色时尚穿搭）
2. **出图** → AI 根据主题生成图片 Prompt，再调用画图 API
3. **写标题** → 多语言标题（es/zh/jp/kr/en）
4. **分词/标签** → 多语言标签 keywords
5. **写 description** → SEO 友好的多语言描述
6. **写正文** → 杂志风格扩写，500 字以内

所有环节输出 JSON 格式，便于程序处理。

## SEO 结构

- 首页：`/en`、`/jp`、`/kr`、`/zh`、`/es`
- 内容页：`/en/page/{slug}`
- 标签聚合页：`/en/tag/{tag}`
- 搜索结果页：`/?search={keyword}`

### URL 处理要点

- 默认首页 301 重定向到主语言版本，避免重复内容
- 标签页/搜索页翻译成对应语言
- 内容 slug 保持英语（节省翻译成本）

## 变现方式

**广告模式**（最原始）：Google AdSense

## 成本

- 域名：约 100 元/年
- 空间：搬瓦工等白菜价
- CDN：Cloudflare 白嫖
- 文本模型：低级 API 近乎不要钱
- 图片生成：成本较高，需动脑子找聪明办法

## 核心洞察

> 核心在于 AI 能帮你干很多事情，比如全球多语言流量。

选择有"流量"的主题，AI 让你心爱的角色穿上任何服装。

## 相关

- [[first-bucket-consumer-to-producer]] — 从消费到生产
- [[four-layer-filter]] — 自动化也是一层过滤

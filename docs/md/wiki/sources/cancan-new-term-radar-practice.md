---
title: "cancan jin：新词雷达实操 + 小白出海找词笔记"
date: "2026-10-13"
source: "X/Twitter"
author: "cancan jin (@cancan_jin50701)"
url: "https://x.com/cancan_jin50701/status/2109896502667530255"
---

# cancan jin：新词雷达实操 + 小白出海找词笔记

> 本条为引用推（quote tweet），作者在对 CloudHu 出海建站教程的转述基础上，叠加了自己安装「新词雷达」开源工具的实操记录。

## 核心结论

- 出海建站「找词→做站→上线」闭环可先用低成本栈跑通，不必先砸钱；
- 「新词雷达」（zhuyansen/new-term-radar）首日运行不吐候选词，因为要先建基线快照，其定位是补 Trends / Semrush 之前那一截「新名刚冒头」的信号；
- 关键词筛选：避开体育赛/天气/政治/娱乐等时效短、大平台垄断赛道；Semrush 上 KD 0–30、CPC 0.1–10 为新手友好区间。

<!-- more -->

## CloudHu 路径笔记（跑通流程 > 一天赚到钱）

以下 CloudHu 路径部分为作者对 CloudHu 教程的转述笔记，非 cancan jin 原创，详见 [[sources/cloudhu-ai-overseas-website-tutorial]]。

### 全流程

> 找需求词 → AI 做站 → Vercel 部署 →（可选）买域名 → 提交 GSC / Bing

### 找词的两类

- **老词**：长期稳定搜索（如 `word转pdf`），用词根拓展；
- **新词**：当下热点，用 Google Trends 看量和曲线。

### 筛选原则

- 先避开体育赛/天气/政治/娱乐（大平台垄断 + 时效短）；
- Semrush 指标：KD 0~30、CPC 0.1~10（有商业意图；CPC = 0 基本难变现）。

### 低成本技术栈

| 项目 | 来源 |
|------|------|
| 部署 | Vercel（免费） |
| 趋势 | Google Trends（免费） |
| 站长 | GSC / Bing Webmaster（免费） |
| 域名 | Spaceship |
| 关键词 | Semrush（可选） |

原文中以短链形式给出演示与仓库地址，未能确认最终指向。

## 实操：安装 zhuyansen/new-term-radar

### 项目信息

- 仓库：<https://github.com/zhuyansen/new-term-radar>
- 语言：Python
- 许可：MIT
- Stars：1602
- 主旨：Daily radar for new AI terms — 在关键词工具收录之前，从 X、Hugging Face、GitHub、sitemap 抓新模型/产品/仓库的名字。

### 当天操作

clone 仓库后跑 `daily`，跳过 X / 新站等付费信号。

### 结果

- **候选 0**；
- 首次运行只输出 HF trending（100 条）和 4 个 sitemap 的基线快照，没有差分；
- GitHub 爆发信号部分超时；
- 花费 **$0**。

## 学到的

1. **雷达第一天本来就不吐词**，它先记基线；
2. 它补的是 Trends / Semrush 之前那一截「新名刚冒头」的空白。

## 归档说明

- 归档为引用推笔记，已标注 CloudHu 路径部分为转述；
- 原文不含引流内容，技术内容完整保留，仅删除末尾「十年产品 + AI PM，公开摸索 OPC」的自我介绍钩子；
- X 短贴正文为纯文本，抓取接口未返回配图。

## 相关页面

- [[sources/cloudhu-ai-overseas-website-tutorial]] — CloudHu 原教程（本文转述来源）
- [[concepts/overseas-tool-stack]] — 出海工具栈全景
- [[concepts/seo-basics]] — SEO 基础四件套
- [[concepts/indie-site-builder-skill-stack]] — 独立站创业能力栈
- [[sources/bulk-website-building-30-sites-30-dollars]] — 批量上站的收入反思

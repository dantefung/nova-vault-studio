---
title: "Anthropic 官方知识工作插件集开源"
date: "2026-07-19"
source: "Anthropic"
url: ""
---

# Anthropic 官方知识工作插件集开源

Anthropic 开源了 `knowledge-work-plugins`，16k star。

给 Claude 装"工作技能"——装完它直接懂那个岗位怎么干活，不用一句句教它先查哪、再按什么模板写。

## 11个插件

**专业岗位（8个）**：
- 销售（Sales）— 连 HubSpot
- 客服（Customer Success）
- 产品（Product）— 连 Figma
- 营销（Marketing）
- 财务（Finance）
- 数据（Data）— 连 Snowflake
- 法务（Legal）
- 生物研发（Biological Research）

**通用（3个）**：
- 全局搜索（Global Search）
- 个人效率（Personal Productivity）
- 插件构建器（Plugin Builder）— 用来自己造插件

## 两套产品

- **Cowork**（claude.com/plugins）：给知识工作者，不需要写代码
- **Claude Code**：两行命令安装，`/sales:call-prep` 这种命令自动就有了

## 特点

- 全是 markdown，公司里不写代码的人也能改成自己的流程
- 工具接好了，销售连 HubSpot、数据连 Snowflake、产品连 Figma，开箱即用

## 项目地址

github.com/anthropics/knowledge-work-plugins

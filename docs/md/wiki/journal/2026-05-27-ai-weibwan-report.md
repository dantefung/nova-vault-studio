---
title: "Claude Code 动态工作流与静态页面"
date: "2026-05-27"
---

# AI 玩耍群日报 - 0527

## Claude 写静态页面

用 Claude 写了很多静态页面，每个只花十分钟左右，使用 Cloudflare Worker/Pages 部署，不要钱！

示例：
- https://me.imwsl.com
- https://gg.imwsl.com
- https://id.imwsl.com

> 静态页面是 24 小时展示的广告牌，很适合自媒体人。

## Claude Artifacts

Artifacts 是 Claude 在对话中直接生成可预览内容的功能——不只是输出代码，而是同步渲染成可交互的网页、图表、UI 组件或文档。

典型使用场景：
- 做一个计算器/小工具
- 生成可下载的报告文档
- 做数据可视化图表
- 快速原型 UI 设计稿
- 制作信息图

## 有价值的文章

1. **《HTML Is the New Output Layer for Claude Code》**
   > 把 Claude Code 的输出从"纯文字"升级为"可交互 HTML 页面"，是让 AI 工作成果真正可用的关键一步。
   - https://emergingai.substack.com/p/html-is-the-new-output-layer-for

2. **《Essential Books for Product Builders》**
   > Lenny 整理了 36 本经得住时间检验的书，按"你想解决什么问题"来分类推荐
   - https://www.lennysnewsletter.com/p/essential-books-for-product-builderspart

## Claude Code 动态工作流

Claude Code 引入了动态工作流，AI 可以动态安排合适的多个 agents 一起工作，无需人工配置 agent team。

**核心特点：**
- AI 自主安排、自动调用多个 agents 处理任务
- 类似 GSD 工作流
- 不需要人为配置 subagents

**启用方式：**
1. 输入：`创建(动态)工作流程`
2. 使用：`/effort ultracode`
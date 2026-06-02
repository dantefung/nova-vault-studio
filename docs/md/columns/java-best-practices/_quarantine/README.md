---
title: "Java 最佳实践专栏 - 待修复文件"
date: "2026-06-02"
source: "internal"
---

# 🚧 待修复文件（_quarantine/）

此目录暂存**因 HTML 嵌入不规范导致 VitePress 编译失败**的文件。
文件后缀为 `.md.disabled`，VitePress 不会将其识别为页面。

## 4 个待处理文件

| 原文件名 | 主题 | 问题 | 状态 |
|---|---|---|---|
| `单例模式：如何创建单一对象优化系统性能.md.disabled` | 极客时间·设计模式专栏 26 | 残留 `<figcaption>`、`<a>`、`<img>` 等不平衡 HTML | 待重转 |
| `原型模式与享元模式：提升系统性能的利器.md.disabled` | 极客时间·设计模式专栏 27 | 同上 | 待重转 |
| `生产者消费者模式：电商库存设计优化.md.disabled` | 极客时间·设计模式专栏 29 | 同上 | 待重转 |
| `如何使用设计模式优化并发编程.md.disabled` | 极客时间·设计模式专栏 28 | 同上（含最大图片集 ~40 张） | 待重转 |

## 问题根因

源文件是极客时间设计模式专栏的 HTML 抓取页。HTML 极不规范：
- 极客时间原始 HTML 用大量随机 class 包裹内容（如 `class="_3ADRghFH_0"`）
- 部分 `<div>`、`<span>`、`<a>` 标签未正确闭合
- `<img>` 标签混杂在嵌套结构中
- 部分 `<figcaption>` 与 `<figure>` 不成对

`pandoc -f html -t gfm` 转换后保留了 HTML 结构。VitePress Vue 编译器在解析时报告：
> Element is missing end tag

## 已尝试的修复

1. ❌ **pandoc v2 选项（`--no-highlight --strip-comments` + 后处理剥离 div/span）**：
   - 减少了 80% HTML 体积，但 `<table>`、`<img>`、`<a>` 等仍残留
2. ❌ **`<div v-pre>` 包装正文**：
   - v-pre 在 markdown 内不生效（markdown-it 不把它当 Vue 指令处理）
3. ✅ **本方案（隔离）**：
   - 移到 `_quarantine/` + `.disabled` 后缀，不进 VitePress build
   - 保留原文供后续人工/工具修复

## 后续处理方案

| 方案 | 工作量 | 效果 | 推荐度 |
|---|---|---|---|
| BeautifulSoup + html2text 深度清洗 | 中 | 干净但可能丢图片 | ⭐⭐⭐ |
| 手动编辑 4 个文件，去除不平衡 HTML | 高 | 最干净 | ⭐⭐ |
| 用 v-html 容器包正文（自定义 VitePress 组件） | 中 | 保留图片 + 绕过编译 | ⭐⭐⭐⭐ |
| 删除这 4 篇（专栏其他 158 篇仍可用） | 0 | 损失 4 篇 | ⭐ |

## 暂存信息

- 隔离时间：2026-06-02
- 隔离原因：VitePress build 阻塞（`Element is missing end tag`）
- 关联索引：未在 `index.md` 引用，访问入口已失效
- 源文件保留位置：`D:/prj/develop/Macaroon-Spring-Family/spring-boot-kata/spring-boot-best-practice/doc/`

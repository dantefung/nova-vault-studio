---
title: "weread-exporter — 微信读书全本导出工具（Playwright + Canvas Hook）"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/lbq110/weread-exporter"
---

# weread-exporter — 微信读书全本导出工具（Playwright + Canvas Hook）

> 微信读书全本导出，包括付费书。Playwright 自动化浏览器 + Canvas fillText Hook 逐页提取文字，输出 Markdown。

<!-- more -->

## 核心原理

微信读书网页版使用 **Canvas 渲染书籍文字**（而非 DOM 文本节点），现有工具（weread-exporter、weread2notion）只能导笔记和免费章节，这个能导**全本正文**。

**技术栈**：
1. **Playwright 自动化** — 启动 Chromium，持久化登录会话（扫码一次，后续自动复用）
2. **Canvas fillText Hook** — 注入钩子拦截所有 `CanvasRenderingContext2D.fillText()` 调用
3. **双页拆分** — 微信读书在同一 Canvas 同时渲染当前页和下一页，通过检测 y 坐标重置点分离两页字符流
4. **文本重建** — 按 (x, y) 坐标将单字符重组为行和段落
5. **格式清理** — 合并 Canvas 渲染断行，还原自然段落

## 安装与使用

```bash
pip install playwright
playwright install chromium

# 传入书籍 URL
python weread_export.py https://weread.qq.com/web/bookDetail/xxxxx

# 或直接传 book_id
python weread_export.py dd6324f0813ab9f97g019a24

# 指定输出目录
python weread_export.py <book_id> -o ./books
```

## 输出结构

```
output/
├── <book_id>/
│   ├── meta.json          # 书籍元数据（标题、作者、章节列表）
│   ├── chapters/          # 每章独立 Markdown
│   │   ├── 001.md
│   │   └── ...
│   └── raw/               # 原始 Canvas 坐标数据（可选）
└── 书名.md                # 合并后的全本文件
```

## 限制

- 需要有效的微信读书账号，对目标书籍有阅读权限（无限卡会员或已购买）
- 部分出版社限制网页端阅读（显示"去 App 阅读"），无法导出
- 导出速度约 20-30 秒/章

## 数据

- **47 Stars** · **14 Forks** · **1 Commit**
- Python 100%

## 声明

仅供个人学习研究使用，请尊重著作权。
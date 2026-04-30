---
title: "mdts — 本地 Markdown 预览服务器"
date: "2026-04-29"
source: "Github"
url: "https://github.com/unhappychoice/mdts"
---

# mdts — 本地 Markdown 预览服务器

`mdts`（Markdown Tree Server）是一个零配置的 CLI 工具，一行命令即可在浏览器中预览本地 Markdown 文件目录。

## 核心特性

- **零配置**：`npx mdts` — 开箱即用，无需安装
- **目录树浏览**：三栏布局，清晰展示 Markdown 文件树
- **实时热重载**：文件修改后浏览器自动刷新
- **多主题支持**：内置 20+ 应用主题和语法高亮方案
- **灵活过滤**：支持 glob 模式筛选文件

## 快速上手

```bash
# 预览当前目录
npx mdts

# 预览指定目录
npx mdts ./docs

# 仅显示 README
npx mdts ./project -g 'README.md' 'docs/**/*.md'

# 自定义端口
npx mdts ./docs --port 3000
```

启动后访问 http://localhost:8521（默认端口 8521），浏览器自动打开。

## 常用选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `[directory]` | 预览的目录 | `.`（当前目录） |
| `--glob`, `-g` | glob 模式过滤文件 | — |
| `--port`, `-p` | 服务端口 | `8521` |
| `--host`, `-H` | 监听地址 | `localhost` |
| `--no-open` | 不自动打开浏览器 | — |
| `--silent`, `-s` | 静默模式（无日志） | — |

## 使用场景

- **AI 生成文档审查**：快速浏览 AI 输出的 Markdown 文档
- **本地笔记目录**：预览笔记文件夹，支持树形导航
- **轻量级本地 Wiki**：无需部署，在本地搭建 Markdown 知识库浏览

## 链接

- 源码：https://github.com/unhappychoice/mdts
- 在线 Demo：https://mdts-unhappychoice.netlify.app

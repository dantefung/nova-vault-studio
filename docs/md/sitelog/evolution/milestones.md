---
title: "演进历程与里程碑"
date: "2026-07-26"
---

# 演进历程与里程碑

本文记录了 **System Vault** (及其原型项目) 的核心开发节点与演进路线。

## 核心里程碑

### 2023 - 2024: 概念诞生与原型验证
*   **架构选型**: 确定基于 VitePress 1.x。利用其极速的开发体验和简单的 Markdown 转 HTML 流程。
*   **多维表达**: 引入 `markdown-it-markmap` 插件，支持在文档中直接嵌入思维导图。

### 2025-01: 核心框架标准化
*   **Mermaid 集成**: 引入 `vitepress-plugin-mermaid`，支持流程图、时序图等标准图表。
*   **视觉优化**: 深度集成 **霞鹜文楷 (LXGW WenKai)** 字体系统，通过 Local/CDN 二进制切换机制保障阅读体验。
*   **自动化部署**: 建立基于 Vercel 的 GitHub 自动部署流水线。

### 2026-01: 项目分化与 System Vault 成立
*   **架构重组**: 从通用周刊模板中抽象出纯粹的知识库框架。
*   **动态路由映射**: 完善文件系统到侧边栏的自动化生成脚本 `sidebar.js`。
*   **System Vault 初始化**: 本项目正式作为独立的知识库底座启动，专注于系统架构与技术方案的深度沉淀。

### 2026-04: 主题系统与落地页风格
*   **多主题切换**: 实现三种主题（晴空/暗夜/纸卷）自由切换，localStorage 持久化，SSR 防闪烁
*   **落地页风格系统**: 首页支持 8 种落地页风格（晴空/杂志/极客/诗卷/卡片/暗魄/暖域/静界），导航栏下拉实时切换
*   **设计工具**: 使用 [Huashu-Design](https://github.com/alchaincyf/huashu-design) skill 完成主题和落地页的设计与实现

### 2026-07: 主题扩展与备份体系
*   **Teek 主题引入**: 安装 [vitepress-theme-teek](https://github.com/teek/vitepress-theme-teek)，~1k stars，支持文档风/博客风模式切换，适合个人博客/知识库场景
*   **备份分支**: 建立 `backup-20260726` 分支，作为变更前的完整快照

### 2026-04: 教程内容集成与目录标准化
*   **full-keyboard 项目集成**: 成功将独立的 GitHub 项目 `alexzhang1030/full-keyboard` 集成到知识库中
    - 项目原设计: GitHub 仓库 + 自动生成 README 导航 (基于 `docs/` 单目录)
    - 原理: 通过 npm run scripts 扫描文件、提取标题、生成链接列表，GitHub 负责 Markdown 渲染
    - 集成策略决策: 
      - ❌ 方案 A: 修改 VitePress 配置支持特殊的嵌套结构 (过度定制，维护复杂)
      - ✅ 方案 B: **重构目录为标准分类结构** (遵循最小配置原则)
*   **标准化目录结构**: 将 65 个教程文件从单一 `docs/` 目录重组为 8 个分类子目录
    - vim (18 个), vscode (11 个), tools (9 个), chrome (7 个), iterm (1 个), zsh (3 个), macos (3 个), obsidian (4 个)
    - 每个子目录配置独立的 `index.md` 学习路径
    - 更新 69 条导航链接至新的路径结构
*   **配置哲学的实践**: 遵循 VitePress 原生设计模式，无需自定义 sidebar 生成逻辑，充分利用框架自动化能力
*   **维护性提升**: 从特例处理回归标准目录模式，降低未来维护成本

## 踩坑记录

### 2026-07: Vercel 构建 OOM 与 Chunk 循环依赖

**问题 1: Vercel 构建内存不足（OOM）**
*   **现象**: 本地 `npm run build` 正常，Vercel 构建时进程被 SIGKILL，报告 "Out of Memory"
*   **原因**: Vercel 构建容器内存有限，VitePress 文档量大导致内存压力过大
*   **处理**: 在 `docs/.vitepress/config.js` 的 `vite.build.rollupOptions.output.manualChunks` 中添加 chunk 分割

**问题 2: Rollup 循环 chunk 依赖**
*   **现象**: `Circular chunk: mermaid -> vendor -> mermaid` 和 `Circular chunk: mermaid -> vitepress -> mermaid`
*   **原因**: 将 `mermaid` 和 `vitepress` 单独抽成 chunk 后，它们之间产生循环依赖
*   **修复**: 排除 `mermaid` 和 `vitepress`，仅保留 `vendor` 分包：
  ```js
  manualChunks: (id) => {
    if (id.includes('node_modules') && !id.includes('vitepress') && !id.includes('mermaid')) {
      return 'vendor'
    }
  }
  ```

**经验**:
*   Vercel OOM 时先在本地验证 build 能跑通，再推送
*   分包时避免将 VitePress 核心依赖（vitepress/mermaid）与 vendor 混合抽离，容易触发循环引用
*   Vercel 环境变量 `VERCEL=1` 可触发低内存模式（`buildConcurrency: 4`）

## 后续演进方向
- [ ] 搜索体验优化 (Algolia 深度集成)
- [ ] 多语言支持 (i18n)
- [ ] 交互式代码 Playground 支持
- [ ] 自动化的静态资源压缩流水线

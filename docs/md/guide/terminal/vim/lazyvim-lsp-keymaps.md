---
title: "LazyVim LSP 快捷键总览"
date: "2026-07-14"
source: "用户整理"
url: ""
tags: ["neovim", "lazyvim", "lsp", "keymap", "gr", "gd", "gI", "K"]
---

# LazyVim LSP 快捷键总览

> **核心结论**：LazyVim 是开箱即用的 IDE 配置发行版，**LSP 支持默认内置**——你之前用的 `gr` / `gd` / `gI` 就是内置的。`gr`（Find References）会**直接执行**而非弹选择框，结果显示在可浏览列表中。**查看所有快捷键**：`<Space>` 弹出 which-key 菜单 / `:Telescope keymaps` 搜索。

> **关键洞察**：
> - **LSP 框架默认开启**，**不要**额外装插件
> - **`gr` = 直接执行**，不是弹选项
> - **语言支持靠 `:LazyExtras` 启用扩展**，不是修改配置

## LazyVim LSP 核心插件

| 插件 | 角色 |
|------|------|
| `neovim/nvim-lspconfig` | **核心**：与各种语言的 LSP 服务器通信 |
| `williamboman/mason.nvim` + `mason-lspconfig.nvim` | **管理工具**：自动安装/更新 LSP 服务器 |
| `hrsh7th/nvim-cmp` | **代码补全**：与 LSP 集成 |
| `nvim-treesitter/nvim-treesitter` | **语法解析**：辅助 LSP 做代码分析 |

## 为特定语言启用 LSP

**LSP 框架是现成的，但你需要为每种语言开「扩展」**：

1. Neovim 中执行 `:LazyExtras`
2. 搜索语言，比如 `lang.typescript`、`lang.python`、`lang.clangd` (C/C++)
3. 光标移过去按 `x` 启用
4. LazyVim **自动通过 Mason 安装**对应 LSP 服务器

启用后 `gr` 等快捷键即可正常工作。

## 核心 LSP 快捷键

| 快捷键 | 功能 |
|--------|------|
| `gr` | **查找引用 (References)**：列出当前符号在项目所有引用位置 |
| `gd` | **跳转到定义 (Go to Definition)** |
| `gI` | **跳转到实现 (Go to Implementation)** |
| `gD` | **跳转到声明 (Go to Declaration)** |
| `K` | **显示悬停信息 (Hover)**：当前符号的文档/类型 |
| `<leader>ca` | **代码操作 (Code Action)**：可用代码修复/重构 |
| `<leader>cR` | **重命名 (Rename)**：重命名当前符号 |

### `gr` 的行为细节

按 `gr` 后**不会弹选择框**，而是：
1. 直接执行"查找引用"
2. 在项目所有引用位置中搜索
3. 显示在一个**可浏览的列表**中

## 查看所有快捷键

### 方法 1：which-key 菜单

Normal 模式下按 `<Space>`，下方弹出所有以 `<Space>` 开头的快捷键分组。

### 方法 2：Telescope 搜索

```
:Telescope keymaps
```

打开搜索/浏览界面，可查询所有已定义快捷键。

## 同仓库相关资源

- [lazyvim-keymap-config.md](./lazyvim-keymap-config.md) — 自定义 keymaps.lua 完整配置
- [lazyvim-lsp-config.md](./lazyvim-lsp-config.md) — LSP 自定义快捷键配置
- [lazyvim-java-setup.md](./lazyvim-java-setup.md) — Java 扩展配置
- [lazyvim-java-gi-troubleshoot.md](./lazyvim-java-gi-troubleshoot.md) — Java gI 排查
---
title: "LazyVim LSP 自定义配置"
date: "2026-07-14"
source: "用户整理"
url: ""
tags: ["neovim", "lazyvim", "lsp", "lspconfig", "config", "plugin"]
---

# LazyVim LSP 自定义配置

> **核心结论**：LazyVim 的 LSP 框架默认已开启，**不需要额外装插件**——`gr` / `gd` / `gI` 等快捷键由内置系统提供。需要修改默认键位时，在 `lua/config/keymaps.lua` 用 `nvim-lspconfig` 全局配置即可覆盖。

> **关键洞察**：
> - **默认行为 vs 自定义**：LSP 默认键位已能满足 90% 场景，**仅在确实需要覆盖时才修改**
> - **配置覆盖用 `opts`**：插件配置中的 `opts = { servers = { ['*'] = { keys = {...} } } }`
> - **LazyVim 自身的 `lang.java` 已包含全部配置**，不要重复自定义 `nvim-jdtls`

## LazyVim LSP 系统由以下核心插件构成

| 插件 | 角色 |
|------|------|
| `neovim/nvim-lspconfig` | 核心：与各种语言的 LSP 服务器进行通信和配置 |
| `williamboman/mason.nvim` + `williamboman/mason-lspconfig.nvim` | 管理工具：自动安装/更新各类语言的 LSP 服务器 |
| `hrsh7th/nvim-cmp` | 代码补全引擎：与 LSP 集成，提供代码补全 |
| `nvim-treesitter/nvim-treesitter` | 增强代码高亮和语法解析，辅助 LSP 精准分析 |

## 自定义键位

### 配置文件位置

```
lua/config/keymaps.lua
```

### 修改全局 LSP 键位（推荐方式）

```lua
{
  "neovim/nvim-lspconfig",
  opts = {
    servers = {
      ['*'] = {
        keys = {
          -- 在这里添加或覆盖你的快捷键
          { "K", vim.lsp.buf.hover, desc = "Hover" },
        },
      },
    },
  },
}
```

**说明**：
- `servers = { ['*'] = ... }` → 应用到**所有** LSP 服务器
- `keys = {...}` → 键位定义列表

## Java 注意事项

⚠️ **不要**在 `lua/plugins/` 下手动添加 `nvim-jdtls` 或 `nvim-lspconfig` 的配置——LazyVim 的 `lang.java` 扩展已经包含全部配置。**重复定义会造成冲突**。

## LazyExtras 状态实例（参考）

```
Enabled Plugins: (5)
  ● coding.blink        ← blink.cmp, friendly-snippets, blink.compat, catppuccin
  ● editor.aerial       ← aerial.nvim, edgy.nvim, lualine.nvim, telescope.nvim, trouble.nvim
  ● editor.outline       ← outline.nvim, edgy.nvim, trouble.nvim
  ● editor.snacks_explorer  ← snacks.nvim
  ● editor.snacks_picker   ← nvim-lspconfig, snacks.nvim, alpha-nvim, dashboard-nvim, flash.nvim, mini.starter, todo-comments.nvim

Enabled Languages: (5)
  ● lang.docker     ← mason.nvim, nvim-lspconfig, nvim-treesitter, none-ls.nvim, nvim-lint
  ● lang.java       ← mason.nvim, nvim-jdtls, nvim-lspconfig, nvim-treesitter, which-key.nvim, nvim-dap
  ● lang.json       ← SchemaStore.nvim, nvim-lspconfig, nvim-treesitter
  ● lang.markdown   ← markdown-preview.nvim, mason.nvim, nvim-lspconfig, render-markdown.nvim, conform.nvim, none-ls.nvim, nvim-lint
  ● lang.python     ← neotest-python, nvim-dap-python, nvim-lspconfig, nvim-treesitter, venv-selector.nvim, mason-nvim-dap.nvim, neotest, nvim-cmp, nvim-dap
```

## 拓展阅读

- [lazyvim-lsp-keymaps.md](./lazyvim-lsp-keymaps.md) — LSP 快捷键速查
- [lazyvim-keymap-config.md](./lazyvim-keymap-config.md) — 自定义 keymaps.lua 完整配置
- [lazyvim-java-setup.md](./lazyvim-java-setup.md) — Java 扩展配置
- [lazyvim-java-gi-troubleshoot.md](./lazyvim-java-gi-troubleshoot.md) — Java gI 排查
- [lazyvim-one-click-install.md](./lazyvim-one-click-install.md) — 一键安装

## 参考

- nvim-lspconfig：https://github.com/neovim/nvim-lspconfig
- LazyVim 官方文档：https://www.lazyvim.org/
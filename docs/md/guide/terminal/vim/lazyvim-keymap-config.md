---
title: "LazyVim 自定义 Keymaps 配置"
date: "2026-07-14"
source: "用户整理"
url: ""
tags: ["neovim", "lazyvim", "keymap", "lua", "config"]
---

# LazyVim 自定义 Keymaps 配置

> **核心结论**：将以下配置写入 `~/.config/nvim/lua/config/keymaps.lua`，即可覆盖或扩展 LazyVim 默认键位。**关键设计**：**Alt+.跳下一个错误**、**F2清搜索高亮**、**jj/jk/kk退出插入模式**、**Leader+o/i快速插空行**、**Leader+数字寄存器切换**。

> **关键洞察**：
> - **Alt+.** = 跳到下一个错误（`M-.` 映射到 `]e`）
> - **F2** = 一键清除搜索高亮（n/i 模式都生效）
> - **jj/jk/kk** = 快速退出插入模式（个性化键位）
> - **`<Leader>o` / `<Leader>i`** = 当前行下方/上方插空行（自动 + `<Esc>`）
> - **`<Leader>tl`** = Yank 当前行 + 打开终端
> - **`<C-h>` / `<C-l>`** = 水平翻屏（`zH` / `zL`）
> - **`<C-q>`** = 视觉块模式（替代默认 `<C-v>` 的鼠标选择冲突）

## 文件位置

```
~/.config/nvim/lua/config/keymaps.lua
```

## 配置内容

```lua
-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here
-- 官方快捷键文档: https://www.lazyvim.org/keymaps#general
-- 通用格式
-- vim.keymap.set('模式', '快捷键', '映射动作', {选项})

-- lua/config/keymaps.lua
local map = vim.keymap.set
local opts = { silent = true }

-- 映射alt+1打开侧边栏
map('n', '<M-1>', '<leader>e', { remap = true, desc = 'Alt+1 to Explorer' })
-- 映射alt+.跳到下一个错误
map('n', '<M-.>', ']e', { remap = true, desc = 'Next Error(Alt + .)' })
-- Shift + . 是 >, 所以 Alt + Shift + . 就是 Alt + >,在 Neovim 中，这种组合用 <M->> 表示（M = Meta = Alt）
--vim.keymap.set('n', '<M->>', '[e', {
  --noremap = true,
  --silent = true,
  --desc = 'Prev Error (Alt + Shift + .)'
--})
-- Lazyvim自带 <C-/>	Hide Terminal
-- Lazyvim自带 gcc	Toggle comment, 注释
map("n", [[<C-\>]], [[<C-/>]], { remap = true, desc = "Toggle terminal" })
map("t", [[<C-\>]], [[<C-/>]], { remap = true, desc = "Toggle terminal" })
map("n", [[<C-_>]], "gcc", { remap = true, desc = "Toggle comment" })

-- 光标显示
vim.opt.cursorline = true
vim.opt.cursorcolumn = true

-- 改用 <C-q>（也就是 Ctrl + q）进入视觉块模式
map("n", "<C-q>", "<C-v>", { noremap = true })
map("x", "<C-q>", "<C-v>", { noremap = true })

-- 在 Normal 模式下，按下 <Leader>fs（通常是 Space + f + s），执行 :w，即保存当前文件
vim.keymap.set('n', '<Leader>fs', ':w<CR>', { noremap = true, silent = true, desc = 'Save file' })

-- 取消搜索高亮
map("n", "<F2>", ":nohlsearch<CR>", opts)
map("i", "<F2>", "<C-O>:nohlsearch<CR>", opts)

-- 插入模式退出
map("i", "jj", "<Esc>", opts)
map("i", "jk", "<Esc>", opts)
map("i", "kk", "<Esc>", opts)

-- 插入空行
map("n", "<Leader>o", "o<Esc>", opts)
map("n", "<Leader>i", "O<Esc>", opts)

-- 光标后的内容换行
map("n", "<Leader>n", "a<CR><Esc>", opts)

-- 光标后添加空格
map("n", "<Leader>ab", "a <Esc>", opts)


-- 寄存器操作映射
for i = 0, 6 do
    map("n", "<Leader>" .. i, "\"" .. i)
end
map("n", "<Leader>a", "\"a")

-- 删除到指定寄存器
map("n", "<Leader>dd", "\"1dd")
map("n", "<Leader>dw", "\"1dw")
map("n", "<Leader>diw", "\"1diw")
map("n", "<Leader>di\"", "\"1di\"")
map("n", "<Leader>dit", "\"1dit")
map("n", "<Leader>di(", "\"1di(")
map("n", "<Leader>di'", "\"1di'")
map("n", "<Leader>dib", "\"1dib")

-- 快捷定位
map("n", "gh", "^")
map("n", "gl", "$")
map("n", "dgh", "d^")
map("n", "dgl", "d$")
map("n", "tn", "gt")
map("n", "tp", "gT")

-- 保存并退出当前窗口
map('n', '<Leader>q', ':q<CR>', { desc = 'Quit current window' })

-- 强制退出所有窗口，不保存
map('n', '<Leader>Q', ':qa!<CR>', { desc = 'Force quit all' })


-- 上下翻半页（更快的滚动）
map('n', '<Leader>d', '<C-d>', vim.tbl_extend('force', opts, { desc = 'Page down (half)' }))
map('n', '<Leader>u', '<C-u>', vim.tbl_extend('force', opts, { desc = 'Page up (half)' }))

-- 左右翻屏（水平滚动）
map('n', '<C-h>', 'zH', vim.tbl_extend('force', opts, { desc = 'Scroll left' }))
map('n', '<C-l>', 'zL', vim.tbl_extend('force', opts, { desc = 'Scroll right' }))

-- 退出可视模式（用 v 再次退出）
map('v', 'v', '<Esc>', vim.tbl_extend('force', opts, { desc = 'Quit visual mode' }))

-- 重做（撤销的反向操作）
map('n', 'U', '<C-r>', vim.tbl_extend('force', opts, { desc = 'Redo' }))

-- Normal 模式：复制当前行并打开终端
map('n', '<Leader>tl', 'Vy<Leader>ft', { remap = true, desc = 'Yank line and open terminal' })
-- Visual 模式：复制选中内容并打开终端
map('v', '<Leader>tl', 'y<Leader>ft', { remap = true, desc = 'Yank selection and open terminal' })

-- Lazyvim自带的快捷键
-- 在当前项目中全文搜索: <Leader>sg
-- 在当前目录中全文搜索: <Leader>sG
-- 在/根目录中全文搜索: <Leader>/
```

## 快捷键速查表

### Alt 系列

| 快捷键 | 作用 |
|--------|------|
| `Alt+1` | 打开侧边栏（Explorer） |
| `Alt+.` | 跳到下一个错误 |

### Leader 系列（`<Leader>` 通常是 Space）

| 快捷键 | 作用 |
|--------|------|
| `<Leader>fs` | 保存当前文件（`:w`） |
| `<Leader>o` | 在当前行下方插空行 |
| `<Leader>i` | 在当前行上方插空行 |
| `<Leader>n` | 光标后内容换行 |
| `<Leader>ab` | 光标后添加一个空格 |
| `<Leader>0~6` | 切换数字寄存器 |
| `<Leader>a` | 切换 a 寄存器 |
| `<Leader>dd` / `dw` 等 | 删除到寄存器 1（多种 di* 模式） |
| `<Leader>q` | 退出当前窗口 |
| `<Leader>Q` | 强制退出所有窗口 |
| `<Leader>d` / `u` | 上下翻半页（`<C-d>` / `<C-u>`） |
| `<Leader>tl` | Yank 当前行 + 打开终端 |

### 单字符键位

| 快捷键 | 作用 |
|--------|------|
| `gh` / `gl` | 跳到行首/行尾（`^` / `$`） |
| `dgh` / `dgl` | 删除到行首/行尾 |
| `tn` / `tp` | 切换 tab 下一个/上一个 |
| `<C-h>` / `<C-l>` | 左右水平翻屏（`zH` / `zL`） |
| `<C-q>` | 视觉块模式（替代 `<C-v>`） |
| `v` | 退出可视模式 |
| `U` | 重做（撤销的反向操作，`<C-r>`） |

### 编辑模式快捷键

| 快捷键 | 作用 |
|--------|------|
| `jj` / `jk` / `kk` | 退出插入模式（`<Esc>`） |

### F2 全局

| 快捷键 | 作用 |
|--------|------|
| `F2` | 清除搜索高亮（Normal 和 Insert 模式都生效） |

### 终端模式

| 快捷键 | 作用 |
|--------|------|
| `<C-\>` | 切换终端（`n` 和 `t` 模式） |

### 光标显示

```lua
vim.opt.cursorline = true      -- 高亮当前行
vim.opt.cursorcolumn = true    -- 高亮当前列
```

## LazyVim 自带的常用快捷键

> - 在当前项目中全文搜索：`<Leader>sg`
> - 在当前目录中全文搜索：`<Leader>sG`
> - 在根目录中全文搜索：`<Leader>/`

## 同仓库相关资源

- [lazyvim-one-click-install.md](./lazyvim-one-click-install.md) — 一键安装脚本
- [lazyvim-java-setup.md](./lazyvim-java-setup.md) — Java 扩展配置
- [markdown-preview-deps.md](./markdown-preview-deps.md) — markdown-preview.nvim 插件
- [../lazyvim-cheatsheet.md](../lazyvim-cheatsheet.md) — 官方快捷键速查表

## 官方参考

- LazyVim 默认 keymaps：https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
- 官方快捷键文档：https://www.lazyvim.org/keymaps#general
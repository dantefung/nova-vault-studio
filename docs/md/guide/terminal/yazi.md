# Yazi 安装和使用指南

## 概述

Yazi 是一个用 Rust 开发的异步文件管理器，具有以下特点：
- 🚀 高性能：基于异步 I/O，响应快速
- 🎨 现代 UI：支持图片预览、图标显示等现代特性
- ⌨️ 键盘友好：高效的键盘导航和快捷键
- 🔧 高度可定制：通过配置文件自定义外观和行为
- 🧩 插件支持：支持 Lua 脚本扩展功能

## 安装

### 在 macOS 上安装

```bash
# 使用 Homebrew 安装
brew install yazi

# 或使用 MacPorts
sudo port install yazi
```

### 在 Linux 上安装

#### Debian/Ubuntu

```bash
# 添加 Yazi 官方仓库
apt update && apt install -y yazi
```

或者使用 Cargo（推荐）：

```bash
cargo install yazi-fm
```

#### Arch Linux

```bash
# 使用 pacman
sudo pacman -S yazi

# 或从 AUR 安装最新版本
yay -S yazi-git
```

#### 其他 Linux 发行版

```bash
# 使用 Cargo（需要先安装 Rust）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install yazi-fm
```

### 在 Windows 上安装

#### 使用 Scoop

```powershell
scoop install yazi
```

#### 使用 Chocolatey

```powershell
choco install yazi
```

#### 使用 Cargo

```powershell
cargo install yazi-fm
```

### 从源代码构建

```bash
git clone https://github.com/sxyazi/yazi.git
cd yazi
cargo build --release
```

## 快速开始

### 启动 Yazi

```bash
# 启动 Yazi
yazi

# 启动并进入指定目录
yazi /path/to/directory

# 使用选项启动
yazi --ui-only  # 仅 UI 模式
```

### 基本导航快捷键

| 快捷键 | 功能 |
|--------|------|
| `↑` / `k` | 向上移动 |
| `↓` / `j` | 向下移动 |
| `←` / `h` | 返回上级目录 |
| `→` / `l` | 进入目录/打开文件 |
| `g` `g` | 跳转到顶部 |
| `G` | 跳转到底部 |
| `Page Up` / `u` | 向上翻页 |
| `Page Down` / `d` | 向下翻页 |
| `~` | 跳转到主目录 |
| `/` | 搜索文件 |
| `?` | 向上搜索 |

### 文件操作快捷键

| 快捷键 | 功能 |
|--------|------|
| `y` | 复制文件 |
| `x` | 剪切文件 |
| `p` | 粘贴文件 |
| `d` | 删除文件 |
| `a` | 新建文件 |
| `A` | 新建目录 |
| `r` | 重命名文件 |
| `c` | 复制文件名 |
| `C` | 复制文件路径 |
| `Escape` | 清除选择 |

### 选择和批量操作

| 快捷键 | 功能 |
|--------|------|
| `` ` `` | 切换当前项选择 |
| `Space` | 标记/取消标记 |
| `v` | 反转选择 |
| `i` | 反转选择（所有项） |
| `Ctrl + a` | 全选 |
| `Ctrl + u` | 清除选择 |

## 配置

### 配置文件位置

配置文件存储在以下位置：

- **Linux/macOS**: `~/.config/yazi/yazi.toml`
- **Windows**: `%AppData%\yazi\yazi.toml`

首次运行时，Yazi 会自动创建默认配置文件。

### 基本配置示例

```toml
# ~/.config/yazi/yazi.toml

# 外观设置
[ui]
# 是否启用图标
icon_enabled = true
# 是否启用图像预览
image_preview = true
# 文件数量显示
count_visible = true

# 确认设置
[confirm]
# 删除文件前确认
delete = true
# 覆盖文件前确认
overwrite = true

# 搜索设置
[search]
# 启用实时搜索
live = true
# 搜索不区分大小写
ignore_case = true
```

### 主题配置

创建主题文件 `~/.config/yazi/theme.toml`：

```toml
# Yazi 主题配置示例
[color]
# 前景色和背景色定义
# 可使用 hex 颜色代码或预定义的颜色名

[icons]
# 文件类型图标配置
# 按文件扩展名自定义图标和颜色
```

## 进阶功能

### 图片预览

Yazi 支持多种图片预览后端：

```bash
# 在支持的终端中，选中图片文件会自动预览

# 对于不同的终端，需要安装不同的预览工具：
# - kitty: 内置支持
# - WezTerm: 内置支持
# - iTerm2: 需要 chafa
# - 其他终端: 需要 chafa 或 sixel 支持
```

### 文件挂钩

编辑 `~/.config/yazi/init.lua` 运行自定义 Lua 脚本：

```lua
-- 例如：在打开时自动进入特定目录
local function setup()
  -- Yazi 初始化代码
end

return { setup = setup }
```

### 快捷键自定义

编辑配置文件中的快捷键绑定：

```toml
[keys]
# 自定义快捷键映射
[keys.normal]
# 按键 = "命令"
j = "move_char 1"
k = "move_char -1"
```

### 集成 Shell

#### Bash

```bash
# 添加到 ~/.bashrc
eval "$(yazi --init)"
```

#### Zsh

```bash
# 添加到 ~/.zshrc
eval "$(yazi --init)"
```

#### Fish

```fish
# 添加到 ~/.config/fish/config.fish
yazi --init | source
```

这样可以实现退出 Yazi 时自动进入所在目录。

### Vim 集成

Yazi 可以与 Vim 深度集成，使用户能够在 Vim 中快速打开文件或切换工作目录。

#### 配置 Vim 打开 Yazi

在 `~/.vim/vimrc` 或 `~/.vimrc` 中添加以下配置：

```vim
" 定义函数打开 Yazi 文件管理器
function! YaziOpen()
  let current_dir = expand('%:p:h')
  execute 'silent !' . 'yazi ' . shellescape(current_dir)
  edit!
endfunction

" 创建命令
command! Yazi call YaziOpen()

" 可选：设置快捷键
nnoremap <leader>y :Yazi<CR>
```

#### 在 Yazi 中编辑文件时打开 Vim

编辑 `~/.config/yazi/yazi.toml` 配置文件打开方式：

```toml
# 配置文件关联
[open]
# 使用 vim 打开文本文件
rules = [
  { mime = "text/*", cmd = "vim" },
  { mime = "application/json", cmd = "vim" },
]
```

#### Vim 插件扩展

推荐使用 `chriszarate/yazi.vim` 这是原生 Vim 的首选集成插件：

**Vim-Plug 配置示例**:

```vim
" 在 Vim 中集成 Yazi 文件浏览器（推荐）
Plug 'chriszarate/yazi.vim'
```

启用后，可以使用以下命令：

```vim
" 在新窗口打开 Yazi
:Yazi

" 打开当前文件所在目录的 Yazi
:Yazi %:p:h
```

#### 从 Yazi 打开 Vim 的双向集成

创建一个 Shell 别名实现更流畅的工作流：

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc

# Yazi + Vim 整合别名
function yv() {
  local file=$(yazi -h)
  [ -n "$file" ] && vim "$file"
}

# 或使用以下脚本在 ~/.local/bin/yv
# #!/bin/bash
# files=$(yazi)
# [ -n "$files" ] && vim "$files"
```

使用方式：

```bash
yv  # 启动 Yazi，选择文件后使用 Vim 打开
```

#### 在 Vim 中通过 Yazi 浏览项目文件

结合 fzf 和 Yazi 提高文件查找效率：

```vim
" 在 Vim 中组合使用 Yazi 和 fzf
nnoremap <C-p> :YaziCwd<CR>
nnoremap <C-o> :!yazi<CR>
```

#### 快捷键建议

建议在 Vim 配置（`~/.vimrc`）中添加以下快捷键：

```vim
" 打开 Yazi 浏览当前目录
nnoremap <leader>e :Yazi<CR>

" 打开 Yazi 浏览当前文件目录
nnoremap <leader>E :Yazi %:p:h<CR>

" 在新标签页打开 Yazi
nnoremap <leader><Tab>y :tabnew<CR>:Yazi<CR>
```

#### Vim 与 Yazi 工作流推荐

1. **启动 Vim**：`vim .`
2. **快速打开文件**：按 `<leader>e` 启动 Yazi
3. **选择文件**：在 Yazi 中导航选择文件，按 Enter 打开
4. **编辑完成**：返回 Vim 编辑，可重复步骤 2-3
5. **批量操作**：在 Yazi 中标记多个文件，批量打开或处理

## 常见使用场景

### 场景 1: 文件浏览和查找

```bash
# 启动 Yazi
yazi

# 使用 / 搜索文件名
# 按 Enter 跳转到找到的文件
```

### 场景 2: 批量复制文件

```bash
# 使用 Space 标记多个文件
# 按 y 复制
# 导航到目标目录
# 按 p 粘贴
```

### 场景 3: 快速文件操作

```bash
# 删除文件：选择文件后按 d
# 重命名：按 r
# 新建文件：按 a
```

## 性能优化建议

1. **禁用不需要的预览**：如果预览影响性能，在配置中禁用某些预览类型
2. **减少图标渲染**：对于大型目录，可考虑关闭图标
3. **使用搜索功能**：大目录中使用搜索而不是滚动查找

## 常见问题

### 问题 1: 图片预览不工作

**解决方案**：
- 确保终端支持图片显示（kitty、WezTerm 等）
- 检查是否安装了 `chafa` 工具
- 在配置中确保 `image_preview = true`

### 问题 2: 退出 Yazi 后不在最后访问的目录

**解决方案**：
在 Shell 配置中添加 Yazi 初始化：
```bash
eval "$(yazi --init)"
```

### 问题 3: 快捷键冲突

**解决方案**：
- 检查 Shell 快捷键设置
- 在 Yazi 配置中自定义快捷键
- 查看 `~/.config/yazi/yazi.toml` 中的快捷键定义

## 有用的资源

- **官方仓库**: https://github.com/sxyazi/yazi
- **官方文档**: https://yazi-rs.github.io/
- **问题反馈**: https://github.com/sxyazi/yazi/issues
- **讨论社区**: https://github.com/sxyazi/yazi/discussions

## 总结

Yazi 是一个强大而轻量级的文件管理器，适合高效的命令行用户。通过合理配置和快捷键学习，可以大大提高文件管理的效率。

## 参考对比

| 功能 | Yazi | Ranger | Midnight Commander |
|------|------|--------|-------------------|
| 性能 | 非常快（异步 I/O） | 一般 | 中等 |
| UI 现代性 | 现代 | 基础 | 基础 |
| 图片预览 | ✅ | ✅ | ❌ |
| 配置难度 | 简单 | 中等 | 简单 |
| 活跃度 | 高（积极开发中） | 中等 | 低 |

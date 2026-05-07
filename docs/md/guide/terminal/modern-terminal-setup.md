---
title: "现代化终端配置指南"
date: "2026-05-07"
source: "Github Gist / 公众号"
url: "https://gist.github.com/lltx/a61f98fdb761c9af7c5fd6cbfe963842"
---

# 现代化终端配置指南

> Ghostty + Zoxide + Yazi + Oh-My-Zsh 完整配置

---

## 工具列表

- **Ghostty** - 现代化 GPU 加速终端模拟器
- **Zoxide** - 智能目录跳转工具（cd 的智能替代）
- **Yazi** - 快速终端文件管理器
- **Oh-My-Zsh** - Zsh 配置框架

---

## Ghostty 终端配置

**位置**: `~/.config/ghostty/config`

```ini
# ============================================
# Ghostty Terminal - Complete Configuration
# ============================================

# --- Typography ---
font-family = "Maple Mono NF CN"
font-size = 15
font-thicken = true
adjust-cell-height = 6

# --- Theme and Colors ---
theme = Kanagawa Wave

# --- Window and Appearance ---
background-opacity = 1
macos-titlebar-style = transparent
window-padding-x = 14
window-padding-y = 10
window-save-state = never
window-width = 80
window-height = 24
window-theme = auto

# --- Cursor ---
cursor-style = bar
cursor-style-blink = true

# --- Mouse ---
mouse-hide-while-typing = true
copy-on-select = clipboard

# --- Quick Terminal (Quake-style dropdown) ---
quick-terminal-position = top
quick-terminal-screen = mouse
quick-terminal-autohide = true
quick-terminal-animation-duration = 0.15

# --- Close behavior ---
confirm-close-surface = false

# --- Security ---
clipboard-paste-protection = true
clipboard-paste-bracketed-safe = true

# --- Shell Integration ---
shell-integration = detect
shell-integration-features = cursor,sudo,no-title,ssh-env,ssh-terminfo,path

# --- Keybindings ---
# Tabs
keybind = cmd+t=new_tab
keybind = cmd+shift+left=previous_tab
keybind = cmd+shift+right=next_tab
keybind = cmd+w=close_surface

# Splits
keybind = cmd+d=new_split:right
keybind = cmd+shift+d=new_split:down
keybind = cmd+alt+left=goto_split:left
keybind = cmd+alt+right=goto_split:right
keybind = cmd+alt+up=goto_split:top
keybind = cmd+alt+down=goto_split:bottom

# Font size
keybind = cmd+plus=increase_font_size:1
keybind = cmd+minus=decrease_font_size:1
keybind = cmd+zero=reset_font_size

# Quick terminal global hotkey
keybind = global:ctrl+grave_accent=toggle_quick_terminal

# Splits management
keybind = cmd+shift+e=equalize_splits
keybind = cmd+shift+f=toggle_split_zoom

# Reload config
keybind = cmd+shift+comma=reload_config

# --- Performance ---
scrollback-limit = 25000000
```

---

## Yazi 文件管理器配置

### 主配置文件

**位置**: `~/.config/yazi/yazi.toml`

```toml
[mgr]
ratio = [1, 2, 5]
sort_by = "natural"
sort_sensitive = false
sort_reverse = false
sort_dir_first = true
linemode = "size"
show_hidden = false
show_symlink = true
scrolloff = 5
mouse_events = ["click", "scroll"]
title_format = "Yazi: {cwd}"

[preview]
max_width = 600
max_height = 900
image_filter = "lanczos3"
image_quality = 75

[opener]
edit = [
  { run = 'code %s', desc = "VSCode", for = "unix" },
]
open = [
  { run = 'open %s', desc = "Open", for = "macos" },
]
reveal = [
  { run = 'open -R %1', desc = "Reveal in Finder", for = "macos" },
]

[open]
prepend_rules = [
  { mime = "text/*", use = ["edit", "open", "reveal"] },
  { mime = "application/json", use = ["edit", "open", "reveal"] },
  { mime = "*/javascript", use = ["edit", "open", "reveal"] },
  { mime = "*/typescript", use = ["edit", "open", "reveal"] },
  { mime = "*/x-yaml", use = ["edit", "open", "reveal"] },
]

[tasks]
micro_workers = 10
macro_workers = 25
bizarre_retry = 5

[plugin]
prepend_fetchers = [
  { id = "git", name = "*", run = "git", prio = "normal" },
]
```

### 快捷键配置

**位置**: `~/.config/yazi/keymap.toml`

```toml
[[manager.prepend_keymap]]
on = ["g", "h"]
run = "cd ~"
desc = "Go to home directory"

[[manager.prepend_keymap]]
on = ["g", "c"]
run = "cd ~/.config"
desc = "Go to config directory"

[[manager.prepend_keymap]]
on = ["g", "d"]
run = "cd ~/Downloads"
desc = "Go to downloads"

[[manager.prepend_keymap]]
on = ["g", "w"]
run = "cd ~/work"
desc = "Go to work directory"

[[manager.prepend_keymap]]
on = ["g", "D"]
run = "cd ~/Desktop"
desc = "Go to desktop"

[[manager.prepend_keymap]]
on = ["g", "t"]
run = "cd /tmp"
desc = "Go to tmp"
```

### 主题配置

**位置**: `~/.config/yazi/theme.toml`

```toml
# Tokyo Night inspired theme - works well with most terminal color schemes

[mode]
normal_main = { fg = "black", bg = "blue", bold = true }
normal_alt = { fg = "blue", bg = "reset", bold = true }
select_main = { fg = "black", bg = "green", bold = true }
select_alt = { fg = "green", bg = "reset", bold = true }
unset_main = { fg = "black", bg = "red", bold = true }
unset_alt = { fg = "red", bg = "reset", bold = true }

[status]
sep_left = { open = "", close = "" }
sep_right = { open = "", close = "" }
overall = { fg = "reset", bg = "reset" }

[filetype]
rules = [
  # Media
  { mime = "image/*", fg = "magenta" },
  { mime = "video/*", fg = "yellow" },
  { mime = "audio/*", fg = "yellow" },

  # Archives
  { mime = "application/zip", fg = "red" },
  { mime = "application/gzip", fg = "red" },
  { mime = "application/x-tar", fg = "red" },
  { mime = "application/x-bzip2", fg = "red" },
  { mime = "application/x-7z-compressed", fg = "red" },
  { mime = "application/x-rar", fg = "red" },
  { mime = "application/x-xz", fg = "red" },

  # Documents
  { mime = "application/pdf", fg = "cyan" },
  { mime = "application/*doc*", fg = "green" },
  { mime = "application/*sheet*", fg = "green" },
  { mime = "application/*presentation*", fg = "green" },

  # Fallback
  { name = "*", fg = "reset" },
  { name = "*/", fg = "blue", bold = true },
]
```

---

## Oh-My-Zsh + Zoxide 配置

**位置**: `~/.zshrc`

```zsh
# =================== Oh-My-Zsh 配置 ===================
export ZSH="$HOME/.oh-my-zsh"

# 主题设置
ZSH_THEME="agnoster"

# 禁用自动更新
DISABLE_AUTO_UPDATE="true"

# 插件配置
plugins=(
    git
    zsh-syntax-highlighting
    zsh-autosuggestions
)

source $ZSH/oh-my-zsh.sh

# =================== 环境变量配置 ===================
export LANG=en_US.UTF-8

# 自动建议高亮样式
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE=fg=30

# 隐藏 agnoster 主题中的用户名@主机名
DEFAULT_USER="your_username"

# =================== Ghostty 标题设置为当前目录 ===================
if [[ -n "${GHOSTTY_RESOURCES_DIR:-}" ]]; then
    ghostty_set_title() {
        # 将 HOME 替换为 ~，保持标题更短
        local dir="${PWD/#$HOME/~}"
        # Ghostty 支持 OSC 2 设置窗口标题
        printf '\033]2;%s\033\\' "$dir"
    }

    autoload -Uz add-zsh-hook
    add-zsh-hook chpwd ghostty_set_title
    add-zsh-hook precmd ghostty_set_title
    add-zsh-hook preexec ghostty_set_title
    ghostty_set_title
fi

# =================== Yazi 文件管理器 ===================
function y() {
    local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
    yazi "$@" --cwd-file="$tmp"
    if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
        builtin cd -- "$cwd"
    fi
    rm -f -- "$tmp"
}

# =================== Zoxide 智能目录跳转 ===================
eval "$(zoxide init zsh)"
```

---

## 安装指南

### 1. 安装工具

```bash
# macOS (Homebrew)
brew install ghostty
brew install zoxide
brew install yazi
brew install ffmpegthumbnailer  # Yazi 视频预览
brew install poppler            # Yazi PDF 预览

# Oh-My-Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Zsh 插件
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### 2. 配置文件

```bash
# 创建配置目录
mkdir -p ~/.config/ghostty
mkdir -p ~/.config/yazi

# 复制配置文件（根据上面的配置内容创建）
# Ghostty: ~/.config/ghostty/config
# Yazi: ~/.config/yazi/{yazi.toml, keymap.toml, theme.toml}
# Zsh: ~/.zshrc
```

### 3. 重新加载配置

```bash
# 重新加载 Zsh 配置
source ~/.zshrc

# Ghostty 配置会在重启终端后生效
# 或使用快捷键 Cmd+Shift+, 重新加载
```

---

## 使用技巧

### Zoxide 智能跳转

```bash
z work          # 跳转到包含 "work" 的目录
z foo bar       # 跳转到同时包含 "foo" 和 "bar" 的目录
zi work         # 交互式选择（如果有多个匹配）
```

### Yazi 文件管理器

```bash
y               # 启动 Yazi（退出后会 cd 到当前目录）

# 快捷键（在 Yazi 中）
gh              # 跳转到 home 目录
gc              # 跳转到 .config 目录
gd              # 跳转到 Downloads 目录
gw              # 跳转到 work 目录
gD              # 跳转到 Desktop 目录
gt              # 跳转到 /tmp 目录
```

### Ghostty 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd+T` | 新建标签页 |
| `Cmd+D` | 垂直分屏 |
| `Cmd+Shift+D` | 水平分屏 |
| `Ctrl+`` | 全局快速终端（Quake 模式） |
| `Cmd+Shift+,` | 重新加载配置 |

---

## 主题推荐

### Ghostty 主题

- Kanagawa Wave（当前使用）
- Tokyo Night
- Catppuccin
- Nord
- Dracula

查看所有主题：`ghostty +list-themes`

### 字体推荐

- Maple Mono NF CN（当前使用）
- JetBrains Mono Nerd Font
- Fira Code Nerd Font
- Cascadia Code Nerd Font

---

## 注意事项

1. **Nerd Font**: Yazi 和 Oh-My-Zsh 主题需要 Nerd Font 才能正确显示图标
2. **Shell Integration**: Ghostty 的 shell integration 功能需要在配置中启用
3. **Zoxide**: 需要使用一段时间后才能建立目录访问历史
4. **Yazi 预览**: 需要安装额外的工具（ffmpegthumbnailer, poppler）才能预览视频和 PDF

---

## 备选配色方案：OneDark 优化版

```ini
# ==============================
# 字体与排版：打造呼吸感
# ==============================
font-family = "JetBrainsMono-Regular"
font-style-bold = "Medium"
font-style-bold-italic = "Medium Italic"
font-size = 16
font-thicken = true
grapheme-width-method = "unicode"
adjust-cell-width = 0%

# 水平边距收紧，垂直边距适中
window-padding-x = 15
window-padding-y = 15
window-save-state = "always"

# ==============================
# 沉浸式 UI：透明与高斯模糊
# ==============================
# 80% 不透明度 + 25 高斯模糊半径 = 磨砂玻璃质感
background-opacity = 0.8
background-blur-radius = 25

# ==============================
# 光标与性能
# ==============================
cursor-color = e5c07b
cursor-style = "bar"
cursor-style-blink = true
scrollback-limit = 20000

# ==============================
# 配色方案：OneDark 优化版
# ==============================
background = 1e222a
foreground = dcdfe4
selection-background = 405060
selection-foreground = dcdfe4
selection-invert-fg-bg = true

# ANSI 16 色调色板（护眼色系）
palette = 0=#1e222a
palette = 1=#e06c75
palette = 2=#98c379
palette = 3=#e5c07b
palette = 4=#61afef
palette = 5=#c678dd
palette = 6=#56b6c2
palette = 7=#dcdfe4
palette = 8=#545862
palette = 9=#e06c75
palette = 10=#98c379
palette = 11=#e5c07b
palette = 12=#61afef
palette = 13=#c678dd
palette = 14=#56b6c2
palette = 15=#ffffff

# ==============================
# 快捷键：全局 Quake 模式
# ==============================
keybind = global:alt+grave_accent=toggle_quick_terminal
```

### 可选增强

```ini
# 添加背景图片（需填写实际路径）
background-image = "/Users/lca/Pictures/your-wallpaper.jpg"
background-opacity = 0.8
background-image-fit = cover

# 隐藏 macOS 红黄蓝按钮（沉浸感更强）
macos-titlebar-style = hidden
```

---

## Ghostty 内置 CLI 命令

> Ghostty 追求极简但内置了实用的命令行工具，在终端直接执行即可

| 命令 | 功能 |
|------|------|
| `ghostty +list-themes` | 列出所有内置主题，直接在 config 里写 `theme = 主题名` 切换 |
| `ghostty +list-colors` | 打印当前配置的 ANSI 色块和 256 色调色板，直观验证是否刺眼 |
| `ghostty +list-fonts` | 列举所有被 Ghostty 正确识别的系统字体及其变体名称 |
| `ghostty +list-keybinds` | 查阅所有默认快捷键 |
| `ghostty +show-config` | 将最终生效的完整配置（含默认 + 覆盖）合并打印出来 |
| `ghostty +validate-config` | 语法检查 config 文件，精确指出错误行号 |

> **热重载**：修改 config 文件后**无需重启**，Ghostty 自动监听文件变更并实时刷新。

### 块状选择（Block Selection）

按住 `Option`（Mac）或 `Alt`（Win/Linux）再拖拽鼠标，可精准框选纵向表格数据，复制特定列区域，再也不用被横向整行选中困扰。

---

## 相关链接

- [Ghostty](https://ghostty.org/)
- [Zoxide](https://github.com/ajeetdsouza/zoxide)
- [Yazi](https://yazi-rs.github.io/)
- [Oh-My-Zsh](https://ohmyz.sh/)

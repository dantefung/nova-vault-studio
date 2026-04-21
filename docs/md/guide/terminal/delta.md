# Delta - Git Diff 查看助手安装和使用指南

## 概述

Delta 是一个用 Rust 开发的 Git diff 查看工具，为 `git diff` 和 `git log` 输出提供以下特性：

- 🎨 **语法高亮**：自动识别代码语言并应用语法高亮
- 🔍 **智能 Hunk 头显示**：显示包含变化的函数/类名
- 📊 **并排显示模式**：左右对比显示修改前后
- 🪟 **行号显示**：在行首显示行号便于定位
- 🎭 **主题支持**：多种内置主题可选
- ⚡ **高性能**：基于 Rust 开发，响应迅速

## 安装

### 在 macOS 上安装

#### 使用 Homebrew（推荐）

```bash
brew install git-delta
```

#### 使用 MacPorts

```bash
sudo port install git-delta
```

### 在 Linux 上安装

#### Debian/Ubuntu

可以从 GitHub Release 下载预编译二进制：

```bash
# 下载最新版本
wget https://github.com/dandavison/delta/releases/download/0.16.5/delta-0.16.5-x86_64-unknown-linux-gnu.tar.gz

# 解压
tar xzf delta-0.16.5-x86_64-unknown-linux-gnu.tar.gz

# 移动到 PATH
sudo mv delta-0.16.5-x86_64-unknown-linux-gnu/delta /usr/local/bin/
```

或使用 Cargo（推荐）：

```bash
cargo install git-delta
```

#### Arch Linux

```bash
# 使用 pacman
sudo pacman -S git-delta

# 或从 AUR
yay -S git-delta
```

#### Alpine Linux

```bash
apk add git-delta
```

#### Fedora/RHEL

```bash
sudo dnf install git-delta
```

### 在 Windows 上安装

#### 使用 Scoop

```powershell
scoop install delta
```

#### 使用 Chocolatey

```powershell
choco install delta
```

#### 使用 Cargo

```powershell
cargo install git-delta
```

#### 从 GitHub Release 下载

访问 [GitHub Release 页面](https://github.com/dandavison/delta/releases) 下载 Windows 版本的可执行文件。

### 验证安装

```bash
delta --version
```

## 快速开始

### 基础使用

#### 查看 git diff

```bash
# 已安装 delta 后，直接使用
git diff

# 或显式指定 pager
git diff --color-words | delta
```

#### 配置为默认 pager

将 delta 设置为 Git 的默认 pager：

```bash
# 使用 git config 命令
git config --global core.pager delta

# 或手动编辑 ~/.gitconfig
[core]
    pager = delta
```

#### 查看提交历史

```bash
# 查看简洁的提交历史
git log -p --delta

# 或使用自定义的 git alias
git log --patch
```

## 配置

### 配置文件位置

Delta 的配置通常在 Git 的配置文件中进行：

- **位置**：`~/.gitconfig` 或 `.git/config`

### 基本配置示例

编辑 `~/.gitconfig`，添加以下配置：

```ini
[core]
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    # 启用并排显示（宽终端推荐）
    side-by-side = false
    
    # 显示行号
    line-numbers = true
    
    # 高亮 Git 行（+/- 前缀）
    navigate = true
    
    # 主题
    theme = Monokai Extended
    
    # 文件修改统计
    file-modified-label = modified:
    
    # 保存光标位置
    keep-plus-minus-markers = false

[diff]
    # 使用 delta 处理所有 diff
    colorMoved = default
```

### 常用配置选项

| 配置项 | 说明 | 默认值 |
|-------|------|-------|
| `line-numbers` | 显示行号 | false |
| `side-by-side` | 并排显示 | false |
| `navigate` | 启用导航模式 | false |
| `theme` | 选择配色主题 | auto |
| `syntax-theme` | 语法高亮主题 | auto |
| `word-diff-regex` | 单词级别 diff 的正则 | 默认值 |
| `max-line-distance` | 最大行距（用于匹配行） | 0.6 |
| `true-color` | true（真彩色）/256（256色） | auto |

### 主题选择

查看可用主题：

```bash
delta --list-syntax-themes
delta --list-themes
```

常见主题：
- `Monokai Extended` - 推荐
- `GitHub` - GitHub 风格
- `Dracula` - 深色主题
- `Solarized (dark)` - Solarized 深色
- `Solarized (light)` - Solarized 浅色

### 自定义配置示例

#### 并排显示配置

```ini
[delta]
    side-by-side = true
    line-numbers = true
    line-numbers-left-format = "{nm:>4}│"
    line-numbers-right-format = "{np:>4}│"
```

#### 紧凑配置

```ini
[delta]
    line-numbers = true
    navigate = true
    theme = Monokai Extended
    syntax-theme = Monokai Extended
```

#### 函数名显示配置

```ini
[delta]
    # 在每个 hunk 前显示包含修改的函数名
    paging = always
```

## 进阶功能

### 导航模式

启用 `navigate` 选项后，可以在 pager 中快速导航：

```ini
[delta]
    navigate = true
```

快捷键：
- `n` - 下一个 Hunk
- `N` - 上一个 Hunk
- `↑`/`↓` - 上下滚动
- `q` - 退出

### 并排显示

对于宽屏终端，启用并排显示更直观：

```ini
[delta]
    side-by-side = true
    
    # 可选：限制列宽
    max-line-length = 512
```

### 与其他工具集成

#### 与 Difftool 集成

```bash
git config --global diff.tool delta
git config --global difftool.delta.cmd 'delta "$LOCAL" "$REMOTE"'
```

#### 与 Mergetool 配合

```ini
[merge]
    tool = vimdiff
    conflictstyle = diff3

[diff]
    external = delta
```

### 在 GitHub 上使用

如果想在 Terminal 中快速查看 GitHub PR 的 diff，可以使用工具如 `gh`（GitHub CLI）：

```bash
# 使用 gh 查看 PR diff，自动由 delta 处理
gh pr diff PR_NUMBER

# 确保在 ~/.gitconfig 中配置了 delta
```

## Vim 集成

### 在 Vim 中查看 Diff

由于 delta 设置为默认 pager，`:!git diff` 会自动使用 delta：

```vim
" 在 Vim 中查看 diff
:!git diff
:!git diff --cached
:!git log -p
```

或使用 Vim 的 `:read` 命令：

```vim
:read !git diff
:read !git --no-pager diff
```

## 常见使用场景

### 场景 1: 查看暂存区变化

```bash
git diff --staged
# 输出会自动由 delta 处理
```

### 场景 2: 查看两个提交间的变化

```bash
git diff commit1 commit2
```

### 场景 3: 查看特定文件的历史变化

```bash
git log -p path/to/file
```

### 场景 4: 交互式浏览修改

```bash
git add -p  # 交互式暂存
git checkout -p  # 交互式 checkout
```

## 故障排除

### 问题 1: delta 命令未找到

**解决方案**：
- 确保 delta 已正确安装
- 检查 PATH 环境变量包含 delta 的路径
- 验证安装：`which delta` 或 `delta --version`

### 问题 2: Git diff 不显示色彩

**解决方案**：
- 检查 Git 配置是否正确：`git config --global core.pager`
- 重新配置：`git config --global core.pager delta`
- 确保终端支持彩色输出

### 问题 3: 一些文件类型不高亮

**解决方案**：
- 检查 delta 是否识别文件类型
- 考虑使用 `--theme` 选项更换主题
- 某些二进制文件可能不支持高亮

### 问题 4: 性能问题（大文件 diff）

**解决方案**：
- 关闭行号显示：`delta --no-line-numbers`
- 禁用导航模式：移除 `navigate = true` 配置
- 使用 `--color-only` 只进行颜色处理

## 有用的资源

- **官方仓库**: https://github.com/dandavison/delta
- **官方文档**: https://github.com/dandavison/delta/blob/main/README.md
- **发布页面**: https://github.com/dandavison/delta/releases
- **配置示例**: https://github.com/dandavison/delta/wiki/Configuration-file-for-delta

## Git 别名快捷方式

添加以下别名到 `~/.gitconfig` 提升工作效率：

```ini
[alias]
    df = diff
    dcf = diff --cached
    dn = diff --no-ext-diff
    dw = diff --color-words
    dl = log -p
    dg = diff --no-color
```

使用示例：

```bash
git df                    # 查看 diff（自动使用 delta）
git dcf                   # 查看暂存区 diff
git dl -n 3               # 查看最后 3 个提交的详细变化
git dg | less             # 查看无颜色的 diff
```

## 性能优化

### 对于大型仓库

```ini
[delta]
    # 禁用某些特性以提高性能
    
    # 不显示行号
    line-numbers = false
    
    # 禁用导航
    navigate = false
    
    # 使用更简单的主题
    theme = GitHub
```

### 对于慢速网络

```bash
# 使用 --color-only 模式
git diff --color-words
```

## 与其他工具对比

| 特性 | Delta | Diff-so-fancy | Difftastic |
|------|-------|----------------|------------|
| 语法高亮 | ✅ | ✅ | ✅ |
| 行号显示 | ✅ | ❌ | ✅ |
| 并排显示 | ✅ | ❌ | ✅ |
| 智能 Hunk 头 | ✅ | ❌ | ✅ |
| 性能 | 快 | 慢 | 非常快 |
| 活跃维护 | ✅ | 中等 | ✅ |
| 配置复杂度 | 低 | 中等 | 中等 |

## 总结

Delta 是一个功能强大且配置灵活的 Git diff 查看工具，特别适合：
- 需要频繁审查代码变化的开发者
- 使用宽屏显示器的环境
- 对代码可读性有高要求的团队

通过合理配置，可以显著提升代码审查的效率和体验。

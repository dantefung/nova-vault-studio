# Zoxide 完整指南：常用命令与最佳实践

zoxide 是一个更聪明的 `cd` 命令替代品，能够根据你的访问频率和时间自动记忆常用目录。

---

## 📦 安装

### Linux/macOS

```bash
# 使用包管理器
sudo apt install zoxide        # Debian/Ubuntu
brew install zoxide            # macOS
pacman -S zoxide              # ArchLinux

# 或者直接用 curl
curl -sS https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | bash
```

### Shell 初始化

根据你的 Shell 类型选择：

**Zsh（推荐）**
```bash
# 方式一：使用 z 命令（推荐新手）
eval "$(zoxide init zsh)"

# 方式二：用增强的 cd 代替（推荐开发者）
eval "$(zoxide init zsh --cmd cd)"
```

**Bash**
```bash
eval "$(zoxide init bash)"
eval "$(zoxide init bash --cmd cd)"
```

**Fish**
```bash
zoxide init fish | source
zoxide init fish --cmd cd | source
```

### 推荐配置

在 `~/.zshrc` 或 `~/.bashrc` 末尾添加：

```bash
# 最佳实践：使用 cd 增强模式
eval "$(zoxide init zsh --cmd cd)"
```

然后重新加载：
```bash
source ~/.zshrc
```

---

## 🎯 核心命令

### 1. `cd` - 智能跳转（增强后）

```bash
# 基本跳转（完全路径）
cd /path/to/directory

# 模糊搜索（部分路径）
cd proj                    # 跳转到最常访问的包含 "proj" 的目录

# 最常访问的目录
cd                         # 跳转到主目录

# 向后退出
cd -                       # 跳转到上一个目录
```

### 2. `z` - 直接跳转（使用 z 命令时）

仅在未使用 `--cmd cd` 时可用：

```bash
z directory                # 跳转到包含 directory 的最常访问目录
z proj docs               # 支持多个关键词，跳转到最匹配的

z /absolute/path          # 精确路径跳转
z -                       # 跳转到上一个目录
```

### 3. `zi` - 交互式选择

```bash
# 打开 FZF 菜单选择目录
zi
```

**提示**：需要安装 `fzf` 才能使用此功能。

**关于 `zi` 和 `cdi` 的区别**：

- **`zi`** 是 zoxide 的**内置命令**，无需任何配置即可使用
- **`cdi`** 是可选的**自定义别名**（`alias cdi='zi'`），两者在功能上完全等价

在配置了 `eval "$(zoxide init zsh --cmd cd)"` 后，建议**直接使用 `zi`** 而不是配置 `cdi` 别名，理由如下：

1. **`zi` 已经够简洁**：仅 2 个字符
2. **无需额外配置**：开箱即用
3. **更易记忆和共享**：zoxide 官方标准命令

如果想要更快速的访问，优先考虑**快捷键绑定**而不是别名：
```bash
bindkey '^z' zi  # 按 Ctrl+Z 打开交互式菜单
```

---

## 🔧 高级用法

### 与其他工具集成

#### 配合 FZF 增强交互

```bash
# 在 ~/.zshrc 中添加
eval "$(zoxide init zsh --cmd cd)"

# 可选：使用 fzf-tab 增强补全
source /usr/share/fzf/completion.zsh
```

#### 查看访问历史

```bash
# 显示所有记录的目录和访问频率
zoxide query --list
zoxide query --list | head -20   # 显示前 20 条

# 显示按时间排序的目录
zoxide query --list -i
```

#### 删除不需要的记录

```bash
# 删除特定目录
zoxide remove /path/to/remove

# 交互式删除
zoxide remove --interactive
```

#### 查看特定目录的信息

```bash
zoxide query /path/to/directory
```

---

## 📊 常用命令速查表

| 命令 | 说明 | 示例 |
|------|------|------|
| `cd <path>` | 跳转到目录 | `cd project` |
| `cd -` | 返回上一目录 | `cd -` |
| `cd` | 返回主目录 | `cd` |
| `zi` | 交互式选择目录 | `zi` |
| `zoxide query --list` | 查看所有记录目录 | `zoxide query --list` |
| `zoxide remove <path>` | 删除记录 | `zoxide remove ~/old-project` |
| `zoxide remove --interactive` | 交互式删除 | `zoxide remove -i` |
| `zoxide import --from autojump <file>` | 从 autojump 导入 | - |

---

## ✨ 最佳实践

### 1. 使用增强的 `cd` 模式

```bash
# ✅ 推荐
eval "$(zoxide init zsh --cmd cd)"

# ❌ 不推荐（需要记住 z 命令）
eval "$(zoxide init zsh)"
```

**优势**：不需要额外学习 `z` 命令，自然的工作流。

### 2. 启用 FZF 补全

```bash
# ~/.zshrc
eval "$(zoxide init zsh --cmd cd)"

# 安装 fzf
sudo apt install fzf  # Ubuntu/Debian

# 启用 fzf 自动补全
source /usr/share/doc/fzf/examples/completion.zsh
```

### 3. 组合快捷键使用

```bash
# Ctrl+Z 打开交互式目录选择
# 在 ~/.zshrc 中添加：
bindkey '^z' zi

# 然后使用 Ctrl+Z 快速打开菜单
```

### 4. 与其他 Shell 工具组合

```bash
# 配合 tmux 快速切换工作区
z project && tmux new-session -s dev

# 配合 git 查看某个仓库
cd {repo} && git log --oneline -10
```

### 5. 定期清理陈旧记录

```bash
# 查看全部记录
zoxide query --list | sort -t, -k2 -n

# 删除不存在的目录记录
zoxide remove --interactive

# 一次性清理所有无效目录
for dir in $(zoxide query --list | cut -d, -f1); do
  [ ! -d "$dir" ] && zoxide remove "$dir"
done
```

### 6. 导入其他工具的历史

如果从其他工具迁移：

```bash
# 从 autojump 导入
zoxide import --from autojump ~/.local/share/autojump/autojump.txt

# 从 z.lua 导入
zoxide import --from z.lua ~/.local/share/z.lua/.z
```

---

## 🐛 常见问题

### 问题 1：复制命令时报错

**症状**：`eval "$(zoxide init zsh)"` 报语法错误

**原因**：从网页复制包含了特殊空格字符（非 ASCII 0x20）

**解决**：
```bash
# 使用 echo 命令正确添加
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 问题 2：命令不生效

**检查**：
```bash
# 验证是否正确初始化
echo $PATH | grep zoxide

# 检查 shell 配置是否正确加载
cat ~/.zshrc | grep zoxide

# 重新加载 shell
exec zsh
```

### 问题 3：记录不准确

**原因**：磁盘满、权限问题或数据文件损坏

**解决**：
```bash
# 查看数据库位置
ls -la ~/.local/share/zoxide/

# 备份后重置
cp ~/.local/share/zoxide/db.zo ~/.local/share/zoxide/db.zo.bak
zoxide remove --interactive

# 重新开始记录
cd /frequently/visited/dirs
```

### 问题 4：性能问题

**优化**：
```bash
# 定期清理无效目录
zoxide query --list | wc -l  # 查看记录数

# 删除很久未访问的目录
# zoxide 会自动过期老记录，无需手动处理
```

---

## 🚀 高级配置示例

### 完整的 ~/.zshrc 配置

```bash
# ============ Zoxide 配置 ============
eval "$(zoxide init zsh --cmd cd)"

# 可选：使用 fzf-tab 进一步增强
if command -v fzf &> /dev/null; then
    source /usr/share/doc/fzf/examples/completion.zsh
    source /usr/share/doc/fzf/examples/key-bindings.zsh
fi

# 快捷键绑定
bindkey '^z' zi  # Ctrl+Z 打开交互式菜单

# 别名优化（可选，不推荐）
# alias cdi='zi'  # 注：zi 已经足够简洁，无需额外别名
```

### 与 Vim 集成

```bash
# 在 ~/.zshrc 中
eval "$(zoxide init zsh --cmd cd)"

# 创建函数快速打开项目
vp() {
    local proj=$(zoxide query --list | fzf)
    [ -n "$proj" ] && vim "$proj"
}

# 对应快捷键
bindkey '^v' vp
```

### 日志跟踪

```bash
# 查看最近访问的目录
zoxide query --list | head -10

# 导出为 CSV 分析
zoxide query --list > ~/z-dirs.csv

# 统计访问频率最高的 5 个目录
zoxide query --list | sort -t',' -k2 -rn | head -5
```

---

## 📚 更多资源

- **官方仓库**：https://github.com/ajeetdsouza/zoxide
- **官方手册**：`man zoxide`
- **相关工具**：
  - [FZF](fzf-tab.md)：模糊查找
  - [Zsh](zsh.md)：强大的 Shell
  - [Tmux](tmux-guide.md)：终端复用器

---

## 🎓 总结

| 功能 | 命令 | 场景 |
|------|------|------|
| 快速跳转 | `cd keyword` | 日常导航 |
| 交互选择 | `zi` | 不确定目录时 |
| 查看历史 | `zoxide query --list` | 管理记录 |
| 删除记录 | `zoxide remove path` | 清理过期目录 |
| 进阶配置 | 见本文高级部分 | 个性化工作流 |

**推荐新手配置**：
```bash
eval "$(zoxide init zsh --cmd cd)"
```

**推荐开发者配置**：
```bash
eval "$(zoxide init zsh --cmd cd)"
source /usr/share/doc/fzf/examples/completion.zsh
bindkey '^z' zi
```

开始使用，享受高效的目录导航！🚀

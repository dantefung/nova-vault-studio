# Lazygit 完整指南：最佳实践与高效工作流

Lazygit 是一个用 Go 编写的终端 Git 客户端，提供了简洁直观的 UI，让你无需记住复杂的 Git 命令，就能高效地进行版本控制操作。

---

## 📦 安装

### Linux/macOS

```bash
# 使用包管理器
sudo apt install lazygit           # Ubuntu/Debian
brew install lazygit              # macOS
pacman -S lazygit                # ArchLinux
yay -S lazygit                   # ArchLinux (AUR)

# 或者使用 Homebrew
brew install jesseduffield/lazygit/lazygit
```

### Windows

```bash
choco install lazygit             # Chocolatey
scoop install lazygit             # Scoop
winget install jesseduffield.lazygit  # Windows Package Manager
```

### 验证安装

```bash
lazygit --version
```

---

## 🚀 基本使用

### 启动 Lazygit

```bash
# 在当前 Git 仓库启动
lazygit

# 在特定目录启动
lazygit -p /path/to/repo

# 快捷方式（建议添加到 shell 配置）
alias lg='lazygit'
```

### 核心导航快捷键

| 快捷键 | 功能 | 场景 |
|-------|------|------|
| `Tab` / `Shift+Tab` | 切换面板 | 在不同视图间导航 |
| `↑↓←→` | 移动光标 | 选择操作目标 |
| `Enter` | 确认/打开 | 执行操作 |
| `Esc` | 关闭/返回 | 退出当前视图 |
| `q` | 退出 | 离开 lazygit |
| `?` | 帮助 | 查看完整快捷键列表 |

---

## 📋 核心面板详解

### 1. **文件状态面板** (左上)

```
Unstaged Changes (未保存的变更)
├── modified: file.js
├── modified: config.json
└── untracked: new-feature.md

Staged Changes (已暂存的变更)
├── modified: main.js
└── added: utils.js
```

**常用操作**：
- `space` - 暂存/取消暂存文件
- `a` - 暂存所有变更
- `d` - 查看 diff
- `e` - 使用编辑器编辑文件

### 2. **分支面板** (左下)

```
Branches
├── * main
├── feature/auth
├── hotfix/bug-123
└── develop
```

**常用操作**：
- `n` - 新建分支
- `Space` - 切换分支
- `d` - 删除分支
- `r` - 重命名分支
- `m` - 合并分支

### 3. **提交历史面板** (右上)

```
Commits
├── Fix: 解决登录问题 (HEAD -> main)
├── Feat: 添加用户认证
├── Refactor: 代码重构
└── Docs: 更新 README
```

**常用操作**：
- `g` - 重置（hard/soft/mixed）
- `r` - 变基（rebase）
- `R` - 重新排序提交
- `c` - 复制提交信息

### 4. **提交详情面板** (右下)

显示选中提交的完整 diff 和变更信息。

---

## ✨ 最佳实践

### 1. 原子提交（Atomic Commits）

**原则**：每个提交应该表示一个完整的逻辑单元

```
✅ 推荐
- Feat: 添加用户认证
- Fix: 解决密码验证 bug
- Refactor: 优化数据库查询

❌ 避免
- 修复各种东西
- 更新代码
- 大量混合变更
```

**Lazygit 实践**：
```
1. 使用 Patch Mode (Ctrl+Shift+P) 逐行暂存
2. 只暂存相关的变更
3. 为每个逻辑单元创建独立提交
```

### 2. 提交信息规范

遵循 **Conventional Commits** 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型标准**：
```
feat:     新功能
fix:      bug 修复
docs:     文档变更
style:    代码格式（不影响功能）
refactor: 代码重构
perf:     性能优化
test:     测试相关
chore:    构建/依赖配置
```

**示例**：
```
✅ 好
feat(auth): 添加 JWT 认证机制

实现用户登录和令牌刷新功能
- 添加 JWT 生成逻辑
- 实现令牌验证中间件
- 添加单元测试

Fixes #123

❌ 差
fix something
update code
修复 bug
```

**Lazygit 技巧**：
- `c` 打开提交编辑框
- 使用编辑器写清晰的提交信息
- 配置模板自动填充格式

### 3. 高效的分支策略

**推荐工作流**：

```
main (生产分支)
  ↑
develop (开发分支)
  ↑
feature/new-feature (特性分支)
feature/bug-fix (修复分支)
```

**Lazygit 实践**：
```bash
# 1. 从 develop 创建特性分支
# 在 Branches 面板按 n，输入分支名

# 2. 定期从 develop 更新
# 选中 develop，按 r（rebase）

# 3. 完成后创建 Pull Request
# 或者用 Lazygit 直接合并
```

### 4. Rebase vs Merge

| 操作 | 优点 | 场景 |
|------|------|------|
| **Merge** | 保留历史记录，安全 | 长期分支、协作开发 |
| **Rebase** | 历史线性，整洁 | 特性分支、本地工作 |
| **Squash** | 合并多个提交 | 清理提交历史 |

**Lazygit 使用**：
```
1. 右上提交历史面板
2. 按 r 打开 rebase 菜单
3. 选择 rebase 目标分支
```

### 5. 情景式操作

#### 修改最后一个提交

```
场景: 忘记添加文件或提交信息有误

操作:
1. 添加遗漏的文件到暂存区
2. 在 Commits 面板选中 HEAD 提交
3. 按 A (amend commit)
4. 确认修改
```

#### 撤销提交

```
场景: 需要撤销已提交的更改

操作:
1. 在 Commits 面板选中提交
2. 按 g → soft
   - soft: 保留文件，回到暂存状态
   - mixed: 保留文件，回到未暂存状态
   - hard: 完全撤销（危险！）
```

#### 挑选提交 (Cherry-pick)

```
场景: 将其他分支的特定提交应用到当前分支

操作:
1. 切换到源分支
2. 选中目标提交，按 c (copy)
3. 切换到目标分支
4. 按 v (paste/cherry-pick)
```

#### 交互式变基

```
场景: 重新组织提交历史

操作:
1. 右上提交面板选中基础提交
2. 按 r (rebase)
3. 选择"Interactive rebase"
4. 对提交进行操作:
   - p: pick (保留)
   - r: reword (编辑提交信息)
   - s: squash (合并到前一个)
   - f: fixup (合并且丢弃信息)
   - d: drop (删除)
```

### 6. 冲突解决

**Lazygit 处理合并冲突**：

```
1. 执行 merge/rebase
2. 遇到冲突时，选择文件
3. 按 e 用编辑器编辑
4. 解决冲突标记
5. 暂存解决后的文件
6. 继续 merge/rebase
```

**标记格式**：
```
<<<<<<< HEAD
你的更改
=======
他人的更改
>>>>>>> branch-name
```

### 7. Stash 管理

**场景**：临时保存未完成的工作

```
操作:
1. 点击 Stash 面板
2. 按 s 创建 stash
3. 添加描述信息
4. 后续按 p 应用或 d 删除
```

---

## 🔧 配置最佳实践

### 标准配置文件位置

- Linux/macOS: `~/.config/lazygit/config.yml`
- Windows: `%APPDATA%\lazygit\config.yml`

### 推荐配置

```yaml
# ~/.config/lazygit/config.yml

gui:
  # 线条风格
  border: rounded
  # 滚动速度
  scrollHeight: 5
  # 显示委托人
  showFileTree: true
  # 显示行号
  showBottomLine: true
  # 显示命令日志
  showCommandLog: true
  # 时间格式
  timeFormat: '15:04:05'

git:
  # 自动获取
  autoFetch: true
  # 自动刷新
  autoRefresh: true
  # 推送标签
  pushTags: true

os:
  # 外部编辑器
  editCommand: 'code'  # 或 vim, nano 等
  editCommandTemplate: '{{editor}} {{filename}}'

# 自定义快捷键
keybinding:
  universal:
    quit: 'q'
    redo: '<c-z>'
    filteringMenu:
      confirm: '<enter>'
      exit: '<esc>'
```

### 集成编辑器

```yaml
os:
  # VS Code
  editCommand: 'code'
  
  # Vim
  editCommand: 'vim'
  
  # Neovim
  editCommand: 'nvim'
  
  # Nano
  editCommand: 'nano'
```

---

## 📊 常用工作流示例

### 工作流 1: 功能开发

```
1. 启动: lg
2. 从 develop 创建分支: n → feature/user-api
3. 进行开发，定期提交:
   - 修改文件
   - Space 暂存相关变更
   - c 创建原子提交
4. 完成后推送: P (push)
5. 创建 PR 或合并: m (merge to develop)
```

### 工作流 2: 紧急修复 (Hotfix)

```
1. 从 main 创建分支: n → hotfix/critical-bug
2. 快速修复并提交: c
3. 推送: P
4. 合并到 main: m
5. 同步回 develop
```

### 工作流 3: 清理提交历史

```
1. 右上选中需要清理的基础提交
2. r → interactive rebase
3. 使用 squash/fixup 合并相关提交
4. reword 改进提交信息
5. 确认完成
```

### 工作流 4: 恢复误操作

```
场景: 不小心删除了提交或分支

操作:
1. 在 Commits 面板查看历史
2. 找到需要的提交
3. 创建新分支指向它
4. 或者使用 git reflog
```

---

## 🛠️ 高级技巧

### 使用 Patch Mode (Ctrl+Shift+P)

逐行选择暂存文件的特定部分：

```
用途: 将相关变更分离到不同提交

示例:
-  console.log('debug');  ← 删除此行
   function process() {   ← 保留此行
     return data;
   }
```

### 快速搜索

按 `/` 搜索提交信息或文件名

### 预览 Diff

- `d` 查看完整 diff
- `Space` 在 Staging/Unstaging 前预览

### 快速复制提交 SHA

在提交上按 `y` 复制 SHA 到剪贴板

---

## 📚 常见问题

### Q1: 如何撤销 push？

```
❌ 不要强制推送到共享分支！

✅ 推荐做法:
1. 创建新提交来撤销更改
2. 或者与团队沟通回滚
3. 如果必须，使用 force push (小心!)
```

### Q2: Merge 冲突后如何恢复？

```
1. 按 q 退出 lazygit
2. 运行: git merge --abort
3. 重新启动 lg 尝试其他方法
```

### Q3: 如何同步远程变更？

```
操作:
1. 在 Branches 面板选择 main/develop
2. 按 u (pull)
3. 或在文件面板按 P (pull)
```

### Q4: 如何处理大量未跟踪文件？

```
1. 创建 .gitignore
2. 在文件面板选中文件
3. 按 i 添加到 .gitignore
4. 或按 d 丢弃
```

---

## 🚀 生产力建议

### 建议 1: 配合命令行使用

```bash
# Lazygit 和命令行互补
lg          # UI 操作
git log --oneline   # 查看历史
git reflog          # 找回丢失的提交
```

### 建议 2: 定期学习快捷键

```
- Week 1: 基本操作 (commit, branch, merge)
- Week 2: 高级操作 (rebase, cherry-pick)
- Week 3: 优化工作流 (stash, patch mode)
```

### 建议 3: 建立个人规范

```yaml
提交流程:
1. 修改代码
2. Patch mode 选择性暂存 (Ctrl+Shift+P)
3. 撰写规范的提交信息 (conventional commits)
4. 推送前检查 (git log 查看历史)
5. 创建 PR 前 rebase 保持线性历史
```

### 建议 4: 整合开发环境

```bash
# ~/.zshrc 或 ~/.bashrc
alias lg='lazygit'
alias gst='git status'
alias glog='git log --oneline'

# 快速启动组合
function dev() {
    cd "$1"
    lazygit
}
```

---

## 📚 参考资源

- **官方仓库**：https://github.com/jesseduffield/lazygit
- **完整快捷键**：在 Lazygit 内按 `?`
- **配置文档**：https://github.com/jesseduffield/lazygit/wiki/Config
- **相关工具**：
  - [Zoxide](zoxide-guide.md) - 目录导航
  - [FZF](fzf-tab.md) - 模糊查找
  - [Tmux](tmux-guide.md) - 终端复用

---

## 🎓 总结

| 功能 | 快捷键 | 场景 |
|------|-------|------|
| 暂存/取消 | `Space` | 选择性提交 |
| 查看 Diff | `d` | 审查变更 |
| 创建分支 | `n` | 开始功能开发 |
| 合并分支 | `m` | 集成功能 |
| 变基提交 | `r` | 清理历史 |
| 编辑提交 | `c` | 修改提交信息 |
| 樱桃采摘 | `c` → `v` | 复制特定提交 |
| 推送/拉取 | `P` / `u` | 同步远程 |

## 快速开始

**今天就开始使用**：
```bash
# 1. 安装
brew install lazygit  # 或其他包管理器

# 2. 启动
cd /path/to/repo
lazygit

# 3. 尝试基本操作
# - Space 暂存文件
# - c 创建提交
# - n 创建分支

# 持续学习，逐步掌握高级技巧！
```

Enjoy your Git workflow! 🎉


# zoxide 增强 cd 命令

---

# 📌 正确的 zoxide 初始化流程

1. 安装 zoxide

```bash
sudo apt install zoxide
```

2. 在 `~/.zshrc` 最后添加

```bash
eval "$(zoxide init zsh)"
```

3. 重新加载

```bash
source ~/.zshrc
```

4. 测试

```bash
z ~
```

---

# 🚀 额外优化（你是重度终端用户）

我建议你这样配置（更适合开发者）：

```bash
eval "$(zoxide init zsh --cmd cd)"
```

这样 `cd` 会自动增强，不需要记 `z`。

---

## issues

**问题描述：** 有时候直接拷贝文章的配置命令会报错，是由于复制的内容包含了非标准的空格！

这 **不是 zoxide 本身问题**，而是你这条命令里混入了“非法空格字符”（通常是从网页复制导致的 NBSP 全角空格）。

你现在这条命令是：

```bash
eval "$(zoxide init zsh)"
     ↑ 这里不是普通空格
```

那个空格不是 ASCII 0x20，而是 `U+00A0` 不间断空格。

---

# ✅ 正确写法（重新手打）

请手动重新输入，不要复制：

```bash
eval "$(zoxide init zsh)"
```

⚠️ 一定自己敲空格。

---

# ✅ 正确安装方式（推荐）

把它写入 `~/.zshrc` 最后一行：

```bash
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc
```

然后：

```bash
source ~/.zshrc
```

---

# 🔎 如果你想确认是不是空格问题

可以用：

```bash
cat -A <<< 'eval "$(zoxide init zsh)"'
```

如果你看到：

```
evalM-BM-  "$(zoxide init zsh)"
```

说明就是非标准空格。
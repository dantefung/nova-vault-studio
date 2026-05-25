---
title: "科技考古：为什么快捷键里的 <M-m> 表示 Alt + m？"
date: "2026-05-22"
source: "原创"
url: ""
---

# 科技考古：为什么快捷键里的 `<M-m>` 表示 Alt + m？

> 在 tmux、Emacs、Vim 等工具的快捷键文档里，`<M-m>` 表示 Alt + m。这个 M 到底是什么意思？

---

## M 是 Meta 的缩写

`<M-m>` = **Meta + m**。

在 1970 年代的 MIT 和斯坦福实验室里，工程师使用被称为「太空学员键盘」（Space Cadet Keyboard）的 Lisp Machine 键盘。它有 7 个修饰键：

![Space Cadet Keyboard](https://upload.wikimedia.org/wikipedia/commons/4/47/Space-cadet.jpg)

| 键名 | 缩写 | 现代映射 |
|------|------|---------|
| Control | C | Ctrl |
| Meta | M | Alt / Option |
| Super | S | Win / Command |
| Hyper | H | 几乎不存在 |

---

## 为什么叫 Meta？

"Meta" 的含义是「超越」或「之上」——按下 Meta 键的组合被设计为触发**更高层级的功能**，不是输入普通字符，而是对编辑器、终端、操作系统发出一条指令。

可以理解为：普通按键产生的是字符，Meta 组合键产生的是**元指令**。

---

## 现代键盘去哪了？

现代键盘没有 Meta 键了。终端模拟器和桌面环境做了映射：

| 环境 | Meta 映射到 |
|------|------------|
| Linux 终端 | Alt |
| macOS 终端 | Option |
| Emacs GUI | Alt 或 Esc 前缀 |

所以当你按下 Alt + m，终端模拟器发送的是 Meta + m 的转义序列。

---

## 其他考古级修饰键

| 符号 | 全称 | 现代映射 | 还会出现在哪里 |
|------|------|---------|---------------|
| `<C-*>` | Control | Ctrl | 几乎无处不在 |
| `<M-*>` | Meta | Alt / Option | tmux、Emacs、Vim、Readline |
| `<S-*>` | Shift | Shift | 大写字母（隐含）|
| `<H-*>` | Hyper | 无 | Emacs 老用户可能会设置映射 |

---

## 实际应用

**tmux 配置**：

```bash
# 前缀键 + Alt+h 切换到左窗格
bind -n M-h select-pane -L

# 前缀键 + Alt+l 切换到右窗格
bind -n M-l select-pane -R
```

**Readline（bash 输入行）**：

```bash
# Alt+f 前进一个单词
"\M-f": forward-word

# Alt+b 后退一个单词
"\M-b": backward-word
```

**Vim 映射**：

```vim
" Alt+j/k 移动整行
nnoremap <M-j> :m .+1<CR>==
nnoremap <M-k> :m .-2<CR>==
```

---

## 总结

`<M-m>` 里的 **M** 是 Meta 键的缩写，这个名称可以追溯到 50 年前的 Lisp Machine 键盘。今天物理 Meta 键已经消失了，但约定留了下来——Alt（Linux）和 Option（macOS）继承了它的位置和语义。

这就是键盘快捷键里的「活化石」。

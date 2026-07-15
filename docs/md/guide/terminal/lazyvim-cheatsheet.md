---
title: "LazyVim 快捷键大全"
date: "2026-07-14"
source: "GitHub"
url: "https://github.com/2025Emma/vibe-coding-cn/blob/main/i18n/zh/documents/Tutorials%20and%20Guides/LazyVim%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A4%A7%E5%85%A8.md"
tags: ["neovim", "lazyvim", "keymap", "cheatsheet"]
---

# LazyVim 快捷键大全

> LazyVim 常用快捷键速查表，按功能分类整理。共 15 个章节，覆盖 150+ 个常用快捷键。

<!-- more -->
## 通用操作

| 快捷键 | 功能 |
|--------|------|
| `&lt;Space&gt;` 等1秒 | 显示快捷键菜单 |
| `&lt;Space&gt;sk` | 搜索所有快捷键 |
| `u` | 撤销 |
| `Ctrl+r` | 重做 |
| `.` | 重复上次操作 |
| `Esc` | 退出插入模式/取消 |

## 文件操作

| 快捷键 | 功能 |
|--------|------|
| `&lt;Space&gt;ff` | 搜索文件 |
| `&lt;Space&gt;fr` | 最近打开的文件 |
| `&lt;Space&gt;fn` | 新建文件 |
| `&lt;Space&gt;fs` | 保存文件 |
| `&lt;Space&gt;fS` | 另存为 |
| `&lt;Space&gt;e` | 打开/关闭侧边栏 |
| `&lt;Space&gt;E` | 侧边栏定位当前文件 |

## 搜索

| 快捷键 | 功能 |
|--------|------|
| `&lt;Space&gt;sg` | 全局搜索文本 (grep) |
| `&lt;Space&gt;sw` | 搜索光标下的词 |
| `&lt;Space&gt;sb` | 当前 buffer 搜索 |
| `&lt;Space&gt;ss` | 搜索符号 |
| `&lt;Space&gt;sS` | 工作区搜索符号 |
| `&lt;Space&gt;sh` | 搜索帮助文档 |
| `&lt;Space&gt;sm` | 搜索标记 |
| `&lt;Space&gt;sr` | 搜索替换 |
| `/` | 当前文件搜索 |
| `n` | 下一个搜索结果 |
| `N` | 上一个搜索结果 |
| `*` | 搜索光标下的词 |

## Buffer（标签页）

| 快捷键 | 功能 |
|--------|------|
| `Shift+h` | 上一个 buffer |
| `Shift+l` | 下一个 buffer |
| `&lt;Space&gt;bb` | 切换到其他 buffer |
| `&lt;Space&gt;bd` | 关闭当前 buffer |
| `&lt;Space&gt;bD` | 强制关闭 buffer |
| `&lt;Space&gt;bo` | 关闭其他 buffer |
| `&lt;Space&gt;bp` | 固定 buffer |
| `&lt;Space&gt;bl` | 删除左侧 buffer |
| `&lt;Space&gt;br` | 删除右侧 buffer |
| `[b` | 上一个 buffer |
| `]b` | 下一个 buffer |

## 窗口/分屏

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+h` | 移动到左边窗口 |
| `Ctrl+j` | 移动到下边窗口 |
| `Ctrl+k` | 移动到上边窗口 |
| `Ctrl+l` | 移动到右边窗口 |
| `&lt;Space&gt;-` | 水平分屏 |
| `&lt;Space&gt;wd` | 关闭当前窗口 |
| `&lt;Space&gt;ww` | 切换窗口 |
| `&lt;Space&gt;wo` | 关闭其他窗口 |
| `Ctrl+Up` | 增加窗口高度 |
| `Ctrl+Down` | 减少窗口高度 |
| `Ctrl+Left` | 减少窗口宽度 |
| `Ctrl+Right` | 增加窗口宽度 |

## 终端

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+/` | 浮动终端 |
| `&lt;Space&gt;ft` | 浮动终端 |
| `&lt;Space&gt;fT` | 当前目录终端 |
| `Ctrl+\` | 退出终端模式 |

## 代码导航

| 快捷键 | 功能 |
|--------|------|
| `gd` | 跳转到定义 |
| `gD` | 跳转到声明 |
| `gr` | 查看引用 |
| `gI` | 跳转到实现 |
| `gy` | 跳转到类型定义 |
| `K` | 查看文档悬浮窗 |
| `gK` | 签名帮助 |
| `Ctrl+k` | 插入模式签名帮助 |
| `]d` | 下一个诊断 |
| `[d` | 上一个诊断 |
| `]e` | 下一个错误 |
| `[e` | 上一个错误 |
| `]w` | 下一个警告 |
| `[w` | 上一个警告 |

## 代码操作

| 快捷键 | 功能 |
|--------|------|
| `&lt;Space&gt;ca` | 代码操作 |
| `&lt;Space&gt;cA` | 源代码操作 |
| `&lt;Space&gt;cr` | 重命名 |
| `&lt;Space&gt;cf` | 格式化文件 |
| `&lt;Space&gt;cd` | 行诊断信息 |
| `&lt;Space&gt;cl` | LSP 信息 |
| `&lt;Space&gt;cm` | Mason (管理 LSP) |

## 注释

| 快捷键 | 功能 |
|--------|------|
| `gcc` | 注释/取消注释当前行 |
| `gc` | 注释选中区域 |
| `gco` | 下方添加注释 |
| `gcO` | 上方添加注释 |
| `gcA` | 行尾添加注释 |

## Git

| 快捷键 | 功能 |
|--------|------|
| `&lt;Space&gt;gg` | 打开 lazygit |
| `&lt;Space&gt;gG` | 当前目录 lazygit |
| `&lt;Space&gt;gf` | git 文件列表 |
| `&lt;Space&gt;gc` | git 提交记录 |
| `&lt;Space&gt;gs` | git 状态 |
| `&lt;Space&gt;gb` | git blame 当前行 |
| `&lt;Space&gt;gB` | 浏览器打开仓库 |
| `]h` | 下一个 git 修改块 |
| `[h` | 上一个 git 修改块 |
| `&lt;Space&gt;ghp` | 预览修改块 |
| `&lt;Space&gt;ghs` | 暂存修改块 |
| `&lt;Space&gt;ghr` | 重置修改块 |
| `&lt;Space&gt;ghS` | 暂存整个文件 |
| `&lt;Space&gt;ghR` | 重置整个文件 |
| `&lt;Space&gt;ghd` | diff 当前文件 |

## 选择/编辑

| 快捷键 | 功能 |
|--------|------|
| `v` | 进入可视模式 |
| `V` | 行选择模式 |
| `Ctrl+v` | 块选择模式 |
| `y` | 复制 |
| `d` | 删除/剪切 |
| `p` | 粘贴 |
| `P` | 在前面粘贴 |
| `c` | 修改 |
| `x` | 删除字符 |
| `r` | 替换字符 |
| `~` | 切换大小写 |
| `&gt;&gt;` | 增加缩进 |
| `&lt;&lt;` | 减少缩进 |
| `=` | 自动缩进 |
| `J` | 合并行 |

## 移动

| 快捷键 | 功能 |
|--------|------|
| `h/j/k/l` | 左/下/上/右 |
| `w` | 下一个词首 |
| `b` | 上一个词首 |
| `e` | 下一个词尾 |
| `0` | 行首 |
| `$` | 行尾 |
| `^` | 行首非空字符 |
| `gg` | 文件开头 |
| `G` | 文件末尾 |
| `{` | 上一个段落 |
| `}` | 下一个段落 |
| `%` | 匹配括号跳转 |
| `Ctrl+d` | 向下半页 |
| `Ctrl+u` | 向上半页 |
| `Ctrl+f` | 向下一页 |
| `Ctrl+b` | 向上一页 |
| `zz` | 当前行居中 |
| `zt` | 当前行置顶 |
| `zb` | 当前行置底 |
| `数字+G` | 跳转到指定行 |

## 折叠

| 快捷键 | 功能 |
|--------|------|
| `za` | 切换折叠 |
| `zA` | 递归切换折叠 |
| `zo` | 打开折叠 |
| `zc` | 关闭折叠 |
| `zR` | 打开所有折叠 |
| `zM` | 关闭所有折叠 |

## UI

| 快捷键 | 功能 |
|--------|------|
| `&lt;Space&gt;uf` | 切换格式化 |
| `&lt;Space&gt;us` | 切换拼写检查 |
| `&lt;Space&gt;uw` | 切换自动换行 |
| `&lt;Space&gt;ul` | 切换行号 |
| `&lt;Space&gt;uL` | 切换相对行号 |
| `&lt;Space&gt;ud` | 切换诊断 |
| `&lt;Space&gt;uc` | 切换隐藏字符 |
| `&lt;Space&gt;uh` | 切换高亮 |
| `&lt;Space&gt;un` | 关闭通知 |

## 退出

| 快捷键 | 功能 |
|--------|------|
| `&lt;Space&gt;qq` | 退出全部 |
| `&lt;Space&gt;qQ` | 强制退出全部 |
| `:w` | 保存 |
| `:q` | 退出 |
| `:wq` | 保存并退出 |
| `:q!` | 强制退出不保存 |

---

## 相关文章

- [lazyvim-architecture.md](./lazyvim-architecture.md) — LazyVim 庖丁解牛（静态构成 + 动态启动链路）
- [lazyvim-keymap-config.md](./lazyvim-keymap-config.md) — 自定义 keymaps.lua 完整配置
- [lazyvim-lsp-keymaps.md](./lazyvim-lsp-keymaps.md) — LSP 快捷键总览
- [tmux 快捷键大全](./tmux-cheatsheet.md) — tmux 常用快捷键速查表
- [tmux 完整指南](./tmux-guide.md) — 从概念到进阶使用的完整教程
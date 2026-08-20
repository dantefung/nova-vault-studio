---
title: "LazyVim 全插件 Keymaps 完整速查（Deep Router 版）"
date: "2026-07-14"
source: "https://deeprouter.org/article/lazyvim-mappings"
tags: ["neovim", "lazyvim", "keymap", "cheatsheet", "all-plugins"]
---

# LazyVim 全插件 Keymaps 完整速查（Deep Router 版）

> **核心结论**：LazyVim 默认安装的所有插件 + 可启用 Extra 时一并加载的快捷键全集。共 **52 个章节**，**420 条快捷键**。是仓库内最完整的 LazyVim 快捷键参考（比精简速查更全，但描述没有官方版那么精炼）。

> **模式说明**：`n`=Normal、`i`=Insert、`v`=Visual、`x`=Visual-X、`o`=Operator-pending、`t`=Terminal、`s`=Select。多模式逗号分隔。

<!-- more -->

## 为何还需要这份

- [[../lazyvim-cheatsheet.md]]（官方速查）：150 条精选，最常用
- 本表：420 条全集，含每个插件的所有键位（含 CopilotChat、yanky、grug-far 等不常用但已装的插件）
- [[./lazyvim-architecture.md]]（庖丁解牛）：理解 LazyVim 是如何拼装这些插件的

## 关于翻译

> 原文：[deeprouter.org/article/lazyvim-mappings](https://deeprouter.org/article/lazyvim-mappings)——「正在翻译的 LazyVim 快捷键页面」

- 来源：Deep Router，正在翻译，部分中文描述较机翻
- 更新时间：2025-06-16
- 准确度：高（每条 keymap 对应一个具体插件的具体配置）

---

## 通用

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| ``j`` | 下, | n, x |
```

| ``&lt;Down&gt;`` | 下, | n, x |
```

| ``k`` | 上, | n, x |
```

| ``&lt;Up&gt;`` | 上, | n, x |
| ``&lt;C-h&gt;`` | 跳转至左边窗口, | n, t |
| ``&lt;C-j&gt;`` | 跳转至下边窗口, | n, t |
| ``&lt;C-k&gt;`` | 跳转至上边窗口, | n, t |
| ``&lt;C-l&gt;`` | 跳转至右边窗口, | n, t |
| ``&lt;C-Up&gt;`` | 增加窗口高度 | n |
| ``&lt;C-Down&gt;`` | 降低窗口高度 | n |
| ``&lt;C-Left&gt;`` | 增加窗口宽度 | n |
| ``&lt;C-Right&gt;`` | 降低窗口宽度 | n |
| ``&lt;A-j&gt;`` | 向上,, | n, i, v |
| ``&lt;A-k&gt;`` | 向下,, | n, i, v |
| ``&lt;S-h&gt;`` | 之前的缓冲区 | n |
| ``&lt;S-l&gt;`` | 下一个缓冲区 | n |
```

| ``[b`` | 之前的缓冲区 | n |
| ``]b`` | 下一个缓冲区 | n |
```

| ``&lt;leader&gt;bb`` | 切换至其他缓冲区 | n |
| ``&lt;leader&gt;`` | `切换至其他缓冲区 | n |
| ``&lt;leader&gt;bd`` | 删除缓冲区 | n |
| ``&lt;leader&gt;bD`` | 删除缓冲区并关闭当前窗口 | n |
| ``&lt;esc&gt;`` | 退出搜索模式并清空检索条件, | i, n |
| ``&lt;leader&gt;ur`` | 重绘/清除搜索高亮/更新差异 | n |
```

| ``n`` | 下一个检索结果,, | n, x, o |
| ``N`` | 上一个检索结果,, | n, x, o |
```

| ``&lt;C-s&gt;`` | 保存文件,,, | i, x, n, s |
| ``&lt;leader&gt;K`` | Keywordprg | n |
```

| ``gco`` | 在下方添加注释 | n |
| ``gcO`` | 在上方添加注释 | n |
```

| ``&lt;leader&gt;l`` | Lazy | n |
| ``&lt;leader&gt;fn`` | 新建文件 | n |
| ``&lt;leader&gt;xl`` | 位置列表 | n |
| ``&lt;leader&gt;xq`` | 问题列表 | n |
```

| ``[q`` | 上一个问题 | n |
| ``]q`` | 下一个问题 | n |
```

| ``&lt;leader&gt;cf`` | 格式化, | n, v |
| ``&lt;leader&gt;cd`` | 行诊断 | n |
```

| ``]d`` | 上一个诊断 | n |
| ``[d`` | 下一个诊断 | n |
| ``]e`` | 下一个Error错误 | n |
| ``[e`` | 上一个Error错误 | n |
| ``]w`` | 下一个警告 | n |
| ``[w`` | 上一个警告 | n |
```

| ``&lt;leader&gt;uf`` | 切换自动格式化 (全局) | n |
| ``&lt;leader&gt;uF`` | 切换自动格式化 (缓冲区) | n |
| ``&lt;leader&gt;us`` | 切换拼写检查 | n |
| ``&lt;leader&gt;uw`` | 切换自动换行 | n |
| ``&lt;leader&gt;uL`` | 切换显示相对行号 | n |
| ``&lt;leader&gt;ud`` | 切换诊断信息显示 | n |
| ``&lt;leader&gt;ul`` | 切换行号显示 | n |
| ``&lt;leader&gt;uc`` | 切换隐藏字符显示 | n |
| ``&lt;leader&gt;uT`` | 切换Treesitter的高亮显示 | n |
| ``&lt;leader&gt;ub`` | 切换背景颜色 | n |
| ``&lt;leader&gt;uh`` | 切换嵌入提示 | n |
| ``&lt;leader&gt;gg`` | Lazygit (根目录) | n |
| ``&lt;leader&gt;gG`` | Lazygit (当前工作目录) | n |
| ``&lt;leader&gt;gb`` | Git 责备当前行 | n |
| ``&lt;leader&gt;gB`` | Git浏览器 | n |
| ``&lt;leader&gt;gf`` | Lazygit当前文件的变动记录 | n |
| ``&lt;leader&gt;gl`` | Lazygit日志 | n |
| ``&lt;leader&gt;gL`` | Lazygit日志 (当前工作目录) | n |
| ``&lt;leader&gt;qq`` | 退出所有 | n |
| ``&lt;leader&gt;ui`` | 检查位置信息 | n |
| ``&lt;leader&gt;uI`` | 检查文件树信息 | n |
| ``&lt;leader&gt;L`` | LazyVim的更新日志 | n |
| ``&lt;leader&gt;ft`` | Terminal终端 (根目录) | n |
| ``&lt;leader&gt;fT`` | Terminal (当前工作目录) | n |
| ``&lt;c-/&gt;`` | Terminal终端 (根目录) | n |
| ``&lt;c-_&gt;`` | 忽略 which_key, | n, t |
| ``&lt;esc&gt;&lt;esc&gt;`` | 进入Normal模式 | t |
| ``&lt;C-/&gt;`` | 隐藏终端 | t |
| ``&lt;leader&gt;w`` | 进入窗口模式 | n |
| ``&lt;leader&gt;-`` | 下方分割窗口 | n |
| ``&lt;leader&gt;|`` | 右侧分割窗口 | n |
| ``&lt;leader&gt;wd`` | 关闭窗口 | n |
| ``&lt;leader&gt;wm`` | 最大化 | n |
| ``&lt;leader&gt;&lt;tab&gt;l`` | 最后一个tag | n |
| ``&lt;leader&gt;&lt;tab&gt;o`` | 关闭其他所有tab | n |
| ``&lt;leader&gt;&lt;tab&gt;f`` | 第一个tab | n |
| ``&lt;leader&gt;&lt;tab&gt;&lt;tab&gt;`` | 新建一个tab | n |
| ``&lt;leader&gt;&lt;tab&gt;]`` | 下一个tab | n |
| ``&lt;leader&gt;&lt;tab&gt;d`` | 关闭tab | n |
| ``&lt;leader&gt;&lt;tab&gt;[`` | 上一个tab | n |
```


## LSP

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cl`` | LSP系统信息 | n |
```

| ``gd`` | 跳转到定义 | n |
| ``gr`` | 跳转到引用 | n |
| ``gI`` | 跳转到实现 | n |
| ``gy`` | 跳转到类型定义 | n |
| ``gD`` | 跳转到声明 | n |
| ``K`` | 悬停 | n |
| ``gK`` | 签名帮助 | n |
```

| ``&lt;c-k&gt;`` | 签名帮助 | i |
| ``&lt;leader&gt;ca`` | 代码操作, | n, v |
| ``&lt;leader&gt;cc`` | 运行Codelens, | n, v |
| ``&lt;leader&gt;cC`` | 刷新并显示Codelens | n |
| ``&lt;leader&gt;cR`` | 重命名文件 | n |
| ``&lt;leader&gt;cr`` | 重命名 | n |
| ``&lt;leader&gt;cA`` | 来源操作 | n |
```

| ``]]`` | 下一个引用 | n |
| ``[[`` | 上一个引用 | n |
```

| ``&lt;a-n&gt;`` | 下一个引用 | n |
| ``&lt;a-p&gt;`` | 上一个引用 | n |
```


## 插件 Keymaps（按插件名）

### bufferline.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| _bufferline用于管理nvim所打开的buffer。_ | | |
| _Key 描述 Mode_ | | |
```

| ``&lt;leader&gt;bl`` | 删除左侧缓冲区 | n |
| ``&lt;leader&gt;bo`` | 删除其他缓冲区 | n |
| ``&lt;leader&gt;bp`` | 切换固定缓冲区 | n |
| ``&lt;leader&gt;bP`` | 删除所有未固定缓冲区 | n |
| ``&lt;leader&gt;br`` | 删除右侧缓冲区 | n |
```

| ``[b`` | 上一个缓冲区 | n |
| ``[B`` | 将缓冲区移动到上一个位置 | n |
| ``]b`` | 下一个缓冲区 | n |
| ``]B`` | 将缓冲区移动到下一个位置 | n |
```

| ``&lt;S-h&gt;`` | 上一个缓冲区 | n |
| ``&lt;S-l&gt;`` | 下一个缓冲区 | n |
```


### conform.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cF`` | 对嵌入的语言进行格式化, | n, v |
```


### flash.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;c-s&gt;`` | 切换闪电搜索 | c |
```

| ``r`` | 远程闪电搜索 | o |
| ``R`` | Treesitter搜索, | o, x |
| ``s`` | 闪电搜索,, | n, o, x |
| ``S`` | Treesitter闪电搜索,, | n, o, x |

### grug-far.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;sr`` | 搜索并替换, | n, v |
```


### mason.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cm`` | 打开Mason | n |
```


### neo-tree.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;be`` | Buffer浏览器 | n |
| ``&lt;leader&gt;e`` | 浏览NeoTree(Root根目录) | n |
| ``&lt;leader&gt;E`` | 浏览NeoTree(cwd目录) | n |
| ``&lt;leader&gt;fe`` | 浏览NeoTree(Root根目录) | n |
| ``&lt;leader&gt;fE`` | 浏览NeoTree(cwd目录) | n |
| ``&lt;leader&gt;ge`` | Git浏览器 | n |
```


### noice.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| _Key 描述 Mode_ | | |
```

| ``&lt;c-b&gt;`` | 向后滚动,, | n, i, s |
| ``&lt;c-f&gt;`` | 向前滚动,, | n, i, s |
| ``&lt;leader&gt;sn`` | +noice | n |
| ``&lt;leader&gt;sna`` | 显示所有通知 | n |
| ``&lt;leader&gt;snd`` | 忽略所有通知 | n |
| ``&lt;leader&gt;snh`` | 通知历史 | n |
| ``&lt;leader&gt;snl`` | 最后一条通知 | n |
| ``&lt;leader&gt;snt`` | 通知提取器(通过Telescope/FzfLua实现) | n |
| ``&lt;S-Enter&gt;`` | 重定向命令行 | c |
```


### nvim-notify

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;un`` | 忽略所有通知 | n |
```


### nvim-treesitter

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;bs&gt;`` | 减少选择范围 | x |
| ``&lt;c-space&gt;`` | 增加选择范围 | n |
```


### persistence.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;qd`` | 退出且不保存当前会话 | n |
| ``&lt;leader&gt;ql`` | 恢复上一个会话 | n |
| ``&lt;leader&gt;qs`` | 恢复会话 | n |
```


### telescope.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;&lt;space&gt;`` | 查找文件(根目录开始) | n |
| ``&lt;leader&gt;,`` | 切换Buffer | n |
| ``&lt;leader&gt;/`` | Grep(Root Dir) | n |
| ``&lt;leader&gt;:`` | 命令历史 | n |
| ``&lt;leader&gt;fb`` | Buffers | n |
| ``&lt;leader&gt;fc`` | 查找配置文件Config | n |
| ``&lt;leader&gt;ff`` | 查找文件（在根目录） | n |
| ``&lt;leader&gt;fF`` | Find Files(cwd) | n |
| ``&lt;leader&gt;fg`` | 查找文件(git文件) | n |
| ``&lt;leader&gt;fr`` | Recent | n |
| ``&lt;leader&gt;fR`` | Recent(cwd) | n |
| ``&lt;leader&gt;gc`` | Commits | n |
| ``&lt;leader&gt;gs`` | Status | n |
| ``&lt;leader&gt;s"`` | Registers | n |
| ``&lt;leader&gt;sa`` | Auto Commands | n |
| ``&lt;leader&gt;sb`` | Buffer | n |
| ``&lt;leader&gt;sc`` | Command History | n |
| ``&lt;leader&gt;sC`` | Commands | n |
| ``&lt;leader&gt;sd`` | Document Diagnostics | n |
| ``&lt;leader&gt;sD`` | Workspace Diagnostics | n |
| ``&lt;leader&gt;sg`` | Grep(Root Dir) | n |
| ``&lt;leader&gt;sG`` | Grep(cwd) | n |
| ``&lt;leader&gt;sh`` | Help Pages | n |
| ``&lt;leader&gt;sH`` | Search Highlight Groups | n |
| ``&lt;leader&gt;sj`` | Jumplist | n |
| ``&lt;leader&gt;sk`` | 快捷键映射图 | n |
| ``&lt;leader&gt;sl`` | Location List | n |
| ``&lt;leader&gt;sm`` | Jump to Mark | n |
| ``&lt;leader&gt;sM`` | 帮助页面 | n |
| ``&lt;leader&gt;so`` | 选项 | n |
| ``&lt;leader&gt;sq`` | Quickfix List | n |
| ``&lt;leader&gt;sR`` | Resume | n |
| ``&lt;leader&gt;ss`` | Goto Symbol | n |
| ``&lt;leader&gt;sS`` | Goto Symbol(Workspace) | n |
| ``&lt;leader&gt;sw`` | Word(Root Dir) | n |
| ``&lt;leader&gt;sW`` | Word(cwd) | n |
| ``&lt;leader&gt;sw`` | Selection(Root Dir) | v |
| ``&lt;leader&gt;sW`` | Selection(cwd) | v |
| ``&lt;leader&gt;uC`` | Colorscheme with Preview | n |
```


### todo-comments.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;st`` | 待办清单 | n |
| ``&lt;leader&gt;sT`` | Todo/Fix/Fixme | n |
| ``&lt;leader&gt;xt`` | Todo(Trouble) | n |
| ``&lt;leader&gt;xT`` | Todo/Fix/Fixme(Trouble) | n |
```

| ``[t`` | Previous Todo Comment | n |
| ``]t`` | Next Todo Comment | n |

### trouble.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cs`` | Symbols (Trouble) | n |
| ``&lt;leader&gt;cS`` | LSP references/definitions/... (Trouble) | n |
| ``&lt;leader&gt;xL`` | Location List (Trouble) | n |
| ``&lt;leader&gt;xQ`` | Quickfix List (Trouble) | n |
| ``&lt;leader&gt;xx`` | Diagnostics (Trouble) | n |
| ``&lt;leader&gt;xX`` | Buffer Diagnostics (Trouble) | n |
```

| ``[q`` | Previous Trouble/Quickfix Item | n |
| ``]q`` | Next Trouble/Quickfix Item | n |

### which-key.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;c-w&gt;&lt;space&gt;`` | Window Hydra Mode (which-key) | n |
| ``&lt;leader&gt;?`` | Buffer Keymaps (which-key) | n |
```


### CopilotChat.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;c-s&gt;`` | Submit Prompt | n |
| ``&lt;leader&gt;a`` | +ai, | n, v |
| ``&lt;leader&gt;aa`` | Toggle (CopilotChat), | n, v |
| ``&lt;leader&gt;ad`` | Diagnostic Help (CopilotChat), | n, v |
| ``&lt;leader&gt;ap`` | Prompt Actions (CopilotChat), | n, v |
| ``&lt;leader&gt;aq`` | Quick Chat (CopilotChat), | n, v |
| ``&lt;leader&gt;ax`` | Clear (CopilotChat), | n, v |
```


### mini.surround

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| ``gsa`` | Add Surrounding, | n, v |
| ``gsd`` | Delete Surrounding | n |
| ``gsf`` | Find Right Surrounding | n |
| ``gsF`` | Find Left Surrounding | n |
| ``gsh`` | Highlight Surrounding | n |
| ``gsn`` | Update`MiniSurround.config.n_lines` | n |
| ``gsr`` | Replace Surrounding | n |

### neogen

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cn`` | Generate Annotations (Neogen) | n |
```


### yanky.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;p`` | 打开Yank的历史记录, | n, x |
| ``&lt;p`` | Put and Indent Left | n |
| ``&lt;P`` | Put Before and Indent Left | n |
```

| ``=p`` | Put After Applying a Filter | n |
| ``=P`` | Put Before Applying a Filter | n |
```

| ``&gt;p`` | Put and Indent Right | n |
| ``&gt;P`` | Put Before and Indent Right | n |
```

| ``[p`` | Put Indented Before Cursor (Linewise) | n |
| ``[P`` | Put Indented Before Cursor (Linewise) | n |
| ``[y`` | Cycle Forward Through Yank History | n |
| ``]p`` | Put Indented After Cursor (Linewise) | n |
| ``]P`` | Put Indented After Cursor (Linewise) | n |
| ``]y`` | Cycle Backward Through Yank History | n |
| ``gp`` | Put Text After Selection, | n, x |
| ``gP`` | Put Text Before Selection, | n, x |
| ``p`` | Put Text After Cursor, | n, x |
| ``P`` | Put Text Before Cursor, | n, x |
| ``y`` | Yank Text, | n, x |

### nvim-dap

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;d`` | +debug, | n, v |
| ``&lt;leader&gt;da`` | Run with Args | n |
| ``&lt;leader&gt;db`` | Toggle Breakpoint | n |
| ``&lt;leader&gt;dB`` | Breakpoint Condition | n |
| ``&lt;leader&gt;dc`` | 继续 | n |
| ``&lt;leader&gt;dC`` | Run to Cursor | n |
| ``&lt;leader&gt;dg`` | Go to Line (No Execute) | n |
| ``&lt;leader&gt;di`` | Step Into | n |
| ``&lt;leader&gt;dj`` | Down | n |
| ``&lt;leader&gt;dk`` | Up | n |
| ``&lt;leader&gt;dl`` | Run Last | n |
| ``&lt;leader&gt;do`` | Step Out | n |
| ``&lt;leader&gt;dO`` | Step Over | n |
| ``&lt;leader&gt;dp`` | 暂停 | n |
| ``&lt;leader&gt;dr`` | Toggle REPL | n |
| ``&lt;leader&gt;ds`` | Session | n |
| ``&lt;leader&gt;dt`` | Terminate | n |
| ``&lt;leader&gt;dw`` | Widgets | n |
```


### nvim-dap-ui

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;de`` | Eval, | n, v |
| ``&lt;leader&gt;du`` | Dap UI | n |
```


### aerial.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cs`` | Aerial (Symbols) | n |
```


### telescope.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;ss`` | Goto Symbol (Aerial) | n |
```


### dial.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;C-a&gt;`` | Increment, | n, v |
| ``&lt;C-x&gt;`` | Decrement, | n, v |
| ``g&lt;C-a&gt;`` | Increment, | n, v |
| ``g&lt;C-x&gt;`` | Decrement, | n, v |
```


### fzf-lua

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;&lt;space&gt;`` | 查找文件 (根目录开始) | n |
| ``&lt;leader&gt;,`` | 切换Buffer | n |
| ``&lt;leader&gt;/`` | Grep (Root Dir) | n |
| ``&lt;leader&gt;:`` | 命令历史记录 | n |
| ``&lt;leader&gt;fb`` | Buffers | n |
| ``&lt;leader&gt;fc`` | 查找配置文件 | n |
| ``&lt;leader&gt;ff`` | Find Files (Root Dir) | n |
| ``&lt;leader&gt;fF`` | Find Files (cwd) | n |
| ``&lt;leader&gt;fg`` | Find Files (git-files) | n |
| ``&lt;leader&gt;fr`` | Recent | n |
| ``&lt;leader&gt;fR`` | Recent (cwd) | n |
| ``&lt;leader&gt;gc`` | Commits | n |
| ``&lt;leader&gt;gs`` | 状态 | n |
| ``&lt;leader&gt;s"`` | Registers | n |
| ``&lt;leader&gt;sa`` | Auto Commands | n |
| ``&lt;leader&gt;sb`` | Buffer | n |
| ``&lt;leader&gt;sc`` | Command History | n |
| ``&lt;leader&gt;sC`` | Commands | n |
| ``&lt;leader&gt;sd`` | Document Diagnostics | n |
| ``&lt;leader&gt;sD`` | Workspace Diagnostics | n |
| ``&lt;leader&gt;sg`` | Grep (Root Dir) | n |
| ``&lt;leader&gt;sG`` | Grep (cwd) | n |
| ``&lt;leader&gt;sh`` | 帮助页面 | n |
| ``&lt;leader&gt;sH`` | Search Highlight Groups | n |
| ``&lt;leader&gt;sj`` | Jumplist | n |
| ``&lt;leader&gt;sk`` | 按键映射 | n |
| ``&lt;leader&gt;sl`` | Location List | n |
| ``&lt;leader&gt;sm`` | 跳转到标记 | n |
| ``&lt;leader&gt;sM`` | 帮助页面 | n |
| ``&lt;leader&gt;sq`` | Quickfix List | n |
| ``&lt;leader&gt;sR`` | 继续 | n |
| ``&lt;leader&gt;ss`` | Goto Symbol | n |
| ``&lt;leader&gt;sS`` | Goto Symbol (Workspace) | n |
| ``&lt;leader&gt;sw`` | Word (Root Dir) | n |
| ``&lt;leader&gt;sW`` | Word (cwd) | n |
| ``&lt;leader&gt;sw`` | Selection (Root Dir) | v |
| ``&lt;leader&gt;sW`` | Selection (cwd) | v |
| ``&lt;leader&gt;uC`` | Colorscheme with Preview | n |
```


### todo-comments.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;st`` | Todo | n |
| ``&lt;leader&gt;sT`` | Todo/Fix/Fixme | n |
```


### harpoon

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;1`` | Harpoon to File 1 | n |
| ``&lt;leader&gt;2`` | Harpoon to File 2 | n |
| ``&lt;leader&gt;3`` | Harpoon to File 3 | n |
| ``&lt;leader&gt;4`` | Harpoon to File 4 | n |
| ``&lt;leader&gt;5`` | Harpoon to File 5 | n |
| ``&lt;leader&gt;h`` | Harpoon Quick Menu | n |
| ``&lt;leader&gt;H`` | Harpoon File | n |
```


### vim-illuminate

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| ``[[`` | 前一个引用 | n |
| ``]]`` | 下一个引用 | n |

### leap.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| ``gs`` | Leap from Windows,, | n, o, x |
| ``s`` | Leap Forward to,, | n, o, x |
| ``S`` | Leap Backward to,, | n, o, x |

### mini.surround

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| ``gz`` | +surround | n |

### mini.diff

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;go`` | Toggle mini.diff overlay | n |
```


### mini.files

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;fm`` | Open mini.files (Directory of Current File) | n |
| ``&lt;leader&gt;fM`` | Open mini.files (cwd) | n |
```


### outline.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cs`` | Toggle Outline | n |
```


### overseer.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;ob`` | Task builder | n |
| ``&lt;leader&gt;oc`` | 清除缓存 | n |
| ``&lt;leader&gt;oi`` | Overseer Info | n |
| ``&lt;leader&gt;oo`` | 执行任务 | n |
| ``&lt;leader&gt;oq`` | Action recent task | n |
| ``&lt;leader&gt;ot`` | Task action | n |
| ``&lt;leader&gt;ow`` | 任务列表 | n |
```


### refactoring.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;r`` | +refactor, | n, v |
| ``&lt;leader&gt;rb`` | Extract Block | n |
| ``&lt;leader&gt;rc`` | Debug Cleanup | n |
| ``&lt;leader&gt;rf`` | Extract Block To File | n |
| ``&lt;leader&gt;rf`` | Extract Function | v |
| ``&lt;leader&gt;rF`` | Extract Function To File | v |
| ``&lt;leader&gt;ri`` | Inline Variable, | n, v |
| ``&lt;leader&gt;rp`` | Debug Print Variable, | n, v |
| ``&lt;leader&gt;rP`` | Debug Print | n |
| ``&lt;leader&gt;rs`` | Refactor | v |
| ``&lt;leader&gt;rx`` | Extract Variable | v |
```


### telescope.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;&lt;space&gt;`` | Find Files (Root Dir) | n |
| ``&lt;leader&gt;,`` | Switch Buffer | n |
| ``&lt;leader&gt;/`` | Grep (Root Dir) | n |
| ``&lt;leader&gt;:`` | Command History | n |
| ``&lt;leader&gt;fb`` | Buffers | n |
| ``&lt;leader&gt;fc`` | Find Config File | n |
| ``&lt;leader&gt;ff`` | Find Files (Root Dir) | n |
| ``&lt;leader&gt;fF`` | Find Files (cwd) | n |
| ``&lt;leader&gt;fg`` | Find Files (git-files) | n |
| ``&lt;leader&gt;fr`` | Recent | n |
| ``&lt;leader&gt;fR`` | Recent (cwd) | n |
| ``&lt;leader&gt;gc`` | Commits | n |
| ``&lt;leader&gt;gs`` | 显示telescope状态 | n |
| ``&lt;leader&gt;s"`` | Registers | n |
| ``&lt;leader&gt;sa`` | Auto Commands | n |
| ``&lt;leader&gt;sb`` | Buffer | n |
| ``&lt;leader&gt;sc`` | Command History | n |
| ``&lt;leader&gt;sC`` | Commands | n |
| ``&lt;leader&gt;sd`` | Document Diagnostics | n |
| ``&lt;leader&gt;sD`` | Workspace Diagnostics | n |
| ``&lt;leader&gt;sg`` | Grep (Root Dir) | n |
| ``&lt;leader&gt;sG`` | Grep (cwd) | n |
| ``&lt;leader&gt;sh`` | 帮助页面 | n |
| ``&lt;leader&gt;sH`` | Search Highlight Groups | n |
| ``&lt;leader&gt;sj`` | Jumplist | n |
| ``&lt;leader&gt;sk`` | 显示telescope的按键映射 | n |
| ``&lt;leader&gt;sl`` | Location List | n |
| ``&lt;leader&gt;sm`` | Jump to Mark | n |
| ``&lt;leader&gt;sM`` | Man Pages | n |
| ``&lt;leader&gt;so`` | 显示telescope的选项 | n |
| ``&lt;leader&gt;sq`` | Quickfix List | n |
| ``&lt;leader&gt;sR`` | 继续 | n |
| ``&lt;leader&gt;ss`` | Goto Symbol | n |
| ``&lt;leader&gt;sS`` | Goto Symbol (Workspace) | n |
| ``&lt;leader&gt;sw`` | Word (Root Dir) | n |
| ``&lt;leader&gt;sW`` | Word (cwd) | n |
| ``&lt;leader&gt;sw`` | Selection (Root Dir) | v |
| ``&lt;leader&gt;sW`` | Selection (cwd) | v |
| ``&lt;leader&gt;uC`` | Colorscheme with Preview | n |
```


### nvim-ansible

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;ta`` | Ansible Run Playbook/Role | n |
```


### markdown-preview.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cp`` | Markdown格式的预览 | n |
```


### nvim-dap-python

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;dPc`` | Debug Class | n |
| ``&lt;leader&gt;dPt`` | Debug Method | n |
```


### venv-selector.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;cv`` | 选择虚拟环境 | n |
```


### vim-dadbod-ui

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;D`` | Toggle DBUI | n |
```


### vimtex

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;localLeader&gt;l`` | +vimtext | n |
```


### neotest

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;t`` | +test | n |
| ``&lt;leader&gt;tl`` | Run Last | n |
| ``&lt;leader&gt;to`` | 显示输出结果 | n |
| ``&lt;leader&gt;tO`` | Toggle Output Panel | n |
| ``&lt;leader&gt;tr`` | Run Nearest | n |
| ``&lt;leader&gt;ts`` | Toggle Summary | n |
| ``&lt;leader&gt;tS`` | 停止 | n |
| ``&lt;leader&gt;tt`` | Run File | n |
| ``&lt;leader&gt;tT`` | Run All Test Files | n |
| ``&lt;leader&gt;tw`` | Toggle Watch | n |
```


### nvim-dap

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;td`` | Debug Nearest | n |
```


### edgy.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;ue`` | Edgy Toggle | n |
| ``&lt;leader&gt;uE`` | Edgy Select Window | n |
```


### chezmoi.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;sz`` | Chezmoi | n |
```


### mason.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;gg`` | GitUi (Root Dir) | n |
| ``&lt;leader&gt;gG`` | GitUi (cwd) | n |
```


### octo.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;a`` | +assignee (Octo) | n |
| ``&lt;leader&gt;c`` | +comment/code (Octo) | n |
| ``&lt;leader&gt;gi`` | List Issues (Octo) | n |
| ``&lt;leader&gt;gI`` | Search Issues (Octo) | n |
| ``&lt;leader&gt;gp`` | List PRs (Octo) | n |
| ``&lt;leader&gt;gP`` | Search PRs (Octo) | n |
| ``&lt;leader&gt;gr`` | List Repos (Octo) | n |
| ``&lt;leader&gt;gS`` | Search (Octo) | n |
| ``&lt;leader&gt;i`` | +issue (Octo) | n |
| ``&lt;leader&gt;l`` | +label (Octo) | n |
| ``&lt;leader&gt;p`` | +pr (Octo) | n |
| ``&lt;leader&gt;r`` | +react (Octo) | n |
| ``&lt;leader&gt;v`` | +review (Octo) | n |
```


### fzf-lua

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;fp`` | 项目 | n |
```


### telescope.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
```

| ``&lt;leader&gt;fp`` | 项目 | n |
```


### kulala.nvim

| 快捷键 | 功能 | 模式 |
|--------|------|------|
| _主要用于API调试_ | | |
```

| ``&lt;leader&gt;R`` | +Rest | n |
| ``&lt;leader&gt;Rn`` | 跳转到下一个请求 | n |
| ``&lt;leader&gt;Rp`` | 跳转到上一个请求 | n |
| ``&lt;leader&gt;Rs`` | 发送请求 | n |
| ``&lt;leader&gt;Rt`` | 收起/打开head和body | n |
```

| _💡_ | | |
| _有关NeoVim安装或者使用上的问题，欢迎您在底部评论区留言，一起交流~_ | | |

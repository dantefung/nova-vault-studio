
# fzf-tab - 使用 fzf 作为 zsh 的补全选择菜单

- [fzf-tab - 使用 fzf 作为 zsh 的补全选择菜单](https://www.v2ex.com/t/653576)

共 2241 字阅读需 5 分钟

# 简介

fzf-tab 是一个能够极大提升 zsh 补全体验的插件。它通过 hook zsh 补全系统的底层函数 `compadd` 来截获补全列表，从而实现了在补全几乎任何玩意儿（命令行参数、变量、目录栈、文件）时都能使用 fzf 进行选择的功能。

快速预览：[![](https://asciinema.org/a/293849.svg)](https://asciinema.org/a/293849)

项目地址： https://github.com/Aloxaf/fzf-tab

# 安装

**偏好手动安装的用户**

先随便 clone 到哪里

    git clone https://github.com/Aloxaf/fzf-tab ~/somewhere

然后把 `source ~/somewhere/fzf-tab.plugin.zsh` 放到你的 `~/.zshrc` 里。

**各种插件管理器用户**

以妙妙的 zinit 为例

    zinit light Aloxaf/fzf-tab

**Oh My Zsh 用户**

先把本项目 clone 到你的插件目录，然后在插件列表里加上 `fzf-tab`

    git clone https://github.com/Aloxaf/fzf-tab ~ZSH_CUSTOM/plugins/fzf-tab

**注意事项：** fzf-tab 对加载顺序有要求，推荐将它放在 `compinit` 之后、`zsh-autosuggestions` 和 `fast-syntax-highlighting` 和 `zsh-syntax-highlighting` 之前加载。大概就像这个样子（仍然以 zinit 为例）：

    autoload -Uz compinit; compinit # zinit 用户这里可能是 zpcompinit; zpcdreplay
    zinit light Aloxaf/fzf-tab      # fzf-tab 放在中间加载
    zinit light zsh-users/zsh-autosuggestions    # 然后再是自动建议和语法高亮
    zinit light zdharma/fast-syntax-highlighting

# 用法

用法非常简单，和平常一样按 `Tab` 就行了～

借助 `fzf` 提供的一些妙妙功能，你除了按 `Enter` 直接让结果上屏以外，甚至还可以

1.  按 `Ctrl+Space` 多选
2.  按 `/` 在本次结果上屏以后立即开始下一次补全（主要用于补全长路径）

# 配置

fzf-tab 的目标是兼容 zsh 补全系统的所有配置，不过这个目标我觉得除非我写一个 binary module，否则是不可能实现的……（考虑到 zsh 文档非常辣鸡，这个 binary module 我估计也写不出来

不过幸运的是，得益于 zsh 残念的文档，大部分人的对补全系统的配置应该也不会变态到 fzf-tab 承受不住。

如果将 zsh 的补全系统分为两部分：生成补全结果 和 展示补全结果。 那么在使用 fzf-tab 时，和“生成补全结果”相关的配置是可以生效的；而“展示补全结果”相关的配置，能不能生效就是一个未知数了（

`fzf-tab` 目前主动对与“展示”相关的两个常见配置做了兼容:

*   `descriptions`

用于设置不同补全“组”的描述文本

常见设置 `zstyle ':completion:*:descriptions' format '[%d]'`。

因为 fzf 本身并不支持分组的功能，所以 `fzf-tab` 目前采用了用不同颜色来区分不同组。

*   `list-colors`

用于设置补全项的颜色，大部分人都是当成 LS\_COLORS 用

常见设置 `zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}`

如果你只是当 LS\_COLORS 用的话，`fzf-tab` 是可以完美支持的，甚至还能自动 resolve 符号链接并展示出来。 唯一的美中不足就是这是由纯 zsh 实现的，所以如果一次性补全上千个文件，速度会有点慢。

![](https://user-images.githubusercontent.com/17017672/76829716-c3d5ba80-685e-11ea-84c2-32e128ff4cad.png)

fzf-tab 自身提供的配置参见 [README](https://github.com/Aloxaf/fzf-tab/blob/master/README_CN.md)

## 实验性功能

fzf 提供了 `--preview` 命令可以对当前选择的项目执行一段命令并将结果用小窗口展示出来。

利用这个命令我们还能做到一些 zsh 补全系统做不到的事情，比如在补全 `cd` 时预览目录的内容：

    # 一些样板代码（未来可能会改变）
    local extract="
    # 提取当前选择的内容
    in=\${\${\"\$(<{f})\"%\$'\0'*}#*\$'\0'}
    # 获取当前补全状态的上下文
    local -A ctxt=(\"\${(@ps:\2:)CTXT}\")
    "

    zstyle ':fzf-tab:complete:cd:*' extra-opts --preview=$extract'exa -1 --color=always ${~ctxt[hpre]}$in'

![](https://user-images.githubusercontent.com/17017672/76829854-13b48180-685f-11ea-891b-d8c9f07cb057.png)

又比如补全 `kill` 命令时预览命令行参数（`$extract` 变量和上面是一样的）

    zstyle ':fzf-tab:complete:kill:argument-rest' extra-opts --preview=$extract'ps --pid=$in[(w)1] -o cmd --no-headers -w -w' --preview-window=down:3:wrap

![](https://user-images.githubusercontent.com/17017672/76829962-4b232e00-685f-11ea-8e03-7bf061af9a5d.png)





# Windows 环境Git bash 安装ZSH

- [Windows安装Zsh终端](https://zhuanlan.zhihu.com/p/625583037)


共 4394 字阅读需 9 分钟

### 前言

本文以 `Git Bash` 终端为基础，来安装 `Zsh`终端和 `powerlevel10k` 主题，轻松易上手。

本文以 `Windows Terminal`为例，也就是 `Windows 11` 中的 `终端`，`Windows 10` 没有的话，可以去应用商店搜索并下载。但这并不是必须的，你使用 `Git Bash` 也是可以的。

本文所用到软件和字体文件，建议大家从文中提供的官网地址进行下载，以保证版本的时效性。由于网络原因，一些无法访问外网的小伙伴，笔者帮大家打包好了一份，方便大家下载（软件打包时间为2023-04-26，请注意使用时间）：

[软件与字体打包下载地址](https://luwnto.lanzoum.com/b00wxp55g) 密码：4p54

### 安装 git bash

下载 [windows版本git](https://git-scm.com/download/win)，一般来说，下载64位版本：

![](https://pic3.zhimg.com/v2-4e193fe1654750705a9512e9ef0f0206_r.jpg)

在安装的过程中，记得勾选 `Add a Git Bash Profile to Windows Terminal` （如果你不习惯使用 `window` 终端，喜欢使用 `Git Bash`，那么下面这几步可以跳过），之后的安装一直下一步即可：

![](https://pic3.zhimg.com/v2-2804a6cc8a02baaf67732de827d107c0_r.jpg)

勾选是为了在 `Windows Terminal（终端）` 中能够使用 `Git Bash`，可以看一下，原本终端是没有 `Bit Bash` 选项的：

![](https://pica.zhimg.com/v2-d8084baec6776fe42b81bb92e5b9650e_r.jpg)

安装 `git` 之后，重新打开终端，在标签页选择项中就可以看到 `Git Bash` 的选择项了：

![](https://picx.zhimg.com/v2-c552d27197ca652377ab48dc048ca415_r.jpg)

> 如果在安装 `Git` 的时候勾选了这个选项，但是没有出现 `Git Bash` 选项的话，可能是 `Windows Terminal` 版本过低，在应用商店中搜索 `Windows Terminal`，更新一下即可。

### 安装 zsh

下载 [`zsh安装包`](https://packages.msys2.org/package/zsh%3Frepo%3Dmsys%26variant%3Dx86_64)：

![](https://pic2.zhimg.com/v2-a40137f2ff0094a6477fbc8f7cdbd5ef_r.jpg)

将 zsh 安装包解压到 git 的安装根目录下，可以使用 [7-Zip-zstd](https://github.com/mcmilk/7-Zip-zstd/releases) 解压：

![](https://pic2.zhimg.com/v2-86283fcaf36cf14af46ec2511e5bfb93_r.jpg)

需要解压两次，第一次解压，解压到当前目录即可，得到 `.tar`文件：

![](https://picx.zhimg.com/v2-db5aef2b57cf8224f00359722885fd95_r.jpg)

第二次解压 `.tar`文件到当前目录（直接解压到 git 安装目录可能会没有权限）：

![](https://pic2.zhimg.com/v2-2bf3cd00e97007c0413566afdbc90451_r.jpg)

移动解压后的文件到 `git` 安装目录即可，需要权限的话就授权，重名的话直接覆盖：

![](https://pic4.zhimg.com/v2-35502b40eccb7eec31cf4f38b5cf8043_r.jpg)

打开 `Git Bash` 标签页或者直接右键打开 `Git bash` 输入 `zsh`，出现下图则安装成功：

![](https://pic4.zhimg.com/v2-e99c87f972c8becb849e88dd8c1b7ef7_r.jpg)

暂时先不进行其他设置，直接输入`0` 结束并生成 `.zshrc` 配置文件即可。

由于现在没有安装 `zsh` 主题，可以这样区分 `bash` 和 `zsh`，`bash`的光标在第二行，`zsh`的光标在同一行：

![](https://pic2.zhimg.com/v2-b20fe090424850df87b6f9ee9a99c8a7_r.jpg)

### 设置默认启动

### 设置 Git Bash 默认使用 Zsh

每次打开 `Git Bash` 终端，你会发现默认还是 `Bash` 终端，而不是 `Zsh`，可以通过编辑 `Bash` 终端的配置文件 `.bashrc` 来实现默认使用 `Zsh`，在 `Git Bash` 终端中输入命令：

    vim ~/.bashrc

![](https://pic4.zhimg.com/v2-2d18723ea0b1424e4270b45acd5da03d_r.jpg)

`Vim` 默认是命令模式，你可以直接将配置内容粘贴进去，然后输入冒号 `:` 进入尾行模式，在尾行模式输入小写 `wq` 最后按回车键，保存退出：

    if [ -t 1 ]; then
      exec zsh
    fi

![](https://picx.zhimg.com/v2-cbe8ba70e67f2b655a168fda40ef16e5_r.jpg)

> 也可以在 vim 命令模式按小写 `i` 进入插入模式，之后粘贴或写入内容，按 `Esc` 退出插入模式，然后输入冒号 `:` 进入尾行模式，在尾行模式输入小写 `wq` 最后按回车键，保存退出

之后再打开 `Git Bash` 终端，默认就会使用 `Zsh` 了。第一次可能有一个警告：大概是找不到 `~/bash_profile` 等一些文件，可以忽略，以后不会再出现了。

### 设置 Windows Terminal 默认使用 Git Bash

每次打开 `Windows Terminal` 默认使用的是 `Windows PowerShell`，要改为默认使用 `Git Bash`，在设置里面进行设置即可。在更多选项中点击设置，或者右键标题栏空白处再点击设置，设置 `Git Bash` 为默认终端：

![](https://pica.zhimg.com/v2-1b9c154d3dfbdf714c28723997923b18_r.jpg)

### 安装 Oh My Zsh

在安装好 `Zsh` 终端之后，看起来跟 `Bash` 终端并无太大的区别，我们也没有进行设置。而 `Oh My Zsh` 可以用于管理 `Zsh`配置。它捆绑了数千个有用的功能、助手、插件、主题等。

在命令行输入命令并按回车执行：

    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

出现下图的内容就是安装成功了，如果出现错误，或长时间没有响应，多试几次即可：

![](https://pic1.zhimg.com/v2-2081bd6d94a70b10a18e740258ef5e9e_r.jpg)

> 最后一行的 `ERROR` 可以忽略

### 配置 zsh

`Zsh`的配置文件在用户的家目录，文件是 `.zshrc`，编辑配置文件，可以对 `Zsh`进行一些定制化配置：

    vim ~/.zshrc

编辑并保存配置文件之后，并不会立即生效，可以关闭所有终端重新打开，或者使用命令让配置生效：

    source ~/.zshrc

### 配置主题

`Oh My Zsh` 安装默之后，默认使用主题是 `robbyrussell`，可以修改 `.zshrc` 配置中的 `ZSH_THEME` 字段，所有可用主题可参考[ohmyzsh官方文档](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)，这里先配置一下我个人比较喜欢的主题：

![](https://pic4.zhimg.com/v2-4d0cdea08d548a661d7b6944522a8c09_r.jpg)

### 配置插件

通过使用插件，可以让 `Zsh` 的功能更加强大，`Zsh` 和 `Oh My Zsh` 自带了一些实用的插件，也可以下载其他的插件。 如 `Zsh` 自带 `Git` 插件，可以在命令行显示 `Git` 相关的信息，并提供了一些操作 `Git` 的别名：

    gaa = git add --all
    gcmsg = git commit -m
    ga = git add
    gst = git status
    gp = git push

![](https://picx.zhimg.com/v2-d23d3df03a441fa73e806abf2dab4ff5_r.jpg)

### 自动补全

`zsh-autosuggestions` 插件，可以在你历史指令中找到与你当前输入指令匹配的记录，并高亮显示，如果想直接使用，可以直接通过右方向键补全。 安装插件，在终端分别执行下面两条命令：

    cd ~/.oh-my-zsh/custom/plugins

    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

插件下载完成之后，编辑 `~/.zshrc` 配置文件，修改插件相关配置项：

    vim ~/.zshrc

![](https://pica.zhimg.com/v2-1f1bdde3ac3422362e53ac8dd5681c82_r.jpg)

保存退出之后，记得使用命令 `source ~/.zshrc` 重载配置。该插件生效之后，在使用命令的时候，就会匹配我们使用的命令，右键可以直接补全：

![](https://pic3.zhimg.com/v2-c8fac3d2eee00ad252b1511350bf63f8_r.jpg)

如果你不喜欢提示默认的浅灰色，可以在 `~/.zshrc` 中修改（没有配置项就添加），更多配置可以参考[zsh-autosuggestions官方文档](https://link.zhihu.com/?target=https%3A//github.com/zsh-users/zsh-autosuggestions%23suggestion-highlight-style)：

    ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#9fc5e8"

### 目录跳转

`Zsh` 自带有一个插件 `z`，可以让我们在访问过的目录中快速跳转，将该插件配置到 `~/.zshrc` 文件中即可使用：

![](https://picx.zhimg.com/v2-211a0bcc204ff11cd0a35246b3580b85_r.jpg)

保存退出之后，重载配置，随意进入一些目录，之后再使用命令 `z` 就可以实现快速跳转，支持模糊匹配：

![](https://pic3.zhimg.com/v2-58f67de56e131c4c47897b3f675f503c_r.jpg)

或许相比于 `z`，更多人会选择使用 [`autojump`](https://zhida.zhihu.com/search?content_id=227149648\&content_type=Article\&match_order=1\&q=autojump\&zhida_source=entity)，如果是 `Mac` 或者 `Linux` 没什么问题，`Windows` 就不太建议折腾了。

### 其他插件

[`zsh-syntax-highlighting`](https://zhida.zhihu.com/search?content_id=227149648\&content_type=Article\&match_order=1\&q=zsh-syntax-highlighting\&zhida_source=entity)：这个插件可以识别的 `shell` 命令并高亮显示，需下载 `sudo`：按两次 `ESC` 快速添加 `sudo` 前缀 `gitignore`：提供一条 `gi` 命令，用来查询 `gitignore` 模板

### 配置别名

`Zsh` 的 `alias` 配置项可以自定义命令别名，在使用一些比较复杂的命令时，使用别名可以提高效率，这里举例添加一个 `Git` 日志的别名：

    alias gli="git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

![](https://pica.zhimg.com/v2-81d4ae549424e4fd6a3b31c6f4f03d1e_r.jpg)

> 注意等号两边不要有空格

### 安装 Powerlevel10k 主题

经过前面的一些配置，基本能够满足大部分需求了，`Powerlevel10k` 并不是必须的，喜欢折腾的可以继续。 `Powerlevel10k` 是一个 zsh 主题，它使用 `power` 字体和一个引导配置向导，以一种简单的方式自定义主题。

### 安装并设置字体

首先下载官方推荐的字体 [字体下载](https://link.zhihu.com/?target=https%3A//github.com/romkatv/powerlevel10k%23meslo-nerd-font-patched-for-powerlevel10k)，根据自己的喜好下载一款字体即可，如果不使用 `Powerline` 字体，会导致很多图标无法显示。 下载完字体时候，右键字体，为所有用户安装：

![](https://pic2.zhimg.com/v2-78cf5ab6b577bf4930d632886e14baf9_r.jpg)

为 `Windows Terminal` 设置字体，只改默认配置即可：

![](https://picx.zhimg.com/v2-6773ff605a168ea30fdfabd4b42e6765_r.jpg)

![](https://pic2.zhimg.com/v2-b51e897bd1f23a79c3980125bfac6a33_r.jpg)

如果你更喜欢使用 `Git Bash` 终端，那就为 `Git Bash` 设置字体，右键 `Git Bash` 标题栏空白处，进入设置界面：

![](https://pic3.zhimg.com/v2-32dd972d125bf9a308bb414420670568_r.jpg)

![](https://pica.zhimg.com/v2-966e8371037d7d8a10716ecb9e4ba196_r.jpg)

### 安装 Powerlevel10k

在终端执行命令安装：

    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

如果 `github` 无法访问，也可使用国内的地址：

    git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

安装完成后在 `~/.zshrc` 文件中设置 `ZSH_THEME`：

    ZSH_THEME="powerlevel10k/powerlevel10k"

在终端执行命令更新 `.zshrc` 配置文件：

    source ~/.zshrc

之后会显示可交互信息进行 `p10k` 配置，输入 `y` 之后按照自己的喜好进行配置即可，以后还想重新配置的话，可以执行命令 `p10k configure`，或修改 `p10k` 配置文件 `~/.p10k.zsh`：

![](https://pic1.zhimg.com/v2-93e81920533f01892c84bcea11c241ec_r.jpg)

![](https://pic1.zhimg.com/v2-ea86148f3fa734cb64c874643ed11340_r.jpg)

会有很多配置项，有友好的示例，大家根据自己的喜好选择就行，如果图标没有正常显示，那就检查一下终端字体是否设置正确。到下面这一步的时候，注意选择 `off`即可：

![](https://pic4.zhimg.com/v2-f4a5c5f52f3c654d154ec731f94459e7_r.jpg)

最后一步输入 `y` ：

![](https://pic1.zhimg.com/v2-3354693a076c759bd18fbada57af3012_r.jpg)

最终效果图：

![](https://picx.zhimg.com/v2-4d8c454218c3f1651116df86440e1041_r.jpg)

更多配置，可以参考[官方GitHub](https://github.com/romkatv/powerlevel10k)

End \~

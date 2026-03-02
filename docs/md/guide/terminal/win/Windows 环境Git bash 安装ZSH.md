
# Windows 环境Git bash 安装ZSH 

- [Windows 环境Git bash 安装ZSH](https://chaosbynn.github.io/2025/11/27/Windows-%E7%8E%AF%E5%A2%83Git-bash-%E5%AE%89%E8%A3%85ZSH/)

共 2766 字阅读需 6 分钟

> 在 Windows 的 Git Bash 里“装” zsh 实际上就是把 MSYS2 提供的 zsh 可执行文件和相关依赖解压到 Git 安装目录,再把 Git Bash 的默认 shell 切到 zsh 即可 下面给出 2025 年仍验证可行的最小步骤,全部操作无需额外安装 MSYS2 完整环境

### 准备

1.  已装 Git for Windows(默认路径 `C:\Program Files\Git`)
2.  建议先装一款 Nerd Font(后面 oh-my-zsh / powerlevel10k 图标不会乱码)\
    下载地址：<https://www.nerdfonts.com/font-downloads>

### 下载并解压 zsh

1.  打开 <https://packages.msys2.org/package/zsh?repo=msys&variant=x86_64>\
    选一个较新的构建,例如\
    `zsh-5.9-2-x86_64.pkg.tar.zst`
2.  用能解压 `*.zst` 的工具(PeaZip / 7-Zip 21+ / WinRAR 6.2+)把包解开\
    得到两个文件夹：`etc` 和 `usr`
3.  把这两个文件夹直接复制到\
    `C:\Program Files\Git`\
    遇到文件冲突时选“覆盖”即可,不会破坏 Git 原有功能

### 首次启动并生成默认配置

1.  打开 Git Bash,执行

        zsh

    &#x20;第一次会进入 zsh 新用户配置向导,按提示选 1 2 3 或直接 q 退出
2.  完成后退出 Git Bash 再重新打开,确认能正常进入 zsh

### (可选)把 zsh 设为 Git Bash 默认 shell

不想每次手动敲 `zsh`,就在 `~/.bashrc` 末尾加一段自动跳转：

    # ~/.bashrc
    if [ -t 1 ]; then
      exec zsh
    fi

保存后重启 Git Bash,即默认进入 zsh

![](https://raw.githubusercontent.com/ChaoSBYNN/image-hosting/main/program/terminal/_20251127144715_105_18.png)

### 异常情况

#### 输入 zsh 无反应

1.  先确认 `zsh.exe` 真的存在\
    在 Git Bash 里执行

        ls "/c/Program Files/Git/usr/bin/zsh.exe"

    *   如果提示 **No such file** → 你第二步解压/复制时漏了,把 `usr/bin/zsh.exe` 重新拷进去即可
    *   如果文件存在 → 继续第 2 步
2.  确认 PATH 能搜得到

    Git Bash 启动时会把自己的 `/usr/bin` 附加到 PATH,理论上不需要手动加；但如果你改过 Windows 环境变量或者装过 scoop/choco 之类,可能把别的同名目录顶到前面\
    在 Git Bash 执行

        which zsh          # 应该返回 /usr/bin/zsh
        echo $PATH | tr ':' '\n' | grep -i zsh

    *   如果 `which` 什么都不输出,说明 PATH 里根本没有；
    *   如果输出的是 **/c/WINDOWS/system32/zsh** 之类不存在的路径,也是找不到

    解决：临时把 Git 自带的目录强制放到最前面,在 `~/.bashrc` 顶部加一行

        export PATH="/c/Program Files/Git/usr/bin:$PATH"

    保存后重开 Git Bash,再试 `zsh`
3.  依赖 DLL 缺失(极少见)

    双击 `C:\Program Files\Git\usr\bin\zsh.exe` 如果弹出 “**无法找到 msys-2.0.dll**” 等提示,说明你还缺 MSYS2 运行库

    把下面两个包同样下载→解压→覆盖到 Git 根目录即可(同第 2 步操作)：

    *   msys2-runtime-3.4.x-xxxx-x86\_64.pkg.tar.zst
    *   ncurses-6.4-xxxx-x86\_64.pkg.tar.zst\
        下载地址还是 <https://packages.msys2.org/base/msys2-runtime> 和 /base/ncurses
4.  64 位 / 32 位搞错

    如果你装的是 **32 位 Git for Windows**,却下载了 **x86\_64** 的 zsh 包,也会闪退

    确认位数：

        echo $MSYSTEM        # 看到 MINGW32 说明是 32 位

    如果是 MINGW32,请回到 MSYS2 官网下载 **i686** 版本的 zsh 包重新覆盖
5.  防病毒/公司策略拦截

    某些 AV 会把 `zsh.exe` 当外来程序直接拦截,日志里却没有任何提示

    临时把 `C:\Program Files\Git\usr\bin\zsh.exe` 加入白名单,或者关掉 AV 再试一次即可验证

### 缺失依赖下载

#### “zsh.exe - 无法找到入口”

dll 版本太旧

你下的 `zsh-5.9-...pkg.tar.zst` 包里带的 `msys-zsh-5.9.dll` 是 2023 年以后的版本,需要同版本 `msys2-runtime`(也就是 `msys-2.0.dll`)里导出 setproctitle 符号

而 Git for Windows 自带的 runtime 还是 2022 年甚至更老,没有 setproctitle,于是加载时报入口缺失

> 把 msys2-runtime、ncurses、zsh 三个包同时更新成 2023+ 同批次(x86\_64 或 i686 统一),一起解压到 Git 根目录

1.  打开 <https://packages.msys2.org/package/zsh>\
    选 zsh-5.9-2-x86\_64.pkg.tar.zst(2023-12-15 构建)
2.  同页 Dependencies 里把\
    `msys2-runtime-3.4.9-2-x86_64.pkg.tar.zst` `ncurses-6.4-1-x86_64.pkg.tar.zst`\
    也下载下来
3.  三个包一起解压,得到 `usr/bin/*.dll` 等文件,全部覆盖到\
    `C:\Program Files\Git`\
    (遇到冲突选“替换”)
4.  重新打开 Git Bash → zsh 即可正常进入,弹窗消失

> `Dependencies 里没有 msys2-runtimemsys2-runtime` 属于 “底层 C 运行库”,MSYS2 官网把它单独放在 `msys` 仓库而不是 `mingw64/mingw32`,所以在 zsh 页面是看不到的\
> 打开 <https://packages.msys2.org/package/msys2-runtime?repo=msys&variant=x86_64>



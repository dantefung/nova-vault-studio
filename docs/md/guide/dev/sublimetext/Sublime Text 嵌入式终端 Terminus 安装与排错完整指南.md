# Sublime Text 嵌入式终端 Terminus 安装与排错完整指南

生成时间：2026-02-28 10:48:07

------------------------------------------------------------------------

## 一、环境说明

本文适用于：

-   Linux（如 Debian / Ubuntu 等）
-   使用 Sublime Text
-   需要嵌入式终端（Terminus 插件）

------------------------------------------------------------------------

# 二、正常安装 Terminus（推荐方式）

## 1. 确认已安装 Package Control

在 Sublime Text 中：

    Ctrl + Shift + P

输入：

    Package Control: Install Package

如果能看到该命令，说明 Package Control 正常。

如果没有该命令，请先安装 Package Control：

    Tools → Developer → Install Package Control

------------------------------------------------------------------------

## 2. 通过 Package Control 安装 Terminus

在命令面板执行：

    Ctrl + Shift + P
    Package Control: Install Package

搜索：

    Terminus

点击安装即可。

------------------------------------------------------------------------

# 三、手动安装 Terminus（适用于搜索不到插件的情况）

如果在 Package Control 中搜不到 Terminus，可以手动安装。

## 1. 打开 Packages 目录

    Preferences → Browse Packages

会打开目录：

    ~/.config/sublime-text/Packages

## 2. 使用 git 克隆插件

``` bash
cd ~/.config/sublime-text/Packages
git clone https://github.com/randy3k/Terminus.git
```

完成后重启 Sublime Text。

------------------------------------------------------------------------

# 四、为何需要重启 Sublime Text？

Terminus 插件依赖以下 Python 库：

-   wcwidth
-   ptyprocess
-   pyte

首次加载插件时，可能会出现类似错误：

    ModuleNotFoundError: No module named 'wcwidth'

这是因为：

1.  Terminus 插件先被加载
2.  发现缺少依赖
3.  报错
4.  Package Control 才开始自动安装依赖

因此：

⚠ 插件第一次加载可能失败\
⚠ 依赖安装完成后必须完全重启 Sublime Text 才能正常加载插件

------------------------------------------------------------------------

# 五、如何验证安装成功？

重启 Sublime 后：

    Ctrl + Shift + P

输入：

    Terminus:

如果看到以下命令，说明安装成功：

-   Terminus: Open Default Shell in Panel
-   Terminus: Toggle Panel

------------------------------------------------------------------------

# 六、推荐配置（使用 zsh）

打开：

    Preferences → Package Settings → Terminus → Settings

用户配置示例：

``` json
{
    "shell_configs": [
        {
            "name": "zsh",
            "cmd": ["/bin/zsh"],
            "enable": true
        }
    ],
    "default_config": "zsh"
}
```

自定义快捷键:

Preferences -> Key Bindings

添加用户配置:

```
    {
            "keys": ["ctrl+`"],
            "caption": "Terminus: Toggle Panel",
            "command": "toggle_terminus_panel",
            "args": {"hide_active": true}
    }

```

------------------------------------------------------------------------

# 七、进阶配置（自动进入 tmux）

``` json
{
    "shell_configs": [
        {
            "name": "zsh-tmux",
            "cmd": ["/bin/zsh", "-l", "-c", "tmux attach || tmux new"],
            "enable": true
        }
    ],
    "default_config": "zsh-tmux"
}
```

------------------------------------------------------------------------

# 八、常见问题总结

  问题              原因                     解决方案
  ----------------- ------------------------ ---------------------
  搜不到 Terminus   Package Control 源异常   手动 git 安装
  有插件但无命令    依赖未加载               完全重启 Sublime
  报 wcwidth 错误   Python 依赖未安装        等待自动安装 + 重启
  快捷键无效        系统快捷键冲突           修改 Sublime 快捷键

------------------------------------------------------------------------

# 九、总结

在 Linux 下安装 Terminus 的核心要点：

1.  优先使用 Package Control 安装
2.  搜不到时使用 git 手动安装
3.  出现依赖错误必须完全重启
4.  重启后验证命令是否出现

完成以上步骤，即可正常使用 Sublime 嵌入式终端。

---
title: "Sublime Text 自定义快捷键配置"
date: "2026-03-14"
source: "个人笔记整理"
url: ""
---

# Sublime Text 自定义快捷键配置

下面是一份可直接粘贴使用的 `Key Bindings - User` 配置。设置步骤见
[Sublime Text 最佳实践](/md/guide/dev/sublimetext/sublime-best-practices)，
嵌入式终端 Terminus 的安装与排错见
[Terminus 安装与排错完整指南](/md/guide/dev/sublimetext/Sublime%20Text%20嵌入式终端%20Terminus%20安装与排错完整指南)。

```json
[
    // 侧边栏显示/隐藏
    { "keys": ["alt+1", "alt+1"], "command": "toggle_side_bar" },
    // outline 跳转到当前文件的某个方法
    { "keys": ["ctrl+o"], "command": "show_overlay", "args": {"overlay": "goto", "text": "@"} },
    { "keys": ["ctrl+t"], "command": "goto_definition" },
    // 跳转到某行
    { "keys": ["ctrl+l"], "command": "show_overlay", "args": {"overlay": "goto", "text": ":"} },
    { "keys": ["ctrl+h"], "command": "show_panel", "args": {"panel": "find_in_files"} },
    // 跳转到上一个编辑地方
    { "keys": ["alt+left"], "command": "jump_back" },
    // 跳转到下一个编辑地方
    { "keys": ["alt+right"], "command": "jump_forward" },
    { "keys": ["ctrl+g"], "command": "goto_reference" },
    // 删除整行
    { "keys": ["ctrl+d"], "command": "run_macro_file", "args": {"file": "Packages/Default/Delete Line.sublime-macro"} },
    // 整行下移
    { "keys": ["alt+down"], "command": "swap_line_down" },
    // 整行上移
    { "keys": ["alt+up"], "command": "swap_line_up" },
    // 复制当前行到上一行
    { "keys": ["ctrl+alt+up"], "command": "duplicate_line" },
    // 复制当前行到下一行
    { "keys": ["ctrl+alt+down"], "command": "duplicate_line" },
    // 自动提示
    { "keys": ["alt+/"], "command": "auto_complete" },
    // 转换大写
    { "keys": ["ctrl+shift+x"], "command": "upper_case" },
    // 转换小写
    { "keys": ["ctrl+shift+y"], "command": "lower_case" },
    // 快速定位到选中的文字
    { "keys": ["ctrl+k"], "command": "find_under_expand_skip" },
    // 当前文件中的关键字(方便快速查找内容)
    { "keys": ["ctrl+alt+o"], "command": "show_overlay", "args": {"overlay": "goto", "text": "#"} },
    // open resource, 保留sublime的, eclipse的快捷键是 ctrl+shift+r
    { "keys": ["ctrl+p"], "command": "show_overlay", "args": {"overlay": "goto", "show_files": true} },
    // 在当前行的下一行插入空行(这时鼠标可以在当前行的任一位置, 不一定是最后)
    { "keys": ["shift+enter"], "command": "run_macro_file", "args": {"file": "Packages/Default/Add Line.sublime-macro"} },
    // 把下一行的内容合并到当前行
    { "keys": ["ctrl+alt+j"], "command": "join_lines" },
    // 终端, 需要安装 Terminus 插件
    {
        "keys": ["ctrl+alt+\\"],
        "command": "terminus_open",
        "args": {
            // 按本机 shell 路径填写，不要硬编码绝对路径
            "cwd": "${file_path:${folder}}",
            "panel_name": "Terminus"
        }
    },
    {
        "keys": ["ctrl+`"],
        "caption": "Terminus: Toggle Panel",
        "command": "toggle_terminus_panel",
        "args": {"hide_active": true}
    },
    { "keys": ["ctrl+shift+h"], "command": "show_panel", "args": {"panel": "replace", "reverse": false} },
    // sublime默认 ctrl+0 , reveal in sidebar, 侧边栏打开当前文件所在的文件夹目录
    { "keys": ["ctrl+0"], "command": "focus_side_bar" }
]
```

**参考链接:**

- [boolean111000/Base File.sublime-settings](https://gist.github.com/boolean111000/1325c6e284505948bed041a240fe5f70)
- [sublime text3 快捷键修改为 eclipse_sublime](https://blog.csdn.net/qq575792372/article/details/89739696)


# Sublime Text 自定义快捷键


```
[
        { "keys": ["alt+1", "alt+1"], "command": "toggle_side_bar" },
        { "keys": ["ctrl+p"], "command": "show_overlay", "args": {"overlay": "goto", "show_files": true} },
        { "keys": ["ctrl+o"], "command": "goto_symbol_in_project" },
        { "keys": ["ctrl+t"], "command": "goto_definition" },
        { "keys": ["ctrl+l"], "command": "show_overlay", "args": {"overlay": "goto", "text": ":"} },
        { "keys": ["ctrl+h"], "command": "show_panel", "args": {"panel": "find_in_files"} },
        { "keys": ["alt+left"], "command": "jump_back" },
        { "keys": ["alt+right"], "command": "jump_forward" },
        { "keys": ["ctrl+g"], "command": "goto_reference" },
        { "keys": ["alt+1", "alt+1"], "command": "toggle_side_bar" },
        { "keys": ["ctrl+p"], "command": "show_overlay", "args": {"overlay": "goto", "show_files": true} },
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
        // 终端   需要安装Terminus插件
        {
               "keys": ["ctrl+alt+\\"],
               "command": "terminus_open",
               "args" : {
                   //"cmd": "D:/software/git/Git/bin/bash.exe",
                   "cwd": "${file_path:${folder}}",
                   "panel_name": "Terminus"
               },

        },
       {
            "keys": ["ctrl+`"],
            "caption": "Terminus: Toggle Panel",
            "command": "toggle_terminus_panel",
            "args": {"hide_active": true}
        },
        { "keys": ["ctrl+shift+h"], "command": "show_panel", "args": {"panel": "replace", "reverse": false} },
        // sublime默认 ctrl+0 , reveal in sidebar, 侧边栏打开当前文件所在的文件夹目录
        { "keys": ["ctrl+0"], "command": "focus_side_bar" },
  
]


```
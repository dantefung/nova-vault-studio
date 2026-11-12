---
title: "Sublime Text 最佳实践：快捷键、插件与使用技巧"
date: "2026-02-28"
source: "个人笔记整理"
url: ""
---

# Sublime Text 最佳实践：快捷键、插件与使用技巧

这篇记的是插件与使用技巧。两块相邻内容单独成篇，不在这里重复：

- 完整的 `Key Bindings - User` 配置见 [Sublime Text 自定义快捷键配置](/md/guide/dev/sublimetext/Sublime%20Text%20自定义快捷键)
- 嵌入式终端 Terminus 的安装与排错见 [Terminus 安装与排错完整指南](/md/guide/dev/sublimetext/Sublime%20Text%20嵌入式终端%20Terminus%20安装与排错完整指南)

## 如何设置 Sublime Text 的快捷键

Sublime Text 是一款强大的代码编辑器，它可以通过自定义快捷键来提高工作效率。设置快捷键的方法如下：

步骤 1：打开快捷键设置文件

Windows：Preferences -> Key Bindings - User
macOS：Sublime Text -> Preferences -> Key Bindings - User
Linux：Preferences -> Key Bindings - User
步骤 2：编辑快捷键设置

Key Bindings - User 文件包含了所有当前的快捷键设置。要设置一个新快捷键，请添加以下格式的代码：

{ "keys": ["ctrl+shift+a"], "command": "show_panel" }
keys：要按下的键组合，用方括号括起。
command：要执行的命令。
例如，要将 ctrl+shift+a 设置为显示侧边栏，您将添加以下代码：

{ "keys": ["ctrl+shift+a"], "command": "show_side_bar" }
步骤 3：保存更改

在完成编辑后，保存 Key Bindings - User 文件。

步骤 4：重新加载快捷键

为了使更改生效，您需要重新加载快捷键设置。

Windows：Preferences -> Reload Keymap
macOS：Sublime Text -> Preferences -> Reload Keymap
Linux：Preferences -> Reload Keymap
现在，您自定义的快捷键将可用。

可直接使用的完整配置见 [Sublime Text 自定义快捷键配置](/md/guide/dev/sublimetext/Sublime%20Text%20自定义快捷键)。

## 插件推荐

"SideBarEnhancements", #这个是好东西,英文翻译为加强侧边栏,安装之后我们的侧边栏文件管理多了很多的功能,还有右键里面

## Origami

Origami 提供了多个实用的功能，包括但不限于：

多窗口布局管理 - 可以快速创建多行或多列的分割视图。
代码折叠插件 - 支持更灵活的代码折叠方式，可自定义折叠范围。
文件预览 - 在不打开新窗口的情况下预览文件内容。
命令面板增强 - 增强 Sublime Text 的原生命令面板，提供更多选项。
搜索历史 - 保存并访问您的搜索历史记录

## Compare Side-By-Side

Sublime Text中的Compare Side-By-Side插件是一个用于文件内容比对的工具。

**安装步骤**

打开Sublime Text，按下快捷键Ctrl+Shift+P打开命令面板。
输入install package并选择它。
在弹出的界面中输入compare，选择`Compare Side-By-Side进`行安装。
安装完成后，可以在文件标签处右键选择要比较的文件，比对结果会以新窗口显示。

**使用方法**

1. 在需要对比的文件上右键，选择Compare with，然后选择另一个要对比的文件。
比对完成后，会弹出一个窗口显示比对结果。用户可以通过这个窗口查看两个文件的差异。

2. 同理, 新建两个未保存的文件, 把内容分别粘贴到这两个文件去, 然后在未保存的文件的上右键, 选择需要对比的未保存的文件即可.

## Sublime Merge

### 下载地址

https://www.sublimemerge.com/download_thanks?target=win-x64


### 安装

安装到你指定的目录下


### 配置

菜单栏选择:

Preferences ->  Settings

```
{
	"font_size": 10,
	"ignored_packages":
	[
		"Vintage",
	],
	"index_files": true,
	"sublime_merge_path": "D:/software/Sublime Merge/Sublime Merge/smerge.exe"
}
```

`sublime_merge_path` 需按本机实际安装路径填写。

## 使用技巧

1. sublime text3 技巧 多行一起操作 类似于eclipse的alt+shift+a

按住 ctrl-》鼠标点击其他行 -> 同时编辑多行，一次向多行插入或删除相同文本


 /**
     * 常用快捷键(Sublime默认)
     * --------------
     *
     * 光标一个单词一个单词的移动
     * { "keys": ["ctrl+left"], "command": "move", "args": {"by": "words", "forward": false} },
     * 按住shift来选文字时, 一个个单词的选而不是一个个字母
     * { "keys": ["ctrl+shift+left"], "command": "move", "args": {"by": "words", "forward": false, "extend": true} },
     *
     * 类似光标一个个单词的移动
     * { "keys": ["alt+left"], "command": "move", "args": {"by": "subwords", "forward": false} },
     * { "keys": ["alt+shift+right"], "command": "move", "args": {"by": "subword_ends", "forward": true, "extend": true} },
     *
     * 缩进
     * { "keys": ["ctrl+]"], "command": "indent" },
     * { "keys": ["ctrl+["], "command": "unindent" },
     *
     * 删除整个单词
     * { "keys": ["ctrl+backspace"], "command": "delete_word", "args": { "forward": false } },
     * { "keys": ["ctrl+delete"], "command": "delete_word", "args": { "forward": true } },
     *
     * 行排序(例如选中几个JSON字段, 让这些字段名按字母顺序排序)
     * { "keys": ["f9"], "command": "sort_lines", "args": {"case_sensitive": false} },
     *
     * 参考
     * ----------------------
     * Using Sublime Text as your IDE
     * http://www.chromium.org/developers/sublime-text
     *
     * Web Development With Sublime Text 2
     * http://www.paulund.co.uk/web-development-with-sublime-text-2
     */

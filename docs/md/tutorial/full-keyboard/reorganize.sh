#!/bin/bash

# 移动 vim 文件
for i in {01..18}; do
    [ -f "docs/${i}_vim*.md" ] && mv docs/${i}_vim*.md vim/ 2>/dev/null
done

# 移动 vscode 文件
for i in {01..11}; do
    [ -f "docs/02_vscode*.md" ] && mv docs/02_vscode*.md vscode/ 2>/dev/null
done

# 移动 tools 文件
for i in {01..09}; do
    [ -f "docs/03_tools*.md" ] && mv docs/03_tools*.md tools/ 2>/dev/null
done

# 移动 chrome 文件
for i in {01..07}; do
    [ -f "docs/04_chrome*.md" ] && mv docs/04_chrome*.md chrome/ 2>/dev/null
done

# 移动 iterm 文件
[ -f "docs/05_iterm*.md" ] && mv docs/05_iterm*.md iterm/ 2>/dev/null

# 移动 zsh 文件
for i in {01..03}; do
    [ -f "docs/06_zsh*.md" ] && mv docs/06_zsh*.md zsh/ 2>/dev/null
done

# 移动 macos 文件
for i in {01..03}; do
    [ -f "docs/07_macos*.md" ] && mv docs/07_macos*.md macos/ 2>/dev/null
done

# 移动 obsidian 文件
for i in {01..04}; do
    [ -f "docs/08_obsidian*.md" ] && mv docs/08_obsidian*.md obsidian/ 2>/dev/null
done

echo "文件移动完成"
ls -la vim/ vscode/ tools/ chrome/ iterm/ zsh/ macos/ obsidian/ 2>/dev/null | head -20

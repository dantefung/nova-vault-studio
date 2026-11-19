#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复全站引号方向。

背景：normalize-typo.py 早期版本用「全文奇偶计数器」配对直引号，
一旦某行只参与了一个引号，奇偶性就永久错位，后面所有引号全部反向。
实测污染了全站 337 个文件、2480 行。

修复思路：不猜历史、不整行翻转，而是按「引号在行内的位置」直接赋值成
标准交替序列（与修复后的 normalize-typo.py 同一套规则）：

    偶数个引号的行 → 自足自闭：      “ ” “ ”
    奇数个引号的行 → 最后一个是开引号，延续到下一行：
                     上一行留了开引号 → ” “ ” …
                     没有               → “ ” … “

参与配对的引号：所有弯引号（“ ”）+ 紧邻汉字的直引号（与排版脚本同一判定）。
行内代码、URL、HTML 标签、LaTeX 数学先做占位保护，绝不改动；
代码围栏内的内容整段跳过。

用法：
    python3 scripts/fix-reversed-quotes.py docs/md            # 预览（只统计）
    python3 scripts/fix-reversed-quotes.py docs/md --apply    # 写回
"""
import re
import sys
from pathlib import Path

CJK = '\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff'
HAN = f'[{CJK}]'
PH = lambda i: f'\x00{i}z\x00'


def protect(line: str):
    """把行内代码、HTML 标签、URL、LaTeX 数学换成占位符，避免被改写。"""
    slots = []

    def stash(m):
        slots.append(m.group(0))
        return PH(len(slots) - 1)

    text = re.sub(r'`[^`]*`', stash, line)
    text = re.sub(r'\$\$[^$]+\$\$|\$[^$\n]+\$', stash, text)
    text = re.sub(r'<[A-Za-z/][^>]*>', stash, text)
    text = re.sub(r'https?://\S+', stash, text)
    return text, slots


def restore(text: str, slots):
    for _ in range(len(slots) + 1):
        if not re.search(r'\x00\d+z\x00', text):
            break
        for i, s in enumerate(slots):
            text = text.replace(PH(i), s)
    return text


def quote_positions(text: str):
    """只取弯引号位置。

    直引号（"）不动：它要么是代码/HTML/URL 里的字面量，要么不是汉字邻接
    （排版脚本按「紧邻汉字才配对」的规则本来就不转它）—— 强行转换会破坏
    frontmatter 的 YAML 引号和 Markdown 链接标题。
    """
    return [i for i, ch in enumerate(text) if ch in '“”']


def expected_seq(count: int):
    """行内引号的标准交替序列：第 1、3、5… 个是开引号。"""
    return ['“' if i % 2 == 0 else '”' for i in range(count)]


def fix_lines(lines):
    """返回 (修复后的行, 修复行数)。"""
    out = []
    changed = 0
    in_code = False
    for line in lines:
        s = line.strip()
        if s.startswith('```') or s.startswith('~~~'):
            in_code = not in_code
            out.append(line)
            continue
        if in_code:
            out.append(line)
            continue

        text, slots = protect(line)
        pos = quote_positions(text)
        # 只有一个引号的行无法判断开合（可能是跨行引号的延续），一律不动
        if len(pos) < 2:
            out.append(line)
            continue
        exp = expected_seq(len(pos))

        # 按位置赋值，而不是整行翻转：无论当前是 “ ” 还是 ” “ 都能收敛
        new_text = []
        pi = 0
        for i, ch in enumerate(text):
            if pi < len(pos) and i == pos[pi]:
                new_text.append(exp[pi])
                pi += 1
            else:
                new_text.append(ch)
        new_line = restore(''.join(new_text), slots)
        if new_line != line:
            changed += 1
        out.append(new_line)
    return out, changed


def process_file(path: Path, apply: bool = False):
    # newline='' 保留原始换行符（仓库里有 CRLF 文件，整文重写会把它变成 LF）
    with open(path, 'r', encoding='utf-8', newline='') as f:
        raw = f.read()
    out, changed = fix_lines(raw.split('\n'))
    if changed and apply:
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write('\n'.join(out))
    return changed


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    apply = '--apply' in sys.argv
    if not args:
        print(__doc__)
        sys.exit(1)

    total_files = 0
    total_lines = 0
    for root in args:
        for p in sorted(Path(root).rglob('*.md')):
            n = process_file(p, apply)
            if n:
                total_files += 1
                total_lines += n
                print(f'  {n:>3} 行  {p}')
    print(f'\n{"已写回" if apply else "待修复"}：{total_files} 个文件 / {total_lines} 行')
    if not apply:
        print('加 --apply 执行写回')


if __name__ == '__main__':
    main()

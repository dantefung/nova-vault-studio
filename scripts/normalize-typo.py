#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""中文排版规范化：盘古之白 + 全角标点 + 配对引号。

规则：
1. 盘古之白：汉字与英文/数字之间加半角空格（全角标点不算汉字）。
2. 全角标点：中文语境中的 , ; : ? ! 转为全角。
3. 配对引号：跨行成对的 " 转为中文弯引号 “ ”，' 统一为 ’。
4. 跳过 frontmatter、围栏代码块、行内代码、URL。

用法：
    python3 scripts/normalize-typo.py <file.md> [...]          # 预览
    python3 scripts/normalize-typo.py <file.md> [...] --apply  # 写回
"""
import re
import sys
from pathlib import Path

# 只取汉字（含扩展 A 与兼容表意文字），不含全角标点区
CJK = '\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff'
HAN = f'[{CJK}]'


def protect(line: str):
    """把行内代码与 URL 换成占位符，避免被改写。"""
    slots = []

    def stash(m):
        slots.append(m.group(0))
        return f'\x00{len(slots) - 1}\x00'

    text = re.sub(r'`[^`]*`', stash, line)
    text = re.sub(r'https?://\S+', stash, text)
    return text, slots


def restore(text: str, slots):
    for i, s in enumerate(slots):
        text = text.replace(f'\x00{i}\x00', s)
    return text


def fullwidth_punct(text: str) -> str:
    """中文语境中的半角 , ; : ? ! 转全角；纯英文上下文保持半角。"""
    mapping = {',': '，', ';': '；', ':': '：', '?': '？', '!': '！'}
    out = []
    for i, ch in enumerate(text):
        if ch in mapping:
            prev = text[i - 1] if i > 0 else ''
            nxt = text[i + 1] if i + 1 < len(text) else ''
            if re.match(HAN, prev) or re.match(HAN, nxt):
                out.append(mapping[ch])
            else:
                out.append(ch)
        else:
            out.append(ch)
    return ''.join(out)


def pangu(text: str) -> str:
    """汉字与英文/数字之间补半角空格；保留行首缩进（Markdown 列表续行依赖它）。"""
    m = re.match(r'^(\s*)', text)
    indent = m.group(1)
    rest = text[len(indent):]
    rest = re.sub(f'(?<={HAN})(?=[A-Za-z0-9])', ' ', rest)
    rest = re.sub(f'(?<=[A-Za-z0-9])(?={HAN})', ' ', rest)
    rest = re.sub(r'(?<! ) {2,}(?! )', ' ', rest)
    return indent + rest


def process(path: Path, apply: bool = False):
    raw = path.read_text(encoding='utf-8')
    lines = raw.split('\n')

    # 1) 保护代码与 URL，逐行做标点与盘古之白
    prepared = []
    in_fm = False
    in_code = False
    for i, line in enumerate(lines):
        s = line.strip()
        if i == 0 and s == '---':
            in_fm = True
            prepared.append((line, None))
            continue
        if in_fm:
            prepared.append((line, None))
            if s == '---':
                in_fm = False
            continue
        if s.startswith('```') or s.startswith('~~~'):
            in_code = not in_code
            prepared.append((line, None))
            continue
        if in_code:
            prepared.append((line, None))
            continue
        text, slots = protect(line)
        text = fullwidth_punct(text)
        text = pangu(text)
        prepared.append((line, restore(text, slots)))

    # 2) 跨行配对引号
    dq = 0
    out = []
    for orig, text in prepared:
        if text is None:
            out.append(orig)
            continue
        buf = []
        for ch in text:
            if ch == '"':
                buf.append('“' if dq % 2 == 0 else '”')
                dq += 1
            elif ch == "'":
                buf.append('’')
            else:
                buf.append(ch)
        out.append(''.join(buf))

    new_text = '\n'.join(out)
    changes = sum(1 for a, b in zip(lines, out) if a != b)
    if apply and new_text != raw:
        path.write_text(new_text, encoding='utf-8')
    return changes


def main():
    args = sys.argv[1:]
    apply = '--apply' in args
    files = [a for a in args if not a.startswith('--')]
    if not files:
        print(__doc__)
        sys.exit(1)
    for f in files:
        p = Path(f)
        if not p.exists():
            print(f'SKIP {f} (不存在)')
            continue
        n = process(p, apply)
        print(f'{p.name}: {n} 行修改' + (' (已写入)' if apply else ' (预览)'))


if __name__ == '__main__':
    main()

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
    # 先保护 HTML 标签，再保护 URL：
    # 若先处理 URL，<a href="https://x"> 里的 URL 会把后面的 ">文本</a> 一起吞掉，
    # 留下一个裸 " 被配对引号改坏。先保护整段标签即可避免。
    text = re.sub(r'<[A-Za-z/][^>]*>', stash, text)
    text = re.sub(r'https?://\S+', stash, text)
    return text, slots


def restore(text: str, slots):
    # 多次遍历直到没有占位符：HTML 标签内可能嵌着 URL/代码占位符（嵌套占位），
    # 单次正序遍历会把外层还原后带出的内层占位符留在结果里，最终变成 NUL 字节。
    for _ in range(len(slots) + 1):
        if not re.search(r'\x00\d+\x00', text):
            break
        for i, s in enumerate(slots):
            text = text.replace(f'\x00{i}\x00', s)
    return text


def fullwidth_punct(text: str) -> str:
    """中文语境中的半角 , ; : ? ! 转全角；纯英文上下文保持半角。

    半角标点常写作 ", "（逗号后带空格），转全角后空格须一并去掉，
    否则会留下 "， "（全角标点后带空格），违反「全角标点与其他字符之间不加空格」。
    """
    mapping = {',': '，', ';': '；', ':': '：', '?': '？', '!': '！'}
    out = []
    i = 0
    while i < len(text):
        ch = text[i]
        if ch in mapping:
            prev = text[i - 1] if i > 0 else ''
            nxt = text[i + 1] if i + 1 < len(text) else ''
            if re.match(HAN, prev) or re.match(HAN, nxt):
                out.append(mapping[ch])
                # 吞掉紧跟的一个半角空格（"， " -> "，"）
                if i + 1 < len(text) and text[i + 1] == ' ':
                    i += 1
            else:
                out.append(ch)
        else:
            out.append(ch)
        i += 1
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

    # 1) 保护代码与 URL，逐行做标点与盘古之白。
    #    关键：行内代码/URL 在整个变换期间都保持占位符状态，直到最后一步才还原，
    #    否则步骤 2 的配对引号会篡改代码里的直引号（如 JSON 的 "、"HTML 属性的 "）。
    prepared = []
    in_fm = False
    in_code = False
    for i, line in enumerate(lines):
        s = line.strip()
        if i == 0 and s == '---':
            in_fm = True
            prepared.append((line, None, None))
            continue
        if in_fm:
            prepared.append((line, None, None))
            if s == '---':
                in_fm = False
            continue
        if s.startswith('```') or s.startswith('~~~'):
            in_code = not in_code
            prepared.append((line, None, None))
            continue
        if in_code:
            prepared.append((line, None, None))
            continue
        text, slots = protect(line)
        text = fullwidth_punct(text)
        text = pangu(text)
        prepared.append((line, text, slots))

    # 2) 跨行配对引号（此时代码/URL 仍是占位符，不会被误改）。
    #    安全护栏：只有紧邻汉字的直引号才参与配对（中文文案的引号）。
    #    代码里的字符串字面量（如 {"role": "user"}）两侧都是 ASCII 标点/字母，
    #    永不触发 —— 即使围栏计数在某篇长文里漂移、代码块被误判为正文也不会坏。
    dq = 0
    out = []
    for orig, text, slots in prepared:
        if text is None:
            out.append(orig)
            continue
        buf = []
        for pos, ch in enumerate(text):
            if ch == '"':
                prev_is_han = pos > 0 and re.match(HAN, text[pos - 1])
                next_is_han = pos + 1 < len(text) and re.match(HAN, text[pos + 1])
                if prev_is_han or next_is_han:
                    buf.append('“' if dq % 2 == 0 else '”')
                    dq += 1
                else:
                    buf.append(ch)
            elif ch == "'":
                prev_is_han = pos > 0 and re.match(HAN, text[pos - 1])
                next_is_han = pos + 1 < len(text) and re.match(HAN, text[pos + 1])
                buf.append('’' if (prev_is_han or next_is_han) else ch)
            else:
                buf.append(ch)
        # 最后一步才还原被保护的行内代码与 URL
        out.append(restore(''.join(buf), slots))

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

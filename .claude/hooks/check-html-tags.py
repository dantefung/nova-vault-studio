#!/usr/bin/env python3
"""Pre-commit hook: reject .md files with bare HTML tags that would break Vue compiler.

背景：VitePress 会把 Markdown 编译成 Vue SFC，正文里裸写的 HTML 标签会被
Vue 模板编译器当成真实元素解析。未闭合或带非法属性的标签会直接让
`vitepress build` 抛 "Element is missing end tag" 而中断生产构建。

检查规则（刻意收窄，避免误报）：
  1. 永远危险的标签（style / text / svg / iframe / template …）：裸写即报错。
  2. script：只允许 <script setup> 与 </script>（VitePress SFC 用法）。
  3. 未配对闭合的容器标签（div / span / i）：文件内找不到对应闭标签即报错。
  3b. 未知标签（不在 KNOWN_TAGS 内的自定义标签，如 <project>）：开标签未自闭合
      且全文找不到对应闭标签即报错——Vue 会把它当真实元素并抛
      "Element is missing end tag"。
  4. HTML 属性用了中文引号（class=“…”）：Vue 属性解析会出错，报错。
  5. Markdown 自动链接（<https://…> / <http://…> / <mailto:…>）与 `<数字` 等
     非标签形态一律放行。
"""

import re
import os
import sys
import subprocess

INLINE_CODE_RE = re.compile(r'`[^`]*`')
BROWSER_EXT_RE = re.compile(r'<readpronunciation-\w+[^>]*?>')
# 只匹配真正的标签：< 后面必须紧跟字母，且标签名后必须是空白 / > / / 结束。
# 少了这条边界，<urn：example：>、<a|b>、<key: value> 这类会被 markdown-it
# 转义成普通文本（不破坏构建）却仍被误判。
HTML_TAG_RE = re.compile(r'</?([A-Za-z][A-Za-z0-9-]*)(?=[\s/>])[^>]*>')
# Markdown 自动链接，不是标签
AUTOLINK_RE = re.compile(r'<(https?://|mailto:)[^>]*>')
# 属性里用了中文引号，Vue 解析属性会出错
CURLY_ATTR_RE = re.compile(r'<[A-Za-z][A-Za-z0-9-]*(?=[\s/>])[^>]*=[“”][^>]*>')
# script 只允许 <script setup> / </script>
SCRIPT_SETUP_RE = re.compile(r'</?script(\s+setup)?\s*/?>')
# 围栏代码块起始行（``` 或 ~~~）
FENCE_OPEN_RE = re.compile(r'^\s*(```+|~~~+)')

BROWSER_EXT = 'browser-ext'
UNSAFE_TAG = 'unsafe-tag'
UNPAIRED_TAG = 'unpaired-tag'
CURLY_ATTR = 'curly-quote-attr'
UNKNOWN_TAG = 'unknown-tag'

# 这些标签即使写全了也不能裸写在正文里：Vue 会当成真实元素解析并破坏 SFC 编译。
UNSAFE_TAGS = {'style', 'text', 'svg', 'iframe', 'template', 'marquee', 'blink'}
# 这些标签必须配对闭合，否则 Vue 报 "Element is missing end tag"
NEEDS_CLOSING = {'div', 'span', 'i'}
# 合法的 HTML 标签（用于提示，不阻断）
KNOWN_TAGS = {
    'PdfViewer', 'HtmlViewer', 'PdfList', 'NavList', 'Badge',
    'details', 'summary', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'br', 'hr', 'p', 'ul', 'ol', 'li', 'a', 'b', 'strong', 'em',
    'pre', 'code', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'colgroup', 'col', 'video', 'source', 'script', 'div', 'span', 'i',
}


def _strip_code(content):
    """剔除围栏代码块与行内代码，只留下真正会被 Vue 解析的正文。

    必须逐行跟踪围栏状态：正则整体替换 ```...``` 会在围栏数量为奇数或
    嵌套了反引号时错位配对，把代码块内容当成正文，导致 `<leader>` 这类
    正常写法被误报。
    """
    out = []
    fence = None
    for line in content.split('\n'):
        m = FENCE_OPEN_RE.match(line)
        if fence is None:
            if m:
                fence = m.group(1)[0] * 3
                continue
            out.append(INLINE_CODE_RE.sub('', line))
        else:
            # 围栏内：只有同字符的结束围栏才退出
            stripped = line.strip()
            if stripped.startswith(fence):
                fence = None
    return '\n'.join(out)


def _is_unpaired(tag, raw, content):
    """开标签在全文找不到对应闭标签 → Vue 会报 Element is missing end tag。"""
    if raw.startswith('</') or raw.endswith('/>'):
        return False
    if tag not in NEEDS_CLOSING and tag in KNOWN_TAGS:
        return False
    return f'</{tag}>' not in content


def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # frontmatter 不参与 Vue 模板编译，先剥离
    body = content
    if body.startswith('---'):
        parts = body.split('\n---\n', 1)
        if len(parts) == 2:
            body = parts[1]

    stripped = _strip_code(body)
    # 自动链接不是标签，先剔除避免误报
    stripped = AUTOLINK_RE.sub('', stripped)

    errors = []
    for match in BROWSER_EXT_RE.finditer(stripped):
        errors.append((filepath, match, BROWSER_EXT))

    for match in CURLY_ATTR_RE.finditer(stripped):
        errors.append((filepath, match, CURLY_ATTR))

    for match in HTML_TAG_RE.finditer(stripped):
        tag = match.group(1)
        raw = match.group(0)
        if tag in UNSAFE_TAGS:
            errors.append((filepath, match, f'{UNSAFE_TAG}:{tag}'))
        elif tag == 'script':
            if not SCRIPT_SETUP_RE.fullmatch(raw):
                errors.append((filepath, match, f'{UNSAFE_TAG}:script'))
        elif _is_unpaired(tag, raw, content):
            errors.append((filepath, match, f'{UNPAIRED_TAG}:{tag}'))

    return errors


def _target_files(argv):
    """显式传入路径则校验这些文件；否则校验 git 已暂存的 .md 文件。

    历史实现只认暂存区，导致「手动传路径校验」时实际空跑（假通过），
    裸标签因此绕过检查，直到 Vercel 生产构建才暴露。
    """
    explicit = [a for a in argv if a.endswith('.md')]
    if explicit:
        # 允许传入绝对路径，统一转成相对仓库根的路径
        root = subprocess.run(
            ['git', 'rev-parse', '--show-toplevel'],
            capture_output=True, text=True
        ).stdout.strip()
        normalized = []
        for a in explicit:
            if root and a.startswith(root + os.sep):
                a = a[len(root) + 1:]
            normalized.append(a.replace(os.sep, '/'))
        return normalized

    result = subprocess.run(
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
        capture_output=True, text=True
    )
    return [fp for fp in result.stdout.splitlines() if fp.endswith('.md')]


def main():
    all_errors = []
    for fp in _target_files(sys.argv[1:]):
        if not fp.startswith('docs/md/'):
            continue
        try:
            all_errors.extend(check_file(fp))
        except FileNotFoundError:
            continue

    if all_errors:
        for fp, match, kind in all_errors:
            print(f'{fp}: {kind} - `{match.group()}`')
        print("\nUse backticks or code blocks to wrap HTML tags in prose.")
        sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    main()

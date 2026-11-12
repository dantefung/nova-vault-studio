#!/usr/bin/env python3
"""
Pre-commit hook: reject .md files with un-fenced {{ }} that break the Vue compiler.

VitePress compiles Markdown into a Vue SFC. Any `{{` outside a fenced code block
or inline code span is parsed as a Vue interpolation and crashes the build with
"Interpolation end sign was not found" (or a JS expression parse error).

Typical source: ingested articles whose code fences were stripped, leaving raw
code such as `= {{.procname = ...}}` as prose.

Usage:
  check-vue-interpolation.py [file.md ...]   # no args: self-detect staged files
"""

import re
import sys
import subprocess

FENCE_RE = re.compile(r'^ {0,3}(`{3,}|~{3,})(.*)$')
INLINE_CODE_RE = re.compile(r'`[^`]*`')
INTERP_RE = re.compile(r'\{\{')
DOCS_PREFIX = 'docs/md/'


def strip_code(content):
    """Blank out fenced code blocks and inline code, preserving line count."""
    out = []
    open_char = None
    open_len = 0
    for line in content.split('\n'):
        m = FENCE_RE.match(line)
        if m:
            char = m.group(1)[0]
            length = len(m.group(1))
            if open_char is None:
                open_char, open_len = char, length
            elif char == open_char and length >= open_len and m.group(2).strip() == '':
                open_char = None
            out.append('')
            continue
        out.append('' if open_char is not None else INLINE_CODE_RE.sub('', line))
    return '\n'.join(out)


def staged_files():
    result = subprocess.run(
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
        capture_output=True, text=True,
    )
    return [f for f in result.stdout.splitlines() if f.endswith('.md') and f.startswith(DOCS_PREFIX)]


def main():
    files = sys.argv[1:] or staged_files()
    files = [f for f in files if f.endswith('.md') and f.startswith(DOCS_PREFIX)]

    errors = []
    for fp in files:
        try:
            with open(fp, 'r', encoding='utf-8') as fh:
                content = fh.read()
        except FileNotFoundError:
            continue
        stripped = strip_code(content)
        for match in INTERP_RE.finditer(stripped):
            line_no = stripped.count('\n', 0, match.start()) + 1
            errors.append((fp, line_no))

    if errors:
        for fp, line_no in errors:
            print(f"{fp}:{line_no}: 未转义的 {{{{ —— Vue 会当作插值，构建会失败")
        print("\nFix: wrap the code in a ``` fenced block, or escape braces as &#123;&#123; / &#125;&#125;.")
        sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    main()

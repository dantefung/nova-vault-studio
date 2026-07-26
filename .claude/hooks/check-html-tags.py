#!/usr/bin/env python3
"""Pre-commit hook: reject .md files with bare HTML tags that would break Vue compiler."""

import re
import sys
import subprocess

INLINE_CODE_RE = re.compile(r'`[^`]*`')
FENCED_CODE_RE = re.compile(r'```[\s\S]*?```')
HTML_TAG_RE = re.compile(r'</?(\w+)[^>]*?>')
BROWSER_EXT_RE = re.compile(r'<readpronunciation-\w+[^>]*?>')
# Tags that are actually Vue/VitePress components or valid HTML in markdown
ALLOWED_TAGS = {
    'PdfViewer', 'HtmlViewer', 'PdfList', 'NavList', 'Badge',
    'details', 'summary', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'br', 'hr', 'p', 'div', 'span', 'ul', 'ol', 'li',
    'a', 'b', 'i', 'strong', 'em', 'pre', 'code', 'blockquote',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'colgroup', 'col', 'video', 'source',
    'script',
}

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    stripped = FENCED_CODE_RE.sub('', content)
    stripped = INLINE_CODE_RE.sub('', stripped)

    errors = []
    for match in BROWSER_EXT_RE.finditer(stripped):
        errors.append((filepath, match, 'browser-ext'))

    for match in HTML_TAG_RE.finditer(stripped):
        tag = match.group(1)
        if tag not in ALLOWED_TAGS:
            errors.append((filepath, match, f'unknown-tag:{tag}'))

    return errors


def main():
    result = subprocess.run(
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
        capture_output=True, text=True
    )
    files = [f for f in result.stdout.splitlines() if f.endswith('.md')]

    all_errors = []
    for fp in files:
        if not fp.startswith('docs/md/'):
            continue
        try:
            all_errors.extend(check_file(fp))
        except FileNotFoundError:
            continue

    if all_errors:
        for fp, match, kind in all_errors:
            line_num = stripped_content.count('\n', 0, match.start()) + 1
            print(f"{fp}:{line_num}:{match.start()}: {kind} - `{match.group()}`")
        print("\nUse backticks or code blocks to wrap HTML tags in prose.")
        sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    # Get stripped content before regex check
    result = subprocess.run(
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
        capture_output=True, text=True
    )
    files = [f for f in result.stdout.splitlines() if f.endswith('.md')]
    all_errors = []
    for fp in files:
        if not fp.startswith('docs/md/'):
            continue
        try:
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()
            stripped = FENCED_CODE_RE.sub('', content)
            stripped = INLINE_CODE_RE.sub('', stripped)
            for match in BROWSER_EXT_RE.finditer(stripped):
                line_num = content.count('\n', 0, match.start()) + 1
                all_errors.append((fp, line_num, f'browser-ext: {match.group()}'))
            for match in HTML_TAG_RE.finditer(stripped):
                tag = match.group(1)
                if tag not in ALLOWED_TAGS:
                    line_num = content.count('\n', 0, match.start()) + 1
                    all_errors.append((fp, line_num, f'unknown-tag<{tag}>: {match.group()}'))
        except FileNotFoundError:
            continue

    if all_errors:
        for fp, ln, msg in all_errors:
            print(f"{fp}:{ln}: {msg}")
        print("\nFAIL: Unescaped HTML tags found in markdown. Use backticks or code blocks.")
        sys.exit(1)

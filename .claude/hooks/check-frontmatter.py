#!/usr/bin/env python3
"""
pre-commit hook: 
1. 检查 Markdown frontmatter 格式
2. 检查 .md 文件中是否有裸露的 HTML 标签（会被 Vue 编译器视为错误）
"""

import sys
import re
import subprocess
from pathlib import Path

REQUIRED_FIELDS = ['title']
RECOMMENDED_FIELDS = ['date', 'url']

INLINE_CODE_RE = re.compile(r'`[^`]*`')
FENCED_CODE_RE = re.compile(r'```[\s\S]*?```')
HTML_TAG_RE = re.compile(r'</?(\w+)[^>]*?>')
BROWSER_EXT_RE = re.compile(r'<readpronunciation-\w+[^>]*?>')
ALLOWED_HTML_TAGS = {
    'PdfViewer', 'HtmlViewer', 'PdfList', 'NavList', 'Badge',
    'details', 'summary', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'br', 'hr', 'p', 'div', 'span', 'ul', 'ol', 'li',
    'a', 'b', 'i', 'strong', 'em', 'pre', 'code', 'blockquote',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'colgroup', 'col', 'video', 'source',
    'script',
}

def get_staged_md_files():
    """获取暂存区中的 .md 文件"""
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True
        )
        files = result.stdout.strip().split('\n')
        return [f for f in files if f.endswith('.md')]
    except Exception:
        return []

def check_frontmatter(file_path):
    """检查单个文件的 frontmatter"""
    try:
        with open(file_path) as f:
            content = f.read()
    except Exception as e:
        return [], [f"Cannot read {file_path}: {e}"]

    warnings = []
    errors = []

    # 检查是否有 frontmatter
    if not content.startswith('---'):
        errors.append(f"{file_path}: missing YAML frontmatter (start with ---)")
        return errors, warnings

    # 提取 frontmatter
    parts = content.split('---', 2)
    if len(parts) < 3:
        return errors, warnings

    fm = parts[1]

    # 检查必需字段
    for field in REQUIRED_FIELDS:
        if not re.search(rf'^{field}:', fm, re.MULTILINE):
            errors.append(f"{file_path}: missing required frontmatter field '{field}'")

    # 检查推荐字段（仅警告）
    for field in RECOMMENDED_FIELDS:
        if not re.search(rf'^{field}:', fm, re.MULTILINE):
            warnings.append(f"{file_path}: missing recommended frontmatter field '{field}'")

    return errors, warnings

def should_skip_file(file_path):
    """跳过不需要 frontmatter 的文件"""
    rel_path = str(Path(file_path))
    base = Path(file_path).name
    # Skip all .claude/ config files
    return rel_path.startswith('.claude/') or base.startswith('README')

def check_html_tags(file_path):
    """检查 .md 文件中是否有裸露的 HTML 标签"""
    errors = []
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    stripped = FENCED_CODE_RE.sub('', content)
    stripped = INLINE_CODE_RE.sub('', stripped)

    for match in BROWSER_EXT_RE.finditer(stripped):
        line_num = content.count('\n', 0, match.start()) + 1
        errors.append(f"{file_path}:{line_num}: browser extension tag `{match.group()}` — use `git checkout -- {file_path}` to revert")

    for match in HTML_TAG_RE.finditer(stripped):
        tag = match.group(1)
        if tag not in ALLOWED_HTML_TAGS:
            line_num = content.count('\n', 0, match.start()) + 1
            errors.append(f"{file_path}:{line_num}: unknown HTML tag `<{tag}>` — wrap in backticks or code block")

    return errors


def main():
    md_files = get_staged_md_files()
    if not md_files:
        return 0

    all_errors = []
    all_warnings = []

    for f in md_files:
        if should_skip_file(f):
            continue
        errors, warnings = check_frontmatter(f)
        all_errors.extend(errors)
        all_warnings.extend(warnings)

        html_errors = check_html_tags(f)
        all_errors.extend(html_errors)

    for w in all_warnings:
        print(f"Warning: {w}")

    for e in all_errors:
        print(f"Error: {e}")

    if all_errors:
        print("\nPlease fix the errors above before committing.")
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())

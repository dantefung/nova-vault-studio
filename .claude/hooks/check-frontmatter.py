#!/usr/bin/env python3
"""
Pre-commit hook: check Markdown frontmatter format.
Checks:
1. Required fields (title) present
2. YAML is valid and parseable
3. title value is scalar (no nested maps/lists causing build failure)
4. Recommended fields (date, url) warned if missing
"""

import sys
import re
import subprocess
import yaml
from pathlib import Path

REQUIRED_FIELDS = ['title']
RECOMMENDED_FIELDS = ['date', 'url']


def get_staged_md_files():
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True,
        )
        files = result.stdout.strip().split('\n')
        return [f for f in files if f.endswith('.md')]
    except Exception:
        return []


def check_frontmatter(file_path):
    try:
        with open(file_path) as f:
            content = f.read()
    except Exception as e:
        return [], [f"Cannot read {file_path}: {e}"]

    warnings = []
    errors = []

    if not content.startswith('---'):
        errors.append(f"{file_path}: missing YAML frontmatter (start with ---)")
        return errors, warnings

    parts = content.split('---', 2)
    if len(parts) < 3:
        errors.append(
            f"{file_path}: frontmatter has opening '---' but no closing '---'. "
            f"This will cause VitePress to parse the entire file as YAML, "
            f"crashing on lines like '#小程序://...'."
        )
        return errors, warnings

    fm = parts[1]

    try:
        fm_data = yaml.safe_load(fm)
    except yaml.YAMLError as e:
        errors.append(f"{file_path}: invalid YAML frontmatter — {e}")
        return errors, warnings

    for field in REQUIRED_FIELDS:
        if not re.search(rf'^{field}:', fm, re.MULTILINE):
            errors.append(f"{file_path}: missing required frontmatter field '{field}'")

    if fm_data is not None and isinstance(fm_data, dict):
        for field in REQUIRED_FIELDS + RECOMMENDED_FIELDS:
            if field in fm_data and not isinstance(fm_data[field], (str, int, float, bool, type(None))):
                errors.append(f"{file_path}: frontmatter field '{field}' must be scalar, got {type(fm_data[field]).__name__}")

    for field in RECOMMENDED_FIELDS:
        if not re.search(rf'^{field}:', fm, re.MULTILINE):
            warnings.append(f"{file_path}: missing recommended frontmatter field '{field}'")

    return errors, warnings


def should_skip_file(file_path):
    rel_path = str(Path(file_path))
    base = Path(file_path).name
    return rel_path.startswith('.claude/') or base.startswith('README')


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

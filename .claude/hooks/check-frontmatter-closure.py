#!/usr/bin/env python3
"""
Pre-commit hook: verify Markdown frontmatter has valid three-part structure.

A valid frontmatter must have exactly:
  ---
  YAML content
  ---

Common failure mode: missing closing --- causes VitePress to treat the entire
file as YAML, which then crashes on lines starting with # (e.g. WeChat mini-program
URLs like #小程序://xxx). This was the root cause of Vercel deployment failures
in issue #<TODO>.

Exit code 1 = build will fail at deploy time.
"""

import sys
import re
import subprocess
from pathlib import Path


def get_staged_md_files():
    result = subprocess.run(
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
        capture_output=True, text=True,
    )
    return [f for f in result.stdout.strip().split('\n') if f.endswith('.md')]


def check_frontmatter_structure(file_path):
    errors = []
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Must start with ---
    if not content.lstrip().startswith('---'):
        errors.append(f"{file_path}: missing opening '---' for frontmatter")
        return errors

    # Split on ---, expecting at least 3 parts:
    #   [before_first, yaml_body, after_closing]
    parts = content.split('---')
    # Filter out empty strings from leading/trailing splits
    non_empty_parts = [p for p in parts if p.strip()]

    if len(non_empty_parts) < 2:
        errors.append(
            f"{file_path}: frontmatter has opening '---' but no closing '---' "
            f"({len(non_empty_parts)} non-empty section(s) found, need 2). "
            f"This will cause VitePress to parse the entire file as YAML, "
            f"crashing on lines like '#小程序://...'."
        )
        return errors

    # Validate: first non-empty part is YAML body, second is body after frontmatter
    yaml_body = non_empty_parts[0]
    body_after = non_empty_parts[1] if len(non_empty_parts) > 1 else ''

    # Try parsing YAML to catch structural issues
    try:
        import yaml
        fm = yaml.safe_load(yaml_body)
        if fm is None:
            errors.append(f"{file_path}: frontmatter YAML parsed as None — check for syntax errors")
    except ImportError:
        pass  # yaml not installed, skip deep validation
    except yaml.YAMLError as e:
        errors.append(f"{file_path}: invalid YAML in frontmatter — {e}")

    return errors


def main():
    md_files = get_staged_md_files()
    if not md_files:
        return 0

    all_errors = []
    for f in md_files:
        if str(Path(f)).startswith('.claude/'):
            continue
        all_errors.extend(check_frontmatter_structure(f))

    for e in all_errors:
        print(f"Error: {e}")

    if all_errors:
        print("\nFix the errors above before committing.")
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())

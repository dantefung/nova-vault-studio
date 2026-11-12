#!/usr/bin/env python3
"""
Pre-commit hook: validate the AI programming resources markdown.

docs/md/guide/ai/ai-programming-resources.md is parsed at build time to
generate the resource navigation page (/md/resources/). If the file uses a
format the parser cannot understand, entries silently disappear from the
page. This hook runs the same parser (scripts/build-resource-nav.js) in
--check mode and fails the commit instead.

Usage:
  check-resource-nav.py [file.md ...]   # no-op unless the source file is included
  check-resource-nav.py                 # self-detect staged files
"""

import subprocess
import sys
from pathlib import Path

SOURCE_REL = 'docs/md/guide/ai/ai-programming-resources.md'
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHECKER = PROJECT_ROOT / 'scripts' / 'build-resource-nav.js'


def staged_files():
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True, cwd=PROJECT_ROOT,
        )
        return [f.strip() for f in result.stdout.splitlines() if f.strip()]
    except Exception:
        return []


def main():
    targets = sys.argv[1:] or staged_files()
    normalized = {t.replace('\\', '/').removeprefix('./') for t in targets}
    if SOURCE_REL not in normalized:
        return 0

    if not CHECKER.exists():
        print(f"Error: resource nav checker not found: {CHECKER}")
        return 1

    result = subprocess.run(['node', str(CHECKER), '--check'], cwd=PROJECT_ROOT)
    if result.returncode != 0:
        print("\nPlease fix the resource markdown format before committing.")
        print("Convention: docs/md/guide/ai/ai-programming-resources.md")
    return result.returncode


if __name__ == '__main__':
    sys.exit(main())

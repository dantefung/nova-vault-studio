#!/usr/bin/env python3
"""
Check image references in .md files.

Verifies that all image references in markdown files point to existing files.
"""

import sys
import os
import re
from pathlib import Path


def check_image_references(md_file: str) -> bool:
    """Check if all image references in a .md file exist."""
    md_path = Path(md_file)
    if not md_path.exists():
        return True  # File might be deleted, let git handle it

    content = md_path.read_text(encoding='utf-8')
    md_dir = md_path.parent

    # Pattern to match markdown image syntax: ![alt](path)
    # and also raw URLs that look like image references
    img_pattern = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')

    errors = []
    for match in img_pattern.finditer(content):
        alt_text = match.group(1)
        img_path = match.group(2).strip()

        # Skip external URLs (http, https)
        if img_path.startswith('http://') or img_path.startswith('https://'):
            continue

        # Skip empty paths
        if not img_path:
            continue

        # Resolve the image path relative to the md file
        # Handle both absolute-like paths (starting with /) and relative paths
        if img_path.startswith('/'):
            # Absolute path from project root - need to find docs directory
            docs_dir = md_path.parent
            while docs_dir.name != 'docs' and docs_dir.parent != md_path.parent:
                docs_dir = docs_dir.parent
            if docs_dir.name == 'docs':
                img_full_path = docs_dir.parent / img_path.lstrip('/')
            else:
                img_full_path = md_dir / img_path.lstrip('/')
        else:
            img_full_path = md_dir / img_path

        # Normalize the path
        img_full_path = img_full_path.resolve()

        # Check if the image exists
        if not img_full_path.exists():
            # Check if it's a directory (some refs might be to directories)
            if img_full_path.is_dir():
                continue
            # Try common extensions if the path looks like it might have wrong extension
            stem = img_full_path.stem
            suffix = img_full_path.suffix.lower()
            found = False
            for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']:
                if suffix != ext:
                    alt_path = img_full_path.with_suffix(ext)
                    if alt_path.exists():
                        errors.append(
                            f"  ERROR: Image '{img_path}' has wrong extension.\n"
                            f"         Found: {suffix}, try: {ext}\n"
                            f"         In file: {md_file}\n"
                            f"         Line: {content[:match.start()].count(chr(10)) + 1}"
                        )
                        found = True
                        break
            if not found:
                errors.append(
                    f"  ERROR: Image not found: {img_path}\n"
                    f"         In file: {md_file}\n"
                    f"         Line: {content[:match.start()].count(chr(10)) + 1}"
                )

    if errors:
        print(f"\n{'='*60}")
        print(f"Image reference errors in {md_file}:")
        for error in errors:
            print(error)
        print(f"{'='*60}")
        return False

    return True


def main():
    if len(sys.argv) < 2:
        print("Usage: check-image-refs.py <file.md>")
        sys.exit(1)

    md_file = sys.argv[1]
    success = check_image_references(md_file)
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

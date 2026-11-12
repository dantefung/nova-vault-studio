#!/usr/bin/env python3
"""
Pre-commit hook: validate image file extensions in staged commits.

VitePress/Rollup resolves image imports by file extension. Unknown extensions
(e.g. `.other`, `.tmp`, `.bak`) cause build failures like:
  "Failed to parse source for import analysis because the content contains
   invalid JS syntax" — the file is treated as JavaScript instead of an asset.

Known-good extensions: png, jpg, jpeg, webp, gif, svg, avif, ico, bmp

Exit code 1 = images with bad extensions are staged, build will fail.
"""

import subprocess
import sys
from pathlib import Path

ALLOWED_IMAGE_EXTS = {
    '.png', '.jpg', '.jpeg', '.webp', '.gif',
    '.svg', '.avif', '.ico', '.bmp', '.tiff', '.tif',
}

# Paths that are never image directories (skip scanning these)
SKIP_PATHS = {'.git', 'node_modules', '.vercel', 'dist', '.vitepress'}


def get_staged_image_files():
    """Get image files (by extension) in the staged diff."""
    result = subprocess.run(
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
        capture_output=True, text=True,
    )
    return [f for f in result.stdout.strip().split('\n') if f]


def get_image_extensions_in_staged_diff():
    """Find files with known image extensions staged for commit."""
    staged = get_staged_image_files()
    image_files = []
    for f in staged:
        ext = Path(f).suffix.lower()
        if ext in ALLOWED_IMAGE_EXTS:
            image_files.append(f)
    return image_files


def find_unknown_ext_files():
    """
    Scan all image directories referenced by staged .md files for
    files with non-standard extensions.
    """
    staged_md = get_staged_image_files() + [
        f for f in subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True,
        ).stdout.strip().split('\n')
        if f.endswith('.md')
    ]

    # Collect all image dirs from staged .md references
    image_dirs = set()
    for md_file in staged_md:
        if not md_file.endswith('.md'):
            continue
        try:
            with open(md_file, 'r', encoding='utf-8') as fh:
                content = fh.read()
        except Exception:
            continue

        # Match markdown image references: ![alt](path/to/image.ext)
        import re
        for match in re.finditer(r'!\[.*?\]\((.*?)\)', content):
            src = match.group(1).strip()
            # Relative paths
            if src.startswith('./') or src.startswith('../'):
                base = Path(md_file).parent
                try:
                    resolved = (base / src).resolve()
                    image_dirs.add(str(resolved))
                except Exception:
                    pass

    # Also scan image dirs from all staged md files (broader approach)
    for md_file in staged_md:
        if not md_file.endswith('.md'):
            continue
        base = Path(md_file).parent
        # Walk up looking for image dirs
        for parent in [base] + list(base.parents)[:3]:
            img_dir = parent / 'images'
            if img_dir.exists() and str(img_dir) not in image_dirs:
                image_dirs.add(str(img_dir))

    # Find files with unknown extensions
    bad_files = []
    for dir_path in image_dirs:
        try:
            for f in Path(dir_path).iterdir():
                if f.is_file():
                    ext = f.suffix.lower()
                    if ext and ext not in ALLOWED_IMAGE_EXTS:
                        bad_files.append(f)
        except PermissionError:
            continue

    return bad_files


def main():
    bad_files = find_unknown_ext_files()

    if not bad_files:
        return 0

    print("Error: image files with unsupported extensions found:")
    for f in bad_files:
        rel = f.relative_to(Path.cwd()) if f.is_absolute() and str(f).startswith(str(Path.cwd())) else f
        print(f"  {rel} (extension: {f.suffix})")
        print(f"    -> Rename to a valid extension: {', '.join(sorted(ALLOWED_IMAGE_EXTS))}")
    print()
    print("Tip: common culprit — WebP files saved with wrong extension (.other, .png-as-webp, etc.)")
    print("Check with: file <path>")
    return 1


if __name__ == '__main__':
    sys.exit(main())

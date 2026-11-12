#!/usr/bin/env python3
"""
Pre-commit hook: check for large images that cause Vercel OOM.

Vercel build fails with OOM (~7 min) when images >500KB accumulate.
Checks:
  1. All staged image files (direct additions)
  2. Images referenced by staged .md files

Usage: python3 check-image-size.py <file_path>
  - Pass staged .md or image file paths
  - Returns exit code 0 (pass) or 1 (fail with warnings)
"""

import re
import os
import sys
import subprocess

MAX_SIZE = 500 * 1024  # 500KB
ANIMATED_GIF_WARN = 100 * 1024  # 100KB


def get_staged_images():
    """Get all staged image files from git."""
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True, check=True
        )
        files = result.stdout.strip().split('\n')
        return [f for f in files if f and re.search(r'\.(png|jpe?g|gif|webp)$', f, re.I)]
    except subprocess.CalledProcessError:
        return []


def check_image_file(img_path):
    """Check a single image file. Returns (pass, warnings)."""
    warnings = []
    full_path = img_path

    # Handle relative paths from git
    if not os.path.isabs(full_path):
        project_root = subprocess.run(
            ['git', 'rev-parse', '--show-toplevel'],
            capture_output=True, text=True, check=True
        ).stdout.strip()
        full_path = os.path.join(project_root, full_path)

    if not os.path.exists(full_path):
        return True, []

    size = os.path.getsize(full_path)
    ext = os.path.splitext(full_path)[1].lower()

    if size > MAX_SIZE:
        if ext == '.gif':
            warnings.append(
                f"LARGE GIF: {img_path} ({size/1024/1024:.1f}MB)\n"
                f"  -> Convert to PNG (sharp extracts first frame):\n"
                f"     node -e \"const sharp=require('sharp');\n"
                f"       sharp('{img_path}',{'{animated:false}'})\n"
                f"       .png({{compressionLevel:9,palette:true}})\n"
                f"       .toFile('{img_path.replace('.gif','.png')}').then(()=>console.log('OK'))\"\n"
                f"  -> Then update .md references from .gif to .png\n"
                f"  -> Delete old .gif file"
            )
        elif ext in ('.png', '.jpg', '.jpeg', '.webp'):
            warnings.append(
                f"LARGE IMAGE: {img_path} ({size/1024/1024:.1f}MB)\n"
                f"  -> Compress with sharp (npm):\n"
                f"     node -e \"const sharp=require('sharp');\n"
                f"       sharp('{img_path}').rotate()\n"
                f"       .resize({{width:1600,withoutEnlargement:true}})\n"
                f"       .jpeg({{quality:82,mozjpeg:true}})\n"
                f"       .toFile('{img_path}+'.tmp').then(()=>require('fs').renameSync('{img_path}'+'.tmp','{img_path}'))\""
            )

    return len(warnings) == 0, warnings


def extract_image_refs(md_path):
    """Extract image references from a markdown file."""
    refs = []
    if not os.path.exists(md_path):
        return refs

    content = open(md_path, 'r', encoding='utf-8', errors='ignore').read()

    # Match inline images and definitions used by reference-style images.
    paths = [match.group(1) for match in re.finditer(r'!\[.*?\]\(([^)]+)\)', content)]
    labels = {
        (label or alt).casefold() for alt, label in re.findall(r'!\[([^\]]*)\]\[([^\]]*)\]', content)
        if (label or alt)
    }
    paths.extend(
        match.group(2) for match in re.finditer(r'^\[([^\]]+)\]:\s*(\S+)(?:\s+["\'(].*)?$', content, re.MULTILINE)
        if match.group(1).casefold() in labels
    )

    for path in paths:
        if path.startswith('http'):
            continue
        # Resolve relative to md file
        md_dir = os.path.dirname(md_path)
        resolved = os.path.normpath(os.path.join(md_dir, path))
        refs.append(resolved)

    return refs


def main():
    """Main entry point."""
    files_to_check = sys.argv[1:] if len(sys.argv) > 1 else []
    has_error = False
    all_warnings = []

    # If no files passed, check all staged
    if not files_to_check:
        staged_md = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True, check=True
        ).stdout.strip().split('\n')
        files_to_check = [f for f in staged_md if f and f.endswith('.md') and not f.startswith('docs/public/')]
        image_files = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True, text=True, check=True
        ).stdout.strip().split('\n')
        files_to_check += [f for f in image_files if f and re.search(r'\.(png|jpe?g|gif|webp)$', f, re.I)]

    project_root = subprocess.run(
        ['git', 'rev-parse', '--show-toplevel'],
        capture_output=True, text=True, check=True
    ).stdout.strip()

    checked = set()

    for f in files_to_check:
        full_path = os.path.join(project_root, f) if not os.path.isabs(f) else f
        if not os.path.exists(full_path) or full_path in checked:
            continue
        checked.add(full_path)

        if re.search(r'\.(png|jpe?g|gif|webp)$', f, re.I):
            ok, warns = check_image_file(f)
            if not ok:
                has_error = True
                all_warnings.extend(warns)
        elif f.endswith('.md'):
            refs = extract_image_refs(full_path)
            for ref in refs:
                if ref in checked:
                    continue
                checked.add(ref)
                if os.path.exists(ref):
                    ok, warns = check_image_file(os.path.relpath(ref, project_root))
                    if not ok:
                        has_error = True
                        all_warnings.extend(warns)

    if all_warnings:
        print("\n⚠️  IMAGE SIZE WARNINGS (Vercel OOM risk):")
        print("=" * 60)
        for w in all_warnings:
            print(f"\n{w}")
        print("\n" + "=" * 60)
        print("💡  Run `node _sandbox/compress-images.js` for batch compression.")
        print("    Or compress individual files with the commands above.\n")
        return 1

    return 0


if __name__ == '__main__':
    sys.exit(main())

#!/usr/bin/env python3
"""
Avatar Image Scanner

Scans markdown files and image directories to identify avatar images
and their references based on size threshold and link patterns.
"""

import os
import sys
import json
import argparse
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple
from PIL import Image


def parse_args():
    parser = argparse.ArgumentParser(description='Scan for avatar images in markdown files')
    parser.add_argument('--path', default='.', help='Target directory to scan')
    parser.add_argument('--size', default='96x96', help='Avatar size threshold (WxH)')
    parser.add_argument('--pattern', default='', help='Additional link pattern to detect (regex)')
    parser.add_argument('--output', required=True, help='Output JSON report path')
    return parser.parse_args()


def parse_size(size_str: str) -> Tuple[int, int]:
    """Parse size string like '96x96' into (width, height)"""
    try:
        w, h = size_str.lower().split('x')
        return (int(w), int(h))
    except:
        raise ValueError(f"Invalid size format: {size_str}. Expected format: WxH (e.g., 96x96)")


def find_markdown_files(root_path: Path) -> List[Path]:
    """Find all markdown files in the directory tree"""
    md_files = []
    for root, dirs, files in os.walk(root_path):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            if file.endswith('.md') and not file.startswith('.'):
                md_files.append(Path(root) / file)
    
    return md_files


def scan_images(root_path: Path, target_size: Tuple[int, int]) -> Dict[str, Dict]:
    """
    Scan all images and identify avatars by size.
    Returns dict mapping image_path -> {size, file_size, is_avatar}
    """
    images_info = {}
    
    # Find all image directories
    for root, dirs, files in os.walk(root_path):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            if file.endswith(('.jpg', '.png', '.jpeg', '.webp')):
                img_path = Path(root) / file
                
                try:
                    with Image.open(img_path) as img:
                        size = img.size
                        file_size = os.path.getsize(img_path)
                        is_avatar = (size == target_size)
                        
                        # Store relative path from root
                        rel_path = img_path.relative_to(root_path)
                        
                        images_info[str(rel_path)] = {
                            'size': f"{size[0]}x{size[1]}",
                            'file_size': file_size,
                            'is_avatar': is_avatar,
                            'absolute_path': str(img_path)
                        }
                except Exception as e:
                    print(f"Warning: Could not process {img_path}: {e}", file=sys.stderr)
    
    return images_info


def extract_image_references(md_file: Path, root_path: Path) -> List[Dict]:
    """
    Extract all image references from a markdown file.
    Returns list of {line_num, line_content, image_path, ref_type}
    """
    references = []
    
    try:
        with open(md_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines, start=1):
            # Match all markdown image formats:
            # ![](path), ![alt](path), ![图片](path)
            matches = re.finditer(r'!\[[^\]]*\]\(([^)]+)\)', line)
            
            for match in matches:
                img_path = match.group(1)
                
                # Only process local images (relative paths starting with 'images/')
                if img_path.startswith('images/'):
                    references.append({
                        'line_num': line_num,
                        'line_content': line.strip(),
                        'image_path': img_path,
                        'ref_type': 'image'
                    })
    
    except Exception as e:
        print(f"Warning: Could not read {md_file}: {e}", file=sys.stderr)
    
    return references


def detect_special_links(md_file: Path, pattern: str) -> List[Dict]:
    """
    Detect special link patterns (e.g., SVG icon links).
    Returns list of {line_num, line_content, ref_type}
    """
    if not pattern:
        return []
    
    special_refs = []
    
    try:
        with open(md_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        pattern_re = re.compile(pattern)
        
        for line_num, line in enumerate(lines, start=1):
            if pattern_re.search(line):
                special_refs.append({
                    'line_num': line_num,
                    'line_content': line.strip(),
                    'ref_type': 'special_link'
                })
    
    except Exception as e:
        print(f"Warning: Could not read {md_file}: {e}", file=sys.stderr)
    
    return special_refs


def main():
    args = parse_args()
    
    root_path = Path(args.path).resolve()
    if not root_path.exists():
        print(f"Error: Path does not exist: {root_path}", file=sys.stderr)
        sys.exit(1)
    
    target_size = parse_size(args.size)
    
    print(f"🔍 Scanning directory: {root_path}")
    print(f"   Avatar size threshold: {args.size}")
    if args.pattern:
        print(f"   Special link pattern: {args.pattern}")
    
    # Step 1: Scan all images
    print("\n📸 Scanning images...")
    images_info = scan_images(root_path, target_size)
    avatar_count = sum(1 for info in images_info.values() if info['is_avatar'])
    print(f"   Found {len(images_info)} images, {avatar_count} are avatars")
    
    # Step 2: Scan markdown files
    print("\n📝 Scanning markdown files...")
    md_files = find_markdown_files(root_path)
    print(f"   Found {len(md_files)} markdown files")
    
    # Step 3: Extract references and classify
    print("\n🔗 Analyzing references...")
    results = {
        'scan_params': {
            'path': str(root_path),
            'size': args.size,
            'pattern': args.pattern
        },
        'statistics': {
            'total_images': len(images_info),
            'avatar_images': avatar_count,
            'markdown_files': len(md_files),
            'files_with_avatars': 0,
            'avatar_references': 0,
            'special_links': 0
        },
        'images': images_info,
        'files': {}
    }
    
    for md_file in md_files:
        # Get image references
        img_refs = extract_image_references(md_file, root_path)
        
        # Get special link references
        special_refs = detect_special_links(md_file, args.pattern)
        
        # Classify image references as avatar or content
        avatar_refs = []
        content_refs = []
        
        for ref in img_refs:
            img_path = ref['image_path']
            if img_path in images_info and images_info[img_path]['is_avatar']:
                avatar_refs.append(ref)
            else:
                content_refs.append(ref)
        
        # Only include files that have something to clean
        if avatar_refs or special_refs:
            rel_md_path = str(md_file.relative_to(root_path))
            results['files'][rel_md_path] = {
                'absolute_path': str(md_file),
                'avatar_refs': avatar_refs,
                'content_refs': content_refs,
                'special_refs': special_refs,
                'total_to_remove': len(avatar_refs) + len(special_refs)
            }
            
            results['statistics']['files_with_avatars'] += 1
            results['statistics']['avatar_references'] += len(avatar_refs)
            results['statistics']['special_links'] += len(special_refs)
    
    # Step 4: Write report
    print(f"\n💾 Writing report to {args.output}")
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Scan complete!")
    print(f"   Files with avatars: {results['statistics']['files_with_avatars']}")
    print(f"   Avatar references: {results['statistics']['avatar_references']}")
    print(f"   Special links: {results['statistics']['special_links']}")
    print(f"   Total to remove: {results['statistics']['avatar_references'] + results['statistics']['special_links']}")


if __name__ == '__main__':
    main()

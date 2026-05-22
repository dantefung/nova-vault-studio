#!/usr/bin/env python3
"""
PDF → Markdown 转换器

提取 PDF 文字为 Markdown，同时提取嵌入图片，生成可读的 Markdown 文件。
"""

import subprocess, os, sys, argparse, shutil, re, tempfile

def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)

def pdf_to_markdown(pdf_path, output_md, images_dir):
    """主流程"""
    # 1. 提取文字
    txt = tempfile.mktemp(suffix='.txt')
    r = run(['pdftotext', '-layout', pdf_path, txt])
    if r.returncode != 0:
        print(f'ERROR: pdftotext failed: {r.stderr}')
        return False

    with open(txt) as f:
        body = f.read()

    # 2. 添加 frontmatter
    basename = os.path.splitext(os.path.basename(pdf_path))[0]
    title = basename.replace('-', ' ').replace('_', ' ')
    frontmatter = f'---\ntitle: "{title}"\ndate: "2026-05-22"\nsource: "PDF"\nurl: ""\n---\n\n'
    with open(output_md, 'w') as f:
        f.write(frontmatter + body)

    # 3. 提取图片
    os.makedirs(images_dir, exist_ok=True)
    img_prefix = os.path.join(tempfile.mkdtemp(), 'img')
    r = run(['pdfimages', '-png', pdf_path, img_prefix])
    if r.returncode != 0:
        print(f'WARNING: pdfimages failed: {r.stderr}')
        print(f'Markdown saved to {output_md} (no images)')
        return True

    # 4. 获取图片到页面的映射
    r = run(['pdfimages', '-list', pdf_path])
    page_map = {}
    for line in r.stdout.split('\n'):
        parts = line.split()
        if len(parts) >= 3 and parts[0].isdigit() and parts[1].isdigit():
            page, num, imgtype = int(parts[0]), int(parts[1]), parts[2]
            if imgtype == 'image':
                page_map[num] = page

    # 5. 复制有意义的大图
    img_files = sorted(f for f in os.listdir(os.path.dirname(img_prefix))
                      if f.startswith(os.path.basename(img_prefix)) and f.endswith('.png'))
    
    copied = []
    for f in img_files:
        fpath = os.path.join(os.path.dirname(img_prefix), f)
        size = os.path.getsize(fpath)
        if size < 50000:  # 过滤小于 50KB 的装饰元素
            continue
        num = int(f.replace(os.path.basename(img_prefix) + '-', '').replace('.png', ''))
        page = page_map.get(num, -1)
        dst_name = f'{num:03d}-p{page:02d}.png'
        shutil.copy(fpath, os.path.join(images_dir, dst_name))
        copied.append((num, page, dst_name))

    # 6. 追加图片 gallery 到 markdown
    if copied:
        with open(output_md, 'a') as f:
            f.write('\n\n---\n\n## 配图\n\n')
            for num, page, name in sorted(copied):
                f.write(f'![p{page:02d}](images/{os.path.basename(images_dir)}/{name})\n')

    print(f'Done: {output_md}')
    print(f'  Text: {len(body)} chars')
    print(f'  Images: {len(copied)} extracted')
    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='PDF → Markdown with image extraction')
    parser.add_argument('pdf', help='PDF file path')
    parser.add_argument('-o', '--output', help='Output markdown file (default: same name .md)')
    parser.add_argument('--images-dir', help='Images subdirectory (default: images/<name>/)')
    args = parser.parse_args()

    pdf_path = os.path.abspath(args.pdf)
    if not args.output:
        args.output = os.path.splitext(pdf_path)[0] + '.md'
    if not args.images_dir:
        slug = os.path.splitext(os.path.basename(pdf_path))[0]
        args.images_dir = os.path.join(os.path.dirname(args.output), 'images', slug)

    pdf_to_markdown(pdf_path, args.output, args.images_dir)

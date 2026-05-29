#!/usr/bin/env python3
"""
从 Markdown 文件中提取外部图片 URL，下载到本地 images/ 子目录，
替换原文中的图片链接为本地相对路径。

用法:
    python3 download-images.py <md_file> [--dry-run]

流程:
    1. 从 md 文件中提取所有外部图片 URL（mmbiz、cdn 等）
    2. 去重后带 Referer 下载（解决微信防盗链）
    3. 按序号命名保存到 images/<basename>/ 目录
    4. 将 md 中的 URL 替换为本地相对路径 ./images/<name>/<file>
"""

import sys
import re
import os
import hashlib
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional


HEADERS = {
    "Referer": "https://mp.weixin.qq.com/",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def guess_ext(url: str) -> str:
    m = re.search(r"wx_fmt=(\w+)", url)
    if m:
        return m.group(1)
    ext = os.path.splitext(url.split("?")[0])[-1]
    return ext.lstrip(".") or "png"


def download_image(url: str, out_path: Path) -> Optional[str]:
    """下载单张图片，返回本地路径或 None（失败时回退原 URL）"""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, "wb") as f:
            f.write(data)
        size = len(data) // 1024
        print(f"  ✅ {out_path.name} ({size}KB)")
        return str(out_path)
    except Exception as e:
        print(f"  ⚠️  下载失败 [{url[:60]}]: {e}")
        return None


def extract_image_urls(md_content: str) -> list[str]:
    """从 Markdown 中提取所有外部图片 URL"""
    urls = []
    for m in re.finditer(r'!\[.*?\]\((https?://[^\s)]+)\)', md_content):
        url = m.group(1).strip()
        if url:
            urls.append(url)
    return list(dict.fromkeys(urls))  # 去重保序


def process_file(md_path: Path, dry_run: bool = False) -> bool:
    md_path = Path(md_path).resolve()
    if not md_path.exists():
        print(f"❌ 文件不存在: {md_path}")
        return False

    with open(md_path, encoding="utf-8") as f:
        content = f.read()

    urls = extract_image_urls(content)
    if not urls:
        print("✅ 没有外部图片需要处理")
        return True

    print(f"📷 找到 {len(urls)} 张外部图片:")
    for u in urls:
        print(f"   {u[:80]}")

    # 构建输出目录：md 同级 images/<basename>/
    base_name = md_path.stem
    img_dir = md_path.parent / "images" / base_name
    local_paths: dict[str, str] = {}

    # 下载
    print(f"\n📥 开始下载到 {img_dir.relative_to(md_path.parent)}/")
    for i, url in enumerate(urls, 1):
        ext = guess_ext(url)
        filename = f"{base_name}-img{i}.{ext}"
        local_path = img_dir / filename
        result = download_image(url, local_path)
        local_paths[url] = str(
            f"./images/{base_name}/{filename}"
        ) if result else url

    if dry_run:
        print("\n🔍 Dry run — 未写入文件")
        for orig, local in local_paths.items():
            print(f"  {orig[:60]} → {local}")
        return True

    # 替换 md 内容中的 URL
    for orig, local in local_paths.items():
        # 只替换 md 里的图片 URL
        content = re.sub(
            re.escape(orig) + r'(?=[^"]*(?:"|$))',
            local,
            content,
        )

    with open(md_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"\n✅ 完成！图片已保存到 {img_dir}")
    print(f"✅ {md_path.name} 中的图片链接已替换为本地路径")
    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: download-images.py <md_file> [--dry-run]", file=sys.stderr)
        sys.exit(1)

    md_file = sys.argv[1]
    dry_run = "--dry-run" in sys.argv

    success = process_file(md_file, dry_run=dry_run)
    sys.exit(0 if success else 1)

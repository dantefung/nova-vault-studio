#!/usr/bin/env python3
"""
从 Markdown 文件中提取外部图片 URL，下载到本地 images/ 子目录，
替换原文中的图片链接为本地相对路径。

支持两种工作模式：
1. 传统模式：从 md 文件中提取 `![](url)` 格式的图片链接并替换
2. 预取模式：指定 --json-file 来自 fetch_weixin.py 的 JSON 输出，
   此时 md 文件中可能没有图片链接，脚本只负责下载并用序号命名

用法:
    # 传统模式：替换 md 中的远程 URL 为本地路径
    python3 download-images.py <md_file> [--dry-run]

    # 指定图片目录前缀（生成 images/<prefix>/001.png 等）
    python3 download-images.py <md_file> --prefix "images/article-slug/"

    # 只下载，不修改 md 文件
    python3 download-images.py <md_file> --keep-original [--prefix "images/article-slug/"]

    # 从 fetch_weixin.py 的 JSON 输出读取 URL（公众号专用）
    python3 download-images.py <md_file> --json-file /path/to/wechat.json [--dry-run]
"""

import sys
import re
import os
import json
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
    return list(dict.fromkeys(urls))


def load_urls_from_json(json_path: str) -> list[dict]:
    """从 fetch_weixin.py --json 输出中加载图片 URL 列表"""
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)
    img_urls = data.get("img_urls", [])
    result = []
    for i, url in enumerate(img_urls):
        idx = i + 1
        result.append({"index": idx, "url": url})
    return result


def process_file(
    md_path: Path,
    dry_run: bool = False,
    keep_original: bool = False,
    prefix: str = "",
    json_file: str = "",
) -> bool:
    md_path = Path(md_path).resolve()
    if not md_path.exists():
        print(f"❌ 文件不存在: {md_path}")
        return False

    with open(md_path, encoding="utf-8") as f:
        content = f.read()

    # 确定图片目录和文件名格式
    base_name = md_path.stem
    if prefix:
        img_dir = md_path.parent / prefix.rstrip("/")
    else:
        img_dir = md_path.parent / "images" / base_name

    urls: list[tuple[int, str]] = []  # (index, url)

    if json_file:
        # 预取模式：从 JSON 文件读取 URL
        items = load_urls_from_json(json_file)
        urls = [(item["index"], item["url"]) for item in items]
        print(f"📷 从 JSON 加载 {len(urls)} 张图片 URL:")
        for idx, url in urls:
            print(f"   [{idx:03d}] {url[:80]}")
    else:
        # 传统模式：从 md 内容提取
        extracted = extract_image_urls(content)
        if not extracted:
            print("✅ 没有外部图片需要处理")
            return True
        urls = [(i + 1, url) for i, url in enumerate(extracted)]
        print(f"📷 找到 {len(urls)} 张外部图片:")
        for idx, url in urls:
            print(f"   [{idx:03d}] {url[:80]}")

    local_paths: dict[str, str] = {}

    print(f"\n📥 开始下载到 {img_dir.relative_to(md_path.parent)}/")
    for idx, url in urls:
        ext = guess_ext(url)
        filename = f"{idx:03d}.{ext}"  # 001.png, 002.png ...
        local_path = img_dir / filename
        result = download_image(url, local_path)
        if result:
            if prefix:
                rel = f"./{prefix.rstrip('/')}/{filename}"
            else:
                rel = f"./images/{base_name}/{filename}"
            local_paths[url] = rel
        else:
            local_paths[url] = url

    if dry_run:
        print("\n🔍 Dry run — 未写入文件")
        for orig, local in list(local_paths.items())[:5]:
            print(f"  {orig[:60]} → {local}")
        return True

    if keep_original:
        print(f"\n✅ 下载完成！图片已保存到 {img_dir}")
        print(f"✅ 已设置 --keep-original，未修改 md 文件")
        print(f"\n图片本地路径:")
        for idx, url in urls:
            local = local_paths.get(url, url)
            print(f"  {idx:03d}: {local}")
        return True

    # 替换 md 内容中的 URL（仅替换已成功下载的）
    for orig, local in local_paths.items():
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
        print("Usage: download-images.py <md_file> [options]", file=sys.stderr)
        print(__doc__)
        sys.exit(1)

    md_file = sys.argv[1]
    dry_run = "--dry-run" in sys.argv
    keep_original = "--keep-original" in sys.argv
    prefix = ""
    json_file = ""

    for arg in sys.argv[2:]:
        if arg.startswith("--prefix="):
            prefix = arg.split("=", 1)[1].strip()
        elif arg == "--json-file" and len(sys.argv) > sys.argv.index(arg) + 1:
            idx = sys.argv.index(arg) + 1
            json_file = sys.argv[idx]

    success = process_file(
        md_file,
        dry_run=dry_run,
        keep_original=keep_original,
        prefix=prefix,
        json_file=json_file,
    )
    sys.exit(0 if success else 1)

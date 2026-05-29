#!/usr/bin/env python3
"""Fetch WeChat (公众号) article as Markdown. Uses Playwright to render and BeautifulSoup to extract."""

import sys
import json
import asyncio
import re
from datetime import datetime


async def fetch_weixin_article(url: str) -> dict:
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        return {"error": "playwright not installed. Run: pip install playwright && playwright install chromium"}

    try:
        from bs4 import BeautifulSoup
    except ImportError:
        return {"error": "beautifulsoup4 not installed. Run: pip install beautifulsoup4 lxml"}

    html = None
    UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(user_agent=UA)
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_selector("#js_content", timeout=15000)
            html = await page.content()
        except Exception as e:
            await browser.close()
            return {"error": f"加载页面失败: {e}"}
        await browser.close()

    if not html:
        return {"error": "无 HTML 内容"}

    soup = BeautifulSoup(html, "lxml")

    # Extract meta
    title_el = soup.select_one("#activity-name")
    title = title_el.get_text(strip=True) if title_el else ""

    author_el = soup.select_one("#js_author_name") or soup.select_one(".rich_media_meta_text")
    author = author_el.get_text(strip=True) if author_el else ""

    time_el = soup.select_one("#publish_time")
    publish_time = time_el.get_text(strip=True) if time_el else ""
    if publish_time:
        try:
            dt = datetime.strptime(publish_time, "%Y年%m月%d日")
            publish_time = dt.strftime("%Y-%m-%d")
        except Exception:
            pass

    # Extract content
    content_el = soup.select_one("#js_content")
    if not content_el:
        return {"error": "找不到文章内容 (#js_content)"}

    # Remove ad elements
    AD_SELECTORS = [
        "[class*='js_pc_qr_code']", "[id*='js_pc_qr_code']",
        "[class*='js_editor_']", "[id*='js_editor_']",
        "[class*='appmsg_reward']", "[id*='appmsg_reward']",
        "[class*='profile_meta']", "[id*='profile_meta']",
        "[class*='copyright_area']",
        "[class*='sidebar-ad']",
    ]
    for sel in AD_SELECTORS:
        for el in content_el.select(sel):
            el.decompose()

    # Remove scripts/styles
    for tag in content_el.find_all(["script", "style"]):
        tag.decompose()

    # Collect image URLs (data-src 优先)
    img_urls = []
    for img in content_el.find_all("img"):
        src = img.get("data-src") or img.get("src") or ""
        # 过滤 emoji/默认头像
        if src and not any(x in src for x in ["qpic.cn/64", "qlogo.cn", "mmemoji", "mmurl"]):
            img_urls.append(src)
        img.decompose()

    # Convert to markdown
    lines = []
    for el in content_el.find_all(["p", "h1", "h2", "h3", "h4", "section", "blockquote"]):
        text = re.sub(r"<[^>]+>", "", str(el)).strip()
        if not text:
            continue
        tag = el.name
        if tag in ("h1", "h2", "h3", "h4"):
            lines.append(f"{'#' * int(tag[1])} {text}")
        elif tag == "blockquote":
            lines.append(f"> {text}")
        else:
            lines.append(text)

    # Rebuild images as markdown
    content_lines = []
    i = 0
    for line in "\n\n".join(lines).split("\n"):
        content_lines.append(line)
        # 简单：按原文顺序把图片插回（placeholder 方案：保留 URL 列表供后续处理）
    content = "\n\n".join(content_lines)

    return {
        "title": title,
        "author": author,
        "publish_time": publish_time,
        "content": content,
        "url": url,
        "img_urls": list(dict.fromkeys(img_urls)),  # 去重保序
    }


def format_as_markdown(result: dict) -> str:
    if "error" in result:
        return f"Error: {result['error']}"
    parts = ["---"]
    if result.get("title"):
        parts.append(f'title: "{result["title"]}"')
    if result.get("author"):
        parts.append(f'author: "{result["author"]}"')
    if result.get("publish_time"):
        parts.append(f'date: "{result["publish_time"]}"')
    parts.append('source: "微信公众号"')
    parts.append(f'url: "{result["url"]}"')
    parts.append("---")
    parts.append("")
    if result.get("title"):
        parts.append(f"# {result['title']}")
        parts.append("")
    parts.append(result.get("content", ""))
    return "\n".join(parts)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: fetch_weixin.py <weixin_url> [--json]", file=sys.stderr)
        sys.exit(1)
    url = sys.argv[1]
    use_json = "--json" in sys.argv
    result = asyncio.run(fetch_weixin_article(url))
    if use_json:
        out = {k: v for k, v in result.items() if k != "content"}
        print(json.dumps(out, ensure_ascii=False, indent=2))
    else:
        print(format_as_markdown(result))

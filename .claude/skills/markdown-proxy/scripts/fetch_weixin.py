#!/usr/bin/env python3
"""Fetch WeChat (公众号) article as Markdown. Standalone script using Playwright + BeautifulSoup.

两种抓取模式：
  --no-images   纯文本模式，不提取也不嵌入图片
  默认          图片模式，提取图片 URL 并以 ![](url) 嵌入 content
"""

import sys
import json
import asyncio
from datetime import datetime


async def fetch_weixin_article(url: str, extract_images: bool = True) -> dict:
    """Fetch and parse a WeChat article.

    Args:
        url: WeChat article URL
        extract_images: True=图片模式(默认), False=纯文本模式
    """
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
            await page.wait_for_selector("#js_content", timeout=20000)
            html = await page.content()
        except Exception as e:
            await browser.close()
            return {"error": f"Failed to load page: {e}"}
        await browser.close()

    if not html:
        return {"error": "No HTML content retrieved"}

    soup = BeautifulSoup(html, "lxml")

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

    content_el = soup.select_one("#js_content")
    if not content_el:
        return {"error": "Could not find article content (#js_content)"}

    for tag in content_el.find_all(["script", "style"]):
        tag.decompose()

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

    img_urls = []
    if extract_images:
        for img in content_el.find_all("img"):
            src = img.get("data-src") or img.get("src") or ""
            if src and not any(x in src for x in ["qpic.cn/64", "qlogo.cn", "mmemoji", "mmurl"]):
                img_urls.append(src)
                img.replace_with(f"\n![image]({src})\n")
            else:
                img.decompose()
    else:
        for img in content_el.find_all("img"):
            img.decompose()

    lines = []
    for element in content_el.find_all(["p", "h1", "h2", "h3", "h4", "section", "blockquote"]):
        text = element.get_text(strip=True)
        if not text:
            continue
        tag = element.name
        if tag in ("h1", "h2", "h3", "h4"):
            prefix = "#" * int(tag[1])
            lines.append(f"{prefix} {text}")
        elif tag == "blockquote":
            lines.append(f"> {text}")
        else:
            lines.append(text)

    content = "\n\n".join(lines)

    if not content.strip():
        content = content_el.get_text("\n", strip=True)

    return {
        "title": title,
        "author": author,
        "publish_time": publish_time,
        "content": content,
        "url": url,
        "img_urls": img_urls if extract_images else [],
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
        print("Usage: fetch_weixin.py <weixin_url> [--json] [--no-images]", file=sys.stderr)
        print(__doc__)
        sys.exit(1)

    url = sys.argv[1]
    use_json = "--json" in sys.argv
    extract_images = "--no-images" not in sys.argv

    result = asyncio.run(fetch_weixin_article(url, extract_images=extract_images))

    if use_json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(format_as_markdown(result))

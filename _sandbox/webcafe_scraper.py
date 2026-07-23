#!/usr/bin/env python3
"""
webcafe article scraper helper.
Takes article URLs, navigates via chrome-devtools, extracts content, downloads images.

The main extraction is done via chrome-devtools_evaluate_script on the connected Chrome.
This script handles:
1. Converting extracted HTML to markdown
2. Downloading images
3. Saving files
"""
import json
import os
import sys
import urllib.request
import urllib.parse
import re
import ssl

SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.55 Safari/537.36',
    'Referer': 'https://new.web.cafe/',
}

ARTICLES = [
    {
        "id": 9,
        "url": "https://new.web.cafe/tutorial/detail/uGhSzkFUooAwd77V4yvPgC",
        "title": "分享个搜索量跟 Midjourney 和 Stable Diffusion 差不多的关键词，有个单页网站用这个关键词赚了100万"
    },
    {
        "id": 10,
        "url": "https://new.web.cafe/tutorial/detail/beYVJMzigPiWFuSpHKYyX3",
        "title": "【哥飞分享】通过查看 vercel.app 的子域名发现新需求、新关键词"
    },
    {
        "id": 11,
        "url": "https://new.web.cafe/tutorial/detail/4zH66cGDYsE8vAXyhEuAuQ",
        "title": "对于我们来说，尽快多赚点美元可能是最适合我们的方案。"
    },
    {
        "id": 12,
        "url": "https://new.web.cafe/tutorial/detail/62rEqHuhk2iSPGprEQtVe4",
        "title": "哥飞解读：年收入1400万美元的一人公司为何这么赚？"
    },
    {
        "id": 13,
        "url": "https://new.web.cafe/tutorial/detail/bPiHN9jQSeSYtqBAEGCxSq",
        "title": "国庆放假大家都没闲着，都在上新站搞流量赚美元；社群配套网站首次亮相"
    },
    {
        "id": 14,
        "url": "https://new.web.cafe/tutorial/detail/vbuUJSWx8TWT5z6yjSkEVV",
        "title": "与纯银探讨再聊我们为什么要出海赚美元"
    },
    {
        "id": 15,
        "url": "https://new.web.cafe/tutorial/detail/hrwYeosrLhjWp7smCpYgTy",
        "title": "为何这个年收入130万美元的网站每月只有六万多访问量？"
    },
    {
        "id": 16,
        "url": "https://new.web.cafe/tutorial/detail/nnREFp7pWxhf9nzc4UygcQ",
        "title": "每天不到100UV的网站也有人付费；11月初做的网站现在已经月收入3000美元了！"
    },
    {
        "id": 17,
        "url": "https://new.web.cafe/tutorial/detail/byVyDasjfDBssYMwijjzGb",
        "title": "上站，上站，朋友们请上站！想要赚美元就多上站！"
    },
    {
        "id": 18,
        "url": "https://new.web.cafe/tutorial/detail/fjdhxvvcsq",
        "title": "漫游找词SOP"
    },
]


def html_to_markdown(html):
    """Convert the article HTML divs to markdown."""
    lines = []
    # Split by <div> blocks
    div_blocks = re.findall(r'<div[^>]*>(.*?)</div>', html, re.DOTALL)
    
    for block in div_blocks:
        block = block.strip()
        if not block:
            continue
        
        # Extract images
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', block)
        
        # Extract links
        links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', block, re.DOTALL)
        
        # Remove HTML tags to get text
        text = re.sub(r'<[^>]+>', '', block)
        text = re.sub(r'&nbsp;', ' ', text)
        text = re.sub(r'&amp;', '&', text)
        text = re.sub(r'&lt;', '<', text)
        text = re.sub(r'&gt;', '>', text)
        text = re.sub(r'\n+', '\n', text).strip()
        
        if not text:
            continue
        
        # Build markdown block
        block_md = []
        # Split text by lines to interleave images
        text_lines = text.split('\n')
        
        for i, line in enumerate(text_lines):
            line = line.strip()
            if not line:
                block_md.append('')
                continue
            
            # Replace links
            for href, link_text in links:
                link_text_clean = re.sub(r'<[^>]+>', '', link_text).strip()
                if link_text_clean in line:
                    line = line.replace(link_text_clean, f'[{link_text_clean}]({href})')
            
            block_md.append(line)
        
        # Add images after the text
        if imgs:
            for img_url in imgs:
                block_md.append(f'![image]({img_url})')
        
        lines.extend(block_md)
    
    return '\n'.join(lines).strip()


def sanitize_filename(name):
    """Sanitize a filename for filesystem use."""
    # Replace special chars
    safe = re.sub(r'[\\/:*?"<>|]', '_', name)
    # Truncate
    safe = safe[:80]
    return safe


def download_image(url, dest_path):
    """Download an image from URL."""
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30, context=SSL_CONTEXT) as resp:
            data = resp.read()
            with open(dest_path, 'wb') as f:
                f.write(data)
            return True, len(data)
    except Exception as e:
        return False, str(e)


def extract_images_from_md(md):
    """Extract image URLs from markdown."""
    return re.findall(r'!\[[^\]]*\]\((https?://[^)]+)\)', md)


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 webcafe_scraper.py <article_index> <web-articles_dir>")
        print("  article_index: 0-based index into ARTICLES list")
        print("  web-articles_dir: directory to save extracted articles")
        sys.exit(1)
    
    idx = int(sys.argv[1])
    base_dir = sys.argv[2]
    
    if idx >= len(ARTICLES):
        print(f"Error: index {idx} out of range (max {len(ARTICLES)-1})")
        sys.exit(1)
    
    article = ARTICLES[idx]
    title = article['title']
    url = article['url']
    article_num = article['id']
    
    # Print article info for the agent to use
    print(json.dumps({
        "index": idx,
        "article_num": article_num,
        "title": title,
        "url": url,
        "safe_dir": sanitize_filename(title),
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

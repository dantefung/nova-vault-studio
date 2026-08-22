#!/usr/bin/env python3
"""批量抓 PMaker 145 个详情页 HTML → 转 markdown → 存到 docs/"""
import json
import re
import urllib.request
import time
import os
import html
from pathlib import Path

# 读取卡片数据拿到所有 href
data_path = Path("/home/fenghaolin/.cache/tmp/opencode/nova-pmaker-clone/docs/research/pmaker_data.json")
out_dir = Path("/home/fenghaolin/.cache/tmp/opencode/nova-pmaker-clone/docs/md/pmaker-detail")
out_dir.mkdir(parents=True, exist_ok=True)

with open(data_path) as f:
    data = json.load(f)

# 收集所有 href（唯一）
all_hrefs = set()
for cid, c in data['cats'].items():
    for card in c.get('cards', []):
        href = card.get('href', '')
        if href and href.endswith('.html'):
            all_hrefs.add(href)

print(f'Total {len(all_hrefs)} unique hrefs')

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    # 自动跟随 308 重定向
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        return resp.read().decode('utf-8'), resp.geturl()
    except urllib.request.HTTPError as e:
        # 处理 308 — 重新请求带 trailing slash
        if e.code == 308 and not url.endswith('/'):
            return fetch(url + '/')
        print(f'  FAIL {url}: HTTP {e.code}')
        return None, None
    except Exception as e:
        print(f'  FAIL {url}: {e}')
        return None, None

def html_to_md(html_text):
    """极简 HTML → markdown：去 tags 但保留基本结构"""
    # 提取 <title>
    title_m = re.search(r'<title>([^<]*)</title>', html_text)
    title = title_m.group(1).strip() if title_m else ''

    # 找到 <article class="prose"> 或 <article> 的内容
    prose_m = re.search(r'<article[^>]*>(.*?)</article>', html_text, re.DOTALL)
    if not prose_m:
        return None, title

    body = prose_m.group(1)

    # 移除 script/style
    body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
    body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.DOTALL)

    # 转换标题
    body = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n# \1\n', body, flags=re.DOTALL)
    body = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n## \1\n', body, flags=re.DOTALL)
    body = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n### \1\n', body, flags=re.DOTALL)

    # 转换 <ul><li>
    body = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1\n', body, flags=re.DOTALL)
    body = re.sub(r'</?ul[^>]*>', '\n', body)

    # 转换 <p>
    body = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', body, flags=re.DOTALL)

    # 转换 <code> 和 <pre>
    body = re.sub(r'<pre[^>]*>(.*?)</pre>', r'\n```\n\1\n```\n', body, flags=re.DOTALL)
    body = re.sub(r'<code[^>]*>(.*?)</code>', r'`\1`', body)

    # 转换 <strong> / <b>
    body = re.sub(r'<(strong|b)[^>]*>(.*?)</\1>', r'**\2**', body, flags=re.DOTALL)

    # 移除所有剩余 tag
    body = re.sub(r'<[^>]+>', '', body)

    # 解码 HTML entities
    body = html.unescape(body)

    # 合并多余空白
    body = re.sub(r'\n{3,}', '\n\n', body)
    body = re.sub(r'  +', ' ', body)

    return body.strip(), title

success = 0
failed = []
for i, href in enumerate(sorted(all_hrefs)):
    # URL (PMaker 重定向 .html 到无扩展名)
    url = f'https://pmaker.space/{href.replace(".html", "")}'
    out_path = out_dir / href.replace('/', '__')

    if out_path.exists() and out_path.stat().st_size > 500:
        success += 1
        continue

    print(f'[{i+1}/{len(all_hrefs)}] {href}', end=' ... ')
    html_text, final_url = fetch(url)
    if not html_text:
        failed.append(href)
        print('SKIP')
        continue

    body, title = html_to_md(html_text)
    if not body or len(body) < 100:
        print('too short, skip')
        continue

    # 写 markdown 文件
    out_path.write_text(f'---\ntitle: "{title}"\ndate: "2026-08-22"\nsource: "pmaker.space"\nurl: "https://pmaker.space/{href}"\n---\n\n# {title}\n\n{body}\n', encoding='utf-8')
    success += 1
    print(f'OK ({len(body)} bytes)')
    time.sleep(0.3)  # polite

print(f'\nDone: {success} ok, {len(failed)} failed')
if failed:
    print('Failed:')
    for f in failed:
        print(f'  {f}')
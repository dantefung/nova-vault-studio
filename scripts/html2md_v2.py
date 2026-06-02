#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""HTML -> MD 转换 v2（更激进的清洗，移除内嵌 HTML 结构）"""
import subprocess
import re
import sys
from pathlib import Path

SRC = Path("D:/prj/develop/Macaroon-Spring-Family/spring-boot-kata/spring-boot-best-practice/doc")
DST = Path("D:/prj/opensource/nova-vault-studio/docs/md/columns/java-best-practices/03-clean-code")

FILES = [
    ("26丨单例模式：如何创建单一对象优化系统性能？.html",
     "单例模式：如何创建单一对象优化系统性能"),
    ("27丨原型模式与享元模式：提升系统性能的利器.html",
     "原型模式与享元模式：提升系统性能的利器"),
    ("29 丨 生产者消费者模式：电商库存设计优化.html",
     "生产者消费者模式：电商库存设计优化"),
    (Path("cleancode/context_pattern/28丨如何使用设计模式优化并发编程？.html"),
     "如何使用设计模式优化并发编程"),
]

DST.mkdir(parents=True, exist_ok=True)


def to_win_path(p: Path) -> str:
    return str(p).replace("/", "\\")


def clean_html_tags(content: str) -> str:
    """在 pandoc 输出后，进一步清理残留的 HTML 标签（保留合法表格/图片）"""
    # 1) 移除所有 <div>、<span>、<section>、<article> 等容器（保留内容）
    # 保留：table/thead/tbody/tr/th/td/img/a/code/pre/strong/em
    keep_tags = {'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'a', 'code', 'pre', 'strong', 'em', 'b', 'i', 'u', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'blockquote'}

    def replace_tag(match):
        tag = match.group(1)
        if tag.lower() in keep_tags:
            return match.group(0)  # 保留
        return ''  # 移除（保留内部文本）

    # 移除开/闭标签
    content = re.sub(r'<(/?)([A-Za-z][A-Za-z0-9-]*)([^>]*?)>', replace_tag, content)

    # 2) 移除残留的 <font style="..."> 等（pandoc 有时输出）
    content = re.sub(r'</?font[^>]*>', '', content)

    # 3) 移除 <style>...</style> 块
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)

    # 4) 移除空 class/style 属性
    content = re.sub(r'\s+class="[^"]*"', '', content)
    content = re.sub(r'\s+style="[^"]*"', '', content)
    content = re.sub(r'\s+id="[^"]*"', '', content)

    # 5) 合并连续空行
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content


for src_name, title in FILES:
    src_path = SRC / src_name if isinstance(src_name, Path) else SRC / src_name
    if not src_path.exists():
        print(f"MISSING: {src_path}", file=sys.stderr)
        continue

    win_path = to_win_path(src_path)
    # 用更激进的 pandoc 选项
    result = subprocess.run(
        [
            "pandoc",
            "-f", "html",
            "-t", "gfm",
            "--wrap=none",
            "--no-highlight",       # 不加语法高亮 span
            "--strip-comments",     # 去 HTML 注释
            win_path,
        ],
        capture_output=True, text=True, encoding="utf-8"
    )
    if result.returncode != 0:
        print(f"PANDOC FAILED: {src_path}\n{result.stderr}", file=sys.stderr)
        continue

    md_content = result.stdout
    # 后处理：清理残留 HTML 标签
    md_content = clean_html_tags(md_content)

    safe_name = re.sub(r'[\\/:*?"<>|？]', '-', title)
    out_path = DST / f"{safe_name}.md"

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(f'title: "{title}"\n')
        f.write(f'date: "2023-04-13"\n')
        f.write(f'source: "极客时间-设计模式专栏"\n')
        f.write("---\n\n")
        f.write(md_content)

    print(f"OK: {safe_name}.md ({len(md_content)} chars)")

# 复制上下文模式.md
ctx_md = SRC / "cleancode/context_pattern/上下文模式.md"
if ctx_md.exists():
    out_path = DST / "上下文模式.md"
    if not out_path.exists():
        content = ctx_md.read_text(encoding="utf-8")
        if not content.startswith("---"):
            content = f'---\ntitle: "上下文模式"\ndate: "2023-04-13"\nsource: "极客时间-设计模式专栏"\n---\n\n{content}'
        out_path.write_text(content, encoding="utf-8")
        print(f"OK: 上下文模式.md (copied)")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""HTML -> MD 转换 v3：用 markdownify 深度清洗极客时间文章"""
import re
from pathlib import Path
from bs4 import BeautifulSoup
from markdownify import MarkdownConverter

SRC = Path("D:/prj/develop/Macaroon-Spring-Family/spring-boot-kata/spring-boot-best-practice/doc")
DST = Path("D:/prj/opensource/nova-vault-studio/docs/md/columns/java-best-practices/03-clean-code")

# (源路径, 输出文件名, 标题)
FILES = [
    ("26丨单例模式：如何创建单一对象优化系统性能？.html",
     "单例模式：如何创建单一对象优化系统性能", "单例模式：如何创建单一对象优化系统性能"),
    ("27丨原型模式与享元模式：提升系统性能的利器.html",
     "原型模式与享元模式：提升系统性能的利器", "原型模式与享元模式：提升系统性能的利器"),
    ("29 丨 生产者消费者模式：电商库存设计优化.html",
     "生产者消费者模式：电商库存设计优化", "生产者消费者模式：电商库存设计优化"),
    (Path("cleancode/context_pattern/28丨如何使用设计模式优化并发编程？.html"),
     "如何使用设计模式优化并发编程", "如何使用设计模式优化并发编程"),
]


class GeekTimeConverter(MarkdownConverter):
    """定制 markdownify：处理极客时间的特殊结构"""
    def convert_img(self, el, text, parent_tags):
        src = el.get('src', '')
        alt = el.get('alt', '')
        if not src or src.startswith('data:'):
            return ''
        # 转相对路径
        return f'\n\n![{alt}]({src})\n\n'


def find_article_content(soup: BeautifulSoup) -> BeautifulSoup:
    """找极客时间文章主内容容器"""
    # 极客时间文章通常有 _2Mnln6T5_0 或 rich_content 或 article_content 这样的 class
    candidates = [
        soup.find('div', class_=re.compile(r'rich_content|article_content|article-body')),
        soup.find('div', id='js_content'),
        soup.find('article'),
        soup.find('main'),
    ]
    for c in candidates:
        if c:
            return c
    return soup  # fallback: 全文


def clean_html(html_str: str) -> str:
    soup = BeautifulSoup(html_str, 'html.parser')

    # 1) 找主内容
    content = find_article_content(soup)
    if content is soup:
        # fallback: 删除明显非正文的元素
        for tag in soup.find_all(['script', 'style', 'svg', 'noscript', 'iframe']):
            tag.decompose()
        for sel in ['header', 'footer', 'nav', 'aside', '[class*="comment"]',
                    '[class*="sidebar"]', '[class*="ad"]', '[class*="recommend"]',
                    '[class*="related"]', '[class*="promotion"]']:
            for el in soup.select(sel):
                el.decompose()

    # 2) 删所有 class/style/id/data-* 属性（保留语义）
    for tag in content.find_all(True):
        attrs_to_keep = {}
        for k, v in tag.attrs.items():
            if k in ('href', 'src', 'alt', 'title'):
                attrs_to_keep[k] = v
        tag.attrs = attrs_to_keep

    # 3) 删空标签（无文本且无图片）
    for tag in content.find_all(['span', 'div', 'section', 'article']):
        if not tag.get_text(strip=True) and not tag.find(['img']):
            tag.decompose()

    return str(content)


def convert_one(src_name, out_name, title):
    src_path = SRC / src_name if isinstance(src_name, Path) else SRC / src_name
    if not src_path.exists():
        print(f'MISS: {src_path}')
        return False

    html = src_path.read_text(encoding='utf-8')
    cleaned_html = clean_html(html)

    md = GeekTimeConverter(
        heading_style='ATX',
        bullets='-',
        strip=['script', 'style', 'svg', 'noscript', 'iframe'],
    ).convert(cleaned_html)

    # 后处理：合并空行、清理
    md = re.sub(r'\n{3,}', '\n\n', md)
    md = re.sub(r'^[ \t]+$', '', md, flags=re.MULTILINE)

    # 后处理：把代码块外的 Java 泛型（<T>, <String>, <clinit>, <Object>, <K>, <V> 等）用反引号包
    GENERIC_TYPES = (
        'T', 'K', 'V', 'E', 'R', 'S', 'U',
        'String', 'Integer', 'Long', 'Boolean', 'Double', 'Float',
        'Object', 'List', 'Map', 'Set', 'Collection', 'ArrayList', 'HashMap',
        'Context', 'Scenario', 'Request', 'Response', 'Element', 'Node',
        'Consumer', 'Supplier', 'Function', 'Predicate', 'Observer',
        'clinit',
    )
    new_lines = []
    in_code = False
    for line in md.split('\n'):
        if line.strip().startswith('```'):
            in_code = not in_code
            new_lines.append(line)
            continue
        if in_code:
            new_lines.append(line)
            continue
        # 用 token 解析：跳过行内反引号代码
        parts = re.split(r'(`+)', line)
        in_inline = False
        for i, part in enumerate(parts):
            if re.match(r'^`+$', part):
                in_inline = not in_inline if len(part) % 2 == 1 else in_inline
                continue
            if in_inline:
                continue
            for tag in GENERIC_TYPES:
                part = re.sub(rf'<{re.escape(tag)}>', f'`&lt;{tag}&gt;`', part)
            parts[i] = part
        new_lines.append(''.join(parts))
    md = '\n'.join(new_lines)

    safe_name = re.sub(r'[\\/:*?"<>|？]', '-', title)
    out_path = DST / f"{safe_name}.md"

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('---\n')
        f.write(f'title: "{title}"\n')
        f.write(f'date: "2023-04-13"\n')
        f.write(f'source: "极客时间-设计模式专栏"\n')
        f.write('---\n\n')
        f.write(md)

    print(f'OK: {safe_name}.md ({len(md)} chars, HTML {len(cleaned_html)} chars)')
    return True


if __name__ == '__main__':
    # 先测试 1 个文件
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'all':
        for src, out, title in FILES:
            convert_one(src, out, title)
    else:
        # 只测 1 个
        src, out, title = FILES[0]
        convert_one(src, out, title)

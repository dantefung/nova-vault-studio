#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""HTML -> MD 转换（Windows 下用 D:/prj/... 形式）"""
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


for src_name, title in FILES:
    src_path = SRC / src_name if isinstance(src_name, Path) else SRC / src_name
    if not src_path.exists():
        print(f"MISSING: {src_path}", file=sys.stderr)
        continue

    win_path = to_win_path(src_path)
    result = subprocess.run(
        ["pandoc", "-f", "html", "-t", "gfm", "--wrap=none", win_path],
        capture_output=True, text=True, encoding="utf-8"
    )
    if result.returncode != 0:
        print(f"PANDOC FAILED: {src_path}\n{result.stderr}", file=sys.stderr)
        continue

    md_content = result.stdout
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

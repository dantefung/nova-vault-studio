#!/usr/bin/env python3
"""
content-factory Pipeline Runner

Usage:
    python3 scripts/run-pipeline.py <source_dir> [--wiki-path <path>]

Example:
    python3 scripts/run-pipeline.py /tmp/my-materials
    python3 scripts/run-pipeline.py /tmp/my-materials --wiki-path /opt/workspace/nova-vault-studio/content-factory
"""

import sys
import os
import json
import hashlib
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional

TEMPLATE_TOPIC_MAP = """{
  "version": "1.0",
  "topics": [],
  "tags": {}
}"""

TEMPLATE_GRAPH = """{
  "version": "1.0",
  "nodes": [],
  "edges": []
}"""

CATEGORY_PATTERNS = {
    "case": [
        r"时间线", r"年/月/日", r"结果", r"案例", r"项目", r"实施过程",
        r"完成了", r"实现了", r"达成了", r"从.*到.*"
    ],
    "solution": [
        r"方案", r"解法", r"解决思路", r"步骤", r"流程", r"方法论",
        r"具体做法", r"实现方案", r"最佳实践"
    ],
    "concept": [
        r"定义", r"概念", r"理论", r"框架", r"原理", r"本质",
        r"是什么", r"指的是", r"构成要素", r"核心要素"
    ],
    "opinion": [
        r"认为", r"观点", r"应该", r"不合理", r"批判", r"支持",
        r"立场", r"看法", r"我的判断", r"我觉得", r"论点"
    ],
    "problem": [
        r"问题", r"痛点", r"困难", r"挑战", r"瓶颈", r"障碍",
        r"难点", r"待解决", r"卡在", r"为什么", r"无法"
    ]
}

CATEGORY_DIRS = ["cases", "solutions", "concepts", "opinions", "problems"]


def slugify(text: str) -> str:
    text = re.sub(r'[^\w\s\u4e00-\u9fff-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.lower().strip('-')[:60]


def classify_content(text: str) -> tuple[str, float]:
    scores = {}
    for cat, patterns in CATEGORY_PATTERNS.items():
        score = sum(1 for p in patterns if re.search(p, text))
        scores[cat] = score
    if max(scores.values()) == 0:
        return "concept", 0.0
    best = max(scores, key=scores.get)
    return best, scores[best]


def scan_sources(source_dir: str, dest_dir: str) -> list[dict]:
    Path(dest_dir).mkdir(parents=True, exist_ok=True)
    files = []
    for root, _, filenames in os.walk(source_dir):
        for fn in filenames:
            if fn.endswith(('.md', '.txt')):
                fp = os.path.join(root, fn)
                rel = os.path.relpath(fp, source_dir)
                dest = os.path.join(dest_dir, rel)
                Path(os.path.dirname(dest)).mkdir(parents=True, exist_ok=True)
                shutil.copy2(fp, dest)
                with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                    preview = f.read(500)
                files.append({
                    "path": dest,
                    "name": fn,
                    "preview": preview[:200]
                })
    return files


def clean_content(source_file: str, cleaned_root: str) -> Optional[dict]:
    with open(source_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    category, score = classify_content(content)
    slug = slugify(Path(source_file).stem)
    category_slug = f"{category}-{slug}"

    category_dir = Path(cleaned_root) / CATEGORY_DIRS[CATEGORY_DIRS.index(category + 's')]
    category_dir.mkdir(parents=True, exist_ok=True)

    title = Path(source_file).stem.replace('-', ' ').replace('_', ' ').title()

    frontmatter = f"""---
title: "{title}"
date: "{datetime.now().strftime('%Y-%m-%d')}"
source_file: "{source_file}"
category: "{category}"
tags: []
summary: "{content[:150].strip()}"
---

"""

    with open(category_dir / f"{category_slug}.md", 'w', encoding='utf-8') as f:
        f.write(frontmatter + content)

    return {
        "id": category_slug,
        "title": title,
        "category": category,
        "tags": [],
        "summary": content[:150].strip(),
        "source_file": source_file,
        "path": str(category_dir / f"{category_slug}.md")
    }


def build_topic_map(cleaned_root: str, output_file: str):
    topics = []
    tag_map = {}

    for cat_dir in CATEGORY_DIRS:
        cat_path = Path(cleaned_root) / cat_dir
        if not cat_path.exists():
            continue
        for fp in cat_path.glob("*.md"):
            with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            frontmatter_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
            tags = []
            summary = ""
            if frontmatter_match:
                fm = frontmatter_match.group(1)
                tag_match = re.search(r'tags:\s*\[(.*?)\]', fm, re.DOTALL)
                if tag_match:
                    tags = [t.strip().strip('"') for t in tag_match.group(1).split(',')]
                summary_match = re.search(r'summary:\s*["\'](.*?)["\']', fm, re.DOTALL)
                if summary_match:
                    summary = summary_match.group(1)

            topic_id = fp.stem
            for tag in tags:
                if tag not in tag_map:
                    tag_map[tag] = []
                tag_map[tag].append(topic_id)

            topics.append({
                "id": topic_id,
                "title": fp.stem.replace('-', ' ').title(),
                "category": cat_dir[:-1],
                "tags": tags,
                "summary": summary,
                "related": [],
                "source_file": str(fp),
                "created_at": datetime.now().strftime('%Y-%m-%d'),
                "updated_at": datetime.now().strftime('%Y-%m-%d')
            })

    data = {"version": "1.0", "topics": topics, "tags": tag_map}
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✅ topic-map.json: {len(topics)} topics, {len(tag_map)} tags")


def build_graph(topic_map_file: str, graph_file: str):
    with open(topic_map_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    topics = data.get("topics", [])
    tags = data.get("tags", {})

    topic_ids = [t["id"] for t in topics]
    edges = []
    seen_edges = set()

    for tag, tids in tags.items():
        for i, a in enumerate(tids):
            for b in tids[i+1:]:
                edge_key = tuple(sorted([a, b]))
                if edge_key not in seen_edges:
                    seen_edges.add(edge_key)
                    edges.append({
                        "from": a,
                        "to": b,
                        "reason": f"同标签「{tag}」",
                        "weight": 0.8
                    })

    graph_data = {"version": "1.0", "nodes": topic_ids, "edges": edges}
    with open(graph_file, 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, ensure_ascii=False, indent=2)
    print(f"  ✅ graph.json: {len(topic_ids)} nodes, {len(edges)} edges")


def assemble(topic_map_file: str, query: str, output_dir: str) -> str:
    with open(topic_map_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    query_lower = query.lower()
    keywords = re.findall(r'[\w]+', query_lower)

    scored = []
    for topic in data["topics"]:
        score = 0
        text = (topic.get("title", "") + " " + topic.get("summary", "") + " " + " ".join(topic.get("tags", []))).lower()
        for kw in keywords:
            if kw in text:
                score += 1
        score += len(topic.get("tags", [])) * 0.3
        if score > 0:
            scored.append((score, topic))

    scored.sort(key=lambda x: -x[0])
    selected = scored[:5]

    timestamp = datetime.now().strftime('%Y%m%d%H%M')
    title_slug = slugify(query)[:30]
    draft_file = Path(output_dir) / f"draft-{title_slug}-{timestamp}.md"
    draft_file.parent.mkdir(parents=True, exist_ok=True)

    source_ids = [s[1]["id"] for s in selected]
    content_lines = [f"# {query}\n"]
    content_lines.append(f"\n> 自动装配草稿 | 来源：{len(selected)} 个主题节点\n")
    content_lines.append("\n## 相关主题\n")
    for score, topic in selected:
        content_lines.append(f"- **{topic['title']}**（{topic['category']}）：{topic['summary']}")
    content_lines.append("\n## 正文\n")
    content_lines.append("（基于上述主题节点自动生成的草稿框架）\n")

    body = "\n".join(content_lines)
    with open(draft_file, 'w', encoding='utf-8') as f:
        f.write(body)

    print(f"  ✅ 草稿已生成：{draft_file}")
    return str(draft_file)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Content Factory Pipeline")
    parser.add_argument("source_dir", help="原始素材目录")
    parser.add_argument("--wiki-path", default="content-factory", help="content-factory 根目录")
    parser.add_argument("--query", default="", help="选题描述（可选，启动选题装配）")
    args = parser.parse_args()

    wiki_path = Path(args.wiki_path)
    raw_sources = wiki_path / "raw" / "sources"
    cleaned_root = wiki_path / "cleaned"
    topic_map_file = wiki_path / "topic-map.json"
    graph_file = wiki_path / "graph.json"
    index_file = wiki_path / "index.md"
    log_file = wiki_path / "log.md"
    assembly_dir = wiki_path / "assembly" / "drafts"

    for d in [raw_sources, cleaned_root, assembly_dir]:
        d.mkdir(parents=True, exist_ok=True)

    print("\n📥 Step 1：扫描本地素材")
    files = scan_sources(args.source_dir, str(raw_sources))
    print(f"  ✅ 扫描了 {len(files)} 个文件 → {raw_sources}")

    print("\n🧹 Step 2：五类清洗")
    topic_nodes = []
    for fp in raw_sources.glob("**/*"):
        if fp.suffix in ('.md', '.txt'):
            result = clean_content(str(fp), str(cleaned_root))
            if result:
                topic_nodes.append(result)
    print(f"  ✅ 清洗了 {len(topic_nodes)} 个文件")

    print("\n🗺️ Step 3-4：构建主题地图")
    if not topic_map_file.exists():
        with open(topic_map_file, 'w') as f:
            f.write(TEMPLATE_TOPIC_MAP)
    build_topic_map(str(cleaned_root), str(topic_map_file))

    print("\n🔗 Step 5：构建关系图谱")
    if not graph_file.exists():
        with open(graph_file, 'w') as f:
            f.write(TEMPLATE_GRAPH)
    build_graph(str(topic_map_file), str(graph_file))

    if args.query:
        print(f"\n🛠️ Step 6：选题装配")
        assemble(str(topic_map_file), args.query, str(assembly_dir))
    else:
        print(f"\n⏭️ Step 6：跳过（未指定 --query）")

    print("\n✅ 流水线执行完成！")
    print(f"   主题地图：{topic_map_file}")
    print(f"   关系图谱：{graph_file}")
    if args.query:
        print(f"   装配草稿：{assembly_dir}/")


if __name__ == "__main__":
    main()

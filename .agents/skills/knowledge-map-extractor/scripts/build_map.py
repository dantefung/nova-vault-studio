#!/usr/bin/env python3
"""Validate a semantic draft, assign IDs, detect cycles, and render a knowledge map."""

import argparse
import html
import json
import sys
from collections import defaultdict, deque
from pathlib import Path


def fail(message):
    raise ValueError(message)


def text(value, field, low=None, high=None):
    if not isinstance(value, str) or not value.strip():
        fail(f"{field} must be a non-empty string")
    value = value.strip()
    if low is not None and len(value) < low:
        fail(f"{field} must contain at least {low} characters")
    if high is not None and len(value) > high:
        fail(f"{field} must contain at most {high} characters")
    return value


def object_value(value, field):
    if not isinstance(value, dict):
        fail(f"{field} must be an object")
    return value


def load_draft(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot read draft JSON: {exc}")
    if not isinstance(data, dict):
        fail("draft must be a JSON object")
    return data


def has_cycle(node_ids, edges):
    adjacency = defaultdict(list)
    indegree = {node_id: 0 for node_id in node_ids}
    for source, target in edges:
        adjacency[source].append(target)
        indegree[target] += 1
    queue = deque(node_id for node_id, degree in indegree.items() if degree == 0)
    visited = 0
    while queue:
        source = queue.popleft()
        visited += 1
        for target in adjacency[source]:
            indegree[target] -= 1
            if indegree[target] == 0:
                queue.append(target)
    return visited != len(node_ids)


def build_model(data):
    title = text(data.get("title"), "title")
    thesis = text(data.get("thesis"), "thesis", 30, 50)
    orientation = data.get("orientation")
    if orientation not in {"static", "dynamic", "balanced"}:
        fail("orientation must be static, dynamic, or balanced")

    raw_static = data.get("static_nodes")
    if not isinstance(raw_static, list):
        fail("static_nodes must be an array")
    raw_static = [object_value(node, f"static_nodes[{index}]") for index, node in enumerate(raw_static, 1)]
    roots = [node for node in raw_static if node.get("level") == "root"]
    branches = [node for node in raw_static if node.get("level") == "branch"]
    if len(roots) != 1:
        fail("static_nodes must contain exactly one root")
    if not 2 <= len(branches) <= 6:
        fail("static_nodes must contain 2–6 branches")

    keys = set()
    static = []
    static_by_key = {}
    for index, raw in enumerate(raw_static, 1):
        key = text(raw.get("key"), f"static_nodes[{index}].key")
        if key in keys:
            fail(f"duplicate key: {key}")
        keys.add(key)
        level = raw.get("level")
        if level not in {"root", "branch", "leaf"}:
            fail(f"invalid static level for {key}")
        parent = raw.get("parent")
        if level == "root" and parent is not None:
            fail("root parent must be null")
        if level != "root" and parent not in static_by_key:
            fail(f"parent for {key} must reference an earlier static node")
        if level == "branch" and static_by_key[parent]["level"] != "root":
            fail(f"branch {key} must be a child of root")
        if level == "leaf" and static_by_key[parent]["level"] != "branch":
            fail(f"leaf {key} must be a child of branch")
        node = {
            "id": f"S{index}", "key": key, "level": level,
            "name": text(raw.get("name"), f"static_nodes[{index}].name"),
            "summary": text(raw.get("summary"), f"static_nodes[{index}].summary", 30, 50),
            "parent": static_by_key[parent]["id"] if parent else None,
        }
        static.append(node)
        static_by_key[key] = node

    tracks = data.get("tracks")
    if not isinstance(tracks, list):
        fail("tracks must be an array")
    activities = []
    activity_by_key = {}
    normalized_tracks = []
    activity_index = 0
    for track_index, raw_track in enumerate(tracks, 1):
        raw_track = object_value(raw_track, f"tracks[{track_index}]")
        track_name = text(raw_track.get("name"), f"tracks[{track_index}].name")
        raw_activities = raw_track.get("activities")
        if not isinstance(raw_activities, list) or not raw_activities:
            fail(f"track {track_name} must contain activities")
        track_activity_ids = []
        for sequence, raw in enumerate(raw_activities, 1):
            activity_index += 1
            raw = object_value(raw, f"activity[{activity_index}]")
            key = text(raw.get("key"), f"activity[{activity_index}].key")
            if key in keys:
                fail(f"duplicate key: {key}")
            keys.add(key)
            node = {
                "id": f"D{activity_index}", "key": key, "track": track_name,
                "sequence": sequence,
                "name": text(raw.get("name"), f"activity[{activity_index}].name"),
                "summary": text(raw.get("summary"), f"activity[{activity_index}].summary", 30, 50),
            }
            activities.append(node)
            activity_by_key[key] = node
            track_activity_ids.append(node["id"])
        normalized_tracks.append({"id": f"T{track_index}", "name": track_name, "activities": track_activity_ids})

    def relations(name, source_field, target_field, source_lookup, target_lookup, kind):
        raw_relations = data.get(name)
        if not isinstance(raw_relations, list):
            fail(f"{name} must be an array")
        result = []
        seen = set()
        for index, raw in enumerate(raw_relations, 1):
            raw = object_value(raw, f"{name}[{index}]")
            source_key = raw.get(source_field)
            target_key = raw.get(target_field)
            if source_key not in source_lookup or target_key not in target_lookup:
                fail(f"{name}[{index}] references an unknown key")
            pair = (source_key, target_key)
            if pair in seen:
                fail(f"duplicate relation in {name}: {source_key} -> {target_key}")
            seen.add(pair)
            result.append({
                "id": f"{kind[0].upper()}{index}", "kind": kind,
                "source": source_lookup[source_key]["id"], "target": target_lookup[target_key]["id"],
                "reason": text(raw.get("reason"), f"{name}[{index}].reason", 1, 15),
            })
        return result

    mappings = relations("mappings", "static", "activity", static_by_key, activity_by_key, "mapping")
    feedback = relations("feedback", "activity", "static", activity_by_key, static_by_key, "feedback")
    if not activities and (mappings or feedback):
        fail("relations require at least one activity")

    edges = []
    for node in static:
        if node["parent"]:
            edges.append((node["parent"], node["id"]))
    for track in normalized_tracks:
        edges.extend(zip(track["activities"], track["activities"][1:]))
    edges.extend((relation["source"], relation["target"]) for relation in mappings + feedback)
    node_ids = [node["id"] for node in static + activities]
    cyclic = has_cycle(node_ids, edges)

    return {
        "meta": {
            "title": title, "thesis": thesis, "orientation": orientation,
            "isStrictDAG": not cyclic,
            "dagNote": "存在动态活动反哺静态知识的反馈回路" if cyclic else "未检测到有向环路",
        },
        "staticTree": {"root": static[0]["id"], "nodes": static},
        "dynamicFlow": {"tracks": normalized_tracks, "activities": activities},
        "crossMapping": mappings,
        "feedbackLoop": feedback,
    }


def render(model, template_path):
    template = template_path.read_text(encoding="utf-8")
    if "__KNOWLEDGE_MAP_DATA__" not in template:
        fail("template is missing __KNOWLEDGE_MAP_DATA__ placeholder")
    payload = json.dumps(model, ensure_ascii=False).replace("</", "<\\/")
    return template.replace("__KNOWLEDGE_MAP_DATA__", payload).replace(
        "__KNOWLEDGE_MAP_TITLE__", html.escape(model["meta"]["title"])
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("draft", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--model-only", action="store_true")
    args = parser.parse_args()
    try:
        model = build_model(load_draft(args.draft))
        args.output.mkdir(parents=True, exist_ok=True)
        model_path = args.output / "model.json"
        model_path.write_text(json.dumps(model, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {model_path}")
        if not args.model_only:
            skill_dir = Path(__file__).resolve().parent.parent
            output = render(model, skill_dir / "assets" / "map-template.html")
            html_path = args.output / "index.html"
            html_path.write_text(output, encoding="utf-8")
            print(f"Wrote {html_path}")
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

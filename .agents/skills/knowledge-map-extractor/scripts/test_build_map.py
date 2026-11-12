#!/usr/bin/env python3
import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).with_name("build_map.py")
SPEC = importlib.util.spec_from_file_location("build_map", SCRIPT)
BUILD_MAP = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILD_MAP)


def summary(prefix):
    return prefix + "，提炼核心关系并形成可验证、可复用且便于后续维护的结构化知识产出。"


def valid_draft():
    return {
        "title": "测试知识地图",
        "thesis": "分离静态概念与动态方法，再用映射和反馈还原文章知识如何支撑行动并持续演化。",
        "orientation": "balanced",
        "static_nodes": [
            {"key": "root", "level": "root", "name": "总模型", "summary": summary("统领全文"), "parent": None},
            {"key": "concept", "level": "branch", "name": "核心概念", "summary": summary("组织静态知识"), "parent": "root"},
            {"key": "rule", "level": "branch", "name": "规则约束", "summary": summary("定义行动边界"), "parent": "root"},
        ],
        "tracks": [{"name": "实践流程", "activities": [
            {"key": "act", "name": "执行实践", "summary": summary("执行方法以验证假设并沉淀")}
        ]}],
        "mappings": [{"static": "concept", "activity": "act", "reason": "概念支撑实践"}],
        "feedback": [{"activity": "act", "static": "concept", "reason": "实践修正概念"}],
    }


class BuildMapTests(unittest.TestCase):
    def test_builds_model_and_detects_feedback_cycle(self):
        model = BUILD_MAP.build_model(valid_draft())
        self.assertFalse(model["meta"]["isStrictDAG"])
        self.assertEqual(model["staticTree"]["root"], "S1")
        self.assertEqual(model["dynamicFlow"]["activities"][0]["id"], "D1")

    def test_rejects_short_summary(self):
        draft = valid_draft()
        draft["static_nodes"][0]["summary"] = "太短"
        with self.assertRaisesRegex(ValueError, "at least 30"):
            BUILD_MAP.build_model(draft)

    def test_model_without_feedback_is_a_dag(self):
        draft = valid_draft()
        draft["feedback"] = []
        self.assertTrue(BUILD_MAP.build_model(draft)["meta"]["isStrictDAG"])

    def test_rejects_non_object_array_element(self):
        draft = valid_draft()
        draft["static_nodes"][1] = "not an object"
        with self.assertRaisesRegex(ValueError, r"static_nodes\[2\] must be an object"):
            BUILD_MAP.build_model(draft)

    def test_rejects_unknown_relation_key(self):
        draft = valid_draft()
        draft["mappings"][0]["activity"] = "missing"
        with self.assertRaisesRegex(ValueError, "references an unknown key"):
            BUILD_MAP.build_model(draft)

    def test_rejects_invalid_parent_level(self):
        draft = valid_draft()
        draft["static_nodes"].append({
            "key": "bad", "level": "branch", "name": "错误分支",
            "summary": summary("错误挂载分支"), "parent": "concept",
        })
        with self.assertRaisesRegex(ValueError, "must be a child of root"):
            BUILD_MAP.build_model(draft)


if __name__ == "__main__":
    unittest.main()

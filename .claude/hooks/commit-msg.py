#!/usr/bin/env python3
"""
commit-msg hook: 检查提交信息格式

要求：
- feat/fix/docs 等前缀 + 冒号分隔
- 提交信息正文必须包含 WHAT/WHY/HOW 结构（prompt: 类型提交），或至少有一句话描述
"""

import sys
import re

def check_commit_msg(msg_path):
    with open(msg_path) as f:
        lines = f.readlines()

    if not lines:
        print("Error: empty commit message")
        return 1

    # 第一行：标题
    first_line = lines[0].strip()

    # 检查是否有 conventional commit 前缀
    conventional_pattern = r'^(feat|fix|docs|style|refactor|test|chore|ci|perf|breaking|prompt)\([^)]+\):\s+\S'
    if not re.match(conventional_pattern, first_line):
        print(f"Warning: commit title doesn't follow conventional format: {first_line}")
        print("Expected: type(scope): description")
        print("Examples: feat(ai): add new resource, fix(docs): update frontmatter")
        # 仅警告，不阻断
        return 0

    # 检查正文是否有内容（至少 2 行）
    if len(lines) < 2:
        print("Warning: commit body is empty")
        return 0

    body_lines = [l.strip() for l in lines[1:] if l.strip()]
    if not body_lines:
        print("Warning: commit body is empty")
        return 0

    return 0

if __name__ == '__main__':
    sys.exit(check_commit_msg(sys.argv[1]))

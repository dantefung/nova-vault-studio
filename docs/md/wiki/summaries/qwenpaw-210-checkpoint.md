---
title: "QwenPaw 2.1.0 Checkpoint 功能"
date: "2026-08-21"
source: "微信公众号（QwenPaw）"
url: "https://mp.weixin.qq.com/s/boQkF0r3HP0UdwHj3A2d5w"
---

# QwenPaw 2.1.0 Checkpoint 功能摘要

## 概述

QwenPaw 2.1.0 新增 Checkpoint 功能，类似游戏存档点，可保存 Agent 会话状态并在需要时回退。解决 Agent 对话走偏后的回滚难题——不用从头重新开始，回到还没走偏的节点继续。

## 三种节点

1. **命名快照**：手动创建，不参与自动 GC，适合保存重要状态
2. **自动检查点**：系统自动记录，按数量和时间规则清理
3. **恢复前安全点**：恢复前自动创建，防止恢复后想反悔

## 恢复范围

| 恢复范围 | 默认 | 内容 |
|------|------|------|
| 当前会话 | 包含 | 会话文件和 Agent 对话状态 |
| 长期记忆 | 不包含 | MEMORY.md 和 memory/ |
| 工作区文件 | 不包含 | 预览后明确选中的文件 |

## 命令

| 命令 | 说明 |
|------|------|
| `/checkpoint` | 查看帮助 |
| `/checkpoint auto [on\|off]` | 开关自动检查点 |
| `/checkpoint snapshot [名称]` | 创建命名快照 |
| `/checkpoint timeline [--limit=N] [--all]` | 查看检查点历史 |
| `/checkpoint restore <目标> [选项]` | 预览或执行恢复 |
| `/checkpoint gc [--all-sessions] [--compact]` | 预览或清理旧检查点 |
| `/checkpoint reset --confirm` | 清空历史并恢复默认配置 |

**关键参数**：`--dry-run`（预览）、`--confirm`（确认执行）、`--include-memory`、`--include-files`、`--files <路径...>`、`--all-sessions`、`--compact`（删除所有非 HEAD 自动检查点）

## 实战演示

以 `checkpoint-demo/state.txt` + `checkpoint-demo/temp.txt` 为例：
1. 创建基线快照 `demo-start`
2. 修改 state.txt + 新建 temp.txt
3. 预览恢复：state.txt 恢复、temp.txt 删除
4. 确认后恢复：文件 + 会话状态同时回滚

恢复后时间线保留原有历史并生成「恢复前安全点」。

## 核心观点

- Checkpoint 与项目 `.git/` 分离，不创建提交、不切换分支、不改写 Git 历史
- 恢复后形成新的时间线分支，后面历史不消失
- 目标不是频繁撤销，而是在 Agent 走偏时提供可靠的返回点
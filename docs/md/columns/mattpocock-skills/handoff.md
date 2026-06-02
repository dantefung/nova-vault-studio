---
title: "handoff 技能：对话压缩为交接文档"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# handoff 技能：对话压缩为交接文档

## 定位

将当前对话上下文**压缩为交接文档**，让另一个 agent 或人类可以继续工作，不需要重新了解背景。

## 交接文档结构

```markdown
# HANDOVER: [当前工作标题]

## 状态
- 已完成：...
- 进行中：...
- 阻塞：...

## 关键决策
- 决策 1：...（原因）
- 决策 2：...（原因）

## 依赖
- 依赖 A：等待...
- 依赖 B：已确认...

## 接下来
- 下一步动作 1：...
- 下一步动作 2：...

## 背景知识
（任何接手者需要知道的上下文）
```

## 与 zoom-out 的区别

| 维度 | handoff | zoom-out |
|------|---------|----------|
| 目的 | 交给别人继续 | 让自己理解 |
| 受众 | 另一个 agent / 人 | 当前 agent |
| 格式 | 结构化文档 | 即时上下文 |

## 典型场景

- Context 即将 reset，需要保存进度
- 交接给团队其他成员
- 切换分支继续工作
- Session 结束前的状态保存

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[zoom-out](./zoom-out.md)、[to-prd](./to-prd.md)
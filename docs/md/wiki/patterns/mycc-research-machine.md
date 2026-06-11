---
title: "MyCC Research Machine（AI研究机器四层架构）"
date: "2026-06-11"
---

# MyCC Research Machine（AI研究机器四层架构）

> 四工具组合：执行层（Claude Code）→ 定制层（Skill Creator）→ 分析层（NotebookLM）→ 记忆层（Obsidian），30 分钟搭建，能自我改进的研究流水线。

## Key Points

- **痛点**：大多数人做研究的方式——开十几个标签页，看视频，读文章，随手记笔记。一小时过去，打开二十个标签页，笔记软件里三行字，什么都没整理好
- **四层架构**：执行层 → 定制层 → 分析层 → 记忆层

## 四层架构

| 层级 | 工具 | 职责 |
|------|------|------|
| 执行层 | Claude Code | 用自然语言驱动，跑命令、调用技能、管理文件 |
| 定制层 | Skill Creator | 插件，人话描述需求 → 生成并安装 Skill |
| 分析层 | NotebookLM | 谷歌 AI 研究工具，生成摘要/分析/信息图/播客脚本，用谷歌算力不耗 Claude 额度 |
| 记忆层 | Obsidian | 本地 Markdown 知识库存所有产出，用得越久 Claude Code 越懂你的思维 |

## 核心逻辑

四个工具组合 = **一条能执行、能分析、能自我改进的研究流水线**：

1. Claude Code 接收研究任务
2. Skill Creator 定制所需 Skill
3. NotebookLM 分析来源资料（不消耗 Claude 额度）
4. Obsidian 存储产出，积累知识资产

越用越懂你的原因：Obsidian 作为记忆层让 Claude Code 持续学习你的思维方式和偏好。

## Related Pages

- [concepts/llm-wiki](concepts/llm-wiki) — LLM Wiki 知识库模式
- [patterns/personal-ai-infrastructure](patterns/personal-ai-infrastructure) — 个人AI基础设施

## Sources

- X/Twitter (2026-06-04)
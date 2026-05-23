---
title: hermes
---

# hermes

> 📖 Hermes Agent 完整知识体系，包含入门指南、架构解析、Skill 开发等。

## 学习路径

### Agent Codebase 解读技巧

Hermes Agent 架构文档推荐直接看官方文档，写得比较清楚。

用 Codex 或 Claude Code 打开项目代码库，直接让 Agent 解释代码库。如果不清楚可以随时追问，可以问任何想知道的问题，Agent 会通过检索项目文档和代码帮你解释清楚。

> **讓 agent 解釋自己的 codebase，這個學法比讀文檔快三倍**

让 Agent 解释代码时，记得要求：
- **带文件路径和行号**
- **按入口到主流程画调用链**

关键结论让 Agent 跑一次 demo 或对应测试用例验证，不然很容易讲得像对但实际不对。

<PdfList dir="hermes" />

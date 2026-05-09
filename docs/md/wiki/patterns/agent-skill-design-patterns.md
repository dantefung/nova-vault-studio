---
title: "Agent Skill 五种设计模式"
date: "2026-05-09"
---

# Agent Skill 五种设计模式

> 从 Anthropic、Vercel、Google 内部实践中总结的五种 Skill 内容设计模式。

## Key Points

- **Tool Wrapper**：让 Agent 按需获取特定库的上下文
- **Generator**：从可复用模板生成结构化文档
- **Reviewer**：按严重程度对照清单评审代码
- **Inversion**：Agent 先采访你，再开始行动
- **Pipeline**：强制执行带检查点的严格多步骤工作流

## Details

### 模式一：工具封装（Tool Wrapper）

将 API 规范打包成 Skill，Agent 只在需要时加载上下文。适合分发内部编码规范或框架最佳实践。

### 模式二：生成器（Generator）

从模板生成结构化文档。SKILL.md 定义模板和变量，Agent 填充内容后输出。

### 模式三：审查器（Reviewer）

按严重程度对照清单评审代码。包含检查项列表和严重程度分级。

### 模式四：反转（Inversion）

Agent 先通过采访收集信息，再开始执行任务。适合需求不明确的场景。

### 模式五：流水线（Pipeline）

强制执行带检查点的多步骤工作流，每步验证后才进入下一步。

## Related Pages

- [[products/claude-code-skills]]
- [[patterns/skill-building-guide]]
- [[concepts/prompt-engineering]]

## Sources

- docs/md/guide/ai/skills/03-Agent-Skill-五种设计模式.md

---
title: "Grokbot + Codex 工作流：Twitter 书签自动变开发任务"
date: "2026-09-29"
---

# Grokbot + Codex 工作流：Twitter 书签自动变开发任务

> 用 Grokbot 读 Twitter 书签，根据项目用例和技术分类，交给 VAS 服务器开发环境处理。

## 工作流

1. **Grokbot 读取 Twitter 书签**
2. **根据项目潜在用例和技术进行分类**
3. **把信息交给 VAS 服务器上的开发环境**
4. **Codex 和 Claude Code 自动 review 代码仓库**
5. **Codex 某个 session 作为协调者，决定是否需要开发**

## 核心思路

把 Twitter 书签从"收藏"变成"可执行的开发信号"，通过 AI 自动识别书签内容与代码仓库的关联，触发下一步开发决策。

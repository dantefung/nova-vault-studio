---
title: "Nova Vault Wiki"
date: "2026-05-09"
---

# Nova Vault Wiki

> 从 `docs/md/guide` 编译而成的结构化知识库，涵盖 AI 编程、系统架构、工具指南等专题。

---

## Concepts（核心概念）

| 页面 | 定义 |
|------|------|
| [Harness Engineering](concepts/harness-engineering) | 为 AI 编程 Agent 设计可靠运行环境的工程学科 |
| [Prompt Engineering](concepts/prompt-engineering) | 通过设计、优化输入提示词来引导 LLM 产生预期输出的实践学科 |
| [Agentic Architectures](concepts/agentic-architectures) | 从论文原型到生产系统的 17 种 Agent 架构模式 |
| [Vibe Coding](concepts/vibe-coding) | 用自然语言和 AI 快速构建功能原型的编程方式 |
| [RAG](concepts/rag) | 检索增强生成，将外部知识检索与LLM生成结合的技术架构 |
| [GraphRAG](concepts/graph-rag) | 图增强RAG，将知识图谱与RAG深度融合的技术方案 |
| [LightRAG](concepts/light-rag) | 香港大学推出的轻量级图增强RAG，双层检索+增量更新 |
| [意图识别](concepts/intent-classification) | 智能客服入口层优化技术，准确理解用户问题意图 |
| [知识图谱](concepts/knowledge-graph) | 用结构化节点和边表示实体及关系的语义网络 |
| [多Agent系统](concepts/multi-agent) | 多个具有专业能力的Agent协同工作的系统 |

## Patterns（模式与方法论）

| 页面 | 定义 |
|------|------|
| [Context Engineering](patterns/context-engineering) | 驭化工程第一支柱：系统性设计和管理 Agent 的信息集合 |
| [Architectural Constraints](patterns/architectural-constraints) | 驭化工程第二支柱：机械化强制执行代码规范 |
| [Entropy Management](patterns/entropy-management) | 驭化工程第三支柱：自动化扫描和修复系统性衰退 |
| [Agent Readability](patterns/agent-readability) | 衡量代码库对 AI Agent 友好程度的 7 项度量指标 |
| [Progressive Disclosure](patterns/progressive-disclosure) | 上下文工程核心架构：从外到内逐渐细化的信息层级 |
| [Drift Scanner](patterns/drift-scanner) | 每天运行的自动化漂移检测和修复任务 |
| [GC Agent](patterns/gc-agent) | 专门执行代码库清理的垃圾回收 Agent |
| [Chain of Thought](patterns/chain-of-thought) | 引导 LLM 逐步推理的提示词模式 |
| [ReAct Pattern](patterns/react-pattern) | 结合推理和行动的 Agent 循环模式 |
| [Tree of Thoughts](patterns/tree-of-thoughts) | 将推理过程组织为树结构的高级模式 |
| [LangGPT Framework](patterns/langgpt-framework) | 变量 + 模板语法的结构化提示词框架 |
| [CO-STAR Framework](patterns/co-star-framework) | 六维结构化提示词构建方法 |
| [CRISP Framework](patterns/crisp-framework) | 批判性思维提示词框架 |
| [ICIO Framework](patterns/icio-framework) | 极简四要素提示词框架 |
| [Agent Skill 设计模式](patterns/agent-skill-design-patterns) | Tool Wrapper、Generator、Reviewer、Inversion、Pipeline 五种模式 |
| [Skill 构建指南](patterns/skill-building-guide) | 从规划到测试到分发的完整 Skill 构建手册 |
| [Google ADK Agent 模式](patterns/google-adk-agent-patterns) | Sequential、Parallel、Coordinator、Hierarchical、Generator-Critic |
| [智能客服系统建设](patterns/intelligent-customer-service) | 从零构建智能客服的五步流程与技术选型 |
| [RAG 常见失败模式](patterns/rag-failure-patterns) | 提示词注入、上下文失效、跨文档推理、窗口溢出四种失败模式 |
| [RAG检索增强实现](patterns/rag-implementation) | RAG完整实现指南：分块、Embedding、向量库、检索策略、生成控制 |
| [生产环境部署](patterns/production-deployment) | 智能客服生产级部署最佳实践：安全、混合架构、转人工、性能优化 |

## Products（产品与工具）

| 页面 | 定义 |
|------|------|
| [Claude Code](products/claude-code) | Anthropic 的 AI 编程 Agent，薄封装理念 |
| [Claude Code Skills](products/claude-code-skills) | Claude Code 的技能扩展系统，九种类型 + 三级递进式披露 |
| [OpenAI Codex](products/openai-codex) | OpenAI 的编程 Agent，完整驭化架构 |
| [OpenClaw](products/openclaw) | 开源 AI 私人助手框架 |
| [Lazygit](products/lazygit) | 终端 Git 客户端 |
| [Yazi](products/yazi) | Rust 开发的异步文件管理器 |
| [uv](products/uv) | 超快 Python 包管理器 |
| [pyenv](products/pyenv) | Python 版本管理工具 |
| [Context7](products/context7) | 实时获取库文档的 MCP 工具 |
| [cc-connect](products/cc-connect) | 连接 AI 编程助手与消息平台的开源工具 |
| [Prompt Hub](products/prompt-hub) | 提示词中心，收录精选模板和画图提示词 |
| [LangChain](products/langchain) | 通用型LLM应用开发框架，链式编排为核心 |
| [LlamaIndex](products/llamaindex) | RAG专用框架，以索引和检索效果优化为核心 |
| [RAGFlow](products/ragflow) | 深度文档理解的RAG引擎，强调"质量进，质量出" |
| [QAnything](products/qanything) | 网易有道开源RAG，两阶段检索+BCEmbedding |
| [Milvus](products/milvus) | 国产开源向量数据库，百亿级向量规模 |
| [Neo4j](products/neo4j) | 最成熟的图数据库，用于知识图谱存储 |

## Comparisons（对比分析）

| 页面 | 对比主题 |
|------|---------|
| [Harness vs Scaffolding](comparisons/harness-vs-scaffolding) | 驭化层 vs 脚手架的区别 |
| [AI Coding Tools](comparisons/ai-coding-tools) | AI 编程工具生态横向对比 |
| [Python Package Managers](comparisons/python-package-managers) | pyenv vs uv 对比 |

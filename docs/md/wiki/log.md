---
title: "Wiki 操作日志"
date: "2026-05-09"
---

# Wiki 操作日志

---

## 2026-05-09: 补充 Agent Skills 内容

**Source**: docs/md/guide/ai/skills/
**New pages**: 4
- products/claude-code-skills.md
- patterns/agent-skill-design-patterns.md
- patterns/skill-building-guide.md
- patterns/google-adk-agent-patterns.md

**Updated pages**: index.md, log.md
**New cross-references**: 12 cross-references added

---

## 2026-05-09: Ingest intelligent-customer-service, prompt-hub, cc-connect

**Source**: docs/md/guide/ai/intelligent-customer-service/, docs/md/guide/ai/prompt-hub/, docs/md/guide/ai/claude-code/
**New pages**: 4
- patterns/intelligent-customer-service.md
- patterns/rag-failure-patterns.md
- products/cc-connect.md
- products/prompt-hub.md

**Updated pages**: index.md, log.md
**New cross-references**: 8 cross-references added

---

## 2026-05-09: 勘误 cc-connect 文档

**Source**: https://github.com/chenhg5/cc-connect (原始仓库 chenhg5/cc-connect)
**Corrected pages**: 2
- guide/ai/claude-code/cc-connect-多项目配置指南.md — 全面重写
- wiki/products/cc-connect.md — 同步修正

**勘误摘要**:
- 仓库 URL: libukai/cc-connect → chenhg5/cc-connect
- 技术栈: Node.js+pnpm → Go 二进制+npm/Homebrew
- 配置格式: YAML → TOML
- AI 助手: 4→10+ (新增 Qoder/OpenCode/iFlow/Kimi/Pi/ACP/Devin，移除错误项)
- 消息平台: 5→11 (新增微博/LINE/个人微信/QQ/QQ Bot，企业微信从规划中→已支持)
- 审核系统: 虚构的 approval YAML → 实际的 `/mode yolo/default`
- 指令系统: 虚构的 `/approve` `/reject` → 实际的 `/new` `/list` `/switch` `/dir` `/model` `/mode` `/cron`
- 同步模式: 虚构的 stream/batch → 实际的 display mode (full/compact/quiet)
- 安装方式: git clone+pnpm install → npm install -g / brew install / 二进制下载
- 项目配置: 目录式 projects/ → TOML [[projects]] 段落式
- 新增: Web UI 配置、Provider 管理、生命周期钩子、OS 用户隔离、附件回传

---

## 2026-05-09: Ingest docs/md/guide

**Source**: docs/md/guide (directory)
**New pages**: 28
- concepts/harness-engineering.md
- concepts/prompt-engineering.md
- concepts/agentic-architectures.md
- concepts/vibe-coding.md
- patterns/context-engineering.md
- patterns/architectural-constraints.md
- patterns/entropy-management.md
- patterns/agent-readability.md
- patterns/progressive-disclosure.md
- patterns/drift-scanner.md
- patterns/gc-agent.md
- patterns/chain-of-thought.md
- patterns/react-pattern.md
- patterns/tree-of-thoughts.md
- patterns/langgpt-framework.md
- patterns/co-star-framework.md
- patterns/crisp-framework.md
- patterns/icio-framework.md
- products/claude-code.md
- products/openai-codex.md
- products/openclaw.md
- products/lazygit.md
- products/yazi.md
- products/uv.md
- products/pyenv.md
- products/context7.md
- comparisons/harness-vs-scaffolding.md
- comparisons/ai-coding-tools.md
- comparisons/python-package-managers.md

**Updated pages**: index.md, log.md
**New cross-references**: 85+ cross-references established across all pages

---

## 2026-05-14: 萃取智能客服专栏知识

**Source**: docs/md/guide/ai/intelligent-customer-service/
**New pages**: 15
- concepts/rag.md
- concepts/graph-rag.md
- concepts/light-rag.md
- concepts/intent-classification.md
- concepts/knowledge-graph.md
- concepts/multi-agent.md
- products/langchain.md
- products/llamaindex.md
- products/ragflow.md
- products/qanything.md
- products/milvus.md
- products/neo4j.md
- patterns/rag-implementation.md
- patterns/production-deployment.md

**Updated pages**: 
- patterns/intelligent-customer-service.md (补充Sources)
- patterns/rag-failure-patterns.md (补充Sources)
- index.md (新增页面条目)
- log.md

**New cross-references**: 45+ cross-references established

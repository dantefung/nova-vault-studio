---
title: "Personal AI Infrastructure（PAI 个人AI操作系统）"
date: "2026-06-11"
---

# Personal AI Infrastructure（PAI 个人AI操作系统）

> Agentic AI Infrastructure for magnifying HUMAN capabilities. A Life Operating System that captures who you are, what you care about, and where you're trying to go — and then helps you get there using AI that knows you.

## Key Points

- **核心定位**：Personal AI Infrastructure = 个人 AI 操作系统，不只是 AI 脚手架
- **三层架构**：PAI（OS本身）+ Pulse（Life Dashboard）+ DA（Digital Assistant）
- **核心原则**：Humans first, tech second；Life OS 而非 agent harness；Ideal State drives everything

## 核心功能

- **Text over opaque storage** — 纯文本/Markdown，无 SQLite/PG 等不透明存储
- **Filesystem as context, no RAG** — 2025年6月起放弃 RAG， 富文本+交叉引用+ripgrep 足够
- **Memory that compounds** — 三层（WORK/KNOWLEDGE/LEARNING）+ 人/公司/想法/研究类型图
- **Self-improvement loop** — 显性评分/情感/验证结果/满意度信号
- **The Algorithm** — 七阶段循环（OBSERVE→THINK→PLAN→BUILD→EXECUTE→VERIFY→LEARN）
- **45 skills / 171 workflows / 37 hooks**

## Pulse — Life Dashboard

统一守护进程（port 31337）：
- 语音/hooks/可观测性/cron/Wiki API/Telegram/iMessage 桥接

## DA — Digital Assistant

数字分身身份层，`/interview` 引导 TELOS 捕获。

## 核心原则详解

1. **Humans first, tech second** — 工具服务人，非人服务工具
2. **Life OS, not an agent harness** — 覆盖目标/工作/关系/健康/财务，不只是代码
3. **Ideal State drives everything** — ISA（Ideal State Artifact）= 通用 PRD，跨任何创意领域
4. **Single DA will be everyone's interface to AI** — 聊天机器人 → Agent → 个人 DA

## 安装

```bash
curl -sSL https://ourpai.ai/install.sh | bash
```

## 数据

- **15.6k Stars** · **2.2k Forks** · **622 Commits** · **v5.0.0**
- MIT License

## Related Pages

- [patterns/personal-ai-infrastructure](patterns/personal-ai-infrastructure) — 个人AI基础设施模式

## Sources

- GitHub danielmiessler/Personal_AI_Infrastructure (2026-06-09)
---
title: "Harness Engineering 参考资源"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# Harness Engineering 参考资源

> 所有外部资源的汇总索引。按类型分类。

---

## 原始来源

### OpenAI 官方博客

- **[Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)**
  - 发布日期：2026年2月13日
  - 内容：Harness Engineering 概念的原始定义，OpenAI 内部实验详情（100万行代码、1500个PR）

- **[Unlocking the Codex harness: how we built the App Server](https://openai.com/index/unlocking-the-codex-harness/)**
  - 内容：Codex 底层技术架构——App Server 的设计与实现

### Martin Fowler 网站

- **[Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)**
  - 作者：Birgitta Böckeler（Thoughtworks 杰出工程师）
  - 发布日期：2026年2月17日

---

## 深度分析文章

- **[The importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026)** — Phil Schmid（Hugging Face），Harness = LLM 的操作系统
- **[Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)** — HumanLayer，技能系统设计，工具过多的"愚蠢区"研究
- **[Build the harness, not the code](https://vitthalmirji.com/2026/02/build-the-harness-not-the-code-a-staff/principal-engineers-guide-to-ai-agent-systems/)** — Staff/Principal 工程师视角的实施指南
- **[2025 Was Agents. 2026 Is Agent Harnesses](https://aakashgupta.medium.com/2025-was-agents-2026-is-agent-harnesses-heres-why-that-changes-everything-073e9877655e)** — 宏观视角，为什么 Harness 是 2026 年的关键范式转变

---

## GitHub 项目

- **[snarktank/ralph](https://github.com/snarktank/ralph)** ⭐ 13,400+
  - 高吞吐自主 Agent 循环的参考实现，PRD 驱动，git worktree 隔离
- **[az9713/harness-engineering-blueprint](https://github.com/az9713/harness-engineering-blueprint)** — 长期运行多 Agent 系统的综合驭化工程指南
- **[deepklarity/harness-kit](https://github.com/deepklarity/harness-kit)** — AI Agent 工程模式工具包

---

## 学术论文

- **[arXiv 2603.05344 — Building Effective AI Coding Agents for the Terminal](https://arxiv.org/abs/2603.05344)**
  - 作者：Nghi D. Q. Bui
  - 内容：首次学术化区分 Scaffolding 与 Harness，提出 OPENDEV，含惰性工具发现、自适应上下文压缩等技术

---

## 关键数据点速查

| 数据 | 来源 |
|------|------|
| 3人×5月=100万行代码，1500 PR | OpenAI 博客 |
| Stripe 每周 1300+ PR | Stripe 工程博客 |
| LangChain：52.8%→66.5%（不换模型）| LangChain 博客 |
| 同模型不同驭化：42%→78% | Nate B Jones 研究 |
| ETH Zurich：AGENTS.md 只+4% | arXiv |

---

## 社区讨论

- **[Hacker News: Harness Engineering (Martin Fowler)](https://news.ycombinator.com/item?id=47076255)** — 包含"大模型 vs 大驭化层"的核心争论
- **[Is Harness Engineering real?](https://www.latent.space/p/ainews-is-harness-engineering-real)** — 最平衡的争论分析，包含两派核心论据

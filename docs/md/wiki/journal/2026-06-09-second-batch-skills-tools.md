---
title: "2026-06-09 第二波 Skill + 工具资源归档"
date: "2026-06-09"
source: "llm-wiki"
---

# 2026-06-09 第二波 Skill + 工具资源归档

第二波 10 个资源，涉及：Codex 插件生态 / Google Cloud Agent 化 / 跨平台趋势研究 / PM 方法论硬核化 / 个人 AI OS / Markdown 桌面 / Agent 互联网能力 / AI 求职 DevOps / 向量检索 / LLM 硬件匹配。

## 今日最大发现

### Personal_AI_Infrastructure — 15.6k Stars
Daniel Miessler 的 PAI（Personal AI Infrastructure）。三层架构：
- **PAI OS** — Skills / Memory / Algorithm / Telos / Identity 文件
- **Pulse** — localhost:31337 生命仪表盘（语音/hooks/可观测性/cron/Wiki API）
- **DA** — Digital Assistant 数字分身，`/interview` 引导 TELOS 捕获

放弃 RAG 改用富文本+交叉引用+ripgrep 的思路值得注意。v5.0.0 四月底刚发布，Algorithm v6.3.0 七阶段闭环很有意思。

### career-ops — 51.2k Stars
AI 求职 DevOps 系统。作者用它评估了 740+ 职位，生成了 100+ 份定制简历，最终拿下 Head of Applied AI offer。

14 skill modes + Go TUI（Bubble Tea）+ Playwright 浏览器自动化。面试故事银行（STAR+Reflection）积累思路很实用。

### Agent-Reach — 25.3k Stars
给 AI Agent 装上互联网能力。脚手架思路而非框架，每个平台背后是独立上游工具（twitter-cli/rdt-cli/xhs-cli/yt-dlp/gh CLI）。

### last30days-skill — 36.5k Stars
跨平台趋势研究 Skill，覆盖 11 个平台（Reddit/HN/X/YouTube/TikTok/IG/HackerNews/Polymarket/GitHub/Bluesky/小红书）。按真实参与度评分而非编辑推荐。

## Codex 插件生态

openai/plugins（2.5k Stars）+ google/skills（12.9k Stars）标志着大厂开始将云原生操作 Agent 化。Google Skills 覆盖 AlloyDB/BigQuery/Cloud Run/Cloud SQL/GKE/Firebase，Teresa Torres/Marty Cagan/Alberto Savoia 方法论都有对应 Skill。

## 向量检索新星

turbovec（9.9k Stars）：10M 文档 31GB RAM → 4GB，16x 压缩，比 FAISS 快 12-20%。基于 Google Research ICLR 2026 论文。LangChain/LlamaIndex/Haystack/Agno 全支持。

## 今日冷知识

whichllm（3.9k Stars）能模拟任意 GPU 选型：`whichllm --gpu "RTX 4090"` 购卡前先测试。

## 明日方向

今日归档 10 个资源，Patterns 层积累丰富。明日可考虑：
1. 横纵分析：Agent Skill 生态（个人 OS vs 大厂技能包 vs 垂直领域）
2. 开始往 concepts/ 层提炼——"个人 AI 基础设施"作为一个概念与 llm-wiki/ai-local-brain 的关系
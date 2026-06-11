---
title: "Personal AI Infrastructure（个人AI基础设施）"
date: "2026-06-11"
---

# Personal AI Infrastructure（个人AI基础设施）

> 一份本地知识库 + 一台常驻 Mac + 三个入口 + N 个 Skill。真正的杠杆，是让 AI 够得着你的全部数据。

## Key Points

- **核心架构**：一份本地 Obsidian vault + 常驻 Mac + 三个入口（微信/Codex Mobile/Obsidian Sync）+ N 个 Skill
- **数据底座**：Obsidian 不是笔记软件，而是 AI 的本地数据底座
- **常驻 Mac**：让算力和数据都留在家里，外面的设备只做窗口
- **三个入口分工**：微信（秒级问答）+ Codex Mobile（手机远控 agent）+ Obsidian Sync（笔记主战场）

## 四层架构

| 层级 | 解决的问题 | 我的做法 |
|------|----------|----------|
| 数据底座 | AI 看不到我的全部上下文 | 把长期数据收回一个本地 Obsidian vault |
| 执行环境 | Agent 需要常驻进程和本地 IO | 家里一台 Mac 24h 跑 Codex、Hermes Agent |
| 触达入口 | 不同场景需要不同摩擦的入口 | 微信、Codex Mobile、Obsidian Sync 分工 |
| 行动能力 | AI 不能只读笔记，还要能调用工具 | 用 Skill 接富途、外部 API 等 |

## 核心公式

> 本地知识库 = 数据底盘
> Skill = 工具放大器
> Agent = 把两者拼起来的胶水

任何一个单拎出来都不够。只有三件事同时成立，AI 才真正变成"长期能帮你"的东西。

## 三个入口

| 入口 | 适用场景 | 关键技术 |
|------|----------|----------|
| 微信 | 走路、地铁、餐桌：极轻量、秒级问答 | Hermes Agent + iLink 长轮询 |
| Codex Mobile | 手机远控家里 Mac 上的 Codex agent | OpenAI secure relay + ChatGPT 移动端 |
| Obsidian Sync | 完整笔记编辑 + 通勤主战场 | E2E 加密 + 实时双向 |

## 设备分工

| 设备 | 最适合什么 |
|------|-----------|
| 手机 | 秒级问答，红绿灯之间能完成的交互 |
| iPad | 长时段沉浸式消费，通勤路上读 30 分钟笔记 |
| 公司 Mac | 正经写代码、写文章 |
| 家里 Mac | 跑 agent、当服务器 |

## Skill 应用案例

### Case 1：理财

futu skill × vault：
- 调 futu skill 拿 AAPL 实时报价、K 线、持仓
- grep vault 里股票大作手回忆录.md，把利弗莫尔准则当作判断框架
- 翻出之前对 AAPL 的判断笔记，逐条对照

**核心**：利弗莫尔不在富途 App 里，我的持仓不在《股票大作手回忆录》里。这两件事只能在"本地知识库 × Skill"的组合里相遇。

### Case 2：每日推送

早上 07:30 自动跑：
1. 读昨日每日计划/文件，包括手写的反馈区
2. 读计划模板.yaml
3. 调 LLM 生成今天的每日计划

### Case 3：每周复盘

每周日晚上 agent 自动跑：
1. 读这一周 7 天的每日计划/文件
2. 统计完成率、按 category 分布
3. 生成周回顾文件

## 关键洞察

1. **身体在哪不重要，数据和算力始终在家里那台 Mac 上等我**

2. **同一份数据，三个入口，同一份数据，多种触达方式**

3. **错误模型：写完 = 完成，再润色再等等；正确模型：发出去 = 完成**

## Related Pages

- [concepts/llm-wiki](concepts/llm-wiki) — LLM Wiki 知识库模式
- [patterns/ai-knowledge-workflow](patterns/ai-knowledge-workflow) — AI知识管理工作流

## Sources

- 微信公众号《一个 Obsidian、三个入口、一台常驻 Mac：我的 AI 个人工作流》(2026-06-01)
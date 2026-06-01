---
title: "Agentic Engineer 专栏"
date: "2026-05-11"
source: "原创"
url: ""
---

# Agentic Engineer 专栏

> 聚焦 AI Agent 工程的架构设计、技能系统、项目记忆与自主增强能力建设。

---

## 核心框架与技能系统

| 序号 | 文档 | 说明 | 核心更新 |
|------|------|------|----------|
| 01 | [GStack 技能包安装报告](./01-GStack-技能包安装报告.md) | 安装与配置 | GStack/Codex 技能包安装指南 |
| 02 | [GStack 10 分钟上手版](./02-gstack-10分钟上手版.md) | 快速入门 | 最小可用的 GStack 配置 |
| 03 | [GStack 使用手册](./03-gstack-使用手册.md) | 完整手册 | 20+ 条技能定义与使用场景 |
| 04 | [GSD 快速开始：从单次任务到完整项目管理](./04-gsd-quick-start.md) | 快速入门 | GSD 三步上手路径：Quick Fix / 代码库维护 / 完整项目，含 XML 任务计划示例 |
| 05 | [GSD 初学者完全指南](./05-gsd-beginner-guide.md) | 完整教程 | 讨论→规划→执行→验证 全流程，含波次执行原理、命令详解 |
| 06 | [GSD 前端开发工作流](./06-gsd-frontend-workflow.md) | 前端专项 | UI 设计合约(UI-SPEC) + 视觉审计(gsd-ui-review)，discuss 与 plan 之间插入设计步骤 |
| 12 | [Matt Pocock Skills 安装与使用指南](./12-mattpocock-skills-install-guide.md) | 安装指南 | 29 个技能的完整安装与分类用法，含 diagnose/tdd/caveman 等核心技能详解 |

---

## 架构设计

| 序号 | 文档 | 说明 | 核心更新 |
|------|------|------|----------|
| — | [全 Agentic 架构深度剖析](./all-agentic-architectures-deep-dive.md) | 架构全景 | 17 种 Agent 架构模式全覆盖 |
| — | [GSD 架构设计](./gsd-architecture.md) | 架构解析 | Goals/Skills/Docs 三层架构 |
| — | [GStack 架构设计](./gstack-architecture.md) | 架构解析 | Codex Skills 技能系统架构 |
| — | [Oh My ClaudeCode 架构](./oh-my-claudecode-architecture.md) | 架构解析 | Claude Code 插件生态架构 |
| — | [Oh My Codex Skills 架构](./oh-my-codex-skills.md) | 架构解析 | Codex Skills 技能包系统 |
| — | [Commit As Prompt 架构](./commit-as-prompt.md) | 架构解析 | WHAT/WHY/HOW 结构化提交 |
| — | [基于文件的规划](./planning-with-files.md) | 架构解析 | 文件驱动的任务规划系统 |
| — | [Ralph Loop 入门介绍与实践](./ralph-loop-intro.md) | 模式解析 | 让 AI 代理在循环中对抗外部检查直到任务通过 |
| — | [Ralph 循环在复合工程中的作用](./ralph-loop-compound-engineering.md) | 模式解析 | Ralph 循环 × 复合工程：每一个特性让下一个更容易构建 |
| — | [Agent之：后台任务](./agent-background-tasks.md) | 架构解析 | subprocess 后台执行 + 通知队列汇入主循环 |
| — | [拆解 AI Agent 内部：300 行 ReAct 循环](./simple-react-agent-loop.md) | 架构解析 | Action 即危险、上下文成本、ReAct 循环的极简本质 |
| — | [75K Star 的 Skills 仓库到底凭什么](./mattpocock-skills-analysis.md) | 案例剖析 | Matt Pocock 把 4 本经典压成 10 行招式，心法→招式的范本 |
| — | [Coding Tutor Plugin 架构详解](./coding-tutor-plugin-architecture.md) | 案例剖析 | Agent 驱动的个性化编程教学：learn profile → 代码库实例 → 间隔重复，Skill + Python 脚本架构 |
| — | [cc-connect 多项目配置指南](./cc-connect-multi-project-guide.md) | 工具集成 | 10+ AI 编码助手 × 11 消息平台桥接，单进程多项目管理 |
| — | [cc-connect 飞书接入指南](./cc-connect-feishu-guide.md) | 工具集成 | Claude Code → 飞书机器人远程调用，WebSocket 长连接无需公网 IP |
| — | [飞书 + Claude Code 远程指挥](./remote-claude-code-feishu.md) | 工具集成 | 自建 Python 服务，SQLite 持久化 session，FIFO 消息队列，与 cc-connect 对比 |
| — | [Open Multi-Agent — TS 原生多 Agent 编排框架](./open-multi-agent-research.md) | 框架分析 | Goal→DAG 自动拆解，10 Provider，MCP，6.2k⭐，仅 3 运行时依赖 |
| — | [GStack 知识系统架构](./gstack-knowledge-system.md) | 架构解析 | Learnings + GBrain + Preamble 三层记忆：自动捕获、置信度衰减、向量检索、跨机器同步 |
| — | [OMC 19 Agent 架构实战](./omc-19-agents-architecture.md) | 架构解析 | Hooks→Skills→Agents→State 四层编排，19 Agent 四泳道，三层模型路由，三种执行模式 |
| — | [淘天生码工作流最佳实践](./taobao-code-generation-workflow.md) | 案例剖析 | 淘天营销中后台 AI 生码全流程：Prompt→Context→验证闭环，35 张配图 |
| — | [Agent 范式演变：六维度从过去到现在](./agent-paradigm-evolution.md) | 深度文章 | 四阶段 + 六维度演变：Prompt/Planning/Memory/Tools/Workflow/Environment 的前后对比 |
| — | [Prompt → Context → Harness 三次进化](./prompt-context-harness-evolution.md) | 深度文章 | 从 Prompt 到 Context 到 Harness 的工程进化论：嵌套关系、衰变定律、Human Steer + Agents Execute |
| — | [AGE 应用开发模板介绍](./age-app-template-introduction.md) | 方法论 | Attractor-Guided Engineering：文件进文件出、owner-doc 吸引子、三级独立审计、独立子 Agent 审查 |
| — | [Codex 视频字幕工作流](./codex-video-subtitle.md) | 实践案例 | 音频→SRT→修字幕→ASS→FFmpeg烧录，Codex 串起本地工具链自动加字幕 |
| — | [强模型，救不了烂工程](./strong-model-bad-engineering.md) | 架构解析 | LLM→Harness→Agent OS 体系，双层 Loop 净删 2 万行教训 |

---

## 参考资料

- [Pensieve 官方仓库 — kingkongshot](https://github.com/kingkongshot/Pensieve)
- [Pensieve 中文 README](https://github.com/kingkongshot/Pensieve/blob/zh/README.md)
- [GStack GitHub](https://github.com/Khulnasoft/gstack)
- [Codex Skills](https://docs.codex.khulnasoft.com/)
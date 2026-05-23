---
title: "tweet-skills"
date: "2026-05-22"
---

# tweet-skills

> 基于 OpenClaw 的 X 平台推文自动创作技能包，将推文创作拆解为 8 个独立模块，完整工程化流水线。

## Core Capabilities

8 个独立模块，可单独运行或串联使用：

| 技能 | 功能 | 触发词 |
|------|------|--------|
| hot-topics | 热点选题采集（10-20个选题） | 「采集热点」「找选题」 |
| topic-research | 选题调研，500-800字结构化素材 | 「调研XX」「搜集资料」 |
| opinion-generator | 从10个角度生成独特观点 | 「生成观点」「提炼角度」 |
| tweet-writer | 10种风格推文写作，400-600字 | 「写推文」「tweet」 |
| tweet-polish | 口语化改写，消除AI味，三级检测 | 「口语化」「polish」 |
| title-optimizer | 5个方向标题优化，不超过20字 | 「起标题」「优化标题」 |
| tweet-closing | 5种结尾转化钩子 | 「写结尾」「加钩子」 |
| tweet-pipeline | 主控流水线：一键全流程 | 「流水线」「一键推文」 |

## 核心特性

### 收藏价值设计

每条推文必须满足以下至少 2 条：
- 有数据：具体数字
- 有判断：独特观点
- 有可操作：工具/方法/步骤
- 有记忆点：一句话概括全文

### 去 AI 味系统

三级检测（L1词汇 → L2句式 → L3节奏），AI味评分 ≤ 4

### 统一字数标准

400-600字成品输出，标题不超过20字，结尾不超过2句

## Sources

- https://github.com/chencore/tweet-skills
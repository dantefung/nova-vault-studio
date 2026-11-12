---
title: "Codex Security：Vibe Coding 的开源 AI 安全研究员"
date: "2026-08-08"
source: "公众号"
---

# Codex Security：Vibe Coding 的开源 AI 安全研究员

> OpenAI 开源的安全插件，一个会自己读代码、找漏洞、验证风险、提修复方案的 AI 安全研究员——每个 Vibe Coding 的人都该装。

## 核心定义

**Codex Security** 是 OpenAI 开源的 Agentic Security Researcher（最早叫 Aardvark），由 GPT-5 驱动，能自动阅读代码、扫描漏洞、验证风险、构建威胁模型、生成补丁。现对所有 Agent（Claude Code、Kimi Code、Codebuddy、Trae、Qoder 等）开放。

## 关键洞察

1. **Vibe Coding 把做产品门槛打下来，但安全是易被忽略的一环**：用完 AI 做出产品不代表安全，可能埋了一堆坑。

2. **安全扫描走模型推理 + 工具调用 + 漏洞验证路线**：结果有波动，大漏洞大概率不变，中低风险可能单次遗漏——**建议用两个模型交叉扫一遍**。

3. **成本可控**：默认 gpt-5.6-sol（xhigh）很贵，但可降推理强度或换便宜模型（DeepSeek V4 Flash 等），按场景选择。

4. **代码仓库之外的风险扫不到**：CDN、WAF、DDoS 防护、日志告警、数据备份等超出代码漏洞范畴，需另行防护。

## 发展历程

| 时间 | 事件 |
|------|------|
| 2025.10 | Aardvark 内测（GPT-5 驱动） |
| 2026.03 | 更名 Codex Security，整合进 Codex |
| 2026.06 | 深度扫描/攻击路径追踪/威胁模型/补丁生成 |
| 2026.08 | 开源 + 支持 OpenRouter/Fireworks |

## 三种使用方案

| 方案 | 说明 |
|------|------|
| Codex 授权登录 | 用 Codex 额度 |
| OpenAI API Key | 直接使用 |
| OpenRouter 接入 | 调用第三方模型（Kimi K3、Qwen3.8-Max、DeepSeek V4 Flash 等） |

## 最佳实践

- 大功能上线前扫一遍，定期审查；
- 高频扫描用便宜模型，大版本上线换强模型深度审查；
- 用两个模型交叉扫，降低中低风险遗漏；
- 别裸奔——哪怕只找出一个严重漏洞，成本就值回来了。

## 相关概念

- [[AgentLoop：阿里云 Agent 观测与 Skill 评估优化平台]] — Agent 安全与评估
- [[AI Coding 方法论：从自然语言编程到代码搬运工]] — Vibe Coding 上下文
- [[Harness Engineering]] — Agent 外层约束逻辑

## 原文

数字生命卡兹克撰写，基于真实项目扫描案例。[原文链接](https://mp.weixin.qq.com/s/koVsKEyae9grJqrGtsln9g)
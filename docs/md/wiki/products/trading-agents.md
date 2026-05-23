---
title: "TradingAgents"
date: "2026-05-22"
---

# TradingAgents

> Multi-Agents LLM Financial Trading Framework，78.6k+ stars（本月新增 26k）。市场研究、观点碰撞、交易判断由多个 agent 协作完成。

## Core Capabilities

### Analyst Team
- **Fundamentals Analyst**：评估公司财务和业绩指标
- **Sentiment Analyst**：聚合新闻、StockTwits、Reddit 情绪
- **News Analyst**：监控全球新闻和宏观经济指标
- **Technical Analyst**：利用 MACD、RSI 等技术指标

### Researcher Team
- 多空双方研究者，评估分析师观点，通过结构化辩论平衡风险与收益

### Trader Agent
- 汇总分析师和研究人员报告，做出交易决策

### Risk Management & Portfolio Manager
- 评估投资组合风险（波动性、流动性等）
- 审批/拒绝交易提案，执行模拟交易所订单

## Architecture

```
Analyst Team → Researcher Team → Trader → Risk Management → Portfolio Manager
```

## Tech Stack

- Python
- LangGraph
- 支持 GPT-5.x、Gemini 3.x、Claude 4.x、Grok 4.x、DeepSeek、Qwen、GLM 等

## 警告

> TradingAgents 仅为研究目的设计。交易表现受模型选择、温度、交易时段、数据质量等多种因素影响。**不构成金融、投资或交易建议。**

## Use Cases

- 投研工作流研究
- 策略研究
- 金融 Agent Demo

## Sources

- https://github.com/TauricResearch/TradingAgents
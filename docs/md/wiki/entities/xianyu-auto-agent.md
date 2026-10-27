---
title: "shaxiu/XianyuAutoAgent"
date: "2026-10-27"
source: "GitHub"
url: "https://github.com/shaxiu/XianyuAutoAgent"
---

# XianyuAutoAgent

> 闲鱼智能客服机器人系统，7×24 小时自动值守，支持多专家协同决策、阶梯式智能议价与上下文感知对话。核心思路是把「人肉客服值守」这种重复劳动交给代码。

## 基本信息

- **Stars**: 9.5k
- **Forks**: 1.7k
- **协议**: GNU General Public License v3.0
- **语言**: Python
- **环境要求**: Python 3.8+

## 核心功能

| 模块 | 技术实现 | 关键特性 |
|---|---|---|
| 上下文感知 | 会话历史存储 | 轻量级对话记忆管理，完整对话历史作为 LLM 上下文输入 |
| 专家路由 | LLM prompt + 规则路由 | 提示工程意图识别 → 专家 Agent 动态分发，支持议价/技术/客服多场景切换 |

### 业务功能矩阵

| 模块 | 已实现 | 规划中 |
|---|---|---|
| 核心引擎 | LLM 自动回复、上下文管理 | 情感分析增强 |
| 议价系统 | 阶梯降价策略 | 市场比价功能 |
| 技术支持 | 网络搜索整合 | RAG 知识库增强 |
| 运维监控 | 基础日志 | 钉钉集成、Web 管理界面 |

## 快速开始

```bash
git clone https://github.com/shaxiu/XianyuAutoAgent.git
cd XianyuAutoAgent
pip install -r requirements.txt
```

`.env` 关键配置：

| 变量 | 说明 | 必填 |
|---|---|---|
| `API_KEY` | 模型平台 API Key | 是 |
| `COOKIES_STR` | 闲鱼网页端 F12 抓取的 Cookie | 是 |
| `MODEL_BASE_URL` | 模型接口地址 | 是 |
| `MODEL_NAME` | 模型名称（默认通义千问） | 是 |
| `TOGGLE_KEYWORDS` | 接管模式切换关键词，默认句号 | 否 |
| `SIMULATE_HUMAN_TYPING` | 模拟人工回复延迟 | 否 |

四个专家提示词模板放在 `prompts/` 目录：`classify_prompt.txt`（意图分类）、`price_prompt.txt`（价格专家）、`tech_prompt.txt`（技术专家）、`default_prompt.txt`（默认回复）。

启动：`python main.py`

## 注意事项

项目作者明确声明仅供学习交流，可能随时停止更新或删除；接入闲鱼账号 Cookie 存在平台规则风险，自担后果。

## 关联资源

- [[entities/ai-goofish-monitor]] — 闲鱼多任务实时监控与捡漏秒拍
- [[entities/xianyu-auto-reply-fix]] — 闲鱼智能客服：多账号管理 + 自动发货
- [[sources/xianyu-3-open-source-tools-automation]] — 闲鱼副业三件套：把重复劳动交给代码
- [[sources/dongqingai-xianyu-virtual-product-automation]] — 闲鱼虚拟电商自动化流水线
- [[sources/weiyux-xianyu-6-years-experience]] — 6 年闲鱼实战：选品发散与场景锁定

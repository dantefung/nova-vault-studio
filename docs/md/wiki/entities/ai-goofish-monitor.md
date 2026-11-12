---
title: "Usagi-org/ai-goofish-monitor"
date: "2026-10-27"
source: "GitHub"
url: "https://github.com/Usagi-org/ai-goofish-monitor"
---

# ai-goofish-monitor

> 基于 Playwright 与 AI 的闲鱼多任务实时/定时监控系统，配套完整 Web 管理后台。核心用途是从海量闲鱼商品中按关键词、价格、区域与 AI 标准精准筛选目标货，捡漏秒拍。

## 基本信息

- **Stars**: 15.2k
- **Forks**: 2.7k
- **协议**: MIT License
- **语言**: Python（后端）+ Node.js/前端
- **环境要求**: Python 3.10+、Node.js + npm、Playwright CLI 与 Chromium
- **官方镜像**: `ghcr.io/usagi-org/ai-goofish:latest`（已内置 Chromium）

## 核心特性

- **Web 可视化管理**：任务管理、账号管理、AI 标准编辑、运行日志、结果浏览
- **AI 驱动**：自然语言创建任务，多模态模型深度分析商品
- **多任务并发**：独立配置关键词、价格、筛选条件和 AI Prompt
- **高级筛选**：包邮、新发布时间范围、省/市/区三级区域筛选
- **即时通知**：ntfy.sh、企业微信、Bark、Telegram、Webhook 多渠道
- **定时调度**：支持 Cron 配置周期性任务
- **账号与代理轮换**：多账号管理、任务绑定账号、代理池轮换与失败重试
- **Docker 部署**：一键容器化部署

## 快速开始（Docker 推荐）

```bash
git clone https://github.com/Usagi-org/ai-goofish-monitor && cd ai-goofish-monitor
cp .env.example .env
vim .env            # 填写相关配置项
docker compose up -d
```

默认 Web UI 地址：`http://127.0.0.1:8000`

### 最少配置

| 变量 | 说明 | 必填 |
|---|---|---|
| `OPENAI_API_KEY` | AI 模型 API Key | 是 |
| `OPENAI_BASE_URL` | OpenAI 兼容接口地址 | 是 |
| `OPENAI_MODEL_NAME` | 支持图片输入的模型名称 | 是 |
| `WEB_USERNAME` / `WEB_PASSWORD` | Web UI 登录账号密码，默认 `admin/admin123` | 否 |

### 第一次使用

1. 打开 Web UI 并登录；
2. 进入「闲鱼账号管理」，用 Chrome 扩展导出闲鱼登录态 JSON 并粘贴（保存到 `state/acc_1.json`）；
3. 回到「任务管理」，创建任务并绑定账号即可运行。

### 两种任务创建模式

- **AI 判断**：填写「详细需求」，后台异步生成分析标准（独立进度弹窗）
- **关键词判断**：直接填关键词规则创建任务，不经过 AI 生成流程

## 数据存储与迁移

在线主存储为 SQLite（默认 `data/app.sqlite3`），启动时自动建库建表并尝试从旧的 `config.json`、`jsonl/`、`price_history/` 导入一次历史数据。`state/`、`prompts/`、`logs/`、`images/` 仍是文件系统目录。商品图片临时落到 `images/task_images_<task_name>/`，任务结束后默认清理。

## 关联资源

- [[entities/xianyu-auto-agent]] — 闲鱼 7×24 自动回消息与智能议价
- [[entities/xianyu-auto-reply-fix]] — 闲鱼智能客服：多账号管理 + 自动发货
- [[sources/xianyu-3-open-source-tools-automation]] — 闲鱼副业三件套：把重复劳动交给代码
- [[sources/dongqingai-xianyu-virtual-product-automation]] — 闲鱼虚拟电商自动化流水线

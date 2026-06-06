---
title: "ComposioHQ/awesome-codex-skills — Codex Skills 精选列表（13k Stars）"
date: "2026-06-06"
source: "GitHub"
url: "https://github.com/ComposioHQ/awesome-codex-skills"
---

# ComposioHQ/awesome-codex-skills — Codex Skills 精选列表（13k Stars）

> A curated list of practical Codex skills for automating workflows across the Codex CLI and API. 精选列表，每个 Skill 均可独立安装使用。

<!-- more -->

## 概览

Composio 出品的 Codex Skills 精选列表，13k Stars，涵盖开发、数据、产品、沟通、分析等多个方向。每个 Skill 独立文件夹，含 `SKILL.md` 元数据 + 步骤指引 + 可选脚本/参考资料。

## 五大分类

### 开发 & 代码工具

| Skill | 功能 |
|-------|------|
| `codebase-migrate/` | 大型代码库迁移和多文件重构，CI 验证批次 |
| `create-plan/` | 快速起草编码任务执行计划 |
| `deploy-pipeline/` | Stripe → Supabase → Vercel 端到端发布流水线 |
| `gh-address-comments/` | 用 `gh` 处理当前分支 PR 的 review 或 issue 评论 |
| `gh-fix-ci/` | 检查 GitHub Actions 失败，构建修复建议 |
| `mcp-builder/` | 构建和评估 MCP 服务器 |
| `pr-review-ci-fix/` | 自动 PR review + CI 自动修复循环 |
| `sentry-triage/` | 诊断 Sentry 问题，映射堆栈帧到本地源码 |
| `webapp-testing/` | 运行有针对性的 Web 应用测试并总结结果 |
| [brooks-lint](https://github.com/hyhmrright/brooks-lint) | 六本经典工程著作的 AI 代码审查，附书籍引用 |
| [codebase-recon](https://github.com/yujiachen-y/codebase-recon-skill) | Git 历史分析，理解代码库结构和风险文件 |
| [polywave](https://github.com/blackwell-systems/polywave-codex) | 并行 Agent 协调，结构化合并安全 |

### 生产力 & 协作

| Skill | 功能 |
|-------|------|
| `connect/` | 通过 Composio CLI 连接 1000+ 应用（Slack/GitHub/Notion 等） |
| `connect-apps/` | 配置 Composio CLI 连接并从 shell 启动应用工作流 |
| `issue-triage/` | Linear 或 Jira 待办项分类和 bug 排查 |
| `linear/` | 在 Linear 中管理 issues、projects 和团队工作流 |
| `meeting-insights-analyzer/` | 分析会议记录主题、风险和后续事项 |
| `meeting-notes-and-actions/` | 将会议记录转为摘要，含决策和责任人标记 |
| `internal-comms/` | 制作内部公告、动态和利益相关者沟通 |
| `invoice-organizer/` | 规范化并提取发票数据 |
| `notion-knowledge-capture/` | 将聊天或笔记转换为结构化 Notion 页面 |
| `notion-meeting-intelligence/` | 准备会议材料并用 Codex 做调研 |
| `notion-research-documentation/` | 将多个 Notion 源合成为简报、对比或报告 |
| `notion-spec-to-implementation/` | 将 Notion 规格转为实施计划、任务和进度跟踪 |
| `support-ticket-triage/` | 客户工单分类、优先级、后续行动和草稿回复 |
| `file-organizer/` | 组织、重命名和整理文件 |
| `paperjsx/` | 从结构化 JSON 生成 PPTX/DOCX/XLSX/PDF，本地运行无需 API Key |
| `skill-share/` | 在团队间共享 Skills 和可复用指令 |

### 沟通 & 写作

| Skill | 功能 |
|-------|------|
| `email-draft-polish/` | 起草、修改或精简邮件 |
| `changelog-generator/` | 从 commits 或摘要创建清晰更新日志 |
| `content-research-writer/` | 带引用来源的研究和内容起草 |
| `tailored-resume-generator/` | 根据职位描述定制简历并量化成果 |
| [unslop](https://github.com/MohamedAbdallah-14/unslop) | 去除 AI 写作模式痕迹：三元组/破折号过度使用/hedging 堆叠 |

### 数据 & 分析

| Skill | 功能 |
|-------|------|
| `spreadsheet-formula-helper/` | 编写和调试电子表格公式 |
| `competitive-ads-extractor/` | 分析竞品广告并提取结构化洞察 |
| `datadog-logs/` | 通过 Composio CLI 过滤 Datadog 日志 |
| `developer-growth-analysis/` | 分析 Codex 聊天历史中的编码模式和学习差距 |
| `lead-research-assistant/` | 调研潜在客户并丰富机构数据 |
| `domain-name-brainstormer/` | 按条件头脑风暴可用域名并检查 |
| `raffle-winner-picker/` | 随机选择中奖者，附审计友好日志 |
| `langsmith-fetch/` | 拉取 LangSmith 项目/测试数据用于分析 |
| `helium-mcp/` | 实时新闻搜索（带偏见评分）、实时市场数据、ML 期权定价 |

### Meta & 工具

| Skill | 功能 |
|-------|------|
| `brand-guidelines/` | 应用 OpenAI/Codex 品牌颜色和字体 |
| `agent-deep-links/` | 构建和验证 Codex/Cursor/VS Code 深度链接 |
| `canvas-design/` | 生成结构化画布布局和设计产物 |
| `image-enhancer/` | 升级和优化图片 |
| `slack-gif-creator/` | 为 Slack 生成带标题和样式的 GIF |
| `theme-factory/` | 创建可复用主题 token 和调色板 |
| `video-downloader/` | 下载并准备离线审查视频 |
| `template-skill/` | 构建新 Skill 的入门模板 |
| `skill-installer/` | 从精选列表或 GitHub 路径安装 Skill 的辅助脚本 |
| `skill-creator/` | 构建有效 Codex Skill 的指南（含渐进式披露最佳实践） |

## 安装

```bash
git clone https://github.com/ComposioHQ/awesome-codex-skills.git
cd awesome-codex-skills

# 安装单个 Skill
python skill-installer/scripts/install-skill-from-github.py \
  --repo ComposioHQ/awesome-codex-skills \
  --path meeting-notes-and-actions

# 或手动复制
cp -r <skill-folder> ~/.codex/skills/
```

## 数据

- **13k Stars** · **1.3k Forks** · **45 Commits**
- Python 100%
- MIT License
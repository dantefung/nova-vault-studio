---
title: "Codex Skills（AI编码技能市场）"
date: "2026-06-11"
---

# Codex Skills（AI编码技能市场）

> A curated list of practical Codex skills for automating workflows across the Codex CLI and API. 精选列表，每个 Skill 均可独立安装使用。

## Key Points

- **核心定位**：Codex CLI 和 API 的精选 Skills 列表，覆盖开发、数据、产品、沟通、分析等多个方向
- **生态特点**：每个 Skill 独立文件夹，含 SKILL.md 元数据 + 步骤指引 + 可选脚本/参考资料
- **安装方式**：通过 `skill-installer` 脚本从 GitHub 安装，或手动复制到 `~/.codex/skills/`

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

### 生产力 & 协作

| Skill | 功能 |
|-------|------|
| `connect/` | 通过 Composio CLI 连接 1000+ 应用 |
| `issue-triage/` | Linear 或 Jira 待办项分类和 bug 排查 |
| `linear/` | 在 Linear 中管理 issues、projects 和团队工作流 |
| `meeting-insights-analyzer/` | 分析会议记录主题、风险和后续事项 |
| `meeting-notes-and-actions/` | 将会议记录转为摘要，含决策和责任人标记 |
| `support-ticket-triage/` | 客户工单分类、优先级、后续行动和草稿回复 |
| `paperjsx/` | 从结构化 JSON 生成 PPTX/DOCX/XLSX/PDF |

### 沟通 & 写作

| Skill | 功能 |
|-------|------|
| `email-draft-polish/` | 起草、修改或精简邮件 |
| `changelog-generator/` | 从 commits 或摘要创建清晰更新日志 |
| `content-research-writer/` | 带引用来源的研究和内容起草 |
| `tailored-resume-generator/` | 根据职位描述定制简历并量化成果 |

### 数据 & 分析

| Skill | 功能 |
|-------|------|
| `spreadsheet-formula-helper/` | 编写和调试电子表格公式 |
| `competitive-ads-extractor/` | 分析竞品广告并提取结构化洞察 |
| `datadog-logs/` | 通过 Composio CLI 过滤 Datadog 日志 |
| `lead-research-assistant/` | 调研潜在客户并丰富机构数据 |

### Meta & 工具

| Skill | 功能 |
|-------|------|
| `brand-guidelines/` | 应用品牌颜色和字体 |
| `agent-deep-links/` | 构建和验证 Codex/Cursor/VS Code 深度链接 |
| `template-skill/` | 构建新 Skill 的入门模板 |
| `skill-installer/` | 从精选列表或 GitHub 路径安装 Skill 的辅助脚本 |
| `skill-creator/` | 构建有效 Codex Skill 的指南 |

## 安装

```bash
git clone https://github.com/ComposioHQ/awesome-codex-skills.git
cd awesome-codex-skills

# 安装单个 Skill
python skill-installer/scripts/install-skill-from-github.py \
  --repo ComposioHQ/awesome-codex-skills \
  --path meeting-notes-and-actions
```

## 数据

- **13k Stars** · **1.3k Forks** · **45 Commits**
- Python 100% · MIT License

## Related Pages

- [patterns/vibe-coding](patterns/vibe-coding) — Vibe Coding 建站模式
- [patterns/personal-ai-infrastructure](patterns/personal-ai-infrastructure) — 个人AI基础设施
- [products/index](products/index) — AI 产品索引

## Sources

- GitHub ComposioHQ/awesome-codex-skills (2026-06-06)
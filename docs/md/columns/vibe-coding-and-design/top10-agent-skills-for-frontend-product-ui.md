---
title: "Pas推荐 Top10：面向前端/产品/UI 的 Agent Skills"
author: "Pas"
date: "2026-07-20"
source: "X/Twitter"
url: ""
---

# Pas推荐 Top10：面向前端/产品/UI 的 Agent Skills

> 这 10 个 Skills 考虑到设计落地频率、对视觉/交互质量的直接提升、在 Codex/Claude Code 等的高复用性。

## 10 个技能清单

### 1. frontend-skill（OpenAI）
- **来源**：https://github.com/openai/skills/tree/main/skills/.curated/frontend-skill
- **用途**：做 landing page、品牌页、demo 页
- **强项**：视觉论点、内容节奏、首屏质量
- **安装状态**：❌ 仓库中不存在该路径

### 2. frontend-design（Anthropic）
- **来源**：https://github.com/anthropics/skills/tree/main/skills/frontend-design
- **用途**：高完成度、强风格的前端设计实现
- **适合**：想把页面做得更有辨识度时用
- **安装状态**：✅ 已安装为 `anthropic-frontend-design`

### 3. figma-implement-design（OpenAI）
- **来源**：https://github.com/openai/skills/tree/main/skills/.curated/figma-implement-design
- **用途**：设计稿到代码的核心 skill
- **适合**：产品/设计/前端协作的常用项
- **安装状态**：✅ 已安装

### 4. web-design-guidelines（Vercel）
- **来源**：https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
- **用途**：UI 审查非常强
- **覆盖**：可访问性、表单、动效、排版、交互细节系统性补漏
- **安装状态**：✅ 已安装

### 5. react-best-practices（Vercel）
- **来源**：https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- **用途**：React / Next.js 项目必装
- **提升**：实现质量 + 性能质量
- **安装状态**：✅ 已安装

### 6. playwright（OpenAI）
- **来源**：https://github.com/openai/skills/tree/main/skills/.curated/playwright
- **用途**：验证真实浏览器行为
- **场景**：UI 流程调试和回归检查的通用执行层
- **安装状态**：✅ 已安装

### 7. webapp-testing（Anthropic）
- **来源**：https://github.com/anthropics/skills/tree/main/skills/webapp-testing
- **用途**：本地应用验证
- **覆盖**：页面行为、截图、日志和交互回归
- **安装状态**：✅ 已安装

### 8. canvas-design（Anthropic）
- **来源**：https://github.com/anthropics/skills/tree/main/skills/canvas-design
- **用途**：自由视觉探索、展示型页面、画布式交互
- **适合**：创意产品页
- **安装状态**：✅ 已安装

### 9. brand-guidelines（Anthropic）
- **来源**：https://github.com/anthropics/skills/tree/main/skills/brand-guidelines
- **用途**：官网、营销页、设计系统、品牌一致性
- **层级**：比单纯"写 UI"更上层，适合产品/品牌协同
- **安装状态**：✅ 已安装

### 10. vercel-deploy-claimable（Vercel）
- **来源**：https://github.com/vercel-labs/agent-skills/tree/main/skills/vercel-deploy-claimable
- **用途**：做完页面立刻可部署预览
- **价值**：反馈闭环更快
- **安装状态**：✅ 已安装为 `deploy-to-vercel`

---

## 选择指南

| 场景 | 推荐技能 |
|------|---------|
| 偏品牌官网/营销页 | frontend-skill、frontend-design、brand-guidelines |
| 偏产品 UI/设计稿还原 | figma-implement-design、react-best-practices、web-design-guidelines |
| 偏交互验证/可用性 | playwright、webapp-testing |
| 偏创意探索 | canvas-design |

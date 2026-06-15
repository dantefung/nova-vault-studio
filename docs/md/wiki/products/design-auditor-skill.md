---
title: "Design Auditor Skill（设计审计 Skill）"
date: "2026-06-15"
url: "https://github.com/Ashutos1997/claude-design-auditor-skill"
---

# Design Auditor Skill（设计审计 Skill）

> A Claude skill that audits designs against 19 professional design rules. 针对 19 个专业设计类别审计设计，支持 Figma、代码、截图、线框图。

## Key Points

- **核心功能**：根据 19 个专业设计规则审计设计，输出评分和修复建议
- **输入支持**：Figma 文件（via Figma MCP）、代码（HTML/CSS/React/Vue）、截图、线框图、文字描述
- **输出**：总分 100 分 + 分类评分 + 可访问性评分 + 伦理评分 + 可用性评分
- **语言支持**：英文、韩文

## 19 个审计类别

| # | 类别 | 检查内容 |
|---|------|----------|
| 1 | Typography | 层级、字体数量、大小、行高、对比度 |
| 2 | Color & Contrast | WCAG 比率、语义颜色、调色板一致性 |
| 3 | Spacing & Layout | 8 点网格、邻近性、对齐、留白 |
| 4 | Visual Hierarchy | 主操作清晰度、阅读模式、大小/对比度映射 |
| 5 | Consistency | 组件复用、图标族、圆角、交互状态 |
| 6 | Accessibility (WCAG) | 触摸目标、焦点状态、替代文本、表单标签 |
| 7 | Forms & Inputs | 标签、大小、验证时机、错误位置、提交状态 |
| 8 | Motion & Animation | 目的、时长、缓动、减少动效支持 |
| 9 | Dark Mode | 非简单反转、表面层级、饱和度、图标可读性 |
| 10 | Responsive & Adaptive | 断点、溢出、触摸目标、字体缩放 |
| 11 | Loading/Empty/Error States | 骨架屏、空状态、错误级别、成功确认 |
| 12 | Content & Microcopy | 按钮标签、错误消息、语气一致性、术语 |
| 13 | Internationalization & RTL | 文本扩展、RTL 镜像、本地化格式 |
| 14 | Elevation & Shadows | 阴影比例、层级、暗色模式深度 |
| 15 | Iconography | 图标族、光学大小、触摸目标、语义一致性 |
| 16 | Navigation Patterns | 标签页、面包屑、返回按钮、移动端导航 |
| 17 | Design Tokens & Variables | 语义命名、硬编码值、暗色模式 token 交换 |
| 18 | Ethical Design & Dark Patterns | 确认羞耻、虚假紧迫、预勾选同意等 22 种模式 |
| 19 | Nielsen's 10 Usability Heuristics | 尼尔森 10 大可用性启发式规则 |

## 评分体系

- **Overall Score**：`100 − (blockers × 12) − (criticals × 8) − (warnings × 4) − (tips × 1)`
- **Accessibility Score**：WCAG 相关类别（Cat 2, 6, 7, 15, 16）
- **Ethics Score**：暗色模式和操纵性设计（Cat 18）
- **Usability Score**：尼尔森启发式规则（Cat 19）

## 严重程度

| 级别 | 扣分 | 说明 |
|------|------|------|
| 🚫 Blocker | −12pts | 法律/合规违规（WCAG AA、GDPR、PECR） |
| 🔴 Critical | −8pts | 可用性失败 |
| 🟡 Warning | −4pts | 降低体验 |
| 🟢 Tip | −1pt | 打磨建议 |

## 核心特性

- **Design System 检测**：MUI、Chakra、shadcn/ui、Ant Design、Radix、Bootstrap
- **Figma Auto Layout 扫描**：检测应使用 Auto Layout 的手动定位框架
- **Figma Code Connect**：检测设计到代码的映射差距
- **色盲上下文**：每个失败的颜色对标注受影响的色盲类型
- **SVG 可访问性检查**：装饰性 vs 有意义的 SVG 模式
- **"Teach Me" 模式**：解释前 3 个问题背后的设计原理
- **Issue Priority Matrix**：按工作量 vs 影响绘制每个问题
- **Wireframe to Spec**：将线框图转换为带注释的开发就绪规格

## 安装

```bash
# 从 releases 页面下载 design-auditor.skill
# 然后在 Claude.ai → Customize → Skills → Upload skill
```

## 使用示例

```
"Check my design" → 选择范围（full / quick / custom），然后审计
"Is this accessible?" → 可访问性聚焦审计
"Review my form" → 部分审计，仅相关类别
"Does this follow WCAG?" → 对比度和可访问性审计
"Check my Figma file: [link]" → Figma MCP 审计
"Any dark patterns here?" → 伦理审计
"Wireframe to spec" → 带注释的开发就绪规格
```

## 输出示例

```
## 🔍 Design Audit Report

**Input:** Checkout flow · 3 frames
**Type:** Figma MCP
**Confidence:** 🟢 High

### Overall Score: 62/100
100 − (1 × 🚫 12) − (2 × 🔴 8) − (4 × 🟡 4) − (2 × 🟢 1) = 62/100

### Accessibility Score: 55/100 — significant gaps ⚠️ Contains legal compliance failures
### Ethics Score: 85/100 — minor concerns

### 🚫 Blockers (−12pts each)
- **Text contrast failure** — #aaa on white = 2.3:1 → Fix: use #595959 (7:1)
  Legal basis: WCAG 2.1 SC 1.4.3
```

## 数据

- **57 Stars** · **13 Forks** · **84 Commits**
- 21 Releases（最新 v1.2.13）

## Related Pages

- [products/taste-skill](products/taste-skill) — AI 前端防丑 Skill
- [products/design-to-html](products/design-to-html) — 设计转 HTML
- [guide/ai/ai-programming-resources](guide/ai/ai-programming-resources) — AI 编程资源

## Sources

- GitHub Ashutos1997/claude-design-auditor-skill (2026-06-15)

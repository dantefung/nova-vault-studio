---
title: "GSD 前端开发工作流 —— UI 设计合约与视觉审计"
date: "2026-05-19"
source: "GSD 官方文档整理"
url: ""
---

# GSD 前端开发工作流 —— UI 设计合约与视觉审计

对于前端开发，GSD 提供了专门的 **UI 设计工作流**，在标准流程中增加了 UI 设计合约步骤。

---

## 前端开发专用流程

### 核心差异

前端开发需要在 `discuss-phase` 和 `plan-phase` 之间插入一个 **UI 设计合约** 步骤：

```bash
/gsd-discuss-phase 1  # 讨论实现偏好
/gsd-ui-phase 1       # 生成 UI 设计合约（前端专用）
/gsd-plan-phase 1     # 制定实现计划
/gsd-execute-phase 1  # 执行开发
/gsd-verify-work 1    # 验收功能
/gsd-ui-review 1      # 视觉审计（前端专用）
```

### 前端专用命令

| 命令 | 作用 | 使用时机 |
|------|------|----------|
| `/gsd-ui-phase [N]` | 生成 UI 设计合约（UI-SPEC.md），包含布局、组件、交互规范 | discuss-phase 之后，plan-phase 之前 |
| `/gsd-ui-review [N]` | 对已实现的前端代码进行 6 维视觉审计（布局、密度、交互、空状态等） | execute-phase 或 verify-work 之后 |

### discuss-phase 中的前端关注点

在 `/gsd-discuss-phase` 中，系统会自动识别前端相关的灰色区域并提问：

- **视觉功能**：布局、信息密度、交互方式、空状态设计
- **组件选择**：是否使用 shadcn/ui、Tailwind CSS 等设计系统
- **响应式**：移动端适配、断点策略

### UI 设计合约（UI-SPEC.md）

`/gsd-ui-phase` 会调用专门的 `gsd-ui-researcher` 代理来：

1. 检测现有设计系统（shadcn components.json、Tailwind config）
2. 为 React/Next.js/Vite 项目提供 shadcn 初始化选项
3. 询问未回答的设计合约问题
4. 生成 `UI-SPEC.md` 文件，指导后续的规划和执行

### gsd-ui-researcher 代理

| 属性 | 值 |
|------|-----|
| **触发命令** | `/gsd-ui-phase` |
| **并行度** | 单实例 |
| **工具** | Read, Write, Bash, Grep, Glob, WebSearch, WebFetch, MCP (context7) |
| **产出** | `{phase}-UI-SPEC.md` |

**核心能力**：
- 检测设计系统状态（shadcn components.json、Tailwind config、已有 token）
- 为 React/Next.js/Vite 项目提供 shadcn 初始化选项
- 仅询问未回答的设计合约问题
- 强制第三方组件的注册安全门禁

---

## 后端项目

如果你的项目是纯后端（API、CLI），可以跳过 `/gsd-ui-phase` 步骤。

---

## 注意事项

- 前端项目的 `discuss-phase` 会特别关注视觉细节，回答得越详细，生成的 UI 越符合你的设计预期
- UI 设计合约在 `discuss-phase` 和 `plan-phase` 之间，不要跳过
- `gsd-ui-review` 提供 6 维审计：布局、密度、交互、空状态、响应式、可访问性

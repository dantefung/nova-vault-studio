---
title: "Claude Design + Baoyu-Design Skill：原型与功能一致的工作流"
date: "2026-08-08"
source: "用户分享"
url: "https://github.com/JimLiu/baoyu-design"
---

# Claude Design + Baoyu-Design Skill：原型与功能一致的工作流

> 每次开发新功能前，不是先去实现功能，而是先修改本地的原型，原型修改确认好了后再去修改功能。

## 工作流

开发项目时，第一版本会先用 Claude Design 设计好 UI 原型/设计，打磨好后放到本地，配合 Baoyu-Design Skill 去维护。

每次开发新功能前，不是先去实现功能，而是先修改本地的原型，原型修改确认好了后再去修改功能。

后来直接把规则放到了 `Agents.md` / `claude.md` 里面，只要说修改或者增加什么功能，默认会先帮我修改原型。所以到现在为止，原型和实际功能都是保持一致的。

## 带来的好处

1. **低成本验证**：先通过原型验证产品设计和 UI 设计，确认后再投入开发
2. **版本变更可追溯**：Claude Design 产出物是 React 代码和结构化的 JSON 数据，通过 `git diff` 很清晰的能看到版本变更历史
3. **开发效率高**：功能确定了后，Agent 参考 diff 结果代码实现会相对比较容易

## 相关项目

- **Baoyu-Design Skill**：https://github.com/JimLiu/baoyu-design
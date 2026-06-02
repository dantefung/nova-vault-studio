---
title: "to-issues 技能：垂直切片式 Issue 分解"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# to-issues 技能：垂直切片式 Issue 分解

## 定位

将任何计划、规范或 PRD 分解为**可独立抓取**的 GitHub Issue，使用垂直切片而非按层拆分。

## 垂直切片 vs 按层拆分

**按层拆分（错误）**：
```
Issue #1: 写所有测试
Issue #2: 写 UI 组件
Issue #3: 写业务逻辑
Issue #4: 写数据库层
```
⚠️ 每个 Issue 都需要跨团队协调，无法独立完成

**垂直切片（正确）**：
```
Issue #1: 登录功能（UI + 逻辑 + 数据）
Issue #2: 商品列表功能（UI + 逻辑 + 数据）
Issue #3: 结账功能（UI + 逻辑 + 数据）
```
✅ 每个 Issue 可独立开发、测试、部署

## to-issues 的分解原则

1. **一个 Issue = 一个用户可感知的完整功能**
2. **Issue 之间有明确依赖，只在 index 中声明**
3. **每个 Issue 内部可独立跑通 TDD 循环**
4. **粒度控制在 2-4 小时工作量**

## 与 to-prd 的关系

- **to-prd** — 把对话转成 PRD（输入原料）
- **to-issues** — 把 PRD 分解为 Issue（输出工件）

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[to-prd](./to-prd.md)、[setup-matt-pocock-skills](./setup-matt-pocock-skills.md)
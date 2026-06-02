---
title: "prototype 技能：快速原型验证设计"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# prototype 技能：快速原型验证设计

## 定位

构建**一次性原型**以充实设计。Prototype 的产出**不进入生产代码**，它的作用是**消除设计歧义**。

## 两种原型模式

### 状态 / 业务逻辑原型

用于验证**复杂业务逻辑或状态机**：

- 可运行的终端应用
- 独立脚本
- 验证核心算法正确性

### UI 变体原型

用于验证**交互设计或视觉方案**：

- 同一路由下的多种 UI 变体
- 通过 query param 切换
- 不需要真实数据

## 原型原则

1. **用完即弃** — 原型不重构、不维护、不写测试
2. **最小实现** — 只验证核心假设，其他先写死
3. **可抛弃性** — 任何时候发现设计方向错误，立即停掉重来

## 与 tdd 的区别

| 维度 | tdd | prototype |
|------|-----|-----------|
| 目标 | 生产代码 | 验证设计 |
| 生命周期 | 长期 | 一次性 |
| 测试 | 必须写 | 不写 |
| 重构 | 需要 | 不需要 |

## 典型使用场景

- 复杂状态机设计前
- 新交互模式不确定时
- 技术方案选择不明确时
- Proof of Concept 验证

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[tdd](./tdd.md)、[zoom-out](./zoom-out.md)
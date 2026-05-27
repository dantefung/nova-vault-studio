---
title: "代码质量标准"
date: "2026-05-27"
source: "整合自 03-01-clean-code/index.md + 03-02-code-quality/index.md + 03-03-code-principle/index.md"
url: "/columns/vibe-coding/08-clean-code"
---

# 代码质量标准

> 本篇整合自三篇原始文档：
> - [references/03-01-clean-code/index.md](references/03-01-clean-code/index.md)
> - [references/03-02-code-quality/index.md](references/03-02-code-quality/index.md)
> - [references/03-03-code-principle/index.md](references/03-03-code-principle/index.md)

---

## 代码质量概述

代码质量包含三个核心维度：

- **Clean Code** — 清洁代码规范
- **Code Quality** — 代码质量标准
- **Code Principle** — 代码原则

---

## Clean Code 清洁代码规范

### 基本原则

1. **常量优于魔法数字**
   - 不要在代码中直接写数字，使用有名字的常量
   - 错误：`if (user.age > 18)`
   - 正确：`const LEGAL_AGE = 18; if (user.age > LEGAL_AGE)`

2. **有意义的命名**
   - 变量、函数、类的名字应该清楚地表达它们的用途
   - 错误：`let d = new Date()`
   - 正确：`let currentDate = new Date()`

3. **函数应该只做一件事**
   - 如果一个函数做了多件事，它应该被拆分成多个函数

4. **保持代码简洁**
   - 不要过度工程，使用最简单的方案解决问题

---

## Code Quality 代码质量标准

### 评估维度

| 维度 | 描述 | 检查点 |
|------|------|--------|
| **正确性** | 代码是否按预期工作 | 边界条件、错误处理 |
| **可读性** | 代码是否易于理解 | 命名、注释、结构 |
| **可维护性** | 修改代码有多难 | 耦合度、内聚性 |
| **性能** | 代码运行效率 | 时间复杂度、资源占用 |
| **安全性** | 是否有安全漏洞 | 输入验证、加密 |

### 常用检查工具

- **ESLint** — JavaScript/TypeScript 代码规范检查
- **Prettier** — 代码格式化
- **TypeScript** — 类型检查
- **Jest/Vitest** — 单元测试

---

## Code Principle 代码原则

### 核心编程原则

| 原则 | 全称 | 说明 |
|------|------|------|
| **KISS** | Keep It Simple, Stupid | 保持简单，简洁的方案优于复杂的方案 |
| **YAGNI** | You Aren't Gonna Need It | 不要做你不需要的功能 |
| **DRY** | Don't Repeat Yourself | 不要重复代码，抽象重复逻辑 |
| **SOLID** | 单一职责、开放封闭、里氏替换、接口隔离、依赖倒置 | 面向对象设计原则 |

### SOLID 详解

1. **S - 单一职责 (Single Responsibility)**
   - 一个类只负责一件事
   - 如果一个类有多个职责，应该拆分成多个类

2. **O - 开放封闭 (Open/Closed)**
   - 对扩展开放，对修改封闭
   - 添加新功能应该通过扩展而不是修改现有代码

3. **L - 里氏替换 (Liskov Substitution)**
   - 子类型可以替换其基类型
   - 继承关系应该是"IS-A"关系

4. **I - 接口隔离 (Interface Segregation)**
   - 接口应该小而专一
   - 避免"胖接口"，使用多个专门的接口

5. **D - 依赖倒置 (Dependency Inversion)**
   - 依赖抽象而非具体实现
   - 高层模块不应该依赖低层模块

---

## 文件编码规范

- 文件编码统一为 **UTF-8（无 BOM）**
- 严格禁止使用 GBK/ANSI 等本地编码
- 严格禁止提交包含乱码的内容
- 如果发现任何文件不是 UTF-8 格式，在提交前先转换为 UTF-8
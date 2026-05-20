---
title: "上下文工程（Context Engineering）"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# 01 — 上下文工程（Context Engineering）

## 定义

**上下文工程**是驭化工程的第一大支柱，指系统性地设计和管理 AI Agent 在执行任务时能够访问的信息集合——在正确的时间，提供恰好足够的正确信息。

> "上下文工程不是写一个好的提示词，而是为 Agent 构建持久可用的知识基础设施。"
> — Phil Schmid, Hugging Face

---

## 核心问题

上下文工程要解决的根本问题：

1. **Agent 只能访问上下文窗口内的信息**——Slack 讨论、邮件决策、口头约定对 Agent 来说根本不存在
2. **上下文窗口是稀缺资源**——不加区分地堆砌信息会降低信噪比
3. **信息必须是结构化可寻址的**——Agent 需要能找到它，而不只是"存在某处"

---

## 仓库即唯一真相来源

这是上下文工程最核心的原则：

> **如果它不在仓库里，对 Agent 来说它就不存在。**

实践含义：
- 架构决策必须写成 ADR（Architecture Decision Records）提交到仓库
- API 约定必须有版本化的规范文件
- 技术债务和已知 bug 必须在代码注释或 issue 中有记录
- 团队规范必须在 `AGENTS.md` 或 `docs/` 中明确

**反面案例**：一个团队决定"不使用 Redux，改用 Zustand"，这个决定只活在 Slack 讨论里。三个月后，Agent 生成的代码仍然使用 Redux，因为它根本不知道这个决定。

---

## 渐进式披露架构

上下文的层级结构应该像洋葱一样，从外到内逐渐细化：

```
AGENTS.md（≤100 行，目录索引）
├── docs/architecture/      ← 架构决策与系统设计
├── docs/api/               ← API 合约与接口规范
├── docs/decisions/         ← 架构决策记录（ADR）
├── docs/patterns/          ← 代码模式与最佳实践
└── docs/glossary.md        ← 项目专用术语表
```

**关键原则：AGENTS.md 是地图，不是百科全书**

AGENTS.md 的职责是：
- 说明仓库的整体结构
- 指向各类详细文档的入口
- 提供关键术语的简短定义
- **不超过 100 行**

---

## AGENTS.md 的设计原则

根据 OpenAI 和 snarktank/ralph 的实践总结：

### 应该包含

- 仓库目的（1-3 句话）
- 目录结构说明（文件树 + 一句话描述）
- 关键术语（3-5 个专用词汇的简洁定义）
- 常用命令（build、test、lint 入口）
- 重要约束（1-3 条最关键的架构约束）

### 不应该包含

- 详细的代码规范（放到 `docs/patterns/`）
- 完整的 API 文档（放到 `docs/api/`）
- 历史背景（放到 ADR）
- 超过 100 行的任何内容

### 错误示范

```markdown
# AGENTS.md（错误示范）

## 规则（以下 200 条必须遵守）
1. 所有变量名必须使用 camelCase
2. 禁止使用 var，只用 const/let
3. 每个函数必须有 JSDoc 注释
4. 函数体不超过 30 行
... （还有 196 条）
```

这样的 AGENTS.md 会：
1. 耗尽大量上下文预算
2. Agent 找不到任务相关的关键信息
3. 规则太多，Agent 更容易遗漏

---

## 动态上下文注入

静态文档只是上下文工程的一部分。高级驭化层还会动态注入：

### 代码库状态
- 当前分支的 git 状态
- 最近修改的文件列表
- 相关测试的当前状态

### 可观测性数据
- 相关 API 端点的最近错误日志
- 性能监控指标（当任务涉及性能优化时）

### CI/CD 状态
- 当前流水线的状态
- 最近失败的测试用例

**注意**：动态注入要谨慎，只注入当前任务真正需要的数据，避免信息过载。

---

## 代码即上下文

代码的写法本身就是上下文的一部分：

### 类型即文档
```typescript
// 差：Agent 需要猜测 status 的合法值
function processOrder(orderId: string, status: string) { ... }

// 好：类型系统提供了精确的约束
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
function processOrder(orderId: string, status: OrderStatus) { ... }
```

### 错误消息即指导
```typescript
// 差：错误消息没有指导修复方向
throw new Error('Invalid configuration');

// 好：错误消息告诉 Agent 如何修复
throw new Error(
  `Invalid configuration: missing required field "apiKey". ` +
  `See docs/configuration.md for the complete configuration reference.`
);
```

### 命名即文档
```typescript
// 差：Agent 需要读函数体才能理解
function process(data: UserInput): Result { ... }

// 好：函数名自我说明
function validateAndNormalizeUserRegistrationInput(input: UserRegistrationInput): ValidatedInput { ... }
```

---

## 常见误区

### 误区一：更多文档 = 更好性能

ETH Zurich 研究发现：
- 人工撰写的 `AGENTS.md` 只带来约 4% 的性能提升
- LLM 自动生成的 `AGENTS.md` 反而导致性能下降 20%+
- 质量远比数量重要

### 误区二：把所有决策都写进系统提示

系统提示应该简短。决策应该在代码库中有结构化的存放位置，按需引用，而不是全量塞入提示。

### 误区三：上下文设置一次永久有效

上下文是活的基础设施。随着项目演进，ADR 需要更新，AGENTS.md 需要维护，过时的文档比没有文档更危险。

---

## 下一步

- 了解如何机械化执行架构规则：→ `02-architectural-constraints.md`
- 查看 AGENTS.md 模板：→ `../templates/AGENTS-template.md`
- 查看 ADR 模板：→ `../templates/ADR-template.md`

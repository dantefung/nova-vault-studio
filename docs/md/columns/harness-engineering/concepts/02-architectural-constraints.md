---
title: "架构约束（Architectural Constraints）"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# 02 — 架构约束（Architectural Constraints）

## 定义

**架构约束**是驭化工程的第二大支柱，指通过自动化工具（linter、结构测试、CI 检查）将架构规则**机械化地强制执行**，而不是依赖文档说明或人工审查。

核心思想：
> **将人类的工程品味编码为机器可执行的规则，让约束成为物理定律而非建议。**

---

## 为什么需要机械化约束

### 问题根源：AI 复制所有模式

Agent 生成代码时，会模仿仓库中已有的模式——包括好的和坏的。如果代码库里有 10% 的"遗留风格"代码，Agent 有很大概率也生成遗留风格。

### 文档的局限

文档规定"不允许从 UI 层直接调用数据库"，Agent 可能：
- 读到了规定，但在复杂任务中忘记了
- 没读到规定（上下文窗口不够）
- 找到了一个"例外情况"的旧代码并模仿

**机械化约束的优势**：规则被违反时，CI 立即失败，并给出可操作的错误消息。

---

## 分层架构约束（核心模式）

OpenAI 实验中最关键的约束是**严格的单向依赖层级**：

```
Types        ← 最底层（无任何依赖）
  ↓
Config       ← 只能依赖 Types
  ↓
Repository   ← 只能依赖 Config、Types
  ↓
Service      ← 只能依赖 Repository、Config、Types
  ↓
Runtime      ← 只能依赖 Service 及以下
  ↓
UI           ← 最上层（可依赖所有层）
```

**关键规则**：依赖只能向下，绝不允许向上或跨层。

### 实现方式（使用结构测试）

```typescript
// structural.test.ts
import { checkDependencies } from './harness/dependency-checker';

test('Repository层不允许依赖Service层', () => {
  const violations = checkDependencies({
    layer: 'repository',
    forbidden: ['service', 'runtime', 'ui'],
    directories: ['src/repository/**']
  });
  expect(violations).toHaveLength(0);
});
```

---

## 自定义 Linter：错误消息即修复指南

自定义 linter 规则的**设计原则**：错误消息本身必须包含修复方法，让 Agent 能自主纠错。

### 差的错误消息
```
❌ Error: Direct database import in UI component
   at src/components/UserProfile.tsx:15
```

### 好的错误消息（Agent 可自我修复）
```
❌ Error [no-direct-db-in-ui]: Direct database import detected in UI component.

   Found: import { db } from '@/lib/database' in src/components/UserProfile.tsx:15

   Fix: Move data fetching to a Service layer function, then call it from the component.

   Pattern to follow:
     1. Create src/services/user-service.ts with getUserById(id: string)
     2. In your component, call: const user = await getUserService().getUserById(id)

   Reference: docs/architecture/layer-constraints.md#ui-layer-rules
```

### 实现示例（ESLint 自定义规则）

```javascript
// eslint-rules/no-direct-db-in-ui.js
module.exports = {
  create(context) {
    return {
      ImportDeclaration(node) {
        const isUIFile = context.getFilename().includes('/components/');
        const isDBImport = node.source.value.includes('database') ||
                           node.source.value.includes('/db');

        if (isUIFile && isDBImport) {
          context.report({
            node,
            message:
              `Direct database import in UI component.\n\n` +
              `Move data fetching to src/services/, then import the service function.\n` +
              `See: docs/architecture/layer-constraints.md#ui-layer-rules`
          });
        }
      }
    };
  }
};
```

---

## Pre-commit Hooks

在代码进入 CI 之前，在本地拦截问题：

```bash
#!/bin/bash
# .git/hooks/pre-commit（或使用 husky）

echo "Running Harness pre-commit checks..."

# 1. 类型检查
npx tsc --noEmit || {
  echo "❌ Type errors found. Fix them before committing."
  exit 1
}

# 2. 自定义架构规则
npx eslint --rulesdir ./eslint-rules src/ || {
  echo "❌ Architecture constraint violations found."
  echo "   Run: npx eslint --rulesdir ./eslint-rules src/ for details."
  exit 1
}

# 3. 结构测试（依赖层级）
npx jest structural.test.ts || {
  echo "❌ Structural test failed. Check layer dependency constraints."
  exit 1
}

echo "✅ All Harness checks passed."
```

---

## 关键不变量（Invariants）保护

某些规则一旦被破坏，整个系统就会失效。这类规则应该有多重防线：

| 不变量 | Lint 检查 | 结构测试 | CI 阻断 |
|--------|----------|----------|---------|
| 单向依赖层级 | ✅ | ✅ | ✅ |
| 所有数据库访问通过 Repository | ✅ | — | ✅ |
| API 响应格式统一 | — | ✅ | ✅ |
| 没有未处理的 Promise | ✅ | — | ✅ |

---

## 实施顺序建议

不要试图一次性建立完整的约束体系。OpenAI 团队推荐的顺序：

### 第一阶段：捕捉高频错误
观察 Agent 最常犯的错误，为这些错误建立 linter 规则。

### 第二阶段：保护核心架构
为最重要的架构边界（通常是分层约束）建立结构测试。

### 第三阶段：自动化审查
为难以机械化但影响大的模式，配置 LLM Auditor。

### 第四阶段：持续演进
随着新的错误模式出现，持续添加新规则。将"人工 Code Review 发现的模式问题"转化为 linter 规则是关键习惯。

---

## 反模式：过度约束

约束越多不等于越好：

- 约束过多会让 Agent 陷入"无法通过 lint 却不知道如何修复"的死循环
- 矛盾的规则（规则 A 要求 X，规则 B 要求非 X）会完全阻塞 Agent
- 测试运行时间超过 5 分钟会显著降低 Agent 的迭代效率

**原则**：只约束真正重要的事情，其余靠约定和文档。

---

## 下一步

- 了解如何维持长期架构健康：→ `03-entropy-management.md`
- 查看 ARCHITECTURE.md 模板：→ `../templates/ARCHITECTURE-template.md`

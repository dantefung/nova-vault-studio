---
title: "Negative Constraint with Alternative"
date: "2026-06-12"
source: "Agent skill 迭代式编写实战"
url: "https://mp.weixin.qq.com/s/59Z2eVOg914_bpRD6-WsYg"
---

# Negative Constraint with Alternative

告诉 agent 不能做什么（bad case / anti pattern）时，同步给出合法替代方案。

## 核心思想

不要只说"不能做什么"，要给"那应该怎么做"。这是一种 few shot。没有替代方案的话，agent 会自己找一个——结果往往不是你想要的。

## 示例：Mocking Restrictions

**Do NOT mock:**
- `public static` fields (e.g., `@AppSwitch`-annotated configurations) → assign values directly in `@BeforeEach` and restore originals post-test
- POJO classes or OneLog objects → initialize simple POJOs programmatically; load complex POJOs from JSON files
- Stateless static methods (e.g., utility methods for conversion/assembly) → call real implementations directly

## 结构

```
❌ Don't: [anti-pattern description]
✅ Do: [specific alternative]
```

## 为什么有效

1. **约束力强**：给出明确替代，避免 agent 自行发挥
2. **few shot 学习**：通过具体示例教 agent 正确做法
3. **避免试错**：不需要 agent 试错后才知道正确答案

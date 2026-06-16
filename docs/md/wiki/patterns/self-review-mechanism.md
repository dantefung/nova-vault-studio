---
title: "Self-Review Mechanism"
date: "2026-06-12"
source: "Agent skill 迭代式编写实战"
url: "https://mp.weixin.qq.com/s/59Z2eVOg914_bpRD6-WsYg"
---

# Self-Review Mechanism

skill 执行后自查机制：agent 完成任务后强制回头检验产出物是否合格。

## 核心思想

agent 的自然倾向是完成任务就结束，不会主动回头检验。很多规范性错误恰恰在"完成"之后才能发现。把自查写进 skill，就是强制插入一个反射节点，把"我觉得做完了"变成"我验证过做完了"。

## 示例：单元测试生成自查列表

```markdown
## Post-Generation Review

After generating tests, review against this specification to ensure:
- Correct test file location and naming
- Proper mock configuration without prohibited patterns
- Complete verification of return values, state mutations, and invocations
- AssertJ assertion patterns are used consistently
- No reflection-based testing or private member verification
- Similar tests are grouped into parameterized tests where appropriate
- Parameterized tests use appropriate source types and handle null values correctly
```

## 两个检查维度

1. **规范符合性**：对照约束检查，确认没做错
2. **覆盖完整性**：对照领域知识检查，确认没遗漏

## 决策树 vs 自查清单

- **决策树**：收敛的（从多条路中选一条）
- **自查清单**：发散的（从一个结果出发，在多个维度验证）

## 适用场景

有明确输出规范的 skill（代码生成、迁移、测试等），skill 成熟后建议补上自查机制。

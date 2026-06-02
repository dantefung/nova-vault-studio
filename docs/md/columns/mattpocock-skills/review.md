---
title: "review 技能：双轴审查变更"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# review 技能：双轴审查变更

## 定位

review 沿两条平行轴审查自固定点以来的变更。属于 **in-progress** 技能，尚未完全稳定。

## 双轴模型

### 轴 1：Standards（标准）

> 差异是否遵循仓库的编码标准？

- 命名规范
- 代码风格
- 测试覆盖率
- 安全规范

### 轴 2：Spec（规范）

> 差异是否忠实地实现了原始 issue/PRD？

- 功能是否完整
- 边界条件是否处理
- 验收标准是否满足
- 是否在 scope 内

## 审查输出

```markdown
# REVIEW REPORT

## Standards
✅ 通过：Naming conventions, Error handling
❌ 未通过：Test coverage < 80%, Missing type annotations

## Spec
✅ 通过：Core flow implemented
⚠️ 部分通过：Edge cases need verification
❌ 未通过：AC #3 not satisfied

## Verdict
[Pass / Request Changes / Needs Discussion]
```

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-with-docs](./grill-with-docs.md)、[diagnose](./diagnose.md)

> ⚠️ 此技能为 in-progress 状态，Expect rough edges.
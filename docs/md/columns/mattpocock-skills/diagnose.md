---
title: "diagnose 技能：系统化调试循环"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# diagnose 技能：系统化调试循环

## 定位

diagnose 是 mattpocock/skills 中最核心的工程技能之一，针对**难调试的 bug 和性能回归**提供规范化诊断循环。

## 核心流程

```
reproduce → minimise → hypothesise → instrument → fix → regression-test
```

六个阶段**顺序执行，不得跳过**：

1. **Reproduce** — 稳定复现问题，确认触发条件
2. **Minimise** — 最小化复现路径，剔除无关干扰
3. **Hypothesise** — 提出可证伪假设，而非凭感觉猜测
4. **Instrument** — 添加观测手段验证假设
5. **Fix** — 基于已验证的假设实施修复
6. **Regression-test** — 回归测试确保修复不引入新问题

## 关键原则

- **不许凭感觉乱试**：跳步是诊断失败的主要原因
- **假设必须可证伪**：「应该是 XX 导致的」不是假设，是猜测
- **每一步都有出口**：当 Instrument 发现假设错误时，返回 Hypothesise 重新提出

## 适用场景

- Bug 反复出现但找不到根因
- 性能回归，无法定位瓶颈
- 第三方库行为异常
- 间歇性故障

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-with-docs](./grill-with-docs.md)、[tdd](./tdd.md)
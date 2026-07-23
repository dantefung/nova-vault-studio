---
title: "用户报Bug，Agent立刻猜根因？Matt Pocock这2个skill把它拉回正轨"
date: "2026-07-22"
source: "运维有术"
url: "https://mp.weixin.qq.com/s/kefeCAyFKRtpCOQ0_wDc-A"
---

## 核心观点

Matt Pocock 的 /tdd 和 /diagnosing-bugs 给 Agent 装反馈信号，解决「没复现就猜根因」的失败模式。The rate of feedback is your speed limit。

## 关键概念

### /diagnosing-bugs 6阶段

1. Build a feedback loop → red-capable command（入场券）
2. Reproduce + minimise
3. Hypothesise（falsifiable假设）
4. Instrument
5. Fix + regression test（correct seam）
6. Cleanup + post-mortem

### red-capable command 4判据

- Red-capable：断言用户确切症状
- Deterministic：每次结论一致
- Fast：秒级
- Agent-runnable：无需人类介入

### /tdd 核心

- Seam（缝合线）：公共接口/事件/CLI输出
- Pre-agreed seam：测试前先约定
- 红绿循环：先写失败测试，只写最少代码

## 核心观点

1. red-capable command 是入场券，不是结果
2. 反馈信号要写成强制流程约束，不依赖模型自觉
3. TDD 能让代码能跑，但管不了架构
4. "Build the right feedback loop, and the bug is 90% fixed"

## 关联概念

[[Matt Pocock]] [[diagnosing-bugs]] [[TDD]] [[Seam]] [[Pre-agreed seam]] [[red-capable command]] [[调试流程]]

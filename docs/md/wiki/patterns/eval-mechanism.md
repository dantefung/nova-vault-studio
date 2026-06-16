---
title: "Eval Mechanism"
date: "2026-06-12"
source: "Agent skill 迭代式编写实战"
url: "https://mp.weixin.qq.com/s/59Z2eVOg914_bpRD6-WsYg"
---

# Eval Mechanism

skill 的外部验证：用真实输入跑 skill，对比有无 skill 的输出差距。

## 核心思想

自查是 skill 执行时的内部静态验证，由 agent 对照清单自检。eval 机制是外部动态验证：用真实输入跑 skill，对比有无 skill 的输出差距，而不是靠感觉判断好坏。

## 四个环节

### 1. 测试用例

设计 2-3 个真实用户会说的提示词，同一提示词分别跑「有 skill」和「无 skill（或旧版本）」，保留两份输出用于对比。

提示词要有足够的复杂度和具体背景——skill 的触发本身依赖 agent 对 description 的语义识别，过于简单的 prompt 可能根本不会触发 skill。

### 2. 断言

- **客观标准**：有客观标准的 skill 设计可验证检查项（如"输出文件是否包含字段 X"）
- **主观类**：基于人工反馈

### 3. 迭代循环

评估 → 修改 → 重跑 → 再评估，每轮聚焦有明确问题的用例，直到没有明显差距。

注意：每轮只看少数用例，容易把 skill 改成只对这几个 case 有效。改的时候要从具体反馈里抽出通用规律，而不是针对测试用例做针对性修补。

### 4. description 触发率优化

skill 内容稳定后单独优化 description，用 should-trigger / should-not-trigger 样本测试召回精度，重点关注：
- "近似场景误触发"
- "该触发却未触发"

## 与自查的区别

- **自查**：运行时护栏，agent 执行后自检
- **eval**：开发期的标准线，离线评估 skill 效果

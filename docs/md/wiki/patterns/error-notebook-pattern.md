---
title: "error-notebook-pattern"
date: "2026-10-14"
source: "wiki-ingest"
---

# 错题本模式（Error Notebook Pattern）

> 一种让 AI 驱动的项目实现自我改进的开发实践：agent 每晚复盘当天 commit，积累教训；同一条教训反复出现三次即升格为硬规则。

## 问题背景

magpie 项目在引入错题本机制前（10月5日前）：51小时内发了294个tag，CI几乎每一轮都被下一次push取消，一个只在Linux上挂的测试从v0.1.877一路红到v0.1.892愣是没人发现。

引入机制后：发版从168个/天骤降到15~26个/天，质量显著提升。

## 核心机制

### LESSONS.md（错题本）

agent 每晚复盘当天 commit，关注三类问题：
1. 哪些修完又返工了
2. 哪些压根不该合
3. 哪些验证做得太糙

每条记录格式：一句规则 + 一段原因 + commit/issue 号作为证据。

### Seen N× 规则

**同一条教训在3个不同日子的复盘里都出现，就从 LESSONS.md 挪进 code-standards.md，从经验变成硬规则。**

已转正的硬规则包括：同类 bug 要一起修掉、main 上挂掉的测试就是马上要修的 bug、合并前要写清楚跑了什么测试。

## PR 验收六条标准

除常规三平台编译、沙箱测试外，有三条特殊标准：

1. **回退测试**：把旧代码放回去，新写的测试必须真挂，而且挂得明明白白指出哪个行为错了
2. **真实使用**：改了哪家厂商接入，就得用真账号、真配置、真接口返回去验
3. **没跑的要写出来**：A check that wasn't run is listed as not run, never left out

合并命令带 `--match-head-commit <审过的 sha>`，审的过程中如果有人又 push 了，合并直接失败。

## 人类参与边界

- 产品决定："Don't reverse deliberate decisions"（滚动行为、按钮光标等 PR 不能改）
- 安全闸门：风险检查命中等 maintainer 放行
- 社区建议：commit 标题里记录报告人来源（X/Discord）

## 为什么有效

错误被记录后，agent 下次启动一定会读到；反复犯的同一条错说明之前的修复不够彻底，升格为硬规则后每个 PR 审查都要逐条对照，形成正反馈循环。

## Related Pages

- [[concepts/agent-loop]]
- [[patterns/self-review-mechanism]]

## Sources

- WquGuru《magpie项目全AI自动化构建深度分析》：x.com/wquguru/status/2109650264601117141

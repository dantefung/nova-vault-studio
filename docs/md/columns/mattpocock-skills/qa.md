---
title: "qa 技能：交互式 QA 会话（已弃用）"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# qa 技能：交互式 QA 会话（已弃用）

> ⚠️ 此技能已弃用，不再维护。

## 原定位

交互式 QA 会话，用户**以对话方式报告 bug**，agent 提交 GitHub issue。

## 弃用原因

- 用户报告 bug 的口语化描述与 issue 格式之间的转换成本高
- 当 user 不是 developer 时，描述往往缺乏可复现性
- 更好的替代：让 user 直接提交 issue，agent 负责 Triage

## 替代方案

- **triage** — 分类角色状态机处理 user reported issues
- **diagnose** — 如果 bug 进入开发阶段，用 diagnose 系统化调试
- 人工填写 issue template，比口述更可靠

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[triage](./triage.md)、[diagnose](./diagnose.md)
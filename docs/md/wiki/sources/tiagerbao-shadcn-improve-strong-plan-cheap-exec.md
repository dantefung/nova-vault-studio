---
title: "旺旺：别再让最贵的 AI 模型干所有活了——shadcn/improve"
date: "2026-10-29"
source: "X/Twitter"
author: "旺旺 (@TiagerBao)"
url: "https://x.com/TiagerBao/status/2120123324273745941"
---

# 旺旺：别再让最贵的 AI 模型干所有活了——shadcn/improve

> shadcn 开源的 improve：强模型审查并生成 Markdown 修复方案，便宜模型在独立 worktree 中执行，自动跑测试 + 看 diff，人决定是否合并；实际代码与计划不符时 Agent 必须停止并报告。安装：npx skills add shadcn/improve。

<!-- more -->

别再让最贵的 AI 模型干所有活了。

shadcn 开源了一个 improve，已经超过 1 万 Star。

思路很简单：强模型负责审查和制定方案，便宜模型负责执行。

它能做到：

扫描代码库，找出性能、安全、测试等问题

每个问题生成独立的 Markdown 修复方案

明确修改文件、执行步骤和验收命令

让便宜模型在独立 worktree 中执行

自动检查测试结果和代码 diff

最终是否合并，由人决定

还有个细节：如果实际代码与计划不符，Agent 必须停止并报告，不能自己猜着改。

安装：

npx skills add shadcn/improve

项目地址： https://github.com/shadcn/improve

你们觉得这种强模型规划、小模型执行的方式真能省钱，还是任务交接和上下文重建反而更贵？

#ClaudeCode #Codex #Agent #AI



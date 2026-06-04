---
title: "gstack 技能专栏"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# gstack 技能专栏

> Garry Tan 的 gstack 仓库技能列表——按"工程/质量/设计/规划"组织 50+ Claude/Codex 技能。

<!-- more -->

## 简介

gstack 是 Garry Tan（前 YC CEO）开源的 AI 编程技能合集，提供 **CEO/Design/Eng/DX 四类 review 技能** + 浏览器自动化 + 安全审计 + 质量门禁 + 设计生成等能力。

本专栏按"定位/触发/核心流程/适用场景"对每个技能做中量精读。

## 速览（按能力分类）

### 🤖 Agent 编排

- [autoplan](./autoplan) — Auto-review 流水线（CEO/Design/Eng/DX 四类审查自动跑）
- [codex](./codex) — OpenAI Codex CLI 包装
- [open-gstack-browser](./open-gstack-browser) — 启动 AI 控制的 Chromium
- [pair-agent](./pair-agent) — 远程 agent 配对浏览器
- [qa](./qa) / [qa-only](./qa-only) — 完整 QA vs 仅报告

### 🔒 安全

- [cso](./cso) — 首席安全官模式，基础设施级审计
- [careful](./careful) — 破坏性命令警告
- [guard](./guard) — 全安全模式（careful + freeze 组合）
- [freeze](./freeze) / [unfreeze](./freeze) — 限制编辑到指定目录

### 📊 质量与健康

- [health](./health) — 代码质量仪表盘
- [investigate](./investigate) — 系统化调试根因
- [retro](./retro) — 周工程回顾
- [learn](./learn) — 管理项目学习库
- [canary](./canary) — 部署后金丝雀监控

### 📐 设计

- [design-consultation](./design-consultation) — 设计咨询
- [design-shotgun](./design-shotgun) — 多设计变体生成
- [design-review](./design-review) / [plan-design-review](./plan-design-review) — 设计审查
- [design-html](./design-html) — 设计落地 HTML/CSS
- [make-pdf](./make-pdf) — Markdown 转 PDF

### 🎯 规划与策略

- [plan-ceo-review](./plan-ceo-review) — CEO 视角计划审查
- [plan-eng-review](./plan-eng-review) — 工程经理视角计划审查
- [plan-devex-review](./plan-devex-review) — DX 视角计划审查
- [plan-tune](./plan-tune) — 提问敏感度自调优
- [office-hours](./office-hours) — YC Office Hours（startup/builder 模式）

### 🛠 工程能力

- [skillify](./skillify) — 把抓取流程固化为永久 skill
- [scrape](./scrape) — 浏览器抓取数据
- [browse](./browse) — 快速无头浏览器
- [ship](./ship) — 发版工作流
- [land-and-deploy](./land-and-deploy) — 合并 + 部署 + 验证
- [review](./review) — 预着陆 PR 审查

### 🌐 浏览器自动化

- [open-gstack-browser](./open-gstack-browser) — 启动浏览器
- [setup-browser-cookies](./setup-browser-cookies) — 导入 cookie
- [browse](./browse) — 浏览器操作

### 📚 上下文与状态

- [context-save](./context-save) / [context-restore](./context-restore) — 保存/恢复工作上下文
- [checkpoint](./checkpoint) — 检查点（已合并入 context-save）
- [landing-report](./landing-report) — 部署队列仪表盘

### 🔧 工程配置

- [setup-deploy](./setup-deploy) — 部署配置
- [setup-gbrain](./setup-gbrain) — gbrain 初始化
- [gstack-upgrade](./gstack-upgrade) — 升级 gstack
- [sync-gbrain](./sync-gbrain) — 同步 gbrain 与代码

### 📄 文档与报告

- [document-release](./document-release) — 发版后文档更新
- [devex-review](./devex-review) — DX 实测审计

### 🍎 iOS 专项

- [ios-clean](./ios-clean) / [ios-fix](./ios-fix) / [ios-qa](./ios-qa) / [ios-sync](./ios-sync) / [ios-design-review](./ios-design-review)

### 🎪 OpenClaw 子项目

- [gstack-openclaw-ceo-review](./gstack-openclaw-ceo-review) — CEO 审查
- [gstack-openclaw-investigate](./gstack-openclaw-investigate) — 调查
- [gstack-openclaw-office-hours](./gstack-openclaw-office-hours) — Office Hours
- [gstack-openclaw-retro](./gstack-openclaw-retro) — Retro

### 🌐 浏览器子项目

- [hackernews-frontpage](./hackernews-frontpage) — HN 首页抓取

### 🔬 实验性

- [scratch](./scratch) / [skillify](./skillify) / [spec](./spec) — 探索性技能
- [learn](./learn) — 学习管理
- [test](./test) — 测试相关

## 适用场景

- 完整的工程化 AI 编程工作流（从设计到审查到部署）
- 多 agent 协作编排
- 浏览器自动化 + 表单交互 + 截图验证
- 安全审计 + 部署金丝雀

## 关联专栏

- [mattpocock-skills](../mattpocock-skills/) — Matt Pocock 的 skills 仓库
- [superpowers-skills](../superpowers-skills/) — obra/superpowers 仓库
- [get-shit-done-skills](../get-shit-done-skills/) — gsd 仓库

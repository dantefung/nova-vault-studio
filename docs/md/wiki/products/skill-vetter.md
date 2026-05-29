---
title: "skill-vetter"
date: "2026-05-27"
---

# skill-vetter

> Skill 安全审查刚需代表 — 安装前检查权限、脚本和外部连接风险

## Core Concept

安装陌生 Skill 前，让 Agent 读取其 SKILL.md 或仓库内容，检查作者、权限、curl、wget、混淆字符串、敏感目录读取等风险，输出安全审查报告。

## Core Features

- **权限检查**：检测 shell 执行、网络访问等敏感权限
- **风险识别**：识别 curl/wget、未知域名、远程脚本
- **密钥检查**：提示密钥读取风险
- **安全报告**：安装前输出可读的安全评估

## Use Cases

- 用户想安装"加密货币自动交易"类 Skill，但其要求网络访问和 shell 执行权限
- skill-vetter 先输出安全审查报告，提示密钥读取、未知域名、远程脚本等风险

## Resources

- [GitHub](https://github.com/topics/skill-vetter)
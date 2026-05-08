---
title: "AGENTS.md 模板"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# AGENTS.md 模板

> 目标：≤ 100 行。这是地图，不是手册。

---

## 项目目的

[用 1-3 句话描述：这个项目是什么，解决什么问题，服务哪些用户。]

---

## 核心术语

| 术语 | 定义 |
|------|------|
| [术语 1] | [一句话定义] |
| [术语 2] | [一句话定义] |

---

## 目录结构

```
[项目名]/
├── src/
│   ├── [模块 1]/    ← [一句话说明职责]
│   └── [模块 2]/    ← [一句话说明职责]
├── docs/
│   ├── architecture/ ← 架构文档
│   ├── api/          ← API 规范
│   └── decisions/    ← 架构决策记录（ADR）
└── tests/            ← 测试文件
```

---

## 常用命令

```bash
make setup     # 初始化开发环境
make dev       # 启动开发服务器
make build     # 构建生产版本
make test      # 运行所有测试
make lint      # 检查代码风格
make check     # 运行所有 CI 检查
```

---

## 关键约束（必须遵守）

1. [约束 1：一句话说明。详情 → docs/architecture/layer-constraints.md]
2. [约束 2：一句话说明。详情 → docs/architecture/api-standards.md]

---

## 详细文档入口

| 需要了解的内容 | 去哪里查 |
|--------------|---------|
| 系统整体架构 | `docs/architecture/ARCHITECTURE.md` |
| API 规范 | `docs/api/` |
| 重要的架构决策 | `docs/decisions/` |
| 代码模式指南 | `docs/patterns/` |

---
title: "docs-governance：项目文档树规范模板"
date: "2026-09-21"
source: "GitHub"
url: "https://github.com/qshanx/docs-governance"
---

# docs-governance：项目文档树规范模板

> 正式进入开发阶段之前的沟通结束文档，一套完整的项目文档树模板。

## 核心价值

项目启动前先对齐文档结构，让 Agent 和团队成员都有清晰的参考标准。

## 文档树

```
.
├── AGENTS.md                    # 项目协作与代码开发规范
├── README.md                    # 项目简介、技术栈和快速开始说明
├── DESIGN.md                    # 官网视觉风格、布局和交互设计规范
├── CHANGELOG.md                 # 项目版本更新记录
├── TODO.md                      # 项目开发计划和当前进度
└── docs
    ├── PROJECT-SPEC.md          # 项目定位、产品目标和功能范围
    ├── ARCHITECTURE.md          # 项目架构、目录结构和数据组织方式
    ├── COMPONENT-GUIDELINES.md  # 组件开发、样式、依赖和无障碍规范
    ├── PAGE-STRUCTURE.md        # 网站页面和组件详情页结构说明
    ├── DEVELOPMENT.md           # 项目开发和组件发布流程
    ├── REGISTRY.md              # 组件构建、校验和分发说明
    └── DEPLOYMENT.md            # 项目构建与 Cloudflare 部署说明
```

## 使用方式

直接把这份目录给你的 Agent，让它梳理项目结构。

## 适用场景

- 新项目启动前的文档规划
- 团队协作的标准化文档模板
- 给 AI Agent 清晰的项目上下文

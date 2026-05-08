---
title: "4 周 Harness Engineering 入门路线图"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# 4 周 Harness Engineering 入门路线图

> 来源：OpenAI Harness Engineering 博客推荐实施路径
> 适用于：希望快速建立 Harness Engineering 基础的团队

---

## 第 1 周：基础审计与标准化

**目标**：了解现状，建立标准化的任务入口。

### Day 1-2：评估现状

```bash
# 1. 用可读性清单评分
# 打开 practice/repo-readability-checklist.md，逐项评分

# 2. 尝试模拟 Agent 的视角
# 问自己：如果我是一个全新的 AI，只有这个仓库，
# 我能否独立：
# - 完成环境搭建？
# - 运行测试？
# - 找到架构文档？
# - 理解关键的代码规范？
```

### Day 3-5：标准化任务入口

**任务**：确保以下命令存在且工作正常：

```makefile
# Makefile（推荐统一入口）

setup:          ## 初始化开发环境
	cp .env.example .env
	npm install
	npm run db:migrate

dev:            ## 启动开发服务器
	npm run dev

build:          ## 构建生产版本
	npm run build

test:           ## 运行所有测试
	npm test

lint:           ## 检查代码风格
	npm run lint

lint-fix:       ## 自动修复代码风格
	npm run lint:fix

check:          ## 运行所有检查（CI 使用）
	npm run build && npm test && npm run lint
```

**验收标准**：`make check` 在干净环境下一次通过。

---

## 第 2 周：护栏建设

**目标**：安装 Linting，创建第一条自定义规则，起草 AGENTS.md。

### Day 1-2：配置基础 Linting

```bash
# Node.js 项目
npm install --save-dev eslint @typescript-eslint/eslint-plugin prettier

# Python 项目
pip install ruff mypy

# Go 项目
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

### Day 3：创建第一条自定义 Lint 规则

**示例：防止 console.log 进入生产代码**
```javascript
// eslint-rules/no-console-in-prod.js
module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'console'
        ) {
          context.report({
            node,
            message:
              'console.log is not allowed in production code. ' +
              'Use the Logger service instead: import { logger } from "@/lib/logger". ' +
              'See: docs/patterns/logging.md'
          });
        }
      }
    };
  }
};
```

**关键**：错误消息必须包含具体的修复方法。

### Day 4-5：起草 AGENTS.md

**验收标准**：
- ≤ 100 行
- 包含目录结构说明
- 包含 3-5 个核心术语定义
- 包含常用命令
- 有指向 `docs/` 的链接

---

## 第 3 周：知识库建设

**目标**：把散落在 Slack 和脑子里的知识搬进仓库。

### Day 1-2：创建架构文档

**核心内容**：
- 系统整体结构（一张图）
- 各层职责说明（一句话）
- 核心技术选型（和选择原因）
- 最重要的 3 个约束

### Day 3：建立 ADR 目录

为过去 3-6 个月最重要的架构决策各写一个 ADR。

### Day 4-5：Slack 知识迁移

梳理 Slack 中反复讨论的话题，将关键决策和规范搬进仓库。

---

## 第 4 周：第一次委派 Agent 任务

**目标**：委派真实任务给 Agent，观察并改进驭化层。

### Day 1：选择合适的第一个任务

适合作为第一个 Agent 任务的特征：
- ✅ 有明确的验收标准（有现有测试或可以写测试验证）
- ✅ 范围有限（1-3 个文件的改动）
- ✅ 不涉及敏感数据或复杂业务规则

**推荐起点**：添加一个简单的 CRUD API 端点，或修复一个有明确复现步骤的 bug。

### Day 2-3：委派任务，观察 Agent 行为

记录 Agent 遇到的问题。

### Day 4-5：根据观察改进驭化层

**将每个 Agent 失败转化为驭化层改进**：

| Agent 的问题 | 驭化层改进 |
|------------|-----------|
| 不知道如何运行测试 | 更新 AGENTS.md，明确列出测试命令 |
| 总是导入错误的 Logger | 添加 lint 规则：禁止直接用 console，必须用 Logger |
| 搞混了 Repository 和 Service 层 | 创建 ADR，解释分层设计；添加分层约束 lint 规则 |
| 生成的 API 响应格式不一致 | 创建 API 响应格式规范文档 + 结构测试 |

---

## 完成标志

4 周结束时，你的仓库应该达到：

- [ ] `make check` 一次通过
- [ ] AGENTS.md 存在且 ≤ 100 行
- [ ] 至少 1 条自定义 lint 规则
- [ ] `docs/ARCHITECTURE.md` 存在
- [ ] 至少 3 个 ADR 文件
- [ ] 成功完成 1 次 Agent 委派任务
- [ ] 记录了 Agent 首次失败 → 驭化层改进的完整循环

---

## 下一步

完成 4 周基础后，如需深度改造：→ `8-week-blueprint.md`

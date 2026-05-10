---
title: "渐进式AI编程 — 内部分享"
date: "2026-05-10"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/VplMocyOb9xVxyS6aLiBFQ"
author: "江南一点雨"
---

> 本文是一次内部分享的文字稿，如需完整案例可微信私我。

## 一、课程缘起与设计

### 痛点

- AI Coding 概念多、工具多，易学难精，单点使用无体系；

### 解法

- **主线任务贯穿**：通过完整项目串联工具，三阶段渐进式实战；

## 二、如何衡量 AI Coding 水平

| **维度** | **说明** | **衡量标准** |
| --- | --- | --- |
| **工作效率** | 重复性任务交给 AI，专注高价值决策 | 同样需求，比别人少用多少时间？ |
| **工程质量** | 符合团队规范、有测试覆盖，能过 CR | 上线后的 bug 率和返工率 |
| **代码准确性** | AI 代码一次跑通，不需反复调试 | 需要人工修改的比例有多高？ |
| **可复用性** | 个人经验沉淀为团队可用的资产 | 你的经验有没有帮身边人少踩坑？ |

## 三、外卖平台

构建 PC Web 端外卖平台，包含餐厅浏览、购物车下单、订单追踪等功能。

| **项目** | **功能** | **新增工具与技能** |
| --- | --- | --- |
| **阶段 1** | 餐厅菜单页 | CODEBUDDY.md, Plan Mode, Hooks, UI 美化 |
| **阶段 2** | 购物车与下单 | ESLint, E2E 测试，MCP, Subagents, Commands |
| **阶段 3** | 订单状态追踪 | Skills, Memory, OpenSpec, Agent Teams |

## 3.1 阶段一：AI 协作基础

### 3.1.1 核心工具

#### CODEBUDDY.md

每次对话开始时读取的特殊文件，为 CodeBuddy 提供无法从代码本身推断出的持久上下文。

**应该写：**
- ✅ 猜不到的命令
- ✅ 非默认代码风格
- ✅ 测试说明
- ✅ 仓库规范
- ✅ 架构决策
- ✅ 开发环境的坑

**不应该写：**
- ❌ 读代码能搞清楚的
- ❌ 标准语言约定
- ❌ 详细 API 文档
- ❌ 经常变化的信息
- ❌ 逐文件描述
- ❌ 废话

#### Plan Mode

| **维度** | **Plan Mode** | **Craft Mode** |
| --- | --- | --- |
| 工作方式 | 先规划后执行 | 直接执行 |
| 适用场景 | 复杂功能、架构设计 | 局部修改、Bug 修复 |
| 输出形式 | 完整方案 | 直接代码结果 |
| 可控性 | 高——执行前审阅 | 边执行边调整 |
| 扩展能力 | 智能编排 MCP/Skill | 按需调用 |

**适合使用 Plan Mode 的场景：**
- 新功能从零实现
- 多文件协同修改
- UI/UX 设计与实现
- 存量项目改造
- 复杂任务拆解

#### Hooks

在 CodeBuddy Code 的会话生命周期内插入自定义脚本或命令。

**事件类型：**
- `PreToolUse`：工具执行前，校验、审批
- `PostToolUse`：工具执行后，格式化，补上下文
- `Notification`：权限或者超时，桌面/IM 提醒
- `UserPromptSubmit`：用户提交时，内容审查
- `SessionStart`：会话开始，环境初始化
- `PreCompact`：压缩前，保留关键信息
- `Stop`：主代理结束，继续执行
- `SubagentsStop`：子代理结束，补充说明
- `SessionEnd`：会话结束，清理/持久化

## 3.2 阶段二：工程化质量体系

### 3.2.1 MCP (Model Context Protocol)

MCP 解决「连接」，给 Agent 接上手和脚；Skills 解决「执行」，教 Agent 在特定场景下怎么做。

| **通信方式** | **stdio** | **Streamable HTTP** |
| --- | --- | --- |
| 原理 | 标准输入输出通信 | HTTP POST+SSE |
| 典型用途 | 本地进程、IDE、CLI | 远程服务、Web、多客户端 |

### 3.2.2 Subagents

**两种模式：**

| **模式** | **agentic 模式** | **manual 模式 (IDE)** |
| --- | --- | --- |
| 调用方式 | 主 Agent 自动判断调用时机 | 用户手动选择 |
| 上下文 | 拥有独立上下文窗口 | 完全替代主 Agent |
| 干预 | 不能中途干预 | 可在 Agent 选择框中选中使用 |
| 适用场景 | 专业化分工 | 深度定制交互 |

### 3.2.3 工作效率提升

#### Background Agent

异步执行长时间任务，不阻塞主流程。
- 快捷键 `Ctrl+B`：background 运行中的任务
- 快捷键 `Ctrl+K`：Kill background agents
- 适用场景：轮询 issue 的评论、持续监控构建状态

#### Git Worktree

Git worktree 允许在同一仓库中同时拥有多个工作目录，每个目录可以检出不同的分支。

- 并行开发：在不影响主工作区的情况下进行实验性开发
- 安全隔离：AI 的所有更改都在独立目录中进行
- 零存储开销：worktree 共享 Git 对象，不会复制整个仓库
- 子代理隔离：支持多个 AI 子代理在独立 worktree 中并行工作

#### 多实例并行

```bash
# 生成任务列表
codebuddy -p "列出需要迁移的 React 类组件" --output-format json > tasks.json

# 并行处理 (4 个并发任务)
jq '.files[]' tasks.json | xargs -P4 -I {} bash -c '
  codebuddy -p "将 {} 转换为 hooks" --allow-tools Edit --timeout 300
'
```

## 3.3 阶段三：Spec-Driven 开发

### Skills

模块化的、自包含的能力包，通过提供专门的知识、工作流和工具来扩展 AI Agent 的能力。

**包含内容：**
- 专业工作流——针对特定领域的自动多步骤程序
- 工具集成——处理特定文件格式或 API 的指令
- 领域专业知识——公司特定的知识、架构和业务逻辑
- 打包资源——脚本、参考资料和资产

### OpenSpec

**规范驱动开发（Spec-Driven Development, SDD）框架**，专门为 AI 编程助手设计，核心理念：**在写代码之前，先和 AI 达成共识。用规范（Spec）来约束双方的理解。**

**核心原则：**
| **原则** | **含义** |
| --- | --- |
| **流动而非僵化** | 没有严格的阶段门控，你可以按需要的顺序工作 |
| **迭代而非瀑布** | 需求会变化，理解会深化，OpenSpec 拥抱这种现实 |
| **简单而非复杂** | 轻量级设置，最小化仪式感，需要时再定制 |
| **棕地优先** | 适合修改现有系统，不只是从零开始的绿地项目 |

**核心概念：**

```
openspec/
├── specs/              # 源代码真理（你的系统现在是什么样的）
│   ├── auth/
│   └── permissions/
└── changes/            # 提议的修改（每个改动一个文件夹）
    ├── add-permission-system/
    └── fix-login-bug/
```

- **specs/** 是你系统的「源代码真理」——它描述你的系统现在是什么样的
- **changes/** 是「提议的修改」——每个改动都有自己的文件夹，包含所有相关的文档和规范

### Agent Teams

**协作模式：**
- 人类作为 Orchestrator（编排者）
- 各专业 Agent 作为 Worker（执行者）
- 通过规范文件（Spec）传递上下文和任务

## 四、AI Coding 工具全景图

```
工具层
├── 编辑器/IDE
│   ├── CodeBuddy IDE（人工 review）
│   └── CodeBuddy CLI（AI Native，快）
├── AI 协作核心
│   ├── CODEBUDDY.md（持久上下文）
│   ├── Plan Mode（先规划后执行）
│   ├── Hooks（生命周期钩子）
│   └── Commands（自定义斜杠命令）
├── 工程质量
│   ├── ESLint（代码规范）
│   ├── E2E 测试（Playwright）
│   └── Git Hooks（提交检查）
├── 高级协作
│   ├── MCP（Model Context Protocol）
│   ├── Subagents（子代理）
│   ├── Skills（模块化能力包）
│   └── OpenSpec（规范驱动开发）
└── 效率工具
    ├── Background Agent（异步任务）
    ├── Git Worktree（并行开发）
    └── Ralph（自主 Agent 循环）
```

## 五、核心工程实践

### 5.1 CODEBUDDY.md 编写规范

```markdown
# 项目名称

## 语言规范
- 所有文档和对话使用中文
- 专业术语保持英文（如 React、TypeScript、API 等）

## 技术栈
- 前端: React 18 + TypeScript + Tailwind CSS + Vite
- 后端: Express + TypeScript
- 数据库: SQLite

## 代码规范
**重要**: 禁止使用 any 类型，所有变量和函数必须有明确的类型定义。

## API规范
- RESTful 风格，资源名用复数形式
- 统一返回格式: { success: true/false, data/error: ... }

## 项目结构规范
- 前端源码放 client/src/
- 后端源码放 server/src/

## Git规范
- 使用 conventional commit 格式: feat|fix|refactor|docs: message
```

### 5.2 提交规范（Conventional Commits + Emoji）

| 类型 | Emoji | 说明 |
| --- | --- | --- |
| `feat` | ✨ | 新功能 |
| `fix` | 🐛 | 错误修复 |
| `docs` | 📝 | 文档更改 |
| `refactor` | ♻️ | 代码重构 |
| `perf` | ⚡️ | 性能改进 |
| `test` | 🧪 | 测试相关 |
| `chore` | 🔧 | 工具、配置 |
| `ci` | 🚀 | CI/CD 改进 |
| `revert` | 🗑️ | 恢复更改 |

### 5.3 OpenSpec 工作流

```
1. 创建 Spec → 定义系统的「源代码真理」
2. 创建 Change → 每个改动一个文件夹
3. 在 Change 内规划任务 → 任务清单
4. AI 执行任务 → 按 Spec 约束
5. Review → 人类审阅
6. 合并 Spec → 规范同步更新
```

## 六、经验沉淀

### 6.1 为什么 AI 编程流程低效？

**需求模糊导致返工：**
```
你说一句话 → AI 理解（可能理解错）→ AI 写代码 → 你看代码 → 发现不对 → 重新沟通 → 重新写代码
```

**上下文丢失导致不一致：**
- 之前说过「权限数据存在 MySQL」，后来 AI 用了 Redis
- 之前说过「不要改动现有表结构」，后来 AI 添加了一堆新字段
- 之前说过「要兼容现有认证配置」，后来用了完全不同的认证方式

**多人协作时更混乱：**
- 不同人和 AI 沟通，给出不同的实现方式
- 没有统一的规范，每个人按自己理解做
- 代码审查时发现问题，又得重新讨论

### 6.2 OpenSpec 的解决思路

**核心哲学：**
- **Specs 是真理**：描述系统当前状态，每个改动先更新 Spec
- **Changes 是提议**：每个改动独立文件夹，不互相冲突
- **Human in the loop**：AI 执行前人类审阅 Spec，AI 执行后人类 Review 结果

### 6.3 衡量 AI Coding 水平

| 维度 | 初级 | 中级 | 高级 |
| --- | --- | --- | --- |
| **效率** | AI 生成代码，人工调试 | AI 生成 + 一次通过率高 | AI 端到端完成任务，人类只 review |
| **质量** | 需要大量返工 | 符合规范，有基本测试 | 规范完整，测试覆盖率高，CR 通过率高 |
| **准确性** | 需要反复修改 | 偶尔需要调整 | 直接可用或轻微修改 |
| **协作** | 单独使用 | 能和团队规范结合 | 能设计团队 AI 协作规范 |

---

## 信息来源

- [渐进式AI编程 — 江南一点雨](https://mp.weixin.qq.com/s/VplMocyOb9xVxyS6aLiBFQ)，微信公众号，2026-05-10
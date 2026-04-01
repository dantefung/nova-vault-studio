Title: 基础设施层概览 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/

Markdown Content:
## 基础设施层概览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/#%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD%E5%B1%82%E6%A6%82%E8%A7%88)

基础设施层涵盖 Claude Code 的底层支撑系统：入口点、迁移、内存目录、插件/技能、任务、Schema、服务器和远程会话。

## 架构位置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/#%E6%9E%B6%E6%9E%84%E4%BD%8D%E7%BD%AE)

```
┌──────────────────────────────────────────┐
│  UI Layer      (components, hooks, ink)  │
├──────────────────────────────────────────┤
│  Commands      (70~100+ user commands)   │
├──────────────────────────────────────────┤
│  Services      (compact, analytics, MCP) │
├──────────────────────────────────────────┤
│  Core Engine   (QueryEngine, Tools)      │
├──────────────────────────────────────────┤
│  ► Infrastructure (本层)                 │
│    ┌──────────┬───────────┬────────────┐ │
│    │ CLI 入口  │ 迁移系统   │ 内存目录   │ │
│    ├──────────┼───────────┼────────────┤ │
│    │ 插件/技能 │ 任务系统   │ Schema    │ │
│    ├──────────┼───────────┼────────────┤ │
│    │ 服务器    │ 远程会话   │ 协调器     │ │
│    └──────────┴───────────┴────────────┘ │
└──────────────────────────────────────────┘
```

## 子系统概览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/#%E5%AD%90%E7%B3%BB%E7%BB%9F%E6%A6%82%E8%A7%88)

| 子系统 | 目录 | 文件数 | 核心职责 |
| --- | --- | --- | --- |
| [CLI 入口点](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/cli-entrypoints.html) | `entrypoints/`, `cli/` | ~15 | 程序启动、参数解析、模式分发 |
| [迁移系统](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html) | `migrations/` | 11 | 设置格式升级、模型更名 |
| [内存目录](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/memdir.html) | `memdir/` | 8 | MEMORY.md 索引、记忆类型、检索 |
| [插件与技能](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/plugins-skills.html) | `plugins/`, `skills/` | 6 | 扩展注册、技能加载、市场 |
| [任务系统](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/tasks.html) | `tasks/` | 9 | 后台任务、调度、持久化 |
| [Schema](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/schemas.html) | `schemas/` | 1 | Hooks Zod 验证（仅 hooks.ts） |
| [服务器](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/server.html) | `server/` | 3 | Direct-connect 本地服务器 |
| [远程会话](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/remote.html) | `remote/` | 4 | CCR 远程会话管理 |
| [协调器](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/coordinator.html) | `coordinator/` | 1 | 多 Agent 编排 |

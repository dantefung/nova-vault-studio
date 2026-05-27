---
title: "上下文管理：MCP 与 Context7"
date: "2026-05-27"
source: "整合自 mcp配置.md + context7.md"
url: "/columns/vibe-coding/06-context-management"
---

# 上下文管理：MCP 与 Context7

> 本篇整合自：
> - [references/05-02-mcp/mcp配置.md](references/05-02-mcp/mcp配置.md)
> - [references/05-01-context7/context7.md](references/05-01-context7/context7.md)

---

## 什么是 MCP

MCP（Model Context Protocol，模型上下文协议）是一种让 AI 工具调用外部服务的标准方式。配置好 MCP 后，AI 可以直接搜索 GitHub、查询文档、操作数据库，而不需要你来回复制粘贴。

### MCP 配置位置

MCP 配置放在三个位置之一：

| 位置 | 范围 |
|------|------|
| `~/.claude/settings.json` | 所有项目（全局） |
| `.claude/settings.json` | 当前项目（提交到仓库，团队共享） |
| `.claude/settings.local.json` | 当前项目，不提交 |

---

## 核心 MCP 服务配置

### Context7（文档查询）

用于查询官方文档和代码示例。**这是最重要的一个 MCP**，它能让 AI 引用最新版本的库文档，而不是过时信息。

安装命令：
```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

使用方法：
1. `resolve-library-id` — 解析库名到 Context7 ID
2. `get-library-docs` — 获取相关文档段落

限制参数：`tokens≤5000`，`topic` 指定聚焦范围。

### Sequential Thinking（分步问题解决）

用于复杂任务的逐步分析和规划。

安装命令：
```bash
npx -y @modelcontextprotocol/server-sequential-thinking
```

触发场景：多步骤任务分解、架构设计、问题诊断。
流程：生成 6-10 步可执行计划，不暴露推理过程。

### searchGitHub（GitHub 搜索）

用于搜索 GitHub 上的实际使用案例。

配置：`https://mcp.grep.app`

### DuckDuckGo（外部信息）

用于查询最新信息、官方公告、breaking changes。

触发场景：需要最新信息、官方公告时。
查询优化：≤12 关键词 + 限定词（`site:`、`after:`、`filetype:`）
结果控制：≤35 条，优先官方域名，过滤内容农场。

---

## 完整 MCP 配置示例

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp"
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "searchGitHub": {
      "url": "https://mcp.grep.app"
    },
    "duckduckgo-mcp-server": {
      "command": "cmd",
      "args": [
        "/c", "npx", "-y",
        "@smithery/cli@latest", "run",
        "@nickclyde/duckduckgo-mcp-server",
        "--key", "你的key"
      ]
    },
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    },
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "spec-workflow-mcp@latest"]
    }
  }
}
```

---

## MCP 服务调用策略

### 核心策略

1. **审慎单选**：优先使用离线工具，确需外呼时每轮最多 1 个 MCP 服务
2. **序贯调用**：多服务需求时必须串行，明确说明每步理由和预期产出
3. **最小范围**：精确限定查询参数，避免过度抓取和噪声
4. **可追溯性**：答复末尾统一附加"工具调用简报"

### 调用优先级

1. **Serena**（本地代码分析）— 代码检索、架构分析、跨文件引用优先
2. **Context7**（官方文档）— 框架 API、配置文档、版本差异
3. **Sequential Thinking**（复杂规划）— 多步骤任务、架构设计
4. **DuckDuckGo**（外部信息）— 最新信息、官方公告

### 错误处理

| 错误类型 | 策略 |
|---------|------|
| 429 限流 | 退避 20s，降低参数范围 |
| 5xx/超时 | 单次重试，退避 2s |
| 无结果 | 缩小范围或请求澄清 |

### 降级链路

```
Context7 → DuckDuckGo (site:官方域名)
DuckDuckGo → 请求用户提供线索
Serena → 使用 Claude Code 本地工具
最终降级 → 保守离线答案 + 标注不确定性
```

---

## 工具调用简报格式

每次 MCP 调用后，附加简报：

```
【MCP调用简报】
服务: <serena|context7|sequential-thinking|ddg-search>
触发: <具体原因>
参数: <关键参数摘要>
结果: <命中数/主要来源>
状态: <成功|重试|降级>
```

---

## 典型调用模式

### 代码分析模式

```
serena.get_symbols_overview → 了解文件结构
serena.find_symbol → 定位具体实现
serena.find_referencing_symbols → 分析调用关系
```

### 文档查询模式

```
context7.resolve-library-id → 确定库标识
context7.get-library-docs → 获取相关文档段落
```

### 规划执行模式

```
sequential-thinking → 生成执行计划
serena 工具链 → 逐步实施代码修改
验证测试 → 确保修改正确性
```

---

## 禁用场景

以下情况不应使用 MCP：
- 网络受限且未明确授权
- 查询包含敏感代码/密钥
- 本地工具可充分完成任务
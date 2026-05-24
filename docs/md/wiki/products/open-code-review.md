---
title: "open-code-review"
date: "2026-05-24"
---

# OpenCodeReview

> 混合架构代码审查工具：确定性流水线 + LLM Agent，支持行级精确评论、动态并发、智能上下文压缩

## Core Features

- **混合架构**：确定性流水线 + LLM Agent 结合
- **行级精确评论**：可定位到具体代码行
- **动态并发**：默认 8 个 worker 并行处理文件
- **智能上下文压缩**：三区划分（frozen/compress/active）管理 token
- **10+ 语言规则**：NPE、线程安全、XSS、SQL注入等
- **双协议支持**：Anthropic Messages API + OpenAI Chat Completions

## Built-in Review Rules

| 语言/文件 | 检查重点 |
|---------|---------|
| `*.java` | NPE 风险、死循环、switch fallthrough、N+1 查询、线程安全 |
| `*.{ts,js,tsx,jsx}` | 代码质量、React 最佳实践、异步规范、XSS/安全 |
| `*.kt` | 空安全、协程用法、惯用模式 |
| `*.{go,py,ets,lua,dart,swift,groovy}` | 逻辑 bug、拼写错误 |
| `*{cpp,cc,hpp}` | 智能指针、RAII、STL、const 正确性 |
| `pom.xml` / `build.gradle` | SNAPSHOT 版本检查 |
| `package.json` | 最新/通配符版本、依赖冲突 |
| `*mapper*.xml` / `*dao*.xml` | SQL 注入、性能、逻辑错误 |

## Quick Start

```bash
# 安装
npm install -g @alibaba-group/open-code-review

# 配置 LLM
ocr config set llm.url https://api.anthropic.com/v1/messages
ocr config set llm.auth_token your-api-key-here
ocr config set llm.model claude-opus-4-6
ocr config set llm.use_anthropic true

# 测试连接
ocr llm test

# 审查代码
cd your-project
ocr review                    # 审查工作区变更
ocr review --from main --to feature-branch  # 分支对比
ocr review --commit abc123    # 单次提交
```

## Architecture

三阶段工作流：
1. **Plan Phase** — 超过 50 行变更先做风险分析
2. **Main Task Loop** — 每个文件独立 goroutine，LLM 调用内置工具（file_read、code_search、code_comment 等）
3. **Memory Compression** — Token 超过阈值（异步 60%、同步 80%）时压缩上下文

## Agent Tools

- `task_done` — 终止审查
- `code_comment` — 提交行级评论
- `file_read` — 读取文件内容
- `code_search` — 搜索代码
- `file_find` — 按文件名查找
- `file_read_diff` — 查看其他文件的 diff

## Resources

- [GitHub](https://github.com/alibaba/open-code-review)
- [Docs](https://alibaba.github.io/open-code-review/)
---
title: "LLM 缓存机制 (KV Cache / Prefix Caching)"
date: "2026-08-06"
source: "朱小厮的博客 公众号"
---

# LLM 缓存机制 (KV Cache / Prefix Caching)

> LLM 推理围绕"消除重复计算"展开的三层缓存工程手段：KV Cache 消除单次生成内部的重复计算，显存压缩让它在高并发下扛得住，前缀缓存把复用扩展到跨请求。

## 三层架构

| 层 | 核心手段 | 解决的问题 |
|----|---------|-----------|
| KV Cache | Prefill/Decode 两阶段，缓存每层 K/V | 自回归生成的平方级重复计算 |
| 显存优化 | GQA / PagedAttention / 量化 / 淘汰 | 长上下文 + 高并发的显存瓶颈 |
| 前缀缓存 | Prompt Caching，逐字节匹配前缀 | 海量请求共享相同开头的重复 prefill |

## 关键洞察

- **KV Cache 的语义约束**：绑定当前序列，跨序列必须重置——这是系统的硬约束，也是前缀缓存的前提
- **缓存复用的硬条件**：逐 token 完全一致的连续前缀，任一 token 变化即失效
- **工程原则**：按"变化频率从低到高"组织上下文，稳定内容（系统提示、工具定义）放最前，变化内容（用户问题、时间戳）放最后
- **Anthropic vs OpenAI 路线差异**：显式断点标记 vs 自动前缀匹配，但目标一致——让前缀逐字节稳定

## 生产实践

### Claude Code
- 自动埋 `cache_control` 断点，严格按变化频率分层
- Append-only 消息循环，断点随对话自动前移
- 活跃会话命中率可达 90%+

### Codex
- 保持 prompt 逐字节一致，配置变化不回改前缀而是追加
- 叠加 `prompt_cache_key` 提高路由黏性
- 命中率从 60% 提升到 87%

## 适用场景

前缀缓存划算的前提：存在"长且高频复用的稳定前缀"。适合：
- 超长系统提示的客服/问答机器人
- 固定文档/规范的 RAG 场景
- 多轮 Agent（缓存从优化项变成可用性前提）

## 相关页面

- [[concepts/llm-wiki]] — LLM Wiki 知识库模式，与缓存无关但同为 LLM 工程实践
- [[concepts/harness-engineering]] — AI 工程化，与推理优化互补
- [[concepts/multi-agent]] — 多 Agent 系统，与之相关的上下文管理
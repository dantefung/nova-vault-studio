---
title: "Harness 乘数效应与 DeepSeek 缓存优化"
date: "2026-08-15"
---

# Harness 乘数效应与 DeepSeek 缓存优化

> Composio 用同一个模型（DeepSeek V4 Flash）跑遍 8 种 Harness，30 项高难度任务：Pi Agent 66.7% 成功率 + $0.028/任务，Claude Code 53.3% + $0.195/任务。同一个模型，换 Harness，成功率差 20 个百分点，成本差 7 倍。核心启示：选对 Harness 比选大模型更重要，缓存命中率是成本的分水岭。

<!-- more -->

## Composio 测试数据

| 排名 | Harness | 成功率 | 每任务成本 |
|------|---------|--------|-----------|
| **1** | **Pi Agent** | **66.7%**（20/30） | **$0.028** |
| 2 | Oh My Pi | 56.7%（17/30） | — |
| 3 | Claude Code | 53.3%（16/30） | $0.195 |
| 3 | Codex | 53.3%（16/30） | — |
| 3 | Deep Agents | 53.3%（16/30） | — |
| 6 | Prime Agent | 50.0%（15/30） | — |
| 6 | Hermes Agent | 50.0%（15/30） | — |
| 8 | OpenCode | 46.7%（14/30） | — |

- 模型：DeepSeek V4 Flash（同一个）
- 任务：30 项高难度 Agent 任务
- 核心发现：**Harness 决定了一个模型实际能跑出来多少效果**

## Harness 乘数效应

> 选对 Harness，同一个模型可以同时变得更可靠、更高效；选错 Harness，即使底层模型智能水平完全相同，成功率和效率也可能明显下降。

**不应孤立评测模型。** 如果一份 Agent 排行榜只写模型名称，没有交代 Harness，分数就是不完整的。

## 干净 Harness 的胜率逻辑

**Pi 使用默认安装，未自定义配置**，Pi Agent 以默认配置拿下第一。Prime Agent 会话最庞大（350 万 Token、33 次工具调用），6 次运行因评分器超时而未被计分。

| 因素 | 干净 Harness | 臃肿 Harness |
|------|-------------|-------------|
| 路径长度 | 短 | 长 |
| 迷路概率 | 低 | 高 |
| 噪声输入 | 少 | 多 |
| 工具选择负担 | 轻 | 重 |

> 选择一款速度快、成本低的模型，放进干净、轻量的 Harness，再用真实任务检验组合。

## DeepSeek 前缀缓存机制

DeepSeek API 缓存请求提示词的**前缀**。匹配从**第一个 Token**开始——上下文前部变化，后续大量 Token 无法命中。

### Reasonix 设计原则

| 原则 | 做法 |
|------|------|
| 上下文前端稳定 | 启动时注入精简、稳定的环境摘要，每轮不重新生成 |
| 追加而非修改 | 变更成本最低 |
| 过时输出剪枝 | 触发压缩之前截断清理 |
| Schema 契约文档化 | 工具定义变更时回归审查 |
| 双模型独立会话 | 执行/规划模型各自独立会话，不破坏前缀 |

### pi-deepseek-cache 三层设计

| 层级 | 做法 | 对应 Reasonix 原则 |
|------|------|-------------------|
| **P0** | 启动时冻结日期和 cwd | 上下文前端稳定 |
| **P2** | SHA-256 前缀哈希诊断 | Schema 契约文档化 |
| **P3** | temp 0 确定性摘要 + 哈希缓存 | 追加而非修改 |

### 降本效果

| 模型 | 未命中 | 命中 | 降幅 |
|------|--------|------|------|
| deepseek-v4-flash | $0.14/M | $0.003/M | **98%** |
| deepseek-v4-pro | $3.00/M | $0.025/M | **99%** |

## 社区实践数据

| 场景 | 数据 |
|------|------|
| 0xEvan（Pi + DS V4 Flash） | 10 亿 Token，99.93% 缓存命中率，$2.65（vs $132 无缓存） |
| Shantanu Goel 对比 | 其他 Harness 94-97%，Pi 持续 99%+ |
| DeepPi（移植 Reasonix 到 Pi） | 99.7%-99.9% 缓存命中率 |

## 与本站现有概念的关系

- [DeepSeek V4 Flash + OMP/Pi 配置指南](./deepseek-v4-omp-pi.md) — 实际使用配置
- [DeepSeek Harness Agent 公式](./deepseek-harness-agent-formula.md) — 林大友：Agent = Model + Harness
- [AGE 与 Mission Driver 体系](./age-mission-driver.md) — 可逆计算：Harness 在 AGE 中承载测量与纠偏

## 参考来源

- [DeepSeek + Pi 王炸组合跑赢 Claude Code？](../sources/pi-deepseek-benchmark.md) — Tina / AI 前线
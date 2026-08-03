---
title: "OpenAI 图片生成模型"
date: "2026-08-03"
---

# OpenAI 图片生成模型

OpenAI 官方图片生成/编辑模型及其支持的端点信息，记录于 LiteLLM 模型价格配置中。

## 模型清单

| 模型 | 支持端点 | 备注 |
|---|---|---|
| `gpt-image-1` | `/v1/images/generations`, `/v1/images/edits` | 文生图 + 图生图(编辑) |
| `gpt-image-1-mini` | `/v1/images/generations`, `/v1/images/edits` | 同上，轻量版 |
| `gpt-image-1.5` | `/v1/images/generations` | 仅文生图，支持 vision/pdf 输入 |
| `gpt-image-1.5-2025-12-16` | `/v1/images/generations` | 同上的日期化版本 |

## 关键差异

- **文生图** (`images/generations`): 全部四个模型均支持
- **图生图/编辑** (`images/edits`): 仅 `gpt-image-1` 和 `gpt-image-1-mini` 支持

## 注意事项

- 该 JSON 文件是社区维护的定价参考数据（类似 LiteLLM 的模型价格库），用于成本计算，不代表服务的路由实现
- `gpt-image-1.5` 系列支持 `vision` 和 `pdf` 输入
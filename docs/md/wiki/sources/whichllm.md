---
title: "Andyyyy64/whichllm — 本地 LLM 硬件匹配 CLI（3.9k Stars）"
date: "2026-06-09"
source: "GitHub"
url: "https://github.com/Andyyyy64/whichllm"
---

# Andyyyy64/whichllm — 本地 LLM 硬件匹配 CLI（3.9k Stars）

> Find the best local LLM that actually runs on your hardware. Auto-detects GPU/CPU/RAM, ranks top models from HuggingFace that fit — scored by real benchmarks, not parameter count.

<!-- more -->

## 核心痛点解决

"我的破显卡到底能跑什么模型？" — 硬件能力探测 + 本地 LLM 选型评估。

## 核心功能

- **Auto-detect hardware** — NVIDIA / AMD / Apple Silicon / CPU-only
- **Evidence-based ranking** — 合并 LiveBench / Artificial Analysis / Aider / Vision / Chatbot Arena ELO / Open LLM Leaderboard，按置信度加权
- **Recency-aware** — 沿模型家族线衰减旧评分，防止过时数据长期占优
- **VRAM estimation** — weights + KV cache + activation + overhead（~500MB）
- **Speed modeling** — 基于带宽/量化效率/后端/MoE 激活参数比估算 tok/s
- **GPU simulation** — `whichllm --gpu "RTX 4090"` 购卡前测试

## 安装

```bash
uvx whichllm@latest          # 即装即用（推荐）
uv tool install whichllm       # 持久安装
pip install whichllm           # pip 安装
```

## 使用示例

```bash
whichllm                       # 本机最佳模型
whichllm --gpu "RTX 4090"     # 模拟某 GPU
whichllm upgrade "RTX 4090" "RTX 5090" "H100"  # 升级对比
whichllm run "qwen 2.5 1.5b gguf"  # 直接聊天
whichllm snippet "qwen 7b"    # 打印 Python 代码片段
```

## 输出示例

```
#1  Qwen/Qwen3.6-27B     27.8B  Q5_K_M   score 92.8    27 t/s
#2  Qwen/Qwen3-32B       32.0B  Q4_K_M   score 83.0    31 t/s
#3  Qwen/Qwen3-30B-A3B   30.0B  Q5_K_M   score 82.7   102 t/s
```

## 数据

- **3.9k Stars** · **215 Forks** · **210 Commits** · **v0.5.8**
- MIT License
- Python 100%
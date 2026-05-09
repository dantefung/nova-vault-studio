---
title: "Python 包管理工具对比"
date: "2026-05-09"
---

# Python 包管理工具对比

> pyenv vs uv：Python 版本管理与包管理的现代工具选择。

## Comparison

| 维度 | pyenv | uv |
|------|-------|-----|
| 主要用途 | Python 版本管理 | 包管理 + 虚拟环境 |
| 语言 | Shell 脚本 | Rust |
| 速度 | 一般 | 极快（10-100x pip） |
| 虚拟环境 | 需配合 pyenv-virtualenv | 内置支持 |
| 依赖格式 | 不涉及 | requirements.txt + pyproject.toml |

## Strengths of Each

- **pyenv**：成熟的 Python 版本管理，支持多种发行版
- **uv**：极速包安装，一体化解决方案

## Selection Guide

- 需要管理多个 Python 版本 → pyenv
- 需要快速安装依赖 → uv
- 最佳实践：pyenv 管理版本 + uv 管理依赖

## Related Pages

- [products/pyenv](products/pyenv)
- [products/uv](products/uv)

## Sources

- docs/md/guide/dev/python/pyenv-guide.md
- docs/md/guide/dev/python/uv.md

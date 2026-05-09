---
title: "uv"
date: "2026-05-09"
---

# uv

> Astral 开发的超快 Python 包管理器 + 虚拟环境工具，可替代 pip、pip-tools、virtualenv。

## Core Capabilities

- 极快的包安装速度（Rust 编写）
- 自动管理虚拟环境
- 支持 requirements.txt 和 pyproject.toml
- 可生成 lock 文件

## Technical Highlights

- Rust 编写，性能比 pip 快 10-100 倍
- 单一二进制文件，安装简单
- 兼容 pip 的依赖格式
- 支持 Python 版本管理

## Use Cases

- Python 项目依赖管理
- 替代 pip/poetry/virtualenv
- 需要快速安装依赖的 CI/CD 场景

## Related Pages

- [products/pyenv](products/pyenv)

## Sources

- docs/md/guide/dev/python/uv.md

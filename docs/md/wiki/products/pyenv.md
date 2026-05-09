---
title: "pyenv"
date: "2026-05-09"
---

# pyenv

> 简单的 Python 版本管理工具，允许在同一台机器上安装和切换多个 Python 解释器版本。

## Core Capabilities

- 安装多个 Python 版本
- 全局和局部版本切换
- 配合 pyenv-virtualenv 管理虚拟环境
- 支持 CPython、PyPy、Anaconda 等

## Technical Highlights

- 通过修改 PATH 控制当前 shell 使用的 Python
- 支持自动切换版本（.python-version 文件）
- 通过构建或下载二进制包管理

## Use Cases

- 多项目需要不同 Python 版本
- 测试代码在不同 Python 版本下的兼容性
- 安装系统默认版本之外的 Python

## Related Pages

- [[products/uv]]

## Sources

- docs/md/guide/dev/python/pyenv-guide.md

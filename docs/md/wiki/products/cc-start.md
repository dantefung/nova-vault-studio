---
title: "cc_start"
date: "2026-05-22"
---

# cc_start

> 跨终端 Claude Code 配置文件管理器，支持桌面端和 CLI，启动时可选择是否启用 `--dangerously-skip-permissions` 模式，实现全自动执行。

## Core Capabilities

- **跨终端配置文件管理**：在不同终端使用不同 Claude Code 配置文件
- **桌面端 + CLI 双安装**：桌面端便于修改和新增配置文件，相当于简版 cc switch
- **启动时权限模式选择**：可选择启用 `--dangerously-skip-permissions` 模式，无需一直点 Enter 确认
- **Claude Code 全自动执行**：配合 skip-permissions 模式，实现全程无感自动化

## Use Cases

- 多项目切换：不同项目使用不同 Claude Code 配置
- 自动化流程：启用 skip-permissions 模式，适合 CI/CD 或长时间任务
- 团队协作：统一管理多个终端的 Claude Code 配置

## Related Pages

- [products/claude-code](claude-code.md)
- [products/cc-connect](cc-connect.md)

## Sources

- https://github.com/1908490231/cc_start
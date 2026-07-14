---
title: "LazyVim Java 开发环境配置"
date: "2026-07-14"
source: "用户整理"
url: ""
tags: ["neovim", "lazyvim", "java", "jdtls", "lsp", "nvim-jdtls"]
---

# LazyVim Java 开发环境配置

> **核心结论**：LazyVim 通过 `:LazyExtras` 一键启用 Java 扩展包（Extra）即可获得完整的 Java 开发能力——底层驱动是 `nvim-jdtls`（Eclipse JDTLS），提供精准的代码结构解析和符号搜索。**前置条件**：系统已安装 Java 21+。

> **关键洞察**：
> - **一键启用**：`:LazyExtras` → 搜索 `lang.java` → 按 `x` 安装 → 重启 Neovim
> - **自动识别项目**：打开含 `pom.xml` / `build.gradle` 的项目时自动激活 Java 支持
> - **常用快捷键**：`<leader>cs`（类/方法大纲）+ `<leader>ss`（搜索项目符号）
> - **依赖变更要同步**：修改 `pom.xml` 后需运行 `:JdtUpdateConfig`

## 启用 Java 支持

### 步骤

1. **打开扩展管理界面**：在 Neovim 中执行命令 `:LazyExtras`
2. **搜索 Java 扩展**：在打开的列表中，输入 `/lang.java` 来快速定位
3. **安装扩展**：找到 `lang.java` 条目后，按下 **`x`** 键即可启用安装
4. **重启 Neovim**：安装完成后，重启 Neovim 即可

> **前置条件**：确保你的系统已安装 **Java 21** 或更高版本。

## 使用快捷键查看结构

启用 Java 支持后，使用标准的 LazyVim 快捷键查看源码结构：

| 快捷键 | 作用 |
|--------|------|
| **`<leader>cs`** | 打开当前 Java 文件的**类/方法大纲**（显示在侧边栏） |
| **`<leader>ss`** | **搜索当前项目中的所有符号**（如类名、方法名），这需要 LSP 正常工作 |

## 补充说明

### 工作原理

该扩展使用 `nvim-jdtls` 插件来驱动 Eclipse JDTLS（Java 的语言服务器），能提供：
- 精准的代码结构解析
- 项目内符号搜索

### 项目识别

当你打开包含以下文件的 Java 项目时，LazyVim 会自动激活 Java 支持：
- `pom.xml`（Maven）
- `build.gradle` / `build.gradle.kts`（Gradle）

### 故障排查

如果修改了 `pom.xml` 等依赖文件，可能需要运行命令：

```
:JdtUpdateConfig
```

来让 LSP 同步更新。

## 总结

简单来说，你只需要通过 `:LazyExtras` 启用 `lang.java` 扩展，之后就能正常使用所有查看源码结构的快捷键了。

## 关联资源

- 同目录：[markdown-preview.nvim 依赖说明](./markdown-preview-deps.md) — Vim/Neovim 通用 markdown 预览插件
- 同目录父级：`../modern-linux-dev-tools.md` — nvim + rg + fzf + bat 现代化编辑流
- 同目录父级：`../lazygit-guide.md` — lazygit 配置 `editCommand: 'nvim'`
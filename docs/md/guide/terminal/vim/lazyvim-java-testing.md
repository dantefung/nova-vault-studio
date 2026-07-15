---
title: "LazyVim 运行 Java 单元测试"
date: "2026-07-14"
source: "用户整理"
url: ""
tags: ["neovim", "lazyvim", "java", "neotest", "testing", "dap"]
---

# LazyVim 运行 Java 单元测试

> **核心结论**：LazyVim 通过 **Neotest** 插件运行 Java 测试，3 个 Extras 必须先启用（`test.core` + `lang.java` + `dap.core`）。所有测试快捷键以 `<leader>t` 开头——`tt` 跑当前文件、`tT` 跑所有、`tr` 跑光标方法。**Mason 自动装 `java-test` + `java-debugger-adapter`**。

> **关键洞察**：
> - **3 个 Extras 必须启用**：test.core + lang.java + dap.core
> - **快捷键系列都以 `<leader>t`** 开头（`<Space> t`）
> - **可视化反馈**：成功 ✓ / 失败 ✗（行号旁）+ 失败时自动弹窗
> - **调试走 DAP**（`<leader>d` 系列）

## 前置条件：3 个 Extras

| Extra | 作用 | 是否必需 |
|-------|------|----------|
| **`test.core`** | Neotest 测试框架核心 | ✅ 必需 |
| **`lang.java`** | Java 语言支持 | ✅ 必需 |
| **`dap.core`** | 调试适配器 | ✅ 必需（运行 + 调试测试） |

### 安装步骤

1. Neovim 中执行 `:LazyExtras`
2. 分别搜索并安装：
   - `/test.core` → `x` 启用
   - `/lang.java` → `x` 启用
   - `/dap.core` → `x` 启用
3. Mason 会**自动安装**：
   - `java-test`
   - `java-debugger-adapter`

检查状态：

```
:Mason
```

## 核心快捷键

所有测试快捷键以 `<leader>t`（`<Space> t`）开头。

| 快捷键 | 描述 |
|--------|------|
| **`<leader>tt`** | 运行**当前测试文件**中的所有测试 |
| **`<leader>tT`** | 运行**项目中所有测试文件** |
| **`<leader>tr`** | 运行**光标所在单个测试方法** |

> 完整按键序列：`tt` = `<Space> t t`，`tr` = `<Space> t r`。

## 查看测试结果

| 状态 | 视觉 |
|------|------|
| ✅ 成功 | 代码行号旁显示**绿色 ✓** |
| ❌ 失败 | 行号旁显示**红色 ✗**，自动弹出**浮动窗口**显示详细错误 |
| 重看输出 | `<leader>to` 重新打开最近测试输出窗口 |

## 进阶：调试测试

调试走 **DAP（Debug Adapter Protocol）**，快捷键以 `<leader>d` 开头：

```
<leader>d        → 打开调试相关菜单
<leader>db       → 设置断点
<leader>dc       → 启动调试器（停在断点）
```

## 备选方案：项目终端

如果 Neotest 在你的环境下不稳定，**最稳的备选**是直接用项目终端跑标准命令：

```bash
# Maven
mvn test

# Gradle
gradle test
```

这对所有 IDE / 编辑器都通用，**无需任何 Neovim 插件**。

## 故障排查

- **遇到错误时**：建议更新 LazyVim + 所有插件到最新版
- **`lang.java` 报错**：通常是配置问题，参考 [[lazyvim-java-gi-troubleshoot]] 排查

## 同仓库相关资源

- [lazyvim-java-setup.md](./lazyvim-java-setup.md) — 启用 lang.java
- [lazyvim-java-gi-troubleshoot.md](./lazyvim-java-gi-troubleshoot.md) — gI 排查
- [lazyvim-java-import.md](./lazyvim-java-import.md) — Java 导包
- [lazyvim-lsp-keymaps.md](./lazyvim-lsp-keymaps.md) — LSP 快捷键总览

## 参考

- Neotest：https://github.com/nvim-neotest/neotest
- LazyVim：https://www.lazyvim.org/
---
title: "LazyVim Java 导包（Import）操作指南"
date: "2026-07-14"
source: "用户整理"
url: ""
tags: ["neovim", "lazyvim", "java", "import", "code-action", "lsp"]
---

# LazyVim Java 导包（Import）操作指南

> **核心结论**：LazyVim 中 Java 导包的核心是 **`<leader>ca`（Code Action）**：一次按下自动整理所有导入（移除未使用 + 添加缺失）。**补全也是一道旁路**——`nvim-cmp` 选 `Enter` 时自动加 import。**前置**：必须先启用 `lang.java` 扩展。

> **关键洞察**：
> - **`<Space> c a`** = 整理导入（最常用，一条命令搞定所有缺失/未使用的 import）
> - **写代码时自动导入** —— 补全引擎接管，无需手动
> - **缺失导入也能修** —— 光标停在未导入类名上，再按 `<leader>ca`，菜单里选"Add missing imports"

## 核心快捷键：整理导入（Organize Imports）

这是**最直接**的方式：

| 项 | 值 |
|----|----|
| **快捷键** | `<leader>ca` |
| **按键序列** | `<Space> c a`（Leader 键是 Space） |
| **LSP 提供方** | jdtls（Eclipse JDT） |
| **行为** | 自动移除未使用 import + 整理所有 import 顺序 |

按下后，jdtls 弹出代码操作菜单，选择 **"Organize Imports"** 即可。

## 其他导入方式

### 1. 通过代码补全自动导入

在编写代码时，LazyVim 的代码补全（由 `nvim-cmp` 提供）会**自动推荐**未导入的类：

```
输入未导入的类名 → 补全菜单显示 → 接受补全（<Enter>）
→ 系统自动加 import
```

**无需手动操作**，补全引擎已经接管了。

### 2. 手动触发单一导入

光标放在未导入的类名上 → 按 `<leader>ca` → 菜单选 **"Add missing imports"**：

```java
public class Demo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();  // 光标停在 List
    }
}
// 按 <Space>ca → "Add missing imports" → 自动加:
// import java.util.ArrayList;
// import java.util.List;
```

## 前置条件：启用 Java 支持

**必须**先安装 `lang.java` 扩展，否则 `<leader>ca` 不会有 Java 代码操作：

1. Neovim 中执行 `:LazyExtras`
2. 弹窗中输入 `/lang.java` 搜索
3. 光标移到条目上 → 按 `x` 安装
4. 安装完成后**重启 Neovim**

## 完整工作流示例

```java
// 1. 你写代码，光标停在 List<String>
List<String> list;

// 2. 按 <Space>ca → 弹菜单，选 "Add missing imports"
// 自动变成：
import java.util.List;
List<String> list;

// 3. 写 ArrayList<>();, 同理
// jdtls 会自动加：import java.util.ArrayList;

// 4. 最后整体 <Space>ca → 选 "Organize Imports"
//   - 未使用的 import 会被移除
//   - import 按字母顺序分组排列
```

## 关键技术栈

| 组件 | 角色 |
|------|------|
| `nvim-jdtls` | 驱动 Eclipse JDTLS 提供 Java LSP |
| `nvim-cmp` | 代码补全引擎，触发自动 import |
| `which-key` | 按 `<Space>` 时弹出菜单提示 |
| `jdtls` | Eclipse Java Development Tools Language Server |

## 同仓库相关资源

- [lazyvim-java-setup.md](./lazyvim-java-setup.md) — 启用 lang.java 扩展
- [lazyvim-java-gi-troubleshoot.md](./lazyvim-java-gi-troubleshoot.md) — gI 跳转失效排查
- [lazyvim-lsp-keymaps.md](./lazyvim-lsp-keymaps.md) — LSP 快捷键总览（gr/gd/gI/K + `<leader>ca`）
- [lazyvim-lsp-config.md](./lazyvim-lsp-config.md) — LSP 自定义配置
- [lazyvim-keymap-config.md](./lazyvim-keymap-config.md) — 自定义 keymaps.lua

## 参考

- LazyVim 文档：https://www.lazyvim.org/
- nvim-jdtls：https://github.com/mfussenegger/nvim-jdtls
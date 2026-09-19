# Windows 安装 yazi 与 Rust 工具链（cargo）

> 适用环境：Windows 10/11 + Git Bash (MINGW64)
> 记录日期：2026-09-19
> 目标：所有工具集中到 `D:\software\develop\` 下，C 盘只放数据

## 概述

本文档记录在 Windows 上安装两个常用开发工具的最佳实践：

- **yazi** —— 终端文件管理器（Rust 编写，性能极佳）
- **Rust 工具链（rustc / cargo / rustup）** —— Rust 开发基础

## 最终目录结构

| 工具 | 安装路径 |
|------|---------|
| yazi | `D:\software\develop\yazi\` |
| cargo / rustc / rustup | `D:\software\develop\cargo\bin\` |
| rustup 元数据（工具链本体） | `D:\software\develop\rustup\` |

---

## 一、安装 yazi

### 1.1 为什么不用 scoop？

scoop 官方仓库（extras / versions / main）**只有 `yazi-nightly`（nightly 版），没有稳定版**。nightly 版可能有未修复的 bug，不适合日常使用。

### 1.2 推荐方式：下载官方 zip

```bash
# 下载最新稳定版
curl -L -o /tmp/yazi.zip https://github.com/sxyazi/yazi/releases/latest/download/yazi-x86_64-pc-windows-msvc.zip

# 解压到 D 盘
mkdir -p /d/software/develop/yazi
unzip -o /tmp/yazi.zip -d /d/software/develop/yazi/

# 整理目录：把子目录里的内容提到顶层
mv /d/software/develop/yazi/yazi-x86_64-pc-windows-msvc/* /d/software/develop/yazi/
rmdir /d/software/develop/yazi/yazi-x86_64-pc-windows-msvc

# 验证
/d/software/develop/yazi/yazi.exe --version
```

### 1.3 加到 PATH（用户级，新终端生效）

```powershell
[Environment]::SetEnvironmentVariable(
    'Path',
    ([Environment]::GetEnvironmentVariable('Path','User') + ';D:\software\develop\yazi'),
    'User'
)
```

注意：当前终端的 PATH 不会自动刷新，需要新开终端才能直接用 `yazi` 命令。

---

## 二、安装 Rust 工具链

### 2.1 为什么用 rustup 而非 scoop？

scoop 仓库里只有 `rust-nightly` 和 `rust-msvc-nightly`，没有稳定版的 `rust` 或 `rustup`。nightly 版不适合日常使用。

### 2.2 安装方式

**关键**：用 rustup-init 安装，并通过 `CARGO_HOME` 和 `RUSTUP_HOME` 环境变量指定安装到 D 盘。

```powershell
# 下载 rustup-init
curl -L -o $env:TEMP\rustup-init.exe https://win.rustup.rs/x86_64

# 在 PowerShell 进程内显式设置环境变量后再启动安装器
# （避免 bash 启动 PowerShell 时环境变量没传过去）
$env:CARGO_HOME = 'D:\software\develop\cargo'
$env:RUSTUP_HOME = 'D:\software\develop\rustup'
& $env:TEMP\rustup-init.exe -y --default-toolchain stable --profile minimal --no-modify-path
```

参数说明：

- `-y` —— 非交互模式
- `--default-toolchain stable` —— 安装 stable 工具链
- `--profile minimal` —— 最小安装（只装 rustc / cargo / rust-std，省空间）
- `--no-modify-path` —— 不让 rustup 自动改 PATH（手动控制更可控）

### 2.3 设置默认工具链

```bash
rustup default stable
```

### 2.4 加到 PATH

```powershell
[Environment]::SetEnvironmentVariable(
    'Path',
    ([Environment]::GetEnvironmentVariable('Path','User') + ';D:\software\develop\cargo\bin'),
    'User'
)
```

### 2.5 设置用户级环境变量（永久生效）

```powershell
[Environment]::SetEnvironmentVariable('CARGO_HOME', 'D:\software\develop\cargo', 'User')
[Environment]::SetEnvironmentVariable('RUSTUP_HOME', 'D:\software\develop\rustup', 'User')
```

---

## 三、避坑指南

### 3.1 rustup 安装到 C 盘的问题

**症状**：明明设置了 `CARGO_HOME=D:\software\develop\cargo`，但 rustup 还是装到 `~/.cargo`（C 盘）。

**原因**：rustup-init 进程没拿到环境变量。可能是 bash 启动 PowerShell 时 PATH 处理问题，导致环境变量没传到子进程。

**解决**：用 PowerShell 脚本，在 PowerShell 进程内显式设置环境变量后再启动 rustup-init：

```powershell
$env:CARGO_HOME = 'D:\software\develop\cargo'
$env:RUSTUP_HOME = 'D:\software\develop\rustup'
& 'C:\path\to\rustup-init.exe' -y --default-toolchain stable --profile minimal --no-modify-path
```

### 3.2 PATH 修改的小坑

修改 PATH 时**一定要加分号**。漏写分号会把两个路径黏在一起，导致 PATH 失效：

```text
# 错误（路径黏在一起）：
C:\...\zoxide_8wekyb3d8bbweC:\Users\fhlin\yazi

# 正确：
C:\...\zoxide_8wekyb3d8bbwe;C:\Users\fhlin\yazi;
```

**修复**（用 PowerShell 的字符串替换）：

```powershell
$path = [Environment]::GetEnvironmentVariable('Path','User')
$path = $path.Replace('8wekyb3d8bbweC:\Users\fhlin\yazi', '8wekyb3d8bbwe;C:\Users\fhlin\yazi;')
[Environment]::SetEnvironmentVariable('Path', $path, 'User')
```

### 3.3 MSVC 工具链警告

rustup 默认装的是 MSVC 工具链，需要 **Visual Studio Build Tools**（带 C++ 工作负荷）。如果没装：

- 纯 Rust crate 可以编译
- 任何带 C/C++ 依赖的 crate 会编译失败（`link.exe not found`）

解决方案二选一：

1. 装 Visual Studio Build Tools
2. 切换到 GNU 工具链：`rustup default stable-x86_64-pc-windows-gnu`（需要先装 MinGW）

---

## 四、卸载

```bash
# 删除目录
rm -rf /d/software/develop/yazi /d/software/develop/cargo /d/software/develop/rustup
```

```powershell
# 清理用户 PATH 和环境变量（用 PowerShell）
$path = [Environment]::GetEnvironmentVariable('Path','User')
$path = $path.Replace(';D:\software\develop\yazi', '').Replace(';D:\software\develop\cargo\bin', '')
[Environment]::SetEnvironmentVariable('Path', $path, 'User')
[Environment]::SetEnvironmentVariable('CARGO_HOME', $null, 'User')
[Environment]::SetEnvironmentVariable('RUSTUP_HOME', $null, 'User')
```

---

## 五、参考资源

- yazi: <https://github.com/sxyazi/yazi>
- rustup 环境变量文档: <https://rust-lang.github.io/rustup/environment-variables.html>
- rustup-init 下载: <https://win.rustup.rs/x86_64>
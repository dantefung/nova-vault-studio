---
title: "在 Debian 上安装 Rust"
date: "2026-09-14"
source: "rust-lang.org"
url: "https://www.rust-lang.org/tools/install"
---

# 在 Debian 上安装 Rust

## 简介

[Rust](https://www.rust-lang.org) 是一种注重安全、速度和并发性的系统编程语言。推荐通过官方工具链管理器 **rustup** 进行安装，可方便地切换不同版本。

官方仓库：[github.com/rust-lang/rustup](https://github.com/rust-lang/rustup)

## 安装

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装过程中会提示选择安装配置，一般直接按回车选择默认选项即可。

## 配置环境变量

安装完成后，需要刷新当前 shell 环境：

```bash
source "$HOME/.cargo/env"
```

或在 `~/.bashrc`（或 `~/.zshrc`）末尾追加：

```bash
echo 'source "$HOME/.cargo/env"' >> ~/.zshrc
source ~/.zshrc
```

## 验证安装

```bash
rustc --version
cargo --version
rustup --version
```

正常输出示例：

```
rustc 1.xx.x (xx...xx xx xx)
cargo 1.xx.x
rustup 1.xx.x
```

## 常用操作

```bash
# 更新 Rust
rustup update

# 查看已安装工具链
rustup toolchain list

# 安装特定版本
rustup toolchain install 1.75.0

# 切换到指定版本
rustup default 1.75.0

# 添加目标平台（如 wasm）
rustup target add wasm32-unknown-unknown
```

## 卸载

```bash
rustup self uninstall
```

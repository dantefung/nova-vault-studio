# psmux 安装指南（Windows 原生 tmux 替代）

> psmux = PowerShell muxer，**Rust 写的 Windows 原生终端复用器**，不是 tmux 的 wrapper / port。
> GitHub: https://github.com/psmux/psmux  |  Stars: 3.5k  |  License: MIT  |  最新: v3.3.8

## 一、为什么选 scoop

| 安装方式 | 自动加 PATH | 隔离安装 | 需要前置工具 |
|---------|-----------|---------|------------|
| **scoop**（推荐） | ✅ | ✅ | scoop |
| winget | ✅ 但要管理员 | ❌ 全局 | winget |
| cargo | ❌ 有传播陷阱 | ✅ | Rust 工具链（编译慢） |
| GitHub Release zip | ❌ 有传播陷阱 | ✅ | 手 |

**选 scoop 的决定性理由**：PATH 传播陷阱不会出现（scoop 自动把 shims 加进 PATH，不依赖注册表）。手动装 yazi / cargo 时遇到的 "bash 看不到新 PATH" 问题，scoop 装的工具都不会有。

## 二、前置条件

- Windows 10 / 11
- PowerShell 5+（Win10 自带；Win11 自带 PowerShell 7）
- scoop 已装

## 三、安装步骤

### 3.1 检查 scoop 健康（必做）

```bash
scoop status
```

如果看到 `fatal: ambiguous argument 'HEAD'`，说明 main bucket 是坏的（见 5.1），先修。

### 3.2 加 psmux bucket

```bash
scoop bucket add psmux https://github.com/psmux/scoop-psmux
```

### 3.3 安装

```bash
scoop install psmux
```

会自动创建 3 个 shim：`psmux`、`pmux`、`tmux`（三个是同一个二进制，名字只是别名）。

## 四、验证

```bash
# cmd
where psmux
psmux --version

# bash
psmux --version
echo "$PATH" | grep -i scoop   # 应该能看到 shims 目录
```

期望输出：版本号（`v3.3.8`）+ ASCII art banner。

## 五、避坑指南

### 5.1 scoop main bucket 损坏（**必踩**）

**症状**：
- `scoop status` 报 `fatal: ambiguous argument 'HEAD'`
- `scoop search xxx` 没结果
- `scoop install` 各种失败

**原因**：main bucket 本地 clone 成了空仓库（master 分支无 commits）。可能是 `scoop update` 时网络中断或上次升级没完成。

**修复**：

```bash
scoop bucket rm main
scoop bucket add main
```

**预防**：定期跑 `scoop update`，避免中断。

### 5.2 "Multiple buckets contain manifest" WARN

**症状**：

```text
WARN  Multiple buckets contain manifest 'psmux', the current selection is 'main/psmux'.
```

**含义**：main bucket 里也有同名 manifest（可能是更老版本）。scoop 默认从 main 拿，但**如果你想要 psmux 官方 bucket 里的版本**，需要明确：

```bash
scoop install psmux/psmux   # 从 psmux bucket 安装
```

**建议**：直接接受默认（main bucket 里的版本也会自动跟），但要知道这条 WARN 在说什么。

### 5.3 PATH 传播陷阱（scoop 不会出现）

跟手动安装的 `yazi` / `cargo` 不同，**scoop 装的工具不会有 PATH 传播陷阱**：

| 安装方式 | bash 能否直接用 |
|---------|---------------|
| 手动解压 exe 到 PATH 目录 | 受 PATH 传播陷阱影响（见 `yazi-cargo-install.md` 3.4） |
| **scoop 装的工具** | ✅ 自动加到 PATH，任何新启动的 bash 都看得到 |

**原因**：scoop 的 shims 目录不是通过注册表，而是通过 scoop 自己的环境变量持久化机制加入 PATH。任何新启动的 bash / PowerShell 都会 source scoop 的 env 配置（`~/scoop/apps/scoop/current/bin/scoop-env.ps1` 类似机制）。

**结论**：如果你的工具**可以用 scoop 装**，永远优先选 scoop，省掉 PATH 三处同步的麻烦。

## 六、基础使用

```bash
# 新建命名会话
psmux new-session -s work

# 列出所有会话
psmux ls

# 附着到会话
psmux attach -t work

# 分离会话（在会话里按 Ctrl+B 再按 d）

# 杀掉会话
psmux kill-session -t work
```

`pmux` 和 `tmux` 是 `psmux` 的别名，三个命令完全等价。

### 跟传统 tmux 的兼容

- 支持现有 `.tmux.conf`（自动加载）
- 支持 tmux 主题
- 90+ tmux 命令、140+ 格式变量、53 个 vim copy-mode 键
- **不依赖** WSL / Cygwin / MSYS2（用 Windows ConPTY）

## 七、卸载

```bash
scoop uninstall psmux
scoop bucket rm psmux   # 如果不再用，bucket 也删掉
```

干净彻底，无残留。

## 八、参考

- psmux 官方: https://github.com/psmux/psmux
- Scoop bucket: https://github.com/psmux/scoop-psmux
- 姐妹文档: `yazi-cargo-install.md`（手动安装工具的 PATH 传播陷阱案例）

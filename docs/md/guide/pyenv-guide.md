# pyenv 指南

`pyenv` 是一个简单的 Python 版本管理工具，允许用户在同一台机器上安装和切换多个 Python 解释器版本。它对开发者在不同项目间保持兼容性、测试多版本行为非常有帮助。

本指南介绍 `pyenv` 的安装、基本用法、配置和常见问题解决方案。

## 1. 概述

- 官方仓库：https://github.com/pyenv/pyenv
- 支持的命令行：`pyenv`
- 通过构建或下载二进制包管理 CPython、PyPy、Anaconda 等发行版

`pyenv` 的核心概念是通过修改 `PATH` 来控制当前 shell 会话使用哪个 Python。它配合 `pyenv-virtualenv` 可以方便地创建项目隔离的虚拟环境。

## 2. 安装

### 2.1 系统依赖

大多数 Linux/Mac 系统需要以下软件用于构建 Python：

```bash
# Debian/Ubuntu 示例
sudo apt update && sudo apt install -y build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev curl libncursesw5-dev xz-utils \
    tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
```

### 2.2 安装步骤

通过 Git 克隆仓库：

```bash
# 克隆到 ~/.pyenv
git clone https://github.com/pyenv/pyenv.git ~/.pyenv

# 将初始化脚本加入 shell 配置（bash/zsh）
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init --path)"' >> ~/.bashrc
# 对于 zsh 请修改 ~/.zshrc

# 重新加载配置或重启终端
source ~/.bashrc

# 验证
pyenv --version
```

> ⚠️ 如果使用 Ubuntu 的 `apt` 安装 `pyenv` 包，可能会缺少最新功能，建议采用 Git 克隆方式。

### 2.3 可选插件

- `pyenv-virtualenv`：自动创建和激活虚拟环境
- `pyenv-update`：升级 `pyenv` 本体

```bash
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv
# 然后在 shell 配置中添加 eval "$(pyenv virtualenv-init -)"
```

## 3. 常用命令

### 3.1 列出可用版本

```bash
pyenv install --list      # 显示所有可安装的 Python 版本
pyenv versions             # 显示已安装的版本
```

### 3.2 安装和卸载

```bash
pyenv install 3.11.5      # 安装指定版本
pyenv uninstall 3.8.10     # 卸载版本
```

### 3.3 切换版本

```bash
pyenv global 3.11.5        # 设置全局默认版本
pyenv local 3.9.13         # 在当前目录创建 .python-version 文件
pyenv shell 2.7.18         # 仅在当前 shell 会话中使用指定版本
pyenv rehash               # 重新生成 shims（通常自动完成）
```

### 3.4 虚拟环境（使用 pyenv-virtualenv）

```bash
pyenv virtualenv 3.11.5 myproject
pyenv activate myproject   # 或者 cd 到含有 .python-version 的目录
pyenv deactivate
```

## 4. 配置

`~/.pyenv` 目录包含所有安装的 Python，以及 `shims` 与 `versions` 子目录。可以通过环境变量自定义行为：

```bash
# 设置下载源镜像
export PYTHON_BUILD_MIRROR_URL="https://mirrors.aliyun.com/python"
```

> 💡 将常用版本写入 `~/.python-version` 以便在启动 shell 时自动加载。

## 5. 高级用法

- 在 CI 中使用：在构建脚本中安装所需版本并执行 `pyenv global`。
- 编写 `~/.python-version` 在项目间切换。
- 使用 `pyenv exec` 运行特定版本的命令，例如 `pyenv exec pip install -U pip`。

## 6. 故障排查

* `pyenv: command not found`：确认 `PYENV_ROOT/bin` 已添加至 `PATH`，并重新加载配置。
* 安装失败：检查依赖是否齐全，查看 `~/.pyenv/build.log` 获取详细错误。
* 版本列表为空：执行 `pyenv --version` 检查是否正确安装，执行 `pyenv install --list`。
* 切换无效：确保没有全局系统 `python` 的优先级高于 shims，运行 `pyenv doctor`（需安装 pyenv-doctor 插件）进行诊断。

以上覆盖了日常使用 `pyenv` 管理 Python 环境所需的主要操作。更多细节请参阅官方文档。
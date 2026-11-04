# Debian 安装 kubectl（用户目录方案）

> 适用场景：Debian / Ubuntu 机器上安装 kubectl，没有 sudo 权限或不想污染系统目录
> 记录日期：2026-11-04
> 实测环境：Debian 13 (amd64) · zsh · kubectl v1.37.2

## 概述

kubectl 是单个静态二进制文件，不存在依赖问题，所以不需要 apt 源。直接从官方 `dl.k8s.io` 下载放到用户目录 `~/.local/bin`，零 root、零污染，删除该文件即卸载。

## 安装步骤

### 1. 前置检查

```bash
# 确认架构（决定下载 amd64 还是 arm64）
uname -m

# 确认没装过 / 确认 ~/.local/bin 在 PATH 中
which kubectl
case ":$PATH:" in *":$HOME/.local/bin:"*) echo "PATH OK";; *) echo "需要加 PATH";; esac
```

`~/.local/bin` 不在 PATH 时，往 `~/.zshrc` 或 `~/.bashrc` 加一行后重新开 shell：

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### 2. 下载并安装

```bash
# 取官方最新稳定版版本号
STABLE_VERSION=$(curl -sL https://dl.k8s.io/release/stable.txt)

# 下载对应架构的二进制（amd64 机器）
curl -sL --fail -o /tmp/kubectl \
  "https://dl.k8s.io/release/${STABLE_VERSION}/bin/linux/amd64/kubectl"

# 加执行权限，挪到用户 bin 目录
chmod +x /tmp/kubectl
mkdir -p ~/.local/bin
mv /tmp/kubectl ~/.local/bin/kubectl
```

arm64 机器把 URL 里的 `amd64` 换成 `arm64`。

### 3. 验证

```bash
kubectl version --client=true
# Client Version: v1.37.2
# Kustomize Version: v5.8.1

# zsh 补全（可选）
kubectl completion zsh > ~/.kubectl-completion.zsh
echo 'source ~/.kubectl-completion.zsh' >> ~/.zshrc
```

## 关键说明

### 为什么不用 apt

Debian 仓库里的 kubectl 版本严重滞后，且要加 Google 的 apt 源（`pkgs.k8s.io`）改系统配置。kubectl 本身是单文件静态链接，apt 方式没有任何好处，只有升级滞后和 root 目录污染两个坏处。

### 没有 kubeconfig 连不上集群

装完 kubectl 只是客户端可用。连接集群需要凭证文件 `~/.kube/config`（从集群管理员处获取），验证连通：

```bash
kubectl get nodes
```

### 固定版本安装

不用最新版时，把 `stable.txt` 那步替换成硬编码版本：

```bash
curl -sL --fail -o /tmp/kubectl \
  "https://dl.k8s.io/release/v1.37.2/bin/linux/amd64/kubectl"
```

## 参考资源

- 官方安装文档: <https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/>
- 版本通道: <https://dl.k8s.io/release/stable.txt>

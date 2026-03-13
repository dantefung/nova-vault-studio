# OpenVPN 3 Linux 安装与连接指南（Debian / Ubuntu）

适用系统：

- Debian 12 / 13
- Ubuntu 22.04 / 24.04
- 其他兼容 `apt` 的 Debian 系发行版

------------------------------------------------------------------------

## 一、安装前说明

本文说明如何在 Debian / Ubuntu 上安装 **OpenVPN 3 Linux**，并通过导入 `.ovpn` 配置文件建立 VPN 连接。

OpenVPN 3 Linux 与传统的 `openvpn` 不同，它使用独立的客户端和会话管理命令，适合日常连接、查看状态和管理会话。

如果你已经拿到了 VPN 提供方提供的 `.ovpn` 配置文件，可以直接按照本文操作。

------------------------------------------------------------------------

## 二、安装依赖工具

先安装 OpenVPN 官方软件源需要的依赖：

```bash
sudo apt update
sudo apt install apt-transport-https curl
```

------------------------------------------------------------------------

## 三、添加 OpenVPN 官方软件源

### 1. 创建 keyrings 目录

```bash
sudo mkdir -p /etc/apt/keyrings
```

说明：

- 某些系统默认没有 `/etc/apt/keyrings`
- 先创建目录可以避免后续导入密钥失败

### 2. 导入 OpenVPN 软件源签名密钥

```bash
curl -sSfL https://packages.openvpn.net/packages-repo.gpg | sudo tee /etc/apt/keyrings/openvpn.asc >/dev/null
```

### 3. 添加 OpenVPN 3 软件源

请将下面命令中的 `<发行版代号>` 替换为你系统对应的代号：

```bash
echo "deb [signed-by=/etc/apt/keyrings/openvpn.asc] https://packages.openvpn.net/openvpn3/debian <发行版代号> main" | sudo tee /etc/apt/sources.list.d/openvpn3.list
```

常见发行版代号示例：

- Debian 12：`bookworm`
- Debian 13：`trixie`
- Ubuntu 22.04：`jammy`
- Ubuntu 24.04：`noble`

例如 Debian 12：

```bash
echo "deb [signed-by=/etc/apt/keyrings/openvpn.asc] https://packages.openvpn.net/openvpn3/debian bookworm main" | sudo tee /etc/apt/sources.list.d/openvpn3.list
```

------------------------------------------------------------------------

## 四、安装 OpenVPN 3 Linux 客户端

更新软件源并安装客户端：

```bash
sudo apt update
sudo apt install openvpn3-client
```

安装完成后，可以查看版本或帮助信息确认是否安装成功：

```bash
openvpn3 version
```

如果你的系统不支持 `version` 子命令，也可以直接执行：

```bash
openvpn3 --help
```

------------------------------------------------------------------------

## 五、导入 `.ovpn` 配置文件

假设你的配置文件路径为 `<配置文件路径>`，例如：

```bash
/home/yourname/vpn/company.ovpn
```

导入命令：

```bash
openvpn3 config-import --config <配置文件路径>
```

如果你想指定一个更容易记住的配置名，可以使用：

```bash
openvpn3 config-import --config <配置文件路径> --name <配置名>
```

例如：

```bash
openvpn3 config-import --config ~/vpn/company.ovpn --name workvpn
```

查看已导入的配置：

```bash
openvpn3 configs-list
```

------------------------------------------------------------------------

## 六、启动 VPN 连接

如果你在导入时指定了配置名，可以直接启动：

```bash
openvpn3 session-start --config <配置名>
```

例如：

```bash
openvpn3 session-start --config workvpn
```

如果连接过程需要用户名、密码或双因素认证，终端中会提示输入。

连接成功后，系统会创建一个新的 OpenVPN 3 会话。

------------------------------------------------------------------------

## 七、查看和管理 VPN 连接

### 1. 查看当前活跃会话

```bash
openvpn3 sessions-list
```

输出中会包含：

- 会话路径（`Path`）
- 配置名称
- 连接状态

其中会话路径通常类似：

```bash
/net/openvpn/v3/sessions/xxxxxxxxxxxxxxxxxxxxxxxx
```

后续查看统计信息、日志和断开连接时都会用到这个路径。

### 2. 查看连接统计信息

```bash
openvpn3 session-stats --path <session-path>
```

例如：

```bash
openvpn3 session-stats --path /net/openvpn/v3/sessions/xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 查看会话详细信息

```bash
openvpn3 session-manage --path <session-path> --show-details
```

### 4. 查看实时日志

```bash
openvpn3 session-log --path <session-path>
```

------------------------------------------------------------------------

## 八、验证 VPN 是否已经生效

### 1. 查看当前公网 IP

```bash
curl ifconfig.me
```

如果连接成功，公网 IP 通常会变化为 VPN 出口地址。

### 2. 查看本机网卡信息

```bash
ip addr show
```

通常会看到新的隧道网卡或地址信息。

### 3. 查看路由表

```bash
ip route show
```

如果默认路由或特定目标网段已经走 VPN，说明路由已生效。

------------------------------------------------------------------------

## 九、断开 VPN 连接

### 1. 按会话路径断开

```bash
openvpn3 session-manage --path <session-path> --disconnect
```

### 2. 按配置名断开

```bash
openvpn3 session-manage --config <配置名> --disconnect
```

例如：

```bash
openvpn3 session-manage --config workvpn --disconnect
```

------------------------------------------------------------------------

## 十、后续连接的常用方式

配置导入后，后续通常不需要再次导入，只需要重新启动会话：

```bash
openvpn3 session-start --config <配置名>
```

例如：

```bash
openvpn3 session-start --config workvpn
```

------------------------------------------------------------------------

## 十一、常用排查与状态检查命令

### 查看所有配置

```bash
openvpn3 configs-list
```

### 查看所有会话（包括已断开的）

```bash
openvpn3 sessions-list --all
```

### 查看 OpenVPN 3 服务状态

```bash
systemctl status openvpn3-service
```

### 查看帮助

```bash
openvpn3 --help
```

------------------------------------------------------------------------

## 十二、常见问题

### 1. `apt update` 时提示源不可用

常见原因：

- 发行版代号填写错误
- 网络无法访问 OpenVPN 官方源
- GPG 密钥未正确导入

建议检查：

```bash
cat /etc/apt/sources.list.d/openvpn3.list
ls -l /etc/apt/keyrings/openvpn.asc
```

### 2. 已安装客户端，但命令找不到

可以检查：

```bash
which openvpn3
```

如果没有输出，说明客户端可能未正确安装。

### 3. 可以连接，但访问仍然没有走 VPN

优先检查：

```bash
curl ifconfig.me
ip route show
openvpn3 session-stats --path <session-path>
```

如果 IP 没有变化，可能是：

- VPN 服务端没有下发默认路由
- 仅配置了部分网段走 VPN
- 本地策略路由或防火墙影响了流量

------------------------------------------------------------------------

## 十三、命令速查

```bash
# 导入配置
openvpn3 config-import --config <配置文件路径> --name <配置名>

# 查看配置
openvpn3 configs-list

# 启动连接
openvpn3 session-start --config <配置名>

# 查看会话
openvpn3 sessions-list

# 查看统计
openvpn3 session-stats --path <session-path>

# 查看详细信息
openvpn3 session-manage --path <session-path> --show-details

# 查看日志
openvpn3 session-log --path <session-path>

# 断开连接
openvpn3 session-manage --path <session-path> --disconnect
```

------------------------------------------------------------------------

文档生成时间：2026-03-14

# Debian 13 KDE Plasma 环境说明 & Flatpak 配置指南

## 一、当前桌面环境确认

通过以下命令确认当前桌面环境：

``` bash
echo $XDG_CURRENT_DESKTOP
echo $DESKTOP_SESSION
```

示例输出：

    KDE
    plasma

说明当前使用的是：

-   桌面环境：KDE Plasma
-   Session：plasma
-   显示服务器：Wayland（之前确认）
-   系统：Debian 13

------------------------------------------------------------------------

## 二、安装 Flatpak

### 1. 更新软件源

``` bash
sudo apt update
```

### 2. 安装 Flatpak

``` bash
sudo apt install flatpak
```

------------------------------------------------------------------------

## 三、KDE 集成 Flatpak（推荐）

安装 KDE Discover 的 Flatpak 后端支持：

``` bash
sudo apt install plasma-discover-backend-flatpak
```

安装后，KDE 自带的 Discover 软件中心即可管理 Flatpak 应用。

------------------------------------------------------------------------

## 四、添加 Flathub 官方仓库

``` bash
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

------------------------------------------------------------------------

## 五、测试安装

查看版本：

``` bash
flatpak --version
```

搜索应用：

``` bash
flatpak search telegram
```

安装示例：

``` bash
flatpak install flathub org.telegram.desktop
```

运行：

``` bash
flatpak run org.telegram.desktop
```

## 软件的安装位置

在 **Debian + KDE** 环境下，Flatpak 安装的软件位置取决于你是 **系统级安装** 还是 **用户级安装** 👇

---

### 系统级安装（sudo 安装）

```bash
sudo flatpak install flathub 应用ID
```

安装目录：

```
/var/lib/flatpak/
```

主要结构：

```
/var/lib/flatpak/
├── app/        # 应用程序
├── runtime/    # 运行时环境
└── repo/       # ostree 仓库
```

示例：

```
/var/lib/flatpak/app/org.telegram.desktop/
```

这里的 Telegram 指的是：

Telegram Desktop

---

### 用户级安装（推荐开发者使用）

```bash
flatpak install --user flathub 应用ID
```

安装目录：

```
~/.local/share/flatpak/
```

结构类似：

```
~/.local/share/flatpak/
├── app/
├── runtime/
└── repo/
```

---

### 应用数据目录（重点）

很多人误以为程序目录就是数据目录，其实不是。

Flatpak 应用运行时的数据目录在：

```
~/.var/app/应用ID/
```

例如：

```
~/.var/app/org.telegram.desktop/
```

里面通常有：

```
config/
data/
cache/
```

这个目录才是你做开发调试时最常操作的地方。

---

### 查看某个应用安装位置

```bash
flatpak info 应用ID
```

比如：

```bash
flatpak info org.telegram.desktop
```

会显示：

* 安装位置（system / user）
* 运行时
* 版本
* 架构

---

### 快速判断你当前默认安装模式

```bash
flatpak list --columns=application,installation
```

输出会显示：

* system
* user

---

### 总结（开发角度）

| 类型     | 目录                     | 适合场景  |
| ------ | ---------------------- | ----- |
| system | /var/lib/flatpak       | 多用户机器 |
| user   | ~/.local/share/flatpak | 个人开发  |
| 数据目录   | ~/.var/app             | 配置和缓存 |

---


------------------------------------------------------------------------

## 六、常用命令

  功能         命令
  ------------ --------------------------
  查看已安装   flatpak list
  搜索应用     flatpak search 关键词
  更新应用     flatpak update
  卸载应用     flatpak uninstall 应用ID
  查看源       flatpak remotes

------------------------------------------------------------------------

## 七、可选调试

查看详细运行日志：

``` bash
flatpak run --verbose 应用ID
```

------------------------------------------------------------------------

## 总结

你当前系统：

-   Debian 13
-   KDE Plasma 桌面环境
-   Wayland 会话

建议安装：

-   flatpak
-   plasma-discover-backend-flatpak
-   添加 flathub 仓库

这样即可完整支持 Flatpak 桌面应用生态。

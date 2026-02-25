# keyd 安装与完整配置指南（Debian / Ubuntu）

版本：2026 适用系统：Debian / Ubuntu / 兼容 systemd 的 Linux 发行版

------------------------------------------------------------------------

# 一、什么是 keyd

keyd 是一个轻量级 Linux 键盘重映射守护进程。

特点：

-   工作在内核输入层（低延迟）
-   支持层（layer）
-   支持单击/长按双功能键
-   兼容 X11 与 Wayland
-   不依赖桌面环境

------------------------------------------------------------------------

# 二、安装 keyd

## 1️⃣ Debian / Ubuntu 直接安装

    sudo apt update
    sudo apt install keyd

安装完成后启用服务：

    sudo systemctl enable keyd
    sudo systemctl start keyd

检查服务状态：

    systemctl status keyd

若显示 active (running)，说明安装成功。

------------------------------------------------------------------------

# 三、确认键盘设备

查看系统输入设备：

    cat /proc/bus/input/devices

找到类似：

    Name="AT Translated Set 2 keyboard"

这通常是笔记本内置键盘。

------------------------------------------------------------------------

# 四、创建配置文件

配置文件路径：

    /etc/keyd/default.conf

编辑文件：

    sudo nano /etc/keyd/default.conf

------------------------------------------------------------------------

# 五、完整示例配置（AHK 迁移版本）

功能说明：

-   单击 CapsLock → Esc
-   按住 CapsLock → 方向层
-   Caps + h/j/k/l → 方向键
-   单击 Esc → 切换大小写

完整配置：

``` ini
[ids]
*

[main]
# 单击 = Esc
# 按住 = 进入 navigation 层
capslock = overload(nav, esc)
esc = capslock

[nav]
h = left
j = down
k = up
l = right
```

------------------------------------------------------------------------

# 六、应用配置

保存文件后执行：

    sudo systemctl restart keyd

------------------------------------------------------------------------

# 七、调试方法

实时查看按键：

    sudo keyd monitor

查看 keyd 是否识别设备：

    sudo keyd list-devices

------------------------------------------------------------------------

# 八、常见问题

## 1️⃣ Caps 仍然是大写键

原因：

-   配置未生效
-   服务未重启
-   ids 未匹配设备

解决：

    sudo systemctl restart keyd

若仍不生效，可将 \[ids\] 改为：

    *

------------------------------------------------------------------------

## 2️⃣ 找不到 keyd 命令

有些系统可执行文件名为：

    keyd.rvaiya

可以执行：

    which keyd.rvaiya

------------------------------------------------------------------------

# 九、扩展增强（可选）

在 nav 层增加：

``` ini
u = pageup
i = pagedown
n = home
m = end
```

------------------------------------------------------------------------

# 十、卸载 keyd

    sudo systemctl stop keyd
    sudo systemctl disable keyd
    sudo apt remove keyd

------------------------------------------------------------------------

文档生成时间：2026

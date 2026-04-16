
# Qoder 在 Debian 13 (KDE + Wayland) 输入法无法激活解决方案

## 问题背景

环境：

-   Debian 13
-   KDE Plasma
-   Wayland
-   fcitx5 输入法
-   Qoder（Electron 架构）

现象：

-   在 Qoder 中无法输入中文
-   输入法无法激活

------------------------------------------------------------------------

## 问题原因

Electron 在 Wayland 下默认：

-   不启用 Ozone（Wayland 渲染）
-   不启用 Wayland IME（输入法）

导致 fcitx5 无法注入输入法。

------------------------------------------------------------------------

## ✅ 解决方案（推荐）

### 临时测试

在终端执行：

``` bash
export ELECTRON_OZONE_PLATFORM_HINT=wayland
export ELECTRON_ENABLE_WAYLAND_IM=1
qoder
```

------------------------------------------------------------------------

### 永久生效

编辑配置文件：

``` bash
nano ~/.profile
```

加入：

``` bash
export ELECTRON_OZONE_PLATFORM_HINT=wayland
export ELECTRON_ENABLE_WAYLAND_IM=1
```

保存后：

👉 注销并重新登录

------------------------------------------------------------------------

## 🔍 环境变量检查

执行：

``` bash
echo $GTK_IM_MODULE
echo $QT_IM_MODULE
echo $XMODIFIERS
```

应输出：

``` bash
fcitx
fcitx
@im=fcitx
```

如果为空，请补充：

``` bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
```

------------------------------------------------------------------------

## 🚨 常见错误

### ❌ 直接修改启动脚本加参数

会报错：

    bad option: --enable-features=UseOzonePlatform

原因：

-   Qoder 使用 `ELECTRON_RUN_AS_NODE=1`
-   此时参数被当成 Node 参数处理

------------------------------------------------------------------------

## 🧠 原理说明

Electron 在 Wayland 下：

  功能           默认状态
  -------------- ----------
  Wayland 渲染   关闭
  输入法支持     关闭

必须手动开启。

------------------------------------------------------------------------

## 🎯 稳定方案（开发推荐）

如果你追求稳定开发体验：

👉 使用 X11 替代 Wayland

登录时选择：

    Plasma (X11)

优点：

-   输入法稳定
-   Electron 应用兼容性更好

------------------------------------------------------------------------

## 总结

推荐优先级：

1.  使用环境变量启用 Wayland IME ✅
2.  确保 fcitx5 环境变量正确
3.  不行就切换 X11（最稳）

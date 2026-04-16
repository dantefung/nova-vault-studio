
# Debian 13 + Wayland + IntelliJ IDEA 输入法问题解决指南

## 一、问题背景

在 Debian 13 使用 Wayland + fcitx5 输入法时，JetBrains 系列 IDE（如
IntelliJ IDEA）经常出现：

-   无法切换输入法
-   中文候选框不显示
-   输入卡顿 / 光标异常

本质原因：

> Wayland + fcitx5 + JetBrains (Swing/AWT) 输入法机制不完全兼容

------------------------------------------------------------------------

## 二、推荐解决方案（按优先级）

### ✅ 方案1：启动时注入环境变量（推荐）

``` bash
env GTK_IM_MODULE=fcitx \
    QT_IM_MODULE=fcitx \
    XMODIFIERS=@im=fcitx \
    _JAVA_AWT_WM_NONREPARENTING=1 \
    idea
```

------------------------------------------------------------------------

### ✅ 方案2：配置 JVM 参数

编辑：

``` bash
~/.config/JetBrains/IntelliJIdea*/idea64.vmoptions
```

添加：

``` text
-Drecreate.x11.input.method=true
-Dim.disable.input.method=false
```

------------------------------------------------------------------------

### ✅ 方案3：安装 fcitx5 依赖

``` bash
sudo apt install fcitx5 fcitx5-qt fcitx5-gtk fcitx5-chinese-addons
```

关键组件：

-   fcitx5-qt（IDEA 必需）
-   fcitx5-gtk（候选框显示）

------------------------------------------------------------------------

## 三、常见问题对照

### ❌ 无法切换中文

→ 环境变量未生效

### ❌ 有输入法但无候选框

→ 缺少 fcitx5-qt 或 Wayland 渲染问题

### ❌ 输入卡顿 / 光标乱跳

→ Wayland + Java UI 兼容问题（无彻底解）

------------------------------------------------------------------------

## 四、终极稳定方案（强烈推荐）

切换到 X11：

登录界面选择：

> Plasma (X11)

优点：

-   输入法完全正常
-   JetBrains 官方推荐路径
-   无奇怪兼容问题

------------------------------------------------------------------------

## 五、工程建议

Wayland 当前在开发工具链中仍存在问题，尤其是：

-   Java IDE（IDEA / Android Studio）
-   输入法
-   屏幕工具

👉 如果你是开发者，建议主力环境使用 X11

------------------------------------------------------------------------

## 六、总结

  方案              稳定性
  ----------------- ------------
  Wayland + tweak   ⭐⭐⭐
  X11 + fcitx5      ⭐⭐⭐⭐⭐

推荐：

> 生产力优先 → 使用 X11


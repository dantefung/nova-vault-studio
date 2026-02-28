# IntelliJ IDEA 跨 Windows → Linux 迁移构建失败问题总结

## 一、问题现象

从 Windows 将 Java 项目直接拷贝到 Linux 后，在 IntelliJ IDEA
中构建时报错：

    Abnormal build process termination
    nice: ‘D:/software/jdk11/bin/java’: 没有那个文件或目录

构建日志中仍然出现：

    -Djps.fallback.jdk.home=D:/software/jdk

说明 IDE 仍在尝试使用 Windows 下的 JDK 路径。

------------------------------------------------------------------------

## 二、问题本质

这是 **跨平台迁移导致的绝对路径污染问题**。

IntelliJ IDEA 会在多个位置保存 JDK 绝对路径：

### 1️⃣ 项目级配置

-   `.idea/misc.xml`
-   `.idea/compiler.xml`
-   `*.iml`

### 2️⃣ 全局级配置（更关键）

-   `~/.config/JetBrains/IntelliJIdea2025.3/options/jdk.table.xml`
-   `~/.cache/JetBrains/IntelliJIdea2025.3/compile-server`
-   `~/.cache/JetBrains/IntelliJIdea2025.3/projects`

即使删除 `.idea` 目录，**JPS 编译服务器缓存仍可能保存旧的 Windows JDK
路径**。

------------------------------------------------------------------------

## 三、根本原因

JPS（JetBrains Project System）编译进程使用了缓存的 fallback JDK：

    org.jetbrains.jps.cmdline.BuildMain

当 fallback JDK 仍指向：

    D:/software/jdk

Linux 环境下自然无法找到该路径，从而构建失败。

------------------------------------------------------------------------

## 四、标准解决方案

### ✅ 步骤 1：关闭 IntelliJ IDEA

必须完全退出。

------------------------------------------------------------------------

### ✅ 步骤 2：删除 Compile Server 缓存

``` bash
rm -rf ~/.cache/JetBrains/IntelliJIdea2025.3/compile-server
rm -rf ~/.cache/JetBrains/IntelliJIdea2025.3/projects
```

------------------------------------------------------------------------

### ✅ 步骤 3：删除全局 JDK 配置

``` bash
rm -rf ~/.config/JetBrains/IntelliJIdea2025.3/options/jdk.table.xml
```

该文件保存所有 SDK 定义。

------------------------------------------------------------------------

### ✅ 步骤 4：重新启动 IDEA

重新添加 Linux JDK，例如：

    /usr/lib/jvm/java-11-openjdk-amd64

------------------------------------------------------------------------

## 五、最彻底解决方案（推荐）

如果是首次跨平台迁移，建议清空 IDEA 全局配置：

``` bash
rm -rf ~/.config/JetBrains/IntelliJIdea2025.3
rm -rf ~/.cache/JetBrains/IntelliJIdea2025.3
rm -rf ~/.local/share/JetBrains/IntelliJIdea2025.3
```

然后重新配置 SDK。

------------------------------------------------------------------------

## 六、最佳实践建议（避免再次发生）

### ✅ 1. 不依赖 IDEA 保存 SDK 路径

使用 Maven / Gradle Toolchain 管理 JDK。

### ✅ 2. 避免提交 .idea 到版本库

`.gitignore` 建议包含：

    .idea/
    *.iml

### ✅ 3. 统一 JDK 版本管理

可使用： - SDKMAN - asdf - jEnv

确保多平台统一。

------------------------------------------------------------------------

## 七、问题总结

  类型                说明
  ------------------- -------
  代码问题            ❌ 否
  Linux 问题          ❌ 否
  IDEA 绝对路径残留   ✅ 是
  JPS 编译缓存问题    ✅ 是

本质是：

> Windows 绝对路径被 IDEA 全局缓存带到了 Linux 环境。

清理缓存 + 重建 SDK 即可彻底解决。

# sdkman 指南

SDKMAN!（Software Development Kit Manager）是一个 Unix-like 系统上的工具，用于安装、管理和切换多种开发工具链版本，例如 Java、Groovy、Scala、Kotlin 等。

本指南介绍如何安装和使用 SDKMAN!，以及常见的配置和故障排除。

![Image](https://sdkman.io/assets/img/bubble-logo-sdkman-groovy-color.png)

## SDKMAN!

SDKMAN!（Software Development Kit Manager）是一个开源项目和社区组织，专注于为基于JVM的软件开发工具包提供版本管理。它通过命令行接口简化Java、Groovy、Kotlin、Scala等SDK及构建工具（如Maven、Gradle、SBT）的安装与切换流程，现已成为JVM生态中事实上的标准工具。([SDKMAN!][1])

### 关键事实

* **前身**：GVM（Groovy enVironment Manager）
* **主要作者**：Marco Vermeulen
* **成立时间**：约2012年
* **开源许可证**：Apache 2.0
* **财政托管**：Open Source Collective（通过Open Collective平台）([Open Collective][2])

### 起源与发展

SDKMAN! 最初由南非开发者 Marco Vermeulen 创建，用于解决在本地开发环境中频繁切换Grails版本的痛点。其设计灵感来自 RVM 与 rbenv，逐步扩展至整个JVM生态。目前该项目托管于 GitHub，由全球开发者共同维护，拥有活跃的CLI、API与社区插件生态。([GitHub][3])

### 功能与架构

SDKMAN! 采用轻量级 Bash 与 Rust 编写，仅依赖 `curl`、`zip` 与 `unzip`。其客户端通过 REST API 与后端通信，实现SDK的安装、切换和移除。平台提供“Broker API”和“Vendor API”，允许厂商自动发布新版本；用户可通过 `.sdkmanrc` 文件实现项目级SDK固定与自动加载。([SDKMAN!][4])

### 社区与资助

该项目完全开源并由社区驱动，接受企业与个人捐助。支持者包括 BellSoft、Info Support、SoftwareMill、Azul 等JVM生态厂商。其资金透明管理于Open Collective上，用于基础设施与兼容性测试等支出。([Open Collective][2])

### 当前影响

SDKMAN! 已成为Java及其他JVM语言开发者常用的环境管理工具，被视为JDK分发与版本控制的通用接口，支持在 macOS、Linux 及 Windows Subsystem for Linux 等平台运行，持续推动JVM生态的一致性与可移植性。([Medium][5])

[1]: https://sdkman.io/?utm_source=chatgpt.com "Home | SDKMAN! the Software Development Kit Manager"
[2]: https://opencollective.com/sdkman?utm_source=chatgpt.com "SDKMAN! - Open Collective"
[3]: https://github.com/sdkman?utm_source=chatgpt.com "SDKMAN! · GitHub"
[4]: https://sdkman-native.github.io/?utm_source=chatgpt.com "Home - SDKMAN! the Software Development Kit Manager"
[5]: https://asterios-raptis.medium.com/sdkman-series-from-setup-to-strategy-72c7a19ac948?utm_source=chatgpt.com "SDKMAN! Series – From Setup to Strategy | Medium"


## 1. 概述

- 官方网站：https://sdkman.io/
- 支持的命令行：`sdk`。
- 通过简单的命令即可在系统中管理多个 SDK 版本，适合开发多语言、多版本的工程场景。

## 2. 安装

### 2.1 系统依赖

SDKMAN! 只需要一个支持 `curl`、`unzip` 和 `zip` 的 shell 环境，常见发行版均已具备。

### 2.2 安装步骤

```bash
# 在 bash/zsh/fish 等 shell 中执行以下命令：
curl -s "https://get.sdkman.io" | bash

# 之后重新打开终端或执行：
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 验证安装
sdk version
```

### 2.3 升级

```bash
sdk selfupdate            # 升级 SDKMAN 本身
sdk update                # 升级候选 SDK 列表
```

## 3. 常用命令

### 3.1 列出候选

```bash
sdk list                   # 显示所有可安装的候选项及其版本
sdk list java              # 查看指定候选项的版本列表
```

### 3.2 安装和卸载

```bash
sdk install java 17.0.2-zulu   # 安装特定版本
sdk uninstall java 8.0.302-zulu # 卸载
```

### 3.3 版本切换

```bash
sdk use java 11.0.13-zulu     # 临时切换当前 shell
sdk default java 1.8.0_292    # 设置全局默认版本
sdk current                   # 显示当前激活的 SDK 版本
```

### 3.4 本地项目配置

在项目根目录创建 `.sdkmanrc` 文件，指定所需版本：

```text
java=17.0.2-zulu
maven=3.8.6
```

然后执行：

```bash
sdk env                 # 根据 .sdkmanrc 激活版本
sdk env install         # 未安装的候选一并安装
```

可以将 `sdk env` 添加到 shell 启动脚本中，实现自动切换。

### 3.5 其他辅助命令

```bash
sdk offline enable      # 离线模式
sdk offline disable     # 退出离线模式
sdk platform            # 显示当前平台信息
sdk version             # SDKMAN 版本
```

## 4. 配置

SDKMAN! 的配置文件位于 `~/.sdkman/etc/config`。

常见自定义选项：

```bash
# 自动回答提示，例如安装多个版本时
sdkman_auto_answer=true

# 下载超时时间（秒）
sdkman_download_timeout=10

# SDK 存储路径
sdkman_candidate_default=http://repo.mycompany.com/sdkman
```

> ⚠️ 修改配置后需要重新开启 shell 或 `source` 初始化脚本。

## 5. 高级使用

- 使用代理：设置 `SDKMAN_CANDIDATES_API` 环境变量指向自定义镜像。
- 集成 CI：在流水线中通过 `sdkman_install` 和 `sdk use` 来指定构建环境。
- 扩展插件：可以在 `~/.sdkman/candidates` 目录下手动添加本地 SDK。

## 6. 故障排查

- `sdk: command not found`：确认 `~/.sdkman/bin` 已加入 `PATH`。
- 下载失败：检查网络或换用镜像源；可设置 `sdkman_force=false`。
- 版本列表为空：执行 `sdk update` 刷新元数据。

以上内容覆盖了日常使用 SDKMAN! 所需的主要功能，对开发者管理本地工具集提供便利。如果需要更深入的自定义或遇到问题，可参考官方文档或社区讨论。

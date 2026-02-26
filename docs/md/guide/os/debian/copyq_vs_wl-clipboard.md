
# CopyQ vs wl-clipboard

---

## 🧠 概览比较

| 对比项      | **CopyQ**               | **wl-clipboard**      |
| -------- | ----------------------- | --------------------- |
| 平台       | Windows / macOS / Linux | Linux Wayland 环境      |
| 功能定位     | 剪贴板管理器 + CLI + GUI      | 轻量 Wayland 剪贴板 CLI 工具 |
| 图形界面     | ✅ 有（托盘/历史窗口）            | ❌ 无                   |
| 剪贴板历史    | ✅ 完整支持                  | ❌ 仅当前剪贴板              |
| CLI 功能   | 📈 强（读/写/历史/脚本）         | 📉 基础（读/写）            |
| 自动化 / 脚本 | 支持 JS + 扩展动作            | 仅命令组合                 |
| 跨平台      | 是                       | 主要是 Linux（Wayland）    |
| 最佳适用场景   | 开发者日常 & 自动化             | Wayland 轻量命令行管道       |

---

## 🧩 对比细节

---

### 🟩 1. 平台支持

**CopyQ**

* Windows ✔️
* macOS ✔️
* Linux ✔️

**wl-clipboard**

* Linux Wayland 环境 ✔️
* X11 通常用 xclip / xsel
* 不支持 Windows / macOS

👉 如果你需要跨平台（尤其 Windows）使用剪贴板 CLI，则 CopyQ 明显更通用。

---

### 🟦 2. 功能定位

**CopyQ**

* GUI 剪贴板历史窗口
* 标签 / 固定 / 搜索
* 与命令行工具无缝结合
* 内置脚本（JavaScript）
* 可运行背景服务，自动收集历史

**wl-clipboard**

* 核心是 `wl-copy` / `wl-paste`
* 用于 Wayland（不带历史）
* 用法类似 linux 的 `xclip`

---

### 🟨 3. 命令对照

#### CopyQ

```bash
copyq copy "hello world"
copyq clipboard
copyq read 0
```

#### wl-clipboard

```bash
echo "hello world" | wl-copy
wl-paste
```

---

### 🟧 4. 剪贴板历史

| 功能   | CopyQ | wl-clipboard |
| ---- | ----- | ------------ |
| 历史记录 | 🟢    | ❌            |
| 搜索   | 🟢    | ❌            |
| 固定条目 | 🟢    | ❌            |
| 图形浏览 | 🟢    | ❌            |

---

### 🟪 5. 脚本 & 自动化

**CopyQ**

* 内置 JavaScript 执行
* Batch / Shell / PowerShell 无缝拼管道
* CLI 本身支持复杂参数

**wl-clipboard**

* 只能作为管道工具
* 没有历史 / 过滤 / 扩展命令

---

## 📊 总结

### ✨ CopyQ 适合：

* **开发者剪贴板工作流强化**
* **需要剪贴板历史 & 管理**
* **跨平台剪贴板脚本**
* Windows / macOS / Linux 多环境

### 🪶 wl-clipboard 适合：

* **Wayland Linux** 轻量 CLI
* 需要基础管道读写
* 想用标准 UNIX 命令链处理剪贴板

---

## 💡 何时选哪个？

| 你想做什么                     | 推荐选择            |
| ------------------------- | --------------- |
| 需要剪贴板历史                   | 🟢 CopyQ        |
| 需要 GUI 浏览剪贴板              | 🟢 CopyQ        |
| 只需要剪贴板管道读写（Wayland）       | 🟢 wl-clipboard |
| 在 Windows 或 macOS 环境      | 🟢 CopyQ        |
| 在 Wayland Shell 脚本管道中快速读写 | 🟢 wl-clipboard |

---


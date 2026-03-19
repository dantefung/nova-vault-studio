# 轻量的md预览工具

---

# 🟢 Node（最轻量推荐）

## ✅ 1. markdown-preview-server

👉 **一条命令直接起服务**

```bash
npx markdown-preview-server
```

特点：

* 自动扫描当前目录
* 浏览器直接点 md 看
* 0 配置

👉 这是最符合你需求的

---

## ✅ 2. mdts（更好用一点的轻量版）

👉 类似一个“文件树 + 预览”

```bash
npx mdts
```

特点：

* 左侧文件树 + 右侧预览
* 自动刷新
* 零配置
  👉 Reddit 上很多人就是拿它当“本地 md 浏览器”用 ([Reddit][1])

---

## ✅ 3. docsify（轻量但稍微偏工具）

```bash
npx docsify serve .
```

特点：

* 比较轻，但有一点“文档站味道”
* 不需要 build

👉 如果你觉得上面两个太“简陋”，选这个

---

# 🟡 Python（同样轻量）

## ✅ 1. markdpy（推荐）

```bash
pip install markdpy
markdpy .
```

特点：

* 支持目录浏览（侧边栏）
* 自动刷新
* 启动即打开浏览器 ([PyPI][2])

👉 Python 里最接近 Node 那种体验的

---

## ✅ 2. tiny-markdown-server（极简）

```bash
pip install tiny-markdown-server
```

特点：

* 超小（几 KB）
* 纯“md → 网页” ([PyPI][3])

👉 但功能很少（胜在极轻）

---

## ✅ 3. mdview（单文件神器）

```bash
pip install mdview
mdview README.md
```

特点：

* 自动打开浏览器
* 文件变更自动刷新 ([Guy Rutenberg][4])

👉 只适合看单个 md

---

# 🔥 给你一个“工程人结论”

你这种（后端 + 系统设计）：

### 👉 最优解（按优先级）

1️⃣ **markdown-preview-server（最简单）**
2️⃣ **mdts（体验最好）**
3️⃣ **markdpy（Python版本）**

---

# 🚀 一句话选型

* 想要**极简** 👉 `markdown-preview-server`
* 想要**好用点 UI** 👉 `mdts`
* 想用 **Python** 👉 `markdpy`

---
---
title: "Docker 分层构建与多阶段构建原理"
date: "2026-05-21"
source: "原创整理"
url: ""
---

# Docker 分层构建与多阶段构建原理

> 为什么改了业务代码就要重装整个 node_modules？镜像为什么越来越大？Docker 的两大核心机制——层缓存和多阶段构建——解决的就是这两个问题。

---

## 核心概念辨析：分层构建 vs 多阶段构建

很多人把这两个概念混为一谈，但它们解决的问题完全不同：

| 概念 | 解决什么问题 | 机制 |
|------|-------------|------|
| **分层构建** | 提升缓存命中，减少重复安装依赖 | 每条 RUN/COPY/ADD 形成一层，输入不变则复用缓存 |
| **多阶段构建** | 减少最终镜像体积，隔离构建工具和运行环境 | 多个 `FROM` 各自独立，`COPY --from` 只拿产物 |
| **两者关系** | 多阶段构建也会产生层，但它更进一步——把不同阶段的文件系统隔离开 | — |

一句话：

> **分层构建是 Docker 的缓存机制；多阶段构建是用多个构建阶段控制最终镜像里留下什么。**

一份成熟的 Dockerfile **两者都用**：既让依赖层优先缓存（分层构建），也用 `python-deps` / `runtime` 把编译产物和运行镜像拆开（多阶段构建）。

---

## 一、层缓存：为什么改一行代码要重跑整个构建

Docker 的每条 `RUN`、`COPY`、`ADD` 指令都会生成一个镜像层。构建时按顺序判断：

1. **如果某一层的输入没变** → 复用缓存，秒过
2. **如果某一层变了** → 它和它后面的所有层全部重新执行

### 反模式：大杂烩 Dockerfile

```dockerfile
COPY requirements.txt /app/
RUN pip install -r requirements.txt

COPY . /app/           # ← 业务代码变更导致此层失效
RUN npm install         # ← 被迫重跑
```

只要任意业务代码改了，`COPY .` 层就变，后面的 `npm install` 重新跑。每次构建都在浪费时间重装不变的依赖。

### 正解：依赖与代码分离

```dockerfile
# 先 COPY 依赖声明文件（变动少）
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY package.json .
RUN npm install

# 最后 COPY 业务代码（变动频繁）
COPY . .
```

| 层级 | 内容 | 变动频率 | 缓存效果 |
|------|------|---------|---------|
| requirements.txt + pip install | Python 依赖 | 低 | 几乎不变，长期有效 |
| package.json + npm install | Node 依赖 | 低 | 几乎不变，长期有效 |
| COPY . . | 业务代码 | 高 | 每次更新，但影响最小 |

**核心原则**：把变动频率低的东西放前面，变动频率高的放最后。

---

## 二、多阶段构建：构建时需要的 ≠ 运行时需要的

### 问题场景

`mysqlclient` 编译时需要完整的编译工具链：

```
build-essential
pkg-config
default-libmysqlclient-dev
```

但服务运行时不需要编译器。如果全部塞在一个镜像里：

- 镜像体积膨胀（编译器+头文件几百 MB）
- 攻击面扩大（多一个工具多一个风险点）

### 先分清：分层缓存 ≠ 多阶段构建

很多人把"拷贝依赖文件放前面"等同于"多阶段构建"，其实它们是两个独立机制：

**只做了分层缓存（有，但不完整）：**

```dockerfile
FROM python:3.10-slim-bullseye
# ...
COPY requirements.txt /app/     # ← 依赖文件放前面
RUN pip install -r requirements.txt
COPY . /app/                     # ← 业务代码放后面
```

| 能力 | 是否具备 |
|------|---------|
| 缓存 Python 依赖（代码变不重装 pip） | ✅ 是 |
| 多阶段构建（`FROM ... AS` + `COPY --from`） | ❌ 不是 |
| 把编译工具（build-essential 等）排除出最终镜像 | ❌ 不能 |

这种 Dockerfile 做对了依赖与代码分离，但 `build-essential`、`pkg-config`、`default-libmysqlclient-dev` 这些编译 `mysqlclient` 用的工具会永远留在最终运行镜像里。

**真正的多阶段构建（拆成 base / deps / runtime 三段）：**

```dockerfile
FROM python:3.10-slim-bullseye AS base
FROM base AS python-deps       # 编译阶段——装编译器，pip install
FROM base AS runtime             # 运行阶段——只拿产物，不带编译工具
COPY --from=python-deps /install /usr/local
```

结论一句话：**分层缓存决定"重不重装"，多阶段构建决定"带不带进镜像"。两者互补，不是一回事。**

### 多阶段构建方案

```dockerfile
# ====== 阶段 1：构建期 ======
FROM python:3.10-slim AS python-deps
RUN apt-get update && apt-get install -y \
    build-essential pkg-config default-libmysqlclient-dev
RUN pip install --prefix=/install -r requirements.txt

# ====== 阶段 2：运行期 ======
FROM python:3.10-slim AS runtime
# 只复制安装结果，不带编译工具
COPY --from=python-deps /install /usr/local
COPY . /app/
CMD ["python", "app.py"]
```

| 阶段 | 职责 | 包含 | 不包含 |
|------|------|------|--------|
| python-deps | 编译安装 | 编译器、头文件、pip | 业务代码 |
| runtime | 运行服务 | Python 包、业务代码 | 编译工具 |

### 完整实践：五层分离

```dockerfile
# 1. 系统基础层
FROM python:3.10-slim AS base
RUN apt-get update && apt-get install -y curl ca-certificates

# 2. Python 依赖构建层
FROM base AS python-deps
RUN apt-get install -y build-essential pkg-config default-libmysqlclient-dev
COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

# 3. Node 依赖构建层
FROM base AS node-deps
RUN apt-get install -y nodejs npm
COPY package.json .
RUN npm install

# 4. 最终运行层
FROM base AS runtime
# 系统运行时依赖（不含编译工具）
RUN apt-get install -y wkhtmltopdf xvfb chromium
# 从构建层复制产物
COPY --from=python-deps /install /usr/local
COPY --from=node-deps /app/node_modules /app/node_modules
# 最后才复制业务代码
COPY . /app/
CMD ["python", "app.py"]
```

### `FROM base AS node-deps` 语法解释

`FROM base AS node-deps` 是 Docker 多阶段构建中的**派生语法**：

```dockerfile
# 先定义一个公共基础阶段
FROM python:3.10-slim-bullseye AS base
# 公共配置：ENV、WORKDIR 等

# 从 base 派生，专门安装 Python 依赖
FROM base AS python-deps
# 安装 Python 依赖

# 从 base 派生，专门安装 Node 依赖
FROM base AS node-deps
# 安装 Node 依赖

# 从 base 派生，最终运行镜像
FROM base AS runtime
COPY --from=python-deps /install /usr/local
COPY --from=node-deps /app/node_modules /app/node_modules
```

关键点：

1. **`FROM base AS node-deps`** = "以 `base` 阶段作为基础镜像，再开一个新阶段，名叫 `node-deps`"
2. **`COPY --from=node-deps`** = "从 `node-deps` 阶段里拿产物，不是从宿主机拿"
3. **隔离效果**：`node-deps` 里安装 Node 依赖时的中间环境（npm 缓存、devDependencies 等）**不会进入最终镜像**——最终镜像只拿它产出的 `node_modules`

这条语法的本质是：**一个 Dockerfile，多个独立的构建环境，互相之间只传递最终产物。**

### 中间阶段产物的去向

多阶段构建里的"中间产物"分两类：

**1. 被 `COPY --from` 复制到最终镜像的 → 留下**

```dockerfile
COPY --from=python-deps /install /usr/local
COPY --from=node-deps /app/node_modules /app/node_modules
```

最终镜像里会有 Python 包（`/usr/local/...`）和 Node 包（`/app/node_modules`）。

**2. 没有被复制的 → 不进入最终镜像**

`python-deps` 阶段里的这些永远不会出现在 `runtime` 镜像中：

- `build-essential`、`pkg-config`、`default-libmysqlclient-dev`
- `apt` 缓存
- 临时构建目录

**但它们不一定会立刻物理删除。** Docker/BuildKit 为了缓存复用，会把中间阶段的层保留在本机 build cache 里。

```
多阶段构建各阶段
        │
        │ COPY --from=xxx 的内容
        ▼
最终镜像：保留被复制的产物

未复制内容：
  → 不进入最终镜像
  → 但可能留在 Docker build cache
  → 等待复用或被 prune 清理
```

清理命令：

```bash
docker builder prune     # 清理构建缓存
docker system prune      # 更彻底，含悬空镜像
```

在 CI 里：如果没有持久化 BuildKit cache，中间阶段随 runner 销毁；如果配了 Docker layer cache，可能被缓存到下次构建。

---

## 三、Playwright Chromium 的安置策略

Playwright 安装 Chromium 浏览器有两种选择：

### 放构建层（镜像更小）

```dockerfile
FROM base AS python-deps
RUN playwright install chromium
# runtime 阶段需要 COPY 浏览器缓存目录
COPY --from=python-deps /root/.cache/ms-playwright /root/.cache/ms-playwright
```

优点：最终镜像不包含 `playwright` 安装过程
缺点：需要精确知道浏览器缓存路径，容易遗漏

### 放运行层（逻辑更清晰）

```dockerfile
FROM base AS runtime
RUN playwright install chromium
```

优点：逻辑简单，Docker 自动处理路径
缺点：`playwright install` 在最终层执行，镜像稍大

**推荐**：先选择"清晰稳定"方案——放运行层。等对整个流程足够熟悉后，再优化到构建层以缩小镜像。

---

## 四、多阶段构建的四大收益

| 收益 | 说明 |
|------|------|
| **CI 更快** | 依赖层不容易失效，改业务代码不影响依赖缓存 |
| **镜像更小** | 编译工具不进入最终镜像，减少 200-500MB |
| **失败更清楚** | 系统依赖、Python 依赖、Node 依赖、业务代码分层明确，构建失败快速定位 |
| **安全更好** | 运行镜像少无关工具，攻击面更小 |

---

## 五、速查：依赖分层顺序

```
频繁改动 ↓
─────────────────
  系统运行依赖    ← 几乎不变
  Python 构建依赖  ← 很少变
  Python 包        ← requirements.txt 变时才变
  Node 包          ← package.json 变时才变
  业务代码         ← 每次 commit 都变
─────────────────
```

**一句话总结**：层缓存让你不重装没变的依赖，多阶段构建让你不带编译工具进生产。两者结合，又快又小又安全。

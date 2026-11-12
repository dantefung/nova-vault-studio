---
title: "书籍库线上 404 与 Vercel 部署阻断复盘"
date: "2026-09-14"
source: "Nova Vault Studio"
url: "https://vault.moneylab.work/md/books/"
---

# 书籍库线上 404 与 Vercel 部署阻断复盘

## 事故摘要

生产站点的书籍库页面 `https://vault.moneylab.work/md/books/` 返回 404，而 Wiki、Columns 等其他内容入口正常。

排查后确认这是两个独立问题叠加造成的：

1. `.vercelignore` 排除了整个 `docs/md/books/` 目录，Vercel 构建环境中没有书籍库的 Markdown 页面，因此无法生成 `/md/books/`。
2. 修复忽略规则后，新部署仍被此前误删的文章图片阻断。VitePress 在解析 Markdown 图片引用时找不到文件，构建失败，生产域名继续指向旧部署。

第一阶段修复提交为 `1766c10b`。两套 Vercel 生产部署均完成，目标页面恢复为 HTTP 200。随后继续修复 PDF 数据源，使目录页与单本预览页不再请求 Vercel 中不存在的 PDF 资产。

## 用户可见影响

- `/md/books/` 返回 404，用户无法进入书籍库目录。
- 旧页面继续在线，但后续提交无法成功部署。
- 其他已经生成的内容路由不受影响。
- PDF 文件继续不部署到 Vercel，但线上预览改为读取 GitHub Raw 文件，用户仍可在站内使用 PDF.js 翻页、缩放和查看目录。

## 根因分析

### 直接根因：忽略规则粒度过粗

原配置为：

```gitignore
docs/md/books/
```

这条规则不仅排除了体积较大的 PDF，也排除了 `docs/md/books/index.md`、各分类 `index.md` 和手工维护的 PDF 预览页。VitePress 只能为构建环境中实际存在的 Markdown 生成 HTML，所以生产产物中没有 `md/books/index.html`。

`docs/md/books/` 下约有 104 个 PDF，总体积约 319 MB。完全放开该目录会把大文件重新送入 Vercel，不是合理修复。真正需要的是保留页面源码，只排除 PDF 二进制文件。

### 部署阻断根因：内容提交误删共享图片

提交 `81953135` 在采集一篇新文章时，误删了 `docs/md/columns/indie-hub/seo/webcafe-beginner/images/` 下多个历史文章的图片目录，并改写了根目录中的 6 张图片。

这些 Markdown 页面仍然引用原图片。Vercel 构建因此出现类似错误：

```txt
Could not resolve img_002.png
```

这解释了一个容易误判的现象：即使 `.vercelignore` 已经修好，只要新部署构建失败，生产域名仍会继续服务旧部署，线上 404 就不会消失。

### PDF 预览根因：页面与二进制资产没有解耦

书籍页面原先通过 `new URL('./book.pdf', import.meta.url)` 生成 Vite 资产地址，目录组件则通过 `import.meta.glob` 扫描构建环境中的 PDF。两者都假设 PDF 会参与 Vercel 构建，但 `.vercelignore` 又明确删除所有 PDF。

这不是 URL 编码错误，而是同一份数据被赋予了互相矛盾的部署规则：页面需要 PDF 存在，部署却保证 PDF 不存在。

## 为什么没有更早发现

### 1. 只关注了大文件，没有区分源码和资产

`docs/md/books/` 同时包含轻量 Markdown 页面和大型 PDF。按目录整体忽略虽然简单，却破坏了页面生成所需的输入数据。

### 2. 内容迁移提交包含大规模删除

新增单篇文章的提交同时删除了数百个历史资源。这个变更规模与任务目标明显不匹配，但提交前没有把删除清单作为独立风险检查。

### 3. 本地构建环境与 Vercel 输入不完全相同

本地仓库仍有 PDF，所以普通 `npm run build` 不能完全模拟 `.vercelignore` 生效后的 Vercel 文件集。本地构建成功只能证明当前工作区可构建，不能证明部署上传后的文件集完整。

### 4. 推送成功被错误地接近等同于上线成功

Git push、Vercel 接收提交、Vercel 构建完成、生产域名切换、目标页面返回 200 是五个不同阶段。前一个阶段成功不能替代后一个阶段的验证。

## 修复

### 1. 只排除 PDF

将 `.vercelignore` 改为：

```gitignore
docs/md/books/**/*.pdf
```

这样保留书籍目录和预览页的 Markdown 源码，同时继续阻止约 319 MB 的 PDF 进入 Vercel 部署包。

### 2. 从删除前的提交恢复历史图片

以 `81953135^` 为基准恢复 `webcafe-beginner/images/` 中被误删和误改的文件，共恢复 517 个图片资源文件。没有修改引用这些图片的 Markdown 内容。

### 3. 重新构建并部署

本地运行完整 VitePress 构建，确认生成：

```txt
docs/.vitepress/dist/md/books/index.html
```

随后提交并推送 `1766c10b`，等待两套 Vercel 项目完成生产部署。

### 4. 将 PDF 身份与部署地址分离

为 104 个 PDF 生成轻量静态清单，清单只保存显示名、分类和仓库相对路径。`PdfList` 不再依赖生产构建环境中实际存在 PDF，嵌套目录中的 PDF 也按书籍顶层分类展示。

`PdfViewer` 新增 `repo-path` 输入：

- 本地开发根据仓库路径解析本地 Vite 资产，保留离线预览能力。
- 生产构建将仓库路径逐段编码后解析为 GitHub Raw URL。
- 不带 `repo-path` 的既有用法保持原样，避免破坏书籍库之外的 PDF 页面。

GitHub Raw 实测支持 PDF.js 所需的跨域和分段请求：

```txt
HTTP 206
Access-Control-Allow-Origin: *
Accept-Ranges: bytes
Content-Range: bytes 0-1023/11096521
```

## 验证证据

### 本地验证

- `npm run build` 通过。
- `docs/.vitepress/dist/md/books/index.html` 成功生成。
- Markdown 图片引用检查通过。
- `git diff --check` 通过。
- PDF URL 单元测试覆盖本地地址、生产地址、中文和 `+` 字符编码。
- 静态清单覆盖 104 个唯一 PDF 路径。

### Vercel 验证

部署日志确认：

```txt
Found .vercelignore
Removed 111 ignored files defined in .vercelignore
Generated PDF pages for 15 book folder(s)
build complete in 256.44s.
```

被移除的是 PDF 文件，Markdown 页面仍参与构建。此前的图片解析错误没有再次出现。

两套部署状态最终均为 `Ready`：

- `Vercel - vault-studio`
- `Vercel - nova-vault-studio`

### 生产验证

```txt
GET https://vault.moneylab.work/md/books/
HTTP 200
<title>书籍库 | System Vault</title>
```

## 经验与防复发规则

### 1. 忽略大资产时按文件类型处理

内容目录混有源码和大文件时，禁止直接忽略整个目录。应使用 `**/*.pdf`、`**/*.zip` 等精确规则，确保构建入口仍存在。

### 2. 新增内容不应伴随无关的大规模删除

提交前必须检查：

```bash
git diff --stat
git diff --name-status
```

如果“新增一篇文章”同时删除数百个旧文件，应立即停止提交并查明原因。不要把异常删除解释成整理或自动生成行为。

### 3. 图片移动必须同时检查引用

移动或重建 `images/` 目录后，对受影响 Markdown 运行 `check-image-refs.py`。文件存在、文件名和扩展名三者必须与引用完全一致。

### 4. 部署验证必须形成闭环

生产修复至少验证以下五项：

1. 目标提交已推送到远端分支。
2. 部署平台已接收正确的 commit SHA。
3. 构建状态为成功，不只是 pending。
4. 生产域名已经绑定新部署。
5. 目标 URL 返回预期状态码和页面内容。

### 5. 本地构建成功不是生产成功

本地构建用于发现代码和内容错误，部署日志用于确认构建环境输入，生产 HTTP 检查用于确认用户真实体验。这三层验证不能互相替代。

### 6. 修复时区分主故障和阻断故障

404 的直接原因是书籍 Markdown 被排除；部署无法更新的原因是图片缺失。只修其中一个都不能恢复生产。排障记录必须明确因果链，避免把最后看到的错误误认为唯一根因。

### 7. 构建清单不能依赖生产环境已删除的数据

生产构建需要展示 PDF 清单，但 Vercel 上传阶段已经删除 PDF。因此清单必须在本地根据完整仓库生成并纳入版本控制；生产构建只消费清单，不能现场重新扫描不存在的文件。

## 后续改进

- 为关键入口增加部署后 HTTP 冒烟检查，至少覆盖 `/`、`/md/wiki/`、`/md/columns/` 和 `/md/books/`。
- 为 `.vercelignore` 增加检查，确保 `docs/md/books/index.md` 不会被排除。
- 内容采集或目录迁移提交前，重点审查删除文件数量和目录跨度。
- 当前 GitHub Raw 方案依赖仓库保持公开。若仓库转为私有，必须迁移到对象存储或服务端代理，不能把 GitHub Token 暴露给浏览器。

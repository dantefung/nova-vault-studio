---
title: "PDF 预览迁移至 Cloudflare R2 CDN 实施计划"
date: "2026-09-16"
source: "Nova Vault Studio"
url: ""
---

# PDF 预览迁移至 Cloudflare R2 CDN 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不把约 319 MB PDF 打包进 Vercel 的前提下，将生产环境 PDF 主源从 GitHub Raw 迁移到 Cloudflare R2 自定义域名，并在 R2 故障时自动回退到 GitHub Raw。

**Architecture:** Git 仓库继续作为 PDF 真源，GitHub Actions 只在 `docs/md/books/**/*.pdf` 变化时将文件增量同步到 R2。生产环境优先从 `https://books.vault.moneylab.work/` 读取与仓库路径相同的对象键，PDF.js 加载失败后仅重试一次 GitHub Raw；本地开发继续直接读取本地 PDF。R2 配置 CORS、HTTP Range 和 Cloudflare Cache，Vercel 继续排除所有 PDF。

**Tech Stack:** VitePress 1.6、Vue 3、PDF.js、Node.js `node:test`、Cloudflare R2、AWS CLI（R2 S3 兼容接口）、GitHub Actions、Vercel。

**不采用的方案:** 不把 jsDelivr 作为正式数据源。它对 GitHub 单文件默认限制 20 MB，而仓库包含 24 MB、33 MB、41 MB PDF；按文件大小分流会制造两套缓存与故障语义。jsDelivr 只可用于迁移前人工测速，不进入生产代码。

---

## 文件结构

- `docs/.vitepress/theme/utils/pdf-url.js` — 生成本地、R2 和 GitHub Raw 候选 URL，不负责网络请求。
- `docs/.vitepress/theme/utils/pdf-loader.js` — 按候选顺序加载 PDF，并在主源失败后执行一次回退。
- `docs/.vitepress/theme/utils/pdf-assets.js` — 将本地 PDF 映射与候选 URL 解析连接起来。
- `docs/.vitepress/theme/components/PdfViewer.vue` — 使用候选源加载文档，并显示当前数据源与回退状态。
- `scripts/pdf-url.test.js` — URL 编码、环境分流与候选顺序单元测试。
- `scripts/pdf-loader.test.js` — 主源成功、主源失败回退、双源失败的单元测试。
- `scripts/verify-pdf-cdn.js` — 对静态清单中的 PDF 执行 Range、CORS、Content-Type 和对象完整性检查。
- `.github/workflows/sync-pdfs-to-r2.yml` — PDF 变化时增量同步 R2，并在同步后运行 CDN 验证。
- `docs/md/sitelog/development/pdf-r2-operations.md` — R2 初始化、密钥、CORS、域名、首次同步、回滚和故障处理手册。
- `package.json` — 新增 PDF URL、加载器和 CDN 验证命令。
- `.vercelignore` — 保持 `docs/md/books/**/*.pdf`，防止 PDF 回流 Vercel 构建。

## 固定约束

1. Git 仓库中的 `docs/md/books/**/*.pdf` 是唯一真源，R2 是可重建的分发副本。
2. R2 对象键与仓库路径完全一致，例如 `docs/md/books/ai-software/Agents_Companion_v2.pdf`。
3. 生产主域名固定为 `https://books.vault.moneylab.work/`。
4. GitHub Raw 只作为浏览器运行时回退源，不作为首选源。
5. 本地开发不得依赖网络，继续使用 `import.meta.glob` 解析本地 PDF。
6. `.vercelignore` 必须继续排除 PDF；任何方案都不得重新把 319 MB 文件交给 Vercel。
7. 不自动删除 R2 中的旧对象。删除采用人工确认，避免错误提交导致远端 PDF 批量消失。
8. PDF 同名覆盖允许存在，因此缓存不使用 `immutable`；对象响应使用 `public, max-age=3600, s-maxage=86400`。

---

### Task 1: 固化多源 URL 合同

**Files:**
- Modify: `scripts/pdf-url.test.js`
- Modify: `docs/.vitepress/theme/utils/pdf-url.js`

- [ ] **Step 1: 将生产环境候选源行为写成失败测试**

将 `scripts/pdf-url.test.js` 扩展为以下合同：

```js
import test from 'node:test'
import assert from 'node:assert/strict'

import { resolvePdfUrls } from '../docs/.vitepress/theme/utils/pdf-url.js'

const repoPath =
  'docs/md/books/ai-software/Claude_Prompt_Library_分类索引+模板_2026-02-14.pdf'

test('uses only the local asset outside production', () => {
  assert.deepEqual(resolvePdfUrls(repoPath, '/assets/book.pdf', false), [
    '/assets/book.pdf'
  ])
})

test('uses R2 first and GitHub Raw second in production', () => {
  assert.deepEqual(resolvePdfUrls(repoPath, '/local.pdf', true), [
    'https://books.vault.moneylab.work/docs/md/books/ai-software/Claude_Prompt_Library_%E5%88%86%E7%B1%BB%E7%B4%A2%E5%BC%95%2B%E6%A8%A1%E6%9D%BF_2026-02-14.pdf',
    'https://raw.githubusercontent.com/dantefung/nova-vault-studio/main/docs/md/books/ai-software/Claude_Prompt_Library_%E5%88%86%E7%B1%BB%E7%B4%A2%E5%BC%95%2B%E6%A8%A1%E6%9D%BF_2026-02-14.pdf'
  ])
})

test('rejects an absent local URL during development', () => {
  assert.throws(
    () => resolvePdfUrls(repoPath, undefined, false),
    /Local PDF asset not found/
  )
})
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test scripts/pdf-url.test.js`

Expected: FAIL，提示 `resolvePdfUrls` 未导出或实际结果仍是单个 GitHub Raw URL。

- [ ] **Step 3: 用最小实现生成候选 URL**

将 `docs/.vitepress/theme/utils/pdf-url.js` 改为：

```js
const PDF_CDN_ROOT = 'https://books.vault.moneylab.work/'
const GITHUB_RAW_ROOT =
  'https://raw.githubusercontent.com/dantefung/nova-vault-studio/main/'

const encodeRepoPath = (repoPath) =>
  repoPath.split('/').map(encodeURIComponent).join('/')

const joinRepoUrl = (root, repoPath) =>
  new URL(encodeRepoPath(repoPath), root).href

export const resolvePdfUrls = (
  repoPath,
  localUrl,
  production = import.meta.env?.PROD
) => {
  if (!production) {
    if (!localUrl) throw new Error(`Local PDF asset not found: ${repoPath}`)
    return [localUrl]
  }

  return [
    joinRepoUrl(PDF_CDN_ROOT, repoPath),
    joinRepoUrl(GITHUB_RAW_ROOT, repoPath)
  ]
}
```

- [ ] **Step 4: 运行 URL 测试**

Run: `node --test scripts/pdf-url.test.js`

Expected: 3 tests passed, 0 failed。

- [ ] **Step 5: 提交 URL 合同**

```bash
git add scripts/pdf-url.test.js docs/.vitepress/theme/utils/pdf-url.js
git commit -m "test(books): define PDF CDN source order"
```

---

### Task 2: 实现一次性故障回退加载器

**Files:**
- Create: `scripts/pdf-loader.test.js`
- Create: `docs/.vitepress/theme/utils/pdf-loader.js`

- [ ] **Step 1: 为候选源加载顺序编写失败测试**

创建 `scripts/pdf-loader.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'

import { loadPdfFromCandidates } from '../docs/.vitepress/theme/utils/pdf-loader.js'

test('returns the first successful PDF without touching fallback', async () => {
  const calls = []
  const result = await loadPdfFromCandidates(['r2', 'raw'], async url => {
    calls.push(url)
    return { url }
  })

  assert.deepEqual(result, { document: { url: 'r2' }, sourceUrl: 'r2' })
  assert.deepEqual(calls, ['r2'])
})

test('falls back once when the primary source fails', async () => {
  const calls = []
  const result = await loadPdfFromCandidates(['r2', 'raw'], async url => {
    calls.push(url)
    if (url === 'r2') throw new Error('503')
    return { url }
  })

  assert.deepEqual(result, { document: { url: 'raw' }, sourceUrl: 'raw' })
  assert.deepEqual(calls, ['r2', 'raw'])
})

test('reports all attempted sources when every source fails', async () => {
  await assert.rejects(
    loadPdfFromCandidates(['r2', 'raw'], async url => {
      throw new Error(`${url} unavailable`)
    }),
    error => {
      assert.match(error.message, /Unable to load PDF from 2 sources/)
      assert.deepEqual(error.causes.map(item => item.url), ['r2', 'raw'])
      return true
    }
  )
})
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test scripts/pdf-loader.test.js`

Expected: FAIL，提示 `pdf-loader.js` 不存在。

- [ ] **Step 3: 实现无 PDF.js 依赖的加载器**

创建 `docs/.vitepress/theme/utils/pdf-loader.js`：

```js
export const loadPdfFromCandidates = async (urls, load) => {
  const causes = []

  for (const url of urls) {
    try {
      return { document: await load(url), sourceUrl: url }
    } catch (error) {
      causes.push({ url, error })
    }
  }

  const failure = new Error(`Unable to load PDF from ${urls.length} sources`)
  failure.causes = causes
  throw failure
}
```

- [ ] **Step 4: 运行加载器测试**

Run: `node --test scripts/pdf-loader.test.js`

Expected: 3 tests passed, 0 failed。

- [ ] **Step 5: 提交加载器**

```bash
git add scripts/pdf-loader.test.js docs/.vitepress/theme/utils/pdf-loader.js
git commit -m "feat(books): add PDF source fallback loader"
```

---

### Task 3: 将 PDFViewer 接入 R2 主源与 Raw 回退

**Files:**
- Modify: `docs/.vitepress/theme/utils/pdf-assets.js`
- Modify: `docs/.vitepress/theme/components/PdfViewer.vue:49-52,59-120`

- [ ] **Step 1: 将资产解析改成 URL 数组**

将 `docs/.vitepress/theme/utils/pdf-assets.js` 改为：

```js
import { resolvePdfUrls } from './pdf-url.js'

const localPdfs = import.meta.env.DEV
  ? import.meta.glob('../../../md/books/**/*.pdf', {
      eager: true,
      query: '?url',
      import: 'default'
    })
  : {}

const localUrls = Object.fromEntries(
  Object.entries(localPdfs).map(([filePath, url]) => [
    `docs/md/books/${filePath.replace('../../../md/books/', '')}`,
    url
  ])
)

export const getPdfUrls = repoPath =>
  resolvePdfUrls(repoPath, localUrls[repoPath])
```

- [ ] **Step 2: 在 PdfViewer 中记录候选源和实际源**

将相关导入与状态改为：

```js
import { computed, ref, nextTick, onMounted, watch } from 'vue'
import PdfOutline from './PdfOutline.vue'
import { getPdfUrls } from '../utils/pdf-assets.js'
import { loadPdfFromCandidates } from '../utils/pdf-loader.js'

const pdfUrls = computed(() =>
  props.repoPath ? getPdfUrls(props.repoPath) : [props.src].filter(Boolean)
)

const activePdfUrl = ref('')
const fallbackActive = ref(false)
```

- [ ] **Step 3: 使用候选加载器替换单 URL 加载**

将 `loadPdf` 中的加载部分替换为：

```js
const loadPdf = async () => {
  if (!pdfUrls.value.length) return
  error.value = null
  activePdfUrl.value = ''
  fallbackActive.value = false
  pendingScrollPosition = 'top'
  await loadPdfJs()

  try {
    const result = await loadPdfFromCandidates(pdfUrls.value, async url => {
      const loadingTask = getDocument(url)
      return loadingTask.promise
    })

    pdfDocument = result.document
    activePdfUrl.value = result.sourceUrl
    fallbackActive.value = result.sourceUrl !== pdfUrls.value[0]
    numPages.value = pdfDocument.numPages
    outline.value = await pdfDocument.getOutline()
    renderPage()
  } catch (failure) {
    error.value = failure.causes
      .map(({ url, error }) => `${url}: ${error?.message || String(error)}`)
      .join('；')
    console.error('PDF load error:', failure)
  }
}
```

- [ ] **Step 4: 新标签页链接指向实际加载源**

将工具栏链接改为：

```vue
<a
  :href="activePdfUrl || pdfUrls[0]"
  target="_blank"
  rel="noreferrer"
  title="在新标签页打开"
>↗</a>
```

在错误提示之前增加非阻断状态：

```vue
<div v-if="fallbackActive" class="pdf-source-notice" role="status">
  CDN 暂不可用，已切换到备用源。
</div>
```

- [ ] **Step 5: 更新 watch 与加载调用点**

将原有的单值监听：

```js
watch(pdfUrl, loadPdf)
```

替换为以字符串键监听候选源变化，避免对象数组导致重复加载，并确保模板和脚本中不再残留未定义的 `pdfUrl`：

```js
watch(() => pdfUrls.value.join('\n'), loadPdf)
```

- [ ] **Step 6: 运行两组单元测试**

Run: `node --test scripts/pdf-url.test.js scripts/pdf-loader.test.js`

Expected: 6 tests passed, 0 failed。

- [ ] **Step 7: 启动本地站点验证离线数据流**

Run: `npm run dev`

验证页面：`http://localhost:5173/md/books/ai-software/Agents_Companion_v2`

Expected:

- 页面显示 `1 / 76`。
- Network 中 PDF URL 来自本地 Vite 资产，不请求 R2 或 GitHub Raw。
- 翻页、缩放、目录、新标签页打开行为保持不变。

- [ ] **Step 8: 提交 Viewer 接入**

```bash
git add docs/.vitepress/theme/utils/pdf-assets.js docs/.vitepress/theme/components/PdfViewer.vue
git commit -m "feat(books): prefer R2 with GitHub PDF fallback"
```

---

### Task 4: 创建 R2 基础设施与运维合同

**Files:**
- Create: `docs/md/sitelog/development/pdf-r2-operations.md`

- [ ] **Step 1: 创建 R2 Bucket**

在 Cloudflare Dashboard 创建 Standard 存储桶：

```text
Bucket name: nova-vault-books
Location: Automatic
Storage class: Standard
```

不要启用 `r2.dev` 作为生产地址。

- [ ] **Step 2: 绑定生产自定义域名**

将以下自定义域名绑定到 `nova-vault-books`：

```text
books.vault.moneylab.work
```

开启 Cloudflare Cache，并为该主机设置 Cache Everything。缓存键保留完整路径，不忽略查询字符串。

- [ ] **Step 3: 配置 Bucket CORS**

写入以下 CORS 规则：

```json
[
  {
    "AllowedOrigins": [
      "https://vault.moneylab.work",
      "https://nova-vault-studio.vercel.app",
      "http://localhost:5173"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range"],
    "ExposeHeaders": [
      "Accept-Ranges",
      "Content-Length",
      "Content-Range",
      "Content-Type",
      "ETag"
    ],
    "MaxAgeSeconds": 86400
  }
]
```

- [ ] **Step 4: 创建最小权限 R2 API Token**

Token 权限只允许 `nova-vault-books` 的 Object Read & Write。记录以下值到 GitHub Actions Secrets，不写入仓库：

```text
CF_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

- [ ] **Step 5: 编写运维文档**

`docs/md/sitelog/development/pdf-r2-operations.md` 必须包含：

```markdown
---
title: "PDF R2 存储与 CDN 运维手册"
date: "2026-09-16"
source: "Nova Vault Studio"
url: "https://books.vault.moneylab.work/"
---

# PDF R2 存储与 CDN 运维手册

## 架构

GitHub 是真源，R2 是分发副本，GitHub Raw 是故障回退源。Vercel 不保存 PDF。

## 固定资源

- Bucket：`nova-vault-books`
- CDN 域名：`https://books.vault.moneylab.work/`
- 对象键：保持仓库相对路径，例如 `docs/md/books/ai-software/Agents_Companion_v2.pdf`

## 首次同步

使用 Task 5 的 GitHub Actions `workflow_dispatch` 执行全量同步。同步成功后运行 `npm run verify:pdf-cdn`。

## 更新

向 `main` 推送 `docs/md/books/**/*.pdf` 变更后，工作流自动增量同步。禁止手工修改 R2 中已有对象。

## 删除

自动同步不带 `--delete`。确认页面、静态清单和历史链接都不再使用对象后，再在 Dashboard 手工删除。

## 回滚

R2 故障时无需发布代码，浏览器会回退 GitHub Raw。若 CDN 返回损坏内容，先暂停自定义域名，再修复对象并清除该路径缓存。

## 验证

`npm run verify:pdf-cdn` 必须确认所有对象返回 `206`、`Content-Range`、`application/pdf` 和允许生产域名跨域访问。
```

- [ ] **Step 6: 验证文档格式**

```bash
python3 .claude/hooks/check-frontmatter.py docs/md/sitelog/development/pdf-r2-operations.md
python3 .claude/hooks/check-html-tags.py docs/md/sitelog/development/pdf-r2-operations.md
```

Expected: 两条命令均无输出并返回 0。

- [ ] **Step 7: 提交运维合同**

```bash
git add docs/md/sitelog/development/pdf-r2-operations.md
git commit -m "docs(books): add R2 PDF operations guide"
```

---

### Task 5: 自动同步 PDF 到 R2

**Files:**
- Create: `.github/workflows/sync-pdfs-to-r2.yml`

- [ ] **Step 1: 创建只响应 PDF 变化的工作流**

创建 `.github/workflows/sync-pdfs-to-r2.yml`：

```yaml
name: Sync PDFs to R2

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - 'docs/md/books/**/*.pdf'
      - '.github/workflows/sync-pdfs-to-r2.yml'

permissions:
  contents: read

concurrency:
  group: sync-pdfs-to-r2
  cancel-in-progress: false

jobs:
  sync:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
      AWS_DEFAULT_REGION: auto
      R2_ENDPOINT: https://${{ secrets.CF_ACCOUNT_ID }}.r2.cloudflarestorage.com
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install AWS CLI
        run: pipx install awscli

      - name: Sync PDF objects without deleting remote files
        run: |
          aws s3 sync docs/md/books s3://nova-vault-books/docs/md/books \
            --endpoint-url "$R2_ENDPOINT" \
            --exclude '*' \
            --include '*.pdf' \
            --content-type application/pdf \
            --cache-control 'public, max-age=3600, s-maxage=86400' \
            --no-progress

      - name: Install project dependencies
        run: npm ci

      - name: Verify CDN objects
        run: npm run verify:pdf-cdn
```

注意：故意不加 `--delete`。远端垃圾对象的成本远低于误删全部线上 PDF 的风险。

- [ ] **Step 2: 在 GitHub 仓库配置 Secrets**

在 `Settings → Secrets and variables → Actions` 创建：

```text
CF_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

- [ ] **Step 3: 检查工作流语法和危险参数**

Run:

```bash
rg -- '--delete|delete-object|rm ' .github/workflows/sync-pdfs-to-r2.yml
```

Expected: 无输出。

- [ ] **Step 4: 提交同步工作流**

```bash
git add .github/workflows/sync-pdfs-to-r2.yml
git commit -m "ci(books): sync PDF assets to Cloudflare R2"
```

---

### Task 6: 增加 CDN 完整性验证器

**Files:**
- Create: `scripts/verify-pdf-cdn.js`
- Modify: `package.json`

- [ ] **Step 1: 创建逐对象 Range 验证脚本**

创建 `scripts/verify-pdf-cdn.js`，采用受控并发（批次大小 8），兼顾执行速度与 Cloudflare 频控：

```js
import manifest from '../docs/.vitepress/theme/data/pdf-manifest.js'

const CDN_ROOT = 'https://books.vault.moneylab.work/'
const ORIGIN = 'https://vault.moneylab.work'
const CONCURRENCY = 8

const encodeRepoPath = repoPath =>
  repoPath.split('/').map(encodeURIComponent).join('/')

const failures = []

const verifyItem = async ({ repoPath }) => {
  const url = new URL(encodeRepoPath(repoPath), CDN_ROOT)
  try {
    const response = await fetch(url, {
      headers: {
        Origin: ORIGIN,
        Range: 'bytes=0-0'
      }
    })

    const contentRange = response.headers.get('content-range')
    const contentType = response.headers.get('content-type')
    const allowOrigin = response.headers.get('access-control-allow-origin')

    if (response.status !== 206) throw new Error(`expected 206, got ${response.status}`)
    if (!contentRange?.startsWith('bytes 0-0/')) throw new Error('missing Content-Range')
    if (contentType !== 'application/pdf') throw new Error(`unexpected Content-Type: ${contentType}`)
    if (allowOrigin !== ORIGIN && allowOrigin !== '*') throw new Error('CORS origin not allowed')
  } catch (error) {
    failures.push(`${repoPath}: ${error.message}`)
  }
}

for (let i = 0; i < manifest.length; i += CONCURRENCY) {
  const chunk = manifest.slice(i, i + CONCURRENCY)
  await Promise.all(chunk.map(verifyItem))
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Verified ${manifest.length} PDF objects on ${CDN_ROOT}`)
```

- [ ] **Step 2: 增加 npm 命令**

在 `package.json` 的 `scripts` 中增加：

```json
"test:pdf": "node --test scripts/pdf-url.test.js scripts/pdf-loader.test.js",
"verify:pdf-cdn": "node scripts/verify-pdf-cdn.js"
```

- [ ] **Step 3: 运行本地单元测试**

Run: `npm run test:pdf`

Expected: 6 tests passed, 0 failed。

- [ ] **Step 4: 首次同步后验证全部对象**

Run: `npm run verify:pdf-cdn`

Expected: `Verified 104 PDF objects on https://books.vault.moneylab.work/`。

若清单数量已变化，以实际 `pdf-manifest.js` 条目数为准；任何 403、404、非 206、错误 Content-Type 或缺失 CORS 都必须阻断上线。

- [ ] **Step 5: 提交验证器**

```bash
git add scripts/verify-pdf-cdn.js package.json package-lock.json
git commit -m "test(books): verify R2 PDF delivery contract"
```

---

### Task 7: 首次同步与生产前验证

**Files:**
- Verify only: `docs/.vitepress/theme/data/pdf-manifest.js`
- Verify only: `.vercelignore`

- [ ] **Step 1: 确认静态清单没有被无 PDF 的构建清空**

Run:

```bash
node -e "import('./docs/.vitepress/theme/data/pdf-manifest.js').then(({default:m}) => { if (!m.length) process.exit(1); console.log(m.length) })"
```

Expected: 输出当前 PDF 数量，初始基线为 `104`。

- [ ] **Step 2: 手工触发首次全量同步**

Run:

```bash
gh workflow run sync-pdfs-to-r2.yml --ref main
gh run watch --exit-status
```

Expected: `Sync PDFs to R2` 工作流成功，`Verify CDN objects` 步骤通过。

- [ ] **Step 3: 验证三个代表文件的 Range 响应**

验证小文件、11 MB 文件和 41 MB 文件：

```bash
curl -sS -D - -o /dev/null -r 0-1023 \
  'https://books.vault.moneylab.work/docs/md/books/zettelkasten/zettelkasten.pdf'

curl -sS -D - -o /dev/null -r 0-1023 \
  'https://books.vault.moneylab.work/docs/md/books/ai-software/Agents_Companion_v2.pdf'

curl -sS -D - -o /dev/null -r 0-1023 \
  'https://books.vault.moneylab.work/docs/md/books/spring/Spring%E6%8A%80%E6%9C%AF%E5%86%85%E5%B9%95%EF%BC%9A%E6%B7%B1%E5%85%A5%E8%A7%A3%E6%9E%90Spring%E6%9E%B6%E6%9E%84%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86%28%E7%AC%AC2%E7%89%88%29.pdf'
```

每个响应必须包含：

```text
HTTP/2 206
content-type: application/pdf
accept-ranges: bytes
content-range: bytes 0-1023/<总字节数>
```

- [ ] **Step 4: 模拟 Vercel 文件集构建**

从当前 `main` 创建临时 worktree，删除所有 PDF 后构建：

```bash
git worktree add /home/fenghaolin/.cache/tmp/opencode/nova-vault-pdf-r2-build HEAD
```

在临时 worktree 中执行：

```bash
rm -f docs/md/books/**/*.pdf
npm ci
npm run build
```

Expected: 构建成功；`docs/.vitepress/dist/md/books/index.html` 存在；生成脚本显示 `indexed 0 PDF(s)` 但已提交的清单保持非空。

- [ ] **Step 5: 清理临时 worktree**

```bash
git worktree remove /home/fenghaolin/.cache/tmp/opencode/nova-vault-pdf-r2-build
```

- [ ] **Step 6: 检查 Vercel 排除规则**

Run: `rg '^docs/md/books/\*\*/\*\.pdf$' .vercelignore`

Expected: 精确匹配一行 `docs/md/books/**/*.pdf`。

---

### Task 8: 浏览器验收、故障演练与上线

**Files:**
- Modify: `docs/md/sitelog/dev-log/issues/books-route-404.md`

- [ ] **Step 1: 正常链路验收**

启动本地生产预览或部署 Preview 后，用 Playwright 打开：

```text
/md/books/ai-software/Agents_Companion_v2
/md/books/spring/Spring技术内幕：深入解析Spring架构与设计原理(第2版)
```

Expected:

- 两页均成功显示第一页。
- 11 MB 和 41 MB PDF 均发起 `206` Range 请求。
- 请求主机为 `books.vault.moneylab.work`。
- 翻页、缩放、目录、全屏和新标签页打开正常。
- 浏览器控制台没有 CORS、PDF 加载或未处理 Promise 错误。

- [ ] **Step 2: 回退链路验收**

在 Playwright 中拦截 `https://books.vault.moneylab.work/**` 并返回 503，然后重新加载单本页面。

Expected:

- 页面显示“CDN 暂不可用，已切换到备用源”。
- 随后请求 `raw.githubusercontent.com`。
- PDF 第一页仍正常渲染。
- 每个候选源只请求一次，不出现无限重试。

- [ ] **Step 3: 双源失败验收**

同时拦截 R2 与 GitHub Raw 并返回 503。

Expected:

- 页面显示明确错误。
- 错误包含两个失败 URL。
- 页面其他导航仍可操作，不出现白屏。

- [ ] **Step 4: 补充事故复盘的后续改进结果**

在 `docs/md/sitelog/dev-log/issues/books-route-404.md` 的“后续改进”末尾增加：

```markdown
### PDF 分发加速

生产环境 PDF 主源已迁移到 Cloudflare R2 自定义域名，GitHub Raw 降级为故障回退源。R2 与仓库保持相同对象键，通过 GitHub Actions 增量同步；Vercel 继续排除 PDF。上线验收覆盖 41 MB 大文件、中文路径、HTTP Range、CORS 和主源 503 回退。
```

- [ ] **Step 5: 运行最终检查**

```bash
npm run test:pdf
npm run verify:pdf-cdn
python3 .claude/hooks/check-frontmatter.py docs/md/sitelog/dev-log/issues/books-route-404.md
python3 .claude/hooks/check-html-tags.py docs/md/sitelog/dev-log/issues/books-route-404.md
git diff --check
```

Expected: 全部返回 0。

- [ ] **Step 6: 提交验收记录**

```bash
git add docs/md/sitelog/dev-log/issues/books-route-404.md
git commit -m "docs(books): record R2 PDF migration verification"
```

- [ ] **Step 7: 推送并等待 Vercel 生产部署**

```bash
git push origin main
vercel list --format json --non-interactive
vercel inspect <本次提交对应的部署 URL> --wait --timeout 10m
```

Expected:

- Vercel 部署 commit SHA 与本次 `main` HEAD 一致。
- 状态为 `READY`。
- 正式域名 `https://nova-vault-studio.vercel.app` 指向新部署。

- [ ] **Step 8: 清理测试资源**

关闭 Playwright/Chrome 测试页，停止本项目 VitePress 进程，并删除测试截图。不要停止其他项目的 Vite 或 Uvicorn 进程。

---

## 上线门槛

以下条件必须全部满足，才允许把 R2 主源代码推到生产：

1. `npm run test:pdf` 全部通过。
2. 静态清单非空，且条目数与仓库 PDF 数量一致。
3. `npm run verify:pdf-cdn` 验证所有清单对象，而不是抽样验证。
4. 41 MB 最大级别 PDF 返回 `206`，不能退化成整文件 `200`。
5. R2 503 时 GitHub Raw 回退成功；双源失败时显示可理解错误。
6. 模拟删除全部 PDF 的 Vercel 文件集仍能完成 `npm run build`。
7. `.vercelignore` 继续排除 `docs/md/books/**/*.pdf`。
8. Vercel 最新生产部署状态为 `READY`，且 commit SHA 与 `main` 一致。

## 回滚策略

如果 R2 上线后出现区域性错误、Range 异常或缓存损坏：

1. 浏览器会自动回退 GitHub Raw，用户仍可阅读。
2. 若回退逻辑本身有问题，只回滚 `PdfViewer.vue`、`pdf-assets.js`、`pdf-loader.js` 和 `pdf-url.js` 到单一 GitHub Raw 实现。
3. 不删除 R2 Bucket，不修改 Git 仓库中的 PDF，不解除 `.vercelignore`。
4. 修复 R2 对象或 CORS 后运行 `npm run verify:pdf-cdn`，全部通过再重新启用主源。

## 后续优化，不纳入本次范围

- 使用 `qpdf --linearize` 批量线性化 PDF，进一步降低第一页显示时间。
- 对 PDF 首屏、回退次数和 R2 命中率增加可观测性。
- 将稳定对象改为内容哈希路径并使用一年 `immutable` 缓存。
- 为 R2 同步增加受控的孤立对象清理报告，但不自动删除。

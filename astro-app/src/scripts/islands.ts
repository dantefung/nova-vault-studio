/**
 * 自定义元素客户端实现
 *
 * Markdown 管线把 VitePress 的 Vue 组件转成了自定义元素：
 *   <pdf-viewer data-src="...">       —— PDF 预览
 *   <html-viewer data-src="...">      —— HTML 演示稿 iframe
 *   <pdf-list data-dir="...">         —— 书籍 PDF 目录
 *
 * 这里用原生 Custom Elements 实现，不引入框架运行时。
 */

/* ── PDF 预览 ─────────────────────────────────────────────── */

/**
 * PDF 的可访问地址。
 *
 * 三种来源：
 *   1. `repo-path="docs/md/books/x.pdf"` —— VitePress 时期的写法。
 *      生产环境指向 GitHub Raw（仓库里的 PDF 有 360MB，直接进 CDN 不现实），
 *      开发环境用本地相对路径。
 *   2. `src="./x.pdf"` —— 相对当前文档的路径，解析成站点绝对路径。
 *   3. `src="/md/..."` —— 已是站点绝对路径，原样使用。
 */
function pdfSrc(el: HTMLElement): string {
  const src = el.getAttribute('data-src') || ''
  const repoPath = el.getAttribute('data-repo-path')

  if (repoPath && import.meta.env.PROD) {
    const encoded = repoPath
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/')
    return `https://raw.githubusercontent.com/dantefung/nova-vault-studio/main/${encoded}`
  }

  if (repoPath) {
    // 开发环境：仓库路径 -> 站点路径
    return '/' + repoPath.replace(/^docs\//, '').split('/').map(encodeURIComponent).join('/')
  }

  if (!src) return ''

  // 相对路径：相对当前页面 URL 解析
  if (src.startsWith('./') || src.startsWith('../')) {
    const base = window.location.pathname
    const url = new URL(src, new URL(base, window.location.origin))
    return url.pathname + url.search
  }

  return src
}

/**
 * PDF 渲染器（pdf.js → canvas）。
 *
 * 为什么不用 iframe 指向 PDF：
 *   GitHub Raw 响应头带 `x-frame-options: deny`，浏览器直接拒绝嵌 iframe；
 *   而且它把 PDF 返成 `application/octet-stream`，即便能嵌也会触发下载。
 *   pdf.js 自己 fetch 字节再画到 canvas —— Raw 允许跨域（ACAO: *），
 *   所以这条路对任意大小、任意路径的 PDF 都成立。
 *
 * 这也正是 VitePress 时期 PdfViewer.vue 的做法，移植时降级成 iframe 才坏的。
 */
interface PdfDoc {
  numPages: number
  getPage(n: number): Promise<{
    getViewport(o: { scale: number }): { width: number; height: number }
    render(o: { canvas: HTMLCanvasElement; viewport: unknown }): { promise: Promise<void>; cancel(): void }
  }>
}

// public/pdf.worker.min.mjs 是 pdfjs-dist/legacy/build/pdf.worker.min.mjs 的副本，
// 由 package.json 的 prebuild 脚本同步。同源绝对路径，pdf.js v6 会直接
// new Worker(src, { type: "module" }) 执行它。
const workerUrl = '/pdf.worker.min.mjs'

let pdfjsPromise: Promise<typeof import('pdfjs-dist/legacy/build/pdf.mjs')> | null = null

function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs').then((pdfjs) => {
      // worker 必须是真正可执行的 module 脚本：同源绝对路径，见上方说明
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
      return pdfjs
    })
  }
  return pdfjsPromise
}

/** 挂一个 PDF 播放器到容器里，返回 { destroy } 以便换文档时清理 */
async function mountPdfViewer(
  container: HTMLElement,
  src: string,
  title: string
): Promise<{ destroy: () => void }> {
  container.textContent = ''
  const bar = document.createElement('div')
  bar.className = 'pdf-viewer-bar'

  const mk = (label: string, cls = '') => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = `pdf-viewer-btn ${cls}`.trim()
    b.textContent = label
    bar.appendChild(b)
    return b
  }
  const prev = mk('‹', 'pdf-viewer-prev')
  const indicator = document.createElement('span')
  indicator.className = 'pdf-viewer-indicator'
  const next = mk('›', 'pdf-viewer-next')
  const zoomOut = mk('−', 'pdf-viewer-zoom')
  const zoomLabel = document.createElement('span')
  zoomLabel.className = 'pdf-viewer-zoom-label'
  const zoomIn = mk('+', 'pdf-viewer-zoom')
  const open = document.createElement('a')
  open.href = src
  open.target = '_blank'
  open.rel = 'noreferrer'
  open.className = 'pdf-viewer-open'
  open.textContent = '新标签页打开 ↗'
  bar.append(prev, indicator, next, zoomOut, zoomLabel, zoomIn, open)

  const wrap = document.createElement('div')
  wrap.className = 'pdf-canvas-wrap'
  const canvas = document.createElement('canvas')
  canvas.className = 'pdf-canvas'
  wrap.appendChild(canvas)

  const status = document.createElement('p')
  status.className = 'pdf-viewer-status'
  status.textContent = '正在加载 PDF…'

  container.append(bar, wrap, status)

  let doc: PdfDoc | null = null
  let page = 1
  let scale = 1.25
  let renderTask: { cancel(): void } | null = null

  const render = async () => {
    if (!doc) return
    renderTask?.cancel()
    const pdfPage = await doc.getPage(page)
    const viewport = pdfPage.getViewport({ scale })
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(viewport.width * dpr)
    canvas.height = Math.floor(viewport.height * dpr)
    canvas.style.width = `${Math.floor(viewport.width)}px`
    canvas.style.height = `${Math.floor(viewport.height)}px`
    // pdf.js v6 用 canvas 参数（canvasContext 只是兼容旧版），它自己会按
    // canvas.width/height 与 CSS 尺寸处理 DPR
    renderTask = pdfPage.render({ canvas, viewport })
    try {
      await renderTask.promise
      status.textContent = ''
      wrap.scrollTop = 0
    } catch {
      /* 翻页时取消上一次渲染，忽略 */
    }
    indicator.textContent = `${page} / ${doc.numPages}`
    zoomLabel.textContent = `${Math.round(scale * 100)}%`
  }

  try {
    const pdfjs = await loadPdfjs()
    const task = pdfjs.getDocument({ url: src, withCredentials: false })
    doc = (await task.promise) as unknown as PdfDoc
    title = title || ''
    await render()
  } catch (err) {
    status.innerHTML = `<strong>PDF 加载失败：</strong>${String(err).slice(0, 160)}`
    status.classList.add('is-error')
  }

  const go = (n: number) => {
    if (!doc) return
    page = Math.min(Math.max(1, n), doc.numPages)
    void render()
  }
  prev.addEventListener('click', () => go(page - 1))
  next.addEventListener('click', () => go(page + 1))
  zoomOut.addEventListener('click', () => {
    scale = Math.max(0.5, scale - 0.25)
    void render()
  })
  zoomIn.addEventListener('click', () => {
    scale = Math.min(3, scale + 0.25)
    void render()
  })

  return { destroy: () => renderTask?.cancel() }
}

class PdfViewer extends HTMLElement {
  connectedCallback() {
    if (this.dataset.vpReady) return
    this.dataset.vpReady = '1'

    const src = pdfSrc(this)
    const title = this.getAttribute('data-title') || 'PDF 预览'
    this.classList.add('pdf-viewer-root')
    void mountPdfViewer(this, src, title)
  }
}

/* ── HTML 演示稿 ─────────────────────────────────────────── */

class HtmlViewer extends HTMLElement {
  connectedCallback() {
    if (this.dataset.vpReady) return
    this.dataset.vpReady = '1'

    const src = this.getAttribute('data-src') || ''
    const title = this.getAttribute('data-title') || '演示文稿'

    const frame = document.createElement('iframe')
    frame.src = src
    frame.title = title
    frame.loading = 'lazy'
    frame.setAttribute('allowfullscreen', '')
    frame.setAttribute('allow', 'clipboard-write; fullscreen')

    const bar = document.createElement('div')
    bar.className = 'pdf-viewer-bar'
    const link = document.createElement('a')
    link.href = src
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.textContent = '全屏打开 ↗'
    bar.appendChild(link)

    this.append(bar, frame)
  }
}

/* ── PDF 书籍目录 ─────────────────────────────────────────── */

interface PdfEntry {
  name: string
  category: string
  repoPath: string
}

class PdfList extends HTMLElement {
  connectedCallback() {
    if (this.dataset.vpReady) return
    this.dataset.vpReady = '1'

    const dir = this.getAttribute('data-dir') || ''
    this.classList.add('pdf-list-root')

    fetch('/pdf-manifest.json')
      .then((r) => r.json())
      .then((all: PdfEntry[]) => {
        const groups = new Map<string, PdfEntry[]>()
        for (const item of all) {
          const list = groups.get(item.category) ?? []
          list.push(item)
          groups.set(item.category, list)
        }

        const sidebar = document.createElement('div')
        sidebar.className = 'pdf-list-sidebar'

        const heading = document.createElement('h3')
        heading.textContent = dir ? `${dir.replace(/[-_]/g, ' ')} 目录` : 'PDF 书籍'
        sidebar.appendChild(heading)

        const list = document.createElement('ul')
        list.className = 'pdf-list-tree'
        sidebar.appendChild(list)

        const cats = dir
          ? [dir]
          : Array.from(groups.keys()).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

        let current: { destroy: () => void } | null = null
        for (const cat of cats) {
          const entries = (groups.get(cat) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
          for (const entry of entries) {
            const li = document.createElement('li')
            const btn = document.createElement('button')
            btn.type = 'button'
            btn.textContent = entry.name
            btn.addEventListener('click', () => {
              list.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'))
              btn.classList.add('is-active')
              const url = import.meta.env.PROD
                ? `https://raw.githubusercontent.com/dantefung/nova-vault-studio/main/${entry.repoPath
                    .split('/')
                    .map((s) => encodeURIComponent(s))
                    .join('/')}`
                : `/${entry.repoPath.replace(/^docs\//, '')}`
              current?.destroy()
              viewer.textContent = ''
              const title = document.createElement('h3')
              title.textContent = entry.name
              const holder = document.createElement('div')
              holder.className = 'pdf-list-holder'
              viewer.append(title, holder)
              current = null
              void mountPdfViewer(holder, url, entry.name).then((c) => {
                current = c
              })
            })
            li.appendChild(btn)
            list.appendChild(li)
          }
        }

        const viewer = document.createElement('div')
        viewer.className = 'pdf-list-viewer'
        const empty = document.createElement('p')
        empty.className = 'pdf-list-empty'
        empty.textContent = '请从左侧选择一个 PDF 进行预览。'
        viewer.appendChild(empty)

        this.append(sidebar, viewer)
      })
      .catch(() => {
        this.textContent = 'PDF 清单加载失败。'
      })
  }
}

if (!customElements.get('pdf-viewer')) customElements.define('pdf-viewer', PdfViewer)
if (!customElements.get('html-viewer')) customElements.define('html-viewer', HtmlViewer)
if (!customElements.get('pdf-list')) customElements.define('pdf-list', PdfList)

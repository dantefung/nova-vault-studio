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

class PdfViewer extends HTMLElement {
  connectedCallback() {
    if (this.dataset.vpReady) return
    this.dataset.vpReady = '1'

    const src = pdfSrc(this)
    const frame = document.createElement('iframe')
    frame.src = src
    frame.title = this.getAttribute('data-title') || 'PDF 预览'
    frame.loading = 'lazy'
    frame.setAttribute('allowfullscreen', '')

    const bar = document.createElement('div')
    bar.className = 'pdf-viewer-bar'
    const link = document.createElement('a')
    link.href = src
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.textContent = '在新标签页打开 ↗'
    bar.appendChild(link)

    this.append(bar, frame)
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

        const cats = dir
          ? [dir]
          : Array.from(groups.keys()).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

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
              viewer.innerHTML = ''
              const title = document.createElement('h3')
              title.textContent = entry.name
              const frame = document.createElement('iframe')
              frame.src = url
              frame.title = entry.name
              frame.loading = 'lazy'
              viewer.append(title, frame)
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

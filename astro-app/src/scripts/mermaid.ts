/**
 * mermaid 渲染
 *
 * VitePress 时期用 vitepress-plugin-mermaid + vitepress-mermaid-renderer，
 * 在客户端把 ```mermaid 代码块渲染成 SVG。这里用 mermaid 官方包的
 * initialize/run 走一遍，产物结构一致（<div class="mermaid"> 内联 SVG）。
 *
 * 只在页面里存在 .mermaid 节点时才动态 import mermaid，
 * 避免把 1MB+ 的依赖打进所有页面的首屏。
 */

let mermaidPromise: Promise<any> | null = null
let initialized = false

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => m.default)
  }
  return mermaidPromise
}

function currentTheme(): 'dark' | 'default' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default'
}

async function renderMermaid() {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.vp-doc-content .mermaid'))
  if (!nodes.length) return

  const mermaid = await loadMermaid()

  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme(),
      securityLevel: 'loose',
    })
    initialized = true
  }

  for (const node of nodes) {
    if (node.dataset.vpRendered) continue
    const source = node.textContent ?? ''
    if (!source.trim()) continue
    try {
      const { svg } = await mermaid.render(`vp-mmd-${Math.random().toString(36).slice(2, 9)}`, source)
      node.innerHTML = svg
      node.dataset.vpRendered = '1'
    } catch (err) {
      // 渲染失败时保留源码，不让整页报错
      node.classList.add('mermaid-error')
      console.error('[mermaid] 渲染失败', err)
    }
  }
}

export function initMermaid() {
  if (typeof window === 'undefined') return
  renderMermaid()

  // 主题切换后重渲染，让图表跟随配色
  document.addEventListener('vp:theme-change', async () => {
    const mermaid = await loadMermaid()
    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme(),
      securityLevel: 'loose',
    })
    document.querySelectorAll<HTMLElement>('.vp-doc-content .mermaid').forEach((n) => {
      delete n.dataset.vpRendered
    })
    setTimeout(renderMermaid, 60)
  })
}

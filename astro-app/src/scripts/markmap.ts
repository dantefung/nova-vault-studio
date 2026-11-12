/**
 * markmap 渲染
 *
 * VitePress 时期的 markdown-it-markmap 插件把 ```markmap 代码块转成
 * <div class="markmap-container"><svg class="markmap-svg" data-code="...">，
 * 再由 theme/markmap.js 在客户端用 markmap-lib + markmap-view 渲染。
 * 这里的产物结构与之一致，客户端逻辑直接复用同样的思路。
 */

let scheduled = false

async function renderMarkmapsNow() {
  const nodes = Array.from(document.querySelectorAll<SVGElement>('svg.markmap-svg'))
  if (!nodes.length) return

  const [{ Transformer }, { Markmap }] = await Promise.all([
    import('markmap-lib'),
    import('markmap-view'),
  ])

  const transformer = new Transformer()

  for (const el of nodes) {
    if ((el as any).__markmap_inited__) continue
    const code = el.getAttribute('data-code') || ''
    const markdown = decodeURIComponent(code)
    try {
      const { root } = transformer.transform(markdown)
      Markmap.create(el as any, undefined as any, root)
      ;(el as any).__markmap_inited__ = true
    } catch (err) {
      console.error('[markmap] 渲染失败', err)
    }
  }
}

function scheduleRender() {
  if (typeof window === 'undefined') return
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(async () => {
    try {
      await renderMarkmapsNow()
    } finally {
      scheduled = false
    }
  })
}

export function initMarkmap() {
  if (typeof window === 'undefined') return
  scheduleRender()
}

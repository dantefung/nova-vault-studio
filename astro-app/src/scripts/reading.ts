/**
 * 阅读体验增强：顶部进度条 + 右侧大纲滚动高亮
 * 兼容 Astro View Transitions：在 astro:page-load 时重新绑定（每次页面切换都会触发）。
 */

function updateProgress() {
  const fill = document.getElementById('vp-progress-fill') as HTMLElement | null
  if (!fill) return
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  const pct = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0
  fill.style.width = pct + '%'
}

function setupScrollSpy() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.vp-outline-item a'))
  if (!links.length) return

  const sections = links
    .map((a) => document.getElementById(decodeURIComponent((a.getAttribute('href') || '').slice(1))))
    .filter((el): el is HTMLElement => !!el)

  if (!sections.length) return

  const activate = () => {
    const marker = window.scrollY + 100
    let current = 0
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= marker) current = i
    })
    links.forEach((a, i) => a.classList.toggle('is-active', i === current))
  }

  window.addEventListener('scroll', activate, { passive: true })
  activate()
}

function init() {
  updateProgress()
  setupScrollSpy()
}

// 首次加载 + View Transition 每次换页后都执行
init()
document.addEventListener('astro:page-load', init)
window.addEventListener('scroll', updateProgress, { passive: true })

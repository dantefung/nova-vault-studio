/**
 * scripts/validate-mobile-nav.mjs
 *
 * 端到端验证顶部导航（搜索框 / 菜单 / 主题切换 / Landing 主题切换）在
 * 桌面 / 平板 / 手机 三个视口下的适配。chromium headless + CDP。
 *
 * 用法：
 *   1. 启动 preview/dev：npm run preview -- --port 5421 --host 127.0.0.1
 *   2. 跑验证：PREVIEW_PORT=5421 node scripts/validate-mobile-nav.mjs
 *
 * 退出码：0 = 全过，1 = 有失败
 */

import { spawn } from 'child_process'
import { setTimeout as wait } from 'timers/promises'

const PORT = process.env.PREVIEW_PORT || '5421'
const HOST = process.env.PREVIEW_HOST || '127.0.0.1'
const CDP_PORT = 9461

const TMPDIR = `/tmp/mobileNav_${Date.now()}`
const chrome = spawn('/usr/bin/google-chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--no-default-browser-check', `--remote-debugging-port=${CDP_PORT}`,
  `--user-data-dir=${TMPDIR}/ud`,
], { stdio: ['ignore', 'pipe', 'pipe'] })
await wait(3000)

const tabs = await fetch(`http://${HOST}:${CDP_PORT}/json`).then(r => r.json())
const tab = tabs.find(t => t.type === 'page') || tabs[0]
const ws = new WebSocket(tab.webSocketDebuggerUrl)
let id = 0; const pending = new Map()
ws.addEventListener('message', e => {
  try {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
  } catch {}
})
function send(method, params = {}) {
  return new Promise(resolve => {
    const mid = ++id
    pending.set(mid, resolve)
    ws.send(JSON.stringify({ id: mid, method, params }))
  })
}
await new Promise(r => ws.addEventListener('open', r, { once: true }))
await send('Page.enable')

async function setViewport(w, h, mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile })
  await wait(500)
}

const probeExpr = `JSON.stringify({
  hasNav: !!document.querySelector('.VPNavBar, .landing-nav, .easton-clone-header'),
  navRect: (() => {
    const el = document.querySelector('.VPNavBar, .landing-nav, .easton-clone-header');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right) };
  })(),
  themeBtnRect: (() => {
    const el = document.querySelector('.theme-switcher-btn, .landing-theme-switcher-button');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), text: el.textContent?.trim().slice(0, 30) };
  })(),
  themeLabelDisplay: (() => {
    const el = document.querySelector(
      '.theme-switcher-btn .theme-arrow, .landing-theme-switcher-button .landing-theme-switcher-label'
    );
    return el ? getComputedStyle(el).display : 'N/A';
  })(),
  navElOverflow: (() => {
    const nav = document.querySelector('.VPNav, .easton-clone-nav, .landing-nav-links');
    return nav ? {
      clientW: nav.clientWidth,
      scrollW: nav.scrollWidth,
      overflow: nav.scrollWidth > nav.clientWidth
    } : null;
  })(),
  viewport: { w: window.innerWidth, h: window.innerHeight },
  bodyScroll: document.body.scrollWidth,
})`

const results = []

async function testPage(label, url, width, height, mobile) {
  await setViewport(width, height, mobile)
  // 等待 load 事件 + 额外等待 SPA hydration
  const loadDone = new Promise(resolve => {
    const handler = e => { try { const m = JSON.parse(e.data); if (m.method === 'Page.loadEventFired') { ws.removeEventListener('message', handler); resolve() } } catch {} }
    ws.addEventListener('message', handler)
    setTimeout(resolve, 15000) // 兜底超时
  })
  await send('Page.navigate', { url })
  await loadDone
  await wait(6000) // 等 SPA hydration（dev 模式慢）
  const r = await send('Runtime.evaluate', { expression: probeExpr, returnByValue: true })
  const raw = r.result?.result?.value
  const data = raw ? JSON.parse(raw) : {}
  results.push({ label, url, viewport: { w: width, h: height, mobile }, data })
  console.log(`[${label}] ${raw ?? '(empty)'}`)
}

// ---- 测试套件 ----
console.log('\n=== 顶部导航移动端验证 ===\n')

// 360 移动端
await testPage('360/doc', `http://${HOST}:${PORT}/md/guide/getting-started`, 360, 640, true)
await testPage('360/blog', `http://${HOST}:${PORT}/md/blog/`, 360, 640, true)
await testPage('360/home', `http://${HOST}:${PORT}/`, 360, 640, true)

// 768 平板
await testPage('768/doc', `http://${HOST}:${PORT}/md/guide/getting-started`, 768, 1024, false)
await testPage('768/blog', `http://${HOST}:${PORT}/md/blog/`, 768, 1024, false)

// 1280 桌面
await testPage('1280/doc', `http://${HOST}:${PORT}/md/guide/getting-started`, 1280, 800, false)

ws.close(); chrome.kill()

// ---- 断言 ----
console.log('\n=== 断言 ===\n')
let allPass = true

for (const r of results) {
  const { label, viewport, data } = r
  const isMobile = viewport.mobile
  const checks = []

  // 1. nav 必须存在
  checks.push({ name: 'nav 存在', pass: data.hasNav === true })

  // 2. nav 不溢出视口
  const navNoOverflow = data.navRect && data.navRect.right <= viewport.w + 1
  checks.push({ name: 'nav 不溢出视口', pass: navNoOverflow, detail: data.navRect })

  // 3. 移动端 body 无横向滚动（桌面端 VPNavBarMenu 水平菜单可能超过 viewport 但有 hamburger 兜底）
  if (isMobile) {
    checks.push({ name: '移动端 body 无横向滚动', pass: data.bodyScroll === viewport.w, detail: `bodyScroll=${data.bodyScroll} viewport=${viewport.w}` })
  }

  // 4. 切换器按钮存在
  checks.push({ name: '切换器按钮存在', pass: data.themeBtnRect !== null })

  // 5. 移动端触摸目标 ≥44
  if (isMobile && data.themeBtnRect) {
    const touchOk = data.themeBtnRect.w >= 44 && data.themeBtnRect.h >= 44
    checks.push({ name: '触摸目标 ≥44', pass: touchOk, detail: data.themeBtnRect })
  }

  // 6. 移动端 label/arrow 隐藏
  if (isMobile && data.themeLabelDisplay !== 'N/A') {
    checks.push({ name: '移动端隐藏标签/箭头', pass: data.themeLabelDisplay === 'none', detail: data.themeLabelDisplay })
  }

  // 7. 桌面端 label 显示（只在 ≥769px 显示，因为 VitePress 在 768 是移动/桌面切换点）
  if (!isMobile && viewport.w >= 769 && data.themeLabelDisplay !== 'N/A') {
    checks.push({ name: '桌面端 label 显示', pass: data.themeLabelDisplay !== 'none', detail: data.themeLabelDisplay })
  }

  const failed = checks.filter(c => !c.pass)
  const status = failed.length === 0 ? '✅ PASS' : '❌ FAIL'
  console.log(`${status} [${label}]`)
  for (const c of checks) {
    const icon = c.pass ? '✓' : '✗'
    const detail = c.detail ? ` (${JSON.stringify(c.detail)})` : ''
    console.log(`  ${icon} ${c.name}${detail}`)
    if (!c.pass) allPass = false
  }
  console.log('')
}

console.log(allPass ? '✅ 全部通过' : '❌ 有失败')
process.exit(allPass ? 0 : 1)

#!/usr/bin/env node
// scripts/cdp-validate.mjs
// 用 CDP（Chrome DevTools Protocol）真实地加载带 cookie 的页面
// 验证 next-app 是否修复了 VitePress 1.6.4 的 easton-clone 首页白屏 bug
import { spawn } from 'node:child_process'
import http from 'node:http'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const WebSocket = require('ws')

const TARGET = process.argv[2] || 'http://127.0.0.1:3000/'
const COOKIE_NAME = process.argv[3] || ''
const COOKIE_VALUE = process.argv[4] || ''
const LABEL = process.argv[5] || 'default'
const PORT = 9223

const child = spawn('google-chrome', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--remote-debugging-port=' + PORT,
  '--user-data-dir=/tmp/cdp-' + Date.now(),
  'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] })

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      await new Promise((r, e) => http.get(`http://127.0.0.1:${PORT}/json/version`, (res) => {
        res.resume()
        res.on('end', r)
      }).on('error', e))
      return
    } catch {}
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('Chrome not ready')
}

await waitForChrome()

const list = await new Promise((r) =>
  http.get(`http://127.0.0.1:${PORT}/json`, (res) => {
    let body = ''
    res.on('data', (c) => (body += c))
    res.on('end', () => r(JSON.parse(body)))
  })
)

const page = list.find((t) => t.type === 'page') || list[0]
const ws = new WebSocket(page.webSocketDebuggerUrl)

let id = 0
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const myId = ++id
    const onMsg = (data) => {
      try {
        const msg = JSON.parse(data.toString())
        if (msg.id === myId) {
          ws.off('message', onMsg)
          if (msg.error) reject(new Error(JSON.stringify(msg.error)))
          else resolve(msg.result)
        }
      } catch {}
    }
    ws.on('message', onMsg)
    ws.send(JSON.stringify({ id: myId, method, params }))
  })
}

await new Promise((r) => ws.once('open', r))
await send('Network.enable')
if (COOKIE_NAME && COOKIE_VALUE) {
  await send('Network.setCookie', {
    name: COOKIE_NAME,
    value: COOKIE_VALUE,
    domain: '127.0.0.1',
    path: '/',
  })
}
await send('Page.enable')
const navP = new Promise((r) => {
  const onMsg = (data) => {
    const msg = JSON.parse(data.toString())
    if (msg.method === 'Page.loadEventFired') {
      ws.off('message', onMsg)
      r()
    }
  }
  ws.on('message', onMsg)
})
await send('Page.navigate', { url: TARGET })
await navP

// 等一下让客户端 hydration 跑完
await new Promise((r) => setTimeout(r, 800))

const { result } = await send('Runtime.evaluate', {
  expression: `(() => {
    const html = document.documentElement.outerHTML;
    const theme = document.documentElement.getAttribute('data-theme');
    const hasHero = !!document.querySelector('.easton-clone-hero');
    const hasFeatured = !!document.querySelector('.easton-clone-featured-card');
    const hasLatest = !!document.querySelector('.easton-clone-latest-list');
    const hasSeries = !!document.querySelector('.easton-clone-series-grid');
    const hasCategory = !!document.querySelector('.easton-clone-category-grid');
    const featuredCount = document.querySelectorAll('.easton-clone-featured-card').length;
    const latestCount = document.querySelectorAll('.easton-clone-latest-list a').length;
    const seriesCount = document.querySelectorAll('.easton-clone-series-card').length;
    const categoryCount = document.querySelectorAll('.easton-clone-category-grid > a').length;
    const hasContainer = !!document.querySelector('.container');
    const articleCards = document.querySelectorAll('.article-card').length;
    const bodyText = document.body.innerText.slice(0, 400).replace(/\\s+/g, ' ').trim();
    return JSON.stringify({
      label: ${JSON.stringify(LABEL)},
      target: ${JSON.stringify(TARGET)},
      cookie: ${JSON.stringify(COOKIE_NAME ? COOKIE_NAME + '=' + COOKIE_VALUE : '(none)')},
      theme,
      hasHero,
      hasFeatured,
      hasLatest,
      hasSeries,
      hasCategory,
      featuredCount,
      latestCount,
      seriesCount,
      categoryCount,
      hasContainer,
      articleCards,
      htmlLen: html.length,
      sampleTitle: document.querySelector('.easton-clone-featured-card h2')?.textContent
        || document.querySelector('.article-card h2')?.textContent
        || document.querySelector('h1')?.textContent,
      bodyTextSnippet: bodyText,
    })
  })()`,
  returnByValue: true,
})

console.log(result.value)

ws.close()
child.kill('SIGTERM')
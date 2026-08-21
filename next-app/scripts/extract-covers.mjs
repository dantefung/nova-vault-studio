#!/usr/bin/env node
// 把 shots.js 的 S 对象求值后导出为 JSON
// shots.js 用了 `${rows(2)} ${h} ${s.toFixed(3)} ${b.x - p}` 等动态表达式
// IIFE 顶层求值时模板字符串已经计算好，所以 S[k] 已经是求值后的字符串
// 我们只需要跑 IIFE，抓 S 即可

import fs from 'fs'

const srcPath = process.argv[2] || '/tmp/pmaker-shots.js'
const outPath = process.argv[3] || '/home/fenghaolin/.cache/tmp/opencode/nova-pmaker-clone/next-app/src/data/pmaker-covers.json'

const src = fs.readFileSync(srcPath, 'utf8')

// 抓 IIFE 主体
const iifeMatch = src.match(/\(function \(\) \{([\s\S]*?)\}\)\(\);/)
if (!iifeMatch) { console.error('IIFE not found'); process.exit(1) }

const iifeBody = iifeMatch[1] + '\n; globalThis.__S = S;'

// 在 vm 沙箱里跑
const vm = await import('vm')
const noop = () => {}
const fakeEl = { getBoundingClientRect: () => ({ x: 0, y: 0, width: 900, height: 300, top: 0, left: 0, right: 900, bottom: 300 }), style: {}, dataset: {}, parentNode: null, classList: { add: noop, remove: noop } }
const sandbox = {
  document: {
    querySelectorAll: () => [],
    addEventListener: noop,
    documentElement: { clientWidth: 1440 },
  },
  window: { addEventListener: noop },
  addEventListener: noop,
  clearTimeout: noop,
  setTimeout: (fn) => { try { fn() } catch(e){} return 0 },
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  console,
  S: null,
}
vm.createContext(sandbox)
try {
  vm.runInContext(iifeBody, sandbox)
} catch (e) {
  console.error('IIFE eval error:', e.message)
  process.exit(1)
}

const S = sandbox.__S
if (!S) { console.error('S not in sandbox'); process.exit(1) }

const out = {}
for (const k of Object.keys(S)) {
  out[k] = String(S[k])
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
console.log('Wrote ' + outPath + ': ' + Object.keys(out).length + ' entries, ' + fs.statSync(outPath).size + ' bytes')

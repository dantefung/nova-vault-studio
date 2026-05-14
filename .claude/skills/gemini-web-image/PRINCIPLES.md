# gemini-web-image 工作原理

## 架构全景

```
┌─────────────────────────────────────────────┐
│              article-illustrate              │
│         (主编：分析→风格→编排)               │
└──────────────────┬──────────────────────────┘
                   │ 委托生成
                   ▼
┌─────────────────────────────────────────────┐
│            gemini-web-image                  │
│  ┌─────────────────────────────────────┐    │
│  │        session 管理器                │    │
│  │  ~/.local/share/nova-vault/         │    │
│  │  gemini-web-image/                  │    │
│  │  ├── chrome-profile/  (Chromium)    │    │
│  │  ├── cookies.json      (备份)       │    │
│  │  └── .last-login        (时间戳)    │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │        浏览器控制器                  │    │
│  │  gstack browse (Playwright CDP)      │    │
│  │  $B js / $B type / $B press Enter    │    │
│  └──────────────┬──────────────────────┘    │
│                 │ CDP pipe                   │
│                 ▼                            │
│  ┌─────────────────────────────────────┐    │
│  │         Playwright Chromium          │    │
│  │  ~/.gstack/chromium-profile/         │    │
│  │  (从 STORE 恢复 / 持久化回 STORE)    │    │
│  └──────────────┬──────────────────────┘    │
│                 │ HTTP                       │
│                 ▼                            │
│  ┌─────────────────────────────────────┐    │
│  │       gemini.google.com             │    │
│  │  「制作图片」模式 → Imagen 后端      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## 两条生图路径对比

```
                    ┌─ 用户 prompt ─┐
                    │               │
                    ▼               ▼
            ┌──────────┐    ┌──────────────┐
            │ CLI API   │    │  Browser UI   │
            │ generate_ │    │  制作图片模式  │
            │ content() │    │               │
            └─────┬─────┘    └──────┬────────┘
                  │                 │
                  ▼                 ▼
         ┌────────────┐    ┌──────────────┐
         │ Gemini Web │    │ Gemini Web   │
         │ API 后端   │    │ UI 后端      │
         │ (stream)   │    │ (batch)      │
         └─────┬──────┘    └──────┬───────┘
               │                  │
               ▼                  ▼
        ┌──────────┐      ┌──────────────┐
        │ 模型选择  │      │ 强制 Imagen  │
        │ 是否生图  │      │ 管线路由     │
        └─────┬────┘      └──────┬───────┘
              │                  │
              ▼                  ▼
      images[] 常为空      blob: URL 稳定产出
      (信息图→0%)         (所有类型→~80%)
```

**根因**：CLI API 通过 `StreamGenerate` 端点，模型自行判断是否生图；UI「制作图片」按钮在请求中注入 `media_gen` 参数，强制走 Imagen 管线。

## Session 持久化原理

### 为什么 Chromium profile 能跳过登录

Chromium 将 cookie、localStorage、sessionStorage 存在 SQLite 数据库中：

```
chrome-profile/
├── Default/
│   ├── Cookies          ← SQLite，含所有域 cookie
│   ├── Local Storage/   ← localStorage 数据
│   ├── Session Storage/ ← sessionStorage 数据
│   └── Preferences      ← 浏览器设置
├── Local State          ← 全局状态
└── SingletonLock        ← 单例锁（每次需清理）
```

恢复 profile → Chromium 读取 Cookies SQLite → 发 HTTP 请求时自动附带 google.com 域 cookie → Gemini 识别为已登录用户。

### 命名空间隔离

```
~/.local/share/
├── baoyu-skills/           ← baoyu 全家桶共享
│   ├── gemini-web/         ← danger-gemini CLI
│   │   ├── cookies.json
│   │   └── chrome-profile/
│   └── ...
│
├── nova-vault/             ← 本项目专用
│   └── gemini-web-image/   ← 本技能专用
│       ├── cookies.json
│       ├── chrome-profile/
│       └── .last-login
│
└── gstack/                 ← gstack 全家桶共享
    └── chromium-profile/   ← browse 运行时
```

### 生命周期

```
首次使用:
  danger-gemini --login → Chrome 弹出 → 用户登录
  → cookie 保存到 baoyu-skills/gemini-web/
  → gemini-web-image 从 baoyu 复制 cookie
  → 注入 gstack browser → 导航 Gemini → 登录成功
  → 保存 profile 到 nova-vault/gemini-web-image/

后续使用:
  检查 nova-vault/gemini-web-image/ 是否存在
  → 恢复 profile 到 ~/.gstack/chromium-profile/
  → 启动浏览器 → 直接已登录 ✓

Profile 损坏 / Session 过期:
  删除 nova-vault/gemini-web-image/chrome-profile/
  → 回退到首次使用流程
```

## Browser 命令兼容性

| 命令 | 状态 | 原因 |
|------|------|------|
| `$B js "..."` | ✅ 稳定 | CDP `Runtime.evaluate`，直接注入 |
| `$B type "..."` | ✅ 稳定 | CDP `Input.dispatchKeyEvent` |
| `$B press Enter` | ✅ 稳定 | CDP `Input.dispatchKeyEvent` |
| `$B goto URL` | ✅ 稳定 | CDP `Page.navigate` |
| `$B snapshot -i` | ✅ 稳定 | Playwright accessibility tree |
| `$B click @ref` | ❌ 超时 | Playwright actionability check 过严 |
| `$B fill @ref "text"` | ❌ 不稳定 | 元素类型检测 + Angular 框架兼容 |
| `$B cookie name=value` | ✅ 稳定 | CDP `Network.setCookie` |
| `$B cookie-import-browser` | ❌ 返 0 | 无法解密 Chrome 加密 cookie |

**替代策略**：
- `click` → `$B js "...click()"`  (原生 DOM 事件)
- `fill` → `$B js "...focus()"` + `$B type "..."` (键盘模拟)

## JS 引擎限制

gstack browse 的 `$B js` 使用 Chromium 的 `Runtime.evaluate`，
但表达式经过包装后在非模块上下文中执行：

| ✅ 可用 | ❌ 不可用 |
|--------|----------|
| `function(){}` | `() => {}` (箭头函数) |
| `var` | `const`/`let` (部分场景) |
| `Array.from()` | `[...spread]` |
| `JSON.stringify()` | template literals (部分) |
| `document.querySelector()` | `document.querySelectorAll().forEach()` |
| `for(var i=0;...)` | `for...of` |

## 「取消选择制作图片」指示器

这个指示器是 Gemini UI 中的一个 UI 状态标记：

```html
<button aria-label="取消选择"制作图片"">制作图片</button>
```

**何时出现**：
- 首次点击主页的「制作图片」按钮
- 在一个全新的对话中
- 后端成功返回 `media_gen` 模式确认

**何时不出现**：
- 在已有文本对话中点击
- Profile 有缓存状态干扰
- 后端拒绝进入生图模式（限流/模型不支持）

**为什么是关键门禁**：指示器出现 = 后端确认了 `media_gen` 参数 = 后续所有消息都会走 Imagen 管线。
没有指示器 = 消息走普通文本管线 = 不会生成图片。

## 模式衰减

每次生图模式激活后，约 2 张图片后模型会切回文本回复。
这是 Gemini 的服务端保护机制（防止滥用 Imagen 资源）。

**检测**：`AFTER == BEFORE` → blob 数量未增加 → 模式已衰减
**恢复**：`goto gemini.google.com` → 重新点击「制作图片」→ 验证指示器 → 继续生图

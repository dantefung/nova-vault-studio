# gemini-web-image 工作原理

## 架构全景

```
┌─────────────────────────────────────────────────────┐
│              article-illustrate                      │
│         (主编：分析→风格→编排)                        │
└────────────────────┬────────────────────────────────┘
                     │ 委托
                     ▼
┌─────────────────────────────────────────────────────┐
│              gemini-web-image (引擎)                 │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  session 管理器                                │  │
│  │  ~/.local/share/nova-vault/gemini-web-image/  │  │
│  │  └── gstack-chrome-profile/                   │  │
│  │      └── Default/Cookies (SQLite, 持久化)      │  │
│  └───────────────────────────────────────────────┘  │
│                  ▲ symlink                           │
│  ~/.gstack/chromium-profile                         │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  浏览器控制 (gstack browse)                    │  │
│  │  $B js / $B type / $B press Enter             │  │
│  └──────────────┬────────────────────────────────┘  │
│                 │ CDP pipe                           │
│                 ▼                                    │
│  ┌───────────────────────────────────────────────┐  │
│  │  Playwright Chromium                           │  │
│  │  ~/.cache/ms-playwright/chromium-1208/chrome   │  │
│  │  --user-data-dir=~/.gstack/chromium-profile    │  │
│  └──────────────┬────────────────────────────────┘  │
│                 │ HTTPS                              │
│                 ▼                                    │
│  ┌───────────────────────────────────────────────┐  │
│  │  gemini.google.com「制作图片」→ Imagen 后端     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 共享 Chrome Profile 方案

### 问题

gstack browse 和 danger-gemini 使用不同的 Chrome 实例。
cookie 注入被 Chromium 安全策略拒绝（SID/LSID/__Secure 等认证 cookie 无法程序化设置）。
`cookie-import-browser` 返回 0（无法解密系统 Chrome 的加密 cookie）。

### 方案

让 danger-gemini `--login` 使用与 gstack browse **相同的 Playwright Chromium 二进制**，
并写入**相同的 profile 目录**。

```
首次:
  GEMINI_WEB_CHROME_PATH=<playwright-chrome> \
  GEMINI_WEB_CHROME_PROFILE_DIR=<shared-profile> \
  danger-gemini --login

  → Playwright Chromium 打开 OAuth 页面
  → 用户登录 Google
  → Chromium 将 cookie 写入 SQLite (Default/Cookies)
  → profile 持久化

后续:
  ln -sf <shared-profile> ~/.gstack/chromium-profile
  gstack browse connect
  
  → Playwright Chromium 读取同一份 Cookies DB
  → 直接已登录 ✓
```

### 为什么可靠

1. **同一个 Chrome 二进制**：Playwright 的 Chromium，加密 key 一致
2. **同一个 profile 目录**：Cookies SQLite 原样读写，无格式转换
3. **Chromium 原生 OAuth**：cookie 由浏览器自己写入（非程序化注入），满足所有安全策略
4. **符号链接**：gstack browse 的 `--user-data-dir` 通过 symlink 指向持久化目录

## 两条生图路径对比

```
CLI API (generate_content)     Browser UI (制作图片)
        │                              │
        ▼                              ▼
   StreamGenerate                media_gen 参数
        │                              │
        ▼                              ▼
   模型自主判断                 强制 Imagen 管线
        │                              │
        ▼                              ▼
  images[] 常为空              blob: URL 稳定产出
  (信息图→0%)                  (所有类型→~80%)
```

## 生图模式激活条件

「取消选择制作图片」指示器 = UI 在 `<button>` 上标注了 `aria-label="取消选择"制作图片""`。

**出现条件**：
- Gemini 主页上点击「制作图片」按钮
- 后端返回 media_gen 模式确认
- 在全新或干净的对话中

**不出现条件**：
- 已有文本对话中进行
- 后端限流或模型不支持
- Profile 状态异常

**为什么是关键门禁**：指示器 = 后端确认了 media_gen 参数 = 后续消息走 Imagen 管线。
无指示器 = 消息走普通文本管线 = 不生成图片。

## 模式衰减

每次生图模式激活后，约 2 张图片后模型切回文本回复（Gemini 服务端保护机制）。

- 检测：`AFTER == BEFORE` → 未生成新 blob
- 恢复：`goto gemini.google.com` → 重新点击「制作图片」

## 浏览器命令兼容矩阵

| 命令 | 状态 | 替代 |
|------|------|------|
| `$B js "..."` | ✅ | — |
| `$B type "..."` | ✅ | — |
| `$B press Enter` | ✅ | — |
| `$B goto URL` | ✅ | — |
| `$B snapshot -i` | ✅ | — |
| `$B click @ref` | ❌ 超时 | `$B js "...click()"` |
| `$B fill @ref "text"` | ❌ 不稳定 | `$B js "...focus()"` + `$B type` |
| `$B cookie-import-browser` | ❌ 返0 | 共享 profile 方案 |
| `$B cookie name=value` | ❌ 认证 cookie 被拒 | 共享 profile 方案 |

## JS 引擎限制

| ✅ | ❌ |
|----|----|
| `function(){}` | `() => {}` |
| `var` | `const`/`let`（部分） |
| `Array.from()` | spread operator |
| `JSON.stringify()` | template literals（部分） |
| `for(var i=0;...)` | `for...of` |
| `document.querySelector()` | `querySelectorAll().forEach()` |

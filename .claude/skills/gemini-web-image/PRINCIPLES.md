# gemini-web-image 工作原理

## 架构

```
┌─────────────────────────────────────────────────────┐
│              article-illustrate (主编)               │
│              分析→风格→编排                           │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              gemini-web-image (引擎)                 │
│                                                     │
│  依赖：只有 gstack browse                            │
│  (提供 Playwright Chromium + CDP pipe)               │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Session 持久化                                │  │
│  │  ~/.local/share/nova-vault/                   │  │
│  │  gemini-web-image/                            │  │
│  │  └── gstack-chrome-profile/                   │  │
│  │      └── Default/Cookies (SQLite)              │  │
│  └───────────────────────────────────────────────┘  │
│                  ↕ symlink                           │
│  ┌───────────────────────────────────────────────┐  │
│  │  ~/.gstack/chromium-profile                   │  │
│  │  (gstack browse 读写)                          │  │
│  └───────────────────────────────────────────────┘  │
│                  │                                   │
│  ┌───────────────┼───────────────────────────────┐  │
│  │  $B connect   │  $B js  $B type  $B press     │  │
│  │  启动 Chrome   │  Enter  $B goto  $B snapshot  │  │
│  └───────────────┼───────────────────────────────┘  │
│                  │ CDP pipe                          │
│                  ▼                                   │
│  ┌───────────────────────────────────────────────┐  │
│  │  Playwright Chromium (有头窗口)                │  │
│  │  ~/.cache/ms-playwright/chromium-1208/chrome   │  │
│  └──────────────┬────────────────────────────────┘  │
│                 │ HTTPS                              │
│                 ▼                                    │
│  ┌───────────────────────────────────────────────┐  │
│  │  gemini.google.com「制作图片」→ Imagen         │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 依赖决策

| 依赖 | 为什么要 | 为什么没去掉 |
|------|---------|-------------|
| gstack browse | Playwright Chromium 启动 + CDP pipe + 命令集 | 已有编译好的二进制，覆盖所有浏览器操作 |
| ~~danger-gemini~~ | ~~login flow~~ | **已移除。** gstack 浏览器本身是有头窗口，用户直接看到并登录。Profile 自动持久化。 |

## 登录原理

```
首次:
  $B connect → 启动 Playwright Chromium (有头窗口)
  $B goto gemini.google.com → 重定向到 Google OAuth
  用户在窗口里输入密码 → 登录完成
  Chromium 将 cookie 写入 Default/Cookies (SQLite)
  Profile 持久化到 $STORE/gstack-chrome-profile/

后续:
  $B connect → Chromium 读取同一份 Default/Cookies
  $B goto gemini.google.com → 直接已登录 ✓
```

无 cookie 注入。无危险脚本。Chromium 原生 OAuth → SQLite → 持久化。

## 生图路径

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

## 生图模式激活

「取消选择制作图片」指示器 = 后端返回 media_gen 确认。

- **出现**: Gemini 主页点击「制作图片」，新对话中
- **不出现**: 已有文本对话、后端限流、profile 异常
- **门禁**: 有 = 后续消息走 Imagen。无 = 普通文本，不生图。

## 模式衰减

每轮约 2 张后模型切回文本（服务端保护）。检测 `AFTER==BEFORE`，恢复 = 回主页重新激活。

## Browser 命令集

| 命令 | 状态 | 说明 |
|------|------|------|
| `$B connect` | ✅ | 启动有头 Chromium |
| `$B disconnect` | ✅ | 关闭 |
| `$B goto URL` | ✅ | 导航 |
| `$B js "..."` | ✅ | CDP Runtime.evaluate。**必须 `function(){}`，不能用 `()=>{}`** |
| `$B type "..."` | ✅ | CDP Input.dispatchKeyEvent |
| `$B press Enter` | ✅ | |
| `$B snapshot -i` | ✅ | Playwright accessibility tree |
| `$B click @ref` | ❌ | 超时。用 `$B js "...click()"` |
| `$B fill @ref "..."` | ❌ | 不稳定。用 `$B js "...focus()"` + `$B type` |

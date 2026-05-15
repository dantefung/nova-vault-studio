---
name: gemini-web-image
description: |
  底层浏览器生图引擎。通过 gstack 有头浏览器直接操作 Gemini Web UI「制作图片」模式生成图片。
  当用户说 "用 gemini 生图"、"gemini 生成图片"、"Gemini 画图" 时触发。
  首次需 danger-gemini --login 一次，后续零步骤自动登录。
---

# Gemini Web 图片生成（浏览器操作引擎）

通过 gstack 有头浏览器操作 gemini.google.com 的「制作图片」模式生成图片。

## 前置依赖

- gstack browse (`/home/fenghaolin/.claude/skills/gstack/browse/dist/browse`)
- danger-gemini-web（`/home/fenghaolin/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts`）
- bun, python3

## 架构：共享 Chrome Profile

核心思路：danger-gemini 和 gstack browse 共用同一个 Playwright Chromium 的 profile 目录。
一次登录，两边复用。

```
┌──────────────────────────────────────────────────┐
│  Playwright Chromium                             │
│  ~/.cache/ms-playwright/chromium-1208/chrome     │
│                                                  │
│  --user-data-dir=~/.gstack/chromium-profile      │
│                │                                 │
│                │ symlink                          │
│                ▼                                 │
│  ~/.local/share/nova-vault/gemini-web-image/     │
│  └── gstack-chrome-profile/                      │
│      └── Default/Cookies  ← SQLite，持久化登录态  │
└──────────────────────────────────────────────────┘
         ▲                          ▲
         │ danger-gemini --login    │ gstack browse connect
         │ (首次认证)               │ (日常使用)
```

**为什么 cookie 注入不可靠**：Chromium 使用 OS 级 keychain 加密 cookie。`$B cookie name=value` 设置的 SID/LSID 等认证 cookie 会被 Chromium 安全策略拒绝（secure/httponly/__Host 前缀校验）。唯一可靠的方式是让 Chromium 自己通过 Google OAuth 流程写入 cookie —— 即 `danger-gemini --login`。

## 持久化存储

```
~/.local/share/nova-vault/gemini-web-image/
└── gstack-chrome-profile/   ← Chromium profile（含完整登录态）
    实际路径 ~/.gstack/chromium-profile → symlink
```

## 首次使用：登录

danger-gemini 用 Playwright Chromium 打开 Google OAuth，用户在窗口里登录一次。

```bash
# Playwright Chromium 路径
PLAYWRIGHT_CHROME=$(find ~/.cache/ms-playwright -name "chrome" -type f | head -1)

STORE="$HOME/.local/share/nova-vault/gemini-web-image"
PROFILE="$STORE/gstack-chrome-profile"
mkdir -p "$PROFILE"

# 用 Playwright Chromium + 共享 profile 完成登录
GEMINI_WEB_CHROME_PATH="$PLAYWRIGHT_CHROME" \
GEMINI_WEB_CHROME_PROFILE_DIR="$PROFILE" \
bun /home/fenghaolin/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts --login
```

登录完成后 profile 自动持久化，后续无需再登录。

## 日常使用：零步骤启动

```bash
B="/home/fenghaolin/.claude/skills/gstack/browse/dist/browse"
STORE="$HOME/.local/share/nova-vault/gemini-web-image"
PROFILE="$STORE/gstack-chrome-profile"

# 清理旧进程
$B disconnect 2>/dev/null
rm -f "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json"

# Symlink gstack → 共享 profile
rm -rf ~/.gstack/chromium-profile
ln -sf "$PROFILE" ~/.gstack/chromium-profile

# 启动 → 直接已登录
$B connect
$B goto https://gemini.google.com
```

## ⚠️ 关键铁律

1. **「取消选择制作图片」= 生图模式唯一可信信号** —— grep 到才算
2. **每轮最多 2 张** —— 之后回主页重新点「制作图片」
3. **JS 必须 `function()` 不能用 `()=>`** —— browse 引擎不支持 ES6
4. **提取 blob 用前后差值索引** —— `imgs[BEFORE]` 不是 `imgs[last]`
5. **`click`/`fill` 用 JS 替代** —— browse 原生命令频繁超时

## 生图流程

### Step 1: 激活生图模式

```bash
$B goto https://gemini.google.com
sleep 4

$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 5

# 门禁：必须验证
$B snapshot -i | grep '取消选择' || echo "FATAL: not in image mode"
```

### Step 2: 逐张生图

```bash
BEFORE=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")

$B js "document.querySelector('[aria-label*=\"为 Gemini 输入提示\"]').focus();'ok'"
sleep 1
$B type "your prompt here (keep under 200 chars)"
sleep 2
$B press Enter
sleep 55

AFTER=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")

if [ "$AFTER" -gt "$BEFORE" ]; then
  $B js "(function(){var imgs=Array.from(document.querySelectorAll('img')).filter(function(i){return i.naturalWidth>50&&i.src.startsWith('blob:')});var img=imgs[$BEFORE];var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);return c.toDataURL('image/png')})()" | python3 -c "
import sys,base64
d=sys.stdin.buffer.read().decode().strip()
if d.startswith('data:image/png;base64,'):
  with open('output.png','wb') as f: f.write(base64.b64decode(d.split(',',1)[1]))
"
fi
```

### Step 3: 重新激活（每 2 张后）

```bash
$B goto https://gemini.google.com
sleep 4
$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 5
```

## 提示词格式

精简到 100-200 字符：

```
[style] [subject]. [layout]. [colors]. [mood].
```

## 故障排查

| 问题 | 原因 | 解法 |
|------|------|------|
| 未登录 | Profile 丢失 | 重新 `danger-gemini --login` |
| 无「取消选择」指示器 | 不在生图模式 | 回主页重新点制作图片 |
| 第 3 张不生成 | 模式衰减 | 回主页重新激活 |
| `$B js` 语法错误 | 箭头函数 | 用 `function(){}` 代替 |
| 提取图片重复 | 取错索引 | 用 `imgs[BEFORE]` |
| `$B click` 超时 | Playwright 限制 | 用 `$B js "...click()"` |
| Profile 损坏 | 强制关闭 | `rm -rf $PROFILE` 重新登录 |
| 多个 Chrome 冲突 | SingletonLock | `rm -f $PROFILE/Singleton*` |

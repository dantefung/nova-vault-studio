---
name: gemini-web-image
description: |
  自包含浏览器生图引擎。通过 Playwright Chromium CDP 操作 Gemini Web UI「制作图片」模式生成图片。
  依赖仅 gstack browse(提供 Playwright Chromium + CDP 通信层)。
  当用户说 "用 gemini 生图"、"gemini 生成图片"、"Gemini 画图" 时触发。
---

# Gemini Web 图片生成（浏览器操作引擎）

通过 gstack browse 启动的 Playwright Chromium 操作 gemini.google.com「制作图片」模式。

## 依赖

仅一个：**gstack browse**。默认路径 `~/.claude/skills/gstack/browse/dist/browse`。

提供 Playwright Chromium + CDP pipe 通信层（`$B js` / `$B type` / `$B goto` 等）。

```bash
# 检查是否已安装
bash .claude/skills/gemini-web-image/setup
```

gstack browse 是 98MB Go 编译 ELF 二进制，链接仅依赖 libc。无 npm/pip 依赖链。

## 持久化

```
~/.local/share/nova-vault/gemini-web-image/
└── gstack-chrome-profile/       ← Playwright Chromium profile
    ├── Default/Cookies (SQLite)
    └── ...
        ↕ symlink
~/.gstack/chromium-profile       ← gstack browse 读写
```

Profile 包含 Google 登录态。首次登录后，Chromium SQLite 保存 cookie，后续自动登录。

## 流程

### 首次：登录

gstack browse 启动的是**有头浏览器**（用户可看到窗口）。

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
STORE="$HOME/.local/share/nova-vault/gemini-web-image"
PROFILE="$STORE/gstack-chrome-profile"; mkdir -p "$PROFILE"

# 清理 + symlink
$B disconnect 2>/dev/null
rm -f "$(git rev-parse --show-toplevel)/.gstack/browse.json"
rm -rf ~/.gstack/chromium-profile
ln -sf "$PROFILE" ~/.gstack/chromium-profile

# 启动浏览器 → 导航到 Gemini
$B connect
$B goto https://gemini.google.com

# ⚠️ 浏览器窗口出现 Google 登录页。用户在窗口里登录。
# 登录完成后 Profile 自动持久化到 $PROFILE/Default/Cookies。
```

无 danger-gemini。无 cookie 注入。用户看到浏览器窗口，自己登录一次。

### 日常：零步骤启动

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
STORE="$HOME/.local/share/nova-vault/gemini-web-image"
PROFILE="$STORE/gstack-chrome-profile"

rm -f "$(git rev-parse --show-toplevel)/.gstack/browse.json"
rm -rf ~/.gstack/chromium-profile
ln -sf "$PROFILE" ~/.gstack/chromium-profile

$B connect
$B goto https://gemini.google.com
# → 直接已登录（如果 Profile 里有有效 session）
```

### 确认登录

```bash
$B snapshot -i | grep 'Google 账号'
# 有输出 = 已登录
# 无输出 = 需要重新登录（Profile 过期）
```

### 生图

#### Step 1: 激活生图模式

```bash
$B goto https://gemini.google.com; sleep 4
$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 5

# ⚠️ 门禁
$B snapshot -i | grep '取消选择' || echo "NOT IN IMAGE MODE"
```

#### Step 2: 生图

```bash
BEFORE=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")

$B js "document.querySelector('[aria-label*=\"为 Gemini 输入提示\"]').focus()"
sleep 1
$B type "your prompt (<200 chars)"
sleep 2
$B press Enter
sleep 55

AFTER=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")

if [ "$AFTER" -gt "$BEFORE" ]; then
  $B js "(function(){var imgs=Array.from(document.querySelectorAll('img')).filter(function(i){return i.naturalWidth>50&&i.src.startsWith('blob:')});var img=imgs[$BEFORE];var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);return c.toDataURL('image/png')})()" | python3 -c "
import sys,base64
d=sys.stdin.buffer.read().decode().strip()
if d.startswith('data:image/png;base64,'):
  with open('OUTPUT.png','wb') as f: f.write(base64.b64decode(d.split(',',1)[1]))
"
fi
```

#### Step 3: 重新激活（每 2 张后）

```bash
$B goto https://gemini.google.com; sleep 4
$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 5
```

### 清理

```bash
$B disconnect
```

## 铁律

1. **「取消选择制作图片」= 生图模式唯一信号** —— 没有就不在
2. **每轮最多 2 张** —— 之后回主页重新激活
3. **JS 用 `function()` 不能用 `()=>`**
4. **提取 blob 用 `imgs[BEFORE]` 不是 `imgs[last]`**
5. **`click`/`fill` 用 JS 替代**

## 提示词

精简到 100-200 字符：`[style] [subject]. [layout]. [colors]. [mood].`

## 故障排查

| 问题 | 解法 |
|------|------|
| 未登录 | 重新走首次登录流程（浏览器窗口里登录 Google） |
| 无「取消选择」 | 回主页重新点制作图片 |
| 第 3 张不生成 | 回主页重新激活 |
| JS 语法错 | 用 `function(){}` 不用 `()=>{}` |
| 提取重复 | `imgs[BEFORE]` 取新增 blob |
| Profile 坏 | `rm -rf $PROFILE` 重新登录 |
| Chrome 冲突 | `rm -f $PROFILE/Singleton*` |

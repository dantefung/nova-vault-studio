---
name: gemini-web-image
description: |
  底层浏览器生图引擎。通过 gstack 有头浏览器直接操作 Gemini Web UI「制作图片」模式生成图片。
  当用户说 "用 gemini 生图"、"gemini 生成图片"、"Gemini 画图" 时触发。
  通常被 article-illustrate skill 调用，也可独立使用。
  首次使用需登录一次，后续自动复用持久化 session。
---

# Gemini Web 图片生成（浏览器操作引擎）

通过有头浏览器操作 gemini.google.com 的「制作图片」模式生成图片。
绕开 CLI API 路径的生图不稳定问题。

> 被 `article-illustrate` skill 调用。独立使用：给定 prompt → 返回 PNG 路径。

## 前置依赖

- gstack browse (`/home/fenghaolin/.claude/skills/gstack/browse/dist/browse`)
- bun, python3

## 持久化存储

Session 数据存于专用目录，与全局 danger-gemini 隔离：

```
~/.local/share/nova-vault/gemini-web-image/
├── cookies.json       # Google session cookies
├── chrome-profile/    # Chromium profile（含登录态）
└── .last-login        # 上次登录时间戳
```

> 设计参考 baoyu-skills 的 XDG 命名空间模式：`{app-data}/{project}/{skill}/`。

## ⚠️ 关键铁律

1. **先 `google.com` 再 Gemini** —— cookie 需要先建域
2. **「取消选择制作图片」= 生图模式唯一可信信号** —— 没有就不在生图模式
3. **每轮最多 2 张** —— 之后回主页重新激活
4. **JS 必须 `function()` 不能用 `()=>`** —— browse 引擎不支持 ES6 箭头函数
5. **提取 blob 用前后差值索引** —— `imgs[BEFORE]` 不是 `imgs[last]`
6. **`click`/`fill` 用 JS 替代** —— browse 原生命令频繁超时

## 完整流程

### Step 0: 检查持久化 session

```bash
STORE="$HOME/.local/share/nova-vault/gemini-web-image"
mkdir -p "$STORE/chrome-profile"

# 检查是否有持久化 session
if [ -f "$STORE/cookies.json" ] && [ -d "$STORE/chrome-profile" ]; then
  echo "Found persisted session"
  LAST_LOGIN=$(cat "$STORE/.last-login" 2>/dev/null || echo "unknown")
  echo "Last login: $LAST_LOGIN"
else
  echo "No persisted session — will run first-time login"
fi
```

### Step 1: 启动浏览器（复用持久化 profile）

```bash
B="/home/fenghaolin/.claude/skills/gstack/browse/dist/browse"

# 清理旧进程
kill $(cat "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json" 2>/dev/null | grep -o '"pid":[0-9]*' | grep -o '[0-9]*') 2>/dev/null || true
sleep 1
rm -f "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json"

# 从持久化存储恢复 profile（如果有）
if [ -d "$STORE/chrome-profile/Cookies" ] || [ -f "$STORE/chrome-profile/Default/Cookies" ]; then
  echo "Restoring persisted Chrome profile..."
  rm -rf ~/.gstack/chromium-profile
  cp -r "$STORE/chrome-profile" ~/.gstack/chromium-profile
fi

# 连接浏览器
$B connect
```

### Step 2: 登录（自动检测 session 状态）

```bash
# 先访问 google.com 建域
$B goto https://www.google.com
sleep 2

# 检查是否已登录
LOGGED_IN=$($B snapshot -i 2>&1 | grep -c 'Google 账号')

if [ "$LOGGED_IN" -eq 0 ]; then
  echo "Session expired or first use — need to inject cookies"
  
  # 尝试从持久化存储注入 cookie
  if [ -f "$STORE/cookies.json" ]; then
    python3 -c "
import json, subprocess
with open('$STORE/cookies.json') as f: data = json.load(f)
for n,v in data.get('cookieMap',{}).items():
    subprocess.run(['$B','cookie',f'{n}={v}'],capture_output=True,timeout=3)
print('cookies injected from store')
"
  fi
  
  # 如果存储里也没有，用 danger-gemini 的 cookie
  if [ -f ~/.local/share/baoyu-skills/gemini-web/cookies.json ]; then
    python3 -c "
import json, subprocess
with open('$HOME/.local/share/baoyu-skills/gemini-web/cookies.json') as f: data = json.load(f)
for n,v in data.get('cookieMap',{}).items():
    subprocess.run(['$B','cookie',f'{n}={v}'],capture_output=True,timeout=3)
print('cookies injected from danger-gemini')
"
  fi
fi

# 跳 Gemini
$B goto https://gemini.google.com
sleep 3

# Cookie 弹窗
$B snapshot -i | grep '全部接受' && $B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('全部接受')});if(b){b.click();return'ok'}return'no'})()"
sleep 2

# 验证登录
FINAL_CHECK=$($B snapshot -i | grep -c 'Google 账号')
if [ "$FINAL_CHECK" -eq 0 ]; then
  echo "FATAL: 登录失败。请运行: bun <danger-gemini>/main.ts --login 刷新 cookies，然后重试"
  exit 1
fi
echo "登录成功"
```

### Step 3: 进入生图模式

```bash
$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 4

# ⚠️ 门禁：必须验证指示器
if [ $($B snapshot -i | grep -c '取消选择') -eq 0 ]; then
  echo "FATAL: 不在生图模式（无「取消选择制作图片」指示器）"
  echo "尝试：回到主页 → 新对话 → 重新点制作图片"
  $B goto https://gemini.google.com
  sleep 2
  $B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
  sleep 4
fi
```

### Step 4: 批量生图

```bash
generate_one() {
  local OUTPUT="$1" PROMPT="$2"
  
  BEFORE=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")
  
  $B js "document.querySelector('[aria-label*=\"为 Gemini 输入提示\"]').focus();'ok'"
  sleep 1
  $B type "$PROMPT"
  sleep 2
  $B press Enter
  sleep 55
  
  AFTER=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")
  
  if [ "$AFTER" -gt "$BEFORE" ]; then
    $B js "(function(){var imgs=Array.from(document.querySelectorAll('img')).filter(function(i){return i.naturalWidth>100&&i.src.startsWith('blob:')});var img=imgs[$BEFORE];var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);return c.toDataURL('image/png')})()" | python3 -c "
import sys,base64
d=sys.stdin.read().strip()
if d.startswith('data:image/png;base64,'):
  with open('${OUTPUT}','wb') as f: f.write(base64.b64decode(d.split(',',1)[1]))
  print('OK')
"
    return 0
  fi
  return 1
}

# 每 2 张后重新激活生图模式
generate_one "img1.png" "prompt..."
# ... (success check)
$B goto https://gemini.google.com
sleep 3
$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 4
# generate more...
```

### Step 5: 持久化 session + 清理

```bash
# 保存 Chrome profile 到持久化存储
echo "Persisting Chrome profile..."
rm -rf "$STORE/chrome-profile"
cp -r ~/.gstack/chromium-profile "$STORE/chrome-profile"

# 保存 cookie
$B cookies > "$STORE/cookies.json" 2>/dev/null || true

# 记录时间
date -Iseconds > "$STORE/.last-login"

echo "Session persisted to $STORE"

# 断开浏览器
$B disconnect
```

## 提示词格式

生图 prompt 精简到 100-150 字符：

```
[style] [subject]. [layout]. [colors]. [mood].
```

## 技术原理

| 路径 | 行为 | 原因 |
|------|------|------|
| CLI API | 信息图 prompt → 0 图 | API 不触发 Imagen |
| UI「制作图片」 | 所有 prompt → 可生图 | UI 走不同后端 |
| Chrome profile 持久化 | 跳过重复登录 | Cookie 存 Chromium 本地 |
| Cookie json 备份 | 跨 profile 恢复 | 防 profile 损坏 |

## 故障排查

| 问题 | 解法 |
|------|------|
| 未登录 | 先 `google.com` → 注 cookie → `gemini`；必要时 `bun ... --login` 刷新 |
| 无「取消选择」指示器 | 回主页重新点制作图片；仍无则清 profile 重来 |
| 第 3 张不生成 | 回主页重新激活生图模式 |
| JS 语法错误 | 用 `function(){}` 代替 `()=>{}` |
| 提取图片重复 | 用 `imgs[BEFORE]` 索引取新增 blob |
| Profile 损坏 | `rm -rf $STORE/chrome-profile` 清持久化存储，下次重新登录 |
| Session 过期 | 删除 `$STORE/.last-login`，重新走完整登录流程 |

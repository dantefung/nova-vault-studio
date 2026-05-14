---
name: gemini-web-image
description: |
  底层浏览器生图引擎。通过 gstack 有头浏览器直接操作 Gemini Web UI「制作图片」模式生成图片。
  当用户说 "用 gemini 生图"、"gemini 生成图片"、"Gemini 画图" 时触发。
  通常被 article-illustrate skill 调用，也可独立使用。
  依赖 gstack browse 有头浏览器 + danger-gemini cookie。
---

# Gemini Web 图片生成（浏览器操作引擎）

通过有头浏览器操作 gemini.google.com 的「制作图片」模式生成图片。
绕开 CLI API 路径的生图不稳定问题（API 路径对信息图 prompt 几乎 100% 拒生）。

> 被 `article-illustrate` skill 调用。独立使用：给定 prompt → 返回 PNG 路径。

## 前置依赖

- gstack browse (`/home/fenghaolin/.claude/skills/gstack/browse/dist/browse`)
- danger-gemini cookie (`~/.local/share/baoyu-skills/gemini-web/cookies.json`)
- bun, python3

## ⚠️ 关键铁律（不遵守必失败）

1. **登录必须先访问 `google.com` 再跳 Gemini** —— cookie 需要先建域
2. **「取消选择制作图片」指示器 = 生图模式的唯一可信信号** —— 没有指示器就不在生图模式
3. **每轮生图模式最多出 2 张图** —— 之后模型会切回文本回复，需回主页重新激活
4. **browse 的 `click` 和 `fill` 不稳定** —— 用 JS 替代 `click`，用 `type` + `press Enter` 替代 `fill`
5. **JS 必须用 `function()` 不能用 `()=>`** —— browse 的 JS 引擎不支持 ES6 箭头函数
6. **提取 blob 必须记录前后数量差** —— 取 `imgs[BEFORE]` 而非 `imgs[imgs.length-1]`

## 完整流程

### Step 1: 启动并登录

```bash
B="/home/fenghaolin/.claude/skills/gstack/browse/dist/browse"

# 清理旧进程
kill $(cat "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json" 2>/dev/null | grep -o '"pid":[0-9]*' | grep -o '[0-9]*') 2>/dev/null || true
sleep 1
rm -f "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json"

# 连接有头浏览器
$B connect

# ⚠️ 先访问 google.com 建 cookie 域（关键！）
$B goto https://www.google.com
sleep 2

# 注入 Google cookies
python3 -c "
import json, subprocess, os
with open(os.path.expanduser('~/.local/share/baoyu-skills/gemini-web/cookies.json')) as f:
    data = json.load(f)
for name, value in data.get('cookieMap', {}).items():
    subprocess.run(['$B', 'cookie', f'{name}={value}'], capture_output=True, timeout=3)
"

# 跳 Gemini
$B goto https://gemini.google.com
sleep 3

# Cookie 弹窗 → 点全部接受
$B snapshot -i | grep '全部接受' && $B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('全部接受')});if(b){b.click();return'ok'}return'no'})()"
sleep 2
```

### Step 2: 进入生图模式并验证

```bash
# 点击「制作图片」
$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 4

# ⚠️ 必须验证指示器（关键门禁！）
HAS_INDICATOR=$($B snapshot -i | grep -c '取消选择')
if [ "$HAS_INDICATOR" -eq 0 ]; then
  echo "FATAL: 不在生图模式，重试登录流程"
  # 重新走 google.com → gemini → 制作图片
fi
```

### Step 3: 逐张生图（每轮最多 2 张）

```bash
generate_one() {
  local OUTPUT="$1" PROMPT="$2"
  
  # 记录 blob 数量
  BEFORE=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")
  
  # 聚焦 textbox → 打字 → 发送
  $B js "document.querySelector('[aria-label*=\"为 Gemini 输入提示\"]').focus();'ok'"
  sleep 1
  $B type "$PROMPT"
  sleep 2
  $B press Enter
  
  # 等待生图（50-60s）
  sleep 55
  
  # 检查是否生了新 blob
  AFTER=$($B js "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src.startsWith('blob:')}).length")
  
  if [ "$AFTER" -gt "$BEFORE" ]; then
    # 取新 blob（索引 = BEFORE）
    $B js "(function(){var imgs=Array.from(document.querySelectorAll('img')).filter(function(i){return i.naturalWidth>100&&i.src.startsWith('blob:')});var img=imgs[$BEFORE];var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);return c.toDataURL('image/png')})()" | python3 -c "
import sys,base64
d=sys.stdin.read().strip()
if d.startswith('data:image/png;base64,'):
  with open('${OUTPUT}','wb') as f: f.write(base64.b64decode(d.split(',',1)[1]))
  print('OK')
"
    return 0
  else
    return 1  # 没生图，需要重新激活模式
  fi
}

# 使用
generate_one "out.png" "Your image prompt here..."

# 每 2 张后检查：如果连续 2 次 AFTER==BEFORE → 回 Step 2 重新激活
```

### Step 4: 重新激活生图模式（每 2 张后）

```bash
# 回主页
$B goto https://gemini.google.com
sleep 3

# 重新点击制作图片 + 验证指示器
$B js "(function(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return x.textContent.includes('制作图片')});if(b){b.click();return'ok'}return'nobtn'})()"
sleep 4
$B snapshot -i | grep '取消选择' || echo "REACTIVATION FAILED"
```

### Step 5: 清理

```bash
$B disconnect
```

## 提示词格式

生图时 prompt 要精简（100-150 字符），把核心视觉元素说清楚。Gemini 在生图模式下对 prompt 长度敏感：

```
[style] [subject with key elements]. [layout]. [colors]. [mood].
```

示例：
```
Notion hand-sketched comparison two cards Accuracy vs Speed on cream notebook paper cozy minimal warm
```

## 技术原理

| 路径 | 行为 | 原因 |
|------|------|------|
| CLI API (`generate_content`) | 信息图 prompt → 0 图片 | API 端点不触发 Imagen |
| UI「制作图片」模式 | 所有 prompt → 可生图 | UI 走不同服务端路径 |
| 浏览器 JS (`$B js`) | 可操作 DOM | CDP pipe 注入 |
| browse `click` | 频繁超时 (5s) | Playwright 选择器解析慢 |
| browse `type` + `press Enter` | 稳定 | 模拟键盘输入 |
| `$B cookie` 注入 | 需先访问 google.com | cookie domain 绑定 |

## 故障排查

| 问题 | 原因 | 解法 |
|------|------|------|
| 未登录（显示「登录」链接） | cookie 域未建立 | **先 `goto google.com` → 注 cookie → 再 `goto gemini`** |
| 没有「取消选择」指示器 | 不在生图模式 | 回主页重新点制作图片 |
| 点制作图片后指示器仍不出现 | profile 缓存 | `rm -rf ~/.gstack/chromium-profile` 清 profile 重来 |
| 第 3 张图不生成 | 模式会话限制 | 回主页重新激活生图模式 |
| prompt 含特殊字符失败 | bash 转义 | 单引号包裹，双引号用 `\"` |
| `$B js` 语法错误 | 箭头函数不支持 | 用 `function(){}` 代替 `()=>{}` |
| 提取图片为空/0字节 | 取了错索引 | 用 `imgs[BEFORE]` 而非 `imgs[last]` |
| MD5 重复 | 取了同一 blob | 同上，用索引 `BEFORE` 取新增的 |
| `$B fill` / `$B click` 超时 | Playwright 限制 | 用 JS 替代：`$B js "...click()"` |
| `$B cookie-import-browser` 返回 0 | Chrome cookie 加密 | 用 danger-gemini CLI 的 `--login` 刷新 |

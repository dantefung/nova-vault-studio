---
name: gemini-web-image
description: |
  底层浏览器生图引擎。通过 gstack 有头浏览器直接操作 Gemini Web UI「制作图片」模式生成图片。
  当用户说 "用 gemini 生图"、"gemini 生成图片"、"Gemini 画图" 时触发。
  通常被 article-illustrate skill 调用，也可独立使用。
  依赖 gstack browse 有头浏览器 + danger-gemini cookie。
---

# Gemini Web 图片生成（浏览器操作引擎）

底层引擎：通过有头浏览器操作 gemini.google.com 的「制作图片」模式生成图片。

> 被 `article-illustrate` skill 调用。也可独立使用：给定 prompt → 返回 PNG 文件路径。

## 前置依赖

- gstack browse (`/home/fenghaolin/.claude/skills/gstack/browse/dist/browse`)
- danger-gemini cookie（`~/.local/share/baoyu-skills/gemini-web/cookies.json`）
- bun, python3

## 独立使用

```bash
# 给一个 prompt，生一张图
# AI 自动走完整浏览器流程
"用 gemini 生图：A blue infographic diagram..."
```

## 执行流程（共 5 步）

### Step 1: 启动浏览器并登录

```bash
B="/home/fenghaolin/.claude/skills/gstack/browse/dist/browse"

# 清理旧进程
kill $(cat "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json" 2>/dev/null | grep -o '"pid":[0-9]*' | grep -o '[0-9]*') 2>/dev/null || true
sleep 1
rm -f "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json"

# 连接有头浏览器
$B connect

# 注入 Google cookies
python3 -c "
import json, subprocess, os
with open(os.path.expanduser('~/.local/share/baoyu-skills/gemini-web/cookies.json')) as f:
    data = json.load(f)
for name, value in data.get('cookieMap', {}).items():
    subprocess.run(['$B', 'cookie', f'{name}={value}'], capture_output=True, timeout=3)
"

# 导航到 Gemini
$B goto https://gemini.google.com
sleep 3

# 如果有 cookie 弹窗，点接受
$B snapshot -i | grep '全部接受' && $B js "Array.from(document.querySelectorAll('button')).find(function(b){return b.textContent.includes('全部接受')}).click();'ok'"
```

### Step 2: 进入生图模式

```bash
# 点击「制作图片」按钮
$B js "Array.from(document.querySelectorAll('button')).find(function(b){return b.textContent.includes('制作图片')}).click();'imgmode'"
sleep 2

# 验证 textbox 出现
$B snapshot -i | grep '为 Gemini 输入提示'
```

### Step 3: 输入 Prompt 并发送

```bash
# 聚焦 textbox
$B js "document.querySelector('[aria-label*=\"为 Gemini 输入提示\"]').focus();'ok'"
sleep 1

# 输入 prompt
$B type "你的图片 prompt..."

# 按 Enter 发送
$B press Enter
```

### Step 4: 等待并提取图片

```bash
sleep 50  # 等待生图

# 检查是否生图成功
$B snapshot -i | grep 'AI 生成' || echo "NO_IMAGE"

# 提取最后一张 blob
$B js "
(function() {
  var imgs = Array.from(document.querySelectorAll('img')).filter(function(i){
    return i.naturalWidth>100 && i.src.startsWith('blob:');
  });
  var last = imgs[imgs.length-1];
  var c = document.createElement('canvas');
  c.width = last.naturalWidth; c.height = last.naturalHeight;
  c.getContext('2d').drawImage(last, 0, 0);
  return JSON.stringify({w:last.naturalWidth, h:last.naturalHeight, data:c.toDataURL('image/png')});
})()
" | python3 -c "
import json,sys,base64
d=json.loads(sys.stdin.read().strip())
b64=d['data'].split(',',1)[1]
with open('OUTPUT_PATH.png','wb') as f: f.write(base64.b64decode(b64))
print(f'Saved ({d[\"w\"]}x{d[\"h\"]})')
"
```

### Step 5: 清理

```bash
$B disconnect
```

## 技术原理

- Gemini Web API (`generate_content`) 对信息图 prompt 几乎 100% 拒生
- Gemini Web UI「制作图片」模式走不同后端，所有类型 prompt 都能生图
- 生成后图片以 `blob:` URL 存 DOM，通过 Canvas API 导出 PNG
- 每张约 25-50 秒，尺寸通常 1024x559

## 故障排查

| 问题 | 解决方案 |
|------|---------|
| 浏览器连不上 | `$B connect` 重新连接 |
| 未登录 | `bun <danger-gemini>/main.ts --login` 刷新 cookie 后重新注入 |
| ref 过期 | `$B snapshot -i` 获取最新 ref |
| 生图模式不激活 | 导航到 Gemini 主页 → 点「发起新对话」→ 重新点「制作图片」 |
| 图片不生成 | 等 60 秒，检查「答得好」按钮 |
| 提取的图片重复 | 只提取最后一个 blob：`imgs[imgs.length-1]` |
| prompt 含特殊字符 | bash 单引号包裹，内部双引号需转义 |
| JS 语法错误 (arrow fn) | 用 `function()` 替代 `()=>`，browse 的 JS 引擎不支持 ES6 |

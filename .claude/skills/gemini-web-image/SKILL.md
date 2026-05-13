---
name: gemini-web-image
description: |
  通过有头浏览器直接操作 Gemini Web UI 生成图片。当用户说 "用 gemini 生图"、"gemini web 配图"、"gemini 生成图片"、
  "danger-gemini 生图"、"Gemini 画图" 时触发。
  适用于 danger-gemini CLI 的 API 路径无法触发生图时，通过可视化浏览器直接操作 gemini.google.com 的「制作图片」模式。
  依赖 gstack browse 有头浏览器。
---

# Gemini Web 图片生成（浏览器操作版）

通过有头浏览器直接操作 gemini.google.com 的「制作图片」模式生成图片，
绕开 danger-gemini CLI 的 API 生图不稳定问题。

> **背景**：danger-gemini-web 的 CLI (`scripts/main.ts --prompt "..." --image out.png`) 通过
> Gemini Web API 请求生图时成功率极低（~10%），因为当前模型（gemini-3.0-pro/flash）的
> Imagen 管线不稳定。但通过有头浏览器直接点击 Gemini UI 的「制作图片」按钮，
> 成功率接近 100%。本技能封装了这套浏览器操作流程。

## 前置依赖

- gstack browse 已安装（`/home/fenghaolin/.claude/skills/gstack/browse/dist/browse`）
- Google 账号已登录 Chrome（browse 复用本机 Chrome cookie）
- bun 已安装

## 执行流程

### Step 1: 启动有头浏览器

```bash
B="/home/fenghaolin/.claude/skills/gstack/browse/dist/browse"

# 清理旧进程
kill $(cat "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json" 2>/dev/null | grep -o '"pid":[0-9]*' | grep -o '[0-9]*') 2>/dev/null || true
sleep 1
rm -f "$(git rev-parse --show-toplevel 2>/dev/null)/.gstack/browse.json" 2>/dev/null
rm -f "$HOME/.gstack/chromium-profile/SingletonLock" "$HOME/.gstack/chromium-profile/SingletonSocket" "$HOME/.gstack/chromium-profile/SingletonCookie" 2>/dev/null

# 连接有头浏览器
$B connect
```

### Step 2: 登录 Gemini

```bash
$B goto https://gemini.google.com
$B snapshot -i
```

检查 snapshot 输出：
- 如果看到 Google 登录页 → 需要导入 cookies 或手动登录
- 如果看到 Cookie 同意页 → `$B click @e5`（全部接受）
- 如果看到 Gemini 主页 → 已登录，继续

**Cookie 导入**（如果需要）：
```bash
$B cookie-import-browser Chrome --domain google.com
```

### Step 3: 进入「制作图片」模式

在 Gemini 主页上，点击「制作图片」按钮：

```bash
$B snapshot -i | grep '制作图片'
# 找到按钮 ref，例如 @e9
$B click @e9
```

验证模式激活：snapshot 中应出现「取消选择"制作图片"」按钮。

### Step 4: 输入提示词并生图

```bash
# 找到 textbox ref
TEXTBOX=$($B snapshot -i | grep -E '@e[0-9]+ \[textbox\]' | tail -1 | grep -oP '@e[0-9]+')

# 填入提示词
$B fill $TEXTBOX "你的图片描述..."

# 等 send 按钮激活后点击
sleep 2
SENDBTN=$($B snapshot -i | grep -E '@e[0-9]+ \[button\] "发送"' | tail -1 | grep -oP '@e[0-9]+')
$B click $SENDBTN

# 等待生图完成（通常 25-40 秒）
sleep 35
```

### Step 5: 提取图片

Gemini 生成的图片以 blob URL 存在页面 `<img>` 元素中。
用 JS 通过 `<canvas>` 转换为 data URL 再解码保存：

```bash
$B js "
(async () => {
  const imgs = Array.from(document.querySelectorAll('img')).filter(i => i.naturalWidth > 100);
  if (!imgs.length) return '[]';
  const results = [];
  for (let idx = 0; idx < imgs.length; idx++) {
    const img = imgs[idx];
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    results.push({index: idx, w: img.naturalWidth, h: img.naturalHeight, data: canvas.toDataURL('image/png')});
  }
  return JSON.stringify(results);
})()
" | python3 -c "
import json, sys, base64
data = json.loads(sys.stdin.read().strip())
# 保存所有图片，按索引命名
for d in data:
    idx = d['index']
    b64 = d['data'].split(',',1)[1]
    with open(f'output-{idx:02d}.png', 'wb') as f:
        f.write(base64.b64decode(b64))
    print(f'Saved output-{idx:02d}.png ({len(b64)} bytes b64)')
"
```

### Step 6: 批量生图

生成多张图片时，每张之间需要间隔。在同一对话中连续发 prompt：

```bash
for i in 1 2 3; do
  TEXTBOX=$($B snapshot -i | grep -E '@e[0-9]+ \[textbox\]' | tail -1 | grep -oP '@e[0-9]+')
  SENDBTN=$($B snapshot -i | grep -E '@e[0-9]+ \[button\] "发送"' | tail -1 | grep -oP '@e[0-9]+')
  
  $B fill $TEXTBOX "$PROMPT_$i"
  sleep 2
  $B click $SENDBTN
  sleep 35  # 等待生图
  echo "Image $i done"
done

# 最后一次性提取所有图片
$B js "..." | python3 -c "..."
```

### Step 7: 关闭浏览器

```bash
$B disconnect
```

## 提示词技巧

Gemini Imagen 是通用图像模型（非信息图专用），对以下类型 prompt 生图率高：

| ✅ 高成功率 | ❌ 低成功率 |
|------------|------------|
| 摄影/绘画风格描述 | 结构化图表（timeline/diagram） |
| 抽象几何构图 | 矩阵表格 |
| 场景/氛围描述 | 中文文字标注 |
| 简洁、视觉化语言 | 多层级复杂指令 |
| 纯英文 prompt | 含「ZONES」「LABELS」「COLORS」等结构化标签 |

**推荐 prompt 模式**：
```
A [adjective] [subject] in [style], [lighting], [mood], [composition details]
```
例如：`"A friendly sleek white robot face with soft blue glowing eyes, against a deep navy gradient background, futuristic but warm design"`

## 技术原理

- Gemini Web API 的 Imagen 管线通过 `generate_content` API 触发不可靠，模型常返回空 images[]
- 但 Gemini Web UI 的「制作图片」模式走的是不同的后端路径，成功率稳定
- 生成后的图片以 `blob:` URL 存在于 DOM，可直接通过 Canvas API 导出
- 每次生图大约 25-40 秒，图片尺寸通常为 1024x559 或其他 16:9 变体

## 故障排查

| 问题 | 解决方案 |
|------|---------|
| 浏览器连不上 | `$B connect` 重新连接 |
| 未登录 | `$B cookie-import-browser Chrome --domain google.com` |
| ref 过期 | `$B snapshot -i` 获取最新 ref |
| 图片一直不生成 | 等 60 秒，检查是否有「答得好/答得不好」按钮出现 |
| 提取的图片重复 | 生图未完成就提取了，等久一点 |

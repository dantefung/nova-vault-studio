---
title: "pmaker.space 行为地图"
date: "2026-08-21"
source: "复刻自 https://pmaker.space/"
url: ""
---

# pmaker.space 行为地图

所有组件的可见行为必须被实现，不能只看截图。

---

## TopBar

### 静态
- `position: sticky; top: 0; z-index: 50`
- `background: rgba(255,255,255,.88); backdrop-filter: saturate(1.6) blur(12px)`
- 高度 60px
- 内边距 `0 40px`（移动端 22px）

### 元素
1. **Logo（左）**：`<img src="logo.png" height="22px">`，链接到 `#top`
2. **Wordmark**：`display: flex; align-items: center`
3. **TopNav**（中）：`display: none`（首页隐藏，仅在详情页显示）
4. **Language Toggle**（右）：中 | EN 切换
   - 容器 1px border + 999px radius + #faf9fb 背景
   - 选项按钮 30×24px, padding 0 7px
   - 选中态：白底 + 阴影 `0 1px 3px rgba(20,18,30,.1)`
   - 字体 12px, font-weight 600, letter-spacing 0.02em
5. **Creator Profile**（最右）：`<details>` 元素
   - 触发器：头像 + 名字 + chevron，44px 最小高度
   - 头像 40×40px?（实际 class `.creator-profile__avatar`）
   - 名字 14px font-weight 600
   - panel 默认 286px 宽
   - 动画：opacity 0→1 + translateY(-5px)→0, 0.16s ease

### 移动端（≤860px）
- 创作者卡名字 + chevron 隐藏
- panel 宽度 `min(286px, calc(100vw - 32px))`
- 仅头像可见

---

## Hero

### 静态
- `max-width: var(--page)` (1640px)
- `padding: 72px 40px 56px`
- `display: grid; grid-template-columns: minmax(0, 1fr) 620px`
- `gap: 48px; align-items: center`

### 左侧文字
- `h1`：font-family serif, 36px, weight 400, line-height 1.5, letter-spacing 0.01em
- `kicker`：serif, 19px, color ink-soft, gap 14px
- `lead`：17px, line-height 1.9, color ink-mid, max-width 34em

### 右侧 SVG 动画
- viewBox 500×250
- 5 类元素：st1/st2/st3 (文字) + ar1/ar2 (箭头) + pin (进度)
- 7.5s 循环，cubic-bezier(.22, .68, .3, 1) 缓动
- 各元素通过 `--d` CSS 变量错开延迟
- 三个面板：构想 → 设计 → 实现
- 11 秒一轮；每阶段约 2.5s；每阶段内 1s 错落
- 进度点 pin 7s→20% 在第 1 段，26%→41% 第 2 段，48%→90% 第 3 段
- `flow` 虚线持续 1s linear 动画
- `prefers-reduced-motion: reduce` 时全部关掉

### 响应式
- ≤1080px：grid 改 1fr, gap 40px, text-align center
- hero h1 max-width: none
- hero__art 最大 560px

---

## CatNav

### 静态
- `position: sticky; top: 96px`（顶栏 60px + 36px gap）
- `display: flex; flex-direction: column; gap: 14px`
- 内边距：40px top

### 元素
- 2 个分组（学 AI / 做产品）
- 分组标题：12px, font-weight 700, letter-spacing 0.12em, uppercase
- 分组下划线：flex-grow + 1px + `--rule-soft`
- 14 个链接：font-size 15px, color ink-faint
- 每个链接前 18×18 SVG 描边图标
- hover: color ink-mid
- .is-active: color ink, font-weight 600

### 移动端
- ≤860px: `display: none`

### 行为
- scrollspy：滚动到对应分类时切 .is-active
- 实际是 `[data-scrollspy]` 属性，需要 JS IntersectionObserver

---

## Deck (板块)

### 静态
- `deck__head`：padding 44px 0 0 44px；首个 deck 40px
- `deck__name`：26px, font-weight 700, letter-spacing -0.01em
- `deck__desc`：15.5px, line-height 1.7, color ink-soft, max-width 60ch

### 移动端
- ≤860px: deck__name 22px, padding-left 0

---

## Cat (章节)

### 静态
- `padding: 40px 0 44px 44px`
- `border-bottom: 1px solid var(--rule-soft)`（最后一个 cat 不要）
- `cat__head`：margin-bottom 26px
- `cat__name`：19px font-weight 600
- `cat__desc`：15px color ink-soft

### 渐变
- 每个 .cat 用 `--g-{id}` 渐变
- 该 cat 内的 `.cards` 容器继承 `--g` 给 .card__art 用

### 移动端
- ≤860px: padding-left 0, border-left 0

---

## Card (卡片)

### 静态
- `position: relative; display: block`
- 8px padding + 1px border + 12px radius
- 背景白
- 过渡：`border-color .16s, transform .16s, box-shadow .16s`

### 结构
- `.card__art`: 300px 高, 12px 10px padding, 9px radius, 渐变背景
- `.card__no`: 右上角，top 20px right 24px, serif 13.5px, color rgba(22,21,26,.3)
- `.card__body`: padding 22px 22px 20px
  - `.card__name`: 19px font-weight 700
  - `.card__desc`: 16px line-height 1.65, color ink-mid
- `.card__demo`: 左下角徽章（仅可交互卡片）
  - 11.5px font-weight 600
  - 边距 3px 9px 3px 7px
  - border + 999px radius + 半透明白底
  - backdrop-filter: blur(3px)
  - ::before 三角形

### 头图
- `card__art` 内 `<svg>`：调用 covers.js 的模板
- viewBox 240×132
- 描边 + 淡填充（R,P,F,T,rows,page 工具函数）
- 配色由 cat 渐变负责

### Hover
- border-color: `#cfcdd4`
- transform: translateY(-2px)
- box-shadow: `0 8px 24px rgba(20,18,30,.07)`

### 移动端
- ≤1080px & ≤860px: grid 1fr, card__art 250px

### Soon 状态
- `border-style: dashed`
- `opacity: .68` 给 art
- `.card__name` color ink-mid, font-weight 600
- hover 无效果

---

## Step (阶段小标题)

### 静态
- `display: flex; align-items: baseline; gap: 12px`
- `margin: 30px 0 14px`
- `.step__chip`：12×12 圆点, bg gc (分类色), flex none
- `.step__n`：serif 14px, color ink-faint, min-width 14px
- `.step__t`：14px font-weight 600, color ink-mid, letter-spacing 0.04em
- `.step__d`：13.5px color ink-faint
- `.step__rule`：flex 1, 1px height, bg rule-soft

---

## Foot

### 静态
- `border-top: 1px solid var(--rule-soft)`
- padding 34px 40px 60px
- font-size 14px, color ink-faint
- max-width var(--page)
- `display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap`

---

## 整体响应式

| 断点 | 行为 |
|------|------|
| ≤1080px | cards 1 列；hero 1 列居中 |
| ≤860px | body 16px；创作者名字隐藏；catnav 隐藏；deck__name 22px |
| 移动端 padding | 22px（顶栏/索引/页脚一致） |

---

## 关键 CSS 变量 (foundation)

```css
:root {
  --ink:        #16151a;
  --ink-mid:    #3a3843;
  --ink-soft:   #6a6774;
  --ink-faint:  #97949e;
  --rule:       #e6e4e9;
  --rule-soft:  #f0eef2;
  --paper:      #ffffff;
  --wash:       #faf9fb;
  --accent:     #6b5cd6;
  --band:       #f4f3f1;

  --bad:        #c8503f;
  --bad-wash:   #fdf1ef;
  --good:       #2f7a5a;
  --good-wash:  #eef7f2;

  --serif: "Songti SC", "Noto Serif SC", "Source Han Serif SC", Georgia, "Times New Roman", serif;
  --sans:  -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --mono:  "SF Mono", ui-monospace, Menlo, Consolas, monospace;

  --col:   720px;
  --page:  1640px;
  --nav-w: 160px;
}
```

---

## 必须实现的 JS 行为

1. **scrollspy**：滚到 .cat 时给对应的 .catnav a 加 .is-active
2. **language toggle**：中/EN 切换（mock 即可）
3. **creator profile hover**：CSS 已实现，:hover + details[open]
4. **hero animation**：纯 CSS，`prefers-reduced-motion` 关闭
5. **card hover**：纯 CSS

---

## 不要实现的事

- EN 版的真实内容（mock 链接即可）
- 详情页（先只做首页）
- 真正的话题封面 SVG（先用占位）
- 实际卡片点击跳转到具体文章（href 用 # 即可）

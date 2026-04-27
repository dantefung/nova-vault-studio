# 落地页风格系统

System Vault 首页支持 **8 种落地页风格** 切换，用户可以在页面导航栏右侧的「风格」下拉菜单中实时切换，无需刷新页面，风格偏好自动保存。

> 本落地页系统使用 [Huashu-Design](https://github.com/alchaincyf/huashu-design) skill 设计生成。

## 设计理念

8 种风格来自 5 个不同设计流派，确保视觉差异化：

| 流派 | 风格 | 特点 |
|------|------|------|
| 极简主义 | 晴空 / 静界 | 克制留白、秩序感 |
| 叙事设计 | 杂志 / 暖域 | 强对比、杂志排版 |
| 技术美学 | 极客 | 终端感、代码风格 |
| 东方哲学 | 诗卷 | 竖排、纸卷、水墨 |
| 现代实用 | 卡片 / 暗魄 | 信息密度、导航导向 |

## 八种风格

### 1. 晴空 · 极简学术（Clear）

**默认风格**。白底大字衬线标题，橄榄绿品牌色点缀，克制留白，学术感。

```
背景: #ffffff
标题: #3c3c43
品牌色: #3451b2
字号: clamp(48px, 8vw, 80px)
字体: 系统衬线
```

适用场景：文档导航、日常查阅、最通用选择。

---

### 2. 杂志 · 大写叙事（Magazine）

深棕黑底配暖橙装饰色，粗体无衬线全大写标题，不对称几何色块。

```
背景: #1a1814
标题: #f5f0e8（暖白）
装饰色: #9b7653（琥珀橙）
字号: clamp(64px, 10vw, 120px)
```

适用场景：个人品牌展示、技术博客首页。

---

### 3. 极客 · 代码美学（Tech）

深灰底 `#0d1117` 模拟 GitHub Dark，终端窗口设计带光标闪烁动画。

```
背景: #0d1117
文字: #c9d1d9
强调: #3fb950（终端绿）
字体: SF Mono / Fira Code
特效: 光标闪烁动画
```

适用场景：开发者工具、命令行风格产品、技术文档首页。

---

### 4. 诗卷 · 东方诗意（Poetry）

暖米纸底 `#f5f0e8`，竖排繁体标题，水墨绿色点缀，古典阅读氛围。

```
背景: #f5f0e8（暖米纸）
标题: 竖排 #3a3328
品牌色: #2d6a4f（水墨绿）
排版: writing-mode: vertical-rl
```

适用场景：个人品牌、文学创作、东方审美站点。

---

### 5. 卡片 · 现代导航（Cards）

多彩图标卡片网格，清晰信息架构，适合内容导航导向。

```
背景: #fafafa
卡片: 白色 + 1px 边框
图标背景: 各色柔和背景
圆角: 12px
字体: 系统无衬线
```

适用场景：多内容分类导航（SaaS Dashboard、产品功能展示）。

---

### 6. 暗魄 · 粗野主义（Brutalist）

纯黑底 `#0a0a0a` 高对比，红色几何块 `#e63946`，激进无衬线全大写。

```
背景: #0a0a0a
主色: #e63946（激进红）
文字: #f5f5f5
边框: 2px solid #333
字号: clamp(56px, 9vw, 112px)
```

适用场景：创意工作室、个人 Portfolio、艺术类站点。

---

### 7. 暖域 · 杂志编辑（Editorial）

暖灰纸底 `#faf7f4`，杂志大图占位，橙调 `#d4a373` 点缀，期刊感排版。

```
背景: #faf7f4
装饰色: #d4a373（暖橙）
正文色: #6b5f4e
排版: 杂志两栏布局
```

适用场景：内容出版、Newsletter、个人杂志。

---

### 8. 静界 · 极简禅意（Zen）

纯白极简 `#fafafa`，超大留白，极细分隔线，单色系，禅意留白。

```
背景: #fafafa
文字: #1a1a1a
分隔线: 1px #e0e0e0
字重: 200（极细）
字间距: 0.15em
```

适用场景：高端品牌、艺术作品集、极简主义站点。

---

## 技术实现

### 文件结构

```
docs/.vitepress/theme/
├── layouts/
│   └── HomeLayout.vue           # 落地页 Layout（含 8 种风格）
├── index.js                      # 主题入口，根据路由分发 Layout
└── MyLayout.vue                  # 文档页 Layout（非落地页路由）
```

### 架构设计

```
VitePress 路由
├── /, /v2/, /v3/, /v4/, /v5/  → HomeLayout.vue（落地页）
└── /md/*                       → MyLayout.vue（文档页）

HomeLayout.vue 内部：
├── 导航栏 + 风格下拉
├── 8 个 <section v-if="landingStyle === 'xxx'">
└── 风格 CSS（scoped 在 .vp-landing.style-{name} 下）
```

### 风格切换逻辑

```javascript
// HomeLayout.vue
const STYLES = [
  { key: 'clear',    name: '晴空', desc: '极简学术风', color: '#3451b2' },
  { key: 'magazine', name: '杂志', desc: '大写叙事风', color: '#9b7653' },
  { key: 'tech',     name: '极客', desc: '代码美学风', color: '#3fb950' },
  { key: 'poetry',   name: '诗卷', desc: '东方诗意风', color: '#2d6a4f' },
  { key: 'cards',    name: '卡片', desc: '现代导航风', color: '#e65100' },
  { key: 'brutal',   name: '暗魄', desc: '粗野几何风', color: '#e63946' },
  { key: 'editorial',name: '暖域', desc: '杂志编辑风', color: '#d4a373' },
  { key: 'zen',      name: '静界', desc: '极简禅意风', color: '#adb5bd' },
]

// localStorage 持久化
onMounted(() => {
  const saved = localStorage.getItem('vp-landing-style')
  if (saved && STYLES.some(s => s.key === saved)) {
    landingStyle.value = saved
  }
})
```

### CSS 隔离

每种风格使用独立的 CSS 类隔离：

```css
/* 晴空风格 */
.vp-landing.style-clear { background: var(--vp-c-bg); }

/* 极客风格 */
.vp-landing.style-tech { background: #0d1117; }

/* 诗卷风格 */
.vp-landing.style-poetry { background: #f5f0e8; }

/* ... 其他风格 */
```

### 多路由支持

VitePress 支持通过创建多目录实现独立路由：

```
docs/
├── index.md        → /
├── v2/index.md     → /v2/
├── v3/index.md     → /v3/
├── v4/index.md     → /v4/
└── v5/index.md     → /v5/
```

当前版本使用同一 Layout 内切换视觉风格，不再需要多路由。

## 扩展主题

如需添加新风格，只需：

1. 在 `STYLES` 数组中追加配置项
2. 在模板中添加 `<section v-else-if="landingStyle === '新key'">`
3. 在 `<style>` 中添加 `.vp-landing.style-{新key} {}` 样式块

## 致谢

> System Vault 的落地页风格系统由 [Huashu-Design](https://github.com/alchaincyf/huashu-design) skill 设计生成。
>
> Huashu-Design 是一个基于 HTML 的设计技能，帮助快速生成高保真交互原型、设计变体探索、动画演示等多种视觉产出。

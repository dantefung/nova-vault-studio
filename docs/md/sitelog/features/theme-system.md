# 主题切换系统

System Vault 支持多主题切换，默认提供三种精心设计的主题风格，用户可以在页面右上角的主题切换器中自由选择，选择结果自动保存（刷新不丢失）。

## 设计理念

主题系统遵循以下原则：

- **实用优先**：三种主题覆盖最常见的阅读场景，无需更多选择造成认知负担
- **视觉差异化**：每种主题不仅是颜色变化，而是整体视觉氛围的转变
- **零破坏性**：所有主题均完全兼容现有功能（搜索、侧边栏、Giscus 评论等）

## 三种主题

### 晴空（Light）—— 默认主题

继承 VitePress 原生亮色设计，干净明亮的阅读界面，适合大多数场景。

| 属性 | 值 |
|------|-----|
| 背景色 | `#ffffff` |
| 主文本 | `#3c3c43` |
| 品牌色 | `#3451b2`（靛蓝）|
| 适用场景 | 白天户外、办公环境 |

### 暗夜（Dark）

VitePress 原生暗色主题，低对比度设计保护视力，适合夜间阅读。

| 属性 | 值 |
|------|-----|
| 背景色 | `#1b1b1f` |
| 主文本 | `#dfdfd6` |
| 品牌色 | `#3e63dd`（深蓝）|
| 适用场景 | 夜间阅读、低光环境 |

### 纸卷（Sepia）—— 护眼阅读

暖米白背景配橄榄绿品牌色，灵感来自古典书籍排版。降低蓝光，长时间阅读不易疲劳。

| 属性 | 值 |
|------|-----|
| 背景色 | `#f5f0e8`（暖米白）|
| 主文本 | `#3a3328`（暖棕黑）|
| 品牌色 | `#2d6a4f`（橄榄绿）|
| 适用场景 | 长时间阅读、护眼需求 |

## 技术实现

### 文件结构

```
docs/.vitepress/theme/
├── themes.css                    # 主题 CSS 变量定义
├── composables/
│   └── useTheme.js               # 主题状态管理 + localStorage 持久化
└── components/
    └── ThemeSwitcher.vue         # 主题切换 UI 组件（下拉菜单）
```

### CSS 变量架构

VitePress 使用 `--vp-*` 前缀的 CSS 变量控制所有颜色。主题系统通过覆盖这些变量实现主题切换：

```css
/* themes.css */
[data-theme="sepia"] {
  --vp-c-bg: #f5f0e8;
  --vp-c-bg-alt: #ebe6da;
  --vp-c-text-1: #3a3328;
  --vp-c-brand-1: #2d6a4f;
  /* ... 更多变量 */
}
```

`light` 和 `dark` 主题直接复用 VitePress 原生变量，无需额外定义。

### 状态管理

```javascript
// useTheme.js
const STORAGE_KEY = 'vp-theme'
const THEMES = ['light', 'dark', 'sepia']

function setTheme(name) {
  currentTheme.value = name
  localStorage.setItem(STORAGE_KEY, name)
  // 应用到 DOM: document.documentElement.dataset.theme = name
  // 暗色模式: document.documentElement.classList.toggle('dark', name === 'dark')
}
```

### 防闪烁策略（SSR 友好）

在 `config.js` 的 `head` 中注入同步脚本，页面加载前即设置正确主题：

```javascript
head: [
  ['script', {}, `
    (function() {
      var t = localStorage.getItem('vp-theme');
      if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = t;
      if (t === 'dark') document.documentElement.classList.add('dark');
    })()
  `]
]
```

### Giscus 评论联动

主题切换时自动更新 Giscus 评论主题：

```javascript
const giscusThemeMap = {
  light: 'light',
  dark: 'dark_dimmed',
  sepia: 'light'  // 纸卷用浅色主题更协调
}
```

## 设计工具

> 本主题系统使用 [Huashu-Design](https://github.com/alchaincyf/huashu-design) skill 设计生成。Huashu-Design 是一个基于 HTML 的设计技能，支持交互原型、设计变体探索、动画演示等多种视觉产出场景。

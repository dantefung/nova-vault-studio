---
title: "Cubxxw.com 设计规格"
date: "2026-08-21"
---

# cubxxw.com 设计风格规格

## 目标
将 Nova Vault Studio 站点全面克隆 cubxxw.com/zh/ 的设计风格。

---

## 1. 颜色系统

### 核心调色板
| 变量 | 值 | 用途 |
|------|-----|------|
| `--color-paper` | `#fbf9f4` | 页面背景（暖纸张色） |
| `--color-text` | `#350003` | 主文字（深墨红黑） |
| `--color-text-muted` | `#6c5b4e` | 次要文字 |
| `--color-text-heading` | `#350003` | 标题文字 |
| `--color-accent` | `#862122` | 强调色（深红） |
| `--color-accent-soft` | `#eae8e3` | 强调色浅背景 |
| `--color-border` | `rgba(53, 0, 3, 0.10)` | 边框 |
| `--color-rule` | `rgba(53, 0, 3, 0.10)` | 分割线 |
| `--color-primary` | `#0e7490` | 主要操作色（青色） |
| `--color-primary-hover` | `#0c5e75` | 主要操作悬停 |
| `--entry` | `rgb(255, 255, 255)` | 卡片背景 |
| `--primary` | `rgb(30, 30, 30)` | 主色 |
| `--secondary` | `rgb(108, 108, 108)` | 次色 |

### 间距系统
| 变量 | 值 |
|------|-----|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |

### 圆角
| 变量 | 值 |
|------|-----|
| `--radius-sm` | 4px |
| `--radius` | 8px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |

### 阴影
| 变量 | 值 |
|------|-----|
| `--shadow-sm` | `0 1px 2px rgba(15, 23, 42, 0.04)` |
| `--shadow-md` | `0 4px 16px rgba(15, 23, 42, 0.06)` |
| `--shadow-lg` | `0 12px 32px rgba(15, 23, 42, 0.08)` |

---

## 2. 字体系统

### Google Fonts
- **Space Grotesk**: 标题/展示字体 (500, 600, 700)
- **Inter**: UI 元素 (400, 500, 600, 700)
- **Noto Serif**: 英文正文衬线
- **Fraunces**: 装饰性标题 (italics support)
- **JetBrains Mono**: 代码

### 中文字体
- **Noto Serif SC**: 中文衬线正文
- **PingFang SC / Hiragino Sans GB / Microsoft YaHei**: 中文无衬线 UI

### 字体变量
```css
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-prose: 'Source Han Serif SC', 'Noto Serif SC', serif;
--font-body: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

---

## 3. 布局规格

### 内容宽度
- 主内容区最大宽度：720px（居中）
- 导航宽度：1024px
- 行高：prose 内容 2.0

### 断点
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: >= 1024px

---

## 4. 组件规格

### Header/导航
- 高度：53px
- 背景：透明/半透明
- Logo：站点名称 "cubxxw"
- 语言切换：EN / 中
- 固定定位，滚动时可能有背景变化

### Hero 区域
- 大字号标题（Space Grotesk, 700, ~35px）
- 副标题/描述（serif font）
- 分隔线装饰
- 大段白色空间

### 内容区域
- 窄栏布局（max-width: 720px）
- 大行高（1.8-2.0）
- 段落间有适当间距
- 引用块用左边框装饰

### 卡片
- 白色背景
- 微妙阴影
- 圆角 8-12px
- hover 时有微妙动效

### 标签/分类
- 小字号，大写或追踪加宽
- 浅色背景 pill 样式

---

## 5. 动效

### 过渡
- 标准过渡：`cubic-bezier(0.22, 1, 0.36, 1)`, 280ms
- 弹簧效果：`cubic-bezier(0.34, 1.56, 0.64, 1)`
- 淡入：560ms

### 滚动
- IntersectionObserver 驱动的渐显动画
- 平滑滚动

---

## 6. Dark Mode

- 背景：深色纸色（非纯黑）
- 文字：浅色
- 保持相同的色调关系

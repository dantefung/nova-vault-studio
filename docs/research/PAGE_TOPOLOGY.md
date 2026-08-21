---
title: "pmaker.space 页面拓扑"
date: "2026-08-21"
source: "复刻自 https://pmaker.space/"
url: ""
---

# pmaker.space 页面拓扑

**目标 URL**：https://pmaker.space/

**页面类型**：单页静态文档导航站（学习 + 实践索引）

**整体策略**：mock 视觉壳 + 真实但改写的中文内容（数据源：docs/md/）

---

## 1. 顶层布局（一列纵向流）

```
┌─────────────────────────────────────────────┐
│ TopBar (sticky, 60px, backdrop blur)        │  ← 顶栏
├─────────────────────────────────────────────┤
│ Hero (grid 1fr 620px, 72px 顶 padding)      │  ← Hero 区
│  ├─ Left: 大标题 + 副标题 + 引导文案         │
│  └─ Right: SVG 动画（构想→设计→实现）         │
├─────────────────────────────────────────────┤
│ Index (grid 160px 1fr, 上下 padding 0 120px) │  ← 索引区
│  ├─ Left: CatNav (sticky top 96px)          │  ← 左侧分类导航
│  │   ├─ 学 AI（6 项）                        │
│  │   └─ 做产品（8 项）                       │
│  └─ Right: Cats (border-left, 44px padding) │
│      ├─ Deck 1: 学 AI                       │
│      │   ├─ ai-basics · 基础认知（3 卡）      │
│      │   ├─ ai-model · 大模型（4 段×3-4卡）  │
│      │   ├─ ai-prompt · 提示词工程（3 段）    │
│      │   ├─ ai-context · 上下文与 RAG（3 段） │
│      │   ├─ ai-agent · Agent 与 Skill（3 段） │
│      │   └─ ai-cost · 成本与安全（3 段）      │
│      └─ Deck 2: 做产品                       │
│          ├─ basics · 基础（3 段）             │
│          ├─ faxian · 发现问题（3 段）          │
│          ├─ dingyi · 定义产品（3 段）          │
│          ├─ jiegou · 设计结构（3 段）          │
│          ├─ jiaohu · 设计交互（3 段）          │
│          ├─ jiemian · 设计界面（3 段）         │
│          ├─ xiezuo · 与 AI 协作（3 段）        │
│          └─ yanzheng · 验证与迭代（3 段）       │
├─────────────────────────────────────────────┤
│ Foot (border-top, 34px padding)             │  ← 页脚
└─────────────────────────────────────────────┘
```

---

## 2. 组件清单（14 个 .cat × 平均 10 卡 = 145 卡）

| 组件 | 数量 | 复杂度 | 备注 |
|------|------|--------|------|
| TopBar | 1 | 中 | sticky/语言切换/创作者卡 |
| Hero | 1 | 高 | 7.5s SVG 动画（5 关键帧） |
| CatNav | 1 | 中 | 14 链接 + 2 分组 + scrollspy |
| DeckHead | 2 | 低 | 标题 + 描述 |
| CatHead | 14 | 低 | 标题 + 描述 |
| Card | 145 | 中 | 8px padding + 头图 + 编号 + 标题 |
| StepHead | 26 | 低 | 圆点 + 编号 + 阶段描述 |
| Foot | 1 | 低 | 简单链接 |

---

## 3. 数据结构

```typescript
type Card = {
  no: string          // "01", "02"...（显示在卡片右上角）
  name: string        // 卡片标题
  desc: string        // 卡片描述（中文）
  shot?: string       // 数据-shot 属性，对应 covers.js 的 SVG 模板
  href?: string       // 链接到 docs/md/ 的真实文章
  demo?: boolean      // 是否可交互（card__demo 徽章）
  soon?: boolean      // 是否 dashed 边框的待写卡片
}

type Row = {
  no: string          // "1", "2", "3" 阶段编号
  title: string       // 阶段标题
  desc: string        // 阶段描述
  cards: Card[]       // 该阶段的卡片
}

type Cat = {
  id: string          // "ai-basics", "jiemian" 等
  name: string        // "基础认知"
  desc: string        // 章节描述
  icon: string        // SVG 描边图标（每个分类一个）
  gradient: string    // CSS 变量 --g-xxx
  rows: Row[]         // 多个阶段
}

type Deck = {
  name: string        // "学 AI" / "做产品"
  desc: string        // 板块描述
  cats: Cat[]
}
```

---

## 4. 已知 14 个分类的渐变编号

```typescript
const GRADIENTS = {
  'ai-basics':  { gc: '#a7ded8', g: 'radial-gradient(120% 130% at 6% 0%, #a7ded8 0%, #d9f1ee 38%, #f7fdfc 100%)' },
  'ai-model':   { gc: '#7fd1d8', g: 'radial-gradient(120% 130% at 6% 0%, #7fd1d8 0%, #cfeef1 38%, #f5fdfd 100%)' },
  'ai-prompt':  { gc: '#86cbe6', g: 'radial-gradient(120% 130% at 6% 0%, #86cbe6 0%, #d1e9f4 38%, #f6fcfe 100%)' },
  'ai-context': { gc: '#93c5f0', g: 'radial-gradient(120% 130% at 6% 0%, #93c5f0 0%, #d3e6f9 38%, #f7fbff 100%)' },
  'ai-agent':   { gc: '#a9b0ee', g: 'radial-gradient(120% 130% at 6% 0%, #a9b0ee 0%, #dcdff8 38%, #f9f9ff 100%)' },
  'ai-cost':    { gc: '#e2b0d8', g: 'radial-gradient(120% 130% at 6% 0%, #e2b0d8 0%, #f3dcee 38%, #fdf8fc 100%)' },
  'basics':     { gc: '#f8d98a', g: 'radial-gradient(120% 130% at 6% 0%, #f8d98a 0%, #fdedc4 38%, #fffdf6 100%)' },
  'faxian':     { gc: '#a9d8e6', g: 'radial-gradient(120% 130% at 6% 0%, #a9d8e6 0%, #daeef4 38%, #f7fdfe 100%)' },
  'dingyi':     { gc: '#f6c9a0', g: 'radial-gradient(120% 130% at 6% 0%, #f6c9a0 0%, #fbe4cf 38%, #fffaf6 100%)' },
  'jiegou':     { gc: '#b9c8ee', g: 'radial-gradient(120% 130% at 6% 0%, #b9c8ee 0%, #dee5f7 38%, #f8faff 100%)' },
  'jiaohu':     { gc: '#cdbce9', g: 'radial-gradient(120% 130% at 6% 0%, #cdbce9 0%, #e6dcf5 38%, #fbf9ff 100%)' },
  'jiemian':    { gc: '#f2b8c0', g: 'radial-gradient(120% 130% at 6% 0%, #f2b8c0 0%, #fadde1 38%, #fff9fa 100%)' },
  'xiezuo':     { gc: '#a5d8c6', g: 'radial-gradient(120% 130% at 6% 0%, #a5d8c6 0%, #d7ede4 38%, #f7fdfb 100%)' },
  'yanzheng':   { gc: '#c6d9a3', g: 'radial-gradient(120% 130% at 6% 0%, #c6d9a3 0%, #e4eecd 38%, #fbfdf4 100%)' },
};
```

---

## 5. 关键交互点

| 交互 | 位置 | 触发 | 效果 |
|------|------|------|------|
| 卡片 hover | 全局 | 鼠标悬停 | 抬升 -2px + 阴影 + 边框变深 |
| CatNav 高亮 | 左侧 | scroll | IntersectionObserver 切换 .is-active |
| 创作者卡 | 顶栏 | hover | 下拉卡片出现 |
| 语言切换 | 顶栏 | click | 中/EN 切换（hover 不切） |
| Hero 动画 | Hero | 自动 | 7.5s 循环 |
| Card demo 徽章 | 卡片 | hover | 颜色变深 |

---

## 6. 响应式断点

| 断点 | 行为 |
|------|------|
| 1080px↓ | cards 1 列；hero 改为 1 列（文字居中） |
| 1180px↓ | 详情页 secnav 隐藏（首页无关） |
| 860px↓ | 字号缩小；所有 nav 隐藏；cards 1 列；hero font-size 34px |

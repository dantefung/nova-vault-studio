---
title: "Auto-PPT — 用 React 代码制作 PPT 的 Harness"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/Ame-X/Auto-PPT"
---

# Auto-PPT — 用 React 代码制作 PPT 的 Harness

> One repo, many slide decks. 每个 PPT 是一个文件夹的 React 组件。用编辑 `.tsx` 文件的方式做 PPT，让 Coding Agent 替你写。

<!-- more -->

## 产品定位

Auto-PPT 是一个 **Harness**（而非传统 PPT 工具）。它的核心思路是：**把"做 PPT"翻译成"编辑 React 代码"**。

每个 PPT 是一个文件夹 `slides/{ppt}/`，里面是 `.tsx` 幻灯片文件 + `deck.config.ts` 配置。把仓库交给 Coding Agent，告诉它你想要什么，它来写代码。

## 核心概念

### 一个仓库，多套 PPT

- `slides/{ppt}/<kebab-title>.tsx` — 一个文件 = 一张幻灯片
- `slides/{ppt}/deck.config.ts` — 该 PPT 的顺序配置（注释某行 = 隐藏该幻灯片）
- `src/lib/router.ts` — 基于 slug 的路由（`/`、`/{ppt}`、`/{ppt}/{slug}`）
- `src/lib/slide-kit.tsx` — `SlideFrame` + 少量布局原语
- `scripts/ppt.ts` — headless CLI（`pnpm ppt text | list | new | new-deck`）

### 两套反馈循环

| 循环 | 工具 | 用途 |
|------|------|------|
| Content loop | `pnpm ppt text [ppt]` | 文字、顺序、bullet、rationale |
| Layout loop | 浏览器打开 `/{ppt}/{slug}` | 字体大小、间距、溢出、视觉问题 |

**不要混用**：改文案看 text 命令输出，改布局必须看截图。

### Annotated 三字段

每张幻灯片的文本必须放在 `text` 导出对象中，每个字段是一个 `Annotated<T>`：

```ts
type Annotated<T = string> = {
  content: T;        // 观众看到的文字
  summary: string;   // 一句话：这是什么东西
  rationale: string;  // 为什么用户要这个 + 为什么你这样写
};
```

`rationale` 是关键字段，不能编造。如果不知道用户意图，写 `TODO: ask user — <具体问题>`。

### 固定画布 1920×1080

幻灯片是固定 1920×1080 像素画布，不做响应式。用绝对像素思考：`text-[96px]`、`p-32` 等。

`Asset` 原语用于图片——当图片文件不存在时，渲染一个带尺寸 + description 的灰色占位框，而不是空白或报错。

## 命令行

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动 Vite dev server |
| `pnpm ppt text [ppt]` | 导出所有幻灯片的 `content/summary/rationale` |
| `pnpm ppt list [ppt]` | 列出 deck 顺序 + 隐藏幻灯片 |
| `pnpm ppt new <ppt> <kebab-title>` | 在已有 PPT 内新建幻灯片文件（不自动加入 deck） |
| `pnpm ppt new-deck <ppt> [Title]` | 搭建全新 PPT（文件夹 + deck.config.ts + starter cover） |

## 单幻灯片截图路由

```
http://localhost:5273/{ppt}/{slug}
```

渲染一张 1920×1080 幻灯片，无 chrome，适合 headless 截图工具（Playwright MCP 等）调用。

## 路由

| URL | 渲染内容 |
|-----|----------|
| `/` | 入口页面——每套可见 PPT 的卡片 |
| `/{ppt}` | 整套 PPT，每张幻灯片缩放适配 |
| `/{ppt}/{slug}` | 单张幻灯片，原生 1920×1080，**headless 截图路由** |

## 托管

SPA 模式，需要 history API fallback。`vercel.json` 将所有非 `/assets/` 路径重写到 `/index.html`。非 Vercel 宿主需要等效配置（Netlify: `_redirects`）。

## 数据

- **28 Stars** · **1 Fork**
- TypeScript 87.7% · JavaScript 11.7%
- 部署地址：[auto-ppt-two.vercel.app](https://auto-ppt-two.vercel.app)
- 线上 demo：每套 PPT 通过 `/{ppt}` 访问

## Scaffold vs. Slide Content

以下属于 scaffold 层面，修改前需告知用户：

- `scripts/ppt.ts`（CLI）
- `src/lib/ppt.ts`（Annotated + DeckMeta 类型）
- `src/lib/router.ts`
- `src/lib/slide-kit.tsx`
- `src/App.tsx`、`src/main.tsx`
- `SKILL.md`、`README.md`

PPT 自己的 `slides/{ppt}/deck.config.ts` 属于**内容层**，不是 scaffold，改动是正常流程的一部分。
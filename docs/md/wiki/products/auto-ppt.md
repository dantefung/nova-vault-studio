---
title: "Auto-PPT（React代码制作PPT）"
date: "2026-06-11"
---

# Auto-PPT（React代码制作PPT）

> One repo, many slide decks. 每个 PPT 是一个文件夹的 React 组件。用编辑 `.tsx` 文件的方式做 PPT，让 Coding Agent 替你写。

## Key Points

- **核心定位**：Auto-PPT 是一个 **Harness**（而非传统 PPT 工具），把"做 PPT"翻译成"编辑 React 代码"
- **每个 PPT 是一个文件夹** `slides/{ppt}/`，里面是 `.tsx` 幻灯片文件 + `deck.config.ts` 配置
- **两套反馈循环**：Content loop（`pnpm ppt text`） + Layout loop（浏览器截图）

## 核心概念

### 一个仓库，多套 PPT

- `slides/{ppt}/<kebab-title>.tsx` — 一个文件 = 一张幻灯片
- `slides/{ppt}/deck.config.ts` — 该 PPT 的顺序配置（注释某行 = 隐藏该幻灯片）
- `src/lib/router.ts` — 基于 slug 的路由
- `src/lib/slide-kit.tsx` — `SlideFrame` + 少量布局原语

### Annotated 三字段

每张幻灯片的文本必须放在 `text` 导出对象中，每个字段是一个 `Annotated<T>`：

```ts
type Annotated<T = string> = {
  content: T;        // 观众看到的文字
  summary: string;   // 一句话：这是什么东西
  rationale: string;  // 为什么用户要这个 + 为什么你这样写
};
```

## 命令行

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动 Vite dev server |
| `pnpm ppt text [ppt]` | 导出所有幻灯片的 `content/summary/rationale` |
| `pnpm ppt list [ppt]` | 列出 deck 顺序 + 隐藏幻灯片 |
| `pnpm ppt new <ppt> <kebab-title>` | 在已有 PPT 内新建幻灯片文件 |
| `pnpm ppt new-deck <ppt> [Title]` | 搭建全新 PPT |

## 单幻灯片截图路由

```
http://localhost:5273/{ppt}/{slug}
```

渲染一张 1920×1080 幻灯片，无 chrome，适合 headless 截图工具调用。

## 数据

- **28 Stars** · **1 Fork**
- TypeScript 87.7% · JavaScript 11.7%
- 部署地址：auto-ppt-two.vercel.app

## Related Pages

- [products/magic-slide](products/magic-slide) — HTML演示稿生成
- [patterns/presentation-design](patterns/presentation-design) — 演示设计模式

## Sources

- GitHub Ame-X/Auto-PPT (2026-06-04)
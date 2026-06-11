---
title: "Social Card Design（社媒封面图生成）"
date: "2026-06-11"
---

# Social Card Design（社媒封面图生成）

> Claude Code / Codex skill — generate Xiaohongshu carousels & WeChat 21:9+1:1 cover pairs. Editorial × Swiss visual systems, 28 layouts, 10 themes, single-file HTML → PNG.

## Key Points

- **双视觉系统**：Editorial（电子杂志风）+ Swiss（瑞士国际主义）
- **3 个画板尺寸**：`.poster.xhs` 1080×1440（小红书 3:4）、`.poster.wide` 2100×900（公众号 21:9）、`.poster.square` 1080×1080（公众号 1:1）
- **28 个版式骨架**：Editorial 16 个（M01-M16）+ Swiss 12 个（S01-S12）
- **10套主题预设**：Editorial 6 套 + Swiss 4 套锚点色（IKB 蓝/柠檬黄/柠檬绿/安全橙）

## 7 步工作流

1. **Intake** — 抓 4 件事：目标平台 / 风格 / 内容素材 / 用户图
2. **Style & Theme** — 选 Editorial 或 Swiss，从 10 套预设里选主题色（不允许自定义 hex）
3. **Layout Selection** — 从 28 个版式骨架里挑、粘、改文案
4. **Asset Prep** — 取图，落本地 + 写 `SOURCES.md`
5. **Compose & Render** — 拷种子模板 → 替换 `<!-- POSTERS_HERE -->` → `node render.mjs`
6. **Deliver & Review** — PNG 给用户看，默认不自动核查
7. **Iterate** — 改 inline 样式或 swap 版式 / 替图，重渲

## 11 个小红书品类适配

| 档位 | 品类 |
|------|------|
| **端到端强势** | 旅行、职场、推荐（指定子类后） |
| **文与结构强势，图依赖用户或搜图源** | 游戏、影视、美食、彩妆教程、健身、家居、穿搭 |
| **能力圈外（主动说清）** | OOTD 实拍流 / 梦核 / 仿胶片调色等 |

##核心设计原则

1. 克制优于喊话
2. 结构优于装饰
3. 版式优于自由
4. 越大越细
5. 默认不自动核查

## 安装

```bash
npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
```

## 数据

- **3k Stars** · **274 Forks** · **5 Commits**
- AGPL-3.0

## Related Pages

- [products/taste-skill](products/taste-skill) — AI前端防丑Skill
- [patterns/ui-polish](patterns/ui-polish) — UI精致打磨

## Sources

- GitHub op7418/guizang-social-card-skill (2026-06-04)
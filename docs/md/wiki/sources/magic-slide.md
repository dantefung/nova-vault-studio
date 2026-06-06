---
title: "Magic Slide — HTML 演示稿生成 Skill，平滑 Magic Move 转场（147 Stars）"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/daniel-style/magic-slide"
---

# Magic Slide — HTML 演示稿生成 Skill（147 Stars）

> A skill that generates polished self-contained HTML presentations with smooth Magic Move-style slide transitions. 给一段内容，直接生成 HTML 演示稿，带平滑转场和完整视觉系统。

<!-- more -->

## 核心能力

- **Magic Move 转场**：FLIP-based 动画，共享元素在幻灯片之间平滑过渡（glide/resize/fade/settle）
- **PipeLLM 图生**：按需生成演示资产（封面氛围、内容插图、产品视觉）
- **PipeLLM 网络搜索**：为演示稿获取最新事实、市场背景、产品详情
- **自包含 HTML 输出**：单文件包含 runtime、样式、幻灯片，可分享可存档

## 工作流

```
gather requirements → websearch（可选）→ outline → design brief
→ style.css + slide-XX.html → merge → inject runtime → preview → QA
```

1. **Gather requirements**：主题、视觉方向、语言、是否需要生图
2. **Web search**：需要新鲜信息时用 PipeLLM
3. **Outline**：清晰的受众、论点主轴、章节弧线、结尾
4. **Design brief**：产 CSS 或幻灯片前先写设计简报
5. **Generate**：生成 `style.css` 和各幻灯片片段
6. **Merge**：合并为 `index.html`
7. **Inject**：注入 Magic Move runtime 和编辑辅助
8. **Preview + QA**：截图核验，人工修订 `Revise slide` notes

## 文件结构

```
magic-slide-skill/
├── SKILL.md
├── scripts/
│   ├── merge-slides.py
│   ├── generate-image.py
│   ├── inject-runtime.py
│   ├── serve.py
│   └── websearch.py
└── references/
    ├── design-system.md
    ├── flip-engine.md
    └── workflows/step-01~10/
```

## 安装

```bash
npx skills add daniel-style/magic-slide
/magic-slide preview my-deck
```

## 数据

- **147 Stars** · **8 Forks** · **61 Commits**
- Python 100%

## 定位

- **Magic Slide**：让演示稿更专业
---
name: pdf-to-markdown
description: |
  将 PDF 文件转换为可读的 Markdown，同时提取嵌入图片。
  当用户说 "PDF转MD"、"pdf to markdown"、"提取PDF"、"PDF归档" 时触发。
  也适用于归档 PDF 到专栏时自动转换。
---

# PDF → Markdown 转换器

将 PDF 文件转为 Markdown，文字 + 图片两步到位。

## 依赖

- `pdftotext` (poppler-utils)
- `pdfimages` (poppler-utils)

```bash
sudo apt install poppler-utils   # Debian/Ubuntu
brew install poppler             # macOS
```

## 使用方法

```bash
# 基本用法
python3 .claude/skills/pdf-to-markdown/scripts/pdf2md.py input.pdf

# 指定输出路径
python3 .claude/skills/pdf-to-markdown/scripts/pdf2md.py input.pdf -o output.md

# 指定图片目录
python3 .claude/skills/pdf-to-markdown/scripts/pdf2md.py input.pdf --images-dir images/article-slug/
```

## 工作流程

1. **pdftotext -layout** — 提取文字，保留排版
2. **添加 YAML frontmatter** — 从文件名生成标题
3. **pdfimages -png** — 提取所有嵌入图片（PNG 格式）
4. **pdfimages -list** — 获取图片→页面映射
5. **过滤大图** — 跳过 <50KB 的装饰元素
6. **重命名** — 按 `{序号}-p{页码}.png` 格式
7. **追加 gallery** — 图片列表附加到 Markdown 末尾

## 输出结构

```
output.md                        ← 带 frontmatter 的 Markdown
images/{slug}/                   ← 配图目录
├── 002-p02.png
├── 006-p04.png
└── ...
```

## 注意事项

- `pdfimages` 会将 smask（透明度遮罩）也提取出来，脚本自动过滤
- 图片默认放在 `images/{PDF文件名}/` 下
- 文字提取效果取决于 PDF 的排版质量，扫描版 PDF 需要 OCR

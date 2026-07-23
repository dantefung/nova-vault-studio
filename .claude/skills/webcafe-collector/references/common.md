# Common Steps (Both Methods)

## Frontmatter

Every article must have:

```yaml
---
title: "文章标题"
date: "YYYY-MM-DD"
source: "web.cafe"
author: "哥飞"  # or actual author
---
```

## File Naming

| Stage | Convention | Example |
|-------|-----------|---------|
| Temp (`web-articles/`) | Underscores for special chars | `上站_上站_朋友们请上站_/` |
| Wiki (final) | Clean, no underscores | `上站上站朋友们请上站想要赚美元就多上站.md` |

## Image Directory

```
wiki-target/
├── article.md
└── images/
    └── {article-slug}/
        ├── 001.png
        └── 002.png
```

Image paths in Markdown: `images/{article-slug}/001.png`

## Archive Steps

1. Copy `web-articles/{title}/article.md` → `$DST/{slug}.md`
2. Add frontmatter (prepend with sed)
3. Download images → `$DST/images/{slug}/`
4. Replace image URLs with local paths
5. Update column `index.md` with new article link
6. Git commit

## Anti-Patterns

- ❌ Writing all docs in one massive SKILL.md
- ❌ Using `curl` without `-L` for web.cafe images
- ❌ Attempting `chrome-devtools_click` on Turnstile checkbox (cross-origin iframe)
- ❌ Skipping Turnstile handling → content is empty
- ❌ Not adding frontmatter → pre-commit hook rejects
- ❌ Not updating index.md → article invisible in sidebar
- ❌ Using `cd` to change directories → use `workdir` parameter

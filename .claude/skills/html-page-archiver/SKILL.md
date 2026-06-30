---
name: html-page-archiver
description: "External HTML page archiver for VitePress wiki. Crawls any public HTML page, downloads + saves to docs/public/slug/, and creates a wiki entry page with HtmlViewer embedding. Actions: archive, save, embed, crawl, download, capture, preserve, import HTML page to wiki. Use when user says '归档这个网页'、'把 HTML 页面保存到仓库'、'archive this page'、'embed this HTML in wiki'、'把这个页面嵌入到知识库'、'save HTML page to docs'、'crawl this URL to our site'. Triggers on: 归档网页, HTML 页面归档, 外部网页嵌入, VitePress HTML 嵌入, HtmlViewer, app-playbook style archiving."
---

# HTML Page Archiver

IRON LAW: VitePress `public/` dir is `docs/public/` — NOT root `public/`. Every file path in this skill starts with `docs/public/`. Violate this and the page 404s in production.

Red Flags (return to Step 1 if any appear):
- Writing to `public/` instead of `docs/public/`
- Guessing import path depth instead of counting `../` from `.md` file location to `docs/`
- Forgetting to add `src` with `/` prefix (e.g., `/slug/index.html`)

## Workflow

Copy this checklist and check off items as you complete them:

```
HTML Page Archiver Progress:

- [ ] Step 1: Determine slug & fetch URL ⚠️ REQUIRED
  - [ ] 1.1 Turn URL/description into a slug (kebab-case, max 40 chars)
  - [ ] 1.2 Fetch HTML page with curl/wget
- [ ] Step 2: Create archive directory & save files ⚠️ REQUIRED
  - [ ] 2.1 mkdir -p docs/public/<slug>/
  - [ ] 2.2 Write index.html + subresources (CSS/JS/images)
  - [ ] 2.3 Verify files exist
- [ ] Step 3: Determine target location for .md entry ⚠️ REQUIRED
  - [ ] 3.1 Ask: Where does this entry belong? (columns/wiki/guide etc.)
  - [ ] 3.2 Calculate `../../` path depth from .md to docs/
- [ ] Step 4: Create VitePress .md entry page ⛔ BLOCKING
  - [ ] 4.1 Write frontmatter (title, date, source, url)
  - [ ] 4.2 Add <script setup> with HtmlViewer import
  - [ ] 4.3 Add <HtmlViewer> component with correct src="/<slug>/index.html"
- [ ] Step 5: Update index/sidebar index table (conditional)
- [ ] Step 6: Confirm with user ⚠️ REQUIRED
- [ ] Step 7: Clean up _sandbox/ temp files
```

## Step 1: Determine Slug & Fetch

Ask: What's a short kebab-case slug that describes this page? (max 40 chars, no trailing slash)

Then fetch:
```bash
curl -sL "URL" -o /tmp/page.html
```
For single-page HTML (no external deps), you're done. For multi-resource pages (CSS/JS/images), you need to download each resource and rewrite paths.

## Step 2: Create Archive Directory

```bash
mkdir -p docs/public/<slug>/
cp /tmp/page.html docs/public/<slug>/index.html
```

If the page has subresources (CSS, JS, images), download them into `docs/public/<slug>/` and rewrite relative paths in the HTML to point to the local copies.

Verify:
```bash
ls docs/public/<slug>/
```
Must show at minimum `index.html`.

## Step 3: Determine Target Location

Ask three questions:
1. Which content section? (columns/indie-hub/, wiki/concepts/, guide/dev/, etc.)
2. Under what category? (e.g., app-playbook under indie-hub)
3. What's the import path depth? Count `../` from target `.md` to `docs/`

**Import path formula:**
```
docs/ is the root. If your .md is at:
  docs/md/columns/indie-hub/some-topic/index.md
  → depth = ../../../../ (4 levels up to docs/)
  
If at:
  docs/md/wiki/concepts/some-concept.md
  → depth = ../../../ (3 levels up to docs/)
```

## Step 4: Create Entry Page ⛔ BLOCKING

The .md file must have:

```markdown
---
title: "Page Title"
date: "YYYY-MM-DD"
source: "Author/Source description"
url: "https://original-url.com"
---

<script setup>
import HtmlViewer from '{DEPTH}.vitepress/theme/components/HtmlViewer.vue'
</script>

# Page Title

> Brief description of what this page contains.

<HtmlViewer src="/{slug}/index.html" title="Descriptive Title" />
```

Key rules:
- `src` must start with `/` (VitePress public root path)
- `DEPTH` must be the correct number of `../` from `.md` to `docs/`
- `title` frontmatter is REQUIRED (blocked by pre-commit hook)

## Step 5: Update Index (Conditional)

If the parent section has an index table (e.g., `columns/indie-hub/index.md`), add an entry:
```markdown
- [{title}](./{topic}/index.md) — {description}
```

Only do this if the index file exists and has such a table.

## Step 6: Confirm ⚠️ REQUIRED

Present to the user:
- Slug used
- Files created (docs/public/<slug>/ + .md entry)
- Import path depth
- HtmlViewer src path
- Whether index/sidebar was updated

Ask: "Does everything look correct? Proceed to commit?"

## Step 7: Clean Up

Remove any temp files from `_sandbox/` or `/tmp/` created during fetch.

## Anti-Patterns

- Writing to root `public/` instead of `docs/public/` — VitePress ignores root public dir
- Guessing import path depth — count `../` explicitly
- Forgetting frontmatter `title` — pre-commit hook blocks commit
- Leaving temp files in `/tmp/` or `_sandbox/`
- Using absolute file paths in `src` — must use `/`-prefixed relative path from VitePress public root
- Copying files with wget's default recursive mode (downloads entire internet)

## Pre-Delivery Checklist

### Correctness
- [ ] HTML files in `docs/public/<slug>/`, not `public/<slug>/`
- [ ] `src` path in HtmlViewer starts with `/` (e.g., `/app-playbook/index.html`)
- [ ] Import path depth correctly counts `../` to `docs/`
- [ ] Frontmatter has `title` (required), `date`, `source`, `url`

### Completeness
- [ ] At minimum `index.html` exists in archive dir
- [ ] Temp files cleaned up
- [ ] Index/sidebar updated if applicable

# Chrome DevTools CDP Method (Fallback)

> Use when opencli is blocked by Cloudflare or unavailable.

## Prerequisites

### Launch Chrome with CDP port

```bash
bash .claude/skills/webcafe-collector/scripts/setup-chrome.sh 9222
```

This starts Chrome at `--remote-debugging-port=9222`. Verify:
```bash
curl -s http://127.0.0.1:9222/json/version
```

### Ensure web.cafe is logged in

Navigate to https://new.web.cafe in the launched Chrome, login if needed.

---

## Workflow

### Step 1: Navigate to column page

```
chrome-devtools_navigate_page → url: "https://new.web.cafe/tutorial/{COLUMN_UID}"
```

### Step 2: Extract article UIDs

```
chrome-devtools_take_snapshot
```

From snapshot, find all links matching `/tutorial/detail/{UID}`. The column page has a `navigation` element with links — each `<link>` has `href` and `StaticText` (title).

### Step 3: Navigate to article

```
chrome-devtools_navigate_page → url: "https://new.web.cafe/tutorial/detail/{UID}"
```

### Step 4: Handle Turnstile verification

Turnstile blocks ~every page load. Priority order:

**Option A — List page onclick bypass (try first):**
```
chrome-devtools_navigate_page → url: "https://new.web.cafe/tutorial/{COLUMN_UID}"
chrome-devtools_evaluate_script → 
  () => {
    const ps = document.querySelectorAll('p');
    for (const p of ps) {
      if (p.textContent.includes('{TARGET_TITLE}')) return p.click();
    }
  }
```

**Option B — User manual click:**
Ask user to click the Turnstile checkbox in the browser. 100% reliable.

**Option C — Retry navigation:**
Sometimes auto-passes on retry.

> ⚠️ `chrome-devtools_click` on the checkbox uid FAILS (cross-origin iframe). Do not attempt.

### Step 5: Extract content

```
chrome-devtools_wait_for → text: ["{article_title}"]
chrome-devtools_take_snapshot
```

**Content extraction rules:**
- Target element: `div.custom-html.prose` with >5 children (main article, not comments)
- Multiple same-class divs exist → pick the one with most children
- Images: `<img>` tags with `src="https://s.web.cafe/image/{uuid}.png"`
- Links: `<a>` tags

### Step 6: Save to temp directory

Save extracted Markdown to `web-articles/{title-with-underscores}/article.md`.

### Step 7: Download images

```bash
DEST="web-articles/{title-with-underscores}"
mkdir -p "$DEST/images"
for url in $(grep -oP 'https://s\.web\.cafe/image/[a-f0-9]+\.png' "$DEST/article.md"); do
  count=$((count+1))
  outfile=$(printf "%03d.png" $count)
  curl -L -o "$DEST/images/$outfile" "$url"
  sed -i "s|$url|images/$outfile|g" "$DEST/article.md"
done
```

> ⚠️ Always use `curl -L` (follow redirects) for web.cafe images.

### Step 8: Move to wiki and finalize

See `references/common.md` for frontmatter, naming, and archive steps.

---

## Multi-tab management

When fetching many articles, tabs accumulate. Use:
```
chrome-devtools_list_pages
chrome-devtools_select_page → pageId: N
```

Best practice: navigate to next URL in current tab instead of opening new tabs.

---

## Common errors

| Error | Fix |
|-------|-----|
| Turnstile blocks forever | Use list page onclick bypass or user manual click |
| Content is empty | URL still shows `/verify?` → Turnstile not passed |
| Click on checkbox fails | cross-origin iframe → use bypass methods instead |
| Images not downloading | Use `curl -L` not `curl` |

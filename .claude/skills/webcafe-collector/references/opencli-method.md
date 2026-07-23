# OpenCLI Method (Primary)

## Prerequisites

### 1. Install opencli

```bash
npm install -g opencli
opencli doctor  # Should output "Everything looks good!"
```

### 2. Chrome Bridge Extension

- Open `chrome://extensions`
- Load unpacked extension from opencli's `extension/` directory
- Verify with `opencli doctor`

### 3. Login to web.cafe

- Open https://new.web.cafe in Chrome
- Login once (top-right shows username, not "登 录")
- opencli reuses Chrome's login session automatically

---

## Workflow

### Step 1: Discover article UIDs

```bash
opencli web read --url "https://new.web.cafe/tutorial/{COLUMN_UID}"
```

Extract all `/tutorial/detail/{UID}` links from output.

### Step 2: Fetch each article

```bash
opencli web read --url "https://new.web.cafe/tutorial/detail/{UID}"
```

**Output:** Markdown file with frontmatter + downloaded images in `web-articles/` directory.

### Step 3: Batch fetch

```bash
for uid in UID1 UID2 UID3; do
  opencli web read --url "https://new.web.cafe/tutorial/detail/$uid"
  sleep 15
done
```

> ⚠️ Always sleep 15s between requests to avoid Cloudflare.

---

## Cloudflare Handling

| Symptom | Action |
|---------|--------|
| Returns full article | Continue |
| Returns `Security Verification` | Wait 15s, retry |
| Persistent blocks | Wait 30s, retry |
| Returns "登录可见" | Check Chrome is logged in |

If Cloudflare blocks repeatedly, switch to Chrome DevTools CDP method.

---

## Post-Processing

- Images may not download on all opencli versions → verify manually
- Move to wiki directory, rename, update paths (see `references/common.md`)
- Add frontmatter if missing

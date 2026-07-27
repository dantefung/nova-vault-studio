---
name: cleanup-avatar-images
description: Batch cleanup avatar images and icon links from Markdown documents. Use when user wants to "clean avatars", "remove avatar images", "delete 96x96 images", "clean WeChat avatars", "remove SVG icon links", "cleanup small images", "batch delete images", or mentions cleaning up imported articles from WeChat/social platforms. Supports custom size thresholds, link patterns, dry-run preview, and auto Git commit. Triggers on "清理头像", "移除头像", "删除头像", "批量清理图片", "96x96", "微信头像", "公众号头像", "清理SVG链接", "cleanup avatars", "remove small images".
---

# Cleanup Avatar Images

**IRON LAW: Never delete images without user confirmation. Always show what will be deleted and wait for explicit approval before modifying any files.**

## Workflow Checklist

```
- [ ] Step 1: Understand Requirements ⚠️ REQUIRED
  - [ ] 1.1 Identify target directory/project
  - [ ] 1.2 Confirm avatar size threshold (default: 96x96)
  - [ ] 1.3 Check for custom link patterns to remove
  - [ ] 1.4 Determine if dry-run or actual execution
- [ ] Step 2: Scan and Analyze
  - [ ] 2.1 Scan all markdown files
  - [ ] 2.2 Identify all images in the images/ directories
  - [ ] 2.3 Classify images by size (avatars vs content)
  - [ ] 2.4 Detect special link patterns (SVG icons, etc)
- [ ] Step 3: Present Preview ⚠️ REQUIRED
  - [ ] 3.1 Show total counts (files, avatars, links)
  - [ ] 3.2 List sample items to be removed
  - [ ] 3.3 Display affected files
  - [ ] 3.4 Wait for user confirmation
- [ ] Step 4: Execute Cleanup ⛔ BLOCKING (requires Step 3 confirmation)
  - [ ] 4.1 Remove avatar image references
  - [ ] 4.2 Remove matching link patterns
  - [ ] 4.3 Preserve all normal content images
  - [ ] 4.4 Track changes per file
- [ ] Step 5: Generate Report
  - [ ] 5.1 Show statistics (removed counts by category)
  - [ ] 5.2 List modified files
  - [ ] 5.3 Verify no content images were affected
- [ ] Step 6: Git Operations (optional)
  - [ ] 6.1 Ask if user wants to commit changes
  - [ ] 6.2 Stage modified files
  - [ ] 6.3 Create descriptive commit message
  - [ ] 6.4 Commit and optionally push
```

## Parameters

Support these command-line style flags:

- `--path <directory>`: Target directory to clean (default: current directory)
- `--size <WxH>`: Avatar size threshold (default: `96x96`)
- `--pattern <regex>`: Additional link pattern to remove (e.g., `\[!\[site\.com\].*svg.*\]`)
- `--dry-run`: Preview mode only, don't modify files
- `--auto-commit`: Automatically commit after cleanup (requires confirmation)
- `--recursive`: Scan all subdirectories recursively

**Examples:**
```bash
# Clean current directory with defaults
cleanup-avatar-images

# Clean specific directory, preview only
cleanup-avatar-images --path docs/articles --dry-run

# Custom size threshold
cleanup-avatar-images --size 100x100

# Remove specific SVG link pattern
cleanup-avatar-images --pattern '\[!\[new\.web\.cafe\].*svg.*\]\(https://new\.web\.cafe/?\)'

# Recursive cleanup with auto-commit
cleanup-avatar-images --path docs --recursive --auto-commit
```

## Step 1: Understand Requirements

Ask the user to clarify:

**Q1: Which directory should I clean?**
- Current directory?
- Specific path?
- Entire project recursively?

**Q2: What size threshold for avatars?**
- Default 96x96 pixels?
- Custom size like 100x100, 128x128?
- Size range (e.g., any image smaller than 100x100)?

**Q3: Any special link patterns to remove?**
- SVG icon links pointing to specific domains?
- Specific image filename patterns?
- Custom regex patterns?

**Q4: Execution mode?**
- Dry-run first (recommended)?
- Direct execution after preview?

Parse parameters if provided. If no parameters, ask these questions conversationally.

## Step 2: Scan and Analyze

Run the cleanup scanner:

```python
python3 .claude/skills/cleanup-avatar-images/scripts/scan_avatars.py \
  --path <target_directory> \
  --size <WxH> \
  --pattern "<regex_pattern>" \
  --output /tmp/avatar_scan_report.json
```

The script will:
1. Find all `.md` files in the target directory
2. Find all image files in `images/` subdirectories
3. Identify images matching the size threshold (using PIL)
4. Extract all image references from markdown files
5. Classify references as avatars vs content images
6. Detect special link patterns if provided
7. Output a JSON report with all findings

**Anti-pattern:** Don't guess which images are avatars by filename alone. Always check actual image dimensions.

## Step 3: Present Preview ⚠️ REQUIRED

Load the scan report and present to user:

```
📊 Cleanup Preview
==================

Target: <directory>
Criteria: Images ≤ <size>, plus pattern: <pattern>

📁 Statistics:
   - Markdown files scanned: X
   - Images found: Y total
   - Avatar images identified: Z (matching criteria)
   - Image references to remove: N
   - Special links to remove: M

📝 Sample items to be removed (first 10):
   1. docs/article1.md:15 - ![](images/article1/img_001.jpg) [96x96, 3.2KB]
   2. docs/article1.md:23 - ![](images/article1/img_005.jpg) [96x96, 1.8KB]
   ...

📄 Affected files (X files):
   - docs/article1.md (5 references)
   - docs/article2.md (12 references)
   ...

⚠️  Normal content images (>96x96) will NOT be touched.
```

**Confirmation gate:**
```
Do you want to proceed with cleanup? (yes/no/show-more)
- yes: Execute cleanup
- no: Cancel operation
- show-more: Display full list of items
```

**Anti-pattern:** Never proceed without explicit "yes" from user. "ok", "sure", "go ahead" are NOT sufficient — require exactly "yes".

## Step 4: Execute Cleanup

Only if user confirmed "yes" in Step 3:

```python
python3 .claude/skills/cleanup-avatar-images/scripts/cleanup_avatars.py \
  --report /tmp/avatar_scan_report.json \
  --execute \
  --output /tmp/avatar_cleanup_result.json
```

The script will:
1. Load the scan report
2. For each markdown file with avatars:
   - Read the file
   - Remove lines containing avatar image references
   - Remove lines matching special link patterns
   - Preserve all other content
   - Write back to file
3. Track all changes in a result JSON

**Anti-pattern:** Don't use regex substitution across entire files. Process line by line to avoid accidentally removing content images embedded in complex markdown structures.

## Step 5: Generate Report

Load the result and present:

```
✅ Cleanup Complete
===================

📈 Results:
   - Avatar references removed: N
   - Special links removed: M
   - Total references cleaned: N + M
   - Files modified: X

📝 Modified files:
   - docs/article1.md: removed 5 avatars
   - docs/article2.md: removed 12 avatars + 1 SVG link
   ...

✓ Verification:
   - No content images affected
   - All files remain valid markdown
```

## Step 6: Git Operations

**If user requested `--auto-commit` OR ask conversationally:**

```
Would you like to commit these changes to Git? (yes/no)
```

If yes:
1. Check git status to confirm only expected files changed
2. Stage modified files: `git add <modified_files>`
3. Generate commit message:
   ```
   prompt: 批量移除头像图片和图标链接
   
   - 移除 <N> 个头像图片引用 (尺寸: <size>)
   - 移除 <M> 个特殊链接
   - 涉及 <X> 个文件
   ```
4. Commit: `git commit -m "<message>"`
5. Ask: "Push to remote? (yes/no)"
6. If yes: `git push`

## Anti-Patterns (What NOT to Do)

❌ **Deleting images without showing user what will be deleted**
   → Always present preview with counts and samples

❌ **Removing content images by accident**
   → Verify image dimensions, never guess by filename

❌ **Processing without confirmation**
   → Always require explicit "yes" before modifying files

❌ **Using broad regex on entire file content**
   → Process line by line to avoid collateral damage

❌ **Assuming all small images are avatars**
   → Some content images might be small icons or diagrams

❌ **Not checking git status before commit**
   → Always verify only expected files were changed

❌ **Committing without descriptive message**
   → Include counts and criteria in commit message

## Pre-Delivery Checklist

Before reporting completion:
- [ ] User explicitly confirmed cleanup (saw preview, said "yes")
- [ ] Report shows exact counts (not "approximately" or "around")
- [ ] Modified file list matches scan report
- [ ] No content images were removed (verify by checking sizes)
- [ ] If committed: git log shows descriptive message with counts
- [ ] If committed: git push completed (or user declined push)
- [ ] Final report includes statistics by category (avatars, special links)

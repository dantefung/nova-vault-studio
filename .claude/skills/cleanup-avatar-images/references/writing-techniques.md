# Writing Techniques for Skills

## 1. Question-Style Instructions

**Problem:** Vague directives like "ensure quality" or "analyze the input" give the model too much freedom.

**Solution:** Ask specific questions the model must answer.

### Examples

❌ **Bad: Vague directive**
```markdown
Analyze the codebase and identify issues.
```

✅ **Good: Specific questions**
```markdown
Answer these questions:
- Which files contain avatar image references?
- What are the dimensions of each image?
- Are any content images (>96x96) accidentally included?
- Which markdown files will be modified?
```

❌ **Bad: Abstract goal**
```markdown
Ensure the cleanup is safe and thorough.
```

✅ **Good: Concrete checks**
```markdown
Verify:
- Did we check actual image dimensions (not just filenames)?
- Are all references to 96x96 images marked for removal?
- Are zero content images (>96x96) in the removal list?
- Did we get explicit user confirmation before modifying?
```

## 2. Anti-Pattern Documentation

**Problem:** The model will default to lazy, generic solutions unless you explicitly forbid them.

**Solution:** Document exactly what NOT to do.

### Pattern: "Don't X, Instead Y"

```markdown
## Anti-Patterns (What NOT to Do)

❌ **Don't delete images without showing user what will be deleted**
   → Always present preview with counts and samples

❌ **Don't remove content images by accident**
   → Verify image dimensions, never guess by filename

❌ **Don't use broad regex on entire file content**
   → Process line by line to avoid collateral damage

❌ **Don't proceed with just "ok" or "sure"**
   → Require exact "yes" for confirmation
```

### Why This Works

- Prevents the most common failure modes
- More efficient than explaining the right way (model already knows, just needs guardrails)
- Easy to spot violations during review

## 3. Iron Law + Red Flag Signals

**Iron Law:** The ONE rule that prevents the most common critical error.

Place at the top of SKILL.md, right after frontmatter.

### Pattern

```markdown
**IRON LAW: [Consequence/Constraint] + [Required Action]**
```

### Examples

✅ **For destructive operations:**
```markdown
**IRON LAW: Never delete images without user confirmation. Always show what will be deleted and wait for explicit approval before modifying any files.**
```

✅ **For quality control:**
```markdown
**IRON LAW: Every removed reference must be verified as an avatar (96x96 pixels) by checking actual image dimensions, not filename patterns.**
```

✅ **For output completeness:**
```markdown
**IRON LAW: Never output partial results. If generation exceeds token limit, split into multiple turns, but each turn must be complete and valid.**
```

### Red Flag Signals

Add conditions that should trigger re-evaluation:

```markdown
**Red flags - stop and ask user if:**
- The cleanup would affect more than 100 files
- Any content images (>96x96) are in the removal list
- User confirmation was not explicitly "yes"
- Git status shows unexpected file changes
```

## 4. Progressive Disclosure

**Problem:** Loading all information upfront wastes tokens.

**Solution:** Load references on-demand at specific workflow steps.

### Pattern

```markdown
## Step 3: Generate Commit Message

Load references/commit-message-patterns.md for:
- Conventional commit formats
- Descriptive statistics templates
- Good/bad examples
```

### Benefits

- Reduces token cost when steps are skipped
- Information arrives exactly when needed
- Easier to maintain (update one reference, not scattered instructions)

## 5. Concrete Examples Over Abstract Rules

❌ **Bad: Abstract**
```markdown
Generate a descriptive commit message.
```

✅ **Good: Concrete template**
```markdown
Commit message format:
```
prompt: 批量移除头像图片和图标链接

- 移除 <N> 个头像图片引用 (尺寸: <size>)
- 移除 <M> 个特殊链接
- 涉及 <X> 个文件
```
```

## 6. Trackable Workflow Checklist

Make progress visible and verifiable:

```markdown
- [ ] Step 1: Understand Requirements ⚠️ REQUIRED
  - [ ] 1.1 Identify target directory
  - [ ] 1.2 Confirm size threshold
  - [ ] 1.3 Check for special patterns
- [ ] Step 2: Scan and Analyze
  - [ ] 2.1 Find all markdown files
  - [ ] 2.2 Identify avatar images
- [ ] Step 3: Present Preview ⚠️ REQUIRED
  - [ ] 3.1 Show counts
  - [ ] 3.2 Wait for confirmation ⛔ BLOCKING
```

Markers:
- `⚠️ REQUIRED` - must not skip
- `⛔ BLOCKING` - blocks next step
- `(conditional)` - depends on earlier choice

## Summary

| Technique | Use When | Benefit |
|-----------|----------|---------|
| Question-style | Model has too much freedom | Forces specific thinking |
| Anti-patterns | Common failure mode exists | Prevents lazy defaults |
| Iron Law | One critical mistake likely | Immediate top-of-mind rule |
| Red flags | Boundary conditions matter | Triggers human oversight |
| Progressive disclosure | Long reference docs | Saves tokens |
| Concrete examples | Abstract rules unclear | Shows exact expected output |
| Trackable checklist | Multi-step workflow | Makes progress visible |

**Remember:** Every line must justify its token cost. If it doesn't make output better, more consistent, or more reliable — cut it.

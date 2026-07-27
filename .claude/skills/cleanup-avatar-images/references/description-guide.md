# Description Writing Guide

## The Problem

The `description` field in SKILL.md frontmatter is the ONLY thing that determines:
1. Whether the skill triggers automatically when relevant
2. Whether users can find it by search

Yet it's consistently underestimated. Most skills fail to trigger because their descriptions are too vague.

## The Keyword Bombing Technique

Pack the description with:
1. **Trigger phrases** - exactly what users would say
2. **Domain terms** - technical vocabulary from the problem space  
3. **Use case scenarios** - concrete situations where the skill applies
4. **Action verbs** - clean, remove, analyze, generate, etc.
5. **Multiple languages** - if applicable (English + Chinese)

## Structure

```yaml
description: |
  [One-line summary]. Use when user wants to [action1], [action2], [action3], 
  or mentions [keyword1], [keyword2], [keyword3]. Supports [feature1], [feature2].
  Triggers on [trigger_phrase1], [trigger_phrase2], [exact_quotes_users_say].
```

## Good Examples

✅ **Good: Keyword-bombed, specific**
```yaml
description: Batch cleanup avatar images and icon links from Markdown documents. Use when user wants to "clean avatars", "remove avatar images", "delete 96x96 images", "clean WeChat avatars", "remove SVG icon links", "cleanup small images", "batch delete images", or mentions cleaning up imported articles from WeChat/social platforms. Supports custom size thresholds, link patterns, dry-run preview, and auto Git commit. Triggers on "清理头像", "移除头像", "删除头像", "批量清理图片", "96x96", "微信头像", "公众号头像", "清理SVG链接", "cleanup avatars", "remove small images".
```

✅ **Good: Action-oriented, clear triggers**
```yaml
description: Generate C4 architecture diagrams using Mermaid. Use when asked to create architecture diagrams, document system architecture, visualize software structure, create C4 diagrams, or generate context/container/component/deployment diagrams. Triggers include "architecture diagram", "C4 diagram", "system context", "container diagram", "component diagram", "deployment diagram", "document architecture", "visualize architecture".
```

## Bad Examples

❌ **Bad: Too vague**
```yaml
description: A tool for cleaning up images in markdown files.
```
Why bad: No trigger keywords, no concrete use cases, "a tool" is generic filler.

❌ **Bad: Too technical in the wrong way**
```yaml
description: Implements a PIL-based image dimension analyzer with markdown AST traversal for selective reference removal based on configurable size thresholds.
```
Why bad: Users don't talk like this. No natural language triggers.

❌ **Bad: Missing language variants**
```yaml
description: Clean up avatar images from markdown files.
```
Why bad: Only English, no Chinese triggers (if users might use Chinese).

## The "When to Use" Trap

❌ **Wrong: Putting "When to Use" in SKILL.md body**
```markdown
# My Skill

## When to Use
Use this skill when you want to clean up images...
```

The body loads AFTER triggering — too late!

✅ **Right: All triggering info in description**
```yaml
description: Clean avatars. Use when user wants to "clean up images"...
```

## Checklist

Before finalizing description:
- [ ] Contains 5+ concrete trigger phrases users would actually say
- [ ] Includes domain-specific keywords (96x96, WeChat, SVG, etc.)
- [ ] Lists main features/capabilities
- [ ] Multiple language variants if applicable
- [ ] No generic filler ("a tool", "helps you", "allows you to")
- [ ] 2-3 sentences, densely packed with keywords
- [ ] Tested: would this description match a real user query?

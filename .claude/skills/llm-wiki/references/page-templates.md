# Wiki Page Templates

## Standard Entity Page

```markdown
---
title: Entity Name
category: entities
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source1, source2]
---

# Entity Name

One-line definition.

## Overview

Detailed description.

## Key Facts

- Fact 1
- Fact 2
- Fact 3

## Related Pages

- [[concepts/related-concept]]
- [[entities/related-entity]]

## Sources

- [Source Name](URL) — brief note on what this source provides
```

## Standard Concept Page

```markdown
---
title: Concept Name
category: concepts
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source1]
---

# Concept Name

One-line definition.

## Core Idea

The central thesis or framework.

## Key Points

1. Point one
2. Point two
3. Point three

## Examples

Example description.

## Related Pages

- [[concepts/related-concept]]
- [[entities/relevant-entity]]

## Sources

- [Source Name](URL)
```

## Summary Page (Per Source)

```markdown
---
title: Summary: Source Title
category: summaries
source: source-reference
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Summary: Source Title

**Source**: [Title](URL) | **Date**: YYYY-MM-DD | **Type**: article/paper/book/report

## TL;DR

One-paragraph summary of the main takeaway.

## Key Takeaways

1. Takeaway 1
2. Takeaway 2
3. Takeaway 3

## Notable Details

- Detail A
- Detail B

## Contradictions / Open Questions

- What this source says vs. what other sources say
- Unresolved questions

## Related Pages

- [[concepts/related-concept]]
- [[entities/related-entity]]
```

## index.md Format

```markdown
# Wiki Index

## Entities

| Page | Summary | Updated |
|------|---------|---------|
| [[entities/entity-name]] | One-line summary | YYYY-MM-DD |

## Concepts

| Page | Summary | Updated |
|------|---------|---------|
| [[concepts/concept-name]] | One-line summary | YYYY-MM-DD |

## Summaries

| Page | Source | Date |
|------|--------|------|
| [[summaries/summary-title]] | Source Title | YYYY-MM-DD |

## Synthesis

| Page | Thesis | Updated |
|------|--------|---------|
| [[synthesis/synthesis-title]] | One-line thesis | YYYY-MM-DD |
```

## log.md Format

```markdown
# Wiki Log

Append-only chronological record.

## [YYYY-MM-DD] ingest | Source Title

**Source**: path or "user input"
**New pages**: list
**Updated pages**: list
**New cross-references**: list

## [YYYY-MM-DD] query | Question summary

**Answer**: brief note on what was answered
**Filed back**: yes/no — if yes, which page

## [YYYY-MM-DD] lint | Health check

**Issues found**: list
**Fixes made**: list
```
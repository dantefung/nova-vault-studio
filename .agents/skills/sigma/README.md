# sigma — Personalized 1-on-1 AI Tutor

Bloom's 2-Sigma mastery learning tutor. Uses Socratic questioning, adaptive pacing, and rich visual output (HTML dashboards, Excalidraw concept maps) to guide users through any topic.

## Source

- **Repository**: [VastFuture/sanyuan-skills](https://github.com/VastFuture/sanyuan-skills)
- **Original path**: `skills/sigma/SKILL.md`
- **Installed to**: `.agents/skills/sigma/`

## What It Does

- Diagnoses your current understanding before teaching
- Asks 1-2 questions per round (never gives answers directly)
- Only advances when you demonstrate ~80% mastery
- Generates visual learning roadmaps and concept maps
- Persists session state across conversations (`sigma/{topic-slug}/`)
- Supports `--resume` to continue previous learning sessions

## Usage

```bash
/sigma Python decorators
/sigma 量子力学 --level beginner
/sigma React hooks --level intermediate --lang zh
/sigma linear algebra --resume    # Resume previous session
```

## Files

| File | Description |
|------|-------------|
| `SKILL.md` | Main skill definition and workflow |
| `references/excalidraw.md` | Excalidraw diagram format & color palette |
| `references/html-templates.md` | HTML roadmap/dashboard templates |
| `references/pedagogy.md` | Bloom's 2-Sigma pedagogy reference |

## Triggers

Use when user says: "teach me", "I want to learn", "explain X to me step by step", "help me understand", or invokes `/sigma`. Also triggers on: learn, study, teach, tutor, understand, master, explain step by step.

---
name: llm-wiki
description: "Build and maintain a persistent, compounding wiki knowledge base with LLMs. Use when user says 'llm-wiki', 'build a wiki', 'create a knowledge base', 'wiki pattern', 'persistent knowledge base', 'incrementally build wiki', or shares the LLM Wiki design document. Triggers: wiki, knowledge base, compounding, Vannevar Bush, Memex, personal wiki, research wiki."
---

# LLM Wiki — Persistent Compounding Knowledge Base

A pattern for building personal knowledge bases using LLMs. The wiki is a **persistent, compounding artifact** maintained by the LLM — not re-derived on every query.

## When to Use

- User provides the `llm-wiki.md` design document and asks to instantiate the pattern
- User wants to build a personal/research/wiki knowledge base over time
- User mentions "compounding knowledge", "persistent wiki", "Vannevar Bush", "Memex"
- User asks to set up a wiki system from scratch

## Three-Layer Architecture

```
Raw Sources          →  Immutable source documents (articles, papers, PDFs)
       ↓ Ingest
The Wiki             →  LLM-generated markdown files (entity pages, summaries, synthesis)
       ↓ Query
The Schema           →  AGENTS.md / CLAUDE.md conventions for the LLM to follow
```

## Directory Structure

Wiki defaults to `wiki/` under project root. User may specify a different path.

```
wiki/
├── index.md              # Content-oriented catalog (links + one-line summaries)
├── log.md                # Append-only chronological record (ingests, queries, lint)
├── sources/              # Raw source documents (immutable)
└── pages/                # LLM-generated wiki pages
    ├── entities/         # Named entities (people, companies, products)
    ├── concepts/         # Abstract concepts, theories, frameworks
    ├── summaries/        # Per-source summary pages
    └── synthesis/        # Cross-source synthesis, theses, comparisons
```

## Core Operations

### Ingest

1. User drops a new source into `wiki/sources/`
2. LLM reads the source, discusses key takeaways with user
3. LLM writes a summary page in `wiki/pages/summaries/`
4. LLM updates `wiki/index.md` with new entry
5. LLM updates relevant entity/concept pages across the wiki
6. LLM appends entry to `wiki/log.md`

**Iron rule**: A single source may touch 10–15 wiki pages. The LLM handles all cross-referencing in one pass.

### Query

1. LLM reads `wiki/index.md` first to locate relevant pages
2. LLM drills into those pages and synthesizes an answer with citations
3. **If the answer is valuable → file it back into the wiki as a new page**
4. Good answers compound just like ingested sources

### Lint

Periodically ask the LLM to health-check the wiki:
- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Concepts mentioned but lacking their own page
- Missing cross-references
- Data gaps fillable via web search

## Schema Conventions (for AGENTS.md / CLAUDE.md)

```
## LLM Wiki Conventions

- Wiki path: wiki/
- One page = one knowledge entity (one concept, one entity, one summary)
- File naming: lowercase, hyphen-separated (e.g. claude-code.md, transformer-attention.md)
- Cross-references: [[pages/concept-name]] Obsidian-compatible double-bracket format
- index.md: updated on every ingest, organized by category
- log.md: append-only, chronological, entries start with ## [YYYY-MM-DD]
- Sources are immutable — LLM reads them but never modifies them
- Answers that are valuable should be filed back into the wiki as new pages
```

## Workflow

### Instantiation (first time)

1. Create `wiki/` directory structure
2. Create `wiki/sources/` and `wiki/pages/` subdirectories
3. Create `wiki/index.md` with category headers
4. Create `wiki/log.md` with header and first entry noting initialization
5. Inject schema conventions into project's AGENTS.md / CLAUDE.md
6. Report the structure to user

### Adding Sources

1. Confirm source location (user drops file or specifies path)
2. Read source, extract key information
3. Discuss takeaways with user (optional but recommended)
4. Create/update wiki pages
5. Update index.md
6. Append to log.md

### Answering Questions

1. Read `wiki/index.md` to locate relevant pages
2. Synthesize answer from those pages
3. Offer to save the answer as a new wiki page if valuable

## Tips

- **Obsidian Web Clipper** for quickly clipping web articles to `wiki/sources/`
- **Obsidian graph view** to see the shape of the wiki (hubs, orphans, clusters)
- **Dataview** plugin for querying page frontmatter (tags, dates, source counts)
- **Marp** for generating slide decks from wiki content
- The wiki is just a git repo of markdown files — version history and branching come for free
- At small scale (~100 sources, hundreds of pages), `index.md` alone is enough search — no vector search needed
- At larger scale, consider [qmd](https://github.com/tobi/qmd) (BM25/vector hybrid search with MCP server)

## Why It Works

The tedious part of a knowledge base is bookkeeping — updating cross-references, keeping summaries current, flagging contradictions. Humans abandon wikis because maintenance burden grows faster than value. LLMs don't get bored, don't forget a cross-reference, and can touch 15 files in one pass. The maintenance cost is near zero.
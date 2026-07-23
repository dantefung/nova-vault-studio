---
name: clone-website
description: Reverse-engineer and clone one or more websites in one shot — extracts assets, CSS, and content section-by-section and proactively dispatches parallel builder agents in worktrees as it goes. Use this whenever the user wants to clone, replicate, rebuild, reverse-engineer, or copy any website. Also triggers on phrases like "make a copy of this site", "rebuild this page", "pixel-perfect clone". Provide one or more target URLs as arguments.
argument-hint: "<url1> [<url2> ...]"
user-invocable: true
---

# Clone Website

You are about to reverse-engineer and rebuild **$ARGUMENTS** as pixel-perfect clones.

When multiple URLs are provided, process them independently and in parallel where possible, while keeping each site's extraction artifacts isolated in dedicated folders (for example, `docs/research/<hostname>/`).

This is not a two-phase process (inspect then build). You are a **foreman walking the job site** — as you inspect each section of the page, you write a detailed specification to a file, then hand that file to a specialist builder agent with everything they need. Extraction and construction happen in parallel, but extraction is meticulous and produces auditable artifacts.

## Scope Defaults

The target is whatever page `$ARGUMENTS` resolves to. Clone exactly what's visible at that URL. Unless the user specifies otherwise, use these defaults:

- **Fidelity level:** Pixel-perfect — exact match in colors, spacing, typography, animations
- **In scope:** Visual layout and styling, component structure and interactions, responsive design, mock data for demo purposes
- **Out of scope:** Real backend / database, authentication, real-time features, SEO optimization, accessibility audit
- **Customization:** None — pure emulation

If the user provides additional instructions (specific fidelity level, customizations, extra context), honor those over the defaults.

## Pre-Flight

1. **Browser automation is required.** Check for available browser MCP tools (Chrome MCP, Playwright MCP, Browserbase MCP, Puppeteer MCP, etc.). Use whichever is available — if multiple exist, prefer Chrome MCP. If none are detected, ask the user which browser tool they have and how to connect it. This skill cannot work without browser automation.
2. Parse `$ARGUMENTS` as one or more URLs. Normalize and validate each URL; if any are invalid, ask the user to correct them before proceeding. For each valid URL, verify it is accessible via your browser MCP tool.
3. Verify the base project builds: `npm run build`. The Next.js + shadcn/ui + Tailwind v4 scaffold should already be in place. If not, tell the user to set it up first.
4. Create the output directories if they don't exist: `docs/research/`, `docs/research/components/`, `docs/design-references/`, `scripts/`. For multiple clones, also prepare per-site folders like `docs/research/<hostname>/` and `docs/design-references/<hostname>/`.
5. When working with multiple sites in one command, optionally confirm whether to run them in parallel (recommended, if resources allow) or sequentially to avoid overload.

## Guiding Principles

### 1. Completeness Beats Speed

Every builder agent must receive **everything** it needs to do its job perfectly: screenshot, exact CSS values, downloaded assets with local paths, real text content, component structure. If a builder has to guess anything — a color, a font size, a padding value — you have failed at extraction. Take the extra minute to extract one more property rather than shipping an incomplete brief.

### 2. Small Tasks, Perfect Results

When an agent gets "build the entire features section," it glosses over details — it approximates spacing, guesses font sizes, and produces something "close enough" but clearly wrong. When it gets a single focused component with exact CSS values, it nails it every time.

**Complexity budget rule:** If a builder prompt exceeds ~150 lines of spec content, the section is too complex for one agent. Break it into smaller pieces.

### 3. Real Content, Real Assets

Extract the actual text, images, videos, and SVGs from the live site. This is a clone, not a mockup.

**Layered assets matter.** A section that looks like one image is often multiple layers — a background watercolor/gradient, a foreground UI mockup PNG, an overlay icon. Inspect each container's full DOM tree.

### 4. Foundation First

Nothing can be built until the foundation exists: global CSS with the target site's design tokens, TypeScript types, and global assets. This is sequential and non-negotiable.

### 5. Extract How It Looks AND How It Behaves

Extract both **appearance** (exact computed CSS via `getComputedStyle()`) AND **behavior** (what changes, what triggers the change, and how the transition happens).

### 6. Identify the Interaction Model Before Building

**Is this section driven by clicks, scrolls, hovers, time, or some combination?**

1. **Don't click first.** Scroll through the section slowly and observe if things change on their own as you scroll.
2. If they do, it's scroll-driven. Extract the mechanism.
3. If nothing changes on scroll, THEN click/hover to test.

### 7. Extract Every State, Not Just the Default

For tabbed/stateful content: click each tab and extract content per state. For scroll-dependent elements: capture styles at position 0 AND past the trigger threshold.

### 8. Spec Files Are the Source of Truth

Every component gets a specification file in `docs/research/components/` BEFORE any builder is dispatched.

### 9. Build Must Always Compile

Every builder agent must verify `npx tsc --noEmit` passes before finishing.

## Phase 1: Reconnaissance

- Take **full-page screenshots** at desktop (1440px) and mobile (390px)
- Extract fonts, colors, favicons, meta
- **Mandatory Interaction Sweep**: scroll sweep, click sweep, hover sweep, responsive sweep
- Save findings to `docs/research/BEHAVIORS.md`
- Map page topology to `docs/research/PAGE_TOPOLOGY.md`

## Phase 2: Foundation Build

1. Update fonts in `layout.tsx`
2. Update `globals.css` with color tokens
3. Create TypeScript interfaces in `src/types/`
4. Extract SVG icons to `src/components/icons.tsx`
5. Download global assets to `public/`
6. Verify: `npm run build` passes

## Phase 3: Component Specification & Dispatch

For each section: **extract** → **write spec file** → **dispatch builders**

- Simple section (1-2 sub-components): one builder agent
- Complex section (3+ sub-components): one agent per sub-component, plus wrapper agent

## Phase 4: Page Assembly

Wire everything together in `src/app/page.tsx`. Verify `npm run build` passes.

## Phase 5: Visual QA Diff

Take side-by-side comparison screenshots and verify all interactive behaviors work.

## Completion

Report: sections built, components created, spec files written, assets downloaded, build status, visual QA results.

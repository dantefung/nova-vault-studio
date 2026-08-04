---
title: "Knowledge Base Homepage Quiet Library Implementation Plan"
date: "2026-07-30"
url: ""
---

# Knowledge Base Homepage Quiet Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current multi-style landing page with a single Quiet Library homepage that presents real knowledge-base entry points and recent content without changing document-page behavior.

**Architecture:** Keep VitePress's existing custom `MyLayout.vue` route split. Replace the current style-switching `HomeLayout.vue` implementation with one focused homepage component and its scoped CSS. Keep homepage content data in the component because the site is a static content repository and a runtime filesystem scanner would add complexity without a stable need; use only verified existing links and titles.

**Tech Stack:** VitePress 1.6.4, Vue 3 SFC, existing theme composables, existing CSS/theme tokens, npm build.

---

## File Map

- Modify `docs/.vitepress/theme/layouts/HomeLayout.vue`: remove the eight-style switcher and render the single Quiet Library homepage, including verified navigation links, category cards, reading paths, and recent content links.
- Modify `docs/.vitepress/theme/override.css`: add homepage-only visual tokens and responsive rules under `.vp-landing`; do not alter document-page selectors.
- Modify `docs/index.md`: keep only the required frontmatter marker for the custom home layout and remove stale VitePress hero/features content that is no longer rendered.
- Do not modify `docs/.vitepress/theme/MyLayout.vue`: its route split already sends `/` to `HomeLayout` and all other routes to the default document layout.
- Do not modify `docs/.vitepress/sidebar.js`, search configuration, theme composables, or article Markdown files.

## Task 1: Verify Existing Route Targets Before Editing

**Files:**
- Read: `docs/.vitepress/config.js`
- Read: `docs/md/guide/getting-started.md`
- Read: `docs/md/wiki/index.md`
- Read: `docs/md/columns/index.md`
- Read: `docs/md/books/index.md`
- Read: `docs/md/tutorial/index.md`
- Read: `docs/md/agi/index.md`
- Read: `docs/md/business/index.md`
- Read: `docs/md/slides/index.md`

- [ ] **Step 1: Confirm the homepage route split.**

  Verify `MyLayout.vue` maps `/` to `HomeLayout` and maps all non-root routes to `DefaultLayout`. Do not change this routing boundary.

- [ ] **Step 2: Confirm every category target exists.**

  Use the existing frontmatter titles and the configured paths in `config.js` to build a link table. The implementation must use these paths:

  ```text
  /md/guide/getting-started
  /md/wiki/
  /md/columns/
  /md/books/
  /md/tutorial/
  /md/agi/
  /md/business/
  /md/slides/
  ```

- [ ] **Step 3: Confirm recent-content links.**

  Select three or four real existing articles from current repository content. Prefer files with valid `date` and `title` frontmatter. Convert their repository paths to clean VitePress URLs and record the exact displayed title and section label. Do not invent article titles or dates.

## Task 2: Replace the Multi-Style Homepage With Quiet Library Markup

**Files:**
- Modify: `docs/.vitepress/theme/layouts/HomeLayout.vue`

- [ ] **Step 1: Remove unused style-switching state and imports.**

  Delete `STYLES`, `STORAGE_KEY`, `landingStyle`, `styleSwitcherOpen`, `currentStyle`, click-outside handling, and the `onMounted`/`onUnmounted` listeners used only by the style dropdown. Keep `useTheme` and `ThemeSwitcher` because the homepage must still follow the existing light/dark theme.

- [ ] **Step 2: Render a single homepage shell.**

  Replace the conditional style sections with this semantic structure:

  ```vue
  <div class="vp-landing theme-{{currentTheme}}">
    <header class="landing-nav">...</header>
    <main class="landing-main">
      <section class="library-hero">...</section>
      <section class="library-section library-start">...</section>
      <section class="library-section library-recent">...</section>
    </main>
  </div>
  ```

  Use Vue `v-for` over local arrays for repeated category and recent-entry markup. Each repeated item must be an `<a>` with a real `href`; do not use click handlers for navigation.

- [ ] **Step 3: Implement the content arrays with verified links.**

  Define focused constants near the top of the `<script setup>` block:

  ```js
  const STARTING_POINTS = [
    { title: '指南', description: '快速进入，解决具体问题', href: '/md/guide/getting-started', featured: true },
    { title: 'Wiki', description: '概念、实体与知识关系', href: '/md/wiki/' },
    { title: '专栏', description: '连续阅读深度主题', href: '/md/columns/' },
    { title: '书籍', description: '系统学习完整方法', href: '/md/books/' },
    { title: '教程', description: '一步一步做出结果', href: '/md/tutorial/' },
    { title: '全部内容', description: '查看知识库所有板块', href: '/md/' },
  ]
  ```

  Replace the `/md/` target above if repository verification shows that route is not a real page; the final implementation must not knowingly create a dead link. Add the remaining verified major areas such as AGI, 商业, and Slides only if the final card count remains readable. The main first-read path must remain Guide, Wiki, Columns, Books, and Tutorial.

- [ ] **Step 4: Add a concise hero.**

  Use the confirmed copy:

  ```text
  A personal knowledge library
  把零散知识，整理成可以反复使用的系统。
  AI、开发、商业、书籍与长期学习的工作记录。安静地阅读，清楚地找到下一步。
  ```

  Include one primary link to `/md/guide/getting-started`; do not add fake metrics or decorative badges.

- [ ] **Step 5: Keep navigation behavior compatible.**

  Keep the existing logo link, GitHub link, and `ThemeSwitcher`. Remove only the homepage style-switcher control. Do not add a second mobile navigation implementation.

## Task 3: Add Scoped Quiet Library Styling

**Files:**
- Modify: `docs/.vitepress/theme/override.css`

- [ ] **Step 1: Add homepage-only design tokens.**

  Add selectors under `.vp-landing` only. Use the Quiet Library palette:

  ```css
  .vp-landing {
    --library-bg: #f8fafc;
    --library-surface: #ffffff;
    --library-ink: #172033;
    --library-body: #475569;
    --library-muted: #94a3b8;
    --library-primary: #2563eb;
    --library-primary-soft: #eff6ff;
    --library-border: #dbe4ef;
  }
  ```

  Add a `.vp-landing.theme-dark` override using existing project dark-theme values and preserve readable contrast. Do not change global `:root` values used by document pages.

- [ ] **Step 2: Implement the desktop layout.**

  Set the shell to a full-width light surface, the inner navigation and main content to a centered max-width column, and the hero to generous but controlled vertical padding. Use thin borders and small-to-medium radii. Use no gradients and no heavy shadows.

- [ ] **Step 3: Implement category and recent-entry states.**

  Category links use a three-column grid on desktop, a light blue featured card for Guide, and white bordered cards for other entries. Recent entries use a single-row list with a subtle bottom border. Hover changes border/background and adds only a small shadow with a 180ms transition.

- [ ] **Step 4: Implement responsive breakpoints.**

  At the existing mobile breakpoint, change the category grid to two columns or one column depending on available width, reduce hero type size, and stack recent-item metadata below the title. Ensure the navigation does not overflow and the content has no horizontal scroll.

- [ ] **Step 5: Respect reduced motion.**

  Wrap decorative transitions in a `.vp-landing` rule and disable them under:

  ```css
  @media (prefers-reduced-motion: reduce) {
    .vp-landing *,
    .vp-landing *::before,
    .vp-landing *::after {
      transition-duration: 0.01ms;
      animation-duration: 0.01ms;
      animation-iteration-count: 1;
    }
  }
  ```

## Task 4: Simplify the Root Home Markdown

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: Preserve only frontmatter required by the custom layout.**

  Keep a valid frontmatter block with the page title and remove the stale `hero` and `features` fields. `HomeLayout.vue` owns the rendered homepage, so the old VitePress home schema must not remain as misleading dead configuration.

  Expected shape:

  ```yaml
  ---
  title: "System Vault"
  layout: home
  ---
  ```

- [ ] **Step 2: Keep the Markdown body empty.**

  Do not duplicate homepage content in Markdown. This prevents the custom layout and Markdown renderer from showing two competing homepages.

## Task 5: Build and Browser Verification

**Files:**
- Verify: `docs/index.md`
- Verify: `docs/.vitepress/theme/layouts/HomeLayout.vue`
- Verify: `docs/.vitepress/theme/override.css`

- [ ] **Step 1: Run the repository build.**

  Run:

  ```bash
  npm run build
  ```

  Expected: VitePress build exits with code 0. This repository has no test or lint script; do not run nonexistent commands.

- [ ] **Step 2: Start a local preview.**

  Run `npm run dev` only when needed for browser verification. Record the process ID so it can be stopped after verification.

- [ ] **Step 3: Verify desktop homepage behavior.**

  At a desktop viewport, verify the header, hero, starting-point cards, recent entries, and footer are visible in the correct order. Click Guide, Wiki, Columns, Books, Tutorial, and one recent article; each must navigate to an existing page.

- [ ] **Step 4: Verify mobile homepage behavior.**

  At approximately 390px width, verify there is no horizontal overflow, the navigation remains usable, cards fit the viewport, and recent-item metadata stacks without clipping.

- [ ] **Step 5: Verify non-home regression boundaries.**

  Open one article page and one Wiki page. Confirm the default VitePress document layout, sidebar, search control, and theme switcher remain available. Do not make unrelated fixes during this task.

- [ ] **Step 6: Stop verification resources.**

  Stop the local VitePress process and close any browser page opened for testing. Remove temporary screenshots or logs created only for this verification.

## Self-Review Checklist

- [ ] The plan only changes the homepage route and homepage styles.
- [ ] The existing document route remains handled by `DefaultLayout`.
- [ ] All links are verified against real repository pages.
- [ ] No runtime filesystem scan, fake metrics, carousel, or second mobile menu is introduced.
- [ ] Light/dark theme and reduced-motion behavior remain supported.
- [ ] `npm run build` and desktop/mobile browser checks are included.

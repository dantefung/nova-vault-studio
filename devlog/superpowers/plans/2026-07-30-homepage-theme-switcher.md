---
title: "首页视觉主题切换器实施计划"
date: "2026-07-30"
source: "Nova Vault Studio"
url: ""
---

# Homepage Theme Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manually switchable Easton Blog-inspired homepage visual theme while preserving Quiet Library as the default and keeping the existing light/dark/sepia color theme independent.

**Architecture:** Keep global color mode in `useTheme.js` under the existing `vp-theme` storage key. Add a separate homepage visual mode in the same composable under `vp-landing-theme`, with only `quiet` and `easton` accepted. `HomeLayout.vue` applies both classes to the homepage root and renders one visual-theme switcher. `override.css` keeps Quiet Library rules as the default and scopes Easton Blog rules under `.landing-theme-easton`, so document pages and the existing color themes are not affected.

**Tech Stack:** VitePress 1.6, Vue 3 `<script setup>`, localStorage, scoped CSS in the existing theme files.

---

### Task 1: Add independent homepage visual-theme state

**Files:**
- Modify: `docs/.vitepress/theme/composables/useTheme.js`

- [ ] **Step 1: Define the independent storage key and accepted values**

Add `LANDING_STORAGE_KEY = 'vp-landing-theme'`, `LANDING_THEMES = ['quiet', 'easton']`, and a module-level `currentLandingTheme = ref('quiet')` without changing `STORAGE_KEY` or `THEMES`.

- [ ] **Step 2: Add SSR-safe initialization and persistence**

Add `initLandingTheme()` and `setLandingTheme(name)` that read/write only `vp-landing-theme`, reject unknown values, and expose `currentLandingTheme` as readonly. Initialize it from `setupTheme()` so the homepage gets a stable value before user interaction.

- [ ] **Step 3: Verify the state API is isolated**

Confirm `useTheme()` returns both existing color-theme members and the new landing-theme members, while `setTheme()` continues to write only `vp-theme` and still applies the document `data-theme`/`.dark` state.

### Task 2: Add homepage visual-theme controls and classes

**Files:**
- Modify: `docs/.vitepress/theme/layouts/HomeLayout.vue`
- Modify: `docs/.vitepress/theme/components/ThemeSwitcher.vue`

- [ ] **Step 1: Apply both independent classes to the homepage root**

Use `currentLandingTheme` in `HomeLayout.vue` and change the root class binding to include `landing-theme-quiet` or `landing-theme-easton` alongside `theme-light`, `theme-dark`, or `theme-sepia`.

- [ ] **Step 2: Render an accessible homepage-style switcher**

Add a compact `LandingThemeSwitcher` component beside the existing `ThemeSwitcher`, with a button, current label, dropdown options for Quiet Library and Easton Blog, active state, click-outside close behavior, and keyboard-focusable buttons. Keep the existing `ThemeSwitcher` responsible only for light/dark/sepia.

- [ ] **Step 3: Keep the control mobile-safe**

Make the navigation controls wrap or compress at the existing mobile breakpoint without changing article-page navigation.

### Task 3: Implement the Easton Blog-inspired homepage theme

**Files:**
- Create: `docs/.vitepress/theme/components/LandingThemeSwitcher.vue`
- Modify: `docs/.vitepress/theme/override.css`

- [ ] **Step 1: Add the Easton visual language as local tokens**

Under `.vp-landing.landing-theme-easton`, define a warm editorial background, ink text, muted body text, accent color, rule color, surface color, and Easton-specific display/body typography choices using existing local font variables or safe system fallbacks.

- [ ] **Step 2: Restyle the existing homepage structure rather than duplicating markup**

Use the current Hero, category grid, recent list, navigation, and footer classes. Give Easton mode stronger editorial hierarchy, asymmetric spacing, numbered/ruled content feel, more distinctive heading scale, and visibly different card/list treatment while preserving the same real links and content.

- [ ] **Step 3: Add dark and sepia combinations**

Define `.vp-landing.landing-theme-easton.theme-dark` and `.vp-landing.landing-theme-easton.theme-sepia` token overrides so the visual theme remains readable under all three global color modes.

- [ ] **Step 4: Add responsive and reduced-motion rules**

Keep the existing 900px and 640px breakpoints usable, avoid horizontal overflow, and ensure any Easton transitions are disabled or reduced under `prefers-reduced-motion: reduce`.

### Task 4: Verify and document the new theme

**Files:**
- Modify: `docs/md/sitelog/features/landing-pages.md`
- Modify: `docs/md/sitelog/dev-log/homepage-quiet-library.md`

- [ ] **Step 1: Document the two independent theme dimensions**

Update the feature documentation and development log to state that homepage visual style (`Quiet Library`/`Easton Blog`) is separate from global color mode (`light`/`dark`/`sepia`) and persists independently.

- [ ] **Step 2: Run repository checks**

Run:

```bash
npm run build
git diff --check
python3 .claude/hooks/check-frontmatter.py docs/md/sitelog/features/landing-pages.md
python3 .claude/hooks/check-frontmatter.py docs/md/sitelog/dev-log/homepage-quiet-library.md
```

Expected: build succeeds; existing Vite warnings may remain; all checks return success.

- [ ] **Step 3: Browser-verify the user-visible behavior**

Verify desktop and 390px mobile states for both homepage visual themes, refresh persistence, all three global color modes, no horizontal overflow, real category/recent links, and unchanged article-page layout.

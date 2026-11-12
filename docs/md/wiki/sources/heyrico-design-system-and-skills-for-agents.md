---
title: "rico（@_heyrico）：构建 AI Agent 能严格遵守的设计系统与 Skills 体系"
date: "2026-11-03"
source: "X/Twitter"
author: "rico (@_heyrico)"
url: "https://x.com/_heyrico/status/2116953958279479760"
coverImage: "../images/heyrico-design-system-and-skills-for-agents/001.jpg"
---

# rico（@_heyrico）：构建 AI Agent 能严格遵守的设计系统与 Skills 体系

> 如何让 Claude Code 等编码 Agent 写出视觉对味、结构严谨的前端界面？作者提出 5 层递进设计系统：Primitives（原始物理值）→ Semantic Tokens（语义别名）→ Components（按职责分组的 shadcn 映射）→ Blocks（真实屏幕提取的业务块）→ Rules & Skills（写在 CLAUDE.md 中的规则与特定任务质检 Skill）。

<!-- more -->

I asked Claude Code to build a screen from my design. It came back very fast, clean, and completely wrong.

At glance, everything looked fine. But when you look into the details, a lot of things were missing.

I couldn’t really blame the agent. I had never told it what makes my product feel right. Those decisions lived in my head, and it had no way to see them.

I think this is what a design system is becoming. It used to be mostly a shared library for a team. Now it is also the place where you write down what good looks like, so an agent can follow along without having to guess.

This is how I have been building mine, one layer at a time.

​

## 1. Start with design primitives

Primitives are the raw values. Colors, type, spacing, radius, shadows, and motion. On their own they don’t mean much yet. They are more like a palette you pick from later.

I keep them in one file that every product reads from:

```css
/* Color */
--gray-0: #ffffff;
--gray-50: #fafafa;
--gray-100: #f4f4f5;
--gray-200: #e4e4e7;
--gray-400: #a1a1aa;
--gray-500: #71717a;
--gray-700: #3f3f46;
--gray-900: #18181b;
--blue-500: #3b82f6;
--green-500: #22c55e;
--amber-500: #f59e0b;
--red-500: #ef4444;

/* Type */
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;
--text-xs: 12px;
--text-sm: 13px;
--text-base: 14px;
--text-lg: 16px;
--text-xl: 20px;
--text-2xl: 24px;
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--leading-tight: 1.25;
--leading-normal: 1.5;

/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;

/* Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;

/* Shadow */
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 12px rgb(0 0 0 / 0.08);
--shadow-lg: 0 12px 32px rgb(0 0 0 / 0.12);

/* Motion */
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

At the top of the file, I added a short note asking the agent to take values from here instead of making new ones. Before that, I would often find small surprises, like a 13.5px font or a 10px gap that didn’t come from anywhere.

I try not to use these values directly in components. They are there to feed the next layer.

​

## 2. Define the semantic foundations

Semantic tokens describe what a value is for, not what it looks like. Instead of “gray-500”, it is “text muted”. Instead of “green”, it is “status success”. Each one points back to a primitive:

```css
/* Surface */
--bg-app: var(--gray-50);
--bg-surface: var(--gray-0);
--bg-subtle: var(--gray-100);
--border-default: var(--gray-200);

/* Text */
--text-primary: var(--gray-900);
--text-secondary: var(--gray-700);
--text-muted: var(--gray-500);
--text-disabled: var(--gray-400);

/* Action */
--action-primary: var(--gray-900);
--action-primary-text: var(--gray-0);
--focus-ring: var(--blue-500);

/* Status */
--status-success: var(--green-500);
--status-warning: var(--amber-500);
--status-error: var(--red-500);
--status-running: var(--blue-500);

/* Layout */
--gap-inline: var(--space-2);
--gap-stack: var(--space-4);
--padding-card: var(--space-4);
--padding-page: var(--space-8);
--radius-control: var(--radius-md);
--radius-card: var(--radius-lg);

/* Elevation */
--elevation-card: var(--shadow-sm);
--elevation-popover: var(--shadow-md);
--elevation-dialog: var(--shadow-lg);

/* Motion */
--motion-hover: var(--duration-fast) var(--ease-smooth);
--motion-enter: var(--duration-normal) var(--ease-smooth);
--motion-panel: var(--duration-slow) var(--ease-smooth);
```

Naming things this way took me a while to get used to. But it makes the agent’s job easier, because it can pick a value by what it needs to do on the screen.

It also helps with color. I try to use green, amber, and red only when they mean something, like a task finishing or something going wrong. When they are used just for decoration, the meaning gets harder to read.

Some values I haven’t decided yet. For those, I leave a note asking the agent to check with me first. Otherwise it tends to fill the gaps with reasonable guesses, and those guesses slowly become part of the product.

​

## 3. Map the components

Components are the pieces you reuse everywhere, like a button, a badge, or a dialog. I use shadcn/ui as a starting point and build on top of it.

Here’s the full shadcn/ui set, grouped by job:

- Actions: button, button-group, toggle, toggle-group, kbd
- Inputs: input, input-group, input-otp, textarea, checkbox, radio-group, switch, slider, select, native-select, combobox, calendar, label, field, form
- Overlays: dialog, alert-dialog, sheet, drawer, popover, hover-card, tooltip, dropdown-menu, context-menu, command
- Navigation: sidebar, navigation-menu, menubar, breadcrumb, tabs, pagination
- Layout: card, item, separator, accordion, collapsible, resizable, scroll-area, aspect-ratio, carousel, direction
- Data: table, chart, avatar, badge, marker, progress
- Feedback: alert, toast, sonner, spinner, skeleton, empty
- Agent and chat: message, message-scroller, bubble, attachment, code-block, trace, questionnaire

For each component I use, I write a few things down:

- When to use it, and when to use something else
- Which variant is the default
- One good and one bad example from real code
- How it looks in each state: hover, pressed, loading, empty, disabled, and error

I also try to only document what actually exists. When I described a variant that wasn’t built yet, the agent kept trying to use it.

​

## 4. Define the blocks

A block is a small section made from components. A run card, an approval panel, a task row with a status and an avatar.

I don’t design blocks up front anymore. I design a few real screens first, notice which parts I keep rebuilding, and only then turn them into blocks. That way they come from the product instead of a template.

Blocks also help keep the product focused. I’ve started to think of every screen as a stack of blocks. A header, a few stat cards, a chart, a list, a side panel. When I can name each part of a screen that way, the agent can build it the same way, one block at a time. And when a screen needs something none of my blocks can do, I take it as a sign to slow down and ask if it really belongs.

Here’s how one of my screens breaks down, block by block.

[video](https://video.twimg.com/amplify_video/2116953929229733888/vid/avc1/1080x720/xF07AWqKr6rLYJMP.mp4?tag=16)

A full screen, taken apart. Each section is a block with its own name and states, and the screen is just those blocks put together.

​

## 5. Set the rules and skills

Tokens, components and blocks tell the agent what to build with. Rules and skills tell it how you like things done.

Rules

A rule is one short sentence with its reason right after it. All your rules live in one file the agent reads every time, like `CLAUDE.md` or `AGENTS.md`. The reason is what helps the agent handle cases you never wrote down.

```
Show a status badge on every run card, even while it's running.
People check agents in passing, so the state should be visible at a glance.

Use only one primary button per screen.
If everything is important, nothing is.
```

The easiest way to write rules is to wait until the agent gets something wrong. Write down what it did, what you wanted, and why. That note becomes your next rule.

Skills

A skill is an instruction file for one specific job, like reviewing a screen. Rules are always on, but a skill is only used when its job comes up.

```
---
name: review-screen
description: Use after building or changing a screen.
---

1. Flag any raw value that isn't a token.
2. Check each block has loading, empty and error states.
3. Check status text matches the real state of the agent.
```

A good skill is clear enough that two people would follow it the same way.

Mine recently caught an approval card that still said “Needs approval” after it had already been approved. It’s a small thing, but small things like that are often what make an agent product feel trustworthy.

​

## What stays with you

An agent can follow a system quite closely. But it can’t really decide what great looks like for you. That part still takes time, and some patience.

I have found that the slower work of writing these things down is what lets everything after it move a little faster.

## 相关页面

- [[concepts/agent-skill]]
- [[concepts/claude-skills]]
- [[concepts/vibe-coding]]

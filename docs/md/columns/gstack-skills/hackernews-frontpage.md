---
title: "hackernews-frontpage"
date: "2026-06-04"
source: "gstack"
url: "https://github.com/garrytan/gstack"
---

# hackernews-frontpage

> Scrape the Hacker News front page (titles, points, comment counts).

<!-- more -->

## 定位

Scrape the Hacker News front page (titles, points, comment counts).

## 所属分组

`browser-skills/`

## 触发

- `scrape hacker news frontpage`
- `scrape hn frontpage`
- `get hn top stories`
- `latest hacker news stories`

## 核心流程/章节

- Usage
- How it works
- Why this is the reference skill

## 原文要点

# Hacker News front-page scraper Scrapes the Hacker News (`news.ycombinator.com`) front page and returns the top 30 stories as JSON. Each story has its rank, title, link URL, point count, and comment count. ## Usage ``` $ $B skill run hackernews-frontpage { "stories": [ { "rank": 1, "title": "...", "url": "...", "points": 412, "comments": 87 }, ... ], "count": 30 } ``` ## How it works 1. Navigates

## 适用场景

- 基于 description 推断：Scrape the Hacker News front page (titles, points, comment counts).

## 参见

- GitHub: [gstack](https://github.com/garrytan/gstack)
- 所属分组：`browser-skills/`

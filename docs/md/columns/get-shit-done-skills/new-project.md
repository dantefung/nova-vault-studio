---
title: "new-project"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# new-project

> Initialize a new project through unified flow: questioning, research (optional), requirements, roadmap. This is the most leveraged moment in any project — deep questioning here means better plans, bet

<!-- more -->

## 定位

Initialize a new project through unified flow: questioning, research (optional), requirements, roadmap. This is the most leveraged moment in any project — deep questioning here means better plans, better execution, better outcomes. One workflow takes you from idea to ready-for-planning.

## 原文要点

## 1. Setup **MANDATORY FIRST STEP — Execute these checks before ANY user interaction:** ```bash INIT=$(gsd-sdk query init.new-project) if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi AGENT_SKILLS_RESEARCHER=$(gsd-sdk query agent-skills gsd-project-researcher) AGENT_SKILLS_SYNTHESIZER=$(gsd-sdk query agent-skills gsd-research-synthesizer) AGENT_SKILLS_ROADMAPPER=$(gsd-sdk query 

## 适用场景

- 基于 description 推断：Initialize a new project through unified flow: questioning, research (optional), requirements, roadmap. This is the most leveraged moment in any proje

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)

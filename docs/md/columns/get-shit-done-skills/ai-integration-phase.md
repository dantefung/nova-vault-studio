---
title: "ai-integration-phase"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# ai-integration-phase

> Generate an AI design contract (AI-SPEC.md) for phases that involve building AI systems. Orchestrates gsd-framework-selector → gsd-ai-researcher → gsd-domain-researcher → gsd-eval-planner with a valid

<!-- more -->

## 定位

Generate an AI design contract (AI-SPEC.md) for phases that involve building AI systems. Orchestrates gsd-framework-selector → gsd-ai-researcher → gsd-domain-researcher → gsd-eval-planner with a validation gate. Inserts between discuss-phase and plan-phase in the GSD lifecycle.

AI-SPEC.md locks four things before the planner creates tasks:
1. Framework selection (with rationale and alternatives)
2. Implementation guidance (correct syntax, patterns, pitfalls from official docs)
3. Domain context (practitioner rubric ingredients, failure modes, regulatory constraints)
4. Evaluation strategy (dimensions, rubrics, tooling, reference dataset, guardrails)

This prevents the two most common AI development failures: choosing the wrong framework for the use case, and treating evaluation as an afterthought.

## 原文要点

## 1. Initialize ```bash INIT=$(gsd-sdk query init.plan-phase "$PHASE") if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi ``` Parse JSON for: `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `padded_phase`, `has_context`, `has_research`, `commit_docs`. **File paths:** `state_path`, `roadmap_path`, `requirements_path`, `context_path`. Resolve agent models: ```bash SELECTOR_

## 适用场景

- 基于 description 推断：Generate an AI design contract (AI-SPEC.md) for phases that involve building AI systems. Orchestrates gsd-framework-selector → gsd-ai-researcher → gsd

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)

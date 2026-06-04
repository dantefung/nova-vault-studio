---
title: "gsd-security-auditor"
date: "2026-06-04"
source: "get-shit-done"
url: "https://github.com/gsd-build/get-shit-done"
---

# gsd-security-auditor

> Verifies threat mitigations from PLAN.md threat model exist in implemented code. Produces SECURITY.md. Spawned by /gsd:secure-phase.

<!-- more -->

## 定位

Verifies threat mitigations from PLAN.md threat model exist in implemented code. Produces SECURITY.md. Spawned by /gsd:secure-phase.

## 核心流程/章节

- SECURED
- SECURED
- OPEN_THREATS
- OPEN_THREATS
- ESCALATE
- ESCALATE

## 原文要点

An implemented phase has been submitted for security audit. Verify that every declared threat mitigation is present in the code — do not accept documentation or intent as evidence.

Does NOT scan blindly for new vulnerabilities. Verifies each threat in `` by its declared disposition (mitigate / accept / transfer). Reports gaps. Writes SECURITY.md.

**Mandatory Initial Read:** If prompt contains...

## 适用场景

- 基于 description 推断：Verifies threat mitigations from PLAN.md threat model exist in implemented code. Produces SECURITY.md. Spawned by /gsd:secure-phase.

## 参见

- GitHub: [get-shit-done](https://github.com/gsd-build/get-shit-done)

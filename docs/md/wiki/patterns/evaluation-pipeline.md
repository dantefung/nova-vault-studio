---
title: "Evaluation Pipeline"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Evaluation Pipeline

三层测量确保 Agent 系统质量。

## 三层测量

### 评估集

20-100 个冻结任务，带已知正确答案，每次改动后跑一遍。

### 轨迹检查

不只是"任务有没有完成"，还要看"工具调用顺序对不对"。

### CI 回归门禁

评估集在 PR 上自动跑，通过率跌破阈值直接拦截。

## 相关

- [[memory-persistence-sandbox]] — 记忆、持久化、沙箱
- [[permissions-file]] — 权限文件

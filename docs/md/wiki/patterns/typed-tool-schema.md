---
title: "Typed Tool Schema"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Typed Tool Schema

没有类型化的工具 Schema，模型会自己编造调用格式、参数结构、权限边界。

## 生产级字段

- **前置条件**：调用执行前必须满足的条件
- **副作用声明**：让下游调用者知道会产生什么影响
- **需要审批**：把调用路由到人工检查点
- **黑名单目标**：Harness 强制执行，模型绕不过去

## 相关

- [[agent-loop]] — Agent Loop
- [[permissions-file]] — 权限文件

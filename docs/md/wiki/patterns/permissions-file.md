---
title: "Permissions File"
date: "2026-06-13"
source: "从零搭建AI Agent团队：9个阶段，从第一个Agent到生产级协作"
url: "https://mp.weixin.qq.com/s/UIEzO9_w06iRB7qpULnIQA"
---

# Permissions File

权限文件声明：团队可以自主做什么、什么需要人类点头、什么绝对不能碰。

## 三级权限

```python
## 始终允许（无需审批）
- 读取项目目录下任何文件
- 运行测试
- 创建分支

## 需要审批
- 合并 PR
- 部署到任何环境
- 安装新依赖

## 绝对禁止
- force push 到 main、production、staging
- 直接访问密钥或凭证
- 修改 permissions.md
```

## 最常被跳过的两层之一

2026 年那些真正交付多 Agent 系统的团队，用的模型和其他人一样。多出来的是 Agent 之间那九层结构。最常被跳过的是共享状态和权限文件。

## 相关

- [[evaluation-pipeline]] — 评估流水线
- [[orchestrator-pattern]] — 编排器

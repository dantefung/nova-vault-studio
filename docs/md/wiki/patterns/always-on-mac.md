---
title: "Always-On Mac"
date: "2026-06-13"
source: "一个 Obsidian、三个入口、一台常驻 Mac：我的 AI 个人工作流"
url: "https://mp.weixin.qq.com/s/m_y0k7Gm15vZn9EVHgyUEQ"
---

# Always-On Mac

一台常驻 Mac 统一执行环境，解决 Agent 需要常驻进程和本地 IO 的问题。

## 为什么必须在家

家里那台 Mac 在我的局域网里，能直接挂载 NAS。Agent 跑在家里 Mac 上，等于站在 vault + NAS 这两份数据之上。

想找一张旧照片、想从 NAS 里某本书抽段原文做引用、想把视频原片喂给视觉模型，全是本地 IO。云服务器解决不了这件事。

NAS 不可能开公网，公网 NAS 也是反模式。你只能把数据传上云，而那就违反了"all in one 本地"的整个前提。

## 常驻 Mac 需要跑什么

- **定时任务**：每日推送、周复盘
- **微信网关**：Hermes Agent 的长轮询接消息
- **长任务**：生成周复盘、批处理笔记

## 方案

一台老 MacBook 接着电源、合盖不睡眠，24 小时跑 Codex 和 Hermes Agent。重活全在它身上，外面所有设备只负责三件事：看、触发、轻编辑。

## 相关

- [[local-data-backbone]] — 数据底座
- [[four-layer-workflow]] — 四层架构

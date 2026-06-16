---
title: "LAN NAS Access"
date: "2026-06-13"
source: "一个 Obsidian、三个入口、一台常驻 Mac：我的 AI 个人工作流"
url: "https://mp.weixin.qq.com/s/m_y0k7Gm15vZn9EVHgyUEQ"
---

# LAN NAS Access

在局域网内直接挂载 NAS，让 Agent 站在完整数据之上。

## 核心问题

云服务器无法访问家庭 NAS 上的数据：
- 照片库、视频原片
- 扫描的家庭文件
- 电子书、影视收藏

NAS 不可能开公网，公网 NAS 也是反模式。你只能把数据传上云，而那就违反了"all in one 本地"的整个前提。

## 解决方案

常驻 Mac 在局域网里，能直接挂载 NAS。Agent 跑在家里 Mac 上，等于站在 vault + NAS 这两份数据之上。

## 数据分层

- **Obsidian vault**：轻量的「我的判断 / 我的笔记」
- **NAS**：重的原始素材（照片、视频、家庭文件、电子书）

## 相关

- [[always-on-mac]] — 常驻 Mac
- [[local-data-backbone]] — 数据底座

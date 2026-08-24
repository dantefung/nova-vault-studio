---
title: "我在 iPhone 上装了 DeepSeek Harness，还让它自己审讯了自己"
date: "2026-08-24"
author: "康叔AI"
source: "飞书文档"
url: "https://my.feishu.cn/docx/KDRndy4iIoLTQVxQ6XyckDuenAh"
---

# 我在 iPhone 上装了 DeepSeek Harness — 精读摘要

作者：康叔AI，飞书文档，2026-08-24

## 核心判断

DSH 不是 Claude Code 竞品，而是 Agent 运行时底座，对标 LangGraph / AutoGen 编排框架层。核心理念：Everything is a Plugin，一切皆插件。

## 类比

- Claude Code / Codex = iOS：订阅绑定、能力封闭、自定义空间极小
- DSH = 安卓：大框架、插件生态完全开放

独特身位："模型亲自下场做框架" + Python SDK 单文件运行时（55MB，不用装 Node.js）

## iPhone 部署成果

装上 iSH 后能跑完整 coding agent + 多智能体审讯流水线：

1. 单任务推理
2. 完整 coding agent（写文件、跑命令、验证结果）
3. 多智能体审讯流水线（主 Agent 召唤三个子代理：架构师/红队/机会猎人，独立会话独立上下文，观点真实分歧）
4. Flash vs Pro 盲评竞技场（Kimi K3 当裁判，顺序打乱防位置偏差）

实测：Pro 36/40 vs Flash 24/40，Pro 完胜。流水线分工：Flash 当执行者，Pro 当思考者。

## 五道关卡

| # | 问题 | 解法 |
|---|------|------|
| 1 | 200+ npm 依赖树太大，进程被静默杀 | 拆 61 个直接依赖单包逐个装，分六轮 |
| 2 | node-pty 无 Linux ARM64 预编译件 | JS stub 假模块，headless 模式不需要真 PTY |
| 3 | fetch 拿不到流式响应（`response.body === null`） | Node `https` 模块重写 fetch polyfill |
| 4 | 内存不够跑完整配置 | 声明式禁用 18 个重型插件，一行 `disabled: true` |
| 5 | bash 工具被沙箱策略拒绝 | `DSH_PERMISSION_MODE=danger-full-access` |

## 最终评价

- 定位：好玩的"乐高"，不适合生产，稳定性不行，真干活不如 Codex 和 Claude Code
- 玩法：创造模式自建官方没有的新模式，DIY 空间最大乐趣
- 成本：缓存命中率已达 93%，大家用相同 Cordis 内核插件则好优化

## 核心收获

一台 iPhone = 完整多智能体工作站。地铁上掏手机让审讯团解剖开源项目，八分钟后看报告。

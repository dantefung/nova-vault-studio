---
title: "从零开始，搭建你的 Harness，定制化懂你的 Agent"
date: "2026-08-17"
source: "微信公众号：空格丶"
url: "https://mp.weixin.qq.com/s/J7Cj0k8MMO4Lq955Nqwr3g"
---

# 从零开始，搭建你的 Harness，定制化懂你的 Agent

> DeepSeek 把 harness 带火了——harness 是模型之外、让模型能干活的整套结构。DeepSeek Harness 再强，但它给的只是内核。

## 三个 Skill 帮你搭建一个懂你的个人 Agent

作者 SpaceZephyr（空格丶）在 GitHub 上放了三个围绕 Harness 展开的 Skill：

| Skill | 功能 | 适用场景 |
|-------|------|---------|
| **star**（star-your-harness） | 创建 | 从零搭建 harness 目录骨架 |
| **better**（better-your-harness） | 完善 | 给已有 harness 做体检 |
| **view**（view-your-harness） | 可视化 | 搭建个人工作台 |

安装：`帮我安装 Skill https://github.com/SpaceZephyr/build-your-harness.git`

![三个 Skill 概览](images/harness-three-skills/001.png)

---

## 01 star-your-harness：从零搭你的 harness

如果你现在开始接触 Agent，刚装完 codex、workbuddy、DSH，面临的第一件事是选择本地文件夹。

![本地文件夹选择](images/harness-three-skills/002.png)

这个本地文件夹可以作为项目文件，被 Agent 读取和写入。它的关键程度好比你给 AI 塞了一个定制化的大脑和双手。里面你能放各种和你工作相关的文件，还有 Skill、插件这类工具。

但是，通常我们电脑文件很乱，很难选择合适的项目文件。这时候就可以从 star-your-harness 开始。

**使用流程**：发送「帮我搭一个 xxx 职位的 harness」

它先问你四个问题：
1. 你是干什么的
2. 想让 AI 帮你做什么
3. 现在的资料散在哪
4. 打算放哪儿

然后按你的职业生成目录骨架，包含：
- 入口 `CLAUDE.md`
- `about-me` 上下文层
- 记忆层和索引
- 协议层
- 工具层
- `.gitignore` 和 hooks

![目录骨架生成](images/harness-three-skills/003.png)

每个目录旁边标着它属于 harness 的哪一层。不会对本地的文件做删除，破坏性动作一律先出方案等你确认。

---

## 02 better-your-harness：给你的 harness 做体检

如果你已经有一套本地维护好的文件夹，就可以用 better-your-harness 这个 Skill。

它按五层扫描，产出一份自包含的 HTML 报告，双击就能看：

![诊断扫描报告](images/harness-three-skills/004.png)

总共查 34 项，分五个方面：

### 1）安全与隐私

检测 `.gitignore` 有没有、覆不覆盖常见噪音、有没有明文凭证、凭证有没有被跟踪、仓库是 public 还是 private、Agent 权限开到多大。

### 2）上下文质量

**作者说这层最重要**——模型读你本地的文件到底要消耗多少 tokens。

> 我的文件首次加载要消耗 12878 token。这是一个 Agent 从零理解这个项目、光读入口文件和各层 README 就要吃掉的量。

![上下文质量检测](images/harness-three-skills/005.png)

信噪比、目录深度、超大文件、索引里的死链，也都在这一层。

### 3）工具装备

Skill 装了多少、MCP 接了几个、有没有子 Agent 和自定义命令。以及 Skill 的真实调用情况分析。

![工具装备检测](images/harness-three-skills/006.png)

### 4）记忆学习

检测记忆目录在不在、有没有索引、索引里有没有指向不存在文件的死链、有没有文件游离在索引之外。有没有迭代记录和复盘、距上次提交多少天、工作区堆了多少未提交改动、Skill 还在不在更新。

![记忆学习检测](images/harness-three-skills/007.png)

### 5）修复提示词

最后给几个可以直接复制的修复提示词。这些修复提示词，按严重度排序，每条一个按钮。点一下复制，粘给 Claude Code 或 Codex 就能修。

口令里有绝对路径、具体文件清单、验证命令，以及一句「先给我看，不要直接改」。

扫描器只报路径和变量名，任何密钥的值都不会出现在报告里。

---

## 03 view-your-harness：搭建你的个人工作台

前两个回答的是「我的 Harness 哪里有问题」，这个回答的是「我的 Harness 该怎么用」。

它起一个本地服务，把你的文件夹和 Skill 变成一面卡片墙。

统计你本地项目文件共有多少个，按文档、代码、数据、图片做分类。对于 markdown 文件可以直接预览和修改。能够交给 AI 让其分类整理。

![工作台文件卡片墙](images/harness-three-skills/009.png)

还有一个 Skill 页，本项目下的 Skill 全部列出来。统计这些 Skill 的调用次数，没用的可以直接删掉。也可以选择调用。

![Skill 管理页](images/harness-three-skills/010.png)

这就是你的项目文件夹的可视化展示，也是一个简单的个人工作台。可以用在任意 Agent 里。

---

## 最后

如果你下载了 Agent，不知道怎么开始；如果你用了 Agent 的过程中觉得它不懂你；如果你对于操作 Agent 觉得不够便捷——就可以使用这 3 个 Skill 完善你的 Harness，搭建你自己的 Agent。

**核心观点：有了一个属于自己的 Harness，不管换了什么 Agent，都可以让自己的工作无缝衔接。**

GitHub 地址：/SpaceZephyr/build-your-harness

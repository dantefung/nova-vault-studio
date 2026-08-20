---
title: "超详细！Matt Pocock 的 Skills 到底应该怎么用"
date: "2026-07-12"
source: "LC"
url: "https://mp.weixin.qq.com/s/p3trAG_yDXSHox1bXeKJvw"
---

# 超详细！Matt Pocock 的 Skills 到底应该怎么用

> 前几天发了一篇关于 Matt Pocock 的 Skill 内容总结，一些同学后台私信想知道这些 Skill 具体在工作或者学习中应该如何使用，或者说如何修改这些 Skill 才能更符合我们的要求。接下来根据使用经验，对这些 Skill 内容进行使用场景说明和一些优化建议。

![概述图](images/matt-pocock-skills-use/001.png)

## 常用 Skill 一览

| Skill | 用途 |
|------|------|
| **setup-matt-pocock-skills** | 在第一次使用现有项目或新建项目时运行一次，配置相关过程文件保存位置 |
| **ask-matt** | 刚开始使用这些 Skills 时，不知该用哪些，输入需求他会给出建议 |
| **teach** | 将问题分解成不同的 Lesson，每节有 HTML 教学文档和一个问题，辅助学习 |
| **grill-me** | 需求比较模糊、自己也没想清楚具体怎样做时，通过问答形式明确需求 |
| **to-prd** | 将讨论过程总结成一篇文档 |
| **to-issues** | 将文档拆分成一个个明确的 Issue |
| **implement** | 根据 Issues 进行实现，然后自动进行单元测试和代码审计 |
| **handoff** | 将已做的工作内容整理成一份文档，用于在新的 Agent 中或交给其他人继续使用 |

---

## setup-matt-pocock-skills

这个 Skill 是在想要学习的项目或创建新项目时一次性使用。执行后会先寻找项目中与 Agent 相关的文档或路径（CONTEXT.md、CLAUDE.md、/docs/agent/ 等），目的是快速了解项目结构。

然后主要做几件事：

1. **Issues 存放位置**：默认使用 GitHub 提交 Issue，也可以指定本地 Markdown 方式保存
2. **Issue 分类标签**：标识每个 Issue 的状态（待分诊、信息不足、可交给 Agent、需要人处理、决定不修）
3. **创建 CONTEXT.md**：在项目根目录下创建 CONTEXT.md 和 docs/adr/，记录项目通用信息

![配置入口](images/matt-pocock-skills-use/002.png)

选择本地 Markdown 方式保存 Issue：

![保存方式](images/matt-pocock-skills-use/003.png)

配置 triage 名称类别：

![标签配置](images/matt-pocock-skills-use/004.png)

配置 CONTEXT.md：

![CONTEXT 配置](images/matt-pocock-skills-use/005.png)

默认选择 single-context 即可；如果项目既有前端也有后端，可选择 multi-context，根目录下的 context-map.md 会指向每个模块的 context.md。

![配置完成](images/matt-pocock-skills-use/006.png)

完成后，CONTEXT.md 和 docs/adr 会在类似 domain-modeling 的 Skill 运行后生成。

---

## ask-matt

用熟悉之后使用次数会逐渐变少，主要根据需求提供参考的 Skill 使用路径与建议。以 Hermes 中 self-evolving 为例，问了一下方案：

**方案 A**：

![方案 A](images/matt-pocock-skills-use/007.png)

**方案 B**：流程就是在日常代码使用中最常用的一些 Skill。

![方案 B](images/matt-pocock-skills-use/008.png)

**方案 C**：

![方案 C](images/matt-pocock-skills-use/009.png)

还会给出一些不应该使用的 Skill 建议和下一步建议。

![建议](images/matt-pocock-skills-use/010.png)

---

## teach

在快速开始项目时使用。会将问题分为几个 Lesson 来教，每次一个网页和一个问题，回答后进入下一课。

![第一课](images/matt-pocock-skills-use/011.png)

---

## grill-with-docs & grill-me

**grill-with-docs** 是基于当前项目进行交互，通过问答方式辅助理清项目内容。

**grill-me** 适用于自己也不清楚要做内容时（如设计新 App 但细节未想好），通过问答细化需求。

以学习 Hermes Agent 记忆模块实现方式为例：

![grill-with-docs 示例](images/matt-pocock-skills-use/012.png)

想要修改某些方面的代码时，可以使用这个 Skill，它会通过问答方式引导将需求完善，直到所有需求都梳理清晰。

---

## to-prd

将刚才与 AI 交流的内容转写为一篇文档，用于指导后续工作或直接提出 Issues。

![to-prd](images/matt-pocock-skills-use/013.png)

执行后会在项目的 `.scratch/scheduled-review/PRD.md` 路径下生成会话总结文档。

---

## to-issues

根据之前梳理的内容将需求拆分成多个 Issues，并自动按照依赖关系给出正确的实现顺序。

![to-issues](images/matt-pocock-skills-use/014.png)

然后会对一些 Issue 粒度上的问题进行处理：

![Issue 粒度调整](images/matt-pocock-skills-use/015.png)

> **注意**：原始的 Skill 会自动提交代码，如果只希望 AI 做出修改、人工 review 后才 commit，需要修改 SKILL.md，删掉自动 commit 的命令描述。

---

## implement

根据明确的需求文档进行测试，并编写测试用例进行测试。

![implement](images/matt-pocock-skills-use/016.png)

---

## handoff

将所有工作整理成一份交接文档，交给下一个 Agent 或人来继续执行。

![handoff](images/matt-pocock-skills-use/017.png)

---

## 最后

执行完这些 Skill 后，项目目录下会生成保存 Issue、doc、teach 等相关的过程文档，以及根目录下的 CONTEXT.md 文档。

![项目结构](images/matt-pocock-skills-use/018.png)
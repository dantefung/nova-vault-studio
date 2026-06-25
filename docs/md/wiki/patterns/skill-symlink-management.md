---
title: "Skills 极客管理方式：软链接工作流"
date: "2026-06-25"
source: "公众号整理"
---

# Skills 极客管理方式：软链接工作流

## 核心原则

**Skills 只装在项目里，不装全局**。全局 Skill 积少成多占上下文窗口空间，Claude 容易误触发，白白浪费工作台。

只在项目内安装真正需要的 Skills，工作台上只摆当前用得到的资料，把宝贵的上下文空间留给更重要内容。

## 三步操作

### 第一步：下载开源 Skills 到统一仓库

```
~/GitHub/baoyu-skills      ← 存放各种 Skills 的开源项目
~/GitHub/baoyu-design      ← 另一个开源项目
```

### 第二步：在项目中创建软链接

```
项目内的路径                         →  实际指向的位置（原件）
.agents/skills/baoyu-comic          →  ~/GitHub/baoyu-skills/skills/baoyu-comic
.agents/skills/baoyu-design         →  ~/GitHub/baoyu-design/skills/baoyu-design
```

### 第三步：给 Claude Code 建入口

```
.claude/skills  →  .agents/skills
```

## 不用记命令，让 Agent 帮你干

直接用自然语言告诉 Codex/Claude Code：

> 帮我把 ~/GitHub/baoyu-skills/skills/baoyu-comic 软链接到 .agents/skills/baoyu-comic

甚至更简单：

> 帮我把 baoyu-skills 项目里的 baoyu-comic 这个 skill 链接到当前项目

Agent 会自动帮你创建软链接，后续的维护、添加、删除也都可以交给它。

## 两个核心好处

**好处一：更新只需一次**。当开源项目有更新时，只需要在仓库目录拉取最新代码，所有用到这个 Skill 的项目就自动变成最新版了。

**好处二：修了 bug 可以直接反哺开源**。在项目里发现问题，直接让 Agent 修复，因为是软链接，Agent 修改的是仓库里的原件，可以顺手给开源社区做贡献。

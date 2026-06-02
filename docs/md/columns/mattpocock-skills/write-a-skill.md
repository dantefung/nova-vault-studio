---
title: "write-a-skill 技能：创建具有专业结构的新技能"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# write-a-skill 技能：创建具有专业结构的新技能

## 定位

创建具有**适当结构、渐进式披露和捆绑资源**的新技能。

## 技能结构规范

每个技能至少包含：

```
skills/
└── [skill-name]/
    └── SKILL.md    ← 技能主文件
    ├── README.md   ← 可选，给人类阅读的说明
    ├── resources/  ← 可选，捆绑的资源文件
    └── scripts/    ← 可选，自动化脚本
```

## 渐进式披露原则

SKILL.md 的内容按**信息密度递增**排列：

1. **触发词** — 什么情况下使用此技能
2. **一句话定位** — 此技能解决什么问题
3. **核心流程** — 步骤化的操作流程
4. **详细说明** — 每个步骤的具体要求和输出
5. **示例** — 典型使用场景的输入输出示例
6. **资源** — 相关文档、脚本的引用

## write-a-skill 产出

创建新技能时，write-a-skill 帮你：

1. 定义**触发词**（trigger phrases）
2. 设计**工作流**（workflow）
3. 确定**确认门槛**（confirmation threshold）
4. 安排**渐进式披露**（progressive disclosure）
5. 规划**资源引用**（references/scripts/assets）

## 与其他技能的关系

write-a-skill 是**技能生产技能**，所有其他技能的创建都依赖它。

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-me](./grill-me.md)、[caveman](./caveman.md)
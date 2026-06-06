---
title: "Yao Open Skills — 把方法论沉淀成可复用 AI 资产的 Skill 合集"
date: "2026-06-04"
source: "GitHub"
url: "https://github.com/yaojingang/yao-open-skills"
---

# Yao Open Skills — 把方法论沉淀成可复用 AI 资产的 Skill 合集

> OpenYao 公开 Skill 合集：把决策、商业分析、学习教程、研究取证和文档生成流程沉淀成可复用的 AI 资产。1.1k Stars。

<!-- more -->

## 核心理念

`YAO = Yielding AI Outcomes`。重点不是堆更多 prompt 文本，而是把有效的方法、流程、评估、审美约束和执行边界沉淀成可复用、可维护、可评估的 AI 资产，最终产生真实可交付的结果。

**收录标准**：
- 主题清晰，别人看到名称就知道解决什么问题
- 可复用，不依赖私有上下文
- 可清理，能移除敏感信息
- 可维护，愿意持续修复和迭代

## Skill 体系

### yao-expert-skill（行业学习专家）

用户提到的核心 Skill：**快速建立行业认知结构**。

**输入**：任意行业/话题/技术/市场

**输出**：
- 有来源支撑的专家学习报告
- 边界、分类、价值链、生命周期、竞争、政策、风险、机会分析
- 50-100 个关键词教学卡
- 费曼自测题 10 道（含参考答案）
- 专家学习教程路径
- 四种格式：Markdown / Word / PDF / HTML

**方法论**：先定边界，再拆分类/价值链/玩家/政策/风险/机会 → 区分事实/推断/假设/未知 → 关键词教学卡 → 教程路径 → 费曼自测

**五种专家能力**：
1. 界定行业边界
2. 理解行业结构
3. 识别关键变量
4. 判断变化方向
5. 能把复杂行业讲给外行听

### 其他公开 Skills

| Skill | 定位 |
|-------|------|
| yao-crux-skill | 主次矛盾诊断 Skill |
| yao-bayesian-skill | 证据到行动的贝叶斯决策 |
| yao-gametheory-skill | 博弈论战略报告 |
| yao-tutorial-skill | 从主题到完整教程的生产型 Skill |
| yao-weread-skill | 微信读书数据可视化报告 |
| yao-websecurity-skill | 授权网站安全审查（275 个检查项） |
| yao-business-skill | 商业分析 |
| yao-copyright-skill | 版权相关 |
| yao-kelly-skill | Kelly 公式相关 |

## 目录结构

```
yao-open-skills/
├── docs/              # 发布规则、命名规范、仓库设计
├── registry/          # Skill 登记表（事实源）
├── scripts/           # 辅助脚本
└── skills/           # 已收录 Skill 副本
    ├── yao-expert-skill/
    ├── yao-crux-skill/
    ├── yao-bayesian-skill/
    ├── yao-gametheory-skill/
    └── ...
```

## 数据

- **1.1k Stars** · **119 Forks** · **91 Commits**
- HTML 94% · Python 5.7%

## 关联资源

- [yao-meta-skill](https://github.com/yaojingang/yao-meta-skill) — 元方法引擎，定义如何系统化创建、评估、治理 Skill
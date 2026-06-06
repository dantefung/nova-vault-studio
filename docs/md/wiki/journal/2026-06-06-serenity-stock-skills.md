---
title: "2026-06-06 日志：Serenity 白发女股神 Skill 合集"
date: "2026-06-06"
---

# 2026-06-06 日志：Serenity 白发女股神 Skill 合集

## 背景

尼卡分享的 X 推文：Serenity（@aleabitoreddit）白发女股神的 Skill 合集，昨天发的一篇跑了 10w+ 流量。这次把所有 GitHub 上 Serenity Skill 一网打尽，共 7 个仓库。

## 7 个仓库一览

| 仓库 | 一句话 | Stars |
|------|--------|-------|
| [stock-skill](/wiki/sources/stock-skill) | 三人框架合议：Serenity × TraderS × 恨铁，覆盖宏观/卡脖子/技术执行全链路 | 16 |
| [serenity-aleabitoreddit](/wiki/sources/serenity-aleabitoreddit) | 完整推文档案（5813 条推文）+ 供应链卡点 Skill，112 Stars，最完整版 | 112 |
| [serenity-aleabitoreddit-skill](/wiki/sources/serenity-aleabitoreddit-skill) | 卡点投资分析技能，支持 6 个 Agent 平台（Claude/Codex/Cursor/Gemini/Windsurf等） | 23 |
| [serenity-aleabitoreddit-skill-zad](/wiki/sources/serenity-skill-zad) | 供应链卡点逆向投资方法论，Claude Code 专用，2071 条推文提炼 | 15 |
| [serenity-skills-xvhaoran](/wiki/sources/serenity-skills-xvhaoran) | 跨市场版（A股/美股/港股/台股/日股/欧洲），贝叶斯更新框架 | 7 |
| [serenity-skill-0xagata](/wiki/sources/serenity-skill-0xagata) | 粉丝站，4740 条推文，Claude Project + ChatGPT Custom GPT 双入口 | 14 |
| [serenity-stock-choke](/wiki/sources/serenity-stock-choke) | A 股适配版，六步推理链路，覆盖电力/光模块/半导体/军工/新能源车等 | 12 |
| [serenity-skill-muxuuu](/wiki/sources/serenity-skill-muxuuu) | Serenity 式供应链卡点股票研究，中文优先，356 Stars，Stars 最多版 | **356** |

## 关键洞察

### Serenity 的核心方法论

不是追 AI 龙头（NVDA），而是**沿着供应链向上游逆向追溯**，找那个"下游无法绕开的单点卡脖子"——光学/CPO、复合半导体衬底、存储、電力。

核心问题：**哪个小市值节点，一旦断货，万亿产业就要地震？**

### 三层决策框架（stock-skill 首创）

- **Serenity**（供应链）→ 买什么
- **TraderS**（宏观）→ 现在能不能买
- **恨铁不成小猫猫**（技术执行）→ 今天进不进

三人**永久分歧**是 feature 不是 bug——分歧产生张力，张力产生更严谨的决策。

### A 股适配的多样性

同一套方法论，针对不同市场有不同实现：
- 美股版：yan-labs 最完整（112 Stars），ZadAnthony 最精深（2071 条推文）
- A 股版：fadewalk 的六步链路最结构化
- 跨市场：xvhaoran 的贝叶斯更新框架最通用

### Skill 分化规律

跟 UI Skill 一样，Serenity Skill 也遵循**同一方法论多人蒸馏**的规律：
- 完整度分化：5813 条推文全档 vs 精简版
- 平台分化：Claude Code 专用 vs 通用多 Agent
- 市场分化：美股 vs A 股 vs 跨市场
- 深度分化：方法论（methodology）vs 操作流（SKILL.md）

## 风险提示

所有仓库都明确标注：**不是投资建议**。Serenity 的 YTD 45 倍战绩均为自述、未经审计，且存在幸存者偏差和"talking his book"嫌疑。使用框架做研究可以，照搬交易后果自负。

## 关联

- 与 [[go-stock]] 同属 AI 赋能股票分析类工具，但 go-stock 是技术指标方向，Serenity Skill 是供应链卡脖子方向
- 框架方法论类似 [[geju-skill]] 的"打开格局"——都是给 AI 装上特定思维透镜

---

## 今日其他收录

### awesome-codex-skills — Codex Skills 精选列表

[ComposioHQ/awesome-codex-skills](https://github.com/ComposioHQ/awesome-codex-skills)：Codex Skills 精选列表，40+ Skills 覆盖开发/协作/写作/数据分析，13k Stars，1.3k Forks。Composio 出品，每个 Skill 独立文件夹含 `SKILL.md` + 脚本 + 参考资料，可通过 `skill-installer` 一键安装。

**分类维度**：
- 开发工具：codebase-migrate、deploy-pipeline、pr-review-ci-fix、mcp-builder、sentry-triage
- 生产力：connect（1000+ 应用）、linear、notion 系列、meeting 系列
- 写作：email-draft-polish、changelog-generator、content-research-writer、tailored-resume-generator
- 数据：spreadsheet-formula-helper、datadog-logs、langsmith-fetch、lead-research-assistant
- Meta：skill-creator、skill-installer、template-skill

### cell-architecture-studio — 3D 细胞结构交互画廊

[cclank/cell-architecture-studio](https://github.com/cclank/cell-architecture-studio)：React + Three.js 3D 细胞结构画廊，7 种细胞类型（植物细胞/白细胞/神经元/上皮细胞/细菌/动物细胞/肌肉细胞），高保真 GLB 模型，AI Tutor 面板，对比模式，1k Stars。

**技术栈**：React 19 + TypeScript + Vite + Three.js + React Three Fiber + Drei，Playwright 视觉验证覆盖桌面/紧凑/移动端。

---

## 今日汇总

今日共归档 **10 个资源**：

| 资源 | Stars | 类型 |
|------|-------|------|
| awesome-codex-skills | 13k | 精选列表 |
| serenity-skill-muxuuu | 356 | Skill |
| serenity-aleabitoreddit | 112 | Skill |
| cell-architecture-studio | 1k | Product |
| serenity-aleabitoreddit-skill | 23 | Skill |
| serenity-skill-zad | 15 | Skill |
| serenity-stock-choke | 12 | Skill |
| serenity-skill-0xagata | 14 | Skill |
| serenity-skills-xvhaoran | 7 | Skill |
| stock-skill | 16 | Skill |

另有段永平播客日记一篇（[[2026-06-06-duan-yongping]]）。

**今日主题**：Serenity Skill 全家桶 — 同一种供应链卡脖子投资方法论，被 8 个不同作者蒸馏成不同版本（完整度/平台/市场/深度四个维度分化），加上一个 Codex Skills 精选列表和一个 3D 教育产品。
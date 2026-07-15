---
title: "小红书运营手册·AI工作台"
date: "2026-07-13"
source: "王梦珂"
url: "https://github.com/nihe0909/xiaohongshu-ai-workbench"
---

作者：王梦珂｜畅销书《爆款》作者｜好事发生App开发者

配套手册：https://xiaobot.net/p/xiaohongshuku

这是配合《小红书运营手册》使用的一组免费开源Codex Skills，给有好产品、有真实经验、但不知道怎么把它讲清楚的人用。

手册负责讲判断。AI工作台负责帮你执行。

它来自好事引力长期做小红书诊断、内容策划和品牌表达时反复用到的工作流：标题、主页、选题、评论区、成交路径，都不应该靠灵感硬猜，而应该拆成可以检查、可以复用、可以交给AI执行的动作。

它不是手册的替代品，也不是公式库。项目不内置外部案例、外部公式库或第三方背书，也不承诺涨粉、爆款、成交或平台算法结果。每个skill只解决一个清晰工作流，适合独立安装，也可以组合使用。

## 适合谁

- 有产品、服务、工具、课程、作品或真实经验，但不知道怎么在小红书说清楚
- 自由职业者、个人IP、服务号、产品号、小程序开发者和独立创作者
- 想把主页、标题、选题、评论和转化路径系统化，而不是每次从零开始
- 愿意基于真实输入改表达，不想用夸大承诺、搬运案例或伪爆款套路

## 不适合谁

- 想要保证涨粉、保证成交、保证爆款
- 想直接套用外部案例、名人语录或第三方背书
- 没有明确产品、服务、内容材料，只想让AI凭空编一个账号
- 只想追热点，不愿意把自己的用户、价值和交付讲清楚

## 第一批Skills

| Skill | 用途 | 适合什么时候用 |
|-------|------|--------------|
| xiaohongshu-suite | 母skill，路由和组合工作流 | 不知道该先优化哪里，想要一整套小红书建议 |
| xiaohongshu-title | 标题生成、标题诊断、标题优化 | 要起标题、改标题、判断标题方向 |
| xiaohongshu-profile | 主页体检+简介改写 | 要看主页第一眼、定位、简介、置顶是否清楚 |
| xiaohongshu-topic-planner | 选题策划和系列规划 | 要做选题池、系列内容、发布顺序 |
| xiaohongshu-comment-reply | 评论回复和置顶评论 | 要回复评论、引导讨论、处理质疑、引导私信 |
| xiaohongshu-conversion-path | 成交路径设计 | 要把内容、主页、私信和产品转化连起来 |

## 推荐工作流

账号冷启动：
```
xiaohongshu-profile -> xiaohongshu-topic-planner -> xiaohongshu-title
```

发一篇新笔记：
```
xiaohongshu-topic-planner -> xiaohongshu-title -> xiaohongshu-comment-reply
```

想卖服务或产品：
```
xiaohongshu-profile -> xiaohongshu-conversion-path -> xiaohongshu-topic-planner -> xiaohongshu-title
```

笔记发出后运营评论区：
```
xiaohongshu-comment-reply
```

## 安装

下载packages/里的.skill文件并导入Codex。第一批安装包：
- xiaohongshu-suite.skill
- xiaohongshu-title.skill
- xiaohongshu-profile.skill
- xiaohongshu-topic-planner.skill
- xiaohongshu-comment-reply.skill
- xiaohongshu-conversion-path.skill

或者clone仓库后运行：
```
python3 scripts/package_all.py
python3 scripts/validate_all.py
```

## 设计原则

- 每个skill只解决一个稳定工作流
- 先诊断问题，再给可执行输出
- 不编造数据、案例、效果、背书
- 不承诺涨粉、成交、爆款或平台算法结果
- 适合小红书/RED社媒场景，不泛化成普通写作工具

## 许可证

MIT License

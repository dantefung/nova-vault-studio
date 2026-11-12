---
title: "MixAILab 万象AI实验室：用 WorkBuddy + SRT 把口播稿批量做成 HTML 视频"
date: "2026-09-20"
source: "X/Twitter"
author: "MixAILab 万象AI实验室 (@mixailab)"
url: "https://x.com/mixailab/status/2101626520955748622"
---

# MixAILab 万象AI实验室：用 WorkBuddy + SRT 把口播稿批量做成 HTML 视频

## 核心结论

传统 AI 视频最痛的是「配音讲到下一页、画面还卡在上一页」。MixAILab 给出的解法是把 SRT 字幕直接交给 AI 当**画面排期表**——卡片什么时候弹、哪一秒切场景，都钉死在时间戳上。再用 WorkBuddy（Codex / Claude Code 同款 AI Agent）一气呵成生成 HTML 动画 + 用 HyperFrames 逐帧渲染成 MP4。**第一条要反复调，但 HTML 模板完整保留后，后续视频只换 mp3 + srt 就能复用同一视觉风格。**

## 关键洞察

1. **SRT 是画面排期表，不是字幕**：普通做法把整篇文案丢给 AI 让它猜每页该停多久，猜不准就翻车。这套方法把 SRT 字幕直接喂给 AI——它拿到起止时间戳，就有了「第几秒该弹哪张卡」的硬约束，画面与配音逐句同步。
2. **分工清晰：HTML 负责画面，HyperFrames 负责时间轴和渲染**：HTML/CSS/GSAP 写单帧画面，HyperFrames 把这些帧按时间组合成 MP4。两层解耦是这条流水线能批量化复用的关键。
3. **AI Agent 是执行器，不是创作**：人只负责「写口播稿 + 录音频 + 校对 SRT + 选参考图」这四份素材，然后连同工作空间丢给 WorkBuddy + 一段结构化 Prompt；Agent 负责检查时长、设计样式、生成 HTML、运行 check、修复溢出、最终渲染、生成 contact-sheet。不交付代码，必须实际导出 MP4。
4. **HTML 模板是真正的资产**：第一条视频慢、要反复调，但调到满意后 HTML 配色/字体/版式/动画节奏完整沉淀为模板。下一条视频只需要 ① 上一条模板 ② 新 mp3 ③ 新 SRT，告诉 AI「非必要不修改现有设计参数」，同款视觉风格就能持续往下出。
5. **参考图决定视觉上限**：AI 现在写 HTML 的能力足够，能实现各种动效，但参考图不到位就只能出平庸效果。参考图给得越精准，最终视觉越接近预期。
6. **WorkBuddy 是 Plan 模式 + 工作空间隔离 + 配置文件驱动**：避免 AI 误删/误装软件——提示词里强制「修改或安装软件、执行网络下载前先向我确认」。配套工具链：剪映（识别字幕 + 导出 SRT/mp3）、Node.js 22+、FFmpeg。

## 四步流水线

1. **写口播稿**：每段都对应一个明确的视觉重点，文案写完自己读一遍，拗口处改掉——音频录完再改文案，SRT 时间戳全部作废。
2. **录音频**：自录或 AI 配音，剪掉明显口误与过长停顿，但别剪太狠，画面要给观众留看字时间。
3. **导出 SRT**：剪映「识别字幕」→ 逐句校对（HyperFrames/WorkBuddy 等专有名词易识别错）→ 检查字幕切分（太长易导致单页塞满字）→ 导出 `.srt`。这是「画面排期表」的源头。
4. **丢给 WorkBuddy 渲染**：在 WorkBuddy 中接入 HyperFrames，工作空间放好 mp3/srt/参考图 → 选 Plan 模式 → 跑文章附的那段 15 条要求 Prompt → AI 输出 `output/final-video.mp4` 与 `output/contact-sheet.jpg`。

## HTML 模板可复用清单

| 项目 | 第一次 | 后续复用 |
|------|--------|----------|
| 输入 | 口播稿 + 音频 + SRT + 1-2 张参考图 | 上一条 HTML 模板 + 新 mp3 + 新 SRT |
| 设计要求 | 由 AI 从参考图归纳出 DESIGN.md（颜色/字体/版式/动画） | 「保留 HTML 配色字体布局动画节奏，非必要不修改」 |
| 输出 | final-video.mp4 + contact-sheet.jpg | 同款风格的 final-video.mp4 |
| 适配场景 | 知识讲解、产品介绍、不露脸口播 | 同上 |

## 适用边界

- **依赖工具链**：WorkBuddy（或 Codex/Claude Code）+ HyperFrames + 剪映 + Node.js 22+ + FFmpeg，缺一不可。
- **首条视频成本高**：要反复调设计、调动画、调 SRT 时长，未必比手剪快多少。第二条开始才进入复利期。
- **视觉上限取决于参考图**：参考图平庸则成品平庸。
- **无版权机制**：AI 生成的视觉素材可能有版权风险，发布前必须自查。
- **不擅长强真人感**：适合不露脸口播；想做真人出镜的讲解视频，仍需先录真人视频再二次加工。

## Related Pages

- [[concepts/ai-content-pipeline]] — AI 内容工厂流水线，「人定方向 + AI 跑全流程」的同一思路
- [[sources/andyl5cc-xiaohongshu-codex-workflow]] — 同一作者本周的另一篇：用 Codex 做小红书内容，覆盖「选模型 → 拆模型 → 复制」方法论
- [[sources/crazykaomei-aigc-hook-pipeline]] — 单人调度 590 位博主的 AIGC 带货流水线，前 3 秒钩子决定生死，与本文的「SRT 决定画面节奏」互为时间轴约束的两端
- [[summaries/hypit-agent-video-workflow]] — 把视频复刻沉淀为 Agent 可复用工作流，与本文「HTML 模板复用」是同一资产化思路

## Sources

- [[sources/mixailab-workbuddy-html-pipeline]]
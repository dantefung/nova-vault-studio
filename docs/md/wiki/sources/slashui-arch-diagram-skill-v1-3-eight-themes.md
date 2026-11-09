---
title: "洛克船长（@slashui）：arch-diagram Skill 更新到 1.3.0——加了这 7 种架构图风格"
date: "2026-11-09"
source: "X/Twitter"
author: "洛克船长 (@slashui)"
url: "https://x.com/slashui/status/2119373302158516303"
---

# 洛克船长（@slashui）：arch-diagram Skill 更新到 1.3.0——加了这 7 种架构图风格

> 把任意 GitHub 仓库或文章转成会动的架构图的 Skill 更新至 1.3.0，新增 7 种风格：晒图蓝图 / 牛皮纸制图 / 白板手绘 / 粗野撞色 / 荧光终端 / 柔光卡片 / 3D 等距沙盘——同一张图说一句「换成手绘风格」即可重画而内容不动。附原始设计理念：先判断是分层系统、流水线还是带循环的流程再决定画法（不套模板）、颜色按模块种类与数据流向区分含义、光点沿连线流动且底部 log 实时滚动 A → B、一句话导出 HTML / 图片 / MP4 / GIF / Mermaid、中英文日文提问即得对应语言图。

<!-- more -->

根据软件，文章生成架构图的 skill 又更新了。

arch-diagram Skill 更新到 1.3.0，加了 7 种风格：

📐 晒图蓝图

📜 牛皮纸制图

✏️ 白板手绘

💥 粗野撞色

📟 荧光终端

☁️ 柔光卡片

🧊 3D 等距沙盘

同一张图，说一句“换成手绘风格”就重画，内容不用动。

Claude Code / Codex 都能用 https://t.co/ouSNQn7sqZ

上次转的那个架构图火了，好多朋友问能不能做成 Skill。

做出来了！🎉

不只是需求文档：丢给它一个 GitHub 仓库或一篇文章，它也能把里面的内在关系理清楚，画成这种会动的架构图：

🧭 不套模板：先判断是分层系统、流水线还是带循环的流程，再决定怎么画

🎨 颜色有含义：模块按种类上色，连线按数据流向区分

⚡ 光点沿连线流动，底部 log 实时滚动“A → B”

🎬 一句话导出 HTML / 图片 / MP4 / GIF / Mermaid，说“30 秒视频”就给你 30 秒

🌏 用中文问出中文图，用英文问出英文图，日文也一样

Claude Code 和 Codex 都能用，一行装好：

npx @rokoai/arch-diagram install

![video](https://pbs.twimg.com/tweet_video_thumb/HWmGXM5XgAAk5LY.jpg)

[animated_gif](https://video.twimg.com/tweet_video/HWmGXM5XgAAk5LY.mp4)

![video](https://pbs.twimg.com/tweet_video_thumb/HWmGYmyWsAA3_xC.jpg)

[animated_gif](https://video.twimg.com/tweet_video/HWmGYmyWsAA3_xC.mp4)

![video](https://pbs.twimg.com/tweet_video_thumb/HWmGaJLXcAA2dWt.jpg)

[animated_gif](https://video.twimg.com/tweet_video/HWmGaJLXcAA2dWt.mp4)

![video](https://pbs.twimg.com/tweet_video_thumb/HWmGaJOXoAAkFs-.jpg)

[animated_gif](https://video.twimg.com/tweet_video/HWmGaJOXoAAkFs-.mp4)

https://t.co/mj8LI9dIww

## 相关页面

- [[sources/guizang-social-card-skill]]
- [[sources/indie-hub-architecture-diagram]]
- [[concepts/agent-skill]]
- [[concepts/prompt-as-code]]

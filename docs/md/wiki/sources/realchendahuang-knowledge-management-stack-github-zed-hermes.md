---
title: "陈大黄（@realchendahuang）：折腾完主流笔记工具后的终极版本答案——GitHub + Zed + Hermes + Telegram"
date: "2026-11-03"
source: "X/Twitter"
author: "陈大黄 (@realchendahuang)"
url: "https://x.com/realchendahuang/status/2117252241728184583"
---

# 陈大黄（@realchendahuang）：折腾完主流笔记工具后的终极版本答案——GitHub + Zed + Hermes + Telegram

> 资深开发者深度梳理个人知识库五大刚需：数据本地完全掌控（排除 Notion/飞书等封闭云端）、AI 原生 API/MCP 自由读写、Git 版本回溯与云端备份、Rust 级极速性能（用 Zed 彻底告别 Chromium 电子套壳卡顿）、多端 Telegram 机器人全天候自动剪藏与 Hermes 知识唤醒。

<!-- more -->

最近一直在折腾 Obsidian、Notion、Flomo、飞书文档这一类知识管理工具，我终于想明白了自己真正的需求到底是什么。

第一：数据必须由自己掌控。不能因为哪天厂子倒闭了、服务器着火了，数据就跟着丢了，最后发个 9.9 优惠券补偿我。

所以我排除了 Notion、Flomo、飞书文档这一类纯云端软件。

第二：AI 必须能通过 API、MCP 等方式接入数据。在这个年代，如果还不能让 AI 自由读写数据，那就是落后的；知识管理的首要目标，就是给我的 AI 提供充分的上下文。

所以我排除了微信收藏、苹果备忘录这一类封闭的软件。

第三：必须有版本管理和云备份。历史上哪一步改了什么，必须清晰可回溯；而且东西不能只存放在一个地方，要狡兔三窟，能很方便地在云端存一份。

第四：性能要足够强、打开要够快，管理大量小文件时也不会卡顿。不然打开软件转半天，我午饭都做完了，笔记还没记好。

所以我排除了 Obsidian、VS Code 这一类浏览器套壳软件。

第五：多端通用且支持自动化。手机、电脑都能随时随地查看和编写；而且能把我看到的任何有趣内容顺手抓进知识库，进行自动整理。

所以我目前的版本答案是：GitHub + Zed + Hermes + Telegram + Ego Lite

- GitHub 负责云备份 + 版本管理：在手机端通过 GitHub 也能随时查看和编辑笔记，数据全在自己手里，不用怕供应商哪天跑路。

- Zed 负责电脑端的极速查看与本地编辑：这是一个用 Rust 写的编辑器，体积只有 50 多兆，启动秒开；平时在电脑上翻看和编辑文件，一次打开再多小文件也丝滑不卡，彻底摆脱了浏览器套壳软件的笨重。

- Hermes + Telegram 负责全天候移动剪藏：在手机上看到一个视频想转成文字稿，直接丢给 Telegram 里的机器人，让它通过 Hermes 调用 Ego Lite 把文稿抽取出来，自动扔进对应的文件夹。

- Hermes 还负责知识唤醒与日常整理：它能经常帮我自动整理笔记；平时有任何问题，直接让 Hermes 检索读取我的笔记库回答我就 OK 了。

## 相关页面

- [[concepts/llm-wiki]]
- [[concepts/ai-content-pipeline]]
- [[concepts/problem-driven-learning-wheel]]

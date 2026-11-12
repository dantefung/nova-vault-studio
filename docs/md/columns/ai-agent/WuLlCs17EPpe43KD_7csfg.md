---
title: "我开源了我的公众号写作工作流：修订、标题、排版、配图，四步全交给 AI"
author: "云峰Ivan"
date: "2026年9月26日 09:07"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/WuLlCs17EPpe43KD_7csfg"
---

# 我开源了我的公众号写作工作流：修订、标题、排版、配图，四步全交给 AI

QUOTE写出来只是走了一半，另一半是修订、配图和排版。—— 云峰



QUOTE



写出来只是走了一半，另一半是修订、配图和排版。



—— 云峰



在很久很久以前，写作公众号这个事情，其实还挺难的。先不说最难的写作，一般踌躇满志想要写很多好东西，面对白纸的时候，往往是卡顿，磋磨了半天，最后只是写下几个字而已。但凡有过一些写作经验的人，都一定明白我说的是什么。写出来以后呢？其实万里长征，大致才走了一半。需要修订文字，需要配必要的图片，最后还需要尽可能排版好，让页面更美观一些。有时候又需要和微信公众号拉胯的编辑体验斗智斗勇。随便写点东西咋就这么难？就没有稍微简单一些的，适合新手入门的方法吗？在 AI 大潮之前，还确实没有什么简单的方法，大部分都得要依赖手搓。你可以先用 Markdown 写作，写好以后导入到线上的编辑器（比如 mdnice、md.doocs.org 编辑器），然后再贴图，再修订，最后复制到公众号后台等待发布。AI 大潮真的是救了我。我的公众号写作工作流，开源在 GitHub 上，很不成熟，仅供参考。开源地址：https://github.com/ivanweng2077/yunfeng-gzh-skill说起来，我这个公众号写作流，要特别感谢两个 Skill。SKILL 1gzh-design · 公众号排版https://github.com/isjiamu/gzh-design-skill优秀的公众号排版工具SKILL 2ian-xiaohei-illustrations · 小黑配图https://github.com/helloianneo/ian-xiaohei-illustrations小黑配图工具，生成文章配图



在很久很久以前，写作公众号这个事情，其实还挺难的。



先不说最难的写作，一般踌躇满志想要写很多好东西，面对白纸的时候，往往是卡顿，磋磨了半天，最后只是写下几个字而已。但凡有过一些写作经验的人，都一定明白我说的是什么。



写出来以后呢？其实万里长征，大致才走了一半。



需要修订文字，需要配必要的图片，最后还需要尽可能排版好，让页面更美观一些。



有时候又需要和微信公众号拉胯的编辑体验斗智斗勇。



随便写点东西咋就这么难？就没有稍微简单一些的，适合新手入门的方法吗？



在 AI 大潮之前，还确实没有什么简单的方法，大部分都得要依赖手搓。



你可以先用 Markdown 写作，写好以后导入到线上的编辑器（比如 mdnice、md.doocs.org 编辑器），然后再贴图，再修订，最后复制到公众号后台等待发布。



AI 大潮真的是救了我。



我的公众号写作工作流，开源在 GitHub 上，很不成熟，仅供参考。



开源地址：https://github.com/ivanweng2077/yunfeng-gzh-skill



开源地址：https://github.com/ivanweng2077/yunfeng-gzh-skill



说起来，我这个公众号写作流，要特别感谢两个 Skill。



SKILL 1gzh-design · 公众号排版https://github.com/isjiamu/gzh-design-skill优秀的公众号排版工具



SKILL 1gzh-design · 公众号排版



https://github.com/isjiamu/gzh-design-skill优秀的公众号排版工具



https://github.com/isjiamu/gzh-design-skill



优秀的公众号排版工具



SKILL 2ian-xiaohei-illustrations · 小黑配图https://github.com/helloianneo/ian-xiaohei-illustrations小黑配图工具，生成文章配图



SKILL 2ian-xiaohei-illustrations · 小黑配图



https://github.com/helloianneo/ian-xiaohei-illustrations小黑配图工具，生成文章配图



https://github.com/helloianneo/ian-xiaohei-illustrations



小黑配图工具，生成文章配图



本文看点01一条开源的四步流水线02复制一句话完成安装03踩坑之后的使用建议



本文看点



01一条开源的四步流水线02复制一句话完成安装03踩坑之后的使用建议



01一条开源的四步流水线



01



一条开源的四步流水线



02复制一句话完成安装



02



复制一句话完成安装



03踩坑之后的使用建议



03



踩坑之后的使用建议



01INSTALL如何安装很简单。把这一段话，复制后发给你的 Agent（比如 WorkBuddy、千问办公、OpenClaw、Hermes agent 等）：REFERENCE帮我阅读并安装如下 Skills：https://github.com/ivanweng2077/yunfeng-gzh-skill/blob/main/SKILL.mdhttps://github.com/isjiamu/gzh-design-skillhttps://github.com/helloianneo/ian-xiaohei-illustrations



01INSTALL如何安装



01



INSTALL如何安装



INSTALL



### 如何安装



很简单。把这一段话，复制后发给你的 Agent（比如 WorkBuddy、千问办公、OpenClaw、Hermes agent 等）：



REFERENCE帮我阅读并安装如下 Skills：https://github.com/ivanweng2077/yunfeng-gzh-skill/blob/main/SKILL.mdhttps://github.com/isjiamu/gzh-design-skillhttps://github.com/helloianneo/ian-xiaohei-illustrations



REFERENCE



帮我阅读并安装如下 Skills：



https://github.com/ivanweng2077/yunfeng-gzh-skill/blob/main/SKILL.md



https://github.com/isjiamu/gzh-design-skill



https://github.com/helloianneo/ian-xiaohei-illustrations



02WORKFLOW具体是如何实现的？我（公众号“云峰”）的公众号文章全流程流水线。当用户要求“走一遍公众号流程”“修订+排版+题图一条龙”“按流程处理这篇文章”时使用。覆盖四步：1按其文风轻度修订 Markdown 原稿；2生成 3 个候选标题供选择；3调用 gzh-design skill 排版为公众号 HTML 并输出预览页；4调用 ian-xiaohei-illustrations skill 生成两张题图（2.35:1 头条封面 + 1:1 次条封面）。单独的修订、排版或题图请求不必用本 skill，直接用对应的单项能力即可。看起来也并不难，你在 GitHub 上看到的 SKILL.md 看似很复杂，其实大部分都能够看得懂。



02WORKFLOW具体是如何实现的？



02



WORKFLOW具体是如何实现的？



WORKFLOW



### 具体是如何实现的？



我（公众号“云峰”）的公众号文章全流程流水线。当用户要求“走一遍公众号流程”“修订+排版+题图一条龙”“按流程处理这篇文章”时使用。覆盖四步：



1按其文风轻度修订 Markdown 原稿；2生成 3 个候选标题供选择；3调用 gzh-design skill 排版为公众号 HTML 并输出预览页；4调用 ian-xiaohei-illustrations skill 生成两张题图（2.35:1 头条封面 + 1:1 次条封面）。



1按其文风轻度修订 Markdown 原稿；



按其文风轻度修订 Markdown 原稿；



2生成 3 个候选标题供选择；



生成 3 个候选标题供选择；



3调用 gzh-design skill 排版为公众号 HTML 并输出预览页；



调用 gzh-design skill 排版为公众号 HTML 并输出预览页；



4调用 ian-xiaohei-illustrations skill 生成两张题图（2.35:1 头条封面 + 1:1 次条封面）。



调用 ian-xiaohei-illustrations skill 生成两张题图（2.35:1 头条封面 + 1:1 次条封面）。



单独的修订、排版或题图请求不必用本 skill，直接用对应的单项能力即可。



单独的修订、排版或题图请求不必用本 skill，直接用对应的单项能力即可。



看起来也并不难，你在 GitHub 上看到的 SKILL.md 看似很复杂，其实大部分都能够看得懂。



03TIPS几个推荐由于我用的是 Windows 系统，所以其中有一些配置过程中踩到的坑，你如果不是 Windows，不一定会遇到，忽略即可。此 Skill 是由 WorkBuddy 帮我生成的，也跑过数十次没有出现大问题，Hermes agent 也可以。其他 Agent 原则上可用，如果不行，建议使用 Agent 让它帮你修复。



03TIPS几个推荐



03



TIPS几个推荐



TIPS



### 几个推荐



由于我用的是 Windows 系统，所以其中有一些配置过程中踩到的坑，你如果不是 Windows，不一定会遇到，忽略即可。



由于我用的是 Windows 系统，所以其中有一些配置过程中踩到的坑，你如果不是 Windows，不一定会遇到，忽略即可。



此 Skill 是由 WorkBuddy 帮我生成的，也跑过数十次没有出现大问题，Hermes agent 也可以。



其他 Agent 原则上可用，如果不行，建议使用 Agent 让它帮你修复。



其他 Agent 原则上可用，如果不行，建议使用 Agent 让它帮你修复。



∞THE END写在最后回到开头那个问题：随便写点东西咋就这么难？把脏活交给流水线，把判断留给自己。



∞THE END写在最后



∞



THE END写在最后



THE END



### 写在最后



回到开头那个问题：随便写点东西咋就这么难？



把脏活交给流水线，把判断留给自己。



END



END



END



我是云峰，平时喜欢折腾工具、记录方法，也写点踩坑和翻车。如果你觉得今天这篇有收获，欢迎点赞、在看、转发三连，我们下篇见



我是云峰，平时喜欢折腾工具、记录方法，也写点踩坑和翻车。如果你觉得今天这篇有收获，欢迎点赞、在看、转发三连，我们下篇见



我是云峰，平时喜欢折腾工具、记录方法，也写点踩坑和翻车。



如果你觉得今天这篇有收获，欢迎点赞、在看、转发三连，我们下篇见

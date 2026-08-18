---
title: "独立开发者的网页杂活，可以交给这款免费 Agent 浏览器"
date: "2026-07-05"
source: "苏打 da 汽水"
url: "https://mp.weixin.qq.com/s/Y41nCFkxa4s5uQi8FDFfRg"
---

# 独立开发者的网页杂活，可以交给这款免费 Agent 浏览器

> 最近我在折腾一件很小但很烦的事：让 Agent 帮我提交外链。实际跑起来会发现，浏览器这件事比想象中麻烦很多。

![Ego Lite 界面](images/ego-lite-browser/001.png)

所以最近看到 **Ego Lite**，第一反应是：这是我要的产品。它的定位是给 Agent 准备的浏览器工作台。你仍然可以用 Codex、Claude Code、Cursor、Hermes 这些工具，只是让它们多了一个更适合操作网页的浏览器。

**产品链接**：[citrolabs/ego-lite](https://github.com/citrolabs/ego-lite)

## 核心能力：你已经登录的浏览器里能做的事，Agent 也可以帮你做

> 这句话听起来普通，但对真实任务很关键。

很多网页工作都发生在**登录后的页面**里：GSC、AdSense、Stripe、X、各种 SaaS 后台、各种目录站提交页。如果 Agent 每次都从一个干净的临时浏览器开始，很多任务还没开始，就卡在登录、验证码、二次验证上。

Ego Lite 基于 Chromium，可以**导入 Chrome 的设置、Cookie、扩展和历史记录**。这样 Agent 更容易进入真实工作页面，少掉很多从零开始的准备工作。

![导入 Chrome 设置](images/ego-lite-browser/002.png)

## 最喜欢的功能：Space

以前让 Agent 控制浏览器，总有点不放心。它在前台窗口里点来点去，鼠标会被抢走，当前标签页也可能被切走。

Ego Lite 把**人和 Agent 的工作区分开了**。你可以在自己的 Space 里继续看资料、写文章、改代码；Agent 在另一个 Space 里打开目录站、填表单、查后台。想看进度就切过去看一眼，不想管就让它自己跑。

![Space 多任务](images/ego-lite-browser/003.png)

可以并行运行多个 Agent 任务：一个跑外链提交，一个看 GSC 数据，第三个打开竞品页面整理价格和文案。每个任务在自己的 Space 里，互相不影响。

> 浏览器就有点像给 Agent 分配的一张工作桌。

## 速度优势

官网 benchmark：抓取 X 账号近 7 天主帖，**Ego Lite 用了 81.8 秒，Agent Browser 用了 282.9 秒**。

![Benchmark](images/ego-lite-browser/004.png)

Agent 操作浏览器，很多时间耗在一轮轮「观察、点击、再观察」里。如果浏览器能把页面信息压得更干净，也能让 Agent 一次做更多动作，体验会完全不一样。

Token 也是同一个道理。网页里有大量无关信息——导航、弹窗、脚本、隐藏元素、复杂组件都会塞进上下文。Agent 看得越多，花的钱越多，也越容易迷路。Ego Lite 做了 **semantic snapshot**，想把页面变成更适合 Agent 读取的结构。

## 最适合三类任务

1. **增长动作**：目录站提交、外链提交、社交媒体信息整理
2. **后台巡检**：GSC、AdSense、Stripe、邮件后台、SaaS 管理后台
3. **上线前检查**：打开落地页、注册页、支付页、文档页，看按钮、表单、图片、移动端排版有没有明显问题

## 总结

还在观察它能不能长期稳定跑任务、能不能少出错、能不能接住真实网页里的各种脏东西。但它吸引作者的地方很明确：它在**认真处理 Agent 使用浏览器时那些很具体的麻烦**——登录态、Space、并行任务、速度、Token、外部 Agent 接入。

作者会继续拿它跑一段时间，重点试外链提交和后台数据整理。
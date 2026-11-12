---
title: "万字报告，个人 Agent 竞品分析，谁最适合当你的助理？"
author: "@kongge_space"
date: "2026-10-10"
source: "X (Twitter)"
url: "https://x.com/kongge_space/status/2108756204587794666?s=20"
---

# 万字报告，个人 Agent 竞品分析，谁最适合当你的助理？

最近个人 Agent 突然火了。

Google、SpaceXAI、Meta、Manus、OpenAI 五家前后发了自己的个人 Agent。

![](https://pbs.twimg.com/media/HUPNXjqaUAEKgWV.jpg)

Muse、Grok Bot、Gemini Spark、Cue这几款我都注册体验了。

用得最久的是 Grok Bot，快一个月了。

我做了几个 bot，包括主动给我抓取新闻的，还有监控我的产品运维安全性的，每天都能在手机上收到它发的消息，用起来还是挺省心的。

![](https://pbs.twimg.com/media/HUPNZghbAAA-uJy.jpg)

![](https://pbs.twimg.com/media/HUPNbU4asAARiRU.jpg)

刚上手的时候挺惊艳的。

它操作电脑比我之前用的通用 Agent 稳很多，而且有自己的云端电脑，任务丢进去就在那跑。

这样我在手机上就能远程叫它，让它去电脑上开浏览器、回微信、或者打开 ChatGPT 帮我问点东西。

![](https://pbs.twimg.com/media/HUPNdFoa4AAzUYE.jpg)

用了一段时间，我开始好奇别人都拿个人 Agent 干什么，市面上这几家到底差在哪。

所以做了一次调研，翻了五家的官方文档、工程博客、媒体实测，还有 X 上用户自己晒的案例。

这篇把调研结果整理出来：大家的用法、个人 Agent 的架构、五家对比，最后说说我对它发展的判断。

01 个人 Agent 和通用 Agent 区别

Agent 的发展在 25 年末 claude 超强的代码能力带来了 Coding Agent ：Claude Code

26 年初迎来了第一个通用 Agent ：Manus，

然后就是开源 Agent 爆发：openclaw、hermes 等

以上Agent 的发展都是有缺点在的，manus 是网页端的、openclaw 这类开源 Agent 的使用门槛较高。

所以到了 26 年下半年，就是疯狂竞争的working Agent ： 国内以豆包工作、千问办公、Workbuddy，这类 Agent 和我们工作场景贴合，规则性强，使用门槛大大降低。

再到现在的个人 Agent，强调的是 Agent 融合到我们个人的生活，Agent 自主性增强，更像人的个人助理。

先看上面五家给自己的定位，几乎都一样：**7×24 在线、有自己的电脑、在后台替你办事、关键时刻主动来找你。**

这是个人 Agent 和 通用 Agent 的区别。

通用 Agent 是你打开它、给个任务、它做完交差，这次对话就结束了。下次再来，还要重新开始。

个人 Agent 是一直开着的。它记得你是谁、你的偏好、你上个月提过的事，可以自己定时醒来干活，也会主动跑来问你要不要帮忙。

Muse 有个案例我印象很深。

用户用 muse 策划晚宴，Muse 提醒菜单里有道菜得去掉，因为朋友 Maria 对贝类过敏，这件事用户之前提过一次。

![](https://pbs.twimg.com/media/HUPNe5YbgAA2Jgj.jpg)

还有一个用户说，Muse 知道自己女儿快 8 岁了，主动提出帮忙策划生日派对。

![](https://pbs.twimg.com/media/HUPNgyBaQAAB3Xu.jpg)

**交互的重心从输入框挪到了通知和审批卡片上，你更多是在批它的活，很少再从头教它怎么干。**

五家的发布时间和背景、案例先放一张表：

![](https://pbs.twimg.com/media/HUPNjRJbMAApcD0.jpg)

02 大家都拿个人 Agent 干什么

我把 X 上能找到的用户案例一条条翻了一遍，大概能分成这么几类。

## 1、替你砍价、打电话

这是 Muse 案例里最多的一类，Meta 还专门搞了个 #musemoneychallenge 的话题让大家晒省了多少钱。

用户 Arjun 只发了一句话：Muse 在 AT&T 那边帮忙省了 570 美元，明年还能再省 480。

![](https://pbs.twimg.com/media/HUPNmMraMAEop4m.jpg)

有人给 Muse 的指令就一句：「找一台 50 英里内的全新 M5 Pro MacBook，给每个卖家发消息，我最多出 2500 美元。」

Muse 就去 Marketplace 上挨个给 50 个卖家压价，直到有人松口。最后 2500 美元拿下一台 48GB 内存、2TB 硬盘的 M5 Pro MacBook Pro，连卖家靠不靠谱都顺手查了。

![](https://pbs.twimg.com/media/HUPNpYsbkAAkX7q.jpg)

## 2、把你攒了好几年的数据过一遍

Grok Bot 这类案例最多，也是我觉得最实用的一类。

Unacademy 的创始人 Gaurav Munjal 让 Grok Bot 翻自己过去十年的日历，每一场会、见过的每一个人，都加进一个 Notion 数据库，附上对方的 LinkedIn 和近况，打好标签。

![](https://pbs.twimg.com/media/HUPNskAbwAAL9CI.jpg)

Google Photos 的负责人 Shimrit Ben-Yair 也晒过，手上有 14 万多张照片和视频，用 Spark 修图、建共享相册，还把随手拍的演出海报转成了日历日程。

这类活人自己干要好几个周末，Agent 一个下午就跑完了。数据都在你自己的账号里，出错的代价也低。

## 3、填表、办手续

Dots 的案例集中在这。

Jason Wang 让 dot 去内华达州的雇主网站，从头到尾把表格填完，全程不用自己插手，省了 200 美元的代办费。

![](https://pbs.twimg.com/media/HUPNvxDaQAAwIOj.jpg)

Antonio Leiva 是 Dots 早期测试用户。

![](https://pbs.twimg.com/media/HUPN7lwbcAA71H9.jpg)

## 4、让 Agent 赚回自己的工资

这类最有意思。

Liam 给 Grok Bot 只派了一个活：把流失的客户找回来。它找出过去半年所有离开的人，挨个发邮件，挽回了好几个，顺便收集了反馈。

然后连夜分析大家为什么走，写了一份五步改进社区的计划。Liam 说它已经把自己的成本赚回来了。

Vaibhav 给 dot 设的目标是每个月赚够自己 200 美元的订阅费，现在它正在发邮件推销小的付费项目，结果还不知道。

03 个人 Agent 由哪几块组成

看完案例，我们对它们的能力有了理解，再来看看它们各自的技术架构

五家的宣传语一样，但拆开技术架构，差别就出来了。

我把个人 Agent 拆成六块：**模型、电脑、记忆、技能、调度、身份**。

前五块各家大同小异，不同的是下面三个点。

## 第一个：在哪干活

五家都给了 Agent 一台云端电脑，但给法不一样。

Muse 是每个用户一台专属的 Linux 虚拟机，里面还隔成两半：agent 住一半，管安全的服务住另一半，互相碰不到。

Grok Bot 是每个 Bot 一台云电脑，有桌面、文件系统、终端，人类可以像远程桌面一样随时接管。遇到验证码或者两步验证，它会把桌面交还给你。

Dots 有云电脑，也能连你本地的电脑，访问本地文件，驱动本地的 Codex。

Spark 最轻，主要靠 Google 云上的远程浏览器，7 月底开始能直接接管你的 Chrome，用你已经登录的账号和存好的密码。

云电脑解决的是两件事：**一直在线，以及能操作那些没有 API 的网站。**

## 第二个：用谁的身份

这是五家分歧最大的地方。

Spark 和 Grok Bot 都是用你的账号。Grok Bot 还有个细节：同一个用户的所有 Bot 共享网站登录态，你登一次，几个 Bot 都能用。

Cue 反过来，每个 agent 有自己的邮箱、电话号码、钱包和电脑，以它自己的名义去联系外面的世界。

Muse 介于中间，平时用你的身份，但付款时用的是 agent 自己持有的钱包，每次付款单独发一张一次性虚拟卡，限定商家、金额和有效期。

Dots 给每个 dot 一个自己的 handle，可以在 ChatGPT、Slack、Teams 里直接找它，也能打电话。

## 第三个：谁来拍板

Agent 要花钱、发邮件、提交表单，谁说了算？

Muse 用的是确定性规则。它有个叫 Sentinel 的组件，是唯一有权放行的角色。

模型永远看不到你真实的 token，拿到的只是替身，到了网络出口 Sentinel 才换成真的。

读过你私人数据的进程会被打上标记，之后想往外发东西就得人工审批。

Grok Bot 和 Dots 用的是模型审查。你用自然语言写规则，一个独立的审查 agent 判断该放行、该拦下还是交给你决定。

Grok Bot 的官方文档也说得很坦白：规则能不能执行，说到底要看模型听不听话。

Spark 最朴素，高风险操作先问你，付款环节把控制权交还给你。

**三个选择合在一起，基本决定了一个产品长什么样、成本怎么算、用户敢交多少东西给它。**

**在价格方面，除了 muse 是免费使用以外，manus 的cue 需要邀请码试用，Grok bot 要 20 刀/月， OpenAI 的Dots 需要 100 刀/每月。**

完整的对比放在这：

![](https://pbs.twimg.com/media/HUPN_LhboAA_v92.jpg)

04 五家各自擅长什么

同样的六块积木，五家押的功能重点不同。

**Grok Bot 多 Bot 协作。**

![](https://pbs.twimg.com/media/HUPOCVebYAABg13.jpg)

它有个功能我很喜欢：让 Bot 跟着你做一遍，它就把这个流程存成 routine，之后自己跑。多个 Bot 之间可以互相发消息、互相触发，做好的 Bot 还能做成模板分享给同事。用户要操心的从写 prompt 变成了排组织架构。

## Muse ：社交。

![](https://pbs.twimg.com/media/HUPOFsRbwAAdZle.jpg)

Meta 掌握的是人和人的关系，Muse 的入口也在 WhatsApp 这些社交产品里。所以它的案例几乎都跟人有关：记得朋友对贝类过敏，记得女儿快过 8 岁生日，帮你写聚会邀请、替你给门店和卖家打电话。

它最拿手的是帮你打理身边的人和事，工作反倒排在后面。也正因为接的是普通人的生活，Meta 在安全上下的功夫最重，五家里只有它写了一整篇工程博客讲安全架构，漏洞赏金开到30 万美元。

## Cue ：身份。

![](https://pbs.twimg.com/media/HUPOHkxakAA0bn4.jpg)

独立的电话、邮箱、钱包，还能扫商家二维码生成一个服务 agent 帮你点单排队。这些是大厂嫌合规麻烦、不太愿意碰的东西。但美国号码实测发不了短信，钱包也只支持美国，现在还很粗糙。

## Dots ：主动性。

![](https://pbs.twimg.com/media/HUPOJjYagAA0FhB.jpg)

dot 自己决定什么时候醒来、什么时候暂停，不需要你每件事都设定时。背后是 ChatGPT 的记忆和付费用户。

## Spark ： Google 全家桶。

Gmail、日历、Drive、地图、机票、相册，数据都在 Google 手里。它还直接用了 SKILL.md 格式做技能，计划把 Gems 迁成 Skills。

05 写在最后

个人 Agent "替人做事"的路上走得越来越远。查找、整理和标记私人数据已经实用，但发消息、付款等操作仍需要人盯着：它既要读私有数据、接触外部内容，又要对外行动，提示注入的风险很难回避。

因此，安全可能成为卖点，产品也会逐渐用规则守住底线、用模型审查减少打扰。

随着 Agent 全天候工作，收费方式会更像按工作量雇助理；当技能和工具格式趋同，竞争就转向数据与入口。

用 Grok 五件事，我最大的变化是开始把它当成一个一直在线的同事。

以前用通用 Agent，是我有事了打开它；现在是它一直在那，我想到什么在手机上丢一句，它在云电脑上接着干，干完或者卡住了再来找我。

五家现在的形态还很像，谁能跑出来，我觉得要看谁先让普通人放心把邮箱、账号和钱包交出去。

调研的完整报告我整理成了一份文档，里面有五家的架构细节、每个案例的原帖链接和来源，需要的可以回复"个人 Agent"获取。

我是空格，持续分享 AI 产品的思考与实践。

你在用哪个个人 Agent？拿它干过最值的一件事是什么？欢迎评论区分享。如果有用，点赞转发支持一下。
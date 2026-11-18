---
title: "网站出海每日分享：全栈框架TanStack使用体验"
author: "droidHZ"
date: "2026-06-07 07:17"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/eAgQcUSS0WlwpZ9mM5NW-A"
---

# 网站出海每日分享：全栈框架 TanStack 使用体验

早上好，朋友们！前两天看见逗总分享 shipany 的 tanstack 版本也要发布了，网站测试的效果很好。刚好最近自己也用 fox 大佬的 tanstarter 一段时间，群友也是推荐 tanstack，我现在新站都从 Nextjs + vercel 迁移到 Tanstack + cloudflare 了。 今天来分享一下我 TanStack 的使用体验。![image](images/001.webp)打开速度网站的打开速度，应该是提升非常明显的了，以前 next js 项目打开会慢一些，为了解决网站打开慢的问题，我尝试过好几次优化，但是发现优化都有限，现在用上了 tanstack 感觉就非常的丝滑，比我之前 next js 优化后的效果好很多。项目部署之前 next js 项目，搭配 vercel 部署，提交代码就能上线也是非常丝滑，但是有个问题就是 vercel 的账单价格相对于 cloudflare 来说还是贵一些，还有单独用了三方数据库也会贵一些。现在用上 tanstack ，因为有 cloudflare 的 cli ，都使用 ai 把 R2 存储、数据库、worker 都直接绑定部署上，上线网站一样的很简单丝滑，而且可以把这个流程 AI 自动化。all in cloudflare 成本也更低。不过唯一可能有点担忧的就是 cloudflare 的 worker 上限是 10MB ，AI 倒是告诉我这个不容易超。开发开发的话，因为现在都是 AI 开发，我也差异点没怎么感受到，就是可能之前熟悉的 nextjs 的目录结构，现在要重新熟悉下。总结下来就是网站速度快，部署丝滑，成本更低，如果有需要 tanstarter 模板的，可以用优惠码 DROIDHZ，有 20 美金的优惠。

早上好，朋友们！

前两天看见逗总分享 shipany 的 tanstack 版本也要发布了，网站测试的效果很好。刚好最近自己也用 fox 大佬的 tanstarter 一段时间，群友也是推荐 tanstack，我现在新站都从 Nextjs + vercel 迁移到 Tanstack + cloudflare 了。 今天来分享一下我 TanStack 的使用体验。

![image](images/001.webp)

## 打开速度

网站的打开速度，应该是提升非常明显的了，以前 next js 项目打开会慢一些，为了解决网站打开慢的问题，我尝试过好几次优化，但是发现优化都有限，现在用上了 tanstack 感觉就非常的丝滑，比我之前 next js 优化后的效果好很多。

## 项目部署

之前 next js 项目，搭配 vercel 部署，提交代码就能上线也是非常丝滑，但是有个问题就是 vercel 的账单价格相对于 cloudflare 来说还是贵一些，还有单独用了三方数据库也会贵一些。

现在用上 tanstack ，因为有 cloudflare 的 cli ，都使用 ai 把 R2 存储、数据库、worker 都直接绑定部署上，上线网站一样的很简单丝滑，而且可以把这个流程 AI 自动化。all in cloudflare 成本也更低。

不过唯一可能有点担忧的就是 cloudflare 的 worker 上限是 10MB ，AI 倒是告诉我这个不容易超。

## 开发

开发的话，因为现在都是 AI 开发，我也差异点没怎么感受到，就是可能之前熟悉的 nextjs 的目录结构，现在要重新熟悉下。

总结下来就是网站速度快，部署丝滑，成本更低，如果有需要 tanstarter 模板的，可以用优惠码 DROIDHZ，有 20 美金的优惠。

我是赫兹，专注网站出海第 380 天，持续分享网站出海内容。新朋友可以看看之前的文章合集；想系统学习，也推荐关注哥飞老师，我很多方法是向他学习的，微信搜索 361079 就可以找到他。

![image](images/002.webp)

网站出海每日分享

网站出海深度总结

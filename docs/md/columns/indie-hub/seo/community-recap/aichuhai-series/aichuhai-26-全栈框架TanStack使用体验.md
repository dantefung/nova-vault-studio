---
title: "网站出海每日分享：全栈框架TanStack使用体验"
author: "droidHZ"
date: "2026年6月7日 07:17"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/eAgQcUSS0WlwpZ9mM5NW-A"
---

# 网站出海每日分享：全栈框架TanStack使用体验

早上好，朋友们！前两天看见逗总分享shipany 的tanstack 版本也要发布了，网站测试的效果很好。刚好最近自己也用fox 大佬的 tanstarter 一段时间，群友也是推荐tanstack，我现在新站都从Nextjs + vercel 迁移到 Tanstack + cloudflare 了。 今天来分享一下我TanStack 的使用体验。![image](./images/001.png)打开速度网站的打开速度，应该是提升非常明显的了，以前next js 项目打开会慢一些，为了解决网站打开慢的问题，我尝试过好几次优化，但是发现优化都有限，现在用上了tanstack 感觉就非常的丝滑，比我之前next js 优化后的效果好很多。项目部署之前next js 项目，搭配vercel 部署，提交代码就能上线也是非常丝滑，但是有个问题就是vercel的账单价格相对于cloudflare 来说还是贵一些，还有单独用了三方数据库也会贵一些。现在用上 tanstack ,因为有cloudflare 的cli ，都使用ai 把R2存储、数据库、worker 都直接绑定部署上，上线网站一样的很简单丝滑，而且可以把这个流程AI自动化。all in cloudflare 成本也更低。不过唯一可能有点担忧的就是cloudflare 的worker 上限是10MB ，AI 倒是告诉我这个不容易超。开发开发的话，因为现在都是AI 开发，我也差异点没怎么感受到，就是可能之前熟悉的nextjs 的目录结构，现在要重新熟悉下。总结下来就是网站速度快，部署丝滑，成本更低，如果有需要tanstarter 模板的，可以用优惠码DROIDHZ，有20美金的优惠。

早上好，朋友们！

前两天看见逗总分享shipany 的tanstack 版本也要发布了，网站测试的效果很好。刚好最近自己也用fox 大佬的 tanstarter 一段时间，群友也是推荐tanstack，我现在新站都从Nextjs + vercel 迁移到 Tanstack + cloudflare 了。 今天来分享一下我TanStack 的使用体验。

![image](./images/001.png)

## 打开速度

网站的打开速度，应该是提升非常明显的了，以前next js 项目打开会慢一些，为了解决网站打开慢的问题，我尝试过好几次优化，但是发现优化都有限，现在用上了tanstack 感觉就非常的丝滑，比我之前next js 优化后的效果好很多。

## 项目部署

之前next js 项目，搭配vercel 部署，提交代码就能上线也是非常丝滑，但是有个问题就是vercel的账单价格相对于cloudflare 来说还是贵一些，还有单独用了三方数据库也会贵一些。

现在用上 tanstack ,因为有cloudflare 的cli ，都使用ai 把R2存储、数据库、worker 都直接绑定部署上，上线网站一样的很简单丝滑，而且可以把这个流程AI自动化。all in cloudflare 成本也更低。

不过唯一可能有点担忧的就是cloudflare 的worker 上限是10MB ，AI 倒是告诉我这个不容易超。

## 开发

开发的话，因为现在都是AI 开发，我也差异点没怎么感受到，就是可能之前熟悉的nextjs 的目录结构，现在要重新熟悉下。

总结下来就是网站速度快，部署丝滑，成本更低，如果有需要tanstarter 模板的，可以用优惠码DROIDHZ，有20美金的优惠。

我是赫兹，专注网站出海第380天，持续分享网站出海内容。新朋友可以看看之前的文章合集；想系统学习，也推荐关注哥飞老师，我很多方法是向他学习的，微信搜索 361079 就可以找到他。

![image](./images/002.jpeg)

网站出海每日分享

网站出海深度总结

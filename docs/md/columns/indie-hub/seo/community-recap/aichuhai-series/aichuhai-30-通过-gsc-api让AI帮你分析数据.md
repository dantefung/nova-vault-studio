---
title: "网站出海每日分享：通过 gsc api，让AI帮你分析数据"
author: "droidHZ"
date: "2026年6月3日 07:11"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/y5JBwduRATW15cFo0JaVwA"
---

# 网站出海每日分享：通过 gsc api，让AI帮你分析数据

早上好，朋友们！之前分享过通过google-analytics-mcp可以让AI 帮你分析总结你网站的数据了，这里还差一个GSC 的数据，我们可以直接用GSC 的API 和结合AI 来分析对应的数据。 API 文档：https://developers.google.com/webmaster-tools/about?hl=zh-cn配置API 所需要的凭证打开Google cloud 搜索  Google Search Console API ，可以用下面的链接快捷打开 https://console.cloud.google.com/marketplace/product/google/searchconsole.googleapis.com顶部可以切换不同的项目，然后启用。![image](./images/001.png)启用之后，可以到凭证里面创建凭证，使用OAuth 客户端ID，应用类型选择桌面应用，然后随便起个你知道的名称，创建，然后下载对应的JSON文件。然后把下载的JSON文件重命名为 credentials.json，保存到你要分析的工程目录下。![image](./images/002.png)直接问AI GSC 相关的信息这里我是用的codex，我直接告诉他我想要通过和你聊天的形式，你分析GSC的相关数据，你通过GSC的API 去获取数据。对应API 凭证是credentials.json然后AI 就一通操作，把该搭建的环境弄好，同时你浏览器同意一下认证，就可以和AI聊天，让AI帮你分析GSC 的相关数据了。比如我下面就是我指定某个网站，让AI帮我分析机会点，怎么去做。![image](./images/003.png)有了这些数据你可以让AI做很多事情了。比如：分析哪些页面曝光高但是转化低，去优化标题哪些页面需要去优化关键字哪些词值得去规划成一些新的页面对比最近一段时间的数据，增加、下跌是哪些词，为什么下跌其实你还可以把数据库（只读权限）、Google analytics mcp ，GSC 这些数据都打通，让AI拥有更多的上下文，能够帮你更好的去做决策。

早上好，朋友们！

之前分享过通过google-analytics-mcp可以让AI 帮你分析总结你网站的数据了，这里还差一个GSC 的数据，我们可以直接用GSC 的API 和结合AI 来分析对应的数据。 API 文档：https://developers.google.com/webmaster-tools/about?hl=zh-cn

## 配置API 所需要的凭证

打开Google cloud 搜索  Google Search Console API ，可以用下面的链接快捷打开 https://console.cloud.google.com/marketplace/product/google/searchconsole.googleapis.com

顶部可以切换不同的项目，然后启用。

![image](./images/001.png)

启用之后，可以到凭证里面创建凭证，使用OAuth 客户端ID，应用类型选择桌面应用，然后随便起个你知道的名称，创建，然后下载对应的JSON文件。然后把下载的JSON文件重命名为 credentials.json，保存到你要分析的工程目录下。

![image](./images/002.png)

## 直接问AI GSC 相关的信息

这里我是用的codex，我直接告诉他

然后AI 就一通操作，把该搭建的环境弄好，同时你浏览器同意一下认证，就可以和AI聊天，让AI帮你分析GSC 的相关数据了。比如我下面就是我指定某个网站，让AI帮我分析机会点，怎么去做。

![image](./images/003.png)

有了这些数据你可以让AI做很多事情了。比如：

分析哪些页面曝光高但是转化低，去优化标题

哪些页面需要去优化关键字

哪些词值得去规划成一些新的页面

对比最近一段时间的数据，增加、下跌是哪些词，为什么下跌

其实你还可以把数据库（只读权限）、Google analytics mcp ，GSC 这些数据都打通，让AI拥有更多的上下文，能够帮你更好的去做决策。

我是赫兹，专注网站出海第376天，持续分享网站出海内容。新朋友可以看看之前的文章合集；想系统学习，也推荐关注哥飞老师，我很多方法是向他学习的，微信搜索 361079 就可以找到他。

![image](./images/004.jpeg)

网站出海每日分享

网站出海深度总结

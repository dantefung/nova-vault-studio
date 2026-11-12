---
title: "利用 Grok Bot 的 VPS 神机当网络出口教程：轻松解锁 Gemini，还告别 Cloudflare 反复验证！"
author: "@xmglab"
date: "2026-09-08"
source: "X (Twitter)"
url: "https://x.com/xmglab/status/2097223608028516830?s=20"
tags: ["grok-bot", "vps", "network", "geo-unblock"]
note: "涉及将 Grok Bot VPS 作为网络出口使用，绕过区域限制/Cloudflare 验证，请参考者自行评估合规性"
---

# 利用 Grok Bot 的 VPS 神机当网络出口教程：轻松解锁 Gemini，还告别 Cloudflare 反复验证！

大家好，我是小码哥。

最近折腾半天 **Gemini 3.8 Flash** 解锁，自己的美国 **VPS** 被屏蔽了，连 **WARP** 也被屏蔽了，最后用 **Grok Bot** 的 VPS 出口解决了。。。

**Grok Bot 这条 VPS 线路，我愿称它为 AI 神机出口！！！**

Grok Bot 不只是能跑自动化，**它的 VPS 出口 IP 才是隐藏王炸**，虽然它没有提供公网 IP，但它的 VPS 的出口 IP 质量，比我买的很多节点都干净。

比如，**有的网站经常弹出 Cloudflare 的人机验证，用了它当出口之后，验证都没有了**，真的太神了。。

很多人不知道我是怎么玩的，让我出教程，这篇我就来整理下。

核心思路就是：**利用 Tailscale 实现组网，然后使用 3X-UI 面板实现出口和路由**。

![](https://pbs.twimg.com/media/HRrTRnFacAAdcFu.jpg)

Tailscale 组网

因为 **Grok Bot 的 VPS 没有公网 IP**，所以我们需要**让我们的 VPS 和 Grok Bot 的 VPS 通过 Tailscale 实现组网**，这样它们就在同一个内网中了，就能够实现网络出口。

## Tailscale 是什么？

Tailscale 是一组网工具，它可以把分散在不同网络里的设备，组成一个虚拟局域网。

比如，如果你有 **MacBook、iPhone、家里的 Mac mini、美国 VPS、香港 VPS** 这些设备……

这些设备可能分别位于家庭宽带、手机流量、美国机房等不同网络中。安装 Tailscale 后，它们可以获得各自的 **Tailscale IP**，然后像在同一个局域网里一样互相访问。

它最大的特点是**不需要公网 IP**，也不用自己配置复杂的端口转发和 NAT 穿透，设备之间能够直连。

官网：[https://tailscale.com/](https://tailscale.com/)

## Grok Bot 安装 Tailscale

Grok Bot 快速安装 Tailscale，可以直接在 Grok Bot 中发送以下指令：

在当前 Grok Bot 云电脑安装并配置 Tailscale，然后配置一个仅监听 Tailscale IP 的 SOCKS5 代理服务器，支持 TCP 和 UDP，不允许公网直接访问，并保证服务可以持续运行。

如图所示：

![](https://pbs.twimg.com/media/HRrTUTza4AArRO2.jpg)

中间它会弹出来要你**输入 Tailscale 的 Auth Key**，去这里获取并生成一个：

[https://console.tailscale.com/admin/settings/keys](https://console.tailscale.com/admin/settings/keys)

测试下延迟，没问题就继续。

## 添加路由

打开「**路由**」菜单，点击「**\+ 路由规则**」按钮添加一个路由规则：

![](https://pbs.twimg.com/media/HRrTjIrbsAASvyk.jpg)

主要配置以下信息：

- **网络**：一般选择 Any，可按需选。
- **域名**：就是哪些域名需要通过这个路由规则出站，不填就所有域名都走这个出站。解锁 Gemini 只需要配置 domain:googleapis.com 域名就行了。
- **入站标签**：就是你用的入站的协议。
- **出站标签**：就是上面配置好的出站。

配置好后，需要重启 3X-UI 面板才能生效。

到这里，全部工作就做完了，你的 VPS 上的 3X-UI 节点都能走对应的 Grok Bot 路由规则出口了。

验证出口

可通过下面的网站检测当前 IP：

[https://ping0.cc/](https://ping0.cc/)

![](https://pbs.twimg.com/media/HRrTlZzbEAAQfn8.jpg)

显示 Grok Bot 的出口 IP，就说明我们的出口配置成功了。

Grok Bot 的出口 IP 是**原生 IP**，虽然还是 **Cloudflare 的 IDC 机房 IP**，但可能是企业特供，没有被 Google 屏蔽，质量还是杠杠的。

**Google Gemini 也解锁了：**

![](https://pbs.twimg.com/media/HRrT1B8aAAAbR8F.jpg)

我不一定非得用 Google Gemini，**但它屏蔽我，我就不服，我很不爽**，我就非得把它搞通！

这几天为了它折腾 **VPS、WARP、出口 IP**，各种方案来回试，最后还得靠 **Grok Bot 自带的 VPS** 网络才搞定。

你别说，**Grok Bot 还真是妙用**，它的出口 IP 干净，**连谷歌都认它。

**30 刀的 SuperGrok 太值了！！！**🤠

不仅可以用 **Grok Build**，还可以用 **Grok Bot**，额度还是分开计算的，不能太爽了。

真的，不吹不黑，真实感受哈。

而且经我实测，**那些我经常弹出 Cloudflare 验证的网站，我配置域名后，都不弹了**，简直不能太香了！！

好了，本期的分享就到这里了，请畅玩。

如有问题欢迎留言探讨，有想问问题的兄弟，可以**先点个关注再留言**哈，**消息通知默认只能看已关注的留言。**

有帮助就关注一下哈，也算是对我持续分享的一点支持，我看到就会回复。

我是小码哥，下期见。

本文仅供学习交流与个人经验分享，请勿用于商业用途和非法途径。
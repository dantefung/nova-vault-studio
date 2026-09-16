---
title: "sitin：出海网站 Stripe 支付接入实战——从 0 到收款全流程"
date: "2026-09-16"
source: "X/Twitter"
url: "https://x.com/sitinme/status/1998943804930535495"
---

# 出海网站实战：Stripe 支付接入，从 0 到收款全流程

每天一个出海工具/技巧，今天分享网站接入stripe支付的流程。最近给自己的导航站 toolcenter.ai 加了付费提交功能，用的是Stripe，给大家分享出来。

![](../images/stripe-sitinme/002.jpg)

做出海项目，收款这块 Stripe 基本是标配了。全球通用、文档齐全、开发者友好。而且支持微信支付宝，意味着国内用户不方便海外卡的，也有支付方案，这样咱们多一个支付收款渠道，不会影响国内用户付款。

简单说一下我这边的前提背景，关于 Stripe 商家后台的配置（包括商家账户注册、收款账户绑定等），我们的语雀文档里详细写过，出海圈的朋友随时可以查看。

![](../images/stripe-sitinme/003.jpg)

这篇文章主要分享一下实际项目中怎么接入 Stripe 支付功能。

另外说一下团队协作的场景，如果团队用一个stripe账号，可以在 Stripe 平台邀请成员，被邀请的小伙伴会收到一封邀请邮件，邮件里有链接，点进去注册账号后就会自动加入到Stripe 团队里面，具体有什么权限是由赋予的成员角色决定的。

![](../images/stripe-sitinme/004.jpg)

一、先把账号注册了

收到邀请邮件后，点击里面的链接，会跳转到 Stripe 的注册页面。填一下邮箱、密码，国家选美国，点击「创建账户」就行。注册成功后会自动进入公司的团队账号，不需要额外配置。

![](../images/stripe-sitinme/005.jpg)

个人注册直接访问就行：https://dashboard.stripe.com/ 注册完会让你完善一些企业信息，测试阶段可以先跳过。

关于测试模式和正式模式：

在后台右上角能看到 API 密钥，会有两个，公钥pk_开头，私钥sk_开头。API 密钥又分测试和生产两套，测试密钥以 test 开头，不会产生真实交易，可以放心测。

![](../images/stripe-sitinme/006.jpg)

切换测试和正式模式最简单的方法就是直接在地址栏把 URL 里的 /test 去掉或加上就行。比如 dashboard.stripe.com/test/apikeys 是测试模式，去掉 test 变成 dashboard.stripe.com/apikeys 就是正式模式。

开发调试用测试密钥（pk_test_...），项目上线换成正式密钥（pk_live_...）。

二、理解 Stripe 支付

这里先说一下整体流程，避免后面懵。

用户点击支付 → 后端创建 Checkout Session → 跳转 Stripe 支付页 → 用户付款 → Stripe 通知你的服务器（Webhook）→ 你更新订单状态

![](../images/stripe-sitinme/007.jpg)

不需要自己做支付页面，Stripe 提供了现成的支付页（Checkout），安全又好看，支持多种支付方式。

三、本地测试支付

Webhook 需要公网地址，但本地开发是 localhost，Stripe 访问不到怎么办？

推荐用 Stripe CLI 转发

1、安装 Stripe CLI

Mac 用 Homebrew：

![](../images/stripe-sitinme/008.jpg)

如果 brew 装不上（网络问题），可以手动下载：

- 打开 https://github.com/stripe/stripe-cli/releases/latest

![](../images/stripe-sitinme/009.jpg)

- 根据电脑系统下载对应压缩包
- 解压后移动到系统路径：

![](../images/stripe-sitinme/010.png)

2、登录 Stripe

![](../images/stripe-sitinme/011.jpg)

会弹出浏览器让你授权，点允许就行。

![](../images/stripe-sitinme/012.jpg)

3、转发 Webhook 到本地

![](../images/stripe-sitinme/013.png)

运行后会显示一个 webhook signing secret，类似：

> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxxx

![](../images/stripe-sitinme/014.png)

ps：每次重启 stripe listen 都会生成新的 secret，所以调试期间保持这个终端开着。

4、更新本地 .env.local

把这个新的 secret 加到 .env.local：

STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxxx"

5、重启开发服务器

![](../images/stripe-sitinme/015.png)

.env.local 需要三个变量，拿到就可以测试了。

![](../images/stripe-sitinme/016.png)

点击支付跳转到 Stripe 页面。

![](../images/stripe-sitinme/017.jpg)

使用测试卡号：4242 4242 4242 4242，有效期任意未来日期，CVV 任意 3 位。

![](../images/stripe-sitinme/018.jpg)

这组卡号是 Stripe 官方提供的测试卡，会模拟支付成功。

![](../images/stripe-sitinme/019.jpg)

四、正式环境配置 Webhook

什么是 Webhook？简单理解就是用户付完钱，stripe  主动通知你。

在 Stripe 后台配置：

左侧菜单最下面找到 Developers → Webhooks

![](../images/stripe-sitinme/020.jpg)

点击 Add destination

![](../images/stripe-sitinme/021.jpg)

在搜索框输入 checkout，勾选 checkout.session.complete，这是支付完成时触发的事件。

![](../images/stripe-sitinme/022.jpg)

选择 Webhook endpoint

![](../images/stripe-sitinme/023.jpg)

填入你的接收地址，比如：https://你的域名/api/payment/webhook

点击 Create destination

![](../images/stripe-sitinme/024.jpg)

创建完成后，页面会显示一个 Signing secret，是 whsec_... 开头的。

这个 secret 很重要，用来验证请求确实来自 Stripe，不是伪造的。需要保存到你的环境变量。

![](../images/stripe-sitinme/025.jpg)

五、生产环境密钥

正式上线后，建议创建一个权限受限的密钥，而不是用默认的全权限密钥。

在 API 密钥页面，点击 创建受限密钥，根据你的业务需要配置权限。

![](../images/stripe-sitinme/026.jpg)

六、几个容易踩的坑

Webhook 验签失败：检查 STRIPE_WEBHOOK_SECRET 是不是搞混了，本地用 CLI 的，线上用 Dashboard 的

测试模式和生产模式：API 密钥分测试和生产两套，注意别搞混。测试密钥以 test 开头

金额单位：不同货币的最小单位不同，Stripe 的美元金额单位是"分"，39 美元要传 3900

内测可以设置优惠码，不然税太高了 ，3% + 0.3一笔

以上就是今天的分享，关于编程工具使用，推荐第三方共享平台 aigocode.com，支持 Codex / Claude Code / Gemini 3 三大顶尖模型。

搜索 257735 添加微信，回复【出海资料】即可免费领取《AI 编程出海蓝皮书》，一次读懂普通人也能启动的出海路径。
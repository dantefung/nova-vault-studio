---
title: "刘老板（@leo_xiaolei）：3 天上线一个出海 SaaS——服务器、域名、收款与 SEO 全记录"
date: "2026-11-06"
source: "X/Twitter"
author: "刘老板 (@leo_xiaolei)"
url: "https://x.com/leo_xiaolei/status/2118315850386272559"
coverImage: "../images/leo-3-days-launch-overseas-saas-server-domain-payment-seo/001.jpg"
---

# 刘老板（@leo_xiaolei）：3 天上线一个出海 SaaS——服务器、域名、收款与 SEO 全记录

> 独立开发者 3 天把 AI 演示稿工具搬上海外的完整实战复盘：先算清国内生成式 AI 合规成本再果断转海外；AWS Lightsail 新加坡区用 $200 赠金白嫖 8 个月；Cloudflare Registrar 买域名与 4 个致命开关（Full strict / Always Use HTTPS 关闭时机 / IP Geolocation / Bot Fight Mode 误杀支付回调）；Resend 发信 + Cloudflare Email Routing 收信 + Google/GitHub OAuth 登录；MoR 收款平台横评与费率精算（Waffo Pancake 3.9% + $0.50，$0.50 固定费如何倒逼主推年付）；用开源 claude-seo 完成 SEO 与 GEO 全套改造并被 Google AI 回答引用。

<!-- more -->

作者：刘老板（[@leo_xiaolei](https://x.com/leo_xiaolei)）· 2026 年 11 月 5 日 · 案例产品：apsdeck.com

本文以作者的一个 AI 演示稿工具（APS Deck）为案例。市面上多数 AI PPT 工具的逻辑是「塞一句话进去，套个死板模板吐出十几页废话，想改都没法改」；这个产品的逻辑是像真正的设计师一样和你配合：

1. 先提问理清思路，再列大纲：把粗糙的讲稿、会议记录或文章丢进去，AI 不会急着瞎画，而是先向你追问几个关键问题（受众是谁、什么场合、核心结论是什么），帮你把骨架搭好；
2. 逐页生成高颜值 HTML PPT：确认大纲后，AI 一页一页生成排版精致的 HTML 幻灯片，版式、留白和视觉层级都由代码精准控制；
3. 对话式逐页精修 + 手动微调：哪一页不满意，直接选中那一页让 AI 重排或改词，也可以自己直接上手改细节；
4. 全链路交付：做好后可以直接在网页全屏放映、一键生成公开分享链接，或者高清导出为 PDF 和可编辑的 PPTX；
5. 自带模型（BYOK），不赚 Token 差价：你可以直接填自己的 Anthropic / OpenAI 协议 API Key（官方、中转站、DeepSeek 等兼容接口全支持），甚至直接用已有的 ChatGPT 订阅或 GitHub Copilot 订阅通过设备码登录，平台只收纯粹的工具会员费。

11 月 3 日到 5 日这三天，作者把它的在线版从「只在自己电脑上跑」变成了一个能注册、能登录、能付款、SEO 基建齐全的海外独立站。

下面是这三天的完整实操记录，包括服务器怎么用赠金白嫖大半年、Cloudflare 和 Resend 怎么配、海外收款怎么选、过审后怎么上架订阅，以及最后怎么用 claude-seo 把整套 SEO 做完。大部分活是我和 Claude Code 一起干的：它查资料、写代码、配服务器、修 SEO，我负责拍板和点按钮。

## 一分钟看完

- 做了什么：2026 年 11 月 3 日到 5 日，把 AI 演示稿工具 APS Deck 的在线版上线到 [apsdeck.com](https://apsdeck.com/)：能注册、能登录，页面能被 Google 和 AI 搜索收录，收款接的是 Waffo Pancake。
- 为什么先做海外：在国内对公众提供生成式 AI 服务，除了 ICP 备案，还要做生成式 AI 服务登记、AI 生成内容标识、实名和内容审核，周期以周到月计。
- 服务器：AWS Lightsail 新加坡 2 核 4 GB，$24/月；新账号的 $200 赠金（注册 $100 + 新手任务 $100）能抵 8 个月左右。Lightsail 的 3 个月免费只包括 $5、$7、$12 三档，$24 这档不在内。机房选新加坡，不选香港：OpenAI 和 Anthropic 都不支持香港。
- 域名和 Cloudflare：在 Cloudflare Registrar 买 .com，约 $10/年；SSL 用 Full (strict)，接了付款回调就别开 Bot Fight Mode。
- 邮件和登录：发信用 Resend（免费版每天 100 封），客服邮箱用 Cloudflare Email Routing 免费转发，第一天就接 Google 和 GitHub 登录。
- 收款：没有海外公司，就选 MoR（名义销售方）。Waffo Pancake 每笔 3.9% + $0.50，提现 1%（每次最低 $10）；固定的 $0.50 让 $4 的月付损耗 16.4%，所以主推 $40 的年付（5.1%）。11 月 5 日审核通过后，订阅和一次性时长包一起卖，订阅比一次性便宜 20%（$4/$40 对 $5/$50）。
- 过审后的配置坑：测试和生产环境的商品、密钥、Webhook 各是一套；多行的 PEM 密钥要写成一行（换行写成 \n）才能放进 Docker Compose 的 .env 文件；微信支付只出现在一次性订单上，同一个买家每月累计不超过 ¥1,000。
- SEO 与 GEO：开源的 claude-seo 查出线上网站几乎没有搜索标签，robots.txt 和 sitemap 被登录页挡住；补齐每种语言的地址、canonical、hreflang、分享卡片、结构化数据和页面上的常见问题，放行 AI 搜索爬虫，加了 llms.txt。提交 Google Search Console 后不到一天就被收录，Google 搜索的 AI 回答直接引用了网站的介绍和价格表。
- 第一年固定支出：用满 AWS 的 $200 赠金，第一年现金支出大约 $100（域名 $10，加上赠金用完后 3 个多月的服务器）。

![](../images/leo-3-days-launch-overseas-saas-server-domain-payment-seo/002.jpg)

## 一、先国内还是先海外，最后选了海外

最开始的计划其实是在国内上线，连服务器都准备好了（手里有一台已经做过 ICP 备案的国内云服务器）。但让 AI 把最新合规要求彻底翻了一遍之后发现，今天在国内做一个对公众开放的生成式 AI 应用，光有 ICP 备案远远不够：

- 算法与大模型登记：要去属地网信办做生成式 AI 服务登记或上线备案；
- 显式与隐式标识（强监管）：不仅界面上要有醒目的「AI 生成」提示，导出的 PDF、PPTX 文件画面上要有，连**文件底层的元数据（Metadata）**里都必须写入合规的合成标识；
- 实名制与内容风控：用户公开分享链接前必须做手机号实名认证；用户的每一次输入（Prompt）和 AI 的每一次输出都要接入合规的内容安全审核接口，页面上要有举报入口，相关日志还要留存至少 6 个月；
- 网络与生态隔离：国内服务器直连不上 OpenAI 和 Claude 的接口，也没法用海外用户最习惯的 Google 登录。

网信办公布过的典型案例里，就有不少 AI 小程序因为没做齐合成标识或审核被直接下架。这些合规手续不是不能办，但得先挨个打电话问属地管局、准备安全评估材料，周期动辄几周到几个月。

对于一个想快速验证产品的独立开发者来说，时间成本太高了。所以我当场改了主意：国内先放一放，直接推海外。

## 二、服务器：用 $200 赠金白嫖大半年的 AWS Lightsail

APS 在服务端需要跑一个无头浏览器（Playwright），用来把 HTML 幻灯片高清渲染导出为 PDF，并在生成时自动做版式溢出检查。这意味着几十块钱的 1 核 1G 小水管肯定跑不动，起步至少得 2 核 4G。

为了不踩老教程的坑，我让 AI 把 X、YouTube、Reddit 和主机论坛上最近一两个月的真实反馈全扒了一遍，得出几个很实在的结论：

- 甲骨文免费机（Oracle Cloud）：网上吹得最凶，但今年 6 月起免费 ARM 额度已经从 4 核 24G 砍到了 2 核 12G，而且东京、新加坡等热门地区常年处于 Out of capacity（开不出机器）状态，无故封号也依然玄学。适合拿来折腾当测试机，绝不适合跑正式业务。
- Hetzner：以前是欧洲性价比之王，但今年连续涨了好几次价，而且对国内新注册账号的风控审核极其严格，官网现在经常直接拒单下不了机器。
- 黑五（Black Friday）要不要等：像 AWS、Vultr、DigitalOcean 这种正规云大厂，黑五基本不搞机器降价，等的意义不大；只有 RackNerd、CloudCone 这类小商家的年付闪购值得蹲，适合买来当冷备机。
- 正规大厂里日常月付最便宜的：其实是**腾讯云国际站（Tencent Cloud International）**的轻量应用服务器，新加坡 2 核 4G 只要 $8.5 / 月。
- 机房地区必须选新加坡，别选香港：这一条很多第一次出海的人不知道——[OpenAI](https://platform.openai.com/docs/supported-countries) 和 [Anthropic](https://www.anthropic.com/supported-countries) 的官方支持地区列表里都有新加坡，但香港不在支持列表里！如果你买香港机房直接调官方 API，会被直接拦截。

综合稳定性、网络质量和优惠力度，我最后选了 AWS Lightsail（亚马逊轻量服务器）新加坡区 2 核 4G 套餐，标价 $24 / 月（含 80G SSD、4TB 流量和固定公网 IP）。

### 怎么拿到 8 个月左右的免费时长？

看着每月 $24 好像比小厂贵，但算上 AWS 现在的新账号优惠组合拳，前期的实际服务器成本几乎是 0 元：

1. 先看清 Lightsail 的「3 个月免费」管哪几档：新用户免费用 3 个月，但[只包括](https://aws.amazon.com/lightsail/pricing/) $5、$7、$12 三档 Linux 套餐（$12 是 2 核 2 GB），我要的 $24（4 GB）不在里面，所以这一条我用不上；
2. 注册直接送 $100 赠金（Sign-up Credit）：现在注册 AWS 新账号（选可抵扣的免费计划或标准计划），开号直接到账 $100 美元抵用金；
3. 做 5 个新手小任务再拿 $100 赠金（Earned Credit）：进 AWS 控制台的「Explore AWS」新手任务区，完成 5 个非常简单的小操作（每完成 1 个立刻送 $20，共 $100）：
   - EC2：点开并终止一台实例（送 $20）；
   - RDS：体验创建一次数据库（送 $20）；
   - AWS Lambda：用函数 URL 建个示例（送 $20）；
   - Amazon Bedrock：在文本操场里发一条提示词（送 $20）；
   - AWS Budgets：设一个每月费用预算提醒（送 $20）。 (注：做完任务记得顺手把刚开的测试资源删掉，全程花不了半小时。)

算一笔总账：$200 美元赠金（Lightsail 的月费可以直接从 AWS Credit 赠金里扣），按每月 $24 算，能白用 8 个多月。赠金有使用期限，以 AWS 账单页「Credits」里写的为准。如果你的项目 2 GB 内存够用，先用 $12 档的 3 个月免费，再用赠金，差不多能撑满第一年（赠金一般在开户后 12 个月内有效）。

白嫖党防坑提醒：如果赠金用完后不打算原号续费、想换新账号继续白嫖，千万记得在赠金用完前做好服务器快照（Snapshot）和数据库备份，把 Docker 数据卷和配置文件打包拖回本地或直接迁到新机器。AWS 免费计划一旦额度耗尽或到期停机，不及时处理数据就拿不出来了。

### 开机步骤与踩过的两个坑

标准开机步骤：

1. 登录 AWS 后，直接在顶部搜索栏搜 Lightsail 进去（别在默认的 EC2 页面停留）；
2. 点击 Create instance，地区选 Singapore（新加坡），系统镜像选 OS Only -> Ubuntu 24.04 LTS；
3. 套餐选 $24 / month（4 GB RAM, 2 vCPUs, 80 GB SSD, 4 TB Transfer）；
4. 机器跑起来后，第一件事去 Networking 标签页点 Create static IP 绑定一个免费静态公网 IP（否则重启机器 IP 会变），并在下方防火墙（IPv4 Firewall）里除了默认的 22 和 80 端口，手动把 443（HTTPS）端口加进去。

踩的第一个坑：差点掉进 EC2「伪免费套餐」陷阱 我一开始顺手点进了 EC2 而不是 Lightsail。EC2 的创建页面默认给我推荐了一个标着「符合条件的免费套餐（Free tier eligible）」的机型 m7i-flex.large。看着名字像不要钱，结果仔细一看单价：每小时 $0.1197，跑满一个月要将近 $87！这里「符合免费套餐」的真实意思是「允许用你新号送的 $100–$200 赠金去抵扣」，真开这台机器，送的钱两个月就烧光了。赶紧退出来换到 Lightsail，$24 一口价全包，踏实得多。

踩的第二个坑：服务器开好了，SSH 死活连不上 拿到 IP 和密钥后，在本地终端 ssh 连过去一直卡住，最后报 Connection closed by ... port 22。排查半天发现服务器完全没问题，是因为我本地开着科学上网代理（TUN/全局模式），而很多机场节点出于安全策略会直接封禁对外连接 22 端口。在本地代理软件里给这台服务器的静态 IP 加一条 DIRECT（直连）规则，秒连。

## 三、域名与 Cloudflare

### 1. 为什么不用老域名，而是去 Cloudflare 新买？

我手里原本有一个在阿里云买、并且已经做过国内 ICP 备案的域名。思考了一下还是决定彻底分开，去 Cloudflare 新注册了 apsdeck.com：

- 一方面，出海产品用独立的英文品牌域名（APS + Deck，一听就知道是做 PPT 的）更利于海外传播和 SEO；
- 另一方面，这里有一个无数人踩过的备案大坑：做过国内 ICP 备案的域名，千万不要把注册商（Registrar）转移到 Cloudflare、Namecheap 这类海外平台！ 因为海外注册商没有国内工信部的批复资质，一旦转出，管局核查时你的 ICP 备案就会被直接注销。(注：保持域名留在阿里云/腾讯云，只把 DNS 解析服务器 NS 改到 Cloudflare 是完全没问题的。)
- 买新域名强烈推荐直接在 Cloudflare Registrar 买：它家承诺按注册局的批发成本价卖域名，不赚差价，续费也不涨价，.com 域名一年就 $10 美元出头，买完自动接管 DNS，省去了改 NS 等待生效的时间。

### 2. Cloudflare 必配步骤与 4 个关键避坑开关

域名买好后，在 Cloudflare 的 DNS 页面添加两条 A 记录（@ 和 www）指向 Lightsail 的静态 IP，并开启橙色小黄云（Proxied）。这样外界只能看到 Cloudflare 的节点 IP，你的源站真实 IP 就被严密保护起来了。

接下来这 4 个开关，顺序和设置一旦搞错就会折腾好几个小时：

1. SSL/TLS 加密模式必须改 Full (strict)

- 路径：SSL/TLS -> Overview
- 原因：Cloudflare 默认可能是 Flexible（用户到 Cloudflare 是 HTTPS，Cloudflare 到你服务器走明文 HTTP）。如果你服务器上也配了 HTTPS 跳转，选 Flexible 会直接导致网页陷入无限 301 死循环（浏览器报错 ERR_TOO_MANY_REDIRECTS）。直接选 Full (strict) 最安全。

2. Always Use HTTPS 一开始必须先关着！（踩坑点）

- 路径：SSL/TLS -> Edge Certificates -> Always Use HTTPS
- 原因：我的服务器是用 Caddy 自动向 Let’s Encrypt 申请免费证书的。第一次申请证书时，Let’s Encrypt 默认会走 HTTP（80 端口）访问 http://apsdeck.com/.well-known/acme-challenge/... 来验证域名所有权。如果这时候 Cloudflare 开着 Always Use HTTPS，它会强行把验证请求 301 重定向到 https://，而此时你服务器上还没有证书，握手直接失败，陷入「没证书 -> 无法验证 -> 申请不到证书」的死锁！
- 正确做法：先把 Cloudflare 的 Always Use HTTPS 关掉，等服务器上 Caddy 顺利拿到证书、跑通 HTTPS 后，直接让源站的 Caddy 负责把 HTTP 跳转到 HTTPS 即可。

3. 打开 IP Geolocation（免费获取访客国籍）

- 路径：Network -> IP Geolocation
- 原因：打开后，Cloudflare 会在每个转发给服务器的请求头里自动塞一个 CF-IPCountry 字段（比如 US、SG、CN）。后端代码直接读这个 Header 就能知道访客来自哪个国家，连第三方 IP 地址库都不用接。

4. Bot Fight Mode（机器人对抗模式）千万别开！（致命大坑）

- 路径：Security -> Bots -> Bot Fight Mode
- 原因：很多开发者看到「防机器人」就顺手打开了。结果后面接支付平台（如 Waffo Pancake、Stripe）时，用户明明付完钱了，网站却一直没给他开通会员。一查日志才发现：支付平台服务器发过来的异步回调通知（Webhook）没有浏览器指纹，直接被 Cloudflare 的 Bot Fight Mode 当成恶意爬虫给拦截了（返回 403 验证码页面），而且免费版的 Bot Fight Mode 甚至不允许通过防火墙白名单规则跳过！所以接有 Webhook 回调的 SaaS 站，这个开关一定保持关闭。

最后在服务器端，我用 Caddy 做反向代理，不仅自动申请和续期证书，还在配置里限制了只接受来自 Cloudflare 官方 IP 段的请求，任何试图绕过 CDN 直接扫服务器 IP 的请求一律拒绝。

![](../images/leo-3-days-launch-overseas-saas-server-domain-payment-seo/003.jpg)

## 四、部署上线时的 4 个真实小插曲

第一次推上生产服务器总会遇到几个意料之外的坑：

- Docker 镜像构建突然报错：生产环境用 Docker Compose 部署，第一次 docker compose build 直接挂了。排查发现是一个单元测试文件引用了仅在本地测试环境才有的资源文件，而 .dockerignore 把测试目录排除了。之前 GitHub Actions 的 CI 只跑了测试、从来没跑过 docker build，所以一直没暴露。修好后我立刻在 CI 流水线里加了一步：每次提交必须完整构建一次生产镜像并启动做健康检查。
- 密钥不小心出现在了 AI 聊天记录里：在配环境变量时，我图省事在 Claude Code 对话框里用 ! 跑了一条查看配置文件的命令，结果里面的密钥明文直接进了对话上下文。好在当时服务还没对外开放，我当场把那个旧密钥作废、重新生成了一套新的。血泪教训：涉及生产环境的 Secret 密钥，永远只在自己的独立终端里看；一旦进过任何日志或对话框，不要抱侥幸心理，立刻轮换（Rotate）重置。
- 终端报错 Error opening terminal: xterm-ghostty：我主力终端用的是 Ghostty，SSH 连上 Ubuntu 服务器后想用 nano 改个配置，直接报错打不开。原因是服务器的 terminfo 库里还不认识 Ghostty 的终端标识。解决办法很简单：在命令前加个环境变量 TERM=xterm-256color nano ...，或者写进 ~/.bashrc 一劳永逸。
- 改了服务器 .env 环境变量却不生效：改完配置顺手敲了个 docker compose restart，结果程序里读到的还是老配置。记住：restart 只是重启现有容器进程，不会重新读取 .env 文件；改了环境变量必须执行 docker compose up -d 让它重建容器才会生效。

## 五、邮件收发（Resend）与一键登录（Google / GitHub）全套配置

海外 SaaS 的账户体系，核心就两件事：邮箱收发和第三方 OAuth 一键登录。

### 1. 发信用 Resend：配置步骤与详细费用说明

网站需要发注册登录验证码（OTP）和会员到期提醒邮件，我选了目前海外独立开发者口碑最好的 Resend。

接入步骤与子域名最佳实践：

1. 不要直接用主域名发信，用子域名 mail.apsdeck.com：这是老手都会做的隔离策略。把发信域名设为 mail.apsdeck.com（显示的发件人依然可以是 noreply@mail.apsdeck.com），万一前期发信触发了某些严格邮箱的频控，也不会污染主域名 apsdeck.com 的权重和信誉。
2. 一键配齐 DNS 记录：在 Resend 后台点击 Domains -> Add Domain，输入 mail.apsdeck.com，地区选离服务器最近的（或默认）。因为域名就在 Cloudflare，Resend 提供了 Connect to Cloudflare 按钮，点一下授权就能自动把所需的 DKIM、SPF（TXT + MX 记录）和 DMARC 写进 Cloudflare DNS，过两分钟点 Verify 就绿了。
3. 去 API Keys 生成一个发送密钥填进服务器环境变量，几行代码就能发出排版漂亮的邮件。

Resend 的费用账本（免费额度与超额怎么算）： 很多人只听说 Resend 免费，但没搞清楚它的边界，这里把账算明白：

- 免费版（Free Plan — $0 / 月）：
- 每月免费额度 3,000 封；
- 关键限制：每天最多只能发 100 封（Daily limit: 100 emails/day），且免费版不支持超额按量付费，一旦当天发满 100 封，剩下的请求会直接报错，直到第二天重置。产品刚上线冷启动时完全够用，但如果某天上榜或搞活动引流，100 封/天很容易撞墙。
- 专业版（Pro Plan — $20 / 月）：
- 当你每天注册量起来后，升级到 $20 / 月 的 Pro 档，每月包含额度直接暴涨到 50,000 封（5 万封/月）；
- 解除每日 100 封的上限，支持绑定多个发信域名；
- 超出 5 万封后的按量计费（Overage）：
- 如果单月连 5 万封都用完了，开启按量付费后超出部分是 $0.90 / 1,000 封（也就是每多发 1000 封收 0.9 美元）；再往上还有 $35/月（10 万封）的档位。

收信怎么省钱？用 Cloudflare 免费搞定客服邮箱： Resend 主要管「发」，但合规审核和用户反馈都需要一个像样的官方客服邮箱 support@apsdeck.com。如果为了收几封邮件去开 Google Workspace，每个月又要多花 $6–$7。 最省钱的做法是直接用 Cloudflare Email Routing（电子邮件路由）：在 Cloudflare 后台点开 Email -> Email Routing，先验证一下你自己的个人 Gmail 邮箱，然后建一条规则把 support@apsdeck.com 转发到你的 Gmail。完全免费，一分钱不花就能对外展示正规的品牌客服邮箱。

### 2. Google 与 GitHub 登录

除了邮箱验证码，我强烈建议出海第一天就把 Google 登录和 GitHub 登录接上。

三个实打实的好处：

1. 注册转化率翻倍：海外用户对填邮箱、去收件箱翻验证码非常没有耐心，看到 Continue with Google / GitHub 点一下 2 秒直接进系统，流失率极低；
2. 帮 Resend 省下宝贵的免费额度：每一次用 Google/GitHub 登录，就少发一封验证码邮件，相当于把 Resend 每天 100 封的免费额度留给真正只用邮箱的用户；
3. 天然防机器刷号：直接蹭 Google 和 GitHub 的风控，降低垃圾小号批量注册的概率。

实操步骤与必踩的坑：

- GitHub OAuth 接入（最痛快，5 分钟搞定）：
1. 登录 GitHub，进入右上角头像 Settings -> Developer settings -> OAuth Apps -> New OAuth App；
2. 填好 Application name（APS）、Homepage URL（https://apsdeck.com），以及后端的回调地址 Authorization callback URL（APS 用的是 https://apsdeck.com/api/auth/oauth/github/callback）；
3. 点注册后直接拿到 Client ID，再点生成 Client Secret 填进环境变量，无需任何人工审核，当场生效。
   - Google OAuth 接入（注意那个藏得很深的「发布」按钮！）：
1. 进入 [Google Cloud Console](https://console.cloud.google.com/)，新建一个项目（比如 APS Deck）；
2. 先去左侧菜单配置 OAuth 同意屏幕（现改版为 Google Auth Platform）：用户类型选「外部（External）」，填好应用名称、Logo、客服邮箱，以及你的官网首页、隐私政策和服务条款链接；
3. 去 客户端（Clients / 凭据 Credentials） 页面，点击「创建客户端 -> Web 应用」，在「已获授权的 JavaScript 来源」填 https://apsdeck.com，在「已获授权的重定向 URI」填回调地址，创建后拿到 Client ID 和 Client Secret；
4. 必踩的大坑：刚建好的 Google 登录默认处于 「测试中（Testing）」 状态！我自己用测试号登得好好的，结果换个外部邮箱一登直接报 403: access_denied。原来测试状态下只有手动加进白名单的邮箱能登。而且 Google 后台改版后，把发布按钮藏在了 Google Auth Platform -> 受众群体（Audience） 里——必须去那里点一下 「发布应用（Publish App）」 切到生产环境。只要你只申请了最基础的 email 和 profile 权限，点发布是秒通过、不需要提交视频审核的。

### 3. 模型连接设计：双协议通吃 + 订阅账号设备码登录

账户登进来之后，用户怎么连自己的 AI 模型？我也尽量把门槛降到了最低：

- API Key 只按底层协议分两种：Anthropic 协议和 OpenAI 协议。不管是官方原生接口、各种第三方 API 中转站，还是 DeepSeek、硅基流动这类兼容 OpenAI/Anthropic 协议的服务，填上 Base URL 和 Key 就能直接跑；
- 已有订阅直接用设备码（Device Code）登录：如果你手里已经有 ChatGPT Plus/Pro 或者 GitHub Copilot 订阅，甚至不需要去折腾 API Key，直接在 APS 网页端通过设备码授权登录就能直接调用额度。

![](../images/leo-3-days-launch-overseas-saas-server-domain-payment-seo/004.jpg)

## 六、海外收款：主流方案横评，以及为什么最后选了 Waffo Pancake

产品能跑了，最后一道坎就是国内开发者怎么合规收美金。

### 1. 国内出海主流的几种收款选择对比

目前国内独立开发者出海收款，主流无非两条路、五家平台：

| 平台 | 模式 | 费率（参考） | 国内个人能否直接开 | 核心优缺点 |
| :--- | :--- | :--- | :--- | :--- |
| **Stripe** | PSP（纯支付通道） | 约 2.9% + $0.30 | ❌ 不支持大陆直开 | 体验最好、费率低；但必须注册香港/美国公司或海外主体，**不包办全球税务（VAT）**，大陆身份曲线开户极易触发风控冻资金。 |
| **Lemon Squeezy** | MoR（名义销售方） | 5% + $0.50（另加国际卡/订阅费及提现费） | ⚠️ 越来越严 | 曾经是独立开发者首选，界面漂亮；但被 Stripe 收购后审核大幅收紧，对国内 AI 类产品拒审率高，综合损耗往往到 8%+。 |
| **Paddle** | MoR（名义销售方） | 5% + $0.50 | ⚠️ 门槛较高 | 老牌合规 MoR，极其稳健；但偏好成熟的 B2B SaaS，人工审核周期长、对初创小工具盘问极细。 |
| **Creem** | MoR（名义销售方） | 约 3.9% + $0.40 起 | ✅ 支持 | 近期出海圈很火的新平台，对国内个人开发者友好、支持支付宝/国内卡结算，生态还在快速完善中。 |
| **Waffo Pancake** | MoR（名义销售方） | **3.9% + $0.50**（提现 1%） | ✅ **支持个人直开** | 专为独立开发者与 AI 产品打造的 MoR，包办全球税务，支持信用卡、Apple Pay、Google Pay，一次性付款还能用微信支付，对 AI 编码接入非常友好。 |

### 2. 为什么我最后选了 Waffo Pancake？

首先，我不打算在产品刚验证的阶段就花几千块钱和大把时间去注册维护一家美国或香港公司，所以直接排除了 Stripe，锁定在 MoR（Merchant of Record，名义销售方） 模式里选。

所谓 MoR，就是平台在法律上替你当「卖家」：用户付钱是买 Waffo 的商品，各国的数字增值税（比如最让人头大的欧盟 VAT、日本消费税、美国各州销售税）、开具发票收据、处理退款和信用卡恶意拒付（Chargeback），全部由 Waffo 兜底处理，最后平台把净收入结算给你。

在几个 MoR 平台里最终敲定 Waffo Pancake，主要是看中四点：

1. 国内个人身份直接可申请：不需要海外公司主体，身份证/护照实名认证就能跑通入驻和提现；
2. 费率在 MoR 里很有优势：每笔交易 3.9% + $0.50，提现手续费 1%（[每次最低收 $10](https://docs.waffo.ai/mor/fees)，攒到 $1,000 以上再提才是 1%），比传统 MoR 动辄 5% + 额外国家税费附加 + 高额提现费要实在不少；
3. 支持全球本地支付 + 订阅/单次双模式：支持 Visa / Mastercard / Apple Pay / Google Pay，一次性付款还能用微信支付（订阅不行，见第 5 小节）；既支持自动续费订阅（Subscription），也支持一次性买断（One-time payment）；
4. 对 AI 编程极度友好：后台直接提供了给 AI Agent 用的接入提示词与文档，我把文档丢给 Claude Code，很快就写完了下单跳转和 Webhook 签名校验。

### 3. Waffo Pancake 的操作步骤与严苛审核踩坑

接入代码很快，但真正让我花了一整天返工的，是它的合规审核——比我想象的严得多！

接入与过审步骤：

1. 在 Waffo Pancake 后台创建应用，配置商品与价格（审核期间我只上了月付、年付两个不自动扣费的一次性商品，自动续费的订阅等过审再开，原因见下面第 5 小节），配好 Webhook 接收地址；
2. 提交人工审核前，后台有一个**「网站自检（Site Check）」**按钮。我自信满满点了一下，当场报出两个红叉：未检测到服务条款页面（Terms of Service）、未检测到隐私政策页面（Privacy Policy）。

仔细对照了它的完整商户审核规范才发现，任何正规的海外支付通道（不管是 Waffo、Paddle 还是 Lemon Squeezy），绝不允许你的网站一打开就只有一个干巴巴的登录框。要想顺利过审，必须把下面这几件事全部做齐：

- 必须有一个信息完整的公开产品官网（Landing Page）：访客不登录也能一眼看懂你的产品是干什么的、有哪些核心功能、怎么定价（Pricing 表必须公开透明）；
- 全站页脚必须挂齐三份法律文件：服务条款（Terms of Service）、隐私政策（Privacy Policy）、退款政策（Refund Policy），而且必须在不登录的状态下随时能点开查看；
- 明确的客服联系渠道：网站上必须写明真实有人处理的客服邮箱（前面配好的 support@apsdeck.com 正好派上用场）；
- AI 产品的 4 项特殊合规要求（重中之重！）：因为 APS 属于生成式 AI 应用，风控要求比普通软件更细：
1. 用户的输入提示词（Prompt）必须先经过内容安全审核服务过滤；
2. 在服务条款或使用规范（Acceptable Use Policy）里，必须逐条明确列出六大类禁止生成的内容（违法犯罪、儿童侵害、仇恨言论、色情暴力、欺诈钓鱼、侵犯知识产权等）；
3. 页面上必须提供违规生成内容的举报入口与处理说明；
4. 必须在条款或说明里公开披露产品底层支持和调用的是哪些 AI 模型家族。

知道规则就好办了。我和 Claude Code 配合，把产品官网首页重新设计了一遍，又用英文（附中文对照）写齐了服务条款、隐私政策和退款政策三份页面挂在页脚，再次跑网站自检，顺利全绿提交审核。11 月 5 日，审核通过。

### 4. 算完手续费账，我为什么主推年付和订阅？

在配价格的时候，我拿计算器仔细算了一下 3.9% + $0.50 这个费率结构对低客单价产品的影响：

- 因为每一笔交易都有 $0.50 的固定起步费，单笔金额越小，手续费吃掉的比例就越夸张；
- 我的月付定价很克制，只要 $4 / 月：算下来每收一笔 $4，Waffo 要扣掉 4 × 3.9% + 0.50 = $0.66，光通道费就占了 16.4%（还没算提现费）；
- 而如果是 $40 / 年 的年付：每收一笔 $40，扣掉 40 × 3.9% + 0.50 = $2.06，手续费占比瞬间降到了 5.1%！

我不想为了转嫁这 $0.50 的固定成本而硬涨用户的月费，所以最后在定价页面做了一个顺应双赢的调整：保持 $4/月 不涨价，但界面上默认高亮、主推 $40/年的年付方案（立省两个月）。

过审开了订阅以后，我又往前走了一步：主推订阅。没有直接给订阅降价——$0.50 的固定费在 $3 上要吃掉 20.6%——而是反过来：订阅保持 $4/月、$40/年，一次性时长包涨到 $5 买 1 个月、$50 买 12 个月，订阅比一次性便宜 20%，一次性那笔的手续费占比也从 16.4% 降到 13.9%。价格页每张卡片上写的是订阅价，底下一行小字写「不想自动续费？一次性买 1 个月 $5」。大陆用户想用微信付，就买一次性时长包：Waffo 的微信支付只出现在一次性订单上，订阅不支持。刚过审还没有付费用户，这时候改价不用顾虑任何老用户。

### 5. 审核通过后：上架订阅、配 Webhook，和 4 个配置坑

审核期间我特意只卖一次性时长包（买一次加 1 个月或 12 个月，不会自动扣费）。自动续费的代码其实早就写好了，但一开订阅，服务条款和退款政策都要换成写了「自动续费」的那一版，而审核员看到的页面和条款，必须和你实际在卖的东西一致。所以我选了最简单的卖法先过审，过了再开订阅。

过审后要做的 4 件事：

1. 在生产环境建商品：最后一共 4 个——月付、年付各一个一次性商品（$5、$50），再各一个订阅商品（$4 按月、$40 按年）。建订阅商品时有三个选项别填错：
   - 试用期不开：APS 自己送 14 天、不用绑卡的试用，Waffo 再给一次就成了两次试用；
   - 不放进「灵活订阅组」：同组的方案，买家可以在客户门户里自己从月付换到年付，而我的系统还没做换套餐，账会对不上；
   - 只配美元价：Waffo 的订阅只收美元，也不支持微信支付。
1. 店铺设置里填好网站地址：客户门户里「返回商户网站」的按钮要用它。
2. 在生产环境加 Webhook：填自己的回调地址，格式选 Raw。事件除了 order.completed、refund.succeeded，还要勾上 8 个 subscription.*（开通、扣款成功、续期、恢复、关闭和重新打开自动续费、扣款失败、结束）。我干脆 15 个全选：程序对用不到的事件也回 200，Waffo 就不会一直重发。
3. 服务器换成生产环境的配置：APS_WAFFO_MODE=prod，加上生产环境的 API 私钥、回调公钥、4 个商品 ID 和店铺号，然后部署。

踩的 4 个坑：

- 测试环境和生产环境是两套，什么都不通用：API 密钥、回调公钥、Webhook 都是各一份；商品也要确认在生产环境里存在，服务器上填的 ID 指向生产环境里没有的商品，下单直接失败。另外，订阅商品和一次性商品是两组不同的商品，ID 不能填成同一个——我服务器上订阅那两行一开始写的就是一次性商品的变量名。
- 多行密钥塞进 .env 文件，Docker Compose 直接报错：私钥和回调公钥下载下来是多行的 PEM 文件。原样粘进 aps.env，Docker Compose 按行读，第二行开始就成了「不合法的变量名」，报 unexpected character “/” in variable name；从终端窗口里复制长字符串，终端的自动折行也会被当成换行一起复制进去。解决办法：整个密钥写成一行，换行处写成 \n，程序读的时候再还原。后台页面上复制出来的是不带头尾标识的一行字符串，开头和结尾的标识要自己补上，中间那一长串不用再分行：APS_WAFFO_WEBHOOK_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0...\n-----END PUBLIC KEY-----
APS_WAFFO_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhk...\n-----END PRIVATE KEY-----

值两边的引号可加可不加；要加，就把包括标识在内的整个值包起来。

- 改完配置先检查，再部署：配置写错了，新容器起不来，网站就直接挂了。我让 Claude Code 写了一条检查命令，用部署的镜像把 aps.env 读一遍，逐项报告密钥能不能解析、商品 ID 对不对，全程不打印任何密钥：cd /opt/aps && docker compose run --rm --no-deps --entrypoint node aps -e ’
const c=require(“crypto”),e=process.env;

const key=(n)=>(e[n]||“”).trim().replace(/\\n/g,“\n”);

c.createPrivateKey(key(“APS_WAFFO_PRIVATE_KEY”));

c.createPublicKey(key(“APS_WAFFO_WEBHOOK_PUBLIC_KEY”));

console.log(“keys ok, mode =”, e.APS_WAFFO_MODE)’

我前后跑了五遍，依次查出：多行密钥把文件读坏了、私钥没加头尾标识、店铺号那一行被误删、订阅商品的 ID 填成了一次性商品的。每一个都是部署前一条命令就能发现的问题，要是直接部署，就是网站挂掉再回滚。

- 微信支付只在一次性订单上出现：选 Waffo 的理由之一是能收微信，结果第一次打开的是订阅的收银台，只有卡、Apple Pay 和 Google Pay，还以为微信没开通。换成一次性时长包一试，微信就出来了，付款也走通了。规则有三条：
1. 只支持一次性付款，订阅不能用微信；
2. 同一个买家每个自然月通过微信付给同一个商户，累计不超过 ¥1,000（约 $140）。这是按人按月累计，不是单笔限额，复购的人可能月中就到顶；
3. 不满足条件时，收银台直接不显示微信，买家改用银行卡或 Apple Pay / Google Pay。这个额度是微信那边定的，以后可能调整。

按我的价格，一个人一个月用微信最多能买两个 12 个月的时长包（$50 约 ¥360），足够了。另外按 Waffo 公布的费率，微信付款只收 3.9%，没有 $0.50 的固定费，退款也不收钱：$5 的时长包用微信付，手续费只有 $0.2，用卡付要 $0.7。

部署之后，最后一步是用真卡把一次性和订阅各买一次、再在后台退掉，确认两种付款、回调和退款都走通了。退款别急：[卡的退款](https://docs.waffo.ai/features/refunds)走发卡行，一般 3–10 个工作日（最多 14 天）到账，后台一直显示「处理中」是正常的；微信的退款马上到。

### 6. 推广优惠券：折扣最多给到多少，还能赚钱？

过审之后想做一波上线推广，Waffo 后台可以直接建优惠券：按百分比或固定金额减、只用于某几个商品、订阅打几期、到期日、总共能领几次，买家在收银台输入优惠码就行。建之前我先把账算清楚：每个付费用户每月至少要赚 1 美元。

- 一笔钱到手大约是 0.951 × 价格 − 0.495（Waffo 3.9% + $0.50，再加提现 1%，假设攒到 $1,000 以上再提现）；
- 月付想每月到手 1 美元，价格不能低于 $1.60，也就是最多减 60%；
- 年付要 12 个月每月 1 美元，价格不能低于 $13.20，最多减 67%。

所以我只建了一张：只用于年付订阅、首年 5 折（$20），2026 年 11 月 30 日截止，限 500 份。一次性时长包不参加活动，继续让订阅更划算。

说句实话，5 折之后这一单基本不赚钱：$20 扣掉 Waffo 的手续费和提现费，到手大约 $18.5，摊到每个月只剩 $1.54。光是新加坡那台服务器，赠金用完以后每月就是 $24，得有 16 个这样的年付用户才够付服务器，域名、发信和我自己熬的夜还没算进去。所以这次就是按成本价卖，只卖 500 份，到 2026 年 11 月 30 日为止，图的只有一件事：让更多人先用起来，给我反馈。只打首期也很重要：如果每次续费都打折，月付 $2 一个月就只剩 $1.41。另外记得设兑换上限：退款时 Waffo 每笔收 $1 退款费，原来那笔的手续费也不退，冲着优惠码来、买完就退的人会让你倒贴。

接优惠券时也踩了两个坑：

- 自己的金额校验会把折扣单当成异常：为了防篡改，我的系统会核对「实付金额 = 订单金额」，对不上就不给会员时长。用了优惠券，实付自然对不上。改法是看 Waffo 回调里的明细：listTotal − discountAmount = total，核对折扣前的标价是不是自己的价格，再把折扣单独记进收入。
- 别用 Waffo 的商品链接带 ?discount_code=：那种链接不经过自己的网站，付了钱也对不上是哪个账号。让用户在自己网站的设置页点订阅，到收银台再输入优惠码。

### 7. 上线第一天：真付一笔，再查一遍服务器

代码测得再全，也是对着假的支付服务测的。所以上线当天，我用真卡、带着优惠码订了一单年付，然后让 Claude Code 写了两条只读命令，在服务器上把订阅、订单、收入记录和相关日志打出来（不打印邮箱和密钥），贴回给它看：

- 钱对得上：年付订阅 active，付到 2027-11-05；收入记录是「实收 $20、折扣 $20、手续费约 $1.28、到手约 $18.72」，日志里有一行「第 1 期用了优惠券：标价 4000，折扣 2000，实付 2000」，没有任何「对不上」。
- 关掉自动续费、客户门户都正常：在设置页点「关掉自动续费」，APS 显示「订阅在 2027 年 11 月 5 日结束，之后不会再扣款」，Waffo 的客户门户里同一个订阅也变成了「即将结束」；「管理付款方式」直接以这个账号的身份打开门户，不用再收验证码。
- 日志里揪出一个只有真服务才会暴露的 bug：每 10 分钟一次的订阅补单查询，每次都报 Field “paymentMethod” of type “PaymentMethod” must have a selection of subfields。原因是 GraphQL 查询里多要了两个文档里没写的字段，真服务的 schema 直接拒了；测试用的假服务什么查询都接，所以一直没测出来。付款回调不受影响，但万一哪次回调丢了，就补不回来了。改法：只查文档里写了的字段；假服务也照真服务的字段表校验查询，同样的错误以后在测试里就会报出来。

教训就一句：测试用的假服务要和真服务一样挑剔，上线第一天一定要看日志。

![](../images/leo-3-days-launch-overseas-saas-server-domain-payment-seo/005.jpg)

## 七、重头戏：用开源 claude-seo 做完海外建站的 SEO 与 GEO

把网站部署上线、配好收款，其实只完成了出海的一半。国内很多独立开发者做完海外站后最大的困惑是：网站上线了，怎么让海外用户在 Google、ChatGPT 和 Perplexity 里搜到我？

以前做海外 SEO，要么每个月花 $100+ 买 Ahrefs、Semrush 这类工具看一堆报表，要么自己对着零散的清单一个个改标签。这次做 apsdeck.com，我用的是 GitHub 上的开源项目 [claude-seo](https://github.com/AgriciDaniel/claude-seo)（MIT 协议）。

### 1. claude-seo 是什么？

claude-seo 是给 Claude Code 用的一套开源 SEO + GEO（AI 搜索优化）插件。我用的 v2.5.0 有 26 个子技能和 19 个子智能体，分别负责技术 SEO、内容质量、Schema 结构化数据、sitemap、多语言（hreflang）、性能和 AI 搜索；还带一组检查脚本：解析页面标签、校验结构化数据、按 Lighthouse 的规则检查 llms.txt。

它不只给一份报告：因为插件就跑在你的代码仓库里，Claude Code 可以照着检查结果直接改代码。

### 2. 怎么安装？

在 Claude Code 里两条命令（装在用户级，所有项目都能用）：

```powershell
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
```

装好以后用 /seo 系列命令：/seo audit <网址> 做全站体检，/seo technical、/seo schema、/seo hreflang、/seo geo 分项检查。

### 3. 它在 apsdeck.com 上查出了什么

上线第一天的 apsdeck.com，对用户是好的，对搜索引擎几乎是一片空白：

| 查出的问题 | 后果 | 怎么改的 |
| :--- | :--- | :--- |
| 页面没有 description、canonical、分享卡片和结构化数据 | Google 自己猜摘要；链接发到 X 上没有大图 | 每个公开页面补齐标题、描述、canonical、Open Graph 和 X 卡片；每种语言一张 1200×630 的分享图 |
| `robots.txt`、`sitemap.xml` 被跳转到登录页 | 爬虫拿不到抓取规则和页面清单 | 这两个地址对外开放；sitemap 只列五个公开页面（首页、价格、服务条款、隐私政策、退款政策） |
| 三种界面语言共用一个地址，按 Cookie 和浏览器语言显示 | 爬虫没有 Cookie，只看得到简体中文，英文页面不会被收录 | 每种语言一个地址（`?lang=en`、`?lang=zh-Hans`、`?lang=zh-Hant`），用 hreflang 互相关联，不带参数的地址作为 x-default |
| 不存在的地址也跳转到登录页 | 搜索引擎把它们当成「软 404」 | 只有工作区要登录，其他不存在的地址返回真正的 404 |
| 首页 HTML 有 256 KB：示例图片用 base64 写进了页面，整个界面的文案也一起塞了进去 | 首屏慢，爬虫要下载一堆用不上的内容 | 图片改成单独的地址并缓存，文案只给页面用到的几组，降到 84 KB |
| 分享链接、邀请链接没有标记不收录 | 私人内容有被收录的风险 | 响应头加 `X-Robots-Tag: noindex` |
| 品牌名撞车：搜「APS AI presentation」，结果全是另一个也叫 APS 的产品（Auto Presentation Switcher）；搜「apsdeck」什么都没有 | 用户想找也找不到，AI 也容易认错 | 公开页面的标题、分享卡片、结构化数据统一写「APS Deck」，和域名对上，别名写 APS、apsdeck；常见问题第一句就是「APS（也叫 APS Deck，网址 apsdeck.com）是……」 |

### 4. GEO：让 ChatGPT、Perplexity、Claude 能引用你

- 放行 AI 搜索爬虫：robots.txt 单独列出 OAI-SearchBot、Claude-SearchBot、PerplexityBot 等，放行公开页面，挡住工作区和接口。上线后还要去 Cloudflare 看一眼有没有开「拦截 AI 爬虫」，开着的话 robots.txt 写什么都没用。
- 答案直接写在页面上：首页加了一组常见问题（APS 是什么、要不要自己准备模型、多少钱、能导出什么、支持哪些语言、数据放在哪），每个答案第一句就是结论，AI 可以原样摘录。
- 结构化数据只写真的：SoftwareApplication（订阅和一次性时长包的价格）、Organization、WebSite、BreadcrumbList。没有写 FAQPage，因为 Google 早已不给普通网站展示 FAQ 富媒体结果；也没有编评分和评价。
- 加了 /llms.txt：一页 Markdown 产品说明，文字取自首页的常见问题，价格和试用天数读网站配置，和页面上写的一致。Google 表示搜索不使用它，claude-seo 也不给它算分，我把它当作给其他 AI 工具的说明书。
- 服务端渲染：多数 AI 爬虫不执行 JavaScript，页面内容在 HTML 里就是完整的。

### 5. 怎么确认改对了

- 用 claude-seo 自带的脚本检查每个页面的标签、结构化数据和 llms.txt，全部通过；
- 写了自动化测试：每个公开页面、每种语言的 canonical、hreflang、分享卡片和结构化数据，robots.txt、sitemap、llms.txt 的内容，登录页和分享链接不被收录，首页 HTML 不超过 150 KB；
- 部署之后对线上又跑了一遍：sitemap 里 17 个页面全部 200，结构化数据 17/17 通过校验；用 GPTBot、OAI-SearchBot、ClaudeBot、Claude-SearchBot、PerplexityBot 的身份去访问，全部 200、拿到的内容和浏览器一样，Cloudflare 没拦；llms.txt 符合 Lighthouse 的规则，不存在的地址是真正的 404；
- 一个小坑：在国内开着代理的 TUN 模式跑 claude-seo，域名会被解析成 198.18.x.x 的假 IP，它的安全检查当成内网直接拒绝，检查结果全是失败。要用 DNS-over-HTTPS 查到真实 IP 再跑；
- 最后一步是把网站提交给搜索引擎，见下一节。

### 6. 提交给搜索引擎：步骤、坑和结果

Google Search Console（约 15 分钟）：

1. 打开 [Search Console](https://search.google.com/search-console)，「添加资源」选左边的**「网域」**，填 apsdeck.com（不带 https:// 和 www）。网域资源一次覆盖 http、https 和 www。
2. 复制页面给的 TXT 记录（google-site-verification=…），到 Cloudflare 的 DNS 里加一条：Type TXT、Name @、Content 粘贴整串，保存后回 Search Console 点「验证」。
3. 左侧「站点地图」填 sitemap.xml 提交，过一会儿状态变成「成功」，发现 17 个网址。
4. 顶部「网址检查」逐个输入首页、英文首页、中文首页、英文价格页、中文价格页 5 个地址，点**「请求编入索引」**。其余页面靠 sitemap，不用一个个点。

Bing Webmaster Tools（约 5 分钟）：ChatGPT 的搜索有一部分用的是 Bing 的索引，所以 Bing 也要交。用 Google 账号登录，选「Import your sites from GSC」，站点、验证和 sitemap 一起导入；再在左侧 URL Submission 一次粘贴那 5 个地址提交。

踩的三个小坑：

- dig @1.1.1.1 TXT apsdeck.com 超时：本机代理把直连 DNS 拦了，查不了验证记录。改用 DNS-over-HTTPS 查，走的是普通 HTTPS：curl -s -H ’accept: application/dns-json’ ’https://cloudflare-dns.com/dns-query?name=apsdeck.com&type=TXT’。
- Bing 的 URL Inspection 显示「Not discovered」：新域名的正常状态，不是哪里配错了。点「Request indexing」或者在 URL Submission 里提交就行。注意 URL Inspection 页面下面那个列表只是「查看过的记录」，不代表已经提交。
- 先确认爬虫进得来：用 Bingbot 的 User-Agent 请求首页，返回 200、内容完整；Search Console 的「测试实际网址」也显示「网址可编入 Google 索引」，说明 Cloudflare 没拦。

结果：提交后不到一天，Google 搜 site:apsdeck.com 就有结果了，标题是改过的「APS Deck · 面向讲师和创作者的 AI 演示稿编辑器」；更惊喜的是 Google 的 AI 回答直接把 APS Deck 的介绍、功能和价格表（订阅 $4/月、$40/年，时长包 $5、$50，14 天免绑卡试用）列了出来，几乎就是首页常见问题的原话。这就是 GEO 想要的效果：AI 能读到、读得懂、愿意引用。Bing 还在排队，新域名一般要几天到两周。

![](../images/leo-3-days-launch-overseas-saas-server-domain-payment-seo/006.jpg)

### 7. 和传统 SEO 工具比，好在哪？

传统 SEO SaaS 只给你一份报错列表，每一条是什么意思、代码该怎么改，还得自己去查。

claude-seo 就跑在代码仓库里。 我对 Claude Code 说的原话是：

「用它把项目的整个 SEO 和 GEO 做好，测试好，做到完美之后，提交代码，告知我去部署。」

从体检、改代码、生成分享图、写测试到提交，都在这一次对话里完成，我只负责最后部署。如果你也在用 Claude Code 做独立开发出海，这个插件值得装。

![](../images/leo-3-days-launch-overseas-saas-server-domain-payment-seo/007.jpg)

## 八、成本总账本

最后把这次出海建站的所有硬性成本列一张明细表：

| 项目 | 选型方案 | 账面费用 | 实际首年支出与说明 |
| :--- | :--- | :--- | :--- |
| **服务器** | AWS Lightsail 新加坡（2 核 4G / 80G SSD） | $24 / 月 | **前 8 个月左右 $0**（注册送 $100 + 5 个新手任务送 $100，按 $24/月能抵 8 个多月），之后每月 $24；第一年约 $90 |
| **域名** | `apsdeck.com`（Cloudflare Registrar） | 约 $10 / 年 | **$10 / 年**（批发成本价，续费同价） |
| **CDN / 证书 / 防护** | Cloudflare DNS + SSL + Caddy | 免费 | **$0** |
| **官方客服邮箱** | `support@apsdeck.com`（Cloudflare Email Routing） | 免费 | **$0**（免费自动转发到个人 Gmail） |
| **验证码与通知发信** | Resend（绑定子域名 `mail.apsdeck.com`） | 免费版 $0 / 月 | **$0**（免费 3,000 封/月、上限 100 封/天；后续量大了升 Pro 是 $20/月 含 5 万封，超出 $0.90/千封） |
| **SEO / GEO 优化** | 开源 `claude-seo` 插件 | 免费开源 | **$0**（省下每月上百刀的 SEO SaaS 工具费） |
| **海外收款通道** | Waffo Pancake（MoR 模式，包全球税） | 无月费 | **每笔 3.9% + $0.50（微信 3.9%），提现 1%、每次最低 $10**（不成交不扣钱） |

如果不算 AWS 新号赠金，第一年固定成本也不到 300 美元；把 AWS 的 $200 赠金用满，第一年的硬性现金支出大约 $100：域名 $10，加上赠金用完后 3 个多月的服务器。

## 常见问题

### APS Deck（APS）是什么？

APS Deck（简称 APS）是一个 AI 演示稿工具：给它一份讲稿、笔记或文章，它先问几个关于听众和目的的问题，列出大纲，再一页页做成 HTML 演示稿；之后可以让 AI 改，也可以自己改，然后在网页里放映、生成分享链接，或导出 PDF 和可编辑的 PPTX。网址是 [apsdeck.com](https://apsdeck.com/)。

### APS 多少钱？要自己准备模型吗？

订阅每月 $4 或每年 $40，随时可以关掉自动续费；不想自动续费，也可以买一次性时长包：1 个月 $5、12 个月 $50。新账号免费试用 14 天，不用绑卡。一次性时长包也能用微信支付，订阅只能用银行卡、Apple Pay 或 Google Pay。模型用你自己的：OpenAI 或 Anthropic 协议的 API Key（官方、中转站、DeepSeek 等兼容接口），或者 ChatGPT、GitHub Copilot 订阅；APS 不卖模型额度。

### 国内个人开发者怎么收美元？

没有海外公司，就用 MoR（名义销售方）平台：平台在法律上作为卖家收款，替你处理各国的税、发票、退款和拒付，再把净收入结算给你。Waffo Pancake、Creem 支持国内个人直接入驻；Stripe 需要海外公司主体。

### Waffo 审核通过后还要做什么？

在生产环境建好要卖的商品（一次性和订阅是不同的商品），加一个生产环境的 Webhook，再把服务器换成生产环境的 API 密钥、回调公钥和商品 ID。测试环境的这些在生产环境都不能用。密钥写进 .env 文件时要写成一行，换行处写 \n。

### Waffo 能用微信支付吗？

能，但只限一次性付款，订阅不支持。同一个买家每个自然月通过微信付给同一个商户，累计不超过 ¥1,000（约 $140）；订单是订阅、或者这个买家当月已经到顶时，收银台不显示微信，买家改用银行卡或 Apple Pay / Google Pay。按 Waffo 公布的费率，微信付款只收 3.9%，没有 $0.50 的固定费。

### AWS Lightsail 能免费用多久？

新用户的 3 个月免费只包括 $5、$7、$12 三档 Linux 套餐（[价格页](https://aws.amazon.com/lightsail/pricing/)）。新账号另有 $200 赠金（注册 $100 + 完成 5 个新手任务 $100），可以抵 Lightsail 的月费：$24 的 2 核 4 GB 能用 8 个多月，$12 的 2 GB 先免费 3 个月再用赠金，差不多能撑满第一年。

### Waffo 提现收多少手续费？

提现收 1%，每次最低 $10（[费率页](https://docs.waffo.ai/mor/fees)）：提 $500 也收 $10，攒到 $1,000 以上再提，才是 1%。交易手续费另算：卡和钱包每笔 3.9% + $0.50，微信支付 3.9%。

### 新网站多久能被 Google 收录？

提交 Search Console、对首页「请求编入索引」的话，可以很快：apsdeck.com 不到一天就被收录了，Google 的 AI 回答也开始引用。不提交就只能等 Google 自己发现，可能要几天到几周；Bing 一般比 Google 慢。

### 海外服务器选香港还是新加坡？

要调用 OpenAI 或 Anthropic 的接口，选新加坡（或东京）。两家的支持地区都有新加坡，没有香港。

### Cloudflare 哪些开关容易出错？

SSL/TLS 用 Full (strict)；源站用 Let’s Encrypt 申请证书时，先关掉 Always Use HTTPS；要知道访客来自哪个国家，打开 IP Geolocation；网站接了付款回调，就别开 Bot Fight Mode，它会把回调当成机器人拦掉。

### claude-seo 怎么安装？

在 Claude Code 里运行 /plugin marketplace add AgriciDaniel/claude-seo 和 /plugin install claude-seo@agricidaniel-claude-seo，然后用 /seo audit <网址> 检查网站。它不检查本机地址，要等网站上线。

### llms.txt 有用吗？

对 Google 搜索没有用，Google 表示不使用它。它是给其他 AI 工具看的一页说明，成本很低，可以加。真正影响 AI 搜索引用的是：AI 爬虫进得来，页面是服务端渲染的，问题和答案直接写在页面上。

## 写在最后：出海路上真正花时间的是什么

技术活、合规页面和 SEO 基建都已经就位，支付平台的商户审核也在 11 月 5 日通过了：订阅（比一次性便宜 20%）与一次性时长包同时开卖。

回头看这三天，花时间最多的其实不是写业务代码，而是摸清出海路上每一步的「隐形规则」：

- 哪个机房地区能合法调哪家大模型；
- 怎么把云厂商的免费赠金拿满；
- Cloudflare 哪个开关会误杀付款通知；
- MoR 支付审核到底在卡什么条款；
- 以及怎么让搜索引擎和 AI 认识你的新网站。

把这些踩过的坑和完整步骤记下来，希望能帮同样想把产品推向海外的朋友少走弯路。

## 相关页面

- [[sources/coderjefflee-saas-seo-infrastructure]]
- [[sources/noahduck-stripe-complete-guide-from-beginner-to-advanced]]
- [[concepts/seo-basics]]
- [[concepts/open-source-seo-tooling]]

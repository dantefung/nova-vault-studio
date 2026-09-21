---
title: "你的出海网站有没有流量？你的网站用户干了什么？这4个免费工具让你不再盲目出海 | 安装篇"
author: "易焘"
date: "2025-09-21"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/UC_asiTBVXyPfgRrocbn2Q"
---
# 你的出海网站有没有流量？你的网站用户干了什么？这4个免费工具让你不再盲目出海 | 安装篇

前面的文章：

工具站都长同一张脸？我怎样用1个Prompt生成2.0落地页？

上线出海网站，不要总想着从0到1

崩溃了！AI把我的代码越改越乱！怎么办？

新手把代码推上GitHub的最佳姿势，为Vercel一键部署铺路

Vercel一键部署NextJS，上线出海网站就是那么简单！

出海风浪那么大，怎么可以没有这个护身符？ Cloudflare从0到1实战：DNS、SSL、邮箱、缓存、反爬全指南

我们详细讲了快速上线一个NextJS网站的流程。那么，网站上线之后，网站究竟有没有流量？有哪些用户访问了网站？他们在网站中做了哪些事情？有没有什么工具可以让我们洞悉网站的流量和用户的行为，为我们的出海助一臂之力？

今天，我们就介绍这4个免费的工具，分别是Google Search Console（简称GSC）、Google Analytics（简称GA）、微软Bing Webmasters和微软Clarity，让你的出海不再盲目！

本文我们先承接网站上线的流程，先讲解怎样安装部署这4个免费的工具，后面我在另外写文章讲述怎样通过这4个工具跟踪网站流量和分析用户行为。这里简单概述这4个工具的作用：

Google Search Console：跟踪并诊断你的网站在Google自然搜索中的表现与索引健康情况；

Google Analytics：跟踪网站的各个渠道来源并分析用户行为与转化，回答“谁从哪里来、进站后做了什么”；

Bing Webmasters：跟踪并诊断你的网站在Bing自然搜索中的表现与索引健康情况；

Clarity：通过录像回放与热力图可视化用户行为，快速定位网站使用问题与转化问题。

和上一篇讲解Cloudflare一样，以下内容同样可以作为你的网站上线SOP的一部分，让你10分钟内部署好这4个强大的网站跟踪和分析工具。

1、Google Search Console

打开GSC：

> https://search.google.com/search-console/

https://search.google.com/search-console/

通过你的谷歌账号登录进入你的GSC管理页面。

![image](./images/four-free-traffic-tools-install/001.png)

打开左上角网站下拉列表，点击底下的“Add property”添加新的网站：

![image](./images/four-free-traffic-tools-install/002.png)

![image](./images/four-free-traffic-tools-install/003.png)

![image](./images/four-free-traffic-tools-install/004.png)

输入你的网站域名（不要带“https://”）。由于我们的网站域名是在Cloudflare中做解析，因此，可以直接通过Cloudflare添加一条TXT解析记录，来进行网站所属的验证。

![image](./images/four-free-traffic-tools-install/005.png)

验证成功后，网站就添加到GSC中。

![image](./images/four-free-traffic-tools-install/006.png)

在左上角网站下拉列表中找到你新添加的网站打开，就进入这个网站的GSC页面。接下来，我们顺手提交网站的sitemap.xml文件和网站首页到GSC中。

在左上角网站下拉列表中找到你新添加的网站打开，就进入这个网站的GSC页面。

接下来，我们顺手提交网站的sitemap.xml文件和网站首页到GSC中。

![image](./images/four-free-traffic-tools-install/007.png)

点击左侧菜单“Sitemaps”进入Sitemaps管理页面。输入我们网站的Sitemap链接，点击“Submit”即可提交网站的Sitemap文件。

这些细节没注意，你的出海网站有可能会前功尽弃

> 前面的这篇文章：我们提到网站上线前的注意事项，以及生成sitemap.xml、robots.txt和llms.txt文件。

前面的这篇文章：我们提到网站上线前的注意事项，以及生成sitemap.xml、robots.txt和llms.txt文件。

![image](./images/four-free-traffic-tools-install/008.png)

接下来提交网站的首页，点击左侧菜单“URL Inspection”，然后在上面搜索框中输入你的网站首页链接，比如：

> https://airobotlion.com/

https://airobotlion.com/

然后按“Enter”回车键。

![image](./images/four-free-traffic-tools-install/009.png)

![image](./images/four-free-traffic-tools-install/010.png)

![image](./images/four-free-traffic-tools-install/011.png)

可以看到我们的网站首页链接状态为“URL is not on Google”。这很正常，因为我们的网站是新网站，链接是新链接。点击“REQUEST INDEXING”提交我们的网站首页，提交成功后可以看到显示“Indexing requested”。

就这样，我们已经把网站添加到GSC中，快的话1天内就会看到来自于谷歌搜索的数据。

2、微软Bing Webmasters

接下来，我们顺便把网站添加到Bing Webmasters中，因为Bing Webmasters可以直接导入GSC中的网站。

打开Bing Webmasters：

> https://www.bing.com/webmasters/

https://www.bing.com/webmasters/

通过谷歌邮箱或其它邮箱登录。

![image](./images/four-free-traffic-tools-install/012.png)

打开左上角网站下拉列表，点击底下的“Add a site”添加新的网站：

打开左上角网站下拉列表，点击底下的“Add a site”添加新的网站：

![image](./images/four-free-traffic-tools-install/013.png)

![image](./images/four-free-traffic-tools-install/014.png)

![image](./images/four-free-traffic-tools-install/015.png)

![image](./images/four-free-traffic-tools-install/016.png)

选择通过从“Google Search Console”导入，页面会跳转到谷歌进行登录和验证：

![image](./images/four-free-traffic-tools-install/017.png)

![image](./images/four-free-traffic-tools-install/018.png)

![image](./images/four-free-traffic-tools-install/019.png)

![image](./images/four-free-traffic-tools-install/020.png)

验证成功后，可以看到刚刚我们新添加到GSC中的网站，勾选这个网站并导入。

导入成功后，在左上角网站下拉列表中找到你新添加的网站打开，就进入这个网站的Webmasters页面。

接下来，与GSC同理，我们顺手提交网站的sitemap.xml文件和网站首页到Webmasters中。

![image](./images/four-free-traffic-tools-install/021.png)

![image](./images/four-free-traffic-tools-install/022.png)

![image](./images/four-free-traffic-tools-install/023.png)

点击左侧菜单“Sitemaps”进入Sitemaps管理页面，然后点击“Submit sitemap”，输入我们网站的Sitemap链接，点击“Submit”即可提交网站的Sitemap文件。

![image](./images/four-free-traffic-tools-install/024.png)

![image](./images/four-free-traffic-tools-install/025.png)

![image](./images/four-free-traffic-tools-install/026.png)

![image](./images/four-free-traffic-tools-install/027.png)

接下来提交网站的首页，点击左侧菜单“URL Inspection”，然后输入你的网站首页链接，比如：

> https://airobotlion.com/

https://airobotlion.com/

然后点击“Inspect”提交。

就这样，我们已经把网站添加到Webmasters中，过两天就会看到来自于Bing搜索的数据。

3、Google Analytics

接下来，我们给网站增加GA跟踪代码，用于跟踪网站各个渠道的流量数据和用户行为。

打开Google Analytics：

> https://analytics.google.com/

https://analytics.google.com/

通过你的谷歌账号登录，进入Google Analytics页面。

![image](./images/four-free-traffic-tools-install/028.png)

![image](./images/four-free-traffic-tools-install/029.png)

点击左下角的齿轮，打开GA Admin管理页面。然后在左上角的“+ Create”处添加“Property”，如果你是第一次添加，需要先添加一个Account账号（你可以通过不同的Account账号来对多个网站进行分组管理）。

![image](./images/four-free-traffic-tools-install/030.png)

![image](./images/four-free-traffic-tools-install/031.png)

![image](./images/four-free-traffic-tools-install/032.png)

点击“Property”添加1个Property，输出网站相关信息并选择相应的选项。

![image](./images/four-free-traffic-tools-install/033.png)

![image](./images/four-free-traffic-tools-install/034.png)

![image](./images/four-free-traffic-tools-install/035.png)

接下来，添加你的网站信息和Data Stream。在开始收集数据之前，谷歌将会给你提供一段这个网站的GA跟踪代码：

![image](./images/four-free-traffic-tools-install/036.png)

我们需要把这段跟踪代码加到我们的网站中。如果你知道怎样添加，直接复制添加到网站中即可（注意需要添加到网站头部或底部的公共页面板块中）。

![image](./images/four-free-traffic-tools-install/037.png)

如果你不熟悉代码，可以让Claude Code帮你添加。

![image](./images/four-free-traffic-tools-install/038.png)

Claude Code很快修改好了代码。

![image](./images/four-free-traffic-tools-install/039.png)

接着，直接提交到Github中。

![image](./images/four-free-traffic-tools-install/040.png)

然后，通过GitHub Desktop把提交的代码推送到Github。

![image](./images/four-free-traffic-tools-install/041.png)

![image](./images/four-free-traffic-tools-install/042.png)

Git的Push操作会触发Vercel重新部署最新的代码。等待部署完成后，我们需要确认一下GA代码是否安装成功。

![image](./images/four-free-traffic-tools-install/043.png)

刷新网站首页，然后右键点击网站页面，点开“检查”或“查看网页源代码”，搜索是否存在这个网站在GA中对应的跟踪码（比如我们这个网站的“G-JGQEG7MHVS”）即可。

![image](./images/four-free-traffic-tools-install/044.png)

![image](./images/four-free-traffic-tools-install/045.png)

确认之后，回到GA管理页面，点击右上角的测试按钮，确认GA可以识别到添加到我们网站的跟踪代码。

添加成功后，意味着GA可以开始对我们的网站流量和用户进行跟踪了。

4、微软Clarity

接下来，我们添加一个强大的工具：微软的Clarity。这个工具可以通过录像和热力图等方式，直观地捕捉用户在我们网站中的轨迹，这对我们分析和洞察用户的行为有极大的帮助。

打开Clarity：

> https://clarity.microsoft.com/

https://clarity.microsoft.com/

登录后进入Projects管理页面：

https://clarity.microsoft.com/projects

> https://clarity.microsoft.com/projects

https://clarity.microsoft.com/projects

![image](./images/four-free-traffic-tools-install/046.png)

![image](./images/four-free-traffic-tools-install/047.png)

点击左上角“+ New project”按钮添加新的项目，输入网站名称和域名，选择所属行业，点击“Add new project”添加。

![image](./images/four-free-traffic-tools-install/048.png)

![image](./images/four-free-traffic-tools-install/049.png)

接下来和GA类似，我们需要添加Clarity的跟踪代码。点击中间“Install manually”这个进行手动添加，你将会看到一段和GA类似的跟踪代码。

我们需要复制这段跟踪代码，添加到我们的网站中（注意需要添加到网站头部或底部的公共页面板块中）。

![image](./images/four-free-traffic-tools-install/050.png)

如果你不熟悉代码，同样可以让Claude Code帮你添加。

如果你不熟悉代码，同样可以让Claude Code帮你添加。

![image](./images/four-free-traffic-tools-install/051.png)

Claude Code很快添加好了Clarity的跟踪代码。

Claude Code很快添加好了Clarity的跟踪代码。

![image](./images/four-free-traffic-tools-install/052.png)

接着，同样提交到Github中。

接着，同样提交到Github中。

![image](./images/four-free-traffic-tools-install/053.png)

然后，通过GitHub Desktop把提交的代码推送到Github。Git的Push操作同样会触发Vercel重新部署最新的代码。等待部署完成后，我们确认一下Clarity跟踪代码是否安装成功。

![image](./images/four-free-traffic-tools-install/054.png)

![image](./images/four-free-traffic-tools-install/055.png)

![image](./images/four-free-traffic-tools-install/056.png)

回到Clarity的对应网站的页面，很快就看到提示“1 user is online”。实际上这个用户是我本人，点击打开就可以看到对应的录像信息。

GSC、GA、Webmaster和Clarity这4个工具十分强大：既能跟踪网站流量，也能还原用户行为，帮助我们搭建“采集—诊断—优化—验证”的数据闭环，让出海不再盲目。

后续的文章我将具体讲解如何用这4个工具分析网站的流量与用户的行为，并从中找到对出海更具指导意义的行动方向。

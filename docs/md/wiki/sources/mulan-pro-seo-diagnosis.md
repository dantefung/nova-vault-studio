---
title: "哥飞 SEO Agent 对 Mulan.pro 的 SEO 诊断报告：团队完全没有 SEO 意识"
author: "我是哥飞"
date: "2026年8月21日 14:33"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/SadERYNN9BmRHJtgCbW8Ag"
---

# 哥飞 SEO Agent 对 Mulan.pro 的 SEO 诊断报告：团队完全没有 SEO 意识

哥飞 SEO Agent 对 Mulan.pro 的 SEO 诊断报告：团队完全没有 SEO 意识大家好，我是哥飞。哥飞 SEO Agent 还在继续迭代。这次我把 Mulan.pro 交给了 哥飞SEO Agent，让它把技术 SEO、Google 收录、页面标签、网站结构和关键词覆盖完整检查一遍。Mulan 是一个 AI 视频工作流产品。它把视频生成、编辑和批量生产放在同一条工作流里，首页给自己的定位是 Your AI Video Factory。Mulan AI加载完成后的官网首页网站可以正常打开，产品也已经上线。但 Agent 把网站从头到尾查了一遍后，结论很直接：团队完全没有 SEO 意识。这不是少写了几个关键词的问题，而是从页面渲染、语言路由、robots、sitemap、错误状态，到页面标签和站内结构，SEO 需要的基础配置几乎都没有做好。下面是 Agent 当时生成的诊断报告。哥飞SEO Agent生成的Mulan诊断报告第一个问题：所有页面都是纯前端渲染这是 Mulan.pro 最严重的问题。Agent 抓取首页、/en/、/discover、用户页和 flow 页面时，第一次拿到的都是同一个约 2.4KB 的 HTML：&lt;div id="root"&gt;&lt;/div&gt;，再加一个 JavaScript 文件。原始 HTML 里正文是 0 个词，没有 H1，也没有站内链接。首页、英文页和 Discover 页的 Title 都是 MulanAI，Description 都只有一个词 Mulan。Mulan不同页面先返回同一套通用SEO标签Googlebot 第一次抓取页面时，拿不到正文、产品说明、内链和 FAQ，也分不清不同页面分别在讲什么。它还要再运行 JavaScript，才有机会看到页面内容。做 SEO 的网站，不能把所有内容都藏在 JavaScript 后面。标题、正文、H1、内链、产品说明和 FAQ，第一次请求就应该直接放进 HTML。我之前在《如果不想要谷歌给的免费流量，你就用前端渲染吧》里专门讲过这个问题。Mulan 应该先把首页和核心功能页改成 SSR、SSG 或预渲染，再给每张页面配置自己的 Title、Description 和 H1。TDK 和 H1 分别应该怎么写，可以看《从 TDK 到 TDH》。第二个问题：根目录不是一个固定首页直接打开 https://mulan.pro/，网站会根据当前用户的浏览器语言，自动跳到中文页面 /zh 或英文页面 /en。我在当前浏览器里打开根目录，最后进入的是：https://mulan.pro/enMulan根目录按浏览器语言进入中文或英文页面这意味着根目录 / 没有承载一个稳定的默认语言页面，搜索引擎和用户打开同一个地址，看到的目标 URL 还要由浏览器语言和 JavaScript 决定。我之前在《他给博客增加多语言支持后，访问量增加了10倍》里写过，多语言站更适合让根目录直接承载默认语言，再把其他语言放到 /zh、/jp 等子目录。Mulan 现在正好反过来：根目录不承载固定内容，而是先判断浏览器语言再跳转。更合适的做法是选择一个语言作为主语言，如英文，那么网站根目录直接就是英文，此时/en 就不应该成为单独页面，而是需要301到根目录。然后所有其他语言如 /zh 和 /ja 成为可以直接抓取的独立页面，分别配置自己的 canonical，并通过 hreflang 互相声明语言关系。根目录可以作为固定的默认版本，再用 x-default 告诉 Google 这是默认入口。第三个问题：robots.txt和sitemap.xml都被跳回首页Mulan.pro 没有正确提供这两个 SEO 基础文件：• https://mulan.pro/robots.txt• https://mulan.pro/sitemap.xml两个地址都被跳回首页，拿到的是首页 HTML，不是 robots 文本和 sitemap XML。Mulan的robots和sitemap都被跳回首页问题很简单：这两个文件没有放对。robots.txt 是给搜索引擎看的抓取规则，sitemap.xml 是网站主动提供的页面清单。把真正的文件放到对应地址即可。robots.txt 怎么配置，可以看《多语言网站 robots.txt 设置指南》。sitemap 抓取失败，可以看《Google Search Console 提示站点地图 Sitemap 无法抓取怎么办？》。第四个问题：不存在的URL也被跳回首页Agent 访问了一个确定不存在的地址：/this-page-should-not-exist-xyz123这个地址也被跳回首页，状态码还是 200。我又换了一个随机路径，结果完全相同，响应长度和文件哈希也与首页一致。Mulan随机URL也被跳回首页并返回200不存在的页面应该返回 404 或 410。现在所有错误地址都被跳回首页，还告诉搜索引擎“这个页面正常存在”，很容易产生 soft 404。soft 404 可以简单理解为：服务器说页面正常，Google 打开以后却发现它其实不存在。第五个问题：测试环境已经进入GoogleAgent 在 site:mulan.pro 的结果里找到了：• test.mulan.pro• dev-ent.mulan.pro• dev-api.mulan.proGoogle结果中出现Mulan的三个test和dev子域继续打开 test.mulan.pro 的源码，还能看到 PUBLIC_MODE: "TEST"、testgateway.mulan.pro 和测试存储地址。测试环境可以公开访问，还被 Google 收录，用户搜索品牌词时就可能进入非正式页面。如果这些子域只供内部使用，最稳妥的做法是增加登录鉴权。必须公开预览的页面增加 noindex，并分别处理每个子域。第六个问题：没有canonical和hreflangMulan.pro 的原始 HTML 里没有 canonical，也没有 hreflang。canonical 用来告诉 Google 哪个 URL 是标准版本。hreflang 用来说明中文页、英文页和其他语言页之间的对应关系。Mulan 的根目录还会根据浏览器语言跳到 /zh 或 /en，这时更需要把不同语言页面之间的关系写清楚，否则只能让 Google 自己猜。canonical 的具体用法，可以看我之前写的《再聊 Canonical 标签，用好有好处，用错有坏处》。第七个问题：没有H1、内链、OG和结构化数据Agent 继续检查后，又列出了四项：• 原始 HTML 没有 H1-H6；• 没有可抓取的站内链接；• 没有 Open Graph 和 Twitter Card；• 没有 SoftwareApplication、Organization 等 JSON-LD 结构化数据。哥飞SEO Agent列出的页面标签和关键词问题H1 是页面主标题，内链负责把不同页面连接起来。OG 和 Twitter Card 决定链接分享到社交媒体时有没有完整卡片，JSON-LD 帮助搜索引擎理解这是一个什么产品、由谁提供。这些信息都应该和正文一起出现在服务器返回的 HTML 里。内链为什么重要，可以看《再聊内链建设：内链重要性不亚于外链》。结构化数据怎么做，可以看《谷歌下线 FAQPage，新页面还要不要写结构化数据？》。第八个问题：关键词集中在品牌词Agent 调用的 SimilarWeb 快照显示，Mulan.pro 在 2026 年 7 月的估算访问量为 3,203，前两个月分别为 13,460 和 9,524。它读到的主要搜索词是 mulan ai、木兰 AI、木兰 AI 融资 和 mulan pro，基本都是品牌相关词。这说明现在从搜索进入网站的人，大多已经知道 Mulan。还不知道这个品牌、只是在 Google 搜索 AI 视频工具的用户，很难通过非品牌词进入网站。这个其实是SEO没做好带来的后果，没做好SEO所以没有拿到别的关键词的搜索排名，目前只有自己的品牌词在排名里，所以只拿到了品牌词搜索流量。Mulan 已经有视频生成、编辑、批量生产和工作流能力，可以把这些能力拆成独立功能页，再覆盖 text to video、ai video editor、教程、FAQ 和具体使用场景。关键词不是越大越好，应该先判断搜索需求，再决定首页、功能页和教程页分别承接什么词。具体方法可以看《用一个真实例子教你如何判断一个关键词是否值得做网站》。如果这是我的网站，我会按这个顺序改第一步，先解决纯前端渲染和语言路由。把首页和核心功能页改成 SSR、SSG 或预渲染，让正文、独立 TDK、H1 和内链第一次请求就进入 HTML。同时稳定根目录，让 /zh 和 /en 成为明确、可直接抓取的语言页面。第二步，补齐基础文件和错误状态。提供真正的 robots.txt 和 sitemap.xml，不存在的 URL 返回 404 或 410，不要再把所有路径都跳回首页。第三步，隔离测试环境。给内部使用的 test/dev 子域增加鉴权；必须公开预览的页面增加 noindex。第四步，完善页面信号和关键词入口。补 canonical、hreflang、OG、结构化数据和可抓取内链，再把现有产品能力拆成功能页、教程页和 FAQ。我之前在《分享一个给已经上线网站做 SEO 改造建议的思路》里讲过，网站已经上线以后，不要急着堆新页面。先把现有页面和基础配置理顺，再决定增加什么内容。最后总结一下Mulan.pro 的问题不是某一个 Title 没写好，而是团队从一开始就没有把 SEO 放进网站建设流程。纯前端渲染让 Googlebot 第一次抓取拿不到正文；根目录依赖浏览器语言跳转；robots、sitemap 和错误 URL 都被跳回首页；测试环境进入 Google；页面又缺少 canonical、hreflang、H1、内链和结构化数据。这些问题不难修，但要先把顺序排对：先让 Google 能直接拿到正确页面，再处理抓取、收录和页面信号，最后才是关键词和内容建设。哥飞 SEO Agent 在线体验：https://seo.web.cafe/chat/如果想分析自己的网站，可以从 Agent 顶栏加入 GSC 数据，继续核对真实曝光、点击、查询词和落地页。网站 GSC 数据入口：https://seo.web.cafe/mysite/



大家好，我是哥飞。



哥飞 SEO Agent 还在继续迭代。



这次我把 Mulan.pro 交给了 哥飞SEO Agent，让它把技术 SEO、Google 收录、页面标签、网站结构和关键词覆盖完整检查一遍。



Mulan 是一个 AI 视频工作流产品。它把视频生成、编辑和批量生产放在同一条工作流里，首页给自己的定位是 Your AI Video Factory。



网站可以正常打开，产品也已经上线。但 Agent 把网站从头到尾查了一遍后，结论很直接：



团队完全没有 SEO 意识。



这不是少写了几个关键词的问题，而是从页面渲染、语言路由、robots、sitemap、错误状态，到页面标签和站内结构，SEO 需要的基础配置几乎都没有做好。



下面是 Agent 当时生成的诊断报告。



## 第一个问题：所有页面都是纯前端渲染



这是 Mulan.pro 最严重的问题。



Agent 抓取首页、/en/、/discover、用户页和 flow 页面时，第一次拿到的都是同一个约 2.4KB 的 HTML：



&lt;div id="root"&gt;&lt;/div&gt;，再加一个 JavaScript 文件。



原始 HTML 里正文是 0 个词，没有 H1，也没有站内链接。首页、英文页和 Discover 页的 Title 都是 MulanAI，Description 都只有一个词 Mulan。



Googlebot 第一次抓取页面时，拿不到正文、产品说明、内链和 FAQ，也分不清不同页面分别在讲什么。它还要再运行 JavaScript，才有机会看到页面内容。



做 SEO 的网站，不能把所有内容都藏在 JavaScript 后面。标题、正文、H1、内链、产品说明和 FAQ，第一次请求就应该直接放进 HTML。



我之前在《如果不想要谷歌给的免费流量，你就用前端渲染吧》里专门讲过这个问题。



Mulan 应该先把首页和核心功能页改成 SSR、SSG 或预渲染，再给每张页面配置自己的 Title、Description 和 H1。TDK 和 H1 分别应该怎么写，可以看《从 TDK 到 TDH》。



## 第二个问题：根目录不是一个固定首页



直接打开 https://mulan.pro/，网站会根据当前用户的浏览器语言，自动跳到中文页面 /zh 或英文页面 /en。



我在当前浏览器里打开根目录，最后进入的是：



https://mulan.pro/en



这意味着根目录 / 没有承载一个稳定的默认语言页面，搜索引擎和用户打开同一个地址，看到的目标 URL 还要由浏览器语言和 JavaScript 决定。



我之前在《他给博客增加多语言支持后，访问量增加了10倍》里写过，多语言站更适合让根目录直接承载默认语言，再把其他语言放到 /zh、/jp 等子目录。Mulan 现在正好反过来：根目录不承载固定内容，而是先判断浏览器语言再跳转。



更合适的做法是选择一个语言作为主语言，如英文，那么网站根目录直接就是英文，此时/en 就不应该成为单独页面，而是需要301到根目录。然后所有其他语言如 /zh 和 /ja 成为可以直接抓取的独立页面，分别配置自己的 canonical，并通过 hreflang 互相声明语言关系。根目录可以作为固定的默认版本，再用 x-default 告诉 Google 这是默认入口。



## 第三个问题：robots.txt和sitemap.xml都被跳回首页



Mulan.pro 没有正确提供这两个 SEO 基础文件：



• https://mulan.pro/robots.txt



• https://mulan.pro/sitemap.xml



两个地址都被跳回首页，拿到的是首页 HTML，不是 robots 文本和 sitemap XML。



问题很简单：这两个文件没有放对。



robots.txt 是给搜索引擎看的抓取规则，sitemap.xml 是网站主动提供的页面清单。把真正的文件放到对应地址即可。



robots.txt 怎么配置，可以看《多语言网站 robots.txt 设置指南》。sitemap 抓取失败，可以看《Google Search Console 提示站点地图 Sitemap 无法抓取怎么办？》。



## 第四个问题：不存在的URL也被跳回首页



Agent 访问了一个确定不存在的地址：



/this-page-should-not-exist-xyz123



这个地址也被跳回首页，状态码还是 200。我又换了一个随机路径，结果完全相同，响应长度和文件哈希也与首页一致。



不存在的页面应该返回 404 或 410。现在所有错误地址都被跳回首页，还告诉搜索引擎“这个页面正常存在”，很容易产生 soft 404。



soft 404 可以简单理解为：服务器说页面正常，Google 打开以后却发现它其实不存在。



## 第五个问题：测试环境已经进入Google



Agent 在 site:mulan.pro 的结果里找到了：



• test.mulan.pro



• dev-ent.mulan.pro



• dev-api.mulan.pro



继续打开 test.mulan.pro 的源码，还能看到 PUBLIC_MODE: "TEST"、testgateway.mulan.pro 和测试存储地址。



测试环境可以公开访问，还被 Google 收录，用户搜索品牌词时就可能进入非正式页面。



如果这些子域只供内部使用，最稳妥的做法是增加登录鉴权。必须公开预览的页面增加 noindex，并分别处理每个子域。



## 第六个问题：没有canonical和hreflang



Mulan.pro 的原始 HTML 里没有 canonical，也没有 hreflang。



canonical 用来告诉 Google 哪个 URL 是标准版本。hreflang 用来说明中文页、英文页和其他语言页之间的对应关系。



Mulan 的根目录还会根据浏览器语言跳到 /zh 或 /en，这时更需要把不同语言页面之间的关系写清楚，否则只能让 Google 自己猜。



canonical 的具体用法，可以看我之前写的《再聊 Canonical 标签，用好有好处，用错有坏处》。



## 第七个问题：没有H1、内链、OG和结构化数据



Agent 继续检查后，又列出了四项：



• 原始 HTML 没有 H1-H6；



• 没有可抓取的站内链接；



• 没有 Open Graph 和 Twitter Card；



• 没有 SoftwareApplication、Organization 等 JSON-LD 结构化数据。



H1 是页面主标题，内链负责把不同页面连接起来。OG 和 Twitter Card 决定链接分享到社交媒体时有没有完整卡片，JSON-LD 帮助搜索引擎理解这是一个什么产品、由谁提供。



这些信息都应该和正文一起出现在服务器返回的 HTML 里。



内链为什么重要，可以看《再聊内链建设：内链重要性不亚于外链》。结构化数据怎么做，可以看《谷歌下线 FAQPage，新页面还要不要写结构化数据？》。



## 第八个问题：关键词集中在品牌词



Agent 调用的 SimilarWeb 快照显示，Mulan.pro 在 2026 年 7 月的估算访问量为 3,203，前两个月分别为 13,460 和 9,524。



它读到的主要搜索词是 mulan ai、木兰 AI、木兰 AI 融资 和 mulan pro，基本都是品牌相关词。



这说明现在从搜索进入网站的人，大多已经知道 Mulan。还不知道这个品牌、只是在 Google 搜索 AI 视频工具的用户，很难通过非品牌词进入网站。



这个其实是SEO没做好带来的后果，没做好SEO所以没有拿到别的关键词的搜索排名，目前只有自己的品牌词在排名里，所以只拿到了品牌词搜索流量。



Mulan 已经有视频生成、编辑、批量生产和工作流能力，可以把这些能力拆成独立功能页，再覆盖 text to video、ai video editor、教程、FAQ 和具体使用场景。



关键词不是越大越好，应该先判断搜索需求，再决定首页、功能页和教程页分别承接什么词。具体方法可以看《用一个真实例子教你如何判断一个关键词是否值得做网站》。



## 如果这是我的网站，我会按这个顺序改



第一步，先解决纯前端渲染和语言路由。



把首页和核心功能页改成 SSR、SSG 或预渲染，让正文、独立 TDK、H1 和内链第一次请求就进入 HTML。同时稳定根目录，让 /zh 和 /en 成为明确、可直接抓取的语言页面。



第二步，补齐基础文件和错误状态。



提供真正的 robots.txt 和 sitemap.xml，不存在的 URL 返回 404 或 410，不要再把所有路径都跳回首页。



第三步，隔离测试环境。



给内部使用的 test/dev 子域增加鉴权；必须公开预览的页面增加 noindex。



第四步，完善页面信号和关键词入口。



补 canonical、hreflang、OG、结构化数据和可抓取内链，再把现有产品能力拆成功能页、教程页和 FAQ。



我之前在《分享一个给已经上线网站做 SEO 改造建议的思路》里讲过，网站已经上线以后，不要急着堆新页面。先把现有页面和基础配置理顺，再决定增加什么内容。



## 最后总结一下



Mulan.pro 的问题不是某一个 Title 没写好，而是团队从一开始就没有把 SEO 放进网站建设流程。



纯前端渲染让 Googlebot 第一次抓取拿不到正文；根目录依赖浏览器语言跳转；robots、sitemap 和错误 URL 都被跳回首页；测试环境进入 Google；页面又缺少 canonical、hreflang、H1、内链和结构化数据。



这些问题不难修，但要先把顺序排对：先让 Google 能直接拿到正确页面，再处理抓取、收录和页面信号，最后才是关键词和内容建设。



哥飞 SEO Agent 在线体验：



https://seo.web.cafe/chat/



如果想分析自己的网站，可以从 Agent 顶栏加入 GSC 数据，继续核对真实曝光、点击、查询词和落地页。



网站 GSC 数据入口：



https://seo.web.cafe/mysite/




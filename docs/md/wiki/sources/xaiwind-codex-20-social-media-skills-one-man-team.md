---
title: "想风（@xaiwind）：Codex 自媒体运营 Skill 大全｜20 个装完，一个人顶一个团队"
date: "2026-11-04"
source: "X/Twitter"
author: "想风 (@xaiwind)"
url: "https://x.com/xaiwind/status/2108205644033806837"
coverImage: "../images/xaiwind-codex-20-social-media-skills-one-man-team/001.jpg"
---

# 想风（@xaiwind）：Codex 自媒体运营 Skill 大全｜20 个装完，一个人顶一个团队

> 自媒体创作者必备的 20 个 Codex 自动化 Skill 终极合集：覆盖全流程 5 大核心环节——选题雷达与爆款反推、多平台长文/小红书/推特文案撰写、AI 配图与 21:9 封面生成、一键同步排版至微信草稿箱、以及全网数据监控与复盘反馈；让超级个体依托命令行 Agent 实现全流水线自治。

<!-- more -->

自媒体这条产线上的活，现在大半能交给 Skill 干。选题、排版、剪片、发稿，每一环都有人做好了现成的。

Codex、Claude Code、Openclaw 这类终端 Agent，今年冒出一大堆 Skill。它的原理很朴素：把一套固定流程写成文件装进去，Agent 就照着你的规矩干活。

下面按环节排，每条给仓库地址和一句话说明它管什么。星标数取自 GitHub，2026-10-08 查的，只做参考——星多不等于合你，合手的才是好的。也有几个是我自己一直在用的，星标很低，但我比较熟感觉好用也收了进来。

每条的末尾都有一段现成的话。复制粘贴到智能体，它就帮你把 Skill 装好。

## 目录

- 一、选题大脑
- 二、文章排版 · 配图
- 三、视频 Skill
- 四、小红书运营
- 五、公众号运营
- 六、抖音运营
- 七、B 站 · 油管运营
- 八、推特运营
- 九、可选视频 Skill
- 速查表
- 最后

## 一、选题大脑

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/002.webp)

① 全局军师 · [self-media-content-workflow](https://github.com/yanhua1010/self-media-content-workflow) ⭐521

统筹账号定位、选题立项、内容生产到数据复盘，整条产线的总指挥官。

一套模块化的自媒体内容生产套件，从模糊需求一路铺到交付归档：创作简报、账号策略、热点与竞品研究、平台原生文案、短视频方案、数字人制片、多平台发布、数据复盘。

三个特点值得说。不绑定具体模型和浏览器，运行时自己发现环境里有什么能力；方向、平台、标题、终稿、发布授权五个点强制停下来等你确认，默认只出草稿，从不自动群发；关键数字必须有出处，不编数据和收益。想装一个总控，先装它。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/yanhua1010/self-media-content-workflow
```

② 热点雷达 · [creator-buddy](https://github.com/SpaceZephyr/creator-buddy) ⭐1.6k

全天候扫描各大平台蹿升爆款与评论区真实痛点，拒绝自嗨。

口号是「从一个选题，到一篇能发的成品」。跨平台找内容、分析创作者、抓爆款趋势，把「今天写什么」从拍脑袋变成有据可查。Claude Code、Codex、Cursor、Openclaw、Hermes 都能跑。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/SpaceZephyr/creator-buddy
```

③ 对标粉碎机 · [blogger-distiller](https://github.com/otter1101/blogger-distiller) ⭐694

逐帧拆解同行头部大博主的选题套路、内容骨架与搞钱打法。

输入一个博主账号，它把对方从真实笔记里蒸出来的打法装进你的 AI，变成随时能问的内容教练。它也能蒸你自己——把你发过的三十条笔记摊开，你会发现自己一直在重复什么、缺什么。想换对标博主，不用从头再来。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/otter1101/blogger-distiller
```

## 二、文章排版 · 配图

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/003.webp)

④ 排版印钞机 · [baoyu-skills](https://github.com/JimLiu/baoyu-skills) ⭐26.4k

宝玉老师官方同款！全自动生成精美配图、SVG 封面，一键多平台排版分发。

宝玉分享的 Skill 合集，二十多个。做自媒体常用的就那几个：baoyu-cover-image 出封面图，baoyu-article-illustrator 给正文配图，baoyu-post-to-wechat 发公众号。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/JimLiu/baoyu-skills
```

官方 CLI：npx skills add jimliu/baoyu-skills

一个坑：别全装。作者自己写在 README 里——二十多个 skill 全装进去，Agent 每次运行都要多背一坨 context，越装越慢。装完只留你要的那几个。

⑤ 卡片神器 · [guizang-social-card-skill](https://github.com/op7418/guizang-social-card-skill) ⭐7.4k

归藏出品！一键把长文变成高审美的小红书爆款组图与公众号封面。

从文章、文案、截图、字幕甚至照片出发，生成小红书图文组图、Live Photo 动态卡，也能出公众号要的 21:9 加 1:1 封面对。内置两套视觉系统：电子杂志风适合叙事、旅行、阅读，瑞士国际主义适合产品测评、数据、教程。28 套布局、10 个主题，单文件 HTML 转 PNG。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/op7418/guizang-social-card-skill
```

官方 CLI：npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill

⑥ 文章配图与封面 · [Punk-Skill](https://github.com/adrianpunk/Punk-Skill) ⭐1.2k

AdrianPunk 的视觉生成 Skill 组。

拿文章生成封面图，也能把人物、宠物、物品的照片生成头像图。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/adrianpunk/Punk-Skill
```

先看许可再动手：v2.0.0 起源码公开，个人非商用免费。企业、机构、工作室、客户项目，以及用于收费服务、营销、广告、品牌传播、产品集成、商业工作流，都要事先拿到书面商业授权并付费。自己写着玩可以，接单商用不行。

⑦ 正文插画 · [ian-xiaohei-illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) ⭐12.4k

把中文文章里的判断、流程、状态和隐喻，变成一张张白底、手绘、怪诞但清爽的正文配图。

小黑那套画风：16:9 横版、纯白手绘、少量红橙蓝中文批注。它先读懂文章里的认知锚点，再把其中一个判断或流程画成图，不是往角落里贴个吉祥物。适合知识型内容、方法论、AI 工作流。想要商业插画或精致扁平风的，这个不对路。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/helloianneo/ian-xiaohei-illustrations
```

⑧ 写了就发 · [write-then-publish](https://github.com/fxyadela/write-then-publish) ⭐561

写完，不必再到处排版。

一份正文，同时出小红书图文卡片和公众号长文。切换模式只改输出形式，不重写正文。图片即传即排，能裁剪、能调大小对齐。跟 Obsidian 双向同步，有目录权限就写回 Markdown 和附件，没有就降级成 ZIP 让你自己解。它不替你写内容，只治「写完之后」那最后一公里。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/fxyadela/write-then-publish
```

## 三、视频 Skill

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/004.webp)

⑨ 长视频解剖刀 · [video-to-subtitle-summary-skill](https://github.com/imlewc/video-to-subtitle-summary-skill) ⭐213

秒提 YouTube/B 站/播客字幕与重点，长视频转图文的核心提取器。

抖音、小红书、B 站、YouTube 的链接，或者本地音视频文件，进去出字幕加 AI 摘要。默认用本地 faster-whisper 转写，不花钱也不上传。YouTube 走 yt-dlp，直接抓人工字幕或自动字幕，连 ASR 都不用跑。想让云端转写可以切火山引擎，那就得自己配 token。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/imlewc/video-to-subtitle-summary-skill
```

⑩ AI 视频分镜师 · [seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) ⭐2.9k

输入一句话，全自动输出带运镜的视频脚本、详细分镜表与提示词。

把想法转成能直接粘进即梦 Seedance 2.0 的结构化中文提示词。十项能力里，一致性控制（用参考图锁人物和产品）、运镜复刻（照着参考视频搬镜头和节奏）、特效模板复刻，是它比手搓 prompt 强的地方。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/songguoxs/seedance-prompt-skill
```

一个对不上的地方：原稿里写的是 seedance-skills，我核到的这个仓库叫 seedance-prompt-skill。名字不一样，装之前对一下是不是同一个。

⑪ 口播动效工作室 · [video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft) ⭐1.4k

口播视频的 agent skill：字级配音同步 · 108 张动效配方卡 · 七层反 PPT 镜头系统 · 三重验收。

给它一份口播稿和一条成品配音，它在本机对齐到字级时间戳，把每个语义拍写进 SHOTBOOK 分镜，再用 Remotion 渲出成片——动态字卡、证据截图、运镜、素排字幕、影视级音效，全部锁在人声上。同系列的 video-shotcraft 讲的是别的片型，这条专治口播。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/Vincentwei1021/video-talkcraft
```

许可：PolyForm 非商用。另一个坑：一份 node_modules 差不多 760 MB，含 190 MB 的无头浏览器。作者原来每支片各装一份，六个工程吃掉 3.9 GB，现在改成软链共享——接旧工程前先跑它的 link-runtime.sh。

⑫ 多平台视频分发 · [video-publisher-skill](https://github.com/oil-oil/video-publisher-skill) ⭐229

小红书 · 抖音 · Bilibili · 微信视频号 · YouTube，并行上传，完成即验收。

把视频、标题、封面准备成核验过的多平台草稿，中断了能恢复上传。默认停在最终发布按钮之前——只有你明确说「发到哪个平台」，它才重新核对草稿动手。准备草稿、上传、长期账号配置，都不算授权。同类里，对「别自己乱发」这件事它最较真。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/oil-oil/video-publisher-skill
```

## 四、小红书运营

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/005.webp)

⑬ 小红书爆款监控 · [content-boom-monitor](https://github.com/xintu1314/content-boom-monitor) ⭐106

把「搜索关键词找爆款」和「盯对标账号异常作品」变成稳定的数据流程。

同时监控小红书和抖音的关键词，也盯指定对标账号的近期作品。跨来源去重、算平台差异化的互动值、用账号自己的历史中位数算相对表现 R，再标成 T1 潜力 / T2 爆款 / T3 现象级。结果沉淀到飞书多维表格，人只处理值得看的那几条。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/xintu1314/content-boom-monitor
```

前提：走 Just One API 采集公开数据，得先注册拿 key，不是装完就能跑。

⑭ 小红书操盘手 · [xiaohongshu-ops-skill](https://github.com/Xiangyu-CAS/xiaohongshu-ops-skill) ⭐2.4k

从小红书爆款文案生成、SEO 关键词埋点，到发布互动与账号诊断全包揽。

配 Openclaw 用，能独立运营一个小红书号：推荐流分析、账号诊断、选题灵感、爆款复刻、自动发布、评论回复。基于浏览器自动化 CDP，第一次扫码登录，之后不用反复验证。爆款复刻是输入一条爆款笔记链接，分析它为什么爆，再生成一条同类图文。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/Xiangyu-CAS/xiaohongshu-ops-skill
```

## 五、公众号运营

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/006.webp)

⑮ 全流程 · [wewrite](https://github.com/imraywang/wewrite) ⭐3.4k

从热点抓取到微信草稿箱，一句话跑完整条内容管道。

一句「写一篇公众号文章」，它抓热点、评选题、搜真实素材、按你的人格风格出稿，再做一轮编辑审稿。正文出来后可以随时追加：配封面和配图、18 个主题的排版预览、推草稿箱、改写成别的平台版本。原始正文一直留着，配图生成独立副本。你手动改完再让它「学习我的修改」，下一篇更像你。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/imraywang/wewrite
```

⑯ 文章分发 · [Wechatsync](https://github.com/wechatsync/Wechatsync) ⭐6.4k

一键把公众号文章同步到知乎、头条、掘金、小红书、CSDN 等 29+ 平台。

Chrome 扩展，不是爬虫，不模拟登录，也没有中间服务器。它用你自己浏览器里的登录态，调平台官方那套 Web API，跟你手动在网页上发是一回事，数据不离开你的设备。默认同步成草稿，发布前你确认。

扩展是给浏览器用的。想让 Agent 直接调它，官方给了 Skill 和 MCP 两条路，更推荐 Skill——装完在 Claude Code 里说一句「把这篇文章同步到掘金和知乎」，它就去发了。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/wechatsync/Wechatsync
```

官方 CLI（Claude Code）：

```bash
/plugin marketplace add wechatsync
/plugin install wechatsync
```

前提：Skill 只是入口，扩展还得先装——命令行是通过本机 localhost 跟扩展通信的。另外要在扩展设置里生成一个 token，填进环境变量。三条都齐了才跑得通。

## 六、抖音运营

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/007.webp)

⑰ 剪映自动化 · [jianying-headless](https://github.com/mcncarl/jianying-headless) ⭐3.0k

面向剪映专业版 macOS 的本地自动化。

写一份结构化的剪辑计划，它就生成可编辑的剪映草稿，在独立副本里改多轨工程，再调本机剪映引擎导出 MP4。适合批量出草稿、Agent 辅助剪辑、工程交接。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/mcncarl/jianying-headless
```

两个前提：只在 macOS 上跑。主要适配剪映 11.5.0，兼容 11.4.2，不是剪映官方 SDK，版本对不上会出问题。

⑱ 逸尘的剪映剪辑 · [yichen-skills](https://github.com/mcncarl/yichen-skills/tree/main/yichen-jianying-edit) ⭐4.3k

一个给创作者的 Skill 集：写作、X 内容切片、X Articles 草稿发布、微信素材抓取。

里面的 yichen-jianying-edit 就是剪映剪辑那条链路。全套里写作和 X 相关的那几个，下面「推特运营」还会再用到。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/mcncarl/yichen-skills
```

许可提醒：仅个人学习与非商用。客户项目、付费产品、公司内部部署、上架打包、课程捆绑，都要作者事先书面授权。

原推文：<https://x.com/bbkirstry/status/2104030018544566539>

## 七、B 站 · 油管运营

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/008.webp)

B 站和油管都是长视频平台，专门做 Skill 的还不多，能用的基本是通用视频工具加平台发布。两个平台放一起说。

字幕与选题 · [video-to-subtitle-summary-skill](https://github.com/imlewc/video-to-subtitle-summary-skill) ⭐213

见「视频 Skill」第九条。B 站视频抓字幕、出摘要，是搬运和找选题的第一道工序。YouTube 链接直接走 yt-dlp，人工字幕优先，没有就抓自动字幕，不下载视频、不跑 ASR，最省事的一条路。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/imlewc/video-to-subtitle-summary-skill
```

上传分发 · [video-publisher-skill](https://github.com/oil-oil/video-publisher-skill) ⭐229

见「视频 Skill」第十二条。两个平台都在它的已验证平台列表里。B 站跟小红书、抖音一样，走通用流程。YouTube 是唯一做过完整单平台验收的——元数据、16:9 缩略图、私密可见性、发布后无操作复查都验过，海外发布优先用它。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/oil-oil/video-publisher-skill
```

全链路托管 · [self-media-content-workflow](https://github.com/yanhua1010/self-media-content-workflow) ⭐521

见「选题大脑」第一条。多平台视频发布覆盖抖音、视频号、小红书，也能挂 B 站。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/yanhua1010/self-media-content-workflow
```

出海内容线 · [yichen-skills](https://github.com/mcncarl/yichen-skills) ⭐4.3k

作者本人就是做出海的，YouTube 是他自己发布的主力渠道。这个 skill 集里的写作和切片链路，直接能接到油管内容上。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/mcncarl/yichen-skills
```

## 八、推特运营

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/009.webp)

⑲ 发 X Articles · [x-article-publisher](https://github.com/xaiwind/x-article-publisher) ⭐5

超好用的 X 推特长文发布 skill，完美支持 markdown 格式文件推送，支持表格、代码块、图片！

把 Markdown 灌成 X Articles 草稿，全自动无头导入。Playwright 加系统 Chrome，不要任何 API key。只灌草稿，永不自动发布——最后那下 Publish 由你手动点。

这是我自己维护的项目，源头技术来自 xPoster，经 punk2898 的 v4.1.0 一路 fork 下来，改动记在 NOTICE 和 LOCAL_CHANGES 里。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/xaiwind/x-article-publisher
```

官方 CLI（Claude Code）：

```bash
git clone https://github.com/xaiwind/x-article-publisher.git ~/.claude/skills/x-article-publisher
cd ~/.claude/skills/x-article-publisher && npm install
```

Codex / DeepSeek Harness 把路径换成 ~/.agents/skills/ 就行。首次运行别带 `--headless`，浏览器会打开让你登录 X，登录态之后一直留着。装完说一句「帮我把文章发布到推特」就调起来了。

想要更成熟的通用方案，可以再看 [wshuyi/x-article-publisher-skill](https://github.com/wshuyi/x-article-publisher-skill) ⭐869，那边 v1.2.0 支持分割线、表格转图、Mermaid。

⑳ X 切片与草稿 · [yichen-skills](https://github.com/mcncarl/yichen-skills) ⭐4.3k

见「抖音运营」第二条。长内容切成多条 X 帖子、X Articles 草稿发布，都在这个集子里。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/mcncarl/yichen-skills
```

## 九、可选视频 Skill

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/010.webp)

上面每条都对着一个具体环节。这一节不一样，是几条通用的视频生产工具，跟平台无关，按需取用。

HyperFrames · [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) ⭐58.9k

写 HTML，渲视频。

开源的视频渲染框架，把 HTML、CSS、媒体文件和可寻址动画渲成确定性的 MP4 文件。本地有 CLI，也能当 Skill 装给 Agent 用。仓库里带了 21 个 Skill 按需加载，/hyperframes 是入口路由——你说一句「做一条 10 秒的产品介绍」，它自己去挑工作流。Apache 2.0 许可。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/heygen-com/hyperframes
```

官方 CLI（Claude Code）：

```bash
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```

一个坑：21 个别一次全装。作者说核心那组就够，其余工作流由路由按需拉取。跑 npx hyperframes skills update 装核心集，比加 --all 干净。

Remotion 本体 · [remotion-dev/remotion](https://github.com/remotion-dev/remotion) ⭐62.5k

下面那条是规矩，这条是本体。

Remotion 是拿 React 写视频的框架。上面那条 Skill 只管规矩，本体不装，规矩落不了地。

装法跟别条不一样——它不是装在项目外的 Skill，是装进你项目里的包：

```bash
npx create-video@latest
```

已有项目跑：

```bash
npm i remotion @remotion/cli
```

许可是自定义的，不是标准开源协议。个人、非营利组织，还有 3 人以内的营利公司，都免费用，商用也行。更大的公司要买授权。

官方仓库自己还带 60 个 Skill，但那是给维护 Remotion 用的——加特效、发版、修 bug、换官网演示视频。如果做视频用不上，可以不用安装。

Remotion 视频 · [remotion-video-creation](https://github.com/affaan-m/everything-claude-code/tree/main/skills/remotion-video-creation) ⭐275k（合集整体）

用 React 写视频，把该守的规矩收成 29 条。

Remotion 是拿 React 写视频的框架。这条 Skill 把它的最佳实践收成 29 条规则，盖住 3D、动画、音频、字幕、图表、转场。装完你说「用 Remotion 做个动画」，Agent 不至于瞎写。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/affaan-m/everything-claude-code
```

注意：它在 affaan-m/everything-claude-code 这个合集里，一共 292 个 Skill，275k 星。上面那句话会把 292 个全装上。只想用这一条，跟 Agent 说清楚只装 skills/remotion-video-creation/ 一个目录。

Manim 动画 · [manim-video](https://github.com/affaan-m/everything-claude-code/tree/main/skills/manim-video) ⭐275k（合集整体）

讲原理的那类动画，用代码画出来。

Manim 是 3Blue1Brown 那套动画引擎。这条 Skill 让它替你写 Manim 场景：技术概念、函数曲线、系统结构图、产品走查。适合讲原理的片子，不适合口播和 Vlog。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个仓库的全部skill：https://github.com/affaan-m/everything-claude-code
```

跟㉒同一个仓库，安装的注意事项也一样，只想要它就别全装。

video-use · [browser-use/video-use](https://github.com/browser-use/video-use) ⭐28.4k

素材丢进文件夹，跟 Agent 聊着剪。

MIT 许可。做的事很实在：删掉口癖词（umm、uh、假起头）和废片之间的空档，自动调色，每个剪切点垫 30 毫秒的音频淡入淡出（避免爆音），按你的风格烧字幕，默认两词一组大写。动画叠加层交给 HyperFrames、Remotion、Manim 或 PIL 生成，并行开子 Agent，一个管一个动画。渲染完每个剪切点先自查，通过了才给你看。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/browser-use/video-use
```

剪映编辑器 · [jianying-editor-skill](https://github.com/luoluoluo22/jianying-editor-skill) ⭐3.8k

让 Agent 直接改剪映草稿，写文案、配音、字幕、特效到导出一条龙。

MIT 许可。针对国内版剪映专业版，草稿生成 Windows 和 macOS 都支持。自动导出只有 Windows 稳，靠 Windows UI Automation，剪映 5.9 或更低版本最靠谱。macOS 只能生成草稿，最后得在剪映里手动导出。CapCut 国际版和手机端都不支持。

复制粘贴到智能体，安装 Skill：

```bash
帮我安装这个skill：https://github.com/luoluoluo22/jianying-editor-skill
```

跟⑰那条的区别：⑰ 是 macOS 原生，调本机剪映引擎导出成片。这条反过来，Windows 强、macOS 只出草稿。都是 Mac 的话，要哪一段先想清楚。

## 速查表

| 环节 | Skill | 星标 | 一句话 |
| :--- | :--- | :--- | :--- |
| 总控 | self-media-content-workflow | 521 | 从简报铺到交付归档 |
| 选题 | creator-buddy | 1.6k | 跨平台找爆款和痛点 |
| 对标 | blogger-distiller | 694 | 蒸博主的爆款打法 |
| 排版配图 | baoyu-skills | 26.4k | 封面、插画、发公众号 |
| 卡片 | guizang-social-card-skill | 7.4k | 小红书组图与公众号封面对 |
| 视觉 | Punk-Skill | 1.2k | 封面图与头像图（商用要授权） |
| 插画 | ian-xiaohei-illustrations | 12.4k | 小黑风正文配图 |
| 排版 | write-then-publish | 561 | 一份正文出卡片和长文 |
| 字幕摘要 | video-to-subtitle-summary-skill | 213 | 长视频转字幕加摘要 |
| 分镜 | seedance-prompt-skill | 2.9k | 出 Seedance 2.0 提示词 |
| 口播 | video-talkcraft | 1.4k | 字级配音同步的解说成片（非商用） |
| 视频分发 | video-publisher-skill | 229 | 五平台草稿，默认不发布 |
| 小红书 | content-boom-monitor | 106 | 关键词与对标账号监控 |
| 小红书 | xiaohongshu-ops-skill | 2.4k | 全链路运营与复刻 |
| 公众号 | wewrite | 3.4k | 一句话跑完整条管道 |
| 公众号 | Wechatsync | 6.4k | 一键同步 29+ 平台 |
| 抖音 | jianying-headless | 3.0k | 剪映草稿自动化（仅 macOS） |
| 抖音 | yichen-skills | 4.3k | 写作、切片、剪映（非商用） |
| 推特 | x-article-publisher | 5 | Markdown 灌成 X Articles 草稿，不自动发 |
| 可选 | hyperframes | 58.9k | 写 HTML 渲成视频 |
| 可选 | remotion | 62.5k | React 写视频的框架本体|
| 可选 | remotion-video-creation | 275k | React 写视频，29 条规矩 |
| 可选 | manim-video | 275k | 代码画原理动画 |
| 可选 | video-use | 28.4k | 聊着剪片，自动去口癖调色 |
| 可选 | jianying-editor-skill | 3.8k | 剪映草稿自动化（导出限 Windows） |

## 最后

工具是固定的，节奏是灵活的。同一个选题，发小红书还是发公众号，结果可能会有差异——Skill 帮你省的是手，省不掉你判断发哪儿、什么时候发。

参考借鉴：<https://x.com/CrazyKaomei/status/2101208117304262843>

我是想风@xaiwind，一个关注出海与 AI、AIGC 的创作者。 #自媒体 #skill

本文基于 AI 辅助与个人实践融合创作，如果文章对你有帮助，欢迎点赞、收藏、关注，

本人文章持续维护，欢迎联系或者评论区见，每天进步一点，我们终会到达目的地！

![](../images/xaiwind-codex-20-social-media-skills-one-man-team/011.webp)

## 相关页面

- [[sources/wangdachui-codex-content-production-solo-primer]]
- [[sources/xaiwind-github-complete-beginner-to-master-guide]]
- [[concepts/agent-skill]]
- [[concepts/selfmedia-compound-model]]

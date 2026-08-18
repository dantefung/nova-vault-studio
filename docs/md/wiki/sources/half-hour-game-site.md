---
title: "如何半小时上线一个小游戏网站"
date: "2024-11-12"
source: "我是哥飞"
url: "https://mp.weixin.qq.com/s/16C7-uoIj4T3J6jbrMZvgg"
---

# 如何半小时上线一个小游戏网站

> 以 MemoryTest.io 为例，演示从选域名到 Vercel 部署的完整流程

大家好，我是哥飞。

今天以上线一个记忆力小游戏为例，演示如何快速上线一个新网站。需求关键词是 **Memory Test**，也就是记忆力训练小游戏。

查了一下域名，发现 MemoryTest.io 这个域名还能注册，于是决定用这个后缀——很多游戏站都用的 .io 域名。

![域名搜索结果](images/half-hour-game-site/001.png)

11:38 分，哥飞把域名注册好了。

![域名注册确认](images/half-hour-game-site/002.png)

---

## 第一步：配置 Cloudflare DNS

先把域名的 DNS 服务改成 Cloudflare 的。输入域名，选择手动输入，点击继续前往激活。

![Cloudflare 添加站点](images/half-hour-game-site/003.png)
![Cloudflare DNS 记录](images/half-hour-game-site/004.png)

复制 Cloudflare 提供的名称服务器地址（有两个），回到域名注册商处，修改 DNS 服务器地址，填上 CF 的两个地址，保存。

![注册商修改 DNS](images/half-hour-game-site/005.png)
![DNS 已修改](images/half-hour-game-site/006.png)
![Cloudflare 激活中](images/half-hour-game-site/007.png)
![待处理状态](images/half-hour-game-site/008.png)

还没生效时会提示待处理或未激活，等待即可。

---

## 第二步：创建 GitHub 仓库

去 GitHub 创建一个新的项目，名字叫做 MemoryTest.io，选择 Public，先生成一个 README.md，点击创建仓库。

![创建 GitHub 仓库](images/half-hour-game-site/009.png)
![仓库已创建](images/half-hour-game-site/010.png)

---

## 第三步：用 Claude 生成游戏代码

让 Claude 帮我们写代码。提示词如下：

> 我注册了 MemoryTest.io 这个域名，准备做一个在线锻炼记忆力的小游戏。我准备使用 iframe 形式把游戏嵌入到网站的首页，所以你需要帮我分别生成首页的 index.html 文件和游戏 game.html 文件。现在请先帮我生成 game.html 的代码，请使用纯 html+css+js 实现这个记忆力锻炼在线小游戏。因为是放到 iframe 内，所以游戏需要全屏显示。
>
> 打开时看到的是游戏名称和游戏规则介绍和开始游戏按钮。游戏规则：游戏有 20 关，每一关都是 5 秒钟，从 1 位数开始一直到 20 位数，每一关出现一个对应位数的数字，玩家需要在 5 秒倒计时内把数字记在大脑里。倒计时结束之后，显示一个输入框，用户需要输入数字，点击提交按钮，游戏需要检测用户是否答对了。
>
> 游戏顶部有一行 20 个格子，每一个格子代表一关，玩家答对显示绿色，答错显示红色。最后 20 关结束之后，需要显示玩家的总分，第一关 5 分，第二关 10 分，第二十关 100 分，依此类推，总分 1050 分。得分 840 分以上的，优秀，分数越高越优秀。

提交后稍等几秒，游戏就生成好了。哥飞玩了前三关，没有问题。

![Claude 生成的游戏代码预览](images/half-hour-game-site/011.png)
![游戏代码全貌](images/half-hour-game-site/012.png)
![游戏运行截图](images/half-hour-game-site/013.png)

![游戏代码切换模式](images/half-hour-game-site/014.png)
![代码编辑界面](images/half-hour-game-site/015.png)
![复制代码按钮](images/half-hour-game-site/016.png)

把代码粘贴到 GitHub 上，创建 game.html 文件，点击 Commit Changes。

![GitHub 新建文件](images/half-hour-game-site/017.png)

---

## 第四步：Vercel 部署

这时候回到 Cloudflare，域名状态已经变成可用的了，说明 DNS 已切换成功。

![DNS 已生效](images/half-hour-game-site/018.png)

去 Vercel 创建新项目，选择 MemoryTest.io 仓库，点击 Import。

![Vercel 创建项目](images/half-hour-game-site/019.png)
![Vercel Import 界面](images/half-hour-game-site/020.png)
![Vercel Deploy](images/half-hour-game-site/021.png)

部署成功，但因为只有 game.html 没有 index.html，所以预览图显示 404——这是预期之内的。

![Vercel 部署成功但 404](images/half-hour-game-site/022.png)

Vercel 分配的测试子域名打开也是 404。手动在域名后加 `game.html` 就可以打开游戏了。

![测试子域名 404](images/half-hour-game-site/023.png)
![游戏页面可访问](images/half-hour-game-site/024.png)

---

## 第五步：配置自定义域名

在 Vercel 设置的 Domains 里输入刚才注册的 memorytest.io，点击添加。

![Vercel 自定义域名设置](images/half-hour-game-site/025.png)

选择第二种方式（CNAME + A 记录），这是哥飞推荐的。

![选择 CNAME 方式](images/half-hour-game-site/026.png)

Vercel 给了 2 条 DNS 记录，需要去 Cloudflare 添加。

![Vercel DNS 记录](images/half-hour-game-site/027.png)

打开 Cloudflare，分别添加 CNAME 记录和 A 记录。

![添加 CNAME 记录](images/half-hour-game-site/028.png)
![添加 A 记录](images/half-hour-game-site/029.png)
![两条记录添加完成](images/half-hour-game-site/030.png)

回到 Vercel，已检测到 DNS 记录，正在生成 SSL 证书。

![Vercel 生成 SSL 证书](images/half-hour-game-site/031.png)

去 Cloudflare 的 SSL 设置，选择**完全（严格）模式**。

![Cloudflare SSL 配置](images/half-hour-game-site/032.png)
![自定义 SSL](images/half-hour-game-site/033.png)
![完全严格模式](images/half-hour-game-site/034.png)

如果没选完全（严格）模式，会一直提示重定向过多：

![重定向过多错误](images/half-hour-game-site/035.png)

配置好后，回到 Vercel，SSL 证书已生成：

![SSL 证书就绪](images/half-hour-game-site/036.png)

用自己的域名可以正常访问：

![自定义域名正常访问](images/half-hour-game-site/037.png)

---

## 第六步：用 Claude 生成 SEO 页面

游戏部署好了，现在让 Claude 生成 SEO 友好的页面。吸取教训，这次明确要求生成英文页面。提示词如下：

> 好的，现在游戏我已经部署好了，访问地址是 https://memorytest.io/game.html 。现在我希望你帮我生成 index.html 页面，我希望生成英文界面。你需要在这个页面里通过 iframe 形式把游戏给嵌入进来。你需要制作一个 SEO 友好的页面，围绕着关键词 Memory Test 去编写页面内容。详细介绍游戏规则，游戏玩法，计分方式等。这是一个游戏落地页，需要有落地页常见的各种 Section，最终全部 Section 组成了 SEO 友好的 Headings。现在请帮我生成页面，要求配色精美现代。

提交后页面就做好了。

![Claude 生成的 SEO 页面](images/half-hour-game-site/038.png)
![GitHub 创建 index.html](images/half-hour-game-site/039.png)

由于已经关联好了 Vercel，提交代码后会自动触发部署。打开 https://memorytest.io/ 就能看到游戏了。

![最终上线效果](images/half-hour-game-site/040.png)
![站点总览](images/half-hour-game-site/041.png)

---

## 总结

- 域名 11:38 注册，12:40 上线，边截图边写文章边做网站，一小时搞定
- 如果只做网站，**半小时内**肯定能搞定
- 核心流程：域名注册 → Cloudflare DNS → GitHub 仓库 → Claude 生成代码 → Vercel 部署 → 自定义域名 + SSL

> 至此，基本的网页已经上线了，但是还没有做任何的 SEO 处理。
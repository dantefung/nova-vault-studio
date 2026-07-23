---
title: "养网站防老第7步：注册域名，解析域名，部署上线"
date: "2024-08-12"
source: "web.cafe"
author: "哥飞"
url: "https://new.web.cafe/tutorial/detail/1JQ1RBpMQR9UiPVnVJ6HMA"
---

# 养网站防老第7步：注册域名，解析域名，部署上线


大家好，我是哥飞。

养网站防老我们终于写到第7步了，先回顾一下前面的步骤：

[养网站防老：网站可以做成一生的事业](https://mp.weixin.qq.com/s/URcdE3VaoYoAx0cOcll8_g)

[养网站防老第1步，挖掘出第1个需求](https://mp.weixin.qq.com/s/V35KGuSqMHhhgr4x1Bzw6Q) [养网站防老第2步：分析搜索意图](https://mp.weixin.qq.com/s/0l-1EVPJWAJK6z9w8Bn-FQ)

[养网站防老第1.5步：用一个公式来判断关键词是否值得做，让你选择关键词不再犹豫](https://mp.weixin.qq.com/s/CJNigdIt8VkfQDangR8Bcg)

[养网站防老第3步：根据搜索意图使用ChatGPT的GPT4生成网页](https://mp.weixin.qq.com/s/Mg5utkp0iD_b0RGMbCvA4A)

[养网站防老第4步：手动调整布局和样式](https://mp.weixin.qq.com/s/2T8u9QsGEKIv7c6ObSwYpw)

[养网站防老第5步：内页和内链建设](https://mp.weixin.qq.com/s/X95UZmPEKHZZ4rNoBcaoJg)

[【6000字详解】养网站防老第6步：利用ChatGPT给网站增加多语言支持](https://mp.weixin.qq.com/s/b3_lY793bgiVcuZ2TREF2w)

在前面步骤中，我们把静态网页做好了，大家会发现，手动去制作这么多页面，再给每个页面做三种语言，工作量很大。

其实我们会发现，很多都是重复的工具，只需要做好一个国家网页模板，去批量替换就可以生成其他所有国家的页面，只需要做好一种语言，再抽取语言包出来，就可以生成其它语言的页面。

这就需要用到脚本生成页面了，不管你用js还是php，还是python或者java，还是go语言，任何语言都可以用，你会哪种语言就用哪种。

你说，你只会js连nodejs都不会怎么办？那就用js渲染生成好代码，然后手动复制浏览器里的html代码也行。

总之，学会变通，有很多办法可以提升效果。

说到这里，哥飞要跟大家检讨一下，哥飞虽然“说得好听”，上面的方法跟大家说了，但是因为个人时间原因，并没有把手机号生成网站的所有页面都做完，才导致推文时间一拖再拖，哥飞今天不拖了，先上线第一版再说吧。

大家也可能会遇到类似的情况，记住一点，有比没有好，完成比完美更重要，请尽快上线第一版。

一、注册域名

通常来讲，我们做这类关键词搞流量的网站，那么最好直接拿关键词去注册域名，我们先用 phonenumbergenerator.com 试一下，结果发现域名已经被人注册了。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_002.png) 那就再用 phone-number-generator.com 去测试，好像也被注册了？ ![image.png](images/gefei-age-proof-site-step-7-deploy/img_003.png) 别担心，是哥飞在写第一步时提前注册好了的，这样到了今天就不会出现无域名可用的情况。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_004.png) 一般的原则是先看关键词com是否能用，不能用就看加横杠的com，如果还不能用，就看关键词net，再看加横杠的net。如果com和net都没有了，再去考虑用其它域名后缀。

二、解析域名到Cloudflare

打开 [https://www.cloudflare.com/](https://www.cloudflare.com/) ，注册登录，点击左侧菜单栏的“Websites”打开网站列表页面，点击右侧的“Add a site”按钮。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_005.png) 然后输入我们的域名，哥飞这里之前已经添加好了，所以会提示已经存在。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_006.png) 正常情况，你输入域名后，就进入了套餐选择界面，我们选择最底下的免费套餐即可。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_007.png) 点击继续按钮后就到了下一页，Cloudflare 会扫描你的域名目前已经有的dns解析记录，如果你是老域名，相当于 Cloudflare 会帮你把所有旧的解析记录都同步过来，这样就可以无缝迁移。我们这里是新域名，所以解析记录为空，直接点击继续按钮就可以了。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_008.png) 会有个弹窗提示你当前没有dns记录，这里不用管，点击确认按钮就行。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_009.png) 之后会显示新的 dns 服务器地址，我们需要复制之后，到域名注册商处修改。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_010.png) 每个域名注册商的dns解析服务商的修改界面都不太一样，哥飞这个注册商的界面长下面这样。把dns1和dns2分别填进去，点击保存即可。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_011.png) 下一步，回到 Cloudflare 点击下方这个按钮即可。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_012.png) 下一步，开启“Automatic HTTPS Rewrites”，开启“Always Use HTTPS”，开启“Brotli”。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_013.png) 确认三个都是“ON”，就可以点击“Finish”按钮。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_014.png) 刚添加好的dns解析服务不会那么快生效，所以会进入下一个页面，看到了这个界面，等待就行。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_015.png) 如果生效了，在网站列表页面，可以看到绿勾勾✅，这就表明域名已经把dns服务切换到Cloudflare了，可以继续下一步了。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_016.png) 三、提交代码到 Github 仓库

打开 Github ，在右上角点击“+”号，选择新建一个仓库。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_017.png) 可以直接用域名当作仓库名称，描述随便写都行，选择“Private”私有仓库，然后点击右下角创建仓库按钮即可。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_018.png) 之后界面会有提示，要你在自己电脑里创建一个本地仓库，把代码放进去，然后提交。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_019.png) 本地如何提交代码，大家可以找找git教程看看，哥飞本文不展开。提交成功后，刷新仓库，可以看到的界面如下，所有提交上来的代码文件都能看到。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_020.png) 四、在 Vercel 部署

Github 仓库中有代码后，就可以部署到Vercel 中了。

如果你没有注册过 Vcrcel ，可以看看哥飞之前写的这篇文章《[不用开发，如何 10 分钟上线一个 AI 产品](https://mp.weixin.qq.com/s/N0Puxv0X2D6eC5q_Ps8uLQ)》，里边有注册步骤。

需要提醒一下，如果你用全新注册的 Github 账号去注册 Vercel ，那么很有可能刚注册号就被封号。这时候你可以邮件联系客服，证明你是真人，而不是薅羊毛的机器人，就能解封账号了。

打开 Vercel 控制台，点击网站列表右上角的“Add New”按钮，选择新建一个“Project”。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_021.png) 选择Github账号，找到我们刚才创建并提交了代码的仓库，点击“Import”按钮，导入代码。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_022.png) 我们这种纯静态页面，不需要做什么配置，直接在下一个页面点击“Deploy”按钮部署即可。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_023.png) 部署成功后，可以看到撒花界面。点击右上角的“Continue to Dashboard”按钮。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_024.png) Vercel 送了一个子域名给我们测试用，可以点击这个域名看看网页，但我们不用这个子域名，我们点击右上角的“Domains”按钮，进入自定义域名配置界面。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_025.png) 在输入框输入我们的域名，然后点击“Add”按钮。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_026.png) 这里有两种模式，哥飞建议你选择第二种，这是为了在用户直接输入域名访问时，减少一次跳转。之后点击“Add”按钮。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_027.png) 之后我们需要进行域名解析，带www和不带www域名，Vercel 给了两种解析方式。我们按照提示照做就行。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_028.png) 打开 Cloudflare 的网站列表，点击域名DNS解析记录，点击“Add record”按钮。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_029.png) 按照 Vercel 的要求，www域名添加 CNAME 记录，按照下方截图所示填写好，点击保存。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_030.png) 再用同样的方法，配置不带www域名的A记录解析。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_031.png) 添加好 dns 解析记录后，在 Vercel 后台可以看到，正在为我们生成 ssl 证书。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_032.png) 看到这种提示，就说明配置好了。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_033.png) 五、打开网站欣赏你的成果吧！

此时，如果你用浏览器打开域名，会发现报错了。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_034.png) 这是因为我们还有一个步骤忘了操作，打开 Cloudflare ，进入 SSL/TLS 界面，会发现目前的模式是“Flexible”，我们需要调整为“Full”模式。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_035.png) 看到提示“mode is Full”，就可以了。 ![image.png](images/gefei-age-proof-site-step-7-deploy/img_036.png) 好好欣赏你的第一个网站吧。

大家看到截图就会发现，哥飞只做好了一个国家的手机号码格式页面。就先这样吧，能给大家演示全流程就足够了，哥飞的这个演示站长什么样不重要。

好了，这就是第7步，大家会发现，细节还是很多的，你第一次做，跟着哥飞的步骤一步一步去做就行。等你多做几次，就熟悉了。



-   ![](images/gefei-age-proof-site-step-7-deploy/img_037.jpg)

    会飞的猪👋

    2024-08-20 21:00

    回复

-   ![](images/gefei-age-proof-site-step-7-deploy/img_038.jpg)

    Cyrus

    2025-01-10 15:47

    回复

    精彩

-   ![](images/gefei-age-proof-site-step-7-deploy/img_039.jpg)

    袁锐钦

    2025-07-29 15:46

    回复

    ### 🔥 **养网站防老第7步笔记（零基础小白版）**

    **目标：30分钟搞定！从“本地文件”到“全网可访问的网站”，全程复制操作就行！**

    #### 一、先搞懂3个核心概念（不用记，知道就行）

    -   **域名**：网站的“门牌号”（比如`phonenumbergenerator.com`），用户通过它找到你的网站。
    -   **部署**：把你电脑里的网页文件“搬”到网上，让所有人都能打开。
    -   **Cloudflare/Vercel**：免费工具，帮你让网站打开更快、更稳定（不用懂原理，跟着点就行）。

    #### 二、4步上线网站（每步带“小白操作指南”）

    ##### **第1步：注册域名——给网站起个“好记的名字”**

    **👉 目标**：拿到一个像`xxx.com`的域名（优先选用户容易记的）。

    **操作步骤**：

    1.  **选域名技巧**：
        -   用网站核心关键词（比如做“手机号生成器”，就试`phonenumbergenerator.com`）。
        -   优先选`com`后缀（最常用），如果被注册了，加横杠（比如`phone-number-generator.com`），再不行换`net`后缀。
    2.  **注册平台**：推荐用阿里云、腾讯云、Namecheap（都是中文/简单英文界面，搜“域名注册”就能找到）。
    3.  **购买流程**：
        -   在平台搜索你想的域名，显示“可注册”就加入购物车，按提示付钱（第一年通常几十元）。
        -   注意：填信息时“所有者姓名/邮箱”如实填，别填错（后面改起来麻烦）。

    **⚠️ 小白避坑**：

    -   域名被注册了？换个关键词（比如加“free”：`freephonenumbergenerator.com`），别死磕一个。
    -   先买1年试试，第二年再续费，不浪费钱。

    ##### **第2步：用Cloudflare“保护”域名（免费！让网站更快更安全）**

    **👉 目标**：把域名“托管”到Cloudflare，相当于给网站加个“加速+防护盾”。

    **操作步骤**：

    1.  **注册Cloudflare**：
        -   打开[Cloudflare官网](https://www.cloudflare.com/)，点“Sign Up”，用邮箱注册（记得验证邮箱）。
    2.  **添加域名**：
        -   登录后点左侧“Websites”→右侧“Add a site”，输入你刚买的域名（比如`phone-number-generator.com`），点“Add Site”。
    3.  **选免费套餐**：
        -   跳转到套餐页面，拉到最底下选“Free”（免费版足够新手用），点“Continue”。
    4.  **改DNS服务器（关键一步！）**：
        -   Cloudflare会显示2个“DNS服务器地址”（比如`xxx.ns.cloudflare.com`），抄下来（记在记事本里）。
        -   打开你买域名的平台（比如阿里云/腾讯云），找到“域名管理”→“DNS服务器设置”，把原来的服务器地址删掉，换成抄的Cloudflare地址，保存。
    5.  **等生效**：
        -   回到Cloudflare，点“Check Nameservers”，之后会显示“等待生效”（通常10分钟到24小时，耐心等，生效后会显示绿色对勾✅）。

    **💡 小技巧**：生效前可以干别的，时不时回来刷新页面看看，绿色对勾出现就说明成了！

    ##### **第3步：用Github存代码（相当于“网站文件的云仓库”）**

    **👉 目标**：把你电脑里的网页文件（`index.html`、`hi`文件夹等）传到网上，方便后面“上线”。

    **操作步骤**：

    1.  **注册Github**：
        -   打开[Github官网](https://github.com/)，点“Sign up”，用邮箱注册（设置密码时加数字/符号，不容易忘）。
    2.  **建“仓库”（文件夹）**：
        -   登录后点右上角“+”→“New repository”，按下图填：
            -   仓库名：填你的域名（比如`phone-number-generator.com`，方便记）。
            -   描述：随便写（比如“我的手机号生成器网站”）。
            -   选“Private”（私有，别人看不到你的代码）。
            -   点“Create repository”（创建）。
    3.  **传文件到仓库**：
        -   进入新仓库，点“Add file”→“Upload files”，把你电脑里的所有网页文件（包括`index.html`、`hi`、`tl`文件夹等）拖进去，然后点“Commit changes”（确认上传）。

    ##### **第4步：用Vercel上线网站（10分钟搞定“全网访问”）**

    **👉 目标**：把Github里的文件“变成”能在网上打开的网站。

    **操作步骤**：

    1.  **注册Vercel**：
        -   打开[Vercel官网](https://vercel.com/)，点“Sign up”，选“Continue with Github”（用刚注册的Github账号登录，授权即可）。
        -   ⚠️ 注意：如果刚注册就被封号，别慌！发邮件给Vercel客服（`support@vercel.com`），说“我是新手，想上线第一个网站，不是机器人”，通常会解封。
    2.  **导入代码**：
        -   登录后点右上角“Add New”→“Project”，在列表里找到你刚在Github建的仓库，点“Import”（导入）。
    3.  **一键部署**：
        -   不用改任何设置，直接点“Deploy”（部署），等待1-2分钟，会显示“部署成功”（有撒花动画🎉）。
    4.  **绑定自己的域名**：
        -   点“Continue to Dashboard”→右上角“Domains”，输入你的域名（比如`phone-number-generator.com`），点“Add”。
        -   跳转到配置页，直接点“Add”（默认设置就行），Vercel会自动和Cloudflare同步，几分钟后显示“配置成功”。

    ##### **第5步：打开网站看看！**

    在浏览器地址栏输入你的域名（比如`phone-number-generator.com`），能看到你做的网页就说明成功了！
    如果打不开，检查：

    -   Cloudflare是否显示绿色对勾？
    -   Vercel的“Domains”页面是否显示“Ready”？
    -   等10分钟再试（有时候有延迟）。

    #### 三、小白必看的3个“保命提醒”

    1.  **“完成比完美重要”**：哪怕网页还有瑕疵，先上线第一版！后面再慢慢改，总比卡着不动强。
    2.  **域名被注册了？**：加个词（比如`myphonenumbergenerator.com`）、换后缀（`net`），别纠结“最好的”，先有一个能用的。
    3.  **Vercel被封号？**：用真实信息注册，被封了就发邮件解释，客服很友好，基本都会解封。

    #### 四、自查清单（做完打勾，确保没漏步骤）

    ✅ 注册了域名（拿到“门牌号”）
    ✅ Cloudflare显示绿色对勾（域名生效）
    ✅ Github上传了所有网页文件（代码存好了）
    ✅ Vercel部署成功，绑定了自己的域名
    ✅ 浏览器输入域名能打开网页

    **总结**：这一步的核心是“把文件搬上网”，跟着步骤点鼠标就行，不用懂代码原理。记住：哪怕慢一点，只要每步做对，你的网站一定能上线！ 🌟

-   ![](images/gefei-age-proof-site-step-7-deploy/img_040.jpg)

    老荀

    2025-09-24 20:33

    回复

    打卡

-   ![](images/gefei-age-proof-site-step-7-deploy/img_041.jpg)

    秋天 | AI探索者

    2026-01-21 17:07

    回复

    打卡

![](images/gefei-age-proof-site-step-7-deploy/img_042.jpg)

添加图片添加隐藏回复

[![new.web.cafe](images/gefei-age-proof-site-step-7-deploy/img_043.svg)](https://new.web.cafe/)

---
title: "利用 AI 给自己做个网站给养老吧，“躺”着把钱挣"
author: "zlbigger"
date: "2024-11-02"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/rIu6Efw7m54FENXEvqtvyg"
---

# 利用 AI 给自己做个网站给养老吧，“躺”着把钱挣

几个月前，我不是发了篇这个么：《AI 产品沉思录：流量先行，窄业务、小产品/工具》，想着融点钱，攒个小团队，猛搞一番，结果不尽如人意，倒不是说事儿不行，主要是没得到金主相助，也没有稳定的团队快速复制，规模化并没有符合预期（预期是跑通了一个之后，直接复制N份自动跑）。



那我干脆分享其中一个项目吧，或许你可以依葫芦画瓢，实现纳瓦尔说的“让你在躺着的时候也能赚钱”。



暂时因精力有限，没有搞太复杂，“盈利”点也是最“原始”广告模式，核心有两个：利用好AI、面向全球多语言。前期框架搭建好，自动化之后，就真的“躺赚”了。当然，前提是自己能写代码或者有人能帮你实现这个代码。



准备工作：



准备工作：



准备工作：



准备工作：



1，域名，空间，去国外平台买，很便宜，不面向国内用户的话甚至不用考虑备案问题。



2，成功开通Google AdSense，没有通过可以等网站内容丰富些后再提交申请。



3，有一些常用的AI大模型的API（比如我用的openai的，现在很多都便宜的不要钱一样）。



4，了解一些基础的SEO知识。



基本框架：



基本框架：



基本框架：



基本框架：



一句话就是一个普通的CMS系统用AI来驱动。



为了更好的表达，我们的网站域名设定为：linggan.io；网站内容主题设定为：各种动漫角色的OOTD。



1，网站结构：



2，URL参数配置（很重要）：



- 首页



默认：https://linggan.io



不同语言对应URL：



英文：https://linggan.io/en



日语：https://linggan.io/jp



韩语：https://linggan.io/kr



中文：https://linggan.io/zh



西班牙文：https://linggan.io/es



……以此类推。



ps：需要重点强调的是，默认首页匹配的某个语言，比如日语，那么直接让所有的https://linggan.io/jp直接301到https://linggan.io/上去，即打开所有https://linggan.io/jp开头的都会自动变成https://linggan.io/直接开头，避免出现大量重复网页内容。



- 内容页面URL：



https://linggan.io/en/page/medaka-kurokami-beautiful-high-heels



当然，你觉得这个Friendly URL复杂了，你完全可以用数字id，我用这个举例是为了后面说有了AI之后，这个很容易实现。



同理，其他语言对应的前面部分也要有变化(page后面的url内容有关的参数倒也不必都转成对应语言，都用英语就好)：



https://linggan.io/kr/page/medaka-kurokami-beautiful-high-heels



https://linggan.io/zh/page/medaka-kurokami-beautiful-high-heels



- 其他页面原理类似：



上面的这个对应的英语标签就是：



https://linggan.io/en/tag/Long plush cardigan



韩语：



https://linggan.io/kr/tag/롱 퍼 가디건



可能会有人问前面的内容页后面那部分为什么都是英语，而上面这个标签页，对应的都转成对应语言了呢？因为这个标签页打开之后是一个标签聚合页，类似于一个小的列表页，搜索结果页也类似:



https://linggan.io/?search=Long plush cardigan



https://linggan.io/?search=롱 퍼 가디건



3，后台功能：



- 内容



单独看着好像没啥，关键在于后面的AI～



手动模式是这样的：



后台输入一个主题或批量导入上百个主题，交给AI，AI打工人会以此执行完成自己那部分，最后组合成一个完整的内容页上线。



全自动模式就是：



写一个定时任务，让对应的AI打工人自己写主题，然后再交给其他AI打工人按照上面的顺序完成即可。



直接实战流程：



直接实战流程：



直接实战流程：



直接实战流程：



1，定时任务写主题（比如每五分钟提交一个）：



角色：写主题的打工人。



prompt：一个知名的动漫女性角色，时尚穿搭，随机穿搭



输出内容：



角色：初音未来（Hatsune Miku）时尚穿搭：上衣：简约白色无袖衫，搭配绿色的边饰，体现清新风格。下装：高腰黑色短裙，搭配轻盈的蓬蓬裙，增添可爱感。外套：亮蓝色短款开衫，增添层次感与色彩。鞋子：黑色高筒靴，时尚而舒适。配饰：耳环：简单的银色圆环耳环，低调却时尚。发箍：绿色的发箍，呼应头发颜色，增添活力。妆容：自然清新的妆容，突出大眼睛和粉嫩的唇色。随机穿搭灵感：主题：清新可爱颜色：白色、黑色和蓝绿色元素：简约风格，强调个性与活力这样的一套穿搭既展现了初音未来的独特魅力，又兼具时尚感！



2，根据1的主题内容出图



角色：写画图提示词的打工人



prompt：



请根据{主题内容}，简化成一段prompt提示词，做到简洁又精准，输出为英文，返回json格式。



输出内容：



{"prompt": "Outfit for Hatsune Miku: A fresh look featuring a simple white sleeveless top with green trim, a high-waisted black skirt with a fluffy layer, and a bright blue cropped cardigan. Paired with stylish black knee-high boots. Accessories include silver hoop earrings and a green headband to match her hair. Natural makeup accentuating big eyes and soft pink lips. Theme: Cute and fresh, Colors: White, black, and teal."}



把对应的结果传给画图API，返回的图片如下：



3，网页标题



角色：标题党高手



prompt：



将{主题内容}提炼概括出一句话的核心内容，需要包含什么人穿了什么衣服，最多100个字节来概括内容摘要，最终翻译成西班牙文，简体中文，日文，韩文，英文，可以直接采用原文的内容。用json输出如下格式内容{"es":"zh":"","jp":"","kr":"","en":""}



输出结果如下：



{"es":"Hatsune Miku lleva una blusa blanca sin mangas con borde verde, una falda corta negra con tul, un cárdigan azul brillante y botas altas negras, reflejando un estilo fresco y encantador.","zh":"初音未来穿着简约白色无袖衫、黑色高腰短裙、亮蓝色开衫和黑色高筒靴，展现清新可爱的风格。","jp":"初音ミクは、白いノースリーブシャツ、黒のハイウエストミニスカート、明るい青のカーディガン、黒のハイソックスブーツを着用し、清新で可愛いスタイルを表現しています。","kr":"하츠네 미쿠는 흰색 민소매 셔츠, 검은색 하이웨이스트 미니 스커트, 밝은 파란색 카디건, 검은색 롱부츠를 입고 상큼하고 귀여운 스타일을 표현합니다.","en":"Hatsune Miku wears a white sleeveless top with green trim, a high-waisted black skirt, a bright blue cardigan, and black knee-high boots, showcasing a fresh and cute style."}



这样不同语言下的不同网页标题就实现了。



4，网页标签（网页关键词）



这俩可以当作一个东西来处理，主要输出标签，对应的网页keywords直接引用该文的标签即可。



角色：分词高手



prompt：



你是一名自然语言处理专家，非常善于处理各种语言下的分词，根据{主题内容}切分成相关的词组用来当作文章内容的标签，标签对应的词组用英文符号','来分隔。只选择重点内容的核心词组作为标签，去除无意义且不适合做标签的词组，相似词只选择一个，不选纯数字作为标签，最终翻译成西班牙文，简体中文，日文，韩文，英文，可以直接采用原文的内容。用json输出如下格式内容{"es":"zh":"","jp":"","kr":"","en":""}



输出内容为：



{"es":"moda, ropa, estilo, frescura, vestido, corta, azul, negro, accesorios, aretes, diadema, maquillaje, personalidad, energía, Miku","zh":"时尚, 穿搭, 风格, 清新, 上衣, 短裙, 蓝色, 黑色, 配饰, 耳环, 发箍, 妆容, 个性, 活力, 初音未来","jp":"ファッション, 服装, スタイル, フレッシュ, トップス, ミニスカート, 青, 黒, アクセサリー, イヤリング, ヘッドバンド, メイク, 個性, エネルギー, 初音ミク","kr":"패션, 의상, 스타일, 신선함, 탑, 미니스커트, 파란색, 검정색, 액세서리, 귀걸이, 헤어밴드, 메이크업, 개성, 활력, 하츠네 미쿠","en":"fashion, outfit, style, freshness, top, mini skirt, blue, black, accessories, earrings, headband, makeup, personality, energy, Hatsune Miku"}



好了，现在每个内容下的不同语言的标签（keyword）也完成了。



5，网页的description



```

对应的就是网页上的&lt;meta name="description" content="“&gt;
```




这里你可以偷懒，直接用2输出的内容，你也可以专门建一个角色来写。



角色：description高手



prompt：



你是一名seo高手，非常善于写网页内容的description，请根据{主题内容}写一段符合要求的description，既满足seo要求又提炼出核心内容 ，最终翻译成西班牙文，简体中文，日文，韩文，英文，可以直接采用原文的内容。用json输出如下格式内容{"es":"zh":"","jp":"","kr":"","en":""}



输出结果：



{"es": "Descubre el estilo fresco y encantador de Hatsune Miku con una blusa sin mangas blanca y detalles verdes, una falda corta negra de cintura alta con un volado ligero, y una chaqueta corta azul brillante. Complementa el look con botas altas negras y accesorios sencillos como aretes de aro plateados y una diadema verde. Este conjunto destaca la personalidad vibrante y la elegancia de Miku.","zh": "探索初音未来清新可爱的穿搭，简约白色无袖衫搭配绿色边饰，高腰黑色短裙与轻盈蓬蓬裙相得益彰，亮蓝色短款开衫增添层次感，黑色高筒靴时尚舒适。简单的银色圆环耳环与绿色发箍呼应，突出个性与活力。","jp": "初音ミクの清新で可愛いスタイルを発見しましょう。緑のディテールが施された白のノースリーブシャツ、高ウエストの黒のショートスカート、軽やかなフリルスカート、明るい青のショートカーディガンを組み合わせています。黒のハイソックスブーツとシンプルな銀のリングイヤリング、緑のヘアバンドで個性と活力を強調します。","kr": "초코 미쿠의 신선하고 사랑스러운 스타일을 발견하세요. 녹색 디테일이 있는 흰색 민소매 블라우스와 하이웨이스트 검정 미니 스커트, 가벼운 프릴 스커트를 매치하고, 화려한 파란색 짧은 카디건으로 레이어드를 더했습니다. 블랙 하이 부츠와 심플한 실버 링 귀걸이, 녹색 헤어밴드로 개성과 활력을 강조하세요.","en": "Discover Hatsune Miku's fresh and charming style with a sleeveless white top featuring green accents, a high-waisted black mini skirt paired with a lightweight tulle skirt, and a bright blue cropped cardigan for added layers. Complete the look with stylish black knee-high boots and simple accessories like silver hoop earrings and a green headband. This outfit showcases Miku's vibrant personality and elegance."}



6，核心文本内容了。



如果主题内容足够长，你要偷懒直接用，也行。我们这里都单独设计个角色写一下内容。



角色：文本创作大师



prompt：



```

请根据{主题内容}，用一个动漫杂志结合时尚杂志的角度来扩写对应的内容，不脱离原文主题的情况下，变成一篇可读性强的文章，字数500以内即可，段落用&lt;p&gt;&lt;/p&gt;来区分，最终翻译成西班牙文，简体中文，日文，韩文，英文，可以直接采用原文的内容。用json输出如下格式内容{"es":"zh":"","jp":"","kr":"","en":""}
```




输入内容比较长，这里就截图表示一下输出内容：



好了，截止到现在，关键内容基本上就全部自动化完成了，套上一个差不多的前端设计，就可以让这个网站给你自动打工了。



最后整个流程大概是这样的：



上面就是一个完整的实现路径，充分利用AI给自己干活。未必完全按照我上面的模式做，我也只是抛砖引玉，举一反三要看你自己，本身可以扩展出很多玩法的，核心在于，AI能帮你干很多事情，比如这个全球多语言，好处就是可以让全世界说各种语言的人进入到你网站，还有就是选择一个有“流量”的主题，比如我举例的这个主题，你可以结合AI让你心爱的动漫角色穿上牛仔短裤，吊带背心，甚至婚纱礼服。



这是其中的一个索引量



其中一个近期的曝光量



各个地区的访客



关于成本



关于成本



关于成本



关于成本



域名：一年100块



空间：外面有大把白菜价的空间，比如搬瓦工之类的



cloudflares上有很多可以白嫖的功能，初期没量足够了，有量再根据实际情况加cdn之类的。



文本生成的模型用低级别的就够，基本上等于不要钱。



如果像我上面的，涉及到图片生成，这个成本目前还不低，但是不能傻傻的真去买那种死贵死贵的API，要动点心思想聪明的办法。如果你是付费打赏我可以分享一个方案。



希望本篇可以给你灵感，让你躺着把钱挣。有想合作的，可以找我啊，我有大把的待实施的项目，我们可以一起玩啊。



本来想把这篇变成付费文章，后来一想，算了，要是觉得不错，可以打个赏，要是没人打赏……



那就尴尬了。

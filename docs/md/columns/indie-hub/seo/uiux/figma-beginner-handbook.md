---
title: "小白的Figma入门手册"
date: "2021-07-26"
source: "站酷ZCOOL"
url: "https://m.zcool.com.cn/article/ZMTE5MzAwNA==.html"
---

# 小白的Figma入门手册

[![用户头像]("undefined")

  

**3.11我如何找到最初的组件？**

首先需要说明，Figma的组件管理方式很灵活，但相较于Sketch的确不够规范，这里仍建议设计师新建一个layers,以组件来命名，将原始组件都放置在这个页面，易于管理。 

![](https://img.zcool.cn/community/0185ae5fa244ac11013ee04d29c2e9.png?k=3b90806323c435f43e60f207329b7cb4&t=6a64576d)

  

该Layer主要目的在于管理原始组件，例如当需要大批量修改组件时，切换到组件Layer快速修改，修改后快速映射到所有设计稿。

  

当需要调用组件时，则推荐使用官方提供的Assert模块，通过拖拽调用组件实例。

  

在实际工作场景中，我们需要从实例跳转到原始组件，以进行大批量效果修改时，可通过属性检查器中的组件icon快捷跳转至原始组件。 

  

![](https://img.zcool.cn/community/01f6525fa244ad11013ee04d3c1086.png?k=360ba9579ccf1560ea92c02e5a3d139a&t=6a64576d)

  

**3.12实例操作**

  

在实际工作中，我们会遇到使用一个类似组件来建立新组件的场景，此时需要将组件逆向为组，然后进行编辑，在Figma中仅实例可以进行逆向，方法是右键，或者在属性检查器区域执行Detach instance命令。 

  

![](https://img.zcool.cn/community/01d9255fa244ad11013fdcc75ab74c.png?k=61c9fc5e518067b22bd5fc74696bae89&t=6a64576d)

  

当直接在当前正在操作的实例上进行少量变更后，可以通过覆盖功能将当前的属性同步给组件和所有实例。

方法是在右侧属性检查器执行Push Overrides to Main Components。 

  

**3.13组件库的使用  
**

  

**如何上传和维护组件库？**

Figma的组件库系统极其友好，易于维护。设计师只需要将已经设计完成的组件系统和样式系统放置在一个文件中，然后就可以基于当前的文件已有的样式和组件直接建立共享组件库，只需要在Assert的Library入口进入组件窗口，通过组件库窗口中的上传（Publish）功能,完成上传，团队成员就能获得该组件库内容。

后续维护组件库的工作只需要在该文件上进行修改和完善，随后回到library窗口进行更新。当然，在你对组件库进行修改后，Figma会自动弹出快捷窗口以供你迅速更新组件库，这也不失为一种好办法。

当你更新组件库后，其他使用了该组件库内容的设计师会同步收到更新消息，且可以快速同步到最新版本，以保证设计一致性。

  

**如何使用团队成员已上传的组件库?**

在Library窗口，团队已公开的组件库会以List的形式展示，设计师只需要点击你的目标组件库左侧的switch，即可唤醒该组件库，回到你的文件画板中，此时即可调用该组件库的内容，如组件、颜色样式、字体系统等。

想要快速查看组件库内的内容可以使用Option+2，快速调起Assert资源窗口，在左侧图层列表查看。 

  

![](https://img.zcool.cn/community/0178985fa244ad11013fdcc777fccf.png?k=60ff9a5c68d50a36568dbf87a6bbb86b&t=6a64576d)

  

**3.2响应式约束（constraints）**

通过约束功能的官方定义我们更容易理解这个功能。首先要说明其限制条件，约束功能只有在Frame中才可以发挥作用，也只有Frame中的元素，才会展示Constraints工具。因此，官方定义其为：“允许你将设计元素固定在父框架的不同位置”，所以，请谨记约束功能以建立Frame为前提，而其主流使用场景就是构建流畅的布局以适应不同设备尺寸，即当设计师将Frame尺寸进行变更时，Frame内的元素会自动按照预先设定的规则固定位置。

但在真实场景下，响应式约束的功能并不局限于此，它更是可复用、可快速编辑组件的必要组成条件。Figma的Frame不同于Sketch的画板工具，可以互相嵌套且不会影响到复杂度产生墒增的问题，因此可以通过Constraints配合Frame组合成规范布局的组件系统，再加上我们后面要讲的Auto layout功能，可以构建出高自由度，可任意调用，且能够根据真实填充数据自动布局的超级组件，这样构建的组件一方面还原了真实场景下的设计效果，一方面大大减少了设计师重复性工作。

  

下面是响应式约束的不同条件及对应的效果。 

  

![undefined](https://img.zcool.cn/community/01fbc15fa2450e11013ee04ddeacfc.png?k=9f75f5353a4516e486451741ab73117c&t=6a64576d "undefined")

![](https://img.zcool.cn/community/01028d5fa2450f11013fdcc7b1cc1a.png?k=4dea2153d4bb74da0c028db897eecf71&t=6a64576d)

  

响应式约束的常规案例。

  

![](https://img.zcool.cn/community/0161695fa2450f11013ee04dae98ca.png?k=82e39f5dfed3d0b931fe9384c46c7288&t=6a64576d)

  

**3.3自动化布局（Auto layout）**

  

自动化布局工具是制作复杂组件的核心技巧，与响应式约束搭配可以设计出高度自由可编辑的组件乃至半成品页面。

  

一般来说，我们谈到组件系统主要聚焦的是其规范一致性，设计资源管理等方面，**但实际上，组件库在提升设计师效率，减少重复性工作方面能够发挥更强大的作用**。常规组件调用后需要花费一定精力修改，但通过自动化布局工具设定好规则后，设计师能沉淀一整套可直接使用、根据内容填充物自动布局变化的超级组件，甚至是成熟的典型页面，可极大提升设计效率，减少在移动、复制、填充内容等基础操作上的时间浪费。

  

下面我实现了一个最简单的案例，再该search组件中需要填充真实数据以模拟真实场景下的样式，设计师只需要输入新的填充内容，组件内其他元素会自动匹配到对应的正确位置。 

  

  

![](https://img.zcool.cn/community/0151765fa2450f11013fdcc7b2a668.png?k=56cc2e84000c958be2af14c94fde6ca1&t=6a64576d)

  

自动布局按照常规布局规则划分为三个属性，分别是左右空隙、上下空隙、元素间空隙。

  

当选中多个元素，执行Shift+A（建议熟悉快捷键提升效率）后，会为这些元素建立自动布局，规则可以在右侧属性检查区设定。

  

例如我需要建立一组横排的card，此时可以先设计好三个card，然后选中它们，执行Shift+A即可创建一组横排的自动布局（横排竖排根据你真实场景下元素的排列情况，也可以在右侧更改横排为竖排）。另外一种小技巧是，直接给一个card执行Shift+A命令，然后选中组内的card执行复制命名cmd+D，后复制出的每一个card也会按照预定规则排列。 

  

![undefined](https://img.zcool.cn/community/010ac75fa2459211013fdcc764a42d.png?k=7e1ba458e0a1adacb9a55b5c81989aef&t=6a64576d "undefined")

  

如下图案例所示，元素与元素组合构成自动布局的组件，自动布局的组件组合则能构成更复杂的大兴组件乃至典型模块、典型页面。建议设计师快速掌握该技巧的方法是将其套入实际需求中，从提升设计效率，减少重复工作的出发点开始设计自己的典型组件模块。

  

![](https://img.zcool.cn/community/01ccc85fa2459211013fdcc7ac9f34.png?k=769a45dd8abeaa2aecd12ebc0e9270ed&t=6a64576d)

  

  

![](https://img.zcool.cn/community/01e1515fa2459211013fdcc7e91e95.png?k=2af8ca7baeadc7c6df3228f2bd244f4a&t=6a64576d)

  

**3.4共享样式 （style）**

关于共享样式，从sketch转型到Figma的同学应该再熟悉不过了，共享样式是组件库的核心构成之一，主要包括颜色、字体及各种样式效果。这里着重说明一下Figma共享样式与Sketch共享样式的差异。Figma中对样式进行了更为细致的划分，共包括颜色、字体、效果三类。

  

以颜色为例，Figma中颜色样式可自由运用到图形、描边、字体等各细分元素上面，无任何限制，可与各元素自由搭配。以字体为例，字体样式仅包括字体字号、字重、行高等字体本身的属性，不包括颜色，换言之，Font样式的颜色可以自由使用Color样式。

  

概括来讲，Sketch更注重常规理解下，组件系统的实际应用时的场景，如字体样式是由字体字族、字号、字重、行高、颜色所有属性一同构成的，而Figma强调更高的自由和编辑性，孰优孰劣无法一言蔽之，从严谨性和组件自我封闭完整性来讲，sketch的要更好一些，但从组件自由度，组件嵌套组合的效率上来讲Figma要更好一些，所以关键在于设计师能否合理运用，快速掌握技巧并提高效率。

  

![](https://img.zcool.cn/community/0135465fa2459211013fdcc7693c47.png?k=1c9710a5b1e32eea31e26ef967958383&t=6a64576d)

  

**3.5交互原型**

  

Figma的交互功能，在设计软件中我愿称之为最强，极简的操作逻辑以及优秀的实现效果使其在中小复杂度的交互场景下不逊色于专业UI动效设计软件。在FIgma的交互模式下能看到Principle的影子，其背后的设计逻辑高度相似，符合UI设计领域快速输出产品交互物的场景。

  

如下图所示，界面间的交互逻辑通过选择起始画板或其中的元素然后简单的连线即可完成。当然，如果设计师不满足于此可以在右侧属性检查器制作更精致的过度效果。Figma拥有者完善的交互手势可供设计师选择，如点击、hover、拖拽等。 

  

![undefined](https://img.zcool.cn/community/01751f5fa245c311013fdcc70399e3.png?k=570b333ef507bc9b6744738c9e9fb850&t=6a64576d "undefined")

  

然后是过渡效果，在这里我只推荐一种交互方式，那就是Smart Animate，一句话概括，Smart Animate复刻了Principle元素演变的逻辑，所以如果你是Principle的忠实拥趸，那在FIgma交互模式下你可以无缝代入到Principle的使用经验中。 

  

![](https://img.zcool.cn/community/01b7b25fa245c311013ee04df4069a.png?k=740da1305cab7a72030db031877ee9ab&t=6a64576d)

  

除此之外，需要特殊说明的一个交互功能是弹窗交互Open Overly。使用该交互会调起一个覆盖层，适合弹窗类场景。方法如下图所示。Figma交互模块有很多功能，感兴趣的可以自行探索，而对于大部分设计师来讲，掌握最基础的Figma交互原型功能就已经能够让你的演示事半功倍了。

  

![](https://img.zcool.cn/community/01527e5fa245c311013ee04d5e5be2.png?k=05a1b16b747d0a43a6e9485f50e133e7&t=6a64576d)

  

遗憾的是，每次演示只能演示一条流程。如下图所示，有编辑权限的设计师需要将播放功能固定到起始画板，演示模块会以此为当前交互线程的出发点。若你有多条交互线程，那只能手动调整起点进行演示了。 

  

![](https://img.zcool.cn/community/01b1bc5fa245c311013fdcc7326afc.png?k=cf19129215a3f424b81ddb800496c4df&t=6a64576d)

  

**3.5输出**

直接分享链接给对应的利益相关者即可。PM可以在视觉稿上直接评论，快捷沟通解决问题。开发可以切换到开发者模式查看切图标注。

  

![](https://img.zcool.cn/community/0161f05fa245c311013fdcc7e9250c.png?k=082600b112028d91738c63c9b701fbc2&t=6a64576d)

  

**四：迁移**

Sketch文件可以直接导入，基本无损，只需要处理一些异常问题。

  

sketch原组件需要在figma逻辑下重新整理和设计，但如果在迁移初期完全不会影响，如果你的需求中不涉及到大量sketch的组件，可以直接把旧的设计稿拖到figma，无缝连接。

  

**迁移中已知的常见问题**

**1.图层遗失**

在sketch有遮罩效果的图层（如一个矩形），转到Figma中，该矩形会转化为Figma的遮罩，而失去原本的矩形。可以理解为，Sketch中的遮罩保留了原本的矩形的属性，Figma中矩形转化为遮罩会失去原本的矩形。 

  

![undefined](https://img.zcool.cn/community/0116eb5fa245f911013fdcc7347cdf.png?k=81699aaf03b456196ae5ae954c3cc4e6&t=6a64576d "undefined")

  

**2.组或元素超或小于遮罩范围**

这种问题一般是由于组在迁移后被转化为画板，组会受到遮罩影响，而画板不会。只需要把画板转化为组——Grop-Frame（在右上方属性检查器那里调整）即可解决该问题。 

  

![](https://img.zcool.cn/community/0153c75fa245fa11013fdcc783ee5c.png?k=8ff650b6326a0c85abc13376c452c0d5&t=6a64576d)

  

**3.阴影显示异常**

原本Sketch中的组在Figma中转化为Frame，Frame会遮住弥散的阴影，只需要将Frame转化为组Grop即可。 

  

![](https://img.zcool.cn/community/01e71e5fa245fa11013ee04ddd78b8.png?k=3f25ac58d1ead38bf23f0adf99479484&t=6a64576d)

  

  

**五：插件**

Figma与Sketch一样有众多插件可以帮助设计师提升设计效率，甚至某些基础功能如等比缩放也需要插件帮助实现。

  

插件可以通过系统菜单中的Plugin来安装和调用。具体位置为Plugin-manage plugin。想要搜索新的插件只需要点开一个已安装插件，在插件详情页的顶部使用搜索工具来寻找目标插件。

  

下面列出了几个我最常用的插件。 

  

**5.1Arrow Auto**

Arrow Auto是一个原型连线工具，能够快速在选中的元素、画板间连线，且可以自由选择线段两端的样式。由于Figma官方的交互连接线需要在Protype模式下才可以查看，存在无法覆盖的场景。

  

因此当设计师需要快速展示交互逻辑时，Arrow Auto是一个不错的选择，。除此之外，需要输出中低保真度原型的交互设计师和PM也可以使用它来快速构建MVP原型。 

  

![](https://img.zcool.cn/community/0193ab5fa245fa11013ee04dcd38c9.png?k=5aaa47efad74a67d0f1633604a6aa0e5&t=6a64576d)

  

**5.2 Time machine**

TIme machine是一款时间机器类插件，可以帮助设计师快速储存历史版本设计稿，并通过时间线命名。虽然Figma自带30天可追述历史版本的功能，但保存一份备份版文件还是有其必要性的。

设计师只需要选择对应的画板，执行plugin-TIme machine，就会自动生成一个以时间命名的Layer，用来存放历史备份。 

  

![](https://img.zcool.cn/community/01af035fa245fa11013fdcc79abe9b.png?k=9e9b7f0588e12543d674927b969ede6f&t=6a64576d)

**5.3 Clean Document**

Clean Document是一款图层清理插件，可以帮助设计师快速清理隐藏的图层，解除单个图层的分组，批量规范图层命名等。设计师可以在插件页面中选择自己需要执行的清理工作，然后执行清理操作，期间需要花费一定时间，为了避免卡顿可以少量选中画板分批清理。 

  

![](https://img.zcool.cn/community/018eb65fa245fb11013fdcc7743974.png?k=d39e01f959d903999c4da41e6541796d&t=6a64576d)

  

**5.4Scale**

Scale是一款等比缩放插件。由于Figma自带的等比缩放功能无法精确按照数值进行操作，因此当设计师需要对设计元素进行等比缩放时，需要适用该插件。 

  

![](https://img.zcool.cn/community/0157045fa245fb11013ee04d358da3.png?k=308a3dda374553b25eeccbcb25ef66f8&t=6a64576d)

  

最后附上Figma新手入门手册链接，按需自取。

  

https://www.figma.com/file/FLODPjuOYSH758AfprWOLM/Figma%E4%BB%8E0%E5%88%B01?node-id=0%3A1

  

——感谢阅读——

  

我所在的设计团队在招聘优秀的体验设计师（不分UI和交互，是一个综合型岗位），主要工作方向为B端供应链体系，欢迎有相关经验的B端设计师或者有转型想法的C端设计师加我微信，我可以帮忙内推。

公司福利超赞，无限量零食，团队氛围自由欢快，最关键的是深圳著名的不加班公司。

![undefined](https://img.zcool.cn/community/01747a5fa2465011013fdcc785185a.png?k=9805b77da479999fdc3ec34c50afa257&t=6a64576d "undefined")

63

Report

|

声明

199

Share

[原创Article](https://www.zcool.com.cn/search/content?word=原创Article "原创Article")[UI](https://www.zcool.com.cn/search/content?word=UI "UI")[经验观点](https://www.zcool.com.cn/search/content?word=经验观点 "经验观点")[figma](https://www.zcool.com.cn/search/content?word=figma "figma")[入门](https://www.zcool.com.cn/search/content?word=入门 "入门")[新手](https://www.zcool.com.cn/search/content?word=新手 "新手")
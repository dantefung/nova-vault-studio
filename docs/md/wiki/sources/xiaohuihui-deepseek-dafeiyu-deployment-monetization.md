---
title: "龙克星：DeepSeek「大肥鱼」人性化部署全社交平台接入教程"
date: "2026-10-29"
source: "X/Twitter"
author: "龙克星 (@Xiaohuihui_BTC)"
url: "https://x.com/Xiaohuihui_BTC/status/2114359919327506579"
coverImage: "../images/xiaohuihui-deepseek-dafeiyu-deployment-monetization/001.jpg"
---

# 龙克星：DeepSeek「大肥鱼」人性化部署全社交平台接入教程

> Windows 本地部署 DeepSeek Harness（DSH）并接入 QQ、微信、B 站三端的完整七步教程：装 Node.js 24、装 dsh.cmd、接通模型、绑定 IM 机器人、装 dsh-bili-scroll 刷 B 站生成日报、设定人设、服务器长期运行与排障。每步附明确成功判断标准与「权限/账号准入解决不了就换路」的边界提示。

<!-- more -->

我们部署一条自己的 “大肥鱼”：

先让它在电脑上正常对话，再按需要接入 B 站、QQ 或微信。

你可以让它筛选视频、整理日报，也可以在手机上给它安排任务。

这里以 Windows 本地部署 为主。

| 你想实现什么 | 需要安装什么 | 先完成哪些步骤 |
| :--- | :--- | :--- |
| 在电脑上和 AI 对话 | DeepSeek Harness，简称 DSH | 第一步至第三步 |
| 在 QQ 上聊天或在群里 @ AI | DSH 与 dsh-im | 第一步至第四步，选 QQ |
| 在微信里给 AI 发消息 | DSH 与 dsh-im | 第一步至第四步，选微信 |
| AI 帮你筛选 B 站视频 | DSH 与 dsh-bili-scroll | 第一步至第三步，再做第五步 |

DeepSeek 是模型，DSH 是让模型调用工具、执行任务的软件，插件负责连接各个平台。

接入多个平台可以复用同一套 DSH，但各个平台需要分别绑定，会话和人设也要核对，不能默认互通。

## 第一步：准备运行环境

1. 打开 PowerShell

按 Win + R，输入 powershell，回车。后面的 Windows 命令都在这个窗口里输入。

先检查 Node.js 和 npm：

```powershell
node --version
npm.cmd --version
```

**本教程以 Node.js 24 系列为运行基线。**如果已安装 Node.js 24，且 npm 能显示版本号，就可以继续；如果版本较旧或提示找不到命令，去 [Node.js 官网](https://nodejs.org/en/download) 安装适用的 Windows LTS 版本，然后重新打开 PowerShell。遇到插件的引擎版本提示时，以该插件当前发布包的要求为准。

注：命令里的 .cmd 是 Windows 可用的命令入口，能避开同名 PowerShell 脚本的执行策略问题。不要为此修改整台电脑的执行策略。

2. 创建一个专用文件夹

终端输入：

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\ai-fish" | Out-Null
Set-Location -LiteralPath "$env:USERPROFILE\ai-fish"
```

这会在你的用户目录里创建 ai-fish 文件夹，用来放这次实验的文件。后面添加 DSH 工作区时，选择它。

想确认文件夹位置，可以输入：

```powershell
Get-Location
```

**成功判断：**显示的路径以 ai-fish 结尾。

## 第二步：安装并启动 DSH

项目地址：[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)

1. 安装命令行程序

为了后面安装插件和重新启动方便，这里使用固定的全局命令入口：

```powershell
npm.cmd install --global @deepseek-ai/dsh
```

等待命令执行结束，再检查：

```powershell
dsh.cmd --help
```

**看到帮助说明，说明命令已经可用。**如果找不到 dsh.cmd，先关闭并重新打开 PowerShell，再试一次。

注：如果你之前已经用 npx.cmd @deepseek-ai/dsh web 打开了页面，先在那个终端按 Ctrl + C 停止服务，然后执行这里的安装命令。后面统一使用 dsh.cmd，方便排查问题。

2. 启动网页界面

终端输入：

```powershell
Set-Location -LiteralPath "$env:USERPROFILE\ai-fish"
dsh.cmd web
```

浏览器通常会自动打开。如果没有，手动访问终端打印的地址，默认是：

http://127.0.0.1:3080

**成功判断：**看到 DSH 操作界面。

注：这个 PowerShell 窗口正在运行程序，先保持开启。浏览器只是操作界面，关闭浏览器页面和停止后台程序是两回事。

3. 选择工作区

在 DSH 界面里点击“选择工作区”，添加刚才的 ai-fish 文件夹，再选中它。全新安装时，没有选工作区导致输入框不可用，属于正常情况。

官方说明：[启动与工作区](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/index.zh.md)。

## 第三步：接通 DeepSeek 模型

1. 准备 API Key

打开 [DeepSeek 开放平台](https://platform.deepseek.com)，登录自己的账号，在 API Keys 页面创建密钥。模型调用是否可用，还要看该账号的余额、额度及服务状态。

API Key 可以理解为“允许这个程序调用模型的钥匙”。把它填进 DSH 的模型设置，不要发到聊天群或放进公开教程截图。

2. 在 DSH 中保存密钥

打开 设置 → 模型，找到 DeepSeek，填入 API Key 并保存。回到会话界面，从当前可用列表中选择模型。

这里先保持默认 API 地址，不需要手动填写其他网站提供的中转地址。

3. 发一句话测试

新建会话，输入：

```
你好，我正在测试连接。请用一句话介绍你自己。
这一步只回复文字，不调用工具。
```

**成功判断：**得到正常回答，而且没有鉴权或额度错误。

如果出现 401，优先检查密钥；出现 402 或余额相关提示，去开放平台核对额度；出现 429，先降低请求频率，再看服务商返回的具体提示。

官方说明：[模型配置](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/providers.zh.md)。

做到这里，DSH 的基础部分就完成了。接下来选择一个平台继续，不必把所有分支一次装完。

## 第四步：接入 QQ 或微信

这里使用一个统一的消息插件：[@xmanrui/dsh-im](https://github.com/xmanrui/dsh-im)。它由社区开发者维护，可以把 QQ、微信等消息接入 DSH。

1. 安装消息插件

在运行 DSH 的终端按 Ctrl + C，确认回到命令提示符，再输入：

```powershell
dsh.cmd plugin --profile web add -w @xmanrui/dsh-im
dsh.cmd web
```

安装完成并重新启动后，刷新浏览器，打开 设置 → IM 机器人。

**成功判断：**能看到消息渠道的配置入口。

注：本教程使用 Web 版，所以是 --profile web。不要把网上桌面版的 desktop 命令混进来。

2. 方案 A：接入 QQ

进入“IM 机器人”，选择 QQ，按界面引导用手机 QQ 扫码创建或绑定机器人；如果已有机器人，也可以使用它的 AppID 和 AppSecret。

连接后，为这个机器人选择工作区和模型。先在 QQ 私聊中发送：

```
你好，请回复“QQ连接成功”，并告诉我当前能帮我做什么。
```

**收到回复后，再测试群聊。**通过 QQ 提供的机器人入口添加到你的测试群，在群里 @ 它发送一句话。可添加的群和使用范围，以你的机器人账号权限及 QQ 界面为准。

QQ 渠道支持私聊和群聊被 @ 后回复。我们先使用 @ 触发，方便确认是哪条消息唤起了 AI。

注：这里绑定的是 QQ 机器人。不要把普通 QQ 账号的密码当成 AppSecret 填进去。

3. 方案 B：接入微信

如果刚才已经安装了 dsh-im，这里不必再安装一遍。

进入“IM 机器人”，选择微信，生成绑定二维码，用手机微信扫码并完成确认。回到 DSH 核对连接状态，再在微信提供的机器人会话里发送：

```
你好，请回复“微信连接成功”。
以后我会在这里给你安排任务。
```

**成功判断：**微信里能收到 AI 的回答。

这条路线先以机器人私聊为目标。腾讯微信渠道的相关文档目前没有声明支持普通微信群；不要把扫码成功理解为已经可以进入所有微信群，或接管已有好友聊天。

如果扫码时平台提示当前账号不可用、无权限或需要额外条件，先按平台提示处理。换人设或重复安装插件解决不了账号准入问题。

接入依据：[dsh-im 项目说明](https://github.com/xmanrui/dsh-im)。微信渠道能力边界参考：[微信官方渠道相关文档](https://docs.openclaw.ai/zh-CN/channels/wechat)。

4. 为手机入口选择合适的权限

首次使用，把机器人指向专用工作区，保留操作审批。先让它回答问题、总结你主动发来的内容，再逐步增加工具能力。

如果要接到多人群，先核对该渠道的访问控制与文件发送权限。群里其他人发来的话，也可能成为 AI 的任务输入。

## 第五步：让 AI 帮你刷 B 站

项目地址：[dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll)

这一分支可以单独安装，也可以和 QQ、微信入口共存。先把“筛视频、出日报”跑通。

1. 准备 Python

在 PowerShell 输入：

```powershell
python --version
```

项目要求 Python 3.10 及以上，或可用的 uv。已经有符合要求的 Python，就不用重复安装。

2. 安装刷 B 站插件

作者的 README 提醒：npm 上的包可能落后于 GitHub 发布版。因此先打开 [GitHub Releases](https://github.com/c1overzz/dsh-bili-scroll/releases/latest)，查看最新发布说明，下载 Assets 里的插件 .tgz 包。

注：选择作者提供的插件安装包，不要把自动生成的 Source code.zip 当成插件包。若发布页没有可下载的插件包，先查看作者当时的安装说明。

下载后在资源管理器里找到这个文件，复制它的完整路径。

在运行 DSH 的终端按 Ctrl + C 停止服务。下面的命令逐行执行：先运行第一行，在提示出现后粘贴文件完整路径并回车，然后再执行第二行。

```powershell
$fishPackage = Read-Host "粘贴下载的 tgz 文件完整路径"
dsh.cmd plugin --profile web add ($fishPackage.Trim('"'))
```

安装完成后输入：

```powershell
dsh.cmd web
```

刷新浏览器，检查设置里是否出现“刷 B 站”。

注：截至核对时，发布页最新标记为 v2.0.4，README 的示例下载地址仍写着 v2.0.2。以后安装时以发布页和安装结果为准，不要只照抄旧教程中的版本号。

3. 安装插件依赖并扫码登录

在“刷 B 站”的环境或高级设置里，先执行“装主依赖”，完成后点击“扫码登录”，用手机 B 站 App 扫码确认。再使用页面里的“测一下”检查环境和登录状态。

二维码相当于给这个本地程序授权账号访问。确认时看清账号和授权说明。

4. 设置第一轮搜索

第一次可以先用这一组关注关键词，每行一个：

```
AI工具
DeepSeek
开源项目
```

选择输出日报。测试阶段把定时运行、自动评论、评论回复、私信投递或回复、自动收藏等写入类功能保持关闭；如果界面只有“投递方式”而没有总开关，也要检查相应互动开关及收件人设置。

然后点击 “现在跑一轮”。它会根据能获取的字幕或画面信息筛选内容；不是每个视频都能成功读取。

**成功判断：**任务有明确结果，并生成可打开的日报。日报中能看到视频链接或 BV 号，以及推荐理由。某条视频缺少字幕、被跳过，也应能从结果或日志里找到原因。

5. 日报稳定后再添加互动

先检查几轮日报是否符合你的兴趣，再按需要开启评论等功能，并设定较低频率和数量上限。公开发言前确认使用的是哪个账号、会发布什么内容。

给插件写一个清晰的人设即可，例如：

```
你是我的 AI 视频筛选助手，名字叫小鲸。
重点关注 AI 工具、开源项目和适合初学者的教程。
每条推荐先说它能解决什么问题，再说明是否适合我。
没有读到的内容要说明，不编造观看体验。
表达自然简洁，不重复夸赞，不泄露账号和本地信息。
```

注意：B 站日报和 QQ、微信通知是不同功能。两个插件都装好后，还需要单独配置报告投递，不能默认日报会自动发到手机。

项目依据：[安装及首次使用](https://github.com/c1overzz/dsh-bili-scroll)、[v2.0.4 发布说明](https://github.com/c1overzz/dsh-bili-scroll/releases/tag/v2.0.4)。

## 第六步：给自己的 AI 设定人设

平台连通后，再做这一步。先用简单的人设，后面边用边改。

在 DSH 的 Agent 预设中配置角色，并在消息机器人的设置里选中对应预设。dsh-im 的机器人可以单独选择模型、工作区和预设；改变默认设置后，已有会话可能继续使用原配置，可发送 /new 开始新的测试会话。

可以从下面这段改起：

```
你叫大肥鱼，是我的学习和信息整理助手。

说话方式：
用中文，口语化，先说结论，再解释。
我不会的术语，先用一句人话解释。
教我操作时，每次只推进一个可以验证的小步骤。
告诉我要点哪里、输入什么，以及成功后应该看到什么。

工作重点：
整理 AI 工具和开源项目。
帮我学习编程，解释报错。
我给你链接或资料时，先确认能否读取，再做总结。

信息要求：
区分查到的事实和你的推测。
无法访问的内容直接说明。
发消息、发布内容或修改文件时，按我给出的范围操作。
```

**成功判断：**开一个新会话问“你会怎么教我部署一个项目”，它能按你设定的节奏回答。

注：提示词负责表达偏好，真正的工具权限仍由 DSH 和插件设置控制。B 站插件有自己的人设设置，若希望风格一致，需要在那里同步调整。

设置依据：[dsh-im 的机器人模型与预设](https://github.com/xmanrui/dsh-im)。

## 第七步：下次怎么打开和排查问题

1. 下次启动

打开 PowerShell，输入：

```powershell
Set-Location -LiteralPath "$env:USERPROFILE\ai-fish"
dsh.cmd web
```

正常情况下，不需要每次重装插件。若平台登录过期，再到对应插件里重新绑定。

关闭浏览器后可以重新打开页面；要停止整个程序，在运行它的终端按 Ctrl + C。电脑关机、休眠、断网或 DSH 停止时，手机端也可能收不到回复。

2. 按顺序定位问题

| 现象 | 先检查什么 |
| :--- | :--- |
| 找不到 node、npm 或 dsh | 是否安装成功；重新打开终端；运行相应的版本或帮助命令 |
| 3080 页面打不开 | 终端里的 DSH 是否还在运行；地址是否和终端显示的一致 |
| 提示端口被占用 | 是否已经开了另一个 DSH；先回到原窗口核对，不要随便结束其他程序 |
| 输入框不可用 | 是否选择了工作区和模型 |
| 网页能打开，但 AI 不回答 | 先检查模型密钥、额度、网络和原始报错 |
| 插件安装后没有入口 | 是否装进 web profile；是否真正重启 DSH 并刷新页面 |
| 网页能对话，QQ 或微信没回复 | 渠道是否在线、绑定是否有效、机器人模型是否选对、访问规则是否允许 |
| QQ 私聊正常，群聊没反应 | 是否已加入目标群；是否 @ 机器人；平台是否允许该群使用 |
| B 站二维码不显示 | 主依赖安装是否成功；查看安装日志 |
| B 站搜索有结果，日报为空 | 是否读到字幕；关键词是否过窄；筛选条件或内容读取是否失败 |

如果要把报错发给 AI 帮忙，先提供：当前做到了哪一步、执行了什么命令、报错最后几行。截图前遮住密钥、二维码、账号凭据和私人聊天内容。

3. 给 AI 的排错提问模板

```
我在 Windows 上使用 DeepSeek Harness Web 版。
启动方式是 dsh.cmd web，使用 web profile。
当前正在配置的平台是：
我已经成功完成的步骤是：
执行的命令是：
错误最后几行是：

请先判断故障发生在哪一层。
每次只给我一个检查动作，并说明预期结果。
先不要删除配置、重新绑定账号或重装所有软件。
```

## 可选：部署到服务器长期运行

如果你希望自己电脑关机后，QQ 或微信里的 AI 仍然可用，就把 DSH 放在持续在线的设备或云服务器上运行。

可选 [腾讯云轻量应用服务器](https://cloud.tencent.com/product/lighthouse) 等服务

这个我在https://x.com/Xiaohuihui_BTC/status/2051668393607172202?s=20

openclaw 的教程中有写关于服务器的优惠办法

云端服务价格，基本二十块钱一个月差不多了

选能连接 npm、GitHub、模型 API 和目标聊天平台的 Linux 环境。

先确认连接，再决定是否长期续费。

云端的步骤仍然是：准备 Node.js 与必要依赖、安装 DSH、配置模型、安装插件、绑定平台、测试收发。Windows 命令里的 `.cmd`、用户路径和 PowerShell 语法不能原样复制到 Linux。

迁移时建议这样做：

1. 在服务器上使用单独的普通用户和专用工作目录，按官方说明安装 Node.js 与 DSH。
2. 在服务器上启动 Web UI，通过 SSH 隧道从自己的电脑访问。
3. 重新配置模型与插件，逐个完成账号绑定和测试。
4. 验证正常后，再用系统服务管理程序设置后台运行、故障重启和开机启动。
5. 检查重启后机器人是否仍能回复；同时保留日志和费用上限。

SSH 隧道示例，在自己的电脑上执行，将用户名和服务器地址替换成自己的：

```
ssh -N -L 13080:127.0.0.1:3080 用户名@服务器地址
```

随后在自己电脑的浏览器打开 http://127.0.0.1:13080，访问服务器上已经运行的 DSH。

这个隧道只负责访问界面，不负责让 DSH 长期运行。

PS：不要为了打开界面，直接把带文件和命令能力的 DSH 管理端口向整个公网开放。QQ、微信的消息连接和管理页面的公开访问是两回事。

这一节是云端升级路线。先按前面的 Windows 步骤完成一次收发和日报测试，再根据实际服务器系统落实安装及后台服务配置。

## 部署完成后检查这些结果

- 本地浏览器能打开 DSH。
- 选好工作区和模型，能得到正常回答。
- 选择的 QQ 或微信入口能够收发消息。
- 如果安装了 B 站插件，能够手动生成一份日报。
- 知道如何启动、停止程序，以及到哪里查看报错。
- 人设、实际工具权限、公开互动开关都已经核对。
- 重启程序后再次测试，确认配置仍然有效。

做到这里，就完成了自己的第一套“大肥鱼”部署。接下来可以根据真实使用情况调整关键词、人设和自动化任务。

## 项目和文档入口：

- [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/deepseek-harness)
- [DSH 启动和工作区说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/index.zh.md)
- [DSH 模型配置说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/providers.zh.md)
- [dsh-im 社区消息插件](https://github.com/xmanrui/dsh-im)
- [腾讯 dsh-qqbot 专用 QQ 插件](https://github.com/tencent-connect/dsh-qqbot) 可以作为另一条 QQ 接入路线，不必和本文的 dsh-im 重复绑定同一机器人。
- [B 站筛选插件](https://github.com/c1overzz/dsh-bili-scroll)
- [B 站插件发布包](https://github.com/c1overzz/dsh-bili-scroll/releases/latest)
- [微信渠道相关文档](https://docs.openclaw.ai/zh-CN/channels/wechat)

## 相关页面

- [[sources/xiaohuihui-deepseek-dafeiyu-deployment-monetization]]
- [[concepts/deepseek-harness-agent-formula]]
- [[patterns/dsh-four-modes]]
- [[sources/aaronyi-internal-world-productivity]]

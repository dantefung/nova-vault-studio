---
title: "高强度用了一天 Deepseek Harness 有兴奋有悲伤"
date: "2026-08-14"
source: "微信公众号：nigo"
url: "https://mp.weixin.qq.com/s/08sfYIXm3JFChd0lfxVXZA"
---

# 高强度用了一天 Deepseek Harness 有兴奋有悲伤

![DeepSeek Harness](images/one-day-dsh-experience/001.jpeg)

昨天 deepseek 发布了它的 harness ，如果大模型是马的话，那 harness 就是缰绳、马鞍，调度约束大模型进行工作。

## 安装

![安装指引](images/one-day-dsh-experience/002.jpeg)

https://www.deepseek.com/harness/zh/

如果你安装过 node 的话，在终端运行命令：

```bash
npx @deepseek-ai/dsh web
```

就直接安装好，会给你一个本地的网址，在浏览器打开：

![Web UI](images/one-day-dsh-experience/003.jpeg)

之前用过 Pi Agent ，它就是把各种 tools 作为 extention 来加载，本身非常简洁。

而 deepseek harness (简称：dsh ) ，更激进：**一切皆是插件。**

即使才发布一天，我发现它也有不少内测时开发的插件可用，我尝试装了几个插件，只需要说需求，它就可以找到，一句话帮我安装，

![插件安装](images/one-day-dsh-experience/004.jpeg)

比如，可以多 agent 调度的 agentTeams，可以让 deepseek 读图的 dsh-plugin-deepeye，甚至还有直接写 dsh 插件的 skill，理论上你可以自己想写什么插件都可以。

![AI 审计系统迁移](images/one-day-dsh-experience/005.jpeg)

## 兴奋的事

之前我做的 AI 审计系统，使用的 oh-my-pi 作为 AI 引擎，今天我直接让它读取整个项目，让它写迁移成用 deepseek harness 作为引擎。

### 长时任务

![长时任务](images/one-day-dsh-experience/006.jpeg)

写完方案和我确认后，它自动使用 `/goal` 设定完成方案任务作为目标，跑了一整天，中间没有停顿地完成了迁移，大概输入 token 花了 6 亿，用 deepseek v 4 flash 直接帮我完成了。

我感觉比 glm 5.2 效果都好多了。

命中缓存 100%，其实我都不理解它的 100% 是什么意思了，因为你在其它 AI 工具里用 deepseek 一般命中缓存大概在 96%-99% 之间。而在 dsh 中直接是 99% 以上，多轮对话后，必定命中缓存显示 100% 。

### 速度快

![速度对比](images/one-day-dsh-experience/007.jpeg)

很明显感觉速度非常快，即使使用相同的 deepseek v4 flash 模型，比我在 opencode 中感觉要快一点。

### 极便宜

dsh 是非常开放的，可以直接接入常用的 AI coding plan 或者 api：

![API 配置](images/one-day-dsh-experience/008.jpeg)

我配置上 opencode-go 订阅，首月 5 美元，次月 10 美元，过了首月也可以淘宝，不到 30 元人民币。你可以全天使用 deepseek v4 flash ，也使用不完它的额度，而且我感觉在 dsh 中使用 flash 模型可以达到 glm 5.2 的效果，要知道我订阅 glm coding plan 每个月是 400 元（max 用户），速度慢不说，还额度不够用。

![Token 用量](images/one-day-dsh-experience/009.jpeg)

比如我今天几个窗口一起开着，跑一天，其中一个重构任务还花了 6 亿多 token 的情况下，只使用了一个月 3% 的额度，你正常用，根本用不完。

这可能是目前我感觉，最具性价比的方案。

通过我的邀请码订阅 opencode go（可以使用支付宝付款），我们双方可以获得额外 $5 的使用额度：

https://opencode.ai/go?ref=CRGDXX1P4N

![性价比对比](images/one-day-dsh-experience/010.jpeg)

价格、速度、质量不可能三角中，我感觉在 dsh + opencode go 订阅完美得到平衡，在目前 AI coding plan 大幅涨价的今天，十分难得。

其实最让我兴奋的事，还是它的生态，基于它一切皆插件的架构，再加上中国人的聪明智慧和开源生态，相信将来的插件生态会无穷丰富，可玩性会非常高。

## 悲伤的事

![WorkBuddy 对比](images/one-day-dsh-experience/011.jpeg)

今天看到同事用 workbuddy，发现 skill 管理分发、office 文档实时操作等这些功能都有的时候，感觉我之前的系统白写了，真是随时大厂搞的功能都可以把你之前写的替代掉。

我感觉我随时都可以被替代掉，失业…

![AI Agent 工具](images/one-day-dsh-experience/012.jpeg)

当然，我还是建议应该学习一个通用的 AI Agent 工具，你可以学习到更多东西，而且是相通的，**学会手动档，然后会自动档。**

---

以下是个人广告：

我的 AI Agent 课程网址：

https://m.tenclass.cn/channel2/1880290

或者扫描二维码：

![课程二维码](images/one-day-dsh-experience/013.jpeg)

大纲和试听也通过上面二维码进入课程查看。

目前是优惠价 899 元，最近我再更新几节 deepseek harness 和过时的内容后恢复 1299 元。

![课程信息](images/one-day-dsh-experience/014.jpeg)

购买后加助理，备注：已购买，发送购买截图，加入答疑群。

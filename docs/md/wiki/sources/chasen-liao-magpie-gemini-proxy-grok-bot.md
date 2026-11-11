---
title: "Chasen：Magpie 反代 Gemini Pro + Grok Bot 的省额度玩法"
date: "2026-10-29"
source: "X/Twitter"
author: "Chasen (@chasen_liao)"
url: "https://x.com/chasen_liao/status/2120177161311297913"
---

# Chasen：Magpie 反代 Gemini Pro + Grok Bot 的省额度玩法

> 小号订 Jio Gemini Pro，VPS 上用 Magpie 反代，只监听 Tailscale 内网地址不开公网端口，CCW 接入本地 Pi，再接 Grok Bot：Bot 只负责拆任务和验收，执行全部走 Gemini 额度，一份订阅两处用。注意不要在 Grok Bot 的电脑上用 Antigravity/Codex 订阅账号（IP 拥挤导致模型不可用）。

<!-- more -->

Magpie 真的是个很伟大的东西，还不会用的真的可惜了

介绍一下我的玩法：

1. 小号订了 Jio 的 Gemini Pro，在我的 VPS 上用 Magpie 把它反代出来
2. Magpie 只监听 Tailscale 内网地址，不开任何公网端口，等于一条私人局域网 API
3. 通过 CCW 接入本地的 Pi
4. Grok Bot 也接上了：Bot 只负责拆任务和验收，具体执行全部丢给 Pi，跑完用 webhook 把 Bot 叫醒来检查

最后的效果：

Gemini Pro 订阅 → Magpie 反代（VPS）→ Tailscale 内网 → Pi → Grok Bot

一份订阅额度，本地 agent 和 Grok Bot 一起用

Grok Bot 的额度只花在「想」和「验收」上，「干活」全走 Gemini 的额度，省了一大截

这个后面出一期详细教学😁

这里要注意 不要在 Grok bot 的电脑上面去使用 antigravity 或者说 Codex 这些订阅账号

因为它的那个 IP 会比较拥挤 所以有的时候会出现模型不可用的情况 最好就不要在那上面搞动作



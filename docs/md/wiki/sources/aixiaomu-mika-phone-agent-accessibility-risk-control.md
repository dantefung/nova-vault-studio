---
title: "黄小木（@ai_xiaomu）：王赞开源 Mika 手机端常驻 Agent 评测与风控防封提醒"
date: "2026-11-03"
source: "X/Twitter"
author: "黄小木 (@ai_xiaomu)"
url: "https://x.com/ai_xiaomu/status/2116908621980369044"
---

# 黄小木（@ai_xiaomu）：王赞开源 Mika 手机端常驻 Agent 评测与风控防封提醒

> 王赞开源 Mika 真正的 Phone Agent（免 Root 无障碍常驻、操作任意 App、内置仿人浏览器与 Linux 沙箱）深度评测，及黄小木关于自动化控制微信和小红书的风控告诫：必须用 Codex 反编译源码更改包名与 Service 名，防范平台特征检测脚本批量封号。

<!-- more -->

提个醒：

玩 mika 控制微信 &amp; 小红书玩的爽的同学，记得用 codex 反编译一下源码，把包名+service 名换了。

明天风控组一上班，读一下源码上个脚本，你们的号就全部阵亡了，别怪我没提醒😌

好方案，利用 AccessibilityService + 大模型 api 实现手机后台的常驻 agent 服务，不过得在不同 rom 里设置保活，按华为的尿性很快就会 kill 掉这个权限过高的服务。

还有点就是隐私权限的问题了，比如你和海王 a 的聊天 agent 给你发给海外 b 了。

## 相关页面

- [[sources/myleafy-phongent-local-device-cluster-control]]
- [[concepts/generic-agent]]
- [[concepts/agent-skill]]

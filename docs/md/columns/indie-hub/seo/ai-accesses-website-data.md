---
title: "AI 访问网站数据：Google Cloud 权限配置详细教程"
date: "2026-09-29"
source: "快资料"
url: "https://fastbs.eu.org/ai-accesses-website-data"
---

# AI 访问网站数据：Google Cloud 权限配置详细教程

> 把独立站的搜索词、流量和询盘数据接给 AI，让 AI 能直接调数据帮你挑词、看哪个页面带来了真实询盘。

## 1. Google 必须开的三个 API

- **Google Search Console API**：查关键词、展现量、点击和平均排名
- **Google Analytics Data API**：查访客、浏览量等流量报表
- **Google Analytics Admin API**：读取 GA4 账号和媒体资源的配置（最容易漏掉）

> 注意：API 点了启用后，后端通常有一两分钟的生效延迟。

## 2. OAuth 同意屏幕，必须加上"测试用户"

用户类型选"外部"，应用名称和联系邮箱随便填。

**关键**：必须在"测试用户"列表里手动添加你的个人 Gmail 邮箱，否则会报"应用处于测试模式"错误。

## 3. 创建 OAuth 客户端，拿到带 secret 的凭据

类型选"OAuth 客户端 ID"，应用类型选"桌面应用"。下载 `client_secret_xxxx.json`，放到项目根目录 `secrets/` 文件夹，添加到 `.gitignore`。

## 4. 建服务账号，拿到授权邮箱

建好后下载 JSON 私钥文件，重命名为 `google-sa.json`，放到 `secrets/` 文件夹。

**授权邮箱**形如 `mysite-gsc-reader@项目名.iam.gserviceaccount.com`，复制备用。

## 5. GSC：必须选域名资源，填入服务账号邮箱

在 Search Console 里选中**域名资源**（不带 https:// 的纯域名），在"用户和权限"里添加服务账号邮箱，权限给"受限"。

## 6. GA4 加权限

在"账号访问权限管理"加服务账号邮箱：
- 想让 AI 拉报表 → **查看者（Viewer）**
- 想让 AI 分析询盘转化 → **营销者（Marketer）**

## 7. 别漏了核心转化：标记 rfq_submit / generate_lead

在 GA4 → 管理 → 数据显示 → 事件，把询盘提交事件标记为**关键事件（Key event）**。

这样 AI 才能把 GSC 搜索词和 GA4 联动起来，分析哪个搜索词询盘转化率最高。

## 8. 防自己测试数据污染 GA4

最彻底的办法：利用 Cookie 同意机制，Decline 追踪，本地浏览器不会加载 GA4 代码。

## 9. 别给 AI 喂错 ID

- `G-` 开头的衡量 ID → 前端收集数据用
- 纯数字（如 `123456789`）→ **媒体资源 ID（Property ID）**，AI 调 API 用这个

## 10. 为什么还要接 Bing 站长平台？

Bing 是 **ChatGPT Search 的搜索数据源**，B2B 工业品长尾词在 Google 显示搜索量为 0，但在 Bing 有轨迹的话，大概率在 ChatGPT 搜索里也会呈现。

Bing 有 IndexNow，每次部署自动推送 URL 到 Bing/Yandex/Naver，新内容当天可被发现。

## 11. Bing 调数据：一串 API Key 直接调

直接在后台设置里生成 API Key，保存到 `secrets/bwt-key.txt`，AI 发 HTTP 请求就能调取数据，比 Google 简单很多。

---
title: "学会这样部署出海游戏站，每年帮你省下几千上万"
date: "2025-10-14"
source: "微信公众号"
author: "易焘"
url: "https://mp.weixin.qq.com/s/fnrZhT2oxLsOLs2kmvNAdg"
---

# 学会这样部署出海游戏站，每年帮你省下几千上万

> 用 Cloudflare 免费部署静态游戏网站，不需要服务器费用，也不需要 Vercel Pro 套餐。

## Step 1：添加网站并切换 DNS

登录 Cloudflare，点击"Onboard a domain"添加域名。选择免费套餐（不限量 L7 DDoS 防护、WAF、免费 SSL、全球 CDN）。Review DNS 记录时，删除不相关的旧解析记录。

## Step 2：切换 Name Servers

在域名注册商（Namecheap/阿里云/Sav.com 等）中将 Nameservers 改为 Cloudflare 提供的两个。修改后等待生效（几分钟到几小时不等）。

## Step 3：在 Cursor 中提交项目到 GitHub

在 Cursor 中初始化 Git 仓库 → Commit → Publish Branch。注意仓库设为 **Private**，不要公开。

## Step 4：在 Cloudflare Workers 中部署项目

回到 Cloudflare 首页 → Workers & Pages → Pages 页面 → 导入 GitHub 仓库 → 自动编译部署。

## Step 5：绑定自定义域名

进入项目 → Custom domains → 输入域名（先根域名，后带 www 的二级域名）。Cloudflare 自动配置 SSL，网站即可通过域名访问。

## 总结

完整流程：域名切换 CF Nameserver → 代码提交 GitHub → Cloudflare Pages 部署 → 绑定域名。全程免费，适合静态游戏站批量部署。
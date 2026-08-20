---
title: "一个让独立产品更正规的免费小功能：Cloudflare 域名邮箱转发"
date: "2026-06-28"
source: "苏打 da 汽水"
url: "https://mp.weixin.qq.com/s/wZVAjNNBjsDH6j7Tp3Stmg"
---

# 一个让独立产品更正规的免费小功能：Cloudflare 域名邮箱转发

> 做独立产品时，有一个很小但挺有用的细节：不要在 Terms of Service、Privacy Policy 或 Contact 页面里直接放个人 Gmail。

大多数正规产品都会留两个邮箱：

- `legal@yourdomain.com`
- `support@yourdomain.com`

这不代表你必须先注册一家公司，也不代表你一开始就要买 Google Workspace、Microsoft 365 或 Zoho Mail。你真正需要的是一个自己的域名，以及一个能处理这个域名邮件的服务。

如果产品还在早期，只是想接收用户反馈、法律联系或平台通知，**Cloudflare 的 Email Routing 就够用了**。用户发邮件到 `support@yourdomain.com`，Cloudflare 会把它转发到你指定的邮箱（如 Gmail）。

## 它免费吗？

Email Routing 在 Workers Free 和 Workers Paid 计划里都可以使用。**只做收信转发这个场景，可以免费用。**

注意区分：Email Routing 负责收信和转发。Cloudflare 还有 **Email Sending**（用 REST API、Workers 或 SMTP 发邮件，适合验证码、通知、交易邮件），那是另一套能力。

## 前提条件

有自己的域名，并且域名在 Cloudflare 账号里管理。开启 Email Routing 时，Cloudflare 会给域名配置 MX、SPF、DKIM 等 DNS 记录。

> 如果没有域名，先买一个，再把域名接入 Cloudflare。

## 限制

| 项目 | 限制 |
|------|------|
| Routing rules | 每个域名最多 200 条 |
| Destination addresses | 每个账号最多 200 个 |
| 单封入站邮件 | 最大 25 MiB |

对独立开发者来说，200 条规则基本够用。常见的就这几个：

- `support@yourdomain.com`
- `legal@yourdomain.com`
- `contact@yourdomain.com`
- `hello@yourdomain.com`

## 怎么设置？

1. 在 Cloudflare Dashboard 进入 **Compute > Email Service > Email Routing**
2. 选择域名，点击 **Onboard Domain**
3. 让 Cloudflare 添加需要的 DNS 记录
4. 添加一个 Destination Address（如 Gmail）
5. 去 Gmail 里点 Cloudflare 发来的验证邮件
6. 创建 routing rule（如把 `support@yourdomain.com` 转发到 Gmail）
7. 用另一个邮箱发信测试

![配置界面](images/cloudflare-email-routing/001.png)

> 测试时不要用同一个 Gmail 自己给自己发。最好用另一个邮箱发到 `support@yourdomain.com`，再看 Gmail 是否收到转发邮件。

![验证邮件](images/cloudflare-email-routing/002.png)

## 一个重要限制

Email Routing 只能解决收信和转发。你在 Gmail 里回复时，发件人会是 Gmail，**不会自动变成** `support@yourdomain.com`。

如果需要真正用 `support@yourdomain.com` 发信和回复，可以看 Cloudflare Email Sending，或直接上 Google Workspace / Zoho Mail / Fastmail。

## 总结

> 早期产品、个人项目、还在验证阶段的工具站，先用 Cloudflare Email Routing。免费、配置简单、够正规。等真的有大量客服邮件、团队协作、发信需求时，再升级完整邮箱服务也不迟。

## 参考资料

- [Cloudflare Route emails 文档](https://developers.cloudflare.com/email-service/get-started/route-emails/)
- [Email routing rules and addresses](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)
- [Pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Limits](https://developers.cloudflare.com/email-service/platform/limits/)
- [Postmaster](https://developers.cloudflare.com/email-service/reference/postmaster/)
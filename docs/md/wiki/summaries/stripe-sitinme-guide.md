---
title: "sitin：出海网站 Stripe 支付接入实战——从 0 到收款全流程"
date: "2026-09-16"
source: "X/Twitter"
url: "https://x.com/sitinme/status/1998943804930535495"
---

# sitin：出海网站 Stripe 支付接入实战——从 0 到收款全流程

## 核心结论

从注册账号到 Webhook 配置，26 张截图完整覆盖 Stripe 接入网站支付的实操全流程。核心流程：后端创建 Checkout Session → 跳转 Stripe 支付页 → 用户付款 → Stripe Webhook 通知服务器 → 更新订单状态。

## 关键步骤

1. **账号注册**：dashboard.stripe.com，测试模式（URL 含 /test）和生产模式切换只需加/去 /test
2. **API 密钥**：公钥 pk_ 开头（放前端），私钥 sk_ 开头（放后端，绝不提交代码）
3. **本地测试 Webhook**：用 Stripe CLI `stripe listen --forward-to localhost:3000/webhook`，每次重启生成新 secret
4. **测试卡号**：4242 4242 4242 4242，任意未来日期，任意 3 位 CVV
5. **正式环境 Webhook**：Dashboard → Developers → Webhooks → Add destination → 选 checkout.session.completed → 填入你的 HTTPS endpoint
6. **生产密钥**：创建受限密钥（restricted API key），按业务需要配置最小权限
7. **常见坑**：
   - Webhook 验签失败：本地用 CLI 的 secret，线上用 Dashboard 的，别搞混
   - 金额单位：美元以"分"为单位，$39 要传 3900
   - 测试期设优惠码降低税负（3% + $0.3/笔）

## 与 noahduck283 指南的关系

sitin 是 noahduck283 全指南中"第三部分（Payment Links/Invoice/Checkout 怎么选）"和"第七部分（Webhook 设计）"的实操补完版。noahduck283 讲为什么，sitin 讲怎么做。

## Related Pages

- [[sources/stripe-noahduck283-guide]] — Stripe 全网最全使用指南
- [[sources/stripe-x-account-setup]] — nemo 的 Stripe 香港个人账户注册
- [[sources/google-seo-ranking-factors-2026]] — 2026 Google 排名因素调查

## Sources

- [[sources/stripe-sitinme-guide]]

---
title: "Zon（@zonperez1）：我搭了一支 10 个 Grok Bots 的团队——广告上线 24 小时就拿到 Shopify 首单"
date: "2026-10-29"
source: "X/Twitter"
author: "Zon (@zonperez1)"
url: "https://x.com/zonperez1/status/2108754928982487289"
coverImage: "../images/zonperez1-10-grok-bots-shopify-first-sale/001.jpg"
---

# Zon（@zonperez1）：我搭了一支 10 个 Grok Bots 的团队——广告上线 24 小时就拿到 Shopify 首单

> 零雇主的作者靠一支 10 个 Grok bot 的团队上线 Shopify 店：10 月 3 日晚上发布 Meta 广告，次日下午收到 Order #1001（$35.00，1 item from Online Store），距广告上线约 24 小时，从第一次调研到首单共两周，此前已有两个产品点子被判死。他定三条规则：一个 bot 一条 lane；bot 之间只读不改（firewall，要改得问 owner）；自己只做审批，每条消息只要 options 加一个 recommendation 加一个 reason，回 LOCK / REVISE / REJECT / HOLD，全队共用一个群聊且只发 STATUS / HANDOFF / APPROVAL 三种消息。10 个 bot 依次是 Coordinator、Product Researcher（用 Apify 拉销量与 1 星/5 星评论）、Unit-Econ Screener、Brand Expert、Packaging Designer（Higgsfield）、Creative Strategist、Sourcer（Alibaba RFQ 与 Trade Assurance）、Meta Smoke Lead、CRO bot、Journey PA（每天记决策与教训，本文所有日期都来自它的日志）。8 步流程：Apify 挖需求（每个抱怨主题留 3 条原始买家引语、不转写）；花钱前守住 unit economics（GO / GO WITH BUNDLES / NO-GO，并把 breakeven ad cost 写成数字）；锁定品牌名与 claims list 再写任何文案；Higgsfield 做包装（一条消息一张图、每次拒绝给一个理由，他为此拒了数个方向花了三天）；Alibaba 询价（同一份 RFQ 发给所有供应商，拿到真实报价与精确尺寸前不付定金）；Shopify 单页设为首页（Namecheap 域名、5 张 gallery、让第二个 bot 做图片 QA）；10 条低文字静态广告各打一个理由（图上不超过 7 个词）；一个 campaign 一个 broad ad set 十条广告一个页面（每条挂 UTM、先验 Shopify Pixel，全程 paused 到他发布）。文末给出 5-bot 起步配置、上线前移动端 checklist，以及可整份复制的 Unit-Econ Screener setup，三条公式为 CM = AOV − landed unit cost − packaging − shipping to customer − payment fees − discounts、Breakeven CAC = first-order CM、Required landing→purchase rate = cost per landing page view ÷ CM，并用自认的假设数字举例：$40 单品毛利约 $22、按 $1.80 每次落地页浏览约需 1/12 访客下单才回本，$100 三件组合毛利约 $58、同流量成本下只需约 1/32，因此 bundle 与高价档应为默认 offer。

<!-- more -->

I have zero employees.

I launched a Shopify store with a team of 10 Grok bots anyway.

One researched. One did the math. One designed the pack. One wrote the ads. One built the campaign.

I just approved.

I pressed publish on my Meta ads at night.

The next afternoon: “Order #1001. $35.00, 1 item from Online Store.”

My first sale. About 24 hours after the ads went live.

Here’s the exact team, the 8 steps, a 5-bot starter you can run yourself, and one full bot setup you can copy today.

## Why one bot per lane

Two weeks from first research run to first order.

Early on I tried “one smart assistant for everything”. It drifted. It guessed numbers. It rewrote things I had already approved.

So I set three rules:

- One bot, one lane. Each bot owns one job. Narrow job, better output. When something breaks, I know whose lane it came from.
- Firewalls. A bot can read another bot’s work. It can’t change it. It has to ask the owner.
- I only approve. Bots send one decision per message: options, a recommendation, one reason. I reply LOCK, REVISE, REJECT or HOLD.

All bots share one group chat. Only three message types: STATUS, HANDOFF, APPROVAL. Nothing gets spent, paid or published without my LOCK.

## The 10 bots

1. Coordinator. Plans, routes work, writes my approval requests. Rule: never makes my decisions.
2. Product Researcher. Demand data and review mining in Apify. Rule: can’t approve a product or send ideas straight to me.
3. Unit-Econ Screener. Order value, margin, breakeven ad cost. Rule: never bends an input to make an idea pass.
4. Brand Expert. Name, voice, positioning, claims list. Rule: no claims without proof.
5. Packaging Designer. Pack and product visuals in Higgsfield. Rule: no flat mockups, and no scenes before the pack is locked.
6. Creative Strategist. Angles, hooks, briefs, the 10-ad set. Rule: no claims off the list, no building campaigns.
7. Sourcer. Alibaba RFQs, samples, Trade Assurance. Rule: never pays without my LOCK.
8. Meta Smoke Lead. Builds and reads the ad test. Rule: never publishes or raises budget alone.
9. CRO bot. Mobile and desktop page fixes. Rule: can’t touch price, offer or claims.
10. Journey PA. Writes a daily journal of decisions and lessons. Rule: never instructs other bots.

The Journey PA sounds like a nice-to-have. It isn’t. Every date and lesson in this article comes from its journal.

## The 8 steps from idea to first sale

Two product ideas died before the one that sold. That’s the system working, not failing.

## 1. Research demand with Apify

The Researcher ran Apify on marketplaces and pulled sold counts, then 1-star reviews (the pain) and 5-star reviews (the words buyers use for “good”).

Tip: keep 3 raw buyer quotes per complaint theme. Don’t paraphrase. Your best product page copy is already written in those reviews.

## 2. Gate the unit economics before any spend

The Screener checks order value and first-order margin. GO, GO WITH BUNDLES or NO-GO.

Tip: write your breakeven ad cost down as a number before you fall in love with a product.

## 3. Lock the brand and the claims list

The Brand Expert proposed names. I locked one name and one line. Then it published a claims list: what we can say, what we can’t.

Tip: do the claims list before any copy or ads. Every other bot checks its work against it.

## 4. Packaging in Higgsfield

This took the most rounds. I rejected or skipped several design directions over three days before I locked one pack.

Tip: one image per message, one reason per rejection (“REJECT: looks like a flat mockup”). And don’t render lifestyle scenes until the pack is locked. Every pack change breaks every scene.

## 5. Sourcing on Alibaba

The Sourcer wrote one RFQ and sent the same text to every supplier: dimensions with tolerance, material, quantity tiers, samples, lead time.

Tip: no deposit until you have real quotes and exact dimensions. Run the ad test on a pre-order page while sourcing is still moving. Don’t wait for stock to find out if anyone wants it.

## 6. The Shopify product page

One pre-order product page, set as the homepage. Every ad lands there. Custom domain from Namecheap. Five gallery shots, one idea per infographic.

Tip: have a second bot QA every image. My Creative Strategist caught a stray word baked into one product image before it went live.

## 7. Ten ads, ten angles

Ten low-text static ads, each with a different reason to buy: pain, named feature, cost per use, comparison, ritual, identity, simplicity, risk reversal, bundle value, looks.

Tip: 7 words or fewer on the image. One idea per ad. If you can’t say it in 7 words, it’s two ads.

## 8. Build the Meta test and launch

One campaign, one broad ad set, ten ads, one page. UTMs on every ad, Shopify Pixel checked first. The bots tried to build it through an ads connector, but my region needed advertiser fields the API couldn’t set. So the Smoke Lead gave me the spec and I built it by hand in Ads Manager. Everything paused until I published.

I published on the night of 3 October. The first order came the next day.

Tip: write your kill rules before launch, and don’t touch the campaign for the first 24 hours.

## Run it yourself: the 5-bot starter

You don’t need all 10 bots on day one. Start with five and add the rest as you go.

1. Coordinator. Give it your goal, market and currency. It turns every decision into one message for you: options, a recommendation, one reason.
2. Product Researcher. Ask it for 10 product types, then sold counts and 1-star and 5-star reviews for the top 3 competitors of each. Output: one wedge card per idea (pain, fix, positioning).
3. Unit-Econ Screener. The setup is below. Nothing gets ad spend until it says GO.
4. Creative Strategist. Ten angles from the review themes. One low-text image per angle, 7 words or fewer.
5. Meta Smoke Lead. One campaign, one broad ad set, ten ads, one product page. Built paused. You publish.

Then use this mobile checklist on your product page before you launch:

- A sticky buy button with a clear label
- Free shipping, or the shipping cost shown before checkout
- 2–3 trust lines under the button
- A clear pre-order or stock line, and no delivery promise you can’t keep

Your rules for the whole team: one bot, one lane. Bots can read each other’s work but can’t change it. Nothing gets spent, paid or published without your LOCK.

## The giveaway: my full Unit-Econ Screener setup

This is the bot I’d build first. It checks if a product can pay for its own ads before you spend a dollar on Meta.

Paste the shared rules plus this setup into a new Grok bot. Replace every `[FILL-IN]` first.

```text
SHARED TEAM RULES
You are one bot in a team of Grok bots building a DTC ecommerce brand for [FILL-IN: founder name].
Market: [FILL-IN: market / country]. Currency: [FILL-IN: currency]. Store: Shopify. Ads: Meta.
1. One bot, one lane. Do only the work in your lane.
2. Firewall: you may READ any locked output. You may not CHANGE another bot's output. Ask its owner.
3. The founder only approves. Ask for one decision per message: options, your recommendation, one reason.
4. Never spend money, publish, pay, or contact third parties without a founder LOCK.
5. Post in the group chat using only: STATUS, HANDOFF, APPROVAL.
6. Locked items change only after a founder REVISE.
7. Claims: soft claims only. No medical claims. No % claims. No invented science.
8. Write plain, short sentences. Use tables for numbers.
9. If you are unsure or blocked, say so. Do not guess facts or numbers.

ROLE: Meta Unit-Econ Screener.
MISSION: Gate every wedge card on average order value and first-order contribution margin, before any ad spend.
CONTEXT: Currency: [FILL-IN]. Minimum AOV: [FILL-IN]. Assumed cost per landing page view: [FILL-IN: your own estimate or test data]. Payment fee: [FILL-IN: % + fixed]. Shipping to customer: [FILL-IN].

LANE (you own): The unit-economics model and the gate result.
FIREWALL (you must not):
- Change any input to make an idea pass. Flag the gap instead.
- Approve a product. You recommend; the founder decides.
- Invent supplier costs. Use Sourcer quotes or a clearly labelled range.

FORMULAS:
Contribution margin (CM) = AOV − landed unit cost − packaging − shipping to customer − payment fees − discounts
Breakeven CAC = first-order CM
Required landing→purchase rate = cost per landing page view ÷ CM

WORKFLOW:
1. For each wedge card, model a single unit, a bundle of 3 and a bundle of 6.
2. Compute CM, breakeven CAC and the required landing→purchase rate for each.
3. Mark any rate that looks unrealistic for a new store.
4. Return one verdict per idea: GO, GO WITH BUNDLES, or NO-GO, with one reason.

OUTPUT: One table per idea (single / 3 / 6 columns) + verdict + the inputs you assumed, labelled.
HANDOFF: Send passed ideas to the coordinator for a founder APPROVAL. Send NO-GOs back to the Researcher with the reason.
APPROVAL RULES: The founder approves one product from GO / GO WITH BUNDLES ideas.
DONE WHEN: Every wedge card has a verdict and the founder has approved or held.
```

What the gate looks like (made-up numbers):

- Single at $40: margin about $22. At $1.80 per landing page view, about 1 in 12 visitors must buy just to break even.
- Bundle of 3 at $100: margin about $58. Same traffic cost, only about 1 in 32 visitors need to buy.

Same ads. Very different hurdle. That’s why bundles and premium tiers should be your default offer.

## That’s the whole system

One founder. Ten bots. One lane each. I only approved.

Start with the Screener. Then go get your first win, and tell me when you do.

## 相关页面

- [[patterns/multi-agent-architecture]]
- [[patterns/orchestrator-pattern]]
- [[concepts/multi-agent]]

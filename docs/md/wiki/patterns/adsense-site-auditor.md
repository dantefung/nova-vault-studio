---
title: "AdSense 审计 Skill"
date: "2026-08-08"
source: "web.cafe 社群"
---

# AdSense 审计 Skill

## 一句话

把 Google AdSense 官方审核文档喂给 Codex/Claude，构建一个 `@adsense-site-auditor` Skill，自动审计网站是否符合 AdSense 申请要求，通过反复审核迭代直到通过。

## 核心思路

- 把 AdSense 官方文档发给 Codex/Claude 反复修改相互审核，直到完全达到审核要求
- 内容页面要做深，一般两三次提交审核就会通过
- 每次审核不通过就再增加内容深度和更多页面

## 五种审计场景 Prompt

1. **Full Website Audit**：逐项检查所有 ADS-* 要求，输出 Pass/Fail/Unknown/N/A 完整表
2. **Live URL Only**：只基于线上可访问页面审计，需抓取首页/robots.txt/sitemap/隐私政策/About/Content
3. **Repo Plus Live Site**：结合本地代码仓库和线上站点，检查模板/路由/内容来源
4. **Post-Rejection Diagnosis**：将拒审信息映射到 ADS-* 要求 ID，给出优先级修复清单
5. **Post-Fix Verification**：复审已修复项，输出 Ready / Ready after fixes / Not ready

## 输出要求

- 逐项覆盖所有 ADS-* 检查项，不允许给摘要或省略
- 每项标记 Pass/Fail/Unknown/N/A
- 输出 Blocker/High/Medium 风险等级 + 证据 + 修复建议
- 最后做 Completeness Check

## 与已有知识的关联

- 与 [[gefei-seo-keywords]] 相关：AdSense 是 SEO 建站的变现环节，审核通过是上线的关键里程碑
- 与 [[indie-site-builder-skill-stack]] 相关：AdSense 审核是独立站变现的必经关卡
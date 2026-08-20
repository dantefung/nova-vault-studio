---
title: "OpenAI 开源的这个安全插件，是每个 Vibe Coding 的人都必装的神器"
date: "2026-08-08"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/koVsKEyae9grJqrGtsln9g"
---

# OpenAI 开源的这个安全插件，是每个 Vibe Coding 的人都必装的神器

> Vibe Coding 把产品门槛打下来了，但安全是很多人忽略的一环。OpenAI 开源了 Codex Security——一个会自己读代码、找漏洞、验证风险、提修复方案的 AI 安全研究员。

## 为什么需要安全？

Vibe Coding 产品越来越多，非开发者也能用 Agent 创造产品并为他人提供服务，但安全被严重忽略。作者上月的 AIHOT 项目被持续攻击（漏洞扫描 → DDoS），每天边看攻击请求边让 AI 防守边恶补安全知识。

![AIHOT 被攻击](images/codex-security/001.jpeg)

## Codex Security 是什么

OpenAI 做的安全插件，帮你扫描系统漏洞、提升产品安全。最早可追溯到 2025 年 10 月 30 日的 **Aardvark**——由 GPT-5 驱动的 Agentic Security Researcher，一个会自己阅读代码、寻找漏洞、验证风险、提出修复方案的 AI 安全研究员。

![Codex Security 界面](images/codex-security/002.png)

### 发展历程

| 时间 | 事件 |
|------|------|
| 2025.10.30 | Aardvark 内测发布 |
| 2026.03.06 | 更名 Codex Security，整合进 Codex，研究预览版 |
| 2026.06.22 | 深度扫描、攻击路径追踪、威胁模型构建等功能上线 |
| 2026.08（上周） | **开源**，外部 Agent 也可调用 |
| 2026.08（昨天） | 加入对 OpenRouter 和 Fireworks 支持 |

![Aardvark 起源](images/codex-security/003.png)
![Codex Security 整合](images/codex-security/004.png)
![深度扫描升级](images/codex-security/005.png)
![开源公告](images/codex-security/006.png)
![OpenRouter 支持](images/codex-security/007.png)

## 安装与使用

在 Claude Code 或其他 Agent 中，直接把 GitHub 链接（https://github.com/openai/codex-security）甩给它，自动下载安装。

![安装过程](images/codex-security/008.png)
![安装完成](images/codex-security/009.png)

### 三种使用方案

1. **Codex 授权登录** — 用 Codex 额度
2. **OpenAI API Key** — 直接使用
3. **OpenRouter 接入** — 调用第三方模型

![三种方案选择](images/codex-security/010.jpeg)
![Codex 登录成功](images/codex-security/011.jpeg)
![开始扫描](images/codex-security/012.png)

## 实际扫描效果

以作者运营同学的项目为例（214 个文件），默认使用 `gpt-5.6-sol`，推理强度 xhigh，耗时 1 小时，花费约 $55 额度。共发现 **21 个安全问题**：

- **高风险 × 1**：系统权限判断问题——虽查询了第二层授权，但放行时未使用该结果，通过 SSO 登录即可直接访问
- **中风险 × 11**：CSV 导出可能被 Excel 识别为公式、报告/语音服务权限和频率限制不够严、API 额度可能被烧
- **低风险 × 9**：报错信息泄露、上传文件检查顺序不合理等

![21 个安全问题](images/codex-security/013.png)
![安全报告可视化](images/codex-security/014.png)
![修复方案](images/codex-security/015.png)

### 降低成本的方案

可降低推理强度，或换成更便宜的模型（如 DeepSeek V4 Flash、Qwen3.8-Max 等）。

![模型选择](images/codex-security/016.png)

## Codex 桌面端插件

Codex 桌面端用户可直接安装 Codex Security 插件调用，更方便。

![Codex 插件](images/codex-security/017.png)

作者用此插件扫描 AIHOT 项目，结果满意——基本没有严重问题，说明之前被攻击时漏洞已补上。

![AIHOT 扫描结果](images/codex-security/018.png)
![AIHOT 安全报告](images/codex-security/019.png)

## 使用第三方模型

通过 OpenRouter 接入，可用 Kimi K3、Qwen3.8-Max、GPT-5.6 Luna、DeepSeek V4 Flash 等。也可用 OpenRouter 的 BYOK 功能用自己的 API 额度。

![OpenRouter 配置](images/codex-security/020.png)
![OpenRouter 密钥配置](images/codex-security/021.png)
![BYOK 功能](images/codex-security/022.png)
![BYOK 配置按钮](images/codex-security/023.png)

## 注意事项

- **扫描结果有波动**：Codex Security 走的是模型推理 + 工具调用 + 漏洞验证路线，每轮探索路径可能不同，结果可能变化。大漏洞大概率不变，中低风险可能单次遗漏。**最稳妥是用两个模型交叉扫一遍。**
- **代码仓库之外的风险**：后端、CDN、WAF、DDoS 防护、日志告警、数据备份等藏在代码仓库之外的问题，它不一定能看到。尤其是 DDoS——超出代码漏洞范畴，得靠 CDN、云防护和限流策略。
- **安全没有一劳永逸**：每次更新代码都可能引入新漏洞（文件上传新入口、新登录方式、AI 能力限流问题）。**定期审查，大功能上线前扫一遍。**

![配置完成](images/codex-security/024.png)
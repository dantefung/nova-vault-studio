---
title: "Claude Skills"
date: "2026-06-08"
source: "Snyk Blog"
url: "https://snyk.io/articles/top-claude-skills-ui-ux-engineers/"
---

# Claude Skills

> Claude 生态的扩展机制 — 包含指令、脚本、模板的目录，支持渐进式加载、可执行代码、跨平台移植。

<!-- more -->

## 一句话定义

**Claude Skills** 是包含 `SKILL.md` 文件（YAML frontmatter + Markdown 指令）的目录，可捆绑脚本、模板、参考文档，通过渐进式披露高效加载，是 Claude 生态中介于"纯提示词"和"完整集成"之间的扩展机制。

---

## 核心特征

| 特征 | 说明 |
|------|------|
| **目录结构** | 非单文件，可捆绑 `scripts/`、`references/`、`assets/` |
| **渐进式披露** | 启动时仅加载 `name` + `description`（~100 tokens），匹配时才加载完整 SKILL.md |
| **可执行代码** | 包含 `scripts/` 目录，Claude 可在执行时运行 |
| **开放标准** | 已被 Claude Code、OpenAI Codex、Cursor、Gemini CLI 采用 |
| **可注册斜杠命令** | 带 `argument-hint` 字段的 skill 可直接 `/skill-name` 调用 |

---

## 与其他扩展机制的区别

| 扩展类型 | 本质 | 特点 |
|----------|------|------|
| **CLAUDE.md** | 持久化项目记忆 | 每次会话自动加载，告诉 Claude 项目规范 |
| **自定义斜杠命令** | 简单提示模板 | 已被 Skills 整合 |
| **MCP Servers** | 运行中的进程 | 通过 Model Context Protocol 暴露工具和数据源 |
| **Claude Connectors** | 外部服务连接 | 通过 OAuth 连接 Slack、Figma、Asana 等 |
| **Plugins** | 分发包 | 打包 skills、agents、hooks、MCP servers |

---

## 三层加载机制

```
第1层：启动时
  └── 仅加载 name + description（~100 tokens/skill）

第2层：匹配时
  └── 加载完整 SKILL.md 指令

第3层：执行时
  └── 按需加载 references/、scripts/、assets/
```

这种设计确保即使安装数十个 skills，上下文窗口也保持精简。

---

## 安装方式

### 项目级（团队共享）

```bash
mkdir -p .claude/skills/{skill-name}
# 将 SKILL.md 和相关文件放入目录
```

### 用户级（个人全局）

```bash
mkdir -p ~/.claude/skills/{skill-name}
```

### 通过插件市场

```bash
claude skills add https://github.com/{org}/{repo}#{path}
```

优先级：企业技能 > 个人技能 > 项目技能。

---

## 面向 UI/UX 的 8 个顶级 Skills

### 创意方向

| Skill | Stars | 侧重 |
|-------|-------|------|
| **Anthropic Frontend Design** | 65,847 | 独特美学，禁止 AI 常用字体/配色套路 |
| **Bencium UX Designer** | 72 | 完整 UX 设计参考，28k+ 字符 |

### 设计智能

| Skill | Stars | 侧重 |
|-------|-------|------|
| **UI/UX Pro Max** | 29,636 | 50+ 风格、97 种调色板、9 种技术栈的设计数据库 |

### 质量合规

| Skill | Stars | 侧重 |
|-------|-------|------|
| **Vercel Web Design Guidelines** | 19,487 | 100+ 规则的 Web 界面审计 |
| **AccessLint** | 8 | WCAG 2.1 无障碍审计 + MCP 服务器 |

### 工程模式

| Skill | Stars | 侧重 |
|-------|-------|------|
| **Vercel React Best Practices** | 19,487 | 57 条性能优化规则 |
| **Vercel Composition Patterns** | 19,487 | 组件架构，反布尔属性泛滥 |
| **Vercel React Native Skills** | 19,487 | 移动端 UI 性能模式 |

---

## 安全注意事项

Snyk 的 ToxicSkills 研究发现：
- 36% 的测试技能存在提示注入漏洞
- 1467 个恶意载荷在生态系统中流通
- 3 行 Markdown 可授予攻击者 shell 访问权限

**安装前检查清单**：
1. 阅读 `SKILL.md` 和所有捆绑脚本
2. 检查来源（知名组织 > 社区贡献者）
3. 审查 `allowed-tools` 权限字段
4. 用 Snyk 扫描脚本
5. 特别警惕包含 Python 脚本的技能

---

## 设计哲学

**核心观点**：AI 不替代设计师判断力，而是释放创造力。

设计师和前端开发者已知但觉得繁琐的任务（搭建无障碍组件变体、检查对比度、审计最佳实践清单、编写响应式布局），Skills 将这些委托形式化。

**最佳实践**：组合多个技能互补而非冲突 — 创意方向 + 设计智能 + 质量合规 + 工程模式。

---

## 相关页面

- [[concepts/agent-loop]] — Agent 工作循环
- [[concepts/prompt-context-harness]] — Prompt 工程进化
- [[sources/claude-cookbooks]] — Anthropic 官方菜谱集
- [[sources/awesome-codex-skills]] — Codex Skills 精选列表
- [[sources/skillshare]] — 跨平台 Skills 同步工具

---

## 信息来源

| 来源 | URL | 访问时间 |
|------|-----|----------|
| Snyk Blog - Top 8 Claude Skills for UI/UX Engineers | https://snyk.io/articles/top-claude-skills-ui-ux-engineers/ | 2026-06-08 |
| Agent Skills Specification | https://agentskills.io/specification | 2026-06-08 |
| Anthropic Skills Documentation | https://code.claude.com/docs/en/skills | 2026-06-08 |
| Snyk ToxicSkills Research | https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/ | 2026-06-08 |

---
title: "熵管理与垃圾回收（Entropy Management）"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# 03 — 熵管理与垃圾回收（Entropy Management）

## 定义

**熵管理**是驭化工程的第三大支柱，指通过持续的自动化扫描和修复，对抗 AI 大规模生成代码时引入的系统性衰退——文档漂移、架构约束违规、代码模式不一致。

> "AI 会像素级地复制仓库中的所有模式，包括你最不希望被复制的那些。"
> — OpenAI Harness Engineering 博客

---

## 问题的本质

### 什么是"代码熵"

当 AI Agent 大规模生成代码时，以下衰退是不可避免的：

1. **文档漂移**：代码变了，但 `AGENTS.md`、`ARCHITECTURE.md` 没更新
2. **模式漂移**：某个新的代码模式（好的或坏的）在 Agent 生成的代码中传播
3. **约束逃逸**：某些架构约束在边缘情况下被绕过，形成"合法的例外"
4. **注释腐烂**：代码注释描述的是旧的行为，与实际代码不符
5. **依赖漂移**：旧的依赖、废弃的 API、已删除的模块仍被引用

### 为什么 AI 放大了这个问题

传统开发中，代码熵缓慢积累。在 AI Agent 驱动的开发中：
- 代码生成速度是人工的 10-100 倍
- Agent 模仿现有模式，坏模式以相同速度传播
- OpenAI 团队发现他们每周花费约 20% 时间清理"AI 垃圾代码"

---

## Drift Scanner（漂移扫描器）

OpenAI 的核心解决方案：每天运行的自动化扫描任务，检测各类漂移并自动开启修复 PR。

### 扫描维度

```yaml
# .github/workflows/drift-scanner.yml
name: Daily Drift Scanner

on:
  schedule:
    - cron: '0 9 * * 1-5'  # 工作日每天上午 9 点
  workflow_dispatch:        # 支持手动触发

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Scan Documentation Drift
        run: npx harness-scanner scan-docs

      - name: Scan Architecture Violations
        run: npx harness-scanner scan-arch

      - name: Scan Pattern Consistency
        run: npx harness-scanner scan-patterns

      - name: Auto-create Fix PRs
        if: failure()
        run: npx harness-scanner create-fix-prs
```

---

## 垃圾回收 Agent

比静态扫描更强大的方案：运行一个专门的 Agent 来执行清理工作。

### 角色分工

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  生产 Agent      │     │  审查 Agent      │     │  GC Agent       │
│                 │     │                 │     │                 │
│ 实现业务功能     │────▶│ 审查生产代码     │────▶│ 清理技术债务     │
│ 开 PR，等待合并  │     │ 检测模式违规     │     │ 修复文档漂移     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### GC Agent 的工作内容

```markdown
# gc-agent-task.md（每周运行）

你是一个垃圾回收 Agent，任务是维持代码库的架构健康。

## 检查清单

1. **文档一致性**
   - 扫描 docs/ 目录，找出描述与代码不符的文档
   - 找出 AGENTS.md 中引用但不存在的文件

2. **模式扫描**
   - 搜索 deprecated 注释，确认相关代码是否已移除
   - 找出 TODO 超过 30 天的注释，评估是否需要创建 issue

3. **依赖健康**
   - 检查是否有仍被使用的已删除模块的引用
   - 检查 package.json 中是否有未使用的依赖

4. **质量指标**
   - 计算本周新增代码的架构合规率
   - 更新 docs/quality-score.md 中的质量分数

## 输出
对每个发现的问题，开一个专注的小 PR 修复。
单个 PR 不超过 3 个文件的改动。
```

---

## "黄金规则" Lint 化

熵管理的长期策略是将"黄金规则"逐步 lint 化——每当 GC Agent 或人工 Review 发现一个反复出现的模式问题，就将其转化为自动化检查规则。

```
发现模式问题
     ↓
手动在这次 PR 中修复
     ↓
将该模式问题写成 lint 规则
     ↓
未来的 Agent 生成代码时会自动被捕获
     ↓
该类问题从"人工发现"变为"机械化预防"
```

### 实例：从 PR Comment 到 Lint 规则

**发现**：代码 Review 发现 Agent 总是忘记给用户输入做 HTML 转义。

**临时修复**：在这次 PR 中手动修复。

**系统化**：
```javascript
// eslint-rules/require-html-escape.js
module.exports = {
  create(context) {
    return {
      JSXExpressionContainer(node) {
        if (isUserInputVariable(node.expression)) {
          context.report({
            node,
            message:
              'Potentially unsafe HTML injection. ' +
              'Use sanitizeHtml(input) before rendering user content. ' +
              'See: docs/security/xss-prevention.md'
          });
        }
      }
    };
  }
};
```

**结果**：这类问题从"人工 Review 能发现"变为"提交时自动阻断"。

---

## 实施的起点

不要等到有问题再开始。推荐从以下两点起步：

### 第一步：建立文档漂移检测

```bash
# scripts/check-doc-drift.sh
# 检查 AGENTS.md 中提到的所有文件是否存在
grep -E '\`[^`]+\.md\`' AGENTS.md | while read -r line; do
  file=$(echo "$line" | grep -oE '[a-z/-]+\.md')
  if [ ! -f "$file" ]; then
    echo "❌ AGENTS.md references missing file: $file"
  fi
done
```

### 第二步：添加 TODO 年龄检查

```bash
# 找出超过 30 天的 TODO 注释
git log --all --oneline --grep="TODO" | while read -r commit; do
  # 检查 commit 日期，超过 30 天的标记
done
```

---

## 下一步

- 了解如何让代码库对 Agent 更友好：→ `04-agent-readability.md`
- 立即开始实施：→ `../practice/4-week-roadmap.md`

---
title: "Pensieve #6：实践指南与对比"
description: 安装配置、日常使用、refine 五问法、三种压缩技术、vs RAG/Vector DB
series: pensieve
part: 6
created: 2026-06-03
---

# Pensieve #6：实践指南与对比

> 📖 [完整可视化版本](/pensieve-deep-dive.html#practice) | [系列索引](./index.md)

## 快速开始

### Step 1: 安装系统代码（全局，一次性）

```bash
# 英文用户
git clone -b main https://github.com/kingkongshot/Pensieve.git ~/.claude/skills/pensieve

# 中文用户
git clone -b zh https://github.com/kingkongshot/Pensieve.git ~/.claude/skills/pensieve
```

### Step 2: 安装 Hooks（全局，一次性）

```bash
bash ~/.claude/skills/pensieve/.src/scripts/install-hooks.sh
```

写入 `~/.claude/settings.json` 的 hook 配置，对所有项目全局生效。

### Step 3: 初始化项目（每个项目）

```bash
cd <your-project>
bash ~/.claude/skills/pensieve/.src/scripts/init-project-data.sh
```

或让 Agent 执行 `init`。

### Step 4: 验证

```bash
bash ~/.claude/skills/pensieve/.src/scripts/run-doctor.sh --strict
```

PASS 条件：
- 技能根包含 `.src/`
- 技能根包含 `SKILL.md`
- `<project>/.pensieve/{maxims,decisions,knowledge,pipelines}` 目录全部存在
- `.state/` 和 `state.md` 已生成
- 默认 pipeline 和 taste-review 知识已播种

## 日常使用

### 开始编码前

Agent 自动通过 `pensieve-wand` 检索项目知识。你不需要手动触发——`explore-prehook.sh` 会在探索前自动注入 Pensieve 上下文。

### Commit 时

`run-when-committing` pipeline 自动运行：
1. 判断是否有值得捕获的 insight
2. 捕获 → 写入 short-term
3. 原子提交

### Refactor 时

`run-when-refactoring` pipeline 引导：
1. 先确认真实问题
2. 先修上游数据权威性
3. 分步交付
4. 新路径工作后删除旧路径

### 定期维护

```bash
# 检查健康状态
bash ~/.claude/skills/pensieve/.src/scripts/run-doctor.sh --strict

# Agent 执行 refine 清理过期条目
# （五问审查 + 压缩）
```

### 更新 Pensieve

```bash
cd ~/.claude/skills/pensieve
git pull --ff-only || { git fetch origin && git reset --hard "origin/$(git rev-parse --abbrev-ref HEAD)"; }

# 更新后验证
cd <your-project>
bash ~/.claude/skills/pensieve/.src/scripts/run-doctor.sh --strict
```

## 重装与卸载

### 重装

1. 备份项目用户数据：`<project>/.pensieve/`
2. 删除旧技能源码：`rm -rf ~/.claude/skills/pensieve`
3. 重新 clone（Step 1）
4. 对每个项目运行 `init`（Step 3）
5. 运行 `doctor`

### 卸载

```bash
# 手动从 ~/.claude/settings.json 移除 pensieve hook 条目
# 删除系统代码
rm -rf ~/.claude/skills/pensieve

# 删除项目数据（可选，每个项目）
rm -rf <project>/.pensieve
```

## refine 详解：五问决策法

这是 Pensieve 知识质量管理的核心算法。对条目逐一执行，满足终止条件时停止：

| # | 问题 | 否 → | 是 → |
|---|------|------|------|
| Q1 | 删除后，未来是否会重复犯错或重复探索？ | **DELETE** | Q2 |
| Q2 | 有证据支撑吗（代码、文档、实验结果）？ | **DELETE** | Q3 |
| Q3 | 是否已被现有条目覆盖？ | Q4 | **DELETE**（合并后删除） |
| Q4 | 写作时的上下文现在还成立吗？ | **DELETE** | Q5 |
| Q5 | 是否符合目标层的内容规范？ | 补齐或 **DELETE** | **KEEP/PROMOTE** |

执行动作：
- **PROMOTE**（short-term 条目）：`mv short-term/{type}/file.md {type}/file.md`，状态改 `active`
- **KEEP**（长期条目）：无需操作
- **补齐**：按规范补全缺失内容，然后 KEEP/PROMOTE
- **DELETE**：删除文件。Q3 判定重复时，先合并有价值内容再删除

## 三种压缩技术

### 向上抽象

多个条目展现同一模式 → 提炼更高层抽象，删除原始条目。

> 例：三个 knowledge 分别记录"API A 必须幂等"、"API B 必须幂等"、"API C 必须幂等"
> → 提炼一条 maxim "所有外部 API 必须幂等"，删除三个 knowledge

### 提取共享

多个条目重复引用同一事实 → 提取为独立条目 + `[[...]]` 引用。

> 例：三个决策都冗余描述同一流程
> → 提取为 `knowledge/auth-flow/content.md`，三个决策改为 `Based on: [[knowledge/auth-flow/content]]`

### 消除特殊情况

看似不同的条目实际是同一深层原则的特例 → 写深层原则，删除表面规则。

> 例：一条 maxim "不在 handler 直接操作 DB" + 一条 decision "Service 层统一管理事务"
> → 它们都是"关注点分离"的特例。写一条更深的 maxim，原条目降为 `[[...]]` 引用或删除

## 对比：Pensieve vs RAG/Vector DB

| 维度 | Pensieve | RAG / Vector DB |
|------|----------|-----------------|
| **可读性** | Markdown 文件，人类可读、可 diff、可 merge | 向量浮点数，人类不可读 |
| **分层** | 四层语义模型，知识硬度可区分 | 扁平存储，无法区分"铁律"和"缓存" |
| **版本控制** | git 完整审计轨迹 | embedding 漂移，模型更新后向量不可比 |
| **关系** | 显式 `[[...]]` 链接 | 依赖向量相似度（语义相近 ≠ 语义相关） |
| **依赖** | 零外部依赖 | 需要 embedding 模型 + 向量数据库 |
| **自改进** | Agent 可直接编辑 Markdown | 黑盒，Agent 无法自解释检索过程 |
| **成本** | 文件系统 I/O | 向量计算 + 存储 |

**Pensieve 的赌注**：在项目级知识管理场景下，**结构化 > 向量化**。知识的价值不在于"语义相似"，而在于"结构正确"——正确的分层、正确的链接、正确的生命周期。

## 常见问题

### Q: PENSIEVE_SKILL_ROOT 需要手动设置吗？

**取决于安装方式。**

**传统 skill 安装**（通过 `git clone` 到 `~/.claude/skills/pensieve/`）：
- 不需要。脚本通过 `.src/manifest.json` 自举定位技能根目录。

**Marketplace plugin 安装**（通过 `kingkongshot-marketplace`）：
- **需要**。Plugin 的 hook handler 会回退到项目级路径 `<project>/.claude/skills/pensieve/`。
- 如果你的全局安装在 `~/.agents/skills/pensieve/`，需要设置环境变量：
  ```bash
  echo 'export PENSIEVE_SKILL_ROOT=$HOME/.agents/skills/pensieve' >> ~/.zshrc
  source ~/.zshrc
  ```
- 或者创建软链：`ln -s ~/.agents/skills ~/.claude/skills`

**判断你的安装方式**：
```bash
# Marketplace plugin
ls ~/.claude/plugins/cache/kingkongshot-marketplace/pensieve/

# 传统 skill
ls ~/.claude/skills/pensieve/.src/
```

### Q: short-term 条目会自动删除吗？

不会。7 天 TTL 仅用于提醒，文件永远不会被自动移动或删除。需要人工或 Agent 通过 `refine` 决定。

### Q: 可以跳过 short-term 直接写长期目录吗？

可以。两种情况：
- 修改已存在于长期目录的文件：原地编辑
- 用户明确要求直接写入

### Q: 多个项目共享同一个 Pensieve 安装会冲突吗？

不会。系统代码（`.src/`）全局共享，项目数据（`.pensieve/`）每个项目独立。

## 下一步

回到系列索引 → [index.md](./index.md)

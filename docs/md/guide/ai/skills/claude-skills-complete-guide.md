---
title: "Claude Skills 完整构建指南"
date: "2026-05-08"
source: "GitHub awesome-agent-skills"
url: "https://github.com/libukai/awesome-agent-skills"
---

# Claude Skills 完整构建指南

Skill 是一组指令——打包成一个简单的文件夹——用于教导 Claude 如何处理特定任务或工作流程。Skills 是根据你的特定需求定制 Claude 最强大的方式之一。你无需在每次对话中重复解释自己的偏好、流程和领域知识，Skills 让你只需教导 Claude 一次，便能每次受益。

Skills 在你拥有可重复工作流程时效果最佳：从规范中生成前端设计、使用一致方法论进行研究、按照团队风格指南创建文档，或编排多步骤流程。它们与 Claude 的内置能力（如代码执行和文档创建）协同良好。对于构建 MCP 集成的用户，Skills 提供了另一个强大层级——帮助将原始工具访问转化为可靠、优化的工作流程。

本指南涵盖构建高效 Skills 所需了解的一切内容——从规划与结构到测试与分发。无论你是为自己、团队还是社区构建 Skill，你都将在全文中找到实用模式和真实案例。

## 第一章：基础知识

### 什么是 Skill？

Skill 是一个包含以下内容的文件夹：

- **SKILL.md**（必须）：带有 YAML frontmatter 的 Markdown 格式指令
- **scripts/**（可选）：可执行代码（Python、Bash 等）
- **references/**（可选）：按需加载的文档
- **assets/**（可选）：输出中使用的模板、字体、图标

### 核心设计原则

#### 递进式披露（Progressive Disclosure）

Skills 使用三级系统：

- **第一级（YAML frontmatter）**：始终加载到 Claude 的系统提示中。提供恰到好处的信息，让 Claude 知道何时应使用每个 Skill，而无需将全部内容加载到上下文中。
- **第二级（SKILL.md 正文）**：当 Claude 认为该 Skill 与当前任务相关时加载。包含完整的指令和指导。
- **第三级（链接文件）**：打包在 Skill 目录中的附加文件，Claude 可以按需选择浏览和发现。

这种递进式披露在保持专业能力的同时最大限度地减少了 token 消耗。

#### 可组合性（Composability）

Claude 可以同时加载多个 Skills。你的 Skill 应能与其他 Skills 协同工作，而不是假设自己是唯一可用的能力。

#### 可移植性（Portability）

Skills 在 Claude.ai、Claude Code 和 API 上的工作方式完全相同。创建一次，即可在所有平台使用，无需修改——前提是运行环境支持 Skill 所需的任何依赖项。

### 面向 MCP 构建者：Skills + 连接器

如果你已经有一个可运行的 MCP 服务器，那你已经完成了最难的部分。Skills 是顶层的知识层——捕获你已知的工作流程和最佳实践，让 Claude 能够持续地应用它们。

**厨房类比：**
- MCP 提供专业厨房：工具、食材和设备的访问权限。
- Skills 提供菜谱：一步步地说明如何创造有价值的成果。
- 两者结合，让用户无需自己摸索每一个步骤就能完成复杂任务。

## 第二章：规划与设计

### 从使用场景出发

在编写任何代码之前，先确定你的 Skill 应该实现的 2-3 个具体使用场景。

**良好的使用场景定义示例：**

```
使用场景：项目冲刺规划
触发条件：用户说"帮我规划这个冲刺"或"创建冲刺任务"
步骤：
1. 从 Linear（通过 MCP）获取当前项目状态
2. 分析团队速度和容量
3. 建议任务优先级
4. 在 Linear 中创建带有适当标签和估算的任务
结果：已规划完成的冲刺，并创建了任务
```

### 常见 Skill 使用场景类别

在 Anthropic，我们观察到三类常见使用场景：

**第 1 类：文档与资产创建** — 创建一致、高质量的输出，包括文档、演示文稿、应用、设计、代码等。核心技巧包括内嵌样式指南和品牌标准、一致输出的模板结构、定稿前的质量检查清单。

**第 2 类：工作流程自动化** — 受益于一致方法论的多步骤流程，包括跨多个 MCP 服务器的协调。核心技巧包括带有验证节点的分步工作流程、常见结构的模板、内置审查和改进建议、迭代精炼循环。

**第 3 类：MCP 增强** — 工作流程指导，以增强 MCP 服务器提供的工具访问能力。核心技巧包括按顺序协调多个 MCP 调用、嵌入领域专业知识、提供用户否则需要自行指定的上下文、处理常见 MCP 问题的错误处理。

### 定义成功标准

**量化指标：**
- Skill 在 90% 的相关查询上触发 — 测量方法：运行 10-20 个应该触发你的 Skill 的测试查询
- 在 X 次工具调用内完成工作流程 — 测量方法：比较启用和不启用 Skill 的相同任务
- 每个工作流程 0 次 API 调用失败 — 测量方法：监控 MCP 服务器日志的追踪重试率和错误代码

**定性指标：**
- 用户不需要提示 Claude 下一步该做什么
- 工作流程无需用户纠正即可完成
- 跨会话结果一致

### 技术要求

#### 文件结构

```
your-skill-name/
├── SKILL.md                  # 必须——主 Skill 文件
├── scripts/                  # 可选——可执行代码
├── references/               # 可选——文档
└── assets/                   # 可选——模板等
```

#### 关键规则

- **SKILL.md 命名**：必须完全命名为 `SKILL.md`（区分大小写）
- **Skill 文件夹命名**：使用 kebab-case，如 `notion-project-setup`
- **不包含 README.md**：不要在你的 Skill 文件夹内包含 README.md，所有文档放在 SKILL.md 或 references/ 中

### YAML Frontmatter：最重要的部分

YAML frontmatter 是 Claude 决定是否加载你的 Skill 的方式。

**最小必要格式：**

```yaml
---
name: your-skill-name
description: What it does. Use when user asks to [specific phrases].
---
```

**字段要求：**

`name`（必须）：仅使用 kebab-case，无空格或大写字母。

`description`（必须）：必须同时包含该 Skill 的功能、何时使用它（触发条件），少于 1024 个字符，无 XML 标签，包含用户可能说的具体任务。

`metadata`（可选）：任意自定义键值对，建议包含 author、version、mcp-server。

### 编写高效的 Skills

**Description 字段结构：**

```
[它做什么] + [何时使用] + [核心能力]
```

**良好 description 的示例：**

```yaml
# 好——具体且可执行
description: Analyzes Figma design files and generates
developer handoff documentation. Use when user uploads .fig
files, asks for "design specs", "component documentation", or
"design-to-code handoff".

# 好——包含触发短语
description: Manages Linear project workflows including sprint
planning, task creation, and status tracking. Use when user
mentions "sprint", "Linear tasks", "project planning", or asks
to "create tickets".
```

**糟糕 description 的示例：**

```yaml
# 太模糊
description: Helps with projects.

# 缺少触发条件
description: Creates sophisticated multi-page documentation
systems.

# 过于技术性，没有用户触发词
description: Implements the Project entity model with
hierarchical relationships.
```

## 第三章：测试与迭代

Skills 可以根据你的需求进行不同严格程度的测试：

- **在 Claude.ai 中手动测试** - 直接运行查询并观察行为
- **在 Claude Code 中脚本化测试** - 自动化测试用例，实现跨版本的可重复验证
- **通过 Skills API 程序化测试** - 构建评估套件，系统地针对定义的测试集运行

> **专业建议：在扩展之前先在单一任务上迭代**
>
> 我们发现，最有效的 Skill 创建者会在单个具有挑战性的任务上持续迭代直到 Claude 成功，然后将成功的方法提炼成 Skill。

### 推荐的测试方法

#### 1. 触发测试

**目标：** 确保你的 Skill 在正确时机加载。

**测试用例：**
- ✅ 在明显任务上触发
- ✅ 在换句话的请求上触发
- ❌ 不在无关话题上触发

#### 2. 功能测试

**目标：** 验证 Skill 能产生正确的输出。

#### 3. 性能对比

**目标：** 证明 Skill 相比基线有所改善。

```
Without skill:
- User provides instructions each time
- 15 back-and-forth messages
- 3 failed API calls requiring retry
- 12,000 tokens consumed

With skill:
- Automatic workflow execution
- 2 clarifying questions only
- 0 failed API calls
- 6,000 tokens consumed
```

### 使用 skill-creator Skill

`skill-creator` skill 可以帮助你构建和迭代 Skills。如果你有一个 MCP 服务器并了解你的 2-3 个主要工作流程，你可以在单次会话中构建并测试一个功能性 Skill——通常只需 15-30 分钟。

**创建 Skills：**
- 从自然语言描述生成 Skills
- 生成带有 frontmatter 的规范格式 SKILL.md
- 建议触发短语和结构

**审查 Skills：**
- 标记常见问题（模糊描述、缺少触发词、结构问题）
- 识别潜在的过度/不足触发风险

**使用方法：**

```
"Use the skill-creator skill to help me build a skill for
[your use case]"
```

## 第四章：分发与共享

### 当前推荐方法

从在 GitHub 上用公开仓库托管你的 Skill 开始，包含清晰的 README（面向人类访问者——这与你的 Skill 文件夹分开，Skill 文件夹不应包含 README.md）以及带截图的示例用法。然后在你的 MCP 文档中添加一个章节，链接到该 Skill。

**1. 在 GitHub 上托管**
- 开源 Skills 使用公开仓库
- 清晰的 README，包含安装说明
- 示例用法和截图

**2. 在你的 MCP 仓库中建立文档**
- 从 MCP 文档链接到 Skills
- 解释同时使用两者的价值
- 提供快速入门指南

### 定位你的 Skill

**聚焦结果，而非功能：**

✅ 好：
```
"The ProjectHub skill enables teams to set up complete project
workspaces in seconds — including pages, databases, and
templates — instead of spending 30 minutes on manual setup."
```

❌ 差：
```
"The ProjectHub skill is a folder containing YAML frontmatter
and Markdown instructions that calls our MCP server tools."
```

## 第五章：模式与故障排除

### 选择方法：问题优先 vs. 工具优先

把它想象成家得宝（Home Depot）。你可能带着一个问题走进去——"我需要修厨房橱柜"——然后员工引导你找到合适的工具。或者你可能挑好了一把新电钻，然后询问如何用它完成你的特定工作。

Skills 的工作方式相同：

- **问题优先**："我需要设置一个项目工作区" → 你的 Skill 按正确顺序编排合适的 MCP 调用
- **工具优先**："我已连接了 Notion MCP" → 你的 Skill 教导 Claude 最优工作流程和最佳实践

### 模式 1：顺序工作流程编排

**适用场景：** 用户需要按特定顺序执行的多步骤流程。

核心技巧：明确的步骤顺序、步骤间的依赖关系、每个阶段的验证、失败时的回滚指令。

### 模式 2：多 MCP 协调

**适用场景：** 工作流程跨越多个服务。

核心技巧：清晰的阶段划分、MCP 之间的数据传递、进入下一阶段前的验证、集中的错误处理。

### 模式 3：迭代精炼

**适用场景：** 输出质量随迭代提升。

核心技巧：明确的质量标准、迭代改进、验证脚本、知道何时停止迭代。

### 模式 4：上下文感知工具选择

**适用场景：** 相同的结果，根据上下文使用不同的工具。

核心技巧：清晰的决策标准、备选方案、关于选择的透明度。

### 模式 5：领域特定智能

**适用场景：** 你的 Skill 在工具访问之外增加了专业知识。

核心技巧：逻辑中嵌入领域专业知识、行动前先合规、全面的文档记录、清晰的治理。

### 故障排除

#### Skill 无法上传

**错误："Could not find SKILL.md in uploaded folder"** — 解决方案：重命名为 `SKILL.md`（区分大小写），用 `ls -la` 验证

**错误："Invalid frontmatter"** — 解决方案：检查 YAML 格式，确保 `---` 分隔符正确闭合

**错误："Invalid skill name"** — 解决方案：确保名称含有空格或大写字母，使用 kebab-case

#### Skill 不触发

修改你的 description 字段。确保不要太通用，包含用户实际会说的触发短语。

#### 指令未被遵循

1. 指令太冗长 — 保持指令简洁，使用项目符号和编号列表
2. 指令被埋没 — 将关键指令放在最前面
3. 语言模糊 — 使用具体、可执行的指令

**高级技巧：** 对于关键验证，考虑打包一个以编程方式执行检查的脚本，而不是依赖语言指令。代码是确定性的；语言解读则不然。

#### 大上下文问题

**原因：**
- Skill 内容太大
- 同时启用的 Skills 太多
- 所有内容被加载而非递进式披露

**解决方案：**
1. 将详细文档移至 references/
2. 链接引用而非内联
3. 将 SKILL.md 控制在 5,000 字以内

## 第六章：资源与参考

### 官方文档

- Anthropic 资源：最佳实践指南、Skills 文档、API 参考、MCP 文档
- 博客文章：Introducing Agent Skills、Engineering Blog: Equipping Agents for the Real World、Skills Explained

### 示例 Skills

**公开 Skills 仓库：**
- GitHub：anthropics/skills — 包含 Anthropic 创建的可供定制的 Skills

### 工具与实用程序

**skill-creator skill：**
- 内置于 Claude.ai 并可用于 Claude Code
- 可以从描述生成 Skills
- 提供审查和建议

## 参考：快速检查清单

### 开始之前

- [ ] 已确定 2-3 个具体使用场景
- [ ] 已确定所需工具（内置或 MCP）
- [ ] 已阅读本指南和示例 Skills
- [ ] 已规划文件夹结构

### 开发过程中

- [ ] 文件夹以 kebab-case 命名
- [ ] SKILL.md 文件存在（拼写准确）
- [ ] YAML frontmatter 有 `---` 分隔符
- [ ] `name` 字段：kebab-case，无空格，无大写字母
- [ ] `description` 包含功能描述（WHAT）和使用时机（WHEN）
- [ ] 无 XML 标签（`< >`）
- [ ] 指令清晰且可执行
- [ ] 包含错误处理
- [ ] 提供了示例

### 上传之前

- [ ] 已测试在明显任务上的触发
- [ ] 已测试在换句话请求上的触发
- [ ] 已验证不会在无关话题上触发
- [ ] 功能测试通过
- [ ] 已压缩为 .zip 文件

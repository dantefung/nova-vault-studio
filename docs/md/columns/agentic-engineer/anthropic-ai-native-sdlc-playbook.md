---
title: "Anthropic 官方指南：AI Native 开发手册"
date: "2026-08-26"
source: "微信公众号（金色传说大聪明，编译自 Anthropic 官方博客）"
url: "https://mp.weixin.qq.com/s/3Mh8CNQewKmU2I8nePnxrA"
---

# Anthropic 官方指南：AI Native 开发手册

> 编译自 Anthropic 官方博客《The AI-Native SDLC Playbook》（2026 年 8 月 21 日，Louis Claxton），全文约八千字。这份指南逐阶段介绍了 Anthropic Applied AI 团队在内部集成 Claude 的最佳实践，从规划、设计、构建、测试、部署到运维，把 AI 嵌入到每个节点，让流程从线性变成循环。

<!-- more -->

这里的 SDLC 指的是「软件开发生命周期」（Software Development Life Cycle），说的是软件从一个想法变成线上产品的完整过程，通常拆成规划、设计、构建、测试、部署、运维六个阶段。

App Store 销售额十年来首次下降。换言之：香草时代，结束了。

## 一、代码不再是瓶颈

很多团队已经在用 AI 写代码了，速度快到一年前根本想不到。但代码周围的流程没跟上。大部分工程团队还是老一套审批门禁、代码审查、人工交接、合规策略，把 Claude Code 这类 agentic coding 工具带来的效率提升活活卡住。

传统做法里，SDLC 的每个阶段是一个独立环节，各有各的负责人。产品经理写需求，技术架构师把需求变成设计，工程师按设计写代码，QA 团队做验证，发布团队负责上线，运维团队盯线上。工作在这些环节之间流转，靠的是文档、工单和签批。

这套流程很重，是为了确保每一步都有人负责、有人管控。但它的设计前提是：写代码和实现代码是最耗时、最费钱的阶段。现在这个前提不成立了。PRD、估时会议、产品安全审查，这些东西存在的意义是在可能长达数周、数月甚至数个季度的开发周期里强制对齐认知。传统 SDLC 还有一个假设：每一步都是人在做。

当代码不再是瓶颈、构建阶段跑得比传统 SDLC 允许的速度还快时，三件事变成了现实：

1. **瓶颈转移到了构建阶段的左右两侧**——主要是规划、审查/测试和部署，这些环节还在以人的速度运行
2. **管控手段和现实脱节了**——代码是人写的时候，逐行审查是合理的。但当 agent 产出了大部分 diff，逐行审查跟不上了
3. **治理成本上升了**——因为例外情况还是要走会议和委员会，而这些会每周或每月才开一次

> 构建不再是约束，约束来自构建两侧那些人速运行的环节。

要真正兑现 agentic AI 的效率收益并确保安全，传统 SDLC 需要经历和代码实现阶段同等程度的改造。

## 二、什么是 AI 原生 SDLC

AI 原生 SDLC 是一套重新设计的流程，把旧的管控目标和新的执行方式结合起来。流程从线性变成了循环，AI 嵌入到每个节点。AI 原生 SDLC 推动自动化的交接和后续步骤的触发，解决的是传统 SDLC 各阶段之间手动、笨重的衔接问题。

### 核心概念：提交的产物（Committed Artifact）

贯穿 AI 原生 SDLC 的核心概念是**提交的产物**（committed artifact）。每个阶段结束时往版本控制里写一个产物（intent.md、spec.md、plan.md、代码 diff 及其测试、带审查结论的 PR、事故记录），下一个阶段从读取这个产物开始。

- 早期阶段的主要产物是 `.md` 文件，因为产品负责人和 agent 都能读、都能用
- 从构建阶段往后，产物就是代码和它的记录了

这条 commit 链本身就是审计链：谁提了什么需求，agent 产出了什么，谁批准了它。

人对每一个需要判断力的决策负责。在 agentic SDLC 的世界里，人的注意力随着需要审查的产物一起转移。

### Play 依赖图

Play 是这份手册的核心，按六个非线性阶段分组（规划、设计、构建、测试、部署、运维），覆盖完整生命周期。每个 play 包含：变化了什么、如何开始、具体实施步骤、治理考量、如何衡量效果。

这些步骤是模块化的，组织可以根据自身需要优先改造不同阶段。一个阶段在提交产物时结束，这次提交同时启动下一个阶段。

- 一个通过审核的 `intent.md` 触发需求和设计环节
- 一个通过审核的 `spec.md` 触发 plan mode
- 一个合并的 PR 触发流水线
- 线上的监控指标突破控制带时写出下一个 `intent.md`，循环继续

一开始你手动触发每一步，最终状态是每个通过审核的产物自动触发下一个门禁。人的注意力集中在门禁上，审查的是 agent 标记出来的内容，不用从头开始每个阶段。

## 三、各阶段 Play

### Play 1：用 intent.md 捕获意图

`intent.md` 是软件开发流程的起点，可以从不同入口进来。一个人有了想法，一个工单被提交，或者一个告警触发了事故。

当一个人有了想法，他和 Claude 一起头脑风暴，产出一份 Markdown 格式的 proto-spec。传统 SDLC 里，这个人接下来得说服产品团队的人帮他写或替他写。Claude 生成的 proto-spec 是人类可读的、版本控制的，下一个阶段可以直接消费。

这是一次性的搭建工作，由平台或工程团队完成。仓库建好之后，没有 git 经验的人不需要直接用 git。一个连接到 GitHub 的 connector 可以让 Claude 在 claude.ai 或 Cowork 里代替他们提交 Markdown 文件。

**具体怎么做**：

1. 发起人用自己的话向 Claude 描述问题。不需要正式语言
2. 反复头脑风暴直到想法具体化。Claude 会问分析师该问的问题：范围、用户、约束、怎样算成功
3. 让 Claude 按组织模板把结果写成 `intent.md`。模板可以编码为一个 skill
4. 发起人修正 Claude 理解错的地方
5. 把 `intent.md` 提交到共享仓库。作者和时间戳加入记录

```markdown
# Intent: claims status self-service
Author: J. Ortiz (claims operations). Status: draft.

## Problem
Customers phone the contact center to ask where their claim is.
Handlers spend roughly a third of call time on status-only queries.

## Proposed outcome
Customers see claim status, next step and expected date in the portal.

## Affected users and systems
Claims handlers, portal team, claims-core API.

## Constraints
No new PII in the portal session. Existing authentication only.

## Open questions
Do third-party loss adjusters need access too?
```

**治理考量**：证据就是提交的 `intent.md`，列有作者、时间戳和完整修订历史，记录在 intent 仓库的 git 历史里。产品负责人审批，接受或拒绝的决定记录为合并或关闭审查。

### Play 2：需求与设计

产品负责人批准后，Claude 拿着通过审核的 `intent.md` 生成需求和设计规格说明。这个过程受组织的 skills 指引，涵盖品牌、安全、合规和 UX。

产品负责人审查这份规格说明，但不写它。这个流程的目标是产出一份工程团队可以据此规划的 spec，同时标记出需要关注的地方。

**Prompt 长这样**：

```
Read the attached intent.md and produce a requirements and design spec for
integrating it into our existing codebase. Apply the skills available to you
so the plan conforms to our brand guidelines, security policies and UX standards.
Document the spec fully as spec.md, ready to hand to the engineering team.
Describe clearly any areas of concern, especially where you cannot satisfy
contradicting policies.
```

**治理考量**：组织的 skills 作为约束条件应用在 spec 上。不是等几周后在审查里才发现冲突，而是在 spec 编写时就读取并应用了现行策略。Spec、产生它的 prompt、以及生效的 skill 版本，全部记录在版本控制里。

### Play 3：构建阶段

#### Claude Code Plan Mode 作为默认起点

工程师在 plan mode 下启动 Claude Code 会话，给 Claude 第二阶段产出的 `spec.md`，让它提问、讨论，反复迭代计划，直到工程师满意。

工程师把 `intent.md` 和 `spec.md` 给 Claude，要求一份实施计划：列出要改的文件、工作顺序、证明它 work 的测试。质询计划：问这个改动可能破坏什么，哪一步风险最大，Claude 为什么没选其他方案。反复迭代，直到一个从没看过这段对话的工程师也能只凭这份计划完成改动。

把通过审核的计划提交为 `plan.md`。接受计划，让 Claude 实施。有一份扎实的计划，实施通常一遍就完成了。

```markdown
# Plan: claims status self-service (from intent.md 2026-06-02)

## Files that change
- portal/src/claims/StatusPanel.tsx (new)
- claims-api/routes/status.py
- claims-api/tests/test_status.py

## Order of work
1. Add the status endpoint behind existing auth.
2. Panel against the endpoint.
3. Wire into the portal nav.

## Risks
The claims-core API rate-limits at 50 rps; the panel must cache.

## Proof
test_status.py covers the four claim states; screenshot matches the approved mock.
```

**治理考量**：设计审查发生在任何代码生成之前，改方向还只是改文档的事。Plan mode 本身就强制执行了这一点，因为工程师接受计划之前 Claude 不能编辑文件。

#### Claude Code Auto Mode

Claude Code 也可以在 auto mode 下运行。工程师审批计划，满意之后 Claude 自动逐个应用变更，不需要每次编辑都确认。随着后续 play 的护栏成熟（调好的 CLAUDE.md、编码了策略的 skills、拦截不安全操作的 hooks、Claude 能自己跑的测试套件），auto-accept 成为常规工作的默认模式。

注意力的重心从「看着 agent 做每一次编辑」转向「在更长的自主会话之后审查产物」。

#### CLAUDE.md

CLAUDE.md 给 Claude 提供一个新人入职第一天需要知道的东西：代码规范、命令、架构、团队最常见的错误。过去存在人脑里和 wiki 上的知识，变成了 agent 每次会话开头都会读的文件，由整个团队维护，每犯一次错就迭代一次。

在仓库里跑 `/init`，Claude 从它发现的东西里生成一个初始版本。把它精简到新人第一天需要的内容。**一条实用规则：Claude 犯同一个错两次，纠正就进 CLAUDE.md。控制在一页以内。**

```markdown
# Payments service

## Commands
- Build: make build
- Test: make test (unit), make itest (integration, needs docker)
- Lint: make lint (runs in CI; fix before pushing)

## Conventions
- Java 21, Spring Boot 3. No new Lombok.
- Money is always BigDecimal, never double.
- Every endpoint needs an integration test in src/itest.

## Architecture
- api/ holds REST controllers, core/ holds domain logic, adapters/ talks to external systems.
- Kafka events are defined in schemas/; never edit generated classes.

## Things Claude gets wrong
- Do not bump dependency versions; the platform team owns them.
- The legacy v1/ package is frozen; changes go in v2/.
```

#### Skills：机构知识的可执行化

Skills 是组织让机构知识真正发挥作用的方式。指令是显式的、版本控制的、广泛适用的，策略变化时集中更新。经验法则：需要一致性执行的机构知识写成 skill。

```markdown
---
name: secure-api-review
description: Apply the API security standard. Use whenever
  creating or modifying an external-facing endpoint,
  reviewing API code, or generating an OpenAPI spec.
---
# Secure API review

When you create or change an API endpoint:
1. Authentication: every endpoint requires the gateway JWT;
   no anonymous routes outside /health.
2. Input validation: validate request bodies against the
   OpenAPI schema and reject unknown fields.
3. Audit: every state-changing endpoint emits an audit event
   with actor, action, entity and timestamp.
4. Data classification: fields tagged pii in the schema must
   never appear in logs or error messages.

Run scripts/check-endpoints.sh and include its output in your summary.
```

**治理考量**：Skill 是一种管控手段，但是建议性的。必须无条件执行的策略需要在 skill 背后加一层确定性的东西，比如 hook。Skill 让违规变得少见，hook 让违规几乎不可能。

#### Hooks：构建阶段的护栏

Skill 是建议性管控，hook 是背后的确定性层。Claude 在实施阶段的大部分操作是文件编辑和 shell 命令，所以构建阶段是 hook 触发最频繁的地方。

构建阶段的 hook 可以做这些事情：阻止对受保护路径的编辑（比如生成的类或冻结的包），在文件编辑后跑 formatter 和 linter，把凭证挡在 diff 之外。

Hook 在每个匹配的操作上运行，所以构建阶段的 hook 要快、范围要限定在改动的文件上。更重的检查（比如跑完整测试套件）应该放在 commit 或 PR 阶段。

#### 并行会话和子 Agent

一个工程师可以同时推进多条工作流。

- **并行会话**：另一个完整的 Claude Code 实例，在各自的 git worktree 里处理独立的任务。每个独立会话互不知道对方的存在，工程师是它们唯一的共享点
- **子 agent（subagent）**：运行在单个会话内部，有自己的上下文窗口和工具权限，适合在多个任务中重复出现的工作，比如验证应用是否按预期运行

```markdown
# .claude/agents/verifier.md
---
name: verifier
description: Runs the app and checks the change works
  before the session reports done
tools: Bash, Read
---
Start the app with make run. Exercise the changed behavior and
the two nearest neighboring flows. Report what you ran, what you saw,
and any behavior that does not match plan.md. Do not fix anything; report only.
```

#### 给 Claude 一个反馈回路

始终给 Claude 一种验证自己工作的方式，不管是测试、构建还是截图 diff。会话自己检查自己的工作，自己修正自己的错误，然后工程师才看到。

如果检查工作现在需要一连串命令和一些环境知识，把它包装成一个 target，比如 `make test` 或 `npm test`，失败时返回非零退出码。在 CLAUDE.md 的 Commands 部分列出每个命令和健康输出的示例。

**修 bug 时先写失败的测试**。让 Claude 把 bug 复现为测试，跑一遍，确认它因为预期的原因失败。提交那个测试。然后才让 Claude 在不编辑测试的前提下修复它。一个修复前就存在、agent 不能改写的测试，就是 bug 已消除的证据。

回路本身也需要保护。修代码的 agent 不能同时削弱对那段代码的检查。一个在修复任务期间阻止编辑测试文件的 hook 可以做到这一点。

### Play 4：测试阶段

#### CI 中的持续 Eval

Eval 是 AI 原生世界里的 stage-gate QA。具体来说就是一个测试套件，在 agent 的配置变化时运行。换了新模型或改了 prompt，eval 套件会告诉你 agent 是否还能保持同样的工作标准。

平台工程师从近期工作中收集 20 到 50 个真实任务及其预期/通过的结果。把每个任务写成 eval：prompt 加上定义「可接受」的检查项（测试通过、lint 干净、行为不变、策略被遵守）。**每个生产事故都变成一个 eval，作为回归测试永远留在套件里。**

```yaml
# .github/workflows/agent-evals.yml
name: Agent evals
on:
  pull_request:
    paths: ['CLAUDE.md', '.claude/**']
  schedule:
    - cron: '0 2 * * *'
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @anthropic-ai/claude-code
      - name: Run eval suite
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          for eval in evals/*.json; do
            claude -p "$(jq -r '.prompt' $eval)" \
              --allowedTools "Read,Edit,Bash(make test)" \
              --output-format json > result.json
            ./evals/check.sh "$eval" result.json
          done
```

#### AI 参与 PR 审查

Claude 既做审查者，也做被审查者。它按组织策略审查传入的 PR，同时处理自己 PR 上收到的审查意见。工程师可以把 PR 审查的注意力集中在行为上：判断意图和风险。

技术负责人把审查策略写成仓库根目录的 `REVIEW.md`，分成组织关心的几个维度：bug 和逻辑错误、安全和漏洞、是否符合 spec。`REVIEW.md` 还定义什么算 Important、什么算 Nit、以及什么可以跳过。

审查者或作者在审查评论上 @claude 时，Claude 处理评论并推送修复。对于 Claude 自己开的 PR，可以更进一步，让 Claude 看管 PR 直到合并：扫描未解决的审查评论和失败的 check，处理它们并推送修复，循环往复，直到 PR 是绿的、只等代码所有者批准。

**审查结论反馈到 CLAUDE.md**。同一个错误第二次被审查标记时，纠正就在那次审查中写入 CLAUDE.md。因为审查会读 CLAUDE.md，从下一个 PR 开始这个错误就会被提前捕获。

```markdown
# Review instructions

## Passes
Run three passes and tag each finding with its pass:
- Bugs: logic errors, broken edge cases, subtle regressions
- Security: injection risks, authentication gaps, PII in logs
- Compliance: the change matches spec.md, plan.md and our design principles

## What Important means here
Reserve Important for findings that would break behavior, leak data or breach a policy.
Style and naming are nits.

## Cap the nits
Report at most five nits per review; summarize the rest as a count.

## Do not report
Generated files under src/gen/ and anything CI already enforces.
```

**治理考量**：职责分离得到保持。写代码的 agent 没有途径批准自己的代码。审查策略对所有 PR 生效。批准来自人（通过分支保护），依据是审查结论。

### Play 5：部署阶段

#### Hooks 作为审批门禁

构建阶段的 hook 是护栏，允许或阻止操作，不需要人介入。但 hook 也可以暂停操作直到特定的人批准，这正是发布门禁需要的。

工程领导层与变更管理和合规团队一起，列出必须保留的人工审批门禁。平台工程师把每个门禁表达为 hook。团队 hook 放在 git 里的 `.claude/settings.json`，不可协商的 hook 放在平台管理员拥有的 managed settings 里，个人工程师无法关闭。

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/production-gate.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/bin/bash
# .claude/hooks/production-gate.sh
# Production deploys require a named release authorization
cmd=$(jq -r '.tool_input.command' < /dev/stdin)
if [[ "$cmd" == *"deploy"* && "$cmd" == *"production"* ]]; then
    if [ -z "$RELEASE_APPROVAL" ]; then
        echo "Production deploys need a release authorization." >&2
        exit 2
    fi
fi
exit 0
```

**治理考量**：Hook 就是审批门禁。门禁条件每次执行、对每个人执行。允许和阻止的决定带时间戳记录。

#### CI/CD 集成与部署

在 CI/CD 流水线里非交互式地运行 Claude Code，沙箱化执行让长时间运行的 agent 安全运行，通过 MCP 集成暴露部署能力，在 agent 真正需要之前先演练回滚路径。

平台工程师从只读的判断步骤开始。在流水线 job 里用 `claude -p` 来分类失败的构建、总结 flaky 测试、或起草 changelog。在现有门禁后面加写入步骤。Agent 写的任何东西都通过分支保护作为 PR 到达，agent 没有直接推送到 main 的路径。

通过 MCP 暴露部署能力。部署、状态查询和回滚变成工具，按环境限定范围。**按环境分级自主权**：开发环境里 agent 自由部署，生产环境里 agent 准备发布、发布经理授权，预发布环境介于两者之间。

回滚应该是流水线里演练最多的路径：一条命令，agent 能跑，在预发布环境里定期演练。

```yaml
- name: Triage failed build
  if: failure()
  run: |
    claude -p "Read the build log at out/build.log.
    Identify the most likely cause, say whether the failure
    looks flaky or real, and write a three-line summary
    for the PR thread." >> triage.md
```

**治理原则**：agent 可以做到生产门禁为止，不能越过它。分支保护把 agent 写的任何东西变成 PR。生产部署 hook 在发布经理授权前阻止发布。每次非交互式运行都以 agent 自己的身份执行，流水线日志把 agent 做的事和触发它的工程师做的事分开。

### Play 6：运维与闭环

到目前为止，每个阶段都需要人来启动初始步骤。这个阶段的重点是 Claude 的自主运行来闭合整个循环。

比如一个持续运行的监控 agent 可以在一个 bug 工单被提出时创建 `intent.md`，然后流经需求、计划、构建、测试和审查阶段。第六阶段无人值守地运行，阶段之间有独立的信心门禁来决定上一阶段的产出是继续流转还是升级给人处理。

#### 闭合循环

一个确定性脚本监控生产环境，在控制带被突破时调用 Claude。

服务负责人或平台工程师选一个有稳定滚动基线的指标，比如 CI 测试失败率、部署后 5xx 率、或 PR 周期时间。写检测脚本：通常是滚动窗口上的均值和标准差，加规则（Western Electric 或类似方法）。**检测层完全确定性，不涉及模型。**

在版本控制的配置文件里定义响应分级。1σ 只记日志，2σ 调用 Claude 只读诊断，3σ Claude 可以行动（但只能通过开 PR 进入审查门禁或触发预先批准的 runbook）。

```yaml
# bands.yaml — 监控 CI 测试失败率
metric: ci_test_failure_rate
baseline: rolling_30d
rules: western_electric
tiers:
  1sigma: { action: log }
  2sigma: { action: diagnose,
            tools: "Read,Grep,Bash(gh run view *)" }
  3sigma: { action: propose,
            routes: [pull_request, runbook:rollback-deploy] }
```

Agent 按第一阶段格式把诊断写成 `intent.md`：异常及其证据、预期结果、受影响的系统、待解答的问题。从这里开始，发现的问题和其他任何东西一样走流水线。

几个实际场景：

- CI 测试失败率突破 3σ 时，agent 隔离 flaky 测试或开一个 revert PR，审查门禁做决定
- 部署后 5xx 率突破 3σ 且时间窗口内有部署时，agent 触发现有的回滚流水线
- PR 周期时间触发漂移规则时，agent 为工程领导层写一份报告

#### Claude Tag：Claude 随叫随到

事故也可以通过 Slack 或 Teams 这样的工作通讯工具到达。Claude Tag（目前在 Slack 里公开 beta）让 Claude 以自己的身份成为频道的成员，每个新事故都能拿到第一响应。

对话和机构知识留在频道里，任何团队成员都能测试假说、探索新方案、实时调查，频道历史增加了可审计性。通过 MCP 访问，Claude 验证指标回到基线并在帖子里确认，把事后复盘写到版本控制的经验文件里。

事故不是 Claude Tag 接手的唯一工作。小的、边界清晰的修复作为 PR 进入审查门禁，更大的工作被写成 `intent.md` 进入第一阶段，循环开始自我喂养。

> 频道就是审计链：请求、诊断、人的授权和修复，全部留在事故被处理的地方。

## 四、收尾

模型和框架越来越成熟了。组织现在可以改造的不只是写代码的方式，而是整个软件开发生命周期。这种改造把人的判断力放在流程的中心位置，同时考虑了大型企业组织的治理和合规要求。

这份指南整合了 Anthropic Applied AI 团队每天为客户执行的真实最佳实践。

---

## 文章速查

| 项目 | 内容 |
|------|------|
| **来源** | Anthropic 官方博客《The AI-Native SDLC Playbook》（Louis Claxton，2026-08-21） |
| **编译** | 金色传说大聪明（微信公众号） |
| **核心概念** | Committed Artifact（提交的产物），commit 链即审计链 |
| **六阶段 Play** | 规划 → 设计 → 构建 → 测试 → 部署 → 运维 |
| **关键产物** | intent.md → spec.md → plan.md → 代码 diff + 测试 → PR → 事故记录 |
| **三层护栏** | CLAUDE.md（知识）+ Skills（建议）+ Hooks（确定性阻断） |
| **测试理念** | Eval 套件：每个生产事故变成一个 eval 永远留在套件里 |
| **运维闭环** | 1σ 记日志 → 2σ Claude 诊断 → 3σ Claude 提案（PR/回滚） |
| **核心转变** | 人的注意力从「逐行看代码」转向「审查产物、判断意图与风险」 |
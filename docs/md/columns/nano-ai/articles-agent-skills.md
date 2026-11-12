---

title: "Skills：让 Agent 按需加载能力"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-skills/"

description: "AGENTS.md 常驻、技能按需加载、技能目录只读；对照 Agent Skills 开放标准和 Hermes 的自我改进。"

---



# Skills：让 Agent 按需加载能力




[从零手写 Agent · EP05](/agent/)




Skills



> 前四课，Agent 有了循环、工具、权限和上下文管理。它能干活、不乱干活，也不会被自己的历史撑爆。

>

> 但用上几天，你会想让它"按你的规矩来"：提交信息按团队格式写，周报按固定模板出，部署前先跑哪几条检查。



最直接的做法是把这些规矩全写进 system prompt。这一课讲为什么不该这么做，以及怎么用约 80 行代码换一种做法。



* * *



## 01问题：system prompt 只会越写越长



假设你给 Agent 写了五套规矩：提交信息规范、周报模板、代码评审清单、部署检查、写文档的风格。每套几百到一千字。



全部塞进 system prompt，会有两个后果：



  1. **每一次调用都要带上它们。** 第 4 课讲过，messages 每一轮都会整个重新发送，system prompt 是其中永远不会被清理的那部分。你只是让它读一个文件，也要为五套规矩付费。

  2. **不相关的说明会干扰模型。** 你让它改一个 bug，上下文里却躺着周报模板和部署清单。说明越多，模型越容易把 A 场景的要求用到 B 场景上。



问题的本质是：**这些说明大部分时候用不上，但我们让它们一直在场。**



* * *



## 02思路：分清"一直需要"和"偶尔需要"



把给 Agent 的说明分成两类，用两种方式加载：



类型 | 例子 | 加载方式

---|---|---

项目说明 | 这个项目用什么语言、测试命令是什么、哪些目录别碰 | 每次都放进 system prompt

技能 | 提交信息规范、周报模板、部署清单 | system prompt 里只放**名字和一句话用途** ，需要时模型自己调用工具读取全文



项目说明放在工作区根目录的 
`AGENTS.md`
，内容短、每次都相关。



技能放在 
`skills/`
 目录下，每个技能一个文件夹：





    workspace/

    ├── AGENTS.md

    └── skills/

        ├── git-commit/

        │   └── SKILL.md

        └── weekly-report/

            ├── SKILL.md

            └── template.md      # 技能可以附带其他文件





关键在于第二类的加载方式：模型一开始只看到一行目录，像这样：





    ## 可用技能

    - git-commit：按团队规范写 git 提交信息

    - weekly-report：按固定模板整理本周工作，生成周报





当它判断"这个任务需要写提交信息"时，自己调用 
`load_skill("git-commit")`
，规范全文才进入上下文。



五套规矩，平时只占五行。




`SKILL.md`
 的格式来自 Agent Skills 开放标准：开头用 
`---`
 包住的 
`name`
 和 
`description`
，下面是正文。这里只实现最小的子集。第八节会看到，主流 Agent 几乎都在用这个格式。



一个技能文件长这样：





    ---

    name: git-commit

    description: 按团队规范写 git 提交信息。用户要求提交代码或写 commit message 时使用。

    ---



    # 提交信息规范



    1. 第一行格式：<类型>: <简述>，类型只能是 feat / fix / docs / refactor / test

    2. 简述不超过 50 字，不加句号

    3. 空一行后写"为什么改"，不写"改了什么"（diff 里已经有了）

    4. 提交前先运行 git diff --staged，确认暂存区内容和描述一致





注意 
`description`
 的写法：**说清做什么，也说清什么时候用。** 模型决定加不加载这个技能，唯一的依据就是这一句话。它和第 2 课的工具 description 是同一回事，本质都是提示词。



* * *



## 03代码：skills.py





    """skills.py —— 第 5 课：技能（按需加载的能力说明书）"""

    from permissions import SKILLS_DIR, WORKSPACE

    from tools import tool



    SKILL_MARK = "[skill]"

    MAX_NOTES_CHARS = 3000





    def parse_skill(text):

        """拆出 frontmatter（--- 之间的 key: value）和正文。"""

        lines = text.splitlines()

        if not lines or lines[0].strip() != "---":

            return {}, text.strip()

        meta = {}

        for i, line in enumerate(lines[1:], start=1):

            if line.strip() == "---":

                return meta, "\n".join(lines[i + 1:]).strip()

            key, sep, value = line.partition(":")

            if sep:

                meta[key.strip()] = value.strip()

        return {}, text.strip()          # 没有闭合的 ---，当作没有 frontmatter





    def discover(skills_dir=None):

        skills_dir = skills_dir or SKILLS_DIR

        found = {}

        if not skills_dir.is_dir():

            return found

        for f in sorted(skills_dir.glob("*/SKILL.md")):

            meta, _ = parse_skill(f.read_text(encoding="utf-8"))

            name = meta.get("name") or f.parent.name

            if not meta.get("description"):

                print(f"[skills] 跳过 {f}：缺少 description")

                continue

            found[name] = {"description": meta["description"], "path": f}

        return found





没有引入 YAML 库。frontmatter 只支持一行一个 
`key: value`
，用 
`partition(":")`
 只切第一个冒号，所以描述里带冒号也没问题。



缺少 
`description`
 的技能直接跳过并打印提示。没有描述，模型就无从判断什么时候该用它，留着只会占位置。



接下来是两段要放进 system prompt 的文本：





    def skills_section(found=None):

        found = discover() if found is None else found

        if not found:

            return ""

        lines = ["", "## 可用技能",

                 "下面只列出技能的名字和用途。当任务和某个技能的用途匹配时，"

                 "先调用 load_skill 读取完整说明，再按说明执行。"]

        lines += [f"- {n}：{s['description']}" for n, s in found.items()]

        return "\n".join(lines)





    def project_notes():

        """AGENTS.md：项目级说明，每次都放进 system prompt。"""

        p = WORKSPACE / "AGENTS.md"

        if not p.is_file():

            return ""

        text = p.read_text(encoding="utf-8")[:MAX_NOTES_CHARS]

        return f"\n\n## 项目说明（来自 AGENTS.md）\n{text}"






`AGENTS.md`
 限制了 3000 字。它每一轮都要发送，必须克制。



最后是给模型用的工具，用第 2 课的 
`@tool`
 装饰器注册：





    @tool(

        name="load_skill",

        description="读取一个技能的完整说明。任务和「可用技能」列表里某个技能的用途匹配时调用。",

        parameters={"type": "object",

                    "properties": {"name": {"type": "string", "description": "技能名"}},

                    "required": ["name"]},

    )

    def load_skill(name):

        found = discover()

        if name not in found:

            return f"Error: 没有名为 {name!r} 的技能，可用：{', '.join(found) or '无'}"

        path = found[name]["path"]

        _, body = parse_skill(path.read_text(encoding="utf-8"))

        extras = sorted(p.name for p in path.parent.iterdir() if p.name != "SKILL.md")

        rel = path.parent.relative_to(WORKSPACE)

        note = f"\n\n（技能目录 {rel}/ 下还有：{', '.join(extras)}）" if extras else ""

        return f"{SKILL_MARK} {name}\n{body}{note}"





三个细节：



  1. **技能名不存在时，返回可用列表。** 和第 2 课的执行器一样，错误也是结果，模型看到列表就能自己纠正。

  2. **列出技能目录下的其他文件。** 比如周报技能附带了 
`template.md`
，模型知道它存在，需要时用 
`read_file`
 去读。这是第二层按需加载：正文先进来，附件再按需进来。

  3. **返回内容以
`[skill]`
 开头。** 这个标记是给第 4 课的上下文管理用的，下一节说明。



* * *



## 04接入：改三个地方



### 1\. permissions.py：登记风险，并把技能目录设为只读





    SKILLS_DIR = WORKSPACE / "skills"



    TOOL_RISK = {

        ...

        "load_skill": Risk.SAFE,     # 只读，直接放行

    }





在 
`_hard_limits`
 的文件路径检查里加两行：





    if name in ("read_file", "write_file", "list_dir"):

        path = args.get("path", ".")

        p = resolve_in_workspace(path)

        if p is None:

            return f"路径 {path!r} 在工作区 {WORKSPACE} 之外，禁止访问。"

        if name == "write_file" and p.is_relative_to(SKILLS_DIR):

            return "技能目录是只读的，Agent 不能修改自己的技能。"





注意 
`run_shell`
 依然可以改技能文件，比如 
`echo ... > skills/x/SKILL.md`
。但它每条命令都要你确认，而且确认界面展示的是完整命令。



为什么要单独拦这一条？



技能的内容会被模型当作指令执行。如果 Agent 能改写 
`skills/`
 下的文件，那么一次提示词注入（比如它读到的某个网页里夹带了恶意文本）就可能被写进技能，**之后每一次加载这个技能都会再触发一次** 。一次性的问题变成了持久的问题。



这条规则放在第 1 关硬规则里，用户在确认界面按 y 也放不行。要改技能，你自己去改文件。



### 2\. context.py：技能内容不参与"清理旧工具结果"



第 4 课的第 2 层会把旧的工具结果替换成占位符。技能说明也是工具结果，如果被清理掉，模型就会在任务进行到一半时"忘记规矩"。





    KEEP_PREFIXES = ("[skill]",)   # 以这些前缀开头的工具结果不清理





    def clear_old_tool_results(messages, keep=KEEP_RECENT_TOOL_RESULTS):

        tool_idx = [i for i, m in enumerate(messages)

                    if m["role"] == "tool" and not m["content"].startswith(KEEP_PREFIXES)]

        old = tool_idx[:-keep] if keep > 0 else tool_idx

        for i in old:

            messages[i]["content"] = PLACEHOLDER





只改了一个过滤条件。注意它只对第 2 层生效：到了第 3 层摘要压缩，早期加载的技能一样会被压进摘要。这没关系，压缩之后如果还需要，模型可以再调用一次 
`load_skill`
。



### 3\. agent.py：组装 system prompt





    import skills      # noqa: F401  导入即注册 load_skill



    BASE_SYSTEM = ("你是一个能使用工具的助手，在用户的工作区内完成任务。"

                   "必要时调用工具，完成后用简洁的语言汇报结果。")





    def build_system():

        return BASE_SYSTEM + skills.project_notes() + skills.skills_section()






`import skills`
 这一行容易漏。
`@tool`
 装饰器是在模块被导入时执行注册的，不导入，
`load_skill`
 就不会出现在工具列表里。



还有一处要注意：第 4 课的会话持久化会把 system prompt 一起存进 JSON。如果你加了新技能，再加载旧会话，模型看到的还是旧的技能列表。所以加载会话后，用 
`build_system()`
 覆盖掉第一条：





    def main():

        messages = load_session("default") or [{"role": "system", "content": ""}]

        messages[0] = {"role": "system", "content": build_system()}   # 每次用最新的技能列表

        ...





* * *



## 05跑起来



在工作区里放好 
`skills/git-commit/SKILL.md`
，然后：





    你> 我改完了 permissions.py，帮我提交一下



    🔧 load_skill({"name": "git-commit"})

    🔧 run_shell({"command": "git diff --staged"})

    ⚠️  Agent 想执行：run_shell

      $ git diff --staged

    [y]允许 / [n]拒绝 > y

    🔧 run_shell({"command": "git commit -m \"feat: 技能目录设为只读\n\n防止注入内容被写入技能后反复触发\""})

    ...





以上为示意输出，具体步骤取决于模型。值得观察的是第一步：没有人告诉它"去读提交规范"，是它看到技能列表里那一行描述后自己决定的。



你也可以反过来测：问它一个和任何技能都无关的问题，确认它**不会** 去加载技能。按需加载的价值一半在于"该加载时加载"，另一半在于"不该加载时不加载"。



* * *



## 06验证





    # tests/test_skills.py（conftest.py 会把工作区指向临时目录）

    import skills, context

    from permissions import WORKSPACE, PermissionManager





    def write_skill(name, text):

        d = WORKSPACE / "skills" / name

        d.mkdir(parents=True, exist_ok=True)

        (d / "SKILL.md").write_text(text, encoding="utf-8")





    def test_parse_skill():

        meta, body = skills.parse_skill("---\nname: a\ndescription: 做 A: 带冒号\n---\n正文")

        assert meta == {"name": "a", "description": "做 A: 带冒号"} and body == "正文"

        assert skills.parse_skill("---\nname: a\n没闭合")[0] == {}





    def test_discover_and_load():

        write_skill("git-commit", "---\nname: git-commit\ndescription: 写提交信息\n---\n规则正文")

        write_skill("broken", "---\nname: broken\n---\n没有描述")

        assert "broken" not in skills.discover()

        assert skills.load_skill("git-commit").startswith("[skill] git-commit")

        assert skills.load_skill("nope").startswith("Error")





    def test_skill_dir_readonly_even_if_user_says_yes():

        pm = PermissionManager(ask=lambda n, a: ("y", ""))

        assert not pm.check("write_file", {"path": "skills/x/SKILL.md", "content": ""}).allowed

        assert pm.check("write_file", {"path": "notes.txt", "content": ""}).allowed





    def test_clear_keeps_skill():

        msgs = [{"role": "system", "content": ""},

                {"role": "tool", "tool_call_id": "s", "content": "[skill] x\n正文"}]

        msgs += [{"role": "tool", "tool_call_id": str(i), "content": f"r{i}"} for i in range(5)]

        context.clear_old_tool_results(msgs, keep=1)

        assert msgs[1]["content"].startswith("[skill]")

        assert msgs[-1]["content"] == "r4"





第三个测试和第 3 课的思路一样：用户"愿意放行"，硬规则依然拒绝。



* * *



## 07这一版的局限



  1. **加不加载，由模型决定。** 这是按需加载的代价。描述写得含糊，模型可能该用不用；描述写得太宽，它可能什么任务都去加载。没有代码层面的保证，只能靠写好 description，并像上一节那样正反都测一下。

  2. **技能就是提示词，也就是注入入口。** 写保护只防住了 Agent 自己改技能。如果你从网上下载别人写的技能，里面写了什么，模型就会照做什么。只安装你读过的技能。

  3. **技能正文会被截断。** 工具结果进入 messages 前会经过第 4 课的 
`truncate_tool_result`
（默认 4000 字）。
`SKILL.md`
 要写短，大块内容拆成附件，让模型按需读。

  4. **被保护的技能内容会累积。** 一次会话里加载了很多技能，它们都不会被第 2 层清理，只能等第 3 层压缩。技能数量多的场景，这里需要更细的策略。

  5. **技能列表在会话开始时生成。** 运行过程中新增的技能，要到下一次构建 system prompt 时才会出现。



* * *



## 08主流 Agent 怎么做



**同一个格式，各家都认。** Agent Skills 已经成了事实上的开放标准：Claude Code、Codex、Pi、DeepSeek Harness、Hermes 都用 
`SKILL.md`
，开头一段 
`name`
 和 
`description`
，正文按需加载。所以本课写的技能文件，基本可以直接拿到这些产品里用，反过来也一样。项目级说明也一样：Codex 和 Grok Build 读 
`AGENTS.md`
，Pi 会读 
`AGENTS.md`
 和 
`CLAUDE.md`
，Claude Code 读 
`CLAUDE.md`
。



**加载方式也一样。** 平时只放名字和一句话描述，任务匹配时才读全文，附带的文件再按需读。Pi 还允许用户直接用 
`/skill:名字`
 手动调用。手动触发补的是第七节的局限 1：模型判断不准时，人可以直接指定。



**分歧在于：Agent 能不能写自己的技能。** 本课的选择是不能，技能目录对 Agent 只读，理由是防止注入内容被写进技能、之后反复触发。



Hermes 走的是相反的路。它的卖点是"自我改进"：从做过的任务里总结出新的技能，在使用中继续改进它们，之后遇到类似任务直接调用。DeepSeek Harness 也有一个 Creator 模式，可以在对话里检查运行时、测试新写的插件。



两种选择都说得通，代价不同：



| 技能只读（本课） | Agent 自己写技能（Hermes）

---|---|---

好处 | 技能都是你读过的，注入写不进去 | 越用越顺手，不用你手写规则

代价 | 规则全靠你手写、手动维护 | 一次被注入的内容可能固化成技能，之后每次都触发

适合 | 能执行命令、动文件的 Agent | 对自动沉淀要求高、能接受定期审查的场景



如果想要后者，比较稳妥的折中是：让 Agent 把新技能写到一个"待审核"目录，你看过之后再挪进 
`skills/`
。



## 09本课小结



  * 问题：所有说明都放进 system prompt，每一轮都付费，还会互相干扰

  * 方案：
`AGENTS.md`
 一直在场；技能只放一行目录，正文由模型调用 
`load_skill`
 按需读取

  * 安全：技能目录对 Agent 只读，写在硬规则里

  * 衔接：技能内容带 
`[skill]`
 标记，不被第 4 课的第 2 层清理



到这里，Agent 还是一个只能在终端里用的程序。你关掉终端，它就停了。



## 下期预告：接入聊天软件



下一课：**接入消息渠道** 。把输入输出从终端里拆出来，让它在聊天软件里常驻，权限确认也改成在手机上回复 y / n。



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-05/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-05)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[Agent Skills 开放标准（agentskills.io）](https://agentskills.io/)


  * 
[Codex 文档：Agent Skills](https://developers.openai.com/codex/skills)


  * 
[Pi coding agent（pi.dev）](https://pi.dev/)


  * 
[Hermes Agent（GitHub）](https://github.com/NousResearch/hermes-agent)


  * 
[DeepSeek Harness Tutorial（DataCamp）](https://www.datacamp.com/tutorial/deepseek-harness)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)




---

title: "定时任务与心跳：让 Agent 主动找你"

date: "2026-11-09"

source: "纳米AI（nano-ai.tech）"

url: "https://namiai.tech/articles/agent-scheduler/"

description: "无人值守的预授权、错过不补跑、心跳没事不打扰；对照 OpenClaw 心跳、Claude Code Routines、Grok Bot。"

---



# 定时任务与心跳：让 Agent 主动找你




[从零手写 Agent · EP07](/agent/)




Scheduler & Heartbeat



> 上一课，Agent 住进了聊天软件。但它还是被动的：你不发消息，它就什么都不做。



一个真正的个人助手，应该能做这些事：



  * 每天早上 9 点，把某个网页的更新整理好发给你

  * 每半小时看一眼 inbox 目录，有新文件才通知你，没有就不打扰



这一课加上这个能力，新增约 150 行。



先说结论：**定时本身是这一课最简单的部分。** 真正需要设计的是，到点执行时没有人在旁边，前面几课辛苦建立的"危险操作先问人"该怎么办。



* * *



## 01问题：无人值守



第 3 课的权限系统有一个前提：需要确认时，有人可以回答。



定时任务打破了这个前提。凌晨 3 点任务触发，Agent 想执行一个需要确认的操作，它该问谁？



有三种选择：



做法 | 问题

---|---

照常发确认消息，等你回复 | 你在睡觉，超时拒绝，任务白跑；或者早上被一串确认消息淹没

定时任务跳过权限检查 | 等于在你不在的时候拆掉闸门，而且这时它读到的网页内容最没人看管

**创建任务时预授权** | 有人的时候做决定，没人的时候按决定执行



我们用第三种：**你在场的时候（创建任务时）决定它能用哪些工具，你不在场的时候（执行时）只允许这些。**



* * *



## 02四个设计决定



**1\. 预授权有上限。** 只有 
`fetch_url`
 和 
`write_file`
 可以被预授权。
`run_shell`
 不行，和第 3 课里它不能"一直允许"是同一个理由：每条命令都不一样，事先授权等于不授权。



**2\. 定时任务不能创建定时任务。** 
`schedule_task`
 本身被登记为 CONFIRM 级别，并且不在可预授权的范围里。所以任务运行时调用它，会被直接拒绝。否则一次提示词注入就可能让 Agent 给自己排上一串任务，问题会自我复制。



**3\. 错过了不补跑，并且先记下一次再执行。** 电脑关机 5 小时，"每小时一次"的任务开机后只跑一次，不是连跑 5 次。下次执行时间在任务**开始前** 就写入文件，这样即使任务执行时把程序搞崩了，重启后也不会立刻再跑一遍、再崩一次。



**4\. 每次执行用独立的会话。** 定时任务不进你的聊天记录，不吃你聊天会话的上下文，也不受你在聊天里"一直允许"过的权限影响。跑完就丢，只把结果发给你。



另外还有一种特殊任务叫**心跳** ：Agent 定期检查一件事，没有值得汇报的内容时只回复一个约定的标记 
`HEARTBEAT_OK`
，程序看到这个标记就不发消息。这样"每半小时检查一次"就不会变成"每半小时打扰你一次"。



* * *



## 03代码：scheduler.py



### 时间规则



只支持两种写法，够用且不容易写错：





    """scheduler.py —— 第 7 课：定时任务与心跳"""

    import json

    import re

    import uuid

    from datetime import datetime, timedelta

    from pathlib import Path



    from context import STATE_DIR   # 第 4 课定义的状态目录，在工作区之外，Agent 不能直接改

    from tools import tool



    TASKS_FILE = STATE_DIR / "tasks.json"

    MIN_INTERVAL = timedelta(minutes=5)

    MAX_TASKS = 20

    PREAUTHORIZABLE = {"fetch_url", "write_file"}  # run_shell 不能预授权

    HEARTBEAT_OK = "HEARTBEAT_OK"



    CURRENT = {"chat_id": None}   # 当前正在对话的聊天，由 bot.py 设置





    def next_run(spec, after):

        """支持两种写法：every 30m / every 2h / daily 09:00"""

        spec = spec.strip().lower()

        m = re.fullmatch(r"every\s+(\d+)\s*([mh])", spec)

        if m:

            n = int(m[1])

            delta = timedelta(minutes=n) if m[2] == "m" else timedelta(hours=n)

            if delta < MIN_INTERVAL:

                raise ValueError(f"间隔不能小于 {MIN_INTERVAL}")

            return after + delta

        m = re.fullmatch(r"daily\s+(\d{1,2}):(\d{2})", spec)

        if m:

            h, mi = int(m[1]), int(m[2])

            if h > 23 or mi > 59:

                raise ValueError("时间不合法")

            t = after.replace(hour=h, minute=mi, second=0, microsecond=0)

            return t if t > after else t + timedelta(days=1)

        raise ValueError(f"看不懂的时间规则：{spec!r}，支持 every 30m / every 2h / daily 09:00")





为什么不支持 cron 表达式？因为写规则的经常是模型。规则越简单，模型越不容易写错；写错时报错信息里直接给出正确写法，模型看到就能改，这是第 2 课"错误也是结果"的又一次应用。



最小间隔 5 分钟，是给费用设的下限。每次执行至少是一次模型调用。




`tasks.json`
 和第 4 课的会话记录一样，放在 
`~/.nami-agent/`
，**不在工作区里** 。如果放在工作区内，Agent 就能用 
`write_file`
 直接改任务文件，绕过 
`schedule_task`
 的确认。



### 任务的存取





    class Scheduler:

        def __init__(self, path=TASKS_FILE, now=datetime.now):

            self.path = Path(path)

            self.now = now

            self.tasks = json.loads(self.path.read_text("utf-8")) if self.path.exists() else []



        def _save(self):

            self.path.parent.mkdir(parents=True, exist_ok=True)

            tmp = self.path.with_suffix(".tmp")

            tmp.write_text(json.dumps(self.tasks, ensure_ascii=False, indent=2), "utf-8")

            tmp.replace(self.path)          # 原子替换：写一半崩溃也不会留下坏文件



        def add(self, spec, prompt, chat_id, allow=(), kind="task"):

            if len(self.tasks) >= MAX_TASKS:

                raise ValueError(f"最多 {MAX_TASKS} 个任务")

            bad = set(allow) - PREAUTHORIZABLE

            if bad:

                raise ValueError(f"这些工具不能预授权：{', '.join(sorted(bad))}")

            task = {"id": uuid.uuid4().hex[:6], "spec": spec, "prompt": prompt,

                    "chat_id": chat_id, "allow": sorted(allow), "kind": kind,

                    "next_run": next_run(spec, self.now()).isoformat(timespec="seconds")}

            self.tasks.append(task)

            self._save()

            return task



        def remove(self, task_id, chat_id=None):

            before = len(self.tasks)

            self.tasks = [t for t in self.tasks

                          if not (t["id"] == task_id and (chat_id is None or t["chat_id"] == chat_id))]

            self._save()

            return len(self.tasks) < before



        def due(self):

            now = self.now()

            return [t for t in self.tasks if datetime.fromisoformat(t["next_run"]) <= now]



        def mark_started(self, task):

            # 从"现在"算下一次，而不是从原定时间算：停机期间错过的不补跑

            task["next_run"] = next_run(task["spec"], self.now()).isoformat(timespec="seconds")

            self._save()





    SCHED = None





    def get_scheduler():

        global SCHED

        if SCHED is None:

            SCHED = Scheduler()

        return SCHED





两个细节：



  * 
`now`
 可以从外面传入。测试"停机 5 小时"不需要真的等 5 小时，传一个假时钟就行。

  * 保存时先写临时文件再替换。程序在写文件的瞬间被杀掉，留下的要么是旧文件，要么是新文件，不会是写了一半的坏 JSON。




`mark_started`
 是"错过不补跑"的全部实现：下一次时间从**现在** 开始算，而不是从原定时间开始算。



### 无人值守的权限





    def make_task_ask(task):

        """无人值守：只放行创建任务时预授权过的工具"""

        allowed = set(task.get("allow", []))



        def ask(name, args):

            if name in allowed:

                return "y", ""

            return "n", "这是无人值守的定时任务，该操作没有被预授权"

        return ask





这是 
`ask`
 的第三种实现。第 3 课是终端里问，第 6 课是聊天里问，这一课是"按事先的决定回答"。
`PermissionManager`
 一行没改。



注意这个 
`ask`
 只在第 3 关生效。第 1 关的硬规则（路径越界、危险命令、技能目录只读）依然在它前面，预授权了 
`write_file`
 也写不到工作区外面去。SAFE 级别的工具（读文件、列目录、加载技能）照常直接放行。



### 给模型的提示





    HEARTBEAT_PROMPT = (f"这是一次例行检查。按下面的要求检查；如果没有任何需要告诉用户的内容，"

                        f"只回复 {HEARTBEAT_OK}，不要回复其他任何文字。\n要求：")





    def task_input(task):

        head = f"[定时任务 {task['id']}，无人值守，需要确认的操作会被拒绝]\n"

        if task["kind"] == "heartbeat":

            return head + HEARTBEAT_PROMPT + task["prompt"]

        return head + task["prompt"]





开头那一行告诉模型"没人在"。它就不会写出"请确认是否继续"这种没人能回答的话，被拒绝时也更容易理解为什么。



### 给模型的工具





    @tool(

        name="schedule_task",

        description=("创建一个定时任务，到时间后 Agent 会在无人值守的情况下执行 prompt，并把结果发给用户。"

                     "spec 写法：every 30m / every 2h / daily 09:00。"

                     "kind=heartbeat 表示例行检查，没有需要汇报的内容时不打扰用户。"

                     "allow 是逗号分隔的预授权工具，只能从 fetch_url、write_file 中选，可以为空。"),

        parameters={"type": "object", "properties": {

            "spec": {"type": "string"}, "prompt": {"type": "string"},

            "kind": {"type": "string", "enum": ["task", "heartbeat"]},

            "allow": {"type": "string"}}, "required": ["spec", "prompt"]},

    )

    def schedule_task(spec, prompt, kind="task", allow=""):

        if CURRENT["chat_id"] is None:

            return "Error: 只能在消息渠道里创建定时任务"

        allow_set = {a.strip() for a in allow.split(",") if a.strip()}

        try:

            t = get_scheduler().add(spec, prompt, CURRENT["chat_id"], allow_set, kind)

        except ValueError as e:

            return f"Error: {e}"

        return f"已创建任务 {t['id']}，下次执行：{t['next_run']}"





另外两个工具，查看和取消，都只作用于当前聊天自己的任务：





    def format_tasks(tasks):

        if not tasks:

            return "当前没有定时任务。"

        return "\n".join(f"{t['id']}  {t['spec']}  下次 {t['next_run']}  "

                         f"{'[心跳] ' if t['kind'] == 'heartbeat' else ''}{t['prompt'][:40]}"

                         + (f"  预授权：{','.join(t['allow'])}" if t["allow"] else "")

                         for t in tasks)





    @tool("list_tasks", "列出当前聊天的所有定时任务。", {"type": "object", "properties": {}})

    def list_tasks():

        return format_tasks([t for t in get_scheduler().tasks if t["chat_id"] == CURRENT["chat_id"]])





    @tool("cancel_task", "取消一个定时任务。",

          {"type": "object", "properties": {"task_id": {"type": "string"}}, "required": ["task_id"]})

    def cancel_task(task_id):

        ok = get_scheduler().remove(task_id, CURRENT["chat_id"])

        return f"已取消 {task_id}" if ok else f"Error: 没有找到任务 {task_id}"





在 
`permissions.py`
 里登记风险等级：





    TOOL_RISK = {

        ...

        "list_tasks": Risk.SAFE,

        "schedule_task": Risk.CONFIRM,

        "cancel_task": Risk.CONFIRM,

    }






`schedule_task`
 是 CONFIRM，所以你在聊天里说"每天早上帮我……"时，会收到一条确认消息，里面展示的是真实参数：时间规则、任务内容、**预授权了哪些工具** 。这一刻就是"有人在场时做决定"的那一刻，值得认真看一眼。



* * *



## 04接入：bot.py



改动有四处。



**1\. 缩短轮询时间。**





    POLL_TIMEOUT = 10        # 给调度器留出检查的机会



    tg = Telegram(os.environ["TG_BOT_TOKEN"], timeout=POLL_TIMEOUT)





长轮询在没有消息时会挂住，挂多久，调度器就多久才能检查一次。10 秒意味着任务最多晚 10 秒左右触发。



**2\. 每轮循环检查到期任务。**





    def run_due_tasks(tg, client):

        sched = scheduler.get_scheduler()

        for task in sched.due():

            sched.mark_started(task)        # 先记下一次，再执行：任务崩了也不会反复重跑

            s = Session(f"task-{task['id']}", ask=scheduler.make_task_ask(task), persist=False)

            try:

                reply = run(s, scheduler.task_input(task), client)

            except Exception as e:

                reply = f"[定时任务出错] {type(e).__name__}: {e}"

            if task["kind"] == "heartbeat" and reply.strip() == scheduler.HEARTBEAT_OK:

                print(f"[心跳] {task['id']} 无事")

                continue

            tg.send(task["chat_id"], f"⏰ 任务 {task['id']}\n{reply}")






`persist=False`
：每次都是全新的会话，不读也不写会话文件。



主循环在处理完消息后调用它：





    for chat_id, user_id, text in batch:

        handle_message(tg, client, sessions, chat_id, user_id, text)

    run_due_tasks(tg, client)





消息处理和任务执行在同一个线程里轮流进行，所以不会出现"一个会话同时被两件事修改"的情况。代价下面会说。



**3\. 告诉工具"现在是哪个聊天"。**




`schedule_task`
 需要知道结果发给谁。在 
`handle_message`
 里运行 Agent 前后设置：





    scheduler.CURRENT["chat_id"] = chat_id

    try:

        reply = run(s, text, client)

    except Exception as e:

        s.messages[:] = backup

        reply = f"[出错，本轮已撤销] {type(e).__name__}: {e}"

    finally:

        scheduler.CURRENT["chat_id"] = None





用 
`finally`
 保证一定会清空。定时任务运行时 
`CURRENT`
 是空的，这又多了一道保险：即使权限那一关出了问题，
`schedule_task`
 也会返回错误。



**4\. 加一个不经过模型的命令。**





    if cmd == "/tasks":

        tg.send(chat_id, scheduler.format_tasks(

            [t for t in scheduler.get_scheduler().tasks if t["chat_id"] == chat_id]))

        return





查看任务列表这种事，答案是确定的，不需要模型，也不应该花 token。



另外，
`agent.py`
 里要加一行 
`import scheduler`
，理由和第 5 课的 
`import skills`
 一样：不导入，工具就没有注册。



* * *



## 05心跳：值得单独算一笔账



心跳的价值在于"没事不打扰"，但它的成本是实打实的：**不管有没有事，每次都要调用模型。**



每 30 分钟一次，一天就是 48 次调用；如果模型每次检查要调用两三次工具，实际请求数还要翻几倍。所以适合做心跳的，是那种**检查成本低、但需要及时知道** 的事情，比如一个目录里有没有新文件。需要大量抓取和分析的，更适合做成每天一次的普通任务。



还有一个现实问题：模型不一定百分之百只回复 
`HEARTBEAT_OK`
。它可能会说"HEARTBEAT_OK，一切正常"。这里的判断用的是严格相等，这种情况会被当成有事而发出来。宁可多打扰一次，也不要把真正有事的回复误判成没事。



* * *



## 06跑起来



示意如下：





    你：每天早上 9 点，帮我看一下 https://example.com/changelog 有没有新内容，有的话总结成三条发给我



    Agent：⚠️ Agent 想执行：schedule_task

      {'spec': 'daily 09:00', 'prompt': '抓取 https://example.com/changelog，与 workspace/changelog-last.md 对比……', 'allow': 'fetch_url,write_file'}

    回复 y 允许 / n 拒绝（可附原因，如：n 先列出来给我看）

    120 秒内不回复视为拒绝。



    你：y

    Agent：已创建任务 3f9a1c，每天 09:00 执行。它可以在无人值守时抓取网页、写入工作区文件。



    你：/tasks

    Agent：3f9a1c  daily 09:00  下次 2026-10-29T09:00:00  抓取 https://example.com/changelog，与 wo…  预授权：fetch_url,write_file





注意确认消息里的 
`allow`
。它是模型根据任务需要自己填的：要对比上次的内容，就需要写文件保存这次的结果。如果它申请的权限比任务需要的多，这是你拒绝的最好时机。



* * *



## 07验证





    from datetime import datetime, timedelta

    import pytest

    import scheduler

    from permissions import PermissionManager





    def test_next_run():

        t = datetime(2026, 10, 28, 10, 0)

        assert scheduler.next_run("every 30m", t) == t + timedelta(minutes=30)

        assert scheduler.next_run("daily 09:00", t) == datetime(2026, 10, 29, 9, 0)   # 今天已过，排到明天

        assert scheduler.next_run("daily 11:30", t) == datetime(2026, 10, 28, 11, 30)

        for bad in ("every 1m", "daily 25:00", "每天九点"):

            with pytest.raises(ValueError):

                scheduler.next_run(bad, t)





    def test_no_catch_up_and_preauth(tmp_path):

        now = [datetime(2026, 10, 28, 8, 0)]

        s = scheduler.Scheduler(tmp_path / "t.json", now=lambda: now[0])

        task = s.add("every 1h", "看看", chat_id=1, allow={"fetch_url"})

        with pytest.raises(ValueError):

            s.add("every 1h", "x", 1, allow={"run_shell"})     # run_shell 不能预授权

        now[0] = datetime(2026, 10, 28, 13, 5)                  # 停机 5 小时

        assert len(s.due()) == 1                                # 只到期一次，不是五次

        s.mark_started(task)

        assert s.due() == [] and task["next_run"] == "2026-10-28T14:05:00"





    def test_task_cannot_schedule_tasks_or_shell():

        pm = PermissionManager(ask=scheduler.make_task_ask({"allow": ["fetch_url"]}))

        assert pm.check("fetch_url", {"url": "https://x"}).allowed          # 预授权过

        assert not pm.check("run_shell", {"command": "ls"}).allowed         # 没有人能确认

        assert not pm.check("schedule_task", {"spec": "every 5m", "prompt": "x"}).allowed

        assert pm.check("read_file", {"path": "a.txt"}).allowed             # SAFE 照常放行





第三个测试把本课的安全设计浓缩成了四行断言，建议你改动权限相关代码后都跑一遍。



心跳"没事不发消息"也可以测：用一个按顺序返回 
`HEARTBEAT_OK`
 和一段普通文字的假模型客户端，跑一次 
`run_due_tasks`
，断言只发出了一条消息。



* * *



## 08这一版的局限



  1. **时间不精确。** 误差至少是轮询间隔（10 秒），如果此时正在处理一个长任务或者正在等你确认，任务会一直等到那件事结束。

  2. **任务串行执行。** 同一时刻到期的三个任务，依次跑完才回去处理消息。

  3. **用的是本地时间。** 服务器时区和你所在时区不一致时，
`daily 09:00`
 指的是服务器的 9 点。有夏令时的地区，切换那天的行为也没有专门处理。

  4. **预授权的
`fetch_url`
 是注入风险最高的组合。** 无人值守、读取外部网页，正是提示词注入最容易得手的场景。硬规则和"任务不能创建任务"限制了它能造成的破坏，但它仍然可以在工作区里写入文件，以及给你发一条内容被操纵的消息。对定时任务发来的内容，要保持基本的怀疑。

  5. **心跳判断太死板。** 模型回复"HEARTBEAT_OK，一切正常"就会被当成有事发出来。第九节会看到 OpenClaw 怎么处理这个问题。



* * *



## 09主流 Agent 怎么做



**OpenClaw 的心跳：本课的原型。** "心跳"和 
`HEARTBEAT_OK`
 这两个概念，来自 OpenClaw。它的做法比我们细：



  * 默认每 30 分钟一次，可以配置，也可以关掉

  * 工作区里放一份 
`HEARTBEAT.md`
 清单，告诉它每次检查什么；清单是空的，就直接跳过，连模型都不调用

  * 
`HEARTBEAT_OK`
 出现在回复的开头或结尾时会被去掉，剩下的文字不超过 300 字就不发。这正好解决了我们"严格相等太死板"的问题

  * 可以设置活跃时段，半夜不跑

  * 默认在主会话里跑，也可以设成每次用全新的会话，省 token。我们的做法相当于后者



**Hermes：内置 cron。** 用自然语言描述的任务，到点无人值守地执行，结果发到任何一个它接入的平台。每次运行都是一个全新的隔离会话，并且和本课的设计一样：**定时任务运行时不能再创建定时任务** ，防止自动化失控。



**Claude Code：本地和云端两套。** 本地有 
`/loop`
，在当前会话里定期重复执行；云端有定时任务（Routines），在 Anthropic 的云环境里跑，你的电脑关了也照常执行。



**DeepSeek Harness：定时也是插件。** 它的定时任务是一个实验性的官方插件，模型通过 
`schedule_create`
 这样的工具创建任务，比如"每周五 17:00（上海时间）执行某段提示"。和本课的 
`schedule_task`
 几乎是同一个设计：让模型自己写定时规则。



**Grok Bot：常驻本身就是卖点。** 每个 bot 有自己的云电脑，你不在、电脑关机，它都在跑。重复的多步流程可以存成 routine，需要你拍板的时候它发消息问你。



几家都绕不开本课的核心问题：**没人在场时，谁来批准。** 我们的答案是"创建时预授权，且有上限"；Claude Code 的 auto 模式让另一个模型来审；DeepSeek Harness 有实验性的自动审批插件；Grok Bot 停下来等你。没有哪种是免费的：预授权要你事先想清楚，模型审核会误判，等人则会让任务卡住。



## 10第一部分小结



七课下来，nami-agent 的结构是这样的：





    tools.py         第2课  工具注册与统一执行（第3课加固）

    permissions.py   第3课  硬规则 → 风险分级 → 确认（ask 可替换）

    context.py       第4课  截断 → 清理 → 摘要，会话持久化，状态目录

    skills.py        第5课  AGENTS.md 常驻，技能按需加载

    agent.py         第1课起 Session + 主循环，第6课与 I/O 分离

    telegram.py      第6课  长轮询渠道

    bot.py           第6课  白名单、聊天确认、出错回滚

    scheduler.py     第7课  定时任务、心跳、无人值守的预授权





回头看，这七课反复出现的是同一个结构：**模型只提出请求，代码决定执行与否、执行多少、结果怎么回去。** 循环、工具、权限、上下文、技能、渠道、调度，都是在这个结构上加的东西。



如果你从第 1 课跟到这里，你手里已经有一个能读懂、能改、能常驻的最小 Agent。



## 下期预告：MCP



和主流产品相比，它还缺四样主流 Agent 都有的能力：MCP、子 Agent、计划、跨会话记忆。第二部分的四课逐一补上。第一个是 MCP：让 Agent 用上别人写好的工具。



* * *



参考：



  * 本课完整代码：GitHub 上 
[NamiAgent](https://github.com/aa1143/NamiAgent)
 的 [
`lessons/lesson-07/`
](https://github.com/aa1143/NamiAgent/tree/main/lessons/lesson-07)（也可以
[下载压缩包](/downloads/nami-agent.zip)
）

  * 
[OpenClaw 文档：Heartbeat](https://docs.openclaw.ai/zh-CN/gateway/heartbeat)


  * 
[Hermes Agent（GitHub）](https://github.com/NousResearch/hermes-agent)


  * 
[Claude Code 文档：Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)


  * 
[DeepSeek Harness 官方页面](https://deepseek.com/en/harness/)


  * 
[Grok Bot 发布报道（GIGAZINE）](https://gigazine.net/gsc_news/en/20260812-spacexai-grok-bot/)




_配套图解_ ：
[Agent 是怎么工作的：看上下文在每一轮怎么变化 →](/matrix/agent/)


 _配套代码_ ：
[GitHub · NamiAgent（每课一个目录，可直接运行）](https://github.com/aa1143/NamiAgent)
，或
[下载压缩包](/downloads/nami-agent.zip)




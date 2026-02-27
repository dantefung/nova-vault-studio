# 用纯 Tkinter 实现一个全屏久坐提醒工具（无任何第三方依赖）

> 目标：  
> 使用 Python 标准库实现一个真正有“强制休息效果”的久坐提醒工具。  
> 不依赖任何第三方库，仅使用：
>
> - tkinter（标准库 GUI）
> - datetime（标准库）

---

# 一、功能说明

本版本实现：

1. 全屏显示
2. 始终置顶
3. 倒计时提醒
4. 每秒刷新动画
5. 时间到自动关闭
6. 无需任何额外依赖

这是一个“强提醒”版本，而不是普通弹窗版本。

---

# 二、实现思路

核心机制：

- 使用 `root.wm_attributes("-fullscreen", 1)` 实现全屏
- 使用 `root.wm_attributes("-topmost", 1)` 实现置顶
- 使用 `after()` 每秒执行更新函数
- 使用 `datetime` 显示当前时间
- 倒计时结束调用 `root.destroy()` 自动关闭

程序流程：

启动 → 全屏显示 → 每秒更新 → 倒计时结束 → 自动关闭

---

# 三、完整代码

**提示版**

```python
# -*- coding: utf-8 -*-
"""
不需要任何额外依赖
tkinter (Python 标准库 GUI)
datetime (Python 标准库)

全屏久坐提醒小程序
功能：
1. 全屏 + 置顶
2. 倒计时提醒站起来活动
3. 每秒更新内容
4. 时间到自动关闭
"""

import datetime as dt
import tkinter as tk


sec = 30  # 倒计时秒数

root = tk.Tk()
root.title("动起来 - 别久坐")

root.config(bg="black")
root.wm_attributes("-topmost", 1)
root.wm_attributes("-fullscreen", 1)


label = tk.Label(
    root,
    font=("Consolas", 50),
    bg="black",
    fg="white"
)

label.place(relx=0.5, rely=0.5, anchor=tk.CENTER)


msg_template = "{}\n 站起来 {} \n 动一动 {}\n{}"

arrow_map = {
    0: "↑",
    1: "→",
    2: "↓",
    3: "←"
}

move_map = {
    0: "~~_↑_~~",
    1: "~_↑ ↑_~"
}


def update(count):
    if count > 0:
        now_time = dt.datetime.now().ctime()

        text = msg_template.format(
            count,
            arrow_map[count % 4],
            move_map[count % 2],
            now_time
        )

        label.config(text=text)
        root.after(1000, update, count - 1)
    else:
        root.destroy()


update(sec)
root.mainloop()
```

---

**完整版（BreakReminder.py）**

```
# -*- coding: utf-8 -*-

import tkinter as tk
import datetime as dt

REMIND_INTERVAL_SEC = 60 * 60
COUNTDOWN_SECONDS = 60 * 2

root = tk.Tk()
root.title("久坐提醒")
root.geometry("400x300")   # 稍微大一点

is_paused = False
next_trigger_time = dt.datetime.now() + dt.timedelta(
    seconds=REMIND_INTERVAL_SEC
)

# =======================
# 使用 grid 布局（更稳定）
# =======================

root.columnconfigure(0, weight=1)
root.rowconfigure(0, weight=1)

main_frame = tk.Frame(root)
main_frame.grid(sticky="nsew", padx=10, pady=10)

main_frame.columnconfigure(0, weight=1)

status_label = tk.Label(main_frame, text="运行中",
                        font=("Consolas", 14))
status_label.grid(row=0, column=0, pady=5)

countdown_label = tk.Label(main_frame,
                           font=("Consolas", 16))
countdown_label.grid(row=1, column=0, pady=5)

clock_label = tk.Label(main_frame,
                       font=("Consolas", 10))
clock_label.grid(row=2, column=0, pady=5)

btn_frame = tk.Frame(main_frame)
btn_frame.grid(row=3, column=0, pady=10)

# =======================
# 弹窗提醒
# =======================

def show_reminder():
    win = tk.Toplevel()
    win.title("动起来 - 别久坐")
    win.config(bg="black")
    win.wm_attributes("-topmost", 1)
    win.wm_attributes("-fullscreen", 1)
    # 支持 ESC 退出当前提醒窗口
    win.bind("<Escape>", lambda e: win.destroy())
    label = tk.Label(win, font=("Consolas", 50),
                     bg="black", fg="white")
    label.place(relx=0.5, rely=0.5, anchor=tk.CENTER)

    msg_template = "{}\n 站起来 {} \n 动一动 {}\n{}"
    arrow_map = {0: "↑", 1: "→", 2: "↓", 3: "←"}
    move_map = {0: "~~_↑_~~", 1: "~_↑ ↑_~"}

    def update(count):
        if count > 0:
            now_time = dt.datetime.now().ctime()
            text = msg_template.format(
                count,
                arrow_map[count % 4],
                move_map[count % 2],
                now_time
            )
            label.config(text=text)
            win.after(1000, update, count - 1)
        else:
            win.destroy()

    update(COUNTDOWN_SECONDS)


# =======================
# 主界面更新
# =======================

def update_main_ui():
    global next_trigger_time

    now = dt.datetime.now()

    clock_label.config(
        text=now.strftime("当前时间: %Y-%m-%d %H:%M:%S")
    )

    if not is_paused:
        remaining = (next_trigger_time - now).total_seconds()

        if remaining <= 0:
            show_reminder()
            next_trigger_time = dt.datetime.now() + dt.timedelta(
                seconds=REMIND_INTERVAL_SEC)
            remaining = REMIND_INTERVAL_SEC

        countdown_label.config(
            text=f"下次提醒: {int(remaining)} 秒"
        )
        status_label.config(text="运行中")
    else:
        countdown_label.config(text="已暂停")
        status_label.config(text="暂停中")

    root.after(1000, update_main_ui)


# =======================
# 控制按钮
# =======================

def toggle_pause():
    global is_paused
    is_paused = not is_paused


def trigger_now():
    global next_trigger_time
    show_reminder()
    next_trigger_time = dt.datetime.now() + dt.timedelta(
        seconds=REMIND_INTERVAL_SEC)


tk.Button(btn_frame, text="立即提醒",
          command=trigger_now, width=12).pack(side="left", padx=5)

tk.Button(btn_frame, text="暂停 / 恢复",
          command=toggle_pause, width=12).pack(side="left", padx=5)

# =======================
# 启动
# =======================

update_main_ui()
root.mainloop()


```


---

# 四、运行方式

```bash
python BreakReminder.py
```

Linux 后台运行：

```bash
nohup python BreakReminder.py > /dev/null 2>&1 &
```

---

# 五、技术要点解析

## 为什么使用 after 而不是 sleep？

- tkinter 是单线程事件循环
- sleep 会阻塞 GUI
- after 是非阻塞定时回调

## 为什么使用 destroy 而不是 quit？

- destroy 会彻底销毁窗口
- quit 只退出主循环

对于一次性全屏提醒，destroy 更干净。

---

# 六、总结

这是一个极简但强力的久坐提醒实现。

优点：

- 纯标准库
- 无依赖
- 强制提醒
- 结构极简

适合学习 Tkinter 事件循环与 GUI 定时更新机制。

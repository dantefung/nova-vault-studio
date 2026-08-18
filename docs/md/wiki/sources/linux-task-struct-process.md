---
title: "不懂 task_struct，别说你懂 Linux 进程管理"
date: "2026-07-31"
source: "往事敬秋风"
url: "https://mp.weixin.qq.com/s/dkpTJ1kw5KaleGxHsuLl2w"
---

# 不懂 task_struct，别说你懂 Linux 进程管理

> task_struct 是 Linux 内核中进程控制块（PCB）的具体实现，是内核用于管理进程的核心数据结构。读懂 task_struct 就等于掌握了 Linux 进程管理的底层本质。

## 一、初识 task_struct 结构体

### 什么是 task_struct

在 Linux 内核中，task_struct 宛如进程的一份档案资料。它是一个结构体，用于对进程的各类属性以及状态进行描述。可以将其类比成一个人的简历——上面有进程从创建直至结束的所有关键信息。

- 定义于 `<linux/sched.h>` 头部文件
- 64 位系统上一般有几千字节大小，包含几百个字段
- 关键字段：`state`（进程状态）、`pid`（进程 ID）、`parent`（父进程指针）、`children`（子进程链表头）、`sibling`（兄弟进程链表指针）、`mm`（内存描述符）、`files`（文件描述符表）、`sched_entity`（调度实体）、`cred`（进程凭证）

### 进程与 task_struct 的关系

- **程序**：静态存在，存储在磁盘上，是一系列指令和数据的集合
- **进程**：程序动态执行的实例，运行时占用 CPU、内存、文件等系统资源
- **task_struct** = 进程控制块（PCB），内核管理进程的核心数据结构

当内核创建新进程时，首先分配一个 task_struct 结构体，用它来记录新进程的相关信息。进程从创建、运行直至结束的整个生命周期，内核都是通过操作这个 task_struct 结构体来对进程进行管理的。

## 二、剖析 task_struct 结构体

### 2.1 进程标识信息

```c
// 进程标识相关字段
pid_t pid;              // 进程唯一 ID
pid_t tgid;             // 线程组 ID
struct task_struct *real_parent;  // 真实父进程
struct task_struct *parent;       // 父进程
```

- **PID**：内核分配给每个进程的唯一标识，是一个非负整数，如同进程的身份证号码
- **PPID**：父进程的 PID，构建起进程之间的父子关系，形成进程树
- **TGID**：线程组 ID，同一线程组内所有线程具有相同的 TGID

用户态通过 `getpid()`、`getppid()`、`gettid()` 这些系统调用，本质上就是去读取 task_struct 里对应的 pid、tgid 字段。

### 2.2 进程状态字段

```c
// 进程状态宏定义
#define TASK_RUNNING         0
#define TASK_INTERRUPTIBLE   1
#define TASK_UNINTERRUPTIBLE 2

// task_struct 状态字段
volatile long state;
```

| 状态 | 含义 |
|------|------|
| `TASK_RUNNING` | 可运行状态：正在 CPU 上运行 / 在就绪队列等待调度 |
| `TASK_INTERRUPTIBLE` | 可中断睡眠：等待 I/O 或信号量，能被信号中断唤醒 |
| `TASK_UNINTERRUPTIBLE` | 不可中断睡眠：等待事件，不响应信号，只被显式唤醒 |

`state` 字段是进程状态唯一的存储之处，用户态下 `ps`、`top` 命令展示的 R/S/D 状态，实际上是内核读取 state 字段后转换而成的可视化字符。

### 2.3 调度相关字段

```c
struct task_struct {
    int prio;                        // 动态优先级
    int static_prio;                 // 静态优先级
    int rt_priority;                 // 实时优先级
    const struct sched_class *sched_class;  // 调度类指针
    struct sched_entity se;          // CFS 调度实体
};

struct sched_entity {
    u64 vruntime;                    // 虚拟运行时间
};
```

调度类从最高到最低优先级：`stop_sched_class` > `dl_sched_class`（Deadline） > `rt_sched_class`（实时） > `fair_sched_class`（CFS，普通进程） > `idle_sched_class`

**CFS 调度器核心逻辑**：用红黑树按 vruntime 排序，每次选取 vruntime 最小的进程来运行。

```c
struct task_struct *pick_next_task_fair(struct rq *rq) {
    struct sched_entity *se;
    struct task_struct *p;
    se = __pick_first_entity(&rq->cfs_tasks);          // 1. 取出 vruntime 最小
    p = container_of(se, struct task_struct, se);      // 2. 反向映射出 task_struct
    p->state = TASK_RUNNING;                            // 3. 标记即将运行
    return p;
}
```

### 2.4 内存管理相关

```c
struct task_struct {
    struct mm_struct *mm;        // 用户虚拟内存描述符
    struct mm_struct *active_mm; // 当前激活的内存描述符
};

struct mm_struct {
    pgd_t *pgd;                  // 页全局目录（页表基地址）
    struct vm_area_struct *mmap; // VMA 内存区域链表
    struct rb_root mm_rb;        // VMA 红黑树根节点
};
```

**关键区别**：
- **用户进程**：`mm` 指针非空，具备独立虚拟地址空间（代码段、数据段、堆、栈）
- **内核线程**：`mm` 为 NULL，仅通过 `active_mm` 复用内核页表，不创建自己的 mm_struct

### 2.5 文件系统与文件描述符

```c
struct task_struct {
    struct fs_struct *fs;    // 进程文件系统信息
    struct files_struct *files;  // 进程打开文件表
};

struct fs_struct {
    int umask;
    struct path root;        // 进程根目录
    struct path pwd;         // 进程当前工作目录
};

struct files_struct {
    struct file **fd;        // 文件对象指针数组
    unsigned long open_fds;  // 已打开文件描述符掩码
};
```

fd 数组的下标就是用户态的文件描述符（0=stdin, 1=stdout, 2=stderr）。

### 2.6 亲缘关系相关

```c
struct task_struct {
    struct task_struct *real_parent;
    struct task_struct *parent;
    struct list_head children;   // 子进程链表头
    struct list_head sibling;    // 兄弟进程链表节点
};
```

- `real_parent`：实际创建当前进程的父进程（被跟踪时可能不同于 parent）
- `parent`：当前进程的父进程
- `children`：子进程链表的头部
- `sibling`：兄弟进程链表节点

init 进程（PID=1）是根节点，所有进程通过父子关系相互连接，形成进程树。

## 三、task_struct 与进程调度

### 3.1 Linux 调度器

| 调度策略 | 适用场景 |
|----------|---------|
| **CFS**（Completely Fair Scheduler） | 普通进程默认，用 vruntime 衡量相对 CPU 时间，保证公平 |
| **SCHED_FIFO** | 非抢占式实时调度，获取 CPU 后一直占据直到主动放弃 |
| **SCHED_RR** | 抢占式实时调度，同优先级按时间片轮转 |

### 3.2 进程状态转换

```c
// 进程主动进入可中断睡眠
void task_sleep_example(void) {
    struct task_struct *curr = current;
    curr->state = TASK_INTERRUPTIBLE;  // 1. 修改状态
    schedule();                        // 2. 让出 CPU
}

// 唤醒阻塞进程
void wakeup_task_example(struct task_struct *p) {
    if (p->state == TASK_INTERRUPTIBLE || p->state == TASK_UNINTERRUPTIBLE) {
        p->state = TASK_RUNNING;  // 重新加入调度队列
    }
}
```

`current` 是内核全局宏，获取当前正在运行的进程的 task_struct。所有进程状态切换本质上都是对 state 字段的修改。

## 四、task_struct 与进程创建和终止

### 4.1 进程创建（fork）

fork 时内核为新进程分配 task_struct，大部分信息从父进程继承（优先级、文件描述符表、mm_struct——写时拷贝），仅修改 PID、PPID、状态等核心字段。

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid > 0) {
        printf("父进程: PID=%d, 子进程 PID=%d\n", getpid(), pid);
        wait(NULL);
    } else if (pid == 0) {
        printf("子进程: PID=%d, 父进程 PPID=%d\n", getpid(), getppid());
    }
    return 0;
}
```

- 父进程：fork 返回子进程的 PID
- 子进程：fork 返回 0

### 4.2 进程终止

子进程终止后进入僵尸态（task_struct 未释放），父进程需调用 `wait()` 或 `waitpid()` 回收资源。

```c
pid_t pid = fork();
if (pid == 0) {
    printf("子进程 %d 即将退出\n", getpid());
    return 0;  // 用户态资源释放，但 task_struct 仍在
} else if (pid > 0) {
    sleep(5);  // 不回收，子进程变为僵尸进程
    wait(NULL);  // 释放子进程 task_struct 资源
    printf("已回收子进程资源\n");
}
```

## 五、常见面试问题

### 5.1 进程和线程的区别

| 维度 | 进程 | 线程 |
|------|------|------|
| 资源分配 | 基本单元，独立地址空间 | 共享所属进程地址空间 |
| 调度 | 内核调度，上下文切换开销大 | 内核/用户态调度，切换开销小 |
| 通信 | 管道/消息队列/共享内存/信号量 | 直接共享全局变量/文件描述符 |

Linux 线程通过 `clone()` 系统调用创建，传入标志位控制资源共享程度：`CLONE_VM`（共享虚拟内存）、`CLONE_FS`（共享文件系统）、`CLONE_FILES`（共享文件描述符表）。

### 5.2 pid / tgid / ppid

| 字段 | 含义 | 单线程进程 | 多线程进程 |
|------|------|-----------|-----------|
| pid | 进程/线程唯一 ID | = tgid | 每个线程独立 |
| tgid | 线程组 ID | = pid | 所有线程相同（=主线程 pid） |
| ppid | 父进程 PID | 创建它的进程 | 同 pid |

### 5.3 ps 输出状态

| 状态 | 内核宏 | 含义 |
|------|--------|------|
| R | TASK_RUNNING | 可运行（正在执行/就绪队列） |
| S | TASK_INTERRUPTIBLE | 可中断睡眠 |
| D | TASK_UNINTERRUPTIBLE | 不可中断睡眠（不能 kill -9） |
| T | TASK_STOPPED / TASK_TRACED | 被停止/调试暂停 |
| Z | TASK_ZOMBIE | 僵尸进程（task_struct 未释放） |

> D 状态进程无法用 kill -9 杀掉，因为 kill -9 的本质是发送信号，而 D 状态不响应信号。如果进程老是处于 D 状态，可能是系统 I/O 瓶颈或硬件故障。
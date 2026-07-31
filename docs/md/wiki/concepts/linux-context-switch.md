---
title: "Linux 内核进程上下文切换"
date: "2026-07-31"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/HzpK4jHQnDeJMiuCV4wp1Q"
---

# Linux 内核进程上下文切换

上下文切换是 Linux 调度器将 CPU 执行权从一个任务移交到另一个任务的核心机制，本质是"CPU 执行权转移 + 可逆的状态保存/恢复"。

---

## 核心概念

### 上下文分类
- **用户上下文**：用户态寄存器、指令指针、栈指针、FPU 状态、TLS
- **内核上下文**：内核栈、调用链、跨调用保存的寄存器、调度状态、地址空间

### 三类切换

| 类型 | 说明 |
|------|------|
| 进程切换 | 不同地址空间，需切换 CR3/PCID/ASID 和页表 |
| 线程切换 | 共享 `mm_struct`，不需切换用户页表，但寄存器/栈/FPU/TLS 仍要处理 |
| 中断上下文 | 硬中断不切换进程，但中断退出后可能触发调度 |

---

## 切换流程

1. `schedule()` → `__schedule()` → 选择 next 任务
2. `context_switch()`：地址空间切换（`switch_mm_irqs_off()`）+ 寄存器/栈切换（`switch_to()`）
3. `switch_to()` 汇编：保存 callee-saved 寄存器 → 保存 `%rsp` → 加载新 `%rsp` → 弹出寄存器 → `jmp __switch_to()`
4. `finish_task_switch()` 收尾

### 任务选择演进
- 经典 CFS（Linux 5.x）：红黑树按 vruntime 排序，选最左实体
- Linux 6.6 EEVDF：lag 判断 eligibility，选虚拟截止时间更早的实体

---

## 开销分析

### 直接开销
寄存器读写、栈切换、运行队列加锁、调度类选择、统计更新、页表切换

### 间接开销（通常更严重）
- **缓存污染**：新任务工作集挤掉旧任务缓存行
- **TLB 失效**：需重新页表遍历
- **NUMA 迁移**：跨节点增加内存访问延迟

### 进程 vs 线程开销
线程切换不一定始终便宜——缓存和迁核代价取决于实际工作集和数据竞争程度。

---

## 线上排查工具链

| 工具 | 用途 |
|------|------|
| `vmstat` | 系统 cs、r、b、in |
| `pidstat -w` | 进程自愿/非自愿切换 |
| `pidstat -w -t` | 线程级切换 |
| `/proc/<PID>/status` | nvcsw/nivcsw |
| `perf stat` | 总切换数 |
| `perf sched latency` | 调度延迟 |
| `perf sched timehist` | 时间轴/等待/运行时间 |

---

## 优化原则

1. 活跃线程数匹配 CPU 核心数或下游容量
2. 减少共享状态，锁分片，缩短临界区
3. 避免惊群，唤醒要有针对性
4. 慎用 CPU 亲和性，防止负载失衡
5. 别乱改 `SCHED_FIFO`
6. 持续测量：vmstat → pidstat → perf sched → 火焰图

---

## 交叉引用

- [[vibe-coding]] — 协程减少内核线程切换
- [[task-decomposition-thinking-loop]] — 任务调度的思维模型

> 来源：Debug 蟹老板，微信公众号，2026-07-29
---
title: "不懂 Linux 内核中断，别说你懂内核驱动开发"
author: "Debug 蟹老板"
date: "2026年9月15日 20:51"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/lqUpv07U_-bFsnghdKby3g"
---

# 不懂 Linux 内核中断，别说你懂内核驱动开发

大家好，我是蟹老板~写了十多年代码，说实话，内核里我最怕碰的两个东西就是内存管理和中断子系统。但躲是躲不掉的，尤其是做Linux驱动开发或者性能优化，CPU 不仅需要知道“有中断来了”，还需要解决中断来自哪一个设备、应该运行哪一个处理函数、多个设备同时产生中断怎么办、多核 CPU 应该让哪一个 CPU 处理、中断处理时间过长又该怎么办等一系列问题。这篇文章我尽量把Linux中断处理机制讲透。内容比较长，建议收藏慢慢看。一、中断基础：内核中断核心概念与分类1.1 什么是中断？中断的核心作用与硬件意义所谓中断，简单来说，就是 CPU 正在正常执行程序的时候，因为某一个事件发生而暂时改变当前执行流程，转而执行另外一段专门用于处理该事件的代码。例如一个串口设备接收到数据。如果没有中断机制，那么 CPU 可能需要不断执行下面这样的代码：while (1) {    if (uart_has_data())        read_uart_data();}CPU 会不停检查 UART 的状态寄存器，即便 UART 几秒钟都没有接收到任何数据，CPU 仍然需要反复查询，这就是典型的轮询方式。而采用中断之后，UART 只有在真正接收到数据时才主动向中断控制器产生中断请求，中断控制器再通知 CPU 进入 UART 对应的中断处理程序。于是正常情况下 CPU 根本不需要理会 UART，只有设备真正发生事件的时候才去处理。因此中断最为核心的价值就是：把 CPU 从大量没有意义的状态轮询当中释放出来，实现基于硬件事件的异步处理机制。 从操作系统角度来看，中断也是连接“异步硬件世界”和“同步程序执行世界”的重要桥梁。1.2 中断与轮询的优劣对比与适用场景中断和轮询并不是谁绝对优于谁，而是两种适用于不同场景的事件处理方式。轮询最大的特点就是简单，CPU 主动不断查看设备状态，发现状态改变之后立即处理，例如：while (!(readl(UART_STATUS) &amp; RX_READY))    ;data = readl(UART_DATA);这种方式实现直观，而且在事件极其频繁、处理时间非常短的情况下，轮询甚至可能比频繁进入和退出中断更加高效。但是它的问题同样明显：CPU 必须持续占用计算资源检查状态，如果设备很长时间才发生一次事件，那么绝大多数查询都是没有意义的。中断则刚好相反。正常情况下 CPU 可以继续执行其他任务，只有设备真正产生事件以后才进入中断处理流程。因此低频、异步事件通常更加适合中断，例如按键、串口接收、GPIO、传感器数据就绪、DMA 传输完成以及磁盘 IO 完成等。但是当事件频率极高的时候，中断本身也会产生额外开销，例如高速网卡如果每接收到一个数据包都产生一次硬件中断，CPU 就会陷入大量中断进入、中断退出和协议处理过程。因此 Linux 网络子系统并没有简单选择“纯中断”或者“纯轮询”，而是采用了 中断 + NAPI Poll 的混合机制：低负载的时候通过中断快速响应，高负载的时候减少中断，转而通过轮询方式批量处理数据。由此可以看出，在真实操作系统当中，中断和轮询往往是可以结合使用的。1.3 中断的核心分类：硬件中断、软件中断与异常学习 Linux 中断的时候有一个非常容易混淆的问题，那就是 CPU 层面的软件中断和 Linux 内核中的 softirq 并不是同一个东西。首先是硬件中断。硬件中断由 CPU 外部设备产生，比如网卡接收到数据、UART 收到字符、DMA 完成传输或者 GPIO 电平发生变化。硬件设备通过物理中断线、MSI 或 MSI-X 等方式把事件发送给中断控制器，再由中断控制器通知 CPU。由于这种事件和 CPU 当前正在执行哪一条指令没有直接关系，因此硬件中断通常属于异步事件。第二类是异常 Exception。异常通常是 CPU 执行某一条指令的时候，由处理器内部检测到特殊情况而产生的，例如除零异常、缺页异常 Page Fault、非法指令、General Protection Fault 以及断点异常等。由于异常和当前正在执行的指令具有直接关系，因此通常属于同步事件。第三类是软件主动触发的异常或陷阱。例如经典 x86 Linux 曾经大量使用：int $0x80进入系统调用，而现代 x86-64 Linux 更多使用：syscall指令完成系统调用入口切换。最后需要特别强调 Linux 的 softirq。Linux softirq 并不是 CPU 指令层面的软件中断，而是 Linux 内核自行实现的一种 延迟执行机制，主要用于中断下半部以及网络、定时器、调度、RCU 等高频内核任务。因此一定要记住：CPU Software Interrupt ≠ Linux Softirq。1.4 中断优先级与中断嵌套基本规则不同硬件中断在硬件层面可以具有不同优先级。以 x86 APIC 为例，CPU 最终接收到的是一个 Interrupt Vector，Local APIC 会依据中断向量优先级、当前任务优先级以及中断屏蔽状态决定中断能否被处理。但是从 Linux 驱动开发者角度来看，不应该简单认为普通硬件中断可以随意嵌套。普通设备 IRQ 进入 hardirq 上下文之后，本地可屏蔽中断通常处于禁止或者受到严格控制的状态，因此驱动 ISR 不应该自行随意调用：local_irq_enable();另一方面，NMI、Machine Check 等特殊异常具有不同的优先级和处理规则，多核 CPU 之间也可以同时处理不同 IRQ。例如 CPU0 正在执行某设备 ISR，并不妨碍 CPU1 同时处理另外一个设备中断，所以中断驱动必须认真考虑 SMP 并发问题。1.5 Linux 内核中断处理的设计核心思想Linux 中断体系虽然看起来复杂，但核心设计思想其实可以概括为三个方面。第一是 硬件抽象。不同平台使用的中断控制器完全不同，例如 x86 平台存在 8259A、IOAPIC、Local APIC 和 MSI/MSI-X，ARM 平台常见 GIC，RISC-V 平台则可能使用 PLIC 或 AIA。如果每一个设备驱动都直接操作这些不同的控制器，驱动开发将极其复杂。因此 Linux 建立了 Generic IRQ Layer，使设备驱动只需要使用 request_irq()、free_irq()、enable_irq()、disable_irq() 等统一 API，而不需要关心底层究竟是 APIC、GIC 还是其他中断控制器。第二是 尽可能缩短硬中断上下文执行时间。必须立即完成的操作放在 ISR 中处理，耗时或者并不紧急的任务通过 Softirq、Tasklet、Workqueue 或 Threaded IRQ 延后执行，这就是 Linux 上半部和下半部设计的根本原因。第三是 适应 SMP 多核系统。Linux 通过 IRQ Affinity、per-CPU IRQ、MSI-X 多队列以及 Managed IRQ 等机制，把中断合理分配给不同 CPU，从而提高并行处理能力。二、硬件基础：中断控制器与硬件架构2.1 传统 8259A 可编程中断控制器原理早期 x86 PC 中使用的中断控制器主要是 8259A PIC。传统 PC 通常使用两个 8259A 进行主从级联，一个作为 Master，一个作为 Slave，总共可以形成 IRQ0～IRQ15 共 16 条传统 IRQ，其中 IRQ2 被用于两个 8259A 之间的级联，因此实际可供外设使用的数量还会进一步减少。设备产生中断以后，8259A 会根据内部的中断请求、屏蔽和优先级状态决定是否向 CPU 发送 INT 信号。CPU 接收到中断以后，再通过中断确认周期得到对应的 Interrupt Vector。8259A 内部三个比较重要的寄存器分别为 IRR、ISR 和 IMR，其中 IRR（Interrupt Request Register）记录正在等待处理的中断请求，ISR（In-Service Register）记录当前正在被服务的中断，IMR（Interrupt Mask Register）则负责屏蔽指定 IRQ。随着多核 CPU 和大量 PCI/PCIe 设备出现，8259A 在 IRQ 数量、多核路由以及性能方面逐渐无法满足现代计算机需求，因此 APIC 体系成为现代 x86 系统的主流方案。2.2 APIC 高级可编程中断控制器工作机制现代 x86 系统中更加重要的是 APIC，也就是 Advanced Programmable Interrupt Controller。APIC 主要包括 IOAPIC 和 Local APIC 两部分，其中 IOAPIC 负责接收外部设备中断，Local APIC 位于各个 CPU/Core 一侧，负责最终将中断交给对应处理器。IOAPIC 内部维护 Redirection Table，可以为每个外部中断输入配置 Interrupt Vector、触发方式、极性、目标 CPU 以及屏蔽状态。因此相比传统 8259A，IOAPIC 能够更加灵活地管理和路由硬件中断。Local APIC 除了接收 IOAPIC 发来的外部中断，还承担 Local APIC Timer、IPI、性能监控中断以及 APIC Error 等功能。尤其是在 SMP 多核系统中，CPU 之间发送的 IPI（Inter Processor Interrupt）也是通过 Local APIC 完成的。此外，现代 PCIe 设备大量使用 MSI 和 MSI-X。这种机制不再依赖传统物理 IRQ 线，而是通过特殊的内存写操作向中断控制体系发送中断消息。因此现代系统中已经同时存在传统引脚中断和 Message Signaled Interrupt 两种重要中断方式。2.3 中断引脚、中断号与 IRQ 的映射关系Linux 中断机制中还有一个非常重要的概念：硬件中断号、Linux IRQ Number 和 CPU Interrupt Vector 并不一定相同。例如某个设备连接到中断控制器第 37 号输入，那么中断控制器层面的硬件中断号可能是：hwirq = 37;Linux 内核为它分配的逻辑 IRQ Number 可能是 82，而最终 x86 CPU 使用的 Interrupt Vector 又可能是另外一个数字。因此整个关系可以理解成：设备中断源 → 中断控制器 hwirq → IRQ Domain → Linux IRQ Number → 中断控制器路由 → CPU Interrupt Vector。Linux 使用 irq_domain 解决硬件中断号和 Linux 逻辑 IRQ Number 之间的映射问题。所以我们在 /proc/interrupts 里面看到 IRQ 126 时，不能简单理解为芯片上存在“第 126 根中断线”。2.4 多核 CPU 下的中断分发与绑定机制在多核系统当中，如果所有设备中断都集中在 CPU0，那么 CPU0 很容易成为性能瓶颈。因此 Linux 支持 IRQ Affinity，也就是规定某一个 IRQ 可以在哪些 CPU 上执行。常用接口包括：cat /proc/irq/126/smp_affinitycat /proc/irq/126/smp_affinity_list假如 smp_affinity_list 显示：0-7表示 IRQ126 可以被 CPU0～CPU7 处理。如果执行：echo 4 &gt; /proc/irq/126/smp_affinity_list则可以将其绑定到 CPU4。对于现代多队列网卡、NVMe 等设备，还可以做到 Queue0 → IRQ0 → CPU0、Queue1 → IRQ1 → CPU1、Queue2 → IRQ2 → CPU2 这样的映射，使多个 CPU 真正并行处理中断和设备队列。三、Linux 中断核心架构：上半部与下半部机制3.1 中断处理的核心痛点：快速响应与耗时处理的矛盾Linux 中断处理中最核心的矛盾就是：设备希望中断来了以后立即处理，但是 CPU 又希望中断处理程序尽快结束。以网卡为例，接收到一个数据包以后可能涉及读取设备状态、处理 DMA 描述符、获取数据包、协议栈处理、路由、Socket 查找甚至唤醒用户程序。如果这些事情全部在硬件中断处理程序中完成，那么 ISR 执行时间就会非常长，会造成其他中断响应延迟、调度延迟增加以及系统实时性下降。因此 Linux 采用了一个非常重要的设计思想：必须马上做的事情立即处理，不需要马上完成的事情延迟处理。 由此形成了 Top Half 和 Bottom Half，也就是我们常说的上半部和下半部。3.2 上半部（Top Half）：核心特性、执行规则与适用场景所谓上半部，主要指硬件中断发生以后立即执行的中断服务程序 ISR。它最重要的原则就是 快，一般只完成确认中断来源、读取必要状态、清除或者确认中断、保存必须马上读取的数据以及触发后续下半部等操作。一个典型 ISR 可以写成：static irqreturn_t my_irq_handler(int irq, void *dev_id){    struct my_device *dev = dev_id;    u32 status;    status = readl(dev-&gt;base + STATUS_REG);    if (!(status &amp; IRQ_PENDING))        return IRQ_NONE;    writel(status, dev-&gt;base + IRQ_CLEAR_REG);    schedule_work(&amp;dev-&gt;work);    return IRQ_HANDLED;}这个 ISR 只做三件事：检查设备状态、清除中断、提交 Workqueue，然后马上退出。由于 ISR 运行在 hardirq context 中，因此不能执行会导致当前执行流睡眠的操作，例如 msleep()、普通 mutex_lock() 或主动调用 schedule() 等。3.3 下半部（Bottom Half）：设计目的与分类体系下半部的本质就是：把没有必要在硬中断上下文立即完成的工作推迟执行。 Linux 历史上出现过多种 Bottom Half 实现方式，目前学习和开发中最常见的是 Softirq、Tasklet、Workqueue、Timer 以及 Threaded IRQ。其中 Softirq 主要用于网络、定时器、RCU、调度等内核高频核心模块；Tasklet 构建在 Softirq 之上；Workqueue 通过内核工作线程执行，因此可以进入睡眠状态；Timer 主要用于定时和超时处理；Threaded IRQ 则直接把中断后续处理放入内核线程中执行。3.4 下半部四大实现方式对比：软中断、Tasklet、工作队列、定时器Softirq 主要服务于调用频率非常高、性能要求很高的内核模块，例如网络收发、Timer、RCU 等。它运行于原子上下文，不能睡眠，而且同一种 Softirq 可以同时运行在多个 CPU 上，因此必须认真考虑并发问题。Tasklet 构建在 Softirq 之上，同样不能睡眠，但是同一个 Tasklet 不会同时在多个 CPU 上执行，因此在并发控制方面比直接使用 Softirq 简单一些。Workqueue 的普通工作项由内核 worker 线程执行，因此运行于进程上下文，可以调用可能睡眠的函数、使用 mutex，也更加适合普通设备驱动中的复杂延迟处理。Timer 主要解决延时、超时以及周期性事件，例如设备发送命令之后规定 100ms 内没有完成就执行超时处理。机制执行上下文能否睡眠典型用途SoftirqSoftirq Context否网络、定时、RCUTaskletSoftirq Context否传统驱动延迟处理WorkqueueProcess Context是普通设备复杂处理TimerTimer/Softirq 相关上下文否超时、周期任务3.5 上下半部协同工作完整逻辑上下半部协同工作的基本逻辑可以概括为：设备产生 IRQ 后，ISR 首先读取和确认中断状态，清除硬件中断源并保存必要信息，然后通过 Softirq、Tasklet、Workqueue 或 Threaded IRQ 提交后续任务，随后迅速退出 hardirq context。之后下半部再完成数据解析、复杂计算、设备状态更新、通知用户空间等耗时工作。也就是说，上半部负责“快速接单”，下半部负责“真正干活”。这样既能够保证硬件事件及时响应，又不会让 CPU 长时间停留在不可睡眠的硬中断上下文当中。四、中断处理完整执行流程4.1 硬件触发中断：从设备引脚到 CPU 感知全过程硬件中断通常起始于某一个设备内部事件，例如网卡接收到数据、DMA 传输完成、UART 接收到字符或者 GPIO 出现下降沿。设备随后通过 IRQ 引脚或者 MSI/MSI-X 等方式发出中断请求，中断控制器检查该中断是否被屏蔽、优先级是否满足、目标 CPU 是谁以及触发方式是否有效，如果条件满足，就会把中断投递给对应 CPU。对于 MSI/MSI-X 来说，底层并不是简单拉高或者拉低一根物理 IRQ 线，而是设备通过消息写操作触发中断，不过从 Linux 上层来看，最终同样会转换成一个可被 Generic IRQ 管理的硬件中断事件。4.2 中断响应：CPU 保存现场、进入中断上下文CPU 接收到一个允许处理的中断以后，并不会直接进入 C 语言 ISR，而是首先按照处理器架构规定进入对应中断入口。以 x86 为例，CPU 根据 Interrupt Vector 在 IDT 中找到相应入口，硬件首先保存一部分关键状态，随后 Linux 汇编入口代码继续保存必要寄存器，并组织形成类似 pt_regs 的寄存器现场。因此整个过程可以理解为：当前程序 → 硬件中断 → CPU 保存基础现场 → 汇编入口继续保存软件现场 → 进入 Linux hardirq 处理逻辑。 不同 CPU 架构具体保存哪些寄存器以及保存方式存在差异，因此不能简单认为所有寄存器都由 CPU 硬件自动保存。4.3 中断入口：内核中断向量表匹配机制以 x86 为例，CPU 根据 Interrupt Vector 查询 IDT，找到对应中断入口。Linux 在系统启动阶段会提前完成 IDT 初始化，随后架构相关代码再根据向量找到 Linux 对应的 IRQ 管理对象。Generic IRQ 中一个非常重要的数据结构就是：struct irq_desc;可以把 irq_desc 理解为 Linux 内核用于描述和管理某一个 IRQ 的核心对象，它会关联 irq_data、irq_chip、IRQ Flow Handler、irqaction、中断状态以及统计信息等。因此整体关系可以理解为：CPU Vector → 架构中断入口 → Linux IRQ → irq_desc → Generic IRQ Flow Handler。4.4 上半部执行：中断服务程序 ISR 运行逻辑Generic IRQ 找到对应 irq_desc 以后，还需要根据中断触发方式以及中断控制器特性选择相应 Flow Handler，例如：handle_level_irq();handle_edge_irq();handle_fasteoi_irq();handle_simple_irq();handle_percpu_irq();随后进一步进入类似：handle_irq_event()        ↓handle_irq_event_percpu()        ↓__handle_irq_event_percpu()        ↓action-&gt;handler()的调用过程，最终执行驱动开发者通过 request_irq() 注册的 ISR。共享中断之所以能够存在，也正是因为一个 IRQ 可以关联多个 irqaction，内核依次调用不同设备注册的 handler()。4.5 下半部调度与延迟处理执行流程如果 ISR 中触发 Softirq，内核通常不会把所有工作直接放在硬件中断处理过程中完成，而是设置当前 CPU 对应 Softirq 的 pending bit。在 hardirq 退出阶段，如果发现存在待处理 Softirq，就会在合适时机进入 Softirq 处理流程。如果 Softirq 工作量非常大，Linux 不会无限制地停留在 Softirq 中，否则用户进程和其他任务可能长时间无法运行。超过一定处理时间或者循环次数以后，剩余工作会交给对应 CPU 的 ksoftirqd/N 内核线程继续执行。4.6 中断退出：恢复现场、返回原执行流程硬件中断处理完成以后，内核需要退出 hardirq context，并检查是否存在待处理 Softirq、调度请求等情况，然后逐步恢复中断进入之前保存的寄存器现场，最后返回到被中断的原执行流。因此一次完整中断绝不仅仅是“IRQ → ISR → return”，而是一条贯穿 CPU 架构、中断控制器、Generic IRQ、设备驱动、Softirq 以及调度器 的完整执行链路。五、关键子模块：软中断与 Tasklet 深度解析5.1 软中断（Softirq）数据结构与优先级体系Linux Softirq 并不是为每一个设备动态创建一种软件中断，而是由内核提前定义固定类型。典型类型包括：enum {    HI_SOFTIRQ = 0,    TIMER_SOFTIRQ,    NET_TX_SOFTIRQ,    NET_RX_SOFTIRQ,    BLOCK_SOFTIRQ,    IRQ_POLL_SOFTIRQ,    TASKLET_SOFTIRQ,    SCHED_SOFTIRQ,    HRTIMER_SOFTIRQ,    RCU_SOFTIRQ,    NR_SOFTIRQS};每一个 CPU 都维护自己的 Softirq pending 状态。当某一种 Softirq 需要执行的时候，只需要设置对应 pending bit，随后内核在合适时机扫描这些 pending bit 并执行对应处理函数。因此 Softirq 更准确地理解应该是 固定 Softirq Vector + per-CPU Pending Bitmap，而不是普通意义上的动态任务队列。5.2 内核预定义 Softirq 类型常见 Softirq 中，NET_RX_SOFTIRQ 主要负责网络接收，NET_TX_SOFTIRQ 负责网络发送，TIMER_SOFTIRQ 用于普通内核定时器，SCHED_SOFTIRQ 与调度相关延迟处理有关，RCU_SOFTIRQ 用于 RCU 回调，而 TASKLET_SOFTIRQ 则是普通 Tasklet 的底层执行载体。由此也可以看出，Softirq 主要适用于调用频率极高、性能敏感并且属于内核核心子系统的场景。普通驱动开发者一般没有必要自行扩展新的 Softirq 类型。5.3 Softirq 触发、调度与执行时机Softirq 的典型执行路径可以概括为：硬件 ISR 调用 raise_softirq() 或相关接口设置 per-CPU pending bit，随后在 IRQ 退出或者其他合适时机检查 pending 状态，如果存在待处理 Softirq，就执行相应 action；如果 Softirq 工作量过大，则唤醒 ksoftirqd/N 内核线程继续完成处理。可以通过：ps -e | grep ksoftirqd查看系统中的 ksoftirqd/0、ksoftirqd/1、ksoftirqd/2 等线程。如果某个 ksoftirqd/N 长期占用大量 CPU，通常意味着对应 CPU 上存在较严重的 Softirq 压力，例如网络收包量过大。5.4 Tasklet 的实现原理与底层依赖Tasklet 并不是一个独立于 Softirq 的系统，它底层依赖 TASKLET_SOFTIRQ 和 HI_SOFTIRQ。当调用 tasklet_schedule() 以后，Tasklet 会加入当前 CPU 对应的 Tasklet 队列，然后触发相应 Softirq，Softirq 执行时再调用具体 Tasklet 回调函数。Tasklet 最重要的特点是：同一个 Tasklet 自身不会同时在多个 CPU 上并行运行，但不同 Tasklet 之间仍然可能并行执行。 这也是 Tasklet 相比直接使用 Softirq 更容易进行并发控制的重要原因之一。5.5 Tasklet 常规使用规则与上下文限制典型 Tasklet 可以写成：static void my_tasklet_func(struct tasklet_struct *t){    /* 延迟处理 */}static DECLARE_TASKLET(my_tasklet, my_tasklet_func);static irqreturn_t my_irq_handler(int irq, void *data){    tasklet_schedule(&amp;my_tasklet);    return IRQ_HANDLED;}需要注意，不同 Linux 内核版本中的 Tasklet API 宏和回调形式可能发生变化，因此实际编译驱动时应该依据目标内核版本的 include/linux/interrupt.h 为准。Tasklet 本质上仍然运行于 Softirq Context，因此不能睡眠，不能使用普通 mutex，也不能执行可能主动进入调度器的函数。5.6 Softirq 与 Tasklet 的核心区别与选型原则Softirq 是 Linux 内核提供的更底层高性能延迟执行机制，而 Tasklet 则是建立在 Softirq 之上的封装。Softirq 的同一种 handler 可以同时运行在多个 CPU 上，因此性能较强，但是并发控制更加复杂；同一个 Tasklet 则不会在多个 CPU 同时执行，因此使用起来相对简单。不过对于现代普通驱动，如果后续工作需要睡眠、复杂 IO、mutex 或较长时间处理，通常更加适合 Workqueue 或 Threaded IRQ，而不是 Tasklet。六、中断设备驱动：中断注册与使用6.1 中断资源申请与释放核心 APILinux 驱动申请 IRQ 最常见的接口就是：request_irq();其典型形式为：int request_irq(unsigned int irq,                irq_handler_t handler,                unsigned long flags,                const char *name,                void *dev_id);例如：static irqreturn_t button_irq_handler(int irq, void *dev_id){    pr_info("button interrupt\n");    return IRQ_HANDLED;}ret = request_irq(irq,                  button_irq_handler,                  IRQF_TRIGGER_FALLING,                  "my_button",                  &amp;my_dev);设备被卸载或者驱动退出时需要执行：free_irq(irq, &amp;my_dev);在现代 Linux 中，request_irq() 本质上可以看作普通非线程化中断注册接口，而底层与 request_threaded_irq() 的通用注册逻辑存在紧密联系。6.2 中断标志位解析驱动开发中比较常见的 IRQ Flag 包括 IRQF_TRIGGER_RISING、IRQF_TRIGGER_FALLING、IRQF_TRIGGER_HIGH 和 IRQF_TRIGGER_LOW，分别表示上升沿、下降沿、高电平以及低电平触发；IRQF_SHARED 表示共享 IRQ；IRQF_ONESHOT 则常用于 Threaded IRQ，使中断在线程化处理函数结束之前保持相应的屏蔽语义。选择哪一种触发方式不能凭驱动开发者随意决定，而应该依据硬件线路、中断控制器能力以及设备芯片的数据手册进行配置。6.3 ISR 编写规范与禁忌ISR 编写的第一原则就是尽可能短。通常只进行确认中断来源、读取状态寄存器、清除中断、保存必要数据以及调度 Bottom Half 等操作。不能在普通 hardirq handler 中执行 msleep()、普通 mutex_lock()、文件 IO、大量复杂协议处理或者任何可能导致当前执行流睡眠的操作。如果设备中断之后确实需要复杂数据处理，就应该把这些任务放到 Workqueue 或 Threaded IRQ 中完成。6.4 共享中断的冲突解决与执行逻辑假设设备 A、B、C 共用 IRQ18，那么这个 IRQ 对应的 irq_desc 可以关联多个 irqaction。IRQ18 触发以后，Generic IRQ 会依次调用这些设备注册的 handler，因此每一个共享中断 ISR 的第一件事就是判断本次中断是否由自己的设备产生。例如：static irqreturn_t my_irq_handler(int irq, void *dev_id){    struct my_device *dev = dev_id;    u32 status;    status = readl(dev-&gt;base + IRQ_STATUS);    if (!(status &amp; MY_IRQ_BIT))        return IRQ_NONE;    writel(MY_IRQ_BIT, dev-&gt;base + IRQ_CLEAR);    return IRQ_HANDLED;}不是自己设备产生的中断返回 IRQ_NONE，确认属于自己以后才处理并返回 IRQ_HANDLED。对于共享 IRQ，dev_id 还应该能够唯一标识设备实例，以便注册和释放正确的 IRQ handler。6.5 DeviceTree 中断配置与解析ARM、RISC-V 等嵌入式 Linux 平台大量使用 DeviceTree 描述中断资源。例如：my_device@12340000 {    compatible = "vendor,my-device";    reg = &lt;0x12340000 0x1000&gt;;    interrupt-parent = &lt;&amp;gpio0&gt;;    interrupts = &lt;12 IRQ_TYPE_EDGE_FALLING&gt;;};其中 interrupt-parent 表示由哪一个中断控制器管理该中断，interrupts 则描述具体硬件中断参数。需要特别注意的是，interrupts 中有几个 cell、每个 cell 表示什么，并不是 Linux 全局固定的，而是由对应中断控制器的 DeviceTree Binding 决定。驱动中一般通过：irq = platform_get_irq(pdev, 0);获得 Linux IRQ Number，再调用：ret = devm_request_irq(&amp;pdev-&gt;dev,                       irq,                       my_irq_handler,                       0,                       dev_name(&amp;pdev-&gt;dev),                       dev);完成注册。这样就把 DeviceTree、IRQ Domain、Generic IRQ 和设备驱动完整串联起来了。七、多核中断与中断负载均衡7.1 中断亲和性 IRQ Affinity 原理与配置现代服务器和桌面处理器通常具有多个 CPU Core，如果所有设备中断都集中在 CPU0，那么 CPU0 很容易成为系统瓶颈。Linux 因此通过 IRQ Affinity 控制每个 IRQ 可以运行在哪些 CPU 上。常用命令包括：cat /proc/irq/126/smp_affinitycat /proc/irq/126/smp_affinity_list如果希望把 IRQ126 绑定到 CPU3，可以执行：echo 3 &gt; /proc/irq/126/smp_affinity_list对于高性能网卡，还需要进一步结合 RX/TX Queue、MSI-X、NUMA 和应用线程 CPU Affinity 进行整体优化。7.2 多核环境中断并发与嵌套规则假设 CPU0 正在处理 IRQ32，CPU1 完全可能同时处理 IRQ45，因此多核系统中的中断处理天然具有并发性。如果某些数据既可能被普通进程访问，又可能在 ISR 中被访问，就需要认真进行同步设计。驱动中经常看到：spin_lock_irqsave(&amp;dev-&gt;lock, flags);/* 临界区 */spin_unlock_irqrestore(&amp;dev-&gt;lock, flags);之所以大量使用 Spinlock，而不是普通 Mutex，其中一个重要原因就是中断上下文不能睡眠。中断并发问题实际上同时涉及 CPU 并发、IRQ 并发、锁以及内存访问顺序等多个方面。7.3 内核中断负载均衡机制与自动调度策略Linux 内核提供 IRQ Affinity、Managed IRQ 和 MSI-X Affinity 等基础能力，可以依据 CPU Topology 对设备中断向量进行合理分布。用户空间还经常运行 irqbalance 服务，用于观察系统 CPU 拓扑和 IRQ 负载并自动调整部分中断的 CPU 分配。需要明确区分：IRQ Affinity 是 Linux 内核提供的机制，而 irqbalance 是用户空间守护程序，二者并不是同一个东西。7.4 中断扎堆问题与性能优化方案执行：cat /proc/interrupts如果发现某块网卡的多个 IRQ 几乎全部集中在 CPU0，而其他 CPU 中断数量很少，就说明出现了典型的中断扎堆问题。这时应该进一步检查 MSI-X Queue 数量、IRQ Affinity、NUMA、RSS、RPS、XPS 以及 NAPI 配置。对于现代多队列设备，一般希望不同 Queue 对应不同 IRQ，并合理分配到多个 CPU 上。例如 RX Queue0 → IRQ0 → CPU0、RX Queue1 → IRQ1 → CPU1。对于 NUMA 系统，还应该尽量让设备所在 NUMA Node、IRQ 所在 CPU 和负责处理数据的应用线程处于合理的拓扑关系之中。八、中断调试、性能问题与优化方案8.1 中断相关内核参数与调试工具Linux 中断调试最重要的接口之一是：cat /proc/interrupts它能够显示每个 IRQ 在各个 CPU 上的硬中断统计。Softirq 则可以通过：cat /proc/softirqs查看，其中能够看到 NET_RX、NET_TX、TIMER、RCU、SCHED 等类型。此外还可以使用 /proc/irq/&lt;IRQ&gt;/smp_affinity、top、top -H、perf top、perf record 和 perf report 进行性能分析。如果需要进一步观察中断时间，还可以使用 ftrace/tracefs 提供的 irq_handler_entry、irq_handler_exit、softirq_raise、softirq_entry 和 softirq_exit 等 tracepoint。8.2 常见中断异常中断丢失指设备已经发生事件，但是 CPU 最终没有正确处理，可能原因包括 IRQ 被 Mask、触发方式配置错误、DeviceTree 参数错误、中断控制器配置异常、设备状态清除时序错误、驱动竞争条件以及硬件线路问题等。另外一种常见问题就是 Interrupt Storm，也就是中断风暴。例如一个低电平触发设备产生中断以后，ISR 本应清除设备内部 pending 状态，但驱动没有正确清除，于是 IRQ Line 一直保持低电平。ISR 每次返回以后中断控制器都会马上再次触发中断，CPU 最终被不断重复的 IRQ 打满。如果系统日志出现：irq XX: nobody cared甚至随后发现 IRQ 被禁用，就应该重点检查共享 IRQ 判断逻辑、设备状态寄存器以及中断源清除流程。8.3 中断耗时过长的危害与排查方法假设一个 ISR 每次执行 500μs，而设备每秒产生 5000 次中断，那么仅 ISR 理论处理时间就达到 2.5 秒，而单个 CPU 每秒实际上只有 1 秒时间，显然已经不可能完成处理。最终很容易造成 IRQ backlog、Softirq backlog、调度延迟、网络丢包、系统卡顿以及实时延迟增加。因此排查中断性能问题时，不仅要查看 IRQ 次数，还应该测量每一次 ISR 的执行时间，并判断是否存在应该下放到 Workqueue、Softirq 或 Threaded IRQ 中的耗时操作。8.4 高并发场景下的中断性能优化实战高并发环境中的中断优化通常需要综合考虑 Interrupt Coalescing、MSI-X、多队列、NAPI、IRQ Affinity、NUMA、RSS/RPS/XPS、CPU Isolation 和线程 Affinity 等机制，而不是简单把 IRQ 平均分到所有 CPU。例如高速网卡通常采用 Interrupt Coalescing，不是每收到一个数据包就马上产生中断，而是累计一定数量数据包或者达到一定时间后再产生一次 IRQ，从而显著减少中断次数。Linux NAPI 则在网卡中断之后暂时降低或者关闭 RX 中断，通过 Poll 批量收取数据包，处理完成后再恢复中断，由此避免高流量场景下 CPU 被中断风暴完全占满。8.5 中断线程化机制原理与适用场景如果设备中断之后需要执行相对复杂并且可能睡眠的操作，可以使用：request_threaded_irq();例如：static irqreturn_t my_irq_handler(int irq, void *data){    struct my_dev *dev = data;    if (!device_irq_pending(dev))        return IRQ_NONE;    clear_device_irq(dev);    return IRQ_WAKE_THREAD;}static irqreturn_t my_irq_thread(int irq, void *data){    struct my_dev *dev = data;    mutex_lock(&amp;dev-&gt;lock);    process_device_data(dev);    mutex_unlock(&amp;dev-&gt;lock);    return IRQ_HANDLED;}注册时：ret = request_threaded_irq(irq,                           my_irq_handler,                           my_irq_thread,                           IRQF_ONESHOT,                           "my_device",                           dev);Primary Handler 仍然运行在 hardirq context 中，只完成确认和清除中断等非常短的操作，然后返回 IRQ_WAKE_THREAD，内核再唤醒对应 IRQ Thread 执行 thread_fn()。由于后者处于线程上下文，因此可以执行某些会睡眠的操作。在 PREEMPT_RT 实时内核中，中断线程化更是降低系统不可抢占时间和实时延迟的重要手段。九、核心源码解析9.1 中断向量表初始化源码分析以 x86 为例，Linux 启动过程中需要建立 IDT，也就是 Interrupt Descriptor Table。相关核心代码主要位于：arch/x86/kernel/idt.c其中可以看到 idt_setup_early_traps()、idt_setup_traps()、idt_setup_apic_and_irq_gates() 等初始化函数。系统通过这些函数为 CPU Exception、APIC Interrupt、SMP IPI 以及普通外部 IRQ 安装对应入口。因此 CPU 接收到 Interrupt Vector 以后，首先通过 IDT 找到对应入口，再进入 Linux 架构相关中断代码。9.2 request_irq 注册流程源码拆解驱动执行：request_irq();以后，并不是简单把函数指针放进某个全局数组，而是会建立对应 irqaction，填充 handler、flags、dev_id、name 等信息，再找到相应 irq_desc，最终把 irqaction 挂接到该 IRQ 对应的 action 链表中。核心关系可以理解为：irq_desc   ├── irq_data   │      └── irq_chip   ├── handle_irq   └── action          ├── handler          ├── thread_fn          ├── flags          ├── dev_id          └── next对于共享 IRQ，一个 irq_desc 后面可以连接多个 irqaction，因此同一个硬件 IRQ 到来以后能够依次调用多个设备的 ISR。9.3 中断入口 do_IRQ 核心逻辑源码解析很多旧 Linux 教程会把 x86 中断入口描述成：common_interrupt      ↓do_IRQ()      ↓generic_handle_irq()这种调用关系适用于部分旧内核，但是在现代 Linux 5.x/6.x，特别是较新的 x86-64 内核中，不能再机械记忆“所有普通外部中断统一进入 do_IRQ()”。更加应该掌握的是其抽象流程：CPU Interrupt Vector → x86 架构中断入口 → Linux IRQ/irq_desc → Generic IRQ Flow Handler → handle_irq_event() → action-&gt;handler()。 也就是说，do_IRQ() 更适合作为理解老版本 Linux 中断体系的经典入口函数，而真正具有长期通用性的知识点是 Generic IRQ 的分层模型。9.4 Softirq 调度源码流程Softirq 的核心代码主要位于：kernel/softirq.c它的基本调用逻辑可以概括为：raise_softirq()      ↓设置 per-CPU pending bit      ↓irq_exit 或其他执行点      ↓检测 pending      ↓__do_softirq()      ↓执行对应 Softirq Action不过内核不能无限执行 Softirq。假设高速网络不断产生新的 NET_RX_SOFTIRQ，如果每处理一次以后都立即继续处理新的 pending，那么普通进程可能长期得不到 CPU。因此内核会限制一次 Softirq 处理的时间和循环次数，如果仍有大量任务没有完成，就唤醒 ksoftirqd/N 内核线程接管后续工作，从而在吞吐量和系统调度延迟之间取得平衡。9.5 中断上下文切换与现场保存源码逻辑硬件中断进入和普通进程上下文切换并不是同一种机制。普通进程切换通常表现为 Task A 调用或者触发 schedule()，调度器保存 Task A 上下文并恢复 Task B；而硬件中断则是 CPU 从当前正在执行的上下文直接跳转到 IRQ Entry。其基本流程可以概括为：原执行上下文 → CPU 保存基础状态 → 架构汇编入口继续保存现场 → 进入 Hardirq Context → 执行 ISR → IRQ Exit → 恢复现场 → 返回原执行流。如果在中断退出的时候发现 need_resched 等调度条件已经满足，随后还可能发生一次真正的任务调度。因此硬件中断本身虽然不是普通任务切换，但是能够间接影响调度器的执行时机。十、总结10.1 中断处理机制整体架构梳理Linux 中断完整体系可以概括为：硬件设备首先产生中断事件，中断控制器负责接收、屏蔽、优先级判断和 CPU 路由，CPU 根据 Interrupt Vector 进入架构中断入口，Linux 再通过 Generic IRQ 找到相应 irq_desc，依据 Flow Handler 和 irqaction 最终执行设备驱动注册的 ISR。ISR 只完成必须马上处理的工作，其余任务根据具体需求提交给 Softirq、Tasklet、Workqueue 或 Threaded IRQ。从硬件到软件的完整链路可以记成：硬件设备   ↓中断控制器   ↓CPU Interrupt Vector   ↓架构中断入口   ↓Generic IRQ   ↓irq_desc   ↓IRQ Flow Handler   ↓irqaction   ↓ISR / Top Half   ↓Softirq / Tasklet / Workqueue / Threaded IRQ   ↓Bottom Half10.2 上下半部、Softirq、Tasklet 核心知识点总结Top Half 的核心要求是快速完成必须立即处理的操作；Bottom Half 则负责处理能够延迟执行的任务。Softirq 是 Linux 高性能内核级延迟执行机制，同一种 Softirq 可以同时运行在多个 CPU；Tasklet 建立在 Softirq 之上，同一个 Tasklet 自身不会在多个 CPU 同时执行；Workqueue 运行在内核 worker 线程的进程上下文中，因此可以睡眠；Threaded IRQ 则直接把较复杂的中断业务处理放入内核线程之中。因此实际驱动开发中可以采用一个非常简单的判断原则：必须马上完成并且不能睡眠的操作放在 Hardirq；无需立即完成且不能睡眠的高性能任务可以使用 Softirq/Tasklet；如果任务可能睡眠或者执行时间较长，则优先考虑 Workqueue 或 Threaded IRQ。10.3 面试高频题1. 为什么中断要分上半部和下半部？ 因为硬中断上下文必须尽快退出，所以把必须立即完成的工作放在上半部，把耗时或者不紧急的工作延迟到下半部。2. 中断上下文为什么不能睡眠？ 因为普通 hardirq context 并不是可以通过调度器阻塞并在以后恢复执行的普通进程上下文，因此不能调用可能导致当前执行流睡眠的函数。3. CPU 软件中断和 Linux Softirq 是不是同一个东西？ 不是。前者属于处理器指令和异常机制，后者是 Linux 内核自行实现的延迟处理机制。4. Softirq 和 Tasklet 有什么区别？ Tasklet 构建在 Softirq 之上。同一种 Softirq 可以同时运行在多个 CPU，而同一个 Tasklet 自身不会在多个 CPU 同时执行。5. Tasklet 和 Workqueue 最大的区别是什么？ Tasklet 运行于 Softirq Context，不能睡眠；Workqueue 运行于 Process Context，可以睡眠。6. request_irq() 注册的 handler 保存在哪里？ 可以简单理解成 irq_desc → irqaction → handler，共享 IRQ 则对应多个 irqaction。7. 什么是 IRQ Domain？ IRQ Domain 负责完成硬件中断号 hwirq 与 Linux 逻辑 IRQ Number 之间的映射。8. IRQ Number 和 CPU Interrupt Vector 是不是一个概念？不是。IRQ 是 Linux 内核管理中断使用的逻辑编号，Vector 是 CPU 架构层面用于确定中断入口的编号，两者之间存在映射关系。9. 为什么高速网络不能采用一个数据包一次中断？ 因为中断进入和退出本身存在开销，高并发下容易形成 Interrupt Storm，因此现代网卡通常结合 Interrupt Coalescing、NAPI、多队列、MSI-X 和 IRQ Affinity 进行优化。10. Threaded IRQ 有什么作用？ Threaded IRQ 可以把大量设备中断处理工作从 hardirq context 转移到内核线程，让这些处理受到调度器管理，并允许执行部分可能睡眠的操作。Linux 中断处理机制虽然包含非常多概念，但是核心思想其实十分清晰。硬件产生中断请求以后，中断控制器负责收集、屏蔽、优先级判断以及 CPU 路由，CPU 根据 Interrupt Vector 进入架构中断入口，Linux Generic IRQ 根据 IRQ 找到 irq_desc，再通过 IRQ Flow Handler 和 irqaction 最终执行设备驱动通过 request_irq() 注册的 ISR。与此同时，为了解决“硬件必须快速响应”和“实际设备处理可能十分耗时”之间的矛盾，Linux 又建立了上半部和下半部体系，并形成 Softirq、Tasklet、Workqueue、Threaded IRQ 等不同延迟执行机制。在 SMP 多核环境中，又通过 IRQ Affinity、MSI-X、多队列和 Managed IRQ 等机制，把不同中断合理分配到不同 CPU。所以真正掌握 Linux 中断，并不是单纯记住一个：request_irq();而是需要把 硬件设备 → 中断控制器 → CPU Vector → 架构入口 → Generic IRQ → irq_desc → IRQ Flow Handler → irqaction → ISR → Bottom Half 这一条完整链路真正连接起来。只有这样，再去阅读 GPIO 驱动、UART 驱动、网卡驱动、PCIe 驱动以及 Linux 中断子系统源码的时候，才不会看到一堆互不相关的函数，而是能够准确判断每一个函数究竟处于中断体系的哪一层、上一层从哪里来、下一层又会去哪里。



大家好，我是蟹老板~



写了十多年代码，说实话，内核里我最怕碰的两个东西就是内存管理和中断子系统。



但躲是躲不掉的，尤其是做Linux驱动开发或者性能优化，CPU 不仅需要知道“有中断来了”，还需要解决中断来自哪一个设备、应该运行哪一个处理函数、多个设备同时产生中断怎么办、多核 CPU 应该让哪一个 CPU 处理、中断处理时间过长又该怎么办等一系列问题。



这篇文章我尽量把Linux中断处理机制讲透。内容比较长，建议收藏慢慢看。



## 一、中断基础：内核中断核心概念与分类



### 1.1 什么是中断？中断的核心作用与硬件意义



所谓中断，简单来说，就是 CPU 正在正常执行程序的时候，因为某一个事件发生而暂时改变当前执行流程，转而执行另外一段专门用于处理该事件的代码。



例如一个串口设备接收到数据。如果没有中断机制，那么 CPU 可能需要不断执行下面这样的代码：



CPU 会不停检查 UART 的状态寄存器，即便 UART 几秒钟都没有接收到任何数据，CPU 仍然需要反复查询，这就是典型的轮询方式。而采用中断之后，UART 只有在真正接收到数据时才主动向中断控制器产生中断请求，中断控制器再通知 CPU 进入 UART 对应的中断处理程序。于是正常情况下 CPU 根本不需要理会 UART，只有设备真正发生事件的时候才去处理。



因此中断最为核心的价值就是：把 CPU 从大量没有意义的状态轮询当中释放出来，实现基于硬件事件的异步处理机制。 从操作系统角度来看，中断也是连接“异步硬件世界”和“同步程序执行世界”的重要桥梁。



### 1.2 中断与轮询的优劣对比与适用场景



中断和轮询并不是谁绝对优于谁，而是两种适用于不同场景的事件处理方式。轮询最大的特点就是简单，CPU 主动不断查看设备状态，发现状态改变之后立即处理，例如：



这种方式实现直观，而且在事件极其频繁、处理时间非常短的情况下，轮询甚至可能比频繁进入和退出中断更加高效。但是它的问题同样明显：CPU 必须持续占用计算资源检查状态，如果设备很长时间才发生一次事件，那么绝大多数查询都是没有意义的。



中断则刚好相反。正常情况下 CPU 可以继续执行其他任务，只有设备真正产生事件以后才进入中断处理流程。因此低频、异步事件通常更加适合中断，例如按键、串口接收、GPIO、传感器数据就绪、DMA 传输完成以及磁盘 IO 完成等。但是当事件频率极高的时候，中断本身也会产生额外开销，例如高速网卡如果每接收到一个数据包都产生一次硬件中断，CPU 就会陷入大量中断进入、中断退出和协议处理过程。



因此 Linux 网络子系统并没有简单选择“纯中断”或者“纯轮询”，而是采用了 中断 + NAPI Poll 的混合机制：低负载的时候通过中断快速响应，高负载的时候减少中断，转而通过轮询方式批量处理数据。由此可以看出，在真实操作系统当中，中断和轮询往往是可以结合使用的。



### 1.3 中断的核心分类：硬件中断、软件中断与异常



学习 Linux 中断的时候有一个非常容易混淆的问题，那就是 CPU 层面的软件中断和 Linux 内核中的 softirq 并不是同一个东西。



首先是硬件中断。硬件中断由 CPU 外部设备产生，比如网卡接收到数据、UART 收到字符、DMA 完成传输或者 GPIO 电平发生变化。硬件设备通过物理中断线、MSI 或 MSI-X 等方式把事件发送给中断控制器，再由中断控制器通知 CPU。由于这种事件和 CPU 当前正在执行哪一条指令没有直接关系，因此硬件中断通常属于异步事件。



第二类是异常 Exception。异常通常是 CPU 执行某一条指令的时候，由处理器内部检测到特殊情况而产生的，例如除零异常、缺页异常 Page Fault、非法指令、General Protection Fault 以及断点异常等。由于异常和当前正在执行的指令具有直接关系，因此通常属于同步事件。



第三类是软件主动触发的异常或陷阱。例如经典 x86 Linux 曾经大量使用：



进入系统调用，而现代 x86-64 Linux 更多使用：



指令完成系统调用入口切换。



最后需要特别强调 Linux 的 softirq。Linux softirq 并不是 CPU 指令层面的软件中断，而是 Linux 内核自行实现的一种 延迟执行机制，主要用于中断下半部以及网络、定时器、调度、RCU 等高频内核任务。因此一定要记住：CPU Software Interrupt ≠ Linux Softirq。



### 1.4 中断优先级与中断嵌套基本规则



不同硬件中断在硬件层面可以具有不同优先级。以 x86 APIC 为例，CPU 最终接收到的是一个 Interrupt Vector，Local APIC 会依据中断向量优先级、当前任务优先级以及中断屏蔽状态决定中断能否被处理。



但是从 Linux 驱动开发者角度来看，不应该简单认为普通硬件中断可以随意嵌套。普通设备 IRQ 进入 hardirq 上下文之后，本地可屏蔽中断通常处于禁止或者受到严格控制的状态，因此驱动 ISR 不应该自行随意调用：



另一方面，NMI、Machine Check 等特殊异常具有不同的优先级和处理规则，多核 CPU 之间也可以同时处理不同 IRQ。例如 CPU0 正在执行某设备 ISR，并不妨碍 CPU1 同时处理另外一个设备中断，所以中断驱动必须认真考虑 SMP 并发问题。



### 1.5 Linux 内核中断处理的设计核心思想



Linux 中断体系虽然看起来复杂，但核心设计思想其实可以概括为三个方面。



第一是 硬件抽象。不同平台使用的中断控制器完全不同，例如 x86 平台存在 8259A、IOAPIC、Local APIC 和 MSI/MSI-X，ARM 平台常见 GIC，RISC-V 平台则可能使用 PLIC 或 AIA。如果每一个设备驱动都直接操作这些不同的控制器，驱动开发将极其复杂。因此 Linux 建立了 Generic IRQ Layer，使设备驱动只需要使用 request_irq()、free_irq()、enable_irq()、disable_irq() 等统一 API，而不需要关心底层究竟是 APIC、GIC 还是其他中断控制器。



第二是 尽可能缩短硬中断上下文执行时间。必须立即完成的操作放在 ISR 中处理，耗时或者并不紧急的任务通过 Softirq、Tasklet、Workqueue 或 Threaded IRQ 延后执行，这就是 Linux 上半部和下半部设计的根本原因。



第三是 适应 SMP 多核系统。Linux 通过 IRQ Affinity、per-CPU IRQ、MSI-X 多队列以及 Managed IRQ 等机制，把中断合理分配给不同 CPU，从而提高并行处理能力。



## 二、硬件基础：中断控制器与硬件架构



### 2.1 传统 8259A 可编程中断控制器原理



早期 x86 PC 中使用的中断控制器主要是 8259A PIC。传统 PC 通常使用两个 8259A 进行主从级联，一个作为 Master，一个作为 Slave，总共可以形成 IRQ0～IRQ15 共 16 条传统 IRQ，其中 IRQ2 被用于两个 8259A 之间的级联，因此实际可供外设使用的数量还会进一步减少。



设备产生中断以后，8259A 会根据内部的中断请求、屏蔽和优先级状态决定是否向 CPU 发送 INT 信号。CPU 接收到中断以后，再通过中断确认周期得到对应的 Interrupt Vector。



8259A 内部三个比较重要的寄存器分别为 IRR、ISR 和 IMR，其中 IRR（Interrupt Request Register）记录正在等待处理的中断请求，ISR（In-Service Register）记录当前正在被服务的中断，IMR（Interrupt Mask Register）则负责屏蔽指定 IRQ。随着多核 CPU 和大量 PCI/PCIe 设备出现，8259A 在 IRQ 数量、多核路由以及性能方面逐渐无法满足现代计算机需求，因此 APIC 体系成为现代 x86 系统的主流方案。



### 2.2 APIC 高级可编程中断控制器工作机制



现代 x86 系统中更加重要的是 APIC，也就是 Advanced Programmable Interrupt Controller。APIC 主要包括 IOAPIC 和 Local APIC 两部分，其中 IOAPIC 负责接收外部设备中断，Local APIC 位于各个 CPU/Core 一侧，负责最终将中断交给对应处理器。



IOAPIC 内部维护 Redirection Table，可以为每个外部中断输入配置 Interrupt Vector、触发方式、极性、目标 CPU 以及屏蔽状态。因此相比传统 8259A，IOAPIC 能够更加灵活地管理和路由硬件中断。



Local APIC 除了接收 IOAPIC 发来的外部中断，还承担 Local APIC Timer、IPI、性能监控中断以及 APIC Error 等功能。尤其是在 SMP 多核系统中，CPU 之间发送的 IPI（Inter Processor Interrupt）也是通过 Local APIC 完成的。



此外，现代 PCIe 设备大量使用 MSI 和 MSI-X。这种机制不再依赖传统物理 IRQ 线，而是通过特殊的内存写操作向中断控制体系发送中断消息。因此现代系统中已经同时存在传统引脚中断和 Message Signaled Interrupt 两种重要中断方式。



### 2.3 中断引脚、中断号与 IRQ 的映射关系



Linux 中断机制中还有一个非常重要的概念：硬件中断号、Linux IRQ Number 和 CPU Interrupt Vector 并不一定相同。



例如某个设备连接到中断控制器第 37 号输入，那么中断控制器层面的硬件中断号可能是：



Linux 内核为它分配的逻辑 IRQ Number 可能是 82，而最终 x86 CPU 使用的 Interrupt Vector 又可能是另外一个数字。因此整个关系可以理解成：设备中断源 → 中断控制器 hwirq → IRQ Domain → Linux IRQ Number → 中断控制器路由 → CPU Interrupt Vector。



Linux 使用 irq_domain 解决硬件中断号和 Linux 逻辑 IRQ Number 之间的映射问题。所以我们在 /proc/interrupts 里面看到 IRQ 126 时，不能简单理解为芯片上存在“第 126 根中断线”。



### 2.4 多核 CPU 下的中断分发与绑定机制



在多核系统当中，如果所有设备中断都集中在 CPU0，那么 CPU0 很容易成为性能瓶颈。因此 Linux 支持 IRQ Affinity，也就是规定某一个 IRQ 可以在哪些 CPU 上执行。



常用接口包括：



假如 smp_affinity_list 显示：



表示 IRQ126 可以被 CPU0～CPU7 处理。如果执行：



则可以将其绑定到 CPU4。



对于现代多队列网卡、NVMe 等设备，还可以做到 Queue0 → IRQ0 → CPU0、Queue1 → IRQ1 → CPU1、Queue2 → IRQ2 → CPU2 这样的映射，使多个 CPU 真正并行处理中断和设备队列。



## 三、Linux 中断核心架构：上半部与下半部机制



### 3.1 中断处理的核心痛点：快速响应与耗时处理的矛盾



Linux 中断处理中最核心的矛盾就是：设备希望中断来了以后立即处理，但是 CPU 又希望中断处理程序尽快结束。



以网卡为例，接收到一个数据包以后可能涉及读取设备状态、处理 DMA 描述符、获取数据包、协议栈处理、路由、Socket 查找甚至唤醒用户程序。如果这些事情全部在硬件中断处理程序中完成，那么 ISR 执行时间就会非常长，会造成其他中断响应延迟、调度延迟增加以及系统实时性下降。



因此 Linux 采用了一个非常重要的设计思想：必须马上做的事情立即处理，不需要马上完成的事情延迟处理。 由此形成了 Top Half 和 Bottom Half，也就是我们常说的上半部和下半部。



### 3.2 上半部（Top Half）：核心特性、执行规则与适用场景



所谓上半部，主要指硬件中断发生以后立即执行的中断服务程序 ISR。它最重要的原则就是 快，一般只完成确认中断来源、读取必要状态、清除或者确认中断、保存必须马上读取的数据以及触发后续下半部等操作。



一个典型 ISR 可以写成：



这个 ISR 只做三件事：检查设备状态、清除中断、提交 Workqueue，然后马上退出。由于 ISR 运行在 hardirq context 中，因此不能执行会导致当前执行流睡眠的操作，例如 msleep()、普通 mutex_lock() 或主动调用 schedule() 等。



### 3.3 下半部（Bottom Half）：设计目的与分类体系



下半部的本质就是：把没有必要在硬中断上下文立即完成的工作推迟执行。 Linux 历史上出现过多种 Bottom Half 实现方式，目前学习和开发中最常见的是 Softirq、Tasklet、Workqueue、Timer 以及 Threaded IRQ。



其中 Softirq 主要用于网络、定时器、RCU、调度等内核高频核心模块；Tasklet 构建在 Softirq 之上；Workqueue 通过内核工作线程执行，因此可以进入睡眠状态；Timer 主要用于定时和超时处理；Threaded IRQ 则直接把中断后续处理放入内核线程中执行。



### 3.4 下半部四大实现方式对比：软中断、Tasklet、工作队列、定时器



Softirq 主要服务于调用频率非常高、性能要求很高的内核模块，例如网络收发、Timer、RCU 等。它运行于原子上下文，不能睡眠，而且同一种 Softirq 可以同时运行在多个 CPU 上，因此必须认真考虑并发问题。



Tasklet 构建在 Softirq 之上，同样不能睡眠，但是同一个 Tasklet 不会同时在多个 CPU 上执行，因此在并发控制方面比直接使用 Softirq 简单一些。



Workqueue 的普通工作项由内核 worker 线程执行，因此运行于进程上下文，可以调用可能睡眠的函数、使用 mutex，也更加适合普通设备驱动中的复杂延迟处理。



Timer 主要解决延时、超时以及周期性事件，例如设备发送命令之后规定 100ms 内没有完成就执行超时处理。



机制执行上下文能否睡眠典型用途SoftirqSoftirq Context否网络、定时、RCUTaskletSoftirq Context否传统驱动延迟处理WorkqueueProcess Context是普通设备复杂处理TimerTimer/Softirq 相关上下文否超时、周期任务



机制



执行上下文



能否睡眠



典型用途



Softirq



Softirq Context



否



网络、定时、RCU



Tasklet



Softirq Context



否



传统驱动延迟处理



Workqueue



Process Context



是



普通设备复杂处理



Timer



Timer/Softirq 相关上下文



否



超时、周期任务



### 3.5 上下半部协同工作完整逻辑



上下半部协同工作的基本逻辑可以概括为：设备产生 IRQ 后，ISR 首先读取和确认中断状态，清除硬件中断源并保存必要信息，然后通过 Softirq、Tasklet、Workqueue 或 Threaded IRQ 提交后续任务，随后迅速退出 hardirq context。之后下半部再完成数据解析、复杂计算、设备状态更新、通知用户空间等耗时工作。



也就是说，上半部负责“快速接单”，下半部负责“真正干活”。这样既能够保证硬件事件及时响应，又不会让 CPU 长时间停留在不可睡眠的硬中断上下文当中。



## 四、中断处理完整执行流程



### 4.1 硬件触发中断：从设备引脚到 CPU 感知全过程



硬件中断通常起始于某一个设备内部事件，例如网卡接收到数据、DMA 传输完成、UART 接收到字符或者 GPIO 出现下降沿。设备随后通过 IRQ 引脚或者 MSI/MSI-X 等方式发出中断请求，中断控制器检查该中断是否被屏蔽、优先级是否满足、目标 CPU 是谁以及触发方式是否有效，如果条件满足，就会把中断投递给对应 CPU。



对于 MSI/MSI-X 来说，底层并不是简单拉高或者拉低一根物理 IRQ 线，而是设备通过消息写操作触发中断，不过从 Linux 上层来看，最终同样会转换成一个可被 Generic IRQ 管理的硬件中断事件。



### 4.2 中断响应：CPU 保存现场、进入中断上下文



CPU 接收到一个允许处理的中断以后，并不会直接进入 C 语言 ISR，而是首先按照处理器架构规定进入对应中断入口。以 x86 为例，CPU 根据 Interrupt Vector 在 IDT 中找到相应入口，硬件首先保存一部分关键状态，随后 Linux 汇编入口代码继续保存必要寄存器，并组织形成类似 pt_regs 的寄存器现场。



因此整个过程可以理解为：当前程序 → 硬件中断 → CPU 保存基础现场 → 汇编入口继续保存软件现场 → 进入 Linux hardirq 处理逻辑。 不同 CPU 架构具体保存哪些寄存器以及保存方式存在差异，因此不能简单认为所有寄存器都由 CPU 硬件自动保存。



### 4.3 中断入口：内核中断向量表匹配机制



以 x86 为例，CPU 根据 Interrupt Vector 查询 IDT，找到对应中断入口。Linux 在系统启动阶段会提前完成 IDT 初始化，随后架构相关代码再根据向量找到 Linux 对应的 IRQ 管理对象。



Generic IRQ 中一个非常重要的数据结构就是：



可以把 irq_desc 理解为 Linux 内核用于描述和管理某一个 IRQ 的核心对象，它会关联 irq_data、irq_chip、IRQ Flow Handler、irqaction、中断状态以及统计信息等。因此整体关系可以理解为：CPU Vector → 架构中断入口 → Linux IRQ → irq_desc → Generic IRQ Flow Handler。



### 4.4 上半部执行：中断服务程序 ISR 运行逻辑



Generic IRQ 找到对应 irq_desc 以后，还需要根据中断触发方式以及中断控制器特性选择相应 Flow Handler，例如：



随后进一步进入类似：



的调用过程，最终执行驱动开发者通过 request_irq() 注册的 ISR。共享中断之所以能够存在，也正是因为一个 IRQ 可以关联多个 irqaction，内核依次调用不同设备注册的 handler()。



### 4.5 下半部调度与延迟处理执行流程



如果 ISR 中触发 Softirq，内核通常不会把所有工作直接放在硬件中断处理过程中完成，而是设置当前 CPU 对应 Softirq 的 pending bit。在 hardirq 退出阶段，如果发现存在待处理 Softirq，就会在合适时机进入 Softirq 处理流程。



如果 Softirq 工作量非常大，Linux 不会无限制地停留在 Softirq 中，否则用户进程和其他任务可能长时间无法运行。超过一定处理时间或者循环次数以后，剩余工作会交给对应 CPU 的 ksoftirqd/N 内核线程继续执行。



### 4.6 中断退出：恢复现场、返回原执行流程



硬件中断处理完成以后，内核需要退出 hardirq context，并检查是否存在待处理 Softirq、调度请求等情况，然后逐步恢复中断进入之前保存的寄存器现场，最后返回到被中断的原执行流。



因此一次完整中断绝不仅仅是“IRQ → ISR → return”，而是一条贯穿 CPU 架构、中断控制器、Generic IRQ、设备驱动、Softirq 以及调度器 的完整执行链路。



## 五、关键子模块：软中断与 Tasklet 深度解析



### 5.1 软中断（Softirq）数据结构与优先级体系



Linux Softirq 并不是为每一个设备动态创建一种软件中断，而是由内核提前定义固定类型。典型类型包括：



每一个 CPU 都维护自己的 Softirq pending 状态。当某一种 Softirq 需要执行的时候，只需要设置对应 pending bit，随后内核在合适时机扫描这些 pending bit 并执行对应处理函数。因此 Softirq 更准确地理解应该是 固定 Softirq Vector + per-CPU Pending Bitmap，而不是普通意义上的动态任务队列。



### 5.2 内核预定义 Softirq 类型



常见 Softirq 中，NET_RX_SOFTIRQ 主要负责网络接收，NET_TX_SOFTIRQ 负责网络发送，TIMER_SOFTIRQ 用于普通内核定时器，SCHED_SOFTIRQ 与调度相关延迟处理有关，RCU_SOFTIRQ 用于 RCU 回调，而 TASKLET_SOFTIRQ 则是普通 Tasklet 的底层执行载体。



由此也可以看出，Softirq 主要适用于调用频率极高、性能敏感并且属于内核核心子系统的场景。普通驱动开发者一般没有必要自行扩展新的 Softirq 类型。



### 5.3 Softirq 触发、调度与执行时机



Softirq 的典型执行路径可以概括为：硬件 ISR 调用 raise_softirq() 或相关接口设置 per-CPU pending bit，随后在 IRQ 退出或者其他合适时机检查 pending 状态，如果存在待处理 Softirq，就执行相应 action；如果 Softirq 工作量过大，则唤醒 ksoftirqd/N 内核线程继续完成处理。



可以通过：



查看系统中的 ksoftirqd/0、ksoftirqd/1、ksoftirqd/2 等线程。如果某个 ksoftirqd/N 长期占用大量 CPU，通常意味着对应 CPU 上存在较严重的 Softirq 压力，例如网络收包量过大。



### 5.4 Tasklet 的实现原理与底层依赖



Tasklet 并不是一个独立于 Softirq 的系统，它底层依赖 TASKLET_SOFTIRQ 和 HI_SOFTIRQ。当调用 tasklet_schedule() 以后，Tasklet 会加入当前 CPU 对应的 Tasklet 队列，然后触发相应 Softirq，Softirq 执行时再调用具体 Tasklet 回调函数。



Tasklet 最重要的特点是：同一个 Tasklet 自身不会同时在多个 CPU 上并行运行，但不同 Tasklet 之间仍然可能并行执行。 这也是 Tasklet 相比直接使用 Softirq 更容易进行并发控制的重要原因之一。



### 5.5 Tasklet 常规使用规则与上下文限制



典型 Tasklet 可以写成：



需要注意，不同 Linux 内核版本中的 Tasklet API 宏和回调形式可能发生变化，因此实际编译驱动时应该依据目标内核版本的 include/linux/interrupt.h 为准。



Tasklet 本质上仍然运行于 Softirq Context，因此不能睡眠，不能使用普通 mutex，也不能执行可能主动进入调度器的函数。



### 5.6 Softirq 与 Tasklet 的核心区别与选型原则



Softirq 是 Linux 内核提供的更底层高性能延迟执行机制，而 Tasklet 则是建立在 Softirq 之上的封装。Softirq 的同一种 handler 可以同时运行在多个 CPU 上，因此性能较强，但是并发控制更加复杂；同一个 Tasklet 则不会在多个 CPU 同时执行，因此使用起来相对简单。



不过对于现代普通驱动，如果后续工作需要睡眠、复杂 IO、mutex 或较长时间处理，通常更加适合 Workqueue 或 Threaded IRQ，而不是 Tasklet。



## 六、中断设备驱动：中断注册与使用



### 6.1 中断资源申请与释放核心 API



Linux 驱动申请 IRQ 最常见的接口就是：



其典型形式为：



例如：



设备被卸载或者驱动退出时需要执行：



在现代 Linux 中，request_irq() 本质上可以看作普通非线程化中断注册接口，而底层与 request_threaded_irq() 的通用注册逻辑存在紧密联系。



### 6.2 中断标志位解析



驱动开发中比较常见的 IRQ Flag 包括 IRQF_TRIGGER_RISING、IRQF_TRIGGER_FALLING、IRQF_TRIGGER_HIGH 和 IRQF_TRIGGER_LOW，分别表示上升沿、下降沿、高电平以及低电平触发；IRQF_SHARED 表示共享 IRQ；IRQF_ONESHOT 则常用于 Threaded IRQ，使中断在线程化处理函数结束之前保持相应的屏蔽语义。



选择哪一种触发方式不能凭驱动开发者随意决定，而应该依据硬件线路、中断控制器能力以及设备芯片的数据手册进行配置。



### 6.3 ISR 编写规范与禁忌



ISR 编写的第一原则就是尽可能短。通常只进行确认中断来源、读取状态寄存器、清除中断、保存必要数据以及调度 Bottom Half 等操作。不能在普通 hardirq handler 中执行 msleep()、普通 mutex_lock()、文件 IO、大量复杂协议处理或者任何可能导致当前执行流睡眠的操作。



如果设备中断之后确实需要复杂数据处理，就应该把这些任务放到 Workqueue 或 Threaded IRQ 中完成。



### 6.4 共享中断的冲突解决与执行逻辑



假设设备 A、B、C 共用 IRQ18，那么这个 IRQ 对应的 irq_desc 可以关联多个 irqaction。IRQ18 触发以后，Generic IRQ 会依次调用这些设备注册的 handler，因此每一个共享中断 ISR 的第一件事就是判断本次中断是否由自己的设备产生。



例如：



不是自己设备产生的中断返回 IRQ_NONE，确认属于自己以后才处理并返回 IRQ_HANDLED。对于共享 IRQ，dev_id 还应该能够唯一标识设备实例，以便注册和释放正确的 IRQ handler。



### 6.5 DeviceTree 中断配置与解析



ARM、RISC-V 等嵌入式 Linux 平台大量使用 DeviceTree 描述中断资源。例如：



其中 interrupt-parent 表示由哪一个中断控制器管理该中断，interrupts 则描述具体硬件中断参数。需要特别注意的是，interrupts 中有几个 cell、每个 cell 表示什么，并不是 Linux 全局固定的，而是由对应中断控制器的 DeviceTree Binding 决定。



驱动中一般通过：



获得 Linux IRQ Number，再调用：



完成注册。这样就把 DeviceTree、IRQ Domain、Generic IRQ 和设备驱动完整串联起来了。



## 七、多核中断与中断负载均衡



### 7.1 中断亲和性 IRQ Affinity 原理与配置



现代服务器和桌面处理器通常具有多个 CPU Core，如果所有设备中断都集中在 CPU0，那么 CPU0 很容易成为系统瓶颈。Linux 因此通过 IRQ Affinity 控制每个 IRQ 可以运行在哪些 CPU 上。



常用命令包括：



如果希望把 IRQ126 绑定到 CPU3，可以执行：



对于高性能网卡，还需要进一步结合 RX/TX Queue、MSI-X、NUMA 和应用线程 CPU Affinity 进行整体优化。



### 7.2 多核环境中断并发与嵌套规则



假设 CPU0 正在处理 IRQ32，CPU1 完全可能同时处理 IRQ45，因此多核系统中的中断处理天然具有并发性。如果某些数据既可能被普通进程访问，又可能在 ISR 中被访问，就需要认真进行同步设计。



驱动中经常看到：



之所以大量使用 Spinlock，而不是普通 Mutex，其中一个重要原因就是中断上下文不能睡眠。中断并发问题实际上同时涉及 CPU 并发、IRQ 并发、锁以及内存访问顺序等多个方面。



### 7.3 内核中断负载均衡机制与自动调度策略



Linux 内核提供 IRQ Affinity、Managed IRQ 和 MSI-X Affinity 等基础能力，可以依据 CPU Topology 对设备中断向量进行合理分布。用户空间还经常运行 irqbalance 服务，用于观察系统 CPU 拓扑和 IRQ 负载并自动调整部分中断的 CPU 分配。



需要明确区分：IRQ Affinity 是 Linux 内核提供的机制，而 irqbalance 是用户空间守护程序，二者并不是同一个东西。



### 7.4 中断扎堆问题与性能优化方案



执行：



如果发现某块网卡的多个 IRQ 几乎全部集中在 CPU0，而其他 CPU 中断数量很少，就说明出现了典型的中断扎堆问题。这时应该进一步检查 MSI-X Queue 数量、IRQ Affinity、NUMA、RSS、RPS、XPS 以及 NAPI 配置。



对于现代多队列设备，一般希望不同 Queue 对应不同 IRQ，并合理分配到多个 CPU 上。例如 RX Queue0 → IRQ0 → CPU0、RX Queue1 → IRQ1 → CPU1。对于 NUMA 系统，还应该尽量让设备所在 NUMA Node、IRQ 所在 CPU 和负责处理数据的应用线程处于合理的拓扑关系之中。



## 八、中断调试、性能问题与优化方案



### 8.1 中断相关内核参数与调试工具



Linux 中断调试最重要的接口之一是：



它能够显示每个 IRQ 在各个 CPU 上的硬中断统计。Softirq 则可以通过：



查看，其中能够看到 NET_RX、NET_TX、TIMER、RCU、SCHED 等类型。



此外还可以使用 /proc/irq/&lt;IRQ&gt;/smp_affinity、top、top -H、perf top、perf record 和 perf report 进行性能分析。如果需要进一步观察中断时间，还可以使用 ftrace/tracefs 提供的 irq_handler_entry、irq_handler_exit、softirq_raise、softirq_entry 和 softirq_exit 等 tracepoint。



### 8.2 常见中断异常



中断丢失指设备已经发生事件，但是 CPU 最终没有正确处理，可能原因包括 IRQ 被 Mask、触发方式配置错误、DeviceTree 参数错误、中断控制器配置异常、设备状态清除时序错误、驱动竞争条件以及硬件线路问题等。



另外一种常见问题就是 Interrupt Storm，也就是中断风暴。例如一个低电平触发设备产生中断以后，ISR 本应清除设备内部 pending 状态，但驱动没有正确清除，于是 IRQ Line 一直保持低电平。ISR 每次返回以后中断控制器都会马上再次触发中断，CPU 最终被不断重复的 IRQ 打满。



如果系统日志出现：



甚至随后发现 IRQ 被禁用，就应该重点检查共享 IRQ 判断逻辑、设备状态寄存器以及中断源清除流程。



### 8.3 中断耗时过长的危害与排查方法



假设一个 ISR 每次执行 500μs，而设备每秒产生 5000 次中断，那么仅 ISR 理论处理时间就达到 2.5 秒，而单个 CPU 每秒实际上只有 1 秒时间，显然已经不可能完成处理。最终很容易造成 IRQ backlog、Softirq backlog、调度延迟、网络丢包、系统卡顿以及实时延迟增加。



因此排查中断性能问题时，不仅要查看 IRQ 次数，还应该测量每一次 ISR 的执行时间，并判断是否存在应该下放到 Workqueue、Softirq 或 Threaded IRQ 中的耗时操作。



### 8.4 高并发场景下的中断性能优化实战



高并发环境中的中断优化通常需要综合考虑 Interrupt Coalescing、MSI-X、多队列、NAPI、IRQ Affinity、NUMA、RSS/RPS/XPS、CPU Isolation 和线程 Affinity 等机制，而不是简单把 IRQ 平均分到所有 CPU。



例如高速网卡通常采用 Interrupt Coalescing，不是每收到一个数据包就马上产生中断，而是累计一定数量数据包或者达到一定时间后再产生一次 IRQ，从而显著减少中断次数。Linux NAPI 则在网卡中断之后暂时降低或者关闭 RX 中断，通过 Poll 批量收取数据包，处理完成后再恢复中断，由此避免高流量场景下 CPU 被中断风暴完全占满。



### 8.5 中断线程化机制原理与适用场景



如果设备中断之后需要执行相对复杂并且可能睡眠的操作，可以使用：



例如：



注册时：



Primary Handler 仍然运行在 hardirq context 中，只完成确认和清除中断等非常短的操作，然后返回 IRQ_WAKE_THREAD，内核再唤醒对应 IRQ Thread 执行 thread_fn()。由于后者处于线程上下文，因此可以执行某些会睡眠的操作。在 PREEMPT_RT 实时内核中，中断线程化更是降低系统不可抢占时间和实时延迟的重要手段。



## 九、核心源码解析



### 9.1 中断向量表初始化源码分析



以 x86 为例，Linux 启动过程中需要建立 IDT，也就是 Interrupt Descriptor Table。相关核心代码主要位于：



其中可以看到 idt_setup_early_traps()、idt_setup_traps()、idt_setup_apic_and_irq_gates() 等初始化函数。系统通过这些函数为 CPU Exception、APIC Interrupt、SMP IPI 以及普通外部 IRQ 安装对应入口。



因此 CPU 接收到 Interrupt Vector 以后，首先通过 IDT 找到对应入口，再进入 Linux 架构相关中断代码。



### 9.2 request_irq 注册流程源码拆解



驱动执行：



以后，并不是简单把函数指针放进某个全局数组，而是会建立对应 irqaction，填充 handler、flags、dev_id、name 等信息，再找到相应 irq_desc，最终把 irqaction 挂接到该 IRQ 对应的 action 链表中。



核心关系可以理解为：



对于共享 IRQ，一个 irq_desc 后面可以连接多个 irqaction，因此同一个硬件 IRQ 到来以后能够依次调用多个设备的 ISR。



### 9.3 中断入口 do_IRQ 核心逻辑源码解析



很多旧 Linux 教程会把 x86 中断入口描述成：



这种调用关系适用于部分旧内核，但是在现代 Linux 5.x/6.x，特别是较新的 x86-64 内核中，不能再机械记忆“所有普通外部中断统一进入 do_IRQ()”。



更加应该掌握的是其抽象流程：CPU Interrupt Vector → x86 架构中断入口 → Linux IRQ/irq_desc → Generic IRQ Flow Handler → handle_irq_event() → action-&gt;handler()。 也就是说，do_IRQ() 更适合作为理解老版本 Linux 中断体系的经典入口函数，而真正具有长期通用性的知识点是 Generic IRQ 的分层模型。



### 9.4 Softirq 调度源码流程



Softirq 的核心代码主要位于：



它的基本调用逻辑可以概括为：



不过内核不能无限执行 Softirq。假设高速网络不断产生新的 NET_RX_SOFTIRQ，如果每处理一次以后都立即继续处理新的 pending，那么普通进程可能长期得不到 CPU。因此内核会限制一次 Softirq 处理的时间和循环次数，如果仍有大量任务没有完成，就唤醒 ksoftirqd/N 内核线程接管后续工作，从而在吞吐量和系统调度延迟之间取得平衡。



### 9.5 中断上下文切换与现场保存源码逻辑



硬件中断进入和普通进程上下文切换并不是同一种机制。普通进程切换通常表现为 Task A 调用或者触发 schedule()，调度器保存 Task A 上下文并恢复 Task B；而硬件中断则是 CPU 从当前正在执行的上下文直接跳转到 IRQ Entry。



其基本流程可以概括为：原执行上下文 → CPU 保存基础状态 → 架构汇编入口继续保存现场 → 进入 Hardirq Context → 执行 ISR → IRQ Exit → 恢复现场 → 返回原执行流。



如果在中断退出的时候发现 need_resched 等调度条件已经满足，随后还可能发生一次真正的任务调度。因此硬件中断本身虽然不是普通任务切换，但是能够间接影响调度器的执行时机。



## 十、总结



### 10.1 中断处理机制整体架构梳理



Linux 中断完整体系可以概括为：硬件设备首先产生中断事件，中断控制器负责接收、屏蔽、优先级判断和 CPU 路由，CPU 根据 Interrupt Vector 进入架构中断入口，Linux 再通过 Generic IRQ 找到相应 irq_desc，依据 Flow Handler 和 irqaction 最终执行设备驱动注册的 ISR。ISR 只完成必须马上处理的工作，其余任务根据具体需求提交给 Softirq、Tasklet、Workqueue 或 Threaded IRQ。



从硬件到软件的完整链路可以记成：



### 10.2 上下半部、Softirq、Tasklet 核心知识点总结



Top Half 的核心要求是快速完成必须立即处理的操作；Bottom Half 则负责处理能够延迟执行的任务。Softirq 是 Linux 高性能内核级延迟执行机制，同一种 Softirq 可以同时运行在多个 CPU；Tasklet 建立在 Softirq 之上，同一个 Tasklet 自身不会在多个 CPU 同时执行；Workqueue 运行在内核 worker 线程的进程上下文中，因此可以睡眠；Threaded IRQ 则直接把较复杂的中断业务处理放入内核线程之中。



因此实际驱动开发中可以采用一个非常简单的判断原则：必须马上完成并且不能睡眠的操作放在 Hardirq；无需立即完成且不能睡眠的高性能任务可以使用 Softirq/Tasklet；如果任务可能睡眠或者执行时间较长，则优先考虑 Workqueue 或 Threaded IRQ。



### 10.3 面试高频题



1. 为什么中断要分上半部和下半部？



因为硬中断上下文必须尽快退出，所以把必须立即完成的工作放在上半部，把耗时或者不紧急的工作延迟到下半部。



2. 中断上下文为什么不能睡眠？



因为普通 hardirq context 并不是可以通过调度器阻塞并在以后恢复执行的普通进程上下文，因此不能调用可能导致当前执行流睡眠的函数。



3. CPU 软件中断和 Linux Softirq 是不是同一个东西？



不是。前者属于处理器指令和异常机制，后者是 Linux 内核自行实现的延迟处理机制。



4. Softirq 和 Tasklet 有什么区别？



Tasklet 构建在 Softirq 之上。同一种 Softirq 可以同时运行在多个 CPU，而同一个 Tasklet 自身不会在多个 CPU 同时执行。



5. Tasklet 和 Workqueue 最大的区别是什么？



Tasklet 运行于 Softirq Context，不能睡眠；Workqueue 运行于 Process Context，可以睡眠。



6. request_irq() 注册的 handler 保存在哪里？



可以简单理解成 irq_desc → irqaction → handler，共享 IRQ 则对应多个 irqaction。



7. 什么是 IRQ Domain？



IRQ Domain 负责完成硬件中断号 hwirq 与 Linux 逻辑 IRQ Number 之间的映射。



8. IRQ Number 和 CPU Interrupt Vector 是不是一个概念？



不是。IRQ 是 Linux 内核管理中断使用的逻辑编号，Vector 是 CPU 架构层面用于确定中断入口的编号，两者之间存在映射关系。



9. 为什么高速网络不能采用一个数据包一次中断？



因为中断进入和退出本身存在开销，高并发下容易形成 Interrupt Storm，因此现代网卡通常结合 Interrupt Coalescing、NAPI、多队列、MSI-X 和 IRQ Affinity 进行优化。



10. Threaded IRQ 有什么作用？



Threaded IRQ 可以把大量设备中断处理工作从 hardirq context 转移到内核线程，让这些处理受到调度器管理，并允许执行部分可能睡眠的操作。



Linux 中断处理机制虽然包含非常多概念，但是核心思想其实十分清晰。硬件产生中断请求以后，中断控制器负责收集、屏蔽、优先级判断以及 CPU 路由，CPU 根据 Interrupt Vector 进入架构中断入口，Linux Generic IRQ 根据 IRQ 找到 irq_desc，再通过 IRQ Flow Handler 和 irqaction 最终执行设备驱动通过 request_irq() 注册的 ISR。



与此同时，为了解决“硬件必须快速响应”和“实际设备处理可能十分耗时”之间的矛盾，Linux 又建立了上半部和下半部体系，并形成 Softirq、Tasklet、Workqueue、Threaded IRQ 等不同延迟执行机制。在 SMP 多核环境中，又通过 IRQ Affinity、MSI-X、多队列和 Managed IRQ 等机制，把不同中断合理分配到不同 CPU。



所以真正掌握 Linux 中断，并不是单纯记住一个：



而是需要把 硬件设备 → 中断控制器 → CPU Vector → 架构入口 → Generic IRQ → irq_desc → IRQ Flow Handler → irqaction → ISR → Bottom Half 这一条完整链路真正连接起来。只有这样，再去阅读 GPIO 驱动、UART 驱动、网卡驱动、PCIe 驱动以及 Linux 中断子系统源码的时候，才不会看到一堆互不相关的函数，而是能够准确判断每一个函数究竟处于中断体系的哪一层、上一层从哪里来、下一层又会去哪里。

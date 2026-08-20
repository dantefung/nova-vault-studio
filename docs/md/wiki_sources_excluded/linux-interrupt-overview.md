---
title: "Linux 中断管理概述"
date: "2026-07-21"
source: "协议森林"
url: "https://mp.weixin.qq.com/s/6aRLIlhZlf2H96YqjrsbUg"
---

# Linux 中断管理概述

> Linux 中断管理是操作系统内核中最核心、最复杂的子系统之一。它连接了软件与硬件，直接关系到系统的实时性、吞吐量和稳定性。

![顶半部/底半部分层架构](images/linux-interrupt-overview/001.jpeg)

## 顶半部 / 底半部分层架构

Linux 中断管理采用「顶半部 / 底半部」分层架构：

- **顶半部**：硬件中断的即时响应，由外设触发，经中断控制器交付 CPU 执行，负责应答硬件和记录数据，处于中断上下文
- **底半部**：处理耗时的业务逻辑，由顶半部触发，运行在进程上下文或软中断上下文中

## 三大底半部机制

![三大底半部机制对比](images/linux-interrupt-overview/002.jpeg)

三大底半部机制决定了中断处理的灵活度：

| 机制 | 层级 | 特点 | 适用场景 |
|------|------|------|----------|
| Softirq | 最底层 | 不可休眠、执行极快 | 网络收发等核心子系统 |
| Tasklet | 基于 Softirq | 同类型串行执行 | 驱动开发便捷接口 |
| Workqueue | 最上层 | 运行在进程上下文，允许休眠和阻塞 | 磁盘 IO 等耗时任务 |

![Softirq 执行流程](images/linux-interrupt-overview/003.jpeg)

![Tasklet 执行流程](images/linux-interrupt-overview/004.jpeg)

![Workqueue 执行流程](images/linux-interrupt-overview/005.jpeg)

## 核心原则

顶半部必须原子操作、极速返回，只有底半部允许进行复杂的进程调度。

> 作者：协议森林
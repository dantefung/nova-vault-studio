---
title: "计算机科学"
date: "2026-09-20"
---

# 计算机科学

> 从操作系统底层到软件工程与软件哲学——计算机基础知识的地图。

## 系统原理

操作系统、容器与运行时的底层机制。

- [proc 不是磁盘：Linux 虚拟文件系统的运行机制](./system-internals/proc-filesystem-linux.md) — 从 VFS 到 seq_file，拆解一次 `cat /proc/meminfo` 的完整内核调用链
- [Docker 分层构建与多阶段构建原理](./system-internals/docker-layer-build.md) — 镜像分层、构建缓存与多阶段构建的取舍

[查看全部 →](./system-internals/)

## 软件工程

从编程思维到工程全链路：如何把模糊问题转化为可维护的系统。

- [编程思维：把模糊问题转化为可计算系统](./software-engineering/programming-thinking.md)
- [软件工程基本功：六大核心观念](./software-engineering/software-engineering-fundamentals.md)
- [软件工程全链路：从需求到维护的完整闭环](./software-engineering/software-engineering-lifecycle.md)
- [对象、状态、快照、序列……：描述世界的基础语法](./software-engineering/foundation-concepts-framework.md)
- [湿件工程](./software-engineering/wetware-engineering.md)

[查看全部 →](./software-engineering/)

## 软件架构

- [一次性讲清楚常见的软件架构图](./architecture/software-architecture-diagrams.md) — 业务 / 应用 / 技术 / 数据 / 产品 / 系统 / 部署 / 信息架构图全景

[查看全部 →](./architecture/)

## 代码阅读

- [代码阅读方法论](./code-reading/) — 系统化读代码的 5 步法 + 大脑科学读码术

## 软件哲学

- [软件哲学](./software-philosophy/) — 开发范式演进、胶水编程、递归自优化、高内聚低耦合等

---

> `system-design-101/` 目录另收录 400+ 篇英文系统设计速览，暂不在此栏目展开。

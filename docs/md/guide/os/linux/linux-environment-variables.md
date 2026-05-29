---
title: "4张图搞懂Linux环境变量"
date: "2026-05-28"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/TgjX6-dTKwv163DacBarYw"
author: "ysh33"
abstract: "深入解析 Linux 环境变量：①进程级环境变量（key=value 字符串，随进程创建/销毁）；②内核视角 mm_struct、fork 复制/execve 重构建；③main 函数三形式（argc/argv/envp）；④Shell 环境变量：普通变量 vs export 导出；⑤getenv/setenv/unsetenv 用法；⑥常用 Shell 命令。"
---

> 来源：[4张图搞懂Linux环境变量](https://mp.weixin.qq.com/s/TgjX6-dTKwv163DacBarYw)，作者 ysh33

---

## 1. 什么是环境变量

环境变量是每个进程独享、可继承的一组 key=value 字符串，用于给进程传递运行配置、路径、语言、用户信息等全局参数。

- **作用域**：进程级，子进程默认继承父进程全部环境变量
- **存储形式**：字符串 NAME=VALUE
- **生命周期**：随进程创建而生、进程销毁而消失

环境变量存储在进程虚拟地址空间的**栈**，以字符串数组（环境变量表）存放。

**作用**：

- **命令检索**：通过 PATH 指定目录，让系统无需完整路径即可查找并执行命令
- **程序配置**：无需修改代码，通过键值参数向程序传递运行参数与业务配置
- **环境记录**：保存用户身份、工作目录、家目录等系统与用户基础信息
- **进程继承**：父进程的环境变量可自动传递给子进程
- **行为控制**：控制系统语言编码、动态库路径、终端样式等系统运行特性

---

## 2. 从内核看环境变量

Linux 系统中，每个进程都有一个环境变量表，默认情况下存储在进程虚拟地址空间的**栈**。`task_struct` 结构的 `mm` 字段（`struct mm_struct` 类型）表示进程的虚拟地址空间，`mm_struct` 的 `arg_start`、`arg_end`、`env_start`、`env_end` 字段用于标记进程虚拟地址空间中命令行参数和环境变量的边界位置：

```c
struct mm_struct {
    pgd_t *pgd;
    struct maple_tree mm_mt;
    unsigned long start_code, end_code;   // 代码段
    unsigned long start_data, end_data;  // 数据段
    unsigned long start_brk, brk;        // 堆
    unsigned long start_stack;           // 用户栈
    unsigned long arg_start, arg_end;    // 命令行参数边界
    unsigned long env_start, env_end;   // 环境变量边界
    ......
};
```

### 进程虚拟地址空间内存布局

```
┌──────────────────┐ ← 高地址
│     内核空间      │  0xFFFF800000000000 ~ 0xFFFFFFFFFFFFFFFF
├──────────────────┤
│      栈          │ ↓ 向低地址增长（函数调用、局部变量）
│      ↓           │
│      ↑           │
│      堆          │ ↑ 向高地址增长（malloc 动态申请）
│   内存映射区      │  mmap 映射文件/动态库
│    BSS 段        │  未初始化全局变量
│    数据段        │  已初始化全局/静态变量
│    代码段        │  编译后的机器指令（只读）
├──────────────────┤
│   用户空间       │  0x0000000000000000 ~ 0x00007FFFFFFFFFFF
└──────────────────┘
```

- **32位**：用户空间 3GB，内核空间 1GB
- **64位**：用户空间 128TB，内核空间 128TB

### fork 和 execve

- **fork**：子进程复制父进程虚拟地址空间（包括环境变量表），子进程继承父进程全部环境变量
- **execve**：执行新程序，销毁原有代码段/数据段/BSS，重新构建虚拟地址空间，需要**重新传入**环境变量表

---

## 3. main 函数

子进程加载完新程序后执行 main 函数，三种形式：

```c
int main(void);
int main(int argc, char *argv[]);
int main(int argc, char *argv[], char *envp[]);
```

- `argc`：命令行参数个数
- `argv`：参数字符串数组
- `envp`：环境变量数组，以 NULL 结尾，指向栈区的环境变量表

---

## 4. Shell 环境变量

Shell 维护了一个**变量表（全局哈希表）**，存储两类变量：

| 类型 | 作用域 | 示例 |
|------|--------|------|
| 普通变量（局部） | 仅当前 Shell | `a=123` |
| 环境变量（全局） | 当前 Shell 及所有子进程 | `export a=123` |

**核心规则**：

- 父进程环境变量可传递给子进程，子进程环境变量**无法**反向传递给父进程
- 子进程继承的是父进程环境变量的**完整副本**（不是共享内存），修改只影响自己

### Shell 常用环境变量

| 变量 | 含义 |
|------|------|
| PATH | 命令搜索路径 |
| HOME | 当前用户主目录 |
| USER | 当前登录用户名 |
| SHELL | Shell 解释器路径（如 /bin/bash） |
| LANG | 系统默认语言和区域设置 |
| PWD | 当前工作目录 |
| OLDPWD | 上一次工作目录 |
| PS1 | 主命令提示符样式 |
| HOSTNAME | 主机名 |
| TERM | 终端类型 |

### Shell 程序的环境变量继承

```
当前 Shell（变量表在数据段/堆）
  └── fork → 子 Shell（继承变量表）
        └── execve(/bin/bash) → 新 Shell（重新构建环境变量表）
```

子 Shell 执行新程序时：
- 如果是普通程序：和普通进程一样
- 如果是 Shell 程序：子 Shell 将继承的环境变量传入 execve，内核将其设置到栈，新 Shell 依据栈重建变量表

---

## 5. 设置和获取环境变量

```c
#include <stdlib.h>

char *getenv(const char *name);     // 读取，成功返回指向变量值的指针，失败返回 NULL
int setenv(const char *name, const char *value, int overwrite);  // 设置/新增，成功返回 0，失败返回 -1
int unsetenv(const char *name);      // 删除，成功返回 0，失败返回 -1
```

- `overwrite` = 0：若变量已存在，不修改
- `overwrite` ≠ 0：若变量已存在，强制覆盖

```c
setenv("AAA", "123456", 1);
char *path = getenv("PATH");
printf("PATH = %s\n", path);
unsetenv("AAA");
```

### environ 全局变量

Linux 系统为每个用户程序定义了全局变量 `environ`（二级字符串指针），实时指向环境变量表。程序通过 `environ` 定位环境变量表，再通过变量名查找。

### 新增环境变量的内存处理

环境变量表默认存储在**栈**，栈区内存布局已固化，直接插入会打乱其他数据。因此新增环境变量时，Linux 系统会在**堆区**申请新内存作为新环境变量表，复制旧表，插入新变量，更新 `environ` 指向新表。

---

## 6. Shell 环境变量相关命令

```bash
echo $var           # 查看单个变量值
env                 # 查看所有环境变量
set                 # 查看所有变量（环境变量 + 局部变量 + 函数）
export KEY="value"  # 定义并导出为环境变量
export              # 查看所有已导出的环境变量
unset var_name      # 删除普通变量/环境变量
```
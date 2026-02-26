# [Linux File System](https://deusyu.app/posts/linux-file-system/)

共 2103 字阅读需 5 分钟

[![](https://r2.deusyu.app/2388cb89-9a1a-495e-b94d-58a4c23d482a.png)](https://r2.deusyu.app/2388cb89-9a1a-495e-b94d-58a4c23d482a.png)

***

我印象中自己最常用的是`/etc` 其次是`/var`

我曾经也经常以为 usr 是 user，其实是 Unix System Resource 啦，ByteByteGo 的这个图片真的是太直观了，对于我这种视觉学习者非常友好，多看多记忆

***

> 本文分 两部分：
>
> 1️⃣ 故事版（对外发布） – 轻松科普、图解为主。
>
> 2️⃣ 速查版（自用手册） – 扁平目录、排错清单。

***

## **Part 1 ｜故事版**

### **开场故事**

还记得本科 Linux 编程课时，老师随口问“**/usr** 代表什么？”

当时我和大多数同学异口同声答“user”——全错。它其实是 **Unix System Resource**，最早就是「挂第二块硬盘的位置」。直到 1994 年，**Filesystem Hierarchy Standard (FHS)** 上线，这座“无序小镇”才第一次有了城市规划，目录各就各位。

***

### **一图速览（Mermaid 目录树）**

[![](https://r2.deusyu.app/40cb897f-19c9-4e49-93f7-80a4b517cc2c.png)](https://r2.deusyu.app/40cb897f-19c9-4e49-93f7-80a4b517cc2c.png)

> 速记口诀：
>
> Edit (/etc)、
>
> Vary (/var)、
>
> Share (/usr)、
>
> Home (/home)
>
> 先记常用四大目录，再补余下。

***

### **八大目录分块**

| **功能一句话**      | **常见子目录**                         | **常踩坑**              |                               |
| :------------- | :-------------------------------- | :------------------- | ----------------------------- |
| **/**          | 根，一切皆从这里分支                        | –                    | 根分区爆满=整机罢工                    |
| **/etc**       | *Everything To Configure*：系统与服务配置 | passwd、ssh/、systemd/ | 新手最爱 chmod -R 777 /etc → 秒变事故 |
| **/var**       | 可变数据：日志、队列、缓存                     | log/、lib/、cache/     | 日志滚动失控导致磁盘爆满                  |
| **/usr**       | 共享只读程序与库（Unix System Resource）    | bin/、lib/、share/     | 把源码安装到 /usr，升级覆盖              |
| **/usr/local** | 本机专属程序                            | 自编译软件                | 忘记加入 \$PATH                   |
| **/run**       | **2011 年后新增**的 tmpfs，存放运行时状态      | systemd/、user/       | 早期脚本仍写 /var/run，需兼容软链         |
| **/opt**       | 大型第三方套件                           | google/、cuda/        | 软件卸载残留                        |
| **/srv**       | 对外服务数据                            | www/、ftp/            | 很多发行版默认空置                     |

***

### **现代进化：/usr merge**

多数基于 systemd 的发行版（Fedora、Ubuntu、Arch…）已把

/bin /sbin /lib\* 软链到对应的 /usr/\*，即 **/usr merge**。好处是简化 initrd、容器镜像，并能把 /usr 做成只读快照。

***

### **容器映像视角**

典型的 Alpine / Ubuntu Slim 容器里，你通常只会看到 /etc /usr /bin /lib /lib64 /tmp 等最小集，其余目录由镜像构建者按需追加（或挂载卷），排错时别在 /var/log 苦苦寻找——它可能根本不存在！

***

## **Part 2 ｜速查版（自用手册）**

### **/etc – 配置中心**

*   **用途**：系统与服务的所有静态配置。FHS 要求“机器特定且随管理员修改”。
*   **高频文件**：ssh/sshd\_config, systemd/, hosts, resolv.conf.
*   **常见问题**：

    *   权限被意外修改 → 无法开机。
    *   卸载软件忘删残留 → 配置冲突。

***

### **/var – 可变数据**

*   **用途**：会不断增长或改变的文件。
*   **高频子目录**：

    *   log/ – 日志；
    *   lib/ – 服务状态（如 MySQL 库）；
    *   cache/ – 包管理器缓存；
    *   tmp/ – 临时缓存，比 /tmp 生命周期长。
*   **排错**：

    *   du -h –max-depth=1 /var | sort -h 查大户。
    *   /var/lib/docker 占满通常是镜像&容器未清理。

***

### **/usr – 共享只读**

*   **用途**：系统级（多用户共享）程序与库。
*   **/usr/local**：保留给「本机管理员安装的软件」。避免升级被覆盖。
*   **/usr merge 现状**：/bin→/usr/bin 软链化，确保 /usr 若做成只读快照，系统仍能正常启动。

***

### **/run – 运行时状态**

*   **用途**：自 FHS 3.0 起，用于存储自上次引导以来的 volatile 数据。由 tmpfs 挂载，重启即空。
*   **排错**：重启丢失的 PID 文件大概率写在这里。

***

### **/home – 用户目录**

*   **用途**：个人文件、配置（Desktop Linux 遵循 XDG 标准）。
*   **小贴士**：合理划分子卷或独立分区，便于系统重装不丢数据。

***

### **/opt – 第三方大软件**

*   **适合场景**：Oracle、CUDA、Chrome 等发行版仓库外的大型软件。
*   **维护**：保持 opt/// 三段式，升级与卸载清晰。

***

### **/srv – 对外服务数据**

*   **用途**：网站、FTP、仓库…面向客户端的数据根。
*   **现状**：许多发行版默认留空，纯按需使用。

***

### **常用排查命令速表**

| **场景**        | **命令**                                |
| :------------ | :------------------------------------ |
| 查看分区类型 & 容量   | df -hT                                |
| 找出目录空间占用      | du -h –max-depth=1 /path              |
| 实时监控日志        | tail -F /var/log/syslog               |
| 检查大于 1 GiB 文件 | find / -xdev -type f -size +1G -print |

笔记

由 [Circle 阅读助手](https://circlereader.com/) 生成

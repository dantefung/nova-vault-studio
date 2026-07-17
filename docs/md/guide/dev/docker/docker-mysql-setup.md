---
title: "Docker 安装 MySQL 完整流程：从快速启动到持久化部署"
date: "2026-07-17"
source: "用户投稿"
---

# Docker 安装 MySQL 完整流程：从快速启动到持久化部署

## 核心问题

开发环境需要快速搭建 MySQL 数据库，但不想花时间在复杂的安装配置上。Docker 容器化方案可以一键启动 MySQL，同时支持数据持久化和自定义配置。

## 快速启动：一个命令搞定

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=your_password \
  mysql:latest
```

**参数解析**：

| 参数 | 作用 |
|------|------|
| `-d` | 后台运行 |
| `--name mysql` | 容器命名为 mysql |
| `-p 3306:3306` | 端口映射（宿主机:容器）|
| `-e MYSQL_ROOT_PASSWORD=xxx` | root 密码（必须）|
| `mysql:latest` | 镜像+版本 |

**注意**：这种方式容器删除后数据丢失，默认字符集可能不支持中文。

## 进阶部署：数据持久化（推荐）

对于需要长期使用的场景，使用 Volume 挂载数据目录。

### 1. 创建宿主机目录

```bash
mkdir -p ~/docker/mysql/data ~/docker/mysql/conf ~/docker/mysql/log
```

### 2. 启动持久化容器

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -v ~/docker/mysql/data:/var/lib/mysql \
  -v ~/docker/mysql/conf:/etc/mysql/conf.d \
  -v ~/docker/mysql/log:/var/log/mysql \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e TZ=Asia/Shanghai \
  --restart=always \
  mysql:8.0
```

**关键参数**：

| 参数 | 作用 |
|------|------|
| `-v ~/docker/mysql/data:/var/lib/mysql` | 数据持久化 |
| `-e TZ=Asia/Shanghai` | 时区设置 |
| `--restart=always` | 自动重启 |
| `mysql:8.0` | 指定版本（推荐 8.0）|

## 自定义配置（中文字符集）

默认字符集可能不支持中文，通过自定义配置文件解决。

### 1. 创建配置文件

在 `~/docker/mysql/conf/` 下新建 `my.cnf`：

```ini
[client]
default-character-set=utf8mb4

[mysqld]
collation_server = utf8mb4_unicode_ci
character_set_server = utf8mb4
```

### 2. 重启容器生效

```bash
docker restart mysql
```

## 常用管理命令

| 命令 | 作用 |
|------|------|
| `docker ps` | 查看运行中的容器 |
| `docker stop mysql` | 停止容器 |
| `docker start mysql` | 启动已存在的容器 |
| `docker rm -f mysql` | 删除容器（慎用）|
| `docker exec -it mysql bash` | 进入容器内部 |
| `docker exec -it mysql mysql -uroot -p` | 在容器内连接 MySQL |

## 总结

- **快速启动**：适合本地开发/功能测试，一个命令搞定
- **持久化部署**：生产环境必须，数据安全 + 自定义配置
- **字符集配置**：通过 my.cnf 文件解决中文支持问题
- **进阶方案**：主从复制等复杂场景可用 docker-compose 编排

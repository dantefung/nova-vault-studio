# Debian 13 (Trixie) 添加 deb-multimedia 源完整指南

## 一、前置确认

确认当前系统版本：

```bash
lsb_release -a
```

或者：

```bash
cat /etc/os-release
```

如果看到：

```
VERSION_CODENAME=trixie
```

说明你是 **Debian 13 (Trixie)**。

---

## 二、添加 deb-multimedia 软件源

⚠ 注意：必须使用 `trixie`，不要写成 `bookworm`。

创建源文件：

```bash
sudo nano /etc/apt/sources.list.d/deb-multimedia.list
```

添加内容：

```
deb https://www.deb-multimedia.org trixie main non-free
```

保存退出。

---

## 三、安装 deb-multimedia 的 GPG key（正确方法）

不要手动 wget 固定版本号的 keyring 包（容易 404）。

正确流程如下：

### 1️⃣ 临时允许不安全仓库更新

```bash
sudo apt update --allow-insecure-repositories
```

### 2️⃣ 安装 keyring

```bash
sudo apt install deb-multimedia-keyring --allow-unauthenticated
```

### 3️⃣ 正常更新

```bash
sudo apt update
```

如果没有 GPG 报错，说明安装成功。

---

## 四、验证源是否启用

```bash
apt policy | grep deb-multimedia
```

或者查看某个包来源：

```bash
apt policy ffmpeg
```

---

## 五、解决 Sublime 源重复警告

如果看到类似警告：

```
目标 Packages 在 sublime-text.list 和 sublime-text.sources 中被配置多次
```

删除其中一个：

```bash
sudo rm /etc/apt/sources.list.d/sublime-text.list
```

然后：

```bash
sudo apt update
```

---

## 六、推荐：设置 apt 优先级（防止覆盖官方库）

创建 pin 文件：

```bash
sudo nano /etc/apt/preferences.d/deb-multimedia
```

写入：

```
Package: *
Pin: origin "www.deb-multimedia.org"
Pin-Priority: 100
```

说明：

* 官方 Debian 默认优先级为 500
* 设置为 100 表示：

  * 不会自动覆盖官方包
  * 只有手动指定安装时才会使用

---

## 七、安装软件示例

```bash
sudo apt install ffmpeg
sudo apt install vlc
```

如果想明确从 deb-multimedia 安装：

```bash
sudo apt install -t trixie ffmpeg
```

---

## 八、重要风险说明

* deb-multimedia 是第三方仓库
* 在 testing 版本（Trixie）上更容易产生依赖冲突
* 可能覆盖核心多媒体库（如 libavcodec、libavformat）

建议：

如果官方仓库能满足需求，优先使用官方仓库。

---

# 总结

| 项目        | 说明                                                               |
| --------- | ---------------------------------------------------------------- |
| Debian 版本 | 13 (Trixie)                                                      |
| 源地址       | [https://www.deb-multimedia.org](https://www.deb-multimedia.org) |
| 组件        | main non-free                                                    |
| 风险等级      | 中等（Testing 版本更高）                                                 |
| 推荐做法      | 配置 apt pin 限制优先级                                                 |



# Debian安装远程桌面客户端

**安装**

```
sudo apt update
sudo apt install remmina remmina-plugin-rdp -y
```

**启动**

```
remmina
```

配置：

协议：RDP

服务器：Windows IP（例如 192.168.1.100）

用户名：Windows 用户名

密码：Windows 登录密码

优点：

GUI好用

支持保存连接

支持多种协议（RDP、VNC、SSH）

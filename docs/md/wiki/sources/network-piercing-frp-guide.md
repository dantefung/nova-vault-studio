---
title: "玩转内外网互通：主流内网穿透方案对比与 frp 企业级自建实战"
date: "2026-09-16"
source: "君哥的学习笔记"
url: "https://www.it235.com/实用工具/内网穿透/pierce.html"
---

# 玩转内外网互通：主流内网穿透方案对比与 frp 企业级自建实战

> 本地开发、接口调试、客户 Demo 演示、第三方 Webhook 回调（微信/支付）没有公网 IP 怎么办？本文全面横评 Ngrok、Natapp、花生壳等商用服务，并手把手带你自建高性能、高稳定的企业级 frp 穿透集群。

<!-- more -->

你是否被以下问题所困扰

> 我想装个B让其他同学在外网访问我的程序，应该怎么办？
> 
> 
> 接了个小外包，给客户演示Demo没有站点怎么办？
> 
> 
> 做微信、支付宝支付等其他第三方平台的功能，没有外网回调地址，应该怎么办？

内网穿透,又叫NAT穿透，是计算机用语，翻译过来就是 你的电脑可以直接被你朋友访问。 通常我们的电脑是无法自己被访问的。因为我们的电脑缺少自己的独立的ip地址。现在ip稀缺，电信运营商已经不会随便分配固定ip给个人。

通常实现内网穿透，是通过路由器上端口映射来实现的。但是路由器通常不是每个人都有权限可以访问和设置,而且可能存在多级路由器较为复杂的网络结构。端口映射也无法实现。

![内网穿透教程配图](../images/network-piercing-frp-guide/001.png)

## 工具对比

*   Ngrok

开源，老牌穿透工具，源码很久没有更新了

*   钉钉穿透

工具基于ngrok封装，简单、见效快，新手、个人开发者最佳选择

*   花生壳

需要建立账号实名认证，支付2包卫龙辣条费用，可自选一个壳域名，注册过程比较麻烦，流量限制

*   NATAPP

免费通道：提供`http,tcp,udp`全隧道穿透，随机域名/随机TCP,UDP端口，不定时强制更换域名/端口

4包卫龙辣条的费用可以享有不限流量，自定义域名等好处

*   FRP自建

开源，强大牛逼，适合企业中开发使用，可穿透任意常规合法端口（包含22），需要提供云服务器，自己的域名，宽带由云服务器所决定

## Ngrok（强大）

三个可选版本

### ngrok国际版

登录[国际版官网](https://www.ngrok.com/docs)，注册账号，但国外版访问很慢，时间就是金钱，不推荐去折腾，急切装逼的我果断放弃。

### ngrok国内版

因为访问速度原因，有个国内版，名字叫[Sunny-Ngrok](http://ngrok.cc/)，访问地址如下：

*   官网：http://ngrok.cc

*   后台地址：https://www.ngrok.cc/user

使用步骤如下：

1.   访问[ngrok官网下载](https://ngrok.cc/)下载对应你电脑的客户端，Mac就下Mac版

![内网穿透教程配图](../images/network-piercing-frp-guide/002.png)



2.   现在网站呢注册好之后，登录后台地址

3.   提示绑定公众号，扫码绑定即可

![内网穿透教程配图](../images/network-piercing-frp-guide/003.png)

4.   开通免费隧道试试效果，如果经常使用，建议购买个10块钱的

![内网穿透教程配图](../images/network-piercing-frp-guide/004.png)

5.   配置服务器映射信息

![内网穿透教程配图](../images/network-piercing-frp-guide/005.png)

![内网穿透教程配图](../images/network-piercing-frp-guide/006.png)

**上图的隧道ID是重点，圈起来，接下来要使用**

6.   开启客户端

打开命令行窗口CMD，切花到下载的客户端目录

![内网穿透教程配图](../images/network-piercing-frp-guide/007.png)

7.   输入如下命令启动客户端

```
格式：sunny.exe clientid 隧道ID
例如：sunny.exe clientid 56259703fe6e1755
```
Copied! 
1  
2 
成功后会出现如下结果

![内网穿透教程配图](../images/network-piercing-frp-guide/008.png)

上图表示前面的域名映射到我本机的9080端口，意思就是访问前面的域名跟访问我后面的127.0.0.1:9080是一个效果

8.   接下来本地起一个可以访问的服务，端口为9080

![内网穿透教程配图](../images/network-piercing-frp-guide/009.png)

9.   浏览器访问，或者让你朋友在远方访问，顺便装个B

![内网穿透教程配图](../images/network-piercing-frp-guide/010.png)

这2个信息可以在编辑中删除掉，如下

![内网穿透教程配图](../images/network-piercing-frp-guide/011.png)

![内网穿透教程配图](../images/network-piercing-frp-guide/012.png)

接下来再次访问

![内网穿透教程配图](../images/network-piercing-frp-guide/013.png)

10.   总结

    *   下载客户端
    *   在官网购买隧道，该隧道作为打通你本地的通道，记录下来隧道ID
    *   设置http授权信息（可选）
    *   使用命令行启动客户端，输入对应指令和隧道ID，返回启动成功的页面
    *   开启本地对应映射端口的Http服务（任一语言实现即可）
    *   使用客户端给出的域名进行访问观看

### 小米球ngrok

由个人开发者基于ngrok1.7版本源码进行搭建，官网：http://ngrok.ciqiuwl.cn/

1.   前往控制台(https://manager.xiaomiqiu.com/)注册，获取token(免费)

![内网穿透教程配图](../images/network-piercing-frp-guide/014.png)

2.   登录后，在控制台首页下载windows版本的客户端，解压到你喜欢的目录

![内网穿透教程配图](../images/network-piercing-frp-guide/015.png)

3.   在控制台获取token

![内网穿透教程配图](../images/network-piercing-frp-guide/016.png)

4.   修改解压目录下的ngrok.conf配置文件，因为部分参数已经被占用

![内网穿透教程配图](../images/network-piercing-frp-guide/017.png)

上述端口也可根据当前实际情况进行修改

5.   在命令行下进入到ngrok客户端目录下

![内网穿透教程配图](../images/network-piercing-frp-guide/018.png)

6.   启动bat快捷程序，或执行如下命令

    *   执行命令

```
格式：
ngrok.exe -config ngrok.conf -log=ngrok.log start 隧道名称
示例：
ngrok.exe -config ngrok.conf -log=ngrok.log start httptun
```
Copied! 
1  
2  
3  
4 
    *   点击快捷程序bat启动

![内网穿透教程配图](../images/network-piercing-frp-guide/019.png)

    *   成功的结果如下，如果失败了，请检查token是否正确，子域名是否够复杂

![内网穿透教程配图](../images/network-piercing-frp-guide/020.png)

    *   失败的结果如下

![内网穿透教程配图](../images/network-piercing-frp-guide/021.png)

7.   启动服务器验证请求穿透结果是否生效

![内网穿透教程配图](../images/network-piercing-frp-guide/022.png)

![内网穿透教程配图](../images/network-piercing-frp-guide/023.png)

8.   用法几乎跟ngrok国内版一样，说明国内版也是基于开源程序编写后提供的服务

## 钉钉穿透（简单）

[官方文档地址](https://ding-doc.dingtalk.com/doc#/kn6zg7/hb7000)[Github下载地址](https://github.com/open-dingtalk/pierced.git)

君哥准备好的下载地址

*   链接：https://pan.baidu.com/s/1KbQG-omGNzsZMb3g7aKdTg
*   提取码：nsnh

### Windows使用

我存放在`D:\tifang\code\tfserver\pierced\`目录下

*   打开CMD命令行，进入到当前目录，输入如下参数

![内网穿透教程配图](../images/network-piercing-frp-guide/024.png)

```
-- 详细命令
C:\Users\nobug>D:

D:\>cd D:\tifang\code\tfserver\pierced\

D:\tifang\code\tfserver\pierced>cd windows_64

D:\tifang\code\tfserver\pierced\windows_64>ding.exe -config=./ding.cfg -subdomain=abcdefg 9085
```
Copied! 
1  
2  
3  
4  
5  
6  
7  
8 
*   执行后的结果

下图表示域名`http://abcdefg.vaiwan.com`映射到你本地的`http://127.0.0.1:9085`

![内网穿透教程配图](../images/network-piercing-frp-guide/025.png)

*   开启本地9085端口服务，然后在浏览器访问接口

![内网穿透教程配图](../images/network-piercing-frp-guide/026.png)



*   尝试访问穿透域名

![内网穿透教程配图](../images/network-piercing-frp-guide/027.png)

![内网穿透教程配图](../images/network-piercing-frp-guide/028.png)

### MAC使用

[待补充，详见官方文档](https://ding-doc.dingtalk.com/doc#/kn6zg7/hb7000)

### Linux使用

[待补充，祥见官方文档](https://ding-doc.dingtalk.com/doc#/kn6zg7/hb7000)

## 花生壳（个性化）

1.   打开[花生壳官网](https://hsk.oray.com/)，下载花生壳客户端并安装

2.   注册花生壳账号并登陆

3.   根据[帮助视频](https://www.it235.com/%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7/%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/pierce.html)和[花生壳官方帮助手册](http://service.oray.com/question/8146.html)进行配置使用

4.   花生壳遭人诟病的地方是，使用复杂，偶尔抽风，网速慢

## NATAPP（一般般）

1.   打开NATAPP官网，下载对应的客户端到本地

2.   注册natapp账号登陆

3.   购买免费隧道并配置，获取token

4.   在本地使用cmd命令行的方式启动exe文件，并指定token

```
natapp.exe -authtoken=c92c66463fa9fc69
```
Copied! 
1 
5.   浏览器访问

6.   官方文档地址：[https://natapp.cn/article/natapp_newbie](https://natapp.cn/article/natapp_newbie)

## 内网穿透原理

> 其他内网穿透工具，nat123，小蚂蚁

![内网穿透教程配图](../images/network-piercing-frp-guide/029.png)

## FRP自建（最强，企业首选）

### 基础使用

自建frp需要部署服务端与客户端，服务端类似于跟花生壳服务端，ngrok服务端一样，暴露出通信端口，客户端连接后进行通信

*   服务端

需要有公网ip，最合适的机器为云服务（阿里云/腾讯云）

*   客户端

本地的Linux虚拟机或者其他物理机

1.   分别在服务端与客户端下载frp源码

```
$ wget https://github.com/fatedier/frp/releases/download/v0.33.0/frp_0.33.0_linux_amd64.tar.gz
$ tar xzvf  frp_0.33.0_linux_amd64.tar.gz
$ mv frp_0.33.0_linux_amd64 frp
```
Copied! 
1  
2  
3 
2.   服务端删除掉客户端相关配置

```
$ rm -f frpc frpc.ini frpc_full.ini
```
Copied! 
1 
3.   客户端删除掉服务端的相关配置

```
$ rm -f frps frps.ini frps_full.ini
```
Copied! 
1 
4.   查看客户端与服务端的默认配置项

```
# 服务端配置如下
[common]
bind_port = 7000

# 客户端配置如下
[common]
server_addr = 127.0.0.1
server_port = 7000

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
```
Copied! 
1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14 
5.   配置最简单的frps

```
$ vim frps.ini

[common]
bind_port = 7000	# 表示监听7000端口作为客户端对话的入口
```
Copied! 
1  
2  
3  
4 
开启云服务器`7000`端口的防火墙，使外界能够通过`7000`端口连接到内网服务

![内网穿透教程配图](../images/network-piercing-frp-guide/030.png)

我的客户端ip属于`101.81.125.0`端口范围内，所以客户端通过7000端口能够连接上这台服务器

6.   启动服务端

```
$ nohup ./frps -c frps.ini &
```
Copied! 
1 
7.   客户端配置如下

```
$ vim frpc.ini

[common]
server_addr = 云服务器公网ip
server_port = 7000
```
Copied! 
1  
2  
3  
4  
5 
8.   启动客户端

```
$ nohup ./frpc -c frpc.ini &
```
Copied! 
1 

### 仪表盘使用

1.   服务端配置

```
[common]
#服务端连接客户端的端口
bind_port = 7000
#服务端仪表板面板的端口
dashboard_port = 7500 
#仪表板页面登录的用户名
dashboard_user = admin
#仪表板页面登录的密码
dashboard_pwd = admin
```
Copied! 
1  
2  
3  
4  
5  
6  
7  
8  
9 
2.   客户端配置

```
[common]
server_addr = 云服务器公网ip
server_port = 7000
```
Copied! 
1  
2  
3 
3.   配置7500端口的访问安全组

![内网穿透教程配图](../images/network-piercing-frp-guide/031.png)

4.   打开网页浏览frp仪表盘，在浏览器访问：http://服务器公网ip:7500端口，输入用户名和密码进行登录

![内网穿透教程配图](../images/network-piercing-frp-guide/032.png)

### TCP穿透

1.   服务端配置

```
[common]
bind_port = 7000
```
Copied! 
1  
2 
2.   客户端配置

```
[common]
server_addr = 云服务器的ip
server_port = 7000

# 加入以下配置
[ssh22]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
# 上述配置表示需要将云服务器的6000端口开放给客户端访问
```
Copied! 
1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11 
3.   ssh连接

```
$ ssh 127.0.0.1 -l root -p 6000
```
Copied! 
1 

### WEB穿透

1.   服务端配置

```
[common]
bind_addr = 0.0.0.0
bind_port = 7000
privilege_token = tokenABC
vhost_http_port = 80		#HTTP主机使用的端口，我这里80端口被Nginx占用了
vhost_https_port = 443		#HTTPS主机使用的端口
```
Copied! 
1  
2  
3  
4  
5  
6 
vhost_http_port = 80 和 vhost_https_port = 443 为将服务器的80端口做http，443端口做https，原理就像nginx一样，可以多个网站使用这两个端口。

`vhost_http_port`和`vhost_https_port`一般使用80和443，但这2个端口很容易被nginx占用，我这里就是被Nginx占用了，换成了808,，或者利用nginx的反向代理实现frp服务端与nginx共用80端口

2.   客户端配置

```
[common]
server_addr = 云服务器的ip
server_port = 7000
privilege_token = tokenABC

[webtest]
type = http
local_ip = 127.0.0.1
local_port = 80
custom_domains = webtest.it235.com
```
Copied! 
1  
2  
3  
4  
5  
6  
7  
8  
9  
10 
3.   阿里云需要开放`7000`端口给客户端访问

4.   服务端的80端口不能被占用，占用后如果想去除端口必须配合Nginx使用，由Nginx反向代理到808端口

5.   本地需要使用Nginx进行域名接收反向代理

```
server {
        listen  80;
        server_name webtest.it235.com;

        location / {
            proxy_pass http://127.0.0.1:9080/;
        }
    }
```
Copied! 
1  
2  
3  
4  
5  
6  
7  
8 

### MySQL穿透

1.   服务端配置

```
[common]
bind_port = 7000
```
Copied! 
1  
2 
2.   客户端配置

```
[common]
server_addr = 云服务器的ip
server_port = 7000

[mysql_test]
type = tcp
local_ip = 127.0.0.1
local_port = 3306
remote_port = 3366
```
Copied! 
1  
2  
3  
4  
5  
6  
7  
8  
9 
3.   外网连接MySQL时可以使用云服务器ip+3366端口进行连接

2021-04-07: 8/13/2020, 11:57:28 PM

---
title: 使用 Graphviz 和 PlantUML 画图 · Bit●Cat
---

-----

### 安装

PlantUML 是一个开源项目，相比于 Graphviz，它拥有更丰富的绘图功能，而且可以兼容 dot 语法，可以说 Graphviz 是 PlantUML 的一个子集。 且它的绝大部分文档都已经翻译成中文，[官方文档](https://plantuml.com/zh/)示例丰富，上手更加容易。

PlantUML 并不是一个可执行程序，它是一个 jar 包，需要依赖 **JRE** (java 运行时环境)。因此它需要使用命令行进行绘图。 同样，它支持命令行参数，例如：指定图片输出格式、输出目录等。下面的命令将会绘制一张 SVG 格式的图片：

```
java -jar plantuml.jar file1 -TSvg -charset UTF-8


```

更多的命令行参数可以参考官方的文档 -[Use command line](https://plantuml.com/zh/command-line)。

> 如果想使用 PlantUML 来绘制 dot，需要先安装 Graphviz。

### 使用

官方提供了很多[使用方式](https://plantuml.com/zh/running)，大致可以概况为以下两种方式：**命令行** 和 **web server**

我使用的编辑器是 Sublime Text3 3，可以安装插件 [**PlantUmlDiagrams**](https://github.com/evandrocoan/PlantUmlDiagrams)， 具体的安装和使用，这里就不在赘述。该插件既可以支持命令行的方式，也可以支持 server 的方式（优先支持，**推荐**）。 但是有个小缺点，它不能像上面的 Graphvizer 插件那样，能实时渲染，但是可以配置快捷键，使用起来也还算方便。

至于为什么会推荐 plantuml server? 主要有两个方面的原因：

1.  server 方式渲染的会更快，且可以团队多人使用。
2.  最新版本的 plantuml.jar(`version 1.2020.06`) 与 graphviz 2.38 存在一些问题，在渲染带有中文的 dot 时会失败， 即使 dot 代码中设置了 _fontname_ 属性也无法正确绘图。该问题可以参考此 [issue](https://forum.plantuml.net/8720/how-to-use-japanese-font-in-dot)。

关于 PlantUml server 的搭建，官方也有对应的 [repo](https://github.com/plantuml/plantuml-server)。 根据文档，我在 WSL(Ubuntu 18.04) 系统下成功搭建了本地的 PlantUML Server，步骤也非常简单， 相关依赖安装可以参考[这篇教程](https://www.linux265.com/news/3465.html)。

```
# 先安装依赖
sudo apt-get install default-jre
sudo apt install maven

# 克隆并运行（默认端口 8080）
git clone https://github.com/plantuml/plantuml-server.git
cd plantuml-server
mvn jetty:run


```

第一次运行的时候，maven 需要下载必要的组件，可能耗时较长，耐心等待即可（_搭梯子速度更快_）。 如果搭建成功，后期可以以后台模式来启动 PlantUml Server，具体操作如下：

```
nohup mvn jetty:run > plantuml.log &
pgrep -laf maven


```

下图是通过 PlantUml Server 绘制的 skynet 服务器框架底层结构体关系图。 ![](https://bitcat.love/assets/image/posts/2020-04-18-02.svg?style=centerme)

总结
--

经过一段时间的摸索后，对 Graphviz 和 PlantUML 掌握也渐入佳境，我也越来越喜欢这种代码绘图的方式， 它解放了我很多的鼠标操作。因为 PlantUML 已经包含了 Graphviz 的功能，所以一套 PlantUML Server 已经基本满足我的绘图需求。
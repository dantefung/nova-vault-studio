---
title: 使用 Graphviz 和 PlantUML 画图
--

### 安装

Graphviz 的安装比较简单，去官网[下载页面](https://graphviz.gitlab.io/download/)，找到对应的操作系统。 我本机的操作系统的是 Win10，目前官网提供的 Windows 版本是 `dot - graphviz version 2.38.0 (20140413.2041)`。

下载安装之后，需要把 bin 目录添加到环境变量中，下面是我的路径：

`D:\Program Files\Graphviz2.38\bin`

此时在命令行输入 `dot -V`，如果能显示版本信息，说明已经安装成功；如果提示命令不存在，可能需要重启电脑， 让环境变量设置生效（当然要确保环境变量设置是正确的）。

> 为什么要重启？因为有些时候添加了新的环境变量，在命令行内（非管理员权限）这个环境变量可能不会立即生效。 具体原因还不清楚，但是重启大法能够解决。

### 使用

现在，我们尝试用 Graphviz 来绘图，看看它的绘图效果是如何的。可以使用 Graphviz 自带的界面工具来绘图，也可以直接用命令行来生成图片。

首先从最简单、最直接的界面工具来体验一下。在安装目录的 bin 文件夹（也就是上面提到的环境变量路径）中，找到 `gvedit.exe` 并打开它。 我们可以用一个官方文档的哈希表例子（可参考本人翻译的[帮助文档](https://bitcat.love/_posts/2020-03-06-drawing-graphs-with-dot/)）。

哈希表的绘图代码如下：

```
digraph G {
	splines=polyline;
	nodesep=.05;
	rankdir=LR;
	node [shape=record,width=.1,height=.1];

	node0 [label = "<f0> |<f1> |<f2> |<f3> |<f4> |<f5> |<f6> | ",height=2.5];
	node [width = 1.5];
	node1 [label = "{<n> n14 | 719 |<p> }"];
	node2 [label = "{<n> a1 | 805 |<p> }"];
	node3 [label = "{<n> i9 | 718 |<p> }"];
	node4 [label = "{<n> e5 | 989 |<p> }"];
	node5 [label = "{<n> t20 | 959 |<p> }"] ;
	node6 [label = "{<n> o15 | 794 |<p> }"] ;
	node7 [label = "{<n> s19 | 659 |<p> }"] ;

	node0:f0 -> node1:n;
	node0:f1 -> node2:n;
	node0:f2 -> node3:n;
	node0:f5 -> node4:n;
	node0:f6 -> node5:n;
	node2:p -> node6:n;
	node4:p -> node7:n;
}


```

输入绘图代码后，按 `F5` 即可渲染图片。效果如下：

![](https://bitcat.love/assets/image/posts/2020-04-18-01.png?style=centerme)

我们也可以使用命令行的方式来生成图片，且灵活性更高，通过控制参数来生成想要的图片。 例如：指定图片格式、绘图引擎（默认是 dot）、自定义输出的文件名等。下面命令可以生成 SVG 格式的绘图。

```
dot -Tsvg hashtable.gv -o hashtable.svg


```

> 关于图片的输出格式，我推荐使用 svg 来输出图片，它是可缩放的矢量图，文件小且清晰度也是最好的。

### 实时渲染

不论是使用 GVEdit 还是使用命令行，都需要手动执行操作才能输出图片，那有没有一种方式，能在修改绘图代码后， 实时更新渲染图片？

答案是：`Sublime Text 3` + 插件`Graphvizer`。该插件不仅可以实时渲染图片，还能检查绘图代码的语法错误。 插件快捷键如下：

*   `ctrl+shift+g`，渲染绘图
*   `ctrl+shift+x`，打开输出信息面板

### 问题

*   问题 1：中文乱码问题
    
    出现该问题，主要是字体的问题，需要电脑上安装支持中文的字体，且在绘图代码中指定 _fontname_ 属性。 在 Windows 系统上，可以使用系统自带的微软雅黑字体。例如：
    
    ```
    digraph G {
      graph [font];
      node [font];
      edge [font];
      a[label="你好"];
      b[label="世界"];
      a -> b;
      label="中文";
    }
    
    
    ```
    
    该问题同样会出现在 Linux 系统上，例如在我本机的 WSL(Ubuntu 18.04) 子系统上，生成出的 png 图片同样会中文乱码。 同样可以通过安装字体可以解决，参考[该方法](https://www.cnblogs.com/Dylansuns/p/7648002.html)，亲测可行。
    
*   问题 2：无法渲染长 label 的 record 节点
    
    在 record 类型的节点中，如果 label 的分隔过多，会存在无法渲染的问题（版本为 `2.38.0`）。例如：
    
    ```
    digraph G {
      rankdir = LR;
    
      node [font];
      context [
          shape=record,
          label="<f0> struct skynet_context \{ |
              void * instance; |
              <mod> struct skynet_module * mod; |
              void * cb_ud; |
              skynet_cb cb; |
              <queue> struct message_queue *queue; |
              FILE * logfile; |
              uint64_t cpu_cost;	// in microsec |
              uint64_t cpu_start;	// in microsec |
              char result[32]; |
              uint32_t handle; |
              int session_id; |
              int ref; |
              int message_count; |
              bool init; |
              bool endless; |
              bool profile; |
              CHECKCALLING_DECL |
              \};
          "
      ];
    }
    
    
    ```
    
    猜测应该是 Graphviz 版本的问题，在高版本（`2.40.1 (20161225.0304)`）上就不存在这个问题。 但是 Windows 系统上的安装包已经停止更新支持了，原因[在这里](https://gitlab.com/graphviz/graphviz/issues/1362)。
    

PlantUML
--------

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
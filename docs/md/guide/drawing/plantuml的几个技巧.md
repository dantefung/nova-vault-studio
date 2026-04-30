---
title: PlantUML 的几个技巧
---

&#x2D;&#x2D;&#x2D;
title: PlantUML 的几个技巧
-
title: Reference


> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/wwwjr00/article/details/130415751)

### 1、画框图

1.1 可以使用 rectangle，component 等来画框图，例:

```
@startuml
skinparam componentStyle rectangle
 
[发现问题] as fx
[提出问题] as tc
[分析问题] as fenx
[归纳问题] as gl
 
fx-tc
tc-->fenx
fenx-gl
 
@enduml
```

效果如下：

![](https://img-blog.csdnimg.cn/a64fd97c176847ad9bc61c22ed6c57ae.png)

 1.2 也可以使用 card 来画框图。例：

```
@startuml
 
card 发现问题 as fx
card 提出问题 as tc
card 分析问题 as fenx
card 归纳问题 as gl
fx->tc
tc->fenx
fenx->gl
 
@enduml
```

效果：

![](https://img-blog.csdnimg.cn/215f3ab91e024b78a71997ab7fb8f734.png)

### 2、控制方向

2.1  默认采用两个破折号 `--` 显示出垂直 方向的线. 要得到水平方向使用单破折号，也可通过在箭头内部使用关键字， 例如`left`, `right`, `up` 或者 `down`，来改变方向。例：

```
@startuml
' 水平方向
skinparam componentStyle rectangle
[发现问题] as fx
[提出问题] as tc
[分析问题] as fenx
[归纳问题] as gl
fx-tc
tc->fenx
fenx-gl
@enduml
@startuml
' 垂直方向
skinparam componentStyle rectangle
 
[发现问题] as fx
[提出问题] as tc
[分析问题] as fenx
[归纳问题] as gl
 
fx--tc
tc-->fenx
fenx--gl
 
@enduml
```

效果如图：

![](https://img-blog.csdnimg.cn/ba54c3b7423f48c5bb10aed088acfa34.png)

 ![](https://img-blog.csdnimg.cn/2579a8caded144c78fb7a90fcd7f815c.png)

 2.2 使用`left`, `right`, `up` 或者 `down`，来改变方向。例：

```
@startuml
skinparam componentStyle rectangle
 
[发现问题] as fx
[提出问题] as tc
[分析问题] as fenx
[归纳问题] as gl
 
fx-r-tc
tc-d->fenx
fenx-l-gl
 
@enduml
```

效果：

![](https://img-blog.csdnimg.cn/de72976ea6634e9d92f7128dbeaac316.png)

2.3 通过 left  to right dirction 来改变方向。例：

```
@startuml
skinparam componentStyle rectangle
left to right direction
 
[发现问题] as fx
[提出问题] as tc
[分析问题] as fenx
[归纳问题] as gl
 
fx--tc
tc-->fenx
fenx--gl
 
@enduml
```

 效果：

![](https://img-blog.csdnimg.cn/75916d6df6554424b6a7375a9f23ef17.png)

###  3、设置直线

为了只绘制水平或垂直直线，您可以使用`skinparam linetype ortho`.

为了使所有线条笔直（但不一定是水平或垂直的），您可以使用`skinparam linetype polyline`.

### 4、辅助布局

[类图的语法和功能 PlantUML 类图的语法：您可以定义接口，成员关系，包，泛型，注释... 改变字体和颜色也有可能![](https://plantuml.com/favicon.ico) https://plantuml.com/zh-dark/class-diagram#c08f8d9927fcb626](https://plantuml.com/zh-dark/class-diagram#c08f8d9927fcb626 "类图的语法和功能") 有时候，默认布局并不完美...

你可以使用 `together` 关键词将某些类进行分组： 布局引擎会尝试将它们捆绑在一起（如同在一个包 (package) 内)，你也可以使用建立 `hidden` 链接的方式来强制布局。例：

```
@startuml
    class Bar1
    class Bar2
    together {
        class Together1
        class Together2
        class Together3
}
 
Together1 - Together2
Together2 - Together3
Together2 -[hidden]--> Bar1
Bar1 -[hidden]> Bar2
 
@enduml
```

 效果：

![](https://img-blog.csdnimg.cn/686fcadf332a4dc6b72785057780a54e.png)

# Reference
[plantuml 颜色](https://plantuml.com/zh/color)
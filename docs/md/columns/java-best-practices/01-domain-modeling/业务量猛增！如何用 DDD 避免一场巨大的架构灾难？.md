---
title: "业务量猛增！如何用 DDD 避免一场巨大的架构灾难？"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s?__biz=MzkzMjYzNjkzNw==&mid=2247630702&idx=1&sn=ed567e2b4224310473ff0dff882ca72a&chksm=c31e6fdc6a74bf3ea63b0e1fe0a5d8487fb5fb680becb69c5041c53b69d49c0931807213f05b&mpshare=1&scene=1&srcid=0410wBmqSgAaLl5KnrXQKJpM&sharer_shareinfo=3415a92a1ce628456b383d40ca12cbab&sharer_shareinfo_first=3415a92a1ce628456b383d40ca12cbab#rd)

**前言**

在快速发展的互联网行业中，企业的业务需求和技术架构之间的关系愈发紧密。如何在复杂多变的业务环境中保持系统的稳定性、灵活性与可扩展性，一直都是技术团队面临的重要挑战。

  

本篇文章将深入探讨货拉拉用户 CRM 系统在架构设计和编码实践中对 DDD（领域驱动设计）的应用，为读者分享 DDD 在实际应用中的架构模式、实施过程中的关键技术要点。同时，也会详细介绍我们的用户 CRM 系统的实施改造过程，为技术团队提供可参考的实践经验。

  

希望通过这篇文章，能够帮助同行们更好地理解 DDD 战术设计在复杂业务系统中的应用，并为未来的技术创新与业务发展提供借鉴与启发。

  

注：由于篇幅有限，本文以实践为主，DDD 相关基础概念请读者自行查阅资料了解。

**一、DDD 是什么**

  

![][img-0]

  

在开始之前，我们还是先简单聊一下 DDD（Domain-Driven Design 领域驱动设计），本文假设读者对 DDD 已经有一些了解，不会对 DDD 的一些基础概念做过多的解释和说明，读者也可以直接跳过本节内容。

  

谈到 DDD，我们都会不由自主的把它跟大型复杂系统挂钩，晦涩的概念、实践方式参差不齐，这些因素都使得我们对其敬而远之。其实，DDD 作为一种软件设计思想一直存在在软件的生命周期中，它无关系统的大小。比如像上下文拆分、实体、值对象、资源库这些概念，并不只是存在大型系统中，而是作为软件模型的本质存在所有的系统中。

  

DDD 为我们提供了两种设计：战略设计和战术设计。战略设计作为一种思想和规范，去指导业务领域划分，偏向整体业务模型设计；而战术设计偏向编码与技术架构实现，战术设计把技术模型从业务模型中抽离出来，使代码 == 业务本身，所以说战术设计与技术编码是息息相关的。

  

我们知道，业务问题是所有产品开发的基础，在 DDD 中，我们可以把业务到技术实现的过程分为两个空间：问题空间和解决方案空间：

  

![][img-1]

  

*   我们把领域拆分为多个子域，并通过上下文映射图提取出实体的限界上下文，这一过程就是 DDD 的战略设计；
    
      
    
*   而把问题空间的领域、子域概念通过解决方案空间的描述语言实现软件模型，这就是 DDD 的战术设计。
    

  

本篇实践主要针对战术设计，不会过多的介绍战略设计。

  

**1、DDD 能为我们带来什么**

  

**清晰的模型边界：**DDD 不是创建模型，而是模仿并实现现实世界的业务模型，模型边界清晰了，软件可维护性和可扩展性也就随之增加了

  

**更好的企业架构：**根据康威定律，软件架构对应企业组织架构，领域划分的越合理，企业架构就越清晰，可以帮助企业建立更高效的组织架构

  

**敏捷、迭代式和持续建模：**DDD 遵循敏捷工作方法，可以降低持续迭代对软件可维护性的冲击

  

究其根底，DDD 带来的是从业务模型到软件模型的转换，让固有的软件模型更加贴近复杂多变的业务，降低软件后期的维护成本，使软件变更更加灵活。

**二、架构演进 - 六边形架构**

  

一个软件架构的优劣，可以用它满足用户需求所需要的成本来衡量。如果该成本很低，并且在系统的整个生命周期内一直都能维持这样的低成本，那么这个系统的设计就是优良的。如果该系统的每次发布都会提升下一次变更的成本，那么这个设计就是不好的。

——架构整洁之道

  

 就像《架构整洁之道》一书所说，如果一个系统的每次发布都会提升下一次变更的成本，那么这个设计就是不好的。那么 DDD 战术设计推崇的架构模式是如何控制变更成本的呢？

  

我们知道，架构与底层工具应该是完全独立的，一个良好的架构应该围绕业务来展开，这样的架构设计可以在脱离架构、工具及使用环境的情况下完整的描述业务用例。并且，架构应该在满足业务需要的前提下，尽可能地允许用户能自由的选择工具。

  

此外，良好的架构设计应该尽可能地允许用户推迟和延后决定使用什么框架、数据库、web 服务以及其它与环境相关的工具（例如 spring、hibernate、mybatis、数据存储、消息组件等）。同时，良好的架构还应该让我们能很容易的改变这些决定。总之，良好的架构应该只关注业务用例本身，并能将它们与其它周边因素隔离开来。

  

下面笔者将带大家一起看一下 DDD 架构的演进过程。

  

**1、分层架构**

  

![][img-2]

  

在最初设计时，多数分层架构为了层级职责清晰，会比较偏向严格分层架构。但是经过多次的转手和迭代后，严格分层架构会逐步演变成松散分层架构，各层职责越来越不清晰。比如可能为了方便，直接在 controller 里直接通过 dao 访问数据库；service 的职责也越来越混乱，里面可能混杂了基础设施的远程调用、资源库获取等等不属于它的职责。长此以往，对系统的可维护性带来巨大的挑战，成员之间互相接手时需要花费大量的时间才能真正上手，随时都会有踩雷的风险，无法做到研发资源的最大化利用。

  

**2、DDD 架构模型**

  

![][img-3]

  

为了把业务逻辑和技术实现分离开来，DDD 分层架构独立出了一个领域层，用于业务逻辑的聚合。并且应用依赖倒置，使整个框架更加容易扩展，做到技术细节与业务逻辑的完全解耦。

  

在实际应用中，很少会有完全的依赖倒置，而是下面这种架构模型：

  

![][img-4]

  

我们只对更偏向技术细节的层级（基础设施层）进行依赖倒置，用户接口层和应用服务层一般都比较简单，所以他们还是上下级的关系。

  

在应用了部分依赖倒置之后，实际上分层的概念就比较模糊了，我们会看到领域层被用户接口层和基础设施层包裹在整个架构的最内层，这个时候我们的架构模型就变成了下面这种模型：六边形架构模型（也叫整洁架构，或洋葱圈架构）

  

**3、六边形架构**

  

![][img-5]

温馨提示：这是一张动图哦

  

通过上面对架构演进的介绍，可以看到六边形架构并不是一种新颖的架构模型，而是从另外一种角度看待分层模型，它应用依赖倒置原则把分层架构推平，然后往里面加入了一些对称性。六边形架构是一种具有持久生命力的架构模型，当有新的客户端接入时，只需要添加一个入站适配器和对应的出站适配器，然后入站适配器把客户输入转换成 API 所理解的参数，输入和输出都可以通过多样化的方式来实现。

  

并且，六边形架构符合整洁架构的依赖关系原则：外层的变更不会影响到内层的代码。比如上图，我们把外层的基础设施由数据库换成其他组件时，对我们内部的业务逻辑是没有任何影响的

**三、编码实战**

  

**1、架构及模块划分**

  

![][img-6]

  

**1）模块介绍**

  

本次编码实战，我们使用的架构完全是对应了刚才介绍的六边形架构，主要包括以下模块：

  

**starter：**启动器 / 用户界面层；如：controller、provider、task、consumer

  

我们这里的做法是把 starter 启动器和用户界面层整合到一起。其它做法：单独一层只放 springboot 的启动器和加载相关组件，但需要独立出一层用户界面层（因为 starter 和用户界面层比较轻，所以可以整合为一层）

  

**application：**应用服务层，对应传统分层架构的 service 层，但更加轻量；应用服务层只用来编排业务逻辑，不做复杂业务的实现细节；

  

注意：application 中的 service 绝对不允许平级调用，只允许调用 domain 层中的聚合、领域服务、资源库（如果出现平级调用的情况，就应该考虑把调用逻辑放在领域层中用于多业务复用）

  

**domain：**领域层，从传统分层架构 service 层中抽取的一层，用于存放领域模型和领域服务，通过领域模型和领域服务聚合所有业务逻辑；在领域层中，只能输入和输出领域模型，再由其他上层根据需要转为需要的模型结构

  

domain 中的 service，除通用子域外，不允许平级调用

  

**infra-repository：**基础设施层 - 资源库，对应传统分层架构中的 dao，但职责范围更广，只要是与资源、持久化数据（mysql、redis、ES 等数据存储组件）相关都可以放在这里

  

**infra-remote：**基础设施层 - 外部服务；其他限界上下文的远程调用

  

**shared：**公共组件，如：基础常量、工具类、cache、interceptor、configuration 等相关配置组件

  

**2）与传统三层架构的对比**

  

**关键改进项：**业务编排、依赖倒置、可插拔组件

  

**业务编排：**相对于传统三层架构，DDD 架构模型把业务逻辑层拆分为应用服务层 + 领域层，应用服务层只做业务编排，具体的业务聚合逻辑交给领域层来实现。

  

**优势：**解耦业务编排和业务实现，使业务逻辑更加清晰，任何人都可以花费极短的时间了解业务逻辑，并安全的对代码进行扩展和优化。

  

**依赖倒置：**应用依赖倒置后，领域层称为整个架构的最内层（注意不是最底层），它不依赖任何外部组件，它只关心当前上下文相关的领域模型

  

**优势：**真正面向对象，以业务为核心，符合稳定依赖原则

  

**可插拔组件：**领域层不需要关心基础设施使用的技术组件，它只定义基础设施接口，输入和输出都是领域模型，并应用依赖倒置，让具体细节由各个基础设施通过插件的方式去实现；

  

**优势：**在更改底层技术组件时（例如 mysql 换 RPC、数据增加缓存等等），领域模型的业务逻辑不需要做任何改变或以最小的改动就可以满足技术层面的优化升级

  

**3）设计原则**

  

整体架构遵循了组件设计基本原则：

  

领域模型的聚合逻辑完全独立于其他各层，遵循**共同闭包原则**

业务逻辑聚合在领域模型和领域服务中，遵循**共同复用原则**

基础设施组件可插拔，易扩展和修改，遵循**稳定依赖原则**

基础设施层应用依赖倒置，由技术实现细节去依赖领域层定义的业务抽象，遵循**稳定抽象和无依赖环原则**

  

  

**2、商城订单业务编码实战**

  

无论在什么领域，订单业务都是一个比较复杂且典型的场景，考虑到本文的读者可能来自不同的行业，为了便于大家理解，这里我们选择了商城订单业务中的用户下单场景来演示 DDD 的编码实践。以此来为读者逐步展开讲述 DDD 战术设计中的实践形式。

  

**1）限界上下文拆分**

  

在 DDD 战术设计前期，我们首先要做的就是限界上下文的拆分。本例中我们选了三个限界上下文：订单上下文、商品上下文和调度上下文，每个上下文可能都对应一个业务系统，他们之间通过远程调用的方式进行交互（实际业务场景会更复杂，可能还会有权益、库存、营销、物流等上下文）

  

![][img-7]

  

**编码原则：**业务模型决定数据模型

  

**实践：**与传统设计不同，基于 DDD 战术设计的编码需要自上而下，先设计业务领域模型，再通过领域模型的业务行为去识别和设计最终的数据模型。这种设计是真正面向业务的，而不是把关注点放在技术性的数据模型上。

  

注：这样做并不是必须的，但从实践上来看，自上而下比自下而上的设计方式更容易编排业务逻辑

  

**画外音：聚合和聚合根**

  

![][img-8]

  

在实践 DDD 过程中，聚合和聚合根的概念一直都是比较难以理解和设计的，这里为这两个概念做一个通俗的解释：

  

**聚合**是由一系列相关的领域模型组合而成，例如订单域：Order(订单) + OrderItem(订单项) + DeliveryInfo(配送地址) 可以组成一个聚合，从**订单上下文的角度**来说这个聚合逻辑的**聚合根**就是 Order。

  

**2）模块及分包**

  

![][img-9]

  

**①用户界面层**

  

```
ddd-demo/
├── ddd-order-demo-api ------ 用户界面层-REST
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── cn
│   │       │       └── huolala
│   │       │           └── demo
│   │       │               ├── DemoApiApplication.java ------ starter
│   │       │               └── api
│   │       │                   └── controller ------ 客户端接口
│   │       │                       ├── UserController.java
│   │       │                       └── OrderController.java
│   │       └── resources
│   │           └── application.yml
```

  

**模块举例：**controller、provider、task、mq-consumer

  

**模块分析：**

  

用户界面层是客户端的统一入口，它只用于处理用户展示和用户请求，不会包含业务逻辑。但是，用户界面层也有它自己的逻辑，例如对用户的输入参数进行验证，但这种验证要跟领域层的验证逻辑区分开。比如对必传参数的空值校验，对数值类型参数的类型校验，这些都是用户界面层的职责；但如果要验证某个参数对应的业务数据是否存在，这种验证就应该是领域或业务逻辑的验证。在 DDD 编程模型中，这两种职责要区分开。

  

用户界面层的请求和响应参数不在此层中定义，而是定义到了应用服务层，这样做的好处就是少了一次参数模型转换，应用服务层可以直接使用用户界面层的请求和响应参数（不建议把用户界面层的请求和响应模型定义到公共包中 (如 common 包)，因为这样做可能造成后期模型的滥用），弊端就是会在一定程度上破坏代码的封装性。

  

用户界面层的响应实体要在此层中定义并转换，因为为了兼容多个用户界面层，应用服务层只会返回跟业务相关的领域模型，每个用户界面层对应的客户所需要的响应体可能是不同的，这时候每个用户界面层就需要把领域模型转换为不同客户方所需要的模型。（转换器最好也定义到应用服务层，如果定义到用户界面层，当不同客户端需要同一个参数时，在各个客户端对应用户界面层都需要定义相同的转换器）

  

**②应用服务****层**

  

```
ddd-demo/
├── ddd-order-demo-application ------ 应用服务层，主要做业务编排，协调领域层做业务聚合
│   ├── src
│   │   └── main
│   │       └── java
│   │           └── cn
│   │               └── huolala
│   │                   └── demo
│   │                       └── application
│   │                           ├── convertor ------ 模型转换器
│   │                           │   ├── OrderConvertor.java
│   │                           │   └── UserConvertor.java
│   │                           ├── pojo
│   │                           │   ├── cmd ------ 用户界面层写请求参数
│   │                           │   │   ├── OrderChangeItemCmd.java
│   │                           │   │   ├── OrderCreateCmd.java
│   │                           │   │   └── co ------ cmd的子结构
│   │                           │   │       └── OrderCreateProductItemCO.java
│   │                           │   └── query ------ 用户界面层读请求参数
│   │                           │   │  ├── UserQuery.java
│   │                           │   │  └── qo ------ query的子结构
│   │                           │   └── response ------ 用户界面层的响应模型
│   │                           │       ├── OrderResponse.java
│   │                           │       └── UserResponse.java
│   │                           └── service ------ 应用服务层service，业务编排
│   │                               ├── OrderService.java
│   │                               └── UserService.java
```

  

**模块分析：**

  

为了减少模型转换带来的额外工作量，我们把用户界面层的请求和响应模型定义到了应用服务层（cn.huolala.demo.application.pojo），并把读写请求分离开，以便后期可以扩展 CQRS 架构模型。

  

在应用服务层，除了必要的参数模型外，就是我们传统三层架构所熟知的 service

  

应用服务层不同于传统的业务逻辑层，它是非常轻量的，应用服务本身不处理业务逻辑，它是领域模型的直接客户，主要职责是用来协调领域模型做业务编排，此外，应用服务层也是表达用例和用户故事的主要手段。

  

**③领域层**

```
ddd-demo/
├── ddd-order-demo-domain ------ 领域层，承载当前限界上下文的所有业务逻辑
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── cn
│   │   │   │       └── huolala
│   │   │   │           └── demo
│   │   │   │               └── domain
│   │   │   │                   ├── convertor
│   │   │   │                   ├── infra ------ 基础设施相关接口
│   │   │   │                   │   ├── mq ------ 基础设施-消息事件
│   │   │   │                   │   │   └── OrderMessageProducer.java
│   │   │   │                   │   ├── remote ------ 基础设施-远程调用
│   │   │   │                   │   │   ├── IProductRemoteService.java
│   │   │   │                   │   │   └── IScheduleRemoteService.java
│   │   │   │                   │   └── repository ------ 基础设施-资源库
│   │   │   │                   │       ├── IDeliveryAddressRepository.java
│   │   │   │                   │       ├── IOrderRepository.java
│   │   │   │                   │       └── IUserRepository.java
│   │   │   │                   ├── model ------ 领域模型
│   │   │   │                   │   ├── order ------ 子域-核心域
│   │   │   │                   │   │   ├── DeliveryInfo.java
│   │   │   │                   │   │   ├── LockInventoryResponse.java
│   │   │   │                   │   │   ├── Order.java ------ 实体
│   │   │   │                   │   │   ├── OrderDomainEvent.java
│   │   │   │                   │   │   ├── OrderEvent.java
│   │   │   │                   │   │   ├── OrderEventTypeEnum.java
│   │   │   │                   │   │   ├── OrderItem.java
│   │   │   │                   │   │   ├── OrderStateEnum.java
│   │   │   │                   │   ├── product ------ 子域
│   │   │   │                   │   │   └── Product.java
│   │   │   │                   │   └── user ------ 子域
│   │   │   │                   │       ├── User.java
│   │   │   │                   │       └── UserStateEnum.java
│   │   │   │                   └── service ------ 领域服务
│   │   │   │                       ├── OrderDomainService.java
│   │   │   │                       └── ProductDomainService.java
```

  

**模块分析：**

  

领域层是整个架构的核心业务层，它不依赖其他任何的外部组件，领域层的职责就是通过领域实体和领域服务来聚合业务逻辑；领域服务并不是必须的，如果业务逻辑都可以用领域实体来完成，这个时候就不需要领域服务；那领域服务主要是做那些事情的呢？

  

不属于单个聚合根的业务，需要用领域服务去协调多个聚合完成业务逻辑

  

静态方法（在实践中，也可以为静态方法单独定义工具类，例如静态的验证器 validator，静态的模型转换器 convertor）

  

调用其他外部服务（如 RPC）处理业务的，在拿到外部模型后，可能需要在领域服务中做业务校验或领域模型转换

  

cn.huolala.demo.domain.model 包中定义了当前限界上下文所需要的所有领域模型（包括了非当前上下文），这些模型在 DDD 中也称为实体，它们都是充血模型，业务的聚合都由它们 (cn.huolala.demo.domain.model.order.Order) + 领域服务 (如 cn.huolala.demo.domain.service.OrderDomainService) 来实现。

  

我们会在领域层中定义基础设施接口

  

（包 cn.huolala.demo.domain.infra)，以此来实现基础设施的依赖倒置。这里的做法是把基础设施做了进一步的拆分 (例如资源库 repository、远程服务调用 remote、消息事件 mq)；还有一种比较好的实践：不对基础设施做进一步的区分，把所有的基础设施都视为资源，只定义资源库接口，这样的好处是在修改技术组件时，业务逻辑层可以做到 0 改动。

  

注：还有另外一种分包方式，就是把跟领域模型相关的所有基础设施放到一个包中，好处是可以使业务模型更加稳定，弊端是会破坏组件的封装性。

  

**④基础设施层**

  

```
ddd-demo/
├── ddd-order-demo-infra-remote ------ 基础设施层-远程服务调用；访问外部限界上下文
│   ├── pom.xml
│   ├── src
│   │   └── main
│   │       └── java
│   │           └── cn
│   │               └── huolala
│   │                   └── demo
│   │                       └── remote
│   │                           ├── client ------ 外部服务接口定义(REST)
│   │                           │   ├── ProductApiClient.java
│   │                           │   ├── ScheduleApiClient.java
│   │                           │   ├── request ------ 外部服务调用请求参数
│   │                           │   │   ├── BaseRemoteRequest.java
│   │                           │   │   └── LockInventoryRequest.java
│   │                           │   └── response ------ 外部服务调用响应体
│   │                           │       ├── BaseRemoteResponse.java
│   │                           │       └── ResponseMessageEnum.java
│   │                           ├── convertor ------ 转换器，用于外部请求参数或响应体与领域模型的转换
│   │                           │   └── OrderConvertor.java
│   │                           ├── service ------ 防腐层，实现了领域层Remote接口，所有外部服务的调用入口
│   │                           │   ├── ProductRemoteService.java
│   │                           │   └── ScheduleRemoteService.java


├── ddd-order-demo-infra-repository ------ 基础设施层-资源库；数据模型与持久化相关
│   ├── pom.xml
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── cn
│   │       │       └── huolala
│   │       │           └── demo
│   │       │               ├── convertor ------ 转换器，用于数据模型和领域模型的转换
│   │       │               │   ├── DeliveryAddressConvertor.java
│   │       │               │   ├── OrderConvertor.java
│   │       │               │   ├── OrderItemConvertor.java
│   │       │               ├── entity ------ 数据模型
│   │       │               │   ├── DeliveryAddressEntity.java
│   │       │               │   ├── OrderEntity.java
│   │       │               │   ├── OrderItemEntity.java
│   │       │               └── repository ------ 资源库
│   │       │                   ├── DeliveryAddressRepository.java
│   │       │                   ├── OrderRepository.java
│   │       │                   ├── OrderRepositoryES.java
│   │       │                   └── mapper 
│   │       │                       ├── DeliveryAddressMapper.java
│   │       │                       ├── OrderItemMapper.java
│   │       │                       ├── OrderMapper.java
```

  

**模****块分析：**

  

不管是数据持久化、缓存、事件、RPC、REST，只要是与数据和资源有关的内容，都可以是基础设施的范畴。基础设施层隐藏了技术实现细节，使我们更加关注业务代码，减少了技术实现细节对业务代码的侵入性。

  

如果是倾向于架构模式清晰，可以为不同的资源获取方式定义不同的组件（本篇示例的做法）；如果更加倾向业务模型的稳定性，则可以为所有的基础设施只定义一个组件层级（也就是只有一个 infra 模块）。

  

举个例子：某项业务发展到一定规模后，需要对服务进行拆分，如果是传统分层架构模型，势必要在业务代码中修改或替换模型代码；如果我们使用了依赖倒置的六边形插件架构，我们就可以做到完全不修改业务代码：领域层定义的资源库接口不变，在基础设施层直接把原来数据库的实现改为远程调用的实现，业务代码 0 改动。之所以可以这么做，就是因为我们从架构层面限制了技术模型和业务模型的耦合关系，并对基础设施层应用了依赖倒置，领域层不会关心基础设施是由什么技术实现的，只需要给领域层所需要的领域模型就可以了。这正符合了整洁架构的依赖关系原则：外层的变更不应该影响内层的代码。

  

示例中把数据库资源和远程服务资源分为两个基础设施组件还有一个特殊的原因：数据库资源在当前上下文是可以随意操作的，也就是增删改查，而且数据模型之间也会有复杂的关联关系，这种关系需要在领域层映射成领域实体的业务关系，所以领域模型和数据模型本质上就是不同的（也就是**数据 - 对象的阻抗失调**，如果使用 JPA，则可以减小这种阻抗失调的影响）；但是对于外部上下文的资源，我们多数是读操作，而且外部上下文返回的数据模型不会轻易修改，所以我们也可以把外部上下文的数据模型直接当做领域模型来使用，这样也避免了额外的一次模型转换。

  

DDD 架构模型的分包规则符合**最大复用**和**最小闭包**原则，各层模型分包独立，互不影响。

  

例如：作为用户界面层，controller 和 provider 返回的模型可能会是不一致，所以我们把具体的返回模型包装在在各自的层级中，应用服务层只负责输出领域模型，由各个用户界面层决定把领域模型转换为各自返回给客户的模型。

  

**3）示例：用户下单场景**

  

**类调用链**

  

![][img-10]

  

**用户界面层 - OrderController**

  

```
@RestController
 @RequestMapping("/order")
public class OrderController {

    @Resource
    OrderService orderService;


    @PostMapping(name = "/create")
    public OrderResponse create(OrderCreateCmd cmd) {
        return OrderConvertor.convertToResponse(orderService.createOrder(cmd));
    }

 }
```

  

  

**代码解释：**用户界面层作为用户请求的入口，是没有任何业务相关逻的，它对参数进行基础的验证后（本例的参数校验通过参数注解的方式实现），把用户请求交给应用服务层去处理，然后接收应用服务层返回的领域模型，转换为用户需要的返回模型。

  

**应用服务层 - OrderService**

  

```
@Transactional(rollbackFor = Exception.class)
public Order createOrder(OrderCreateCmd cmd) {
    String orderNo = UUID.randomUUID().toString();
    //从资源库获取用户
    Optional<User> userOptional = userRepository.findById(cmd.getUserId());
    User user = userOptional.orElseThrow(() -> new DemoBusinessException("用户不存在"));

    //把参数转换为领域模型,可以定义convertor来进行转换
    List<OrderItem> orderItemList = makeOrderItems(cmd.getProductItems(), orderNo);
    //商品域-检查库存，product和OrderItem属于两个域,且使用了外部product服务,所以使用领域服务
    orderDomainService.checkInventoryAndAssembleOrderItems(orderItemList);

    //配送地址
    Optional<DeliveryAddress> deliveryInfoOptional = deliveryAddressRepository.findById(cmd.getDeliveryAddressId());
    DeliveryAddress deliveryAddress = deliveryInfoOptional.orElseThrow(() -> new DemoBusinessException("配送信息不存在"));

    //创建订单,最好的方式是使用工厂
    Order order = Order.create(orderNo, deliveryAddress, orderItemList, user.getUserId());
    //调度域-锁定库存,用到了远程服务,所以放到了领域服务
    orderDomainService.lockInventory(order);

    //创建订单
    orderRepository.createOrder(order);
    //发布订单创建事件
    orderMessageProducer.publish(order, OrderEventTypeEnum.INIT);
    //返回领域模型,由用户界面层决定转为什么样的模型, 从架构层面限制模型滥用和模型滥转
    return order;
}
```

  

**代码解释：**

  

应用服务层是很轻量的，它不做任何业务逻辑的处理，通过协调实体和资源库来达成业务结果，而具体的业务逻辑在聚合根中实现。

  

因为有跨多个子域的操作，order、product、OrderItem 等，且使用了外部服务（商品上下文和调度上下文），所以我们使用了 orderDomainService 领域服务

  

应用服务层统一返回的是领域对象，由用户接口层决定转为什么样的模型（因为用户界面层可能有多个，对应着不同的客户端，不同的客户端锁需要的数据模型可能不同），从架构层面限制模型滥用和模型滥转。

  

在上面代码逻辑中，对商品进行库存校验和锁定库存时都使用到了订单领域服务进行业务编排 (OrderDomainService.checkInventoryAndAssembleOrderItems 和 OrderDomainService.lockInventory)，具体实现如下：

  

**领域服务 - OrderDomainService：**

  

```
/**
 * 检查库存,组装订单项
 * @param orderItems
 * @return
 */
public void checkInventoryAndAssembleOrderItems(List<OrderItem> orderItems) {
    if (CollectionUtils.isEmpty(orderItems)) {
        throw new DemoBusinessException("未选择商品");
    }

    //从商品服务获取商品信息
    List<Long> productIds = orderItems.stream().map(OrderItem::getProductId).collect( Collectors.toList());
    List<Product> productList = productRemoteService.getProductInfos(productIds);
    if (CollectionUtils.isEmpty(productList)) {
        throw new DemoBusinessException("未查询到商品信息");
    }

    Map<Long, Product> productMap = productList.stream().collect(Collectors.toMap(Product::getProductId, p -> p));
    //库存校验
    for (OrderItem item : orderItems) {
        Product product = productMap.get(item.getProductId());
        if (product == null)
            throw new DemoBusinessException("商品[" + item.getProductName() + "]不存在");
        if (product.getInventoryCount() < item.getCount())
            throw new DemoBusinessException("商品[" + product.getProductName() + "]库存不足");

        //组装订单项信息
        item.setPrice(product.getPrice());
        item.setProductName(product.getProductName());
    }
}

/**
 * 锁定库存
 *
 * @param order
 */
public void lockInventory(Order order) {
    Optional<LockInventoryResponse> lockInventoryDTOOptional = scheduleRemoteService.lockInventory(order);
    LockInventoryResponse lockInventoryResponse = lockInventoryDTOOptional.orElseThrow(() -> new DemoBusinessException("库存锁定失败"));

    if (lockInventoryResponse.getLockEndTime().before(new Date())) {
        throw new DemoBusinessException("库存锁定失败");
    }
    order.setLockInventoryEndTime(lockInventoryResponse.getLockEndTime());
}
```

  

  

**代码解释：**因为这些逻辑都涉及了对两个域的操作（订单 - 商品、订单 - 调度） ，并且使用了远程服务调用，所以这里我们需要使用领域服务去协调聚合逻辑。

  

问：为什么检查库存的逻辑放到了订单领域服务，而不是商品领域服务？

  

一是因为这段逻辑属于是对订单的聚合逻辑，二是商品域属于另外一个限界上下文，我们一般**不会为非当前上下文的领域建立领域服务**（除非有很强的复用价值，例如通用子域）。

  

**聚合根 - Order：**

  

```
//……省略其他方法
/**
 * 创建订单
 * @param orderNo
 * @param deliveryAddress
 * @param orderItemList
 * @param userId
 * @return
 */
public static Order create(String orderNo, DeliveryAddress deliveryAddress, List<OrderItem> orderItemList, Long userId) {
    Order order = new Order();
    order.setOrderNo(orderNo);
    order.setDeliveryAddress(deliveryAddress);
    order.setOrderItemList(orderItemList);
    order.setUserId(userId);
    order.initialize();
    return order;
}
//订单状态初始化
public void initialize() {
    this.setStatus(OrderStateEnum.INIT.getValue());
    this.setOrderTime(new Date());
    calculateTotalPrice();
}

public void setTotalPrice(Long totalPrice) {
    if (Objects.isNull(totalPrice) || totalPrice < 0)
        throw new DemoBusinessException("Illegal totalPrice");
    this.totalPrice = totalPrice;
}

public void setOrderNo(String orderNo) {
    if (StringUtils.isBlank(orderNo))
        throw new DemoBusinessException("orderNo can not be null");
    this.orderNo = orderNo;
}
//……省略其他方法
```

  

**代码解释：**

  

在 3.2.1 一节中，我们讨论了聚合和聚合根的区别，聚合根也是 DDD 编程模型和传统编程模型之间的一个重要区别。在 DDD 中，模型不仅仅是数据的载体（即 “贫血模型”），而是具有行为的实体（即 “充血模型”）。通过聚合多个模型，聚合根能够实现复杂的业务逻辑，而不仅仅作为传输对象。（考虑到改造的复杂性，读者也可以选择不使使用充血模型，把业务逻辑交由领域服务来实现，也就是 “DDD-Lite”）

  

在传统的贫血模型中，我们习惯使用构造方法来完成对象的创建，但是构造方法不能有效的表达通用语言（new order 和 create order 的语义区别），所以我们这里使用聚合根来创建对象。其实复杂对象的创建最好是由工厂来实现，但是引入工厂的概念会带来额外的复杂性，为了简化框架，我们这里的做法是不再单独抽象工厂，而是**让聚合根去承担了工厂的职责。**这样做也是合理的，因为聚合根本身就承载了多个领域对象。

  

我们在给对象赋值时，把操作委派给对象自身对应的 setter 方法，这样的好处就是保证了对象的自封装性。使创建对象这一操作更加安全。自封装性使验证变的更加简单，一次编写，随处可用（但要注意对象传输时的序列化时的问题，如 setter 对 json 的序列化的影响，这里也体现了领域对象不适合做传输对象的原因）。

  

**基础设施（远程调用）-productRemoteService**

  

```
public class ProductRemoteService implements IProductRemoteService {

    @Resource
    ProductApiClient productApiClient;

    @Override
    public List<Product> getProductInfos(List<Long> productIds) {
        BaseRemoteResponse<List<Product>> response = productApiClient.getProductInfos(productIds);

        if (response == null || response.failed()) {
            log.error("getProductInfos error,request:{},response:{}", productIds, response);
            return Collections.emptyList();
        }

        return response.getData();
    }
 }
```

  

  

**代码解释：**本例中我们用的是 openfeign 来实现远程调用，我们把远程调用模块作为基础设施来实现，也是为了后期更好的扩展，比如我现在是 http 实现，后期要改 RPC，也可以不修改业务代码，只修改基础设施层，就可以完成优化和扩展。

  

**基础设施（资源库）- OrderRepository：**

  

```
@Repository
public class OrderRepository implements IOrderRepository {
    @Resource
    OrderMapper orderMapper;

    @Resource
    OrderItemMapper orderItemMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private ElasticsearchTemplate<OrderEntityES, Long> orderESTemplate;

    public Optional<Order> findById(long orderId) {
        return Optional.ofNullable(OrderConvertor.convertToDO(elasticsearchTemplate.getById(orderId,OrderEntity.class)));
    }

    /**
     * 创建订单
     * @param order
     */
    @Override
    public void createOrder(Order order) {
        //保存订单
        OrderEntity orderEntity = OrderConvertor.convertToEntity(order);
        orderMapper.insert(orderEntity);
        order.setOrderId(orderEntity.getId());
        //保存订单项
        List<OrderItem> orderItemList = order.getOrderItemList();
        orderItemList.forEach(orderItem -> {
            orderItem.setOrderId(orderEntity.getId());
            orderItemMapper.insert(OrderItemConvertor.INSTANCT.convertToEntity(orderItem));
        });
    }
 }
```

  

  

**代码解释：**

  

相对于传统的 dao 层，资源库的职责更广，在本例中，我们可以在资源库里操作任何的基础存储单元（数据库、redis、elastic search 等），这样做的好处就如咱们介绍六边形架构的时候说的一样：不管存储单元如何更换，都不会影响到核心的业务逻辑代码。

  

我们并没有为订单和订单项都单独创建一个资源库，因为我在创建订单的时候肯定也要同步去保存订单项的，所以我们只为订单这个聚合分配了一个资源库，这也是 DDD 推荐的标准做法，这样可以保证逻辑的内聚性，防止逻辑分散在领域层。如果我们使用 hibernate 的 **cascade（级联）注解的**话，这个内聚性会的体现更强。

  

模型转换问题：我们可以看到，资源库接收到的都是领域模型，输出的也是领域模型，这样的好处就是，我们对业务领域层完全隐藏了技术实现细节，不管你的表结构怎么变，存储组件怎么更换，都不会影响到领域层的业务逻辑，因为领域层压根就不关注数据模型 (OrderEntity)。从架构层面上来说，我们应用了依赖倒置，领域层也根本就不能使用基础设施层的数据模型 (OrderEntity)。

  

**4）小结**

  

在前文中，我们花了较长的篇幅，通过一个典型的业务场景——商城用户下单场景，为大家详细演示了 DDD 战术设计的架构、模块以及编码实践。通过这个具体示例，希望能够帮助读者更好地理解 DDD 在实际业务中的应用，并为后续内容的讲解打下基础。

  

接下来，笔者将分享我们在货拉拉 CRM 系统中进行 DDD 战术设计改造的实践经验，介绍我们是如何结合实际业务需求，将 DDD 的理念和方法落地实施。

**四、货拉拉用户 CRM 改造实践**

  

**1、 为什么要改造**

  

作为一名合格的软件开发者，我们的工作不能只是实现业务功能这么简单，我们要对我们的系统有一定的前瞻性，那么就必须考虑时间维度对我们软件系统可维护性所产生的影响。这种影响体现在四个方面：

  

*   **几个月后，你自己再次看到这段代码时，是否能够马上理解？**
    
*   **别人接手你的代码时是否容易看得懂？**
    
*   **在新增需求时，这段代码是否容易改，是否容易测试？**
    
*   **在其依赖发生变化时，这段代码能否快速的响应变化？响应变化的成本有多少？**
    

  

这些问题都是对我们软件可维护性和灵活性的一个考量，这些坏的影响并不容易马上被我们感知，可能是每天变差一点点。久而久之，我们的代码可能变成一堆屎山，可维护性及扩展性越来越差，变更成本越来越高，稳定性风险也越来越高。

  

货拉拉用户 CRM 作为货拉拉的用户拉新管理工具，随着业务的不断迭代与发展，系统的复杂性逐渐增加。为了应对这一挑战，确保系统能够灵活地应对复杂的业务变更，并降低稳定性风险，我们决定使用 DDD 战术设计进行改造。改造的目标有三个：

  

*   **可扩展性：**向六边形架构转变，提升系统的扩展性和灵活性
    
*   **稳定性：**通过业务编排，降低业务代码的复杂度，提升系统的可维护性，降低稳定性风险
    
*   **交付效率：**使业务代码更加易于理解，提高团队的协作效率，缩短开发周期，从而加快功能交付速度，满足业务快速发展的需求。
    

  

**2、改造方案**

  

![][img-11]

  

在业务无影响的前提下，**如何把传统分层架构重构为六边形架构**，是整个改造的关键点，我们在实施过程中对比了重构常用的两种改造模式：**绞杀者模式和修缮者模式**

  

**绞杀者模式：**新业务功能逻辑走新的模块实现，旧版代码跟迭代持续改造到新版架构模型中，最终剥离旧版代码。

  

![][img-12]

  

**优势：**

*   不影响已有业务逻辑
    
*   重构风险较小
    

  

**劣势：**

*   重构期间模型混乱
    
*   依赖功能迭代，时间跨度长
    
      
    

**修缮者模式：**

*   从层级中提取出 domain 抽象，已有代码逻辑逐步由细节调用改为抽象调用；
    
*   应用依赖倒置反转层级结构。
    

  

![][img-13]

温馨提示：这是一张动图哦

  

**优势****：**

*   重构期间架构模型变动平滑
    
*   开发人员容易接受
    
*   重构风险较小
    

  

**劣势：**

*   时间跨度较大
    

  

相对绞杀者模式来说，修缮者模式稳定性风险较小，通过在需求迭代中进行合理的任务分配，我们也可以减少这种时间上的改造成本，**修缮者模式**也是我们最终选择的重构方式。主要分为两步去完成：

  

第一步：抽象出 domain 层，应用服务层与 domain 层职责分离，并定义基础设施接口

  

第二步：基础设施层实现 domain 层定义的接口，通过依赖倒置反转层级关系

  

在总体的实施上，我们一共分了四个阶段：

  

**改造实践 - 阶段一：数据操作层依赖倒置**

  

![][img-14]

  

阶段一的改造目标只有一个：应用依赖倒置让数据操作层反向依赖业务层，让数据操作层变为基础设施。

  

**具体做法：**

  

*   抽象空的 domain 层
    
*   domain 中定义 IxxxRepository 接口
    
*   DAO 实现相应的 Repository 接口， 并应用依赖倒置反转层级关系
    
*   service 中引用 DAO 的地方改为 IRepository 接口
    

  

**改造实践 - 阶段二：领域层改造**

  

**具体做****法：**service 层只做业务编排，业务逻辑转入 domain 中。阶段二主要是把已有的复杂的业务逻辑**做业务编排**，使逻辑更加清晰，耦合性更低。

  

阶段二是整个改造过程中耗时最长，且是最关键的阶段，DDD 的改造是否成功，业务逻辑编排是否合理，很大程度上是由这个阶段来决定的。在实践上我们可以分多个迭代版本进行（每次只改动一个相关的复杂业务方法）。

  

上文我们多次提到了**业务编排**，那到底什么是业务编排呢？这里先为大家贴上一段我们 CRM 中相对复杂的一段代码，这段代码是 CRM 系统中新增拜访的逻辑代码（由于篇幅原因，会省略一部分逻辑代码）：

  

**改造前：**

  

```
public MerchantBasicResponse createVisit(CreateVisitRequest request) {
    EmployeeInfo info = EmployeeUtils.get();
    //……省略部分代码
    // 商户验证，存在才能新增拜访
    MerchantEntity merchant = merchantBaseValidator.checkMerchantExist(request.getMerchantId());

    // 只能拜访本人的商户
    if (!Objects.equals(info.getHllerId(), merchant.getOwnerId())) {
        log.warn("owner not current user, merchant: {}", merchant);
        throw new ForceException(ErrorCodeEnum.OWNER_NOT_YOU);
    }

    //拜访定位异常判定
    if (Objects.nonNull(merchant.getLongitude()) && Objects.nonNull(merchant.getLatitude())) {
        double distance = ForceDistanceUtil.distance(merchant.getLongitude().doubleValue(),
                merchant.getLatitude().doubleValue(), request.getLongitude().doubleValue(), request.getLatitude().doubleValue());
        long maxVisitDistance = LaLaConfigClient.getAppLongConfigValue(MAX_VISIT_DISTANCE_KEY, DEFAULT_MAX_VISIT_DISTANCE);
        log.info("visit distance: {}", distance);
        // ……省略部分代码
        
    }
    // 张贴海报参数验证
    VisitValidator.validateActivityType(request);

    // 物资校验
    validateMaterialDelivery(request);

    // 坐标更新
    if (Objects.nonNull(merchant.getDataType()) && merchant.getDataType() == 2
            && Objects.nonNull(merchant.getRelocation()) && Objects.equals(Boolean.FALSE, merchant.getRelocation())) {
        merchant.setLongitude(request.getLongitude());
        merchant.setLatitude(request.getLatitude());
        merchant.setRelocation(true);
        merchant.setLocation(request.getAddress());
        merchantDao.updateById(merchant);
        abnormalVisitPosition = false;
    }

    // 创建拜访实体
    VisitEntity visit = VisitConvert.convertToEntity(request);
    visit.setRegionId(merchant.getRegionId());
    visit.setCityId(merchant.getCityId());
    visit.setMarketId(merchant.getMarketId());
    visit.setOpName(info.getUserName());

    //密集拜访
    LocalDateTime nowTime = LocalDateTime.now();
    //往前推最大间隔
    int minVisitCommitInterval = LaLaConfigClient.getAppIntConfigValue(MIN_VISIT_COMMIT_INTERVAL_KEY, DEFAULT_MIN_VISIT_COMMIT_INTERVAL);
    LocalDateTime deadline = nowTime.minusSeconds(minVisitCommitInterval);
    List<Visit> latestVisitList = visitDao.getLatestVisitList(info.getAccount(), deadline);
    //密集拜访判定
    intensiveVisit = CollUtil.isNotEmpty(latestVisitList);


    visitDao.insert(visit);

    // 商户状态校验
    boolean isBuilding = Objects.equals(MerchantStatusEnum.BUILDING.getStatus(), merchant.getStatus());
    
    if (isBuilding) {
        VisitValidator.validateFirstVisit(request);
        MerchantEntity entity = MerchantConvert.convertToCompleteEntity(request, visit.getVisitTime());
        merchantDao.updateById(entity);
        List<MerchantPictureEntity> list = MerchantConvert.convertToMerchantPictureEntity(request);
        merchantPictureService.saveBatch(list);
    } else {
        
        MerchantEntity entity = new MerchantEntity();
        entity.setId(request.getMerchantId());
        entity.setLastVisitTime(visit.getVisitTime());
        merchantDao.updateById(entity);
    }
    // 商户操作日志
    List<MerchantOperateLogEntity> logs = new ArrayList<>();

    //处理拜访质检标签
    saveInterviewee(request, logs, visit, merchant, abnormalVisitPosition, intensiveVisit);
    //拜访照片处理
    List<VisitPictureEntity> pictures = new ArrayList<>();
    
    pictures.addAll(convertToVisitPicture(visit.getId(), request.getFacadePictures(), PictureTypeEnum.FACADE));
    pictures.addAll(convertToVisitPicture(visit.getId(), request.getIndoorPictures(), PictureTypeEnum.INDOOR));
    
    if (null != request.getPosterPictures()) {
        pictures.addAll(convertToVisitPicture(visit.getId(), request.getPosterPictures(), PictureTypeEnum.POSTER));
    }
    visitPictureDao.batchInsert(pictures);

    // 商户建档审批流程
    if (isBuilding) {
        //……省略部分代码
    }
    // 保存商户操作日志
    merchantOperateLogService.saveBatch(logs);

    // 统计新增拜访数
    MetricMonitor.monitor(MetricEnum.VISIT_CREATED_NUM_EVERY_DAY);

    // 商户拜访跳转到商户列表页，返回商户变更信息
    MerchantBasicResponse changeInfo = new MerchantBasicResponse();
    changeInfo.setMerchantId(merchant.getId());
    // 商户自动踢公时间
    changeInfo.setAutoReleaseTime(merchant.getAutoReleaseTime());
    // 今日已拜访
    changeInfo.setHasVisitToday(Boolean.TRUE);
    if (isBuilding) {
        // 建档中，商户状态变更
        changeInfo.setStatus(MerchantStatusEnum.APPROVAL.getStatus());
        // 用车情况
        changeInfo.setCarUsage(request.getCarUsage());
        //……省略部分代码
    }

    // 拜访计划完成。
    visitPlanService.completeVisitPlan(LocalDate.now(), info.getAccount(), request.getMerchantId());


    return changeInfo;
}
```

  

**改造后：**

  

```
public MerchantAppResponse createVisit(CreateVisitRequest request) {
    // 商户私海检查
    MerchantEntity merchant = merchantDomainService.checkMerchantIsPrivate(request.getMerchantId());
    // 建档状态
    boolean isBuilding = Objects.equals(MerchantStatusEnum.BUILDING.getStatus(), merchant.getStatus());
    // 首次建档校验
    VisitValidator.validateFirstVisit(merchant, request);
    // 海报活动校验
    VisitValidator.validateActivityType(request);
    // 物资校验
    materialDomainService.validateMaterialDelivery(request);

    // 创建拜访
    VisitEntity visit = VisitConvert.convertToEntity(request);
    // 保存拜访照片
    visitDomainService.saveVisit(visit, request);

    // 记录商户操作日志,批量保存
    List<MerchantOperateLogEntity> operateLogList = new ArrayList<>();

    // 保存拜访用户相关信息,并记录日志
    visitDomainService.saveVisitUserInfo(request, visit, merchant, operateLogList);

    // 装配拜访物资发放信息,并记录日志
    List<VisitUserMaterialEntity> visitUserMaterialList = visitDomainService.assembleVisitMaterialsAndRecordLog(
            request, visit.getId(), merchant, operateLogList);

    // 处理物资发放
    materialDomainService.handleVisitMaterialDelivery(visitUserMaterialList, visit);

    //更新拜访后的商户信息
    merchantDomainService.updateMerchantInfoWithVisitAndRecordLog(merchant, visit, request, operateLogList);

    // 拜访时间
    List<Long> userIdList = request.getInterviewees().stream()
            .map(IntervieweeVO::getUserId).collect(Collectors.toList());
    userRepository.updateLastVisitTime(userIdList, request.getVisitTime());

    // 构造response
    MerchantAppResponse response = MerchantAppResponse.createBaseResponse(merchant.getId(),
            merchant.getAutoReleaseTime(), true);

    // 保存商户操作日志
    merchantOperateLogRepository.saveBatch(operateLogList);

    // 拜访计划
    visitPlanRepository.completeVisitPlan(LocalDate.now(), EmployeeUtils.get().getAccount(), request.getMerchantId());

    // 埋点
    MetricMonitor.monitor(MetricEnum.VISIT_CREATED_NUM_EVERY_DAY);
    return response;
}
```

  

注：由于 CRM 的业务相对比较垂直，对于做过这个领域开发的同学来说，可能理解起来较为困难（这也是笔者为什么在上文用很长的篇幅来通过订单业务做编码实战介绍的原因），大家可以对比代码注释理解。

  

通过上面代码我们可以看到，改造前的代码把所有的业务逻辑写到了 service 层，导致代码可读性差，迭代成本及改动风险都比较高；改造后，service 层的代码由 200 多行缩减至不到 50 行，方法逻辑清晰，每一行代码都代表了一个聚合的业务逻辑。

  

所以，我们接着上文的问题：什么是业务编排？业务编排的概念，简而言之就是：**业务逻辑无交叉，一行代码仅代表一个业务行为、用例或用户故事。**

  

细心的读者朋友可能发现一个问题：我们这段代码中并没有过多使用充血模型（详细原因请见文末附二），并且有些地方依然使用的是事务脚本的编程方式（比如这行代码 visitPlanRepository.completeVisitPlan ）。是的，笔者认为，DDD 的应用要足够灵活，足够贴近业务及开发，我们的目标是**让代码足够清晰、让框架更具扩展性**，从而达到研发提效的目的。所以大可不必为了追求 DDD 的 “标准” 而过度改变原有的模型或编程习惯。DDD 本身并不是最终目的，我们要灵活地应用 DDD 的思想，而不要被所谓的 “标准” 束缚。

  

**领域层改造阶段的难点除了业务编排外，还有一个比较关键的地方，就是 domain service 的使用。建议在此阶段开始前，读者可以在团队内制定好以下编码规范：**

  

*   一个**聚合根**对应一个 domain service（如果需要）；
    
*   单方法超过 **xx** 行代码（以实际业务场景评估，建议 100 行以上）必须用 domain service 进行编排；
    
*   一个 service 的方法操作 **xx** 个（建议 2 个）以上不同的**聚合 (或实体) 或存在外部上下文依赖时，必须使用 domain service；**
    
*   抽象到 domain service 的方法，原则上每个方法代表**一个聚合的一系列逻辑处理和一个聚合 (或实体) 的数据库写操作；**
    
*   每个实体在整个方法的生命周期中只写 **1** 次，防止逻辑跳跃和逻辑隐匿。
    

  

**改造实践 - 阶段三：远程调用层的依赖倒置**

  

![][img-15]

  

阶段三的改造方式与阶段一基本一致，主要就是应用依赖倒置改变远程调用层的依赖关系，使其变为基础设施层。

  

**具体做法：**

  

*   domain 中定义 IxxxRemote 接口
    
*   远程调用类实现相应的 IRemote 接口， 应用依赖倒置反转层级关系
    
*   domain 中注入原远程调用类的地方改为 IRemote 接口
    

  

改造实践 - 阶段四：收尾

  

![][img-16]

  

在完成前面三个阶段后，DDD 的改造基本上就完成了，阶段四主要是做一些收尾工作，包括规范包名，公共组件的抽象等。改造完成后，整体架构模式如上图所示，每个模块的说明请参考 3.2 这一节，这里不再赘述。

  

**3、小结**

  

整个改造过程中，主要有两个难点：一是原有架构的依赖倒置，二是明确应用服务层和领域层的职责划分。笔者认为，DDD 应用一定要灵活，取其精华，去其糟粕，千万不要 “为了 DDD 而 DDD”。

  

货拉拉用户 CRM 整个改造过程共计耗时约三个月时间，使用修缮者模式，技术改造跟业务需求迭代同时进行，改造期间未发生任何稳定性问题。改造后整体架构呈现如下：

  

![][img-17]

  

改造完成后，系统整体的可维护性和可扩展性都得到了很大的提升：

  

*   **简单性：**简化了系统复杂性，模型边界也更加清晰。
    
*   **可演化性：**降低研发人员的变更对开发效率的影响，使所有人都可以轻松理解并安全地修改系统，提高团队内的研发资源利用率
    
*   **可扩展性：**系统扩展性更高，节省更换或新增底层中间件的开发成本约 50% 以上
    

**五、总结**

  

在本文中，我们深入探讨了 DDD 战术设计架构模式，并为大家分享了我们货拉拉用户 CRM 的实际落地经验。

  

以笔者个人的经验来说，DDD 实践要注意以下三点：首先，DDD 的实践并没有统一的标准或固定的模式，每个团队都应该根据自身的业务需求和实际情况来进行设计和调整。其次，不要过于局限于 DDD 的理论概念，理论与实践之间存在差距，灵活应用才能真正提高开发效率和实现业务价值。最后，牢记 DDD 的初心——通过更好的业务建模，提升业务系统的维护性和扩展性。无论在何种背景下，DDD 的核心目的是为了解决复杂的业务问题，推动业务与技术的深度融合，助力团队实现可持续的增长和创新。

  

最后，为大家奉上笔者个人总结的 DDD 改造心得：

  

*   **DDD 没有统一标准，设计要结合自身实际业务**
    
*   **不要太局限于概念，找到最适合团队的实践方式**
    
*   **不忘初心，记得为什么要 DDD**
    

  

感谢读者朋友惠赐宝贵时间阅读拙文！

  

**附一：关键术语**

  

**限界上下文：**一个显式的边界，领域模型在这个边界内把通用语言表达成软件模型。说白了，限界上下文就是 idea 或 eclipse 里的一个实体工程项目，或是部署在虚拟机上的一个服务。在项目初期，可能整个公司只有一个限界上下文（也就是我们常说的单体架构），里面包含了多个子域，随着规模和用户体量的不断扩大，项目就需要拆分多个限界上下文（也就是我们所说的服务拆分），那么如何拆分，按照什么规则、什么大小拆分才是合理的，这就是 DDD 战略设计所做的事情（本篇我们只讲战术设计，不会过多的介绍战略设计）。

  

**领域：**相对于限界上下文，“领域” 属于问题空间的概念项目；例如：CRM 是一个领域，但是具体到工程项目，可以分为企业 CRM、用户 CRM、司机 CRM。在 DDD 中，一个领域可以分为多个子域，领域模型在限界上下文中完成开发；在开发一个领域模型时，我们关注的通常只是这个业务系统的某一个方面。

  

**子域：**在本篇中，领域与子域的概念可以认为是一致的，因为在本篇我们只关心一个业务系统（就是后面的示例订单系统；实际应用中，可以把领域再做拆分细化，让拆分出的子域只关注一个相对独立的业务场景。

  

**领域模型：**领域层定义和使用的模型

  

**数据模型：**数据层定义和使用的模型，对应数据表实体

  

**资源库：**一切存储数据的组件都可以认为是资源库，包括数据库、缓存，甚至是远程服务

  

**聚合和聚合根：**见 3.2.1 一节

  

**附二：实践常见问题**

  

我可以不用充血模型吗：

  

**当然可以！**

  

这个观点可能跟很多人对 DDD 的认知不太一样，充血模型有它独有的好处，例如面向对象，内聚性和复用性都比较强，并且可以更好的体现业务；但是引入充血模型如果对我们的业务系统改造非常大的话，我们也可以直接舍弃充血模型，来换取系统的简洁性，其实合理的业务编排也可以达到充血模型的效果。我们要知道，DDD 战术设计最重要的并不是充血模型，而是业务编排和架构。

  

例如在我们 CRM 系统的实践中，其实就没有过多的使用充血模型（完全不使用充血模型的 DDD 也被称为 DDD-Lite），原因之一是国内流行的 orm 框架 - mybatis 不太适用于充血模型（不像 JPA 的面向对象编程），二是强行引入充血领域模型可能会增加系统额外的复杂性。我们的做法是把数据模型直接放到了 domain 层，并把它当做领域模型使用（这样做的弊端就是可能会过多的依赖领域服务来编排逻辑，但也无伤大雅，我们不要太局限于 DDD 的标准概念，选择合适的架构模型，把业务逻辑编排好，找到最适合我们的做法）。

  

**建议最佳实践：**直接把数据模型当做领域充血模型使用，弊端就是数据模型的修改可能会影响业务逻辑。

  

注：JPA 可以在一定程度上减少数据 - 对象之间的阻抗失调，所以如果有读者的系统中使用了 JPA，还是比较推荐使用充血模型的

  

*   使用领域服务避免平级调用
    

  

场景：假如在用户体量不大时，我们把用户和订单放到了同一个限界上下文，等业务发展到一定规模后需要把用户系统拆分出来单独一个限界上下文，如果不使用 domain service，那么我们应用服务层的 service 就会有很多平级调用的情况（用户 service 和订单 service 的相互调用），这时我们就需要在当前上下文梳理出对用户 service 的调用链，可能涉及到非常多的业务逻辑；但如果我们使用了 domain service，我们只需要把有关用户的聚合实体和领域服务拿走单独做一个服务，然后在基础设施层把对用户操作的实现方式由数据库改为远程调用即可。

  

*   领域模型和数据模型解耦好处：
    

  

场景：优化数据模型时，不会耦合业务逻辑（因为业务逻辑完全由领域模型实现，数据模型不管怎样修改，只需要保证从资源库给到领域层时转为正确的领域模型就 OK）

  

*   六边形架构的好处：
    

  

场景：某项业务发展到一定规模后，需要进行服务拆分，如果是传统分层架构模型，势必要在业务代码中修改或替换模型代码；如果是六边形插件架构，我们就可以做到完全不修改业务代码逻辑：直接在把原来定义的 repository 接口替换为远程调用接口；如果我们把所有外部组件都视为一个基础设施，那么对于业务代码完全可以做到 0 改动；之所以可以这么做，就是因为我们对基础设施层应用了依赖倒置，业务领域层不会关心基础设施是由什么技术实现的，只需要给领域层所需要的领域模型就可以了。

  

*   关于防腐层
    

  

DDD 中防腐层的定义：在访问外部上下文时（例如 CRM 服务访问地图服务），需要把外部服务返回的信息封装成当前服务所需要领域模型。在应用了六边形插件架构后，其实像资源库等基础组件、或远程 RPC 调用都会包括了防腐层的概念。例如：我们会在基础设施层 - repository 中需要把数据实体对象转为领域对象；在基础设施层 - remote 中需要把外部服务返回的 json 对象转换为领域层所控制的领域对象。防腐层的引入主要是为了保证领域层的业务逻辑的内聚性，防止或减少基础组件对业务逻辑的侵入，更加符合组件设计的稳定依赖原则。在实践中，可以把 repository 的实现和 remote 的实现都当做是防腐层，他们会接收领域层领域模型的输入，并把数据模型或外部模型转为领域模型输出。

作者丨增长中台部

来源丨公众号：货拉拉技术（ID：huolalatech）

dbaplus 社群欢迎广大技术人员投稿，投稿邮箱：editor@dbaplus.cn

![][img-18]

![][img-19]

[img-0]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p01.png

[img-1]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p02.png

[img-2]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p03.png

[img-3]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p04.png

[img-4]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p05.png

[img-5]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p06.gif

[img-6]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p07.png

[img-7]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p08.png

[img-8]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p09.png

[img-9]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p10.png

[img-10]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p11.png

[img-11]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p12.png

[img-12]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p13.png

[img-13]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p14.gif

[img-14]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p15.png

[img-15]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p16.png

[img-16]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p17.png

[img-17]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p18.jpg

[img-18]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p19.jpg

[img-19]:images/业务量猛增！如何用-DDD-避免一场巨大的架构灾难？/p20.png
---
title: "迄今为止最完整的 DDD 实践"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/y6H8UG-g829o0V0EBeEwrw)

  

这是 2023 年的第 50 篇文章

（ 本文阅读时间：15 分钟 ）

  

对于一个架构师来说，在软件开发中如何降低系统复杂度是一个永恒的挑战。

**01**

  

  

**为什么需要 DDD**  

*   **复杂系统设计：** 系统多，业务逻辑复杂，概念不清晰，有什么合适的方法帮助我们理清楚边界，逻辑和概念
    
*   **多团队协同：** 边界不清晰，系统依赖复杂，语言不统一导致沟通和理解困难。有没有一种方式把业务和技术概念统一，大家用一种语言沟通。例如：航程是大家所理解的航程吗？
    
*   **设计与实现一致性：**PRD，详细设计和代码实现天差万别。有什么方法可以把业务需求快速转换为设计，同时还要保持设计与代码的一致性？
    
*   **架构统一，可复用资产和扩展性：** 当前取决于开发的同学具备很好的抽象能力和高编程的技能。有什么好的方法指导我们做抽象和实现。
    

**02**

  

  

**DDD 的价值**  

*   **边界清晰的设计方法：**通过领域划分，识别哪些需求应该在哪些领域，不断拉齐团队对需求的认知，分而治之，控制规模。
    
*   **统一语言：**团队在有边界的上下文中有意识地形成对事物进行统一的描述，形成统一的概念 (模型)。
    
*   **业务领域的知识沉淀：**通过反复论证和提炼模型，使得模型必须与业务的真实世界保持一致。促使知识 (模型) 可以很好地传递和维护。
    
*   **面向业务建模：**领域模型与数据模型分离，业务复杂度和技术复杂度分离。
    

  

  

**03**

  

  

**DDD 架构**  

3.1 分层架构

![][img-0]

*   **用户接口层：**调用应用层完成具体用户请求。包含：controller，远程调用服务等
    
*   **应用层 App：**尽量简单，不包含业务规则，而只为了下一层中的领域对象做协调任务，分配工作，重点对领域层做编排完成复杂业务场景。包含：AppService，消息处理等
    
*   **领域层 Domain：**负责表达业务概念和业务逻辑，领域层是系统的核心。包含：模型，值对象，域服务，事件
    
*   **基础层：**对所有上层提供技术能力，包括：数据操作，发送消息，消费消息，缓存等
    
*   **调用关系：**用户接口层 -> 应用层 -> 领域层 -> 基础层
    
*   **依赖关系：**用户接口层 -> 应用层 -> 领域层 -> 基础层
    

3.2 六边形架构

![][img-1]

![][img-2]

*   **六边形架构：**系统通过适配器的方式与外部交互，将应用服务于领域服务封装在系统内部
    
*   **分层架构：**它依然是分层架构，它核心改变的是依赖关系。
    
*   **领域层依赖倒置：**领域层依赖基础层倒置成基础层依赖领域层，这个简单的变化使得领域层不依赖任务层，其他层都依赖领域层，使得领域层只表达业务逻辑且稳定。
    

3.3 调用链路

![][img-3]

  

  

**04**

  

  

**DDD 的基本概念**  

4.1 领域模型

*   **领域（战略）：**业务范围，范围就是边界。
    
*   **子领域：**领域可大可小，我们将一个领域进行拆解形成子领域，子领域还可以进行拆解。当一个领域太大的时候需要进行细化拆解。
    
*   **模型（战术）：**基于某个业务领域识别出这个业务领域的聚合，聚合根，界限上下文，实体，值对象。
    

✪ 4.1.1 核心域

决定产品和公司核心竞争力的子域是核心域，它是业务成功的主要因素和公司的核心竞争力。**直接对业务产生价值。**

✪ 4.1.2 通用域

没有太多个性化的诉求，同时被多个子域使用的通用功能子域是通用域。例如，权限，登陆等等。**间接对业务产生价值。**

✪ 4.1.3 支撑域

支撑其他领域业务，具有企业特性，但不具有通用性。**间接对业务产生价值。**

✪ 4.1.4 为什么要划分核心域、通用域和支撑域

一个业务一定有他最重要的部分，在日常做业务判断和需求优先级判断的时候可以基于这个划分来做决策。例如：一个交易相关的需求和一个配置相关的需求排优先级，很明显交易是核心域，规则是支持域。同样我们认为是支撑域或者通用域的在其他公司可能是核心域，例如权限对于我们来说是通用域，但是对于专业做权限系统的公司，这个是核心域。

4.2 限界上下文（战略）

业务的边界的划分，这个边界可以是一个领域或者多个领域的集合。复杂业务需要多个域编排完成一个复杂业务流程。限界上下文可以作为微服务划分的方法。其本质还是高内聚低耦合，只是限界上下文只是站在更高的层面来进行划分。如何进行划分，我的方法是一个界限上下文必须支持一个完整的业务流程，保证这个业务流程所涉及的领域都在一个限界上下文中。

4.3 实体（ENTITY）

**定义：**实体有唯一的标识，有生命周期且具有延续性。例如一个交易订单，从创建订单我们会给他一个订单编号并且是唯一的这就是实体唯一标识。同时订单实体会从创建，支付，发货等过程最终走到终态这就是实体的生命周期。订单实体在这个过程中属性发生了变化，但订单还是那个订单，不会因为属性的变化而变化，这就是实体的延续性。

**实体的业务形态：**实体能够反映业务的真实形态，实体是从用例提取出来的。领域模型中的实体是多个属性、操作或行为的载体。

**实体的代码形态：**我们要保证实体代码形态与业务形态的一致性。那么实体的代码应该也有属性和行为，也就是我们说的充血模型，但实际情况下我们使用的是贫血模型。贫血模型缺点是业务逻辑分散，更像数据库模型，充血模型能够反映业务，但过重依赖数据库操作，而且复杂场景下需要编排领域服务，会导致事务过长，影响性能。所以我们使用充血模型，但行为里面只涉及业务逻辑的内存操作。

**实体的运行形态：**实体有唯一 ID，当我们在流程中对实体属性进行修改，但 ID 不会变，实体还是那个实体。

**实体的数据库形态：**实体在映射数据库模型时，一般是一对一，也有一对多的情况。

4.4 值对象（VALUEOBJECT）

**定义：**通过对象属性值来识别的对象，它将多个相关属性组合为一个概念整体。在 DDD 中用来描述领域的特定方面，并且是一个没有标识符的对象，叫作值对象。值对象没有唯一标识，没有生命周期，不可修改，当值对象发生改变时只能替换（例如 String 的实现）

**值对象的业务形态：**值对象是描述实体的特征，大多数情况一个实体有很多属性，一般都是平铺，这些数据进行分类和聚合后能够表达一个业务含义，方便沟通而不关注细节。

**值对象的代码形态：**实体的单一属性是值对象，例如：字符串，整型，枚举。多个属性的集合也是值对象，这个时候我们把这个集合设计为一个 CLASS，但没有 ID。例如商品实体下的航段就是一个值对象。航段是描述商品的特征，航段不需要 ID，可以直接整体替换。商品为什么是一个实体，而不是描述订单特征，因为需要表达谁买了什么商品，所以我们需要知道哪一个商品，因此需要 ID 来标识唯一性。

我们看一下下面这段代码，person 这个实体有若干个单一属性的值对象，比如 Id、name 等属性；同时它也包含多个属性的值对象，比如地址 address。

![][img-4]

**值对象的运行形态：**值对象创建后就不允许修改了，只能用另外一个值对象来整体替换。当我们修改地址时，从页面传入一个新的地址对象替换调用 person 对象的地址即可。如果我们把 address 设计成实体，必然存在 ID，那么我们需要从页面传入的地址对象的 ID 与 person 里面的地址对像的 ID 进行比较，如果相同就更新，如果不同先删除数据库在新增数据。

**值对象的数据库形态：**有两种方式嵌入式和序列化大对象。

案例 1：以属性嵌入的方式形成的人员实体对象，地址值对象直接以属性值嵌入人员实体中。

当我们只有一个地址的时候使用嵌入式比较好，如果多个地址必须有序列化大对象，同时可以支持搜索。

![][img-5]

案例 2：以序列化大对象的方式形成的人员实体对象，地址值对象被序列化成大对象 Json 串后，嵌入人员实体中。

![][img-6]

支持多个地址存储，不支持搜索。

**值对象的优势和局限：**

1.  简化数据库设计，提升数据库操作的性能（多表新增和修改，关联表查询）。
    
2.  虽然简化数据库设计，但是领域模型还是可以表达业务。
    
3.  序列化的方式会使搜索实现困难（通过搜索引擎可以解决）。
    

4.5 聚合和聚合根

多个实体和值对象组成的我们叫聚合，聚合的内部一定的高内聚。这个聚合里面一定有一个实体是聚合根。

聚合与领域的关系：聚合也是范围的划分，领域也是范围的划分。领域与聚合可以是一对一，也可以是一对多的关系

聚合根的作用是保证内部的实体的一致性，对外只需要对聚合根进行操作。

4.6 限界上下文，域，聚合，实体，值对象的关系

领域包含限界上下文，限界上下文包含子域，子域包含聚合，聚合包含实体和值对象

4.7 事件风暴

**参与者**

除了领域专家，事件风暴的其他参与者可以是 DDD 专家、架构师、产品经理、项目经理、开发人员和测试人员等项目团队成员

**事件风暴准备的材料**

一面墙和一支笔。

**事件风暴的关注点**

在领域建模的过程中，我们需要重点关注这类业务的语言和行为。比如某些业务动作或行为（事件）是否会触发下一个业务动作，这个动作（事件）的输入和输出是什么？是谁（实体）发出的什么动作（命令），触发了这个动作（事件）… 我们可以从这些暗藏的词汇中，分析出领域模型中的事件、命令和实体等领域对象。

实体执行命令产生事件。

**业务场景的分析**

通过业务场景和用例找出实体，命令，事件。

**领域建模**

领域建模时，我们会根据场景分析过程中产生的领域对象，比如命令、事件等之间关系，找出产生命令的实体，分析实体之间的依赖关系组成聚合，为聚合划定限界上下文，建立领域模型以及模型之间的依赖。领域模型利用限界上下文向上可以指导微服务设计，通过聚合向下可以指导聚合根、实体和值对象的设计。

  

  

**05**

  

  

**如何建模**  

![][img-7]

*   **用例场景梳理：**就是一句话需求，但我们需要把一些模糊的概念通过对话的方式逐步得到明确的需求，在加以提炼和抽象。
    
*   **建模方法论：**词法分析（找名词和动词），领域边界
    
*   **模型验证**
    

5.1 协同单自动化分单案例

✪ 5.1.1 领域建模

需求：我们需要把系统自动化失败转人工订单自动分配给小二，避免人工挑单和抢单，通过自动分配提升整体履约处理效率。

*   产品小 A：把需求读了一遍.......。
    

*   开发小 B：那就是将履约单分配给个小二对吧？
    

*   产品小 A：不对，我们还需要根据一个规则自动分单，例如退票订单分给退票的小二
    

*   开发小 B：恩，那我们可以做一个分单规则管理。例如：新增一个退票分单规则，在里面添加一批小二工号。履约单基于自身属性去匹配分单规则并找到一个规则，然后从分单规则里面选择一个小二工号，履约单写入小二工号即可。
    

![][img-8]

*   产品小 A：分单规则还需要有优先级，其中小二如果上班了才分配，如果下班了就不分配。
    

*   开发小 B：优先级没有问题，在匹配分单规则方法里面按照优先级排序即可，不影响模型。而小二就不是简单一个工号维护在分单规则中，小二有状态了。
    

![][img-9]

*   产品小 A：分单规则里面添加小二操作太麻烦了，例如：每次新增一个规则都要去挑人，人也不一定记得住，实际客服在管理小二的时候是按照技能组管理的。
    

*   开发小 B：恩，懂了，那就是通过新增一个技能组管理模块来管理小二。然后在通过分单规则来配置 1 个技能组即可。获取一个小二工号就在技能组里面了。
    

![][img-10]

*   开发小 B：总感觉不对，因为新增一个自动化分单需求，履约单就依赖了分单规则，履约单应该是一个独立的域，分单不是履约的能力，履约单实际只需要知道处理人是谁，至于怎么分配的他不太关心。应该由分单规则基于履约单属性找匹配一个规则，然后基于这个规则找到一个小二。**履约单与分单逻辑解耦。**
    

![][img-11]

*   产品小 A：分单要轮流分配或者能者多劳分配，小二之前处理过的订单和航司优先分配。
    

*   开发小 B：获取小二的逻辑越来越复杂了，实际技能组才是找小二的核心，分单规则核心是通过履约单特征得到一个规则结果 (技能组 ID，分单策略，特征规则)。技能组基于分单规则的结果获得小二工号。
    

![][img-12]

*   产品小 A：还漏了一个信息，就是履约单会被多次分配的情况，每一个履约环节都可能转人工，客服需要知道履约单被处理多次的情况
    

*   开发小 B：那用履约单无法表达了，我们需要新增一个概念叫协同单，协同单是为了协同履约单，通过协同推进履约单的进度。
    

![][img-13]

*   产品小 A：协同单概念很好，小二下班后，如果没有处理完，还可以转交给别人。
    

*   开发小 B：恩，那只需要在协同单上增加行为即可。
    

![][img-14]

✪ 5.1.2 领域划分

沟通的过程就是推导和验证模型的过程，最后进行域的划分：

![][img-15]

✪ 5.1.3 场景梳理

穷举所有场景，重新验证模型是否可以覆盖所有场景。

左滑查看  

```

<table><tbody><tr><td><p><strong>场景名称</strong></p></td><td><p><strong>锁</strong></p></td><td><p><strong>场景动作</strong></p></td><td><p><strong>域</strong></p></td><td><p><strong>域服务</strong></p></td><td><p><strong>聚合根</strong></p></td><td><p><strong>方法</strong></p></td></tr><tr><td><p>创建协同单</p></td><td><p>无</p></td><td><p>1、判断关联业务单是否非法</p></td><td><p>协同单</p></td><td><p>创建协同单</p><p>1、问题分类是否符合条件 (例如: 商家用户发起自营 -&gt; 商家的协同单)</p><p>2、save</p></td><td><p>协同单</p></td><td><p>创建协同单</p></td></tr><tr><td><p>分配协同单</p></td><td><p>协同单 ID</p></td><td><p>分配协同单到人.</p><p>1、判断协同单状态 (= 待处理)</p><p>2、记录操作日志</p><p>3、save</p></td><td><p>协同单</p></td><td><p>分配协同单</p></td><td><p>协同单</p></td><td><p>分配协同单</p></td></tr><tr><td><p>受理协同单</p></td><td><p>协同单 ID</p></td><td><p>处理协同单</p></td><td><p>协同单</p></td><td><p>受理协同单</p><p>1. 判断订单状态 (= 待处理 / 验收失败)</p><p>2. 更改订单状态（待处理 / 验收失败 -&gt; 处理中）</p><p>3. 记录操作日志</p><p>4.save</p></td><td><p>协同单</p></td><td><p>受理协同单</p></td></tr><tr><td><p>转交协同单</p></td><td><p>协同单 ID</p></td><td><p>转交协同单</p></td><td><p>协同单</p></td><td><p>转交协同单</p><p>1. 判断订单状态.（= 处理中、待处理）</p><p>2. 校验转交的人是否在正确的组织下面</p><p>3. 更改协同人值对象（同一组织下的不同人，从坐席管理域中取）</p><p>4. 记录操作日志</p><p>5.save</p></td><td><p>协同单</p></td><td><p>转交协同单</p></td></tr><tr><td><p>关闭协同单</p></td><td><p>协同单 ID</p></td><td><p>关闭协同单</p></td><td><p>协同单</p></td><td><p>关闭协同单</p><p>1. 判断订单状态 (= 处理中、待处理)</p><p>2. 更改订单状态 (关闭)</p><p>3. 记录操作日志</p><p>4.save</p></td><td><p>协同单</p></td><td><p>关闭协同单</p></td></tr><tr><td><p>处理协同单</p></td><td><p>协同单 ID</p></td><td><p>处理协同单</p></td><td><p>协同单</p></td><td><p>处理协同单</p><p>1. 判断订单状态 (= 处理中)</p><p>2. 更改订单状态 (处理中 -&gt; 待验收)</p><p>3. 记录操作日志</p><p>4.save</p></td><td><p>协同单</p></td><td><p>处理协同单</p></td></tr><tr><td><p>驳回协同单</p></td><td><p>协同单 ID</p></td><td><p>驳回协同单</p></td><td><p>协同单</p></td><td><p>驳回协同单</p><p>1. 判断订单状态 (= 待验收)</p><p>2. 更改订单状态 (待验收 -&gt; 处理中)</p><p>3. 记录操作日志</p><p>4.save</p></td><td><p>协同单</p></td><td><p>驳回协同单</p></td></tr><tr><td><p>完结协同单</p></td><td><p>协同单 ID</p></td><td><p>完结协同单</p></td><td><p>协同单</p></td><td><p>完结协同单</p><p>1. 判断订单状态 (= 待验收)</p><p>2. 更改订单状态 (待验收 -&gt; 已完结)</p><p>3. 记录操作日志</p><p>4.save</p></td><td><p>协同单</p></td><td><p>完结协同单</p></td></tr><tr><td><p>拒绝协同单</p></td><td><p>协同单 ID</p></td><td><p>拒绝协同单</p></td><td><p>协同单</p></td><td><p>拒绝协同单</p><p>1. 判断订单状态 (= 处理中、待处理)</p><p>2. 更改订单状态 (已拒绝)</p><p>3. 记录操作日志</p><p>4.save</p></td><td><p>协同单</p></td><td><p>拒绝协同单</p></td></tr><tr><td><p>催单</p></td><td><p>协同单 ID</p></td><td><p>催单</p></td><td><p>协同单</p></td><td><p>催单</p><p>1. 判断订单状态 (= 处理中、待处理)</p><p>2、修改催单值对象</p><p>3、记录操作日志</p><p>4、save</p></td><td><p>协同单</p></td><td><p>催单</p></td></tr></tbody></table>
```


  

  

**06**

  

  

**怎么写代码**  

6.1 DDD 规范

![][img-16]

每一层都定义了相应的接口主要目的是规范代码：

*   application：CRQS 模式，ApplicationCmdService 是 command，ApplicationQueryService 是 query
    
*   service：是领域服务规范，其中定义了 DomainService，应用系统需要继承它。
    
*   model：是聚合根，实体，值对象的规范。
    

*   Aggregate 和 BaseAggregate：聚合根定义
    
*   Entity 和 BaseEntity：实体定义
    
*   Value 和 BaseValue：值对象定义
    
*   Param 和 BaseParam：领域层参数定义，用作域服务，聚合根和实体的方法参数
    
*   Lazy：描述聚合根属性是延迟加载属性，类似与 hibernate。
    
*   Field：实体属性，用来实现 update-tracing
    

```
/**
 * 实体属性，update-tracing
 * @param <T>
 */
public final class Field<T> implements Changeable {
    private boolean changed = false;
    private T value;
    private Field(T value){
        this.value = value;
    }
    public void setValue(T value){
        if(!equalsValue(value)){
            this.changed = true;
        }
        this.value = value;
    }
    @Override
    public boolean isChanged() {
        return changed;
    }
    public T getValue() {
        return value;
    }
    public boolean equalsValue(T value){
        if(this.value == null && value == null){
            return true;
        }
        if(this.value == null){
            return false;
        }
        if(value == null){
            return false;
        }
        return this.value.equals(value);
    }
    public static <T> Field<T> build(T value){
        return new Field<T>(value);
    }
}
```

*   repository
    

*   Repository：仓库定义
    
*   AggregateRepository：聚合根仓库, 定义聚合根常用的存储和查询方法
    

*   event：事件处理
    
*   exception：定义了不同层用的异常
    

*   AggregateException：聚合根里面抛的异常
    
*   RepositoryException：基础层抛的异常
    
*   EventProcessException：事件处理抛的
    

6.2 工程结构

![][img-17]

![][img-18]

✪ 6.2.1 application 模块

![][img-19]

*   CRQS 模式：commad 和 query 分离。
    
*   重点做跨域的编排工作，无业务逻辑。
    

✪ 6.2.2 domain 模块

![][img-20]

*   域服务, 聚合根，值对象，领域参数，仓库定义
    

✪ 6.2.3 infrastructurre 模块

![][img-21]

所有技术代码在这一层。mybatis，redis，mq，job，opensearch 代码都在这里实现，domain 通过依赖倒置不依赖这些技术代码和 JAR。

✪ 6.2.4 client 模块

对外提供服务

![][img-22]

✪ 6.2.5 model 模块

内外都要用的共享对象

![][img-23]

6.3 代码示例

✪ 6.3.1 application 示例

```
public interface CaseAppFacade extends ApplicationCmdService {
    /**
     * 接手协同单
     * @param handleCaseDto
     * @return
     */
    ResultDO<Void> handle(HandleCaseDto handleCaseDto);

}
public class CaseAppImpl implements CaseAppFacade {
    @Resource
    private CaseService caseService;//域服务
    @Resource
    CaseAssembler caseAssembler;//DTO转Param
    @Override
    public ResultDO<Void> handle(HandleCaseDto handleCaseDto) {
        try {
            ResultDO<Void> resultDO = caseService.handle(caseAssembler.from(handleCaseDto));
            if (resultDO.isSuccess()) {
                pushMsg(handleCaseDto.getId());
                return ResultDO.buildSuccessResult(null);
            }
            return ResultDO.buildFailResult(resultDO.getMsg());
        } catch (Exception e) {
            return ResultDO.buildFailResult(e.getMessage());
        }
    }
}
```

*   mapstruct：VO,DTO,PARAM,DO,PO 转换非常方便，代码量大大减少。
    
*   CaseAppImpl.handle 调用域服务 caseService.handle。
    

✪ 6.3.2 domainService 示例

```
public interface CaseService extends DomainService {
    /**
     * 接手协同单
     *
     * @param handleParam
     * @return
     */
    ResultDO<Void> handle(HandleParam handleParam);
    
}
public class CaseServiceImpl implements CaseService {
    @Resource
  private CoordinationRepository coordinationRepository;

    @Override
    public ResultDO<Void> handle(HandleParam handleParam) {
        SyncLock lock = null;
        try {
            lock = coordinationRepository.syncLock(handleParam.getId().toString());
            if (null == lock) {
                return ResultDO.buildFailResult("协同单handle加锁失败");
            }
            CaseAggregate caseAggregate = coordinationRepository.query(handleParam.getId());
            caseAggregate.handle(handleParam.getFollowerValue());
            coordinationRepository.save(caseAggregate);
            return ResultDO.buildSuccessResult(null);
        } catch (RepositoryException | AggregateException e) {
            String msg = LOG.error4Tracer(OpLogConstant.traceId(handleParam.getId()), e, "协同单handle异常");
            return ResultDO.buildFailResult(msg);
        } finally {
            if (null != lock) {
                coordinationRepository.unlock(lock);
            }
        }
    }
}
```

*   **领域层不依赖基础层的实现：**coordinationRepository 只是接口，在领域层定义好，由基础层依赖领域层实现这个接口。
    
*   **业务逻辑和技术解耦：**域服务这层通过调用 coordinationRepository 和聚合根将业务逻辑和技术解耦。
    
*   **聚合根的方法无副作用：**聚合根的方法只对聚合根内部实体属性的改变，不做持久化动作，可反复测试。
    
*   **模型与数据分离：**
    

*   改变模型：caseAggregate.handle(handleParam.getFollowerValue())。
    
*   改变数据：coordinationRepository.save(caseAggregate)；事务是在 save 方法上。
    

✪ 6.3.3 Aggregate,Entity 示例

```
public class CaseAggregate extends BaseAggregate implements NoticeMsgBuilder {
    private final CaseEntity caseEntity;
    public CaseAggregate(CaseEntity caseEntity) {
        this.caseEntity = caseEntity;
    }
    /**
     * 接手协同单
     * @param followerValue
     * @return
     */
    public void handle(FollowerValue followerValue) throws AggregateException {
        try {
            this.caseEntity.handle(followerValue);
        } catch (Exception e) {
            throw e;
        }
    }
}
public class CaseEntity extends BaseEntity {
    /**
     * 创建时间
     */
    private Field<Date> gmtCreate;
    /**
     * 修改时间
     */
    private Field<Date> gmtModified;
    /**
     * 问题分类
     */
    private Field<Long> caseType;
    /**
     * 是否需要支付
     */
    private Field<Boolean> needPayFlag;
    /**
     * 是否需要自动验收通过协同单
     */
    private Field<Integer> autoAcceptCoordinationFlag;
    /**
     * 发起协同人值对象
     */
    private Field<CreatorValue> creatorValue;
    /**
     * 跟进人
     */
    private Field<FollowerValue> followerValue;
    /**
     * 状态
     */
    private Field<CaseStatusEnum> status;
    /**
     * 关联协同单id
     */
    private Field<String> relatedCaseId;
    /**
     * 关联协同单类型
     * @see 读配置 com.alitrip.agent.business.flight.common.model.dataobject.CoordinationCaseTypeDO
     */
    private Field<String> relatedBizType;

    /**
     * 支付状态
     */
    private Field<PayStatusEnum> payStatus;
    省略....

    public CaseFeatureValue getCaseFeatureValue() {
        return get(caseFeatureValue);
    }
    public Boolean isCaseFeatureValueChanged() {
        return caseFeatureValue.isChanged();
    }

    public void setCaseFeatureValue(CaseFeatureValue caseFeatureValue) {
        this.caseFeatureValue = set(this.caseFeatureValue, caseFeatureValue);
    }

    public Boolean isPayStatusChanged() {
        return payStatus.isChanged();
    }

    public Boolean isGmtCreateChanged() {
        return gmtCreate.isChanged();
    }

    public Boolean isGmtModifiedChanged() {
        return gmtModified.isChanged();
    }

    public Boolean isCaseTypeChanged() {
        return caseType.isChanged();
    }
    省略....

   
    /**
    * 接手
    */
    public void handle(FollowerValue followerValue) throws AggregateException {
        if (isWaitProcess()||isAppointProcess()) {
            this.setFollowerValue(followerValue);
            this.setStatus(CaseStatusEnum.PROCESSING);
            this.setGmtModified(new Date());
            initCaseRecordValue(CaseActionNameEnum.HANDLE, null, followerValue);
        } else {
            throwStatusAggregateException();
        }
    }
    省略....
}
```

*   **充血模型 VS 贫血模型：**
    

*   充血模型：表达能力强，代码高内聚，领域内封闭，聚合根内部结构对外不可见，通过聚合根的方法访问，适合复杂企业业务逻辑。
    
*   贫血模型：业务复杂之后，逻辑散落到大量方法中。
    

*   **规范大于技巧：**DDD 架构可以避免引入一些其他概念，系统只有域，域服务，聚合根，实体，值对象，事件来构建系统。
    

![][img-24]

![][img-25]

聚合根的 reconProcess 的方法的业务逻辑被 reconHandler 和 reconRiskHandler 处理，必然这些 handler 要访问聚合根里面的实体的属性，那么逻辑就会散落。修改后：

![][img-26]

没有引入其他概念，都是在聚合根里面组织实体完成具体业务逻辑，去掉了 handler 这种技术语言。

*   **聚合根和实体定义的方法是具备单一原则，复用性原则与使用场景无关**，例如：不能定义手工创建协调单和系统自动创建协同单，应该定义创建协同单。
    
*   **Update-tracing：**handle 方法修改属性后，然后调用 coordinationRepository.save(caseAggregate)，我们只能全量属性更新。Update-tracing 是监控实体的变更。 Entiy 定义属性通过 Field 进行包装实现属性的变更状态记录，结合 mapstruct 转换 PO 实现 Update-tracing。
    

![][img-27]

修改了 mapstruct 生成转换代码的源码，修改后生成的代码：

```
if(caseEntity.isAppended() || caseEntity.isCaseTypeChanged()){
    casePO.setCaseType( caseEntity.getCaseType() );
}
```

当属性被改变后就转换到 po 中，这样就可以实现修改后的字段更新。

*   **idea 的 get 和 set 方法自动生成：**由于使用 field 包装，需要自定义 get 和 set 生成代码。
    

![][img-28]

✪ 6.3.4 Repository 示例

```
public interface CoordinationRepository extends Repository {  
  /**
     * 保存/更新
     * @param aggregate
     * @throws RepositoryException
     */
   void save(CaseAggregate aggregate) throws RepositoryException;
}
@Repository
public class CoordinationRepositoryImpl implements CoordinationRepository {
  @Override
    public void save(CaseAggregate aggregate) throws RepositoryException {
        try {
            
            //聚合根转PO，update-tracing技术
            CasePO casePO = caseConverter.toCasePO(aggregate.getCase());
            CasePO oldCasePO = null;
            if (aggregate.getCase().isAppended()) {
                casePOMapper.insert(casePO);
                aggregate.getCase().setId(casePO.getId());
            } else {
                oldCasePO = casePOMapper.selectByPrimaryKey(casePO.getId());
                casePOMapper.updateByPrimaryKeySelective(casePO);
            }
            // 发送协同单状态改变消息
            if (CaseStatusEnum.FINISH.getCode().equals(casePO.getStatus())
                || CaseStatusEnum.WAIT_DISTRIBUTION.getCode().equals(casePO.getStatus())
                || CaseStatusEnum.PROCESSING.getCode().equals(casePO.getStatus())
                || CaseStatusEnum.APPOINT_PROCESS.getCode().equals(casePO.getStatus())
                || CaseStatusEnum.WAIT_PROCESS.getCode().equals(casePO.getStatus())
                || CaseStatusEnum.CLOSE.getCode().equals(casePO.getStatus())
                || CaseStatusEnum.REJECT.getCode().equals(casePO.getStatus())
                || CaseStatusEnum.PENDING_ACCEPTANCE.getCode().equals(casePO.getStatus())) {

                FollowerDto followerDto = new FollowerDto();
                followerDto.setCurrentFollowerId(aggregate.getCase().getFollowerValue().getCurrentFollowerId());
                followerDto.setCurrentFollowerGroupId(aggregate.getCase().getFollowerValue().getCurrentFollowerGroupId());
                followerDto.setCurrentFollowerType(aggregate.getCase().getFollowerValue().getCurrentFollowerType());
                followerDto.setCurrentFollowerName(aggregate.getCase().getFollowerValue().getCurrentFollowerName());
                //拒绝和关闭都使用CLOSE
                String tag = CaseStatusEnum.codeOf(casePO.getStatus()).name();
                if(CaseStatusEnum.REJECT.name().equals(tag)){
                    tag = CaseStatusEnum.CLOSE.name();
                }
                statusChangeProducer.send(CaseStatusChangeEvent.build()
                    .setId(casePO.getId())
                    .setFollowerDto(followerDto)
                    .setStatus(aggregate.getCase().getStatus().getCode())
                    .setCaseType(aggregate.getCase().getCaseType())
                    .setOldStatus(null != oldCasePO ? oldCasePO.getStatus() : null)
                    .setAppointTime(aggregate.getCase().getAppointTime()), (tag));
            }

            // 操作日志
            if (CollectionUtils.isNotEmpty(aggregate.getCase().getCaseRecordValue())) {
                CaseRecordValue caseRecordValue = Lists.newArrayList(aggregate.getCase().getCaseRecordValue()).get(0);
                caseRecordValue.setCaseId(casePO.getId());
                recordPOMapper.insert(caseConverter.from(caseRecordValue));
            }

        } catch (Exception e) {
            throw new RepositoryException("", e.getMessage(), e);
        }
    }
}
```

*   CoordinationRepository 接口定义在领域层。
    
*   CoordinationRepositoryImpl 实现在基础层: 数据库操作都是基于聚合根操作，保证聚合根里面的实体强一致性。
    

  

  

**07**

  

  

**最后结束语**  

*   好的模型，可以沉淀组织资产，不好的模型，逐渐成为负债。
    
*   功能才是表象，模型才是内在。
    
*   建模过程是不断猜想与反驳的过程。
    
*   演化观点是建模过程的基本心智模式。
    

![][img-29]

![][img-30]

欢迎留言一起参与讨论~

[img-0]:images/迄今为止最完整的-DDD-实践/p01.png

[img-1]:images/迄今为止最完整的-DDD-实践/p02.png

[img-2]:images/迄今为止最完整的-DDD-实践/p03.png

[img-3]:images/迄今为止最完整的-DDD-实践/p04.png

[img-4]:images/迄今为止最完整的-DDD-实践/p05.png

[img-5]:images/迄今为止最完整的-DDD-实践/p06.png

[img-6]:images/迄今为止最完整的-DDD-实践/p07.png

[img-7]:images/迄今为止最完整的-DDD-实践/p08.png

[img-8]:images/迄今为止最完整的-DDD-实践/p09.jpg

[img-9]:images/迄今为止最完整的-DDD-实践/p10.jpg

[img-10]:images/迄今为止最完整的-DDD-实践/p11.jpg

[img-11]:images/迄今为止最完整的-DDD-实践/p12.jpg

[img-12]:images/迄今为止最完整的-DDD-实践/p13.jpg

[img-13]:images/迄今为止最完整的-DDD-实践/p14.jpg

[img-14]:images/迄今为止最完整的-DDD-实践/p15.jpg

[img-15]:images/迄今为止最完整的-DDD-实践/p16.jpg

[img-16]:images/迄今为止最完整的-DDD-实践/p17.png

[img-17]:images/迄今为止最完整的-DDD-实践/p18.png

[img-18]:images/迄今为止最完整的-DDD-实践/p19.png

[img-19]:images/迄今为止最完整的-DDD-实践/p20.png

[img-20]:images/迄今为止最完整的-DDD-实践/p21.png

[img-21]:images/迄今为止最完整的-DDD-实践/p22.png

[img-22]:images/迄今为止最完整的-DDD-实践/p23.png

[img-23]:images/迄今为止最完整的-DDD-实践/p24.png

[img-24]:images/迄今为止最完整的-DDD-实践/p25.png

[img-25]:images/迄今为止最完整的-DDD-实践/p26.png

[img-26]:images/迄今为止最完整的-DDD-实践/p27.png

[img-27]:images/迄今为止最完整的-DDD-实践/p28.png

[img-28]:images/迄今为止最完整的-DDD-实践/p29.png

[img-29]:images/迄今为止最完整的-DDD-实践/p30.gif

[img-30]:images/迄今为止最完整的-DDD-实践/p31.gif

---
title: "内存 Join 可以如此简单！！！"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/TggSrm3C7Fvf-_1q4K7FUQ)

### 1. 概览

数据库 Join 真的太香了，但由于各种原因，在实际项目中越来越受局限，只能由开发人员在应用层完成。这种繁琐、无意义的 “体力劳动” 让我们离 “快乐生活” 越来越远。

#### 1.1. 背景

> 不知道什么时候，数据库 join 成为了公认的 “性能杀手”，对此，很多公司严厉禁止其使用。上有政策下有对策，你的应对之道是什么？

数据库 Join 退出历史舞台，主要由以下几大推动力：

1.  微服务。微服务要求 “数据资产私有化”，也就是说每个服务的数据库是私有资产，不允许其他服务的直接访问；如果需要访问，只能通过服务所提供的接口完成；
    
2.  分库分表的限制。当数据量超过 MySQL 单实例承载能力时，通常会通过 “分库分表” 这一技术手段来解决，分库分表后，数据被分散到多个分区中，导致 join 语句失效；
    
3.  性能瓶颈。在高并发情况下，join 存在一定的性能问题，高并发、高性能端场景不适合使用；
    

不管原因几何，目前，很多大厂已经将 “禁止 join” 列入编码规范，我们该如何面对？

> 只定规范，不给工具，是一种极度不负责任的表现。

##### 1.1.1. 线上问题跟踪

线上 order/list 接口 tp99 超过 2s，严重影响用户体验，同时还有愈演愈烈之势。通过 Trace 系统，发现一个请求居然存在几百甚至上千次 DB 调用！

第一反应，肯定是在 for 循环中调用了 DB，翻看代码果然如此，代码示例如下：

```
@Overridepublic List<? extends OrderDetailVO> getByUserId(Long userId) {    List<Order> orders = this.orderRepository.getByUserId(userId);    return orders.stream()            .map(order -> convertToOrderDetailVO(order))            .collect(toList());}private OrderDetailVOV1 convertToOrderDetailVO(Order order) {    OrderVO orderVO = OrderVO.apply(order);    OrderDetailVOV1 orderDetailVO = new OrderDetailVOV1(orderVO);    Address address = this.addressRepository.getById(order.getAddressId());    AddressVO addressVO = AddressVO.apply(address);    orderDetailVO.setAddress(addressVO);    User user = this.userRepository.getById(order.getUserId());    UserVO userVO = UserVO.apply(user);    orderDetailVO.setUser(userVO);    Product product = this.productRepository.getById(order.getProductId());    ProductVO productVO = ProductVO.apply(product);    orderDetailVO.setProduct(productVO);    return orderDetailVO;}
```

代码非常简单，只做了几件事：

1.  获取用户的 order 信息；
    
2.  遍历每一个 order，为其装配关联数据；
    
3.  返回最终结果；
    

逻辑非常清晰，单请求数据库访问总次数 = 1（获取用户订单）+ N（订单数量） * 3（需要抓取的关联数据）

可见，N（订单数量） * 3（关联数据数量）  是性能的最大杀手，存在严重的读放大效应。不同的用户，订单数量相差巨大，导致该接口性能差距巨大。

##### 1.1.2. 繁琐、无意义的代码

如何应对？第一反应就是 批量获取，然后在内存中完成 Join。这是一个好的方案，但引入了大量繁琐、无意义的代码。

该问题常规解决方案如下：

```
@Overridepublic List<? extends OrderDetailVO> getByUserId(Long userId) {    List<Order> orders = this.orderRepository.getByUserId(userId);    List<OrderDetailVOV2> orderDetailVOS = orders.stream()            .map(order -> new OrderDetailVOV2(OrderVO.apply(order)))            .collect(toList());    List<Long> userIds = orders.stream()            .map(Order::getUserId)            .collect(toList());    List<User> users = this.userRepository.getByIds(userIds);    Map<Long, User> userMap = users.stream()            .collect(toMap(User::getId, Function.identity(), (a, b) -> a));    for (OrderDetailVOV2 orderDetailVO : orderDetailVOS){        User user = userMap.get(orderDetailVO.getOrder().getUserId());        UserVO userVO = UserVO.apply(user);        orderDetailVO.setUser(userVO);    }    List<Long> addressIds = orders.stream()            .map(Order::getAddressId)            .collect(toList());    List<Address> addresses = this.addressRepository.getByIds(addressIds);    Map<Long, Address> addressMap = addresses.stream()            .collect(toMap(Address::getId, Function.identity(), (a, b) -> a));    for (OrderDetailVOV2 orderDetailVO : orderDetailVOS){        Address address = addressMap.get(orderDetailVO.getOrder().getAddressId());        AddressVO addressVO = AddressVO.apply(address);        orderDetailVO.setAddress(addressVO);    }    List<Long> productIds = orders.stream()            .map(Order::getProductId)            .collect(toList());    List<Product> products = this.productRepository.getByIds(productIds);    Map<Long, Product> productMap = products.stream()            .collect(toMap(Product::getId, Function.identity(), (a, b) -> a));    for (OrderDetailVOV2 orderDetailVO : orderDetailVOS){        Product product = productMap.get(orderDetailVO.getOrder().getProductId());        ProductVO productVO = ProductVO.apply(product);        orderDetailVO.setProduct(productVO);    }    return orderDetailVOS;}
```

相对上一版本，代码量和复杂性提升不少，每一处核心代码逻辑基本一致，主要包括：

1.  为每条原始数据提取关联键
    
2.  调用 DB 批量获取所有关联数据
    
3.  将数据转换为 Map
    
    形式
4.  依次遍历数据，执行内存关联
    

*   从原始数据中提取关联键
    
*   从 Map
    
    获取关联数据
*   将关联数据转换为最终结果
    
*   将关联数据进行写回原始数据
    

经过改造，单请求中数据库访问总次数 = 1（获取用户订单）+  3（关联数据数量）。数据库访问总次数大大降低，性能提升明显。

##### 1.1.3. 并行优化

聪明的伙伴可能马上会提出，上面方案还有优化空间，引入多线程并行执行 内存 join。

非常优秀，多线程引入会再次提升性能，但也提升了系统复杂性（并发安全性、资源配置等）。先准再快，建议有必要时再引入。

代码调整如下：

```
@Overridepublic List<? extends OrderDetailVO> getByUserId(Long userId) {    List<Order> orders = this.orderRepository.getByUserId(userId);    List<OrderDetailVOV2> orderDetailVOS = orders.stream()            .map(order -> new OrderDetailVOV2(OrderVO.apply(order)))            .collect(toList());    List<Callable<Void>> callables = Lists.newArrayListWithCapacity(3);    callables.add(() -> {        bindUser(orders, orderDetailVOS);        return null;    });    callables.add(() ->{        bindAddress(orders, orderDetailVOS);        return null;    });    callables.add(() -> {        bindProduct(orders, orderDetailVOS);        return null;    });    this.executorService.invokeAll(callables);    return orderDetailVOS;}private void bindProduct(List<Order> orders, List<OrderDetailVOV2> orderDetailVOS) {    List<Long> productIds = orders.stream()            .map(Order::getProductId)            .collect(toList());    List<Product> products = this.productRepository.getByIds(productIds);    Map<Long, Product> productMap = products.stream()            .collect(toMap(Product::getId, Function.identity(), (a, b) -> a));    for (OrderDetailVOV2 orderDetailVO : orderDetailVOS){        Product product = productMap.get(orderDetailVO.getOrder().getProductId());        ProductVO productVO = ProductVO.apply(product);        orderDetailVO.setProduct(productVO);    }}private void bindAddress(List<Order> orders, List<OrderDetailVOV2> orderDetailVOS) {    List<Long> addressIds = orders.stream()            .map(Order::getAddressId)            .collect(toList());    List<Address> addresses = this.addressRepository.getByIds(addressIds);    Map<Long, Address> addressMap = addresses.stream()            .collect(toMap(Address::getId, Function.identity(), (a, b) -> a));    for (OrderDetailVOV2 orderDetailVO : orderDetailVOS){        Address address = addressMap.get(orderDetailVO.getOrder().getAddressId());        AddressVO addressVO = AddressVO.apply(address);        orderDetailVO.setAddress(addressVO);    }}private void bindUser(List<Order> orders, List<OrderDetailVOV2> orderDetailVOS) {    List<Long> userIds = orders.stream()            .map(Order::getUserId)            .collect(toList());    List<User> users = this.userRepository.getByIds(userIds);    Map<Long, User> userMap = users.stream()            .collect(toMap(User::getId, Function.identity(), (a, b) -> a));    for (OrderDetailVOV2 orderDetailVO : orderDetailVOS){        User user = userMap.get(orderDetailVO.getOrder().getUserId());        UserVO userVO = UserVO.apply(user);        orderDetailVO.setUser(userVO);    }}
```

可见，复杂性又提升不少。

#### 1.2. 目标

能否做的更好？我们先列下小目标：

1.  使用 “批量 + 内存 Join” 替代 “for + 单条抓取”；
    
2.  简化开发，最好不写代码；
    
3.  具备并行执行的能力，以进一步提升性能；
    

### 2. 快速入门

#### 2.1. 添加 starter

在项目中引入 joininmemory-starter，具体如下：

```
<groupId>com.geekhalo.lego</groupId><artifactId>lego-starter-joininmemory</artifactId><version>0.0.1-SNAPSHOT</version>
```

#### 2.2. 使用 @JoinInMemory 通用注解

在结果 Bean 的属性上添加 @JoinInMemory 注解，具体如下：

```
@Datapublic class OrderDetailVOV4 extends OrderDetailVO {    private final OrderVO order;    @JoinInMemory(keyFromSourceData = "#{order.userId}",            keyFromJoinData = "#{id}",            loader = "#{@userRepository.getByIds(#root)}",            dataConverter = "#{T(com.geekhalo.lego.joininmemory.web.UserVO).apply(#root)}"        )    private UserVO user;    @JoinInMemory(keyFromSourceData = "#{order.addressId}",            keyFromJoinData = "#{id}",            loader = "#{@addressRepository.getByIds(#root)}",        dataConverter = "#{T(com.geekhalo.lego.joininmemory.web.AddressVO).apply(#root)}"    )    private AddressVO address;    @JoinInMemory(keyFromSourceData = "#{order.productId}",            keyFromJoinData = "#{id}",            loader = "#{@productRepository.getByIds(#root)}",         dataConverter = "#{T(com.geekhalo.lego.joininmemory.web.ProductVO).apply(#root)}"    )    private ProductVO product;}
```

JoinInMemory 注解定义如下：

```
@Target({ElementType.FIELD, ElementType.TYPE})@Retention(RetentionPolicy.RUNTIME)public @interface JoinInMemory {    /**     * 从 sourceData 中提取 key     * @return     */    String keyFromSourceData();    /**     * 从 joinData 中提取 key     * @return     */    String keyFromJoinData();    /**     * 批量数据抓取     * @return     */    String loader();    /**     * 结果转换器     * @return     */    String joinDataConverter() default "";    /**     * 运行级别，同一级别的 join 可 并行执行     * @return     */    int runLevel() default 10;}
```

JoinInMemory 注解属性有些多，以 UserVO  为例，解释如下：

```
@JoinInMemory(keyFromSourceData = "#{order.userId}",        keyFromJoinData = "#{id}",        loader = "#{@userRepository.getByIds(#root)}",       joinDataConverter = "#{T(com.geekhalo.lego.joininmemory.web.UserVO).apply(#root)}"    )private UserVO user;
```

<table><thead><tr><th width="183">属性</th><th width="340">含义</th></tr></thead><tbody><tr><td width="183">keyFromSourceData = "#{order.userId}"</td><td width="340">以 order 中的 userId 作为 JoinKey</td></tr><tr><td width="183">keyFromJoinData = "#{id}"</td><td width="340">以 user 的 id 作为 JoinKey</td></tr><tr><td width="183">loader = "#{@userRepository.getByIds(#root)}"</td><td width="340">将 userRepository bean 的 getByIds 方法作为加载器，其中 #root 为 joinKey 集合（user id 集合）</td></tr><tr><td width="183">joinDataConverter = "#{T(com.geekhalo.lego.joininmemory.web.UserVO).apply(#root)}"</td><td width="340">将 com.geekhalo.lego.joininmemory.web.UserVO 静态方法 apply 作为转换器，#root 指的是 User 对象</td></tr></tbody></table>

> 配置中用到大量的 SpEL 表达式，不熟悉的同学可以自行 Google；

@JoinInMemory 注解赋予 OrderDetailVOV4 自动 Join 的能力，具体使用如下：

```
@Overridepublic List<? extends OrderDetailVO> getByUserId(Long userId) {    List<Order> orders = this.orderRepository.getByUserId(userId);    List<OrderDetailVOV4> orderDetailVOS = orders.stream()            .map(order -> new OrderDetailVOV4(OrderVO.apply(order)))            .collect(toList());    // 执行关联数据抓取    this.joinService.joinInMemory(OrderDetailVOV4.class, orderDetailVOS);    return orderDetailVOS;}
```

其中，this.joinService.joinInMemory(OrderDetailVOV4.class, orderDetailVOS); 完成对 orderDetailVOS 关联数据的组装。

#### 2.3. 使用自定义注解

@JoinInMemory 注解属性过多，使用起来过于繁琐，同时有很多属性是通用的，分散到各处不利于维护，此时，建议使用 Spring AliasFor 对其进行简化。

首先，新建自定义注解

```
@Target(ElementType.FIELD)@Retention(RetentionPolicy.RUNTIME)@JoinInMemory(keyFromSourceData = "",        keyFromJoinData = "#{id}",        loader = "#{@userRepository.getByIds(#root)}",       joinDataConverter = "#{T(com.geekhalo.lego.joininmemory.web.UserVO).apply(#root)}")public @interface JoinUserVOOnId {    @AliasFor(            annotation = JoinInMemory.class    )    String keyFromSourceData();}
```

在新注解上，添加 @JoinInMemory 完成对通用属性的配置；

新增属性，使用 @AliasFor 为 @JoinInMemory 进行个性化配置；

使用自定义注解的新 OrderDetailVO 如下：

```
@Datapublic class OrderDetailVOV5 extends OrderDetailVO {    private final OrderVO order;    @JoinUserVOOnId(keyFromSourceData = "#{order.userId}")    private UserVO user;    @JoinAddressVOOnId(keyFromSourceData = "#{order.addressId}")    private AddressVO address;    @JoinProductVOOnId(keyFromSourceData = "#{order.productId}")    private ProductVO product;}
```

其他使用方式不变，相对于底层的 @JoinInMemory，配置简化不少；

#### 2.4. 增加并行处理能力

如果需要使用并行处理方案进一步提升性能，也非常简单，只需在 OrderDetailVO 上新增一个注解即可，具体如下：

```
@Data@JoinInMemoryConfig(executorType = JoinInMemeoryExecutorType.PARALLEL)public class OrderDetailVOV6 extends OrderDetailVO {    private final OrderVO order;    @JoinUserVOOnId(keyFromSourceData = "#{order.userId}")    private UserVO user;    @JoinAddressVOOnId(keyFromSourceData = "#{order.addressId}")    private AddressVO address;    @JoinProductVOOnId(keyFromSourceData = "#{order.productId}")    private ProductVO product;}
```

其他部分不变，其中 @JoinInMemoryConfig 有如下几个属性：

<table><thead><tr><th width="114">属性</th><th width="407">含义</th></tr></thead><tbody><tr><td width="114">executorType</td><td width="409">PARALLEL 并行执行；SERIAL 串行执行</td></tr><tr><td width="114">executorName</td><td width="409">执行器名称，并行执行所使用的线程池名称，默认为 defaultExecutor</td></tr></tbody></table>

#### 2.5. 性能比较

测试环境简单如下：

1.  获取订单耗时 5 ms
    
2.  获取单条记录 耗时 3 ms
    
3.  获取批量记录 耗时 10 ms
    
4.  订单列表返回记录 100 条
    

简单对比性能如下：

<table><thead><tr><th width="239">方案</th><th width="271">耗时</th></tr></thead><tbody><tr><td width="239">for + 单条抓取</td><td width="271">1130ms</td></tr><tr><td width="239">批量 + 内存 join （手工）</td><td width="271">42ms</td></tr><tr><td width="239">批量 + 内存 join （手工） + 并行</td><td width="271">16ms</td></tr><tr><td width="239">@JoinInMemory</td><td width="271">50ms</td></tr><tr><td width="239">@自定义注解</td><td width="271">48ms</td></tr><tr><td width="239">@自定义注解 + 并行</td><td width="271">24ms</td></tr></tbody></table>

#### 3. 示例代码

附上项目地址：https://gitee.com/litao851025/lego
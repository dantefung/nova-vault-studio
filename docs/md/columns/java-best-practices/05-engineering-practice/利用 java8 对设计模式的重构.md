---
title: "利用 java8 对设计模式的重构"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.cnblogs.com](https://www.cnblogs.com/yjmyzz/p/refactor-design-pattern-using-java8.html)

java8 中提供的很多新特性可以用来重构传统设计模式中的写法，下面是一些示例：

一、策略模式

![][img-0]

上图是策略模式的类图，假设我们现在要保存订单，OrderService 接口定义要做什么，而 NoSqlSaveOrderStragegy 以及 MySqlSaveOrderStrategy 则提供了二种策略，分别是保存到 nosql 数据库，以及传统的 mysql 关系型数据库，最后在 OrderServiceExecutor 中通过构造函数注入最终要使用的策略。

传统写法，这个场景至少得 4 个类，代码如下：

OrderService 接口：

```
public interface OrderService {
    void saveOrder(String orderNo);
}
```

Mysql 策略实现：

```
public class MySqlSaveOrderStrategy implements OrderService {
    @Override
    public void saveOrder(String orderNo) {
        System.out.println("order:" + orderNo + " save to mysql");
    }
}
```

Nosql 策略实现

```
public class NoSqlSaveOrderStrategy implements OrderService {
    @Override
    public void saveOrder(String orderNo) {
        System.out.println("order:" + orderNo + " save to nosql");
    }
}
```

使用策略的辅助 " 容器 "

```
public class OrderServiceExecutor {
 
    private final OrderService service;
 
    public OrderServiceExecutor(OrderService service) {
        this.service = service;
    }
 
    public void save(String orderNo) {
        this.service.saveOrder(orderNo);
    }
 
}
```

运行测试类：

```
public class OrderServiceTest {
    public static void main(String[] args) {
        OrderServiceExecutor executor1 = new OrderServiceExecutor(new MySqlSaveOrderStrategy());
        executor1.save("001");
        OrderServiceExecutor executor2 = new OrderServiceExecutor(new NoSqlSaveOrderStrategy());
        executor2.save("002");
    }
}
```

重构后，可以省去 2 个策略实现类，代码如下：

```
public static void main(String[] args) {
    OrderServiceExecutor executor1 = new OrderServiceExecutor((String orderNo) -> System.out.println("order:" + orderNo + " save to mysql"));
    executor1.save("001");
 
    OrderServiceExecutor executor2 = new OrderServiceExecutor((String orderNo) -> System.out.println("order:" + orderNo + " save to nosql"));
    executor2.save("002");
}
```

二、模板方法

类图如下，核心思路是把一些通用的标准方法，在抽象父类里仅定义方法签名，实现逻辑交给子类。比如：会员系统中，每个商家都会有一些营销活动，需要推送某种信息给会员，但是不同的商家推送的内容可能不同，有些需要推送优惠券，有些需要积分通知。

![][img-1]

抽象模板类：

```
public abstract class AbstractPushTemplate {
 
    public void push(int customerId, String shopName) {
        System.out.println(" 准备推送...");
        execute(customerId, shopName);
        System.out.println(" 推送完成\n");
    }
 
    abstract protected void execute(int customerId, String shopName);
}
```

优惠券的具体模板

```
public class PushCouponTemplate extends AbstractPushTemplate {
 
    @Override
    protected void execute(int customerId, String shopName) {
        System.out.println(" 会员:" + customerId + ", 你好，" + shopName + " 送您一张优惠券 ");
    }
}
```

积分的具体模板

```
public class PushScoreTemplate extends AbstractPushTemplate {
 
    @Override
    protected void execute(int customerId, String shopName) {
        System.out.println(" 会员:" + customerId + ", 你好，" + shopName + " 送您 10 个积分 ");
    }
}
```

使用示例：

```
AbstractPushTemplate template1 = new PushCouponTemplate();
template1.push(1, " 糖果店 ");
 
AbstractPushTemplate template2 = new PushScoreTemplate();
template2.push(1, " 服装店 ");
```

显然如果模板的实现方式越多，子类就越多。使用 java8 重构后，可以把上面的 3 个模板（包括抽象类模板）减少到 1 个，参考下面：

```
public class PushTemplateLambda {
 
    public void push(int customerId, String shopName, Consumer<Object[]> execute) {
        System.out.println(" 准备推送...");
        Object[] param = new Object[]{customerId, shopName};
        execute.accept(param);
        System.out.println(" 推送完成\n");
    }
}
```

借助 `Consumer<T>` 这个 function interface，可以省去实现子类，具体的实现留到使用时再来决定，如：

```
new PushTemplateLambda().push(1, " 糖果店 ", (Object[] obj) -> {
    System.out.println(" 会员:" + obj[0] + ", 你好，" + obj[1] + " 送您一张优惠券 ");
});
 
new PushTemplateLambda().push(1, " 服装店 ", (Object[] obj) -> {
    System.out.println(" 会员:" + obj[0] + ", 你好，" + obj[1] + " 送您 10 个积分 ");
});
```

三、观察者模式

![][img-2]

思路：基于某个 Subject 主题，然后一堆观察者 Observer 注册到主题上，有事件发生时，subject 根据注册列表，去通知所有的 observer。

Observer 接口:

```
public interface Observer {
    void notify(String orderNo);
}
```

Subject 接口:

```
public interface Subject {
    void registerObserver(Observer o);
    void notifyAllObserver(String orderNo);
}
```

Subject 接口实现：

```
public class SubjectImpl implements Subject {
    private final List<Observer> list = new ArrayList<>();
    @Override
    public void registerObserver(Observer o) {
        list.add(o);
    }
    @Override
    public void notifyAllObserver(String orderNo) {
        list.forEach(c -> c.notify(orderNo));
    }
}
```

观察者的二个实现：

OrderObserver:

```
public class OrderObserver implements Observer {
    @Override
    public void notify(String orderNo) {
        System.out.println(" 订单 " + orderNo + " 状态更新为【已支付】");
    }
}
```

StockObserver:

```
public class StockObserver implements Observer {
    @Override
    public void notify(String orderNo) {
        System.out.println(" 订单 " + orderNo + " 已通知库房发货！");
    }
}
```

测试一把：

```
static void test1() {
    Subject subject = new SubjectImpl();
    subject.registerObserver(new OrderObserver());
    subject.registerObserver(new StockObserver());
    subject.notifyAllObserver("001");
}
```

用 java8 重构后，接口可以提供默认实现方法，我们弄一个新的主题接口

```
public interface NewSubject {
 
    List<Observer> list = new ArrayList<>();
 
    default void registerObserver(Observer o) {
        list.add(o);
    }
 
    default void nofityAllObserver(String orderNo) {
        list.forEach(c -> c.notify(orderNo));
    }
}
```

使用:

```
static void test2() {
    NewSubject subject = new NewSubject() {
    };
    subject.registerObserver((String orderNo) -> System.out.println(" 订单 " + orderNo + " 状态更新为【已支付】"));
    subject.registerObserver((String orderNo) -> System.out.println(" 订单 " + orderNo + " 已通知库房发货！"));
    subject.nofityAllObserver("002");
}
```

只用 2 个接口实现了观察者模式。　　

四、责任链 / 职责链模式

![][img-3]

核心思想：每个处理环节，都有一个 “指针” 指向下一个处理者，类似链表一样。

Processor 接口：

```
public interface Processor {
 
    Processor getNextProcessor();
 
    void process(String param);
}
```

抽象实现类

```
public abstract class AbstractProcessor implements Processor {
 
    private Processor next;
 
    public AbstractProcessor(Processor processor) {
        this.next = processor;
    }
 
    @Override
    public Processor getNextProcessor() {
        return next;
    }
 
    @Override
    public abstract void process(String param);
}
```

定义 2 个具体的实现

```
public class ProcessorImpl1 extends AbstractProcessor {
 
    public ProcessorImpl1(Processor processor) {
        super(processor);
    }
 
    @Override
    public void process(String param) {
        System.out.println("processor 1 is processing:" + param);
        if (getNextProcessor() != null) {
            getNextProcessor().process(param);
        }
    }
}
```

及

```
public class ProcessorImpl2 extends AbstractProcessor {
 
    public ProcessorImpl2(Processor next) {
        super(next);
    }
 
    @Override
    public void process(String param) {
        System.out.println("processor 2 is processing:" + param);
        if (getNextProcessor() != null) {
            getNextProcessor().process(param);
        }
    }
}
```

使用示例：

```
static void test1() {
    Processor p1 = new ProcessorImpl1(null);
    Processor p2 = new ProcessorImpl2(p1);
    p2.process("something happened");
}
```

用 java8 重构后，只需要一个新接口

```
@FunctionalInterface
public interface NewProcessor {
    Consumer<String> process(String param);
}
```

同样的效果，可以写得很简洁：

```
static void test2() {
    Consumer<String> p1 = param -> System.out.println("processor 1 is processing:" + param);
    Consumer<String> p2 = param -> System.out.println("processor 2 is processing:" + param);
    p2.andThen(p1).accept("something happened");
}
```

andThen 天然就是 getNextProcessor 的另一种表达。

重要提示：什么时候该用 lambda，什么时候不用，这是要看情况的，如果处理逻辑相对比较简单，可以用 lamdba 来重构，以便让代码更简洁易读，如果处理逻辑很复杂，应该还是用 “类”。

[img-0]:images/利用-java8-对设计模式的重构/p01.png

[img-1]:images/利用-java8-对设计模式的重构/p02.png

[img-2]:images/利用-java8-对设计模式的重构/p03.png

[img-3]:images/利用-java8-对设计模式的重构/p04.png

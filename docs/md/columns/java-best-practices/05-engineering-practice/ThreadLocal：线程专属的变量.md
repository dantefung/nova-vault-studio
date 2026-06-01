---
title: "ThreadLocal：线程专属的变量"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/ba_bTARwnmowgjlZKiiIxg)

一、ThreadLocal 简介
----------------

**ThreadLocal 是 java 提供的一个方便对象在本线程内不同方法中传递和获取的类**。用它定义的变量，仅在本线程中可见和维护，不受其他线程的影响，与其他线程相互隔离。

那 ThreadLocal 到底解决了什么问题，又适用于什么样的场景？

> This class provides thread-local variables. These variables differ from their normal counterparts in that each thread that accesses one (via its get or set method) has its own, independently initialized copy of the variable. ThreadLocal instances are typically private static fields in classes that wish to associate state with a thread (e.g., a user ID or Transaction ID). Each thread holds an implicit reference to its copy of a thread-local variable as long as the thread is alive and the ThreadLocal instance is accessible; after a thread goes away, all of its copies of thread-local instances are subject to garbage collection (unless other references to these copies exist).

核心意思是

> ThreadLocal 提供了线程本地的实例。它与普通变量的区别在于，每个使用该变量的线程都会初始化一个完全独立的实例副本。ThreadLocal 变量通常被 private static 修饰。当一个线程结束时，它所使用的所有 ThreadLocal 相对的实例副本都可被回收。

总的来说，**ThreadLocal 适用于每个线程需要自己独立的实例且该实例需要在多个方法中被使用，也即变量在线程间隔离而在方法或类间共享的场景**。后文会通过实例详细阐述该观点。另外，该场景下，并非必须使用 ThreadLocal ，其它方式完全可以实现同样的效果，只是 ThreadLocal 使得实现更简洁。

二、ThreadLocal 使用
----------------

ThreadLocal 通过 set 方法可以给变量赋值，通过 get 方法获取变量的值。当然，也可以在定义变量时通过 `ThreadLocal.withInitial` 方法给变量赋初始值，或者定义一个继承 ThreadLocal 的类，然后重写 initialValue 方法。

下面通过如下代码说明 ThreadLocal 的使用方式：

```
public class TestThreadLocal{    private static ThreadLocal<StringBuilder> builder = ThreadLocal.withInitial(StringBuilder::new);    public static void main(String[] args)    {        for (int i = 0; i < 5; i++)        {            new Thread(() -> {                String threadName = Thread.currentThread().getName();                for (int j = 0; j < 3; j++)                {                    append(j);                    System.out.printf("%s append %d, now builder value is %s, ThreadLocal instance hashcode is %d, ThreadLocal instance mapping value hashcode is %d\n", threadName, j, builder.get().toString(), builder.hashCode(), builder.get().hashCode());                }                change();                System.out.printf("%s set new stringbuilder, now builder value is %s, ThreadLocal instance hashcode is %d, ThreadLocal instance mapping value hashcode is %d\n", threadName, builder.get().toString(), builder.hashCode(), builder.get().hashCode());            }, "thread-" + i).start();        }    }    private static void append(int num) {        builder.get().append(num);    }    private static void change() {        StringBuilder newStringBuilder = new StringBuilder("HelloWorld");        builder.set(newStringBuilder);    }}
```

在例子中，定义了一个 builder 的 ThreadLocal 对象，然后启动 5 个线程，分别对 builder 对象进行访问和修改操作，这两个操作放在两个不同的函数 append、change 中进行，两个函数访问 builder 对象也是直接获取，而不是放入函数的入参中传递进来。

代码输出如下:

```
thread-0 append 0, now builder value is 0, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 566157654thread-0 append 1, now builder value is 01, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 566157654thread-4 append 0, now builder value is 0, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 654647086thread-3 append 0, now builder value is 0, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1803363945thread-2 append 0, now builder value is 0, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1535812498thread-1 append 0, now builder value is 0, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 2075237830thread-2 append 1, now builder value is 01, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1535812498thread-3 append 1, now builder value is 01, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1803363945thread-4 append 1, now builder value is 01, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 654647086thread-0 append 2, now builder value is 012, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 566157654thread-0 set new stringbuilder, now builder value is HelloWorld, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1773033190thread-4 append 2, now builder value is 012, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 654647086thread-4 set new stringbuilder, now builder value is HelloWorld, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 700642750thread-3 append 2, now builder value is 012, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1803363945thread-3 set new stringbuilder, now builder value is HelloWorld, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1706743158thread-2 append 2, now builder value is 012, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1535812498thread-2 set new stringbuilder, now builder value is HelloWorld, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1431127699thread-1 append 1, now builder value is 01, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 2075237830thread-1 append 2, now builder value is 012, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 2075237830thread-1 set new stringbuilder, now builder value is HelloWorld, ThreadLocal instance hashcode is 796465865, ThreadLocal instance mapping value hashcode is 1970695360
```

* 从输出中 `1~6` 行可以看出，不同线程访问的是同一个 builder 对象（不同线程输出的 `ThreadLocal instance hashcode` 值相同），但是每个线程获得的 builder 对象存储的实例 StringBuilder 不同（不同线程输出的 `ThreadLocal instance mapping value hashcode` 值不相同）。

* 从输出中`1~2`、`9~10` 行可以看出，同一个线程中修改 builder 对象存储的实例的值时，并不会影响到其他线程的 builder 对象存储的实例（thread-4 线程改变存储的 StringBuilder 的值并不会引起 thread-0 线程的 `ThreadLocal instance mapping value hashcode` 值发生改变）

* 从输出中 `9~13` 行可以看出，一个线程对 ThreadLocal 对象存储的值发生改变时，并不会影响其他的线程（thread-0 线程调用 set 方法改变本线程 ThreadLocal 存储的对象值，本线程的 `ThreadLocal instance mapping value hashcode` 发生改变，但是 thread-4 的 `ThreadLocal instance mapping value hashcode` 并没有因此改变）。

三、ThreadLocal 原理
----------------

ThreadLocal 能在每个线程间进行隔离，**其主要是靠在每个 Thread 对象中维护一个 ThreadLocalMap 来实现的**。因为是线程中的对象，所以对其他线程不可见，从而达到隔离的目的。那为什么是一个 Map 结构呢。主要是因为一个线程中可能有多个 ThreadLocal 对象，这就需要一个集合来进行存储区分，而用 Map 可以更快地查找到相关的对象。ThreadLocalMap 是 ThreadLocal 对象的一个静态内部类，内部维护一个 Entry 数组，实现类似 Map 的 get 和 put 等操作，为简单起见，可以将其看做是一个 Map，其中 key 是 ThreadLocal 实例，value 是 ThreadLocal 实例对象存储的值。

![][img-0]ThreadLocalMap

四、ThreadLocal 适用场景
------------------

如上文所述，ThreadLocal 适用于如下场景：

* 每个线程需要有自己单独的实例，如实现每个线程单例类或每个线程上下文信息（例如事务 ID）。

* ThreadLocal 适用于变量在线程间隔离且在方法间共享的场景，提供了另一种扩展 Thread 的方法。如果要保留信息或将信息从一个方法调用传递到另一个方法，则可以使用 ThreadLocal 进行传递。

* 由于不需要修改任何方法，因此可以提供极大的灵活性。

### 1、案例一

这里一个处理 flag 的类，通过 ThreadLocal 使用，可以保证每个请求都拥有唯一的一个追踪标记。

```java
public class TestFlagHolder {
	private final static ThreadLocal<String> TEST_FLAG = new ThreadLocal<>();

	public static void set(String value) {
		TEST_FLAG.set(value);
	}

	public static String get() {
		return TEST_FLAG.get();
	}

	public static String get4log() {
		if (TEST_FLAG.get() == null) {return "-";}
		return TEST_FLAG.get();
	}

	public static void remove() {
		TEST_FLAG.remove();
	}
}
```

### 2、案例二

在同一线程中 trace 信息的传递：

```java
ThreadLocal<String> traceContext = new ThreadLocal<>();

String traceId = Tracer.startServer();
traceContext.set(traceId) //生成trace信息 传入threadlocal
...
Tracer.startClient(traceContext.get()); //从threadlocal获取trace信息
Tracer.endClient();
...
Tracer.endServer();
```

### 3、案例三

给同一个请求的每一行日志增加一个相同的标记。这样，只要拿到这个标记就可以查询到这个请求链路上所有步骤的耗时了，我们把这个标记叫做 requestId，我们可以在程序的入口处生成一个 requestId，然后把它放在线程的上下文中，这样就可以在需要时随时从线程上下文中获取到 requestId 了。

简单的代码实现就像下面这样：

```java
String requestId = UUID.randomUUID().toString();
ThreadLocal<String> tl = new ThreadLocal<String>(){
    @Override
    protected String initialValue() {
        return requestId;
    }
}; //requestId存储在线程上下文中
long start = System.currentTimeMillis();
processA();
Logs.info("rid : " + tl.get() + ", process A cost " + (System.currentTimeMillis() - start)); // 日志中增加requestId
start = System.currentTimeMillis();
processB();
Logs.info("rid : " + tl.get() + ", process B cost " + (System.currentTimeMillis() - start));
start = System.currentTimeMillis();
processC();
Logs.info("rid : " + tl.get() + ", process C cost " + (System.currentTimeMillis() - start));
```

有了 requestId，你就可以清晰地了解一个调用链路上的耗时分布情况了。

五、小结
----

无论是单体系统还是微服务化架构，无论是链路打标还是服务追踪，你都需要在系统中增加 TraceId，这样可以将你的链路串起来，给你呈现一个完整的问题场景。如果 TraceId 可以在客户端上生成，在请求业务接口的时候传递给服务端，那么就可以把客户端的日志体系也整合进来，对于问题的排查帮助更大。

同时，在全链路压测框架中，Trace 信息的传递功能是基于 ThreadLocal 的。但实际业务中可能会使用异步调用，这样就会丢失 Trace 信息，破坏了链路的完整性。**所以在实际的项目建议大家不要轻意使用 ThreadLocal**。

参考资料：

* [1]：《高并发系统设计 40 问》

* [2]：https://juejin.cn/post/6844904016288317448#heading-6

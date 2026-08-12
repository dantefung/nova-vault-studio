---
title: "调用链跨线程传递 ThreadLocal 对象对比"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [zuozewei.blog.csdn.net](https://zuozewei.blog.csdn.net/article/details/115423183)

> 文章目录一、前言二、ThreadLocal1、ThreadLocal 关键 API2、ThreadLocal 存储结构 3、ThreadLocal 局限性三、InheritableThreadLocal1......

 

### 文章目录

*   *   [一、前言](#_3)
    *   [二、ThreadLocal](#ThreadLocal_6)
    *   *   [1、ThreadLocal 关键 API](#1ThreadLocal__API_7)
        *   [2、ThreadLocal 存储结构](#2ThreadLocal__19)
        *   [3、ThreadLocal 局限性](#3ThreadLocal__28)
    *   [三、InheritableThreadLocal](#InheritableThreadLocal_70)
    *   *   [1、InheritableThreadLocal 的特性](#1InheritableThreadLocal__111)
        *   [2、InheritableThreadLocal 局限性](#2InheritableThreadLocal__148)
    *   [四、TransmittableThreadLocal](#TransmittableThreadLocal_236)
    *   *   [1、TransmittableThreadLocal 实现原理](#1TransmittableThreadLocal__329)
        *   [2、整个过程的完整时序图](#2_388)
    *   [五、小结](#_401)

一、前言
----

说起本地线程专属变量，大家首先会想到的是 JDK 默认提供的 [ThreadLocal](https://so.csdn.net/so/search?q=ThreadLocal&spm=1001.2101.3001.7020)，用来存储在整个链路中都需要访问的数据，并且是线程安全的。由于在落地全链路压测的过程中，一个基本并核心的功能需求是流量标记需要在整个链路中进行传递，**那么线程上下文环境成为解决这个问题最合适的技术**。

二、ThreadLocal
-------------

### 1、ThreadLocal 关键 [API](https://so.csdn.net/so/search?q=API&spm=1001.2101.3001.7020)

ThreadLocal 对外提供的关键 API 如下：

```
//从线程上下文中获取值
public T get() ;

//将值设入线程上下文中，供同一线程后续使用
public void set(T value) ;

//清除线程上下文
public void remove() ;
```

### 2、ThreadLocal [存储结构](https://so.csdn.net/so/search?q=%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%84&spm=1001.2101.3001.7020)

上述 API 使用简单，关键是要理解 ThreadLocal 的内部存储结构：  
![][img-0]

ThreadLocal 的存储结构是这样的：

*   每个 Thread 维护一个 ThreadLocalMap 映射表，这个映射表的 key 是 ThreadLocal 实例本身，value 是真正需要存储的 Object。
*   **也就是说 ThreadLocal 本身并不存储值，它只是作为一个 key 来让线程从 ThreadLocalMap 获取 value**。
*   ThreadLocal 能在每个线程间进行隔离，其主要是靠在每个 Thread 对象中维护一个 ThreadLocalMap 来实现的。

### 3、ThreadLocal 局限性

ThreadLocal 无法在父子线程之间传递，示例代码如下：

```
public class ThreadLocalDemo {
    private static final ThreadLocal<Integer> requestIdThreadLocal = new ThreadLocal<>();
    public static void main(String[] args) {
        Integer reqId = new Integer(5);
        ThreadLocalDemo threadLocalExample = new ThreadLocalDemo();
        threadLocalExample.setRequestId(reqId);
    }

    public void setRequestId(Integer requestId) {
        requestIdThreadLocal.set(requestId);
        doBussiness();
    }

    public void doBussiness() {
        System.out.println(" 首先打印 requestId:" + requestIdThreadLocal.get());
        (new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(" 子线程启动 ");
                System.out.println(" 在子线程中访问 requestId:" + requestIdThreadLocal.get());
            }
        })).start();
    }
}
```

在 doBusiness 方法又启动了一个子线程来执行业务 (模拟异步处理)

运行结果如下：

```
首先打印 requestId:5
子线程启动
在子线程中访问 requestId:null
```

从结果上来看，**在子线程中无法访问在父线程中设置的本地线程变量**，即子线程中无法获取到 ThreadLocal 中的 value，从上面的存储原理分析中，已经很明白了，子线程拥有自己的 ThreadLocalMap，自然无法获取父线程 ThreadLocalMap 中的值。

但往往很多操作是需要异步操作的，因此父子线程直接共享 ThreadLocal 中的值是有必要的，那我们该如何来解决该问题呢？

为了解决该问题，JDK 引入了另外一个线程本地变量实现类 InheritableThreadLocal，下面介绍以下 InheritableThreadLocal，看下它是如何实现父子线程之间共享线程上下文的？

三、InheritableThreadLocal
------------------------

由于 ThreadLocal 在父子线程交互中子线程无法访问到存储在父线程中的值，无法满足某些场景的需求，例如链路跟踪，例如如下场景：  
![][img-1]  
为了解决上述问题，JDK 引入了 InheritableThreadLocal，即子线程可以访问父线程中的线程本地变量，更严谨的说法是子线程可以访问在创建子线程时父线程当时的本地线程变量，**因为其实现原理就是在创建子线程将父线程当前存在的本地线程变量拷贝到子线程的本地线程变量中**。  
ThreadLocal 的拷贝发生在：当前线程生成子线程实例的时候。如果当前线程的 inheritableThreadLocals 属性不为空，就会把该属性拷贝到子线程的 inheritableThreadLocals 属性中。

Thread 的 init 相关逻辑如下：

```
if (parent.inheritableThreadLocals != null)
    this.inheritableThreadLocals =        ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
```

赋值拷贝代码如下：

```
private ThreadLocalMap(ThreadLocalMap parentMap) {
            Entry[] parentTable = parentMap.table;
            int len = parentTable.length;
            setThreshold(len);
            table = new Entry[len];

            for (int j = 0; j < len; j++) {
                Entry e = parentTable[j];
                if (e != null) {
                    @SuppressWarnings("unchecked")
                    ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
                    if (key != null) {
                        Object value = key.childValue(e.value);
                        Entry c = new Entry(key, value);
                        int h = key.threadLocalHashCode & (len - 1);
                        while (table[h] != null)
                            h = nextIndex(h, len);
                        table[h] = c;
                        size++;
                    }
                }
            }
        }
```

类似于 Map 的复制，只不过其在 Hash 冲突时，不是使用链表结构，而是直接在数组中找下一个为 null 的槽位。

> 温馨提示：  
> 子线程默认拷贝父线程的方式是浅拷贝，如果需要使用深拷贝，需要使用自定义 ThreadLocal，继承 InheritableThreadLocal 并重写 childValue 方法。

### 1、InheritableThreadLocal 的特性

示例代码如下：

```
public class InheritableThreadLocalDemo {
    private static final InheritableThreadLocal<Integer> requestIdThreadLocal = new InheritableThreadLocal<>();
    public static void main(String[] args) {
        Integer reqId = new Integer(5);
        InheritableThreadLocalDemo threadLocalExample = new InheritableThreadLocalDemo();
        threadLocalExample.setRequestId(reqId);
    }

    public void setRequestId(Integer requestId) {
        requestIdThreadLocal.set(requestId);
        doBussiness();
    }

    public void doBussiness() {
        System.out.println(" 首先打印 requestId:" + requestIdThreadLocal.get());
        (new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(" 子线程启动 ");
                System.out.println(" 在子线程中访问 requestId:" + requestIdThreadLocal.get());
            }
        })).start();
    }
}
```

运行结果如下：

```
首先打印 requestId:5
子线程启动
在子线程中访问 requestId:5
```

符合预期，在子线程中如愿访问到了在主线程中设置的本地环境变量。

### 2、InheritableThreadLocal 局限性

InheritableThreadLocal 的核心思想即：**让我们可以在父线程创建子线程的时候将 ThreadLocal 中的值传递给子线程**。 在大部分场景下，业务应用不可能每一个异步请求都 new 一个单独的子线程来处理（内存会被撑爆），因此需要使用到线程池，线程池中即存在线程复用的情况，假设线程池中后面创建的线程中的上下文数据否都来自线程池中被复用的线程，**这就出现父子线程的上下文变量复制混乱的情况**。

示例代码如下：

```
public class InheritableThreadLocalWeaknessDemo {

    private static final InheritableThreadLocal<Integer> INHERITABLE_THREAD_LOCAL = new InheritableThreadLocal<>();
    //模拟业务线程池
    private static final ExecutorService threadPool = Executors.newFixedThreadPool(5);

    public static void main(String[] args) throws InterruptedException {
        //模拟同时 10 个 web 请求，一个请求一个线程
        for (int i = 0; i < 10; i++) {
            new TomcatThread(i).start();
        }

        Thread.sleep(3000);
        threadPool.shutdown();
    }

    static class TomcatThread extends Thread{
        //线程下标
        int index;

        public TomcatThread(int index) {
            this.index = index;
        }

        @Override
        public void run() {
            String parentThreadName = Thread.currentThread().getName();
            //父线程中将 index 值塞入线程上下文变量
            System.out.println( parentThreadName+ ":" + index);
            INHERITABLE_THREAD_LOCAL.set(index);

            threadPool.submit(new BusinessThread(parentThreadName));
        }
    }

    static class BusinessThread implements Runnable{
        //父进程名称
        private String parentThreadName;

        public BusinessThread(String parentThreadName) {
            this.parentThreadName = parentThreadName;
        }

        @Override
        public void run() {
            System.out.println("parent:"+parentThreadName+":"+INHERITABLE_THREAD_LOCAL.get());
        }
    }
}
```

代码模拟了同时有 10 个 web 请求 (启动 10 个线程)，每个线程内部又向业务线程池中提交一个异步任务。

执行结果如所示：

```
Thread-0:0
Thread-3:3
Thread-2:2
Thread-1:1
Thread-4:4
Thread-5:5
Thread-6:6
Thread-7:7
Thread-8:8
Thread-9:9
parent:Thread-6:6
parent:Thread-0:0
parent:Thread-4:4
parent:Thread-7:0
parent:Thread-3:6
parent:Thread-8:8
parent:Thread-9:4
parent:Thread-1:6
parent:Thread-2:2
parent:Thread-5:0
```

从这里可以看出，**子线程中输出的父线程名称与下标 index 无法一一对应，在子线程中出现出现了线程本地变量混乱的现象，在链路跟踪与全链路压测出现这种情况是致命的**。

怎么解决这个问题呢？  
**TransmittableThreadLocal ” 闪亮登场 “。**

四、TransmittableThreadLocal
--------------------------

TransmittableThreadLocal 是阿里开源的库，继承了 InheritableThreadLocal，**优化了在使用线程池等会池化复用线程的情况下传递 ThreadLocal 的使用。**

官网地址：[https://github.com/alibaba/transmittable-thread-local](https://github.com/alibaba/transmittable-thread-local)

实践是检验整理的唯一标准，我们还是以上面的示例来进行验证，看看 TransmittableThreadLocal 是否支持上述场景：

首先引包：

```
<dependency>
     <groupId>com.alibaba</groupId>
     <artifactId>transmittable-thread-local</artifactId>
     <version>2.12.0</version>
 </dependency>
```

示例代码如下：

```
public class TransmittableThreadLocalDemo {

    private static final TransmittableThreadLocal<Integer> INHERITABLE_THREAD_LOCAL = new TransmittableThreadLocal<>();
    //模拟业务线程池
    private static final ExecutorService threadPool = Executors.newFixedThreadPool(5);

    public static void main(String[] args) throws InterruptedException {
        //模拟同时 10 个 web 请求，一个请求一个线程
        for (int i = 0; i < 10; i++) {
            new TomcatThread(i).start();
        }

        Thread.sleep(3000);
        threadPool.shutdown();
    }

    static class TomcatThread extends Thread{
        //线程下标
        int index;

        public TomcatThread(int index) {
            this.index = index;
        }

        @Override
        public void run() {
            String parentThreadName = Thread.currentThread().getName();
            //父线程中将 index 值塞入线程上下文变量
            System.out.println( parentThreadName+ ":" + index);
            INHERITABLE_THREAD_LOCAL.set(index);

            threadPool.submit(TtlRunnable.get(new BusinessThread(parentThreadName)));
        }
    }

    static class BusinessThread implements Runnable{
        //父进程名称
        private String parentThreadName;

        public BusinessThread(String parentThreadName) {
            this.parentThreadName = parentThreadName;
        }

        @Override
        public void run() {
            System.out.println("parent:"+parentThreadName+":"+INHERITABLE_THREAD_LOCAL.get());
        }
    }
}
```

运行结果如下：

```
Thread-0:0
Thread-3:3
Thread-2:2
Thread-1:1
Thread-4:4
Thread-5:5
Thread-6:6
Thread-7:7
Thread-8:8
Thread-9:9
parent:Thread-6:6
parent:Thread-0:0
parent:Thread-4:4
parent:Thread-7:0
parent:Thread-3:6
parent:Thread-8:8
parent:Thread-9:4
parent:Thread-1:6
parent:Thread-2:2
parent:Thread-5:0
```

我们可以看到，子线程中输出内容与父线程一致，**没有出现线程上下文变量复制混乱的情况**。

### 1、TransmittableThreadLocal 实现原理

> JDK 的 I nheritableThreadLocal 类可以完成父线程到子线程的值传递。但对于使用线程池等会池化复用线程的组件的情况，线程由线程池创建好，并且线程是池化起来反复使用的；这时父子线程关系的 ThreadLocal 值传递已经没有意义，应用需要的实际上是把 任务提交给线程池时的 ThreadLocal 值传递到 任务执行时。

TransmittableThreadLocal 类继承并加强 InheritableThreadLocal 类，解决上述的问题。

相比`InheritableThreadLocal`，添加了：

*   protected 方法 copy  
    用于定制 任务提交给线程池 的 ThreadLocal 值传递到任务执行时的拷贝行为，缺省传递的是引用。
*   protected 方法 `beforeExecute`/`afterExecute`  
    执行任务 (`Runnable`/Callable`) 的前 / 后的生命周期回调，缺省是空操作。

简单来说，有个专门的 TtlRunnable 和 TtlCallable 包装类，用于读取原 Thread 的 ThreadLocal 对象及值并存于 Runnable/Callable 中，在执行 run 或者 call 方法的时候再将存于 Runnable/Callable 中的 ThreadLocal 对象和值读取出来，存入调用 run 或者 call 的线程中。

以 TtlRunnable 为例，构造函数如下:

```
private final AtomicReference<Object> capturedRef;
private final Runnable runnable;
private final boolean releaseTtlValueReferenceAfterRun;

private TtlRunnable(Runnable runnable, boolean releaseTtlValueReferenceAfterRun) {
    //从父类 capture 复制到本类
    this.capturedRef = new AtomicReference<>(capture());
    this.runnable = runnable; //提交的 runnable 对象
    this.releaseTtlValueReferenceAfterRun = releaseTtlValueReferenceAfterRun;
}
```

capture 函数的复制过程如下:

```
@Nonnull
        public static Object capture() {
            Map<TransmittableThreadLocal<?>, Object> captured = new HashMap<TransmittableThreadLocal<?>, Object>();
            for (TransmittableThreadLocal<?> threadLocal : holder.get().keySet()) {
                captured.put(threadLocal, threadLocal.copyValue());
            }
            return captured;
        }
```

其中 holder 记录了当前 Thread 绑定了哪些 TransmittableThreadLocal 对象。captured 保存了父线程 ThreadLocal 的值。

接着任务提交到线程池，线程开始运行时，取出保存在 captured 中的父线程 ThreadLocal 值并重新 set。即将父线程值传递到了任务执行时。

```
@Override
public void run() {
    Object captured = capturedRef.get();
    if (captured == null || releaseTtlValueReferenceAfterRun && !capturedRef.compareAndSet(captured, null)) {
        throw new IllegalStateException("TTL value reference is released after run!");
    }

    Object backup = replay(captured);
    try {
        runnable.run();
    } finally {
        restore(backup);
    }
}
```

这样 TransmittableThreadLocal 就解决了在线程池场景下的 ThreadLocal 对象传递。

### 2、整个过程的完整[时序图](https://so.csdn.net/so/search?q=%E6%97%B6%E5%BA%8F%E5%9B%BE&spm=1001.2101.3001.7020)

![][img-2]  
根据时序图的步骤来说明：

1.  createTtl()、setTtlValue() 其实就是调用 TransmittableThreadLocal 的线程上下文值，ttlValue 就是上下文中的值；
2.  createBizTaskRunnable 就是执行业务的线程，createTtlRunnableWrapper(Runnable) 就是使用 TtlRunnable.get() 来封装了 Runnable，捕获操作 captureAllTtlValues 就是发生这里；
3.  下面就进入到了时序图中 captureAllTtlValues、get()、copy(T value) 的实现；
4.  submitTtlRunnableToThreadPool、run() 对应线程池开始执行任务；
5.  接下来就进入到了时序图中的 beforeExecute、replayCapturedTtlValues() 方法；
6.  时序图中 run、useValueInTtl 即对应到业务 Runnable 中的实现，因为此时已经完成重放操作，子线程中可以使用父线程的 ttlValue；
7.  后面就是使用备份的子线程上下变量 backup 来恢复子线程的上下文环境，避免因为重放导致子线程的上下文环境被污染。对应到时序图中的 restoreTtlValueBeforeReplay，afterExecute。

源码如有兴趣的可以自己去看下。

五、小结
----

本文简单介绍了 ThreadLocal、InheritableThreadLocal、TransmittableThreadLocal 的实现原理，并从 ThreadLocal、InheritableThreadLocal 的 局限性，**最终引出 TransmittableThreadLocal，为全链路压测中流量标记的透传打下坚实的基础**。

示例代码：

*   https://github.com/zuozewei/blog-example/tree/master/Performance-testing/04-full-link/springboot-threadlocal-demo

参考资料：

*   [1]：https://cloud.tencent.com/developer/article/1478240
*   [2]：https://fredal.xin/async-threadlocal-in-all-link-tracking
*   [3]：http://www.cxyzjd.com/article/hosaos/102679619

 

![][img-3] 7DGroup ![][img-4] 微信公众号 ![][img-5] 性能 / 测试开发 / 运维，关注发现更多干货。

[img-0]:images/调用链跨线程传递-ThreadLocal-对象对比/p01.png

[img-1]:images/调用链跨线程传递-ThreadLocal-对象对比/p02.png

[img-2]:images/调用链跨线程传递-ThreadLocal-对象对比/p03.png

[img-3]:images/调用链跨线程传递-ThreadLocal-对象对比/p04.jpg

[img-4]:images/调用链跨线程传递-ThreadLocal-对象对比/p05.png

[img-5]:images/调用链跨线程传递-ThreadLocal-对象对比/p06.png
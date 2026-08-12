---
title: "搜索模块 - redis 配置说明"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [wiki.int.zuzuche.info](https://wiki.int.zuzuche.info/pages/viewpage.action?pageId=703266934)

> RedissonClient 多实例说明

相关阅读:
-----

[RedissonClient 多实例说明](https://wiki.int.zuzuche.info/pages/viewpage.action?pageId=583827495)

[JetCache 支持 Redis 作为二级缓存](https://wiki.int.zuzuche.info/pages/viewpage.action?pageId=659292345)

[JetCache 的 Json 序列化方案](https://wiki.int.zuzuche.info/pages/viewpage.action?pageId=583827513)

JetCache 配置用途解释
---------------

  
![][img-0]

搜索默认 redisson 连接健康检查处理:
-----------------------

默认 redisson 指代  jetCache.remote.default.redissonClient=xxxx 配置的客户端![][img-1]

(非必读) 必须不健康的 redis 连接工厂的 beanName, 采用逗号分割 (如有需求)
------------------------------------------------

如果业务上，有特殊的 redis 连接在健康检查必须要不健康，则可以在 apollo 上配置

```
# 必须不健康的redis连接工厂的beanName,采用逗号分割
ercp.search.rcfUnHealth.beanNames: yyyRedissonConnectionFactory,xxxRedissonConnnectionFactory

```

假设应用中已有如下的 **_redis 连接工厂的配置声明, 则这些连接工厂会自动健康检查,_** 如果没有特别指定必须不健康，现在的设计是直接跳过检查

```
@Bean("xxxRedissonConnectionFactory")
public RedissonConnectionFactory xxxRedissonConnectionFactory(@Qualifier("xxxRedissonClient") RedissonClient xxxRedissonClient) {
     return new RedissonConnectionFactory(xxxRedissonClient);
}

@Bean("yyyRedissonConnectionFactory")
public RedissonConnectionFactory yyyRedissonConnectionFactory(@Qualifier("yyyRedissonClient") RedissonClient yyyRedissonClient) {
     return new RedissonConnectionFactory(yyyRedissonClient);
}

```

(必知) 搜索的 RedissonClient 不注册 RedisConnectionFactory, 不参与健康检查
-----------------------------------------------------------

**不注册 RedisConnnectionFactory，就不参与健康检查，通过 redisson 的默认守护线程进行重连**

**现在设计上 searchRedissonClient 都不创建 RedisConnnectionFactory， 不参与健康检查**

(必知) 预热的 RedissonClient 注册 RedisConnectionFactory, 参与健康检查
---------------------------------------------------------

具体配置参见: 

com.zuzuche.ercp.common.config.CustomizeRedissonConfig#redissonConnectionFactory

健康检查故障返回设计
----------

访问 [http://localhost:5001/actuator/health](http://localhost:5001/actuator/health)   ,  如果连接故障， 设计返回内容:   "ERCP REDIS DOWN,DAEMON RETRY CONNECT"

```
{
    "status": "UP",
    "components": {
        "consul": {
            "status": "UP",
            "details": {
                "leader": "10.4.146.245:8300",
                "services": {
                    "consul": [],
                    "ercp-search-cn": [
                        "secure=false",
                        "ercp-search-cn"
                    ]
            }
        },
        "db": {
            "status": "UP",
            "details": {
                "hello": "hi"
            }
        },
        "discoveryComposite": {
            "status": "UP",
            "components": {
                "discoveryClient": {
                    "status": "UP",
                    "details": {
                        "services": [
                            "consul",
                            "ercp-search-cn",
                            "ercp-search-cn-management"
                        ]
                    }
                }
            }
        },
        "diskSpace": {
            "status": "UP",
            "details": {
                "total": 148277366784,
                "free": 17898278912,
                "threshold": 10485760,
                "exists": true
            }
        },
        "hystrix": {
            "status": "UP"
        },
        "ping": {
            "status": "UP"
        },
        "redis": {
            "status": "UP",
            "details": {
                "version": "redissonConnectionFactory | ERCP REDIS DOWN,DAEMON RETRY CONNECT"
            }
        },
        "refreshScope": {
            "status": "UP"
        },
        "search": {
            "status": "UP"
        }
    }
}

```

预热 / 降级和恢复方案
------------

  
![][img-2]  

重连日志
----

redis 连接故障, 日志如下:

```
2024-09-18 17:29:40.620 [redisson-netty-8-2] ERROR org.redisson.connection.DNSMonitor    - Unable to resolve redis-ercp-dev-cn.ercp-dev.svc.rocketos.local 
java.net.UnknownHostException: failed to resolve 'redis-ercp-dev-cn.ercp-dev.svc.rocketos.local' after 4 queries 
	at io.netty.resolver.dns.DnsResolveContext.finishResolve(DnsResolveContext.java:1014)
	at io.netty.resolver.dns.DnsResolveContext.tryToFinishResolve(DnsResolveContext.java:967)
	at io.netty.resolver.dns.DnsResolveContext.query(DnsResolveContext.java:414)
	at io.netty.resolver.dns.DnsResolveContext.onResponse(DnsResolveContext.java:625)
	at io.netty.resolver.dns.DnsResolveContext.access$400(DnsResolveContext.java:63)
	at io.netty.resolver.dns.DnsResolveContext$2.operationComplete(DnsResolveContext.java:458)
	at io.netty.util.concurrent.DefaultPromise.notifyListener0(DefaultPromise.java:578)
	at io.netty.util.concurrent.DefaultPromise.notifyListeners0(DefaultPromise.java:571)
	at io.netty.util.concurrent.DefaultPromise.notifyListenersNow(DefaultPromise.java:550)
	at io.netty.util.concurrent.DefaultPromise.notifyListeners(DefaultPromise.java:491)
	at io.netty.util.concurrent.DefaultPromise.setValue0(DefaultPromise.java:616)
	at io.netty.util.concurrent.DefaultPromise.setSuccess0(DefaultPromise.java:605)
	at io.netty.util.concurrent.DefaultPromise.trySuccess(DefaultPromise.java:104)
	at io.netty.resolver.dns.DnsQueryContext.trySuccess(DnsQueryContext.java:201)
	at io.netty.resolver.dns.DnsQueryContext.finish(DnsQueryContext.java:193)

```

```
2024-09-18 17:29:25.685 [redisson-timer-10-1] ERROR org.redisson.client.handler.PingConnectionHandler    - Unable to send PING command over channel: [id: 0x41078a05, L:0.0.0.0/0.0.0.0:54487] 
io.netty.channel.StacklessClosedChannelException: null

```

DNS 探测日志
--------

故障连接恢复日志

```
[33m2024-09-20 11:55:06.927[0;39m [redisson-netty-5-2] [34mINFO [0;39m [32morg.redisson.connection.DNSMonitor[0;39m - Detected DNS change. Master redis://redis-ercp-dev-cn.ercp-dev.svc.rocketos.local:6379 has changed ip from 10.4.154.49 to 10.4.154.25

[33m2024-09-20 11:55:06.943[0;39m [redisson-netty-5-2] [34mINFO [0;39m [32mo.r.connection.pool.MasterPubSubConnectionPool[0;39m - 1 connections initialized for redis-ercp-dev-cn.ercp-dev.svc.rocketos.local/10.4.154.25:6379

[33m2024-09-20 11:55:06.966[0;39m [redisson-netty-5-1] [34mINFO [0;39m [32morg.redisson.connection.SingleEntry[0;39m - master redis-ercp-dev-cn.ercp-dev.svc.rocketos.local/10.4.154.49:6379 has changed to redis-ercp-dev-cn.ercp-dev.svc.rocketos.local/10.4.154.25:6379

[33m2024-09-20 11:55:06.966[0;39m [redisson-netty-5-1] [34mINFO [0;39m [32morg.redisson.connection.pool.MasterConnectionPool[0;39m - 24 connections initialized for redis-ercp-dev-cn.ercp-dev.svc.rocketos.local/10.4.154.25:6379

```

[img-0]:images/搜索模块-redis-配置说明/p01.png

[img-1]:images/搜索模块-redis-配置说明/p02.png

[img-2]:images/搜索模块-redis-配置说明/p03.png
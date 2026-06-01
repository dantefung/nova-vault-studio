---
title: "一个redis实现的简易的延迟消息服务"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7306820208841719820)

前言
==

###### 产品：我们系统在给供应商们下单之后，需要隔几天后提醒他们接单，接单后隔几天后提醒发货，以此类推不停的提醒供应商完成流程。

###### 我：同事 A，需求分给你了，你准备怎么做呢？

###### 同事 A：就按以前的思路，下单的时候先算好要提醒的那天时间，再扫表挨个发短信

###### 我：。。。。。。这不是典型的延时消息问题吗？定时扫表是不是不好

###### 我：我们的阿里云 rocket mq 支持延时消息吗？

###### 运维：可以，但是要给钱，我去找领导支持支持？

###### 我：算了，肯定不给开。其他产线怎么做的？

###### 运维：他们用 rabbit mq

###### 我：嗯，我考虑考虑，再议

综上，目前项目中用的 rocket mq 暂时不支持，按其他产线的实现又要为了这个需求引入 rabbit mq，而且因为 rabbit mq 用的 int 类型存的延时时间最多也就 20 多天，总感觉不合心意。定时 + 扫表虽然能实现，但又不完美，由于不能频繁的扫库所以设定的定时任务 5 分钟执行一次，这意味最长可能有 10 分钟的延迟，另外一个严重的问题是每次遇到这种业务都需要加专门的定时任务，现在用的 xxljob 任务已经有点多了。

思路
==

基于以上现实问题，准备专门部署一个延迟消息的服务，原料就用现有的 rocket mq + redis（分数排序）实现

上机
==

###### 新建一个线程工厂，创建守护线程

```
public class DelayMessageThreadFactory implements ThreadFactory {
    @Override
    public Thread newThread(Runnable r) {
        Thread t = new Thread(r);
        t.setName("delay-message-thread");
        t.setDaemon(true);
        return t;
    }
}
```

###### 创建服务类

```
@Component
@Slf4j
public class DelayMessageThreadService implements InitializingBean, DisposableBean,Runnable {
    @Autowired
    private IDelayMessageInfoService delayMessageInfoService;
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    @Autowired
    @Qualifier("readAndRemoveMessage")
    private RedisScript readAndRemoveMessage;
    @Autowired
    private AliRocketMqProducer aliRocketMqProducer;
    @Resource
    private TransactionTemplate transactionTemplate;
    @Autowired
    private DelayMessageRedisKeyService delayMessageRedisKeyService;

    private volatile boolean condition = true;

    @Override
    public void run() {
        Date currentDate = null;
        String key = delayMessageRedisKeyService.getKey();
        while (condition) {
            currentDate = new Date();
            Long currentTime = currentDate.getTime();
            List<String> result = (List) redisTemplate.execute(readAndRemoveMessage, Arrays.asList(key), currentTime.toString());
            if (Objects.nonNull(result)) {
                try {
                    this.sendCurrentMessage(Long.valueOf(result.get(0)));
                } catch (Exception e) {
                    log.error("执行延迟消息失败：{}", e);
                    RedisUtils.zSetScoreAdd(key, Long.valueOf(result.get(0)), Long.valueOf(result.get(1)));
                }
            } else {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    @Override
    public void destroy() throws Exception {
        this.condition = false;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        DelayMessageThreadFactory delayMessageThreadFactory = new DelayMessageThreadFactory();
        ExecutorService threadPool = new ThreadPoolExecutor(1, 1,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>(),
                delayMessageThreadFactory);
        threadPool.execute(this);
    }

    /**
     * 发送当前消息处理逻辑
     * @param msgId 消息id
     */
    private void sendCurrentMessage(Long msgId) {
        DelayMessageInfo info = delayMessageInfoService.lambdaQuery()
                .eq(DelayMessageInfo::getId, msgId)
                .eq(DelayMessageInfo::getIsDelete, false)
                .one();
        if (Objects.isNull(info)) {
            log.error("延迟消息不存在：{}", msgId);
            return;
        }
        String msgKey = UUID.randomUUID().toString();
        transactionTemplate.execute(status -> {
            delayMessageInfoService.lambdaUpdate()
                    .eq(DelayMessageInfo::getId, msgId)
                    .set(DelayMessageInfo::getIsSend, true)
                    .update();
            log.info("发送消息：{}", msgId);
            aliRocketMqProducer.send(info.getMessageBody(), info.getTopicName(), info.getTagName(), msgKey);
            return null;
        });
    }
}
```

1. 首先类实现 InitializingBean,DisposableBean,Runnable 三个接口，InitializingBean,DisposableBean 实现的 spring 的接口，只要在启动和销毁时针对 bean 做一些操作，这里启动时会新建一个单独的线程池，同时启动线程执行业务操作。Runnable 就是实现的线程接口，没啥好说的。 2. 线程启动后会不断从 redis 里面取是否有需要发送的数据，如果有就发送消息到 rocket mq，然后取下一条。如果当前数据不需要发送或没有，线程休眠一秒后在尝试获取数据。 3. 发送消息前会修改数据库里的日志记录为已处理，消息发送成功后将提交事务。 4. 这里获取 redis 数据用的 lua 脚本，保证原子性，数据按分数取，每次取一个

```
local value = redis.call('zrangebyscore', KEYS[1], '-inf', ARGV[1], 'WITHSCORES', 'LIMIT', '0', '1')
if not value or not value[1] then
    return nil
end
redis.call('zrem', KEYS[1], value[1])
return value;
```

###### 创建业务服务，主要新增一个保存需要延迟消息的接口，逻辑是第一步入库，判断消息发送的时间是否在阈值范围（当前时间往后推 30 分钟）内，如果在，就存入 redis

```
public Boolean sendDelayMessage(SendDelayMessageReq delayMessage) {
        //1.入库
        DelayMessageInfo delayMessageInfo = new DelayMessageInfo();
        Long sendTime = delayMessage.getSendDate().getTime();
        Long id = IdWorker.getId();
        delayMessageInfo.setId(id);
        delayMessageInfo.setBizId(delayMessage.getBizId());
        delayMessageInfo.setSendMessageTime(delayMessage.getSendDate());
        delayMessageInfo.setSendMessageTimestamp(sendTime);
        delayMessageInfo.setTopicName(delayMessage.getTopicName());
        delayMessageInfo.setTagName(delayMessage.getTagName());
        delayMessageInfo.setMessageBody(delayMessage.getMessageBody());
        delayMessageInfo.setBizType(delayMessage.getBizType());
        delayMessageInfo.setGmtCreate(new Date());
        delayMessageInfo.setIsSend(false);
        delayMessageInfoService.save(delayMessageInfo);
        //2.判断阈值
        if (sendTime <= this.getPreSendTime()) {
            RedisUtils.zSetScoreAdd(delayMessageRedisKeyService.getKey(), id, sendTime.doubleValue());
        }
        return true;
    }
```

###### 新增定时任务，每 30 分钟将没有处理的且在阈值之类的数据存入 redis

总结
==

大体实现思路就是这样，这里只给出简化版，测试了一下不考虑自己业务的实现时间，基本误差在 0-5 秒之内。另外还有后续的优化，比如数据量大时需要给数据分区，增加服务节点，增加处理线程，增加使用的 redis（不局限于一个 redis 集群），当然可能更复杂，需要考虑异常下线和多节点间的注册发现问题，不过这样能保证在大数据量下的延迟问题。
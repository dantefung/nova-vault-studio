---
title: "MySQL 深分页 + 多字段排序场景的优化方案【三百万级数据量】"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/nbdQiBc92vcKwHZNlYYDyg)

[来源：blog.csdn.net/qq_43097201/](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

[article/details/128773909](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

*   [需求背景](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&chksm=fa496f8ecd3ee698f4954c00efb80fe955ec9198fff3ef4011e331aa37f55a6a17bc8c0335a8&scene=21&token=899450012&lang=zh_CN#wechat_redirect)
    
*   [历史代码背景](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&chksm=fa496f8ecd3ee698f4954c00efb80fe955ec9198fff3ef4011e331aa37f55a6a17bc8c0335a8&scene=21&token=899450012&lang=zh_CN#wechat_redirect)
    

*   [优化点一：多表 join 优化](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&chksm=fa496f8ecd3ee698f4954c00efb80fe955ec9198fff3ef4011e331aa37f55a6a17bc8c0335a8&scene=21&token=899450012&lang=zh_CN#wechat_redirect)
    
*   [优化点二：优化 SQL，避免深分页所带来的问题](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&chksm=fa496f8ecd3ee698f4954c00efb80fe955ec9198fff3ef4011e331aa37f55a6a17bc8c0335a8&scene=21&token=899450012&lang=zh_CN#wechat_redirect)
    
*   [优化点三：深分页，设定阈值合理倒序查询](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&chksm=fa496f8ecd3ee698f4954c00efb80fe955ec9198fff3ef4011e331aa37f55a6a17bc8c0335a8&scene=21&token=899450012&lang=zh_CN#wechat_redirect)
    
*   [优化点四：排序字段单独建立索引](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&chksm=fa496f8ecd3ee698f4954c00efb80fe955ec9198fff3ef4011e331aa37f55a6a17bc8c0335a8&scene=21&token=899450012&lang=zh_CN#wechat_redirect)
    
*   [优化点五：单表拆分](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&chksm=fa496f8ecd3ee698f4954c00efb80fe955ec9198fff3ef4011e331aa37f55a6a17bc8c0335a8&scene=21&token=899450012&lang=zh_CN#wechat_redirect)
    

* * *

[需求背景](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)
-------------------------------------------------------------------------------------------------------------------------------------------

目前产品需要针对一个大范围地区内的所有用户做排行榜功能，且这个排行榜有几个比较蛋疼的附加需求：

排行榜需要全量展示所有用户，且做分页展示（大坑💥）

![](https://mmbiz.qpic.cn/mmbiz_png/6mychickmupWTibE62D38dcXGbJCrj4NiawcPcOhV2PXwsZ8tGQFdgC4FJ8TaDmpBlPic8NxQOx2T5FIib3xOicNDgbg/640?wx_fmt=png)

排行榜有 4 种排序条件，且每个排序条件都是单独的。例如：用户的应用 A 下载数、应用 B 下载数、应用 C 下载数、应用 D 下载数（产品不期望把所有的数据整合成一块进行排名）

![](https://mmbiz.qpic.cn/mmbiz_png/6mychickmupWTibE62D38dcXGbJCrj4NiawpDibK0gYiay63AJFYLxCX7slnWj70BFoBicMhE2DlrA2nyDic5bZgVjLfA/640?wx_fmt=png)

[历史代码背景](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)
---------------------------------------------------------------------------------------------------------------------------------------------

其实这个需求已经够扯了，雪上加霜的是，以前的开发者在开发排行榜的时候，由于需求背景原因，采用了多表 join 的方式来进行查询。

这是什么意思呢？这里详细说一下：

*   假设有一张表 C，就是排行榜的单表数；
    
*   目前无法直接从表 C 中拿到排行榜的所有所需字段。
    

> 听说是需求原因，别无他法

导致了开发者在 MyBatis 层面通过多表 join 的方式补充了所需字段；

最后 SQL 就是：

```
table A left join table B left join table C
```

以上方式进行多表 join，先不说分页、排序等性能问题。单纯表 A join 表 B 都已经耗时 3 秒（表 A 数据量 250W、表 B 数据量 300W）

### [优化点一：多表 join 优化](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

针对多表 join 的问题，必须想尽办法把多表 join 的查询操作改为单表查询，否则多表 join 随着数据量增加，后期性能不敢想象

### [优化点二：优化 SQL，避免深分页所带来的问题](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

```
select * from table A t1 join ( select id from table A  order by indexA des  limit 20000, 20) t2 on t1.id = t2.id
```

这里通过子查询的方式，且限制分页的页数（注意，虽然`pageSize = 20000`，MySQL 会扫描前 20000 个数据，然后再从 20001 开始拿数据，再丢弃前 20000 条数据，因此还是会顺序扫前面的 20000 条数据，而不是跳到 20001 开始扫描的。这里可以网上查资料学习下）

此 SQL 还有优化空间，就是在临时的子表中补充上 where 条件，就可以直接筛选掉大部分无效数据

```
select * from table A t1 join ( select id from table A   where index_value > 100000  order by indexA des  limit 20000, 20) t2 on t1.id = t2.id
```

##### [抛出一个问题](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

> MySQL 的 in 和 join，谁的性能更好？

在本次开发过程中，in 的方式指定查询大量数据，发现 DB 查询超时了；只有使用 join 的方式才能查到数据，这是为什么？

### [优化点三：深分页，设定阈值合理倒序查询](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

其实深分页最主要的问题就是 `limit m, n` 这个偏移量的问题；如果正序数，拿最后一页数据，相当于扫描前 m 个数据，再从 m+1 开始拿到 m+n；

仔细想想，这个地方，如果正序拿最后一页，那不如我直接倒序拿第一页？这样的话，就规避了深分页问题，这个一般会设定一个阈值，超过阈值就进行正序 / 倒序

### [优化点四：排序字段单独建立索引](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

其实针对排序字段，一般会补充索引来进行优化，因此多字段排序的话，尽量让每个排序字段都单独设置一个索引，因为索引已经帮我们做好排序了。

> 这里要注意一个点，尽量不要接多字段同时排序的需求，这种情况下索引的设计将会十分复杂

### [优化点五：单表拆分](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)

因为表 C 有多个排序字段，且还有各种 where 条件筛选，此时如果建立联合索引来解决的话，因为需要满足 最左匹配原则，此时联合索引的数量将会很大，届时索引树也会十分复杂。还好排行榜是读多写少的表数据，否则性能堪忧；

此时其实更建议进行单表的拆分，让每一个表所负责的职责更加明确；因为以前的表 C，相当于就是把多个排行榜冗余在一个单表中了，这时候表 C 的压力是很大的。因此单表拆分，此时针对单表的排序字段建立对应的索引，且单表职责更加单一；

单表拆分方案：

*   查询某个字段的排序数据时，在 MyBatis 层面，根据排序字段，指定查询排序字段所对应的单表。
    
*   单表拆分后，需要合理创建索引
    

* * *
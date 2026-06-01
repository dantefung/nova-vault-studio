---
title: "MySQL 百万级数据量分页查询方法及其优化"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/le6ue-8q9T20WWWFw8fvuQ)

**方法 1: 直接使用数据库提供的 SQL 语句**

*   语句样式: MySQL 中, 可用如下方法: SELECT * FROM 表名称 LIMIT M,N
    
*   适应场景: 适用于数据量较少的情况 (元组百 / 千级)
    
*   原因 / 缺点: 全表扫描, 速度会很慢 且 有的数据库结果集返回不稳定 (如某次返回 1,2,3, 另外的一次返回 2,1,3). Limit 限制的是从结果集的 M 位置处取出 N 条输出, 其余抛弃.
    

**方法 2: 建立主键或唯一索引, 利用索引 (假设每页 10 条)**

*   语句样式: MySQL 中, 可用如下方法: SELECT * FROM 表名称 WHERE id_pk > (pageNum*10) LIMIT M
    
*   适应场景: 适用于数据量多的情况 (元组数上万)
    
*   原因: 索引扫描, 速度会很快. 有朋友提出: 因为数据查询出来并不是按照 pk_id 排序的，所以会有漏掉数据的情况，只能方法 3
    

**方法 3: 基于索引再排序**

*   语句样式: MySQL 中, 可用如下方法: SELECT * FROM 表名称 WHERE id_pk > (pageNum*10) ORDER BY id_pk ASC LIMIT M
    
*   适应场景: 适用于数据量多的情况 (元组数上万). 最好 ORDER BY 后的列对象是主键或唯一所以, 使得 ORDERBY 操作能利用索引被消除但结果集是稳定的 (稳定的含义, 参见方法 1)
    
*   原因: 索引扫描, 速度会很快. 但 MySQL 的排序操作, 只有 ASC 没有 DESC(DESC 是假的, 未来会做真正的 DESC, 期待...).
    

**方法 4: 基于索引使用 prepare**

第一个问号表示 pageNum，第二个？表示每页元组数

*   语句样式: MySQL 中, 可用如下方法: PREPARE stmt_name FROM SELECT * FROM 表名称 WHERE id_pk > (？* ？) ORDER BY id_pk ASC LIMIT M
    
*   适应场景: 大数据量
    
*   原因: 索引扫描, 速度会很快. prepare 语句又比一般的查询语句快一点。
    

**方法 5: 利用 MySQL 支持 ORDER 操作可以利用索引快速定位部分元组, 避免全表扫描**

比如: 读第 1000 到 1019 行元组 (pk 是主键 / 唯一键).

```
SELECT * FROM your_table WHERE pk>=1000 ORDER BY pk ASC LIMIT 0,20
```

**方法 6: 利用 "子查询 / 连接 + 索引" 快速定位元组的位置, 然后再读取元组.**

比如 (id 是主键 / 唯一键, 蓝色字体时变量)

利用子查询示例:

```
SELECT * FROM your_table WHERE id <=
(SELECT id FROM your_table ORDER BY id desc LIMIT ($page-1)*$pagesize ORDER BY id desc
LIMIT $pagesize
```

利用连接示例:

```
SELECT * FROM your_table AS t1
JOIN (SELECT id FROM your_table ORDER BY id desc LIMIT ($page-1)*$pagesize AS t2
WHERE t1.id <= t2.id ORDER BY t1.id desc LIMIT $pagesize;
```

mysql 大数据量使用 limit 分页，随着页码的增大，查询效率越低下。

**测试实验**

1.   直接用 limit start, count 分页语句， 也是我程序中用的方法：

```
select * from product limit start, count
```

当起始页较小时，查询没有性能问题，我们分别看下从 10， 100， 1000， 10000 开始分页的执行时间（每页取 20 条）。

如下：

```
select * from product limit 10, 20   0.016秒 
select * from product limit 100, 20   0.016秒
select * from product limit 1000, 20   0.047秒
select * from product limit 10000, 20   0.094秒
```

我们已经看出随着起始记录的增加，时间也随着增大， 这说明分页语句 limit 跟起始页码是有很大关系的，那么我们把起始记录改为 40w 看下（也就是记录的一般左右）

```
select * from product limit 400000, 20   3.229秒
```

再看我们取最后一页记录的时间

```
select * from product limit 866613, 20   37.44秒
```

像这种分页最大的页码页显然这种时间是无法忍受的。

从中我们也能总结出两件事情：

1.  limit 语句的查询时间与起始记录的位置成正比
    
2.  mysql 的 limit 语句是很方便，但是对记录很多的表并不适合直接使用。
    

**2.   对 limit 分页问题的性能优化方法**

利用表的覆盖索引来加速分页查询

我们都知道，利用了索引查询的语句中如果只包含了那个索引列（覆盖索引），那么这种情况会查询很快。

因为利用索引查找有优化算法，且数据就在查询索引上面，不用再去找相关的数据地址了，这样节省了很多时间。另外 Mysql 中也有相关的索引缓存，在并发高的时候利用缓存就效果更好了。

在我们的例子中，我们知道 id 字段是主键，自然就包含了默认的主键索引。现在让我们看看利用覆盖索引的查询效果如何。

这次我们之间查询最后一页的数据（利用覆盖索引，只包含 id 列），如下：

```
select id from product limit 866613, 20 0.2秒
```

相对于查询了所有列的 37.44 秒，提升了大概 100 多倍的速度

那么如果我们也要查询所有列，有两种方法，一种是 id>= 的形式，另一种就是利用 join，看下实际情况：

```
SELECT * FROM product WHERE ID > =(select id from product limit 866613, 1) limit 20
```

查询时间为 0.2 秒！

另一种写法

```
SELECT * FROM product a JOIN (select id from product limit 866613, 20) b ON a.ID = b.id
```

查询时间也很短！

**3.  复合索引优化方法**

MySql 性能到底能有多高？MySql 这个数据库绝对是适合 dba 级的高手去玩的，一般做一点 1 万篇新闻的小型系统怎么写都可以，用 xx 框架可以实现快速开发。可是数据量到了 10 万，百万至千万，他的性能还能那么高吗？一点小小的失误，可能造成整个系统的改写，甚至更本系统无法正常运行！好了，不那么多废话了。

用事实说话，看例子：

数据表 collect (id, title ,info ,vtype) 就这 4 个字段，其中 title 用定长，info 用 text, id 是逐渐，vtype 是 tinyint，vtype 是索引。这是一个基本的新闻系统的简单模型。现在往里面填充数据，填充 10 万篇新闻。最后 collect 为 10 万条记录，数据库表占用硬 1.6G。

OK , 看下面这条 sql 语句：

```
select id,title from collect limit 1000,10;
```

很快；基本上 0.01 秒就 OK，再看下面的

```
select id,title from collect limit 90000,10;
```

8-9 秒完成，my god 哪出问题了？其实要优化这条数据，网上找得到答案。看下面一条语句:

```
select id from collect order by id limit 90000,10;
```

很快，0.04 秒就 OK。 为什么？因为用了 id 主键做索引当然快。网上的改法是：

```
select id,title from collect where id>=(select id from collect order by id limit 90000,1) limit 10;
```

这就是用了 id 做索引的结果。可是问题复杂那么一点点，就完了。看下面的语句

select id from collect where vtype=1 order by id limit 90000,10; 很慢，用了 8-9 秒！

到了这里我相信很多人会和我一样，有崩溃感觉！vtype 做了索引了啊？怎么会慢呢？vtype 做了索引是不错，你直接

```
select id from collect where vtype=1 limit 1000,10;
```

是很快的，基本上 0.05 秒，可是提高 90 倍，从 9 万开始，那就是 0.05*90=4.5 秒的速度了。和测试结果 8-9 秒到了一个数量级。

从这里开始有人提出了分表的思路，这个和 dis #cuz 论坛是一样的思路。思路如下：

建一个索引表： t (id,title,vtype) 并设置成定长，然后做分页，分页出结果再到 collect 里面去找 info 。 是否可行呢？实验下就知道了。

10 万条记录到 t(id,title,vtype) 里，数据表大小 20M 左右。用

```
select id from t where vtype=1 order by id limit 90000,10;
```

很快了。基本上 0.1-0.2 秒可以跑完。为什么会这样呢？我猜想是因为 collect 数据太多，所以分页要跑很长的路。limit 完全和数据表的大小有关的。其实这样做还是全表扫描，只是因为数据量小，只有 10 万才快。OK， 来个疯狂的实验，加到 100 万条，测试性能。加了 10 倍的数据，马上 t 表就到了 200 多 M，而且是定长。还是刚才的查询语句，时间是 0.1-0.2 秒完成！分表性能没问题？

错！因为我们的 limit 还是 9 万，所以快。给个大的，90 万开始

```
select id from t where vtype=1 order by id limit 900000,10;
```

看看结果，时间是 1-2 秒！why ?

分表了时间还是这么长，非常之郁闷！有人说定长会提高 limit 的性能，开始我也以为，因为一条记录的长度是固定的，mysql 应该可以算出 90 万的位置才对啊？可是我们高估了 mysql 的智能，他不是商务数据库，事实证明定长和非定长对 limit 影响不大？怪不得有人说 discuz 到了 100 万条记录就会很慢，我相信这是真的，这个和数据库设计有关！

难道 MySQL 无法突破 100 万的限制吗？？？到了 100 万的分页就真的到了极限？

答案是： NO 为什么突破不了 100 万是因为不会设计 mysql 造成的。下面介绍非分表法，来个疯狂的测试！一张表搞定 100 万记录，并且 10G 数据库，如何快速分页！

好了，我们的测试又回到 collect 表，开始测试结论是：

30 万数据，用分表法可行，超过 30 万他的速度会慢道你无法忍受！当然如果用分表 + 我这种方法，那是绝对完美的。但是用了我这种方法后，不用分表也可以完美解决！

答案就是：复合索引！ 有一次设计 mysql 索引的时候，无意中发现索引名字可以任取，可以选择几个字段进来，这有什么用呢？

开始的

```
select id from collect order by id limit 90000,10;
```

这么快就是因为走了索引，可是如果加了 where 就不走索引了。抱着试试看的想法加了 search(vtype,id) 这样的索引。

然后测试

```
select id from collect where vtype=1 limit 90000,10;
```

非常快！0.04 秒完成！

再测试:

```
select id ,title from collect where vtype=1 limit 90000,10;
```

非常遗憾，8-9 秒，没走 search 索引！

再测试：search(id,vtype)，还是 select id 这个语句，也非常遗憾，0.5 秒。

综上：如果对于有 where 条件，又想走索引用 limit 的，必须设计一个索引，将 where 放第一位，limit 用到的主键放第 2 位，而且只能 select 主键！

完美解决了分页问题了。可以快速返回 id 就有希望优化 limit ， 按这样的逻辑，百万级的 limit 应该在 0.0x 秒就可以分完。看来 mysql 语句的优化和索引时非常重要的！

* * *

欢迎加入我的知识星球，一起探讨架构，交流源码。加入方式，**长按下方二维码噢**：  

![](https://mmbiz.qpic.cn/mmbiz_jpg/JdLkEI9sZffVTY1cbQPIhsMGJcNWFwIDn1HomDs3KMQdVdSpmRkicibAFj9FzVtNtQxAtyAhyqmo1N8aibviaU4Qxg/640?wx_fmt=jpeg)

已在知识星球更新源码解析如下：  

![](https://mmbiz.qpic.cn/mmbiz_png/JdLkEI9sZfcOlXBvLI0OIxHTfcmz77hIibtCsvTlEOuibdsK5MIU3McxzzJCNzRon1Iv2lSh8qaUlovibV9qlAOXg/640?wx_fmt=png)

![](https://mmbiz.qpic.cn/mmbiz_png/JdLkEI9sZfcmSgZ4wPnOU7xEGWiaibibnSqiaEU3kLg4te15XaMwvaAZFYyricibfjibyoqPXucUPO3uz1g4kPpoLpXXQ/640?wx_fmt=png)

![](https://mmbiz.qpic.cn/mmbiz_png/JdLkEI9sZfcOlXBvLI0OIxHTfcmz77hImFLNicRZKDNT0EWvZ386AIHwUJNibGicY5hkx9o3Nscp5dzTrADXaX5gg/640?wx_fmt=png)
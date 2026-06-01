---
title: "这才是批量update的正确姿势！"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

## 大家好，我是苏三，又跟大家见面了。

文末留言送书啦！！！

## 前言

最近我有位小伙伴问我，在实际工作中，批量更新的代码要怎么写。

这个问题挺有代表性的，今天拿出来给大家一起分享一下，希望对你会有所帮助。

## 1 案发现场

有一天上午，在我的知识星球群里，有位小伙伴问了我一个问题：批量更新你们一般是使用when case吗？还是有其他的批量更新方法？

我的回答是：咱们星球的商城项目中，有批量更新的代码可以参考一下，这个项目中很多代码，大家平时可以多看看。

然后我将关键代码发到群里了，这是批量重置用户密码的业务场景：

```auto
<update id="updateForBatch" parameterType="cn.net.susan.entity.sys.UserEntity">    <foreach collection="list" item="entity" separator=";">        UPDATE sys_user        SET password = #{entity.password},update_user_id=#{entity.updateUserId},update_user_name=#{entity.updateUserName}        <where>            id = #{entity.id}
        </where>
    </foreach>
</update>
```

有小伙伴说，第一次见到这种写法，涨知识了。

还有小伙伴问，上面这种写法，跟直接for循环中update有什么区别？

```auto
for(UserEntity userEntity: list) {
   userMapper.update(userEntity);
}
```

直接for循环需要多次请求数据库，网络有一定的开销，很显然没有批量一次请求数据库的好。

## 2 其他的批量更新写法

有小伙说，他之前一直都是用的case when的写法。

类似下面这样的：

```auto
<update id="updateForBatch" parameterType="cn.net.susan.entity.sys.UserEntity">
  update sys_user
  <trim prefix="set" suffixOverrides=",">
      <trim prefix="password = case id" suffix="end,">
          <foreach collection="list" item="item">
              when #{item.id} then #{item.password}
          </foreach>
      </trim>
      <trim prefix="update_user_id = case id" suffix="end,">
          <foreach collection="list" item="item">
              when #{item.id} then #{item.updateUserId}
          </foreach>
      </trim>
      <trim prefix="update_user_name = case id" suffix="end">
          <foreach collection="list" item="item">
              when #{item.id} then #{item.updateUserName}
          </foreach>
      </trim>
  </trim>
  <where>
      id in (
      <foreach collection="list" separator="," item="item">
          #{item.id}
      </foreach>
      )
  </where>
</update>  
```

但这种写法显然需要拼接很多条件，有点复杂，而且性能也不太好。

还有些文章中介绍，可以使用在insert的时候，可以在语句最后加上ON DUPLICATE KEY UPDATE关键字。

```auto
 <update id="updateForBatch" parameterType="cn.net.susan.entity.sys.UserEntity">
    insert into sys_user
    (id,username,password) values
    <foreach collection="list" index="index" item="item" separator=",">
        (#{item.id},
        #{item.username},
        #{item.password})
    </foreach>
    ON DUPLICATE KEY UPDATE
     password=values(password)
</update>
```

在插入数据时，数据库会先判断数据是否存在，如果不存在，则执行插入操作。如果存在，则执行更新操作。

这种方式我之前也用过，一般需要创建唯一索引。

因为很多时候主键id，是自动增长的或者根据雪花算法生成的，每次都不一样，没法区分多次相同业务参数请求的唯一性。

因此，建议创建一个唯一索引，来保证业务数据的唯一性。

比如：给username创建唯一索引，在insert的时候，发现username已存在，则执行update操作，更新password。

这种方式批量更新数据，性能比较好，但一般的大公司很少会用，因为非常容易出现死锁的问题。

因此，目前批量更新数据最好的选择，还是我在文章开头介绍的第一种方法。

## 3 发现了一个问题

群里另外一位小伙伴，按照我的建议，在自己的项目中尝试了一下foreach的这种批量更新操作，但代码报了一个异常：

```auto
sql injection violation, multi-statement not allow
```

这个异常是阿里巴巴druid包的WallFilter中报出来了。

它里面有个checkInternal方法，会对sql语句做一些校验，如果不满足条件，就会抛异常：![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

而druid默认不支持一条sql语句中包含多个statement语句，例如：我们的批量update数据的场景。

此外，MySQL默认也是关闭批量更新数据的，不过我们可以在jdbc的url要上，添加字符串参数：`&allowMultiQueries=true`，开启批量更新操作。

比如：

```auto
datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/console?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowMultiQueries=true
      username: root
      password: root
```

这个改动非常简单。

但WallFilter中的校验问题如何解决呢？

于是，我上网查了一下，可以通过参数调整druid中的filter的判断逻辑，比如：

```auto
spring:
  datasource:
    url: jdbc:xxx&serverTimezone=Asia/Shanghai&rewriteBatchedStatements=true&allowMultiQueries=true
    username: xxx
    password: xxx
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      filter:
        wall:
          config:
            multi-statement-allow: true
            none-base-statement-allow: true
```

通过设置filter中的multi-statement-allow和none\-base\-statement-allow为true，这样就能开启批量更新的功能。

## 4 一直不生效

普通使用druid的datasource配置，通过上面这样调整是OK的。

但有些小伙伴发现，咱们的商城项目中，通过上面的两个地方的修改，还是一直报下面的异常：

```auto
sql injection violation, multi-statement not allow
```

这是怎么回事呢？

答：咱们商城项目中的订单表，使用shardingsphere做了分库分表，并且使用baomidou实现多个数据源动态切换的功能：

```auto
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
    <version>3.1.1</version>
</dependency>
```

我们是使用了baomidou包下的数据源配置，这个配置在DynamicDataSourceProperties类中：

```auto
/**
 * Copyright © 2018 organization baomidou
 * <pre>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * <pre/>
 */
package com.baomidou.dynamic.datasource.spring.boot.autoconfigure;

import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.druid.DruidConfig;
import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.hikari.HikariCpConfig;
import com.baomidou.dynamic.datasource.strategy.DynamicDataSourceStrategy;
import com.baomidou.dynamic.datasource.strategy.LoadBalanceDynamicDataSourceStrategy;
import com.baomidou.dynamic.datasource.toolkit.CryptoUtils;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.core.Ordered;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * DynamicDataSourceProperties
 *
 * @author TaoYu Kanyuxia
 * @see DataSourceProperties
 * @since 1.0.0
 */
@Slf4j
@Getter
@Setter
@ConfigurationProperties(prefix = DynamicDataSourceProperties.PREFIX)
public class DynamicDataSourceProperties {

    public static final String PREFIX = "spring.datasource.dynamic";
    public static final String HEALTH = PREFIX + ".health";

    /**
     * 必须设置默认的库,默认master
     */
    private String primary = "master";
    /**
     * 是否启用严格模式,默认不启动. 严格模式下未匹配到数据源直接报错, 非严格模式下则使用默认数据源primary所设置的数据源
     */
    private Boolean strict = false;
    /**
     * 是否使用p6spy输出，默认不输出
     */
    private Boolean p6spy = false;
    /**
     * 是否使用seata,默认不使用
     */
    private Boolean seata = false;
    /**
     * 是否使用 spring actuator 监控检查，默认不检查
     */
    private boolean health = false;
    /**
     * 每一个数据源
     */
    private Map<String, DataSourceProperty> datasource = new LinkedHashMap<>();
    /**
     * 多数据源选择算法clazz，默认负载均衡算法
     */
    private Class<? extends DynamicDataSourceStrategy> strategy = LoadBalanceDynamicDataSourceStrategy.class;
    /**
     * aop切面顺序，默认优先级最高
     */
    private Integer order = Ordered.HIGHEST_PRECEDENCE;
    /**
     * Druid全局参数配置
     */
    @NestedConfigurationProperty
    private DruidConfig druid = new DruidConfig();
    /**
     * HikariCp全局参数配置
     */
    @NestedConfigurationProperty
    private HikariCpConfig hikari = new HikariCpConfig();

    /**
     * 全局默认publicKey
     */
    private String publicKey = CryptoUtils.DEFAULT_PUBLIC_KEY_STRING;
}
```

这个类是数据库的配置类，我们可以看到master和druid的配置是在同一层级的，于是，将application.yml文件中的配置改成下面这样的：

```auto
spring:
  application:
    name: mall-job
  datasource:
    dynamic:
      primary: master
      datasource:
        master:
          username: root
          password: 123456
          url: jdbc:mysql://localhost:3306/susan_mall?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useSSL=false&zeroDateTimeBehavior=convertToNull
          driver-class-name: com.mysql.cj.jdbc.Driver
       druid:
        wall:
          multiStatementAllow: true
          noneBaseStatementAllow: true
```

这样改动之后，商城项目中使用foreach这种批量更新数据的功能OK了。

## 5 最后

本文由一位球友的问题开始，讨论了批量更新的四种常见方式：

1.  for循环中一条条更新
    
2.  foreach拼接update语句后批量更新。
    
3.  使用case when的方式做判断。
    
4.  使用insert into on duplicate key update语法，批量插入或者批量更新。
    

虽说有很多种方式，但我个人认为批量update的最佳方式是第2种方式。

但需要需要的地方是，使用foreach做批量更新的时候，一次性更新的数据不宜太多，尽量控制在1000以内，这样更新的性能还是不错的。

如果需要更新的数据超过了1000，则需要分成多批更新。

此外，如果大家遇到执行批量update操作，不支持批量更新问题时：

```auto
sql injection violation, multi-statement not allow
```

首先要在数据库连接的url后面增加&allowMultiQueries\=true参数，开启数据的批量更新操作。

如果使用了druid数据库驱动的，可以在配置文件中调整filter的参数。

```auto
spring:
  datasource:
    druid:
      filter:
        wall:
          config:
            multi-statement-allow: true
            none-base-statement-allow: true
```

主要是multi-statement-allow设置成true。

如果你还使用了其他第三方的数据库中间件，比如我使用了baomidou实现多个数据源动态切换的功能。

这时候，需要查看它的源码，确认它multi-statement-allow的配置参数是怎么配置的，有可能跟druid不一样。

## 文末送书

为了感谢一路支持苏三的小伙们，今天特地给大家送一点小福利。规则非常简单：**在本文留言，按点赞数量排名，点赞数量最多的前3位，每人获取1本书。（**你可以发朋友圈集赞，或者发微信群集赞。但如果发现有人用机器刷点赞数，立即取消资格，并且拉黑**）**

后面我会朋友圈公布中奖名单，给你免费包邮到家！这些书是由电子工业出版社提供的，感谢赞助。

# **《漫画设计模式》**

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

《漫画设计模式》围绕主人公“兔小白”和“熊小猫”的对话展开，辅以百余张贴合内容、生动形象的手绘插画，以轻松、幽默的方式讲解GoF的23种设计模式。

《漫画设计模式》共27章，第1、2章简要介绍设计模式和设计原则，第3～26章详细介绍设计模式，第27章重点讲解从23种设计模式中提炼的10种设计手法。各章的内容结构为：首先，从现实生活中的常见案例切入，讲解设计模式的结构、功能、优势和意图，使读者形成具象的宏观认知；然后，将案例作为编码练习，使用Java语言开发，并在一次次代码重构中完善程序设计，引导读者思考程序设计中的问题和解决思路；最后，自然而然地引出设计模式的结构图和适用场景等。

《漫画设计模式》既适合具备一定面向对象语言基础且希望提升程序设计水平的开发人员，也适合想要系统学习设计模式的程序员，还可作为高等院校计算机等相关专业师生的参考资料。![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

### 最后说一句(求关注，别白嫖我)

如果这篇文章对您有所帮助，或者有所启发的话，帮忙扫描下发二维码关注一下，您的支持是我坚持写作最大的动力。

求一键三连：点赞、转发、在看。

关注公众号：【苏三说技术】，在公众号中回复：面试、代码神器、开发手册、时间管理有超赞的粉丝福利，另外回复：加群，可以跟很多BAT大厂的前辈交流和学习。

  

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)
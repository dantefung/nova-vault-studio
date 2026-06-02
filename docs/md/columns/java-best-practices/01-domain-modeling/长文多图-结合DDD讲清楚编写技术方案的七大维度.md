---
title: "长文多图：结合 DDD 讲清楚编写技术方案的七大维度"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
original: "[星标]长文多图：结合DDD讲清楚编写技术方案的七大维度.pdf"
---

# 长文多图：结合 DDD 讲清楚编写技术方案的七大维度

> 原文 PDF：`[星标]长文多图：结合DDD讲清楚编写技术方案的七大维度.pdf`（已转文字 + 提取配图）

## 正文

2022/6/12 21:46                                    DDD

DDD

 IT JAVA 2021-10-01 16:56


# 8 #Java 54 # 18 #DDD 2

JAVA 

   JAVA 
 java_fro  nt 

1 



1946-1956

1956-1968


1968

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       1/33
2022/6/12 21:46                                    DDD









2 





https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       2/33
2022/6/12 21:46                                    DDD


whywhat
how




3 

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       3/33
2022/6/12 21:46                                    DDD















3.1 

3.1.1 












https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       4/33
2022/6/12 21:46                                    DDD

3.1.2 

(1) 










https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       5/33
2022/6/12 21:46                                    DDD

  (2) 







(3) 



https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       6/33
2022/6/12 21:46                                    DDD

(4) 



https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       7/33
2022/6/12 21:46                                    DDD

3.1.3 




https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       8/33
2022/6/12 21:46                                    DDD

3.1.4 










https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       9/33
2022/6/12 21:46                                    DDD

3.2 








https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       10/33
2022/6/12 21:46                                    DDD

include



extend






3.3 




https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       11/33
2022/6/12 21:46                                    DDD




3.3.1 









https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       12/33
2022/6/12 21:46                                    DDD

3.3.2 




https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       13/33
2022/6/12 21:46                                    DDD





https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       14/33
2022/6/12 21:46                                    DDD

3.3.3 

ABCABB
CA
BCCB





3.4 




https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       15/33
2022/6/12 21:46  DDD













     // 
                                            16/33

            public class FootballPlayerDO {

                   private Long id;
                   private String name;

                   private Integer height;

                   private Integer weight;

                   private String gamePerformance;


            }


https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw
2022/6/12 21:46                      DDD

// 


public class FootballPlayerDMO {

       private Long id;
       private String name;

       private Integer height;

       private Integer weight;

       private GamePerformanceVO gamePerformanceVO;


}


public class GamePerformanceVO {

       private Double runDistance;

       private Double passSuccess;

       private Integer scoreNum;


}


JSON
groovyQLExpress



JSONKEY5
MySQLESJSON KEY


3.5 





ABCA9
9B88C
77


            public class OrderServiceImpl implements OrderService {
  17/33
https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw
2022/6/12 21:46                                    DDD

                 @Resource

                 private OrderMapper orderMapper;


                 @Override


                 public void createOrder(OrderBO orderBO) {


                 if (null == orderBO) {

                      throw new RuntimeException("    ");


                 }


                 if (OrderTypeEnum.isNotValid(orderBO.getType())) {


                      throw new RuntimeException("    ");


                 }


                 // A


                 if (OrderTypeEnum.A_TYPE.getCode().equals(orderBO.getType())) {


                     orderBO.setPrice(orderBO.getPrice() * 0.9);


                     if (orderBO.getWeight() > 9) {


                              throw new RuntimeException("         ");


                        }


                        orderBO.setRefundSupport(Boolean.FALSE);


                 }


                 // B


                 else if (OrderTypeEnum.B_TYPE.getCode().equals(orderBO.getType())) {


                     orderBO.setPrice(orderBO.getPrice() * 0.8);


                     if (orderBO.getWeight() > 8) {


                              throw new RuntimeException("         ");


                        }


                        orderBO.setRefundSupport(Boolean.TRUE);


                 }


                 // C


                 else if (OrderTypeEnum.C_TYPE.getCode().equals(orderBO.getType())) {


                     orderBO.setPrice(orderBO.getPrice() * 0.7);


                     if (orderBO.getWeight() > 7) {


                              throw new RuntimeException("         ");


                        }


                        orderBO.setRefundSupport(Boolean.TRUE);


                 }


                 // 


                 OrderDO orderDO = new OrderDO();

                 BeanUtils.copyProperties(orderBO, orderDO);

                 orderMapper.insert(orderDO);


       }
}


https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw                                       18/33
2022/6/12 21:46  DDD















3.5.1 





     // 
                                          19/33

            public interface DiscountStrategy {

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw
2022/6/12 21:46              DDD

                 public void discount(OrderBO orderBO);


}


// A


@Component
public class TypeADiscountStrategy implements DiscountStrategy {


                 @Override


                 public void discount(OrderBO orderBO) {


                 orderBO.setPrice(orderBO.getPrice() * 0.9);


       }
}


// B


@Component
public class TypeBDiscountStrategy implements DiscountStrategy {


                 @Override


                 public void discount(OrderBO orderBO) {


                 orderBO.setPrice(orderBO.getPrice() * 0.8);


       }
}


// C


@Component
public class TypeCDiscountStrategy implements DiscountStrategy {


                 @Override


                 public void discount(OrderBO orderBO) {


                 orderBO.setPrice(orderBO.getPrice() * 0.7);


       }
}


// 


@Component
public class DiscountStrategyFactory implements InitializingBean {


       private Map<String, DiscountStrategy> strategyMap = new HashMap<>();


                   @Resource
                                                 20/33
                   private TypeADiscountStrategy typeADiscountStrategy;

                   @Resource

                   private TypeBDiscountStrategy typeBDiscountStrategy;

                   @Resource

                   private TypeCDiscountStrategy typeCDiscountStrategy;

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw
2022/6/12 21:46              DDD

                 public DiscountStrategy getStrategy(String type) {

                        return strategyMap.get(type);


                 }

                 @Override


                 public void afterPropertiesSet() throws Exception {


                 strategyMap.put(OrderTypeEnum.A_TYPE.getCode(), typeADiscountStrategy);

                 strategyMap.put(OrderTypeEnum.B_TYPE.getCode(), typeBDiscountStrategy);

                 strategyMap.put(OrderTypeEnum.C_TYPE.getCode(), typeCDiscountStrategy);


       }
}


// 


@Component
public class DiscountStrategyExecutor {


       private DiscountStrategyFactory discountStrategyFactory;


                 public void discount(OrderBO orderBO) {


                 DiscountStrategy discountStrategy = discountStrategyFactory.getStrategy(orderBO.ge

                 if (null == discountStrategy) {


                  throw new RuntimeException("               ");


                 }

                 discountStrategy.discount(orderBO);


       }
}


3.5.2 







// 


public interface CreateOrderService {

       public void createOrder(OrderBO orderBO);


}


     // 
                                                                                            21/33

            public abstract class AbstractCreateOrderFlow {
https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw
2022/6/12 21:46     abstract  class  AbstractCreateOrderFlowDD{D

            public

@Resource

private OrderMapper orderMapper;


public void createOrder(OrderBO orderBO) {


   // 


                    if (null == orderBO) {

                         throw new RuntimeException("        ");


                    }


                    if (OrderTypeEnum.isNotValid(orderBO.getType())) {


                         throw new RuntimeException("        ");


                    }


                    // 


                    discount(orderBO);


                    // 


                    weighing(orderBO);


                    // 


                    supportRefund(orderBO);


                    // 


       OrderDO orderDO = new OrderDO();


       BeanUtils.copyProperties(orderBO, orderDO);

       orderMapper.insert(orderDO);

}

public abstract void discount(OrderBO orderBO);


public abstract void weighing(OrderBO orderBO);


       public abstract void supportRefund(OrderBO orderBO);

}


// 


@Service

public class CreateOrderFlow extends AbstractCreateOrderFlow {


@Resource

private DiscountStrategyExecutor discountStrategyExecutor;

@Resource

private ExpressStrategyExecutor expressStrategyExecutor;

@Resource

private RefundStrategyExecutor refundStrategyExecutor;


                   @Override
                                            22/33
                   public void discount(OrderBO orderBO) {

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw
2022/6/12 21:46                                                            DDD
                   }  discountStrategyExecutor.discount(orderBO);


@Override


public void weighing(OrderBO orderBO) {

       expressStrategyExecutor.weighing(orderBO);


}

@Override


public void supportRefund(OrderBO orderBO) {


                      refundStrategyExecutor.supportRefund(orderBO);


       }
}


3.5.3 




https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw                               23/33
2022/6/12 21:46                                    DDD






Y

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       24/33
2022/6/12 21:46                                    DDD

3.3.1






https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       25/33
 2022/6/12 21:46                                   DDD
    3.6





https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       26/33
2022/6/12 21:46                                    DDD




https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       27/33
2022/6/12 21:46                                    DDD

     (1) api

DTO

(2) controller

HTTP

(3) service

BO


(4) domain

DMOVODO


(5) dependency

RPC

(6) infrastructure



https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       28/33
2022/6/12 21:46                                    DDD

DMOVO
DO

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       29/33
2022/6/12 21:46                                    DDD

3.7 



Swagger




https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       30/33
2022/6/12 21:46                                    DDD

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       31/33
2022/6/12 21:46  DDD

4 







JAVA 

   JAVA 
 java_fro  nt 

     #8                                                           
                                                   
    ATAM
                                                                                                                  32/33
  

  MySQL

  JAVA

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw
2022/6/12 21:46                                    DDD

https://mp.weixin.qq.com/s/cpvnyzCWduO1r9tp1Yjhsw       33/33

## 配图

### 第 2 页 — 001-p02.jpeg

![001-p02.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/001-p02.jpeg)

### 第 3 页 — 002-p03.jpeg

![002-p03.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/002-p03.jpeg)

### 第 4 页 — 003-p04.jpeg

![003-p04.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/003-p04.jpeg)

### 第 5 页 — 004-p05.jpeg

![004-p05.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/004-p05.jpeg)

### 第 6 页 — 005-p06.jpeg

![005-p06.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/005-p06.jpeg)

### 第 6 页 — 006-p06.jpeg

![006-p06.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/006-p06.jpeg)

### 第 7 页 — 007-p07.jpeg

![007-p07.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/007-p07.jpeg)

### 第 7 页 — 008-p07.jpeg

![008-p07.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/008-p07.jpeg)

### 第 8 页 — 009-p08.jpeg

![009-p08.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/009-p08.jpeg)

### 第 8 页 — 010-p08.jpeg

![010-p08.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/010-p08.jpeg)

### 第 9 页 — 011-p09.jpeg

![011-p09.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/011-p09.jpeg)

### 第 9 页 — 012-p09.jpeg

![012-p09.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/012-p09.jpeg)

### 第 10 页 — 013-p10.jpeg

![013-p10.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/013-p10.jpeg)

### 第 10 页 — 014-p10.jpeg

![014-p10.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/014-p10.jpeg)

### 第 11 页 — 015-p11.jpeg

![015-p11.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/015-p11.jpeg)

### 第 12 页 — 016-p12.jpeg

![016-p12.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/016-p12.jpeg)

### 第 13 页 — 017-p13.jpeg

![017-p13.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/017-p13.jpeg)

### 第 14 页 — 018-p14.jpeg

![018-p14.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/018-p14.jpeg)

### 第 15 页 — 019-p15.jpeg

![019-p15.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/019-p15.jpeg)

### 第 15 页 — 020-p15.jpeg

![020-p15.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/020-p15.jpeg)

### 第 19 页 — 021-p19.jpeg

![021-p19.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/021-p19.jpeg)

### 第 23 页 — 022-p23.jpeg

![022-p23.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/022-p23.jpeg)

### 第 24 页 — 023-p24.jpeg

![023-p24.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/023-p24.jpeg)

### 第 25 页 — 024-p25.jpeg

![024-p25.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/024-p25.jpeg)

### 第 26 页 — 025-p26.jpeg

![025-p26.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/025-p26.jpeg)

### 第 27 页 — 026-p27.jpeg

![026-p27.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/026-p27.jpeg)

### 第 28 页 — 027-p28.jpeg

![027-p28.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/027-p28.jpeg)

### 第 29 页 — 028-p29.jpeg

![028-p29.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/028-p29.jpeg)

### 第 29 页 — 029-p29.jpeg

![029-p29.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/029-p29.jpeg)

### 第 30 页 — 030-p30.jpeg

![030-p30.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/030-p30.jpeg)

### 第 30 页 — 031-p30.jpeg

![031-p30.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/031-p30.jpeg)

### 第 31 页 — 032-p31.jpeg

![032-p31.jpeg](images/长文多图-结合DDD讲清楚编写技术方案的七大维度/032-p31.jpeg)


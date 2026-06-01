---
title: "立体式校验保护，让你的系统避免 90% 以上的 bug"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

1\. 概览
------

在实际开发过程中，数据校验是最为重要的一环，问题数据一旦进入系统，将对系统造成不可估量的损失。轻者，查询时触发空指针异常，导致整个页面不可用；重者，业务逻辑错误，造成流量甚至金钱上的损失。

### 1.1. 背景

数据校验，天天都在做，但因此而引起的bug也一直没有中断。没有经验的同学精力只定在正常流程，对于边界条件视而不见；有经验的同学，编写大量的代码，对数据进行验证，确实大幅提升了系统的健壮性，但也耗费了大量精力。

对此，我们需要：

1.  一套完整方法论和工具，对系统进行立体式防护；

2.  简单快捷，快速接入，降低开发负担；


### 1.2. 目标

首先，先看下应用程序架构，其中的每一个层次都需不同的验证机制进行保障。

![图片](https://mmbiz.qpic.cn/mmbiz_png/1VypI7lng9wzB6zuibKnbcAgFVRuXeXia4Lcibgcr4OLjgwExo5bBTibAKEpXjkib3fIiczDrAlqIQecJwjAATTlEkicg/640?wx_fmt=png "常用应用架构")

常用应用架构

构建完整的验证体系，从各个层次对应用服务提供保护，需考虑：

1.  应用层参数验证，包括：


*   入参验证

*   嵌入对象验证

*   自定义逻辑验证


3.  领域层业务验证。


*   业务规则插件化


5.  存储层规则验证；


*   入库前规则校验


2\. 快速入门
--------

### 2.1. Spring Validator 入门

Spring 对 Validator 提供了支持，可以对简单属性进行验证，大大降低编码量。

添加 vlidator starter 依赖，具体如下：

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

```

Starter 会自动引入 hibernate-validator，并完成与 Spring MVC 和 Spring AOP 的集成。此时，便可以使用验证注解对入参或属性进行标注，Bean Validation 内置的注解如下：

| 注解 | 含义 |
| --- | --- |
| @Valid | 标记的元素为一个对象，对其所有字段进行检测 |
| @Null | 被标注的元素必须为 null |
| @NotNull | 被标注的元素必须不为 null |
| @AssertTrue | 被标记的元素必须为 true |
| @AssertFalse | 被标记的元素必须为 false |
| @Min(value) | 被标记的元素为数值，并且大于等于最小值 |
| @Max(value) | 被标记的元素为数值，并且小于等于最大值 |
| @DecimalMin(value) | 被标记的元素为数值，并且大于等于最小值 |
| @DecimalMax(value) | 被标记的元素为数值，并且小于等于最大值 |
| @Size(max, min) | 被标记的元素必须指定范围内 |
| @Digits (integer, fraction) | 被注释的元素必须是一个数字，其值必须在可接受的范围内 |
| @Past | 被注释的元素必须是一个过去的日期 |
| @Future | 被注释的元素必须是一个将来的日期 |
| @Pattern(value) | 被注释的元素必须符合指定的正则表达式 |

Hibernat Validator 扩展注解如下：

| 注解 | 含义 |
| --- | --- |
| @Email | 被标注的元素必须是邮箱 |
| @Length(min=, max=) | 被标注的字符串必须在指定范围内 |
| @NotEmpty | 被标注的字符串不能为空串 |
| @Range(min=, max=) | 被标注的元素必须在指定范围内 |
| @NotBlank | 被标注的字符串不能为空串 |
| @URL(protocol=,host=, port=, regexp=, flags=) | 被标记的元素必须为有效的 url |
| @CreditCardNumber | 被注释的字符串必须通过Luhn校验算法，银行卡，信用卡等号码一般都用Luhn计算合法性 |
| @ScriptAssert(lang=, script=, alias=) | 要有Java Scripting API 即JSR 223 的实现 |
| @SafeHtml(whitelistType=, additionalTags=) | classpath中要有jsoup包 |

### 2.2. 基础参数验证

基础参数验证是最简单的验证，直接使用 validator 提供的注解便可完成验证。

#### 2.2.1. 开启验证 AOP

在接口或实现类上添加 @Validated 注解，将启动 MethodValidationInterceptor 对方法进行验证拦截。

具体代码如下：

```
@Validated
public interface ApplicationValidateService {
}

```

> 建议将 @Validated 注解添加到接口上，其所有实现类都会开启方法验证。

#### 2.2.2. 简单类型入参验证

简单类型是最常见的入参，如需对其进行验证，只需在入参上添加对应注解即可，示例如下：

```
void singleValidate(@NotNull(message = "id 不能为null") Long id);

```

运行测试用例:

```
applicationValidateService.singleValidate((Long) null);

```

抛出如下异常：

```
javax.validation.ConstraintViolationException: singleValidate.id: id 不能为null
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

#### 2.2.3. 对象类型入参验证

为了方便，经常将多个属性封装到一个对象中，并使用该对象作为入参，如果想对对象类型的入参进行验证需要：

1.  在对象的属性上根据需求增加验证注解，示例如下：


```
@Data
public class SingleForm {
    @NotNull(message = "id不能为null")
    private Long id;

    @NotEmpty(message = "name不能为空")
    private String name;
}
```

2.  在方法入参处使用 @Valid 注解，示例如下：


```
void singleValidate(@Valid @NotNull(message = "form 不能为 null") SingleForm singleForm);

```

此时，singleValidate 便拥有：

1.  singleForm 入参不能为空验证

2.  singleForm 示例属性验证


*   id 不能为null

*   name 不能为空


运行单元测试：

```
this.applicationValidateService.singleValidate((SingleForm) null);

```

抛出如下异常：

```
javax.validation.ConstraintViolationException: singleValidate.singleForm: form 不能为 null
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

运行单元测试：

```
SingleForm singleForm = new SingleForm();
this.applicationValidateService.singleValidate(singleForm);

```

抛出如下异常：

```
javax.validation.ConstraintViolationException: singleValidate.singleForm.name: name不能为空, singleValidate.singleForm.id: id不能为null
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

### 2.3. 扩展 Validation 框架

有时仅仅验证单个属性无法满足业务需求，比如在修改密码时，需要用户输入两次密码，用以保障输入密码的准确性。

在这种情况下，可以对 Validation 框架进行扩展，具体如下：

1.  创建一个验证对象 Password，用于存储两次输入的值，示例如下：


```
@Data
public class Password {
    @NotEmpty(message = "密码不能为空")
    private String input1;

    @NotEmpty(message = "确认密码不能为空")
    private String input2;
}
```

其中，Password 中的两个属性全部添加了验证注解。

2.  创建一个验证组件 PasswordValidator，用于对“两次密码是否一致”进行验证，示例如下：


```
public class PasswordValidator implements ConstraintValidator<PasswordConsistency, Password> {

    @Override
    public boolean isValid(Password password, ConstraintValidatorContext constraintValidatorContext) {
        if (password == null){
            return true;
        }
        if (password.getInput1() == null){
            return true;
        }
        if (password.getInput1().equals(password.getInput2())){
            return true;
        }
        return false;
    }
}
```

验证组件实现 ConstraintValidator 接口，仅当两次密码一致时通过验证。

3.  创建验证注解 PasswordConsistency，代码如下：


```
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = PasswordValidator.class
)
public @interface PasswordConsistency {
    String message() default "{javax.validation.constraints.password.consistency.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

其中 @Constraint 用于说明该注解使用的验证器为 PasswordValidator。

一切准备好之后，并可以使用自定义验证组件，具体如下：

```
void customSingleValidate(@NotNull @Valid @PasswordConsistency(message = "两次密码不相同") Password password);

```

其中

1.  @NotNull 表明入参 password 不能为 null

2.  @Valid 表明对Password 的属性进行校验

3.  @PasswordConsistency 表明使用 PasswordValidator 进行验证


运行单元测试：

```
this.applicationValidateService.customSingleValidate(null);

```

运行结果如下：

```
javax.validation.ConstraintViolationException: customSingleValidate.password: 不能为null
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

运行单元测试：

```
Password password = new Password();
this.applicationValidateService.customSingleValidate(password);

```

运行结果如下：

```
javax.validation.ConstraintViolationException: customSingleValidate.password.input1: 密码不能为空, customSingleValidate.password.input2: 确认密码不能为空
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

运行单元测试：

```
Password password = new Password();
password.setInput1("123");
password.setInput2("456");
this.applicationValidateService.customSingleValidate(password);

```

运行结果如下：

```
javax.validation.ConstraintViolationException: customSingleValidate.password: 两次密码不相同
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

### 2.4. 添加 Validateable 验证

扩展验证规则非常繁琐，一个验证需要新建注解和验证类，并完成两者的配置，在实际开发中使用的频次极低。

相反，在开发中更习惯调用对象上的验证方法进行数据验证，示例如下：

```
if(!createUserCommand.validate()){
    throw new XXXXException();
}

```

对于这种非常通用的解决方案，lego 提供了框架支持。

#### 2.4.1. 引入 lego starter

在配置文件中添加 lego starter，示例如下：

```
<dependency>
    <groupId>com.geekhalo.lego</groupId>
    <artifactId>lego-starter</artifactId>
    <version>0.1.6-validator-SNAPSHOT</version>
</dependency>

```

基于 Spring Boot 的自动配置机制，ValidatorAutoConfiguration 将自动添加 ValidateableMethodValidationInterceptor，对方法进行拦截，进行数据校验。

#### 2.4.2. 应用 Validateable

比如，用户注册时，系统要求密码与用户名不能相同。使用 Validateable 进行验证具体如下：  
让对象继承自 Validateable，并实现 validate 接口，示例代码如下：

```
@Data
public class UserValidateForm implements Validateable {
    @NotEmpty
    private String name;

    @NotEmpty
    private String password;

    @Override
    public void validate(ValidateErrorHandler validateErrorHandler) {
        if (getName().equals(getPassword())){
            validateErrorHandler.handleError("user", "1", "用户名密码不能相同");
        }
    }
}
```

验证方法如下：

```
void validateForm(@NotNull @Valid UserValidateForm userValidateForm);

```

运行单元测试：

```
this.applicationValidateService.validateForm(null);

```

运行结果如下：

```
javax.validation.ConstraintViolationException: validateForm.userValidateForm: 不能为null
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

运行单元测试：

```
UserValidateForm userValidateForm = new UserValidateForm();
this.applicationValidateService.validateForm(userValidateForm);

```

运行结果如下：

```
javax.validation.ConstraintViolationException: validateForm.userValidateForm.name: 不能为空, validateForm.userValidateForm.password: 不能为空
    at org.springframework.validation.beanvalidation.MethodValidationInterceptor.invoke(MethodValidationInterceptor.java:120)
    at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)
    at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:763)

```

运行单元测试：

```
UserValidateForm userValidateForm = new UserValidateForm();
userValidateForm.setName("name");
userValidateForm.setPassword("name");
this.applicationValidateService.validateForm(userValidateForm);

```

运行结果如下：

```
javax.validation.ConstraintViolationException: null: 用户名密码不能相同
    at com.geekhalo.lego.starter.validator.ValidatorAutoConfiguration.lambda$validateErrorReporter$1(ValidatorAutoConfiguration.java:61)
    at com.geekhalo.lego.starter.validator.ValidatorAutoConfiguration$$Lambda$749/562345204.handleErrors(Unknown Source)
    at com.geekhalo.lego.core.validator.ValidateableMethodValidationInterceptor.invoke(ValidateableMethodValidationInterceptor.java:39)

```

### 2.5. 业务规则插件化

在一些复杂流程中，业务规则校验逻辑占比非常重，大量的 if-else 充斥在主流程中非常不便于维护。

在这种场景下，建议将验证组件插件化，使得每个验证逻辑全部封装在一个类中，将逻辑进行拆分，最终实现“开闭原则”。

#### 2.5.1. 初识 ValidateService

ValidateService 整体架构如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/1VypI7lng9wzB6zuibKnbcAgFVRuXeXia4RKxLy4WuB42fUlDgVW8FZSunsCZibCB0b0Cy933dpVLf9ibHP2kibnxUA/640?wx_fmt=png "image")

image

其中，包括两个核心组件：

1.  BeanValidator。业务验证接口，由开发人员实现，用于承载验证逻辑，包括：


*   support 方法（继承自SmartComponent）用于定义组件应用场景

*   validate 方法，实现业务逻辑


3.  ValidateService。验证服务的入口，主要职责包括：


*   管理所有的 BeanValidator 实现，由 Spring 完成所有的 BeanValidator 实例注入，并对其进行统一管理；

*   对外提供 validate 方法，从 BeanValidator 实例中选择对应的组件，并调用 BeanValidator 的 validate 方法；


整体介绍完成后，让我们看一个真实案例。比如，在一个生单流程中，我们需要保障：

1.  用户必须存在，并且为可用状态；

2.  商品必须存在，并且为售卖状态；

3.  库存余量必须大于购买数量；


这三个规则相互独立，没有太多关联关系，如果在一个方法中编写，便会产生强耦合，不利于应对未来的变更。这种情况下，最佳方案是将其封装到不同的组件中。示例如下：

1.  UserStatusValidator


```
@Order(1)
@Component
public class UserStatusValidator
        extends FixTypeBeanValidator<CreateOrderContext> {

    @Override
    public void validate(CreateOrderContext context, ValidateErrorHandler validateErrorHandler) {
        if (context.getUser() == null){
            validateErrorHandler.handleError("user", "1", "用户不存在");
        }
        if (!context.getUser().isEnable()){
            validateErrorHandler.handleError("user", "2", "当前用户不可以");
        }
    }
}
```

2.  ProductStatusValidator


```
@Component
@Order(2)
public class ProductStatusValidator
        extends FixTypeBeanValidator<CreateOrderContext> {

    @Override
    public void validate(CreateOrderContext context, ValidateErrorHandler validateErrorHandler) {
        if(context.getProduct() == null){
            validateErrorHandler.handleError("product", "2", "商品不存在");
        }
        if (!context.getProduct().isSaleable()){
            validateErrorHandler.handleError("product", "3", "商品不可售卖");
        }
    }
}
```

3.  StockCapacityValidator


```
@Component
@Order(3)
public class StockCapacityValidator
        extends FixTypeBeanValidator<CreateOrderContext> {

    @Override
    public void validate(CreateOrderContext context, ValidateErrorHandler validateErrorHandler) {
        if (context.getStock() == null){
            validateErrorHandler.handleError("stock", "3", "库存不存在");
        }
        if (context.getStock().getCount() < context.getCount()){
            validateErrorHandler.handleError("stock", "4", "库存不足");
        }
    }
}
```

三个验证组件具有以下特征：

1.  继承自 FixTypeBeanValidator

    ，仅对 CreateOrderContext 进行处理
2.  使用 @Component 将其声明为 Spring 的托管bean，从而被框架所感知；

3.  使用 @Order(n) 标记运行顺序


其中，FixTypeBeanValidator 会根据泛型进行类型判断，自动完成组件的筛选。代码如下：

```
public abstract class FixTypeBeanValidator<A> implements BeanValidator<A>{
    private final Class<A> type;

    protected FixTypeBeanValidator(){
        Class<A> type = (Class<A>)((ParameterizedType)getClass()
                .getGenericSuperclass())
                .getActualTypeArguments()[0];
        this.type = type;
    }

    protected FixTypeBeanValidator(Class<A> type) {
        this.type = type;
    }

    @Override
    public final boolean support(Object a) {
        return this.type.isInstance(a);
    }
}
```

有了验证组件后，可以直接使用 ValidateService 进行验证，具体示例代码如下：

```
@Override
public void createOrder(CreateOrderContext context) {
    validateService.validate(context);
}

```

运行测试用例：

```
CreateOrderContext context = new CreateOrderContext();
context.setUser(User.builder()
        .build());
context.setProduct(Product.builder()
        .build());
context.setStock(Stock.builder()
        .count(0)
        .build());
context.setCount(1);
this.domainValidateService.createOrder(context);

```

运行结果如下：

```
ValidateException(name=stock, code=4, msg=库存不足)
    at com.geekhalo.lego.core.validator.BeanValidator.lambda$validate$0(BeanValidator.java:17)
    at com.geekhalo.lego.core.validator.BeanValidator$$Lambda$1383/1570024586.handleError(Unknown Source)
    at com.geekhalo.lego.validator.StockValidator.validate(StockValidator.java:24)
    at com.geekhalo.lego.validator.StockValidator.validate(StockValidator.java:13)

```

该设计符合开闭原则：

1.  新增验证规则时，只需编写新的验证组件；

2.  修改验证规则时，只需修改对应的验证组件，其他逻辑不受影响；


#### 2.5.2. 与 LazyLoad 集成

有了灵活的验证体系，最麻烦的就是对 Context 的维护，主要矛盾为：

1.  如果一次性加载 Context 的全部数据，可能在第一个验证组件就中断流程，白白加载了过多数据；

2.  可以在获取的时候进行判断，只有为 null 的时候才进行加载。但，如果多个组件依赖同一组数据，将会：


*   每个组件都需要写一遍加载逻辑

*   为了避免多次加载，需要将数据写回到 Context 实例

*   加载逻辑和验证逻辑放在一起，职责混乱


对于这种情况，最好的方式便是让 Context 具有延时加载的能力，其特征如下：

1.  只有在调用 getter 方法时，才触发加载，避免全部加载产生的浪费

2.  成功加载后，将数据通过 setter 写回到 Context，由其他组件进行共享


这正是 LazyLoad 的设计初衷，示例如下：  
定义一个具有延时加载能力的 Context，代码如下：

```
@Data
public class CreateOrderContextV2 implements CreateOrderContext{

    private CreateOrderCmd cmd;

    @LazyLoadBy("#{@userRepository.getById(cmd.userId)}")
    private User user;

    @LazyLoadBy("#{@productRepository.getById(cmd.productId)}")
    private Product product;

    @LazyLoadBy("#{@addressRepository.getDefaultAddressByUserId(user.id)}")
    private Address defAddress;

    @LazyLoadBy("#{@stockRepository.getByProductId(product.id)}")
    private Stock stock;

    @LazyLoadBy("#{@priceService.getByUserAndProduct(user.id, product.id)}")
    private Price price;
}
```

基于 CreateOrderContextV2 编写验证组件，代码如下：

```
@Component
@Order(3)
public class StockCapacityV2Validator
        extends FixTypeBeanValidator<CreateOrderContextV2> {

    @Override
    public void validate(CreateOrderContextV2 context, ValidateErrorHandler validateErrorHandler) {
        if (context.getStock() == null){
            validateErrorHandler.handleError("stock", "3", "库存不存在");
        }
        if (context.getStock().getCount() < context.getCmd().getCount()){
            validateErrorHandler.handleError("stock", "4", "库存不足");
        }
    }
}
```

编写验证服务，代码如下：

```
@Override
public void createOrder(CreateOrderCmd cmd) {
    CreateOrderContextV2 context = new CreateOrderContextV2();
    context.setCmd(cmd);
    CreateOrderContextV2 contextProxy = this.lazyLoadProxyFactory.createProxyFor(context);
    this.validateService.validate(contextProxy);
}

```

lazyLoadProxyFactory 生成具有延迟加载能力的 Context 对象。

运行单元测试，核心代码如下：

```
CreateOrderCmd cmd = new CreateOrderCmd();
cmd.setCount(10000);
cmd.setProductId(100L);
cmd.setUserId(100L);
this.domainValidateService.createOrder(cmd);

```

运行结果如下：

```
ValidateException(name=stock, code=4, msg=库存不足)
    at com.geekhalo.lego.core.validator.BeanValidator.lambda$validate$0(BeanValidator.java:17)
    at com.geekhalo.lego.core.validator.BeanValidator$$Lambda$1388/1691696909.handleError(Unknown Source)
    at com.geekhalo.lego.validator.StockCapacityV2Validator.validate(StockCapacityV2Validator.java:25)
    at com.geekhalo.lego.validator.StockCapacityV2Validator.validate(StockCapacityV2Validator.java:14)
    at com.geekhalo.lego.core.validator.BeanValidator.validate(BeanValidator.java:16)
    at com.geekhalo.lego.core.validator.ValidateService.lambda$validate$5(ValidateService.java:34)

```

### 2.6. 持久化前规则验证

将问题数据写入到数据库是一个高危操作，轻则出现展示问题，比如 空指针异常；重则出现逻辑问题，比如金额对不上等。

一个最常见的例子便是 订单系统的金额计算。随着业务的发展，金额计算变得越来越复杂，比如优惠券、满赠、满减、VIP 用户折扣等，这些业务都会对 订单上的金额进行操作，一旦出现bug将导致严重的问题。

由于上层的更新入口太多，很难有一套行之有效的机制保障其不出问题。不如换个视角，在将变更同步到数据库前，有没有一种比较通用的检测机制能发现金额问题？

其实是有的，无论上层业务怎么变化，金额恒等式是不变的，及：

```
用户支付金额 = 商品总售卖金额(售价 * 数量) - 优惠总金额 - 手工改价金额

```

只需在变更写回数据库前运行校验逻辑，如果不符合公式，则直接抛出异常。

很多框架都提供了对实体生命周期的扩展，比如 JPA 就提供了大量注解，以便在实体生命周期中嵌入回调方法。

以标准的Order设计为例，具体如下：

```
@Entity
@Table(name = "validate_order")
@Data
public class ValidateableOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 支付金额
     */
    private Integer payPrice;

    /**
     * 售价
     */
    private Integer sellPrice;

    /**
     * 购买数量
     */
    private Integer amount;

    /**
     * 折扣价
     */
    private Integer discountPrice;

    /**
     * 手工改价
     */
    private Integer manualPrice;

    @PrePersist
    @PreUpdate
    void checkPrice(){
        Integer realPayPrice = sellPrice * amount - discountPrice - manualPrice;

        if (realPayPrice != payPrice){
            throw new ValidateException("order", "570", "金额计算错误");
        }
    }
}
```

其中，@PrePersist 和 @PreUpdate 注解表明，checkPrice 方法在保存前和更新前进行回调，用以验证是否破坏了金额计算逻辑。

使用 JpaRepository 对数据进行保存，具体如下：

```
public void createOrder(ValidateableOrder order){
    this.repository.save(order);
}

```

运行单元测试，代码如下：

```
ValidateableOrder order = new ValidateableOrder();
order.setSellPrice(20);
order.setAmount(2);
order.setDiscountPrice(5);
order.setManualPrice(1);

order.setPayPrice(35);
this.applicationService.createOrder(order);
```

运行结果如下：

```
ValidateException(name=order, code=570, msg=金额计算错误)
    at com.geekhalo.lego.validator.ValidateableOrder.checkPrice(ValidateableOrder.java:53)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:483)
    at org.hibernate.jpa.event.internal.EntityCallback.performCallback(EntityCallback.java:50)

```

不仅如此，Spring 对事务进行回滚，避免脏数据进入到数据库。

3\. 小结
------

对应用程序提供一套立体式的验证保障机制，包括：

1.  应用层的基础数据校验

2.  业务层的业务逻辑校验

3.  存储层的持久化前校验


这些措施共同发力，彻底将问题数据拒绝于系统之外。

4\. 项目信息
--------

项目仓库地址：https://gitee.com/litao851025/lego

项目文档地址：https://gitee.com/litao851025/lego/wikis/support/validator

> 本文使用 [文章同步助手](https://juejin.cn/post/6940875049587097631) 同步
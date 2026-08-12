---
title: "如何写好 Java 业务代码？这也是有很多规范"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/new_com/article/details/108399421)

为什么要写好业务代码？
-----------

直接分享一段痛苦的项目维护经历吧，看大家有没有类似的经历。当时，我接手了一个维护项目，刚上班就接到新增一个显示字段的任务。我以为这应该是一个分分钟就能够搞定的小需求，没有想到这就开始了我的痛苦之旅。我梳理了关联的 [api](https://so.csdn.net/so/search?q=api&spm=1001.2101.3001.7020) 后，发现每个 api 都是从 controller 控制层 -》service-》服务层 - dao 数据层，甚至每个 api 都对应一个 sql 查询；但是，所有的 api 之间又有很大类似的代码。我开始阅读代码的时候，发现一个特殊的 controller，在该 controller 里包括身份校验，参数校验，各种业务代码，各种 if else，for 循环语句，甚至 dao 层的逻辑都融到了一块。更让人悲痛欲绝的是项目没有文档，代码也几乎没注释，没有测试用例，我还是直接撸代码梳理业务，很多属性字段无法理解到底代表什么，例如，ajAmount，gjjAmount；在 sql 语句中写 status in（1，2，4，6），case when，等很多魔法数条件判断。我最后直接抓包调用了一下 api，然后，通过与页面的展示端字段匹配我才知道 ajAmount，gjjAmount 分别表示按揭贷款，公积金代码，status 的部分字段是什么意思。这样的项目维护经历，你有没有类似的经历？

个人认为，只要我们做到 api 拒绝**烟囱式开发**，业务代码拒绝 **All in one**，项目做好**代码注释**，就可以写出易阅读，好扩展的代码**。**

### **api 如何拒绝烟囱式开发**

上述的 api 开发开发过程就是典型的**烟囱式开发模式**，所有的 api 服务与相似业务，但是每个 api 都是完全独立的开发，其开发流程如图：

![][img-0]

如上的开发流程有几个弊端，如下：

1.  业务代码重复，在不同的 service 实现中，业务相似的话会有大量重复代码。
2.  数据库表结构的改动需要修改所有涉及到的 dao 层，维护成本比较高。

此类相似业务，api 层定义各自**显示对象**，dao 层负责获取**全量数据（例如，用户查询，就获取整个用户表字段的数据）**，service 层定义**业务对象**，根据不同 api 不同业务类型的判断，根据 dao 查询的数据组转业务对象，以及业务对象向 api 显示对象的转换。开发流程如图：

![][img-1]

这样的开发模式有如下优势：

1.  业务代码集中在 service 层，专注业务对象 bo 的封装，以及业务对象向给类显示层 vo 的转换；封装复用逻辑，可以大量减少重复代码。如果，设计模式从一开始就设计得易扩展，后期维护就快捷的多。
2.  数据库的改动只涉及到 db 层，能够快速的在各个业务响应。

### **业务代码如何拒绝 All in one？**

以上的 controller 代码最突出的缺点就是代码完全无法复用，完全没有使用到面向对象封装，集成，多态的特性。业务开发中，一般都是权限校验，参数校验，业务判断，业务对象转换数据库操作。我的做法是业务抽象，把公共代码进行抽取，通过配置的形式的方式调用，使业务代码可以以可插拔的方式选择指定的权限校验，参数校验。简单来说，就是善用 AOP 面向切面编程的思想，示例如下：

*   权限校验：使用 aop 对权限校验逻辑进行抽取，能够通过注解的方式指定哪些 controller 需要进行权限校验。对用户进行数据过滤时，使用 controller 的拦截器获取该用户拥有的各类权限，并把用户数据保存在上下文 threadloal 中，并且通过配置对指定 url 进行拦截。在业务层，从上下文拿到用户权限数据做各类数据业务过滤，通过 aop 实现各类拦截业务的指定调用。 
*   参数校验：使用 java validtion 对通用的字段，例如电话号码，身份证，进行扩展，详细可以参考，[如何使用 validation 校验参数？](https://blog.csdn.net/new_com/article/details/110391773)，在项目中其他类似校验进行复用。
*   业务判断：使用设计模式对不同类型的业务开发进行封装，集成，多态扩展；这样在后期的扩展中可以基于开发封闭原则，针对新的业务扩展子类即可。
*   业务对象转换数：业务开发过程中，依照阿里巴巴研发规范的要求，存在 DO(数据库表结构一致的对象)，BO（业务对象）,DTO(数据传输对象)，VO（显示层对象），Query（查询对象）。使用 [MapStruct](https://blog.csdn.net/zhige_me/article/details/80699784)，可以灵活的控制的不同属性值之间的转换规格，比 org.springframework.beans.BeanUtils.copyProperties() 方法更加灵活。示例：

```
public interface CategoryConverter {
 
    CategoryConverter INSTANCE = Mappers.getMapper(CategoryConverter.class);
 
    @Mappings({
            @Mapping(target = "ext", expression = "java(getCategoryExt(updateCategoryDto.getStyle(),updateCategoryDto.getGoodsPageSize()))")})
    Category update2Category(UpdateCategoryDto updateCategoryDto);
 
    @Mappings({
            @Mapping(target = "ext", expression = "java(getCategoryExt(addCategoryDto.getStyle(),addCategoryDto.getGoodsPageSize()))")})
    Category add2Category(AddCategoryDto addCategoryDto);
}
```

*   DB 数据库公共字段填充，例如，公共字段，生成日期，创建人，修改时间，修改人使用插件的形式进行封装，在 mybatis-plus 中使用 MetaObjectHandler，在执行 sql 之前完成统一字段值的填充。
*   业务平台字段查询过滤：在中台的开发中，数据采用不同平台 code 的列实现不同平台业务数据的隔离。基于 mybatis 插件机制的多租户过滤机制实现可以参考[如何使用 MyBatis 的 plugin 插件实现多租户的数据过滤？](https://blog.csdn.net/new_com/article/details/106693726)。在 dao 层的方法或者接口上加上自定义过滤条件即可，示例如下：

```
@Mapper
@Repository
@MultiTenancy(multiTenancyQueryValueFactory = CustomerQueryValueFactory.class)
public interface ProductDao extends BaseMapper<Product> {
 
}
```

*   缓存的使用：Spring 开发中通常集成 spring cache 使用以注解的形式使用缓存。整合 redis 并且自定义默认时间设置可以参考（[Spring Cache+redis 自定义缓存过期时间](https://blog.csdn.net/new_com/article/details/104303855)）。示例如下：
    
    ```
    /**
       * 使用 CacheEvict 注解更新指定 key 的缓存
       */
     @Override
     @CacheEvict(value = {ALL_PRODUCT_KEY,ONLINE_PRODUCT_KEY}, allEntries = true)
     public Boolean add(ProductAddDto dto) {
     
        //   TODO 添加商品更新 cache
    }
     
    @Override
    @Cacheable(value = {ALL_PRODUCT_KEY})
    public List<ProductVo> findAllProductVo() {
          
        return this.baseMapper.selectList(null);
    }
     
    @Override
    @Cacheable(value = {ONLINE_PRODUCT_KEY})
    public ProductVo getOnlineProductVo() {
          
         //   TODO 设置查询条件
        return this.baseMapper.selectList(query);
    }
    ```
    

### 项目如何做好**代码注释？**

*   枚举类的使用：在业务中特别是状态的值，在对外发布 api 的 vo 对象中，加上状态枚举值的注释，并且使用 @link 注解，可以直接连接到枚举类，让开发者一目了然。示例如下：

```
public class ProductVo implements Serializable {   /**
     * 审核状态
     * {@link ProductStatus}
     */
    @ApiModelProperty(" 状态 ")
    private Integer status;
}
```

*   迁移 sql 查询条件：避免在 sql 层写固定的通用的过滤条件，迁移到服务层做处理。示例如下：

```
// sql 查询条件
 
SELECT * from product
where status != -1 and shop_status != 6
 
 
// 在业务层把各类状态值进行条件设置
public PageData<ProductVo> findCustPage（Query query ）{
 
       // 产品上线, 显示状态
       query.setStatus(ProductStatus.ONSHELF);
       // 产品显示状态
       query.setHideState(HideState.VISIBAL);
       // 店铺未下线
       query.setNotStatus(ShopStatus.OFFLINE);
    return   productService.findProductVoPage(query);
}
```

### 加分项的规范

*   乐观锁与悲观锁的使用

乐观锁 ([使用 Spring AOP + 注解基于 CAS 方式实现 java 的乐观锁](https://blog.csdn.net/new_com/article/details/103834871)) 设置重试次数以及重试时间，在简单的对象属性修改使用乐观锁，示例如下：

```
@Transactional(rollbackFor = Exception.class)
@OptimisticRetry
public void updateGoods(GoodsUpdateDto dto) {
 
        Goods existGoods = this.getGoods(dto.getCode());
 
		// 属性逻辑判断 //
 
		if (0 == goodsDao.updateGoods(existGoods, dto)) {
 
			throw new OptimisticLockingFailureException("update goods optimistic locking failure!");
		}
}
```

悲观锁在业务场景比较复杂，关联关系比较多的情况下使用。例如修改 SKU 属性时，需要修改商品的价格，库存，分类，等等属性，这时可以对关联关系的聚合根产品进行加锁，代码如下：

```
@Transactional
public void updateProduct(Long id,ProductUpdateDto dto){
 
    Product existingProduct;
    // 根据产品 id 对数据加锁
    Assert.notNull(existingProduct = lockProduct(id), " 无效的产品 id！");
  
    
    // TODO 逻辑条件判断 
 
    // TODO 修改商品属性，名称，状态
         
    // TODO 修改价格
 
    // TODO 修改库存
 
    // TODO 修改商品规格
}
```

*   读写分离的使用

开发中，经常使用 mybatisplus 实现读写分离。常规的查询操作，就走从库查询，查询请求可以不加数据库事务，例如列表查询，示例如下：

```
@Override
	@DS("slave_1")
	public List<Product> findList(ProductQuery query) {
 
		QueryWrapper<Product> queryWrapper = this.buildQueryWrapper(query);
		return this.baseMapper.selectList(queryWrapper);
	}
```

mybatisplus 动态数据源默认是主库，写操作为了保证数据一直性，需要加上事务控制。简单的操作可以直接加上 @Transactional 注解，如果写操作涉及到非必要的查询，或者使用到消息中间件，reids 等第三方插件，可以使用声明式事务，避免查询或者第三方查询异常造成**数据库长事务**问题。示例，产品下线时，使用 reids 生成日志 code，产品相关写操作执行完成后，发送消息，代码如下：

```
public void offlineProduct(OfflineProductDto dto){
 
    // TODO 修改操作为涉及到的查询操作
    
    // TODO 使用 redis 生成业务 code
 
    // 使用声明式事务控制产品状态修改的相关数据库操作
boolean status = transactionTemplate.execute(new TransactionCallback<Boolean>() {
   @Nullable
   @Override
   public Boolean doInTransaction(TransactionStatus status) {
      try {
 
         // TODO 更改产品状态
 
      } catch (Exception e) {
         status.setRollbackOnly();
         throw e;
      }
      return true;
   }
});
 
    // TODO 使用消息中间件发送消息
 
}
```

*   数据库自动给容灾

结合配置中心，简单实现数据库的自动容灾。以 nacous 配置中心为例，[如何使用 Nacos 实现数据库连接的自动切换？](https://blog.csdn.net/new_com/article/details/108152630)。在 springboot 启动类加上 @EnableNacosDynamicDataSource 配置注解，即可无侵入的实现数据库连接的动态切换，示例如下 ':

```
@EnableNacosDynamicDataSource
public class ProductApplication {
 
	public static void main(String[] args) {
		SpringApplication.run(ProductApplication.class, args);
	}
 
}
```

*   测试用例的编写

基于 TDD 的原则，结合 junit 和 mockito 实现服务功能的测试用例，[为什么要写单元测试？基于 junit 如何写单元测试？](https://blog.csdn.net/new_com/article/details/116098959)。添加或者修改对象时，需要校验入参的有效性，并且校验操作以后的对象的各类属性。以添加类目的 api 测试用例为例，如下，添加类别，成功后，校验添加参数以及添加成功后的属性，以及其他默认字段例如状态，排序等字段，源码如下：

```
// 添加类别的测试用例
    @Test
    @Transactional
    @Rollback
    public void success2addCategory() throws Exception {
 
        AddCategoryDto addCategoryDto = new AddCategoryDto();
        addCategoryDto.setName(" 服装 ");
        addCategoryDto.setLevel(1);
        addCategoryDto.setSort(1);
        Response<CategorySuccessVo> responseCategorySuccessVo = this.addCategory(addCategoryDto);
        CategorySuccessVo addParentCategorySuccessVo = responseCategorySuccessVo.getData();
        org.junit.Assert.assertNotNull(addParentCategorySuccessVo);
        org.junit.Assert.assertNotNull(addParentCategorySuccessVo.getId());
        org.junit.Assert.assertEquals(addParentCategorySuccessVo.getPid(), ROOT_PID);
        org.junit.Assert.assertEquals(addParentCategorySuccessVo.getStatus(), CategoryEnum.CATEGORY_STATUS_DOWN.getValue());
        org.junit.Assert.assertEquals(addParentCategorySuccessVo.getName(), addCategoryDto.getName());
        org.junit.Assert.assertEquals(addParentCategorySuccessVo.getLevel(), addCategoryDto.getLevel());
        org.junit.Assert.assertEquals(addParentCategorySuccessVo.getSort(), addCategoryDto.getSort());
    }
 
// 新增类目，成功添加后，返回根据 id 查询 CategorySuccessVo
 public CategorySuccessVo add(AddCategoryDto addCategoryDto, UserContext userContext) {
 
        Category addingCategory = CategoryConverter.INSTANCE.add2Category(addCategoryDto);
        addingCategory.setStatus(CategoryEnum.CATEGORY_STATUS_DOWN.getValue());
        if (Objects.isNull(addCategoryDto.getLevel())) {
            addingCategory.setLevel(1);
        }
        if (Objects.isNull(addCategoryDto.getSort())) {
            addingCategory.setSort(100);
        }
        categoryDao.insert(addingCategory);
        return getCategorySuccessVo(addingCategory.getId());
    }
```

也需要对添加类目的参数进行校验，例如，名称不能重复的校验，示例如下：

```
// 添加类目的入参
public class AddCategoryDto implements Serializable {
 
	private static final long serialVersionUID = -4752897765723264858L;
        
    // 名称不能为空，名称不能重复
	@NotEmpty(message = CATEGORY_NAME_IS_EMPTY, groups = {ValidateGroup.First.class})
	@EffectiveValue(shouldBeNull = true, message = CATEGORY_NAME_IS_DUPLICATE, serviceBean = NameOfCategoryForAddValidator.class, groups = {ValidateGroup.Second.class})
	@ApiModelProperty(value = " 类目名称 ", required = true)
	private String name;
 
	@ApiModelProperty(value = " 类目层级 ")
	private Integer level;
 
 
	@ApiModelProperty(value = " 排序 ")
	private Integer sort;
 
}
 
    //添加失败的校验校验测试用例
    @Test
    public void fail2addCategory() throws Exception {
 
        AddCategoryDto addCategoryDto = new AddCategoryDto();
        addCategoryDto.setName(" 服装 ");
        addCategoryDto.setLevel(1);
        addCategoryDto.setSort(1);
 
        // 名称为空
        addCategoryDto.setName(null);
        Response<CategorySuccessVo> errorResponse = this.addCategory(addCategoryDto);
        org.junit.Assert.assertNotNull(errorResponse);
        org.junit.Assert.assertNotNull(errorResponse.getMsg(), CATEGORY_NAME_IS_EMPTY);
        addCategoryDto.setName(" 服装 ");
 
 
        // 成功添加类目
        this.addCategory(addCategoryDto);
         // 名称重复
        errorResponse = this.addCategory(addCategoryDto);
        org.junit.Assert.assertNotNull(errorResponse);
        org.junit.Assert.assertNotNull(errorResponse.getMsg(), CATEGORY_NAME_IS_DUPLICATE);
 
    }
```

[img-0]:images/如何写好-Java-业务代码？这也是有很多规范/p01.png

[img-1]:images/如何写好-Java-业务代码？这也是有很多规范/p02.png
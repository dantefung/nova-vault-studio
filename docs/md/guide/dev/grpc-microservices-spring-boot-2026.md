---
title: "为什么越来越多人用 gRPC？"
date: "2026-08-25"
source: "微信公众号（苏三）"
url: "https://mp.weixin.qq.com/s/DTMscGpqlyytmtZOtfFZ2g"
---

# 为什么越来越多人用 gRPC？

> Spring Cloud 微服务中，核心链路从 REST + JSON 切换到 gRPC，同样的机器配置下 QPS 翻了将近 3 倍，响应时间降到原来的三分之一。Spring Boot 4.1.0 已官方支持 gRPC。本文从性能原理、整体架构到 Spring Boot 4.1 实战全流程，带你跑通一个完整的 gRPC 服务。

<!-- more -->

## 前言

有些小伙伴在工作中可能遇到过这样的情况：系统上线后流量涨上来了，服务之间的调用越来越多，响应时间开始飘忽不定。你打开监控一看，明明业务逻辑没变，数据库查询也加了索引，但接口就是越来越慢。这不是代码写得不好，而是服务间通信的"路"太窄了。

前阵子有小伙伴反馈说，他们的架构是典型的 Spring Cloud 微服务，服务间调用全是 REST API + JSON。压测的时候 QPS 跑到 800 左右就开始大面积超时，CPU 先扛不住了——不是业务代码的问题，是序列化和 HTTP 连接的开销把 CPU 吃满了。后来他们做了一个实验：把核心链路里两个高频调用的服务改成 gRPC 通信。同样的业务逻辑、同样的机器配置，**QPS 直接翻了将近 3 倍，响应时间降到了原来的三分之一。**

其实 Spring Boot 4.1.0 已经提供了对 gRPC 的官方支持。gRPC 正在从"小众框架"变成越来越多公司的"默认选择"。

## 一、REST 到底慢在哪？

在聊 gRPC 之前，先搞清楚一个问题——REST API + JSON 到底慢在哪？

**第一，HTTP/1.1 的"一请求一连接"限制。** REST API 通常跑在 HTTP/1.1 上。每个请求都需要建立一个新的 TCP 连接，经历三次握手。请求处理完，连接要么关闭，要么保持有限的 Keep-Alive。高并发下，频繁建立和销毁连接的开销非常大。

**第二，JSON 是文本协议，又大又慢。** JSON 是人类可读的文本格式，每个字段名都要重复传输。一个对象里如果有 10 个字段，每个请求都要把这 10 个字段名再传一遍。数据量一大，网络传输就成了瓶颈。

**第三，序列化/反序列化开销大。** JSON 的解析是文本解析，要把字符串拆成 Token、构建对象树、再映射到 Java 对象。这个过程比二进制解析慢得多。

**第四，没有连接复用。** 每个请求都是独立的，无法在一个连接上同时处理多个请求。

这些问题在低并发时几乎感觉不到，但一旦流量上来，每个问题都会被无限放大。

## 二、gRPC 凭什么快？

gRPC 的核心优势，源自它底层两个关键技术。

### 2.1 HTTP/2：连接复用，干掉握手开销

gRPC 跑在 HTTP/2 上，跟 HTTP/1.1 有本质区别：

| 特性 | HTTP/1.1 | HTTP/2 |
|------|----------|--------|
| 连接模型 | 每个请求一个连接 | 一个连接多路复用 |
| 连接建立 | 3 次握手 / 请求 | 1 次握手 / 会话 |
| 数据传输 | 文本 | 二进制帧 |
| 并发请求 | 串行 / 有限并行 | 真正的并行 |
| 服务端推送 | ❌ | ✅ |

HTTP/2 最核心的能力是**多路复用**——在一个 TCP 连接上同时处理成百上千个请求，互不阻塞。

### 2.2 Protobuf：比 JSON 小 60%，快 5 倍

gRPC 默认使用 Protocol Buffers（Protobuf）作为序列化协议。Protobuf 是二进制的，不需要把字段名转成字符串传输，只传字段编号和值。

实测数据：Protobuf 序列化后的体积比 JSON 减少 60%-80%，序列化速度提升 3-5 倍。

| 指标 | REST + JSON | gRPC + Protobuf |
|------|-------------|-----------------|
| 数据体积 | 基准 | 减少 60%-80% |
| 序列化速度 | 基准 | 提升 3-5 倍 |
| 连接建立 | 3 RTT | 1 RTT |
| 请求延迟 | 8-12 ms | 2-3 ms |
| 吞吐量 | 450 req/s | 1200 req/s |

"一次握手，多次使用"在高并发场景下，这个差距会被无限放大。

## 三、一张图看懂 gRPC 的整体架构

gRPC 的架构中**契约层（Proto 文件）**是核心。它定义了服务接口和数据结构，然后通过代码生成工具生成客户端和服务端的骨架代码。客户端和服务端都基于同一份 Proto 文件生成代码，保证了类型安全和跨语言一致性。

> 图：gRPC 整体架构——Proto 契约层（定义服务接口和数据结构）通过 protoc 代码生成器，输出客户端 Stub 和服务端骨架，两端基于同一份 Proto 保证类型安全和跨语言一致性。

## 四、一个完整的 gRPC 服务

### 4.1 第一步：定义 Proto 文件

```proto
syntax = "proto3";

package com.example.grpc;

option java_package = "com.example.grpc";
option java_outer_classname = "UserProto";

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
}

message GetUserRequest {
  int32 id = 1;
}

message GetUserResponse {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message CreateUserResponse {
  bool success = 1;
  int32 id = 2;
}
```

### 4.2 第二步：添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-grpc</artifactId>
</dependency>
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-services</artifactId>
</dependency>
```

Maven 构建生成 Stub 代码，在 IntelliJ IDEA 中将生成目录标记为 Generated Source Root。

### 4.3 第三步：实现服务端

```java
@GrpcService
public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {

    @Override
    public void getUser(GetUserRequest request, StreamObserver<GetUserResponse> responseObserver) {
        GetUserResponse response = GetUserResponse.newBuilder()
                .setId(request.getId())
                .setName("张三")
                .setEmail("zhangsan@example.com")
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
```

`@GrpcService` 的作用和 `@Service` 或 `@RestController` 类似。

### 4.4 第四步：配置服务端

`application.yml`：

```yaml
spring:
  grpc:
    server:
      address: 0.0.0.0
      port: 9090
```

默认就是 9090 端口，用的是 Netty 传输。反射默认注册，用 grpcurl 配合 `-plaintext` 就能直接测试。

启动后用 grpcurl 测试：

```bash
grpcurl -plaintext localhost:9090 com.example.grpc.UserService/GetUser '{"id": 1}'
```

### 4.5 第五步：客户端调用

在启动类上添加 `@ImportGrpcClients`，配置客户端：

```yaml
spring:
  grpc:
    client:
      user-service:
        target: static://localhost:9090
```

注入并使用 Stub：

```java
@RestController
public class UserController {

    private final com.example.grpc.UserServiceGrpc.UserServiceBlockingStub userServiceStub;

    public UserController(GrpcClientFactory clientFactory) {
        this.userServiceStub = clientFactory
                .getGrpcClient("user-service", UserServiceGrpc.UserServiceBlockingStub.class);
    }

    @GetMapping("/user/{id}")
    public GetUserResponse getUser(@PathVariable int id) {
        GetUserRequest request = GetUserRequest.newBuilder().setId(id).build();
        return userServiceStub.getUser(request);
    }
}
```

## 五、Spring Boot 4.1 官方 gRPC 支持

以前想在 Spring Boot 里用 gRPC，基本要靠第三方 starter，或者自己手动配 Server、Channel、拦截器、异常处理。项目一复杂，就开始东拼西凑，排查起来头大。

Spring Boot 4.1.0 把 gRPC 自动配置纳进来了。你只需要把 gRPC 服务注册成 Spring Bean，Boot 就能帮你发现它，再把服务挂到 gRPC Server 上。

### 5.1 统一异常处理（`@GrpcAdvice`）

Spring Boot 4.1 引入了 `@GrpcAdvice` 注解，用于集中处理 gRPC 异常：

```java
@GrpcAdvice
public class GrpcExceptionHandler {

    @GrpcExceptionHandler(NullPointerException.class)
    public Status handleNullPointerException(NullPointerException e) {
        return Status.INTERNAL.withDescription(e.getMessage());
    }
}
```

### 5.2 配置属性变化（Boot 4.0 → 4.1）

| spring-grpc 1.0（Boot 4.0） | Spring Boot 4.1 |
|-----------------------------|-----------------|
| `spring.grpc.client.channels.<name>.address` | `spring.grpc.client.channel.<name>.target` |
| `spring.grpc.client.channels.<name>.default-deadline` | `spring.grpc.client.channel.<name>.default.deadline` |
| `spring.grpc.server.address`（host:port 组合） | `spring.grpc.server.address`（仅地址）+ `spring.grpc.server.port` |
| `spring.grpc.server.health.actuator.*` | `spring.grpc.server.health.*` |

> 关键点：Spring Boot 4.1 的 Gradle 插件不再自动配置 gRPC——只有当 Protobuf 插件被应用时才会触发配置。如果用 Maven，不受这个影响。

## 六、为什么越来越多人用 gRPC？

### 6.1 性能优势是硬道理

gRPC 最直观的优势就是性能。一项 2026 年的基准测试显示，在相同的业务逻辑下，**gRPC 的吞吐量比 REST 高出 107%，延迟降低 48%**。有团队实测，在一项包含 1000 次请求的测试中，REST 的平均延迟约 250 ms，而 gRPC 仅约 25 ms。

在高并发场景下，gRPC 通过 HTTP/2 多路复用避免了频繁建立连接的开销，吞吐量优势会非常明显。另一项针对 API 协议的对比研究也印证了这一点：gRPC 在处理小消息负载时延迟最短，非常适合微服务间的内部通信。

### 6.2 流式通信，不止一问一答

gRPC 支持四种通信模式：

| 模式 | 说明 | 典型场景 |
|------|------|----------|
| Unary | 一问一答 | 普通 RPC 调用 |
| Server Streaming | 客户端发一个请求，服务端流式返回 | 实时日志、事件推送 |
| Client Streaming | 客户端流式发送，服务端一次返回 | 文件上传、批量数据提交 |
| Bidirectional Streaming | 双向流式通信 | 实时聊天、AI 流式对话 |

这种灵活性让 gRPC 不仅适合传统的请求-响应场景，也非常适合实时数据交互。特别是双向流模式，在 AI Agent 需要实时交互的场景下尤其有价值。

### 6.3 跨语言，一份 Proto 走天下

用 Proto 定义好接口后，可以用 protoc 生成 Java、Go、Python、C++、Node.js、C# 等语言的代码。同一个服务，客户端和服务器可以用不同的语言实现，底层通信完全一致。

### 6.4 强类型契约，接口即文档

Proto 文件本身就是一个精确的接口契约。不用额外写文档，不用手动维护 API 规范。任何一方修改了 Proto，重新生成代码就能发现不兼容的地方。

## 七、gRPC 的挑战与注意事项

gRPC 不是银弹，它也有自己的短板。

| 挑战 | 说明 |
|------|------|
| **浏览器兼容性** | 浏览器原生不支持 gRPC，需要通过 gRPC-Web 代理来转发，增加了架构复杂度 |
| **调试难度** | Protobuf 二进制格式不能直接在浏览器查看，需要 grpcurl、BloomRPC 等专门工具 |
| **学习曲线** | 需要学习 Proto 语法、代码生成、HTTP/2 等概念，对 REST 团队有切换成本 |
| **K8s 负载均衡** | gRPC 使用长连接，K8s 默认 Service 负载均衡会导致连接"粘滞"，需要 Headless Service + 客户端轮询，或引入 Service Mesh |

## 八、优缺点对比

| 对比维度 | REST + JSON | gRPC |
|----------|-------------|------|
| 数据格式 | 文本（JSON） | 二进制（Protobuf） |
| 传输协议 | HTTP/1.1 | HTTP/2 |
| 连接复用 | ❌ | ✅ 多路复用 |
| 序列化大小 | 基准 | 减少 60%-80% |
| 序列化速度 | 基准 | 提升 3-5 倍 |
| 跨语言支持 | 好 | 极好 |
| 流式通信 | ❌ | ✅ 双向流 |
| 浏览器支持 | ✅ 原生 | ⚠️ 需 gRPC-Web |
| 调试难度 | 简单 | 较高 |
| 学习曲线 | 低 | 中等 |
| 适用场景 | 对外 API | 内部微服务 |

## 九、适用场景

| 场景 | 推荐程度 | 理由 |
|------|----------|------|
| 微服务间通信 | ✅✅✅ 强烈推荐 | 性能优势最明显，跨语言支持好 |
| 多语言混合团队 | ✅✅✅ 强烈推荐 | 一份 Proto 生成所有语言代码 |
| 流式数据交互 | ✅✅✅ 强烈推荐 | 原生支持 Server/Client/Bidirectional Streaming |
| AI Agent 实时通信 | ✅✅✅ 强烈推荐 | 双向流模式适合 Agent 实时交互 |
| 高性能网关内部路由 | ✅✅ 推荐 | 内部转发性能远优于 REST |
| 对外公开 API | ⚠️ 需评估 | 浏览器兼容性差 |
| 简单 CRUD 应用 | ⚠️ 需评估 | REST 足够，过度设计 |
| 前端直接调用 | ❌ 不推荐 | 需要 gRPC-Web 代理 |

## 十、写在最后

回到最初的问题：为什么越来越多人用 gRPC？

答案其实不复杂——因为它用 HTTP/2 解决了 HTTP/1.1 的并发瓶颈，用 Protobuf 解决了 JSON 的传输和解析开销。同一个业务逻辑，gRPC 能跑出 REST 两到三倍的吞吐量，响应时间降低一个数量级。在微服务架构中，服务间调用的频率极高，这个差距会被进一步放大。

当然，gRPC 也有自己的短板——浏览器兼容性、调试难度、学习曲线。它不是来取代 REST 的，而是 REST 在内部服务间通信场景下的替代方案。

**我的建议是：如果你在做对外 API，REST 依然是更好的选择。但如果你的系统是微服务架构，服务之间需要高频通信，或者你的团队有多个语言的技术栈——gRPC 值得你花一个下午跑一遍官方示例。**

一条连接复用所有请求，一份 Proto 生成所有语言代码。你会发现，服务间通信可以这么高效。

---

## 文章速查

| 项目 | 内容 |
|------|------|
| **作者** | 苏三 |
| **定位** | gRPC 从原理到 Spring Boot 4.1 实战全流程 |
| **性能收益** | QPS 翻 3 倍，延迟降低 48%，吞吐量提升 107% |
| **核心原因** | HTTP/2 多路复用 + Protobuf 二进制序列化 |
| **框架支持** | Spring Boot 4.1.0 官方提供 gRPC starter |
| **四种模式** | Unary / Server Streaming / Client Streaming / Bidirectional |
| **短板** | 浏览器兼容性 / 调试难度 / 学习曲线 / K8s 长连接粘滞 |
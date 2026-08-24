---
title: "为什么高性能 Web 开发，越来越多人开始选择 Rust？"
date: "2026-08-24"
author: "小牛呼噜噜"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/w8qDIDxTix7AtTFAPINU0A"
---

# 为什么高性能 Web 开发，越来越多人开始选择 Rust？

大家好呀，我是呼噜噜。平时闲暇的时候我们程序员会写一些小项目，比如网页、桌面、app、小程序等等，写完后会想和大家展示，这就有对外服务的需求。

如何对外服务呢？我们一般会把应用的后端核心部分部署到服务器上。这就会有个问题：国内的服务器资源属实不便宜。我个人习惯用 Java + SpringBoot 来快速写业务，但 Java 就比较占内存，而其 starter 框架 SpringBoot 更会吃大量的内存，哪怕是很简单的 demo。

当然对于企业来说内存不算什么问题，但对我个人来说，问题就大了。我的服务器都是每年 618、双十一，各大云服务商搞活动时捡的"破烂"，配置基本就是 1 核 1G 的这种，一台服务器上跑不了几个小 demo。

所以我就一直在尝试用其他语言来开发，比如 Go、Rust，最后选择了 Rust。Rust 是一种速度极快、高性能、注重内存安全的静态编译型语言。

而 Axum 又是 Rust 语言中一个专注于性能和简单性的 Web 框架，试试感觉还不错，符合我的需求。在官方文档里踩坑的同时也就顺手写了一系列的教程，给大家做个分享。

## 什么是 Axum？

Axum 利用了 hyper 库的功能来增强 Web 应用程序的速度和并发性。Axum 还通过与 Tokio 库集成，将 Rust 的 `async/await` 功能推到了前台，使得开发者可以开发高性能的异步 API 和 Web 应用程序。

Axum 的特点：

- 使用无宏的 API 实现路由（router）功能
- 使用提取器（extractor）对请求进行声明式的解析
- 简单和可预测的错误处理模式
- 用最少的模板生成响应
- 充分利用 tower 和 tower-http 的中间件、服务和工具的生态系统

Axum 的基本功能基于 Tokio runtime，这给了 Rust 管理非阻塞、事件驱动活动的能力。这种能力对于平稳处理多个并发进程至关重要。

Axum 与现有框架不同的地方：Axum 没有自己的中间件系统，而是使用 `tower::Service`。这意味着 Axum 可以无成本地获得超时、跟踪、压缩、授权等功能。它还可以让你与使用 hyper 或 tonic 编写的应用程序共享中间件。

此外，Axum 是基于 Rust 强大的类型系统和所有权规则构建的，这些规则在编译时防止了常见的 Web 开发陷阱，如数据竞争和内存泄漏。Axum 的模块化设计理念允许开发人员通过仅添加必要的组件来创建轻量级、专注的应用程序。

## 创建一个项目

```bash
cargo new rust_axum_web_guide
```

### 编写第一个 Hello World

添加依赖：

```toml
[package]
name = "rust_axum_web_guide"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7.9"
tokio = { version = "1.0", features = ["full"] }
```

Axum 的版本选最新版的，当前最新版 0.7.9；再引入 Tokio，旨在充分利用 Tokio 的生态系统。

使用官网上的 hello world 例子改写 `main.rs`：

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(|| async { "Hello, Rust!" }));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

其中，`tokio::main` 属性宏开头表示 Axum 其实就是一个 Tokio 应用。Tokio 是 Rust 非常优秀的异步运行时框架，它提供了写异步网络服务所需的几乎所有功能。

`Router::new().route` 创建路由，`tokio::net::TcpListener::bind` 监听服务器地址，并将生成的 listener 传入 `axum::serve()` 中使用，启动 Axum 服务。

启动项目：

```bash
cargo run
```

编译并运行当前项目，它还会自动下载依赖。如果一切顺利，终端中会看到输出 `Running on http://localhost:3000`。在浏览器中访问 `http://localhost:3000`，或使用类似 `curl` 的工具，将显示消息 "Hello, Rust!"。

## 路由与处理器

Router 用于设置哪些路径指向哪些服务，是一个用于组合处理程序和服务的结构体。路由机制负责将传入的 HTTP 请求定向到其指定的 handler。这些 handler 实际就是应用程序逻辑存在的地方。

将路由和 handler 绑定，handler 类似于 Java Spring 中的 controller。处理器 handler 是一个异步函数或者异步代码块，它接受零个或多个 extractors 作为参数，并返回一些可以转换为 `IntoResponse` 的内容。

也可以将路由和多个 handler 绑定：

```rust
.route("/foo", get(get_foo).post(post_foo))
```

同时绑定了 GET 及 POST 方法；当然还可以指定 HTTP 方法 PUT、DELETE 等。

如果有多个相同的路由，则会 panic。

> 处理器更详细的信息，可见 `axum::handler` 官方文档
> 路由更详细信息，可见 `Router in axum` 官方文档

## 提取器（Extractors）

提取器用于分离传入请求以获得处理程序所需的部分（比如解析异步函数的参数）。

### 捕获动态 URL 值以及查询参数

主要使用 `path` 和 `query` 提取器。

还需要添加依赖来支持序列化（`serde` 等）。

`path` 和 `query` 提取器一般适用于 GET 请求。对于 POST 请求的参数：

### 捕获请求体的参数

常见的请求体参数一般有两种格式：JSON 和 form。

### 捕获请求头参数

一般通过 `HeaderMap` 来获取请求头参数，它会提取所有标头，如果想获取指定标头需要再处理。

除此之外，Axum 还提供了许多有用的提取器，比如 `Bytes`、`String`、`Body` 和 `BodyStream` 用于获取请求正文。你也可以通过实现 `FromRequest` 来定义你自己的提取器。

## 响应处理

任何实现 `IntoResponse` 的东西，都可以被处理程序返回，它将被自动转换为响应。

## 错误处理

Axum 的目标是拥有一个简单且可预测的错误处理模型。这意味着将错误转换为响应很简单，并且可以保证所有错误都得到处理。

Axum 基于 `tower::Service`，它通过其关联的错误类型工作。如果你的 Service 产生错误，并且该错误一直传到 hyper，则连接将终止而不会发送响应。这通常是不可取的，因此 Axum 确保你始终依赖 type system 生成响应。Axum 通过要求所有服务都将 `Infallible` 作为其错误类型来实现这一点。

> 说人话就是：发生错误，不能让 HTTP 连接中断，这导致响应无法正常返回；而是保证响应能正常返回，继而携带错误类型和错误信息；而 Axum 能很轻易地做到。

所以一般 Axum 的处理器绑定的方法定义如下：虽然看起来可能会因为 `StatusCode` 失败，但实际上这并不是一个"错误"。如果此处理程序返回 `Err(some_status_code)`，它仍将转换为响应并发送回客户端。

无论返回 `Err(StatusCode::NOT_FOUND)` 还是 `Err(StatusCode::INTERNAL_SERVER_ERROR)`，在 Axum 中这些都不被视为错误。

推荐使用中间的错误类型，最终可以转换为响应。这样就可以在处理程序中使用 `?` 运算符。

## 中间件

Axum 的独特之处在于它没有自己的定制中间件系统，而是与 Tower 集成。这意味着 tower 和 tower-http 中间件都可以与 Axum 一起使用。Axum 也可以将请求路由到任何 tower 服务。可以是你用 `service_fn` 编写的服务，也可以是来自其他 crate 的东西；从而充分复用和利用不同应用的生态，潜力巨大。

中间件功能允许你在请求到达处理程序之前或之后添加自定义逻辑。这为通用功能的实现提供了强大的方法，例如身份验证、日志记录或性能监视。

## 集成 Tracing 实现日志

### Tracing 是什么？

Tracing 是一个用于检测 Rust 程序以收集结构化、基于事件的诊断信息的框架。它允许开发者跟踪异步操作的执行流，以更好地理解、监控和调试应用程序。对于 Web 项目来说，日志监控非常重要。

在像 Tokio 这样的异步系统中，由于异步编程模型复杂，解释传统的日志消息通常非常具有挑战性（效率低下、难以掌握整个执行流程）。Tracing 扩展了日志记录样式的诊断，允许库和应用程序记录结构化事件，可以按区间 span 记录日志，并提供有关时间性和因果关系的附加信息，并收集关键的上下文信息，极大地提高了应用程序的可观测性。

### 简单日志记录

添加依赖（`tracing` 和 `tracing-subscriber`）。Tracing 有 TRACE、DEBUG、INFO、WARN、ERROR 共 5 个日志级别，其中 TRACE 是最详细的级别。

设置日志等级为 INFO，那么 TRACE、DEBUG 级别的日志就不会显示。

### Spans 与 Events

**Spans（区间）**：表示具有开始、结束的时间段及其他元数据。当程序开始在上下文中执行或执行工作单元时，进入该上下文的 span，当它停止在该上下文中执行时，退出 span。线程当前正在执行的 span 称为该线程的当前 span。

**Events（事件）**：表示某个时刻发生的事情。Event 可与非结构化日志记录代码发出的日志记录相媲美，但与典型的 log 行不同，Event 可能在 span 的上下文中发生。

## 读取多种格式的配置文件

在项目里一般需要读取 YAML、JSON、TOML、env 等格式的配置文件，或从环境变量里读取配置。

选用 Rust 中的 `config` 库，它支持多种格式（YAML、JSON、TOML、INI 等），非常灵活强大。

建议新建 `config` 目录作为子模块，避免逻辑全写在 `main.rs` 中太臃肿。

- `config/server.rs`：定义服务器配置结构体和对应方法
- `config/mod.rs`：定义应用总配置结构体 `AppConfig`，通过 `load` 方法实现读取配置文件的核心逻辑

通过 `Config::builder()` 来构建配置加载器，加载 YAML 配置文件、环境变量等。注意加载多个配置时，优先级是后加载者覆盖前者。

### 多环境配置

```rust
static CONFIG: LazyLock<AppConfig> = LazyLock::new(|| AppConfig::load().expect("初始化配置文件失败"));
```

这行代码定义并初始化一个全局静态配置对象，它在第一次被访问时（懒加载 `LazyLock`），会尝试自动加载配置文件并初始化，如果失败则直接 panic 并输出提示。这样就能在程序的任何地方方便地访问全局配置，而且只会加载一次，线程安全。

注意：Rust 打包的可执行文件里不会包含配置文件，所以配置文件后续得传到生产环境，建议跟可执行文件同级。

### 读取 Cargo.toml 文件

不需要引入新的第三方库，可以直接读取项目中自带的 `Cargo.toml` 配置。

### 读取 .env 文件

使用 `dotenv` 来实现。在根目录下创建 `.env` 文件，在 main 函数中调用 `dotenv::dotenv().ok()` 加载。

## 总结

本文从 Java + SpringBoot 部署小项目到个人服务器的内存痛点出发，介绍了 Rust + Axum 如何成为高性能、低内存消耗 Web 开发的替代方案。覆盖了一个 Web 框架基本要解决的方面：

1. **路由与处理器**：Router + handler 绑定 HTTP 方法
2. **提取器**：path/query/body/header 多种参数提取
3. **响应处理**：IntoResponse trait
4. **错误处理**：Infallible + 中间错误类型
5. **中间件**：Tower 集成，无成本获得超时/跟踪/压缩/授权
6. **Tracing 日志**：Spans + Events + 5 级日志
7. **配置文件读取**：YAML/JSON/TOML/INi/Cargo.toml/.env

后续会探索 Axum Web 更多有意思的特性。

---

*小牛呼噜噜，持续分享技术干货。*

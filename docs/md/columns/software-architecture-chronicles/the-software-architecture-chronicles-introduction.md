---
title: "The Software Architecture Chronicles（引言）"
date: "2017-07-03"
source: "Herberto Graca"
url: "https://herbertograca.com/2017/07/03/the-software-architecture-chronicles/"
---

# The Software Architecture Chronicles

> 本文是软件架构系列文章的第一篇。我在这里记录我对软件架构的学习、思考和实践。

我将这个系列命名为 "The Software Architecture Chronicles"。

## 了解历史的重要性

> 那些不吸取历史教训的人注定要重蹈覆辙。
>
> — George Santayana, *The Life of Reason*, 1905

学习历史非常重要。作为开发者，了解前人的知识可以帮助我们站在巨人的肩膀上。

我发现很多观点是基于观点再基于观点……这就像"传话游戏"一样，最终人们对原始论文、文章或书籍的表述产生了扭曲。所以我决定深入互联网，寻找那些我认为最重要的概念的原始论文、文章和书籍，并自己进行思考。

这些文章就是这些思考的结果，我试图以时间顺序来理解这些概念是如何产生的。

## 本系列文章列表

1. The Software Architecture Chronicles（本文）
2. [Software Architecture Premises](https://herbertograca.com/2017/07/05/software-architecture-premises/)
3. [Programming Language evolution](https://herbertograca.com/2017/07/10/programming-language-evolution/)
4. [Architectural Styles vs. Architectural Patterns vs. Design Patterns](https://herbertograca.com/2017/07/28/architectural-styles-vs-architectural-patterns-vs-design-patterns/)
5. [Monolithic Architecture](https://herbertograca.com/2017/07/31/monolithic-architecture/)
6. [Layered Architecture](https://herbertograca.com/2017/08/03/layered-architecture/)
7. [MVC and its alternatives](https://herbertograca.com/2017/08/17/mvc-and-its-variants/)
8. [EBI Architecture](https://herbertograca.com/2017/08/24/ebi-architecture/)
9. [Packaging & namespacing](https://herbertograca.com/2017/08/31/packaging-code/)
10. [Domain-Driven Design](https://herbertograca.com/2017/09/07/domain-driven-design/)
11. [Ports & Adapters Architecture (aka Hexagonal Architecture)](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)
12. [Onion Architecture](https://herbertograca.com/2017/09/21/onion-architecture/)
13. [Clean Architecture](https://herbertograca.com/2017/09/28/clean-architecture-standing-on-the-shoulders-of-giants/)
14. [Event-Driven Architecture](https://herbertograca.com/2017/10/05/event-driven-architecture/)
15. [From CQS to CQRS](https://herbertograca.com/2017/10/19/from-cqs-to-cqrs/)
16. [Service Oriented Architecture (SOA)](https://herbertograca.com/2017/11/09/service-oriented-architecture-soa/)
17. [Explicit Architecture #01: DDD, Hexagonal, Onion, Clean, CQRS, … How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)
18. [Explicit Architecture #02: More than concentric layers](https://herbertograca.com/2018/07/07/more-than-concentric-layers/)
19. [Explicit Architecture #03: Reflecting architecture and domain in code](https://herbertograca.com/2019/06/05/reflecting-architecture-and-domain-in-code/)
20. Explicit Architecture #04: Documenting the architecture
21. Evolving a project: from MVP to P
22. 4 + 1 Architecture view model
23. Architecture quality attributes

## 软件架构发展时间线

### 1950s
- **非结构化编程**
- ~1951 – Assembly

### 1960s
- **结构化编程**
- **分层架构：1 层**（UI、业务逻辑、数据存储合一）
- ~1958 – Algol

### 1970s
- **过程式 / 函数式编程**
- ~1970 – Pascal
- ~1972 – C
- [1979](http://heim.ifi.uio.no/~trygver/1979/mvc-2/1979-12-MVC.pdf) – **Model-View-Controller**

### 1980s
- **面向对象编程**（最初思想在 1960 年代后期）
- **分层架构：2 层**（第 1 层 UI，第 2 层业务逻辑 + 数据存储）
- ~1980 – C++
- **CORBA**
- ~1986 – Erlang
- ~1987 – Perl
- [1987](https://www.lri.fr/~mbl/ENS/FONDIHM/2013/papers/Coutaz-Interact87.pdf) – PAC 即 **Hierarchical Model-View-Controller**
- [1988](https://drive.google.com/file/d/0BwhCYaYDn8EgNzAzZjA5ZmItNjU3NS00MzQ5LTkwYjMtMDJhNDU5ZTM0MTlh/view) – **LSP**（~SOLID）

### 1990s
- **分层架构：3 层**（第 1 层 UI，第 2 层业务逻辑，第 3 层数据存储）
- ~1991 – **Message Bus**
- ~1991 – Python
- [1992](https://www.amazon.com/Object-Oriented-Software-Engineering-Driven-Approach/dp/0201403471) – **Entity-Boundary-Interactor** 架构
- ~1993 – Ruby
- ~1995 – Delphi, Java, Javascript, PHP
- [1996](http://www.wildcrest.com/Potel/Portfolio/mvp.pdf) – **Model-View-Presenter**
- [1996](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) – **OCP, ISP, DIP**（~SOLID）, REP, CRP, CCP, ADP
- [1997](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) – SDP, SAP
- ~[1997](http://www.cs.ubc.ca/~gregor/papers/kiczales-ECOOP1997-AOP.pdf) – **Aspect Oriented Programming**
- ~1997 – **Web Services**
- ~[1997](http://shop.oreilly.com/product/9780596006754.do) – **ESB** – Enterprise Service Bus

### 2000s
- [2002](http://a.co/7S3sJ2J) – **SRP**（~SOLID）
- [2003](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) – **Domain-Driven Design**
- [2005](https://blogs.msdn.microsoft.com/johngossman/2005/10/08/introduction-to-modelviewviewmodel-pattern-for-building-wpf-apps/) – **Model-View-ViewModel**
- [2005](http://alistair.cockburn.us/Hexagonal+architecture) – **Ports & Adapters Architecture** 即 Hexagonal Architecture
- [2006](https://youtu.be/JHGkaShoyNs?t=1m17s)? – **CQRS & ES**
- [2008](http://jeffreypalermo.com/blog/the-onion-architecture-part-1/) – **Onion Architecture**
- [2009](https://medium.com/s-c-a-l-e/talking-microservices-with-the-man-who-made-netflix-s-cloud-famous-1032689afed3) – **Microservices**（Netflix）

### 2010s
- [2010](https://www.amazon.co.uk/Lean-Architecture-Agile-Software-Development/dp/0470684208) – **Data-Context-Interaction Architecture**
- [2012](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html) – **Clean Architecture**
- [2014](http://www.codingthearchitecture.com/2014/08/24/c4_model_poster.html) – **C4 Model**

## 翻译

[中文翻译](https://www.jianshu.com/p/b477b2cc6cfa)，由 Qinyusuain 提供
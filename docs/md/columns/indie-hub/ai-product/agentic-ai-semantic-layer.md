---
title: "构建企业级 Agentic AI的语义层"
author: "半吊子全栈工匠"
date: "2026年9月8日 20:26"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/_YJs8J6cn0v3Gch6Txr7gA"
---

# 构建企业级 Agentic AI的语义层

【引】如果 LLM 是大脑，语义层就是 Agentic AI 的心脏——为Agent 构建缺失的上下文层。本文是“本体与AI”的系列文字之一，也是《本体驱动的AI大模型：方法与实现》一书的解释与补充。

走进任何一家大公司，你会看到同一份购物清单：前沿 LLM（Claude、GPT、Gemini等）、企业数据平台、堆满非结构化文档的数据湖、向量数据库、一堆 Agent、编排框架（LangGraph、CrewAI）、一堆工具，以及某种形式的记忆。架构图看起来很壮观，Demo 也能跑通。

然后， Agent 上到生产环境，奇怪的事情发生了。两个 Agent 回答同一个营收问题，给出两个不同的数字。一个关于"上季度"的简单问题，生成了查错表的 SQL。成本飙升，信任蒸发。那个号称要变革自助式分析的项目被悄悄搁置。这里缺失的不是更好的模型，而是几乎没人画在架构图上的那一层——语义层。

如果 LLM 是 Agent 系统的大脑，语义层就是心脏。大脑可以很聪明，但如果没有东西把干净、受治理、一致的"含义"泵给它，它仍然一无是处。

# 一、真正的问题

LLM 本质上是一个训练于公共互联网数据的概率推理引擎。它从未见过你的ORDERS表。它可能不知道你们公司把净营收定义为"总营收减去折扣和退货"，不知道"上季度"指的是最近完成的一个财季，也不知道那个实际叫amt_ttl_pre_dsc的列就是财务部口中的"顶线"。把原始 schema 交给一个聪明的模型，问它业务问题，它会自信地编造缺失的业务逻辑。这不是模型的 Bug，而是模型在上下文不足时精确地做了它被设计来做的事。

![image](./images/001.jpeg)

指标漂移。问三个 Agent或三个仪表盘的"总销售额"，你会得到三个数字。因为"总销售额"对 A 团队意味着仅零售，对 B 团队意味着零售加批发，对财务意味着零售加批发减退货。没有一个统一的受治理定义，每个 Agent 都在临时重新推导业务逻辑。把它乘以几千个 Agent，你得到的不是分析结果，而是一场争论。

RAG 的问题形状不对。RAG设计的初衷是从一堆非结构化文本中找到相关段落。但大多数企业问题不是检索型的——它们是计算型的。"上季度各区域净营收"不是躺在某个段落里等着被检索的；它需要使用一个定义，跨结构化系统正确地计算出来。RAG 原生地处理不了这些。

MCP 是管道，不是含义。Model Context Protocol 理所当然地成为了"AI 的 USB-C 接口"——连接 Agent 与工具和数据的标准线。但线只传递上下文，不创造上下文。没有语义层兜底的 MCP，只是打开了通往你数据仓库的每个阀门，没有地图，也没有过滤器。

共同主线在于，你技术栈里的所有组件都是必要的，但没有一个提供受治理的业务含义，这就是缺口。市场正在觉醒于一个简单的事实：没有受治理语义的 AI 无法扩展。

# 二、语义层和上下文层到底是什么

语义层是业务中的受治理词汇表。这是"净营收""活跃客户""流失率""区域"各被精确定义一次的地方——作为指标、维度和关系映射到你的物理表上——让每个消费者（人或机器）得到相同答案。经典 BI 语义层（如 Power BI 的表格模型或 Looker 的 LookML）是为仪表盘构建的：被动、只读、为人点击而设计。

上下文层比语义层更大。人们说的"上下文"其实有两个层面。第一层是运行时上下文——每次调用模型时喂给它的东西：当前对话、本次会话的记忆、长期记忆、可用工具，这个过程称为"上下文工程"。第二层是企业上下文层，在运行时之上：每个 Agent 都从中汲取的永久、共享的基础，包括受治理定义、谁被允许看什么、每个数字从哪来，跨越所有系统，不只是一个数据仓库。简单说：运行时上下文是一个 Agent 此刻看到的东西；企业上下文层是每个 Agent 到处都在汲取的唯一事实源。

MCP两者都不是，它是传输层，让 Agent 触达语义/上下文层的协议。MCP是连接，不是智能。

那么语义层和上下文层的实际区别是什么？简短回答：语义层是上下文层的一部分。

语义层回答一个狭窄而精确的问题：我们的业务术语是什么意思，如何计算？它是指标、维度和关系的字典——"净营收 = 总营收减折扣和退货"，只定义一次。它是心脏的心脏，但主要关于数字和定义。

上下文层回答一个大得多的问题：Agent 需要知道的一切，才能正确安全地使用我们的数据。这包括语义层的定义加上周围的织物——哪些数据可信且经过认证、数据从哪来（血缘）、谁有权看（权限）、数据长什么样（schema 和数据类型）、表之间如何关联，以及 Agent 应遵循的不成文"家规"（那些活在 nobody's schema 里的注意事项和关联路径）。

上下文比指标更丰富，被描述为一个由六类元数据组成的多层组装：

技术元数据：schema、数据类型、安全标签（IAM），直接来自源系统

语义元数据：业务本体、术语表、分类

运营元数据：血缘、数据画像、使用统计、质量评分

关系：物理资产与业务概念之间的连接

信任元数据： 标识数据是否来自认证权威源的信号

Agent 指引：非结构化的"Agent 说明书"：聚合前要应用的过滤器、要遵循的关联路径、schema 中看不见的注意事项

业界日益收敛的新定义是：

> 上下文语义层 = 受治理指标 + 本体 + 知识图谱 + 记忆 + LLM 编排

上下文语义层 = 受治理指标 + 本体 + 知识图谱 + 记忆 + LLM 编排

# 三、为什么值得投入

可部署的准确性。研究表明，LLM 通过语义层查询而非直接查原始表时，数据问题的准确率可提升多达3 倍。Databricks 报告其 Genie Ontology 上下文引擎将回答准确率从约 50% 提升至84.5%。Bloomberg Media 内部的"知识差距 Agent"仅通过将缺失的制度性知识捕获为受治理上下文，就将其数据访问 Agent 的 SQL 准确率提升了63%。模型不再猜测业务逻辑，因为业务逻辑被直接交给了它。

一致性——终结指标漂移。净营收只定义一次；每个 Agent、仪表盘和笔记本都继承它。财务签字的数字就是你面向客户的 Agent 引用的数字。不再需要调和三个"真相"。

治理、安全和血缘——与生俱来。好的语义层在查询时执行 RBAC，并在每个结果中携带血缘。Snowflake 的 Cortex Analyst 遵循基于角色的访问；Microsoft 的 Fabric Data Agents 遵守 Purview 策略和行/列级安全；AWS Context 通过 IAM 和 Lake Formation 让每个 Agent 查询具备身份感知。Agent 不会意外泄露用户无权查看的列，每个答案都附带"这是从哪来的"链路。这是有趣 Demo 与合规允许上线的东西之间的区别。

成本控制。当定义集中在一个受治理的地方，你不再在每个提示词中重复它们，更多问题留在受治理业务逻辑内，而不是退化为昂贵且不可预测的原始表行为。Databricks 现在通过 Unity AI Gateway 加上硬性支出上限来包装这一切。更好的语义覆盖，直接意味着更低更稳定的账单。

可解释性与信任。因为指标、关系和已验证查询是显式的，系统可以展示其推理过程。这正是把"自信"的 Agent 变成"可信"的 Agent 的关键——尤其当 Agent 从回答问题走向执行动作（调整定价、下订单、分拣工单）时。

互操作性与面向未来。定义一个指标一次，同时服务 Claude、ChatGPT、你的内部 Agent 和 Power BI——无需为每个定制胶水代码。

# 四、如何构建？各大平台操作参考

没有叫"语义层"的单一产品，需要自己组装。

Google Cloud — Knowledge Catalog（通用上下文引擎）

最完整的"上下文层即产品"方案。Knowledge Catalog 是一个 Gemini 驱动、常驻运行的上下文引擎，构建动态上下文图谱来锚定 Agent 并减少幻觉。三大支柱：聚合（统一 BigQuery、AlloyDB、Spanner、Looker 及 Atlan/Collibra 等第三方目录的技术元数据为一个受治理真相源）、富集（Gemini 自动生成描述、业务术语表、关系和已验证"黄金"SQL 模式）、搜索/检索（语义搜索加 Context Retrieval API 和lookupContext等 MCP 工具）。Looker/LookML 提供指标语义；Gemini Enterprise 中的 Deep Research Agent 消费它。

Microsoft / Azure — Power BI 语义模型 + Fabric IQ + Purview

微软的优势在于数百万企业已在用 Power BI 语义模型，而它把这些变成了 Fabric IQ 下 AI 的锚定层——配上本体和 Purview 治理，让 Fabric Data Agents 用纯英语回答问题，同时尊重每个用户的权限。

AWS — AWS Context + SageMaker Catalog + Bedrock

AWS Context自动将你的数据映射为知识图谱，通过 Agent 搜索 API 和 MCP 工具在运行时向 Agent 提供受治理的关系、业务规则和领域知识。每个查询都具备身份感知（继承 IAM 和 Lake Formation 权限）且可审计，元数据以开放 Apache Iceberg 格式发布在 S3 上。它由 Glue Data Catalog 技能资产（关联路径、查询模式、使用规则——即"Agent 指引"层）、S3 Annotations 和 SageMaker Catalog（基于 DataZone：语义搜索、GenAI 生成元数据、数据产品、血缘、Amazon Q）供给。Bedrock AgentCore 运行 Agent（含记忆、网关和身份）。如果你已运行 S3/Glue/Lake Formation，卖点是零数据移动。

Databricks — Unity Catalog Semantics + Genie Ontology

Unity Catalog 是数据、AI 资产、Agent 和 MCP 的统一治理平面。其上是Unity Catalog Business Semantics / Metric Views——用 SQL/YAML 一次性定义营收、流失率、利润率等 KPI（含同义词、格式、关系），受治理且开源/OSI 兼容，可从 SQL、API、BI 和 Agent（通过 MCP）查询。为 Agent 供血的是Genie Ontology：一个自改进的上下文引擎，通过"ontorank"排名权威定义。Genie One（Agent 同事）和 Agent Bricks 消费它。

Snowflake — Cortex Analyst + Semantic Views

仓库原生、严格治理。Semantic Views 是 schema 级对象，编码逻辑表、维度、事实、指标、关系、同义词、已验证查询和自定义指令——具备完整 RBAC 和共享能力。Cortex Analyst 是 LLM 驱动的 Text-to-SQL 引擎，读取语义视图并生成在你的仓库中运行的受治理 SQL；Cortex Agents 将它与 Cortex Search（用于非结构化数据）协同编排。Snowflake 较新的 Horizon Context / Cortex Sense 将此扩展为跨系统上下文方案。因为语义视图受限于仓库，当含义跨越 Snowflake 边界时，需配合跨系统上下文层使用。

OpenAI — 消费层的大脑

值得对架构师说清楚：OpenAI 是模型提供商，不是语义层厂商。ChatGPT Enterprise 提供连接器和工具，OpenAI 也采用了 MCP——所以 GPT Agent 消费的是你构建的受治理语义层（在上面某个平台上），而非自己提供。像 Anthropic 和 Google 一样，OpenAI 游离于 OSI 标准之外。计划在你的数据平台上构建上下文层，让模型通过 MCP 触达它。

两个把一切串联起来的标准是OSI 和 MCP。OSI（Open Semantic Interchange）v1.0 于 2026 年 1 月在 GitHub 发布，基于 MetricFlow——让你用厂商中立的 YAML 定义一次指标，任何兼容工具都能消费。Snowflake、Databricks、dbt、Cube、AtScale、Salesforce、Tableau、BlackRock 等 40+ 合作伙伴已加入；明显缺席的是 Microsoft、SAP、IBM、Oracle 以及头部大模型厂商（OpenAI、Anthropic、Google）。MCP是将其传输给 Agent 的管道，语义层仍然是企业所拥有的那一块。

# 五、一个具体示例：受治理语义模型

下面是一个精简的 Snowflake 风格语义视图，针对零售营收领域——回答架构图中那个确切问题。注意，混乱的物理列amt_ttl_pre_dsc永远不会到达 Agent；net_revenue只被定义一次，折扣和退货的逻辑被明确。

> 将语义文件（YAML）存储到 Snowflake Semantic View 或 Google Catalog 等中 → Agent 通过 MCP 从那里读取。

将语义文件（YAML）存储到 Snowflake Semantic View 或 Google Catalog 等中 → Agent 通过 MCP 从那里读取。

这个文件就是这个领域的核心：同义词（让"topline"和"geo"正确解析）、唯一的指标真定义、关联路径（模型不用猜）、已验证查询（高信任的 Few-shot 示例）、自定义指令（默认值和护栏）。把它放在 Git 里，像代码一样 review，通过 CI/CD 发布，追踪使用情况。现代语义层像产品一样被拥有和发布，而不是像维基一样被维护。

# 六、接入 Agent，作为通往数据的唯一途径

真正带来安全性的操作是：Agent 不获得原始仓库访问权。它获得一个受治理工具，通过 MCP 暴露并放入编排图。模型仍然推理；它只是无法绕过心脏触及数据。

# 七、小结

问自己一个问题：我们的受治理业务含义住在哪里，每个 Agent 如何触达它？如果答案是"在提示词里"或"模型自己会搞清楚"，那就是你最高杠杆的工作。你不需要从零开始，任何模型都可通过 MCP 触达。

大模型会持续变得更便宜更聪明。但企业持久的优势是语义层——建好它，它之上的一切都会同时变得更聪明、更安全、更便宜。

【关联阅读】

万字长文：缺算力还是语义？企业Agent的真正瓶颈

《本体驱动的AI大模型》作者序

让知识图谱成为大模型的伴侣

面向知识图谱的大模型应用

解读知识图谱的自动构建

从语义网到知识图谱

知识图谱与向量数据库的相遇

在大模型RAG系统中应用知识图谱

知识图谱的5G追溯

行业规模的知识图谱——经验和挑战

IOT语义互操作性之本体论

IOT语义互操作性之语义

IOT语义互操作性之标准与开源

IOT语义互操作性之API接口

IOT语义交互性之交叉

老码农眼中的Agent Skill

MCP过时了么？你可能面对的MCP 反模式

大模型应用系列：两万字解读MCP

MCP规范完整中译稿：2025-3-26版

全网首发：MCP 的10种架构模式

全网首发：安全性问题，使MCP成为AI应用的双刃剑，如何化险为夷呢？

智能体间协作的"巴别塔困境"如何破解？解读Agent通信4大协议：MCP/ACP/A2A/ANP

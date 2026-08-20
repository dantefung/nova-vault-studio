---
title: "工业 Agent 工具设计的 5 个原则"
author: "老梁agent"
date: "2026年6月5日 08:46"
source: "微信公众号"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483735&idx=1&sn=88aeda6492f04fc816a436e977109a0e&chksm=f41d6baac36ae2bcd870f37da6154faa9ffc0eda375fbe49a78380a8e26b6480cf5577f6f186#rd"
---

# 工业 Agent 工具设计的 5 个原则

> @Tool 注解谁都会加，但写出 LLM 能准确理解和调用的工具，是一门手艺。



@Tool 注解谁都会加，但写出 LLM 能准确理解和调用的工具，是一门手艺。



AI Agent 的瓶颈不在 LLM，在工具。LLM 只是推理引擎，工具才是真正干活的手。工具设计得好，Agent 如臂使指；设计得差，LLM 要么不调用，要么传错参数，要么拿到返回结果不知道怎么处理。



以下是我在 industrial-agent-long 项目中总结的 5 条工具设计原则。



## 原则 1：描述要具体，不要抽象



Tool 的 @Tool 描述是 LLM 判断"什么时候该用这个工具"的唯一依据。描述越具体，LLM 的调用准确率越高。



// 差 — LLM 不知道什么时候该用@Tool("查询设备信息")// 好 — 明确的触发场景、输入输出@Tool("查询指定设备的当前告警信息。输入设备ID，返回该设备的所有活跃告警及严重级别。")



经验规则：描述里包含三个要素——什么时候用（查询告警）、输入什么（设备ID）、返回什么（活跃告警列表）。



## 原则 2：入参用最简单类型



LLM 从自然语言中提取参数，然后填到 Function Calling 的 JSON 参数里。参数类型越简单，提取越准确。



```

// 差 — 复杂对象，LLM 很容易填错字段@Tool("...")public String query(Map&lt;String, Object&gt; params)// 好 — 明确的简单类型@Tool("...")public String queryDeviceAlarms(String deviceId)// 也可以 — 多个简单参数@Tool("...")public String queryHistoryData(String deviceId, String metric, int minutes)
```




可用类型：String、int、double、boolean。枚举可以尝试，但推荐用 String 在后端做转换。



## 原则 3：返回 JSON，不是自然语言



工具返回的内容会作为上下文喂给 LLM 继续推理。JSON 结构化程度高，LLM 能准确提取字段做判断。自然语言描述会丢失精度。



// 差 — 自然语言，LLM 可能误读return "设备 CNC-001 当前有 2 个告警：温度过高(严重)和振动异常(中等)";// 好 — 结构化 JSON，LLM 精准解析return """{  "deviceId": "CNC-001",  "status": "warning",  "activeAlarms": [    {"type": "温度过高", "severity": "HIGH", "timestamp": "..."},    {"type": "振动异常", "severity": "MEDIUM", "timestamp": "..."}  ],  "totalCount": 2}""";



经验规则：工具返回 = 结构化数据。让 LLM 做它擅长的事（从 JSON 提取信息），而不是让它猜你的自然语言。



## 原则 4：工具要幂等



LLM 可能在一次对话中多次调用同一个工具。一定要保证：同一入参多次调用，不会产生副作用。



// 危险的 — 每次调用都创建工单@Tool("创建维修工单")public String createWorkOrder(String deviceId, String description) {    // 如果 LLM 调了两次，就创建了两个相同的工单！}// 安全的 — 先查询，已存在则返回@Tool("创建维修工单。如果该设备已有相同描述的未完成工单，返回已有工单。")public String createWorkOrder(String deviceId, String description) {    WorkOrder existing = workOrderRepo.findByDeviceAndDescription(deviceId, description);    if (existing != null) {        return "{\"action\":\"existing\", \"workOrder\":" + existing.toJson() + "}";    }    // 真正创建...}



特别危险的 Tool 类型：创建、删除、重启、调整参数。这些操作要么加幂等检查，要么标注为"需要人工确认"。



## 原则 5：错误也要返回 JSON



工具调用失败是常态——设备离线、数据库超时、参数不合法。但 LLM 需要从错误中恢复，做出合理决策。抛异常或返回堆栈信息，LLM 是看不懂的。



// 差 — 抛异常，LLM 收到的是技术错误信息throw new RuntimeException("Connection refused to TDEngine");// 好 — 返回结构化的错误信息return """{  "error": true,  "message": "无法连接时序数据库，数据查询失败",  "suggestion": "请稍后重试，或联系运维检查 TDEngine 服务状态",  "partialData": null}""";



LLM 看到这个返回，会告诉用户："数据查询暂时失败，建议稍后重试或联系运维。"——而不是把 Connection refused 堆栈抛给用户。



## 验证你的工具设计



写完一个 Tool 后，用这 5 个问题自查：



1. 描述里包含触发场景、输入、输出吗？



2. 入参都是简单类型吗？



3. 返回值是结构化 JSON 吗？



4. 多次调用同一入参有副作用吗？



5. 错误信息是给 LLM 看的，还是给程序员看的？



5 个「是」= 工具设计合格。

---
title: "为什么我的 Agent 不调用工具？排查 Function Calling 的 4 个常见坑"
author: "老梁agent"
date: "2026年6月6日 17:33"
source: "微信公众号"
url: "http://mp.weixin.qq.com/s?__biz=MzY5MzMzODAwMg==&mid=2247483736&idx=1&sn=637caaba3a9f73dbb2c48241731d7951&chksm=f41d6ba5c36ae2b31452c1b83c27b114497f07cb67be44994782f698860909d1a732fccf712e#rd"
---

# 为什么我的 Agent 不调用工具？排查 Function Calling 的 4 个常见坑

> 代码没问题，LLM 连上了，但 Agent 就是不肯调工具。这 4 个坑是我在实践中一个个踩过来的。



代码没问题，LLM 连上了，但 Agent 就是不肯调工具。这 4 个坑是我在实践中一个个踩过来的。



## 坑 1：@Tool 描述太笼统



现象：LLM 回复了一堆分析，但就是没调用工具。



根因：@Tool 的描述太模糊，LLM 不知道"什么情况下"该用这个工具。



// 坏 — LLM 无法判断触发条件@Tool("获取数据")// 坏 — 只有功能描述，没说什么时候用@Tool("查询数据库中存储的设备告警信息")// 好 — 明确的语义边界@Tool("查询指定设备的当前活跃告警。当用户询问某设备是否有告警、告警状态、告警详情时使用此工具。")



修复方式：描述里加上使用场景——"当用户 XX 时使用此工具"。这句话是给 LLM 的触发器。



## 坑 2：import 了错的 @Tool 注解



现象：代码编译通过，但 Agent 完全不认识你的工具。



根因：@Tool 注解有两个包路径。Spring AI 也有一个 @Tool，如果 IDE 自动 import 了那个，LangChain4j 的框架就扫描不到。



// 错误！import org.springframework.ai.tool.Tool;  // 这是 Spring AI 的// 正确！import dev.langchain4j.agent.tool.Tool;  // 这是 LangChain4j 的



修复方式：检查 import 语句。必须是 dev.langchain4j.agent.tool.Tool。



AiServices.builder().tools() 只会扫描 LangChain4j 的 @Tool，其他框架的注解它不认识。



## 坑 3：LLM 觉得"不需要"工具



现象：日志显示 LLM 收到了工具定义，但回复里没有 tool_calls。



根因：LLM 自己判断"我能直接回答这个问题"。例如：



用户: "设备振动异常是什么原因？"



LLM 可能直接用通用知识回答——"振动异常通常是轴承磨损、转子不平衡或联轴器不对中造成的..."——而不调用你的诊断工具。



修复方式：在 SystemMessage 里告诉 LLM 它的角色和限制：



@SystemMessage("你是一个工业设备运维专家。你的知识有限，无法访问实时设备数据。当用户询问设备状态、告警、历史数据时，你必须使用提供的工具查询。不要凭猜测回答设备相关问题。")



SystemMessage 是给 LLM 的"人设"，告诉它"你的知识边界在哪里"。一旦 LLM 知道自己"不知道"，它就会调用工具。



## 坑 4：log-requests 没开



现象：Agent 行为不符合预期，但你看不到 LLM 收到了什么、返回了什么。



根因：没开日志。没有 Visibility 的调试是盲调。



# application.ymllangchain4j:  open-ai:    chat-model:      log-requests: true      log-responses: true



开了日志之后你能看到：



- 发给 LLM 的完整请求，包含所有 tools 的 JSON Schema——如果 Schema 里没有你的工具，那就是 @Tool 注解没被扫描到



- LLM 的完整响应，包含 tool_calls 数组——如果 LLM 没返回 tool_calls，那就是它判断不需要工具



- 工具调用的参数——如果参数不对，那就是 @Tool 描述不够清晰



经验规则：调试 Agent 之前，第一件事就是开日志。没日志的调试是浪费时间。



## 快速排查清单



症状



检查



Agent 从不调工具



@Tool import 对了吗？`dev.langchain4j.agent.tool.Tool`



偶尔调、偶尔不调



@Tool 描述够具体吗？加了触发场景吗？



调了但参数不对



```

入参类型够简单吗？String &gt; 复杂对象
```




LLM 自己编答案



有 SystemMessage 限制知识边界吗？



行为完全不可预测



Temperature 太高？降到 0.3 以下



记住一句话：LLM 不是不听话，是它没听懂你让它干什么。 @Tool 描述、SystemMessage、参数设计——这些都是你跟 LLM 之间的"沟通界面"。写代码是给自己看的，写 @Tool 和 Prompt 是给 LLM 看的。

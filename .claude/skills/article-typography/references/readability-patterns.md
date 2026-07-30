# Readability Patterns

## Optimal Paragraph Length

### By Content Type

**Blog Posts / Articles:**
```
Ideal: 3-5 sentences or 100-150 characters
Maximum: 200 characters before considering split
Rule: One main idea per paragraph
```

**Technical Documentation:**
```
Ideal: 2-4 sentences or 80-120 characters
Rule: One concept/step per paragraph
Use bullet points for lists > 3 items
```

**Social Media / Casual Writing:**
```
Ideal: 1-3 sentences or 50-80 characters
Rule: Shorter is better for mobile reading
Break frequently for breathing room
```

**Academic / Formal Writing:**
```
Ideal: 4-6 sentences or 150-200 characters
Rule: Develop argument systematically
Allow longer paragraphs for complex ideas
```

## Sentence Rhythm Patterns

### Vary Sentence Length

**Poor rhythm (monotonous):**
```
❌ 这是第一个观点。这是第二个观点。这是第三个观点。这是第四个观点。
(All sentences same length = boring)
```

**Good rhythm (varied):**
```
✓ 这是第一个观点。第二个观点更加重要，因为它直接影响用户体验。第三个观点。
最后一个观点需要特别注意：它关系到整个系统的稳定性和可扩展性。
(Short-Long-Short-Longest = engaging)
```

### Pattern: Short-Medium-Long

```
✓ Good flow:
问题很明显。(short - hook)
我们需要一个更好的解决方案来处理这个问题。(medium - context)
具体来说，这个方案应该包括自动化处理、错误恢复机制以及详细的日志记录功能。(long - detail)
```

### Pattern: Question-Answer

```
✓ Engaging:
如何解决这个问题？(question)
答案是建立一套完整的监控体系。(answer)
这套体系包括三个核心模块。(elaboration)
```

## Transition Phrase Templates

### Logical Progression

**顺承 (Continuation):**
```
此外，...
同时，...
另外，...
进一步来说，...
在此基础上，...
```

**因果 (Causation):**
```
因此，...
所以，...
正因如此，...
基于这个原因，...
这导致了...
```

**转折 (Contrast):**
```
但是，...
然而，...
尽管如此，...
相反，...
与此不同的是，...
```

**递进 (Progression):**
```
不仅如此，...
更重要的是，...
甚至，...
更进一步，...
深入来看，...
```

**总结 (Summary):**
```
总之，...
综上所述，...
简单来说，...
概括地讲，...
```

**举例 (Example):**
```
例如，...
比如说，...
以...为例，...
具体来说，...
```

### Where to Add Transitions

**Between paragraphs with different topics:**
```
❌ Missing transition:
用户体验很重要。
技术架构要简洁。

✓ With transition:
用户体验很重要。
同样重要的是，技术架构要简洁。
```

**Between cause and effect:**
```
❌ Unclear connection:
系统负载过高。需要优化数据库。

✓ Clear connection:
系统负载过高，因此需要优化数据库。
```

**Between general and specific:**
```
❌ Abrupt:
我们需要改进性能。使用缓存。

✓ Smooth:
我们需要改进性能。具体来说，可以使用缓存机制。
```

## Common Ambiguity Patterns

### Vague Quantifiers

**Pattern: "很多" / "一些" / "某些"**

```
❌ Vague: 很多用户反馈这个问题
✓ Clear: 超过 50% 的用户反馈这个问题
或: 多个用户反馈这个问题（如果没有具体数据）

❌ Vague: 一些情况下会失败
✓ Clear: 当输入为空时会失败

❌ Vague: 某些浏览器不支持
✓ Clear: IE 11 及以下版本不支持
```

### Vague Verbs

**Pattern: "做" / "搞" / "弄"**

```
❌ Vague: 我们需要做一些优化
✓ Clear: 我们需要优化数据库查询

❌ Vague: 把这个东西搞好
✓ Clear: 完善这个功能模块

❌ Vague: 先把它弄出来
✓ Clear: 先实现基本功能
```

### Vague References

**Pattern: "这个" / "那个" / "它"**

```
❌ Ambiguous: 这个很重要
✓ Clear: 这个功能很重要

❌ Ambiguous: 它可能导致问题
✓ Clear: 内存泄漏可能导致问题
或: 上述配置错误可能导致问题

❌ Ambiguous: 那个方案不行
✓ Clear: 第二种方案不可行
```

### Vague Conditionals

**Pattern: "可能" / "或许" / "大概"**

```
❌ Uncertain: 可能需要重启
✓ Clear: 修改配置后需要重启

❌ Uncertain: 或许会影响性能
✓ Clear: 在高并发场景下会影响性能

❌ Uncertain: 大概要 10 分钟
✓ Clear: 预计需要 10 分钟
或: 通常需要 5-15 分钟
```

## Paragraph Break Indicators

**Break before:**
- Topic shift: 从用户体验转到技术实现
- Examples: 引入具体例子之前
- Lists: 三项以上的列表
- Emphasis: 需要特别强调的观点

**Break after:**
- Complete thought: 一个完整观点表达完毕
- Before transition: 进入下一个主题之前
- After examples: 例子结束，回到主论述

**Do NOT break:**
- In the middle of an explanation
- Between tightly coupled sentences (cause-effect)
- Within a list that should stay together

## Examples of Good Structure

### Technical Article Structure

```
✓ Well-structured:

# 标题

简短引言，说明问题。（1-2 句）

## 背景

为什么需要这个解决方案？（2-3 句）
当前存在什么问题？（1-2 句）

## 解决方案

核心思路是什么。（1 句）

具体包括以下步骤：

1. 第一步：做什么
2. 第二步：做什么
3. 第三步：做什么

关键点在于第二步。（详细解释，2-3 句）

## 示例

代码示例...

这个示例展示了如何应用方案。（1-2 句）

## 总结

方案的核心价值。（1 句）
后续可以如何扩展。（1 句）
```

### Blog Post Structure

```
✓ Engaging flow:

开场：一个引人入胜的问题或故事。（2-3 句）

过渡：这引出了我们今天的主题。（1 句）

观点一：第一个核心观点。（1 句）
展开：详细解释和例子。（3-4 句）

观点二：第二个核心观点。（1 句）
这个更重要，因为...（展开）

总结：回到开场呼应，给出结论。（2-3 句）
```

## Repetition Patterns to Fix

### Redundant Intensifiers

```
❌ 非常非常重要 → ✓ 至关重要
❌ 很好很好很好 → ✓ 非常好
❌ 真的真的需要 → ✓ 确实需要
```

### Redundant Qualifiers

```
❌ 个人认为我觉得 → ✓ 我认为
❌ 基本上差不多 → ✓ 基本如此
❌ 可能也许会 → ✓ 可能会
```

### Circular Repetition

```
❌ 这个功能很实用，非常有用，确实好用
✓ 这个功能实用性强

❌ 需要注意的问题是，要注意...
✓ 需要注意...
```

### But Keep Rhetorical Repetition

```
✓ Keep:
不是因为容易，而是因为困难。
不是不想做，而是做不到。

✓ Keep for emphasis:
重要！非常重要！必须重视！
（Deliberate repetition for emphasis）
```

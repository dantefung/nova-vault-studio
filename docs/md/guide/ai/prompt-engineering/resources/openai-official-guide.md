---
title: "OpenAI 官方提示词指南"
date: "2026-05-07"
source: "原创"
url: "https://platform.openai.com/docs/guides/gpt-best-practices"
---

原文地址：<https://platform.openai.com/docs/guides/gpt-best-practices>



# 一、**获得更好结果的六种策略**

### [写下清晰的说明](https://platform.openai.com/docs/guides/prompt-engineering/write-clear-instructions)

这些模型无法读懂你的想法。如果输出太长，请要求简短回复。如果输出太简单，请要求专家级写作。如果你不喜欢这种格式，请演示你想要看到的格式。模型猜测你想要什么的次数越少，你得到它的可能性就越大。

策略：

* [在您的查询中包含详细信息以获取更相关的答案](https://platform.openai.com/docs/guides/prompt-engineering/tactic-include-details-in-your-query-to-get-more-relevant-answers)

* [要求模特采用角色](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-to-adopt-a-persona)

* [使用分隔符清楚地指示输入的不同部分](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-delimiters-to-clearly-indicate-distinct-parts-of-the-input)

* [指定完成任务所需的步骤](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-steps-required-to-complete-a-task)

* [提供例子](https://platform.openai.com/docs/guides/prompt-engineering/tactic-provide-examples)

* [指定所需的输出长度](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-desired-length-of-the-output)

### [提供参考文本](https://platform.openai.com/docs/guides/prompt-engineering/provide-reference-text)

语言模型可以自信地编造虚假答案，尤其是在被问及深奥的话题或引用和 URL 时。就像一张笔记可以帮助学生在考试中取得更好的成绩一样，向这些模型提供参考文本可以帮助他们用更少的编造来回答问题。

策略：

* [指示模型使用参考文本回答](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text)

* [指示模型使用参考文本的引用来回答](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-with-citations-from-a-reference-text)

### [将复杂任务拆分为更简单的子任务](https://platform.openai.com/docs/guides/prompt-engineering/split-complex-tasks-into-simpler-subtasks)

正如在软件工程中将复杂系统分解为一组模块化组件是一种很好的做法一样，提交给语言模型的任务也是如此。复杂任务的错误率往往高于简单任务。此外，复杂任务通常可以重新定义为简单任务的工作流程，其中较早任务的输出用于构建后续任务的输入。

策略：

* [使用意图分类来识别与用户查询最相关的说明](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query)

* [对于需要长时间对话的对话应用，总结或过滤之前的对话](https://platform.openai.com/docs/guides/prompt-engineering/tactic-for-dialogue-applications-that-require-very-long-conversations-summarize-or-filter-previous-dialogue)

* [分段总结长文档并递归构建完整摘要](https://platform.openai.com/docs/guides/prompt-engineering/tactic-summarize-long-documents-piecewise-and-construct-a-full-summary-recursively)

### [给模型时间“思考”](https://platform.openai.com/docs/guides/prompt-engineering/give-the-model-time-to-think)

如果要求您将 17 乘以 28，您可能无法立即知道答案，但仍然可以随着时间的推移得出答案。同样，模型在尝试立即回答时会犯更多推理错误，而不是花时间得出答案。在回答之前要求“思路”可以帮助模型更可靠地推理出正确答案。

策略：

* [指导模型在匆忙得出结论之前找到自己的解决方案](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion)

* [使用内心独白或一系列查询来隐藏模型的推理过程](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-inner-monologue-or-a-sequence-of-queries-to-hide-the-model-s-reasoning-process)

* [询问模型在之前的传递中是否遗漏了什么](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-if-it-missed-anything-on-previous-passes)

### [使用外部工具](https://platform.openai.com/docs/guides/prompt-engineering/use-external-tools)

通过向模型提供其他工具的输出来弥补模型的弱点。例如，文本检索系统（有时称为 RAG 或检索增强生成）可以告知模型相关文档。像 OpenAI 的代码解释器这样的代码执行引擎可以帮助模型进行数学运算和运行代码。如果某项任务可以通过工具而不是语言模型更可靠或更高效地完成，则可以将其卸载以充分利用两者的优势。

策略：

* [使用基于嵌入的搜索实现高效的知识检索](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval)

* [使用代码执行进行更精确的计算或调用外部 API](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-code-execution-to-perform-more-accurate-calculations-or-call-external-apis)

* [授予模型访问特定功能的权限](https://platform.openai.com/docs/guides/prompt-engineering/tactic-give-the-model-access-to-specific-functions)

### [系统地测试变化](https://platform.openai.com/docs/guides/prompt-engineering/test-changes-systematically)

如果可以测量，则提高性能会更容易。在某些情况下，对提示的修改将在几个孤立示例上实现更好的性能，但在更具代表性的示例集上导致整体性能下降。因此，为了确保更改对性能有净积极影响，可能需要定义一个全面的测试套件（也称为“评估”）。

策略：

* [参考黄金标准答案评估模型输出](https://platform.openai.com/docs/guides/prompt-engineering/tactic-evaluate-model-outputs-with-reference-to-gold-standard-answers)

## 二、[策略](https://platform.openai.com/docs/guides/prompt-engineering/tactics)

上面列出的每一种策略都可以用具体的策略来实例化。这些策略旨在提供一些可以尝试的想法。它们绝不是完全全面的，你应该随意尝试这里没有提到的创造性想法。

### 1. [策略：写下清晰的说明](https://platform.openai.com/docs/guides/prompt-engineering/strategy-write-clear-instructions)

#### [策略：在查询中包含详细信息以获得更相关的答案](https://platform.openai.com/docs/guides/prompt-engineering/tactic-include-details-in-your-query-to-get-more-relevant-answers)

为了获得高度相关的响应，请确保请求提供所有重要细节或背景信息。否则，您将让模型来猜测您的意思。

#### [策略：要求模特采用角色](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-to-adopt-a-persona)

系统消息可用于在回复中指定模型所使用的角色。

#### [策略：使用分隔符清楚地指示输入的不同部分](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-delimiters-to-clearly-indicate-distinct-parts-of-the-input)

三重引号、XML 标签、章节标题等分隔符可以帮助划分需要不同处理的文本部分。



#### [策略：指定完成任务所需的步骤](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-steps-required-to-complete-a-task)

有些任务最好以一系列步骤的形式来描述。明确地写出这些步骤可以让模型更容易遵循它们。

#### [策略：提供例子](https://platform.openai.com/docs/guides/prompt-engineering/tactic-provide-examples)

提供适用于所有示例的一般说明通常比通过示例演示任务的所有排列更有效，但在某些情况下，提供示例可能更容易。例如，如果您希望模型复制一种难以明确描述的特定用户查询响应风格。这被称为“少量”提示。

#### [策略：指定所需的输出长度](https://platform.openai.com/docs/guides/prompt-engineering/tactic-specify-the-desired-length-of-the-output)

您可以要求模型生成具有给定目标长度的输出。目标输出长度可以根据单词、句子、段落、要点等的数量来指定。但请注意，指示模型生成特定数量的单词并不能实现高精度。该模型可以更可靠地生成具有特定数量的段落或要点的输出。

### 2. [策略：提供参考文本](https://platform.openai.com/docs/guides/prompt-engineering/strategy-provide-reference-text)

#### [策略：指导模型使用参考文本回答](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text)

如果我们可以为模型提供与当前查询相关的可信信息，那么我们就可以指示模型使用提供的信息来组成其答案。

鉴于所有模型的上下文窗口都有限，我们需要某种方式来动态查找与所提问题相关的信息。[嵌入](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)可用于实现高效的知识检索。有关如何实现此目的的更多详细信息，请参阅策略[“使用基于嵌入的搜索实现高效的知识检索” 。](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval)

#### [策略：指示模型用参考文本中的引文来回答](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-with-citations-from-a-reference-text)

如果输入已补充相关知识，则可以直接要求模型通过引用所提供文档中的段落为其答案添加引文。请注意，然后可以通过所提供文档中的字符串匹配以编程方式验证输出中的引文。

### 3. [策略：将复杂任务拆分为更简单的子任务](https://platform.openai.com/docs/guides/prompt-engineering/strategy-split-complex-tasks-into-simpler-subtasks)

#### [策略：使用意图分类来识别与用户查询最相关的指令](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query)

对于需要大量独立指令集来处理不同情况的任务，首先对查询类型进行分类并使用该分类来确定需要哪些指令会很有帮助。这可以通过定义固定类别和硬编码与处理给定类别中的任务相关的指令来实现。此过程还可以递归应用，以将任务分解为一系列阶段。这种方法的优点是每个查询将仅包含执行任务下一阶段所需的指令，与使用单个查询执行整个任务相比，这可以降低错误率。这还可以降低成本，因为更大的提示运行成本更高（[请参阅定价信息](https://openai.com/pricing)）。

例如，假设对于客户服务应用程序，查询可以按如下方式进行有用分类：

根据客户查询的分类，可以向模型提供一组更具体的指令，以便其处理后续步骤。例如，假设客户需要“故障排除”方面的帮助。

请注意，模型已被指示发出特殊字符串来指示对话状态何时发生变化。这使我们能够将系统变成状态机，其中状态决定注入哪些指令。通过跟踪状态、该状态下哪些指令相关以及可选地允许从该状态进行哪些状态转换，我们可以为用户体验设置护栏，而这很难通过结构化程度较低的方法实现。

#### [策略：对于需要长时间对话的对话应用，总结或过滤之前的对话](https://platform.openai.com/docs/guides/prompt-engineering/tactic-for-dialogue-applications-that-require-very-long-conversations-summarize-or-filter-previous-dialogue)

由于模型具有固定的上下文长度，因此用户和助手之间的对话（其中整个对话包含在上下文窗口中）不能无限期地继续下去。

这个问题有多种解决方法，其中一种是总结对话中的前几轮。一旦输入的大小达到预定的阈值长度，这可能会触发一个总结部分对话的查询，并且前一次对话的摘要可以作为系统消息的一部分。或者，可以在整个对话过程中在后台异步总结前一次对话。

另一种解决方案是动态选择与当前查询最相关的对话的先前部分。请参阅策略[“使用基于嵌入的搜索实现高效的知识检索”](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval)。

#### [策略：分段总结长文档并递归构建完整摘要](https://platform.openai.com/docs/guides/prompt-engineering/tactic-summarize-long-documents-piecewise-and-construct-a-full-summary-recursively)

由于模型具有固定的上下文长度，因此它们不能用于在单个查询中汇总长度超过上下文长度减去生成的摘要的长度的文本。

要总结非常长的文档（例如一本书），我们可以使用一系列查询来总结文档的每个部分。可以将各部分摘要连接起来并进行总结，从而生成摘要的摘要。此过程可以递归进行，直到总结整个文档。如果需要使用有关前面部分的信息来理解后面的部分，那么另一个有用的技巧是在总结该部分内容的同时，在书中任何给定点之前包含文本的连续摘要。OpenAI 在之前的[研究](https://openai.com/research/summarizing-books)中使用 GPT-3 变体研究了此程序对总结书籍的有效性。

### 4. [策略：给模型时间“思考”](https://platform.openai.com/docs/guides/prompt-engineering/strategy-give-models-time-to-think)

#### [策略：在匆忙得出结论之前，指导模型自己找到解决方案](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion)

有时，当我们明确指示模型在得出结论之前从基本原理进行推理时，我们会得到更好的结果。例如，假设我们想要一个模型来评估学生对数学问题的解决方案。最明显的方法是直接询问模型学生的解决方案是否正确。

有时候，当我们明确地指示模型在得出结论之前先从基本原理进行推理，我们会得到更好的结果。例如，假设我们想让模型评估学生对数学问题的解答。最直接的方法是简单地问模型学生的解答是否正确。

但这位学生的解决方案其实并不正确！我们可以通过提示模型先生成自己的解决方案来让模型成功注意到这一点。





#### [策略：使用内心独白或一系列查询来隐藏模型的推理过程](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-inner-monologue-or-a-sequence-of-queries-to-hide-the-model-s-reasoning-process)

之前的策略表明，在回答特定问题之前，模型对问题进行详细推理有时很重要。对于某些应用，模型得出最终答案所使用的推理过程不适合与用户共享。例如，在辅导应用中，我们可能希望鼓励学生自己找出答案，但模型对学生解决方案的推理过程可能会向学生透露答案。

内心独白是一种可以用来缓解这种情况的策略。内心独白的理念是指示模型将输出中本应对用户隐藏的部分放入结构化格式中，以便于解析它们。然后在向用户呈现输出之前，对输出进行解析，并且只显示输出的一部分。

或者，这可以通过一系列查询来实现，其中除最后一个查询之外的所有查询的输出都对最终用户隐藏。

首先，我们可以让模型自己解决问题。由于这个初始查询不需要学生的解决方案，因此可以省略。这提供了额外的优势，即模型的解决方案不会受到学生尝试的解决方案的影响。

接下来，我们可以让模型使用所有可用的信息来评估学生解决方案的正确性。

最后，我们可以让模型利用自己的分析，以乐于助人的导师的身份构建答复。

#### [策略：询问模型在之前的传递中是否遗漏了什么](https://platform.openai.com/docs/guides/prompt-engineering/tactic-ask-the-model-if-it-missed-anything-on-previous-passes)

假设我们使用模型列出与特定问题相关的来源摘录。列出每个摘录后，模型需要确定是否应该开始编写另一个摘录或是否应该停止。如果源文档很大，模型通常会过早停止并无法列出所有相关摘录。在这种情况下，通常可以通过使用后续查询提示模型来查找之前传递时遗漏的任何摘录来获得更好的性能。

### 5. [策略：使用外部工具](https://platform.openai.com/docs/guides/prompt-engineering/strategy-use-external-tools)

#### [策略：使用基于嵌入的搜索实现高效的知识检索](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-embeddings-based-search-to-implement-efficient-knowledge-retrieval)

如果外部信息源作为输入的一部分，模型可以利用这些信息源。这可以帮助模型生成更明智和最新的响应。例如，如果用户询问有关特定电影的问题，将有关该电影的高质量信息（例如演员、导演等）添加到模型的输入中可能会很有用。嵌入可用于实现高效的知识检索，以便可以在运行时将相关信息动态添加到模型输入中。

文本嵌入是一种可以衡量文本字符串之间相关性的向量。相似或相关的字符串会比不相关的字符串更接近。这一事实，加上快速向量搜索算法的存在，意味着嵌入可用于实现高效的知识检索。具体来说，可以将文本语料库分成块，并且可以嵌入和存储每个块。然后可以嵌入给定的查询，并执行向量搜索以从语料库中找到与查询最相关（即在嵌入空间中最接近）的嵌入文本块。

示例实现可以在[OpenAI Cookbook](https://cookbook.openai.com/examples/vector_databases/readme)中找到。请参阅策略[“指示模型使用检索到的知识来回答查询”，](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text)了解如何使用知识检索来最大限度地降低模型编造错误事实的可能性的示例。

#### [策略：使用代码执行进行更精确的计算或调用外部 API](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-code-execution-to-perform-more-accurate-calculations-or-call-external-apis)

语言模型不能依靠自身准确地执行算术或长时间计算。在需要的情况下，可以指示模型编写和运行代码，而不是自己进行计算。具体来说，可以指示模型将要运行的代码放入指定的格式（例如三重反引号）。生成输出后，可以提取并运行代码。最后，如果需要，可以将代码执行引擎（即 Python 解释器）的输出作为模型的输入，以供下一个查询使用。

代码执行的另一个好用例是调用外部 API。如果模型被指导如何正确使用 API，它就可以编写利用该 API 的代码。可以通过向模型提供文档和/或代码示例来展示如何使用 API，从而指导模型如何使用 API。

**警告：执行模型生成的代码并非天生安全，任何试图执行此操作的应用程序都应采取预防措施。特别是，需要沙盒代码执行环境来限制不受信任的代码可能造成的危害。**

#### [策略：让模型访问特定功能](https://platform.openai.com/docs/guides/prompt-engineering/tactic-give-the-model-access-to-specific-functions)

Chat Completions API 允许在请求中传递函数描述列表。这使模型能够根据提供的模式生成函数参数。生成的函数参数由 API 以 JSON 格式返回，可用于执行函数调用。函数调用提供的输出随后可以在以下请求中反馈到模型中以关闭循环。这是使用 OpenAI 模型调用外部函数的推荐方式。要了解更多信息，请参阅我们的入门文本生成指南中的[函数调用部分](https://platform.openai.com/docs/guides/function-calling)以及OpenAI Cookbook 中的更多[函数调用示例。](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models)

### 6. [策略：系统地测试变化](https://platform.openai.com/docs/guides/prompt-engineering/strategy-test-changes-systematically)

有时很难判断某个变化（例如，新的指令或新的设计）是让你的系统变得更好还是更糟。查看几个示例可能会提示哪个更好，但由于样本量较小，很难区分真正的改进还是随机的运气。也许这种变化有助于提高某些输入的性能，但会损害其他输入的性能。

评估程序（或“评估”）对于优化系统设计非常有用。好的评估包括：

* 代表现实世界的使用情况（或至少是多样化的）

* 包含许多测试用例以获得更强的统计能力（请参阅下表了解指南）

* 易于自动化或重复

输出评估可以由计算机、人类或两者混合完成。计算机可以使用客观标准（例如，只有一个正确答案的问题）以及一些主观或模糊标准自动进行评估，其中模型输出由其他模型查询进行评估。OpenAI [Evals](https://github.com/openai/evals)是一个开源软件框架，提供用于创建自动评估的工具。

当存在一系列可能的输出，且这些输出的质量同样高时（例如，对于答案较长的问题），基于模型的评估会很有用。基于模型的评估可以实际评估的内容与需要人工评估的内容之间的界限很模糊，并且随着模型功能越来越强大而不断变化。我们鼓励进行实验，以确定基于模型的评估对您的用例的效果如何。

#### [策略：参考黄金标准答案评估模型输出](https://platform.openai.com/docs/guides/prompt-engineering/tactic-evaluate-model-outputs-with-reference-to-gold-standard-answers)

假设已知一个问题的正确答案应该参考一组特定的已知事实。那么我们可以使用模型查询来计算答案中包含了多少个所需的事实。

例如，使用以下系统消息：

以下是满足两点的示例输入：

以下是仅满足一个点的示例输入：

这是一个不满足任何条件的输入示例：

这种基于模型的评估有很多可能的变体。考虑以下变体，它跟踪候选答案和黄金标准答案之间的重叠类型，并跟踪候选答案是否与黄金标准答案的任何部分相矛盾。

下面是一个示例输入，其答案不合标准，但并不与专家答案相矛盾：

以下是一个示例输入，其答案与专家答案直接矛盾：

下面是一个带有正确答案的示例输入，它还提供了比必要更多的细节：

## [其他资源](https://platform.openai.com/docs/guides/prompt-engineering/other-resources)

要获得更多灵感，请访问[OpenAI Cookbook](https://cookbook.openai.com/)，其中包含示例代码以及第三方资源的链接，例如：

* [提示库和工具](https://cookbook.openai.com/related_resources#prompting-libraries--tools)

* [提示指南](https://cookbook.openai.com/related_resources#prompting-guides)

* [视频课程](https://cookbook.openai.com/related_resources#video-courses)

* [关于通过高级提示提高推理能力的论文](https://cookbook.openai.com/related_resources#papers-on-advanced-prompting-to-improve-reasoning)



   

***

谢谢你读我的文章。

如果觉得不错，随手点个赞、在看、转发三连吧🙂

如果想第一时间收到推送，也可以给我个星标⭐～谢谢你看我的文章。



每次我都想提醒一下，这不是凡尔赛，是希望有想法的人**勇敢冲**。

我不会代码，我英语也不好，但是我做出来了很多东西，在文末的开源知识库可见。

我真心希望能影响更多的人来尝试新的技巧，迎接新的时代。



Github主页：**https://github.com/KimYx0207**

我的小破站：**https://www.aiking.dev  **

X：**https://x.com/KimYx0207**



**这里先讲，如果自学能力强，看老金的开源知识库足矣，不要浪费钱来报名。**



**陪伴群** - 目前的群越来越多，因此开了陪伴群，将会优先进行答疑。群众的小伙伴们也更积极热爱AI，动手能力较强，学习氛围较好。



**第二期课程** - 3月8日已开启，约1个季度，每周日19-21点直播上课。案例以我的个人主页和小龙虾为主。更重要的是，我将在课中教学“元”的概念，是我创建的一套方法论，可大幅提升复杂问题处理的质量与效率。



开源知识库地址：https://tffyvtlai4.feishu.cn/wiki/OhQ8wqntFihcI1kWVDlcNdpznFf

![](../images/openai-guide-0.png)

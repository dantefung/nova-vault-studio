---
title: "Harrison Chase：How to build a knowledge factory——缺的不是模型，是知识"
date: "2026-11-21"
source: "X/Twitter"
author: "Harrison Chase (@hwchase17)"
url: "https://x.com/hwchase17/status/2124181216719151585"
coverImage: "../images/hwchase-knowledge-factory/001.jpg"
---

# Harrison Chase：How to build a knowledge factory——缺的不是模型，是知识

> 要让 AI 在公司里真干活，缺的不是更好的模型，也不只是更多上下文，而是更好的知识——关于公司怎么运转、有哪些运营标准、数据在哪里。LangChain 内部 GTM 与内容 Agent、LangSmith Engine 都有 learning loop，把「知识工厂」的构成拆开讲。

<!-- more -->

In order to make AI work for your company, the missing bit is not better models, it’s not just more [context](https://www.langchain.com/blog/context-engineering-for-agents) - it’s better knowledge. It’s knowledge of how your company works, what standards for operating you have in place, where data is stored and how it’s accessed.

Your most efficient employees have this knowledge in their head. They know who to talk to, where to go to answer questions, why you do things in a particular way. That knowledge is often tacit, implicit, scattered - sometimes present only in their head, sometimes scattered across a variety of documents.

In order to make AI work for your company, you need to collect, curate, and maintain a representation of that knowledge to pass to agents. The system that helps you do that is what we’re calling a knowledge factory.

We’ve built this at LangChain in a few ways. Our internal [GTM](https://www.langchain.com/blog/how-we-built-langchains-gtm-agent) and [content studio](https://www.langchain.com/blog/design-agent) agents are powered by a knowledge factory. [LangSmith Engine](https://www.langchain.com/langsmith/engine) (our agent that runs over traces and suggests fixes) maintains a knowledge factory per agent as well. This blog shares our learnings.

## Context vs knowledge

Context is what an agent has available when doing a task.

Knowledge is the reusable understanding we maintain so it can do that task correctly: what a metric means, which source to trust, or how we handle a particular situation. Sometimes written down, often not.

A knowledge factory turns scattered documents and experience into knowledge that can become context for future work.

So knowledge is a form of context that the agent will get, but it’s often not (and shouldn’t be) the only context the agent gets. Other types of context you already ingest/store reliably, and that can just be provided directly to the agent (see the section on quickly changing data below).

## From Software Factory to Knowledge Factory

The idea of software factories has risen sharply over the past year and a half. The idea is that rather than having your best engineers actually build software, they should build the factory (the systems) to help everyone at the company build software more efficiently. The actual building of the software can be done by agents.

General knowledge work is now following a similar path. Agents are good enough to make presentations, launch videos, do outbound. You should be leveraging them as much as possible for those tasks. But in order for them to accomplish those tasks they need all that tacit, implicit, scattered knowledge.

That is where you should devote resources. You need to build that knowledge, and more importantly a factory to collect, curate and maintain that knowledge. That is what will let you outsource more general knowledge tasks to agents.

## The pieces of knowledge

There are generally a few pieces of knowledge you want to maintain.

- How to do the work — Skills. Procedures, instructions, and scripts for accomplishing tasks the way your company expects.
- How the business works — Domain knowledge. Definitions, policies, and facts about your products, customers, competitors, and organization.
- Where to get current information — Data access guidance. Which sources to use, what data lives where, and how to query it.

![](../images/hwchase-knowledge-factory/002.jpg)

Skills: these are procedures for how to do things “properly” inside your company. Instructions, scripts, for how to accomplish tasks in the particular way that your company requires. Often times, these were never written down before (instead passed coworker to coworker). You should strive to write them down.

Domain knowledge: this is knowledge that does not go stale frequently. It is often core information about people, products, competitors. This is often information that was written down - but was usually incomplete (or incorrect) just due to the sheer amount of knowledge here.

Data access guidance: You should have a good data strategy (Snowflake, Databricks, etc). That’s the foundation of useful agents. If the source of truth of data is there already, and it’s complete and up to date - there’s no need to maintain a separate copy. Rather, the new thing you’ll want to maintain is clear instructions on what data lives where and how to query it.

## The pieces of the factory

All of this information is needed for useful agents. Don’t try to maintain it manually - that’s a herculean effort. Rather, you will want to create a system for maintaining it. Generally, the pieces look like:

![](../images/hwchase-knowledge-factory/003.jpg)

A way for agents to flag missing knowledge: One of the best ways to learn what pieces of knowledge are missing is to have agents flag it as they are working. If they are asked to do something, and can’t find information, or find information that they discover is wrong - they should flag it! Give the agent a tool to at a minimum report what is wrong, and optionally suggest the correct update.

The curator agent: an agent to update, curate, and maintain this knowledge: This knowledge should not be kept up to date manually - too much work. And it should not be kept up to date solely by the agents that use it - they are great at flagging what’s wrong or missing, but fixing it requires deep understanding of the underlying knowledge and other sources of data. Asking agents - who are mainly trying to accomplish their own goals - to properly update and maintain this knowledge will cause it to become unruly and full of contradictions. Rather - you will want a curator agent that runs in the background, [on some cadence](https://docs.langchain.com/langsmith/python/managed-deep-agents-schedules), to update this knowledge. It should have access to all the raw sources of data (Notion, Slack, etc) where this knowledge may be scattered. It should have access to [agent traces](https://www.langchain.com/langsmith/observability), so it can see how people are trying to use agents and codify that into skills. It should have access to the things that agents have flagged as wrong (the above section).

Storage for the knowledge: In some ways, this is actually the least important thing. You can store this knowledge in [skill format](https://docs.langchain.com/oss/python/deepagents/skills) in GitHub. In a single file in Notion. In [OKF format](https://github.com/open-knowledge-format/open-knowledge-format) in [LangSmith Context Hub](https://www.langchain.com/blog/introducing-context-hub). In a knowledge graph in Neo4j. The curator agent should know how to interact with all of these formats (not that hard). In other ways, this is the least explored area. How do you represent [memory](https://www.langchain.com/blog/how-to-give-your-agent-memory)? As an industry, we’ve converged on skills for “procedural memory”. For more semantic memory, a different standard will likely emerge (OKF?). It is early and no standard has yet emerged - so it’s probably best to not be too prescriptive or overly complicate what this format should look like.

## Putting it all together

Let’s finish with an end to end example of an agent preparing a revenue report.

There’s base context the agent will need: the raw revenue numbers, stored in BigQuery and Salesforce.

Then there’s knowledge. It may consist of a few different types:

- Skills: how to create reports in LangChain style. These are stored in GitHub in the standard skills format.
- Long duration knowledge: the way we calculate ARR. This is stored in a company wiki.
- How to access quickly changing knowledge: how to access that raw data in BigQuery/Salesforce. These are also just stored as skills, but this time in Context Hub.

The agent runs. Maybe it notices that we renamed a column in BigQuery. It figures out the correct column on the fly. It uses its tool it has to report issues to flag this, and suggest the proper column name.

After it creates the report, our finance lead works synchronously with the agent to fix a few formatting issues, including telling it to use a new header we now need to use for all LangChain documents.

That night, the curator agent sees the flagged issue. It also inspects the traces of the agent and notices this back and forth with our finance lead. It updates the relevant skills accordingly (to use the new column when fetching data, and to use the new header when drafting report).

![](../images/hwchase-knowledge-factory/004.jpg)

## Conclusion

The goal isn’t to document everything before agents can start working. It’s to build a system where doing the work reveals what knowledge is missing, and resolving those gaps makes future work better. Start with one recurring workflow, inspect where agents struggle, and close that loop.

We’ve [built this at LangChain](https://www.langchain.com/blog/components-building-company-harness), and are working with a few customers to bring this to their agents (internal and external). If you’re interested in this - please [reach out](https://www.langchain.com/contact-sales), we can help!

## 相关页面

- [[concepts/llm-wiki]]
- [[concepts/agent-memory-four-layers]]
- [[patterns/progressive-disclosure]]

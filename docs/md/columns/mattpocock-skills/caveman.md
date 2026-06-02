---
title: "caveman 技能：超压缩通信模式"
date: "2026-06-02"
source: "mattpocock/skills"
url: "https://github.com/mattpocock/skills"
---

# caveman 技能：超压缩通信模式

## 定位

caveman 是**超压缩通信模式**，通过去除填充词减少约 **75% 的 token 使用**，同时保持完整的技术准确性。

## 核心原则

**穴居人通讯法**：

- 删除所有客套语（「我想请教一下」「这个问题的背景是……」）
- 删除所有导言（「我现在要做 X」「让我来解释一下」）
- 直接陈述事实、命令或问题

## 对比示例

**正常表达（过多填充）：**
```
Hey, so I was wondering if we could maybe take a look at that 
authentication module? I think there might be some issues with 
how the tokens are being refreshed, but I'm not 100% sure.
```

**Caveman 模式：**
```
auth token refresh broken. how to repro?
```

## 技术准确性保证

压缩的是**语言风格**，不是**技术内容**：

- 技术术语保留（token、auth、repro）
- 数量信息保留（75% 压缩的是 filler，不是 substance）
- 隐含上下文需要额外说明（如「broken」需要说明是 401 还是 timeout）

## 适用场景

- Chat 反复修改同一模块时
- Token 预算紧张时
- 快速追问细节时

## 参见

- GitHub: [mattpocock/skills](https://github.com/mattpocock/skills)
- 同系列：[grill-me](./grill-me.md)、[handoff](./handoff.md)
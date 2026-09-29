# 语义草稿契约

只在抽取或写入 `draft.json` 时加载本文件。

## 输入结构

```json
{
  "title": "文章标题",
  "thesis": "30–50字总主旨",
  "orientation": "static|dynamic|balanced",
  "static_nodes": [
    {"key": "唯一短键", "level": "root|branch|leaf", "name": "名称", "summary": "30–50字", "parent": null}
  ],
  "tracks": [
    {
      "name": "轨道名",
      "activities": [
        {"key": "唯一短键", "name": "活动名", "summary": "动作+目的+产出，30–50字"}
      ]
    }
  ],
  "mappings": [
    {"static": "静态key", "activity": "活动key", "reason": "15字以内"}
  ],
  "feedback": [
    {"activity": "活动key", "static": "静态key", "reason": "15字以内"}
  ]
}
```

## 不变量

- `key` 在静态节点与活动的合集内全局唯一，只用于语义引用。
- `root.parent` 为 `null`；其余静态节点的 `parent` 引用已有静态 `key`。
- `root` 恰好一个，`branch` 为 2–6 个；`leaf` 可为零个。
- 静态树最多三层：root → branch → leaf。
- 活动顺序由其所在数组决定；不要添加序号或 ID。
- `mappings` 只表达静态支撑动态；`feedback` 只表达动态反哺静态。
- 无显性方法时 `tracks`、`mappings`、`feedback` 均为空数组。

## 四个校准示例

1. LTC 长文：概念/规则树 + 端到端业务轨道 + 规则支撑活动 + 复盘回流。
2. 本体规范：对象/关系/约束树 + 建模活动轨道 + 概念到活动的依赖。
3. 思维框架：原则树 + 决策步骤轨道 + 实践结果反哺原则的反馈。
4. 纯理论综述：只输出静态树；不要为了画面完整而虚构轨道。

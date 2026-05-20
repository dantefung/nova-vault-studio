---
title: "ARCHITECTURE.md 模板"
date: "2026-05-08"
source: "GitHub Conn-Ho/harness-engineering"
url: "https://github.com/Conn-Ho/harness-engineering"
---

# ARCHITECTURE.md 模板

---

## 系统概览

[用 2-3 句话描述系统的核心职责和边界。]

---

## 分层架构

### 层级定义

| 层级 | 目录 | 职责 | 不允许做什么 |
|------|------|------|------------|
| Types | `src/types/` | 类型定义和接口 | 不允许有任何业务逻辑 |
| Config | `src/config/` | 配置管理 | 只能依赖 Types |
| Repository | `src/repository/` | 数据访问 | 不允许有业务规则 |
| Service | `src/services/` | 业务逻辑 | 不允许直接访问数据库 |
| Runtime | `src/[routes/api]/` | HTTP 处理 | 不允许有业务逻辑 |
| UI | `src/components/` | 界面渲染 | 不允许直接调用数据库 |

### 依赖方向

```
Types → Config → Repository → Service → Runtime → UI
```

依赖只能向右（向上层流动），绝不允许反向。

---

## 核心技术选型

| 技术 | 选型 | 原因 | 决策记录 |
|------|------|------|---------|
| 数据库 | [选型] | [一句话原因] | [ADR 链接] |
| 状态管理 | [选型] | [一句话原因] | [ADR 链接] |

---

## API 约定

### 响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 关键约束

1. **[约束 1]**：[描述]
2. **[约束 2]**：[描述]

---
title: "潜伏的缓存刺客：Next.js + OpenNext + Cloudflare KV 存储暴涨实录"
date: "2026-10-13"
source: "meathill.com"
url: "https://meathill.com/posts/cloudflare-worker/nextjs-opennext-cloudflare-kv-storage-leak-guide"
---

# 潜伏的缓存刺客：Next.js + OpenNext + Cloudflare KV 存储暴涨实录

## 意外的账单告警

Cloudflare KV 存储爆了，计费周期存储量 3.59 GB-month，远超免费用量（1GB 免费额度）。

原因：OpenNext 的 KV 增量缓存实现中，`kv.put()` 没有传递第三个参数 `{ expirationTtl }`，导致写入的 Key 永久有效，永远不会被自动回收。

## 源码下的真相

OpenNext 源码中赫然写着 TODO：

```javascript
await kv.put(this.getKVKey(key, cacheType), JSON.stringify({
    value,
    lastModified: Date.now(),
}));
// TODO: Figure out how to best leverage KV's TTL.
// NOTE: Ideally, the cache should operate in an SWR-like manner.
```

官方开发者留下了未完成的 TODO，是因为遇到了 SWR 语义冲突：Next.js ISR 依赖软过期机制，如果给 KV 设硬 TTL，到期 Key 直接被物理删除，用户访问会被切到 SSR。

## 为什么普通 Demo 没事，真实项目会炸？

三重放大催化为存储灾难：

### 1. 随机 Build ID 与版本隔离

每执行一次部署，Next.js 就会生成一个新的 Build ID，产生一套新的缓存。积极开发项目每周好几次更新部署。

### 2. 构建期全量 Bulk Put

每次 `opennextjs-cloudflare deploy` 都会触发 `populateCache` 命令，把全站预渲染页面全量塞进 KV。

### 3. 老版本瞬间沦为"孤岛僵尸数据"

新版本部署后，上一版本的所有预渲染页面失去访问入口，既不会被读取也不会被重写，但因为没有 TTL，全部永久躺在 KV 上。

## 修复方案

### 1. 启用全新 KV 命名空间

直接放弃旧桶，新建 KV Namespace，删掉 24GB 僵尸数据的旧 Namespace。

### 2. 重构增量缓存：Soft SWR + Hard Ceiling

自己实现带 TTL 守护的增量缓存适配器：

```typescript
export const DEFAULT_KV_EXPIRATION_TTL_SECONDS = 7 * 24 * 3600; // 604,800 秒

export function calculateExpirationTtl(value: unknown): number {
  const revalidate = (value as { revalidate?: number }).revalidate;
  if (typeof revalidate === "number" && revalidate > 0) {
    // 给予两倍于 revalidate 的生存窗口，上限封顶 7 天
    const candidate = Math.floor(revalidate * 2);
    return Math.min(DEFAULT_KV_EXPIRATION_TTL_SECONDS,
      Math.max(60, candidate));
  }
  return DEFAULT_KV_EXPIRATION_TTL_SECONDS;
}

// 每个写入 KV 的条目都强制带上最长 7 天的 expirationTtl
await kv.put(kvKey, JSON.stringify({ value, lastModified: Date.now() }),
  { expirationTtl });
```

业务层（Soft SWR）：Next.js 继续执行软过期判定与后台异步更新；物理层（Hard Ceiling）：7 天一到，Cloudflare 底层自动物理抹除。

### 3. 补齐构建期 Bulk Put 漏洞

在 `scripts/patch-opennext.mjs` 中追加构建补丁逻辑，为 Bulk Put 注入 7 天 `expiration_ttl`。

## 总结

Serverless 赋予了独立开发者低成本撬动全球基础设施的能力，但原生的自动扩容也让账单可能无上限扩张。

唯有扒开黑盒、直面源码，才能在一次次避坑排障中把架构打磨得真正健壮可靠。

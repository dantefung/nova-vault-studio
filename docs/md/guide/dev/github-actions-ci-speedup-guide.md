---
title: "GitHub Actions CI 彻底提速指南：从 10 大维度大幅缩短耗时"
date: "2026-11-01"
source: "X (Twitter)"
url: "https://x.com/HiTw93/status/2116797957454401746"
---

# GitHub Actions CI 彻底提速指南：从 10 大维度大幅缩短耗时

> 有了 AI 以后写代码速度快了非常多，但是校验的速度其实还是不快的，特别是在 GitHub 上跑 Actions CI 的速度。分享对 Mole、Kaku、Pake 的 CI 全部彻底优化的实战经验。

## 一键优化 AI Agent 提示词（Prompt）

你可以直接复制以下 Prompt 给你的 AI Agent（如 Claude Code、Codex 等）：

```text
帮我把这个仓库的 GitHub Actions 提速，在不减少必要的测试项以及功能校验下，最大幅度减少耗时。

1. 先使用 gh 拉最近 50 次的运行情况，把每一个 job 拆成排队、准备、真正跑测试的 3 个时间段，去看规律，可能很多时候慢的是准备的阶段，不是测试本身。
2. 同一个 PR 连着推好几次时，只跑最新的那次，旧的直接取消掉，用 cancel-in-progress 去实现。不过 main 分支不要这么做，需要确保发版 main 上的每一个提交都完整跑过一遍。
3. 只改 README 和文档的这种提交不要触发跑 CI，可以用 paths 过滤掉，另外被跳过的必需检查会一直卡住 PR 合不进去，这个要提前注意一下。
4. 优先用 setup 类 action 自带的缓存，setup-node 打开 cache，setup-go 默认就开，Rust 用 Swatinem/rust-cache，注意每个仓库缓存只有 10 GB，用不上的就不要放到这里面去。
5. 本地连着构建两次，第二次应该几乎不花时间，假如有多余的花时间的地方，一定是哪些写得有问题，比如 Dockerfile 装依赖前先 COPY 了整个仓库，或者构建脚本盯着一个不存在的文件，类似的问题记得检查。
6. 工具直接下载预编译好的，不要用 go install、cargo install 现场安装编译，这里会很费时间。
7. 不互相依赖的 job 并行跑，删掉不传数据的 needs，最长的那套测试拆到多台机器上去跑。
8. 免费账号的 macOS 最多同时跑 5 个，所有 workflow 共用，格式化、lint、依赖审计这些不挑系统的都移到 Ubuntu 去跑更好。
9. 做过的事情就不要做重复了，以及不要多此一举做事情，比如别的 job 跑过的检查就不要套重复再跑，比如只构建前端的 job 就不要多此一举去拉整个 Rust 缓存。
10. 改完去 push 那个上面测试运行效果，看运行的时间，发现规律，再次查漏补缺来优化一遍，做到最好，最后给到我优化前后的对比。
```

## 10 大提速核心维度剖析

1. **量化诊断瓶颈**：先用 `gh run list / gh run view` 分析前 50 次 CI 运行耗时，清晰拆解排队、拉取镜像、编译、执行测试各阶段占比。
2. **取消过时构建**：配置 `concurrency: cancel-in-progress`，避免同一个 PR 频繁 Push 造成排队堆积；主分支保持独立排队确保合入校验。
3. **精准路径触发**：通过 `on.push.paths-ignore` 过滤纯 Markdown、文档与说明修改，避免不必要的 Actions 消耗。
4. **利用原生缓存机制**：充分激活 `setup-node`、`setup-go`、`rust-cache` 等高效缓存，避免超过 10GB 仓库配额。
5. **杜绝冷启动全量复制**：检查 Dockerfile 和构建脚本，确保依赖分层缓存不被前置的 `COPY .` 破坏。
6. **优先二进制分发**：以 Prebuilt Release 二进制替代 `cargo install` / `go install` 现场源码编译。
7. **拓扑解耦并发执行**：精简非必须的 `needs` 强依赖，长任务做矩阵并行切割（Matrix Testing）。
8. **合理调度 Runner 资源**：macOS 机器资源稀缺，非平台强依赖任务（Lint、Format、Audit）一律交由 Ubuntu Runner。
9. **避免跨 Job 冗余校验**：切片式运行，纯前端构建不挂载大型编译缓存。
10. **持续数据回测闭环**：通过运行耗时对比反复迭代，以数据变化驱动 CI 维护。

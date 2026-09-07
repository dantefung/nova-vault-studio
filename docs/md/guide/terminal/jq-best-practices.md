---
title: "jq 最佳实践指南"
date: "2026-09-07"
source: "社区整理"
url: ""
---

# jq 最佳实践指南

jq 是一款轻量级、灵活的命令行 JSON 处理器，让你能够轻松地切片、过滤、映射和转换结构化数据。本文档总结了 jq 在日常使用中的最佳实践，涵盖安装、基础用法、性能优化、安全注意事项等核心主题。


## 一、安装与基础环境

### 1.1 安装方式

| 系统 | 命令 |
|------|------|
| Debian/Ubuntu | `sudo apt-get install jq` |
| CentOS/RHEL | `sudo yum install jq` |
| Fedora | `sudo dnf install jq` |
| macOS | `brew install jq` |
| Windows | 官网下载二进制文件 或 `choco install jq` |

安装后验证：`jq --version`

### 1.2 基本语法

```bash
jq [OPTIONS] FILTER [FILE...]
```

不指定文件时，jq 从标准输入读取数据。这意味着可以与其他命令通过管道组合使用。


## 二、格式化与输出控制

### 2.1 美化输出（Pretty Print）

最常用的格式化命令，使用身份过滤器 `.`：

```bash
jq '.' data.json
echo '{"name":"John","age":30}' | jq '.'
```

### 2.2 常用输出选项

| 选项 | 用途 | 示例 |
|------|------|------|
| `-c` | 紧凑输出（单行） | `jq -c '.' data.json` |
| `-r` | 原始输出（去除引号） | `jq -r '.name' data.json` |
| `-S` | 按键排序输出 | `jq -S '.' data.json` |
| `--indent n` | 自定义缩进空格数 | `jq --indent 4 '.' data.json` |
| `--tab` | 使用制表符缩进 | `jq --tab '.' data.json` |

### 2.3 保存格式化结果

**安全做法**（使用临时文件）：

```bash
jq '.' input.json > temp.json && mv temp.json input.json
```

**更优雅的做法**（使用 `sponge`，需安装 `moreutils`）：

```bash
jq '.' input.json | sponge input.json
```

> ⚠️ **警告**：不要直接执行 `jq '.' file.json > file.json`，这会清空原文件——因为 `>` 重定向会先创建/清空文件，此时 jq 尚未读取数据。


## 三、数据提取与转换

### 3.1 基础提取

```bash
# 提取字段
jq '.name' data.json                    # "Alice"

# 嵌套字段
jq '.user.profile.name' data.json       # "拾光"

# 数组索引
jq '.[1]' data.json                     # "banana"

# 数组切片
jq '.[1:4]' data.json                   # ["banana","cherry","date"]

# 遍历数组元素
jq '.[]' data.json                      # 逐行输出每个元素
```

### 3.2 管道操作

与 Unix 管道类似，jq 中的 `|` 将左侧输出作为右侧输入：

```bash
jq '.user | .name' data.json            # 等同于 .user.name
```

### 3.3 条件过滤

```bash
# 数值比较
jq 'select(.price > 100)' products.json

# 正则匹配
jq 'select(.email | test("@qq.com$"))' users.json

# 多条件
jq 'select(.active and .role=="admin")' data.json
```

### 3.4 常用操作模式

| 需求 | 命令片段 |
|------|----------------------|
| 数组转行 | `jq -c '.[]'` |
| CSV 输出 | `jq -r '[.id,.name] | @csv'` |
| 去重 | `unique_by(.id)` |
| 统计（长度/最小/最大/求和） | `[.scores[]] | length, min, max, add` |
| 字符串拼接 | `jq '.first + " " + .last'` |
| 字符串格式化 | `jq '"ID:\(.id) | Name:\(.name)"'` |


## 四、格式校验

### 4.1 语法校验

```bash
# 校验文件
jq . data.json

# 校验字符串
echo '{"name":"John"}' | jq .
```

- 格式正确：jq 格式化并打印内容
- 格式错误：jq 报错并指出具体位置（行列号）

### 4.2 使用退出状态码

在 Shell 脚本中判断 JSON 是否有效：

```bash
json_string='{"name": "John"}'

if jq -e . >/dev/null 2>&1 <<<"$json_string"; then
    echo "✅ JSON 格式有效"
else
    echo "❌ JSON 格式无效"
fi
```

> `-e` 让退出状态码精确反映解析结果；`>/dev/null 2>&1` 屏蔽输出，只保留状态码。

### 4.3 纯校验（不输出）

```bash
jq empty data.json
```

`empty` 过滤器不产生任何输出，适合仅做校验的场景。

### 4.4 数据结构验证

| 验证目的 | 命令 |
|----------|------|
| 检查键是否存在 | `jq 'has("name")' data.json` |
| 验证字段类型 | `jq '.age | type == "number"' data.json` |
| 验证字段值范围 | `jq '.age > 0 and .age < 150' data.json` |
| 检查数组非空 | `jq '.products | length > 0' data.json` |


## 五、性能优化

### 5.1 避免重复解析

在循环中处理大量 JSON 时，尽量避免反复调用 jq。考虑：

- 使用 `--slurp` / `-s` 将多行 JSON 合并为一个数组一次性处理
- 在单次 jq 调用中完成所有转换

### 5.2 选择合适的输出格式

- 需要人类阅读时使用美化输出
- 需要管道传递给其他程序时使用 `-c` 紧凑输出
- 需要纯文本值时使用 `-r` 原始输出

### 5.3 处理大型文件

处理大型 JSON 文件时：

```bash
# 使用流式处理（适用于超大文件）
jq --stream 'select(.[0] | contains(["large_field"]))' huge.json

# 只提取需要的字段，避免加载整个文件
jq '.necessary_field' huge.json
```


## 六、安全注意事项

### 6.1 保持版本最新

jq 多个历史版本存在安全漏洞，**强烈建议升级到 jq 1.9 或更高版本**。

已知漏洞包括：

| CVE | 影响版本 | 问题描述 |
|-----|----------|----------|
| CVE-2026-32316 | ≤ 1.8.1 | 字符串拼接时整数溢出导致堆缓冲区溢出 |
| CVE-2026-33947 | ≤ 1.8.1 | 路径操作递归无深度限制，可导致栈溢出崩溃 |
| CVE-2026-33948 | 特定提交前 | NUL 字节截断导致验证绕过 |
| CVE-2026-39956 | 特定提交后 | `_strindices` 内置函数参数校验缺陷 |

### 6.2 处理不可信输入

- **不要**使用不可信输入作为 jq 内置函数的参数，特别是 `_strindices`
- 处理不可信 JSON 时注意路径数组长度，避免触发递归栈溢出
- 依赖 jq 验证不可信 JSON 的工作流存在被绕过的风险

### 6.3 生产环境建议

```bash
# 检查当前版本
jq --version

# 如版本过低，立即升级
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install jq

# 或从官方源码编译最新版本
```


## 七、脚本集成与自动化

### 7.1 传递外部变量

使用 `--arg` 将 Shell 变量传入 jq 过滤器：

```bash
name="Alice"
jq --arg name "$name" '. | select(.name == $name)' data.json
```

### 7.2 修改 JSON 配置

```bash
# 更新字段值
jq '.timeout = 30' config.json > new_config.json

# 删除字段
jq 'del(.deprecated_field)' config.json > new_config.json

# 数值运算
jq '.price * (1 + .tax)' data.json
```

### 7.3 管道组合

```bash
# 从 API 获取数据并提取字段
curl -s https://api.example.com/data | jq '.items[].name'

# 提取字段后传递给其他命令
jq -r '.servers[].hostname' servers.json | xargs -I {} ssh {} 'uptime'
```


## 八、调试技巧

### 8.1 逐步构建过滤器

复杂过滤器建议从简单开始逐步叠加：

```bash
# 第1步：查看整体结构
jq '.' data.json

# 第2步：查看目标层级
jq '.users' data.json

# 第3步：添加过滤条件
jq '.users[] | select(.active == true)' data.json

# 第4步：最终提取所需字段
jq '.users[] | select(.active == true) | .name' data.json
```

### 8.2 使用紧凑输出调试

```bash
jq -c '.' data.json    # 单行输出，便于快速查看结构
```

### 8.3 常见错误排查

| 错误现象 | 可能原因 | 排查方法 |
|----------|----------|----------|
| parse error | JSON 格式不合法 | 检查是否有多余逗号、键名是否用双引号 |
| null 或空输出 | 字段路径错误 | 先用 `.` 查看完整结构确认路径 |
| 文件被清空 | 重定向覆盖了输入文件 | 使用临时文件或 `sponge` |
| 处理中断 | 文件过大或递归过深 | 考虑流式处理或升级 jq 版本 |


## 九、快速参考卡片

| 场景 | 命令 |
|------|------|
| 美化输出 | `jq '.' file.json` |
| 紧凑输出 | `jq -c '.' file.json` |
| 提取字段 | `jq '.field' file.json` |
| 嵌套字段 | `jq '.a.b.c' file.json` |
| 数组遍历 | `jq '.[]' file.json` |
| 条件过滤 | `jq 'select(.x>10)' file.json` |
| 格式校验 | `jq empty file.json` |
| 传递变量 | `jq --arg v "$var" '. | select(.x==$v)'` |
| CSV 输出 | `jq -r '.[] | [.id,.name] | @csv'` |
| 更新字段 | `jq '.field = "new"' file.json` |
| 删除字段 | `jq 'del(.field)' file.json` |


## 十、参考资料

- 官方手册：`man jq`
- 官方教程：https://jqlang.github.io/jq/tutorial/
- 官方文档：https://jqlang.github.io/jq/manual/
- 下载页面：https://jqlang.org/download/

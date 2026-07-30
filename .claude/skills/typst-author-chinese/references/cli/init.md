# typst init — 从模板创建项目

```
typst init [OPTIONS] <TEMPLATE> [DIR]
```

## 参数

| 参数 | 说明 |
|------|------|
| `<TEMPLATE>` | 模板名，如 `@preview/charged-ieee`。可指定版本：`@preview/charged-ieee:0.1.0`，不指定则用最新版 |
| `[DIR]` | 项目目录，默认为模板名称 |

## 选项

| 选项 | 说明 |
|------|------|
| `--package-path <DIR>` | 本地包路径 [env: TYPST_PACKAGE_PATH=] |
| `--package-cache-path <DIR>` | 包缓存路径 [env: TYPST_PACKAGE_CACHE_PATH=] |

## 常用示例

```bash
# 从 Typst Universe 模板创建（默认目录名为模板名）
typst init @preview/charged-ieee

# 指定版本和目录
typst init @preview/charged-ieee:0.1.0 my-paper

# 查看可用模板：https://typst.app/universe/
```

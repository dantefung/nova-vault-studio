---
title: "Gemini 无头模式翻译指引"
date: "2026-06-16"
source: "GitHub"
url: "https://github.com/2025Emma/vibe-coding-cn"
---

# Gemini 无头模式翻译指引

目标：在本地使用 Gemini CLI（gemini-2.5-flash）完成无交互批量翻译，避免工具调用与权限弹窗，适用于 prompts/skills/文档的快速机翻初稿。

## 原理概述
- CLI 通过本地缓存的 Google 凭证直连 Gemini API，模型推理在云端完成。
- 使用 `--allowed-tools ''` 关闭工具调用，确保只返回纯文本，不触发 shell/浏览器等动作。
- 通过标准输入传入待翻译文本，标准输出获取结果，便于脚本流水线处理。
- 可设置代理（http/https）让请求走本地代理节点，提升成功率与稳定性。

## 基本命令
```bash
# 代理（如需）
export http_proxy=http://127.0.0.1:9910
export https_proxy=http://127.0.0.1:9910

# 单条示例：中文 -> 英文
printf '你好，翻译成英文。' | gemini -m gemini-2.5-flash \
  --output-format text \
  --allowed-tools '' \
  "Translate this to English."
```
- 提示语放在位置参数即可（`-p/--prompt` 已被标记弃用）。
- 输出为纯文本，可重定向保存。

## 批量翻译文件示例（stdin → stdout）
```bash
src=i18n/zh/prompts/README.md
dst=i18n/en/prompts/README.md
cat "$src" | gemini -m gemini-2.5-flash --output-format text --allowed-tools '' \
  "Translate to English; keep code fences unchanged." > "$dst"
```
- 可在脚本中循环多个文件；失败时检查退出码与输出。

## 与现有 l10n-tool 的搭配
- l10n-tool（deep-translator）用于全量机翻；若质量或连通性不稳，可改为逐文件走 Gemini CLI。
- 流程：`cat 源文件 | gemini ... > 目标文件`；必要时在其他语种目录放跳转说明或手动校对。

## 注意事项
- 确保 `gemini` 命令在 PATH 且已完成身份认证（首次运行会引导登录）。
- 长文本建议分段，避免超时；代码块保持原样可在提示语中声明 “keep code fences unchanged”。
- 代理端口依实际环境调整；如不需要代理，省略相关环境变量。

---
title: "Open Chrome with Remote Debugging"
version: "1.0"
---

# Open Chrome Debug

快速开启 Chrome 的 `--remote-debugging-port`，让 chrome-devtools-mcp 连接你的已登录态浏览器。

---

## 使用场景

当 chrome-devtools 工具导航到需要登录态的网站时显示"登录后可见"，说明它连接的是自己启动的无登录态 Chrome，而不是你的主 Chrome。此 skill 帮你一键解决。

---

## 快速命令

```bash
# 一行搞定：关闭 Chrome → 带调试端口重启
killall chrome 2>/dev/null; sleep 1; /opt/google/chrome/chrome --remote-debugging-port=9222
```

---

## 分步操作

### 1. 检查当前状态

```bash
# 检查是否已开启调试端口
curl -s http://127.0.0.1:9222/json/version 2>/dev/null || echo "未开启"

# 检查 Chrome 启动参数
cat /proc/$(pgrep -f "chrome" | head -1)/cmdline 2>/dev/null | tr '\0' ' '
```

### 2. 关闭 Chrome

```bash
killall chrome
# 或强制：killall -9 chrome
```

### 3. 带调试端口重启

```bash
/opt/google/chrome/chrome --remote-debugging-port=9222
```

### 4. 验证

```bash
curl -s http://127.0.0.1:9222/json/version
# 返回 {"Browser":"Chrome/xxx","protocol-version":"1.3"} 即成功
```

---

## 注意事项

- Chrome 原有标签页在 `killall` 后不会恢复，但快速重启后大部分标签页会自动重新加载
- 调试端口 9222 只在本机监听，外网无法访问
- 重启 Chrome 后 chrome-devtools 会自动连接到带登录态的主 Chrome
- 如果 Chrome 无法正常启动（如 profile 锁），等待几秒后重试

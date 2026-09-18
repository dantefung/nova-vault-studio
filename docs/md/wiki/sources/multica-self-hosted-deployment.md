---
title: "Multica 私有化自托管部署指南（Docker & K8s）"
date: "2026-09-16"
source: "君哥的学习笔记"
url: "https://www.it235.com/ai/multiagent/mutlica.html"
---

# Multica 私有化自托管部署指南（Docker & K8s）

> 在自己的服务器或本机用 Docker / K8s 把 Multica 跑起来。涵盖环境前置条件、基于源码构建镜像、Docker Compose 编排、环境配置与避坑指南。

<!-- more -->

## Self-Host说明 自托管

> 在自己的服务器或本机用 Docker 把 Multica 跑起来

![部署步骤图](../images/multica-self-hosted-deployment/001.png)

> 官方也支持`k8s`部署

## 前置条件

我这边是基于`ubuntu 22.4`，必须有`docker`和`docker compose`环境

> 安装`docker`和`docker compose` https://blog.csdn.net/spb229443329/article/details/157201232

`git`安装：`sudo apt install git-all`

## 基于源码安装

### 镜像构建

安装`make`命令

```
sudo apt install -y make
sudo apt install -y make-guile
```

Copied!

1  
2

从`github`拉取源码，`https://github.com/multica-ai/multica.git`

```
git clone https://github.com/multica-ai/multica.git
cd multica
make selfhost

# 你会看到如下日志输出
ron@ron-B85M-D3H:~/ai/multica$ make selfhost-build
==> Creating .env from .env.example...
==> Generated random JWT_SECRET
==> Building Multica from the current checkout...
docker compose -f docker-compose.selfhost.yml -f docker-compose.selfhost.build.yml up -d --build
 ✔ Image pgvector/pgvector:pg17 Pulled              
 ⠙ Image multica-web:dev        Building            
 ⠙ Image multica-backend:dev    Building
```

Copied!

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13

核心模块主要有3个，分别是数据库、前端、后端：后端采用go、前端采用next.js、数据库是postgresql。

所以在构建镜像过程中会下载go、npm相关包，如果要加速，可以修改`Dockerfile`和`Dockerfile.web`中的相关指令，为其提速。**不提速大概率会遇到镜像构建失败的问题**

`Dockerfile`用来构建后端go服务，我们加入以下内容

```
ENV GOPROXY=https://goproxy.cn,direct
# 在这行前面加上国内镜像源
RUN cd server && go mod download
```

Copied!

1  
2  
3

`Dockerfile.web`用来构建前端next前端服务

```
WORKDIR /app
# 注意，在这行后面加上淘宝镜像源
RUN pnpm config set registry https://registry.npmmirror.com
```

Copied!

1  
2  
3

构建成功最终会输出

```
[+] up 8/8
 ✔ Image multica-backend:dev      Built           271.2s
 ✔ Image multica-web:dev          Built           271.2s
 ✔ Network multica_default        Created         0.1s
 ✔ Volume multica_pgdata          Created         0.0s
 ✔ Volume multica_backend_uploads Created         0.0s
 ✔ Container multica-postgres-1   Healthy         6.4s
 ✔ Container multica-backend-1    Started         7.4s
 ✔ Container multica-frontend-1   Started         7.5s
==> Waiting for backend to be ready...

使用docker ps命令查看启动情况
ron@ron-B85M-D3H:~/ai/multica$ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED              STATUS                        PORTS                      NAMES
61e4c1616a1c   multica-web:dev          "docker-entrypoint.s…"   About a minute ago   Up About a minute             127.0.0.1:3000->3000/tcp   multica-frontend-1
37f0c1982baf   multica-backend:dev      "./entrypoint.sh"        About a minute ago   Up About a minute             127.0.0.1:8080->8080/tcp   multica-backend-1
a409d0c01b54   pgvector/pgvector:pg17   "docker-entrypoint.s…"   About a minute ago   Up About a minute (healthy)   5432/tcp                   multica-postgres-1
```

Copied!

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17

在命令行中执行`curl http://localhost:3000`，如果有反馈说明服务启动成功，然后在浏览器中访问该地址

如果浏览器中无法访问该端口，大概率是防火墙的问题，需要将`port`开放出来

**开放局域网访问**

部署好之后我们要做的一件事情就是在局域网中开放访问，接下来就需要修改`docker-compose.selfhost.yml`中的如下配置`services.backend.ports`和`services.frontend.ports`

```
services:
  backend:
    ports:
      - "127.0.0.1:${BACKEND_PORT:-${API_PORT:-${SERVER_PORT:-${PORT:-8080}}}}:8080"
  frontend:
    ports:
      - "127.0.0.1:${FRONTEND_PORT:-3000}:3000"

# 把127.0.0.1:  这几个字符去掉，然后运行下面命令重启
docker compose -f docker-compose.selfhost.yml -f docker-compose.selfhost.build.yml up -d
```

Copied!

1  
2  
3  
4  
5  
6  
7  
8  
9  
10

![部署步骤图](../images/multica-self-hosted-deployment/002.png)

默认未配置验证码smtp服务，所以无法收到验证码，不过你可以通过执行以下命令来查看服务端日志来查看验证码

`docker logs -f --tail=222 multica-backend-1`

![部署步骤图](../images/multica-self-hosted-deployment/003.png)

进入容器

```
docker exec -it multica-postgres-1 psql -U multica -d multica
psql

\d schema_migrations
select * from schema_migrations;
```

Copied!

1  
2  
3  
4  
5  
6

### 参数配置修改

所有配置都在`.env`中，当我们运行`make selfhost`，会使用当前目录下的`Makefile`，`Makefile`中有明确写明`cp .env.example .env`并赋值相关变量

我们本次要修改的环境变量如下：

```
# Database
POSTGRES_DB=multica
POSTGRES_USER=multica
POSTGRES_PASSWORD=multica
POSTGRES_PORT=5432
DATABASE_URL=postgres://multica:multica@localhost:5432/multica?sslmode=disable
# 设大一些
DATABASE_MAX_CONNS=250
# Server
# 运行环境（APP_ENV）用于管控生产环境安全校验。
# 自托管部署的 Docker 环境默认将 APP_ENV 固定为 production（生产环境）。
# 本地开发环境可留空不设置。
# 完整的登录配置说明请参考 SELF_HOSTING.md 文件。
APP_ENV=production
# 可选的本地/测试环境快捷配置。默认值为空，因此不会生成固定的验证码。
# 若未配置 RESEND_API_KEY，系统会将生成的验证码打印到标准输出（终端）。
# 如果你需要本地自动化测试可重复执行，可设置一个 6 位数字的值（例如 888888），
# 并确保 APP_ENV 不为生产环境。
# 当 APP_ENV=production（生产环境）时，该配置会被直接忽略。
MULTICA_DEV_VERIFICATION_CODE=
PORT=8080

# 本地/自托管后端端口的可选别名配置。
# 如果设置了以下任一变量，其优先级会高于 Docker Compose、Makefile 和安装助手脚本中的 PORT 配置。
# BACKEND_PORT=8080
# API_PORT=8080
# SERVER_PORT=8080

# Prometheus 监控指标默认禁用。
# 启用后，指标服务会绑定到本地回环地址（仅本机可访问）；
# 除非你通过私有网络、白名单或代理认证对监听端口进行保护，否则不要修改。
# 严禁将该指标接口通过公共应用/API 入口暴露到公网。
# 仅当此监听服务启用时，HTTP 请求指标才会开始统计。
# METRICS_ADDR=127.0.0.1:9090

# 初始化时随机生成，jwt签名验证使用，官方建议反向代理层做认证签名
JWT_SECRET=31db4c63b27929ef2560c22e7cb253d3ff9347b3645a210b56250710c23c7fca

# 该值由 Makefile / 本地脚本根据后端端口自动推导生成。
# 仅当守护进程通过不同的 URL 访问 API 时，才需要手动显式设置。
# 局域网配置
MULTICA_SERVER_URL=ws://192.168.3.150:8080/ws
# 该值由 docker-compose.selfhost.yml 及本地脚本根据前端端口自动生成。
# 仅当应用对外访问地址与本地前端地址不一致时，才需要手动指定。
MULTICA_APP_URL=http://192.168.3.150:3000
# API 可通过公网访问的公开地址（末尾**不要加斜杠**）。
# 用于生成自动化任务（autopilot）Webhook 触发器所需的**绝对 URL**。
# 如果部署在同源反向代理之后，或仅本地开发使用，可留空不设置；
# 这种情况下前端会自动通过 window.origin + webhook_path 拼接出完整地址。
# 刻意不通过请求头推导该值，是为了避免：
# 当自托管反向代理未做安全加固时，出现 Host / X-Forwarded-Host 地址伪造攻击。
MULTICA_PUBLIC_URL=
# Comma-separated CIDR list of reverse proxies whose X-Forwarded-For /
# X-Real-IP headers the per-IP webhook rate limiter is allowed to trust.
# Empty (the default) means "trust no headers" — the limiter uses
# r.RemoteAddr only, which is the safe shape when the backend is
# exposed directly. Set this when running behind nginx/Caddy/Cloudflare:
# e.g. "127.0.0.1/32" for a same-host reverse proxy, or the CDN's
# announced ranges for cloud deployments.
MULTICA_TRUSTED_PROXIES=
MULTICA_DAEMON_CONFIG=
MULTICA_WORKSPACE_ID=
MULTICA_DAEMON_ID=
MULTICA_DAEMON_DEVICE_NAME=
MULTICA_DAEMON_POLL_INTERVAL=3s
MULTICA_DAEMON_HEARTBEAT_INTERVAL=15s
MULTICA_CODEX_PATH=codex
MULTICA_CODEX_MODEL=
MULTICA_CODEX_WORKDIR=
MULTICA_CODEX_TIMEOUT=20m

# Self-host image channel 自托管镜像更新通道
# Default stable release channel. Pin to an exact release like v0.2.4 if you
# want to stay on a specific version. If the selected tag has not been
# published to GHCR yet, use make selfhost-build / the build override instead.
# 自行构建镜像 make selfhost-build 就会无视该配置
MULTICA_IMAGE_TAG=latest
MULTICA_BACKEND_IMAGE=ghcr.io/multica-ai/multica-backend
MULTICA_WEB_IMAGE=ghcr.io/multica-ai/multica-web

# Email 邮件方案，有A-Saas和B-自定义方案
# Two delivery options - only one needs to be configured:
#
# Option A: Resend (SaaS, recommended for cloud deployments)
#   Set RESEND_API_KEY to a key from resend.com and verify your sending domain there.
#   For local/dev use, leave RESEND_API_KEY empty - codes print to stdout. To
#   accept a fixed local code, also set MULTICA_DEV_VERIFICATION_CODE above
#   (ignored when APP_ENV=production).
RESEND_API_KEY=
# 这个邮箱必须该为你的才能发送邮件
RESEND_FROM_EMAIL=noreply@multica.ai
#
# Option B: SMTP relay (for self-hosted / on-premise deployments)
#   Takes priority over Resend when SMTP_HOST is set.
#   Supports unauthenticated relay (leave SMTP_USERNAME empty) and authenticated SMTP.
#   Set SMTP_TLS_INSECURE=true only for private CA or self-signed certificates.

# 详见：https://wx.mail.qq.com/list/readtemplate?name=app_intro.html#/agreement/authorizationCode
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USERNAME=5943139000@qq.com
SMTP_PASSWORD=xxxxxxx
SMTP_TLS_INSECURE=true

# Google OAuth
# The web login page reads GOOGLE_CLIENT_ID from /api/config at runtime, so
# changing it only requires restarting the backend / compose stack. No web
# rebuild is needed.
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# Derived by docker-compose.selfhost.yml / local scripts from FRONTEND_PORT.
# Set explicitly only when your OAuth callback URL differs from local frontend.
# GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# S3 / CloudFront
# S3_BUCKET — bucket NAME only (e.g. "my-bucket"). Do NOT include the
# ".s3.<region>.amazonaws.com" suffix; the server builds the public URL
# from S3_BUCKET + S3_REGION. S3_REGION must match the bucket's real region.
S3_BUCKET=
S3_REGION=us-west-2
CLOUDFRONT_KEY_PAIR_ID=
CLOUDFRONT_PRIVATE_KEY_SECRET=multica/cloudfront-signing-key
CLOUDFRONT_PRIVATE_KEY=
CLOUDFRONT_DOMAIN=
# COOKIE_DOMAIN — optional Domain attribute on session + CloudFront cookies.
# Leave empty for single-host deployments (localhost, LAN IP, or a single
# hostname) — session cookies become host-only, which is what the browser
# wants. Only set it when the frontend and backend sit on different
# subdomains of one registered domain (e.g. ".example.com"). Do NOT set it
# to an IP address: RFC 6265 forbids IP literals in the cookie Domain
# attribute and browsers silently drop such cookies.
COOKIE_DOMAIN=

# AUTH_TOKEN_TTL — auth token lifetime. Accepts Go duration strings (e.g.
# "8760h", "720h30m") or plain integer seconds.
# Default: 2592000 (30 days). Self-hosted deployments on trusted networks can
# set a longer value to reduce re-authentication frequency.
# Note: longer TTL = longer exposure window if a cookie is leaked.
# AUTH_TOKEN_TTL=2592000

# 本地文件存储方案，当S3未设置时默认起用
# Local file storage (fallback when S3_BUCKET is not set)
LOCAL_UPLOAD_DIR=./data/uploads
# Derived by Makefile / local scripts from the backend port.
# Set explicitly only when uploads are served through a different public URL.
# 
LOCAL_UPLOAD_BASE_URL=http://192.168.3.150:8080

# Security 安全跨域、跨站攻击
# Comma-separated list of allowed origins for CORS and WebSocket connections.
# Defaults to localhost dev origins when unset.
# Example: CORS_ALLOWED_ORIGINS=https://app.multica.ai,https://staging.multica.ai
CORS_ALLOWED_ORIGINS=

# 限流方案，防止无限刷验证码、刷云服务
# ==================== Rate limiting (optional Redis) ====================
# Per-IP fixed-window rate limiter on the public auth endpoints
# (/auth/send-code, /auth/verify-code, /auth/google). Backed by Redis.
# When REDIS_URL is unset the limiter is a no-op (fail-open) and the
# backend logs "rate limiting disabled: REDIS_URL not configured" at
# startup. The same REDIS_URL is reused by the realtime fan-out hub,
# the PAT cache, and the daemon-token cache.
# REDIS_URL=redis://localhost:6379/0
# Max requests per IP per minute. Defaults are 5 for send-code/google
# and 20 for verify-code.
# RATE_LIMIT_AUTH=5
# RATE_LIMIT_AUTH_VERIFY=20
# Comma-separated CIDRs whose X-Forwarded-For the auth limiter is
# allowed to trust. Empty (default) = never trust XFF, only RemoteAddr.
# REQUIRED behind a reverse proxy — otherwise every real user shares
# the proxy IP and the whole deployment lands in one bucket, turning
# /auth/send-code into 5 req/min site-wide. Use e.g. "127.0.0.1/32,::1/128"
# for same-host Caddy/Nginx, or the CDN's published ranges for ALB/CF.
# This is a separate list from MULTICA_TRUSTED_PROXIES above (which
# governs the autopilot webhook limiter).
# RATE_LIMIT_TRUSTED_PROXIES=

# 健康检测接口
# Realtime metrics endpoint (/health/realtime) access control. See MUL-1342.
# When unset, the endpoint only serves direct loopback (127.0.0.1 / ::1)
# callers with no forwarding headers and returns 404 to everything else —
# safe for local dev. Any deployment behind a reverse proxy (Caddy / Nginx
# terminating TLS in front of localhost:8080) MUST set this token, since
# proxied requests look like loopback at the Go layer; with no token, those
# requests are refused with 404. Pass the token as
# `Authorization: Bearer <token>`.
# REALTIME_METRICS_TOKEN=

# Github协作集成
# GitHub App integration (Settings → GitHub "Connect GitHub")
# Both must be set for the Connect button to enable and for webhooks to be
# accepted; leave empty to disable the integration. See docs/github-integration.
# GITHUB_APP_SLUG is the tail of https://github.com/apps/<slug>.
GITHUB_APP_SLUG=
GITHUB_WEBHOOK_SECRET=

# Frontend 前端页面
FRONTEND_PORT=3000
# Derived by docker-compose.selfhost.yml / local scripts from FRONTEND_PORT.
# Set explicitly only when serving frontend on a different origin/domain.
FRONTEND_ORIGIN=http://192.168.3.150:3000
# Leave empty — auto-derived from page origin in browser, set by Makefile for local dev.
# NEXT_PUBLIC_API_URL also feeds the Next.js SSR proxy when explicitly set.
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_WS_URL=

# Remote API (optional) — set to proxy local frontend to a remote backend
# Leave empty to use local backend (localhost:8080)
# REMOTE_API_URL=https://multica-api.copilothub.ai

# 自托管注册控制
# ==================== Self-hosting: Control Signups (fixes #930) ====================
# Set to "false" to completely disable new user signups (recommended for private instances)
ALLOW_SIGNUP=true
# The web UI reads ALLOW_SIGNUP from /api/config at runtime, so toggling this
# only requires restarting the backend / compose stack — not rebuilding web.
# It is not hot-reloaded.

# Optional: Only allow emails from these domains (comma-separated)
ALLOWED_EMAIL_DOMAINS=

# Optional: Only allow these exact email addresses (comma-separated)
ALLOWED_EMAILS=

# Set to "true" to disable workspace creation for every caller on this
# instance (#3433). Operators usually leave this unset, bootstrap the
# shared workspace, then flip this to "true" and restart so subsequent
# users join only via invitations and the entire deployment is visible to
# the platform admin. The web UI reads this from /api/config at runtime,
# so toggling requires a backend restart but not a frontend rebuild.
# 禁用工作空间的创建
DISABLE_WORKSPACE_CREATION=

# ==================== Analytics (PostHog) ====================
# Product analytics events feed the acquisition → activation → expansion funnel.
# Leave POSTHOG_API_KEY empty for local dev / self-hosted instances; the server
# will run a no-op analytics client and ship nothing. See docs/analytics.md.
POSTHOG_API_KEY=
POSTHOG_HOST=https://us.i.posthog.com
# Optional override for the `environment` PostHog event property.
# Defaults from APP_ENV and normalizes to production / staging / dev.
ANALYTICS_ENVIRONMENT=
# Force the no-op client even when POSTHOG_API_KEY is set (CI / opt-out).
ANALYTICS_DISABLED=
```

Copied!

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  
70  
71  
72  
73  
74  
75  
76  
77  
78  
79  
80  
81  
82  
83  
84  
85  
86  
87  
88  
89  
90  
91  
92  
93  
94  
95  
96  
97  
98  
99  
100  
101  
102  
103  
104  
105  
106  
107  
108  
109  
110  
111  
112  
113  
114  
115  
116  
117  
118  
119  
120  
121  
122  
123  
124  
125  
126  
127  
128  
129  
130  
131  
132  
133  
134  
135  
136  
137  
138  
139  
140  
141  
142  
143  
144  
145  
146  
147  
148  
149  
150  
151  
152  
153  
154  
155  
156  
157  
158  
159  
160  
161  
162  
163  
164  
165  
166  
167  
168  
169  
170  
171  
172  
173  
174  
175  
176  
177  
178  
179  
180  
181  
182  
183  
184  
185  
186  
187  
188  
189  
190  
191  
192  
193  
194  
195  
196  
197  
198  
199  
200  
201  
202  
203  
204  
205  
206  
207  
208  
209  
210  
211  
212  
213  
214  
215  
216  
217  
218  
219  
220  
221  
222  
223  
224  
225  
226  
227  
228  
229  
230  
231  
232  
233  
234  
235  
236  
237  
238  
239  
240  
241  
242  
243  
244

![部署步骤图](../images/multica-self-hosted-deployment/004.png)

### 自托管域名配置

```
multica setup self-host \
  --server-url http://192.168.3.150:8080 \
  --app-url http://192.168.3.150:3000
```

Copied!

1  
2  
3

### 远程运行时挂载

![部署步骤图](../images/multica-self-hosted-deployment/005.png)

**注意：挂载运行时需要下载一个小的multica连接器，并装到本地，让本地能够使用multica命令**

1.   `linux or mac`

`curl -fsSL https://raw.githubusercontent.com/multica-ai/multica/main/scripts/install.sh | bash`

2.   `windows`

进入到release页面下载小的multica安装命令，例如：https://github.com/multica-ai/multica/releases/download/v0.3.12/multica_windows_amd64.zip

```
multica config set server_url http://192.168.3.150:8080
multica config set app_url http://192.168.3.150:3000

# token在设置 API Token中创建
multica login --token mul_11f237e347c03a6017bc204f61c43d2571ca16d9
multica daemon start

检查状态
multica daemon status
查看日志
multica daemon logs -f
```

Copied!

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11

### 连接Desktop客户端

请在官网下载最新客户端[https://multica.ai/download](https://multica.ai/download)

```
找到本地用户这个目录~/.multica/，新增desktop.json文件
填写内容
{
  "schemaVersion": 1,
  "apiUrl": "http://192.168.3.150:8080",
  "wsUrl": "ws://192.168.3.150:8080/ws"
}
然后重启multica桌面应用，输入邮箱登录
```

Copied!

1  
2  
3  
4  
5  
6  
7  
8

### 不丢数据重启

```
# 重启
docker compose -f docker-compose.selfhost.yml -f docker-compose.selfhost.build.yml up -d
[+] up 3/3
 ✔ Container multica-postgres-1 Healthy          
 ✔ Container multica-backend-1  Running       
 ✔ Container multica-frontend-1 Running
```

Copied!

1  
2  
3  
4  
5  
6

### 新版本升级

拉取最新代码后，使用命令构建镜像`docker compose -f docker-compose.selfhost.yml -f docker-compose.selfhost.build.yml up -d --build`

注意，默认配置会直接构建tag为latest的镜像，如果投入生产环境，请务必命名版本号，做好回退措施

数据库冲突解决：

后端服务的数据库升级采用的是`golang-migrate`，类似于`liquibase`或`flayway`，脚本都放在`server/migration`中

```
-- 最终会初始化成这样的sql语句进行执行，每个脚本执行一次都会往schema_migrations插入数据
INSERT INTO schema_migrations(version) VALUES ('001_init');
```

Copied!

1  
2

如果遇到migration执行报错，需要通过日志找到具体的行数，进行手动补数据或`skip`

```
skip  100_user_timezone (already applied)
  skip  101_task_usage_hourly_schema (already applied)
  skip  102_task_usage_hourly_pipeline (already applied)
15:09:02.102 ERR failed to run migration file=migrations/103_drop_legacy_daily_rollups.up.sql error="ERROR: refusing to drop legacy daily rollups: task_usage_hourly_rollup_state.watermark_at (2948+00) by more than 01:00:00 — backfill is incomplete or pg_cron is not running. Run cmd/backfill_task_usage_hourly (and let pg_cron catch up) before re-running migrate (see SELF-HOST UPGRAD
```

Copied!

1  
2  
3  
4  
5

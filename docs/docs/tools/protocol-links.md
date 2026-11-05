# 协议链接与一键添加：用链接唤起 zPlayer

zPlayer 注册了 `zplayer` 协议。任何能打开链接的地方——浏览器、聊天工具、笔记、快捷方式或 Windows 运行对话框——都可以用它唤起 zPlayer，执行打开页面、搜索、播放或添加数据源这类操作。

## 打开页面、搜索和播放

| 地址 | 作用 |
| --- | --- |
| `zplayer://open` | 唤起主窗口 |
| `zplayer://navigate?page=home` | 打开首页 |
| `zplayer://navigate?page=history` | 打开历史记录 |
| `zplayer://navigate?page=favorites` | 打开首页收藏夹 |
| `zplayer://navigate?page=online` | 打开在线库 |
| `zplayer://navigate?page=settings` | 打开设置 |
| `zplayer://search?q=电影` | 在首页执行搜索 |
| `zplayer://play?url=…&start=90.5` | 从指定时间开始播放 |

播放链接里 `url` 是必需参数，另外还可以带上 `start`（从第几秒开始，支持小数）、`title`（标题）和 `subtitle`（外挂字幕地址）。省略 `start` 会沿用续播设置，写 `start=0` 则从头播放。正在播放时再次打开会直接切换。

本地文件可以传绝对路径或 `file://` 地址，但接收方必须能访问该路径。网络地址沿用 HTTP、HTTPS、RTSP、SRT、SRTP 等支持范围，不会传递 Cookie、请求头或凭据。动作名写错、参数错误或缺少必需参数时，软件会显示提示，不会当成媒体文件播放。

每个参数值要分别做一次 URL 编码（例如 JavaScript 的 `encodeURIComponent`），不要把整个地址一起编码。

播放器右键菜单和命令搜索里有“复制播放链接”，会带上当前媒体地址、标题和播放位置；知道原始字幕地址时也会一并复制。临时字幕和缓存字幕不会被复制。

## 队列和片段

| 地址 | 作用 |
| --- | --- |
| `zplayer://enqueue?url=…` | 追加到视频播放队列，不打断当前播放 |
| `zplayer://play?url=…&start=90&end=120` | 只播放 90–120 秒这一小段 |
| `zplayer://enqueue?url=…&start=90&end=120` | 把片段加入队列，按顺序播放 |

加入队列不会切换正在播放的内容；空闲时会开始播放。片段播放到结束位置会暂停，不会套用片头片尾跳过或 A-B 循环。`end` 必须大于 `start`，只写 `end` 时起点按 0 处理。

播放器菜单里还有“复制加入队列链接”和“复制片段链接（A–B）”，片段链接使用已经设置好的 A、B 端点，不需要先开启循环。

媒体详情的 Markdown 导出会在顶部加入播放和入队链接，书签时间戳可以点击跳转；书签已经有结束时间时还会提供片段操作。只有开始时间的书签不会推测结束时间。

## 一键添加数据源

```text
zplayer://import?type=emby&url=http%3A%2F%2Fnas.example%3A8096&username=user&password=p%26ss%2Bword&title=My%20NAS
zplayer://import?type=webdav&url=https%3A%2F%2Fnas.example%2Fdav&username=user&password=p%26ss%2Bword
zplayer://import?type=smb&url=smb%3A%2F%2Fnas%2Fshare%2Fmovies&username=user&password=p%26ss%2Bword
zplayer://import?type=plex&url=http%3A%2F%2Fnas.example%3A32400&token=your-token
```

`type` 支持的类型包括：

| 类型 | `type` 取值 |
| --- | --- |
| 媒体服务器 | `emby`、`jellyfin`、`plex`、`fntv`（飞牛影视，也可写 `fnos`）、`zspace`（极影视） |
| 文件与网盘协议 | `webdav`、`smb`、`ftp`、`sftp`、`alist`、`openlist` |
| 对象存储与云盘 | `s3`、`googledrive`、`onedrive`、`dropbox`、`pan115` |
| 在线音乐 | `neteasemusic`、`qqmusic` |

常用参数：

- `url`：完整服务地址，可以带反向代理路径。SMB 使用 `smb://主机/共享/目录`，默认端口 445。
- `title`：可选名称。省略时用服务类型加主机名，同名不同连接会自动加后缀。
- `username`、`password`：直接填入并用于登录，不需要再输入一次。允许空密码，WebDAV、SMB 等也可以尝试匿名访问。Emby、Jellyfin 缺少用户名时会打开编辑页。
- `token`：Plex 使用原始 Token；云盘和在线音乐使用完整的 JSON 授权会话。

每个参数值同样分别 URL 编码一次，密码里的 `&`、`+`、`#`、`%` 和中文都能完整传递。服务地址不接受内嵌用户名密码、查询参数或片段，凭据要用独立参数传入。

点击链接后软件会先验证，成功即加密保存，不需要二次确认；验证失败或保存异常时会打开编辑页，并保留已经填入的字段。完全相同的连接重复导入不会新增；同一服务器、同一用户名但凭据不同的导入会保留为独立配置，不会覆盖已有连接。

连接管理页面还提供“从协议链接添加数据源”，从剪贴板读取同样的链接。凭据不会写进 Markdown 播放链接，也不会记录到导入日志。

### 云盘与在线音乐

`googledrive`、`onedrive`、`dropbox`、`pan115`、`neteasemusic`、`qqmusic` 不需要 `url`，用 `token` 承载 URL 编码后的完整 JSON 授权会话。推荐直接从已有连接复制生成，避免手工遗漏刷新信息。网易云音乐和 QQ 音乐可以完整携带原有会话，不必重新扫码登录。

### S3 对象存储

```text
zplayer://import?type=s3&url=https%3A%2F%2Fs3.example&bucket=movies&accesskey=your-access-key&secretkey=your-secret-key&path=anime%2F
```

`url` 是 Endpoint，`bucket` 是桶名，`accesskey` 和 `secretkey` 是完整凭据，`path` 是可选前缀。

### 完整连接链接与迁移

连接管理中每个连接的“更多”菜单新增两项：

- **复制完整连接链接**：先检查连接，成功后复制包含完整凭据的 `zplayer://import` 链接，保留初始目录、媒体库模式、用途和 SMB 版本等配置。适合把已有连接迁移到另一台设备。
- **复制连接地址**：只复制服务地址，不含账号、密码、密钥或会话。Google Drive 这类没有独立服务器地址的账号，此项不可用。

## 协议投屏

`zplayer://cast?url=…&title=…` 会打开投屏设备选择，把媒体投送出去。这个入口复用已有的投屏流程，不接受片段起止时间或外挂字幕参数。

## 没有反应怎么办

- **链接点不开**：确认 zPlayer 已经安装并且正在运行；首次使用某个协议入口时，Windows 可能要求确认。
- **提示参数错误**：检查参数值是否都做过一次 URL 编码，动作名和参数名是否拼写正确。
- **提示无法播放**：确认接收方能够访问该地址；本地路径需要当前电脑可以读取，网络地址需要没有过期或缺少鉴权。
- **数据源验证失败**：确认服务地址、端口和凭据正确；失败时会打开编辑页，可以在那里修正后重新保存。


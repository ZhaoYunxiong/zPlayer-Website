# 设置参考：遇到需要时再来查

设置页不是安装完成后必须逐项改完的“任务清单”。zPlayer 的默认值已经可以开始播放；这份索引的作用是：当你想改变某个习惯，或者遇到黑屏、卡顿、字幕遮挡之类的问题时，帮你找到对应选项。

实际使用流程请优先阅读[媒体库](/docs/media/)、[播放器](/docs/player/)和[同步](/docs/sync/)。设置页只回答两个问题：**这个选项影响什么**，以及**什么情况下值得改**。

## 软件里的设置入口，对应到哪里？

软件左侧的设置导航会按功能拆成多个页面，下面将关联度高的项目合并说明：

| 软件设置入口 | 文档对应页面 | 主要解决什么问题 |
| --- | --- | --- |
| 首页 | [首页设置](/docs/settings/home) | 启动页、首页行为和历史同步入口 |
| 主题 | [主题与外观](/docs/settings/appearance) | 明暗主题和主题颜色 |
| 文件夹、列表 | [文件夹与列表](/docs/settings/folders-and-lists) | 浏览路径、列表呈现和文件过滤 |
| 解码、播放控制 | [播放、解码与画质](/docs/settings/playback) | 播放内核、手势、硬件解码、滤镜和快捷键 |
| 音乐、音频 | [音乐播放器](/docs/player/music)、[音频与均衡器](/docs/player/audio) | 歌单、动态歌词、音轨和音频输出 |
| 字幕 | [字幕设置](/docs/settings/subtitles)、[字幕使用指南](/docs/player/subtitles) | 字幕引擎、样式、翻译、动画和轨道 |
| 弹幕 | [弹幕设置](/docs/settings/danmaku)、[弹幕使用指南](/docs/player/danmaku) | 弹幕加载、显示范围、密度和性能 |
| 在线库、媒体服务器 | [在线服务](/docs/settings/online-services)、[在线媒体](/docs/media/online-media)、[媒体服务器连接](/docs/media/connections/media-servers) | 在线浏览、外部来源与服务器行为 |
| 投屏、共享 | [投屏与局域网共享](/docs/tools/casting-and-sharing) | 投屏方向、共享服务、端口和防火墙 |
| AI | [AI 模型与内容理解](/docs/settings/ai) | 对话、视觉、嵌入和语义搜索 |
| Whisper | [Whisper AI 字幕](/docs/player/whisper) | 本机模型、实时识别和翻译 |
| RSS | [RSS 订阅与自动下载](/docs/settings/rss) | 订阅、过滤、下载器和路径映射 |
| 模块 | [模块与启动页](/docs/settings/modules) | 导航入口和启动默认页面 |
| 账户、其他 | [账户、网络与其他](/docs/settings/account-and-network) | 本机账户、网络、缓存、备份与恢复 |
| 调试 | [调试与日志](/docs/settings/debug) | 日志级别、日志目录和问题反馈 |

## 按需求找设置

| 你想解决的问题 | 先看哪里 |
| --- | --- |
| 想让首页打开就显示刮削后的海报墙 | [首页管理](/docs/media/home-management)，再看[首页设置](/docs/settings/home) |
| 想改快进幅度、自动全屏、下一集提示 | [播放、解码与画质](/docs/settings/playback) |
| 黑屏、花屏、CPU/GPU 占用很高 | [播放失败、黑屏、卡顿](/docs/troubleshooting/playback) |
| 想调动漫着色器、补帧滤镜 | [画质与滤镜](/docs/player/video-quality) |
| 想同步 Bangumi、Trakt 或媒体服务器 | [同步](/docs/sync/) |
| TMDB 匹配错、海报和剧集信息不对 | [TMDB 与元数据](/docs/media/home/metadata) |
| 想保存网络直播或 M3U 播放列表 | [流媒体链接](/docs/tools/streaming) |
| 想转码、剪辑、提取音轨或字幕 | [媒体处理工具箱](/docs/tools/media-toolbox) |

## 调整设置时的三个习惯

1. **没有问题就先用默认值。** 播放内核、硬件解码和渲染选项互相影响，不需要为了“看起来更专业”全部改一遍。
2. **一次只改一项。** 改完重新打开同一部媒体，才能知道变化来自哪个设置。
3. **记住原来的值。** 如果画面变卡、声音异常或播放器打不开，先恢复刚改的选项，再按[故障排查](/docs/troubleshooting/)处理。

部分播放器设置会在下一次打开媒体或重新加载播放器后完全生效。如果当前视频没有变化，可以停止播放后重新打开，不必反复切换同一个开关。

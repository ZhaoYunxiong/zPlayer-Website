# 媒体库总览

zPlayer 的媒体库分为三个相互配合的部分：

| 部分 | 重点 | 适合的场景 |
| --- | --- | --- |
| [文件服务](/docs/media/file-services) | 连接、目录、文件和来源 | 已经有本地或远程媒体文件 |
| 首页管理 | 扫描、刮削、元数据和首页 | 想用海报墙和继续观看管理媒体 |
| 在线媒体 | 站点、搜索、线路和片源 | 直接从在线服务查找和播放 |

推荐流程是：先添加一个文件服务并验证播放，再决定是否开启首页管理；在线媒体可以独立配置，不必依赖本地媒体库。

## 内容如何流转

文件服务或在线媒体提供可播放内容，首页管理负责整理媒体信息，播放器负责实际播放。媒体详情是三者之间的连接点：它既能展示整理后的信息，也能选择剧集、版本和片源并开始播放。

## 按来源直接开始

- 电脑硬盘、移动硬盘、FTP、SFTP、SMB、WebDAV、AList 或 OpenList：[本地与网络文件服务](/docs/media/connections/local-and-network)
- S3、OneDrive、百度网盘、阿里云盘、夸克网盘或 115：[云盘与对象存储](/docs/media/connections/cloud-and-object-storage)
- Emby、Jellyfin、Plex、飞牛影视、极影视或 DLNA：[媒体服务器](/docs/media/connections/media-servers)
- Maccms、TVBox、JS、Miru、Kazumi 或 IPTV：[在线站点类型](/docs/media/online/site-types)

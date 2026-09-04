import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'

const nav = [
  { text: '首页', link: '/' },
  { text: '使用文档', link: '/docs/' }
]

const sidebar = [
  {
    text: '开始使用',
    collapsed: false,
    items: [
      { text: '软件简介', link: '/docs/getting-started/overview' },
      { text: '首页功能与文档索引', link: '/docs/features' },
      { text: '下载、安装与更新', link: '/docs/getting-started/install' },
      { text: '首次启动', link: '/docs/getting-started/first-launch' },
      { text: '打开文件、链接与种子', link: '/docs/getting-started/open-media' },
      { text: '内购解锁', link: '/docs/getting-started/unlock' },
      { text: '主界面与基本概念', link: '/docs/getting-started/interface' }
    ]
  },
  {
    text: '媒体库',
    collapsed: false,
    items: [
      { text: '媒体库总览', link: '/docs/media/' },
      {
        text: '文件服务与连接',
        collapsed: true,
        items: [
          { text: '文件服务概览', link: '/docs/media/file-services' },
          { text: '本地与网络文件服务', link: '/docs/media/connections/local-and-network' },
          { text: '云盘与对象存储', link: '/docs/media/connections/cloud-and-object-storage' },
          { text: '媒体服务器', link: '/docs/media/connections/media-servers' },
          { text: '连接检查、备份与迁移', link: '/docs/media/connections/backup-and-health' }
        ]
      },
      {
        text: '首页管理',
        collapsed: true,
        items: [
          { text: '首页管理概览', link: '/docs/media/home-management' },
          { text: '首页栏目与布局', link: '/docs/media/home/layout' },
          { text: '扫描与刮削', link: '/docs/media/home/scraping' },
          { text: 'TMDB 与元数据', link: '/docs/media/home/metadata' },
          { text: '搜索、分类与推荐', link: '/docs/media/home/search-and-recommendation' },
          { text: '媒体详情', link: '/docs/media/home/media-detail' },
          { text: '历史记录、收藏与继续观看', link: '/docs/media/home/favorites-and-history' },
          { text: '播放列表', link: '/docs/media/home/playlists' }
        ]
      },
      {
        text: '在线媒体',
        collapsed: true,
        items: [
          { text: '在线媒体概览', link: '/docs/media/online-media' },
          { text: '站点类型', link: '/docs/media/online/site-types' },
          { text: '搜索、线路与播放', link: '/docs/media/online/source-selection' }
        ]
      }
    ]
  },
  {
    text: '工具与扩展',
    collapsed: false,
    items: [
      { text: '工具与扩展概览', link: '/docs/tools/' },
      { text: '流媒体链接', link: '/docs/tools/streaming' },
      { text: '媒体处理工具箱', link: '/docs/tools/media-toolbox' },
      { text: '媒体属性与 Markdown 导出', link: '/docs/tools/media-properties-and-export' },
      { text: '投屏与局域网共享', link: '/docs/tools/casting-and-sharing' },
      { text: '储物箱与加密播放', link: '/docs/tools/storage-box' }
    ]
  },
  {
    text: '播放器',
    collapsed: false,
    items: [
      { text: '播放器概览', link: '/docs/player/' },
      { text: '播放器界面', link: '/docs/player/interface' },
      { text: '播放控制与快捷操作', link: '/docs/player/controls' },
      { text: '播放内核、解码与硬件加速', link: '/docs/player/engine-and-decoder' },
      { text: '画质与滤镜', link: '/docs/player/video-quality' },
      { text: '音乐播放器', link: '/docs/player/music' },
      { text: '音频与均衡器', link: '/docs/player/audio' },
      { text: '字幕', link: '/docs/player/subtitles' },
      { text: '弹幕', link: '/docs/player/danmaku' },
      { text: 'Whisper AI 字幕', link: '/docs/player/whisper' },
      { text: '播放列表与内容模块', link: '/docs/player/content-modules' }
    ]
  },
  {
    text: '同步',
    collapsed: false,
    items: [
      { text: '同步功能概览', link: '/docs/sync/' },
      { text: 'Bangumi 与 Trakt', link: '/docs/sync/bangumi-and-trakt' },
      { text: '媒体服务器播放进度同步', link: '/docs/sync/media-server' },
      { text: '同步异常排查', link: '/docs/sync/troubleshooting' }
    ]
  },
  {
    text: '设置参考',
    collapsed: true,
    items: [
      { text: '设置总览', link: '/docs/settings/' },
      { text: '首页设置', link: '/docs/settings/home' },
      { text: '主题与外观', link: '/docs/settings/appearance' },
      { text: '文件夹与列表', link: '/docs/settings/folders-and-lists' },
      { text: '播放、解码与画质', link: '/docs/settings/playback' },
      { text: '在线服务', link: '/docs/settings/online-services' },
      { text: 'AI、Whisper、RSS 与模块', link: '/docs/settings/ai-and-modules' },
      { text: 'AI 模型与内容理解', link: '/docs/settings/ai' },
      { text: 'RSS 订阅与自动下载', link: '/docs/settings/rss' },
      { text: '模块与启动页', link: '/docs/settings/modules' },
      { text: '字幕设置', link: '/docs/settings/subtitles' },
      { text: '弹幕设置', link: '/docs/settings/danmaku' },
      { text: '账户、网络与其他', link: '/docs/settings/account-and-network' },
      { text: '调试与日志', link: '/docs/settings/debug' }
    ]
  },
  {
    text: '故障排查',
    collapsed: true,
    items: [
      { text: '故障排查总览', link: '/docs/troubleshooting/' },
      { text: '媒体库为空', link: '/docs/troubleshooting/library' },
      { text: '扫描或刮削失败', link: '/docs/troubleshooting/scraping' },
      { text: '播放失败、黑屏、卡顿', link: '/docs/troubleshooting/playback' },
      { text: '网络与 TMDB', link: '/docs/troubleshooting/network-and-tmdb' },
      { text: '字幕、弹幕或音频异常', link: '/docs/troubleshooting/subtitle-and-danmaku' },
      { text: '账户、授权与同步问题', link: '/docs/troubleshooting/account-and-sync' },
      { text: '日志导出与反馈', link: '/docs/troubleshooting/logs-and-feedback' }
    ]
  },
  { text: '常见问题', link: '/docs/faq' }
]

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'zPlayer',
  description: '面向 Windows 的媒体库与播放器',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: base + 'assets/logo.png' }],
    ['meta', { name: 'theme-color', content: '#5b5bd6' }],
    ['meta', { name: 'keywords', content: 'zPlayer,Windows 播放器,媒体库,NAS,Emby,Jellyfin,Plex' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'zPlayer · 让播放更智能更优雅' }],
    ['meta', { property: 'og:description', content: '面向 Windows 的媒体库与播放器' }],
    ['meta', { name: 'twitter:card', content: 'summary' }]
  ],
  themeConfig: {
    logo: '/assets/logo.png',
    siteTitle: 'zPlayer',
    nav,
    sidebar: {
      '/docs/': sidebar
    },
    outline: {
      level: 'deep',
      label: '本页目录'
    },
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/ZhaoYunxiong/zPlayer-Website/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    lastUpdated: {
      text: '最后更新'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
  footer: {
    message: 'zPlayer · 让播放更智能更优雅',
    copyright: '© 2026 zPlayer · 开发者：赵运雄'
  }
  }
})

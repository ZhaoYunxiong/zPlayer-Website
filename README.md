# zPlayer 官网与使用文档

这是 zPlayer 官网和中文使用文档的 VitePress 工程，面向 Windows 用户。

## 本地预览

最简单的方式是双击 start-website.cmd。脚本会自动安装依赖、启动开发服务器并打开浏览器。

也可以在 PowerShell 中运行：

    .\start-website.ps1

默认地址是 http://127.0.0.1:5173/。如需更换端口：

    .\start-website.ps1 -Port 5174

关闭网站请双击 stop-website.cmd，或运行：

    .\stop-website.ps1

开发服务器的输出会保存在 `.website-server.out.log` 和 `.website-server.err.log`，PID 保存在 `.website-server.pid`。

## 常用命令

    npm install
    npm run docs:dev
    npm run docs:check
    npm run docs:check-built
    npm run docs:verify
    npm run docs:build
    npm run docs:preview

提交前建议运行 `npm run docs:verify`。它会检查内部链接、首页功能入口、导航和截图资源，执行正式构建，并确认构建产物中的章节锚点都能直达；GitHub Pages 发布流程也使用同一条命令。

## GitHub Pages

仓库已包含 `.github/workflows/pages.yml`。当前仓库名是 `zPlayer-Website`，工作流会按项目站点路径 `/zPlayer-Website/` 构建；本地开发仍使用根路径 `/`。

推送到 main 后，GitHub Actions 会自动构建并发布。第一次使用时，请在仓库 Settings > Pages > Build and deployment > Source 中选择 GitHub Actions。

如果以后把网站迁移到 用户名.github.io 仓库，或绑定自定义域名，把工作流中的 VITEPRESS_BASE 改为 / 即可。

# JS 脚本源：安装、制作与分享

JS 脚本源是一份可以订阅的站点脚本目录。作者把脚本发布到 GitHub Pages，用户在 zPlayer 市场里添加目录地址，就能按源浏览和安装。你可以维护自己的源，也可以把脚本投稿到官方仓库，不需要自己租服务器。

这里发布的是在线库的 JS 站点脚本，用于分类、搜索、列表、选集和播放地址解析。播放器事件 Hook 脚本需要使用相应的扩展机制，不能放进这份站点目录。

## 从市场安装脚本

1. 打开 **设置 → 在线库 → JS 爬虫站点 → 市场**。
2. 展开一个脚本源，查看站点名称、说明、分组和版本。
3. 点击所需脚本右侧的“安装”。成功后按钮变为“已安装”。
4. 回到站点列表，检查启用状态并运行“检测”，再到在线库实际浏览和播放。

新版 zPlayer 内置“zPlayer 官方脚本源”，始终排在首位，不能删除。可以在[官方仓库](https://github.com/ZhaoYunxiong/zPlayer-Site-Scripts)查看源码和提交记录。

### 添加个人脚本源

在市场右上角打开“脚本源”，输入作者提供的完整 HTTPS `index.json` 地址，点击“添加脚本源”。添加成功会自动刷新目录，并展开新源。

```text
https://alice.github.io/alice-site-scripts/index.json
```

要填的是发布后的目录地址。GitHub 仓库首页、某个 `.js` 文件地址和 Pages 网站首页都不能代替 `index.json`。

其他订阅源可以删除，已经安装的脚本会保留在本机；恢复同一订阅地址后可以继续更新。

## 制作个人脚本源

### 1. 建立自己的仓库

准备一个 GitHub 账号，在[官方脚本仓库](https://github.com/ZhaoYunxiong/zPlayer-Site-Scripts)点击 **Fork**，在自己账号下建立公开仓库，例如 `alice-site-scripts`。保留默认分支 `main`。

仓库已经带有构建程序和 `.github/workflows/pages.yml`。如果 Fork 后 Actions 页面提示工作流未启用，先按页面提示启用。也可以从播放器源码的[脚本源模板](https://github.com/ZhaoYunxiong/zPlayerNext/tree/main/src/docs/js-script-source-template)复制全部文件建立独立仓库，注意包含隐藏目录 `.github`。

编辑根目录的 `source.json`，为整个订阅源设置独立的 ID 和名称：

```json
{
  "schemaVersion": 1,
  "id": "alice-site-scripts",
  "name": "Alice 的站点脚本"
}
```

`id` 使用 1–80 个小写英文字母、数字、点、下划线或连字符，首字符为字母或数字。它是这个源的长期身份，发布后保持不变。个人源必须使用自己的 ID，沿用官方源的 ID 会被客户端判定为重复源。

### 2. 把站点脚本放进 scripts

Fork 会带上官方仓库现有脚本。按需移除不打算维护的 `.js` 文件，把自己的脚本放进 `scripts/`。如果脚本是在 zPlayer 中编写或由 AI 生成的，可以先打开代码编辑器，使用“导出脚本”。

每个站点只维护一个 JS 文件。构建程序直接从脚本的 `getSiteInfo()` 读取发布信息，不需要给每个脚本再写一个 JSON 文件：

```js
function getSiteInfo() {
    return JSON.stringify({
        id: "example-site",
        name: "示例站点",
        group: "影视",
        version: 1,
        desc: "这个站点提供的内容和使用说明",
        author: "Alice"
    });
}
```

这段代码只演示发布信息，完整脚本仍需实现分类、列表、详情和播放等站点功能。已有脚本已经有名称、分组、版本和说明时，只需补上稳定的 `id`，保留原有其他字段。

| 字段 | 要求 |
| --- | --- |
| `id` | 必填；格式与源 ID 相同，同一源中不能重复，发布后保持不变 |
| `name` | 必填；市场显示的站点名称 |
| `group` | 必填；站点分组，例如“影视” |
| `version` | 必填；正整数，每次发布修改时递增 |
| `desc` | 可选；市场中的脚本说明，建议填写 |
| `author` | 可选；作者名称 |

脚本保存为 UTF-8。发布字段要直接写在 `JSON.stringify({ ... })` 对象里，使用字符串或整数；支持注释、单引号、双引号和尾逗号。不要用变量拼接、函数调用、计算属性或展开语法生成这些发布字段。构建程序只读取语法树，不会执行投稿脚本。

根目录的 `source.json` 描述整个源；`index.json`、脚本下载地址和 SHA-256 摘要都会自动生成，无需手工维护。

### 3. 开启 GitHub Pages

1. 在自己的仓库打开 **Settings → Pages**。
2. 将 **Build and deployment → Source** 设为 **GitHub Actions**。仓库已有工作流，无需额外添加 GitHub 推荐的模板。
3. 将 `source.json` 和脚本修改提交到 `main`。
4. 打开 **Actions → Validate and publish script source**，确认 `build` 和 `deploy` 都成功。也可以用 **Run workflow** 手动发布。
5. 在 Pages 设置或部署记录中找到网站地址，在末尾加上 `index.json` 并用浏览器打开。

GitHub 的发布源设置也可以参照[官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。工作流使用 GitHub 提供的 `GITHUB_TOKEN`，不需要填写个人 Token。

以用户名 `alice`、仓库名 `alice-site-scripts` 为例，分享地址为：

```text
https://alice.github.io/alice-site-scripts/index.json
```

打开后应返回 JSON，其中 `scripts` 是脚本列表。尚未加入脚本时，它可以为空数组。把这个地址添加到 zPlayer 市场的“脚本源”，确认能看到自己的源名称和脚本，再分享给其他人。

### 4. 更新和验证

修改 JS 后递增 `getSiteInfo()` 中的 `version`，提交到 `main`，等待工作流重新发布。不要在同一个已发布版本号下替换脚本内容；客户端会检查版本和摘要。

需要在本机先检查时，安装 Node.js 24 或更高版本，在脚本仓库根目录运行：

```powershell
npm ci --ignore-scripts
npm test
npm run build
```

发布内容生成在 `_site/`。构建成功说明发布格式通过检查，脚本是否能正常分类、搜索和播放，仍需回到 zPlayer 实际验证。

## 投稿官方源

如果只想分享一个脚本，也可以 Fork 官方仓库，在 `scripts/` 中添加或修改脚本，提交 Pull Request 给官方仓库。投稿时保留官方 `source.json`，无需发布自己的 Pages。维护者审核合并后，官方源会自动发布。

这与维护个人源是两种用途：维护个人源时修改 `source.json` 并分享自己的订阅地址；投稿官方源时只提交相关脚本修改。

## 安装后的更新和本地修改

- 站点设置页的“更新”只更新已经从同一订阅地址安装的脚本，不会自动安装整个源，也不会接管本地导入的脚本。
- 本地修改过的脚本会受到保护，安装、更新或回退不会直接覆盖。需要重新安装时，先导出保存自己的修改，再删除并重新安装。
- 更新会保留一个已安装版本，可使用“回退脚本版本”恢复；下次更新仍可能再次升级。
- 在线目录读取失败时，有缓存就会显示缓存目录；下载失败不会影响已安装脚本在本地继续运行。GitHub Pages 在部分网络下可能无法访问，可以先在浏览器检查同一个订阅地址。

导出脚本不会附带单独保存的个人站点参数，但写进 JS 正文的 Cookie、Token 和密码仍会原样导出。发布前检查代码，把这些个人信息改为[站点参数](/docs/media/online/js-site-generation#站点参数配置)，让使用者在本机填写。

## 发布失败时检查什么

| 现象 | 检查和处理 |
| --- | --- |
| Actions 没有运行 | 确认工作流已启用，提交到了 `main`，且 `.github/workflows/pages.yml` 存在 |
| `build` 失败 | 展开日志查看报错文件，检查 JS 语法、缺失字段、重复 ID 和版本格式 |
| `deploy` 失败 | 确认 Pages 发布源为 GitHub Actions，仓库允许工作流所需的 Pages 权限 |
| 订阅地址返回 404 | 确认部署成功，检查用户名、仓库名、大小写和末尾的 `index.json` |
| 返回网页而不是 JSON | 使用 Pages 发布地址，检查是否误填了 GitHub 仓库首页 |
| 添加时提示重复源 | 为个人源设置独立的 `source.json.id`，不要沿用官方源 ID |
| 版本相同但摘要不同 | 修改脚本的 `version` 后重新发布，在市场刷新目录 |

脚本格式和测试细节也可以查看[官方仓库 README](https://github.com/ZhaoYunxiong/zPlayer-Site-Scripts#readme)。

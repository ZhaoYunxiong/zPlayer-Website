import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const workspaceRoot = process.cwd()
const docsRoot = path.join(workspaceRoot, 'docs')
const ignoredDirectories = new Set(['.vitepress', 'node_modules'])
const removedPages = ['download.md', 'privacy.md', path.join('changelog', 'index.md')]

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...await collectMarkdownFiles(path.join(directory, entry.name)))
      }
      continue
    }

    if (entry.name.endsWith('.md')) {
      files.push(path.join(directory, entry.name))
    }
  }

  return files
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function resolveInternalTarget(sourceFile, rawTarget, isImage) {
  const target = rawTarget.split('#', 1)[0].split('?', 1)[0]
  if (!target || /^(?:[a-z]+:|#)/i.test(target)) {
    return true
  }

  let absoluteTarget
  if (target.startsWith('/assets/')) {
    absoluteTarget = path.join(docsRoot, 'public', target.slice(1))
  } else if (target.startsWith('/')) {
    absoluteTarget = path.join(docsRoot, target.slice(1))
  } else {
    absoluteTarget = path.resolve(path.dirname(sourceFile), target)
  }

  if (isImage || path.extname(absoluteTarget)) {
    return exists(absoluteTarget)
  }

  return await exists(`${absoluteTarget}.md`) || await exists(path.join(absoluteTarget, 'index.md'))
}

const markdownFiles = await collectMarkdownFiles(docsRoot)
const failures = []

for (const file of markdownFiles) {
  const content = await readFile(file, 'utf8')
  const relativeFile = path.relative(workspaceRoot, file)
  const references = [
    ...[...content.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)].map(match => ({ target: match[1], image: true })),
    ...[...content.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match => ({ target: match[1], image: true })),
    ...[...content.matchAll(/(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)].map(match => ({ target: match[1], image: false })),
    ...[...content.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)].map(match => ({ target: match[1], image: false }))
  ]

  for (const reference of references) {
    if (!await resolveInternalTarget(file, reference.target, reference.image)) {
      failures.push(`${relativeFile}: 找不到 ${reference.target}`)
    }
  }

  for (const match of content.matchAll(/<img\b[^>]*class=["'][^"']*zplayer-screenshot[^"']*["'][^>]*>/gi)) {
    const tag = match[0]
    if (!/\bsrc=["'][^"']+\.webp["']/i.test(tag)) {
      failures.push(`${relativeFile}: 文档截图必须使用 WebP`)
    }
    if (!/\bwidth=["']\d+["']/i.test(tag) || !/\bheight=["']\d+["']/i.test(tag)) {
      failures.push(`${relativeFile}: 文档截图缺少固有宽高`)
    }
    if (!/\bloading=["']lazy["']/i.test(tag) || !/\bdecoding=["']async["']/i.test(tag)) {
      failures.push(`${relativeFile}: 文档截图缺少延迟加载属性`)
    }
  }
}

const homeFile = path.join(docsRoot, 'index.md')
const homeContent = await readFile(homeFile, 'utf8')
const featureLinks = [...homeContent.matchAll(/class="zplayer-home-advantage-title"/g)]
if (featureLinks.length !== 21) {
  failures.push(`docs/index.md: 首页功能标题应有 21 个文档链接，当前为 ${featureLinks.length} 个`)
}

for (const removedRoute of ['/download', '/privacy', '/changelog']) {
  if (homeContent.includes(removedRoute)) {
    failures.push(`docs/index.md: 仍引用已移除页面 ${removedRoute}`)
  }
}

for (const removedPage of removedPages) {
  if (await exists(path.join(docsRoot, removedPage))) {
    failures.push(`docs/${removedPage}: 已移除页面不应继续存在`)
  }
}

const screenshotFiles = await readdir(path.join(docsRoot, 'assets', 'screenshots'))
const pngScreenshots = screenshotFiles.filter(file => file.endsWith('.png'))
if (pngScreenshots.length > 0) {
  failures.push(`docs/assets/screenshots: 仍有 ${pngScreenshots.length} 张 PNG 截图未转换`)
}

const configContent = await readFile(path.join(docsRoot, '.vitepress', 'config.mts'), 'utf8')
const navBlock = configContent.match(/const nav = \[([\s\S]*?)\]/)?.[1] ?? ''
const navItems = [...navBlock.matchAll(/\{\s*text:\s*'([^']+)',\s*link:\s*'([^']+)'\s*\}/g)]
  .map(match => `${match[1]}:${match[2]}`)
if (navItems.join('|') !== '首页:/|使用文档:/docs/') {
  failures.push(`docs/.vitepress/config.mts: 顶部导航应只包含首页和使用文档`)
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`文档检查通过：${markdownFiles.length} 个页面，内部链接与图片均可解析。`)
}

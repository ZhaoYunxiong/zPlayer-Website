import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const workspaceRoot = process.cwd()
const docsRoot = path.join(workspaceRoot, 'docs')
const outputRoot = path.join(docsRoot, '.vitepress', 'dist')
const ignoredDirectories = new Set(['.vitepress', 'node_modules'])

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

function routeFromMarkdown(file) {
  const relative = path.relative(docsRoot, file).replaceAll('\\', '/')
  const withoutExtension = relative.replace(/\.md$/i, '')

  if (withoutExtension === 'index') {
    return '/'
  }

  return `/${withoutExtension.replace(/\/index$/i, '')}`
}

function resolveRoute(sourceFile, rawPath) {
  if (!rawPath) {
    return routeFromMarkdown(sourceFile)
  }

  if (rawPath.startsWith('/')) {
    return rawPath
  }

  const sourceRoute = routeFromMarkdown(sourceFile)
  const sourceDirectory = sourceRoute.endsWith('/') ? sourceRoute : path.posix.dirname(sourceRoute)
  return path.posix.resolve(sourceDirectory, rawPath)
}

async function findOutputFile(route) {
  const normalizedRoute = decodeURIComponent(route).replace(/^\/+/, '')
  if (!normalizedRoute) {
    return path.join(outputRoot, 'index.html')
  }

  if (normalizedRoute.endsWith('/')) {
    return path.join(outputRoot, normalizedRoute, 'index.html')
  }

  const withoutMarkdown = normalizedRoute.replace(/\.md$/i, '')
  const htmlFile = path.join(outputRoot, `${withoutMarkdown}.html`)
  if (await exists(htmlFile)) {
    return htmlFile
  }

  return path.join(outputRoot, withoutMarkdown, 'index.html')
}

const markdownFiles = await collectMarkdownFiles(docsRoot)
const failures = []
let checkedAnchors = 0

for (const file of markdownFiles) {
  const content = await readFile(file, 'utf8')
  const relativeFile = path.relative(workspaceRoot, file)
  const targets = [
    ...[...content.matchAll(/(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)].map(match => match[1]),
    ...[...content.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)].map(match => match[1])
  ]

  for (const target of targets) {
    if (/^[a-z]+:/i.test(target) || !target.includes('#')) {
      continue
    }

    const hashIndex = target.indexOf('#')
    const rawPath = target.slice(0, hashIndex).split('?', 1)[0]
    const rawAnchor = target.slice(hashIndex + 1)
    if (!rawAnchor) {
      continue
    }

    const route = resolveRoute(file, rawPath)
    const outputFile = await findOutputFile(route)
    if (!await exists(outputFile)) {
      failures.push(`${relativeFile}: 锚点目标页面未生成 ${target}`)
      continue
    }

    const output = await readFile(outputFile, 'utf8')
    let anchor
    try {
      anchor = decodeURIComponent(rawAnchor)
    } catch {
      failures.push(`${relativeFile}: 锚点编码无效 ${target}`)
      continue
    }

    const ids = new Set([...output.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))
    checkedAnchors += 1
    if (!ids.has(anchor)) {
      failures.push(`${relativeFile}: 构建结果中找不到锚点 ${target}`)
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`构建产物锚点检查通过：${checkedAnchors} 个章节链接均可直达。`)
}

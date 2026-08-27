import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('src')
const OUTPUT = path.resolve('i18n-audit.json')
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx'])

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return EXTENSIONS.has(path.extname(entry.name)) ? [fullPath] : []
  })
}

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function shouldKeep(value) {
  const text = cleanText(value)
  if (text.length < 2) return false
  if (!/[A-Za-z\u1780-\u17FF\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]/u.test(text)) return false
  if (/^(https?:|\/|\.\/|\.\.\/|#|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$)/.test(text)) return false
  if (/^(true|false|null|undefined)$/i.test(text)) return false
  if (/^[A-Z0-9_]+$/.test(text)) return false
  return true
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length
}

function addMatch(map, file, source, index, text, kind) {
  const value = cleanText(text)
  if (!shouldKeep(value)) return

  const relativeFile = path.relative(process.cwd(), file).replaceAll('\\', '/')
  const key = `${kind}:${value}`

  if (!map.has(key)) {
    map.set(key, {
      text: value,
      kind,
      occurrences: [],
    })
  }

  map.get(key).occurrences.push({
    file: relativeFile,
    line: lineNumber(source, index),
  })
}

function scanFile(file, map) {
  const source = fs.readFileSync(file, 'utf8')

  const jsxText = />\s*([^<>{}\n][^<>{}]*)\s*</g
  for (const match of source.matchAll(jsxText)) {
    addMatch(map, file, source, match.index, match[1], 'jsx-text')
  }

  const attrs = /\b(placeholder|title|aria-label|alt)\s*=\s*["']([^"']+)["']/g
  for (const match of source.matchAll(attrs)) {
    addMatch(map, file, source, match.index, match[2], `attribute:${match[1]}`)
  }

  const objectText = /\b(title|subtitle|label|message|description|heading|text)\s*:\s*["'`]([^"'`]+)["'`]/g
  for (const match of source.matchAll(objectText)) {
    addMatch(map, file, source, match.index, match[2], `object:${match[1]}`)
  }
}

const matches = new Map()

for (const file of walk(ROOT)) {
  scanFile(file, matches)
}

const items = [...matches.values()]
  .map((item) => ({
    ...item,
    count: item.occurrences.length,
  }))
  .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text))

const result = {
  generatedAt: new Date().toISOString(),
  root: 'src',
  uniqueTexts: items.length,
  totalOccurrences: items.reduce((sum, item) => sum + item.count, 0),
  items,
}

fs.writeFileSync(OUTPUT, `${JSON.stringify(result, null, 2)}\n`, 'utf8')

console.log(`Unique UI texts: ${result.uniqueTexts}`)
console.log(`Total occurrences: ${result.totalOccurrences}`)
console.log(`Report: ${path.relative(process.cwd(), OUTPUT)}`)

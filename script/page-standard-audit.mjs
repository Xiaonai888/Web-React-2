import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx'])
const OUTPUT = path.resolve('page-standard-audit.json')
const args = process.argv.slice(2)
const strict = args.includes('--strict')
const requestedTargets = args.filter((arg) => !arg.startsWith('--'))

function normalizePath(value) {
  return value.replaceAll('\\', '/')
}

function isCodeFile(file) {
  return EXTENSIONS.has(path.extname(file))
}

function walk(target) {
  if (!fs.existsSync(target)) return []

  const stat = fs.statSync(target)

  if (stat.isFile()) {
    return isCodeFile(target) ? [target] : []
  }

  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(target, entry.name)

    if (entry.isDirectory()) return walk(fullPath)

    return isCodeFile(fullPath) ? [fullPath] : []
  })
}

function gitLines(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

function getChangedFiles() {
  const tracked = gitLines([
    'diff',
    '--name-only',
    '--diff-filter=ACMR',
    'HEAD',
    '--',
    'src',
  ])

  const untracked = gitLines([
    'ls-files',
    '--others',
    '--exclude-standard',
    '--',
    'src',
  ])

  return [...new Set([...tracked, ...untracked])]
    .filter(isCodeFile)
    .filter((file) => fs.existsSync(file))
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length
}

function addIssue(issues, file, source, index, code, severity, message, sample = '') {
  issues.push({
    file: normalizePath(path.relative(process.cwd(), file)),
    line: lineNumber(source, Math.max(0, index)),
    code,
    severity,
    message,
    sample: String(sample || '').trim().slice(0, 220),
  })
}

function isReaderThemeFile(file, source) {
  const relative = normalizePath(path.relative(process.cwd(), file)).toLowerCase()

  return (
    relative.includes('/reader/') ||
    relative.includes('readerpage') ||
    source.includes('reader-page') ||
    source.includes('theme-preserve')
  )
}

function isPageLikeFile(file) {
  const relative = normalizePath(path.relative(process.cwd(), file))

  return (
    relative.startsWith('src/pages/') ||
    relative.startsWith('src/templates/') ||
    /Page\.(jsx?|tsx?)$/.test(relative) ||
    /Template\.(jsx?|tsx?)$/.test(relative)
  )
}

function scanLiteralUiText(file, source, issues) {
  const literalMatches = []

  const jsxText = />\s*([^<>{}\n][^<>{}]*)\s*</g
  for (const match of source.matchAll(jsxText)) {
    const text = String(match[1] || '').replace(/\s+/g, ' ').trim()

    if (
      text.length >= 2 &&
      /[A-Za-z\u1780-\u17FF\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]/u.test(text)
    ) {
      literalMatches.push({
        index: match.index,
        text,
        kind: 'jsx-text',
      })
    }
  }

  const attrs = /\b(placeholder|title|aria-label)\s*=\s*["']([^"']+)["']/g
  for (const match of source.matchAll(attrs)) {
    const text = String(match[2] || '').trim()

    if (
      text.length >= 2 &&
      /[A-Za-z\u1780-\u17FF\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]/u.test(text)
    ) {
      literalMatches.push({
        index: match.index,
        text,
        kind: `attribute:${match[1]}`,
      })
    }
  }

  for (const item of literalMatches) {
    addIssue(
      issues,
      file,
      source,
      item.index,
      'literal-ui-text',
      'error',
      `User-visible ${item.kind} should use t(...).`,
      item.text
    )
  }

  if (
    literalMatches.length &&
    !source.includes('useDisplayTranslation')
  ) {
    addIssue(
      issues,
      file,
      source,
      0,
      'missing-display-translation',
      'error',
      'This UI file contains literal user-facing text but does not use useDisplayTranslation().'
    )
  }
}

function scanNamespaceLanguages(file, source, issues) {
  if (!source.includes('registerTranslationNamespace')) return

  for (const language of ['km', 'en', 'zh', 'ja', 'ko']) {
    const pattern = new RegExp(`\\b${language}\\s*:`)

    if (!pattern.test(source)) {
      addIssue(
        issues,
        file,
        source,
        0,
        'missing-namespace-language',
        'error',
        `Translation namespace is missing the "${language}" language.`
      )
    }
  }
}

function scanTheme(file, source, issues) {
  if (isReaderThemeFile(file, source)) return

  if (isPageLikeFile(file)) {
    const hasSemanticPageTheme =
      /\bapp-page\b/.test(source) ||
      /--shadow-bg-page/.test(source) ||
      /dark:bg-\[var\(--shadow-bg-page\)\]/.test(source)

    if (!hasSemanticPageTheme) {
      addIssue(
        issues,
        file,
        source,
        0,
        'missing-page-theme-root',
        'error',
        'Page does not appear to use the semantic page theme system.'
      )
    }
  }

  const lines = source.split('\n')
  const suspiciousClassPattern =
    /\b(bg-white|text-black|text-\[#111827\]|border-gray-(?:50|100|200|300)|bg-gray-(?:50|100|200)|bg-\[#(?:fff|ffffff|f8fafc|f3f4f6|f5f3fa)\])\b/i

  lines.forEach((line, index) => {
    if (!suspiciousClassPattern.test(line)) return

    const protectedLine =
      line.includes('dark:') ||
      line.includes('var(--shadow-') ||
      line.includes('app-') ||
      line.includes('theme-preserve')

    if (protectedLine) return

    const sourceIndex = source.split('\n').slice(0, index).join('\n').length

    addIssue(
      issues,
      file,
      source,
      sourceIndex,
      'review-hardcoded-light-class',
      'review',
      'Review this light-only class. Global compatibility may already cover it; otherwise add semantic styling or a dark counterpart.',
      line
    )
  })

  const svgColorPattern = /\b(?:stroke|fill)=["']#(?:111827|111111|000000|000)["']/gi

  for (const match of source.matchAll(svgColorPattern)) {
    addIssue(
      issues,
      file,
      source,
      match.index,
      'hardcoded-svg-color',
      'review',
      'Theme-following SVG icons should normally use currentColor.',
      match[0]
    )
  }

  const inlineColorPattern =
    /\b(?:color|backgroundColor|borderColor)\s*:\s*["']#(?:111827|111111|ffffff|fff|f8fafc|f3f4f6)["']/gi

  for (const match of source.matchAll(inlineColorPattern)) {
    addIssue(
      issues,
      file,
      source,
      match.index,
      'hardcoded-inline-theme-color',
      'review',
      'Review this inline theme color and prefer an existing semantic CSS variable when appropriate.',
      match[0]
    )
  }
}

function auditFile(file) {
  const source = fs.readFileSync(file, 'utf8')
  const issues = []

  scanLiteralUiText(file, source, issues)
  scanNamespaceLanguages(file, source, issues)
  scanTheme(file, source, issues)

  return issues
}

const targets = requestedTargets.length
  ? requestedTargets
  : getChangedFiles()

const files = [
  ...new Set(
    targets.flatMap((target) => walk(path.resolve(target)))
  ),
]

const issues = files.flatMap(auditFile)
const errors = issues.filter((issue) => issue.severity === 'error')
const reviews = issues.filter((issue) => issue.severity === 'review')

const result = {
  generatedAt: new Date().toISOString(),
  mode: requestedTargets.length ? 'explicit-targets' : 'changed-files',
  strict,
  filesScanned: files.map((file) =>
    normalizePath(path.relative(process.cwd(), file))
  ),
  summary: {
    files: files.length,
    errors: errors.length,
    reviews: reviews.length,
    totalIssues: issues.length,
  },
  issues,
}

fs.writeFileSync(
  OUTPUT,
  `${JSON.stringify(result, null, 2)}\n`,
  'utf8'
)

console.log(`Files scanned: ${result.summary.files}`)
console.log(`Errors: ${result.summary.errors}`)
console.log(`Review warnings: ${result.summary.reviews}`)
console.log(`Report: ${path.relative(process.cwd(), OUTPUT)}`)

if (!files.length) {
  console.log('No changed or requested UI files found.')
}

if (strict && errors.length) {
  process.exitCode = 1
}

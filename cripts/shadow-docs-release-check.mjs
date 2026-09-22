import { existsSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docs = 'src/pages/Docs/'
const names = [
  'ShadowDocsWorkspace.jsx', 'ShadowDocsMyBooksPanel.jsx', 'ShadowDocsWritingStudioPanel.jsx',
  'ShadowDocsManuscriptPanel.jsx', 'ShadowDocsManuscriptTools.js', 'ShadowDocsBookDesignerPanel.jsx',
  'ShadowDocsCoverDesignerPanel.jsx', 'ShadowDocsTemplateGallery.jsx', 'ShadowDocsTemplateCatalog.js',
  'ShadowDocsPDFStudioPanel.jsx', 'ShadowDocsPDFExport.js', 'ShadowDocsPrintTheme.js',
  'ShadowDocsQualityReport.js', 'ShadowDocsLocalIntegrity.js', 'ShadowDocsBookModel.js',
  'ShadowDocsProjectIO.js', 'ShadowDocsStore.js', 'ShadowDocsPage.css',
]
const errors = []
const check = (condition, message) => { if (!condition) errors.push(message) }
const source = file => readFileSync(join(root, file), 'utf8')

for (const name of names) {
  const file = docs + name
  check(existsSync(join(root, file)), `Missing: ${file}`)
}
if (errors.length === 0) {
  const app = source('src/App.jsx')
  const workspace = source(docs + 'ShadowDocsWorkspace.jsx')
  const exporter = source(docs + 'ShadowDocsPDFExport.js')
  const catalog = source(docs + 'ShadowDocsTemplateCatalog.js')
  const quality = source(docs + 'ShadowDocsQualityReport.js')
  const integrity = source(docs + 'ShadowDocsLocalIntegrity.js')
  check(app.includes("import('./pages/Docs/ShadowDocsWorkspace')"), 'App.jsx does not load ShadowDocsWorkspace')
  check(/<AppAccessGuard\s+appKey="shadow-docs">\s*<ShadowDocsWorkspace\s*\/>/.test(app), 'Shadow Docs route is not protected by AppAccessGuard')
  check(workspace.includes('loadShadowDocsBooksSafely') && workspace.includes('flushShadowDocsPendingWrites'), 'Workspace local integrity integration is incomplete')
  check(workspace.includes('<ShadowDocsPDFStudioPanel') && workspace.includes('<ShadowDocsTemplateGallery'), 'Workspace is missing PDF Studio or Templates')
  check(exporter.includes('getShadowDocsPrintCoverStyle') && exporter.includes('inspectShadowDocsProject'), 'PDF export integration is incomplete')
  check(/export function (buildShadowDocsPrintHTML|downloadShadowDocsPrintHTML|inspectShadowDocsForPDF)/g.test(exporter), 'PDF export functions are missing')
  check(quality.includes('export function inspectShadowDocsProject'), 'Quality report export is missing')
  check(integrity.includes('export async function loadShadowDocsBooksSafely'), 'Local integrity export is missing')
  const coverBlock = catalog.split('export const COVER_PRESETS = Object.freeze([')[1]?.split('export const PAGE_LAYOUT_PRESETS')[0] || ''
  const coverCount = [...coverBlock.matchAll(/\{ id: '[^']+', name: '/g)].length
  check(coverCount === 16, `Expected 16 cover presets; found ${coverCount}`)
  for (const name of names) {
    if (!/\.(js|jsx)$/.test(name)) continue
    const file = docs + name
    const content = source(file)
    for (const match of content.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
      const base = resolve(root, docs, match[1])
      const found = extname(base) ? existsSync(base) : ['.js', '.jsx', '.json', '.css', '/index.js', '/index.jsx'].some(suffix => existsSync(base + suffix))
      check(found, `Unresolved import ${match[1]} in ${file}`)
    }
  }
}
if (errors.length) {
  errors.forEach(message => process.stderr.write(`FAIL: ${message}\n`))
  process.exit(1)
}
process.stdout.write('Shadow Docs static integration checks passed.\n')
if (process.argv.includes('--build')) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(command, ['run', 'build'], { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}

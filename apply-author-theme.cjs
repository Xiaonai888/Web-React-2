const fs = require('node:fs')
const path = require('node:path')
const appPath = path.join(process.cwd(), 'src', 'App.jsx')
const hookPath = path.join(process.cwd(), 'src', 'utils', 'useAuthorThemeScope.js')
const cssPath = path.join(process.cwd(), 'src', 'utils', 'authorThemeGlobal.css')
const importLine = "import { useAuthorThemeScope } from './utils/useAuthorThemeScope'"
const headAnchor = "import { hasPendingStoryLanguageOnboarding } from './components/StoryLanguageOnboardingGate'"
const hookAnchor = /function AppShell\(\) \{\r?\n  const location = useLocation\(\)/
if (!fs.existsSync(appPath) || !fs.existsSync(hookPath) || !fs.existsSync(cssPath)) {
  throw Error('Run from the Web-React-2 project root after copying src/utils files')
}
let app = fs.readFileSync(appPath, 'utf8')
const newline = app.includes('\r\n') ? '\r\n' : '\n'
if (!app.includes(headAnchor) || !hookAnchor.test(app)) throw Error('App.jsx layout changed: no files modified')
if (!app.includes(importLine)) app = app.replace(headAnchor, `${headAnchor}${newline}${importLine}`)
if (!app.includes('useAuthorThemeScope(location.pathname)')) {
  app = app.replace(hookAnchor, `function AppShell() {${newline}  const location = useLocation()${newline}  useAuthorThemeScope(location.pathname)`)
}
fs.writeFileSync(appPath, app)
process.stdout.write('DONE: src/App.jsx updated without replacing its existing functions\n')

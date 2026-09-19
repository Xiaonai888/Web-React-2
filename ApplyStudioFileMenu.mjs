import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pagePath = resolve(root, 'src/pages/Studio/ShadowStudioPage.jsx')
const projectPath = resolve(root, 'src/pages/Studio/StudioProjectFile.js')
const mobilePath = resolve(root, 'src/pages/Studio/ShadowStudioMobile.css')
const menuPath = resolve(root, 'src/pages/Studio/StudioFileMenu.jsx')

for (const path of [pagePath, projectPath, mobilePath, menuPath]) {
  if (!existsSync(path)) throw new Error(`Missing file: ${path}`)
}

let page = readFileSync(pagePath, 'utf8')
let project = readFileSync(projectPath, 'utf8')
let mobile = readFileSync(mobilePath, 'utf8')

function replaceOne(source, before, after, label) {
  const parts = source.split(before)
  if (parts.length !== 2) throw new Error(`${label}: expected one exact match, found ${parts.length - 1}. No files changed.`)
  return parts[0] + after + parts[1]
}

if (page.includes("import StudioFileMenu from './StudioFileMenu'")) {
  throw new Error('Studio File Menu is already installed. No files changed.')
}

page = replaceOne(
  page,
  "import StudioNewFileDialog, { STUDIO_PRESETS } from './StudioNewFileDialog'",
  "import StudioNewFileDialog, { STUDIO_PRESETS } from './StudioNewFileDialog'\nimport StudioFileMenu from './StudioFileMenu'",
  'File Menu import'
)

page = replaceOne(
  page,
  '  function saveProject() {',
  "  function saveProject(fileName = '') {",
  'Save Project signature'
)
page = replaceOne(
  page,
  '      downloadStudioProject(project)',
  '      downloadStudioProject(project, fileName)',
  'Save As filename'
)

const actions = `  function saveProjectAs() {
    if (!documentsRef.current.length || paperLoading || projectBusy) return
    const suggestedName = documentsRef.current[0]?.name || 'Shadow-Project'
    const entered = window.prompt('Save project copy as:', suggestedName)
    if (entered === null) return
    const name = entered.trim().replace(/\\.shadowstudio$/i, '')
    if (!name) {
      window.alert('Enter a project file name.')
      return
    }
    saveProject(name)
  }

  function exportCurrentPng() {
    const canvas = canvasRef.current
    const paper = documentsRef.current.find((item) => item.id === activeDocumentId)
    if (!workspaceStarted || !canvas || !paper || paperLoading || projectBusy) return
    const name = paper.name.replace(/[\\\\/:*?"<>|\\x00-\\x1f]/g, '-').slice(0, 60) || 'Paper'
    setProjectBusy(true)
    try {
      canvas.toBlob((blob) => {
        try {
          if (!blob) throw new Error('Could not export the current paper.')
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = name + '.png'
          document.body.appendChild(link)
          link.click()
          link.remove()
          setTimeout(() => URL.revokeObjectURL(url), 30_000)
          setProjectNotice('PNG download started for ' + paper.name + '.')
        } catch (error) {
          setProjectNotice(error.message || 'PNG export failed.')
        } finally {
          setProjectBusy(false)
        }
      }, 'image/png')
    } catch (error) {
      setProjectBusy(false)
      setProjectNotice(error.message || 'PNG export failed.')
    }
  }

  function closeAllPapers() {
    if (paperLoading || projectBusy || recoveryBusy || !documentsRef.current.length) return
    if (!window.confirm('Close all open papers? Save Project first if you need to keep unsaved changes.')) return
    loadTokenRef.current += 1
    clearTimeout(recoveryTimerRef.current)
    documentsRef.current = []
    setDocuments([])
    setActiveDocumentId('')
    setWorkspaceStarted(false)
    setNewFileOpen(false)
    canvasDocumentRef.current = ''
    historyRef.current = []
    redoRef.current = []
    setProjectNotice('All papers closed.')
  }

`
page = replaceOne(page, "  function openNewFile(presetId = 'basic') {", actions + "  function openNewFile(presetId = 'basic') {", 'File Menu actions')

const chrome = `      <StudioChrome onBack={exitStudio}>
        <StudioFileMenu
          hasPaper={documents.length > 0}
          inWorkspace={workspaceStarted}
          canNew={!paperLoading && !projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen && documents.length < DOCUMENT_LIMIT}
          canOpen={!projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen}
          busy={paperLoading || projectBusy || recoveryBusy || newFileOpen}
          onNew={() => openNewFile('basic')}
          onOpen={chooseProjectFile}
          onSave={() => saveProject()}
          onSaveAs={saveProjectAs}
          onExport={exportCurrentPng}
          onClose={() => closeDocument(activeDocumentId)}
          onCloseAll={closeAllPapers}
          onHome={goHome}
          onExit={exitStudio}
        />
        <button type="button" className="ss-menu-btn" disabled={!workspaceStarted} onClick={undo}>Edit</button>
        <button type="button" className="ss-menu-btn" disabled={!workspaceStarted}>View</button>
        {workspaceStarted ? (
          <div className="ss-chrome-right">
            <div className="ss-doc-info">{activeDocument?.width} × {activeDocument?.height}px · {activeDocument?.resolution} PPI</div>
            <button type="button" className="ss-btn icon" onClick={undo} disabled={!canUndo || paperLoading || projectBusy} title="Undo" aria-label="Undo"><i className="fa-solid fa-rotate-left" /></button>
            <button type="button" className="ss-btn icon" onClick={redo} disabled={!canRedo || paperLoading || projectBusy} title="Redo" aria-label="Redo"><i className="fa-solid fa-rotate-right" /></button>
          </div>
        ) : null}
      </StudioChrome>`

const chromeMatch = page.match(/      <StudioChrome onBack=\{exitStudio\}>[\s\S]*?      <\/StudioChrome>/g)
if (!chromeMatch || chromeMatch.length !== 1) throw new Error('Old menu layout not found exactly once. No files changed.')
page = page.replace(chromeMatch[0], chrome)

const headerMatch = page.match(/          <header className="ss-top">[\s\S]*?          <\/header>\n\n/g)
if (!headerMatch || headerMatch.length !== 1) throw new Error('Old duplicate action bar not found exactly once. No files changed.')
page = page.replace(headerMatch[0], '')

page = replaceOne(
  page,
  '        .ss-logo{display:block;width:16px;height:16px;object-fit:contain}',
  '        .ss-logo{display:block;width:16px;height:16px;object-fit:contain}\n        .ss-chrome-right{display:flex;align-items:center;gap:6px;margin-left:auto;white-space:nowrap}.ss-chrome-right .ss-doc-info{margin-right:7px}.ss-chrome-right .ss-btn.icon{height:27px;width:29px}',
  'Chrome action styles'
)
page = replaceOne(page, '.ss-tabs{position:sticky;top:82px;', '.ss-tabs{position:sticky;top:34px;', 'Tab bar position')
page = replaceOne(page, 'height:calc(100dvh - 118px);min-height:320px', 'height:calc(100dvh - 70px);min-height:320px', 'Workspace height')

project = replaceOne(
  project,
  'export function downloadStudioProject(project) {',
  "export function downloadStudioProject(project, requestedName = '') {",
  'Save As helper signature'
)
project = replaceOne(
  project,
  "String(project.documents[0]?.name || 'Shadow-Project')",
  "String(requestedName || project.documents[0]?.name || 'Shadow-Project')",
  'Save As helper filename'
)

if (mobile.includes('ss-chrome-right .ss-doc-info')) throw new Error('Mobile File Menu styles already installed. No files changed.')
mobile += `
@media (max-width: 900px), (max-width: 1100px) and (max-height: 650px) and (orientation: landscape) {
  .shadow-studio .ss-chrome-right { display: flex; align-items: center; gap: 4px; margin-left: auto; }
  .shadow-studio .ss-chrome-right .ss-doc-info { display: none; }
  .shadow-studio .ss-chrome-right .ss-btn.icon { flex: 0 0 29px; width: 29px; height: 29px; min-height: 29px; }
  .shadow-studio .ss-file-trigger { font-weight: 800; }
}
`

writeFileSync(pagePath, page)
writeFileSync(projectPath, project)
writeFileSync(mobilePath, mobile)
process.stdout.write('Stage 7 applied: File menu, project naming, mobile controls; duplicate workspace action bar removed.\n')

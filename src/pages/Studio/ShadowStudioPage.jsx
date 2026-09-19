import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import StudioNewFileDialog from './StudioNewFileDialog'
import StudioFileMenu from './StudioFileMenu'
import StudioViewMenu from './StudioViewMenu'
import StudioEditMenu from './StudioEditMenu'
import StudioExportDialog from './StudioExportDialog'
import { readStudioImage } from './StudioImageImport'
import StudioPaperTabs from './StudioPaperTabs'
import StudioHome from './StudioHome'
import StudioNavigator from './StudioNavigator'
import { StudioToolRail, StudioControlSidebar, StudioControlFooter } from './StudioWorkspaceControls'
import { beginStudioStroke, extendStudioStroke } from './StudioBrushEngine'
import './ShadowStudioMobile.css'
import { buildStudioProject, downloadStudioProject, readStudioProject } from './StudioProjectFile'
import { clearStudioRecovery, readStudioRecovery, restoreStudioRecovery, saveStudioRecovery } from './StudioRecoveryStore'

registerTranslationNamespace('shadowStudio', {
  en: {
    back: 'Back',
    brush: 'Brush',
    eraser: 'Eraser',
    eyedropper: 'Pick Color',
    newPaper: 'New File',
    undo: 'Undo',
    redo: 'Redo',
    color: 'Color',
    size: 'Brush Size',
    opacity: 'Opacity',
    zoom: 'Zoom',
    clear: 'Clear',
    canvas: 'Canvas',
    closePaper: 'Close paper',
    closeConfirm: 'This paper has changes. Close it without saving?',
    documentLimit: 'You can keep up to 8 papers open at the same time.',
    welcomeTitle: 'Create something new',
    welcomeText: 'Start with a preset or create a custom paper.',
    recent: 'Recent',
    noRecent: 'Recent local projects will appear here after Local Project Save is added.',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    brush: 'ជក់',
    eraser: 'ជ័រលុប',
    eyedropper: 'ចាប់ពណ៌',
    newPaper: 'ក្រដាសថ្មី',
    undo: 'ត្រឡប់ក្រោយ',
    redo: 'ធ្វើឡើងវិញ',
    color: 'ពណ៌',
    size: 'ទំហំជក់',
    opacity: 'ភាពស្រអាប់',
    zoom: 'ពង្រីក',
    clear: 'សម្អាត',
    canvas: 'ផ្ទាំងគំនូរ',
    closePaper: 'បិទក្រដាស',
    closeConfirm: 'ក្រដាសនេះមានការកែប្រែ។ តើបិទដោយមិនរក្សាទុកមែនទេ?',
    documentLimit: 'អាចបើកក្រដាសបានអតិបរមា 8 ក្នុងពេលតែមួយ។',
    welcomeTitle: 'ចាប់ផ្តើមការងារថ្មី',
    welcomeText: 'ជ្រើស Preset ឬបង្កើតក្រដាសតាមទំហំដែលអ្នកចង់បាន។',
    recent: 'ថ្មីៗ',
    noRecent: 'Project local ថ្មីៗនឹងបង្ហាញនៅទីនេះ ក្រោយពេលយើងបន្ថែម Local Project Save។',
  },
  zh: {
    back: '返回',
    brush: '画笔',
    eraser: '橡皮擦',
    eyedropper: '吸管取色',
    newPaper: '新建文件',
    undo: '撤销',
    redo: '重做',
    color: '颜色',
    size: '画笔大小',
    opacity: '不透明度',
    zoom: '缩放',
    clear: '清空',
    canvas: '画布',
    closePaper: '关闭画布',
    closeConfirm: '此画布有未保存的更改。仍要关闭吗？',
    documentLimit: '最多可同时打开 8 个画布。',
    welcomeTitle: '创建新作品',
    welcomeText: '选择预设或创建自定义画布。',
    recent: '最近',
    noRecent: '添加本地项目保存后，最近项目将显示在这里。',
  },
  ja: {
    back: '戻る',
    brush: 'ブラシ',
    eraser: '消しゴム',
    eyedropper: 'スポイト',
    newPaper: '新規ファイル',
    undo: '元に戻す',
    redo: 'やり直す',
    color: '色',
    size: 'ブラシサイズ',
    opacity: '不透明度',
    zoom: 'ズーム',
    clear: 'クリア',
    canvas: 'キャンバス',
    closePaper: '用紙を閉じる',
    closeConfirm: 'この用紙には変更があります。保存せずに閉じますか？',
    documentLimit: '同時に開ける用紙は最大 8 枚です。',
    welcomeTitle: '新しい作品を作成',
    welcomeText: 'プリセットを選択するか、カスタム用紙を作成します。',
    recent: '最近',
    noRecent: 'ローカルプロジェクト保存を追加すると、最近のプロジェクトがここに表示されます。',
  },
  ko: {
    back: '뒤로',
    brush: '브러시',
    eraser: '지우개',
    eyedropper: '스포이트',
    newPaper: '새 파일',
    undo: '실행 취소',
    redo: '다시 실행',
    color: '색상',
    size: '브러시 크기',
    opacity: '불투명도',
    zoom: '확대',
    clear: '지우기',
    canvas: '캔버스',
    closePaper: '용지 닫기',
    closeConfirm: '이 용지에 변경 사항이 있습니다. 저장하지 않고 닫을까요?',
    documentLimit: '한 번에 최대 8개의 용지를 열 수 있습니다.',
    welcomeTitle: '새 작업 만들기',
    welcomeText: '프리셋을 선택하거나 사용자 정의 용지를 만드세요.',
    recent: '최근',
    noRecent: '로컬 프로젝트 저장 기능을 추가하면 최근 프로젝트가 여기에 표시됩니다.',
  },
})

const W = 1200
const H = 800
const HISTORY_LIMIT = 8
const DOCUMENT_LIMIT = 8

function createDocument({
  name,
  width = W,
  height = H,
  resolution = 144,
  background = '#FFFFFF',
  presetId = 'custom',
  image = '',
}) {
  return {
    id:
      globalThis.crypto?.randomUUID?.() ||
      `studio-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    width,
    height,
    resolution,
    background,
    presetId,
    image,
    dirty: Boolean(image),
  }
}

function nextDocumentName(documents) {
  const names = new Set(documents.map((document) => document.name))
  let index = 1

  while (names.has(`Untitled-${index}`)) {
    index += 1
  }

  return `Untitled-${index}`
}

function StudioChrome({ children, onBack }) {
  return (
    <div className="ss-chrome">
      <button
        type="button"
        className="ss-logo-btn"
        onClick={onBack}
        aria-label="Back"
      >
        <img
          src="/assets/Icons/Shadow Logo.svg"
          alt=""
          className="ss-logo"
        />
      </button>
      {children}
    </div>
  )
}

export default function ShadowStudioPage() {
  const navigate = useNavigate()
  const { t: tx } = useDisplayTranslation()
  const canvasRef = useRef(null)
  const workRef = useRef(null)
  const panRef = useRef(null)
  const spaceRef = useRef(false)
  const zoomAnchorRef = useRef(null)
  const drawingRef = useRef(false)
  const strokeRef = useRef(null)
  const historyRef = useRef([])
  const redoRef = useRef([])
  const documentsRef = useRef([])
  const loadTokenRef = useRef(0)
  const openProjectInputRef = useRef(null)
  const importImageInputRef = useRef(null)
  const canvasDocumentRef = useRef('')
  const recoveryTimerRef = useRef(null)
  const recoverySequenceRef = useRef(0)
  const hadWorkspaceRef = useRef(false)

  const [canvasRevision, refresh] = useState(0)
  const [documents, setDocuments] = useState([])
  const [activeDocumentId, setActiveDocumentId] = useState('')
  const [workspaceStarted, setWorkspaceStarted] = useState(false)
  const [newFileOpen, setNewFileOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [newFilePreset, setNewFilePreset] = useState('basic')
  const [tool, setTool] = useState('brush')
  const [brushStyle, setBrushStyle] = useState('round')
  const [color, setColor] = useState('#111111')
  const [size, setSize] = useState(8)
  const [opacity, setOpacity] = useState(100)
  const [zoom, setZoom] = useState(75)
  const [showGrid, setShowGrid] = useState(false)
  const [gridSpacing, setGridSpacing] = useState(50)
  const [viewRotation, setViewRotation] = useState(0)
  const [flipHorizontal, setFlipHorizontal] = useState(false)
  const [flipVertical, setFlipVertical] = useState(false)
  const viewStatesRef = useRef({})
  const [handMode, setHandMode] = useState(false)
  const [projectBusy, setProjectBusy] = useState(false)
  const [projectNotice, setProjectNotice] = useState('')
  const [projectLoadKey, setProjectLoadKey] = useState(0)
  const [paperLoading, setPaperLoading] = useState(false)
  const [recoveryBooting, setRecoveryBooting] = useState(true)
  const [recoveryEntry, setRecoveryEntry] = useState(null)
  const [recoveryBusy, setRecoveryBusy] = useState(false)
  const [recoveryStatus, setRecoveryStatus] = useState('')
  const [recoveryStorageAvailable, setRecoveryStorageAvailable] = useState(true)

  const activeDocument =
    documents.find((document) => document.id === activeDocumentId) ||
    documents[0] ||
    null

  const context = () =>
    canvasRef.current?.getContext('2d', {
      willReadFrequently: true,
    }) || null

  function commitDocuments(next) {
    setDocuments((current) => {
      const value =
        typeof next === 'function' ? next(current) : next
      documentsRef.current = value
      return value
    })
  }

  function updateDocument(documentId, patch) {
    commitDocuments((current) =>
      current.map((document) =>
        document.id === documentId
          ? { ...document, ...patch }
          : document
      )
    )
  }

  function resetHistory() {
    const canvas = canvasRef.current
    const ctx = context()

    if (!canvas || !ctx) return

    historyRef.current = [
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]
    redoRef.current = []
    refresh((number) => number + 1)
  }

  function snapshot(resetRedo = true) {
    const canvas = canvasRef.current
    const ctx = context()

    if (!canvas || !ctx) return

    historyRef.current = [
      ...historyRef.current,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ].slice(-HISTORY_LIMIT)

    if (resetRedo) {
      redoRef.current = []
    }

    refresh((number) => number + 1)
  }

  function paintBlank(document = activeDocument) {
    const canvas = canvasRef.current
    const ctx = context()

    if (!canvas || !ctx) return

    ctx.save()
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = document?.background || '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }

  function storeActiveImage(
    documentList = documentsRef.current
  ) {
    const canvas = canvasRef.current

    if (!canvas || !activeDocumentId) {
      return documentList
    }

    const image = canvas.toDataURL('image/png')

    return documentList.map((document) =>
      document.id === activeDocumentId
        ? { ...document, image }
        : document
    )
  }

  function loadDocument(document) {
    const token = ++loadTokenRef.current
    canvasDocumentRef.current = ''
    const canvas = canvasRef.current

    if (!canvas || !document) return

    canvas.width = document.width || W
    canvas.height = document.height || H
    paintBlank(document)

    if (!document.image) {
      canvasDocumentRef.current = document.id
      setPaperLoading(false)
      resetHistory()
      return
    }

    setPaperLoading(true)

    const image = new Image()

    image.onload = () => {
      if (token !== loadTokenRef.current) return

      const ctx = context()
      const currentCanvas = canvasRef.current

      if (!ctx || !currentCanvas) return

      paintBlank(document)
      ctx.drawImage(
        image,
        0,
        0,
        currentCanvas.width,
        currentCanvas.height
      )
      canvasDocumentRef.current = document.id
      setPaperLoading(false)
      resetHistory()
    }

    image.onerror = () => {
      if (token === loadTokenRef.current) {
        setPaperLoading(false)
        setProjectNotice('This paper image could not be loaded. Restore it from another saved project copy.')
        resetHistory()
      }
    }

    image.src = document.image
  }

  useEffect(() => {
    if (!workspaceStarted || !activeDocumentId) return

    const document = documentsRef.current.find(
      (item) => item.id === activeDocumentId
    )

    if (document) {
      loadDocument(document)
    }
  }, [workspaceStarted, activeDocumentId, projectLoadKey])

  useEffect(() => {
    let mounted = true

    readStudioRecovery()
      .then((entry) => {
        if (mounted) setRecoveryEntry(entry)
      })
      .catch((error) => {
        if (mounted) {
          setRecoveryStorageAvailable(false)
          setRecoveryStatus(`${error.message} Use Save Project to keep a device copy.`)
        }
      })
      .finally(() => {
        if (mounted) setRecoveryBooting(false)
      })

    return () => {
      mounted = false
      clearTimeout(recoveryTimerRef.current)
    }
  }, [])

  useEffect(() => {
    clearTimeout(recoveryTimerRef.current)

    if (recoveryBooting || !recoveryStorageAvailable || recoveryEntry || recoveryBusy || projectBusy || paperLoading) return

    const current = documentsRef.current
    const revision = ++recoverySequenceRef.current

    if (!current.length) {
      if (!hadWorkspaceRef.current) return
      hadWorkspaceRef.current = false
      clearStudioRecovery()
        .then(() => setRecoveryStatus('No open papers. Local recovery cleared.'))
        .catch((error) => setRecoveryStatus(`Autosave failed: ${error.message}`))
      return
    }

    hadWorkspaceRef.current = true
    if (workspaceStarted && canvasDocumentRef.current !== activeDocumentId) return

    recoveryTimerRef.current = setTimeout(() => {
      if (drawingRef.current || revision !== recoverySequenceRef.current) return

      const pages = documentsRef.current
      const canvas = workspaceStarted ? canvasRef.current : null

      saveStudioRecovery(pages, activeDocumentId, canvas)
        .then((savedAt) => {
          if (revision === recoverySequenceRef.current) {
            setRecoveryStatus(`Autosaved locally at ${new Date(savedAt).toLocaleTimeString()}.`)
          }
        })
        .catch((error) => {
          setRecoveryStatus(`Autosave failed: ${error.message} Save Project to your device.`)
        })
    }, 2500)

    return () => clearTimeout(recoveryTimerRef.current)
  }, [documents, activeDocumentId, workspaceStarted, paperLoading, projectBusy, recoveryBooting, recoveryEntry, recoveryBusy, recoveryStorageAvailable])

  async function recoverWorkspace() {
    if (!recoveryEntry || recoveryBusy) return
    setRecoveryBusy(true)

    try {
      const recovered = await restoreStudioRecovery(recoveryEntry)
      const checked = buildStudioProject(recovered.documents, recovered.activeDocumentId)
      const papers = checked.documents.map((paper) => ({ ...paper, dirty: true }))
      documentsRef.current = papers
      setDocuments(papers)
      setActiveDocumentId(checked.activeDocumentId)
      setWorkspaceStarted(true)
      setProjectLoadKey((value) => value + 1)
      setRecoveryEntry(null)
      setRecoveryStatus('Recovered local papers. Use Save Project for a durable device copy.')
    } catch (error) {
      setRecoveryStatus(`Recovery failed: ${error.message}`)
    } finally {
      setRecoveryBusy(false)
    }
  }

  async function discardRecovery() {
    if (!recoveryEntry || recoveryBusy) return
    if (!window.confirm('Delete the local recovery copy? Save a .shadowstudio file first if you need this work.')) return

    setRecoveryBusy(true)
    try {
      await clearStudioRecovery()
      setRecoveryEntry(null)
      setRecoveryStatus('Local recovery copy deleted.')
    } catch (error) {
      setRecoveryStatus(`Could not discard recovery: ${error.message}`)
    } finally {
      setRecoveryBusy(false)
    }
  }

  useEffect(() => {
    function confirmBeforeUnload(event) {
      if (!documentsRef.current.some((document) => document.dirty)) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', confirmBeforeUnload)
    return () => window.removeEventListener('beforeunload', confirmBeforeUnload)
  }, [])

  function exitStudio() {
    if (
      documentsRef.current.length &&
      !window.confirm('Leaving Studio closes the open papers. Save Project to your device first. Leave?')
    ) {
      return
    }

    navigate(-1)
  }

  function chooseProjectFile() {
    if (projectBusy || recoveryBooting || recoveryEntry || recoveryBusy) return
    openProjectInputRef.current?.click()
  }

  function chooseImageFile() {
    if (paperLoading || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy || newFileOpen || exportOpen) return
    if (documentsRef.current.length >= DOCUMENT_LIMIT) {
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }
    importImageInputRef.current?.click()
  }

  async function importImageAsPaper(file) {
    if (!file || paperLoading || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy || newFileOpen || exportOpen) return
    if (documentsRef.current.length >= DOCUMENT_LIMIT) {
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }
    setProjectBusy(true)
    setProjectNotice('')
    try {
      const settings = await readStudioImage(file)
      if (documentsRef.current.length >= DOCUMENT_LIMIT) {
        window.alert(tx('shadowStudio.documentLimit'))
        return
      }
      const previous = workspaceStarted && activeDocumentId
        ? storeActiveImage(documentsRef.current)
        : documentsRef.current
      const imported = createDocument(settings)
      const next = [...previous, imported]
      documentsRef.current = next
      setDocuments(next)
      setWorkspaceStarted(true)
      setActiveDocumentId(imported.id)
      setProjectNotice(`Imported ${settings.name} as a new paper. Save Project to keep a copy.`)
    } catch (error) {
      setProjectNotice(error.message || 'Image import failed. Your existing papers were not changed.')
    } finally {
      setProjectBusy(false)
    }
  }

  async function openProject(file) {
    if (!file || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy) return

    setProjectBusy(true)
    setProjectNotice('')

    try {
      const project = await readStudioProject(file)

      if (
        documentsRef.current.length &&
        !window.confirm('Opening this project will close your current papers. Save Project first if you want to keep them. Continue?')
      ) {
        return
      }

      documentsRef.current = project.documents
      setDocuments(project.documents)
      setActiveDocumentId(project.activeDocumentId)
      setNewFileOpen(false)
      setProjectLoadKey((value) => value + 1)
      setWorkspaceStarted(true)
      setProjectNotice(`Opened ${project.documents.length} paper(s) from your device.`)
    } catch (error) {
      setProjectNotice(error.message || 'Unable to open the project file.')
    } finally {
      setProjectBusy(false)
    }
  }

  function saveProject(fileName = '') {
    if (projectBusy || paperLoading) {
      setProjectNotice('Wait for the current paper to finish loading.')
      return
    }

    const current = documentsRef.current

    if (!current.length) {
      setProjectNotice('Create a paper before saving.')
      return
    }

    try {
      const saved = workspaceStarted && activeDocumentId
        ? storeActiveImage(current)
        : current
      const project = buildStudioProject(saved, activeDocumentId)
      downloadStudioProject(project, fileName)
            const clean = saved.map((document) => ({ ...document, dirty: false }))
      documentsRef.current = clean
      setDocuments(clean)
      setProjectNotice('Project download started. Keep the .shadowstudio file in a safe place.')
    } catch (error) {
      setProjectNotice(error.message || 'Unable to save the project.')
    }
  }

  function saveProjectAs() {
    if (!documentsRef.current.length || paperLoading || projectBusy) return
    const suggestedName = documentsRef.current[0]?.name || 'Shadow-Project'
    const entered = window.prompt('Save project copy as:', suggestedName)
    if (entered === null) return
    const name = entered.trim().replace(/\.shadowstudio$/i, '')
    if (!name) {
      window.alert('Enter a project file name.')
      return
    }
    saveProject(name)
  }

  function openExportDialog() {
    if (!workspaceStarted || !activeDocument || paperLoading || projectBusy || newFileOpen) return
    setExportOpen(true)
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

  function openNewFile(presetId = 'basic') {
    if (paperLoading || projectBusy || recoveryBooting || recoveryEntry || recoveryBusy) return

    if (documentsRef.current.length >= DOCUMENT_LIMIT) {
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }

    setNewFilePreset(presetId)
    setNewFileOpen(true)
  }

  function createPaper(settings) {
    if (paperLoading || projectBusy) return

    const current = documentsRef.current

    if (current.length >= DOCUMENT_LIMIT) {
      setNewFileOpen(false)
      window.alert(tx('shadowStudio.documentLimit'))
      return
    }

    const saved =
      workspaceStarted && activeDocumentId
        ? storeActiveImage(current)
        : current

    const document = createDocument(settings)
    const next = [...saved, document]

    documentsRef.current = next
    setDocuments(next)
    setNewFileOpen(false)
    setWorkspaceStarted(true)
    setActiveDocumentId(document.id)
  }

  function renameDocument(documentId, nextName) {
    if (paperLoading || projectBusy || recoveryBusy) return
    const current = documentsRef.current.find((paper) => paper.id === documentId)
    const name = String(nextName || '').trim().slice(0, 80)
    if (!current || !name || current.name === name) return
    updateDocument(documentId, { name, dirty: true })
  }

  function switchDocument(documentId) {
    if (paperLoading || projectBusy || documentId === activeDocumentId) return

    const saved = storeActiveImage(documentsRef.current)
    const target = saved.find(
      (document) => document.id === documentId
    )

    if (!target) return

    documentsRef.current = saved
    setDocuments(saved)
    setActiveDocumentId(documentId)
  }

  function closeDocument(documentId, event) {
    event?.stopPropagation()
    if (paperLoading || projectBusy) return

    const current = documentsRef.current
    const index = current.findIndex(
      (document) => document.id === documentId
    )
    const target = current[index]

    if (!target) return

    if (
      target.dirty &&
      !window.confirm(tx('shadowStudio.closeConfirm'))
    ) {
      return
    }

    const base =
      documentId === activeDocumentId
        ? current
        : storeActiveImage(current)

    const next = base.filter(
      (document) => document.id !== documentId
    )

    documentsRef.current = next
    setDocuments(next)

    if (!next.length) {
      setActiveDocumentId('')
      setWorkspaceStarted(false)
      historyRef.current = []
      redoRef.current = []
      return
    }

    if (documentId === activeDocumentId) {
      const nextDocument =
        next[Math.min(index, next.length - 1)]
      setActiveDocumentId(nextDocument.id)
    }
  }

  function goHome() {
    if (paperLoading || projectBusy) return
    const saved = storeActiveImage(documentsRef.current)
    documentsRef.current = saved
    setDocuments(saved)
    setWorkspaceStarted(false)
  }

  function resumeWorkspace() {
    if (projectBusy || !documentsRef.current.length) return

    setWorkspaceStarted(true)

    if (!activeDocumentId) {
      setActiveDocumentId(documentsRef.current[0].id)
    }
  }

  const displayedWidth = Math.max(1, Math.round((activeDocument?.width || W) * zoom / 100))
  const displayedHeight = Math.max(1, Math.round((activeDocument?.height || H) * zoom / 100))
  const viewRadians = viewRotation * Math.PI / 180
  const viewCos = Math.cos(viewRadians)
  const viewSin = Math.sin(viewRadians)
  const viewFrameWidth = Math.ceil(Math.abs(displayedWidth * viewCos) + Math.abs(displayedHeight * viewSin)) + 2
  const viewFrameHeight = Math.ceil(Math.abs(displayedWidth * viewSin) + Math.abs(displayedHeight * viewCos)) + 2

  function updateCanvasView(nextRotation = viewRotation, nextHorizontal = flipHorizontal, nextVertical = flipVertical) {
    const angle = ((Math.round(nextRotation) % 360) + 540) % 360 - 180
    setViewRotation(angle)
    setFlipHorizontal(nextHorizontal)
    setFlipVertical(nextVertical)
    if (activeDocumentId) {
      viewStatesRef.current[activeDocumentId] = {
        angle,
        horizontal: nextHorizontal,
        vertical: nextVertical,
      }
    }
  }

  useEffect(() => {
    const previous = viewStatesRef.current[activeDocumentId]
    setViewRotation(previous?.angle || 0)
    setFlipHorizontal(Boolean(previous?.horizontal))
    setFlipVertical(Boolean(previous?.vertical))
  }, [activeDocumentId])

  function clampZoom(value) {
    return Math.min(400, Math.max(10, Math.round(value)))
  }

  function zoomAround(nextZoom, clientX, clientY) {
    const work = workRef.current
    const canvas = canvasRef.current
    if (!work || !canvas || !workspaceStarted) return

    const target = clampZoom(nextZoom)
    if (target === zoom) return

    const canvasRect = canvas.getBoundingClientRect()
    const workRect = work.getBoundingClientRect()
    const x = clientX ?? workRect.left + workRect.width / 2
    const y = clientY ?? workRect.top + workRect.height / 2

    zoomAnchorRef.current = {
      x,
      y,
      canvasX: (x - canvasRect.left) / canvasRect.width,
      canvasY: (y - canvasRect.top) / canvasRect.height,
    }
    setZoom(target)
  }

  function fitCanvas() {
    const work = workRef.current
    const document = documentsRef.current.find((item) => item.id === activeDocumentId)
    if (!work || !document) return

    const width = Math.max(100, work.clientWidth - 70)
    const height = Math.max(100, work.clientHeight - 70)
    const boundingWidth = Math.abs(document.width * viewCos) + Math.abs(document.height * viewSin)
    const boundingHeight = Math.abs(document.width * viewSin) + Math.abs(document.height * viewCos)
    const next = clampZoom(Math.min(width / boundingWidth, height / boundingHeight) * 100)
    zoomAnchorRef.current = null
    setZoom(next)
    requestAnimationFrame(() => {
      if (workRef.current !== work) return
      work.scrollLeft = 0
      work.scrollTop = 0
    })
  }

  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current
    const work = workRef.current
    const canvas = canvasRef.current
    if (!anchor || !work || !canvas) return

    const rect = canvas.getBoundingClientRect()
    work.scrollLeft += rect.left + anchor.canvasX * rect.width - anchor.x
    work.scrollTop += rect.top + anchor.canvasY * rect.height - anchor.y
    zoomAnchorRef.current = null
  }, [zoom])

  useEffect(() => {
    if (!workspaceStarted || !activeDocumentId) return
    const frame = requestAnimationFrame(fitCanvas)
    return () => cancelAnimationFrame(frame)
  }, [workspaceStarted, activeDocumentId, projectLoadKey])

  useEffect(() => {
    function onKeyDown(event) {
      const target = event.target
      if (event.code !== 'Space' || event.repeat || !workspaceStarted || newFileOpen) return
      if (target?.closest?.('input, textarea, select, button, [contenteditable="true"]')) return
      event.preventDefault()
      spaceRef.current = true
      setHandMode(true)
    }

    function releaseSpace(event) {
      if (event?.code && event.code !== 'Space') return
      spaceRef.current = false
      setHandMode(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', releaseSpace)
    window.addEventListener('blur', releaseSpace)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', releaseSpace)
      window.removeEventListener('blur', releaseSpace)
    }
  }, [workspaceStarted, newFileOpen])

  useEffect(() => {
    const work = workRef.current
    if (!work || !workspaceStarted) return

    function onWheel(event) {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      if (paperLoading || projectBusy || newFileOpen) return
      zoomAround(zoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12), event.clientX, event.clientY)
    }

    work.addEventListener('wheel', onWheel, { passive: false })
    return () => work.removeEventListener('wheel', onWheel)
  }, [workspaceStarted, zoom, paperLoading, projectBusy, newFileOpen])

  function panStart(event) {
    if (drawingRef.current || paperLoading || projectBusy) return
    if (!spaceRef.current && !(event.pointerType === 'mouse' && event.button === 1)) return

    const work = workRef.current
    if (!work) return
    event.preventDefault()
    event.stopPropagation()
    setHandMode(true)
    panRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: work.scrollLeft,
      top: work.scrollTop,
    }
    work.setPointerCapture?.(event.pointerId)
  }

  function panMove(event) {
    const pan = panRef.current
    const work = workRef.current
    if (!pan || !work || pan.id !== event.pointerId) return
    event.preventDefault()
    work.scrollLeft = pan.left - (event.clientX - pan.x)
    work.scrollTop = pan.top - (event.clientY - pan.y)
  }

  function panEnd(event) {
    const pan = panRef.current
    const work = workRef.current
    if (!pan || pan.id !== event.pointerId) return
    event.preventDefault()
    panRef.current = null
    setHandMode(spaceRef.current)
    if (work?.hasPointerCapture?.(event.pointerId)) work.releasePointerCapture(event.pointerId)
  }

  function clearCanvas(save = true) {
    paintBlank()
    updateDocument(activeDocumentId, { dirty: true })

    if (save) {
      snapshot()
    }
  }

  function point(event) {
    const canvas = canvasRef.current

    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const unrotatedX = dx * viewCos + dy * viewSin
    const unrotatedY = -dx * viewSin + dy * viewCos
    const x = (unrotatedX * (flipHorizontal ? -1 : 1) / displayedWidth + 0.5) * canvas.width
    const y = (unrotatedY * (flipVertical ? -1 : 1) / displayedHeight + 0.5) * canvas.height

    return { x, y }
  }

  function sampleCanvasColor(ctx, canvas, position) {
    const x = Math.floor(position.x)
    const y = Math.floor(position.y)
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return
    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data
      const sampled = `#${Array.from(pixel.slice(0, 3), (channel) => channel.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
      setColor(sampled)
      setTool('brush')
    } catch {
      setProjectNotice('Unable to sample this pixel.')
    }
  }

  function start(event) {
    if (drawingRef.current || paperLoading || projectBusy || panRef.current || spaceRef.current) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const canvas = canvasRef.current
    const ctx = context()
    const currentPoint = point(event)
    if (!canvas || !ctx || !currentPoint) return

    if (tool === 'eyedropper') {
      event.preventDefault()
      sampleCanvasColor(ctx, canvas, currentPoint)
      return
    }

    const stroke = beginStudioStroke(ctx, currentPoint, event, {
      size,
      opacity,
      style: tool === 'eraser' ? 'round' : brushStyle,
      color: tool === 'eraser' ? activeDocument?.background || '#FFFFFF' : color,
    })
    if (!stroke) return
    event.preventDefault()
    strokeRef.current = stroke
    drawingRef.current = true
    canvas.setPointerCapture?.(event.pointerId)
  }

  function draw(event) {
    const stroke = strokeRef.current
    if (!drawingRef.current || !stroke || stroke.pointerId !== event.pointerId) return
    const ctx = context()
    if (!ctx) return

    event.preventDefault()
    const coalesced = typeof event.getCoalescedEvents === 'function'
      ? event.getCoalescedEvents()
      : []
    for (const sample of [...coalesced, event]) {
      if (sample.pointerId !== stroke.pointerId) continue
      const currentPoint = point(sample)
      if (currentPoint) extendStudioStroke(ctx, stroke, currentPoint, sample)
    }
  }

  function finish(event) {
    const stroke = strokeRef.current
    if (!drawingRef.current || !stroke || stroke.pointerId !== event.pointerId) return
    event.preventDefault()
    if (event.type !== 'pointercancel') {
      const currentPoint = point(event)
      if (currentPoint) extendStudioStroke(context(), stroke, currentPoint, event)
    }
    drawingRef.current = false
    strokeRef.current = null

    const canvas = canvasRef.current
    if (canvas?.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }

    updateDocument(activeDocumentId, { dirty: true })
    snapshot()
  }

  function undo() {
    if (historyRef.current.length <= 1) return

    redoRef.current = [
      ...redoRef.current,
      historyRef.current.pop(),
    ].slice(-HISTORY_LIMIT)

    const previous =
      historyRef.current[historyRef.current.length - 1]

    if (previous) {
      context()?.putImageData(previous, 0, 0)
    }

    updateDocument(activeDocumentId, { dirty: true })
    refresh((number) => number + 1)
  }

  function redo() {
    if (!redoRef.current.length) return

    const next = redoRef.current.pop()

    historyRef.current = [
      ...historyRef.current,
      next,
    ].slice(-HISTORY_LIMIT)

    context()?.putImageData(next, 0, 0)
    updateDocument(activeDocumentId, { dirty: true })
    refresh((number) => number + 1)
  }

  const canUndo = historyRef.current.length > 1
  const canRedo = redoRef.current.length > 0

  return (
    <div className="shadow-studio">
      <style>{`
        .shadow-studio{min-height:100vh;background:#202225;color:#eef0f3;font-family:inherit}
        .ss-chrome{height:34px;display:flex;align-items:center;gap:2px;border-bottom:1px solid #454a50;background:#34373b;padding:0 7px}
        .ss-logo-btn{height:28px;width:28px;display:grid;place-items:center;border:0;background:transparent;cursor:pointer}
        .ss-logo{display:block;width:16px;height:16px;object-fit:contain}
        .ss-chrome-right{display:flex;align-items:center;gap:6px;margin-left:auto;white-space:nowrap}.ss-chrome-right .ss-doc-info{margin-right:7px}.ss-chrome-right .ss-btn.icon{height:27px;width:29px}
        .ss-menu-btn{height:28px;border:0;background:transparent;color:#e6e7e9;padding:0 8px;font:inherit;font-size:11px;cursor:pointer}
        .ss-menu-btn:hover{background:#474b50}
        .ss-menu-btn:disabled{opacity:.45;cursor:default}
        .ss-hidden-file{display:none}
        .ss-project-message{margin:14px 0 0;border:1px solid #59636d;border-radius:8px;background:#303842;color:#d7e6f7;padding:11px 13px;font-size:11px;line-height:1.5}
        .ss-top{position:sticky;top:34px;z-index:30;height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 10px;border-bottom:1px solid #41464c;background:#2c2f33}
        .ss-row{display:flex;align-items:center;gap:7px}
        .ss-doc-info{color:#c9cdd2;font-size:10px;font-weight:700}
        .ss-btn{height:32px;border:1px solid #50555b;border-radius:7px;background:#373b40;color:#f3f4f6;padding:0 10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
        .ss-btn:hover{background:#42474d}
        .ss-btn.primary{border-color:#4b9df4;background:#4b9df4;color:#08131f}
        .ss-btn.icon{width:32px;padding:0;display:grid;place-items:center}
        .ss-btn:disabled{opacity:.35;cursor:default}
        .ss-layout{display:grid;grid-template-columns:86px minmax(0,1fr) 236px;height:calc(100dvh - 70px);min-height:320px}
        .ss-tools{border-right:1px solid #3b4046;background:#292c30;padding:10px 7px}
        .ss-tool{width:100%;min-height:62px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid transparent;border-radius:9px;background:transparent;color:#bbc1c8;font:inherit;cursor:pointer}
        .ss-tool i{font-size:17px}
        .ss-tool span{font-size:10px;font-weight:700}
        .ss-tool.active{border-color:#506273;background:#3b4e61;color:#fff}
        .ss-work{min-width:0;min-height:0;overflow:auto;padding:28px 28px 72px;background:#4a4e53;touch-action:pan-x pan-y;overscroll-behavior:contain}.ss-work.ss-panning,.ss-work.ss-panning *{cursor:grabbing!important}.ss-work.ss-hand,.ss-work.ss-hand *{cursor:grab!important}
        .ss-stage{width:max-content;min-width:100%;min-height:100%;display:grid;place-items:center}
        .ss-canvas-frame{position:relative;flex:none;overflow:visible}
        .ss-canvas{position:absolute;left:50%;top:50%;display:block;max-width:none;box-shadow:0 10px 32px rgba(0,0,0,.25);touch-action:none;cursor:${tool === 'eyedropper' ? 'copy' : tool === 'eraser' ? 'cell' : 'crosshair'}}
        .ss-view-buttons{display:flex;flex-wrap:wrap;gap:6px}
        .ss-view-btn{display:flex;align-items:center;justify-content:center;gap:5px;flex:1;min-width:44px;height:31px;border:1px solid #555b62;border-radius:6px;background:#353a40;color:#e7ecf1;font:inherit;font-size:11px;cursor:pointer}
        .ss-view-btn:hover,.ss-view-btn.active{border-color:#72b3f7;background:#355274}
        .ss-view-btn:disabled{opacity:.4;cursor:default}
        .ss-view-angle{margin:10px 0 0;color:#d1d7dd;font-size:11px}
        .ss-view-help{margin:9px 0 0;color:#9ea9b4;font-size:10px;line-height:1.5}
        .ss-side{border-left:1px solid #3b4046;background:#292c30;padding:16px}
        .ss-section+.ss-section{margin-top:20px;padding-top:18px;border-top:1px solid #3d4248}
        .ss-label{margin:0 0 10px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#c2c7cd}
        .ss-color{width:100%;height:42px;border:1px solid #50555b;border-radius:8px;background:#fff;padding:2px}
        .ss-swatches{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}
        .ss-swatch{aspect-ratio:1;border:1px solid #596068;border-radius:6px;cursor:pointer}
        .ss-range{display:flex;align-items:center;gap:9px}
        .ss-range input{min-width:0;flex:1;accent-color:#73b9ff}
        .ss-value{width:44px;text-align:right;font-size:11px;font-weight:800;color:#c6ccd2}
        .ss-bottom{position:fixed;left:86px;right:236px;bottom:0;z-index:20;min-height:46px;display:flex;align-items:center;justify-content:center;border-top:1px solid #3b4046;background:rgba(42,45,49,.97);backdrop-filter:blur(8px);padding:7px 12px}
        .ss-controls{width:100%;display:flex;align-items:center;gap:12px;overflow-x:auto;scrollbar-width:thin}
        .ss-control{min-width:110px;flex:1;display:flex;align-items:center;gap:7px}
        .ss-control label{font-size:10px;font-weight:800;color:#c2c7cd}
        .ss-control input{min-width:60px;flex:1;accent-color:#73b9ff}.ss-zoom-control{flex:2;min-width:475px}.ss-zoom-btn{height:26px;min-width:25px;padding:0 5px;border:1px solid #50555b;border-radius:5px;background:#373b40;color:#eef0f3;font:inherit;font-size:11px;font-weight:700;cursor:pointer}.ss-zoom-btn:disabled{opacity:.4;cursor:default}.ss-zoom-label{min-width:34px}.ss-zoom-control .ss-value{width:36px}
        .ss-dialog-backdrop{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(0,0,0,.62);padding:18px}
        .ss-new-dialog{width:min(560px,100%);overflow:hidden;border:1px solid #555b62;border-radius:10px;background:#3a3d41;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.5)}
        .ss-dialog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:17px 18px;border-bottom:1px solid #50555b}
        .ss-dialog-head h2{margin:0;font-size:16px}
        .ss-dialog-head p{margin:4px 0 0;color:#b4bac1;font-size:10px}
        .ss-dialog-x{width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:#fff;cursor:pointer}
        .ss-dialog-x:hover{background:#4b5056}
        .ss-dialog-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:18px}
        .ss-field{display:grid;gap:6px}
        .ss-field-wide{grid-column:1/-1}
        .ss-field>span{font-size:10px;font-weight:800;color:#d4d7db}
        .ss-field input,.ss-field select{width:100%;height:36px;border:1px solid #61676e;border-radius:6px;background:#2f3236;color:#fff;padding:0 9px;outline:none;font:inherit;font-size:11px}
        .ss-field input:focus,.ss-field select:focus{border-color:#69aef4;box-shadow:0 0 0 2px rgba(105,174,244,.16)}
        .ss-field input:disabled{color:#9aa1a9}
        .ss-input-unit{display:grid;grid-template-columns:1fr 52px}
        .ss-input-unit input{border-radius:6px 0 0 6px}
        .ss-input-unit b{height:36px;display:grid;place-items:center;border:1px solid #61676e;border-left:0;border-radius:0 6px 6px 0;background:#44484d;color:#d8dbe0;font-size:9px}
        .ss-background-row{display:grid;grid-template-columns:1fr 42px 42px;gap:8px}
        .ss-background-row input[type=color]{padding:3px}
        .ss-background-preview{display:block;border:1px solid #6a7077;border-radius:6px}
        .ss-dialog-info{display:flex;flex-wrap:wrap;gap:8px 16px;border-radius:7px;background:#2f3236;padding:10px;color:#aeb5bd;font-size:9px}
        .ss-dialog-error{border-radius:7px;background:#552f32;color:#ffc2c7;padding:10px;font-size:10px;font-weight:700}
        .ss-dialog-actions{display:flex;justify-content:flex-end;gap:8px;padding:14px 18px;border-top:1px solid #50555b}
        @media (max-width:900px), (max-width:1100px) and (max-height:650px) and (orientation:landscape){
          .shadow-studio .ss-chrome-right{display:flex;align-items:center;gap:4px;margin-left:auto}
          .shadow-studio .ss-chrome-right .ss-doc-info{display:none}
          .shadow-studio .ss-chrome-right .ss-btn.icon{flex:0 0 29px;width:29px;height:29px;min-height:29px}
          .shadow-studio .ss-file-trigger{font-weight:800}
        }
        @media(max-width:900px){.ss-layout{grid-template-columns:72px minmax(0,1fr)}.ss-side{display:none}.ss-bottom{left:72px;right:0}.ss-work{padding:18px 18px 68px}}
        @media(max-width:640px){.ss-home{grid-template-columns:1fr}.ss-home-side{border-right:0;border-bottom:1px solid #35393e}.ss-home-main{padding:26px 16px}.ss-top{top:34px;padding:0 8px}.ss-layout{display:block}.ss-tab{min-width:104px}.ss-tab-count{display:none}.ss-tools{position:sticky;top:118px;z-index:25;display:flex;gap:6px;overflow-x:auto;border-right:0;border-bottom:1px solid #3b4046;padding:7px}.ss-tool{width:72px;min-width:72px;min-height:50px}.ss-work{padding:12px 12px 66px}.ss-bottom{left:0}.ss-controls{gap:8px}.ss-control label{display:none}.ss-dialog-body{grid-template-columns:1fr}.ss-field-wide{grid-column:auto}}
      `}</style>

      <StudioChrome onBack={exitStudio}>
        <StudioFileMenu
          hasPaper={documents.length > 0}
          inWorkspace={workspaceStarted}
          canNew={!paperLoading && !projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen && documents.length < DOCUMENT_LIMIT}
          canOpen={!projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen}
          busy={paperLoading || projectBusy || recoveryBusy || newFileOpen}
          onNew={() => openNewFile('basic')}
          onOpen={chooseProjectFile}
          canImport={!paperLoading && !projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen && !exportOpen && documents.length < DOCUMENT_LIMIT}
          onImport={chooseImageFile}
          onSave={() => saveProject()}
          onSaveAs={saveProjectAs}
          onExport={openExportDialog}
          onClose={() => closeDocument(activeDocumentId)}
          onCloseAll={closeAllPapers}
          onHome={goHome}
          onExit={exitStudio}
        />
        <StudioEditMenu
          enabled={workspaceStarted && !paperLoading && !projectBusy && !recoveryBooting && !recoveryEntry && !recoveryBusy && !newFileOpen}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onClear={() => clearCanvas()}
        />
        <StudioViewMenu
          enabled={workspaceStarted && !paperLoading && !projectBusy && !newFileOpen}
          zoom={zoom}
          gridVisible={showGrid}
          gridSpacing={gridSpacing}
          rotation={viewRotation}
          flippedHorizontal={flipHorizontal}
          flippedVertical={flipVertical}
          onToggleGrid={() => setShowGrid((current) => !current)}
          onGridSpacing={(spacing) => { setGridSpacing(spacing); setShowGrid(true) }}
          onZoom={zoomAround}
          onFit={fitCanvas}
          onRotate={(degrees) => updateCanvasView(viewRotation + degrees)}
          onFlipHorizontal={() => updateCanvasView(viewRotation, !flipHorizontal, flipVertical)}
          onFlipVertical={() => updateCanvasView(viewRotation, flipHorizontal, !flipVertical)}
          onResetOrientation={() => updateCanvasView(0, false, false)}
        />
        {workspaceStarted ? (
          <div className="ss-chrome-right">
            <div className="ss-doc-info">{activeDocument?.width} × {activeDocument?.height}px · {activeDocument?.resolution} PPI</div>
            <button type="button" className="ss-btn icon" onClick={undo} disabled={!canUndo || paperLoading || projectBusy} title="Undo" aria-label="Undo"><i className="fa-solid fa-rotate-left" /></button>
            <button type="button" className="ss-btn icon" onClick={redo} disabled={!canRedo || paperLoading || projectBusy} title="Redo" aria-label="Redo"><i className="fa-solid fa-rotate-right" /></button>
          </div>
        ) : null}
      </StudioChrome>

      {!workspaceStarted ? (
        <StudioHome
          documents={documents}
          documentLimit={DOCUMENT_LIMIT}
          recoveryBooting={recoveryBooting}
          recoveryEntry={recoveryEntry}
          recoveryBusy={recoveryBusy}
          projectBusy={projectBusy}
          paperLoading={paperLoading}
          newFileOpen={newFileOpen}
          exportOpen={exportOpen}
          projectNotice={projectNotice}
          recoveryStatus={recoveryStatus}
          onNewFile={openNewFile}
          onOpenProject={chooseProjectFile}
          onImportImage={chooseImageFile}
          onResume={resumeWorkspace}
          onExit={exitStudio}
          onRecover={recoverWorkspace}
          onDiscardRecovery={discardRecovery}
          labels={{
            newPaper: tx('shadowStudio.newPaper'),
            back: tx('shadowStudio.back'),
            welcomeTitle: tx('shadowStudio.welcomeTitle'),
            welcomeText: tx('shadowStudio.welcomeText'),
          }}
        />
      ) : (
        <>
          {projectNotice ? <div className="ss-project-message" role="status">{projectNotice}</div> : null}
              {recoveryStatus ? <div className="ss-project-message" role="status">{recoveryStatus}</div> : null}

          <StudioPaperTabs
            documents={documents}
            activeDocumentId={activeDocumentId}
            limit={DOCUMENT_LIMIT}
            disabled={paperLoading || projectBusy || recoveryBusy}
            onSwitch={switchDocument}
            onClose={closeDocument}
            onNew={() => openNewFile('basic')}
            onRename={renameDocument}
            labels={{ close: tx('shadowStudio.closePaper'), new: tx('shadowStudio.newPaper') }}
          />

          <main className="ss-layout">
            <StudioToolRail
              tool={tool}
              onToolChange={setTool}
              labels={{ brush: tx('shadowStudio.brush'), eraser: tx('shadowStudio.eraser'), eyedropper: tx('shadowStudio.eyedropper') }}
            />

            <section ref={workRef} className={`ss-work ${panRef.current ? 'ss-panning' : handMode ? 'ss-hand' : ''}`} onPointerDownCapture={panStart} onPointerMove={panMove} onPointerUp={panEnd} onPointerCancel={panEnd}>
              <div className="ss-stage">
                <div className="ss-canvas-frame" style={{ width: viewFrameWidth, height: viewFrameHeight }}>
                  <canvas
                    ref={canvasRef}
                    className="ss-canvas"
                    width={activeDocument?.width || W}
                    height={activeDocument?.height || H}
                    style={{
                      width: displayedWidth,
                      height: displayedHeight,
                      transform: `translate(-50%, -50%) rotate(${viewRotation}deg) scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`,
                    }}
                    aria-label={tx('shadowStudio.canvas')}
                    onPointerDown={start}
                    onPointerMove={draw}
                    onPointerUp={finish}
                    onPointerCancel={finish}
                  />
                  {showGrid && gridSpacing * zoom / 100 >= 8 ? (
                    <div
                      className="ss-view-grid"
                      aria-hidden="true"
                      style={{
                        width: displayedWidth,
                        height: displayedHeight,
                        backgroundSize: `${gridSpacing * zoom / 100}px ${gridSpacing * zoom / 100}px`,
                        transform: `translate(-50%, -50%) rotate(${viewRotation}deg) scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </section>

            <StudioControlSidebar
              color={color}
              onColorChange={(nextColor) => { setColor(nextColor); setTool('brush') }}
              brushStyle={brushStyle}
              onBrushStyleChange={(nextStyle) => { setBrushStyle(nextStyle); setTool('brush') }}
              size={size}
              onSizeChange={setSize}
              opacity={opacity}
              onOpacityChange={setOpacity}
              viewRotation={viewRotation}
              flipHorizontal={flipHorizontal}
              flipVertical={flipVertical}
              onViewChange={updateCanvasView}
              paperLoading={paperLoading}
              projectBusy={projectBusy}
              onClear={() => clearCanvas()}
              navigator={<StudioNavigator canvasRef={canvasRef} workRef={workRef} paperId={activeDocumentId} revision={canvasRevision} rotation={viewRotation} flipHorizontal={flipHorizontal} flipVertical={flipVertical} zoom={zoom} disabled={paperLoading || projectBusy} />}
              labels={{ color: tx('shadowStudio.color'), size: tx('shadowStudio.size'), opacity: tx('shadowStudio.opacity'), clear: tx('shadowStudio.clear') }}
            />
          </main>

          <StudioControlFooter
            size={size}
            onSizeChange={setSize}
            opacity={opacity}
            onOpacityChange={setOpacity}
            zoom={zoom}
            onZoom={zoomAround}
            onFit={fitCanvas}
            viewRotation={viewRotation}
            flipHorizontal={flipHorizontal}
            flipVertical={flipVertical}
            onViewChange={updateCanvasView}
            labels={{ size: tx('shadowStudio.size'), opacity: tx('shadowStudio.opacity'), zoom: tx('shadowStudio.zoom') }}
          />
        </>
      )}

      <input
        ref={openProjectInputRef}
        className="ss-hidden-file"
        type="file"
        accept=".shadowstudio"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) openProject(file)
        }}
      />

      <input
        ref={importImageInputRef}
        className="ss-hidden-file"
        type="file"
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        aria-label="Import image as a new paper"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) importImageAsPaper(file)
        }}
      />

      <StudioExportDialog
        open={exportOpen && workspaceStarted && !paperLoading}
        paper={activeDocument}
        canvasRef={canvasRef}
        onClose={() => setExportOpen(false)}
        onExported={(message) => { setProjectNotice(message); setExportOpen(false) }}
      />

      <StudioNewFileDialog
        open={newFileOpen}
        defaultName={nextDocumentName(documentsRef.current)}
        initialPreset={newFilePreset}
        onClose={() => setNewFileOpen(false)}
        onCreate={createPaper}
      />
    </div>
  )
}

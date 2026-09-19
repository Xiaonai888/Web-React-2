import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import StudioNewFileDialog, { STUDIO_PRESETS } from './StudioNewFileDialog'
import { buildStudioProject, downloadStudioProject, readStudioProject } from './StudioProjectFile'

registerTranslationNamespace('shadowStudio', {
  en: {
    back: 'Back',
    brush: 'Brush',
    eraser: 'Eraser',
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
const SWATCHES = [
  '#111111',
  '#374151',
  '#6B7280',
  '#D1D5DB',
  '#FFFFFF',
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#06B6D4',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#7F1D1D',
  '#78350F',
  '#172554',
]

function createDocument({
  name,
  width = W,
  height = H,
  resolution = 144,
  background = '#FFFFFF',
  presetId = 'custom',
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
    image: '',
    dirty: false,
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

function Tool({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`ss-tool ${active ? 'active' : ''}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <i className={icon} />
      <span>{label}</span>
    </button>
  )
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
  const drawingRef = useRef(false)
  const lastRef = useRef(null)
  const historyRef = useRef([])
  const redoRef = useRef([])
  const documentsRef = useRef([])
  const loadTokenRef = useRef(0)
  const openProjectInputRef = useRef(null)

  const [, refresh] = useState(0)
  const [documents, setDocuments] = useState([])
  const [activeDocumentId, setActiveDocumentId] = useState('')
  const [workspaceStarted, setWorkspaceStarted] = useState(false)
  const [newFileOpen, setNewFileOpen] = useState(false)
  const [newFilePreset, setNewFilePreset] = useState('basic')
  const [tool, setTool] = useState('brush')
  const [color, setColor] = useState('#111111')
  const [size, setSize] = useState(8)
  const [opacity, setOpacity] = useState(100)
  const [zoom, setZoom] = useState(75)
  const [projectBusy, setProjectBusy] = useState(false)
  const [projectNotice, setProjectNotice] = useState('')
  const [projectLoadKey, setProjectLoadKey] = useState(0)
  const [paperLoading, setPaperLoading] = useState(false)

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
    const canvas = canvasRef.current

    if (!canvas || !document) return

    canvas.width = document.width || W
    canvas.height = document.height || H
    paintBlank(document)

    if (!document.image) {
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
    if (projectBusy) return
    openProjectInputRef.current?.click()
  }

  async function openProject(file) {
    if (!file || projectBusy) return

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

  function saveProject() {
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
      downloadStudioProject(project)
      documentsRef.current = saved
      setDocuments(saved)
      setProjectNotice('Project download started. Keep the .shadowstudio file in a safe place.')
    } catch (error) {
      setProjectNotice(error.message || 'Unable to save the project.')
    }
  }

  function openNewFile(presetId = 'basic') {
    if (paperLoading || projectBusy) return

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

    return {
      x:
        (event.clientX - rect.left) *
        (canvas.width / rect.width),
      y:
        (event.clientY - rect.top) *
        (canvas.height / rect.height),
    }
  }

  function setupStroke(ctx) {
    const eraserColor =
      activeDocument?.background || '#FFFFFF'

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = size
    ctx.globalAlpha = opacity / 100
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle =
      tool === 'eraser' ? eraserColor : color
    ctx.fillStyle =
      tool === 'eraser' ? eraserColor : color
  }

  function start(event) {
    if (paperLoading || projectBusy) return

    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    const canvas = canvasRef.current
    const ctx = context()
    const currentPoint = point(event)

    if (!canvas || !ctx || !currentPoint) return

    event.preventDefault()
    canvas.setPointerCapture?.(event.pointerId)
    drawingRef.current = true
    lastRef.current = currentPoint

    ctx.save()
    setupStroke(ctx)
    ctx.beginPath()
    ctx.arc(
      currentPoint.x,
      currentPoint.y,
      Math.max(size / 2, 0.5),
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.restore()
  }

  function draw(event) {
    if (!drawingRef.current) return

    const ctx = context()
    const currentPoint = point(event)
    const lastPoint = lastRef.current

    if (!ctx || !currentPoint || !lastPoint) return

    event.preventDefault()
    ctx.save()
    setupStroke(ctx)
    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)
    ctx.stroke()
    ctx.restore()
    lastRef.current = currentPoint
  }

  function finish(event) {
    if (!drawingRef.current) return

    event.preventDefault()
    drawingRef.current = false
    lastRef.current = null

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
        .ss-menu-btn{height:28px;border:0;background:transparent;color:#e6e7e9;padding:0 8px;font:inherit;font-size:11px;cursor:pointer}
        .ss-menu-btn:hover{background:#474b50}
        .ss-menu-btn:disabled{opacity:.45;cursor:default}
        .ss-hidden-file{display:none}
        .ss-project-message{margin:14px 0 0;border:1px solid #59636d;border-radius:8px;background:#303842;color:#d7e6f7;padding:11px 13px;font-size:11px;line-height:1.5}
        .ss-home-link:disabled{opacity:.45;cursor:default}
        .ss-home{min-height:calc(100vh - 34px);display:grid;grid-template-columns:180px minmax(0,1fr);background:#1e2023}
        .ss-home-side{border-right:1px solid #35393e;background:#25272a;padding:22px 18px}
        .ss-home-primary{width:100%;height:38px;border:0;border-radius:8px;background:#2d8cff;color:#fff;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
        .ss-home-link{width:100%;height:38px;margin-top:8px;border:1px solid #42474d;border-radius:8px;background:transparent;color:#eef0f3;font:inherit;font-size:12px;font-weight:700;cursor:pointer}
        .ss-home-main{padding:42px clamp(24px,5vw,72px)}
        .ss-home-main h1{margin:0;font-size:29px;font-weight:700}
        .ss-home-main>p{margin:7px 0 0;color:#aab0b7;font-size:13px}
        .ss-preset-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:28px}
        .ss-preset-card{min-height:112px;border:1px solid #3b4046;border-radius:10px;background:#292c30;color:#fff;padding:16px;text-align:left;cursor:pointer}
        .ss-preset-card:hover{border-color:#5a93d6;background:#30343a}
        .ss-preset-card strong{display:block;font-size:13px}
        .ss-preset-card span{display:block;margin-top:8px;color:#9fa6ae;font-size:10px;line-height:1.5}
        .ss-recent{margin-top:36px}
        .ss-recent h2{margin:0 0 12px;font-size:15px}
        .ss-empty{border:1px dashed #41464c;border-radius:12px;background:#24272a;padding:22px;color:#8f969e;font-size:12px}
        .ss-top{position:sticky;top:34px;z-index:30;height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 10px;border-bottom:1px solid #41464c;background:#2c2f33}
        .ss-row{display:flex;align-items:center;gap:7px}
        .ss-doc-info{color:#c9cdd2;font-size:10px;font-weight:700}
        .ss-btn{height:32px;border:1px solid #50555b;border-radius:7px;background:#373b40;color:#f3f4f6;padding:0 10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
        .ss-btn:hover{background:#42474d}
        .ss-btn.primary{border-color:#4b9df4;background:#4b9df4;color:#08131f}
        .ss-btn.icon{width:32px;padding:0;display:grid;place-items:center}
        .ss-btn:disabled{opacity:.35;cursor:default}
        .ss-tabs{position:sticky;top:82px;z-index:29;display:flex;align-items:stretch;min-height:36px;overflow-x:auto;border-bottom:1px solid #3d4248;background:#24272a;padding-left:8px}
        .ss-tab{min-width:118px;max-width:220px;height:36px;display:flex;align-items:center;border-right:1px solid #3d4248;background:#292c30;color:#b9c0c7}
        .ss-tab.active{background:#3a3f45;color:#fff}
        .ss-tab-main{min-width:0;flex:1;height:36px;display:flex;align-items:center;gap:8px;border:0;background:transparent;color:inherit;padding:0 4px 0 10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
        .ss-tab-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ss-dirty{height:6px;width:6px;flex:0 0 6px;border-radius:999px;background:#9ca3af}
        .ss-tab-close{height:24px;width:24px;display:grid;place-items:center;border:0;border-radius:5px;background:transparent;color:inherit;cursor:pointer}
        .ss-tab-close:hover{background:rgba(255,255,255,.08)}
        .ss-tab-add{height:36px;min-width:42px;border:0;background:transparent;color:#d2d6db;cursor:pointer}
        .ss-tab-count{margin-left:auto;display:flex;align-items:center;padding:0 12px;color:#8f969e;font-size:10px;font-weight:800;white-space:nowrap}
        .ss-layout{display:grid;grid-template-columns:86px minmax(0,1fr) 236px;min-height:calc(100vh - 118px)}
        .ss-tools{border-right:1px solid #3b4046;background:#292c30;padding:10px 7px}
        .ss-tool{width:100%;min-height:62px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid transparent;border-radius:9px;background:transparent;color:#bbc1c8;font:inherit;cursor:pointer}
        .ss-tool i{font-size:17px}
        .ss-tool span{font-size:10px;font-weight:700}
        .ss-tool.active{border-color:#506273;background:#3b4e61;color:#fff}
        .ss-work{min-width:0;overflow:auto;padding:28px 28px 72px;background:#4a4e53}
        .ss-stage{min-width:100%;min-height:calc(100vh - 210px);display:grid;place-items:center}
        .ss-canvas{display:block;width:${zoom}%;max-width:none;height:auto;box-shadow:0 10px 32px rgba(0,0,0,.25);touch-action:none;cursor:${tool === 'eraser' ? 'cell' : 'crosshair'}}
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
        .ss-controls{width:min(760px,100%);display:flex;align-items:center;gap:15px}
        .ss-control{min-width:0;flex:1;display:flex;align-items:center;gap:7px}
        .ss-control label{font-size:10px;font-weight:800;color:#c2c7cd}
        .ss-control input{min-width:60px;flex:1;accent-color:#73b9ff}
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
        @media(max-width:900px){.ss-layout{grid-template-columns:72px minmax(0,1fr)}.ss-side{display:none}.ss-bottom{left:72px;right:0}.ss-work{padding:18px 18px 68px}}
        @media(max-width:640px){.ss-home{grid-template-columns:1fr}.ss-home-side{border-right:0;border-bottom:1px solid #35393e}.ss-home-main{padding:26px 16px}.ss-top{top:34px;padding:0 8px}.ss-layout{display:block}.ss-tab{min-width:104px}.ss-tab-count{display:none}.ss-tools{position:sticky;top:118px;z-index:25;display:flex;gap:6px;overflow-x:auto;border-right:0;border-bottom:1px solid #3b4046;padding:7px}.ss-tool{width:72px;min-width:72px;min-height:50px}.ss-work{padding:12px 12px 66px}.ss-bottom{left:0}.ss-controls{gap:8px}.ss-control label{display:none}.ss-dialog-body{grid-template-columns:1fr}.ss-field-wide{grid-column:auto}}
      `}</style>

      <StudioChrome onBack={exitStudio}>
        <button
          type="button"
          className="ss-menu-btn"
          disabled={paperLoading || projectBusy}
          onClick={() => openNewFile('basic')}
        >
          New
        </button>
        <button type="button" className="ss-menu-btn" disabled={projectBusy} onClick={chooseProjectFile}>
          Open
        </button>
        <button type="button" className="ss-menu-btn" disabled={!documents.length || paperLoading || projectBusy} onClick={saveProject}>
          Save
        </button>
        <button
          type="button"
          className="ss-menu-btn"
          disabled={!workspaceStarted}
          onClick={undo}
        >
          Edit
        </button>
        <button
          type="button"
          className="ss-menu-btn"
          disabled={!workspaceStarted}
        >
          View
        </button>
      </StudioChrome>

      {!workspaceStarted ? (
        <main className="ss-home">
          <aside className="ss-home-side">
            <button
              type="button"
              className="ss-home-primary"
              onClick={() => openNewFile('basic')}
            >
              + {tx('shadowStudio.newPaper')}
            </button>

            <button type="button" className="ss-home-link" disabled={projectBusy} onClick={chooseProjectFile}>
              Open Project
            </button>

            {documents.length ? (
              <button
                type="button"
                className="ss-home-link"
                onClick={resumeWorkspace}
              >
                Continue Workspace
              </button>
            ) : null}

            <button type="button" className="ss-home-link" onClick={exitStudio}>
              {tx('shadowStudio.back')}
            </button>
          </aside>

          <section className="ss-home-main">
            <h1>{tx('shadowStudio.welcomeTitle')}</h1>
            <p>{tx('shadowStudio.welcomeText')}</p>

            <div className="ss-preset-grid">
              {STUDIO_PRESETS.filter(
                (preset) => preset.id !== 'custom'
              ).map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  className="ss-preset-card"
                  onClick={() => openNewFile(preset.id)}
                >
                  <strong>{preset.label}</strong>
                  <span>
                    {preset.width} × {preset.height} px
                    <br />
                    {preset.resolution} PPI
                  </span>
                </button>
              ))}
            </div>

            <section className="ss-recent">
              <h2>Project files</h2>
              <div className="ss-empty">
                Save Project downloads a .shadowstudio file to your device. Use Open Project to resume it later. Automatic recovery is not enabled yet.
              </div>
              {projectNotice ? <div className="ss-project-message" role="status">{projectNotice}</div> : null}
            </section>
          </section>
        </main>
      ) : (
        <>
          <header className="ss-top">
            <div className="ss-row">
              <button type="button" className="ss-btn" onClick={goHome} disabled={paperLoading || projectBusy}>
                Home
              </button>
              <button type="button" className="ss-btn" disabled={paperLoading || projectBusy} onClick={saveProject}>
                Save Project
              </button>
              <button type="button" className="ss-btn" disabled={projectBusy} onClick={chooseProjectFile}>
                Open Project
              </button>

              <div className="ss-doc-info">
                {activeDocument?.width} × {activeDocument?.height}px
                {' · '}
                {activeDocument?.resolution} PPI
              </div>
            </div>

            <div className="ss-row">
              <button
                type="button"
                className="ss-btn icon"
                onClick={undo}
                disabled={!canUndo}
                title={tx('shadowStudio.undo')}
              >
                <i className="fa-solid fa-rotate-left" />
              </button>

              <button
                type="button"
                className="ss-btn icon"
                onClick={redo}
                disabled={!canRedo}
                title={tx('shadowStudio.redo')}
              >
                <i className="fa-solid fa-rotate-right" />
              </button>

              <button
                type="button"
                className="ss-btn primary"
                onClick={() => openNewFile('basic')}
              >
                <i className="fa-solid fa-plus" />{' '}
                {tx('shadowStudio.newPaper')}
              </button>
            </div>
          </header>

          {projectNotice ? <div className="ss-project-message" role="status">{projectNotice}</div> : null}

          <div className="ss-tabs">
            {documents.map((document) => (
              <div
                key={document.id}
                className={`ss-tab ${
                  document.id === activeDocumentId
                    ? 'active'
                    : ''
                }`}
              >
                <button
                  type="button"
                  className="ss-tab-main"
                  onClick={() =>
                    switchDocument(document.id)
                  }
                >
                  {document.dirty ? (
                    <span className="ss-dirty" />
                  ) : null}
                  <span className="ss-tab-name">
                    {document.name}
                  </span>
                </button>

                <button
                  type="button"
                  className="ss-tab-close"
                  title={tx('shadowStudio.closePaper')}
                  aria-label={tx('shadowStudio.closePaper')}
                  onClick={(event) =>
                    closeDocument(document.id, event)
                  }
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="ss-tab-add"
              onClick={() => openNewFile('basic')}
              title={tx('shadowStudio.newPaper')}
            >
              <i className="fa-solid fa-plus" />
            </button>

            <div className="ss-tab-count">
              {documents.length}/{DOCUMENT_LIMIT}
            </div>
          </div>

          <main className="ss-layout">
            <aside className="ss-tools">
              <Tool
                active={tool === 'brush'}
                icon="fa-solid fa-paintbrush"
                label={tx('shadowStudio.brush')}
                onClick={() => setTool('brush')}
              />
              <Tool
                active={tool === 'eraser'}
                icon="fa-solid fa-eraser"
                label={tx('shadowStudio.eraser')}
                onClick={() => setTool('eraser')}
              />
            </aside>

            <section className="ss-work">
              <div className="ss-stage">
                <canvas
                  ref={canvasRef}
                  className="ss-canvas"
                  width={activeDocument?.width || W}
                  height={activeDocument?.height || H}
                  aria-label={tx('shadowStudio.canvas')}
                  onPointerDown={start}
                  onPointerMove={draw}
                  onPointerUp={finish}
                  onPointerCancel={finish}
                />
              </div>
            </section>

            <aside className="ss-side">
              <section className="ss-section">
                <h2 className="ss-label">
                  {tx('shadowStudio.color')}
                </h2>

                <input
                  className="ss-color"
                  type="color"
                  value={color}
                  onChange={(event) => {
                    setColor(event.target.value)
                    setTool('brush')
                  }}
                />

                <div className="ss-swatches">
                  {SWATCHES.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      className="ss-swatch"
                      style={{ background: swatch }}
                      onClick={() => {
                        setColor(swatch)
                        setTool('brush')
                      }}
                      aria-label={swatch}
                    />
                  ))}
                </div>
              </section>

              <section className="ss-section">
                <h2 className="ss-label">
                  {tx('shadowStudio.size')}
                </h2>
                <div className="ss-range">
                  <input
                    type="range"
                    min="1"
                    max="80"
                    value={size}
                    onChange={(event) =>
                      setSize(Number(event.target.value))
                    }
                  />
                  <span className="ss-value">
                    {size}px
                  </span>
                </div>
              </section>

              <section className="ss-section">
                <h2 className="ss-label">
                  {tx('shadowStudio.opacity')}
                </h2>
                <div className="ss-range">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(event) =>
                      setOpacity(
                        Number(event.target.value)
                      )
                    }
                  />
                  <span className="ss-value">
                    {opacity}%
                  </span>
                </div>
              </section>

              <section className="ss-section">
                <button
                  type="button"
                  className="ss-btn"
                  onClick={() => clearCanvas()}
                >
                  {tx('shadowStudio.clear')}
                </button>
              </section>
            </aside>
          </main>

          <footer className="ss-bottom">
            <div className="ss-controls">
              <div className="ss-control">
                <label>
                  {tx('shadowStudio.size')}
                </label>
                <input
                  type="range"
                  min="1"
                  max="80"
                  value={size}
                  onChange={(event) =>
                    setSize(Number(event.target.value))
                  }
                />
                <span className="ss-value">
                  {size}px
                </span>
              </div>

              <div className="ss-control">
                <label>
                  {tx('shadowStudio.opacity')}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={opacity}
                  onChange={(event) =>
                    setOpacity(
                      Number(event.target.value)
                    )
                  }
                />
                <span className="ss-value">
                  {opacity}%
                </span>
              </div>

              <div className="ss-control">
                <label>
                  {tx('shadowStudio.zoom')}
                </label>
                <input
                  type="range"
                  min="35"
                  max="125"
                  value={zoom}
                  onChange={(event) =>
                    setZoom(Number(event.target.value))
                  }
                />
                <span className="ss-value">
                  {zoom}%
                </span>
              </div>
            </div>
          </footer>
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

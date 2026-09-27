import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Minus, Plus } from 'lucide-react'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const PDFJS_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'
const PDFJS_WORKER_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

let pdfJsPromise = null

registerTranslationNamespace('webPdfReader', {
  en: { loading: 'Opening PDF…', failed: 'Unable to display this PDF.', page: 'Page {{page}} of {{total}}', fullView: 'Full View', exitFullView: 'Exit Full View', zoomIn: 'Zoom in', zoomOut: 'Zoom out', fitWidth: 'Fit width' },
  km: { loading: 'កំពុងបើក PDF…', failed: 'មិនអាចបង្ហាញ PDF នេះបានទេ។', page: 'ទំព័រ {{page}} នៃ {{total}}', fullView: 'មើលពេញអេក្រង់', exitFullView: 'បិទមើលពេញអេក្រង់', zoomIn: 'ពង្រីក', zoomOut: 'បង្រួម', fitWidth: 'សមទទឹង' },
  zh: { loading: '正在打开 PDF…', failed: '无法显示此 PDF。', page: '第 {{page}} 页，共 {{total}} 页', fullView: '全屏查看', exitFullView: '退出全屏', zoomIn: '放大', zoomOut: '缩小', fitWidth: '适合宽度' },
  ja: { loading: 'PDF を開いています…', failed: 'この PDF を表示できません。', page: '{{total}} ページ中 {{page}} ページ', fullView: '全画面表示', exitFullView: '全画面を閉じる', zoomIn: '拡大', zoomOut: '縮小', fitWidth: '幅に合わせる' },
  ko: { loading: 'PDF 여는 중…', failed: '이 PDF를 표시할 수 없습니다.', page: '{{total}}페이지 중 {{page}}페이지', fullView: '전체 화면', exitFullView: '전체 화면 닫기', zoomIn: '확대', zoomOut: '축소', fitWidth: '너비 맞춤' },
})

function loadPdfJs() {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC
    return Promise.resolve(window.pdfjsLib)
  }
  if (!pdfJsPromise) {
    pdfJsPromise = new Promise((resolve, reject) => {
      let script = document.querySelector('script[data-shadow-pdfjs="true"]')
      const loaded = () => {
        const library = window.pdfjsLib
        if (!library) {
          pdfJsPromise = null
          reject(new Error('PDF viewer failed to load'))
          return
        }
        library.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC
        resolve(library)
      }
      const failed = () => {
        pdfJsPromise = null
        reject(new Error('PDF viewer failed to load'))
      }
      if (script) {
        script.addEventListener('load', loaded, { once: true })
        script.addEventListener('error', failed, { once: true })
        return
      }
      script = document.createElement('script')
      script.src = PDFJS_SRC
      script.async = true
      script.crossOrigin = 'anonymous'
      script.dataset.shadowPdfjs = 'true'
      script.addEventListener('load', loaded, { once: true })
      script.addEventListener('error', failed, { once: true })
      document.head.appendChild(script)
    })
  }
  return pdfJsPromise
}

function clampZoom(value) {
  return Math.min(2.5, Math.max(0.75, Number(value) || 1))
}

function touchDistance(touches) {
  if (!touches || touches.length < 2) return 0
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function readerWatermark() {
  let user = null
  try {
    const storage = localStorage.getItem('shadow_reader_token') ? localStorage : sessionStorage
    user = JSON.parse(storage.getItem('shadow_reader_user') || 'null')
  } catch {
    user = null
  }
  const name = String(user?.name || user?.display_name || 'Reader').trim() || 'Reader'
  const usernameRaw = String(user?.username || '').trim().replace(/^@+/, '')
  const username = usernameRaw ? `@${usernameRaw}` : ''
  const id = String(user?.id || user?.user_id || '').trim()
  const shortId = id ? (id.length > 14 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id) : 'unknown'
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  return ['Purchased copy', name, username, `ID ${shortId}`, date].filter(Boolean).join(' • ')
}

function PdfPage({ pdf, pageNumber, total, scale, onVisible, registerPage, watermark, showPageLabel }) {
  const { t } = useDisplayTranslation()
  const holderRef = useRef(null)
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const [state, setState] = useState('idle')

  useEffect(() => {
    const node = holderRef.current
    if (!node) return undefined
    registerPage(pageNumber, node)
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      onVisible(pageNumber)
      return undefined
    }
    const lazyObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setVisible(true)
    }, { rootMargin: '900px 0px' })
    const activeObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) onVisible(pageNumber)
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 })
    lazyObserver.observe(node)
    activeObserver.observe(node)
    return () => {
      lazyObserver.disconnect()
      activeObserver.disconnect()
      registerPage(pageNumber, null)
    }
  }, [pageNumber, onVisible, registerPage])

  useEffect(() => {
    const node = holderRef.current
    if (!node) return undefined
    const update = () => setWidth(Math.max(1, Math.floor(node.clientWidth)))
    update()
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(update)
      observer.observe(node)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!pdf || !visible || !width) return undefined
    let active = true
    let renderTask = null
    setState('loading')

    async function renderPage() {
      try {
        const page = await pdf.getPage(pageNumber)
        if (!active) return
        const baseViewport = page.getViewport({ scale: 1 })
        const cssWidth = Math.max(140, width * Math.max(0.75, scale))
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        const viewport = page.getViewport({ scale: Math.max(0.25, (cssWidth / baseViewport.width) * pixelRatio) })
        const canvas = canvasRef.current
        if (!canvas || !active) return
        canvas.width = Math.max(1, Math.floor(viewport.width))
        canvas.height = Math.max(1, Math.floor(viewport.height))
        canvas.style.width = `${Math.max(1, Math.floor(viewport.width / pixelRatio))}px`
        canvas.style.height = `${Math.max(1, Math.floor(viewport.height / pixelRatio))}px`
        const context = canvas.getContext('2d', { alpha: false })
        renderTask = page.render({ canvasContext: context, viewport })
        await renderTask.promise
        if (active) setState('ready')
        page.cleanup()
      } catch (error) {
        if (active && error?.name !== 'RenderingCancelledException') setState('error')
      }
    }

    void renderPage()
    return () => {
      active = false
      renderTask?.cancel?.()
    }
  }, [pdf, pageNumber, visible, width, scale])

  return (
    <section ref={holderRef} className="mx-auto w-full max-w-[900px]">
      {showPageLabel ? <div className="mb-1 text-center text-[10px] text-[var(--shadow-text-secondary)]">{t('webPdfReader.page', { page: pageNumber, total })}</div> : null}
      <div className="flex min-h-[180px] w-full justify-center">
        <div className="relative w-fit overflow-hidden rounded-xl bg-white shadow-sm">
          {visible ? <canvas ref={canvasRef} className={state === 'ready' ? 'block max-w-none' : 'invisible block max-w-none'} /> : null}
          {state === 'loading' ? <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">{t('webPdfReader.loading')}</span> : null}
          {state === 'error' ? <span className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs text-red-600">{t('webPdfReader.failed')}</span> : null}
          {state === 'ready' ? <div className="pointer-events-none absolute inset-x-2 bottom-1.5 select-none truncate text-center text-[8px] font-medium tracking-[0.01em] text-slate-500/35">{watermark}</div> : null}
        </div>
      </div>
    </section>
  )
}

export default function WebPdfReader({ blob = null, url = '', title = 'PDF' }) {
  const { t } = useDisplayTranslation()
  const rootRef = useRef(null)
  const surfaceRef = useRef(null)
  const pageRefs = useRef([])
  const pinchRef = useRef({ distance: 0, zoom: 1 })
  const lastTapRef = useRef(0)
  const hideTimerRef = useRef(null)
  const nativeFullscreenRef = useRef(false)
  const [view, setView] = useState({ loading: true, pdf: null, pages: 0, error: '' })
  const [zoom, setZoom] = useState(1)
  const [immersive, setImmersive] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const watermark = useMemo(() => readerWatermark(), [])

  useEffect(() => {
    let active = true
    let loadingTask = null
    let documentRef = null
    setView({ loading: true, pdf: null, pages: 0, error: '' })

    async function open() {
      try {
        const library = await loadPdfJs()
        if (!active) return
        let source
        if (blob instanceof Blob && blob.size) {
          source = { data: new Uint8Array(await blob.arrayBuffer()) }
        } else if (/^https?:\/\//i.test(String(url || ''))) {
          source = { url, withCredentials: false }
        } else {
          throw new Error('PDF source missing')
        }
        loadingTask = library.getDocument(source)
        documentRef = await loadingTask.promise
        if (!active) return
        pageRefs.current = []
        setCurrentPage(1)
        setZoom(1)
        setView({ loading: false, pdf: documentRef, pages: documentRef.numPages, error: '' })
      } catch (error) {
        if (active) setView({ loading: false, pdf: null, pages: 0, error: error?.message || t('webPdfReader.failed') })
      }
    }

    void open()
    return () => {
      active = false
      loadingTask?.destroy?.()
      documentRef?.destroy?.()
    }
  }, [blob, url])

  useEffect(() => {
    const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null
    const onFullscreenChange = () => {
      if (nativeFullscreenRef.current && !fullscreenElement()) {
        nativeFullscreenRef.current = false
        setImmersive(false)
        setControlsVisible(true)
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (!immersive) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [immersive])

  useEffect(() => {
    if (!immersive || !controlsVisible) return undefined
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3500)
    return () => window.clearTimeout(hideTimerRef.current)
  }, [immersive, controlsVisible, currentPage, zoom])

  useEffect(() => {
    const node = surfaceRef.current
    if (!node) return undefined

    const start = (event) => {
      if (event.touches.length !== 2) return
      pinchRef.current = { distance: touchDistance(event.touches), zoom }
    }

    const move = (event) => {
      if (event.touches.length !== 2 || !pinchRef.current.distance) return
      event.preventDefault()
      const distance = touchDistance(event.touches)
      if (!distance) return
      const next = clampZoom(pinchRef.current.zoom * (distance / pinchRef.current.distance))
      setZoom((current) => Math.abs(current - next) >= 0.015 ? next : current)
    }

    const end = (event) => {
      if (event.touches.length < 2) pinchRef.current.distance = 0
    }

    node.addEventListener('touchstart', start, { passive: true })
    node.addEventListener('touchmove', move, { passive: false })
    node.addEventListener('touchend', end, { passive: true })
    node.addEventListener('touchcancel', end, { passive: true })
    return () => {
      node.removeEventListener('touchstart', start)
      node.removeEventListener('touchmove', move)
      node.removeEventListener('touchend', end)
      node.removeEventListener('touchcancel', end)
    }
  }, [zoom, immersive, view.pdf])

  const zoomLabel = useMemo(() => `${Math.round(zoom * 100)}%`, [zoom])

  const handleVisible = useCallback((pageNumber) => {
    setCurrentPage(pageNumber)
  }, [])

  const registerPage = useCallback((pageNumber, node) => {
    pageRefs.current[pageNumber - 1] = node
  }, [])

  function scrollToPage(page) {
    const safePage = Math.min(Math.max(page, 1), view.pages || 1)
    const node = pageRefs.current[safePage - 1]
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
    setCurrentPage(safePage)
    if (immersive) setControlsVisible(true)
  }

  async function enterImmersive() {
    setImmersive(true)
    setControlsVisible(true)
    const node = rootRef.current
    const request = node?.requestFullscreen || node?.webkitRequestFullscreen
    if (!request) return
    try {
      await request.call(node)
      nativeFullscreenRef.current = true
    } catch {
      nativeFullscreenRef.current = false
    }
  }

  async function exitImmersive() {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || null
    const exit = document.exitFullscreen || document.webkitExitFullscreen
    if (fullscreenElement && exit) {
      try {
        await exit.call(document)
      } catch {}
    }
    nativeFullscreenRef.current = false
    setImmersive(false)
    setControlsVisible(true)
  }

  function handleViewerTap(event) {
    if (!immersive || event.target?.closest?.('[data-reader-control="true"]')) return
    const now = Date.now()
    if (now - lastTapRef.current <= 330) {
      setControlsVisible((value) => !value)
      lastTapRef.current = 0
      return
    }
    lastTapRef.current = now
  }

  function NormalControls() {
    return (
      <div data-reader-control="true" className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-2.5 py-2">
        <span className="min-w-0 truncate text-[11px] font-medium text-[var(--shadow-text-secondary)]">{t('webPdfReader.page', { page: currentPage, total: view.pages })}</span>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => setZoom((value) => clampZoom(value - 0.15))} aria-label={t('webPdfReader.zoomOut')} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)]"><Minus size={15} /></button>
          <button type="button" onClick={() => setZoom(1)} className="min-w-[58px] rounded-full border border-[var(--shadow-border)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--shadow-text-primary)]">{zoomLabel}</button>
          <button type="button" onClick={() => setZoom((value) => clampZoom(value + 0.15))} aria-label={t('webPdfReader.zoomIn')} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)]"><Plus size={15} /></button>
          <button type="button" onClick={enterImmersive} aria-label={t('webPdfReader.fullView')} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)]"><Maximize2 size={15} /></button>
        </div>
      </div>
    )
  }

  function ImmersiveControls() {
    return (
      <>
        <div data-reader-control="true" className={`fixed inset-x-0 top-0 z-[10001] transition-opacity duration-200 ${controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`} style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
          <div className="mx-auto flex w-[calc(100%-16px)] max-w-[980px] items-center gap-2 rounded-2xl bg-black/70 px-2.5 py-2 text-white shadow-lg backdrop-blur-md">
            <button type="button" onClick={exitImmersive} aria-label={t('webPdfReader.exitFullView')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"><ChevronLeft size={20} /></button>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold">{title}</div>
              <div className="text-[10px] text-white/70">{t('webPdfReader.page', { page: currentPage, total: view.pages })}</div>
            </div>
            <button type="button" onClick={exitImmersive} aria-label={t('webPdfReader.exitFullView')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"><Minimize2 size={17} /></button>
          </div>
        </div>
        <div data-reader-control="true" className={`fixed inset-x-0 bottom-0 z-[10001] transition-opacity duration-200 ${controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`} style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
          <div className="mx-auto flex w-fit max-w-[calc(100%-16px)] items-center gap-1 rounded-full bg-black/70 px-2 py-1.5 text-white shadow-lg backdrop-blur-md">
            <button type="button" onClick={() => scrollToPage(currentPage - 1)} className="flex h-9 w-9 items-center justify-center rounded-full"><ChevronLeft size={17} /></button>
            <button type="button" onClick={() => setZoom((value) => clampZoom(value - 0.15))} aria-label={t('webPdfReader.zoomOut')} className="flex h-9 w-9 items-center justify-center rounded-full"><Minus size={17} /></button>
            <button type="button" onClick={() => setZoom(1)} className="min-w-[58px] rounded-full px-2.5 py-2 text-[11px] font-semibold">{zoomLabel}</button>
            <button type="button" onClick={() => setZoom((value) => clampZoom(value + 0.15))} aria-label={t('webPdfReader.zoomIn')} className="flex h-9 w-9 items-center justify-center rounded-full"><Plus size={17} /></button>
            <button type="button" onClick={() => scrollToPage(currentPage + 1)} className="flex h-9 w-9 items-center justify-center rounded-full"><ChevronRight size={17} /></button>
          </div>
        </div>
      </>
    )
  }

  if (view.loading) return <p role="status" className="rounded-xl border border-[var(--shadow-border)] p-4 text-sm text-[var(--shadow-text-secondary)]">{t('webPdfReader.loading')}</p>
  if (view.error || !view.pdf) return <p role="alert" className="rounded-xl border border-[var(--shadow-border)] p-4 text-sm text-[var(--shadow-warning)]">{view.error || t('webPdfReader.failed')}</p>

  return (
    <div ref={rootRef} className={immersive ? 'fixed inset-0 z-[9999] bg-[#eef1f5]' : 'w-full'}>
      {!immersive ? <div className="mb-3 truncate text-sm font-semibold text-[var(--shadow-text-primary)]">{title}</div> : null}
      {!immersive ? <NormalControls /> : null}
      <div
        ref={surfaceRef}
        onClick={handleViewerTap}
        className={immersive ? 'h-full w-full overflow-auto bg-[#eef1f5] px-2 pb-20 pt-16 sm:px-4' : 'w-full overflow-x-auto rounded-2xl bg-[var(--shadow-bg-soft)] p-2 sm:p-3'}
        style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}
      >
        {immersive ? <ImmersiveControls /> : null}
        <div className="space-y-4">
          {Array.from({ length: view.pages }, (_, index) => (
            <PdfPage
              key={index + 1}
              pdf={view.pdf}
              pageNumber={index + 1}
              total={view.pages}
              scale={zoom}
              onVisible={handleVisible}
              registerPage={registerPage}
              watermark={watermark}
              showPageLabel={!immersive}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Minus, Plus } from 'lucide-react'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const PDFJS_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'
const PDFJS_WORKER_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

let pdfJsPromise = null

registerTranslationNamespace('webPdfReader', {
  en: { loading: 'Opening PDF…', failed: 'Unable to display this PDF.', page: 'Page {{page}} of {{total}}', fullView: 'Full View', exitFullView: 'Exit Full View', zoomIn: 'Zoom in', zoomOut: 'Zoom out', fitWidth: 'Fit width', controls: 'Controls' },
  km: { loading: 'កំពុងបើក PDF…', failed: 'មិនអាចបង្ហាញ PDF នេះបានទេ។', page: 'ទំព័រ {{page}} នៃ {{total}}', fullView: 'មើលពេញអេក្រង់', exitFullView: 'បិទមើលពេញអេក្រង់', zoomIn: 'ពង្រីក', zoomOut: 'បង្រួម', fitWidth: 'សមទទឹង', controls: 'មុខងារ' },
  zh: { loading: '正在打开 PDF…', failed: '无法显示此 PDF。', page: '第 {{page}} 页，共 {{total}} 页', fullView: '全屏查看', exitFullView: '退出全屏', zoomIn: '放大', zoomOut: '缩小', fitWidth: '适合宽度', controls: '控制' },
  ja: { loading: 'PDF を開いています…', failed: 'この PDF を表示できません。', page: '{{total}} ページ中 {{page}} ページ', fullView: '全画面表示', exitFullView: '全画面を閉じる', zoomIn: '拡大', zoomOut: '縮小', fitWidth: '幅に合わせる', controls: '操作' },
  ko: { loading: 'PDF 여는 중…', failed: '이 PDF를 표시할 수 없습니다.', page: '{{total}}페이지 중 {{page}}페이지', fullView: '전체 화면', exitFullView: '전체 화면 닫기', zoomIn: '확대', zoomOut: '축소', fitWidth: '너비 맞춤', controls: '컨트롤' },
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

function PdfPage({ pdf, pageNumber, total, scale, onVisible, pageRef }) {
  const { t } = useDisplayTranslation()
  const holderRef = useRef(null)
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const [state, setState] = useState('idle')

  useEffect(() => {
    const node = holderRef.current
    if (!node) return undefined
    if (typeof pageRef === 'function') pageRef(node)
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      onVisible?.(pageNumber)
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true)
        onVisible?.(pageNumber)
      }
    }, { rootMargin: '900px 0px', threshold: 0.25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [pageNumber, onVisible, pageRef])

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
        const cssWidth = Math.max(140, width * Math.max(0.6, scale))
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
      <div className="mb-1 text-center text-[10px] text-[var(--shadow-text-secondary)]">{t('webPdfReader.page', { page: pageNumber, total })}</div>
      <div className="relative flex min-h-[180px] w-full items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
        {visible ? <canvas ref={canvasRef} className={state === 'ready' ? 'block max-w-none' : 'invisible block max-w-none'} /> : null}
        {state === 'loading' ? <span className="absolute text-xs text-slate-400">{t('webPdfReader.loading')}</span> : null}
        {state === 'error' ? <span className="px-3 py-8 text-center text-xs text-red-600">{t('webPdfReader.failed')}</span> : null}
      </div>
    </section>
  )
}

export default function WebPdfReader({ blob = null, url = '', title = 'PDF' }) {
  const { t } = useDisplayTranslation()
  const [view, setView] = useState({ loading: true, pdf: null, pages: 0, error: '' })
  const [zoom, setZoom] = useState(1)
  const [immersive, setImmersive] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const lastTapRef = useRef(0)
  const hideTimerRef = useRef(null)
  const pageRefs = useRef([])

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
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 2400)
    return () => window.clearTimeout(hideTimerRef.current)
  }, [immersive, controlsVisible, currentPage, zoom])

  const zoomLabel = useMemo(() => `${Math.round(zoom * 100)}%`, [zoom])

  function clampZoom(next) {
    return Math.min(2.4, Math.max(0.75, Number(next) || 1))
  }

  function scrollToPage(page) {
    const safePage = Math.min(Math.max(page, 1), view.pages || 1)
    const node = pageRefs.current[safePage - 1]
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setCurrentPage(safePage)
    setControlsVisible(true)
  }

  function handleViewerTap(event) {
    if (event.target?.closest?.('[data-reader-control="true"]')) return
    const now = Date.now()
    if (now - lastTapRef.current < 320) {
      setControlsVisible((value) => !value)
      lastTapRef.current = 0
      return
    }
    lastTapRef.current = now
    if (immersive) setControlsVisible(true)
  }

  function ReaderControls({ full = false }) {
    return (
      <div data-reader-control="true" className={full ? `fixed inset-x-0 top-0 z-[120] transition-opacity ${controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}` : 'mb-3 flex items-center justify-between gap-2'}>
        <div className={full ? 'mx-auto mt-2 flex w-[calc(100%-16px)] max-w-[980px] items-center justify-between rounded-2xl bg-black/70 px-2 py-2 text-white shadow-lg backdrop-blur' : 'flex w-full items-center justify-between gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-3 py-2'}>
          <div className="flex items-center gap-2">
            {full ? <button type="button" onClick={() => setImmersive(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-white"><Minimize2 size={18} /></button> : <button type="button" onClick={() => setImmersive(true)} className="flex items-center gap-1 rounded-full border border-[var(--shadow-border)] px-3 py-1.5 text-[12px] font-semibold text-[var(--shadow-text-primary)]"><Maximize2 size={15} />{t('webPdfReader.fullView')}</button>}
            <span className={full ? 'text-xs font-medium text-white/90' : 'text-xs font-medium text-[var(--shadow-text-secondary)]'}>{t('webPdfReader.page', { page: currentPage, total: view.pages })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => scrollToPage(currentPage - 1)} className={full ? 'flex h-9 w-9 items-center justify-center rounded-full text-white' : 'flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)]'}><ChevronLeft size={16} /></button>
            <button type="button" onClick={() => setZoom((value) => clampZoom(value - 0.15))} className={full ? 'flex h-9 w-9 items-center justify-center rounded-full text-white' : 'flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)]'}><Minus size={16} /></button>
            <button type="button" onClick={() => setZoom(1)} className={full ? 'rounded-full px-3 py-2 text-xs font-semibold text-white' : 'rounded-full border border-[var(--shadow-border)] px-3 py-1.5 text-[12px] font-semibold text-[var(--shadow-text-primary)]'}>{full ? zoomLabel : t('webPdfReader.fitWidth')}</button>
            <button type="button" onClick={() => setZoom((value) => clampZoom(value + 0.15))} className={full ? 'flex h-9 w-9 items-center justify-center rounded-full text-white' : 'flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)]'}><Plus size={16} /></button>
            <button type="button" onClick={() => scrollToPage(currentPage + 1)} className={full ? 'flex h-9 w-9 items-center justify-center rounded-full text-white' : 'flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)]'}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    )
  }

  if (view.loading) return <p role="status" className="rounded-xl border border-[var(--shadow-border)] p-4 text-sm text-[var(--shadow-text-secondary)]">{t('webPdfReader.loading')}</p>
  if (view.error || !view.pdf) return <p role="alert" className="rounded-xl border border-[var(--shadow-border)] p-4 text-sm text-[var(--shadow-warning)]">{view.error || t('webPdfReader.failed')}</p>

  const content = (
    <div className="w-full" onClick={handleViewerTap}>
      {!immersive ? <div className="mb-3 truncate text-sm font-semibold text-[var(--shadow-text-primary)]">{title}</div> : null}
      {!immersive ? <ReaderControls /> : null}
      <div className={immersive ? 'fixed inset-0 z-[110] overflow-y-auto bg-[#eef1f5] px-2 pb-10 pt-16 sm:px-4' : 'space-y-4 rounded-2xl bg-[var(--shadow-bg-soft)] p-2 sm:p-3'}>
        {immersive ? <ReaderControls full /> : null}
        <div className="space-y-4">
          {Array.from({ length: view.pages }, (_, index) => (
            <PdfPage
              key={index + 1}
              pdf={view.pdf}
              pageNumber={index + 1}
              total={view.pages}
              scale={zoom}
              onVisible={setCurrentPage}
              pageRef={(node) => { pageRefs.current[index] = node }}
            />
          ))}
        </div>
        {immersive ? <div className={`fixed inset-x-0 bottom-3 z-[120] transition-opacity ${controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}><div className="mx-auto flex w-fit max-w-[90%] items-center justify-center rounded-full bg-black/55 px-4 py-2 text-[11px] text-white/85 backdrop-blur">{title}</div></div> : null}
      </div>
    </div>
  )

  return content
}

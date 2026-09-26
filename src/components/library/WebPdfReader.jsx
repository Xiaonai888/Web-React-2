import { useEffect, useRef, useState } from 'react'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const PDFJS_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'
const PDFJS_WORKER_SRC = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

let pdfJsPromise = null

registerTranslationNamespace('webPdfReader', {
  en: { loading: 'Opening PDF…', failed: 'Unable to display this PDF.', page: 'Page {{page}} of {{total}}' },
  km: { loading: 'កំពុងបើក PDF…', failed: 'មិនអាចបង្ហាញ PDF នេះបានទេ។', page: 'ទំព័រ {{page}} នៃ {{total}}' },
  zh: { loading: '正在打开 PDF…', failed: '无法显示此 PDF。', page: '第 {{page}} 页，共 {{total}} 页' },
  ja: { loading: 'PDF を開いています…', failed: 'この PDF を表示できません。', page: '{{total}} ページ中 {{page}} ページ' },
  ko: { loading: 'PDF 여는 중…', failed: '이 PDF를 표시할 수 없습니다.', page: '{{total}}페이지 중 {{page}}페이지' },
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

function PdfPage({ pdf, pageNumber, total }) {
  const { t } = useDisplayTranslation()
  const holderRef = useRef(null)
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const [state, setState] = useState('idle')

  useEffect(() => {
    const node = holderRef.current
    if (!node) return undefined
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setVisible(true)
    }, { rootMargin: '900px 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

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
        const cssWidth = Math.min(width, baseViewport.width)
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        const scale = Math.max(0.25, (cssWidth / baseViewport.width) * pixelRatio)
        const viewport = page.getViewport({ scale })
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
  }, [pdf, pageNumber, visible, width])

  return (
    <section ref={holderRef} className="mx-auto w-full max-w-[900px]">
      <div className="mb-1 text-center text-[10px] text-[var(--shadow-text-secondary)]">{t('webPdfReader.page', { page: pageNumber, total })}</div>
      <div className="flex min-h-[180px] w-full items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
        {visible ? <canvas ref={canvasRef} className={state === 'ready' ? 'block max-w-full' : 'invisible block max-w-full'} /> : null}
        {state === 'loading' ? <span className="absolute text-xs text-slate-400">{t('webPdfReader.loading')}</span> : null}
        {state === 'error' ? <span className="px-3 py-8 text-center text-xs text-red-600">{t('webPdfReader.failed')}</span> : null}
      </div>
    </section>
  )
}

export default function WebPdfReader({ blob = null, url = '', title = 'PDF' }) {
  const { t } = useDisplayTranslation()
  const [view, setView] = useState({ loading: true, pdf: null, pages: 0, error: '' })

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

  if (view.loading) return <p role="status" className="rounded-xl border border-[var(--shadow-border)] p-4 text-sm text-[var(--shadow-text-secondary)]">{t('webPdfReader.loading')}</p>
  if (view.error || !view.pdf) return <p role="alert" className="rounded-xl border border-[var(--shadow-border)] p-4 text-sm text-[var(--shadow-warning)]">{view.error || t('webPdfReader.failed')}</p>

  return (
    <div className="w-full">
      <div className="mb-3 truncate text-sm font-semibold text-[var(--shadow-text-primary)]">{title}</div>
      <div className="space-y-4 rounded-2xl bg-[var(--shadow-bg-soft)] p-2 sm:p-3">
        {Array.from({ length: view.pages }, (_, index) => <PdfPage key={index + 1} pdf={view.pdf} pageNumber={index + 1} total={view.pages} />)}
      </div>
    </div>
  )
}

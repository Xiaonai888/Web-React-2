import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatFileSize } from '../../utils/mangaImageUtils'

function safeBytes(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, number) : 0
}

function totalForPage(page) {
  return safeBytes(page.uploadTotalBytes || page.fileSize || page.sourceFile?.size || 0)
}

const STAGE_LABELS = {
  queue: 'Waiting in local upload queue',
  prepare: 'Reading or converting image on device',
  read: 'Reading image on device',
  convert: 'Converting image format',
  init: 'Backend: requesting upload session',
  put: 'Cloudflare R2: uploading image',
  verify: 'Backend: verifying R2 image',
  finalize: 'Backend: finalizing upload',
  storage: 'Backend: checking R2 configuration',
  worker: 'Server: processing image',
  process: 'Server: processing image',
  status: 'Backend: checking processing job',
  auth: 'Account or upload authorization',
  complete: 'Completed',
  upload: 'Uploading image',
}

function parseUploadError(value) {
  const raw = String(value || '').trim()
  if (!raw) return null
  const match = raw.match(/\[([a-z][a-z\d_-]*):\s*([A-Z\d_]+)\]/i)
  const code = String(match?.[2] || 'MANGA_UPLOAD_FAILED').toUpperCase()
  const stage = String(match?.[1] || 'unknown').toLowerCase()
  const uncertain = raw.includes('[MANGA_UPLOAD_UNCERTAIN]')
  const message = raw.replace(/\[MANGA_UPLOAD_UNCERTAIN\]/gi, '').replace(/\[[a-z][a-z\d_-]*:\s*[A-Z\d_]+\]/gi, '').trim()
  return { stage, code, message: message || 'Upload failed', uncertain }
}

function errorAdvice(code, uncertain) {
  if (uncertain) return 'Upload result is not confirmed. Check server processing status before retrying, to avoid duplicate uploads.'
  if (code === 'MANGA_DIRECT_UNAVAILABLE') return 'Backend reported incomplete R2 storage configuration. Verify the environment on the running Backend deployment.'
  if (code === 'MANGA_DIRECT_DISABLED') return 'Backend direct-upload feature flag is disabled.'
  if (/MANGA_DIRECT_PUT_NETWORK_ERROR|MANGA_DIRECT_PUT_FAILED/.test(code)) return 'The device could not complete the R2 request. Check connectivity and R2 CORS settings.'
  if (/MANGA_DIRECT_INIT_NETWORK_ERROR|MANGA_DIRECT_FINALIZE_NETWORK_ERROR/.test(code)) return 'The browser could not reach the Backend. Check connectivity and Backend logs.'
  if (code === 'MANGA_DIRECT_RATE_LIMIT') return 'Too many upload sessions were created in a short period. Avoid repeated taps and try later.'
  if (/TOKEN_INVALID|UNAUTHORIZED|OWNER_MISMATCH/.test(code)) return 'Session or account mismatch. Sign in with the original author account.'
  if (/MANGA_PROCESSING_TIMEOUT|MANGA_DIRECT_FINALIZE_TIMEOUT/.test(code)) return 'The final server result is unknown. Check job status before retrying.'
  if (/MANGA_DIRECT_PUT_4\d\d|MANGA_DIRECT_PUT_5\d\d/.test(code)) return 'R2 returned an HTTP error. Check its status code and the upload policy.'
  if (/IMAGE_FILE_READ|HEIC_CONVERSION|HEIC_PREVIEW|MANGA_DIRECT_TYPE_UNSUPPORTED/.test(code)) return 'The device could not prepare this image format. Check the original file.'
  if (/MANGA_JOB_ID_MISSING|MANGA_DIRECT_JOB_MISSING/.test(code)) return 'Backend did not return a valid processing job. Inspect Backend finalize response.'
  if (code === 'IMAGE_URL_MISSING') return 'The job finished without an image URL. Inspect the worker result.'
  if (/MANGA_PROCESSING_FAILED|MANGA_DIRECT_JOB_LOOKUP_FAILED/.test(code)) return 'Server worker or database reported a problem. Check processing job logs.'
  return 'Use the stage, code and message to locate the failing request in Backend logs.'
}

function fallbackStage(page) {
  if (page?.status === 'done') return 'complete'
  if (page?.serverProcessing) return 'worker'
  if (page?.status === 'processing') return 'prepare'
  if (page?.status === 'uploading') return 'put'
  return 'queue'
}

export function mangaTransferPercent(pages) {
  const items = Array.isArray(pages) ? pages : []
  const total = items.reduce((sum, page) => sum + totalForPage(page), 0)
  if (!total) return 0
  const transferred = items.reduce((sum, page) => {
    const size = totalForPage(page)
    const fraction = page.status === 'done'
      ? 1
      : page.status === 'uploading'
        ? Math.max(0, Math.min(99, safeBytes(page.progress))) / 100
        : 0
    return sum + size * fraction
  }, 0)
  return Math.max(0, Math.min(100, Math.round(transferred * 100 / total)))
}

export function MangaUploadInlineStatus({ pages }) {
  const items = Array.isArray(pages) ? pages : []
  const [diagnostics, setDiagnostics] = useState({})
  const [now, setNow] = useState(Date.now())
  const [copyStatus, setCopyStatus] = useState('')
  const ids = items.map((page) => String(page.id)).join('|')
  const isUploading = items.some((page) => ['queued', 'processing', 'uploading'].includes(page.status))
  const completed = items.filter((page) => page.status === 'done').length
  const failed = items.map((page, index) => ({ page, index, error: parseUploadError(page.error) }))
    .filter(({ page }) => page.status === 'error')
  const percent = mangaTransferPercent(items)

  useEffect(() => {
    if (!ids || typeof window === 'undefined') return undefined
    const pageIds = new Set(ids.split('|'))
    const onDiagnostic = (event) => {
      const detail = event?.detail
      if (!pageIds.has(String(detail?.pageId || ''))) return
      setDiagnostics((previous) => ({
        ...previous,
        [String(detail.pageId)]: {
          stage: String(detail.stage || 'queue'),
          code: String(detail.code || ''),
          message: String(detail.message || ''),
          status: String(detail.status || ''),
          at: Number(detail.at || Date.now()),
        },
      }))
    }
    window.addEventListener('shadow-manga-upload-diagnostic', onDiagnostic)
    const interval = window.setInterval(() => setNow(Date.now()), 10000)
    return () => {
      window.removeEventListener('shadow-manga-upload-diagnostic', onDiagnostic)
      window.clearInterval(interval)
    }
  }, [ids])

  if (!items.length || (!isUploading && !failed.length)) return null

  const active = items.find((page) => page.status === 'uploading') ||
    items.find((page) => page.status === 'processing') ||
    items.find((page) => page.status === 'queued')
  const activeDiagnostic = active && diagnostics[String(active.id)]
  const stage = activeDiagnostic?.stage || fallbackStage(active)
  const seconds = activeDiagnostic?.at ? Math.max(0, Math.floor((now - activeDiagnostic.at) / 1000)) : 0
  const delayed = Boolean(isUploading && active && activeDiagnostic?.at && seconds >= 120 &&
    (stage === 'worker' || stage === 'status' || stage === 'put' || stage === 'init'))

  const copyDetails = async () => {
    const details = [
      `Manga upload: ${completed}/${items.length} ready; transfer ${percent}%`,
      ...items.map((page, index) => {
        const diagnostic = diagnostics[String(page.id)]
        const error = parseUploadError(page.error)
        return `Page ${index + 1}: ${page.status}; stage=${error?.stage || diagnostic?.stage || fallbackStage(page)}; code=${error?.code || diagnostic?.code || 'NONE'}; message=${(error?.message || diagnostic?.message || '').slice(0, 320)}`
      }),
    ].join('\n')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(details)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Copy unavailable on this device')
    }
  }

  return (
    <div className="mt-2 space-y-2 text-left" role="status" aria-live="polite">
      {isUploading ? (
        <div className="rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-2.5">
          <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
            <span>File transfer: {percent}%</span>
            <span>{completed}/{items.length} pages ready</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--shadow-border)]"
            role="progressbar" aria-label="Manga file transfer" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <div className="h-full rounded-full bg-[#7c4dea] transition-all" style={{ width: `${percent}%` }} />
          </div>
          {active ? (
            <p className="mt-2 text-[11px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
              Page {items.indexOf(active) + 1}: {STAGE_LABELS[stage] || stage}
              {activeDiagnostic?.message ? ` — ${activeDiagnostic.message}` : ''}
            </p>
          ) : null}
          {delayed ? (
            <p className="mt-1 text-[11px] font-semibold leading-5 text-[#a56a00]">
              No new progress for {seconds}s. The server may still be processing this image; this is not a confirmed error.
            </p>
          ) : null}
        </div>
      ) : null}
      {failed.length > 0 ? (
        <div className="rounded-[14px] border border-[#fecdca] bg-[#fff3f2] p-3 text-[#912018]">
          <div className="flex items-center justify-between gap-2">
            <strong className="text-[11px]">{failed.length} Manga page(s) failed</strong>
            <button type="button" onClick={copyDetails} className="rounded-md bg-white px-2 py-1.5 text-[10px] font-bold text-[#912018] ring-1 ring-[#fecdca]">
              Copy error
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {failed.map(({ page, index, error }) => {
              const diagnostic = diagnostics[String(page.id)]
              const code = error?.code || diagnostic?.code || 'MANGA_UPLOAD_FAILED'
              const stage = error?.stage && error.stage !== 'unknown' ? error.stage : diagnostic?.stage || 'unknown'
              return (
                <div key={page.id || index} className="break-words text-[11px] leading-5">
                  <p className="font-bold">Page {index + 1} · {STAGE_LABELS[stage] || stage} · {code}</p>
                  <p>{error?.message || diagnostic?.message || page.error || 'The upload failed without a detailed server message.'}</p>
                  <p className="text-[#a33a31]">{errorAdvice(code, Boolean(error?.uncertain))}</p>
                </div>
              )
            })}
          </div>
          {copyStatus ? <p className="mt-2 text-[10px] font-semibold">{copyStatus}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

export default function MangaUploadProgressModal({ pages, onCancel }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const [backgroundAccepted, setBackgroundAccepted] = useState(false)
  const items = Array.isArray(pages) ? pages : []
  const itemIds = items.map((page) => String(page.id)).join('|')
  const batchAccepted = items.some((page) => Boolean(page.serverProcessing) &&
    (page.status === 'processing' || page.status === 'done'))
  const active = items.length > 0 && !backgroundAccepted && !batchAccepted

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const pageIds = new Set(itemIds.split('|'))
    const onAccepted = () => setBackgroundAccepted(true)
    const onDiagnostic = (event) => {
      const detail = event?.detail
      if (!pageIds.has(String(detail?.pageId || ''))) return
      if (detail.stage === 'worker' || detail.status === 'error') setBackgroundAccepted(true)
    }
    window.addEventListener('shadow-manga-r2-accepted', onAccepted)
    window.addEventListener('shadow-manga-upload-diagnostic', onDiagnostic)
    return () => {
      window.removeEventListener('shadow-manga-r2-accepted', onAccepted)
      window.removeEventListener('shadow-manga-upload-diagnostic', onDiagnostic)
    }
  }, [itemIds])

  useEffect(() => {
    if (!active || typeof document === 'undefined') return undefined

    const body = document.body
    const html = document.documentElement
    const scrollY = window.scrollY
    const previousFocus = document.activeElement
    const bodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    }
    const htmlOverflow = html.style.overflow
    const inertElements = Array.from(body.children)
      .filter((element) => element !== overlayRef.current)
      .map((element) => ({ element, inert: element.inert }))

    for (const { element } of inertElements) element.inert = true
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    dialogRef.current?.focus({ preventScroll: true })

    return () => {
      for (const { element, inert } of inertElements) element.inert = inert
      html.style.overflow = htmlOverflow
      for (const [property, value] of Object.entries(bodyStyles)) {
        body.style[property] = value
      }
      window.scrollTo(0, scrollY)
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [active])


  if (!active || typeof document === 'undefined') return null

  const totalBytes = items.reduce((sum, page) => sum + totalForPage(page), 0)
  const uploadedBytes = items.reduce((sum, page) => {
    const total = totalForPage(page)
    if (page.status === 'done') return sum + total
    return sum + Math.min(safeBytes(page.uploadedBytes), total)
  }, 0)

  const completedCount = items.filter((page) => page.status === 'done').length
  const overallPercent = Math.floor((completedCount / items.length) * 100)
  const transferPercent = totalBytes > 0
    ? Math.min(100, Math.round((uploadedBytes / totalBytes) * 100))
    : 0

  const current =
    items.find((page) => page.status === 'uploading') ||
    items.find((page) => page.status === 'processing') ||
    items.find((page) => page.status === 'queued') ||
    items[items.length - 1]

  const serverProcessing = items.some((page) => page.status === 'processing' && page.serverProcessing)
  const hasActiveTasks = items.some((page) => ['queued', 'uploading', 'processing'].includes(page.status))
  const canCancel = !serverProcessing
  const currentTotal = totalForPage(current)
  const currentLoaded = current?.status === 'done'
    ? currentTotal
    : Math.min(safeBytes(current?.uploadedBytes), currentTotal)
  const currentPercent = currentTotal > 0
    ? Math.min(100, Math.round((currentLoaded / currentTotal) * 100))
    : 0
  const currentName = current?.sourceFile?.name || 'Manga page'
  const currentLabel = current?.serverProcessing
    ? 'Processing'
    : current?.status === 'processing'
      ? 'Preparing'
      : current?.status === 'error'
        ? 'Upload failed'
        : current?.status === 'done'
          ? 'Ready'
          : 'Uploading'

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (overallPercent / 100) * circumference

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[260] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/30 px-4 py-4 backdrop-blur-[1px]"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Uploading Manga Pages"
        tabIndex={-1}
        className="my-auto w-full max-w-[360px] max-h-[calc(100dvh-32px)] overflow-y-auto overscroll-contain rounded-[26px] bg-white p-5 shadow-[0_24px_70px_rgba(17,24,39,0.24)] outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#0b5cff]">
              <i className="fa-solid fa-cloud-arrow-up text-[16px]" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-extrabold text-[#111827]">Uploading Manga Pages</h2>
              <p className="mt-1 text-[11px] font-medium text-[#8d94a1]">
                Completed {completedCount} of {items.length} pages
              </p>
            </div>
          </div>
          <button type="button" onClick={onCancel} disabled={!canCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6] disabled:opacity-35"
            aria-label={!hasActiveTasks ? 'Close upload' : canCancel ? 'Cancel Upload' : 'Processing on server'}>
            <i className="fa-solid fa-xmark text-[15px]" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="relative h-[142px] w-[142px]">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#e7eeff" strokeWidth="9" />
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#0b5cff" strokeWidth="9"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                className="transition-all duration-200" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-[30px] font-black leading-none text-[#0b5cff]">{overallPercent}%</div>
              <div className="mt-2 text-[11px] font-bold text-[#555b66]">
                {completedCount} / {items.length} pages ready
              </div>
              <div className="mt-1 text-[10px] font-medium text-[#8d94a1]">
                Server-confirmed completion
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 text-[11px] font-bold text-[#475467]">
            <span>All Manga pages</span>
            <span className="text-[#0b5cff]">{overallPercent}% complete</span>
          </div>
          <div
            role="progressbar"
            aria-label="Overall Manga upload completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={overallPercent}
            className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7eeff]"
          >
            <div className="h-full rounded-full bg-[#0b5cff] transition-all duration-200" style={{ width: `${overallPercent}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[#667085]">
            <span>File transfer: {transferPercent}%</span>
            <span>{formatFileSize(uploadedBytes)} / {formatFileSize(totalBytes)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] bg-[#f5f8ff] p-3.5">
          <p className="mb-2 text-[10.5px] font-bold text-[#667085]">Current page {Math.max(1, items.indexOf(current) + 1)} of {items.length}</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#0b5cff] shadow-sm ring-1 ring-[#dfe8ff]">
              <i className="fa-regular fa-image text-[15px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 truncate text-[11.5px] font-extrabold text-[#111827]">
                  {currentLabel}: {currentName}
                </div>
                <div className="shrink-0 text-[11px] font-extrabold text-[#0b5cff]">{currentPercent}%</div>
              </div>
              <div className="mt-1 text-[10.5px] font-medium text-[#667085]">
                {formatFileSize(currentLoaded)} / {formatFileSize(currentTotal)}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dfe8ff]">
                <div className="h-full rounded-full bg-[#0b5cff] transition-all duration-200"
                  style={{ width: `${currentPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <button type="button" onClick={onCancel} disabled={!canCancel}
          className="mt-5 h-12 w-full rounded-[14px] bg-[#FE526E] text-[13px] font-extrabold text-white shadow-[0_10px_24px_rgba(254,82,110,0.24)] active:scale-[0.99] disabled:opacity-55">
          {!hasActiveTasks ? 'Close upload' : canCancel ? 'Cancel Upload' : 'Processing on server...'}
        </button>
      </div>
    </div>,
    document.body
  )
}

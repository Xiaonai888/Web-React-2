import { useEffect, useRef, useState } from 'react'
import { Camera, ChevronLeft, FileImage, ScanText } from 'lucide-react'
import { recognizeShadowDocsImage } from './ShadowDocsScanTextEngine'

const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const MAX_SCANNED_TEXT_LENGTH = 20000

function normalizeScannedText(value) {
  return (typeof value === 'string' ? value : '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .slice(0, MAX_SCANNED_TEXT_LENGTH)
}

export default function ShadowDocsMobileScanTextPanel({ disabled = false, onBack, onInsert }) {
  const galleryRef = useRef(null)
  const cameraRef = useRef(null)
  const busyRef = useRef(false)
  const mountedRef = useRef(true)
  const [file, setFile] = useState(null)
  const previewRef = useRef(null)
  const [previewError, setPreviewError] = useState('')
  const [language, setLanguage] = useState('eng+khm')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    const canvas = previewRef.current
    if (!file || !canvas) return undefined

    let cancelled = false
    if (typeof createImageBitmap !== 'function') {
      setPreviewError('Image preview is unavailable on this device. Scanning still works.')
      return undefined
    }

    createImageBitmap(file).then(bitmap => {
      try {
        if (cancelled) return
        if (!bitmap.width || !bitmap.height) throw new Error('Invalid image dimensions')
        const availableWidth = Math.max(1, Math.min(canvas.parentElement?.clientWidth || 640, 640))
        const scale = Math.min(1, availableWidth / bitmap.width, 180 / bitmap.height)
        const width = Math.max(1, Math.round(bitmap.width * scale))
        const height = Math.max(1, Math.round(bitmap.height * scale))
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas preview unavailable')
        context.drawImage(bitmap, 0, 0, width, height)
      } catch {
        if (!cancelled) setPreviewError('Could not preview this image. You can still scan it.')
      } finally {
        bitmap.close?.()
      }
    }).catch(() => {
      if (!cancelled) setPreviewError('Could not preview this image. You can still scan it.')
    })

    return () => {
      cancelled = true
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [file])

  function chooseFile(event) {
    const chosen = event.target.files?.[0]
    event.target.value = ''
    if (!chosen || busyRef.current) return
    setError('')
    setPreviewError('')
    setText('')
    setProgress(0)
    setStatus('')
    if (!IMAGE_TYPES.has(chosen.type) || chosen.size === 0 || chosen.size > 6_000_000) {
      setFile(null)
      setError('Choose a PNG, JPG or WebP image under 6 MB.')
      return
    }
    setFile(chosen)
  }

  async function scan() {
    if (!file || disabled || busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setError('')
    setProgress(0)
    setStatus('Preparing OCR')
    try {
      const extracted = await recognizeShadowDocsImage(file, language, state => {
        if (!mountedRef.current) return
        setProgress(state.progress)
        setStatus(state.status)
      })
      if (mountedRef.current) {
        setText(normalizeScannedText(extracted))
        setProgress(100)
        setStatus('Text extracted')
      }
    } catch (failure) {
      if (mountedRef.current) setError(failure instanceof Error ? failure.message : 'Could not scan this image.')
    } finally {
      busyRef.current = false
      if (mountedRef.current) setBusy(false)
    }
  }

  function insertScannedText() {
    if (disabled || busy || busyRef.current || typeof onInsert !== 'function') return
    const plainText = normalizeScannedText(text).trim()
    if (!plainText) return
    onInsert(plainText)
  }

  return <section className="sd-insert-scan-panel" aria-label="Scan Text">
    <style>{`
      .sd-insert-scan-panel{display:grid;gap:12px;color:#ececec;padding-bottom:25px}
      .sd-insert-scan-select{width:100%;min-height:42px;border:1px solid #555;background:#383838;color:#fff;border-radius:9px;padding:8px}
      .sd-insert-scan-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .sd-insert-scan-actions button{border:0;border-radius:10px;background:#424242;color:#fff;min-height:46px;display:flex;align-items:center;justify-content:center;gap:7px}
      .sd-insert-scan-preview{display:block;max-width:100%;max-height:180px;width:auto;height:auto;object-fit:contain;border:1px solid #444;border-radius:9px;background:#242424;margin:0 auto}
      .sd-insert-scan-panel textarea{width:100%;min-height:150px;border:1px solid #555;border-radius:10px;background:#292929;color:#f5f5f5;padding:12px;font:inherit;font-size:14px;line-height:1.65;resize:vertical}
      .sd-insert-scan-status{font-size:12px;color:#aaa;min-height:18px}
      .sd-insert-scan-error{font-size:12px;color:#ff9b9b}
      .sd-insert-scan-panel button:disabled{opacity:.45}
      .sd-insert-scan-panel button:focus-visible,.sd-insert-scan-panel select:focus-visible,.sd-insert-scan-panel textarea:focus-visible{outline:2px solid #80b8ff;outline-offset:2px}
    `}</style>
    <div className="sd-insert-title">
      <button type="button" disabled={busy} aria-label="Back to Insert" onPointerDown={event => event.preventDefault()} onClick={onBack}><ChevronLeft size={22}/></button>
      Scan Text
    </div>
    <div className="sd-insert-card">
      <label className="sd-insert-setting-row"><span>Text Language</span>
        <select className="sd-insert-scan-select" value={language} disabled={disabled || busy} onChange={event => setLanguage(event.target.value)}>
          <option value="eng+khm">Khmer + English</option>
          <option value="khm">Khmer</option>
          <option value="eng">English</option>
        </select>
      </label>
    </div>
    <div className="sd-insert-scan-actions">
      <button type="button" disabled={disabled || busy} onClick={() => galleryRef.current?.click()}><FileImage size={19}/> Gallery</button>
      <button type="button" disabled={disabled || busy} onClick={() => cameraRef.current?.click()}><Camera size={19}/> Camera</button>
    </div>
    <input type="file" accept="image/png,image/jpeg,image/webp" ref={galleryRef} hidden onChange={chooseFile}/>
    <input type="file" accept="image/*" capture="environment" ref={cameraRef} hidden onChange={chooseFile}/>
    {file ? <canvas ref={previewRef} role="img" aria-label="Image to scan" className="sd-insert-scan-preview" style={previewError ? { display: 'none' } : undefined}/> : null}
    {previewError ? <p className="sd-insert-scan-status" role="status">{previewError}</p> : null}
    <button type="button" className="sd-insert-submit" disabled={!file || disabled || busy} onPointerDown={event => event.preventDefault()} onClick={scan}><ScanText size={20}/> {busy ? 'Scanning…' : 'Extract Text'}</button>
    <div className="sd-insert-scan-status" role="status">{busy ? `${status || 'Scanning'}${progress ? ` · ${progress}%` : ''}` : status}</div>
    {error ? <p className="sd-insert-scan-error" role="alert">{error}</p> : null}
    {text ? <>
      <label htmlFor="sd-insert-scanned-text" className="sd-insert-section-title">Review and edit recognized text</label>
      <textarea id="sd-insert-scanned-text" value={text} maxLength={MAX_SCANNED_TEXT_LENGTH} disabled={disabled || busy} onChange={event => setText(normalizeScannedText(event.target.value))}/>
      <button type="button" className="sd-insert-submit" disabled={disabled || busy || !text.trim()} onPointerDown={event => event.preventDefault()} onClick={insertScannedText}>Insert Text into Document</button>
    </> : null}
    <p className="sd-insert-help">Scanning runs on your device. The first scan downloads the OCR engine and selected language data. No image is uploaded to Shadow servers.</p>
  </section>
}

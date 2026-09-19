import { useEffect, useMemo, useState } from 'react'

const FORMATS = [
  { id: 'png', label: 'PNG', mime: 'image/png', description: 'Lossless · sharp lines and text' },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', description: 'Smaller photo-friendly files' },
  { id: 'webp', label: 'WebP', mime: 'image/webp', description: 'Modern, compact image format' },
]
const SCALES = [25, 50, 75, 100, 150, 200]
const MAX_SIDE = 4096
const MAX_AREA = 12000000

const cleanName = (name) => String(name || 'Paper')
  .trim()
  .replace(/\.(?:png|jpe?g|webp)$/i, '')
  .replace(/[\\/:*?"<>|\x00-\x1f]/g, '-')
  .replace(/^\.+/, '')
  .slice(0, 60).trim() || 'Paper'

function generateBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Image encoding failed. Try a smaller size or PNG.'))
          return
        }
        if (blob.type !== mime) {
          reject(new Error(`${mime === 'image/webp' ? 'WebP' : 'This format'} is not supported in this browser. Choose PNG instead.`))
          return
        }
        resolve(blob)
      }, mime, quality)
    } catch (error) {
      reject(error)
    }
  })
}

export default function StudioExportDialog({ open, paper, canvasRef, onClose, onExported }) {
  const [format, setFormat] = useState('png')
  const [scale, setScale] = useState(100)
  const [customWidth, setCustomWidth] = useState('')
  const [quality, setQuality] = useState(90)
  const [filename, setFilename] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setFormat('png')
    setScale(100)
    setCustomWidth(String(paper?.width || ''))
    setQuality(90)
    setFilename(paper?.name || 'Paper')
    setBusy(false)
    setError('')
  }, [open, paper?.id])

  const dimensions = useMemo(() => {
    const sourceWidth = paper?.width || 1
    const sourceHeight = paper?.height || 1
    const width = scale === 'custom' ? Number(customWidth) : Math.round(sourceWidth * scale / 100)
    const height = Math.round(sourceHeight * width / sourceWidth)
    const valid = Number.isInteger(width) && Number.isInteger(height) && width >= 1 && height >= 1 && width <= MAX_SIDE && height <= MAX_SIDE && width * height <= MAX_AREA
    return { width, height, valid }
  }, [paper?.width, paper?.height, scale, customWidth])

  if (!open || !paper) return null

  async function exportImage(event) {
    event.preventDefault()
    if (busy || !dimensions.valid || !filename.trim()) return
    const canvas = canvasRef.current
    if (!canvas || canvas.width !== paper.width || canvas.height !== paper.height) {
      setError('The current paper is not ready. Close this window and try again.')
      return
    }
    const chosen = FORMATS.find((item) => item.id === format)
    setBusy(true)
    setError('')
    try {
      const output = document.createElement('canvas')
      output.width = dimensions.width
      output.height = dimensions.height
      const ctx = output.getContext('2d')
      if (!ctx) throw new Error('Could not prepare the export canvas.')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      if (format === 'jpeg') {
        ctx.fillStyle = paper.background || '#FFFFFF'
        ctx.fillRect(0, 0, output.width, output.height)
      }
      ctx.drawImage(canvas, 0, 0, output.width, output.height)
      const blob = await generateBlob(output, chosen.mime, format === 'png' ? undefined : quality / 100)
      const url = URL.createObjectURL(blob)
      try {
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${cleanName(filename)}.${format === 'jpeg' ? 'jpg' : format}`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
      } finally {
        setTimeout(() => URL.revokeObjectURL(url), 30000)
      }
      onExported?.(`${chosen.label} download started · ${dimensions.width} × ${dimensions.height}px`)
    } catch (failure) {
      setError(failure?.message || 'Could not export this image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-export-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget && !busy) onClose() }}>
      <style>{`
        .ss-export-backdrop{position:fixed;inset:0;z-index:100100;display:grid;place-items:center;background:rgba(0,0,0,.75);padding:12px}
        .ss-export-dialog{box-sizing:border-box;width:min(480px,100%);max-height:calc(100dvh - 24px);overflow-y:auto;border:1px solid #626d79;border-radius:12px;background:#30353c;color:#f1f5f9;box-shadow:0 22px 60px rgba(0,0,0,.6);font-family:inherit}
        .ss-export-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:17px 18px;border-bottom:1px solid #49535d}
        .ss-export-head h2{margin:0;font-size:17px}
        .ss-export-close{height:30px;width:30px;border:0;border-radius:6px;background:#404852;color:#fff;font:inherit;cursor:pointer}
        .ss-export-body{display:grid;gap:15px;padding:17px 18px}
        .ss-export-field{display:grid;gap:7px;font-size:12px;font-weight:700}
        .ss-export-field input,.ss-export-field select{box-sizing:border-box;width:100%;min-width:0;min-height:37px;border:1px solid #606c79;border-radius:6px;background:#252c34;color:#fff;padding:5px 9px;font:inherit;font-size:13px}
        .ss-export-field input[type=range]{height:30px;padding:0;accent-color:#68affb}
        .ss-export-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
        .ss-export-format{display:flex;min-width:0;min-height:62px;flex-direction:column;justify-content:center;gap:3px;border:1px solid #566474;border-radius:7px;background:#343d48;color:#fff;padding:7px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
        .ss-export-format small{font-size:9px;font-weight:400;line-height:1.4;color:#c0cad5}
        .ss-export-format[aria-pressed=true]{border-color:#88c2fa;background:#345676}
        .ss-export-scales{display:flex;flex-wrap:wrap;gap:6px}
        .ss-export-scales button{min-height:32px;border:1px solid #5e6c7a;border-radius:6px;background:#35404a;color:#f1f5f9;padding:0 10px;font:inherit;font-size:11px;cursor:pointer}
        .ss-export-scales button[aria-pressed=true]{border-color:#89c6ff;background:#365c80}
        .ss-export-scales button:disabled{opacity:.3;cursor:default}
        .ss-export-custom{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .ss-export-custom input{box-sizing:border-box;width:125px;max-width:100%;height:36px;border:1px solid #606c79;border-radius:6px;background:#252c34;color:#fff;padding:5px 9px;font:inherit;font-size:13px}
        .ss-export-custom input:focus-visible{outline:2px solid #7cbcff;outline-offset:1px}
        .ss-export-custom span{font-size:11px;font-weight:400;color:#aebdcd}
        .ss-export-note{margin:0;color:#aebdcd;font-size:11px;line-height:1.5}
        .ss-export-error{margin:0;border-radius:6px;background:#63363b;color:#ffe0e0;padding:9px;font-size:11px}
        .ss-export-actions{display:flex;justify-content:flex-end;gap:8px;padding:13px 18px;border-top:1px solid #49535d}
        .ss-export-actions button{min-height:36px;border:1px solid #667483;border-radius:6px;background:#414a55;color:#fff;padding:0 15px;font:inherit;font-size:12px;cursor:pointer}
        .ss-export-actions button:last-child{border-color:#6db5ff;background:#3679bb;font-weight:800}
        .ss-export-actions button:disabled,.ss-export-format:disabled,.ss-export-close:disabled{opacity:.5;cursor:default}
        @media(max-width:550px){.ss-export-backdrop{align-items:end;padding:0}.ss-export-dialog{width:100%;max-height:90dvh;border-radius:14px 14px 0 0}.ss-export-head,.ss-export-body{padding:13px}.ss-export-actions{padding:12px}}
      `}</style>
      <form className="ss-export-dialog" role="dialog" aria-modal="true" aria-label="Export image" onSubmit={exportImage} onKeyDown={(event) => { if (event.key === 'Escape' && !busy) { event.stopPropagation(); onClose() } }}>
        <div className="ss-export-head"><h2>Export Image</h2><button type="button" className="ss-export-close" aria-label="Close export window" disabled={busy} onClick={onClose}>×</button></div>
        <div className="ss-export-body">
          <label className="ss-export-field">File name<input type="text" maxLength={80} required value={filename} disabled={busy} onChange={(event) => setFilename(event.target.value)} /></label>
          <div className="ss-export-field"><span>Image format</span><div className="ss-export-options">{FORMATS.map((item) => <button key={item.id} type="button" className="ss-export-format" aria-pressed={format === item.id} disabled={busy} onClick={() => setFormat(item.id)}>{item.label}<small>{item.description}</small></button>)}</div></div>
          <div className="ss-export-field">
            <span>Output size</span>
            <div className="ss-export-scales">{SCALES.map((percent) => { const w = Math.round(paper.width * percent / 100); const h = Math.round(paper.height * percent / 100); return <button type="button" key={percent} disabled={busy || w > MAX_SIDE || h > MAX_SIDE || w * h > MAX_AREA} aria-pressed={scale === percent} onClick={() => setScale(percent)}>{percent}%</button> })}<button type="button" disabled={busy} aria-pressed={scale === 'custom'} onClick={() => setScale('custom')}>Custom</button></div>
            {scale === 'custom' ? <label className="ss-export-custom">Width (px)<input type="number" min="1" max={MAX_SIDE} step="1" inputMode="numeric" value={customWidth} disabled={busy} onChange={(event) => setCustomWidth(event.target.value)} /><span>Height adjusts automatically · original aspect ratio</span></label> : null}
            <p className="ss-export-note">{dimensions.valid ? `${dimensions.width.toLocaleString()} × ${dimensions.height.toLocaleString()} px` : 'Enter a supported output size'} · Maximum 4096 px per side / 12 million pixels</p>
          </div>
          {format !== 'png' ? <label className="ss-export-field">Quality · {quality}%<input type="range" min="50" max="100" step="1" value={quality} disabled={busy} onChange={(event) => setQuality(Number(event.target.value))} /></label> : null}
          <p className="ss-export-note">Only the drawing is exported. Canvas Grid and other on-screen guides are not included. Export does not modify your saved project.</p>
          {!dimensions.valid ? <p className="ss-export-error" role="alert">Enter a whole-pixel width that keeps both dimensions within 4096 px and the output within 12 million pixels.</p> : null}
          {error ? <p className="ss-export-error" role="alert">{error}</p> : null}
        </div>
        <div className="ss-export-actions"><button type="button" disabled={busy} onClick={onClose}>Cancel</button><button type="submit" disabled={busy || !dimensions.valid || !filename.trim()}>{busy ? 'Exporting…' : `Export ${format.toUpperCase()}`}</button></div>
      </form>
    </div>
  )
}

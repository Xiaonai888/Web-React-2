import { useEffect, useMemo, useRef } from 'react'
import './StudioUIControls.css'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function buildHistogram(sourceCanvas, channel) {
  const bins = new Uint32Array(256)
  if (!sourceCanvas?.width || !sourceCanvas?.height) return bins
  const sample = document.createElement('canvas')
  const maxSide = 420
  const scale = Math.min(1, maxSide / Math.max(sourceCanvas.width, sourceCanvas.height))
  sample.width = Math.max(1, Math.round(sourceCanvas.width * scale))
  sample.height = Math.max(1, Math.round(sourceCanvas.height * scale))
  const context = sample.getContext('2d', { willReadFrequently: true })
  if (!context) return bins
  context.drawImage(sourceCanvas, 0, 0, sample.width, sample.height)
  const data = context.getImageData(0, 0, sample.width, sample.height).data
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) continue
    const value = channel === 'r'
      ? data[index]
      : channel === 'g'
        ? data[index + 1]
        : channel === 'b'
          ? data[index + 2]
          : Math.round(data[index] * .299 + data[index + 1] * .587 + data[index + 2] * .114)
    bins[clamp(value, 0, 255)] += 1
  }
  return bins
}

export default function StudioUIHistogram({
  sourceCanvas = null,
  channel = 'gray',
  height = 118,
  label = 'Histogram',
  className = '',
}) {
  const canvasRef = useRef(null)
  const histogram = useMemo(() => buildHistogram(sourceCanvas, channel), [sourceCanvas, channel])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const render = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      canvas.width = Math.max(1, Math.round(rect.width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      const context = canvas.getContext('2d')
      if (!context) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#171d23'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = '#2f3943'
      context.lineWidth = ratio
      for (let step = 1; step < 4; step += 1) {
        const x = Math.round(canvas.width * step / 4) + .5
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, canvas.height)
        context.stroke()
      }

      let peak = 1
      for (const count of histogram) peak = Math.max(peak, count)
      const color = channel === 'r' ? '#ff727d' : channel === 'g' ? '#76d88f' : channel === 'b' ? '#72a7ff' : '#c7d7e8'
      context.fillStyle = color
      context.globalAlpha = .9

      const width = canvas.width / 256
      for (let index = 0; index < 256; index += 1) {
        const normalized = Math.pow(histogram[index] / peak, .58)
        const barHeight = normalized * (canvas.height - 6 * ratio)
        context.fillRect(index * width, canvas.height - barHeight, Math.max(1, width + .4), barHeight)
      }
      context.globalAlpha = 1

      const gradient = context.createLinearGradient(0, canvas.height - 9 * ratio, canvas.width, canvas.height - 9 * ratio)
      gradient.addColorStop(0, '#000')
      gradient.addColorStop(.5, '#7f7f7f')
      gradient.addColorStop(1, '#fff')
      context.fillStyle = gradient
      context.fillRect(0, canvas.height - 4 * ratio, canvas.width, 4 * ratio)
    }

    render()
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(render) : null
    observer?.observe(canvas)
    window.addEventListener('resize', render)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', render)
    }
  }, [histogram, height, channel])

  return (
    <div className={`ss-ui-histogram ${className}`.trim()} style={{ '--ss-ui-histogram-height': `${height}px` }}>
      <div className="ss-ui-histogram-head">
        <span>{label}</span>
        <span>{channel === 'gray' ? 'RGB' : channel.toUpperCase()}</span>
      </div>
      <canvas ref={canvasRef} aria-label={`${label} ${channel}`} />
      <style>{`
        .ss-ui-histogram{overflow:hidden;border:1px solid #3b4651;border-radius:8px;background:#171d23;color:#edf3fa}
        .ss-ui-histogram-head{height:29px;display:flex;align-items:center;justify-content:space-between;padding:0 9px;border-bottom:1px solid #3b4651;background:#29323c;color:#aab8c6;font:700 9px Inter,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em}
        .ss-ui-histogram canvas{display:block;width:100%;height:var(--ss-ui-histogram-height);background:#171d23}
      `}</style>
    </div>
  )
}

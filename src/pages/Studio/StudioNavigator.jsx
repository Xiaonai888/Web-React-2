import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useEffect, useRef, useState } from 'react'

registerTranslationNamespace('studioNavigator', {
  "en": {
    "title": "Navigator",
    "panel": "Navigator",
    "moveView": "Move the canvas view. Click or drag to pan.",
    "moveAround": "Click or drag to move around the paper",
    "hint": "Click or drag to pan · Preview is not exported"
  },
  "km": {
    "title": "ផ្ទាំងរុករក",
    "panel": "ផ្ទាំងរុករក",
    "moveView": "ផ្លាស់ទីទិដ្ឋភាព Canvas។ ចុច ឬអូសដើម្បីរំកិល។",
    "moveAround": "ចុច ឬអូសដើម្បីផ្លាស់ទីលើក្រដាស",
    "hint": "ចុច ឬអូសដើម្បីរំកិល · រូបមើលជាមុនមិនត្រូវបាន Export ទេ"
  },
  "zh": {
    "title": "导航器",
    "panel": "导航器",
    "moveView": "移动画布视图。单击或拖动以平移。",
    "moveAround": "单击或拖动以浏览画布",
    "hint": "单击或拖动以平移 · 预览不会导出"
  },
  "ja": {
    "title": "ナビゲーター",
    "panel": "ナビゲーター",
    "moveView": "キャンバス表示を移動します。クリックまたはドラッグして移動できます。",
    "moveAround": "クリックまたはドラッグしてキャンバスを移動",
    "hint": "クリックまたはドラッグして移動 · プレビューは書き出されません"
  },
  "ko": {
    "title": "네비게이터",
    "panel": "네비게이터",
    "moveView": "캔버스 보기를 이동합니다. 클릭하거나 드래그하여 이동하세요.",
    "moveAround": "클릭하거나 드래그하여 캔버스 이동",
    "hint": "클릭 또는 드래그하여 이동 · 미리보기는 내보내지지 않습니다"
  }
})

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))

export default function StudioNavigator({ canvasRef, workRef, paperId, revision, rotation, flipHorizontal, flipVertical, zoom, disabled }) {
  const { t: tx } = useDisplayTranslation()
  const previewRef = useRef(null)
  const dragRef = useRef(null)
  const [expanded, setExpanded] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 901px)').matches)
  const [dimensions, setDimensions] = useState({ width: 176, height: 118 })
  const [viewport, setViewport] = useState('')

  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px)')
    const update = () => setExpanded(query.matches)
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!expanded || !paperId || disabled) return undefined
    let frame = requestAnimationFrame(() => {
      frame = 0
      const original = canvasRef.current
      const preview = previewRef.current
      if (!original || !preview || !original.width || !original.height) return
      const scale = Math.min(176 / original.width, 145 / original.height, 1)
      const width = Math.max(1, Math.round(original.width * scale))
      const height = Math.max(1, Math.round(original.height * scale))
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
      preview.width = Math.ceil(width * pixelRatio)
      preview.height = Math.ceil(height * pixelRatio)
      const context = preview.getContext('2d', { alpha: false })
      if (!context) return
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
      context.drawImage(original, 0, 0, preview.width, preview.height)
      setDimensions({ width, height })
    })
    return () => { if (frame) cancelAnimationFrame(frame) }
  }, [canvasRef, paperId, revision, expanded, disabled])

  useEffect(() => {
    if (!expanded || disabled || !paperId) return undefined
    const work = workRef.current
    if (!work) return undefined
    let frame = 0
    function update() {
      frame = 0
      const source = canvasRef.current
      if (!source || !source.width || !source.height) return
      const canvasRect = source.getBoundingClientRect()
      const workRect = work.getBoundingClientRect()
      const width = source.width * zoom / 100
      const height = source.height * zoom / 100
      if (!width || !height) return
      const radians = rotation * Math.PI / 180
      const cosine = Math.cos(radians)
      const sine = Math.sin(radians)
      const cx = canvasRect.left + canvasRect.width / 2
      const cy = canvasRect.top + canvasRect.height / 2
      const corners = [
        [workRect.left, workRect.top],
        [workRect.right, workRect.top],
        [workRect.right, workRect.bottom],
        [workRect.left, workRect.bottom],
      ]
      const points = corners.map(([x, y]) => {
        const dx = x - cx
        const dy = y - cy
        const unrotatedX = dx * cosine + dy * sine
        const unrotatedY = -dx * sine + dy * cosine
        const u = (unrotatedX * (flipHorizontal ? -1 : 1) / width + 0.5) * dimensions.width
        const v = (unrotatedY * (flipVertical ? -1 : 1) / height + 0.5) * dimensions.height
        return `${u.toFixed(2)},${v.toFixed(2)}`
      })
      setViewport(points.join(' '))
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    schedule()
    work.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    observer?.observe(work)
    return () => {
      work.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [workRef, canvasRef, paperId, zoom, rotation, flipHorizontal, flipVertical, dimensions.width, dimensions.height, revision, expanded, disabled])

  function centerAt(u, v) {
    const work = workRef.current
    const canvas = canvasRef.current
    if (!work || !canvas || disabled) return
    const rect = canvas.getBoundingClientRect()
    const workRect = work.getBoundingClientRect()
    const radians = rotation * Math.PI / 180
    const dx = (u - 0.5) * canvas.width * zoom / 100 * (flipHorizontal ? -1 : 1)
    const dy = (v - 0.5) * canvas.height * zoom / 100 * (flipVertical ? -1 : 1)
    const screenX = rect.left + rect.width / 2 + dx * Math.cos(radians) - dy * Math.sin(radians)
    const screenY = rect.top + rect.height / 2 + dx * Math.sin(radians) + dy * Math.cos(radians)
    work.scrollLeft += screenX - (workRect.left + work.clientWidth / 2)
    work.scrollTop += screenY - (workRect.top + work.clientHeight / 2)
  }

  function moveToPointer(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    centerAt(clamp((event.clientX - rect.left) / rect.width, 0, 1), clamp((event.clientY - rect.top) / rect.height, 0, 1))
  }

  function pointerStart(event) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    dragRef.current = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
    moveToPointer(event)
  }

  function pointerMove(event) {
    if (dragRef.current === event.pointerId) moveToPointer(event)
  }

  function pointerEnd(event) {
    if (dragRef.current !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <section className="ss-section ss-navigator" aria-label={tx('studioNavigator.panel')}>
      <style>{`
        .shadow-studio .ss-navigator{min-width:0}
        @media(min-width:901px) and (min-height:651px),(min-width:1101px){.shadow-studio .ss-layout > .ss-side{min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}}
        .shadow-studio .ss-nav-fold{min-width:0}
        .shadow-studio .ss-nav-fold summary{display:flex;align-items:center;justify-content:space-between;min-height:28px;cursor:pointer;font-size:10px;font-weight:800;color:#cbd3dc;letter-spacing:.04em;list-style:none}
        .shadow-studio .ss-nav-fold summary::-webkit-details-marker{display:none}
        .shadow-studio .ss-nav-fold summary::after{content:'▾';font-size:12px;color:#a7b8c9}
        .shadow-studio .ss-nav-fold[open] summary::after{content:'▴'}
        .shadow-studio .ss-nav-preview{position:relative;display:block;margin:9px auto 5px;padding:0;overflow:hidden;border:1px solid #8795a5;background:#fff;box-sizing:content-box;touch-action:none;cursor:crosshair;line-height:0}
        .shadow-studio .ss-nav-preview:focus-visible{outline:2px solid #78beff;outline-offset:3px}
        .shadow-studio .ss-nav-preview:disabled{opacity:.5;cursor:default}
        .shadow-studio .ss-nav-preview canvas{display:block;pointer-events:none}
        .shadow-studio .ss-nav-preview svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
        .shadow-studio .ss-nav-hint{margin:4px 0 0;text-align:center;color:#aebdca;font-size:10px;line-height:1.35}
        @media(max-width:900px),(max-width:1100px) and (max-height:650px) and (orientation:landscape){
          .shadow-studio .ss-side .ss-navigator{display:block;flex:1 1 100%;width:100%;margin:0;padding:0;border:0}
          .shadow-studio .ss-nav-fold{border:1px solid #535c65;border-radius:6px;background:#30353b;padding:0 9px}
          .shadow-studio .ss-nav-fold summary{min-height:36px;color:#f0f3f6;font-size:11px}
          .shadow-studio .ss-nav-fold[open]{padding-bottom:9px}
        }
      `}</style>
      <details className="ss-nav-fold" open={expanded} onToggle={(event) => setExpanded(event.currentTarget.open)}>
        <summary>{tx('studioNavigator.title')} · {zoom}%</summary>
        <button
          type="button"
          className="ss-nav-preview"
          aria-label={tx('studioNavigator.moveView')}
          title={tx('studioNavigator.moveAround')}
          disabled={disabled}
          style={{ width: dimensions.width, height: dimensions.height }}
          onPointerDown={pointerStart}
          onPointerMove={pointerMove}
          onPointerUp={pointerEnd}
          onPointerCancel={pointerEnd}
          onClick={(event) => { if (event.detail === 0) centerAt(0.5, 0.5) }}
        >
          <canvas ref={previewRef} style={{ width: dimensions.width, height: dimensions.height }} aria-hidden="true" />
          <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} aria-hidden="true" focusable="false">
            {viewport ? <polygon points={viewport} fill="rgba(53,147,255,.2)" stroke="#2789f4" strokeWidth="2" vectorEffect="non-scaling-stroke" /> : null}
          </svg>
        </button>
        <p className="ss-nav-hint">{tx('studioNavigator.hint')}</p>
      </details>
    </section>
  )
}

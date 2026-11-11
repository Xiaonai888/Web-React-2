import { useCallback, useEffect, useRef } from 'react'
import {
  createShadowDocsInkStroke,
  paintShadowDocsInk,
  removeShadowDocsInkAtPoint,
  shadowDocsInkPointFromEvent,
} from './ShadowDocsInkEngine'
import './ShadowDocsDraw.css'

export default function ShadowDocsInkCanvas({
  strokes = [],
  onChange,
  enabled = false,
  tool = 'pen',
  color = '#111111',
  thickness = 2,
  drawWithTouch = false,
  disabled = false,
}) {
  const canvasRef = useRef(null)
  const strokesRef = useRef(strokes)
  const draftRef = useRef(null)
  const pointerRef = useRef(null)
  const frameRef = useRef(0)
  const dimensionsRef = useRef([0, 0])
  strokesRef.current = strokes

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return
    const [width, height] = dimensionsRef.current
    const scale = canvas.width / Math.max(width, 1)
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(scale, 0, 0, scale, 0, 0)
    paintShadowDocsInk(context, strokesRef.current, width, height)
    if (draftRef.current) paintShadowDocsInk(context, [draftRef.current], width, height)
  }, [])

  const scheduleRedraw = useCallback(() => {
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      redraw()
    })
  }, [redraw])

  useEffect(() => { scheduleRedraw() }, [strokes, scheduleRedraw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      const ratio = Math.min(3, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      dimensionsRef.current = [width, height]
      scheduleRedraw()
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    observer?.observe(canvas)
    window.addEventListener('resize', resize)
    resize()
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [scheduleRedraw])

  function pointerAllowed(event) {
    return enabled && !disabled && event.isPrimary && (event.pointerType !== 'touch' || drawWithTouch)
  }

  function applyErase(point) {
    const [width, height] = dimensionsRef.current
    const next = removeShadowDocsInkAtPoint(strokesRef.current, point, width, height, Math.max(10, Number(thickness) * 2))
    if (next.length !== strokesRef.current.length) {
      strokesRef.current = next
      onChange?.(next)
      scheduleRedraw()
    }
  }

  function handlePointerDown(event) {
    if (!pointerAllowed(event) || pointerRef.current !== null) return
    const point = shadowDocsInkPointFromEvent(event, event.currentTarget.getBoundingClientRect())
    pointerRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
    if (tool === 'eraser') applyErase(point)
    else {
      draftRef.current = createShadowDocsInkStroke({ tool, color, width: thickness, points: [point] })
      scheduleRedraw()
    }
  }

  function handlePointerMove(event) {
    if (pointerRef.current !== event.pointerId) return
    event.preventDefault()
    const point = shadowDocsInkPointFromEvent(event, event.currentTarget.getBoundingClientRect())
    if (tool === 'eraser') applyErase(point)
    else if (draftRef.current && draftRef.current.points.length < 2500) {
      const points = draftRef.current.points
      const last = points[points.length - 1]
      const [width, height] = dimensionsRef.current
      if (Math.hypot((last[0] - point[0]) * width, (last[1] - point[1]) * height) >= 0.8) {
        points.push(point)
        scheduleRedraw()
      }
    }
  }

  function finishPointer(event, cancelled = false) {
    if (pointerRef.current !== event.pointerId) return
    pointerRef.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (draftRef.current && !cancelled) {
      const next = [...strokesRef.current, draftRef.current].slice(-2000)
      strokesRef.current = next
      onChange?.(next)
    }
    draftRef.current = null
    scheduleRedraw()
  }

  return <canvas
    ref={canvasRef}
    className={`sd-ink-canvas ${enabled && !disabled ? 'is-enabled' : ''} ${drawWithTouch ? 'is-touch-enabled' : ''}`}
    aria-label="Document drawing layer"
    aria-hidden={!enabled}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={event => finishPointer(event)}
    onPointerCancel={event => finishPointer(event, true)}
    onLostPointerCapture={event => finishPointer(event, true)}
  />
}

import { useEffect } from 'react'
import { emitPopupUiDiagnostic, inspectPopupSurface, readPopupSurface } from '../utils/popupUiDiagnostics.js'

const SETTLE_MS = 400
const SCROLL_CHECK_GAP_MS = 1200
const MAX_CHECKS_PER_OPEN = 12

export default function usePopupUiDiagnostics(open, panelRef, kind) {
  useEffect(() => {
    if (!open || !panelRef.current) return undefined
    const panel = panelRef.current
    const view = panel.ownerDocument.defaultView
    if (!view) return undefined
    let stopped = false
    let checks = 0
    let lastCheck = -Infinity
    let timer = null
    let candidate = new Set()

    const inspect = () => {
      if (stopped || checks >= MAX_CHECKS_PER_OPEN || !panel.isConnected) return
      checks += 1
      lastCheck = view.performance.now()
      try {
        const snapshot = readPopupSurface(panel, kind)
        const codes = inspectPopupSurface(snapshot)
        for (const code of codes) {
          if (candidate.has(code)) emitPopupUiDiagnostic(code, snapshot)
        }
        candidate = new Set(codes)
      } catch {
        candidate.clear()
      }
    }

    const schedule = (delay) => {
      if (stopped || timer !== null || checks >= MAX_CHECKS_PER_OPEN) return
      timer = view.setTimeout(() => {
        timer = null
        inspect()
      }, delay)
    }

    const onScroll = () => {
      const elapsed = view.performance.now() - lastCheck
      if (elapsed >= SCROLL_CHECK_GAP_MS) schedule(SETTLE_MS)
    }

    const onInitial = () => {
      timer = null
      inspect()
      schedule(SETTLE_MS)
    }

    timer = view.setTimeout(onInitial, SETTLE_MS)
    panel.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => {
      stopped = true
      if (timer !== null) view.clearTimeout(timer)
      panel.removeEventListener('scroll', onScroll, true)
      candidate.clear()
    }
  }, [open, panelRef, kind])
}

import { useEffect } from 'react'

let activeLocks = 0
let savedStyles = null
let savedScrollY = 0

function lockPage() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  activeLocks += 1
  if (activeLocks !== 1) return

  const body = document.body
  const root = document.documentElement
  savedScrollY = window.scrollY || root.scrollTop || 0
  savedStyles = {
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    rootOverflow: root.style.overflow,
  }

  const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth)
  const computedPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0

  body.style.position = 'fixed'
  body.style.top = `-${savedScrollY}px`
  body.style.width = '100%'
  body.style.overflow = 'hidden'
  if (scrollbarWidth) body.style.paddingRight = `${computedPadding + scrollbarWidth}px`
  root.style.overflow = 'hidden'
}

function unlockPage() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  if (activeLocks === 0) return
  activeLocks -= 1
  if (activeLocks !== 0 || !savedStyles) return

  const body = document.body
  const root = document.documentElement
  body.style.position = savedStyles.bodyPosition
  body.style.top = savedStyles.bodyTop
  body.style.width = savedStyles.bodyWidth
  body.style.overflow = savedStyles.bodyOverflow
  body.style.paddingRight = savedStyles.bodyPaddingRight
  root.style.overflow = savedStyles.rootOverflow
  savedStyles = null
  window.scrollTo(0, savedScrollY)
}

export default function useOverlayScrollLock(open) {
  useEffect(() => {
    if (!open) return undefined
    lockPage()
    return () => unlockPage()
  }, [open])
}

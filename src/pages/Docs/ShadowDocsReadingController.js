import { normalizeShadowDocsReadingPreferences } from './ShadowDocsReadingPreferences'

const VOLUME_KEYS = new Set(['AudioVolumeUp', 'AudioVolumeDown', 'VolumeUp', 'VolumeDown'])
const constrain = value => Math.max(0, Math.min(100, Number(value) || 0))

export function getShadowDocsReadingProgress(element, mode = 'vertical') {
  if (!element) return 0
  const paged = mode === 'paged'
  const limit = paged ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight
  const position = paged ? element.scrollLeft : element.scrollTop
  return limit <= 0 ? 100 : Math.round(constrain(position / limit * 100))
}

export function seekShadowDocsReadingProgress(element, percent, mode = 'vertical', behavior = 'auto') {
  if (!element) return
  const paged = mode === 'paged'
  const limit = Math.max(0, paged ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight)
  const target = limit * constrain(percent) / 100
  if (paged) element.scrollTo({ left: target, behavior })
  else element.scrollTo({ top: target, behavior })
}

export function applyShadowDocsReadingAppearance(element, preferences, enabled = true) {
  if (!element) return
  const settings = normalizeShadowDocsReadingPreferences(preferences)
  if (!enabled) {
    element.removeAttribute('data-sd-reading')
    element.removeAttribute('data-sd-reading-mode')
    element.style.removeProperty('--sd-reading-bg')
    element.style.removeProperty('--sd-reading-ink')
    element.style.removeProperty('--sd-reading-font')
    element.style.removeProperty('--sd-reading-line')
    element.style.removeProperty('--sd-reading-width')
    return
  }
  const bg = settings.theme === 'night' ? '#181a21' : settings.theme === 'eye' ? '#eaf3df' : settings.background
  const ink = settings.theme === 'night' || bg === '#111827' || bg === '#314963' ? '#f1f5f9' : '#20242c'
  element.dataset.sdReading = 'true'
  element.dataset.sdReadingMode = settings.readingMode
  element.style.setProperty('--sd-reading-bg', bg)
  element.style.setProperty('--sd-reading-ink', ink)
  element.style.setProperty('--sd-reading-font', `${settings.fontSize}pt`)
  element.style.setProperty('--sd-reading-line', String(settings.lineSpacing))
  element.style.setProperty('--sd-reading-width', `${Math.max(1, element.clientWidth)}px`)
}

export function createShadowDocsReadingController({
  element,
  preferences,
  onProgress,
  onUnlock,
  unlockLabel = 'Unlock',
} = {}) {
  if (!element) return null
  let current = normalizeShadowDocsReadingPreferences(preferences)
  let locked = false
  let lockButton = null
  let frame = 0
  const originalEditable = element.getAttribute('contenteditable')
  const signal = () => onProgress?.(getShadowDocsReadingProgress(element, current.readingMode))
  const schedule = () => {
    if (frame) return
    frame = requestAnimationFrame(() => { frame = 0; signal() })
  }
  const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
    element.style.setProperty('--sd-reading-width', `${Math.max(1, element.clientWidth)}px`)
    schedule()
  }) : null

  function moveByPage(direction) {
    if (locked) return
    const paged = current.readingMode === 'paged'
    if (paged) element.scrollBy({ left: direction * element.clientWidth, behavior: 'smooth' })
    else element.scrollBy({ top: direction * element.clientHeight * 0.86, behavior: 'smooth' })
  }

  function onKeyDown(event) {
    if (!current.volumeButtons || !VOLUME_KEYS.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable="true"]')) return
    event.preventDefault()
    moveByPage(event.key.endsWith('Down') ? 1 : -1)
  }

  function setLocked(next) {
    locked = Boolean(next)
    if (lockButton) { lockButton.remove(); lockButton = null }
    element.dataset.sdReadingLocked = locked ? 'true' : 'false'
    if (!locked) return
    const parent = element.parentElement
    if (!parent) { locked = false; element.dataset.sdReadingLocked = 'false'; return }
    lockButton = document.createElement('button')
    lockButton.type = 'button'
    lockButton.className = 'sd-reading-unlock'
    lockButton.textContent = String(unlockLabel || 'Unlock')
    lockButton.setAttribute('aria-label', String(unlockLabel || 'Unlock'))
    lockButton.addEventListener('click', () => { setLocked(false); onUnlock?.() })
    parent.appendChild(lockButton)
  }

  element.blur()
  element.setAttribute('contenteditable', 'false')
  element.addEventListener('scroll', schedule, { passive: true })
  document.addEventListener('keydown', onKeyDown)
  resize?.observe(element)
  applyShadowDocsReadingAppearance(element, current)
  schedule()

  return {
    getProgress: () => getShadowDocsReadingProgress(element, current.readingMode),
    seek: percent => seekShadowDocsReadingProgress(element, percent, current.readingMode),
    nextPage: () => moveByPage(1),
    previousPage: () => moveByPage(-1),
    setLocked,
    update(next) {
      const previousMode = current.readingMode
      const progress = getShadowDocsReadingProgress(element, previousMode)
      current = normalizeShadowDocsReadingPreferences(next)
      applyShadowDocsReadingAppearance(element, current)
      requestAnimationFrame(() => seekShadowDocsReadingProgress(element, progress, current.readingMode))
    },
    destroy() {
      element.removeEventListener('scroll', schedule)
      document.removeEventListener('keydown', onKeyDown)
      resize?.disconnect()
      if (frame) cancelAnimationFrame(frame)
      setLocked(false)
      element.removeAttribute('data-sd-reading-locked')
      if (originalEditable === null) element.removeAttribute('contenteditable')
      else element.setAttribute('contenteditable', originalEditable)
      applyShadowDocsReadingAppearance(element, current, false)
    },
  }
}

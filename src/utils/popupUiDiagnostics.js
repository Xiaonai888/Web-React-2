const POPUP_KINDS = new Set(['episode-list', 'story-comments', 'post-comments'])
const MAX_REPORTS = 6
const DEDUP_MS = 30 * 60 * 1000
const emitted = new Map()
let reportCount = 0

function alphaOf(color) {
  const value = String(color ?? '').trim().toLowerCase()
  if (value === 'transparent') return 0
  const match = value.match(/^([a-z][a-z0-9-]*)\((.*)\)$/)
  if (!match) {
    if (/^#[\da-f]{8}$/.test(value)) return parseInt(value.slice(-2), 16) / 255
    if (/^#[\da-f]{4}$/.test(value)) return parseInt(value.slice(-1).repeat(2), 16) / 255
    if (/^#(?:[\da-f]{3}|[\da-f]{6})$/.test(value)) return 1
    return null
  }
  const [, fn, args] = match
  const slash = args.lastIndexOf('/')
  const commas = args.split(',')
  const raw = slash >= 0 ? args.slice(slash + 1).trim()
    : /^(rgb|rgba|hsl|hsla)$/.test(fn) && commas.length === 4 ? commas[3].trim() : ''
  if (!raw) return 1
  if (!/^[-+]?(?:\d+\.?\d*|\.\d+)%?$/.test(raw)) return null
  const alpha = Number.parseFloat(raw) / (raw.endsWith('%') ? 100 : 1)
  return Math.min(1, Math.max(0, alpha))
}

export function inspectPopupSurface(snapshot) {
  if (!snapshot || !POPUP_KINDS.has(snapshot.kind) || !snapshot.visible) return []
  const issues = []
  if (!String(snapshot.themeTokenValue ?? '').trim()) issues.push('UI_THEME_TOKEN_MISSING')
  if (alphaOf(snapshot.backgroundColor) === 0 && snapshot.backgroundImage === 'none') {
    issues.push('UI_BACKGROUND_MISSING')
  }
  return issues
}

function safeCss(value) {
  return String(value ?? '').slice(0, 120)
}

export function readPopupSurface(panel, kind) {
  if (!POPUP_KINDS.has(kind) || !panel?.isConnected || document.visibilityState !== 'visible') return null
  const view = panel.ownerDocument.defaultView
  if (!view) return null
  const style = view.getComputedStyle(panel)
  const rect = panel.getBoundingClientRect()
  const viewport = view.visualViewport
  const left = viewport?.offsetLeft ?? 0
  const top = viewport?.offsetTop ?? 0
  const width = viewport?.width ?? view.innerWidth
  const height = viewport?.height ?? view.innerHeight
  const visible = rect.width > 0 && rect.height > 0 &&
    rect.right > left && rect.bottom > top && rect.left < left + width && rect.top < top + height &&
    style.display !== 'none' && style.visibility === 'visible' && Number(style.opacity) > 0
  const token = kind === 'episode-list' ? '--shadow-bg-elevated' : '--shadow-bg-surface'
  return {
    kind,
    visible,
    themeToken: token,
    themeTokenValue: safeCss(style.getPropertyValue(token)),
    backgroundColor: safeCss(style.backgroundColor),
    backgroundImage: style.backgroundImage === 'none' ? 'none' : 'present',
    opacity: safeCss(style.opacity),
    position: safeCss(style.position),
    zIndex: safeCss(style.zIndex),
    transform: safeCss(style.transform),
    willChange: safeCss(style.willChange),
    bodyOverflow: safeCss(view.getComputedStyle(panel.ownerDocument.body).overflowY),
    htmlOverflow: safeCss(view.getComputedStyle(panel.ownerDocument.documentElement).overflowY),
    viewportWidth: Math.round(width),
    viewportHeight: Math.round(height),
    theme: panel.ownerDocument.documentElement.classList.contains('dark') ? 'dark' : 'light',
    buildVersion: typeof __APP_BUILD_VERSION__ === 'undefined' ? 'unknown' : String(__APP_BUILD_VERSION__).slice(0, 40),
  }
}

export function emitPopupUiDiagnostic(code, snapshot) {
  if (!inspectPopupSurface(snapshot).includes(code)) return false
  const now = Date.now()
  const signature = `${snapshot.kind}:${code}:${snapshot.theme}:${snapshot.buildVersion}`
  const previous = emitted.get(signature)
  if (reportCount >= MAX_REPORTS || (previous !== undefined && now - previous < DEDUP_MS)) return false
  emitted.set(signature, now)
  reportCount += 1
  const detail = { code, ...snapshot, observedAt: new Date(now).toISOString() }
  try {
    window.dispatchEvent(new CustomEvent('shadow-popup-ui-diagnostic', { detail }))
  } catch {}
  try {
    window.ShadowDiagnostics?.report?.(new Error(`${code}: ${snapshot.kind}; bg=${snapshot.backgroundColor}; token=${snapshot.themeTokenValue}; theme=${snapshot.theme}; build=${snapshot.buildVersion}`), {
      kind: 'ui',
      stage: snapshot.kind,
      operation: code,
      show: false,
    })
  } catch {}
  return true
}

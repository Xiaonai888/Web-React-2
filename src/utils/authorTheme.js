export const DEFAULT_AUTHOR_THEME = '#7952F5'

export const AUTHOR_THEME_PRESETS = [
  { id: 'purple', color: '#7952F5' },
  { id: 'yellow', color: '#FFC400' },
  { id: 'blue', color: '#2684FF' },
  { id: 'pink', color: '#F45DA8' },
  { id: 'green', color: '#20B879' },
  { id: 'orange', color: '#FF8938' },
  { id: 'red', color: '#F14C56' },
  { id: 'cyan', color: '#16B8C8' },
]

const HEX_PATTERN = /^#[0-9a-f]{6}$/i
const STORAGE_PREFIX = 'shadow_author_theme_v2'

function getAuthorThemeStorageKey() {
  try {
    const raw = localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user')
    const user = raw ? JSON.parse(raw) : null
    const userId = user?.id || user?.user_id || user?.uid
    return userId ? `${STORAGE_PREFIX}:${String(userId)}` : STORAGE_PREFIX
  } catch {
    return STORAGE_PREFIX
  }
}

export function normalizeAuthorTheme(value) {
  return typeof value === 'string' && HEX_PATTERN.test(value.trim())
    ? value.trim().toUpperCase()
    : DEFAULT_AUTHOR_THEME
}

export function getAuthorTheme() {
  try {
    return normalizeAuthorTheme(localStorage.getItem(getAuthorThemeStorageKey()))
  } catch {
    return DEFAULT_AUTHOR_THEME
  }
}

export function applyAuthorTheme(value) {
  const color = normalizeAuthorTheme(value)
  if (typeof document === 'undefined') return color
  const red = parseInt(color.slice(1, 3), 16)
  const green = parseInt(color.slice(3, 5), 16)
  const blue = parseInt(color.slice(5, 7), 16)
  const contrast = (red * 299 + green * 587 + blue * 114) / 1000 >= 160 ? '#171717' : '#FFFFFF'
  const root = document.documentElement
  root.style.setProperty('--author-theme-primary', color)
  root.style.setProperty('--author-theme-foreground', contrast)
  root.style.setProperty('--author-theme-soft', `${color}20`)
  root.style.setProperty('--author-theme-border', `${color}55`)
  root.style.setProperty('--author-theme-gradient', `linear-gradient(to right, ${color}, color-mix(in srgb, ${color} 58%, white))`)
  root.style.setProperty('--author-theme-gradient-br', `linear-gradient(to bottom right, ${color}, color-mix(in srgb, ${color} 58%, white))`)
  return color
}

export function saveAuthorTheme(value) {
  const color = applyAuthorTheme(value)
  try {
    localStorage.setItem(getAuthorThemeStorageKey(), color)
  } catch {
    return color
  }
  window.dispatchEvent(new CustomEvent('shadow:author-theme-changed', { detail: { color } }))
  return color
}

const THEME_STORAGE_KEY = 'shadow_theme'

export function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme) {
  const isDark = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
}


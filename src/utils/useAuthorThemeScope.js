import { useEffect } from 'react'
import { applyAuthorTheme, DEFAULT_AUTHOR_THEME, getAuthorTheme } from './authorTheme'
import './authorThemeGlobal.css'

const MANAGED_AUTHOR_PAGE_SECTIONS = new Set([
  'dashboard', 'notifications', 'posts', 'ads', 'chat', 'store', 'story', 'edit', 'finance'
])

function isAuthorManagementPath(pathname) {
  if (!pathname.startsWith('/author/')) return false
  if (pathname.startsWith('/author/post/') || pathname === '/author/agreement') return false
  if (pathname === '/author/page') return false
  if (pathname.startsWith('/author/page/')) {
    return MANAGED_AUTHOR_PAGE_SECTIONS.has(pathname.split('/')[3] || '')
  }
  return true
}

export function useAuthorThemeScope(pathname) {
  useEffect(() => {
    const root = document.documentElement
    const enabled = isAuthorManagementPath(pathname)
    const syncTheme = () => {
      const color = applyAuthorTheme(getAuthorTheme())
      root.classList.toggle('shadow-author-theme', enabled && color !== DEFAULT_AUTHOR_THEME)
    }
    syncTheme()
    window.addEventListener('storage', syncTheme)
    window.addEventListener('shadow:author-theme-changed', syncTheme)
    return () => {
      root.classList.remove('shadow-author-theme')
      window.removeEventListener('storage', syncTheme)
      window.removeEventListener('shadow:author-theme-changed', syncTheme)
    }
  }, [pathname])
}

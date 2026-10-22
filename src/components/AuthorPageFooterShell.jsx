import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AuthorPageFooter from './AuthorPageFooter'

const FooterVisibilityContext = createContext(null)
const MAIN_PATHS = new Set([
  '/author/page',
  '/author/page/dashboard',
  '/author/page/store',
  '/author/page/notifications',
])

export function useAuthorPageFooterVisibility(visible) {
  const registerVisibility = useContext(FooterVisibilityContext)
  const location = useLocation()
  const routeKey = `${location.pathname}:${location.key}`

  useLayoutEffect(() => {
    if (!registerVisibility) return undefined
    return registerVisibility(routeKey, Boolean(visible))
  }, [registerVisibility, routeKey, visible])
}

export default function AuthorPageFooterShell({ children }) {
  const location = useLocation()
  const routeKey = `${location.pathname}:${location.key}`
  const pathname = location.pathname.replace(/\/+$/, '') || '/'
  const [visibility, setVisibility] = useState({ routeKey: '', visible: false })

  const registerVisibility = useCallback((key, visible) => {
    setVisibility((current) =>
      current.routeKey === key && current.visible === visible
        ? current
        : { routeKey: key, visible }
    )
    return () => {
      setVisibility((current) =>
        current.routeKey === key && current.visible
          ? { routeKey: key, visible: false }
          : current
      )
    }
  }, [])

  const showFooter = MAIN_PATHS.has(pathname) && (
    pathname === '/author/page/dashboard' ||
    (visibility.routeKey === routeKey && visibility.visible)
  )

  return (
    <FooterVisibilityContext.Provider value={registerVisibility}>
      {children}
      <div className={showFooter ? '' : 'hidden'} aria-hidden={!showFooter}>
        <AuthorPageFooter />
      </div>
    </FooterVisibilityContext.Provider>
  )
}

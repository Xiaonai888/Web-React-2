import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import ShadowStudioHeader from './ShadowStudioHeader'
import { getStudioVideoNotificationUnreadCount } from '../../services/shadowStudioNotificationsApi'
import { fetchMyAuthorPageCached, getMyAuthorPageCachedSnapshot } from '../../services/myAuthorPageClientCache'

const STUDIO_ROOT = '/author/reel/studio'

export default function ShadowStudioShell({ children, avatarUrl = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const returnTo = `${location.pathname}${location.search}${location.hash}`
  const token = localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
  const [profileAvatar, setProfileAvatar] = useState('')

  useEffect(() => {
    const page = getMyAuthorPageCachedSnapshot(token)
    setProfileAvatar(page?.avatar_url || page?.profile_image_url || '')
    if (!token) return

    const controller = new AbortController()
    const apiBaseUrl = import.meta.env.VITE_API_URL ||
      (['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? 'http://localhost:5000'
        : 'https://shadow-backend-kucw.onrender.com')

    fetchMyAuthorPageCached({
      apiBaseUrl,
      token,
      signal: controller.signal,
    }).then(data => {
      if (controller.signal.aborted) return
      const authorPage = data?.author_page
      setProfileAvatar(
        authorPage?.avatar_url || authorPage?.profile_image_url || ''
      )
    }).catch(() => {})

    return () => controller.abort()
  }, [token])

  const refreshUnread = useCallback((signal, force = false) => {
    getStudioVideoNotificationUnreadCount({ signal, force })
      .then(result => {
        if (!signal?.aborted) setUnread(result)
      })
      .catch(() => {
        if (!signal?.aborted) setUnread(0)
      })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    refreshUnread(controller.signal)
    const onChange = () => refreshUnread(controller.signal, true)
    window.addEventListener('shadow-studio-notifications-changed', onChange)
    return () => {
      controller.abort()
      window.removeEventListener('shadow-studio-notifications-changed', onChange)
    }
  }, [refreshUnread])

  const handleAddVideo = () => navigate('/author/reel/add', {
    state: { returnTo },
  })

  const handleNotifications = () => navigate(`${STUDIO_ROOT}/notifications`, {
    state: { returnTo },
  })

  const handleProfile = () => navigate('/author/page', {
    state: { activeTab: 'Reel' },
  })

  return <>
    {location.pathname !== `${STUDIO_ROOT}/notifications` ? <ShadowStudioHeader
      avatarUrl={avatarUrl || profileAvatar}
      videoUnreadCount={unread}
      onAddVideo={location.pathname === '/author/reel/add' ? undefined : handleAddVideo}
      onOpenNotifications={handleNotifications}
      onOpenProfile={handleProfile}
    /> : null}
    {children ?? <Outlet />}
  </>
}

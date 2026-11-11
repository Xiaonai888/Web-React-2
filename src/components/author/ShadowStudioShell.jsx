import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import ShadowStudioHeader from './ShadowStudioHeader'
import { getStudioVideoNotificationUnreadCount } from '../../services/shadowStudioNotificationsApi'

const STUDIO_ROOT = '/author/reel/studio'

export default function ShadowStudioShell({ children, avatarUrl = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const returnTo = `${location.pathname}${location.search}${location.hash}`

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

  const handleCreatePost = () => navigate('/author/page', {
    state: { studioCreatePost: true, studioReturnTo: returnTo },
  })

  const handleNotifications = () => navigate(`${STUDIO_ROOT}/notifications`, {
    state: { returnTo },
  })

  const handleProfile = () => navigate(`${STUDIO_ROOT}/me`, {
    state: { returnTo },
  })

  return <>
    <ShadowStudioHeader
      avatarUrl={avatarUrl}
      videoUnreadCount={unread}
      onCreatePost={handleCreatePost}
      onOpenNotifications={handleNotifications}
      onOpenProfile={handleProfile}
    />
    {children ?? <Outlet />}
  </>
}

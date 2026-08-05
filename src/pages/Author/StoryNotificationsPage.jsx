import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const filters = ['All', 'Unread', 'Comments', 'Likes', 'Echoes', 'Income']

const typeMap = {
  comments: 'Comments',
  comment: 'Comments',
  like: 'Likes',
  echo: 'Echoes',
  gift: 'Income',
  unlock: 'Income',
  income: 'Income',
  withdrawal: 'Income',
  payout: 'Income',
  system: 'System',
  admin: 'System',
}

const actionMap = {
  comments: {
    icon: 'fa-solid fa-comment',
    badge: 'bg-[#1877f2] text-white',
  },
  comment: {
    icon: 'fa-solid fa-comment',
    badge: 'bg-[#1877f2] text-white',
  },
  like: {
    icon: 'fa-solid fa-heart',
    badge: 'bg-[#f43f5e] text-white',
  },
  echo: {
    icon: 'fa-solid fa-share',
    badge: 'bg-[#7c3aed] text-white',
  },
  gift: {
    icon: 'fa-solid fa-gift',
    badge: 'bg-[#f59e0b] text-white',
  },
  unlock: {
    icon: 'fa-solid fa-gem',
    badge: 'bg-[#0891b2] text-white',
  },
  income: {
    icon: 'fa-solid fa-wallet',
    badge: 'bg-[#16a34a] text-white',
  },
  withdrawal: {
    icon: 'fa-solid fa-money-bill-transfer',
    badge: 'bg-[#16a34a] text-white',
  },
  payout: {
    icon: 'fa-solid fa-money-check-dollar',
    badge: 'bg-[#16a34a] text-white',
  },
  system: {
    icon: 'fa-solid fa-shield-halved',
    badge: 'bg-[#111827] text-white',
  },
  admin: {
    icon: 'fa-solid fa-shield-halved',
    badge: 'bg-[#111827] text-white',
  },
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getNotificationTypeLabel(type) {
  return typeMap[String(type || '').toLowerCase()] || 'System'
}

function getAction(type) {
  return (
    actionMap[String(type || '').toLowerCase()] || {
      icon: 'fa-solid fa-bell',
      badge: 'bg-[#111827] text-white',
    }
  )
}

function formatTime(value) {
  if (!value) return 'Now'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Now'

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'Now'
  if (diffMinutes < 60) return `${diffMinutes}m`

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) return `${diffHours}h`

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays < 7) return `${diffDays}d`

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })
}

function normalizeNotification(item) {
  const metadata = item.metadata && typeof item.metadata === 'object' ? item.metadata : {}
  const readerName =
    metadata.reader_name ||
    metadata.user_name ||
    metadata.actor_name ||
    ''

  return {
    id: item.id,
    type: item.type || 'system',
    typeLabel: getNotificationTypeLabel(item.type),
    title: item.title || 'Notification',
    message: item.message || '',
    targetUrl: item.target_url || item.targetUrl || '',
    metadata,
    readerName,
    readerAvatar:
      metadata.reader_avatar_url ||
      metadata.user_avatar_url ||
      metadata.actor_avatar_url ||
      '',
    unread: !Boolean(item.is_read),
    time: formatTime(item.created_at),
    createdAt: item.created_at || '',
  }
}

async function apiRequest(path, options = {}) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

async function fetchStoryNotifications() {
  const data = await apiRequest('/api/authors/me/story-notifications')

  return {
    notifications: Array.isArray(data.notifications)
      ? data.notifications.map(normalizeNotification)
      : [],
    unreadCount: Number(data.unread_count || 0),
  }
}

function markNotificationRead(notificationId) {
  return apiRequest(
    `/api/authors/me/story-notifications/${encodeURIComponent(notificationId)}/read`,
    { method: 'PATCH' }
  )
}

function markNotificationUnread(notificationId) {
  return apiRequest(
    `/api/authors/me/story-notifications/${encodeURIComponent(notificationId)}/unread`,
    { method: 'PATCH' }
  )
}

function deleteNotification(notificationId) {
  return apiRequest(
    `/api/authors/me/story-notifications/${encodeURIComponent(notificationId)}`,
    { method: 'DELETE' }
  )
}

function updateNotificationPreference(type, isEnabled, frequencyLevel = 'normal') {
  return apiRequest(
    `/api/authors/me/story-notification-preferences/${encodeURIComponent(type)}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        is_enabled: isEnabled,
        frequency_level: frequencyLevel,
      }),
    }
  )
}

function markAllNotificationsRead() {
  return apiRequest('/api/authors/me/story-notifications/read-all', {
    method: 'PATCH',
  })
}

function NotificationAvatar({ notification }) {
  const action = getAction(notification.type)
  const fallbackText = String(notification.readerName || notification.typeLabel || 'N')
    .trim()
    .slice(0, 1)
    .toUpperCase()

  return (
    <div className="relative h-14 w-14 shrink-0">
      {notification.readerAvatar ? (
        <img
          src={notification.readerAvatar}
          alt=""
          className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5e7eb] text-[18px] font-black text-[#4b5563]">
          {fallbackText}
        </div>
      )}

      <span
        className={`absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${action.badge}`}
      >
        <i className={`${action.icon} text-[10px]`} />
      </span>
    </div>
  )
}

function NotificationItem({ notification, onOpen, onOptions }) {
  return (
    <div
      className={`flex w-full items-start gap-3 px-4 py-3 transition ${
        notification.unread ? 'bg-[#eef6ff]' : 'bg-white'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="flex min-w-0 flex-1 items-start gap-3 text-left active:opacity-80"
      >
        <NotificationAvatar notification={notification} />

        <div className="min-w-0 flex-1 pt-0.5">
          <p
            className={`line-clamp-3 text-[14px] leading-5 text-[#111827] ${
              notification.unread ? 'font-black' : 'font-semibold'
            }`}
          >
            {notification.title}
            {notification.message ? (
              <span className="font-medium text-[#4b5563]"> · {notification.message}</span>
            ) : null}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`text-[12px] ${
                notification.unread
                  ? 'font-black text-[#1877f2]'
                  : 'font-semibold text-[#8b93a1]'
              }`}
            >
              {notification.time}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#cbd5e1]" />
            <span className="text-[12px] font-semibold text-[#8b93a1]">
              {notification.typeLabel}
            </span>
          </div>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-1 pt-1">
        {notification.unread ? (
          <span className="h-3 w-3 rounded-full bg-[#1877f2]" />
        ) : null}

        <button
          type="button"
          onClick={() => onOptions(notification)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] active:bg-[#eef0f4]"
          aria-label="Notification options"
        >
          <i className="fa-solid fa-ellipsis text-[15px]" />
        </button>
      </div>
    </div>
  )
}

function NotificationGroup({ title, notifications, onOpen, onOptions }) {
  if (!notifications.length) return null

  return (
    <section className="bg-white">
      <h2 className="px-4 pb-2 pt-4 text-[18px] font-black text-[#111827]">{title}</h2>

      <div className="bg-white">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={index > 0 ? 'border-t border-[#eef0f4]' : ''}
          >
            <NotificationItem
              notification={notification}
              onOpen={onOpen}
              onOptions={onOptions}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function EmptyState({ filter }) {
  return (
    <div className="bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-bell text-[20px]" />
      </div>
      <h2 className="text-[17px] font-black text-[#111827]">
        No {filter.toLowerCase()} notifications
      </h2>
      <p className="mx-auto mt-2 max-w-[340px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        Story comments, likes, echoes, Diamond unlocks, gifts, income, and publishing notices will appear here.
      </p>
    </div>
  )
}

function OptionsSheet({
  notification,
  loading,
  onClose,
  onToggleRead,
  onShowMore,
  onShowLess,
  onDisableType,
  onDelete,
  onReport,
}) {
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dragStartRef = useRef(0)
  const dragYRef = useRef(0)

  useEffect(() => {
    if (!notification) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      html.style.overflow = previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [notification])

  if (!notification) return null

  const fallbackText = String(notification.readerName || notification.typeLabel || 'N')
    .trim()
    .slice(0, 1)
    .toUpperCase()

  const closeSheet = () => {
    dragYRef.current = 0
    setDragY(0)
    setDragging(false)
    onClose()
  }

  const handleDragStart = (event) => {
    dragStartRef.current = event.clientY
    dragYRef.current = 0
    setDragY(0)
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleDragMove = (event) => {
    if (!dragging) return
    const nextDragY = Math.max(0, event.clientY - dragStartRef.current)
    dragYRef.current = nextDragY
    setDragY(nextDragY)
  }

  const handleDragEnd = () => {
    if (!dragging) return
    setDragging(false)

    if (dragYRef.current >= 80) {
      closeSheet()
      return
    }

    dragYRef.current = 0
    setDragY(0)
  }

  return (
    <div
      className="fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label="Notification options"
    >
      <button
        type="button"
        onClick={closeSheet}
        className="absolute inset-0 bg-black/45"
        aria-label="Close notification options"
      />

      <section
        className={`absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[24px] bg-white pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(17,24,39,0.22)] ${
          dragging ? '' : 'transition-transform duration-200 ease-out'
        }`}
        style={{ transform: `translateY(${dragY}px)` }}
      >
        <div
          className="touch-none pb-2 pt-2"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className="mx-auto h-1.5 w-11 rounded-full bg-[#cfd3da]" />
        </div>

        <div className="px-5 pb-4 text-center">
          {notification.readerAvatar ? (
            <img
              src={notification.readerAvatar}
              alt=""
              className="mx-auto h-12 w-12 rounded-full object-cover ring-1 ring-black/5"
            />
          ) : (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e5e7eb] text-[16px] font-semibold text-[#4b5563]">
              {fallbackText}
            </div>
          )}

          <p className="mx-auto mt-3 max-w-[330px] text-[13px] font-normal leading-5 text-[#4b5563]">
            <span className="text-[#111827]">{notification.title}</span>
            {notification.message ? ` · ${notification.message}` : ''}
          </p>
        </div>

        <div className="border-t border-[#eef0f4] px-5 py-2">
          <button
            type="button"
            disabled={loading}
            onClick={onShowMore}
            className="flex min-h-12 w-full items-center gap-4 py-3 text-left text-[15px] font-normal text-black active:opacity-60 disabled:opacity-40"
          >
            <i className="fa-solid fa-plus w-5 text-center text-[16px]" />
            <span>Show more</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onShowLess}
            className="flex min-h-12 w-full items-center gap-4 py-3 text-left text-[15px] font-normal text-black active:opacity-60 disabled:opacity-40"
          >
            <i className="fa-solid fa-minus w-5 text-center text-[16px]" />
            <span>Show less</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onToggleRead}
            className="flex min-h-12 w-full items-center gap-4 py-3 text-left text-[15px] font-normal text-black active:opacity-60 disabled:opacity-40"
          >
            <i className={`w-5 text-center text-[16px] fa-solid ${notification.unread ? 'fa-check' : 'fa-envelope'}`} />
            <span>{notification.unread ? 'Mark as read' : 'Mark as unread'}</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onDisableType}
            className="flex min-h-12 w-full items-center gap-4 py-3 text-left text-[15px] font-normal text-black active:opacity-60 disabled:opacity-40"
          >
            <i className="fa-solid fa-bell-slash w-5 text-center text-[16px]" />
            <span>Turn off {notification.typeLabel.toLowerCase()} notifications</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onDelete}
            className="flex min-h-12 w-full items-center gap-4 py-3 text-left text-[15px] font-normal text-black active:opacity-60 disabled:opacity-40"
          >
            <i className="fa-regular fa-trash-can w-5 text-center text-[16px]" />
            <span>Delete this notification</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onReport}
            className="flex min-h-12 w-full items-center gap-4 py-3 text-left text-[15px] font-normal text-black active:opacity-60 disabled:opacity-40"
          >
            <i className="fa-solid fa-triangle-exclamation w-5 text-center text-[16px]" />
            <span>Report issue to Notifications Team</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default function StoryNotificationsPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [message, setMessage] = useState('')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState(null)

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setMessage('')

      const data = await fetchStoryNotifications()

      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      setNotifications([])
      setUnreadCount(0)
      setMessage(error.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') return notifications
    if (activeFilter === 'Unread') return notifications.filter((item) => item.unread)
    return notifications.filter((item) => item.typeLabel === activeFilter)
  }, [activeFilter, notifications])

  const newNotifications = filteredNotifications.filter((item) => item.unread)
  const earlierNotifications = filteredNotifications.filter((item) => !item.unread)

  async function handleOpen(notification) {
    if (notification.unread) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, unread: false } : item
        )
      )
      setUnreadCount((current) => Math.max(0, current - 1))
      markNotificationRead(notification.id).catch(() => null)
    }

    if (notification.targetUrl) {
      navigate(notification.targetUrl)
      return
    }

    setMessage('This notification does not have a target page yet.')
  }

  async function handleToggleRead() {
    if (!selectedNotification) return

    try {
      setActionLoading(true)

      if (selectedNotification.unread) {
        await markNotificationRead(selectedNotification.id)
        setUnreadCount((current) => Math.max(0, current - 1))
      } else {
        await markNotificationUnread(selectedNotification.id)
        setUnreadCount((current) => current + 1)
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === selectedNotification.id
            ? { ...item, unread: !selectedNotification.unread }
            : item
        )
      )
      setSelectedNotification(null)
    } catch (error) {
      setMessage(error.message || 'Failed to update notification')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleFrequency(level) {
    if (!selectedNotification) return

    try {
      setActionLoading(true)
      await updateNotificationPreference(selectedNotification.type, true, level)
      setMessage(
        level === 'more'
          ? `You will see more ${selectedNotification.typeLabel.toLowerCase()} notifications.`
          : `You will see fewer ${selectedNotification.typeLabel.toLowerCase()} notifications.`
      )
      setSelectedNotification(null)
    } catch (error) {
      setMessage(error.message || 'Failed to update notification preference')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDisableType() {
    if (!selectedNotification) return

    try {
      setActionLoading(true)
      await updateNotificationPreference(selectedNotification.type, false, 'normal')
      setMessage(`${selectedNotification.typeLabel} notifications are turned off.`)
      setSelectedNotification(null)
    } catch (error) {
      setMessage(error.message || 'Failed to update notification preference')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDelete() {
    if (!selectedNotification) return

    try {
      setActionLoading(true)
      await deleteNotification(selectedNotification.id)

      setNotifications((current) =>
        current.filter((item) => item.id !== selectedNotification.id)
      )

      if (selectedNotification.unread) {
        setUnreadCount((current) => Math.max(0, current - 1))
      }

      setSelectedNotification(null)
    } catch (error) {
      setMessage(error.message || 'Failed to delete notification')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead()
      setNotifications((current) =>
        current.map((item) => ({ ...item, unread: false }))
      )
      setUnreadCount(0)
    } catch (error) {
      setMessage(error.message || 'Failed to mark notifications as read')
    }
  }

  return (
    <div className="min-h-screen bg-white pb-[92px]">
      <div
        className={`sticky top-0 z-40 border-b border-[#eef0f4] bg-white ${
          selectedNotification ? 'invisible' : ''
        }`}
      >
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/dashboard')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back to author dashboard"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[18px] font-black text-[#111827]">
            Story Notifications
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] active:scale-95"
            aria-label="Mark all as read"
          >
            <i className="fa-solid fa-check text-[14px]" />
          </button>
        </div>
      </div>

      <main className="mx-auto min-h-[calc(100vh-148px)] max-w-[980px] bg-white">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
          >
            {message}
          </button>
        ) : null}

        <section className="sticky top-14 z-30 border-b border-[#eef0f4] bg-white">
          <div className="flex gap-2 overflow-x-auto px-4 py-2">
            {filters.map((filter) => {
              const active = activeFilter === filter

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition active:scale-[0.98] ${
                    active
                      ? 'bg-[#111827] font-bold text-white'
                      : 'bg-[#f3f4f6] font-semibold text-[#6b7280]'
                  }`}
                >
                  {filter}
                  {filter === 'Unread' && unreadCount > 0 ? (
                    <span className="ml-1.5 text-[11px] font-black">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>

        {loading ? (
          <EmptyState filter="loading" />
        ) : filteredNotifications.length ? (
          <div className="bg-white">
            <NotificationGroup
              title="New"
              notifications={newNotifications}
              onOpen={handleOpen}
              onOptions={setSelectedNotification}
            />

            <NotificationGroup
              title="Earlier"
              notifications={earlierNotifications}
              onOpen={handleOpen}
              onOptions={setSelectedNotification}
            />
          </div>
        ) : (
          <EmptyState filter={activeFilter} />
        )}
      </main>

      <div className={selectedNotification ? 'invisible' : ''}>
        <AuthorStudioBottomNav />
      </div>

      <OptionsSheet
        notification={selectedNotification}
        loading={actionLoading}
        onClose={() => setSelectedNotification(null)}
        onToggleRead={handleToggleRead}
        onShowMore={() => handleFrequency('more')}
        onShowLess={() => handleFrequency('less')}
        onDisableType={handleDisableType}
        onDelete={handleDelete}
        onReport={() => {
          setSelectedNotification(null)
          navigate('/feedback')
        }}
      />
    </div>
  )
}

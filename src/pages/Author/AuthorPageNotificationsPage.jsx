import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const filters = ['All', 'Unread', 'Comments', 'Activity', 'Orders', 'Income']

const typeMap = {
  comments: 'Comments',
  comment: 'Comments',
  mention: 'Comments',
  mentions: 'Comments',
  reaction: 'Activity',
  echo: 'Activity',
  follower: 'Activity',
  review: 'Activity',
  post: 'Activity',
  posts: 'Activity',
  orders: 'Orders',
  order: 'Orders',
  income: 'Income',
  withdrawal: 'Income',
  payout: 'Income',
  system: 'System',
  admin: 'System',
}

const iconMap = {
  comments: 'fa-regular fa-comment',
  comment: 'fa-regular fa-comment',
  mention: 'fa-solid fa-at',
  mentions: 'fa-solid fa-at',
  reaction: 'fa-solid fa-heart',
  echo: 'fa-solid fa-retweet',
  follower: 'fa-solid fa-user-plus',
  review: 'fa-solid fa-star',
  post: 'fa-regular fa-file-lines',
  posts: 'fa-regular fa-file-lines',
  orders: 'fa-solid fa-bag-shopping',
  order: 'fa-solid fa-bag-shopping',
  income: 'fa-solid fa-wallet',
  withdrawal: 'fa-solid fa-money-bill-transfer',
  payout: 'fa-solid fa-money-check-dollar',
  system: 'fa-solid fa-shield-halved',
  admin: 'fa-solid fa-shield-halved',
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

function getNotificationIcon(type) {
  return iconMap[String(type || '').toLowerCase()] || 'fa-regular fa-bell'
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

function getActorMetadata(metadata = {}) {
  return {
    name:
      metadata.reader_name ||
      metadata.reviewer_name ||
      metadata.buyer_name ||
      metadata.actor_name ||
      '',
    username:
      metadata.reader_username ||
      metadata.reviewer_username ||
      metadata.buyer_username ||
      metadata.actor_username ||
      '',
    avatarUrl:
      metadata.reader_avatar_url ||
      metadata.reviewer_avatar_url ||
      metadata.buyer_avatar_url ||
      metadata.actor_avatar_url ||
      '',
  }
}

function normalizeNotification(item) {
  const metadata =
    item.metadata && typeof item.metadata === 'object'
      ? item.metadata
      : {}
  const actor = getActorMetadata(metadata)
const effectiveType =
  metadata.notification_type ||
  item.type ||
  'system'

return {
  id: item.id,
  type: effectiveType,
  typeLabel: getNotificationTypeLabel(effectiveType),
    title: item.title || 'Notification',
    message: item.message || '',
    targetUrl: item.target_url || item.targetUrl || '',
    unread: !Boolean(item.is_read),
    time: formatTime(item.created_at),
    createdAt: item.created_at || '',
    metadata,
    actorName: actor.name,
    actorUsername: actor.username,
    actorAvatarUrl: actor.avatarUrl,
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

async function fetchPageNotifications() {
  const data = await apiRequest('/api/authors/me/page-notifications')

  return {
    notifications: Array.isArray(data.notifications)
      ? data.notifications.map(normalizeNotification)
      : [],
    unreadCount: Number(data.unread_count || 0),
  }
}

function markNotificationRead(notificationId) {
  return apiRequest(
    `/api/authors/me/page-notifications/${encodeURIComponent(
      notificationId
    )}/read`,
    { method: 'PATCH' }
  )
}

function markNotificationUnread(notificationId) {
  return apiRequest(
    `/api/authors/me/page-notifications/${encodeURIComponent(
      notificationId
    )}/unread`,
    { method: 'PATCH' }
  )
}

function deleteNotification(notificationId) {
  return apiRequest(
    `/api/authors/me/page-notifications/${encodeURIComponent(
      notificationId
    )}`,
    { method: 'DELETE' }
  )
}

function markAllNotificationsRead() {
  return apiRequest('/api/authors/me/page-notifications/read-all', {
    method: 'PATCH',
  })
}

function NotificationIcon({ notification }) {
  const hasAvatar = Boolean(notification.actorAvatarUrl)

  return (
    <div className="relative h-12 w-12 shrink-0">
      {hasAvatar ? (
        <img
          src={notification.actorAvatarUrl}
          alt={notification.actorName || 'Reader'}
          className="h-12 w-12 rounded-full bg-[#f3f4f6] object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
          <i className={`${getNotificationIcon(notification.type)} text-[17px]`} />
        </div>
      )}

      {hasAvatar ? (
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#111827] text-white">
          <i className={`${getNotificationIcon(notification.type)} text-[10px]`} />
        </span>
      ) : null}

      {notification.unread ? (
        <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-[#f43f5e]" />
      ) : null}
    </div>
  )
}

function NotificationItem({ notification, onOpen, onOptions }) {
  return (
    <div
      className={`flex w-full gap-3 px-4 py-3 text-left transition ${
        notification.unread ? 'bg-[#eef6ff]' : 'bg-white'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="flex min-w-0 flex-1 gap-3 text-left active:opacity-80"
      >
        <NotificationIcon notification={notification} />

        <div className="min-w-0 flex-1">
          <p
            className={`line-clamp-2 text-[14px] leading-5 text-[#111827] ${
              notification.unread ? 'font-black' : 'font-semibold'
            }`}
          >
            {notification.title}
            {notification.message ? (
              <span className="font-semibold text-[#374151]">
                {' '}
                · {notification.message}
              </span>
            ) : null}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`text-[12px] ${
                notification.unread
                  ? 'font-black text-[#2563eb]'
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

      <button
        type="button"
        onClick={() => onOptions(notification)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-white/70"
        aria-label="Notification options"
      >
        <i className="fa-solid fa-ellipsis text-[14px]" />
      </button>
    </div>
  )
}

function NotificationGroup({
  title,
  notifications,
  onOpen,
  onOptions,
}) {
  if (!notifications.length) return null

  return (
    <section>
      <h2 className="px-4 pb-2 pt-4 text-[18px] font-black text-[#111827]">
        {title}
      </h2>

      <div className="overflow-hidden border-y border-[#eef0f4] bg-white">
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
    <div className="mx-4 mt-5 rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-bell text-[20px]" />
      </div>
      <h2 className="text-[17px] font-black text-[#111827]">
        No {filter.toLowerCase()} notifications
      </h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        Comments, reactions, echoes, followers, reviews, orders, income, and
        admin notices will appear here.
      </p>
    </div>
  )
}

function OptionsSheet({
  notification,
  loading,
  onClose,
  onToggleRead,
  onDelete,
}) {
  useEffect(() => {
    if (!notification) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [notification])

  if (!notification) return null

  return (
    <div
      className="fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label="Notification options"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Close notification options"
      />

      <section className="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_50px_rgba(17,24,39,0.22)]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#cfd3da]" />

        <div className="mb-4 flex items-center gap-3 rounded-[18px] bg-[#f6f7f9] p-3">
          <NotificationIcon notification={notification} />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[13px] font-black leading-5 text-[#111827]">
              {notification.title}
            </p>
            <p className="mt-0.5 text-[12px] font-semibold text-[#8b93a1]">
              {notification.typeLabel} · {notification.time}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={onToggleRead}
          className="flex h-12 w-full items-center gap-3 rounded-[16px] px-4 text-left text-[14px] font-bold text-[#111827] active:bg-[#f3f4f6] disabled:opacity-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2ff] text-[#2563eb]">
            <i
              className={
                notification.unread
                  ? 'fa-solid fa-check'
                  : 'fa-regular fa-envelope'
              }
            />
          </span>
          {notification.unread ? 'Mark as read' : 'Mark as unread'}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onDelete}
          className="mt-1 flex h-12 w-full items-center gap-3 rounded-[16px] px-4 text-left text-[14px] font-bold text-[#dc2626] active:bg-[#fff1f2] disabled:opacity-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f2]">
            <i className="fa-regular fa-trash-can" />
          </span>
          Delete notification
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-[16px] bg-[#f3f4f6] text-[14px] font-black text-[#111827] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Please wait...' : 'Cancel'}
        </button>
      </section>
    </div>
  )
}

export default function AuthorPageNotificationsPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [message, setMessage] = useState('')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [optionsLoading, setOptionsLoading] = useState(false)

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setMessage('')

      const data = await fetchPageNotifications()

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

    if (activeFilter === 'Unread') {
      return notifications.filter((item) => item.unread)
    }

    return notifications.filter(
      (item) => item.typeLabel === activeFilter
    )
  }, [activeFilter, notifications])

  const newNotifications = filteredNotifications.filter(
    (item) => item.unread
  )
  const earlierNotifications = filteredNotifications.filter(
    (item) => !item.unread
  )

  async function handleOpen(notification) {
    if (notification.unread) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, unread: false }
            : item
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

  function handleOptions(notification) {
    setMessage('')
    setSelectedNotification(notification)
  }

  async function handleToggleRead() {
    if (!selectedNotification || optionsLoading) return

    try {
      setOptionsLoading(true)

      if (selectedNotification.unread) {
        await markNotificationRead(selectedNotification.id)
      } else {
        await markNotificationUnread(selectedNotification.id)
      }

      const nextUnread = !selectedNotification.unread

      setNotifications((current) =>
        current.map((item) =>
          item.id === selectedNotification.id
            ? { ...item, unread: nextUnread }
            : item
        )
      )

      setUnreadCount((current) =>
        selectedNotification.unread
          ? Math.max(0, current - 1)
          : current + 1
      )

      setSelectedNotification(null)
    } catch (error) {
      setMessage(error.message || 'Failed to update notification')
    } finally {
      setOptionsLoading(false)
    }
  }

  async function handleDelete() {
    if (!selectedNotification || optionsLoading) return

    try {
      setOptionsLoading(true)
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
      setOptionsLoading(false)
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
      setMessage(
        error.message || 'Failed to mark notifications as read'
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-[92px]">
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back to page"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[18px] font-black text-[#111827]">
            Page Notifications
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

      <main className="mx-auto max-w-[980px]">
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
                      ? 'bg-[#f3f4f6] font-medium text-[#111827]'
                      : 'bg-transparent font-normal text-[#9ca3af]'
                  }`}
                >
                  {filter}
                  {filter === 'Unread' && unreadCount > 0 ? (
                    <span className="ml-1 text-[11px] font-black text-[#2563eb]">
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
          <div>
            <NotificationGroup
              title="New"
              notifications={newNotifications}
              onOpen={handleOpen}
              onOptions={handleOptions}
            />

            <NotificationGroup
              title="Earlier"
              notifications={earlierNotifications}
              onOpen={handleOpen}
              onOptions={handleOptions}
            />
          </div>
        ) : (
          <EmptyState filter={activeFilter} />
        )}
      </main>

      <AuthorPageFooter active="Notifications" />

      <OptionsSheet
        notification={selectedNotification}
        loading={optionsLoading}
        onClose={() => {
          if (!optionsLoading) setSelectedNotification(null)
        }}
        onToggleRead={handleToggleRead}
        onDelete={handleDelete}
      />
    </div>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const filters = ['All', 'Unread', 'Comments', 'Orders', 'Income']

const typeMap = {
  comments: 'Comments',
  comment: 'Comments',
  mention: 'Comments',
  mentions: 'Comments',
  post: 'Comments',
  posts: 'Comments',
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

function normalizeNotification(item) {
  return {
    id: item.id,
    type: item.type || 'system',
    typeLabel: getNotificationTypeLabel(item.type),
    title: item.title || 'Notification',
    message: item.message || '',
    targetUrl: item.target_url || item.targetUrl || '',
    unread: !Boolean(item.is_read),
    time: formatTime(item.created_at),
    createdAt: item.created_at || '',
  }
}

async function fetchPageNotifications() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/authors/me/page-notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load notifications')
  }

  return {
    notifications: Array.isArray(data.notifications)
      ? data.notifications.map(normalizeNotification)
      : [],
    unreadCount: Number(data.unread_count || 0),
  }
}

async function markNotificationRead(notificationId) {
  const token = getAuthToken()

  if (!token || !notificationId) return

  await fetch(`${API_BASE_URL}/api/authors/me/page-notifications/${encodeURIComponent(notificationId)}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

async function markAllNotificationsRead() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/authors/me/page-notifications/read-all`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to mark notifications as read')
  }
}

function NotificationIcon({ notification }) {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
      <i className={`${getNotificationIcon(notification.type)} text-[17px]`} />
      {notification.unread ? (
        <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-[#f43f5e]" />
      ) : null}
    </div>
  )
}

function NotificationItem({ notification, onOpen, onOptions }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={`flex w-full gap-3 px-4 py-3 text-left transition active:bg-[#eef0f4] ${
        notification.unread ? 'bg-[#eef6ff]' : 'bg-white'
      }`}
    >
      <NotificationIcon notification={notification} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={`line-clamp-2 text-[14px] leading-5 text-[#111827] ${
                notification.unread ? 'font-black' : 'font-semibold'
              }`}
            >
              {notification.title}
              {notification.message ? (
                <span className="font-semibold text-[#374151]"> · {notification.message}</span>
              ) : null}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-[12px] ${
                  notification.unread ? 'font-black text-[#2563eb]' : 'font-semibold text-[#8b93a1]'
                }`}
              >
                {notification.time}
              </span>
              <span className="h-1 w-1 rounded-full bg-[#cbd5e1]" />
              <span className="text-[12px] font-semibold text-[#8b93a1]">{notification.typeLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onOptions(notification)
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-white/70"
            aria-label="Notification options"
          >
            <i className="fa-solid fa-ellipsis text-[14px]" />
          </button>
        </div>
      </div>
    </button>
  )
}

function NotificationGroup({ title, notifications, onOpen, onOptions }) {
  if (!notifications.length) return null

  return (
    <section>
      <h2 className="px-4 pb-2 pt-4 text-[18px] font-black text-[#111827]">{title}</h2>
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
      <h2 className="text-[17px] font-black text-[#111827]">No {filter.toLowerCase()} notifications</h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        Page income, orders, comments, mentions, and admin notices will appear here.
      </p>
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

  function handleOptions() {
    setMessage('Notification options will be connected later.')
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead()
      setNotifications((current) => current.map((item) => ({ ...item, unread: false })))
      setUnreadCount(0)
    } catch (error) {
      setMessage(error.message || 'Failed to mark notifications as read')
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

          <div className="text-[18px] font-black text-[#111827]">Page Notifications</div>

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
                    <span className="ml-1 text-[11px] font-black text-[#2563eb]">{unreadCount}</span>
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
    </div>
  )
}

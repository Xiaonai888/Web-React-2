import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'community', label: 'Comments' },
  { key: 'announcements', label: 'Announcements' },
]

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function getNotificationIcon(type) {
  if (type === 'community') return 'fas fa-comments'
  return 'fas fa-bullhorn'
}

function getNotificationColor(type) {
  if (type === 'community') return 'bg-[#F1F0FF] text-[#4F46E5]'
  return 'bg-[#FFF7D6] text-[#B77900]'
}

function getNotificationTypeLabel(type) {
  if (type === 'community') return 'Comments'
  return 'Announcements'
}

function formatCount(count) {
  if (count > 99) return '99+'
  return String(count)
}

function formatNotificationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-GB')
}

function mapNotification(item) {
  return {
    id: item.id,
    type: item.type || 'announcements',
    title: item.title || 'Notification',
    message: item.message || '',
    time: formatNotificationTime(item.created_at),
    link: item.link || '',
    isRead: Boolean(item.is_read),
  }
}

function emptyCounts() {
  return {
    all: 0,
    unread: 0,
    community: 0,
    announcements: 0,
  }
}

function decreaseUnreadCounts(current, notification) {
  if (!notification || notification.isRead) return current

  return {
    ...current,
    unread: Math.max(0, Number(current.unread || 0) - 1),
    community:
      notification.type === 'community'
        ? Math.max(0, Number(current.community || 0) - 1)
        : Number(current.community || 0),
    announcements:
      notification.type === 'announcements'
        ? Math.max(0, Number(current.announcements || 0) - 1)
        : Number(current.announcements || 0),
  }
}

export default function NotificationPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [counts, setCounts] = useState(emptyCounts)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') return notifications.filter((item) => !item.isRead)
    if (activeTab === 'community') return notifications.filter((item) => item.type === 'community')
    if (activeTab === 'announcements') return notifications.filter((item) => item.type === 'announcements')
    return notifications
  }, [activeTab, notifications])

  async function loadNotifications() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        navigate('/login')
        return
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to load notifications')
      }

      setNotifications((data.notifications || []).map(mapNotification))
      setCounts(data.counts || emptyCounts())
    } catch (error) {
      setMessage(error.message || 'Failed to load notifications')
      setNotifications([])
      setCounts(emptyCounts())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  async function markAllAsRead() {
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))
    setCounts((current) => ({
      ...current,
      unread: 0,
      community: 0,
      announcements: 0,
    }))

    try {
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: getHeaders(),
      })
    } catch {
    }
  }

  async function markNotificationAsRead(notification) {
    setNotifications((items) => items.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)))
    setCounts((current) => decreaseUnreadCounts(current, notification))

    try {
      await fetch(`${API_BASE_URL}/api/notifications/${notification.id}/read`, {
        method: 'PATCH',
        headers: getHeaders(),
      })
    } catch {
    }
  }

  async function openNotification(notification) {
    await markNotificationAsRead(notification)

    if (notification.type === 'announcements') {
      navigate(`/notifications/${notification.id}`)
      return
    }

    if (notification.link) {
      navigate(notification.link)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-10">
      <div className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="mx-auto flex max-w-[560px] items-center justify-between gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95">
            <i className="fas fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[22px] font-black text-[#111111]">Notifications</h1>
            <p className="mt-0.5 text-[12px] font-bold text-[#8A8F98]">All updates in one place</p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            aria-label="Mark all as read"
            disabled={!counts.unread}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95 disabled:opacity-40"
          >
            <i className="fa-solid fa-check-double text-[14px]" />
          </button>
        </div>

        <div className="mx-auto mt-4 flex max-w-[560px] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const count = counts[tab.key] || 0
            const showCount = tab.key !== 'all' && count > 0

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex shrink-0 items-center rounded-full px-4 py-2.5 text-[13px] font-black transition active:scale-95 ${
                  isActive ? 'bg-[#111111] text-white shadow-sm' : 'bg-[#EEF0F4] text-[#606773]'
                }`}
              >
                <span>{tab.label}</span>
                {showCount ? (
                  <span className="absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F6B800] px-1.5 text-[10px] font-black text-[#111111] shadow-sm">
                    {formatCount(count)}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <main className="mx-auto max-w-[560px] px-4 pt-4">
        {loading ? (
          <div className="mt-16 rounded-[26px] border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#111111]" />
            <p className="text-[13px] font-bold text-[#7B8190]">Loading notifications...</p>
          </div>
        ) : null}

        {!loading && message ? (
          <div className="rounded-[22px] border border-[#FECACA] bg-[#FFF1F1] p-4 text-[13px] font-bold text-[#E5484D]">
            {message}
          </div>
        ) : null}

        {!loading && !message && filteredNotifications.length ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const showTypePill = activeTab === 'all' || activeTab === 'unread'
              const canOpen = notification.type === 'announcements' || Boolean(notification.link)

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => openNotification(notification)}
                  className={`w-full rounded-[22px] border p-4 text-left shadow-sm active:scale-[0.99] ${canOpen ? 'cursor-pointer' : 'cursor-default'} ${
                    notification.isRead ? 'border-[#E5E7EB] bg-white' : 'border-[#FDE68A] bg-[#FFFBEA]'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getNotificationColor(notification.type)}`}>
                      <i className={`${getNotificationIcon(notification.type)} text-[15px]`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-[14px] font-black text-[#111111]">{notification.title}</h2>
                        {!notification.isRead ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F6B800]" /> : null}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#606773]">{notification.message}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#9CA3AF]">{notification.time}</span>
                        {showTypePill ? (
                          <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-black text-[#6B7280]">
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : null}

        {!loading && !message && !filteredNotifications.length ? (
          <div className="mt-16 rounded-[26px] border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF7D6] text-[#B77900]">
              <i className="fas fa-bell-slash text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-black text-[#111111]">No notifications</h2>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-[#7B8190]">You are all caught up for now.</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}

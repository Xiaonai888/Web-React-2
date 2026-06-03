import { useEffect, useMemo, useRef, useState } from 'react'
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

function formatDateGroup(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()
}

function formatNotificationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function mapNotification(item) {
  return {
    id: item.id,
    type: item.type || 'announcements',
    title: item.title || 'Notification',
    message: item.message || '',
    time: formatNotificationTime(item.created_at),
    dateGroup: formatDateGroup(item.created_at),
    link: item.link || '',
    imageUrl: item.image_url || '',
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

function groupNotificationsByDate(items) {
  const groups = []

  items.forEach((item) => {
    const label = item.dateGroup || 'OLDER'

    if (!groups.length || groups[groups.length - 1].label !== label) {
      groups.push({
        label,
        items: [],
      })
    }

    groups[groups.length - 1].items.push(item)
  })

  return groups
}

export default function NotificationPage({ isOpen = true, onClose }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [counts, setCounts] = useState(emptyCounts)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [sheetDragY, setSheetDragY] = useState(0)
  const dragStartYRef = useRef(null)
  const sheetDragYRef = useRef(0)

  if (!isOpen) return null

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') return notifications.filter((item) => !item.isRead)
    if (activeTab === 'community') return notifications.filter((item) => item.type === 'community')
    if (activeTab === 'announcements') return notifications.filter((item) => item.type === 'announcements')
    return notifications
  }, [activeTab, notifications])

  const groupedNotifications = useMemo(() => groupNotificationsByDate(filteredNotifications), [filteredNotifications])

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

  useEffect(() => {
  const scrollY = window.scrollY
  const previousPosition = document.body.style.position
  const previousTop = document.body.style.top
  const previousWidth = document.body.style.width
  const previousOverflow = document.body.style.overflow

  document.body.classList.add('shadow-notification-open')
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'

  return () => {
    document.body.classList.remove('shadow-notification-open')
    document.body.style.position = previousPosition
    document.body.style.top = previousTop
    document.body.style.width = previousWidth
    document.body.style.overflow = previousOverflow
    window.scrollTo(0, scrollY)
  }
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
    setSelectedAnnouncement({ ...notification, isRead: true })
    return
  }

  if (notification.link) {
    navigate(notification.link)
  }
}

  function handleSheetDragStart(event) {
  dragStartYRef.current = event.clientY
  sheetDragYRef.current = 0
  setSheetDragY(0)
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function handleSheetDragMove(event) {
  if (dragStartYRef.current === null) return

  const nextY = Math.max(0, event.clientY - dragStartYRef.current)
  sheetDragYRef.current = nextY
  setSheetDragY(nextY)
}

function handleSheetDragEnd() {
  const shouldClose = sheetDragYRef.current > 90

  dragStartYRef.current = null
  sheetDragYRef.current = 0
  setSheetDragY(0)

  if (shouldClose) {
    onClose?.()
  }
}

const freezeForYouHeaderStyle = `
  body.shadow-notification-open .for-you-top-bars {
    transform: translateY(0) !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: none !important;
  }

  body.shadow-notification-open footer {
  display: none !important;
  pointer-events: none !important;
}
`

return (
  <>
    <style>{freezeForYouHeaderStyle}</style>

    <div
      className="fixed inset-0 z-[2147483647] flex items-end justify-center bg-black/45"
      onClick={() => setSelectedAnnouncement(null)}
      
    >
      <div
  className="flex h-[72vh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[30px] bg-[#F6F7FB] shadow-2xl"
  style={{
    transform: `translateY(${sheetDragY}px)`,
    transition: dragStartYRef.current === null ? 'transform 0.18s ease-out' : 'none',
  }}
  onClick={(event) => event.stopPropagation()}
>
        <button
  type="button"
  aria-label="Drag down to close notifications"
  className="flex w-full shrink-0 cursor-grab touch-none justify-center pb-1 pt-2 active:cursor-grabbing"
  onPointerDown={handleSheetDragStart}
  onPointerMove={handleSheetDragMove}
  onPointerUp={handleSheetDragEnd}
  onPointerCancel={handleSheetDragEnd}
>
  <span className="h-1.5 w-12 rounded-full bg-[#B8BDC7]" />
</button>

        <div className="shrink-0 bg-[#F6F7FB] px-5 pb-3 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[24px] font-black leading-7 text-[#111111]">Shadow Notification</h1>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              aria-label="Mark all as read"
              disabled={!counts.unread}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111111] shadow-sm active:scale-95 disabled:opacity-40"
            >
              <i className="fa-solid fa-check-double text-[14px]" />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-y border-[#E5E7EB] bg-[#F6F7FB] px-5 py-3">
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key
              const count = counts[tab.key] || 0
              const showCount = tab.key !== 'all' && count > 0

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative shrink-0 rounded-full px-5 py-1.5 text-xs transition active:scale-95 ${
                    isActive ? 'bg-[#111827] text-white font-bold shadow-sm' : 'border border-gray-200 bg-white text-gray-600 font-semibold'
                  }`}
                >
                  <span>{tab.label}</span>
                  {showCount ? (
                    <span className="absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F6B800] px-1.5 text-[10px] font-black leading-none text-[#111111] shadow-sm">
                      {formatCount(count)}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4">
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

          {!loading && !message && groupedNotifications.length ? (
            <div className="space-y-6">
              {groupedNotifications.map((group) => (
                <section key={group.label}>
                  <h2 className="mb-3 text-[15px] font-black tracking-wide text-[#111827]">{group.label}</h2>

                  <div className="space-y-3">
                    {group.items.map((notification) => {
                      const showTypePill = activeTab === 'all' || activeTab === 'unread'
                      const canOpen = notification.type === 'announcements' || Boolean(notification.link)

                      return (
                        <button
  key={notification.id}
  type="button"
  onClick={() => openNotification(notification)}
  className={`w-full overflow-hidden rounded-[22px] border text-left shadow-sm active:scale-[0.99] ${
    canOpen ? 'cursor-pointer' : 'cursor-default'
  } ${notification.isRead ? 'border-[#E5E7EB] bg-white' : 'border-[#FDE68A] bg-[#FFFBEA]'}`}
>
  {notification.imageUrl ? (
    <div className="aspect-[16/9] w-full bg-[#F3F4F6]">
      <img
        src={notification.imageUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  ) : null}

  <div className="p-4">
    <div className="flex gap-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getNotificationColor(notification.type)}`}>
        <i className={`${getNotificationIcon(notification.type)} text-[15px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-black text-[#111111]">{notification.title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] font-bold text-[#9CA3AF]">{notification.time}</span>
            {!notification.isRead ? <span className="h-2.5 w-2.5 rounded-full bg-[#F6B800]" /> : null}
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#606773]">{notification.message}</p>

        {showTypePill ? (
          <span className="mt-3 inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-black text-[#6B7280]">
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
                </section>
              ))}
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

     {selectedAnnouncement ? (
  <div className="fixed inset-0 z-[2147483647] overflow-y-auto bg-white">
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#E5E7EB] bg-white px-4 py-3">
      <button
  type="button"
  onClick={() => setSelectedAnnouncement(null)}
  aria-label="Back to notifications"
  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95"
>
  <i className="fas fa-arrow-left text-[14px]" />
</button>

      <div className="min-w-0">
        <div className="text-[12px] font-black uppercase tracking-wide text-[#6B7280]">{selectedAnnouncement.dateGroup}</div>
        <div className="truncate text-[15px] font-black text-[#111111]">Announcement</div>
      </div>
    </div>

    <article className="mx-auto w-full max-w-[720px] px-5 pb-10 pt-6">
      <div className="text-[12px] font-bold text-[#9CA3AF]">{selectedAnnouncement.time}</div>
      <h1 className="mt-3 text-[28px] font-black leading-9 text-[#111111]">{selectedAnnouncement.title}</h1>

      <p className="mt-6 whitespace-pre-wrap text-[16px] font-semibold leading-8 text-[#4B5563]">
        {selectedAnnouncement.message}
      </p>

      {selectedAnnouncement.link ? (
        <button
          type="button"
          onClick={() => navigate(selectedAnnouncement.link)}
          className="mt-8 flex w-full items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-[13px] font-black text-white active:scale-95"
        >
          Open link
        </button>
      ) : null}
    </article>
  </div>
) : null}
    </div>
  </>
  )
}

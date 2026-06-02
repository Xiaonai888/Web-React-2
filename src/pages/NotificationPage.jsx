import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'CM-240601-001',
    type: 'community',
    title: 'New reply to your comment',
    message: 'Someone replied to your comment on Moon Blood Love.',
    time: '5 minutes ago',
    link: '/comments',
    isRead: false,
  },
  {
    id: 'AN-240601-001',
    type: 'announcements',
    title: 'Announcements',
    message: 'Shadow will have a short maintenance update tonight.',
    time: '1 hour ago',
    link: '/notifications',
    isRead: false,
  },
  {
    id: 'CM-240531-002',
    type: 'community',
    title: 'Comment liked',
    message: 'Your comment received a new like from another reader.',
    time: 'Yesterday',
    link: '/comments',
    isRead: true,
  },
  {
    id: 'AN-240531-001',
    type: 'announcements',
    title: 'Policy update',
    message: 'We updated community rules to keep reading discussions safe.',
    time: 'Yesterday',
    link: '/notifications',
    isRead: true,
  },
]

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'community', label: 'Community' },
  { key: 'announcements', label: 'Announcements' },
]

function getNotificationIcon(type) {
  if (type === 'community') return 'fas fa-comments'
  return 'fas fa-bullhorn'
}

function getNotificationColor(type) {
  if (type === 'community') return 'bg-[#EEF2FF] text-[#4F46E5]'
  return 'bg-[#ECFEFF] text-[#0891B2]'
}

function formatCount(count) {
  if (count > 99) return '99+'
  return String(count)
}

export default function NotificationPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((item) => !item.isRead).length,
      community: notifications.filter((item) => item.type === 'community' && !item.isRead).length,
      announcements: notifications.filter((item) => item.type === 'announcements' && !item.isRead).length,
    }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') return notifications.filter((item) => !item.isRead)
    if (activeTab === 'community') return notifications.filter((item) => item.type === 'community')
    if (activeTab === 'announcements') return notifications.filter((item) => item.type === 'announcements')
    return notifications
  }, [activeTab, notifications])

  function markAllAsRead() {
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))
  }

  function openNotification(notification) {
    setNotifications((items) => items.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)))
    if (notification.link) navigate(notification.link)
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

          <button type="button" onClick={markAllAsRead} className="rounded-full bg-[#111111] px-4 py-2 text-[12px] font-black text-white active:scale-95">
            Read all
          </button>
        </div>

        <div className="mx-auto mt-4 flex max-w-[560px] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const count = counts[tab.key]
            const showCount = tab.key !== 'all' && count > 0

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-black transition active:scale-95 ${
                  isActive ? 'bg-[#06B6D4] text-white shadow-sm' : 'bg-[#EEF0F4] text-[#606773]'
                }`}
              >
                <span>{tab.label}</span>
                {showCount ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-white text-[#111111]'}`}>{formatCount(count)}</span> : null}
              </button>
            )
          })}
        </div>
      </div>

      <main className="mx-auto max-w-[560px] px-4 pt-4">
        {filteredNotifications.length ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openNotification(notification)}
                className={`w-full rounded-[22px] border p-4 text-left shadow-sm active:scale-[0.99] ${notification.isRead ? 'border-[#E5E7EB] bg-white' : 'border-[#BAE6FD] bg-[#F0FDFF]'}`}
              >
                <div className="flex gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getNotificationColor(notification.type)}`}>
                    <i className={`${getNotificationIcon(notification.type)} text-[15px]`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-[14px] font-black text-[#111111]">{notification.title}</h2>
                      {!notification.isRead ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#06B6D4]" /> : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#606773]">{notification.message}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-[11px] font-bold text-[#9CA3AF]">{notification.time}</span>
                      <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#6B7280]">{notification.id}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-[26px] border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFEFF] text-[#0891B2]">
              <i className="fas fa-bell-slash text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-black text-[#111111]">No notifications</h2>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-[#7B8190]">You are all caught up for now.</p>
          </div>
        )}
      </main>
    </div>
  )
}

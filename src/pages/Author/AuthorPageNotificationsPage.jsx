import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

const filters = ['All', 'Unread', 'Comments', 'Orders', 'Income']

const demoNotifications = [
  {
    id: 'income-ready',
    section: 'New',
    type: 'Income',
    title: 'Withdrawal available',
    message: 'Your store and PDF income will be available to request on the 15th after admin review.',
    time: 'Today',
    unread: true,
    icon: 'fa-solid fa-wallet',
    route: '/author/page/dashboard',
  },
  {
    id: 'payment-method',
    section: 'New',
    type: 'Income',
    title: 'Check payment method',
    message: 'Make sure your payout information is correct before requesting withdrawal.',
    time: 'Today',
    unread: true,
    icon: 'fa-solid fa-money-check-dollar',
    route: '/author/payment-method',
  },
  {
    id: 'store-orders',
    section: 'New',
    type: 'Orders',
    title: 'Orders will appear here',
    message: 'New book and PDF orders from your Author Page Store will show in this tab.',
    time: 'Soon',
    unread: false,
    icon: 'fa-solid fa-bag-shopping',
    route: '/author/page/store',
  },
  {
  id: 'post-activity',
  section: 'Earlier',
  type: 'Comments',
  title: 'Post comments and mentions',
    message: 'Comments, mentions, likes, echoes, and reports on your posts will appear here.',
    time: 'Soon',
    unread: false,
    icon: 'fa-regular fa-file-lines',
    route: '/author/page',
  },
  {
    id: 'admin-notice',
    section: 'Earlier',
    type: 'System',
    title: 'Admin notices',
    message: 'Policy updates, product reviews, warnings, and page safety notices will appear here.',
    time: 'Soon',
    unread: false,
    icon: 'fa-solid fa-shield-halved',
    route: '',
  },
]

function NotificationIcon({ notification }) {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
      <i className={`${notification.icon} text-[17px]`} />
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
              <span className="font-semibold text-[#374151]"> · {notification.message}</span>
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
              <span className="text-[12px] font-semibold text-[#8b93a1]">{notification.type}</span>
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

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') return demoNotifications
    if (activeFilter === 'Unread') return demoNotifications.filter((item) => item.unread)
    return demoNotifications.filter((item) => item.type === activeFilter)
  }, [activeFilter])

  const newNotifications = filteredNotifications.filter((item) => item.section === 'New')
  const earlierNotifications = filteredNotifications.filter((item) => item.section !== 'New')

  function handleOpen(notification) {
    if (notification.route) {
      navigate(notification.route)
      return
    }

    setMessage('This notification will be connected later.')
  }

  function handleOptions() {
    setMessage('Notification options will be connected later.')
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
            onClick={() => setMessage('Mark all as read will be connected later.')}
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
                </button>
              )
            })}
          </div>
        </section>

        {filteredNotifications.length ? (
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

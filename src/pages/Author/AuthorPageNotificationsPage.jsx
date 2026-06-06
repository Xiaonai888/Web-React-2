import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

const filters = ['All', 'Unread', 'Income', 'Orders', 'Posts']

const demoNotifications = [
  {
    id: 'income-ready',
    type: 'Income',
    title: 'Withdrawal available',
    message: 'Your store and PDF income will be available to request on the 15th after admin review.',
    time: 'Today',
    unread: true,
    icon: 'fa-solid fa-wallet',
    action: 'View Income',
    route: '/author/page/dashboard',
  },
  {
    id: 'payment-method',
    type: 'Income',
    title: 'Check payment method',
    message: 'Make sure your payout information is correct before requesting withdrawal.',
    time: 'Today',
    unread: true,
    icon: 'fa-solid fa-money-check-dollar',
    action: 'Payment',
    route: '/author/payment-method',
  },
  {
    id: 'store-orders',
    type: 'Orders',
    title: 'Orders will appear here',
    message: 'New book and PDF orders from your Author Page Store will show in this tab.',
    time: 'Soon',
    unread: false,
    icon: 'fa-solid fa-bag-shopping',
    action: 'Store',
    route: '/author/page/store',
  },
  {
    id: 'post-activity',
    type: 'Posts',
    title: 'Post activity',
    message: 'Comments, likes, echoes, reports, and admin actions on your posts will appear here.',
    time: 'Soon',
    unread: false,
    icon: 'fa-regular fa-file-lines',
    action: 'View Page',
    route: '/author/page',
  },
  {
    id: 'admin-notice',
    type: 'System',
    title: 'Admin notices',
    message: 'Policy updates, product reviews, warnings, and page safety notices will appear here.',
    time: 'Soon',
    unread: false,
    icon: 'fa-solid fa-shield-halved',
    action: 'Details',
    route: '',
  },
]

function NotificationCard({ notification, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className="w-full rounded-[24px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <div className="flex gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
          <i className={`${notification.icon} text-[17px]`} />
          {notification.unread ? (
            <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-[#f43f5e]" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="line-clamp-1 text-[14px] font-black text-[#111827]">
                  {notification.title}
                </h3>
                <span className="shrink-0 rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#8b93a1] ring-1 ring-black/5">
                  {notification.type}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[12.5px] font-semibold leading-5 text-[#6b7280]">
                {notification.message}
              </p>
            </div>

            <span className="shrink-0 text-[11px] font-bold text-[#9ca3af]">{notification.time}</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`text-[11px] font-black ${notification.unread ? 'text-[#111827]' : 'text-[#9ca3af]'}`}>
              {notification.unread ? 'Unread' : 'Read'}
            </span>

            <span className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-black text-white">
              {notification.action}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

function EmptyState({ filter }) {
  return (
    <div className="rounded-[26px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-bell text-[20px]" />
      </div>
      <h2 className="text-[17px] font-black text-[#111827]">No {filter.toLowerCase()} notifications</h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        Page income, orders, posts, and admin notices will appear here.
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

  function handleOpen(notification) {
    if (notification.route) {
      navigate(notification.route)
      return
    }

    setMessage('This notification type will be connected later.')
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

          <div className="text-[16px] font-black text-[#111827]">Page Notifications</div>

          <button
            type="button"
            onClick={() => setMessage('Mark all as read will be connected later.')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] active:scale-95"
            aria-label="Mark all as read"
          >
            <i className="fa-solid fa-check-double text-[13px]" />
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        <section className="mb-4 overflow-hidden rounded-[28px] bg-[#111827] text-white shadow-sm">
          <div className="p-5">
            <div className="text-[12px] font-black uppercase tracking-[0.08em] text-white/55">Author Page</div>
            <h1 className="mt-1 text-[24px] font-black tracking-tight sm:text-[30px]">Notifications</h1>
            <p className="mt-1 text-[12px] font-bold text-white/60">
              Track income, orders, post activity, followers, and admin notices.
            </p>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10">
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Unread</div>
              <div className="mt-1 text-[20px] font-black">
                {demoNotifications.filter((item) => item.unread).length}
              </div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Income</div>
              <div className="mt-1 text-[20px] font-black">
                {demoNotifications.filter((item) => item.type === 'Income').length}
              </div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Orders</div>
              <div className="mt-1 text-[20px] font-black">
                {demoNotifications.filter((item) => item.type === 'Orders').length}
              </div>
            </div>
          </div>
        </section>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
          >
            {message}
          </button>
        ) : null}

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => {
            const active = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${
                  active ? 'bg-[#111827] text-white' : 'bg-white text-[#6b7280] ring-1 ring-black/5'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>

        {filteredNotifications.length ? (
          <section className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onOpen={handleOpen}
              />
            ))}
          </section>
        ) : (
          <EmptyState filter={activeFilter} />
        )}
      </main>

      <AuthorPageFooter active="Notifications" />
    </div>
  )
}

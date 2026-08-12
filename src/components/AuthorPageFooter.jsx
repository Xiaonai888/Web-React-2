import { useNavigate } from 'react-router-dom'

function PageIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M5 21V4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M5 5h11l-1.8 3L16 11H5V5Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DashboardIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <rect x="4" y="12" width="3.5" height="7" rx="1" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" />
      <rect x="10.25" y="5" width="3.5" height="14" rx="1" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" />
      <rect x="16.5" y="9" width="3.5" height="10" rx="1" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function StoreIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        d="M5.5 8.5h13l1 11H4.5l1-11Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function NotificationIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        d="M6.5 10a5.5 5.5 0 0 1 11 0v4.2l1.5 2.3H5l1.5-2.3V10Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function AuthorPageFooter({ active = 'Page' }) {
  const navigate = useNavigate()

  const items = [
    {
      label: 'Page',
      Icon: PageIcon,
      action: () => navigate('/author/page'),
    },
    {
      label: 'Dashboard',
      Icon: DashboardIcon,
      action: () => navigate('/author/page/dashboard'),
    },
    {
      label: 'Store',
      Icon: StoreIcon,
      action: () => navigate('/author/page/store'),
    },
    {
      label: 'Notifications',
      Icon: NotificationIcon,
      action: () => navigate('/author/page/notifications'),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-[#eef0f4] bg-white/95 shadow-[0_-8px_24px_rgba(17,24,39,0.06)] backdrop-blur dark:border-white/10 dark:bg-[#0d0f16]/95">
      <div className="mx-auto grid h-[66px] max-w-5xl grid-cols-4">
        {items.map((item) => {
          const isActive = active === item.label
          const Icon = item.Icon

          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-extrabold transition active:scale-95 ${
                isActive
                  ? 'text-[#8b5cf6] dark:text-[#a78bfa]'
                  : 'text-[#9aa1ad] dark:text-white/45'
              }`}
            >
              <Icon active={isActive} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default AuthorPageFooter

import { useNavigate } from 'react-router-dom'

function AuthorPageFooter({ active = 'Page', onComingSoon }) {
  const navigate = useNavigate()

  const items = [
    { label: 'Page', icon: 'fa-regular fa-flag', action: () => navigate('/author/page') },
    { label: 'Dashboard', icon: 'fa-solid fa-chart-simple', action: () => onComingSoon?.('Dashboard') },
    { label: 'Store', icon: 'fa-solid fa-bag-shopping', action: () => navigate('/author/page/store') },
    { label: 'Notifications', icon: 'fa-regular fa-bell', action: () => onComingSoon?.('Notifications') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-[#eef0f4] bg-white/95 shadow-[0_-8px_24px_rgba(17,24,39,0.06)] backdrop-blur dark:border-white/10 dark:bg-[#0d0f16]/95">
      <div className="mx-auto grid h-[66px] max-w-5xl grid-cols-4">
        {items.map((item) => {
          const isActive = active === item.label

          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-extrabold transition active:scale-95 ${
                isActive ? 'text-[#111827] dark:text-white' : 'text-[#9aa1ad] dark:text-white/45'
              }`}
            >
              <i className={`${item.icon} text-[18px]`} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default AuthorPageFooter

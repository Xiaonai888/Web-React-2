import { Bell, BarChart3, Flag, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AuthorPageFooter({ active = 'Page' }) {
  const navigate = useNavigate()

  const items = [
    {
      label: 'Page',
      activeIcon: 'fa-solid fa-flag',
      OutlineIcon: Flag,
      action: () => navigate('/author/page'),
    },
    {
      label: 'Dashboard',
      activeIcon: 'fa-solid fa-chart-simple',
      OutlineIcon: BarChart3,
      action: () => navigate('/author/page/dashboard'),
    },
    {
      label: 'Store',
      activeIcon: 'fa-solid fa-bag-shopping',
      OutlineIcon: ShoppingBag,
      action: () => navigate('/author/page/store'),
    },
    {
      label: 'Notifications',
      activeIcon: 'fa-solid fa-bell',
      OutlineIcon: Bell,
      action: () => navigate('/author/page/notifications'),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-[#eef0f4] bg-white/95 shadow-[0_-8px_24px_rgba(17,24,39,0.06)] backdrop-blur dark:border-white/10 dark:bg-[#0d0f16]/95">
      <div className="mx-auto grid h-[66px] max-w-5xl grid-cols-4">
        {items.map((item) => {
          const isActive = active === item.label
          const OutlineIcon = item.OutlineIcon

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
              {isActive ? (
                <i className={`${item.activeIcon} text-[16px]`} />
              ) : (
                <OutlineIcon
                  aria-hidden="true"
                  size={17}
                  strokeWidth={2.1}
                />
              )}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default AuthorPageFooter

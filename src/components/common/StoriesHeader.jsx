import { Bell, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storiesHeader', {
  en: { genres: 'Genres', search: 'Search', notifications: 'Notifications' },
  km: { genres: 'ប្រភេទរឿង', search: 'ស្វែងរក', notifications: 'ការជូនដំណឹង' },
  zh: { genres: '类型', search: '搜索', notifications: '通知' },
  ja: { genres: 'ジャンル', search: '検索', notifications: '通知' },
  ko: { genres: '장르', search: '검색', notifications: '알림' },
})

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

export default function StoriesHeader({
  notificationUnreadCount = 0,
  onOpenNotifications,
}) {
  const { t } = useDisplayTranslation()
  const { pathname } = useLocation()
  const rawCount = Number(notificationUnreadCount)
  const unreadCount = Number.isFinite(rawCount) ? Math.max(0, Math.floor(rawCount)) : 0
  const locale = DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
  const badgeCount = new Intl.NumberFormat(locale).format(Math.min(unreadCount, 99))

  return (
    <header className="app-nav flex items-center justify-between px-4 py-3">
      <div className="flex h-9 w-[92px] items-center">
        <img
          src="/assets/Icons/Logo Shadow 2.svg"
          alt="Shadow"
          className="h-full w-full object-contain object-left"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="flex items-center gap-5" style={{ color: 'var(--shadow-icon)' }}>
        <Link
          to="/genres"
          className="flex h-6 w-6 items-center justify-center"
          aria-label={t('storiesHeader.genres')}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
          </svg>
        </Link>

        <Link
          to={pathname === '/manga' ? '/search?story_type=manga' : '/search'}
          className="flex h-6 w-6 items-center justify-center"
          aria-label={t('storiesHeader.search')}
        >
          <Search size={20} strokeWidth={1.8} aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative flex h-6 w-6 items-center justify-center"
          aria-label={t('storiesHeader.notifications')}
        >
          <Bell size={20} strokeWidth={1.8} aria-hidden="true" />
          {unreadCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F6B800] px-1.5 text-[10px] font-medium leading-none text-[#111827] shadow-sm">
              {unreadCount > 99 ? `${badgeCount}+` : badgeCount}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  )
}

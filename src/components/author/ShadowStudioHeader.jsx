import { Bell, CirclePlus, Play, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('shadowStudioHeader', {
  en: { home: 'Shadow Studio', create: 'Add YouTube video', notifications: 'Video notifications', profile: 'Profile' },
  km: { home: 'Shadow Studio', create: 'បន្ថែមវីដេអូ YouTube', notifications: 'ការជូនដំណឹងវីដេអូ', profile: 'ប្រវត្តិរូប' },
  zh: { home: 'Shadow Studio', create: '添加 YouTube 视频', notifications: '视频通知', profile: '个人资料' },
  ja: { home: 'Shadow Studio', create: 'YouTube動画を追加', notifications: '動画の通知', profile: 'プロフィール' },
  ko: { home: 'Shadow Studio', create: 'YouTube 동영상 추가', notifications: '동영상 알림', profile: '프로필' },
})

export default function ShadowStudioHeader({
  avatarUrl = '',
  videoUnreadCount = 0,
  onAddVideo,
  onOpenNotifications,
  onOpenProfile,
}) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const unread = Math.max(0, Number(videoUnreadCount) || 0)

  return (
    <header className="sticky top-0 z-[70] w-full border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] text-[var(--shadow-text-primary)]">
      <div className="mx-auto flex min-h-[58px] max-w-5xl items-center justify-between gap-2 px-3 sm:px-5">
        <button
          type="button"
          onClick={() => navigate('/author/reel/studio/dashboard')}
          aria-label={t('shadowStudioHeader.home')}
          className="flex min-w-0 items-center gap-2 rounded-lg py-1 text-left"
        >
          <span className="flex h-[29px] w-[40px] shrink-0 items-center justify-center rounded-[9px] bg-[#ff0033] text-white">
            <Play size={20} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="truncate text-[17px] font-bold tracking-tight sm:text-xl">Shadow Studio</span>
        </button>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label={t('shadowStudioHeader.create')}
            title={t('shadowStudioHeader.create')}
            disabled={typeof onAddVideo !== 'function'}
            onClick={onAddVideo}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)] disabled:cursor-default disabled:opacity-50"
          >
            <CirclePlus size={25} strokeWidth={1.9} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t('shadowStudioHeader.notifications')}
            title={t('shadowStudioHeader.notifications')}
            disabled={typeof onOpenNotifications !== 'function'}
            onClick={onOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)] disabled:cursor-default disabled:opacity-50"
          >
            <Bell size={24} strokeWidth={1.9} aria-hidden="true" />
            {unread > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff0033] px-0.5 text-[9px] font-bold leading-none text-white">{unread > 99 ? '99+' : unread}</span>}
          </button>
          <button
            type="button"
            aria-label={t('shadowStudioHeader.profile')}
            title={t('shadowStudioHeader.profile')}
            disabled={typeof onOpenProfile !== 'function'}
            onClick={onOpenProfile}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] disabled:cursor-default"
          >
            {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : <UserRound size={22} strokeWidth={1.75} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}

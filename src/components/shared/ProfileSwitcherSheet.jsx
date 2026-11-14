import { useEffect } from 'react'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('sharedProfileSwitcher', {
  en: {
    close: 'Close profile switcher',
    reader: 'Reader',
    authorPage: 'Author Page',
    notification: '{{count}} notification',
    notifications: '{{count}} notifications',
    manage: 'Manage Account',
  },
  km: {
    close: 'បិទការប្តូរ Profile',
    reader: 'អ្នកអាន',
    authorPage: 'ទំព័រអ្នកនិពន្ធ',
    notification: '{{count}} ការជូនដំណឹង',
    notifications: '{{count}} ការជូនដំណឹង',
    manage: 'គ្រប់គ្រងគណនី',
  },
  zh: {
    close: '关闭个人资料切换',
    reader: '读者',
    authorPage: '作者页面',
    notification: '{{count}} 条通知',
    notifications: '{{count}} 条通知',
    manage: '管理账号',
  },
  ja: {
    close: 'プロフィール切替を閉じる',
    reader: '読者',
    authorPage: '作者ページ',
    notification: '{{count}} 件の通知',
    notifications: '{{count}} 件の通知',
    manage: 'アカウント管理',
  },
  ko: {
    close: '프로필 전환 닫기',
    reader: '독자',
    authorPage: '작가 페이지',
    notification: '알림 {{count}}개',
    notifications: '알림 {{count}}개',
    manage: '계정 관리',
  },
})

function safeImageUrl(value) {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return ''
  if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=]+$/i.test(raw)) return raw
  try {
    const url = new URL(raw, window.location.origin)
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href
    if (url.protocol === 'blob:' && url.origin === window.location.origin) return url.href
  } catch {}
  return ''
}

function SwitcherAvatar({ url, name, letter, frameUrl, isAuthor = false }) {
  const image = safeImageUrl(url)
  const frame = safeImageUrl(frameUrl)
  const fallback = String(letter || name || (isAuthor ? 'A' : 'R')).charAt(0).toUpperCase()

  return (
    <span className="relative block h-12 w-12 shrink-0">
      <span className={`absolute ${frame ? 'inset-[17%]' : 'inset-0'} flex items-center justify-center overflow-hidden rounded-full ${isAuthor ? 'bg-white text-[#111827] ring-1 ring-black/10 dark:bg-white/10 dark:text-white dark:ring-white/10' : 'bg-[#202638] text-white'}`}>
        {image ? (
          <img src={image} alt={name || ''} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[18px] font-extrabold">{fallback}</span>
        )}
      </span>
      {frame ? (
        <img src={frame} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
      ) : null}
    </span>
  )
}

function SelectionIcon({ selected }) {
  return selected ? (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]">
      <i className="fa-solid fa-check text-[10px]" />
    </span>
  ) : (
    <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#c6c9d1] dark:text-white/35" />
  )
}

export default function ProfileSwitcherSheet({
  open,
  onClose,
  displayName,
  avatarUrl,
  avatarLetter,
  frameUrl,
  authorPage,
  authorNotificationCount = 0,
  activeProfile = 'reader',
  onOwnAccount,
  onAuthorPage,
  onManageAccount,
}) {
  const { t } = useDisplayTranslation()

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const authorName = authorPage?.page_name || authorPage?.name || t('sharedProfileSwitcher.authorPage')
  const authorAvatar = authorPage?.avatar_url || authorPage?.profile_image_url || ''
  const authorLetter = authorName.charAt(0).toUpperCase() || 'A'
  const notificationCount = Math.max(0, Number(authorNotificationCount) || 0)
  const selectedAuthor = activeProfile === 'author'
  const formattedCount = new Intl.NumberFormat('en-US').format(notificationCount)

  return (
    <div className="fixed inset-0 z-[130]">
      <button
        type="button"
        aria-label={t('sharedProfileSwitcher.close')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('sharedProfileSwitcher.close')}
        className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-hidden rounded-t-[28px] bg-white px-4 pb-8 pt-4 shadow-2xl md:bottom-auto md:left-1/2 md:right-auto md:top-20 md:w-[380px] md:-translate-x-1/2 md:rounded-[24px] dark:bg-[#12141d]"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden dark:bg-white/15" />

        <div className="overflow-hidden rounded-[24px] border border-[#eceaf2] bg-white shadow-sm dark:border-white/10 dark:bg-[#171923]">
          <button
            type="button"
            onClick={onOwnAccount}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <SwitcherAvatar url={avatarUrl} name={displayName} letter={avatarLetter} frameUrl={frameUrl} />
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[#111827] dark:text-white">
                  {displayName || t('sharedProfileSwitcher.reader')}
                </div>
              </div>
            </div>
            <SelectionIcon selected={!selectedAuthor} />
          </button>

          <button
            type="button"
            onClick={onAuthorPage}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <SwitcherAvatar url={authorAvatar} name={authorName} letter={authorLetter} isAuthor />
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[#111827] dark:text-white">
                  {authorName}
                </div>
                {notificationCount > 0 ? (
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8d94a1] dark:text-white/50">
                    <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                    <span>
                      {t(notificationCount === 1 ? 'sharedProfileSwitcher.notification' : 'sharedProfileSwitcher.notifications', { count: formattedCount })}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
            <SelectionIcon selected={selectedAuthor} />
          </button>
        </div>

        <button
          type="button"
          onClick={onManageAccount}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-[#d9dce4] bg-white text-[14px] font-normal text-[#111827] active:scale-[0.99] dark:border-white/10 dark:bg-[#171923] dark:text-white"
        >
          {t('sharedProfileSwitcher.manage')}
        </button>

        <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
          <img
            src="/assets/Icons/Logo Shadow 2.svg"
            alt=""
            className="h-10 w-auto object-contain opacity-90"
          />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { beginAuthorMenuNavigation } from '../../utils/authorMenuNavigation'
import { getAuthToken } from '../../config/api'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { loadCountrySettings } from '../../utils/countrySettings'
import { canAccessAuthorPreOrder, authorPreOrderText } from '../../utils/authorPreOrderRules'

registerTranslationNamespace('authorMenuSheet', {
  en: { authorPage: 'Author Page', closeMenu: 'Close author menu', title: 'Author Menu', switchProfile: 'Switch Profile', finance: 'Finance', settings: 'Settings' },
  km: { authorPage: 'ទំព័រអ្នកនិពន្ធ', closeMenu: 'បិទ Menu អ្នកនិពន្ធ', title: 'Menu អ្នកនិពន្ធ', switchProfile: 'ប្តូរ Profile', finance: 'ហិរញ្ញវត្ថុ', settings: 'ការកំណត់' },
  zh: { authorPage: '作者主页', closeMenu: '关闭作者菜单', title: '作者菜单', switchProfile: '切换个人资料', finance: '财务', settings: '设置' },
  ja: { authorPage: '作者ページ', closeMenu: '作者メニューを閉じる', title: '作者メニュー', switchProfile: 'プロフィール切替', finance: '収益', settings: '設定' },
  ko: { authorPage: '작가 페이지', closeMenu: '작가 메뉴 닫기', title: '작가 메뉴', switchProfile: '프로필 전환', finance: '재정', settings: '설정' },
})

export default function AuthorMenuSheet({ open, author, onClose, onSwitchProfile, source = 'page', activeTab }) {
  const { t, language } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [verifiedAccess, setVerifiedAccess] = useState(null)
  const isOwner = Boolean(author?.is_owner)
  const authorId = String(author?.id || author?.author_page_id || '')
  const token = open ? getAuthToken() : ''

  useEffect(() => {
    setVerifiedAccess(null)
    if (!open || !isOwner || !token) return undefined

    let active = true
    loadCountrySettings()
      .then(settings => {
        if (active && token === getAuthToken() && canAccessAuthorPreOrder(settings)) {
          setVerifiedAccess({ token, authorId })
        }
      })
      .catch(() => {
        if (active) setVerifiedAccess(null)
      })

    return () => {
      active = false
    }
  }, [open, isOwner, authorId, token])

  if (!open) return null

  const preOrderAllowed = isOwner && Boolean(token) && verifiedAccess?.token === token && verifiedAccess?.authorId === authorId
  const pageName = String(author?.page_name || author?.name || t('authorMenuSheet.authorPage'))
  const pageLogo = author?.avatar_url || ''
  const pageLetter = pageName.charAt(0).toUpperCase() || 'A'
  const openPage = (path) => {
  onClose()

  beginAuthorMenuNavigation({
    navigate,
    location,
    destination: path,
    source,
    activeTab,
  })
}
  const items = [
    ...(preOrderAllowed ? [{ icon: 'fa-book-open', label: authorPreOrderText(language, 'pageTitle'), path: '/author/page/pre-order' }] : []),
    { icon: 'fa-wallet', label: t('authorMenuSheet.finance'), path: '/author/page/finance' },
    { icon: 'fa-gear', label: t('authorMenuSheet.settings'), path: '/author/page-settings' },
  ]

  return (
    <div className="fixed inset-0 z-[235]">
      <button
        type="button"
        aria-label={t('authorMenuSheet.closeMenu')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />
      <aside className="absolute bottom-0 left-0 top-0 flex w-[84vw] max-w-[390px] flex-col overflow-y-auto bg-[var(--shadow-bg-surface)] px-4 pb-8 pt-4 shadow-2xl">
        <div className="mb-4 shrink-0">
          <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorMenuSheet.title')}</h2>
        </div>
        <div className="shrink-0 bg-[var(--shadow-bg-surface)] py-3">
          <button type="button" onClick={onSwitchProfile} className="flex w-full items-center gap-3 text-left active:scale-[0.99]">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
              {pageLogo ? <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" /> : <span className="text-[20px] font-extrabold">{pageLetter}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[16px] font-black text-[var(--shadow-text-primary)]">{pageName}</div>
              <div className="mt-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorMenuSheet.switchProfile')}</div>
            </div>
          </button>
        </div>
        <div className="mt-5 shrink-0 space-y-1">
          {items.map(item => (
            <button key={item.path} type="button" onClick={() => openPage(item.path)} className="flex w-full items-center gap-3 py-2.5 text-left active:opacity-70">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
                <i className={`fa-solid ${item.icon} text-[17px]`} />
              </span>
              <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="pointer-events-none mt-auto flex shrink-0 items-center justify-center pt-8">
          <img src="/assets/Icons/Logo%20Shadow%202.webp" alt="" className="h-10 w-auto max-w-32 object-contain opacity-90 dark:invert" />
        </div>
      </aside>
    </div>
  )
}

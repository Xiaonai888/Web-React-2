import { BarChart3, Clapperboard, LayoutDashboard, UserRound, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowStudioFooter', {
  en: { dashboard: 'Dashboard', content: 'Content', analytics: 'Analytics', community: 'Community', me: 'Me' },
  km: { dashboard: 'Dashboard', content: 'Content', analytics: 'Analytics', community: 'Community', me: 'Me' },
  zh: { dashboard: '数据总览', content: '内容', analytics: '数据分析', community: '社区', me: '我的' },
  ja: { dashboard: 'ダッシュボード', content: 'コンテンツ', analytics: 'アナリティクス', community: 'コミュニティ', me: 'マイページ' },
  ko: { dashboard: '대시보드', content: '콘텐츠', analytics: '분석', community: '커뮤니티', me: '내 정보' },
})

const TABS = [
  { key: 'dashboard', Icon: LayoutDashboard },
  { key: 'content', Icon: Clapperboard },
  { key: 'analytics', Icon: BarChart3 },
  { key: 'community', Icon: UsersRound },
  { key: 'me', Icon: UserRound },
]

export default function ShadowStudioFooter({
  activeTab = 'content',
  onTabChange,
  enabledTabs = TABS.map(tab => tab.key),
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const analyticsEnabled = enabledTabs.includes('analytics') ||
    (enabledTabs.includes('dashboard') && enabledTabs.includes('content'))

  return (
    <nav
      aria-label="Shadow Studio"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] shadow-[0_-3px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto grid min-h-[64px] max-w-5xl grid-cols-5 items-stretch">
        {TABS.map(({ key, Icon }) => {
          const selected = activeTab === key
          const enabled = key === 'me' || key === 'community' || enabledTabs.includes(key) ||
            (key === 'analytics' && analyticsEnabled)
          return (
            <button
              key={key}
              type="button"
              disabled={!enabled}
              aria-current={selected ? 'page' : undefined}
              aria-label={t(`shadowStudioFooter.${key}`)}
              onClick={() => {
                if (key === 'analytics') navigate('/author/reel/studio/analytics')
                else if (key === 'community') navigate('/author/reel/studio/community')
                else if (key === 'me') navigate('/author/reel/studio/me')
                else onTabChange?.(key)
              }}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-2 transition-colors active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50 ${selected ? 'text-[var(--shadow-accent)]' : 'text-[var(--shadow-text-secondary)]'}`}
            >
              <Icon size={23} strokeWidth={selected ? 2.5 : 1.9} aria-hidden="true" />
              <span className={`max-w-full truncate text-[10px] leading-tight ${selected ? 'font-semibold' : 'font-normal'}`}>{t(`shadowStudioFooter.${key}`)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

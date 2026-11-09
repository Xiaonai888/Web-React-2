
import { BarChart3, CircleDollarSign, Clapperboard, LayoutDashboard, UsersRound } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowStudioFooter', {
  en: { dashboard: 'Dashboard', content: 'Content', analytics: 'Analytics', community: 'Community', earn: 'Earn' },
  km: { dashboard: 'Dashboard', content: 'Content', analytics: 'Analytics', community: 'Community', earn: 'Earn' },
  zh: { dashboard: '数据总览', content: '内容', analytics: '数据分析', community: '社区', earn: '收益' },
  ja: { dashboard: 'ダッシュボード', content: 'コンテンツ', analytics: 'アナリティクス', community: 'コミュニティ', earn: '収益' },
  ko: { dashboard: '대시보드', content: '콘텐츠', analytics: '분석', community: '커뮤니티', earn: '수익' },
})

const TABS = [
  { key: 'dashboard', Icon: LayoutDashboard },
  { key: 'content', Icon: Clapperboard },
  { key: 'analytics', Icon: BarChart3 },
  { key: 'community', Icon: UsersRound },
  { key: 'earn', Icon: CircleDollarSign },
]

export default function ShadowStudioFooter({
  activeTab = 'content',
  onTabChange,
  enabledTabs = TABS.map(tab => tab.key),
}) {
  const { t } = useDisplayTranslation()

  return (
    <nav
      aria-label="Shadow Studio"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] shadow-[0_-3px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto grid min-h-[64px] max-w-5xl grid-cols-5 items-stretch">
        {TABS.map(({ key, Icon }) => {
          const selected = activeTab === key

          return (
            <button
              key={key}
              type="button"
              disabled={!enabledTabs.includes(key)}
              aria-current={selected ? 'page' : undefined}
              aria-label={t(`shadowStudioFooter.${key}`)}
              onClick={() => onTabChange?.(key)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-2 transition-colors active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50 ${
                selected
                  ? 'text-[var(--shadow-text-primary)]'
                  : 'text-[var(--shadow-text-secondary)]'
              }`}
            >
              <Icon
                size={23}
                strokeWidth={selected ? 2.5 : 1.9}
                aria-hidden="true"
              />
              <span
                className={`max-w-full truncate text-[10px] leading-tight ${
                  selected ? 'font-semibold' : 'font-normal'
                }`}
              >
                {t(`shadowStudioFooter.${key}`)}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

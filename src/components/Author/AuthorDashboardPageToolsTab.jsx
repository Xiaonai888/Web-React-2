import { useEffect, useMemo, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDashboardPageTools', {
  "en": {
    "justNow": "Just now",
    "minutesAgo": "{{count}}m ago",
    "hoursAgo": "{{count}}h ago",
    "daysAgo": "{{count}}d ago",
    "pageActivityUpdated": "Page activity updated",
    "authorPageReceivedUpdate": "Your Author Page received a new update.",
    "pageToolsOverview": "Page Tools Overview",
    "liveData": "Live data",
    "activeTools": "Active Tools",
    "customLinks": "Custom Links",
    "pinnedItems": "Pinned Items",
    "profileCompletion": "Profile Completion",
    "quickAccess": "Quick Access",
    "viewAll": "View All",
    "editInfo": "Edit Info",
    "theme": "Theme",
    "links": "Links",
    "pinnedPosts": "Pinned Posts",
    "recentChanges": "Recent Changes",
    "noRecentChanges": "No recent changes",
    "pageUpdatesDescription": "Page updates will appear here.",
    "managePageTools": "Manage Page Tools"
  },
  "km": {
    "justNow": "ឥឡូវនេះ",
    "minutesAgo": "{{count}} នាទីមុន",
    "hoursAgo": "{{count}} ម៉ោងមុន",
    "daysAgo": "{{count}} ថ្ងៃមុន",
    "pageActivityUpdated": "សកម្មភាពទំព័របានអាប់ដេត",
    "authorPageReceivedUpdate": "ទំព័រអ្នកនិពន្ធរបស់អ្នកមានការអាប់ដេតថ្មី។",
    "pageToolsOverview": "ទិដ្ឋភាពឧបករណ៍ទំព័រ",
    "liveData": "ទិន្នន័យផ្ទាល់",
    "activeTools": "ឧបករណ៍សកម្ម",
    "customLinks": "តំណផ្ទាល់ខ្លួន",
    "pinnedItems": "ធាតុដែលបានខ្ទាស់",
    "profileCompletion": "ភាពពេញលេញនៃប្រវត្តិរូប",
    "quickAccess": "ចូលប្រើរហ័ស",
    "viewAll": "មើលទាំងអស់",
    "editInfo": "កែព័ត៌មាន",
    "theme": "រចនាប័ទ្ម",
    "links": "តំណ",
    "pinnedPosts": "ប្រកាសដែលបានខ្ទាស់",
    "recentChanges": "ការផ្លាស់ប្តូរថ្មីៗ",
    "noRecentChanges": "មិនមានការផ្លាស់ប្តូរថ្មីៗ",
    "pageUpdatesDescription": "ការអាប់ដេតទំព័រនឹងបង្ហាញនៅទីនេះ។",
    "managePageTools": "គ្រប់គ្រងឧបករណ៍ទំព័រ"
  },
  "zh": {
    "justNow": "刚刚",
    "minutesAgo": "{{count}}分钟前",
    "hoursAgo": "{{count}}小时前",
    "daysAgo": "{{count}}天前",
    "pageActivityUpdated": "页面活动已更新",
    "authorPageReceivedUpdate": "你的作者主页有新的更新。",
    "pageToolsOverview": "页面工具概览",
    "liveData": "实时数据",
    "activeTools": "启用工具",
    "customLinks": "自定义链接",
    "pinnedItems": "置顶项目",
    "profileCompletion": "资料完成度",
    "quickAccess": "快捷入口",
    "viewAll": "查看全部",
    "editInfo": "编辑信息",
    "theme": "主题",
    "links": "链接",
    "pinnedPosts": "置顶动态",
    "recentChanges": "最近更改",
    "noRecentChanges": "暂无最近更改",
    "pageUpdatesDescription": "页面更新会显示在这里。",
    "managePageTools": "管理页面工具"
  },
  "ja": {
    "justNow": "たった今",
    "minutesAgo": "{{count}}分前",
    "hoursAgo": "{{count}}時間前",
    "daysAgo": "{{count}}日前",
    "pageActivityUpdated": "ページアクティビティが更新されました",
    "authorPageReceivedUpdate": "作者ページに新しい更新がありました。",
    "pageToolsOverview": "ページツール概要",
    "liveData": "ライブデータ",
    "activeTools": "有効なツール",
    "customLinks": "カスタムリンク",
    "pinnedItems": "固定アイテム",
    "profileCompletion": "プロフィール完成度",
    "quickAccess": "クイックアクセス",
    "viewAll": "すべて見る",
    "editInfo": "情報を編集",
    "theme": "テーマ",
    "links": "リンク",
    "pinnedPosts": "固定投稿",
    "recentChanges": "最近の変更",
    "noRecentChanges": "最近の変更はありません",
    "pageUpdatesDescription": "ページの更新がここに表示されます。",
    "managePageTools": "ページツールを管理"
  },
  "ko": {
    "justNow": "방금",
    "minutesAgo": "{{count}}분 전",
    "hoursAgo": "{{count}}시간 전",
    "daysAgo": "{{count}}일 전",
    "pageActivityUpdated": "페이지 활동이 업데이트되었습니다",
    "authorPageReceivedUpdate": "작가 페이지에 새로운 업데이트가 있습니다.",
    "pageToolsOverview": "페이지 도구 개요",
    "liveData": "실시간 데이터",
    "activeTools": "활성 도구",
    "customLinks": "사용자 지정 링크",
    "pinnedItems": "고정 항목",
    "profileCompletion": "프로필 완성도",
    "quickAccess": "빠른 실행",
    "viewAll": "모두 보기",
    "editInfo": "정보 수정",
    "theme": "테마",
    "links": "링크",
    "pinnedPosts": "고정 게시물",
    "recentChanges": "최근 변경",
    "noRecentChanges": "최근 변경 사항이 없습니다",
    "pageUpdatesDescription": "페이지 업데이트가 여기에 표시됩니다.",
    "managePageTools": "페이지 도구 관리"
  }
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(number)
}

function formatTimeAgo(value, t) {
  if (!value) return t('authorDashboardPageTools.justNow')

  const date = new Date(value)
  const time = date.getTime()

  if (Number.isNaN(time)) return t('authorDashboardPageTools.justNow')

  const seconds = Math.max(1, Math.floor((Date.now() - time) / 1000))

  if (seconds < 60) return t('authorDashboardPageTools.justNow')
  if (seconds < 3600) {
    return t('authorDashboardPageTools.minutesAgo', {
      count: Math.floor(seconds / 60),
    })
  }
  if (seconds < 86400) {
    return t('authorDashboardPageTools.hoursAgo', {
      count: Math.floor(seconds / 3600),
    })
  }
  if (seconds < 604800) {
    return t('authorDashboardPageTools.daysAgo', {
      count: Math.floor(seconds / 86400),
    })
  }

  return date.toLocaleDateString(getDisplayLanguageId() || 'en', {
    month: 'short',
    day: 'numeric',
  })
}

function countCustomLinks(details = {}) {
  const values = [
    details.website_url,
    details.facebook_page_url,
    details.social_media,
    details.messenger,
    details.telegram,
  ]

  return values.filter((value) => String(value || '').trim()).length
}

async function fetchPinnedPostCount(pageUsername) {
  if (!pageUsername) return 0

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/posts?limit=30`
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load pinned posts')
  }

  const posts = Array.isArray(data.posts) ? data.posts : []
  return posts.filter((post) => post?.is_pinned).length
}

function ToolMetric({ icon, value, label }) {
  return (
    <div className="rounded-[16px] bg-white/10 p-3 ring-1 ring-white/15">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#6d28d9]">
          <i className={`${icon} text-[16px]`} />
        </span>
        <span className="min-w-0">
          <span className="block text-[24px] font-black leading-none text-white">{value}</span>
          <span className="mt-1.5 block text-[8.5px] font-semibold text-white/75">{label}</span>
        </span>
      </div>
    </div>
  )
}

function QuickTool({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[102px] flex-col items-center justify-center rounded-[17px] bg-[var(--shadow-bg-surface)] p-3 text-center shadow-sm ring-1 ring-[var(--shadow-border)] transition active:scale-[0.98]"
    >
      <i className={`${icon} text-[24px] text-[#6d28d9]`} />
      <span className="mt-3 text-[10px] font-black text-[var(--shadow-text-primary)]">{label}</span>
    </button>
  )
}

function getNotificationIcon(item) {
  const text = `${item?.type || ''} ${item?.title || ''} ${item?.message || ''}`.toLowerCase()

  if (text.includes('link')) return 'fa-solid fa-link'
  if (text.includes('comment')) return 'fa-regular fa-comment-dots'
  if (text.includes('follow')) return 'fa-solid fa-user-plus'
  if (text.includes('story') || text.includes('episode')) return 'fa-solid fa-book-open'
  if (text.includes('review')) return 'fa-regular fa-star'
  if (text.includes('image') || text.includes('cover') || text.includes('theme')) return 'fa-solid fa-paint-roller'

  return 'fa-regular fa-pen-to-square'
}

function RecentChangeRow({ item }) {
  const { t } = useDisplayTranslation()
  const title =
    item?.title ||
    item?.message ||
    t('authorDashboardPageTools.pageActivityUpdated')
  const text =
    item?.title && item?.message
      ? item.message
      : t('authorDashboardPageTools.authorPageReceivedUpdate')

  return (
    <div className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-3 py-3 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white">
        <i className={`${getNotificationIcon(item)} text-[12px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 block text-[10.5px] font-black text-[var(--shadow-text-primary)]">{title}</span>
        <span className="mt-1 line-clamp-1 block text-[8.5px] font-medium text-[var(--shadow-text-secondary)]">{text}</span>
      </span>
      <span className="shrink-0 text-[8px] font-semibold text-[var(--shadow-text-tertiary)]">
        {formatTimeAgo(item?.created_at, t)}
      </span>
    </div>
  )
}

export default function AuthorDashboardPageToolsTab({
  authorPage = null,
  profileCompletion = 0,
  notifications = [],
  onEditInfo,
  onTheme,
  onLinks,
  onPinnedPosts,
  onManageTools,
}) {
  const { t } = useDisplayTranslation()
  const [pinnedPostCount, setPinnedPostCount] = useState(0)
  const [loadingPinnedPosts, setLoadingPinnedPosts] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadPinnedPosts() {
      const pageUsername = authorPage?.page_username || ''

      if (!pageUsername) {
        setPinnedPostCount(0)
        return
      }

      try {
        setLoadingPinnedPosts(true)
        const count = await fetchPinnedPostCount(pageUsername)

        if (!ignore) setPinnedPostCount(count)
      } catch {
        if (!ignore) setPinnedPostCount(0)
      } finally {
        if (!ignore) setLoadingPinnedPosts(false)
      }
    }

    loadPinnedPosts()

    return () => {
      ignore = true
    }
  }, [authorPage?.page_username])

  const profileDetails = authorPage?.profile_details || {}
  const customLinkCount = useMemo(() => countCustomLinks(profileDetails), [profileDetails])
  const recentChanges = Array.isArray(notifications) ? notifications.slice(0, 3) : []

  return (
    <div className="mx-auto max-w-[760px] space-y-4">
      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] p-4 text-white shadow-[0_16px_38px_rgba(109,40,217,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[15px] font-black sm:text-[17px]">{t('authorDashboardPageTools.pageToolsOverview')}</h1>
          <span className="rounded-full bg-white/10 px-3 py-2 text-[9px] font-bold text-white ring-1 ring-white/15">
            {t('authorDashboardPageTools.liveData')}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <ToolMetric icon="fa-solid fa-wrench" value="4" label={t('authorDashboardPageTools.activeTools')} />
          <ToolMetric icon="fa-solid fa-link" value={formatCompactNumber(customLinkCount)} label={t('authorDashboardPageTools.customLinks')} />
          <ToolMetric
            icon="fa-solid fa-thumbtack"
            value={loadingPinnedPosts ? '…' : formatCompactNumber(pinnedPostCount)}
            label={t('authorDashboardPageTools.pinnedItems')}
          />
          <ToolMetric
            icon="fa-solid fa-circle-check"
            value={`${Math.max(0, Math.min(100, Number(profileCompletion || 0)))}%`}
            label={t('authorDashboardPageTools.profileCompletion')}
          />
        </div>
      </section>

      <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)] sm:text-[16px]">{t('authorDashboardPageTools.quickAccess')}</h2>
          <button
            type="button"
            onClick={onManageTools}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            {t('authorDashboardPageTools.viewAll')}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2.5">
          <QuickTool icon="fa-solid fa-pencil" label={t('authorDashboardPageTools.editInfo')} onClick={onEditInfo} />
          <QuickTool icon="fa-solid fa-paint-roller" label={t('authorDashboardPageTools.theme')} onClick={onTheme} />
          <QuickTool icon="fa-solid fa-link" label={t('authorDashboardPageTools.links')} onClick={onLinks} />
          <QuickTool icon="fa-solid fa-thumbtack" label={t('authorDashboardPageTools.pinnedPosts')} onClick={onPinnedPosts} />
        </div>
      </section>

      <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
        <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)] sm:text-[16px]">{t('authorDashboardPageTools.recentChanges')}</h2>

        <div className="mt-3 overflow-hidden rounded-[17px] ring-1 ring-[var(--shadow-border)]">
          {recentChanges.length ? (
            recentChanges.map((item) => <RecentChangeRow key={item.id} item={item} />)
          ) : (
            <div className="flex min-h-[170px] flex-col items-center justify-center px-5 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
                <i className="fa-regular fa-clock text-[18px]" />
              </span>
              <div className="mt-3 text-[12px] font-bold text-[var(--shadow-text-primary)]">{t('authorDashboardPageTools.noRecentChanges')}</div>
              <div className="mt-1 text-[10px] font-medium text-[var(--shadow-text-secondary)]">
                {t('authorDashboardPageTools.pageUpdatesDescription')}
              </div>
            </div>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={onManageTools}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)] active:scale-[0.99]"
      >
        <i className="fa-solid fa-screwdriver-wrench text-[13px]" />
        {t('authorDashboardPageTools.managePageTools')}
      </button>
    </div>
  )
}

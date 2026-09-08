import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorTopFans', {
  "en": {
    "reader": "Reader",
    "back": "Back",
    "topFans": "Top fans",
    "noTopFanYet": "No Top Fan yet",
    "noTopFanHelp": "{t('authorTopFans.noTopFanHelp')}",
    "loading": "Loading...",
    "loadMore": "Load more",
    "openActions": "Open {{name}} actions",
    "removeTopFanBadge": "Remove Top Fan Badge",
    "removeTopFanBadgeSoon": "Remove Top Fan Badge for {{name}} is coming soon.",
    "cancel": "Cancel",
    "failedLoadTopFans": "Failed to load top fans",
    "failedLoadMoreTopFans": "Failed to load more top fans"
  },
  "km": {
    "reader": "អ្នកអាន",
    "back": "ត្រឡប់ក្រោយ",
    "topFans": "អ្នកគាំទ្រកំពូល",
    "noTopFanYet": "មិនទាន់មានអ្នកគាំទ្រកំពូល",
    "noTopFanHelp": "អ្នកគាំទ្រកំពូលនឹងបង្ហាញនៅទីនេះ បន្ទាប់ពីអ្នកអានមានសកម្មភាពច្រើនលើទំព័រនេះ។",
    "loading": "កំពុងផ្ទុក...",
    "loadMore": "ផ្ទុកបន្ថែម",
    "openActions": "បើកសកម្មភាពរបស់ {{name}}",
    "removeTopFanBadge": "ដកស្លាកអ្នកគាំទ្រកំពូល",
    "removeTopFanBadgeSoon": "មុខងារដកស្លាកអ្នកគាំទ្រកំពូលពី {{name}} នឹងមានឆាប់ៗនេះ។",
    "cancel": "បោះបង់",
    "failedLoadTopFans": "មិនអាចផ្ទុកអ្នកគាំទ្រកំពូលបានទេ",
    "failedLoadMoreTopFans": "មិនអាចផ្ទុកអ្នកគាំទ្រកំពូលបន្ថែមបានទេ"
  },
  "zh": {
    "reader": "读者",
    "back": "返回",
    "topFans": "顶级粉丝",
    "noTopFanYet": "暂无顶级粉丝",
    "noTopFanHelp": "当读者在此主页上更活跃后，顶级粉丝会显示在这里。",
    "loading": "加载中...",
    "loadMore": "加载更多",
    "openActions": "打开 {{name}} 的操作",
    "removeTopFanBadge": "移除顶级粉丝徽章",
    "removeTopFanBadgeSoon": "移除 {{name}} 顶级粉丝徽章的功能即将推出。",
    "cancel": "取消",
    "failedLoadTopFans": "无法加载顶级粉丝",
    "failedLoadMoreTopFans": "无法加载更多顶级粉丝"
  },
  "ja": {
    "reader": "読者",
    "back": "戻る",
    "topFans": "トップファン",
    "noTopFanYet": "まだトップファンはいません",
    "noTopFanHelp": "読者がこのページでもっと活動すると、トップファンがここに表示されます。",
    "loading": "読み込み中...",
    "loadMore": "さらに読み込む",
    "openActions": "{{name}} の操作を開く",
    "removeTopFanBadge": "トップファンバッジを削除",
    "removeTopFanBadgeSoon": "{{name}} のトップファンバッジ削除機能は近日公開予定です。",
    "cancel": "キャンセル",
    "failedLoadTopFans": "トップファンを読み込めませんでした",
    "failedLoadMoreTopFans": "トップファンを追加で読み込めませんでした"
  },
  "ko": {
    "reader": "독자",
    "back": "뒤로",
    "topFans": "톱 팬",
    "noTopFanYet": "아직 톱 팬이 없습니다",
    "noTopFanHelp": "독자가 이 페이지에서 더 활발해지면 톱 팬이 여기에 표시됩니다.",
    "loading": "불러오는 중...",
    "loadMore": "더 보기",
    "openActions": "{{name}} 작업 열기",
    "removeTopFanBadge": "톱 팬 배지 제거",
    "removeTopFanBadgeSoon": "{{name}}의 톱 팬 배지 제거 기능은 곧 제공됩니다.",
    "cancel": "취소",
    "failedLoadTopFans": "톱 팬을 불러오지 못했습니다",
    "failedLoadMoreTopFans": "톱 팬을 더 불러오지 못했습니다"
  }
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PAGE_LIMIT = 30

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getFanName(user) {
  return user?.name || user?.display_name || user?.username || getDisplayText('authorTopFans.reader')
}

function getFanId(user) {
  return String(user?.id || user?.user_id || user?.username || user?.reader_username || '')
}

function Avatar({ user }) {
  const name = getFanName(user)
  const avatar = user?.avatar_url || user?.profile_image || ''

  if (avatar) {
    return <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[16px] font-black text-[var(--shadow-text-secondary)]">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

export default function AuthorTopFansPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { pageUsername } = useParams()

  const [topFans, setTopFans] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [message, setMessage] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [selectedTopFan, setSelectedTopFan] = useState(null)

  async function fetchTopFans(offset = 0) {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/followers?section=top&limit=${PAGE_LIMIT}&offset=${offset}`,
      { headers: getHeaders() }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('authorTopFans.failedLoadTopFans'))
    }

    return data
  }

  async function loadTopFans() {
    try {
      setLoading(true)
      setMessage('')

      const data = await fetchTopFans(0)

      setTopFans(data.followers || [])
      setHasMore(Boolean(data.has_more))
      setIsOwner(Boolean(data.is_owner))
    } catch (error) {
      setMessage(error.message || t('authorTopFans.failedLoadTopFans'))
    } finally {
      setLoading(false)
    }
  }

  async function loadMoreTopFans() {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)

      const data = await fetchTopFans(topFans.length)

      setTopFans((current) => [...current, ...(data.followers || [])])
      setHasMore(Boolean(data.has_more))
    } catch (error) {
      setMessage(error.message || t('authorTopFans.failedLoadMoreTopFans'))
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (!pageUsername) return
    loadTopFans()
  }, [pageUsername])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorTopFans.back')}
          >
            <i className="fa-solid fa-chevron-left text-[20px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('authorTopFans.topFans')}</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[14px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]"
        >
          {message}
        </button>
      ) : null}

      <main className="mx-auto max-w-[720px] pt-3">
        {loading ? (
          <div className="space-y-5 px-6 pt-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                <div className="h-5 flex-1 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && topFans.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[28px]">
              💎
            </div>
            <div className="mt-4 text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorTopFans.noTopFanYet')}</div>
            <div className="mx-auto mt-2 max-w-[280px] text-[13px] font-medium leading-6 text-[var(--shadow-text-tertiary)]">
              {t('authorTopFans.noTopFanHelp')}
            </div>
          </div>
        ) : null}

        {!loading && topFans.length > 0 ? (
          <div className="px-4">
            {topFans.map((fan) => (
  <div
    key={getFanId(fan)}
    className="flex min-h-[66px] items-center gap-4 px-1 py-2"
  >
    <Avatar user={fan} />

    <div className="min-w-0 flex-1">
      <div className="truncate text-[16px] font-normal text-[var(--shadow-text-primary)]">
        {getFanName(fan)}
      </div>
    </div>

    {isOwner ? (
      <button
        type="button"
        onClick={() => setSelectedTopFan(fan)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-soft)]"
        aria-label={t('authorTopFans.openActions', { name: getFanName(fan) })}
      >
        <i className="fa-solid fa-ellipsis text-[16px]" />
      </button>
    ) : null}
  </div>
))}

            {hasMore ? (
              <div className="py-4">
                <button
                  type="button"
                  onClick={loadMoreTopFans}
                  disabled={loadingMore}
                  className="h-11 w-full rounded-[12px] bg-[var(--shadow-bg-soft)] text-[14px] font-bold text-[var(--shadow-text-primary)] disabled:opacity-60"
                >
                  {loadingMore ? t('authorTopFans.loading') : t('authorTopFans.loadMore')}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
           </main>

      {isOwner && selectedTopFan ? (
        <div className="fixed inset-0 z-[300] bg-black/35" onClick={() => setSelectedTopFan(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-[var(--shadow-bg-surface)] px-5 pb-7 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />

            <div className="mb-4 truncate text-[18px] font-semibold text-[var(--shadow-text-primary)]">
              {getFanName(selectedTopFan)}
            </div>

            <button
              type="button"
              onClick={() => {
                const name = getFanName(selectedTopFan)
                setSelectedTopFan(null)
                setMessage(t('authorTopFans.removeTopFanBadgeSoon', { name }))
              }}
              className="flex h-12 w-full items-center gap-4 rounded-[14px] text-left active:bg-[var(--shadow-bg-soft)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]">
                <i className="fa-solid fa-xmark text-[15px]" />
              </span>
              <span className="text-[15px] font-medium text-[var(--shadow-text-primary)]">
                {t('authorTopFans.removeTopFanBadge')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTopFan(null)}
              className="mt-2 h-11 text-[15px] font-normal text-[var(--shadow-text-primary)] active:opacity-70"
            >
              {t('authorTopFans.cancel')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

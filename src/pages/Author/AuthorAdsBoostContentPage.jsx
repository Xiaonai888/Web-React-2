import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BarChart3, BookCopy, BookOpen, ChevronLeft, ChevronRight, FileText,
  Image as ImageIcon, Megaphone, Plus, RefreshCw, X,
} from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { listAuthorAdCampaigns } from '../../services/authorAdsApi'
import AuthorAdsInsightsPanel from './AuthorAdsInsightsPanel'
import AuthorAdsCampaignCard from '../../components/authorAds/AuthorAdsCampaignCard'

registerTranslationNamespace('authorAdsBoostSelection', {
  en: {
    title: 'Boost Content', back: 'Back', create: 'Create Boost', campaigns: 'My Campaigns', insights: 'Insights',
    story: 'Boost Story', storyHint: 'Novel, Manga, Chat Story', pdf: 'Boost PDF', pdfHint: 'Promote digital book sales',
    physical: 'Physical Book', physicalHint: 'Promote printed book orders', post: 'Boost Post', postHint: 'Promote Discover posts',
    noCampaigns: 'No campaigns yet', noCampaignsHint: 'Start your first campaign to promote your work.',
    createAd: 'Create Ad', chooseBoost: 'Choose a Boost', close: 'Close', loading: 'Loading campaigns...',
    unavailable: 'Campaigns could not be checked. Try again.', retry: 'Retry', loadMore: 'Load more',
    refresh: 'Refresh campaigns',
  },
  km: {
    title: 'Boost Content', back: 'ត្រឡប់ក្រោយ', create: 'Create Boost', campaigns: 'My Campaigns', insights: 'Insights',
    story: 'Boost Story', storyHint: 'Novel, Manga, Chat Story', pdf: 'Boost PDF', pdfHint: 'ផ្សព្វផ្សាយការលក់ PDF',
    physical: 'Physical Book', physicalHint: 'ផ្សព្វផ្សាយការលក់សៀវភៅក្រដាស', post: 'Boost Post', postHint: 'ផ្សព្វផ្សាយ Post នៅ Discover',
    noCampaigns: 'មិនទាន់មាន Campaign', noCampaignsHint: 'ចាប់ផ្តើម Campaign ដំបូង ដើម្បីផ្សព្វផ្សាយស្នាដៃរបស់អ្នក។',
    createAd: 'Create Ad', chooseBoost: 'ជ្រើសប្រភេទ Boost', close: 'បិទ', loading: 'កំពុងផ្ទុក Campaign...',
    unavailable: 'មិនអាចពិនិត្យ Campaign បានទេ។ សូមសាកម្តងទៀត។', retry: 'សាកម្តងទៀត', loadMore: 'មើលបន្ថែម',
    refresh: 'ធ្វើបច្ចុប្បន្នភាព Campaign',
  },
  zh: {
    title: '推广内容', back: '返回', create: '创建推广', campaigns: '我的广告活动', insights: '数据分析',
    story: '推广故事', storyHint: '小说、漫画、聊天故事', pdf: '推广 PDF', pdfHint: '推广电子书销售',
    physical: '纸质书', physicalHint: '推广纸质书订单', post: '推广帖子', postHint: '推广 Discover 帖子',
    noCampaigns: '暂无广告活动', noCampaignsHint: '创建第一个活动来推广您的作品。',
    createAd: '创建广告', chooseBoost: '选择推广类型', close: '关闭', loading: '正在加载活动...',
    unavailable: '无法检查活动，请重试。', retry: '重试', loadMore: '加载更多', refresh: '刷新活动',
  },
  ja: {
    title: 'コンテンツを宣伝', back: '戻る', create: '広告を作成', campaigns: 'マイキャンペーン', insights: '分析',
    story: 'ストーリーを宣伝', storyHint: '小説・マンガ・チャットストーリー', pdf: 'PDFを宣伝', pdfHint: '電子書籍の販売を促進',
    physical: '紙の本', physicalHint: '紙の本の注文を促進', post: '投稿を宣伝', postHint: 'Discoverの投稿を宣伝',
    noCampaigns: 'キャンペーンはまだありません', noCampaignsHint: '最初のキャンペーンを作成して作品を宣伝しましょう。',
    createAd: '広告を作成', chooseBoost: '種類を選択', close: '閉じる', loading: '読み込み中...',
    unavailable: 'キャンペーンを確認できません。再試行してください。', retry: '再試行', loadMore: 'さらに表示', refresh: 'キャンペーンを更新',
  },
  ko: {
    title: '콘텐츠 홍보', back: '뒤로', create: '부스트 만들기', campaigns: '내 캠페인', insights: '통계',
    story: '스토리 홍보', storyHint: '소설, 만화, 채팅 스토리', pdf: 'PDF 홍보', pdfHint: '디지털 도서 판매 홍보',
    physical: '종이책', physicalHint: '인쇄 도서 주문 홍보', post: '게시물 홍보', postHint: 'Discover 게시물 홍보',
    noCampaigns: '캠페인이 없습니다', noCampaignsHint: '첫 캠페인을 만들고 작품을 홍보하세요.',
    createAd: '광고 만들기', chooseBoost: '부스트 선택', close: '닫기', loading: '캠페인 불러오는 중...',
    unavailable: '캠페인을 확인할 수 없습니다. 다시 시도하세요.', retry: '다시 시도', loadMore: '더 보기', refresh: '캠페인 새로고침',
  },
})

const CHOICES = [
  { id: 'story', icon: BookOpen, title: 'story', hint: 'storyHint', tint: 'violet' },
  { id: 'pdf', icon: FileText, title: 'pdf', hint: 'pdfHint', tint: 'amber' },
  { id: 'physical', icon: BookCopy, title: 'physical', hint: 'physicalHint', tint: 'amber' },
  { id: 'post', icon: ImageIcon, title: 'post', hint: 'postHint', tint: 'violet' },
]

const EDITOR_PATHS = {
  story: '/author/page/ads/boost-story',
  pdf: '/author/page/ads/boost-pdf',
  physical: '/author/page/ads/boost-physical',
  post: '/author/page/ads/boost-post',
}

const API_BASE = (import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)).replace(/\/$/, '')

function readerToken() {
  try {
    return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

function readLocalDrafts(username) {
  if (!username) return []
  try {
    const raw = JSON.parse(localStorage.getItem(`shadow_author_ads_drafts_v1_${username}`) || '[]')
    if (!Array.isArray(raw)) return []
    return raw.filter(item => item && typeof item === 'object' &&
      typeof item.id === 'string' && item.id.trim() && item.status === 'draft')
      .map(item => ({ ...item, deviceDraft: true }))
      .slice(0, 200)
  } catch {
    return []
  }
}

async function getAuthorUsername(signal) {
  const token = readerToken()
  if (!token) throw new Error('AUTH_REQUIRED')
  const response = await fetch(`${API_BASE}/api/authors/me?include_works=0`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal,
  })
  if (!response.ok) throw new Error('AUTHOR_LOOKUP_FAILED')
  const data = await response.json()
  if (data.ok === false) throw new Error('AUTHOR_LOOKUP_FAILED')
  const username = String(data.author_page?.page_username || '').trim()
  if (!username) throw new Error('AUTHOR_PAGE_MISSING')
  return username
}

function selectionCard(choice, t, onPick) {
  const Icon = choice.icon
  const amber = choice.tint === 'amber'
  return (
    <button
      key={choice.id}
      type="button"
      onClick={() => onPick(choice.id)}
      className="group relative flex min-h-[213px] flex-col items-center justify-center overflow-hidden rounded-[20px] border border-[#eeebf4] bg-white px-3 py-5 text-center shadow-[0_4px_16px_rgba(30,24,55,0.045)] transition active:scale-[0.985] sm:min-h-[242px]"
    >
      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f0ff] text-[#6842cb]">
        <ChevronRight size={17} />
      </span>
      <span className={`relative mb-4 flex h-[106px] w-[106px] items-center justify-center rounded-[32px] ${amber ? 'bg-[#fff3d9]' : 'bg-[#f1ebff]'}`}>
        <span className="absolute -left-2 top-4 text-[20px] text-[#ffc83b]">✦</span>
        <Icon size={58} strokeWidth={1.5} className={amber ? 'text-[#8a59a0]' : 'text-[#6840cd]'} />
        <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#ffd039] text-[#725019]">
          <ChevronRight size={20} strokeWidth={2.5} />
        </span>
      </span>
      <span className="text-[14px] font-bold leading-5 text-[#171321] sm:text-[16px]">{t(`authorAdsBoostSelection.${choice.title}`)}</span>
      <span className="mt-1.5 text-[11px] leading-4 text-[#8a849a] sm:text-[12px]">{t(`authorAdsBoostSelection.${choice.hint}`)}</span>
    </button>
  )
}

export default function AuthorAdsBoostContentPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab = ['campaigns', 'insights'].includes(tabParam) ? tabParam : 'create'
  const { t } = useDisplayTranslation()
  const tr = key => t(`authorAdsBoostSelection.${key}`)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [showEmptyChooser, setShowEmptyChooser] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const loadMoreControllerRef = useRef(null)

  const goToEditor = type => {
    if (!Object.prototype.hasOwnProperty.call(EDITOR_PATHS, type)) return
    setShowEmptyChooser(false)
    navigate(EDITOR_PATHS[type])
  }

  useEffect(() => {
    if (tab !== 'campaigns') return undefined
    const controller = new AbortController()
    if (loadMoreControllerRef.current) loadMoreControllerRef.current.abort()
    setLoadingMore(false)
    setLoading(true)
    setLoaded(false)
    setLoadError(false)
    setShowEmptyChooser(false)
    setCampaigns([])
    setHasMore(false)
    setPage(1)
    Promise.allSettled([
      listAuthorAdCampaigns({ page: 1, limit: 10, signal: controller.signal, refresh: refreshCount > 0 }),
      getAuthorUsername(controller.signal),
    ]).then(([remote, account]) => {
      if (controller.signal.aborted) return
      const remoteOk = remote.status === 'fulfilled'
      const accountOk = account.status === 'fulfilled'
      const cloud = remoteOk ? remote.value.campaigns : []
      const local = accountOk ? readLocalDrafts(account.value) : []
      const merged = new Map(cloud.map(item => [String(item.id), item]))
      local.forEach(item => {
        if (!merged.has(String(item.id))) merged.set(String(item.id), item)
      })
      const records = [...merged.values()]
      setCampaigns(records)
      setHasMore(remoteOk && Boolean(remote.value.has_more))
      setLoadError(!remoteOk || !accountOk)
      setLoaded(true)
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [tab, refreshCount])

  const loadMore = async () => {
    if (tab !== 'campaigns' || loading || loadingMore || !hasMore || loadError) return
    const controller = new AbortController()
    if (loadMoreControllerRef.current) loadMoreControllerRef.current.abort()
    loadMoreControllerRef.current = controller
    setLoadingMore(true)
    try {
      const data = await listAuthorAdCampaigns({ page: page + 1, limit: 10, signal: controller.signal })
      if (controller.signal.aborted) return
      setCampaigns(current => {
        const merged = new Map(current.map(item => [String(item.id), item]))
        data.campaigns.forEach(item => merged.set(String(item.id), item))
        return [...merged.values()]
      })
      setPage(data.page)
      setHasMore(Boolean(data.has_more))
    } catch {
      if (!controller.signal.aborted) setLoadError(true)
    } finally {
      if (!controller.signal.aborted) setLoadingMore(false)
      if (loadMoreControllerRef.current === controller) loadMoreControllerRef.current = null
    }
  }

  useEffect(() => () => {
    if (loadMoreControllerRef.current) loadMoreControllerRef.current.abort()
  }, [])

  useEffect(() => {
    if (!showEmptyChooser) return undefined
    const onKeyDown = event => {
      if (event.key === 'Escape') setShowEmptyChooser(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showEmptyChooser])

  const openTab = next => {
    if (!['create', 'campaigns', 'insights'].includes(next)) return
    setShowEmptyChooser(false)
    setSearchParams(next === 'create' ? {} : { tab: next }, { replace: true })
  }

  const manageCampaign = selected => {
    if (!selected?.id) return
    const id = encodeURIComponent(String(selected.id))
    navigate(selected.deviceDraft
      ? `/author/page/ads/boost-editor?tab=campaigns&edit=${id}`
      : `/author/page/ads/campaign/${id}`)
  }

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(95px+env(safe-area-inset-bottom))] text-[#171321]">
      <div className="mx-auto max-w-2xl px-3.5 pt-2 sm:px-6">
        <header className="mb-5 flex min-h-12 items-center gap-2">
          <button type="button" onClick={() => navigate('/author/page/ads')} aria-label={tr('back')}
            className="flex h-10 w-9 shrink-0 items-center justify-center rounded-full text-[#171321] active:bg-[#f5f4f7]">
            <ChevronLeft size={23} strokeWidth={2.1} />
          </button>
          <h1 className="text-[18px] font-bold leading-6 text-[#171321]">{tr('title')}</h1>
        </header>

        {tab === 'create' && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {CHOICES.map(choice => selectionCard(choice, t, goToEditor))}
          </div>
        )}

        {tab === 'campaigns' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="px-1 text-[16px] font-bold">{tr('campaigns')}</h2>
              <button type="button" disabled={loading || loadingMore} onClick={() => setRefreshCount(value => value + 1)}
                aria-label={tr('refresh')} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eeebf3] text-[#6942c8] disabled:opacity-40">
                <RefreshCw size={18} className={loading || loadingMore ? 'animate-spin' : ''} />
              </button>
            </div>
            {loadError && (
              <div role="alert" className="rounded-2xl border border-[#f3e3bd] bg-[#fffaf0] p-4 text-sm text-[#805c2e]">
                {tr('unavailable')}
                <button type="button" className="ml-3 font-semibold underline" onClick={() => setRefreshCount(value => value + 1)}>{tr('retry')}</button>
              </div>
            )}
            {campaigns.map(item => (
              <AuthorAdsCampaignCard key={String(item.id)} campaign={item} onManage={manageCampaign} />
            ))}
            {loading && (
              <div role="status" className="flex items-center justify-center gap-2 py-8 text-sm text-[#8b849c]">
                <RefreshCw size={17} className="animate-spin" />{tr('loading')}
              </div>
            )}
            {!loading && loaded && !campaigns.length && !loadError && (
              <div className="flex flex-col items-center rounded-[22px] border border-[#efeaf6] bg-white px-6 py-12 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f1eaff] text-[#7048cb]">
                  <Megaphone size={35} strokeWidth={1.6} />
                </span>
                <h2 className="mt-5 text-[17px] font-bold text-[#171321]">{tr('noCampaigns')}</h2>
                <p className="mt-2 max-w-[275px] text-[12px] leading-5 text-[#918b9f]">{tr('noCampaignsHint')}</p>
                <button type="button" onClick={() => setShowEmptyChooser(true)}
                  className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#171321] px-7 py-3 text-[13px] font-semibold text-white active:scale-[0.98]">
                  <Plus size={18} />{tr('createAd')}
                </button>
              </div>
            )}
            {!loading && hasMore && (
              <button type="button" disabled={loadingMore}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#eeebf3] bg-white py-3 text-sm font-medium disabled:opacity-50"
                onClick={loadMore}>
                {loadingMore && <RefreshCw size={14} className="animate-spin" />}{tr('loadMore')}
              </button>
            )}
          </section>
        )}

        {tab === 'insights' && <AuthorAdsInsightsPanel />}
      </div>

      <nav aria-label="Shadow Ads" className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#ececf1] bg-white/95 pb-[max(8px,env(safe-area-inset-bottom))] pt-1 shadow-[0_-3px_12px_rgba(25,20,35,0.035)] backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-3">
          {[
            { key: 'campaigns', icon: Megaphone, label: 'campaigns' },
            { key: 'create', icon: Plus, label: 'create' },
            { key: 'insights', icon: BarChart3, label: 'insights' },
          ].map(item => {
            const Icon = item.icon
            const active = tab === item.key
            return (
              <button key={item.key} type="button" aria-current={active ? 'page' : undefined}
                onClick={() => openTab(item.key)}
                className={`flex min-h-[66px] min-w-0 flex-col items-center justify-center gap-1.5 px-1 py-1.5 transition active:scale-[0.97] ${active ? 'text-[#6840cd]' : 'text-[#8e8999]'}`}>
                {item.key === 'create' ? (
                  <span className={`flex h-[29px] w-[29px] items-center justify-center rounded-[8px] border-[2px] ${active ? 'border-[#6840cd]' : 'border-[#898494]'}`}>
                    <Icon size={21} strokeWidth={2.2} />
                  </span>
                ) : (
                  <Icon size={27} strokeWidth={active ? 2.2 : 1.85} />
                )}
                <span className={`max-w-full truncate px-1 text-center text-[11px] leading-[14px] ${active ? 'font-bold' : 'font-medium'}`}>{tr(item.label)}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {showEmptyChooser && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4"
          onMouseDown={event => { if (event.target === event.currentTarget) setShowEmptyChooser(false) }}>
          <div role="dialog" aria-modal="true" aria-labelledby="boost-picker-title"
            className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="boost-picker-title" className="text-[17px] font-bold text-[#171321]">{tr('chooseBoost')}</h2>
              <button type="button" aria-label={tr('close')} onClick={() => setShowEmptyChooser(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f2fa] text-[#696274]">
                <X size={19} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {CHOICES.map(choice => {
                const Icon = choice.icon
                return (
                  <button key={choice.id} type="button" onClick={() => goToEditor(choice.id)}
                    className="flex min-h-[105px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#eee9f5] bg-[#fcfaff] p-3 text-center active:scale-[0.98]">
                    <Icon size={28} strokeWidth={1.8} className="text-[#6840cd]" />
                    <span className="text-[12px] font-semibold text-[#171321]">{tr(choice.title)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, BarChart3, BookCopy, BookOpen, ChevronRight, FileText,
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
    noCampaigns: 'No campaigns yet', noCampaignsHint: 'Choose what you want to boost to create your first campaign.',
    chooseBoost: 'Choose a Boost', close: 'Close', loading: 'Loading campaigns...',
    unavailable: 'Campaigns could not be checked. Try again.', retry: 'Retry',
    loadMore: 'Load more', localDraft: 'Device draft', draft: 'Draft',
    storeItem: 'Store book / PDF', insightsPending: 'Campaign results will appear here when delivery tracking is available.',
    noInsights: 'No campaign insights yet', refresh: 'Refresh campaigns',
  },
  km: {
    title: 'Boost Content', back: 'ត្រឡប់ក្រោយ', create: 'Create Boost', campaigns: 'My Campaigns', insights: 'Insights',
    story: 'Boost Story', storyHint: 'Novel, Manga, Chat Story', pdf: 'Boost PDF', pdfHint: 'ផ្សព្វផ្សាយការលក់ PDF',
    physical: 'Physical Book', physicalHint: 'ផ្សព្វផ្សាយការលក់សៀវភៅក្រដាស', post: 'Boost Post', postHint: 'ផ្សព្វផ្សាយ Post នៅ Discover',
    noCampaigns: 'មិនទាន់មាន Campaign', noCampaignsHint: 'ជ្រើសប្រភេទ Boost ដើម្បីបង្កើត Campaign ដំបូង។',
    chooseBoost: 'ជ្រើសប្រភេទ Boost', close: 'បិទ', loading: 'កំពុងផ្ទុក Campaign...',
    unavailable: 'មិនអាចពិនិត្យ Campaign បានទេ។ សូមសាកម្តងទៀត។', retry: 'សាកម្តងទៀត',
    loadMore: 'មើលបន្ថែម', localDraft: 'Draft ក្នុងឧបករណ៍', draft: 'Draft',
    storeItem: 'សៀវភៅ / PDF', insightsPending: 'លទ្ធផល Campaign នឹងបង្ហាញនៅទីនេះ ពេលប្រព័ន្ធតាមដាន Ads ដំណើរការ។',
    noInsights: 'មិនទាន់មានស្ថិតិ Campaign', refresh: 'ធ្វើបច្ចុប្បន្នភាព Campaign',
  },
  zh: {
    title: '推广内容', back: '返回', create: '创建推广', campaigns: '我的广告活动', insights: '数据分析',
    story: '推广故事', storyHint: '小说、漫画、聊天故事', pdf: '推广 PDF', pdfHint: '推广电子书销售',
    physical: '纸质书', physicalHint: '推广纸质书订单', post: '推广帖子', postHint: '推广 Discover 帖子',
    noCampaigns: '暂无广告活动', noCampaignsHint: '选择推广类型，创建第一个活动。',
    chooseBoost: '选择推广类型', close: '关闭', loading: '正在加载活动...',
    unavailable: '无法检查活动，请重试。', retry: '重试', loadMore: '加载更多', localDraft: '本地草稿', draft: '草稿',
    storeItem: '书籍 / PDF', insightsPending: '广告投放数据追踪启用后，此处将显示活动结果。',
    noInsights: '暂无广告数据', refresh: '刷新活动',
  },
  ja: {
    title: 'コンテンツを宣伝', back: '戻る', create: '広告を作成', campaigns: 'マイキャンペーン', insights: '分析',
    story: 'ストーリーを宣伝', storyHint: '小説・マンガ・チャットストーリー', pdf: 'PDFを宣伝', pdfHint: '電子書籍の販売を促進',
    physical: '紙の本', physicalHint: '紙の本の注文を促進', post: '投稿を宣伝', postHint: 'Discoverの投稿を宣伝',
    noCampaigns: 'キャンペーンはまだありません', noCampaignsHint: '種類を選んで最初のキャンペーンを作成しましょう。',
    chooseBoost: '種類を選択', close: '閉じる', loading: '読み込み中...',
    unavailable: 'キャンペーンを確認できません。再試行してください。', retry: '再試行',
    loadMore: 'さらに表示', localDraft: '端末の下書き', draft: '下書き',
    storeItem: '書籍 / PDF', insightsPending: '配信結果の追跡が利用可能になると、ここに表示されます。',
    noInsights: 'まだ分析データがありません', refresh: 'キャンペーンを更新',
  },
  ko: {
    title: '콘텐츠 홍보', back: '뒤로', create: '부스트 만들기', campaigns: '내 캠페인', insights: '통계',
    story: '스토리 홍보', storyHint: '소설, 만화, 채팅 스토리', pdf: 'PDF 홍보', pdfHint: '디지털 도서 판매 홍보',
    physical: '종이책', physicalHint: '인쇄 도서 주문 홍보', post: '게시물 홍보', postHint: 'Discover 게시물 홍보',
    noCampaigns: '캠페인이 없습니다', noCampaignsHint: '종류를 선택해 첫 캠페인을 만드세요.',
    chooseBoost: '부스트 선택', close: '닫기', loading: '캠페인 불러오는 중...',
    unavailable: '캠페인을 확인할 수 없습니다. 다시 시도하세요.', retry: '다시 시도',
    loadMore: '더 보기', localDraft: '기기 초안', draft: '초안',
    storeItem: '도서 / PDF', insightsPending: '광고 게재 추적이 활성화되면 캠페인 결과가 여기에 표시됩니다.',
    noInsights: '캠페인 통계가 없습니다', refresh: '캠페인 새로고침',
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
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
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
      className="group relative flex min-h-[224px] flex-col items-center justify-center overflow-hidden rounded-[22px] border border-[#eeebf8] bg-white px-3 py-5 text-center shadow-[0_8px_30px_rgba(74,49,120,0.05)] transition active:scale-[0.985] dark:border-white/10 dark:bg-[#231d30] sm:min-h-[255px]"
    >
      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f4efff] text-[#6842cb] dark:bg-[#3b2c55] dark:text-[#c8afff]">
        <ChevronRight size={18} />
      </span>
      <span className={`relative mb-5 flex h-[112px] w-[112px] items-center justify-center rounded-[34px] ${amber ? 'bg-[#fff4db] dark:bg-[#493b29]' : 'bg-[#f1ebff] dark:bg-[#382a54]'}`}>
        <span className="absolute -left-2 top-4 text-[20px] text-[#ffc83b]">✦</span>
        <Icon size={64} strokeWidth={1.45} className={amber ? 'text-[#8150a0] dark:text-[#d2b3ff]' : 'text-[#6840cd] dark:text-[#bea0ff]'} />
        <span className="absolute -bottom-1 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#ffce39] text-[#725019] shadow-sm dark:border-[#231d30]">
          <ChevronRight size={21} strokeWidth={2.6} />
        </span>
      </span>
      <span className="block text-[15px] font-bold leading-5 text-[#1c172a] dark:text-white sm:text-[17px]">{t(`authorAdsBoostSelection.${choice.title}`)}</span>
      <span className="mt-2 block text-[11px] leading-4 text-[#838299] dark:text-[#bbb3cc] sm:text-xs">{t(`authorAdsBoostSelection.${choice.hint}`)}</span>
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
      const failed = !remoteOk || !accountOk
      setCampaigns(records)
      setPage(1)
      setHasMore(remoteOk && Boolean(remote.value.has_more))
      setLoadError(failed)
      setLoaded(true)
      if (records.length === 0 && !failed) setShowEmptyChooser(true)
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
    <main className="min-h-[100dvh] bg-[#f7f5ff] pb-[100px] text-[#191326] dark:bg-[#14101f] dark:text-white">
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-5 sm:px-6">
        <header className="mb-6 flex items-center gap-4 rounded-2xl bg-white px-1 py-3 dark:bg-[#231d30]">
          <button type="button" onClick={() => navigate('/author/page/ads')} aria-label={tr('back')} className="flex h-10 w-10 items-center justify-center text-[#171321] dark:text-white">
            <ArrowLeft size={25} strokeWidth={2.2} />
          </button>
          <h1 className="text-[22px] font-bold tracking-tight">{tr('title')}</h1>
        </header>

        {tab === 'create' && <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {CHOICES.map(choice => selectionCard(choice, t, goToEditor))}
        </div>}

        {tab === 'campaigns' && <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="px-1 text-lg font-semibold">{tr('campaigns')}</h2>
            <button type="button" disabled={loading || loadingMore} onClick={() => setRefreshCount(value => value + 1)}
              aria-label={tr('refresh')} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e9e6f3] bg-white text-[#6942c8] disabled:opacity-40 dark:border-white/10 dark:bg-[#231d30] dark:text-[#d9c5ff]">
              <RefreshCw size={17} className={loading || loadingMore ? 'animate-spin' : ''} />
            </button>
          </div>
          {loadError && <div role="alert" className="rounded-2xl border border-[#e9dba8] bg-[#fff8de] p-4 text-sm text-[#6a5020] dark:bg-[#4b3a1b] dark:text-[#ffecbc]">
            {tr('unavailable')}
            <button type="button" className="ml-3 font-semibold underline" onClick={() => setRefreshCount(value => value + 1)}>{tr('retry')}</button>
          </div>}
          {campaigns.map(item => (
            <AuthorAdsCampaignCard key={String(item.id)} campaign={item} onManage={manageCampaign} />
          ))}
          {loading && <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#8b849c]">
            <RefreshCw size={17} className="animate-spin" />{tr('loading')}
          </div>}
          {!loading && loaded && !campaigns.length && !loadError && <button type="button"
            className="w-full rounded-2xl border border-dashed border-[#dcd4ee] bg-white px-5 py-10 text-center dark:bg-[#231d30]"
            onClick={() => setShowEmptyChooser(true)}>
            <Megaphone size={28} className="mx-auto mb-3 text-[#6d4ccb]" />
            <span className="block font-semibold">{tr('noCampaigns')}</span>
            <span className="mt-2 block text-xs text-[#827b92]">{tr('noCampaignsHint')}</span>
          </button>}
          {!loading && hasMore && <button type="button" disabled={loadingMore}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e9e6f3] bg-white py-3 text-sm font-medium disabled:opacity-50 dark:border-white/10 dark:bg-[#231d30]"
            onClick={loadMore}>
            {loadingMore && <RefreshCw size={14} className="animate-spin" />}{tr('loadMore')}
          </button>}
        </section>}

        {tab === 'insights' && <AuthorAdsInsightsPanel />}
      </div>

      <nav aria-label="Shadow Ads" className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#eae6f5] bg-white/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_20px_rgba(35,22,67,0.05)] backdrop-blur dark:border-white/10 dark:bg-[#211b2b]/95">
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-1 rounded-xl bg-[#f8f6fc] p-1 dark:bg-[#2d263d]">
          {[
            ['create', Plus, 'create'], ['campaigns', Megaphone, 'campaigns'], ['insights', BarChart3, 'insights'],
          ].map(([value, Icon, label]) => <button
            key={value} type="button" aria-current={tab === value ? 'page' : undefined} onClick={() => openTab(value)}
            className={`flex min-w-0 items-center justify-center gap-1 rounded-lg px-1 py-3 text-[11px] font-medium transition sm:text-[13px] ${tab === value ? 'bg-[#eee6ff] text-[#5d39c2] dark:bg-[#4a356f] dark:text-[#e1d3ff]' : 'text-[#8a8498] dark:text-[#bab3cc]'}`}
          >
            <Icon size={14} strokeWidth={1.9} /> <span className="truncate">{tr(label)}</span>
          </button>)}
        </div>
      </nav>

      {showEmptyChooser && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4"
        onMouseDown={event => { if (event.target === event.currentTarget) setShowEmptyChooser(false) }}>
        <div role="dialog" aria-modal="true" aria-labelledby="boost-picker-title"
          className="w-full max-w-sm rounded-[26px] bg-white p-5 shadow-xl dark:bg-[#251e33]">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h2 id="boost-picker-title" className="text-lg font-bold">{tr('noCampaigns')}</h2>
              <p className="mt-1 text-xs leading-5 text-[#898294] dark:text-[#c5bcce]">{tr('noCampaignsHint')}</p>
            </div>
            <button type="button" aria-label={tr('close')} onClick={() => setShowEmptyChooser(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3effa] text-[#6c6479] dark:bg-[#3a2f4c] dark:text-white"><X size={17} /></button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {CHOICES.map(choice => {
              const Icon = choice.icon
              return <button key={choice.id} type="button" onClick={() => goToEditor(choice.id)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-[#eee8f8] bg-[#faf8ff] px-2 py-4 text-center dark:border-white/10 dark:bg-[#342a45]">
                <Icon size={26} className="text-[#6840cd] dark:text-[#c6a8ff]" />
                <span className="text-xs font-semibold">{tr(choice.title)}</span>
              </button>
            })}
          </div>
        </div>
      </div>}
    </main>
  )
}

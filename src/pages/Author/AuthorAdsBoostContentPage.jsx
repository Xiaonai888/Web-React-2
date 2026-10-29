import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, BarChart3, BookCopy, BookOpen, ChevronRight, FileText,
  Image as ImageIcon, Megaphone, Plus, RefreshCw, X,
} from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { listAuthorAdCampaigns } from '../../services/authorAdsApi'

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
    noInsights: 'No campaign insights yet',
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
    noInsights: 'មិនទាន់មានស្ថិតិ Campaign',
  },
  zh: {
    title: '推广内容', back: '返回', create: '创建推广', campaigns: '我的广告活动', insights: '数据分析',
    story: '推广故事', storyHint: '小说、漫画、聊天故事', pdf: '推广 PDF', pdfHint: '推广电子书销售',
    physical: '纸质书', physicalHint: '推广纸质书订单', post: '推广帖子', postHint: '推广 Discover 帖子',
    noCampaigns: '暂无广告活动', noCampaignsHint: '选择推广类型，创建第一个活动。',
    chooseBoost: '选择推广类型', close: '关闭', loading: '正在加载活动...',
    unavailable: '无法检查活动，请重试。', retry: '重试', loadMore: '加载更多', localDraft: '本地草稿', draft: '草稿',
    storeItem: '书籍 / PDF', insightsPending: '广告投放数据追踪启用后，此处将显示活动结果。', noInsights: '暂无广告数据',
  },
  ja: {
    title: 'コンテンツを宣伝', back: '戻る', create: '広告を作成', campaigns: 'マイキャンペーン', insights: '分析',
    story: 'ストーリーを宣伝', storyHint: '小説・マンガ・チャットストーリー', pdf: 'PDFを宣伝', pdfHint: '電子書籍の販売を促進',
    physical: '紙の本', physicalHint: '紙の本の注文を促進', post: '投稿を宣伝', postHint: 'Discoverの投稿を宣伝',
    noCampaigns: 'キャンペーンはまだありません', noCampaignsHint: '種類を選んで最初のキャンペーンを作成しましょう。',
    chooseBoost: '種類を選択', close: '閉じる', loading: '読み込み中...',
    unavailable: 'キャンペーンを確認できません。再試行してください。', retry: '再試行',
    loadMore: 'さらに表示', localDraft: '端末の下書き', draft: '下書き',
    storeItem: '書籍 / PDF', insightsPending: '配信結果の追跡が利用可能になると、ここに表示されます。', noInsights: 'まだ分析データはありません',
  },
  ko: {
    title: '콘텐츠 홍보', back: '뒤로', create: '부스트 만들기', campaigns: '내 캠페인', insights: '통계',
    story: '스토리 홍보', storyHint: '소설, 만화, 채팅 스토리', pdf: 'PDF 홍보', pdfHint: '디지털 도서 판매 홍보',
    physical: '종이책', physicalHint: '인쇄 도서 주문 홍보', post: '게시물 홍보', postHint: 'Discover 게시물 홍보',
    noCampaigns: '캠페인이 없습니다', noCampaignsHint: '종류를 선택해 첫 캠페인을 만드세요.',
    chooseBoost: '부스트 선택', close: '닫기', loading: '캠페인 불러오는 중...',
    unavailable: '캠페인을 확인할 수 없습니다. 다시 시도하세요.', retry: '다시 시도',
    loadMore: '더 보기', localDraft: '기기 초안', draft: '초안',
    storeItem: '도서 / PDF', insightsPending: '광고 게재 추적이 활성화되면 캠페인 결과가 여기에 표시됩니다.', noInsights: '캠페인 통계가 없습니다',
  },
})

const CHOICES = [
  { id: 'story', icon: BookOpen, title: 'story', hint: 'storyHint', tint: 'violet' },
  { id: 'pdf', icon: FileText, title: 'pdf', hint: 'pdfHint', tint: 'amber' },
  { id: 'physical', icon: BookCopy, title: 'physical', hint: 'physicalHint', tint: 'amber' },
  { id: 'post', icon: ImageIcon, title: 'post', hint: 'postHint', tint: 'violet' },
]
const API_BASE = (import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)).replace(/\/$/, '')

function readerToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function readLocalDrafts(username) {
  try {
    const raw = JSON.parse(localStorage.getItem(`shadow_author_ads_drafts_v1_${username}`) || '[]')
    return Array.isArray(raw) ? raw : []
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
  const { t } = useDisplayTranslation()
  const tr = value => t(`authorAdsBoostSelection.${value}`)
  const [tab, setTab] = useState('create')
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [showEmptyChooser, setShowEmptyChooser] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const usernameRef = useRef('')

  const goToEditor = type => {
    setShowEmptyChooser(false)
    navigate(`/author/page/ads/boost-editor?type=${encodeURIComponent(type)}`)
  }

  useEffect(() => {
    if (tab !== 'campaigns') return undefined
    const controller = new AbortController()
    let active = true
    setLoading(true)
    setLoadError(false)
    Promise.allSettled([
      listAuthorAdCampaigns({ page: 1, limit: 10, signal: controller.signal }),
      usernameRef.current ? Promise.resolve(usernameRef.current) : getAuthorUsername(controller.signal),
    ]).then(([remote, account]) => {
      if (!active) return
      const username = account.status === 'fulfilled' ? account.value : ''
      if (username) usernameRef.current = username
      const local = username ? readLocalDrafts(username).map(item => ({ ...item, deviceDraft: true })) : []
      const cloud = remote.status === 'fulfilled' ? remote.value.campaigns : []
      const merged = new Map(cloud.map(item => [String(item.id), item]))
      local.forEach(item => { if (item.id && !merged.has(String(item.id))) merged.set(String(item.id), item) })
      const records = [...merged.values()]
      setCampaigns(records)
      setPage(1)
      setHasMore(remote.status === 'fulfilled' && remote.value.has_more)
      setLoaded(true)
      const failed = remote.status === 'rejected' || account.status === 'rejected'
      setLoadError(failed)
      if (records.length === 0 && !failed) setShowEmptyChooser(true)
      setLoading(false)
    })
    return () => { active = false; controller.abort() }
  }, [tab, refreshCount])

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const data = await listAuthorAdCampaigns({ page: page + 1, limit: 10 })
      setCampaigns(current => {
        const records = new Map(current.map(item => [String(item.id), item]))
        data.campaigns.forEach(item => records.set(String(item.id), item))
        return [...records.values()]
      })
      setPage(data.page)
      setHasMore(data.has_more)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  const openTab = next => {
    setShowEmptyChooser(false)
    setTab(next)
    if (next === 'campaigns' && loaded) {
      if (!campaigns.length && !loadError) setShowEmptyChooser(true)
    }
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
          <h2 className="px-1 text-lg font-semibold">{tr('campaigns')}</h2>
          {loadError && <div role="alert" className="rounded-2xl border border-[#e9dba8] bg-[#fff8de] p-4 text-sm text-[#6a5020] dark:bg-[#4b3a1b] dark:text-[#ffecbc]">
            {tr('unavailable')}
            <button type="button" className="ml-3 font-semibold underline" onClick={() => { setLoaded(false); setRefreshCount(current => current + 1) }}>{tr('retry')}</button>
          </div>}
          {campaigns.map(item => (
            <div key={String(item.id)} className="rounded-2xl border border-[#e9e6f3] bg-white p-4 dark:border-white/10 dark:bg-[#231d30]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold">{String(item.content_title || item.contentTitle || item.title || tr('campaigns'))}</h3>
                  <p className="mt-2 text-xs text-[#888398] dark:text-[#c1bad0]">{item.deviceDraft ? tr('localDraft') : String(item.status || tr('draft')).replaceAll('_', ' ')}</p>
                </div>
                <span className="rounded-full bg-[#f1ebff] px-2.5 py-1 text-[11px] font-medium text-[#6335d7] dark:bg-[#36294e] dark:text-[#d4baff]">
                  {item.kind === 'post' ? tr('post') : item.content_type === 'product' || item.contentType === 'product' ? tr('storeItem') : tr('story')}
                </span>
              </div>
              <div className="mt-3 flex gap-4 text-xs text-[#817b91] dark:text-[#b9b0cc]">
                {Number.isFinite(Number(item.budget_usd ?? item.budgetUsd)) && <span>{Math.round(Number(item.budget_usd ?? item.budgetUsd) * 100).toLocaleString()} 💎</span>}
                {(item.duration_days || item.durationDays) && <span>{item.duration_days || item.durationDays} days</span>}
              </div>
            </div>
          ))}
          {loading && <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#8b849c]"><RefreshCw size={17} className="animate-spin" />{tr('loading')}</div>}
          {!loading && loaded && !campaigns.length && !loadError && <button type="button" className="w-full rounded-2xl border border-dashed border-[#dcd4ee] bg-white px-5 py-10 text-center dark:bg-[#231d30]" onClick={() => setShowEmptyChooser(true)}>
            <Megaphone size={28} className="mx-auto mb-3 text-[#6d4ccb]" />
            <span className="block font-semibold">{tr('noCampaigns')}</span>
            <span className="mt-2 block text-xs text-[#827b92]">{tr('noCampaignsHint')}</span>
          </button>}
          {!loading && hasMore && <button type="button" className="w-full rounded-xl border border-[#e9e6f3] bg-white py-3 text-sm font-medium dark:bg-[#231d30]" onClick={loadMore}>{tr('loadMore')}</button>}
        </section>}

        {tab === 'insights' && <section className="rounded-2xl border border-[#eeebf8] bg-white px-5 py-12 text-center dark:border-white/10 dark:bg-[#231d30]">
          <BarChart3 size={34} className="mx-auto text-[#6d4ccb]" />
          <h2 className="mt-4 font-semibold">{tr('noInsights')}</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#827b92] dark:text-[#bdb5cd]">{tr('insightsPending')}</p>
        </section>}
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

      {showEmptyChooser && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4" onMouseDown={event => { if (event.target === event.currentTarget) setShowEmptyChooser(false) }}>
        <div role="dialog" aria-modal="true" aria-labelledby="boost-picker-title" className="w-full max-w-sm rounded-[26px] bg-white p-5 shadow-xl dark:bg-[#251e33]">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h2 id="boost-picker-title" className="text-lg font-bold">{tr('noCampaigns')}</h2>
              <p className="mt-1 text-xs leading-5 text-[#898294] dark:text-[#c5bcce]">{tr('noCampaignsHint')}</p>
            </div>
            <button type="button" aria-label={tr('close')} onClick={() => setShowEmptyChooser(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3effa] text-[#6c6479] dark:bg-[#3a2f4c] dark:text-white"><X size={17} /></button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {CHOICES.map(choice => <button key={choice.id} type="button" onClick={() => goToEditor(choice.id)} className="flex flex-col items-center gap-2 rounded-2xl border border-[#eee8f8] bg-[#faf8ff] px-2 py-4 text-center dark:border-white/10 dark:bg-[#342a45]">
              <choice.icon size={26} className="text-[#6840cd] dark:text-[#c6a8ff]" />
              <span className="text-xs font-semibold">{tr(choice.title)}</span>
            </button>)}
          </div>
        </div>
      </div>}
    </main>
  )
}

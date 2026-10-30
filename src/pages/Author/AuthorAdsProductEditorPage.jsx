import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, CircleCheck,
  FileText, BookOpen, Gem, Info, Loader2, Search, ShoppingBag, Users,
} from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { createAuthorAdDraft, updateAuthorAdDraft } from '../../services/authorAdsApi'

registerTranslationNamespace('boostProductEditor', {
  en: {
    pdfTitle: 'Boost PDF', bookTitle: 'Boost Physical Book', content: 'Content', goal: 'Goal', audience: 'Audience', budget: 'Budget',
    selectPdf: 'Select your PDF', selectBook: 'Select your physical book', search: 'Search your products...',
    loading: 'Loading products...', emptyPdf: 'No active PDF products found.', emptyBook: 'No active physical books found.', more: 'Load more products', retry: 'Try again',
    sales: 'More book sales', salesHint: 'Encourage readers to purchase this product.', followers: 'More followers', followersHint: 'Invite readers to follow your Author Page.',
    goalTitle: 'Campaign goal', audienceTitle: 'Target audience', all: 'All audience', allHint: 'Let Shadow find potential readers broadly.',
    genre: 'Genre audience', genreHint: 'Choose a genre, country and reading language.', fans: 'Follower audience', fansHint: 'Target only your existing followers.', soon: 'Coming Soon',
    genrePick: 'Genre', country: 'Country', language: 'Reading language', any: 'Any', cambodia: 'Cambodia', thailand: 'Thailand', vietnam: 'Vietnam',
    targetingNote: 'Follower-only targeting and age, gender, province filters are not connected yet.',
    budgetTitle: 'Budget and duration', diamonds: 'Diamonds', duration: 'Duration', day: '{{count}} days',
    budgetNote: '100 Diamonds = $1. Saving a draft does not charge Diamonds. Reach is estimated.', reach: 'Estimated reach: about {{count}} people',
    preview: 'Ad preview', sponsored: 'Sponsored', buy: 'Buy Now', draft: 'Save Draft', saving: 'Saving...', next: 'Continue', back: 'Back', review: 'Review & Save',
    saved: 'Draft saved. It is not live.', deviceSaved: 'Draft saved on this device. It is not live.',
    chooseFirst: 'Choose an active product first.', genreFirst: 'Choose a genre first.',
    invalidBudget: 'Enter 100–1,000,000 whole Diamonds.', saveFailed: 'Could not save this draft. Please try again.', loadFailed: 'Could not load your products.',
    submitNote: 'Draft only: review, approval and a separate Start action are required before Diamonds are reserved.', finish: 'Back to Boost Content',
  },
  km: {
    pdfTitle: 'Boost PDF', bookTitle: 'Boost Physical Book', content: 'Content', goal: 'Goal', audience: 'Audience', budget: 'Budget',
    selectPdf: 'ជ្រើសរើសសៀវភៅ PDF', selectBook: 'ជ្រើសរើសសៀវភៅក្រដាស', search: 'ស្វែងរកសៀវភៅ...',
    loading: 'កំពុងផ្ទុកសៀវភៅ...', emptyPdf: 'មិនមាន PDF ដែលបានបើកលក់ទេ។', emptyBook: 'មិនមានសៀវភៅក្រដាសដែលបានបើកលក់ទេ។', more: 'មើលសៀវភៅបន្ថែម', retry: 'សាកម្តងទៀត',
    sales: 'បង្កើនការលក់សៀវភៅ', salesHint: 'ជំរុញឱ្យអ្នកអានទិញផលិតផលនេះ។', followers: 'បង្កើន Follower', followersHint: 'ជំរុញឱ្យអ្នកអានតាមដាន Author Page។',
    goalTitle: 'គោលដៅ Campaign', audienceTitle: 'ក្រុមអ្នកអានគោលដៅ', all: 'អ្នកប្រើប្រាស់ទាំងអស់', allHint: 'ឱ្យ Shadow ស្វែងរកអ្នកទិញដែលចាប់អារម្មណ៍។',
    genre: 'អ្នកអានតាម Genre', genreHint: 'កំណត់ Genre ប្រទេស និងភាសាអាន។', fans: 'Follower Audience', fansHint: 'ផ្សព្វផ្សាយតែទៅកាន់ Follower របស់អ្នក។', soon: 'Coming Soon',
    genrePick: 'Genre', country: 'ប្រទេស', language: 'ភាសាអាន', any: 'ទាំងអស់', cambodia: 'កម្ពុជា', thailand: 'ថៃ', vietnam: 'វៀតណាម',
    targetingNote: 'Follower-only និងការរើសអាយុ ភេទ ខេត្ត មិនទាន់ភ្ជាប់ Backend ទេ។',
    budgetTitle: 'ថវិកា និងរយៈពេល', diamonds: 'ពេជ្រ (Diamonds)', duration: 'រយៈពេល', day: '{{count}} ថ្ងៃ',
    budgetNote: '100 ពេជ្រ = $1។ Save Draft មិនដកពេជ្រទេ។ Reach គ្រាន់តែប៉ាន់ស្មាន។', reach: 'Reach ប៉ាន់ស្មាន៖ ប្រហែល {{count}} នាក់',
    preview: 'មើល Ad ជាមុន', sponsored: 'Sponsored', buy: 'ទិញឥឡូវ', draft: 'Save Draft', saving: 'កំពុងរក្សាទុក...', next: 'Continue', back: 'ត្រឡប់ក្រោយ', review: 'Review & Save',
    saved: 'បានរក្សាទុក Draft ហើយ។ មិនទាន់ផ្សាយទេ។', deviceSaved: 'បានរក្សាទុក Draft ក្នុងឧបករណ៍។ មិនទាន់ផ្សាយទេ។',
    chooseFirst: 'សូមជ្រើសសៀវភៅដែលកំពុងលក់ជាមុន។', genreFirst: 'សូមជ្រើស Genre ជាមុន។',
    invalidBudget: 'សូមបញ្ចូលពេជ្រចាប់ពី 100 ដល់ 1,000,000 ជាចំនួនគត់។', saveFailed: 'មិនអាចរក្សាទុក Draft បានទេ។', loadFailed: 'មិនអាចផ្ទុកសៀវភៅបានទេ។',
    submitNote: 'នេះជា Draft ប៉ុណ្ណោះ។ ត្រូវត្រួតពិនិត្យ អនុម័ត និងចុច Start ដាច់ដោយឡែក មុនកក់ពេជ្រ។', finish: 'ត្រឡប់ទៅ Boost Content',
  },
  zh: {
    pdfTitle: '推广 PDF', bookTitle: '推广纸质书', content: '内容', goal: '目标', audience: '受众', budget: '预算', selectPdf: '选择 PDF', selectBook: '选择纸质书', search: '搜索商品...',
    loading: '加载商品中...', emptyPdf: '暂无在售 PDF', emptyBook: '暂无在售纸质书', more: '加载更多', retry: '重试', sales: '增加销量', salesHint: '鼓励购买此商品', followers: '增加粉丝', followersHint: '吸引粉丝关注作者',
    goalTitle: '推广目标', audienceTitle: '目标受众', all: '广泛受众', allHint: '让 Shadow 寻找感兴趣的读者', genre: '题材受众', genreHint: '选择题材、国家和语言', fans: '现有粉丝', fansHint: '仅面向关注者', soon: '即将推出',
    genrePick: '题材', country: '国家', language: '阅读语言', any: '全部', cambodia: '柬埔寨', thailand: '泰国', vietnam: '越南', targetingNote: '粉丝专属及年龄、性别、省份定位尚未接入',
    budgetTitle: '预算和时长', diamonds: '钻石', duration: '时长', day: '{{count}} 天', budgetNote: '100钻石 = $1；保存草稿不扣款，预计覆盖不保证', reach: '预计覆盖约 {{count}} 人',
    preview: '广告预览', sponsored: '广告', buy: '立即购买', draft: '保存草稿', saving: '保存中...', next: '继续', back: '返回', review: '确认并保存', saved: '草稿已保存，未投放', deviceSaved: '草稿已保存到设备',
    chooseFirst: '请先选择在售商品', genreFirst: '请选择题材', invalidBudget: '输入100–1,000,000整数钻石', saveFailed: '保存失败', loadFailed: '商品加载失败', submitNote: '需经过审核、批准和单独启动才会预留钻石', finish: '返回推广内容',
  },
  ja: {
    pdfTitle: 'PDF を宣伝', bookTitle: '紙の本を宣伝', content: '内容', goal: '目標', audience: '対象', budget: '予算', selectPdf: 'PDFを選択', selectBook: '紙の本を選択', search: '商品を検索...',
    loading: '商品を読み込み中...', emptyPdf: '販売中の PDF はありません', emptyBook: '販売中の紙の本はありません', more: 'さらに表示', retry: '再試行', sales: '売上を増やす', salesHint: '購入を促す', followers: 'フォロワーを増やす', followersHint: '作者ページのフォローを増やす',
    goalTitle: 'キャンペーン目標', audienceTitle: '対象読者', all: 'すべての読者', allHint: '幅広い読者に配信', genre: 'ジャンル別', genreHint: 'ジャンル、国、言語を選ぶ', fans: '既存フォロワー', fansHint: 'フォロワーだけに配信', soon: '近日公開',
    genrePick: 'ジャンル', country: '国', language: '読書言語', any: 'すべて', cambodia: 'カンボジア', thailand: 'タイ', vietnam: 'ベトナム', targetingNote: 'フォロワー限定・年齢・性別・地域別は未対応です',
    budgetTitle: '予算と期間', diamonds: 'ダイヤ', duration: '期間', day: '{{count}}日', budgetNote: '100ダイヤ = $1。下書き保存時に課金はありません', reach: '推定リーチ約{{count}}人',
    preview: '広告プレビュー', sponsored: '広告', buy: '購入する', draft: '下書き保存', saving: '保存中...', next: '続ける', back: '戻る', review: '確認して保存', saved: '下書きを保存しました', deviceSaved: '端末に保存しました',
    chooseFirst: '販売中の商品を選んでください', genreFirst: 'ジャンルを選んでください', invalidBudget: '100〜1,000,000の整数ダイヤを入力', saveFailed: '保存できませんでした', loadFailed: '商品を読み込めません', submitNote: '審査・承認・開始後にのみダイヤを確保します', finish: 'コンテンツ選択へ戻る',
  },
  ko: {
    pdfTitle: 'PDF 홍보', bookTitle: '종이책 홍보', content: '콘텐츠', goal: '목표', audience: '대상', budget: '예산', selectPdf: 'PDF 선택', selectBook: '종이책 선택', search: '상품 검색...',
    loading: '상품 로딩...', emptyPdf: '판매 중인 PDF 없음', emptyBook: '판매 중인 종이책 없음', more: '더 보기', retry: '다시 시도', sales: '판매 늘리기', salesHint: '상품 구매 촉진', followers: '팔로워 늘리기', followersHint: '작가 페이지 팔로워 확대',
    goalTitle: '캠페인 목표', audienceTitle: '타겟 독자', all: '모든 독자', allHint: '폭넓게 홍보', genre: '장르별 독자', genreHint: '장르, 국가, 언어 선택', fans: '기존 팔로워', fansHint: '팔로워에게만 홍보', soon: '출시 예정',
    genrePick: '장르', country: '국가', language: '독서 언어', any: '전체', cambodia: '캄보디아', thailand: '태국', vietnam: '베트남', targetingNote: '팔로워 전용 및 나이, 성별, 지역 타겟팅은 아직 연결되지 않았습니다',
    budgetTitle: '예산 및 기간', diamonds: '다이아', duration: '기간', day: '{{count}}일', budgetNote: '100다이아 = $1. 초안 저장 시 차감되지 않습니다', reach: '예상 도달 약 {{count}}명',
    preview: '광고 미리보기', sponsored: '광고', buy: '구매하기', draft: '초안 저장', saving: '저장 중...', next: '계속', back: '뒤로', review: '확인 후 저장', saved: '초안이 저장되었습니다', deviceSaved: '기기에 초안 저장됨',
    chooseFirst: '판매 중인 상품을 선택하세요', genreFirst: '장르를 선택하세요', invalidBudget: '100~1,000,000 정수 다이아 입력', saveFailed: '저장할 수 없습니다', loadFailed: '상품 로드 실패', submitNote: '검토·승인·시작 후에만 다이아 예약', finish: '부스트 선택으로 돌아가기',
  },
})

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com').replace(/\/$/, '')
const GENRES = ['Romance', 'Fantasy', 'Action', 'Adventure', 'Horror', 'Mystery', 'Drama', 'Comedy', 'Historical', 'Sci-Fi', 'LGBTQ+']
const STEPS = ['content', 'goal', 'audience', 'budget']
const CARD = 'rounded-3xl border border-[#edeaf5] bg-white p-4 shadow-[0_5px_25px_rgba(57,37,100,.04)] dark:border-white/10 dark:bg-[#241e30] sm:p-5'
const FIELD = 'mt-2 w-full rounded-xl border border-[#e8e2f0] bg-white p-3 text-sm text-[#21192e] outline-none focus:border-[#7045e8] dark:border-white/10 dark:bg-[#3c304a] dark:text-white'

function readerToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function apiGet(path, signal) {
  const auth = readerToken()
  if (!auth) throw new Error('AUTH_REQUIRED')
  const res = await fetch(`${API_ORIGIN}${path}`, {
    headers: { Authorization: `Bearer ${auth}` }, signal, cache: 'no-store',
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data || data.ok === false) throw new Error('REQUEST_FAILED')
  return data
}

function safeImage(value) {
  const url = String(value || '').trim()
  return /^https:\/\//i.test(url) || /^\/(?!\/)/.test(url) ? url : ''
}

function Choice({ selected, title, hint, disabled = false, badge, onClick }) {
  return (
    <button type="button" disabled={disabled} aria-pressed={selected} onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${selected ? 'border-[#7045e8] bg-[#f7f3ff] dark:bg-[#41305b]' : 'border-[#e9e7f1] bg-white dark:border-white/10 dark:bg-[#2a2437]'}`}>
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#7045e8] bg-[#7045e8] text-white' : 'border-[#c9c5d5]'}`}>{selected && <Check size={13} />}</span>
      <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-sm font-semibold">{title}{badge && <span className="rounded-full bg-[#fff0c1] px-2 py-0.5 text-[10px] text-[#76540c]">{badge}</span>}</span>{hint && <span className="mt-1 block text-xs leading-5 text-[#817d90] dark:text-[#c4bcd1]">{hint}</span>}</span>
    </button>
  )
}

export default function AuthorAdsProductEditorPage({ productType = 'pdf' }) {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = (key, options) => t(`boostProductEditor.${key}`, options)
  const isPdf = productType === 'pdf'
  const type = isPdf ? 'pdf' : 'book'
  const [step, setStep] = useState(0)
  const [products, setProducts] = useState([])
  const [username, setUsername] = useState('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [goal, setGoal] = useState('sales')
  const [audience, setAudience] = useState('all')
  const [genre, setGenre] = useState('')
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [diamonds, setDiamonds] = useState('100')
  const [duration, setDuration] = useState(3)
  const [saving, setSaving] = useState(false)
  const [cloudId, setCloudId] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [notice, setNotice] = useState('')
  const [saved, setSaved] = useState(false)

  const loadFirst = useCallback(async signal => {
    setLoading(true)
    setLoadError(false)
    try {
      const account = await apiGet('/api/authors/me?include_works=0', signal)
      const name = String(account.author_page?.page_username || '').trim()
      if (!name) throw new Error('AUTHOR_REQUIRED')
      setUsername(name)
      const result = await apiGet(`/api/author-store/page/${encodeURIComponent(name)}/products?page=1&limit=10`, signal)
      setProducts((result.products || []).filter(x => x.status === 'active' && x.product_type === type))
      setHasMore(Boolean(result.pagination?.has_next))
      setPage(Number(result.pagination?.page) || 1)
    } catch (error) {
      if (signal?.aborted) return
      if (error?.message === 'AUTH_REQUIRED') navigate('/login')
      else setLoadError(true)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [navigate, type])

  useEffect(() => {
    const controller = new AbortController()
    loadFirst(controller.signal)
    return () => controller.abort()
  }, [loadFirst])

  const loadMore = async () => {
    if (loadingMore || !hasMore || !username) return
    setLoadingMore(true)
    try {
      const result = await apiGet(`/api/author-store/page/${encodeURIComponent(username)}/products?page=${page + 1}&limit=10`)
      setProducts(old => {
        const map = new Map(old.map(x => [String(x.id), x]))
        ;(result.products || []).filter(x => x.status === 'active' && x.product_type === type).forEach(x => map.set(String(x.id), x))
        return [...map.values()]
      })
      setPage(Number(result.pagination?.page) || page + 1)
      setHasMore(Boolean(result.pagination?.has_next))
    } catch { setLoadError(true) } finally { setLoadingMore(false) }
  }

  const chosen = products.find(x => String(x.id) === selectedId)
  const visible = useMemo(() => products.filter(x => String(x.title || '').toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())), [products, search])
  const budgetNumber = Number(diamonds)
  const validBudget = Number.isSafeInteger(budgetNumber) && budgetNumber >= 100 && budgetNumber <= 1000000

  const validationError = () => {
    if (!chosen) return tr('chooseFirst')
    if (audience === 'genre' && !genre) return tr('genreFirst')
    if (!validBudget) return tr('invalidBudget')
    return ''
  }

  const change = setter => value => { setter(value); setSaved(false); setNotice('') }

  const saveDraft = async () => {
    if (saving || saved) return
    if (!username) return setNotice(tr('chooseFirst'))
    const validation = validationError()
    if (validation) return setNotice(validation)
    const now = new Date().toISOString()
    const data = {
      kind: 'book', contentType: 'product', contentId: String(chosen.id), goal,
      audience: {
        mode: audience === 'genre' ? 'manual' : 'automatic',
        genre: audience === 'genre' ? genre : '',
        country: audience === 'genre' ? country : '',
        language: audience === 'genre' ? language : '',
      },
      budgetUsd: budgetNumber / 100, durationDays: duration,
    }
    setSaving(true)
    setNotice('')
    try {
      if (deviceId) {
        const key = `shadow_author_ads_drafts_v1_${username}`
        const previous = JSON.parse(localStorage.getItem(key) || '[]')
        const records = Array.isArray(previous) ? previous : []
        const old = records.find(x => x.id === deviceId)
        const record = { ...data, id: deviceId, status: 'draft', contentKey: `product:${chosen.id}`,
          contentTitle: chosen.title, contentImage: chosen.cover_url || '',
          updatedAt: now, createdAt: old?.createdAt || now }
        localStorage.setItem(key, JSON.stringify([record, ...records.filter(x => x.id !== deviceId)]))
        setNotice(tr('deviceSaved'))
      } else {
        const result = cloudId ? await updateAuthorAdDraft(cloudId, data) : await createAuthorAdDraft(data)
        setCloudId(result.id)
        setNotice(tr('saved'))
      }
      setSaved(true)
    } catch (error) {
      if (!cloudId && error?.code === 'AUTHOR_ADS_NOT_CONFIGURED') {
        try {
          const id = crypto.randomUUID()
          const key = `shadow_author_ads_drafts_v1_${username}`
          const previous = JSON.parse(localStorage.getItem(key) || '[]')
          const records = Array.isArray(previous) ? previous : []
          const record = { ...data, id, status: 'draft', contentKey: `product:${chosen.id}`,
            contentTitle: chosen.title, contentImage: chosen.cover_url || '',
            updatedAt: now, createdAt: now }
          localStorage.setItem(key, JSON.stringify([record, ...records]))
          setDeviceId(id)
          setNotice(tr('deviceSaved'))
          setSaved(true)
        } catch { setNotice(tr('saveFailed')) }
      } else setNotice(tr('saveFailed'))
    } finally { setSaving(false) }
  }

  const next = () => {
    if (step === 0 && !chosen) return setNotice(tr('chooseFirst'))
    if (step === 2 && audience === 'genre' && !genre) return setNotice(tr('genreFirst'))
    if (step === 3) return saveDraft()
    setNotice('')
    setStep(value => value + 1)
  }

  return (
    <main className="min-h-[100dvh] bg-[#faf9ff] pb-[138px] text-[#1c1728] dark:bg-[#14111d] dark:text-white">
      <div className="mx-auto max-w-2xl px-4 pt-4 sm:px-6">
        <header className="mb-6 flex items-center gap-4">
          <button type="button" className="-ml-2 p-2" aria-label={tr('back')} onClick={() => navigate('/author/page/ads/boost-content')}><ArrowLeft size={24} /></button>
          <h1 className="text-[22px] font-bold">{tr(isPdf ? 'pdfTitle' : 'bookTitle')}</h1>
        </header>

        <div className="mb-6 flex items-start justify-between gap-1" aria-label="Campaign steps">
          {STEPS.map((key, index) => <button type="button" key={key} onClick={() => { if (index < step && !saved) { setStep(index); setNotice('') } }} disabled={index > step || saved} aria-current={step === index ? 'step' : undefined} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 disabled:cursor-default">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${index === step ? 'bg-[#6335d7] text-white' : index < step ? 'bg-[#e8dfff] text-[#6335d7]' : 'bg-[#eae9f1] text-[#747080] dark:bg-[#353041] dark:text-[#cbc3d5]'}`}>{index < step ? <Check size={17} /> : index + 1}</span>
            <span className={`text-[11px] sm:text-xs ${index === step ? 'font-semibold text-[#6335d7] dark:text-[#b59aff]' : 'text-[#868095] dark:text-[#beb6ca]'}`}>{tr(key)}</span>
          </button>)}
        </div>

        {step === 0 && <section className={CARD}>
          <h2 className="mb-4 text-base font-bold">{tr(isPdf ? 'selectPdf' : 'selectBook')}</h2>
          <div className="relative mb-3"><Search size={18} className="absolute left-3 top-3.5 text-[#9592a3]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={tr('search')} className="w-full rounded-xl border border-[#e8e5ee] bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8b62ea] dark:border-white/10 dark:bg-[#342b42]" /></div>
          {loading && <div className="flex justify-center py-9 text-sm text-[#888297]"><Loader2 className="mr-2 animate-spin" size={18} />{tr('loading')}</div>}
          {!loading && !visible.length && !loadError && <p className="py-8 text-center text-sm text-[#898497]">{tr(isPdf ? 'emptyPdf' : 'emptyBook')}</p>}
          {!loading && <div className="space-y-2">{visible.map(item => {
            const active = selectedId === String(item.id)
            const Icon = isPdf ? FileText : BookOpen
            return <button key={item.id} type="button" aria-pressed={active} onClick={() => { setSelectedId(String(item.id)); setNotice(''); setSaved(false) }} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${active ? 'border-[#7348e4] bg-[#f8f4ff] dark:bg-[#3b2c55]' : 'border-[#ebe8f2] bg-white dark:border-white/10 dark:bg-[#2c2438]'}`}>
              <span className="flex h-[68px] w-[55px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eee9f6]">{safeImage(item.cover_url) ? <img src={safeImage(item.cover_url)} alt="" className="h-full w-full object-cover" loading="lazy" /> : <Icon size={25} />}</span>
              <span className="min-w-0 flex-1"><span className="line-clamp-2 text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs text-[#858095] dark:text-[#c8bfce]">{isPdf ? 'PDF' : 'Physical Book'}{item.category ? ` · ${item.category}` : ''}</span></span>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#6940dc] bg-[#6940dc] text-white' : 'border-[#d2ccdd]'}`}>{active && <Check size={12} />}</span>
            </button>
          })}</div>}
          {loadError && <button type="button" onClick={() => { const c = new AbortController(); loadFirst(c.signal) }} className="mt-3 rounded-lg border border-[#e6dff1] px-4 py-2 text-sm text-[#6940dc]">{tr('retry')}</button>}
          {hasMore && <button type="button" disabled={loadingMore} onClick={loadMore} className="mt-4 flex w-full justify-center rounded-xl bg-[#f2edfa] py-3 text-sm font-semibold text-[#6335d7] disabled:opacity-50 dark:bg-[#372948] dark:text-[#d1bcff]">{loadingMore ? tr('loading') : tr('more')}</button>}
        </section>}

        {step === 1 && <section className={CARD}>
          <h2 className="mb-4 font-bold">{tr('goalTitle')}</h2>
          <div className="space-y-2">
            <Choice selected={goal === 'sales'} title={tr('sales')} hint={tr('salesHint')} onClick={() => change(setGoal)('sales')} />
            <Choice selected={goal === 'followers'} title={tr('followers')} hint={tr('followersHint')} onClick={() => change(setGoal)('followers')} />
          </div>
        </section>}

        {step === 2 && <section className={CARD}>
          <h2 className="mb-4 font-bold">{tr('audienceTitle')}</h2>
          <div className="space-y-2">
            <Choice selected={audience === 'all'} title={tr('all')} hint={tr('allHint')} onClick={() => change(setAudience)('all')} />
            <Choice selected={audience === 'genre'} title={tr('genre')} hint={tr('genreHint')} onClick={() => change(setAudience)('genre')} />
            <Choice selected={false} title={tr('fans')} hint={tr('fansHint')} badge={tr('soon')} disabled />
          </div>
          {audience === 'genre' && <div className="mt-4 space-y-3 rounded-xl bg-[#f8f6fc] p-3 dark:bg-[#30283c]">
            <label className="block text-xs font-semibold">{tr('genrePick')}
              <select value={genre} onChange={e => change(setGenre)(e.target.value)} className={FIELD}><option value="">{tr('any')}</option>{GENRES.map(value => <option key={value} value={value}>{value}</option>)}</select>
            </label>
            <label className="block text-xs font-semibold">{tr('country')}
              <select value={country} onChange={e => change(setCountry)(e.target.value)} className={FIELD}>
                <option value="">{tr('any')}</option><option value="KH">{tr('cambodia')}</option><option value="TH">{tr('thailand')}</option><option value="VN">{tr('vietnam')}</option>
              </select>
            </label>
            <label className="block text-xs font-semibold">{tr('language')}
              <select value={language} onChange={e => change(setLanguage)(e.target.value)} className={FIELD}>
                <option value="">{tr('any')}</option><option value="km">ខ្មែរ</option><option value="en">English</option><option value="zh">中文</option><option value="ja">日本語</option><option value="ko">한국어</option>
              </select>
            </label>
          </div>}
          <p className="mt-4 flex gap-2 text-xs leading-5 text-[#92899a] dark:text-[#c1b9cc]"><Users size={16} className="shrink-0" />{tr('targetingNote')}</p>
        </section>}

        {step === 3 && <div className="space-y-4">
          <section className={CARD}>
            <h2 className="mb-4 font-bold">{tr('budgetTitle')}</h2>
            <label className="block text-xs font-medium">{tr('diamonds')}
              <span className="relative mt-2 block"><Gem size={18} className="absolute left-3 top-3 text-[#6940d1]" /><input type="number" inputMode="numeric" min="100" max="1000000" step="1" value={diamonds} onChange={e => change(setDiamonds)(e.target.value)} className="w-full rounded-xl border border-[#e6e3ef] bg-white py-2.5 pl-10 pr-3 text-base font-semibold outline-none focus:border-[#6335d7] dark:border-white/10 dark:bg-[#302739]" /></span>
            </label>
            <p className="mt-2 text-xs leading-5 text-[#888195] dark:text-[#c5bdcd]">{tr('budgetNote')}</p>
            <div className="mt-5 text-sm font-semibold">{tr('duration')}</div>
            <div className="mt-2 grid grid-cols-4 gap-2">{[1, 3, 7, 14].map(n => <button type="button" key={n} onClick={() => change(setDuration)(n)} className={`rounded-xl border px-1 py-3 text-[11px] font-medium ${duration === n ? 'border-[#744ade] bg-[#f2ebff] text-[#6335d7] dark:bg-[#433158] dark:text-[#dbccff]' : 'border-[#e8e5ee] text-[#6d667b] dark:border-white/10 dark:text-[#e1d7ea]'}`}>{tr('day', { count: n })}</button>)}</div>
            {validBudget && <p className="mt-4 text-xs font-medium text-[#6940d1]">{tr('reach', { count: budgetNumber.toLocaleString() })}</p>}
          </section>
          <section className={CARD}>
            <h2 className="mb-4 font-bold">{tr('preview')}</h2>
            <div className="flex items-center gap-3 rounded-xl border border-[#eae7f0] p-3 dark:border-white/10">
              <span className="flex h-[72px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f1eaf7]">{safeImage(chosen?.cover_url) ? <img src={safeImage(chosen.cover_url)} alt="" className="h-full w-full object-cover" /> : (isPdf ? <FileText size={22} /> : <ShoppingBag size={22} />)}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{chosen?.title}</span><span className="mt-1 block text-[11px] text-[#898294]">{tr('sponsored')}</span></span>
              <span className="shrink-0 rounded-lg bg-[#f0eaff] px-3 py-2 text-xs font-semibold text-[#6335d7]">{tr('buy')}</span>
            </div>
            <p className="mt-4 flex gap-2 text-xs leading-5 text-[#898295]"><Info size={15} className="shrink-0" />{tr('submitNote')}</p>
          </section>
        </div>}

        {notice && <div role="status" className={`mt-4 rounded-xl border p-3 text-sm ${saved ? 'border-[#d6c5ff] bg-[#f1eaff] text-[#6134ce] dark:bg-[#35284a] dark:text-[#e0d0ff]' : 'border-[#f2d6a3] bg-[#fff8e6] text-[#785116] dark:bg-[#4a3825] dark:text-[#ffe3a8]'}`}>{saved && <CircleCheck size={17} className="mr-2 inline-block" />}{notice}</div>}
        {saved && <button type="button" onClick={() => navigate('/author/page/ads/boost-content')} className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#6940d1]">{tr('finish')}<ChevronRight size={17} /></button>}
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#edeaf3] bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-5px_24px_rgba(49,29,91,.05)] backdrop-blur dark:border-white/10 dark:bg-[#241d2f]/95">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5">
          {step > 0 && !saved && <button type="button" onClick={() => { setStep(n => n - 1); setNotice('') }} aria-label={tr('back')} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e7e3ef] dark:border-white/15"><ChevronLeft size={22} /></button>}
          <button type="button" disabled={saving || !chosen || saved} onClick={saveDraft} className="h-12 flex-1 rounded-xl border border-[#dfdbe8] bg-white px-2 text-xs font-semibold text-[#211829] disabled:opacity-45 dark:border-white/15 dark:bg-[#352b40] dark:text-white sm:text-sm">{saving ? tr('saving') : tr('draft')}</button>
          <button type="button" disabled={saving || saved} onClick={next} className="flex h-12 flex-[1.6] items-center justify-center gap-1.5 rounded-xl bg-[#ffd43f] px-2 text-sm font-bold text-[#1e1721] disabled:opacity-50">{saving ? <Loader2 size={18} className="animate-spin" /> : null}{step === 3 ? tr('review') : tr('next')}<ArrowRight size={18} /></button>
        </div>
      </footer>
    </main>
  )
}

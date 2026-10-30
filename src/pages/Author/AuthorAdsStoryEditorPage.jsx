import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight,
  CircleCheck, Gem, Info, Loader2, Search, Users,
} from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { createAuthorAdDraft, updateAuthorAdDraft } from '../../services/authorAdsApi'

registerTranslationNamespace('boostStoryEditor', {
  en: {
    title: 'Boost Story', content: 'Content', goal: 'Goal', audience: 'Audience', budget: 'Budget',
    selectStory: 'Select your story', search: 'Search your published stories...',
    loading: 'Loading stories...', empty: 'No published stories found.', more: 'Load more stories', retry: 'Try again',
    readers: 'More readers', followers: 'More followers', unlocks: 'More episode unlocks',
    goalTitle: 'Campaign goal', goalInfo: 'Choose the main result you want from this campaign.',
    audienceTitle: 'Target audience', audienceInfo: 'Choose who should see your story ad.',
    all: 'Broad audience', allHint: 'Let Shadow find interested readers automatically.',
    genre: 'Genre audience', genreHint: 'Target a story genre and optionally a country or language.',
    fans: 'Follower audience', fansHint: 'Reach only your existing followers.', soon: 'Coming Soon',
    genrePick: 'Genre', country: 'Country', language: 'Reading language', any: 'Any',
    cambodia: 'Cambodia', thailand: 'Thailand', vietnam: 'Vietnam',
    romance: 'Romance', fantasy: 'Fantasy', action: 'Action', adventure: 'Adventure', horror: 'Horror', mystery: 'Mystery', drama: 'Drama', comedy: 'Comedy', historical: 'Historical', science: 'Sci-Fi', lgbtq: 'LGBTQ+',
    targetingNote: 'Advanced age, gender, and province targeting is not connected yet.',
    budgetTitle: 'Budget and duration', diamonds: 'Diamonds', duration: 'Duration', day: '{{count}} days',
    budgetNote: '100 Diamonds = $1. Reach is an estimate, not a guarantee. Saving does not charge Diamonds.',
    reach: 'Estimated reach: about {{count}} readers', preview: 'Ad preview', readNow: 'Read Now', sponsored: 'Sponsored',
    draft: 'Save Draft', saving: 'Saving...', next: 'Continue', back: 'Back', review: 'Review & Save',
    saved: 'Campaign draft saved. It is not live.', deviceSaved: 'Draft saved on this device. It is not live.',
    chooseFirst: 'Choose a published story first.', genreFirst: 'Select a genre first.',
    invalidBudget: 'Enter a whole-Diamond budget between 100 and 1,000,000.',
    saveFailed: 'Could not save the draft. Please try again.', loadFailed: 'Unable to load stories.',
    paidNote: 'Episode unlock goals require a story with paid episodes.',
    submitNote: 'This is a draft. Review, approval and a separate Start action are required before any Diamonds are reserved.',
    finish: 'Back to My Campaigns',
  },
  km: {
    title: 'Boost Story', content: 'Content', goal: 'Goal', audience: 'Audience', budget: 'Budget',
    selectStory: 'ជ្រើសរើសរឿង', search: 'ស្វែងរករឿងដែលបាន Publish...',
    loading: 'កំពុងផ្ទុករឿង...', empty: 'មិនមានរឿងដែលបាន Publish ទេ។', more: 'មើលរឿងបន្ថែម', retry: 'សាកម្តងទៀត',
    readers: 'បង្កើនអ្នកអាន', followers: 'បង្កើន Follower', unlocks: 'បង្កើនការដោះសោ EP',
    goalTitle: 'គោលដៅ Campaign', goalInfo: 'ជ្រើសលទ្ធផលសំខាន់ដែលអ្នកចង់បាន។',
    audienceTitle: 'ក្រុមអ្នកអានគោលដៅ', audienceInfo: 'កំណត់អ្នកដែលអ្នកចង់ឱ្យឃើញពាណិជ្ជកម្ម។',
    all: 'អ្នកអានទូទៅ', allHint: 'ឱ្យ Shadow ស្វែងរកអ្នកអានដែលចាប់អារម្មណ៍ដោយស្វ័យប្រវត្តិ។',
    genre: 'អ្នកអានតាម Genre', genreHint: 'ជ្រើស Genre និងអាចកំណត់ប្រទេស ឬភាសាអាន។',
    fans: 'អ្នកតាមដាន (Followers)', fansHint: 'ផ្សាយទៅតែ Follower របស់អ្នក។', soon: 'Coming Soon',
    genrePick: 'Genre', country: 'ប្រទេស', language: 'ភាសាអាន', any: 'ទាំងអស់',
    cambodia: 'កម្ពុជា', thailand: 'ថៃ', vietnam: 'វៀតណាម',
    romance: 'Romance', fantasy: 'Fantasy', action: 'Action', adventure: 'Adventure', horror: 'Horror', mystery: 'Mystery', drama: 'Drama', comedy: 'Comedy', historical: 'Historical', science: 'Sci-Fi', lgbtq: 'LGBTQ+',
    targetingNote: 'ការកំណត់អាយុ ភេទ និងខេត្ត មិនទាន់ភ្ជាប់ Backend ទេ។',
    budgetTitle: 'ថវិកា និងរយៈពេល', diamonds: 'ពេជ្រ (Diamonds)', duration: 'រយៈពេល', day: '{{count}} ថ្ងៃ',
    budgetNote: '100 ពេជ្រ = $1។ Reach គ្រាន់តែប៉ាន់ស្មាន។ Save Draft មិនដកពេជ្រទេ។',
    reach: 'Reach ប៉ាន់ស្មាន៖ ប្រហែល {{count}} នាក់', preview: 'មើល Ad ជាមុន', readNow: 'អានឥឡូវ', sponsored: 'Sponsored',
    draft: 'Save Draft', saving: 'កំពុងរក្សាទុក...', next: 'Continue', back: 'ត្រឡប់ក្រោយ', review: 'Review & Save',
    saved: 'បានរក្សាទុក Draft ហើយ។ មិនទាន់ផ្សាយទេ។', deviceSaved: 'បានរក្សាទុក Draft ក្នុងឧបករណ៍។ មិនទាន់ផ្សាយទេ។',
    chooseFirst: 'សូមជ្រើសរឿងដែលបាន Publish ជាមុន។', genreFirst: 'សូមជ្រើស Genre ជាមុន។',
    invalidBudget: 'សូមបញ្ចូលពេជ្រចាប់ពី 100 ដល់ 1,000,000 ជាចំនួនគត់។',
    saveFailed: 'មិនអាចរក្សាទុក Draft បាន។ សូមសាកម្តងទៀត។', loadFailed: 'មិនអាចផ្ទុករឿងបាន។',
    paidNote: 'More EP Unlocks ត្រូវការរឿងដែលមាន EP គិតលុយ។',
    submitNote: 'នេះជា Draft។ ត្រូវមានការត្រួតពិនិត្យ អនុម័ត និងចុច Start ដាច់ដោយឡែក មុនកក់ពេជ្រ។',
    finish: 'ទៅ My Campaigns',
  },
  zh: {
    title: '推广故事', content: '内容', goal: '目标', audience: '受众', budget: '预算', selectStory: '选择故事', search: '搜索已发布的故事...',
    loading: '正在加载...', empty: '没有已发布的故事', more: '加载更多', retry: '重试', readers: '更多读者', followers: '更多关注者', unlocks: '更多章节解锁',
    goalTitle: '推广目标', goalInfo: '选择最重要的结果', audienceTitle: '目标受众', audienceInfo: '选择谁能看到广告',
    all: '广泛受众', allHint: '让 Shadow 自动寻找感兴趣的读者', genre: '按题材定位', genreHint: '选择题材、国家或语言',
    fans: '现有粉丝', fansHint: '仅针对现有关注者', soon: '即将推出', genrePick: '题材', country: '国家', language: '阅读语言', any: '全部',
    cambodia: '柬埔寨', thailand: '泰国', vietnam: '越南', romance: '爱情', fantasy: '奇幻', action: '动作', adventure: '冒险', horror: '恐怖', mystery: '悬疑', drama: '剧情', comedy: '喜剧', historical: '历史', science: '科幻', lgbtq: 'LGBTQ+',
    targetingNote: '年龄、性别和省份定位尚未接入', budgetTitle: '预算与时长', diamonds: '钻石', duration: '时长', day: '{{count}}天',
    budgetNote: '100 钻石 = $1；预计覆盖不保证。保存草稿不会扣费。', reach: '预计覆盖约 {{count}} 位读者', preview: '广告预览', readNow: '立即阅读', sponsored: '广告',
    draft: '保存草稿', saving: '保存中...', next: '继续', back: '返回', review: '审核并保存', saved: '草稿已保存，尚未投放', deviceSaved: '草稿已保存在此设备',
    chooseFirst: '请先选择故事', genreFirst: '请选择题材', invalidBudget: '请输入100至1,000,000的整数钻石预算', saveFailed: '无法保存草稿', loadFailed: '无法加载故事',
    paidNote: '章节解锁目标需要付费章节', submitNote: '需先审核、批准并单独启动才会预留钻石', finish: '查看我的广告活动',
  },
  ja: {
    title: 'ストーリーを宣伝', content: '作品', goal: '目標', audience: '対象', budget: '予算', selectStory: '作品を選択', search: '公開済み作品を検索...',
    loading: '読み込み中...', empty: '公開済み作品なし', more: 'さらに表示', retry: '再試行', readers: '読者を増やす', followers: 'フォロワーを増やす', unlocks: 'エピソード解放を増やす',
    goalTitle: 'キャンペーン目標', goalInfo: '最も重要な成果を選択', audienceTitle: 'ターゲット読者', audienceInfo: '広告を届けたい読者を選択',
    all: '幅広い読者', allHint: 'Shadowが関心のある読者を自動で探します', genre: 'ジャンル別', genreHint: 'ジャンル、国、言語を選択',
    fans: '既存フォロワー', fansHint: 'フォロワーのみに配信', soon: '近日公開', genrePick: 'ジャンル', country: '国', language: '読む言語', any: 'すべて',
    cambodia: 'カンボジア', thailand: 'タイ', vietnam: 'ベトナム', romance: '恋愛', fantasy: 'ファンタジー', action: 'アクション', adventure: '冒険', horror: 'ホラー', mystery: 'ミステリー', drama: 'ドラマ', comedy: 'コメディ', historical: '歴史', science: 'SF', lgbtq: 'LGBTQ+',
    targetingNote: '年齢・性別・州の指定は未対応です', budgetTitle: '予算と期間', diamonds: 'ダイヤ', duration: '期間', day: '{{count}}日',
    budgetNote: '100 ダイヤ = $1。推定リーチは保証されず、保存時には課金されません。', reach: '推定リーチ: 約{{count}}人', preview: '広告プレビュー', readNow: '今すぐ読む', sponsored: '広告',
    draft: '下書き保存', saving: '保存中...', next: '次へ', back: '戻る', review: '確認して保存', saved: '下書きを保存しました。配信前です。', deviceSaved: '端末に下書き保存済みです。',
    chooseFirst: '作品を選択してください', genreFirst: 'ジャンルを選択してください', invalidBudget: '100〜1,000,000の整数を入力', saveFailed: '保存できませんでした', loadFailed: '作品を読み込めません',
    paidNote: '解放目標には有料エピソードが必要です', submitNote: '審査・承認・開始操作後にのみ予算を確保します', finish: 'キャンペーンを見る',
  },
  ko: {
    title: '스토리 홍보', content: '콘텐츠', goal: '목표', audience: '대상', budget: '예산', selectStory: '스토리 선택', search: '게시된 스토리 검색...',
    loading: '불러오는 중...', empty: '게시된 스토리가 없습니다', more: '더 보기', retry: '다시 시도', readers: '독자 늘리기', followers: '팔로워 늘리기', unlocks: '에피소드 잠금 해제 늘리기',
    goalTitle: '캠페인 목표', goalInfo: '가장 중요한 결과 선택', audienceTitle: '대상 독자', audienceInfo: '광고를 볼 독자를 선택',
    all: '넓은 대상', allHint: 'Shadow가 관심 독자를 자동으로 찾습니다', genre: '장르별 독자', genreHint: '장르, 국가 또는 언어 선택',
    fans: '팔로워 대상', fansHint: '기존 팔로워에게만 홍보', soon: '출시 예정', genrePick: '장르', country: '국가', language: '독서 언어', any: '전체',
    cambodia: '캄보디아', thailand: '태국', vietnam: '베트남', romance: '로맨스', fantasy: '판타지', action: '액션', adventure: '모험', horror: '공포', mystery: '미스터리', drama: '드라마', comedy: '코미디', historical: '시대물', science: 'SF', lgbtq: 'LGBTQ+',
    targetingNote: '나이, 성별, 지역 타겟팅은 아직 지원되지 않습니다', budgetTitle: '예산 및 기간', diamonds: '다이아', duration: '기간', day: '{{count}}일',
    budgetNote: '100 다이아 = $1. 예상 노출은 보장되지 않으며 저장 시 차감되지 않습니다.', reach: '예상 노출 약 {{count}}명', preview: '광고 미리보기', readNow: '지금 읽기', sponsored: '광고',
    draft: '초안 저장', saving: '저장 중...', next: '계속', back: '뒤로', review: '확인 후 저장', saved: '초안이 저장되었습니다. 게재 전입니다.', deviceSaved: '기기에 초안 저장됨',
    chooseFirst: '스토리를 먼저 선택하세요', genreFirst: '장르를 선택하세요', invalidBudget: '100~1,000,000 사이 정수 다이아 입력', saveFailed: '저장하지 못했습니다', loadFailed: '스토리 로드 실패',
    paidNote: '에피소드 잠금 해제 목표에는 유료 에피소드가 필요합니다', submitNote: '심사 승인 후 별도 시작 시 예산이 예약됩니다', finish: '캠페인 보기',
  },
})

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com').replace(/\/$/, '')
const GENRES = [['Romance', 'romance'], ['Fantasy', 'fantasy'], ['Action', 'action'], ['Adventure', 'adventure'], ['Horror', 'horror'], ['Mystery', 'mystery'], ['Drama', 'drama'], ['Comedy', 'comedy'], ['Historical', 'historical'], ['Sci-Fi', 'science'], ['LGBTQ+', 'lgbtq']]
const STEPS = ['content', 'goal', 'audience', 'budget']
const CARD = 'rounded-3xl border border-[#edeaf5] bg-white p-4 shadow-[0_5px_25px_rgba(57,37,100,.04)] dark:border-white/10 dark:bg-[#241e30] sm:p-5'

function token() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function apiGet(path, signal) {
  const auth = token()
  if (!auth) throw new Error('AUTH_REQUIRED')
  const res = await fetch(`${API_ORIGIN}${path}`, {
    headers: { Authorization: `Bearer ${auth}` }, signal, cache: 'no-store',
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json || json.ok === false) throw new Error('REQUEST_FAILED')
  return json
}

function imageUrl(value) {
  const url = String(value || '').trim()
  return /^https:\/\//i.test(url) || /^\/(?!\/)/.test(url) ? url : ''
}

function Choice({ selected, title, hint, onClick, disabled, badge }) {
  return <button type="button" onClick={onClick} disabled={disabled} aria-pressed={selected} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${selected ? 'border-[#7045e8] bg-[#f7f3ff] dark:bg-[#41305b]' : 'border-[#e9e7f1] bg-white dark:border-white/10 dark:bg-[#2a2437]'} disabled:cursor-not-allowed disabled:opacity-55`}>
    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#7045e8] bg-[#7045e8] text-white' : 'border-[#c9c5d5]'}`}>{selected && <Check size={13} />}</span>
    <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-sm font-semibold">{title}{badge && <span className="rounded-full bg-[#fff0c1] px-2 py-0.5 text-[10px] text-[#76540c]">{badge}</span>}</span>{hint && <span className="mt-1 block text-xs leading-5 text-[#817d90] dark:text-[#c4bcd1]">{hint}</span>}</span>
  </button>
}

export default function AuthorAdsStoryEditorPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = (key, options) => t(`boostStoryEditor.${key}`, options)
  const [step, setStep] = useState(0)
  const [stories, setStories] = useState([])
  const [username, setUsername] = useState('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState('')
  const [loadError, setLoadError] = useState(false)
  const [goal, setGoal] = useState('readers')
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

  const getFirstPage = useCallback(async signal => {
    setLoading(true)
    setLoadError(false)
    try {
      const account = await apiGet('/api/authors/me?include_works=0', signal)
      const name = String(account.author_page?.page_username || '').trim()
      if (!name) throw new Error('AUTHOR_REQUIRED')
      setUsername(name)
      const result = await apiGet(`/api/authors/page/${encodeURIComponent(name)}/works?limit=10`, signal)
      setStories((result.works || []).filter(x => x.status === 'published'))
      setNextCursor(result.has_more ? String(result.next_before_id || '') : '')
    } catch (err) {
      if (signal?.aborted) return
      if (err.message === 'AUTH_REQUIRED') navigate('/login')
      else setLoadError(true)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    const controller = new AbortController()
    getFirstPage(controller.signal)
    return () => controller.abort()
  }, [getFirstPage])

  const loadMore = async () => {
    if (loadingMore || !nextCursor || !username) return
    setLoadingMore(true)
    try {
      const result = await apiGet(`/api/authors/page/${encodeURIComponent(username)}/works?limit=10&before_id=${encodeURIComponent(nextCursor)}`)
      setStories(old => {
        const map = new Map(old.map(x => [String(x.id), x]))
        ;(result.works || []).filter(x => x.status === 'published').forEach(x => map.set(String(x.id), x))
        return [...map.values()]
      })
      setNextCursor(result.has_more ? String(result.next_before_id || '') : '')
    } catch { setLoadError(true) } finally { setLoadingMore(false) }
  }

  const chosen = stories.find(item => String(item.id) === selectedId)
  const visible = useMemo(() => stories.filter(item => String(item.title || '').toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())), [stories, search])
  const budgetNumber = Number(diamonds)
  const validBudget = Number.isSafeInteger(budgetNumber) && budgetNumber >= 100 && budgetNumber <= 1000000

  const validCurrent = () => {
    if (step === 0 && !chosen) return tr('chooseFirst')
    if (step === 2 && audience === 'genre' && !genre) return tr('genreFirst')
    if (step === 3 && !validBudget) return tr('invalidBudget')
    return ''
  }

  const next = () => {
    const error = validCurrent()
    if (error) return setNotice(error)
    setNotice('')
    if (step < 3) setStep(value => value + 1)
    else saveDraft()
  }

  const saveDraft = async () => {
    if (saving || saved) return
    if (!username || !chosen) return setNotice(tr('chooseFirst'))
    if (audience === 'genre' && !genre) return setNotice(tr('genreFirst'))
    if (!validBudget) return setNotice(tr('invalidBudget'))
    const now = new Date().toISOString()
    const data = {
      kind: 'book', contentType: 'story', contentId: String(chosen.id),
      goal, audience: { mode: audience === 'genre' ? 'manual' : 'automatic',
        genre: audience === 'genre' ? genre : '', country: audience === 'genre' ? country : '',
        language: audience === 'genre' ? language : '' },
      budgetUsd: budgetNumber / 100, durationDays: duration,
    }
    setSaving(true)
    setNotice('')
    try {
      if (deviceId) {
        const key = `shadow_author_ads_drafts_v1_${username}`
        const old = JSON.parse(localStorage.getItem(key) || '[]')
        const drafts = Array.isArray(old) ? old : []
        const previous = drafts.find(x => x.id === deviceId)
        const record = { ...data, id: deviceId, kind: 'book', status: 'draft',
          contentKey: `story:${chosen.id}`, contentTitle: chosen.title, contentImage: chosen.cover_url || '',
          updatedAt: now, createdAt: previous?.createdAt || now }
        localStorage.setItem(key, JSON.stringify([record, ...drafts.filter(x => x.id !== deviceId)]))
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
          const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
          const key = `shadow_author_ads_drafts_v1_${username}`
          const raw = JSON.parse(localStorage.getItem(key) || '[]')
          const records = Array.isArray(raw) ? raw : []
          const record = { ...data, id, status: 'draft', contentKey: `story:${chosen.id}`,
            contentTitle: chosen.title, contentImage: chosen.cover_url || '', updatedAt: now, createdAt: now }
          localStorage.setItem(key, JSON.stringify([record, ...records]))
          setDeviceId(id)
          setNotice(tr('deviceSaved'))
          setSaved(true)
        } catch { setNotice(tr('saveFailed')) }
      } else setNotice(tr('saveFailed'))
    } finally { setSaving(false) }
  }

  const change = setter => value => { setter(value); setSaved(false); setNotice('') }
  const countryOptions = [['', 'any'], ['KH', 'cambodia'], ['TH', 'thailand'], ['VN', 'vietnam']]

  return (
    <main className="min-h-[100dvh] bg-[#faf9ff] pb-[138px] text-[#1c1728] dark:bg-[#14111d] dark:text-white">
      <div className="mx-auto max-w-2xl px-4 pt-4 sm:px-6">
        <header className="mb-6 flex items-center gap-4">
          <button type="button" className="p-2 -ml-2" aria-label={tr('back')} onClick={() => navigate('/author/page/ads/boost-content')}><ArrowLeft size={24} /></button>
          <h1 className="text-[22px] font-bold">{tr('title')}</h1>
        </header>

        <div className="mb-6 flex items-start justify-between gap-1" aria-label="Campaign steps">
          {STEPS.map((key, index) => <button type="button" key={key} onClick={() => { if (index < step) { setStep(index); setNotice('') } }} disabled={index > step || saved} aria-current={step === index ? 'step' : undefined} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 disabled:cursor-default">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${index === step ? 'bg-[#6335d7] text-white' : index < step ? 'bg-[#e8dfff] text-[#6335d7]' : 'bg-[#eae9f1] text-[#747080] dark:bg-[#353041] dark:text-[#cbc3d5]'}`}>{index < step ? <Check size={17} /> : index + 1}</span>
            <span className={`text-[11px] sm:text-xs ${index === step ? 'font-semibold text-[#6335d7] dark:text-[#b59aff]' : 'text-[#868095] dark:text-[#beb6ca]'}`}>{tr(key)}</span>
          </button>)}
        </div>

        {step === 0 && <section className={CARD}>
          <h2 className="mb-4 text-base font-bold">{tr('selectStory')}</h2>
          <div className="relative mb-3"><Search size={18} className="absolute left-3 top-3.5 text-[#9592a3]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={tr('search')} className="w-full rounded-xl border border-[#e8e5ee] bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8b62ea] dark:border-white/10 dark:bg-[#342b42]" /></div>
          {loading && <div className="flex justify-center py-9 text-sm text-[#888297]"><Loader2 className="mr-2 animate-spin" size={18} />{tr('loading')}</div>}
          {!loading && !visible.length && !loadError && <p className="py-8 text-center text-sm text-[#898497]">{tr('empty')}</p>}
          {!loading && <div className="space-y-2">{visible.map(item => {
            const active = selectedId === String(item.id)
            const subtype = item.story_type === 'manga' ? 'Manga' : item.story_type === 'chat_story' ? 'Chat Story' : 'Novel'
            return <button key={item.id} type="button" aria-pressed={active} onClick={() => { setSelectedId(String(item.id)); setNotice(''); setSaved(false) }} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${active ? 'border-[#7348e4] bg-[#f8f4ff] dark:bg-[#3b2c55]' : 'border-[#ebe8f2] bg-white dark:border-white/10 dark:bg-[#2c2438]'}`}>
              <span className="flex h-[68px] w-[55px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eee9f6]">{imageUrl(item.cover_url) ? <img src={imageUrl(item.cover_url)} alt="" className="h-full w-full object-cover" loading="lazy" /> : <BookOpen size={25} />}</span>
              <span className="min-w-0 flex-1"><span className="line-clamp-2 text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs text-[#858095] dark:text-[#c8bfce]">{subtype} · {String(item.main_genre || item.genre || '')}</span></span>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#6940dc] bg-[#6940dc] text-white' : 'border-[#d2ccdd]'}`}>{active && <Check size={12} />}</span>
            </button>
          })}</div>}
          {loadError && <button type="button" onClick={() => { const c = new AbortController(); getFirstPage(c.signal) }} className="mt-3 rounded-lg border border-[#e6dff1] px-4 py-2 text-sm text-[#6940dc]">{tr('retry')}</button>}
          {nextCursor && <button type="button" disabled={loadingMore} onClick={loadMore} className="mt-4 flex w-full justify-center rounded-xl bg-[#f2edfa] py-3 text-sm font-semibold text-[#6335d7] disabled:opacity-50 dark:bg-[#372948] dark:text-[#d1bcff]">{loadingMore ? tr('loading') : tr('more')}</button>}
        </section>}

        {step === 1 && <section className={CARD}>
          <h2 className="font-bold">{tr('goalTitle')}</h2><p className="mb-4 mt-1 text-xs text-[#898497]">{tr('goalInfo')}</p>
          <div className="space-y-2">{[['readers', 'readers'], ['followers', 'followers'], ['unlocks', 'unlocks']].map(([key, label]) => <Choice key={key} selected={goal === key} title={tr(label)} onClick={() => change(setGoal)(key)} />)}</div>
          {goal === 'unlocks' && <p className="mt-4 flex gap-2 text-xs text-[#867894]"><Info size={15} className="shrink-0" />{tr('paidNote')}</p>}
        </section>}

        {step === 2 && <section className={CARD}>
          <h2 className="font-bold">{tr('audienceTitle')}</h2><p className="mb-4 mt-1 text-xs text-[#898497]">{tr('audienceInfo')}</p>
          <div className="space-y-2">
            <Choice selected={audience === 'all'} title={tr('all')} hint={tr('allHint')} onClick={() => change(setAudience)('all')} />
            <Choice selected={audience === 'genre'} title={tr('genre')} hint={tr('genreHint')} onClick={() => change(setAudience)('genre')} />
            <Choice selected={false} title={tr('fans')} hint={tr('fansHint')} badge={tr('soon')} disabled />
          </div>
          {audience === 'genre' && <div className="mt-4 space-y-3 rounded-xl bg-[#f8f6fc] p-3 dark:bg-[#30283c]">
            <label className="block text-xs font-semibold">{tr('genrePick')}
              <select value={genre} onChange={e => change(setGenre)(e.target.value)} className="mt-2 w-full rounded-lg border border-[#e8e2f0] bg-white p-3 text-sm text-[#21192e] dark:border-white/10 dark:bg-[#3c304a] dark:text-white"><option value="">{tr('any')}</option>{GENRES.map(([value, label]) => <option key={value} value={value}>{tr(label)}</option>)}</select>
            </label>
            <label className="block text-xs font-semibold">{tr('country')}
              <select value={country} onChange={e => change(setCountry)(e.target.value)} className="mt-2 w-full rounded-lg border border-[#e8e2f0] bg-white p-3 text-sm text-[#21192e] dark:border-white/10 dark:bg-[#3c304a] dark:text-white">{countryOptions.map(([value, label]) => <option key={value} value={value}>{tr(label)}</option>)}</select>
            </label>
            <label className="block text-xs font-semibold">{tr('language')}
              <select value={language} onChange={e => change(setLanguage)(e.target.value)} className="mt-2 w-full rounded-lg border border-[#e8e2f0] bg-white p-3 text-sm text-[#21192e] dark:border-white/10 dark:bg-[#3c304a] dark:text-white"><option value="">{tr('any')}</option><option value="km">ខ្មែរ</option><option value="en">English</option><option value="zh">中文</option><option value="ja">日本語</option><option value="ko">한국어</option></select>
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
          <section className={CARD}><h2 className="mb-4 font-bold">{tr('preview')}</h2><div className="flex items-center gap-3 rounded-xl border border-[#eae7f0] p-3 dark:border-white/10">
            <span className="flex h-[72px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f1eaf7]">{imageUrl(chosen?.cover_url) ? <img src={imageUrl(chosen.cover_url)} alt="" className="h-full w-full object-cover" /> : <BookOpen size={22} />}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{chosen?.title}</span><span className="mt-1 block text-[11px] text-[#898294]">{tr('sponsored')}</span></span>
            <span className="shrink-0 rounded-lg bg-[#f0eaff] px-3 py-2 text-xs font-semibold text-[#6335d7]">{tr('readNow')}</span>
          </div><p className="mt-4 flex gap-2 text-xs leading-5 text-[#898295]"><Info size={15} className="shrink-0" />{tr('submitNote')}</p></section>
        </div>}

        {notice && <div role="status" className={`mt-4 rounded-xl border p-3 text-sm ${saved ? 'border-[#d6c5ff] bg-[#f1eaff] text-[#6134ce] dark:bg-[#35284a] dark:text-[#e0d0ff]' : 'border-[#f2d6a3] bg-[#fff8e6] text-[#785116] dark:bg-[#4a3825] dark:text-[#ffe3a8]'}`}>{saved && <CircleCheck className="mr-2 inline-block" size={17} />}{notice}</div>}
        {saved && <button type="button" onClick={() => navigate('/author/page/ads/boost-content')} className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#6940d1]">{tr('finish')}<ChevronRight size={17}/></button>}
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

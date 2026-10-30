import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BarChart3, Check, ChevronLeft, ChevronRight,
  CircleCheck, Gem, Image as ImageIcon, Info, Loader2, Search, Users,
} from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { createAuthorAdDraft, updateAuthorAdDraft } from '../../services/authorAdsApi'

registerTranslationNamespace('boostPostEditor', {
  en: {
    title: 'Boost Post', content: 'Content', goal: 'Goal', audience: 'Audience', budget: 'Budget',
    pick: 'Select a published post', search: 'Search your posts...', loading: 'Loading posts...', more: 'Load more posts',
    empty: 'No published photo posts found.', retry: 'Try again', views: 'More post views',
    visits: 'More profile visits', followers: 'More followers', goalTitle: 'Campaign goal',
    audienceTitle: 'Target audience', all: 'Broad audience', allHint: 'Reach readers across Shadow.',
    genre: 'Genre audience', genreHint: 'Show to readers interested in a selected genre.',
    fans: 'Follower audience', fansHint: 'Show only to your followers.', soon: 'Coming Soon',
    genrePick: 'Genre', country: 'Country', language: 'Reading language', any: 'Any',
    cambodia: 'Cambodia', thailand: 'Thailand', vietnam: 'Vietnam',
    targetingNote: 'Follower-only, age, gender and province targeting are not connected yet.',
    budgetTitle: 'Budget and duration', diamonds: 'Diamonds', duration: 'Duration', day: '{{count}} days',
    budgetNote: '100 Diamonds = $1. Reach is an estimate, not a guarantee. Saving does not deduct Diamonds.',
    reach: 'Estimated reach: around {{count}} people', preview: 'Ad preview', sponsored: 'Sponsored', view: 'View Post',
    draft: 'Save Draft', saving: 'Saving...', next: 'Continue', back: 'Back', review: 'Review & Save',
    saved: 'Draft saved. This ad is not live.', deviceSaved: 'Draft saved on this device. This ad is not live.',
    selectFirst: 'Choose a published photo post first.', genreFirst: 'Choose a genre first.',
    invalidBudget: 'Enter a whole-Diamond budget from 100 to 1,000,000.',
    saveFailed: 'Could not save the draft. Please try again.', loadFailed: 'Unable to load your posts.',
    submitNote: 'The campaign is a draft. Approval and a separate Start action are required before any Diamonds are reserved.',
    finish: 'Back to Boost Content',
  },
  km: {
    title: 'Boost Post', content: 'Content', goal: 'Goal', audience: 'Audience', budget: 'Budget',
    pick: 'ជ្រើសរើស Post ដែលបានបង្ហោះ', search: 'ស្វែងរក Post...', loading: 'កំពុងផ្ទុក Post...', more: 'មើល Post បន្ថែម',
    empty: 'មិនមាន Post រូបភាពដែលបានបង្ហោះទេ។', retry: 'សាកម្តងទៀត', views: 'បង្កើន View របស់ Post',
    visits: 'បង្កើនអ្នកចូល Profile', followers: 'បង្កើន Follower', goalTitle: 'គោលដៅ Campaign',
    audienceTitle: 'ក្រុមអ្នកអានគោលដៅ', all: 'អ្នកអានទូទៅ', allHint: 'ផ្សាយទៅអ្នកអានទូទៅក្នុង Shadow។',
    genre: 'អ្នកអានតាម Genre', genreHint: 'ផ្សាយទៅអ្នកអានដែលចូលចិត្ត Genre ជាក់លាក់។',
    fans: 'Follower Audience', fansHint: 'ផ្សាយទៅតែ Follower របស់អ្នក។', soon: 'Coming Soon',
    genrePick: 'Genre', country: 'ប្រទេស', language: 'ភាសាអាន', any: 'ទាំងអស់',
    cambodia: 'កម្ពុជា', thailand: 'ថៃ', vietnam: 'វៀតណាម',
    targetingNote: 'Follower-only និងការជ្រើសអាយុ ភេទ ខេត្ត មិនទាន់ភ្ជាប់ Backend ទេ។',
    budgetTitle: 'ថវិកា និងរយៈពេល', diamonds: 'ពេជ្រ (Diamonds)', duration: 'រយៈពេល', day: '{{count}} ថ្ងៃ',
    budgetNote: '100 ពេជ្រ = $1។ Reach គ្រាន់តែជាការប៉ាន់ស្មាន។ Save Draft មិនដកពេជ្រទេ។',
    reach: 'Reach ប៉ាន់ស្មាន៖ ប្រហែល {{count}} នាក់', preview: 'មើល Ad ជាមុន', sponsored: 'Sponsored', view: 'មើល Post',
    draft: 'Save Draft', saving: 'កំពុងរក្សាទុក...', next: 'Continue', back: 'ត្រឡប់ក្រោយ', review: 'Review & Save',
    saved: 'រក្សាទុក Draft រួចហើយ។ មិនទាន់ផ្សាយទេ។', deviceSaved: 'Draft បានរក្សាទុកក្នុងឧបករណ៍។ មិនទាន់ផ្សាយទេ។',
    selectFirst: 'សូមជ្រើស Post រូបភាពដែលបានបង្ហោះជាមុន។', genreFirst: 'សូមជ្រើស Genre ជាមុន។',
    invalidBudget: 'សូមបញ្ចូលពេជ្រចំនួនគត់ពី 100 ដល់ 1,000,000។',
    saveFailed: 'មិនអាចរក្សាទុក Draft បានទេ។ សូមសាកម្តងទៀត។', loadFailed: 'មិនអាចផ្ទុក Post បានទេ។',
    submitNote: 'នេះជា Draft។ ត្រូវមានការត្រួតពិនិត្យ អនុម័ត និងចុច Start ដាច់ដោយឡែក មុនកក់ពេជ្រ។',
    finish: 'ត្រឡប់ទៅ Boost Content',
  },
  zh: {
    title: '推广帖子', content: '内容', goal: '目标', audience: '受众', budget: '预算',
    pick: '选择已发布的帖子', search: '搜索帖子...', loading: '正在加载...', more: '加载更多', empty: '暂无可推广的图片帖子', retry: '重试',
    views: '增加帖子浏览', visits: '增加主页访问', followers: '增加粉丝', goalTitle: '广告目标', audienceTitle: '目标受众',
    all: '广泛受众', allHint: '覆盖 Shadow 读者', genre: '按题材定位', genreHint: '投放给喜欢指定题材的读者',
    fans: '现有粉丝', fansHint: '仅面向现有关注者', soon: '即将推出', genrePick: '题材', country: '国家', language: '阅读语言', any: '全部',
    cambodia: '柬埔寨', thailand: '泰国', vietnam: '越南', targetingNote: '仅粉丝、年龄、性别和省份定位暂未接入',
    budgetTitle: '预算与时长', diamonds: '钻石', duration: '时长', day: '{{count}}天',
    budgetNote: '100钻石=$1。预计覆盖人数不保证；保存草稿不扣费。', reach: '预计覆盖约{{count}}人',
    preview: '广告预览', sponsored: '赞助内容', view: '查看帖子', draft: '保存草稿', saving: '保存中...', next: '继续', back: '返回', review: '确认并保存',
    saved: '草稿已保存，尚未投放', deviceSaved: '草稿已保存到设备', selectFirst: '请先选择图片帖子', genreFirst: '请选择题材',
    invalidBudget: '请输入100至1,000,000的整数钻石预算', saveFailed: '保存失败，请重试', loadFailed: '无法加载帖子',
    submitNote: '草稿需审核通过并单独启动后才会预留钻石', finish: '返回内容推广',
  },
  ja: {
    title: '投稿を宣伝', content: '内容', goal: '目標', audience: '対象', budget: '予算',
    pick: '公開済みの投稿を選択', search: '投稿を検索...', loading: '読み込み中...', more: 'さらに表示', empty: '公開済みの画像投稿がありません', retry: '再試行',
    views: '投稿の閲覧を増やす', visits: 'プロフィール訪問を増やす', followers: 'フォロワーを増やす', goalTitle: '目標', audienceTitle: '対象読者',
    all: '幅広い読者', allHint: 'Shadow 内の読者に届ける', genre: 'ジャンル別読者', genreHint: '好きなジャンルで絞り込む',
    fans: '既存フォロワー', fansHint: 'フォロワーのみに配信', soon: '近日公開', genrePick: 'ジャンル', country: '国', language: '読む言語', any: 'すべて',
    cambodia: 'カンボジア', thailand: 'タイ', vietnam: 'ベトナム', targetingNote: 'フォロワー限定、年齢、性別、地域指定は未対応',
    budgetTitle: '予算と期間', diamonds: 'ダイヤ', duration: '期間', day: '{{count}}日',
    budgetNote: '100ダイヤ=$1。推定リーチは保証されず、保存時は課金されません。', reach: '推定リーチ：約{{count}}人',
    preview: '広告プレビュー', sponsored: '広告', view: '投稿を見る', draft: '下書き保存', saving: '保存中...', next: '次へ', back: '戻る', review: '確認して保存',
    saved: '下書きを保存しました。配信前です。', deviceSaved: '端末に下書きを保存しました', selectFirst: '画像投稿を選択してください', genreFirst: 'ジャンルを選択してください',
    invalidBudget: '100〜1,000,000の整数を入力', saveFailed: '保存できませんでした', loadFailed: '投稿を読み込めません',
    submitNote: '審査・承認後、別途開始時にのみダイヤを確保します', finish: 'コンテンツ選択へ戻る',
  },
  ko: {
    title: '게시물 홍보', content: '콘텐츠', goal: '목표', audience: '대상', budget: '예산',
    pick: '게시된 게시물 선택', search: '게시물 검색...', loading: '불러오는 중...', more: '더 보기', empty: '게시된 사진 게시물이 없습니다', retry: '다시 시도',
    views: '게시물 조회 늘리기', visits: '프로필 방문 늘리기', followers: '팔로워 늘리기', goalTitle: '캠페인 목표', audienceTitle: '대상 독자',
    all: '넓은 대상', allHint: 'Shadow 독자에게 홍보', genre: '장르별 대상', genreHint: '장르에 관심 있는 독자에게 홍보',
    fans: '기존 팔로워', fansHint: '팔로워에게만 홍보', soon: '출시 예정', genrePick: '장르', country: '국가', language: '독서 언어', any: '전체',
    cambodia: '캄보디아', thailand: '태국', vietnam: '베트남', targetingNote: '팔로워 전용, 나이, 성별, 지역 타겟팅은 아직 지원되지 않습니다',
    budgetTitle: '예산 및 기간', diamonds: '다이아', duration: '기간', day: '{{count}}일',
    budgetNote: '100다이아=$1. 예상 도달은 보장되지 않으며 저장 시 차감되지 않습니다.', reach: '예상 도달 약{{count}}명',
    preview: '광고 미리보기', sponsored: '광고', view: '게시물 보기', draft: '초안 저장', saving: '저장 중...', next: '계속', back: '뒤로', review: '검토 후 저장',
    saved: '초안이 저장되었으며 아직 게재되지 않습니다', deviceSaved: '기기에 초안을 저장했습니다', selectFirst: '사진 게시물을 선택하세요', genreFirst: '장르를 선택하세요',
    invalidBudget: '100~1,000,000 정수 다이아 입력', saveFailed: '초안을 저장할 수 없습니다', loadFailed: '게시물을 불러오지 못했습니다',
    submitNote: '심사 승인 후 별도 시작 시에만 다이아가 예약됩니다', finish: '콘텐츠 선택으로 돌아가기',
  },
})

const API_ORIGIN = (import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)).replace(/\/$/, '')
const STEPS = ['content', 'goal', 'audience', 'budget']
const GENRES = ['Romance', 'Fantasy', 'Action', 'Adventure', 'Horror', 'Mystery', 'Drama', 'Comedy', 'Historical', 'Sci-Fi', 'LGBTQ+']
const CARD = 'rounded-3xl border border-[#edeaf5] bg-white p-4 shadow-[0_5px_25px_rgba(57,37,100,.04)] dark:border-white/10 dark:bg-[#241e30] sm:p-5'
const SELECT = 'mt-2 w-full rounded-xl border border-[#e8e2f0] bg-white p-3 text-sm text-[#21192e] outline-none focus:border-[#7045e8] dark:border-white/10 dark:bg-[#3c304a] dark:text-white'

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function getJson(path, signal) {
  const token = getToken()
  if (!token) throw new Error('AUTH_REQUIRED')
  const response = await fetch(`${API_ORIGIN}${path}`, {
    headers: { Authorization: `Bearer ${token}` }, signal, cache: 'no-store',
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data || data.ok === false) throw new Error('REQUEST_FAILED')
  return data
}

function safeImage(src) {
  const url = String(src || '').trim()
  return /^https:\/\//i.test(url) || /^\/(?!\/)/.test(url) ? url : ''
}

function Choice({ selected, onClick, title, hint, disabled = false, badge }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={selected}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${selected ? 'border-[#7045e8] bg-[#f7f3ff] dark:bg-[#41305b]' : 'border-[#e9e7f1] bg-white dark:border-white/10 dark:bg-[#2a2437]'}`}>
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#7045e8] bg-[#7045e8] text-white' : 'border-[#c9c5d5]'}`}>{selected && <Check size={13} />}</span>
      <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-sm font-semibold">{title}{badge && <span className="rounded-full bg-[#fff0c1] px-2 py-0.5 text-[10px] text-[#76540c]">{badge}</span>}</span>{hint && <span className="mt-1 block text-xs leading-5 text-[#817d90] dark:text-[#c4bcd1]">{hint}</span>}</span>
    </button>
  )
}

function PostCard({ item, selected, onClick }) {
  const image = Array.isArray(item.image_urls) ? item.image_urls.find(x => typeof x === 'string' && safeImage(x)) : ''
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${selected ? 'border-[#7348e4] bg-[#f8f4ff] dark:bg-[#3b2c55]' : 'border-[#ebe8f2] bg-white dark:border-white/10 dark:bg-[#2c2438]'}`}>
      <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f0ebf8]">
        {image ? <img src={safeImage(image)} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ImageIcon size={25} />}
      </span>
      <span className="min-w-0 flex-1"><span className="line-clamp-3 text-sm font-medium">{String(item.content || '').trim() || 'Photo post'}</span></span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#6940dc] bg-[#6940dc] text-white' : 'border-[#d2ccdd]'}`}>{selected && <Check size={12} />}</span>
    </button>
  )
}

export default function AuthorAdsPostEditorPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = (key, options) => t(`boostPostEditor.${key}`, options)
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState('')
  const [posts, setPosts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState('')
  const [goal, setGoal] = useState('views')
  const [audience, setAudience] = useState('all')
  const [genre, setGenre] = useState('')
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [diamonds, setDiamonds] = useState('100')
  const [duration, setDuration] = useState(3)
  const [saving, setSaving] = useState(false)
  const [cloudId, setCloudId] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [saved, setSaved] = useState(false)
  const [notice, setNotice] = useState('')

  const loadFirst = useCallback(async signal => {
    setLoading(true)
    setLoadError(false)
    try {
      const account = await getJson('/api/authors/me?include_works=0', signal)
      const name = String(account.author_page?.page_username || '').trim()
      if (!name) throw new Error('AUTHOR_REQUIRED')
      setUsername(name)
      const response = await getJson(`/api/authors/page/${encodeURIComponent(name)}/posts?limit=20&content_library=1&status=active`, signal)
      setPosts((response.posts || []).filter(item =>
        Array.isArray(item.image_urls) && item.image_urls.some(x => typeof x === 'string' && safeImage(x))))
      setNextCursor(response.has_more ? String(response.next_before || '') : '')
    } catch (error) {
      if (signal?.aborted) return
      if (error.message === 'AUTH_REQUIRED') navigate('/login')
      else setLoadError(true)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    const controller = new AbortController()
    loadFirst(controller.signal)
    return () => controller.abort()
  }, [loadFirst])

  const loadMore = async () => {
    if (loadingMore || !username || !nextCursor) return
    setLoadingMore(true)
    try {
      const response = await getJson(`/api/authors/page/${encodeURIComponent(username)}/posts?limit=20&content_library=1&status=active&before=${encodeURIComponent(nextCursor)}`)
      setPosts(previous => {
        const map = new Map(previous.map(x => [String(x.id), x]))
        ;(response.posts || []).filter(item =>
          Array.isArray(item.image_urls) && item.image_urls.some(x => typeof x === 'string' && safeImage(x)))
          .forEach(item => map.set(String(item.id), item))
        return [...map.values()]
      })
      setNextCursor(response.has_more ? String(response.next_before || '') : '')
    } catch {
      setLoadError(true)
    } finally {
      setLoadingMore(false)
    }
  }

  const selected = posts.find(x => String(x.id) === selectedId)
  const previewImage = Array.isArray(selected?.image_urls) ? selected.image_urls.find(x => typeof x === 'string' && safeImage(x)) : ''
  const visible = useMemo(() => posts.filter(item => String(item.content || '').toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())), [posts, search])
  const budgetNumber = Number(diamonds)
  const validBudget = Number.isSafeInteger(budgetNumber) && budgetNumber >= 100 && budgetNumber <= 1000000
  const change = setter => value => { setter(value); setSaved(false); setNotice('') }

  const validationError = () => {
    if (!selected) return tr('selectFirst')
    if (audience === 'genre' && !genre) return tr('genreFirst')
    if (!validBudget) return tr('invalidBudget')
    return ''
  }

  const saveDraft = async () => {
    if (saving || saved) return
    if (!username || !selected) return setNotice(tr('selectFirst'))
    const problem = validationError()
    if (problem) return setNotice(problem)
    const now = new Date().toISOString()
    const data = {
      kind: 'post', contentType: 'post', contentId: String(selected.id), goal,
      audience: {
        mode: audience === 'genre' ? 'manual' : 'automatic',
        genre: audience === 'genre' ? genre : '',
        country: audience === 'genre' ? country : '',
        language: audience === 'genre' ? language : '',
      },
      budgetUsd: budgetNumber / 100,
      durationDays: duration,
    }
    setSaving(true)
    setNotice('')
    try {
      if (deviceId) {
        const key = `shadow_author_ads_drafts_v1_${username}`
        const previous = JSON.parse(localStorage.getItem(key) || '[]')
        const records = Array.isArray(previous) ? previous : []
        const previousDraft = records.find(x => x.id === deviceId)
        const draft = {
          ...data, id: deviceId, status: 'draft', contentKey: `post:${selected.id}`,
          contentTitle: String(selected.content || '').trim().split(/\r?\n/).find(Boolean) || 'Photo post',
          contentImage: previewImage || '', updatedAt: now,
          createdAt: previousDraft?.createdAt || now,
        }
        localStorage.setItem(key, JSON.stringify([draft, ...records.filter(x => x.id !== deviceId)]))
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
          const draft = {
            ...data, id, status: 'draft', contentKey: `post:${selected.id}`,
            contentTitle: String(selected.content || '').trim().split(/\r?\n/).find(Boolean) || 'Photo post',
            contentImage: previewImage || '', updatedAt: now, createdAt: now,
          }
          localStorage.setItem(key, JSON.stringify([draft, ...records]))
          setDeviceId(id)
          setSaved(true)
          setNotice(tr('deviceSaved'))
        } catch {
          setNotice(tr('saveFailed'))
        }
      } else {
        setNotice(tr('saveFailed'))
      }
    } finally {
      setSaving(false)
    }
  }

  const next = () => {
    if (step === 0 && !selected) return setNotice(tr('selectFirst'))
    if (step === 2 && audience === 'genre' && !genre) return setNotice(tr('genreFirst'))
    if (step === 3) return saveDraft()
    setNotice('')
    setStep(value => value + 1)
  }

  return (
    <main className="min-h-[100dvh] bg-[#faf9ff] pb-[138px] text-[#1c1728] dark:bg-[#14111d] dark:text-white">
      <div className="mx-auto max-w-2xl px-4 pt-4 sm:px-6">
        <header className="mb-6 flex items-center gap-4">
          <button type="button" aria-label={tr('back')} className="-ml-2 p-2" onClick={() => navigate('/author/page/ads/boost-content')}><ArrowLeft size={24} /></button>
          <h1 className="text-[22px] font-bold">{tr('title')}</h1>
        </header>

        <div className="mb-6 flex items-start justify-between gap-1" aria-label="Campaign steps">
          {STEPS.map((key, index) => <button key={key} type="button" disabled={index > step || saved}
            onClick={() => { if (index < step && !saved) { setStep(index); setNotice('') } }}
            aria-current={step === index ? 'step' : undefined} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 disabled:cursor-default">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${index === step ? 'bg-[#6335d7] text-white' : index < step ? 'bg-[#e8dfff] text-[#6335d7]' : 'bg-[#eae9f1] text-[#747080] dark:bg-[#353041] dark:text-[#cbc3d5]'}`}>{index < step ? <Check size={17} /> : index + 1}</span>
            <span className={`text-[11px] sm:text-xs ${index === step ? 'font-semibold text-[#6335d7] dark:text-[#b59aff]' : 'text-[#868095] dark:text-[#beb6ca]'}`}>{tr(key)}</span>
          </button>)}
        </div>

        {step === 0 && <section className={CARD}>
          <h2 className="mb-4 text-base font-bold">{tr('pick')}</h2>
          <div className="relative mb-3"><Search size={18} className="absolute left-3 top-3.5 text-[#9592a3]" />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder={tr('search')} className="w-full rounded-xl border border-[#e8e5ee] bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8b62ea] dark:border-white/10 dark:bg-[#342b42]" />
          </div>
          {loading && <div className="flex justify-center gap-2 py-9 text-sm text-[#888297]"><Loader2 className="animate-spin" size={18} />{tr('loading')}</div>}
          {!loading && !visible.length && !loadError && <p className="py-8 text-center text-sm text-[#898497]">{tr('empty')}</p>}
          {!loading && <div className="max-h-[420px] space-y-2 overflow-y-auto">{visible.map(item =>
            <PostCard key={item.id} item={item} selected={selectedId === String(item.id)}
              onClick={() => { setSelectedId(String(item.id)); setSaved(false); setNotice('') }} />
          )}</div>}
          {loadError && <button type="button" className="mt-3 rounded-xl border border-[#e6dff1] px-4 py-2 text-sm text-[#6940dc]"
            onClick={() => { const controller = new AbortController(); loadFirst(controller.signal) }}>{tr('retry')}</button>}
          {nextCursor && <button type="button" disabled={loadingMore} onClick={loadMore}
            className="mt-4 flex w-full justify-center rounded-xl bg-[#f2edfa] py-3 text-sm font-semibold text-[#6335d7] disabled:opacity-50 dark:bg-[#372948] dark:text-[#d1bcff]">{loadingMore ? tr('loading') : tr('more')}</button>}
        </section>}

        {step === 1 && <section className={CARD}>
          <h2 className="mb-4 font-bold">{tr('goalTitle')}</h2>
          <div className="space-y-2">
            <Choice title={tr('views')} selected={goal === 'views'} onClick={() => change(setGoal)('views')} />
            <Choice title={tr('visits')} selected={goal === 'visits'} onClick={() => change(setGoal)('visits')} />
            <Choice title={tr('followers')} selected={goal === 'followers'} onClick={() => change(setGoal)('followers')} />
          </div>
        </section>}

        {step === 2 && <section className={CARD}>
          <h2 className="mb-4 font-bold">{tr('audienceTitle')}</h2>
          <div className="space-y-2">
            <Choice title={tr('all')} hint={tr('allHint')} selected={audience === 'all'} onClick={() => change(setAudience)('all')} />
            <Choice title={tr('genre')} hint={tr('genreHint')} selected={audience === 'genre'} onClick={() => change(setAudience)('genre')} />
            <Choice title={tr('fans')} hint={tr('fansHint')} selected={false} disabled badge={tr('soon')} />
          </div>
          {audience === 'genre' && <div className="mt-4 space-y-3 rounded-xl bg-[#f8f6fc] p-3 dark:bg-[#30283c]">
            <label className="block text-xs font-semibold">{tr('genrePick')}
              <select className={SELECT} value={genre} onChange={event => change(setGenre)(event.target.value)}>
                <option value="">{tr('any')}</option>{GENRES.map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold">{tr('country')}
              <select className={SELECT} value={country} onChange={event => change(setCountry)(event.target.value)}>
                <option value="">{tr('any')}</option><option value="KH">{tr('cambodia')}</option><option value="TH">{tr('thailand')}</option><option value="VN">{tr('vietnam')}</option>
              </select>
            </label>
            <label className="block text-xs font-semibold">{tr('language')}
              <select className={SELECT} value={language} onChange={event => change(setLanguage)(event.target.value)}>
                <option value="">{tr('any')}</option><option value="km">ខ្មែរ</option><option value="en">English</option><option value="zh">中文</option><option value="ja">日本語</option><option value="ko">한국어</option>
              </select>
            </label>
          </div>}
          <p className="mt-4 flex gap-2 text-xs leading-5 text-[#92899a] dark:text-[#c1b9cc]"><Users className="shrink-0" size={16} />{tr('targetingNote')}</p>
        </section>}

        {step === 3 && <div className="space-y-4">
          <section className={CARD}>
            <h2 className="mb-4 font-bold">{tr('budgetTitle')}</h2>
            <label className="block text-xs font-medium">{tr('diamonds')}
              <span className="relative mt-2 block"><Gem size={18} className="absolute left-3 top-3 text-[#6940d1]" />
                <input type="number" inputMode="numeric" min="100" max="1000000" step="1" value={diamonds}
                  onChange={event => change(setDiamonds)(event.target.value)}
                  className="w-full rounded-xl border border-[#e6e3ef] bg-white py-2.5 pl-10 pr-3 text-base font-semibold outline-none focus:border-[#6335d7] dark:border-white/10 dark:bg-[#302739]" />
              </span>
            </label>
            <p className="mt-2 text-xs leading-5 text-[#888195] dark:text-[#c5bdcd]">{tr('budgetNote')}</p>
            <div className="mt-5 text-sm font-semibold">{tr('duration')}</div>
            <div className="mt-2 grid grid-cols-4 gap-2">{[1, 3, 7, 14].map(value => <button key={value} type="button"
              onClick={() => change(setDuration)(value)}
              className={`rounded-xl border px-1 py-3 text-[11px] font-medium ${duration === value ? 'border-[#744ade] bg-[#f2ebff] text-[#6335d7] dark:bg-[#433158] dark:text-[#dbccff]' : 'border-[#e8e5ee] text-[#6d667b] dark:border-white/10 dark:text-[#e1d7ea]'}`}>
              {tr('day', { count: value })}
            </button>)}</div>
            {validBudget && <p className="mt-4 text-xs font-medium text-[#6940d1]">{tr('reach', { count: budgetNumber.toLocaleString() })}</p>}
          </section>
          <section className={CARD}>
            <h2 className="mb-4 font-bold">{tr('preview')}</h2>
            <div className="overflow-hidden rounded-xl border border-[#eae7f0] bg-white dark:border-white/10 dark:bg-[#2a2437]">
              <div className="flex items-center gap-2 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#efe8ff] text-[#6a45cc]"><BarChart3 size={18} /></span>
                <span className="text-xs font-semibold">Shadow <span className="block text-[10px] font-normal text-[#9990a6]">{tr('sponsored')}</span></span>
              </div>
              <div className="flex aspect-[16/10] items-center justify-center bg-[#f0ecf7] dark:bg-[#332b3f]">
                {safeImage(previewImage) ? <img alt="" src={safeImage(previewImage)} className="h-full w-full object-contain" /> : <ImageIcon size={38} className="text-[#8f83a4]" />}
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <span className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold">{String(selected?.content || '').trim() || 'Photo post'}</span>
                <span className="shrink-0 rounded-lg bg-[#ffd43f] px-3 py-2 text-xs font-semibold text-[#271d17]">{tr('view')}</span>
              </div>
            </div>
            <p className="mt-4 flex gap-2 text-xs leading-5 text-[#898295]"><Info size={15} className="shrink-0" />{tr('submitNote')}</p>
          </section>
        </div>}

        {notice && <div role="status" className={`mt-4 rounded-xl border p-3 text-sm ${saved ? 'border-[#d6c5ff] bg-[#f1eaff] text-[#6134ce] dark:bg-[#35284a] dark:text-[#e0d0ff]' : 'border-[#f2d6a3] bg-[#fff8e6] text-[#785116] dark:bg-[#4a3825] dark:text-[#ffe3a8]'}`}>
          {saved && <CircleCheck size={17} className="mr-2 inline-block" />}{notice}
        </div>}
        {saved && <button type="button" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#6940d1]" onClick={() => navigate('/author/page/ads/boost-content')}>
          {tr('finish')}<ChevronRight size={17} />
        </button>}
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#edeaf3] bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-5px_24px_rgba(49,29,91,.05)] backdrop-blur dark:border-white/10 dark:bg-[#241d2f]/95">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5">
          {step > 0 && !saved && <button type="button" onClick={() => { setStep(x => x - 1); setNotice('') }} aria-label={tr('back')} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e7e3ef] dark:border-white/15"><ChevronLeft size={22} /></button>}
          <button type="button" disabled={saving || !selected || saved} onClick={saveDraft} className="h-12 flex-1 rounded-xl border border-[#dfdbe8] bg-white px-2 text-xs font-semibold text-[#211829] disabled:opacity-45 dark:border-white/15 dark:bg-[#352b40] dark:text-white sm:text-sm">{saving ? tr('saving') : tr('draft')}</button>
          <button type="button" disabled={saving || saved} onClick={next} className="flex h-12 flex-[1.6] items-center justify-center gap-1.5 rounded-xl bg-[#ffd43f] px-2 text-sm font-bold text-[#1e1721] disabled:opacity-50">
            {saving && <Loader2 size={18} className="animate-spin" />}{step === 3 ? tr('review') : tr('next')}<ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </main>
  )
}

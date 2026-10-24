import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageEmptyState,
  PageErrorState,
  PageHeader,
  PageLoadingState,
  PageShell,
  SurfaceCard,
} from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('myFramePage', {
  en: {
    title: 'My Frame', back: 'Back', subtitle: 'Choose a frame for your profile photo',
    myFrame: 'My Frame', free: 'Free Frames', premium: 'Premium Frames', freeLabel: 'Free', premiumLabel: 'Premium',
    noFrame: 'No frame selected', preview: 'Preview with your profile photo',
    chosen: 'Selected', current: 'Using', apply: 'Apply', remove: 'Remove',
    applying: 'Applying...', applied: 'Frame applied successfully', removed: 'Frame removed',
    loading: 'Loading frames...', loadingMore: 'Loading 9 more...', loadMore: 'Load 9 more',
    failed: 'Unable to load frames', retry: 'Try again',
    emptyTitle: 'No frames available', emptyBody: 'New frames will appear here soon.',
    applyFailed: 'Unable to save your frame. Please retry.',
    premiumRequired: 'An active Premium subscription is required for this frame.',
    viewPremium: 'Get Premium', signIn: 'Sign in',
    signInToApply: 'Sign in to apply your frame.',
    signInForMore: 'Sign in to browse more than 9 frames.',
    selectionFailed: 'Your current frame could not be loaded.',
    tabAll: 'All', tabPremium: 'Premium', tabValid: 'Valid', coins: 'Coins', diamonds: 'Diamonds',
    buy: 'Buy frame', renew: 'Renew frame', buying: 'Processing...', valid: 'Valid', expired: 'Expired',
    validEmpty: 'No valid purchased frames yet.', expiredEmpty: 'No expired frames.',
    purchaseLoading: 'Loading your frames...', purchaseFailed: 'Unable to load your purchases.',
    purchaseMore: 'Load 9 more purchases', purchaseConfirm: 'Confirm this frame for up to', alreadyOwned: 'An active purchase will not be charged again.',
    purchaseSuccess: 'Frame purchased and applied.', purchaseApplyFailed: 'Purchased, but could not apply. Try Apply again.',
    purchaseFailedAction: 'Unable to purchase this frame. Please retry.', insufficientBalance: 'Not enough balance for this frame.',
    purchaseRequired: 'Purchase or renew this frame first.', coinDays: 'Valid for 30 days', permanent: 'Permanent',
    validUntil: 'Valid until', unavailable: 'This frame is unavailable.',
  },
  km: {
    title: 'ស៊ុមរបស់ខ្ញុំ', back: 'ត្រឡប់ក្រោយ', subtitle: 'ជ្រើសរើសស៊ុមសម្រាប់រូបប្រវត្តិរូបរបស់អ្នក',
    myFrame: 'ស៊ុមរបស់ខ្ញុំ', free: 'ស៊ុមឥតគិតថ្លៃ', premium: 'ស៊ុម Premium', freeLabel: 'ឥតគិតថ្លៃ', premiumLabel: 'Premium',
    noFrame: 'មិនទាន់ជ្រើសរើសស៊ុម', preview: 'មើលស៊ុមជាមួយរូបប្រវត្តិរូបរបស់អ្នក',
    chosen: 'បានជ្រើសរើស', current: 'កំពុងប្រើ', apply: 'អនុវត្ត', remove: 'ដកចេញ',
    applying: 'កំពុងអនុវត្ត...', applied: 'បានប្រើស៊ុមដោយជោគជ័យ', removed: 'បានដកស៊ុមចេញ',
    loading: 'កំពុងទាញស៊ុម...', loadingMore: 'កំពុងទាញបន្ថែម ៩...', loadMore: 'បង្ហាញ ៩ ទៀត',
    failed: 'មិនអាចទាញស៊ុមបាន', retry: 'ព្យាយាមម្ដងទៀត',
    emptyTitle: 'មិនទាន់មានស៊ុម', emptyBody: 'ស៊ុមថ្មីនឹងបង្ហាញនៅទីនេះក្នុងពេលឆាប់ៗ។',
    applyFailed: 'មិនអាចរក្សាទុកស៊ុមបានទេ។ សូមព្យាយាមម្ដងទៀត។',
    premiumRequired: 'ស៊ុមនេះតម្រូវឱ្យមានសមាជិកភាព Premium ដែលនៅមានសុពលភាព។',
    viewPremium: 'ទិញ Premium', signIn: 'ចូលគណនី',
    signInToApply: 'សូមចូលគណនីដើម្បីប្រើស៊ុម។',
    signInForMore: 'ចូលគណនីដើម្បីមើលស៊ុមលើសពី ៩។',
    selectionFailed: 'មិនអាចទាញស៊ុមដែលអ្នកកំពុងប្រើបានទេ។',
    tabAll: 'ទាំងអស់', tabPremium: 'Premium', tabValid: 'នៅមានសុពលភាព', coins: 'កាក់', diamonds: 'ពេជ្រ',
    buy: 'ទិញស៊ុម', renew: 'ទិញសាថ្មី', buying: 'កំពុងដំណើរការ...', valid: 'នៅមានសុពលភាព', expired: 'ផុតកំណត់',
    validEmpty: 'មិនទាន់មានស៊ុមទិញដែលនៅមានសុពលភាព។', expiredEmpty: 'មិនមានស៊ុមផុតកំណត់។',
    purchaseLoading: 'កំពុងទាញស៊ុមរបស់អ្នក...', purchaseFailed: 'មិនអាចទាញប្រវត្តិទិញបាន។',
    purchaseMore: 'បង្ហាញការទិញ ៩ ទៀត', purchaseConfirm: 'បញ្ជាក់ទិញស៊ុមនេះក្នុងតម្លៃមិនលើសពី', alreadyOwned: 'បើការទិញចាស់នៅមានសុពលភាព នឹងមិនកាត់លុយម្ដងទៀតទេ។',
    purchaseSuccess: 'ទិញ និងប្រើស៊ុមបានជោគជ័យ។', purchaseApplyFailed: 'ទិញបានហើយ ប៉ុន្តែមិនអាចប្រើស៊ុមភ្លាមៗបាន។ សូមចុច អនុវត្ត ម្ដងទៀត។',
    purchaseFailedAction: 'មិនអាចទិញស៊ុមបាន។ សូមព្យាយាមម្ដងទៀត។', insufficientBalance: 'សមតុល្យមិនគ្រប់សម្រាប់ស៊ុមនេះ។',
    purchaseRequired: 'សូមទិញ ឬទិញសាថ្មីសិន។', coinDays: 'សុពលភាព ៣០ ថ្ងៃ', permanent: 'មិនផុតកំណត់',
    validUntil: 'មានសុពលភាពដល់', unavailable: 'ស៊ុមនេះមិនអាចទិញបានទេ។',
  },
  zh: {
    title: '我的头像框', back: '返回', subtitle: '为你的头像选择装饰框',
    myFrame: '我的头像框', free: '免费头像框', premium: 'Premium 头像框', freeLabel: '免费', premiumLabel: 'Premium',
    noFrame: '尚未选择头像框', preview: '使用你的头像预览',
    chosen: '已选择', current: '使用中', apply: '应用', remove: '移除',
    applying: '正在应用...', applied: '头像框已应用', removed: '头像框已移除',
    loading: '正在加载头像框...', loadingMore: '正在加载另外 9 个...', loadMore: '再加载 9 个',
    failed: '无法加载头像框', retry: '重试',
    emptyTitle: '暂无头像框', emptyBody: '新头像框即将上线。',
    applyFailed: '保存失败，请重试。',
    premiumRequired: '使用此头像框需要有效的 Premium 会员资格。',
    viewPremium: '开通 Premium', signIn: '登录',
    signInToApply: '登录后即可使用头像框。',
    signInForMore: '登录后可浏览超过 9 个头像框。',
    selectionFailed: '无法加载你当前的头像框。',
    tabAll: '全部', tabPremium: 'Premium', tabValid: '有效', coins: '金币', diamonds: '钻石',
    buy: '购买头像框', renew: '续购头像框', buying: '处理中...', valid: '有效', expired: '已过期',
    validEmpty: '暂无有效的已购头像框。', expiredEmpty: '暂无过期头像框。',
    purchaseLoading: '正在加载你的头像框...', purchaseFailed: '无法加载购买记录。',
    purchaseMore: '再加载 9 条购买记录', purchaseConfirm: '确认购买此头像框，最多支付', alreadyOwned: '有效的已购头像框不会重复扣费。',
    purchaseSuccess: '购买并应用头像框成功。', purchaseApplyFailed: '购买成功，但无法立即应用。请再试一次。',
    purchaseFailedAction: '无法购买头像框，请重试。', insufficientBalance: '余额不足。',
    purchaseRequired: '请先购买或续购此头像框。', coinDays: '有效期 30 天', permanent: '永久有效',
    validUntil: '有效期至', unavailable: '此头像框不可购买。',
  },
  ja: {
    title: 'マイフレーム', back: '戻る', subtitle: 'プロフィール画像のフレームを選択',
    myFrame: 'マイフレーム', free: '無料フレーム', premium: 'Premium フレーム', freeLabel: '無料', premiumLabel: 'Premium',
    noFrame: 'フレームが選択されていません', preview: 'プロフィール画像でプレビュー',
    chosen: '選択済み', current: '使用中', apply: '適用', remove: '削除',
    applying: '適用中...', applied: 'フレームを適用しました', removed: 'フレームを外しました',
    loading: 'フレームを読み込み中...', loadingMore: 'さらに9件を読み込み中...', loadMore: 'さらに9件表示',
    failed: 'フレームを読み込めません', retry: '再試行',
    emptyTitle: 'フレームがありません', emptyBody: '新しいフレームは近日追加されます。',
    applyFailed: '保存できませんでした。もう一度お試しください。',
    premiumRequired: 'このフレームには有効な Premium 会員資格が必要です。',
    viewPremium: 'Premium に登録', signIn: 'ログイン',
    signInToApply: 'フレームを使うにはログインしてください。',
    signInForMore: '9件以上見るにはログインしてください。',
    selectionFailed: '現在のフレームを読み込めませんでした。',
    tabAll: 'すべて', tabPremium: 'Premium', tabValid: '有効', coins: 'コイン', diamonds: 'ダイヤモンド',
    buy: 'フレームを購入', renew: '再購入', buying: '処理中...', valid: '有効', expired: '期限切れ',
    validEmpty: '有効な購入済みフレームはありません。', expiredEmpty: '期限切れのフレームはありません。',
    purchaseLoading: 'フレームを読み込み中...', purchaseFailed: '購入履歴を読み込めません。',
    purchaseMore: '購入履歴をさらに9件表示', purchaseConfirm: 'このフレームを最大で購入します：', alreadyOwned: '有効な購入がある場合、再請求されません。',
    purchaseSuccess: '購入して適用しました。', purchaseApplyFailed: '購入しましたが、適用できませんでした。もう一度お試しください。',
    purchaseFailedAction: '購入できませんでした。もう一度お試しください。', insufficientBalance: '残高が不足しています。',
    purchaseRequired: 'このフレームを購入または更新してください。', coinDays: '有効期間30日', permanent: '無期限',
    validUntil: '有効期限', unavailable: 'このフレームは購入できません。',
  },
  ko: {
    title: '내 프레임', back: '뒤로', subtitle: '프로필 사진에 사용할 프레임을 선택하세요',
    myFrame: '내 프레임', free: '무료 프레임', premium: 'Premium 프레임', freeLabel: '무료', premiumLabel: 'Premium',
    noFrame: '선택된 프레임 없음', preview: '프로필 사진으로 미리보기',
    chosen: '선택됨', current: '사용 중', apply: '적용', remove: '제거',
    applying: '적용 중...', applied: '프레임이 적용되었습니다', removed: '프레임이 제거되었습니다',
    loading: '프레임 불러오는 중...', loadingMore: '9개 더 불러오는 중...', loadMore: '9개 더 보기',
    failed: '프레임을 불러올 수 없습니다', retry: '다시 시도',
    emptyTitle: '프레임이 없습니다', emptyBody: '새 프레임이 곧 추가됩니다.',
    applyFailed: '저장할 수 없습니다. 다시 시도해 주세요.',
    premiumRequired: '이 프레임을 사용하려면 유효한 Premium 구독이 필요합니다.',
    viewPremium: 'Premium 가입', signIn: '로그인',
    signInToApply: '프레임을 적용하려면 로그인하세요.',
    signInForMore: '9개보다 많은 프레임을 보려면 로그인하세요.',
    selectionFailed: '현재 프레임을 불러올 수 없습니다.',
    tabAll: '전체', tabPremium: 'Premium', tabValid: '사용 가능', coins: '코인', diamonds: '다이아몬드',
    buy: '프레임 구매', renew: '프레임 갱신', buying: '처리 중...', valid: '사용 가능', expired: '만료됨',
    validEmpty: '사용 가능한 구매 프레임이 없습니다.', expiredEmpty: '만료된 프레임이 없습니다.',
    purchaseLoading: '프레임 불러오는 중...', purchaseFailed: '구매 내역을 불러올 수 없습니다.',
    purchaseMore: '구매 내역 9개 더 보기', purchaseConfirm: '이 프레임을 최대 다음 금액으로 구매합니다:', alreadyOwned: '유효한 구매가 있으면 중복 결제되지 않습니다.',
    purchaseSuccess: '프레임을 구매하고 적용했습니다.', purchaseApplyFailed: '구매했지만 적용하지 못했습니다. 다시 시도해 주세요.',
    purchaseFailedAction: '프레임을 구매하지 못했습니다. 다시 시도해 주세요.', insufficientBalance: '잔액이 부족합니다.',
    purchaseRequired: '먼저 프레임을 구매하거나 갱신하세요.', coinDays: '30일 동안 유효', permanent: '영구 사용',
    validUntil: '유효 기간', unavailable: '이 프레임은 구매할 수 없습니다.',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)
const PAGE_SIZE = 9
const AUTO_PAGE_LIMIT = 3
const CATALOG_CACHE_MS = 3 * 60 * 1000

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getStoredReader() {
  try {
    return JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
  } catch {
    return null
  }
}

function safeImageUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return ''
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

function catalogCacheKey(page) {
  return `shadow_profile_frames_catalog_v2_${page}`
}

function getCachedCatalog(page) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(catalogCacheKey(page)) || 'null')
    if (cached?.saved_at > Date.now() - CATALOG_CACHE_MS && Array.isArray(cached.items)) return cached
  } catch {}
  return null
}

function saveCachedCatalog(page, data) {
  try {
    sessionStorage.setItem(catalogCacheKey(page), JSON.stringify({
      saved_at: Date.now(),
      items: data.items,
      has_more: data.pagination?.has_more === true,
    }))
  } catch {}
}

async function loadCatalogPage(page, token, signal) {
  const cached = getCachedCatalog(page)
  if (cached) return { items: cached.items, has_more: cached.has_more }
  const response = await fetch(`${API_BASE_URL}/api/profile-frames?page=${page}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal,
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  if (data.ok !== true || !Array.isArray(data.items)) throw new Error('Invalid catalog response')
  saveCachedCatalog(page, data)
  return { items: data.items.slice(0, PAGE_SIZE), has_more: data.pagination?.has_more === true }
}

async function loadPurchasesPage(page, token, signal) {
  const response = await fetch(`${API_BASE_URL}/api/profile-frames/purchases?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal,
  })
  if (!response.ok) throw new Error('Purchases unavailable')
  const data = await response.json()
  if (data.ok !== true || !Array.isArray(data.items)) throw new Error('Invalid purchases response')
  return { items: data.items, hasMore: data.pagination?.has_more === true }
}

function newPurchaseKey() {
  const bytes = new Uint8Array(16)
  window.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 15) | 64
  bytes[8] = (bytes[8] & 63) | 128
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function FramePortrait({ frame, avatar, initial, size = 'large' }) {
  const frameUrl = safeImageUrl(frame?.image_url)
  const avatarUrl = safeImageUrl(avatar)
  const large = size === 'large'
  return (
    <div className={`relative mx-auto aspect-square shrink-0 ${large ? 'w-36 sm:w-40' : 'w-16'}`}>
      <div className="absolute inset-[17%] overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[var(--shadow-text-secondary)]">{initial}</div>
        )}
      </div>
      {frameUrl ? <img src={frameUrl} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" /> : null}
    </div>
  )
}

export default function MyFramePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [token] = useState(getReaderToken)
  const reader = useMemo(getStoredReader, [])
  const avatar = reader?.avatar_url || reader?.avatarUrl || reader?.profile_image || reader?.photo_url || ''
  const initial = String(reader?.name || reader?.display_name || 'S').charAt(0).toUpperCase()
  const [catalog, setCatalog] = useState({ items: [], page: 0, hasMore: true, loading: true, loadingMore: false, error: '', moreError: '' })
  const [selectedFrame, setSelectedFrame] = useState(null)
  const [previewFrame, setPreviewFrame] = useState(null)
  const [selectionLoading, setSelectionLoading] = useState(Boolean(token))
  const [selectionError, setSelectionError] = useState('')
  const [applyError, setApplyError] = useState('')
  const [applyNotice, setApplyNotice] = useState('')
  const [applying, setApplying] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const [purchases, setPurchases] = useState({ items: [], page: 0, hasMore: false, loading: false, loadingMore: false, error: '' })
  const [purchaseRefresh, setPurchaseRefresh] = useState(0)
  const [purchasing, setPurchasing] = useState(false)
  const [justPurchasedIds, setJustPurchasedIds] = useState([])
  const purchaseKeyRef = useRef(null)
  const sentinelRef = useRef(null)
  const loadingMoreRef = useRef(false)
  const moreControllerRef = useRef(null)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    setCatalog({ items: [], page: 0, hasMore: true, loading: true, loadingMore: false, error: '', moreError: '' })
    async function start() {
      try {
        const data = await loadCatalogPage(1, token, controller.signal)
        if (!active) return
        setCatalog({ items: data.items, page: 1, hasMore: data.has_more, loading: false, loadingMore: false, error: '', moreError: '' })
      } catch {
        if (active) setCatalog(current => ({ ...current, loading: false, error: 'failed' }))
      }
    }
    start()
    return () => { active = false; controller.abort() }
  }, [retryKey, token])

  useEffect(() => {
    if (!token) { setSelectionLoading(false); return }
    let active = true
    const controller = new AbortController()
    async function start() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile-frames/selection`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Selection unavailable')
        const data = await response.json()
        if (active) setSelectedFrame(data.frame || null)
      } catch {
        if (active) setSelectionError('selectionFailed')
      } finally {
        if (active) setSelectionLoading(false)
      }
    }
    start()
    return () => { active = false; controller.abort() }
  }, [token])

  useEffect(() => {
    if (!token) return undefined
    let active = true
    const controller = new AbortController()
    setPurchases(current => ({ ...current, loading: true, error: '' }))
    loadPurchasesPage(1, token, controller.signal).then(data => {
      if (active) setPurchases({ items: data.items, page: 1, hasMore: data.hasMore, loading: false, loadingMore: false, error: '' })
    }).catch(() => {
      if (active) setPurchases(current => ({ ...current, loading: false, error: 'purchaseFailed' }))
    })
    return () => { active = false; controller.abort() }
  }, [purchaseRefresh, token])

  const loadMorePurchases = useCallback(async () => {
    if (!token || purchases.loading || purchases.loadingMore || !purchases.hasMore || purchases.page < 1) return
    const nextPage = purchases.page + 1
    setPurchases(current => ({ ...current, loadingMore: true, error: '' }))
    try {
      const data = await loadPurchasesPage(nextPage, token)
      setPurchases(current => ({
        ...current,
        items: [...current.items, ...data.items.filter(item => !current.items.some(existing => existing.id === item.id))],
        page: nextPage,
        hasMore: data.hasMore,
        loadingMore: false,
      }))
    } catch {
      setPurchases(current => ({ ...current, loadingMore: false, error: 'purchaseFailed' }))
    }
  }, [purchases.hasMore, purchases.loading, purchases.loadingMore, purchases.page, token])

  const loadMore = useCallback(async () => {
    if (!token || catalog.loading || catalog.loadingMore || !catalog.hasMore || catalog.page < 1 || loadingMoreRef.current) return
    loadingMoreRef.current = true
    const nextPage = catalog.page + 1
    const controller = new AbortController()
    moreControllerRef.current = controller
    setCatalog(current => ({ ...current, loadingMore: true, moreError: '' }))
    try {
      const data = await loadCatalogPage(nextPage, token, controller.signal)
      if (controller.signal.aborted) return
      setCatalog(current => {
        if (current.page >= nextPage) return { ...current, loadingMore: false }
        const existing = new Set(current.items.map(frame => frame.id))
        return {
          ...current,
          items: [...current.items, ...data.items.filter(frame => !existing.has(frame.id))],
          page: nextPage,
          hasMore: data.has_more,
          loadingMore: false,
          moreError: '',
        }
      })
    } catch {
      if (!controller.signal.aborted) setCatalog(current => ({ ...current, loadingMore: false, moreError: 'failed' }))
    } finally {
      loadingMoreRef.current = false
      if (moreControllerRef.current === controller) moreControllerRef.current = null
    }
  }, [catalog.hasMore, catalog.loading, catalog.loadingMore, catalog.page, token])

  useEffect(() => () => { moreControllerRef.current?.abort() }, [])

  useEffect(() => {
    if (!token || catalog.loading || catalog.loadingMore || catalog.error || catalog.moreError || !catalog.hasMore || catalog.page < 1 || catalog.page >= AUTO_PAGE_LIMIT) return
    if (typeof IntersectionObserver === 'undefined' || !sentinelRef.current) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) loadMore()
    }, { rootMargin: '180px' })
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [catalog.error, catalog.hasMore, catalog.loading, catalog.loadingMore, catalog.moreError, catalog.page, loadMore, token])

  async function saveSelection(frameId) {
    if (!token) { navigate('/login'); return }
    if (applying) return
    setApplying(true)
    setApplyError('')
    setApplyNotice('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile-frames/selection`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ frame_id: frameId }),
        cache: 'no-store',
      })
      if (response.status === 403) { setApplyError(previewFrame?.access_tier === 'premium' ? 'premiumRequired' : 'purchaseRequired'); return }
      if (!response.ok) throw new Error('Unable to apply frame')
      const data = await response.json()
      if (data.ok !== true) throw new Error('Unable to apply frame')
      setSelectedFrame(data.frame || null)
      setPreviewFrame(null)
      setApplyNotice(frameId ? 'applied' : 'removed')
    } catch {
      setApplyError('applyFailed')
    } finally {
      setApplying(false)
    }
  }

  async function buyFrame(frame) {
    if (!token) { navigate('/login'); return }
    if (applying || purchasing || !frame || !['coins', 'diamonds'].includes(frame.access_tier)) return
    const price = Number(frame.access_tier === 'coins' ? frame.coin_price : frame.diamond_price)
    if (!frame.is_active && frame.is_active !== undefined) { setApplyError('unavailable'); return }
    if (!Number.isSafeInteger(price) || price < 1) { setApplyError('unavailable'); return }
    const currency = t(`myFramePage.${frame.access_tier}`)
    if (!window.confirm(`${t('myFramePage.purchaseConfirm')} ${price} ${currency}.\n${t('myFramePage.alreadyOwned')}`)) return
    setPurchasing(true)
    setApplyError('')
    setApplyNotice('')
    try {
      if (purchaseKeyRef.current?.frameId !== frame.id) purchaseKeyRef.current = { frameId: frame.id, key: newPurchaseKey() }
      const response = await fetch(`${API_BASE_URL}/api/profile-frames/${encodeURIComponent(frame.id)}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idempotency_key: purchaseKeyRef.current.key }),
        cache: 'no-store',
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || data?.ok !== true) {
        if (response.status === 409 && /balance/i.test(data?.message || '')) throw new Error('insufficientBalance')
        throw new Error('purchaseFailedAction')
      }
      purchaseKeyRef.current = null
      setJustPurchasedIds(current => current.includes(frame.id) ? current : [...current, frame.id])
      setPurchaseRefresh(value => value + 1)
      const applyResponse = await fetch(`${API_BASE_URL}/api/profile-frames/selection`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ frame_id: frame.id }),
        cache: 'no-store',
      })
      const applied = await applyResponse.json().catch(() => null)
      if (!applyResponse.ok || applied?.ok !== true) {
        setApplyError('purchaseApplyFailed')
        return
      }
      setSelectedFrame(applied.frame || frame)
      setPreviewFrame(null)
      setApplyNotice('purchaseSuccess')
    } catch (failure) {
      setApplyError(failure.message === 'insufficientBalance' ? 'insufficientBalance' : 'purchaseFailedAction')
    } finally {
      setPurchasing(false)
    }
  }

  const shownFrame = previewFrame || selectedFrame
  const freeFrames = catalog.items.filter(item => item.access_tier === 'free')
  const coinFrames = catalog.items.filter(item => item.access_tier === 'coins')
  const diamondFrames = catalog.items.filter(item => item.access_tier === 'diamonds')
  const premiumFrames = catalog.items.filter(item => item.access_tier === 'premium')
  const purchaseValid = item => item.valid && (item.currency === 'diamonds' || (item.expires_at && Date.parse(item.expires_at) > Date.now()))
  const validPurchases = purchases.items.filter(item => item.frame && purchaseValid(item))
  const expiredPurchases = purchases.items.filter((item, index, items) => item.frame && !purchaseValid(item) && !items.some(other => other.frame_id === item.frame_id && purchaseValid(other)) && items.findIndex(other => other.frame_id === item.frame_id) === index)
  const validFrames = [...freeFrames, ...validPurchases.map(item => item.frame), ...(selectedFrame?.access_tier === 'premium' ? [selectedFrame] : [])]
    .filter((item, index, items) => items.findIndex(other => other.id === item.id) === index)
  const activePurchase = purchases.items.find(item => item.frame_id === previewFrame?.id && purchaseValid(item))
  const previewTier = previewFrame?.access_tier
  const requiresPurchase = ['coins', 'diamonds'].includes(previewTier) && !activePurchase && !justPurchasedIds.includes(previewFrame?.id) && selectedFrame?.id !== previewFrame?.id
  const isRenewal = purchases.items.some(item => item.frame_id === previewFrame?.id && !purchaseValid(item))
  const loginPrompt = !token && catalog.items.length > 0

  function renderFrames(frames) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {frames.map(frame => {
          const imageUrl = safeImageUrl(frame.image_url)
          const active = (previewFrame || selectedFrame)?.id === frame.id
          const using = selectedFrame?.id === frame.id
          return (
            <button
              type="button"
              key={frame.id}
              onClick={() => { setPreviewFrame(frame); setApplyError(''); setApplyNotice('') }}
              aria-label={frame.name}
              aria-pressed={active}
              className={`app-card overflow-hidden rounded-2xl border p-2 text-left transition active:scale-[0.98] ${active ? 'ring-2 ring-[var(--shadow-accent)]' : ''}`}
            >
              <div className="app-soft aspect-square overflow-hidden rounded-xl">
                {imageUrl ? <img src={imageUrl} alt="" loading="lazy" className="h-full w-full object-contain" /> : null}
              </div>
              <p className="app-title mt-2 truncate text-[11px] font-bold" title={frame.name}>{frame.name}</p>
              <p className="app-muted mt-0.5 truncate text-[10px] font-semibold">
                {using ? t('myFramePage.current') : active ? t('myFramePage.chosen') : frame.access_tier === 'premium' ? t('myFramePage.premiumLabel') : frame.access_tier === 'coins' ? `${Number(frame.coin_price || 0)} ${t('myFramePage.coins')}` : frame.access_tier === 'diamonds' ? `${Number(frame.diamond_price || 0)} ${t('myFramePage.diamonds')}` : t('myFramePage.freeLabel')}
              </p>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <PageShell className="pb-24">
      <PageHeader title={t('myFramePage.title')} subtitle={t('myFramePage.subtitle')} onBack={() => navigate(-1)} backLabel={t('myFramePage.back')} />
      <main className="mx-auto max-w-[960px] space-y-6 px-4 py-5">
        <SurfaceCard className="p-5 text-center">
          <h2 className="app-title mb-2 text-[16px] font-bold">{t('myFramePage.myFrame')}</h2>
          <p className="app-muted mb-4 text-[12px]">{t('myFramePage.preview')}</p>
          <FramePortrait frame={shownFrame} avatar={avatar} initial={initial} />
          <p className="app-title mt-3 text-[13px] font-bold">{shownFrame?.name || t('myFramePage.noFrame')}</p>
          {selectionLoading ? <p className="app-muted mt-2 text-[11px]">{t('myFramePage.loading')}</p> : null}
          {selectionError ? <p className="mt-2 text-[11px] text-red-500">{t(`myFramePage.${selectionError}`)}</p> : null}
          {applyError ? <p className="mt-3 text-[12px] text-red-500">{t(`myFramePage.${applyError}`)}</p> : null}
          {applyNotice ? <p className="mt-3 text-[12px] text-green-600 dark:text-green-400">{t(`myFramePage.${applyNotice}`)}</p> : null}
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              disabled={applying || purchasing || !previewFrame || selectionLoading || requiresPurchase}
              onClick={() => saveSelection(previewFrame.id)}
              className="rounded-full bg-[var(--shadow-text-primary)] px-7 py-2.5 text-[12px] font-bold text-[var(--shadow-bg-surface)] disabled:opacity-40"
            >
              {applying ? t('myFramePage.applying') : t('myFramePage.apply')}
            </button>
            <button
              type="button"
              disabled={applying || purchasing || !selectedFrame || selectionLoading}
              onClick={() => saveSelection(null)}
              className="app-card rounded-full border px-6 py-2.5 text-[12px] font-bold disabled:opacity-40"
            >
              {t('myFramePage.remove')}
            </button>
          </div>
          {requiresPurchase ? (
            <button type="button" disabled={purchasing || applying || selectionLoading} onClick={() => buyFrame(previewFrame)} className="mt-3 rounded-full bg-amber-500 px-7 py-2.5 text-[12px] font-bold text-black disabled:opacity-40">
              {purchasing ? t('myFramePage.buying') : isRenewal ? t('myFramePage.renew') : t('myFramePage.buy')}
            </button>
          ) : null}
          {previewFrame?.access_tier === 'coins' ? <p className="app-muted mt-2 text-[11px]">{t('myFramePage.coinDays')}</p> : null}
          {previewFrame?.access_tier === 'diamonds' ? <p className="app-muted mt-2 text-[11px]">{t('myFramePage.permanent')}</p> : null}
          {activePurchase?.expires_at ? <p className="app-muted mt-2 text-[11px]">{t('myFramePage.validUntil')} {new Date(activePurchase.expires_at).toLocaleString()}</p> : null}
          {!token ? <p className="app-muted mt-3 text-[11px]">{t('myFramePage.signInToApply')}</p> : null}
          {applyError === 'premiumRequired' ? (
            <button type="button" onClick={() => navigate('/premium')} className="mt-2 text-[12px] font-bold text-amber-600 underline">{t('myFramePage.viewPremium')}</button>
          ) : null}
        </SurfaceCard>

        <div className="flex gap-4 border-b border-[var(--shadow-border)]">
          {[['all', 'tabAll'], ['premium', 'tabPremium'], ['valid', 'tabValid']].map(([value, label]) => (
            <button key={value} type="button" onClick={() => setActiveTab(value)} className={`border-b-2 px-2 pb-2 text-[13px] font-bold ${activeTab === value ? 'border-[var(--shadow-text-primary)] text-[var(--shadow-text-primary)]' : 'border-transparent text-[var(--shadow-text-secondary)]'}`}>{t(`myFramePage.${label}`)}</button>
          ))}
        </div>
        {activeTab !== 'valid' && catalog.loading ? <PageLoadingState rows={3} label={t('myFramePage.loading')} /> : null}
        {activeTab !== 'valid' && !catalog.loading && catalog.error ? <PageErrorState title={t('myFramePage.failed')} actionLabel={t('myFramePage.retry')} onAction={() => setRetryKey(value => value + 1)} /> : null}
        {activeTab !== 'valid' && !catalog.loading && !catalog.error && !catalog.items.length ? <PageEmptyState title={t('myFramePage.emptyTitle')} body={t('myFramePage.emptyBody')} /> : null}

        {activeTab === 'valid' ? (
          <>
            {purchases.loading ? <PageLoadingState rows={1} label={t('myFramePage.purchaseLoading')} /> : null}
            {purchases.error ? <PageErrorState title={t('myFramePage.purchaseFailed')} actionLabel={t('myFramePage.retry')} onAction={() => setPurchaseRefresh(value => value + 1)} /> : null}
            {!purchases.loading ? (
              <>
                <section><h2 className="app-title mb-3 text-[16px] font-bold">{t('myFramePage.valid')}</h2>{validFrames.length ? renderFrames(validFrames) : <p className="app-muted text-[12px]">{t('myFramePage.validEmpty')}</p>}</section>
                <section><h2 className="app-title mb-3 text-[16px] font-bold">{t('myFramePage.expired')}</h2>{expiredPurchases.length ? renderFrames(expiredPurchases.map(item => item.frame)) : <p className="app-muted text-[12px]">{t('myFramePage.expiredEmpty')}</p>}</section>
                {purchases.hasMore ? <div className="flex justify-center"><button type="button" disabled={purchases.loadingMore} onClick={loadMorePurchases} className="app-card rounded-full border px-6 py-3 text-[12px] font-bold disabled:opacity-50">{purchases.loadingMore ? t('myFramePage.purchaseLoading') : t('myFramePage.purchaseMore')}</button></div> : null}
              </>
            ) : null}
          </>
        ) : null}
        {activeTab !== 'valid' && !catalog.loading && !catalog.error && catalog.items.length > 0 ? (
          <>
            {activeTab === 'all' && freeFrames.length ? <section><h2 className="app-title mb-3 text-[16px] font-bold">{t('myFramePage.free')}</h2>{renderFrames(freeFrames)}</section> : null}
            {activeTab === 'all' && coinFrames.length ? <section><h2 className="app-title mb-3 text-[16px] font-bold">{t('myFramePage.coins')}</h2>{renderFrames(coinFrames)}</section> : null}
            {activeTab === 'all' && diamondFrames.length ? <section><h2 className="app-title mb-3 text-[16px] font-bold">{t('myFramePage.diamonds')}</h2>{renderFrames(diamondFrames)}</section> : null}
            {activeTab === 'premium' && premiumFrames.length ? <section><h2 className="app-title mb-3 text-[16px] font-bold">{t('myFramePage.premium')}</h2>{renderFrames(premiumFrames)}</section> : null}
            {catalog.loadingMore ? <PageLoadingState rows={1} label={t('myFramePage.loadingMore')} /> : null}
            {catalog.moreError ? <PageErrorState title={t('myFramePage.failed')} actionLabel={t('myFramePage.retry')} onAction={loadMore} /> : null}
            {token && catalog.hasMore && catalog.page < AUTO_PAGE_LIMIT && !catalog.moreError ? <div ref={sentinelRef} className="h-4" aria-hidden="true" /> : null}
            {token && catalog.hasMore && catalog.page >= AUTO_PAGE_LIMIT && !catalog.moreError ? (
              <div className="flex justify-center">
                <button type="button" disabled={catalog.loadingMore} onClick={loadMore} className="app-card rounded-full border px-6 py-3 text-[12px] font-bold disabled:opacity-50">
                  {catalog.loadingMore ? t('myFramePage.loadingMore') : t('myFramePage.loadMore')}
                </button>
              </div>
            ) : null}
            {loginPrompt ? (
              <SurfaceCard className="p-5 text-center">
                <p className="app-muted text-[12px]">{t('myFramePage.signInForMore')}</p>
                <button type="button" onClick={() => navigate('/login')} className="mt-3 rounded-full bg-[var(--shadow-text-primary)] px-6 py-2.5 text-[12px] font-bold text-[var(--shadow-bg-surface)]">{t('myFramePage.signIn')}</button>
              </SurfaceCard>
            ) : null}
          </>
        ) : null}
      </main>
    </PageShell>
  )
}

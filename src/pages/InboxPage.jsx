import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('inboxPage', {
  en: {
    all: 'All',
    rewards: 'Rewards',
    adminMail: 'Admin Mail',
    system: 'System',
    coupon: 'Coupon',
    event: 'Event',
    payment: 'Payment',
    admin: 'Admin',
    systemAuto: 'System Auto',
    now: 'Now',
    minutesAgo: '{{count}}m ago',
    hoursAgo: '{{count}}h ago',
    yesterday: 'Yesterday',
    daysAgo: '{{count}} days ago',
    claim: 'Claim',
    claimed: 'Claimed',
    closeMailDetail: 'Close mail detail',
    received: 'Received',
    loadFailed: 'Failed to load mails',
    claimFailed: 'Failed to claim reward',
    inbox: 'Inbox',
    subtitle: 'Messages, rewards, and admin mail',
    loadingMails: 'Loading mails...',
    loadMore: 'Load more',
    loadingMore: 'Loading...',
    noMail: 'No mail yet',
    noMailBody: 'Admin messages, rewards, and important account mail will appear here.',
  },
  km: {
    all: 'ទាំងអស់',
    rewards: 'រង្វាន់',
    adminMail: 'សារពី Admin',
    system: 'ប្រព័ន្ធ',
    coupon: 'Coupon',
    event: 'ព្រឹត្តិការណ៍',
    payment: 'ការទូទាត់',
    admin: 'Admin',
    systemAuto: 'ប្រព័ន្ធស្វ័យប្រវត្តិ',
    now: 'ឥឡូវនេះ',
    minutesAgo: '{{count}} នាទីមុន',
    hoursAgo: '{{count}} ម៉ោងមុន',
    yesterday: 'ម្សិលមិញ',
    daysAgo: '{{count}} ថ្ងៃមុន',
    claim: 'ទទួល',
    claimed: 'បានទទួល',
    closeMailDetail: 'បិទព័ត៌មានសារ',
    received: 'បានទទួល',
    loadFailed: 'មិនអាចផ្ទុកសារបានទេ',
    claimFailed: 'មិនអាចទទួលរង្វាន់បានទេ',
    inbox: 'ប្រអប់សារ',
    subtitle: 'សារ រង្វាន់ និងសារពី Admin',
    loadingMails: 'កំពុងផ្ទុកសារ...',
    loadMore: 'បង្ហាញបន្ថែម',
    loadingMore: 'កំពុងផ្ទុក...',
    noMail: 'មិនទាន់មានសារ',
    noMailBody: 'សារពី Admin រង្វាន់ និងសារសំខាន់ៗអំពីគណនី នឹងបង្ហាញនៅទីនេះ។',
  },
  zh: {
    all: '全部',
    rewards: '奖励',
    adminMail: 'Admin 邮件',
    system: '系统',
    coupon: '优惠券',
    event: '活动',
    payment: '付款',
    admin: 'Admin',
    systemAuto: '系统自动',
    now: '刚刚',
    minutesAgo: '{{count}} 分钟前',
    hoursAgo: '{{count}} 小时前',
    yesterday: '昨天',
    daysAgo: '{{count}} 天前',
    claim: '领取',
    claimed: '已领取',
    closeMailDetail: '关闭邮件详情',
    received: '收到时间',
    loadFailed: '无法加载邮件',
    claimFailed: '无法领取奖励',
    inbox: '收件箱',
    subtitle: '消息、奖励和 Admin 邮件',
    loadingMails: '正在加载邮件...',
    loadMore: '加载更多',
    loadingMore: '加载中...',
    noMail: '暂无邮件',
    noMailBody: 'Admin 消息、奖励和重要账户邮件会显示在这里。',
  },
  ja: {
    all: 'すべて',
    rewards: '報酬',
    adminMail: 'Admin メール',
    system: 'システム',
    coupon: 'クーポン',
    event: 'イベント',
    payment: '支払い',
    admin: 'Admin',
    systemAuto: 'システム自動',
    now: 'たった今',
    minutesAgo: '{{count}}分前',
    hoursAgo: '{{count}}時間前',
    yesterday: '昨日',
    daysAgo: '{{count}}日前',
    claim: '受け取る',
    claimed: '受取済み',
    closeMailDetail: 'メール詳細を閉じる',
    received: '受信',
    loadFailed: 'メールを読み込めませんでした',
    claimFailed: '報酬を受け取れませんでした',
    inbox: '受信トレイ',
    subtitle: 'メッセージ、報酬、Admin メール',
    loadingMails: 'メールを読み込み中...',
    loadMore: 'さらに読み込む',
    loadingMore: '読み込み中...',
    noMail: 'メールはまだありません',
    noMailBody: 'Admin メッセージ、報酬、重要なアカウントメールがここに表示されます。',
  },
  ko: {
    all: '전체',
    rewards: '보상',
    adminMail: 'Admin 메일',
    system: '시스템',
    coupon: '쿠폰',
    event: '이벤트',
    payment: '결제',
    admin: 'Admin',
    systemAuto: '시스템 자동',
    now: '방금',
    minutesAgo: '{{count}}분 전',
    hoursAgo: '{{count}}시간 전',
    yesterday: '어제',
    daysAgo: '{{count}}일 전',
    claim: '받기',
    claimed: '받음',
    closeMailDetail: '메일 상세 닫기',
    received: '받은 시간',
    loadFailed: '메일을 불러오지 못했습니다',
    claimFailed: '보상을 받지 못했습니다',
    inbox: '받은 편지함',
    subtitle: '메시지, 보상 및 Admin 메일',
    loadingMails: '메일을 불러오는 중...',
    loadMore: '더 보기',
    loadingMore: '불러오는 중...',
    noMail: '아직 메일이 없습니다',
    noMailBody: 'Admin 메시지, 보상 및 중요한 계정 메일이 여기에 표시됩니다.',
  },
})

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'
const MAIL_PAGE_SIZE = 30

const TABS = [
  { key: 'all', label: 'All', apiType: 'all' },
  { key: 'rewards', label: 'Rewards', apiType: 'rewards' },
  { key: 'admin', label: 'Admin Mail', apiType: 'admin' },
  { key: 'system', label: 'System', apiType: 'system' },
]

const TAB_LABEL_KEYS = {
  all: 'all',
  rewards: 'rewards',
  admin: 'adminMail',
  system: 'system',
}

const MAIL_TYPE_LABEL_KEYS = {
  Rewards: 'rewards',
  System: 'system',
  Coupon: 'coupon',
  Event: 'event',
  Payment: 'payment',
  'Admin Mail': 'adminMail',
}

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getMailTypeLabel(type) {
  const value = String(type || '').toLowerCase()

  if (value === 'reward') return 'Rewards'
  if (value === 'system') return 'System'
  if (value === 'coupon') return 'Coupon'
  if (value === 'event') return 'Event'
  if (value === 'payment') return 'Payment'

  return 'Admin Mail'
}

function getMailIcon(mail) {
  const type = String(mail.mail_type || '').toLowerCase()

  if (type === 'reward') return 'fa-solid fa-gift'
  if (type === 'coupon') return 'fa-solid fa-ticket'
  if (type === 'payment') return 'fa-solid fa-wallet'
  if (type === 'event') return 'fa-solid fa-bullhorn'
  if (type === 'system') return 'fa-solid fa-gear'

  return mail.sender_type === 'admin'
    ? 'fa-solid fa-user-shield'
    : 'fa-solid fa-envelope'
}

function getSenderLabel(senderType) {
  return senderType === 'admin' ? 'Admin' : 'System Auto'
}

function formatMailTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

function formatDisplayMailTime(value, language, t) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return t('inboxPage.now')
  if (diffMinutes < 60) {
    return t('inboxPage.minutesAgo', { count: diffMinutes })
  }
  if (diffHours < 24) {
    return t('inboxPage.hoursAgo', { count: diffHours })
  }
  if (diffDays === 1) return t('inboxPage.yesterday')
  if (diffDays < 7) {
    return t('inboxPage.daysAgo', { count: diffDays })
  }

  return date.toLocaleDateString(
    DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en,
    {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    }
  )
}

function normalizeMail(mail) {
  return {
    id: mail.id,
    type: getMailTypeLabel(mail.mail_type),
    title: mail.title || '',
    message: mail.message || '',
    detail: mail.detail || mail.message || '',
    time: formatMailTime(mail.created_at),
    icon: getMailIcon(mail),
    unread: !mail.is_read,
    sender: getSenderLabel(mail.sender_type),
    action: mail.action_type === 'claim' ? 'Claim' : '',
    claimed: Boolean(mail.claimed_at),
    raw: mail,
  }
}

function mergeUniqueMails(current, incoming) {
  const seen = new Set()
  const merged = []

  for (const mail of [...current, ...incoming]) {
    if (!mail?.id || seen.has(mail.id)) continue
    seen.add(mail.id)
    merged.push(mail)
  }

  return merged
}

function getDisplayMailType(type, t) {
  const key = MAIL_TYPE_LABEL_KEYS[type]
  return key ? t(`inboxPage.${key}`) : type
}

function getDisplaySender(sender, t) {
  if (sender === 'Admin') return t('inboxPage.admin')
  if (sender === 'System Auto') return t('inboxPage.systemAuto')
  return sender
}

function MailCard({ mail, onOpen, onClaim }) {
  const { language, t } = useDisplayTranslation()
  const displayTime = formatDisplayMailTime(
    mail.raw?.created_at,
    language,
    t
  )

  return (
    <button
      type="button"
      onClick={() => onOpen(mail.id)}
      className="flex w-full gap-3 rounded-[20px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99] dark:bg-[#171923] dark:ring-white/10"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff7d8] text-[#d99a00] dark:bg-[#2a2414]">
        <i className={`${mail.icon} text-[15px]`} />
        {mail.unread ? (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white dark:ring-[#171923]" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827] dark:text-white">
              {mail.title}
            </div>
            <div className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7b8190] dark:text-white/55">
              {mail.message}
            </div>
          </div>
          <span className="shrink-0 text-[10.5px] font-semibold text-[#9aa1ad] dark:text-white/40">
            {displayTime}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10.5px] font-bold text-[#6b7280] dark:bg-white/10 dark:text-white/55">
              {getDisplayMailType(mail.type, t)}
            </span>
            <span className="line-clamp-1 text-[10.5px] font-semibold text-[#9aa1ad] dark:text-white/40">
              {getDisplaySender(mail.sender, t)}
            </span>
          </div>
          {mail.action ? (
            <span
              onClick={(event) => {
                event.stopPropagation()
                onClaim(mail.id)
              }}
              className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                mail.claimed
                  ? 'bg-[#eef0f4] text-[#8d94a1] dark:bg-white/10 dark:text-white/45'
                  : 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
              }`}
            >
              {mail.claimed
                ? t('inboxPage.claimed')
                : t('inboxPage.claim')}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

function MailDetailSheet({ mail, onClose, onClaim }) {
  const { language, t } = useDisplayTranslation()

  if (!mail) return null

  const displayTime = formatDisplayMailTime(
    mail.raw?.created_at,
    language,
    t
  )

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label={t('inboxPage.closeMailDetail')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-y-auto rounded-t-[26px] bg-white px-4 pb-6 pt-4 shadow-2xl dark:bg-[#12141d] md:bottom-auto md:left-1/2 md:top-20 md:w-[420px] md:-translate-x-1/2 md:rounded-[24px]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden dark:bg-white/15" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff7d8] text-[#d99a00] dark:bg-[#2a2414]">
              <i className={`${mail.icon} text-[15px]`} />
            </div>
            <div className="min-w-0">
              <div className="line-clamp-1 text-[12px] font-bold text-[#8d94a1] dark:text-white/45">
                {getDisplayMailType(mail.type, t)} · {getDisplaySender(mail.sender, t)}
              </div>
              <h2 className="mt-0.5 text-[17px] font-extrabold leading-6 text-[#111827] dark:text-white">
                {mail.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#555] dark:bg-white/10 dark:text-white/70"
          >
            <i className="fa-solid fa-times text-[13px]" />
          </button>
        </div>

        <div className="rounded-[20px] bg-[#f8f8fb] p-4 text-[13px] leading-6 text-[#606776] dark:bg-white/5 dark:text-white/65">
          {mail.detail}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[18px] bg-[#fafafe] px-4 py-3 dark:bg-white/5">
          <span className="text-[12px] font-bold text-[#8d94a1] dark:text-white/45">
            {t('inboxPage.received')}
          </span>
          <span className="text-[12px] font-extrabold text-[#111827] dark:text-white">
            {displayTime}
          </span>
        </div>

        {mail.action ? (
          <button
            type="button"
            onClick={() => onClaim(mail.id)}
            disabled={mail.claimed}
            className={`mt-4 flex h-12 w-full items-center justify-center rounded-2xl text-[14px] font-extrabold active:scale-[0.99] ${
              mail.claimed
                ? 'bg-[#eef0f4] text-[#8d94a1] dark:bg-white/10 dark:text-white/45'
                : 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
            }`}
          >
            {mail.claimed
              ? t('inboxPage.claimed')
              : t('inboxPage.claim')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default function InboxPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const requestIdRef = useRef(0)
  const [activeTab, setActiveTab] = useState('all')
  const [mails, setMails] = useState([])
  const [selectedMailId, setSelectedMailId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [errorText, setErrorText] = useState('')

  const selectedMail =
    mails.find((mail) => mail.id === selectedMailId) || null

  const activeApiType = useMemo(() => {
    return TABS.find((tab) => tab.key === activeTab)?.apiType || 'all'
  }, [activeTab])

  useEffect(() => {
    let ignore = false
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    async function loadMails() {
      const token = getReaderToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setLoadingMore(false)
        setErrorText('')
        setSelectedMailId(null)
        setPage(1)
        setHasMore(false)

        const params = new URLSearchParams({
          type: activeApiType,
          page: '1',
          limit: String(MAIL_PAGE_SIZE),
          include_counts: 'false',
        })

        const response = await fetch(
          `${API_BASE_URL}/api/mails?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
          }
        )

        const data = await response.json().catch(() => ({}))

        if (response.status === 401 || response.status === 403) {
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || t('inboxPage.loadFailed'))
        }

        if (!ignore && requestIdRef.current === requestId) {
          const nextMails = (data.mails || []).map(normalizeMail)
          setMails(nextMails)
          setPage(Number(data.page || 1))
          setHasMore(
            typeof data.has_more === 'boolean'
              ? data.has_more
              : nextMails.length === MAIL_PAGE_SIZE
          )
        }
      } catch (error) {
        if (!ignore && requestIdRef.current === requestId) {
          setErrorText(error.message || t('inboxPage.loadFailed'))
          setMails([])
          setHasMore(false)
        }
      } finally {
        if (!ignore && requestIdRef.current === requestId) {
          setLoading(false)
        }
      }
    }

    loadMails()

    return () => {
      ignore = true
    }
  }, [activeApiType, navigate])

  const handleLoadMore = async () => {
    if (loading || loadingMore || !hasMore) return

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    const requestId = requestIdRef.current
    const nextPage = page + 1

    try {
      setLoadingMore(true)
      setErrorText('')

      const params = new URLSearchParams({
        type: activeApiType,
        page: String(nextPage),
        limit: String(MAIL_PAGE_SIZE),
        include_counts: 'false',
      })

      const response = await fetch(
        `${API_BASE_URL}/api/mails?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || t('inboxPage.loadFailed'))
      }

      if (requestIdRef.current !== requestId) return

      const incoming = (data.mails || []).map(normalizeMail)
      setMails((items) => mergeUniqueMails(items, incoming))
      setPage(Number(data.page || nextPage))
      setHasMore(
        typeof data.has_more === 'boolean'
          ? data.has_more
          : incoming.length === MAIL_PAGE_SIZE
      )
    } catch (error) {
      if (requestIdRef.current === requestId) {
        setErrorText(error.message || t('inboxPage.loadFailed'))
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoadingMore(false)
      }
    }
  }

  const updateMail = (mailId, nextRawMail) => {
    setMails((items) =>
      items.map((mail) =>
        mail.id === mailId ? normalizeMail(nextRawMail) : mail
      )
    )
  }

  const handleOpenMail = async (mailId) => {
    setSelectedMailId(mailId)

    const currentMail = mails.find((mail) => mail.id === mailId)
    if (!currentMail || !currentMail.unread) return

    const token = getReaderToken()
    if (!token) return

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mails/${mailId}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.ok && data.mail) {
        updateMail(mailId, data.mail)
      }
    } catch {
      setMails((items) =>
        items.map((mail) =>
          mail.id === mailId ? { ...mail, unread: false } : mail
        )
      )
    }
  }

  const handleClaim = async (mailId) => {
    const currentMail = mails.find((mail) => mail.id === mailId)
    if (!currentMail || currentMail.claimed) return

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mails/${mailId}/claim`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(data.message || t('inboxPage.claimFailed'))
      }

      if (data.mail) {
        updateMail(mailId, data.mail)
      }
    } catch (error) {
      setErrorText(error.message || t('inboxPage.claimFailed'))
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 pb-[110px] pt-4 dark:bg-[#0d0f16]">
      <MailDetailSheet
        mail={selectedMail}
        onClose={() => setSelectedMailId(null)}
        onClaim={handleClaim}
      />

      <main className="mx-auto max-w-[680px]">
        <header className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95 dark:bg-[#171923] dark:text-white dark:ring-white/10"
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <div className="min-w-0 flex-1 pr-10 text-center">
            <h1 className="text-[20px] font-extrabold text-[#111827] dark:text-white">
              {t('inboxPage.inbox')}
            </h1>
            <p className="mt-0.5 text-[12px] text-[#8d94a1] dark:text-white/50">
              {t('inboxPage.subtitle')}
            </p>
          </div>
        </header>

        <section className="mb-4 overflow-x-auto">
          <div className="flex w-max min-w-full gap-2 rounded-[18px] bg-white p-1.5 shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[14px] px-4 py-2 text-[12px] font-extrabold ${
                  tab.key === activeTab
                    ? 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
                    : 'text-[#8d94a1] dark:text-white/50'
                }`}
              >
                {t(`inboxPage.${TAB_LABEL_KEYS[tab.key]}`)}
              </button>
            ))}
          </div>
        </section>

        {errorText ? (
          <div className="mb-3 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-semibold text-[#e5484d] dark:bg-[#3a1f25]">
            {errorText}
          </div>
        ) : null}

        {loading ? (
          <section className="rounded-[24px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827] dark:border-white/10 dark:border-t-[#f6b800]" />
            <div className="text-[14px] font-extrabold text-[#111827] dark:text-white">
              {t('inboxPage.loadingMails')}
            </div>
          </section>
        ) : mails.length ? (
          <section className="space-y-3">
            {mails.map((mail) => (
              <MailCard
                key={mail.id}
                mail={mail}
                onOpen={handleOpenMail}
                onClaim={handleClaim}
              />
            ))}

            {hasMore ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex h-12 w-full items-center justify-center rounded-[18px] bg-white text-[12px] font-extrabold text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-[0.99] disabled:opacity-60 dark:bg-[#171923] dark:text-white dark:ring-white/10"
              >
                {loadingMore
                  ? t('inboxPage.loadingMore')
                  : t('inboxPage.loadMore')}
              </button>
            ) : null}
          </section>
        ) : (
          <section className="rounded-[24px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#8d94a1] dark:bg-white/10 dark:text-white/50">
              <i className="far fa-envelope-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[16px] font-extrabold text-[#111827] dark:text-white">
              {t('inboxPage.noMail')}
            </h2>
            <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-5 text-[#8d94a1] dark:text-white/50">
              {t('inboxPage.noMailBody')}
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { SurfaceCard } from '../../components/common/PagePrimitives'
import { getDisplayLanguageId } from '../../utils/displayLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MAX_ENTRIES = 10000
const RESULT_LIMIT = 20
const SEARCH_DELAY_MS = 400
const ACTIVE_GAME_KEY = 'shadow_spin_active_game_v1'
const PENDING_START_KEY = 'shadow_spin_pending_start_v1'
const MANUAL_USAGE_KEY = 'shadow_spin_manual_usage_v1'
const SHARED_GAME_USAGE_KEY = 'shadow_spin_shared_game_usage_v1'
const MANUAL_DAILY_LIMIT = 100
const SHARED_COOLDOWN_EVERY = 10
const SHARED_COOLDOWN_MS = 2 * 60 * 1000
const SEARCH_CACHE = new Map()

const SOURCE_META = {
  manual: {
    icon: 'fa-solid fa-keyboard',
    labelKey: 'manual',
    daily_limit: 100,
    cost_currency: null,
    cost_amount: 0,
  },
  reader: {
    icon: 'fa-solid fa-user',
    labelKey: 'reader',
    daily_limit: 20,
    cost_currency: 'coin',
    cost_amount: 100,
  },
  book: {
    icon: 'fa-solid fa-book-open',
    labelKey: 'book',
    daily_limit: 20,
    cost_currency: 'coin',
    cost_amount: 100,
  },
  author: {
    icon: 'fa-solid fa-feather-pointed',
    labelKey: 'author',
    daily_limit: 100,
    cost_currency: 'diamond',
    cost_amount: 10,
  },
}

const COPY = {
  en: {
    start: 'Start Game',
    newGame: 'New Game',
    current: 'Current Game',
    remaining: 'remaining today',
    free: 'Free',
    starting: 'Starting...',
    choose: 'Choose one source and start a game. Spins inside the game are unlimited.',
    rule: 'Only starting a New Game counts toward the daily limit or charges currency. Spinning does not count.',
    searchHint: '2+ characters • max 20 results',
    searchesLeft: 'searches left',
    signIn: 'Sign in before starting a game.',
    network: 'Could not reach the server. Try again.',
    expired: 'This game session expired. Start a new game.',
    cooldown: 'Please wait before starting another game.',
    manualLimit: 'Manual daily game limit reached.',
  },
  km: {
    start: 'ចាប់ផ្តើម Game',
    newGame: 'Game ថ្មី',
    current: 'Game បច្ចុប្បន្ន',
    remaining: 'នៅសល់ថ្ងៃនេះ',
    free: 'Free',
    starting: 'កំពុងចាប់ផ្តើម...',
    choose: 'ជ្រើសប្រភេទមួយ ហើយចាប់ផ្តើម Game។ ការបង្វិលក្នុង Game គឺ Unlimited។',
    rule: 'រាប់ Limit ឬកាត់លុយ តែពេលចាប់ផ្តើម New Game ប៉ុណ្ណោះ។ ការបង្វិលមិនរាប់ទេ។',
    searchHint: 'វាយចាប់ពី 2 តួ • អតិបរមា 20 លទ្ធផល',
    searchesLeft: 'Search នៅសល់',
    signIn: 'សូម Login មុនចាប់ផ្តើម Game។',
    network: 'មិនអាចភ្ជាប់ Server បាន។ សូមសាកម្តងទៀត។',
    expired: 'Game session នេះផុតកំណត់ហើយ។ សូមចាប់ផ្តើម Game ថ្មី។',
    cooldown: 'សូមរង់ចាំសិន មុនចាប់ផ្តើម Game ថ្មី។',
    manualLimit: 'Manual Game ដល់កំណត់ប្រចាំថ្ងៃហើយ។',
  },
  zh: {
    start: '开始游戏',
    newGame: '新游戏',
    current: '当前游戏',
    remaining: '今日剩余',
    free: '免费',
    starting: '正在开始...',
    choose: '选择一个来源并开始游戏。游戏内旋转不限次数。',
    rule: '只有开始新游戏才计入每日限制或扣除货币。旋转不计数。',
    searchHint: '至少 2 个字符 • 最多 20 个结果',
    searchesLeft: '剩余搜索',
    signIn: '请先登录再开始游戏。',
    network: '无法连接服务器，请重试。',
    expired: '此游戏会话已过期，请开始新游戏。',
    cooldown: '请稍候再开始新游戏。',
    manualLimit: 'Manual 游戏已达到每日上限。',
  },
  ja: {
    start: 'ゲーム開始',
    newGame: '新しいゲーム',
    current: '現在のゲーム',
    remaining: '本日の残り',
    free: '無料',
    starting: '開始中...',
    choose: '1つのソースを選んでゲームを開始してください。ゲーム内のスピン回数は無制限です。',
    rule: '新しいゲームを開始した時だけ日次上限や通貨消費にカウントされます。スピンはカウントされません。',
    searchHint: '2文字以上 • 最大20件',
    searchesLeft: '検索残り',
    signIn: 'ゲームを開始する前にログインしてください。',
    network: 'サーバーに接続できません。もう一度お試しください。',
    expired: 'ゲームセッションの期限が切れました。新しいゲームを開始してください。',
    cooldown: '新しいゲームを開始する前に少しお待ちください。',
    manualLimit: 'Manualゲームは1日の上限に達しました。',
  },
  ko: {
    start: '게임 시작',
    newGame: '새 게임',
    current: '현재 게임',
    remaining: '오늘 남은 횟수',
    free: '무료',
    starting: '시작 중...',
    choose: '하나의 소스를 선택해 게임을 시작하세요. 게임 안의 스핀 횟수는 무제한입니다.',
    rule: '새 게임을 시작할 때만 일일 한도 또는 재화가 차감됩니다. 스핀은 계산되지 않습니다.',
    searchHint: '2자 이상 • 최대 20개 결과',
    searchesLeft: '남은 검색',
    signIn: '게임을 시작하기 전에 로그인하세요.',
    network: '서버에 연결할 수 없습니다. 다시 시도하세요.',
    expired: '게임 세션이 만료되었습니다. 새 게임을 시작하세요.',
    cooldown: '새 게임을 시작하기 전에 잠시 기다려 주세요.',
    manualLimit: 'Manual 게임의 일일 한도에 도달했습니다.',
  },
}

function uiCopy() {
  const language = getDisplayLanguageId()
  return COPY[language] || COPY.en
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getReaderUserId(token = getReaderToken()) {
  try {
    const encoded = String(token || '').split('.')[1]
    if (!encoded) return ''
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    )
    const payload = JSON.parse(atob(padded))
    return String(payload?.user_id || payload?.id || '')
  } catch {
    return ''
  }
}

function makeId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

function removeStored(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    return
  }
}

function cambodiaDayKey(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value)

  const get = (type) =>
    parts.find((part) => part.type === type)?.value || ''

  return `${get('year')}-${get('month')}-${get('day')}`
}

function readManualUsage() {
  const dayKey = cambodiaDayKey()
  const stored = readJson(MANUAL_USAGE_KEY)

  if (stored?.day_key !== dayKey) {
    return { day_key: dayKey, used: 0 }
  }

  return {
    day_key: dayKey,
    used: Math.max(
      0,
      Math.min(
        MANUAL_DAILY_LIMIT,
        Number(stored?.used || 0)
      )
    ),
  }
}

function saveManualUsage(value) {
  writeJson(MANUAL_USAGE_KEY, value)
}

function readSharedGameUsage() {
  const dayKey = cambodiaDayKey()
  const stored = readJson(SHARED_GAME_USAGE_KEY)

  if (stored?.day_key !== dayKey) {
    return {
      day_key: dayKey,
      count: 0,
      cooldown_until: 0,
      seen_ids: [],
    }
  }

  return {
    day_key: dayKey,
    count: Math.max(0, Number(stored?.count || 0)),
    cooldown_until: Math.max(
      0,
      Number(stored?.cooldown_until || 0)
    ),
    seen_ids: Array.isArray(stored?.seen_ids)
      ? stored.seen_ids.slice(-200)
      : [],
  }
}

function saveSharedGameUsage(value) {
  writeJson(SHARED_GAME_USAGE_KEY, value)
}

function localCooldownSeconds() {
  const usage = readSharedGameUsage()
  return Math.max(
    0,
    Math.ceil((usage.cooldown_until - Date.now()) / 1000)
  )
}

function recordLocalGameStart(sessionId) {
  const usage = readSharedGameUsage()
  const id = String(sessionId || '')

  if (id && usage.seen_ids.includes(id)) {
    return usage
  }

  const count = usage.count + 1
  const next = {
    ...usage,
    count,
    cooldown_until:
      count % SHARED_COOLDOWN_EVERY === 0
        ? Date.now() + SHARED_COOLDOWN_MS
        : 0,
    seen_ids: id
      ? [...usage.seen_ids, id].slice(-200)
      : usage.seen_ids,
  }

  saveSharedGameUsage(next)
  return next
}

function syncLocalSharedCount(total, startedAt = null) {
  const serverCount = Math.max(0, Number(total || 0))
  const usage = readSharedGameUsage()

  if (serverCount <= usage.count) return usage

  let cooldownUntil = usage.cooldown_until
  const startedAtMs = new Date(startedAt || 0).getTime()

  if (
    serverCount % SHARED_COOLDOWN_EVERY === 0 &&
    Number.isFinite(startedAtMs)
  ) {
    cooldownUntil = Math.max(
      cooldownUntil,
      startedAtMs + SHARED_COOLDOWN_MS
    )
  }

  const next = {
    ...usage,
    count: serverCount,
    cooldown_until: cooldownUntil,
  }

  saveSharedGameUsage(next)
  return next
}

function readActiveGame() {
  const stored = readJson(ACTIVE_GAME_KEY)
  const expiresAt = new Date(
    stored?.session?.expires_at || 0
  ).getTime()

  if (
    !stored?.session?.id ||
    !SOURCE_META[stored?.source] ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= Date.now()
  ) {
    removeStored(ACTIVE_GAME_KEY)
    return null
  }

  if (stored.source === 'manual') {
    return stored
  }

  const token = getReaderToken()
  const ownerId = getReaderUserId(token)

  if (!token || !ownerId || stored.owner_id !== ownerId) {
    removeStored(ACTIVE_GAME_KEY)
    return null
  }

  return stored
}

function saveActiveGame(game) {
  writeJson(ACTIVE_GAME_KEY, game)
}

function clearActiveGameStorage() {
  removeStored(ACTIVE_GAME_KEY)
}

function pendingRequest(source, ownerId) {
  const stored = readJson(PENDING_START_KEY)

  if (
    stored?.source === source &&
    stored?.owner_id === ownerId &&
    stored?.request_key
  ) {
    return stored
  }

  const next = {
    source,
    owner_id: ownerId,
    request_key: makeId(`spin-${source}`),
    created_at: new Date().toISOString(),
  }

  writeJson(PENDING_START_KEY, next)
  return next
}

function clearPendingRequest() {
  removeStored(PENDING_START_KEY)
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(Number(value || 0))
}

function sourceSearchType(source) {
  if (source === 'reader') return 'readers'
  if (source === 'author') return 'pages'
  if (source === 'book') return 'stories'
  return ''
}

function searchCacheKey(sessionId, type, keyword) {
  return `${sessionId}:${type}:${String(keyword || '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase()}`
}

function useProtectedSearch(source, query, activeGame, t) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (activeGame?.source !== source) {
      setRemaining(null)
      return
    }

    const limit = Number(activeGame?.session?.search_limit)
    const used = Number(activeGame?.session?.search_count || 0)

    setRemaining(
      Number.isFinite(limit) && limit > 0
        ? Math.max(0, limit - used)
        : null
    )
  }, [
    activeGame?.session?.id,
    activeGame?.session?.search_count,
    activeGame?.session?.search_limit,
    activeGame?.source,
    source,
  ])

  useEffect(() => {
    const keyword = String(query || '').trim()
    const sessionId = activeGame?.session?.id || ''

    if (
      keyword.length < 2 ||
      !sessionId ||
      activeGame?.source !== source
    ) {
      setItems([])
      setLoading(false)
      setError('')
      setErrorCode('')
      return undefined
    }

    const type = sourceSearchType(source)
    const key = searchCacheKey(sessionId, type, keyword)
    const cached = SEARCH_CACHE.get(key)

    if (cached) {
      setItems(cached)
      setLoading(false)
      setError('')
      setErrorCode('')
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const token = getReaderToken()

        if (!token) {
          throw new Error(uiCopy().signIn)
        }

        setLoading(true)
        setError('')
        setErrorCode('')

        const params = new URLSearchParams({
          q: keyword,
          type,
          limit: String(RESULT_LIMIT),
        })

        const response = await fetch(
          `${API_BASE_URL}/api/spin/sessions/${encodeURIComponent(sessionId)}/search?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data?.ok === false) {
          const requestError = new Error(
            data?.message || t('spinPage.searchFailed')
          )
          requestError.code = data?.code || ''
          throw requestError
        }

        const nextItems = Array.isArray(data?.results)
          ? data.results.slice(0, RESULT_LIMIT)
          : []

        SEARCH_CACHE.set(key, nextItems)
        setItems(nextItems)

        const remainingHeader = response.headers.get(
          'X-Spin-Search-Remaining'
        )

        if (remainingHeader !== null) {
          const headerRemaining = Number(remainingHeader)

          if (Number.isFinite(headerRemaining)) {
            setRemaining(Math.max(0, headerRemaining))
          }
        }
      } catch (searchError) {
        if (searchError?.name === 'AbortError') return
        setItems([])
        setError(searchError?.message || t('spinPage.searchFailed'))
        setErrorCode(searchError?.code || '')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, SEARCH_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [activeGame, query, source, t])

  return {
    items,
    loading,
    error,
    errorCode,
    remaining,
  }
}

function Avatar({ src, name, square = false }) {
  const initial =
    String(name || 'S').trim().slice(0, 1).toUpperCase() || 'S'

  return (
    <div
      className={`app-elevated flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden font-black ${
        square ? 'rounded-[12px]' : 'rounded-full'
      }`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-[12px] text-violet-600">{initial}</span>
      )}
    </div>
  )
}

function SearchPanel({
  source,
  query,
  setQuery,
  search,
  existingEntryKeys,
  addEntry,
  disabled,
  t,
}) {
  const copy = uiCopy()
  const type = sourceSearchType(source)

  function normalizeResult(item) {
    if (source === 'reader') {
      return {
        id: makeId('reader'),
        source_type: 'reader',
        source_id: String(item?.id || ''),
        name: item?.name || item?.username || t('spinPage.reader'),
        secondary: item?.username ? `@${item.username}` : '',
        image_url: item?.avatar_url || null,
      }
    }

    if (source === 'author') {
      return {
        id: makeId('author'),
        source_type: 'author',
        source_id: String(item?.id || ''),
        name:
          item?.page_name ||
          item?.page_username ||
          t('spinPage.author'),
        secondary: item?.page_username
          ? `@${item.page_username}`
          : '',
        image_url: item?.avatar_url || null,
      }
    }

    return {
      id: makeId('book'),
      source_type: 'book',
      source_id: String(item?.id || ''),
      name: item?.title || t('spinPage.book'),
      secondary:
        item?.author_page?.page_name ||
        item?.author_page?.page_username ||
        '',
      image_url: item?.cover_url || null,
    }
  }

  return (
    <SurfaceCard className="overflow-hidden p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-violet-500/10 text-violet-600">
          <i className={`${SOURCE_META[source].icon} text-[15px]`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="app-title text-[14px] font-black">
            {t(`spinPage.${SOURCE_META[source].labelKey}`)}
          </h3>
          <p className="app-muted mt-0.5 text-[10px]">
            {copy.searchHint}
          </p>
        </div>
        {search.remaining !== null ? (
          <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[9px] font-black text-violet-600">
            {formatNumber(search.remaining)} {copy.searchesLeft}
          </span>
        ) : null}
      </div>

      <div className="relative mt-4">
        <i className="fa-solid fa-magnifying-glass app-tertiary absolute left-3 top-1/2 -translate-y-1/2 text-[12px]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={disabled}
          placeholder={t('spinPage.searchPlaceholder')}
          className="app-input w-full rounded-[13px] border py-3 pl-9 pr-10 text-[12px] outline-none transition focus:border-violet-500"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="app-tertiary absolute right-3 top-1/2 -translate-y-1/2"
            aria-label={t('spinPage.close')}
          >
            <i className="fa-solid fa-circle-xmark text-[13px]" />
          </button>
        ) : null}
      </div>

      {query.trim().length >= 2 ? (
        <div className="mt-3 max-h-[310px] overflow-y-auto rounded-[14px] border border-[var(--shadow-border)]">
          {search.loading ? (
            <div className="app-muted flex items-center justify-center gap-2 px-3 py-6 text-[11px]">
              <i className="fa-solid fa-spinner animate-spin" />
              {t('spinPage.searching')}
            </div>
          ) : search.error ? (
            <div className="px-3 py-6 text-center text-[11px] font-semibold text-red-500">
              {search.error}
            </div>
          ) : search.items.length ? (
            <div className="divide-y divide-[var(--shadow-border)]">
              {search.items.map((item) => {
                const entry = normalizeResult(item)
                const alreadyAdded = Boolean(
                  entry.source_id &&
                    existingEntryKeys.has(
                      `${entry.source_type}:${entry.source_id}`
                    )
                )

                return (
                  <div
                    key={`${type}-${item.id}`}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    <Avatar
                      src={entry.image_url}
                      name={entry.name}
                      square={entry.source_type === 'book'}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="app-title line-clamp-1 text-[12px] font-extrabold">
                        {entry.name}
                      </div>
                      {entry.secondary ? (
                        <div className="app-muted mt-0.5 truncate text-[10px]">
                          {entry.secondary}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => addEntry(entry)}
                      disabled={alreadyAdded || disabled}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                        alreadyAdded
                          ? 'app-elevated app-muted'
                          : 'bg-violet-600 text-white active:scale-95'
                      }`}
                    >
                      {alreadyAdded
                        ? t('spinPage.added')
                        : t('spinPage.add')}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="app-muted px-3 py-6 text-center text-[11px]">
              {t('spinPage.noSearchResults')}
            </div>
          )}
        </div>
      ) : null}
    </SurfaceCard>
  )
}

export default function SpinGameSourcePanel({
  entries,
  manualName,
  setManualName,
  manualEntries,
  manualDuplicateCount,
  addManualEntry,
  openManualManager,
  existingEntryKeys,
  addEntry,
  isSpinning,
  onGameStarted,
  onActiveGameChange,
  t,
}) {
  const copy = uiCopy()
  const startBusyRef = useRef(false)
  const [activeGame, setActiveGame] = useState(() => readActiveGame())
  const [sessionReady, setSessionReady] = useState(false)
  const [status, setStatus] = useState(null)
  const [manualUsage, setManualUsage] = useState(
    () => readManualUsage()
  )
  const [startingSource, setStartingSource] = useState('')
  const [message, setMessage] = useState('')
  const [readerQuery, setReaderQuery] = useState('')
  const [authorQuery, setAuthorQuery] = useState('')
  const [bookQuery, setBookQuery] = useState('')

  const readerSearch = useProtectedSearch(
    'reader',
    readerQuery,
    activeGame,
    t
  )
  const authorSearch = useProtectedSearch(
    'author',
    authorQuery,
    activeGame,
    t
  )
  const bookSearch = useProtectedSearch(
    'book',
    bookQuery,
    activeGame,
    t
  )

  useEffect(() => {
    onActiveGameChange?.(
      sessionReady ? activeGame?.source || '' : ''
    )

    return () => {
      onActiveGameChange?.('')
    }
  }, [activeGame?.source, onActiveGameChange, sessionReady])

  useEffect(() => {
    const expiresAt = new Date(
      activeGame?.session?.expires_at || 0
    ).getTime()

    if (!activeGame || !Number.isFinite(expiresAt)) {
      return undefined
    }

    const remaining = expiresAt - Date.now()

    if (remaining <= 0) {
      clearActiveGameStorage()
      setActiveGame(null)
      setSessionReady(false)
      setMessage(copy.expired)
      return undefined
    }

    const timer = window.setTimeout(() => {
      clearActiveGameStorage()
      setActiveGame(null)
      setSessionReady(false)
      setMessage(copy.expired)
    }, Math.min(remaining + 250, 2147483647))

    return () => window.clearTimeout(timer)
  }, [activeGame, copy.expired])

  useEffect(() => {
    const invalidCodes = new Set([
      'SPIN_SESSION_NOT_FOUND',
      'SPIN_SESSION_EXPIRED',
    ])

    if (
      invalidCodes.has(readerSearch.errorCode) ||
      invalidCodes.has(authorSearch.errorCode) ||
      invalidCodes.has(bookSearch.errorCode)
    ) {
      clearActiveGameStorage()
      setActiveGame(null)
      setSessionReady(false)
      setMessage(copy.expired)
    }
  }, [
    authorSearch.errorCode,
    bookSearch.errorCode,
    copy.expired,
    readerSearch.errorCode,
  ])

  useEffect(() => {
    const localGame = readActiveGame()
    const token = getReaderToken()
    const ownerId = getReaderUserId(token)

    setManualUsage(readManualUsage())

    if (localGame?.source === 'manual') {
      setActiveGame(localGame)
      setSessionReady(true)
    }

    if (!token || !ownerId) {
      setStatus(null)

      if (localGame?.source !== 'manual') {
        clearActiveGameStorage()
        setActiveGame(null)
        setSessionReady(false)
      }

      return undefined
    }

    let active = true
    const controller = new AbortController()

    async function loadStatus() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/spin/sessions/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (
          active &&
          response.ok &&
          data?.ok !== false
        ) {
          setStatus(data)

          const serverSession = data?.active_session
          syncLocalSharedCount(
            data?.usage?.total,
            serverSession?.started_at
          )

          if (localGame?.source === 'manual') {
            return
          }

          if (
            serverSession?.id &&
            SOURCE_META[serverSession?.mode] &&
            serverSession.mode !== 'manual'
          ) {
            const nextGame = {
              source: serverSession.mode,
              owner_id: ownerId,
              session: serverSession,
              saved_at: new Date().toISOString(),
            }

            saveActiveGame(nextGame)
            setActiveGame(nextGame)
            setSessionReady(true)
          } else {
            clearActiveGameStorage()
            setActiveGame(null)
            setSessionReady(false)
          }
        }
      } catch (error) {
        if (error?.name !== 'AbortError' && active) {
          if (localGame?.source !== 'manual') {
            setSessionReady(false)
            setMessage(copy.network)
          }
        }
      }
    }

    void loadStatus()

    return () => {
      active = false
      controller.abort()
    }
  }, [copy.network])

  async function startGame(source) {
    if (
      startBusyRef.current ||
      startingSource ||
      isSpinning ||
      !SOURCE_META[source]
    ) {
      return
    }

    const waitSeconds = localCooldownSeconds()

    if (waitSeconds > 0) {
      setMessage(
        `${copy.cooldown} • ${formatNumber(waitSeconds)}s`
      )
      return
    }

    startBusyRef.current = true
    setStartingSource(source)
    setMessage('')

    if (source === 'manual') {
      try {
        const usage = readManualUsage()

        if (usage.used >= MANUAL_DAILY_LIMIT) {
          setManualUsage(usage)
          setMessage(copy.manualLimit)
          return
        }

        const startedAt = new Date()
        const sessionId = makeId('manual-game')
        const nextUsage = {
          ...usage,
          used: usage.used + 1,
        }
        const nextGame = {
          source: 'manual',
          owner_id: 'local',
          session: {
            id: sessionId,
            mode: 'manual',
            cost_currency: null,
            cost_amount: 0,
            search_count: 0,
            search_limit: 0,
            started_at: startedAt.toISOString(),
            expires_at: new Date(
              startedAt.getTime() + 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          saved_at: startedAt.toISOString(),
        }

        saveManualUsage(nextUsage)
        recordLocalGameStart(sessionId)
        saveActiveGame(nextGame)
        setManualUsage(nextUsage)
        setActiveGame(nextGame)
        setSessionReady(true)
        setReaderQuery('')
        setAuthorQuery('')
        setBookQuery('')
        onGameStarted?.('manual')
      } finally {
        startBusyRef.current = false
        setStartingSource('')
      }

      return
    }

    const token = getReaderToken()
    const ownerId = getReaderUserId(token)

    if (!token || !ownerId) {
      startBusyRef.current = false
      setStartingSource('')
      setMessage(copy.signIn)
      return
    }

    const pending = pendingRequest(source, ownerId)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/spin/sessions/start`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          body: JSON.stringify({
            mode: source,
            request_key: pending.request_key,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data?.ok === false) {
        if (response.status < 500) {
          clearPendingRequest()
        }

        if (data?.status) {
          setStatus(data.status)
        }

        setMessage(data?.message || copy.network)
        return
      }

      const nextGame = {
        source,
        owner_id: ownerId,
        session: data.session,
        saved_at: new Date().toISOString(),
      }

      recordLocalGameStart(data?.session?.id)
      saveActiveGame(nextGame)
      clearPendingRequest()
      setActiveGame(nextGame)
      setSessionReady(true)

      if (data?.status) {
        setStatus(data.status)
      }

      setReaderQuery('')
      setAuthorQuery('')
      setBookQuery('')
      onGameStarted?.(source)
    } catch {
      setMessage(copy.network)
    } finally {
      startBusyRef.current = false
      setStartingSource('')
    }
  }

  function ruleFor(source) {
    if (source === 'manual') {
      return SOURCE_META.manual
    }

    return status?.rules?.[source] || SOURCE_META[source]
  }

  function usageFor(source) {
    if (source === 'manual') {
      return {
        used: manualUsage.used,
        limit: MANUAL_DAILY_LIMIT,
        remaining: Math.max(
          0,
          MANUAL_DAILY_LIMIT - manualUsage.used
        ),
      }
    }

    const rule = ruleFor(source)
    return (
      status?.usage?.[source] || {
        used: 0,
        limit: rule.daily_limit,
        remaining: rule.daily_limit,
      }
    )
  }

  function priceFor(source) {
    const rule = ruleFor(source)
    const amount = Number(rule?.cost_amount || 0)

    if (!amount) return copy.free

    const currency =
      rule?.cost_currency === 'diamond'
        ? t('spinPage.diamond')
        : t('spinPage.coin')

    return `${formatNumber(amount)} ${currency}`
  }

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="app-title text-[16px] font-black">
            {t('spinPage.addEntries')}
          </h2>
          <p className="app-muted mt-1 text-[10.5px]">
            {copy.choose}
          </p>
        </div>
        <div className="app-muted text-[10px] font-bold">
          {t('spinPage.entriesCount', {
            count: formatNumber(entries.length),
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.keys(SOURCE_META).map((source) => {
          const meta = SOURCE_META[source]
          const usage = usageFor(source)
          const current =
            sessionReady && activeGame?.source === source
          const busy = startingSource === source
          const noRemaining = Number(usage?.remaining || 0) <= 0

          return (
            <SurfaceCard
              key={source}
              className={`p-3 ${
                current
                  ? 'border-violet-500/50 bg-violet-500/5'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-violet-500/10 text-violet-600">
                  <i className={`${meta.icon} text-[13px]`} />
                </div>
                <div className="min-w-0">
                  <div className="app-title truncate text-[11px] font-black">
                    {t(`spinPage.${meta.labelKey}`)}
                  </div>
                  <div className="mt-0.5 text-[9px] font-extrabold text-violet-600">
                    {priceFor(source)}
                  </div>
                </div>
              </div>

              <div className="app-muted mt-3 text-[9px] font-bold">
                {formatNumber(usage?.remaining)} /{' '}
                {formatNumber(usage?.limit || meta.daily_limit)}{' '}
                {copy.remaining}
              </div>

              <button
                type="button"
                onClick={() => void startGame(source)}
                disabled={
                  Boolean(startingSource) ||
                  isSpinning ||
                  noRemaining
                }
                className={`mt-2 w-full rounded-[10px] px-2 py-2 text-[9.5px] font-black text-white disabled:opacity-45 ${
                  current
                    ? 'bg-fuchsia-600'
                    : 'bg-violet-600'
                }`}
              >
                {busy
                  ? copy.starting
                  : current
                    ? copy.newGame
                    : copy.start}
              </button>

              {current ? (
                <div className="mt-2 text-center text-[8.5px] font-black text-fuchsia-500">
                  {copy.current}
                </div>
              ) : null}
            </SurfaceCard>
          )
        })}
      </div>

      <div className="mt-3 rounded-[12px] bg-violet-500/10 px-3 py-2.5 text-[9.5px] font-semibold leading-4 text-violet-700 dark:text-violet-300">
        {copy.rule}
      </div>

      {message ? (
        <div className="mt-3 rounded-[12px] bg-amber-500/10 px-3 py-2.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
          {message}
        </div>
      ) : null}

      <div className="mt-3">
        {!activeGame ? (
          <SurfaceCard className="p-5 text-center">
            <div className="app-muted text-[11px]">
              {copy.choose}
            </div>
          </SurfaceCard>
        ) : activeGame.source === 'manual' ? (
          <SurfaceCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-amber-500/10 text-amber-500">
                <i className="fa-solid fa-keyboard text-[15px]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="app-title text-[14px] font-black">
                  {t('spinPage.manual')}
                </h3>
                <p className="app-muted mt-0.5 text-[10.5px]">
                  {t('spinPage.manualSummary', {
                    count: formatNumber(manualEntries.length),
                  })}
                </p>
              </div>
              {manualDuplicateCount ? (
                <button
                  type="button"
                  onClick={openManualManager}
                  disabled={isSpinning}
                  className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1.5 text-[9px] font-extrabold text-amber-600 dark:text-amber-300"
                >
                  <i className="fa-solid fa-triangle-exclamation mr-1" />
                  {formatNumber(manualDuplicateCount)}
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={manualName}
                onChange={(event) => setManualName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') addManualEntry()
                }}
                disabled={
                  isSpinning ||
                  entries.length >= MAX_ENTRIES
                }
                placeholder={t('spinPage.manualPlaceholder')}
                maxLength={120}
                className="app-input min-w-0 flex-1 rounded-[13px] border px-3 py-3 text-[12px] outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={addManualEntry}
                disabled={
                  !manualName.trim() ||
                  isSpinning ||
                  entries.length >= MAX_ENTRIES
                }
                className="rounded-[13px] bg-violet-600 px-4 py-3 text-[11px] font-extrabold text-white active:scale-95 disabled:opacity-45"
              >
                {t('spinPage.add')}
              </button>
            </div>

            <button
              type="button"
              onClick={openManualManager}
              disabled={isSpinning}
              className="app-elevated mt-3 flex w-full items-center justify-center gap-2 rounded-[13px] px-4 py-3 text-[10.5px] font-extrabold disabled:opacity-45"
            >
              <i className="fa-solid fa-list-check text-violet-500" />
              {t('spinPage.manageNames')}
              <span className="app-muted">
                • {formatNumber(manualEntries.length)}
              </span>
            </button>
          </SurfaceCard>
        ) : activeGame.source === 'reader' ? (
          <SearchPanel
            source="reader"
            query={readerQuery}
            setQuery={setReaderQuery}
            search={readerSearch}
            existingEntryKeys={existingEntryKeys}
            addEntry={addEntry}
            disabled={
              isSpinning ||
              entries.length >= MAX_ENTRIES
            }
            t={t}
          />
        ) : activeGame.source === 'author' ? (
          <SearchPanel
            source="author"
            query={authorQuery}
            setQuery={setAuthorQuery}
            search={authorSearch}
            existingEntryKeys={existingEntryKeys}
            addEntry={addEntry}
            disabled={
              isSpinning ||
              entries.length >= MAX_ENTRIES
            }
            t={t}
          />
        ) : (
          <SearchPanel
            source="book"
            query={bookQuery}
            setQuery={setBookQuery}
            search={bookSearch}
            existingEntryKeys={existingEntryKeys}
            addEntry={addEntry}
            disabled={
              isSpinning ||
              entries.length >= MAX_ENTRIES
            }
            t={t}
          />
        )}
      </div>
    </section>
  )
}

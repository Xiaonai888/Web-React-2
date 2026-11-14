import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Ban, RefreshCw, Search, X } from 'lucide-react'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderToken } from '../../services/chatApi'
import {
  changeReaderBlockedAccount,
  getReaderBlockedAccounts,
  searchReaderBlockTargets,
} from '../../services/readerBlockApi'
import ReaderBlockAvatar from '../../components/reader-profile/ReaderBlockAvatar'
import ReaderBlockConfirmModal from '../../components/reader-profile/ReaderBlockConfirmModal'

registerTranslationNamespace('readerBlockedAccounts', {
  en: {
    title: 'Blocked', readers: 'Blocked Readers', pages: 'Blocked Pages',
    back: 'Back to Settings', searchReader: 'Name, @username or profile link',
    searchPage: 'Page name, @username or page link', results: 'Search results',
    blockedCount: '{{count}} blocked', emptyReaders: 'No blocked readers yet',
    emptyPages: 'No blocked pages yet', block: 'Block', unblock: 'Unblock',
    blockTitle: 'Block {{name}}?', unblockTitle: 'Unblock {{name}}?',
    blockQuestion: 'Are you sure you want to block {{name}}?',
    unblockQuestion: 'Are you sure you want to unblock {{name}}?',
    cancel: 'Cancel', saving: 'Please wait...', loading: 'Loading...',
    searching: 'Searching...', loadMore: 'Load 10 more', refresh: 'Refresh',
    listFailed: 'Could not load blocked accounts.', searchFailed: 'Search is temporarily unavailable.',
    actionFailed: 'Could not update this block.', tryAgain: 'Try again',
    blockDone: '{{name}} has been blocked.', unblockDone: '{{name}} has been unblocked.',
  },
  km: {
    title: 'គណនីដែលបាន Block', readers: 'Blocked Readers', pages: 'Blocked Pages',
    back: 'ត្រឡប់ទៅការកំណត់', searchReader: 'ឈ្មោះ, @Username ឬ Profile Link',
    searchPage: 'ឈ្មោះ Page, @Username ឬ Page Link', results: 'លទ្ធផលស្វែងរក',
    blockedCount: 'បាន Block {{count}}', emptyReaders: 'មិនទាន់មានអ្នកអានដែលបាន Block',
    emptyPages: 'មិនទាន់មាន Page ដែលបាន Block', block: 'Block', unblock: 'Unblock',
    blockTitle: 'Block {{name}}?', unblockTitle: 'Unblock {{name}}?',
    blockQuestion: 'តើអ្នកពិតជាចង់ Block {{name}} មែនទេ?',
    unblockQuestion: 'តើអ្នកពិតជាចង់ Unblock {{name}} មែនទេ?',
    cancel: 'បោះបង់', saving: 'សូមរង់ចាំ...', loading: 'កំពុងផ្ទុក...',
    searching: 'កំពុងស្វែងរក...', loadMore: 'បង្ហាញ ១០ ទៀត', refresh: 'ផ្ទុកឡើងវិញ',
    listFailed: 'មិនអាចផ្ទុកបញ្ជី Block បានទេ។', searchFailed: 'មិនអាចស្វែងរកបាននៅពេលនេះ។',
    actionFailed: 'មិនអាចកែស្ថានភាព Block បានទេ។', tryAgain: 'ព្យាយាមម្ដងទៀត',
    blockDone: 'បាន Block {{name}}។', unblockDone: 'បាន Unblock {{name}}។',
  },
  zh: {
    title: '已屏蔽账号', readers: '已屏蔽读者', pages: '已屏蔽主页',
    back: '返回设置', searchReader: '姓名、@用户名或个人资料链接',
    searchPage: '主页名称、@用户名或主页链接', results: '搜索结果',
    blockedCount: '已屏蔽 {{count}} 个', emptyReaders: '没有已屏蔽的读者',
    emptyPages: '没有已屏蔽的主页', block: '屏蔽', unblock: '取消屏蔽',
    blockTitle: '屏蔽 {{name}}？', unblockTitle: '取消屏蔽 {{name}}？',
    blockQuestion: '确定要屏蔽 {{name}} 吗？',
    unblockQuestion: '确定要取消屏蔽 {{name}} 吗？',
    cancel: '取消', saving: '请稍候...', loading: '加载中...',
    searching: '搜索中...', loadMore: '再加载 10 个', refresh: '刷新',
    listFailed: '无法加载已屏蔽的账号。', searchFailed: '暂时无法搜索。',
    actionFailed: '无法更新屏蔽状态。', tryAgain: '重试',
    blockDone: '已屏蔽 {{name}}。', unblockDone: '已取消屏蔽 {{name}}。',
  },
  ja: {
    title: 'ブロックしたアカウント', readers: 'ブロックした読者', pages: 'ブロックしたページ',
    back: '設定に戻る', searchReader: '名前、@ユーザー名、プロフィールリンク',
    searchPage: 'ページ名、@ユーザー名、ページリンク', results: '検索結果',
    blockedCount: '{{count}} 件ブロック中', emptyReaders: 'ブロックした読者はいません',
    emptyPages: 'ブロックしたページはありません', block: 'ブロック', unblock: '解除',
    blockTitle: '{{name}} をブロックしますか？', unblockTitle: '{{name}} のブロックを解除しますか？',
    blockQuestion: '{{name}} をブロックしてもよろしいですか？',
    unblockQuestion: '{{name}} のブロックを解除してもよろしいですか？',
    cancel: 'キャンセル', saving: 'お待ちください...', loading: '読み込み中...',
    searching: '検索中...', loadMore: 'さらに10件', refresh: '更新',
    listFailed: 'ブロック一覧を読み込めません。', searchFailed: '現在検索できません。',
    actionFailed: 'ブロック状態を更新できません。', tryAgain: '再試行',
    blockDone: '{{name}} をブロックしました。', unblockDone: '{{name}} のブロックを解除しました。',
  },
  ko: {
    title: '차단한 계정', readers: '차단한 독자', pages: '차단한 페이지',
    back: '설정으로 돌아가기', searchReader: '이름, @사용자명 또는 프로필 링크',
    searchPage: '페이지 이름, @사용자명 또는 페이지 링크', results: '검색 결과',
    blockedCount: '{{count}}개 차단됨', emptyReaders: '차단한 독자가 없습니다',
    emptyPages: '차단한 페이지가 없습니다', block: '차단', unblock: '차단 해제',
    blockTitle: '{{name}} 차단?', unblockTitle: '{{name}} 차단 해제?',
    blockQuestion: '{{name}}을(를) 차단하시겠습니까?',
    unblockQuestion: '{{name}}의 차단을 해제하시겠습니까?',
    cancel: '취소', saving: '잠시 기다려 주세요...', loading: '불러오는 중...',
    searching: '검색 중...', loadMore: '10개 더 보기', refresh: '새로고침',
    listFailed: '차단 목록을 불러오지 못했습니다.', searchFailed: '현재 검색할 수 없습니다.',
    actionFailed: '차단 상태를 변경할 수 없습니다.', tryAgain: '다시 시도',
    blockDone: '{{name}} 차단됨', unblockDone: '{{name}} 차단 해제됨',
  },
})

function blockedResultId(item) {
  return String(item?.id || '')
}

function AccountRow({ account, action, onAction }) {
  const displayName = account.name || account.page_name || account.username || account.page_username || ''
  const username = account.username || account.page_username || ''

  return (
    <div className="flex min-h-[66px] items-center gap-3 border-b border-[var(--shadow-border)] px-1 py-3 last:border-0">
      <ReaderBlockAvatar name={displayName} src={account.avatar_url} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-[var(--shadow-text-primary)]">{displayName}</div>
        {username ? <div className="mt-1 truncate text-[12px] text-[var(--shadow-text-secondary)]">@{username.replace(/^@/, '')}</div> : null}
      </div>
      <button
        type="button"
        onClick={() => onAction(account)}
        className="shrink-0 rounded-full border border-[var(--shadow-border)] px-3 py-2 text-[12px] font-medium text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
      >
        {action}
      </button>
    </div>
  )
}

export default function ReaderBlockedAccountsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [type, setType] = useState('reader')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [blockedRows, setBlockedRows] = useState([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [listError, setListError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [confirmation, setConfirmation] = useState(null)
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const cacheRef = useRef({ reader: null, page: null })
  const listRequestRef = useRef(0)
  const searchRequestRef = useRef(0)
  const activeTypeRef = useRef(type)
  const moreRequestRef = useRef(null)
  activeTypeRef.current = type

  useEffect(() => {
    if (!getReaderToken()) navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const requestId = ++listRequestRef.current
    const controller = new AbortController()
    const cached = cacheRef.current[type]
    if (cached && Date.now() - cached.time < 45000) {
      setBlockedRows(cached.rows)
      setTotal(cached.total)
      setHasMore(cached.hasMore)
      setListError('')
      setLoading(false)
      return () => {
        listRequestRef.current += 1
      }
    }

    setLoading(true)
    setListError('')
    setBlockedRows([])
    setTotal(0)
    setHasMore(false)

    getReaderBlockedAccounts({ type, signal: controller.signal })
      .then((data) => {
        if (listRequestRef.current !== requestId) return
        const rows = Array.isArray(data.results) ? data.results : []
        const count = Number(data.total) || 0
        const more = Boolean(data.has_more)
        setBlockedRows(rows)
        setTotal(count)
        setHasMore(more)
        cacheRef.current[type] = { rows, total: count, hasMore: more, time: Date.now() }
      })
      .catch((error) => {
        if (controller.signal.aborted || listRequestRef.current !== requestId) return
        setListError(error.message || getDisplayText('readerBlockedAccounts.listFailed'))
      })
      .finally(() => {
        if (listRequestRef.current === requestId) setLoading(false)
      })

    return () => {
      controller.abort()
      listRequestRef.current += 1
    }
  }, [type, refreshKey])

  useEffect(() => {
    const requestId = ++searchRequestRef.current
    const controller = new AbortController()
    const trimmed = query.trim()
    const ready = trimmed.length >= 2
    setSearchResults([])
    setSearchError('')
    setSearching(false)
    if (!ready) return () => controller.abort()

    const timeout = window.setTimeout(() => {
      setSearching(true)
      searchReaderBlockTargets({ type, query: trimmed, signal: controller.signal })
        .then((data) => {
          if (searchRequestRef.current !== requestId) return
          setSearchResults(Array.isArray(data.results) ? data.results.slice(0, 8) : [])
        })
        .catch((error) => {
          if (controller.signal.aborted || searchRequestRef.current !== requestId) return
          setSearchError(error.message || getDisplayText('readerBlockedAccounts.searchFailed'))
        })
        .finally(() => {
          if (searchRequestRef.current === requestId) setSearching(false)
        })
    }, 400)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
      searchRequestRef.current += 1
    }
  }, [type, query])

  useEffect(() => () => moreRequestRef.current?.abort(), [])

  function switchTab(nextType) {
    if (nextType === type || busy) return
    moreRequestRef.current?.abort()
    setLoadingMore(false)
    setType(nextType)
    setQuery('')
    setSearchResults([])
    setNotice('')
    setListError('')
    setSearchError('')
    setConfirmation(null)
  }

  function refreshList() {
    if (loading || busy) return
    moreRequestRef.current?.abort()
    setLoadingMore(false)
    cacheRef.current[type] = null
    setRefreshKey((value) => value + 1)
  }

  async function loadMore() {
    if (loading || loadingMore || !hasMore) return
    const currentType = type
    const offset = blockedRows.length
    const requestId = listRequestRef.current
    const controller = new AbortController()
    moreRequestRef.current = controller
    setLoadingMore(true)
    try {
      const data = await getReaderBlockedAccounts({ type: currentType, offset, signal: controller.signal })
      if (controller.signal.aborted || activeTypeRef.current !== currentType || listRequestRef.current !== requestId) return
      const nextRows = Array.isArray(data.results) ? data.results : []
      const existing = new Set(blockedRows.map((row) => String(row.block_id || row.id)))
      const rows = [...blockedRows, ...nextRows.filter((row) => !existing.has(String(row.block_id || row.id)))]
      const count = Number(data.total) || 0
      const more = Boolean(data.has_more)
      setBlockedRows(rows)
      setTotal(count)
      setHasMore(more)
      cacheRef.current[currentType] = { rows, total: count, hasMore: more, time: Date.now() }
    } catch (error) {
      if (!controller.signal.aborted) setListError(error.message || getDisplayText('readerBlockedAccounts.listFailed'))
    } finally {
      if (moreRequestRef.current === controller) moreRequestRef.current = null
      if (activeTypeRef.current === currentType) setLoadingMore(false)
    }
  }

  function openConfirmation(account, shouldBlock) {
    setActionError('')
    setNotice('')
    setConfirmation({ account, shouldBlock, type })
  }

  async function confirmChange() {
    if (!confirmation || busy) return
    const { account, shouldBlock, type: targetType } = confirmation
    const name = account.name || account.page_name || account.username || account.page_username || ''
    setBusy(true)
    setActionError('')
    try {
      await changeReaderBlockedAccount({ type: targetType, target: account, shouldBlock })
      cacheRef.current[targetType] = null
      setConfirmation(null)
      setQuery('')
      setSearchResults([])
      setNotice(t(shouldBlock ? 'readerBlockedAccounts.blockDone' : 'readerBlockedAccounts.unblockDone', { name }))
      setRefreshKey((value) => value + 1)
    } catch (error) {
      setActionError(error.message || t('readerBlockedAccounts.actionFailed'))
    } finally {
      setBusy(false)
    }
  }

  const alreadyBlocked = new Set(blockedRows.map(blockedResultId))
  const visibleSearchResults = searchResults.filter((account) => !alreadyBlocked.has(blockedResultId(account)))

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-surface)] pb-[calc(32px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)]">
        <div className="mx-auto flex h-16 max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate('/profile/settings')} aria-label={t('readerBlockedAccounts.back')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <ArrowLeft size={21} strokeWidth={1.8} />
          </button>
          <h1 className="flex-1 text-[18px] font-semibold">{t('readerBlockedAccounts.title')}</h1>
          <button type="button" onClick={refreshList} disabled={loading} aria-label={t('readerBlockedAccounts.refresh')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)] disabled:opacity-50">
            <RefreshCw size={19} strokeWidth={1.7} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[560px] px-4 pt-5">
        <div role="tablist" aria-label={t('readerBlockedAccounts.title')} className="grid grid-cols-2 rounded-xl bg-[var(--shadow-bg-soft)] p-1">
          {['reader', 'page'].map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={type === tab}
              onClick={() => switchTab(tab)}
              className={`min-h-[42px] rounded-lg px-2 text-[13px] font-medium ${type === tab ? 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-secondary)]'}`}
            >
              {t(tab === 'reader' ? 'readerBlockedAccounts.readers' : 'readerBlockedAccounts.pages')}
            </button>
          ))}
        </div>

        <div className="relative mt-5">
          <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shadow-text-secondary)]" />
          <input
            type="search"
            inputMode="search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(type === 'reader' ? 'readerBlockedAccounts.searchReader' : 'readerBlockedAccounts.searchPage')}
            className="h-12 w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-10 pr-10 text-[13px] text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-text-tertiary)] focus:border-[#ff4d70]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label={t('readerBlockedAccounts.cancel')} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[var(--shadow-text-secondary)]">
              <X size={17} />
            </button>
          ) : null}
        </div>

        {searching ? <p className="mt-3 text-[12px] text-[var(--shadow-text-secondary)]">{t('readerBlockedAccounts.searching')}</p> : null}
        {searchError ? <p role="alert" className="mt-3 text-[12px] text-[#f43f5e]">{searchError}</p> : null}
        {visibleSearchResults.length > 0 ? (
          <section className="mt-5" aria-label={t('readerBlockedAccounts.results')}>
            <h2 className="mb-2 text-[13px] font-semibold text-[var(--shadow-text-secondary)]">{t('readerBlockedAccounts.results')}</h2>
            {visibleSearchResults.map((account) => (
              <AccountRow key={account.id} account={account} action={t('readerBlockedAccounts.block')} onAction={(item) => openConfirmation(item, true)} />
            ))}
          </section>
        ) : null}

        <section className="mt-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[14px] font-semibold">{t(type === 'reader' ? 'readerBlockedAccounts.readers' : 'readerBlockedAccounts.pages')}</h2>
            {!loading ? <span className="text-[12px] text-[var(--shadow-text-secondary)]">{t('readerBlockedAccounts.blockedCount', { count: total })}</span> : null}
          </div>

          {notice ? <p role="status" className="mt-3 rounded-lg bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px]">{notice}</p> : null}
          {listError ? (
            <div className="mt-4">
              <p role="alert" className="text-[12px] text-[#f43f5e]">{listError}</p>
              <button type="button" onClick={refreshList} className="mt-2 text-[13px] font-medium text-[#ff4d70]">{t('readerBlockedAccounts.tryAgain')}</button>
            </div>
          ) : null}
          {loading ? <p className="py-8 text-center text-[13px] text-[var(--shadow-text-secondary)]">{t('readerBlockedAccounts.loading')}</p> : null}
          {!loading && !listError && blockedRows.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-[var(--shadow-text-tertiary)]">
              <Ban size={24} strokeWidth={1.6} />
              <p className="text-[13px]">{t(type === 'reader' ? 'readerBlockedAccounts.emptyReaders' : 'readerBlockedAccounts.emptyPages')}</p>
            </div>
          ) : null}
          {!loading && blockedRows.map((account) => (
            <AccountRow key={account.block_id || account.id} account={account} action={t('readerBlockedAccounts.unblock')} onAction={(item) => openConfirmation(item, false)} />
          ))}
          {!loading && hasMore ? (
            <button type="button" disabled={loadingMore} onClick={loadMore} className="mt-4 min-h-[40px] w-full rounded-full border border-[var(--shadow-border)] text-[13px] font-medium disabled:opacity-55">
              {loadingMore ? t('readerBlockedAccounts.loading') : t('readerBlockedAccounts.loadMore')}
            </button>
          ) : null}
        </section>
      </div>

      <ReaderBlockConfirmModal
        open={Boolean(confirmation)}
        target={confirmation?.account}
        shouldBlock={confirmation?.shouldBlock}
        onConfirm={confirmChange}
        onCancel={() => { if (!busy) setConfirmation(null) }}
        busy={busy}
        error={actionError}
        t={t}
      />
    </main>
  )
}

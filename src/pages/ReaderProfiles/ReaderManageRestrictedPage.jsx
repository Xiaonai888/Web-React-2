import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Search, ShieldCheck, X } from 'lucide-react'
import { useDisplayTranslation, getDisplayLanguageId } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderToken } from '../../services/chatApi'
import { changeReaderRestriction, getRestrictedReaders, searchRestrictReaders } from '../../services/readerRestrictApi'
import ReaderBlockAvatar from '../../components/reader-profile/ReaderBlockAvatar'
import ReaderRestrictConfirmModal from '../../components/reader-profile/ReaderRestrictConfirmModal'

registerTranslationNamespace('readerManageRestrictions', {
  en: {
    title: 'Restricted Readers', back: 'Back', description: 'Manage the readers you choose to restrict. Your settings only affect those readers.',
    searchList: 'Search restricted readers...', add: 'Restrict a Reader', addTitle: 'Find a Reader',
    addDescription: 'Search by name, @username or profile link.', searchPeople: 'Name, @username or profile link',
    searchResults: 'Search results', searching: 'Searching...', searchEmpty: 'No readers found.',
    typeToSearch: 'Enter at least two characters to search.', restricted: 'Restricted', blocked: 'Blocked', unavailable: 'Unavailable',
    restrict: 'Restrict', unrestrict: 'Unrestrict', restrictedOn: 'Restricted on {{date}}',
    count: '{{count}} restricted readers', empty: 'No restricted readers yet', emptySearch: 'No matching restricted readers',
    emptyHelp: 'Use Restrict a Reader to add someone.', loading: 'Loading...', saving: 'Please wait...',
    page: '{{page}} / {{pages}}', previous: 'Previous page', next: 'Next page', retry: 'Try again',
    loadError: 'Could not load restricted readers.', searchError: 'Search is temporarily unavailable.', actionError: 'Could not update restriction.',
    restrictTitle: 'Restrict {{name}}?', unrestrictTitle: 'Unrestrict {{name}}?',
    restrictQuestion: 'Limit interactions from this reader according to the options you enabled. They will not be notified.',
    unrestrictQuestion: 'Remove the restriction for this reader? Your notification settings will not change.',
    doneRestrict: '{{name}} is now restricted.', doneUnrestrict: '{{name}} is no longer restricted.',
    cancel: 'Cancel', close: 'Close', blockedHelp: 'Blocked readers cannot be restricted until unblocked.',
  },
  km: {
    title: 'Manage Restricted Readers', back: 'ត្រឡប់ក្រោយ', description: 'គ្រប់គ្រងអ្នកអានដែលអ្នកជ្រើស Restrict។ ការកំណត់មានប្រសិទ្ធភាពតែលើអ្នកដែលអ្នកបាន Restrict។',
    searchList: 'ស្វែងរកអ្នកដែលបាន Restrict...', add: 'Restrict a Reader', addTitle: 'ស្វែងរកអ្នកអាន',
    addDescription: 'ស្វែងរកតាមឈ្មោះ @Username ឬ Profile Link។', searchPeople: 'ឈ្មោះ @Username ឬ Profile Link',
    searchResults: 'លទ្ធផលស្វែងរក', searching: 'កំពុងស្វែងរក...', searchEmpty: 'រកមិនឃើញអ្នកអាន។',
    typeToSearch: 'បញ្ចូលយ៉ាងតិច ២ តួអក្សរ។', restricted: 'បាន Restrict', blocked: 'បាន Block', unavailable: 'មិនអាចជ្រើសបាន',
    restrict: 'Restrict', unrestrict: 'Unrestrict', restrictedOn: 'បាន Restrict នៅ {{date}}',
    count: 'បាន Restrict {{count}} នាក់', empty: 'មិនទាន់មានអ្នកអានដែលបាន Restrict', emptySearch: 'រកមិនឃើញក្នុងបញ្ជី Restrict',
    emptyHelp: 'ចុច Restrict a Reader ដើម្បីបន្ថែមអ្នកអាន។', loading: 'កំពុងផ្ទុក...', saving: 'សូមរង់ចាំ...',
    page: '{{page}} / {{pages}}', previous: 'ទំព័រមុន', next: 'ទំព័របន្ទាប់', retry: 'ព្យាយាមម្ដងទៀត',
    loadError: 'មិនអាចផ្ទុកបញ្ជី Restrict បានទេ។', searchError: 'មិនអាចស្វែងរកបាននៅពេលនេះ។', actionError: 'មិនអាចផ្លាស់ប្តូរ Restrict បានទេ។',
    restrictTitle: 'Restrict {{name}}?', unrestrictTitle: 'Unrestrict {{name}}?',
    restrictQuestion: 'កំណត់អន្តរកម្មរបស់អ្នកអាននេះ តាម Switch ដែលអ្នកបានបើក។ គេមិនទទួលបានការជូនដំណឹងទេ។',
    unrestrictQuestion: 'ដក Restrict ពីអ្នកអាននេះមែនទេ? ការកំណត់ Notification របស់អ្នកនឹងនៅដដែល។',
    doneRestrict: 'បាន Restrict {{name}}។', doneUnrestrict: 'បានដក Restrict ពី {{name}}។',
    cancel: 'បោះបង់', close: 'បិទ', blockedHelp: 'អ្នកដែលបាន Block មិនអាច Restrict បានទេ លុះត្រាតែ Unblock ជាមុន។',
  },
  zh: {
    title: '管理受限读者', back: '返回', description: '管理你选择限制的读者。设置仅对这些读者生效。',
    searchList: '搜索受限读者...', add: '限制读者', addTitle: '查找读者', addDescription: '按姓名、@用户名或个人资料链接搜索。',
    searchPeople: '姓名、@用户名或个人资料链接', searchResults: '搜索结果', searching: '正在搜索...', searchEmpty: '未找到读者。',
    typeToSearch: '至少输入两个字符。', restricted: '已限制', blocked: '已屏蔽', unavailable: '不可选择', restrict: '限制', unrestrict: '取消限制',
    restrictedOn: '限制于 {{date}}', count: '已限制 {{count}} 位读者', empty: '尚无受限读者', emptySearch: '没有匹配的受限读者',
    emptyHelp: '点击限制读者开始添加。', loading: '加载中...', saving: '请稍候...', page: '{{page}} / {{pages}}', previous: '上一页', next: '下一页', retry: '重试',
    loadError: '无法加载受限读者。', searchError: '暂时无法搜索。', actionError: '无法更新限制。',
    restrictTitle: '限制 {{name}}？', unrestrictTitle: '取消限制 {{name}}？', restrictQuestion: '根据你开启的选项限制其互动。对方不会收到通知。',
    unrestrictQuestion: '取消限制？你的通知设置不会改变。', doneRestrict: '已限制 {{name}}。', doneUnrestrict: '已取消限制 {{name}}。',
    cancel: '取消', close: '关闭', blockedHelp: '已屏蔽的读者需要先解除屏蔽才能限制。',
  },
  ja: {
    title: '制限した読者を管理', back: '戻る', description: '制限した読者を管理します。設定はその読者だけに適用されます。',
    searchList: '制限した読者を検索...', add: '読者を制限', addTitle: '読者を検索', addDescription: '名前・@ユーザー名・プロフィールリンクで検索。',
    searchPeople: '名前、@ユーザー名、プロフィールリンク', searchResults: '検索結果', searching: '検索中...', searchEmpty: '読者が見つかりません。',
    typeToSearch: '2文字以上入力してください。', restricted: '制限中', blocked: 'ブロック中', unavailable: '選択できません', restrict: '制限する', unrestrict: '制限解除',
    restrictedOn: '制限日 {{date}}', count: '{{count}}人を制限中', empty: '制限した読者はいません', emptySearch: '該当する読者はいません',
    emptyHelp: '「読者を制限」で追加できます。', loading: '読み込み中...', saving: '処理中...', page: '{{page}} / {{pages}}', previous: '前のページ', next: '次のページ', retry: '再試行',
    loadError: '制限した読者を読み込めません。', searchError: '検索できません。', actionError: '制限を変更できません。',
    restrictTitle: '{{name}} を制限しますか？', unrestrictTitle: '{{name}} の制限を解除しますか？', restrictQuestion: '有効にした設定に従って交流を制限します。相手には通知されません。',
    unrestrictQuestion: '制限を解除しますか？通知設定は変更されません。', doneRestrict: '{{name}} を制限しました。', doneUnrestrict: '{{name}} の制限を解除しました。',
    cancel: 'キャンセル', close: '閉じる', blockedHelp: 'ブロックした読者は解除するまで制限できません。',
  },
  ko: {
    title: '제한된 독자 관리', back: '뒤로', description: '제한할 독자를 관리하세요. 설정은 선택한 독자에게만 적용됩니다.',
    searchList: '제한된 독자 검색...', add: '독자 제한', addTitle: '독자 찾기', addDescription: '이름, @사용자명 또는 프로필 링크로 검색하세요.',
    searchPeople: '이름, @사용자명 또는 프로필 링크', searchResults: '검색 결과', searching: '검색 중...', searchEmpty: '독자를 찾을 수 없습니다.',
    typeToSearch: '두 글자 이상 입력하세요.', restricted: '제한됨', blocked: '차단됨', unavailable: '선택 불가', restrict: '제한', unrestrict: '제한 해제',
    restrictedOn: '제한 날짜 {{date}}', count: '{{count}}명 제한 중', empty: '제한된 독자가 없습니다', emptySearch: '일치하는 독자가 없습니다',
    emptyHelp: '독자 제한을 눌러 추가하세요.', loading: '불러오는 중...', saving: '처리 중...', page: '{{page}} / {{pages}}', previous: '이전 페이지', next: '다음 페이지', retry: '다시 시도',
    loadError: '제한된 독자를 불러올 수 없습니다.', searchError: '검색할 수 없습니다.', actionError: '제한을 변경할 수 없습니다.',
    restrictTitle: '{{name}} 제한?', unrestrictTitle: '{{name}} 제한 해제?', restrictQuestion: '켜 놓은 옵션에 따라 해당 독자의 활동을 제한합니다. 알림은 보내지 않습니다.',
    unrestrictQuestion: '제한을 해제하시겠습니까? 알림 설정은 그대로 유지됩니다.', doneRestrict: '{{name}} 제한됨', doneUnrestrict: '{{name}} 제한 해제됨',
    cancel: '취소', close: '닫기', blockedHelp: '차단된 독자는 차단 해제 후 제한할 수 있습니다.',
  },
})

function dateLabel(value, language) {
  if (!value) return ''
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  const locale = ({ km: 'km-KH', en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' })[language] || 'en-US'
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function ReaderRow({ account, button, onAction, date, disabled = false, status }) {
  const name = account.name || account.username || 'Reader'
  return (
    <div className="flex min-h-[78px] items-center gap-3 border-b border-[var(--shadow-border)] py-3 last:border-b-0">
      <ReaderBlockAvatar name={name} src={account.avatar_url} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold">{name}</p>
        {account.username ? <p className="mt-1 truncate text-[12px] text-[var(--shadow-text-secondary)]">@{String(account.username).replace(/^@/, '')}</p> : null}
        {date ? <p className="mt-1 text-[11px] text-[var(--shadow-text-tertiary)]">{date}</p> : null}
      </div>
      {status ? <span className="shrink-0 rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px] text-[var(--shadow-text-secondary)]">{status}</span> : (
        <button type="button" onClick={() => onAction(account)} disabled={disabled} className="shrink-0 rounded-xl border border-[#e8647d] px-3 py-2 text-[12px] font-medium text-[#e8647d] disabled:opacity-50">
          {button}
        </button>
      )}
    </div>
  )
}

export default function ReaderManageRestrictedPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const tr = (key, options) => t(`readerManageRestrictions.${key}`, options)
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const backPath = `/profile/settings/restricted-readers${fromMeSettings ? '?from=me-settings' : ''}`
  const [page, setPage] = useState(1)
  const [listSearch, setListSearch] = useState('')
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [reload, setReload] = useState(0)
  const [notice, setNotice] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [addSearch, setAddSearch] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (!getReaderToken()) navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const controller = new AbortController()
    if (!getReaderToken()) return () => controller.abort()
    setLoading(true)
    setListError('')
    const timer = window.setTimeout(() => {
      getRestrictedReaders({ page, query: listSearch, signal: controller.signal })
        .then((data) => {
          if (controller.signal.aborted) return
          setRows(data.results)
          setTotal(data.total)
          setHasMore(data.has_more)
          if (page > 1 && data.results.length === 0) setPage((current) => Math.max(1, current - 1))
        })
        .catch((error) => {
          if (controller.signal.aborted) return
          if (error.status === 401) navigate('/login', { replace: true })
          else setListError(tr('loadError'))
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, listSearch.trim() ? 300 : 0)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [page, listSearch, reload, navigate])

  useEffect(() => {
    const controller = new AbortController()
    if (!addOpen) return () => controller.abort()
    const query = addSearch.trim()
    setResults([])
    setSearchError('')
    setSearching(false)
    if (query.length < 2) return () => controller.abort()
    const timer = window.setTimeout(() => {
      setSearching(true)
      searchRestrictReaders({ query, signal: controller.signal })
        .then((data) => {
          if (!controller.signal.aborted) setResults(data)
        })
        .catch((error) => {
          if (controller.signal.aborted) return
          if (error.status === 401) navigate('/login', { replace: true })
          else setSearchError(tr('searchError'))
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false)
        })
    }, 400)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [addOpen, addSearch, reload, navigate])

  useEffect(() => {
    if (!addOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    searchRef.current?.focus()
    const onEscape = (event) => {
      if (event.key === 'Escape' && !busy && !confirmation) setAddOpen(false)
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onEscape)
    }
  }, [addOpen, busy, confirmation])

  function openAddSearch() {
    setAddSearch('')
    setResults([])
    setSearchError('')
    setNotice('')
    setAddOpen(true)
  }

  function openConfirmation(account, shouldRestrict) {
    setActionError('')
    setConfirmation({ account, shouldRestrict })
  }

  async function confirmChange() {
    if (!confirmation || busy) return
    const { account, shouldRestrict } = confirmation
    setBusy(true)
    setActionError('')
    try {
      await changeReaderRestriction({ readerId: account.id, shouldRestrict })
      setConfirmation(null)
      setAddOpen(false)
      setNotice(tr(shouldRestrict ? 'doneRestrict' : 'doneUnrestrict', { name: account.name || account.username || '' }))
      setPage(1)
      setReload((value) => value + 1)
    } catch (error) {
      setActionError(error?.code === 'READER_BLOCKED' ? tr('blockedHelp') : tr('actionError'))
    } finally {
      setBusy(false)
    }
  }

  const language = getDisplayLanguageId()
  const pages = Math.max(1, Math.ceil(total / 10))

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(32px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(backPath)} aria-label={tr('back')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"><ArrowLeft size={20} strokeWidth={1.8} /></button>
          <h1 className="text-[18px] font-semibold">{tr('title')}</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] space-y-5 px-4 pt-5">
        <p className="text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{tr('description')}</p>
        <div className="relative">
          <Search size={18} strokeWidth={1.7} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shadow-text-secondary)]" />
          <input type="search" value={listSearch} onChange={(event) => { setListSearch(event.target.value); setPage(1) }} placeholder={tr('searchList')} aria-label={tr('searchList')} className="h-12 w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-10 pr-10 text-[13px] outline-none placeholder:text-[var(--shadow-text-tertiary)] focus:border-[#8b6dcd]" />
          {listSearch ? <button type="button" onClick={() => { setListSearch(''); setPage(1) }} aria-label={tr('cancel')} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center"><X size={17} /></button> : null}
        </div>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-semibold">{tr('title')}</h2>
            {!loading && !listError ? <span className="text-[12px] text-[var(--shadow-text-secondary)]">{tr('count', { count: total })}</span> : null}
          </div>
          {notice ? <p role="status" className="mt-3 rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px]">{notice}</p> : null}
          {listError ? <div className="py-6"><p role="alert" className="text-[12px] text-[#ee5b78]">{listError}</p><button type="button" onClick={() => setReload((value) => value + 1)} className="mt-2 text-[13px] underline">{tr('retry')}</button></div> : null}
          {loading ? <p role="status" className="py-10 text-center text-[13px] text-[var(--shadow-text-secondary)]">{tr('loading')}</p> : null}
          {!loading && !listError && rows.length === 0 ? <div className="flex flex-col items-center gap-2 py-10 text-center text-[var(--shadow-text-secondary)]"><ShieldCheck size={27} strokeWidth={1.5} /><p className="text-[13px] font-medium">{tr(listSearch.trim() ? 'emptySearch' : 'empty')}</p>{!listSearch.trim() ? <p className="text-[12px]">{tr('emptyHelp')}</p> : null}</div> : null}
          {!loading && !listError && rows.map((account) => <ReaderRow key={account.id} account={account} button={tr('unrestrict')} disabled={busy} date={account.restricted_at ? tr('restrictedOn', { date: dateLabel(account.restricted_at, language) }) : ''} onAction={(item) => openConfirmation(item, false)} />)}
        </section>

        <button type="button" onClick={openAddSearch} disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] border border-[#7664ad] bg-[var(--shadow-bg-soft)] px-4 text-[14px] font-semibold text-[var(--shadow-text-primary)] disabled:opacity-50"><Plus size={19} strokeWidth={1.9} />{tr('add')}</button>
        {!loading && !listError ? <div className="flex items-center justify-between gap-3 text-[12px] text-[var(--shadow-text-secondary)]"><span>{tr('count', { count: total })}</span><div className="flex items-center gap-2"><span className="tabular-nums">{tr('page', { page, pages })}</span><button type="button" disabled={page === 1 || busy} aria-label={tr('previous')} onClick={() => setPage((value) => Math.max(1, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] disabled:opacity-35"><ChevronLeft size={17} /></button><button type="button" disabled={!hasMore || busy} aria-label={tr('next')} onClick={() => setPage((value) => value + 1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] disabled:opacity-35"><ChevronRight size={17} /></button></div></div> : null}
      </div>

      {addOpen ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-3" role="presentation">
          <section role="dialog" aria-modal="true" aria-label={tr('addTitle')} className="flex max-h-[85vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
            <div className="flex items-center justify-between border-b border-[var(--shadow-border)] px-4 py-4"><h2 className="text-[16px] font-semibold">{tr('addTitle')}</h2><button type="button" onClick={() => { if (!busy) setAddOpen(false) }} disabled={busy} aria-label={tr('close')} className="flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-50"><X size={20} /></button></div>
            <div className="min-h-0 overflow-y-auto px-4 pb-5 pt-4">
              <p className="text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('addDescription')}</p>
              <div className="relative mt-4"><Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--shadow-text-secondary)]" /><input ref={searchRef} type="search" value={addSearch} onChange={(event) => setAddSearch(event.target.value)} placeholder={tr('searchPeople')} aria-label={tr('searchPeople')} className="h-12 w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-page)] pl-10 pr-3 text-[13px] outline-none focus:border-[#8b6dcd]" /></div>
              {addSearch.trim().length < 2 ? <p className="mt-5 text-[12px] text-[var(--shadow-text-secondary)]">{tr('typeToSearch')}</p> : null}
              {searching ? <p role="status" className="mt-5 text-[12px] text-[var(--shadow-text-secondary)]">{tr('searching')}</p> : null}
              {searchError ? <p role="alert" className="mt-5 text-[12px] text-[#ee5b78]">{searchError}</p> : null}
              {addSearch.trim().length >= 2 && !searching && !searchError ? <h3 className="mt-5 text-[13px] font-semibold">{tr('searchResults')}</h3> : null}
              {addSearch.trim().length >= 2 && !searching && !searchError && results.length === 0 ? <p className="mt-3 text-[12px] text-[var(--shadow-text-secondary)]">{tr('searchEmpty')}</p> : null}
              {!searching && !searchError && results.map((account) => {
                const status = account.status === 'blocked' ? tr('blocked') : account.status === 'restricted' ? tr('restricted') : account.status === 'available' ? '' : tr('unavailable')
                return <ReaderRow key={account.id} account={account} button={tr('restrict')} status={status} disabled={busy} onAction={(item) => openConfirmation(item, true)} />
              })}
              <p className="mt-5 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{tr('blockedHelp')}</p>
            </div>
          </section>
        </div>
      ) : null}

      <ReaderRestrictConfirmModal target={confirmation?.account} shouldRestrict={confirmation?.shouldRestrict} onConfirm={confirmChange} onCancel={() => { if (!busy) setConfirmation(null) }} busy={busy} error={actionError} t={t} />
    </main>
  )
}

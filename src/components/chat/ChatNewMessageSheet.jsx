import {
  LoaderCircle,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { searchChatUsers } from '../../services/chatApi'
import ReaderAuthorMessageRequestModal from './ReaderAuthorMessageRequestModal'
import ReaderReaderMessageRequestModal from './ReaderReaderMessageRequestModal'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatNewMessageSheet', {
  en: {
    reader: 'Reader',
    author: 'Author',
    authorPage: 'Author page',
    searchFailed: 'Failed to search people',
    newMessage: 'New message',
    subtitle: 'Search readers and author pages',
    placeholder: 'Name or @username',
    findSomeone: 'Find someone to message',
    findHelp: 'Enter at least 2 characters from a reader or author name or username.',
    noPeople: 'No people found',
    tryAnother: 'Try another name or username.',
  },
  km: {
    reader: 'អ្នកអាន',
    author: 'អ្នកនិពន្ធ',
    authorPage: 'ទំព័រអ្នកនិពន្ធ',
    searchFailed: 'មិនអាចស្វែងរកមនុស្សបានទេ',
    newMessage: 'សារថ្មី',
    subtitle: 'ស្វែងរកអ្នកអាន និងទំព័រអ្នកនិពន្ធ',
    placeholder: 'ឈ្មោះ ឬ @username',
    findSomeone: 'ស្វែងរកមនុស្សដើម្បីផ្ញើសារ',
    findHelp: 'បញ្ចូលយ៉ាងហោចណាស់ 2 តួអក្សរពីឈ្មោះ ឬ username របស់អ្នកអាន ឬអ្នកនិពន្ធ។',
    noPeople: 'រកមិនឃើញមនុស្ស',
    tryAnother: 'សាកល្បងឈ្មោះ ឬ username ផ្សេង។',
  },
  zh: {
    reader: '读者',
    author: '作者',
    authorPage: '作者主页',
    searchFailed: '无法搜索用户',
    newMessage: '新消息',
    subtitle: '搜索读者和作者主页',
    placeholder: '姓名或 @username',
    findSomeone: '查找要联系的人',
    findHelp: '输入读者或作者姓名或用户名中的至少 2 个字符。',
    noPeople: '未找到用户',
    tryAnother: '请尝试其他姓名或用户名。',
  },
  ja: {
    reader: '読者',
    author: '作者',
    authorPage: '作者ページ',
    searchFailed: 'ユーザーを検索できませんでした',
    newMessage: '新しいメッセージ',
    subtitle: '読者と作者ページを検索',
    placeholder: '名前または @username',
    findSomeone: 'メッセージする相手を探す',
    findHelp: '読者または作者の名前・ユーザー名を2文字以上入力してください。',
    noPeople: 'ユーザーが見つかりません',
    tryAnother: '別の名前またはユーザー名をお試しください。',
  },
  ko: {
    reader: '독자',
    author: '작가',
    authorPage: '작가 페이지',
    searchFailed: '사용자를 검색하지 못했습니다',
    newMessage: '새 메시지',
    subtitle: '독자 및 작가 페이지 검색',
    placeholder: '이름 또는 @username',
    findSomeone: '메시지할 사람 찾기',
    findHelp: '독자 또는 작가의 이름이나 사용자 이름을 2자 이상 입력하세요.',
    noPeople: '사용자를 찾을 수 없습니다',
    tryAnother: '다른 이름이나 사용자 이름을 입력해 보세요.',
  },
})

function SearchAvatar({ user }) {
  const [failed, setFailed] = useState(false)
  const name =
    user?.name ||
    user?.page_name ||
    user?.username ||
    'Reader'
  const letter =
    String(name)
      .trim()
      .charAt(0)
      .toUpperCase() || 'R'

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-bold text-white">
      {user?.avatar_url && !failed ? (
        <img
          src={user.avatar_url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

function isAuthorResult(user) {
  return (
    user?.result_type === 'author' ||
    Boolean(user?.author_page_id)
  )
}

export default function ChatNewMessageSheet({
  open,
  onClose,
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const requestIdRef = useRef(0)
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedReader, setSelectedReader] =
    useState(null)
  const [selectedAuthor, setSelectedAuthor] =
    useState(null)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setUsers([])
      setLoading(false)
      setError('')
      setSelectedReader(null)
      setSelectedAuthor(null)
      return undefined
    }

    const previousOverflow =
      document.body.style.overflow
    const previousTouchAction =
      document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow =
        previousOverflow
      document.body.style.touchAction =
        previousTouchAction
    }
  }, [open])

  useEffect(() => {
    if (
      !open ||
      selectedReader ||
      selectedAuthor
    ) {
      return undefined
    }

    const searchText = query
      .trim()
      .replace(/^@+/, '')

    if (searchText.length < 2) {
      requestIdRef.current += 1
      setUsers([])
      setLoading(false)
      setError('')
      return undefined
    }

    const requestId =
      requestIdRef.current + 1
    requestIdRef.current = requestId

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setLoading(true)
          setError('')

          const data = await searchChatUsers(
            searchText,
            20
          )

          if (
            requestIdRef.current !==
            requestId
          ) {
            return
          }

          setUsers(
            Array.isArray(data.users)
              ? data.users
              : []
          )
        } catch (searchError) {
          if (
            requestIdRef.current !==
            requestId
          ) {
            return
          }

          if (searchError.status === 401) {
            onClose?.()
            navigate('/login')
            return
          }

          setUsers([])
          setError(
            searchError.message ||
              t('chatNewMessageSheet.searchFailed')
          )
        } finally {
          if (
            requestIdRef.current ===
            requestId
          ) {
            setLoading(false)
          }
        }
      },
      300
    )

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    navigate,
    onClose,
    open,
    query,
    selectedAuthor,
    selectedReader,
  ])

  const closeAll = useCallback(() => {
    setSelectedReader(null)
    setSelectedAuthor(null)
    onClose?.()
  }, [onClose])

  const selectPerson = (user) => {
    if (isAuthorResult(user)) {
      setSelectedAuthor({
        id:
          user.author_page_id ||
          user.id,
        page_name:
          user.page_name ||
          user.name ||
          t('chatNewMessageSheet.author'),
        page_username:
          user.page_username ||
          user.username ||
          '',
        avatar_url:
          user.avatar_url || null,
      })
      return
    }

    setSelectedReader({
      ...user,
      id: user.user_id || user.id,
      name:
        user.name ||
        user.username ||
        t('chatNewMessageSheet.reader'),
      username:
        user.username || '',
    })
  }

  const showSearch =
    open &&
    !selectedReader &&
    !selectedAuthor

  return (
    <>
      {showSearch ? (
        <div className="fixed inset-0 z-[310] flex items-end justify-center md:items-center md:px-4">
          <button
            type="button"
            aria-label="Close new message"
            onClick={closeAll}
            className="absolute inset-0 bg-black/40"
          />

          <section className="relative flex max-h-[82vh] w-full flex-col rounded-t-[28px] bg-[var(--shadow-bg-surface)] pb-[calc(16px+env(safe-area-inset-bottom,0px))] shadow-2xl md:max-w-[460px] md:rounded-[26px] md:pb-4">
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)] md:hidden" />

            <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 md:px-5">
              <div>
                <h2 className="text-[20px] font-bold text-[var(--shadow-text-primary)]">
                  {t('chatNewMessageSheet.newMessage')}
                </h2>
                <p className="mt-0.5 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                  {t('chatNewMessageSheet.subtitle')}
                </p>
              </div>

              <button
                type="button"
                onClick={closeAll}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] transition active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative px-4 md:px-5">
              <Search
                size={20}
                className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-[var(--shadow-text-secondary)] md:left-9"
              />

              <input
                autoFocus
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value.slice(
                      0,
                      50
                    )
                  )
                }
                placeholder={t('chatNewMessageSheet.placeholder')}
                className="h-[50px] w-full rounded-full border border-transparent bg-[var(--shadow-input-bg)] pl-12 pr-4 text-[14px] font-medium text-[var(--shadow-text-primary)] outline-none transition placeholder:text-[var(--shadow-placeholder)] focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)]"
              />
            </div>

            <div className="mt-3 min-h-[250px] overflow-y-auto px-3 md:px-4">
              {loading ? (
                <div className="flex min-h-[220px] items-center justify-center text-[#7c3aed]">
                  <LoaderCircle
                    size={27}
                    className="animate-spin"
                  />
                </div>
              ) : error ? (
                <div className="mx-1 mt-3 rounded-[14px] bg-[#fff0f1] px-4 py-3 text-[11px] font-bold text-[#c7353d] dark:bg-[#7f1d1d]/25 dark:text-[#fca5a5]">
                  {error}
                </div>
              ) : query
                  .trim()
                  .replace(/^@+/, '')
                  .length < 2 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
                    <UserRound size={26} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {t('chatNewMessageSheet.findSomeone')}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                    {t('chatNewMessageSheet.findHelp')}
                  </div>
                </div>
              ) : users.length ? (
                <div className="space-y-1 py-1">
                  {users.map((user) => {
                    const author =
                      isAuthorResult(user)
                    const username =
                      user.page_username ||
                      user.username ||
                      ''

                    return (
                      <button
                        key={`${user.result_type || 'reader'}:${user.author_page_id || user.id}`}
                        type="button"
                        onClick={() =>
                          selectPerson(user)
                        }
                        className="flex w-full items-center gap-3 rounded-[16px] px-2 py-3 text-left transition hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-hover)]"
                      >
                        <SearchAvatar
                          user={user}
                        />

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <strong className="truncate text-[14px] font-bold text-[var(--shadow-text-primary)]">
                              {user.page_name ||
                                user.name ||
                                username}
                            </strong>

                            <span className="shrink-0 rounded-full bg-[#f2edff] px-2 py-1 text-[9px] font-bold text-[#7c3aed]">
                              {author
                                ? t('chatNewMessageSheet.author')
                                : t('chatNewMessageSheet.reader')}
                            </span>
                          </span>

                          <span className="mt-0.5 block truncate text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                            {username
                              ? `@${username}`
                              : author
                                ? t('chatNewMessageSheet.authorPage')
                                : t('chatNewMessageSheet.reader')}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-input-bg)] text-[var(--shadow-text-secondary)]">
                    <Search size={25} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {t('chatNewMessageSheet.noPeople')}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                    {t('chatNewMessageSheet.tryAnother')}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      <ReaderReaderMessageRequestModal
        open={
          open &&
          Boolean(selectedReader)
        }
        reader={selectedReader}
        onClose={closeAll}
      />

      <ReaderAuthorMessageRequestModal
        open={
          open &&
          Boolean(selectedAuthor)
        }
        author={selectedAuthor}
        onClose={closeAll}
      />
    </>
  )
}

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
              'Failed to search people'
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
          'Author',
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
        'Shadow Reader',
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

          <section className="relative flex max-h-[82vh] w-full flex-col rounded-t-[28px] bg-white pb-[calc(16px+env(safe-area-inset-bottom,0px))] shadow-2xl md:max-w-[460px] md:rounded-[26px] md:pb-4">
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#d6d4dc] md:hidden" />

            <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 md:px-5">
              <div>
                <h2 className="text-[20px] font-bold text-[#111827]">
                  New message
                </h2>
                <p className="mt-0.5 text-[11px] font-semibold text-[#8a8792]">
                  Search readers and author pages
                </p>
              </div>

              <button
                type="button"
                onClick={closeAll}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f2f6] text-[#55515e] transition active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative px-4 md:px-5">
              <Search
                size={20}
                className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 text-[#777480] md:left-9"
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
                placeholder="Name or @username"
                className="h-[50px] w-full rounded-full border border-transparent bg-[#f4f4f7] pl-12 pr-4 text-[14px] font-medium text-[#111827] outline-none transition placeholder:text-[#94919b] focus:border-[#d9cdf8] focus:bg-white"
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
                <div className="mx-1 mt-3 rounded-[14px] bg-[#fff0f1] px-4 py-3 text-[11px] font-bold text-[#c7353d]">
                  {error}
                </div>
              ) : query
                  .trim()
                  .replace(/^@+/, '')
                  .length < 2 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
                    <UserRound size={26} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[#111827]">
                    Find someone to message
                  </div>
                  <div className="mt-1 text-[11px] font-semibold leading-5 text-[#8a8792]">
                    Enter at least 2 characters from a reader or author name or username.
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
                        className="flex w-full items-center gap-3 rounded-[16px] px-2 py-3 text-left transition hover:bg-[#faf9fc] active:bg-[#f3effc]"
                      >
                        <SearchAvatar
                          user={user}
                        />

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <strong className="truncate text-[14px] font-bold text-[#111827]">
                              {user.page_name ||
                                user.name ||
                                username}
                            </strong>

                            <span className="shrink-0 rounded-full bg-[#f2edff] px-2 py-1 text-[9px] font-bold text-[#7c3aed]">
                              {author
                                ? 'Author'
                                : 'Reader'}
                            </span>
                          </span>

                          <span className="mt-0.5 block truncate text-[11px] font-semibold text-[#8a8792]">
                            {username
                              ? `@${username}`
                              : author
                                ? 'Author page'
                                : 'Reader'}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f4f7] text-[#777480]">
                    <Search size={25} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[#111827]">
                    No people found
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-[#8a8792]">
                    Try another name or username.
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

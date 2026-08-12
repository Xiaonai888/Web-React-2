import {
  Check,
  ChevronLeft,
  LoaderCircle,
  Search,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { searchChatUsers } from '../../services/chatApi'
import { createGroupChat } from '../../services/chatGroupApi'

function GroupAvatar({ user, size = 'h-12 w-12' }) {
  const [failed, setFailed] = useState(false)
  const name =
    user?.name ||
    user?.username ||
    'Reader'
  const letter =
    String(name)
      .trim()
      .charAt(0)
      .toUpperCase() || 'R'

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-bold text-white`}
    >
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

function normalizeReader(user) {
  if (
    !user ||
    user.result_type === 'author' ||
    user.author_page_id
  ) {
    return null
  }

  const id =
    user.user_id ||
    user.id

  if (!id) return null

  return {
    id: String(id),
    name:
      user.name ||
      user.username ||
      'Shadow Reader',
    username:
      user.username || '',
    avatar_url:
      user.avatar_url || null,
  }
}

export default function ChatGroupCreateSheet({
  open,
  onClose,
  onCreated,
}) {
  const navigate = useNavigate()
  const searchRequestRef = useRef(0)
  const [step, setStep] = useState('members')
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState([])
  const [groupName, setGroupName] = useState('')
  const [searchLoading, setSearchLoading] =
    useState(false)
  const [creating, setCreating] =
    useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      searchRequestRef.current += 1
      setStep('members')
      setQuery('')
      setUsers([])
      setSelected([])
      setGroupName('')
      setSearchLoading(false)
      setCreating(false)
      setError('')
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
    if (!open || step !== 'members') {
      return undefined
    }

    const searchText = String(query || '')
      .trim()
      .replace(/^@+/, '')

    if (searchText.length < 2) {
      searchRequestRef.current += 1
      setUsers([])
      setSearchLoading(false)
      setError('')
      return undefined
    }

    const requestId =
      searchRequestRef.current + 1
    searchRequestRef.current = requestId

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setSearchLoading(true)
          setError('')

          const data = await searchChatUsers(
            searchText,
            20
          )

          if (
            searchRequestRef.current !==
            requestId
          ) {
            return
          }

          const seen = new Set()
          const readers = (
            Array.isArray(data.users)
              ? data.users
              : []
          )
            .map(normalizeReader)
            .filter(Boolean)
            .filter((user) => {
              if (seen.has(user.id)) {
                return false
              }

              seen.add(user.id)
              return true
            })

          setUsers(readers)
        } catch (searchError) {
          if (
            searchRequestRef.current !==
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
            searchRequestRef.current ===
            requestId
          ) {
            setSearchLoading(false)
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
    step,
  ])

  const selectedIds = useMemo(
    () =>
      new Set(
        selected.map((user) =>
          String(user.id)
        )
      ),
    [selected]
  )

  const toggleUser = (user) => {
    if (!user?.id || creating) return

    const id = String(user.id)

    if (selectedIds.has(id)) {
      setSelected((current) =>
        current.filter(
          (item) =>
            String(item.id) !== id
        )
      )
      setError('')
      return
    }

    if (selected.length >= 99) {
      setError(
        'A group can have up to 100 people including you'
      )
      return
    }

    setSelected((current) => [
      ...current,
      user,
    ])
    setError('')
  }

  const goToName = () => {
    if (selected.length < 2) {
      setError(
        'Choose at least 2 people'
      )
      return
    }

    setError('')
    setStep('name')
  }

  const createGroup = async () => {
    if (creating) return

    const safeName = String(
      groupName || ''
    ).trim()

    if (!safeName) {
      setError('Group name is required')
      return
    }

    if (selected.length < 2) {
      setStep('members')
      setError(
        'Choose at least 2 people'
      )
      return
    }

    setCreating(true)
    setError('')

    try {
      const data = await createGroupChat({
        name: safeName,
        memberUserIds: selected.map(
          (user) => user.id
        ),
      })

      const conversationId =
        data?.conversation?.id

      window.dispatchEvent(
        new CustomEvent(
          'shadow-chat-updated'
        )
      )

      onCreated?.(
        data?.conversation || null
      )
      onClose?.()

      if (conversationId) {
        navigate(
          `/chat/${conversationId}`
        )
      }
    } catch (createError) {
      if (createError.status === 401) {
        onClose?.()
        navigate('/login')
        return
      }

      setError(
        createError.message ||
          'Failed to create group'
      )
    } finally {
      setCreating(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[330] flex items-end justify-center md:items-center md:px-4">
      <button
        type="button"
        aria-label="Close group chat"
        onClick={() => {
          if (!creating) {
            onClose?.()
          }
        }}
        className="absolute inset-0 bg-black/40"
      />

      <section className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white pb-[calc(16px+env(safe-area-inset-bottom,0px))] shadow-2xl md:max-w-[480px] md:rounded-[26px] md:pb-4">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#d6d4dc] md:hidden" />

        <div className="flex min-h-[68px] items-center gap-3 border-b border-[#f0f0f3] px-4 md:px-5">
          {step === 'name' ? (
            <button
              type="button"
              onClick={() => {
                if (!creating) {
                  setError('')
                  setStep('members')
                }
              }}
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f2f6]"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
              <UsersRound size={21} />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold text-[#111827]">
              {step === 'members'
                ? 'New group'
                : 'Group details'}
            </h2>
            <p className="mt-0.5 text-[11px] font-normal text-[#8a8792]">
              {step === 'members'
                ? `${selected.length + 1}/100 people`
                : `${selected.length + 1} people`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!creating) {
                onClose?.()
              }
            }}
            disabled={creating}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f2f6] text-[#55515e] active:scale-90 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-3 rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[11px] font-semibold text-[#c7353d] md:mx-5"
          >
            {error}
          </button>
        ) : null}

        {step === 'members' ? (
          <>
            {selected.length ? (
              <div className="shadow-chat-scroll flex gap-3 overflow-x-auto border-b border-[#f4f4f6] px-4 py-3 md:px-5">
                {selected.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() =>
                      toggleUser(user)
                    }
                    className="flex w-[64px] shrink-0 flex-col items-center"
                  >
                    <span className="relative">
                      <GroupAvatar
                        user={user}
                        size="h-12 w-12"
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#111827] text-white">
                        <X size={10} strokeWidth={3} />
                      </span>
                    </span>
                    <span className="mt-1.5 w-full truncate text-center text-[10px] font-semibold text-[#55515e]">
                      {user.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="relative px-4 pt-3 md:px-5">
              <Search
                size={19}
                className="pointer-events-none absolute left-8 top-[37px] -translate-y-1/2 text-[#777480] md:left-9"
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
                placeholder="Search readers by name or @username"
                className="h-[48px] w-full rounded-full border border-transparent bg-[#f4f4f7] pl-12 pr-4 text-[14px] font-normal text-[#111827] outline-none transition placeholder:text-[#94919b] focus:border-[#d9cdf8] focus:bg-white"
              />
            </div>

            <div className="min-h-[250px] flex-1 overflow-y-auto px-3 pb-2 pt-2 md:px-4">
              {searchLoading ? (
                <div className="flex min-h-[230px] items-center justify-center text-[#7c3aed]">
                  <LoaderCircle
                    size={27}
                    className="animate-spin"
                  />
                </div>
              ) : query
                  .trim()
                  .replace(/^@+/, '')
                  .length < 2 ? (
                <div className="flex min-h-[230px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
                    <UserPlus size={26} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[#111827]">
                    Add people
                  </div>
                  <div className="mt-1 max-w-[300px] text-[11px] font-normal leading-5 text-[#8a8792]">
                    Search for readers and choose at least 2 people. Your group can have up to 100 people including you.
                  </div>
                </div>
              ) : users.length ? (
                <div className="space-y-1 py-1">
                  {users.map((user) => {
                    const checked =
                      selectedIds.has(
                        String(user.id)
                      )

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() =>
                          toggleUser(user)
                        }
                        className="flex w-full items-center gap-3 rounded-[16px] px-2 py-3 text-left active:bg-[#f3effc]"
                      >
                        <GroupAvatar
                          user={user}
                        />

                        <span className="min-w-0 flex-1">
                          <strong className="block truncate text-[14px] font-bold text-[#111827]">
                            {user.name}
                          </strong>
                          <span className="mt-0.5 block truncate text-[11px] font-normal text-[#8a8792]">
                            {user.username
                              ? `@${user.username}`
                              : 'Reader'}
                          </span>
                        </span>

                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                            checked
                              ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                              : 'border-[#d8d6df] bg-white text-transparent'
                          }`}
                        >
                          <Check
                            size={15}
                            strokeWidth={3}
                          />
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex min-h-[230px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f4f7] text-[#777480]">
                    <Search size={25} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[#111827]">
                    No readers found
                  </div>
                  <div className="mt-1 text-[11px] font-normal text-[#8a8792]">
                    Try another name or username.
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#f0f0f3] px-4 pt-3 md:px-5">
              <button
                type="button"
                onClick={goToName}
                disabled={
                  selected.length < 2
                }
                className="h-12 w-full rounded-[15px] bg-[#7c3aed] text-[14px] font-semibold text-white transition active:scale-[0.99] disabled:bg-[#d8cdf3] disabled:text-white/80"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col px-4 py-5 md:px-5">
            <div className="flex flex-col items-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
                <UsersRound size={36} />
              </span>

              <div className="mt-4 text-center text-[13px] font-semibold text-[#55515e]">
                {selected.length + 1} people
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="shadow-group-name"
                className="mb-2 block text-[12px] font-semibold text-[#55515e]"
              >
                Group name
              </label>
              <input
                id="shadow-group-name"
                autoFocus
                value={groupName}
                onChange={(event) =>
                  setGroupName(
                    event.target.value.slice(
                      0,
                      60
                    )
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !creating
                  ) {
                    createGroup()
                  }
                }}
                placeholder="Enter a group name"
                className="h-[50px] w-full rounded-[15px] border border-[#e6e4eb] bg-white px-4 text-[14px] font-normal text-[#111827] outline-none transition placeholder:text-[#aaa7b0] focus:border-[#b8a1ee]"
              />
              <div className="mt-1.5 text-right text-[10px] font-normal text-[#9995a0]">
                {groupName.length}/60
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={createGroup}
                disabled={
                  creating ||
                  !groupName.trim()
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[15px] bg-[#7c3aed] text-[14px] font-semibold text-white transition active:scale-[0.99] disabled:bg-[#d8cdf3] disabled:text-white/80"
              >
                {creating ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <UsersRound size={19} />
                )}
                {creating
                  ? 'Creating...'
                  : 'Create group'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

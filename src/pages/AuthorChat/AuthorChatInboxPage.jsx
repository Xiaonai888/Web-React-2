import {
  Archive,
  Ellipsis,
  ListFilter,
  LoaderCircle,
  MessageCircle,
  Search,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAuthorChatConversations,
  getAuthorInboxComments,
  getAuthorInboxProfile,
  hasAuthorChatSession,
} from '../../services/authorChatApi'
import { resolveAuthorPostActivityRoute } from '../../utils/authorPostActivityRoute'

const QUICK_FILTERS = [
  { key: 'unread', label: 'Unread' },
  { key: 'ad_replies', label: 'Ad replies' },
  { key: 'follow_up', label: 'Follow up' },
  { key: 'messages', label: 'Messages' },
]

const FILTER_GROUPS = [
  {
    title: 'Frequently used',
    subtitle: 'You may select multiple filters.',
    items: [
      { key: 'unread', label: 'Unread' },
      { key: 'read', label: 'Read' },
      { key: 'muted', label: 'Muted' },
      { key: 'active', label: 'Active' },
    ],
  },
  {
    title: 'Activity',
    items: [
      { key: 'today', label: 'Today' },
      { key: 'last_7_days', label: 'Last 7 days' },
      { key: 'last_30_days', label: 'Last 30 days' },
    ],
  },
  {
    title: 'Content',
    items: [
      { key: 'has_link', label: 'Contains link' },
      { key: 'long_message', label: 'Long message' },
    ],
  },
]

function normalizeSearch(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .trim()
}

function formatConversationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / 86400000
  )

  if (diffDays < 7) {
    return `${Math.max(1, diffDays)}d`
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatNotificationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const minutes = Math.floor(
    (Date.now() - date.getTime()) / 60000
  )

  if (minutes < 1) return 'Now'
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function CircleAvatar({
  imageUrl,
  name,
  size = 'h-14 w-14',
  textSize = 'text-[16px]',
}) {
  const [failed, setFailed] = useState(false)
  const letter =
    String(name || 'S').trim().charAt(0).toUpperCase() || 'S'

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8e8eb] ${textSize} font-bold text-[#111827]`}
    >
      {imageUrl && !failed ? (
        <img
          src={imageUrl}
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

function ConversationRow({ conversation, onOpen }) {
  const person = conversation.counterpart || {}
  const latest = conversation.latest_message || {}
  const unread = Math.max(
    0,
    Number(conversation.unread_count || 0)
  )

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-5 py-3 text-left active:bg-[#f4f4f5]"
    >
      <div className="relative">
        <CircleAvatar
          imageUrl={person.avatar_url}
          name={person.name || person.username}
          size="h-[58px] w-[58px]"
          textSize="text-[17px]"
        />
        {unread > 0 ? (
          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-white bg-[#1877f2]" />
        ) : null}
      </div>

      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <strong
            className={`min-w-0 flex-1 truncate text-[15px] text-[#111827] ${
              unread > 0 ? 'font-extrabold' : 'font-semibold'
            }`}
          >
            {person.name || 'Shadow Reader'}
          </strong>

          <span className="shrink-0 text-[12px] font-normal text-[#74777d]">
            {formatConversationTime(
              conversation.last_message_at ||
                latest.created_at
            )}
          </span>
        </span>

        <span
          className={`mt-1 block truncate text-[13px] ${
            unread > 0
              ? 'font-semibold text-[#111827]'
              : 'font-normal text-[#62656b]'
          }`}
        >
          {latest.body || 'Open this conversation'}
        </span>
      </span>
    </button>
  )
}

function getCommentActor(notification) {
  const metadata =
    notification?.metadata &&
    typeof notification.metadata === 'object'
      ? notification.metadata
      : {}

  return {
    name:
      metadata.reader_name ||
      metadata.actor_name ||
      metadata.reviewer_name ||
      'Shadow Reader',
    username:
      metadata.reader_username ||
      metadata.actor_username ||
      metadata.reviewer_username ||
      '',
    avatar:
      metadata.reader_avatar_url ||
      metadata.actor_avatar_url ||
      metadata.reviewer_avatar_url ||
      '',
  }
}

function CommentRow({ notification, onOpen }) {
  const actor = getCommentActor(notification)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-5 py-3 text-left active:bg-[#f4f4f5]"
    >
      <CircleAvatar
        imageUrl={actor.avatar}
        name={actor.name}
        size="h-[54px] w-[54px]"
        textSize="text-[15px]"
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <strong className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[#111827]">
            {actor.name}
          </strong>
          <span className="shrink-0 text-[12px] text-[#74777d]">
            {formatNotificationTime(
              notification.created_at
            )}
          </span>
        </span>
        <span className="mt-1 block line-clamp-2 text-[13px] font-normal leading-5 text-[#62656b]">
          {notification.message ||
            notification.title ||
            'Commented on your Page'}
        </span>
      </span>
    </button>
  )
}

function matchesConversationFilters(conversation, filters) {
  if (!filters.size) return true

  const unread = Number(conversation.unread_count || 0)
  const latest = conversation.latest_message || {}
  const body = String(latest.body || '')
  const time = new Date(
    conversation.last_message_at || latest.created_at || 0
  ).getTime()
  const age = Date.now() - time

  if (filters.has('unread') && unread <= 0) return false
  if (filters.has('read') && unread > 0) return false
  if (filters.has('muted') && !conversation.is_muted) return false
  if (filters.has('active') && conversation.is_muted) return false
  if (filters.has('today') && age > 86400000) return false
  if (filters.has('last_7_days') && age > 604800000) return false
  if (filters.has('last_30_days') && age > 2592000000) return false
  if (filters.has('has_link') && !/https?:\/\/|www\./i.test(body)) return false
  if (filters.has('long_message') && body.length < 120) return false

  return true
}

function FilterSheet({
  open,
  value,
  onClose,
  onApply,
}) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(new Set(value))
  }, [open, value])

  if (!open) return null

  function toggle(key) {
    setDraft((current) => {
      const next = new Set(current)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close filters"
      />

      <section className="relative z-10 flex max-h-[68dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-2xl">
        <div className="shrink-0 px-4 pt-2">
          <div className="mx-auto h-1 w-9 rounded-full bg-[#d3d4d6]" />

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[#111827]">
              Filter messages
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f1f2]"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
          {FILTER_GROUPS.map((group) => (
            <div key={group.title} className="mt-5">
              <h3 className="text-[14px] font-bold text-[#23252a]">
                {group.title}
              </h3>

              {group.subtitle ? (
                <p className="mt-0.5 text-[10px] text-[#8b8e94]">
                  {group.subtitle}
                </p>
              ) : null}

              <div className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const active = draft.has(item.key)

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggle(item.key)}
                      className={`h-8 rounded-[7px] px-3 text-[12px] font-medium ${
                        active
                          ? 'bg-[#e5e5e7] text-[#111827] ring-1 ring-[#111827]'
                          : 'bg-[#f4f4f5] text-[#303238]'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-[#eeeeef] bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={() => setDraft(new Set())}
            className="h-10 rounded-[7px] border border-[#d8dadd] bg-white text-[13px] font-semibold text-[#24262b]"
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={() => onApply(draft)}
            className="h-10 rounded-[7px] bg-[#111827] text-[13px] font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </section>
    </div>
  )
}

function EmptyState({ tab }) {
  return (
    <div className="px-6 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e8ff] text-[#7c3aed]">
        <MessageCircle size={26} />
      </div>
      <h2 className="mt-5 text-[16px] font-bold text-[#111827]">
        {tab === 'comments'
          ? 'No comments yet'
          : 'No Page messages yet'}
      </h2>
      <p className="mx-auto mt-2 max-w-[290px] text-[12px] leading-5 text-[#8a8d93]">
        {tab === 'comments'
          ? 'Comments and mentions for your Author Page will appear here.'
          : 'Messages sent to your Author Page will appear here.'}
      </p>
    </div>
  )
}

export default function AuthorChatInboxPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [conversations, setConversations] = useState([])
  const [archivedCount, setArchivedCount] = useState(0)
  const [comments, setComments] = useState([])
  const [tab, setTab] = useState('messages')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(() => new Set())
  const [moreOpen, setMoreOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadInbox = useCallback(
    async ({ signal } = {}) => {
      setLoading(true)

      try {
        const [
          chatData,
          archivedData,
          profileData,
          commentData,
        ] = await Promise.all([
          getAuthorChatConversations({
            view: 'active',
            signal,
          }),
          getAuthorChatConversations({
            view: 'archived',
            signal,
          }),
          getAuthorInboxProfile({ signal }),
          getAuthorInboxComments(
            50,
            { signal }
          ),
        ])

        setConversations(
          chatData.conversations || []
        )
        setArchivedCount(
          (archivedData.conversations || []).length
        )
        setProfile(profileData || null)
        setComments(commentData || [])
        setError('')
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

        if (loadError.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        setError(
          loadError.message ||
            'Failed to load Page Inbox'
        )
      } finally {
        if (!signal?.aborted) {
          setLoading(false)
        }
      }
    },
    [navigate]
  )

  const refreshCurrentTab = useCallback(
    async ({ signal } = {}) => {
      if (document.hidden) return

      try {
        if (tab === 'comments') {
          const commentData =
            await getAuthorInboxComments(
              50,
              { signal }
            )

          setComments(commentData || [])
        } else {
          const chatData =
            await getAuthorChatConversations({
              view: 'active',
              signal,
            })

          setConversations(
            chatData.conversations || []
          )
        }

        setError('')
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

        if (loadError.status === 401) {
          navigate('/login', { replace: true })
        }
      }
    },
    [navigate, tab]
  )

  useEffect(() => {
    if (!hasAuthorChatSession()) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()

    loadInbox({
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [loadInbox, navigate])

  useEffect(() => {
    if (!hasAuthorChatSession()) return undefined

    let refreshInFlight = false
    let lastRefreshAt = 0
    const controller = new AbortController()

    const refreshIfStale = async () => {
      if (
        refreshInFlight ||
        controller.signal.aborted ||
        document.visibilityState !== 'visible'
      ) {
        return
      }

      const now = Date.now()

      if (
        lastRefreshAt &&
        now - lastRefreshAt < 30000
      ) {
        return
      }

      refreshInFlight = true
      lastRefreshAt = now

      try {
        await refreshCurrentTab({
          signal: controller.signal,
        })
      } finally {
        refreshInFlight = false
      }
    }

    const handleVisible = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        refreshIfStale()
      }
    }

    window.addEventListener(
      'focus',
      refreshIfStale
    )
    document.addEventListener(
      'visibilitychange',
      handleVisible
    )

    return () => {
      controller.abort()
      window.removeEventListener(
        'focus',
        refreshIfStale
      )
      document.removeEventListener(
        'visibilitychange',
        handleVisible
      )
    }
  }, [refreshCurrentTab, tab])

  const normalizedQuery = useMemo(
    () => normalizeSearch(query),
    [query]
  )

  const visibleConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const person = conversation.counterpart || {}
      const latest = conversation.latest_message || {}

      if (!matchesConversationFilters(conversation, filters)) {
  return false
}

      if (!normalizedQuery) return true

      const haystack = normalizeSearch(
        [
          person.name,
          person.username,
          latest.body,
        ]
          .filter(Boolean)
          .join(' ')
      )

      return haystack.includes(normalizedQuery)
    })
  }, [conversations, filters, normalizedQuery])

  const visibleComments = useMemo(() => {
    if (!normalizedQuery) return comments

    return comments.filter((notification) => {
      const actor = getCommentActor(notification)
      const haystack = normalizeSearch(
        [
          actor.name,
          actor.username,
          notification.title,
          notification.message,
        ]
          .filter(Boolean)
          .join(' ')
      )

      return haystack.includes(normalizedQuery)
    })
  }, [comments, normalizedQuery])

  const pageName =
    profile?.page_name ||
    profile?.name ||
    profile?.page_username ||
    'Author Page'
  const profileImage =
    profile?.avatar_url ||
    profile?.profile_image_url ||
    ''

  function openComment(notification) {
  const activityRoute =
    resolveAuthorPostActivityRoute(notification)

  if (!activityRoute) {
    setError('This Page comment cannot be opened.')
    return
  }

  navigate(activityRoute)
}



  return (
    <div
      className="min-h-[100dvh] bg-white text-[#111827]"
      onClick={() => {
        if (moreOpen) setMoreOpen(false)
      }}
    >
      <header className="sticky top-0 z-50 border-b border-[#ececef] bg-white">
        <div className="mx-auto max-w-[680px]">
          <div className="flex h-[52px] items-center gap-2 px-4 pt-[env(safe-area-inset-top)]">
            {searchOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false)
                    setQuery('')
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f2f2f3]"
                >
                  <X size={23} />
                </button>

                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777a80]"
                  />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) =>
                      setQuery(
                        event.target.value.slice(0, 80)
                      )
                    }
                    placeholder="Search"
                    className="h-10 w-full rounded-full bg-[#f1f2f4] pl-11 pr-4 text-[14px] outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="min-w-0 flex-1 text-[20px] font-bold leading-none">
                  Inbox
                </h1>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSearchOpen(true)
                    setMoreOpen(false)
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f2f2f3]"
                  aria-label="Search inbox"
                >
                  <Search size={24} strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/author/page')}
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  aria-label="Profile page"
                >
                  <CircleAvatar
  imageUrl={profileImage}
  name={pageName}
  size="h-7 w-7"
  textSize="text-[10px]"
/>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setMoreOpen((current) => !current)
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f2f2f3]"
                    aria-label="More"
                  >
                    <Ellipsis size={25} />
                  </button>

                  {moreOpen ? (
                    <div className="absolute right-0 top-[44px] z-30 w-[190px] rounded-[14px] bg-white p-2 text-[12px] font-semibold text-[#73767c] shadow-[0_12px_36px_rgba(0,0,0,0.16)] ring-1 ring-black/5">
                      More Inbox tools will be added later.
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="flex h-[52px] items-end px-5">
            <button
              type="button"
              onClick={() => setTab('messages')}
              className={`relative mr-8 h-full px-1 text-[17px] ${
                tab === 'messages'
                  ? 'font-semibold text-[#111827]'
                  : 'font-normal text-[#73767c]'
              }`}
            >
              Messages
              {tab === 'messages' ? (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#111827]" />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setTab('comments')}
              className={`relative h-full px-1 text-[17px] ${
                tab === 'comments'
                  ? 'font-semibold text-[#111827]'
                  : 'font-normal text-[#73767c]'
              }`}
            >
              Comments
              {tab === 'comments' ? (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#111827]" />
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {tab === 'messages' ? (
        <section className="border-b border-[#f0f0f2] bg-white">
          <div className="mx-auto flex max-w-[680px] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] text-[#282a2f] active:bg-[#f1f1f2]"
              aria-label="Filter messages"
            >
              <ListFilter size={20} />
            </button>

            {QUICK_FILTERS.map((item) => {
              const active = filters.has(item.key)

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setFilters((current) => {
                      const next = new Set(current)

                      if (next.has(item.key)) {
                        next.delete(item.key)
                      } else {
                        next.add(item.key)
                      }

                      return next
                    })
                  }
                  className={`h-9 shrink-0 rounded-[8px] px-4 text-[13px] font-medium ${
                    active
                      ? 'bg-[#e7f1ff] text-[#1877f2]'
                      : 'bg-[#f4f4f5] text-[#37393f]'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      <main className="mx-auto max-w-[680px] pb-[max(28px,env(safe-area-inset-bottom))]">
        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-3 w-[calc(100%-2rem)] rounded-[12px] bg-[#fff1f2] px-4 py-3 text-left text-[12px] text-[#be3139]"
          >
            {error}
          </button>
        ) : null}

        {tab === 'messages' ? (
  <button
    type="button"
    onClick={() => navigate('/author/page/chat/archived')}
    className="flex w-full items-center gap-3 border-b border-[#f0f0f2] px-5 py-3 text-left active:bg-[#f4f4f5]"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5e5e7] text-[#666970]">
      <Archive size={20} />
    </span>

    <span className="min-w-0 flex-1">
      <strong className="block text-[14px] font-semibold text-[#111827]">
        Archived chats
      </strong>
      <span className="mt-0.5 block text-[11px] text-[#85888e]">
        {archivedCount} archived
      </span>
    </span>
  </button>
) : null}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center text-[#1877f2]">
            <LoaderCircle
              size={27}
              className="animate-spin"
            />
          </div>
        ) : tab === 'messages' ? (
          visibleConversations.length ? (
            <div className="py-2">
              {visibleConversations.map(
                (conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    onOpen={() =>
                      navigate(
                        `/author/page/chat/${conversation.id}`
                      )
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState tab="messages" />
          )
        ) : visibleComments.length ? (
          <div className="py-2">
            {visibleComments.map((notification) => (
              <CommentRow
                key={notification.id}
                notification={notification}
                onOpen={() =>
                  openComment(notification)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState tab="comments" />
        )}
      </main>

      <FilterSheet
        open={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setFilters(new Set(next))
          setFilterOpen(false)
        }}
      />
    </div>
  )
}

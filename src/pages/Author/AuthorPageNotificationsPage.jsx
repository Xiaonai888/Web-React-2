import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'
import { useAuthorPageNotifications } from '../../providers/AuthorPageNotificationProvider'
import { resolveAuthorPostActivityRoute } from '../../utils/authorPostActivityRoute'

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PAGE_SIZE = 30

const filters = [
  'All',
  'Unread',
  'Comments',
  'Activity',
  'Orders',
  'Income',
]

const typeMap = {
  comments: 'Comments',
  comment: 'Comments',
  mention: 'Comments',
  mentions: 'Comments',
  reaction: 'Activity',
  echo: 'Activity',
  follower: 'Activity',
  review: 'Activity',
  post: 'Activity',
  posts: 'Activity',
  orders: 'Orders',
  order: 'Orders',
  income: 'Income',
  withdrawal: 'Income',
  payout: 'Income',
  system: 'System',
  admin: 'System',
}

const actionMap = {
  comments: {
    icon: 'fa-solid fa-comment',
    badge: 'bg-[#1877f2] text-white',
  },
  comment: {
    icon: 'fa-solid fa-comment',
    badge: 'bg-[#1877f2] text-white',
  },
  mention: {
    icon: 'fa-solid fa-at',
    badge: 'bg-[#2563eb] text-white',
  },
  mentions: {
    icon: 'fa-solid fa-at',
    badge: 'bg-[#2563eb] text-white',
  },
  reaction: {
    icon: 'fa-solid fa-heart',
    badge: 'bg-[#f43f5e] text-white',
  },
  echo: {
    icon: 'fa-solid fa-share',
    badge: 'bg-[#7c3aed] text-white',
  },
  follower: {
    icon: 'fa-solid fa-user-plus',
    badge: 'bg-[#0891b2] text-white',
  },
  review: {
    icon: 'fa-solid fa-star',
    badge: 'bg-[#f59e0b] text-white',
  },
  post: {
    icon: 'fa-regular fa-file-lines',
    badge: 'bg-[#4b5563] text-white',
  },
  posts: {
    icon: 'fa-regular fa-file-lines',
    badge: 'bg-[#4b5563] text-white',
  },
  orders: {
    icon: 'fa-solid fa-bag-shopping',
    badge: 'bg-[#7c3aed] text-white',
  },
  order: {
    icon: 'fa-solid fa-bag-shopping',
    badge: 'bg-[#7c3aed] text-white',
  },
  income: {
    icon: 'fa-solid fa-wallet',
    badge: 'bg-[#16a34a] text-white',
  },
  withdrawal: {
    icon: 'fa-solid fa-money-bill-transfer',
    badge: 'bg-[#16a34a] text-white',
  },
  payout: {
    icon: 'fa-solid fa-money-check-dollar',
    badge: 'bg-[#16a34a] text-white',
  },
  system: {
    icon: 'fa-solid fa-shield-halved',
    badge: 'bg-[#111827] text-white',
  },
  admin: {
    icon: 'fa-solid fa-shield-halved',
    badge: 'bg-[#111827] text-white',
  },
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getNotificationTypeLabel(type) {
  return (
    typeMap[
      String(type || '').toLowerCase()
    ] || 'System'
  )
}

function getAction(type) {
  return (
    actionMap[
      String(type || '').toLowerCase()
    ] || {
      icon: 'fa-solid fa-bell',
      badge: 'bg-[#111827] text-white',
    }
  )
}

function formatTime(value) {
  if (!value) return 'Now'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Now'
  }

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(
    diffMs / 60000
  )

  if (diffMinutes < 1) return 'Now'
  if (diffMinutes < 60) {
    return `${diffMinutes}m`
  }

  const diffHours = Math.floor(
    diffMinutes / 60
  )

  if (diffHours < 24) {
    return `${diffHours}h`
  }

  const diffDays = Math.floor(
    diffHours / 24
  )

  if (diffDays < 7) {
    return `${diffDays}d`
  }

  return date.toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
    }
  )
}

function getActorMetadata(metadata = {}) {
  return {
    name:
      metadata.reader_name ||
      metadata.reviewer_name ||
      metadata.buyer_name ||
      metadata.actor_name ||
      '',
    username:
      metadata.reader_username ||
      metadata.reviewer_username ||
      metadata.buyer_username ||
      metadata.actor_username ||
      '',
    avatarUrl:
      metadata.reader_avatar_url ||
      metadata.reviewer_avatar_url ||
      metadata.buyer_avatar_url ||
      metadata.actor_avatar_url ||
      '',
  }
}

function normalizeNotification(item) {
  const metadata =
    item.metadata &&
    typeof item.metadata === 'object'
      ? item.metadata
      : {}
  const actor =
    getActorMetadata(metadata)
  const effectiveType =
    metadata.notification_type ||
    item.type ||
    'system'

  return {
    id: item.id,
    type: effectiveType,
    typeLabel:
      getNotificationTypeLabel(
        effectiveType
      ),
    title:
      item.title || 'Notification',
    message: item.message || '',
    targetUrl:
      item.target_url ||
      item.targetUrl ||
      '',
    unread: !Boolean(item.is_read),
    time: formatTime(
      item.created_at
    ),
    createdAt:
      item.created_at || '',
    metadata,
    actorName: actor.name,
    actorUsername: actor.username,
    actorAvatarUrl:
      actor.avatarUrl,
  }
}

async function apiRequest(
  path,
  options = {}
) {
  const token = getAuthToken()

  if (!token) {
    throw new Error(
      'Please login first'
    )
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body
          ? {
              'Content-Type':
                'application/json',
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (
    !response.ok ||
    data.ok === false
  ) {
    throw new Error(
      data.message ||
        'Request failed'
    )
  }

  return data
}

async function fetchPageNotifications(
  before = ''
) {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
  })

  if (before) {
    params.set('before', before)
  }

  const data = await apiRequest(
    `/api/authors/me/page-notifications?${params.toString()}`
  )

  return {
    notifications: Array.isArray(
      data.notifications
    )
      ? data.notifications.map(
          normalizeNotification
        )
      : [],
    unreadCount: Number(
      data.unread_count || 0
    ),
    preferences:
      data.preferences &&
      typeof data.preferences ===
        'object'
        ? data.preferences
        : {},
    hasMore: Boolean(data.has_more),
    nextCursor:
      data.next_cursor || '',
  }
}

function markNotificationRead(
  notificationId
) {
  return apiRequest(
    `/api/authors/me/page-notifications/${encodeURIComponent(
      notificationId
    )}/read`,
    {
      method: 'PATCH',
    }
  )
}

function markNotificationUnread(
  notificationId
) {
  return apiRequest(
    `/api/authors/me/page-notifications/${encodeURIComponent(
      notificationId
    )}/unread`,
    {
      method: 'PATCH',
    }
  )
}

function deleteNotification(
  notificationId
) {
  return apiRequest(
    `/api/authors/me/page-notifications/${encodeURIComponent(
      notificationId
    )}`,
    {
      method: 'DELETE',
    }
  )
}

function markAllNotificationsRead() {
  return apiRequest(
    '/api/authors/me/page-notifications/read-all',
    {
      method: 'PATCH',
    }
  )
}

function updateNotificationPreference(
  type,
  isEnabled,
  frequencyLevel = 'normal'
) {
  return apiRequest(
    `/api/authors/me/page-notification-preferences/${encodeURIComponent(
      type
    )}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        is_enabled: isEnabled,
        frequency_level:
          frequencyLevel,
      }),
    }
  )
}

function NotificationAvatar({
  notification,
}) {
  const action = getAction(
    notification.type
  )
  const fallbackText = String(
    notification.actorName ||
      notification.typeLabel ||
      'N'
  )
    .trim()
    .slice(0, 1)
    .toUpperCase()

  return (
    <div className="relative h-14 w-14 shrink-0">
      {notification.actorAvatarUrl ? (
        <img
          src={
            notification.actorAvatarUrl
          }
          alt=""
          className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5e7eb] text-[18px] font-bold text-[#4b5563]">
          {fallbackText}
        </div>
      )}

      <span
        className={`absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${action.badge}`}
      >
        <i
          className={`${action.icon} text-[10px]`}
        />
      </span>
    </div>
  )
}

function NotificationItem({
  notification,
  onOpen,
  onOptions,
}) {
  return (
    <div
      className={`flex w-full items-start gap-3 px-4 py-3 transition ${
        notification.unread
          ? 'bg-[#eef6ff]'
          : 'bg-white'
      }`}
    >
      <button
        type="button"
        onClick={() =>
          onOpen(notification)
        }
        className="flex min-w-0 flex-1 items-start gap-3 text-left active:opacity-80"
      >
        <NotificationAvatar
          notification={notification}
        />

        <div className="min-w-0 flex-1 pt-0.5">
          <p
            className={`line-clamp-3 text-[14px] leading-5 text-[#111827] ${
              notification.unread
                ? 'font-bold'
                : 'font-semibold'
            }`}
          >
            {notification.title}
            {notification.message ? (
              <span className="font-medium text-[#4b5563]">
                {' '}
                ·{' '}
                {
                  notification.message
                }
              </span>
            ) : null}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`text-[12px] ${
                notification.unread
                  ? 'font-bold text-[#1877f2]'
                  : 'font-semibold text-[#8b93a1]'
              }`}
            >
              {notification.time}
            </span>

            <span className="h-1 w-1 rounded-full bg-[#cbd5e1]" />

            <span className="text-[12px] font-semibold text-[#8b93a1]">
              {
                notification.typeLabel
              }
            </span>
          </div>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-1 pt-1">
        {notification.unread ? (
          <span className="h-3 w-3 rounded-full bg-[#1877f2]" />
        ) : null}

        <button
          type="button"
          onClick={() =>
            onOptions(notification)
          }
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] active:bg-[#eef0f4]"
          aria-label="Notification options"
        >
          <i className="fa-solid fa-ellipsis text-[15px]" />
        </button>
      </div>
    </div>
  )
}

function NotificationGroup({
  title,
  notifications,
  onOpen,
  onOptions,
}) {
  if (!notifications.length) {
    return null
  }

  return (
    <section className="bg-white">
      <h2 className="px-4 pb-2 pt-4 text-[15px] font-bold text-[#111827]">
        {title}
      </h2>

      <div className="bg-white">
        {notifications.map(
          (notification) => (
            <NotificationItem
              key={notification.id}
              notification={
                notification
              }
              onOpen={onOpen}
              onOptions={onOptions}
            />
          )
        )}
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <div className="px-4 py-4">
      {Array.from({
        length: 7,
      }).map((_, index) => (
        <div
          key={index}
          className="mb-3 flex animate-pulse gap-3 py-2"
        >
          <div className="h-14 w-14 shrink-0 rounded-full bg-[#eef0f4]" />

          <div className="min-w-0 flex-1 pt-1">
            <div className="h-4 w-4/5 rounded bg-[#eef0f4]" />
            <div className="mt-2 h-3 w-2/5 rounded bg-[#f3f4f6]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ filter }) {
  return (
    <div className="bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-bell text-[20px]" />
      </div>

      <h2 className="text-[17px] font-bold text-[#111827]">
        No{' '}
        {filter.toLowerCase()}{' '}
        notifications
      </h2>

      <p className="mx-auto mt-2 max-w-[340px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        Comments, reactions,
        echoes, followers, reviews,
        orders, income, and admin
        notices will appear here.
      </p>
    </div>
  )
}

function OptionsSheet({
  notification,
  loading,
  notificationEnabled,
  frequencyLevel,
  onClose,
  onToggleRead,
  onShowMore,
  onShowLess,
  onToggleType,
  onDelete,
  onReport,
}) {
  const [dragging, setDragging] =
    useState(false)
  const [dragY, setDragY] =
    useState(0)
  const dragStartRef = useRef(0)
  const dragYRef = useRef(0)

  useEffect(() => {
    if (!notification) {
      return undefined
    }

    const scrollY = window.scrollY
    const body = document.body
    const html =
      document.documentElement
    const previousBodyOverflow =
      body.style.overflow
    const previousBodyPosition =
      body.style.position
    const previousBodyTop =
      body.style.top
    const previousBodyWidth =
      body.style.width
    const previousHtmlOverflow =
      html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow =
        previousBodyOverflow
      body.style.position =
        previousBodyPosition
      body.style.top =
        previousBodyTop
      body.style.width =
        previousBodyWidth
      html.style.overflow =
        previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [notification])

  if (!notification) return null

  const fallbackText = String(
    notification.actorName ||
      notification.typeLabel ||
      'N'
  )
    .trim()
    .slice(0, 1)
    .toUpperCase()

  const closeSheet = () => {
    dragYRef.current = 0
    setDragY(0)
    setDragging(false)
    onClose()
  }

  const handleDragStart = (
    event
  ) => {
    dragStartRef.current =
      event.clientY
    dragYRef.current = 0
    setDragY(0)
    setDragging(true)
    event.currentTarget.setPointerCapture(
      event.pointerId
    )
  }

  const handleDragMove = (
    event
  ) => {
    if (!dragging) return

    const nextDragY = Math.max(
      0,
      event.clientY -
        dragStartRef.current
    )

    dragYRef.current = nextDragY
    setDragY(nextDragY)
  }

  const handleDragEnd = () => {
    if (!dragging) return

    setDragging(false)

    if (dragYRef.current >= 80) {
      closeSheet()
      return
    }

    dragYRef.current = 0
    setDragY(0)
  }

  const actionClass =
    'flex min-h-12 w-full items-center gap-4 rounded-[12px] px-2 py-3 text-left text-[15px] font-normal transition hover:bg-black/[0.055] active:bg-black/[0.09] disabled:opacity-40'

  return (
    <div
      className="fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label="Notification options"
    >
      <button
        type="button"
        onClick={closeSheet}
        className="absolute inset-0 bg-black/45"
        aria-label="Close notification options"
      />

      <section
        className={`absolute inset-x-0 bottom-0 mx-auto max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-t-[24px] bg-white pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(17,24,39,0.22)] ${
          dragging
            ? ''
            : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          transform: `translateY(${dragY}px)`,
        }}
      >
        <div
          className="touch-none pb-2 pt-2"
          onPointerDown={
            handleDragStart
          }
          onPointerMove={
            handleDragMove
          }
          onPointerUp={
            handleDragEnd
          }
          onPointerCancel={
            handleDragEnd
          }
        >
          <div className="mx-auto h-1.5 w-11 rounded-full bg-[#cfd3da]" />
        </div>

        <div className="px-5 pb-3 text-center">
          {notification.actorAvatarUrl ? (
            <img
              src={
                notification.actorAvatarUrl
              }
              alt=""
              className="mx-auto h-12 w-12 rounded-full object-cover ring-1 ring-black/5"
            />
          ) : (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e5e7eb] text-[16px] font-semibold text-[#4b5563]">
              {fallbackText}
            </div>
          )}

          <p className="mx-auto mt-3 max-w-[330px] text-[13px] font-normal leading-5 text-[#4b5563]">
            <span className="text-[#111827]">
              {notification.title}
            </span>

            {notification.message
              ? ` · ${notification.message}`
              : ''}
          </p>
        </div>

        <div className="px-4 pb-1 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={onShowMore}
            className={`${actionClass} ${
              frequencyLevel === 'more'
                ? 'bg-black/[0.055] text-black'
                : 'text-[#5f6368]'
            }`}
          >
            <i className="fa-solid fa-plus w-5 text-center text-[16px]" />

            <span className="flex-1">
              Show more
            </span>

            {frequencyLevel ===
            'more' ? (
              <i className="fa-solid fa-check text-[12px]" />
            ) : null}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onShowLess}
            className={`${actionClass} ${
              frequencyLevel === 'less'
                ? 'bg-black/[0.055] text-black'
                : 'text-[#5f6368]'
            }`}
          >
            <i className="fa-solid fa-minus w-5 text-center text-[16px]" />

            <span className="flex-1">
              Show less
            </span>

            {frequencyLevel ===
            'less' ? (
              <i className="fa-solid fa-check text-[12px]" />
            ) : null}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onToggleRead}
            className={`${actionClass} text-black`}
          >
            <i
              className={`w-5 text-center text-[16px] ${
                notification.unread
                  ? 'fa-solid fa-check'
                  : 'fa-regular fa-envelope'
              }`}
            />

            <span>
              {notification.unread
                ? 'Mark as read'
                : 'Mark as unread'}
            </span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onToggleType}
            className={`${actionClass} text-black`}
          >
            <i
              className={`fa-solid ${
                notificationEnabled
                  ? 'fa-bell-slash'
                  : 'fa-bell'
              } w-5 text-center text-[16px]`}
            />

            <span>
              Turn{' '}
              {notificationEnabled
                ? 'off'
                : 'on'}{' '}
              {notification.typeLabel.toLowerCase()}{' '}
              notifications
            </span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onDelete}
            className={`${actionClass} text-black`}
          >
            <i className="fa-regular fa-trash-can w-5 text-center text-[16px]" />

            <span>
              Delete this notification
            </span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onReport}
            className={`${actionClass} text-black`}
          >
            <i className="fa-solid fa-triangle-exclamation w-5 text-center text-[16px]" />

            <span>
              Report issue to
              Notifications Team
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default function AuthorPageNotificationsPage() {
  const navigate = useNavigate()
  const {
  authorUnreadCount: unreadCount,
  setAuthorUnreadCount,
  adjustAuthorUnreadCount,
  lastCreatedNotification,
} = useAuthorPageNotifications()
  const [activeFilter, setActiveFilter] =
    useState('All')
  const [message, setMessage] =
    useState('')
  const [
    notifications,
    setNotifications,
  ] = useState([])
  const [
    preferences,
    setPreferences,
  ] = useState({})
  const [loading, setLoading] =
    useState(true)
  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false)
  const [hasMore, setHasMore] =
    useState(false)
  const [
    nextCursor,
    setNextCursor,
  ] = useState('')
 
  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState(null)
  const [
    optionsLoading,
    setOptionsLoading,
  ] = useState(false)

  const loadNotifications =
    useCallback(
      async ({
        append = false,
        cursor = '',
      } = {}) => {
        try {
          if (append) {
            setLoadingMore(true)
          } else {
            setLoading(true)
            setMessage('')
          }

          const data =
            await fetchPageNotifications(
              cursor
            )

          setNotifications(
            (current) => {
              if (!append) {
  const incomingIds = new Set(
    data.notifications.map((item) => item.id)
  )

  const liveItems = current.filter(
    (item) => !incomingIds.has(item.id)
  )

  return [
    ...liveItems,
    ...data.notifications,
  ]
}
              const currentIds =
                new Set(
                  current.map(
                    (item) => item.id
                  )
                )

              return [
                ...current,
                ...data.notifications.filter(
                  (item) =>
                    !currentIds.has(
                      item.id
                    )
                ),
              ]
            }
          )

          setAuthorUnreadCount(
  data.unreadCount
)
          setPreferences(
            data.preferences
          )
          setHasMore(data.hasMore)
          setNextCursor(
            data.nextCursor
          )
        } catch (error) {
          if (!append) {
            setNotifications([])
            setPreferences({})

            setHasMore(false)
            setNextCursor('')
          }

          setMessage(
            error.message ||
              'Failed to load notifications'
          )
        } finally {
          if (append) {
            setLoadingMore(false)
          } else {
            setLoading(false)
          }
        }
      },
      [setAuthorUnreadCount]
    )

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
  if (!lastCreatedNotification?.id) return

  const notification =
    normalizeNotification(
      lastCreatedNotification
    )

  setNotifications((current) => {
    if (
      current.some(
        (item) =>
          item.id === notification.id
      )
    ) {
      return current
    }

    return [
      notification,
      ...current,
    ]
  })
}, [lastCreatedNotification])

  const filteredNotifications =
    useMemo(() => {
      if (activeFilter === 'All') {
        return notifications
      }

      if (
        activeFilter === 'Unread'
      ) {
        return notifications.filter(
          (item) => item.unread
        )
      }

      return notifications.filter(
        (item) =>
          item.typeLabel ===
          activeFilter
      )
    }, [
      activeFilter,
      notifications,
    ])

  const newNotifications =
    filteredNotifications.filter(
      (item) => item.unread
    )

  const earlierNotifications =
    filteredNotifications.filter(
      (item) => !item.unread
    )

  const selectedPreference =
    selectedNotification
      ? preferences[
          selectedNotification.type
        ] || {
          is_enabled: true,
          frequency_level: 'normal',
        }
      : {
          is_enabled: true,
          frequency_level: 'normal',
        }

  async function handleOpen(
  notification
) {
  if (notification.unread) {
    setNotifications((current) =>
      current.map((item) =>
        item.id ===
        notification.id
          ? {
              ...item,
              unread: false,
            }
          : item
      )
    )

    adjustAuthorUnreadCount(-1)

    markNotificationRead(
      notification.id
    ).catch(() => null)
  }

  const postActivityTypes = [
    'comment',
    'comments',
    'mention',
    'mentions',
    'reaction',
    'echo',
    'post',
    'posts',
  ]

  const notificationType = String(
    notification.type || ''
  ).toLowerCase()

  const activityRoute =
    postActivityTypes.includes(notificationType)
      ? resolveAuthorPostActivityRoute(
          notification
        )
      : ''

  if (activityRoute) {
    navigate(activityRoute)
    return
  }

  if (notification.targetUrl) {
    navigate(
      notification.targetUrl
    )
    return
  }

  setMessage(
    'This notification does not have a target page yet.'
  )
}

  function handleOptions(
    notification
  ) {
    setMessage('')
    setSelectedNotification(
      notification
    )
  }

  async function handleToggleRead() {
    if (
      !selectedNotification ||
      optionsLoading
    ) {
      return
    }

    try {
      setOptionsLoading(true)

      if (
        selectedNotification.unread
      ) {
        await markNotificationRead(
          selectedNotification.id
        )
      } else {
        await markNotificationUnread(
          selectedNotification.id
        )
      }

      const nextUnread =
        !selectedNotification.unread

      setNotifications((current) =>
        current.map((item) =>
          item.id ===
          selectedNotification.id
            ? {
                ...item,
                unread: nextUnread,
              }
            : item
        )
      )

      adjustAuthorUnreadCount(
  selectedNotification.unread ? -1 : 1
)

      setSelectedNotification(null)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to update notification'
      )
    } finally {
      setOptionsLoading(false)
    }
  }

  async function handleFrequency(
    level
  ) {
    if (
      !selectedNotification ||
      optionsLoading
    ) {
      return
    }

    const notificationType =
      selectedNotification.type

    try {
      setOptionsLoading(true)

      const data =
        await updateNotificationPreference(
          notificationType,
          true,
          level
        )

      const preference =
        data.preference || {
          type: notificationType,
          is_enabled: true,
          frequency_level: level,
        }

      setPreferences((current) => ({
        ...current,
        [notificationType]: {
          is_enabled:
            preference.is_enabled !==
            false,
          frequency_level:
            preference.frequency_level ||
            level,
        },
      }))

      setSelectedNotification(null)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to update notification preference'
      )
    } finally {
      setOptionsLoading(false)
    }
  }

  async function handleToggleType() {
    if (
      !selectedNotification ||
      optionsLoading
    ) {
      return
    }

    const notificationType =
      selectedNotification.type
    const currentPreference =
      preferences[
        notificationType
      ] || {
        is_enabled: true,
        frequency_level: 'normal',
      }
    const nextEnabled =
      currentPreference.is_enabled ===
      false

    try {
      setOptionsLoading(true)

      const data =
        await updateNotificationPreference(
          notificationType,
          nextEnabled,
          currentPreference.frequency_level ||
            'normal'
        )

      const preference =
        data.preference || {
          type: notificationType,
          is_enabled: nextEnabled,
          frequency_level:
            currentPreference.frequency_level ||
            'normal',
        }

      setPreferences((current) => ({
        ...current,
        [notificationType]: {
          is_enabled:
            preference.is_enabled !==
            false,
          frequency_level:
            preference.frequency_level ||
            currentPreference.frequency_level ||
            'normal',
        },
      }))

      setSelectedNotification(null)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to update notification preference'
      )
    } finally {
      setOptionsLoading(false)
    }
  }

  async function handleDelete() {
    if (
      !selectedNotification ||
      optionsLoading
    ) {
      return
    }

    try {
      setOptionsLoading(true)

      await deleteNotification(
        selectedNotification.id
      )

      setNotifications((current) =>
        current.filter(
          (item) =>
            item.id !==
            selectedNotification.id
        )
      )

      if (
        selectedNotification.unread
      ) {
        adjustAuthorUnreadCount(-1)
      }

      setSelectedNotification(null)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to delete notification'
      )
    } finally {
      setOptionsLoading(false)
    }
  }

  async function handleMarkAllRead() {
    if (!unreadCount) return

    try {
      await markAllNotificationsRead()

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          unread: false,
        }))
      )

      setAuthorUnreadCount(0)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to mark notifications as read'
      )
    }
  }

  function handleLoadMore() {
    if (
      loadingMore ||
      !hasMore ||
      !nextCursor
    ) {
      return
    }

    loadNotifications({
      append: true,
      cursor: nextCursor,
    })
  }

  return (
    <div className="min-h-screen bg-white pb-[92px]">
      <div
        className={`sticky top-0 z-40 bg-white ${
          selectedNotification
            ? 'invisible'
            : ''
        }`}
      >
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() =>
              navigate('/author/page')
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back to page"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[18px] font-bold text-[#111827]">
            Page Notifications
          </div>

          <div className="flex items-center gap-1">
  <button
    type="button"
    onClick={() =>
      navigate('/author/page/chat')
    }
    className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6] active:scale-95"
    aria-label="Open Page messages"
  >
    <i className="fa-regular fa-paper-plane text-[18px]" />
  </button>

  <button
    type="button"
    onClick={
      handleMarkAllRead
    }
    disabled={!unreadCount}
    className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95 disabled:opacity-30"
    aria-label="Mark all as read"
  >
    <i className="fa-solid fa-broom text-[17px]" />
  </button>
</div>
        </div>
      </div>

      <main className="mx-auto min-h-[calc(100vh-148px)] max-w-[980px] bg-white">
        {message ? (
          <button
            type="button"
            onClick={() =>
              setMessage('')
            }
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
          >
            {message}
          </button>
        ) : null}

        <section className="sticky top-14 z-30 bg-white">
          <div className="flex gap-2 overflow-x-auto px-4 py-2">
            {filters.map((filter) => {
              const active =
                activeFilter === filter

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter
                    )
                  }
                  className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition hover:bg-black/[0.045] active:scale-[0.98] ${
                    active
                      ? 'bg-black/[0.065] font-semibold text-[#111827]'
                      : 'bg-transparent font-normal text-[#9ca3af]'
                  }`}
                >
                  {filter}

                  {filter ===
                    'Unread' &&
                  unreadCount > 0 ? (
                    <span className="ml-1.5 text-[11px] font-bold">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>

        {loading ? (
          <LoadingState />
        ) : filteredNotifications.length ? (
          <div className="bg-white">
            <NotificationGroup
              title="New"
              notifications={
                newNotifications
              }
              onOpen={handleOpen}
              onOptions={
                handleOptions
              }
            />

            <NotificationGroup
              title="Earlier"
              notifications={
                earlierNotifications
              }
              onOpen={handleOpen}
              onOptions={
                handleOptions
              }
            />

            {hasMore ? (
              <div className="px-4 py-5">
                <button
                  type="button"
                  onClick={
                    handleLoadMore
                  }
                  disabled={
                    loadingMore
                  }
                  className="h-11 w-full rounded-full bg-[#f3f4f6] text-[13px] font-semibold text-[#111827] active:scale-[0.99] disabled:text-[#9ca3af]"
                >
                  {loadingMore
                    ? 'Loading...'
                    : 'Load more notifications'}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState
            filter={activeFilter}
          />
        )}
      </main>

      <div
        className={
          selectedNotification
            ? 'invisible'
            : ''
        }
      >
        <AuthorPageFooter active="Notifications" />
      </div>

      <OptionsSheet
        notification={
          selectedNotification
        }
        loading={optionsLoading}
        notificationEnabled={
          selectedPreference.is_enabled !==
          false
        }
        frequencyLevel={
          selectedPreference.frequency_level ||
          'normal'
        }
        onClose={() => {
          if (!optionsLoading) {
            setSelectedNotification(
              null
            )
          }
        }}
        onToggleRead={
          handleToggleRead
        }
        onShowMore={() =>
          handleFrequency('more')
        }
        onShowLess={() =>
          handleFrequency('less')
        }
        onToggleType={
          handleToggleType
        }
        onDelete={handleDelete}
        onReport={() => {
          setSelectedNotification(null)
          navigate('/feedback')
        }}
      />
    </div>
  )
}

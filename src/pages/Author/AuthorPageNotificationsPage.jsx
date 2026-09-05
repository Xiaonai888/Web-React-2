import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageNotifications', {
  "en": {
    "all": "All",
    "unread": "Unread",
    "comments": "Comments",
    "activity": "Activity",
    "orders": "Orders",
    "income": "Income",
    "system": "System",
    "notification": "Notification",
    "now": "Now",
    "minutes": "{{count}}m",
    "hours": "{{count}}h",
    "days": "{{count}}d",
    "pleaseLogin": "Please login first",
    "requestFailed": "Request failed",
    "options": "Notification options",
    "closeOptions": "Close notification options",
    "showMore": "Show more",
    "showLess": "Show less",
    "markRead": "Mark as read",
    "markUnread": "Mark as unread",
    "turnOffType": "Turn off {{type}} notifications",
    "turnOnType": "Turn on {{type}} notifications",
    "deleteNotification": "Delete this notification",
    "reportTeam": "Report issue to Notifications Team",
    "noFilterNotifications": "No {{filter}} notifications",
    "emptyHelp": "Comments, reactions, echoes, followers, reviews, orders, income, and admin notices will appear here.",
    "loadFailed": "Failed to load notifications",
    "noTarget": "This notification does not have a target page yet.",
    "updateFailed": "Failed to update notification",
    "preferenceFailed": "Failed to update notification preference",
    "deleteFailed": "Failed to delete notification",
    "markAllFailed": "Failed to mark notifications as read",
    "backPage": "Back to page",
    "pageNotifications": "Page Notifications",
    "openMessages": "Open Page messages",
    "markAllRead": "Mark all as read",
    "new": "New",
    "earlier": "Earlier",
    "loading": "Loading...",
    "loadMore": "Load more notifications",
    "footerNotifications": "Notifications"
  },
  "km": {
    "all": "ទាំងអស់",
    "unread": "មិនទាន់អាន",
    "comments": "មតិយោបល់",
    "activity": "សកម្មភាព",
    "orders": "ការបញ្ជាទិញ",
    "income": "ចំណូល",
    "system": "ប្រព័ន្ធ",
    "notification": "ការជូនដំណឹង",
    "now": "ឥឡូវនេះ",
    "minutes": "{{count}}នាទី",
    "hours": "{{count}}ម៉ោង",
    "days": "{{count}}ថ្ងៃ",
    "pleaseLogin": "សូមចូលគណនីជាមុន",
    "requestFailed": "សំណើបានបរាជ័យ",
    "options": "ជម្រើសការជូនដំណឹង",
    "closeOptions": "បិទជម្រើសការជូនដំណឹង",
    "showMore": "បង្ហាញច្រើនជាងនេះ",
    "showLess": "បង្ហាញតិចជាងនេះ",
    "markRead": "សម្គាល់ថាបានអាន",
    "markUnread": "សម្គាល់ថាមិនទាន់អាន",
    "turnOffType": "បិទការជូនដំណឹង {{type}}",
    "turnOnType": "បើកការជូនដំណឹង {{type}}",
    "deleteNotification": "លុបការជូនដំណឹងនេះ",
    "reportTeam": "រាយការណ៍បញ្ហាទៅក្រុម Notifications",
    "noFilterNotifications": "មិនមានការជូនដំណឹង {{filter}}",
    "emptyHelp": "មតិយោបល់ ប្រតិកម្ម Echo អ្នក Follow Review ការបញ្ជាទិញ ចំណូល និងសេចក្តីជូនដំណឹងពី Admin នឹងបង្ហាញនៅទីនេះ។",
    "loadFailed": "មិនអាចផ្ទុកការជូនដំណឹងបានទេ",
    "noTarget": "ការជូនដំណឹងនេះមិនទាន់មានទំព័រគោលដៅទេ។",
    "updateFailed": "មិនអាចកែការជូនដំណឹងបានទេ",
    "preferenceFailed": "មិនអាចកែការកំណត់ការជូនដំណឹងបានទេ",
    "deleteFailed": "មិនអាចលុបការជូនដំណឹងបានទេ",
    "markAllFailed": "មិនអាចសម្គាល់ការជូនដំណឹងថាបានអានបានទេ",
    "backPage": "ត្រឡប់ទៅទំព័រ",
    "pageNotifications": "ការជូនដំណឹងទំព័រ",
    "openMessages": "បើកសារទំព័រ",
    "markAllRead": "សម្គាល់ទាំងអស់ថាបានអាន",
    "new": "ថ្មី",
    "earlier": "មុននេះ",
    "loading": "កំពុងផ្ទុក...",
    "loadMore": "ផ្ទុកការជូនដំណឹងបន្ថែម",
    "footerNotifications": "ការជូនដំណឹង"
  },
  "zh": {
    "all": "全部",
    "unread": "未读",
    "comments": "评论",
    "activity": "动态",
    "orders": "订单",
    "income": "收入",
    "system": "系统",
    "notification": "通知",
    "now": "刚刚",
    "minutes": "{{count}}分钟",
    "hours": "{{count}}小时",
    "days": "{{count}}天",
    "pleaseLogin": "请先登录",
    "requestFailed": "请求失败",
    "options": "通知选项",
    "closeOptions": "关闭通知选项",
    "showMore": "显示更多",
    "showLess": "显示更少",
    "markRead": "标记为已读",
    "markUnread": "标记为未读",
    "turnOffType": "关闭{{type}}通知",
    "turnOnType": "开启{{type}}通知",
    "deleteNotification": "删除此通知",
    "reportTeam": "向通知团队报告问题",
    "noFilterNotifications": "没有{{filter}}通知",
    "emptyHelp": "评论、反应、Echo、关注、评价、订单、收入和管理员通知会显示在这里。",
    "loadFailed": "无法加载通知",
    "noTarget": "此通知暂时没有目标页面。",
    "updateFailed": "无法更新通知",
    "preferenceFailed": "无法更新通知偏好",
    "deleteFailed": "无法删除通知",
    "markAllFailed": "无法将通知标记为已读",
    "backPage": "返回页面",
    "pageNotifications": "页面通知",
    "openMessages": "打开页面消息",
    "markAllRead": "全部标记为已读",
    "new": "新通知",
    "earlier": "较早",
    "loading": "加载中...",
    "loadMore": "加载更多通知",
    "footerNotifications": "通知"
  },
  "ja": {
    "all": "すべて",
    "unread": "未読",
    "comments": "コメント",
    "activity": "アクティビティ",
    "orders": "注文",
    "income": "収益",
    "system": "システム",
    "notification": "通知",
    "now": "今",
    "minutes": "{{count}}分",
    "hours": "{{count}}時間",
    "days": "{{count}}日",
    "pleaseLogin": "先にログインしてください",
    "requestFailed": "リクエストに失敗しました",
    "options": "通知オプション",
    "closeOptions": "通知オプションを閉じる",
    "showMore": "表示を増やす",
    "showLess": "表示を減らす",
    "markRead": "既読にする",
    "markUnread": "未読にする",
    "turnOffType": "{{type}}通知をオフにする",
    "turnOnType": "{{type}}通知をオンにする",
    "deleteNotification": "この通知を削除",
    "reportTeam": "通知チームに問題を報告",
    "noFilterNotifications": "{{filter}}通知はありません",
    "emptyHelp": "コメント、リアクション、Echo、フォロワー、レビュー、注文、収益、管理者通知がここに表示されます。",
    "loadFailed": "通知を読み込めませんでした",
    "noTarget": "この通知にはまだ移動先ページがありません。",
    "updateFailed": "通知を更新できませんでした",
    "preferenceFailed": "通知設定を更新できませんでした",
    "deleteFailed": "通知を削除できませんでした",
    "markAllFailed": "通知を既読にできませんでした",
    "backPage": "ページに戻る",
    "pageNotifications": "ページ通知",
    "openMessages": "ページメッセージを開く",
    "markAllRead": "すべて既読にする",
    "new": "新着",
    "earlier": "以前",
    "loading": "読み込み中...",
    "loadMore": "通知をさらに読み込む",
    "footerNotifications": "通知"
  },
  "ko": {
    "all": "전체",
    "unread": "읽지 않음",
    "comments": "댓글",
    "activity": "활동",
    "orders": "주문",
    "income": "수입",
    "system": "시스템",
    "notification": "알림",
    "now": "지금",
    "minutes": "{{count}}분",
    "hours": "{{count}}시간",
    "days": "{{count}}일",
    "pleaseLogin": "먼저 로그인해 주세요",
    "requestFailed": "요청에 실패했습니다",
    "options": "알림 옵션",
    "closeOptions": "알림 옵션 닫기",
    "showMore": "더 많이 보기",
    "showLess": "덜 보기",
    "markRead": "읽음으로 표시",
    "markUnread": "읽지 않음으로 표시",
    "turnOffType": "{{type}} 알림 끄기",
    "turnOnType": "{{type}} 알림 켜기",
    "deleteNotification": "이 알림 삭제",
    "reportTeam": "알림 팀에 문제 신고",
    "noFilterNotifications": "{{filter}} 알림이 없습니다",
    "emptyHelp": "댓글, 반응, Echo, 팔로워, 리뷰, 주문, 수입 및 관리자 알림이 여기에 표시됩니다.",
    "loadFailed": "알림을 불러오지 못했습니다",
    "noTarget": "이 알림에는 아직 이동할 페이지가 없습니다.",
    "updateFailed": "알림을 업데이트하지 못했습니다",
    "preferenceFailed": "알림 설정을 업데이트하지 못했습니다",
    "deleteFailed": "알림을 삭제하지 못했습니다",
    "markAllFailed": "알림을 읽음으로 표시하지 못했습니다",
    "backPage": "페이지로 돌아가기",
    "pageNotifications": "페이지 알림",
    "openMessages": "페이지 메시지 열기",
    "markAllRead": "모두 읽음으로 표시",
    "new": "새 알림",
    "earlier": "이전",
    "loading": "로딩 중...",
    "loadMore": "알림 더 보기",
    "footerNotifications": "알림"
  }
})

function pageNotificationText(key, options) {
  return getDisplayText(`authorPageNotifications.${key}`, options)
}

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
  { value: 'all', labelKey: 'all' },
  { value: 'unread', labelKey: 'unread' },
  { value: 'comments', labelKey: 'comments' },
  { value: 'activity', labelKey: 'activity' },
  { value: 'orders', labelKey: 'orders' },
  { value: 'income', labelKey: 'income' },
]

const typeMap = {
  comments: 'comments',
  comment: 'comments',
  mention: 'comments',
  mentions: 'comments',
  reaction: 'activity',
  echo: 'activity',
  follower: 'activity',
  review: 'activity',
  post: 'activity',
  posts: 'activity',
  orders: 'orders',
  order: 'orders',
  income: 'income',
  withdrawal: 'income',
  payout: 'income',
  system: 'system',
  admin: 'system',
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

function getNotificationTypeKey(type) {
  return (
    typeMap[
      String(type || '').toLowerCase()
    ] || 'system'
  )
}

function getNotificationTypeLabel(type) {
  return getNotificationTypeKey(type)
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
  if (!value) return pageNotificationText('now')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return pageNotificationText('now')
  }

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(
    diffMs / 60000
  )

  if (diffMinutes < 1) return pageNotificationText('now')
  if (diffMinutes < 60) {
    return pageNotificationText('minutes', { count: diffMinutes })
  }

  const diffHours = Math.floor(
    diffMinutes / 60
  )

  if (diffHours < 24) {
    return pageNotificationText('hours', { count: diffHours })
  }

  const diffDays = Math.floor(
    diffHours / 24
  )

  if (diffDays < 7) {
    return pageNotificationText('days', { count: diffDays })
  }

  return date.toLocaleDateString(
    getDisplayLanguageId(),
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
    typeKey:
      getNotificationTypeKey(
        effectiveType
      ),
    title:
      item.title || pageNotificationText('notification'),
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
      pageNotificationText('pleaseLogin')
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
        pageNotificationText('requestFailed')
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
      pageNotificationText(notification.typeKey || 'system') ||
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
          className="h-14 w-14 rounded-full object-cover ring-1 ring-[var(--shadow-border)]"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[18px] font-bold text-[var(--shadow-text-secondary)]">
          {fallbackText}
        </div>
      )}

      <span
        className={`absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--shadow-bg-surface)] ${action.badge}`}
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
          : 'bg-[var(--shadow-bg-surface)]'
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
            className={`line-clamp-3 text-[14px] leading-5 text-[var(--shadow-text-primary)] ${
              notification.unread
                ? 'font-bold'
                : 'font-semibold'
            }`}
          >
            {notification.title}
            {notification.message ? (
              <span className="font-medium text-[var(--shadow-text-secondary)]">
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
                  : 'font-semibold text-[var(--shadow-text-tertiary)]'
              }`}
            >
              {notification.time}
            </span>

            <span className="h-1 w-1 rounded-full bg-[var(--shadow-border-strong)]" />

            <span className="text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
              {
                pageNotificationText(notification.typeKey || 'system')
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
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
          aria-label={pageNotificationText('options')}
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
    <section className="bg-[var(--shadow-bg-surface)]">
      <h2 className="px-4 pb-2 pt-4 text-[15px] font-bold text-[var(--shadow-text-primary)]">
        {title}
      </h2>

      <div className="bg-[var(--shadow-bg-surface)]">
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
          <div className="h-14 w-14 shrink-0 rounded-full bg-[var(--shadow-bg-soft)]" />

          <div className="min-w-0 flex-1 pt-1">
            <div className="h-4 w-4/5 rounded bg-[var(--shadow-bg-soft)]" />
            <div className="mt-2 h-3 w-2/5 rounded bg-[var(--shadow-bg-hover)]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ filter }) {
  return (
    <div className="bg-[var(--shadow-bg-surface)] px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-hover)] text-[var(--shadow-text-primary)]">
        <i className="fa-regular fa-bell text-[20px]" />
      </div>

      <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
        {pageNotificationText('noFilterNotifications', {
          filter: pageNotificationText(filter || 'all'),
        })}
      </h2>

      <p className="mx-auto mt-2 max-w-[340px] text-[13px] font-semibold leading-6 text-[var(--shadow-text-tertiary)]">
        {pageNotificationText('emptyHelp')}
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
      pageNotificationText(notification.typeKey || 'system') ||
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
      aria-label={pageNotificationText('options')}
    >
      <button
        type="button"
        onClick={closeSheet}
        className="absolute inset-0 bg-black/45"
        aria-label={pageNotificationText('closeOptions')}
      />

      <section
        className={`absolute inset-x-0 bottom-0 mx-auto max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-t-[24px] bg-[var(--shadow-bg-surface)] pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(17,24,39,0.22)] ${
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
          <div className="mx-auto h-1.5 w-11 rounded-full bg-[var(--shadow-border-strong)]" />
        </div>

        <div className="px-5 pb-3 text-center">
          {notification.actorAvatarUrl ? (
            <img
              src={
                notification.actorAvatarUrl
              }
              alt=""
              className="mx-auto h-12 w-12 rounded-full object-cover ring-1 ring-[var(--shadow-border)]"
            />
          ) : (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[16px] font-semibold text-[var(--shadow-text-secondary)]">
              {fallbackText}
            </div>
          )}

          <p className="mx-auto mt-3 max-w-[330px] text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
            <span className="text-[var(--shadow-text-primary)]">
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
                ? 'bg-black/[0.055] text-[var(--shadow-text-primary)]'
                : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            <i className="fa-solid fa-plus w-5 text-center text-[16px]" />

            <span className="flex-1">
              {pageNotificationText('showMore')}
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
                ? 'bg-black/[0.055] text-[var(--shadow-text-primary)]'
                : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            <i className="fa-solid fa-minus w-5 text-center text-[16px]" />

            <span className="flex-1">
              {pageNotificationText('showLess')}
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
            className={`${actionClass} text-[var(--shadow-text-primary)]`}
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
                ? pageNotificationText('markRead')
                : pageNotificationText('markUnread')}
            </span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onToggleType}
            className={`${actionClass} text-[var(--shadow-text-primary)]`}
          >
            <i
              className={`fa-solid ${
                notificationEnabled
                  ? 'fa-bell-slash'
                  : 'fa-bell'
              } w-5 text-center text-[16px]`}
            />

            <span>
              {
              pageNotificationText(
                notificationEnabled ? 'turnOffType' : 'turnOnType',
                { type: pageNotificationText(notification.typeKey || 'system') }
              )
            }
            </span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onDelete}
            className={`${actionClass} text-[var(--shadow-text-primary)]`}
          >
            <i className="fa-regular fa-trash-can w-5 text-center text-[16px]" />

            <span>
              {pageNotificationText('deleteNotification')}
            </span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onReport}
            className={`${actionClass} text-[var(--shadow-text-primary)]`}
          >
            <i className="fa-solid fa-triangle-exclamation w-5 text-center text-[16px]" />

            <span>
              {pageNotificationText('reportTeam')}
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default function AuthorPageNotificationsPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const {
  authorUnreadCount: unreadCount,
  setAuthorUnreadCount,
  adjustAuthorUnreadCount,
  syncAuthorUnreadCount,
  lastCreatedNotification,
} = useAuthorPageNotifications()
  const [activeFilter, setActiveFilter] =
    useState('all')
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
              pageNotificationText('loadFailed')
          )
        } finally {
          if (append) {
            setLoadingMore(false)
          } else {
            setLoading(false)
          }
        }
            },
      []
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
      if (activeFilter === 'all') {
        return notifications
      }

      if (
        activeFilter === 'unread'
      ) {
        return notifications.filter(
          (item) => item.unread
        )
      }

      return notifications.filter(
        (item) =>
          item.typeKey ===
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
).catch(() => {
  setNotifications((current) =>
    current.map((item) =>
      item.id === notification.id
        ? { ...item, unread: true }
        : item
    )
  )

  syncAuthorUnreadCount()
})
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
    pageNotificationText('noTarget')
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
          pageNotificationText('updateFailed')
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
          pageNotificationText('preferenceFailed')
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
          pageNotificationText('preferenceFailed')
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
          pageNotificationText('deleteFailed')
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
          pageNotificationText('markAllFailed')
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
    <div className="min-h-screen bg-[var(--shadow-bg-surface)] pb-[92px]">
      <div
        className={`sticky top-0 z-40 bg-[var(--shadow-bg-surface)] ${
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            aria-label={pageNotificationText('backPage')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[18px] font-bold text-[var(--shadow-text-primary)]">
            {pageNotificationText('pageNotifications')}
          </div>

          <div className="flex items-center gap-1">
  <button
    type="button"
    onClick={() =>
      navigate('/author/page/chat')
    }
    className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)] active:scale-95"
    aria-label={pageNotificationText('openMessages')}
  >
    <i className="fa-regular fa-paper-plane text-[18px]" />
  </button>

  <button
    type="button"
    onClick={
      handleMarkAllRead
    }
    disabled={!unreadCount}
    className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-30"
    aria-label={pageNotificationText('markAllRead')}
  >
    <i className="fa-solid fa-broom text-[17px]" />
  </button>
</div>
        </div>
      </div>

      <main className="mx-auto min-h-[calc(100vh-148px)] max-w-[980px] bg-[var(--shadow-bg-surface)]">
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

        <section className="sticky top-14 z-30 bg-[var(--shadow-bg-surface)]">
          <div className="flex gap-2 overflow-x-auto px-4 py-2">
            {filters.map((filter) => {
              const active =
                activeFilter === filter.value

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter.value
                    )
                  }
                  className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition hover:bg-black/[0.045] active:scale-[0.98] ${
                    active
                      ? 'bg-black/[0.065] font-semibold text-[var(--shadow-text-primary)]'
                      : 'bg-transparent font-normal text-[var(--shadow-text-tertiary)]'
                  }`}
                >
                  {pageNotificationText(filter.labelKey)}

                  {filter.value ===
                    'unread' &&
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
          <div className="bg-[var(--shadow-bg-surface)]">
            <NotificationGroup
              title={pageNotificationText('new')}
              notifications={
                newNotifications
              }
              onOpen={handleOpen}
              onOptions={
                handleOptions
              }
            />

            <NotificationGroup
              title={pageNotificationText('earlier')}
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
                  className="h-11 w-full rounded-full bg-[var(--shadow-bg-hover)] text-[13px] font-semibold text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:text-[var(--shadow-text-tertiary)]"
                >
                  {loadingMore
                    ? pageNotificationText('loading')
                    : pageNotificationText('loadMore')}
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

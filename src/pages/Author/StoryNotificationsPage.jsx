import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyNotifications', {
  "en": {
    "all": "All",
    "unread": "Unread",
    "comments": "Comments",
    "likes": "Likes",
    "echoes": "Echoes",
    "income": "Income",
    "system": "System",
    "now": "Now",
    "minutesShort": "{{count}}m",
    "hoursShort": "{{count}}h",
    "daysShort": "{{count}}d",
    "notification": "Notification",
    "loginFirst": "Please login first",
    "requestFailed": "Request failed",
    "notificationOptions": "Notification options",
    "emptyTitle": "No {{filter}} notifications",
    "emptyBody": "Story comments, likes, echoes, Diamond unlocks, gifts, income, and publishing notices will appear here.",
    "closeOptions": "Close notification options",
    "showMore": "Show more",
    "showLess": "Show less",
    "markRead": "Mark as read",
    "markUnread": "Mark as unread",
    "turnOffType": "Turn off {{type}} notifications",
    "turnOnType": "Turn on {{type}} notifications",
    "deleteNotification": "Delete this notification",
    "reportIssue": "Report issue to Notifications Team",
    "loadFailed": "Failed to load notifications",
    "noTarget": "This notification does not have a target page yet.",
    "updateFailed": "Failed to update notification",
    "morePreference": "You will see more {{type}} notifications.",
    "lessPreference": "You will see fewer {{type}} notifications.",
    "preferenceFailed": "Failed to update notification preference",
    "typeOn": "{{type}} notifications are turned on.",
    "typeOff": "{{type}} notifications are turned off.",
    "deleteFailed": "Failed to delete notification",
    "allMarkedRead": "All notifications marked as read.",
    "markAllFailed": "Failed to mark notifications as read",
    "backDashboard": "Back to author dashboard",
    "title": "Story Notifications",
    "markAllRead": "Mark all as read",
    "new": "New",
    "earlier": "Earlier",
    "loading": "Loading...",
    "loadMore": "Load more notifications"
  },
  "km": {
    "all": "ទាំងអស់",
    "unread": "មិនទាន់អាន",
    "comments": "មតិយោបល់",
    "likes": "ចូលចិត្ត",
    "echoes": "Echoes",
    "income": "ចំណូល",
    "system": "ប្រព័ន្ធ",
    "now": "ឥឡូវ",
    "minutesShort": "{{count}}នាទី",
    "hoursShort": "{{count}}ម៉ោង",
    "daysShort": "{{count}}ថ្ងៃ",
    "notification": "ការជូនដំណឹង",
    "loginFirst": "សូមចូលគណនីជាមុន",
    "requestFailed": "សំណើបរាជ័យ",
    "notificationOptions": "ជម្រើសការជូនដំណឹង",
    "emptyTitle": "មិនមានការជូនដំណឹង {{filter}}",
    "emptyBody": "មតិយោបល់ ចូលចិត្ត Echoes ការដោះសោ Diamond អំណោយ ចំណូល និងការជូនដំណឹងបោះពុម្ពនឹងបង្ហាញនៅទីនេះ។",
    "closeOptions": "បិទជម្រើសការជូនដំណឹង",
    "showMore": "បង្ហាញច្រើនជាងនេះ",
    "showLess": "បង្ហាញតិចជាងនេះ",
    "markRead": "សម្គាល់ថាបានអាន",
    "markUnread": "សម្គាល់ថាមិនទាន់អាន",
    "turnOffType": "បិទការជូនដំណឹង {{type}}",
    "turnOnType": "បើកការជូនដំណឹង {{type}}",
    "deleteNotification": "លុបការជូនដំណឹងនេះ",
    "reportIssue": "រាយការណ៍បញ្ហាទៅក្រុម Notifications",
    "loadFailed": "មិនអាចផ្ទុកការជូនដំណឹងបានទេ",
    "noTarget": "ការជូនដំណឹងនេះមិនទាន់មានទំព័រគោលដៅទេ។",
    "updateFailed": "មិនអាចកែការជូនដំណឹងបានទេ",
    "morePreference": "អ្នកនឹងឃើញការជូនដំណឹង {{type}} ច្រើនជាងមុន។",
    "lessPreference": "អ្នកនឹងឃើញការជូនដំណឹង {{type}} តិចជាងមុន។",
    "preferenceFailed": "មិនអាចកែចំណូលចិត្តការជូនដំណឹងបានទេ",
    "typeOn": "ការជូនដំណឹង {{type}} ត្រូវបានបើក។",
    "typeOff": "ការជូនដំណឹង {{type}} ត្រូវបានបិទ។",
    "deleteFailed": "មិនអាចលុបការជូនដំណឹងបានទេ",
    "allMarkedRead": "បានសម្គាល់ការជូនដំណឹងទាំងអស់ថាបានអាន។",
    "markAllFailed": "មិនអាចសម្គាល់ការជូនដំណឹងថាបានអានបានទេ",
    "backDashboard": "ត្រឡប់ទៅ Dashboard អ្នកនិពន្ធ",
    "title": "ការជូនដំណឹងរឿង",
    "markAllRead": "សម្គាល់ទាំងអស់ថាបានអាន",
    "new": "ថ្មី",
    "earlier": "មុននេះ",
    "loading": "កំពុងផ្ទុក...",
    "loadMore": "ផ្ទុកការជូនដំណឹងបន្ថែម"
  },
  "zh": {
    "all": "全部",
    "unread": "未读",
    "comments": "评论",
    "likes": "点赞",
    "echoes": "转发",
    "income": "收入",
    "system": "系统",
    "now": "现在",
    "minutesShort": "{{count}}分钟",
    "hoursShort": "{{count}}小时",
    "daysShort": "{{count}}天",
    "notification": "通知",
    "loginFirst": "请先登录",
    "requestFailed": "请求失败",
    "notificationOptions": "通知选项",
    "emptyTitle": "没有{{filter}}通知",
    "emptyBody": "故事评论、点赞、转发、Diamond 解锁、礼物、收入和发布通知会显示在这里。",
    "closeOptions": "关闭通知选项",
    "showMore": "显示更多",
    "showLess": "显示更少",
    "markRead": "标记为已读",
    "markUnread": "标记为未读",
    "turnOffType": "关闭{{type}}通知",
    "turnOnType": "开启{{type}}通知",
    "deleteNotification": "删除此通知",
    "reportIssue": "向通知团队报告问题",
    "loadFailed": "无法加载通知",
    "noTarget": "此通知暂时没有目标页面。",
    "updateFailed": "无法更新通知",
    "morePreference": "你将看到更多{{type}}通知。",
    "lessPreference": "你将看到更少{{type}}通知。",
    "preferenceFailed": "无法更新通知偏好",
    "typeOn": "{{type}}通知已开启。",
    "typeOff": "{{type}}通知已关闭。",
    "deleteFailed": "无法删除通知",
    "allMarkedRead": "所有通知已标记为已读。",
    "markAllFailed": "无法将通知标记为已读",
    "backDashboard": "返回作者控制台",
    "title": "故事通知",
    "markAllRead": "全部标记为已读",
    "new": "新通知",
    "earlier": "更早",
    "loading": "加载中...",
    "loadMore": "加载更多通知"
  },
  "ja": {
    "all": "すべて",
    "unread": "未読",
    "comments": "コメント",
    "likes": "いいね",
    "echoes": "エコー",
    "income": "収益",
    "system": "システム",
    "now": "今",
    "minutesShort": "{{count}}分",
    "hoursShort": "{{count}}時間",
    "daysShort": "{{count}}日",
    "notification": "通知",
    "loginFirst": "先にログインしてください",
    "requestFailed": "リクエストに失敗しました",
    "notificationOptions": "通知オプション",
    "emptyTitle": "{{filter}}の通知はありません",
    "emptyBody": "ストーリーのコメント、いいね、エコー、Diamond解除、ギフト、収益、公開通知がここに表示されます。",
    "closeOptions": "通知オプションを閉じる",
    "showMore": "もっと表示",
    "showLess": "表示を減らす",
    "markRead": "既読にする",
    "markUnread": "未読にする",
    "turnOffType": "{{type}}通知をオフ",
    "turnOnType": "{{type}}通知をオン",
    "deleteNotification": "この通知を削除",
    "reportIssue": "通知チームに問題を報告",
    "loadFailed": "通知を読み込めませんでした",
    "noTarget": "この通知にはまだ移動先ページがありません。",
    "updateFailed": "通知を更新できませんでした",
    "morePreference": "{{type}}通知をより多く表示します。",
    "lessPreference": "{{type}}通知をより少なく表示します。",
    "preferenceFailed": "通知設定を更新できませんでした",
    "typeOn": "{{type}}通知をオンにしました。",
    "typeOff": "{{type}}通知をオフにしました。",
    "deleteFailed": "通知を削除できませんでした",
    "allMarkedRead": "すべての通知を既読にしました。",
    "markAllFailed": "通知を既読にできませんでした",
    "backDashboard": "作者ダッシュボードに戻る",
    "title": "ストーリー通知",
    "markAllRead": "すべて既読にする",
    "new": "新着",
    "earlier": "以前",
    "loading": "読み込み中...",
    "loadMore": "通知をさらに読み込む"
  },
  "ko": {
    "all": "전체",
    "unread": "읽지 않음",
    "comments": "댓글",
    "likes": "좋아요",
    "echoes": "에코",
    "income": "수익",
    "system": "시스템",
    "now": "지금",
    "minutesShort": "{{count}}분",
    "hoursShort": "{{count}}시간",
    "daysShort": "{{count}}일",
    "notification": "알림",
    "loginFirst": "먼저 로그인해 주세요",
    "requestFailed": "요청 실패",
    "notificationOptions": "알림 옵션",
    "emptyTitle": "{{filter}} 알림이 없습니다",
    "emptyBody": "스토리 댓글, 좋아요, 에코, Diamond 잠금 해제, 선물, 수익 및 게시 알림이 여기에 표시됩니다.",
    "closeOptions": "알림 옵션 닫기",
    "showMore": "더 보기",
    "showLess": "덜 보기",
    "markRead": "읽음으로 표시",
    "markUnread": "읽지 않음으로 표시",
    "turnOffType": "{{type}} 알림 끄기",
    "turnOnType": "{{type}} 알림 켜기",
    "deleteNotification": "이 알림 삭제",
    "reportIssue": "알림 팀에 문제 신고",
    "loadFailed": "알림을 불러오지 못했습니다",
    "noTarget": "이 알림에는 아직 이동할 페이지가 없습니다.",
    "updateFailed": "알림을 업데이트하지 못했습니다",
    "morePreference": "{{type}} 알림을 더 많이 표시합니다.",
    "lessPreference": "{{type}} 알림을 더 적게 표시합니다.",
    "preferenceFailed": "알림 설정을 업데이트하지 못했습니다",
    "typeOn": "{{type}} 알림이 켜졌습니다.",
    "typeOff": "{{type}} 알림이 꺼졌습니다.",
    "deleteFailed": "알림을 삭제하지 못했습니다",
    "allMarkedRead": "모든 알림을 읽음으로 표시했습니다.",
    "markAllFailed": "알림을 읽음으로 표시하지 못했습니다",
    "backDashboard": "작가 대시보드로 돌아가기",
    "title": "스토리 알림",
    "markAllRead": "모두 읽음으로 표시",
    "new": "새 알림",
    "earlier": "이전",
    "loading": "불러오는 중...",
    "loadMore": "알림 더 불러오기"
  }
})

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
  { value: 'likes', labelKey: 'likes' },
  { value: 'echoes', labelKey: 'echoes' },
  { value: 'income', labelKey: 'income' },
]

const typeMap = {
  comments: 'comments',
  comment: 'comments',
  like: 'likes',
  echo: 'echoes',
  gift: 'income',
  unlock: 'income',
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
  like: {
    icon: 'fa-solid fa-heart',
    badge: 'bg-[#f43f5e] text-white',
  },
  echo: {
    icon: 'fa-solid fa-share',
    badge: 'bg-[#7c3aed] text-white',
  },
  gift: {
    icon: 'fa-solid fa-gift',
    badge: 'bg-[#f59e0b] text-white',
  },
  unlock: {
    icon: 'fa-solid fa-gem',
    badge: 'bg-[#0891b2] text-white',
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
  return typeMap[String(type || '').toLowerCase()] || 'system'
}

function getAction(type) {
  return (
    actionMap[String(type || '').toLowerCase()] || {
      icon: 'fa-solid fa-bell',
      badge: 'bg-[#111827] text-white',
    }
  )
}

function formatTime(value) {
  if (!value) return getDisplayText('storyNotifications.now')
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return getDisplayText('storyNotifications.now')
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diffMinutes < 1) return getDisplayText('storyNotifications.now')
  if (diffMinutes < 60) return getDisplayText('storyNotifications.minutesShort', { count: diffMinutes })
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return getDisplayText('storyNotifications.hoursShort', { count: diffHours })
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return getDisplayText('storyNotifications.daysShort', { count: diffDays })
  return date.toLocaleDateString(getDisplayLanguageId(), { day: '2-digit', month: 'short' })
}

function normalizeNotification(item) {
  const metadata =
    item.metadata && typeof item.metadata === 'object'
      ? item.metadata
      : {}

  const readerName =
    metadata.reader_name ||
    metadata.user_name ||
    metadata.actor_name ||
    ''

  return {
    id: item.id,
    type: item.type || 'system',
    typeKey: getNotificationTypeKey(item.type),
    title: item.title || getDisplayText('storyNotifications.notification'),
    message: item.message || '',
    targetUrl: item.target_url || item.targetUrl || '',
    metadata,
    readerName,
    readerAvatar:
      metadata.reader_avatar_url ||
      metadata.user_avatar_url ||
      metadata.actor_avatar_url ||
      '',
    unread: !Boolean(item.is_read),
    time: formatTime(item.created_at),
    createdAt: item.created_at || '',
  }
}

async function apiRequest(path, options = {}) {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('storyNotifications.loginFirst'))

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('storyNotifications.requestFailed'))
  }

  return data
}

async function fetchStoryNotifications(before = '') {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
  })

  if (before) {
    params.set('before', before)
  }

  const data = await apiRequest(
    `/api/authors/me/story-notifications?${params.toString()}`
  )

  return {
    notifications: Array.isArray(data.notifications)
      ? data.notifications.map(normalizeNotification)
      : [],
    unreadCount: Number(data.unread_count || 0),
    preferences:
      data.preferences &&
      typeof data.preferences === 'object'
        ? data.preferences
        : {},
    hasMore: Boolean(data.has_more),
    nextCursor: data.next_cursor || '',
  }
}

function markNotificationRead(notificationId) {
  return apiRequest(
    `/api/authors/me/story-notifications/${encodeURIComponent(
      notificationId
    )}/read`,
    { method: 'PATCH' }
  )
}

function markNotificationUnread(notificationId) {
  return apiRequest(
    `/api/authors/me/story-notifications/${encodeURIComponent(
      notificationId
    )}/unread`,
    { method: 'PATCH' }
  )
}

function deleteNotification(notificationId) {
  return apiRequest(
    `/api/authors/me/story-notifications/${encodeURIComponent(
      notificationId
    )}`,
    { method: 'DELETE' }
  )
}

function updateNotificationPreference(
  type,
  isEnabled,
  frequencyLevel = 'normal'
) {
  return apiRequest(
    `/api/authors/me/story-notification-preferences/${encodeURIComponent(
      type
    )}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        is_enabled: isEnabled,
        frequency_level: frequencyLevel,
      }),
    }
  )
}

function markAllNotificationsRead() {
  return apiRequest(
    '/api/authors/me/story-notifications/read-all',
    {
      method: 'PATCH',
    }
  )
}

function NotificationAvatar({ notification }) {
  const { t } = useDisplayTranslation()
  const action = getAction(notification.type)
  const fallbackText = String(
    notification.readerName ||
      t(`storyNotifications.${notification.typeKey}`) ||
      'N'
  )
    .trim()
    .slice(0, 1)
    .toUpperCase()

  return (
    <div className="relative h-14 w-14 shrink-0">
      {notification.readerAvatar ? (
        <img
          src={notification.readerAvatar}
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
        <i className={`${action.icon} text-[10px]`} />
      </span>
    </div>
  )
}

function NotificationItem({
  notification,
  onOpen,
  onOptions,
}) {
  const { t } = useDisplayTranslation()
  return (
    <div
      className={`flex w-full items-start gap-3 px-4 py-3 transition ${
        notification.unread
          ? 'bg-[var(--shadow-bg-soft)]'
          : 'bg-[var(--shadow-bg-surface)]'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
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
                · {notification.message}
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
              {t(`storyNotifications.${notification.typeKey}`)}
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
          onClick={() => onOptions(notification)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
          aria-label={t('storyNotifications.notificationOptions')}
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
  if (!notifications.length) return null

  return (
    <section className="bg-[var(--shadow-bg-surface)]">
      <h2 className="px-4 pb-2 pt-4 text-[15px] font-bold text-[var(--shadow-text-primary)]">
        {title}
      </h2>

      <div className="bg-[var(--shadow-bg-surface)]">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onOpen={onOpen}
            onOptions={onOptions}
          />
        ))}
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <div className="px-4 py-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="mb-3 flex animate-pulse gap-3 py-2"
        >
          <div className="h-14 w-14 shrink-0 rounded-full bg-[var(--shadow-bg-soft)]" />
          <div className="min-w-0 flex-1 pt-1">
            <div className="h-4 w-4/5 rounded bg-[var(--shadow-bg-soft)]" />
            <div className="mt-2 h-3 w-2/5 rounded bg-[var(--shadow-bg-soft)]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ filterKey }) {
  const { t } = useDisplayTranslation()
  return (
    <div className="bg-[var(--shadow-bg-surface)] px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className="fa-regular fa-bell text-[20px]" />
      </div>
      <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
        {t('storyNotifications.emptyTitle', { filter: t(`storyNotifications.${filterKey}`) })}
      </h2>
      <p className="mx-auto mt-2 max-w-[340px] text-[13px] font-semibold leading-6 text-[var(--shadow-text-tertiary)]">
        {t('storyNotifications.emptyBody')}
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
  const { t } = useDisplayTranslation()
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dragStartRef = useRef(0)
  const dragYRef = useRef(0)

  useEffect(() => {
    if (!notification) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyOverflow =
      body.style.overflow
    const previousBodyPosition =
      body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousHtmlOverflow =
      html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      html.style.overflow = previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [notification])

  if (!notification) return null

  const fallbackText = String(
    notification.readerName ||
      t(`storyNotifications.${notification.typeKey}`) ||
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

  const handleDragStart = (event) => {
    dragStartRef.current = event.clientY
    dragYRef.current = 0
    setDragY(0)
    setDragging(true)
    event.currentTarget.setPointerCapture(
      event.pointerId
    )
  }

  const handleDragMove = (event) => {
    if (!dragging) return

    const nextDragY = Math.max(
      0,
      event.clientY - dragStartRef.current
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
    'flex min-h-12 w-full items-center gap-4 rounded-[12px] px-2 py-3 text-left text-[15px] font-normal transition hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-hover)] disabled:opacity-40'

  return (
    <div
      className="fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label={t('storyNotifications.notificationOptions')}
    >
      <button
        type="button"
        onClick={closeSheet}
        className="absolute inset-0 bg-black/45"
        aria-label={t('storyNotifications.closeOptions')}
      />

      <section
        className={`absolute inset-x-0 bottom-0 mx-auto max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-t-[24px] bg-[var(--shadow-bg-elevated)] pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(17,24,39,0.22)] ${
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
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className="mx-auto h-1.5 w-11 rounded-full bg-[var(--shadow-border-strong)]" />
        </div>

        <div className="px-5 pb-3 text-center">
          {notification.readerAvatar ? (
            <img
              src={notification.readerAvatar}
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
                ? 'bg-[var(--shadow-bg-hover)] text-[var(--shadow-text-primary)]'
                : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            <i className="fa-solid fa-plus w-5 text-center text-[16px]" />
            <span className="flex-1">
              {t('storyNotifications.showMore')}
            </span>
            {frequencyLevel === 'more' ? (
              <i className="fa-solid fa-check text-[12px]" />
            ) : null}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onShowLess}
            className={`${actionClass} ${
              frequencyLevel === 'less'
                ? 'bg-[var(--shadow-bg-hover)] text-[var(--shadow-text-primary)]'
                : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            <i className="fa-solid fa-minus w-5 text-center text-[16px]" />
            <span className="flex-1">
              {t('storyNotifications.showLess')}
            </span>
            {frequencyLevel === 'less' ? (
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
              className={`w-5 text-center text-[16px] fa-solid ${
                notification.unread
                  ? 'fa-check'
                  : 'fa-envelope'
              }`}
            />
            <span>
              {notification.unread
                ? t('storyNotifications.markRead')
                : t('storyNotifications.markUnread')}
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
              {notificationEnabled
                ? t('storyNotifications.turnOffType', { type: t(`storyNotifications.${notification.typeKey}`) })
                : t('storyNotifications.turnOnType', { type: t(`storyNotifications.${notification.typeKey}`) })}
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
              {t('storyNotifications.deleteNotification')}
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
              {t('storyNotifications.reportIssue')}
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default function StoryNotificationsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [activeFilter, setActiveFilter] =
    useState('all')
  const [notifications, setNotifications] =
    useState([])
  const [preferences, setPreferences] =
    useState({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] =
    useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] =
    useState('')
  const [actionLoading, setActionLoading] =
    useState(false)
  const [unreadCount, setUnreadCount] =
    useState(0)
  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState(null)
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] =
    useState(false)
  const toastFadeTimerRef = useRef(null)
  const toastClearTimerRef = useRef(null)

  const showToast = useCallback((text) => {
    window.clearTimeout(
      toastFadeTimerRef.current
    )
    window.clearTimeout(
      toastClearTimerRef.current
    )

    setToast(String(text || ''))
    setToastVisible(true)

    toastFadeTimerRef.current =
      window.setTimeout(() => {
        setToastVisible(false)
      }, 1900)

    toastClearTimerRef.current =
      window.setTimeout(() => {
        setToast('')
      }, 2250)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(
        toastFadeTimerRef.current
      )
      window.clearTimeout(
        toastClearTimerRef.current
      )
    }
  }, [])

  const loadNotifications = useCallback(
    async ({
      append = false,
      cursor = '',
    } = {}) => {
      try {
        if (append) {
          setLoadingMore(true)
        } else {
          setLoading(true)
        }

        const data =
          await fetchStoryNotifications(cursor)

        setNotifications((current) => {
          if (!append) {
            return data.notifications
          }

          const currentIds = new Set(
            current.map((item) => item.id)
          )

          return [
            ...current,
            ...data.notifications.filter(
              (item) =>
                !currentIds.has(item.id)
            ),
          ]
        })

        setUnreadCount(data.unreadCount)
        setPreferences(data.preferences)
        setHasMore(data.hasMore)
        setNextCursor(data.nextCursor)
      } catch (error) {
        if (!append) {
          setNotifications([])
          setPreferences({})
          setUnreadCount(0)
          setHasMore(false)
          setNextCursor('')
        }

        showToast(
          error.message ||
            t('storyNotifications.loadFailed')
        )
      } finally {
        if (append) {
          setLoadingMore(false)
        } else {
          setLoading(false)
        }
      }
    },
    [showToast, t]
  )

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') {
      return notifications
    }

    if (activeFilter === 'unread') {
      return notifications.filter(
        (item) => item.unread
      )
    }

    return notifications.filter(
      (item) =>
        item.typeKey === activeFilter
    )
  }, [activeFilter, notifications])

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

  async function handleOpen(notification) {
    if (notification.unread) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, unread: false }
            : item
        )
      )

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      )

      markNotificationRead(
        notification.id
      ).catch(() => null)
    }

    if (notification.targetUrl) {
  navigate(notification.targetUrl, {
    state: { returnTo: '/author/notifications' },
  })
  return
}

    showToast(
      t('storyNotifications.noTarget')
    )
  }

  async function handleToggleRead() {
    if (!selectedNotification) return

    try {
      setActionLoading(true)

      if (selectedNotification.unread) {
        await markNotificationRead(
          selectedNotification.id
        )

        setUnreadCount((current) =>
          Math.max(0, current - 1)
        )
      } else {
        await markNotificationUnread(
          selectedNotification.id
        )

        setUnreadCount(
          (current) => current + 1
        )
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === selectedNotification.id
            ? {
                ...item,
                unread:
                  !selectedNotification.unread,
              }
            : item
        )
      )

      setSelectedNotification(null)
    } catch (error) {
      showToast(
        error.message ||
          t('storyNotifications.updateFailed')
      )
    } finally {
      setActionLoading(false)
    }
  }

  async function handleFrequency(level) {
    if (!selectedNotification) return

    const notificationType =
      selectedNotification.type
    const notificationLabel =
      t(`storyNotifications.${selectedNotification.typeKey}`)

    try {
      setActionLoading(true)

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
            preference.is_enabled !== false,
          frequency_level:
            preference.frequency_level ||
            level,
        },
      }))

      setSelectedNotification(null)

      showToast(
        level === 'more'
          ? t('storyNotifications.morePreference', { type: notificationLabel })
          : t('storyNotifications.lessPreference', { type: notificationLabel })
      )
    } catch (error) {
      showToast(
        error.message ||
          t('storyNotifications.preferenceFailed')
      )
    } finally {
      setActionLoading(false)
    }
  }

  async function handleToggleType() {
    if (!selectedNotification) return

    const notificationType =
      selectedNotification.type
    const notificationLabel =
      t(`storyNotifications.${selectedNotification.typeKey}`)
    const currentPreference =
      preferences[notificationType] || {
        is_enabled: true,
        frequency_level: 'normal',
      }
    const nextEnabled =
      currentPreference.is_enabled === false

    try {
      setActionLoading(true)

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
            preference.is_enabled !== false,
          frequency_level:
            preference.frequency_level ||
            currentPreference.frequency_level ||
            'normal',
        },
      }))

      setSelectedNotification(null)

      showToast(
        preference.is_enabled !== false
          ? t('storyNotifications.typeOn', { type: notificationLabel })
          : t('storyNotifications.typeOff', { type: notificationLabel })
      )
    } catch (error) {
      showToast(
        error.message ||
          t('storyNotifications.preferenceFailed')
      )
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDelete() {
    if (!selectedNotification) return

    try {
      setActionLoading(true)

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

      if (selectedNotification.unread) {
        setUnreadCount((current) =>
          Math.max(0, current - 1)
        )
      }

      setSelectedNotification(null)
    } catch (error) {
      showToast(
        error.message ||
          t('storyNotifications.deleteFailed')
      )
    } finally {
      setActionLoading(false)
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

      setUnreadCount(0)
      showToast(
        t('storyNotifications.allMarkedRead')
      )
    } catch (error) {
      showToast(
        error.message ||
          t('storyNotifications.markAllFailed')
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
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px]">
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
              navigate('/author/dashboard')
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('storyNotifications.backDashboard')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[18px] font-bold text-[var(--shadow-text-primary)]">
            {t('storyNotifications.title')}
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={!unreadCount}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-30"
            aria-label={t('storyNotifications.markAllRead')}
            title={t('storyNotifications.markAllRead')}
          >
            <i className="fa-solid fa-broom text-[17px]" />
          </button>
        </div>
      </div>

      <main className="mx-auto min-h-[calc(100vh-148px)] max-w-[980px] bg-[var(--shadow-bg-surface)]">
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
                    setActiveFilter(filter.value)
                  }
                  className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition hover:bg-[var(--shadow-bg-hover)] active:scale-[0.98] ${
                    active
                      ? 'bg-[var(--shadow-bg-hover)] font-semibold text-[var(--shadow-text-primary)]'
                      : 'bg-transparent font-normal text-[var(--shadow-text-disabled)]'
                  }`}
                >
                  {t(`storyNotifications.${filter.labelKey}`)}
                  {filter.value === 'unread' &&
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
              title={t('storyNotifications.new')}
              notifications={newNotifications}
              onOpen={handleOpen}
              onOptions={
                setSelectedNotification
              }
            />

            <NotificationGroup
              title={t('storyNotifications.earlier')}
              notifications={
                earlierNotifications
              }
              onOpen={handleOpen}
              onOptions={
                setSelectedNotification
              }
            />

            {hasMore ? (
              <div className="px-4 py-5">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="h-11 w-full rounded-full bg-[var(--shadow-bg-soft)] text-[13px] font-semibold text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:text-[var(--shadow-text-disabled)]"
                >
                  {loadingMore
                    ? t('storyNotifications.loading')
                    : t('storyNotifications.loadMore')}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState
            filterKey={activeFilter}
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
        <AuthorStudioBottomNav />
      </div>

      <OptionsSheet
        notification={selectedNotification}
        loading={actionLoading}
        notificationEnabled={
          selectedPreference.is_enabled !==
          false
        }
        frequencyLevel={
          selectedPreference.frequency_level ||
          'normal'
        }
        onClose={() =>
          setSelectedNotification(null)
        }
        onToggleRead={handleToggleRead}
        onShowMore={() =>
          handleFrequency('more')
        }
        onShowLess={() =>
          handleFrequency('less')
        }
        onToggleType={handleToggleType}
        onDelete={handleDelete}
        onReport={() => {
          setSelectedNotification(null)
          navigate('/feedback')
        }}
      />

      {toast ? (
        <div
          className={`pointer-events-none fixed left-1/2 top-[max(16px,env(safe-area-inset-top))] z-[150] w-[calc(100%-32px)] max-w-[380px] -translate-x-1/2 transition-all duration-300 ${
            toastVisible
              ? 'translate-y-0 opacity-100'
              : '-translate-y-2 opacity-0'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-[16px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[13px] font-medium leading-5 text-[var(--shadow-text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] ring-1 ring-[var(--shadow-border)]">
            <i className="fa-solid fa-check text-[13px]" />
            <span className="min-w-0 flex-1">
              {toast}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

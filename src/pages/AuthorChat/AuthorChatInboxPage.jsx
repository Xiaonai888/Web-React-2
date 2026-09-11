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
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorChatInbox', {
  "en": {
    "unread": "Unread",
    "adReplies": "Ad replies",
    "followUp": "Follow up",
    "messages": "Messages",
    "frequentlyUsed": "Frequently used",
    "selectMultipleFilters": "You may select multiple filters.",
    "read": "Read",
    "muted": "Muted",
    "active": "Active",
    "activity": "Activity",
    "today": "Today",
    "last7Days": "Last 7 days",
    "last30Days": "Last 30 days",
    "content": "Content",
    "containsLink": "Contains link",
    "longMessage": "Long message",
    "now": "Now",
    "minutesShort": "{{count}}m",
    "hoursShort": "{{count}}h",
    "daysShort": "{{count}}d",
    "shadowReader": "Shadow Reader",
    "openConversation": "Open this conversation",
    "commentedOnPage": "Commented on your Page",
    "closeFilters": "Close filters",
    "filterMessages": "Filter messages",
    "clearAll": "Clear all",
    "apply": "Apply",
    "noComments": "No comments yet",
    "noPageMessages": "No Page messages yet",
    "commentsHelp": "Comments and mentions for your Author Page will appear here.",
    "messagesHelp": "Messages sent to your Author Page will appear here.",
    "failedLoadInbox": "Failed to load Page Inbox",
    "authorPage": "Author Page",
    "commentCannotOpen": "This Page comment cannot be opened.",
    "search": "Search",
    "inbox": "Inbox",
    "searchInbox": "Search inbox",
    "profilePage": "Profile page",
    "more": "More",
    "moreToolsLater": "More Inbox tools will be added later.",
    "comments": "Comments",
    "archivedChats": "Archived chats",
    "archivedCount": "{{count}} archived"
  },
  "km": {
    "unread": "មិនទាន់អាន",
    "adReplies": "ការឆ្លើយតបពាណិជ្ជកម្ម",
    "followUp": "តាមដានបន្ត",
    "messages": "សារ",
    "frequentlyUsed": "ប្រើញឹកញាប់",
    "selectMultipleFilters": "អ្នកអាចជ្រើសតម្រងច្រើនបាន។",
    "read": "បានអាន",
    "muted": "បានបិទសំឡេង",
    "active": "សកម្ម",
    "activity": "សកម្មភាព",
    "today": "ថ្ងៃនេះ",
    "last7Days": "7 ថ្ងៃចុងក្រោយ",
    "last30Days": "30 ថ្ងៃចុងក្រោយ",
    "content": "មាតិកា",
    "containsLink": "មានតំណ",
    "longMessage": "សារវែង",
    "now": "ឥឡូវនេះ",
    "minutesShort": "{{count}} នាទី",
    "hoursShort": "{{count}} ម៉ោង",
    "daysShort": "{{count}} ថ្ងៃ",
    "shadowReader": "អ្នកអាន Shadow",
    "openConversation": "បើកការសន្ទនានេះ",
    "commentedOnPage": "បានបញ្ចេញមតិលើ Page របស់អ្នក",
    "closeFilters": "បិទតម្រង",
    "filterMessages": "តម្រងសារ",
    "clearAll": "សម្អាតទាំងអស់",
    "apply": "អនុវត្ត",
    "noComments": "មិនទាន់មានមតិយោបល់",
    "noPageMessages": "មិនទាន់មានសារ Page",
    "commentsHelp": "មតិយោបល់ និងការលើកឈ្មោះសម្រាប់ Author Page របស់អ្នកនឹងបង្ហាញនៅទីនេះ។",
    "messagesHelp": "សារដែលផ្ញើទៅ Author Page របស់អ្នកនឹងបង្ហាញនៅទីនេះ។",
    "failedLoadInbox": "មិនអាចផ្ទុកប្រអប់សារ Page បានទេ",
    "authorPage": "Author Page",
    "commentCannotOpen": "មិនអាចបើកមតិយោបល់ Page នេះបានទេ។",
    "search": "ស្វែងរក",
    "inbox": "ប្រអប់សារ",
    "searchInbox": "ស្វែងរកក្នុងប្រអប់សារ",
    "profilePage": "ទំព័រ Profile",
    "more": "ច្រើនទៀត",
    "moreToolsLater": "ឧបករណ៍ Inbox បន្ថែមនឹងមកនៅពេលក្រោយ។",
    "comments": "មតិយោបល់",
    "archivedChats": "ការសន្ទនាដែលបានទុកក្នុងបណ្ណសារ",
    "archivedCount": "បានទុក {{count}}"
  },
  "zh": {
    "unread": "未读",
    "adReplies": "广告回复",
    "followUp": "跟进",
    "messages": "消息",
    "frequentlyUsed": "常用",
    "selectMultipleFilters": "可选择多个筛选条件。",
    "read": "已读",
    "muted": "已静音",
    "active": "活跃",
    "activity": "活动",
    "today": "今天",
    "last7Days": "最近 7 天",
    "last30Days": "最近 30 天",
    "content": "内容",
    "containsLink": "包含链接",
    "longMessage": "长消息",
    "now": "刚刚",
    "minutesShort": "{{count}}分",
    "hoursShort": "{{count}}小时",
    "daysShort": "{{count}}天",
    "shadowReader": "Shadow 读者",
    "openConversation": "打开此对话",
    "commentedOnPage": "评论了你的 Page",
    "closeFilters": "关闭筛选",
    "filterMessages": "筛选消息",
    "clearAll": "清除全部",
    "apply": "应用",
    "noComments": "暂无评论",
    "noPageMessages": "暂无 Page 消息",
    "commentsHelp": "你的 Author Page 评论和提及会显示在这里。",
    "messagesHelp": "发送到你 Author Page 的消息会显示在这里。",
    "failedLoadInbox": "无法加载 Page 收件箱",
    "authorPage": "Author Page",
    "commentCannotOpen": "无法打开此 Page 评论。",
    "search": "搜索",
    "inbox": "收件箱",
    "searchInbox": "搜索收件箱",
    "profilePage": "个人主页",
    "more": "更多",
    "moreToolsLater": "更多收件箱工具稍后推出。",
    "comments": "评论",
    "archivedChats": "已归档聊天",
    "archivedCount": "已归档 {{count}} 个"
  },
  "ja": {
    "unread": "未読",
    "adReplies": "広告への返信",
    "followUp": "フォローアップ",
    "messages": "メッセージ",
    "frequentlyUsed": "よく使う",
    "selectMultipleFilters": "複数のフィルターを選択できます。",
    "read": "既読",
    "muted": "ミュート済み",
    "active": "アクティブ",
    "activity": "アクティビティ",
    "today": "今日",
    "last7Days": "過去7日間",
    "last30Days": "過去30日間",
    "content": "コンテンツ",
    "containsLink": "リンクを含む",
    "longMessage": "長いメッセージ",
    "now": "今",
    "minutesShort": "{{count}}分",
    "hoursShort": "{{count}}時間",
    "daysShort": "{{count}}日",
    "shadowReader": "Shadow 読者",
    "openConversation": "この会話を開く",
    "commentedOnPage": "あなたの Page にコメントしました",
    "closeFilters": "フィルターを閉じる",
    "filterMessages": "メッセージを絞り込む",
    "clearAll": "すべてクリア",
    "apply": "適用",
    "noComments": "コメントはまだありません",
    "noPageMessages": "Page メッセージはまだありません",
    "commentsHelp": "Author Page へのコメントやメンションがここに表示されます。",
    "messagesHelp": "Author Page に送信されたメッセージがここに表示されます。",
    "failedLoadInbox": "Page 受信トレイを読み込めませんでした",
    "authorPage": "Author Page",
    "commentCannotOpen": "この Page コメントを開けません。",
    "search": "検索",
    "inbox": "受信トレイ",
    "searchInbox": "受信トレイを検索",
    "profilePage": "プロフィールページ",
    "more": "その他",
    "moreToolsLater": "その他の受信トレイツールは後で追加されます。",
    "comments": "コメント",
    "archivedChats": "アーカイブ済みチャット",
    "archivedCount": "{{count}}件をアーカイブ"
  },
  "ko": {
    "unread": "읽지 않음",
    "adReplies": "광고 답글",
    "followUp": "후속 확인",
    "messages": "메시지",
    "frequentlyUsed": "자주 사용",
    "selectMultipleFilters": "여러 필터를 선택할 수 있습니다.",
    "read": "읽음",
    "muted": "음소거됨",
    "active": "활성",
    "activity": "활동",
    "today": "오늘",
    "last7Days": "최근 7일",
    "last30Days": "최근 30일",
    "content": "콘텐츠",
    "containsLink": "링크 포함",
    "longMessage": "긴 메시지",
    "now": "지금",
    "minutesShort": "{{count}}분",
    "hoursShort": "{{count}}시간",
    "daysShort": "{{count}}일",
    "shadowReader": "Shadow 독자",
    "openConversation": "이 대화 열기",
    "commentedOnPage": "내 Page에 댓글을 남겼습니다",
    "closeFilters": "필터 닫기",
    "filterMessages": "메시지 필터",
    "clearAll": "모두 지우기",
    "apply": "적용",
    "noComments": "아직 댓글이 없습니다",
    "noPageMessages": "아직 Page 메시지가 없습니다",
    "commentsHelp": "Author Page의 댓글과 멘션이 여기에 표시됩니다.",
    "messagesHelp": "Author Page로 보낸 메시지가 여기에 표시됩니다.",
    "failedLoadInbox": "Page 받은편지함을 불러오지 못했습니다",
    "authorPage": "Author Page",
    "commentCannotOpen": "이 Page 댓글을 열 수 없습니다.",
    "search": "검색",
    "inbox": "받은편지함",
    "searchInbox": "받은편지함 검색",
    "profilePage": "프로필 페이지",
    "more": "더보기",
    "moreToolsLater": "추가 받은편지함 도구는 나중에 제공됩니다.",
    "comments": "댓글",
    "archivedChats": "보관된 채팅",
    "archivedCount": "{{count}}개 보관됨"
  }
})

const QUICK_FILTERS = [
  { key: 'unread', labelKey: 'unread' },
  { key: 'ad_replies', labelKey: 'adReplies' },
  { key: 'follow_up', labelKey: 'followUp' },
  { key: 'messages', labelKey: 'messages' },
]

const FILTER_GROUPS = [
  {
    titleKey: 'frequentlyUsed',
    subtitleKey: 'selectMultipleFilters',
    items: [
      { key: 'unread', labelKey: 'unread' },
      { key: 'read', labelKey: 'read' },
      { key: 'muted', labelKey: 'muted' },
      { key: 'active', labelKey: 'active' },
    ],
  },
  {
    titleKey: 'activity',
    items: [
      { key: 'today', labelKey: 'today' },
      { key: 'last_7_days', labelKey: 'last7Days' },
      { key: 'last_30_days', labelKey: 'last30Days' },
    ],
  },
  {
    titleKey: 'content',
    items: [
      { key: 'has_link', labelKey: 'containsLink' },
      { key: 'long_message', labelKey: 'longMessage' },
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
    return new Intl.DateTimeFormat(getDisplayLanguageId(), {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / 86400000
  )

  if (diffDays < 7) {
    return getDisplayText('authorChatInbox.daysShort', { count: Math.max(1, diffDays) })
  }

  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
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

  if (minutes < 1) return getDisplayText('authorChatInbox.now')
  if (minutes < 60) return getDisplayText('authorChatInbox.minutesShort', { count: minutes })

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return getDisplayText('authorChatInbox.hoursShort', { count: hours })

  const days = Math.floor(hours / 24)
  if (days < 7) return getDisplayText('authorChatInbox.daysShort', { count: days })

  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
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
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ${textSize} font-bold text-[var(--shadow-text-primary)]`}
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
      className="flex w-full items-center gap-3 px-5 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <div className="relative">
        <CircleAvatar
          imageUrl={person.avatar_url}
          name={person.name || person.username}
          size="h-[58px] w-[58px]"
          textSize="text-[17px]"
        />
        {unread > 0 ? (
          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-[var(--shadow-bg-surface)] bg-[#1877f2]" />
        ) : null}
      </div>

      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <strong
            className={`min-w-0 flex-1 truncate text-[15px] text-[var(--shadow-text-primary)] ${
              unread > 0 ? 'font-extrabold' : 'font-semibold'
            }`}
          >
            {person.name || getDisplayText('authorChatInbox.shadowReader')}
          </strong>

          <span className="shrink-0 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
            {formatConversationTime(
              conversation.last_message_at ||
                latest.created_at
            )}
          </span>
        </span>

        <span
          className={`mt-1 block truncate text-[13px] ${
            unread > 0
              ? 'font-semibold text-[var(--shadow-text-primary)]'
              : 'font-normal text-[var(--shadow-text-secondary)]'
          }`}
        >
          {latest.body || getDisplayText('authorChatInbox.openConversation')}
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
      getDisplayText('authorChatInbox.shadowReader'),
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
      className="flex w-full items-center gap-3 px-5 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <CircleAvatar
        imageUrl={actor.avatar}
        name={actor.name}
        size="h-[54px] w-[54px]"
        textSize="text-[15px]"
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <strong className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--shadow-text-primary)]">
            {actor.name}
          </strong>
          <span className="shrink-0 text-[12px] text-[var(--shadow-text-tertiary)]">
            {formatNotificationTime(
              notification.created_at
            )}
          </span>
        </span>
        <span className="mt-1 block line-clamp-2 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
          {notification.message ||
            notification.title ||
            getDisplayText('authorChatInbox.commentedOnPage')}
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
        aria-label={getDisplayText('authorChatInbox.closeFilters')}
      />

      <section className="relative z-10 flex max-h-[68dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-[20px] bg-[var(--shadow-bg-surface)] shadow-2xl">
        <div className="shrink-0 px-4 pt-2">
          <div className="mx-auto h-1 w-9 rounded-full bg-[var(--shadow-border-strong)]" />

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
              {getDisplayText('authorChatInbox.filterMessages')}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
          {FILTER_GROUPS.map((group) => (
            <div key={group.titleKey} className="mt-5">
              <h3 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
                {getDisplayText(`authorChatInbox.${group.titleKey}`)}
              </h3>

              {group.subtitleKey ? (
                <p className="mt-0.5 text-[10px] text-[var(--shadow-text-tertiary)]">
                  {getDisplayText(`authorChatInbox.${group.subtitleKey}`)}
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
                          ? 'bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border-strong)]'
                          : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                      }`}
                    >
                      {getDisplayText(`authorChatInbox.${item.labelKey}`)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={() => setDraft(new Set())}
            className="h-10 rounded-[7px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-semibold text-[var(--shadow-text-primary)]"
          >
            {getDisplayText('authorChatInbox.clearAll')}
          </button>

          <button
            type="button"
            onClick={() => onApply(draft)}
            className="h-10 rounded-[7px] bg-[var(--shadow-text-primary)] text-[13px] font-semibold text-[var(--shadow-bg-surface)]"
          >
            {getDisplayText('authorChatInbox.apply')}
          </button>
        </div>
      </section>
    </div>
  )
}

function EmptyState({ tab }) {
  return (
    <div className="px-6 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
        <MessageCircle size={26} />
      </div>
      <h2 className="mt-5 text-[16px] font-bold text-[var(--shadow-text-primary)]">
        {tab === 'comments'
          ? getDisplayText('authorChatInbox.noComments')
          : getDisplayText('authorChatInbox.noPageMessages')}
      </h2>
      <p className="mx-auto mt-2 max-w-[290px] text-[12px] leading-5 text-[var(--shadow-text-tertiary)]">
        {tab === 'comments'
          ? getDisplayText('authorChatInbox.commentsHelp')
          : getDisplayText('authorChatInbox.messagesHelp')}
      </p>
    </div>
  )
}

export default function AuthorChatInboxPage() {
  useDisplayTranslation()
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
            getDisplayText('authorChatInbox.failedLoadInbox')
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
    getDisplayText('authorChatInbox.authorPage')
  const profileImage =
    profile?.avatar_url ||
    profile?.profile_image_url ||
    ''

  function openComment(notification) {
  const activityRoute =
    resolveAuthorPostActivityRoute(notification)

  if (!activityRoute) {
    setError(getDisplayText('authorChatInbox.commentCannotOpen'))
    return
  }

  navigate(activityRoute)
}



  return (
    <div
      className="min-h-[100dvh] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]"
      onClick={() => {
        if (moreOpen) setMoreOpen(false)
      }}
    >
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
                >
                  <X size={23} />
                </button>

                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shadow-text-tertiary)]"
                  />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) =>
                      setQuery(
                        event.target.value.slice(0, 80)
                      )
                    }
                    placeholder={getDisplayText('authorChatInbox.search')}
                    className="h-10 w-full rounded-full bg-[var(--shadow-input-bg)] pl-11 pr-4 text-[14px] text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="min-w-0 flex-1 text-[20px] font-bold leading-none">
                  {getDisplayText('authorChatInbox.inbox')}
                </h1>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSearchOpen(true)
                    setMoreOpen(false)
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
                  aria-label={getDisplayText('authorChatInbox.searchInbox')}
                >
                  <Search size={24} strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/author/page')}
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  aria-label={getDisplayText('authorChatInbox.profilePage')}
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
                    className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
                    aria-label={getDisplayText('authorChatInbox.more')}
                  >
                    <Ellipsis size={25} />
                  </button>

                  {moreOpen ? (
                    <div className="absolute right-0 top-[44px] z-30 w-[190px] rounded-[14px] bg-[var(--shadow-bg-elevated)] p-2 text-[12px] font-semibold text-[var(--shadow-text-secondary)] shadow-[0_12px_36px_rgba(0,0,0,0.16)] ring-1 ring-[var(--shadow-border)]">
                      {getDisplayText('authorChatInbox.moreToolsLater')}
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
                  ? 'font-semibold text-[var(--shadow-text-primary)]'
                  : 'font-normal text-[var(--shadow-text-secondary)]'
              }`}
            >
              {getDisplayText('authorChatInbox.messages')}
              {tab === 'messages' ? (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[var(--shadow-text-primary)]" />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setTab('comments')}
              className={`relative h-full px-1 text-[17px] ${
                tab === 'comments'
                  ? 'font-semibold text-[var(--shadow-text-primary)]'
                  : 'font-normal text-[var(--shadow-text-secondary)]'
              }`}
            >
              {getDisplayText('authorChatInbox.comments')}
              {tab === 'comments' ? (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[var(--shadow-text-primary)]" />
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {tab === 'messages' ? (
        <section className="border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          <div className="mx-auto flex max-w-[680px] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
              aria-label={getDisplayText('authorChatInbox.filterMessages')}
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
                      ? 'bg-[var(--shadow-bg-soft)] text-[#1877f2] ring-1 ring-[#1877f2]/25'
                      : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                  }`}
                >
                  {getDisplayText(`authorChatInbox.${item.labelKey}`)}
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
    className="flex w-full items-center gap-3 border-b border-[var(--shadow-border)] px-5 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
      <Archive size={20} />
    </span>

    <span className="min-w-0 flex-1">
      <strong className="block text-[14px] font-semibold text-[var(--shadow-text-primary)]">
        {getDisplayText('authorChatInbox.archivedChats')}
      </strong>
      <span className="mt-0.5 block text-[11px] text-[var(--shadow-text-tertiary)]">
        {getDisplayText('authorChatInbox.archivedCount', { count: archivedCount })}
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

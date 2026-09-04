import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorAutoCleanupSettings from '../../components/author/AuthorAutoCleanupSettings'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorHiddenComments', {
  "en": {
    "pendingReview": "Pending review",
    "keptHidden": "Kept hidden",
    "restored": "Restored",
    "deleted": "Deleted",
    "pending": "Pending",
    "hidden": "Hidden",
    "justNow": "Just now",
    "minutesAgo": "{{count}}m ago",
    "hoursAgo": "{{count}}h ago",
    "daysAgo": "{{count}}d ago",
    "episodeNumber": "EP {{number}}",
    "episode": "Episode",
    "reader": "Reader",
    "unknownStory": "Unknown story",
    "storyPrefix": "Story:",
    "commentUnavailable": "Comment text is unavailable.",
    "matched": "Matched:",
    "more": "+{{count}} more",
    "autoHiddenRule": "Auto hidden by your rule",
    "keepHidden": "Keep Hidden",
    "restore": "Restore",
    "delete": "Delete",
    "inTrash": "This comment is in trash.",
    "loginAgain": "Please login again.",
    "requestFailed": "Request failed",
    "loadFailed": "Failed to load hidden comments.",
    "moveTrashConfirm": "Move this comment to trash?",
    "updated": "Hidden comment updated.",
    "updateFailed": "Failed to update hidden comment.",
    "goBack": "Go back",
    "title": "Hidden Comments",
    "subtitle": "Comments hidden by your words and rules",
    "settingsAria": "Hidden comments settings",
    "searchPlaceholder": "Search hidden comments...",
    "clearSearch": "Clear search",
    "filterAria": "Filter hidden comments",
    "comment": "comment",
    "comments": "comments",
    "sortAria": "Sort hidden comments",
    "newestFirst": "Newest first",
    "oldestFirst": "Oldest first",
    "noMatching": "No matching comments",
    "noStatus": "No {{status}} comments",
    "trySearch": "Try another search term or clear your search.",
    "pendingEmpty": "Comments matching your auto-hide words will appear here for review.",
    "statusEmpty": "Comments with this review status will appear here.",
    "manageAutoHide": "Manage Auto-hide Words",
    "previousPage": "Previous page",
    "nextPage": "Next page",
    "settingsTitle": "Hidden Comments Settings",
    "settingsSubtitle": "Manage rules and cleanup for hidden comments.",
    "closeSettings": "Close settings",
    "manageAutoHideSubtitle": "Choose words that send matching comments to Pending Review.",
    "closeMessage": "Close message"
  },
  "km": {
    "pendingReview": "រង់ចាំពិនិត្យ",
    "keptHidden": "រក្សាទុកជាលាក់",
    "restored": "បានស្តារ",
    "deleted": "បានលុប",
    "pending": "រង់ចាំ",
    "hidden": "បានលាក់",
    "justNow": "ឥឡូវនេះ",
    "minutesAgo": "{{count}} នាទីមុន",
    "hoursAgo": "{{count}} ម៉ោងមុន",
    "daysAgo": "{{count}} ថ្ងៃមុន",
    "episodeNumber": "ភាគ {{number}}",
    "episode": "ភាគ",
    "reader": "អ្នកអាន",
    "unknownStory": "រឿងមិនស្គាល់",
    "storyPrefix": "រឿង៖",
    "commentUnavailable": "មិនមានអត្ថបទមតិយោបល់។",
    "matched": "ត្រូវនឹង៖",
    "more": "+{{count}} ទៀត",
    "autoHiddenRule": "បានលាក់ស្វ័យប្រវត្តិតាមច្បាប់របស់អ្នក",
    "keepHidden": "រក្សាទុកជាលាក់",
    "restore": "ស្តារ",
    "delete": "លុប",
    "inTrash": "មតិយោបល់នេះស្ថិតក្នុងធុងសំរាម។",
    "loginAgain": "សូមចូលគណនីម្តងទៀត។",
    "requestFailed": "សំណើបានបរាជ័យ",
    "loadFailed": "មិនអាចផ្ទុកមតិយោបល់ដែលបានលាក់បានទេ។",
    "moveTrashConfirm": "ផ្លាស់មតិយោបល់នេះទៅធុងសំរាម?",
    "updated": "បានកែមតិយោបល់ដែលបានលាក់។",
    "updateFailed": "មិនអាចកែមតិយោបល់ដែលបានលាក់បានទេ។",
    "goBack": "ត្រឡប់ក្រោយ",
    "title": "មតិយោបល់ដែលបានលាក់",
    "subtitle": "មតិយោបល់ដែលបានលាក់ដោយពាក្យ និងច្បាប់របស់អ្នក",
    "settingsAria": "ការកំណត់មតិយោបល់ដែលបានលាក់",
    "searchPlaceholder": "ស្វែងរកមតិយោបល់ដែលបានលាក់...",
    "clearSearch": "សម្អាតការស្វែងរក",
    "filterAria": "តម្រងមតិយោបល់ដែលបានលាក់",
    "comment": "មតិយោបល់",
    "comments": "មតិយោបល់",
    "sortAria": "តម្រៀបមតិយោបល់ដែលបានលាក់",
    "newestFirst": "ថ្មីបំផុតមុន",
    "oldestFirst": "ចាស់បំផុតមុន",
    "noMatching": "រកមិនឃើញមតិយោបល់ដែលត្រូវគ្នា",
    "noStatus": "មិនមានមតិយោបល់ {{status}}",
    "trySearch": "សាកពាក្យស្វែងរកផ្សេង ឬសម្អាតការស្វែងរក។",
    "pendingEmpty": "មតិយោបល់ដែលត្រូវនឹងពាក្យលាក់ស្វ័យប្រវត្តិនឹងបង្ហាញនៅទីនេះសម្រាប់ពិនិត្យ។",
    "statusEmpty": "មតិយោបល់ដែលមានស្ថានភាពពិនិត្យនេះនឹងបង្ហាញនៅទីនេះ។",
    "manageAutoHide": "គ្រប់គ្រងពាក្យលាក់ស្វ័យប្រវត្តិ",
    "previousPage": "ទំព័រមុន",
    "nextPage": "ទំព័របន្ទាប់",
    "settingsTitle": "ការកំណត់មតិយោបល់ដែលបានលាក់",
    "settingsSubtitle": "គ្រប់គ្រងច្បាប់ និងការសម្អាតសម្រាប់មតិយោបល់ដែលបានលាក់។",
    "closeSettings": "បិទការកំណត់",
    "manageAutoHideSubtitle": "ជ្រើសពាក្យដែលផ្ញើមតិយោបល់ត្រូវគ្នាទៅកាន់ រង់ចាំពិនិត្យ។",
    "closeMessage": "បិទសារ"
  },
  "zh": {
    "pendingReview": "待审核",
    "keptHidden": "保持隐藏",
    "restored": "已恢复",
    "deleted": "已删除",
    "pending": "待处理",
    "hidden": "已隐藏",
    "justNow": "刚刚",
    "minutesAgo": "{{count}}分钟前",
    "hoursAgo": "{{count}}小时前",
    "daysAgo": "{{count}}天前",
    "episodeNumber": "第 {{number}} 章",
    "episode": "章节",
    "reader": "读者",
    "unknownStory": "未知故事",
    "storyPrefix": "故事：",
    "commentUnavailable": "评论内容不可用。",
    "matched": "匹配：",
    "more": "+{{count}} 更多",
    "autoHiddenRule": "已按你的规则自动隐藏",
    "keepHidden": "保持隐藏",
    "restore": "恢复",
    "delete": "删除",
    "inTrash": "此评论已在回收站中。",
    "loginAgain": "请重新登录。",
    "requestFailed": "请求失败",
    "loadFailed": "无法加载隐藏评论。",
    "moveTrashConfirm": "将此评论移至回收站？",
    "updated": "隐藏评论已更新。",
    "updateFailed": "无法更新隐藏评论。",
    "goBack": "返回",
    "title": "隐藏评论",
    "subtitle": "被你的词语和规则隐藏的评论",
    "settingsAria": "隐藏评论设置",
    "searchPlaceholder": "搜索隐藏评论...",
    "clearSearch": "清除搜索",
    "filterAria": "筛选隐藏评论",
    "comment": "条评论",
    "comments": "条评论",
    "sortAria": "排序隐藏评论",
    "newestFirst": "最新优先",
    "oldestFirst": "最旧优先",
    "noMatching": "没有匹配的评论",
    "noStatus": "没有{{status}}评论",
    "trySearch": "尝试其他搜索词或清除搜索。",
    "pendingEmpty": "匹配自动隐藏词的评论会出现在这里等待审核。",
    "statusEmpty": "具有此审核状态的评论会显示在这里。",
    "manageAutoHide": "管理自动隐藏词",
    "previousPage": "上一页",
    "nextPage": "下一页",
    "settingsTitle": "隐藏评论设置",
    "settingsSubtitle": "管理隐藏评论的规则和清理。",
    "closeSettings": "关闭设置",
    "manageAutoHideSubtitle": "选择会将匹配评论送到待审核的词。",
    "closeMessage": "关闭消息"
  },
  "ja": {
    "pendingReview": "確認待ち",
    "keptHidden": "非表示を維持",
    "restored": "復元済み",
    "deleted": "削除済み",
    "pending": "保留",
    "hidden": "非表示",
    "justNow": "たった今",
    "minutesAgo": "{{count}}分前",
    "hoursAgo": "{{count}}時間前",
    "daysAgo": "{{count}}日前",
    "episodeNumber": "エピソード {{number}}",
    "episode": "エピソード",
    "reader": "読者",
    "unknownStory": "不明なストーリー",
    "storyPrefix": "ストーリー：",
    "commentUnavailable": "コメント本文を表示できません。",
    "matched": "一致：",
    "more": "+{{count}} 件",
    "autoHiddenRule": "ルールにより自動で非表示",
    "keepHidden": "非表示を維持",
    "restore": "復元",
    "delete": "削除",
    "inTrash": "このコメントはゴミ箱にあります。",
    "loginAgain": "もう一度ログインしてください。",
    "requestFailed": "リクエストに失敗しました",
    "loadFailed": "非表示コメントを読み込めませんでした。",
    "moveTrashConfirm": "このコメントをゴミ箱へ移動しますか？",
    "updated": "非表示コメントを更新しました。",
    "updateFailed": "非表示コメントを更新できませんでした。",
    "goBack": "戻る",
    "title": "非表示コメント",
    "subtitle": "ワードとルールで非表示になったコメント",
    "settingsAria": "非表示コメント設定",
    "searchPlaceholder": "非表示コメントを検索...",
    "clearSearch": "検索を消去",
    "filterAria": "非表示コメントを絞り込む",
    "comment": "コメント",
    "comments": "コメント",
    "sortAria": "非表示コメントを並べ替え",
    "newestFirst": "新しい順",
    "oldestFirst": "古い順",
    "noMatching": "一致するコメントがありません",
    "noStatus": "{{status}}のコメントはありません",
    "trySearch": "別の検索語を試すか、検索を消去してください。",
    "pendingEmpty": "自動非表示ワードに一致したコメントが確認用にここへ表示されます。",
    "statusEmpty": "この確認ステータスのコメントがここに表示されます。",
    "manageAutoHide": "自動非表示ワードを管理",
    "previousPage": "前のページ",
    "nextPage": "次のページ",
    "settingsTitle": "非表示コメント設定",
    "settingsSubtitle": "非表示コメントのルールとクリーンアップを管理します。",
    "closeSettings": "設定を閉じる",
    "manageAutoHideSubtitle": "一致するコメントを確認待ちに送るワードを選択します。",
    "closeMessage": "メッセージを閉じる"
  },
  "ko": {
    "pendingReview": "검토 대기",
    "keptHidden": "숨김 유지",
    "restored": "복원됨",
    "deleted": "삭제됨",
    "pending": "대기",
    "hidden": "숨김",
    "justNow": "방금",
    "minutesAgo": "{{count}}분 전",
    "hoursAgo": "{{count}}시간 전",
    "daysAgo": "{{count}}일 전",
    "episodeNumber": "에피소드 {{number}}",
    "episode": "에피소드",
    "reader": "독자",
    "unknownStory": "알 수 없는 스토리",
    "storyPrefix": "스토리:",
    "commentUnavailable": "댓글 내용을 사용할 수 없습니다.",
    "matched": "일치:",
    "more": "+{{count}}개 더",
    "autoHiddenRule": "내 규칙에 따라 자동 숨김",
    "keepHidden": "숨김 유지",
    "restore": "복원",
    "delete": "삭제",
    "inTrash": "이 댓글은 휴지통에 있습니다.",
    "loginAgain": "다시 로그인해 주세요.",
    "requestFailed": "요청에 실패했습니다",
    "loadFailed": "숨긴 댓글을 불러오지 못했습니다.",
    "moveTrashConfirm": "이 댓글을 휴지통으로 이동할까요?",
    "updated": "숨긴 댓글을 업데이트했습니다.",
    "updateFailed": "숨긴 댓글을 업데이트하지 못했습니다.",
    "goBack": "뒤로",
    "title": "숨긴 댓글",
    "subtitle": "내 단어와 규칙으로 숨겨진 댓글",
    "settingsAria": "숨긴 댓글 설정",
    "searchPlaceholder": "숨긴 댓글 검색...",
    "clearSearch": "검색 지우기",
    "filterAria": "숨긴 댓글 필터",
    "comment": "댓글",
    "comments": "댓글",
    "sortAria": "숨긴 댓글 정렬",
    "newestFirst": "최신순",
    "oldestFirst": "오래된순",
    "noMatching": "일치하는 댓글이 없습니다",
    "noStatus": "{{status}} 댓글이 없습니다",
    "trySearch": "다른 검색어를 시도하거나 검색을 지우세요.",
    "pendingEmpty": "자동 숨김 단어와 일치하는 댓글이 검토를 위해 여기에 표시됩니다.",
    "statusEmpty": "이 검토 상태의 댓글이 여기에 표시됩니다.",
    "manageAutoHide": "자동 숨김 단어 관리",
    "previousPage": "이전 페이지",
    "nextPage": "다음 페이지",
    "settingsTitle": "숨긴 댓글 설정",
    "settingsSubtitle": "숨긴 댓글 규칙과 정리를 관리합니다.",
    "closeSettings": "설정 닫기",
    "manageAutoHideSubtitle": "일치하는 댓글을 검토 대기로 보내는 단어를 선택하세요.",
    "closeMessage": "메시지 닫기"
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HIDDEN_COMMENTS_PATH =
  '/api/authors/me/comment-protection/hidden-comments'

const STATUS_OPTIONS = [
  {
    value: 'hidden',
    labelKey: 'pendingReview',
  },
  {
    value: 'kept_hidden',
    labelKey: 'keptHidden',
  },
  {
    value: 'restored',
    labelKey: 'restored',
  },
  {
    value: 'deleted',
    labelKey: 'deleted',
  },
]

const STATUS_CONFIG = {
  hidden: {
    labelKey: 'pendingReview',
    shortLabelKey: 'pending',
    icon: 'fa-regular fa-rectangle-list',
    iconClass:
      'bg-[#f0eaff] text-[#6d3df5]',
    textClass:
      'text-[#6438ed]',
  },
  kept_hidden: {
    labelKey: 'keptHidden',
    shortLabelKey: 'hidden',
    icon: 'fa-regular fa-eye-slash',
    iconClass:
      'bg-[#eaf3ff] text-[#1570d8]',
    textClass:
      'text-[#1570d8]',
  },
  restored: {
    labelKey: 'restored',
    shortLabelKey: 'restored',
    icon: 'fa-regular fa-circle-check',
    iconClass:
      'bg-[#e7faf1] text-[#159768]',
    textClass:
      'text-[#159768]',
  },
  deleted: {
    labelKey: 'deleted',
    shortLabelKey: 'deleted',
    icon: 'fa-regular fa-trash-can',
    iconClass:
      'bg-[#fff0f2] text-[#ef3f56]',
    textClass:
      'text-[#ef3f56]',
  },
}

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function relativeTime(value) {
  const date = new Date(value || '')
  const time = date.getTime()
  if (!Number.isFinite(time)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000))
  if (seconds < 60) return getDisplayText('authorHiddenComments.justNow')
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return getDisplayText('authorHiddenComments.minutesAgo', { count: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return getDisplayText('authorHiddenComments.hoursAgo', { count: hours })
  const days = Math.floor(hours / 24)
  if (days < 7) return getDisplayText('authorHiddenComments.daysAgo', { count: days })
  return date.toLocaleDateString(getDisplayLanguageId(), { month: 'short', day: 'numeric', year: 'numeric' })
}

function readerInitial(reader) {
  return String(
    reader?.name ||
    reader?.username ||
    'R'
  )
    .trim()
    .charAt(0)
    .toUpperCase()
}

function episodeLabel(episode) {
  if (!episode) return ''

  if (
    Number(
      episode.episode_number || 0
    ) > 0
  ) {
    return getDisplayText('authorHiddenComments.episodeNumber', { number: episode.episode_number })
  }

  return episode.title || getDisplayText('authorHiddenComments.episode')
}

function LoadingCards() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_28px_rgba(61,45,115,0.06)]"
        >
          <div className="flex gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />

            <div className="min-w-0 flex-1">
              <div className="h-4 w-28 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="mt-2 h-3 w-48 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatCard({
  status,
  count,
  active,
  onClick,
}) {
  const { t } = useDisplayTranslation()
  const config =
    STATUS_CONFIG[status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[21px] border bg-[var(--shadow-bg-surface)] px-2.5 py-3.5 text-center shadow-[0_8px_22px_rgba(61,45,115,0.05)] transition active:scale-[0.98] ${
        active
          ? 'border-[#7a55f6] ring-2 ring-[#7a55f6]/10'
          : 'border-[var(--shadow-border)]'
      }`}
    >
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] ${config.iconClass}`}
      >
        <i
          className={`${config.icon} text-[15px]`}
        />
      </div>

      <div className="mt-2 text-[19px] font-black text-[var(--shadow-text-primary)]">
        {Number(count || 0)}
      </div>

      <div
        className={`mt-0.5 text-[10.5px] font-extrabold ${config.textClass}`}
      >
        {t(`authorHiddenComments.${config.labelKey}`)}
      </div>
    </button>
  )
}

function Avatar({ reader }) {
  if (reader?.avatar_url) {
    return (
      <img
        src={reader.avatar_url}
        alt=""
        className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[var(--shadow-bg-surface)] shadow-sm"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a55f6] to-[#ba93ff] text-[17px] font-black text-white ring-2 ring-[var(--shadow-bg-surface)] shadow-sm">
      {readerInitial(reader)}
    </div>
  )
}

function ActionButton({
  icon,
  label,
  className,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border px-2 text-[11.5px] font-extrabold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <i
        className={`${icon} text-[12px]`}
      />

      <span className="truncate">
        {label}
      </span>
    </button>
  )
}

function HiddenCommentCard({
  item,
  actionKey,
  onAction,
}) {
  const { t } = useDisplayTranslation()
  const status =
    STATUS_CONFIG[item.status] ||
    STATUS_CONFIG.hidden
  const isWorking =
    actionKey.startsWith(
      `${item.id}:`
    )
  const matchedWords =
    Array.isArray(
      item.matched_words
    )
      ? item.matched_words
      : []
  const visibleWords =
    matchedWords.slice(0, 3)
  const extraWords =
    Math.max(
      0,
      matchedWords.length - 3
    )

  return (
    <article className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_10px_30px_rgba(61,45,115,0.065)]">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar
            reader={item.reader}
          />

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate text-[14px] font-black text-[var(--shadow-text-primary)]">
                {item.reader?.name ||
                  item.reader
                    ?.username ||
                  t('authorHiddenComments.reader')}
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.04em] ${status.iconClass} ${status.textClass}`}
              >
                {t(`authorHiddenComments.${status.shortLabelKey}`)}
              </span>

              <span className="ml-auto shrink-0 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                {relativeTime(
                  item.created_at
                )}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
              <span className="max-w-full truncate">
                {t('authorHiddenComments.storyPrefix')}{' '}
                {item.story?.title ||
                  t('authorHiddenComments.unknownStory')}
              </span>

              {item.episode ? (
                <>
                  <span>•</span>
                  <span>
                    {episodeLabel(
                      item.episode
                    )}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap break-words text-[13.5px] font-medium leading-6 text-[var(--shadow-text-primary)]">
          {item.text ||
            t('authorHiddenComments.commentUnavailable')}
        </p>

        {visibleWords.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleWords.map(
              (
                word,
                index
              ) => (
                <span
                  key={`${word.word}-${index}`}
                  className="rounded-[10px] bg-[#fff0f2] px-2.5 py-1.5 text-[10.5px] font-bold text-[#e23d52]"
                >
                  {t('authorHiddenComments.matched')}{' '}
                  {word.word}
                  {Number(
                    word.count || 0
                  ) > 1
                    ? ` ×${word.count}`
                    : ''}
                </span>
              )
            )}

            {extraWords ? (
              <span className="rounded-[10px] bg-[var(--shadow-bg-soft)] px-2.5 py-1.5 text-[10.5px] font-bold text-[var(--shadow-text-secondary)]">
                {t('authorHiddenComments.more', { count: extraWords })}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="mt-3 inline-flex rounded-[10px] bg-[var(--shadow-bg-soft)] px-2.5 py-1.5 text-[10.5px] font-bold text-[var(--shadow-text-secondary)]">
            {t('authorHiddenComments.autoHiddenRule')}
          </div>
        )}
      </div>

      {item.status !== 'deleted' ? (
        <div className="flex gap-2 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-3">
          {item.status !==
          'kept_hidden' ? (
            <ActionButton
              icon={
                actionKey ===
                `${item.id}:keep_hidden`
                  ? 'fa-solid fa-spinner animate-spin'
                  : 'fa-solid fa-lock'
              }
              label={t('authorHiddenComments.keepHidden')}
              disabled={isWorking}
              onClick={() =>
                onAction(
                  item,
                  'keep_hidden'
                )
              }
              className="border-[#e5ddff] bg-[var(--shadow-bg-surface)] text-[#6d3df5]"
            />
          ) : null}

          {item.status !==
          'restored' ? (
            <ActionButton
              icon={
                actionKey ===
                `${item.id}:restore`
                  ? 'fa-solid fa-spinner animate-spin'
                  : 'fa-solid fa-rotate'
              }
              label={t('authorHiddenComments.restore')}
              disabled={isWorking}
              onClick={() =>
                onAction(
                  item,
                  'restore'
                )
              }
              className="border-[#dbe7ff] bg-[var(--shadow-bg-surface)] text-[#1769e0]"
            />
          ) : null}

          <ActionButton
            icon={
              actionKey ===
                `${item.id}:delete`
                ? 'fa-solid fa-spinner animate-spin'
                : 'fa-regular fa-trash-can'
            }
            label={t('authorHiddenComments.delete')}
            disabled={isWorking}
            onClick={() =>
              onAction(
                item,
                'delete'
              )
            }
            className="border-[#ffdce1] bg-[#fff7f8] text-[#ef334d]"
          />
        </div>
      ) : (
        <div className="border-t border-[var(--shadow-border)] bg-[#fff8f9] px-4 py-3 text-center text-[11.5px] font-bold text-[#ef3f56]">
          {t('authorHiddenComments.inTrash')}
        </div>
      )}
    </article>
  )
}

export default function AuthorHiddenCommentsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const toastTimerRef =
    useRef(null)
  const searchTimerRef =
    useRef(null)
  const [status, setStatus] =
    useState('hidden')
  const [
    searchInput,
    setSearchInput,
  ] = useState('')
  const [search, setSearch] =
    useState('')
  const [sort, setSort] =
    useState('newest')
  const [page, setPage] =
    useState(1)
  const [loading, setLoading] =
    useState(true)
  const [items, setItems] =
    useState([])
  const [counts, setCounts] =
    useState({
      hidden: 0,
      kept_hidden: 0,
      restored: 0,
      deleted: 0,
    })
  const [total, setTotal] =
    useState(0)
  const [
    totalPages,
    setTotalPages,
  ] = useState(1)
  const [
    actionKey,
    setActionKey,
  ] = useState('')
  const [toast, setToast] =
    useState(null)
  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false)

  const openAutoHideWords =
    () => {
      navigate(
        '/author/comment-protection?view=word-filters&type=auto_hide'
      )
    }

  const request = useCallback(
    async (
      path,
      options = {}
    ) => {
      const token =
        getAuthToken()

      if (!token) {
        navigate('/login', {
          replace: true,
        })
        throw new Error(
          t('authorHiddenComments.loginAgain')
        )
      }

      const response =
        await fetch(
          `${API_BASE_URL}${path}`,
          {
            ...options,
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`,
              ...(options.headers ||
                {}),
            },
          }
        )

      const data =
        await response
          .json()
          .catch(() => ({}))

      if (
        response.status === 401
      ) {
        navigate('/login', {
          replace: true,
        })
      }

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('authorHiddenComments.requestFailed')
        )
      }

      return data
    },
    [navigate, t]
  )

  const showToast = useCallback(
    (
      message,
      type = 'success'
    ) => {
      setToast({
        message,
        type,
      })

      window.clearTimeout(
        toastTimerRef.current
      )

      toastTimerRef.current =
        window.setTimeout(() => {
          setToast(null)
        }, 2300)
    },
    []
  )

  useEffect(() => {
    return () => {
      window.clearTimeout(
        toastTimerRef.current
      )
      window.clearTimeout(
        searchTimerRef.current
      )
    }
  }, [])

  useEffect(() => {
    window.clearTimeout(
      searchTimerRef.current
    )

    searchTimerRef.current =
      window.setTimeout(() => {
        setSearch(
          searchInput.trim()
        )
        setPage(1)
      }, 320)
  }, [searchInput])

  const loadComments =
    useCallback(async () => {
      try {
        setLoading(true)

        const params =
          new URLSearchParams({
            status,
            search,
            sort,
            page:
              String(page),
            limit: '10',
          })
        const data =
          await request(
            `${HIDDEN_COMMENTS_PATH}?${params.toString()}`
          )

        setItems(
          Array.isArray(
            data.comments
          )
            ? data.comments
            : []
        )
        setCounts({
          hidden:
            Number(
              data.counts
                ?.hidden || 0
            ),
          kept_hidden:
            Number(
              data.counts
                ?.kept_hidden || 0
            ),
          restored:
            Number(
              data.counts
                ?.restored || 0
            ),
          deleted:
            Number(
              data.counts
                ?.deleted || 0
            ),
        })
        setTotal(
          Number(
            data.total || 0
          )
        )
        setTotalPages(
          Math.max(
            1,
            Number(
              data.total_pages || 1
            )
          )
        )

        if (
          Number(
            data.page || 1
          ) !== page
        ) {
          setPage(
            Number(
              data.page || 1
            )
          )
        }
      } catch (error) {
        showToast(
          error.message ||
            t('authorHiddenComments.loadFailed'),
          'error'
        )
      } finally {
        setLoading(false)
      }
    }, [
      page,
      request,
      search,
      showToast,
      sort,
      status,
      t,
    ])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const activeConfig =
    STATUS_CONFIG[status]
  const statusCards =
    useMemo(
      () =>
        STATUS_OPTIONS.map(
          (option) => ({
            ...option,
            count:
              counts[
                option.value
              ] || 0,
          })
        ),
      [counts]
    )

  const handleStatusChange = (
    nextStatus
  ) => {
    setStatus(nextStatus)
    setPage(1)
  }

  const handleAction = async (
    item,
    action
  ) => {
    if (
      action === 'delete'
    ) {
      const approved =
        window.confirm(
          t('authorHiddenComments.moveTrashConfirm')
        )

      if (!approved) return
    }

    try {
      setActionKey(
        `${item.id}:${action}`
      )

      const data =
        await request(
          `${HIDDEN_COMMENTS_PATH}/${encodeURIComponent(
            item.id
          )}`,
          {
            method: 'PATCH',
            body:
              JSON.stringify({
                action,
              }),
          }
        )

      showToast(
        data.message ||
          t('authorHiddenComments.updated')
      )
      await loadComments()
    } catch (error) {
      showToast(
        error.message ||
          t('authorHiddenComments.updateFailed'),
        'error'
      )
    } finally {
      setActionKey('')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/author/comment-protection'
              )
            }
            className="flex h-10 w-10 items-center justify-start text-[var(--shadow-text-primary)] transition active:scale-95 active:opacity-60"
            aria-label={t('authorHiddenComments.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
              {t('authorHiddenComments.title')}
            </h1>

            <p className="mt-0.5 truncate text-[10.5px] font-medium text-[var(--shadow-text-secondary)]">
              {t('authorHiddenComments.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSettingsOpen(true)
            }
            className="flex h-10 w-10 items-center justify-end text-[var(--shadow-text-primary)] transition active:scale-95 active:opacity-60"
            aria-label={t('authorHiddenComments.settingsAria')}
          >
            <i className="fa-solid fa-sliders text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {statusCards.map(
            (card) => (
              <StatCard
                key={card.value}
                status={
                  card.value
                }
                count={card.count}
                active={
                  status ===
                  card.value
                }
                onClick={() =>
                  handleStatusChange(
                    card.value
                  )
                }
              />
            )
          )}
        </section>

        <section className="mt-3.5 flex gap-2.5">
          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-[var(--shadow-text-tertiary)]" />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder={t('authorHiddenComments.searchPlaceholder')}
              className="h-12 w-full rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-10 pr-10 text-[13px] font-semibold text-[var(--shadow-text-primary)] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition placeholder:font-medium placeholder:text-[var(--shadow-text-tertiary)] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
            />

            {searchInput ? (
              <button
                type="button"
                onClick={() =>
                  setSearchInput('')
                }
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] active:bg-[var(--shadow-bg-soft)]"
                aria-label={t('authorHiddenComments.clearSearch')}
              >
                <i className="fa-solid fa-xmark text-[13px]" />
              </button>
            ) : null}
          </div>

          <div className="relative shrink-0">
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value
                )
              }
              className="h-12 max-w-[154px] appearance-none rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-4 pr-9 text-[12px] font-extrabold text-[var(--shadow-text-primary)] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
              aria-label={t('authorHiddenComments.filterAria')}
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {t(`authorHiddenComments.${option.labelKey}`)}
                  </option>
                )
              )}
            </select>

            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--shadow-text-secondary)]" />
          </div>
        </section>

        <section className="mt-3 flex items-center justify-between gap-3 px-0.5">
          <div>
            <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">
              {t(`authorHiddenComments.${activeConfig.labelKey}`)}
            </h2>

            <p className="mt-0.5 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
              {total}{' '}
              {total === 1
                ? t('authorHiddenComments.comment')
                : t('authorHiddenComments.comments')}
            </p>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(event) => {
                setSort(
                  event.target.value
                )
                setPage(1)
              }}
              className="h-9 appearance-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-3 pr-8 text-[10.5px] font-bold text-[var(--shadow-text-secondary)] outline-none"
              aria-label={t('authorHiddenComments.sortAria')}
            >
              <option value="newest">
                {t('authorHiddenComments.newestFirst')}
              </option>

              <option value="oldest">
                {t('authorHiddenComments.oldestFirst')}
              </option>
            </select>

            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[var(--shadow-text-tertiary)]" />
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <LoadingCards />
          ) : items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <HiddenCommentCard
                  key={item.id}
                  item={item}
                  actionKey={
                    actionKey
                  }
                  onAction={
                    handleAction
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] ${activeConfig.iconClass}`}
              >
                <i
                  className={`${activeConfig.icon} text-[20px]`}
                />
              </div>

              <h3 className="mt-3 text-[14px] font-black text-[var(--shadow-text-primary)]">
                {search
                  ? t('authorHiddenComments.noMatching')
                  : t('authorHiddenComments.noStatus', { status: t(`authorHiddenComments.${activeConfig.labelKey}`) })}
              </h3>

              <p className="mx-auto mt-1.5 max-w-[290px] text-[11.5px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                {search
                  ? t('authorHiddenComments.trySearch')
                  : status ===
                      'hidden'
                    ? t('authorHiddenComments.pendingEmpty')
                    : t('authorHiddenComments.statusEmpty')}
              </p>

              {!search &&
              status === 'hidden' ? (
                <button
                  type="button"
                  onClick={
                    openAutoHideWords
                  }
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#7047f5] to-[#8459ff] px-4 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(112,71,245,0.22)] transition active:scale-95"
                >
                  <i className="fa-solid fa-filter text-[11px]" />
                  {t('authorHiddenComments.manageAutoHide')}
                </button>
              ) : null}
            </div>
          )}
        </section>

        {!loading &&
        totalPages > 1 ? (
          <nav className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                )
              }
              disabled={page <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] shadow-sm active:scale-95 disabled:opacity-35"
              aria-label={t('authorHiddenComments.previousPage')}
            >
              <i className="fa-solid fa-chevron-left text-[11px]" />
            </button>

            <div className="rounded-[14px] bg-gradient-to-r from-[#7047f5] to-[#855dff] px-4 py-2.5 text-[11.5px] font-black text-white shadow-[0_8px_20px_rgba(112,71,245,0.22)]">
              {page} /{' '}
              {totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setPage(
                  (current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                )
              }
              disabled={
                page >= totalPages
              }
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] shadow-sm active:scale-95 disabled:opacity-35"
              aria-label={t('authorHiddenComments.nextPage')}
            >
              <i className="fa-solid fa-chevron-right text-[11px]" />
            </button>
          </nav>
        ) : null}
      </main>

      {settingsOpen ? (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/35 px-3 pb-[calc(12px+env(safe-area-inset-bottom))]"
          role="presentation"
          onClick={() =>
            setSettingsOpen(false)
          }
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="hidden-comments-settings-title"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-lg overflow-hidden rounded-[28px] bg-[var(--shadow-bg-elevated)] shadow-[0_24px_80px_rgba(17,24,39,0.24)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--shadow-border)] px-5 py-4">
              <div>
                <h2
                  id="hidden-comments-settings-title"
                  className="text-[16px] font-black text-[var(--shadow-text-primary)]"
                >
                  {t('authorHiddenComments.settingsTitle')}
                </h2>

                <p className="mt-1 text-[11px] font-medium text-[var(--shadow-text-tertiary)]">
                  {t('authorHiddenComments.settingsSubtitle')}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] transition active:scale-95 active:opacity-60"
                aria-label={t('authorHiddenComments.closeSettings')}
              >
                <i className="fa-solid fa-xmark text-[16px]" />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen(false)
                  openAutoHideWords()
                }}
                className="flex w-full items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-left shadow-[0_8px_24px_rgba(61,45,115,0.05)] transition active:scale-[0.99]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f1ebff] text-[#7047f5]">
                  <i className="fa-solid fa-filter text-[15px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[13.5px] font-black text-[var(--shadow-text-primary)]">
                    {t('authorHiddenComments.manageAutoHide')}
                  </h3>

                  <p className="mt-1 text-[11.5px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                    {t('authorHiddenComments.manageAutoHideSubtitle')}
                  </p>
                </div>

                <i className="fa-solid fa-chevron-right text-[11px] text-[var(--shadow-text-disabled)]" />
              </button>

              <AuthorAutoCleanupSettings
                showToast={showToast}
              />
            </div>
          </section>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-[calc(18px+env(safe-area-inset-bottom))] left-1/2 z-[120] w-[calc(100%-28px)] max-w-md -translate-x-1/2">
          <div
            className={`flex items-center gap-3 rounded-[20px] border px-4 py-3 shadow-[0_18px_50px_rgba(32,28,51,0.18)] ${
              toast.type === 'error'
                ? 'border-[#ffd6dc] bg-[#fff5f6] text-[#c93649]'
                : 'border-[#ccefd8] bg-[#f0fff5] text-[#16803c]'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                toast.type === 'error'
                  ? 'bg-[#ffe1e5]'
                  : 'bg-[#d9f8e4]'
              }`}
            >
              <i
                className={`fa-solid ${
                  toast.type === 'error'
                    ? 'fa-triangle-exclamation'
                    : 'fa-check'
                } text-[13px]`}
              />
            </div>

            <span className="min-w-0 flex-1 text-[12px] font-bold leading-5">
              {toast.message}
            </span>

            <button
              type="button"
              onClick={() =>
                setToast(null)
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full active:bg-black/5"
              aria-label={t('authorHiddenComments.closeMessage')}
            >
              <i className="fa-solid fa-xmark text-[13px]" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

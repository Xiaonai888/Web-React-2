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

registerTranslationNamespace('authorModerationHistory', {
  "en": {
    "actionAutoHideWordAdded": "Auto-hide word added",
    "actionAutoHideWordRemoved": "Auto-hide word removed",
    "actionBlockedWordAdded": "Blocked word added",
    "actionBlockedWordRemoved": "Blocked word removed",
    "actionCommentAutoHidden": "Comment auto-hidden",
    "actionCommentKeptHidden": "Comment kept hidden",
    "actionCommentRestored": "Comment restored",
    "actionCommentDeleted": "Comment moved to Trash",
    "actionCommentAutoCleaned": "Comment auto-cleaned",
    "actionCleanupCompleted": "Auto Cleanup completed",
    "actionCleanupFailed": "Auto Cleanup failed",
    "actionCleanupSettingsUpdated": "Cleanup settings updated",
    "actionReaderBlocked": "Reader blocked",
    "actionReaderBlockUpdated": "Reader block updated",
    "actionReaderUnblocked": "Reader unblocked",
    "unknownAction": "Moderation action",
    "unknownTime": "Unknown time",
    "reader": "Reader",
    "word": "Word",
    "scope": "Scope",
    "duration": "Duration",
    "retention": "Retention",
    "retentionDays": "{{count}} days",
    "comments": "Comments",
    "reason": "Reason",
    "error": "Error",
    "targetId": "Target ID",
    "system": "System",
    "author": "Author",
    "hideDetails": "Hide details",
    "showDetails": "Show details",
    "loginAgain": "Please login again.",
    "requestFailed": "Request failed",
    "loadFailed": "Failed to load Moderation History.",
    "allActions": "All actions",
    "goBack": "Go back",
    "title": "Moderation History",
    "subtitle": "Protection actions and cleanup records",
    "refreshHistory": "Refresh history",
    "yourRecords": "Your moderation records",
    "recordsSubtitle": "Author actions and automatic system activity.",
    "searchPlaceholder": "Search history...",
    "clearSearch": "Clear search",
    "activity": "Activity",
    "record": "record",
    "records": "records",
    "noMatching": "No matching records",
    "noHistory": "No moderation history yet",
    "previousPage": "Previous page",
    "nextPage": "Next page"
  },
  "km": {
    "actionAutoHideWordAdded": "បានបន្ថែមពាក្យលាក់ស្វ័យប្រវត្តិ",
    "actionAutoHideWordRemoved": "បានដកពាក្យលាក់ស្វ័យប្រវត្តិ",
    "actionBlockedWordAdded": "បានបន្ថែមពាក្យហាម",
    "actionBlockedWordRemoved": "បានដកពាក្យហាម",
    "actionCommentAutoHidden": "មតិយោបល់ត្រូវបានលាក់ស្វ័យប្រវត្តិ",
    "actionCommentKeptHidden": "មតិយោបល់ត្រូវបានរក្សាទុកជាលាក់",
    "actionCommentRestored": "មតិយោបល់ត្រូវបានស្តារ",
    "actionCommentDeleted": "មតិយោបល់ត្រូវបានផ្លាស់ទៅធុងសំរាម",
    "actionCommentAutoCleaned": "មតិយោបល់ត្រូវបានសម្អាតស្វ័យប្រវត្តិ",
    "actionCleanupCompleted": "ការសម្អាតស្វ័យប្រវត្តិបានបញ្ចប់",
    "actionCleanupFailed": "ការសម្អាតស្វ័យប្រវត្តិបរាជ័យ",
    "actionCleanupSettingsUpdated": "បានកែការកំណត់សម្អាត",
    "actionReaderBlocked": "បាន Block អ្នកអាន",
    "actionReaderBlockUpdated": "បានកែការកំណត់ Block អ្នកអាន",
    "actionReaderUnblocked": "បានដោះ Block អ្នកអាន",
    "unknownAction": "សកម្មភាពគ្រប់គ្រង",
    "unknownTime": "មិនស្គាល់ពេលវេលា",
    "reader": "អ្នកអាន",
    "word": "ពាក្យ",
    "scope": "វិសាលភាព",
    "duration": "រយៈពេល",
    "retention": "រយៈពេលរក្សាទុក",
    "retentionDays": "{{count}} ថ្ងៃ",
    "comments": "មតិយោបល់",
    "reason": "មូលហេតុ",
    "error": "កំហុស",
    "targetId": "Target ID",
    "system": "ប្រព័ន្ធ",
    "author": "អ្នកនិពន្ធ",
    "hideDetails": "លាក់ព័ត៌មានលម្អិត",
    "showDetails": "បង្ហាញព័ត៌មានលម្អិត",
    "loginAgain": "សូមចូលគណនីម្តងទៀត។",
    "requestFailed": "សំណើបរាជ័យ",
    "loadFailed": "មិនអាចផ្ទុកប្រវត្តិគ្រប់គ្រងបានទេ។",
    "allActions": "សកម្មភាពទាំងអស់",
    "goBack": "ត្រឡប់ក្រោយ",
    "title": "ប្រវត្តិគ្រប់គ្រង",
    "subtitle": "សកម្មភាពការពារ និងកំណត់ត្រាសម្អាត",
    "refreshHistory": "Refresh ប្រវត្តិ",
    "yourRecords": "កំណត់ត្រាគ្រប់គ្រងរបស់អ្នក",
    "recordsSubtitle": "សកម្មភាពអ្នកនិពន្ធ និងសកម្មភាពស្វ័យប្រវត្តិរបស់ប្រព័ន្ធ។",
    "searchPlaceholder": "ស្វែងរកប្រវត្តិ...",
    "clearSearch": "សម្អាតការស្វែងរក",
    "activity": "សកម្មភាព",
    "record": "កំណត់ត្រា",
    "records": "កំណត់ត្រា",
    "noMatching": "រកមិនឃើញកំណត់ត្រាដែលត្រូវគ្នា",
    "noHistory": "មិនទាន់មានប្រវត្តិគ្រប់គ្រង",
    "previousPage": "ទំព័រមុន",
    "nextPage": "ទំព័របន្ទាប់"
  },
  "zh": {
    "actionAutoHideWordAdded": "已添加自动隐藏词",
    "actionAutoHideWordRemoved": "已移除自动隐藏词",
    "actionBlockedWordAdded": "已添加屏蔽词",
    "actionBlockedWordRemoved": "已移除屏蔽词",
    "actionCommentAutoHidden": "评论已自动隐藏",
    "actionCommentKeptHidden": "评论保持隐藏",
    "actionCommentRestored": "评论已恢复",
    "actionCommentDeleted": "评论已移至回收站",
    "actionCommentAutoCleaned": "评论已自动清理",
    "actionCleanupCompleted": "自动清理已完成",
    "actionCleanupFailed": "自动清理失败",
    "actionCleanupSettingsUpdated": "清理设置已更新",
    "actionReaderBlocked": "读者已屏蔽",
    "actionReaderBlockUpdated": "读者屏蔽已更新",
    "actionReaderUnblocked": "读者已解除屏蔽",
    "unknownAction": "管理操作",
    "unknownTime": "未知时间",
    "reader": "读者",
    "word": "词语",
    "scope": "范围",
    "duration": "时长",
    "retention": "保留期",
    "retentionDays": "{{count}} 天",
    "comments": "评论",
    "reason": "原因",
    "error": "错误",
    "targetId": "目标 ID",
    "system": "系统",
    "author": "作者",
    "hideDetails": "隐藏详情",
    "showDetails": "显示详情",
    "loginAgain": "请重新登录。",
    "requestFailed": "请求失败",
    "loadFailed": "无法加载管理历史。",
    "allActions": "所有操作",
    "goBack": "返回",
    "title": "管理历史",
    "subtitle": "保护操作与清理记录",
    "refreshHistory": "刷新历史",
    "yourRecords": "你的管理记录",
    "recordsSubtitle": "作者操作和系统自动活动。",
    "searchPlaceholder": "搜索历史...",
    "clearSearch": "清除搜索",
    "activity": "活动",
    "record": "条记录",
    "records": "条记录",
    "noMatching": "没有匹配记录",
    "noHistory": "暂无管理历史",
    "previousPage": "上一页",
    "nextPage": "下一页"
  },
  "ja": {
    "actionAutoHideWordAdded": "自動非表示ワードを追加",
    "actionAutoHideWordRemoved": "自動非表示ワードを削除",
    "actionBlockedWordAdded": "ブロックワードを追加",
    "actionBlockedWordRemoved": "ブロックワードを削除",
    "actionCommentAutoHidden": "コメントを自動非表示",
    "actionCommentKeptHidden": "コメントを非表示のまま保持",
    "actionCommentRestored": "コメントを復元",
    "actionCommentDeleted": "コメントをゴミ箱へ移動",
    "actionCommentAutoCleaned": "コメントを自動クリーンアップ",
    "actionCleanupCompleted": "自動クリーンアップ完了",
    "actionCleanupFailed": "自動クリーンアップ失敗",
    "actionCleanupSettingsUpdated": "クリーンアップ設定を更新",
    "actionReaderBlocked": "読者をブロック",
    "actionReaderBlockUpdated": "読者ブロックを更新",
    "actionReaderUnblocked": "読者のブロックを解除",
    "unknownAction": "管理アクション",
    "unknownTime": "不明な時刻",
    "reader": "読者",
    "word": "ワード",
    "scope": "範囲",
    "duration": "期間",
    "retention": "保持期間",
    "retentionDays": "{{count}}日",
    "comments": "コメント",
    "reason": "理由",
    "error": "エラー",
    "targetId": "対象 ID",
    "system": "システム",
    "author": "作者",
    "hideDetails": "詳細を隠す",
    "showDetails": "詳細を表示",
    "loginAgain": "もう一度ログインしてください。",
    "requestFailed": "リクエストに失敗しました",
    "loadFailed": "管理履歴を読み込めませんでした。",
    "allActions": "すべての操作",
    "goBack": "戻る",
    "title": "管理履歴",
    "subtitle": "保護操作とクリーンアップ記録",
    "refreshHistory": "履歴を更新",
    "yourRecords": "管理記録",
    "recordsSubtitle": "作者の操作とシステムの自動アクティビティ。",
    "searchPlaceholder": "履歴を検索...",
    "clearSearch": "検索をクリア",
    "activity": "アクティビティ",
    "record": "件",
    "records": "件",
    "noMatching": "一致する記録がありません",
    "noHistory": "管理履歴はまだありません",
    "previousPage": "前のページ",
    "nextPage": "次のページ"
  },
  "ko": {
    "actionAutoHideWordAdded": "자동 숨김 단어 추가됨",
    "actionAutoHideWordRemoved": "자동 숨김 단어 제거됨",
    "actionBlockedWordAdded": "차단 단어 추가됨",
    "actionBlockedWordRemoved": "차단 단어 제거됨",
    "actionCommentAutoHidden": "댓글 자동 숨김",
    "actionCommentKeptHidden": "댓글 숨김 유지",
    "actionCommentRestored": "댓글 복원됨",
    "actionCommentDeleted": "댓글이 휴지통으로 이동됨",
    "actionCommentAutoCleaned": "댓글 자동 정리됨",
    "actionCleanupCompleted": "자동 정리 완료",
    "actionCleanupFailed": "자동 정리 실패",
    "actionCleanupSettingsUpdated": "정리 설정 업데이트됨",
    "actionReaderBlocked": "독자 차단됨",
    "actionReaderBlockUpdated": "독자 차단 업데이트됨",
    "actionReaderUnblocked": "독자 차단 해제됨",
    "unknownAction": "관리 작업",
    "unknownTime": "알 수 없는 시간",
    "reader": "독자",
    "word": "단어",
    "scope": "범위",
    "duration": "기간",
    "retention": "보관 기간",
    "retentionDays": "{{count}}일",
    "comments": "댓글",
    "reason": "사유",
    "error": "오류",
    "targetId": "대상 ID",
    "system": "시스템",
    "author": "작가",
    "hideDetails": "세부정보 숨기기",
    "showDetails": "세부정보 보기",
    "loginAgain": "다시 로그인해 주세요.",
    "requestFailed": "요청 실패",
    "loadFailed": "관리 기록을 불러오지 못했습니다.",
    "allActions": "모든 작업",
    "goBack": "뒤로",
    "title": "관리 기록",
    "subtitle": "보호 작업 및 정리 기록",
    "refreshHistory": "기록 새로고침",
    "yourRecords": "내 관리 기록",
    "recordsSubtitle": "작가 작업 및 시스템 자동 활동입니다.",
    "searchPlaceholder": "기록 검색...",
    "clearSearch": "검색 지우기",
    "activity": "활동",
    "record": "개 기록",
    "records": "개 기록",
    "noMatching": "일치하는 기록이 없습니다",
    "noHistory": "아직 관리 기록이 없습니다",
    "previousPage": "이전 페이지",
    "nextPage": "다음 페이지"
  }
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HISTORY_PATH =
  '/api/authors/me/comment-protection/moderation-history'

const COPY = {
  auto_hide_word_added: ['actionAutoHideWordAdded', 'fa-solid fa-filter'],
  auto_hide_word_removed: ['actionAutoHideWordRemoved', 'fa-solid fa-filter-circle-xmark'],
  blocked_word_added: ['actionBlockedWordAdded', 'fa-solid fa-ban'],
  blocked_word_removed: ['actionBlockedWordRemoved', 'fa-solid fa-circle-minus'],
  comment_auto_hidden: ['actionCommentAutoHidden', 'fa-regular fa-eye-slash'],
  comment_kept_hidden: ['actionCommentKeptHidden', 'fa-solid fa-eye-slash'],
  comment_restored: ['actionCommentRestored', 'fa-solid fa-eye'],
  comment_deleted: ['actionCommentDeleted', 'fa-regular fa-trash-can'],
  comment_auto_cleaned: ['actionCommentAutoCleaned', 'fa-solid fa-broom'],
  auto_cleanup_completed: ['actionCleanupCompleted', 'fa-solid fa-circle-check'],
  auto_cleanup_failed: ['actionCleanupFailed', 'fa-solid fa-triangle-exclamation'],
  cleanup_settings_updated: ['actionCleanupSettingsUpdated', 'fa-solid fa-sliders'],
  reader_blocked: ['actionReaderBlocked', 'fa-solid fa-user-slash'],
  reader_block_updated: ['actionReaderBlockUpdated', 'fa-solid fa-user-clock'],
  reader_unblocked: ['actionReaderUnblocked', 'fa-solid fa-user-check'],
}

function getToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function humanize(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function configFor(action) {
  const item = COPY[action]
  return {
    labelKey: item?.[0] || 'unknownAction',
    icon: item?.[1] || 'fa-solid fa-shield-halved',
  }
}

function formatDate(value) {
  const date = new Date(value || '')
  if (Number.isNaN(date.getTime())) return getDisplayText('authorModerationHistory.unknownTime')
  return date.toLocaleString(getDisplayLanguageId(), {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function HistoryCard({ item }) {
  const { t } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const config = configFor(
    item.action_type
  )
  const metadata =
    item.metadata &&
    typeof item.metadata === 'object'
      ? item.metadata
      : {}
  const label = t(`authorModerationHistory.${config.labelKey}`)
  const details = [
    [t('authorModerationHistory.reader'), metadata.reader_name || metadata.reader_user_id],
    [t('authorModerationHistory.word'), metadata.word],
    [t('authorModerationHistory.scope'), metadata.scope_type],
    [t('authorModerationHistory.duration'), metadata.duration],
    [t('authorModerationHistory.retention'), metadata.retention_days ? t('authorModerationHistory.retentionDays', { count: metadata.retention_days }) : ''],
    [t('authorModerationHistory.comments'), metadata.cleaned_count],
    [t('authorModerationHistory.reason'), metadata.reason],
    [t('authorModerationHistory.error'), metadata.error],
    [t('authorModerationHistory.targetId'), item.target_id],
  ].filter(([, value]) =>
    value !== null &&
    value !== undefined &&
    value !== ''
  )

  return (
    <article className="overflow-hidden rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_9px_26px_rgba(61,45,115,0.055)]">
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f1ebff] text-[#7047f5]">
          <i className={`${config.icon} text-[14px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-black text-[var(--shadow-text-primary)]">
              {label}
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.05em] ${
                item.actor_type === 'system'
                  ? 'bg-[#eef3ff] text-[#4172d9]'
                  : 'bg-[#f1ebff] text-[#7047f5]'
              }`}
            >
              {item.actor_type === 'system'
                ? t('authorModerationHistory.system')
                : t('authorModerationHistory.author')}
            </span>
          </div>

          <p className="mt-1.5 break-words text-[11.5px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
            {item.summary || label}
          </p>

          <div className="mt-2 text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-clock mr-1.5" />
            {formatDate(item.created_at)}
          </div>
        </div>

        {details.length ? (
          <button
            type="button"
            onClick={() =>
              setOpen((current) => !current)
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-tertiary)]"
            aria-label={
              open
                ? t('authorModerationHistory.hideDetails')
                : t('authorModerationHistory.showDetails')
            }
          >
            <i
              className={`fa-solid fa-chevron-down text-[10px] transition ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-4 py-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="flex items-start justify-between gap-3 border-t border-[var(--shadow-border)] py-2 first:border-t-0"
            >
              <span className="shrink-0 text-[9.5px] font-black uppercase text-[var(--shadow-text-tertiary)]">
                {label}
              </span>
              <span className="min-w-0 break-words text-right text-[10.5px] font-semibold text-[var(--shadow-text-secondary)]">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default function AuthorModerationHistoryPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const searchTimerRef = useRef(null)
  const toastTimerRef = useRef(null)
  const [logs, setLogs] = useState([])
  const [actions, setActions] = useState([])
  const [actionType, setActionType] =
    useState('all')
  const [searchInput, setSearchInput] =
    useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] =
    useState(1)
  const [loading, setLoading] =
    useState(true)
  const [toast, setToast] = useState(null)

  const request = useCallback(
    async (path) => {
      const token = getToken()

      if (!token) {
        navigate('/login', { replace: true })
        throw new Error(t('authorModerationHistory.loginAgain'))
      }

      const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await response
        .json()
        .catch(() => ({}))

      if (response.status === 401) {
        navigate('/login', { replace: true })
      }

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('authorModerationHistory.requestFailed')
        )
      }

      return data
    },
    [navigate, t]
  )

  const showError = useCallback((message) => {
    setToast({ message })
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(
      () => setToast(null),
      2400
    )
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(searchTimerRef.current)
      window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  useEffect(() => {
    window.clearTimeout(searchTimerRef.current)
    searchTimerRef.current = window.setTimeout(
      () => {
        setSearch(searchInput.trim())
        setPage(1)
      },
      320
    )
  }, [searchInput])

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        action_type: actionType,
        search,
        page: String(page),
        limit: '15',
      })
      const data = await request(
        `${HISTORY_PATH}?${params.toString()}`
      )

      setLogs(
        Array.isArray(data.logs)
          ? data.logs
          : []
      )
      setActions(
        Array.isArray(data.available_actions)
          ? data.available_actions
          : []
      )
      setTotal(Number(data.total || 0))
      setTotalPages(
        Math.max(
          1,
          Number(data.total_pages || 1)
        )
      )

      if (Number(data.page || 1) !== page) {
        setPage(Number(data.page || 1))
      }
    } catch (error) {
      showError(
        error.message ||
          t('authorModerationHistory.loadFailed')
      )
    } finally {
      setLoading(false)
    }
  }, [
    actionType,
    page,
    request,
    search,
    showError,
    t,
  ])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const options = useMemo(
    () => [
      { value: 'all', labelKey: 'allActions' },
      ...actions.map((value) => ({
        value,
        labelKey: configFor(value).labelKey,
      })),
    ],
    [actions]
  )

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate('/author/comment-protection')
            }
            className="flex h-10 w-10 items-center justify-start text-[var(--shadow-text-primary)]"
            aria-label={t('authorModerationHistory.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
              {t('authorModerationHistory.title')}
            </h1>
            <p className="mt-0.5 truncate text-[10.5px] font-medium text-[var(--shadow-text-secondary)]">
              {t('authorModerationHistory.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={loadHistory}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-end text-[#7047f5] disabled:opacity-40"
            aria-label={t('authorModerationHistory.refreshHistory')}
          >
            <i
              className={`fa-solid fa-rotate text-[13px] ${
                loading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
        <section className="rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_12px_32px_rgba(61,45,115,0.07)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#f1ebff] text-[#7047f5]">
              <i className="fa-solid fa-clock-rotate-left text-[18px]" />
            </div>
            <div>
              <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)]">
                {t('authorModerationHistory.yourRecords')}
              </h2>
              <p className="mt-1 text-[11px] font-medium text-[var(--shadow-text-secondary)]">
                {t('authorModerationHistory.recordsSubtitle')}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-3 flex gap-2.5">
          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[var(--shadow-text-tertiary)]" />
            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder={t('authorModerationHistory.searchPlaceholder')}
              className="h-12 w-full rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-10 pr-10 text-[12.5px] font-semibold text-[var(--shadow-text-primary)] outline-none focus:border-[#7555f6]"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[var(--shadow-text-tertiary)]"
                aria-label={t('authorModerationHistory.clearSearch')}
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>

          <div className="relative shrink-0">
            <select
              value={actionType}
              onChange={(event) => {
                setActionType(event.target.value)
                setPage(1)
              }}
              className="h-12 max-w-[154px] appearance-none rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-3 pr-8 text-[10.5px] font-extrabold text-[var(--shadow-text-primary)] outline-none"
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {t(`authorModerationHistory.${option.labelKey}`)}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[var(--shadow-text-tertiary)]" />
          </div>
        </section>

        <div className="mt-4 px-0.5">
          <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">
            {t('authorModerationHistory.activity')}
          </h2>
          <p className="mt-0.5 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
            {total} {total === 1 ? t('authorModerationHistory.record') : t('authorModerationHistory.records')}
          </p>
        </div>

        <section className="mt-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-[22px] bg-[var(--shadow-bg-surface)]"
                />
              ))}
            </div>
          ) : logs.length ? (
            <div className="space-y-3">
              {logs.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] bg-[#f1ebff] text-[#7047f5]">
                <i className="fa-solid fa-clock-rotate-left text-[20px]" />
              </div>
              <h3 className="mt-3 text-[14px] font-black text-[var(--shadow-text-primary)]">
                {search
                  ? t('authorModerationHistory.noMatching')
                  : t('authorModerationHistory.noHistory')}
              </h3>
            </div>
          )}
        </section>

        {!loading && totalPages > 1 ? (
          <nav className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              disabled={page <= 1}
              aria-label={t('authorModerationHistory.previousPage')}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border bg-[var(--shadow-bg-surface)] disabled:opacity-35"
            >
              <i className="fa-solid fa-chevron-left text-[11px]" />
            </button>

            <div className="rounded-[14px] bg-[#7555f6] px-4 py-2.5 text-[11.5px] font-black text-white">
              {page} / {totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
              disabled={page >= totalPages}
              aria-label={t('authorModerationHistory.nextPage')}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border bg-[var(--shadow-bg-surface)] disabled:opacity-35"
            >
              <i className="fa-solid fa-chevron-right text-[11px]" />
            </button>
          </nav>
        ) : null}
      </main>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-[120] w-[calc(100%-28px)] max-w-md -translate-x-1/2 rounded-[18px] border border-[#ffd6dc] bg-[#fff5f6] px-4 py-3 text-[12px] font-bold text-[#c93649] shadow-lg">
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorBlockedReaders', {
  "en": {
    "active": "Active",
    "expired": "Expired",
    "all": "All",
    "h1": "1 hour",
    "h6": "6 hours",
    "h24": "24 hours",
    "d3": "3 days",
    "d7": "7 days",
    "d30": "30 days",
    "unknown": "Unknown",
    "minutesLeft": "{{count}}m left",
    "hoursLeft": "{{count}}h left",
    "daysLeft": "{{count}}d left",
    "reader": "Reader",
    "allAuthorStories": "All author stories",
    "specificStory": "Specific story",
    "until": "Until {{date}}",
    "reason": "Reason",
    "unblockReader": "Unblock Reader",
    "loadStoriesFailed": "Failed to load stories.",
    "searchReadersFailed": "Failed to search readers.",
    "readerBlocked": "Reader blocked.",
    "blockFailed": "Failed to block reader.",
    "close": "Close",
    "blockAReader": "Block a Reader",
    "chooseWho": "Choose who, where and how long.",
    "searchReader": "Search reader",
    "nameUsername": "Name or username",
    "searchingReaders": "{t('authorBlockedReaders.searchingReaders')}",
    "noReaders": "{t('authorBlockedReaders.noReaders')}",
    "blockScope": "Block scope",
    "allMyStories": "All my stories",
    "oneStory": "One story",
    "loadingStories": "Loading stories...",
    "chooseStory": "Choose a story",
    "noStories": "No stories available",
    "duration": "Duration",
    "reasonPlaceholder": "Optional reason for your records",
    "blockReader": "Block Reader",
    "loginAgain": "Please login again.",
    "requestFailed": "Request failed",
    "loadBlockedFailed": "Failed to load blocked readers.",
    "thisReader": "this reader",
    "unblockConfirm": "Unblock {{name}}?",
    "readerUnblocked": "Reader unblocked.",
    "unblockFailed": "Failed to unblock reader.",
    "goBack": "Go back",
    "title": "Blocked Readers",
    "subtitle": "Control who can comment on your stories",
    "blockReaderAria": "Block a reader",
    "searchBlocked": "Search blocked readers...",
    "clearSearch": "Clear search",
    "block": "Block",
    "record": "record",
    "records": "records",
    "noMatching": "No matching readers",
    "noActive": "No active blocks",
    "noExpired": "No expired blocks",
    "noBlocked": "No blocked readers",
    "trySearch": "Try another search term or clear your search.",
    "emptyHelp": "Block a reader from all your stories or from one specific story.",
    "previousPage": "Previous page",
    "nextPage": "Next page",
    "closeMessage": "Close message"
  },
  "km": {
    "active": "សកម្ម",
    "expired": "ផុតកំណត់",
    "all": "ទាំងអស់",
    "h1": "1 ម៉ោង",
    "h6": "6 ម៉ោង",
    "h24": "24 ម៉ោង",
    "d3": "3 ថ្ងៃ",
    "d7": "7 ថ្ងៃ",
    "d30": "30 ថ្ងៃ",
    "unknown": "មិនស្គាល់",
    "minutesLeft": "នៅសល់ {{count}} នាទី",
    "hoursLeft": "នៅសល់ {{count}} ម៉ោង",
    "daysLeft": "នៅសល់ {{count}} ថ្ងៃ",
    "reader": "អ្នកអាន",
    "allAuthorStories": "រឿងអ្នកនិពន្ធទាំងអស់",
    "specificStory": "រឿងជាក់លាក់",
    "until": "រហូតដល់ {{date}}",
    "reason": "មូលហេតុ",
    "unblockReader": "ដោះការទប់ស្កាត់អ្នកអាន",
    "loadStoriesFailed": "មិនអាចផ្ទុករឿងបានទេ។",
    "searchReadersFailed": "មិនអាចស្វែងរកអ្នកអានបានទេ។",
    "readerBlocked": "បានទប់ស្កាត់អ្នកអាន។",
    "blockFailed": "មិនអាចទប់ស្កាត់អ្នកអានបានទេ។",
    "close": "បិទ",
    "blockAReader": "ទប់ស្កាត់អ្នកអាន",
    "chooseWho": "ជ្រើសអ្នកណា ទីណា និងរយៈពេលប៉ុន្មាន។",
    "searchReader": "ស្វែងរកអ្នកអាន",
    "nameUsername": "ឈ្មោះ ឬ username",
    "searchingReaders": "កំពុងស្វែងរកអ្នកអាន...",
    "noReaders": "រកមិនឃើញអ្នកអាន",
    "blockScope": "វិសាលភាពទប់ស្កាត់",
    "allMyStories": "រឿងរបស់ខ្ញុំទាំងអស់",
    "oneStory": "រឿងមួយ",
    "loadingStories": "កំពុងផ្ទុករឿង...",
    "chooseStory": "ជ្រើសរឿង",
    "noStories": "មិនមានរឿង",
    "duration": "រយៈពេល",
    "reasonPlaceholder": "មូលហេតុជាជម្រើសសម្រាប់កំណត់ត្រា",
    "blockReader": "ទប់ស្កាត់អ្នកអាន",
    "loginAgain": "សូមចូលគណនីម្តងទៀត។",
    "requestFailed": "សំណើបានបរាជ័យ",
    "loadBlockedFailed": "មិនអាចផ្ទុកអ្នកអានដែលបានទប់ស្កាត់បានទេ។",
    "thisReader": "អ្នកអាននេះ",
    "unblockConfirm": "ដោះការទប់ស្កាត់ {{name}}?",
    "readerUnblocked": "បានដោះការទប់ស្កាត់អ្នកអាន។",
    "unblockFailed": "មិនអាចដោះការទប់ស្កាត់អ្នកអានបានទេ។",
    "goBack": "ត្រឡប់ក្រោយ",
    "title": "អ្នកអានដែលបានទប់ស្កាត់",
    "subtitle": "គ្រប់គ្រងអ្នកដែលអាចបញ្ចេញមតិលើរឿងរបស់អ្នក",
    "blockReaderAria": "ទប់ស្កាត់អ្នកអាន",
    "searchBlocked": "ស្វែងរកអ្នកអានដែលបានទប់ស្កាត់...",
    "clearSearch": "សម្អាតការស្វែងរក",
    "block": "ទប់ស្កាត់",
    "record": "កំណត់ត្រា",
    "records": "កំណត់ត្រា",
    "noMatching": "រកមិនឃើញអ្នកអានដែលត្រូវគ្នា",
    "noActive": "មិនមានការទប់ស្កាត់សកម្ម",
    "noExpired": "មិនមានការទប់ស្កាត់ផុតកំណត់",
    "noBlocked": "មិនមានអ្នកអានដែលបានទប់ស្កាត់",
    "trySearch": "សាកពាក្យស្វែងរកផ្សេង ឬសម្អាតការស្វែងរក។",
    "emptyHelp": "ទប់ស្កាត់អ្នកអានពីរឿងទាំងអស់ ឬរឿងជាក់លាក់មួយ។",
    "previousPage": "ទំព័រមុន",
    "nextPage": "ទំព័របន្ទាប់",
    "closeMessage": "បិទសារ"
  },
  "zh": {
    "active": "有效",
    "expired": "已过期",
    "all": "全部",
    "h1": "1小时",
    "h6": "6小时",
    "h24": "24小时",
    "d3": "3天",
    "d7": "7天",
    "d30": "30天",
    "unknown": "未知",
    "minutesLeft": "剩余{{count}}分钟",
    "hoursLeft": "剩余{{count}}小时",
    "daysLeft": "剩余{{count}}天",
    "reader": "读者",
    "allAuthorStories": "所有作者故事",
    "specificStory": "指定故事",
    "until": "截至 {{date}}",
    "reason": "原因",
    "unblockReader": "解除读者屏蔽",
    "loadStoriesFailed": "无法加载故事。",
    "searchReadersFailed": "无法搜索读者。",
    "readerBlocked": "读者已屏蔽。",
    "blockFailed": "无法屏蔽读者。",
    "close": "关闭",
    "blockAReader": "屏蔽读者",
    "chooseWho": "选择对象、范围和时长。",
    "searchReader": "搜索读者",
    "nameUsername": "姓名或用户名",
    "searchingReaders": "正在搜索读者...",
    "noReaders": "未找到读者",
    "blockScope": "屏蔽范围",
    "allMyStories": "我的所有故事",
    "oneStory": "一个故事",
    "loadingStories": "正在加载故事...",
    "chooseStory": "选择故事",
    "noStories": "暂无故事",
    "duration": "时长",
    "reasonPlaceholder": "可选原因，用于记录",
    "blockReader": "屏蔽读者",
    "loginAgain": "请重新登录。",
    "requestFailed": "请求失败",
    "loadBlockedFailed": "无法加载已屏蔽读者。",
    "thisReader": "此读者",
    "unblockConfirm": "解除屏蔽 {{name}}？",
    "readerUnblocked": "已解除读者屏蔽。",
    "unblockFailed": "无法解除读者屏蔽。",
    "goBack": "返回",
    "title": "已屏蔽读者",
    "subtitle": "控制谁可以在你的故事下评论",
    "blockReaderAria": "屏蔽读者",
    "searchBlocked": "搜索已屏蔽读者...",
    "clearSearch": "清除搜索",
    "block": "屏蔽",
    "record": "条记录",
    "records": "条记录",
    "noMatching": "没有匹配的读者",
    "noActive": "暂无有效屏蔽",
    "noExpired": "暂无已过期屏蔽",
    "noBlocked": "暂无已屏蔽读者",
    "trySearch": "尝试其他搜索词或清除搜索。",
    "emptyHelp": "可屏蔽读者在全部故事或指定故事下评论。",
    "previousPage": "上一页",
    "nextPage": "下一页",
    "closeMessage": "关闭消息"
  },
  "ja": {
    "active": "有効",
    "expired": "期限切れ",
    "all": "すべて",
    "h1": "1時間",
    "h6": "6時間",
    "h24": "24時間",
    "d3": "3日",
    "d7": "7日",
    "d30": "30日",
    "unknown": "不明",
    "minutesLeft": "残り{{count}}分",
    "hoursLeft": "残り{{count}}時間",
    "daysLeft": "残り{{count}}日",
    "reader": "読者",
    "allAuthorStories": "作者のすべてのストーリー",
    "specificStory": "特定のストーリー",
    "until": "{{date}} まで",
    "reason": "理由",
    "unblockReader": "読者のブロックを解除",
    "loadStoriesFailed": "ストーリーを読み込めませんでした。",
    "searchReadersFailed": "読者を検索できませんでした。",
    "readerBlocked": "読者をブロックしました。",
    "blockFailed": "読者をブロックできませんでした。",
    "close": "閉じる",
    "blockAReader": "読者をブロック",
    "chooseWho": "対象、範囲、期間を選択します。",
    "searchReader": "読者を検索",
    "nameUsername": "名前またはユーザー名",
    "searchingReaders": "読者を検索中...",
    "noReaders": "読者が見つかりません",
    "blockScope": "ブロック範囲",
    "allMyStories": "すべてのストーリー",
    "oneStory": "1つのストーリー",
    "loadingStories": "ストーリーを読み込み中...",
    "chooseStory": "ストーリーを選択",
    "noStories": "ストーリーがありません",
    "duration": "期間",
    "reasonPlaceholder": "記録用の理由（任意）",
    "blockReader": "読者をブロック",
    "loginAgain": "もう一度ログインしてください。",
    "requestFailed": "リクエストに失敗しました",
    "loadBlockedFailed": "ブロックした読者を読み込めませんでした。",
    "thisReader": "この読者",
    "unblockConfirm": "{{name}} のブロックを解除しますか？",
    "readerUnblocked": "読者のブロックを解除しました。",
    "unblockFailed": "読者のブロックを解除できませんでした。",
    "goBack": "戻る",
    "title": "ブロックした読者",
    "subtitle": "ストーリーにコメントできる読者を管理します",
    "blockReaderAria": "読者をブロック",
    "searchBlocked": "ブロックした読者を検索...",
    "clearSearch": "検索を消去",
    "block": "ブロック",
    "record": "件",
    "records": "件",
    "noMatching": "一致する読者がいません",
    "noActive": "有効なブロックはありません",
    "noExpired": "期限切れのブロックはありません",
    "noBlocked": "ブロックした読者はいません",
    "trySearch": "別の検索語を試すか、検索を消去してください。",
    "emptyHelp": "すべてのストーリーまたは特定のストーリーで読者をブロックできます。",
    "previousPage": "前のページ",
    "nextPage": "次のページ",
    "closeMessage": "メッセージを閉じる"
  },
  "ko": {
    "active": "활성",
    "expired": "만료됨",
    "all": "전체",
    "h1": "1시간",
    "h6": "6시간",
    "h24": "24시간",
    "d3": "3일",
    "d7": "7일",
    "d30": "30일",
    "unknown": "알 수 없음",
    "minutesLeft": "{{count}}분 남음",
    "hoursLeft": "{{count}}시간 남음",
    "daysLeft": "{{count}}일 남음",
    "reader": "독자",
    "allAuthorStories": "작가의 모든 스토리",
    "specificStory": "특정 스토리",
    "until": "{{date}}까지",
    "reason": "사유",
    "unblockReader": "독자 차단 해제",
    "loadStoriesFailed": "스토리를 불러오지 못했습니다.",
    "searchReadersFailed": "독자를 검색하지 못했습니다.",
    "readerBlocked": "독자를 차단했습니다.",
    "blockFailed": "독자를 차단하지 못했습니다.",
    "close": "닫기",
    "blockAReader": "독자 차단",
    "chooseWho": "대상, 범위, 기간을 선택하세요.",
    "searchReader": "독자 검색",
    "nameUsername": "이름 또는 사용자명",
    "searchingReaders": "독자 검색 중...",
    "noReaders": "독자를 찾을 수 없습니다",
    "blockScope": "차단 범위",
    "allMyStories": "내 모든 스토리",
    "oneStory": "스토리 하나",
    "loadingStories": "스토리 불러오는 중...",
    "chooseStory": "스토리 선택",
    "noStories": "스토리가 없습니다",
    "duration": "기간",
    "reasonPlaceholder": "기록용 사유(선택)",
    "blockReader": "독자 차단",
    "loginAgain": "다시 로그인해 주세요.",
    "requestFailed": "요청에 실패했습니다",
    "loadBlockedFailed": "차단한 독자를 불러오지 못했습니다.",
    "thisReader": "이 독자",
    "unblockConfirm": "{{name}} 차단을 해제할까요?",
    "readerUnblocked": "독자 차단을 해제했습니다.",
    "unblockFailed": "독자 차단을 해제하지 못했습니다.",
    "goBack": "뒤로",
    "title": "차단한 독자",
    "subtitle": "내 스토리에 댓글을 달 수 있는 독자를 관리하세요",
    "blockReaderAria": "독자 차단",
    "searchBlocked": "차단한 독자 검색...",
    "clearSearch": "검색 지우기",
    "block": "차단",
    "record": "기록",
    "records": "기록",
    "noMatching": "일치하는 독자가 없습니다",
    "noActive": "활성 차단이 없습니다",
    "noExpired": "만료된 차단이 없습니다",
    "noBlocked": "차단한 독자가 없습니다",
    "trySearch": "다른 검색어를 시도하거나 검색을 지우세요.",
    "emptyHelp": "모든 스토리 또는 특정 스토리에서 독자를 차단하세요.",
    "previousPage": "이전 페이지",
    "nextPage": "다음 페이지",
    "closeMessage": "메시지 닫기"
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const BLOCKED_READERS_PATH =
  '/api/authors/me/comment-protection/blocked-readers'

const STATUS_OPTIONS = [
  { value: 'active', labelKey: 'active' },
  { value: 'expired', labelKey: 'expired' },
  { value: 'all', labelKey: 'all' },
]

const DURATION_OPTIONS = [
  { value: '1h', labelKey: 'h1' },
  { value: '6h', labelKey: 'h6' },
  { value: '24h', labelKey: 'h24' },
  { value: '3d', labelKey: 'd3' },
  { value: '7d', labelKey: 'd7' },
  { value: '30d', labelKey: 'd30' },
]

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

function formatDate(value) {
  const date = new Date(value || '')
  if (Number.isNaN(date.getTime())) return getDisplayText('authorBlockedReaders.unknown')
  return date.toLocaleString(getDisplayLanguageId(), {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function remainingTime(value) {
  const timestamp = new Date(value || '').getTime()
  if (!Number.isFinite(timestamp)) return getDisplayText('authorBlockedReaders.expired')
  const difference = timestamp - Date.now()
  if (difference <= 0) return getDisplayText('authorBlockedReaders.expired')
  const minutes = Math.ceil(difference / 60000)
  if (minutes < 60) return getDisplayText('authorBlockedReaders.minutesLeft', { count: minutes })
  const hours = Math.ceil(minutes / 60)
  if (hours < 24) return getDisplayText('authorBlockedReaders.hoursLeft', { count: hours })
  const days = Math.ceil(hours / 24)
  return getDisplayText('authorBlockedReaders.daysLeft', { count: days })
}

function Avatar({
  reader,
  className = 'h-12 w-12',
}) {
  if (reader?.avatar_url) {
    return (
      <img
        src={reader.avatar_url}
        alt=""
        className={`${className} shrink-0 rounded-full object-cover ring-2 ring-[var(--shadow-bg-surface)] shadow-sm`}
      />
    )
  }

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7650f4] to-[#b896ff] font-black text-white ring-2 ring-[var(--shadow-bg-surface)] shadow-sm`}
    >
      {readerInitial(reader)}
    </div>
  )
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
              <div className="mt-2 h-3 w-44 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="mt-4 h-10 w-full animate-pulse rounded-[14px] bg-[var(--shadow-bg-soft)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function BlockCard({
  item,
  deletingId,
  onUnblock,
}) {
  const { t } = useDisplayTranslation()
  const active =
    item.status === 'active'

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
                  item.reader?.username ||
                  t('authorBlockedReaders.reader')}
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[8.5px] font-black uppercase tracking-[0.05em] ${
                  active
                    ? 'bg-[#e8f9ef] text-[#13824d]'
                    : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                }`}
              >
                {active
                  ? t('authorBlockedReaders.active')
                  : t('authorBlockedReaders.expired')}
              </span>
            </div>

            {item.reader?.username ? (
              <div className="mt-0.5 truncate text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
                @{item.reader.username}
              </div>
            ) : null}
          </div>

          {active ? (
            <span className="shrink-0 text-[10px] font-bold text-[#7047f5]">
              {remainingTime(
                item.expires_at
              )}
            </span>
          ) : null}
        </div>

        <div className="mt-4 rounded-[16px] bg-[var(--shadow-bg-soft)] p-3">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-shield-halved mt-0.5 text-[12px] text-[#7555f6]" />

            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] font-extrabold text-[var(--shadow-text-primary)]">
                {item.scope_type ===
                'all_author'
                  ? t('authorBlockedReaders.allAuthorStories')
                  : item.story?.title ||
                    t('authorBlockedReaders.specificStory')}
              </div>

              <div className="mt-1 text-[10.5px] font-medium leading-4 text-[var(--shadow-text-tertiary)]">
                {t('authorBlockedReaders.until', { date: formatDate(item.expires_at) })}
              </div>
            </div>
          </div>
        </div>

        {item.reason ? (
          <div className="mt-3">
            <div className="text-[9.5px] font-black uppercase tracking-[0.06em] text-[var(--shadow-text-tertiary)]">
              {t('authorBlockedReaders.reason')}
            </div>

            <p className="mt-1 whitespace-pre-wrap break-words text-[11.5px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
              {item.reason}
            </p>
          </div>
        ) : null}
      </div>

      {active ? (
        <div className="border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-3">
          <button
            type="button"
            onClick={() =>
              onUnblock(item)
            }
            disabled={
              deletingId === item.id
            }
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-[#ffd9df] bg-[#fff7f8] text-[11.5px] font-extrabold text-[#e93b52] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <i
              className={`fa-solid ${
                deletingId === item.id
                  ? 'fa-spinner animate-spin'
                  : 'fa-user-check'
              } text-[12px]`}
            />

            {t('authorBlockedReaders.unblockReader')}
          </button>
        </div>
      ) : null}
    </article>
  )
}

function ReaderResult({
  reader,
  selected,
  onSelect,
}) {
  const { t } = useDisplayTranslation()
  return (
    <button
      type="button"
      onClick={() =>
        onSelect(reader)
      }
      className={`flex w-full items-center gap-3 rounded-[18px] border p-3 text-left transition active:scale-[0.99] ${
        selected
          ? 'border-[#7555f6] bg-[var(--shadow-bg-soft)] ring-2 ring-[#7555f6]/10'
          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
      }`}
    >
      <Avatar
        reader={reader}
        className="h-11 w-11"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-black text-[var(--shadow-text-primary)]">
          {reader.name ||
            reader.username ||
            t('authorBlockedReaders.reader')}
        </div>

        {reader.username ? (
          <div className="mt-0.5 truncate text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
            @{reader.username}
          </div>
        ) : null}
      </div>

      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? 'border-[#7555f6] bg-[#7555f6] text-white'
            : 'border-[var(--shadow-border-strong)] text-transparent'
        }`}
      >
        <i className="fa-solid fa-check text-[10px]" />
      </div>
    </button>
  )
}

function BlockReaderSheet({
  open,
  onClose,
  request,
  onCreated,
  showToast,
}) {
  const { t } = useDisplayTranslation()
  const searchTimerRef =
    useRef(null)
  const [readerQuery, setReaderQuery] =
    useState('')
  const [
    readerResults,
    setReaderResults,
  ] = useState([])
  const [
    selectedReader,
    setSelectedReader,
  ] = useState(null)
  const [
    searchingReaders,
    setSearchingReaders,
  ] = useState(false)
  const [scopeType, setScopeType] =
    useState('all_author')
  const [stories, setStories] =
    useState([])
  const [storiesLoading, setStoriesLoading] =
    useState(false)
  const [storyId, setStoryId] =
    useState('')
  const [duration, setDuration] =
    useState('24h')
  const [reason, setReason] =
    useState('')
  const [saving, setSaving] =
    useState(false)

  const resetForm = useCallback(() => {
    setReaderQuery('')
    setReaderResults([])
    setSelectedReader(null)
    setScopeType('all_author')
    setStoryId('')
    setDuration('24h')
    setReason('')
  }, [])

  useEffect(() => {
    if (!open) {
      window.clearTimeout(
        searchTimerRef.current
      )
      resetForm()
      return
    }

    const loadStories =
      async () => {
        try {
          setStoriesLoading(true)

          const data =
            await request(
              `${BLOCKED_READERS_PATH}/stories`
            )

          setStories(
            Array.isArray(
              data.stories
            )
              ? data.stories
              : []
          )
        } catch (error) {
          showToast(
            error.message ||
              t('authorBlockedReaders.loadStoriesFailed'),
            'error'
          )
        } finally {
          setStoriesLoading(false)
        }
      }

    loadStories()
  }, [
    open,
    request,
    resetForm,
    showToast,
  ])

  useEffect(() => {
    if (!open) return

    window.clearTimeout(
      searchTimerRef.current
    )

    const query =
      readerQuery.trim()

    if (query.length < 2) {
      setReaderResults([])
      setSearchingReaders(false)
      return
    }

    searchTimerRef.current =
      window.setTimeout(
        async () => {
          try {
            setSearchingReaders(true)

            const params =
              new URLSearchParams({
                q: query,
              })
            const data =
              await request(
                `${BLOCKED_READERS_PATH}/search?${params.toString()}`
              )

            setReaderResults(
              Array.isArray(
                data.readers
              )
                ? data.readers
                : []
            )
          } catch (error) {
            showToast(
              error.message ||
                t('authorBlockedReaders.searchReadersFailed'),
              'error'
            )
          } finally {
            setSearchingReaders(false)
          }
        },
        320
      )

    return () => {
      window.clearTimeout(
        searchTimerRef.current
      )
    }
  }, [
    open,
    readerQuery,
    request,
    showToast,
  ])

  if (!open) return null

  const canSubmit =
    Boolean(selectedReader) &&
    Boolean(duration) &&
    (
      scopeType === 'all_author' ||
      Boolean(storyId)
    ) &&
    !saving

  const handleSubmit =
    async () => {
      if (!canSubmit) return

      try {
        setSaving(true)

        const data =
          await request(
            BLOCKED_READERS_PATH,
            {
              method: 'POST',
              body: JSON.stringify({
                reader_user_id:
                  selectedReader.id,
                scope_type:
                  scopeType,
                story_id:
                  scopeType === 'story'
                    ? storyId
                    : null,
                duration,
                reason:
                  reason.trim(),
              }),
            }
          )

        showToast(
          data.message ||
            t('authorBlockedReaders.readerBlocked')
        )
        onCreated()
        onClose()
      } catch (error) {
        showToast(
          error.message ||
            t('authorBlockedReaders.blockFailed'),
          'error'
        )
      } finally {
        setSaving(false)
      }
    }

  return (
    <div
  className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 px-0 pb-0 sm:px-3 sm:pb-[calc(10px+env(safe-area-inset-bottom))]"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-reader-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] rounded-b-none bg-[var(--shadow-bg-elevated)] shadow-[0_24px_80px_rgba(17,24,39,0.24)] sm:rounded-[28px]"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-4">
          <div>
            <h2
              id="block-reader-title"
              className="text-[16px] font-black text-[var(--shadow-text-primary)]"
            >
              {t('authorBlockedReaders.blockAReader')}
            </h2>

            <p className="mt-1 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
              {t('authorBlockedReaders.chooseWho')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] transition active:scale-95 active:opacity-60"
            aria-label={t('authorBlockedReaders.close')}
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        </header>

        <div className="space-y-5 p-4">
          <section>
            <label className="text-[12px] font-black text-[var(--shadow-text-primary)]">
              {t('authorBlockedReaders.searchReader')}
            </label>

            <div className="relative mt-2">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[var(--shadow-text-tertiary)]" />

              <input
                value={readerQuery}
                onChange={(event) => {
                  setReaderQuery(
                    event.target.value
                  )
                  setSelectedReader(null)
                }}
                placeholder={t('authorBlockedReaders.nameUsername')}
                className="h-12 w-full rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-10 pr-4 text-[12.5px] font-semibold text-[var(--shadow-text-primary)] outline-none transition placeholder:font-medium placeholder:text-[var(--shadow-text-tertiary)] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
              />
            </div>

            <div className="mt-2 space-y-2">
              {searchingReaders ? (
                <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-center text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
                  <i className="fa-solid fa-spinner mr-2 animate-spin" />
                  {t('authorBlockedReaders.searchingReaders')}
                </div>
              ) : readerQuery.trim().length >= 2 &&
                !readerResults.length ? (
                <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-center text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
                  {t('authorBlockedReaders.noReaders')}
                </div>
              ) : (
                readerResults.map(
                  (reader) => (
                    <ReaderResult
                      key={reader.id}
                      reader={reader}
                      selected={
                        selectedReader?.id ===
                        reader.id
                      }
                      onSelect={
                        setSelectedReader
                      }
                    />
                  )
                )
              )}
            </div>
          </section>

          <section>
            <div className="text-[12px] font-black text-[var(--shadow-text-primary)]">
              {t('authorBlockedReaders.blockScope')}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                {
                  value:
                    'all_author',
                  titleKey: 'allMyStories',
                  icon:
                    'fa-solid fa-layer-group',
                },
                {
                  value: 'story',
                  titleKey: 'oneStory',
                  icon:
                    'fa-regular fa-bookmark',
                },
              ].map((option) => {
                const active =
                  scopeType ===
                  option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setScopeType(
                        option.value
                      )

                      if (
                        option.value ===
                        'all_author'
                      ) {
                        setStoryId('')
                      }
                    }}
                    className={`rounded-[17px] border p-3 text-left transition active:scale-[0.99] ${
                      active
                        ? 'border-[#7555f6] bg-[var(--shadow-bg-soft)] ring-2 ring-[#7555f6]/10'
                        : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
                    }`}
                  >
                    <i
                      className={`${option.icon} text-[13px] ${
                        active
                          ? 'text-[#7555f6]'
                          : 'text-[var(--shadow-text-tertiary)]'
                      }`}
                    />

                    <div
                      className={`mt-2 text-[11.5px] font-extrabold ${
                        active
                          ? 'text-[#7047f5]'
                          : 'text-[var(--shadow-text-primary)]'
                      }`}
                    >
                      {t(`authorBlockedReaders.${option.titleKey}`)}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-2 h-12">
  {scopeType === 'story' ? (
    <div className="relative h-12">
      <select
        value={storyId}
        onChange={(event) =>
          setStoryId(
            event.target.value
          )
        }
        disabled={
          storiesLoading
        }
        className="h-12 w-full appearance-none rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-4 pr-10 text-[12px] font-bold text-[var(--shadow-text-primary)] outline-none transition focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10 disabled:opacity-55"
      >
        <option value="">
          {storiesLoading
            ? t('authorBlockedReaders.loadingStories')
            : stories.length
              ? t('authorBlockedReaders.chooseStory')
              : t('authorBlockedReaders.noStories')}
        </option>

        {stories.map(
          (story) => (
            <option
              key={story.id}
              value={story.id}
            >
              {story.title}
            </option>
          )
        )}
      </select>

      <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[var(--shadow-text-tertiary)]" />
    </div>
  ) : (
    <div
      className="h-12"
      aria-hidden="true"
    />
  )}
</div>
          </section>

          <section>
            <label className="text-[12px] font-black text-[var(--shadow-text-primary)]">
              {t('authorBlockedReaders.duration')}
            </label>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {DURATION_OPTIONS.map(
                (option) => {
                  const active =
                    duration ===
                    option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDuration(
                          option.value
                        )
                      }
                      className={`min-h-10 rounded-[14px] border px-2 text-[10.5px] font-extrabold transition active:scale-[0.98] ${
                        active
                          ? 'border-[#7555f6] bg-[#7555f6] text-white shadow-[0_7px_18px_rgba(117,85,246,0.22)]'
                          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]'
                      }`}
                    >
                      {t(`authorBlockedReaders.${option.labelKey}`)}
                    </button>
                  )
                }
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-black text-[var(--shadow-text-primary)]">
                {t('authorBlockedReaders.reason')}
              </label>

              <span className="text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                {reason.length}/300
              </span>
            </div>

            <textarea
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value.slice(
                    0,
                    300
                  )
                )
              }
              placeholder={t('authorBlockedReaders.reasonPlaceholder')}
              rows={3}
              className="mt-2 w-full resize-none rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] font-medium leading-5 text-[var(--shadow-text-primary)] outline-none transition placeholder:text-[var(--shadow-text-tertiary)] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
            />
          </section>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-gradient-to-r from-[#7047f5] to-[#855dff] text-[12.5px] font-black text-white shadow-[0_10px_24px_rgba(112,71,245,0.24)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:from-[#d6d1df] disabled:to-[#d6d1df] disabled:shadow-none"
          >
            <i
              className={`fa-solid ${
                saving
                  ? 'fa-spinner animate-spin'
                  : 'fa-user-slash'
              } text-[12px]`}
            />

            {t('authorBlockedReaders.blockReader')}
          </button>
        </div>
      </section>
    </div>
  )
}

export default function AuthorBlockedReadersPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const toastTimerRef =
    useRef(null)
  const searchTimerRef =
    useRef(null)
  const [status, setStatus] =
    useState('active')
  const [searchInput, setSearchInput] =
    useState('')
  const [search, setSearch] =
    useState('')
  const [page, setPage] =
    useState(1)
  const [loading, setLoading] =
    useState(true)
  const [blocks, setBlocks] =
    useState([])
  const [counts, setCounts] =
    useState({
      all: 0,
      active: 0,
      expired: 0,
    })
  const [total, setTotal] =
    useState(0)
  const [
    totalPages,
    setTotalPages,
  ] = useState(1)
  const [sheetOpen, setSheetOpen] =
    useState(false)
  const [deletingId, setDeletingId] =
    useState('')
  const [toast, setToast] =
    useState(null)

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
          t('authorBlockedReaders.loginAgain')
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
            t('authorBlockedReaders.requestFailed')
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
        }, 2400)
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

  const loadBlocks =
    useCallback(async () => {
      try {
        setLoading(true)

        const params =
          new URLSearchParams({
            status,
            search,
            page:
              String(page),
            limit: '10',
          })
        const data =
          await request(
            `${BLOCKED_READERS_PATH}?${params.toString()}`
          )

        setBlocks(
          Array.isArray(
            data.blocks
          )
            ? data.blocks
            : []
        )
        setCounts({
          all:
            Number(
              data.counts?.all || 0
            ),
          active:
            Number(
              data.counts?.active || 0
            ),
          expired:
            Number(
              data.counts?.expired || 0
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
          Number(data.page || 1) !==
          page
        ) {
          setPage(
            Number(data.page || 1)
          )
        }
      } catch (error) {
        showToast(
          error.message ||
            t('authorBlockedReaders.loadBlockedFailed'),
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
      status,
      t,
    ])

  useEffect(() => {
    loadBlocks()
  }, [loadBlocks])

  const handleUnblock =
    async (item) => {
      const approved =
        window.confirm(
          t('authorBlockedReaders.unblockConfirm', { name: item.reader?.name || item.reader?.username || t('authorBlockedReaders.thisReader') })
        )

      if (!approved) return

      try {
        setDeletingId(item.id)

        const data =
          await request(
            `${BLOCKED_READERS_PATH}/${encodeURIComponent(
              item.id
            )}`,
            {
              method: 'DELETE',
            }
          )

        showToast(
          data.message ||
            t('authorBlockedReaders.readerUnblocked')
        )
        await loadBlocks()
      } catch (error) {
        showToast(
          error.message ||
            t('authorBlockedReaders.unblockFailed'),
          'error'
        )
      } finally {
        setDeletingId('')
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
            aria-label={t('authorBlockedReaders.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
              {t('authorBlockedReaders.title')}
            </h1>

            <p className="mt-0.5 truncate text-[10.5px] font-medium text-[var(--shadow-text-secondary)]">
              {t('authorBlockedReaders.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSheetOpen(true)
            }
            className="flex h-10 w-10 items-center justify-end text-[#7047f5] transition active:scale-95 active:opacity-60"
            aria-label={t('authorBlockedReaders.blockReaderAria')}
          >
            <i className="fa-solid fa-user-plus text-[15px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
        <section className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map(
            (option) => {
              const active =
                status ===
                option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setStatus(
                      option.value
                    )
                    setPage(1)
                  }}
                  className={`rounded-[18px] border bg-[var(--shadow-bg-surface)] px-2 py-3 text-center shadow-[0_7px_20px_rgba(61,45,115,0.05)] transition active:scale-[0.98] ${
                    active
                      ? 'border-[#7555f6] ring-2 ring-[#7555f6]/10'
                      : 'border-[var(--shadow-border)]'
                  }`}
                >
                  <div
                    className={`text-[18px] font-black ${
                      active
                        ? 'text-[#7047f5]'
                        : 'text-[var(--shadow-text-primary)]'
                    }`}
                  >
                    {counts[
                      option.value
                    ] || 0}
                  </div>

                  <div className="mt-0.5 text-[9.5px] font-extrabold text-[var(--shadow-text-tertiary)]">
                    {t(`authorBlockedReaders.${option.labelKey}`)}
                  </div>
                </button>
              )
            }
          )}
        </section>

        <section className="mt-3 flex gap-2.5">
          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[var(--shadow-text-tertiary)]" />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder={t('authorBlockedReaders.searchBlocked')}
              className="h-12 w-full rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-10 pr-10 text-[12.5px] font-semibold text-[var(--shadow-text-primary)] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition placeholder:font-medium placeholder:text-[var(--shadow-text-tertiary)] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
            />

            {searchInput ? (
              <button
                type="button"
                onClick={() =>
                  setSearchInput('')
                }
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[var(--shadow-text-tertiary)] active:opacity-60"
                aria-label={t('authorBlockedReaders.clearSearch')}
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() =>
              setSheetOpen(true)
            }
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#7047f5] to-[#855dff] px-4 text-[11.5px] font-black text-white shadow-[0_9px_22px_rgba(112,71,245,0.22)] transition active:scale-[0.98]"
          >
            <i className="fa-solid fa-plus text-[11px]" />
            {t('authorBlockedReaders.block')}
          </button>
        </section>

        <section className="mt-4 flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">
              {STATUS_OPTIONS.find(
                (item) =>
                  item.value ===
                  status
              )?.labelKey
                ? t(`authorBlockedReaders.${STATUS_OPTIONS.find((item) => item.value === status)?.labelKey}`)
                : t('authorBlockedReaders.title')}
            </h2>

            <p className="mt-0.5 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
              {total}{' '}
              {total === 1
                ? t('authorBlockedReaders.record')
                : t('authorBlockedReaders.records')}
            </p>
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <LoadingCards />
          ) : blocks.length ? (
            <div className="space-y-3">
              {blocks.map((item) => (
                <BlockCard
                  key={item.id}
                  item={item}
                  deletingId={
                    deletingId
                  }
                  onUnblock={
                    handleUnblock
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] bg-[#f1ebff] text-[#7047f5]">
                <i className="fa-solid fa-user-shield text-[20px]" />
              </div>

              <h3 className="mt-3 text-[14px] font-black text-[var(--shadow-text-primary)]">
                {search
                  ? t('authorBlockedReaders.noMatching')
                  : status === 'active'
                    ? t('authorBlockedReaders.noActive')
                    : status === 'expired'
                      ? t('authorBlockedReaders.noExpired')
                      : t('authorBlockedReaders.noBlocked')}
              </h3>

              <p className="mx-auto mt-1.5 max-w-[290px] text-[11.5px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                {search
                  ? t('authorBlockedReaders.trySearch')
                  : t('authorBlockedReaders.emptyHelp')}
              </p>

              {!search &&
              status === 'active' ? (
                <button
                  type="button"
                  onClick={() =>
                    setSheetOpen(true)
                  }
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-[14px] bg-[#7555f6] px-4 text-[11.5px] font-black text-white shadow-[0_8px_20px_rgba(117,85,246,0.2)] transition active:scale-[0.98]"
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  {t('authorBlockedReaders.blockAReader')}
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
                setPage((current) =>
                  Math.max(
                    1,
                    current - 1
                  )
                )
              }
              disabled={page <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] shadow-sm active:scale-95 disabled:opacity-35"
              aria-label={t('authorBlockedReaders.previousPage')}
            >
              <i className="fa-solid fa-chevron-left text-[11px]" />
            </button>

            <div className="rounded-[14px] bg-gradient-to-r from-[#7047f5] to-[#855dff] px-4 py-2.5 text-[11.5px] font-black text-white shadow-[0_8px_20px_rgba(112,71,245,0.22)]">
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
              disabled={
                page >= totalPages
              }
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] shadow-sm active:scale-95 disabled:opacity-35"
              aria-label={t('authorBlockedReaders.nextPage')}
            >
              <i className="fa-solid fa-chevron-right text-[11px]" />
            </button>
          </nav>
        ) : null}
      </main>

      <BlockReaderSheet
        open={sheetOpen}
        onClose={() =>
          setSheetOpen(false)
        }
        request={request}
        onCreated={
          loadBlocks
        }
        showToast={
          showToast
        }
      />

      {toast ? (
        <div className="fixed bottom-[calc(18px+env(safe-area-inset-bottom))] left-1/2 z-[150] w-[calc(100%-28px)] max-w-md -translate-x-1/2">
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
              className="flex h-8 w-8 shrink-0 items-center justify-center active:opacity-60"
              aria-label={t('authorBlockedReaders.closeMessage')}
            >
              <i className="fa-solid fa-xmark text-[13px]" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

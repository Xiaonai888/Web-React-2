import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorCommentProtection', {
  "en": {
    "newestFirst": "Newest first",
    "oldestFirst": "Oldest first",
    "az": "A–Z",
    "za": "Z–A",
    "autoHideWords": "Auto-hide Words",
    "autoHideDescription": "Comments containing these words will be hidden and sent to review.",
    "addAutoHide": "Add an auto-hide word",
    "caseSame": "Capital letters are treated as the same word.",
    "autoHideLimit": "Auto-hide word limit reached",
    "searchAutoHide": "Search auto-hide words",
    "yourAutoHide": "Your auto-hide words",
    "autoHideListDescription": "Comments matching these words go to Hidden Comments.",
    "noAutoHide": "No auto-hide words yet",
    "noAutoHideDescription": "Add your first word above to start hiding matching comments for review.",
    "blockedWords": "Blocked Words",
    "blockedDescription": "Readers cannot post comments containing these words or phrases.",
    "addBlocked": "Add a blocked word",
    "blockedLimit": "Blocked word limit reached",
    "searchBlocked": "Search blocked words",
    "yourBlocked": "Your blocked words",
    "blockedListDescription": "Readers must remove these words before posting.",
    "noBlocked": "No blocked words yet",
    "noBlockedDescription": "Add your first word above to stop matching comments before they are posted.",
    "addedRecently": "Added recently",
    "addedAt": "Added {{date}} · {{time}}",
    "comingSoon": "Coming soon",
    "loginAgain": "Please login again.",
    "requestFailed": "Request failed",
    "loadFailed": "Failed to load word filters.",
    "addFailed": "Failed to add word filter.",
    "wordAdded": "“{{word}}” was added.",
    "duplicateMessage": "This word is already in {{list}}.",
    "removeConfirm": "Remove “{{word}}” from {{list}}?",
    "removed": "Word filter removed.",
    "removeFailed": "Failed to remove word filter.",
    "goBack": "Go back",
    "wordFilters": "Word Filters",
    "commentProtection": "Comment Protection",
    "authorCommentProtection": "Author Comment Protection",
    "intro": "Protect your story comments with word filters, hidden comment review, reader restrictions, and automatic cleanup.",
    "responsibility": "Responsibility",
    "responsibilityBody": "Your rules apply only to comments on your stories. Admin Block Words remain platform-wide for public areas.",
    "chooseWords": "Choose words to auto-hide for review or block before posting.",
    "hiddenComments": "Hidden Comments",
    "hiddenSubtitle": "Review comments hidden by your auto-hide words and rules.",
    "blockedReaders": "Blocked Readers",
    "blockedReadersSubtitle": "Block readers from commenting on all your stories or one specific story.",
    "moderationHistory": "Moderation History",
    "moderationSubtitle": "Review author comment moderation actions and system cleanup records.",
    "commentProtectionSmall": "Comment protection",
    "used": "Used",
    "caseInfo": "Words and phrases are matched without case sensitivity.",
    "typeWord": "Type a word or phrase",
    "clearWord": "Clear word",
    "adding": "Adding...",
    "add": "Add",
    "duplicateProtection": "Duplicate protection",
    "duplicateHelp": "We’ll warn you before adding the same word again.",
    "remaining": "{{count}} left",
    "clearSearch": "Clear search",
    "sort": "Sort {{list}}",
    "word": "word",
    "words": "words",
    "removeWord": "Remove {{word}}",
    "noMatchingWords": "No matching words found",
    "trySearch": "Try another search term or clear your search.",
    "closeMessage": "Close message"
  },
  "km": {
    "newestFirst": "ថ្មីបំផុតមុន",
    "oldestFirst": "ចាស់បំផុតមុន",
    "az": "A–Z",
    "za": "Z–A",
    "autoHideWords": "ពាក្យលាក់ស្វ័យប្រវត្តិ",
    "autoHideDescription": "មតិយោបល់ដែលមានពាក្យទាំងនេះនឹងត្រូវលាក់ ហើយផ្ញើទៅពិនិត្យ។",
    "addAutoHide": "បន្ថែមពាក្យលាក់ស្វ័យប្រវត្តិ",
    "caseSame": "អក្សរធំ និងអក្សរតូច ត្រូវបានចាត់ទុកជាពាក្យដូចគ្នា។",
    "autoHideLimit": "បានដល់កំណត់ពាក្យលាក់ស្វ័យប្រវត្តិ",
    "searchAutoHide": "ស្វែងរកពាក្យលាក់ស្វ័យប្រវត្តិ",
    "yourAutoHide": "ពាក្យលាក់ស្វ័យប្រវត្តិរបស់អ្នក",
    "autoHideListDescription": "មតិយោបល់ដែលត្រូវនឹងពាក្យទាំងនេះ នឹងទៅកាន់មតិយោបល់ដែលបានលាក់។",
    "noAutoHide": "មិនទាន់មានពាក្យលាក់ស្វ័យប្រវត្តិ",
    "noAutoHideDescription": "បន្ថែមពាក្យដំបូងខាងលើ ដើម្បីចាប់ផ្តើមលាក់មតិយោបល់ដែលត្រូវគ្នាសម្រាប់ពិនិត្យ។",
    "blockedWords": "ពាក្យដែលបានទប់ស្កាត់",
    "blockedDescription": "អ្នកអានមិនអាចបង្ហោះមតិយោបល់ដែលមានពាក្យ ឬឃ្លាទាំងនេះបានទេ។",
    "addBlocked": "បន្ថែមពាក្យទប់ស្កាត់",
    "blockedLimit": "បានដល់កំណត់ពាក្យទប់ស្កាត់",
    "searchBlocked": "ស្វែងរកពាក្យទប់ស្កាត់",
    "yourBlocked": "ពាក្យទប់ស្កាត់របស់អ្នក",
    "blockedListDescription": "អ្នកអានត្រូវលុបពាក្យទាំងនេះមុនពេលបង្ហោះ។",
    "noBlocked": "មិនទាន់មានពាក្យទប់ស្កាត់",
    "noBlockedDescription": "បន្ថែមពាក្យដំបូងខាងលើ ដើម្បីបញ្ឈប់មតិយោបល់ដែលត្រូវគ្នាមុនពេលបង្ហោះ។",
    "addedRecently": "បានបន្ថែមថ្មីៗនេះ",
    "addedAt": "បានបន្ថែម {{date}} · {{time}}",
    "comingSoon": "នឹងមកដល់ឆាប់ៗ",
    "loginAgain": "សូមចូលគណនីម្តងទៀត។",
    "requestFailed": "សំណើបានបរាជ័យ",
    "loadFailed": "មិនអាចផ្ទុកពាក្យតម្រងបានទេ។",
    "addFailed": "មិនអាចបន្ថែមពាក្យតម្រងបានទេ។",
    "wordAdded": "បានបន្ថែម “{{word}}”។",
    "duplicateMessage": "ពាក្យនេះមានរួចហើយក្នុង {{list}}។",
    "removeConfirm": "លុប “{{word}}” ចេញពី {{list}}?",
    "removed": "បានលុបពាក្យតម្រង។",
    "removeFailed": "មិនអាចលុបពាក្យតម្រងបានទេ។",
    "goBack": "ត្រឡប់ក្រោយ",
    "wordFilters": "តម្រងពាក្យ",
    "commentProtection": "ការការពារមតិយោបល់",
    "authorCommentProtection": "ការការពារមតិយោបល់អ្នកនិពន្ធ",
    "intro": "ការពារមតិយោបល់លើរឿងរបស់អ្នកដោយតម្រងពាក្យ ការពិនិត្យមតិយោបល់ដែលបានលាក់ ការកំណត់អ្នកអាន និងការសម្អាតស្វ័យប្រវត្តិ។",
    "responsibility": "វិសាលភាព",
    "responsibilityBody": "ច្បាប់របស់អ្នកអនុវត្តតែលើមតិយោបល់ក្នុងរឿងរបស់អ្នក។ Admin Block Words នៅតែអនុវត្តទូទាំងវេទិកាសម្រាប់តំបន់សាធារណៈ។",
    "chooseWords": "ជ្រើសពាក្យដើម្បីលាក់ស្វ័យប្រវត្តិសម្រាប់ពិនិត្យ ឬទប់ស្កាត់មុនពេលបង្ហោះ។",
    "hiddenComments": "មតិយោបល់ដែលបានលាក់",
    "hiddenSubtitle": "ពិនិត្យមតិយោបល់ដែលត្រូវបានលាក់ដោយពាក្យ និងច្បាប់របស់អ្នក។",
    "blockedReaders": "អ្នកអានដែលបានទប់ស្កាត់",
    "blockedReadersSubtitle": "ទប់ស្កាត់អ្នកអានមិនឱ្យបញ្ចេញមតិលើរឿងទាំងអស់ ឬរឿងជាក់លាក់មួយ។",
    "moderationHistory": "ប្រវត្តិការគ្រប់គ្រង",
    "moderationSubtitle": "ពិនិត្យសកម្មភាពគ្រប់គ្រងមតិយោបល់ និងកំណត់ត្រាសម្អាតស្វ័យប្រវត្តិ។",
    "commentProtectionSmall": "ការការពារមតិយោបល់",
    "used": "បានប្រើ",
    "caseInfo": "ការផ្គូផ្គងពាក្យមិនប្រកាន់អក្សរធំ ឬតូចទេ។",
    "typeWord": "វាយពាក្យ ឬឃ្លា",
    "clearWord": "លុបពាក្យ",
    "adding": "កំពុងបន្ថែម...",
    "add": "បន្ថែម",
    "duplicateProtection": "ការពារពាក្យស្ទួន",
    "duplicateHelp": "យើងនឹងជូនដំណឹងមុនពេលអ្នកបន្ថែមពាក្យដដែលម្តងទៀត។",
    "remaining": "នៅសល់ {{count}}",
    "clearSearch": "សម្អាតការស្វែងរក",
    "sort": "តម្រៀប {{list}}",
    "word": "ពាក្យ",
    "words": "ពាក្យ",
    "removeWord": "លុប {{word}}",
    "noMatchingWords": "រកមិនឃើញពាក្យដែលត្រូវគ្នា",
    "trySearch": "សាកពាក្យស្វែងរកផ្សេង ឬសម្អាតការស្វែងរក។",
    "closeMessage": "បិទសារ"
  },
  "zh": {
    "newestFirst": "最新优先",
    "oldestFirst": "最旧优先",
    "az": "A–Z",
    "za": "Z–A",
    "autoHideWords": "自动隐藏词",
    "autoHideDescription": "包含这些词的评论将被隐藏并送去审核。",
    "addAutoHide": "添加自动隐藏词",
    "caseSame": "大小写字母视为同一个词。",
    "autoHideLimit": "已达到自动隐藏词上限",
    "searchAutoHide": "搜索自动隐藏词",
    "yourAutoHide": "你的自动隐藏词",
    "autoHideListDescription": "匹配这些词的评论会进入隐藏评论。",
    "noAutoHide": "暂无自动隐藏词",
    "noAutoHideDescription": "在上方添加第一个词，开始隐藏匹配评论以供审核。",
    "blockedWords": "屏蔽词",
    "blockedDescription": "读者无法发布包含这些词或短语的评论。",
    "addBlocked": "添加屏蔽词",
    "blockedLimit": "已达到屏蔽词上限",
    "searchBlocked": "搜索屏蔽词",
    "yourBlocked": "你的屏蔽词",
    "blockedListDescription": "读者发布前必须移除这些词。",
    "noBlocked": "暂无屏蔽词",
    "noBlockedDescription": "在上方添加第一个词，阻止匹配评论发布。",
    "addedRecently": "最近添加",
    "addedAt": "添加于 {{date}} · {{time}}",
    "comingSoon": "即将推出",
    "loginAgain": "请重新登录。",
    "requestFailed": "请求失败",
    "loadFailed": "无法加载词语过滤器。",
    "addFailed": "无法添加词语过滤器。",
    "wordAdded": "已添加“{{word}}”。",
    "duplicateMessage": "该词已存在于{{list}}中。",
    "removeConfirm": "从{{list}}中移除“{{word}}”？",
    "removed": "词语过滤器已移除。",
    "removeFailed": "无法移除词语过滤器。",
    "goBack": "返回",
    "wordFilters": "词语过滤器",
    "commentProtection": "评论保护",
    "authorCommentProtection": "作者评论保护",
    "intro": "通过词语过滤、隐藏评论审核、读者限制和自动清理来保护你的故事评论。",
    "responsibility": "适用范围",
    "responsibilityBody": "你的规则仅适用于自己故事的评论。管理员屏蔽词仍适用于平台公共区域。",
    "chooseWords": "选择要自动隐藏审核或在发布前屏蔽的词。",
    "hiddenComments": "隐藏评论",
    "hiddenSubtitle": "审核被你的自动隐藏词和规则隐藏的评论。",
    "blockedReaders": "已屏蔽读者",
    "blockedReadersSubtitle": "阻止读者在你的全部故事或某个指定故事下评论。",
    "moderationHistory": "管理历史",
    "moderationSubtitle": "查看作者评论管理操作和系统清理记录。",
    "commentProtectionSmall": "评论保护",
    "used": "已使用",
    "caseInfo": "词语和短语匹配不区分大小写。",
    "typeWord": "输入词或短语",
    "clearWord": "清除词语",
    "adding": "正在添加...",
    "add": "添加",
    "duplicateProtection": "重复保护",
    "duplicateHelp": "再次添加同一个词前会提醒你。",
    "remaining": "剩余 {{count}}",
    "clearSearch": "清除搜索",
    "sort": "排序 {{list}}",
    "word": "个词",
    "words": "个词",
    "removeWord": "移除 {{word}}",
    "noMatchingWords": "未找到匹配词",
    "trySearch": "尝试其他搜索词或清除搜索。",
    "closeMessage": "关闭消息"
  },
  "ja": {
    "newestFirst": "新しい順",
    "oldestFirst": "古い順",
    "az": "A–Z",
    "za": "Z–A",
    "autoHideWords": "自動非表示ワード",
    "autoHideDescription": "これらの語を含むコメントは非表示になり、確認待ちになります。",
    "addAutoHide": "自動非表示ワードを追加",
    "caseSame": "大文字と小文字は同じ語として扱われます。",
    "autoHideLimit": "自動非表示ワードの上限に達しました",
    "searchAutoHide": "自動非表示ワードを検索",
    "yourAutoHide": "自動非表示ワード",
    "autoHideListDescription": "一致したコメントは非表示コメントに送られます。",
    "noAutoHide": "自動非表示ワードはまだありません",
    "noAutoHideDescription": "上で最初の語を追加し、一致するコメントを確認用に非表示にします。",
    "blockedWords": "ブロックワード",
    "blockedDescription": "読者はこれらの語やフレーズを含むコメントを投稿できません。",
    "addBlocked": "ブロックワードを追加",
    "blockedLimit": "ブロックワードの上限に達しました",
    "searchBlocked": "ブロックワードを検索",
    "yourBlocked": "ブロックワード",
    "blockedListDescription": "読者は投稿前にこれらの語を削除する必要があります。",
    "noBlocked": "ブロックワードはまだありません",
    "noBlockedDescription": "上で最初の語を追加し、一致するコメントの投稿を防ぎます。",
    "addedRecently": "最近追加",
    "addedAt": "{{date}} · {{time}} に追加",
    "comingSoon": "近日公開",
    "loginAgain": "もう一度ログインしてください。",
    "requestFailed": "リクエストに失敗しました",
    "loadFailed": "ワードフィルターを読み込めませんでした。",
    "addFailed": "ワードフィルターを追加できませんでした。",
    "wordAdded": "「{{word}}」を追加しました。",
    "duplicateMessage": "この語はすでに {{list}} にあります。",
    "removeConfirm": "{{list}} から「{{word}}」を削除しますか？",
    "removed": "ワードフィルターを削除しました。",
    "removeFailed": "ワードフィルターを削除できませんでした。",
    "goBack": "戻る",
    "wordFilters": "ワードフィルター",
    "commentProtection": "コメント保護",
    "authorCommentProtection": "作者コメント保護",
    "intro": "ワードフィルター、非表示コメント確認、読者制限、自動クリーンアップでストーリーのコメントを保護します。",
    "responsibility": "適用範囲",
    "responsibilityBody": "あなたのルールは自分のストーリーのコメントだけに適用されます。管理者のブロックワードは公開エリア全体に適用されます。",
    "chooseWords": "確認用に自動非表示にする語、または投稿前にブロックする語を選びます。",
    "hiddenComments": "非表示コメント",
    "hiddenSubtitle": "自動非表示ワードとルールで隠されたコメントを確認します。",
    "blockedReaders": "ブロックした読者",
    "blockedReadersSubtitle": "すべてのストーリーまたは特定のストーリーへのコメントをブロックします。",
    "moderationHistory": "モデレーション履歴",
    "moderationSubtitle": "作者のコメント管理操作とシステムのクリーンアップ記録を確認します。",
    "commentProtectionSmall": "コメント保護",
    "used": "使用済み",
    "caseInfo": "ワードやフレーズの一致では大文字・小文字を区別しません。",
    "typeWord": "語またはフレーズを入力",
    "clearWord": "入力を消去",
    "adding": "追加中...",
    "add": "追加",
    "duplicateProtection": "重複保護",
    "duplicateHelp": "同じ語を再度追加する前に警告します。",
    "remaining": "残り {{count}}",
    "clearSearch": "検索を消去",
    "sort": "{{list}} を並べ替え",
    "word": "語",
    "words": "語",
    "removeWord": "{{word}} を削除",
    "noMatchingWords": "一致する語がありません",
    "trySearch": "別の検索語を試すか、検索を消去してください。",
    "closeMessage": "メッセージを閉じる"
  },
  "ko": {
    "newestFirst": "최신순",
    "oldestFirst": "오래된순",
    "az": "A–Z",
    "za": "Z–A",
    "autoHideWords": "자동 숨김 단어",
    "autoHideDescription": "이 단어가 포함된 댓글은 숨겨지고 검토로 전송됩니다.",
    "addAutoHide": "자동 숨김 단어 추가",
    "caseSame": "대문자와 소문자는 같은 단어로 처리됩니다.",
    "autoHideLimit": "자동 숨김 단어 한도에 도달했습니다",
    "searchAutoHide": "자동 숨김 단어 검색",
    "yourAutoHide": "내 자동 숨김 단어",
    "autoHideListDescription": "일치하는 댓글은 숨긴 댓글로 이동합니다.",
    "noAutoHide": "자동 숨김 단어가 없습니다",
    "noAutoHideDescription": "위에서 첫 단어를 추가해 일치하는 댓글을 검토용으로 숨기세요.",
    "blockedWords": "차단 단어",
    "blockedDescription": "독자는 이 단어나 문구가 포함된 댓글을 게시할 수 없습니다.",
    "addBlocked": "차단 단어 추가",
    "blockedLimit": "차단 단어 한도에 도달했습니다",
    "searchBlocked": "차단 단어 검색",
    "yourBlocked": "내 차단 단어",
    "blockedListDescription": "독자는 게시 전에 이 단어를 제거해야 합니다.",
    "noBlocked": "차단 단어가 없습니다",
    "noBlockedDescription": "위에서 첫 단어를 추가해 일치하는 댓글의 게시를 막으세요.",
    "addedRecently": "최근 추가됨",
    "addedAt": "{{date}} · {{time}} 추가",
    "comingSoon": "곧 제공",
    "loginAgain": "다시 로그인해 주세요.",
    "requestFailed": "요청에 실패했습니다",
    "loadFailed": "단어 필터를 불러오지 못했습니다.",
    "addFailed": "단어 필터를 추가하지 못했습니다.",
    "wordAdded": "“{{word}}”을(를) 추가했습니다.",
    "duplicateMessage": "이 단어는 이미 {{list}}에 있습니다.",
    "removeConfirm": "{{list}}에서 “{{word}}”을(를) 삭제할까요?",
    "removed": "단어 필터를 삭제했습니다.",
    "removeFailed": "단어 필터를 삭제하지 못했습니다.",
    "goBack": "뒤로",
    "wordFilters": "단어 필터",
    "commentProtection": "댓글 보호",
    "authorCommentProtection": "작가 댓글 보호",
    "intro": "단어 필터, 숨긴 댓글 검토, 독자 제한, 자동 정리로 스토리 댓글을 보호하세요.",
    "responsibility": "적용 범위",
    "responsibilityBody": "내 규칙은 내 스토리 댓글에만 적용됩니다. 관리자 차단 단어는 공개 영역 전체에 계속 적용됩니다.",
    "chooseWords": "검토를 위해 자동으로 숨기거나 게시 전에 차단할 단어를 선택하세요.",
    "hiddenComments": "숨긴 댓글",
    "hiddenSubtitle": "자동 숨김 단어와 규칙으로 숨겨진 댓글을 검토합니다.",
    "blockedReaders": "차단한 독자",
    "blockedReadersSubtitle": "모든 스토리 또는 특정 스토리에 댓글을 달지 못하도록 독자를 차단합니다.",
    "moderationHistory": "관리 기록",
    "moderationSubtitle": "작가 댓글 관리 작업과 시스템 정리 기록을 확인합니다.",
    "commentProtectionSmall": "댓글 보호",
    "used": "사용됨",
    "caseInfo": "단어와 문구는 대소문자를 구분하지 않고 일치합니다.",
    "typeWord": "단어 또는 문구 입력",
    "clearWord": "단어 지우기",
    "adding": "추가 중...",
    "add": "추가",
    "duplicateProtection": "중복 보호",
    "duplicateHelp": "같은 단어를 다시 추가하기 전에 알려드립니다.",
    "remaining": "{{count}}개 남음",
    "clearSearch": "검색 지우기",
    "sort": "{{list}} 정렬",
    "word": "개 단어",
    "words": "개 단어",
    "removeWord": "{{word}} 삭제",
    "noMatchingWords": "일치하는 단어가 없습니다",
    "trySearch": "다른 검색어를 시도하거나 검색을 지우세요.",
    "closeMessage": "메시지 닫기"
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const WORD_FILTERS_PATH =
  '/api/authors/me/comment-protection/blocked-words'

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'newestFirst' },
  { value: 'oldest', labelKey: 'oldestFirst' },
  { value: 'az', labelKey: 'az' },
  { value: 'za', labelKey: 'za' },
]

const FILTER_COPY = {
  auto_hide: {
    tabLabelKey: 'autoHideWords',
    heroTitleKey: 'autoHideWords',
    heroDescriptionKey: 'autoHideDescription',
    addTitleKey: 'addAutoHide',
    addDescriptionKey: 'caseSame',
    limitPlaceholderKey: 'autoHideLimit',
    searchPlaceholderKey: 'searchAutoHide',
    listTitleKey: 'yourAutoHide',
    listDescriptionKey: 'autoHideListDescription',
    emptyTitleKey: 'noAutoHide',
    emptyDescriptionKey: 'noAutoHideDescription',
    icon: 'fa-regular fa-eye-slash',
  },
  block: {
    tabLabelKey: 'blockedWords',
    heroTitleKey: 'blockedWords',
    heroDescriptionKey: 'blockedDescription',
    addTitleKey: 'addBlocked',
    addDescriptionKey: 'caseSame',
    limitPlaceholderKey: 'blockedLimit',
    searchPlaceholderKey: 'searchBlocked',
    listTitleKey: 'yourBlocked',
    listDescriptionKey: 'blockedListDescription',
    emptyTitleKey: 'noBlocked',
    emptyDescriptionKey: 'noBlockedDescription',
    icon: 'fa-solid fa-ban',
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

function normalizeWord(value) {
  return String(value || '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function formatAddedDate(value) {
  const date = new Date(value || '')

  if (Number.isNaN(date.getTime())) {
    return getDisplayText('authorCommentProtection.addedRecently')
  }

  const locale = getDisplayLanguageId()
  const dateText = date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timeText = date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  })

  return getDisplayText('authorCommentProtection.addedAt', {
    date: dateText,
    time: timeText,
  })
}

function SettingCard({
  icon,
  title,
  subtitle,
  status = null,
  available = false,
  onClick,
}) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i
          className={`${icon} text-[15px]`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14.5px] font-extrabold text-[var(--shadow-text-primary)]">
            {title}
          </h3>

          {status ? (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.04em] ${
                available
                  ? 'bg-[#ecfdf3] text-[#16803c]'
                  : 'bg-[#fff7ed] text-[#f97316]'
              }`}
            >
              {status}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 text-[12.5px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
          {subtitle}
        </p>
      </div>

      {onClick ? (
        <i className="fa-solid fa-chevron-right mt-4 shrink-0 text-[11px] text-[var(--shadow-text-disabled)]" />
      ) : null}
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-left shadow-sm transition active:scale-[0.99]"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
      {content}
    </div>
  )
}

function LoadingWords() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-4 py-4 last:border-b-0"
        >
          <div className="h-11 w-11 animate-pulse rounded-[15px] bg-[var(--shadow-bg-soft)]" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-28 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-[14px] bg-[#fff1f3]" />
        </div>
      ))}
    </div>
  )
}

function ProtectionIcon({
  filterType,
}) {
  const icon =
    FILTER_COPY[filterType].icon

  return (
    <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#f4efff] to-[#ebe5ff] shadow-[0_12px_28px_rgba(109,74,255,0.16)] ring-1 ring-[#ded5ff]">
      <i
        className={`${icon} text-[31px] text-[#7555f6]`}
      />

      <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[#7555f6] shadow-md">
        <i className="fa-solid fa-comment-dots text-[10px]" />
      </div>
    </div>
  )
}

function WordFilterTabs({
  value,
  onChange,
}) {
  const { t } = useDisplayTranslation()
  return (
    <div className="mt-3 grid grid-cols-2 gap-1 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] p-1.5">
      {[
        'auto_hide',
        'block',
      ].map((type) => {
        const active =
          value === type

        return (
          <button
            key={type}
            type="button"
            onClick={() =>
              onChange(type)
            }
            className={`min-h-11 rounded-[14px] px-3 text-[12px] font-extrabold transition active:scale-[0.98] ${
              active
                ? 'bg-[var(--shadow-bg-surface)] text-[#7047f5] shadow-[0_5px_16px_rgba(61,45,115,0.10)] ring-1 ring-[#e5dcff]'
                : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            {t(`authorCommentProtection.${FILTER_COPY[type].tabLabelKey}`)}
          </button>
        )
      })}
    </div>
  )
}

export default function AuthorCommentProtectionPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()
  const toastTimerRef =
    useRef(null)
  const isWordFilters =
    searchParams.get('view') ===
    'word-filters'
  const filterType =
    searchParams.get('type') ===
    'block'
      ? 'block'
      : 'auto_hide'
  const copy =
    FILTER_COPY[filterType]

  const [words, setWords] =
    useState([])
  const [limit, setLimit] =
    useState(200)
  const [
    wordInput,
    setWordInput,
  ] = useState('')
  const [search, setSearch] =
    useState('')
  const [sort, setSort] =
    useState('newest')
  const [loading, setLoading] =
    useState(false)
  const [saving, setSaving] =
    useState(false)
  const [
    deletingId,
    setDeletingId,
  ] = useState('')
  const [
    inputError,
    setInputError,
  ] = useState('')
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
          t('authorCommentProtection.loginAgain')
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
            t('authorCommentProtection.requestFailed')
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
        }, 2200)
    },
    []
  )

  useEffect(() => {
    return () => {
      window.clearTimeout(
        toastTimerRef.current
      )
    }
  }, [])

  const loadWords =
    useCallback(async () => {
      try {
        setLoading(true)

        const params =
          new URLSearchParams({
            filter_type:
              filterType,
          })
        const data =
          await request(
            `${WORD_FILTERS_PATH}?${params.toString()}`
          )

        setWords(
          Array.isArray(data.words)
            ? data.words
            : []
        )
        setLimit(
          Math.max(
            1,
            Number(
              data.limit || 200
            )
          )
        )
      } catch (error) {
        showToast(
          error.message ||
            t('authorCommentProtection.loadFailed'),
          'error'
        )
      } finally {
        setLoading(false)
      }
    }, [
      filterType,
      request,
      showToast,
      t,
    ])

  useEffect(() => {
    if (isWordFilters) {
      loadWords()
    }
  }, [
    isWordFilters,
    loadWords,
  ])

  const remaining = Math.max(
    0,
    limit - words.length
  )
  const normalizedInput =
    normalizeWord(wordInput)
  const duplicateWord =
    useMemo(
      () =>
        words.find(
          (item) =>
            normalizeWord(
              item.word
            ) ===
            normalizedInput
        ) || null,
      [
        normalizedInput,
        words,
      ]
    )
  const isDuplicate =
    Boolean(
      normalizedInput &&
      duplicateWord
    )
  const canAdd =
    Boolean(normalizedInput) &&
    !isDuplicate &&
    !saving &&
    words.length < limit

  const filteredWords =
    useMemo(() => {
      const keyword =
        normalizeWord(search)
      const filtered =
        keyword
          ? words.filter(
              (item) =>
                normalizeWord(
                  item.word
                ).includes(
                  keyword
                )
            )
          : [...words]

      return filtered.sort(
        (first, second) => {
          if (sort === 'az') {
            return String(
              first.word || ''
            ).localeCompare(
              String(
                second.word || ''
              ),
              undefined,
              {
                sensitivity:
                  'base',
              }
            )
          }

          if (sort === 'za') {
            return String(
              second.word || ''
            ).localeCompare(
              String(
                first.word || ''
              ),
              undefined,
              {
                sensitivity:
                  'base',
              }
            )
          }

          const firstTime =
            new Date(
              first.created_at || 0
            ).getTime() || 0
          const secondTime =
            new Date(
              second.created_at || 0
            ).getTime() || 0

          return sort === 'oldest'
            ? firstTime -
                secondTime
            : secondTime -
                firstTime
        }
      )
    }, [
      search,
      sort,
      words,
    ])

  const openWordFilters = (
    type = 'auto_hide'
  ) => {
    setSearchParams({
      view: 'word-filters',
      type,
    })
  }

  const handleBack = () => {
    if (isWordFilters) {
      setSearchParams({})
      setWords([])
      setWordInput('')
      setSearch('')
      setInputError('')
      setToast(null)
      return
    }

    navigate('/author/profile', {
      replace: true,
    })
  }

  const handleFilterTypeChange = (
    nextType
  ) => {
    if (
      nextType === filterType
    ) {
      return
    }

    setWords([])
    setWordInput('')
    setSearch('')
    setInputError('')
    setDeletingId('')
    setSearchParams({
      view: 'word-filters',
      type: nextType,
    })
  }

  const handleInputChange = (
    event
  ) => {
    setWordInput(
      event.target.value
    )
    setInputError('')
  }

  const handleAddWord = async (
    event
  ) => {
    event.preventDefault()

    if (isDuplicate) {
      setInputError(
        t('authorCommentProtection.duplicateMessage', { list: t(`authorCommentProtection.${copy.tabLabelKey}`) })
      )
      return
    }

    if (!canAdd) return

    try {
      setSaving(true)
      setInputError('')

      const cleanInput =
        wordInput
          .normalize('NFC')
          .trim()
          .replace(/\s+/g, ' ')
      const data =
        await request(
          WORD_FILTERS_PATH,
          {
            method: 'POST',
            body:
              JSON.stringify({
                word: cleanInput,
                filter_type:
                  filterType,
              }),
          }
        )

      setWords((current) => [
        data.word,
        ...current,
      ])
      setWordInput('')
      showToast(
        data.message ||
          t('authorCommentProtection.wordAdded', { word: data.word?.word || cleanInput })
      )
    } catch (error) {
      const errorMessage =
        error.message ||
        t('authorCommentProtection.addFailed')

      if (
        errorMessage
          .toLowerCase()
          .includes(
            'already exists'
          )
      ) {
        setInputError(
          errorMessage
        )
      } else {
        setInputError(
          errorMessage
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteWord =
    async (item) => {
      const approved =
        window.confirm(
          t('authorCommentProtection.removeConfirm', { word: item.word, list: t(`authorCommentProtection.${copy.tabLabelKey}`) })
        )

      if (!approved) return

      try {
        setDeletingId(
          String(item.id)
        )

        const data =
          await request(
            `${WORD_FILTERS_PATH}/${encodeURIComponent(
              item.id
            )}`,
            {
              method: 'DELETE',
            }
          )

        setWords((current) =>
          current.filter(
            (word) =>
              String(word.id) !==
              String(item.id)
          )
        )
        showToast(
          data.message ||
            t('authorCommentProtection.removed')
        )
      } catch (error) {
        showToast(
          error.message ||
            t('authorCommentProtection.removeFailed'),
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
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-start text-[var(--shadow-text-primary)] transition active:scale-95 active:opacity-60"
            aria-label={t('authorCommentProtection.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
            {isWordFilters
              ? t('authorCommentProtection.wordFilters')
              : t('authorCommentProtection.commentProtection')}
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {!isWordFilters ? (
        <main className="mx-auto max-w-4xl px-4 pt-4">
          <section className="rounded-[26px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#111827] text-white">
              <i className="fa-solid fa-shield-halved text-[20px]" />
            </div>

            <h2 className="mt-4 text-[22px] font-black text-[var(--shadow-text-primary)]">
              {t('authorCommentProtection.authorCommentProtection')}
            </h2>

            <p className="mt-2 text-[13.5px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
              {t('authorCommentProtection.intro')}
            </p>

            <div className="mt-4 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
              <div className="text-[12px] font-black uppercase tracking-[0.04em] text-[var(--shadow-text-secondary)]">
                {t('authorCommentProtection.responsibility')}
              </div>

              <p className="mt-2 text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
                {t('authorCommentProtection.responsibilityBody')}
              </p>
            </div>
          </section>

          <section className="mt-4 grid gap-3">
            <SettingCard
              icon="fa-solid fa-filter"
              title={t('authorCommentProtection.wordFilters')}
              subtitle={t('authorCommentProtection.chooseWords')}
              status={null}
              onClick={() =>
                openWordFilters(
                  'auto_hide'
                )
              }
            />

            <SettingCard
              icon="fa-regular fa-eye-slash"
              title={t('authorCommentProtection.hiddenComments')}
              subtitle={t('authorCommentProtection.hiddenSubtitle')}
              status={null}
              onClick={() =>
                navigate(
                  '/author/comment-protection/hidden-comments'
                )
              }
            />

                       <SettingCard
  icon="fa-solid fa-user-slash"
  title={t('authorCommentProtection.blockedReaders')}
  subtitle={t('authorCommentProtection.blockedReadersSubtitle')}
  status={null}
  onClick={() =>
    navigate(
      '/author/comment-protection/blocked-readers'
    )
  }
/>

            <SettingCard
  icon="fa-solid fa-clock-rotate-left"
  title={t('authorCommentProtection.moderationHistory')}
  subtitle={t('authorCommentProtection.moderationSubtitle')}
  status={null}
  onClick={() =>
    navigate(
      '/author/comment-protection/moderation-history'
    )
  }
/>
          </section>
        </main>
      ) : (
        <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
          <section className="overflow-hidden rounded-[28px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_14px_38px_rgba(61,45,115,0.08)]">
            <div className="relative bg-[var(--shadow-bg-elevated)] p-5">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#d9ccff]/20 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <ProtectionIcon
                  filterType={
                    filterType
                  }
                />

                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-black uppercase tracking-[0.09em] text-[#7050ed]">
                    {t('authorCommentProtection.commentProtectionSmall')}
                  </div>

                  <h2 className="mt-1 text-[22px] font-black tracking-[-0.02em] text-[var(--shadow-text-primary)]">
                    {t(`authorCommentProtection.${copy.heroTitleKey}`)}
                  </h2>

                  <p className="mt-2 max-w-[440px] text-[12.5px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                    {t(`authorCommentProtection.${copy.heroDescriptionKey}`)}
                  </p>
                </div>

                <div className="shrink-0 rounded-[20px] bg-[var(--shadow-bg-elevated)] px-3.5 py-3 text-center shadow-[0_8px_24px_rgba(85,62,160,0.08)] ring-1 ring-white">
                  <div className="whitespace-nowrap text-[19px] font-black text-[#7050ed]">
                    {words.length}
                    <span className="ml-1 text-[13px] font-bold text-[var(--shadow-text-secondary)]">
                      / {limit}
                    </span>
                  </div>

                  <div className="mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">
                    {t('authorCommentProtection.used')}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <WordFilterTabs
            value={filterType}
            onChange={
              handleFilterTypeChange
            }
          />

          <form
            onSubmit={handleAddWord}
            className="mt-3.5 rounded-[28px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_12px_34px_rgba(61,45,115,0.07)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <label
                  htmlFor={`author-word-filter-${filterType}`}
                  className="text-[16px] font-black text-[var(--shadow-text-primary)]"
                >
                  {t(`authorCommentProtection.${copy.addTitleKey}`)}
                </label>

                <p className="mt-1 text-[11.5px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                  {t(`authorCommentProtection.${copy.addDescriptionKey}`)}
                </p>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]"
                title={t('authorCommentProtection.caseInfo')}
              >
                <i className="fa-solid fa-circle-info text-[13px]" />
              </div>
            </div>

            <div className="mt-3 flex gap-2.5">
              <div className="relative min-w-0 flex-1">
                <input
                  id={`author-word-filter-${filterType}`}
                  value={wordInput}
                  onChange={
                    handleInputChange
                  }
                  maxLength={120}
                  disabled={
                    saving ||
                    words.length >=
                      limit
                  }
                  placeholder={
                    words.length >=
                    limit
                      ? t(`authorCommentProtection.${copy.limitPlaceholderKey}`)
                      : t('authorCommentProtection.typeWord')
                  }
                  className={`h-12 w-full rounded-[17px] border bg-[var(--shadow-input-bg)] px-4 pr-10 text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none transition placeholder:font-medium placeholder:text-[var(--shadow-text-tertiary)] focus:bg-[var(--shadow-input-bg)] focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isDuplicate ||
                    inputError
                      ? 'border-[#ef626f] focus:border-[#ef626f] focus:ring-[#ef626f]/10'
                      : 'border-[var(--shadow-border)] focus:border-[#7555f6] focus:ring-[#7555f6]/10'
                  }`}
                />

                {wordInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWordInput('')
                      setInputError('')
                    }}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] active:bg-[var(--shadow-bg-hover)]"
                    aria-label={t('authorCommentProtection.clearWord')}
                  >
                    <i className="fa-solid fa-circle-xmark text-[14px]" />
                  </button>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={!canAdd}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[17px] bg-gradient-to-r from-[#7047f5] to-[#8459ff] px-5 text-[13px] font-extrabold text-white shadow-[0_10px_24px_rgba(112,71,245,0.24)] transition active:scale-95 disabled:cursor-not-allowed disabled:from-[#d0d1da] disabled:to-[#c9cad4] disabled:shadow-none"
              >
                {saving ? (
                  <i className="fa-solid fa-spinner animate-spin text-[12px]" />
                ) : null}

                {saving
                  ? t('authorCommentProtection.adding')
                  : t('authorCommentProtection.add')}
              </button>
            </div>

            {isDuplicate ||
            inputError ? (
              <div className="mt-2.5 flex items-start gap-2 rounded-[14px] bg-[#fff3f4] px-3 py-2.5 text-[#d83f50]">
                <i className="fa-solid fa-triangle-exclamation mt-0.5 text-[12px]" />

                <span className="text-[11.5px] font-bold leading-5">
                  {isDuplicate
                    ? t('authorCommentProtection.duplicateMessage', { list: t(`authorCommentProtection.${copy.tabLabelKey}`) })
                    : inputError}
                </span>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2.5 rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-2.5">
                <i className="fa-solid fa-wand-magic-sparkles text-[13px] text-[#7555f6]" />

                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-[var(--shadow-text-primary)]">
                    {t('authorCommentProtection.duplicateProtection')}
                  </div>

                  <div className="mt-0.5 text-[10.5px] font-medium text-[var(--shadow-text-secondary)]">
                    {t('authorCommentProtection.duplicateHelp')}
                  </div>
                </div>

                <div className="ml-auto shrink-0 text-[10.5px] font-bold text-[#7555f6]">
                  {t('authorCommentProtection.remaining', { count: remaining })}
                </div>
              </div>
            )}
          </form>

          <section className="mt-3.5 flex gap-2.5">
            <div className="relative min-w-0 flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-[var(--shadow-text-tertiary)]" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={
                  t(`authorCommentProtection.${copy.searchPlaceholderKey}`)
                }
                className="h-12 w-full rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-10 pr-10 text-[13px] font-semibold text-[var(--shadow-text-primary)] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition placeholder:font-medium placeholder:text-[var(--shadow-text-tertiary)] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
              />

              {search ? (
                <button
                  type="button"
                  onClick={() =>
                    setSearch('')
                  }
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] active:bg-[var(--shadow-bg-soft)]"
                  aria-label={t('authorCommentProtection.clearSearch')}
                >
                  <i className="fa-solid fa-xmark text-[13px]" />
                </button>
              ) : null}
            </div>

            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="h-12 appearance-none rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-4 pr-9 text-[12.5px] font-bold text-[var(--shadow-text-primary)] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
                aria-label={t('authorCommentProtection.sort', { list: t(`authorCommentProtection.${copy.tabLabelKey}`) })}
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {t(`authorCommentProtection.${option.labelKey}`)}
                    </option>
                  )
                )}
              </select>

              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--shadow-text-secondary)]" />
            </div>
          </section>

          <section className="mt-4">
            <div className="flex items-end justify-between gap-3 px-0.5">
              <div>
                <h3 className="text-[17px] font-black tracking-[-0.01em] text-[var(--shadow-text-primary)]">
                  {t(`authorCommentProtection.${copy.listTitleKey}`)}
                </h3>

                <p className="mt-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
                  {t(`authorCommentProtection.${copy.listDescriptionKey}`)}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#f2ecff] px-3 py-1.5 text-[10.5px] font-extrabold text-[#7050ed]">
                {filteredWords.length}{' '}
                {filteredWords.length ===
                1
                  ? t('authorCommentProtection.word')
                  : t('authorCommentProtection.words')}
              </span>
            </div>

            <div className="mt-3">
              {loading ? (
                <LoadingWords />
              ) : filteredWords.length ? (
                <div className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
                  {filteredWords.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-3.5 py-3.5 last:border-b-0"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#f4efff] text-[#7555f6] ring-1 ring-[#e4dbff]">
                          <i
                            className={`${copy.icon} text-[14px]`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="break-words text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
                            {item.word}
                          </div>

                          <div className="mt-1 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
                            {formatAddedDate(
                              item.created_at
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteWord(
                              item
                            )
                          }
                          disabled={
                            deletingId ===
                            String(item.id)
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#fff1f3] text-[#ef4455] ring-1 ring-[#ffd9de] transition active:scale-95 disabled:opacity-50"
                          aria-label={t('authorCommentProtection.removeWord', { word: item.word })}
                        >
                          <i
                            className={`${
                              deletingId ===
                              String(
                                item.id
                              )
                                ? 'fa-solid fa-spinner animate-spin'
                                : 'fa-regular fa-trash-can'
                            } text-[13px]`}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-10 text-center shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] bg-[#f4efff] text-[#7555f6] ring-1 ring-[#e4dbff]">
                    <i
                      className={`${copy.icon} text-[20px]`}
                    />
                  </div>

                  <h3 className="mt-3 text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
                    {search
                      ? t('authorCommentProtection.noMatchingWords')
                      : t(`authorCommentProtection.${copy.emptyTitleKey}`)}
                  </h3>

                  <p className="mx-auto mt-1.5 max-w-[290px] text-[11.5px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                    {search
                      ? t('authorCommentProtection.trySearch')
                      : t(`authorCommentProtection.${copy.emptyDescriptionKey}`)}
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="pointer-events-none mx-auto mt-12 flex h-28 max-w-[240px] items-center justify-center opacity-35">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#e5dcff] to-[#c9b8ff] text-white shadow-[0_18px_50px_rgba(112,71,245,0.28)]">
              <i className="fa-solid fa-shield-halved text-[29px]" />
              <i className="fa-solid fa-check absolute text-[12px]" />
            </div>
          </div>
        </main>
      )}

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
              aria-label={t('authorCommentProtection.closeMessage')}
            >
              <i className="fa-solid fa-xmark text-[13px]" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyManager', {
  "en": {
    "published": "Published",
    "scheduled": "Scheduled",
    "ready": "Ready",
    "draft": "Draft",
    "completed": "Completed",
    "ongoing": "Ongoing",
    "recently": "recently",
    "notSet": "not set",
    "updated": "Updated {{date}}",
    "updatedRecently": "Updated recently",
    "publishedDate": "Published {{date}}",
    "scheduledDate": "Scheduled {{date}}",
    "updatedDate": "Updated {{date}}",
    "closeDeleteModal": "Close delete modal",
    "deleteEpisodeQuestion": "Delete this episode?",
    "deleteEpisodeHelp": "This episode will move to Trash and stay hidden from readers.",
    "cancel": "Cancel",
    "deleting": "Deleting...",
    "deleteEpisode": "Delete Episode",
    "closeStoryTrashModal": "Close story trash modal",
    "moveStoryQuestion": "Move story to Trash?",
    "moveStoryHelp": "The story and its episodes will be hidden. You can restore them from Trash within 30 days.",
    "moving": "Moving...",
    "moveToTrash": "Move to Trash",
    "free": "Free",
    "untitledEpisode": "Untitled Episode",
    "words": "{{count}} words",
    "actionsFor": "Actions for {{name}}",
    "awaitingFirstEpisode": "Awaiting first episode",
    "failedLoadStory": "Failed to load story",
    "failedLoadEpisodes": "Failed to load episodes",
    "cannotConnectDeployment": "Cannot connect to backend. Please check deployment.",
    "failedLoadManager": "Failed to load story manager",
    "chooseSchedule": "Please choose schedule date and time.",
    "failedSavePublish": "Failed to save publish settings.",
    "cannotConnectBackend": "Cannot connect to backend.",
    "failedMoveDraft": "Failed to move episode to draft",
    "failedDeleteEpisode": "Failed to delete episode",
    "failedMoveStoryTrash": "Failed to move story to Trash",
    "goBack": "Go back",
    "storyManager": "Story Manager",
    "moveStoryToTrash": "Move story to Trash",
    "editStory": "Edit Story",
    "loadingManager": "Loading story manager...",
    "untitledStory": "Untitled Story",
    "episodesCount": "{{count}} Episode",
    "episodesCountPlural": "{{count}} Episodes",
    "pagesCount": "{{count}} pages",
    "wordsCount": "{{count}} words",
    "edit": "Edit",
    "performance": "Performance",
    "episodes": "Episodes",
    "shown": "{{count}} shown",
    "publishedCount": "Published {{count}}",
    "draftsCount": "Drafts {{count}}",
    "perPage": "{{count}} per page",
    "pageRange": "{{start}}–{{end}} of {{total}}",
    "noPublished": "No published episodes yet.",
    "noDraft": "No draft episodes yet.",
    "createFirstEpisode": "Create your first episode to start your story.",
    "episodesStatusHelp": "Episodes will appear here when their status changes.",
    "addEpisodeHelp": "Use the Add Episode button below when you are ready to begin.",
    "addEpisode": "Add Episode"
  },
  "km": {
    "published": "បានបោះផ្សាយ",
    "scheduled": "បានកំណត់ពេល",
    "ready": "រួចរាល់",
    "draft": "ព្រាង",
    "completed": "បានបញ្ចប់",
    "ongoing": "កំពុងបន្ត",
    "recently": "ថ្មីៗនេះ",
    "notSet": "មិនទាន់កំណត់",
    "updated": "បានអាប់ដេត {{date}}",
    "updatedRecently": "បានអាប់ដេតថ្មីៗនេះ",
    "publishedDate": "បានបោះផ្សាយ {{date}}",
    "scheduledDate": "កំណត់ពេល {{date}}",
    "updatedDate": "បានអាប់ដេត {{date}}",
    "closeDeleteModal": "បិទផ្ទាំងលុប",
    "deleteEpisodeQuestion": "លុបភាគនេះ?",
    "deleteEpisodeHelp": "ភាគនេះនឹងផ្លាស់ទៅធុងសំរាម ហើយលាក់ពីអ្នកអាន។",
    "cancel": "បោះបង់",
    "deleting": "កំពុងលុប...",
    "deleteEpisode": "លុបភាគ",
    "closeStoryTrashModal": "បិទផ្ទាំងដាក់រឿងក្នុងធុងសំរាម",
    "moveStoryQuestion": "ផ្លាស់រឿងទៅធុងសំរាម?",
    "moveStoryHelp": "រឿង និងភាគរបស់វានឹងត្រូវលាក់។ អ្នកអាចស្តារវាពីធុងសំរាមក្នុងរយៈពេល 30 ថ្ងៃ។",
    "moving": "កំពុងផ្លាស់...",
    "moveToTrash": "ផ្លាស់ទៅធុងសំរាម",
    "free": "ឥតគិតថ្លៃ",
    "untitledEpisode": "ភាគគ្មានចំណងជើង",
    "words": "{{count}} ពាក្យ",
    "actionsFor": "សកម្មភាពសម្រាប់ {{name}}",
    "awaitingFirstEpisode": "កំពុងរង់ចាំភាគដំបូង",
    "failedLoadStory": "មិនអាចផ្ទុករឿងបានទេ",
    "failedLoadEpisodes": "មិនអាចផ្ទុកភាគបានទេ",
    "cannotConnectDeployment": "មិនអាចភ្ជាប់ទៅ Backend បានទេ។ សូមពិនិត្យការដាក់ឱ្យដំណើរការ។",
    "failedLoadManager": "មិនអាចផ្ទុក Story Manager បានទេ",
    "chooseSchedule": "សូមជ្រើសកាលបរិច្ឆេទ និងម៉ោងកំណត់ពេល។",
    "failedSavePublish": "មិនអាចរក្សាទុកការកំណត់ Publish បានទេ។",
    "cannotConnectBackend": "មិនអាចភ្ជាប់ទៅ Backend បានទេ។",
    "failedMoveDraft": "មិនអាចផ្លាស់ភាគទៅ Draft បានទេ",
    "failedDeleteEpisode": "មិនអាចលុបភាគបានទេ",
    "failedMoveStoryTrash": "មិនអាចផ្លាស់រឿងទៅធុងសំរាមបានទេ",
    "goBack": "ត្រឡប់ក្រោយ",
    "storyManager": "គ្រប់គ្រងរឿង",
    "moveStoryToTrash": "ផ្លាស់រឿងទៅធុងសំរាម",
    "editStory": "កែរឿង",
    "loadingManager": "កំពុងផ្ទុកការគ្រប់គ្រងរឿង...",
    "untitledStory": "រឿងគ្មានចំណងជើង",
    "episodesCount": "{{count}} ភាគ",
    "episodesCountPlural": "{{count}} ភាគ",
    "pagesCount": "{{count}} ទំព័រ",
    "wordsCount": "{{count}} ពាក្យ",
    "edit": "កែ",
    "performance": "សមិទ្ធផល",
    "episodes": "ភាគ",
    "shown": "បង្ហាញ {{count}}",
    "publishedCount": "បានបោះផ្សាយ {{count}}",
    "draftsCount": "ព្រាង {{count}}",
    "perPage": "{{count}} ក្នុងមួយទំព័រ",
    "pageRange": "{{start}}–{{end}} នៃ {{total}}",
    "noPublished": "មិនទាន់មានភាគដែលបានបោះផ្សាយទេ។",
    "noDraft": "មិនទាន់មានភាគព្រាងទេ។",
    "createFirstEpisode": "បង្កើតភាគដំបូងរបស់អ្នក ដើម្បីចាប់ផ្តើមរឿង។",
    "episodesStatusHelp": "ភាគនឹងបង្ហាញនៅទីនេះ នៅពេលស្ថានភាពរបស់វាប្រែប្រួល។",
    "addEpisodeHelp": "ប្រើប៊ូតុង បន្ថែមភាគ ខាងក្រោម នៅពេលអ្នករួចរាល់។",
    "addEpisode": "បន្ថែមភាគ"
  },
  "zh": {
    "published": "已发布",
    "scheduled": "已定时",
    "ready": "就绪",
    "draft": "草稿",
    "completed": "已完结",
    "ongoing": "连载中",
    "recently": "最近",
    "notSet": "未设置",
    "updated": "更新于 {{date}}",
    "updatedRecently": "最近更新",
    "publishedDate": "发布于 {{date}}",
    "scheduledDate": "定时于 {{date}}",
    "updatedDate": "更新于 {{date}}",
    "closeDeleteModal": "关闭删除窗口",
    "deleteEpisodeQuestion": "删除此章节？",
    "deleteEpisodeHelp": "此章节将移至回收站并对读者隐藏。",
    "cancel": "取消",
    "deleting": "删除中...",
    "deleteEpisode": "删除章节",
    "closeStoryTrashModal": "关闭移至回收站窗口",
    "moveStoryQuestion": "将故事移至回收站？",
    "moveStoryHelp": "故事及其章节将被隐藏。你可以在 30 天内从回收站恢复。",
    "moving": "移动中...",
    "moveToTrash": "移至回收站",
    "free": "免费",
    "untitledEpisode": "未命名章节",
    "words": "{{count}} 字",
    "actionsFor": "{{name}} 的操作",
    "awaitingFirstEpisode": "等待第一个章节",
    "failedLoadStory": "无法加载故事",
    "failedLoadEpisodes": "无法加载章节",
    "cannotConnectDeployment": "无法连接后端。请检查部署。",
    "failedLoadManager": "无法加载故事管理器",
    "chooseSchedule": "请选择定时日期和时间。",
    "failedSavePublish": "无法保存发布设置。",
    "cannotConnectBackend": "无法连接后端。",
    "failedMoveDraft": "无法将章节移至草稿",
    "failedDeleteEpisode": "无法删除章节",
    "failedMoveStoryTrash": "无法将故事移至回收站",
    "goBack": "返回",
    "storyManager": "故事管理",
    "moveStoryToTrash": "将故事移至回收站",
    "editStory": "编辑故事",
    "loadingManager": "正在加载故事管理器...",
    "untitledStory": "未命名故事",
    "episodesCount": "{{count}} 个章节",
    "episodesCountPlural": "{{count}} 个章节",
    "pagesCount": "{{count}} 页",
    "wordsCount": "{{count}} 字",
    "edit": "编辑",
    "performance": "数据表现",
    "episodes": "章节",
    "shown": "显示 {{count}} 个",
    "publishedCount": "已发布 {{count}}",
    "draftsCount": "草稿 {{count}}",
    "perPage": "每页 {{count}} 个",
    "pageRange": "{{start}}–{{end}} / {{total}}",
    "noPublished": "暂无已发布章节。",
    "noDraft": "暂无草稿章节。",
    "createFirstEpisode": "创建第一个章节来开始你的故事。",
    "episodesStatusHelp": "章节状态发生变化后会显示在这里。",
    "addEpisodeHelp": "准备好后，使用下方的“添加章节”按钮。",
    "addEpisode": "添加章节"
  },
  "ja": {
    "published": "公開済み",
    "scheduled": "予約済み",
    "ready": "準備完了",
    "draft": "下書き",
    "completed": "完結",
    "ongoing": "連載中",
    "recently": "最近",
    "notSet": "未設定",
    "updated": "{{date}} に更新",
    "updatedRecently": "最近更新",
    "publishedDate": "{{date}} に公開",
    "scheduledDate": "{{date}} に予約",
    "updatedDate": "{{date}} に更新",
    "closeDeleteModal": "削除画面を閉じる",
    "deleteEpisodeQuestion": "このエピソードを削除しますか？",
    "deleteEpisodeHelp": "このエピソードはゴミ箱に移動し、読者には表示されません。",
    "cancel": "キャンセル",
    "deleting": "削除中...",
    "deleteEpisode": "エピソードを削除",
    "closeStoryTrashModal": "ストーリー移動画面を閉じる",
    "moveStoryQuestion": "ストーリーをゴミ箱に移動しますか？",
    "moveStoryHelp": "ストーリーとエピソードは非表示になります。30日以内ならゴミ箱から復元できます。",
    "moving": "移動中...",
    "moveToTrash": "ゴミ箱に移動",
    "free": "無料",
    "untitledEpisode": "無題のエピソード",
    "words": "{{count}} 語",
    "actionsFor": "{{name}} の操作",
    "awaitingFirstEpisode": "最初のエピソード待ち",
    "failedLoadStory": "ストーリーを読み込めませんでした",
    "failedLoadEpisodes": "エピソードを読み込めませんでした",
    "cannotConnectDeployment": "バックエンドに接続できません。デプロイを確認してください。",
    "failedLoadManager": "ストーリーマネージャーを読み込めませんでした",
    "chooseSchedule": "予約日時を選択してください。",
    "failedSavePublish": "公開設定を保存できませんでした。",
    "cannotConnectBackend": "バックエンドに接続できません。",
    "failedMoveDraft": "エピソードを下書きに移動できませんでした",
    "failedDeleteEpisode": "エピソードを削除できませんでした",
    "failedMoveStoryTrash": "ストーリーをゴミ箱に移動できませんでした",
    "goBack": "戻る",
    "storyManager": "ストーリー管理",
    "moveStoryToTrash": "ストーリーをゴミ箱に移動",
    "editStory": "ストーリーを編集",
    "loadingManager": "ストーリー管理を読み込み中...",
    "untitledStory": "無題のストーリー",
    "episodesCount": "{{count}} エピソード",
    "episodesCountPlural": "{{count}} エピソード",
    "pagesCount": "{{count}} ページ",
    "wordsCount": "{{count}} 語",
    "edit": "編集",
    "performance": "パフォーマンス",
    "episodes": "エピソード",
    "shown": "{{count}} 件表示",
    "publishedCount": "公開済み {{count}}",
    "draftsCount": "下書き {{count}}",
    "perPage": "1ページ {{count}} 件",
    "pageRange": "{{start}}–{{end}} / {{total}}",
    "noPublished": "公開済みエピソードはまだありません。",
    "noDraft": "下書きエピソードはまだありません。",
    "createFirstEpisode": "最初のエピソードを作成してストーリーを始めましょう。",
    "episodesStatusHelp": "ステータスが変わるとエピソードがここに表示されます。",
    "addEpisodeHelp": "準備ができたら下の「エピソードを追加」ボタンを使ってください。",
    "addEpisode": "エピソードを追加"
  },
  "ko": {
    "published": "게시됨",
    "scheduled": "예약됨",
    "ready": "준비됨",
    "draft": "초안",
    "completed": "완결",
    "ongoing": "연재 중",
    "recently": "최근",
    "notSet": "설정 안 됨",
    "updated": "{{date}} 업데이트",
    "updatedRecently": "최근 업데이트",
    "publishedDate": "{{date}} 게시",
    "scheduledDate": "{{date}} 예약",
    "updatedDate": "{{date}} 업데이트",
    "closeDeleteModal": "삭제 창 닫기",
    "deleteEpisodeQuestion": "이 에피소드를 삭제할까요?",
    "deleteEpisodeHelp": "이 에피소드는 휴지통으로 이동하고 독자에게 숨겨집니다.",
    "cancel": "취소",
    "deleting": "삭제 중...",
    "deleteEpisode": "에피소드 삭제",
    "closeStoryTrashModal": "스토리 휴지통 창 닫기",
    "moveStoryQuestion": "스토리를 휴지통으로 이동할까요?",
    "moveStoryHelp": "스토리와 에피소드가 숨겨집니다. 30일 이내에 휴지통에서 복원할 수 있습니다.",
    "moving": "이동 중...",
    "moveToTrash": "휴지통으로 이동",
    "free": "무료",
    "untitledEpisode": "제목 없는 에피소드",
    "words": "{{count}}단어",
    "actionsFor": "{{name}} 작업",
    "awaitingFirstEpisode": "첫 에피소드 대기 중",
    "failedLoadStory": "스토리를 불러오지 못했습니다",
    "failedLoadEpisodes": "에피소드를 불러오지 못했습니다",
    "cannotConnectDeployment": "백엔드에 연결할 수 없습니다. 배포 상태를 확인해 주세요.",
    "failedLoadManager": "스토리 관리 화면을 불러오지 못했습니다",
    "chooseSchedule": "예약 날짜와 시간을 선택해 주세요.",
    "failedSavePublish": "게시 설정을 저장하지 못했습니다.",
    "cannotConnectBackend": "백엔드에 연결할 수 없습니다.",
    "failedMoveDraft": "에피소드를 초안으로 이동하지 못했습니다",
    "failedDeleteEpisode": "에피소드를 삭제하지 못했습니다",
    "failedMoveStoryTrash": "스토리를 휴지통으로 이동하지 못했습니다",
    "goBack": "뒤로 가기",
    "storyManager": "스토리 관리",
    "moveStoryToTrash": "스토리를 휴지통으로 이동",
    "editStory": "스토리 편집",
    "loadingManager": "스토리 관리 불러오는 중...",
    "untitledStory": "제목 없는 스토리",
    "episodesCount": "에피소드 {{count}}개",
    "episodesCountPlural": "에피소드 {{count}}개",
    "pagesCount": "{{count}}페이지",
    "wordsCount": "{{count}}단어",
    "edit": "편집",
    "performance": "성과",
    "episodes": "에피소드",
    "shown": "{{count}}개 표시",
    "publishedCount": "게시됨 {{count}}",
    "draftsCount": "초안 {{count}}",
    "perPage": "페이지당 {{count}}개",
    "pageRange": "{{start}}–{{end}} / {{total}}",
    "noPublished": "게시된 에피소드가 아직 없습니다.",
    "noDraft": "초안 에피소드가 아직 없습니다.",
    "createFirstEpisode": "첫 에피소드를 만들어 스토리를 시작하세요.",
    "episodesStatusHelp": "상태가 변경되면 에피소드가 여기에 표시됩니다.",
    "addEpisodeHelp": "준비되면 아래의 에피소드 추가 버튼을 사용하세요.",
    "addEpisode": "에피소드 추가"
  }
})

import ProfessionalEpisodeActionSheet from '../../components/author/ProfessionalEpisodeActionSheet'
import { PublishSettingsSheet } from './EpisodeEditorPage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}


function formatDisplayNumber(value) {
  return new Intl.NumberFormat(getDisplayLanguageId()).format(Number(value || 0))
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(getDisplayLanguageId())
}

function getStatusText(status) {
  const normalized = String(status || 'draft').toLowerCase()

  if (normalized === 'published') return getDisplayText('storyManager.published')
  if (normalized === 'scheduled') return getDisplayText('storyManager.scheduled')
  if (normalized === 'ready') return getDisplayText('storyManager.ready')
  return getDisplayText('storyManager.draft')
}

function getStoryStatusText(story, episodeCount) {
  const normalized = String(story?.story_status || story?.status || '').toLowerCase()

  if (['completed', 'complete', 'finished'].includes(normalized)) return getDisplayText('storyManager.completed')
  if (episodeCount > 0) return getDisplayText('storyManager.ongoing')
  return ''
}

function getDateLabel(episode) {
  const status = String(episode?.status || 'draft').toLowerCase()
  const value =
    status === 'published'
      ? episode?.published_at || episode?.updated_at || episode?.created_at
      : status === 'scheduled'
        ? episode?.scheduled_at || episode?.updated_at || episode?.created_at
        : episode?.updated_at || episode?.created_at
  const date = formatDate(value)

  if (status === 'published') return getDisplayText('storyManager.publishedDate', { date: date || getDisplayText('storyManager.recently') })
  if (status === 'scheduled') return getDisplayText('storyManager.scheduledDate', { date: date || getDisplayText('storyManager.notSet') })
  return getDisplayText('storyManager.updatedDate', { date: date || getDisplayText('storyManager.recently') })
}

function getStoryUpdatedLabel(story, episodes) {
  const values = [
    story?.updated_at,
    story?.created_at,
    ...episodes.flatMap((episode) => [
      episode.updated_at,
      episode.published_at,
      episode.created_at,
    ]),
  ]
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((first, second) => second.getTime() - first.getTime())

  return values.length
    ? getDisplayText('storyManager.updated', { date: values[0].toLocaleDateString(getDisplayLanguageId()) })
    : getDisplayText('storyManager.updatedRecently')
}

function StatusBadge({ status }) {
  const normalized = String(status || 'draft').toLowerCase()
  const classes = {
    published: 'bg-[#ecfdf3] text-[#16803c]',
    scheduled: 'bg-[#eff6ff] text-[#0b5cff]',
    ready: 'bg-[#fff7df] text-[#a56a00]',
    draft: 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]',
  }

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes[normalized] || classes.draft}`}>
      {getStatusText(normalized)}
    </span>
  )
}

function ConfirmDeleteModal({ episode, busy, onClose, onConfirm }) {
  if (!episode) return null

  return (
    <div className="fixed inset-0 z-[170] flex items-end justify-center bg-black/45 px-3 pb-3 sm:items-center sm:pb-0">
      <button type="button" aria-label={getDisplayText('storyManager.closeDeleteModal')} onClick={onClose} className="absolute inset-0" />

      <section className="relative w-full max-w-[420px] rounded-[18px] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-regular fa-trash-can text-[19px]" />
        </div>

        <h2 className="mt-4 text-[18px] font-semibold text-[var(--shadow-text-primary)]">{getDisplayText('storyManager.deleteEpisodeQuestion')}</h2>
        <p className="mt-2 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
          {getDisplayText('storyManager.deleteEpisodeHelp')}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-11 rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-normal text-[var(--shadow-text-primary)] disabled:opacity-60"
          >
            {getDisplayText('storyManager.cancel')}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="h-11 rounded-[12px] bg-[#e5484d] text-[13px] font-normal text-white disabled:opacity-60"
          >
            {busy ? getDisplayText('storyManager.deleting') : getDisplayText('storyManager.deleteEpisode')}
          </button>
        </div>
      </section>
    </div>
  )
}

function ConfirmTrashStoryModal({ story, open, busy, onClose, onConfirm }) {
  if (!open || !story) return null

  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/45 px-3 pb-3 sm:items-center sm:pb-0">
      <button type="button" aria-label={getDisplayText('storyManager.closeStoryTrashModal')} onClick={onClose} className="absolute inset-0" />

      <section className="relative w-full max-w-[420px] rounded-[18px] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-regular fa-trash-can text-[19px]" />
        </div>

        <h2 className="mt-4 text-[18px] font-semibold text-[var(--shadow-text-primary)]">{getDisplayText('storyManager.moveStoryQuestion')}</h2>
        <p className="mt-2 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
          {getDisplayText('storyManager.moveStoryHelp')}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-11 rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-normal text-[var(--shadow-text-primary)] disabled:opacity-60"
          >
            {getDisplayText('storyManager.cancel')}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="h-11 rounded-[12px] bg-[#e5484d] text-[13px] font-normal text-white disabled:opacity-60"
          >
            {busy ? getDisplayText('storyManager.moving') : getDisplayText('storyManager.moveToTrash')}
          </button>
        </div>
      </section>
    </div>
  )
}

function EpisodeMetric({ icon, value }) {
  return (
    <span className="inline-flex min-w-[58px] items-center justify-center gap-1.5 text-[11px] font-normal text-[var(--shadow-text-secondary)]">
      <i className={`${icon} text-[11px] text-[var(--shadow-text-primary)]`} />
      {formatCompactNumber(value)}
    </span>
  )
}

function EpisodeRow({ episode, last, onOpen, onMore }) {
  const views = episode.total_views || episode.views || 0
  const likes = episode.total_likes || episode.likes || 0
  const comments = episode.total_comments || episode.comments || 0
  const earnings = Number(episode.total_earnings_usd || 0)
  const wordCount = Number(episode.word_count || 0)
  const isFree = Boolean(episode.is_free_published)

  return (
    <div className="relative flex min-h-[96px] items-center gap-3 bg-[var(--shadow-bg-surface)] px-4 py-4">
      <button
        type="button"
        onClick={() => onOpen(episode)}
        className="flex min-w-0 flex-1 items-center text-left active:opacity-70"
      >
        <div className="min-w-0">
          {isFree || episode.is_adult ? (
  <div className="mb-1 flex items-center gap-1.5">
    {isFree ? <span className="inline-flex h-[18px] items-center rounded-full bg-[#FE526E] px-2 text-[9px] font-normal leading-none text-white">{getDisplayText('storyManager.free')}</span> : null}
    {episode.is_adult ? <span className="inline-flex h-[18px] items-center rounded-full bg-[#111827] px-2 text-[9px] font-normal leading-none text-white">18+</span> : null}
  </div>
) : null}

          <div className="line-clamp-1 text-[14px] font-semibold leading-5 text-[var(--shadow-text-primary)]">
            {episode.title || getDisplayText('storyManager.untitledEpisode')}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
            <span>{getDateLabel(episode)}</span>
            <span>•</span>
            <span>{getDisplayText('storyManager.words', { count: formatDisplayNumber(wordCount) })}</span>
          </div>
        </div>
      </button>

      <div className="hidden shrink-0 items-center gap-2 md:flex">
        <EpisodeMetric icon="fa-regular fa-eye" value={views} />
        <EpisodeMetric icon="fa-regular fa-heart" value={likes} />
        <EpisodeMetric icon="fa-regular fa-comment" value={comments} />
        <span className="hidden min-w-[58px] items-center justify-center gap-1 text-[11px] text-[var(--shadow-text-secondary)] lg:inline-flex">
  <i className="fa-solid fa-dollar-sign text-[11px] text-[var(--shadow-text-primary)]" />
  {earnings.toFixed(2)}
</span>
      </div>

      <button
        type="button"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()

          onMore({
            ...episode,
            __menuAnchor: {
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
            },
          })
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center self-center text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
        aria-label={getDisplayText('storyManager.actionsFor', { name: episode.title || getDisplayText('storyManager.untitledEpisode') })}
      >
        <i className="fa-solid fa-ellipsis text-[14px]" />
      </button>

      {!last ? (
        <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[var(--shadow-bg-soft)]" />
      ) : null}
    </div>
  )
}

function getSavedManagerView(storyId) {
  try {
    return JSON.parse(sessionStorage.getItem(`story-manager-view:${storyId}`) || '{}')
  } catch {
    return {}
  }
}

export default function StoryManagerPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [story, setStory] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const initialView = getSavedManagerView(storyId)
const [activeTab, setActiveTab] = useState(initialView.activeTab || 'published')
const [pageSize, setPageSize] = useState(
  [20, 30, 50].includes(Number(initialView.pageSize)) ? Number(initialView.pageSize) : 20
)
const [currentPage, setCurrentPage] = useState(Math.max(1, Number(initialView.currentPage) || 1))
  const saveManagerView = () => {
  sessionStorage.setItem(
    `story-manager-view:${storyId}`,
    JSON.stringify({ activeTab, pageSize, currentPage })
  )
}
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [deleteEpisode, setDeleteEpisode] = useState(null)
  const [trashStoryOpen, setTrashStoryOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [publishEpisode, setPublishEpisode] = useState(null)
  const [publishSettingsOpen, setPublishSettingsOpen] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [episodeAdult, setEpisodeAdult] = useState(false)
  const [episodeFree, setEpisodeFree] = useState(false)
  const [releaseOption, setReleaseOption] = useState('publish')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  
  const modalOpen = Boolean(
    selectedEpisode ||
    deleteEpisode ||
    trashStoryOpen
  )

  useEffect(() => {
    if (!modalOpen) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousHtmlOverflow = html.style.overflow

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
  }, [modalOpen])

  const publishedEpisodes = useMemo(
    () => episodes.filter((episode) => String(episode.status).toLowerCase() === 'published'),
    [episodes]
  )

  const draftEpisodes = useMemo(
    () => episodes.filter((episode) => String(episode.status).toLowerCase() !== 'published'),
    [episodes]
  )

  const visibleEpisodes = activeTab === 'published' ? publishedEpisodes : draftEpisodes
  const totalPages = Math.max(1, Math.ceil(visibleEpisodes.length / pageSize))
  const pageStart = (currentPage - 1) * pageSize
  const pageEnd = Math.min(pageStart + pageSize, visibleEpisodes.length)
  const paginatedEpisodes = visibleEpisodes.slice(pageStart, pageEnd)
  const totalWords = useMemo(
    () => episodes.reduce((sum, episode) => sum + Number(episode.word_count || 0), 0),
    [episodes]
  )
  const totalMangaPages = useMemo(
    () => episodes.reduce((sum, episode) => sum + Number(episode.page_count || 0), 0),
    [episodes]
  )
  const displayLanguageId = getDisplayLanguageId()
  const storyUpdatedLabel = useMemo(
    () => getStoryUpdatedLabel(story, episodes),
    [story, episodes, displayLanguageId]
  )
  const storyStatusText = getStoryStatusText(story, episodes.length)
  const storyProgressText = episodes.length
    ? `${storyStatusText} • ${getDisplayText(
        episodes.length === 1
          ? 'storyManager.episodesCount'
          : 'storyManager.episodesCountPlural',
        { count: formatDisplayNumber(episodes.length) }
      )}`
    : getDisplayText('storyManager.awaitingFirstEpisode')
  const storyContentText =
    String(story?.story_type || '').toLowerCase() === 'manga'
      ? getDisplayText('storyManager.pagesCount', { count: formatDisplayNumber(totalMangaPages) })
      : getDisplayText('storyManager.wordsCount', { count: formatDisplayNumber(totalWords) })

  const storyType = String(story?.story_type || 'novel').toLowerCase()
const addEpisodeTheme =
  storyType === 'manga'
    ? 'bg-[#FE526E]'
    : storyType === 'chat_story'
      ? 'bg-gradient-to-r from-[#9362ef] to-[#6d42db]'
      : 'bg-[var(--shadow-text-primary)]'

  const paginationMounted = useRef(false)
useEffect(() => {
  if (!paginationMounted.current) {
    paginationMounted.current = true
    return
  }
  setCurrentPage(1)
}, [activeTab, pageSize])
  useEffect(() => {
    if (!loading && currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages, loading])

  useEffect(() => {
    let ignore = false

    async function loadStoryManager() {
      setLoading(true)
      setMessage('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const [storyResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/stories/${storyId}/manager-episodes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const storyData = await storyResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || getDisplayText('storyManager.failedLoadStory'))
        }

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || getDisplayText('storyManager.failedLoadEpisodes'))
        }

        if (ignore) return

        setStory(storyData.story || null)
        setEpisodes(episodesData.episodes || [])
      } catch (error) {
        if (ignore) return
        setMessage(
          error.message === 'Failed to fetch'
            ? getDisplayText('storyManager.cannotConnectDeployment')
            : error.message || getDisplayText('storyManager.failedLoadManager')
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStoryManager()

    return () => {
      ignore = true
    }
  }, [navigate, storyId])

  const clearManagerView = () => {
    sessionStorage.removeItem(`story-manager-view:${storyId}`)
  }

  const handleLeaveStoryManager = () => {
    clearManagerView()
    navigate(-1)
  }

  const handleEditStory = () => {
    clearManagerView()
    navigate(`/author/create-story?editStoryId=${storyId}`)
  }

  const handleAddEpisode = () => {
  saveManagerView()
  const isChatStory = String(story?.story_type || '').toLowerCase() === 'chat_story'
  navigate(
    isChatStory
      ? `/author/story/${storyId}/chat/characters?new=1&returnTo=${encodeURIComponent(`/author/story/${storyId}/manage`)}`
      : `/author/story/${storyId}/episode/create?first=0`
  )
}

  const handlePerformance = () => {
    clearManagerView()
    navigate(`/author/story/${storyId}/performance`)
  }

  const handleEditEpisode = (episode) => {
  setSelectedEpisode(null)
  saveManagerView()
  const isChatStory =
    String(story?.story_type || '').trim().toLowerCase() === 'chat_story'

  navigate(
    isChatStory
      ? `/author/story/${storyId}/chat/editor?episodeId=${episode.id}`
      : `/author/story/${storyId}/episode/create?editEpisodeId=${episode.id}&startStep=2&first=0`
  )
}

  const handlePreviewEpisode = (episode) => {
    setSelectedEpisode(null)
    saveManagerView()
    navigate(`/author/story/${storyId}/episode/preview?episodeId=${episode.id}`)
  }

  const handlePublishEpisode = (episode) => {
  const scheduled = episode.scheduled_at
    ? new Date(episode.scheduled_at)
    : null

  const localSchedule =
    scheduled && !Number.isNaN(scheduled.getTime())
      ? new Date(
          scheduled.getTime() -
          scheduled.getTimezoneOffset() * 60000
        ).toISOString()
      : ''

  setSelectedEpisode(null)
  setPublishEpisode(episode)
  setEpisodeAdult(Boolean(episode.is_adult))
  setEpisodeFree(Boolean(episode.is_free_published))
  setReleaseOption(
    String(episode.status).toLowerCase() === 'scheduled'
      ? 'schedule'
      : 'publish'
  )
  setScheduleDate(localSchedule.slice(0, 10))
  setScheduleTime(localSchedule.slice(11, 16))

  window.setTimeout(() => {
    setPublishSettingsOpen(true)
  }, 0)
}

const handleSavePublishSettings = async () => {
  if (!publishEpisode || settingsSaving) return

  if (
    releaseOption === 'schedule' &&
    (!scheduleDate || !scheduleTime)
  ) {
    setMessage(getDisplayText('storyManager.chooseSchedule'))
    return
  }

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  try {
    setSettingsSaving(true)
    setMessage('')

    const status =
      releaseOption === 'schedule'
        ? 'scheduled'
        : releaseOption === 'draft'
          ? 'draft'
          : 'published'

    const scheduledAt =
      releaseOption === 'schedule'
        ? new Date(
            `${scheduleDate}T${scheduleTime}:00`
          ).toISOString()
        : null

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/episodes/${publishEpisode.id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          scheduled_at: scheduledAt,
          is_adult: episodeAdult,
          is_free_published: episodeFree,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      const blockedWords =
        data.blocked_words_found ||
        data.blockedWordsFound ||
        []

      if (
        data.code === 'BLOCKED_WORDS_FOUND' ||
        blockedWords.length
      ) {
        setPublishSettingsOpen(false)
        setPublishEpisode(null)

        navigate(
          `/author/story/${storyId}/episode/publish-warning`,
          {
            state: {
              episodeId: publishEpisode.id,
              blockedWords,
            },
          }
        )
        return
      }

      throw new Error(
        data.message || getDisplayText('storyManager.failedSavePublish')
      )
    }

    const savedEpisode = data.episode || {}
    const updatedAt =
      savedEpisode.updated_at ||
      new Date().toISOString()

    setEpisodes((current) =>
      current.map((item) =>
        String(item.id) === String(publishEpisode.id)
          ? {
              ...item,
              ...savedEpisode,
              status,
              scheduled_at:
                status === 'scheduled'
                  ? scheduledAt
                  : null,
              published_at:
                status === 'published'
                  ? savedEpisode.published_at ||
                    new Date().toISOString()
                  : null,
              is_adult: episodeAdult,
              is_free_published: episodeFree,
              updated_at: updatedAt,
            }
          : item
      )
    )

    setActiveTab(
      status === 'published'
        ? 'published'
        : 'drafts'
    )

    setPublishSettingsOpen(false)
    setPublishEpisode(null)
  } catch (error) {
    setMessage(
      error.message === 'Failed to fetch'
        ? getDisplayText('storyManager.cannotConnectBackend')
        : error.message ||
          getDisplayText('storyManager.failedSavePublish')
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  } finally {
    setSettingsSaving(false)
  }
}

  const handleMoveToDraft = async (episode) => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setBusy(true)
      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes/${episode.id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'draft' }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('storyManager.failedMoveDraft'))
      }

      setEpisodes((current) =>
        current.map((item) =>
          String(item.id) === String(episode.id)
            ? {
                ...item,
                status: 'draft',
                published_at: null,
                scheduled_at: null,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      )
      setSelectedEpisode(null)
      setActiveTab('drafts')
    } catch (error) {
      setSelectedEpisode(null)
      setMessage(error.message || getDisplayText('storyManager.failedMoveDraft'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteEpisode = (episode) => {
    setSelectedEpisode(null)
    setDeleteEpisode(episode)
  }

  const handleConfirmDeleteEpisode = async () => {
    if (!deleteEpisode) return

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setBusy(true)
      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/episodes/${deleteEpisode.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('storyManager.failedDeleteEpisode'))
      }

      setEpisodes((current) => current.filter((episode) => String(episode.id) !== String(deleteEpisode.id)))
      setDeleteEpisode(null)
    } catch (error) {
      setDeleteEpisode(null)
      setMessage(error.message || getDisplayText('storyManager.failedDeleteEpisode'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  const handleMoveStoryToTrash = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setBusy(true)
      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('storyManager.failedMoveStoryTrash'))
      }

      setTrashStoryOpen(false)
      clearManagerView()
      navigate('/author/dashboard', { replace: true })
    } catch (error) {
      setTrashStoryOpen(false)
      setMessage(error.message || getDisplayText('storyManager.failedMoveStoryTrash'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className={`min-h-screen bg-[var(--shadow-bg-page)] pb-[92px] text-[var(--shadow-text-primary)] ${
        storyType === 'manga' ? 'manga-red-theme' : ''
      }`}
    >
      <style>{`
        .manga-red-theme button:not(:disabled)[class*="bg-[var(--shadow-text-primary)]"],
        .manga-red-theme button:not(:disabled)[class*="bg-[#e5484d]"],
        .manga-red-theme label[class*="bg-[var(--shadow-text-primary)]"] {
          background-color: #FE526E !important;
        }

        .manga-red-theme button[class*="text-[#0b5cff]"] {
          color: #FE526E !important;
        }

        .manga-red-theme input[type="range"] {
          accent-color: #FE526E;
        }
      `}</style>
      <ProfessionalEpisodeActionSheet
        episode={selectedEpisode}
        open={Boolean(selectedEpisode)}
        onClose={() => setSelectedEpisode(null)}
        onEdit={handleEditEpisode}
        onPreview={handlePreviewEpisode}
        onPublish={handlePublishEpisode}
        onMoveToDraft={handleMoveToDraft}
        onDelete={handleDeleteEpisode}
        busy={busy}
      />

      <PublishSettingsSheet
  open={publishSettingsOpen}
  episodeTitle={
    publishEpisode?.title ||
    getDisplayText('storyManager.untitledEpisode')
  }
  showStorySettings={false}
  genreOptions={[]}
  storyLanguage=""
  onStoryLanguageChange={() => {}}
  mainGenre=""
  onMainGenreChange={() => {}}
  storyTags={[]}
  onStoryTagsChange={() => {}}
  updateDays={[]}
  onToggleUpdateDay={() => {}}
  storyStatus=""
  onStoryStatusChange={() => {}}
  storyAdult={false}
  onStoryAdultChange={() => {}}
  episodeAdult={episodeAdult}
  onEpisodeAdultChange={setEpisodeAdult}
  episodeFree={episodeFree}
  onEpisodeFreeChange={setEpisodeFree}
  releaseOption={releaseOption}
  onReleaseOptionChange={setReleaseOption}
  scheduleDate={scheduleDate}
  onScheduleDateChange={setScheduleDate}
  scheduleTime={scheduleTime}
  onScheduleTimeChange={setScheduleTime}
  saving={settingsSaving}
  onClose={() => {
    setPublishSettingsOpen(false)
    setPublishEpisode(null)
  }}
  onSave={handleSavePublishSettings}
  isChatStory={storyType === 'chat_story'}
/>

      <ConfirmDeleteModal
        episode={deleteEpisode}
        busy={busy}
        onClose={() => setDeleteEpisode(null)}
        onConfirm={handleConfirmDeleteEpisode}
      />

      <ConfirmTrashStoryModal
        story={story}
        open={trashStoryOpen}
        busy={busy}
        onClose={() => setTrashStoryOpen(false)}
        onConfirm={handleMoveStoryToTrash}
      />

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto grid h-[58px] max-w-5xl grid-cols-[44px_1fr_44px] items-center px-2 sm:px-4">
          <button
            type="button"
            onClick={handleLeaveStoryManager}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:opacity-60"
            aria-label={getDisplayText('storyManager.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="truncate text-center text-[15px] font-semibold text-[var(--shadow-text-primary)]">{getDisplayText('storyManager.storyManager')}</h1>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setTrashStoryOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-[#e5484d] active:opacity-60"
              aria-label={getDisplayText('storyManager.moveStoryToTrash')}
            >
              <i className="fa-regular fa-trash-can text-[13px]" />
            </button>

            <button
              type="button"
              onClick={handleEditStory}
              className="hidden h-9 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[12px] font-normal text-[var(--shadow-bg-surface)] active:scale-95"
            >
              {getDisplayText('storyManager.editStory')}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-0 py-0 sm:px-5 sm:py-4">
        {loading ? (
          <section className="rounded-[14px] bg-[var(--shadow-bg-surface)] p-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[var(--shadow-text-primary)]" />
            <div className="text-[12px] font-normal text-[var(--shadow-text-secondary)]">{getDisplayText('storyManager.loadingManager')}</div>
          </section>
        ) : null}

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[12px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-normal leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {!loading && story ? (
          <>
            <section className="bg-[var(--shadow-bg-surface)] px-3 py-4 sm:px-4">
              <div className="flex items-start gap-4">
                <div className="aspect-[2/3] w-[88px] shrink-0 overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)] sm:w-[104px]">
                  {story.cover_url ? (
                    <img src={story.cover_url} alt={story.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
                      <i className="fa-regular fa-image text-[22px]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <h2 className="line-clamp-2 text-[19px] font-semibold leading-[1.65] text-[var(--shadow-text-primary)] sm:text-[22px]">
                    {story.title || getDisplayText('storyManager.untitledStory')}
                  </h2>

                  <div className={`mt-2 text-[12px] font-normal ${episodes.length ? 'text-[var(--shadow-text-secondary)]' : 'text-[#a56a00]'}`}>
                    {storyProgressText}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
                    <span>{storyContentText}</span>
                    <span>•</span>
                    <span>{storyUpdatedLabel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleEditStory}
                  className="h-11 rounded-full border border-[#e5484d] bg-[var(--shadow-bg-surface)] text-[13px] font-normal text-[#e5484d] active:bg-[#fff5f5]"
                >
                  {getDisplayText('storyManager.edit')}
                </button>

                <button
                  type="button"
                  onClick={handlePerformance}
                  className="h-11 rounded-full border border-[#e5484d] bg-[var(--shadow-bg-surface)] text-[13px] font-normal text-[#e5484d] active:bg-[#fff5f5]"
                >
                  {getDisplayText('storyManager.performance')}
                </button>
              </div>
            </section>

            <section className="mt-3 bg-[var(--shadow-bg-surface)]">
              <div className="hidden items-center justify-between gap-3 px-3 pb-3 pt-4 sm:px-4">
                <h2 className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">{getDisplayText('storyManager.episodes')}</h2>
                <span className="text-[11px] font-normal text-[var(--shadow-text-tertiary)]">{getDisplayText('storyManager.shown', { count: formatDisplayNumber(visibleEpisodes.length) })}</span>
              </div>

              <div className="flex gap-1 border-b border-[var(--shadow-border)] px-3 pb-3 pt-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('published')}
                  className={`rounded-full px-5 py-2.5 text-[12px] font-normal transition active:scale-[0.98] ${
                    activeTab === 'published'
                      ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
                      : 'bg-transparent text-[var(--shadow-text-tertiary)]'
                  }`}
                >
                  {getDisplayText('storyManager.publishedCount', { count: formatDisplayNumber(publishedEpisodes.length) })}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('drafts')}
                  className={`rounded-full px-5 py-2.5 text-[12px] font-normal transition active:scale-[0.98] ${
                    activeTab === 'drafts'
                      ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
                      : 'bg-transparent text-[var(--shadow-text-tertiary)]'
                  }`}
                >
                  {getDisplayText('storyManager.draftsCount', { count: formatDisplayNumber(draftEpisodes.length) })}
                </button>
              </div>

              {visibleEpisodes.length ? (
                <>
                  <div>
                    {paginatedEpisodes.map((episode, index) => (
                      <EpisodeRow
                        key={episode.id}
                        episode={episode}
                        last={index === paginatedEpisodes.length - 1}
                        onOpen={handleEditEpisode}
                        onMore={setSelectedEpisode}
                      />
                    ))}
                  </div>

                  {visibleEpisodes.length > pageSize ? (
                    <div className="flex items-center justify-between border-t border-[var(--shadow-border)] px-4 py-3 text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                      <select
                        value={pageSize}
                        onChange={(event) => setPageSize(Number(event.target.value))}
                        className="h-8 rounded-[8px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] px-2 text-[11px] font-normal text-[var(--shadow-text-primary)] outline-none"
                      >
                        <option value={20}>{getDisplayText('storyManager.perPage', { count: formatDisplayNumber(20) })}</option>
                        <option value={30}>{getDisplayText('storyManager.perPage', { count: formatDisplayNumber(30) })}</option>
                        <option value={50}>{getDisplayText('storyManager.perPage', { count: formatDisplayNumber(50) })}</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <span>{getDisplayText('storyManager.pageRange', { start: formatDisplayNumber(pageStart + 1), end: formatDisplayNumber(pageEnd), total: formatDisplayNumber(visibleEpisodes.length) })}</span>
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                          className="flex h-8 w-8 items-center justify-center disabled:opacity-25"
                        >
                          <i className="fa-solid fa-chevron-left text-[10px]" />
                        </button>
                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                          className="flex h-8 w-8 items-center justify-center disabled:opacity-25"
                        >
                          <i className="fa-solid fa-chevron-right text-[10px]" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="text-[14px] font-normal text-[var(--shadow-text-primary)]">
                    {episodes.length
                      ? activeTab === 'published'
                        ? getDisplayText('storyManager.noPublished')
                        : getDisplayText('storyManager.noDraft')
                      : getDisplayText('storyManager.createFirstEpisode')}
                  </div>
                  <div className="mx-auto mt-2 max-w-[300px] text-[11px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
                    {episodes.length
                      ? getDisplayText('storyManager.episodesStatusHelp')
                      : getDisplayText('storyManager.addEpisodeHelp')}
                  </div>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>

      {!loading && story ? (
        <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <button
              type="button"
              onClick={handleAddEpisode}
              className={`flex h-12 w-full items-center justify-center rounded-full text-[14px] font-normal text-white active:scale-[0.99] ${addEpisodeTheme}`}
            >
              <i className="fa-solid fa-plus mr-2 text-[12px]" />
              {getDisplayText('storyManager.addEpisode')}
            </button>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

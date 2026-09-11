import { useEffect, useMemo, useState } from 'react'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('publishEpisode', {
  en: {
    untitledEpisode: "Untitled Episode",
    episodeScheduled: "Episode Scheduled!",
    draftSaved: "Draft Saved!",
    storyLive: "Your Story Is Live!",
    episodePublished: "Episode Published!",
    scheduledNumber: "Episode {{number}} has been scheduled and will publish automatically at the selected time.",
    scheduled: "Your episode has been scheduled and will publish automatically at the selected time.",
    draftNumber: "Episode {{number}} has been saved as a draft. Readers cannot see it yet.",
    draft: "Your episode has been saved as a draft. Readers cannot see it yet.",
    publishedNumber: "Great job! Episode {{number}} is now live and ready for readers to enjoy.",
    published: "Great job! Your episode is now live and ready for readers to enjoy.",
    addNextEpisode: "Add Next Episode",
    storyManager: "Story Manager",
    saving: "Saving...",
    scheduleEpisode: "Schedule Episode",
    saveAsDraft: "Save as Draft",
    publishEpisode: "Publish Episode",
    pleaseLogin: "Please login first.",
    missingEpisodeSave: "Missing episode id. Please go back and save the episode again.",
    chooseSchedule: "Please choose schedule date and time.",
    failedUpdateStatus: "Failed to update episode status",
    cannotConnect: "Cannot connect to backend. Please check deployment.",
    failedSaveStatus: "Failed to save episode status.",
    failedCheckAgreement: "Failed to check publishing agreement.",
    failedSaveAgreement: "Failed to save publishing agreement.",
    goBack: "Go back",
    publish: "Publish",
    editChat: "Edit Chat",
    preview: "Preview",
    storyInfo: "Story Info",
    characters: "Characters",
    chat: "Chat",
    firstEpisode: "First Episode",
    episode: "Episode",
    missingEpisodeNext: "Missing episode id. Please go back to the episode editor and click Next again.",
    adultEpisode: "18+ Episode",
    adultHelp: "Show a warning before readers open this episode.",
    toggleAdult: "Toggle 18+ episode",
    releaseOption: "Release Option",
    releaseHelp: "Choose how this episode should be saved or released.",
    publishNow: "Publish Now",
    publishNowHelp: "Make this episode public immediately.",
    schedule: "Schedule",
    scheduleHelp: "Choose a date and time to publish automatically.",
    draftHelp: "Keep this episode private and finish it later.",
    scheduleDateTime: "Schedule Date & Time",
    scheduleAuto: "The episode will publish automatically at the selected date and time.",
    beforePublishing: "Before publishing",
    freeFirstFive: "Episodes 1–5 are free for readers and do not generate paid income.",
    adultTip: "Use 18+ Episode only when this episode needs a reader warning.",
    manageLater: "You can edit, unpublish, or manage this episode later from Story Manager.",
  },
  km: {
    untitledEpisode: "ភាគគ្មានចំណងជើង",
    episodeScheduled: "បានកំណត់ពេលភាគ!",
    draftSaved: "បានរក្សាទុកព្រាង!",
    storyLive: "រឿងរបស់អ្នកបានបោះផ្សាយហើយ!",
    episodePublished: "បានបោះផ្សាយភាគ!",
    scheduledNumber: "ភាគទី {{number}} ត្រូវបានកំណត់ពេល ហើយនឹងបោះផ្សាយដោយស្វ័យប្រវត្តិតាមម៉ោងដែលបានជ្រើស។",
    scheduled: "ភាគរបស់អ្នកត្រូវបានកំណត់ពេល ហើយនឹងបោះផ្សាយដោយស្វ័យប្រវត្តិតាមម៉ោងដែលបានជ្រើស។",
    draftNumber: "ភាគទី {{number}} ត្រូវបានរក្សាទុកជាព្រាង។ អ្នកអានមិនទាន់អាចមើលឃើញទេ។",
    draft: "ភាគរបស់អ្នកត្រូវបានរក្សាទុកជាព្រាង។ អ្នកអានមិនទាន់អាចមើលឃើញទេ។",
    publishedNumber: "ល្អណាស់! ភាគទី {{number}} បានបោះផ្សាយ ហើយរួចរាល់សម្រាប់អ្នកអាន។",
    published: "ល្អណាស់! ភាគរបស់អ្នកបានបោះផ្សាយ ហើយរួចរាល់សម្រាប់អ្នកអាន។",
    addNextEpisode: "បន្ថែមភាគបន្ទាប់",
    storyManager: "គ្រប់គ្រងរឿង",
    saving: "កំពុងរក្សាទុក...",
    scheduleEpisode: "កំណត់ពេលភាគ",
    saveAsDraft: "រក្សាទុកជាព្រាង",
    publishEpisode: "បោះផ្សាយភាគ",
    pleaseLogin: "សូមចូលគណនីជាមុន។",
    missingEpisodeSave: "បាត់លេខសម្គាល់ភាគ។ សូមត្រឡប់ក្រោយ ហើយរក្សាទុកភាគម្តងទៀត។",
    chooseSchedule: "សូមជ្រើសកាលបរិច្ឆេទ និងម៉ោងកំណត់ពេល។",
    failedUpdateStatus: "មិនអាចអាប់ដេតស្ថានភាពភាគបានទេ",
    cannotConnect: "មិនអាចភ្ជាប់ទៅ Backend បានទេ។ សូមពិនិត្យការដាក់ឱ្យដំណើរការ។",
    failedSaveStatus: "មិនអាចរក្សាទុកស្ថានភាពភាគបានទេ។",
    failedCheckAgreement: "មិនអាចពិនិត្យកិច្ចព្រមព្រៀងបោះផ្សាយបានទេ។",
    failedSaveAgreement: "មិនអាចរក្សាទុកកិច្ចព្រមព្រៀងបោះផ្សាយបានទេ។",
    goBack: "ត្រឡប់ក្រោយ",
    publish: "បោះផ្សាយ",
    editChat: "កែ Chat",
    preview: "មើលជាមុន",
    storyInfo: "ព័ត៌មានរឿង",
    characters: "តួអង្គ",
    chat: "Chat",
    firstEpisode: "ភាគដំបូង",
    episode: "ភាគ",
    missingEpisodeNext: "បាត់លេខសម្គាល់ភាគ។ សូមត្រឡប់ទៅកម្មវិធីកែភាគ ហើយចុច បន្ទាប់ ម្តងទៀត។",
    adultEpisode: "ភាគ 18+",
    adultHelp: "បង្ហាញការព្រមានមុនពេលអ្នកអានបើកភាគនេះ។",
    toggleAdult: "បិទ/បើកភាគ 18+",
    releaseOption: "ជម្រើសបោះផ្សាយ",
    releaseHelp: "ជ្រើសរបៀបរក្សាទុក ឬបោះផ្សាយភាគនេះ។",
    publishNow: "បោះផ្សាយឥឡូវ",
    publishNowHelp: "បោះផ្សាយភាគនេះជាសាធារណៈភ្លាមៗ។",
    schedule: "កំណត់ពេល",
    scheduleHelp: "ជ្រើសកាលបរិច្ឆេទ និងម៉ោងដើម្បីបោះផ្សាយដោយស្វ័យប្រវត្តិ។",
    draftHelp: "រក្សាភាគនេះជាឯកជន ហើយបន្តកែពេលក្រោយ។",
    scheduleDateTime: "កាលបរិច្ឆេទ និងម៉ោងបោះផ្សាយ",
    scheduleAuto: "ភាគនឹងបោះផ្សាយដោយស្វ័យប្រវត្តិតាមកាលបរិច្ឆេទ និងម៉ោងដែលបានជ្រើស។",
    beforePublishing: "មុនបោះផ្សាយ",
    freeFirstFive: "ភាគ 1–5 ឥតគិតថ្លៃសម្រាប់អ្នកអាន ហើយមិនបង្កើតចំណូលបង់ប្រាក់ទេ។",
    adultTip: "ប្រើ ភាគ 18+ តែពេលភាគនេះត្រូវការការព្រមានអ្នកអាន។",
    manageLater: "អ្នកអាចកែ ដកពីការបោះផ្សាយ ឬគ្រប់គ្រងភាគនេះពេលក្រោយពី Story Manager។",
  },
  zh: {
    untitledEpisode: "未命名章节",
    episodeScheduled: "章节已定时！",
    draftSaved: "草稿已保存！",
    storyLive: "你的故事已上线！",
    episodePublished: "章节已发布！",
    scheduledNumber: "第 {{number}} 章已定时，将在所选时间自动发布。",
    scheduled: "章节已定时，将在所选时间自动发布。",
    draftNumber: "第 {{number}} 章已保存为草稿，读者暂时看不到。",
    draft: "章节已保存为草稿，读者暂时看不到。",
    publishedNumber: "很好！第 {{number}} 章已上线，读者现在可以阅读。",
    published: "很好！章节已上线，读者现在可以阅读。",
    addNextEpisode: "添加下一章",
    storyManager: "故事管理",
    saving: "保存中...",
    scheduleEpisode: "定时发布章节",
    saveAsDraft: "保存为草稿",
    publishEpisode: "发布章节",
    pleaseLogin: "请先登录。",
    missingEpisodeSave: "缺少章节 ID，请返回并重新保存章节。",
    chooseSchedule: "请选择定时日期和时间。",
    failedUpdateStatus: "无法更新章节状态",
    cannotConnect: "无法连接后端，请检查部署。",
    failedSaveStatus: "无法保存章节状态。",
    failedCheckAgreement: "无法检查发布协议。",
    failedSaveAgreement: "无法保存发布协议。",
    goBack: "返回",
    publish: "发布",
    editChat: "编辑聊天",
    preview: "预览",
    storyInfo: "故事信息",
    characters: "角色",
    chat: "聊天",
    firstEpisode: "第一章",
    episode: "章节",
    missingEpisodeNext: "缺少章节 ID，请返回章节编辑器并再次点击“下一步”。",
    adultEpisode: "18+ 章节",
    adultHelp: "读者打开此章节前显示警告。",
    toggleAdult: "切换 18+ 章节",
    releaseOption: "发布方式",
    releaseHelp: "选择保存或发布此章节的方式。",
    publishNow: "立即发布",
    publishNowHelp: "立即公开此章节。",
    schedule: "定时发布",
    scheduleHelp: "选择日期和时间自动发布。",
    draftHelp: "将此章节保持为私密草稿，稍后继续编辑。",
    scheduleDateTime: "发布日期与时间",
    scheduleAuto: "章节将在所选日期和时间自动发布。",
    beforePublishing: "发布前",
    freeFirstFive: "第 1–5 章对读者免费，不产生付费收入。",
    adultTip: "仅在章节需要读者警告时启用 18+。",
    manageLater: "之后可在故事管理中编辑、取消发布或管理此章节。",
  },
  ja: {
    untitledEpisode: "無題のエピソード",
    episodeScheduled: "エピソードを予約しました！",
    draftSaved: "下書きを保存しました！",
    storyLive: "ストーリーが公開されました！",
    episodePublished: "エピソードを公開しました！",
    scheduledNumber: "エピソード {{number}} は予約され、選択した時刻に自動公開されます。",
    scheduled: "エピソードは予約され、選択した時刻に自動公開されます。",
    draftNumber: "エピソード {{number}} は下書きとして保存され、まだ読者には表示されません。",
    draft: "エピソードは下書きとして保存され、まだ読者には表示されません。",
    publishedNumber: "エピソード {{number}} が公開され、読者が読めるようになりました。",
    published: "エピソードが公開され、読者が読めるようになりました。",
    addNextEpisode: "次のエピソードを追加",
    storyManager: "ストーリー管理",
    saving: "保存中...",
    scheduleEpisode: "公開を予約",
    saveAsDraft: "下書き保存",
    publishEpisode: "エピソードを公開",
    pleaseLogin: "先にログインしてください。",
    missingEpisodeSave: "エピソード ID がありません。戻ってもう一度保存してください。",
    chooseSchedule: "公開予約の日付と時刻を選択してください。",
    failedUpdateStatus: "エピソード状態を更新できませんでした",
    cannotConnect: "バックエンドに接続できません。デプロイを確認してください。",
    failedSaveStatus: "エピソード状態を保存できませんでした。",
    failedCheckAgreement: "公開同意事項を確認できませんでした。",
    failedSaveAgreement: "公開同意事項を保存できませんでした。",
    goBack: "戻る",
    publish: "公開",
    editChat: "チャットを編集",
    preview: "プレビュー",
    storyInfo: "ストーリー情報",
    characters: "キャラクター",
    chat: "チャット",
    firstEpisode: "最初のエピソード",
    episode: "エピソード",
    missingEpisodeNext: "エピソード ID がありません。エディターに戻り、もう一度「次へ」を押してください。",
    adultEpisode: "18+ エピソード",
    adultHelp: "読者がこのエピソードを開く前に警告を表示します。",
    toggleAdult: "18+ エピソード切替",
    releaseOption: "公開方法",
    releaseHelp: "このエピソードの保存・公開方法を選択します。",
    publishNow: "今すぐ公開",
    publishNowHelp: "このエピソードをすぐに公開します。",
    schedule: "予約",
    scheduleHelp: "日付と時刻を選んで自動公開します。",
    draftHelp: "非公開の下書きとして保存し、後で仕上げます。",
    scheduleDateTime: "公開日時",
    scheduleAuto: "選択した日時にエピソードが自動公開されます。",
    beforePublishing: "公開前の確認",
    freeFirstFive: "エピソード 1～5 は読者に無料で、課金収益は発生しません。",
    adultTip: "読者への警告が必要な場合のみ 18+ を使用してください。",
    manageLater: "後からストーリー管理で編集、非公開化、管理できます。",
  },
  ko: {
    untitledEpisode: "제목 없는 에피소드",
    episodeScheduled: "에피소드 예약 완료!",
    draftSaved: "초안 저장 완료!",
    storyLive: "스토리가 공개되었습니다!",
    episodePublished: "에피소드 게시 완료!",
    scheduledNumber: "에피소드 {{number}}이(가) 예약되었으며 선택한 시간에 자동 게시됩니다.",
    scheduled: "에피소드가 예약되었으며 선택한 시간에 자동 게시됩니다.",
    draftNumber: "에피소드 {{number}}이(가) 초안으로 저장되어 아직 독자에게 보이지 않습니다.",
    draft: "에피소드가 초안으로 저장되어 아직 독자에게 보이지 않습니다.",
    publishedNumber: "에피소드 {{number}}이(가) 공개되어 독자가 읽을 수 있습니다.",
    published: "에피소드가 공개되어 독자가 읽을 수 있습니다.",
    addNextEpisode: "다음 에피소드 추가",
    storyManager: "스토리 관리",
    saving: "저장 중...",
    scheduleEpisode: "에피소드 예약",
    saveAsDraft: "초안으로 저장",
    publishEpisode: "에피소드 게시",
    pleaseLogin: "먼저 로그인해 주세요.",
    missingEpisodeSave: "에피소드 ID가 없습니다. 돌아가서 다시 저장해 주세요.",
    chooseSchedule: "예약 날짜와 시간을 선택해 주세요.",
    failedUpdateStatus: "에피소드 상태를 업데이트하지 못했습니다",
    cannotConnect: "백엔드에 연결할 수 없습니다. 배포 상태를 확인해 주세요.",
    failedSaveStatus: "에피소드 상태를 저장하지 못했습니다.",
    failedCheckAgreement: "게시 동의 여부를 확인하지 못했습니다.",
    failedSaveAgreement: "게시 동의를 저장하지 못했습니다.",
    goBack: "뒤로",
    publish: "게시",
    editChat: "채팅 편집",
    preview: "미리보기",
    storyInfo: "스토리 정보",
    characters: "캐릭터",
    chat: "채팅",
    firstEpisode: "첫 에피소드",
    episode: "에피소드",
    missingEpisodeNext: "에피소드 ID가 없습니다. 에디터로 돌아가 다시 다음을 눌러 주세요.",
    adultEpisode: "18+ 에피소드",
    adultHelp: "독자가 이 에피소드를 열기 전에 경고를 표시합니다.",
    toggleAdult: "18+ 에피소드 전환",
    releaseOption: "게시 옵션",
    releaseHelp: "이 에피소드를 저장하거나 게시할 방법을 선택하세요.",
    publishNow: "지금 게시",
    publishNowHelp: "이 에피소드를 즉시 공개합니다.",
    schedule: "예약",
    scheduleHelp: "날짜와 시간을 선택해 자동 게시합니다.",
    draftHelp: "비공개 초안으로 저장하고 나중에 마무리합니다.",
    scheduleDateTime: "게시 날짜 및 시간",
    scheduleAuto: "선택한 날짜와 시간에 자동으로 게시됩니다.",
    beforePublishing: "게시 전 확인",
    freeFirstFive: "에피소드 1–5는 독자에게 무료이며 유료 수익이 발생하지 않습니다.",
    adultTip: "독자 경고가 필요한 경우에만 18+를 사용하세요.",
    manageLater: "나중에 스토리 관리에서 편집, 게시 취소 또는 관리할 수 있습니다.",
  },
})

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import StoryPublishAgreementModal from '../../components/author/StoryPublishAgreementModal'
import ScheduleReleasePicker from '../../components/author/ScheduleReleasePicker'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
          active ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
        }`}
      >
        {number}
      </div>
      <div className={`line-clamp-1 text-[12px] font-extrabold ${active ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'}`}>
        {title}
      </div>
    </div>
  )
}

function Toggle({ checked, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-[#e5484d]' : 'bg-[var(--shadow-bg-soft)]'}`}
      aria-label={label}
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-[var(--shadow-bg-surface)] shadow transition ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  )
}

function OptionCard({ active, icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[20px] border p-4 text-left transition active:scale-[0.99] ${
        active
          ? 'border-[var(--shadow-border-strong)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] shadow-sm'
          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm'
      }`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${active ? 'bg-[var(--shadow-bg-surface)]/15 text-white' : 'bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]'}`}>
        <i className={`${icon} text-[15px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-extrabold">{title}</div>
        <div className={`mt-0.5 text-[11.5px] leading-4 ${active ? 'text-white/75' : 'text-[var(--shadow-text-tertiary)]'}`}>
          {subtitle}
        </div>
      </div>

      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-white bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]' : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-white'}`}>
        {active ? <i className="fa-solid fa-check text-[10px]" /> : null}
      </div>
    </button>
  )
}

function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/10 px-6"
    >
      <div className="max-w-[360px] rounded-[18px] bg-[var(--shadow-bg-surface)] px-5 py-4 text-center text-[14px] font-bold leading-6 text-[var(--shadow-text-primary)] shadow-2xl">
        {message}
      </div>
    </button>
  )
}

function ConfettiPiece({ className }) {
  return <span className={`absolute block h-2 w-2 rounded-full ${className}`} />
}

export function SuccessModal({
  open,
  isFirstEpisode,
  releaseOption,
  episodeNumber,
  episodeTitle,
  isManga,
  onStoryManager,
  isChatStory = false,
  onAddEpisode,
}) {
  useDisplayTranslation()
  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement

    const oldBodyOverflow = body.style.overflow
    const oldBodyPosition = body.style.position
    const oldBodyTop = body.style.top
    const oldBodyWidth = body.style.width
    const oldHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = oldBodyOverflow
      body.style.position = oldBodyPosition
      body.style.top = oldBodyTop
      body.style.width = oldBodyWidth
      html.style.overflow = oldHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  const isScheduled = releaseOption === 'schedule'
  const isDraft = releaseOption === 'draft'

  const parsedEpisodeNumber = Number(episodeNumber)
  const resolvedEpisodeNumber =
    Number.isFinite(parsedEpisodeNumber) && parsedEpisodeNumber > 0
      ? parsedEpisodeNumber
      : isFirstEpisode
        ? 1
        : null

  const cleanEpisodeTitle = String(episodeTitle || '').trim()

  const episodeLabel = cleanEpisodeTitle || getDisplayText('publishEpisode.untitledEpisode')

  const heading = isScheduled
    ? getDisplayText('publishEpisode.episodeScheduled')
    : isDraft
      ? getDisplayText('publishEpisode.draftSaved')
      : isFirstEpisode
        ? getDisplayText('publishEpisode.storyLive')
        : getDisplayText('publishEpisode.episodePublished')

  const description = isScheduled
    ? resolvedEpisodeNumber
      ? getDisplayText('publishEpisode.scheduledNumber', { number: resolvedEpisodeNumber })
      : getDisplayText('publishEpisode.scheduled')
    : isDraft
      ? resolvedEpisodeNumber
        ? getDisplayText('publishEpisode.draftNumber', { number: resolvedEpisodeNumber })
        : getDisplayText('publishEpisode.draft')
      : resolvedEpisodeNumber
        ? getDisplayText('publishEpisode.publishedNumber', { number: resolvedEpisodeNumber })
        : getDisplayText('publishEpisode.published')

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/45 px-4">
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[26px] bg-[var(--shadow-bg-surface)] shadow-2xl animate-[successPop_0.28s_ease-out]">
        <style>
          {`
            @keyframes successPop {
              0% {
                transform: scale(0.92);
                opacity: 0;
              }

              100% {
                transform: scale(1);
                opacity: 1;
              }
            }

            @keyframes rocketFloat {
              0%, 100% {
                transform: translateY(0);
              }

              50% {
                transform: translateY(-7px);
              }
            }

            @keyframes confettiDrop {
              0% {
                transform: translateY(-20px) rotate(0deg);
                opacity: 0;
              }

              25% {
                opacity: 1;
              }

              100% {
                transform: translateY(105px) rotate(220deg);
                opacity: 0;
              }
            }
          `}
        </style>

        <div className="relative h-[175px] overflow-hidden bg-gradient-to-b from-[#EEE5FF] via-[#F8F4FF] to-[var(--shadow-bg-surface)]">
          {!isDraft ? (
            <div className="pointer-events-none absolute inset-0">
              <ConfettiPiece className="left-[10%] top-4 bg-[#A855F7] animate-[confettiDrop_1.2s_ease-out_0.05s_both]" />
              <ConfettiPiece className="left-[21%] top-1 bg-[#F97316] animate-[confettiDrop_1.35s_ease-out_0.14s_both]" />
              <ConfettiPiece className="left-[34%] top-5 bg-[#EC4899] animate-[confettiDrop_1.15s_ease-out_0.08s_both]" />
              <ConfettiPiece className="left-[65%] top-2 bg-[#7C3AED] animate-[confettiDrop_1.3s_ease-out_0.16s_both]" />
              <ConfettiPiece className="left-[79%] top-6 bg-[#FB7185] animate-[confettiDrop_1.18s_ease-out_0.04s_both]" />
              <ConfettiPiece className="left-[90%] top-3 bg-[#F59E0B] animate-[confettiDrop_1.28s_ease-out_0.12s_both]" />
            </div>
          ) : null}


          <img
            src="/assets/Icons/Picture/Rocket.webp"
            alt=""
            className="relative z-10 mx-auto h-[165px] w-[250px] object-contain animate-[rocketFloat_2.8s_ease-in-out_infinite]"
          />
        </div>

        <div className="px-5 pb-5 text-center">
          <h2 className={`text-[22px] font-bold ${isManga ? 'text-[#FE526E]' : 'text-[var(--shadow-text-primary)]'}`}>
            {heading}
          </h2>

          <div
            className="mx-auto mt-2 w-full max-w-[300px] truncate text-[14px] font-medium text-[#8B3DFF]"
            title={episodeLabel}
          >
            {episodeLabel}
          </div>

          <div className="mx-auto mt-3 h-px w-[150px] bg-gradient-to-r from-transparent via-[#C4B5FD] to-transparent" />

          <p className="mx-auto mt-4 max-w-[290px] text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
            {description}
          </p>

          <button
            type="button"
            onClick={onAddEpisode}
            className={`mt-5 h-12 w-full rounded-[14px] px-4 text-[13px] font-semibold text-white transition active:scale-[0.98] ${
  isManga
  ? 'bg-[#FE526E]'
  : isChatStory
    ? 'bg-gradient-to-r from-[#6D28D9] via-[#8B3DFF] to-[#A855F7]'
     : 'bg-[var(--shadow-text-primary)]'
}`}
          >
            {getDisplayText('publishEpisode.addNextEpisode')}
          </button>

          <button
            type="button"
            onClick={onStoryManager}
            className="mt-3 h-12 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[13px] font-semibold text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
          >
            {getDisplayText('publishEpisode.storyManager')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PublishEpisodePage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()

  const episodeId = searchParams.get('episodeId') || searchParams.get('episode_id')
  const isFirstEpisode = searchParams.get('first') !== '0'
  const isChatStory = searchParams.get('type') === 'chat_story'
  const isManga = searchParams.get('type') === 'manga'

  const [isAdultEpisode, setIsAdultEpisode] = useState(false)
  const [releaseOption, setReleaseOption] = useState('publish')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [toast, setToast] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreementOpen, setAgreementOpen] = useState(false)
  const [agreementSaving, setAgreementSaving] = useState(false)
  const displayLanguageId = getDisplayLanguageId()

  const actionText = useMemo(() => {
    if (loading) return getDisplayText('publishEpisode.saving')
    if (releaseOption === 'schedule') return getDisplayText('publishEpisode.scheduleEpisode')
    if (releaseOption === 'draft') return getDisplayText('publishEpisode.saveAsDraft')
    return getDisplayText('publishEpisode.publishEpisode')
  }, [releaseOption, loading, displayLanguageId])

  const actionIcon = useMemo(() => {
    if (releaseOption === 'schedule') return 'fa-regular fa-calendar'
    if (releaseOption === 'draft') return 'fa-regular fa-file-lines'
    return 'fa-solid fa-paper-plane'
  }, [releaseOption])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const handlePreview = () => {
  const path = isChatStory
    ? `/author/story/${storyId}/chat/editor?episodeId=${episodeId || ''}`
    : `/author/story/${storyId}/episode/preview?episodeId=${episodeId || ''}`
  navigate(path)
}
  const getApiStatus = () => {
    if (releaseOption === 'schedule') return 'scheduled'
    if (releaseOption === 'draft') return 'draft'
    return 'published'
  }

  const getScheduledAt = () => {
    if (releaseOption !== 'schedule') return null
    if (!scheduleDate || !scheduleTime) return null
    return new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
  }

  const updateEpisodeStatus = async () => {
    const token =
      localStorage.getItem('shadow_reader_token') ||
      sessionStorage.getItem('shadow_reader_token') ||
      ''

    if (!token) {
      navigate('/login')
      throw new Error(getDisplayText('publishEpisode.pleaseLogin'))
    }

    if (!episodeId) {
      throw new Error(getDisplayText('publishEpisode.missingEpisodeSave'))
    }

    const status = getApiStatus()
    const scheduledAt = getScheduledAt()

    if (status === 'scheduled' && !scheduledAt) {
      throw new Error(getDisplayText('publishEpisode.chooseSchedule'))
    }

    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes/${episodeId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        scheduled_at: scheduledAt,
        is_adult: isAdultEpisode,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
  const blockedWords = data.blocked_words_found || data.blockedWordsFound || []

  if (data.code === 'BLOCKED_WORDS_FOUND' || blockedWords.length) {
    navigate(`/author/story/${storyId}/episode/publish-warning`, {
      replace: true,
      state: {
        episodeId,
        blockedWords,
      },
    })
    return null
  }

  throw new Error(data.message || getDisplayText('publishEpisode.failedUpdateStatus'))
}

    return data
  }

  const submitEpisodeStatus = async () => {
  try {
    setLoading(true)

    const result = await updateEpisodeStatus()

    if (!result) return

    setSuccessOpen(true)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? getDisplayText('publishEpisode.cannotConnect')
        : error.message || getDisplayText('publishEpisode.failedSaveStatus')
    )
  } finally {
    setLoading(false)
  }
}

const handleSubmit = async () => {
  if (loading || agreementSaving) return

  if (!isFirstEpisode || releaseOption === 'draft') {
    await submitEpisodeStatus()
    return
  }

  if (!episodeId) {
    showToast(getDisplayText('publishEpisode.missingEpisodeSave'))
    return
  }

  if (releaseOption === 'schedule' && !getScheduledAt()) {
    showToast(getDisplayText('publishEpisode.chooseSchedule'))
    return
  }

  try {
    setLoading(true)

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/publish-agreement`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('publishEpisode.failedCheckAgreement'))
    }

    if (data.accepted) {
      const result = await updateEpisodeStatus()

      if (!result) return

      setSuccessOpen(true)
      return
    }

    setAgreementOpen(true)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? getDisplayText('publishEpisode.cannotConnect')
        : error.message || getDisplayText('publishEpisode.failedCheckAgreement')
    )
  } finally {
    setLoading(false)
  }
}

const handleAcceptAgreement = async (agreement) => {
  try {
    setAgreementSaving(true)

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/publish-agreement`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreement),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false || !data.accepted) {
      throw new Error(data.message || getDisplayText('publishEpisode.failedSaveAgreement'))
    }

    setAgreementOpen(false)
    await submitEpisodeStatus()
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? getDisplayText('publishEpisode.cannotConnect')
        : error.message || getDisplayText('publishEpisode.failedSaveAgreement')
    )
  } finally {
    setAgreementSaving(false)
  }
}

  const navigateAfterSuccess = (targetPath) => {
    navigate('/author/dashboard', { replace: true })

    window.setTimeout(() => {
      navigate(targetPath)
    }, 0)
  }

  return (
    <div
      className={`min-h-screen bg-[var(--shadow-bg-page)] pb-[110px] ${
        isManga ? 'manga-red-theme' : ''
      }`}
    >
      <style>{`
  .manga-red-theme button:not(:disabled)[class*="bg-[var(--shadow-text-primary)]"],
  .manga-red-theme button:not(:disabled)[class*="bg-[#0b5cff]"],
  .manga-red-theme button:not(:disabled)[class*="bg-[#e5484d]"] {
    background-color: #FE526E !important;
  }

  .manga-red-theme button[class*="border-[var(--shadow-border-strong)]"] {
    border-color: #FE526E !important;
  }

  .manga-red-theme
    button:not(:disabled)[class*="shadow-[0_14px_30px_rgba(17,24,39,0.25)]"] {
    box-shadow: 0 14px 30px rgba(254, 82, 110, 0.28) !important;
  }

  @keyframes mangaSoftPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 14px 30px rgba(254, 82, 110, 0.22);
    }

    50% {
      transform: scale(1.025);
      box-shadow: 0 18px 38px rgba(254, 82, 110, 0.34);
    }
  }

  .manga-red-theme button[class*="animate-[softPulse"] {
    animation: mangaSoftPulse 1.8s ease-in-out infinite !important;
  }
`}</style>

      <StoryPublishAgreementModal
  open={agreementOpen}
  saving={agreementSaving}
  onClose={() => setAgreementOpen(false)}
  onConfirm={handleAcceptAgreement}
/>

      <Toast message={toast} onClose={() => setToast('')} />

      <SuccessModal
  open={successOpen}
  isManga={isManga}
  isChatStory={isChatStory}
  isFirstEpisode={isFirstEpisode}
  releaseOption={releaseOption}
  onStoryManager={() => {
    navigate('/author/dashboard', { replace: true })
    setTimeout(() => {
      navigate(`/author/story/${storyId}/manage`)
    }, 0)
  }}
  onAddEpisode={() => {
  const path = isChatStory
    ? `/author/story/${storyId}/chat/editor?new=1&first=0`
    : `/author/story/${storyId}/episode/create?first=0&fromPublishSuccess=1&type=${
        isManga ? 'manga' : 'novel'
      }`
  navigate('/author/dashboard', { replace: true })
  setTimeout(() => navigate(path), 0)
}}
/>

      <header className="sticky top-0 z-50 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/author/dashboard', { replace: true })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={getDisplayText('publishEpisode.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{getDisplayText('publishEpisode.publish')}</h1>

          <button
            type="button"
            onClick={handlePreview}
            className="rounded-full bg-[var(--shadow-bg-page)] px-3.5 py-2 text-[11.5px] font-extrabold text-[var(--shadow-text-primary)] active:scale-95"
          >
            {isChatStory ? getDisplayText('publishEpisode.editChat') : getDisplayText('publishEpisode.preview')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="hidden rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)] sm:block">
  <div className={`grid gap-2 ${isChatStory ? 'grid-cols-4' : 'grid-cols-3'}`}>
    <Step number="1" title={getDisplayText('publishEpisode.storyInfo')} />

    {isChatStory ? (
      <>
        <Step number="2" title={getDisplayText('publishEpisode.characters')} />
        <Step number="3" title={getDisplayText('publishEpisode.chat')} />
        <Step number="4" title={getDisplayText('publishEpisode.publish')} active />
      </>
    ) : (
      <>
        <Step number="2" title={isFirstEpisode ? getDisplayText('publishEpisode.firstEpisode') : getDisplayText('publishEpisode.episode')} />
        <Step number="3" title={getDisplayText('publishEpisode.publish')} active />
      </>
    )}
  </div>
</section>

        {!episodeId ? (
          <section className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {getDisplayText('publishEpisode.missingEpisodeNext')}
          </section>
        ) : null}

        <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-center justify-between gap-4 rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3">
            <div>
              <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('publishEpisode.adultEpisode')}</div>
              <div className="mt-0.5 text-[11px] leading-4 text-[var(--shadow-text-tertiary)]">
                {getDisplayText('publishEpisode.adultHelp')}
              </div>
            </div>

            <Toggle
              checked={isAdultEpisode}
              onClick={() => setIsAdultEpisode((value) => !value)}
              label={getDisplayText('publishEpisode.toggleAdult')}
            />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mb-4">
            <h2 className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('publishEpisode.releaseOption')}</h2>
            <p className="mt-1 text-[12px] text-[var(--shadow-text-tertiary)]">{getDisplayText('publishEpisode.releaseHelp')}</p>
          </div>

          <div className="space-y-3">
            <OptionCard
              active={releaseOption === 'publish'}
              icon="fa-solid fa-paper-plane"
              title={getDisplayText('publishEpisode.publishNow')}
              subtitle={getDisplayText('publishEpisode.publishNowHelp')}
              onClick={() => setReleaseOption('publish')}
            />

            <OptionCard
              active={releaseOption === 'schedule'}
              icon="fa-regular fa-calendar"
              title={getDisplayText('publishEpisode.schedule')}
              subtitle={getDisplayText('publishEpisode.scheduleHelp')}
              onClick={() => setReleaseOption('schedule')}
            />

            <OptionCard
              active={releaseOption === 'draft'}
              icon="fa-regular fa-file-lines"
              title={getDisplayText('publishEpisode.saveAsDraft')}
              subtitle={getDisplayText('publishEpisode.draftHelp')}
              onClick={() => setReleaseOption('draft')}
            />
          </div>

{releaseOption === 'schedule' ? (
            <div className="mt-5 rounded-[20px] bg-[var(--shadow-bg-soft)] p-4">
              <div className="mb-3 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
                {getDisplayText('publishEpisode.scheduleDateTime')}
              </div>

              <ScheduleReleasePicker
                date={scheduleDate}
                time={scheduleTime}
                onDateChange={setScheduleDate}
                onTimeChange={setScheduleTime}
              />

              <p className="mt-3 text-[11.5px] leading-5 text-[var(--shadow-text-tertiary)]">
                {getDisplayText('publishEpisode.scheduleAuto')}
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <h2 className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('publishEpisode.beforePublishing')}</h2>

          <div className="mt-4 space-y-3 text-[12.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
            {isFirstEpisode ? (
              <div className="flex gap-3">
                <i className="fa-solid fa-check mt-1 text-[12px] text-[#16803c]" />
                <span>{getDisplayText('publishEpisode.freeFirstFive')}</span>
              </div>
            ) : null}

            <div className="flex gap-3">
              <i className="fa-solid fa-check mt-1 text-[12px] text-[#16803c]" />
              <span>{getDisplayText('publishEpisode.adultTip')}</span>
            </div>

            <div className="flex gap-3">
              <i className="fa-solid fa-check mt-1 text-[12px] text-[#16803c]" />
              <span>{getDisplayText('publishEpisode.manageLater')}</span>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 pb-8">
          <button
            type="button"
            onClick={handlePreview}
            disabled={loading}
            className="flex h-14 items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-extrabold text-[var(--shadow-text-primary)] shadow-sm active:scale-[0.99] disabled:opacity-60"
          >
            {isChatStory ? getDisplayText('publishEpisode.editChat') : getDisplayText('publishEpisode.preview')}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !episodeId}
            className="flex h-14 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[14px] font-extrabold text-[var(--shadow-bg-surface)] shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
          >
            <i className={`${actionIcon} mr-2 text-[12px]`} />
            {actionText}
          </button>
        </section>
      </main>
    </div>
  )
}

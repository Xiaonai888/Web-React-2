import { useEffect, useState } from 'react'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyPublishAgreement', {
  en: {
    closeAgreement: "Close publishing agreement",
    heading: "Before publishing your first episode",
    help: "Please confirm both items. This is required only once for this story.",
    original: "I confirm this story is my original work and I have the right to publish it.",
    agreement: "I agree to the Shadow Author Agreement.",
    saving: "Saving...",
    continuePublish: "Continue to Publish",
  },
  km: {
    closeAgreement: "បិទកិច្ចព្រមព្រៀងបោះផ្សាយ",
    heading: "មុនបោះផ្សាយភាគដំបូងរបស់អ្នក",
    help: "សូមបញ្ជាក់ទាំងពីរចំណុច។ វាត្រូវការតែម្តងសម្រាប់រឿងនេះ។",
    original: "ខ្ញុំបញ្ជាក់ថារឿងនេះជាស្នាដៃដើមរបស់ខ្ញុំ ហើយខ្ញុំមានសិទ្ធិបោះផ្សាយវា។",
    agreement: "ខ្ញុំយល់ព្រមនឹងកិច្ចព្រមព្រៀងអ្នកនិពន្ធរបស់ Shadow។",
    saving: "កំពុងរក្សាទុក...",
    continuePublish: "បន្តទៅបោះផ្សាយ",
  },
  zh: {
    closeAgreement: "关闭发布协议",
    heading: "发布第一章之前",
    help: "请确认以下两项。每个故事只需确认一次。",
    original: "我确认这是我的原创作品，并且我有权发布。",
    agreement: "我同意 Shadow 作者协议。",
    saving: "保存中...",
    continuePublish: "继续发布",
  },
  ja: {
    closeAgreement: "公開同意事項を閉じる",
    heading: "最初のエピソードを公開する前に",
    help: "2項目を確認してください。このストーリーでは一度だけ必要です。",
    original: "このストーリーが自分のオリジナル作品であり、公開する権利があることを確認します。",
    agreement: "Shadow 作者規約に同意します。",
    saving: "保存中...",
    continuePublish: "公開へ進む",
  },
  ko: {
    closeAgreement: "게시 동의 창 닫기",
    heading: "첫 에피소드를 게시하기 전에",
    help: "두 항목을 모두 확인해 주세요. 이 스토리에서는 한 번만 필요합니다.",
    original: "이 스토리가 제 창작물이며 게시할 권리가 있음을 확인합니다.",
    agreement: "Shadow 작가 약관에 동의합니다.",
    saving: "저장 중...",
    continuePublish: "게시 계속",
  },
})


export default function StoryPublishAgreementModal({
  open,
  saving,
  onClose,
  onConfirm,
}) {
  useDisplayTranslation()
  const [originalWorkConfirmed, setOriginalWorkConfirmed] = useState(false)
  const [authorAgreementAccepted, setAuthorAgreementAccepted] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    setOriginalWorkConfirmed(false)
    setAuthorAgreementAccepted(false)

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

  const canContinue =
    originalWorkConfirmed && authorAgreementAccepted && !saving

  return (
    <div className="fixed inset-0 z-[280] flex items-end justify-center sm:items-center sm:px-4">
      <button
        type="button"
        aria-label={getDisplayText('storyPublishAgreement.closeAgreement')}
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section className="relative w-full rounded-t-[22px] bg-[var(--shadow-bg-surface)] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:max-w-[440px] sm:rounded-[18px] sm:p-6">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[var(--shadow-border-strong)] sm:hidden" />

        <h2 className="text-[17px] font-normal text-[var(--shadow-text-primary)]">
          {getDisplayText('storyPublishAgreement.heading')}
        </h2>

        <p className="mt-2 text-[12px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
          {getDisplayText('storyPublishAgreement.help')}
        </p>

        <div className="mt-5 space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-[12px] bg-[var(--shadow-bg-soft)] px-4 py-3.5">
            <input
              type="checkbox"
              checked={originalWorkConfirmed}
              onChange={(event) =>
                setOriginalWorkConfirmed(event.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--shadow-text-primary)]"
            />

            <span className="text-[12.5px] font-normal leading-5 text-[var(--shadow-text-primary)]">
              {getDisplayText('storyPublishAgreement.original')}
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-[12px] bg-[var(--shadow-bg-soft)] px-4 py-3.5">
            <input
              type="checkbox"
              checked={authorAgreementAccepted}
              onChange={(event) =>
                setAuthorAgreementAccepted(event.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--shadow-text-primary)]"
            />

            <span className="text-[12.5px] font-normal leading-5 text-[var(--shadow-text-primary)]">
              {getDisplayText('storyPublishAgreement.agreement')}
            </span>
          </label>
        </div>

        <button
          type="button"
          disabled={!canContinue}
          onClick={() =>
            onConfirm({
              original_work_confirmed: originalWorkConfirmed,
              author_agreement_accepted: authorAgreementAccepted,
            })
          }
          className="mt-5 h-12 w-full rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-normal text-[var(--shadow-bg-surface)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
        >
          {saving ? getDisplayText('storyPublishAgreement.saving') : getDisplayText('storyPublishAgreement.continuePublish')}
        </button>
      </section>
    </div>
  )
}

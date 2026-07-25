import { useEffect, useState } from 'react'

export default function StoryPublishAgreementModal({
  open,
  saving,
  onClose,
  onConfirm,
}) {
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
        aria-label="Close publishing agreement"
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section className="relative w-full rounded-t-[22px] bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:max-w-[440px] sm:rounded-[18px] sm:p-6">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#d9dce4] sm:hidden" />

        <h2 className="text-[17px] font-normal text-[#111827]">
          Before publishing your first episode
        </h2>

        <p className="mt-2 text-[12px] font-normal leading-5 text-[#8d94a1]">
          Please confirm both items. This is required only once for this story.
        </p>

        <div className="mt-5 space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-[12px] bg-[#f8f8fa] px-4 py-3.5">
            <input
              type="checkbox"
              checked={originalWorkConfirmed}
              onChange={(event) =>
                setOriginalWorkConfirmed(event.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#111827]"
            />

            <span className="text-[12.5px] font-normal leading-5 text-[#333842]">
              I confirm this story is my original work and I have the right to
              publish it.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-[12px] bg-[#f8f8fa] px-4 py-3.5">
            <input
              type="checkbox"
              checked={authorAgreementAccepted}
              onChange={(event) =>
                setAuthorAgreementAccepted(event.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#111827]"
            />

            <span className="text-[12.5px] font-normal leading-5 text-[#333842]">
              I agree to the Shadow Author Agreement.
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
          className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[13px] font-normal text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#c7cbd3]"
        >
          {saving ? 'Saving...' : 'Continue to Publish'}
        </button>
      </section>
    </div>
  )
}

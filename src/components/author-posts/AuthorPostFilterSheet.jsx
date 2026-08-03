import { useEffect, useState } from 'react'

function formatDate(value) {
  return value ? value.replaceAll('-', '/') : 'Select date'
}

function getTodayValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AuthorPostFilterSheet({
  open,
  value,
  onClose,
  onApply,
  onClear,
}) {
  const [draft, setDraft] = useState(value || '')

  useEffect(() => {
    if (!open) return
    setDraft(value || getTodayValue())
  }, [open, value])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const today = getTodayValue()

  function handleDone() {
    if (!draft) return
    onApply?.(draft)
    onClose?.()
  }

  function handleClear() {
    setDraft('')
    onClear?.()
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[320] flex items-end">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Close post filters"
      />

      <section className="relative z-10 w-full rounded-t-[28px] bg-white px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-[#8b9199]" />

        <h2 className="py-6 text-center text-[24px] font-semibold text-[#111827]">
          Post filters
        </h2>

        <div className="border-t border-[#e5e7eb] pt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[#111827]">
              <i className="fa-regular fa-calendar-days text-[28px]" />
              <span className="text-[21px] font-normal">Go to:</span>
            </div>

            <label className="relative flex h-14 min-w-[150px] items-center justify-center gap-3 rounded-[16px] bg-[#e9edf2] px-4 text-[18px] font-medium text-[#111827]">
              <span>{formatDate(draft)}</span>
              <i className="fa-solid fa-caret-down text-[16px]" />
              <input
                type="date"
                value={draft}
                max={today}
                onChange={(event) => setDraft(event.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Choose post date"
              />
            </label>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="h-[52px] rounded-[15px] bg-[#e9edf2] text-[18px] font-medium text-[#111827] active:scale-[0.99]"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleDone}
              disabled={!draft}
              className="h-[52px] rounded-[15px] bg-[#111827] text-[18px] font-semibold text-white active:scale-[0.99] disabled:bg-[#d1d5db] disabled:text-[#9ca3af]"
            >
              Done
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

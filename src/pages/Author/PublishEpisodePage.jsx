import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
          active ? 'bg-[#111827] text-white' : 'bg-[#f2f4f7] text-[#667085]'
        }`}
      >
        {number}
      </div>
      <div className={`line-clamp-1 text-[12px] font-extrabold ${active ? 'text-[#111827]' : 'text-[#98a2b3]'}`}>
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
      className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-[#e5484d]' : 'bg-[#d0d5dd]'}`}
      aria-label={label}
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'left-7' : 'left-1'}`} />
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
          ? 'border-[#111827] bg-[#111827] text-white shadow-sm'
          : 'border-[#eceaf2] bg-white text-[#111827] shadow-sm'
      }`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${active ? 'bg-white/15 text-white' : 'bg-[#f5f3fa] text-[#111827]'}`}>
        <i className={`${icon} text-[15px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-extrabold">{title}</div>
        <div className={`mt-0.5 text-[11.5px] leading-4 ${active ? 'text-white/75' : 'text-[#8d94a1]'}`}>
          {subtitle}
        </div>
      </div>

      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-white bg-white text-[#111827]' : 'border-[#d0d5dd] bg-white text-white'}`}>
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
      <div className="max-w-[360px] rounded-[18px] bg-white px-5 py-4 text-center text-[14px] font-bold leading-6 text-[#111827] shadow-2xl">
        {message}
      </div>
    </button>
  )
}

export default function PublishEpisodePage() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const [isAdultEpisode, setIsAdultEpisode] = useState(false)
  const [releaseOption, setReleaseOption] = useState('publish')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [toast, setToast] = useState('')

  const actionText = useMemo(() => {
    if (releaseOption === 'schedule') return 'Schedule Episode'
    if (releaseOption === 'draft') return 'Save as Draft'
    return 'Publish Episode'
  }, [releaseOption])

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
    navigate(`/author/story/${storyId}/episode/preview`)
  }

  const handleSubmit = () => {
    if (releaseOption === 'schedule' && (!scheduleDate || !scheduleTime)) {
      showToast('Please choose schedule date and time.')
      return
    }

    if (releaseOption === 'schedule') {
      showToast('Episode scheduled.')
      window.setTimeout(() => navigate(`/author/story/${storyId}/manage`), 700)
      return
    }

    if (releaseOption === 'draft') {
      showToast('Episode saved as draft.')
      window.setTimeout(() => navigate(`/author/story/${storyId}/manage`), 700)
      return
    }

    showToast('Episode published.')
    window.setTimeout(() => navigate(`/author/story/${storyId}/manage`), 700)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <Toast message={toast} onClose={() => setToast('')} />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Publish</h1>

          <button
            type="button"
            onClick={handlePreview}
            className="rounded-full bg-[#f5f3fa] px-3.5 py-2 text-[11.5px] font-extrabold text-[#111827] active:scale-95"
          >
            Preview
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-3 gap-2">
            <Step number="1" title="Story Info" />
            <Step number="2" title="First Episode" />
            <Step number="3" title="Publish" active />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-4 rounded-[18px] bg-[#fafafe] px-4 py-3">
            <div>
              <div className="text-[13px] font-extrabold text-[#111827]">18+ Episode</div>
              <div className="mt-0.5 text-[11px] leading-4 text-[#8d94a1]">
                Show a warning before readers open this episode.
              </div>
            </div>

            <Toggle
              checked={isAdultEpisode}
              onClick={() => setIsAdultEpisode((value) => !value)}
              label="Toggle 18+ episode"
            />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-4">
            <h2 className="text-[16px] font-extrabold text-[#111827]">Release Option</h2>
            <p className="mt-1 text-[12px] text-[#8d94a1]">Choose how this episode should be saved or released.</p>
          </div>

          <div className="space-y-3">
            <OptionCard
              active={releaseOption === 'publish'}
              icon="fa-solid fa-paper-plane"
              title="Publish Now"
              subtitle="Make this episode public immediately."
              onClick={() => setReleaseOption('publish')}
            />

            <OptionCard
              active={releaseOption === 'schedule'}
              icon="fa-regular fa-calendar"
              title="Schedule"
              subtitle="Choose a date and time to publish automatically."
              onClick={() => setReleaseOption('schedule')}
            />

            <OptionCard
              active={releaseOption === 'draft'}
              icon="fa-regular fa-file-lines"
              title="Save as Draft"
              subtitle="Keep this episode private and finish it later."
              onClick={() => setReleaseOption('draft')}
            />
          </div>

          {releaseOption === 'schedule' ? (
            <div className="mt-5 rounded-[20px] bg-[#fafafe] p-4">
              <div className="mb-3 text-[13px] font-extrabold text-[#111827]">Schedule Date & Time</div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>
                  <div className="mb-2 text-[12px] font-extrabold text-[#555b66]">Date</div>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(event) => setScheduleDate(event.target.value)}
                    className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
                  />
                </label>

                <label>
                  <div className="mb-2 text-[12px] font-extrabold text-[#555b66]">Time</div>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(event) => setScheduleTime(event.target.value)}
                    className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
                  />
                </label>
              </div>

              <p className="mt-3 text-[11.5px] leading-5 text-[#8d94a1]">
                The episode will publish automatically at the selected date and time.
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="text-[16px] font-extrabold text-[#111827]">Before publishing</h2>

          <div className="mt-4 space-y-3 text-[12.5px] font-semibold leading-5 text-[#555b66]">
            <div className="flex gap-3">
              <i className="fa-solid fa-check mt-1 text-[12px] text-[#16803c]" />
              <span>The first episode is free for readers and does not generate income.</span>
            </div>

            <div className="flex gap-3">
              <i className="fa-solid fa-check mt-1 text-[12px] text-[#16803c]" />
              <span>Use 18+ Episode only when this episode needs a reader warning.</span>
            </div>

            <div className="flex gap-3">
              <i className="fa-solid fa-check mt-1 text-[12px] text-[#16803c]" />
              <span>You can edit, unpublish, or manage this episode later from Story Manager.</span>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 pb-8">
          <button
            type="button"
            onClick={handlePreview}
            className="flex h-14 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] shadow-sm active:scale-[0.99]"
          >
            Preview
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99]"
          >
            <i className={`${actionIcon} mr-2 text-[12px]`} />
            {actionText}
          </button>
        </section>
      </main>
    </div>
  )
}

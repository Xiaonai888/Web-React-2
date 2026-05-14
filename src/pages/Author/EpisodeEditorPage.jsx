import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const MIN_CHARACTERS = 1500
const MAX_CHARACTERS = 12000

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

function ToolButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-[#eceaf2] active:scale-95"
      aria-label={label}
    >
      <i className={`${icon} text-[14px]`} />
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

function UnsavedChangesModal({ open, onKeepEditing, onDiscard, onSaveDraft }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-5 text-center shadow-2xl">
        <h2 className="text-[18px] font-extrabold text-[#111827]">Unsaved Changes</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#555b66]">
          This episode has unsaved edits. Save your draft or discard your changes.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onKeepEditing}
            className="rounded-full border border-[#e4e7ec] bg-white px-3 py-2.5 text-[12px] font-extrabold text-[#111827] active:scale-95"
          >
            Keep Editing
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="rounded-full border border-[#f0b8b8] bg-white px-3 py-2.5 text-[12px] font-extrabold text-[#c04444] active:scale-95"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-full bg-[#111827] px-3 py-2.5 text-[12px] font-extrabold text-white active:scale-95"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EpisodeEditorPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeCover, setEpisodeCover] = useState('')
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [toast, setToast] = useState('')

  const characterCount = content.length

  const estimatedReadTime = useMemo(() => {
    const minutes = Math.max(1, Math.ceil(characterCount / 900))
    return `${minutes} min read`
  }, [characterCount])

  const warningText = useMemo(() => {
    if (characterCount === 0) return ''
    if (characterCount < MIN_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MIN_CHARACTERS.toLocaleString()} characters required to publish`
    }
    if (characterCount > MAX_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters. Please shorten this episode.`
    }
    return ''
  }, [characterCount])

  const isValidForNext = characterCount >= MIN_CHARACTERS && characterCount <= MAX_CHARACTERS && episodeTitle.trim()

  const handleContentChange = (event) => {
    setContent(event.target.value)
    setSaveStatus('Unsaved')
    setHasUnsavedChanges(true)
  }

  const handleTitleChange = (event) => {
    setEpisodeTitle(event.target.value)
    setSaveStatus('Unsaved')
    setHasUnsavedChanges(true)
  }

  const handleCoverChange = (file) => {
    if (!file) return
    setEpisodeCover(URL.createObjectURL(file))
    setSaveStatus('Unsaved')
    setHasUnsavedChanges(true)
  }

  const handleSaveDraft = () => {
    setSaveStatus('Saved')
    setHasUnsavedChanges(false)
    setToast('Draft saved.')
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitModal(true)
      return
    }

    navigate(-1)
  }

  const handleDiscard = () => {
    setShowExitModal(false)
    navigate(-1)
  }

  const handleSaveDraftAndLeave = () => {
    setSaveStatus('Saved')
    setHasUnsavedChanges(false)
    setShowExitModal(false)
    navigate(-1)
  }

  const handleNext = () => {
    if (!episodeTitle.trim()) {
      setToast('Please enter an episode title.')
      window.setTimeout(() => setToast(''), 2600)
      return
    }

    if (characterCount < MIN_CHARACTERS) {
      setToast('Almost there! Episodes need at least 1,500 characters to publish.')
      window.setTimeout(() => setToast(''), 3000)
      return
    }

    if (characterCount > MAX_CHARACTERS) {
      setToast('This episode is too long. Maximum is 12,000 characters.')
      window.setTimeout(() => setToast(''), 3000)
      return
    }

    setSaveStatus('Saved')
    setHasUnsavedChanges(false)
    navigate(`/author/story/${storyId}/episode/publish`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <Toast message={toast} onClose={() => setToast('')} />

      <UnsavedChangesModal
        open={showExitModal}
        onKeepEditing={() => setShowExitModal(false)}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraftAndLeave}
      />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">First Episode</h1>

          <button
            type="button"
            onClick={handleNext}
            className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
          >
            Next
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-3 gap-2">
            <Step number="1" title="Story Info" />
            <Step number="2" title="First Episode" active />
            <Step number="3" title="Publish" />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
            Episode Title <span className="text-[#e5484d]">*</span>
          </label>
          <input
            value={episodeTitle}
            onChange={handleTitleChange}
            placeholder="Enter episode title"
            className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
          />

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-extrabold text-[#111827]">Episode Cover</div>
                <div className="mt-0.5 text-[11px] text-[#8d94a1]">Optional. If empty, story cover will be used.</div>
              </div>

              <label className="shrink-0 rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleCoverChange(event.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-dashed border-[#cfd4df] bg-[#fafafe]">
              <div className="aspect-[1.42/1] w-full">
                {episodeCover ? (
                  <img src={episodeCover} alt="Episode Cover" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center">
                    <div>
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                        <i className="fa-regular fa-image text-[15px]" />
                      </div>
                      <div className="mt-3 text-[13px] font-extrabold text-[#111827]">Episode Cover</div>
                      <div className="mt-1 text-[11px] text-[#8d94a1]">Horizontal thumbnail</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[#111827]">Write Episode</h2>
              <p className="mt-0.5 text-[11px] text-[#8d94a1]">
                Auto save every 1 minute
              </p>
            </div>

            <div className="rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11px] font-extrabold text-[#555b66]">
              {saveStatus}
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[18px] bg-[#fafafe] p-2">
            <ToolButton icon="fa-solid fa-bold" label="Bold" />
            <ToolButton icon="fa-solid fa-italic" label="Italic" />
            <ToolButton icon="fa-solid fa-minus" label="Divider" />
            <ToolButton icon="fa-regular fa-image" label="Insert image" />
            <div className="mx-1 h-8 w-px bg-[#e5e7eb]" />
            <ToolButton icon="fa-solid fa-rotate-left" label="Undo" />
            <ToolButton icon="fa-solid fa-rotate-right" label="Redo" />
          </div>

          <div className="rounded-[20px] border border-[#d9dde6] bg-white p-3">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your episode..."
              className="min-h-[520px] w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-4 text-[15px] leading-8 text-[#111827] outline-none"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[12px] font-bold text-[#555b66]">
              {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters
            </div>

            <div className="text-[12px] font-bold text-[#8d94a1]">
              {estimatedReadTime}
            </div>
          </div>

          {warningText ? (
            <div className="mt-3 rounded-[16px] bg-[#fff7df] px-4 py-3 text-[12px] font-bold leading-5 text-[#a56a00]">
              {warningText}
            </div>
          ) : null}
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 pb-8">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex h-14 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] shadow-sm active:scale-[0.99]"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isValidForNext}
            className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
          >
            Next
          </button>
        </section>
      </main>
    </div>
  )
}

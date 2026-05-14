import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const languages = ['Khmer', 'English', 'Chinese', 'Japanese', 'Korean']

const genres = [
  'Romance',
  'Fantasy',
  'Action',
  'Adventure',
  'School Life',
  'Comedy',
  'Horror/Thriller',
  'Sci-Fi',
  'Mystery',
  'System/Isekai',
  'Historical',
  'LGBTQ+',
]

const tagOptions = [
  'CEO',
  'Slow Burn',
  'Enemies to Lovers',
  'Time Travel',
  'Revenge',
  'Strong Female Lead',
  'Hidden Identity',
  'Royalty',
  'Magic',
  'Supernatural',
  'Second Chance',
  'Cold Male Lead',
]

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

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
      {children}
      {required ? <span className="ml-1 text-[#e5484d]">*</span> : null}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
    />
  )
}

function SelectInput(props) {
  return (
    <div className="relative">
      <select
        {...props}
        className="h-12 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 pr-10 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
      />
      <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#98a2b3]" />
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

function GenreSheet({ open, value, onClose, onSave }) {
  const [selected, setSelected] = useState(value || 'Romance')
  const [search, setSearch] = useState('')

  if (!open) return null

  const visibleGenres = genres.filter((genre) => genre.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <div className="fixed inset-0 z-[130] bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa]">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h2 className="text-[17px] font-extrabold text-[#111827]">Add Genre</h2>
          <button type="button" onClick={() => onSave(selected)} className="text-[14px] font-extrabold text-[#0b5cff]">
            Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-5 flex h-12 items-center rounded-full bg-[#f2f4f7] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#98a2b3]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Genre"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        <div className="mb-5">
          <div className="text-[14px] font-extrabold text-[#111827]">Please select the genre that best represents your story.</div>
          <div className="mt-2 text-[12px] text-[#667085]">Only one genre can be selected.</div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGenres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelected(genre)}
              className={`flex items-center gap-3 rounded-[16px] px-4 py-3 text-left text-[14px] font-bold ${
                selected === genre ? 'bg-[#111827] text-white' : 'bg-[#fafafe] text-[#111827] ring-1 ring-[#eceaf2]'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  selected === genre ? 'border-white bg-white text-[#111827]' : 'border-[#d0d5dd] bg-white'
                }`}
              >
                {selected === genre ? <i className="fa-solid fa-check text-[10px]" /> : null}
              </span>
              {genre}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

function TagSheet({ open, value, onClose, onSave }) {
  const [selected, setSelected] = useState(value || [])
  const [search, setSearch] = useState('')

  if (!open) return null

  const visibleTags = tagOptions.filter((tag) => tag.toLowerCase().includes(search.trim().toLowerCase()))

  const toggleTag = (tag) => {
    setSelected((current) => {
      if (current.includes(tag)) return current.filter((item) => item !== tag)
      if (current.length >= 6) return current
      return [...current, tag]
    })
  }

  const addCustom = () => {
    const tag = search.trim()
    if (!tag || selected.includes(tag) || selected.length >= 6) return
    setSelected((current) => [...current, tag])
    setSearch('')
  }

  return (
    <div className="fixed inset-0 z-[130] bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa]">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h2 className="text-[17px] font-extrabold text-[#111827]">Add Tags</h2>
          <button type="button" onClick={() => onSave(selected)} className="text-[14px] font-extrabold text-[#0b5cff]">
            Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-4 flex h-12 items-center rounded-full bg-[#f2f4f7] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#98a2b3]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Tag"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="text-[14px] font-extrabold text-[#111827]">Selected ({selected.length}/6)</div>
          <button
            type="button"
            onClick={addCustom}
            disabled={!search.trim() || selected.length >= 6}
            className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[#d0d5dd]"
          >
            + Custom
          </button>
        </div>

        {selected.length ? (
          <div className="mb-7 flex flex-wrap gap-2">
            {selected.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="rounded-full bg-[#111827] px-3 py-1.5 text-[12px] font-bold text-white"
              >
                {tag} ×
              </button>
            ))}
          </div>
        ) : null}

        <div className="mb-3 text-[14px] font-extrabold text-[#111827]">All Tags</div>
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${
                selected.includes(tag) ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

function SlideRow({ slide, index, onDelete, onToggle }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[#eceaf2] bg-white p-3 shadow-sm">
      <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#111827]">
        <img src={slide.preview} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-extrabold text-[#111827]">Slide {index + 1}</div>
        <div className="mt-1 text-[11px] text-[#8d94a1]">Story slide preview</div>
      </div>

      <button type="button" onClick={() => onToggle(index)} className={`rounded-full px-3 py-1.5 text-[10.5px] font-extrabold ${slide.active ? 'bg-[#ecfdf3] text-[#16803c]' : 'bg-[#f2f4f7] text-[#667085]'}`}>
        {slide.active ? 'Active' : 'Inactive'}
      </button>

      <button type="button" onClick={() => onDelete(index)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
        <i className="fa-solid fa-trash text-[12px]" />
      </button>
    </div>
  )
}

export default function CreateStoryPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Khmer')
  const [genre, setGenre] = useState('Romance')
  const [tags, setTags] = useState([])
  const [description, setDescription] = useState('')
  const [isAdult, setIsAdult] = useState(false)
  const [originalAccepted, setOriginalAccepted] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const [slides, setSlides] = useState([])
  const [genreOpen, setGenreOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [message, setMessage] = useState('')

  const descriptionCount = description.length
  const canCreate = title.trim() && genre && originalAccepted && agreementAccepted && descriptionCount <= 5000

  const handleCoverChange = (file) => {
    if (!file) return
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleAddSlides = (event) => {
    const files = Array.from(event.target.files || [])
    const remaining = Math.max(0, 5 - slides.length)
    const nextSlides = files.slice(0, remaining).map((file) => ({
      preview: URL.createObjectURL(file),
      active: true,
    }))

    setSlides((current) => [...current, ...nextSlides])
    event.target.value = ''
  }

  const handleDeleteSlide = (index) => {
    setSlides((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleToggleSlide = (index) => {
    setSlides((current) =>
      current.map((slide, itemIndex) => (itemIndex === index ? { ...slide, active: !slide.active } : slide))
    )
  }

  const handleCreateStory = () => {
    if (!title.trim()) {
      setMessage('Please enter your story title.')
      return
    }

    if (!originalAccepted || !agreementAccepted) {
      setMessage('Please confirm the rights and author agreement.')
      return
    }

    if (descriptionCount > 5000) {
      setMessage('Description is too long. Maximum is 5000 characters.')
      return
    }

    const demoStoryId = Date.now()
    navigate(`/author/story/${demoStoryId}/episode/create`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <GenreSheet
        open={genreOpen}
        value={genre}
        onClose={() => setGenreOpen(false)}
        onSave={(value) => {
          setGenre(value)
          setGenreOpen(false)
        }}
      />

      <TagSheet
        open={tagOpen}
        value={tags}
        onClose={() => setTagOpen(false)}
        onSave={(value) => {
          setTags(value)
          setTagOpen(false)
        }}
      />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95" aria-label="Go back">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Create Story</h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-3 gap-2">
            <Step number="1" title="Story Info" active />
            <Step number="2" title="First Episode" />
            <Step number="3" title="Publish" />
          </div>
        </section>

        {message ? (
          <button type="button" onClick={() => setMessage('')} className="mt-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]">
            {message}
          </button>
        ) : null}

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <FieldLabel required>Book Cover</FieldLabel>
          <div className="grid grid-cols-[112px_1fr] gap-3">
            <label className="flex aspect-[2/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center">
              {coverPreview ? (
                <img src={coverPreview} alt="Book Cover" className="h-full w-full object-cover" />
              ) : (
                <div className="px-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                    <i className="fa-solid fa-upload text-[14px]" />
                  </div>
                  <div className="mt-2 text-[12px] font-extrabold text-[#111827]">Upload Cover</div>
                  <div className="mt-1 text-[10.5px] text-[#8d94a1]">Vertical cover</div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleCoverChange(event.target.files?.[0] || null)} />
            </label>

            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">Story Slides ({slides.length}/5)</div>
                  <div className="mt-0.5 text-[11px] text-[#8d94a1]">Optional, shown on story page</div>
                </div>

                <label className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold ${
                  slides.length >= 5 ? 'bg-[#e5e7eb] text-[#98a2b3]' : 'bg-[#111827] text-white'
                }`}>
                  + Add
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddSlides} disabled={slides.length >= 5} />
                </label>
              </div>

              {slides.length ? (
                <div className="space-y-2">
                  {slides.map((slide, index) => (
                    <SlideRow key={slide.preview} slide={slide} index={index} onDelete={handleDeleteSlide} onToggle={handleToggleSlide} />
                  ))}
                </div>
              ) : (
                <label className="flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                    <i className="fa-solid fa-images text-[15px]" />
                  </div>
                  <div className="mt-3 text-[13px] font-extrabold text-[#111827]">Add Story Slides</div>
                  <div className="mt-1 text-[11px] text-[#8d94a1]">Max 5 images</div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddSlides} />
                </label>
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <FieldLabel required>Story Title</FieldLabel>
          <TextInput value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter story title" />

          <div className="mt-5">
            <FieldLabel required>Story Language</FieldLabel>
            <SelectInput value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </SelectInput>
          </div>

          <div className="mt-5">
            <FieldLabel required>Main Genre</FieldLabel>
            <button type="button" onClick={() => setGenreOpen(true)} className="flex h-12 w-full items-center justify-between rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-left text-[14px] font-semibold text-[#111827]">
              {genre || 'Choose genre'}
              <i className="fa-solid fa-chevron-right text-[12px] text-[#98a2b3]" />
            </button>
          </div>

          <div className="mt-5">
            <FieldLabel>Tags</FieldLabel>
            <button type="button" onClick={() => setTagOpen(true)} className="min-h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-left text-[14px] text-[#111827]">
              {tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#111827] px-2.5 py-1 text-[11px] font-bold text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="font-semibold text-[#98a2b3]">Select up to 6 tags</span>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-[18px] bg-[#fafafe] px-4 py-3">
            <div>
              <div className="text-[13px] font-extrabold text-[#111827]">18+ Story</div>
              <div className="mt-0.5 text-[11px] text-[#8d94a1]">Whole story is adult-only</div>
            </div>
            <Toggle checked={isAdult} onClick={() => setIsAdult((value) => !value)} label="Toggle 18+ story" />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-2 flex items-end justify-between gap-3">
            <FieldLabel>Description</FieldLabel>
            <div className={`text-[11px] font-bold ${descriptionCount > 5000 ? 'text-[#e5484d]' : 'text-[#8d94a1]'}`}>
              {descriptionCount}/5000
            </div>
          </div>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a strong story summary. Recommended 400–1200 characters."
            className="min-h-[180px] w-full resize-none rounded-[18px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] leading-6 text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
          />
        </section>

        <section className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-[18px] bg-white p-4 text-[12px] font-semibold leading-5 text-[#555b66] shadow-sm ring-1 ring-black/5">
            <input type="checkbox" checked={originalAccepted} onChange={(event) => setOriginalAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d1d5db] accent-[#111827]" />
            <span>I confirm this story is my original work and I have the right to publish it.</span>
          </label>

          <label className="flex items-start gap-3 rounded-[18px] bg-white p-4 text-[12px] font-semibold leading-5 text-[#555b66] shadow-sm ring-1 ring-black/5">
            <input type="checkbox" checked={agreementAccepted} onChange={(event) => setAgreementAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d1d5db] accent-[#111827]" />
            <span>
              I agree to the <button type="button" className="font-extrabold text-[#0b5cff]">Shadow Author Agreement.</button>
            </span>
          </label>
        </section>

        <section className="mt-5 pb-8">
          <button
            type="button"
            onClick={handleCreateStory}
            disabled={!canCreate}
            className="flex h-14 w-full items-center justify-center rounded-full bg-[#111827] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af] disabled:opacity-100"
          >
            Create Story
          </button>
        </section>
      </main>
    </div>
  )
}

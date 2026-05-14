import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const storyTypes = ['Novel', 'Manga', 'Chat Story']
const languages = ['Khmer', 'English', 'Chinese', 'Japanese', 'Korean']
const genres = ['Romance', 'Fantasy', 'Action', 'Adventure', 'School Life', 'Comedy', 'Horror/Thriller', 'Sci-Fi', 'Mystery', 'System/Isekai', 'Historical', 'LGBTQ+']
const tagOptions = ['CEO', 'Slow Burn', 'Enemies to Lovers', 'Time Travel', 'Revenge', 'Strong Female Lead', 'Hidden Identity', 'Royalty', 'Magic', 'Supernatural', 'Second Chance', 'Cold Male Lead']

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${active ? 'bg-[#111827] text-white' : 'bg-[#f2f4f7] text-[#667085]'}`}>
        {number}
      </div>
      <div className={`line-clamp-1 text-[12px] font-extrabold ${active ? 'text-[#111827]' : 'text-[#98a2b3]'}`}>{title}</div>
    </div>
  )
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
      {children}{required ? <span className="ml-1 text-[#e5484d]">*</span> : null}
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
    <select
      {...props}
      className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
    />
  )
}

function UploadBox({ title, subtitle, preview, onChange }) {
  return (
    <label className="flex aspect-[2/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center">
      {preview ? (
        <img src={preview} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="px-3">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
            <i className="fa-solid fa-upload text-[15px]" />
          </div>
          <div className="mt-3 text-[13px] font-extrabold text-[#111827]">{title}</div>
          <div className="mt-1 text-[11px] leading-4 text-[#8d94a1]">{subtitle}</div>
        </div>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={(event) => onChange(event.target.files?.[0] || null)} />
    </label>
  )
}

function GenreSheet({ open, value, onClose, onSave }) {
  const [selected, setSelected] = useState(value || 'Romance')
  const [search, setSearch] = useState('')

  if (!open) return null

  const visibleGenres = genres.filter((genre) => genre.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <div className="fixed inset-0 z-[130] bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa]">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h2 className="text-[17px] font-extrabold text-[#111827]">Add Genre</h2>
          <button type="button" onClick={() => onSave(selected)} className="text-[14px] font-extrabold text-[#0b5cff]">Save</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-5 flex h-12 items-center rounded-full bg-[#f2f4f7] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#98a2b3]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Genre" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
        </div>

        <div className="mb-5">
          <div className="text-[14px] font-extrabold text-[#111827]">Please select the main genre that best represents your story.</div>
          <div className="mt-2 text-[12px] text-[#667085]">Only one genre can be selected.</div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {visibleGenres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelected(genre)}
              className={`flex items-center gap-3 rounded-[16px] px-4 py-3 text-left text-[14px] font-bold ${selected === genre ? 'bg-[#111827] text-white' : 'bg-[#fafafe] text-[#111827] ring-1 ring-[#eceaf2]'}`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded border ${selected === genre ? 'border-white bg-white text-[#111827]' : 'border-[#d0d5dd] bg-white'}`}>
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
      if (current.length >= 5) return current
      return [...current, tag]
    })
  }

  const addCustom = () => {
    const tag = search.trim()
    if (!tag || selected.includes(tag) || selected.length >= 5) return
    setSelected((current) => [...current, tag])
    setSearch('')
  }

  return (
    <div className="fixed inset-0 z-[130] bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa]">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h2 className="text-[17px] font-extrabold text-[#111827]">Add Tags</h2>
          <button type="button" onClick={() => onSave(selected)} className="text-[14px] font-extrabold text-[#0b5cff]">Save</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-4 flex h-12 items-center rounded-full bg-[#f2f4f7] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#98a2b3]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Tag" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div className="text-[14px] font-extrabold text-[#111827]">Selected ({selected.length}/5)</div>
          <button type="button" onClick={addCustom} disabled={!search.trim() || selected.length >= 5} className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:opacity-40">
            + Custom
          </button>
        </div>

        {selected.length ? (
          <div className="mb-7 flex flex-wrap gap-2">
            {selected.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)} className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[12px] font-bold text-[#c04444]">
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
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${selected.includes(tag) ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function CreateStoryPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [storyType, setStoryType] = useState(searchParams.get('type') || 'Novel')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Khmer')
  const [genre, setGenre] = useState('Romance')
  const [tags, setTags] = useState([])
  const [description, setDescription] = useState('')
  const [isAdult, setIsAdult] = useState(false)
  const [rightsAccepted, setRightsAccepted] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const [slidePreviews, setSlidePreviews] = useState([])
  const [genreOpen, setGenreOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [message, setMessage] = useState('')

  const descriptionCount = description.length
  const canContinue = title.trim() && genre && rightsAccepted && descriptionCount <= 5000

  const handleCoverChange = (file) => {
    if (!file) return
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSlidesChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5)
    setSlidePreviews(files.map((file) => URL.createObjectURL(file)))
  }

  const handleContinue = () => {
    if (!title.trim()) {
      setMessage('Please enter your story title.')
      return
    }

    if (!rightsAccepted) {
      setMessage('Please confirm that you have the rights to publish this story.')
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
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <GenreSheet open={genreOpen} value={genre} onClose={() => setGenreOpen(false)} onSave={(value) => { setGenre(value); setGenreOpen(false) }} />
      <TagSheet open={tagOpen} value={tags} onClose={() => setTagOpen(false)} onSave={(value) => { setTags(value); setTagOpen(false) }} />

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
          <FieldLabel required>Story Type</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {storyTypes.map((type) => (
              <button key={type} type="button" onClick={() => setStoryType(type)} className={`rounded-[16px] px-3 py-3 text-[12px] font-extrabold active:scale-[0.99] ${storyType === type ? 'bg-[#111827] text-white' : 'bg-[#fafafe] text-[#555b66] ring-1 ring-[#eceaf2]'}`}>
                {type}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <FieldLabel required>Story Title</FieldLabel>
            <TextInput value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter story title" />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <FieldLabel required>Book Cover</FieldLabel>
          <div className="grid grid-cols-[120px_1fr] gap-3">
            <UploadBox title="Upload Cover" subtitle="Vertical cover" preview={coverPreview} onChange={handleCoverChange} />

            <label className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                <i className="fa-solid fa-images text-[15px]" />
              </div>
              <div className="mt-3 text-[13px] font-extrabold text-[#111827]">Story Slides</div>
              <div className="mt-1 text-[11px] text-[#8d94a1]">Optional, max 5</div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleSlidesChange} />
            </label>
          </div>

          {slidePreviews.length ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {slidePreviews.map((slide, index) => (
                <img key={slide} src={slide} alt={`Slide ${index + 1}`} className="h-16 w-28 shrink-0 rounded-[12px] object-cover" />
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <FieldLabel required>Story Language</FieldLabel>
          <SelectInput value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map((item) => <option key={item} value={item}>{item}</option>)}
          </SelectInput>

          <div className="mt-5">
            <FieldLabel required>Main Genre</FieldLabel>
            <button type="button" onClick={() => setGenreOpen(true)} className="flex h-12 w-full items-center justify-between rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-left text-[14px] font-semibold text-[#111827]">
              {genre || 'Choose one genre'}
              <i className="fa-solid fa-chevron-right text-[12px] text-[#98a2b3]" />
            </button>
          </div>

          <div className="mt-5">
            <FieldLabel>Tags</FieldLabel>
            <button type="button" onClick={() => setTagOpen(true)} className="min-h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-left text-[14px] text-[#111827]">
              {tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#555b66] ring-1 ring-[#eceaf2]">{tag}</span>
                  ))}
                </div>
              ) : (
                <span className="font-semibold text-[#98a2b3]">Select up to 5 tags</span>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-[18px] bg-[#fafafe] px-4 py-3">
            <div>
              <div className="text-[13px] font-extrabold text-[#111827]">18+ Story</div>
              <div className="mt-0.5 text-[11px] text-[#8d94a1]">Whole story is adult-only</div>
            </div>
            <button type="button" onClick={() => setIsAdult((value) => !value)} className={`relative h-8 w-14 rounded-full transition ${isAdult ? 'bg-[#e5484d]' : 'bg-[#d0d5dd]'}`} aria-label="Toggle 18+ story">
              <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${isAdult ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-2 flex items-end justify-between gap-3">
            <FieldLabel>Description</FieldLabel>
            <div className={`text-[11px] font-bold ${descriptionCount > 5000 ? 'text-[#e5484d]' : 'text-[#8d94a1]'}`}>{descriptionCount}/5000</div>
          </div>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a strong story summary. Recommended 400–1200 characters."
            className="min-h-[180px] w-full resize-none rounded-[18px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] leading-6 text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
          />
        </section>

        <section className="mt-4">
          <label className="flex items-start gap-3 rounded-[18px] bg-white p-4 text-[12px] font-semibold leading-5 text-[#555b66] shadow-sm ring-1 ring-black/5">
            <input type="checkbox" checked={rightsAccepted} onChange={(event) => setRightsAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d1d5db] accent-[#111827]" />
            <span>I confirm that I own the rights to publish this story.</span>
          </label>
        </section>

        <button type="button" onClick={handleContinue} disabled={!canContinue} className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-[#111827] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45">
          Continue to First Episode
        </button>
      </main>
    </div>
  )
}

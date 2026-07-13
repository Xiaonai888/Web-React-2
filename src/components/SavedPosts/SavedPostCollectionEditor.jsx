import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const COLORS = ['#6D4AFF', '#F6B800', '#E5484D', '#2563EB', '#16A34A', '#111827']

export default function SavedPostCollectionEditor({
  open,
  collection,
  submitting,
  error,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverColor, setCoverColor] = useState('#6D4AFF')

  useEffect(() => {
    if (!open) return

    setName(collection?.name || '')
    setDescription(collection?.description || '')
    setCoverColor(collection?.cover_color || '#6D4AFF')
  }, [collection, open])

  if (!open) return null

  const editing = Boolean(collection)

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      cover_color: coverColor,
    })
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center">
      <button
        type="button"
        onClick={submitting ? undefined : onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        aria-label="Close collection editor"
      />

      <section className="relative z-10 w-full max-w-[560px] rounded-t-[28px] bg-white px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-2xl dark:bg-[#171923]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d9dce4] dark:bg-white/15" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827] dark:text-white">
              {editing ? 'Edit Collection' : 'New Collection'}
            </h2>
            <p className="mt-1 text-[12px] leading-5 text-[#8d94a1] dark:text-white/45">
              Organize saved posts without changing the original post.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 disabled:opacity-50 dark:bg-white/10 dark:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block">
            <span className="text-[11.5px] font-extrabold text-[#4b5563] dark:text-white/65">Collection Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, 80))}
              disabled={submitting}
              placeholder="Example: Inspiration"
              className="mt-2 h-12 w-full rounded-[16px] bg-[#f8f8fb] px-4 text-[13.5px] font-semibold text-[#111827] outline-none ring-1 ring-transparent transition placeholder:text-[#a5aab4] focus:ring-[#6d4aff]/35 disabled:opacity-60 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
              autoFocus
            />
          </label>

          <label className="mt-4 block">
            <span className="text-[11.5px] font-extrabold text-[#4b5563] dark:text-white/65">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value.slice(0, 300))}
              disabled={submitting}
              placeholder="Optional note about this collection"
              rows={3}
              className="mt-2 w-full resize-none rounded-[16px] bg-[#f8f8fb] px-4 py-3 text-[13px] leading-6 text-[#111827] outline-none ring-1 ring-transparent transition placeholder:text-[#a5aab4] focus:ring-[#6d4aff]/35 disabled:opacity-60 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
            />
          </label>

          <div className="mt-4">
            <div className="text-[11.5px] font-extrabold text-[#4b5563] dark:text-white/65">Collection Color</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {COLORS.map((color) => {
                const selected = coverColor === color

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCoverColor(color)}
                    disabled={submitting}
                    className={`h-9 w-9 rounded-full border-[3px] transition active:scale-95 disabled:opacity-60 ${
                      selected
                        ? 'border-white shadow-[0_0_0_2px_#6d4aff] dark:border-[#171923]'
                        : 'border-white shadow-sm ring-1 ring-black/10 dark:border-[#171923] dark:ring-white/10'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Choose ${color}`}
                  />
                )
              })}
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-[14px] bg-[#fff1f1] px-3.5 py-3 text-[12px] font-semibold text-[#e5484d] dark:bg-[#e5484d]/10 dark:text-[#ff8d91]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="mt-5 h-12 w-full rounded-[16px] bg-[#6d4aff] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving...' : editing ? 'Save Collection' : 'Create Collection'}
          </button>
        </form>
      </section>
    </div>
  )
}

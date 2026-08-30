import { useEffect } from 'react'

const FILTER_ROWS = [
  { key: 'status', label: 'Post status', value: 'All posts' },
  { key: 'date', label: 'Date ranges', value: 'Lifetime' },
  { key: 'type', label: 'Post type', value: 'All posts' },
  { key: 'placement', label: 'Placement', value: 'Feed' },
  { key: 'metrics', label: 'Metrics', value: 'Views' },
]

export default function AuthorContentLibraryFilterSheet({
  open,
  onClose,
  onSectionSelect,
}) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200]">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/40"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[760px] rounded-t-[26px] bg-[#f5f6fa] px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 shadow-2xl">
        <div className="mx-auto h-1 w-14 rounded-full bg-[#8b8d93]" />

        <h2 className="py-4 text-center text-[20px] font-bold text-[#111827]">
          Filters
        </h2>

        <div className="overflow-hidden rounded-[18px] bg-white">
          {FILTER_ROWS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onSectionSelect?.(item.key)}
              className="flex w-full items-center gap-4 px-4 py-3 text-left active:bg-[#f3f4f6]"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-medium leading-5 text-[#111827]">
                  {item.label}
                </span>
                <span className="mt-1 block text-[15px] font-normal leading-5 text-[#6b7280]">
                  {item.value}
                </span>
              </span>

              <i className="fa-solid fa-chevron-right text-[20px] text-[#6b7280]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

import { UserRound } from 'lucide-react'

export default function AuthorNoteCard({
  note,
  title = "Author's Note",
  editable = false,
  onEdit,
  className = '',
}) {
  const message = String(note ?? '').trim()
  if (!message) return null

  const cardStyle = {
    color: 'inherit',
    backgroundColor: 'color-mix(in srgb, currentColor 7%, transparent)',
  }
  const cardClass = `w-full rounded-[12px] px-4 py-4 text-left ${className}`
  const cardBody = (
    <>
      <div className="mb-2 flex items-center gap-2">
        <UserRound size={17} strokeWidth={1.7} aria-hidden="true" />
        <span className="text-[14px] font-semibold leading-5">{title}</span>
      </div>
      <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.75]" style={{ overflowWrap: 'anywhere' }}>
        {message}
      </p>
    </>
  )

  if (editable) {
    return (
      <button
        type="button"
        className={cardClass}
        style={cardStyle}
        onClick={onEdit}
        aria-label={`Edit ${title}`}
      >
        {cardBody}
      </button>
    )
  }

  return (
    <aside className={cardClass} style={cardStyle} aria-label={title}>
      {cardBody}
    </aside>
  )
}

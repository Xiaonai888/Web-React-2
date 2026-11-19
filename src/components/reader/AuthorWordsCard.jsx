import { UserRound } from 'lucide-react'

export default function AuthorWordsCard({
  value = '',
  theme = null,
  className = '',
}) {
  const note = typeof value === 'string' ? value.trim() : ''

  if (!note) return null

  return (
    <aside
      aria-label="Author Words"
      className={`mt-6 rounded-[16px] border px-4 py-4 ${theme?.soft || 'bg-[#f3f4f6]'} ${theme?.border || 'border-[#e5e7eb]'} ${theme?.text || 'text-[#24201b]'} ${className}`}
    >
      <div className={`flex items-center gap-2 text-[12px] font-semibold ${theme?.muted || 'text-[#8a8175]'}`}>
        <UserRound size={16} strokeWidth={1.7} aria-hidden="true" />
        <span>Author Words</span>
      </div>
      <p className="mt-3 whitespace-pre-wrap break-words text-[14px] font-normal leading-7">
        {note}
      </p>
    </aside>
  )
}

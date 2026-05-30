function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(/\.0$/, '')}m`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`

  return String(number)
}

export default function ReaderBottomActionBar({ visible, story, episode, onOpenComments }) {
  const likeCount = formatCompactNumber(episode?.like_count || episode?.likes_count || story?.like_count || story?.likes_count || 0)
  const viewCount = formatCompactNumber(episode?.view_count || episode?.views || episode?.read_count || story?.view_count || story?.views || story?.read_count || 0)
  const commentCount = formatCompactNumber(episode?.comment_count || episode?.comments_count || story?.comment_count || story?.comments_count || 0)
  const echoCount = formatCompactNumber(episode?.echo_count || episode?.echoes_count || story?.echo_count || story?.echoes_count || 0)

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[80] border-t border-[#e5e7eb] bg-white/95 px-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_30px_rgba(17,24,39,0.08)] backdrop-blur transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between border-b border-[#eef0f4] py-2 text-[11px] font-semibold text-[#111827]">
          <div className="flex items-center gap-1.5">
            <i className="fa-regular fa-heart text-[13px]" />
            <span>{likeCount}</span>
          </div>

          <div className="flex items-center gap-4 text-[10.5px] text-[#111827]">
            <span>{viewCount} views</span>
            <span>{commentCount} comments</span>
            <span>{echoCount} echo</span>
          </div>
        </div>

        <div className="grid grid-cols-3 py-2 text-[12px] font-bold text-[#111827]">
          <button type="button" className="flex h-9 items-center justify-center gap-2 active:scale-95">
            <i className="fa-regular fa-heart text-[15px]" />
            <span>Like</span>
          </button>

          <button type="button" onClick={onOpenComments} className="flex h-9 items-center justify-center gap-2 active:scale-95">
            <i className="fa-regular fa-comment text-[15px]" />
            <span>Comments</span>
          </button>

          <button type="button" className="flex h-9 items-center justify-center gap-2 active:scale-95">
            <i className="fa-solid fa-rotate text-[14px]" />
            <span>Echo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

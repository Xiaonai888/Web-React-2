const THEME_COLORS = {
  novel: '#111827',
  manga: '#FE526E',
  chat_story: '#7C4DEA',
}

export default function CompletedStoryConfirmModal({
  open,
  storyType = 'novel',
  onCancel,
  onConfirm,
}) {
  if (!open) return null

  const activeColor =
    THEME_COLORS[storyType] ||
    THEME_COLORS.novel

  return (
    <div
      className="fixed inset-0 z-[260] flex items-center justify-center bg-black/40 px-5"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[360px] rounded-[18px] bg-white px-5 pb-5 pt-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-center text-[17px] font-bold text-[#111827]">
          Mark story as completed?
        </h2>

        <p className="mt-3 text-center text-[12.5px] font-normal leading-6 text-[#667085]">
          Readers will see this story as completed. You can change it back to Ongoing later.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-semibold text-[#111827] active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{ backgroundColor: activeColor }}
            className="h-12 rounded-full text-[13px] font-semibold text-white active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

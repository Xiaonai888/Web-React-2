export default function LatestCommentSection({ onOpenComments }) {
  return (
    <section className="mt-2 bg-white p-4 shadow-sm sm:mt-4 sm:rounded-[28px] sm:ring-1 sm:ring-black/5 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-black text-[#111827]">Comments</h2>
          <p className="mt-1 text-[12px] font-semibold text-[#98a2b3]">Latest reader comment</p>
        </div>

        <button
          type="button"
          onClick={onOpenComments}
          className="rounded-full bg-[#f5f3fa] px-4 py-2 text-[12px] font-extrabold text-[#111827] active:scale-95"
        >
          View All
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenComments}
        className="flex w-full gap-3 rounded-[22px] bg-[#f8fafc] p-4 text-left active:scale-[0.995]"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white">
          R
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-black text-[#111827]">Reader</div>
            <div className="text-[11px] font-semibold text-[#98a2b3]">Just now</div>
          </div>

          <p className="mt-1 line-clamp-2 text-[12.5px] font-medium leading-5 text-[#667085]">
            This comment section is ready for UI preview. Real comments can be connected after the story detail design is finished.
          </p>
        </div>
      </button>
    </section>
  )
}

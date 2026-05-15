export default function CommentsModal({ open, story, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[150] bg-[#f5f3fa]">
      <header className="sticky top-0 z-10 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h2 className="text-[16px] font-black text-[#111827]">Comments</h2>
            <p className="line-clamp-1 text-[11px] font-semibold text-[#98a2b3]">{story?.title}</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4">
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white">
                  U{item}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-black text-[#111827]">Reader {item}</div>
                  <div className="mt-0.5 text-[11px] font-semibold text-[#98a2b3]">Demo comment</div>
                  <p className="mt-2 text-[13px] font-medium leading-6 text-[#555b66]">
                    This is a simple comment preview page. We will connect real comment API later.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white"
        >
          Comment API coming soon
        </button>
      </main>
    </div>
  )
}

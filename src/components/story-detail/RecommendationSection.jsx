function EmptyCard({ title, text, icon }) {
  return (
    <div className="rounded-[22px] bg-[#f8fafc] p-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
        <i className={`${icon} text-[18px]`} />
      </div>
      <div className="mt-3 text-[14px] font-black text-[#111827]">{title}</div>
      <div className="mt-1 text-[12px] font-semibold leading-5 text-[#98a2b3]">{text}</div>
    </div>
  )
}

export default function RecommendationSection() {
  return (
    <section className="mt-2 space-y-2 sm:mt-4 sm:space-y-4">
      <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-black text-[#111827]">Other work by same author</h2>
          <span className="text-[11px] font-extrabold text-[#98a2b3]">Soon</span>
        </div>
        <EmptyCard
          icon="fa-solid fa-pen-nib"
          title="Author works coming soon"
          text="This section will show more stories from the same author after the API is ready."
        />
      </div>

      <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-black text-[#111827]">You Might Like</h2>
          <span className="text-[11px] font-extrabold text-[#98a2b3]">Soon</span>
        </div>
        <EmptyCard
          icon="fa-regular fa-compass"
          title="Similar stories coming soon"
          text="This section will show stories with similar genre or tags after the API is ready."
        />
      </div>
    </section>
  )
}

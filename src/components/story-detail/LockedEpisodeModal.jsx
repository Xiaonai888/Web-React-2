function methodLabel(method) {
  if (method === 'gem') return 'Gem'
  if (method === 'voucher') return 'Voucher'
  if (method === 'story_card') return 'Story Card'
  if (method === 'free_item') return 'Free Item'
  return method
}

export default function LockedEpisodeModal({ episode, onClose }) {
  if (!episode) return null

  const methods = Array.isArray(episode.unlock_methods) && episode.unlock_methods.length
    ? episode.unlock_methods
    : ['gem', 'voucher', 'story_card', 'free_item']

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close"
      />

      <section className="relative w-full max-w-[460px] rounded-[30px] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7ed] text-[#f97316]">
          <i className="fa-solid fa-lock text-[26px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827]">
          Episode {episode.episode_number || ''} is locked
        </h2>

        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
          This episode can be unlocked later by Gem, Voucher, Story Card, or Free Item. Unlock system is coming soon.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {methods.map((method) => (
            <div key={method} className="rounded-[18px] bg-[#f8fafc] px-3 py-4">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                <i className="fa-solid fa-gem text-[13px]" />
              </div>
              <div className="text-[12px] font-black text-[#111827]">{methodLabel(method)}</div>
              <div className="mt-0.5 text-[10.5px] font-bold text-[#98a2b3]">Coming soon</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
        >
          Got it
        </button>
      </section>
    </div>
  )
}

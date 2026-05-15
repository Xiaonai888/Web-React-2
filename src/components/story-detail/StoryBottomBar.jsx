export default function StoryBottomBar({ subscribed, onToggleSubscribe, episode, onRead }) {
  const label = episode && Number(episode.episode_number || 0) > 1
    ? `Continue Ep. ${episode.episode_number}`
    : 'Read Now'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(17,24,39,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-[56px_1fr] gap-3">
        <button
          type="button"
          onClick={onToggleSubscribe}
          className={`flex h-14 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 active:scale-95 ${
            subscribed ? 'bg-[#fff1f1] text-[#e5484d]' : 'bg-[#f5f3fa] text-[#111827]'
          }`}
          aria-label="Subscribe"
        >
          <i className={`${subscribed ? 'fa-solid' : 'fa-regular'} fa-heart text-[20px]`} />
        </button>

        <button
          type="button"
          onClick={onRead}
          disabled={!episode}
          className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[15px] font-black text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
        >
          <i className="fa-solid fa-book-open mr-2 text-[14px]" />
          {episode ? label : 'No Episode'}
        </button>
      </div>
    </div>
  )
}

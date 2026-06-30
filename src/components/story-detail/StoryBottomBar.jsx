export default function StoryBottomBar({ subscribed, onToggleSubscribe, episode, onRead }) {
  const label = episode && Number(episode.episode_number || 0) > 1
    ? `Continue Ep. ${episode.episode_number}`
    : 'Read Now'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 pb-4 pt-5 before:absolute before:-top-10 before:left-0 before:right-0 before:h-10 before:bg-gradient-to-t before:from-white before:to-transparent before:content-[''] sm:border-t sm:border-black/5 sm:py-3">
      <div className="relative mx-auto grid max-w-5xl grid-cols-[48px_1fr] gap-2">
        <button
          type="button"
          onClick={onToggleSubscribe}
          className={`flex h-12 items-center justify-center rounded-full ring-1 ring-black/5 active:scale-95 ${
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
          className="flex h-12 items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
        >
          <i className="fa-solid fa-book-open mr-2 text-[14px]" />
          {episode ? label : 'No Episode'}
        </button>
      </div>
    </div>
  )
}

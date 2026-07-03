export default function StoryBottomBar({ subscribed, onToggleSubscribe, episode, onRead }) {
  const label = episode && Number(episode.episode_number || 0) > 1
    ? `Continue Ep. ${episode.episode_number}`
    : 'Read Now'

  return (
    <div className="fixed bottom-[3px] left-0 right-0 z-50 px-4 pb-[14px] pt-7 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-[96px] before:bg-[linear-gradient(to_top,#fff_0%,rgba(255,255,255,0.96)_45%,rgba(255,255,255,0.55)_72%,rgba(255,255,255,0)_100%)] before:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[28px] after:h-[48px] after:bg-white after:content-['']">
      <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-[44px_1fr] gap-2">
        <button
          type="button"
          onClick={onToggleSubscribe}
          className={`flex h-11 items-center justify-center rounded-full ring-1 ring-black/5 active:scale-95 ${
            subscribed ? 'bg-[#fff1f1] text-[#e5484d]' : 'bg-[#f5f3fa] text-[#111827]'
          }`}
          aria-label="Subscribe"
        >
          <i className={`${subscribed ? 'fa-solid' : 'fa-regular'} fa-heart text-[18px]`} />
        </button>

        <button
          type="button"
          onClick={onRead}
          disabled={!episode}
          className="flex h-11 items-center justify-center rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
        >
          <i className="fa-solid fa-book-open mr-2 text-[13px]" />
          {episode ? label : 'No Episode'}
        </button>
      </div>
    </div>
  )
}

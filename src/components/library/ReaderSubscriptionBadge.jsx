export default function ReaderSubscriptionBadge({
  unreadCount = 0,
  label = 'Unread episodes',
  showUpdateLabel = true,
}) {
  const count = Math.max(0, Math.floor(Number(unreadCount) || 0))
  if (!count) return null

  return (
    <>
      {showUpdateLabel ? (
        <span className="pointer-events-none absolute left-0 top-0 z-10 rounded-br-[7px] bg-[#F6B800] px-2 py-1 text-[10px] font-extrabold leading-none text-[#111827]">
          UP
        </span>
      ) : null}
      <span
        className="pointer-events-none absolute bottom-[-5px] right-[5px] z-20 w-[42px]"
        style={{ transform: 'rotate(7deg)' }}
        aria-label={`${label}: ${count}`}
        role="img"
      >
        <img src="/assets/Icons/Arrow.webp" alt="" className="block h-auto w-full" />
        <span className="absolute left-[68%] top-[43%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] font-black leading-none text-[#ff3b30]">
          {count >= 10 ? '9+' : `+${count}`}
        </span>
      </span>
    </>
  )
}

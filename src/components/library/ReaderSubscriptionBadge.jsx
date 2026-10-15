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
      <div
        className="pointer-events-none absolute z-20"
        style={{
          width: 'min(42px, 25%)',
          right: '3%',
          bottom: '-2%',
          transform: 'rotate(7deg)',
        }}
        aria-label={`${label}: ${count}`}
        role="img"
      >
        <img
          src="/assets/Icons/Arrow.webp"
          alt=""
          className="block h-auto w-full"
        />
        <span
          className="absolute whitespace-nowrap font-black leading-none text-[#ff3b30]"
          style={{
            left: '68%',
            top: '43%',
            fontSize: 'clamp(8px, 1.6vw, 12px)',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {count >= 10 ? '9+' : `+${count}`}
        </span>
      </div>
    </>
  )
}

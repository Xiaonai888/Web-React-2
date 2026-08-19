import { useRef, useState } from 'react'
function getPointerY(event) {
  return event.clientY
}
function ShareButton({ label, icon, iconClass = '', onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-[74px] shrink-0 flex-col items-center gap-2 text-center">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full text-[20px] ${iconClass}`}><i className={icon} /></span>
      <span className="text-[11px] font-normal text-[#111827]">{label}</span>
    </button>
  )
}

export default function AuthorPageShareSheet({
  open,
  pageName,
  pageLink,
  sheetTitle = 'Share Page',
  shareText: customShareText = '',
  zClassName = 'z-[280]',
  onClose,
  onCopied,
}) {
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  if (!open) return null
  const shareText =
  customShareText || `View ${pageName} on Shadow.`
  const encodedText = encodeURIComponent(`${shareText} ${pageLink}`)
  const encodedUrl = encodeURIComponent(pageLink)
  const openShareUrl = (url) => window.open(url, '_blank', 'noopener,noreferrer')

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageLink)
      onCopied?.()
      onClose?.()
    } catch {
      onCopied?.(pageLink)
    }
  }

  async function moreShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: pageName, text: shareText, url: pageLink })
        onClose?.()
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    await copyLink()
  }

  function handleDragStart(event) {
  if (!event.isPrimary) return

  draggingRef.current = true
  setDragging(true)
  startYRef.current = getPointerY(event)
  currentYRef.current = getPointerY(event)
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function handleDragMove(event) {
  if (!draggingRef.current) return

  currentYRef.current = getPointerY(event)
  setDragOffset(
    Math.max(0, currentYRef.current - startYRef.current)
  )
}

function handleDragEnd() {
  if (!draggingRef.current) return

  const distance = Math.max(
    0,
    currentYRef.current - startYRef.current
  )

  draggingRef.current = false
  setDragging(false)

  if (distance > 70) {
    setDragOffset(0)
    onClose?.()
    return
  }

  setDragOffset(0)
}
  
  return (
    <div className={`fixed inset-0 ${zClassName} flex items-end justify-center bg-black/35`} onClick={onClose}>
      <section
  className="w-full rounded-t-[24px] bg-[#f7f7f8] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-3 shadow-2xl md:max-w-[560px]"
  style={{
    transform: `translateY(${dragOffset}px)`,
    transition: dragging
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
  }}
  onClick={(event) => event.stopPropagation()}
>
        <div
  onPointerDown={handleDragStart}
  onPointerMove={handleDragMove}
  onPointerUp={handleDragEnd}
  onPointerCancel={handleDragEnd}
  className="touch-none cursor-grab py-1 active:cursor-grabbing"
>
  <div className="mx-auto h-1.5 w-10 rounded-full bg-[#b9bec6]" />
</div>
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <h2 className="text-[17px] font-bold text-[#111827]">{sheetTitle}</h2>
          
        </div>
        <div className="overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-1">
            <ShareButton label="Text" icon="fa-regular fa-comment-dots" iconClass="bg-[#0a84ff] text-white" onClick={() => { window.location.href = `sms:?&body=${encodedText}` }} />
            <ShareButton label="WhatsApp" icon="fa-brands fa-whatsapp" iconClass="bg-[#25d366] text-white" onClick={() => openShareUrl(`https://wa.me/?text=${encodedText}`)} />
            <ShareButton label="Facebook" icon="fa-brands fa-facebook-f" iconClass="bg-[#1877f2] text-white" onClick={() => openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)} />
            <ShareButton label="X" icon="fa-brands fa-x-twitter" iconClass="bg-black text-white" onClick={() => openShareUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`)} />
            <ShareButton label="Telegram" icon="fa-brands fa-telegram" iconClass="bg-[#229ed9] text-white" onClick={() => openShareUrl(`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`)} />
            <ShareButton label="Copy link" icon="fa-solid fa-link" iconClass="bg-white text-[#111827]" onClick={copyLink} />
            <ShareButton label="More" icon="fa-solid fa-ellipsis" iconClass="bg-white text-[#111827]" onClick={moreShare} />
          </div>
        </div>
      </section>
    </div>
  )
}

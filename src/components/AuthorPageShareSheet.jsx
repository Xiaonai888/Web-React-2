function ShareButton({ label, icon, iconClass = '', onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-[74px] shrink-0 flex-col items-center gap-2 text-center">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full text-[20px] ${iconClass}`}><i className={icon} /></span>
      <span className="text-[11px] font-normal text-[#111827]">{label}</span>
    </button>
  )
}

export default function AuthorPageShareSheet({ open, pageName, pageLink, onClose, onCopied }) {
  if (!open) return null
  const shareText = `View ${pageName} on Shadow.`
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

  return (
    <div className="fixed inset-0 z-[280] flex items-end justify-center bg-black/35" onClick={onClose}>
      <section className="w-full rounded-t-[24px] bg-[#f7f7f8] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-3 shadow-2xl md:max-w-[560px]" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#b9bec6]" />
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <h2 className="text-[17px] font-bold text-[#111827]">Share Page</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6b7280]" aria-label="Close share"><i className="fa-solid fa-xmark text-[13px]" /></button>
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

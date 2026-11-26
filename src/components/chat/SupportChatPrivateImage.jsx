import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Image, LoaderCircle, X } from 'lucide-react'
import { getMySupportImage } from '../../services/readerSupportChatApi'

export default function SupportChatPrivateImage({ messageId, labels, onLayout }) {
  const boxRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [src, setSrc] = useState('')
  const [failed, setFailed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const node = boxRef.current
    if (!node || visible) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '100px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const controller = new AbortController()
    let objectUrl = ''
    setFailed(false)
    setSrc('')
    async function load() {
      try {
        const { url } = await getMySupportImage(messageId, { signal: controller.signal })
        const response = await fetch(url, { signal: controller.signal, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer', cache: 'no-store' })
        if (!response.ok) throw new Error('Image unavailable')
        const blob = await response.blob()
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(blob.type) || blob.size > 2 * 1024 * 1024 || blob.size < 32) throw new Error('Invalid image')
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      } catch {
        if (!controller.signal.aborted) setFailed(true)
      }
    }
    void load()
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [visible, messageId, attempt])

  useEffect(() => {
    if (!expanded) return
    const close = event => { if (event.key === 'Escape') setExpanded(false) }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [expanded])

  return (
    <div ref={boxRef} className="mt-1.5 w-[220px] max-w-full">
      {src && !failed ? (
        <button type="button" aria-label={labels.image} onClick={event => { event.stopPropagation(); setExpanded(true) }} className="block w-full overflow-hidden rounded-xl">
          <img src={src} alt={labels.image} onLoad={onLayout} onError={() => setFailed(true)} className="max-h-[280px] w-full object-contain" />
        </button>
      ) : (
        <button type="button" disabled={visible && !failed} onClick={event => { event.stopPropagation(); if (failed) setAttempt(n => n + 1); else setVisible(true) }} className="flex min-h-[110px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--shadow-bg-soft)] px-2 text-[11px] text-[var(--shadow-text-secondary)]">
          {visible && !failed ? <LoaderCircle size={18} className="animate-spin" /> : <Image size={18} />}
          {failed ? labels.retry : labels.image}
        </button>
      )}
      {expanded && src && createPortal(
        <div role="dialog" aria-modal="true" aria-label={labels.image} className="fixed inset-0 z-[220] flex items-center justify-center bg-black/90 p-4" onClick={() => setExpanded(false)}>
          <button type="button" aria-label={labels.close} onClick={() => setExpanded(false)} className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white"><X size={24} /></button>
          <img src={src} alt={labels.image} onClick={event => event.stopPropagation()} className="max-h-[90dvh] max-w-full object-contain" />
        </div>, document.body
      )}
    </div>
  )
}

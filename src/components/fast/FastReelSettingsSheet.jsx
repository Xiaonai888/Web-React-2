import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownToLine,
  Download,
  Flag,
  Gauge,
  HeartOff,
  Scan,
  Volume2,
  VolumeX,
} from 'lucide-react'

// REPLACE: src/components/fast/FastReelSettingsSheet.jsx
// Fast-only appearance update. Keep the existing parent props and real action handlers.
const PLAYBACK_RATES = [0.5, 1, 1.5, 2]

// Isolate the sheet from Shadow's global Dark Mode styles.
// TikTok-like palette: pale gray sheet, white cards, pale gray speed track.
const forcedLightStyles = `
  #shadow-fast-settings {
    background-color: #f3f4f6 !important;
    color: #18181b !important;
    color-scheme: light;
  }
  #shadow-fast-settings .fast-settings-card {
    background-color: #ffffff !important;
  }
  #shadow-fast-settings .fast-settings-action {
    color: #18181b !important;
    background-color: transparent !important;
  }
  #shadow-fast-settings .fast-settings-action:active {
    background-color: #f9fafb !important;
  }
  #shadow-fast-settings .fast-settings-divider {
    background-color: #f0f1f3 !important;
  }
  #shadow-fast-settings .fast-settings-speed-track {
    background-color: #f2f2f3 !important;
  }
  #shadow-fast-settings .fast-settings-speed {
    background-color: transparent !important;
    color: #77777c !important;
  }
  #shadow-fast-settings .fast-settings-speed[aria-pressed="true"] {
    background-color: #ffffff !important;
    color: #18181b !important;
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
  }
  #shadow-fast-settings .fast-settings-switch[data-on="true"] {
    background-color: #000000 !important;
  }
  #shadow-fast-settings .fast-settings-switch[data-on="false"] {
    background-color: #dedfe2 !important;
  }
  #shadow-fast-settings .fast-settings-switch-knob {
    background-color: #ffffff !important;
  }
`


function Switch({ checked }) {
  return (
    <span
      aria-hidden="true"
      data-on={checked ? 'true' : 'false'}
      className="fast-settings-switch relative inline-block h-7 w-12 shrink-0 rounded-full transition-colors"
      style={{
        backgroundColor: checked ? '#000000' : '#d1d5db',
      }}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </span>
  )
}


function Action({ icon: Icon, children, onClick, trailing, role, checked }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === 'switch' ? Boolean(checked) : undefined}
      onClick={onClick}
      className="fast-settings-action flex min-h-[62px] w-full items-center gap-3 rounded-xl px-5 text-left text-[15px] font-medium transition-colors"
    >
      <Icon size={22} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1">{children}</span>
      {trailing || null}
    </button>
  )
}

export default function FastReelSettingsSheet({
  open,
  onClose,
  t,
  soundEnabled,
  setSoundEnabled,
  speed,
  setSpeed,
  canDownload = false,
  onDownload,
  onNotInterested,
  onReport,
  clearDisplay = false,
  onClearDisplay,
  autoScroll = false,
  onAutoScrollChange,
}) {
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dragRef = useRef(null)

  useEffect(() => {
    if (!open) {
      dragRef.current = null
      setDragging(false)
      setDragY(0)
      return undefined
    }
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const handleDragStart = (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY }
    setDragging(true)
    setDragY(0)
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* not supported */ }
  }

  const handleDragMove = (event) => {
    const gesture = dragRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    setDragY(Math.max(0, Math.min(420, event.clientY - gesture.startY)))
  }

  const finishDrag = (event, cancelled = false) => {
    const gesture = dragRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    const distance = Math.max(0, event.clientY - gesture.startY)
    dragRef.current = null
    setDragging(false)
    if (!cancelled && distance > 75) {
      setDragY(0)
      onClose?.()
    } else {
      setDragY(0)
    }
  }

  if (!open) return null

  const showDownload = canDownload && typeof onDownload === 'function'
  const showNotInterested = typeof onNotInterested === 'function'
  const showReport = typeof onReport === 'function'
  const showActions = showDownload || showNotInterested || showReport
  const showClear = typeof onClearDisplay === 'function'
  const showAutoScroll = typeof onAutoScrollChange === 'function'

  return (
    <div className="fixed inset-0 z-[200000] flex items-end justify-center" role="presentation">
      <style>{forcedLightStyles}</style>
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label={t('fastReels.close')}
        onClick={onClose}
      />
      <section
        id="shadow-fast-settings"
        role="dialog"
        aria-modal="true"
        aria-label={t('fastReels.settings')}
        className="relative flex max-h-[85dvh] w-full max-w-[580px] flex-col overflow-hidden rounded-t-[26px] px-3 pb-[calc(14px+env(safe-area-inset-bottom))] shadow-2xl"
        style={{
          backgroundColor: '#f3f4f6',
          color: '#18181b',
          colorScheme: 'light',
          transform: `translate3d(0, ${dragY}px, 0)`,
          transition: dragging ? 'none' : 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Pull this handle down to dismiss; tapping controls remains unaffected. */}
        <div
          className="flex h-5 shrink-0 touch-none cursor-grab items-start justify-center pt-1.5 active:cursor-grabbing"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={finishDrag}
          onPointerCancel={(event) => finishDrag(event, true)}
          aria-hidden="true"
        >
          <span className="h-[5px] w-11 rounded-full bg-[#c7c9cf]" />
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain pb-1" style={{ scrollbarWidth: 'none' }}>
          {showActions ? (
            <div className="fast-settings-card mb-3 overflow-hidden rounded-[20px]">
              {showDownload ? (
                <Action icon={Download} onClick={onDownload}>Download</Action>
              ) : null}
              {showDownload && (showNotInterested || showReport) ? <div className="fast-settings-divider mx-5 h-px" /> : null}
              {showNotInterested ? (
                <Action icon={HeartOff} onClick={() => { onNotInterested(); onClose?.() }}>
                  Not interested
                </Action>
              ) : null}
              {showNotInterested && showReport ? <div className="fast-settings-divider mx-5 h-px" /> : null}
              {showReport ? (
                <Action icon={Flag} onClick={() => { onClose?.(); onReport() }}>Report</Action>
              ) : null}
            </div>
          ) : null}

          <div className="fast-settings-card overflow-hidden rounded-[20px]">
            <div className="flex min-h-[70px] items-center gap-2 px-5">
              <Gauge size={22} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
              <span className="shrink-0 text-[15px] font-semibold">Speed</span>
              <div className="fast-settings-speed-track ml-auto grid min-w-0 flex-1 grid-cols-4 gap-0.5 rounded-xl p-1 sm:max-w-[310px]">
                {PLAYBACK_RATES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value.toFixed(1)} times speed`}
                    aria-pressed={speed === value}
                    onClick={() => setSpeed(value)}
                    className="fast-settings-speed min-w-0 rounded-[9px] px-0.5 py-2 text-[12px] font-medium transition-colors sm:text-[13px]"
                  >
                    {value.toFixed(1)}×
                  </button>
                ))}
              </div>
            </div>

            {showClear ? (
              <>
                <Action icon={Scan} onClick={() => { onClearDisplay(); onClose?.() }}>
                  Clear display
                </Action>
              </>
            ) : null}
            {showAutoScroll ? (
              <Action
                icon={ArrowDownToLine}
                role="switch"
                checked={autoScroll}
                onClick={() => onAutoScrollChange(!autoScroll)}
                trailing={<Switch checked={autoScroll} />}
              >
                Auto scroll
              </Action>
            ) : null}

            <Action
              icon={soundEnabled ? Volume2 : VolumeX}
              role="switch"
              checked={soundEnabled}
              onClick={() => setSoundEnabled((value) => !value)}
              trailing={<Switch checked={soundEnabled} />}
            >
              {t('fastReels.autoplaySound')}
            </Action>
          </div>
        </div>
      </section>
    </div>
  )
}

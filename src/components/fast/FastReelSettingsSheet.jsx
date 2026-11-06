import { useEffect } from 'react'
import {
  ArrowDownToLine,
  Download,
  Flag,
  Gauge,
  HeartOff,
  Scan,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

// REPLACE: src/components/fast/FastReelSettingsSheet.jsx
// This sheet has its own light palette so the global Dark Mode cannot hide its text.
// Existing Auto sound and Speed work with the current FastReelsPage.jsx.
// Additional Reel actions appear only after their real handlers are connected.
const PLAYBACK_RATES = [0.5, 1, 1.5, 2]

const forcedLightStyles = `
  #shadow-fast-settings {
    background: #ffffff !important;
    color: #191919 !important;
    color-scheme: light;
  }
  #shadow-fast-settings .fast-settings-ink,
  #shadow-fast-settings .fast-settings-ink * {
    color: #191919 !important;
  }
  #shadow-fast-settings .fast-settings-card {
    background: #f4f4f5 !important;
  }
  #shadow-fast-settings .fast-settings-rule {
    background: #e5e7eb !important;
  }
  #shadow-fast-settings .fast-settings-speed {
    background: #ffffff !important;
    color: #414141 !important;
  }
  #shadow-fast-settings .fast-settings-speed[aria-pressed="true"] {
    background: #7c3aed !important;
    color: #ffffff !important;
  }
  #shadow-fast-settings .fast-settings-switch[data-on="true"] {
    background: #7c3aed !important;
  }
  #shadow-fast-settings .fast-settings-switch[data-on="false"] {
    background: #d1d5db !important;
  }
`

function Switch({ checked }) {
  return (
    <span
      aria-hidden="true"
      data-on={checked ? 'true' : 'false'}
      className="fast-settings-switch relative inline-block h-7 w-12 shrink-0 rounded-full transition-colors"
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
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
      className="fast-settings-ink flex min-h-14 w-full items-center gap-3 rounded-xl px-4 text-left text-[14px] font-medium active:bg-black/5"
    >
      <Icon size={21} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
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
  // New actions: the parent passes these after wiring to actual Reel logic.
  canDownload = false,
  onDownload,
  onNotInterested,
  onReport,
  clearDisplay = false,
  onClearDisplay,
  autoScroll = false,
  onAutoScrollChange,
}) {
  useEffect(() => {
    if (!open) return undefined
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
        className="absolute inset-0 bg-black/50"
        aria-label={t('fastReels.close')}
        onClick={onClose}
      />
      <section
        id="shadow-fast-settings"
        role="dialog"
        aria-modal="true"
        aria-label={t('fastReels.settings')}
        className="relative max-h-[85dvh] w-full max-w-[580px] overflow-y-auto rounded-t-[24px] px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{ backgroundColor: '#ffffff', color: '#191919', colorScheme: 'light' }}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d1d5db]" />
        <div className="fast-settings-ink mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold">{t('fastReels.settings')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]"
            aria-label={t('fastReels.close')}
          >
            <X size={18} />
          </button>
        </div>

        {showActions ? (
          <div className="fast-settings-card mb-3 overflow-hidden rounded-[18px]">
            {showDownload ? (
              <Action icon={Download} onClick={onDownload}>Download</Action>
            ) : null}
            {showDownload && (showNotInterested || showReport) ? <div className="fast-settings-rule mx-4 h-px" /> : null}
            {showNotInterested ? (
              <Action icon={HeartOff} onClick={() => { onNotInterested(); onClose?.() }}>
                Not interested
              </Action>
            ) : null}
            {showNotInterested && showReport ? <div className="fast-settings-rule mx-4 h-px" /> : null}
            {showReport ? (
              <Action icon={Flag} onClick={() => { onClose?.(); onReport() }}>Report</Action>
            ) : null}
          </div>
        ) : null}

        <div className="fast-settings-card overflow-hidden rounded-[18px]">
          <div className="fast-settings-ink flex min-h-14 items-center gap-3 px-4">
            <Gauge size={21} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
            <span className="flex-1 text-[14px] font-medium">{t('fastReels.speed')}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 px-4 pb-4">
            {PLAYBACK_RATES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={speed === value}
                onClick={() => setSpeed(value)}
                className="fast-settings-speed rounded-[10px] py-2.5 text-[13px] font-semibold transition-colors"
              >
                {value.toFixed(1)}×
              </button>
            ))}
          </div>

          {showClear ? (
            <>
              <div className="fast-settings-rule mx-4 h-px" />
              <Action icon={Scan} onClick={() => { onClearDisplay(); onClose?.() }}>
                Clear display
              </Action>
            </>
          ) : null}
          {showAutoScroll ? (
            <>
              <div className="fast-settings-rule mx-4 h-px" />
              <Action
                icon={ArrowDownToLine}
                role="switch"
                checked={autoScroll}
                onClick={() => onAutoScrollChange(!autoScroll)}
                trailing={<Switch checked={autoScroll} />}
              >
                Auto scroll
              </Action>
            </>
          ) : null}

          <div className="fast-settings-rule mx-4 h-px" />
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
      </section>
    </div>
  )
}

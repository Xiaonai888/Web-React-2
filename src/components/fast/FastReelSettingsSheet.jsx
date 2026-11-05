import { useEffect } from 'react'
import { Volume2, VolumeX, X } from 'lucide-react'

const PLAYBACK_RATES = [0.5, 1, 1.5, 2]

export default function FastReelSettingsSheet({ open, onClose, t, soundEnabled, setSoundEnabled, speed, setSpeed }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center" role="presentation">
      <button type="button" className="absolute inset-0 bg-black/45" aria-label={t('fastReels.close')} onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-label={t('fastReels.settings')}
        className="relative w-full max-w-[580px] rounded-t-[22px] bg-white px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2 text-[#202124] shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-gray-300" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-bold">{t('fastReels.settings')}</h2>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100" aria-label={t('fastReels.close')}><X size={18}/></button>
        </div>
        <button type="button" role="switch" aria-checked={soundEnabled} onClick={() => setSoundEnabled(v => !v)}
          className="flex min-h-14 w-full items-center justify-between rounded-xl px-2 text-left active:bg-gray-100">
          <span className="flex items-center gap-3 text-sm font-medium">
            {soundEnabled ? <Volume2 size={21}/> : <VolumeX size={21}/>}
            {t('fastReels.autoplaySound')}
          </span>
          <span className={`relative h-7 w-12 rounded-full transition-colors ${soundEnabled ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </span>
        </button>
        <div className="mt-2 border-t border-gray-100 pt-4">
          <p className="mb-3 text-sm font-semibold">{t('fastReels.speed')}</p>
          <div className="grid grid-cols-4 gap-2">
            {PLAYBACK_RATES.map(value => (
              <button key={value} type="button" aria-pressed={speed === value} onClick={() => setSpeed(value)}
                className={`rounded-xl py-3 text-[13px] font-semibold transition-colors ${speed === value ? 'bg-[#7c3aed] text-white' : 'bg-[#f2f3f5] text-[#444]'}`}>
                {value.toFixed(1)}×
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


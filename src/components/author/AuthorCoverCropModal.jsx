import Cropper from 'react-easy-crop'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import useOverlayScrollLock from '../../hooks/useOverlayScrollLock'

export default function AuthorCoverCropModal({
  open,
  image,
  mode,
  crop,
  zoom,
  croppedAreaPixels,
  saving,
  message,
  messageVisible,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  const { t } = useDisplayTranslation()
  useOverlayScrollLock(open)

  if (!open) return null

  const isAvatar = mode === 'avatar'

  return (
    <div className="fixed inset-0 z-[270] flex items-center justify-center bg-black/40 px-3 py-3 sm:px-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isAvatar ? t('authorPublicPage.cropProfilePhoto') : t('authorPublicPage.cropCoverPhoto')}
        className="mx-auto w-full max-w-[560px] max-h-[calc(100dvh-24px)] overflow-y-auto overscroll-contain rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
              {isAvatar ? t('authorPublicPage.cropProfilePhoto') : t('authorPublicPage.cropCoverPhoto')}
            </h2>
            <p className="mt-1 text-[11.5px] leading-4 text-[var(--shadow-text-secondary)]">
              {t('authorPublicPage.cropHelp')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] disabled:opacity-60"
            aria-label={t('authorPublicPage.closeCropEditor')}
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        {message ? (
          <div className={`mb-3 rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] font-medium text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)] transition-all duration-300 ${messageVisible ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}>
            {message}
          </div>
        ) : null}

        <div className={`${isAvatar ? 'h-[min(78vw,360px)] min-h-[240px]' : 'h-[min(54vw,270px)] min-h-[190px]'} relative mx-auto w-full overflow-hidden rounded-[22px] bg-[#111827]`}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={isAvatar ? 1 : 16 / 7}
            cropShape={isAvatar ? 'round' : 'rect'}
            showGrid={false}
            restrictPosition={false}
            objectFit="contain"
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[var(--shadow-text-secondary)]">
            <span>{t('authorPublicPage.zoom')}</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="w-full accent-[#111827]"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-12 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] disabled:opacity-60 active:scale-[0.99]"
          >
            {t('authorPublicPage.cancel')}
          </button>
          <button
            type="button"
            onClick={() => onSave(croppedAreaPixels)}
            disabled={saving}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? t('authorPublicPage.saving') : t('authorPublicPage.saveCrop')}
          </button>
        </div>
      </div>
    </div>
  )
}
